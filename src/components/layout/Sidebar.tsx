"use client";

import { cn, useMounted } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Menu,
  X,
  Building2,
  Shield,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: Building2 },
  { href: "/analyzer", label: "Spend Analyzer", icon: BarChart3 },
  { href: "/optimizer", label: "Card Optimizer", icon: CreditCard },
  { href: "/travel", label: "Travel & Awards", icon: Plane },
  { href: "/health", label: "Points Health", icon: ShieldAlert },
  { href: "/content", label: "Content Engine", icon: FileText },
  { href: "/pricing", label: "Membership", icon: Crown },
  { href: "/crm", label: "CRM & Clients", icon: Users },
  { href: "/admin", label: "Admin", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useMounted();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-[#0c0c0c] p-2 text-platinum-400 border border-white/[0.06] lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
      initial={mounted ? { x: -20, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/[0.06] bg-[#0c0c0c]",
        "transition-all duration-300",
        collapsed ? "lg:w-[72px]" : "lg:w-[260px]",
        "w-[260px]",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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
                Mava<span className="gold-gradient">ree</span>
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-platinum-500">
                Spend Intelligence
              </span>
            </motion.div>
          )}
        </Link>
        {/* Close button on mobile */}
        <button
          onClick={closeMobile}
          className="rounded-lg p-1.5 text-platinum-500 hover:bg-white/5 hover:text-white transition-colors lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
        {/* Collapse toggle on desktop */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:block rounded-lg p-1.5 text-platinum-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3 overflow-y-auto">
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
    </>
  );
}
