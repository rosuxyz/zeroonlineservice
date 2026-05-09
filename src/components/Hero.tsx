"use client";

import { motion } from "framer-motion";
import { Zap, ChevronRight, Gamepad2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/actions/admin";
import Image from "next/image";

export default function Hero() {
  const [hero, setHero] = useState({ 
    title: "Instant Game Top-Ups", 
    subtitle: "Fast, secure, and affordable gaming credits. Elevate your gaming experience with instant delivery to your account." 
  });

  useEffect(() => {
    getSiteSettings("hero").then(data => {
      if (data) setHero(data as { title: string; subtitle: string });
    });
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card w-max border-primary-500/30">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
              <span className="text-sm font-medium text-primary-400">100% Safe & Secure Delivery</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              {hero.title.split('Top-Ups')[0]}
              <span className="text-gradient">{hero.title.includes('Top-Ups') ? 'Top-Ups' : ''}</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
              {hero.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button className="bg-gradient-primary text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-current" />
                Top Up Now
              </button>
              <button className="glass text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">
                Explore Games
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">5M+</span>
                <span className="text-sm text-gray-400">Active Users</span>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">100+</span>
                <span className="text-sm text-gray-400">Supported Games</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              {/* Floating Game Elements - using Framer Motion to float */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 w-40 h-40 glass-card rounded-2xl p-4 transform -rotate-12 z-20 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-xl text-center">Valorant<br/>Points</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 right-10 w-48 h-48 glass-card rounded-2xl p-4 transform rotate-6 z-20 shadow-[0_0_30px_rgba(14,165,233,0.3)]"
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-xl text-center">PUBG<br/>UC</span>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-1/2 right-0 w-32 h-32 glass-card rounded-2xl p-4 transform rotate-12 z-20 shadow-[0_0_30px_rgba(234,179,8,0.3)]"
              >
                <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-transparent rounded-xl flex items-center justify-center">
                  <span className="text-yellow-400 font-bold text-lg text-center">FF<br/>Diamonds</span>
                </div>
              </motion.div>

              {/* Main Center Piece */}
              <div className="absolute inset-10 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-20 rounded-full border border-primary-500/30 border-dashed animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-64 h-64 bg-black rounded-full border-4 border-primary-500 shadow-[0_0_50px_rgba(14,165,233,0.5)] flex items-center justify-center overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/20" />
                   <Gamepad2 className="w-32 h-32 text-primary-500 relative z-10 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
