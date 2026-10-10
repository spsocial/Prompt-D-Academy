export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Access = 'free' | 'member';
export type VideoType = 'youtube' | 'drive' | 'file' | 'none';

export interface VideoSource {
  type: VideoType;
  /** YouTube video id / Google Drive file id */
  id?: string;
  /** direct file url (Firebase Storage) */
  url?: string;
}

export interface Course {
  slug: string;
  title: string;
  subtitle: string;
  description: string; // HTML
  cover?: string;
  category: string;
  level: Level;
  tags: string[];
  tools: string[];
  access: Access;
  published: boolean;
  featured: boolean;
  order: number;
  lessonCount: number;
  totalMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: number;
  updatedAt?: number;
  /** จำนวนคนเข้าคอร์ส (จาก stats/{slug}.views) — เติมตอนอ่านฝั่งเซิร์ฟเวอร์ */
  views?: number;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  summary: string;
  video: VideoSource;
  durationMin: number;
  content: string; // HTML
  resources: { label: string; url: string }[];
  order: number;
  published: boolean;
  access: Access;
  updatedAt?: number;
}

export interface Promo {
  id: string;
  title: string;
  text: string;
  image?: string;
  url: string;
  cta: string;
  placement: 'home' | 'lesson' | 'all';
  active: boolean;
  order: number;
}

export interface SiteSettings {
  announcement?: string;
  announcementUrl?: string;
  lineUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  adsenseClient?: string;
  adSlotLesson?: string;
  adSlotSidebar?: string;
  adSlotList?: string;
  /** ต้องล็อกอินก่อนดูบทเรียน (ไม่ตั้ง = เปิดใช้) */
  requireLogin?: boolean;
}

export interface CommentDoc {
  id: string;
  courseSlug: string;
  lessonId: string;
  uid: string;
  name: string;
  photo?: string;
  text: string;
  createdAt: number;
  hidden?: boolean;
}

/** Firestore `users/{uid}` — โครงสร้างเดิมจากเว็บเวอร์ชันก่อน (เก็บไว้ทั้งหมด) */
export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider?: 'email' | 'google';
  isActive?: boolean;
  needsApproval?: boolean;
  isAdmin?: boolean;
  package?: string | null;
  createdAt?: unknown;
  lastLogin?: unknown;
  bio?: string;
  progress?: Record<string, { completed: number; lastWatchedVideo: string; completionPercent: number; watchedVideos: string[] }>;
}

/** stats/{courseSlug} — ตัวนับแบบไม่ระบุตัวตน (lib/track.ts) */
export interface LessonStats { views?: number; plays?: number; sec?: number; [decile: `d${number}`]: number | undefined }
export interface CourseStats {
  slug: string;
  views?: number;
  lessonViews?: number;
  days?: Record<string, number>;
  lessons?: Record<string, LessonStats>;
}

/** lives/{slug} — คลาสสอนสด (ลงทะเบียนผ่านเว็บ, ลิงก์ห้องเรียนเก็บแยกใน liveSecrets/{slug}) */
export interface LiveClass {
  slug: string;
  title: string;
  subtitle: string;
  description: string; // HTML
  cover?: string;
  /** เวลาเริ่ม (epoch ms) */
  startAt: number;
  durationMin: number;
  capacity: number;
  /** จำนวนคนลงทะเบียน (เพิ่มทีละ 1 ตอนลงทะเบียน — บังคับใน firestore.rules) */
  count?: number;
  topics: string[];
  platform: string;
  published: boolean;
  /** เปิดรับ "ดูสดผ่าน YouTube" (ไม่จำกัดที่นั่ง) */
  streamOpen?: boolean;
  /** จำนวนคนลงทะเบียนดูผ่าน YouTube (เพิ่มทีละ 1 — บังคับใน firestore.rules) */
  ytCount?: number;
  createdAt?: number;
  updatedAt?: number;
}
export interface LiveRegistration { uid: string; name: string; email: string; createdAt?: number }
