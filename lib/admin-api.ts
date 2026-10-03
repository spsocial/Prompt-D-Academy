'use client';
// All admin reads/writes (client SDK — firestore.rules only lets isAdmin users write).
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, writeBatch, query, orderBy, limit, serverTimestamp, getCountFromServer, where,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase/client';
import { firebaseConfigured } from './firebase/config';
import { SEED_COURSES, SEED_LESSONS, SEED_PROMOS, SEED_SETTINGS } from './seed';
import { parseVideoLink, slugify } from './utils';
import type { CommentDoc, Course, Lesson, Promo, SiteSettings, UserDoc } from './types';

export const DEMO = !firebaseConfigured;
const demoBlock = () => { throw new Error('โหมดตัวอย่าง: เชื่อม Firebase ก่อนจึงจะบันทึกได้'); };
const ms = (v: unknown) => (v && typeof v === 'object' && 'toMillis' in v ? (v as { toMillis: () => number }).toMillis() : (v as number | undefined));

/** ล้าง cache หน้าเว็บหลังแก้ข้อมูล (ISR) — ส่ง ID token ไปยืนยันว่าเป็นแอดมิน */
export async function revalidate(paths: string[]) {
  if (DEMO) return;
  try {
    const token = await auth().currentUser?.getIdToken();
    await fetch('/api/revalidate', { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify({ paths }) });
  } catch (e) { console.warn('revalidate failed', e); }
}

// ───────── courses ─────────
export async function listCourses(): Promise<Course[]> {
  if (DEMO) return SEED_COURSES;
  const s = await getDocs(collection(db(), 'courses'));
  return s.docs.map((d) => ({ ...(d.data() as Course), slug: d.id, createdAt: ms(d.data().createdAt), updatedAt: ms(d.data().updatedAt) }))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
export async function getCourseAdmin(slug: string): Promise<Course | null> {
  if (DEMO) return SEED_COURSES.find((c) => c.slug === slug) ?? null;
  const d = await getDoc(doc(db(), 'courses', slug));
  return d.exists() ? ({ ...(d.data() as Course), slug: d.id }) : null;
}
export async function saveCourse(c: Course, originalSlug?: string) {
  if (DEMO) demoBlock();
  const slug = slugify(c.slug || c.title);
  const { slug: _s, createdAt: _c, updatedAt: _u, ...data } = c;
  void _s; void _c; void _u;
  if (originalSlug && originalSlug !== slug) {
    // เปลี่ยน slug → ย้ายบทเรียนไปเอกสารใหม่
    const lessons = await getDocs(collection(db(), 'courses', originalSlug, 'lessons'));
    const b = writeBatch(db());
    b.set(doc(db(), 'courses', slug), { ...data, createdAt: c.createdAt ?? serverTimestamp(), updatedAt: serverTimestamp() });
    lessons.docs.forEach((l) => { b.set(doc(db(), 'courses', slug, 'lessons', l.id), l.data()); b.delete(l.ref); });
    b.delete(doc(db(), 'courses', originalSlug));
    await b.commit();
  } else {
    const exists = (await getDoc(doc(db(), 'courses', slug))).exists();
    await setDoc(doc(db(), 'courses', slug), { ...data, updatedAt: serverTimestamp(), ...(exists ? {} : { createdAt: serverTimestamp() }) }, { merge: true });
  }
  await revalidate(['/', '/courses', `/courses/${slug}`, ...(originalSlug && originalSlug !== slug ? [`/courses/${originalSlug}`] : [])]);
  return slug;
}
export async function deleteCourse(slug: string) {
  if (DEMO) demoBlock();
  const lessons = await getDocs(collection(db(), 'courses', slug, 'lessons'));
  const b = writeBatch(db());
  lessons.docs.forEach((l) => b.delete(l.ref));
  b.delete(doc(db(), 'courses', slug));
  await b.commit();
  await revalidate(['/', '/courses']);
  return true;
}
export async function reorderCourses(slugs: string[]) {
  if (DEMO) demoBlock();
  const b = writeBatch(db());
  slugs.forEach((s, i) => b.update(doc(db(), 'courses', s), { order: i + 1 }));
  await b.commit();
  await revalidate(['/', '/courses']);
}

// ───────── lessons ─────────
export async function listLessons(slug: string): Promise<Lesson[]> {
  if (DEMO) return SEED_LESSONS[slug] ?? [];
  const s = await getDocs(query(collection(db(), 'courses', slug, 'lessons'), orderBy('order')));
  return s.docs.map((d) => ({ ...(d.data() as Lesson), id: d.id, updatedAt: ms(d.data().updatedAt) }));
}
export async function getLessonAdmin(slug: string, id: string): Promise<Lesson | null> {
  if (DEMO) return (SEED_LESSONS[slug] ?? []).find((l) => l.id === id) ?? null;
  const d = await getDoc(doc(db(), 'courses', slug, 'lessons', id));
  return d.exists() ? ({ ...(d.data() as Lesson), id: d.id }) : null;
}
/** อัปเดตจำนวนบท/เวลารวมของคอร์ส ให้ตรงกับบทเรียนที่เผยแพร่ */
async function recount(slug: string) {
  const ls = await listLessons(slug);
  const pub = ls.filter((l) => l.published);
  await updateDoc(doc(db(), 'courses', slug), { lessonCount: pub.length, totalMinutes: pub.reduce((s, l) => s + (Number(l.durationMin) || 0), 0), updatedAt: serverTimestamp() });
}
export async function saveLesson(courseSlug: string, l: Lesson) {
  if (DEMO) demoBlock();
  const id = l.id || doc(collection(db(), 'courses', courseSlug, 'lessons')).id;
  const slug = slugify(l.slug || l.title);
  const { id: _i, updatedAt: _u, ...data } = l;
  void _i; void _u;
  if (data.order == null || data.order === 999) data.order = (await listLessons(courseSlug)).length + 1;
  await setDoc(doc(db(), 'courses', courseSlug, 'lessons', id), { ...data, slug, updatedAt: serverTimestamp() }, { merge: true });
  await recount(courseSlug);
  await revalidate(['/', '/courses', `/courses/${courseSlug}`, `/courses/${courseSlug}/${slug}`]);
  return id;
}
export async function deleteLesson(courseSlug: string, id: string) {
  if (DEMO) demoBlock();
  await deleteDoc(doc(db(), 'courses', courseSlug, 'lessons', id));
  await recount(courseSlug);
  await revalidate([`/courses/${courseSlug}`]);
  return true;
}
export async function reorderLessons(courseSlug: string, ids: string[]) {
  if (DEMO) demoBlock();
  const b = writeBatch(db());
  ids.forEach((id, i) => b.update(doc(db(), 'courses', courseSlug, 'lessons', id), { order: i + 1 }));
  await b.commit();
  await revalidate([`/courses/${courseSlug}`]);
}

// ───────── users (ฐานข้อมูลลูกค้าเดิม) ─────────
export async function listUsers(): Promise<UserDoc[]> {
  if (DEMO) return [
    { uid: 'demo1', email: 'somchai@example.com', displayName: 'สมชาย ใจดี', provider: 'google', isActive: true, package: 'allinone', createdAt: Date.now() - 4e9 },
    { uid: 'demo2', email: 'nida@example.com', displayName: 'นิดา', provider: 'email', isActive: true, package: 'free', createdAt: Date.now() - 2e9, isAdmin: true },
    { uid: 'demo3', email: 'k.wut@example.com', displayName: 'วุฒิ', provider: 'email', isActive: false, needsApproval: true, package: 'basic', createdAt: Date.now() - 9e9 },
  ];
  const s = await getDocs(collection(db(), 'users'));
  return s.docs.map((d) => ({ ...(d.data() as UserDoc), uid: d.id, createdAt: ms(d.data().createdAt), lastLogin: ms(d.data().lastLogin) }));
}
export async function updateUser(uid: string, patch: Partial<UserDoc>) {
  if (DEMO) demoBlock();
  await updateDoc(doc(db(), 'users', uid), patch);
}

// ───────── comments ─────────
export async function listComments(n = 200): Promise<CommentDoc[]> {
  if (DEMO) return [{ id: 'c1', courseSlug: 'claude-code-video', lessonId: 'ccv-01', uid: 'demo1', name: 'สมชาย ใจดี', text: 'ติดตั้งบน Windows แล้วขึ้น error ต้องทำยังไงครับ', createdAt: Date.now() - 36e5 }];
  const s = await getDocs(query(collection(db(), 'comments'), orderBy('createdAt', 'desc'), limit(n)));
  return s.docs.map((d) => ({ ...(d.data() as CommentDoc), id: d.id, createdAt: ms(d.data().createdAt) ?? 0 }));
}
export async function setCommentHidden(id: string, hidden: boolean) { if (DEMO) demoBlock(); await updateDoc(doc(db(), 'comments', id), { hidden }); }
export async function deleteComment(id: string) { if (DEMO) demoBlock(); await deleteDoc(doc(db(), 'comments', id)); }

// ───────── promos / settings ─────────
export async function listPromos(): Promise<Promo[]> {
  if (DEMO) return SEED_PROMOS;
  const s = await getDocs(collection(db(), 'promos'));
  return s.docs.map((d) => ({ ...(d.data() as Promo), id: d.id })).sort((a, b) => a.order - b.order);
}
export async function savePromo(p: Promo) {
  if (DEMO) demoBlock();
  const id = p.id || doc(collection(db(), 'promos')).id;
  const { id: _i, ...data } = p; void _i;
  await setDoc(doc(db(), 'promos', id), data);
  await revalidate(['/']);
  return id;
}
export async function deletePromo(id: string) { if (DEMO) demoBlock(); await deleteDoc(doc(db(), 'promos', id)); await revalidate(['/']); }

export async function getSettingsAdmin(): Promise<SiteSettings> {
  if (DEMO) return SEED_SETTINGS;
  const d = await getDoc(doc(db(), 'settings', 'site'));
  return d.exists() ? (d.data() as SiteSettings) : {};
}
export async function saveSettings(s: SiteSettings) {
  if (DEMO) demoBlock();
  await setDoc(doc(db(), 'settings', 'site'), s, { merge: true });
  await revalidate(['/', '/courses', '/contact']);
}

// ───────── stats ─────────
export async function getStats() {
  if (DEMO) return { users: 1284, courses: SEED_COURSES.length, lessons: Object.values(SEED_LESSONS).flat().length, comments: 37, newUsers7d: 46 };
  const c = (q: Parameters<typeof getCountFromServer>[0]) => getCountFromServer(q).then((r) => r.data().count).catch(() => 0);
  const weekAgo = new Date(Date.now() - 7 * 864e5);
  const [users, courses, comments, newUsers7d] = await Promise.all([
    c(collection(db(), 'users')), c(collection(db(), 'courses')), c(collection(db(), 'comments')), c(query(collection(db(), 'users'), where('createdAt', '>=', weekAgo))),
  ]);
  const lessons = (await listCourses()).reduce((s, x) => s + (x.lessonCount || 0), 0);
  return { users, courses, lessons, comments, newUsers7d };
}

// ───────── uploads ─────────
export function uploadFile(path: string, file: File, onProgress?: (pct: number) => void): Promise<string> {
  if (DEMO) return Promise.reject(new Error('โหมดตัวอย่าง: เชื่อม Firebase ก่อนจึงจะอัปโหลดได้'));
  const r = ref(storage(), `${path}/${Date.now()}-${file.name.replace(/[^\w.\-ก-๙]+/g, '_')}`);
  const task = uploadBytesResumable(r, file, { contentType: file.type, cacheControl: 'public, max-age=31536000' });
  return new Promise((resolve, reject) => {
    task.on('state_changed', (s) => onProgress?.(Math.round((s.bytesTransferred / s.totalBytes) * 100)), reject, async () => resolve(await getDownloadURL(task.snapshot.ref)));
  });
}

// ───────── legacy import (เว็บเวอร์ชันเก่า: aiTools → courses) ─────────
type LegacyTool = { name: string; description?: string; imageUrl?: string; requiredPackage?: string; order?: number; videos?: { id: string; title: string; driveId?: string; duration?: string; order?: number; description?: string }[] };
const durToMin = (d?: string) => { if (!d) return 0; const p = d.split(':').map(Number); return p.length === 3 ? p[0] * 60 + p[1] : p[0] || 0; };

export async function previewLegacy() {
  if (DEMO) return { tools: [] as { id: string; name: string; videos: number; imported: boolean }[] };
  const s = await getDocs(collection(db(), 'aiTools'));
  const existing = new Set((await getDocs(collection(db(), 'courses'))).docs.map((x) => x.id));
  return { tools: s.docs.map((d) => ({ id: d.id, name: (d.data() as LegacyTool).name, videos: ((d.data() as LegacyTool).videos ?? []).length, imported: existing.has(slugify(d.id)) })) };
}
export async function importLegacy(opts: { publish: boolean; access: 'free' | 'member'; ids?: string[] }) {
  if (DEMO) demoBlock();
  const s = await getDocs(collection(db(), 'aiTools'));
  let n = 0;
  for (const d of s.docs) {
    if (opts.ids && !opts.ids.includes(d.id)) continue;
    const t = d.data() as LegacyTool;
    const slug = slugify(d.id);
    if ((await getDoc(doc(db(), 'courses', slug))).exists()) continue; // ไม่ทับของที่มีอยู่
    const vids = [...(t.videos ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const b = writeBatch(db());
    b.set(doc(db(), 'courses', slug), {
      title: t.name, subtitle: t.description ?? '', description: t.description ? `<p>${t.description}</p>` : '', cover: t.imageUrl ?? null,
      category: 'ai-basics', level: 'beginner', tags: [], tools: [t.name], access: opts.access, published: opts.publish, featured: false,
      order: t.order ?? 999, lessonCount: vids.length, totalMinutes: vids.reduce((m, v) => m + durToMin(v.duration), 0), createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    vids.forEach((v, i) => b.set(doc(db(), 'courses', slug, 'lessons', v.id || `l${i + 1}`), {
      slug: slugify(v.id || v.title), title: v.title, summary: v.description ?? '', video: v.driveId ? parseVideoLink(v.driveId) : { type: 'none' },
      durationMin: durToMin(v.duration), content: v.description ? `<p>${v.description}</p>` : '', resources: [], order: i + 1, published: opts.publish, access: opts.access, updatedAt: serverTimestamp(),
    }));
    await b.commit(); n++;
  }
  await revalidate(['/', '/courses']);
  return n;
}
export async function importSeed(slugs?: string[]) {
  if (DEMO) demoBlock();
  for (const c of SEED_COURSES) {
    if (slugs && !slugs.includes(c.slug)) continue;
    if ((await getDoc(doc(db(), 'courses', c.slug))).exists()) continue;
    const { slug, ...data } = c;
    const b = writeBatch(db());
    b.set(doc(db(), 'courses', slug), { ...data, published: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    (SEED_LESSONS[slug] ?? []).forEach(({ id, ...l }) => b.set(doc(db(), 'courses', slug, 'lessons', id), { ...l, updatedAt: serverTimestamp() }));
    await b.commit();
  }
  await revalidate(['/', '/courses']);
}

// ───────── course package (.json) — ไฟล์คอร์สที่ผลิตไว้ล่วงหน้า ─────────
export type CoursePackage = { course: Partial<Course> & { slug: string; title: string }; lessons: (Partial<Lesson> & { title: string })[] };
export async function importPackage(pkg: CoursePackage, opts: { publish: boolean; mode: 'new' | 'append' }) {
  if (DEMO) demoBlock();
  if (!pkg?.course?.title || !Array.isArray(pkg.lessons)) throw new Error('ไฟล์ไม่ถูกต้อง: ต้องมี course และ lessons');
  const slug = slugify(pkg.course.slug || pkg.course.title);
  const ref = doc(db(), 'courses', slug);
  const exists = (await getDoc(ref)).exists();
  if (exists && opts.mode === 'new') throw new Error(`มีคอร์ส /${slug} อยู่แล้ว — เลือกโหมด "เพิ่มบทเรียนเข้าคอร์สเดิม" แทน`);
  const start = exists ? (await listLessons(slug)).length : 0;
  const b = writeBatch(db());
  if (!exists) {
    const { slug: _s, ...c } = pkg.course; void _s;
    b.set(ref, { subtitle: '', description: '', category: 'ai-basics', level: 'beginner', tags: [], tools: [], access: 'free', featured: false, order: 999,
      ...c, published: opts.publish, lessonCount: 0, totalMinutes: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
  pkg.lessons.forEach((l, i) => {
    const id = doc(collection(db(), 'courses', slug, 'lessons')).id;
    b.set(doc(db(), 'courses', slug, 'lessons', id), {
      slug: slugify(l.slug || l.title), title: l.title, summary: l.summary ?? '', video: l.video ?? { type: 'none' }, durationMin: l.durationMin ?? 0,
      content: l.content ?? '', resources: l.resources ?? [], order: start + i + 1, published: opts.publish, access: l.access ?? 'free', updatedAt: serverTimestamp(),
    });
  });
  await b.commit();
  await recount(slug);
  await revalidate(['/', '/courses', `/courses/${slug}`]);
  return { slug, added: pkg.lessons.length };
}
