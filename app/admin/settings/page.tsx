'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { Settings, Shield, Mail, Globe, Database, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const { userData } = useAuth();
  const [saving, setSaving] = useState(false);

  // Settings state
  const [siteName, setSiteName] = useState('Prompt D Academy');
  const [siteDescription, setSiteDescription] = useState('เรียนรู้ AI Tools อย่างมืออาชีพ');
  const [contactEmail, setContactEmail] = useState('support@promptdacademy.com');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    // Simulate saving (in real app, would save to Firebase)
    setTimeout(() => {
      alert('✅ บันทึกการตั้งค่าเรียบร้อยแล้ว!');
      setSaving(false);
    }, 1000);
  };

  if (!userData?.isAdmin) {
    return (
      <ProtectedRoute requireActive={true}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">⛔ ไม่มีสิทธิ์เข้าถึง</h1>
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ⚙️ ตั้งค่าระบบ
            </h1>
            <p className="text-gray-600">จัดการการตั้งค่าทั่วไปของระบบ</p>
          </div>

          {/* General Settings */}
          <div className="card mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">ข้อมูลทั่วไป</h2>
                <p className="text-sm text-gray-600">ข้อมูลพื้นฐานของเว็บไซต์</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อเว็บไซต์
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คำอธิบายเว็บไซต์
                </label>
                <textarea
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อีเมลติดต่อ
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* User Management Settings */}
          <div className="card mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">จัดการผู้ใช้</h2>
                <p className="text-sm text-gray-600">ตั้งค่าการลงทะเบียนและการอนุมัติ</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">เปิดให้ลงทะเบียนได้</p>
                  <p className="text-sm text-gray-600">อนุญาตให้ผู้ใช้ใหม่สมัครสมาชิก</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowRegistration}
                    onChange={(e) => setAllowRegistration(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">ต้องอนุมัติก่อนใช้งาน</p>
                  <p className="text-sm text-gray-600">
                    ผู้ใช้ใหม่ต้องรอ Admin อนุมัติก่อนเข้าใช้งาน
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireApproval}
                    onChange={(e) => setRequireApproval(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Database Info */}
          <div className="card mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">ข้อมูลระบบ</h2>
                <p className="text-sm text-gray-600">สถานะและข้อมูลทางเทคนิค</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Database:</span>
                <span className="text-sm font-medium text-gray-900">Firebase Firestore</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Authentication:</span>
                <span className="text-sm font-medium text-gray-900">Firebase Auth</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">เวอร์ชัน:</span>
                <span className="text-sm font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">สถานะระบบ:</span>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  ออนไลน์
                </span>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="card mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6" />
              <h2 className="text-xl font-bold">ข้อมูล Admin</h2>
            </div>
            <div className="space-y-2">
              <p>
                <strong>ชื่อ:</strong> {userData?.displayName}
              </p>
              <p>
                <strong>อีเมล:</strong> {userData?.email}
              </p>
              <p>
                <strong>UID:</strong> {userData?.uid}
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-purple-600 hover:underline">
              ← กลับไปหน้า Admin
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
            </button>
          </div>

          {/* Warning */}
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ หมายเหตุ:</strong> การตั้งค่าบางส่วนเป็นการแสดงผลเท่านั้น
              ในโปรเจ็คจริงควรเชื่อมต่อกับ Firebase Remote Config หรือ Firestore
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
