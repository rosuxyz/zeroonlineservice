"use server";

import { getSupabaseServerClient } from "../supabase/server";
import { isAdmin } from "../auth";
import { revalidatePath } from "next/cache";

export async function getDashboardStats() {
  if (!(await isAdmin())) {
    return { 
      totalRevenue: 0, revenueChange: 0, 
      totalOrders: 0, ordersChange: 0, 
      activeUsers: 0, usersChange: 0, 
      gamesListed: 0, gamesChange: 0 
    };
  }
  
  const supabase = await getSupabaseServerClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  // 1. Total Revenue & Revenue Change
  const { data: allRevenueOrders } = await supabase
    .from("orders")
    .select("amount, created_at")
    .eq("status", "completed");
    
  const currentMonthRevenue = allRevenueOrders
    ?.filter(o => o.created_at >= startOfMonth)
    .reduce((sum, o) => sum + o.amount, 0) || 0;
    
  const prevMonthRevenue = allRevenueOrders
    ?.filter(o => o.created_at >= startOfPrevMonth && o.created_at < startOfMonth)
    .reduce((sum, o) => sum + o.amount, 0) || 0;
    
  const totalRevenue = allRevenueOrders?.reduce((sum, o) => sum + o.amount, 0) || 0;
  const revenueChange = prevMonthRevenue === 0 ? 0 : ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
  
  // 2. Total Orders & Orders Change (Last 24h)
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });
    
  const { count: ordersChange } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", yesterday);
    
  // 3. Active Users & Users Change (Last 7d)
  const { count: activeUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "user");

  const { count: usersChange } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "user")
    .gte("created_at", sevenDaysAgo);
    
  // 4. Games Listed & Games Change (Last 30d)
  const { count: gamesListed } = await supabase
    .from("games")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  const { count: gamesChange } = await supabase
    .from("games")
    .select("*", { count: "exact", head: true })
    .eq("active", true)
    .gte("created_at", thirtyDaysAgo);
    
  return {
    totalRevenue,
    revenueChange: parseFloat(revenueChange.toFixed(1)),
    totalOrders: totalOrders || 0,
    ordersChange: ordersChange || 0,
    activeUsers: activeUsers || 0,
    usersChange: usersChange || 0,
    gamesListed: gamesListed || 0,
    gamesChange: gamesChange || 0,
  };
}

export async function getAllOrders() {
  if (!(await isAdmin())) return [];
  
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("orders")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
  return data;
}

export async function getAllGames() {
  if (!(await isAdmin())) return [];
  
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("name");
    
  if (error) {
    console.error("Error fetching all games:", error);
    return [];
  }
  return data;
}

export async function upsertPackage(pkg: any) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("packages")
    .upsert(pkg)
    .select()
    .single();
    
  if (error) {
    console.error("Error upserting package:", error);
    throw new Error("Failed to save package");
  }
  
  revalidatePath("/admin");
  revalidatePath("/games", "page");
  return data;
}

export async function deletePackage(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  
  const supabase = await getSupabaseServerClient();
  
  const { error } = await supabase
    .from("packages")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting package:", error);
    throw new Error("Failed to delete package");
  }
  
  revalidatePath("/admin");
}

export async function deleteGame(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  
  const supabase = await getSupabaseServerClient();
  
  const { error } = await supabase
    .from("games")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting game:", error);
    throw new Error("Failed to delete game");
  }
  
  revalidatePath("/admin");
  revalidatePath("/games", "layout");
}

export async function getPackagesByGameId(gameId: string) {
  if (!(await isAdmin())) return [];
  
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("game_id", gameId)
    .order("price", { ascending: true });
    
  if (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
  return data;
}

export async function upsertGame(game: any) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("games")
    .upsert(game)
    .select()
    .single();
    
  if (error) {
    console.error("Error upserting game:", error);
    throw new Error("Failed to save game");
  }
  
  revalidatePath("/admin");
  revalidatePath("/games", "layout");
  return data;
}

export async function getSiteSettings(key: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();
    
  if (error) return null;
  return data.value;
}

export async function updateSiteSettings(key: string, value: any) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
    
  if (error) {
    console.error("Error updating site settings:", error);
    throw new Error("Failed to update settings");
  }
  
  revalidatePath("/", "layout");
}

export async function updateOrderStatus(orderId: string, status: "pending" | "completed" | "failed") {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update status");
  }
  
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/orders");
  return data;
}

export async function getAllUsers() {
  if (!(await isAdmin())) return [];
  
  const supabase = await getSupabaseServerClient();
  
  // Fetch profiles
  const { data: profiles, error: pError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (pError) {
    console.error("Error fetching profiles:", pError);
    return [];
  }

  // Fetch order summaries for each user to show "Total Spent" and "Order Count"
  const { data: orderStats } = await supabase
    .from("orders")
    .select("user_id, amount, status");

  const usersWithStats = profiles.map(profile => {
    const userOrders = orderStats?.filter(o => o.user_id === profile.id) || [];
    const completedOrders = userOrders.filter(o => o.status === "completed");
    
    return {
      ...profile,
      totalOrders: userOrders.length,
      totalSpent: completedOrders.reduce((sum, o) => sum + o.amount, 0)
    };
  });

  return usersWithStats;
}

export async function updateUserRole(userId: string, role: "admin" | "user") {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  
  const supabase = await getSupabaseServerClient();
  
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
    
  if (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update role");
  }
  
  revalidatePath("/admin");
}
