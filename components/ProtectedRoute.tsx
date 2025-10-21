'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireActive?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  requireActive = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Not logged in - redirect to login
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user data exists
      if (!userData) {
        router.push('/login');
        return;
      }

      // Check if user needs approval (Google Sign-In users)
      if (requireActive && !userData.isActive) {
        router.push('/pending-approval');
        return;
      }

      // Check admin requirement
      if (requireAdmin && !userData.isAdmin) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, userData, loading, router, requireAdmin, requireActive]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4" />
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user
  if (!user || !userData) {
    return null;
  }

  // Don't render if user needs approval but page requires active status
  if (requireActive && !userData.isActive) {
    return null;
  }

  // Don't render if page requires admin but user is not admin
  if (requireAdmin && !userData.isAdmin) {
    return null;
  }

  // All checks passed, render children
  return <>{children}</>;
}
