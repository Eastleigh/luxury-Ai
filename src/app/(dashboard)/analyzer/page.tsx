"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  BarChart3,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Wallet,
  CreditCard,
  Link2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  spendCategories as mockSpendCategories,
  categoryBreakdown as mockCategoryBreakdown,
} from "@/data/mock";
import { formatCurrency, useMounted } from "@/lib/utils";
import { useSpendingData } from "@/lib/use-spending-data";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { askAI } from "@/lib/ai";
import { AIResponsePanel } from "@/components/ui/AIResponsePanel";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AnalyzerPage() {
  const mounted = useMounted();
  const spending = useSpendingData();
  const { toast } = useToast();
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const spendCategories = spending.hasRealData && spending.spendCategories.length > 0
    ? spending.spendCategories
    : mockSpendCategories;

  const categoryBreakdown = spending.hasRealData && spending.categoryBreakdown.length > 0
    ? spending.categoryBreakdown
    : mockCategoryBreakdown;

  const handleRunAnalysis = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiResponse(null);
    const spendData = spendCategories.map(c => `${c.name}: $${c.amount.toLocaleString()}/mo on ${c.currentCard} (optimal: ${c.optimalCard}, missing $${c.missedReward.toLocaleString()}/mo)`).join("\n");
    const totalSpendForContext = spendCategories.reduce((s, c) => s + c.amount, 0);
    const { result, error } = await askAI({
      type: "analyzer",
      prompt: `Analyze my business spending and give me a comprehensive optimization report. Here are my current spending categories:\n${spendData}`,
      context: spending.hasRealData
        ? `Real transaction data from connected bank accounts. Monthly spend: $${totalSpendForContext.toLocaleString()}. Connected accounts: ${spending.connectedAccounts.map(a => a.institution_name).join(", ")}.`
        : "Business type: Construction/Contracting. Monthly spend: $185,000. Team size: 24 employees. Current cards: Amex Gold, Chase Sapphire, Capital One Venture, Personal Visa, Debit Card.",
    });
    setAiLoading(false);
    if (error) {
      setAiError(error);
      toast(error, "error");
    } else {
      setAiResponse(result ?? null);
      toast("Analysis complete", "success");
    }
  };

  const totalMissed = spendCategories.reduce((sum, c) => sum + c.missedReward, 0);
  const totalSpend = spendCategories.reduce((sum, c) => sum + c.amount, 0);
  const totalOptimalReward = spendCategories.reduce(
    (sum, c) => sum + c.optimalReward,
    0
  );
  const totalCurrentReward = spendCategories.reduce(
    (sum, c) => sum + c.currentReward,
    0
  );
  const annualMissed = totalMissed * 12;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Spend Analyzer</h1>
          <p className="mt-1 text-sm text-platinum-400">
            Connect your accounts for AI-powered spending analysis and
            optimization recommendations.
          </p>
        </div>
        <Button variant="gold" onClick={handleRunAnalysis} disabled={aiLoading}>
          <Sparkles className="h-4 w-4" />
          {aiLoading ? "Analyzing..." : "Run Full Analysis"}
        </Button>
      </div>

      {/* Connect Accounts */}
      <GlassCard delay={0.1}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            Connected Accounts
          </h2>
          <a href="/accounts">
            <Button variant="secondary" size="sm">
              <Link2 className="h-3 w-3" />
              Connect New
            </Button>
          </a>
        </div>
        {spending.hasRealData ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {spending.connectedAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                  <CreditCard className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{account.institution_name}</p>
                  <Badge variant="success" size="sm">
                    {account.account_type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              icon={CreditCard}
              title="No Accounts Connected"
              description="Connect your bank accounts and credit cards to get AI-powered spending analysis with real transaction data."
              actionLabel="Connect Accounts"
              actionHref="/accounts"
            />
          </div>
        )}
      </GlassCard>

      {/* AI Analysis Results */}
      <AIResponsePanel
        response={aiResponse}
        loading={aiLoading}
        error={aiError}
        onClose={() => { setAiResponse(null); setAiError(null); }}
      />

      {/* Loss Summary */}
      <motion.div
        initial={mounted ? { opacity: 0, scale: 0.98 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-transparent to-emerald-500/10 p-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-red-400">
              Annual Rewards Lost
            </p>
            <p className="mt-2 stat-value text-3xl font-bold text-red-400">
              {formatCurrency(annualMissed)}
            </p>
            <p className="mt-1 text-xs text-platinum-500">
              Based on current card setup
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-platinum-400">
              Current Monthly Rewards
            </p>
            <p className="mt-2 stat-value text-3xl font-bold text-white">
              {formatCurrency(totalCurrentReward)}
            </p>
            <p className="mt-1 text-xs text-platinum-500">
              Across {spendCategories.length} categories
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
              Optimized Monthly Rewards
            </p>
            <p className="mt-2 stat-value text-3xl font-bold text-emerald-400">
              {formatCurrency(totalOptimalReward)}
            </p>
            <p className="mt-1 text-xs text-platinum-500">
              With AI recommendations
            </p>
          </div>
        </div>
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Monthly Spend"
          value={formatCurrency(totalSpend)}
          icon={Wallet}
          delay={0.3}
        />
        <StatCard
          label="Optimization Rate"
          value="38%"
          change="Room to improve"
          trend="up"
          icon={TrendingUp}
          iconColor="text-emerald-400"
          delay={0.35}
        />
        <StatCard
          label="Missed Rewards/mo"
          value={formatCurrency(totalMissed)}
          icon={AlertTriangle}
          iconColor="text-red-400"
          delay={0.4}
        />
        <StatCard
          label="Categories Analyzed"
          value={spendCategories.length.toString()}
          icon={BarChart3}
          iconColor="text-blue-400"
          delay={0.45}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Category Breakdown */}
        <GlassCard className="lg:col-span-2" delay={0.5}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Spending Category Analysis
            </h2>
            <Badge variant="gold">AI Optimized</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {spendCategories.map((cat) => (
              <div
                key={cat.name}
                className="rounded-xl bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        {cat.name}
                      </p>
                      <Badge variant="default" size="sm">
                        {formatCurrency(cat.amount)}/mo
                      </Badge>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-xs">
                      <span className="text-platinum-500">
                        {cat.currentCard}
                      </span>
                      <ArrowRight className="h-3 w-3 text-luxury-gold" />
                      <span className="font-medium text-emerald-400">
                        {cat.optimalCard}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-400">
                      +{formatCurrency(cat.missedReward)}
                    </p>
                    <p className="text-[10px] text-platinum-500">missed/mo</p>
                  </div>
                </div>
                <ProgressBar
                  value={cat.currentReward}
                  max={cat.optimalReward}
                  className="mt-2"
                  color="bg-gradient-to-r from-red-500 to-emerald-500"
                />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Category Pie */}
        <GlassCard delay={0.6}>
          <h2 className="text-base font-semibold text-white">
            Spend Distribution
          </h2>
          <div className="mt-4 space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="flex-1 text-xs text-platinum-300">
                  {cat.name}
                </span>
                <span className="stat-value text-xs font-medium text-white">
                  {formatCurrency(cat.value)}
                </span>
                <span className="text-[10px] text-platinum-500">
                  {((cat.value / totalSpend) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-luxury-gold/10 bg-luxury-gold/[0.03] p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-luxury-gold" />
              <p className="text-xs font-medium text-luxury-gold">
                AI Recommendation
              </p>
            </div>
            <p className="mt-1.5 text-[11px] text-platinum-400">
              Move your Digital Advertising spend ({formatCurrency(47_500)}/mo)
              from Amex Gold to Chase Ink Preferred for uncapped 3x points.
              Annual impact: <span className="font-semibold text-emerald-400">+{formatCurrency(45_600)}</span>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
