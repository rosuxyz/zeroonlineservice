"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  positive?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  change,
  positive = true,
  className,
}: StatsCardProps) {
  return (
    <article
      className={cn(
        "glass-card rounded-2xl p-5 sm:p-6 border border-white/5 transition-all duration-300 hover:border-primary-500/25",
        className
      )}
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 shrink-0"
          aria-hidden="true"
        >
          {icon}
        </div>
        {change && (
          <span
            className={cn(
              "text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full",
              positive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            )}
            aria-label={`${positive ? "Increased" : "Decreased"} by ${change}`}
          >
            {positive ? "+" : "−"}{change}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-xs sm:text-sm mb-1">{title}</p>
      <p className="text-xl sm:text-2xl font-extrabold text-white">{value}</p>
    </article>
  );
}
