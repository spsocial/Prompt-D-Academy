'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup,
  sendPasswordResetEmail, signOut as fbSignOut, updateProfile, type User,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp, getDoc, arrayUnion } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase/client';
import { firebaseConfigured } from './firebase/config';
import type { UserDoc } from './types';

interface AuthCtx {
  ready: boolean;
  user: User | null;
  profile: UserDoc | null;
  isAdmin: boolean;
  demo: boolean;
  signInEmail: (email: string, pw: string) => Promise<void>;
  register: (name: string, email: string, pw: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  markComplete: (courseSlug: string, lessonId: string, totalLessons: number) => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

/** สร้าง/อัปเดต users/{uid} — คงฟิลด์เดิมของระบบเก่าไว้ (package, isActive, progress …) */
async function ensureUserDoc(u: User, provider: 'email' | 'google', name?: string) {
  const ref = doc(db(), 'users', u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: u.uid,
      email: u.email,
      displayName: name || u.displayName || u.email?.split('@')[0] || 'ผู้เรียน',
      photoURL: u.photoURL || null,
      provider,
      isActive: true,
      needsApproval: false,
      package: 'free',
      progress: {},
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } else {
    // ระบบใหม่เรียนฟรี: ลูกค้าเดิมที่ค้างรออนุมัติ ให้เข้าได้เลย
    const d = snap.data();
    await updateDoc(ref, { lastLogin: serverTimestamp(), ...(d.isActive ? {} : { isActive: true, needsApproval: false }), ...(d.package ? {} : { package: 'free' }) });
  }
}

const thaiError = (e: unknown) => {
  const code = (e as { code?: string })?.code || '';
  const map: Record<string, string> = {
    'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth/wrong-password': 'รหัสผ่านไม่ถูกต้อง',
    'auth/user-not-found': 'ไม่พบบัญชีนี้',
    'auth/email-already-in-use': 'อีเมลนี้มีบัญชีอยู่แล้ว ลองเข้าสู่ระบบแทน',
    'auth/weak-password': 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร',
    'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
    'auth/popup-closed-by-user': 'ปิดหน้าต่างก่อนเข้าสู่ระบบเสร็จ',
    'auth/too-many-requests': 'ลองหลายครั้งเกินไป รอสักครู่แล้วลองใหม่',
  };
  return new Error(map[code] || (firebaseConfigured ? 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง' : 'โหมดตัวอย่าง: ยังไม่ได้เชื่อม Firebase'));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!firebaseConfigured);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserDoc | null>(null);

  useEffect(() => {
    if (!firebaseConfigured) return;
    let unsubDoc: (() => void) | undefined;
    const unsub = onAuthStateChanged(auth(), (u) => {
      setUser(u);
      unsubDoc?.();
      if (!u) { setProfile(null); setReady(true); return; }
      unsubDoc = onSnapshot(doc(db(), 'users', u.uid), (s) => { setProfile(s.exists() ? (s.data() as UserDoc) : null); setReady(true); }, () => setReady(true));
    });
    return () => { unsub(); unsubDoc?.(); };
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    ready, user, profile,
    isAdmin: profile?.isAdmin === true,
    demo: !firebaseConfigured,
    async signInEmail(email, pw) {
      try { const r = await signInWithEmailAndPassword(auth(), email, pw); await ensureUserDoc(r.user, 'email'); } catch (e) { throw thaiError(e); }
    },
    async register(name, email, pw) {
      try {
        const r = await createUserWithEmailAndPassword(auth(), email, pw);
        await updateProfile(r.user, { displayName: name });
        await ensureUserDoc(r.user, 'email', name);
      } catch (e) { throw thaiError(e); }
    },
    async signInGoogle() {
      try { const r = await signInWithPopup(auth(), googleProvider); await ensureUserDoc(r.user, 'google'); } catch (e) { throw thaiError(e); }
    },
    async resetPassword(email) { try { await sendPasswordResetEmail(auth(), email); } catch (e) { throw thaiError(e); } },
    async signOut() { if (firebaseConfigured) await fbSignOut(auth()); },
    async markComplete(courseSlug, lessonId, totalLessons) {
      if (!user) return;
      const prev = profile?.progress?.[courseSlug]?.watchedVideos ?? [];
      const watched = Array.from(new Set([...prev, lessonId]));
      await updateDoc(doc(db(), 'users', user.uid), {
        [`progress.${courseSlug}.watchedVideos`]: arrayUnion(lessonId),
        [`progress.${courseSlug}.lastWatchedVideo`]: lessonId,
        [`progress.${courseSlug}.completed`]: watched.length,
        [`progress.${courseSlug}.completionPercent`]: Math.min(100, Math.round((watched.length / Math.max(1, totalLessons)) * 100)),
      });
    },
  }), [ready, user, profile]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be inside <AuthProvider>');
  return c;
};
