'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarPlus, CheckCircle2, Loader2, Lock, Users, Video } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { isRegistered, liveRoomUrl, liveSeats, registerLive } from '@/lib/live-client';
import { OPEN_BEFORE_MIN, calendarUrl, livePhase, liveEnd } from '@/lib/live';
import type { LiveClass } from '@/lib/types';
import { cn } from '@/lib/utils';

function useNow(step = 1000) {
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

/** กล่องลงทะเบียน / นับถอยหลัง / ปุ่มเข้าห้องเรียน (ลิงก์โผล่เฉพาะคนลงทะเบียน 15 นาทีก่อนเริ่ม) */
export function LivePanel({ live, pageUrl }: { live: LiveClass; pageUrl: string }) {
  const { ready, user, profile } = useAuth();
  const path = usePathname();
  const now = useNow();
  const phase = livePhase(live, now);
  const [seats, setSeats] = useState({ count: live.count ?? 0, capacity: live.capacity });
  const [reg, setReg] = useState<boolean | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { liveSeats(live.slug).then(setSeats).catch(() => {}); }, [live.slug]);
  useEffect(() => {
    if (!ready) return;
    if (!user) { setReg(false); return; }
    isRegistered(live.slug, user.uid).then(setReg).catch(() => setReg(false));
  }, [ready, user, live.slug]);
  const roomOpen = phase === 'open' || phase === 'live';
  useEffect(() => { if (reg && roomOpen && !room) liveRoomUrl(live.slug).then(setRoom); }, [reg, roomOpen, room, live.slug]);

  const full = seats.count >= seats.capacity;
  const left = Math.max(0, seats.capacity - seats.count);
  const next = encodeURIComponent(path);

  async function onRegister() {
    if (!user) return;
    setBusy(true); setErr('');
    try {
      await registerLive(live.slug, user, profile?.displayName || user.displayName || user.email?.split('@')[0] || 'ผู้เรียน');
      setReg(true); setSeats((s) => ({ ...s, count: s.count + 1 }));
    } catch {
      const fresh = await liveSeats(live.slug).catch(() => seats);
      setSeats(fresh);
      setErr(fresh.count >= fresh.capacity ? 'ขออภัย ที่นั่งเต็มแล้ว' : 'ลงทะเบียนไม่สำเร็จ ลองใหม่อีกครั้ง');
    } finally { setBusy(false); }
  }

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
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-fg-2"><Users className="size-4" />ลงทะเบียนแล้ว {seats.count} / {seats.capacity} คน</span>
            <span className={cn('font-semibold', left <= 10 ? 'text-orange' : 'text-muted')}>{full ? 'เต็มแล้ว' : `เหลือ ${left} ที่`}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-spectrum" style={{ width: `${Math.min(100, (seats.count / Math.max(1, seats.capacity)) * 100)}%` }} />
          </div>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {phase === 'ended' ? (
          <Link href="/courses" className="flex h-12 items-center justify-center rounded-full border border-line-strong font-semibold">ดูคอร์สเรียนฟรีอื่นๆ</Link>
        ) : !ready || reg === null ? (
          <div className="h-12 animate-pulse rounded-full bg-surface-2" />
        ) : !user ? (
          <>
            <Link href={`/register?next=${next}`} className="flex h-12 items-center justify-center rounded-full bg-orange font-semibold text-white">สมัครฟรี แล้วลงทะเบียนเรียน</Link>
            <Link href={`/login?next=${next}`} className="flex h-11 items-center justify-center rounded-full border border-line-strong text-sm">มีบัญชีแล้ว? เข้าสู่ระบบ</Link>
          </>
        ) : reg ? (
          <>
            <p className="flex items-center gap-2 rounded-xl bg-[#1fae5b]/10 px-4 py-3 text-sm font-semibold text-[#1fae5b]"><CheckCircle2 className="size-5" />คุณลงทะเบียนเรียบร้อยแล้ว</p>
            {roomOpen ? (
              room ? (
                <a href={room} target="_blank" rel="noopener noreferrer" className={cn('flex h-14 items-center justify-center gap-2 rounded-full font-bold text-white', phase === 'live' ? 'animate-pulse bg-red-500' : 'bg-orange')}>
                  <Video className="size-5" />เข้าห้องเรียน {live.platform}
                </a>
              ) : (
                <p className="rounded-xl border border-line px-4 py-3 text-sm text-muted">กำลังโหลดลิงก์ห้องเรียน… ถ้ายังไม่ขึ้น ลองรีเฟรชหน้านี้</p>
              )
            ) : (
              <p className="flex items-start gap-2 rounded-xl border border-line px-4 py-3 text-sm text-fg-2"><Lock className="mt-0.5 size-4 shrink-0" />ลิงก์ห้องเรียน {live.platform} จะขึ้นตรงนี้ {OPEN_BEFORE_MIN} นาทีก่อนเริ่ม กลับมาที่หน้านี้ได้เลย</p>
            )}
            {liveEnd(live) > now && (
              <a href={calendarUrl(live, pageUrl)} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong text-sm"><CalendarPlus className="size-4" />เพิ่มลง Google Calendar</a>
            )}
          </>
        ) : full ? (
          <p className="rounded-xl border border-line px-4 py-3 text-center font-semibold text-muted">ที่นั่งเต็มแล้ว</p>
        ) : (
          <button onClick={onRegister} disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange font-semibold text-white disabled:opacity-70">
            {busy && <Loader2 className="size-4 animate-spin" />}ลงทะเบียนเรียนฟรี
          </button>
        )}
        {err && <p className="text-center text-sm text-red-500">{err}</p>}
      </div>
    </div>
  );
}
