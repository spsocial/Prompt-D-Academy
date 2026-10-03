'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Eye, EyeOff, ExternalLink } from 'lucide-react';
import { deleteComment, listComments, setCommentHidden } from '@/lib/admin-api';
import type { CommentDoc } from '@/lib/types';
import { ConfirmButton, PageHeader, useAction } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

export default function Comments() {
  const [items, setItems] = useState<CommentDoc[] | null>(null);
  const { run } = useAction();
  useEffect(() => { listComments().then(setItems); }, []);
  return (
    <>
      <PageHeader title="คอมเมนต์" sub="ตอบคำถามผู้เรียนได้ที่หน้าบทเรียน · ซ่อนหรือลบสแปมได้ที่นี่" />
      <ul className="space-y-3">
        {items === null && <li className="h-24 animate-pulse rounded-2xl bg-surface" />}
        {items?.map((c) => (
          <li key={c.id} className={cn('rounded-2xl border border-line bg-surface p-4 sm:p-5', c.hidden && 'opacity-50')}>
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm"><b>{c.name}</b> <span className="ml-1 font-mono text-[11px] text-muted">{new Date(c.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</span>{c.hidden && <span className="ml-2 rounded bg-surface-2 px-1.5 py-0.5 text-[11px]">ซ่อนอยู่</span>}</p>
                <p className="mt-1.5 whitespace-pre-wrap text-[15px] text-fg-2">{c.text}</p>
                <Link href={`/courses/${c.courseSlug}/${c.lessonId}#comments`} target="_blank" className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-fg">{c.courseSlug} / {c.lessonId}<ExternalLink className="size-3" /></Link>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => run(async () => { await setCommentHidden(c.id, !c.hidden); setItems((x) => x?.map((y) => (y.id === c.id ? { ...y, hidden: !c.hidden } : y)) ?? x); }, c.hidden ? 'แสดงคอมเมนต์แล้ว' : 'ซ่อนคอมเมนต์แล้ว')}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm text-muted hover:bg-surface-2 hover:text-fg">{c.hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}{c.hidden ? 'แสดง' : 'ซ่อน'}</button>
                <ConfirmButton onConfirm={() => run(async () => { await deleteComment(c.id); setItems((x) => x?.filter((y) => y.id !== c.id) ?? x); }, 'ลบแล้ว')} />
              </div>
            </div>
          </li>
        ))}
        {items && !items.length && <li className="rounded-2xl border border-dashed border-line-strong p-12 text-center text-muted">ยังไม่มีคอมเมนต์</li>}
      </ul>
    </>
  );
}
