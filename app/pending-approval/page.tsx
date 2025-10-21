'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/hooks/useAuth';
import { Clock, Mail, Zap } from 'lucide-react';

export default function PendingApprovalPage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // If user is already active, redirect to dashboard
      if (userData?.isActive) {
        router.push('/dashboard');
      }

      // If no user, redirect to login
      if (!user) {
        router.push('/login');
      }
    }
  }, [user, userData, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4" />
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Zap className="w-12 h-12 text-purple-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Prompt D Academy
          </span>
        </Link>

        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border-2 border-purple-200">
          {/* Clock Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 p-4 rounded-full">
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
            บัญชีของคุณกำลังรอการอนุมัติ
          </h2>

          {/* User Info */}
          {userData && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt={userData.displayName}
                    className="w-12 h-12 rounded-full border-2 border-purple-500"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                    {userData.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900">{userData.displayName}</p>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {userData.provider === 'google' ? '🌐 Google' : '🔒 Email'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="space-y-4 mb-6">
            <p className="text-center text-gray-600">
              ขอบคุณที่สมัครสมาชิก! บัญชีของคุณกำลังอยู่ในระหว่างการตรวจสอบโดยทีมงาน Admin
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    ระยะเวลาการอนุมัติ
                  </p>
                  <p className="text-sm text-blue-700">
                    โดยปกติใช้เวลาประมาณ <strong>24 ชั่วโมง</strong> ในการตรวจสอบและอนุมัติบัญชี
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 text-center">
                คุณจะได้รับอีเมลแจ้งเตือนเมื่อบัญชีของคุณได้รับการอนุมัติ
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href="mailto:support@promptdacademy.com"
              className="btn-secondary w-full text-center inline-block"
            >
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                <span>ติดต่อ Admin</span>
              </div>
            </a>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              ออกจากระบบ
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อเราผ่านอีเมล
              <br />
              <a href="mailto:support@promptdacademy.com" className="text-purple-600 hover:underline">
                support@promptdacademy.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
