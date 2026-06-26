"use client";

import { Database } from "@/lib/types/supabase";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"] & {
  profiles: Pick<ProfileRow, "username" | "avatar_url"> | null;
};

interface SearchPost {
  id: PostRow["id"];
  title: PostRow["title"];
  slug: PostRow["slug"];
  excerpt: PostRow["excerpt"];
  read_time: PostRow["read_time"];
  profiles: Pick<ProfileRow, "username" | "avatar_url"> | null;
}

interface SearchProfile {
  id: ProfileRow["id"];
  full_name: ProfileRow["full_name"];
  username: ProfileRow["username"];
  avatar_url: ProfileRow["avatar_url"];
  bio: ProfileRow["bio"];
}

interface SearchResponse {
  posts: SearchPost[];
  profiles: SearchProfile[];
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse>({
    posts: [],
    profiles: [],
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ posts: [], profiles: [] });
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch (error) {
        console.error("Failed to fetch search results", error);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const hasResults = results.posts.length > 0 || results.profiles.length > 0;

  return (
    <div className="relative inline-block w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-500" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stories or people..."
        className="w-64 bg-[#1A1A1A] text-gray-200 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#E55B2B] focus:border-[#E55B2B] transition-colors placeholder-gray-500"
      />

      {open && hasResults && (
        <div className="absolute top-full mt-2 w-80 bg-white shadow-xl rounded-xl border border-stone-200 overflow-hidden z-50 max-h-[450px] overflow-y-auto">
          {results.posts.length > 0 && (
            <div>
              <div className="bg-stone-50 px-4 py-1.5 border-b border-stone-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Stories
                </span>
                {results.posts.map((result) => (
                  <Link
                    key={result.id}
                    href={`/main/post/${result.slug}`}
                    className="block px-4 py-3 hover:bg-stone-50 border-b border-stone-100 last:border-0 transition-colors"
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <p className="font-serif font-bold text-sm text-stone-900">
                      {result.title}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {result.read_time ?? 0} min read
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {results.profiles.length > 0 && (
        <div>
          <div className="bg-stone-50 px-4 py-1.5 border-b border-stone-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              People
            </span>
            {results.profiles.map(profile => (
              <Link
                key={profile.id}
                href={`/main/profile/${profile.username}`}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50 border-b border-stone-100 last:border-0 transition-colors"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
              >
                <Image
                  src={profile.avatar_url ?? "/default-avatar.png"}
                  alt={profile.username}
                  width={8}
                  height={8}
                  className="w-8 h-8 rounded-full bg-stone-200 object-cover"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-stone-900 line-clamp-1">
                    {profile.full_name ?? `@${profile.username}`}
                  </p>
                  {profile.full_name && (
                    <p className="text-xs text-stone-400 truncate">
                      @{profile.username}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
