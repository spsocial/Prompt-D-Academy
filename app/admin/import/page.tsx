'use client';

import { useEffect, useState } from 'react';
import { DatabaseZap, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { importLegacy, importSeed, previewLegacy } from '@/lib/admin-api';
import { SEED_COURSES } from '@/lib/seed';
import { Card, PageHeader, Segmented, Toggle, useAction } from '@/components/admin/ui';

export default function Import() {
  const [legacy, setLegacy] = useState<{ id: string; name: string; videos: number; imported: boolean }[] | null>(null);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const reload = () => previewLegacy().then((r) => { setLegacy(r.tools); setSel(new Set()); }).catch(() => setLegacy([]));
  const [publish, setPublish] = useState(false);
  const [access, setAccess] = useState<'free' | 'member'>('free');
  const [done, setDone] = useState<string>('');
  const [seedSel, setSeedSel] = useState<Set<string>>(new Set(SEED_COURSES.map((c) => c.slug)));
  const a = useAction(); const b = useAction();
  useEffect(() => { reload(); }, []);

  return (
    <>
      <PageHeader title="นำเข้าข้อมูล" sub="ย้ายคอร์สจากเว็บเวอร์ชันเก่า หรือเริ่มด้วยคอร์สตัวอย่าง — ไม่ทับข้อมูลที่มีอยู่แล้ว" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={<span className="flex items-center gap-2"><DatabaseZap className="size-5 text-orange" />คอร์สจากเว็บเดิม (AI Tools)</span>} desc="แปลงแต่ละ AI Tool เป็น 1 คอร์ส และวิดีโอ Google Drive เป็นบทเรียน · ฐานข้อมูลสมาชิกเดิมไม่ต้องย้าย ใช้ต่อได้ทันที">
          {legacy && legacy.some((t) => !t.imported) && (
            <div className="mb-2 flex items-center justify-between text-sm">
              <button type="button" onClick={() => setSel(sel.size ? new Set() : new Set(legacy.filter((t) => !t.imported).map((t) => t.id)))} className="text-fg-2 underline underline-offset-4">{sel.size ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด'}</button>
              <span className="font-mono text-xs text-muted">เลือกแล้ว {sel.size} คอร์ส</span>
            </div>
          )}
          <div className="max-h-80 overflow-y-auto rounded-xl border border-line">
            {legacy === null ? <p className="p-4 text-sm text-muted">กำลังตรวจสอบ…</p> : legacy.length ? legacy.map((t) => (
              <label key={t.id} className={`flex cursor-pointer items-center gap-3 border-b border-line px-4 py-2.5 text-sm last:border-0 hover:bg-surface-2 ${t.imported ? 'opacity-50' : ''}`}>
                <input type="checkbox" disabled={t.imported} checked={sel.has(t.id)} onChange={(e) => { const n = new Set(sel); if (e.target.checked) n.add(t.id); else n.delete(t.id); setSel(n); }} className="size-4 accent-[var(--orange)]" />
                <span className="flex-1">{t.name}</span>
                <span className="font-mono text-xs text-muted">{t.imported ? 'นำเข้าแล้ว' : `${t.videos} คลิป`}</span>
              </label>
            )) : <p className="p-4 text-sm text-muted">ไม่พบข้อมูลเดิม (หรืออยู่ในโหมดตัวอย่าง)</p>}
          </div>
          <div className="mt-5 space-y-3">
            <Toggle checked={publish} onChange={setPublish} label="เผยแพร่ทันที" desc="ปิดไว้เพื่อตรวจทาน/ใส่ปกก่อน แนะนำ" />
            <div><p className="mb-2 text-sm font-medium text-fg-2">สิทธิ์การดู</p><Segmented value={access} onChange={setAccess} options={[{ value: 'free', label: 'ฟรีทุกคน' }, { value: 'member', label: 'สมาชิก' }]} /></div>
          </div>
          <button disabled={a.busy || !sel.size} onClick={async () => { const n = await a.run(() => importLegacy({ publish, access, ids: [...sel] })); if (n !== undefined) { setDone(`นำเข้า ${n} คอร์สแล้ว`); reload(); } }}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-signal px-6 text-sm font-semibold text-white disabled:opacity-50">{a.busy && <Loader2 className="size-4 animate-spin" />}นำเข้า {sel.size || ''} คอร์สที่เลือก</button>
        </Card>
        <Card title={<span className="flex items-center gap-2"><Sparkles className="size-5 text-violet" />คอร์สตัวอย่าง 8 คอร์ส</span>} desc="โครงคอร์สพร้อมปกสวยๆ และบทเรียน (ยังไม่มีคลิป) — นำเข้าเป็นฉบับร่าง แล้วค่อยใส่คลิปจริง">
          <div className="rounded-xl border border-line">
            {SEED_COURSES.map((c) => (
              <label key={c.slug} className="flex cursor-pointer items-center gap-3 border-b border-line px-4 py-2.5 text-sm last:border-0 hover:bg-surface-2">
                <input type="checkbox" checked={seedSel.has(c.slug)} onChange={(e) => { const n = new Set(seedSel); if (e.target.checked) n.add(c.slug); else n.delete(c.slug); setSeedSel(n); }} className="size-4 accent-[var(--orange)]" />
                <span className="flex-1">{c.title}</span><span className="font-mono text-xs text-muted">{c.lessonCount} บท</span>
              </label>
            ))}
          </div>
          <button disabled={b.busy || !seedSel.size} onClick={() => b.run(() => importSeed([...seedSel]), 'นำเข้าคอร์สตัวอย่างแล้ว (ฉบับร่าง)')} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-semibold disabled:opacity-50">{b.busy && <Loader2 className="size-4 animate-spin" />}นำเข้า {seedSel.size} คอร์สตัวอย่าง</button>
        </Card>
      </div>
      {done && <p className="mt-6 flex items-center gap-2 text-[#1fae5b]"><CheckCircle2 className="size-5" />{done} — ไปที่ “คอร์ส & บทเรียน” เพื่อตรวจทาน</p>}
    </>
  );
}
