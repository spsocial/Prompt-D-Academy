'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { Plus, Edit, Trash2, Wrench, Video, Search, Filter, Eye, Sparkles, Crown, Zap, Gift } from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  requiredPackage: string;
  videos: any[];
  order?: number;
  imageUrl?: string;
  icon?: string;
}

export default function AdminAIToolsPage() {

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
  const { userData } = useAuth();
  const [tools, setTools] = useState<AITool[]>([]);
  const [filteredTools, setFilteredTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPackage, setFilterPackage] = useState<'all' | 'free' | 'basic' | 'allinone' | 'pro' | 'pro_standalone'>('all');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'videos'>('order');

  useEffect(() => {
    loadTools();
  }, []);

  useEffect(() => {
    filterAndSortTools();
  }, [tools, searchTerm, filterPackage, sortBy]);

  const loadTools = async () => {
    try {
      const toolsCol = collection(db, 'aiTools');
      const toolsSnapshot = await getDocs(toolsCol);
      const toolsList = toolsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AITool));

      console.log('✅ Loaded tools:', toolsList);
      setTools(toolsList);
    } catch (error) {
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTools = () => {
    let filtered = [...tools];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Package filter
    if (filterPackage !== 'all') {
      filtered = filtered.filter(tool => tool.requiredPackage === filterPackage);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'order':
          const orderA = a.order ?? 999;
          const orderB = b.order ?? 999;
          return orderA - orderB;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'videos':
          return (b.videos?.length || 0) - (a.videos?.length || 0);
        default:
          return 0;
      }
    });

    setFilteredTools(filtered);
  };

  const handleDelete = async (toolId: string, toolName: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบ "${toolName}"?\n\nการลบจะส่งผลกระทบต่อ Learning Paths ที่ใช้ Tool นี้!`)) return;

    try {
      await deleteDoc(doc(db, 'aiTools', toolId));
      alert('✅ ลบ AI Tool เรียบร้อยแล้ว!');
      loadTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + (error as Error).message);
    }
  };

  const getPackageBadgeColor = (pkg: string) => {
    switch (pkg) {
      case 'free':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'basic':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'allinone':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'pro':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300';
      case 'pro_standalone':
        return 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white border-indigo-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPackageIcon = (pkg: string) => {
    switch (pkg) {
      case 'free':
        return <Gift className="w-3 h-3" />;
      case 'basic':
        return <Zap className="w-3 h-3" />;
      case 'allinone':
        return <Sparkles className="w-3 h-3" />;
      case 'pro':
        return <Crown className="w-3 h-3" />;
      case 'pro_standalone':
        return <Crown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getPackageName = (pkg: string) => {
    const names: Record<string, string> = {
      free: 'Free',
      basic: 'Beginner',
      allinone: 'All-in-One',
      pro: 'Pro Developer + All-in-One',
      pro_standalone: 'Pro Developer'
    };
    return names[pkg] || pkg;
  };

  // Stats
  const stats = {
    total: tools.length,
    free: tools.filter(t => t.requiredPackage === 'free').length,
    basic: tools.filter(t => t.requiredPackage === 'basic').length,
    allinone: tools.filter(t => t.requiredPackage === 'allinone').length,
    pro: tools.filter(t => t.requiredPackage === 'pro').length,
    pro_standalone: tools.filter(t => t.requiredPackage === 'pro_standalone').length,
    totalVideos: tools.reduce((sum, t) => sum + (t.videos?.length || 0), 0)
  };

  if (!userData?.isAdmin) {
    return (
      <ProtectedRoute requireActive={true}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ⛔ ไม่มีสิทธิ์เข้าถึง
              </h1>
              <Link href="/dashboard" className="text-purple-600 hover:underline">
                กลับไปหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireActive={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🛠️ จัดการ AI Tools
              </h1>
              <p className="text-gray-600">
                เพิ่ม แก้ไข หรือลบ AI Tools และวิดีโอ
              </p>
            </div>
            <Link
              href="/admin/ai-tools/create"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              เพิ่ม AI Tool
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
            <div className="card bg-white">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-600">ทั้งหมด</p>
              </div>
            </div>
            <div className="card bg-green-50 border-green-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{stats.free}</p>
                <p className="text-xs text-green-600">Free</p>
              </div>
            </div>
            <div className="card bg-blue-50 border-blue-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">{stats.basic}</p>
                <p className="text-xs text-blue-600">Beginner</p>
              </div>
            </div>
            <div className="card bg-purple-50 border-purple-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-700">{stats.allinone}</p>
                <p className="text-xs text-purple-600">All-in-One</p>
              </div>
            </div>
            <div className="card bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-700">{stats.pro}</p>
                <p className="text-xs text-orange-600">Pro Bundle</p>
              </div>
            </div>
            <div className="card bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-700">{stats.pro_standalone}</p>
                <p className="text-xs text-indigo-600">Pro Only</p>
              </div>
            </div>
            <div className="card bg-gray-50">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalVideos}</p>
                <p className="text-xs text-gray-600">วิดีโอ</p>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ค้นหา AI Tool..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Filter by Package */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filterPackage}
                  onChange={(e) => setFilterPackage(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                >
                  <option value="all">ทุก Package</option>
                  <option value="free">Free</option>
                  <option value="basic">Beginner</option>
                  <option value="allinone">All-in-One</option>
                  <option value="pro">Pro Bundle</option>
                  <option value="pro_standalone">Pro Only</option>
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              >
                <option value="order">เรียงตาม Order</option>
                <option value="name">เรียงตามชื่อ A-Z</option>
                <option value="videos">เรียงตามจำนวนวิดีโอ</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-12 card">
              <Wrench className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm || filterPackage !== 'all' ? 'ไม่พบ AI Tool ที่ค้นหา' : 'ยังไม่มี AI Tool'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterPackage !== 'all'
                  ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง'
                  : 'เริ่มสร้าง AI Tool แรกของคุณ'}
              </p>
              {!searchTerm && filterPackage === 'all' && (
                <Link
                  href="/admin/ai-tools/create"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  สร้าง AI Tool
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-4 text-sm text-gray-600">
                แสดง {filteredTools.length} จาก {tools.length} AI Tools
              </div>

              {/* Tools Grid */}
              <div className="grid gap-6">
                {filteredTools.map((tool) => (
                  <div key={tool.id} className="card hover:shadow-xl transition-all border-l-4 border-purple-500">
                    <div className="flex items-start gap-6">
                      {/* Thumbnail or Icon */}
                      <div className="flex-shrink-0">
                        {tool.imageUrl ? (
                          <img
                            src={tool.imageUrl}
                            alt={tool.name}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-4xl">{tool.icon || '🤖'}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title & Order */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-bold text-gray-900">
                              {tool.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getPackageBadgeColor(tool.requiredPackage)}`}>
                              {getPackageIcon(tool.requiredPackage)}
                              {getPackageName(tool.requiredPackage)}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                              Order: {tool.order ?? 999}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-3 line-clamp-2">{tool.description}</p>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm">
                          <span className="flex items-center gap-1.5 text-purple-600 font-medium">
                            <Video className="w-4 h-4" />
                            {tool.videos?.length || 0} วิดีโอ
                          </span>
                          <span className="text-gray-500">
                            ID: {tool.id}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/tool/${tool.id}`}
                          target="_blank"
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="ดูหน้า Tool"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </Link>
                        <Link
                          href={`/admin/ai-tools/edit/${tool.id}`}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="แก้ไข"
                        >
                          <Edit className="w-5 h-5 text-blue-600" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tool.id, tool.name)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="ลบ"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Back to Admin */}
          <div className="mt-8 text-center">
            <Link href="/admin" className="text-purple-600 hover:underline">
              ← กลับไปหน้า Admin
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
