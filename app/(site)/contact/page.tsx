import type { Metadata } from 'next';
import { ArrowUpRight, Mail } from 'lucide-react';
import { getSettings } from '@/lib/data';
import { Container } from '@/components/ui/primitives';
import { PageHero } from '@/components/site/page-hero';
import { FacebookIcon, LineIcon, TikTokIcon, YouTubeIcon } from '@/components/ui/brand-icons';

export const metadata: Metadata = { title: 'ติดต่อเรา', description: 'ติดต่อทีม Prompt D Class สอบถาม ร่วมงาน หรือแนะนำหัวข้อที่อยากเรียน', alternates: { canonical: '/contact' } };

export default async function Contact() {
  const s = await getSettings();
  const ch = [
    { href: s.lineUrl, label: 'LINE Official', sub: 'ตอบไวที่สุด', Icon: LineIcon, color: '#06C755' },
    { href: s.facebookUrl, label: 'Facebook', sub: 'เพจ Prompt D', Icon: FacebookIcon, color: '#1877F2' },
    { href: s.youtubeUrl, label: 'YouTube', sub: 'คลิปสอนทั้งหมด', Icon: YouTubeIcon, color: '#FF0033' },
    { href: s.tiktokUrl, label: 'TikTok', sub: 'ทริคสั้นๆ ทุกวัน', Icon: TikTokIcon, color: 'var(--fg)' },
  ].filter((c) => c.href);
  return (
    <>
      <PageHero eyebrow="ติดต่อเรา" title={<>อยากเรียนเรื่องไหน<br /><span className="text-spectrum">บอกเราได้เลย</span></>} lead="แนะนำหัวข้อ สอบถาม หรือติดต่อร่วมงาน — ช่องทางที่ตอบไวที่สุดคือ LINE" />
      <Container className="grid gap-4 py-16 sm:grid-cols-2">
        {ch.map(({ href, label, sub, Icon, color }) => (
          <a key={label} href={href} target="_blank" rel="noopener" className="group flex items-center gap-5 rounded-[22px] border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:border-line-strong">
            <span className="grid size-14 place-items-center rounded-2xl" style={{ background: `color-mix(in oklab, ${color} 14%, transparent)`, color }}><Icon className="size-7" /></span>
            <span className="flex-1"><span className="block font-display text-xl font-bold">{label}</span><span className="text-sm text-muted">{sub}</span></span>
            <ArrowUpRight className="size-5 text-muted transition group-hover:text-fg" />
          </a>
        ))}
        {!ch.length && (
          <div className="flex items-center gap-4 rounded-[22px] border border-dashed border-line-strong p-8 text-muted sm:col-span-2">
            <Mail className="size-6" strokeWidth={1.5} />ยังไม่ได้ตั้งค่าช่องทางติดต่อ (Admin › ตั้งค่าเว็บไซต์)
          </div>
        )}
      </Container>
    </>
  );
}
