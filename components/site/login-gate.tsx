'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth';

/** ซ่อนเนื้อหาบทเรียน (บทความ/พรอมต์/ไฟล์) จนกว่าจะล็อกอิน */
export function LoginGate({ locked, children }: { locked: boolean; children: ReactNode }) {
  const { ready, user } = useAuth();
  const path = usePathname();
  if (!locked || user) return <>{children}</>;
  if (!ready) return <div className="mt-8 h-64 animate-pulse rounded-[22px] bg-surface" />;
  const next = encodeURIComponent(path);
  return (
    <div className="relative mt-8 overflow-hidden rounded-[22px] border border-line bg-surface px-6 py-12 text-center">
      <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(60% 80% at 50% 0%, color-mix(in oklab, var(--violet) 22%, transparent), transparent 70%)' }} aria-hidden />
      <div className="relative">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-fg/5"><Lock className="size-6" /></span>
        <p className="mt-4 font-display text-2xl font-bold">เข้าสู่ระบบเพื่อดูเนื้อหาบทเรียน</p>
        <p className="mx-auto mt-1.5 max-w-md text-muted">พรอมต์ ขั้นตอน และไฟล์ประกอบอยู่ในส่วนนี้ · สมัครฟรี ใช้เวลาไม่ถึง 30 วินาที</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href={`/register?next=${next}`} className="rounded-full bg-orange px-6 py-3 font-semibold text-white">สมัครฟรี</Link>
          <Link href={`/login?next=${next}`} className="rounded-full border border-line-strong px-6 py-3">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </div>
  );
}
