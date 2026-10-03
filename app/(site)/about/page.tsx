import type { Metadata } from 'next';
import { ArrowRight, HeartHandshake, Languages, Rocket, Wrench } from 'lucide-react';
import { getCourses } from '@/lib/data';
import { Container, Eyebrow, ButtonLink } from '@/components/ui/primitives';
import { Reveal } from '@/components/ui/reveal';
import { PageHero } from '@/components/site/page-hero';

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา',
  description: 'Prompt D Class สอน AI ฟรีเป็นภาษาไทย โดยคนที่ใช้ AI ทำงานจริงทุกวัน ทั้งทำคลิป ทำเพลง สร้างโปรแกรม และขายของออนไลน์',
  alternates: { canonical: '/about' },
};

export default async function About() {
  const courses = await getCourses();
  const lessons = courses.reduce((s, c) => s + c.lessonCount, 0);
  return (
    <>
      <PageHero eyebrow="เกี่ยวกับ Prompt D Class" title={<>สอน AI แบบที่<br /><span className="text-spectrum">เราใช้ทำงานจริง</span></>}
        lead="เราไม่ได้สอนทฤษฎี เราสอนสิ่งที่ใช้ทำเงินจริงทุกวัน ตั้งแต่ทำคลิปโฆษณา ทำ MV ทำหนังสั้น ไปจนถึงสร้างโปรแกรมขายเอง — แล้วเปิดให้เรียนฟรีทั้งหมด" />
      <Container className="grid gap-16 py-20 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <Eyebrow>ทำไมสอนฟรี</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight">ความรู้ AI ไม่ควรถูกล็อคไว้หลังราคา</h2>
          <div className="mt-6 space-y-4 text-[17px] leading-[1.85] text-fg-2">
            <p>AI เปลี่ยนเร็วมาก คอร์สที่ขายเมื่อปีก่อนวันนี้อาจใช้ไม่ได้แล้ว เราเลยเลือกเปิดทุกบทเรียนให้ฟรี และอัปเดตต่อเนื่องทุกสัปดาห์</p>
            <p>เว็บอยู่ได้ด้วยโฆษณาและเครื่องมือที่เราพัฒนาขายเอง ถ้าเครื่องมือไหนช่วยงานคุณได้ เราจะแนะนำตรงๆ ไม่บังคับซื้อ</p>
          </div>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-[26px] border border-line bg-line sm:grid-cols-2">
          {[
            { i: Wrench, t: 'สอนจากงานจริง', d: 'ทุกเทคนิคผ่านการใช้กับงานลูกค้าและงานของเราเองมาแล้ว' },
            { i: Languages, t: 'ภาษาไทย เข้าใจง่าย', d: 'อธิบายแบบคนคุยกัน ไม่มีศัพท์เทคนิคที่ไม่จำเป็น' },
            { i: Rocket, t: 'อัปเดตทุกสัปดาห์', d: 'เครื่องมือใหม่ออกเมื่อไหร่ เราทดสอบแล้วสอนทันที' },
            { i: HeartHandshake, t: 'ถามได้ทุกบท', d: 'คอมเมนต์ใต้บทเรียน เราและเพื่อนผู้เรียนช่วยตอบ' },
          ].map((x, k) => (
            <Reveal key={x.t} delay={k * 0.06} className="bg-bg p-7">
              <x.i className="size-6 text-orange" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-xl font-bold">{x.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{x.d}</p>
            </Reveal>
          ))}
        </div>
      </Container>
      <Container>
        <div className="grid grid-cols-2 divide-x divide-y divide-line overflow-hidden rounded-[26px] border border-line md:grid-cols-4 md:divide-y-0">
          {[[courses.length, 'คอร์ส'], [lessons, 'บทเรียน'], ['100%', 'เรียนฟรี'], ['ทุกสัปดาห์', 'บทเรียนใหม่']].map(([n, l]) => (
            <div key={l as string} className="p-8"><p className="font-display text-4xl font-extrabold">{n}</p><p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">{l}</p></div>
          ))}
        </div>
        <div className="mt-16 flex justify-center"><ButtonLink href="/courses" variant="signal" size="lg">เริ่มเรียนฟรี <ArrowRight className="size-4" /></ButtonLink></div>
      </Container>
    </>
  );
}
