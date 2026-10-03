'use client';

import { useEffect, useState } from 'react';
import { DatabaseZap, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { importLegacy, importSeed, previewLegacy } from '@/lib/admin-api';
import { Card, PageHeader, Segmented, Toggle, useAction } from '@/components/admin/ui';

export default function Import() {
  const [legacy, setLegacy] = useState<{ id: string; name: string; videos: number }[] | null>(null);
  const [publish, setPublish] = useState(false);
  const [access, setAccess] = useState<'free' | 'member'>('free');
  const [done, setDone] = useState<string>('');
  const a = useAction(); const b = useAction();
  useEffect(() => { previewLegacy().then((r) => setLegacy(r.tools)).catch(() => setLegacy([])); }, []);

  return (
    <>
      <PageHeader title="นำเข้าข้อมูล" sub="ย้ายคอร์สจากเว็บเวอร์ชันเก่า หรือเริ่มด้วยคอร์สตัวอย่าง — ไม่ทับข้อมูลที่มีอยู่แล้ว" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={<span className="flex items-center gap-2"><DatabaseZap className="size-5 text-orange" />คอร์สจากเว็บเดิม (AI Tools)</span>} desc="แปลงแต่ละ AI Tool เป็น 1 คอร์ส และวิดีโอ Google Drive เป็นบทเรียน · ฐานข้อมูลสมาชิกเดิมไม่ต้องย้าย ใช้ต่อได้ทันที">
          <div className="max-h-56 overflow-y-auto rounded-xl border border-line">
            {legacy === null ? <p className="p-4 text-sm text-muted">กำลังตรวจสอบ…</p> : legacy.length ? legacy.map((t) => (
              <div key={t.id} className="flex justify-between border-b border-line px-4 py-2.5 text-sm last:border-0"><span>{t.name}</span><span className="font-mono text-xs text-muted">{t.videos} คลิป</span></div>
            )) : <p className="p-4 text-sm text-muted">ไม่พบข้อมูลเดิม (หรืออยู่ในโหมดตัวอย่าง)</p>}
          </div>
          <div className="mt-5 space-y-3">
            <Toggle checked={publish} onChange={setPublish} label="เผยแพร่ทันที" desc="ปิดไว้เพื่อตรวจทาน/ใส่ปกก่อน แนะนำ" />
            <div><p className="mb-2 text-sm font-medium text-fg-2">สิทธิ์การดู</p><Segmented value={access} onChange={setAccess} options={[{ value: 'free', label: 'ฟรีทุกคน' }, { value: 'member', label: 'สมาชิก' }]} /></div>
          </div>
          <button disabled={a.busy || !legacy?.length} onClick={async () => { const n = await a.run(() => importLegacy({ publish, access })); if (n !== undefined) setDone(`นำเข้า ${n} คอร์สแล้ว`); }}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-signal px-6 text-sm font-semibold text-white disabled:opacity-50">{a.busy && <Loader2 className="size-4 animate-spin" />}นำเข้าคอร์สเดิม</button>
        </Card>
        <Card title={<span className="flex items-center gap-2"><Sparkles className="size-5 text-violet" />คอร์สตัวอย่าง 8 คอร์ส</span>} desc="โครงคอร์สพร้อมปกสวยๆ และบทเรียน (ยังไม่มีคลิป) — นำเข้าเป็นฉบับร่าง แล้วค่อยใส่คลิปจริง">
          <ul className="space-y-1.5 text-sm text-fg-2">
            {['ใช้ Claude Code ทำคลิปอลังการ', 'ทำหนังสั้นด้วย Kling 3.0', 'Vibe Coding 101', 'Nano Banana สตูดิโอในมือถือ', 'พากย์เสียงไทยด้วย AI', 'เขียน Prompt ให้ AI ทำงานแทน', 'แต่งเพลง + ทำ MV ด้วย AI', 'ทำเงินด้วยคอนเทนต์ AI'].map((t) => <li key={t}>· {t}</li>)}
          </ul>
          <button disabled={b.busy} onClick={() => b.run(importSeed, 'นำเข้าคอร์สตัวอย่างแล้ว (ฉบับร่าง)')} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-semibold">{b.busy && <Loader2 className="size-4 animate-spin" />}นำเข้าคอร์สตัวอย่าง</button>
        </Card>
      </div>
      {done && <p className="mt-6 flex items-center gap-2 text-[#1fae5b]"><CheckCircle2 className="size-5" />{done} — ไปที่ “คอร์ส & บทเรียน” เพื่อตรวจทาน</p>}
    </>
  );
}
