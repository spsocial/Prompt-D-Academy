# Prompt D Academy - Learning Platform Specification (v2.0)

## 📋 Project Overview

**Project Name:** Prompt D Academy  
**Purpose:** Private online learning platform for AI courses with package-based access control  
**Tech Stack:** Next.js 14, React, TypeScript, Firebase (Auth + Firestore), Tailwind CSS  
**Target Users:** Students enrolled in AI courses (paid packages)

---

## 🎨 Design Reference

Use the provided React component as the design foundation with these modifications:
- Brand: "Prompt D Academy" (replace "AI Academy")
- Color scheme: Purple-to-Pink gradient (keep existing design)
- Font: Modern, clean sans-serif (Inter or similar)
- Logo: Zap icon with "Prompt D Academy" text

---

## 🔐 Authentication & Security Requirements

### Login System (Dual Authentication)
1. **Firebase Authentication** with:
   - **Option A:** Email/Password (Traditional)
   - **Option B:** Google Sign-In (Recommended for UX)
   
2. **Security Features:**
   - Email verification required for Email/Password signup
   - **Admin approval required for Google Sign-In users** (anti-fraud)
   - Session control: Maximum 2 concurrent devices per account
   - Auto-logout after 30 days of inactivity
   - Password requirements (Email/Password): Min 8 characters, 1 uppercase, 1 number
   - IP tracking for suspicious activity detection
   - Device fingerprinting (optional)

### User Registration Flow

#### Flow A: Email/Password
```
Step 1: User registers with email + password
Step 2: Firebase sends verification email
Step 3: User verifies email
Step 4: Account auto-activated (or admin review if needed)
Step 5: Admin assigns package
Step 6: User can login and access content
```

#### Flow B: Google Sign-In (NEW)
```
Step 1: User clicks "เข้าสู่ระบบด้วย Google"
Step 2: Google OAuth popup
Step 3: System creates user document with isActive = false
Step 4: Show message: "รอการอนุมัติจาก Admin (24 ชม.)"
Step 5: Admin reviews and approves + assigns package
Step 6: User can login and access content
```

### Anti-Fraud Measures
- **For Email/Password:** Limited email domains (optional), payment verification
- **For Google Sign-In:** 
  - Mandatory admin approval
  - Cross-reference email with payment records
  - Track multiple accounts from same IP
  - Flag suspicious patterns (e.g., mass registrations)
- **For Both:**
  - Session monitoring (max 2 devices)
  - IP address logging
  - Activity tracking (video watches, login times)
  - Auto-flag accounts with suspicious behavior

---

## 💎 Package System (Subscription Tiers)

### Package 1: "โฆษณาโปร" (299 THB)
- **Access:** Video Advertising course only
- **Includes:**
  - 🎬 สร้างวิดีโอโฆษณาด้วย AI (full access)
  - Tools: ChatGPT, Midjourney, Heygen, Comfy UI

### Package 2: "All-in-One" (499 THB)
- **Access:** All available courses
- **Includes:**
  - All Package 1 content
  - 🖼️ ออกแบบโฆษณา Product
  - ✨ สร้าง TikTok Viral
  - 🎵 สร้างเพลงด้วย AI
  - 📖 สร้างนิทานเล่าเรื่องด้วย AI
  - All AI Tool tutorials

### Package 3: "Pro Developer" (999 THB) - Coming Soon
- **Access:** Everything + Advanced content
- **Includes:**
  - All Package 2 content
  - 🌐 สร้างเว็บไซต์ด้วย AI
  - 🤖 สร้าง Automation ระบบ
  - Advanced AI workflows

---

## 🗂️ Database Schema (Firestore)

### Collection: `users`
```typescript
{
  uid: string;                    // Firebase Auth UID
  email: string;
  displayName: string;
  photoURL?: string;              // From Google profile (if Google Sign-In)
  provider: "email" | "google";   // Authentication method
  isActive: boolean;              // Admin approval status
  needsApproval: boolean;         // True for Google Sign-In users
  package: "basic" | "allinone" | "pro" | null;
  packageExpiry: timestamp;       // Subscription end date
  createdAt: timestamp;
  lastLogin: timestamp;
  
  // Anti-fraud tracking
  lastLoginIP?: string;
  loginHistory: [
    {
      timestamp: timestamp;
      ip: string;
      device: string;
    }
  ];
  activeSessions: number;         // Track concurrent logins
  suspiciousActivity: boolean;    // Flagged by admin or system
  
  // Progress tracking
  progress: {
    [courseId]: {
      completed: number;
      lastWatchedVideo: string;
      completionPercent: number;
      watchedVideos: string[];    // Array of video IDs
    }
  }
}
```

### Collection: `aiTools`
```typescript
{
  id: string;
  name: string;
  folder: string;                 // Google Drive folder name
  icon: string;                   // Emoji icon
  description: string;
  videos: [
    {
      id: string;
      title: string;
      driveId: string;            // Google Drive file ID
      duration: string;           // "15:30"
      order: number;              // Display order
      description?: string;
    }
  ],
  requiredPackage: "basic" | "allinone" | "pro";
}
```

### Collection: `learningPaths`
```typescript
{
  id: string;
  title: string;
  description: string;
  icon: string;
  level: "เริ่มต้น" | "กลาง" | "สูง";
  requiredPackage: "basic" | "allinone" | "pro";
  totalDuration: string;
  totalVideos: number;
  toolsUsed: string[];            // Array of AI tool names
  steps: [
    {
      order: number;
      toolId: string;             // Reference to aiTools collection
      videoId: string;
      title: string;
      description: string;
    }
  ]
}
```

### Collection: `admin`
```typescript
{
  settings: {
    allowNewRegistrations: boolean;
    requireApprovalForGoogle: boolean;  // NEW
    requireApprovalForEmail: boolean;   // NEW
    maintenanceMode: boolean;
  },
  pricing: {
    basic: 299,
    allinone: 499,
    pro: 999
  }
}
```

### Collection: `pendingApprovals` (NEW)
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  provider: "email" | "google";
  photoURL?: string;
  createdAt: timestamp;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;            // Admin UID
  reviewedAt?: timestamp;
  notes?: string;                 // Admin notes
}
```

---

## 🎯 Features & Pages

### 1. Public Pages (No Login Required)
- `/` - Landing page with course info & pricing
- `/login` - Login form with Email/Password + Google Sign-In button
- `/register` - Registration form (Email/Password only)
- `/forgot-password` - Password reset
- `/pending-approval` - Message for users waiting approval (NEW)

### 2. Protected Pages (Login Required)

#### `/dashboard` - Main Dashboard
- Welcome message with user's name (+ profile photo if Google)
- Package info card (current plan, expiry date)
- Quick stats (courses completed, total watch time)
- Continue watching section
- Two tabs:
  - **เส้นทางการเรียน** (Learning Paths)
  - **เรียนแยกตาม AI Tool** (AI Tools)

#### `/learning-path/[id]` - Learning Path Detail
- Path overview
- Step-by-step curriculum
- Start learning button
- Lock icon on steps not accessible by user's package

#### `/tool/[id]` - AI Tool Detail
- Tool overview
- List of all videos for that tool
- Progress indicator
- Lock icon if not in user's package

#### `/video/[id]` - Video Player
- Embedded Google Drive video player
- Video title and description
- Next video button (auto-navigate in learning path)
- Mark as completed button
- Sidebar: Course outline with current position highlighted

#### `/profile` - User Profile
- Display name, email
- Profile photo (if Google Sign-In)
- Current package info
- Login method indicator (Email or Google)
- Change password (Email/Password users only)
- Logout button

### 3. Admin Pages (Admin Role Only)

#### `/admin/dashboard` - Admin Overview (NEW)
- Total users, active subscriptions
- Pending approvals count
- Revenue statistics
- Recent activity

#### `/admin/users` - User Management
- List all users
- Filter by: provider (email/google), package, status
- Search by email
- Assign/change packages
- Activate/deactivate accounts
- View user progress
- View login history & IP addresses
- Flag suspicious accounts

#### `/admin/approvals` - Pending Approvals (NEW)
- List of users waiting approval (mostly Google Sign-In)
- Show: Email, Display Name, Provider, Registration Date
- Actions: Approve, Reject, Review Later
- Add notes for each user
- Bulk actions

#### `/admin/content` - Content Management
- Add/edit Learning Paths
- Add/edit AI Tools
- Add/edit Videos
- Organize video order

---

## 🔒 Access Control Logic

### Permission Check Function
```typescript
function canAccessContent(
  userPackage: string,
  requiredPackage: string
): boolean {
  const hierarchy = {
    basic: 1,
    allinone: 2,
    pro: 3
  };
  
  return hierarchy[userPackage] >= hierarchy[requiredPackage];
}
```

### Authentication Check
```typescript
function canUserAccess(user: User): boolean {
  // Must be logged in
  if (!user) return false;
  
  // Must be active (approved by admin)
  if (!user.isActive) return false;
  
  // Must have a package assigned
  if (!user.package) return false;
  
  // Must not be expired (if expiry is set)
  if (user.packageExpiry && user.packageExpiry < new Date()) {
    return false;
  }
  
  return true;
}
```

### UI Behavior
- Content not in user's package shows:
  - Lock icon 🔒
  - "อัพเกรดแพ็คเกจเพื่อปลดล็อค" message
  - Upgrade button (link to contact admin or pricing page)
  
- Users pending approval see:
  - "บัญชีของคุณรอการอนุมัติจาก Admin" message
  - Estimated approval time
  - Contact support button

---

## 🎬 Google Drive Integration

### Video Embedding
Use Google Drive's preview URL:
```html
<iframe
  src="https://drive.google.com/file/d/[DRIVE_FILE_ID]/preview"
  width="100%"
  height="600"
  allow="autoplay"
></iframe>
```

### Requirements
- Videos in Google Drive must be set to "Anyone with the link can view"
- Store only the Drive File ID in Firestore (not full URL)
- Extract File ID from sharing link format:
  `https://drive.google.com/file/d/[THIS_IS_THE_ID]/view`

---

## 🔐 Firebase Setup Instructions

### Enable Authentication Methods
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password"
3. Enable "Google" 
   - Add your authorized domain (e.g., promptdacademy.com)
   - For development, localhost is auto-enabled

### Google OAuth Setup
```typescript
// lib/firebase.ts
import { GoogleAuthProvider } from 'firebase/auth';

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Force account selection every time
});
```

---

## 📱 Responsive Design

- **Desktop:** Full sidebar navigation
- **Tablet:** Collapsible sidebar
- **Mobile:** Bottom navigation bar with hamburger menu

---

## 🚀 Initial Content Structure

### Learning Paths (MVP)

1. **🎬 สร้างวิดีโอโฆษณาด้วย AI** (Package: basic)
   - Step 1: ChatGPT - เขียน Script โฆษณา
   - Step 2: Midjourney - สร้างภาพประกอบ
   - Step 3: Heygen - สร้าง AI Avatar พูด
   - Step 4: Comfy UI - Edit และปรับแต่ง
   - Step 5: Workshop - รวมทุกอย่างเป็นโฆษณาจริง

2. **🖼️ ออกแบบโฆษณา Product** (Package: allinone)
   - ChatGPT, Midjourney, Freepik

3. **✨ สร้าง TikTok Viral** (Package: allinone)
   - ChatGPT, Heygen, VECO3

4. **🎵 สร้างเพลงด้วย AI** (Package: allinone)
   - (Add tools as needed)

5. **📖 สร้างนิทานเล่าเรื่องด้วย AI** (Package: allinone)
   - (Add tools as needed)

6. **🌐 สร้างเว็บไซต์ด้วย AI** (Package: pro) - Coming Soon
7. **🤖 สร้าง Automation ระบบ** (Package: pro) - Coming Soon

### AI Tools (From Google Drive folders)
- GPT Custom
- Midjourney
- Heygen สิบชิ้นตี
- Dreamface สิบชิ้นตี
- Comfy ui
- คอร์ส Tiktok ปิดตระกร้า
- Freepik
- VECO3
- NANO BANANA
- (Add more as folders are added)

---

## 🎨 UI Components Needed

### Reusable Components
1. **PackageBadge** - Shows user's current package
2. **LockOverlay** - Shows when content is locked
3. **ProgressBar** - Shows course completion
4. **VideoCard** - Displays video thumbnail and info
5. **PathCard** - Displays learning path overview
6. **ToolCard** - Displays AI tool info
7. **Navigation** - Top navbar with logo, search, profile
8. **Sidebar** - Left sidebar with course navigation
9. **UpgradeModal** - Prompts user to upgrade package
10. **PendingApprovalBanner** - Shows when waiting approval (NEW)
11. **GoogleSignInButton** - Styled Google OAuth button (NEW)
12. **AuthProviderBadge** - Shows "Email" or "Google" icon (NEW)

---

## 🛡️ Security Best Practices

### 1. Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
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
    
    // Users can only read their own data
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isAdmin();
    }
    
    // Content (only active users can read)
    match /aiTools/{tool} {
      allow read: if isActive();
      allow write: if isAdmin();
    }
    
    match /learningPaths/{path} {
      allow read: if isActive();
      allow write: if isAdmin();
    }
    
    // Pending approvals (only admin)
    match /pendingApprovals/{approval} {
      allow read, write: if isAdmin();
    }
    
    // Admin only
    match /admin/{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

### 2. Environment Variables (.env.local)
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 3. Anti-Fraud Implementation
```typescript
// lib/antifraud.ts

// Track login
async function trackLogin(userId: string, ip: string, device: string) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    lastLogin: new Date(),
    lastLoginIP: ip,
    loginHistory: arrayUnion({
      timestamp: new Date(),
      ip,
      device
    })
  });
  
  // Check for suspicious patterns
  await checkSuspiciousActivity(userId);
}

// Check for multiple accounts from same IP
async function checkSuspiciousActivity(userId: string) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();
  const userIP = userData.lastLoginIP;
  
  // Find other users with same IP
  const usersWithSameIP = await getDocs(
    query(
      collection(db, 'users'),
      where('lastLoginIP', '==', userIP)
    )
  );
  
  // If more than 3 accounts from same IP, flag as suspicious
  if (usersWithSameIP.size > 3) {
    await updateDoc(doc(db, 'users', userId), {
      suspiciousActivity: true
    });
    
    // Notify admin
    await notifyAdmin({
      type: 'suspicious_activity',
      userId,
      ip: userIP,
      accountCount: usersWithSameIP.size
    });
  }
}
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "firebase": "^10.7.0",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "@heroicons/react": "^2.1.1"
  }
}
```

---

## 🚀 Deployment

### Hosting: Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Alternative: Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

---

## 🧪 Testing Checklist

- [ ] Email/Password registration flow
- [ ] Email verification works
- [ ] Google Sign-In registration
- [ ] Google users see pending approval message
- [ ] Admin can approve/reject users
- [ ] Login/logout works (both methods)
- [ ] Package-based access control works
- [ ] Video playback from Google Drive
- [ ] Progress tracking saves correctly
- [ ] Cannot access locked content
- [ ] Session control (max 2 devices)
- [ ] IP tracking works
- [ ] Suspicious activity detection
- [ ] Responsive on mobile/tablet/desktop
- [ ] Admin panel functions correctly
- [ ] Profile shows correct provider (Email/Google)

---

## 📝 Sample Initial Data (For Testing)

### Sample User (Email/Password)
```json
{
  "uid": "user123",
  "email": "student@example.com",
  "displayName": "นักเรียนทดสอบ",
  "provider": "email",
  "isActive": true,
  "needsApproval": false,
  "package": "basic",
  "createdAt": "2025-10-21T10:00:00Z",
  "progress": {}
}
```

### Sample User (Google Sign-In - Pending)
```json
{
  "uid": "user456",
  "email": "student2@gmail.com",
  "displayName": "Student Two",
  "photoURL": "https://lh3.googleusercontent.com/...",
  "provider": "google",
  "isActive": false,
  "needsApproval": true,
  "package": null,
  "createdAt": "2025-10-21T11:00:00Z",
  "progress": {}
}
```

---

## 🎯 MVP Development Phases

### Phase 1: Core Setup (Week 1)
- [ ] Initialize Next.js project
- [ ] Setup Firebase Auth & Firestore
- [ ] Create basic login page (Email/Password + Google)
- [ ] Create register page (Email/Password)
- [ ] Setup Tailwind CSS
- [ ] Implement pending approval flow

### Phase 2: Content Display (Week 2)
- [ ] Dashboard with Learning Paths tab
- [ ] Dashboard with AI Tools tab
- [ ] Learning Path detail page
- [ ] AI Tool detail page
- [ ] Video player page with Google Drive embed

### Phase 3: Access Control (Week 3)
- [ ] Implement package-based permissions
- [ ] Add lock UI for restricted content
- [ ] Progress tracking
- [ ] Profile page with provider indicator

### Phase 4: Admin Panel (Week 4)
- [ ] Admin dashboard overview
- [ ] User management page
- [ ] Pending approvals page (NEW)
- [ ] Content management (CRUD)
- [ ] Anti-fraud monitoring

### Phase 5: Polish & Testing (Week 5)
- [ ] Mobile responsive fixes
- [ ] Performance optimization
- [ ] Security audit
- [ ] Anti-fraud testing
- [ ] User acceptance testing

---

## 💡 Future Enhancements (Post-MVP)

- Payment integration (Stripe/PayPal/Promptpay QR)
- Automated payment → package assignment
- Certificate of completion
- Discussion forum per course
- Quiz/Assessment system
- Mobile app (React Native)
- Email notifications (course updates, approval status)
- Referral program
- Webhook for payment verification
- Advanced analytics (watch time, completion rates)

---

## 📞 Support & Contact

**Admin Dashboard Link:** `/admin`  
**Default Admin:** (Set via Firebase Console)

For technical issues, check Firebase Console logs and Next.js error pages.

---

## 🎉 Ready to Build!

This specification is complete and ready to be implemented by Claude Code CLI.

**Suggested Claude Code Prompt:**
```
Read this specification file and create a complete Next.js application for "Prompt D Academy" 
learning platform. Follow all requirements exactly as specified, including:
- Firebase authentication with Email/Password AND Google Sign-In
- Admin approval system for Google Sign-In users
- Package-based access control (basic, allinone, pro)
- Dashboard with Learning Paths and AI Tools tabs
- Video player with Google Drive integration
- User profile with auth provider indicator
- Progress tracking
- Admin panel for user and content management
- Pending approvals management
- Anti-fraud measures (IP tracking, session control)
- Responsive design with purple-to-pink gradient theme
- All security rules and best practices

Start with Phase 1 (Core Setup) and build incrementally.
```

---

**Document Version:** 2.0 (Updated with Google Sign-In)  
**Last Updated:** October 21, 2025  
**Author:** Claude (Anthropic)