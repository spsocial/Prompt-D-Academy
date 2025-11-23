'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { LockOverlay } from '@/components/LockOverlay';
import { PackageBadge } from '@/components/PackageBadge';
import { FloatingContactButton } from '@/components/FloatingContactButton';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAITools } from '@/lib/hooks/useAITools';
import { useLearningPaths } from '@/lib/hooks/useLearningPaths';
import { canAccessContent } from '@/lib/utils/accessControl';
import { Clock, Video, TrendingUp, LayoutGrid, List, Target, Award } from 'lucide-react';

export default function DashboardPage() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<'paths' | 'tools'>('paths');
  const [photoError, setPhotoError] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { tools } = useAITools();

  // Calculate statistics
  const totalTools = tools.length;
  const totalVideos = tools.reduce((sum, tool) => sum + (tool.videos?.length || 0), 0);

  // Count tools with access
  const accessibleTools = tools.filter(tool => canAccessContent(userData?.package || null, tool.requiredPackage));
  const toolsStudied = accessibleTools.filter(tool => {
    const sanitizedToolId = tool.id.replace(/\./g, '_');
    return userData?.progress?.[sanitizedToolId]?.watchedVideos?.length > 0;
  }).length;

  // Count total watched videos
  const watchedVideos = userData?.progress
    ? Object.values(userData.progress).reduce((acc: number, p: any) => acc + (p.watchedVideos?.length || 0), 0)
    : 0;

  // Calculate success rate based on accessible videos
  const accessibleVideos = accessibleTools.reduce((sum, tool) => sum + (tool.videos?.length || 0), 0);
  const successRate = accessibleVideos > 0 ? Math.round((watchedVideos / accessibleVideos) * 100) : 0;

  return (
    <ProtectedRoute requireActive={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <FloatingContactButton />

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

        {/* Package Info Card with Integrated Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Package Info */}
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

              {/* Statistics - Compact */}
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                {/* Courses Progress */}
                <div
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 cursor-help transition-all hover:shadow-md"
                  title="จำนวนคอร์สที่คุณได้เริ่มเรียนแล้ว จากคอร์สทั้งหมดในระบบ"
                >
                  <img src="/images/lesson_11687399.png" alt="คอร์สที่เรียน" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <div className="flex items-baseline gap-0.5 sm:gap-1">
                    <span className="text-base sm:text-lg font-bold text-purple-600">{toolsStudied}</span>
                    <span className="text-[10px] sm:text-xs text-gray-600">/ {totalTools}</span>
                  </div>
                </div>

                {/* Videos Progress */}
                <div
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 cursor-help transition-all hover:shadow-md"
                  title="จำนวนวิดีโอที่คุณดูจบแล้ว จากวิดีโอทั้งหมดในระบบ"
                >
                  <img src="/images/video_17236469.png" alt="วิดีโอที่ดู" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <div className="flex items-baseline gap-0.5 sm:gap-1">
                    <span className="text-base sm:text-lg font-bold text-blue-600">{watchedVideos}</span>
                    <span className="text-[10px] sm:text-xs text-gray-600">/ {totalVideos}</span>
                  </div>
                </div>

                {/* Success Rate */}
                <div
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 cursor-help transition-all hover:shadow-md"
                  title="เปอร์เซ็นต์ความสำเร็จในการเรียนของคุณ คำนวณจากวิดีโอที่ดู / วิดีโอที่เข้าถึงได้ทั้งหมด"
                >
                  <img src="/images/achieving-goal_12056818.png" alt="อัตราความสำเร็จ" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <span className="text-base sm:text-lg font-bold text-green-600">{successRate}%</span>
                  </div>
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

        {/* Navigation Tabs & View Toggle - Combined */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 sm:border-2 sm:border-gray-100 p-2 sm:p-3">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Tab Buttons - Left Side */}
              <div className="flex gap-1.5 sm:gap-2 flex-1">
                <button
                  onClick={() => setActiveTab('paths')}
                  className={`flex-1 sm:flex-initial sm:px-5 px-2.5 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeTab === 'paths'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md sm:shadow-lg sm:shadow-purple-300/50 sm:scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 border border-gray-300'
                  }`}
                >
                  <img src="/images/school_16007916.png" alt="เส้นทางเรียน" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">เส้นทางเรียน</span>
                </button>
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`flex-1 sm:flex-initial sm:px-5 px-2.5 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeTab === 'tools'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md sm:shadow-lg sm:shadow-purple-300/50 sm:scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 border border-gray-300'
                  }`}
                >
                  <img src="/images/ai_tool.png" alt="AI Tools" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">AI Tools</span>
                </button>
              </div>

              {/* Divider - Hidden on mobile */}
              <div className="hidden sm:block w-px h-10 bg-gray-200"></div>

              {/* View Toggle Buttons - Right Side */}
              <div className="flex gap-1 sm:gap-1.5 bg-gray-50 rounded-lg sm:rounded-xl p-1 sm:p-1.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-white text-purple-600 shadow-sm sm:shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                  title="ตาราง"
                >
                  <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">ตาราง</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-white text-purple-600 shadow-sm sm:shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                  title="รายการ"
                >
                  <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">รายการ</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {activeTab === 'paths' ? (
            <LearningPathsTab userPackage={userData?.package || null} viewMode={viewMode} />
          ) : (
            <AIToolsTab userPackage={userData?.package || null} viewMode={viewMode} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Learning Paths Tab Component
function LearningPathsTab({ userPackage, viewMode }: { userPackage: string | null; viewMode: 'list' | 'grid' }) {
  const { paths, loading } = useLearningPaths();
  const { userData } = useAuth();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [filteredPaths, setFilteredPaths] = useState(paths);

  useEffect(() => {
    let filtered = [...paths];

    // Search filter from Navbar
    if (searchQuery) {
      filtered = filtered.filter(path =>
        path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPaths(filtered);
  }, [paths, searchQuery]);

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
    <>
      {/* Results count */}
      {searchQuery && (
        <div className="mb-4">
          {filteredPaths.length > 0 ? (
            <div className="text-sm text-gray-600 bg-white rounded-lg px-4 py-2 border border-gray-200 inline-block">
              แสดง <span className="font-bold text-purple-600">{filteredPaths.length}</span> จาก {paths.length} เส้นทางการเรียน
            </div>
          ) : (
            <div className="text-center py-12 card">
              <p className="text-gray-600">ไม่พบเส้นทางการเรียนที่ค้นหา "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* Paths Grid */}
      {filteredPaths.length > 0 && (
        <div className={`grid gap-6 ${
          viewMode === 'list'
            ? 'md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        }`}>
          {filteredPaths.map((path) => {
            const hasAccess = canAccessContent(userPackage, path.requiredPackage);
            const sanitizedPathId = path.id.replace(/\./g, '_');
            const pathProgress = userData?.progress?.[sanitizedPathId];

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
                    <div className={`w-full mb-3 overflow-hidden rounded-lg bg-gray-100 ${
                      viewMode === 'list' ? 'aspect-[4/3]' : 'aspect-square'
                    }`}>
                      <img
                        src={path.imageUrl}
                        alt={path.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={viewMode === 'list' ? 'text-5xl mb-4' : 'text-3xl mb-2'}>{path.icon}</div>
                  )}

                  {/* Title */}
                  <h3 className={`font-bold text-gray-900 mb-2 ${
                    viewMode === 'list' ? 'text-xl' : 'text-sm line-clamp-2'
                  }`}>{path.title}</h3>

                  {/* Description - Only show in list mode */}
                  {viewMode === 'list' && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{path.description}</p>
                  )}

                  {/* Level Badge */}
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-medium mb-3 ${
                      viewMode === 'list' ? 'text-xs' : 'text-[10px]'
                    } ${
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
                  <div className={`flex items-center text-gray-600 mb-3 ${
                    viewMode === 'list' ? 'gap-4 text-sm' : 'gap-2 text-[10px] flex-col items-start'
                  }`}>
                    <div className="flex items-center gap-1">
                      <Clock className={viewMode === 'list' ? 'w-4 h-4' : 'w-3 h-3'} />
                      <span>{path.totalDuration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className={viewMode === 'list' ? 'w-4 h-4' : 'w-3 h-3'} />
                      <span>{path.totalVideos} คลิป</span>
                    </div>
                  </div>

                  {/* Tools Used - Only show in list mode */}
                  {viewMode === 'list' && (
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
                  )}

                  {/* Progress Bar */}
                  {hasAccess && (
                    <div>
                      <div className={`flex justify-between text-gray-600 mb-1 ${
                        viewMode === 'list' ? 'text-xs' : 'text-[10px]'
                      }`}>
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
      )}
    </>
  );
}

// AI Tools Tab Component
function AIToolsTab({ userPackage, viewMode }: { userPackage: string | null; viewMode: 'list' | 'grid' }) {
  const { tools, loading } = useAITools();
  const { userData } = useAuth();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [filteredTools, setFilteredTools] = useState(tools);

  useEffect(() => {
    let filtered = [...tools];

    // Search filter from Navbar
    if (searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTools(filtered);
  }, [tools, searchQuery]);

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
    <>
      {/* Results count */}
      {searchQuery && (
        <div className="mb-4">
          {filteredTools.length > 0 ? (
            <div className="text-sm text-gray-600 bg-white rounded-lg px-4 py-2 border border-gray-200 inline-block">
              แสดง <span className="font-bold text-purple-600">{filteredTools.length}</span> จาก {tools.length} AI Tools
            </div>
          ) : (
            <div className="text-center py-12 card">
              <p className="text-gray-600">ไม่พบ AI Tool ที่ค้นหา "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* Tools Grid */}
      {filteredTools.length > 0 && (
        <div className={`grid gap-6 ${
          viewMode === 'list'
            ? 'md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        }`}>
          {filteredTools.map((tool) => {
            const hasAccess = canAccessContent(userPackage, tool.requiredPackage);
            const sanitizedToolId = tool.id.replace(/\./g, '_');
            const toolProgress = userData?.progress?.[sanitizedToolId];

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
                    <div className={`w-full mb-3 overflow-hidden rounded-lg bg-gray-100 ${
                      viewMode === 'list' ? 'aspect-[4/3]' : 'aspect-square'
                    }`}>
                      <img
                        src={tool.imageUrl}
                        alt={tool.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={viewMode === 'list' ? 'text-5xl mb-4' : 'text-3xl mb-2'}>{tool.icon}</div>
                  )}

                  {/* Title */}
                  <h3 className={`font-bold text-gray-900 mb-2 ${
                    viewMode === 'list' ? 'text-xl' : 'text-sm line-clamp-2'
                  }`}>{tool.name}</h3>

                  {/* Description - Only show in list mode */}
                  {viewMode === 'list' && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{tool.description}</p>
                  )}

                  {/* Video Count Badge */}
                  {totalVideos === 0 ? (
                    <div className="mb-3">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-yellow-50 border border-yellow-300 rounded-md ${
                        viewMode === 'grid' ? 'w-full justify-center' : ''
                      }`}>
                        <Video className={viewMode === 'list' ? 'w-4 h-4' : 'w-3 h-3'} />
                        <span className={`font-medium text-yellow-700 ${
                          viewMode === 'list' ? 'text-xs' : 'text-[10px]'
                        }`}>รออัพเดต</span>
                      </div>
                    </div>
                  ) : totalVideos <= 3 ? (
                    <div className={`flex items-center gap-1.5 mb-3 px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded-md ${
                      viewMode === 'grid' ? 'w-full justify-center' : ''
                    }`}>
                      <Video className={viewMode === 'list' ? 'w-4 h-4' : 'w-3 h-3'} />
                      <span className={`font-medium text-blue-700 ${
                        viewMode === 'list' ? 'text-xs' : 'text-[10px]'
                      }`}>{totalVideos} คลิป</span>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-1.5 mb-3 px-2.5 py-1.5 bg-green-50 border border-green-200 rounded-md ${
                      viewMode === 'grid' ? 'w-full justify-center' : ''
                    }`}>
                      <Video className={viewMode === 'list' ? 'w-4 h-4' : 'w-3 h-3'} />
                      <span className={`font-medium text-green-700 ${
                        viewMode === 'list' ? 'text-xs' : 'text-[10px]'
                      }`}>{totalVideos} คลิป</span>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {hasAccess && (
                    <div className="mb-3">
                      <div className={`flex justify-between text-gray-600 mb-1 ${
                        viewMode === 'list' ? 'text-xs' : 'text-[10px]'
                      }`}>
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
      )}
    </>
  );
}
