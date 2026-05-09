import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  
  // Use the request headers to determine the correct origin (protocol + host)
  // This is more reliable on Vercel/proxies than requestUrl.origin
  const host = request.headers.get("host") || requestUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Missing Supabase environment variables");
    return NextResponse.redirect(`${origin}/auth/login?error=Missing configuration`);
  }

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("Auth code exchange error:", error);
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
