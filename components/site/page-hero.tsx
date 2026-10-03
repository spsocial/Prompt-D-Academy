import { Container, Eyebrow } from '@/components/ui/primitives';

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: React.ReactNode; lead?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="grid-lines absolute inset-0" aria-hidden />
      <Container className="relative py-16 lg:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">{title}</h1>
        {lead && <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-fg-2">{lead}</p>}
      </Container>
    </section>
  );
}

export function LegalBody({ children, updated }: { children: React.ReactNode; updated: string }) {
  return (
    <Container className="max-w-3xl py-14">
      <p className="font-mono text-xs text-muted">ปรับปรุงล่าสุด {updated}</p>
      <div className="prose prose-academy prose-lg mt-6 max-w-none">{children}</div>
    </Container>
  );
}
