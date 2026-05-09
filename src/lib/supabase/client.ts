import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

// Singleton browser client — reused across components
let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Supabase environment variables are missing!");
  }

  client = createBrowserClient<Database>(
    supabaseUrl || "",
    supabaseAnonKey || ""
  );
  return client;
}
