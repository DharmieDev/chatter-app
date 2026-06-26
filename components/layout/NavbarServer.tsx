import { createClient } from "@/lib/supabase/server";
import Navbar from "./Navbar";

export default async function NavbarServer() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();
  
  let databaseUsername: string | null = null;
  
  if (user) {
    const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user?.id)
      .single()

    databaseUsername = profile?.username ?? null
  }

  return <Navbar username={databaseUsername} />
}