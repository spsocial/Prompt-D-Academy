'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { ImageUpload } from '@/components/ImageUpload';
import { Plus, Trash2, Save, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  driveId: string;
  duration: string;
  order: number;
  description: string;
}

export default function EditAIToolPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { userData } = useAuth();
  const toolId = decodeURIComponent(params.id);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [folder, setFolder] = useState('');
  const [icon, setIcon] = useState('🤖');
  const [imageUrl, setImageUrl] = useState('');
  const [requiredPackage, setRequiredPackage] = useState<'free' | 'basic' | 'allinone' | 'pro'>('free');
  const [order, setOrder] = useState(0);

  // Videos
  const [videos, setVideos] = useState<Video[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToolData();
  }, [toolId]);

  const loadToolData = async () => {
    try {
      const toolRef = doc(db, 'aiTools', toolId);
      const toolSnap = await getDoc(toolRef);

      if (!toolSnap.exists()) {
        alert('❌ ไม่พบ AI Tool นี้');
        router.push('/admin/ai-tools');
        return;
      }

      const data = toolSnap.data();
      console.log('📖 Loaded tool data:', data);

      setName(data.name || '');
      setDescription(data.description || '');
      setFolder(data.folder || '');
      setIcon(data.icon || '🤖');
      setImageUrl(data.imageUrl || '');
      setRequiredPackage(data.requiredPackage || 'basic');
      setOrder(data.order || 0);
      setVideos(data.videos || []);
    } catch (error) {
      console.error('❌ Error loading tool:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const addVideo = () => {
    const newVideo: Video = {
      id: `video-${Date.now()}`,
      title: '',
      driveId: '',
      duration: '',
      order: videos.length + 1,
      description: ''
    };
    setVideos([...videos, newVideo]);
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    newVideos.forEach((video, i) => {
      video.order = i + 1;
    });
    setVideos(newVideos);
  };

  const updateVideo = (index: number, field: keyof Video, value: any) => {
    const newVideos = [...videos];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setVideos(newVideos);
  };

  const moveVideo = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === videos.length - 1) return;

    const newVideos = [...videos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    [newVideos[index], newVideos[targetIndex]] = [newVideos[targetIndex], newVideos[index]];

    newVideos.forEach((video, i) => {
      video.order = i + 1;
    });

    setVideos(newVideos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description) {
      alert('❌ กรุณากรอกชื่อและคำอธิบาย');
      return;
    }

    // Validate videos
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      if (!video.title || !video.driveId || !video.duration) {
        alert(`❌ วิดีโอที่ ${i + 1} ยังกรอกไม่ครบ`);
        return;
      }
    }

    setSaving(true);

    try {
      const toolData = {
        name,
        description,
        folder: folder || name.toLowerCase().replace(/\s+/g, '-'),
        icon,
        imageUrl: imageUrl || null,
        requiredPackage,
        order: order || 0,
        videos: videos.map(v => ({
          id: v.id,
          title: v.title,
          driveId: v.driveId,
          duration: v.duration,
          order: v.order,
          description: v.description || ''
        }))
      };

      console.log('💾 Updating AI Tool:', toolData);

      const toolRef = doc(db, 'aiTools', toolId);
      await updateDoc(toolRef, toolData);

      alert('✅ อัปเดต AI Tool เรียบร้อยแล้ว!');
      router.push('/admin/ai-tools');
    } catch (error: any) {
      console.error('❌ Error updating:', error);
      alert('เกิดข้อผิดพลาด: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (!userData?.isAdmin) {
    return (
      <ProtectedRoute requireActive={true}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">⛔ ไม่มีสิทธิ์เข้าถึง</h1>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute requireActive={true}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="text-center py-12">
            <div className="spinner h-12 w-12 mx-auto mb-4" />
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireActive={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            href="/admin/ai-tools"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            กลับไปหน้า AI Tools
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ✏️ แก้ไข AI Tool: {name}
            </h1>
            <p className="text-gray-600">
              อัปเดตข้อมูล AI Tool และวิดีโอ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Card */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📝 ข้อมูลพื้นฐาน
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ AI Tool *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="เช่น ChatGPT"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="🤖"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    คำอธิบาย *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="อธิบาย AI Tool นี้..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="ถ้าไม่กรอก จะใช้ชื่อ Tool"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    * จะใช้เป็นชื่อโฟลเดอร์เก็บข้อมูล
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package ที่ต้องการ *
                  </label>
                  <select
                    value={requiredPackage}
                    onChange={(e) => setRequiredPackage(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="free">Free (ดูได้ฟรี)</option>
                    <option value="basic">Basic</option>
                    <option value="allinone">All-in-One</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ลำดับการแสดงผล
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    * เลขน้อยจะแสดงก่อน (0 = แสดงแรกสุด)
                  </p>
                </div>

                <div className="md:col-span-2">
                  <ImageUpload
                    currentImageUrl={imageUrl}
                    onImageUploaded={(url) => setImageUrl(url)}
                    folder="tools"
                    label="รูปภาพ AI Tool (แนะนำ 1200×900 px)"
                  />
                </div>
              </div>
            </div>

            {/* Videos Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  📹 วิดีโอ ({videos.length} คลิป)
                </h2>
                <button
                  type="button"
                  onClick={addVideo}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  เพิ่มวิดีโอ
                </button>
              </div>

              {videos.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">ยังไม่มีวิดีโอ</p>
                  <button
                    type="button"
                    onClick={addVideo}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    เพิ่มวิดีโอแรก
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((video, index) => (
                    <div key={video.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-gray-900">
                          วิดีโอที่ {video.order}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveVideo(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveVideo(index, 'down')}
                            disabled={index === videos.length - 1}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ชื่อวิดีโอ *
                          </label>
                          <input
                            type="text"
                            value={video.title}
                            onChange={(e) => updateVideo(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="เช่น รู้จัก ChatGPT"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Google Drive ID *
                          </label>
                          <input
                            type="text"
                            value={video.driveId}
                            onChange={(e) => updateVideo(index, 'driveId', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="1ABC...xyz"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            * เอาจาก URL: drive.google.com/file/d/<strong>ID</strong>/view
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ระยะเวลา *
                          </label>
                          <input
                            type="text"
                            value={video.duration}
                            onChange={(e) => updateVideo(index, 'duration', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="เช่น 10:30"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            คำอธิบาย
                          </label>
                          <textarea
                            value={video.description}
                            onChange={(e) => updateVideo(index, 'description', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            rows={2}
                            placeholder="อธิบายวิดีโอนี้..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Link
                href="/admin/ai-tools"
                className="text-gray-600 hover:text-gray-900"
              >
                ← ยกเลิก
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
