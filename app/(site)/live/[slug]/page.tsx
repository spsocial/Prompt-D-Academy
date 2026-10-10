import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, Check, ChevronLeft, Clock, Gift, Users, Video } from 'lucide-react';
import { getLive, getLives } from '@/lib/data';
import { SITE } from '@/lib/config';
import { cleanHtml } from '@/lib/sanitize';
import { excerpt } from '@/lib/utils';
import { fmtLiveDate, fmtLiveTime, liveEnd } from '@/lib/live';
import { Container } from '@/components/ui/primitives';
import { LivePanel } from '@/components/site/live-panel';
import { LiveStream } from '@/components/site/live-stream';
import { JsonLd } from '@/components/site/json-ld';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getLives()).map((l) => ({ slug: l.slug }));
}

async function load(p: Promise<{ slug: string }>) {
  const { slug } = await p;
  return getLive(decodeURIComponent(slug));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const live = await load(params);
  if (!live) return {};
  const description = live.subtitle || excerpt(live.description);
  return {
    title: `${live.title} — คลาสสอนสดฟรี`, description,
    alternates: { canonical: `/live/${live.slug}` },
    openGraph: { title: live.title, description, type: 'website', url: `/live/${live.slug}`, ...(live.cover ? { images: [{ url: live.cover }] } : {}) },
  };
}

export default async function LivePage({ params }: { params: Promise<{ slug: string }> }) {
  const live = await load(params);
  if (!live) notFound();
  const url = `${SITE.url}/live/${live.slug}`;
  const html = cleanHtml(live.description);
  const meta = [
    { icon: CalendarDays, text: fmtLiveDate(live.startAt) },
    { icon: Clock, text: `${fmtLiveTime(live.startAt)} – ${fmtLiveTime(liveEnd(live))} น.` },
    { icon: Video, text: `สอนสดผ่าน ${live.platform}` },
    { icon: Users, text: live.streamOpen ? `${live.platform} ${live.capacity} ที่ + YouTube ไม่จำกัด` : `จำกัด ${live.capacity} ที่นั่ง` },
    { icon: Gift, text: 'เรียนฟรี' },
  ];

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'Event', name: live.title, description: live.subtitle || excerpt(live.description),
        startDate: new Date(live.startAt).toISOString(), endDate: new Date(liveEnd(live)).toISOString(),
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled',
        location: { '@type': 'VirtualLocation', url }, image: live.cover ? [live.cover] : undefined, isAccessibleForFree: true, inLanguage: 'th',
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'THB', availability: 'https://schema.org/InStock', url },
        organizer: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      }} />
      <Container className="grid gap-10 pb-16 pt-6 lg:grid-cols-[1fr_380px] lg:pt-8">
        <article className="min-w-0">
          <Link href="/live" className="group inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted hover:text-fg">
            <ChevronLeft className="size-3.5 transition group-hover:-translate-x-0.5" />คลาสสอนสด
          </Link>
          <LiveStream live={live}>
            {live.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={live.cover} alt={live.title} className="aspect-video w-full rounded-[22px] border border-line object-cover" />
            )}
          </LiveStream>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 font-mono text-xs font-semibold text-red-500">
            <span className="size-1.5 rounded-full bg-red-500" />LIVE · คลาสสอนสดฟรี
          </p>
          <h1 className="mt-3 font-display text-[clamp(1.9rem,3.8vw,2.9rem)] font-bold leading-[1.15] tracking-tight">{live.title}</h1>
          {live.subtitle && <p className="mt-3 text-lg text-fg-2">{live.subtitle}</p>}
          <ul className="mt-6 flex flex-wrap gap-2">
            {meta.map((m) => (
              <li key={m.text} className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm text-fg-2"><m.icon className="size-4 text-orange" />{m.text}</li>
            ))}
          </ul>

          <div className="lg:hidden"><div className="mt-8"><LivePanel live={live} pageUrl={url} /></div></div>

          {live.topics.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold">สอนอะไรบ้าง</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {live.topics.map((t) => (
                  <li key={t} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-orange text-white"><Check className="size-3.5" strokeWidth={3} /></span>
                    <span className="text-[15px]">{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {html && <div className="prose prose-academy prose-lg mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: html }} />}

          <section className="mt-10 rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-semibold">ก่อนเข้าเรียน</h2>
            <ul className="mt-3 space-y-2 text-[15px] text-fg-2">
              <li>• ลงทะเบียนด้วยบัญชีเว็บนี้ แล้วกลับมาที่หน้านี้ก่อนเวลาเริ่ม ลิงก์ห้องเรียนจะขึ้นให้อัตโนมัติ</li>
              {live.streamOpen && <li>• ที่นั่ง {live.platform} {live.capacity} คนแรกได้ลิงก์ห้องก่อน 15 นาที · คนที่ลงทะเบียนดูผ่าน YouTube ดูไลฟ์ในหน้านี้ได้ทันที และถ้าห้องยังว่าง ลองเข้าได้หลังเริ่ม 10 นาที</li>}
              <li>• เข้าผ่านคอมฯ (Chrome) หรือแอป {live.platform} บนมือถือก็ได้</li>
              <li>• เข้าห้องแล้วปิดไมค์ไว้ก่อน มีคำถามพิมพ์ในแชทได้เลย</li>
            </ul>
          </section>
        </article>

        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start"><LivePanel live={live} pageUrl={url} /></aside>
      </Container>
    </>
  );
}
