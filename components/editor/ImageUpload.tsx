import { createClient } from '@/lib/supabase/client'

export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(path, file, { contentType: file.type })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('post-images')
    .getPublicUrl(data.path)

  return publicUrl
}