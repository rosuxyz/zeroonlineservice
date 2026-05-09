"use server";

import { getSupabaseServerClient } from "../supabase/server";
import { getUser } from "../auth";
import { revalidatePath } from "next/cache";

export async function createOrder(data: {
  gameId: string;
  gameName: string;
  packageId: string;
  packageLabel: string;
  playerId: string;
  serverRegion?: string;
  amount: number;
  discount?: number;
  promoCode?: string;
  paymentMethod: string;
  receiptUrl?: string;
}) {
  const user = await getUser();
  if (!user) throw new Error("Must be logged in to create an order");

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Demo Mode: Mock Order
    const demoOrder = {
      id: "demo-order-" + Date.now(),
      ...data,
      user_id: user.id,
      status: "completed",
      created_at: new Date().toISOString(),
    };
    revalidatePath("/orders");
    revalidatePath("/dashboard");
    return demoOrder;
  }

  const supabase = await getSupabaseServerClient();
  
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      game_id: data.gameId,
      game_name: data.gameName,
      package_id: data.packageId,
      package_label: data.packageLabel,
      player_id: data.playerId,
      server_region: data.serverRegion || "",
      amount: data.amount,
      discount: data.discount || 0,
      promo_code: data.promoCode || "",
      payment_method: data.paymentMethod,
      receipt_url: data.receiptUrl || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating order, retrying without foreign keys:", error);
    
    // If it failed because of a foreign key constraint (the user hasn't seeded the games table),
    // we retry inserting the order with game_id and package_id as null.
    // This allows the order to successfully save to the database using just the text labels!
    // Auto-repair: If the user's profile was not created (e.g. trigger failed or they signed up before it was added),
    // we manually upsert their profile right now so the user_id foreign key doesn't fail!
    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || "User",
      avatar_url: user.user_metadata?.avatar_url || "",
      role: "user",
      total_spent: 0,
    });

    const { data: retryOrder, error: retryError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        game_id: null,
        package_id: null,
        game_name: data.gameName,
        package_label: data.packageLabel,
        player_id: data.playerId,
        server_region: data.serverRegion || "",
        amount: data.amount,
        discount: data.discount || 0,
        promo_code: data.promoCode || "",
        payment_method: data.paymentMethod,
        receipt_url: data.receiptUrl || null,
        status: "pending",
      })
      .select()
      .single();

    if (retryError) {
      console.error("Critical error saving order:", retryError);
      throw new Error(`Database Error: ${retryError.message} - ${retryError.details || retryError.hint || ''}`);
    }

    revalidatePath("/orders");
    revalidatePath("/dashboard");
    return retryOrder;
  }

  revalidatePath("/orders");
  revalidatePath("/dashboard");
  return order;
}

export async function getUserOrders() {
  const user = await getUser();
  if (!user) return [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Demo Mode: Fake orders
    return [
      {
        id: "demo-order-1",
        game_name: "PUBG Mobile",
        package_label: "325 UC",
        amount: 4.99,
        status: "completed",
        created_at: new Date().toISOString(),
      },
      {
        id: "demo-order-2",
        game_name: "Free Fire",
        package_label: "520 Diamonds",
        amount: 4.99,
        status: "completed",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
  }

  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
  return data;
}

export async function getOrderById(id: string) {
  const supabase = await getSupabaseServerClient();
  
  // Fetch order and join with profiles to get user info
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles:user_id (
        email,
        full_name
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
  
  // For demo mode or fallback
  if (!data) return null;
  
  return {
    ...data,
    customer_email: data.profiles?.email || "Customer",
    customer_name: data.profiles?.full_name || "Guest"
  };
}
