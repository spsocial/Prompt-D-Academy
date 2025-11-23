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
import { Clock, Video, PlayCircle, CheckCircle, ChevronRight } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
  level: 'เริ่มต้น' | 'กลาง' | 'สูง';
  requiredPackage: 'basic' | 'allinone' | 'pro';
  totalDuration: string;
  totalVideos: number;
  toolsUsed: string[];
  steps: Array<{
    order: number;
    toolId: string;
    videoId: string;
    title: string;
    description: string;
  }>;
}

export default function LearningPathDetailPage() {
  const params = useParams();
  const { userData } = useAuth();
  // ✅ Decode URI เพื่อรองรับภาษาไทย
  const pathId = decodeURIComponent(params.id as string);
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPath();
  }, [pathId]);

  const loadPath = async () => {
    try {
      const pathRef = doc(db, 'learningPaths', pathId);
      const pathSnap = await getDoc(pathRef);

      if (pathSnap.exists()) {
        setPath({ id: pathSnap.id, ...pathSnap.data() } as LearningPath);
      } else {
        setPath(null);
      }
    } catch (error) {
      console.error('Error loading path:', error);
      setPath(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireActive={true}>
        <div className="min-h-screen bg-gray-50 dark:bg-tiktok-dark">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-white">กำลังโหลด...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!path) {
    return (
      <ProtectedRoute requireActive={true}>
        <div className="min-h-screen bg-gray-50 dark:bg-tiktok-dark">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">ไม่พบเส้นทางการเรียนนี้</h1>
              <p className="text-gray-600 mb-4 dark:text-white">กรุณาติดต่อ Admin เพื่อเพิ่มเส้นทางการเรียนนี้</p>
              <Link href="/dashboard" className="text-purple-600 hover:underline">
                กลับไปหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const hasAccess = canAccessContent(userData?.package || null, path.requiredPackage);
  // ✅ แปลง dot (.) เป็น underscore (_) เพื่อป้องกัน Firebase nested structure
  const sanitizedPathId = pathId.replace(/\./g, '_');
  const progress = userData?.progress?.[sanitizedPathId];
  const completedSteps = progress?.watchedVideos?.length || 0;

  // ✅ คำนวณ progress real-time จากจำนวนวิดีโอที่ดูแล้ว / จำนวนวิดีโอทั้งหมด
  const totalVideos = path.totalVideos || path.steps.length;
  const completionPercent = totalVideos > 0 ? Math.round((completedSteps / totalVideos) * 100) : 0;

  return (
    <ProtectedRoute requireActive={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-tiktok-dark">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 dark:text-white">
            <Link href="/dashboard" className="hover:text-purple-600">
              หน้าหลัก
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/dashboard?tab=paths" className="hover:text-purple-600">
              เส้นทางการเรียน
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white">{path.title}</span>
          </div>

          {/* Header */}
          <div className="card mb-8 relative">
            <div className="flex items-start gap-6">
              {path.imageUrl ? (
                <div className="w-48 aspect-[4/3] flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={path.imageUrl}
                    alt={path.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-6xl">{path.icon}</div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3 dark:text-white">{path.title}</h1>
                <p className="text-gray-600 text-lg mb-4 dark:text-white">{path.description}</p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      path.level === 'เริ่มต้น'
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 dark:border dark:border-green-500'
                        : path.level === 'กลาง'
                        ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 dark:border dark:border-yellow-500'
                        : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 dark:border dark:border-red-500'
                    }`}
                  >
                    ระดับ: {path.level}
                  </span>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-tiktok-lightGray text-purple-700 dark:text-tiktok-cyan dark:border dark:border-tiktok-cyan">
                    <Clock className="w-4 h-4" />
                    {path.totalDuration}
                  </span>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-tiktok-lightGray text-blue-700 dark:text-tiktok-pink dark:border dark:border-tiktok-pink">
                    <Video className="w-4 h-4" />
                    {path.totalVideos} คลิป
                  </span>
                </div>

                {/* AI Tools Used */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2 dark:text-white">เครื่องมือที่จะได้เรียน:</p>
                  <div className="flex flex-wrap gap-2">
                    {path.toolsUsed.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-50 dark:bg-tiktok-lightGray text-purple-600 dark:text-tiktok-cyan rounded-full text-sm font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                {hasAccess && progress && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2 dark:text-white">
                      <span>ความคืบหน้า</span>
                      <span>
                        {completedSteps}/{path.totalVideos} คลิป ({completionPercent}%)
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
            {!hasAccess && <LockOverlay requiredPackage={path.requiredPackage} />}
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">ขั้นตอนการเรียน</h2>

            {path.steps.map((step, index) => {
              const isCompleted = progress?.watchedVideos?.includes(step.videoId);
              const isCurrent = progress?.lastWatchedVideo === step.videoId;

              return (
                <Link
                  key={index}
                  href={
                    hasAccess
                      ? `/video/${step.videoId}?path=${pathId}&step=${step.order}`
                      : '#'
                  }
                  className={`card flex items-start gap-4 hover:shadow-xl transition-all relative ${
                    !hasAccess ? 'cursor-not-allowed' : ''
                  } ${isCurrent ? 'border-purple-500 border-2' : ''}`}
                >
                  {/* Step Number */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      isCompleted
                        ? 'bg-green-500 dark:bg-tiktok-cyan text-white'
                        : isCurrent
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : step.order}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{step.title}</h3>
                      {isCurrent && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full ml-2">
                          กำลังเรียน
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 dark:text-white">{step.description}</p>

                    {hasAccess && (
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-purple-600" />
                        <span className="text-purple-600 font-medium">
                          {isCompleted ? 'ดูอีกครั้ง' : 'เริ่มเรียน'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Lock Overlay for individual step */}
                  {!hasAccess && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-40 rounded-xl flex items-center justify-center">
                      <div className="bg-white px-4 py-2 rounded-lg shadow-lg dark:bg-tiktok-darkGray">
                        <p className="text-sm text-gray-700 dark:text-white">🔒 ล็อค</p>
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
                <h3 className="text-2xl font-bold mb-4">ต้องการเรียนเส้นทางนี้?</h3>
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
