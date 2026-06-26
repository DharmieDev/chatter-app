import Link from "next/link";
import { TrendingPost } from "@/app/main/page";
import { getTagName, formatNumber } from "@/lib/utils/feedHelpers";

interface TrendingSidebarProps {
  trending: TrendingPost[];
}

export function TrendingSidebar({ trending }: TrendingSidebarProps) {
  return (
    <div className="border-t lg:border-t-0 lg:border-l border-stone-800 pt-12 lg:pt-0 lg:pl-12 flex flex-col h-full lg:max-h-[600px]">
      <h3 className="shrink-0 text-[11px] font-bold tracking-widest text-stone-500 mb-8 flex items-center gap-2 uppercase">
        <span className="w-1 h-1 bg-stone-500 rounded-full" /> Trending Now
      </h3>

      <div className="flex flex-col gap-8 overflow-y-auto scrollbar-none pr-4 pb-8 flex-1">
        {trending.map((trend, index) => (
          <div key={trend.id} className="flex gap-5 items-start group">
            <span className="text-3xl font-serif font-bold text-stone-800 leading-none group-hover:text-stone-700 transition-colors">
              {(index + 1).toString().padStart(2, "0")}
            </span>
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                {getTagName(trend.post_tags)}
              </p>
              <Link
                href={`/main/post/${trend.slug}`}
                className="text-stone-200 font-serif text-lg leading-snug hover:text-orange-200 transition-colors block"
              >
                {trend.title}
              </Link>
              <p className="text-xs text-stone-500">
                {formatNumber(trend.view_count)} views today
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}