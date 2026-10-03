'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, GripVertical, Save, ExternalLink, Loader2, PlayCircle, Lock, HardDrive, FileVideo, Ban } from 'lucide-react';
import { deleteCourse, getCourseAdmin, listLessons, reorderLessons, saveCourse } from '@/lib/admin-api';
import { CATEGORIES, LEVELS, SITE, fmtMinutes } from '@/lib/config';
import { slugify, excerpt, cn } from '@/lib/utils';
import type { Course, Lesson, Level } from '@/lib/types';
import { Card, ConfirmButton, Field, ImageDrop, PageHeader, Segmented, StatusPill, TagInput, Toggle, inputCls, useAction } from '@/components/admin/ui';
import { RichEditor } from '@/components/admin/rich-editor';
import { YouTubeIcon as Youtube } from '@/components/ui/brand-icons';

const blank = (): Course => ({
  slug: '', title: '', subtitle: '', description: '', category: CATEGORIES[0].key, level: 'beginner', tags: [], tools: [],
  access: 'free', published: false, featured: false, order: 999, lessonCount: 0, totalMinutes: 0,
});

const VIcon = { youtube: Youtube, drive: HardDrive, file: FileVideo, none: Ban };

export default function CourseEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = use(params);
  const orig = decodeURIComponent(raw);
  const isNew = orig === 'new';
  const router = useRouter();
  const [c, setC] = useState<Course | null>(isNew ? blank() : null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [drag, setDrag] = useState<number | null>(null);
  const { busy, run } = useAction();

  useEffect(() => {
    if (isNew) return;
    getCourseAdmin(orig).then((x) => setC(x ?? blank()));
    listLessons(orig).then(setLessons);
  }, [orig, isNew]);

  if (!c) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;
  const set = <K extends keyof Course>(k: K, v: Course[K]) => setC((x) => (x ? { ...x, [k]: v } : x));

  const save = async () => {
    if (!c.title.trim()) return run(async () => { throw new Error('ใส่ชื่อคอร์สก่อน'); });
    const slug = await run(() => saveCourse({ ...c, slug: c.slug || slugify(c.title) }, isNew ? undefined : orig), 'บันทึกคอร์สแล้ว');
    if (slug && (isNew || slug !== orig)) router.replace(`/admin/courses/${encodeURIComponent(slug)}`);
  };
  const move = (from: number, to: number) => setLessons((x) => { const a = [...x]; const [m] = a.splice(from, 1); a.splice(to, 0, m); return a; });
  const seoTitle = c.seoTitle || `${c.title || 'ชื่อคอร์ส'} — สอนฟรี`;
  const seoDesc = c.seoDescription || c.subtitle || excerpt(c.description) || 'คำอธิบายคอร์สจะแสดงตรงนี้ใน Google';

  return (
    <>
      <Link href="/admin/courses" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"><ArrowLeft className="size-4" />คอร์สทั้งหมด</Link>
      <PageHeader title={isNew ? 'สร้างคอร์สใหม่' : c.title || 'แก้ไขคอร์ส'} sub={!isNew && <span className="flex items-center gap-2"><StatusPill on={c.published} /><span className="font-mono text-xs">/courses/{orig}</span></span>}
        actions={<>
          {!isNew && c.published && <Link href={`/courses/${orig}`} target="_blank" className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm"><ExternalLink className="size-4" />ดูหน้าเว็บ</Link>}
          <button onClick={save} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-full bg-signal px-5 text-sm font-semibold text-white disabled:opacity-60">{busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}บันทึก</button>
        </>} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-6">
          <Card>
            <div className="grid gap-5">
              <Field label="ชื่อคอร์ส"><input className={cn(inputCls, 'h-13 text-lg font-semibold')} value={c.title} onChange={(e) => { set('title', e.target.value); if (!slugTouched) set('slug', slugify(e.target.value)); }} placeholder="เช่น ใช้ Claude Code ทำคลิปอลังการ" /></Field>
              <Field label="คำโปรยสั้นๆ (แสดงใต้ชื่อ)"><input className={inputCls} value={c.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="เรียนจบแล้วได้อะไร ใน 1 ประโยค" /></Field>
              <Field label="ลิงก์ (URL)" hint={`${SITE.url}/courses/${c.slug || '…'}`}>
                <input className={cn(inputCls, 'font-mono text-sm')} value={c.slug} onChange={(e) => { setSlugTouched(true); set('slug', e.target.value); }} onBlur={() => set('slug', slugify(c.slug || c.title))} />
              </Field>
            </div>
          </Card>

          {!isNew && (
            <Card title={`บทเรียน (${lessons.length})`} desc="ลากเพื่อเรียงลำดับ · คลิกเพื่อแก้ไข อัปคลิป หรือเขียนสรุป">
              <ul className="space-y-2">
                {lessons.map((l, i) => {
                  const VI = VIcon[l.video?.type ?? 'none'];
                  return (
                    <li key={l.id} draggable onDragStart={() => setDrag(i)} onDragOver={(e) => { e.preventDefault(); if (drag !== null && drag !== i) { move(drag, i); setDrag(i); } }}
                      onDragEnd={() => { setDrag(null); run(() => reorderLessons(orig, lessons.map((x) => x.id)), 'บันทึกลำดับบทเรียนแล้ว'); }}
                      className={cn('flex items-center gap-3 rounded-xl border border-line bg-bg p-2 pr-3 transition', drag === i && 'opacity-50 ring-2 ring-orange')}>
                      <GripVertical className="size-4 shrink-0 cursor-grab text-muted" />
                      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                      <Link href={`/admin/courses/${encodeURIComponent(orig)}/lessons/${l.id}`} className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{l.title || 'ไม่มีชื่อ'}</span>
                        <span className="flex items-center gap-2 font-mono text-[11px] text-muted"><VI className="size-3" />{l.video?.type === 'none' ? 'ยังไม่มีคลิป' : l.video?.type}<span>· {fmtMinutes(l.durationMin)}</span>{l.access === 'member' && <Lock className="size-3" />}</span>
                      </Link>
                      <StatusPill on={l.published} />
                    </li>
                  );
                })}
              </ul>
              <Link href={`/admin/courses/${encodeURIComponent(orig)}/lessons/new`} className="mt-3 flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line-strong text-sm font-medium text-fg-2 transition hover:border-orange hover:text-orange">
                <Plus className="size-4" />เพิ่มบทเรียน
              </Link>
            </Card>
          )}

          <Card title="รายละเอียดคอร์ส" desc="แสดงในหน้าคอร์ส — เขียนว่าเรียนแล้วได้อะไร เหมาะกับใคร (ช่วย SEO)">
            <RichEditor value={c.description} onChange={(v) => set('description', v)} folder={`courses/${c.slug || 'new'}`} placeholder="คอร์สนี้เหมาะกับใคร เรียนจบแล้วทำอะไรได้…" />
          </Card>

          <Card title="SEO — หน้าตาบน Google" desc="เว้นว่างได้ ระบบจะใช้ชื่อและคำโปรยให้อัตโนมัติ">
            <div className="rounded-xl border border-line bg-bg p-4">
              <p className="truncate text-xs text-muted">{SITE.url.replace(/^https?:\/\//, '')} › courses › {c.slug}</p>
              <p className="mt-1 truncate text-lg text-[#8ab4f8]">{seoTitle}</p>
              <p className="mt-0.5 line-clamp-2 text-sm text-fg-2">{seoDesc}</p>
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="หัวข้อบน Google" hint={`${seoTitle.length}/60 ตัวอักษร`}><input className={inputCls} value={c.seoTitle ?? ''} onChange={(e) => set('seoTitle', e.target.value)} placeholder={seoTitle} /></Field>
              <Field label="คำอธิบายบน Google" hint={`${seoDesc.length}/155 ตัวอักษร`}><textarea className={cn(inputCls, 'h-auto py-2.5')} rows={2} value={c.seoDescription ?? ''} onChange={(e) => set('seoDescription', e.target.value)} placeholder={seoDesc} /></Field>
            </div>
          </Card>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card title="การแสดงผล">
            <div className="space-y-3">
              <Toggle checked={c.published} onChange={(v) => set('published', v)} label="เผยแพร่บนเว็บ" desc="ปิดไว้ = ฉบับร่าง ผู้เรียนไม่เห็น" />
              <Toggle checked={c.featured} onChange={(v) => set('featured', v)} label="คอร์สแนะนำ" desc="แสดงในหน้าแรก" />
              <div className="pt-2"><p className="mb-2 text-sm font-medium text-fg-2">ใครดูได้</p>
                <Segmented value={c.access} onChange={(v) => set('access', v)} options={[{ value: 'free', label: 'ทุกคน (ฟรี)' }, { value: 'member', label: 'สมาชิก' }]} /></div>
            </div>
          </Card>
          <Card title="ภาพปก"><ImageDrop value={c.cover} onChange={(v) => set('cover', v)} folder={`covers/${c.slug || 'new'}`} /></Card>
          <Card title="หมวดหมู่ & ระดับ">
            <div className="grid gap-4">
              <Field label="หมวดหมู่"><select className={inputCls} value={c.category} onChange={(e) => set('category', e.target.value)}>{CATEGORIES.map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}</select></Field>
              <Field label="ระดับ"><Segmented<Level> value={c.level} onChange={(v) => set('level', v)} options={(Object.keys(LEVELS) as Level[]).map((l) => ({ value: l, label: LEVELS[l].label }))} /></Field>
              <Field label="เครื่องมือที่ใช้" hint="พิมพ์แล้วกด Enter"><TagInput value={c.tools} onChange={(v) => set('tools', v)} placeholder="Claude, Kling…" /></Field>
              <Field label="คำค้น / แท็ก"><TagInput value={c.tags} onChange={(v) => set('tags', v)} placeholder="ทำคลิป, AI Video…" /></Field>
            </div>
          </Card>
          {!isNew && (
            <Card title="โซนอันตราย">
              <p className="mb-3 text-sm text-muted">ลบคอร์สและบทเรียนทั้งหมดในคอร์สนี้ กู้คืนไม่ได้</p>
              <ConfirmButton label="ลบคอร์สนี้" onConfirm={async () => { const ok = await run(() => deleteCourse(orig), 'ลบคอร์สแล้ว'); if (ok !== undefined) router.push('/admin/courses'); }} />
            </Card>
          )}
          <p className="flex items-center gap-1.5 px-1 font-mono text-[11px] text-muted"><PlayCircle className="size-3" />{c.lessonCount} บทที่เผยแพร่ · {fmtMinutes(c.totalMinutes)}</p>
        </aside>
      </div>
    </>
  );
}
