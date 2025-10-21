'use client';

import { Lock } from 'lucide-react';
import Link from 'next/link';

interface LockOverlayProps {
  requiredPackage: 'basic' | 'allinone' | 'pro';
  message?: string;
}

export function LockOverlay({ requiredPackage, message }: LockOverlayProps) {
  const packageNames = {
    basic: 'โฆษณาโปร',
    allinone: 'All-in-One',
    pro: 'Pro Developer',
  };

  return (
    <div className="lock-overlay">
      <Lock className="w-16 h-16 text-white mb-4" />
      <h3 className="text-white text-xl font-bold mb-2">เนื้อหานี้ถูกล็อค</h3>
      <p className="text-white text-center mb-4 px-4">
        {message || `อัพเกรดเป็นแพ็คเกจ ${packageNames[requiredPackage]} เพื่อปลดล็อคเนื้อหานี้`}
      </p>
      <Link
        href="/profile"
        className="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
      >
        ดูแพ็คเกจ
      </Link>
    </div>
  );
}
