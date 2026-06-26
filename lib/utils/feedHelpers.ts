import { PostWithRelations, TrendingPost } from "@/app/main/page";

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "Draft";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatNumber = (num: number | null) => {
  if (!num) return "0";
  return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num.toString();
};

export const getTagName = (
  postTagItem: PostWithRelations["post_tags"] | TrendingPost["post_tags"]
): string => {
  if (!postTagItem || postTagItem.length === 0 || !postTagItem[0]?.tags) return "General";
  const target = postTagItem[0].tags as { name?: string } | Array<{ name?: string }>;
  
  if (Array.isArray(target)) return target[0]?.name ?? "General";
  return target?.name ?? "General";
};

export const getLikesCount = (likes: PostWithRelations["likes"]): number => {
  if (!likes) return 0;
  const likesData = likes as { count?: number } | Array<{ count?: number }>;

  if (Array.isArray(likesData)) {
    return likesData[0]?.count ?? 0;
  }
  return likesData.count ?? 0;
};