'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookCheck, Flame, PlayCircle, Trophy, Compass } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { Course } from '@/lib/types';
import { Container, Eyebrow, ButtonLink } from '@/components/ui/primitives';
import { CourseCover } from './course-cover';
import { CourseCard } from './course-card';

type LMap = Record<string, { id: string; slug: string; title: string }[]>;

export function Dashboard({ courses, lessons }: { courses: Course[]; lessons: LMap }) {
  const { user, profile, ready, demo } = useAuth();
  const router = useRouter();
  useEffect(() => { if (ready && !user && !demo) router.replace('/login?next=/dashboard'); }, [ready, user, demo, router]);

  if (!ready) return <Container className="py-24"><div className="h-40 animate-pulse rounded-3xl bg-surface" /></Container>;

  const prog = profile?.progress ?? {};
  const rows = courses.map((c) => {
    const ls = lessons[c.slug] ?? [];
    const watched = new Set(prog[c.slug]?.watchedVideos ?? []);
    const done = ls.filter((l) => watched.has(l.id)).length;
    const next = ls.find((l) => !watched.has(l.id));
    return { c, ls, done, pct: ls.length ? Math.round((done / ls.length) * 100) : 0, next };
  });
  const active = rows.filter((r) => r.done > 0 && r.done < r.ls.length);
  const finished = rows.filter((r) => r.ls.length && r.done === r.ls.length);
  const fresh = rows.filter((r) => r.done === 0).map((r) => r.c);
  const totalDone = rows.reduce((s, r) => s + r.done, 0);
  const name = profile?.displayName || user?.displayName || 'ผู้เรียน';

  return (
    <Container className="py-12 lg:py-16">
      <Eyebrow>แดชบอร์ด</Eyebrow>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-tight tracking-tight">สวัสดี, <span className="text-spectrum">{name}</span></h1>
      {demo && <p className="mt-4 max-w-xl rounded-xl border border-orange/30 bg-orange/10 p-3 text-sm text-fg-2">โหมดตัวอย่าง — เมื่อเชื่อม Firebase แล้ว หน้านี้จะแสดงความคืบหน้าจริงของผู้เรียน</p>}

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: BookCheck, n: totalDone, l: 'บทเรียนที่เรียนจบ' },
          { icon: Flame, n: active.length, l: 'คอร์สที่กำลังเรียน' },
          { icon: Trophy, n: finished.length, l: 'คอร์สที่เรียนจบ' },
        ].map((s) => (
          <div key={s.l} className="relative overflow-hidden rounded-[22px] border border-line bg-surface p-6">
            <s.icon className="size-6 text-orange" strokeWidth={1.5} />
            <p className="mt-6 font-display text-5xl font-extrabold tabular-nums">{s.n}</p>
            <p className="mt-1 text-sm text-muted">{s.l}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">เรียนต่อจากที่ค้างไว้</h2>
        {active.length ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {active.map(({ c, ls, done, pct, next }) => (
              <Link key={c.slug} href={next ? `/courses/${c.slug}/${next.slug}` : `/courses/${c.slug}`} className="group grid grid-cols-[150px_1fr] gap-5 overflow-hidden rounded-[22px] border border-line bg-surface p-3 transition hover:border-line-strong sm:grid-cols-[200px_1fr]">
                <CourseCover course={c} className="aspect-[16/10] rounded-2xl" sizes="200px" />
                <div className="flex min-w-0 flex-col py-1 pr-2">
                  <p className="font-display text-lg font-bold leading-snug">{c.title}</p>
                  {next && <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted"><PlayCircle className="size-3.5 shrink-0" />{next.title}</p>}
                  <div className="mt-auto">
                    <div className="flex justify-between font-mono text-[11px] text-muted"><span>{done}/{ls.length} บท</span><span>{pct}%</span></div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-spectrum" style={{ width: `${pct}%` }} /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-start gap-4 rounded-[22px] border border-dashed border-line-strong p-8 sm:flex-row sm:items-center">
            <Compass className="size-10 text-muted" strokeWidth={1.25} />
            <div className="flex-1"><p className="font-semibold">ยังไม่ได้เริ่มคอร์สไหนเลย</p><p className="text-sm text-muted">เลือกคอร์สแรกด้านล่าง แล้วกด &quot;เรียนจบบทนี้&quot; ระบบจะจำให้อัตโนมัติ</p></div>
            <ButtonLink href="/courses" variant="outline">ดูคอร์สทั้งหมด <ArrowRight className="size-4" /></ButtonLink>
          </div>
        )}
      </section>

      {finished.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold">เรียนจบแล้ว</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {finished.map(({ c }) => (
              <Link key={c.slug} href={`/courses/${c.slug}`} className="flex items-center gap-2 rounded-full border border-[#1fae5b]/40 bg-[#1fae5b]/10 px-4 py-2 text-sm"><Trophy className="size-4 text-[#1fae5b]" />{c.title}</Link>
            ))}
          </div>
        </section>
      )}

      {fresh.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold">แนะนำให้เรียนต่อ</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fresh.slice(0, 3).map((c) => <CourseCard key={c.slug} course={c} index={courses.indexOf(c)} className="h-full" />)}
          </div>
        </section>
      )}
    </Container>
  );
}
