'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';
import { FacebookIcon, LineIcon } from '@/components/ui/brand-icons';

/** facebook.com/profile.php?id=123 → m.me/123 · facebook.com/name → m.me/name */
function messengerUrl(fb?: string) {
  if (!fb) return undefined;
  try {
    const u = new URL(fb);
    const id = u.searchParams.get('id') || u.pathname.split('/').filter(Boolean)[0];
    return id && id !== 'profile.php' ? `https://m.me/${id}` : undefined;
  } catch { return undefined; }
}

const MessengerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.35.27.57l.05 1.78a.8.8 0 0 0 1.12.71l1.98-.87c.17-.08.36-.09.53-.04.91.25 1.88.39 2.91.39 5.64 0 10-4.13 10-9.7S17.64 2 12 2Zm6 7.46-2.94 4.66a1.5 1.5 0 0 1-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66a1.5 1.5 0 0 1 2.17-.4l2.34 1.75c.21.16.51.16.72 0l3.16-2.4c.42-.32.97.18.69.63Z" />
  </svg>
);

export function ContactFab({ lineUrl, facebookUrl }: { lineUrl?: string; facebookUrl?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', f); return () => document.removeEventListener('mousedown', f);
  }, []);
  const msg = messengerUrl(facebookUrl);
  const items = [
    lineUrl && { href: lineUrl, label: 'แชท LINE', sub: 'ตอบไวที่สุด', Icon: LineIcon, bg: '#06C755' },
    msg && { href: msg, label: 'Messenger', sub: 'ทักเพจ Prompt D', Icon: MessengerIcon, bg: '#0866FF' },
    facebookUrl && { href: facebookUrl, label: 'เพจ Facebook', sub: 'ติดตามคลิปใหม่', Icon: FacebookIcon, bg: '#1877F2' },
  ].filter(Boolean) as { href: string; label: string; sub: string; Icon: typeof LineIcon; bg: string }[];
  if (!items.length) return null;

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && items.map((it, i) => (
          <motion.a key={it.label} href={it.href} target="_blank" rel="noopener"
            initial={{ opacity: 0, y: 12, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: (items.length - 1 - i) * 0.05 } }} exit={{ opacity: 0, y: 8, scale: .9 }}
            className="group flex items-center gap-3 rounded-full border border-line bg-surface/95 py-1.5 pl-4 pr-1.5 shadow-xl shadow-black/20 backdrop-blur transition hover:border-line-strong">
            <span className="text-right leading-tight"><span className="block text-sm font-semibold">{it.label}</span><span className="text-[11px] text-muted">{it.sub}</span></span>
            <span className="grid size-10 place-items-center rounded-full text-white" style={{ background: it.bg }}><it.Icon className="size-5" /></span>
          </motion.a>
        ))}
      </AnimatePresence>
      <button onClick={() => setOpen((o) => !o)} aria-label={open ? 'ปิด' : 'ติดต่อเรา'} aria-expanded={open}
        className="relative grid size-14 place-items-center rounded-full bg-fg text-bg shadow-[0_12px_40px_-8px_rgba(0,0,0,.5)] transition-transform duration-300 hover:scale-105 active:scale-95">
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-orange/30 [animation-duration:2.4s]" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? 'x' : 'm'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: .18 }}>
            {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
