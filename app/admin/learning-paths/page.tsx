'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { Plus, Edit, Trash2, Book } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: string;
  totalVideos: number;
  requiredPackage: string;
  order?: number;
}

export default function AdminLearningPathsPage() {
  const { userData } = useAuth();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    try {
      const pathsCol = collection(db, 'learningPaths');
      const pathsSnapshot = await getDocs(pathsCol);
      const pathsList = pathsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LearningPath));

      // Sort by order field (lower numbers first), then by title
      const sortedPaths = pathsList.sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;

        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.title.localeCompare(b.title);
      });

      setPaths(sortedPaths);
    } catch (error) {
      console.error('Error loading paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pathId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบ Learning Path นี้?')) return;

    try {
      await deleteDoc(doc(db, 'learningPaths', pathId));
      alert('✅ ลบ Learning Path เรียบร้อยแล้ว!');
      loadPaths();
    } catch (error) {
      console.error('Error deleting path:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + error.message);
    }
  };

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📚 จัดการ Learning Paths
              </h1>
              <p className="text-gray-600">
                เพิ่ม แก้ไข หรือลบเส้นทางการเรียน
              </p>
            </div>
            <Link
              href="/admin/learning-paths/create"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              เพิ่ม Learning Path
            </Link>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          ) : paths.length === 0 ? (
            <div className="text-center py-12 card">
              <Book className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ยังไม่มี Learning Path
              </h3>
              <p className="text-gray-600 mb-6">
                เริ่มสร้าง Learning Path แรกของคุณ
              </p>
              <Link
                href="/admin/learning-paths/create"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                สร้าง Learning Path
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {paths.map((path) => (
                <div key={path.id} className="card hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Order Badge */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {path.order ?? 999}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {path.title}
                          </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          path.level === 'เริ่มต้น'
                            ? 'bg-green-100 text-green-700'
                            : path.level === 'กลาง'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {path.level}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {path.requiredPackage}
                        </span>
                      </div>
                        <p className="text-gray-600 mb-3">{path.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📹 {path.totalVideos} คลิป</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/admin/learning-paths/edit/${path.id}`}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="แก้ไข"
                      >
                        <Edit className="w-5 h-5 text-blue-600" />
                      </Link>
                      <button
                        onClick={() => handleDelete(path.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
