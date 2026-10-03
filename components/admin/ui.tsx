'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, UploadCloud, X, Loader2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadFile } from '@/lib/admin-api';

// ───────── toast ─────────
type T = { id: number; msg: string; kind: 'ok' | 'err' };
const ToastCtx = createContext<(msg: string, kind?: 'ok' | 'err') => void>(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<T[]>([]);
  const push = useCallback((msg: string, kind: 'ok' | 'err' = 'ok') => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, msg, kind }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 3800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col gap-2">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 12, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 30 }}
              className={cn('pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur', t.kind === 'ok' ? 'border-[#1fae5b]/30 bg-surface/95' : 'border-red-500/40 bg-surface/95')}>
              {t.kind === 'ok' ? <CheckCircle2 className="size-5 shrink-0 text-[#1fae5b]" /> : <AlertCircle className="size-5 shrink-0 text-red-500" />}
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/** ห่อ action async — แสดง toast สำเร็จ/ผิดพลาดให้อัตโนมัติ */
export function useAction() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const run = useCallback(async <R,>(fn: () => Promise<R>, ok?: string) => {
    setBusy(true);
    try { const r = await fn(); if (ok) toast(ok); return r; } catch (e) { toast((e as Error).message || 'เกิดข้อผิดพลาด', 'err'); return undefined; } finally { setBusy(false); }
  }, [toast]);
  return { busy, run };
}

// ───────── layout bits ─────────
export function PageHeader({ title, sub, actions }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        {sub && <p className="mt-1.5 text-[15px] text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
export function Card({ className, title, desc, children }: { className?: string; title?: ReactNode; desc?: ReactNode; children: ReactNode }) {
  return (
    <section className={cn('rounded-[20px] border border-line bg-surface p-5 sm:p-6', className)}>
      {title && <h2 className="font-semibold">{title}</h2>}
      {desc && <p className="mt-0.5 text-sm text-muted">{desc}</p>}
      <div className={title ? 'mt-5' : ''}>{children}</div>
    </section>
  );
}
export function Field({ label, hint, children, className }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-sm font-medium text-fg-2">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
export const inputCls = 'h-11 w-full rounded-xl border border-line-strong bg-bg px-3.5 text-[15px] text-fg placeholder:text-muted outline-none transition focus:border-fg/50 focus:ring-4 focus:ring-fg/5';

export function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-4 rounded-xl py-1 text-left">
      <span><span className="block text-[15px] font-medium">{label}</span>{desc && <span className="block text-xs text-muted">{desc}</span>}</span>
      <span className={cn('relative h-6 w-11 shrink-0 rounded-full transition', checked ? 'bg-orange' : 'bg-line-strong')}>
        <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </span>
    </button>
  );
}

export function Segmented<V extends string>({ value, onChange, options }: { value: V; onChange: (v: V) => void; options: { value: V; label: string }[] }) {
  return (
    <div className="inline-flex rounded-xl border border-line-strong bg-bg p-1">
      {options.map((o) => (
        <button type="button" key={o.value} onClick={() => onChange(o.value)} className={cn('rounded-lg px-3.5 py-1.5 text-sm transition', value === o.value ? 'bg-fg text-bg' : 'text-fg-2 hover:text-fg')}>{o.label}</button>
      ))}
    </div>
  );
}

export function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [t, setT] = useState('');
  const add = () => { const v = t.trim(); if (v && !value.includes(v)) onChange([...value, v]); setT(''); };
  return (
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-line-strong bg-bg p-1.5 focus-within:border-fg/50">
      {value.map((v) => (
        <span key={v} className="flex items-center gap-1 rounded-lg bg-surface-2 py-1 pl-2.5 pr-1 text-sm">{v}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== v))} className="grid size-5 place-items-center rounded hover:bg-line" aria-label={`ลบ ${v}`}><X className="size-3" /></button>
        </span>
      ))}
      <input value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } if (e.key === 'Backspace' && !t && value.length) onChange(value.slice(0, -1)); }} onBlur={add}
        placeholder={value.length ? '' : placeholder} className="h-8 min-w-24 flex-1 bg-transparent px-1.5 text-[15px] outline-none placeholder:text-muted" />
    </div>
  );
}

/** ปุ่มลบแบบกดยืนยันสองครั้ง (ไม่ใช้ popup ของเบราว์เซอร์) */
export function ConfirmButton({ onConfirm, label = 'ลบ', className }: { onConfirm: () => void; label?: string; className?: string }) {
  const [armed, setArmed] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <button type="button" onClick={() => { if (armed) { clearTimeout(t.current); setArmed(false); onConfirm(); } else { setArmed(true); t.current = setTimeout(() => setArmed(false), 3000); } }}
      className={cn('inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm transition', armed ? 'bg-red-500 text-white' : 'text-muted hover:bg-red-500/10 hover:text-red-500', className)}>
      <Trash2 className="size-4" />{armed ? 'กดอีกครั้งเพื่อยืนยัน' : label}
    </button>
  );
}

/** อัปโหลดรูป (ลากวางหรือคลิก) → Firebase Storage */
export function ImageDrop({ value, onChange, folder, aspect = 'aspect-[16/10]', label = 'ลากรูปมาวาง หรือคลิกเพื่อเลือก' }: { value?: string; onChange: (url: string | undefined) => void; folder: string; aspect?: string; label?: string }) {
  const [pct, setPct] = useState<number | null>(null);
  const [over, setOver] = useState(false);
  const toast = useToast();
  const inp = useRef<HTMLInputElement>(null);
  const go = async (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast('ต้องเป็นไฟล์รูปภาพ', 'err');
    setPct(0);
    try { onChange(await uploadFile(folder, f, setPct)); toast('อัปโหลดรูปแล้ว'); } catch (e) { toast((e as Error).message, 'err'); } finally { setPct(null); }
  };
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); go(e.dataTransfer.files[0]); }}
      onClick={() => !value && inp.current?.click()}
      className={cn('group relative overflow-hidden rounded-2xl border-2 border-dashed transition', aspect, over ? 'border-orange bg-orange/5' : 'border-line-strong', !value && 'cursor-pointer hover:border-fg/40')}>
      <input ref={inp} type="file" accept="image/*" hidden onChange={(e) => go(e.target.files?.[0])} />
      {value ? (
        <>
          <Image src={value} alt="" fill sizes="600px" className="object-cover" />
          <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
            <button type="button" onClick={() => inp.current?.click()} className="rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-black">เปลี่ยนรูป</button>
            <button type="button" onClick={() => onChange(undefined)} className="rounded-lg bg-black/60 px-3 py-1.5 text-sm text-white">เอาออก</button>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-muted">
          <div><UploadCloud className="mx-auto mb-2 size-8" strokeWidth={1.25} />{label}<span className="mt-1 block text-xs">JPG, PNG, WEBP · แนะนำ 1600×1000</span></div>
        </div>
      )}
      {pct !== null && (
        <div className="absolute inset-0 grid place-items-center bg-bg/80 backdrop-blur">
          <div className="w-2/3 text-center"><Loader2 className="mx-auto size-6 animate-spin" /><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full bg-spectrum transition-all" style={{ width: `${pct}%` }} /></div><p className="mt-2 font-mono text-xs">{pct}%</p></div>
        </div>
      )}
    </div>
  );
}

export function StatusPill({ on, onLabel = 'เผยแพร่', offLabel = 'ฉบับร่าง' }: { on: boolean; onLabel?: string; offLabel?: string }) {
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', on ? 'bg-[#1fae5b]/12 text-[#1fae5b]' : 'bg-surface-2 text-muted')}><span className={cn('size-1.5 rounded-full', on ? 'bg-[#1fae5b]' : 'bg-muted')} />{on ? onLabel : offLabel}</span>;
}
