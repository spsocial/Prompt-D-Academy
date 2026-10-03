import Image from 'next/image';
import { categoryLabel } from '@/lib/config';
import { cn } from '@/lib/utils';
import type { Course } from '@/lib/types';

/** Generative motif per category — so courses without a cover image still look designed. */
function Motif({ cat }: { cat: string }) {
  const s = { stroke: 'currentColor', fill: 'none', strokeWidth: 1.2 } as const;
  switch (cat) {
    case 'ai-image':
      return <g {...s}>{[18, 34, 50, 66, 82].map((r, i) => <circle key={r} cx="300" cy="120" r={r} opacity={1 - i * 0.16} />)}{[0, 30, 60, 90, 120, 150].map((a) => <line key={a} x1="300" y1="120" x2={300 + 90 * Math.cos((a * Math.PI) / 180)} y2={120 + 90 * Math.sin((a * Math.PI) / 180)} opacity=".35" />)}</g>;
    case 'ai-video':
      return <g {...s}>{[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${200 + i * 46} ${60 + (i % 2) * 18}) rotate(${-6 + i * 3})`}><rect width="40" height="110" rx="4" opacity={0.25 + i * 0.15} />{[10, 30, 50, 70, 90].map((y) => <rect key={y} x="4" y={y} width="5" height="7" rx="1" opacity=".5" />)}</g>)}</g>;
    case 'ai-voice':
      return <g {...s}>{Array.from({ length: 34 }, (_, i) => { const h = 12 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 110; return <line key={i} x1={180 + i * 7} x2={180 + i * 7} y1={120 - h / 2} y2={120 + h / 2} strokeWidth="2.2" strokeLinecap="round" opacity={0.3 + (h / 122) * 0.7} />; })}</g>;
    case 'ai-coding':
      return <g {...s} fontFamily="monospace" fontSize="15" fill="currentColor" stroke="none">{['<Agent>', '  plan()', '  build()', '  ship()', '</Agent>'].map((t, i) => <text key={i} x="210" y={66 + i * 26} opacity={0.35 + i * 0.12}>{t}</text>)}</g>;
    case 'ai-business':
      return <g {...s}>{[30, 52, 44, 76, 70, 104, 128].map((h, i) => <rect key={i} x={200 + i * 26} y={190 - h} width="16" height={h} rx="3" opacity={0.25 + i * 0.1} />)}<polyline points="208,150 234,128 260,136 286,104 312,110 338,78 364,52" strokeWidth="2" /></g>;
    default:
      return <g {...s}>{[[230, 70], [300, 50], [360, 100], [320, 160], [250, 150], [290, 110]].map(([x, y], i, a) => <g key={i}><circle cx={x} cy={y} r="5" fill="currentColor" opacity=".7" />{a.slice(i + 1).map(([x2, y2], j) => <line key={j} x1={x} y1={y} x2={x2} y2={y2} opacity=".22" />)}</g>)}</g>;
  }
}

export function CourseCover({ course, index, className, sizes = '(min-width: 1024px) 400px, 100vw', priority }: { course: Course; index?: number; className?: string; sizes?: string; priority?: boolean }) {
  if (course.cover) {
    return (
      <div className={cn('relative overflow-hidden bg-surface-2', className)}>
        <Image src={course.cover} alt={course.title} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">
          <span className="rounded-full bg-black/35 px-2.5 py-1 backdrop-blur">{categoryLabel(course.category)}</span>
          {index !== undefined && <span>№ {String(index + 1).padStart(2, '0')}</span>}
        </div>
      </div>
    );
  }
  return (
    <div className={cn('relative overflow-hidden bg-[#0d0f14] text-white', className)}>
      <div className="absolute inset-0 opacity-90" style={{ background: 'radial-gradient(120% 90% at 85% 10%, color-mix(in oklab, var(--violet) 45%, transparent), transparent 55%), radial-gradient(90% 80% at 10% 100%, color-mix(in oklab, var(--orange) 35%, transparent), transparent 60%), radial-gradient(70% 60% at 100% 100%, color-mix(in oklab, var(--blue) 40%, transparent), transparent 60%)' }} />
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full text-white/80 transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"><Motif cat={course.category} /></svg>
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
          <span>{categoryLabel(course.category)}</span>
          {index !== undefined && <span>№ {String(index + 1).padStart(2, '0')}</span>}
        </div>
        <p className="max-w-[78%] font-display text-[clamp(1.1rem,2.2vw,1.55rem)] font-bold leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,.4)]">{course.title}</p>
      </div>
    </div>
  );
}
