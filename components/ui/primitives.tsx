import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'outline' | 'signal';
const variants: Record<Variant, string> = {
  primary: 'bg-fg text-bg hover:bg-fg/90',
  signal: 'bg-signal text-white hover:brightness-110 shadow-[0_8px_30px_-8px_var(--orange)]',
  outline: 'border border-line-strong text-fg hover:border-fg/40 hover:bg-surface',
  ghost: 'text-fg-2 hover:text-fg hover:bg-surface-2',
};
const base = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out-expo disabled:opacity-50 disabled:pointer-events-none active:scale-[.97] select-none';
const sizes = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-5 text-[15px]', lg: 'h-13 px-7 text-base' };

export function Button({ variant = 'primary', size = 'md', className, ...p }: ComponentProps<'button'> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...p} />;
}
export function ButtonLink({ variant = 'primary', size = 'md', className, ...p }: ComponentProps<typeof Link> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...p} />;
}

/** small mono label, e.g. "01 / คอร์สแนะนำ" */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('font-mono text-[11px] uppercase tracking-[0.22em] text-muted', className)}>{children}</p>;
}

export function Chip({ children, className, active }: { children: ReactNode; className?: string; active?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide',
      active ? 'border-fg bg-fg text-bg' : 'border-line-strong text-fg-2', className)}>{children}</span>
  );
}

export function Container({ className, ...p }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-[1240px] px-5 sm:px-8', className)} {...p} />;
}

export function Input({ className, ...p }: ComponentProps<'input'>) {
  return <input className={cn('h-12 w-full rounded-xl border border-line-strong bg-surface px-4 text-[15px] text-fg placeholder:text-muted outline-none transition focus:border-fg/50 focus:ring-4 focus:ring-fg/5', className)} {...p} />;
}
export function Textarea({ className, ...p }: ComponentProps<'textarea'>) {
  return <textarea className={cn('w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-muted outline-none transition focus:border-fg/50 focus:ring-4 focus:ring-fg/5', className)} {...p} />;
}
export function Label({ className, ...p }: ComponentProps<'label'>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-fg-2', className)} {...p} />;
}
