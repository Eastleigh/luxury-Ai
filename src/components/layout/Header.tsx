"use client";

import { Bell, Search, Settings, User, LogOut, X } from "lucide-react";
import { motion } from "framer-motion";
import { useMounted } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const mounted = useMounted();
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Marcus Chen";

  return (
    <motion.header
      initial={mounted ? { y: -10, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a]/80 px-4 pl-14 lg:pl-6 lg:px-6 backdrop-blur-xl"
    >
      <div className="hidden md:flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-platinum-500" />
          <input
            type="text"
            placeholder="Search points, flights, cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                if (q.includes("card") || q.includes("optim")) window.location.href = "/optimizer";
                else if (q.includes("travel") || q.includes("flight") || q.includes("award")) window.location.href = "/travel";
                else if (q.includes("spend") || q.includes("analy")) window.location.href = "/analyzer";
                else if (q.includes("point") || q.includes("health") || q.includes("expir")) window.location.href = "/health";
                else if (q.includes("account") || q.includes("bank") || q.includes("plaid")) window.location.href = "/accounts";
                else if (q.includes("content") || q.includes("article")) window.location.href = "/content";
                else if (q.includes("client") || q.includes("crm")) window.location.href = "/crm";
                else if (q.includes("price") || q.includes("plan") || q.includes("subscri")) window.location.href = "/pricing";
                else window.location.href = "/analyzer";
              }
            }}
            className="h-9 w-64 lg:w-80 rounded-xl border border-white/[0.06] bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder-platinum-500 outline-none transition-all focus:border-luxury-gold/30 focus:ring-1 focus:ring-luxury-gold/20"
          />
          {searchFocused && searchQuery && (
            <div className="absolute left-0 top-full mt-1 w-full rounded-xl border border-white/[0.08] bg-[#141414] p-2 shadow-xl z-50">
              <p className="px-2 py-1 text-[10px] text-platinum-500">Press Enter to search</p>
              {["Analyzer", "Optimizer", "Travel", "Health", "Accounts", "Content", "CRM", "Pricing"].filter(p => p.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                <button key={p} onClick={() => window.location.href = `/${p.toLowerCase()}`} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-platinum-300 hover:bg-white/[0.05] hover:text-white">
                  <Search className="h-3 w-3" />
                  Go to {p}
                </button>
              ))}
            </div>
          )}
          {!searchFocused && (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-platinum-500">
              /
            </kbd>
          )}
        </div>
      </div>
      <div className="md:hidden" />

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-platinum-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-luxury-gold" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-1 w-72 rounded-xl border border-white/[0.08] bg-[#141414] p-3 shadow-xl z-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-white">Notifications</p>
                <button onClick={() => setShowNotifications(false)} className="text-platinum-500 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {[
                { text: "Transfer bonus: Amex MR to Virgin Atlantic +30%", time: "2h ago", type: "bonus" },
                { text: "892K Hilton points expiring in 14 days", time: "5h ago", type: "alert" },
                { text: "New award availability: JFK-NRT Business", time: "1d ago", type: "travel" },
              ].map((n, i) => (
                <div key={i} className="flex gap-2 rounded-lg p-2 text-xs hover:bg-white/[0.04] cursor-pointer" onClick={() => {
                  setShowNotifications(false);
                  if (n.type === "bonus" || n.type === "alert") window.location.href = "/health";
                  else window.location.href = "/travel";
                }}>
                  <div className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${n.type === "alert" ? "bg-red-400" : "bg-luxury-gold"}`} />
                  <div>
                    <p className="text-platinum-300">{n.text}</p>
                    <p className="text-[10px] text-platinum-500 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <Link href="/health" className="mt-2 block rounded-lg bg-white/[0.03] px-2 py-1.5 text-center text-[10px] text-platinum-400 hover:text-white">
                View all alerts
              </Link>
            </div>
          )}
        </div>
        <Link href="/admin" className="rounded-xl p-2 text-platinum-400 transition-colors hover:bg-white/5 hover:text-white">
          <Settings className="h-[18px] w-[18px]" />
        </Link>
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
