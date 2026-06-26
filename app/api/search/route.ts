import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q");
  if (!q || q.length < 2) return NextResponse.json({ posts: [], profiles: [] });

  const supabase = await createClient();

  const [postsResponse, profilesResponse] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, title, slug, excerpt, read_time, profiles!posts_author_id_fkey(username, avatar_url)",
      )
      .eq("status", "publish")
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
      .limit(15),

    supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, bio")
      .or(`username.ilike.%${q}%,full_name.ilike.%${q}%,bio.ilike.%${q}%`)
      .limit(15),
  ]);
  if (postsResponse.error)
    console.error("Post search error:", postsResponse.error);
  if (profilesResponse.error)
    console.error("Profile search error:", profilesResponse.error);

  return NextResponse.json({
    posts: postsResponse.data ?? [],
    profiles: profilesResponse.data ?? [],
  });
}
