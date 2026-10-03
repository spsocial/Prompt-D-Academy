'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

declare global { interface Window { adsbygoogle?: unknown[] } }

export function AdSenseScript({ client }: { client?: string }) {
  if (!client) return null;
  return <Script async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`} />;
}

/**
 * ช่องโฆษณา — ถ้ายังไม่ตั้งค่า AdSense จะไม่แสดงอะไรเลย (ไม่ทิ้งช่องว่างให้เว็บดูรก)
 * ตั้งค่าได้ที่ Admin › ตั้งค่าเว็บไซต์
 */
export function AdSlot({ client, slot, className, format = 'auto' }: { client?: string; slot?: string; className?: string; format?: string }) {
  const ref = useRef<HTMLModElement>(null);
  const c = client || process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  useEffect(() => {
    if (!c || !slot || !ref.current || ref.current.dataset.loaded) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); ref.current.dataset.loaded = '1'; } catch {}
  }, [c, slot]);
  if (!c || !slot) return null;
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-line bg-surface/50 p-2', className)}>
      <span className="absolute right-3 top-1.5 font-mono text-[9px] uppercase tracking-widest text-muted">โฆษณา</span>
      <ins ref={ref} className="adsbygoogle block" style={{ display: 'block' }} data-ad-client={c} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive="true" />
    </div>
  );
}
