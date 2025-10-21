# 🚀 Quick Start Guide - สำหรับมือใหม่ (v2.0)

## เริ่มต้นใช้งาน Prompt D Academy ด้วย Claude Code CLI

**Version 2.0:** รองรับ Email/Password + Google Sign-In

---

## ✅ ขั้นที่ 1: เตรียมความพร้อม

### ติดตั้ง Node.js (ถ้ายังไม่มี)
```bash
# ตรวจสอบว่ามี Node.js แล้วหรือยัง
node --version

# ควรเป็น v18 ขึ้นไป
# ถ้ายังไม่มี download จาก https://nodejs.org/
```

### ตรวจสอบว่ามี Claude Code CLI แล้ว
```bash
# ตรวจสอบ version
claude --version

# ถ้ายังไม่มี ติดตั้งตาม docs
# https://docs.claude.com/en/docs/claude-code
```

---

## 📁 ขั้นที่ 2: สร้างโฟลเดอร์โปรเจกต์

```bash
# สร้างโฟลเดอร์
mkdir prompt-d-academy
cd prompt-d-academy

# คัดลอกไฟล์ PROMPT-D-ACADEMY-SPEC.md มาวางในโฟลเดอร์นี้
```

---

## 🤖 ขั้นที่ 3: ใช้ Claude Code สร้างโปรเจกต์

### วิธีที่ 1: ใช้ AI สร้างทีเดียว (แนะนำ)
```bash
# เปิด Claude Code CLI
claude

# จากนั้นพิมพ์คำสั่งนี้:
```

**คำสั่งที่ต้องส่งให้ Claude Code:**
```
อ่านไฟล์ PROMPT-D-ACADEMY-SPEC.md แล้วสร้างโปรเจกต์ Next.js ตามที่ระบุ

เริ่มจาก Phase 1: Core Setup
1. สร้าง Next.js project พร้อม TypeScript และ Tailwind CSS
2. ติดตั้ง dependencies ทั้งหมดที่จำเป็น (firebase, lucide-react)
3. สร้างโครงสร้างโฟลเดอร์:
   - /pages
   - /components
   - /lib (สำหรับ Firebase config)
   - /styles
4. Setup Firebase configuration (รองรับ Email/Password และ Google Sign-In)
5. สร้างหน้า Login (มีทั้ง Email/Password และปุ่ม Google Sign-In)
6. สร้างหน้า Register (Email/Password)
7. สร้าง Dashboard แบบ mock data ก่อน
8. สร้างหน้า Pending Approval สำหรับ Google users

ใช้ UX/UI ตาม design reference ในไฟล์ spec (gradient purple-to-pink, Prompt D Academy branding)
```

---

## 🔥 ขั้นที่ 4: Setup Firebase

### 4.1 สร้าง Firebase Project
1. ไปที่ https://console.firebase.google.com/
2. คลิก "Add project"
3. ตั้งชื่อ: **Prompt D Academy**
4. เปิดใช้งาน Google Analytics (ตัวเลือก)
5. คลิก "Create project"

---

### 4.2 เปิดใช้ Authentication

#### เปิดใช้ Email/Password
1. ในเมนูซ้าย เลือก **Authentication**
2. คลิก "Get started"
3. เลือก "Email/Password" → **เปิดใช้งาน**
4. เลือก "Email link (passwordless sign-in)" → ปิด (ไม่ต้องใช้)

#### เปิดใช้ Google Sign-In (NEW! 🆕)
1. ยังอยู่ในหน้า **Authentication** → Sign-in method
2. คลิก "Google" → **เปิดใช้งาน**
3. ตั้งค่า:
   - **Project support email:** ใส่ email ของคุณ
   - **Project public-facing name:** "Prompt D Academy"
4. คลิก **Save**

#### เพิ่ม Authorized Domains (สำคัญ!)
1. ไปที่ **Authentication** → Settings tab
2. Scroll ลงไปหา "Authorized domains"
3. คลิก **Add domain**
4. เพิ่ม domain ที่จะใช้:
   - `localhost` (มีอยู่แล้ว - สำหรับ development)
   - `promptdacademy.vercel.app` (เปลี่ยนตาม domain ของคุณ)
5. คลิก **Add**

---

### 4.3 สร้าง Firestore Database
1. ในเมนูซ้าย เลือก **Firestore Database**
2. คลิก "Create database"
3. เลือก "Start in test mode" (จะตั้ง security rules ทีหลัง)
4. เลือก location: `asia-southeast1` (Singapore - ใกล้ไทยที่สุด)

---

### 4.4 ดึง Firebase Config
1. ไปที่ Project Settings (ไอคอนเฟือง)
2. เลื่อนลงไปหาส่วน "Your apps"
3. คลิก "Web" (ไอคอน `</>`)
4. ตั้งชื่อ app: **Prompt D Academy Web**
5. **คัดลอก Config** ทั้งหมด:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "prompt-d-academy.firebaseapp.com",
  projectId: "prompt-d-academy",
  storageBucket: "prompt-d-academy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

### 4.5 สร้างไฟล์ .env.local
สร้างไฟล์ `.env.local` ในโฟลเดอร์โปรเจกต์:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prompt-d-academy.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prompt-d-academy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=prompt-d-academy.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

**⚠️ สำคัญ:** ห้าม commit ไฟล์ `.env.local` ขึ้น GitHub!

---

## 🎬 ขั้นที่ 5: เพิ่มข้อมูล Google Drive Videos

### 5.1 เตรียมลิงก์วิดีโอ
จากโฟลเดอร์ Google Drive ของคุณ:

1. คลิกขวาที่วิดีโอ → "Get link"
2. ตั้งค่าเป็น "Anyone with the link can view"
3. คัดลอกลิงก์ เช่น:
   ```
   https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view
   ```
4. **ดึง File ID** ออกมา: `1a2b3c4d5e6f7g8h9i0j`

---

### 5.2 เพิ่มข้อมูลใน Firestore

ไปที่ Firebase Console → Firestore Database

#### สร้าง Collection: `aiTools`

**Document 1: chatgpt**
```json
{
  "id": "chatgpt",
  "name": "ChatGPT / GPT Custom",
  "folder": "GPT Custom",
  "icon": "🤖",
  "description": "AI สำหรับเขียนคำสั่ง และสร้างเนื้อหา",
  "requiredPackage": "basic",
  "videos": [
    {
      "id": "chat-01",
      "title": "เริ่มต้นใช้ ChatGPT",
      "driveId": "1a2b3c4d5e6f7g8h9i0j",
      "duration": "15:30",
      "order": 1
    },
    {
      "id": "chat-02",
      "title": "Prompt Engineering พื้นฐาน",
      "driveId": "2b3c4d5e6f7g8h9i0j1k",
      "duration": "20:15",
      "order": 2
    }
  ]
}
```

**Document 2: midjourney**
```json
{
  "id": "midjourney",
  "name": "Midjourney",
  "folder": "MIDJOURNEY",
  "icon": "🎨",
  "description": "สร้างภาพสวยงามด้วย AI",
  "requiredPackage": "basic",
  "videos": [
    {
      "id": "mj-01",
      "title": "เริ่มต้น Midjourney",
      "driveId": "3c4d5e6f7g8h9i0j1k2l",
      "duration": "18:45",
      "order": 1
    }
  ]
}
```

**ทำแบบนี้กับทุก AI Tool ที่มี**

---

#### สร้าง Collection: `learningPaths`

**Document: video-ads-course**
```json
{
  "id": "video-ads-course",
  "title": "🎬 สร้างวิดีโอโฆษณาด้วย AI",
  "description": "เรียนรู้ทุกขั้นตอนการสร้างวิดีโอโฆษณาระดับมืออาชีพ",
  "icon": "🎬",
  "level": "เริ่มต้น",
  "requiredPackage": "basic",
  "totalDuration": "3 ชั่วโมง",
  "totalVideos": 5,
  "toolsUsed": ["ChatGPT", "Midjourney", "Heygen", "Comfy UI"],
  "steps": [
    {
      "order": 1,
      "toolId": "chatgpt",
      "videoId": "chat-01",
      "title": "เขียน Script โฆษณาด้วย ChatGPT",
      "description": "เรียนรู้เทคนิคการเขียน Prompt เพื่อสร้าง Script โฆษณาที่น่าสนใจ"
    },
    {
      "order": 2,
      "toolId": "midjourney",
      "videoId": "mj-01",
      "title": "สร้างภาพโฆษณาด้วย Midjourney",
      "description": "สร้างภาพประกอบโฆษณาคุณภาพสูงด้วย AI"
    }
  ]
}
```

---

## 👤 ขั้นที่ 6: สร้าง Admin User

### 6.1 สร้าง Admin ผ่าน Firebase Console
1. ไปที่ **Authentication** → Users tab
2. คลิก "Add user"
3. Email: `admin@promptd.com` (หรือ email ของคุณ)
4. Password: (ตั้งรหัสผ่านแข็งแรง)
5. คลิก "Add user"
6. **คัดลอก UID** ของ user ที่สร้าง (จะใช้ในขั้นถัดไป)

---

### 6.2 เพิ่ม Admin Document ใน Firestore
1. ไปที่ **Firestore Database**
2. สร้าง Collection: `users`
3. สร้าง Document โดยใช้ **UID ที่คัดลอกมา** เป็น Document ID

```json
{
  "uid": "abc123xyz...",
  "email": "admin@promptd.com",
  "displayName": "Admin",
  "provider": "email",
  "package": "pro",
  "isActive": true,
  "isAdmin": true,
  "needsApproval": false,
  "createdAt": "2025-10-21T10:00:00Z",
  "progress": {}
}
```

---

### 6.3 สร้าง Test User (Google Sign-In)
เพื่อทดสอบ Approval Flow:

1. รันแอพแล้ว Login ด้วย Google Account ของคุณ
2. ระบบจะสร้าง user document แบบ `isActive: false`
3. ไปที่ Firestore → `users` collection
4. จะเห็น user ใหม่ที่ `needsApproval: true`
5. ทดสอบ Approve ผ่าน Admin Panel

---

## 🔐 ขั้นที่ 7: ตั้ง Firebase Security Rules

ใน Firebase Console → Firestore Database → Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    function isActive() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isActive == true;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAuthenticated(); // Allow self-registration
      allow update, delete: if isAdmin();
    }
    
    // Content (only active users can read)
    match /aiTools/{toolId} {
      allow read: if isActive();
      allow write: if isAdmin();
    }
    
    match /learningPaths/{pathId} {
      allow read: if isActive();
      allow write: if isAdmin();
    }
    
    // Pending approvals
    match /pendingApprovals/{approvalId} {
      allow read, write: if isAdmin();
    }
    
    // Admin only
    match /admin/{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

คลิก **Publish** เพื่อบันทึก

---

## 🎨 ขั้นที่ 8: ทดสอบระบบ

### 8.1 รันโปรเจกต์
```bash
# ใน Terminal
cd prompt-d-academy
npm run dev
```

เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

---

### 8.2 ทดสอบ Email/Password Flow

1. **ลงทะเบียนด้วย Email/Password**
   - ไปที่ `/register`
   - สมัครด้วย email ใหม่ + password
   - ตรวจสอบ email verification
   - Verify email
   - Login

2. **ตั้ง Package**
   - ไปที่ Firestore Console
   - หา user document
   - เปลี่ยน `package` เป็น `"basic"` หรือ `"allinone"`
   - ตั้ง `isActive: true`

3. **ทดสอบ Access Control**
   - Refresh หน้า dashboard
   - ดูว่า Learning Path ไหนถูกล็อค
   - ทดสอบเปลี่ยน package แล้วดู access เปลี่ยนไหม

---

### 8.3 ทดสอบ Google Sign-In Flow (🆕 สำคัญ!)

1. **Login ด้วย Google**
   - ไปที่ `/login`
   - คลิก "เข้าสู่ระบบด้วย Google"
   - เลือก Google account
   - **ควรเห็นข้อความ:** "บัญชีของคุณรอการอนุมัติจาก Admin"
   - **ถูก logout อัตโนมัติ**

2. **Approve User (Admin)**
   - Login ด้วย admin account (Email/Password)
   - ไปที่ `/admin/approvals`
   - เห็น user ที่รอ approval
   - คลิก "Approve"
   - เลือก package (เช่น "basic")
   - คลิก "Confirm"

3. **Login อีกครั้งด้วย Google**
   - Logout จาก admin
   - กลับไปหน้า Login
   - Login ด้วย Google account เดิม
   - **ครั้งนี้ควรเข้า Dashboard ได้**

4. **ตรวจสอบ Profile**
   - ไปที่ `/profile`
   - ควรเห็น:
     - รูปโปรไฟล์จาก Google
     - Badge "Google" 
     - ชื่อที่มาจาก Google account

---

### 8.4 ทดสอบวิดีโอ

1. **คลิกที่ Learning Path**
2. **คลิกดูวิดีโอ**
3. **ตรวจสอบว่า Google Drive embed ทำงาน**
4. **ทดสอบปุ่ม "คลิปถัดไป"**
5. **ทดสอบ "ทำเครื่องหมายว่าดูแล้ว"**
6. **เช็ค progress บน dashboard**

---

## 🛡️ ขั้นที่ 9: ทดสอบ Anti-Fraud Features

### 9.1 ทดสอบ Session Control
1. Login ด้วย account เดียวกันบน 2 browsers
2. ตรวจสอบว่า `activeSessions` อัพเดตใน Firestore
3. ลอง login บน browser ที่ 3 → ควรเตือนหรือ force logout device เก่า

### 9.2 ทดสอบ IP Tracking
1. Login แล้วเช็ค `lastLoginIP` ใน Firestore
2. เช็ค `loginHistory` array
3. ทดสอบ login จาก IP เดียวกันหลาย account → ควรถูก flag

### 9.3 ตรวจสอบ Suspicious Activity
1. ไปที่ Admin Panel → Users
2. ดู column "Suspicious" 
3. ถ้ามี account ถูก flag → แสดงเป็นสีแดง

---

## 🚀 ขั้นที่ 10: Deploy ขึ้น Vercel

### 10.1 Push ขึ้น GitHub
```bash
# Initialize git (ถ้ายังไม่ได้ทำ)
git init
git add .
git commit -m "Initial commit - Prompt D Academy v2.0"

# สร้าง repo ใหม่บน GitHub แล้ว push
git remote add origin https://github.com/YOUR_USERNAME/prompt-d-academy.git
git branch -M main
git push -u origin main
```

---

### 10.2 Deploy บน Vercel
1. ไปที่ https://vercel.com/
2. Login ด้วย GitHub
3. คลิก "New Project"
4. เลือก repository `prompt-d-academy`
5. ตั้งค่า Environment Variables:
   - เพิ่ม variables ทั้งหมดจากไฟล์ `.env.local`
6. คลิก "Deploy"
7. รอ 2-3 นาที → เสร็จ! 🎉

---

### 10.3 เพิ่ม Domain ใน Firebase (สำคัญ!)

**หลัง Deploy เสร็จ:**

1. คัดลอก URL ที่ได้ เช่น `https://prompt-d-academy.vercel.app`
2. ไปที่ Firebase Console → Authentication → Settings → Authorized domains
3. คลิก "Add domain"
4. วาง URL (ไม่ต้องมี https://) → `prompt-d-academy.vercel.app`
5. คลิก "Add"

**ถ้าไม่ทำขั้นนี้ → Google Sign-In จะใช้งานไม่ได้บน production!**

---

## 📋 Checklist ก่อนเปิดใช้งานจริง

### Authentication
- [ ] ทดสอบ Email/Password registration
- [ ] ทดสอบ Email verification
- [ ] ทดสอบ Google Sign-In registration
- [ ] ทดสอบ Google users ถูกส่งไป pending approval
- [ ] ทดสอบ Admin approve/reject flow
- [ ] ทดสอบ Login ทั้ง 2 วิธี
- [ ] ทดสอบ Logout

### Access Control
- [ ] ตรวจสอบ Package-based access
- [ ] ทดสอบ Lock UI แสดงถูกต้อง
- [ ] ทดสอบเล่นวิดีโอจาก Google Drive
- [ ] ทดสอบ Progress tracking

### Security
- [ ] ตั้ง Firebase Security Rules
- [ ] ทดสอบ Session control (max 2 devices)
- [ ] ทดสอบ IP tracking
- [ ] ทดสอบ Suspicious activity detection

### UI/UX
- [ ] ทดสอบบนมือถือ (Responsive)
- [ ] ทดสอบบน tablet
- [ ] เช็ค Performance (Google PageSpeed)
- [ ] ทดสอบ Dark Mode (ถ้ามี)

### Admin Panel
- [ ] ทดสอบ User Management
- [ ] ทดสอบ Approvals Page
- [ ] ทดสอบ Content Management
- [ ] ทดสอบ Analytics Dashboard

### Production
- [ ] เพิ่ม Domain ใน Firebase Authorized Domains
- [ ] Setup Custom Domain (ถ้ามี)
- [ ] Backup Firestore data
- [ ] Setup monitoring (Error tracking)

---

## 🆘 แก้ปัญหาที่พบบ่อย

### ปัญหา 1: Google Sign-In ไม่ทำงาน
**อาการ:** คลิกปุ่ม Google แล้วไม่มีอะไรเกิดขึ้น หรือ error popup

**วิธีแก้:**
1. เช็คว่าเปิดใช้งาน Google Sign-In ใน Firebase Console แล้ว
2. เช็คว่าเพิ่ม domain ใน Authorized Domains แล้ว
3. เช็ค Firebase config ใน `.env.local` ถูกต้อง
4. Clear browser cache แล้วลองใหม่
5. เช็ค Browser Console (F12) → หา error message

---

### ปัญหา 2: Google User ไม่ถูกส่งไป Pending Approval
**อาการ:** Login ด้วย Google แล้วเข้า Dashboard ได้เลย (ไม่ต้อง approve)

**วิธีแก้:**
1. เช็คโค้ดใน Login page → ต้องมีการเช็ค `isActive`
2. เช็ค Firestore document → ต้องมี `isActive: false` และ `needsApproval: true`
3. ถ้าเป็น admin account → ตรวจสอบว่าตั้ง `isAdmin: true` แล้ว

---

### ปัญหา 3: วิดีโอไม่แสดง
**สาเหตุ:** Google Drive file ไม่ได้ตั้งเป็น public

**วิธีแก้:**
1. เปิดวิดีโอใน Google Drive
2. คลิก "Share"
3. เปลี่ยนเป็น "Anyone with the link can view"

---

### ปัญหา 4: Login แล้วไม่เข้าหน้า Dashboard
**สาเหตุ:** ไม่มี user document ใน Firestore หรือ `isActive: false`

**วิธีแก้:**
1. ไปที่ Firestore Console → `users` collection
2. หา document ตาม UID จาก Authentication
3. ตรวจสอบ `isActive: true` และ `package` ไม่เป็น `null`

---

### ปัญหา 5: เห็นเนื้อหาที่ไม่ควรเห็น (bypass access control)
**สาเหตุ:** Firebase Security Rules ไม่ได้ตั้ง

**วิธีแก้:**
1. ตั้ง Security Rules ตามขั้นตอนที่ 7
2. Clear browser cache
3. Login ใหม่

---

### ปัญหา 6: Deploy แล้วเว็บ error
**สาเหตุ:** ลืมตั้ง Environment Variables บน Vercel หรือลืมเพิ่ม domain ใน Firebase

**วิธีแก้:**
1. Vercel Project Settings → Environment Variables → เพิ่มทุก variable จาก `.env.local`
2. Firebase Console → Authentication → Settings → Authorized Domains → เพิ่ม Vercel URL
3. Redeploy

---

### ปัญหา 7: Admin ไม่เห็นหน้า Admin Panel
**สาเหตุ:** User ไม่มี `isAdmin: true` field

**วิธีแก้:**
1. ไปที่ Firestore → `users` collection → admin document
2. เพิ่มหรือเปลี่ยน field: `isAdmin: true`
3. Logout แล้ว Login ใหม่

---

## 🎯 Tips สำหรับการใช้งานจริง

### 1. วิธีเพิ่มผู้เรียนใหม่

**แบบที่ 1: Email/Password (แนะนำ)**
- ให้ผู้เรียน register ผ่านหน้าเว็บ
- Verify email
- Admin assign package ใน Firestore

**แบบที่ 2: Google Sign-In (สะดวก)**
- ให้ผู้เรียน Login ด้วย Google
- ระบบแจ้งรอ approval
- Admin ไปที่ `/admin/approvals`
- เช็คว่าจ่ายเงินแล้ว → Approve + Assign package

---

### 2. วิธีเช็คว่ามีคนแชร์ account

**ดูที่ Admin Panel → Users:**
- เช็ค `activeSessions` → ถ้ามากกว่า 2 = น่าสงสัย
- เช็ค `loginHistory` → ถ้า login จากหลาย IP พร้อมกัน = แชร์กัน
- เช็ค `suspiciousActivity` flag

**วิธีจัดการ:**
- Force logout ทุก session
- เปลี่ยน `isActive: false`
- ติดต่อผู้ใช้เพื่อเตือน

---

### 3. วิธีอัพเดตคอร์ส/เพิ่มวิดีโอ

1. Upload วิดีโอใหม่ใน Google Drive
2. Set permission "Anyone with the link"
3. คัดลอก File ID
4. ไปที่ `/admin/content`
5. เพิ่มวิดีโอใน Learning Path หรือ AI Tool

---

## 📞 ติดต่อขอความช่วยเหลือ

ถ้าติดปัญหาหรือไม่แน่ใจขั้นตอนไหน:
1. เช็ค Firebase Console logs
2. เช็ค Browser Console (F12)
3. อ่าน error message ให้ละเอียด
4. Google search error message
5. ถามใน Stack Overflow หรือ Firebase Community

---

## 🎉 ยินดีด้วย!

คุณได้สร้าง **Prompt D Academy v2.0** พร้อม Google Sign-In สำเร็จแล้ว! 🚀

### คุณสมบัติที่ได้:
✅ Login แบบ Email/Password  
✅ Login แบบ Google Sign-In (สะดวกสุด)  
✅ Admin Approval System (ป้องกันการทุจริต)  
✅ Package-based Access Control  
✅ IP Tracking & Suspicious Activity Detection  
✅ Session Control (max 2 devices)  
✅ Admin Panel สำหรับจัดการทุกอย่าง  

---

## 🔜 ขั้นตอนถัดไป

- [ ] เชิญนักเรียนมาทดลองใช้งาน
- [ ] รับ Feedback และปรับปรุง
- [ ] เพิ่มฟีเจอร์ Payment Integration
- [ ] สร้างระบบ Certificate
- [ ] เพิ่มฟีเจอร์ Discussion Forum
- [ ] สร้าง Mobile App

**Happy Teaching! 🎓✨**