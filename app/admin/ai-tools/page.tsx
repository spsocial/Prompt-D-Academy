'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { Plus, Edit, Trash2, Wrench, Video } from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  requiredPackage: string;
  videos: any[];
  order?: number;
}

export default function AdminAIToolsPage() {
  const { userData } = useAuth();
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const toolsCol = collection(db, 'aiTools');
      const toolsSnapshot = await getDocs(toolsCol);
      const toolsList = toolsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AITool));

      // Sort by order field (lower numbers first), then by name
      const sortedTools = toolsList.sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;

        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.name.localeCompare(b.name);
      });

      console.log('✅ Loaded tools:', sortedTools);
      setTools(sortedTools);
    } catch (error) {
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toolId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบ AI Tool นี้?\n\nการลบจะส่งผลกระทบต่อ Learning Paths ที่ใช้ Tool นี้!')) return;

    try {
      await deleteDoc(doc(db, 'aiTools', toolId));
      alert('✅ ลบ AI Tool เรียบร้อยแล้ว!');
      loadTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + (error as Error).message);
    }
  };

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🛠️ จัดการ AI Tools
              </h1>
              <p className="text-gray-600">
                เพิ่ม แก้ไข หรือลบ AI Tools และวิดีโอ
              </p>
            </div>
            <Link
              href="/admin/ai-tools/create"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              เพิ่ม AI Tool
            </Link>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          ) : tools.length === 0 ? (
            <div className="text-center py-12 card">
              <Wrench className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ยังไม่มี AI Tool
              </h3>
              <p className="text-gray-600 mb-6">
                เริ่มสร้าง AI Tool แรกของคุณ
              </p>
              <Link
                href="/admin/ai-tools/create"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                สร้าง AI Tool
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {tools.map((tool, index) => (
                <div key={tool.id} className="card hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Order Badge */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {tool.order ?? 999}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {tool.name}
                          </h3>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {tool.requiredPackage}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{tool.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            {tool.videos?.length || 0} วิดีโอ
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/admin/ai-tools/edit/${tool.id}`}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="แก้ไข"
                      >
                        <Edit className="w-5 h-5 text-blue-600" />
                      </Link>
                      <button
                        onClick={() => handleDelete(tool.id)}
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
