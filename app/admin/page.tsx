'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Users, BookOpen, PlayCircle, MessagesSquare, Plus, ArrowUpRight, TrendingUp, Video, FilePenLine, Megaphone } from 'lucide-react';
import { getStats, listComments, listCourses } from '@/lib/admin-api';
import type { CommentDoc, Course } from '@/lib/types';
import { PageHeader, StatusPill } from '@/components/admin/ui';
import { useAuth } from '@/lib/auth';

export default function AdminHome() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getStats>> | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [comments, setComments] = useState<CommentDoc[]>([]);
  useEffect(() => { getStats().then(setStats); listCourses().then(setCourses); listComments(6).then(setComments); }, []);
  const hour = new Date().getHours();

  return (
    <>
      <PageHeader title={`${hour < 12 ? 'อรุณสวัสดิ์' : hour < 18 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนค่ำ'}${profile?.displayName ? `, ${profile.displayName}` : ''}`} sub="ภาพรวมเว็บไซต์และทางลัดที่ใช้บ่อย"
        actions={<Link href="/admin/courses/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-signal px-5 text-sm font-semibold text-white"><Plus className="size-4" />สร้างคอร์สใหม่</Link>} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Users, n: stats?.users, l: 'สมาชิกทั้งหมด', s: stats ? `+${stats.newUsers7d} ใน 7 วัน` : '' },
          { icon: BookOpen, n: stats?.courses, l: 'คอร์ส' },
          { icon: PlayCircle, n: stats?.lessons, l: 'บทเรียนที่เผยแพร่' },
          { icon: MessagesSquare, n: stats?.comments, l: 'คอมเมนต์' },
        ].map((s) => (
          <div key={s.l} className="rounded-[20px] border border-line bg-surface p-5">
            <div className="flex items-center justify-between"><s.icon className="size-5 text-muted" strokeWidth={1.75} />{s.s && <span className="flex items-center gap-1 font-mono text-[11px] text-[#1fae5b]"><TrendingUp className="size-3" />{s.s}</span>}</div>
            <p className="mt-5 font-display text-4xl font-extrabold tabular-nums">{s.n ?? <span className="inline-block h-9 w-16 animate-pulse rounded bg-surface-2" />}</p>
            <p className="mt-1 text-sm text-muted">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { href: '/admin/courses', icon: Video, t: 'เพิ่มบทเรียน / อัปคลิป', d: 'เลือกคอร์ส แล้วกด “เพิ่มบทเรียน”' },
          { href: '/admin/courses/new', icon: FilePenLine, t: 'สร้างคอร์สใหม่', d: 'ตั้งชื่อ ใส่ปก แล้วเริ่มเพิ่มบท' },
          { href: '/admin/promos', icon: Megaphone, t: 'โปรโมทสินค้า', d: 'แบนเนอร์ขายโปรแกรมบนเว็บ' },
        ].map((q) => (
          <Link key={q.href + q.t} href={q.href} className="group flex items-start gap-4 rounded-[20px] border border-line p-5 transition hover:border-line-strong hover:bg-surface">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-spectrum text-white"><q.icon className="size-5" strokeWidth={1.75} /></span>
            <span className="flex-1"><span className="block font-semibold">{q.t}</span><span className="text-sm text-muted">{q.d}</span></span>
            <ArrowUpRight className="size-4 text-muted transition group-hover:text-fg" />
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-[20px] border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-5 py-4"><h2 className="font-semibold">คอร์สล่าสุด</h2><Link href="/admin/courses" className="text-sm text-muted hover:text-fg">ทั้งหมด</Link></div>
          <ul className="divide-y divide-line">
            {courses.slice(0, 6).map((c) => (
              <li key={c.slug}><Link href={`/admin/courses/${encodeURIComponent(c.slug)}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-2">
                <span className="min-w-0 flex-1"><span className="block truncate font-medium">{c.title}</span><span className="font-mono text-xs text-muted">{c.lessonCount} บท</span></span>
                <StatusPill on={c.published} />
              </Link></li>
            ))}
          </ul>
        </section>
        <section className="rounded-[20px] border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-5 py-4"><h2 className="font-semibold">คอมเมนต์ล่าสุด</h2><Link href="/admin/comments" className="text-sm text-muted hover:text-fg">ทั้งหมด</Link></div>
          <ul className="divide-y divide-line">
            {comments.map((c) => (
              <li key={c.id} className="px-5 py-3.5"><p className="text-sm"><b>{c.name}</b> <span className="font-mono text-[11px] text-muted">· {c.courseSlug}</span></p><p className="mt-0.5 line-clamp-2 text-sm text-fg-2">{c.text}</p></li>
            ))}
            {!comments.length && <li className="px-5 py-8 text-center text-sm text-muted">ยังไม่มีคอมเมนต์</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
