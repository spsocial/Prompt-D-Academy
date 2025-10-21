'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { FloatingContactButton } from '@/components/FloatingContactButton';
import { useAuth } from '@/lib/hooks/useAuth';
import { canAccessContent } from '@/lib/utils/accessControl';
import { Sparkles, Video, Clock, ArrowRight, Lock, Wrench, BookOpen } from 'lucide-react';

interface SourceUpdate {
  sourceType: 'tool' | 'path';
  sourceName: string;
  sourceId: string;
  requiredPackage: string;
  newVideosCount: number;
  latestDate: Date;
  icon?: string;
  imageUrl?: string;
}

export default function WhatsNewPage() {
  const { userData } = useAuth();
  const [updates, setUpdates] = useState<SourceUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSourceUpdates();
  }, []);

  const loadSourceUpdates = async () => {
    try {
      const sourceMap = new Map<string, SourceUpdate>();

      // Load from AI Tools
      const toolsCol = collection(db, 'aiTools');
      const toolsSnapshot = await getDocs(toolsCol);

      toolsSnapshot.docs.forEach((doc) => {
        const tool = doc.data();
        const toolVideos = tool.videos || [];

        // Count new videos (within 30 days)
        const newVideos = toolVideos.filter((v: any) => {
          if (!v.createdAt) return false;
          const videoDate = v.createdAt.toDate();
          const daysDiff = (new Date().getTime() - videoDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 30;
        });

        if (newVideos.length > 0) {
          // Find latest date
          const latestVideo = newVideos.reduce((latest: any, v: any) => {
            if (!latest.createdAt) return v;
            if (!v.createdAt) return latest;
            return v.createdAt.seconds > latest.createdAt.seconds ? v : latest;
          });

          sourceMap.set(`tool-${doc.id}`, {
            sourceType: 'tool',
            sourceName: tool.name,
            sourceId: doc.id,
            requiredPackage: tool.requiredPackage,
            newVideosCount: newVideos.length,
            latestDate: latestVideo.createdAt.toDate(),
            icon: tool.icon,
            imageUrl: tool.imageUrl,
          });
        }
      });

      // Load from Learning Paths
      const pathsCol = collection(db, 'learningPaths');
      const pathsSnapshot = await getDocs(pathsCol);

      pathsSnapshot.docs.forEach((doc) => {
        const path = doc.data();
        const sections = path.sections || [];

        const allPathVideos: any[] = [];
        sections.forEach((section: any) => {
          const sectionVideos = section.videos || [];
          allPathVideos.push(...sectionVideos);
        });

        // Count new videos
        const newVideos = allPathVideos.filter((v: any) => {
          if (!v.createdAt) return false;
          const videoDate = v.createdAt.toDate();
          const daysDiff = (new Date().getTime() - videoDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 30;
        });

        if (newVideos.length > 0) {
          const latestVideo = newVideos.reduce((latest: any, v: any) => {
            if (!latest.createdAt) return v;
            if (!v.createdAt) return latest;
            return v.createdAt.seconds > latest.createdAt.seconds ? v : latest;
          });

          sourceMap.set(`path-${doc.id}`, {
            sourceType: 'path',
            sourceName: path.title,
            sourceId: doc.id,
            requiredPackage: path.requiredPackage,
            newVideosCount: newVideos.length,
            latestDate: latestVideo.createdAt.toDate(),
            icon: path.icon,
            imageUrl: path.imageUrl,
          });
        }
      });

      // Convert to array and sort by latest date
      const updatesArray = Array.from(sourceMap.values()).sort((a, b) => {
        return b.latestDate.getTime() - a.latestDate.getTime();
      });

      console.log('✅ Loaded source updates:', updatesArray.length);
      setUpdates(updatesArray);
    } catch (error) {
      console.error('Error loading updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} นาทีที่แล้ว`;
    } else if (diffHours < 24) {
      return `${diffHours} ชั่วโมงที่แล้ว`;
    } else if (diffDays < 7) {
      return `${diffDays} วันที่แล้ว`;
    } else {
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  return (
    <ProtectedRoute requireActive={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <FloatingContactButton />

        {/* Header */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-10 h-10" />
              <h1 className="text-4xl font-bold">มีอะไรใหม่</h1>
            </div>
            <p className="text-xl text-purple-100">
              เนื้อหาใหม่ล่าสุดที่คุณไม่ควรพลาด อัพเดทอยู่เสมอ!
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-12 card">
              <Sparkles className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">ยังไม่มีเนื้อหาใหม่</h3>
              <p className="text-gray-600">กลับมาดูใหม่ใน 30 วันข้างหน้า!</p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="mb-8">
                <div className="card inline-flex items-center gap-2 bg-purple-50 border-purple-200">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-700">
                    {updates.length} แหล่งเรียนมีเนื้อหาใหม่ใน 30 วันล่าสุด
                  </span>
                </div>
              </div>

              {/* Notification List */}
              <div className="space-y-4">
                {updates.map((update) => {
                  const hasAccess = canAccessContent(userData?.package || null, update.requiredPackage);
                  const linkUrl = update.sourceType === 'tool'
                    ? `/tool/${update.sourceId}`
                    : `/learning-path/${update.sourceId}`;

                  return (
                    <Link
                      key={`${update.sourceType}-${update.sourceId}`}
                      href={hasAccess ? linkUrl : '#'}
                      className={`card flex items-start gap-4 hover:shadow-xl hover:border-purple-500 transition-all ${
                        !hasAccess ? 'cursor-not-allowed opacity-75' : ''
                      }`}
                    >
                      {/* Icon/Image */}
                      <div className="flex-shrink-0">
                        {update.imageUrl ? (
                          <img
                            src={update.imageUrl}
                            alt={update.sourceName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-3xl">
                            {update.icon || (update.sourceType === 'tool' ? '🛠️' : '📚')}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <span className="line-clamp-1">{update.sourceName}</span>
                            {!hasAccess && <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                          </h3>
                        </div>

                        {/* New videos count */}
                        <div className="flex items-center gap-2 text-purple-600 font-medium mb-2">
                          <Sparkles className="w-4 h-4" />
                          <span>เพิ่มวิดีโอใหม่ {update.newVideosCount} คลิป</span>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            {update.sourceType === 'tool' ? (
                              <Wrench className="w-4 h-4" />
                            ) : (
                              <BookOpen className="w-4 h-4" />
                            )}
                            <span>{update.sourceType === 'tool' ? 'AI Tool' : 'Learning Path'}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(update.latestDate)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      {hasAccess && (
                        <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-purple-600 transition-colors" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
