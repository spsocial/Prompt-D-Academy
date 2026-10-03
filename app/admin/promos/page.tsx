'use client';

import { useEffect, useState } from 'react';
import { Plus, Save, Loader2 } from 'lucide-react';
import { deletePromo, listPromos, savePromo } from '@/lib/admin-api';
import type { Promo } from '@/lib/types';
import { Card, ConfirmButton, Field, ImageDrop, PageHeader, Segmented, Toggle, inputCls, useAction } from '@/components/admin/ui';
import { PromoBanner, PromoCard } from '@/components/site/promo';

const blank = (n: number): Promo => ({ id: '', title: '', text: '', url: 'https://', cta: 'ดูรายละเอียด', placement: 'all', active: true, order: n + 1 });

function PromoEditor({ initial, onSaved, onDeleted }: { initial: Promo; onSaved: (p: Promo) => void; onDeleted: () => void }) {
  const [p, setP] = useState(initial);
  const { busy, run } = useAction();
  const set = <K extends keyof Promo>(k: K, v: Promo[K]) => setP((x) => ({ ...x, [k]: v }));
  return (
    <Card>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="grid content-start gap-4">
          <Field label="ชื่อสินค้า / หัวข้อ"><input className={inputCls} value={p.title} onChange={(e) => set('title', e.target.value)} placeholder="PD Auto — ทำคลิปขายของอัตโนมัติ" /></Field>
          <Field label="ข้อความ"><textarea className={`${inputCls} h-auto py-2.5`} rows={2} value={p.text} onChange={(e) => set('text', e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ลิงก์ปลายทาง"><input className={inputCls} value={p.url} onChange={(e) => set('url', e.target.value)} /></Field>
            <Field label="ข้อความปุ่ม"><input className={inputCls} value={p.cta} onChange={(e) => set('cta', e.target.value)} /></Field>
          </div>
          <Field label="แสดงที่"><Segmented value={p.placement} onChange={(v) => set('placement', v)} options={[{ value: 'all', label: 'ทุกที่' }, { value: 'home', label: 'หน้าแรก' }, { value: 'lesson', label: 'หน้าบทเรียน' }]} /></Field>
          <Toggle checked={p.active} onChange={(v) => set('active', v)} label="เปิดแสดงผล" />
          <Field label="รูปประกอบ (ไม่ใส่ก็ได้)"><ImageDrop value={p.image} onChange={(v) => set('image', v)} folder="promos" aspect="aspect-[16/9]" /></Field>
          <div className="flex items-center gap-2 pt-2">
            <button onClick={async () => { const id = await run(() => savePromo(p), 'บันทึกโปรโมทแล้ว'); if (id) { const np = { ...p, id }; setP(np); onSaved(np); } }} disabled={busy}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg">{busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}บันทึก</button>
            {p.id && <ConfirmButton onConfirm={async () => { const ok = await run(async () => { await deletePromo(p.id); return true; }, 'ลบแล้ว'); if (ok) onDeleted(); }} />}
          </div>
        </div>
        <div className="space-y-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">ตัวอย่างบนเว็บ</p>
          <div className="pointer-events-none"><PromoBanner promo={p} /></div>
          <div className="pointer-events-none max-w-[320px]"><PromoCard promo={p} /></div>
        </div>
      </div>
    </Card>
  );
}

export default function Promos() {
  const [items, setItems] = useState<Promo[] | null>(null);
  useEffect(() => { listPromos().then(setItems); }, []);
  return (
    <>
      <PageHeader title="โปรโมทสินค้า" sub="แบนเนอร์ขายโปรแกรม/สินค้าของคุณ แสดงในหน้าแรกและข้างบทเรียน"
        actions={<button onClick={() => setItems((x) => [...(x ?? []), blank(x?.length ?? 0)])} className="inline-flex h-10 items-center gap-2 rounded-full bg-signal px-5 text-sm font-semibold text-white"><Plus className="size-4" />เพิ่มโปรโมท</button>} />
      <div className="space-y-6">
        {items?.map((p, i) => (
          <PromoEditor key={p.id || `new-${i}`} initial={p}
            onSaved={(np) => setItems((x) => x?.map((y, k) => (k === i ? np : y)) ?? x)}
            onDeleted={() => setItems((x) => x?.filter((_, k) => k !== i) ?? x)} />
        ))}
        {items && !items.length && <div className="rounded-2xl border border-dashed border-line-strong p-12 text-center text-muted">ยังไม่มีโปรโมท — กด “เพิ่มโปรโมท”</div>}
      </div>
    </>
  );
}
