import Link from 'next/link';
import { ArrowUpRight, Clock, PlayCircle, Lock } from 'lucide-react';
import { LEVELS, fmtMinutes } from '@/lib/config';
import { cn } from '@/lib/utils';
import type { Course } from '@/lib/types';
import { CourseCover } from './course-cover';

export function CourseCard({ course, index, className }: { course: Course; index?: number; className?: string }) {
  return (
    <Link href={`/courses/${course.slug}`} className={cn('group relative flex flex-col overflow-hidden rounded-[22px] border border-line bg-surface transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,.45)]', className)}>
      <CourseCover course={course} index={index} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <span className="rounded-full border border-line-strong px-2 py-0.5 text-fg-2">{LEVELS[course.level]?.label}</span>
          <span className="flex items-center gap-1"><PlayCircle className="size-3.5" strokeWidth={1.75} />{course.lessonCount} บท</span>
          <span className="flex items-center gap-1"><Clock className="size-3.5" strokeWidth={1.75} />{fmtMinutes(course.totalMinutes)}</span>
          <span className="ml-auto">{course.access === 'free' ? <span className="rounded-full bg-orange/12 px-2 py-0.5 font-semibold text-orange">ฟรี</span> : <span className="flex items-center gap-1"><Lock className="size-3" />สมาชิก</span>}</span>
        </div>
        <h3 className="mt-3.5 font-display text-[1.28rem] font-bold leading-snug tracking-tight">{course.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[14.5px] leading-relaxed text-muted">{course.subtitle}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex flex-wrap gap-1.5">
            {course.tools.slice(0, 3).map((t) => <span key={t} className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[10.5px] text-fg-2">{t}</span>)}
          </div>
          <span className="grid size-9 place-items-center rounded-full border border-line-strong transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
