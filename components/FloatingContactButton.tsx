'use client';

import { MessageCircle } from 'lucide-react';

export function FloatingContactButton() {
  const facebookPageUrl = 'https://m.me/719837687869400';

  return (
    <a
      href={facebookPageUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 group"
      title="ติดต่อ Admin"
    >
      <MessageCircle className="w-6 h-6" />

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
          ติดต่อ Admin เพื่อสมัครแพ็คเกจ
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-20"></div>
    </a>
  );
}
