"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GameCard } from "@/components/games/GameCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGames } from "@/lib/actions/games";
import type { GameCategory } from "@/types";
import { Gamepad2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: "all" | GameCategory; label: string }[] = [
  { value: "all", label: "All Games" },
  { value: "battle-royale", label: "Battle Royale" },
  { value: "moba", label: "MOBA" },
  { value: "fps", label: "FPS" },
  { value: "rpg", label: "RPG" },
  { value: "other", label: "Other" },
];

export default function GamesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | GameCategory>("all");
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGames().then((data) => {
      setGames(data || []);
      setLoading(false);
    }).catch((e) => {
      console.error(e);
      setGames([]);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return games.filter((g) => {
      const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "all" || g.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory, games]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30" />
        </div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="All Games"
            title="Choose Your"
            highlight="Game"
            subtitle="Browse our full catalog of top-up services. Select your game and get credits in seconds."
          />

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search games..."
              className="w-full sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                    activeCategory === cat.value
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              <p className="text-gray-400">Loading games...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <Gamepad2 className="w-16 h-16 text-gray-700" />
              <p className="text-gray-400 text-lg">No games found for "{search}"</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("all"); }}
                className="text-primary-400 hover:underline text-sm"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
