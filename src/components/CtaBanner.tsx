"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-24 relative px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden p-8 md:p-16 text-center shadow-[0_0_50px_rgba(14,165,233,0.2)]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-indigo-900/80 to-secondary-900/80 z-0" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 mix-blend-overlay z-0" />
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Ready to Dominate?</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Level Up Your Game <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Right Now</span>
            </h2>
            
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl">
              Join millions of gamers who trust TopUp Hub for their instant gaming credits. No hidden fees, no waiting.
            </p>
            
            <button className="bg-white text-primary-900 px-10 py-4 rounded-full font-black text-lg shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] transition-all duration-300">
              Start Topping Up
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
