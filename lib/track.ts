'use client';
// Anonymous view/watch counters → stats/{courseSlug}. Fire-and-forget; never blocks the page.
// Shape: { views, lessonViews, days: { 'YYYY-MM-DD': n }, lessons: { [id]: { views, plays, sec, d1..d10 } } }
import { doc, setDoc, increment } from 'firebase/firestore';
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

function bump(slug: string, data: Record<string, unknown>) {
  if (!firebaseConfigured || !slug) return;
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
