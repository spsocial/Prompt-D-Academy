// ข้อมูลตัวอย่าง — ใช้เมื่อยังไม่ได้เชื่อม Firebase (.env.local) และใช้เป็น "ข้อมูลเริ่มต้น" ในหน้า Admin › นำเข้า
import type { Course, Lesson, Promo, SiteSettings } from './types';

const now = Date.UTC(2026, 9, 1);

type L = [title: string, min: number, summary: string];
const mk = (prefix: string, items: L[], memberFrom = 99): Lesson[] =>
  items.map(([title, min, summary], i) => ({
    id: `${prefix}-${String(i + 1).padStart(2, '0')}`,
    slug: `${prefix}-${String(i + 1).padStart(2, '0')}`,
    title,
    summary,
    video: { type: 'none' },
    durationMin: min,
    content: `<p>${summary}</p><h2>สิ่งที่จะได้เรียนในบทนี้</h2><ul><li>เข้าใจหลักการก่อนลงมือ</li><li>ทำตามได้ทีละขั้นตอน พร้อมไฟล์ตัวอย่าง</li><li>เทคนิคที่ใช้งานจริงในงานลูกค้า</li></ul><blockquote><p>เคล็ดลับ: ดูคลิปจบแล้วลองทำตามทันที จะจำได้ดีกว่าดูอย่างเดียว</p></blockquote>`,
    resources: [],
    order: i + 1,
    published: true,
    access: i + 1 >= memberFrom ? 'member' : 'free',
    updatedAt: now - i * 86400000,
  }));

export const SEED_LESSONS: Record<string, Lesson[]> = {
  'claude-code-video': mk('ccv', [
    ['ติดตั้ง Claude Code ใน 5 นาที', 8, 'ติดตั้งบน Windows / Mac เลือกแพ็กเกจให้คุ้ม และตั้งค่าให้พร้อมทำงาน'],
    ['สั่งงานด้วยภาษาคนธรรมดา', 12, 'วิธีพูดกับ AI ให้ได้งานตรงใจ ตั้งแต่ครั้งแรก'],
    ['ทำคลิปโปรโมทด้วยโค้ด (ไม่ต้องตัดต่อเอง)', 18, 'ให้ AI เขียนแอนิเมชัน ใส่เสียงพากย์และเพลง แล้วเรนเดอร์เป็น MP4'],
    ['ใส่เสียงพากย์ไทยด้วย ElevenLabs', 10, 'เชื่อม API เสียง เลือกเสียงให้ได้อารมณ์ และเช็คความถูกต้อง'],
    ['ทำ MV เพลงจากภาพเดียว', 15, 'ซับคาราโอเกะ เอฟเฟกต์ตามจังหวะเพลง และตัดฮุกลง TikTok'],
  ]),
  'vibe-coding-101': mk('vbc', [
    ['Vibe Coding คืออะไร ทำไมใครก็สร้างแอปได้', 9, 'แนวคิดใหม่ของการสร้างซอฟต์แวร์ด้วยการคุยกับ AI'],
    ['สร้างเว็บแรกใน 20 นาที', 20, 'จากไอเดียสู่เว็บที่ใช้งานได้จริง พร้อมขึ้นออนไลน์'],
    ['แก้บั๊กโดยไม่ต้องอ่านโค้ด', 14, 'เทคนิคอธิบายปัญหาให้ AI แก้ได้ตรงจุด'],
    ['ต่อฐานข้อมูลและระบบล็อกอิน', 22, 'Firebase / Supabase แบบเข้าใจง่าย'],
  ]),
  'nano-banana-studio': mk('nbs', [
    ['รู้จัก Nano Banana และ Nano Banana Pro', 7, 'ความต่างของแต่ละรุ่น และเลือกใช้ให้เหมาะกับงาน'],
    ['ถ่ายสินค้าแบบสตูดิโอโดยไม่มีสตูดิโอ', 16, 'จัดแสง ฉากหลัง และมุมกล้องด้วย Prompt'],
    ['ภาพนายแบบ-นางแบบหน้าเดิมทุกภาพ', 18, 'ล็อคหน้าตัวละครให้ต่อเนื่องสำหรับแบรนด์'],
    ['แก้ภาพ เปลี่ยนชุด เปลี่ยนฉาก', 12, 'Edit ภาพเดิมแบบเนียนกริบ'],
  ]),
  'kling-short-film': mk('ksf', [
    ['เขียนบทหนังสั้นให้ AI ถ่ายได้', 11, 'โครงเรื่อง 3 องก์ และการแตกเป็นช็อต'],
    ['ภาษากล้องระดับโปร: FPV, Crane, Dolly Zoom', 17, 'สั่งมุมกล้องให้ Kling 3.0 ไม่ดูเป็นหนัง AI'],
    ['ภาพเริ่มต้นช็อตให้ตัวละครหน้าเดิม', 13, 'สร้าง Keyframe ที่ต่อเนื่องทั้งเรื่อง'],
    ['ตัดต่อ ใส่เสียง ซับไทย', 19, 'Sound design, ดนตรี, พากย์ และซับสองภาษา'],
    ['ปล่อยหนังให้คนแชร์', 8, 'ตัด 9:16 ลง TikTok / Reels และเขียนแคปชั่น'],
  ], 4),
  'thai-voice-ai': mk('tva', [
    ['เลือกเสียงพากย์ไทยให้ได้อารมณ์', 9, 'ดุดัน น่าเชื่อถือ หรืออบอุ่น เลือกยังไง'],
    ['eleven_v3 กับ Audio Tags', 12, 'ใส่อารมณ์ [กระซิบ] [ตื่นเต้น] ให้เสียงมีชีวิต'],
    ['โคลนเสียงตัวเอง', 14, 'อัดเสียงยังไงให้โคลนออกมาเหมือน'],
  ]),
  'prompt-mastery': mk('pmt', [
    ['Prompt ที่ดีหน้าตาเป็นยังไง', 8, 'โครงสร้าง บทบาท บริบท ตัวอย่าง และรูปแบบผลลัพธ์'],
    ['ให้ AI คิดเป็นขั้นตอน', 10, 'แตกงานใหญ่ให้ AI ทำได้แม่นขึ้น'],
    ['Prompt สำหรับงานขายของ', 12, 'แคปชั่น สคริปต์ไลฟ์ และตอบแชทลูกค้า'],
  ]),
  'ai-music-mv': mk('amv', [
    ['แต่งเพลงไทยด้วย AI', 13, 'เขียนเนื้อ เลือกแนว และคุมเสียงร้อง'],
    ['ทำ MV แบบมีเนื้อเรื่อง', 21, 'แตกเนื้อเพลงเป็นฉาก และเจ็นวิดีโอให้เข้าจังหวะ'],
    ['ตัดฮุกลง TikTok ให้คนเอาเสียงไปใช้', 9, 'เลือกท่อนฮุก ทำ 9:16 และไฟล์ MP3'],
  ]),
  'ai-content-money': mk('acm', [
    ['ทำคอนเทนต์ขายของทุกวันโดยไม่หมดไฟ', 11, 'ระบบผลิตคอนเทนต์ด้วย AI ทั้งสัปดาห์ใน 1 ชั่วโมง'],
    ['ไลฟ์ขายของด้วย AI', 16, 'สคริปต์ไลฟ์ ตอบคอมเมนต์อัตโนมัติ'],
    ['วัดผลและปรับให้ขายดีขึ้น', 12, 'อ่านตัวเลขให้เป็น แล้วให้ AI ช่วยปรับ'],
  ], 2),
};

const C = (c: Omit<Course, 'lessonCount' | 'totalMinutes' | 'published' | 'description' | 'tags'> & Partial<Course>): Course => {
  const ls = SEED_LESSONS[c.slug] ?? [];
  return {
    published: true,
    tags: [],
    cover: `/covers/${c.slug}.webp`,
    description: `<p>${c.subtitle}</p><p>คอร์สนี้สอนแบบลงมือทำจริง ทุกบทมีคลิปและสรุปเป็นบทความ อ่านทวนได้ตลอด เหมาะทั้งมือใหม่และคนที่อยากเอาไปใช้ทำงานจริง</p>`,
    lessonCount: ls.length,
    totalMinutes: ls.reduce((s, l) => s + l.durationMin, 0),
    createdAt: now,
    updatedAt: now,
    ...c,
  };
};

export const SEED_COURSES: Course[] = [
  C({ slug: 'claude-code-video', title: 'ใช้ Claude Code ทำคลิปอลังการ', subtitle: 'ไม่ต้องตัดต่อเอง สั่ง AI เขียนแอนิเมชัน ใส่เสียงพากย์ ใส่เพลง ได้ MP4 พร้อมโพสต์', category: 'ai-coding', level: 'beginner', tools: ['Claude', 'ElevenLabs'], access: 'free', featured: true, order: 1, tags: ['Claude Code', 'ทำคลิป', 'AI Video'] }),
  C({ slug: 'kling-short-film', title: 'ทำหนังสั้นด้วย Kling 3.0', subtitle: 'มุมกล้องระดับโปร ตัวละครหน้าเดิมทั้งเรื่อง พร้อมเสียงและซับไทย', category: 'ai-video', level: 'intermediate', tools: ['Kling', 'GPT Image'], access: 'free', featured: true, order: 2, tags: ['Kling', 'หนังสั้น'] }),
  C({ slug: 'vibe-coding-101', title: 'Vibe Coding 101', subtitle: 'สร้างเว็บและแอปด้วยการคุยกับ AI แม้เขียนโค้ดไม่เป็น', category: 'ai-coding', level: 'beginner', tools: ['Claude', 'Cursor'], access: 'free', featured: true, order: 3 }),
  C({ slug: 'nano-banana-studio', title: 'Nano Banana สตูดิโอในมือถือ', subtitle: 'ภาพสินค้าและนายแบบระดับสตูดิโอ ล็อคหน้าเดิมได้ทุกภาพ', category: 'ai-image', level: 'beginner', tools: ['Nano Banana'], access: 'free', featured: false, order: 4 }),
  C({ slug: 'thai-voice-ai', title: 'พากย์เสียงไทยด้วย AI', subtitle: 'ElevenLabs v3 ใส่อารมณ์ได้ โคลนเสียงตัวเองได้', category: 'ai-voice', level: 'beginner', tools: ['ElevenLabs'], access: 'free', featured: false, order: 5 }),
  C({ slug: 'prompt-mastery', title: 'เขียน Prompt ให้ AI ทำงานแทน', subtitle: 'หลักคิดที่ใช้ได้กับทุกเครื่องมือ ChatGPT, Claude, Gemini', category: 'ai-basics', level: 'beginner', tools: ['ChatGPT', 'Claude', 'Gemini'], access: 'free', featured: false, order: 6 }),
  C({ slug: 'ai-music-mv', title: 'แต่งเพลง + ทำ MV ด้วย AI', subtitle: 'จากเนื้อเพลงสู่ MV มีเนื้อเรื่อง และฮุกที่คนเอาไปใช้ต่อ', category: 'ai-voice', level: 'intermediate', tools: ['Suno', 'Kling'], access: 'free', featured: false, order: 7 }),
  C({ slug: 'ai-content-money', title: 'ทำเงินด้วยคอนเทนต์ AI', subtitle: 'ระบบผลิตคอนเทนต์ขายของ ไลฟ์ และวัดผล', category: 'ai-business', level: 'intermediate', tools: ['ChatGPT', 'Claude'], access: 'member', featured: false, order: 8 }),
];

export const SEED_PROMOS: Promo[] = [
  { id: 'pd-auto', title: 'PD Auto — ทำคลิปขายของอัตโนมัติ', text: 'ให้ AI ทำคลิปรีวิวสินค้าให้ทุกวัน ไม่ต้องถ่ายเอง ไม่ต้องตัดต่อ', url: 'https://promptdaff.com', cta: 'ดูโปรแกรม', placement: 'all', active: true, order: 1 },
];

export const SEED_SETTINGS: SiteSettings = {
  announcement: 'เว็บใหม่! ทุกคอร์สเรียนฟรี อัปเดตบทเรียนใหม่ทุกสัปดาห์',
};
