import { createClient } from "@/lib/supabase/server"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import DOMPurify from "isomorphic-dompurify"
import Image from "next/image"
import ReadingProgress from "@/components/comments/ReadingProgress"
import AuthorCard from "@/components/AuthorCard"
import CommentThread from "@/components/comments/CommentThread"



export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, cover_url')
    .eq('slug', slug)
    .single()

  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_url ? [post.cover_url] : [],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.cover_url ? [post.cover_url] : [],
    }
  }
  
}

function calculateReadTime(htmlContent: string) {
  // Strip HTML tags to get pure text
  const plainText = htmlContent.replace(/<[^>]+>/g, '')
  const wordCount = plainText.split(/\s+/).length
  const wordsPerMinute = 200 // Average reading speed
  return Math.ceil(wordCount / wordsPerMinute)
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select(`*,
    profiles:posts_author_id_fkey(id, full_name, bio, avatar_url),
    post_tags(tags(name))`)
    .eq('slug', slug)
    .maybeSingle()

  if (!post) notFound();
  const safeHTML = DOMPurify.sanitize(post.content ?? '')
  const author = post.profiles
  const primaryTag = post.post_tags?.[0]?.tags?.name
  const readTime = calculateReadTime(post.content ?? '')
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  })
  
  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 selection:bg-[#d95d39]/30 selection:text-white">
      {
        post.cover_url ? (
          <div className="relative h-[45vh] w-full min-h-[320px] max-h-[500px] overflow-hidden border-b border-stone-800/80">
            <Image 
            src={post.cover_url} 
              alt={post.title} 
              fill
              priority
            className="h-full w-full object-cover object-center brightness-[0.65]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-black/50" />

            <div className="fixed top-14 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-[2px]">
              <ReadingProgress />
            </div>

            <div className="absolute bottom-0 left-0 right-0">
            <div className="mx-auto max-w-7xl px-6 pb-8">
              {primaryTag && (
                <span className="mb-3 inline-block rounded-md bg-[#d95d39] px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase shadow-md">
                  {primaryTag}
                </span>
              )}
              <h1 className="font-serif text-3xl font-bold leading-tight text-white drop-shadow-md md:text-5xl lg:text-5xl max-w-4xl">
                {post.title}
              </h1>
            </div>
          </div>
            
          </div>
        ) : (
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <ReadingProgress />
            </div>
        )
      }

      <main className="mx-auto max-w-7xl px-6 py-10 lg:grid lg:grid-cols-12 lg:gap-12">
        <article className="lg:col-span-8">
          
          {/* Content Title Header Context fallback for text-only rendering */}
          {!post.cover_url && (
            <>
              {primaryTag && (
                <span className="mb-6 inline-block rounded-full border border-[#d95d39]/30 bg-[#d95d39]/10 px-3 py-1 text-xs font-semibold tracking-widest text-[#d95d39] uppercase">
                  {primaryTag}
                </span>
              )}
              <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-100 md:text-5xl lg:text-5xl">
                {post.title}
              </h1>
            </>
          )}

          {/* Meta/Metrics Row (Always visible underneath the banner style) */}
          <div className="my-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-800/60 pb-6">
            <div className="flex items-center space-x-3">
              {author?.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author.full_name}
                  width={40}
                  height={40}
                  priority
                  className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d95d39] text-sm font-bold text-white">
                  {author?.full_name?.charAt(0) || 'A'}
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-stone-200">{author?.full_name}</h4>
                <p className="text-xs text-stone-500">
                  {formattedDate} · {readTime} min read · {post.view_count || 0} views
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4 font-mono text-xs text-stone-500">
              <span>♥ {post.like_count || 0}</span>
              <span>💬 {post.comment_count || 0}</span>
            </div>
          </div>

          {/* Post Content Body */}
          <div 
            className="prose prose-stone prose-invert max-w-none prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[17px] prose-strong:font-semibold prose-strong:text-stone-100 prose-blockquote:border-l-4 prose-blockquote:border-[#d95d39] prose-blockquote:bg-stone-900/30 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-amber-200/90"
            dangerouslySetInnerHTML={{ __html: safeHTML }}
          />
        </article>

        {/* Sidebar Dashboard Panels */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-10 space-y-8 pl-4">
            <AuthorCard author={author} />
            <CommentThread postId={post.id} />
          </div>
        </aside>
      </main>
    </div>
  );
}
