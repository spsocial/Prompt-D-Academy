import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, PlayCircle, BarChart3, Lock, ChevronRight, Infinity as InfinityIcon, MessagesSquare, FileText, Wrench, Users } from 'lucide-react';
import { getCourse, getCourses, getLessons, getSettings } from '@/lib/data';
import { LEVELS, MIN_PUBLIC_VIEWS, SITE, categoryLabel, fmtCount, fmtMinutes } from '@/lib/config';
import { cleanHtml } from '@/lib/sanitize';
import { excerpt, pad2 } from '@/lib/utils';
import { Container, Eyebrow } from '@/components/ui/primitives';
import { Reveal } from '@/components/ui/reveal';
import { CourseCover } from '@/components/site/course-cover';
import { CourseCard } from '@/components/site/course-card';
import { CourseCTA, LessonCheck } from '@/components/site/course-progress';
import { JsonLd } from '@/components/site/json-ld';
import { TrackView } from '@/components/site/track-view';
import { AdSlot } from '@/components/site/ads';

export const revalidate = 600;

export async function generateStaticParams() {
  return (await getCourses()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCourse(decodeURIComponent(slug));
  if (!c) return {};
  const title = c.seoTitle || `${c.title} — สอนฟรี`;
  const description = c.seoDescription || `${c.subtitle} · ${c.lessonCount} บทเรียน ${fmtMinutes(c.totalMinutes)} เรียนฟรี ภาษาไทย`;
  return {
    title, description,
    alternates: { canonical: `/courses/${c.slug}` },
    openGraph: { title, description, type: 'website', url: `/courses/${c.slug}`, ...(c.cover ? { images: [{ url: c.cover }] } : {}) },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const [course, lessons, all, settings] = await Promise.all([getCourse(slug), getLessons(slug), getCourses(), getSettings()]);
  if (!course) notFound();
  const related = all.filter((c) => c.slug !== slug && (c.category === course.category || c.tools.some((t) => course.tools.includes(t)))).slice(0, 3);
  const totalMin = lessons.reduce((s, l) => s + l.durationMin, 0) || course.totalMinutes;
  const url = `${SITE.url}/courses/${course.slug}`;

  return (
    <>
      <JsonLd data={[
        { '@context': 'https://schema.org', '@type': 'Course', name: course.title, description: course.subtitle || excerpt(course.description), url, inLanguage: 'th',
          provider: { '@type': 'Organization', name: SITE.name, sameAs: SITE.url }, isAccessibleForFree: course.access === 'free',
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'THB', category: 'Free' },
          hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: `PT${Math.max(1, totalMin)}M` },
          ...(course.cover ? { image: course.cover } : {}) },
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: SITE.url },
          { '@type': 'ListItem', position: 2, name: 'คอร์สทั้งหมด', item: `${SITE.url}/courses` },
          { '@type': 'ListItem', position: 3, name: course.title, item: url },
        ] },
      ]} />

      <TrackView slug={course.slug} />
      {/* ───── header ───── */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-lines absolute inset-0" aria-hidden />
        <div className="glow-orb -right-40 -top-20 size-[480px] bg-violet" aria-hidden />
        <Container className="relative grid gap-12 py-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-20">
          <div>
            <nav className="flex items-center gap-1.5 font-mono text-[11px] text-muted" aria-label="breadcrumb">
              <Link href="/courses" className="hover:text-fg">คอร์สทั้งหมด</Link><ChevronRight className="size-3" />
              <Link href={`/courses?cat=${course.category}`} className="hover:text-fg">{categoryLabel(course.category)}</Link>
            </nav>
            <h1 className="mt-5 font-display text-[clamp(2.3rem,5.4vw,4.2rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">{course.title}</h1>
            <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-fg-2">{course.subtitle}</p>
            <dl className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[14.5px] text-fg-2">
              <div className="flex items-center gap-2"><BarChart3 className="size-4 text-muted" strokeWidth={1.75} /><dt className="sr-only">ระดับ</dt><dd>{LEVELS[course.level]?.label}</dd></div>
              <div className="flex items-center gap-2"><PlayCircle className="size-4 text-muted" strokeWidth={1.75} /><dt className="sr-only">บทเรียน</dt><dd>{lessons.length || course.lessonCount} บทเรียน</dd></div>
              <div className="flex items-center gap-2"><Clock className="size-4 text-muted" strokeWidth={1.75} /><dt className="sr-only">ความยาว</dt><dd>{fmtMinutes(totalMin)}</dd></div>
              {(course.views ?? 0) >= MIN_PUBLIC_VIEWS && <div className="flex items-center gap-2"><Users className="size-4 text-muted" strokeWidth={1.75} /><dt className="sr-only">ผู้เรียน</dt><dd>{fmtCount(course.views!)} คนเข้าเรียน</dd></div>}
              {course.tools.length > 0 && <div className="flex items-center gap-2"><Wrench className="size-4 text-muted" strokeWidth={1.75} /><dt className="sr-only">เครื่องมือ</dt><dd>{course.tools.join(' · ')}</dd></div>}
            </dl>
            <div className="mt-9"><CourseCTA course={course} lessons={lessons.map((l) => ({ id: l.id, slug: l.slug }))} /></div>
          </div>
          <Reveal y={30}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-[30px] bg-spectrum opacity-25 blur-2xl" aria-hidden />
              <CourseCover course={course} priority className="relative aspect-[16/10] rounded-[24px] border border-line shadow-2xl" sizes="(min-width: 1024px) 560px, 100vw" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ───── body ───── */}
      <Container className="grid gap-14 py-16 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <Eyebrow>เนื้อหาคอร์ส</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">{lessons.length} บทเรียน · {fmtMinutes(totalMin)}</h2>
          <ol className="mt-8 overflow-hidden rounded-[22px] border border-line">
            {lessons.map((l, i) => (
              <li key={l.id} className="border-b border-line last:border-0">
                <Link href={`/courses/${course.slug}/${l.slug}`} className="group grid grid-cols-[2.6rem_1fr_auto] items-center gap-4 bg-surface/40 px-5 py-4.5 transition hover:bg-surface sm:px-6">
                  <span className="relative grid size-9 place-items-center rounded-full border border-line-strong font-mono text-xs text-fg-2 transition group-hover:border-orange group-hover:text-orange">
                    {pad2(i + 1)}
                    <LessonCheck courseSlug={course.slug} lessonId={l.id} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug transition group-hover:text-orange">{l.title}</span>
                    {l.summary && <span className="mt-0.5 block truncate text-[14px] text-muted">{l.summary}</span>}
                  </span>
                  <span className="flex items-center gap-3 font-mono text-xs text-muted">
                    {l.access === 'member' && <span className="flex items-center gap-1 rounded-full border border-line-strong px-2 py-0.5"><Lock className="size-3" />สมาชิก</span>}
                    {fmtMinutes(l.durationMin)}
                  </span>
                </Link>
              </li>
            ))}
            {!lessons.length && <li className="px-6 py-10 text-center text-muted">บทเรียนกำลังจะมาเร็วๆ นี้</li>}
          </ol>

          {course.description && (
            <div className="mt-16">
              <Eyebrow>รายละเอียด</Eyebrow>
              <div className="prose prose-academy prose-lg mt-4 max-w-none" dangerouslySetInnerHTML={{ __html: cleanHtml(course.description) }} />
            </div>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[22px] border border-line bg-surface p-6">
            <p className="font-display text-4xl font-extrabold">{course.access === 'free' ? 'ฟรี' : 'สมาชิกฟรี'}</p>
            <p className="mt-1 text-sm text-muted">{course.access === 'free' ? 'ดูได้ทันที ไม่ต้องสมัคร' : 'สมัครสมาชิกฟรีเพื่อดูทุกบท'}</p>
            <ul className="mt-6 space-y-3.5 text-[14.5px] text-fg-2">
              {[
                [PlayCircle, `${lessons.length} คลิปบทเรียน`],
                [FileText, 'บทความสรุปทุกบท'],
                [MessagesSquare, 'ถามตอบใต้บทเรียน'],
                [InfinityIcon, 'ดูซ้ำได้ไม่จำกัด'],
              ].map(([Icon, t]) => {
                const I = Icon as typeof PlayCircle;
                return <li key={t as string} className="flex items-center gap-3"><I className="size-[18px] text-orange" strokeWidth={1.75} />{t as string}</li>;
              })}
            </ul>
          </div>
          <AdSlot client={settings.adsenseClient} slot={settings.adSlotSidebar} />
        </aside>
      </Container>

      {related.length > 0 && (
        <section className="border-t border-line py-20">
          <Container>
            <Eyebrow>เรียนต่อ</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">คอร์สที่เกี่ยวข้อง</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => <CourseCard key={c.slug} course={c} index={all.indexOf(c)} className="h-full" />)}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
