'use client';

import Link from 'next/link';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-all hover:gap-3 group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>กลับหน้าแรก</span>
        </Link>

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-6">
          <img src="/images/logo_1.png" alt="Prompt D Academy Logo" className="w-12 h-12 object-contain" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Prompt D Academy
          </span>
        </Link>

        <h2 className="text-center text-3xl font-bold text-gray-900">
          เข้าสู่ระบบ
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          เข้าสู่ระบบด้วย Google Account ของคุณ
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-12 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border-2 border-purple-200/50">
          {/* Information Box */}
          <div className="mb-8 p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300/50 rounded-xl shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-900 font-bold mb-1">
                  ระบบเข้าสู่ระบบด้วย Google
                </p>
                <p className="text-xs text-purple-800">
                  เพื่อความปลอดภัยและสะดวกรวดเร็ว เราใช้ระบบ Google OAuth ในการเข้าสู่ระบบ ไม่จำเป็นต้องจดจำรหัสผ่าน
                </p>
              </div>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <GoogleSignInButton />

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              การเข้าสู่ระบบหมายถึงคุณยอมรับ{' '}
              <Link href="/terms" className="text-purple-600 hover:text-purple-500 font-medium underline">
                ข้อกำหนดการใช้งาน
              </Link>
              {' '}และ{' '}
              <Link href="/privacy" className="text-purple-600 hover:text-purple-500 font-medium underline">
                นโยบายความเป็นส่วนตัว
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
