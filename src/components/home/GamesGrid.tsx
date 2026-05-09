"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Flame, Loader2 } from "lucide-react";
import Link from "next/link";
import { getFeaturedGames } from "@/lib/actions/games";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 22 } },
};

export default function GamesGrid() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedGames().then((data: any[]) => {
      setGames(data || []);
      setLoading(false);
    }).catch((e) => {
      console.error(e);
      setGames([]);
      setLoading(false);
    });
  }, []);

  return (
    <section id="games" className="py-16 sm:py-24 relative overflow-hidden" aria-label="Featured games">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[130px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section header */}
        <div className="flex flex-col items-center mb-10 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 mb-4">
            <Flame className="w-4 h-4 text-orange-500" aria-hidden="true" />
            <span className="text-sm font-semibold text-gray-300">Trending Now</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3">
            Popular <span className="text-gradient">Games</span>
          </h2>
          <p className="text-gray-400 max-w-xl text-sm sm:text-base leading-relaxed">
            Choose from our wide selection of popular games and services. Instant delivery guaranteed.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          </div>
        ) : (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 list-none p-0"
          >
            {games.map((game) => (
              <motion.li key={game.id} variants={itemVariants}>
                <Link
                  href={`/games/${game.slug}`}
                  className="group block glass-card rounded-2xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 hover:-translate-y-1.5 transition-transform duration-300"
                  aria-label={`Top up ${game.name}`}
                >
                  {/* Banner */}
                  <div className={`w-full aspect-square bg-gradient-to-br ${game.gradient || 'from-gray-700 to-gray-900'} relative overflow-hidden flex items-center justify-center`}>
                    {game.banner_url || game.bannerUrl ? (
                      <img 
                        src={game.banner_url || game.bannerUrl} 
                        alt={game.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <span
                        className="text-4xl sm:text-5xl font-black text-white/30 tracking-tighter -rotate-12 group-hover:scale-110 transition-transform duration-500 select-none"
                        aria-hidden="true"
                      >
                        {game.short_name || game.shortName}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-300" aria-hidden="true" />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#18181b] to-transparent" aria-hidden="true" />
                  </div>

                  {/* Text */}
                  <div className="p-3 sm:p-4 bg-[#18181b] z-10 relative">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-primary-400 transition-colors leading-tight">
                      {game.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{game.description}</p>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* CTA */}
        <div className="mt-10 sm:mt-14 flex justify-center">
          <Link
            href="/games"
            className="glass px-6 sm:px-8 py-3 rounded-full text-white text-sm sm:text-base font-semibold hover:bg-white/10 transition-colors border border-white/15 hover:border-primary-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            View All Games
          </Link>
        </div>
      </div>
    </section>
  );
}
