'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { getSettingsAdmin, saveSettings } from '@/lib/admin-api';
import type { SiteSettings } from '@/lib/types';
import { Card, Field, PageHeader, Toggle, inputCls, useAction } from '@/components/admin/ui';

export default function Settings() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const { busy, run } = useAction();
  useEffect(() => { getSettingsAdmin().then(setS); }, []);
  if (!s) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;
  const f = (k: Exclude<keyof SiteSettings, 'requireLogin'>, label: string, ph?: string, hint?: string) => (
    <Field label={label} hint={hint}><input className={inputCls} value={s[k] ?? ''} onChange={(e) => setS({ ...s, [k]: e.target.value })} placeholder={ph} /></Field>
  );
  return (
    <>
      <PageHeader title="ตั้งค่าเว็บไซต์"
        actions={<button onClick={() => run(() => saveSettings(s), 'บันทึกการตั้งค่าแล้ว')} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-full bg-signal px-5 text-sm font-semibold text-white">{busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}บันทึก</button>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="การเข้าถึงบทเรียน" desc="ปิดไว้ = บทที่ตั้งเป็น “ฟรี” ดูได้โดยไม่ต้องล็อกอิน" className="lg:col-span-2">
          <Toggle checked={s.requireLogin !== false} onChange={(v) => setS({ ...s, requireLogin: v })} label="ต้องล็อกอินก่อนดูบทเรียน" desc="คลิป บทความ และไฟล์ประกอบจะแสดงหลังล็อกอิน (หน้ารวมคอร์ส/หน้าคอร์สยังเปิดดูได้ปกติ)" />
        </Card>
        <Card title="แถบประกาศด้านบน" desc="เว้นว่าง = ไม่แสดง">
          <div className="grid gap-4">{f('announcement', 'ข้อความประกาศ', 'เช่น บทเรียนใหม่! ทำหนังสั้นด้วย Kling 3.0')}{f('announcementUrl', 'ลิงก์เมื่อกด', '/courses/kling-short-film')}</div>
        </Card>
        <Card title="ช่องทางโซเชียล" desc="แสดงในส่วนท้ายเว็บและหน้าติดต่อเรา">
          <div className="grid gap-4">{f('lineUrl', 'LINE OA', 'https://lin.ee/…')}{f('facebookUrl', 'Facebook', 'https://facebook.com/…')}{f('youtubeUrl', 'YouTube', 'https://youtube.com/@…')}{f('tiktokUrl', 'TikTok', 'https://tiktok.com/@…')}</div>
        </Card>
        <Card title="Google AdSense" desc="ใส่หลังจาก Google อนุมัติเว็บแล้ว — ถ้าเว้นว่างจะไม่มีช่องโฆษณาแสดง" className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {f('adsenseClient', 'Publisher ID', 'ca-pub-0000000000000000')}
            {f('adSlotLesson', 'Ad slot — ใต้บทความบทเรียน', '1234567890', 'สร้าง “หน่วยโฆษณาแบบดิสเพลย์” ใน AdSense แล้วคัดลอกตัวเลข data-ad-slot')}
            {f('adSlotSidebar', 'Ad slot — แถบด้านข้าง', '1234567890')}
            {f('adSlotList', 'Ad slot — หน้ารวมคอร์ส (สำรอง)', '1234567890')}
          </div>
        </Card>
      </div>
    </>
  );
}
