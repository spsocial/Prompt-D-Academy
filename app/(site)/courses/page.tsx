import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCourses } from '@/lib/data';
import { Container, Eyebrow } from '@/components/ui/primitives';
import { Catalog } from '@/components/site/catalog';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'คอร์สเรียน AI ฟรีทั้งหมด',
  description: 'รวมคอร์สเรียน AI ฟรี ภาษาไทย ทั้งสร้างภาพ ทำวิดีโอ พากย์เสียง เขียนโค้ด และทำเงินด้วย AI เรียงจากง่ายไปยาก เริ่มได้ทันที',
  alternates: { canonical: '/courses' },
};

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <section className="relative">
      <div className="grid-lines absolute inset-x-0 top-0 h-[420px]" aria-hidden />
      <Container className="relative pb-10 pt-14 lg:pt-20">
        <Eyebrow>คลังความรู้ · {courses.length} คอร์ส · ฟรีทั้งหมด</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold leading-[1.04] tracking-[-0.02em]">
          คอร์สเรียน AI <span className="text-spectrum">ทั้งหมด</span>
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-fg-2">ค้นหาจากชื่อเครื่องมือ หรือสิ่งที่อยากทำ เช่น &quot;ทำคลิป&quot; &quot;ถ่ายสินค้า&quot; &quot;สร้างเว็บ&quot;</p>
      </Container>
      <Suspense>
        <Catalog courses={courses} />
      </Suspense>
    </section>
  );
}
