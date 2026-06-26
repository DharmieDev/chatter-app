"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function publishPost(postId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .update({
      status: 'publish',
      published_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to publish post: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath(`/main/post/${data.slug}`)

  return {success: true, slug: data.slug}
}