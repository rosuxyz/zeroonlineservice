"use client";

import { useState, use, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PackageCard } from "@/components/games/PackageCard";
import { GameCard } from "@/components/games/GameCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGameBySlug, getPackagesByGameId, getGames } from "@/lib/actions/games";
import { useCartStore } from "@/lib/store";
import { Star, Users, ShieldCheck, Zap, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const REGIONS = ["Global", "NA", "EU", "SEA", "JP", "KR"];

export default function GameDetailPage(props: PageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        </div>
        <Footer />
      </div>
    }>
      <GameDetailContent {...props} />
    </Suspense>
  );
}

function GameDetailContent({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const searchParams = useSearchParams();
  const pkgIdParam = searchParams.get("packageId");

  const {
    selectedPackage,
    playerId,
    serverRegion,
    setSelectedPackage,
    setSelectedGame,
    setPlayerId,
    setServerRegion,
  } = useCartStore();

  const [gameNameInput, setGameNameInput] = useState("");
  const [uidInput, setUidInput] = useState("");
  const [regionInput, setRegionInput] = useState(serverRegion || "Global");

  const [game, setGame] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [relatedGames, setRelatedGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        setLoading(true);
        // 1. Fetch basic game info and all games list in parallel
        const [fetchedGame, allGames] = await Promise.all([
          getGameBySlug(slug),
          getGames()
        ]);

        if (fetchedGame) {
          setGame(fetchedGame);
          
          // 2. Fetch packages for this game
          const pkgs = await getPackagesByGameId(fetchedGame.id);
          setPackages(pkgs);
          
          // 3. Set related games
          setRelatedGames(allGames.filter((g) => g.id !== fetchedGame.id).slice(0, 3));
          
          // Fix: Clear selected package if it belongs to a different game
          if (
            selectedPackage && 
            selectedPackage.gameId !== fetchedGame.id && 
            (selectedPackage as any).game_id !== fetchedGame.id
          ) {
            setSelectedPackage(null);
          }

          // Handle pre-selected package from URL (using the already fetched pkgs)
          if (pkgIdParam) {
            const preselected = pkgs.find(p => p.id === pkgIdParam);
            if (preselected) {
              setSelectedPackage(preselected as any);
            }
          }
        }
      } catch (err) {
        console.error("Error loading game data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, [slug, pkgIdParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
          <p className="text-gray-400">Loading game details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Render a not-found UI rather than calling notFound() conditionally
  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-4 text-center pt-20">
          <AlertCircle className="w-16 h-16 text-gray-600" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-white">Game Not Found</h1>
          <p className="text-gray-400 max-w-md">
            We couldn&apos;t find a game with that slug. Please check the URL or browse our game catalog.
          </p>
          <Link href="/games">
            <Button variant="primary">Browse Games</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const needsServer = ["pubg-mobile", "mobile-legends"].includes(game.id);

  const handleBuyNow = () => {
    if (!selectedPackage) return;
    setSelectedGame(game);
    // Combine in-game name and UID so existing data model is unchanged
    const combined = uidInput.trim()
      ? `${gameNameInput.trim()} | UID: ${uidInput.trim()}`
      : gameNameInput.trim();
    setPlayerId(combined);
    setServerRegion(regionInput);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Game Banner */}
      <section className="relative pt-20 min-h-[38vh] flex items-end overflow-hidden" aria-label={`${game.name} banner`}>
        {game.banner_url ? (
          <div className="absolute inset-0">
            <img 
              src={game.banner_url} 
              alt="" 
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        ) : (
          <>
            <div
              className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-25`}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" aria-hidden="true" />
          </>
        )}
        
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full blur-[130px] opacity-25 pointer-events-none"
          style={{ background: game.accentColor }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 pb-8 pt-28 sm:pt-36">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {game.image_url ? (
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border border-white/10 overflow-hidden shrink-0 shadow-2xl relative z-10">
                <img src={game.image_url} alt={game.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-3xl sm:text-5xl font-black text-white border border-white/20 shrink-0 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative z-10"
                style={{
                  background: `linear-gradient(135deg, ${game.accent_color}dd, ${game.accent_color}66)`,
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                <span className="relative z-10">{game.short_name}</span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {game.category}
                </span>
                {game.featured && (
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
                {game.name}
              </h1>
              <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  {game.rating}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  {game.players} players
                </span>
                <span>By {game.publisher}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Packages */}
            <div className="lg:col-span-2">
              <div className="mb-5">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Select Package</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{game.long_description}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {packages.map((pkg, i) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={i}
                    selected={selectedPackage?.id === pkg.id}
                    onClick={() =>
                      setSelectedPackage(selectedPackage?.id === pkg.id ? null : pkg)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Order Form */}
            <aside className="lg:col-span-1" aria-label="Order form">
              <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 lg:sticky lg:top-24">
                <h3 className="text-base sm:text-lg font-bold text-white mb-5">
                  Player Information
                </h3>

                <div className="flex flex-col gap-5">
                  {/* In-Game Name */}
                  <div>
                    <label
                      htmlFor="game-name"
                      className="block text-sm font-semibold text-gray-300 mb-2"
                    >
                      In-Game Name{" "}
                      <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <input
                      id="game-name"
                      type="text"
                      value={gameNameInput}
                      onChange={(e) => setGameNameInput(e.target.value)}
                      placeholder="Your in-game username"
                      aria-required="true"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                  </div>

                  {/* UID */}
                  <div>
                    <label
                      htmlFor="player-uid"
                      className="block text-sm font-semibold text-gray-300 mb-2"
                    >
                      UID{" "}
                      <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <input
                      id="player-uid"
                      type="text"
                      inputMode="numeric"
                      value={uidInput}
                      onChange={(e) => setUidInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter your UID (numbers only)"
                      aria-required="true"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20 transition-all font-mono tracking-wider"
                    />
                  </div>

                  {needsServer && (
                    <fieldset>
                      <legend className="block text-sm font-semibold text-gray-300 mb-2">
                        Server Region
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {REGIONS.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRegionInput(r)}
                            aria-pressed={regionInput === r}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                              regionInput === r
                                ? "bg-primary-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.4)]"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                            )}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {/* Package summary */}
                  {selectedPackage ? (
                    <div
                      className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4"
                      role="status"
                      aria-live="polite"
                    >
                      <p className="text-xs text-gray-400 mb-1">Selected Package</p>
                      <p className="text-white font-bold text-lg">
                        {selectedPackage.amount} {selectedPackage.currency}
                      </p>
                      {selectedPackage.bonus && (
                        <p className="text-emerald-400 text-xs mt-0.5">+{selectedPackage.bonus} Bonus</p>
                      )}
                      <p className="text-primary-400 font-bold text-xl mt-2">
                        ${selectedPackage.price.toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-dashed border-white/15 rounded-xl p-4 text-center">
                      <p className="text-gray-500 text-sm">Select a package to continue</p>
                    </div>
                  )}

                  <p className="flex items-center gap-2 text-xs text-gray-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                    Secure &amp; instant delivery guaranteed
                  </p>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={!selectedPackage || !gameNameInput.trim() || !uidInput.trim()}
                    onClick={handleBuyNow}
                  >
                    <Zap className="w-4 h-4 fill-current" aria-hidden="true" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Games */}
          <div className="mt-16 sm:mt-24">
            <SectionHeading title="Related" highlight="Games" center={false} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedGames.map((g, i) => (
                <GameCard key={g.id} game={g} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
