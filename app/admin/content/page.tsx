'use client';
import { useEffect } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { BookOpen, Wrench, Video, Plus } from 'lucide-react';

export default function ContentPage() {

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
  return (
    <ProtectedRoute requireActive={true} requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการเนื้อหา</h1>
            <p className="text-gray-600">
              เพิ่ม แก้ไข และจัดการ Learning Paths, AI Tools และ Videos
            </p>
          </div>

          {/* Info Box */}
          <div className="card mb-8 bg-blue-50 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">
                  วิธีแก้ไขเนื้อหาตอนนี้
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  ในเวอร์ชันปัจจุบัน คุณสามารถแก้ไขเนื้อหาได้โดยแก้ไขไฟล์โค้ดโดยตรง:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>
                    <strong>Mock Data:</strong>{' '}
                    <code className="bg-blue-100 px-2 py-0.5 rounded">
                      data/mockData.ts
                    </code>
                  </li>
                  <li>
                    <strong>Pricing:</strong>{' '}
                    <code className="bg-blue-100 px-2 py-0.5 rounded">
                      app/page.tsx
                    </code>{' '}
                    (Landing page)
                  </li>
                  <li>
                    <strong>Firestore:</strong> สร้าง collections{' '}
                    <code className="bg-blue-100 px-2 py-0.5 rounded">
                      learningPaths
                    </code>{' '}
                    และ{' '}
                    <code className="bg-blue-100 px-2 py-0.5 rounded">aiTools</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Learning Paths</h3>
              </div>
              <p className="text-gray-600 mb-4">
                แก้ไขเส้นทางการเรียนในไฟล์{' '}
                <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                  data/mockData.ts
                </code>
              </p>
              <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono text-gray-700">
                export const mockLearningPaths = [...]
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">AI Tools</h3>
              </div>
              <p className="text-gray-600 mb-4">
                แก้ไข AI Tools ในไฟล์{' '}
                <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                  data/mockData.ts
                </code>
              </p>
              <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono text-gray-700">
                export const mockAITools = [...]
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Video className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Videos</h3>
              </div>
              <p className="text-gray-600 mb-4">
                แก้ไข Google Drive ID ในแต่ละ AI Tool
              </p>
              <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono text-gray-700">
                driveId: &quot;YOUR_DRIVE_ID&quot;
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="card mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📚 คู่มือการแก้ไขเนื้อหา
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">1. แก้ไข Learning Paths</h3>
                <p className="text-gray-600 text-sm mb-2">
                  เปิดไฟล์{' '}
                  <code className="bg-gray-100 px-2 py-0.5 rounded">
                    data/mockData.ts
                  </code>{' '}
                  แล้วแก้ไข <code className="bg-gray-100 px-2 py-0.5 rounded">
                    mockLearningPaths
                  </code>
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`{
  id: "your-path-id",
  title: "🎬 ชื่อเส้นทางของคุณ",
  description: "คำอธิบาย",
  icon: "🎬",
  level: "เริ่มต้น",
  requiredPackage: "basic", // basic, allinone, pro
  totalDuration: "3 ชั่วโมง",
  totalVideos: 5,
  toolsUsed: ["ChatGPT", "Midjourney"],
  steps: [...]
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">2. แก้ไข AI Tools</h3>
                <p className="text-gray-600 text-sm mb-2">
                  แก้ไข{' '}
                  <code className="bg-gray-100 px-2 py-0.5 rounded">mockAITools</code> ในไฟล์เดียวกัน
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`{
  id: "your-tool-id",
  name: "ชื่อเครื่องมือ",
  folder: "Google Drive Folder Name",
  icon: "🤖",
  description: "คำอธิบาย",
  requiredPackage: "basic",
  videos: [
    {
      id: "video-1",
      title: "ชื่อวิดีโอ",
      driveId: "YOUR_GOOGLE_DRIVE_ID", // แก้ตรงนี้!
      duration: "15:30",
      order: 1
    }
  ]
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  3. แก้ไขราคาและแพ็คเกจ
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  เปิดไฟล์{' '}
                  <code className="bg-gray-100 px-2 py-0.5 rounded">app/page.tsx</code>{' '}
                  (Landing page)
                </p>
                <p className="text-sm text-gray-600">
                  หาส่วน Pricing Section แล้วแก้ไขราคาและรายละเอียดแพ็คเกจ
                </p>
              </div>
            </div>
          </div>

          {/* Future Feature */}
          <div className="card mt-6 bg-purple-50 border-2 border-purple-200">
            <div className="flex items-start gap-3">
              <Plus className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-purple-900 mb-2">
                  🚀 Coming Soon: CRUD Interface
                </h3>
                <p className="text-sm text-purple-700">
                  ในเวอร์ชันถัดไป จะมีหน้า Admin Panel ให้เพิ่ม/แก้ไข/ลบเนื้อหาผ่านหน้าเว็บได้เลย
                  ไม่ต้องแก้ไขโค้ด!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
