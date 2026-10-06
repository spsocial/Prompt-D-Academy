'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, BookOpen, Users, MessagesSquare, Megaphone, Settings, DatabaseZap, ExternalLink, Menu, X, ShieldAlert, LogOut, BarChart3 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { PDMark } from '@/components/ui/brand-icons';
import { ThemeToggle } from '@/components/site/header';
import { ToastProvider } from './ui';

const NAV = [
  { href: '/admin', label: 'ภาพรวม', icon: LayoutDashboard, exact: true },
  { href: '/admin/courses', label: 'คอร์ส & บทเรียน', icon: BookOpen },
  { href: '/admin/stats', label: 'สถิติผู้ชม', icon: BarChart3 },
  { href: '/admin/users', label: 'สมาชิก', icon: Users },
  { href: '/admin/comments', label: 'คอมเมนต์', icon: MessagesSquare },
  { href: '/admin/promos', label: 'โปรโมทสินค้า', icon: Megaphone },
  { href: '/admin/settings', label: 'ตั้งค่าเว็บไซต์', icon: Settings },
  { href: '/admin/import', label: 'นำเข้าข้อมูล', icon: DatabaseZap },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { ready, user, isAdmin, demo, profile, signOut } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => { if (ready && !user && !demo) router.replace('/login?next=/admin'); }, [ready, user, demo, router]);

  if (!ready) return <div className="grid min-h-dvh place-items-center"><span className="size-8 animate-spin rounded-full border-2 border-line-strong border-t-orange" /></div>;
  if (!demo && user && !isAdmin) {
    return (
      <div className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <ShieldAlert className="mx-auto size-12 text-orange" strokeWidth={1.25} />
          <h1 className="mt-4 font-display text-3xl font-bold">เฉพาะผู้ดูแลระบบ</h1>
          <p className="mt-2 text-muted">บัญชี {user.email} ยังไม่มีสิทธิ์แอดมิน</p>
          <p className="mt-1 text-sm text-muted">ตั้งค่า <code className="rounded bg-surface-2 px-1.5">isAdmin: true</code> ใน Firestore › users › {user.uid.slice(0, 8)}…</p>
          <Link href="/" className="mt-6 inline-block rounded-full border border-line-strong px-5 py-2.5">กลับหน้าเว็บ</Link>
        </div>
      </div>
    );
  }
  if (!demo && !user) return null;

  const isActive = (n: (typeof NAV)[number]) => (n.exact ? path === n.href : path.startsWith(n.href));
  const side = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2">
        <PDMark className="size-8" />
        <span className="leading-none"><span className="block font-display font-bold">Prompt D</span><span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-muted">Studio</span></span>
      </Link>
      <nav className="mt-8 space-y-0.5">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] transition', isActive(n) ? 'bg-fg text-bg' : 'text-fg-2 hover:bg-surface-2 hover:text-fg')}>
            <n.icon className="size-[18px]" strokeWidth={1.75} />{n.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto space-y-2 pt-6">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] text-fg-2 hover:bg-surface-2"><ExternalLink className="size-[18px]" strokeWidth={1.75} />ดูหน้าเว็บ</Link>
        <div className="flex items-center gap-2 rounded-2xl border border-line p-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-spectrum text-xs font-bold text-white">{(profile?.displayName || 'A').slice(0, 1)}</span>
          <span className="min-w-0 flex-1 truncate text-sm">{demo ? 'โหมดตัวอย่าง' : profile?.displayName}</span>
          <ThemeToggle className="size-8" />
          {!demo && <button onClick={() => signOut()} className="grid size-8 place-items-center rounded-full text-muted hover:bg-surface-2" aria-label="ออกจากระบบ"><LogOut className="size-4" /></button>}
        </div>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-dvh lg:grid lg:grid-cols-[264px_1fr]">
        <aside className="sticky top-0 hidden h-dvh border-r border-line bg-bg-2 p-4 lg:block">{side}</aside>
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-bg/85 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/admin" className="flex items-center gap-2"><PDMark className="size-7" /><span className="font-display font-bold">Studio</span></Link>
          <button onClick={() => setOpen(true)} className="grid size-10 place-items-center" aria-label="เมนู"><Menu className="size-5" /></button>
        </div>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 bg-bg-2 p-4">
              <button onClick={() => setOpen(false)} className="absolute right-3 top-3 grid size-9 place-items-center" aria-label="ปิด"><X className="size-5" /></button>
              {side}
            </div>
          </div>
        )}
        <main className="min-w-0">
          {demo && (
            <div className="border-b border-orange/30 bg-orange/10 px-6 py-2.5 text-center text-[13px] text-fg-2">
              <b className="text-orange">โหมดตัวอย่าง</b> — แสดงข้อมูลเดโม ยังบันทึกไม่ได้จนกว่าจะเชื่อม Firebase (.env.local)
            </div>
          )}
          <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:py-10">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
