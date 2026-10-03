'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, Moon, Sun, Menu, X, LayoutDashboard, LogOut, ShieldCheck, ChevronDown, ArrowUpRight, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { CATEGORIES, SITE } from '@/lib/config';
import { cn } from '@/lib/utils';
import { PDMark } from '@/components/ui/brand-icons';
import { ButtonLink } from '@/components/ui/primitives';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('group flex items-center gap-2.5', className)} aria-label={SITE.name}>
      <PDMark className="size-9 transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg]" />
      <span className="leading-none">
        <span className="block font-display text-[17px] font-bold tracking-tight">Prompt D</span>
        <span className="block font-mono text-[9.5px] uppercase tracking-[0.32em] text-muted">Academy</span>
      </span>
    </Link>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(true);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  const toggle = () => {
    const next = !dark; setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
  };
  return (
    <button onClick={toggle} aria-label="สลับธีม" className={cn('grid size-10 place-items-center rounded-full text-fg-2 transition hover:bg-surface-2 hover:text-fg', className)}>
      {dark ? <Sun className="size-[18px]" strokeWidth={1.75} /> : <Moon className="size-[18px]" strokeWidth={1.75} />}
    </button>
  );
}

function Avatar({ name, photo, size = 34 }: { name?: string; photo?: string | null; size?: number }) {
  return photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo} alt="" width={size} height={size} className="rounded-full object-cover ring-1 ring-line-strong" style={{ width: size, height: size }} referrerPolicy="no-referrer" />
  ) : (
    <span className="grid place-items-center rounded-full bg-spectrum font-display text-sm font-bold text-white" style={{ width: size, height: size }}>{(name || '?').slice(0, 1).toUpperCase()}</span>
  );
}

function UserMenu() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', f); return () => document.removeEventListener('mousedown', f);
  }, []);
  const name = profile?.displayName || user?.displayName || 'ผู้เรียน';
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full p-1 pr-2.5 transition hover:bg-surface-2" aria-expanded={open}>
        <Avatar name={name} photo={profile?.photoURL || user?.photoURL} />
        <ChevronDown className={cn('size-4 text-muted transition', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: .98 }} transition={{ duration: .18 }}
            className="absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-2xl shadow-black/20">
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate font-mono text-[11px] text-muted">{user?.email}</p>
            </div>
            <div className="my-1 h-px bg-line" />
            {[
              { href: '/dashboard', label: 'การเรียนของฉัน', icon: LayoutDashboard },
              { href: '/profile', label: 'ตั้งค่าบัญชี', icon: UserIcon },
              ...(isAdmin ? [{ href: '/admin', label: 'หลังบ้าน (Admin)', icon: ShieldCheck }] : []),
            ].map((i) => (
              <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fg-2 transition hover:bg-surface-2 hover:text-fg">
                <i.icon className="size-4" strokeWidth={1.75} />{i.label}
              </Link>
            ))}
            <button onClick={() => { setOpen(false); signOut(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fg-2 transition hover:bg-surface-2 hover:text-fg">
              <LogOut className="size-4" strokeWidth={1.75} />ออกจากระบบ
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const NAV = [
  { href: '/courses', label: 'คอร์สทั้งหมด' },
  { href: '/about', label: 'เกี่ยวกับเรา' },
];

export function SiteHeader({ announcement, announcementUrl }: { announcement?: string; announcementUrl?: string }) {
  const { user, ready } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [cats, setCats] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => { setMobile(false); setCats(false); }, [path]);
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); router.push('/courses?focus=1'); } };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  }, [router]);

  return (
    <>
      {announcement && (
        <Link href={announcementUrl || '/courses'} className="group relative z-50 flex items-center justify-center gap-2 bg-fg px-4 py-2 text-center text-[13px] text-bg">
          <span className="size-1.5 rounded-full bg-orange shadow-[0_0_10px_var(--orange)]" />
          <span>{announcement}</span>
          <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
      <header className={cn('sticky top-0 z-40 transition-all duration-500', scrolled ? 'border-b border-line bg-bg/75 backdrop-blur-xl' : 'border-b border-transparent')}>
        <div className="mx-auto flex h-[68px] max-w-[1240px] items-center gap-6 px-5 sm:px-8">
          <Logo />
          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="เมนูหลัก">
            <div className="relative" onMouseEnter={() => setCats(true)} onMouseLeave={() => setCats(false)}>
              <button className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[14.5px] text-fg-2 transition hover:text-fg" aria-expanded={cats}>
                หมวดหมู่ <ChevronDown className={cn('size-3.5 transition', cats && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {cats && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: .2 }}
                    className="absolute left-0 top-full pt-3">
                    <div className="grid w-[560px] grid-cols-2 gap-1 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/25">
                      {CATEGORIES.map((c, i) => (
                        <Link key={c.key} href={`/courses?cat=${c.key}`} className="group rounded-xl p-3 transition hover:bg-surface-2">
                          <span className="font-mono text-[10px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                          <span className="mt-0.5 block font-semibold text-fg group-hover:text-orange">{c.label}</span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-muted">{c.blurb}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={cn('relative rounded-full px-3.5 py-2 text-[14.5px] transition', path.startsWith(n.href) ? 'text-fg' : 'text-fg-2 hover:text-fg')}>
                {n.label}
                {path.startsWith(n.href) && <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-orange" />}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Link href="/courses?focus=1" className="hidden h-10 items-center gap-2.5 rounded-full border border-line px-3.5 text-sm text-muted transition hover:border-line-strong hover:text-fg sm:flex">
              <Search className="size-4" strokeWidth={1.75} />
              <span className="pr-6">ค้นหาบทเรียน</span>
              <kbd className="rounded-md border border-line px-1.5 font-mono text-[10px]">⌘K</kbd>
            </Link>
            <ThemeToggle />
            <div className="hidden items-center md:flex">
              {!ready ? <span className="size-9 animate-pulse rounded-full bg-surface-2" /> : user ? <UserMenu /> : (
                <div className="flex items-center gap-1">
                  <Link href="/login" className="rounded-full px-3.5 py-2 text-[14.5px] text-fg-2 transition hover:text-fg">เข้าสู่ระบบ</Link>
                  <ButtonLink href="/register" size="sm" variant="primary">สมัครฟรี</ButtonLink>
                </div>
              )}
            </div>
            <button className="grid size-10 place-items-center rounded-full md:hidden" onClick={() => setMobile((m) => !m)} aria-label="เมนู">
              {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobile && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-line bg-bg md:hidden">
              <div className="space-y-1 px-5 py-4">
                <Link href="/courses" className="block rounded-xl px-3 py-3 font-display text-xl font-semibold">คอร์สทั้งหมด</Link>
                {CATEGORIES.map((c) => <Link key={c.key} href={`/courses?cat=${c.key}`} className="block rounded-xl px-3 py-2 text-fg-2">{c.label}</Link>)}
                <Link href="/about" className="block rounded-xl px-3 py-3 font-display text-xl font-semibold">เกี่ยวกับเรา</Link>
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-4">
                  {user ? (
                    <><ButtonLink href="/dashboard" variant="outline">การเรียนของฉัน</ButtonLink><ButtonLink href="/profile" variant="ghost">ตั้งค่าบัญชี</ButtonLink></>
                  ) : (
                    <><ButtonLink href="/login" variant="outline">เข้าสู่ระบบ</ButtonLink><ButtonLink href="/register">สมัครฟรี</ButtonLink></>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
