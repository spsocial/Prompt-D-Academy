'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Download, FileText, Lock } from 'lucide-react';
import { isRegistered, isViewer, liveReplay, liveSeats, liveStreamId } from '@/lib/live-client';
import { livePhase } from '@/lib/live';
import type { LiveClass, LiveMaterial } from '@/lib/types';
import { useNow } from './live-panel';

/** ไลฟ์ YouTube ฝังในหน้าคลาส — แสดงเฉพาะคนที่ลงทะเบียน (Meet หรือ YouTube) ตั้งแต่เปิดห้องจนจบคลาส; นอกนั้นแสดงภาพปก */
export function LiveStream({ live, children }: { live: LiveClass; children: React.ReactNode }) {
  const { ready, user } = useAuth();
  const now = useNow(15_000);
  const phase = livePhase(live, now);
  const [allowed, setAllowed] = useState(false);
  const [vid, setVid] = useState<string | null>(null);
  const [open, setOpen] = useState(!!live.streamOpen);
  useEffect(() => { liveSeats(live.slug).then((s) => setOpen(s.streamOpen)).catch(() => {}); }, [live.slug]);
  const on = open && (phase === 'open' || phase === 'live');
  const ended = phase === 'ended';

  useEffect(() => {
    if (!ready || !user || !(on || ended)) return;
    Promise.all([isRegistered(live.slug, user.uid), isViewer(live.slug, user.uid)])
      .then(([a, b]) => setAllowed(a || b)).catch(() => {});
  }, [ready, user, on, ended, live.slug]);
  useEffect(() => {
    if (!allowed || !on || vid) return;
    const load = () => liveStreamId(live.slug).then((id) => id && setVid(id));
    load();
    const t = setInterval(load, 30_000); // ลิงก์ไลฟ์อาจถูกใส่ตอนเริ่มสอน
    return () => clearInterval(t);
  }, [allowed, on, vid, live.slug]);

  if (ended) return <LiveReplay live={live} allowed={allowed} signedIn={!!user}>{children}</LiveReplay>;
  if (allowed && on && vid) {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'www.promptdclass.com';
    return (
      <div className="mt-4 space-y-3">
        <div className="overflow-hidden rounded-[22px] border border-line bg-black">
          <iframe className="aspect-video w-full" src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`} title={live.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        </div>
        {/* แชทสดของ YouTube — พิมพ์ถามได้ในหน้าเว็บ (ต้องล็อกอิน YouTube) */}
        <div className="overflow-hidden rounded-[22px] border border-line bg-surface">
          <iframe className="h-[420px] w-full" src={`https://www.youtube.com/live_chat?v=${vid}&embed_domain=${host}`} title="แชทสด" />
        </div>
      </div>
    );
  }
  if (allowed && on) {
    return (
      <div className="relative mt-4">
        {children}
        <p className="absolute inset-x-4 bottom-4 rounded-xl bg-black/75 px-4 py-3 text-center text-sm text-white">ไลฟ์ YouTube จะขึ้นตรงนี้เมื่อเริ่มถ่ายทอดสด (หน้านี้อัปเดตเอง)</p>
      </div>
    );
  }
  return <div className="mt-4">{children}</div>;
}

/** หลังจบคลาส: คลิปย้อนหลัง + ไฟล์แจก — เฉพาะคนที่ลงทะเบียน (Meet หรือ YouTube) */
function LiveReplay({ live, allowed, signedIn, children }: { live: LiveClass; allowed: boolean; signedIn: boolean; children: React.ReactNode }) {
  const [data, setData] = useState<{ replayId: string | null; materials: LiveMaterial[] } | null>(null);
  const [peek, setPeek] = useState<number | null>(null);
  useEffect(() => { if (allowed) liveReplay(live.slug).then(setData); }, [allowed, live.slug]);

  if (!allowed || !data || (!data.replayId && !data.materials.length)) {
    return (
      <div className="relative mt-4">
        {children}
        {!allowed && (
          <p className="absolute inset-x-4 bottom-4 flex items-center justify-center gap-2 rounded-xl bg-black/75 px-4 py-3 text-center text-sm text-white">
            <Lock className="size-4 shrink-0" />{signedIn ? 'คลิปย้อนหลังและไฟล์แจก ดูได้เฉพาะผู้ที่ลงทะเบียนคลาสนี้' : 'ผู้ที่ลงทะเบียนคลาสนี้ เข้าสู่ระบบเพื่อดูคลิปย้อนหลังและไฟล์แจก'}
          </p>
        )}
      </div>
    );
  }
  const save = (m: LiveMaterial) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([m.content], { type: 'text/markdown;charset=utf-8' }));
    a.download = m.name; a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <div className="mt-4 space-y-4">
      {data.replayId ? (
        <div className="overflow-hidden rounded-[22px] border border-line bg-black">
          <iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${data.replayId}?rel=0`} title={`ย้อนหลัง · ${live.title}`}
            allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        </div>
      ) : children}
      <p className="text-sm text-muted">🔒 คลิปย้อนหลังและไฟล์แจกนี้สำหรับผู้ที่ลงทะเบียนคลาสเท่านั้น ขอความร่วมมือไม่ส่งต่อนะครับ</p>
      {data.materials.length > 0 && (
        <div className="rounded-[22px] border border-line bg-surface p-5">
          <h3 className="mb-3 font-semibold">ไฟล์แจกในคลาส</h3>
          <ul className="space-y-3">
            {data.materials.map((m, i) => (
              <li key={m.name} className="rounded-xl border border-line bg-surface-2 p-3">
                <div className="flex flex-wrap items-center gap-3">
                  <FileText className="size-5 shrink-0 text-orange" />
                  <span className="min-w-0 flex-1 break-all font-medium">{m.name}</span>
                  <button onClick={() => setPeek(peek === i ? null : i)} className="h-9 rounded-full border border-line-strong px-4 text-sm">{peek === i ? 'ซ่อน' : 'ดูเนื้อหา'}</button>
                  <button onClick={() => save(m)} className="inline-flex h-9 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg"><Download className="size-4" />ดาวน์โหลด</button>
                </div>
                {peek === i && <pre className="mt-3 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-lg bg-black/40 p-4 text-xs leading-relaxed">{m.content}</pre>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
