'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { ImageUpload } from '@/components/ImageUpload';
import { Plus, Edit, Trash2, X, Save, GripVertical } from 'lucide-react';

interface Step {
  order: number;
  toolId: string;
  videoId: string;
  title: string;
  description: string;
}

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
  steps: Step[];
}

export default function AdminPathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [formData, setFormData] = useState<LearningPath>({
    id: '',
    title: '',
    description: '',
    icon: '🎓',
    imageUrl: '',
    level: 'เริ่มต้น',
    requiredPackage: 'basic',
    totalDuration: '0 ชั่วโมง',
    totalVideos: 0,
    toolsUsed: [],
    steps: []
  });

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    try {
      const pathsRef = collection(db, 'learningPaths');
      const snapshot = await getDocs(pathsRef);
      const pathsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LearningPath[];
      setPaths(pathsData);
    } catch (error) {
      console.error('Error loading paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPath(null);
    setFormData({
      id: '',
      title: '',
      description: '',
      icon: '🎓',
      imageUrl: '',
      level: 'เริ่มต้น',
      requiredPackage: 'basic',
      totalDuration: '0 ชั่วโมง',
      totalVideos: 0,
      toolsUsed: [],
      steps: []
    });
    setShowModal(true);
  };

  const handleEdit = (path: LearningPath) => {
    setEditingPath(path);
    setFormData(path);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const pathId = editingPath ? editingPath.id : formData.title.toLowerCase().replace(/\s+/g, '-');
      const pathRef = doc(db, 'learningPaths', pathId);

      const pathData = {
        ...formData,
        id: pathId,
        totalVideos: formData.steps.length
      };

      await setDoc(pathRef, pathData);

      alert(editingPath ? 'แก้ไขสำเร็จ!' : 'เพิ่มสำเร็จ!');
      setShowModal(false);
      loadPaths();
    } catch (error) {
      console.error('Error saving path:', error);
      alert('เกิดข้อผิดพลาด!');
    }
  };

  const handleDelete = async (pathId: string) => {
    if (!confirm('ต้องการลบ Learning Path นี้หรือไม่?')) return;

    try {
      await deleteDoc(doc(db, 'learningPaths', pathId));
      alert('ลบสำเร็จ!');
      loadPaths();
    } catch (error) {
      console.error('Error deleting path:', error);
      alert('เกิดข้อผิดพลาด!');
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        {
          order: formData.steps.length + 1,
          toolId: '',
          videoId: '',
          title: '',
          description: ''
        }
      ]
    });
  };

  const updateStep = (index: number, field: keyof Step, value: string | number) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setFormData({ ...formData, steps: updatedSteps });
  };

  const removeStep = (index: number) => {
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    // Reorder remaining steps
    const reorderedSteps = updatedSteps.map((step, i) => ({ ...step, order: i + 1 }));
    setFormData({ ...formData, steps: reorderedSteps });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...formData.steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];

    // Reorder
    const reorderedSteps = newSteps.map((step, i) => ({ ...step, order: i + 1 }));
    setFormData({ ...formData, steps: reorderedSteps });
  };

  return (
    <ProtectedRoute requireActive={true} requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                จัดการ Learning Paths ({paths.length})
              </h1>
              <p className="text-gray-600">เพิ่ม แก้ไข ลบ เส้นทางการเรียน</p>
            </div>
            <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              เพิ่ม Learning Path
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          ) : paths.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">ยังไม่มี Learning Paths</p>
              <button onClick={handleAdd} className="btn-primary">
                เพิ่ม Learning Path แรก
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {paths.map((path) => (
                <div key={path.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {path.imageUrl ? (
                        <img
                          src={path.imageUrl}
                          alt={path.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-4xl">{path.icon}</div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900">{path.title}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                            {path.requiredPackage}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            {path.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{path.description}</p>

                  <div className="text-sm text-gray-500 mb-4">
                    ⏱️ {path.totalDuration}
                    <br />
                    📹 {path.totalVideos} ขั้นตอน
                    <br />
                    🛠️ {path.toolsUsed.join(', ')}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(path)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(path.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-6xl w-full p-6 my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPath ? 'แก้ไข Learning Path' : 'เพิ่ม Learning Path ใหม่'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อเส้นทางการเรียน *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field"
                      placeholder="เช่น 🎬 แนะนำการทำโฆษณา"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon (Emoji) - ใช้ถ้าไม่มีรูป
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="input-field"
                      placeholder="🎓"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <ImageUpload
                    currentImageUrl={formData.imageUrl}
                    onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                    folder="paths"
                    label="รูปภาพเส้นทางการเรียน (แนะนำ)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    คำอธิบาย *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="เรียนรู้วิธีสร้างโฆษณาแบบครบวงจร..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ระดับความยาก *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                      className="input-field"
                    >
                      <option value="เริ่มต้น">เริ่มต้น</option>
                      <option value="กลาง">กลาง</option>
                      <option value="สูง">สูง</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      แพ็คเกจที่ต้องการ *
                    </label>
                    <select
                      value={formData.requiredPackage}
                      onChange={(e) => setFormData({ ...formData, requiredPackage: e.target.value as any })}
                      className="input-field"
                    >
                      <option value="basic">โฆษณาโปร (Basic)</option>
                      <option value="allinone">All-in-One</option>
                      <option value="pro">Pro Developer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ระยะเวลารวม
                    </label>
                    <input
                      type="text"
                      value={formData.totalDuration}
                      onChange={(e) => setFormData({ ...formData, totalDuration: e.target.value })}
                      className="input-field"
                      placeholder="3 ชั่วโมง"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เครื่องมือที่ใช้ (คั่นด้วยเครื่องหมาย ,)
                  </label>
                  <input
                    type="text"
                    value={formData.toolsUsed.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      toolsUsed: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                    })}
                    className="input-field"
                    placeholder="Nano Banana, Midjourney, ChatGPT"
                  />
                </div>

                {/* Steps Section */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">ขั้นตอนการเรียน ({formData.steps.length})</h3>
                    <button onClick={addStep} className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      เพิ่มขั้นตอน
                    </button>
                  </div>

                  {formData.steps.map((step, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-700">ขั้นตอนที่ {index + 1}</span>
                          <button
                            onClick={() => moveStep(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveStep(index, 'down')}
                            disabled={index === formData.steps.length - 1}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>
                        <button
                          onClick={() => removeStep(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            ชื่อขั้นตอน *
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => updateStep(index, 'title', e.target.value)}
                            className="input-field text-sm"
                            placeholder="เช่น สร้างภาพด้วย Nano Banana"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Tool ID *
                          </label>
                          <input
                            type="text"
                            value={step.toolId}
                            onChange={(e) => updateStep(index, 'toolId', e.target.value)}
                            className="input-field text-sm"
                            placeholder="nano-banana"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Video ID *
                          </label>
                          <input
                            type="text"
                            value={step.videoId}
                            onChange={(e) => updateStep(index, 'videoId', e.target.value)}
                            className="input-field text-sm"
                            placeholder="video-1"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            คำอธิบาย
                          </label>
                          <textarea
                            value={step.description}
                            onChange={(e) => updateStep(index, 'description', e.target.value)}
                            className="input-field text-sm"
                            rows={2}
                            placeholder="คำอธิบายขั้นตอนนี้"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.steps.length === 0 && (
                    <p className="text-center text-gray-500 py-4">ยังไม่มีขั้นตอน คลิก "เพิ่มขั้นตอน" ด้านบน</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">
                  ยกเลิก
                </button>
                <button onClick={handleSave} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
