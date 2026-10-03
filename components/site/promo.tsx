import Image from 'next/image';
import { ArrowUpRight, Zap } from 'lucide-react';
import type { Promo } from '@/lib/types';

/** แบนเนอร์ใหญ่ (หน้าแรก) */
export function PromoBanner({ promo }: { promo: Promo }) {
  return (
    <a href={promo.url} target="_blank" rel="noopener sponsored" className="group relative grid overflow-hidden rounded-[28px] border border-line bg-[#0c0e13] text-white md:grid-cols-[1.3fr_1fr]">
      <div className="absolute inset-0 opacity-80" style={{ background: 'radial-gradient(80% 120% at 0% 0%, color-mix(in oklab, var(--blue) 40%, transparent), transparent 60%), radial-gradient(70% 100% at 100% 100%, color-mix(in oklab, var(--orange) 45%, transparent), transparent 60%)' }} aria-hidden />
      <div className="relative p-8 sm:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white/80"><Zap className="size-3.5 text-[var(--orange)]" />เครื่องมือจาก Prompt D</span>
        <h3 className="mt-5 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-bold leading-tight">{promo.title}</h3>
        <p className="mt-3 max-w-md text-[16px] leading-relaxed text-white/70">{promo.text}</p>
        <span className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[#0c0e13] transition group-hover:gap-3">{promo.cta} <ArrowUpRight className="size-4" /></span>
      </div>
      <div className="relative min-h-[220px]">
        {promo.image ? (
          <Image src={promo.image} alt={promo.title} fill sizes="(min-width: 768px) 500px, 100vw" className="object-cover transition duration-700 ease-out-expo group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid grid-cols-3 gap-3 p-8 opacity-90">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} className="aspect-[9/16] w-16 rounded-xl border border-white/15 bg-white/5 backdrop-blur" style={{ transform: `translateY(${(i % 3) * 14 - 14}px) rotate(${(i % 3) * 3 - 3}deg)` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </a>
  );
}

/** การ์ดเล็ก (ข้างบทเรียน) */
export function PromoCard({ promo }: { promo: Promo }) {
  return (
    <a href={promo.url} target="_blank" rel="noopener sponsored" className="group block overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-line-strong">
      {promo.image && (
        <div className="relative aspect-[16/9]"><Image src={promo.image} alt="" fill sizes="320px" className="object-cover" /></div>
      )}
      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-orange">แนะนำ</p>
        <p className="mt-1.5 font-semibold leading-snug">{promo.title}</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{promo.text}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-fg group-hover:text-orange">{promo.cta}<ArrowUpRight className="size-3.5" /></span>
      </div>
    </a>
  );
}
