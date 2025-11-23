'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { ImageUpload } from '@/components/ImageUpload';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  driveId: string;
  duration: string;
  order: number;
  description?: string;
}

interface AITool {
  id: string;
  name: string;
  folder: string;
  icon: string;
  imageUrl?: string;
  description: string;
  requiredPackage: 'basic' | 'allinone' | 'pro';
  videos: Video[];
}

export default function AdminToolsPage() {

  // Force light mode for admin pages
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    return () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    };
  }, []);
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [formData, setFormData] = useState<AITool>({
    id: '',
    name: '',
    folder: '',
    icon: '🤖',
    imageUrl: '',
    description: '',
    requiredPackage: 'basic',
    videos: []
  });

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const toolsRef = collection(db, 'aiTools');
      const snapshot = await getDocs(toolsRef);
      const toolsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AITool[];
      setTools(toolsData);
    } catch (error) {
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTool(null);
    setFormData({
      id: '',
      name: '',
      folder: '',
      icon: '🤖',
      imageUrl: '',
      description: '',
      requiredPackage: 'basic',
      videos: []
    });
    setShowModal(true);
  };

  const handleEdit = (tool: AITool) => {
    setEditingTool(tool);
    setFormData(tool);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const toolId = editingTool ? editingTool.id : formData.name.toLowerCase().replace(/\s+/g, '-');
      const toolRef = doc(db, 'aiTools', toolId);

      const toolData = {
        ...formData,
        id: toolId
      };

      await setDoc(toolRef, toolData);

      alert(editingTool ? 'แก้ไขสำเร็จ!' : 'เพิ่มสำเร็จ!');
      setShowModal(false);
      loadTools();
    } catch (error) {
      console.error('Error saving tool:', error);
      alert('เกิดข้อผิดพลาด!');
    }
  };

  const handleDelete = async (toolId: string) => {
    if (!confirm('ต้องการลบ AI Tool นี้หรือไม่?')) return;

    try {
      await deleteDoc(doc(db, 'aiTools', toolId));
      alert('ลบสำเร็จ!');
      loadTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      alert('เกิดข้อผิดพลาด!');
    }
  };

  const addVideo = () => {
    setFormData({
      ...formData,
      videos: [
        ...formData.videos,
        {
          id: `video-${Date.now()}`,
          title: '',
          driveId: '',
          duration: '0:00',
          order: formData.videos.length + 1,
          description: ''
        }
      ]
    });
  };

  const updateVideo = (index: number, field: keyof Video, value: string | number) => {
    const updatedVideos = [...formData.videos];
    updatedVideos[index] = { ...updatedVideos[index], [field]: value };
    setFormData({ ...formData, videos: updatedVideos });
  };

  const removeVideo = (index: number) => {
    const updatedVideos = formData.videos.filter((_, i) => i !== index);
    setFormData({ ...formData, videos: updatedVideos });
  };

  return (
    <ProtectedRoute requireActive={true} requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                จัดการ AI Tools ({tools.length})
              </h1>
              <p className="text-gray-600">เพิ่ม แก้ไข ลบ AI Tools และวิดีโอ</p>
            </div>
            <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              เพิ่ม AI Tool
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          ) : tools.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">ยังไม่มี AI Tools</p>
              <button onClick={handleAdd} className="btn-primary">
                เพิ่ม AI Tool แรก
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <div key={tool.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {tool.imageUrl ? (
                        <img
                          src={tool.imageUrl}
                          alt={tool.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-4xl">{tool.icon}</div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900">{tool.name}</h3>
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                          {tool.requiredPackage}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>

                  <div className="text-sm text-gray-500 mb-4">
                    📁 {tool.folder}
                    <br />
                    🎬 {tool.videos?.length || 0} วิดีโอ
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tool)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(tool.id)}
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
            <div className="bg-white rounded-xl max-w-4xl w-full p-6 my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTool ? 'แก้ไข AI Tool' : 'เพิ่ม AI Tool ใหม่'}
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
                      ชื่อเครื่องมือ *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="เช่น Nano Banana"
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
                      placeholder="🤖"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <ImageUpload
                    currentImageUrl={formData.imageUrl}
                    onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                    folder="tools"
                    label="รูปภาพเครื่องมือ (แนะนำ)"
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
                    placeholder="สร้างภาพนายแบบนางแบบ, แก้ไขภาพ"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Google Drive Folder
                    </label>
                    <input
                      type="text"
                      value={formData.folder}
                      onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                      className="input-field"
                      placeholder="ชื่อโฟลเดอร์ใน Google Drive"
                    />
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
                </div>

                {/* Videos Section */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">วิดีโอ ({formData.videos.length})</h3>
                    <button onClick={addVideo} className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      เพิ่มวิดีโอ
                    </button>
                  </div>

                  {formData.videos.map((video, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-gray-700">วิดีโอ #{index + 1}</span>
                        <button
                          onClick={() => removeVideo(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            ชื่อวิดีโอ
                          </label>
                          <input
                            type="text"
                            value={video.title}
                            onChange={(e) => updateVideo(index, 'title', e.target.value)}
                            className="input-field text-sm"
                            placeholder="ชื่อวิดีโอ"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Google Drive ID *
                          </label>
                          <input
                            type="text"
                            value={video.driveId}
                            onChange={(e) => updateVideo(index, 'driveId', e.target.value)}
                            className="input-field text-sm"
                            placeholder="1ABC123xyz..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            ระยะเวลา
                          </label>
                          <input
                            type="text"
                            value={video.duration}
                            onChange={(e) => updateVideo(index, 'duration', e.target.value)}
                            className="input-field text-sm"
                            placeholder="15:30"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            ลำดับ
                          </label>
                          <input
                            type="number"
                            value={video.order}
                            onChange={(e) => updateVideo(index, 'order', parseInt(e.target.value))}
                            className="input-field text-sm"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            คำอธิบาย
                          </label>
                          <textarea
                            value={video.description || ''}
                            onChange={(e) => updateVideo(index, 'description', e.target.value)}
                            className="input-field text-sm"
                            rows={2}
                            placeholder="คำอธิบายวิดีโอ"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.videos.length === 0 && (
                    <p className="text-center text-gray-500 py-4">ยังไม่มีวิดีโอ คลิก &quot;เพิ่มวิดีโอ&quot; ด้านบน</p>
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
