// Server-side reads (Server Components / sitemap / OG). Uses the lightweight Firestore Lite SDK.
// Content collections are public-read in firestore.rules, so no service account is needed.
import 'server-only';
import { cache } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore/lite';
import { firebaseConfig, firebaseConfigured } from './firebase/config';
import { SEED_COURSES, SEED_LESSONS, SEED_PROMOS, SEED_SETTINGS } from './seed';
import type { Course, Lesson, Promo, SiteSettings } from './types';

const APP_NAME = 'server-lite';
const fs = () => getFirestore(getApps().some((a) => a.name === APP_NAME) ? getApp(APP_NAME) : initializeApp(firebaseConfig, APP_NAME));

/** Firestore Timestamp → epoch ms (recursive, shallow enough for our docs) */
function plain<T>(v: unknown): T {
  if (v && typeof v === 'object') {
    if ('toMillis' in (v as object) && typeof (v as { toMillis: unknown }).toMillis === 'function') return (v as { toMillis: () => number }).toMillis() as T;
    if (Array.isArray(v)) return v.map((x) => plain(x)) as T;
    return Object.fromEntries(Object.entries(v as object).map(([k, x]) => [k, plain(x)])) as T;
  }
  return v as T;
}

const normCourse = (slug: string, d: Record<string, unknown>): Course => ({
  slug,
  title: '', subtitle: '', description: '', category: 'ai-basics', level: 'beginner', tags: [], tools: [],
  access: 'free', published: false, featured: false, order: 999, lessonCount: 0, totalMinutes: 0,
  ...plain<Partial<Course>>(d),
});
const normLesson = (id: string, d: Record<string, unknown>): Lesson => ({
  id, slug: id, title: '', summary: '', video: { type: 'none' }, durationMin: 0, content: '', resources: [],
  order: 999, published: false, access: 'free',
  ...plain<Partial<Lesson>>(d),
});

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!firebaseConfigured) return fallback;
  try { return await fn(); } catch (e) { console.error('[data]', e); return fallback; }
}

export const isDemo = !firebaseConfigured;

export const getCourses = cache(async (): Promise<Course[]> =>
  safe(async () => {
    const snap = await getDocs(query(collection(fs(), 'courses'), where('published', '==', true)));
    return snap.docs.map((d) => normCourse(d.id, d.data())).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'th'));
  }, SEED_COURSES.filter((c) => c.published)),
);

export const getCourse = cache(async (slug: string): Promise<Course | null> =>
  safe(async () => {
    const d = await getDoc(doc(fs(), 'courses', slug));
    if (!d.exists()) return null;
    const c = normCourse(d.id, d.data());
    return c.published ? c : null;
  }, SEED_COURSES.find((c) => c.slug === slug && c.published) ?? null),
);

export const getLessons = cache(async (slug: string): Promise<Lesson[]> =>
  safe(async () => {
    const snap = await getDocs(query(collection(fs(), 'courses', slug, 'lessons'), orderBy('order')));
    return snap.docs.map((d) => normLesson(d.id, d.data())).filter((l) => l.published);
  }, (SEED_LESSONS[slug] ?? []).filter((l) => l.published)),
);

export const getPromos = cache(async (placement: Promo['placement']): Promise<Promo[]> =>
  safe(async () => {
    const snap = await getDocs(query(collection(fs(), 'promos'), where('active', '==', true)));
    return snap.docs.map((d) => ({ id: d.id, ...plain<Omit<Promo, 'id'>>(d.data()) }))
      .filter((p) => p.placement === placement || p.placement === 'all').sort((a, b) => a.order - b.order);
  }, SEED_PROMOS.filter((p) => p.active && (p.placement === placement || p.placement === 'all'))),
);

export const getSettings = cache(async (): Promise<SiteSettings> =>
  safe(async () => {
    const d = await getDoc(doc(fs(), 'settings', 'site'));
    return d.exists() ? plain<SiteSettings>(d.data()) : {};
  }, SEED_SETTINGS),
);

export async function getLatestLessons(n = 6) {
  const courses = await getCourses();
  const all = await Promise.all(courses.map(async (c) => (await getLessons(c.slug)).map((l) => ({ ...l, course: c }))));
  return all.flat().sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0) || a.order - b.order).slice(0, n);
}
