import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, BookOpenText, MonitorPlay, Hammer, Sparkles } from 'lucide-react';
import { getCourses, getLatestLessons, getPromos, getSettings } from '@/lib/data';
import { CATEGORIES, fmtMinutes } from '@/lib/config';
import { Container, Eyebrow, ButtonLink } from '@/components/ui/primitives';
import { Reveal } from '@/components/ui/reveal';
import { CourseCard } from '@/components/site/course-card';
import { HeroTerminal } from '@/components/site/hero-terminal';
import { PromoBanner } from '@/components/site/promo';
import { PromoVideo } from '@/components/site/promo-video';
import { LineIcon } from '@/components/ui/brand-icons';

export const revalidate = 600;

const TOOLS = [
  ['ChatGPT', 'chatgpt.png'], ['Claude', 'claude.png'], ['Gemini', 'gemini.png'], ['Nano Banana', 'nano-banana.png'], ['Midjourney', 'midjourney.png'],
  ['ElevenLabs', 'elevenlabs.png'], ['Suno', 'suno.png'], ['Veo', 'veo.png'], ['ComfyUI', 'comfyui.png'],
];

export default async function Home() {
  const [courses, latest, promos, settings] = await Promise.all([getCourses(), getLatestLessons(6), getPromos('home'), getSettings()]);
  const featured = (courses.filter((c) => c.featured).length >= 3 ? courses.filter((c) => c.featured) : courses).slice(0, 3);
  const lessonTotal = courses.reduce((s, c) => s + c.lessonCount, 0);
  const minutesTotal = courses.reduce((s, c) => s + c.totalMinutes, 0);
  const catCount = (k: string) => courses.filter((c) => c.category === k).length;

  return (
    <>
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden">
        <div className="grid-lines absolute inset-0" aria-hidden />
        <div className="glow-orb -left-40 top-10 size-[520px] bg-blue" aria-hidden />
        <div className="glow-orb -right-32 top-48 size-[460px] bg-orange" aria-hidden />
        <Container className="relative grid items-center gap-14 pb-24 pt-14 lg:grid-cols-[1.1fr_1fr] lg:pb-32 lg:pt-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 py-1.5 pl-1.5 pr-4 text-[13px] text-fg-2 backdrop-blur">
                <span className="rounded-full bg-orange px-2.5 py-0.5 font-mono text-[11px] font-bold text-white">FREE</span>
                ทุกคอร์สเรียนฟรี · ไม่ต้องใช้บัตรเครดิต
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-7 font-display text-[clamp(2.9rem,7.2vw,5.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                เรียน AI<br />ให้<span className="text-spectrum">ใช้เป็นจริง</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-[34rem] text-[17.5px] leading-[1.75] text-fg-2">
                สอนแบบลงมือทำ ตั้งแต่สั่ง AI ทำคลิป ถ่ายสินค้า พากย์เสียง ไปจนถึงสร้างเว็บและแอป — ภาษาไทย ไม่มีศัพท์ยาก ดูจบทำตามได้ทันที
              </p>
            </Reveal>
            <Reveal delay={0.24} className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/courses" variant="signal" size="lg">เริ่มเรียนฟรี <ArrowRight className="size-4" /></ButtonLink>
              <ButtonLink href={featured[0] ? `/courses/${featured[0].slug}` : '/courses'} variant="outline" size="lg">ดูคอร์สแนะนำ</ButtonLink>
            </Reveal>
            {courses.length > 0 && <Reveal delay={0.32}>
              <dl className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-line border-y border-line">
                {[[courses.length, 'คอร์ส'], [lessonTotal, 'บทเรียน'], [Math.round(minutesTotal / 60) || 1, 'ชั่วโมง']].map(([n, l]) => (
                  <div key={l as string} className="px-4 py-4 first:pl-0">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">{l}</dt>
                    <dd className="mt-1 font-display text-3xl font-bold tabular-nums">{n}+</dd>
                  </div>
                ))}
              </dl>
            </Reveal>}
          </div>
          <Reveal delay={0.2} y={40} className="lg:pl-6">
            <HeroTerminal />
          </Reveal>
        </Container>
      </section>

      {/* ───────────────── TOOLS MARQUEE ───────────────── */}
      <section className="border-y border-line bg-bg-2/60 py-6" aria-label="เครื่องมือที่สอน">
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="flex w-max animate-marquee gap-14 pr-14">
            {[...TOOLS, ...TOOLS].map(([name, img], i) => (
              <span key={i} className="flex items-center gap-3 text-fg-2 grayscale transition hover:grayscale-0">
                <Image src={`/images/${img}`} alt="" width={28} height={28} className="size-7 rounded-md object-contain" />
                <span className="font-display text-lg font-semibold">{name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── PROMO VIDEO ───────────────── */}
      <section className="pt-24 lg:pt-32" aria-label="คลิปแนะนำเว็บ">
        <Container className="max-w-5xl">
          <Reveal className="text-center">
            <Eyebrow>คลิปแนะนำ</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.08] tracking-tight">เรียนที่นี่ <span className="text-spectrum">ยังไง?</span></h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-muted">คลิปสอนทำตามได้ทีละขั้น พร้อมคำสั่งให้ก๊อป ฟรีทุกคอร์ส และมีบทเรียนใหม่เพิ่มตลอด</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10"><PromoVideo /></Reveal>
        </Container>
      </section>

      {/* ───────────────── FEATURED ───────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <Eyebrow>01 — คอร์สแนะนำ</Eyebrow>
              <h2 className="mt-3 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.08] tracking-tight">เริ่มจากตรงนี้<br className="sm:hidden" /> <span className="text-muted">ได้ผลเร็วที่สุด</span></h2>
            </Reveal>
            <Reveal delay={0.1}><Link href="/courses" className="group flex items-center gap-2 text-[15px] text-fg-2 hover:text-fg">ดูทั้งหมด {courses.length} คอร์ส <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></Reveal>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.08}><CourseCard course={c} index={i} className="h-full" /></Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────── CATEGORIES (editorial index) ───────────────── */}
      <section className="py-10 lg:py-16">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>02 — หมวดหมู่</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.08] tracking-tight">อยากใช้ AI<br />ทำอะไร?</h2>
            <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-muted">เลือกจากเป้าหมายของคุณ ทุกหมวดเรียงจากง่ายไปยาก เริ่มบทแรกได้เลยไม่ต้องมีพื้นฐาน</p>
          </Reveal>
          <ul className="border-t border-line">
            {CATEGORIES.map((c, i) => (
              <li key={c.key}>
                <Reveal delay={i * 0.05}>
                  <Link href={`/courses?cat=${c.key}`} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-line py-6 transition-colors hover:bg-surface/60 sm:grid-cols-[4rem_1fr_auto] sm:px-3">
                    <span className="font-mono text-sm text-muted transition group-hover:text-orange">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="block font-display text-[clamp(1.35rem,2.6vw,2rem)] font-bold tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-2">{c.label}</span>
                      <span className="mt-1 block text-[14.5px] text-muted">{c.blurb}</span>
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="hidden font-mono text-xs text-muted sm:inline">{catCount(c.key)} คอร์ส</span>
                      <span className="grid size-10 place-items-center rounded-full border border-line-strong transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-orange group-hover:bg-orange group-hover:text-white"><ArrowUpRight className="size-4" /></span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ───────────────── METHOD ───────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>03 — วิธีเรียน</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.1] tracking-tight">ดู · อ่าน · <span className="text-spectrum">ลงมือทำ</span></h2>
            <p className="mt-5 text-[16px] leading-relaxed text-muted">ทุกบทเรียนมีทั้งคลิปและบทความสรุป ลืมเมื่อไหร่กลับมาเปิดอ่านได้ใน 10 วินาที</p>
          </Reveal>
          <div className="mt-16 grid gap-px overflow-hidden rounded-[26px] border border-line bg-line md:grid-cols-3">
            {[
              { icon: MonitorPlay, t: 'ดูคลิปสั้น ตรงประเด็น', d: 'แต่ละบท 8–20 นาที ตัดส่วนเกินออกหมด เห็นหน้าจอจริงทุกขั้นตอน' },
              { icon: BookOpenText, t: 'อ่านสรุปทวนได้', d: 'ทุกคลิปมีบทความสรุป พร้อม Prompt ให้ก๊อปไปใช้ได้ทันที' },
              { icon: Hammer, t: 'ทำตามแล้วได้ผลงาน', d: 'จบบทแล้วได้ชิ้นงานจริง เอาไปใช้ขายของหรือรับงานได้เลย' },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 0.08} className="group relative bg-bg p-8 transition-colors hover:bg-surface lg:p-10">
                <span className="font-mono text-[64px] font-bold leading-none text-line-strong transition-colors group-hover:text-orange/40">{String(i + 1).padStart(2, '0')}</span>
                <s.icon className="mt-6 size-7 text-fg" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-2xl font-bold">{s.t}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────── LATEST LESSONS ───────────────── */}
      {latest.length > 0 && (
        <section className="py-10 lg:py-16">
          <Container>
            <Reveal className="flex items-end justify-between gap-6">
              <div>
                <Eyebrow>04 — บทเรียนล่าสุด</Eyebrow>
                <h2 className="mt-3 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.08] tracking-tight">มาใหม่สัปดาห์นี้</h2>
              </div>
              <Sparkles className="mb-3 hidden size-8 text-orange sm:block" strokeWidth={1.5} />
            </Reveal>
            <div className="mt-10 grid gap-x-10 md:grid-cols-2 [&>*]:min-w-0">
              {latest.map((l, i) => (
                <Reveal key={`${l.course.slug}-${l.id}`} delay={(i % 2) * 0.06}>
                  <Link href={`/courses/${l.course.slug}/${l.slug}`} className="group flex items-start gap-5 border-b border-line py-5">
                    <span className="mt-1 font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[11px] uppercase tracking-wider text-orange">{l.course.title}</span>
                      <span className="mt-1 block text-[17px] font-semibold leading-snug transition group-hover:text-orange">{l.title}</span>
                      <span className="mt-1 block truncate text-[14px] text-muted">{l.summary}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs text-muted">{fmtMinutes(l.durationMin)}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ───────────────── PROMO ───────────────── */}
      {promos[0] && (
        <section className="py-16">
          <Container><Reveal><PromoBanner promo={promos[0]} /></Reveal></Container>
        </section>
      )}

      {/* ───────────────── CTA ───────────────── */}
      <section className="pt-16">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] border border-line bg-surface px-7 py-16 text-center sm:px-16 sm:py-24">
              <div className="grid-lines absolute inset-0 opacity-70" aria-hidden />
              <div className="glow-orb left-1/2 top-0 size-[420px] -translate-x-1/2 -translate-y-1/2 bg-violet" aria-hidden />
              <div className="relative">
                <Eyebrow>เริ่มวันนี้ · ฟรีตลอดไป</Eyebrow>
                <h2 className="mx-auto mt-4 max-w-3xl font-display text-[clamp(2.2rem,5.4vw,4.4rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
                  AI ไม่ได้มาแย่งงานคุณ<br /><span className="text-spectrum">คนที่ใช้ AI เป็นต่างหาก</span>
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-[16.5px] leading-relaxed text-fg-2">สมัครฟรีเพื่อบันทึกความคืบหน้า คอมเมนต์ถามได้ทุกบท และรับแจ้งเตือนเมื่อมีบทเรียนใหม่</p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                  <ButtonLink href="/register" variant="signal" size="lg">สมัครสมาชิกฟรี <ArrowRight className="size-4" /></ButtonLink>
                  {settings.lineUrl && (
                    <a href={settings.lineUrl} target="_blank" rel="noopener" className="inline-flex h-13 items-center gap-2.5 rounded-full border border-line-strong px-7 font-medium transition hover:border-[#06C755] hover:text-[#06C755]">
                      <LineIcon className="size-5" /> แอด LINE รับบทเรียนใหม่
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
