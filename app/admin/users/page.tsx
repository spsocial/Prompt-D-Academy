'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { ProviderBadge } from '@/components/ProviderBadge';
import { PackageBadge } from '@/components/PackageBadge';
import { Search, Edit, Trash2, Users, CheckCircle, XCircle, Crown, Package } from 'lucide-react';
import { getPackageName } from '@/lib/utils/accessControl';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'email' | 'google';
  isActive: boolean;
  package: string | null;
  packageExpiry?: string;
  isAdmin?: boolean;
  createdAt: any;
  progress?: any;
}

export default function UsersPage() {
  const { userData } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterPackage, setFilterPackage] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPackage, setEditPackage] = useState<string>('basic');
  const [editActive, setEditActive] = useState(true);
  const [editAdmin, setEditAdmin] = useState(false);
  const [editExpiry, setEditExpiry] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterStatus, filterPackage]);

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      const usersData = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as User[];

      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus === 'active') {
      filtered = filtered.filter((user) => user.isActive);
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((user) => !user.isActive);
    }

    // Filter by package
    if (filterPackage !== 'all') {
      if (filterPackage === 'none') {
        filtered = filtered.filter((user) => !user.package);
      } else {
        filtered = filtered.filter((user) => user.package === filterPackage);
      }
    }

    setFilteredUsers(filtered);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditPackage(user.package || '');
    setEditActive(user.isActive);
    setEditAdmin(user.isAdmin || false);
    setEditExpiry(
      user.packageExpiry
        ? new Date(user.packageExpiry).toISOString().split('T')[0]
        : ''
    );
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, 'users', selectedUser.uid);
      await updateDoc(userRef, {
        package: editPackage || null,
        packageExpiry: editExpiry ? new Date(editExpiry).toISOString() : null,
        isActive: editActive,
        isAdmin: editAdmin,
      });

      alert(`✅ อัพเดต ${selectedUser.displayName} สำเร็จ!`);
      setShowEditModal(false);
      setSelectedUser(null);
      loadUsers(); // Reload
    } catch (error) {
      console.error('Error updating user:', error);
      alert('❌ เกิดข้อผิดพลาดในการอัพเดต');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (
      !confirm(
        `คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ "${userName}"?\n\nการลบจะไม่สามารถกู้คืนได้!`
      )
    )
      return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      alert('✅ ลบผู้ใช้เรียบร้อยแล้ว!');
      loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + (error as Error).message);
    }
  };

  const getProgressStats = (user: User): { courses: number; videos: number } => {
    if (!user.progress) return { courses: 0, videos: 0 };

    const courses = Object.keys(user.progress).length;
    const videos = Object.values(user.progress).reduce(
      (acc: number, p: any) => acc + (p.watchedVideos?.length || 0),
      0
    );

    return { courses, videos };
  };

  // Package statistics
  const getPackageStats = () => {
    const stats = {
      free: 0,
      basic: 0,
      allinone: 0,
      pro: 0,
      pro_standalone: 0,
      none: 0,
    };

    users.forEach((user) => {
      if (!user.package) {
        stats.none++;
      } else if (user.package in stats) {
        stats[user.package as keyof typeof stats]++;
      }
    });

    return stats;
  };

  const packageStats = getPackageStats();

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              👥 จัดการผู้ใช้
            </h1>
            <p className="text-gray-600">แก้ไขแพ็คเกจ สถานะ และข้อมูลผู้ใช้</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
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
                    {users.filter((u) => u.isActive).length}
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
                    {users.filter((u) => u.package).length}
                  </p>
                  <p className="text-sm text-gray-600">มีแพ็คเกจ</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => !u.isActive).length}
                  </p>
                  <p className="text-sm text-gray-600">ปิดการใช้งาน</p>
                </div>
              </div>
            </div>
          </div>

          {/* Package Statistics */}
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">สถิติแพ็กเกจ</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xl font-bold text-gray-900">{packageStats.none}</p>
                <p className="text-xs text-gray-600 mt-1">ไม่มีแพ็กเกจ</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xl font-bold text-blue-600">{packageStats.free}</p>
                <p className="text-xs text-gray-600 mt-1">Free</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xl font-bold text-green-600">{packageStats.basic}</p>
                <p className="text-xs text-gray-600 mt-1">Beginner</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-xl font-bold text-orange-600">{packageStats.allinone}</p>
                <p className="text-xs text-gray-600 mt-1">All-in-One</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xl font-bold text-purple-600">{packageStats.pro}</p>
                <p className="text-xs text-gray-600 mt-1">Pro Bundle</p>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-xl font-bold text-indigo-600">{packageStats.pro_standalone}</p>
                <p className="text-xs text-gray-600 mt-1">Pro Only</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ค้นหาด้วยชื่อหรืออีเมล..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              >
                <option value="all">สถานะ: ทั้งหมด</option>
                <option value="active">Active เท่านั้น</option>
                <option value="inactive">Inactive เท่านั้น</option>
              </select>

              {/* Package Filter */}
              <select
                value={filterPackage}
                onChange={(e) => setFilterPackage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              >
                <option value="all">แพ็กเกจ: ทั้งหมด</option>
                <option value="none">ไม่มีแพ็กเกจ ({packageStats.none})</option>
                <option value="free">Free ({packageStats.free})</option>
                <option value="basic">Beginner ({packageStats.basic})</option>
                <option value="allinone">All-in-One ({packageStats.allinone})</option>
                <option value="pro">Pro Bundle ({packageStats.pro})</option>
                <option value="pro_standalone">Pro Only ({packageStats.pro_standalone})</option>
              </select>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              แสดง {filteredUsers.length} จาก {users.length} ผู้ใช้
            </p>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">ผู้ใช้</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Provider</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Package</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">สถานะ</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">ความคืบหน้า</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const stats = getProgressStats(user);

                    return (
                      <tr key={user.uid} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="w-10 h-10 rounded-full border border-gray-200"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                                {user.displayName?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{user.displayName}</p>
                                {user.isAdmin && (
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                UID: {user.uid.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <ProviderBadge provider={user.provider} size="sm" />
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <PackageBadge packageId={user.package} size="sm" />
                            {user.packageExpiry && (
                              <p className="text-xs text-gray-500 mt-1">
                                หมดอายุ: {new Date(user.packageExpiry).toLocaleDateString('th-TH')}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              user.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {user.isActive ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <p className="text-gray-900 font-medium">{stats.courses} คอร์ส</p>
                          <p className="text-gray-500">{stats.videos} วิดีโอ</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="แก้ไข"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.uid, user.displayName)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="ลบ"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">ไม่พบผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">แก้ไขข้อมูลผู้ใช้</h2>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-bold text-gray-900">{selectedUser.displayName}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Package */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    แพ็คเกจ
                  </label>
                  <select
                    value={editPackage}
                    onChange={(e) => setEditPackage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">ไม่มีแพ็คเกจ</option>
                    <option value="free">Free (Freemium)</option>
                    <option value="basic">Beginner</option>
                    <option value="allinone">All-in-One</option>
                    <option value="pro">Pro Developer + All-in-One (Bundle)</option>
                    <option value="pro_standalone">Pro Developer (Standalone)</option>
                  </select>
                </div>

                {/* Package Expiry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    วันหมดอายุ (ถ้ามี)
                  </label>
                  <input
                    type="date"
                    value={editExpiry}
                    onChange={(e) => setEditExpiry(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Is Active */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="editActive"
                    checked={editActive}
                    onChange={(e) => setEditActive(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <label htmlFor="editActive" className="text-sm font-medium text-gray-700">
                    เปิดการใช้งาน (Active)
                  </label>
                </div>

                {/* Is Admin */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="editAdmin"
                    checked={editAdmin}
                    onChange={(e) => setEditAdmin(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <label htmlFor="editAdmin" className="text-sm font-medium text-gray-700">
                    Admin (สิทธิ์พิเศษ)
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back to Admin */}
        <div className="mt-8 text-center pb-8">
          <Link href="/admin" className="text-purple-600 hover:underline">
            ← กลับไปหน้า Admin
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
