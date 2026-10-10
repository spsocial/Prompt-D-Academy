'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fmtLiveShort, livePhase } from '@/lib/live';

type Lite = { slug: string; title: string; startAt: number; durationMin: number };

/** แถบแจ้งเตือนคลาสสดทุกหน้า: ก่อนวันเรียน = ชวนลงทะเบียน · ใกล้เวลา/ระหว่างสอน = ปุ่มเข้าห้องเรียนสีแดง */
export function LiveBanner({ live }: { live: Lite | null }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 30_000); return () => clearInterval(t); }, []);
  if (!live || now === null) return null;
  const phase = livePhase(live, now);
  if (phase === 'ended' || live.startAt - now > 14 * 86_400_000) return null;
  const hot = phase === 'open' || phase === 'live';
  return (
    <Link href={`/live/${live.slug}`} className={`group relative z-50 flex items-center justify-center gap-2 px-4 py-2 text-center text-[13px] font-medium text-white ${hot ? 'bg-red-600' : 'bg-spectrum'}`}>
      {hot ? (
        <><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-white" /></span>
          {phase === 'live' ? 'กำลังสอนสดอยู่ตอนนี้' : 'ห้องเรียนเปิดแล้ว'}: {live.title} — กดเพื่อเข้าเรียน</>
      ) : (
        <>🎥 คลาสสอนสดฟรี: {live.title} · {fmtLiveShort(live.startAt)} น. · ลงทะเบียนฟรี</>
      )}
      <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
    </Link>
  );
}
