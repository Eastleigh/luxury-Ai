"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import {
  Users,
  DollarSign,
  Building2,
  Crown,
  Shield,
  RefreshCw,
  Mail,
  Calendar,
  CreditCard,
} from "lucide-react";
import { formatCurrency, useMounted } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  plan: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  connected_accounts: number;
  institutions: string[];
  created_at: string;
  last_sign_in: string | null;
}

interface AdminStats {
  totalUsers: number;
  proUsers: number;
  execUsers: number;
  freeUsers: number;
  connectedBanks: number;
  mrr: number;
}

export default function AdminPage() {
  const mounted = useMounted();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setUsers(data.users);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const planColors: Record<string, "gold" | "info" | "default"> = {
    executive: "gold",
    professional: "info",
    free: "default",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            <Shield className="mr-2 inline h-6 w-6 text-luxury-gold" />
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-platinum-400">
            Manage users, subscriptions, and connected accounts.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-platinum-400 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <GlassCard>
          <div className="flex items-center gap-3 text-red-400">
            <Shield className="h-5 w-5" />
            <div>
              <p className="font-medium">Access Denied or Error</p>
              <p className="text-sm text-platinum-400">{error}</p>
              <p className="mt-1 text-xs text-platinum-500">
                Add your email to the ADMIN_EMAILS environment variable to access this page.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={stats.totalUsers.toString()}
            change={`${stats.proUsers + stats.execUsers} paid`}
            trend="up"
            icon={Users}
            delay={0.1}
          />
          <StatCard
            label="Monthly Revenue"
            value={formatCurrency(stats.mrr)}
            change="MRR"
            trend="up"
            icon={DollarSign}
            iconColor="text-emerald-400"
            delay={0.15}
          />
          <StatCard
            label="Connected Banks"
            value={stats.connectedBanks.toString()}
            change="via Plaid"
            trend="up"
            icon={Building2}
            iconColor="text-blue-400"
            delay={0.2}
          />
          <StatCard
            label="Plan Distribution"
            value={`${stats.proUsers}/${stats.execUsers}`}
            change="Pro / Executive"
            trend="up"
            icon={Crown}
            iconColor="text-luxury-gold"
            delay={0.25}
          />
        </div>
      )}

      {/* Revenue Breakdown */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <GlassCard delay={0.3}>
            <p className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">Free Users</p>
            <p className="mt-1 text-2xl font-bold text-white">{stats.freeUsers}</p>
            <p className="text-xs text-platinum-400">$0/mo each</p>
          </GlassCard>
          <GlassCard delay={0.35}>
            <p className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">Professional</p>
            <p className="mt-1 text-2xl font-bold text-blue-400">{stats.proUsers}</p>
            <p className="text-xs text-platinum-400">$79/mo each = {formatCurrency(stats.proUsers * 79)}/mo</p>
          </GlassCard>
          <GlassCard delay={0.4}>
            <p className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">Executive</p>
            <p className="mt-1 text-2xl font-bold text-luxury-gold">{stats.execUsers}</p>
            <p className="text-xs text-platinum-400">$499/mo each = {formatCurrency(stats.execUsers * 499)}/mo</p>
          </GlassCard>
        </div>
      )}

      {/* User List */}
      {users.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-white">All Users</h2>
          {users.map((user, i) => (
            <motion.div
              key={user.id}
              initial={mounted ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-luxury-gold/20 hover:bg-white/[0.04]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5">
                    <span className="text-sm font-semibold text-luxury-gold">
                      {(user.full_name || user.email)
                        .split(/[\s@]/)
                        .slice(0, 2)
                        .map((n) => n[0]?.toUpperCase() || "")
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {user.full_name || user.email.split("@")[0]}
                      </p>
                      <Badge variant={planColors[user.plan] || "default"} size="sm">
                        <Crown className="mr-0.5 h-2.5 w-2.5" />
                        {user.plan}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-platinum-500">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Banks</p>
                    <div className="flex items-center justify-center gap-1">
                      <Building2 className="h-3 w-3 text-platinum-500" />
                      <p className="text-sm font-medium text-white">{user.connected_accounts}</p>
                    </div>
                    {user.institutions.length > 0 && (
                      <p className="text-[9px] text-platinum-500">{user.institutions.join(", ")}</p>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Stripe</p>
                    <div className="flex items-center justify-center gap-1">
                      <CreditCard className="h-3 w-3 text-platinum-500" />
                      <p className="text-sm font-medium text-white">
                        {user.stripe_customer_id ? "Active" : "None"}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Joined</p>
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="h-3 w-3 text-platinum-500" />
                      <p className="text-xs text-platinum-300">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {loading && !stats && (
        <GlassCard>
          <div className="flex items-center justify-center gap-3 py-8">
            <RefreshCw className="h-5 w-5 animate-spin text-luxury-gold" />
            <p className="text-sm text-platinum-400">Loading admin data...</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
