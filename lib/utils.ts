import clsx, { type ClassValue } from 'clsx';
import type { VideoSource } from './types';

export const cn = (...v: ClassValue[]) => clsx(v);

/** วางลิงก์อะไรก็ได้ → แยกเป็น YouTube / Google Drive / ไฟล์ตรง */
export function parseVideoLink(input: string): VideoSource {
  const s = input.trim();
  if (!s) return { type: 'none' };
  const yt = s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/) || (/^[\w-]{11}$/.test(s) ? [s, s] : null);
  if (yt) return { type: 'youtube', id: yt[1] };
  const dr = s.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]{20,})/);
  if (dr) return { type: 'drive', id: dr[1] };
  if (/^https?:\/\//.test(s)) return { type: 'file', url: s };
  if (/^[\w-]{25,}$/.test(s)) return { type: 'drive', id: s }; // legacy: plain Drive id
  return { type: 'none' };
}

export const videoThumb = (v: VideoSource) => (v.type === 'youtube' && v.id ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : undefined);

/** slug ภาษาไทยได้ (Google อ่าน URL ภาษาไทยได้ดี) */
export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || `item-${Date.now().toString(36)}`;
}

export const stripHtml = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

export const excerpt = (h: string, n = 155) => {
  const t = stripHtml(h);
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

export const pad2 = (n: number) => String(n).padStart(2, '0');
