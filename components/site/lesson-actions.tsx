'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, CircleCheckBig, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn, pad2 } from '@/lib/utils';
import { fmtMinutes } from '@/lib/config';
import { useCourseProgress } from './course-progress';

type L = { id: string; slug: string; title: string; durationMin: number; access: string };

export function MarkComplete({ courseSlug, lessonId, total, nextHref }: { courseSlug: string; lessonId: string; total: number; nextHref?: string }) {
  const { user, markComplete } = useAuth();
  const { watched } = useCourseProgress(courseSlug);
  const [busy, setBusy] = useState(false);
  const done = watched.has(lessonId);
  if (!user) return <Link href="/register" className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-sm text-fg-2 hover:bg-surface">สมัครฟรีเพื่อบันทึกว่าเรียนจบ</Link>;
  return (
    <button
      disabled={busy || done}
      onClick={async () => { setBusy(true); try { await markComplete(courseSlug, lessonId, total); if (nextHref) window.setTimeout(() => (window.location.href = nextHref), 600); } finally { setBusy(false); } }}
      className={cn('inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition', done ? 'bg-[#1fae5b]/15 text-[#1fae5b]' : 'bg-fg text-bg hover:bg-fg/90')}>
      {done ? <><CircleCheckBig className="size-4" />เรียนจบบทนี้แล้ว</> : <><Check className="size-4" />{busy ? 'กำลังบันทึก…' : 'เรียนจบบทนี้'}</>}
    </button>
  );
}

export function PrevNext({ base, prev, next }: { base: string; prev?: L; next?: L }) {
  return (
    <div className="mt-14 grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link href={`${base}/${prev.slug}`} className="group rounded-2xl border border-line p-5 transition hover:border-line-strong hover:bg-surface">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted"><ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" />บทก่อนหน้า</span>
          <span className="mt-1.5 block font-semibold leading-snug">{prev.title}</span>
        </Link>
      ) : <span />}
      {next && (
        <Link href={`${base}/${next.slug}`} className="group rounded-2xl border border-line p-5 text-right transition hover:border-orange/60 hover:bg-surface">
          <span className="flex items-center justify-end gap-1.5 font-mono text-[11px] text-orange">บทถัดไป<ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span>
          <span className="mt-1.5 block font-semibold leading-snug">{next.title}</span>
        </Link>
      )}
    </div>
  );
}

export function Curriculum({ base, courseSlug, lessons, currentId }: { base: string; courseSlug: string; lessons: L[]; currentId: string }) {
  const { watched, percent } = useCourseProgress(courseSlug);
  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-surface">
      <div className="border-b border-line p-4">
        <div className="flex items-center justify-between font-mono text-[11px] text-muted"><span>{lessons.length} บทเรียน</span><span>{percent}% สำเร็จ</span></div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-spectrum transition-all duration-700" style={{ width: `${percent}%` }} /></div>
      </div>
      <ol className="max-h-[60vh] overflow-y-auto p-1.5">
        {lessons.map((l, i) => {
          const cur = l.id === currentId;
          return (
            <li key={l.id}>
              <Link href={`${base}/${l.slug}`} aria-current={cur ? 'page' : undefined}
                className={cn('flex items-start gap-3 rounded-xl px-3 py-2.5 text-[14px] transition', cur ? 'bg-fg text-bg' : 'text-fg-2 hover:bg-surface-2 hover:text-fg')}>
                <span className={cn('mt-px grid size-6 shrink-0 place-items-center rounded-full font-mono text-[10px]', watched.has(l.id) ? 'bg-[#1fae5b] text-white' : cur ? 'bg-bg/15' : 'border border-line-strong')}>
                  {watched.has(l.id) ? <Check className="size-3.5" strokeWidth={3} /> : pad2(i + 1)}
                </span>
                <span className="min-w-0 flex-1 leading-snug">{l.title}</span>
                <span className={cn('mt-0.5 shrink-0 font-mono text-[10.5px]', cur ? 'text-bg/60' : 'text-muted')}>{l.access === 'member' ? <Lock className="size-3" /> : fmtMinutes(l.durationMin)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
