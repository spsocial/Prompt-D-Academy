'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Film, ImageIcon, Mic, Code2 } from 'lucide-react';

const SCRIPTS = [
  { icon: Film, prompt: 'ทำคลิปโปรโมทร้าน 60 วิ พร้อมเสียงพากย์ไทย', steps: ['เขียนสคริปต์ 6 ฉาก', 'สร้างภาพสินค้า 12 ภาพ', 'พากย์เสียง eleven_v3', 'ใส่เพลง + ซับ'], out: 'promo_60s.mp4', meta: '1080p · 0:60' },
  { icon: ImageIcon, prompt: 'ถ่ายสินค้าแบบสตูดิโอ ฉากหินอ่อน แสงเช้า', steps: ['วิเคราะห์สินค้า', 'จัดแสงแบบ softbox', 'สร้าง 4 มุมกล้อง'], out: 'product_set.zip', meta: '4 ภาพ · 4K' },
  { icon: Code2, prompt: 'สร้างเว็บจองคิวร้านตัดผม มีระบบแอดมิน', steps: ['ออกแบบหน้าเว็บ', 'ต่อฐานข้อมูล', 'ระบบล็อกอิน', 'ขึ้นออนไลน์'], out: 'barber-booking.app', meta: 'online · 12 นาที' },
  { icon: Mic, prompt: 'โคลนเสียงฉัน แล้วอ่านสคริปต์ไลฟ์ขายของ', steps: ['วิเคราะห์เสียงต้นฉบับ', 'สร้างโมเดลเสียง', 'อ่านสคริปต์ 3 นาที'], out: 'live_voice.mp3', meta: '48kHz · 3:12' },
];

export function HeroTerminal() {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(0);
  const [step, setStep] = useState(-1);
  const s = SCRIPTS[i];

  useEffect(() => {
    setTyped(0); setStep(-1);
    let t = 0; const timers: ReturnType<typeof setTimeout>[] = [];
    for (let k = 1; k <= s.prompt.length; k++) timers.push(setTimeout(() => setTyped(k), (t += 38)));
    t += 350;
    s.steps.forEach((_, k) => timers.push(setTimeout(() => setStep(k), (t += 520))));
    timers.push(setTimeout(() => setStep(s.steps.length), (t += 520)));
    timers.push(setTimeout(() => setI((x) => (x + 1) % SCRIPTS.length), (t += 2600)));
    return () => timers.forEach(clearTimeout);
  }, [i, s]);

  const Icon = s.icon;
  return (
    <div className="relative">
      <div className="absolute -inset-px rounded-[26px] bg-spectrum opacity-60 blur-[2px]" aria-hidden />
      <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0c0e13]/95 text-[#e9e6df] shadow-[0_40px_120px_-30px_rgba(0,0,0,.7)] backdrop-blur">
        <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" /><span className="size-3 rounded-full bg-[#febc2e]" /><span className="size-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[11px] text-white/45">prompt-d — ai-studio</span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-white/45"><span className="size-1.5 animate-pulse rounded-full bg-[#28c840]" />live</span>
        </div>
        <div className="min-h-[300px] p-5 font-mono text-[13px] leading-relaxed sm:p-6">
          <div className="flex gap-2">
            <span className="text-[var(--orange)]">❯</span>
            <p className="font-sans text-[15px] text-white">{s.prompt.slice(0, typed)}{typed < s.prompt.length && <span className="caret ml-0.5" />}</p>
          </div>
          <div className="mt-5 space-y-2.5">
            {s.steps.map((st, k) => (
              <AnimatePresence key={`${i}-${k}`}>
                {step >= k && (
                  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                    {step > k ? <Check className="size-4 text-[#28c840]" /> : <span className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-[var(--orange)]" />}
                    <span className={step > k ? 'text-white/55' : 'text-white'}>{st}</span>
                    {step === k && <span className="ml-auto h-1 w-24 overflow-hidden rounded bg-white/10"><motion.span className="block h-full bg-spectrum" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: .5 }} /></span>}
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
          <AnimatePresence>
            {step >= s.steps.length && (
              <motion.div initial={{ opacity: 0, y: 10, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-3.5">
                <span className="grid size-11 place-items-center rounded-xl bg-spectrum text-white"><Icon className="size-5" /></span>
                <div className="min-w-0">
                  <p className="truncate text-white">{s.out}</p>
                  <p className="text-[11px] text-white/45">{s.meta}</p>
                </div>
                <span className="ml-auto rounded-full bg-[#28c840]/15 px-3 py-1 text-[11px] text-[#5be07a]">เสร็จแล้ว</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-1.5 border-t border-white/8 px-5 py-3">
          {SCRIPTS.map((_, k) => <span key={k} className={`h-1 rounded-full transition-all duration-500 ${k === i ? 'w-8 bg-[var(--orange)]' : 'w-3 bg-white/15'}`} />)}
          <span className="ml-auto font-mono text-[10px] text-white/35">สิ่งที่คุณจะทำได้หลังเรียนจบ</span>
        </div>
      </div>
    </div>
  );
}
