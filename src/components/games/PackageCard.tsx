"use client";

import { motion } from "framer-motion";
import { Gem, Star, Check } from "lucide-react";
import type { Package } from "@/types";
import { cn } from "@/lib/utils";

interface PackageCardProps {
  pkg: Package;
  selected?: boolean;
  onClick?: () => void;
  index?: number;
}

export function PackageCard({ pkg, selected = false, onClick, index = 0 }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        aria-label={`Select ${pkg.amount} ${pkg.currency} for $${pkg.price.toFixed(2)}`}
        className={cn(
          "relative w-full rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          selected
            ? "border-primary-500 bg-primary-500/10 shadow-[0_0_20px_rgba(14,165,233,0.25)]"
            : "border-white/10 bg-white/[0.03] hover:border-primary-500/40 hover:bg-white/8"
        )}
      >
        {/* Popular badge */}
        {pkg.popular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-xl flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-current" aria-hidden="true" />
            {pkg.label ?? "Popular"}
          </div>
        )}

        {/* Selected check */}
        {selected && (
          <div className="absolute top-2.5 left-2.5 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" aria-hidden="true" />
          </div>
        )}

        <Gem
          className={cn(
            "w-5 h-5 mb-3 transition-colors",
            selected ? "text-primary-400" : "text-gray-500 group-hover:text-primary-400"
          )}
          aria-hidden="true"
        />

        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-xl sm:text-2xl font-black text-white">{pkg.amount}</span>
          <span className="text-xs sm:text-sm text-gray-400">{pkg.currency}</span>
        </div>

        {pkg.bonus && (
          <span className="inline-block text-[10px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full mb-3 border border-emerald-500/20">
            +{pkg.bonus} Bonus
          </span>
        )}

        <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold text-white">${pkg.price.toFixed(2)}</span>
          <span
            className={cn(
              "text-[10px] sm:text-xs font-semibold transition-colors",
              selected ? "text-primary-400" : "text-gray-500 group-hover:text-gray-300"
            )}
          >
            {selected ? "✓ Selected" : "Select"}
          </span>
        </div>
      </button>
    </motion.div>
  );
}
