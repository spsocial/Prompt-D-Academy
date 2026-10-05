import type { MetadataRoute } from 'next';
import { getCourses, getLessons } from '@/lib/data';
import { SITE } from '@/lib/config';

export const revalidate = 3600;

// Next writes image URLs into the XML unescaped; a Firebase "?alt=media&token=" URL breaks the whole sitemap
const xmlEsc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses();
  const now = new Date();
  const statics = ['', '/courses', '/about', '/contact', '/register', '/privacy', '/terms'].map((p) => ({
    url: `${SITE.url}${p}`, lastModified: now, changeFrequency: (p === '' || p === '/courses' ? 'daily' : 'monthly') as 'daily' | 'monthly', priority: p === '' ? 1 : p === '/courses' ? 0.9 : 0.4,
  }));
  const rows = await Promise.all(courses.map(async (c) => {
    const ls = await getLessons(c.slug);
    return [
      { url: `${SITE.url}/courses/${encodeURIComponent(c.slug)}`, lastModified: new Date(c.updatedAt || now), changeFrequency: 'weekly' as const, priority: 0.8, ...(c.cover ? { images: [xmlEsc(c.cover.startsWith('http') ? c.cover : `${SITE.url}${c.cover}`)] } : {}) },
      ...ls.map((l) => ({ url: `${SITE.url}/courses/${encodeURIComponent(c.slug)}/${encodeURIComponent(l.slug)}`, lastModified: new Date(l.updatedAt || c.updatedAt || now), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ];
  }));
  return [...statics, ...rows.flat()];
}
