import type { Metadata } from 'next';
import { ProfileForm } from '@/components/site/profile-form';

export const metadata: Metadata = { title: 'ตั้งค่าบัญชี', robots: { index: false } };

export default function Page() {
  return <ProfileForm />;
}
