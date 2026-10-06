'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { markNoTrack, trackCourseView, trackLessonView } from '@/lib/track';

/** นับยอดเข้าชมคอร์ส/บทเรียน (ไม่แสดงอะไรบนหน้า) — รอรู้ก่อนว่าเป็นแอดมินไหม แอดมินไม่นับ */
export function TrackView({ slug, lessonId }: { slug: string; lessonId?: string }) {
  const { ready, user, profile, isAdmin } = useAuth();
  const known = ready && (!user || profile !== null);
  useEffect(() => {
    if (!known) return;
    if (isAdmin) { markNoTrack(); return; }
    trackCourseView(slug); // คนที่เข้าคอร์สนี้ (หน้าคอร์สหรือบทไหนก็ได้) นับครั้งเดียวต่อรอบ
    if (lessonId) trackLessonView(slug, lessonId);
  }, [known, isAdmin, slug, lessonId]);
  return null;
}
