// Live classes — shared helpers (time/phase/format) usable on server and client.
import type { LiveClass } from './types';

/** ลิงก์ห้องเรียนเปิดให้คนที่ลงทะเบียนเห็นก่อนเริ่มกี่นาที (ต้องตรงกับ openAt ใน liveSecrets) */
export const OPEN_BEFORE_MIN = 15;
/** ที่นั่ง Meet ที่ยังว่าง เปิดให้คนดูผ่าน YouTube ลองเข้าได้หลังเริ่มสอนกี่นาที (ต้องตรงกับ openAllAt ใน liveSecrets) */
export const SPARE_AFTER_MIN = 10;
const TZ = 'Asia/Bangkok';

export type LivePhase = 'upcoming' | 'open' | 'live' | 'ended';
export const liveEnd = (l: Pick<LiveClass, 'startAt' | 'durationMin'>) => l.startAt + l.durationMin * 60_000;
export function livePhase(l: Pick<LiveClass, 'startAt' | 'durationMin'>, now = Date.now()): LivePhase {
  if (now >= liveEnd(l)) return 'ended';
  if (now >= l.startAt) return 'live';
  if (now >= l.startAt - OPEN_BEFORE_MIN * 60_000) return 'open';
  return 'upcoming';
}

/** "อังคาร 13 ต.ค. 2569" */
export const fmtLiveDate = (ms: number) =>
  new Date(ms).toLocaleDateString('th-TH', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
/** "20:00" */
export const fmtLiveTime = (ms: number) => new Date(ms).toLocaleTimeString('th-TH', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
/** "อ. 13 ต.ค. · 20:00" */
export const fmtLiveShort = (ms: number) =>
  `${new Date(ms).toLocaleDateString('th-TH', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' })} · ${fmtLiveTime(ms)}`;

/** ลิงก์ "เพิ่มลง Google Calendar" */
export function calendarUrl(l: LiveClass, pageUrl: string) {
  const z = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const p = new URLSearchParams({
    action: 'TEMPLATE', text: l.title, dates: `${z(l.startAt)}/${z(liveEnd(l))}`,
    details: `คลาสสอนสดฟรี ผ่าน ${l.platform}\nลิงก์ห้องเรียนจะเปิดให้ในหน้าคลาส ${OPEN_BEFORE_MIN} นาทีก่อนเริ่ม:\n${pageUrl}`,
    location: pageUrl,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/** ดึง video id จากลิงก์ YouTube (youtube.com/live/ID, watch?v=ID, youtu.be/ID) หรือ id ตรงๆ */
export function youtubeId(input: string) {
  const s = input.trim();
  const m = s.match(/(?:youtube\.com\/(?:live\/|watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : '';
}
