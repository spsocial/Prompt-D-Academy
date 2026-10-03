'use client';

import Link from 'next/link';
import { ArrowRight, Check, RotateCcw } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { Course } from '@/lib/types';

export function useCourseProgress(slug: string) {
  const { profile } = useAuth();
  const p = profile?.progress?.[slug];
  return { watched: new Set(p?.watchedVideos ?? []), last: p?.lastWatchedVideo, percent: p?.completionPercent ?? 0 };
}

export function CourseCTA({ course, lessons }: { course: Course; lessons: { id: string; slug: string }[] }) {
  const { user } = useAuth();
  const { watched, last, percent } = useCourseProgress(course.slug);
  if (!lessons.length) return null;
  const first = lessons[0];
  const nextUnwatched = lessons.find((l) => !watched.has(l.id));
  const resume = lessons.find((l) => l.id === last);
  const target = nextUnwatched ?? resume ?? first;
  const started = watched.size > 0;
  const done = started && !nextUnwatched;

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <Link href={`/courses/${course.slug}/${target.slug}`} className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-signal px-8 font-semibold text-white shadow-[0_8px_30px_-8px_var(--orange)] transition hover:brightness-110 active:scale-[.97]">
        {done ? <><RotateCcw className="size-4" />ทบทวนอีกครั้ง</> : started ? <>เรียนต่อ<ArrowRight className="size-4" /></> : <>เริ่มเรียนบทแรก<ArrowRight className="size-4" /></>}
      </Link>
      {user && started ? (
        <div className="min-w-48">
          <div className="flex justify-between font-mono text-[11px] text-muted"><span>ความคืบหน้า</span><span>{percent}%</span></div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-spectrum transition-all duration-700" style={{ width: `${percent}%` }} /></div>
        </div>
      ) : !user ? (
        <p className="text-sm text-muted"><Link href="/register" className="font-medium text-fg underline decoration-orange underline-offset-4">สมัครฟรี</Link> เพื่อบันทึกความคืบหน้า</p>
      ) : null}
    </div>
  );
}

export function LessonCheck({ courseSlug, lessonId }: { courseSlug: string; lessonId: string }) {
  const { watched } = useCourseProgress(courseSlug);
  if (!watched.has(lessonId)) return null;
  return <span className="absolute inset-0 grid place-items-center rounded-full bg-[#1fae5b] text-white"><Check className="size-4" strokeWidth={2.5} /></span>;
}
