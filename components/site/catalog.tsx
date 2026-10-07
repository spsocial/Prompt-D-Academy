'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Search, X, SlidersHorizontal, SearchX } from 'lucide-react';
import { CATEGORIES, LEVELS } from '@/lib/config';
import { cn, stripHtml } from '@/lib/utils';
import type { Course, Level } from '@/lib/types';
import { Container } from '@/components/ui/primitives';
import { CourseCard } from './course-card';

export function Catalog({ courses }: { courses: Course[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState(sp.get('q') ?? '');
  const cat = sp.get('cat') ?? '';
  const level = (sp.get('level') ?? '') as Level | '';
  const sort = sp.get('sort') ?? '';

  useEffect(() => { if (sp.get('focus')) inputRef.current?.focus(); }, [sp]);

  const setParam = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v); else p.delete(k);
    p.delete('focus');
    router.replace(`${path}${p.size ? `?${p}` : ''}`, { scroll: false });
  };

  // debounce search → URL (shareable / SEO-friendly)
  useEffect(() => {
    const t = setTimeout(() => { if ((sp.get('q') ?? '') !== q) setParam('q', q.trim()); }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const list = useMemo(() => {
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = courses.filter((c) => {
      if (cat && c.category !== cat) return false;
      if (level && c.level !== level) return false;
      if (!terms.length) return true;
      const hay = [c.title, c.subtitle, stripHtml(c.description), ...c.tags, ...c.tools].join(' ').toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    return sort === 'popular' ? [...filtered].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)) : filtered;
  }, [courses, q, cat, level, sort]);

  return (
    <>
      <div className="sticky top-[68px] z-30 border-y border-line bg-bg/80 backdrop-blur-xl">
        <Container className="flex flex-col gap-3 py-3 lg:flex-row lg:flex-wrap lg:items-center">
          <label className="relative flex h-12 flex-1 items-center rounded-full border border-line-strong bg-surface px-4 transition focus-within:border-fg/50 lg:max-w-sm">
            <Search className="size-[18px] text-muted" strokeWidth={1.75} />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาคอร์ส เครื่องมือ หรือสิ่งที่อยากทำ…" className="h-full flex-1 bg-transparent px-3 text-[15px] outline-none placeholder:text-muted" aria-label="ค้นหาคอร์ส" />
            {q && <button onClick={() => setQ('')} aria-label="ล้าง" className="grid size-7 place-items-center rounded-full hover:bg-surface-2"><X className="size-4" /></button>}
          </label>
          {/* mobile: one swipeable row with faded edges; desktop: own row, wraps so no chip gets clipped */}
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [mask-image:linear-gradient(90deg,transparent,#000_20px,#000_calc(100%-32px),transparent)] [scrollbar-width:none] lg:order-last lg:mx-0 lg:basis-full lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0 lg:[mask-image:none]">
            {[{ key: '', label: 'ทั้งหมด' }, ...CATEGORIES].map((c) => (
              <button key={c.key || 'all'} onClick={() => setParam('cat', c.key)}
                className={cn('h-10 shrink-0 rounded-full border px-4 text-sm transition', cat === c.key ? 'border-fg bg-fg text-bg' : 'border-line-strong text-fg-2 hover:border-fg/40 hover:text-fg')}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 lg:ml-auto">
            <SlidersHorizontal className="size-4 text-muted" strokeWidth={1.75} />
            <select value={level} onChange={(e) => setParam('level', e.target.value)} className="h-10 rounded-full border border-line-strong bg-surface px-4 text-sm text-fg-2 outline-none" aria-label="ระดับ">
              <option value="">ทุกระดับ</option>
              {(Object.keys(LEVELS) as Level[]).map((l) => <option key={l} value={l}>{LEVELS[l].label}</option>)}
            </select>
            <select value={sort} onChange={(e) => setParam('sort', e.target.value)} className="h-10 rounded-full border border-line-strong bg-surface px-4 text-sm text-fg-2 outline-none" aria-label="เรียงตาม">
              <option value="">แนะนำ</option>
              <option value="popular">ยอดนิยม</option>
            </select>
          </div>
        </Container>
      </div>
      <Container className="pt-10">
        <p className="mb-6 font-mono text-xs text-muted">พบ {list.length} คอร์ส{cat && ` · ${CATEGORIES.find((c) => c.key === cat)?.label}`}{q && ` · "${q}"`}</p>
        {list.length ? (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((c, i) => (
                <motion.div key={c.slug} layout initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .97 }} transition={{ duration: .35, ease: [0.16, 1, 0.3, 1] }}>
                  <CourseCard course={c} index={courses.indexOf(c) >= 0 ? courses.indexOf(c) : i} className="h-full" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="grid place-items-center rounded-[26px] border border-dashed border-line-strong py-24 text-center">
            <SearchX className="size-10 text-muted" strokeWidth={1.25} />
            <p className="mt-4 font-display text-2xl font-bold">ยังไม่มีคอร์สที่ตรงกับที่ค้นหา</p>
            <p className="mt-2 text-muted">ลองคำอื่น หรือดูคอร์สทั้งหมด</p>
            <button onClick={() => { setQ(''); router.replace(path); }} className="mt-6 rounded-full border border-line-strong px-5 py-2.5 text-sm hover:bg-surface">ล้างตัวกรอง</button>
          </div>
        )}
      </Container>
    </>
  );
}
