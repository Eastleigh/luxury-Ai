"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  TrendingDown,
  ArrowRightLeft,
  Bell,
  Sparkles,
  ShieldCheck,
  Timer,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { healthAlerts, transferBonuses, pointsPrograms } from "@/data/mock";
import { formatPoints, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

export default function HealthPage() {
  const criticalCount = healthAlerts.filter(
    (a) => a.severity === "critical"
  ).length;
  const highCount = healthAlerts.filter((a) => a.severity === "high").length;

  const severityConfig: Record<
    string,
    { border: string; bg: string; icon: string }
  > = {
    critical: {
      border: "border-red-500/30",
      bg: "bg-red-500/[0.05]",
      icon: "text-red-400",
    },
    high: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/[0.05]",
      icon: "text-amber-400",
    },
    medium: {
      border: "border-blue-500/20",
      bg: "bg-blue-500/[0.03]",
      icon: "text-blue-400",
    },
    low: {
      border: "border-white/[0.06]",
      bg: "bg-white/[0.02]",
      icon: "text-platinum-400",
    },
  };

  const typeIcons: Record<string, typeof AlertTriangle> = {
    expiry: Timer,
    devaluation: TrendingDown,
    bonus: ArrowRightLeft,
    inflation: Activity,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            AI Points Health Monitor
          </h1>
          <p className="mt-1 text-sm text-platinum-400">
            Track expiring points, devaluation risks, transfer bonuses, and point
            inflation across all your programs.
          </p>
        </div>
        <Button variant="gold">
          <Bell className="h-4 w-4" />
          Alert Settings
        </Button>
      </div>

      {/* Health Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-r from-emerald-500/10 via-transparent to-amber-500/10 p-6"
      >
        <div className="flex items-center gap-6">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#healthGradient)"
                strokeWidth="8"
                strokeDasharray={`${72 * 2.51} ${100 * 2.51}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="healthGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#c9a96e" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="stat-value text-2xl font-bold text-white">
                72
              </span>
              <span className="text-[9px] text-platinum-500">HEALTH</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">
              Points Health Score: <span className="text-emerald-400">Good</span>
            </h2>
            <p className="mt-1 text-xs text-platinum-400">
              Your portfolio has {criticalCount} critical and {highCount}{" "}
              high-priority alerts that need attention. Address these to improve
              your health score.
            </p>
            <div className="mt-3 flex gap-3">
              <Badge variant="danger">{criticalCount} Critical</Badge>
              <Badge variant="warning">{highCount} High</Badge>
              <Badge variant="info">
                {healthAlerts.length - criticalCount - highCount} Other
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Points at Risk"
          value="892K"
          change="Hilton expiring"
          trend="down"
          icon={AlertTriangle}
          iconColor="text-red-400"
          delay={0.2}
        />
        <StatCard
          label="Active Bonuses"
          value={transferBonuses.length.toString()}
          change="2 ending this week"
          trend="up"
          icon={ArrowRightLeft}
          iconColor="text-emerald-400"
          delay={0.25}
        />
        <StatCard
          label="Programs Tracked"
          value={pointsPrograms.length.toString()}
          change="All healthy"
          trend="up"
          icon={ShieldCheck}
          iconColor="text-blue-400"
          delay={0.3}
        />
        <StatCard
          label="Alerts This Month"
          value={healthAlerts.length.toString()}
          change="3 resolved"
          trend="up"
          icon={Bell}
          iconColor="text-amber-400"
          delay={0.35}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Alerts List */}
        <div className="space-y-3 lg:col-span-2">
          <h2 className="text-base font-semibold text-white">Active Alerts</h2>
          {healthAlerts.map((alert, i) => {
            const config = severityConfig[alert.severity];
            const TypeIcon = typeIcons[alert.type] || AlertTriangle;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className={`rounded-2xl border ${config.border} ${config.bg} p-4 transition-all hover:shadow-lg`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${config.icon}`}>
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {alert.title}
                      </p>
                      <Badge
                        variant={
                          alert.severity === "critical"
                            ? "danger"
                            : alert.severity === "high"
                            ? "warning"
                            : alert.severity === "medium"
                            ? "info"
                            : "default"
                        }
                        size="sm"
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-platinum-400">
                      {alert.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <Badge variant="default" size="sm">
                        {alert.program}
                      </Badge>
                      {alert.deadline && (
                        <span className="flex items-center gap-1 text-[10px] text-platinum-500">
                          <Clock className="h-3 w-3" />
                          Deadline:{" "}
                          {new Date(alert.deadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                      {alert.actionRequired && (
                        <Button variant="secondary" size="sm">
                          Take Action
                          <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Transfer Bonuses Sidebar */}
        <GlassCard delay={0.6}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Live Transfer Bonuses
            </h2>
            <Badge variant="gold">Active</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {transferBonuses.map((bonus) => (
              <div
                key={bonus.id}
                className="rounded-xl border border-luxury-gold/10 bg-luxury-gold/[0.03] p-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="gold" size="md">
                    +{bonus.bonusPercent}% Bonus
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-platinum-500">
                    <Clock className="h-3 w-3" />
                    Ends{" "}
                    {new Date(bonus.expiryDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white">
                  {bonus.from}{" "}
                  <ArrowRightLeft className="inline h-3 w-3 text-luxury-gold" />{" "}
                  {bonus.to}
                </p>
                <Button variant="ghost" size="sm" className="mt-2 w-full">
                  Transfer Now
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-white/[0.03] p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-luxury-gold" />
              <p className="text-xs font-medium text-luxury-gold">AI Tip</p>
            </div>
            <p className="mt-1.5 text-[11px] text-platinum-400">
              The 30% Virgin Atlantic bonus combined with your 487K Amex MR
              balance could unlock ANA First Class for 2 passengers.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
