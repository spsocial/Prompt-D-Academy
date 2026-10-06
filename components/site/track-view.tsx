'use client';

import { useEffect } from 'react';
import { trackCourseView, trackLessonView } from '@/lib/track';

/** นับยอดเข้าชมคอร์ส/บทเรียน (ไม่แสดงอะไรบนหน้า) */
export function TrackView({ slug, lessonId }: { slug: string; lessonId?: string }) {
  useEffect(() => {
    trackCourseView(slug); // คนที่เข้าคอร์สนี้ (หน้าคอร์สหรือบทไหนก็ได้) นับครั้งเดียวต่อรอบ
    if (lessonId) trackLessonView(slug, lessonId);
  }, [slug, lessonId]);
  return null;
}
