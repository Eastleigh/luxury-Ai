"use client";

import { cn, useMounted } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  delay = 0,
}: GlassCardProps) {
  const mounted = useMounted();

  return (
    <motion.div
      initial={mounted ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "glass-card rounded-2xl p-6",
        hover && "glass-hover transition-all duration-300",
        glow && "luxury-glow",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
