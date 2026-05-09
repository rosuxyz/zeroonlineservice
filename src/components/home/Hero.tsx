"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Zap, ChevronRight, Gamepad2, Gem, Coins, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Hero() {
  // Mouse tracking for "Crazy" parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate position relative to center of screen
      const x = (e.clientX - window.innerWidth / 2) / 25;
      const y = (e.clientY - window.innerHeight / 2) / 25;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Transfrom values for different layers
  const driftX = useTransform(springX, (v) => v * -1.5);
  const driftY = useTransform(springY, (v) => v * -1.5);
  const rotateX = useTransform(springY, (v) => v * 0.5);
  const rotateY = useTransform(springX, (v) => v * -0.5);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden group/hero"
      aria-label="Hero section"
    >
      {/* Background blobs — aria-hidden */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-secondary-500/15 rounded-full blur-[100px]" />
        
        {/* Mouse Following Aura */}
        <motion.div 
          style={{ x: springX.get() * 10, y: springY.get() * 10 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-primary-500/10 rounded-full blur-[150px] transition-colors group-hover/hero:bg-primary-400/20" 
        />
        
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

          {/* Right: Visual — Interactive 3D Parallax Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            style={{ x: springX, y: springY, rotateX, rotateY }}
            className="relative hidden lg:flex items-center justify-center perspective-1000"
            aria-hidden="true"
          >
            <div className="relative w-full max-w-md aspect-square transform-style-3d">
              
              {/* Floating Token 1: Diamond */}
              <motion.div
                style={{ x: driftX, y: driftY }}
                animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-32 h-32 glass-card rounded-3xl p-6 z-30 shadow-[0_0_40px_rgba(14,165,233,0.3)] flex items-center justify-center"
              >
                <Gem className="w-16 h-16 text-primary-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
              </motion.div>

              {/* Floating Token 2: Coins */}
              <motion.div
                style={{ x: useTransform(springX, v => v * 1.5), y: useTransform(springY, v => v * 1.5) }}
                animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-4 right-0 w-36 h-36 glass-card rounded-3xl p-6 z-30 shadow-[0_0_40px_rgba(168,85,247,0.3)] flex items-center justify-center"
              >
                <Coins className="w-20 h-20 text-secondary-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              </motion.div>

              {/* Floating Token 3: Trophy */}
              <motion.div
                style={{ x: useTransform(springX, v => v * -2), y: useTransform(springY, v => v * -2) }}
                animate={{ y: [0, -12, 0], rotate: [0, 12, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-8 w-28 h-28 glass-card rounded-3xl p-5 z-30 shadow-[0_0_40px_rgba(234,179,8,0.3)] flex items-center justify-center"
              >
                <Trophy className="w-14 h-14 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
              </motion.div>

              {/* Orbit rings */}
              <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_25s_linear_infinite]" />
              <div className="absolute inset-12 rounded-full border border-primary-500/10 border-dashed animate-[spin_18s_linear_infinite_reverse]" />
              <div className="absolute inset-24 rounded-full border border-secondary-500/10 animate-[spin_30s_linear_infinite]" />

              {/* Center orb */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-56 h-56 bg-[#09090b] rounded-full border-4 border-primary-500 shadow-[0_0_80px_rgba(14,165,233,0.5)] flex items-center justify-center overflow-hidden relative animate-pulse-glow"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/20" />
                  <Gamepad2 className="w-28 h-28 text-primary-400 relative z-10 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)]" />
                  
                  {/* Internal rotating light */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_infinite]" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
