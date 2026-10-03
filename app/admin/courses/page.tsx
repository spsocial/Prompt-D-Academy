'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, GripVertical, Search, Star, ExternalLink, PlayCircle } from 'lucide-react';
import { listCourses, reorderCourses } from '@/lib/admin-api';
import { categoryLabel, fmtMinutes } from '@/lib/config';
import type { Course } from '@/lib/types';
import { PageHeader, StatusPill, useAction } from '@/components/admin/ui';
import { CourseCover } from '@/components/site/course-cover';
import { cn } from '@/lib/utils';

export default function AdminCourses() {
  const [items, setItems] = useState<Course[] | null>(null);
  const [q, setQ] = useState('');
  const [drag, setDrag] = useState<number | null>(null);
  const { run } = useAction();
  useEffect(() => { listCourses().then(setItems); }, []);

  const move = (from: number, to: number) => setItems((x) => { if (!x) return x; const a = [...x]; const [m] = a.splice(from, 1); a.splice(to, 0, m); return a; });
  const list = (items ?? []).filter((c) => !q || c.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="คอร์ส & บทเรียน" sub="ลากเพื่อจัดลำดับการแสดงผลบนเว็บ · คลิกเพื่อแก้ไขและเพิ่มบทเรียน"
        actions={<Link href="/admin/courses/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-signal px-5 text-sm font-semibold text-white"><Plus className="size-4" />สร้างคอร์สใหม่</Link>} />
      <label className="mb-5 flex h-11 max-w-sm items-center gap-2 rounded-xl border border-line-strong bg-surface px-3.5">
        <Search className="size-4 text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาคอร์ส…" className="h-full flex-1 bg-transparent text-[15px] outline-none" />
      </label>
      <ul className="space-y-2.5">
        {items === null && Array.from({ length: 4 }, (_, i) => <li key={i} className="h-24 animate-pulse rounded-2xl bg-surface" />)}
        {list.map((c) => {
          const i = items!.indexOf(c);
          return (
            <li key={c.slug} draggable={!q}
              onDragStart={() => setDrag(i)} onDragOver={(e) => { e.preventDefault(); if (drag !== null && drag !== i) { move(drag, i); setDrag(i); } }}
              onDragEnd={() => { setDrag(null); run(() => reorderCourses(items!.map((x) => x.slug)), 'บันทึกลำดับแล้ว'); }}
              className={cn('group flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 pr-4 transition', drag === i && 'opacity-50 ring-2 ring-orange')}>
              <GripVertical className={cn('size-5 shrink-0 text-muted', q ? 'opacity-0' : 'cursor-grab')} />
              <CourseCover course={c} className="aspect-[16/10] w-28 shrink-0 rounded-xl sm:w-36" sizes="150px" />
              <Link href={`/admin/courses/${encodeURIComponent(c.slug)}`} className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate font-semibold">{c.featured && <Star className="size-4 shrink-0 fill-orange text-orange" />}{c.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 font-mono text-xs text-muted">
                  <span>{categoryLabel(c.category)}</span><span className="flex items-center gap-1"><PlayCircle className="size-3" />{c.lessonCount} บท</span><span>{fmtMinutes(c.totalMinutes)}</span><span>/{c.slug}</span>
                </p>
              </Link>
              <StatusPill on={c.published} />
              {c.published && <Link href={`/courses/${c.slug}`} target="_blank" className="hidden size-9 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg sm:grid" aria-label="ดูหน้าเว็บ"><ExternalLink className="size-4" /></Link>}
            </li>
          );
        })}
        {items && !items.length && (
          <li className="rounded-2xl border border-dashed border-line-strong p-12 text-center">
            <p className="font-semibold">ยังไม่มีคอร์ส</p>
            <p className="mt-1 text-sm text-muted">สร้างคอร์สแรก หรือไปที่ “นำเข้าข้อมูล” เพื่อดึงคอร์สจากเว็บเดิม</p>
          </li>
        )}
      </ul>
    </>
  );
}
