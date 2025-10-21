# Prompt สำหรับส่งให้ Claude Code CLI (v2.0)

**คำแนะนำ:** คัดลอก prompt ข้างล่างนี้ทั้งหมด แล้วส่งให้ Claude Code CLI

**Version 2.0:** รองรับ Email/Password + Google Sign-In

---

## 📝 Prompt (Copy ทั้งหมด)

```
สวัสดีครับ! ผมต้องการให้คุณสร้างเว็บแอพพลิเคชัน "Prompt D Academy" ซึ่งเป็นแพลตฟอร์มเรียน AI แบบปิด (Private Learning Platform) พร้อมระบบจัดการสิทธิ์การเข้าถึงตามแพ็คเกจ

**Version 2.0:** รองรับการ Login ด้วย Email/Password และ Google Sign-In

กรุณาอ่านไฟล์ PROMPT-D-ACADEMY-SPEC.md ที่อยู่ในโฟลเดอร์นี้ เพื่อเข้าใจ requirements ทั้งหมด

## สิ่งที่ต้องการให้สร้าง (Phase 1 - MVP):

### 1. เริ่มต้นโปรเจกต์
- สร้าง Next.js 14 project พร้อม TypeScript
- ติดตั้ง Tailwind CSS
- ติดตั้ง dependencies: firebase, lucide-react, @heroicons/react
- สร้างโครงสร้างโฟลเดอร์ตาม best practices

### 2. Firebase Setup
- สร้างไฟล์ `lib/firebase.ts` สำหรับ Firebase configuration
- ใช้ environment variables จาก `.env.local`
- Setup Firebase Auth (Email/Password + Google Sign-In)
- Setup Firestore
- สร้าง GoogleAuthProvider พร้อม custom parameters

```typescript
// lib/firebase.ts example
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
```

---

### 3. Authentication Pages

#### `/pages/login.tsx`
**Requirements:**
- Form สำหรับ Email + Password login
- ปุ่ม "เข้าสู่ระบบ" สำหรับ Email/Password
- เส้นแบ่ง "หรือ" 
- **ปุ่ม "เข้าสู่ระบบด้วย Google"** (สไตล์ตาม Google Brand Guidelines)
  - Background: white
  - Border: gray
  - Google icon + ข้อความ
  - Hover effect
- แสดง error message ถ้า login ไม่สำเร็จ
- Redirect ไป `/dashboard` ถ้าสำเร็จ (สำหรับ Email/Password)
- **สำหรับ Google Sign-In:**
  - เช็คว่า user มีใน Firestore หรือยัง
  - ถ้ายังไม่มี → สร้าง document ใหม่ด้วย `isActive: false`, `needsApproval: true`
  - แสดงข้อความ "บัญชีของคุณรอการอนุมัติจาก Admin (ประมาณ 24 ชม.)"
  - Auto logout
  - ถ้ามีแล้ว → เช็ค `isActive`
    - ถ้า `false` → แสดงข้อความรอ approval แล้ว logout
    - ถ้า `true` → redirect `/dashboard`

**Code Example:**
```typescript
// Login with Google
const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // New user - create document
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: 'google',
        isActive: false,
        needsApproval: true,
        package: null,
        createdAt: new Date(),
        progress: {}
      });
      
      alert('บัญชีของคุณรอการอนุมัติจาก Admin กรุณารอ 24 ชั่วโมง');
      await auth.signOut();
    } else {
      // Existing user
      const userData = userDoc.data();
      if (!userData.isActive) {
        alert('บัญชีของคุณยังไม่ได้รับการอนุมัติ กรุณารอหรือติดต่อ Admin');
        await auth.signOut();
      } else {
        router.push('/dashboard');
      }
    }
  } catch (error) {
    setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
  }
};
```

#### `/pages/register.tsx`
- Form: Email + Password + Confirm Password (Email/Password เท่านั้น)
- Validation:
  - Email format ถูกต้อง
  - Password อย่างน้อย 8 ตัวอักษร, 1 ตัวพิมพ์ใหญ่, 1 ตัวเลข
  - Password ตรงกับ Confirm Password
- สร้าง account ผ่าน Firebase Auth
- ส่ง email verification
- แสดงข้อความ "กรุณาตรวจสอบอีเมลเพื่อ verify"
- **ไม่ต้องมีปุ่ม Google Sign-In** (register ผ่าน Login page ได้เลย)

#### `/pages/pending-approval.tsx` (NEW)
- แสดงสถานะรอ approval สำหรับ Google Sign-In users
- ข้อความ: "บัญชีของคุณกำลังรอการอนุมัติจาก Admin"
- แสดง email ของผู้ใช้
- Estimated time: "โดยปกติใช้เวลา 24 ชั่วโมง"
- ปุ่ม "ติดต่อ Admin" (optional)
- ปุ่ม "ออกจากระบบ"

---

### 4. Main Dashboard

#### `/pages/dashboard.tsx`
**Requirements:**

##### Layout:
- **Top Navbar:**
  - Logo: Zap icon (จาก lucide-react) + "Prompt D Academy"
  - Search bar กลาง (placeholder: "ค้นหาคอร์ส...")
  - **Profile dropdown ขวาสุด:**
    - แสดง user photo (ถ้ามี - จาก Google)
    - หรือแสดง avatar ตัวอักษรแรกของชื่อ
    - Dropdown เมื่อคลิก:
      - Display name
      - Email
      - **Badge แสดง provider** (🔒 Email หรือ 🌐 Google)
      - Package info
      - ไปที่ Profile
      - Logout

- **Hero Section:**
  - Background: `bg-gradient-to-r from-purple-600 to-pink-600`
  - Heading: "เรียนรู้ AI แบบมืออาชีพ"
  - Subheading: "เลือกเส้นทางการเรียนที่เหมาะกับคุณ หรือเรียนรู้แต่ละ AI Tool แยกกัน"
  - **Welcome message พร้อมชื่อผู้ใช้** (เช่น "ยินดีต้อนรับ, คุณ[ชื่อ]!")

- **Package Info Card** (แสดงใต้ Hero):
  - Package name (โฆษณาโปร / All-in-One / Pro Developer)
  - Expiry date (ถ้ามี)
  - Features ที่ได้
  - Progress overview (courses completed)

- **Navigation Tabs:**
  - Tab 1: "📚 เส้นทางการเรียน (Learning Path)"
  - Tab 2: "🛠️ เรียนแยกตาม AI Tool"

##### Tab 1: Learning Paths
แสดง grid ของ Learning Path cards ที่มี:
- Title (เช่น 🎬 สร้างวิดีโอโฆษณาด้วย AI)
- Icon/Emoji
- Description
- Badge ระดับความยาก (เริ่มต้น/กลาง/สูง)
- Duration + จำนวนคลิป
- AI Tools ที่จะได้เรียน (แสดงเป็น tags)
- ปุ่ม "เริ่มเรียน"
- **Lock icon 🔒 พร้อม overlay ถ้า user ไม่มีสิทธิ์เข้าถึง**
  - Overlay แสดง: "อัพเกรดแพ็คเกจเพื่อปลดล็อค"
  - ปุ่ม "ดูแพ็คเกจ" (optional)

##### Tab 2: AI Tools
แสดง grid ของ AI Tool cards ที่มี:
- Icon (emoji ใหญ่ๆ)
- Tool name
- จำนวนคลิป
- Progress bar (แสดง % ที่เรียนไปแล้ว)
- ปุ่ม "เริ่มเรียน"
- **Lock icon 🔒 ถ้า user ไม่มีสิทธิ์เข้าถึง**

##### Access Control Logic:
```typescript
const canAccessContent = (userPackage: string, requiredPackage: string): boolean => {
  const hierarchy = {
    basic: 1,
    allinone: 2,
    pro: 3
  };
  return hierarchy[userPackage] >= hierarchy[requiredPackage];
};
```

---

### 5. Learning Path Detail Page

#### `/pages/learning-path/[id].tsx`
**Requirements:**
- แสดง path overview:
  - Title, description, icon
  - Level badge
  - Total duration, total videos
  - AI Tools ที่จะได้เรียน
- แสดง steps เรียงลำดับ (1, 2, 3...)
- แต่ละ step แสดง:
  - Step number
  - Tool icon + name
  - Video title
  - Description
  - Duration
  - ปุ่ม "เริ่มเรียน" → link ไป `/video/[videoId]?path=[pathId]&step=[stepNumber]`
- **Progress indicator:** แสดงว่าดูไปถึง step ไหนแล้ว
- ถ้า user ไม่มีสิทธิ์ → แสดง lock overlay ทับทั้งหน้า
  - ข้อความ: "อัพเกรดแพ็คเกจเพื่อปลดล็อคเนื้อหานี้"
  - แสดง package ที่ต้องการ
  - ปุ่ม "ติดต่อ Admin เพื่ออัพเกรด"

---

### 6. AI Tool Detail Page

#### `/pages/tool/[id].tsx`
**Requirements:**
- แสดง tool overview:
  - Icon (ใหญ่)
  - Tool name
  - Description
  - จำนวนวิดีโอทั้งหมด
- **Progress card:**
  - แสดง "เรียนไป X/Y คลิป"
  - Progress bar
  - เปอร์เซ็นต์
- รายการวิดีโอทั้งหมด (sortable):
  - Thumbnail (optional - ใช้ Google Drive thumbnail)
  - Title
  - Duration
  - Checkmark ถ้าดูแล้ว
  - ปุ่ม "ดูเลย" → link ไป `/video/[videoId]?tool=[toolId]`
- ถ้า user ไม่มีสิทธิ์ → lock overlay

---

### 7. Video Player Page

#### `/pages/video/[id].tsx`
**Layout:** 2 columns (70/30 split บน desktop, stack บน mobile)

##### **หน้าหลัก (ซ้าย 70%):**
- Video title (ใหญ่, bold)
- Google Drive embed player:
```jsx
<div className="aspect-video">
  <iframe
    src={`https://drive.google.com/file/d/${driveId}/preview`}
    width="100%"
    height="100%"
    allow="autoplay"
    className="rounded-lg"
  />
</div>
```
- Video description (ถ้ามี)
- Action buttons:
  - **ปุ่ม "คลิปถัดไป" →** auto-navigate ไปคลิปถัดไปตาม:
    - Learning path (ถ้ามาจาก path) → ไป step ถัดไป
    - หรือ AI Tool (ถ้ามาจาก tool) → ไปวิดีโอถัดไป
  - **ปุ่ม "ทำเครื่องหมายว่าดูแล้ว"** → update progress ใน Firestore:
    - เพิ่ม videoId ใน `watchedVideos` array
    - อัพเดต `completionPercent`
    - เปลี่ยนเป็น "ดูแล้ว ✓" ถ้ากดแล้ว
- Related videos (optional)

##### **Sidebar (ขวา 30%):**
- **Course outline / Playlist:**
  - ถ้ามาจาก Learning Path → แสดง steps ทั้งหมด
  - ถ้ามาจาก AI Tool → แสดงวิดีโอทั้งหมดในเครื่องมือนี้
- **Highlight คลิปปัจจุบัน:**
  - Background สีต่าง
  - Icon "▶ กำลังเล่น"
- **Clickable list:**
  - คลิกแล้วข้ามไปคลิปนั้นได้เลย
  - แสดง checkmark ถ้าดูแล้ว

---

### 8. Profile Page

#### `/pages/profile.tsx`
**Requirements:**
- **User info section:**
  - Profile photo (ถ้ามี - จาก Google)
  - Display name
  - Email
  - **Login method badge:**
    - 🔒 Email/Password
    - 🌐 Google Sign-In
    - แสดงเป็น pill badge สวยงาม
  
- **Package info card:**
  - Current package (โฆษณาโปร / All-in-One / Pro)
  - Expiry date (ถ้ามี)
  - Features ที่ได้ (list)
  - ปุ่ม "อัพเกรดแพ็คเกจ" (optional - link ไปติดต่อ admin)

- **Statistics card:**
  - Total courses enrolled
  - Videos watched
  - Total watch time (ประมาณ - ถ้าเก็บ)
  - Completion rate

- **Actions:**
  - **ปุ่ม "Change Password"** (แสดงเฉพาะ Email/Password users)
    - เปิด modal หรือไปหน้าใหม่
    - ใส่ password เก่า + password ใหม่
  - **ปุ่ม "Logout"**
    - ยืนยันก่อน logout
    - Logout แล้ว redirect ไป `/login`

---

### 9. Admin Pages (Admin Role Only)

#### `/pages/admin/dashboard.tsx` (NEW)
**Overview Dashboard:**
- **Stats cards:**
  - Total users
  - Active subscriptions (by package)
  - Pending approvals (with badge)
  - Revenue (optional)
- **Charts:**
  - User growth over time
  - Package distribution (pie chart)
  - Popular courses
- **Recent activity:**
  - Recent registrations
  - Recent logins
  - Recent video watches

#### `/pages/admin/users.tsx`
**User Management:**
- **Table columns:**
  - Photo (ถ้ามี)
  - Display Name
  - Email
  - **Provider** (🔒 Email หรือ 🌐 Google) - sortable
  - Package - sortable
  - Status (Active/Inactive) - filterable
  - Last Login
  - **Suspicious Activity** (🚨 flag - ถ้ามี)
  - Actions (Edit, View Details, Disable)

- **Filters:**
  - By provider (All / Email / Google)
  - By package (All / Basic / All-in-One / Pro / None)
  - By status (All / Active / Inactive / Suspicious)

- **Search:** Search by email or name

- **Actions per user:**
  - View details (modal)
  - Edit package
  - Activate/Deactivate
  - View progress
  - **View login history** (IPs, devices, timestamps)
  - Flag as suspicious

#### `/pages/admin/approvals.tsx` (NEW - สำคัญ!)
**Pending Approvals Management:**
- **Purpose:** Approve/Reject users ที่สมัครผ่าน Google Sign-In

- **Table columns:**
  - Photo
  - Display Name
  - Email
  - Provider (ควรเป็น Google เกือบทั้งหมด)
  - Registration Date
  - Status (Pending / Approved / Rejected)
  - Actions

- **Actions per user:**
  - **Approve button:**
    - เปิด modal เพื่อเลือก package
    - เลือก: Basic / All-in-One / Pro
    - ตั้ง expiry date (optional)
    - Add notes (optional)
    - Confirm → update `isActive: true`, assign package
    - ส่ง email notification (optional)
  
  - **Reject button:**
    - เปิด modal ใส่เหตุผล
    - Confirm → update status เป็น "rejected"
    - ส่ง email notification (optional)
  
  - **Review Later:**
    - Skip ไว้ก่อน

- **Bulk actions:**
  - Select multiple users
  - Approve all → เลือก package เดียวกันให้หมด
  - Reject all

- **Filter:**
  - Pending only (default)
  - Approved
  - Rejected
  - All

#### `/pages/admin/content.tsx`
**Content Management:**
- CRUD operations for:
  - Learning Paths
  - AI Tools
  - Videos
- Drag-and-drop เพื่อเรียงลำดับ (optional)
- Upload วิดีโอ (link จาก Google Drive)

---

### 10. Protected Route HOC

#### `components/ProtectedRoute.tsx`
**Requirements:**
```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/useAuth';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const router = useRouter();
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!userData?.isActive) {
        router.push('/pending-approval');
      } else if (requireAdmin && !userData?.isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, userData, loading, router, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!user || !userData?.isActive) return null;
  if (requireAdmin && !userData?.isAdmin) return null;

  return children;
}
```

---

### 11. Custom Hooks

#### `lib/hooks/useAuth.ts`
```typescript
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      if (user) {
        const unsubscribeUserData = onSnapshot(
          doc(db, 'users', user.uid),
          (doc) => {
            setUserData(doc.data());
            setLoading(false);
          }
        );
        return () => unsubscribeUserData();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { user, userData, loading };
}
```

#### `lib/hooks/useLearningPaths.ts`
```typescript
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useLearningPaths() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'learningPaths'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPaths(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { paths, loading };
}
```

#### Similar hooks:
- `useAITools()`
- `useVideoProgress(userId)`
- `usePendingApprovals()` (for admin)

---

### 12. Reusable Components

#### `components/GoogleSignInButton.tsx` (NEW)
```tsx
import { useRouter } from 'next/router';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function GoogleSignInButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'google',
          isActive: false,
          needsApproval: true,
          package: null,
          createdAt: new Date(),
          progress: {}
        });
        
        alert('บัญชีของคุณรอการอนุมัติจาก Admin\nโปรดรอประมาณ 24 ชั่วโมง');
        await auth.signOut();
        router.push('/pending-approval');
      } else {
        const userData = userDoc.data();
        if (!userData.isActive) {
          alert('บัญชีของคุณยังไม่ได้รับการอนุมัติ');
          await auth.signOut();
          router.push('/pending-approval');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {loading ? (
          <span>กำลังเข้าสู่ระบบ...</span>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              {/* Google icon SVG */}
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            เข้าสู่ระบบด้วย Google
          </>
        )}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
```

#### Other components:
- `PathCard.tsx` - Learning path card with lock overlay
- `ToolCard.tsx` - AI tool card
- `LockOverlay.tsx` - Lock UI for restricted content
- `ProgressBar.tsx` - Progress indicator
- `Navbar.tsx` - Top navigation
- `PackageBadge.tsx` - Show user's package
- `ProviderBadge.tsx` (NEW) - Show "Email" or "Google" icon
- `PendingApprovalBanner.tsx` (NEW) - Banner for pending users

---

### 13. Styling Guidelines

**Use Tailwind CSS with this design system:**

**Colors:**
- Primary: `purple-600` (#9333ea)
- Secondary: `pink-600` (#db2777)
- Success: `green-500` (#10b981)
- Error: `red-500` (#ef4444)
- Warning: `yellow-500` (#eab308)

**Backgrounds:**
- Main: `gray-50`
- Hero: `bg-gradient-to-r from-purple-600 to-pink-600`
- Cards: `bg-white`

**Components:**
- Cards: `bg-white shadow-lg rounded-xl border-2 border-transparent hover:border-purple-500 transition-all`
- Buttons Primary: `bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90`
- Buttons Secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300`
- Badges: `bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm`

**Typography:**
- Font: Inter or system default
- Headings: `font-bold`
- Body: `font-normal`

**Responsive:**
- Mobile: stack vertically
- Tablet: 2-column grid
- Desktop: 3-column grid

---

### 14. Mock Data (For Initial Testing)

#### `data/mockData.ts`
```typescript
export const mockLearningPaths = [
  {
    id: "video-ads",
    title: "🎬 สร้างวิดีโอโฆษณาด้วย AI",
    description: "เรียนรู้ทุกขั้นตอนการสร้างวิดีโอโฆษณาระดับมืออาชีพ",
    icon: "🎬",
    level: "เริ่มต้น",
    duration: "3 ชั่วโมง",
    totalVideos: 12,
    toolsUsed: ["ChatGPT", "Midjourney", "Heygen", "Comfy UI"],
    requiredPackage: "basic"
  },
  {
    id: "product-design",
    title: "🖼️ ออกแบบโฆษณา Product",
    description: "สร้างภาพโฆษณาสินค้าสวยงามด้วย AI",
    icon: "🖼️",
    level: "เริ่มต้น",
    duration: "2 ชั่วโมง",
    totalVideos: 8,
    toolsUsed: ["ChatGPT", "Midjourney", "Freepik"],
    requiredPackage: "allinone"
  }
  // Add more...
];

export const mockAITools = [
  {
    id: "chatgpt",
    name: "ChatGPT / GPT Custom",
    folder: "GPT Custom",
    icon: "🤖",
    videos: 5,
    requiredPackage: "basic"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    folder: "MIDJOURNEY",
    icon: "🎨",
    videos: 4,
    requiredPackage: "basic"
  }
  // Add more...
];
```

---

### 15. Environment Variables

#### `.env.local`
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

### 16. Additional Files

- `.gitignore` - Include: `.env.local`, `node_modules`, `.next`
- `README.md` - Setup instructions
- `package.json` - All dependencies
- `tsconfig.json` - TypeScript config
- `tailwind.config.js` - Tailwind customization

---

## 🎨 Design System Summary

**Primary Actions:**
- Login: Email/Password form + Google Sign-In button
- Dashboard: 2 tabs (Learning Paths, AI Tools)
- Lock UI: Blur overlay + lock icon + upgrade message
- Admin: Approvals page with Approve/Reject actions

**Key UI Elements:**
- Google Sign-In button: White bg, Google colors, icon + text
- Provider badges: Small pills showing 🔒 Email or 🌐 Google
- Lock overlays: Semi-transparent with blur effect
- Progress bars: Purple gradient
- Profile photos: Circular, fallback to initials

---

## 📋 Requirements Checklist

กรุณาสร้างโปรเจกต์ที่มีครบทุกอย่างนี้:

- [ ] Next.js 14 + TypeScript + Tailwind CSS setup
- [ ] Firebase Auth integration (Email/Password + Google)
- [ ] Firestore integration
- [ ] Login page with both auth methods
- [ ] Google Sign-In with approval flow
- [ ] Register page (Email/Password only)
- [ ] Pending approval page (for Google users)
- [ ] Dashboard with 2 tabs and package info
- [ ] Learning Path cards with lock logic
- [ ] AI Tool cards with lock logic
- [ ] Learning Path detail page
- [ ] AI Tool detail page
- [ ] Video player with Google Drive embed
- [ ] Profile page with provider indicator
- [ ] Protected route HOC with approval check
- [ ] Custom hooks (useAuth, useLearningPaths, etc.)
- [ ] Admin dashboard overview
- [ ] Admin users management
- [ ] **Admin pending approvals page** (สำคัญ!)
- [ ] Admin content management
- [ ] Reusable components (all listed above)
- [ ] Mock data for testing
- [ ] Responsive design
- [ ] .env.local template
- [ ] .gitignore
- [ ] README.md with setup instructions

---

## 🚀 Additional Instructions

### 1. Code Quality
- ใช้ TypeScript อย่างเข้มงวด (no `any` types)
- Component แบบ functional + hooks เท่านั้น
- Comment สำคัญๆ เป็นภาษาไทย
- ใช้ ESLint และ Prettier

### 2. Performance
- ใช้ React.memo ที่เหมาะสม
- Lazy load routes ด้วย Next.js dynamic import
- Optimize images (Next.js Image component)

### 3. Security
- ห้ามเก็บ sensitive data ใน client
- Validate inputs ทุก form
- Sanitize user inputs
- Check `isActive` และ `package` ก่อนแสดงเนื้อหา

### 4. Error Handling
- Try-catch ทุก async operations
- แสดง error message ที่เป็นมิตร
- Fallback UI ถ้า data loading ไม่สำเร็จ
- Loading states ทุกที่

### 5. Google Sign-In Specific
- Handle popup blockers
- Show clear messages for pending approval
- Auto logout if not approved
- Track provider in all user documents

---

## 🎯 Priority

เริ่มสร้างตามลำดับนี้:
1. Project setup & Firebase config (with Google provider)
2. Authentication pages (login with both methods, register, pending approval)
3. Protected route with approval check
4. Dashboard (ทั้ง 2 tabs)
5. Admin approvals page (สำคัญ!)
6. Learning Path & Tool detail pages
7. Video player page
8. Profile page with provider badge
9. Admin users management
10. Polish UI/UX

---

## 🆕 Version 2.0 Key Changes

**สิ่งที่เพิ่มมาใหม่:**
1. Google Sign-In authentication
2. Admin approval workflow
3. Pending approval page
4. Provider badges (Email/Google)
5. Profile photos from Google
6. Enhanced admin panel with approvals management
7. Anti-fraud IP tracking
8. Session control

**สิ่งที่ต้องระวังเป็นพิเศษ:**
- Google users ต้องผ่าน admin approval ก่อนใช้งาน
- แยก UI สำหรับ Email vs Google users (เช่น Change Password)
- Track provider ใน Firestore documents
- Handle case ที่ user พยายาม login ก่อนถูก approve

---

กรุณาเริ่มสร้างโปรเจกต์เลยครับ! ถ้ามีข้อสงสัยหรือต้องการ clarification ประเด็นใด สามารถถามได้เลยครับ

เมื่อเสร็จแล้ว กรุณาสร้างไฟล์ SETUP.md ที่อธิบายวิธีการ:
1. ติดตั้ง dependencies
2. Setup Firebase (Email/Password + Google Sign-In)
3. เพิ่ม authorized domains
4. รันโปรเจกต์
5. เพิ่ม mock data ลง Firestore
6. สร้าง admin user
7. ทดสอบทั้ง 2 authentication methods
8. ทดสอบ approval workflow

ขอบคุณครับ! 🚀
```

---

## 📌 หมายเหตุสำคัญ

### สำหรับการใช้งาน Claude Code CLI:

1. **บันทึกไฟล์ spec ไว้ในโฟลเดอร์เดียวกัน** - Claude Code จะอ่านได้
2. **ส่ง prompt ทีละส่วน** - ถ้า Claude Code overwhelmed
3. **ตรวจสอบแต่ละ file** - ก่อน approve
4. **ทดสอบ Google Sign-In** - บน localhost และ production
5. **เพิ่ม authorized domains** - ใน Firebase ทุกครั้งที่ deploy

### การทดสอบที่สำคัญ:

- [ ] Email/Password registration flow
- [ ] Google Sign-In registration → pending approval
- [ ] Admin approve user → user can login
- [ ] Admin reject user → user cannot login
- [ ] Profile shows correct provider badge
- [ ] Change password works (Email users only)
- [ ] Progress tracking works
- [ ] Access control works

### ถ้าเจอปัญหา:

1. เช็ค Firebase Console → Authentication → Users
2. เช็ค Firestore → users collection → document fields
3. เช็ค Browser Console (F12) → errors
4. เช็ค authorized domains ใน Firebase
5. Clear cache แล้วลองใหม่