import type { Metadata } from 'next';
import { getCourses, getLessons } from '@/lib/data';
import { Dashboard } from '@/components/site/dashboard';

export const metadata: Metadata = { title: 'การเรียนของฉัน', robots: { index: false } };
export const revalidate = 600;

export default async function Page() {
  const courses = await getCourses();
  const lessons = Object.fromEntries(await Promise.all(courses.map(async (c) => [c.slug, (await getLessons(c.slug)).map((l) => ({ id: l.id, slug: l.slug, title: l.title }))] as const)));
  return <Dashboard courses={courses} lessons={lessons} />;
}
