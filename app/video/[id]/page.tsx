'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { CheckCircle, ChevronRight, ChevronLeft, PlayCircle, ExternalLink, Link as LinkIcon, X } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  driveId: string;
  duration: string;
  order: number;
  description?: string;
  resources?: Array<{
    title: string;
    url: string;
  }>;
}

interface AITool {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  videos: Video[];
}

interface LearningPath {
  id: string;
  title: string;
  icon: string;
  imageUrl?: string;
  steps: Array<{
    order: number;
    toolId: string;
    videoId: string;
    title: string;
    description: string;
  }>;
}

// Helper function to detect and linkify URLs in text
function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-tiktok-cyan dark:text-tiktok-cyan hover:text-purple-700 dark:hover:text-tiktok-pink underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export default function VideoPlayerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, userData } = useAuth();

  // ✅ Decode URI เพื่อรองรับภาษาไทย
  const videoId = decodeURIComponent(params.id as string);
  const pathId = searchParams.get('path') ? decodeURIComponent(searchParams.get('path')!) : null;
  const stepNumber = searchParams.get('step');
  const toolId = searchParams.get('tool') ? decodeURIComponent(searchParams.get('tool')!) : null;

  const [video, setVideo] = useState<Video | null>(null);
  const [tool, setTool] = useState<AITool | null>(null);
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [marked, setMarked] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [videoId, toolId, pathId]);

  useEffect(() => {
    if (userData && video) {
      const contextId = pathId || toolId;
      if (contextId) {
        // ✅ แปลง dot (.) เป็น underscore (_) เพื่อป้องกัน Firebase nested structure
        const sanitizedContextId = contextId.replace(/\./g, '_');
        const watchedVideos = userData.progress?.[sanitizedContextId]?.watchedVideos || [];
        const isWatched = watchedVideos.includes(videoId);

        console.log('🔍 Checking if video is watched:', {
          videoId,
          contextId: contextId,
          sanitizedContextId: sanitizedContextId,
          watchedVideos,
          isWatched
        });

        setMarked(isWatched);
      }
    }
  }, [userData, videoId, pathId, toolId, video]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load from Learning Path
      if (pathId) {
        const pathRef = doc(db, 'learningPaths', pathId);
        const pathSnap = await getDoc(pathRef);

        if (pathSnap.exists()) {
          const pathData = { id: pathSnap.id, ...pathSnap.data() } as LearningPath;
          setPath(pathData);

          // Find the step that contains this video
          const step = pathData.steps.find(s => s.videoId === videoId);
          if (step) {
            // Load the tool to get video details
            const toolRef = doc(db, 'aiTools', step.toolId);
            const toolSnap = await getDoc(toolRef);

            if (toolSnap.exists()) {
              const toolData = { id: toolSnap.id, ...toolSnap.data() } as AITool;
              setTool(toolData);

              // Find video in tool
              const videoData = toolData.videos.find(v => v.id === videoId);
              if (videoData) {
                setVideo(videoData);
              }
            }
          }
        }
      }
      // Load from Tool
      else if (toolId) {
        const toolRef = doc(db, 'aiTools', toolId);
        const toolSnap = await getDoc(toolRef);

        if (toolSnap.exists()) {
          const toolData = { id: toolSnap.id, ...toolSnap.data() } as AITool;
          setTool(toolData);

          // Find video in tool
          const videoData = toolData.videos.find(v => v.id === videoId);
          if (videoData) {
            setVideo(videoData);
          }
        }
      }
    } catch (error) {
      console.error('Error loading video:', error);
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
              <p className="text-gray-600 dark:text-white">กำลังโหลดวิดีโอ...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!video || !tool) {
    return (
      <ProtectedRoute requireActive={true}>
        <div className="min-h-screen bg-gray-50 dark:bg-tiktok-dark">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">ไม่พบวิดีโอนี้</h1>
              <p className="text-gray-600 dark:text-white mb-4">กรุณาติดต่อ Admin</p>
              <Link href="/dashboard" className="text-purple-600 hover:underline">
                กลับไปหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Get playlist
  let playlist: any[] = [];
  let currentIndex = -1;

  if (path) {
    playlist = path.steps;
    currentIndex = playlist.findIndex((step) => step.videoId === videoId);
  } else if (tool) {
    playlist = tool.videos;
    currentIndex = playlist.findIndex((v) => v.id === videoId);
  }

  const nextVideo = playlist[currentIndex + 1];
  const prevVideo = playlist[currentIndex - 1];

  const handleMarkAsCompleted = async () => {
    if (!user || !userData || marking) return;

    setMarking(true);

    try {
      const contextId = pathId || toolId;
      if (!contextId) {
        console.error('❌ No contextId found');
        alert('ไม่พบข้อมูล context');
        setMarking(false);
        return;
      }

      // ✅ แปลง dot (.) เป็น underscore (_) เพื่อป้องกัน Firebase nested structure
      const sanitizedContextId = contextId.replace(/\./g, '_');

      console.log('🔄 Starting to mark video as completed:', {
        videoId,
        contextId: contextId,
        sanitizedContextId: sanitizedContextId,
        userId: user.uid
      });

      const userRef = doc(db, 'users', user.uid);

      // ดึงข้อมูล progress ปัจจุบัน
      const currentProgress = userData.progress?.[sanitizedContextId] || {
        lastWatchedVideo: '',
        watchedVideos: [],
      };

      console.log('📊 Current progress:', currentProgress);

      const watchedVideos = [...(currentProgress.watchedVideos || [])];

      // เช็คว่าเคยดูแล้วหรือยัง
      if (watchedVideos.includes(videoId)) {
        console.log('ℹ️ Video already watched');
        setMarked(true);
        setMarking(false);
        return;
      }

      // เพิ่ม videoId เข้า watchedVideos
      watchedVideos.push(videoId);

      console.log('📝 Preparing to update with:', {
        watchedVideos: watchedVideos
      });

      // บันทึกลง Firebase (ใช้ sanitizedContextId)
      // ⚠️ ไม่เก็บ completionPercent เพราะจะคำนวณ real-time จากจำนวนวิดีโอทั้งหมด
      const updateData = {
        [`progress.${sanitizedContextId}`]: {
          lastWatchedVideo: videoId,
          watchedVideos,
        },
      };

      console.log('💾 Saving to Firebase...', updateData);

      await updateDoc(userRef, updateData);

      console.log('✅ Firebase write successful! Waiting for sync...');

      // ✅ อัพเดท local state ทันที (Optimistic Update)
      setMarked(true);

      // แสดง success modal (ไม่มี auto close ให้ผู้ใช้กดปิดเอง)
      setShowSuccessModal(true);

    } catch (error) {
      console.error('❌ Error marking video as completed:', error);
      console.error('Error details:', {
        code: error.code,
        message: (error as Error).message,
        stack: error.stack
      });

      // แสดง error ที่ละเอียด
      if (error.code === 'permission-denied') {
        alert('⛔ ไม่มีสิทธิ์บันทึกข้อมูล กรุณาเช็ค Firestore Rules\n\nError: ' + (error as Error).message);
      } else {
        alert('❌ เกิดข้อผิดพลาด: ' + (error as Error).message);
      }

      // Reset marked state กรณี error
      setMarked(false);
    } finally {
      setMarking(false);
    }
  };

  const handleNextVideo = () => {
    if (!nextVideo) return;

    if (path) {
      router.push(`/video/${nextVideo.videoId}?path=${pathId}&step=${nextVideo.order}`);
    } else if (tool) {
      router.push(`/video/${nextVideo.id}?tool=${toolId}`);
    }
  };

  return (
    <ProtectedRoute requireActive={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-tiktok-dark">
        <Navbar />

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSuccessModal(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-tiktok-darkGray rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scaleIn">
              {/* Close Button - Top Right */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors group"
                aria-label="ปิด"
              >
                <X className="w-5 h-5 text-gray-400 dark:text-gray-300 group-hover:text-gray-600 dark:text-white" />
              </button>

              {/* Celebration Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse" />
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4">
                    <CheckCircle className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  🎉 ยินดีด้วย!
                </h2>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  คุณยกระดับความรู้ของคุณ
                </p>
                <p className="text-lg text-gray-600 dark:text-white">
                  ขึ้นไปอีกขั้นแล้ว! 🚀
                </p>
                <div className="pt-4 text-sm text-gray-500 dark:text-gray-200">
                  บันทึกความคืบหน้าเรียบร้อยแล้ว ✓
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                เยี่ยมเลย! เรียนต่อกันเลย 💪
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - 70% */}
            <div className="lg:col-span-2 space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white">
                <Link href="/dashboard" className="hover:text-purple-600 dark:text-tiktok-cyan dark:hover:text-tiktok-cyan">
                  หน้าหลัก
                </Link>
                <ChevronRight className="w-4 h-4" />
                {path && (
                  <>
                    <Link href={`/learning-path/${pathId}`} className="hover:text-purple-600 dark:text-tiktok-cyan dark:hover:text-tiktok-cyan">
                      {path.title}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
                {tool && !path && (
                  <>
                    <Link href={`/tool/${toolId}`} className="hover:text-purple-600 dark:text-tiktok-cyan dark:hover:text-tiktok-cyan">
                      {tool.name}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
                <span className="text-gray-900 dark:text-white">{video.title}</span>
              </div>

              {/* Video Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{video.title}</h1>

              {/* Video Player */}
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
                <iframe
                  src={`https://drive.google.com/file/d/${video.driveId}/preview`}
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  className="w-full h-full"
                  title={video.title}
                />
              </div>

              {/* Video Description */}
              {video.description && (
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">รายละเอียด</h3>
                  <p className="text-gray-600 dark:text-white whitespace-pre-wrap">{linkify(video.description)}</p>
                </div>
              )}

              {/* Resources / Links */}
              {video.resources && video.resources.length > 0 && (
                <div className="card">
                  <div className="flex items-center gap-2 mb-4">
                    <LinkIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">ลิงก์ที่เกี่ยวข้อง</h3>
                  </div>
                  <div className="space-y-3">
                    {video.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-600 rounded-lg">
                            <ExternalLink className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:text-tiktok-cyan dark:hover:text-tiktok-cyan transition-colors">
                              {resource.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-200 break-all">{resource.url}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleMarkAsCompleted}
                  disabled={marking || marked}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    marked
                      ? 'bg-green-500 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  } disabled:opacity-50`}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{marked ? 'ดูแล้ว ✓' : marking ? 'กำลังบันทึก...' : 'ทำเครื่องหมายว่าดูแล้ว'}</span>
                </button>

                {prevVideo && (
                  <button
                    onClick={() => {
                      if (path) {
                        router.push(`/video/${prevVideo.videoId}?path=${pathId}&step=${prevVideo.order}`);
                      } else {
                        router.push(`/video/${prevVideo.id}?tool=${toolId}`);
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>คลิปก่อนหน้า</span>
                  </button>
                )}

                {nextVideo && (
                  <button
                    onClick={handleNextVideo}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-all"
                  >
                    <span>คลิปถัดไป</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar - 30% */}
            <div className="lg:col-span-1">
              <div className="card sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {path ? 'ขั้นตอนการเรียน' : 'รายการวิดีโอ'}
                </h3>

                <div className="space-y-2">
                  {playlist.map((item, index) => {
                    const itemVideoId = path ? item.videoId : item.id;
                    const itemTitle = path ? item.title : item.title;
                    const isCurrentVideo = itemVideoId === videoId;
                    const contextId = pathId || toolId;
                    // ✅ แปลง dot (.) เป็น underscore (_)
                    const sanitizedContextId = contextId ? contextId.replace(/\./g, '_') : '';
                    const isWatched = sanitizedContextId ? userData?.progress?.[sanitizedContextId]?.watchedVideos?.includes(
                      itemVideoId
                    ) : false;

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (path) {
                            router.push(`/video/${item.videoId}?path=${pathId}&step=${item.order}`);
                          } else {
                            router.push(`/video/${item.id}?tool=${toolId}`);
                          }
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          isCurrentVideo
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-50 dark:bg-tiktok-dark hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isWatched
                                ? 'bg-green-500 text-white'
                                : isCurrentVideo
                                ? 'bg-white text-purple-600'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {isWatched ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : isCurrentVideo ? (
                              <PlayCircle className="w-5 h-5" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium line-clamp-2 ${
                                isCurrentVideo ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {itemTitle}
                            </p>
                            {isCurrentVideo && (
                              <p className="text-xs text-purple-200 mt-1">▶ กำลังเล่น</p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
