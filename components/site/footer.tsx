import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES, SITE } from '@/lib/config';
import type { SiteSettings } from '@/lib/types';
import { FacebookIcon, LineIcon, TikTokIcon, YouTubeIcon } from '@/components/ui/brand-icons';
import { Container } from '@/components/ui/primitives';
import { Logo } from './header';

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: settings.youtubeUrl, label: 'YouTube', Icon: YouTubeIcon },
    { href: settings.facebookUrl, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.tiktokUrl, label: 'TikTok', Icon: TikTokIcon },
    { href: settings.lineUrl, label: 'LINE', Icon: LineIcon },
  ].filter((s) => s.href);

  return (
    <footer className="relative mt-32 overflow-hidden border-t border-line">
      <Container className="relative">
        {/* giant outlined wordmark */}
        <p aria-hidden className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[19vw] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_var(--line-strong)] lg:text-[230px]">
          Prompt D
        </p>
        <div className="relative grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted">{SITE.description}</p>
            {settings.lineUrl && (
              <a href={settings.lineUrl} target="_blank" rel="noopener" className="group mt-7 inline-flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 pr-5 transition hover:border-[#06C755]/50">
                <span className="grid size-10 place-items-center rounded-xl bg-[#06C755] text-white"><LineIcon className="size-6" /></span>
                <span className="text-sm leading-tight"><span className="block font-semibold">รับแจ้งเตือนบทเรียนใหม่</span><span className="text-muted">เพิ่มเพื่อน LINE OA</span></span>
                <ArrowUpRight className="ml-2 size-4 text-muted transition group-hover:text-fg" />
              </a>
            )}
          </div>
          <div className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">หมวดหมู่</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {CATEGORIES.map((c) => <li key={c.key}><Link href={`/courses?cat=${c.key}`} className="text-fg-2 transition hover:text-fg">{c.label}</Link></li>)}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">เว็บไซต์</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {[['/courses', 'คอร์สทั้งหมด'], ['/about', 'เกี่ยวกับเรา'], ['/contact', 'ติดต่อเรา'], ['/register', 'สมัครสมาชิกฟรี']].map(([h, l]) => (
                <li key={h}><Link href={h} className="text-fg-2 transition hover:text-fg">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">ข้อกำหนด</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {[['/privacy', 'นโยบายความเป็นส่วนตัว'], ['/terms', 'เงื่อนไขการใช้งาน']].map(([h, l]) => (
                <li key={h}><Link href={h} className="text-fg-2 transition hover:text-fg">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative flex flex-col items-start justify-between gap-4 border-t border-line py-6 pb-28 text-[13px] text-muted sm:flex-row sm:items-center lg:pb-40">
          <p>© {new Date().getFullYear()} {SITE.name} · สอน AI ฟรีเพื่อคนไทย</p>
          <div className="flex items-center gap-1">
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener" aria-label={label} className="grid size-9 place-items-center rounded-full text-fg-2 transition hover:bg-surface-2 hover:text-fg"><Icon className="size-[17px]" /></a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
