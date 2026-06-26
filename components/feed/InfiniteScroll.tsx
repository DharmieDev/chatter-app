'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useInfiniteScroll<P extends { published_at: string | null }>(initialPosts: P[]) {
  const [posts, setPosts] = useState<P[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const cursor = useRef(initialPosts.at(-1)?.published_at)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || loading || !hasMore) return
        setLoading(true)

        const supabase = createClient()
        const { data } = await supabase
          .from('posts')
          .select(`
          *,
          profiles!posts_author_id_fkey(username, avatar_url, full_name),
          post_tags(tags(name, slug)),
          likes(count)
          `)
          .eq('status', 'publish')
          .lt('published_at', cursor.current) 
          .order('published_at', { ascending: false })
          .limit(12)

        if (!data || data.length === 0) {
          setHasMore(false)
        } else {
          cursor.current = data.at(-1)?.published_at
          setPosts(prev => [...prev, ...(data as P[])])
        }
        setLoading(false)
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loading, hasMore])

  return { posts, loading, hasMore, sentinelRef }
}