import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthShell } from '@/components/site/auth-shell';
import { RegisterForm } from '@/components/site/auth-forms';

export const metadata: Metadata = { title: 'สมัครสมาชิกฟรี', description: 'สมัครสมาชิก Prompt D Class ฟรี บันทึกความคืบหน้า ถามตอบได้ทุกบทเรียน', alternates: { canonical: '/register' } };

export default function Page() {
  return (
    <AuthShell eyebrow="ฟรีตลอดไป · ใช้เวลา 30 วินาที" title={<>สมัครสมาชิก<br /><span className="text-spectrum">เริ่มเรียน AI ฟรี</span></>}>
      <Suspense><RegisterForm /></Suspense>
    </AuthShell>
  );
}
