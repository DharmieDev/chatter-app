"use client";

import { useAuth } from "@/app/providers/providers";
import { createClient } from "@/lib/supabase/client";
import { ChevronDown, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UserViewProps {
  username: string | null;
}

export default function UserView({ username }: UserViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const user = useAuth((state) => state.user);
  const router = useRouter();

  const handleLogout = async () => {
    setIsOpen(false);
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push('/')
      router.refresh()
    }
  };

  // close dropdown on click outside
  useEffect(() => {
    function handleOutClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutClick);
    return () => document.removeEventListener("mousedown", handleOutClick);
  }, []);

  if (!user) return null;
  const userName =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email;
  const avatarUrl =
    user.user_metadata?.avatar_url ?? user.user_metadata?.picture;


  return (
    <div ref={dropdownRef}>
      {/*Trigger button*/}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 rounded-full hover:bg-[#2e2a26] transition-colors"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
          <Image
            src={avatarUrl}
            alt={`${userName}'s avatar`}
            sizes="40px"
            width={40}
            height={40}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <span className="hidden md:block text-sm font-bold text-white">
          {userName}
        </span>
        <ChevronDown className="text-[#6a6258] w-4 h-4" />
      </button>

      {/*Dropdown menu*/}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100 mb-1 text-sm">
            <p className="font-medium text-gray-900 truncate">{userName}</p>
            <p className="text-gray-500 truncate">{user.email}</p>
          </div>

          <Link
            href={username ? `/main/profile/${username}` : '#'}
            onClick={(e) => {
              if (!username) e.preventDefault();
              setIsOpen(false);
            }}
            className="flex gap-2.5 items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <User className="w-4 h-4" />
            Your Profile
          </Link>

          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="flex gap-2.5 items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
