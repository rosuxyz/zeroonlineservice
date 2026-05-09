"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { games as mockGames } from "@/data/games";
import { packages as mockPackages } from "@/data/packages";

// Helper to normalize data so components work with both DB data and mock data
function mapGame(dbGame: any) {
  if (!dbGame) return null;
  return {
    ...dbGame,
    shortName: dbGame.short_name || dbGame.shortName,
    accentColor: dbGame.accent_color || dbGame.accentColor,
    longDescription: dbGame.long_description || dbGame.longDescription,
    // Add aliases to satisfy components expecting snake_case
    short_name: dbGame.short_name || dbGame.shortName,
    accent_color: dbGame.accent_color || dbGame.accentColor,
    long_description: dbGame.long_description || dbGame.longDescription,
  };
}

function mapPackage(dbPkg: any) {
  if (!dbPkg) return null;
  return {
    ...dbPkg,
    gameId: dbPkg.game_id || dbPkg.gameId,
    // Aliases
    game_id: dbPkg.game_id || dbPkg.gameId,
  };
}

export async function getGames() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return mockGames.map(mapGame);
    return data.map(mapGame);
  } catch (e) {
    return mockGames.map(mapGame);
  }
}

export async function getFeaturedGames() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("active", true)
      .eq("featured", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return mockGames.filter((g) => g.featured).map(mapGame);
    }
    return data.map(mapGame);
  } catch (e) {
    return mockGames.filter((g) => g.featured).map(mapGame);
  }
}

export async function getGameBySlug(slug: string) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (error || !data) return mapGame(mockGames.find((g) => g.slug === slug));
    return mapGame(data);
  } catch (e) {
    return mapGame(mockGames.find((g) => g.slug === slug));
  }
}

export async function getPackagesByGameId(gameId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("game_id", gameId)
      .eq("active", true)
      .order("price", { ascending: true });

    if (error || !data || data.length === 0) {
      return mockPackages
        .filter((p) => p.gameId === gameId || (p as any).game_id === gameId)
        .map(mapPackage);
    }
    return data.map(mapPackage);
  } catch (e) {
    return mockPackages
      .filter((p) => p.gameId === gameId || (p as any).game_id === gameId)
      .map(mapPackage);
  }
}
