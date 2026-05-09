import type { Game } from "@/types";

export const games: Game[] = [
  {
    id: "free-fire",
    slug: "free-fire",
    name: "Free Fire",
    description: "Top up Diamonds instantly",
    longDescription:
      "Garena Free Fire is a battle royale game with intense survival gameplay. Upgrade your experience with Diamonds – the in-game currency used for elite passes, skins, characters, and more.",
    category: "battle-royale",
    gradient: "from-yellow-500 to-orange-600",
    shadowColor: "rgba(234,179,8,0.4)",
    bgColor: "yellow",
    accentColor: "#f59e0b",
    shortName: "FF",
    publisher: "Garena",
    rating: 4.6,
    players: "150M+",
    featured: true,
    imageUrl: "/games/free-fire-logo.png",
    bannerUrl: "/games/free-fire-banner.png"
  },
  {
    id: "pubg-mobile",
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    description: "Get UC in seconds",
    longDescription:
      "PLAYERUNKNOWN'S BATTLEGROUNDS Mobile is the iconic battle royale experience on mobile. Use UC (Unknown Cash) to buy Royal Pass seasons, costumes, weapon skins, and exclusive items.",
    category: "battle-royale",
    gradient: "from-blue-500 to-cyan-500",
    shadowColor: "rgba(59,130,246,0.4)",
    bgColor: "blue",
    accentColor: "#3b82f6",
    shortName: "PUBG",
    publisher: "Krafton",
    rating: 4.5,
    players: "100M+",
    featured: true,
    imageUrl: "/games/pubg-logo.png",
    bannerUrl: "/games/pubg-banner.png"
  },
  {
    id: "mobile-legends",
    slug: "mobile-legends",
    name: "Mobile Legends",
    description: "Instant Diamonds delivery",
    longDescription:
      "Mobile Legends: Bang Bang is a multiplayer online battle arena game. Diamonds are used to purchase heroes, skins, and other in-game content to dominate the Land of Dawn.",
    category: "moba",
    gradient: "from-indigo-500 to-purple-600",
    shadowColor: "rgba(99,102,241,0.4)",
    bgColor: "indigo",
    accentColor: "#6366f1",
    shortName: "MLBB",
    publisher: "Moonton",
    rating: 4.4,
    players: "80M+",
    featured: true,
    imageUrl: "/games/mlbb-logo.png",
    bannerUrl: "/games/mlbb-banner.png"
  },
  {
    id: "valorant",
    slug: "valorant",
    name: "Valorant",
    description: "Buy Valorant Points",
    longDescription:
      "Valorant is a tactical first-person shooter from Riot Games. Valorant Points (VP) unlock Agent contracts, weapon skins, and premium battle passes to express your style.",
    category: "fps",
    gradient: "from-red-500 to-rose-600",
    shadowColor: "rgba(239,68,68,0.4)",
    bgColor: "red",
    accentColor: "#ef4444",
    shortName: "VAL",
    publisher: "Riot Games",
    rating: 4.7,
    players: "25M+",
    featured: true,
    imageUrl: "/games/valorant-logo.png",
    bannerUrl: "/games/valorant-banner.png"
  },
  {
    id: "genshin-impact",
    slug: "genshin-impact",
    name: "Genshin Impact",
    description: "Genesis Crystals & Welkin",
    longDescription:
      "Genshin Impact is an open-world action RPG. Genesis Crystals convert to Primogems for Wishes (gacha), helping you unlock powerful characters and weapons across the continent of Teyvat.",
    category: "rpg",
    gradient: "from-teal-500 to-emerald-500",
    shadowColor: "rgba(20,184,166,0.4)",
    bgColor: "teal",
    accentColor: "#14b8a6",
    shortName: "GI",
    publisher: "HoYoverse",
    rating: 4.8,
    players: "50M+",
    featured: false,
    bannerUrl: "/games/banner-generic.png"
  },
  {
    id: "steam",
    slug: "steam-wallet",
    name: "Steam Wallet",
    description: "Global & Regional Codes",
    longDescription:
      "Steam is the world's premier PC gaming platform. Steam Wallet codes let you add funds to your Steam account to purchase games, DLC, in-game items, and software from any region.",
    category: "other",
    gradient: "from-slate-600 to-slate-800",
    shadowColor: "rgba(100,116,139,0.4)",
    bgColor: "slate",
    accentColor: "#64748b",
    shortName: "STEAM",
    publisher: "Valve",
    rating: 4.9,
    players: "130M+",
    featured: false,
    bannerUrl: "/games/banner-generic.png"
  },
];

export const getCategoryLabel = (cat: string) => {
  const map: Record<string, string> = {
    "battle-royale": "Battle Royale",
    moba: "MOBA",
    fps: "FPS",
    rpg: "RPG",
    other: "Other",
  };
  return map[cat] ?? cat;
};
