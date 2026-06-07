'use client';

import { Bell } from 'lucide-react';

export default function NotificationBell() {
  // Hardcoded for now, but you could fetch this from Supabase later!
  const unreadCount = 3; 

  return (
    <button className="relative p-2 rounded-md hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-200 border border-gray-800 bg-[#1A1A1A]">
      <Bell className="h-5 w-5 fill-current" />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E55B2B] text-[10px] font-bold text-white ring-2 ring-[#0A0A0A]">
          {unreadCount}
        </span>
      )}
    </button>
  );
}