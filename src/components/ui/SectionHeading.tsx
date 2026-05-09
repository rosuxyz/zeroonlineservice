"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeading({ badge, title, highlight, subtitle, center = true, className }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("flex flex-col gap-3 mb-12", center && "items-center text-center", className)}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-semibold uppercase tracking-wider text-primary-400 w-max">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
        {title}{" "}
        {highlight && <span className="text-gradient">{highlight}</span>}
      </h2>
      {subtitle && <p className="text-gray-400 max-w-2xl text-base md:text-lg">{subtitle}</p>}
    </motion.div>
  );
}
