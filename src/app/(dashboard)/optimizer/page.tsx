"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  CreditCard,
  Star,
  Sparkles,
  ArrowUpRight,
  Check,
  Crown,
  Zap,
  DollarSign,
} from "lucide-react";
import { creditCards } from "@/data/mock";
import { formatCurrency, useMounted } from "@/lib/utils";
import { useSpendingData } from "@/lib/use-spending-data";
import { askAI } from "@/lib/ai";
import { AIResponsePanel } from "@/components/ui/AIResponsePanel";
import { useToast } from "@/components/ui/Toast";
import { getAffiliateUrl } from "@/lib/affiliates";
import { motion } from "framer-motion";
import { useState } from "react";

export default function OptimizerPage() {
  const mounted = useMounted();
  const spending = useSpendingData();
  const { toast } = useToast();
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const realMonthlySpend = spending.hasRealData
    ? (spending.monthlySpend || spending.totalSpendLast30Days)
    : 0;

  const handleGetRecommendations = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiResponse(null);
    const spendBreakdown = spending.hasRealData && spending.spendCategories.length > 0
      ? spending.spendCategories.map(c => `${c.name}: $${c.amount.toLocaleString()}/mo on ${c.currentCard}`).join(", ")
      : "Digital Advertising $47,500, Equipment & Hardware $22,000, Shipping & Logistics $15,200, Software & SaaS $12,300, Travel & Flights $8,900, Client Dining $6,200, Telecommunications $4,800, Office Supplies $3,400";
    const { result, error } = await askAI({
      type: "optimizer",
      prompt: "Based on my business profile, recommend the optimal credit card portfolio. Tell me exactly which cards to get, which spending to put on each card, and the projected annual rewards. Include signup bonus strategy.",
      context: spending.hasRealData
        ? `Real spending data from connected bank accounts. Monthly spend: $${realMonthlySpend.toLocaleString()}. Breakdown: ${spendBreakdown}. Connected accounts: ${spending.connectedAccounts.map(a => a.institution_name).join(", ")}. Primary goal: Luxury travel.`
        : "Business type: Construction/Contracting. Monthly spend: $185,000. Breakdown: Digital Advertising $47,500, Equipment & Hardware $22,000, Shipping & Logistics $15,200, Software & SaaS $12,300, Travel & Flights $8,900, Client Dining $6,200, Telecommunications $4,800, Office Supplies $3,400. Team size: 24 employees. Primary goal: Luxury travel. Currently using: Amex Gold, Chase Sapphire, Capital One Venture, Personal Visa, and debit cards.",
    });
    setAiLoading(false);
    if (error) {
      setAiError(error);
      toast(error, "error");
    } else {
      setAiResponse(result ?? null);
      toast("Optimization complete", "success");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Card Optimizer</h1>
          <p className="mt-1 text-sm text-platinum-400">
            AI-powered card recommendations based on your business type, spending
            patterns, and travel goals.
          </p>
        </div>
        <Button variant="gold" onClick={handleGetRecommendations} disabled={aiLoading}>
          <Sparkles className="h-4 w-4" />
          {aiLoading ? "Optimizing..." : "Get Recommendations"}
        </Button>
      </div>

      {/* AI Insight Banner */}
      <motion.div
        initial={mounted ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-luxury-gold/20 bg-gradient-to-r from-luxury-gold/10 via-luxury-gold/5 to-transparent p-5"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-luxury-gold/10">
            <Zap className="h-6 w-6 text-luxury-gold" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-luxury-gold">
              Optimization Opportunity Detected
            </p>
            <p className="mt-0.5 text-xs text-platinum-400">
              Move Facebook ad spend from Amex Gold to Chase Ink Business Preferred
              for uncapped 3x on advertising. Projected annual gain:{" "}
              <span className="font-semibold text-emerald-400">$45,600</span> in
              additional rewards.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleGetRecommendations} disabled={aiLoading}>
            Apply
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </motion.div>

      {/* Business Profile */}
      <GlassCard delay={0.1}>
        <h2 className="text-base font-semibold text-white">
          Your Business Profile
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Connected Accounts", value: spending.hasRealData ? `${spending.connectedAccounts.length} bank${spending.connectedAccounts.length !== 1 ? "s" : ""}` : "Not connected" },
            { label: "Monthly Spend", value: spending.hasRealData ? formatCurrency(realMonthlySpend) : "$185,000" },
            { label: "Primary Goal", value: "Luxury Travel" },
            { label: "Categories", value: spending.hasRealData ? `${spending.spendCategories.length} tracked` : "8 categories" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* AI Recommendations */}
      <AIResponsePanel
        response={aiResponse}
        loading={aiLoading}
        error={aiError}
        onClose={() => { setAiResponse(null); setAiError(null); }}
      />

      {/* Recommended Cards */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-white">
          AI-Recommended Card Setup
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {creditCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-luxury ${
                card.recommended
                  ? "border-luxury-gold/30 bg-gradient-to-br from-luxury-gold/[0.06] to-transparent"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {card.recommended && (
                <div className="absolute right-3 top-3">
                  <Badge variant="gold" size="md">
                    <Star className="mr-1 h-3 w-3" />
                    Recommended
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <CreditCard
                    className="h-6 w-6"
                    style={{ color: card.color }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{card.name}</p>
                  <p className="text-xs text-platinum-500">{card.issuer}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-platinum-500">Annual Fee</p>
                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(card.annualFee)}
                  </p>
                </div>
                {card.signupBonus && (
                  <div>
                    <p className="text-[10px] text-platinum-500">Signup Bonus</p>
                    <p className="text-sm font-semibold text-emerald-400">
                      {(card.signupBonus / 1000).toFixed(0)}K pts
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-platinum-500">Base Rate</p>
                  <p className="text-sm font-semibold text-white">
                    {card.rewardRate}x
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">
                  Bonus Categories
                </p>
                {card.bonusCategories.map((cat) => (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-1.5 text-platinum-300">
                      <Check className="h-3 w-3 text-luxury-gold" />
                      {cat.category}
                    </span>
                    <span className="font-medium text-luxury-gold">
                      {cat.multiplier}x
                      {cat.cap && (
                        <span className="ml-1 text-platinum-500">
                          (up to {formatCurrency(cat.cap)})
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {card.signupBonus && card.signupSpendReq && (
                <div className="mt-4 rounded-lg bg-white/[0.03] p-2.5">
                  <p className="text-[10px] text-platinum-400">
                    Earn{" "}
                    <span className="font-semibold text-luxury-gold">
                      {(card.signupBonus / 1000).toFixed(0)}K points
                    </span>{" "}
                    after spending {formatCurrency(card.signupSpendReq)} in 3
                    months
                  </p>
                </div>
              )}

              <a
                href={getAffiliateUrl(card.name) || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block"
              >
                <Button
                  variant={card.recommended ? "gold" : "secondary"}
                  size="sm"
                  className="w-full"
                >
                  {card.recommended ? "Apply Now" : "Learn More"}
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Optimization Strategy */}
      <GlassCard delay={0.7}>
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-luxury-gold" />
          <h2 className="text-base font-semibold text-white">
            Your Optimal Card Strategy
          </h2>
        </div>
        <div className="mt-4 space-y-3">
          {[
            {
              action: "Primary Spend",
              card: "Amex Business Platinum",
              reason: "5x on flights, 1.5x on purchases $5K+",
              impact: "+$14,200/yr",
            },
            {
              action: "Advertising",
              card: "Chase Ink Business Preferred",
              reason: "3x on advertising, internet, shipping (up to $150K)",
              impact: "+$45,600/yr",
            },
            {
              action: "Dining & Entertainment",
              card: "Amex Business Gold",
              reason: "4x on top 2 categories (auto-selected)",
              impact: "+$8,900/yr",
            },
            {
              action: "Everything Else",
              card: "Capital One Venture X",
              reason: "Flat 2x on all purchases, no category caps",
              impact: "+$6,400/yr",
            },
          ].map((strategy) => (
            <div
              key={strategy.action}
              className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3"
            >
              <div className="flex-1">
                <p className="text-xs font-medium text-luxury-gold">
                  {strategy.action}
                </p>
                <p className="text-sm font-medium text-white">
                  {strategy.card}
                </p>
                <p className="text-[11px] text-platinum-500">
                  {strategy.reason}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                <DollarSign className="h-3 w-3" />
                {strategy.impact}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-500/10 p-3">
          <p className="text-sm font-semibold text-emerald-400">
            Total Projected Annual Gain
          </p>
          <p className="stat-value text-xl font-bold text-emerald-400">
            +$75,100/yr
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
