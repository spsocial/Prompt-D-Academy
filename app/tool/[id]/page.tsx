'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { LockOverlay } from '@/components/LockOverlay';
import { useAuth } from '@/lib/hooks/useAuth';
import { canAccessContent } from '@/lib/utils/accessControl';
import { Video, PlayCircle, CheckCircle, ChevronRight, Clock } from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  folder: string;
  icon: string;
  imageUrl?: string;
  description: string;
  requiredPackage: 'basic' | 'allinone' | 'pro';
  videos: Array<{
    id: string;
    title: string;
    driveId: string;
    duration: string;
    order: number;
    description?: string;
  }>;
}

export default function AIToolDetailPage() {
  const params = useParams();
  const { userData } = useAuth();
  // ✅ Decode URI เพื่อรองรับภาษาไทย
  const toolId = decodeURIComponent(params.id as string);
  const [tool, setTool] = useState<AITool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTool();
  }, [toolId]);

  const loadTool = async () => {
    try {
      console.log('🔍 Loading AI Tool with ID:', toolId);
      console.log('📍 Document path:', `aiTools/${toolId}`);

      const toolRef = doc(db, 'aiTools', toolId);
      const toolSnap = await getDoc(toolRef);

      console.log('📊 Document exists?', toolSnap.exists());

      if (toolSnap.exists()) {
        const toolData = { id: toolSnap.id, ...toolSnap.data() } as AITool;
        console.log('✅ Tool loaded successfully:', {
          id: toolData.id,
          name: toolData.name,
          videosCount: toolData.videos?.length || 0
        });
        setTool(toolData);
      } else {
        console.error('❌ Tool document not found in Firestore!');
        console.error('💡 Make sure the document exists at: aiTools/' + toolId);
        setTool(null);
      }
    } catch (error) {
      console.error('❌ Error loading tool:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code
      });
      setTool(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireActive={true}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!tool) {
    return (
      <ProtectedRoute requireActive={true}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">ไม่พบเครื่องมือนี้</h1>
              <p className="text-gray-600 mb-4">กรุณาติดต่อ Admin เพื่อเพิ่มเครื่องมือนี้</p>
              <Link href="/dashboard" className="text-purple-600 hover:underline">
                กลับไปหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const hasAccess = canAccessContent(userData?.package || null, tool.requiredPackage);
  // ✅ แปลง dot (.) เป็น underscore (_) เพื่อป้องกัน Firebase nested structure
  const sanitizedToolId = toolId.replace(/\./g, '_');
  const progress = userData?.progress?.[sanitizedToolId];
  const watchedVideos = progress?.watchedVideos || [];

  // ✅ คำนวณ progress real-time จากจำนวนวิดีโอที่ดูแล้ว / จำนวนวิดีโอทั้งหมด
  const totalVideos = tool.videos.length;
  const completionPercent = totalVideos > 0 ? Math.round((watchedVideos.length / totalVideos) * 100) : 0;

  return (
    <ProtectedRoute requireActive={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/dashboard" className="hover:text-purple-600">
              หน้าหลัก
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/dashboard?tab=tools" className="hover:text-purple-600">
              AI Tools
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{tool.name}</span>
          </div>

          {/* Header */}
          <div className="card mb-8 relative">
            <div className="flex items-start gap-6">
              {tool.imageUrl ? (
                <div className="w-48 aspect-[4/3] flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={tool.imageUrl}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-7xl">{tool.icon}</div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{tool.name}</h1>
                <p className="text-gray-600 text-lg mb-6">{tool.description}</p>

                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <Video className="w-5 h-5" />
                  <span>{tool.videos.length} วิดีโอทั้งหมด</span>
                </div>

                {/* Progress */}
                {hasAccess && (
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span className="font-medium">ความคืบหน้าของคุณ</span>
                      <span className="font-bold">
                        {watchedVideos.length}/{tool.videos.length} วิดีโอ ({Math.round(completionPercent)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lock Overlay */}
            {!hasAccess && <LockOverlay requiredPackage={tool.requiredPackage} />}
          </div>

          {/* Videos List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">วิดีโอทั้งหมด</h2>

            {tool.videos.map((video, index) => {
              const isWatched = watchedVideos.includes(video.id);

              return (
                <Link
                  key={video.id}
                  href={hasAccess ? `/video/${video.id}?tool=${toolId}` : '#'}
                  className={`card flex items-center gap-4 hover:shadow-xl transition-all relative ${
                    !hasAccess ? 'cursor-not-allowed' : ''
                  }`}
                >
                  {/* Video Number/Status */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      isWatched
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-100 text-purple-600'
                    }`}
                  >
                    {isWatched ? <CheckCircle className="w-6 h-6" /> : video.order}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{video.title}</h3>
                      <span className="flex items-center gap-1 text-sm text-gray-500 ml-4">
                        <Clock className="w-4 h-4" />
                        {video.duration}
                      </span>
                    </div>
                    {video.description && (
                      <p className="text-gray-600 text-sm mb-2">{video.description}</p>
                    )}
                    {hasAccess && (
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-purple-600" />
                        <span className="text-purple-600 font-medium text-sm">
                          {isWatched ? 'ดูอีกครั้ง' : 'เริ่มดู'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Lock indicator for individual video */}
                  {!hasAccess && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-40 rounded-xl flex items-center justify-center">
                      <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                        <p className="text-sm text-gray-700">🔒 ล็อค</p>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Upgrade CTA */}
          {!hasAccess && (
            <div className="card mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold mb-4">ต้องการเรียน {tool.name}?</h3>
                <p className="text-purple-100 mb-6">
                  อัพเกรดแพ็คเกจเพื่อปลดล็อคเนื้อหาทั้งหมด
                </p>
                <a
                  href="mailto:support@promptdacademy.com"
                  className="btn-secondary inline-block"
                >
                  ติดต่อ Admin เพื่ออัพเกรด
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
