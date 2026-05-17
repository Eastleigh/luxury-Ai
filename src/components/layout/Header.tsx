"use client";

import { Bell, Search, Settings, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useMounted } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export function Header() {
  const mounted = useMounted();
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Marcus Chen";

  return (
    <motion.header
      initial={mounted ? { y: -10, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a]/80 px-6 backdrop-blur-xl"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-platinum-500" />
          <input
            type="text"
            placeholder="Search points, flights, cards..."
            className="h-9 w-80 rounded-xl border border-white/[0.06] bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder-platinum-500 outline-none transition-all focus:border-luxury-gold/30 focus:ring-1 focus:ring-luxury-gold/20"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-platinum-500">
            /
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-xl p-2 text-platinum-400 transition-colors hover:bg-white/5 hover:text-white">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-luxury-gold" />
        </button>
        <button className="rounded-xl p-2 text-platinum-400 transition-colors hover:bg-white/5 hover:text-white">
          <Settings className="h-[18px] w-[18px]" />
        </button>
        {user ? (
          <div className="ml-2 flex items-center gap-2.5">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-luxury-gold to-[#e0c992]">
                <User className="h-4 w-4 text-black" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-white">{displayName}</p>
                <p className="text-[10px] text-platinum-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="rounded-lg p-2 text-platinum-400 transition-colors hover:bg-white/5 hover:text-white"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="ml-2 flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-1.5 text-xs text-platinum-400 transition-colors hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-luxury-gold px-3 py-1.5 text-xs font-semibold text-black transition-all hover:bg-[#e0c992]"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </motion.header>
  );
}
