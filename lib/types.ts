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
