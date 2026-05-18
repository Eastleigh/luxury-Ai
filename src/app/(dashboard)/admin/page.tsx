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
  TrendingUp,
  Activity,
  UserPlus,
  Clock,
  Search,
  Download,
  BarChart3,
  Zap,
} from "lucide-react";
import { formatCurrency, useMounted } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";

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
  activeUsers: number;
  signupsLast7Days: number;
  signupsLast30Days: number;
}

interface SignupTrend {
  date: string;
  count: number;
}

interface ActivityItem {
  type: "signup" | "bank_connect";
  user: string;
  detail: string;
  timestamp: string;
}

export default function AdminPage() {
  const mounted = useMounted();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [signupTrends, setSignupTrends] = useState<SignupTrend[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");

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
      setSignupTrends(data.signupTrends || []);
      setRecentActivity(data.recentActivity || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlan = planFilter === "all" || user.plan === planFilter;
      return matchesSearch && matchesPlan;
    });
  }, [users, searchQuery, planFilter]);

  const maxTrend = Math.max(...signupTrends.map((t) => t.count), 1);

  const planColors: Record<string, "gold" | "info" | "default"> = {
    executive: "gold",
    professional: "info",
    free: "default",
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Plan", "Banks Connected", "Joined", "Last Active"];
    const rows = users.map((u) => [
      u.full_name || u.email.split("@")[0],
      u.email,
      u.plan,
      u.connected_accounts.toString(),
      new Date(u.created_at).toLocaleDateString(),
      u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString() : "Never",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mavaree-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const timeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            <Shield className="mr-2 inline h-6 w-6 text-luxury-gold" />
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-platinum-400">
            Real-time overview of users, revenue, and platform activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={users.length === 0}
            className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-platinum-400 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-platinum-400 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
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

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={stats.totalUsers.toString()}
            change={`+${stats.signupsLast7Days} this week`}
            trend="up"
            icon={Users}
            delay={0.1}
          />
          <StatCard
            label="Monthly Revenue"
            value={formatCurrency(stats.mrr)}
            change={`${stats.proUsers + stats.execUsers} paid subscribers`}
            trend="up"
            icon={DollarSign}
            iconColor="text-emerald-400"
            delay={0.15}
          />
          <StatCard
            label="Active Users (7d)"
            value={stats.activeUsers.toString()}
            change={`${stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% engagement`}
            trend="up"
            icon={Activity}
            iconColor="text-blue-400"
            delay={0.2}
          />
          <StatCard
            label="Connected Banks"
            value={stats.connectedBanks.toString()}
            change="via Plaid"
            trend="up"
            icon={Building2}
            iconColor="text-purple-400"
            delay={0.25}
          />
        </div>
      )}

      {/* Signup Trend Chart + Revenue Breakdown */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Signup Trend */}
          <GlassCard className="lg:col-span-2" delay={0.3}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Signup Trend</h2>
                <p className="text-xs text-platinum-500">Last 30 days</p>
              </div>
              <Badge variant="info">
                <UserPlus className="mr-1 h-3 w-3" />
                {stats.signupsLast30Days} new
              </Badge>
            </div>
            <div className="mt-4 flex items-end gap-[3px]" style={{ height: "120px" }}>
              {signupTrends.map((day, i) => (
                <div
                  key={day.date}
                  className="group relative flex-1"
                  style={{ height: "100%" }}
                >
                  <div
                    className="absolute bottom-0 w-full rounded-t-sm bg-gradient-to-t from-luxury-gold/60 to-luxury-gold/30 transition-all group-hover:from-luxury-gold/80 group-hover:to-luxury-gold/50"
                    style={{
                      height: `${Math.max((day.count / maxTrend) * 100, day.count > 0 ? 8 : 2)}%`,
                    }}
                  />
                  <div className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-black/80 px-1.5 py-0.5 text-[9px] text-white group-hover:block whitespace-nowrap">
                    {day.date.slice(5)}: {day.count}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[9px] text-platinum-500">
              <span>{signupTrends[0]?.date.slice(5)}</span>
              <span>{signupTrends[signupTrends.length - 1]?.date.slice(5)}</span>
            </div>
          </GlassCard>

          {/* Revenue Breakdown */}
          <GlassCard delay={0.35}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Revenue Mix</h2>
              <Badge variant="gold">
                <TrendingUp className="mr-1 h-3 w-3" />
                {formatCurrency(stats.mrr)}/mo
              </Badge>
            </div>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-platinum-400">Free Audit</span>
                  <span className="text-xs font-medium text-white">{stats.freeUsers} users</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-platinum-500"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.freeUsers / stats.totalUsers) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-400">Pro ($99/mo)</span>
                  <span className="text-xs font-medium text-white">{stats.proUsers} users = {formatCurrency(stats.proUsers * 99)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.proUsers / stats.totalUsers) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-luxury-gold">Executive ($499/mo)</span>
                  <span className="text-xs font-medium text-white">{stats.execUsers} users = {formatCurrency(stats.execUsers * 499)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-luxury-gold to-[#e0c992]"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.execUsers / stats.totalUsers) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-luxury-gold/10 bg-luxury-gold/5 p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-platinum-500">Annual Run Rate</p>
              <p className="mt-1 text-xl font-bold text-luxury-gold">{formatCurrency(stats.mrr * 12)}</p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* System Health + Recent Activity */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* System Health */}
          <GlassCard delay={0.4}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">System Status</h2>
              <Badge variant="success">All Systems Operational</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { name: "Supabase Auth", status: "connected", icon: Shield },
                { name: "Plaid API", status: "sandbox", icon: Building2 },
                { name: "Stripe Payments", status: "live", icon: CreditCard },
                { name: "DeepSeek AI", status: "connected", icon: Zap },
                { name: "Seats.aero Awards", status: "connected", icon: BarChart3 },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3">
                  <div className="flex items-center gap-3">
                    <service.icon className="h-4 w-4 text-platinum-400" />
                    <span className="text-sm text-white">{service.name}</span>
                  </div>
                  <Badge
                    variant={service.status === "live" || service.status === "connected" ? "success" : "warning"}
                    size="sm"
                  >
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Recent Activity Feed */}
          <GlassCard delay={0.45}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Recent Activity</h2>
              <Badge variant="info">
                <Clock className="mr-1 h-3 w-3" />
                Live
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 8).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-2.5">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      item.type === "signup" ? "bg-emerald-500/10" : "bg-blue-500/10"
                    }`}>
                      {item.type === "signup" ? (
                        <UserPlus className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Building2 className="h-3.5 w-3.5 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{item.user}</p>
                      <p className="text-[10px] text-platinum-500 truncate">{item.detail}</p>
                    </div>
                    <span className="text-[10px] text-platinum-500 whitespace-nowrap">
                      {item.timestamp ? timeAgo(item.timestamp) : "—"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-platinum-500">
                  No recent activity yet. Activity will appear as users sign up and connect accounts.
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* User Management */}
      {users.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-white">
              User Management
              <span className="ml-2 text-sm font-normal text-platinum-500">
                ({filteredUsers.length} of {users.length})
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-platinum-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-white placeholder:text-platinum-500 focus:border-luxury-gold/30 focus:outline-none focus:ring-1 focus:ring-luxury-gold/20"
                />
              </div>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-platinum-400 focus:border-luxury-gold/30 focus:outline-none"
              >
                <option value="all">All Plans</option>
                <option value="free">Free</option>
                <option value="professional">Pro</option>
                <option value="executive">Executive</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
            <div className="hidden sm:grid sm:grid-cols-6 gap-4 bg-white/[0.03] px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-platinum-500">
              <span className="col-span-2">User</span>
              <span>Plan</span>
              <span>Banks</span>
              <span>Joined</span>
              <span>Last Active</span>
            </div>
            {filteredUsers.map((user, i) => (
              <motion.div
                key={user.id}
                initial={mounted ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * Math.min(i, 10) }}
                className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 border-t border-white/[0.04] px-4 py-3 transition-colors hover:bg-white/[0.02]"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5">
                    <span className="text-[10px] font-semibold text-luxury-gold">
                      {(user.full_name || user.email)
                        .split(/[\s@]/)
                        .slice(0, 2)
                        .map((n) => n[0]?.toUpperCase() || "")
                        .join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.full_name || user.email.split("@")[0]}
                    </p>
                    <p className="text-[10px] text-platinum-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge variant={planColors[user.plan] || "default"} size="sm">
                    <Crown className="mr-0.5 h-2.5 w-2.5" />
                    {user.plan}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3 w-3 text-platinum-500" />
                  <span className="text-sm text-white">{user.connected_accounts}</span>
                  {user.institutions.length > 0 && (
                    <span className="text-[9px] text-platinum-500 truncate">
                      ({user.institutions.join(", ")})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-platinum-500" />
                  <span className="text-xs text-platinum-300">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-platinum-500" />
                  <span className="text-xs text-platinum-300">
                    {user.last_sign_in
                      ? timeAgo(user.last_sign_in)
                      : "Never"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
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
