'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, ExternalLink, Loader2, Plus, Save, Users } from 'lucide-react';
import { deleteLive, getLiveRoom, getLiveStream, listLives, listRegistrations, saveLive } from '@/lib/admin-api';
import type { LiveClass, LiveRegistration } from '@/lib/types';
import { fmtLiveDate, fmtLiveTime } from '@/lib/live';
import { Card, ConfirmButton, Field, ImageDrop, PageHeader, Toggle, inputCls, useAction } from '@/components/admin/ui';
import { RichEditor } from '@/components/admin/rich-editor';

const toLocalInput = (ms: number) => (ms ? new Date(ms - new Date(ms).getTimezoneOffset() * 60_000).toISOString().slice(0, 16) : '');
const blank = (): LiveClass => ({ slug: '', title: '', subtitle: '', description: '', startAt: 0, durationMin: 60, capacity: 100, topics: [], platform: 'Google Meet', published: false });

function Registrants({ slug, kind = 'registrations', label }: { slug: string; kind?: 'registrations' | 'viewers'; label: string }) {
  const [rows, setRows] = useState<LiveRegistration[] | null>(null);
  useEffect(() => { listRegistrations(slug, kind).then(setRows).catch(() => setRows([])); }, [slug, kind]);
  const csv = () => {
    const lines = [['ลำดับ', 'ชื่อ', 'อีเมล', 'เวลาลงทะเบียน'], ...(rows ?? []).map((r, i) => [i + 1, r.name, r.email, r.createdAt ? new Date(r.createdAt).toLocaleString('th-TH') : ''])];
    const blob = new Blob(['﻿' + lines.map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${kind === 'viewers' ? 'YouTube' : 'Meet'}_${slug}.csv`; a.click();
  };
  return (
    <Card title={<span className="flex items-center gap-2"><Users className="size-4" />{label} {rows ? `(${rows.length})` : ''}</span>}>
      {!rows ? <Loader2 className="size-5 animate-spin text-muted" /> : !rows.length ? <p className="text-sm text-muted">ยังไม่มีคนลงทะเบียน</p> : (
        <>
          <button onClick={csv} className="mb-4 inline-flex h-9 items-center gap-2 rounded-full border border-line-strong px-4 text-sm"><Download className="size-4" />ดาวน์โหลด CSV</button>
          <div className="max-h-96 overflow-auto rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface-2 text-left text-muted"><tr><th className="px-3 py-2">#</th><th className="px-3 py-2">ชื่อ</th><th className="px-3 py-2">อีเมล</th><th className="px-3 py-2">เวลา</th></tr></thead>
              <tbody>{rows.map((r, i) => (
                <tr key={r.uid} className="border-t border-line"><td className="px-3 py-2 text-muted">{i + 1}</td><td className="px-3 py-2">{r.name}</td><td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2 text-muted">{r.createdAt ? new Date(r.createdAt).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : ''}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}

function LiveEditor({ initial, onSaved, onDeleted }: { initial: LiveClass; onSaved: (l: LiveClass) => void; onDeleted: () => void }) {
  const [l, setL] = useState(initial);
  const [meet, setMeet] = useState('');
  const [yt, setYt] = useState('');
  const [topics, setTopics] = useState(initial.topics.join('\n'));
  const { busy, run } = useAction();
  const set = <K extends keyof LiveClass>(k: K, v: LiveClass[K]) => setL((x) => ({ ...x, [k]: v }));
  useEffect(() => { if (initial.slug) { getLiveRoom(initial.slug).then(setMeet).catch(() => {}); getLiveStream(initial.slug).then(setYt).catch(() => {}); } }, [initial.slug]);

  async function save() {
    const data = { ...l, topics: topics.split('\n').map((t) => t.trim()).filter(Boolean) };
    if (!data.title || !data.startAt) throw new Error('ใส่ชื่อคลาสและวันเวลาเริ่มก่อน');
    const slug = await saveLive(data, meet, yt);
    const nl = { ...data, slug }; setL(nl); onSaved(nl);
    return slug;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="grid content-start gap-4">
            <Field label="ชื่อคลาส"><input className={inputCls} value={l.title} onChange={(e) => set('title', e.target.value)} placeholder="ใช้ Claude Opus 5.5 ตัดต่อคลิป ได้ทุกแนว" /></Field>
            <Field label="คำโปรย"><input className={inputCls} value={l.subtitle} onChange={(e) => set('subtitle', e.target.value)} /></Field>
            <Field label="ลิงก์หน้าเว็บ (slug)" hint={l.slug ? <Link href={`/live/${l.slug}`} target="_blank" className="inline-flex items-center gap-1 text-orange">/live/{l.slug} <ExternalLink className="size-3" /></Link> : 'เว้นว่างได้ ระบบตั้งจากชื่อคลาสให้'}>
              <input className={inputCls} value={l.slug} onChange={(e) => set('slug', e.target.value)} disabled={!!initial.slug} placeholder="claude-live-1" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="วันเวลาเริ่ม (เวลาไทย)"><input type="datetime-local" className={inputCls} value={toLocalInput(l.startAt)} onChange={(e) => set('startAt', e.target.value ? new Date(e.target.value).getTime() : 0)} /></Field>
              <Field label="ความยาว (นาที)"><input type="number" className={inputCls} value={l.durationMin} onChange={(e) => set('durationMin', Number(e.target.value) || 60)} /></Field>
              <Field label="จำนวนที่นั่ง"><input type="number" className={inputCls} value={l.capacity} onChange={(e) => set('capacity', Number(e.target.value) || 100)} /></Field>
            </div>
            {l.startAt > 0 && <p className="-mt-2 text-sm text-muted">จะแสดงบนเว็บว่า: {fmtLiveDate(l.startAt)} · {fmtLiveTime(l.startAt)} น.</p>}
            <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
              <Field label="สอนผ่าน"><input className={inputCls} value={l.platform} onChange={(e) => set('platform', e.target.value)} /></Field>
              <Field label="ลิงก์ห้องเรียน" hint="เห็นได้เฉพาะคนที่ลงทะเบียน และขึ้นให้ 15 นาทีก่อนเริ่ม"><input className={inputCls} value={meet} onChange={(e) => setMeet(e.target.value)} placeholder="https://meet.google.com/xxx-xxxx-xxx" /></Field>
            </div>
            <Field label="สอนอะไรบ้าง (บรรทัดละข้อ)"><textarea className={`${inputCls} h-auto py-2.5`} rows={6} value={topics} onChange={(e) => setTopics(e.target.value)} /></Field>
            <Toggle checked={l.published} onChange={(v) => set('published', v)} label="เผยแพร่ (เปิดให้ลงทะเบียน)" desc="เปิดแล้วจะมีแถบแจ้งเตือนทุกหน้าของเว็บ" />
            <Toggle checked={!!l.streamOpen} onChange={(v) => set('streamOpen', v)} label="เปิดรับดูสดผ่าน YouTube (ไม่จำกัดที่นั่ง)" desc="คนที่ลงไม่ทันที่นั่ง Meet ลงทะเบียนดูผ่าน YouTube ได้ ไลฟ์ฝังในหน้าคลาส" />
            <Field label="ลิงก์ YouTube Live" hint="ใส่ตอนเริ่มไลฟ์จาก Meet (กิจกรรม → ถ่ายทอดสด) · คนที่ลงทะเบียนเท่านั้นที่เห็น"><input className={inputCls} value={yt} onChange={(e) => setYt(e.target.value)} placeholder="https://www.youtube.com/live/xxxxxxxxxxx" /></Field>
          </div>
          <div className="space-y-4">
            <Field label="ภาพปก (16:9)"><ImageDrop value={l.cover} onChange={(v) => set('cover', v)} folder="lives" aspect="aspect-[16/9]" /></Field>
            {initial.slug && <p className="text-sm text-muted">Meet {initial.count ?? 0} / {l.capacity} คน · YouTube {initial.ytCount ?? 0} คน</p>}
          </div>
        </div>
        <div className="mt-6"><Field label="รายละเอียดเพิ่มเติม"><RichEditor value={l.description} onChange={(v) => set('description', v)} folder="lives" placeholder="รายละเอียดคลาส สิ่งที่ต้องเตรียม ฯลฯ" /></Field></div>
        <div className="mt-6 flex items-center gap-2">
          <button onClick={() => run(save, 'บันทึกคลาสสดแล้ว')} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}บันทึก
          </button>
          {initial.slug && <ConfirmButton onConfirm={async () => { const ok = await run(async () => { await deleteLive(initial.slug); return true; }, 'ลบแล้ว'); if (ok) onDeleted(); }} />}
        </div>
      </Card>
      {initial.slug && <Registrants slug={initial.slug} label="ที่นั่ง Google Meet" />}
      {initial.slug && <Registrants slug={initial.slug} kind="viewers" label="ดูผ่าน YouTube" />}
    </div>
  );
}

export default function LiveAdmin() {
  const [items, setItems] = useState<LiveClass[] | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  useEffect(() => { listLives().then((x) => { setItems(x); if (x.length) setSel(0); }); }, []);
  return (
    <>
      <PageHeader title="คลาสสอนสด" sub="สร้างคลาส เปิดให้ลงทะเบียน ใส่ลิงก์ห้องเรียน และดูรายชื่อคนลงทะเบียน"
        actions={<button onClick={() => { setItems((x) => [blank(), ...(x ?? [])]); setSel(0); }} className="inline-flex h-10 items-center gap-2 rounded-full bg-signal px-5 text-sm font-semibold text-white"><Plus className="size-4" />สร้างคลาสใหม่</button>} />
      {items && items.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {items.map((l, i) => (
            <button key={l.slug || `new-${i}`} onClick={() => setSel(i)} className={`rounded-full border px-4 py-2 text-sm ${sel === i ? 'border-fg bg-fg text-bg' : 'border-line-strong'}`}>
              {l.title || 'คลาสใหม่'}{l.startAt ? ` · ${fmtLiveDate(l.startAt)}` : ''}
            </button>
          ))}
        </div>
      )}
      {items && sel !== null && items[sel] && (
        <LiveEditor key={items[sel].slug || `new-${sel}`} initial={items[sel]}
          onSaved={(nl) => setItems((x) => x?.map((y, k) => (k === sel ? nl : y)) ?? x)}
          onDeleted={() => { setItems((x) => x?.filter((_, k) => k !== sel) ?? x); setSel(null); }} />
      )}
      {items && !items.length && <div className="rounded-2xl border border-dashed border-line-strong p-12 text-center text-muted">ยังไม่มีคลาสสด — กด “สร้างคลาสใหม่”</div>}
    </>
  );
}
