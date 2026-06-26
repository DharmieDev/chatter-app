"use client";
import { PostWithRelations, TrendingPost } from "@/app/main/page";
import { ArrowRight, Heart, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useInfiniteScroll } from "./InfiniteScroll";
import { TrendingSidebar } from "./TrendingSidebar";
import { PostCard } from "./PostCard";
import { formatDate, formatNumber, getLikesCount } from "@/lib/utils/feedHelpers";

interface FeedClientProps {
  initialPosts: PostWithRelations[];
  trending: TrendingPost[];
}

export function FeedClient({ initialPosts, trending }: FeedClientProps) {
  const { posts, loading, hasMore, sentinelRef } = useInfiniteScroll(initialPosts);

  if (!initialPosts || initialPosts.length === 0) {
    return (
      <div className="min-h-screen bg-[#0C0A09] text-gray-400 flex items-center justify-center">
        No stories published yet.
      </div>
    );
  }

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#E7E5E4] font-sans px-6 py-8 md:px-12 lg:px-16 selection:bg-orange-500/30">
      
      {/* Navigation Headers */}
      <nav className="flex gap-8 border-b border-stone-800 pb-4 mb-12 text-sm font-medium text-stone-400 overflow-x-auto whitespace-nowrap scrollbar-none">
        <Link href="#" className="text-stone-100 relative pb-4 -mb-[17px] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-orange-600">For You</Link>
        <Link href="#" className="hover:text-stone-200 transition-colors">Following</Link>
        <Link href="#" className="hover:text-stone-200 transition-colors">Trending</Link>
        <Link href="#" className="hover:text-stone-200 transition-colors">Technology</Link>
        <Link href="#" className="hover:text-stone-200 transition-colors">Design</Link>
      </nav>

      {/* Main Top Section Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
        
        {/* Featured Story Block */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-orange-500/20 text-orange-400 text-[10px] font-bold tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Featured Story
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-stone-100 tracking-tight leading-[1.1] mb-6">
              {featuredPost.title.split(" ").map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={i} className="text-amber-200/90 italic font-light"> {" "}{word}</span>
                ) : (
                  word + " "
                )
              )}
            </h1>

            <p className="text-stone-400 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
              {featuredPost.excerpt ?? "No description available for this post."}
            </p>

            {/* Author Profile */}
            <div className="flex items-center gap-3.5 mb-8">
              {featuredPost.profiles?.avatar_url ? (
                <Image src={featuredPost.profiles.avatar_url} alt={featuredPost.profiles.full_name ?? "Avatar"} width={38} height={38} className="rounded-full ring-1 ring-stone-800" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-xs font-bold text-stone-900 uppercase">
                  {featuredPost.profiles?.username?.slice(0, 2) ?? "??"}
                </div>
              )}
              <div>
                <p className="text-stone-200 font-medium text-sm">
                  {featuredPost.profiles?.full_name ?? featuredPost.profiles?.username ?? "Unknown Author"}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {formatDate(featuredPost.published_at)} · {featuredPost.read_time ?? 5} min read · {formatNumber(featuredPost.view_count)} views
                </p>
              </div>
            </div>
          </div>

          {/* Featured Interaction Toolbar */}
          <div className="flex items-center gap-3">
            <Link href={`/main/post/${featuredPost.slug}`} className="bg-stone-100 text-stone-950 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-stone-200 transition-all shadow-sm">
              Read Story <ArrowRight size={16} />
            </Link>
            <button className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-4 py-2.5 rounded-xl hover:bg-stone-800/60 transition-colors text-stone-400 hover:text-stone-200">
              <Heart size={16} />
              <span className="text-xs font-medium">{getLikesCount(featuredPost.likes)}</span>
            </button>
            <button className="bg-stone-900 border border-stone-800 p-2.5 rounded-xl hover:bg-stone-800/60 transition-colors text-stone-400 hover:text-stone-200">
              <PlusCircle size={16} />
            </button>
          </div>
        </div>

        {/* Separated Trending Sidebar Component */}
        <TrendingSidebar trending={trending} />
      </div>

      {/* Infinite Scroll Loop using your explicit PostCard Component */}
      <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none border-t border-stone-800/60 pt-12 pb-4 pr-6">
        {gridPosts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Infinite Scrolling Sentinel Intersection Target */}
      <div ref={sentinelRef} className="w-full py-12 mt-8 flex flex-col items-center justify-center">
        {loading && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-stone-800 border-t-orange-500 rounded-full animate-spin" />
            <span className="text-sm font-medium text-stone-500 animate-pulse">Loading more stories...</span>
          </div>
        )}
        
        {!hasMore && posts.length > 1 && (
          <div className="text-stone-500 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-700" />
            You have reached the end of the feed.
            <span className="w-2 h-2 rounded-full bg-stone-700" />
          </div>
        )}
      </div>
    </div>
  );
}
