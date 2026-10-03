import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthShell } from '@/components/site/auth-shell';
import { LoginForm } from '@/components/site/auth-forms';

export const metadata: Metadata = { title: 'เข้าสู่ระบบ', robots: { index: false } };

export default function Page() {
  return (
    <AuthShell eyebrow="ยินดีต้อนรับกลับ" title={<>เข้าสู่ระบบ<br /><span className="text-spectrum">เรียนต่อจากเดิม</span></>}>
      <Suspense><LoginForm /></Suspense>
    </AuthShell>
  );
}
