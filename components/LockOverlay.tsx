'use client';

import { Lock } from 'lucide-react';

interface LockOverlayProps {
  requiredPackage: 'basic' | 'allinone' | 'pro' | 'pro_standalone';
  message?: string;
}

export function LockOverlay({ requiredPackage, message }: LockOverlayProps) {
  const packageNames = {
    basic: 'Beginner',
    allinone: 'All-in-One',
    pro: 'Pro Developer + All-in-One',
    pro_standalone: 'Pro Developer',
  };

  const facebookPageUrl = 'https://m.me/719837687869400';

  return (
    <div className="lock-overlay">
      <Lock className="w-16 h-16 text-white mb-4" />
      <h3 className="text-white text-xl font-bold mb-2">เนื้อหานี้ถูกล็อค</h3>
      <p className="text-white text-center mb-4 px-4">
        {message || `ต้องมีคอร์ส ${packageNames[requiredPackage]} เพื่อปลดล็อคเนื้อหานี้`}
      </p>
      <a
        href={facebookPageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
      >
        ซื้อคอร์สเรียน
      </a>
    </div>
  );
}
