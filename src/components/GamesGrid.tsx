"use client";

import { motion, Variants } from "framer-motion";
import { Flame } from "lucide-react";
import Image from "next/image";

const games = [
  {
    id: 1,
    name: "Free Fire",
    description: "Top up Diamonds instantly",
    color: "from-yellow-500 to-orange-500",
    shadow: "hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]",
    shortName: "FF",
  },
  {
    id: 2,
    name: "PUBG Mobile",
    description: "Get UC in seconds",
    color: "from-blue-500 to-cyan-500",
    shadow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]",
    shortName: "PUBG",
  },
  {
    id: 3,
    name: "Mobile Legends",
    description: "Instant Diamonds delivery",
    color: "from-indigo-500 to-purple-500",
    shadow: "hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]",
    shortName: "MLBB",
  },
  {
    id: 4,
    name: "Valorant",
    description: "Buy Valorant Points",
    color: "from-red-500 to-rose-500",
    shadow: "hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]",
    shortName: "VAL",
  },
  {
    id: 5,
    name: "Genshin Impact",
    description: "Genesis Crystals & Welkin",
    color: "from-teal-500 to-emerald-500",
    shadow: "hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]",
    shortName: "GI",
  },
  {
    id: 6,
    name: "Steam Wallet",
    description: "Global & Regional Codes",
    color: "from-slate-700 to-slate-900",
    shadow: "hover:shadow-[0_0_30px_rgba(100,116,139,0.4)]",
    shortName: "STEAM",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function GamesGrid() {
  return (
    <section id="games" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/10 mb-4">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-300">Trending Now</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Popular <span className="text-gradient">Games</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl">
            Choose from our wide selection of popular games and services. Instant delivery guaranteed.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={item}>
              <div 
                className={`group glass-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${game.shadow} hover:-translate-y-2 h-full flex flex-col`}
              >
                {/* Image Placeholder */}
                <div className={`w-full aspect-[3/4] bg-gradient-to-br ${game.color} relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                  <span className="text-5xl font-black text-white/50 tracking-tighter transform -rotate-12 group-hover:scale-110 transition-transform duration-500">
                    {game.shortName}
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#18181b] to-transparent" />
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-end bg-[#18181b] z-10 -mt-4 relative rounded-t-xl border-t border-white/10">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {game.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 flex justify-center">
          <button className="glass px-8 py-3 rounded-full text-white font-medium hover:bg-white/10 transition-colors border border-white/20 hover:border-primary-500/50">
            View All Games
          </button>
        </div>
      </div>
    </section>
  );
}
