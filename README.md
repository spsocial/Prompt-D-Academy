# Prompt D Academy — v3

เว็บสอน AI **ฟรี** ภาษาไทย ออกแบบเพื่อ SEO (ติดหน้าแรก Google) + หารายได้จากโฆษณาและการโปรโมทสินค้า
รื้อระบบใหม่ทั้งหมดจาก v2 (เว็บขายคอร์สแบบแพ็กเกจ) — **ฐานข้อมูลสมาชิกเดิมใน Firebase ใช้ต่อได้ทันที ไม่ต้องย้าย**

## Tech

| ส่วน | ใช้ |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, ISR) · React 19 · TypeScript |
| UI | Tailwind CSS 4 · Motion · Lucide · ฟอนต์ Noto Serif Thai / IBM Plex Sans Thai / JetBrains Mono |
| Backend | Firebase Auth · Firestore · Storage (โปรเจกต์เดิม) |
| Editor | TipTap (หลังบ้าน — เขียนบทความแบบ Word) |
| SEO | SSR/ISR ทุกหน้า · sitemap.xml · robots.txt · JSON-LD (Course, LearningResource, VideoObject, Breadcrumb, WebSite+Search) · OG image · redirect URL เก่า |

## เริ่มใช้งาน

```bash
npm install
cp .env.local.example .env.local   # ใส่ค่า Firebase เดิม + NEXT_PUBLIC_SITE_URL
npm run dev                        # http://localhost:3000
```

> ถ้ายังไม่ใส่ `.env.local` เว็บจะรัน **โหมดตัวอย่าง** (ข้อมูลเดโม 8 คอร์ส) ดูหน้าตาได้ครบทุกหน้า รวมหลังบ้าน

## ตั้งค่า Firebase (ทำครั้งเดียว)

1. **Rules** — คัดลอก `firestore.rules` ไปวางที่ Firebase Console › Firestore › Rules › Publish และ `storage.rules` ที่ Storage › Rules
2. **แอดมิน** — Firestore › `users` › เอกสารของคุณ › เพิ่มฟิลด์ `isAdmin` = `true` (boolean)
3. **Authentication** › Settings › Authorized domains — เพิ่มโดเมนจริงของเว็บ
4. เข้า `/admin` › **นำเข้าข้อมูล** — ดึงคอร์สจากเว็บเดิม (AI Tools) หรือคอร์สตัวอย่าง 8 คอร์สพร้อมปก

## หลังบ้าน (`/admin`)

- **คอร์ส & บทเรียน** — สร้าง/แก้คอร์ส อัปปก ลากเรียงลำดับ · บทเรียน: วางลิงก์ YouTube/Drive หรือ **ลากไฟล์ MP4 มาวาง** (อ่านความยาวคลิปอัตโนมัติ) + เขียนบทความสรุป ใส่รูป/ลิงก์/กล่อง Prompt
- **สมาชิก** — ลูกค้าทั้งหมดรวมของเว็บเดิม ค้นหา ตั้งแอดมิน ระงับบัญชี ส่งออก CSV
- **คอมเมนต์** — ซ่อน/ลบสแปม
- **โปรโมทสินค้า** — แบนเนอร์ขายโปรแกรม แสดงหน้าแรก/ข้างบทเรียน
- **ตั้งค่าเว็บไซต์** — แถบประกาศ, โซเชียล, Google AdSense (ใส่ ID แล้วช่องโฆษณาโผล่เอง)

ทุกครั้งที่กดบันทึก ระบบจะรีเฟรช cache หน้าเว็บให้อัตโนมัติ (`/api/revalidate`, ยืนยันสิทธิ์แอดมินด้วย Firebase ID token)

## Deploy (Vercel)

ตั้ง Environment Variables ตาม `.env.local.example` แล้ว deploy ได้เลย · branch `renovate-v3` จะได้ Preview URL ให้ทดสอบก่อน merge เข้า `main`

## โครงสร้าง

```
app/(site)/        หน้าเว็บผู้เรียน (หน้าแรก, คอร์ส, บทเรียน, ล็อกอิน, แดชบอร์ด, …)
app/admin/         หลังบ้าน
app/api/revalidate ล้าง cache หลังแก้ข้อมูล
components/site    คอมโพเนนต์หน้าเว็บ   components/admin  คอมโพเนนต์หลังบ้าน
lib/data.ts        อ่านข้อมูลฝั่ง server (Firestore Lite)
lib/admin-api.ts   เขียนข้อมูลฝั่งแอดมิน   lib/auth.tsx  ระบบสมาชิก
lib/seed.ts        ข้อมูลตัวอย่าง           app/globals.css  สี/ธีมทั้งเว็บ (แก้ 3 สีแบรนด์ที่นี่)
```

## โครงข้อมูล Firestore

- `courses/{slug}` + `courses/{slug}/lessons/{id}` — เนื้อหา (ใหม่)
- `users/{uid}` — **โครงเดิมจาก v2** (package, isActive, progress…) ใช้ต่อ · สมาชิกใหม่ได้ `package: 'free'`, `isActive: true` อัตโนมัติ
- `comments`, `promos`, `settings/site` — ใหม่
- `aiTools`, `learningPaths` — ข้อมูล v2 (เก็บไว้ ใช้นำเข้า)
