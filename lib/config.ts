import type { Level } from './types';

export const SITE = {
  name: 'Prompt D Class',
  short: 'Prompt D',
  tagline: 'เรียน AI ให้ใช้เป็นจริง ฟรี',
  description:
    'สอนใช้ AI ฟรีแบบลงมือทำจริง ตั้งแต่ ChatGPT, Claude Code, Nano Banana, Kling ไปจนถึงทำคลิปและสร้างรายได้ด้วย AI — ภาษาไทย เข้าใจง่าย อัปเดตทุกสัปดาห์',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  locale: 'th_TH',
  author: 'Prompt D',
};

export const LEVELS: Record<Level, { label: string; short: string }> = {
  beginner: { label: 'เริ่มต้น', short: 'Lv.1' },
  intermediate: { label: 'กลาง', short: 'Lv.2' },
  advanced: { label: 'ขั้นสูง', short: 'Lv.3' },
};

/** หมวดหมู่หลัก — key ใช้ใน URL (?cat=) */
export const CATEGORIES: { key: string; label: string; blurb: string }[] = [
  { key: 'ai-basics', label: 'พื้นฐาน AI', blurb: 'เริ่มจากศูนย์ เข้าใจ AI และการเขียน Prompt' },
  { key: 'ai-image', label: 'ภาพด้วย AI', blurb: 'สร้างภาพ นางแบบ สินค้า และโปสเตอร์' },
  { key: 'ai-video', label: 'วิดีโอด้วย AI', blurb: 'ทำคลิป หนังสั้น MV และโฆษณา' },
  { key: 'ai-voice', label: 'เสียง & เพลง', blurb: 'พากย์เสียง โคลนเสียง แต่งเพลง' },
  { key: 'ai-coding', label: 'AI เขียนโค้ด', blurb: 'Vibe Coding, Claude Code สร้างเว็บและแอป' },
  { key: 'ai-business', label: 'ทำเงินด้วย AI', blurb: 'ขายของ ทำคอนเทนต์ และระบบอัตโนมัติ' },
];

export const categoryLabel = (key: string) => CATEGORIES.find((c) => c.key === key)?.label ?? key;

export const fmtMinutes = (m: number) => {
  if (!m) return '—';
  const h = Math.floor(m / 60);
  const r = Math.round(m % 60);
  return h ? `${h} ชม. ${r ? `${r} นาที` : ''}`.trim() : `${r} นาที`;
};

/** โชว์ยอดคนเรียนบนหน้าเว็บเมื่อถึงขั้นต่ำนี้ (ตัวเลขน้อยๆ ดูไม่น่าเชื่อถือ) */
export const MIN_PUBLIC_VIEWS = 30;
export const fmtCount = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1).replace(/\.0$/, '')}K` : String(n));
