'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface LearningPath {
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
  steps: Array<{
    order: number;
    toolId: string;
    videoId: string;
    title: string;
    description: string;
  }>;
  order?: number;
}

export function useLearningPaths() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const pathsRef = collection(db, 'learningPaths');
      const pathsQuery = query(pathsRef);

      const unsubscribe = onSnapshot(
        pathsQuery,
        (snapshot) => {
          const pathsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as LearningPath[];

          // Sort by order field (lower numbers first), then by title
          const sortedPaths = pathsData.sort((a, b) => {
            const orderA = a.order ?? 999;
            const orderB = b.order ?? 999;

            if (orderA !== orderB) {
              return orderA - orderB;
            }
            return a.title.localeCompare(b.title);
          });

          setPaths(sortedPaths);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching learning paths:', err);
          setError('ไม่สามารถโหลดข้อมูลเส้นทางการเรียนได้');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up learning paths listener:', err);
      setError('เกิดข้อผิดพลาดในการตั้งค่า');
      setLoading(false);
    }
  }, []);

  return { paths, loading, error };
}
