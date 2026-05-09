import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";

export async function middleware(request: NextRequest) {
  try {
    // 0. Total bypass for the home page to prevent any possible crashes
    if (request.nextUrl.pathname === "/") {
      return NextResponse.next();
    }

    // 1. Update the session (refreshes the token if needed)
    let supabaseResponse = await updateSession(request);

    // 2. Determine if this is a protected path
    const protectedPaths = ["/dashboard", "/checkout", "/orders", "/admin"];
    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (!isProtectedPath) {
      return supabaseResponse;
    }

    // 3. Check for configuration (Demo Mode bypass)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return supabaseResponse; // Allow in Demo Mode
    }

    // 4. Authenticate the user
    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {}, // Read-only here
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // 4. If no user, redirect to login (ONLY for protected routes)
    const isProtectedRoute = 
      request.nextUrl.pathname.startsWith("/dashboard") || 
      request.nextUrl.pathname.startsWith("/orders") || 
      request.nextUrl.pathname.startsWith("/admin");

    if (!user && isProtectedRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth/login";
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // 5. Special check for /admin role (ONLY for admin routes)
    if (user && request.nextUrl.pathname.startsWith("/admin")) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
          
        if (!profile || profile.role !== "admin") {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = "/dashboard";
          return NextResponse.redirect(redirectUrl);
        }
      } catch (adminErr) {
        console.error("Admin role check failed, allowing fallback:", adminErr);
        // On error, let them through to see the login screen's demo mode
      }
    }

    return supabaseResponse;
  } catch (error) {
    // CRITICAL: Prevent middleware from crashing the site (500 error)
    // If anything fails, we just let the request through and handle errors on the page
    console.error("Middleware Safety Catch:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (exclude to allow OAuth exchange)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|auth/|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
