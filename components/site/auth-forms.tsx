'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, MailCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button, Input, Label } from '@/components/ui/primitives';
import { GoogleIcon } from '@/components/ui/brand-icons';

function useRedirectWhenAuthed() {
  const { user } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get('next') || '/dashboard';
  useEffect(() => { if (user) router.replace(next); }, [user, router, next]);
}

function GoogleButton({ label }: { label: string }) {
  const { signInGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  return (
    <>
      <button type="button" disabled={busy} onClick={async () => { setBusy(true); setErr(''); try { await signInGoogle(); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); } }}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line-strong bg-surface font-medium transition hover:border-fg/40 disabled:opacity-60">
        {busy ? <Loader2 className="size-5 animate-spin" /> : <GoogleIcon className="size-5" />}{label}
      </button>
      {err && <p className="mt-2 text-sm text-red-500">{err}</p>}
    </>
  );
}

const Divider = () => (
  <div className="my-6 flex items-center gap-4 font-mono text-[11px] text-muted"><span className="h-px flex-1 bg-line" />หรือใช้อีเมล<span className="h-px flex-1 bg-line" /></div>
);

function PasswordInput(p: React.ComponentProps<'input'>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input {...p} type={show ? 'text' : 'password'} className="pr-12" />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-fg" aria-label={show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}>
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function LoginForm() {
  useRedirectWhenAuthed();
  const { signInEmail, demo } = useAuth();
  const [email, setEmail] = useState(''); const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  return (
    <>
      {demo && <p className="mb-5 rounded-xl border border-orange/30 bg-orange/10 p-3 text-sm text-fg-2">โหมดตัวอย่าง — เชื่อม Firebase ใน .env.local เพื่อเปิดระบบล็อกอินจริง</p>}
      <GoogleButton label="เข้าสู่ระบบด้วย Google" />
      <Divider />
      <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); setBusy(true); setErr(''); try { await signInEmail(email, pw); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); } }}>
        <div><Label htmlFor="email">อีเมล</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></div>
        <div>
          <div className="flex items-baseline justify-between"><Label htmlFor="pw">รหัสผ่าน</Label><Link href="/forgot-password" className="text-[13px] text-muted hover:text-fg">ลืมรหัสผ่าน?</Link></div>
          <PasswordInput id="pw" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        {err && <p className="text-sm text-red-500">{err}</p>}
        <Button type="submit" variant="signal" className="h-12 w-full rounded-xl" disabled={busy}>{busy && <Loader2 className="size-4 animate-spin" />}เข้าสู่ระบบ</Button>
      </form>
      <p className="mt-8 text-center text-[15px] text-muted">ยังไม่มีบัญชี? <Link href="/register" className="font-semibold text-fg underline decoration-orange decoration-2 underline-offset-4">สมัครฟรี</Link></p>
    </>
  );
}

export function RegisterForm() {
  useRedirectWhenAuthed();
  const { register } = useAuth();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  return (
    <>
      <GoogleButton label="สมัครด้วย Google (เร็วที่สุด)" />
      <Divider />
      <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); setBusy(true); setErr(''); try { await register(name, email, pw); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); } }}>
        <div><Label htmlFor="name">ชื่อที่แสดง</Label><Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น ฟิล์ม" autoComplete="nickname" /></div>
        <div><Label htmlFor="email">อีเมล</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" /></div>
        <div><Label htmlFor="pw">รหัสผ่าน</Label><PasswordInput id="pw" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" placeholder="อย่างน้อย 6 ตัวอักษร" /></div>
        {err && <p className="text-sm text-red-500">{err}</p>}
        <Button type="submit" variant="signal" className="h-12 w-full rounded-xl" disabled={busy}>{busy && <Loader2 className="size-4 animate-spin" />}สร้างบัญชีฟรี</Button>
        <p className="text-center text-[12.5px] leading-relaxed text-muted">การสมัครถือว่ายอมรับ <Link href="/terms" className="underline">เงื่อนไขการใช้งาน</Link> และ <Link href="/privacy" className="underline">นโยบายความเป็นส่วนตัว</Link></p>
      </form>
      <p className="mt-8 text-center text-[15px] text-muted">มีบัญชีแล้ว? <Link href="/login" className="font-semibold text-fg underline decoration-orange decoration-2 underline-offset-4">เข้าสู่ระบบ</Link></p>
    </>
  );
}

export function ForgotForm() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [sent, setSent] = useState(false);
  if (sent) return (
    <div className="rounded-2xl border border-line bg-surface p-6 text-center">
      <MailCheck className="mx-auto size-10 text-orange" strokeWidth={1.5} />
      <p className="mt-3 font-semibold">ส่งลิงก์ตั้งรหัสใหม่ไปที่ {email} แล้ว</p>
      <p className="mt-1 text-sm text-muted">ถ้าไม่เจอ ลองดูในโฟลเดอร์จดหมายขยะ</p>
      <Link href="/login" className="mt-5 inline-block text-sm underline underline-offset-4">กลับไปหน้าเข้าสู่ระบบ</Link>
    </div>
  );
  return (
    <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); setBusy(true); setErr(''); try { await resetPassword(email); setSent(true); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); } }}>
      <div><Label htmlFor="email">อีเมลที่ใช้สมัคร</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      <Button type="submit" variant="signal" className="h-12 w-full rounded-xl" disabled={busy}>{busy && <Loader2 className="size-4 animate-spin" />}ส่งลิงก์ตั้งรหัสใหม่</Button>
      <p className="pt-4 text-center text-[15px] text-muted"><Link href="/login" className="hover:text-fg">← กลับไปหน้าเข้าสู่ระบบ</Link></p>
    </form>
  );
}
