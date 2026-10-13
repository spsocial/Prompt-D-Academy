'use client';
// Anonymous view/watch counters → stats/{courseSlug}. Fire-and-forget; never blocks the page.
// Shape: { views, lessonViews, days: { 'YYYY-MM-DD': n }, lessons: { [id]: { views, plays, sec, d1..d10 } } }
import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase/client';
import { firebaseConfigured } from './firebase/config';

const bkkDay = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);

/** true only the first time this key is seen in this browser tab session (refresh spam guard) */
export function firstTime(key: string) {
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, '1');
  } catch { /* storage blocked → still count */ }
  return true;
}

/** แอดมินไม่นับ — จำไว้ในเครื่องเมื่อเคยล็อกอินเป็นแอดมิน */
const NO_TRACK = 'pd:noTrack';
export function markNoTrack() { try { localStorage.setItem(NO_TRACK, '1'); } catch { /* ignore */ } }
const skipped = () => { try { return localStorage.getItem(NO_TRACK) === '1'; } catch { return false; } };

function bump(slug: string, data: Record<string, unknown>) {
  if (!firebaseConfigured || !slug || skipped()) return;
  setDoc(doc(db(), 'stats', slug), data, { merge: true }).catch(() => {});
}

export function trackCourseView(slug: string) {
  if (!firstTime(`pdv:c:${slug}`)) return;
  bump(slug, { views: increment(1), days: { [bkkDay()]: increment(1) } });
}

export function trackLessonView(slug: string, lessonId: string) {
  if (!firstTime(`pdv:l:${slug}:${lessonId}`)) return;
  bump(slug, { lessonViews: increment(1), lessons: { [lessonId]: { views: increment(1) } } });
}

export function trackPlay(slug: string, lessonId: string) {
  if (!firstTime(`pdv:p:${slug}:${lessonId}`)) return;
  bump(slug, { lessons: { [lessonId]: { plays: increment(1) } } });
}

/** reached decile n (1..10 = 10%..100%) of the video */
export function trackDecile(slug: string, lessonId: string, n: number) {
  if (!firstTime(`pdv:d:${slug}:${lessonId}:${n}`)) return;
  bump(slug, { lessons: { [lessonId]: { [`d${n}`]: increment(1) } } });
}

export function trackWatchSeconds(slug: string, lessonId: string, sec: number) {
  const s = Math.round(sec);
  if (s < 1 || s > 3600) return;
  bump(slug, { lessons: { [lessonId]: { sec: increment(s) } } });
}

/** คลาสสด: นับรายคน (เฉพาะคนลงทะเบียน — rules ตรวจ) → liveStats/{slug}/seen/{uid}
 *  open = เปิดหน้าย้อนหลัง · play = กดเล่นคลิปย้อนหลัง · download/read = ไฟล์แจก */
export type LiveEvent = 'open' | 'play' | 'download' | 'read';
const LIVE_FIELD: Record<LiveEvent, string> = { open: 'opens', play: 'plays', download: 'downloads', read: 'reads' };
export function trackLive(slug: string, uid: string, name: string, ev: LiveEvent) {
  if (!firebaseConfigured || !slug || !uid || skipped()) return;
  if ((ev === 'open' || ev === 'play') && !firstTime(`pdv:live:${ev}:${slug}`)) return;
  setDoc(doc(db(), 'liveStats', slug, 'seen', uid), { uid, name, lastAt: serverTimestamp(), [LIVE_FIELD[ev]]: increment(1) }, { merge: true }).catch(() => {});
}
