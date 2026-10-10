import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Video } from 'lucide-react';
import { getLives } from '@/lib/data';
import { fmtLiveShort, liveEnd } from '@/lib/live';
import { Container } from '@/components/ui/primitives';
import type { LiveClass } from '@/lib/types';

export const revalidate = 60;
export const metadata: Metadata = {
  title: 'คลาสสอนสดฟรี',
  description: 'คลาสสอนสดฟรีผ่าน Google Meet ลงทะเบียนล่วงหน้าบนเว็บ แล้วเข้าห้องเรียนได้จากหน้านี้',
  alternates: { canonical: '/live' },
};

function Card({ l, past }: { l: LiveClass; past?: boolean }) {
  return (
    <Link href={`/live/${l.slug}`} className="group block overflow-hidden rounded-[22px] border border-line bg-surface transition hover:border-line-strong">
      {l.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={l.cover} alt={l.title} className={`aspect-video w-full object-cover ${past ? 'opacity-60 grayscale' : ''}`} />
      )}
      <div className="p-5">
        <p className="flex items-center gap-2 font-mono text-xs text-orange"><CalendarDays className="size-3.5" />{fmtLiveShort(l.startAt)} น.</p>
        <h3 className="mt-2 font-display text-xl font-bold leading-snug group-hover:text-orange">{l.title}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted"><Video className="size-4" />{l.platform} · {past ? 'จบแล้ว' : `จำกัด ${l.capacity} ที่นั่ง`}</p>
      </div>
    </Link>
  );
}

export default async function LiveList() {
  const lives = await getLives();
  const now = Date.now();
  const upcoming = lives.filter((l) => liveEnd(l) > now);
  const past = lives.filter((l) => liveEnd(l) <= now).reverse();
  return (
    <Container className="pb-16 pt-10">
      <p className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 font-mono text-xs font-semibold text-red-500"><span className="size-1.5 rounded-full bg-red-500" />LIVE</p>
      <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight">คลาสสอนสดฟรี</h1>
      <p className="mt-2 max-w-2xl text-fg-2">ลงทะเบียนล่วงหน้าบนเว็บ ถึงเวลาเรียนกลับมาที่หน้าคลาส ลิงก์ห้องเรียนจะขึ้นให้อัตโนมัติ</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((l) => <Card key={l.slug} l={l} />)}
        {!upcoming.length && <p className="rounded-2xl border border-dashed border-line-strong p-10 text-center text-muted sm:col-span-2 lg:col-span-3">ยังไม่มีคลาสสดเร็วๆ นี้ ติดตามประกาศได้ที่เพจของเรา</p>}
      </div>
      {past.length > 0 && (
        <>
          <h2 className="mt-14 font-display text-2xl font-bold">คลาสที่ผ่านมา</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{past.map((l) => <Card key={l.slug} l={l} past />)}</div>
        </>
      )}
    </Container>
  );
}
