import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Service role client — Bypasses Row Level Security!
// ONLY use this in trusted server contexts (Server Actions/Route Handlers)
// when you absolutely need to bypass RLS.
export function getSupabaseAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
