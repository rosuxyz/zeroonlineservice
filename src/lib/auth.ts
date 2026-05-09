import { getSupabaseServerClient } from "./supabase/server";

export async function getUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { id: "demo-user-123", email: "demo@topuphub.com" } as any;
  }
  
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getUserProfile() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { id: "demo-user-123", email: "demo@topuphub.com", role: "admin", full_name: "Demo Admin" } as any;
  }

  const user = await getUser();
  if (!user) return null;

  const supabase = await getSupabaseServerClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) return null;
  return profile;
}

export async function isAdmin() {
  const profile = await getUserProfile();
  return profile?.role === "admin";
}
