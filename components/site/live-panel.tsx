'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarPlus, CheckCircle2, Loader2, Lock, Users, Video, MonitorPlay } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { isRegistered, isViewer, liveRoomUrl, liveSeats, registerLive, registerViewer } from '@/lib/live-client';
import { OPEN_BEFORE_MIN, SPARE_AFTER_MIN, calendarUrl, livePhase, liveEnd } from '@/lib/live';
import type { LiveClass } from '@/lib/types';
import { cn } from '@/lib/utils';

export function useNow(step = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), step); return () => clearInterval(t); }, [step]);
  return now;
}

function Countdown({ to, now }: { to: number; now: number }) {
  const s = Math.max(0, Math.floor((to - now) / 1000));
  const parts = [
    { v: Math.floor(s / 86400), l: 'วัน' }, { v: Math.floor((s % 86400) / 3600), l: 'ชม.' },
    { v: Math.floor((s % 3600) / 60), l: 'นาที' }, { v: s % 60, l: 'วิ' },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {parts.map((p) => (
        <div key={p.l} className="rounded-xl border border-line bg-bg py-2.5 text-center">
          <div className="font-display text-2xl font-bold tabular-nums">{String(p.v).padStart(2, '0')}</div>
          <div className="text-[11px] text-muted">{p.l}</div>
        </div>
      ))}
    </div>
  );
}

const nameOf = (u: { displayName: string | null; email: string | null }, profileName?: string) =>
  profileName || u.displayName || u.email?.split('@')[0] || 'ผู้เรียน';

/**
 * กล่องลงทะเบียน: ที่นั่ง Google Meet (จำกัด, คนจองก่อนได้ลิงก์ 15 นาทีก่อนเริ่ม)
 * + ดูสดผ่าน YouTube (ไม่จำกัด; หลังเริ่ม 10 นาทีลองเข้า Meet ได้ถ้ายังมีที่ว่าง)
 */
export function LivePanel({ live, pageUrl }: { live: LiveClass; pageUrl: string }) {
  const { ready, user, profile } = useAuth();
  const path = usePathname();
  const now = useNow();
  const phase = livePhase(live, now);
  const [seats, setSeats] = useState({ count: live.count ?? 0, capacity: live.capacity, ytCount: live.ytCount ?? 0 });
  const [reg, setReg] = useState<boolean | null>(null);
  const [viewer, setViewer] = useState<boolean | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { liveSeats(live.slug).then(setSeats).catch(() => {}); }, [live.slug]);
  useEffect(() => {
    if (!ready) return;
    if (!user) { setReg(false); setViewer(false); return; }
    isRegistered(live.slug, user.uid).then(setReg).catch(() => setReg(false));
    isViewer(live.slug, user.uid).then(setViewer).catch(() => setViewer(false));
  }, [ready, user, live.slug]);

  const roomOpen = phase === 'open' || phase === 'live';
  const spareOpen = phase === 'live' && now >= live.startAt + SPARE_AFTER_MIN * 60_000;
  useEffect(() => {
    if (room) return;
    if ((reg && roomOpen) || (viewer && spareOpen)) liveRoomUrl(live.slug).then(setRoom);
  }, [reg, viewer, roomOpen, spareOpen, room, live.slug]);

  const full = seats.count >= seats.capacity;
  const left = Math.max(0, seats.capacity - seats.count);
  const next = encodeURIComponent(path);

  async function onRegister() {
    if (!user) return;
    setBusy(true); setErr('');
    try {
      await registerLive(live.slug, user, nameOf(user, profile?.displayName));
      setReg(true); setSeats((s) => ({ ...s, count: s.count + 1 }));
    } catch {
      const fresh = await liveSeats(live.slug).catch(() => seats);
      setSeats(fresh);
      setErr(fresh.count >= fresh.capacity ? 'ขออภัย ที่นั่ง Meet เต็มแล้ว' : 'ลงทะเบียนไม่สำเร็จ ลองใหม่อีกครั้ง');
    } finally { setBusy(false); }
  }
  async function onViewer() {
    if (!user) return;
    setBusy(true); setErr('');
    try {
      await registerViewer(live.slug, user, nameOf(user, profile?.displayName));
      setViewer(true); setSeats((s) => ({ ...s, ytCount: s.ytCount + 1 }));
    } catch { setErr('ลงทะเบียนไม่สำเร็จ ลองใหม่อีกครั้ง'); } finally { setBusy(false); }
  }

  const calendar = liveEnd(live) > now && (
    <a href={calendarUrl(live, pageUrl)} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong text-sm"><CalendarPlus className="size-4" />เพิ่มลง Google Calendar</a>
  );

  return (
    <div className="rounded-[22px] border border-line bg-surface p-5 sm:p-6">
      {phase === 'live' ? (
        <p className="flex items-center gap-2 font-semibold text-red-500"><span className="relative flex size-2.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" /><span className="relative inline-flex size-2.5 rounded-full bg-red-500" /></span>กำลังสอนสดอยู่ตอนนี้</p>
      ) : phase === 'ended' ? (
        <p className="font-semibold text-muted">คลาสนี้จบแล้ว</p>
      ) : (
        <>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">{phase === 'open' ? 'ห้องเรียนเปิดแล้ว · เริ่มใน' : 'เริ่มสอนในอีก'}</p>
          <Countdown to={live.startAt} now={now} />
        </>
      )}

      {phase !== 'ended' && (
        <div className="mt-5 space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-fg-2"><Users className="size-4" />ที่นั่ง {live.platform} {seats.count} / {seats.capacity}</span>
              <span className={cn('font-semibold', left <= 10 ? 'text-orange' : 'text-muted')}>{full ? 'เต็มแล้ว' : `เหลือ ${left} ที่`}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-spectrum" style={{ width: `${Math.min(100, (seats.count / Math.max(1, seats.capacity)) * 100)}%` }} />
            </div>
          </div>
          {live.streamOpen && (
            <p className="flex items-center gap-1.5 text-sm text-fg-2"><MonitorPlay className="size-4 text-red-500" />ดูสดผ่าน YouTube {seats.ytCount} คน · ไม่จำกัดที่นั่ง</p>
          )}
        </div>
      )}

      <div className="mt-5 space-y-3">
        {phase === 'ended' ? (
          <Link href="/courses" className="flex h-12 items-center justify-center rounded-full border border-line-strong font-semibold">ดูคอร์สเรียนฟรีอื่นๆ</Link>
        ) : !ready || reg === null || viewer === null ? (
          <div className="h-12 animate-pulse rounded-full bg-surface-2" />
        ) : !user ? (
          <>
            <Link href={`/register?next=${next}`} className="flex h-12 items-center justify-center rounded-full bg-orange font-semibold text-white">สมัครฟรี แล้วลงทะเบียนเรียน</Link>
            <Link href={`/login?next=${next}`} className="flex h-11 items-center justify-center rounded-full border border-line-strong text-sm">มีบัญชีแล้ว? เข้าสู่ระบบ</Link>
          </>
        ) : reg ? (
          <>
            <p className="flex items-center gap-2 rounded-xl bg-[#1fae5b]/10 px-4 py-3 text-sm font-semibold text-[#1fae5b]"><CheckCircle2 className="size-5" />คุณได้ที่นั่งใน {live.platform} แล้ว</p>
            {roomOpen ? (
              room ? (
                <a href={room} target="_blank" rel="noopener noreferrer" className={cn('flex h-14 items-center justify-center gap-2 rounded-full font-bold text-white', phase === 'live' ? 'animate-pulse bg-red-500' : 'bg-orange')}>
                  <Video className="size-5" />เข้าห้องเรียน {live.platform}
                </a>
              ) : (
                <p className="rounded-xl border border-line px-4 py-3 text-sm text-muted">กำลังโหลดลิงก์ห้องเรียน… ถ้ายังไม่ขึ้น ลองรีเฟรชหน้านี้</p>
              )
            ) : (
              <p className="flex items-start gap-2 rounded-xl border border-line px-4 py-3 text-sm text-fg-2"><Lock className="mt-0.5 size-4 shrink-0" />ลิงก์ห้องเรียนจะขึ้นตรงนี้ {OPEN_BEFORE_MIN} นาทีก่อนเริ่ม · เข้าห้องภายใน {SPARE_AFTER_MIN} นาทีแรกเพื่อรักษาที่นั่งของคุณ</p>
            )}
            {calendar}
          </>
        ) : viewer ? (
          <>
            <p className="flex items-center gap-2 rounded-xl bg-[#1fae5b]/10 px-4 py-3 text-sm font-semibold text-[#1fae5b]"><CheckCircle2 className="size-5" />คุณลงทะเบียนดูสดผ่าน YouTube แล้ว</p>
            {roomOpen ? (
              <p className="rounded-xl border border-line px-4 py-3 text-sm text-fg-2">ไลฟ์จะขึ้นด้านบนของหน้านี้ · ถามคำถามในแชท YouTube ได้เลย</p>
            ) : (
              <p className="flex items-start gap-2 rounded-xl border border-line px-4 py-3 text-sm text-fg-2"><Lock className="mt-0.5 size-4 shrink-0" />ไลฟ์จะขึ้นในหน้านี้ {OPEN_BEFORE_MIN} นาทีก่อนเริ่ม กลับมาที่หน้านี้ได้เลย</p>
            )}
            {spareOpen && room && (
              <a href={room} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-full bg-orange font-semibold text-white"><Video className="size-5" />ยังมีที่ว่าง? ลองเข้าห้อง {live.platform}</a>
            )}
            {!spareOpen && (
              <p className="text-xs text-muted">ถ้าห้อง {live.platform} ยังมีที่ว่าง หลังเริ่มสอน {SPARE_AFTER_MIN} นาที จะมีปุ่มให้ลองเข้าห้องได้</p>
            )}
            {calendar}
          </>
        ) : !full ? (
          <button onClick={onRegister} disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange font-semibold text-white disabled:opacity-70">
            {busy && <Loader2 className="size-4 animate-spin" />}จองที่นั่ง {live.platform} ฟรี
          </button>
        ) : live.streamOpen ? (
          <>
            <p className="rounded-xl border border-line px-4 py-3 text-sm text-fg-2">ที่นั่ง {live.platform} ({seats.capacity} คนแรก) เต็มแล้ว แต่ยังดูสดได้ผ่าน YouTube <b>ไม่จำกัดที่นั่ง</b> ถามในแชทได้ และถ้าห้องมีที่ว่าง ลองเข้าได้หลังเริ่ม {SPARE_AFTER_MIN} นาที</p>
            <button onClick={onViewer} disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-red-600 font-semibold text-white disabled:opacity-70">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <MonitorPlay className="size-5" />}ลงทะเบียนดูสดผ่าน YouTube ฟรี
            </button>
          </>
        ) : (
          <p className="rounded-xl border border-line px-4 py-3 text-center font-semibold text-muted">ที่นั่งเต็มแล้ว</p>
        )}
        {err && <p className="text-center text-sm text-red-500">{err}</p>}
      </div>
    </div>
  );
}
