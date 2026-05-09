import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

// Server-side client — reads cookies from Next.js request context
// Use inside: Server Components, Server Actions, Route Handlers
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
          const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout
          return fetch(url, { ...init, signal: controller.signal as any }).finally(() => clearTimeout(timeoutId));
        },
      },
    }
  );
}
