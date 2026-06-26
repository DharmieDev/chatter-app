import { PostCard } from "@/components/feed/PostCard";
import { createClient } from "@/lib/supabase/server";
import { Globe, X } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";


interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username",resolvedParams.username)
    .single()

  if (!profile) notFound()

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
    post_tags(tags(name)),
      profiles!posts_author_id_fkey(full_name, avatar_url),
      likes(count)
  `)
    .eq("author_id", profile.id)
    .eq("status", "publish")
    .order("published_at", { ascending: false })

  const { count: followerCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profile.id)

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", profile.id)

  const storiesCount = posts?.length || 0
  const totalViews = posts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return num.toString()
  }
  
  return (
    <div className="min-h-screen bg-[#0C0A09] text-stone-300 pb-20">
      
      {/* Top Banner (Optional subtle gradient or dark block) */}
      <div className="h-32 bg-stone-900/40 border-b border-stone-800/50"></div>

      <div className="max-w-5xl mx-auto px-6">
        {/* === HEADER SECTION === */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 mb-8 gap-6">
          
          <div className="flex flex-col gap-4">
            {/* Avatar (Overlapping the banner) */}
            {profile.avatar_url && (
              <Image 
                src={profile.avatar_url} 
                alt={profile.full_name || 'Avatar'}
                width={24}
                height={24}
                className="w-24 h-24 rounded-full border-4 border-[#0C0A09] object-cover"
              />
            )}
            
            {/* Name & Handle */}
            <div>
              <h1 className="font-serif text-4xl font-bold text-white mb-1">
                {profile.full_name}
              </h1>
              <p className="text-stone-500 font-mono text-sm">@{profile.username}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="px-5 py-2 rounded-xl text-sm font-semibold text-stone-400 border border-stone-800 hover:bg-stone-900 hover:text-stone-200 transition-all">
              Edit Profile
            </button>
          </div>
        </div>

        {/* === BIO & LINKS SECTION === */}
        <div className="mb-12">
          <p className="text-stone-400 max-w-2xl leading-relaxed mb-6">
            {profile.bio || "This user hasn't written a bio yet. Currently building in silence."}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#E55B2B] hover:text-[#D44A1A] transition-colors">
                <Globe className="w-4 h-4 text-stone-500" />
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {profile.twitter && (
              <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#E55B2B] hover:text-[#D44A1A] transition-colors">
                <X className="w-4 h-4 text-stone-500" />
                @{profile.twitter}
              </a>
            )}
          </div>
        </div>

        {/* === STATS STRIP === */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-y border-stone-800 py-10 mb-12">
          <div className="flex flex-col items-center justify-center border-r border-stone-800/50 last:border-0">
            <span className="font-serif text-3xl font-bold text-white mb-2">{formatNumber(followerCount || 0)}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Followers</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-stone-800/50 last:border-0">
            <span className="font-serif text-3xl font-bold text-white mb-2">{formatNumber(followingCount || 0)}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Following</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-stone-800/50 last:border-0">
            <span className="font-serif text-3xl font-bold text-white mb-2">{formatNumber(storiesCount)}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Stories</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-serif text-3xl font-bold text-white mb-2">{formatNumber(totalViews)}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Total Views</span>
          </div>
        </div>

        {/* === FEED SECTION === */}
        {posts && posts.length > 0 ? (
          <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none border-t border-stone-800/60 pt-12 pb-4 pr-6">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-stone-800 rounded-2xl">
            <p className="text-stone-500 italic">No stories published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
