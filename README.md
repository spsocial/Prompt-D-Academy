# 🎓 Prompt D Academy

แพลตฟอร์มเรียนรู้ AI ออนไลน์แบบปิด (Private Learning Platform) พร้อมระบบจัดการสิทธิ์การเข้าถึงตามแพ็คเกจ

**Version 2.0** - รองรับการ Login ด้วย Email/Password และ Google Sign-In พร้อมระบบ Admin Approval

---

## 📋 Features

### ✨ Core Features
- 🔐 **Dual Authentication**
  - Email/Password Login (พร้อม Email Verification)
  - Google Sign-In (พร้อมระบบ Admin Approval)
- 📦 **Package-Based Access Control**
  - โฆษณาโปร (299 THB)
  - All-in-One (499 THB)
  - Pro Developer (999 THB)
- 📚 **Learning Paths** - เส้นทางการเรียนแบบ Step-by-Step
- 🛠️ **AI Tools** - เรียนแยกตามเครื่องมือ
- 🎬 **Video Player** - เล่นวิดีโอจาก Google Drive พร้อมระบบติดตามความคืบหน้า
- 👤 **User Profile** - จัดการข้อมูลส่วนตัวและดูสถิติการเรียน
- 🔒 **Content Locking** - ล็อคเนื้อหาตามแพ็คเกจที่ใช้งาน

### 🛡️ Security Features
- Firebase Authentication
- Email Verification (สำหรับ Email/Password)
- Admin Approval System (สำหรับ Google Sign-In)
- Protected Routes
- Package-based permissions
- Anti-fraud measures (IP tracking, session control)

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth
- **Database:** Firestore
- **Icons:** Lucide React, Heroicons
- **Video Hosting:** Google Drive

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm หรือ yarn
- Firebase Project

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd Prompt-D-Academy
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

สร้างไฟล์ `.env.local` จาก template:
```bash
cp .env.local.example .env.local
```

แก้ไขไฟล์ `.env.local` ด้วยข้อมูล Firebase ของคุณ:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Firebase Setup

#### A. Enable Authentication Methods
1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือก Project ของคุณ
3. ไปที่ **Authentication → Sign-in method**
4. Enable:
   - ✅ Email/Password
   - ✅ Google

#### B. Create Firestore Database
1. ไปที่ **Firestore Database**
2. สร้าง Database (เริ่มจาก test mode หรือ production mode)
3. สร้าง Collections:
   - `users`
   - `learningPaths` (optional - สำหรับข้อมูลจริง)
   - `aiTools` (optional - สำหรับข้อมูลจริง)
   - `admin`

#### C. Security Rules (สำคัญ!)
ไปที่ Firestore → Rules และใช้ rules ตาม `project_spec_md (1).md`

#### D. Create Admin User
1. สมัครสมาชิกผ่านเว็บ (Email/Password หรือ Google)
2. ไปที่ Firestore → `users` collection
3. หา document ของคุณและเพิ่มฟิลด์:
   ```json
   {
     "isAdmin": true,
     "isActive": true,
     "package": "pro"
   }
   ```

### 5. Run Development Server
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
Prompt-D-Academy/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles
│   ├── login/                   # Login page
│   ├── register/                # Register page
│   ├── pending-approval/        # Pending approval page
│   ├── dashboard/               # Main dashboard
│   ├── profile/                 # User profile
│   ├── learning-path/[id]/      # Learning path detail
│   ├── tool/[id]/               # AI tool detail
│   └── video/[id]/              # Video player
├── components/                   # Reusable components
│   ├── GoogleSignInButton.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   ├── ProviderBadge.tsx
│   ├── PackageBadge.tsx
│   └── LockOverlay.tsx
├── lib/                         # Libraries & utilities
│   ├── firebase.ts              # Firebase config
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useLearningPaths.ts
│   │   └── useAITools.ts
│   └── utils/                   # Utility functions
│       └── accessControl.ts
├── data/                        # Mock data
│   └── mockData.ts
├── public/                      # Static files
├── .env.local.example           # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🔐 Authentication Flows

### Email/Password Registration
1. User กรอก Email + Password + Confirm Password
2. System สร้าง account ผ่าน Firebase Auth
3. ส่ง Email Verification
4. User ยืนยัน Email
5. **Auto-activated** - สามารถ Login ได้ทันที (แต่ยังไม่มี Package)
6. Admin assign Package ให้ผ่าน Admin Panel

### Google Sign-In Registration
1. User คลิก "เข้าสู่ระบบด้วย Google"
2. Google OAuth Popup
3. System สร้าง user document ใน Firestore:
   ```typescript
   {
     isActive: false,
     needsApproval: true,
     package: null
   }
   ```
4. แสดงข้อความ "รอการอนุมัติจาก Admin (24 ชม.)"
5. Auto logout
6. **Admin approve** ผ่าน Admin Panel → Approvals
7. Admin assign Package
8. User สามารถ Login ได้

---

## 💎 Package System

| Package | Price | Access |
|---------|-------|--------|
| **โฆษณาโปร** | 299 THB | วิดีโอโฆษณาด้วย AI |
| **All-in-One** | 499 THB | คอร์สทั้งหมด |
| **Pro Developer** | 999 THB | ทุกอย่าง + Advanced |

### Access Control Logic
```typescript
const hierarchy = {
  basic: 1,
  allinone: 2,
  pro: 3
};

// User with "allinone" can access "basic" content
// User with "pro" can access everything
canAccess = hierarchy[userPackage] >= hierarchy[requiredPackage];
```

---

## 🎯 Usage Guide

### สำหรับผู้ใช้ทั่วไป

#### 1. สมัครสมาชิก
- **Email/Password**: สมัครที่ `/register` → ยืนยัน Email → Login ได้ทันที
- **Google Sign-In**: Login ที่ `/login` → รอ Admin อนุมัติ (24 ชม.)

#### 2. เลือกคอร์ส
- **Learning Path**: เรียนแบบ Step-by-Step ตามเส้นทางที่กำหนด
- **AI Tools**: เรียนแยกตามเครื่องมือที่สนใจ

#### 3. ดูวิดีโอ
- คลิกเข้าคอร์สที่ต้องการ
- เลือกวิดีโอ
- ดูจนจบ → คลิก "ทำเครื่องหมายว่าดูแล้ว"
- ระบบจะบันทึกความคืบหน้าอัตโนมัติ

#### 4. ติดตามความคืบหน้า
- Dashboard: ดูสถิติรวม
- Profile: ดูรายละเอียดแพ็คเกจและสถิติการเรียน

### สำหรับ Admin

#### 1. จัดการ Approvals (สำคัญ!)
ไปที่ `/admin/approvals`:
- ดูรายการผู้ใช้ที่รอการอนุมัติ (Google Sign-In users)
- **Approve**: เลือก Package → Confirm
- **Reject**: ใส่เหตุผล → Confirm
- **Bulk Actions**: Approve/Reject หลายคนพร้อมกัน

#### 2. จัดการผู้ใช้
ไปที่ `/admin/users`:
- ดูรายการผู้ใช้ทั้งหมด
- แก้ไข Package
- Activate/Deactivate บัญชี
- ดู Login History และ IP
- Flag Suspicious Activity

#### 3. จัดการเนื้อหา
ไปที่ `/admin/content`:
- CRUD Learning Paths
- CRUD AI Tools
- CRUD Videos
- จัดเรียงลำดับ

---

## 🎨 Customization

### เปลี่ยนสี
แก้ไขใน `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#9333ea',  // เปลี่ยนสีหลัก
    // ...
  },
  secondary: {
    DEFAULT: '#db2777',  // เปลี่ยนสีรอง
    // ...
  }
}
```

### เปลี่ยน Logo
1. แก้ไขใน `components/Navbar.tsx`
2. เปลี่ยน Icon จาก `Zap` เป็น Icon อื่น

### เพิ่ม AI Tool ใหม่
1. เพิ่มใน `data/mockData.ts` หรือ
2. เพิ่มผ่าน Admin Panel (ถ้ามี CRUD)

---

## 🚢 Deployment

### Railway (Recommended for this project)
1. Push code ไปที่ GitHub
2. ไปที่ [Railway.app](https://railway.app)
3. **New Project** → **Deploy from GitHub repo**
4. เลือก repository ของคุณ
5. **Add Variables** ตั้งค่า Environment Variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
   NEXT_PUBLIC_FIREBASE_APP_ID=xxx
   ```
6. **Settings** → ตรวจสอบ:
   - Build Command: `npm run build` (ตั้งอัตโนมัติ)
   - Start Command: `npm start` (ตั้งอัตโนมัติ)
7. กด **Deploy** → เสร็จ! 🎉
8. รับ URL: `https://your-project.up.railway.app`

### Vercel
1. Push code ไปที่ GitHub
2. เชื่อมต่อ [Vercel](https://vercel.com)
3. Import repository
4. ตั้งค่า Environment Variables (เหมือน Railway)
5. Deploy!

### Firebase Hosting
```bash
npm install -g firebase-tools
npm run build
firebase init hosting
firebase deploy
```

---

## 🐛 Troubleshooting

### ปัญหา: ไม่สามารถ Login ได้
- ✅ ตรวจสอบว่า Firebase Authentication ถูก Enable แล้ว
- ✅ ตรวจสอบว่า Email ถูก verified แล้ว (สำหรับ Email/Password)
- ✅ ตรวจสอบว่า `isActive = true` ใน Firestore

### ปัญหา: Google Sign-In ไม่ทำงาน
- ✅ ตรวจสอบ Firebase Console → Authentication → Google (Enabled)
- ✅ เพิ่ม authorized domain ใน Firebase Console
- ✅ ตรวจสอบว่า popup ไม่ถูกบล็อค

### ปัญหา: วิดีโอไม่เล่น
- ✅ ตรวจสอบว่า Google Drive file เป็น "Anyone with the link can view"
- ✅ ตรวจสอบ Drive File ID ถูกต้อง
- ✅ ตรวจสอบ `next.config.js` มี domain: `drive.google.com`

### ปัญหา: Content ล็อคทั้งหมด
- ✅ ตรวจสอบว่า user มี `package` assigned แล้ว
- ✅ ตรวจสอบ `isActive = true`
- ✅ ตรวจสอบว่าแพ็คเกจยังไม่หมดอายุ

---

## 📝 TODO (Phase 2+)

- [ ] Admin Panel - Full CRUD for Content
- [ ] Payment Integration (Stripe/PayPal/Promptpay)
- [ ] Email Notifications (Approval status, Package updates)
- [ ] Certificate of Completion
- [ ] Quiz/Assessment System
- [ ] Discussion Forum
- [ ] Mobile App (React Native)
- [ ] Advanced Analytics

---

## 🤝 Contributing

หากต้องการ contribute:
1. Fork repository
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 📞 Contact & Support

- **Email:** support@promptdacademy.com
- **Admin Dashboard:** `/admin`
- **Documentation:** อ่านไฟล์ `project_spec_md (1).md` สำหรับรายละเอียดเพิ่มเติม

---

## 🎉 Credits

Built with ❤️ using:
- Next.js 14
- Firebase
- Tailwind CSS
- TypeScript

**Version:** 2.0
**Last Updated:** October 21, 2025
**Created by:** Claude (Anthropic) + Prompt D Academy Team
