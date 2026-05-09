"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Game } from "@/types";
import { Users, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  index?: number;
}

export function GameCard({ game, index = 0 }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.4) }}
      className="h-full"
    >
      <Link
        href={`/games/${game.slug}`}
        className="block group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl"
        aria-label={`Top up ${game.name}`}
      >
        <div className="relative glass-card rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:-translate-y-1.5">
          <div
            className={cn(
              "relative w-full h-40 sm:h-44 bg-gradient-to-br flex items-center justify-center overflow-hidden shrink-0",
              game.gradient
            )}
          >
            {game.banner_url || game.bannerUrl ? (
              <img 
                src={game.banner_url || game.bannerUrl} 
                alt={game.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <span
                className="text-5xl sm:text-6xl font-black text-white/25 tracking-tighter -rotate-12 group-hover:scale-110 group-hover:text-white/35 transition-all duration-500 select-none"
                aria-hidden="true"
              >
                {game.shortName || game.short_name}
              </span>
            )}
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-300" />
            
            {game.featured && (
              <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full z-10">
                Featured
              </div>
            )}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#18181b] to-transparent z-10" />
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-primary-400 transition-colors leading-tight">
                {game.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">{game.description}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/5 mt-auto">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" aria-hidden="true" />
                <span>{game.players}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                <span>{game.rating}</span>
              </div>
              <span className="text-primary-400 font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                Top Up <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
