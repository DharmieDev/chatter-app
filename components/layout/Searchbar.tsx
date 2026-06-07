"use client";
import { Search } from "lucide-react";


export default function SearchBar() {
  return (
    <div className="relative hidden md:block">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Search stories..."
        className="w-64 bg-[#1A1A1A] text-gray-200 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#E55B2B] focus:border-[#E55B2B] transition-colors placeholder-gray-500"
      />
    </div>
  );
}