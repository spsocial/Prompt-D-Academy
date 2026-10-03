import Image from 'next/image';
import { Container } from '@/components/ui/primitives';

const COVERS = ['claude-code-video', 'kling-short-film', 'thai-voice-ai', 'nano-banana-studio', 'ai-music-mv', 'vibe-coding-101'];

export function AuthShell({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <Container className="grid min-h-[calc(100dvh-68px)] items-center gap-14 py-12 lg:grid-cols-2">
      <div className="mx-auto w-full max-w-[420px]">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
        <h1 className="mt-3 font-display text-[2.6rem] font-extrabold leading-[1.08] tracking-tight">{title}</h1>
        <div className="mt-9">{children}</div>
      </div>
      <div className="relative hidden h-[640px] overflow-hidden rounded-[32px] border border-line lg:block" aria-hidden>
        <div className="absolute inset-0 grid -rotate-6 scale-125 grid-cols-2 gap-4 p-4">
          {[...COVERS, ...COVERS].map((c, i) => (
            <div key={i} className="relative aspect-[16/10] overflow-hidden rounded-2xl" style={{ transform: `translateY(${(i % 2) * 60}px)` }}>
              <Image src={`/covers/${c}.webp`} alt="" fill sizes="340px" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <p className="font-display text-3xl font-bold leading-snug">&ldquo;เรียนจบบทแรก<br />ก็ทำคลิปขายของได้เลย&rdquo;</p>
          <p className="mt-3 font-mono text-xs text-muted">— ผู้เรียน Prompt D Academy</p>
        </div>
      </div>
    </Container>
  );
}
