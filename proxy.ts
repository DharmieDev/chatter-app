import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";


export async function proxy(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({name, value, options}) => supabaseResponse.cookies.set(name, value, options))
        }
      }
    }
  )

  // Refresh session: called before auth checks
  const { data: { user } } = await supabase.auth.getUser();

  
  const currentPath = request.nextUrl.pathname

  if (user && currentPath === '/') {
    return NextResponse.redirect(new URL('/main', request.url));
  }

  if (!user && currentPath.startsWith('/main')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('next', currentPath)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

