import { FeedClient } from '@/components/feed/FeedClient'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/supabase'
import { QueryData, SupabaseClient } from '@supabase/supabase-js'
import { Suspense } from 'react'

const postsQuery = (supabase: SupabaseClient<Database>) =>
  supabase
    .from('posts')
    .select(`
    *,
    profiles!posts_author_id_fkey (username, avatar_url, full_name),
    post_tags (tags (name, slug)),
    likes (count)
  `)

const trendingQuery = (supabase: SupabaseClient<Database>) =>
  supabase
    .from('posts')
    .select(`
      id, 
      title, 
      slug, 
      view_count, 
      post_tags (tags (name))
    `)

export type PostWithRelations = QueryData<ReturnType<typeof postsQuery>>[number]
export type TrendingPost = QueryData<ReturnType<typeof trendingQuery>>[number]

export async function FeedData() {
  const supabase = await createClient()
  const yesterday = new Date(Date.now() - 86400000).toISOString()
  
  const [postsResult, trendingResult] = await Promise.all([
    postsQuery(supabase)
      .eq('status', 'publish')
      .order('published_at', { ascending: false })
      .limit(12),
      
    trendingQuery(supabase)
      .eq('status', 'publish')
      .gt('published_at', yesterday)
      .order('view_count', { ascending: false })
      .limit(15)
  ])
  
  return (
    <FeedClient 
      initialPosts={(postsResult.data as PostWithRelations[]) ?? []} 
      trending={(trendingResult.data as TrendingPost[]) ?? []} 
    />
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0C0A09]">
      <Suspense fallback={<FeedSkeleton />}>
        <FeedData />
      </Suspense>
    </div>
  )
}

function FeedSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-stone-800 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-stone-400 text-sm font-medium animate-pulse">Curating your feed...</p>
    </div>
  )
}