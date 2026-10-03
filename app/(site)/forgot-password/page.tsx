import type { Metadata } from 'next';
import { AuthShell } from '@/components/site/auth-shell';
import { ForgotForm } from '@/components/site/auth-forms';

export const metadata: Metadata = { title: 'ลืมรหัสผ่าน', robots: { index: false } };

export default function Page() {
  return (
    <AuthShell eyebrow="กู้คืนบัญชี" title={<>ลืมรหัสผ่าน?<br /><span className="text-muted">ไม่เป็นไร</span></>}>
      <ForgotForm />
    </AuthShell>
  );
}
