import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  
  const host = request.headers.get("host") || requestUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  // Diagnostic: Check if the required auth cookies exist
  const allCookies = request.headers.get("cookie") || "";
  const hasStateCookie = allCookies.includes("sb-") && allCookies.includes("-auth-token");
  
  console.log("Auth Callback Diagnostic:", { 
    code: code ? "present" : "missing", 
    hasAuthCookies: hasStateCookie,
    cookieNames: allCookies.split(';').map(c => c.split('=')[0].trim()).filter(n => n.startsWith('sb-'))
  });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(`${origin}/auth/login?error=Missing configuration`);
  }

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      console.log("Auth exchange successful, redirecting to:", next);
      // Ensure we use a clean redirect URL
      const redirectUrl = new URL(next, origin);
      return NextResponse.redirect(redirectUrl.toString());
    }
    
    console.error("Auth code exchange error:", error.message, error.status);
    // If it fails, redirect to login with the specific error
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
