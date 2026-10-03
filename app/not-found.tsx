import Link from 'next/link';
import { PDMark } from '@/components/ui/brand-icons';

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 text-center">
      <div className="grid-lines absolute inset-0" aria-hidden />
      <div className="relative">
        <PDMark className="mx-auto size-12" />
        <p className="mt-8 font-display text-[clamp(6rem,20vw,12rem)] font-extrabold leading-none tracking-tighter text-spectrum">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">ไม่พบหน้านี้</h1>
        <p className="mt-2 text-muted">บทเรียนอาจถูกย้าย หรือพิมพ์ลิงก์ผิด</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-fg px-6 py-3 font-medium text-bg">กลับหน้าแรก</Link>
          <Link href="/courses" className="rounded-full border border-line-strong px-6 py-3">ดูคอร์สทั้งหมด</Link>
        </div>
      </div>
    </main>
  );
}
