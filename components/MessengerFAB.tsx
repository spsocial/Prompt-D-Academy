'use client';

import { MessageCircle } from 'lucide-react';

export function MessengerFAB() {
  return (
    <a
      href="https://m.me/719837687869400"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="ติดต่อ Admin ผ่าน Facebook Messenger"
    >
      <div className="relative">
        {/* Pulse Animation Ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-ping opacity-20"></div>

        {/* Main Button */}
        <div className="relative w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
            ติดต่อ Admin
          </div>
          {/* Arrow */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      </div>
    </a>
  );
}
