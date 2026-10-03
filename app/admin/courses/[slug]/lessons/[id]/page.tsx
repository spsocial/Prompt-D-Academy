'use client';

import Link from 'next/link';
import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, UploadCloud, Link2, Plus, X, ExternalLink, CheckCircle2, FileVideo } from 'lucide-react';
import { deleteLesson, getCourseAdmin, getLessonAdmin, listLessons, saveLesson, uploadFile } from '@/lib/admin-api';
import { parseVideoLink, slugify, cn } from '@/lib/utils';
import type { Course, Lesson } from '@/lib/types';
import { Card, ConfirmButton, Field, PageHeader, Segmented, StatusPill, Toggle, inputCls, useAction, useToast } from '@/components/admin/ui';
import { RichEditor } from '@/components/admin/rich-editor';
import { VideoPlayer } from '@/components/site/video-player';

const blank = (): Lesson => ({ id: '', slug: '', title: '', summary: '', video: { type: 'none' }, durationMin: 0, content: '', resources: [], order: 999, published: true, access: 'free' });

const linkOf = (l: Lesson) => (l.video.type === 'youtube' ? `https://youtu.be/${l.video.id}` : l.video.type === 'drive' ? `https://drive.google.com/file/d/${l.video.id}/view` : l.video.type === 'file' ? l.video.url ?? '' : '');

export default function LessonEditor({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const p = use(params);
  const courseSlug = decodeURIComponent(p.slug);
  const isNew = p.id === 'new';
  const router = useRouter();
  const toast = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [l, setL] = useState<Lesson | null>(isNew ? blank() : null);
  const [mode, setMode] = useState<'link' | 'upload'>('link');
  const [link, setLink] = useState('');
  const [pct, setPct] = useState<number | null>(null);
  const [over, setOver] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const fileRef = useRef<HTMLInputElement>(null);
  const { busy, run } = useAction();

  useEffect(() => {
    getCourseAdmin(courseSlug).then(setCourse);
    if (!isNew) getLessonAdmin(courseSlug, p.id).then((x) => { const v = x ?? blank(); setL(v); setLink(linkOf(v)); setMode(v.video.type === 'file' ? 'upload' : 'link'); });
  }, [courseSlug, p.id, isNew]);

  if (!l) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;
  const set = <K extends keyof Lesson>(k: K, v: Lesson[K]) => setL((x) => (x ? { ...x, [k]: v } : x));
  const detected = parseVideoLink(link);

  const upload = async (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith('video/')) return toast('ต้องเป็นไฟล์วิดีโอ (MP4 แนะนำ)', 'err');
    // อ่านความยาวคลิปอัตโนมัติ
    const tmp = document.createElement('video'); tmp.preload = 'metadata'; tmp.src = URL.createObjectURL(f);
    tmp.onloadedmetadata = () => { set('durationMin', Math.max(1, Math.round(tmp.duration / 60))); URL.revokeObjectURL(tmp.src); };
    setPct(0);
    try {
      const url = await uploadFile(`videos/${courseSlug}`, f, setPct);
      set('video', { type: 'file', url }); setLink(url); toast('อัปโหลดคลิปเสร็จแล้ว');
    } catch (e) { toast((e as Error).message, 'err'); } finally { setPct(null); }
  };

  const save = async () => {
    if (!l.title.trim()) return toast('ใส่ชื่อบทเรียนก่อน', 'err');
    const video = mode === 'link' ? detected : l.video;
    const id = await run(() => saveLesson(courseSlug, { ...l, video, slug: l.slug || slugify(l.title) }), 'บันทึกบทเรียนแล้ว');
    if (id && isNew) router.replace(`/admin/courses/${encodeURIComponent(courseSlug)}/lessons/${id}`);
  };

  const preview = mode === 'link' ? detected : l.video;

  return (
    <>
      <Link href={`/admin/courses/${encodeURIComponent(courseSlug)}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"><ArrowLeft className="size-4" />{course?.title ?? courseSlug}</Link>
      <PageHeader title={isNew ? 'เพิ่มบทเรียนใหม่' : l.title || 'แก้ไขบทเรียน'} sub={!isNew && <StatusPill on={l.published} />}
        actions={<>
          {!isNew && l.published && course?.published && <Link href={`/courses/${courseSlug}/${l.slug}`} target="_blank" className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm"><ExternalLink className="size-4" />ดูหน้าเว็บ</Link>}
          <button onClick={save} disabled={busy || pct !== null} className="inline-flex h-10 items-center gap-2 rounded-full bg-signal px-5 text-sm font-semibold text-white disabled:opacity-60">{busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}บันทึก</button>
        </>} />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <Card>
            <div className="grid gap-5">
              <Field label="ชื่อบทเรียน"><input className={cn(inputCls, 'h-13 text-lg font-semibold')} value={l.title} onChange={(e) => { set('title', e.target.value); if (!slugTouched) set('slug', slugify(e.target.value)); }} placeholder="เช่น ติดตั้ง Claude Code ใน 5 นาที" /></Field>
              <Field label="สรุปสั้นๆ 1–2 ประโยค" hint="แสดงในรายการบทเรียน และเป็นคำอธิบายบน Google"><textarea className={cn(inputCls, 'h-auto py-2.5')} rows={2} value={l.summary} onChange={(e) => set('summary', e.target.value)} placeholder="บทนี้จะได้เรียนอะไร" /></Field>
            </div>
          </Card>

          <Card title="คลิปวิดีโอ" desc="วางลิงก์ YouTube / Google Drive หรืออัปโหลดไฟล์ MP4 จากเครื่อง">
            <Segmented value={mode} onChange={setMode} options={[{ value: 'link', label: 'วางลิงก์' }, { value: 'upload', label: 'อัปโหลดไฟล์' }]} />
            <div className="mt-4">
              {mode === 'link' ? (
                <div>
                  <div className="relative">
                    <Link2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                    <input className={cn(inputCls, 'pl-10')} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://youtu.be/…  หรือ  https://drive.google.com/file/d/…" />
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs">
                    {detected.type === 'none' ? <span className="text-muted">รองรับ YouTube (แนะนำ — ฟรีและช่วยโตช่อง), Google Drive (ต้องแชร์แบบ “ทุกคนที่มีลิงก์”), หรือลิงก์ไฟล์ .mp4</span>
                      : <span className="flex items-center gap-1.5 text-[#1fae5b]"><CheckCircle2 className="size-3.5" />ตรวจพบ: {detected.type === 'youtube' ? 'YouTube' : detected.type === 'drive' ? 'Google Drive' : 'ไฟล์วิดีโอ'}</span>}
                  </p>
                </div>
              ) : (
                <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files[0]); }}
                  onClick={() => pct === null && fileRef.current?.click()}
                  className={cn('grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed p-8 text-center transition', over ? 'border-orange bg-orange/5' : 'border-line-strong hover:border-fg/40')}>
                  <input ref={fileRef} type="file" accept="video/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
                  {pct !== null ? (
                    <div className="w-full max-w-sm"><Loader2 className="mx-auto size-7 animate-spin" /><div className="mt-4 h-2 overflow-hidden rounded-full bg-line"><div className="h-full bg-spectrum transition-all" style={{ width: `${pct}%` }} /></div><p className="mt-2 font-mono text-sm">กำลังอัปโหลด {pct}% — อย่าปิดหน้านี้</p></div>
                  ) : l.video.type === 'file' ? (
                    <div><FileVideo className="mx-auto size-8 text-[#1fae5b]" strokeWidth={1.5} /><p className="mt-2 font-medium">อัปโหลดคลิปแล้ว</p><p className="text-sm text-muted">คลิกหรือลากไฟล์ใหม่มาวางเพื่อเปลี่ยน</p></div>
                  ) : (
                    <div><UploadCloud className="mx-auto size-9 text-muted" strokeWidth={1.25} /><p className="mt-2 font-medium">ลากไฟล์วิดีโอมาวาง หรือคลิกเพื่อเลือก</p><p className="text-sm text-muted">MP4 (H.264) · ระบบอ่านความยาวคลิปให้อัตโนมัติ</p></div>
                  )}
                </div>
              )}
            </div>
            {preview.type !== 'none' && <div className="mt-5"><VideoPlayer video={preview} title={l.title} /></div>}
          </Card>

          <Card title="บทความสรุป" desc="ทุกบทควรมีสรุป — Google อ่านตัวหนังสือได้ แต่ดูวิดีโอไม่ได้ (ช่วยให้ติดอันดับ)">
            <RichEditor value={l.content} onChange={(v) => set('content', v)} folder={`content/${courseSlug}`} />
          </Card>

          <Card title="ไฟล์ & ลิงก์ประกอบ" desc="เช่น ไฟล์ตัวอย่าง, Prompt, ลิงก์เครื่องมือ">
            <div className="space-y-2">
              {l.resources.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <input className={cn(inputCls, 'w-2/5')} value={r.label} placeholder="ชื่อ" onChange={(e) => set('resources', l.resources.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} />
                  <input className={inputCls} value={r.url} placeholder="https://" onChange={(e) => set('resources', l.resources.map((x, k) => (k === i ? { ...x, url: e.target.value } : x)))} />
                  <button type="button" onClick={() => set('resources', l.resources.filter((_, k) => k !== i))} className="grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-2" aria-label="ลบ"><X className="size-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => set('resources', [...l.resources, { label: '', url: '' }])} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-fg-2 hover:bg-surface-2"><Plus className="size-4" />เพิ่มลิงก์</button>
            </div>
          </Card>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card title="การแสดงผล">
            <div className="space-y-3">
              <Toggle checked={l.published} onChange={(v) => set('published', v)} label="เผยแพร่บทนี้" />
              <div className="pt-1"><p className="mb-2 text-sm font-medium text-fg-2">ใครดูคลิปได้</p>
                <Segmented value={l.access} onChange={(v) => set('access', v)} options={[{ value: 'free', label: 'ทุกคน' }, { value: 'member', label: 'สมาชิก' }]} /></div>
            </div>
          </Card>
          <Card title="รายละเอียด">
            <div className="grid gap-4">
              <Field label="ความยาว (นาที)"><input type="number" min={0} className={inputCls} value={l.durationMin || ''} onChange={(e) => set('durationMin', Number(e.target.value))} /></Field>
              <Field label="ลิงก์ (URL)" hint={`/courses/${courseSlug}/${l.slug || '…'}`}><input className={cn(inputCls, 'font-mono text-sm')} value={l.slug} onChange={(e) => { setSlugTouched(true); set('slug', e.target.value); }} onBlur={() => set('slug', slugify(l.slug || l.title))} /></Field>
            </div>
          </Card>
          {!isNew && (
            <Card title="ลบบทเรียน">
              <ConfirmButton label="ลบบทนี้" onConfirm={async () => { const ok = await run(() => deleteLesson(courseSlug, l.id), 'ลบบทเรียนแล้ว'); if (ok) router.push(`/admin/courses/${encodeURIComponent(courseSlug)}`); }} />
            </Card>
          )}
          {isNew && <NextOrderHint courseSlug={courseSlug} />}
        </aside>
      </div>
    </>
  );
}

function NextOrderHint({ courseSlug }: { courseSlug: string }) {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => { listLessons(courseSlug).then((x) => setN(x.length + 1)); }, [courseSlug]);
  return n ? <p className="px-1 font-mono text-xs text-muted">จะเป็นบทที่ {n} ของคอร์ส (ลากเปลี่ยนลำดับได้ภายหลัง)</p> : null;
}
