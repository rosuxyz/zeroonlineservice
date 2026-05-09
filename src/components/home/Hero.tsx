"use client";

import { motion } from "framer-motion";
import { Zap, ChevronRight, Gamepad2 } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background blobs — aria-hidden */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-secondary-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-accent-500/8 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card w-max">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-400">
                100% Safe &amp; Secure Delivery
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Instant Game{" "}
              <span className="text-gradient block sm:inline">Top-Ups</span>
            </h1>

            {/* Sub */}
            <p className="text-base sm:text-lg text-gray-400 max-w-lg leading-relaxed">
              Fast, secure, and affordable gaming credits. Elevate your gaming
              experience with instant delivery directly to your account.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/games"
                className="bg-gradient-primary text-white px-6 sm:px-8 py-3.5 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:scale-105 active:scale-95 transition-transform text-sm sm:text-base"
              >
                <Zap className="w-4 h-4 fill-current" aria-hidden="true" />
                Top Up Now
              </Link>
              <Link
                href="/games"
                className="glass text-white px-6 sm:px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-white/10 transition-colors text-sm sm:text-base border border-white/15"
              >
                Explore Games
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-8 pt-6 mt-2 border-t border-white/10">
              {[
                { value: "5M+", label: "Active Users" },
                { value: "100+", label: "Supported Games" },
                { value: "24/7", label: "Support" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</span>
                  <span className="text-xs sm:text-sm text-gray-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual — hidden on mobile/tablet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Floating card — Valorant */}
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 left-4 w-36 h-36 glass-card rounded-2xl p-4 -rotate-12 z-20 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl flex items-center justify-center">
                  <span className="text-purple-300 font-bold text-base text-center leading-snug">Valorant<br />Points</span>
                </div>
              </motion.div>

              {/* Floating card — PUBG */}
              <motion.div
                animate={{ y: [0, 18, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-8 right-4 w-40 h-40 glass-card rounded-2xl p-4 rotate-6 z-20 shadow-[0_0_30px_rgba(14,165,233,0.25)]"
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl flex items-center justify-center">
                  <span className="text-blue-300 font-bold text-base text-center leading-snug">PUBG<br />UC</span>
                </div>
              </motion.div>

              {/* Floating card — Free Fire */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-1/2 -right-2 w-28 h-28 glass-card rounded-2xl p-3 rotate-12 z-20 shadow-[0_0_30px_rgba(234,179,8,0.25)]"
              >
                <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-transparent rounded-xl flex items-center justify-center">
                  <span className="text-yellow-300 font-bold text-sm text-center leading-snug">FF<br />Diamonds</span>
                </div>
              </motion.div>

              {/* Orbit rings */}
              <div className="absolute inset-8 rounded-full border border-white/8 animate-[spin_22s_linear_infinite]" />
              <div className="absolute inset-16 rounded-full border border-primary-500/20 border-dashed animate-[spin_16s_linear_infinite_reverse]" />

              {/* Center orb */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-52 h-52 bg-[#09090b] rounded-full border-4 border-primary-500 shadow-[0_0_60px_rgba(14,165,233,0.4)] flex items-center justify-center overflow-hidden relative animate-pulse-glow">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/15 to-secondary-500/15" />
                  <Gamepad2 className="w-24 h-24 text-primary-400 relative z-10 drop-shadow-[0_0_12px_rgba(14,165,233,0.7)]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
