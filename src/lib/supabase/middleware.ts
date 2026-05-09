import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return supabaseResponse; // Demo Mode: Bypass
    }

    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            try {
              // Only set if cookies are available and the method exists
              if (request.cookies && typeof request.cookies.set === 'function') {
                cookiesToSet.forEach(({ name, value, options }) =>
                  request.cookies.set(name, value)
                );
              }
              
              supabaseResponse = NextResponse.next({
                request,
              });
              
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              );
            } catch (err) {
              console.error("Error setting cookies in middleware:", err);
            }
          },
        },
      }
    );

    // refreshing the auth token
    await supabase.auth.getUser();

    return supabaseResponse;
  } catch (e) {
    console.error("Critical updateSession error:", e);
    return NextResponse.next();
  }
}
