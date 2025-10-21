'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'email' | 'google';
  isActive: boolean;
  needsApproval: boolean;
  isAdmin?: boolean;
  package: 'basic' | 'allinone' | 'pro' | null;
  packageExpiry?: Date;
  createdAt: Date;
  lastLogin?: Date;
  lastLoginIP?: string;
  loginHistory?: Array<{
    timestamp: Date;
    ip: string;
    device: string;
  }>;
  activeSessions?: number;
  suspiciousActivity?: boolean;
  progress?: {
    [courseId: string]: {
      completed: number;
      lastWatchedVideo: string;
      completionPercent: number;
      watchedVideos: string[];
    };
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        console.log('🔐 User authenticated:', currentUser.uid);

        // Listen to user document changes in Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribeUserData = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            console.log('🔄 Firestore snapshot received for user:', currentUser.uid);

            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              console.log('📊 User data updated:', {
                uid: data.uid,
                email: data.email,
                progress: data.progress ? Object.keys(data.progress) : 'No progress'
              });

              setUserData({
                uid: data.uid,
                email: data.email,
                displayName: data.displayName,
                photoURL: data.photoURL,
                provider: data.provider,
                isActive: data.isActive,
                needsApproval: data.needsApproval,
                isAdmin: data.isAdmin,
                package: data.package,
                packageExpiry: data.packageExpiry?.toDate(),
                createdAt: data.createdAt?.toDate(),
                lastLogin: data.lastLogin?.toDate(),
                lastLoginIP: data.lastLoginIP,
                loginHistory: data.loginHistory,
                activeSessions: data.activeSessions,
                suspiciousActivity: data.suspiciousActivity,
                progress: data.progress,
              } as UserData);
            } else {
              console.warn('⚠️ User document does not exist:', currentUser.uid);
              setUserData(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error('❌ Error fetching user data:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            setUserData(null);
            setLoading(false);
          }
        );

        return () => unsubscribeUserData();
      } else {
        console.log('🚪 User logged out');
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { user, userData, loading };
}
