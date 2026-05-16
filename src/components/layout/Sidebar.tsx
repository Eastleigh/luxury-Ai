"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  Plane,
  ShieldAlert,
  FileText,
  Crown,
  Users,
  ChevronLeft,
  ChevronRight,
  Gem,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyzer", label: "Spend Analyzer", icon: BarChart3 },
  { href: "/optimizer", label: "Card Optimizer", icon: CreditCard },
  { href: "/travel", label: "Travel & Awards", icon: Plane },
  { href: "/health", label: "Points Health", icon: ShieldAlert },
  { href: "/content", label: "Content Engine", icon: FileText },
  { href: "/pricing", label: "Membership", icon: Crown },
  { href: "/crm", label: "CRM & Clients", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.06] bg-[#0c0c0c]",
        "transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-gold to-[#e0c992] shadow-lg shadow-luxury-gold/20">
            <Gem className="h-5 w-5 text-black" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="text-base font-bold tracking-tight text-white">
                Luxury<span className="gold-gradient">AI</span>
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-platinum-500">
                Spend Intelligence
              </span>
            </motion.div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-platinum-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-luxury-gold/10 text-luxury-gold"
                  : "text-platinum-400 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                  isActive
                    ? "text-luxury-gold"
                    : "text-platinum-500 group-hover:text-white"
                )}
              />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeTab"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-luxury-gold"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        {!collapsed && (
          <div className="glass rounded-xl p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">
              Current Plan
            </p>
            <p className="mt-1 text-sm font-semibold text-white">Professional</p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-luxury-gold to-[#e0c992]" />
            </div>
            <p className="mt-1.5 text-[10px] text-platinum-500">
              18 of 24 days remaining
            </p>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
