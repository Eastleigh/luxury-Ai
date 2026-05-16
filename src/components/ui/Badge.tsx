import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "gold" | "info";
  size?: "sm" | "md";
}

const variantStyles = {
  default: "bg-white/5 text-platinum-300 border-white/10",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  gold: "bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variantStyles[variant],
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      )}
    >
      {children}
    </span>
  );
}
