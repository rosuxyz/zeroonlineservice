import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

// Server-side client — reads cookies from Next.js request context
// Use inside: Server Components, Server Actions, Route Handlers
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Supabase environment variables are missing!");
    // If we're missing variables, we can't initialize. 
    // Return a dummy client or throw a better error.
    if (process.env.NODE_ENV === "development") {
       throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local");
    }
  }

  return createServerClient<Database>(
    supabaseUrl || "",
    supabaseAnonKey || "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll may throw in read-only Server Components — safe to ignore
          }
        },
      },
      global: {
        fetch: (url, init) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10-second timeout
          return fetch(url, { ...init, signal: controller.signal as any }).finally(() => clearTimeout(timeoutId));
        },
      },
    }
  );
}
