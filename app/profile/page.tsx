'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { ProviderBadge } from '@/components/ProviderBadge';
import { PackageBadge } from '@/components/PackageBadge';
import { FloatingContactButton } from '@/components/FloatingContactButton';
import { useAuth } from '@/lib/hooks/useAuth';
import { getPackageName } from '@/lib/utils/accessControl';
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Key,
  Award,
  Video,
  Clock,
  TrendingUp,
  X,
  MessageCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      try {
        await signOut(auth);
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError('');
    setPasswordSuccess(false);

    // Validate
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('รหัสผ่านใหม่ไม่ตรงกัน');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร');
      setLoading(false);
      return;
    }

    try {
      if (!user || !user.email) {
        setPasswordError('ไม่พบข้อมูลผู้ใช้');
        setLoading(false);
        return;
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordData.newPassword);

      // Success
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error('Change password error:', error);

      if (error.code === 'auth/wrong-password') {
        setPasswordError('รหัสผ่านปัจจุบันไม่ถูกต้อง');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('รหัสผ่านใหม่ไม่ปลอดภัยเพียงพอ');
      } else {
        setPasswordError('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalCoursesEnrolled = userData?.progress ? Object.keys(userData.progress).length : 0;
  const totalVideosWatched = userData?.progress
    ? Object.values(userData.progress).reduce((acc: number, p: any) => acc + (p.watchedVideos?.length || 0), 0)
    : 0;
  const avgCompletionRate = userData?.progress
    ? Math.round(
        Object.values(userData.progress).reduce((acc: number, p: any) => acc + (p.completionPercent || 0), 0) /
          Object.keys(userData.progress).length
      )
    : 0;

  return (
    <ProtectedRoute requireActive={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <FloatingContactButton />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">ข้อมูลส่วนตัว</h1>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - User Info */}
            <div className="md:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="card">
                <div className="flex flex-col items-center text-center">
                  {userData?.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt={userData.displayName}
                      className="w-24 h-24 rounded-full border-4 border-purple-500 mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-4xl mb-4">
                      {userData?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-gray-900 mb-1">{userData?.displayName}</h2>
                  <p className="text-gray-600 text-sm mb-3">{userData?.email}</p>

                  {/* Provider Badge */}
                  {userData?.provider && <ProviderBadge provider={userData.provider} />}
                </div>
              </div>

              {/* Actions */}
              <div className="card space-y-3">
                {userData?.provider === 'email' && (
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Key className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">เปลี่ยนรหัสผ่าน</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">ออกจากระบบ</span>
                </button>
              </div>
            </div>

            {/* Right Column - Package & Stats */}
            <div className="md:col-span-2 space-y-6">
              {/* Package Info */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  แพ็คเกจของคุณ
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">แพ็คเกจปัจจุบัน:</span>
                    <PackageBadge packageId={userData?.package || null} size="md" />
                  </div>

                  {userData?.packageExpiry && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">วันหมดอายุ:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(userData.packageExpiry).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">สมัครสมาชิกเมื่อ:</span>
                    <span className="font-medium text-gray-900">
                      {userData?.createdAt &&
                        new Date(userData.createdAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                    </span>
                  </div>

                  {!userData?.package && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 mb-2">
                        คุณยังไม่มีแพ็คเกจ กรุณาติดต่อ Admin เพื่อเลือกแพ็คเกจที่เหมาะสมกับคุณ
                      </p>
                      <a
                        href="https://m.me/719837687869400"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        ติดต่อ Admin เพื่อสมัครแพ็คเกจ
                      </a>
                    </div>
                  )}

                  {userData?.package && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-purple-800 mb-2 font-medium">
                        สิทธิประโยชน์ของ {getPackageName(userData.package)}:
                      </p>
                      <ul className="text-sm text-purple-700 space-y-1">
                        {userData.package === 'basic' && (
                          <>
                            <li>✓ สร้างวิดีโอโฆษณาด้วย AI</li>
                            <li>✓ เครื่องมือ: ChatGPT, Midjourney, Heygen</li>
                          </>
                        )}
                        {userData.package === 'allinone' && (
                          <>
                            <li>✓ เข้าถึงคอร์สทั้งหมด</li>
                            <li>✓ สร้างวิดีโอโฆษณา, ออกแบบ Product, TikTok Viral</li>
                            <li>✓ เครื่องมือครบชุด</li>
                          </>
                        )}
                        {userData.package === 'pro' && (
                          <>
                            <li>✓ เข้าถึงทุกคอร์ส + Advanced Content</li>
                            <li>✓ สร้างเว็บไซต์และ Automation</li>
                            <li>✓ เครื่องมือ Premium ทั้งหมด</li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  สถิติการเรียน
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{totalCoursesEnrolled}</p>
                    <p className="text-xs text-gray-600">คอร์สที่เรียน</p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <Video className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{totalVideosWatched}</p>
                    <p className="text-xs text-gray-600">วิดีโอที่ดู</p>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{avgCompletionRate}%</p>
                    <p className="text-xs text-gray-600">อัตราความสำเร็จ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
              <button
                onClick={() => setShowChangePassword(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">เปลี่ยนรหัสผ่าน</h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{passwordError}</p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">เปลี่ยนรหัสผ่านสำเร็จ!</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสผ่านปัจจุบัน
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    อย่างน้อย 8 ตัวอักษร, 1 ตัวพิมพ์ใหญ่, 1 ตัวเลข
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 btn-secondary"
                  >
                    ยกเลิก
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 btn-primary">
                    {loading ? 'กำลังเปลี่ยน...' : 'เปลี่ยนรหัสผ่าน'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
