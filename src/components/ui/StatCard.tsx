"use client";

import { cn, useMounted } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  iconColor = "text-luxury-gold",
  delay = 0,
}: StatCardProps) {
  const mounted = useMounted();

  return (
    <motion.div
      initial={mounted ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-5 glass-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-platinum-400">
            {label}
          </p>
          <p className="stat-value text-2xl font-bold text-white">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-emerald-400" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up" ? "text-emerald-400" : "text-red-400"
                )}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "rounded-xl p-2.5",
            "bg-gradient-to-br from-white/5 to-white/[0.02]"
          )}
        >
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}
