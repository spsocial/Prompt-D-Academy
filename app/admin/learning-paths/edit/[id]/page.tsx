'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { ImageUpload } from '@/components/ImageUpload';
import { Plus, Trash2, Save, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  videos: Array<{
    id: string;
    title: string;
    duration: string;
    order: number;
  }>;
}

interface Step {
  order: number;
  toolId: string;
  videoId: string;
  title: string;
  description: string;
}

export default function EditLearningPathPage() {
  const params = useParams();
  const router = useRouter();
  const { userData } = useAuth();
  const pathId = decodeURIComponent(params.id as string);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<'เริ่มต้น' | 'กลาง' | 'สูง'>('เริ่มต้น');
  const [requiredPackage, setRequiredPackage] = useState<'basic' | 'allinone' | 'pro'>('basic');
  const [icon, setIcon] = useState('🎓');
  const [imageUrl, setImageUrl] = useState('');
  const [totalDuration, setTotalDuration] = useState('');
  const [order, setOrder] = useState(0);

  // Tools and Steps
  const [availableTools, setAvailableTools] = useState<AITool[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [pathId]);

  const loadData = async () => {
    try {
      console.log('🔄 Loading Learning Path:', pathId);

      // Load AI Tools
      const toolsCol = collection(db, 'aiTools');
      const toolsSnapshot = await getDocs(toolsCol);
      const toolsList = toolsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        videos: doc.data().videos || []
      } as AITool));

      setAvailableTools(toolsList);

      // Load Learning Path
      const pathRef = doc(db, 'learningPaths', pathId);
      const pathSnap = await getDoc(pathRef);

      if (pathSnap.exists()) {
        const data = pathSnap.data();
        console.log('✅ Loaded path:', data);

        setTitle(data.title || '');
        setDescription(data.description || '');
        setLevel(data.level || 'เริ่มต้น');
        setRequiredPackage(data.requiredPackage || 'basic');
        setIcon(data.icon || '🎓');
        setImageUrl(data.imageUrl || '');
        setTotalDuration(data.totalDuration || '');
        setOrder(data.order || 0);
        setSteps(data.steps || []);
      } else {
        console.error('❌ Learning Path not found!');
        alert('ไม่พบ Learning Path นี้');
        router.push('/admin/learning-paths');
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      alert('เกิดข้อผิดพลาด: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addStep = () => {
    const newStep: Step = {
      order: steps.length + 1,
      toolId: '',
      videoId: '',
      title: '',
      description: ''
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    newSteps.forEach((step, i) => {
      step.order = i + 1;
    });
    setSteps(newSteps);
  };

  const updateStep = (index: number, field: keyof Step, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };

    if (field === 'toolId') {
      newSteps[index].videoId = '';
    }

    setSteps(newSteps);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];

    newSteps.forEach((step, i) => {
      step.order = i + 1;
    });

    setSteps(newSteps);
  };

  const getToolVideos = (toolId: string) => {
    const tool = availableTools.find(t => t.id === toolId);
    return tool?.videos || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      alert('❌ กรุณากรอกชื่อและคำอธิบาย');
      return;
    }

    if (steps.length === 0) {
      alert('❌ กรุณาเพิ่มอย่างน้อย 1 ขั้นตอน');
      return;
    }

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step.toolId || !step.videoId || !step.title) {
        alert(`❌ ขั้นตอนที่ ${i + 1} ยังกรอกไม่ครบ`);
        return;
      }
    }

    setSaving(true);

    try {
      const toolsUsed = [...new Set(steps.map(s => {
        const tool = availableTools.find(t => t.id === s.toolId);
        return tool?.name || s.toolId;
      }))];

      const learningPathData = {
        title,
        description,
        level,
        requiredPackage,
        icon,
        imageUrl: imageUrl || null,
        totalVideos: steps.length,
        totalDuration,
        toolsUsed,
        order: order || 0,
        steps: steps.map(s => ({
          order: s.order,
          toolId: s.toolId,
          videoId: s.videoId,
          title: s.title,
          description: s.description
        }))
      };

      console.log('💾 Updating Learning Path:', learningPathData);

      const pathRef = doc(db, 'learningPaths', pathId);
      await updateDoc(pathRef, learningPathData);

      alert('✅ อัพเดท Learning Path เรียบร้อยแล้ว!');
      router.push('/admin/learning-paths');
    } catch (error) {
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
            <p>กำลังโหลด...</p>
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
            href="/admin/learning-paths"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            กลับไปหน้า Learning Paths
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ✏️ แก้ไข Learning Path
            </h1>
            <p className="text-gray-600">
              แก้ไข: {title}
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
                    ชื่อ Learning Path *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ระดับ *
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="เริ่มต้น">เริ่มต้น</option>
                    <option value="กลาง">กลาง</option>
                    <option value="สูง">สูง</option>
                  </select>
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
                    <option value="basic">Basic</option>
                    <option value="allinone">All-in-One</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ระยะเวลารวม
                  </label>
                  <input
                    type="text"
                    value={totalDuration}
                    onChange={(e) => setTotalDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
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
                    folder="paths"
                    label="รูปภาพ Learning Path (แนะนำ 1200×900 px)"
                  />
                </div>
              </div>
            </div>

            {/* Steps Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  📚 ขั้นตอนการเรียน ({steps.length} ขั้นตอน)
                </h2>
                <button
                  type="button"
                  onClick={addStep}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  เพิ่มขั้นตอน
                </button>
              </div>

              {steps.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">ยังไม่มีขั้นตอน</p>
                  <button
                    type="button"
                    onClick={addStep}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    เพิ่มขั้นตอนแรก
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-gray-900">
                          ขั้นตอนที่ {step.order}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveStep(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveStep(index, 'down')}
                            disabled={index === steps.length - 1}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            เลือก AI Tool *
                          </label>
                          <select
                            value={step.toolId}
                            onChange={(e) => updateStep(index, 'toolId', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                          >
                            <option value="">-- เลือก Tool --</option>
                            {availableTools.map(tool => (
                              <option key={tool.id} value={tool.id}>
                                {tool.name} (ID: {tool.id})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            เลือกวิดีโอ *
                          </label>
                          <select
                            value={step.videoId}
                            onChange={(e) => updateStep(index, 'videoId', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            disabled={!step.toolId}
                            required
                          >
                            <option value="">-- เลือกวิดีโอ --</option>
                            {getToolVideos(step.toolId).map(video => (
                              <option key={video.id} value={video.id}>
                                {video.title} ({video.duration})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ชื่อขั้นตอน *
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => updateStep(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            คำอธิบาย
                          </label>
                          <textarea
                            value={step.description}
                            onChange={(e) => updateStep(index, 'description', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            rows={2}
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
                href="/admin/learning-paths"
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
