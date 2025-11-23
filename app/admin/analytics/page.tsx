'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Users, BookOpen, Wrench, TrendingUp, CheckCircle,
  Video, BarChart, Activity, Crown, Eye, Play, UserPlus, Package, Target
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  usersWithPackage: number;
  activeLearners: number;
  newUsersLast7Days: number;
  totalPaths: number;
  totalTools: number;
  totalVideos: number;
  totalVideosWatched: number;
  totalCourseEnrollments: number;
  avgVideosPerLearner: number;
  avgCoursesPerLearner: number;
  packageDistribution: {
    free: number;
    basic: number;
    allinone: number;
    pro: number;
    pro_standalone: number;
    none: number;
  };
  topUsers: Array<{
    name: string;
    email: string;
    videoCount: number;
    courseCount: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    usersWithPackage: 0,
    activeLearners: 0,
    newUsersLast7Days: 0,
    totalPaths: 0,
    totalTools: 0,
    totalVideos: 0,
    totalVideosWatched: 0,
    totalCourseEnrollments: 0,
    avgVideosPerLearner: 0,
    avgCoursesPerLearner: 0,
    packageDistribution: {
      free: 0,
      basic: 0,
      allinone: 0,
      pro: 0,
      pro_standalone: 0,
      none: 0,
    },
    topUsers: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Load Users
      const usersCol = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCol);
      const users = usersSnapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }));

      // Load Learning Paths
      const pathsCol = collection(db, 'learningPaths');
      const pathsSnapshot = await getDocs(pathsCol);

      // Load AI Tools
      const toolsCol = collection(db, 'aiTools');
      const toolsSnapshot = await getDocs(toolsCol);
      const tools = toolsSnapshot.docs.map((doc) => doc.data());

      // Calculate total videos in system
      const totalVideos = tools.reduce((sum, tool: any) => sum + (tool.videos?.length || 0), 0);

      // Calculate stats
      const totalUsers = users.length;
      const activeUsers = users.filter((u: any) => u.isActive).length;
      const usersWithPackage = users.filter((u: any) => u.package).length;

      // Calculate new users in last 7 days
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const newUsersLast7Days = users.filter((u: any) => {
        if (!u.createdAt) return false;
        const userDate = new Date(u.createdAt);
        return userDate >= sevenDaysAgo;
      }).length;

      // Package distribution
      const packageDistribution = {
        free: 0,
        basic: 0,
        allinone: 0,
        pro: 0,
        pro_standalone: 0,
        none: 0,
      };

      users.forEach((user: any) => {
        if (!user.package) {
          packageDistribution.none++;
        } else if (user.package === 'free') {
          packageDistribution.free++;
        } else if (user.package === 'basic') {
          packageDistribution.basic++;
        } else if (user.package === 'allinone') {
          packageDistribution.allinone++;
        } else if (user.package === 'pro') {
          packageDistribution.pro++;
        } else if (user.package === 'pro_standalone') {
          packageDistribution.pro_standalone++;
        }
      });

      // Calculate total videos watched, course enrollments, and active learners
      let totalVideosWatched = 0;
      let totalCourseEnrollments = 0;
      let activeLearners = 0;
      const userStats: any[] = [];

      users.forEach((user: any) => {
        if (user.progress) {
          const courseCount = Object.keys(user.progress).length;
          const videoCount = Object.values(user.progress).reduce(
            (acc: number, p: any) => acc + (p.watchedVideos?.length || 0),
            0
          );

          totalCourseEnrollments += courseCount;
          totalVideosWatched += videoCount;

          if (videoCount > 0) {
            activeLearners++;
            userStats.push({
              name: user.displayName || 'Unknown',
              email: user.email || '',
              videoCount,
              courseCount,
            });
          }
        }
      });

      // Calculate averages
      const avgVideosPerLearner = activeLearners > 0 ? Math.round(totalVideosWatched / activeLearners) : 0;
      const avgCoursesPerLearner = activeLearners > 0 ? Math.round(totalCourseEnrollments / activeLearners) : 0;

      // Get top 5 users
      const topUsers = userStats
        .sort((a, b) => b.videoCount - a.videoCount)
        .slice(0, 5);

      setAnalytics({
        totalUsers,
        activeUsers,
        usersWithPackage,
        activeLearners,
        newUsersLast7Days,
        totalPaths: pathsSnapshot.size,
        totalTools: toolsSnapshot.size,
        totalVideos,
        totalVideosWatched,
        totalCourseEnrollments,
        avgVideosPerLearner,
        avgCoursesPerLearner,
        packageDistribution,
        topUsers,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userData?.isAdmin) {
    return (
      <ProtectedRoute requireActive={true}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">⛔ ไม่มีสิทธิ์เข้าถึง</h1>
              <Link href="/dashboard" className="text-purple-600 hover:underline">
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
              📊 Analytics & สถิติ
            </h1>
            <p className="text-gray-600">ภาพรวมและสถิติการใช้งานระบบ</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <>
              {/* User Stats */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">👥 ผู้ใช้</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.totalUsers}
                        </p>
                        <p className="text-sm text-gray-600">ผู้ใช้ทั้งหมด</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.activeUsers}
                        </p>
                        <p className="text-sm text-gray-600">ผู้ใช้ Active</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <Crown className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.usersWithPackage}
                        </p>
                        <p className="text-sm text-gray-600">มีแพ็คเกจ</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.activeLearners}
                        </p>
                        <p className="text-sm text-gray-600">คนที่เรียนจริง</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional User Stats */}
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.usersWithPackage > 0
                            ? Math.round(
                                (analytics.usersWithPackage / analytics.totalUsers) * 100
                              )
                            : 0}
                          %
                        </p>
                        <p className="text-sm text-gray-600">อัตราสมัครสมาชิก</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <UserPlus className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.newUsersLast7Days}
                        </p>
                        <p className="text-sm text-gray-600">สมัครใหม่ (7 วัน)</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-teal-100 rounded-lg">
                        <Play className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.activeLearners > 0
                            ? Math.round(
                                (analytics.activeLearners / analytics.totalUsers) * 100
                              )
                            : 0}
                          %
                        </p>
                        <p className="text-sm text-gray-600">อัตราการเรียนจริง</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Stats */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📚 เนื้อหา</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.totalPaths}
                        </p>
                        <p className="text-sm text-gray-600">Learning Paths</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Wrench className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.totalTools}
                        </p>
                        <p className="text-sm text-gray-600">AI Tools</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-pink-100 rounded-lg">
                        <Video className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.totalVideos}
                        </p>
                        <p className="text-sm text-gray-600">วิดีโอทั้งหมด</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-cyan-100 rounded-lg">
                        <BarChart className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.totalPaths + analytics.totalTools}
                        </p>
                        <p className="text-sm text-gray-600">คอร์สทั้งหมด</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 การมีส่วนร่วม</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Video className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.totalVideosWatched}
                        </p>
                        <p className="text-sm text-gray-600">วิดีโอที่ดูแล้ว</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.totalCourseEnrollments}
                        </p>
                        <p className="text-sm text-gray-600">คอร์สที่มีผู้เรียน</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <BarChart className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.avgVideosPerLearner}
                        </p>
                        <p className="text-sm text-gray-600">วิดีโอ/คน (เฉลี่ย)</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-cyan-100 rounded-lg">
                        <Target className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.avgCoursesPerLearner}
                        </p>
                        <p className="text-sm text-gray-600">คอร์ส/คน (เฉลี่ย)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Distribution */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📦 การกระจายแพ็คเกจ</h2>
                <div className="card">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <p className="text-2xl font-bold text-gray-900">{analytics.packageDistribution.none}</p>
                      <p className="text-xs text-gray-600 mt-1">ไม่มีแพ็กเกจ</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {analytics.totalUsers > 0
                          ? Math.round((analytics.packageDistribution.none / analytics.totalUsers) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">{analytics.packageDistribution.free}</p>
                      <p className="text-xs text-gray-600 mt-1">Free</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {analytics.totalUsers > 0
                          ? Math.round((analytics.packageDistribution.free / analytics.totalUsers) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <p className="text-2xl font-bold text-green-600">{analytics.packageDistribution.basic}</p>
                      <p className="text-xs text-gray-600 mt-1">Beginner</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {analytics.totalUsers > 0
                          ? Math.round((analytics.packageDistribution.basic / analytics.totalUsers) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                      <p className="text-2xl font-bold text-orange-600">{analytics.packageDistribution.allinone}</p>
                      <p className="text-xs text-gray-600 mt-1">All-in-One</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {analytics.totalUsers > 0
                          ? Math.round((analytics.packageDistribution.allinone / analytics.totalUsers) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <p className="text-2xl font-bold text-purple-600">{analytics.packageDistribution.pro}</p>
                      <p className="text-xs text-gray-600 mt-1">Pro Bundle</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {analytics.totalUsers > 0
                          ? Math.round((analytics.packageDistribution.pro / analytics.totalUsers) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                      <p className="text-2xl font-bold text-indigo-600">{analytics.packageDistribution.pro_standalone}</p>
                      <p className="text-xs text-gray-600 mt-1">Pro Only</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {analytics.totalUsers > 0
                          ? Math.round((analytics.packageDistribution.pro_standalone / analytics.totalUsers) * 100)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Users */}
              {analytics.topUsers.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    🏆 ผู้ใช้ที่เรียนมากที่สุด (Top 5)
                  </h2>
                  <div className="card overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            อันดับ
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            ผู้ใช้
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            วิดีโอที่ดู
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            คอร์สที่เรียน
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topUsers.map((user, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold">
                                {index + 1}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Video className="w-4 h-4 text-green-600" />
                                <span className="font-bold text-gray-900">
                                  {user.videoCount}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-blue-600" />
                                <span className="font-bold text-gray-900">
                                  {user.courseCount}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="card bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="text-center py-8">
                  <h3 className="text-2xl font-bold mb-4">📈 สรุปภาพรวม</h3>
                  <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div>
                      <p className="text-4xl font-bold mb-2">
                        {analytics.totalUsers}
                      </p>
                      <p className="text-purple-100">ผู้ใช้ทั้งหมด</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold mb-2">
                        {analytics.totalVideosWatched}
                      </p>
                      <p className="text-purple-100">วิดีโอที่ดูแล้ว</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold mb-2">
                        {analytics.totalPaths + analytics.totalTools}
                      </p>
                      <p className="text-purple-100">เนื้อหาทั้งหมด</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Back to Admin */}
          <div className="mt-8 text-center">
            <Link href="/admin" className="text-purple-600 hover:underline">
              ← กลับไปหน้า Admin
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
