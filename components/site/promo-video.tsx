'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

// Muted autoplay while on screen. Hover unmutes when the browser allows it (page already clicked);
// otherwise hover shows a "click for sound" hint. Click / tap toggles sound. Leaving with the mouse mutes again.
function AutoVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const v = ref.current; if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else { v.pause(); v.muted = true; setMuted(true); }
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const setSound = (on: boolean) => {
    const v = ref.current; if (!v) return;
    v.muted = !on; setMuted(!on);
    if (v.paused) v.play().catch(() => {});
  };
  // Try sound on hover; if the browser blocks it (it pauses the clip), fall back to muted + "click for sound" hint.
  const tryHoverSound = () => {
    const v = ref.current; if (!v) return;
    v.muted = false; setMuted(false);
    const p = v.paused ? v.play() : Promise.resolve();
    p.catch(() => {}).finally(() => setTimeout(() => {
      if (v.paused || v.muted) { v.muted = true; setMuted(true); v.play().catch(() => {}); }
    }, 60));
  };

  return (
    <div
      className={cn('group relative cursor-pointer overflow-hidden', className)}
      onMouseEnter={() => { setHover(true); tryHoverSound(); }}
      onMouseLeave={() => { setHover(false); setSound(false); }}
      onClick={() => setSound(muted)}
    >
      <video ref={ref} className="block size-full object-cover" src={src} poster={poster}
        muted loop playsInline preload="none" aria-label="คลิปแนะนำ Prompt D Class" />
      <span className={cn('pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-bg/80 px-4 py-2 text-sm text-fg backdrop-blur transition',
        muted && hover ? 'opacity-100' : muted ? 'opacity-80' : 'opacity-60')}>
        {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        {muted ? (hover ? 'คลิกเพื่อเปิดเสียง' : 'เปิดเสียง') : 'ปิดเสียง'}
      </span>
    </div>
  );
}

// Homepage: 16:9 on md+ screens, 9:16 on phones.
export function PromoVideo() {
  return (
    <>
      <AutoVideo src="/videos/promo_h.mp4" poster="/videos/promo_h.jpg"
        className="mx-auto hidden aspect-video w-full max-w-2xl lg:max-w-none rounded-2xl border border-line-strong bg-surface shadow-2xl md:block" />
      <AutoVideo src="/videos/promo_v.mp4" poster="/videos/promo_v.jpg"
        className="mx-auto aspect-[9/16] w-full max-w-[300px] rounded-2xl border border-line-strong bg-surface shadow-2xl md:hidden" />
    </>
  );
}

// Login / register panel.
export function PromoVideoVertical({ className }: { className?: string }) {
  return <AutoVideo src="/videos/promo_v.mp4" poster="/videos/promo_v.jpg" className={className} />;
}
