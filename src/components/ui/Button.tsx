import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variantStyles = {
  primary:
    "bg-white text-black hover:bg-platinum-200 shadow-lg shadow-white/5",
  secondary:
    "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
  ghost: "text-platinum-400 hover:text-white hover:bg-white/5",
  gold: "bg-gradient-to-r from-luxury-gold to-[#e0c992] text-black font-semibold hover:opacity-90 shadow-lg shadow-luxury-gold/20",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
        variantStyles[variant],
        sizeStyles[size],
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
