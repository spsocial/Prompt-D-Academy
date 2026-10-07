'use client';
import { useEffect, useRef } from 'react';

// Homepage promo clip: 16:9 on md+ screens, 9:16 on phones. preload="none" so only the one the visitor plays is downloaded.
export function PromoVideo() {
  return (
    <div className="relative mx-auto">
      <video
        className="mx-auto hidden aspect-video w-full rounded-2xl border border-line-strong bg-surface shadow-2xl md:block"
        src="/videos/promo_h.mp4" poster="/videos/promo_h.jpg" controls playsInline preload="none"
        aria-label="คลิปแนะนำ Prompt D Class"
      />
      <video
        className="mx-auto aspect-[9/16] w-full max-w-[380px] rounded-2xl border border-line-strong bg-surface shadow-2xl md:hidden"
        src="/videos/promo_v.mp4" poster="/videos/promo_v.jpg" controls playsInline preload="none"
        aria-label="คลิปแนะนำ Prompt D Class"
      />
    </div>
  );
}

// Vertical clip for login/register: plays muted on desktop, waits for a tap on phones (saves mobile data).
export function PromoVideoVertical({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) ref.current?.play().catch(() => {});
  }, []);
  return (
    <video ref={ref} className={className} src="/videos/promo_v.mp4" poster="/videos/promo_v.jpg"
      muted loop playsInline controls preload="none" aria-label="คลิปแนะนำ Prompt D Class" />
  );
}
