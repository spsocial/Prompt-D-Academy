import { Container } from '@/components/ui/primitives';
import { PromoVideoVertical } from '@/components/site/promo-video';

// Login / register: form on the left, the vertical promo clip on the right (below the form on phones).
export function AuthShell({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <Container className="grid min-h-[calc(100dvh-68px)] items-center gap-14 py-12 lg:grid-cols-2">
      <div className="mx-auto w-full max-w-[420px]">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
        <h1 className="mt-3 font-display text-[2.6rem] font-extrabold leading-[1.08] tracking-tight">{title}</h1>
        <div className="mt-9">{children}</div>
      </div>
      <div className="relative mx-auto w-full max-w-[340px] lg:flex lg:h-[680px] lg:max-w-none lg:items-center lg:justify-center lg:overflow-hidden lg:rounded-[32px] lg:border lg:border-line lg:bg-surface/40">
        <div className="glow-orb -left-24 top-10 hidden size-[360px] bg-blue lg:block" aria-hidden />
        <div className="glow-orb -right-24 bottom-0 hidden size-[340px] bg-orange lg:block" aria-hidden />
        <div className="relative">
          <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-muted">เรียนที่นี่ยังไง? · 37 วิ</p>
          <PromoVideoVertical className="aspect-[9/16] w-full rounded-[26px] border border-line-strong bg-surface shadow-2xl lg:h-[590px] lg:w-auto" />
        </div>
      </div>
    </Container>
  );
}
