"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Calendar,
  Sparkles,
  Target,
  AlertTriangle,
  Award,
  Zap,
  Download,
} from "lucide-react";
import {
  spendCategories,
  monthlySpendData,
  categoryBreakdown,
  pointsPrograms,
  dashboardStats,
} from "@/data/mock";
import { formatCurrency, formatPoints, useMounted } from "@/lib/utils";
import { useSpendingData } from "@/lib/use-spending-data";
import { useToast } from "@/components/ui/Toast";
import { motion } from "framer-motion";
import { useState } from "react";

type TimeRange = "7d" | "30d" | "90d" | "12m";

export default function AnalyticsPage() {
  const mounted = useMounted();
  const spending = useSpendingData();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [activeTab, setActiveTab] = useState<"overview" | "categories" | "rewards" | "opportunities">("overview");

  const displayMonthly = spending.hasRealData ? spending.monthlySpendData : monthlySpendData;
  const displayCategories = spending.hasRealData ? spending.categoryBreakdown : categoryBreakdown;
  const displaySpendCats = spending.hasRealData ? spending.spendCategories : spendCategories;

  const totalSpend = displayMonthly.reduce((s, m) => s + m.spend, 0);
  const totalRewards = displayMonthly.reduce((s, m) => s + m.rewards, 0);
  const totalMissed = displaySpendCats.reduce((s, c) => s + c.missedReward, 0);
  const avgMonthlySpend = displayMonthly.length > 0 ? Math.round(totalSpend / displayMonthly.length) : 0;
  const totalPointsValue = pointsPrograms.reduce((s, p) => s + p.estimatedValue, 0);

  const maxSpend = Math.max(...displayMonthly.map((m) => m.spend), 1);

  const tabs = [
    { key: "overview" as const, label: "Overview", icon: BarChart3 },
    { key: "categories" as const, label: "Categories", icon: PieChart },
    { key: "rewards" as const, label: "Rewards", icon: Award },
    { key: "opportunities" as const, label: "Opportunities", icon: Target },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics & Insights</h1>
          <p className="mt-1 text-sm text-platinum-400">
            Deep spending analytics, rewards tracking, and optimization opportunities.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-white/[0.06] bg-white/[0.02]">
            {(["7d", "30d", "90d", "12m"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  timeRange === range
                    ? "bg-luxury-gold/10 text-luxury-gold"
                    : "text-platinum-500 hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={() => toast("Report exported", "success")}>
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Spend (6mo)"
          value={formatCurrency(totalSpend)}
          change={`Avg ${formatCurrency(avgMonthlySpend)}/mo`}
          trend="up"
          icon={DollarSign}
          iconColor="text-emerald-400"
          delay={0.1}
        />
        <StatCard
          label="Rewards Earned"
          value={formatCurrency(totalRewards)}
          change={`${((totalRewards / totalSpend) * 100).toFixed(1)}% return`}
          trend="up"
          icon={Award}
          iconColor="text-luxury-gold"
          delay={0.15}
        />
        <StatCard
          label="Missed Rewards"
          value={formatCurrency(totalMissed * 6)}
          change="Potential savings/yr"
          trend="down"
          icon={AlertTriangle}
          iconColor="text-red-400"
          delay={0.2}
        />
        <StatCard
          label="Portfolio Value"
          value={formatCurrency(totalPointsValue)}
          change={`${pointsPrograms.length} programs`}
          trend="up"
          icon={CreditCard}
          iconColor="text-blue-400"
          delay={0.25}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all ${
              activeTab === tab.key
                ? "bg-luxury-gold/10 text-luxury-gold"
                : "text-platinum-500 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Spending Trend Chart */}
          <GlassCard delay={0.3}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Spending Trends</h2>
              <div className="flex items-center gap-4 text-[10px]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-luxury-gold" />
                  <span className="text-platinum-400">Spend</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-platinum-400">Rewards</span>
                </span>
              </div>
            </div>
            <div className="mt-6 flex items-end gap-3" style={{ height: 180 }}>
              {displayMonthly.map((month, i) => {
                const height = (month.spend / maxSpend) * 100;
                const rewardHeight = (month.rewards / maxSpend) * 100;
                return (
                  <motion.div
                    key={month.month}
                    initial={mounted ? { scaleY: 0 } : false}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                    className="group relative flex flex-1 flex-col items-center"
                    style={{ originY: 1 }}
                  >
                    <div className="absolute -top-8 hidden rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white backdrop-blur-sm group-hover:block">
                      {formatCurrency(month.spend)}
                    </div>
                    <div className="flex w-full gap-1">
                      <div
                        className="flex-1 rounded-t-md bg-gradient-to-t from-luxury-gold/40 to-luxury-gold/80 transition-all group-hover:from-luxury-gold/60 group-hover:to-luxury-gold"
                        style={{ height: `${height}%`, minHeight: 4 }}
                      />
                      <div
                        className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-500/40 to-emerald-500/80"
                        style={{ height: `${rewardHeight}%`, minHeight: 4 }}
                      />
                    </div>
                    <span className="mt-2 text-[10px] text-platinum-500">{month.month}</span>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <GlassCard delay={0.5}>
              <h3 className="text-sm font-semibold text-white">Spend Velocity</h3>
              <p className="mt-1 text-[11px] text-platinum-400">Monthly spending trajectory</p>
              <div className="mt-4 space-y-3">
                {displayMonthly.slice(-3).map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-xs text-platinum-400">{month.month}</span>
                    <div className="flex flex-1 mx-3">
                      <div className="h-2 flex-1 rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(month.spend / maxSpend) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                          className="h-full rounded-full bg-gradient-to-r from-luxury-gold/60 to-luxury-gold"
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-white">{formatCurrency(month.spend)}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard delay={0.55}>
              <h3 className="text-sm font-semibold text-white">Rewards Efficiency</h3>
              <p className="mt-1 text-[11px] text-platinum-400">How effectively you earn rewards</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Current Return Rate", value: `${((totalRewards / totalSpend) * 100).toFixed(1)}%`, status: "warning" },
                  { label: "Optimal Return Rate", value: "4.2%", status: "success" },
                  { label: "Industry Average", value: "1.5%", status: "default" },
                ].map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
                    <span className="text-xs text-platinum-400">{metric.label}</span>
                    <Badge variant={metric.status as "warning" | "success" | "default"} size="sm">{metric.value}</Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <GlassCard delay={0.3}>
            <h2 className="text-base font-semibold text-white">Category Breakdown</h2>
            <p className="mt-1 text-[11px] text-platinum-400">Where your money goes each month</p>
            <div className="mt-6 space-y-3">
              {displayCategories.map((cat, i) => {
                const maxVal = Math.max(...displayCategories.map((c) => c.value), 1);
                const pct = (cat.value / maxVal) * 100;
                return (
                  <motion.div
                    key={cat.name}
                    initial={mounted ? { opacity: 0, x: -10 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-platinum-300">{cat.name}</span>
                      </div>
                      <span className="font-medium text-white">{formatCurrency(cat.value)}/mo</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard delay={0.5}>
            <h2 className="text-base font-semibold text-white">Category Performance</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left text-platinum-500">
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium">Monthly Spend</th>
                    <th className="pb-2 font-medium">Current Card</th>
                    <th className="pb-2 font-medium">Current Rewards</th>
                    <th className="pb-2 font-medium">Optimal Rewards</th>
                    <th className="pb-2 font-medium">Missed</th>
                  </tr>
                </thead>
                <tbody>
                  {displaySpendCats.map((cat) => (
                    <tr key={cat.name} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="py-2.5 font-medium text-white">{cat.name}</td>
                      <td className="py-2.5 text-platinum-300">{formatCurrency(cat.amount)}</td>
                      <td className="py-2.5 text-platinum-400">{cat.currentCard}</td>
                      <td className="py-2.5 text-platinum-300">{formatCurrency(cat.currentReward)}</td>
                      <td className="py-2.5 text-emerald-400">{formatCurrency(cat.optimalReward)}</td>
                      <td className="py-2.5">
                        <span className="text-red-400">{formatCurrency(cat.missedReward)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/[0.06] font-semibold">
                    <td className="pt-2 text-white">Total</td>
                    <td className="pt-2 text-white">{formatCurrency(displaySpendCats.reduce((s, c) => s + c.amount, 0))}</td>
                    <td className="pt-2" />
                    <td className="pt-2 text-platinum-300">{formatCurrency(displaySpendCats.reduce((s, c) => s + c.currentReward, 0))}</td>
                    <td className="pt-2 text-emerald-400">{formatCurrency(displaySpendCats.reduce((s, c) => s + c.optimalReward, 0))}</td>
                    <td className="pt-2 text-red-400">{formatCurrency(totalMissed)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === "rewards" && (
        <div className="space-y-6">
          <GlassCard delay={0.3}>
            <h2 className="text-base font-semibold text-white">Points Portfolio</h2>
            <p className="mt-1 text-[11px] text-platinum-400">All your loyalty programs in one view</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {pointsPrograms.map((program, i) => (
                <motion.div
                  key={program.id}
                  initial={mounted ? { opacity: 0, scale: 0.95 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-luxury-gold/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: program.color }} />
                    <span className="text-[10px] font-medium text-platinum-500">{program.provider}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-white">{formatPoints(program.balance)}</p>
                  <p className="text-[10px] text-platinum-500">{program.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400">{formatCurrency(program.estimatedValue)}</span>
                    {program.expiryDate && (
                      <span className="text-[9px] text-platinum-500">{program.expiryDate}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <GlassCard delay={0.5}>
              <h3 className="text-sm font-semibold text-white">Rewards Earned vs Missed</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400">Earned (6mo)</span>
                    <span className="font-medium text-emerald-400">{formatCurrency(totalRewards)}</span>
                  </div>
                  <div className="mt-1 h-3 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-emerald-500"
                      style={{ width: `${(totalRewards / (totalRewards + totalMissed * 6)) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-400">Missed (6mo)</span>
                    <span className="font-medium text-red-400">{formatCurrency(totalMissed * 6)}</span>
                  </div>
                  <div className="mt-1 h-3 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500/60 to-red-500"
                      style={{ width: `${(totalMissed * 6 / (totalRewards + totalMissed * 6)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">Optimization Impact</span>
                </div>
                <p className="mt-1 text-[11px] text-platinum-400">
                  Switching to optimal cards could earn you an additional <span className="font-semibold text-emerald-400">{formatCurrency(totalMissed * 12)}/year</span> in rewards.
                </p>
              </div>
            </GlassCard>

            <GlassCard delay={0.55}>
              <h3 className="text-sm font-semibold text-white">Points Value Breakdown</h3>
              <div className="mt-4 space-y-3">
                {pointsPrograms
                  .sort((a, b) => b.estimatedValue - a.estimatedValue)
                  .slice(0, 5)
                  .map((program) => {
                    const pct = (program.estimatedValue / totalPointsValue) * 100;
                    return (
                      <div key={program.id}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-platinum-300">{program.name}</span>
                          <span className="font-medium text-white">{formatCurrency(program.estimatedValue)}</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: program.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Opportunities Tab */}
      {activeTab === "opportunities" && (
        <div className="space-y-6">
          <GlassCard delay={0.3} glow>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luxury-gold/10">
                <Sparkles className="h-5 w-5 text-luxury-gold" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">AI-Detected Opportunities</h2>
                <p className="text-[11px] text-platinum-400">Based on your spending patterns and current card setup</p>
              </div>
            </div>
          </GlassCard>

          <div className="space-y-3">
            {[
              {
                title: "Switch Ad Spend to Chase Ink Preferred",
                impact: "+$45,600/yr",
                category: "Card Optimization",
                description: "Your $47,500/mo in digital advertising earns 1x on Amex Gold. Chase Ink Preferred offers 3x on advertising purchases up to $150K/quarter.",
                effort: "Low",
                priority: "critical",
              },
              {
                title: "Transfer Amex MR to Virgin Atlantic (30% Bonus)",
                impact: "+145K points",
                category: "Transfer Bonus",
                description: "Active 30% transfer bonus expiring soon. Transfer 487K Amex MR for 633K Virgin Atlantic points — enough for 2 ANA First Class tickets to Tokyo.",
                effort: "Low",
                priority: "high",
              },
              {
                title: "Open Amex Business Platinum for Equipment",
                impact: "+$13,200/yr",
                category: "New Card",
                description: "Your $22,000/mo in equipment purchases on a debit card earns nothing. Amex Business Platinum offers 1.5x on purchases over $5,000.",
                effort: "Medium",
                priority: "high",
              },
              {
                title: "Move Shipping to Chase Ink Preferred",
                impact: "+$18,240/yr",
                category: "Card Optimization",
                description: "Your $15,200/mo in shipping costs are on a debit card. Chase Ink Preferred offers 3x on shipping purchases up to $150K/quarter.",
                effort: "Low",
                priority: "high",
              },
              {
                title: "Redeem Hilton Points Before Expiry",
                impact: "Save 892K pts",
                category: "Points Protection",
                description: "Your 892,400 Hilton Honors points expire in 45 days due to inactivity. Make a qualifying purchase or transfer to prevent loss.",
                effort: "Low",
                priority: "critical",
              },
              {
                title: "Consolidate Dining on Amex Gold",
                impact: "+$7,440/yr",
                category: "Card Optimization",
                description: "Your $6,200/mo in client dining earns 2x on Capital One Venture. Amex Gold offers 4x on restaurants worldwide.",
                effort: "Low",
                priority: "medium",
              },
            ].map((opp, i) => (
              <motion.div
                key={opp.title}
                initial={mounted ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`rounded-2xl border p-4 transition-all hover:shadow-lg ${
                  opp.priority === "critical"
                    ? "border-red-500/20 bg-red-500/[0.03]"
                    : opp.priority === "high"
                    ? "border-amber-500/20 bg-amber-500/[0.03]"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={opp.priority === "critical" ? "danger" : opp.priority === "high" ? "warning" : "default"}
                        size="sm"
                      >
                        {opp.priority}
                      </Badge>
                      <Badge variant="default" size="sm">{opp.category}</Badge>
                      <Badge variant="info" size="sm">Effort: {opp.effort}</Badge>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-white">{opp.title}</h3>
                    <p className="mt-1 text-xs text-platinum-400">{opp.description}</p>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <span className="text-sm font-bold text-emerald-400">{opp.impact}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (opp.category === "Card Optimization") window.location.href = "/optimizer";
                        else if (opp.category === "Transfer Bonus") window.location.href = "/travel";
                        else if (opp.category === "Points Protection") window.location.href = "/health";
                        else window.location.href = "/optimizer";
                      }}
                    >
                      Take Action
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <GlassCard delay={0.7}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Total Optimization Potential</h3>
                <p className="text-[11px] text-platinum-400">If all opportunities are implemented</p>
              </div>
              <div className="text-right">
                <p className="stat-value text-2xl font-bold text-emerald-400">+$84,480/yr</p>
                <p className="text-[10px] text-platinum-500">in additional rewards</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
