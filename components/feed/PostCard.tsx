import Link from "next/link";
import { Heart } from "lucide-react";
import { PostWithRelations } from "@/app/main/page";
import { getTagName, getLikesCount } from "@/lib/utils/feedHelpers";

interface PostCardProps {
  post: PostWithRelations;
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const cardThemes = [
    {
      bg: "from-stone-900 via-[#1C1717] to-[#171313]",
      accent: "text-orange-400",
      indicator: "bg-orange-500",
    },
    {
      bg: "from-stone-900 via-[#1C1B14] to-[#171611]",
      accent: "text-amber-400",
      indicator: "bg-amber-500",
    },
    {
      bg: "from-stone-900 via-[#141C17] to-[#111713]",
      accent: "text-emerald-400",
      indicator: "bg-emerald-500",
    },
  ];

  const theme = cardThemes[index % cardThemes.length];

  return (
    <Link
      href={`/main/post/${post.slug}`}
      className={`shrink-0 snap-start w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-gradient-to-b ${theme.bg} rounded-2xl p-6 border border-stone-800/60 hover:border-stone-700/80 transition-all duration-300 flex flex-col justify-between h-72 group`}
    >
      {/* Top Graphic Container */}
      <div className="flex justify-between items-start opacity-30 group-hover:opacity-50 transition-opacity">
        <span className="text-stone-700 font-serif text-2xl">“</span>
        <div className="w-3 h-3 rotate-45 border border-stone-700" />
      </div>

      <div className="space-y-3">
        <p className={`text-[10px] font-bold tracking-widest uppercase ${theme.accent}`}>
          {getTagName(post.post_tags)}
        </p>
        <h4 className="text-stone-100 font-serif text-xl tracking-tight leading-snug line-clamp-2 group-hover:text-stone-200">
          {post.title}
        </h4>

        {/* Card Footer Metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-800/40">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${theme.indicator}`} />
            <span className="text-xs text-stone-400 truncate max-w-[120px]">
              {post.profiles?.full_name ?? post.profiles?.username ?? "Anonymous"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Heart size={12} className="text-stone-600" /> {getLikesCount(post.likes)}
            </span>
            <span>· {post.read_time ?? 3} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}