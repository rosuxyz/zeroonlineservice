"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { games as mockGames } from "@/data/games";
import { packages as mockPackages } from "@/data/packages";

// Helper to normalize data so components work with both DB data and mock data
function mapGame(dbGame: any) {
  if (!dbGame) return null;
  const mockFallback = mockGames.find(g => g.id === dbGame.id || g.slug === dbGame.slug);
  
  return {
    ...dbGame,
    shortName: dbGame.short_name || dbGame.shortName || mockFallback?.shortName,
    accentColor: dbGame.accent_color || dbGame.accentColor || mockFallback?.accentColor,
    longDescription: dbGame.long_description || dbGame.longDescription || mockFallback?.longDescription,
    imageUrl: dbGame.image_url || dbGame.imageUrl || mockFallback?.imageUrl,
    bannerUrl: dbGame.banner_url || dbGame.bannerUrl || mockFallback?.bannerUrl,
    // Add aliases to satisfy components expecting snake_case
    short_name: dbGame.short_name || dbGame.shortName || mockFallback?.shortName,
    accent_color: dbGame.accent_color || dbGame.accentColor || mockFallback?.accentColor,
    long_description: dbGame.long_description || dbGame.longDescription || mockFallback?.longDescription,
    image_url: dbGame.image_url || dbGame.imageUrl || mockFallback?.imageUrl,
    banner_url: dbGame.banner_url || dbGame.bannerUrl || mockFallback?.bannerUrl,
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

const PREFERRED_ORDER = ["free-fire", "pubg-mobile", "mobile-legends", "valorant", "genshin-impact", "steam-wallet"];

function sortGames(games: any[]) {
  return [...games].sort((a, b) => {
    const indexA = PREFERRED_ORDER.indexOf(a.slug);
    const indexB = PREFERRED_ORDER.indexOf(b.slug);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

export async function getGames() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("active", true);

    if (error || !data || data.length === 0) return sortGames(mockGames.map(mapGame));
    return sortGames(data.map(mapGame));
  } catch (e) {
    return sortGames(mockGames.map(mapGame));
  }
}

export async function getFeaturedGames() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("active", true)
      .eq("featured", true);

    if (error || !data || data.length === 0) {
      return sortGames(mockGames.filter((g) => g.featured).map(mapGame));
    }
    return sortGames(data.map(mapGame));
  } catch (e) {
    return sortGames(mockGames.filter((g) => g.featured).map(mapGame));
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
