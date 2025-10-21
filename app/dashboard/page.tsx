'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { LockOverlay } from '@/components/LockOverlay';
import { PackageBadge } from '@/components/PackageBadge';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAITools } from '@/lib/hooks/useAITools';
import { useLearningPaths } from '@/lib/hooks/useLearningPaths';
import { canAccessContent } from '@/lib/utils/accessControl';
import { Clock, Video, CheckCircle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<'paths' | 'tools'>('paths');
  const [photoError, setPhotoError] = useState(false);

  return (
    <ProtectedRoute requireActive={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  ยินดีต้อนรับ, {userData?.displayName}! 👋
                </h1>
                <p className="text-xl text-purple-100">
                  เลือกเส้นทางการเรียนที่เหมาะกับคุณ หรือเรียนรู้แต่ละ AI Tool แยกกัน
                </p>
              </div>
              {userData?.photoURL && !photoError ? (
                <img
                  src={userData.photoURL}
                  alt={userData.displayName}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-xl hidden md:block"
                  onError={() => {
                    console.warn('⚠️ Failed to load user photo in dashboard');
                    setPhotoError(true);
                  }}
                  referrerPolicy="no-referrer"
                />
              ) : userData && !userData.photoURL ? null : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl hidden md:flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white text-3xl font-bold">
                  {userData?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Package Info Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">แพ็คเกจปัจจุบัน</p>
                  <div className="flex items-center gap-2">
                    <PackageBadge packageId={userData?.package || null} size="lg" />
                    {userData?.packageExpiry && (
                      <span className="text-sm text-gray-500">
                        (หมดอายุ: {new Date(userData.packageExpiry).toLocaleDateString('th-TH')})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {userData?.progress ? Object.keys(userData.progress).length : 0}
                  </p>
                  <p className="text-sm text-gray-600">คอร์สที่เรียน</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {userData?.progress
                      ? Object.values(userData.progress).reduce((acc, p: any) => acc + (p.completed || 0), 0)
                      : 0}
                  </p>
                  <p className="text-sm text-gray-600">วิดีโอที่ดูแล้ว</p>
                </div>
              </div>

              {!userData?.package && (
                <Link
                  href="/profile"
                  className="btn-primary whitespace-nowrap"
                >
                  ติดต่อ Admin เพื่อเลือกแพ็คเกจ
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('paths')}
              className={`pb-4 px-6 font-semibold transition-all ${
                activeTab === 'paths'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              📚 เส้นทางการเรียน (Learning Path)
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`pb-4 px-6 font-semibold transition-all ${
                activeTab === 'tools'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              🛠️ เรียนแยกตาม AI Tool
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {activeTab === 'paths' ? (
            <LearningPathsTab userPackage={userData?.package || null} />
          ) : (
            <AIToolsTab userPackage={userData?.package || null} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Learning Paths Tab Component
function LearningPathsTab({ userPackage }: { userPackage: string | null }) {
  const { paths, loading } = useLearningPaths();
  const { userData } = useAuth();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="spinner h-12 w-12 mx-auto mb-4" />
        <p className="text-gray-600">กำลังโหลด...</p>
      </div>
    );
  }

  if (paths.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">ยังไม่มีเส้นทางการเรียน</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paths.map((path) => {
        const hasAccess = canAccessContent(userPackage, path.requiredPackage);
        // ✅ แปลง dot (.) เป็น underscore (_) เพื่อป้องกัน Firebase nested structure
        const sanitizedPathId = path.id.replace(/\./g, '_');
        const pathProgress = userData?.progress?.[sanitizedPathId];

        // ✅ คำนวณ progress real-time จากจำนวนวิดีโอที่ดูแล้ว / จำนวนวิดีโอทั้งหมด
        const watchedCount = pathProgress?.watchedVideos?.length || 0;
        const totalVideos = path.totalVideos || 0;
        const progress = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

        return (
          <div key={path.id} className="relative group">
            <Link
              href={hasAccess ? `/learning-path/${path.id}` : '#'}
              className={`card h-full block ${!hasAccess ? 'cursor-not-allowed' : ''}`}
            >
              {/* Icon/Image */}
              {path.imageUrl ? (
                <div className="w-full aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={path.imageUrl}
                    alt={path.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-5xl mb-4">{path.icon}</div>
              )}

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">{path.description}</p>

              {/* Level Badge */}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                  path.level === 'เริ่มต้น'
                    ? 'bg-green-100 text-green-700'
                    : path.level === 'กลาง'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {path.level}
              </span>

              {/* Info */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{path.totalDuration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  <span>{path.totalVideos} คลิป</span>
                </div>
              </div>

              {/* Tools Used */}
              <div className="flex flex-wrap gap-2 mb-3">
                {path.toolsUsed.slice(0, 3).map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full"
                  >
                    {tool}
                  </span>
                ))}
                {path.toolsUsed.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    +{path.toolsUsed.length - 3} เพิ่มเติม
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {hasAccess && (
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>ความคืบหน้า</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Lock Overlay */}
              {!hasAccess && <LockOverlay requiredPackage={path.requiredPackage} />}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

// AI Tools Tab Component
function AIToolsTab({ userPackage }: { userPackage: string | null }) {
  const { tools, loading } = useAITools();
  const { userData } = useAuth();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="spinner h-12 w-12 mx-auto mb-4" />
        <p className="text-gray-600">กำลังโหลด...</p>
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">ยังไม่มี AI Tools</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => {
        const hasAccess = canAccessContent(userPackage, tool.requiredPackage);
        // ✅ แปลง dot (.) เป็น underscore (_) เพื่อป้องกัน Firebase nested structure
        const sanitizedToolId = tool.id.replace(/\./g, '_');
        const toolProgress = userData?.progress?.[sanitizedToolId];

        // ✅ คำนวณ progress real-time จากจำนวนวิดีโอที่ดูแล้ว / จำนวนวิดีโอทั้งหมด
        const watchedCount = toolProgress?.watchedVideos?.length || 0;
        const totalVideos = tool.videos?.length || 0;
        const progress = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

        return (
          <div key={tool.id} className="relative group">
            <Link
              href={hasAccess ? `/tool/${tool.id}` : '#'}
              className={`card h-full block ${!hasAccess ? 'cursor-not-allowed' : ''}`}
            >
              {/* Icon/Image */}
              {tool.imageUrl ? (
                <div className="w-full aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={tool.imageUrl}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-5xl mb-4">{tool.icon}</div>
              )}

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">{tool.description}</p>

              {/* Video Count */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Video className="w-4 h-4" />
                <span>{tool.videos.length} วิดีโอ</span>
              </div>

              {/* Progress Bar */}
              {hasAccess && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>ความคืบหน้า</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Lock Overlay */}
              {!hasAccess && <LockOverlay requiredPackage={tool.requiredPackage} />}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
