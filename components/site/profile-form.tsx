'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { Camera, Check, KeyRound, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { db, storage } from '@/lib/firebase/client';
import { Button, Container, Eyebrow, Input, Label, Textarea } from '@/components/ui/primitives';

export function ProfileForm() {
  const { user, profile, ready, demo, resetPassword, signOut } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(''); const [bio, setBio] = useState('');
  const [busy, setBusy] = useState(false); const [saved, setSaved] = useState(false); const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (ready && !user && !demo) router.replace('/login?next=/profile'); }, [ready, user, demo, router]);
  useEffect(() => { setName(profile?.displayName ?? ''); setBio(profile?.bio ?? ''); }, [profile]);

  if (!ready) return null;
  const photo = profile?.photoURL || user?.photoURL;

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!user) return;
    setBusy(true); setSaved(false);
    try {
      await updateDoc(doc(db(), 'users', user.uid), { displayName: name.trim(), bio: bio.trim() });
      await updateProfile(user, { displayName: name.trim() });
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } finally { setBusy(false); }
  };

  const upload = async (f: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const r = ref(storage(), `avatars/${user.uid}/${Date.now()}-${f.name}`);
      await uploadBytes(r, f, { contentType: f.type });
      const url = await getDownloadURL(r);
      await updateDoc(doc(db(), 'users', user.uid), { photoURL: url });
      await updateProfile(user, { photoURL: url });
    } finally { setUploading(false); }
  };

  return (
    <Container className="max-w-3xl py-12 lg:py-16">
      <Eyebrow>บัญชีของฉัน</Eyebrow>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">ตั้งค่าบัญชี</h1>
      {demo && <p className="mt-4 rounded-xl border border-orange/30 bg-orange/10 p-3 text-sm text-fg-2">โหมดตัวอย่าง — เชื่อม Firebase แล้วจะบันทึกข้อมูลได้จริง</p>}

      <form onSubmit={save} className="mt-10 rounded-[24px] border border-line bg-surface p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <button type="button" onClick={() => fileRef.current?.click()} className="group relative size-20 overflow-hidden rounded-full ring-1 ring-line-strong" aria-label="เปลี่ยนรูปโปรไฟล์">
            {photo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={photo} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
              : <span className="grid size-full place-items-center bg-spectrum font-display text-3xl font-bold text-white">{(name || '?').slice(0, 1)}</span>}
            <span className="absolute inset-0 grid place-items-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100">{uploading ? <Loader2 className="size-5 animate-spin" /> : <Camera className="size-5" />}</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <div>
            <p className="font-semibold">{user?.email}</p>
            <p className="font-mono text-xs text-muted">{profile?.provider === 'google' ? 'เชื่อมกับ Google' : 'อีเมล / รหัสผ่าน'}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5">
          <div><Label htmlFor="n">ชื่อที่แสดง</Label><Input id="n" value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} /></div>
          <div><Label htmlFor="b">แนะนำตัวสั้นๆ</Label><Textarea id="b" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} placeholder="ทำงานอะไร อยากเอา AI ไปใช้ทำอะไร" /></div>
        </div>
        <div className="mt-7 flex items-center gap-3">
          <Button type="submit" disabled={busy || demo}>{busy ? <Loader2 className="size-4 animate-spin" /> : saved ? <Check className="size-4" /> : null}{saved ? 'บันทึกแล้ว' : 'บันทึก'}</Button>
        </div>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {profile?.provider !== 'google' && (
          <button onClick={async () => { if (user?.email) { await resetPassword(user.email); setMsg('ส่งลิงก์เปลี่ยนรหัสผ่านไปที่อีเมลแล้ว'); } }} className="flex items-center gap-3 rounded-2xl border border-line p-5 text-left transition hover:bg-surface">
            <KeyRound className="size-5 text-muted" strokeWidth={1.75} /><span><span className="block font-semibold">เปลี่ยนรหัสผ่าน</span><span className="text-sm text-muted">{msg || 'ส่งลิงก์ไปที่อีเมลของคุณ'}</span></span>
          </button>
        )}
        <button onClick={async () => { await signOut(); router.push('/'); }} className="flex items-center gap-3 rounded-2xl border border-line p-5 text-left transition hover:bg-surface">
          <LogOut className="size-5 text-muted" strokeWidth={1.75} /><span><span className="block font-semibold">ออกจากระบบ</span><span className="text-sm text-muted">จากอุปกรณ์นี้</span></span>
        </button>
      </div>
    </Container>
  );
}
