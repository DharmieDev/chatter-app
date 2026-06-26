"use client"
import { createClient } from "@/lib/supabase/client"
import { SubmitEventHandler, useEffect, useState } from "react"


type Comment = {
  id: string
  content: string
  created_at: string
  profiles: {
    full_name: string
    avatar_url: string | null
  }
}

export default function CommentThread({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*, profiles(full_name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (data) setComments(data as Comment[])
    }
    fetchComments();

    const channel = supabase
      .channel(`comments: post_id=eq.${postId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchComments()
        }
      ,)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId, supabase])

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim()
      })
      setNewComment('')
    }
    
    setIsSubmitting(false)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono tracking-widest text-stone-500 uppercase">
          Live Comments ({comments.length})
        </h3>
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-xs font-medium text-blue-200">
                {getInitials(comment.profiles?.full_name || 'Anonymous')}
              </div>
              <span className="text-sm font-medium text-stone-300">
                {comment.profiles?.full_name || 'Anonymous'}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              {comment.content}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 border-t border-stone-800 pt-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Join the discussion..."
          className="w-full resize-none rounded-xl border border-stone-800 bg-stone-900/50 p-4 text-sm text-stone-200 placeholder:text-stone-600 focus:border-[#d95d39] focus:outline-none focus:ring-1 focus:ring-[#d95d39] transition-all"
          rows={3}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="rounded-full bg-[#d95d39] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#c44f2e] disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
      
    </div>
  )
  
}