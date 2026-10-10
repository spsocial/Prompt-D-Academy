import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Clock, Download, ExternalLink } from 'lucide-react';
import { getCourse, getCourses, getLessons, getPromos, getSettings } from '@/lib/data';
import { SITE, fmtMinutes } from '@/lib/config';
import { cleanHtml } from '@/lib/sanitize';
import { excerpt, pad2, videoThumb } from '@/lib/utils';
import { Container } from '@/components/ui/primitives';
import { VideoPlayer } from '@/components/site/video-player';
import { TrackView } from '@/components/site/track-view';
import { LoginGate } from '@/components/site/login-gate';
import { Comments } from '@/components/site/comments';
import { Curriculum, MarkComplete, PrevNext } from '@/components/site/lesson-actions';
import { PromoCard } from '@/components/site/promo';
import { AdSlot } from '@/components/site/ads';
import { JsonLd } from '@/components/site/json-ld';
import { LessonContent } from '@/components/site/lesson-content';

export const revalidate = 600;

export async function generateStaticParams() {
  const courses = await getCourses();
  const out = await Promise.all(courses.map(async (c) => (await getLessons(c.slug)).map((l) => ({ slug: c.slug, lesson: l.slug }))));
  return out.flat();
}

async function load(p: Promise<{ slug: string; lesson: string }>) {
  const { slug: rs, lesson: rl } = await p;
  const slug = decodeURIComponent(rs), ls = decodeURIComponent(rl);
  const [course, lessons] = await Promise.all([getCourse(slug), getLessons(slug)]);
  const idx = lessons.findIndex((l) => l.slug === ls || l.id === ls);
  return { course, lessons, idx, lesson: idx >= 0 ? lessons[idx] : null };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lesson: string }> }): Promise<Metadata> {
  const { course, lesson } = await load(params);
  if (!course || !lesson) return {};
  const title = `${lesson.title} — ${course.title}`;
  const description = lesson.summary || excerpt(lesson.content) || course.subtitle;
  const img = videoThumb(lesson.video) || course.cover;
  return {
    title, description,
    alternates: { canonical: `/courses/${course.slug}/${lesson.slug}` },
    openGraph: { title, description, type: 'article', url: `/courses/${course.slug}/${lesson.slug}`, ...(img ? { images: [{ url: img }] } : {}) },
  };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lesson: string }> }) {
  const { course, lessons, idx, lesson } = await load(params);
  if (!course || !lesson) notFound();
  const [promos, settings] = await Promise.all([getPromos('lesson'), getSettings()]);
  const base = `/courses/${course.slug}`;
  const prev = lessons[idx - 1], next = lessons[idx + 1];
  const slim = lessons.map(({ id, slug, title, durationMin, access }) => ({ id, slug, title, durationMin, access }));
  const url = `${SITE.url}${base}/${lesson.slug}`;
  const html = cleanHtml(lesson.content);
  const gate = settings.requireLogin !== false || lesson.access === 'member';

  return (
    <>
      <JsonLd data={[
        { '@context': 'https://schema.org', '@type': 'LearningResource', name: lesson.title, description: lesson.summary || excerpt(lesson.content), url, inLanguage: 'th',
          isAccessibleForFree: lesson.access === 'free', isPartOf: { '@type': 'Course', name: course.title, url: `${SITE.url}${base}` }, timeRequired: `PT${Math.max(1, lesson.durationMin)}M` },
        ...(lesson.video.type === 'youtube' && lesson.video.id ? [{
          '@context': 'https://schema.org', '@type': 'VideoObject', name: lesson.title, description: lesson.summary || course.subtitle,
          thumbnailUrl: [videoThumb(lesson.video)], uploadDate: new Date(lesson.updatedAt || course.updatedAt || Date.now()).toISOString(),
          embedUrl: `https://www.youtube.com/embed/${lesson.video.id}`, duration: `PT${Math.max(1, lesson.durationMin)}M`,
        }] : []),
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'คอร์สทั้งหมด', item: `${SITE.url}/courses` },
          { '@type': 'ListItem', position: 2, name: course.title, item: `${SITE.url}${base}` },
          { '@type': 'ListItem', position: 3, name: lesson.title, item: url },
        ] },
      ]} />

      <Container className="grid gap-10 pb-10 pt-6 lg:grid-cols-[1fr_340px] lg:pt-8">
        <article className="min-w-0">
          <Link href={base} className="group inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted hover:text-fg">
            <ChevronLeft className="size-3.5 transition group-hover:-translate-x-0.5" />{course.title}
          </Link>
          <div className="mt-4"><TrackView slug={course.slug} lessonId={lesson.id} /><VideoPlayer video={lesson.video} title={lesson.title} locked={gate} track={{ slug: course.slug, lessonId: lesson.id }} /></div>

          <header className="mt-8">
            <p className="font-mono text-xs text-orange">บทที่ {pad2(idx + 1)} / {pad2(lessons.length)}</p>
            <h1 className="mt-2 font-display text-[clamp(1.8rem,3.6vw,2.7rem)] font-bold leading-[1.15] tracking-tight">{lesson.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <MarkComplete courseSlug={course.slug} lessonId={lesson.id} total={lessons.length} nextHref={next ? `${base}/${next.slug}` : undefined} />
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted"><Clock className="size-3.5" />{fmtMinutes(lesson.durationMin)}</span>
            </div>
          </header>

          <div className="rule-spectrum mt-8 opacity-60" />

          <LoginGate locked={gate}>
          {html && <LessonContent html={html} />}

          {lesson.resources.length > 0 && (
            <div className="mt-10 rounded-2xl border border-line bg-surface p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">ไฟล์ & ลิงก์ประกอบ</p>
              <ul className="mt-3 divide-y divide-line">
                {lesson.resources.map((r) => (
                  <li key={r.url}><a href={r.url} target="_blank" rel="noopener" className="flex items-center gap-3 py-3 text-[15px] hover:text-orange">
                    {/\.(zip|pdf|png|jpe?g|psd|mp3|mp4)(\?|$)/i.test(r.url) ? <Download className="size-4" /> : <ExternalLink className="size-4" />}{r.label}
                  </a></li>
                ))}
              </ul>
            </div>
          )}
          </LoginGate>

          <AdSlot client={settings.adsenseClient} slot={settings.adSlotLesson} className="mt-10" />
          <PrevNext base={base} prev={prev && slim[idx - 1]} next={next && slim[idx + 1]} />
          <Comments courseSlug={course.slug} lessonId={lesson.id} />
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Curriculum base={base} courseSlug={course.slug} lessons={slim} currentId={lesson.id} />
          {promos[0] && <PromoCard promo={promos[0]} />}
          <AdSlot client={settings.adsenseClient} slot={settings.adSlotSidebar} />
        </aside>
      </Container>
    </>
  );
}
