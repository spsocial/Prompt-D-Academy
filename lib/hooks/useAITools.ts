'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AITool {
  id: string;
  name: string;
  folder: string;
  icon: string;
  imageUrl?: string;
  description: string;
  videos: Array<{
    id: string;
    title: string;
    driveId: string;
    duration: string;
    order: number;
    description?: string;
  }>;
  requiredPackage: 'basic' | 'allinone' | 'pro';
  order?: number;
}

export function useAITools() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const toolsRef = collection(db, 'aiTools');
      const toolsQuery = query(toolsRef);

      const unsubscribe = onSnapshot(
        toolsQuery,
        (snapshot) => {
          const toolsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as AITool[];

          // Sort by order field (lower numbers first), then by name
          const sortedTools = toolsData.sort((a, b) => {
            const orderA = a.order ?? 999;
            const orderB = b.order ?? 999;

            if (orderA !== orderB) {
              return orderA - orderB;
            }
            return a.name.localeCompare(b.name);
          });

          setTools(sortedTools);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching AI tools:', err);
          setError('ไม่สามารถโหลดข้อมูล AI Tools ได้');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up AI tools listener:', err);
      setError('เกิดข้อผิดพลาดในการตั้งค่า');
      setLoading(false);
    }
  }, []);

  return { tools, loading, error };
}
