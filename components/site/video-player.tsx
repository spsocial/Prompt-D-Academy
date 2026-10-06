'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, Lock, Clapperboard } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { VideoSource } from '@/lib/types';
import { trackDecile, trackPlay, trackWatchSeconds } from '@/lib/track';

type Track = { slug: string; lessonId: string };

/** <video> ที่นับยอดกดเล่น + ดูถึงกี่ % (ทีละ 10%) + เวลาดูรวม */
function TrackedVideo({ url, track }: { url: string; track?: Track }) {
  const acc = useRef(0), last = useRef<number | null>(null);
  const flush = () => { if (track && acc.current >= 1) { trackWatchSeconds(track.slug, track.lessonId, acc.current); acc.current = 0; } };
  return (
    <video className="absolute inset-0 size-full" src={url} controls preload="metadata" playsInline controlsList="nodownload"
      onPlay={() => { if (track) trackPlay(track.slug, track.lessonId); }}
      onTimeUpdate={(e) => {
        const v = e.currentTarget;
        if (!track || !v.duration) return;
        const t = v.currentTime;
        if (last.current !== null && t > last.current && t - last.current < 2) acc.current += t - last.current; // ไม่นับตอนกรอข้าม
        last.current = t;
        const n = Math.min(10, Math.floor((t / v.duration) * 10 + 0.03));
        for (let k = 1; k <= n; k++) trackDecile(track.slug, track.lessonId, k);
        if (acc.current >= 30) flush();
      }}
      onSeeking={(e) => { last.current = e.currentTarget.currentTime; }}
      onPause={flush}
      onEnded={() => { if (track) trackDecile(track.slug, track.lessonId, 10); flush(); }}
    />
  );
}

export function VideoPlayer({ video, title, locked, track }: { video: VideoSource; title: string; locked?: boolean; track?: Track }) {
  const { user, ready } = useAuth();
  const path = usePathname();
  const [play, setPlay] = useState(false);
  const frame = 'relative aspect-video w-full overflow-hidden rounded-[22px] border border-line bg-black shadow-[0_40px_100px_-40px_rgba(0,0,0,.8)]';

  if (locked && ready && !user) {
    return (
      <div className={`${frame} grid place-items-center`}>
        <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(60% 80% at 50% 0%, color-mix(in oklab, var(--violet) 40%, transparent), transparent 70%)' }} />
        <div className="relative px-6 text-center text-white">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/10 backdrop-blur"><Lock className="size-6" /></span>
          <p className="mt-4 font-display text-2xl font-bold">เข้าสู่ระบบเพื่อดูคลิปบทเรียน</p>
          <p className="mt-1.5 text-white/70">สมัครสมาชิกฟรี ใช้เวลาไม่ถึง 30 วินาที</p>
          <div className="mt-6 flex justify-center gap-2">
            <Link href={`/register?next=${encodeURIComponent(path)}`} className="rounded-full bg-[var(--orange)] px-6 py-3 font-semibold">สมัครฟรี</Link>
            <Link href={`/login?next=${encodeURIComponent(path)}`} className="rounded-full border border-white/25 px-6 py-3">เข้าสู่ระบบ</Link>
          </div>
        </div>
      </div>
    );
  }

  if (video.type === 'youtube' && video.id) {
    return (
      <div className={frame}>
        {play ? (
          <iframe className="absolute inset-0 size-full" src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        ) : (
          <button onClick={() => { setPlay(true); if (track) trackPlay(track.slug, track.lessonId); }} className="group absolute inset-0" aria-label={`เล่นวิดีโอ ${title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`} onError={(e) => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`; }} alt="" className="absolute inset-0 size-full object-cover opacity-85 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-100" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-black shadow-2xl transition duration-500 ease-out-expo group-hover:scale-110">
              <Play className="ml-1 size-8 fill-current" />
            </span>
          </button>
        )}
      </div>
    );
  }
  if (video.type === 'drive' && video.id) {
    return <div className={frame}><iframe className="absolute inset-0 size-full" src={`https://drive.google.com/file/d/${video.id}/preview`} title={title} allow="autoplay; fullscreen" allowFullScreen /></div>;
  }
  if (video.type === 'file' && video.url) {
    return <div className={frame}><TrackedVideo url={video.url} track={track} /></div>;
  }
  return (
    <div className={`${frame} grid place-items-center bg-[#0c0e13]`}>
      <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(70% 90% at 20% 0%, color-mix(in oklab, var(--blue) 35%, transparent), transparent 70%), radial-gradient(60% 80% at 100% 100%, color-mix(in oklab, var(--orange) 30%, transparent), transparent 70%)' }} />
      <div className="relative text-center text-white">
        <Clapperboard className="mx-auto size-10 text-white/70" strokeWidth={1.25} />
        <p className="mt-3 font-display text-xl font-bold">คลิปบทนี้กำลังจะมา</p>
        <p className="mt-1 text-sm text-white/60">อ่านสรุปด้านล่างไปก่อนได้เลย</p>
      </div>
    </div>
  );
}
