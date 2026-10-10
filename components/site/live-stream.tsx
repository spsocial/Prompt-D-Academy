'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { isRegistered, isViewer, liveStreamId } from '@/lib/live-client';
import { livePhase } from '@/lib/live';
import type { LiveClass } from '@/lib/types';
import { useNow } from './live-panel';

/** ไลฟ์ YouTube ฝังในหน้าคลาส — แสดงเฉพาะคนที่ลงทะเบียน (Meet หรือ YouTube) ตั้งแต่เปิดห้องจนจบคลาส; นอกนั้นแสดงภาพปก */
export function LiveStream({ live, children }: { live: LiveClass; children: React.ReactNode }) {
  const { ready, user } = useAuth();
  const now = useNow(15_000);
  const phase = livePhase(live, now);
  const [allowed, setAllowed] = useState(false);
  const [vid, setVid] = useState<string | null>(null);
  const on = live.streamOpen && (phase === 'open' || phase === 'live');

  useEffect(() => {
    if (!ready || !user || !on) return;
    Promise.all([isRegistered(live.slug, user.uid), isViewer(live.slug, user.uid)])
      .then(([a, b]) => setAllowed(a || b)).catch(() => {});
  }, [ready, user, on, live.slug]);
  useEffect(() => {
    if (!allowed || !on || vid) return;
    const load = () => liveStreamId(live.slug).then((id) => id && setVid(id));
    load();
    const t = setInterval(load, 30_000); // ลิงก์ไลฟ์อาจถูกใส่ตอนเริ่มสอน
    return () => clearInterval(t);
  }, [allowed, on, vid, live.slug]);

  if (allowed && on && vid) {
    return (
      <div className="mt-4 overflow-hidden rounded-[22px] border border-line bg-black">
        <iframe className="aspect-video w-full" src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`} title={live.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
    );
  }
  if (allowed && on && live.streamOpen) {
    return (
      <div className="relative mt-4">
        {children}
        <p className="absolute inset-x-4 bottom-4 rounded-xl bg-black/75 px-4 py-3 text-center text-sm text-white">ไลฟ์ YouTube จะขึ้นตรงนี้เมื่อเริ่มถ่ายทอดสด (หน้านี้อัปเดตเอง)</p>
      </div>
    );
  }
  return <div className="mt-4">{children}</div>;
}
