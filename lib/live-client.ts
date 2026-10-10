'use client';
// Live classes — browser-side reads/writes for learners (rules: own registration only, +1 seat counter, room link after openAt).
import { doc, getDoc, increment, serverTimestamp, writeBatch } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './firebase/client';

export async function liveSeats(slug: string) {
  const d = await getDoc(doc(db(), 'lives', slug));
  const v = d.data() ?? {};
  return { count: Number(v.count) || 0, capacity: Number(v.capacity) || 0 };
}

export async function isRegistered(slug: string, uid: string) {
  return (await getDoc(doc(db(), 'lives', slug, 'registrations', uid))).exists();
}

/** ลงทะเบียน: สร้างใบลงทะเบียนของตัวเอง + เพิ่มยอดที่นั่ง 1 ในครั้งเดียว (rules ตรวจว่าไม่เกินจำนวนที่นั่ง) */
export async function registerLive(slug: string, user: User, name: string) {
  const b = writeBatch(db());
  b.set(doc(db(), 'lives', slug, 'registrations', user.uid), { uid: user.uid, name, email: user.email ?? '', createdAt: serverTimestamp() });
  b.update(doc(db(), 'lives', slug), { count: increment(1) });
  await b.commit();
}

/** ลิงก์ห้องเรียน — อ่านได้เฉพาะคนที่ลงทะเบียน และหลังเวลาเปิดห้อง (ก่อนหน้านั้น rules ปฏิเสธ → คืน null) */
export async function liveRoomUrl(slug: string): Promise<string | null> {
  try {
    const d = await getDoc(doc(db(), 'liveSecrets', slug));
    return (d.data()?.meetUrl as string) || null;
  } catch { return null; }
}
