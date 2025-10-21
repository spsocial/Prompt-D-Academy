'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { Users, CheckCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    suspiciousUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const usersRef = collection(db, 'users');

      // Total users
      const totalSnapshot = await getCountFromServer(usersRef);
      const totalUsers = totalSnapshot.data().count;

      // Active users
      const activeQuery = query(usersRef, where('isActive', '==', true));
      const activeSnapshot = await getCountFromServer(activeQuery);
      const activeUsers = activeSnapshot.data().count;

      // Pending approvals
      const pendingQuery = query(usersRef, where('isActive', '==', false));
      const pendingSnapshot = await getCountFromServer(pendingQuery);
      const pendingApprovals = pendingSnapshot.data().count;

      // Suspicious users
      const suspiciousQuery = query(usersRef, where('suspiciousActivity', '==', true));
      const suspiciousSnapshot = await getCountFromServer(suspiciousQuery);
      const suspiciousUsers = suspiciousSnapshot.data().count;

      setStats({
        totalUsers,
        activeUsers,
        pendingApprovals,
        suspiciousUsers,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireActive={true} requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">ยินดีต้อนรับ, {userData?.displayName}!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ผู้ใช้ทั้งหมด</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalUsers}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ผู้ใช้ที่ Active</p>
                  <p className="text-3xl font-bold text-green-600">
                    {loading ? '...' : stats.activeUsers}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <Link href="/admin/approvals" className="card hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">รอการอนุมัติ</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {loading ? '...' : stats.pendingApprovals}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </Link>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Suspicious</p>
                  <p className="text-3xl font-bold text-red-600">
                    {loading ? '...' : stats.suspiciousUsers}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">การจัดการ</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/admin/approvals"
                className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <h3 className="font-bold text-purple-900 mb-2">🔔 อนุมัติผู้ใช้</h3>
                <p className="text-sm text-purple-700">
                  จัดการคำขออนุมัติจาก Google Sign-In
                </p>
              </Link>

              <Link
                href="/admin/users"
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <h3 className="font-bold text-blue-900 mb-2">👥 จัดการผู้ใช้</h3>
                <p className="text-sm text-blue-700">
                  ดู, แก้ไข, และจัดการผู้ใช้ทั้งหมด
                </p>
              </Link>

              <Link
                href="/admin/tools"
                className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <h3 className="font-bold text-green-900 mb-2">🛠️ จัดการ AI Tools</h3>
                <p className="text-sm text-green-700">
                  เพิ่ม, แก้ไข, ลบ AI Tools และวิดีโอ
                </p>
              </Link>

              <Link
                href="/admin/paths"
                className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <h3 className="font-bold text-orange-900 mb-2">📚 จัดการ Learning Paths</h3>
                <p className="text-sm text-orange-700">
                  เพิ่ม, แก้ไข, ลบ เส้นทางการเรียน
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
