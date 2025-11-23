'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { ProviderBadge } from '@/components/ProviderBadge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface PendingUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'email' | 'google';
  createdAt: any;
  isActive: boolean;
}

export default function ApprovalsPage() {

  // Force light mode for admin pages
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    return () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    };
  }, []);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('basic');

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('isActive', '==', false));
      const snapshot = await getDocs(q);

      const users = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as PendingUser[];

      setPendingUsers(users);
    } catch (error) {
      console.error('Error loading pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (user: PendingUser) => {
    setSelectedUser(user);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, 'users', selectedUser.uid);
      await updateDoc(userRef, {
        isActive: true,
        package: selectedPackage,
        approvedAt: new Date(),
      });

      alert(`อนุมัติ ${selectedUser.displayName} สำเร็จ! (Package: ${selectedPackage})`);
      setShowApproveModal(false);
      setSelectedUser(null);
      loadPendingUsers(); // Reload
    } catch (error) {
      console.error('Error approving user:', error);
      alert('เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  const handleReject = async (user: PendingUser) => {
    if (!confirm(`คุณต้องการปฏิเสธ ${user.displayName} หรือไม่?`)) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        isActive: false,
        rejectedAt: new Date(),
      });

      alert(`ปฏิเสธ ${user.displayName} เรียบร้อย`);
      loadPendingUsers(); // Reload
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('เกิดข้อผิดพลาดในการปฏิเสธ');
    }
  };

  return (
    <ProtectedRoute requireActive={true} requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              อนุมัติผู้ใช้ ({pendingUsers.length})
            </h1>
            <p className="text-gray-600">จัดการคำขออนุมัติจากผู้ใช้ที่สมัครด้วย Google Sign-In</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="card text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ไม่มีผู้ใช้รอการอนุมัติ
              </h3>
              <p className="text-gray-600">ผู้ใช้ทั้งหมดได้รับการอนุมัติแล้ว</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.uid} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-12 h-12 rounded-full border-2 border-purple-500"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                          {user.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}

                      <div>
                        <h3 className="font-bold text-gray-900">{user.displayName}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <ProviderBadge provider={user.provider} size="sm" />
                          <span className="text-xs text-gray-500">
                            {user.createdAt?.toDate().toLocaleDateString('th-TH')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(user)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>อนุมัติ</span>
                      </button>

                      <button
                        onClick={() => handleReject(user)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>ปฏิเสธ</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approve Modal */}
        {showApproveModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                อนุมัติผู้ใช้
              </h2>

              <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                <p className="font-bold text-gray-900">{selectedUser.displayName}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลือกแพ็คเกจ
                </label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                >
                  <option value="basic">โฆษณาโปร (299 THB)</option>
                  <option value="allinone">All-in-One (499 THB)</option>
                  <option value="pro">Pro Developer (999 THB)</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 btn-secondary"
                >
                  ยกเลิก
                </button>
                <button onClick={confirmApprove} className="flex-1 btn-primary">
                  ยืนยันอนุมัติ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
