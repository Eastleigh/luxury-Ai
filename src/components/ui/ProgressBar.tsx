"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  showValue = true,
  color = "bg-luxury-gold",
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-platinum-400">{label}</span>}
          {showValue && (
            <span className="font-medium text-platinum-300">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}
