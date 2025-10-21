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
import { Sparkles, Video, Clock, Play, Lock } from 'lucide-react';

interface VideoWithSource {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  thumbnail?: string;
  sourceType: 'tool' | 'path';
  sourceName: string;
  sourceId: string;
  requiredPackage: string;
  createdAt?: any; // Firestore timestamp
}

export default function WhatsNewPage() {
  const { userData } = useAuth();
  const [videos, setVideos] = useState<VideoWithSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllVideos();
  }, []);

  const loadAllVideos = async () => {
    try {
      const allVideos: VideoWithSource[] = [];

      // Load from AI Tools
      const toolsCol = collection(db, 'aiTools');
      const toolsSnapshot = await getDocs(toolsCol);

      toolsSnapshot.docs.forEach((doc) => {
        const tool = doc.data();
        const toolVideos = tool.videos || [];

        toolVideos.forEach((video: any) => {
          allVideos.push({
            id: video.id,
            title: video.title,
            duration: video.duration,
            videoUrl: video.videoUrl,
            thumbnail: video.thumbnail,
            sourceType: 'tool',
            sourceName: tool.name,
            sourceId: doc.id,
            requiredPackage: tool.requiredPackage,
            createdAt: video.createdAt || null,
          });
        });
      });

      // Load from Learning Paths
      const pathsCol = collection(db, 'learningPaths');
      const pathsSnapshot = await getDocs(pathsCol);

      pathsSnapshot.docs.forEach((doc) => {
        const path = doc.data();
        const sections = path.sections || [];

        sections.forEach((section: any) => {
          const sectionVideos = section.videos || [];
          sectionVideos.forEach((video: any) => {
            allVideos.push({
              id: video.id,
              title: video.title,
              duration: video.duration,
              videoUrl: video.videoUrl,
              thumbnail: video.thumbnail,
              sourceType: 'path',
              sourceName: path.title,
              sourceId: doc.id,
              requiredPackage: path.requiredPackage,
              createdAt: video.createdAt || null,
            });
          });
        });
      });

      // Sort by createdAt (newest first), or by title if no createdAt
      allVideos.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        if (a.createdAt) return -1;
        if (b.createdAt) return 1;
        return a.title.localeCompare(b.title);
      });

      console.log('✅ Loaded all videos:', allVideos.length);
      setVideos(allVideos.slice(0, 50)); // Show latest 50 videos
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const isVideoWatched = (videoId: string, sourceId: string) => {
    if (!userData?.progress) return false;
    const sanitizedId = sourceId.replace(/\./g, '_');
    const sourceProgress = userData.progress[sanitizedId];
    return sourceProgress?.watchedVideos?.includes(videoId) || false;
  };

  const isNew = (video: VideoWithSource) => {
    if (!video.createdAt) return false;
    const now = new Date();
    const videoDate = video.createdAt.toDate();
    const daysDiff = (now.getTime() - videoDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 14; // New if added within 14 days
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600">กำลังโหลดเนื้อหาใหม่...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 card">
              <Sparkles className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">ยังไม่มีเนื้อหาใหม่</h3>
              <p className="text-gray-600">กลับมาดูใหม่ในภายหลัง!</p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="mb-8 flex items-center gap-4">
                <div className="card inline-flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{videos.length} วิดีโอ</span>
                </div>
                {videos.filter(v => isNew(v)).length > 0 && (
                  <div className="card inline-flex items-center gap-2 border-green-200 bg-green-50">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-700">
                      {videos.filter(v => isNew(v)).length} วิดีโอใหม่ (14 วันล่าสุด)
                    </span>
                  </div>
                )}
              </div>

              {/* Videos Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => {
                  const hasAccess = canAccessContent(userData?.package || null, video.requiredPackage);
                  const watched = isVideoWatched(video.id, video.sourceId);
                  const isNewVideo = isNew(video);

                  return (
                    <div key={`${video.sourceId}-${video.id}`} className="relative group">
                      <Link
                        href={
                          hasAccess
                            ? `/video/${video.id}?source=${video.sourceType}&id=${video.sourceId}`
                            : '#'
                        }
                        className={`card h-full block hover:shadow-xl transition-all ${
                          !hasAccess ? 'cursor-not-allowed opacity-75' : ''
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gray-100">
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                              <Play className="w-16 h-16 text-white opacity-50" />
                            </div>
                          )}

                          {/* Badges */}
                          <div className="absolute top-2 left-2 flex gap-2">
                            {isNewVideo && (
                              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                NEW
                              </span>
                            )}
                            {watched && (
                              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                ดูแล้ว
                              </span>
                            )}
                          </div>

                          {/* Duration */}
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>

                          {!hasAccess && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <Lock className="w-8 h-8 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>

                        {/* Source */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {video.sourceType === 'tool' ? '🛠️ Tool' : '📚 Path'}
                          </span>
                          <span className="line-clamp-1">{video.sourceName}</span>
                        </div>
                      </Link>
                    </div>
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
