'use client';

import Link from 'next/link';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Eye, PlayCircle, MousePointerClick, Trophy, Timer, ChevronDown, TrendingDown, Info } from 'lucide-react';
import { listCourseStats, listCourses, listLessons } from '@/lib/admin-api';
import { categoryLabel, fmtCount } from '@/lib/config';
import { cn } from '@/lib/utils';
import type { Course, CourseStats, Lesson, LessonStats } from '@/lib/types';
import { PageHeader, Segmented } from '@/components/admin/ui';

const bkk = (offsetDays = 0) => new Date(Date.now() + 7 * 3600e3 - offsetDays * 864e5).toISOString().slice(0, 10);
const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);
const fmtDur = (sec: number) => (sec >= 3600 ? `${(sec / 3600).toFixed(1)} ชม.` : sec >= 60 ? `${Math.round(sec / 60)} นาที` : `${Math.round(sec)} วิ`);
const sumLessons = (s?: CourseStats, k: keyof LessonStats = 'plays') => Object.values(s?.lessons ?? {}).reduce((t, l) => t + (Number(l[k]) || 0), 0);
const deciles = (l?: LessonStats) => Array.from({ length: 10 }, (_, k) => Number(l?.[`d${k + 1}`]) || 0);

type Range = '7' | '30' | '90';

export default function StatsPage() {
  const [stats, setStats] = useState<CourseStats[] | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [range, setRange] = useState<Range>('30');
  const [open, setOpen] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [err, setErr] = useState('');

  useEffect(() => {
    listCourseStats().then(setStats).catch((e) => { setErr((e as Error).message); setStats([]); });
    listCourses().then(setCourses);
  }, []);

  const bySlug = useMemo(() => Object.fromEntries((stats ?? []).map((s) => [s.slug, s])), [stats]);
  const days = Array.from({ length: Number(range) }, (_, i) => bkk(Number(range) - 1 - i));
  const inRange = (s?: CourseStats) => days.reduce((t, d) => t + (s?.days?.[d] ?? 0), 0);

  const rows = useMemo(() => courses.map((c) => {
    const s = bySlug[c.slug];
    const plays = sumLessons(s, 'plays'), done = sumLessons(s, 'd10'), sec = sumLessons(s, 'sec');
    return { c, s, views: s?.views ?? 0, recent: inRange(s), lessonViews: s?.lessonViews ?? 0, plays, done, sec };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }).sort((a, b) => b.recent - a.recent || b.views - a.views), [courses, bySlug, range]);

  const tot = rows.reduce((t, r) => ({ views: t.views + r.views, recent: t.recent + r.recent, lv: t.lv + r.lessonViews, plays: t.plays + r.plays, done: t.done + r.done, sec: t.sec + r.sec }), { views: 0, recent: 0, lv: 0, plays: 0, done: 0, sec: 0 });
  const daily = days.map((d) => ({ d, n: (stats ?? []).reduce((t, s) => t + (s.days?.[d] ?? 0), 0) }));
  const maxDay = Math.max(1, ...daily.map((x) => x.n));
  const cats = Object.entries(rows.reduce<Record<string, number>>((m, r) => ({ ...m, [r.c.category]: (m[r.c.category] ?? 0) + r.recent }), {})).sort((a, b) => b[1] - a[1]);
  const catMax = Math.max(1, ...cats.map((c) => c[1]));

  const toggle = async (slug: string) => {
    setOpen(open === slug ? null : slug);
    if (!lessons[slug]) setLessons({ ...lessons, [slug]: await listLessons(slug) });
  };

  return (
    <>
      <PageHeader title="สถิติผู้ชม" sub="นับแบบไม่ระบุตัวตน · 1 คนนับครั้งเดียวต่อการเปิดเว็บ 1 รอบ"
        actions={<Segmented<Range> value={range} onChange={setRange} options={[{ value: '7', label: '7 วัน' }, { value: '30', label: '30 วัน' }, { value: '90', label: '90 วัน' }]} />} />

      {err && <p className="mb-6 flex items-start gap-2 rounded-2xl border border-orange/40 bg-orange/10 px-4 py-3 text-sm"><Info className="mt-0.5 size-4 shrink-0" />อ่านสถิติไม่ได้ ({err}) — ต้องเพิ่มกฎ <code>stats</code> ใน Firestore Rules ก่อน</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { icon: Eye, n: fmtCount(tot.recent), l: `คนเข้าคอร์ส (${range} วัน)`, s: `ทั้งหมด ${fmtCount(tot.views)}` },
          { icon: MousePointerClick, n: fmtCount(tot.lv), l: 'เปิดดูบทเรียน (ทั้งหมด)' },
          { icon: PlayCircle, n: fmtCount(tot.plays), l: 'กดเล่นวิดีโอ', s: `${pct(tot.plays, tot.lv)}% ของคนที่เปิดบท` },
          { icon: Trophy, n: `${pct(tot.done, tot.plays)}%`, l: 'ดูจนจบคลิป', s: `${fmtCount(tot.done)} ครั้ง` },
          { icon: Timer, n: fmtDur(tot.sec), l: 'เวลาดูวิดีโอรวม', s: tot.plays ? `เฉลี่ย ${fmtDur(tot.sec / tot.plays)} / ครั้ง` : '' },
        ].map((x) => (
          <div key={x.l} className="rounded-[20px] border border-line bg-surface p-5">
            <x.icon className="size-5 text-muted" strokeWidth={1.75} />
            <p className="mt-5 font-display text-3xl font-extrabold tabular-nums">{stats ? x.n : <span className="inline-block h-8 w-16 animate-pulse rounded bg-surface-2" />}</p>
            <p className="mt-1 text-sm text-muted">{x.l}</p>
            {x.s && <p className="mt-0.5 font-mono text-[11px] text-fg-2">{x.s}</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-[20px] border border-line bg-surface p-5">
          <h2 className="font-semibold">คนเข้าคอร์สรายวัน</h2>
          <div className="mt-5 flex h-44 items-end gap-[3px]">
            {daily.map((x) => (
              <div key={x.d} className="group relative flex-1">
                <div className="rounded-t bg-signal/80 transition group-hover:bg-signal" style={{ height: `${Math.max(2, (x.n / maxDay) * 168)}px` }} />
                <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-fg px-2 py-1 font-mono text-[11px] text-bg group-hover:block">{x.d.slice(5)} · {x.n}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[11px] text-muted"><span>{days[0].slice(5)}</span><span>วันนี้</span></div>
        </section>
        <section className="rounded-[20px] border border-line bg-surface p-5">
          <h2 className="font-semibold">หมวดที่คนชอบดู <span className="font-normal text-muted">({range} วัน)</span></h2>
          <ul className="mt-4 space-y-3">
            {cats.map(([k, n], i) => (
              <li key={k}>
                <div className="flex justify-between text-sm"><span className={cn(i === 0 && 'font-semibold')}>{categoryLabel(k)}</span><span className="font-mono text-muted">{n} · {pct(n, tot.recent)}%</span></div>
                <div className="mt-1 h-2 rounded-full bg-surface-2"><div className="h-2 rounded-full bg-spectrum" style={{ width: `${(n / catMax) * 100}%` }} /></div>
              </li>
            ))}
            {!cats.length && <li className="text-sm text-muted">ยังไม่มีข้อมูล</li>}
          </ul>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-[20px] border border-line bg-surface">
        <div className="border-b border-line px-5 py-4"><h2 className="font-semibold">อันดับคอร์ส</h2><p className="text-sm text-muted">กดที่คอร์สเพื่อดูรายบท ว่าคนดูถึงตรงไหนแล้วเลิกดู</p></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-surface-2/60 text-left font-mono text-[11px] uppercase text-muted">
              <tr><th className="px-5 py-3">#</th><th className="py-3">คอร์ส</th><th className="py-3 text-right">เข้าคอร์ส ({range}ว.)</th><th className="py-3 text-right">ทั้งหมด</th><th className="py-3 text-right">เปิดบท</th><th className="py-3 text-right">กดเล่น</th><th className="py-3 text-right">ดูจบ</th><th className="px-5 py-3 text-right">เวลาดูเฉลี่ย</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r, i) => (
                <Fragment key={r.c.slug}>
                  <tr onClick={() => toggle(r.c.slug)} className="cursor-pointer hover:bg-surface-2/50">
                    <td className="px-5 py-3.5 font-mono text-muted">{i + 1}</td>
                    <td className="py-3.5"><span className="flex items-center gap-2"><ChevronDown className={cn('size-4 shrink-0 text-muted transition', open === r.c.slug && 'rotate-180')} /><span className="min-w-0"><span className="block truncate font-medium">{r.c.title}</span><span className="font-mono text-[11px] text-muted">{categoryLabel(r.c.category)}{!r.c.published && ' · ซ่อนอยู่'}</span></span></span></td>
                    <td className="py-3.5 text-right font-semibold tabular-nums">{r.recent}</td>
                    <td className="py-3.5 text-right tabular-nums">{r.views}</td>
                    <td className="py-3.5 text-right tabular-nums">{r.lessonViews}</td>
                    <td className="py-3.5 text-right tabular-nums">{r.plays}</td>
                    <td className="py-3.5 text-right tabular-nums">{pct(r.done, r.plays)}%</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">{r.plays ? fmtDur(r.sec / r.plays) : '–'}</td>
                  </tr>
                  {open === r.c.slug && (
                    <tr><td colSpan={8} className="bg-bg/40 px-5 py-4"><LessonBreakdown lessons={lessons[r.c.slug]} stats={r.s} slug={r.c.slug} /></td></tr>
                  )}
                </Fragment>
              ))}
              {!rows.length && <tr><td colSpan={8} className="px-5 py-10 text-center text-muted">ยังไม่มีคอร์ส</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function LessonBreakdown({ lessons, stats, slug }: { lessons?: Lesson[]; stats?: CourseStats; slug: string }) {
  if (!lessons) return <p className="text-sm text-muted">กำลังโหลด…</p>;
  if (!lessons.length) return <p className="text-sm text-muted">คอร์สนี้ยังไม่มีบทเรียน</p>;
  return (
    <div className="grid gap-3">
      {lessons.map((l, i) => {
        const s = stats?.lessons?.[l.id];
        const plays = s?.plays ?? 0, d = deciles(s);
        const base = Math.max(plays, d[0], 1);
        // จุดที่คนหลุดมากสุด: ช่วงที่ยอดลดลงมากที่สุดระหว่างทุก 10%
        const seq = [plays, ...d]; // seq[k] = คนที่ดูถึง k*10%
        let drop = 0, dropAt = 0;
        for (let k = 0; k < 10; k++) { const x = seq[k] - seq[k + 1]; if (x > drop) { drop = x; dropAt = k; } }
        const tracked = l.video.type === 'file' || d[0] > 0;
        return (
          <div key={l.id} className="grid items-center gap-4 rounded-2xl border border-line bg-surface p-4 md:grid-cols-[1.4fr_auto_1.2fr]">
            <div className="min-w-0">
              <Link href={`/admin/courses/${encodeURIComponent(slug)}/lessons/${l.id}`} className="block truncate font-medium hover:underline">{String(i + 1).padStart(2, '0')} · {l.title}</Link>
              <p className="mt-1 font-mono text-[11px] text-muted">เปิด {s?.views ?? 0} · เล่น {plays} · ดูจบ {pct(d[9], plays)}% · เฉลี่ย {plays ? fmtDur((s?.sec ?? 0) / plays) : '–'}</p>
            </div>
            <div className="text-right font-display text-2xl font-extrabold tabular-nums">{pct(d[9], plays)}<span className="text-sm text-muted">% จบ</span></div>
            {tracked ? (
              <div>
                <div className="flex h-12 items-end gap-1" title="สัดส่วนคนที่ดูถึงแต่ละช่วง 10%">
                  {d.map((n, k) => <div key={k} className={cn('flex-1 rounded-t', k === dropAt && drop > 0 ? 'bg-orange' : 'bg-signal/70')} style={{ height: `${Math.max(3, (n / base) * 48)}px` }} />)}
                </div>
                <div className="mt-1 flex justify-between font-mono text-[10px] text-muted"><span>10%</span><span>50%</span><span>จบ</span></div>
                {drop > 0 && <p className="mt-1 flex items-center gap-1 text-[12px] text-orange"><TrendingDown className="size-3.5" />คนเลิกดูเยอะสุดช่วง {dropAt * 10}–{dropAt * 10 + 10}% ของคลิป ({drop} คน)</p>}
              </div>
            ) : <p className="text-[12px] text-muted">{l.video.type === 'none' ? 'บทนี้ยังไม่มีคลิป' : 'คลิปแบบลิงก์ YouTube/Drive — นับได้แค่ยอดกดเล่น (อัปไฟล์ MP4 ถึงจะเห็นว่าดูถึงตรงไหน)'}</p>}
          </div>
        );
      })}
    </div>
  );
}
