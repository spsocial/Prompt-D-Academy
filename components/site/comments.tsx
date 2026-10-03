'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, addDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { MessageCircle, Send } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/lib/auth';
import type { CommentDoc } from '@/lib/types';

const ago = (ms: number) => {
  const s = (Date.now() - ms) / 1000;
  if (s < 60) return 'เมื่อสักครู่';
  if (s < 3600) return `${Math.floor(s / 60)} นาทีที่แล้ว`;
  if (s < 86400) return `${Math.floor(s / 3600)} ชั่วโมงที่แล้ว`;
  if (s < 2592000) return `${Math.floor(s / 86400)} วันที่แล้ว`;
  return new Date(ms).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

export function Comments({ courseSlug, lessonId }: { courseSlug: string; lessonId: string }) {
  const { user, profile, demo } = useAuth();
  const [items, setItems] = useState<CommentDoc[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (demo) return;
    const q = query(collection(db(), 'comments'), where('courseSlug', '==', courseSlug), where('lessonId', '==', lessonId));
    return onSnapshot(q, (s) => setItems(
      s.docs.map((d) => { const x = d.data(); return { id: d.id, ...x, createdAt: x.createdAt?.toMillis?.() ?? Date.now() } as CommentDoc; })
        .filter((c) => !c.hidden).sort((a, b) => b.createdAt - a.createdAt),
    ), () => {});
  }, [courseSlug, lessonId, demo]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setBusy(true); setErr('');
    try {
      await addDoc(collection(db(), 'comments'), {
        courseSlug, lessonId, uid: user.uid, text: text.trim().slice(0, 2000),
        name: profile?.displayName || user.displayName || 'ผู้เรียน', photo: profile?.photoURL || user.photoURL || null,
        createdAt: serverTimestamp(), hidden: false,
      });
      setText('');
    } catch { setErr('ส่งไม่สำเร็จ ลองใหม่อีกครั้ง'); } finally { setBusy(false); }
  };

  return (
    <section className="mt-16" id="comments">
      <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold"><MessageCircle className="size-6" strokeWidth={1.5} />ถามตอบ <span className="font-mono text-sm font-normal text-muted">{items.length}</span></h2>
      {user ? (
        <form onSubmit={submit} className="mt-5 rounded-2xl border border-line bg-surface p-3 transition focus-within:border-line-strong">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={2000} placeholder="ติดตรงไหน ถามได้เลย หรือแชร์ผลงานที่ทำตาม…" className="w-full resize-none bg-transparent px-2 py-1.5 text-[15px] outline-none placeholder:text-muted" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-500">{err}</span>
            <button disabled={busy || !text.trim()} className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg transition disabled:opacity-40"><Send className="size-4" />ส่ง</button>
          </div>
        </form>
      ) : (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-line-strong p-5">
          <p className="text-fg-2">{demo ? 'โหมดตัวอย่าง: ระบบคอมเมนต์จะทำงานเมื่อเชื่อม Firebase' : 'เข้าสู่ระบบเพื่อถามคำถามหรือแสดงความคิดเห็น'}</p>
          {!demo && <Link href="/login" className="rounded-full border border-line-strong px-5 py-2 text-sm hover:bg-surface">เข้าสู่ระบบ</Link>}
        </div>
      )}
      <ul className="mt-6 space-y-5">
        {items.map((c) => (
          <li key={c.id} className="flex gap-3.5">
            {c.photo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={c.photo} alt="" className="size-9 shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />
              : <span className="grid size-9 shrink-0 place-items-center rounded-full bg-spectrum text-sm font-bold text-white">{c.name.slice(0, 1)}</span>}
            <div className="min-w-0">
              <p className="text-sm"><span className="font-semibold">{c.name}</span> <span className="ml-1.5 font-mono text-[11px] text-muted">{ago(c.createdAt)}</span></p>
              <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-fg-2">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
