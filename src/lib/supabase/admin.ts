import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Service role client — Bypasses Row Level Security!
// ONLY use this in trusted server contexts (Server Actions/Route Handlers)
// when you absolutely need to bypass RLS.
export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("CRITICAL: Supabase Admin environment variables are missing!");
    // If we're missing variables, we can't initialize.
    if (process.env.NODE_ENV === "development") {
       throw new Error("SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
    }
  }

  return createClient<Database>(
    supabaseUrl || "",
    serviceRoleKey || "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
