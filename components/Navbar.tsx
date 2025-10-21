'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Zap, Search, LogOut, User, Settings, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/hooks/useAuth';
import { getPackageName, getProviderIcon } from '@/lib/utils/accessControl';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, userData } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync search term with URL query
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchTerm(query);
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    // Only update URL if on dashboard page
    if (pathname === '/dashboard') {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      router.push(`/dashboard?${params.toString()}`);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm) {
      // If not on dashboard, navigate to dashboard with search
      if (pathname !== '/dashboard') {
        router.push(`/dashboard?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Prompt D Academy
            </span>
          </Link>

          {/* What's New Link */}
          {user && (
            <Link
              href="/whats-new"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors group"
            >
              <Sparkles className="w-5 h-5 text-purple-600 group-hover:animate-pulse" />
              <span className="font-medium text-gray-700 group-hover:text-purple-600">
                มีอะไรใหม่
              </span>
            </Link>
          )}

          {/* Search Bar */}
          {user && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="ค้นหาคอร์ส..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Profile Dropdown */}
          {user && userData ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                {userData.photoURL && !imageError ? (
                  <img
                    src={userData.photoURL}
                    alt={userData.displayName}
                    className="w-10 h-10 rounded-full border-2 border-purple-500"
                    onError={() => {
                      console.warn('⚠️ Failed to load user photo, using fallback');
                      setImageError(true);
                    }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                    {userData.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-bold text-gray-900">{userData.displayName}</p>
                    <p className="text-sm text-gray-600">{userData.email}</p>

                    {/* Provider Badge */}
                    <div className="mt-2 inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                      <span>{getProviderIcon(userData.provider)}</span>
                      <span>{userData.provider === 'google' ? 'Google' : 'Email'}</span>
                    </div>

                    {/* Package Badge */}
                    <div className="mt-2">
                      <span className="badge text-xs">
                        {getPackageName(userData.package)}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">ข้อมูลส่วนตัว</span>
                  </Link>

                  {userData.isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors border-t border-gray-100"
                    >
                      <Settings className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-gray-900 font-medium">⚙️ Admin Panel</p>
                        <p className="text-xs text-gray-500">จัดการระบบ</p>
                      </div>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="btn-primary">
                สมัครสมาชิก
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </nav>
  );
}
