"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { membershipTiers } from "@/data/mock";
import {
  Check,
  Crown,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn, useMounted } from "@/lib/utils";

export default function PricingPage() {
  const mounted = useMounted();
  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge variant="gold" size="md">
            <Crown className="mr-1 h-3 w-3" />
            Membership
          </Badge>
          <h1 className="mt-4 text-3xl font-bold text-white">
            Financial Optimization for{" "}
            <span className="gold-gradient">High Performers</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-platinum-400">
            Unlock the full power of AI-driven spending optimization and luxury
            travel automation. Choose the plan that matches your ambition.
          </p>
        </motion.div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
        {membershipTiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className={cn(
              "relative flex flex-col rounded-2xl border p-6 transition-all duration-300",
              tier.highlighted
                ? "border-luxury-gold/30 bg-gradient-to-b from-luxury-gold/[0.08] to-transparent shadow-luxury-lg"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
            )}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="gold" size="md">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center gap-2">
                {i === 0 && <Shield className="h-5 w-5 text-platinum-400" />}
                {i === 1 && <Zap className="h-5 w-5 text-luxury-gold" />}
                {i === 2 && <Crown className="h-5 w-5 text-luxury-gold" />}
                <h3 className="text-lg font-semibold text-white">
                  {tier.name}
                </h3>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="stat-value text-4xl font-bold text-white">
                  {tier.price}
                </span>
                {tier.price !== "Free" && (
                  <span className="text-sm text-platinum-500">/month</span>
                )}
              </div>
              <p className="mt-2 text-xs text-platinum-400">
                {tier.description}
              </p>
            </div>

            <div className="flex-1 space-y-3">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 flex-shrink-0",
                      tier.highlighted ? "text-luxury-gold" : "text-platinum-400"
                    )}
                  />
                  <span className="text-sm text-platinum-300">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              variant={tier.highlighted ? "gold" : i === 2 ? "secondary" : "secondary"}
              size="lg"
              className="mt-6 w-full"
            >
              {tier.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Trust Section */}
      <motion.div
        initial={mounted ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white">
            Trusted by Business Owners Managing{" "}
            <span className="gold-gradient">$2.4B+</span> in Annual Spend
          </h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              { label: "Active Members", value: "2,400+" },
              { label: "Annual Rewards Unlocked", value: "$18.7M" },
              { label: "Average ROI", value: "12.4x" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="stat-value text-xl font-bold text-luxury-gold">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] text-platinum-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* FAQ */}
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-center text-lg font-semibold text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "How quickly will I see results?",
              a: "Most members see optimization opportunities within 24 hours of connecting their accounts. The AI analyzes your spending patterns instantly and provides actionable recommendations.",
            },
            {
              q: "Is my financial data secure?",
              a: "We use bank-level encryption and never store your card numbers. Connections are made through Plaid, the same infrastructure used by major financial institutions.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes, all plans are month-to-month with no long-term commitment. Cancel anytime from your dashboard.",
            },
            {
              q: "What types of businesses benefit most?",
              a: "Any business spending $20,000+/month on cards. Our top clients include agencies, ecommerce operators, medical practices, construction companies, and consultants.",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <p className="text-sm font-medium text-white">{faq.q}</p>
              <p className="mt-1.5 text-xs text-platinum-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
