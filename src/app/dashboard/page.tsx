"use client";

import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Coins,
  DollarSign,
  AlertTriangle,
  ArrowRightLeft,
  Plane,
  Users,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  CreditCard,
  Building2,
} from "lucide-react";
import {
  dashboardStats,
  pointsPrograms,
  transferBonuses,
  healthAlerts,
  monthlySpendData,
} from "@/data/mock";
import { formatCurrency, formatPoints, useMounted } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const mounted = useMounted();
  const totalEstimatedValue = pointsPrograms.reduce(
    (sum, p) => sum + p.estimatedValue,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="gold-gradient">Marcus</span>
          </h1>
          <p className="mt-1 text-sm text-platinum-400">
            Your rewards portfolio is performing well. Here&apos;s your overview.
          </p>
        </div>
        <Button variant="gold" size="md">
          <Sparkles className="h-4 w-4" />
          AI Insights
        </Button>
      </div>

      {/* Loss Alert Banner */}
      <motion.div
        initial={mounted ? { opacity: 0, scale: 0.98 } : false}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent p-5"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-400">
              You are losing approximately{" "}
              <span className="text-lg">
                {formatCurrency(dashboardStats.missedRewards)}
              </span>
              /year in rewards
            </p>
            <p className="mt-0.5 text-xs text-platinum-400">
              Based on your current card setup and spending patterns. Our AI has
              identified optimization opportunities across 8 categories.
            </p>
          </div>
          <Button variant="secondary" size="sm">
            View Analysis
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-500/5 blur-3xl" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Points"
          value={formatPoints(dashboardStats.totalPoints)}
          change="+12.4%"
          trend="up"
          icon={Coins}
          delay={0}
        />
        <StatCard
          label="Estimated Value"
          value={formatCurrency(totalEstimatedValue)}
          change="+8.2%"
          trend="up"
          icon={DollarSign}
          iconColor="text-emerald-400"
          delay={0.1}
        />
        <StatCard
          label="Monthly Spend"
          value={formatCurrency(dashboardStats.monthlySpend)}
          change="-3.8%"
          trend="down"
          icon={TrendingUp}
          iconColor="text-blue-400"
          delay={0.2}
        />
        <StatCard
          label="Active Bonuses"
          value={dashboardStats.activeTransferBonuses.toString()}
          change="2 expiring soon"
          trend="up"
          icon={ArrowRightLeft}
          iconColor="text-amber-400"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Points Portfolio */}
        <GlassCard className="lg:col-span-2" delay={0.2}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Points Portfolio
            </h2>
            <Badge variant="gold">
              {pointsPrograms.length} Programs
            </Badge>
          </div>
          <div className="mt-4 space-y-3">
            {pointsPrograms.slice(0, 6).map((program) => (
              <div
                key={program.id}
                className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${program.color}20` }}
                  >
                    {program.icon === "CreditCard" ? (
                      <CreditCard
                        className="h-4 w-4"
                        style={{ color: program.color }}
                      />
                    ) : program.icon === "Building2" ? (
                      <Building2
                        className="h-4 w-4"
                        style={{ color: program.color }}
                      />
                    ) : (
                      <Plane
                        className="h-4 w-4"
                        style={{ color: program.color }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {program.provider}
                    </p>
                    <p className="text-xs text-platinum-500">{program.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="stat-value text-sm font-semibold text-white">
                    {formatPoints(program.balance)}
                  </p>
                  <p className="text-xs text-emerald-400">
                    ~{formatCurrency(program.estimatedValue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Transfer Bonuses */}
        <GlassCard delay={0.3}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Active Transfer Bonuses
            </h2>
            <Badge variant="warning">Live</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {transferBonuses.map((bonus) => (
              <div
                key={bonus.id}
                className="rounded-xl border border-luxury-gold/10 bg-luxury-gold/[0.03] p-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="gold">+{bonus.bonusPercent}%</Badge>
                  <span className="text-[10px] text-platinum-500">
                    Ends {new Date(bonus.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white">
                  {bonus.from}{" "}
                  <ArrowRightLeft className="inline h-3 w-3 text-luxury-gold" />{" "}
                  {bonus.to}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Spend Trend */}
        <GlassCard delay={0.4}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Monthly Spend & Rewards
            </h2>
            <Badge variant="info">6 Months</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {monthlySpendData.map((month) => (
              <div key={month.month} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-platinum-400">{month.month}</span>
                  <span className="text-platinum-300">
                    {formatCurrency(month.spend)} → {formatCurrency(month.rewards)} rewards
                  </span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                      style={{ width: `${(month.spend / 130_000) * 100}%` }}
                    />
                  </div>
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-luxury-gold to-[#e0c992]"
                      style={{ width: `${(month.rewards / 8_000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Health Alerts */}
        <GlassCard delay={0.5}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Points Health Alerts
            </h2>
            <Badge variant="danger">
              {healthAlerts.filter((a) => a.severity === "critical").length} Critical
            </Badge>
          </div>
          <div className="mt-4 space-y-3">
            {healthAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl border p-3 ${
                  alert.severity === "critical"
                    ? "border-red-500/20 bg-red-500/[0.03]"
                    : alert.severity === "high"
                    ? "border-amber-500/20 bg-amber-500/[0.03]"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-2">
                  <Badge
                    variant={
                      alert.severity === "critical"
                        ? "danger"
                        : alert.severity === "high"
                        ? "warning"
                        : "default"
                    }
                    size="sm"
                  >
                    {alert.type}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white">
                      {alert.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-platinum-500 line-clamp-2">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard delay={0.6}>
        <h2 className="text-base font-semibold text-white">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Plane, label: "Search Awards", color: "text-blue-400" },
            { icon: CreditCard, label: "Optimize Cards", color: "text-luxury-gold" },
            { icon: ArrowRightLeft, label: "Transfer Points", color: "text-emerald-400" },
            { icon: Users, label: "Manage Clients", color: "text-purple-400" },
          ].map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-luxury-gold/20 hover:bg-white/[0.04]"
            >
              <action.icon className={`h-5 w-5 ${action.color}`} />
              <span className="text-xs font-medium text-platinum-300">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
