'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { Users, BookOpen, Wrench, Settings, BarChart } from 'lucide-react';

export default function AdminDashboardPage() {
  const { userData } = useAuth();

  // Force light mode for admin pages
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    return () => {
      // Restore dark mode setting when leaving admin
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    };
  }, []);

  // Check if user is admin
  if (!userData?.isAdmin) {
    return (
      <ProtectedRoute requireActive={true}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ⛔ ไม่มีสิทธิ์เข้าถึง
              </h1>
              <p className="text-gray-600">
                หน้านี้สำหรับ Admin เท่านั้น
              </p>
              <Link href="/dashboard" className="text-purple-600 hover:underline mt-4 inline-block">
                กลับไปหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireActive={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ⚙️ Admin Dashboard
            </h1>
            <p className="text-gray-600">
              ยินดีต้อนรับ, {userData?.displayName}! จัดการระบบได้ที่นี่
            </p>
          </div>

          {/* Admin Menu Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Learning Paths */}
            <Link
              href="/admin/learning-paths"
              className="card hover:shadow-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Learning Paths
                  </h3>
                  <p className="text-gray-600 text-sm">
                    จัดการเส้นทางการเรียน
                  </p>
                </div>
              </div>
            </Link>

            {/* AI Tools */}
            <Link
              href="/admin/ai-tools"
              className="card hover:shadow-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Wrench className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    AI Tools
                  </h3>
                  <p className="text-gray-600 text-sm">
                    จัดการ AI Tools
                  </p>
                </div>
              </div>
            </Link>

            {/* Users */}
            <Link
              href="/admin/users"
              className="card hover:shadow-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Users
                  </h3>
                  <p className="text-gray-600 text-sm">
                    จัดการผู้ใช้
                  </p>
                </div>
              </div>
            </Link>

            {/* Analytics */}
            <Link
              href="/admin/analytics"
              className="card hover:shadow-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <BarChart className="w-8 h-8 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Analytics
                  </h3>
                  <p className="text-gray-600 text-sm">
                    รายงานและสถิติ
                  </p>
                </div>
              </div>
            </Link>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="card hover:shadow-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-200 rounded-lg group-hover:bg-gray-300 transition-colors">
                  <Settings className="w-8 h-8 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Settings
                  </h3>
                  <p className="text-gray-600 text-sm">
                    ตั้งค่าระบบ
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <Link href="/dashboard" className="text-purple-600 hover:underline">
              ← กลับไปหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
