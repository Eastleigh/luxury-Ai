"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useMounted } from "@/lib/utils";
import Link from "next/link";
import {
  CreditCard,
  Plane,
  TrendingUp,
  Shield,
  BarChart3,
  ArrowRight,
  Check,
  Star,
  DollarSign,
  Crown,
  ChevronRight,
  Bot,
  Menu,
  X,
  Bell,
  Lock,
  Banknote,
  Calculator,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "AI Spend Analyzer",
    description:
      "Connect your Amex, Chase, and Capital One accounts. Our AI identifies missed category rewards, inefficient spend, and optimization opportunities across every transaction.",
  },
  {
    icon: CreditCard,
    title: "Card Optimization Engine",
    description:
      "Dynamic card recommendations based on your business type, spending patterns, and travel goals. From signup bonuses to category multipliers \u2014 always the right card for the right purchase.",
  },
  {
    icon: Shield,
    title: "Points Health Monitor",
    description:
      "Track expiring points, devaluation risks, and transfer bonuses across all your loyalty programs. Get alerts before your points lose value or bonuses expire.",
  },
  {
    icon: Plane,
    title: "Award Travel Search",
    description:
      "Search award availability across airlines and hotels. Flexible dates, transfer partner support, and real-time alerts when business or first class seats open up.",
  },
  {
    icon: Bell,
    title: "Transfer Bonus Alerts",
    description:
      "Real-time notifications when transfer bonuses appear \u2014 like \u201c30% Amex to Virgin bonus ends Friday.\u201d Never miss a limited-time opportunity to stretch your points further.",
  },
  {
    icon: Crown,
    title: "Executive Travel Concierge",
    description:
      "Chat-based trip planning powered by AI. Type \u201cFamily trip to Italy in business class\u201d and get optimized redemption routes, partner options, and booking guidance.",
  },
];

const valueCards = [
  {
    icon: DollarSign,
    title: "Built for $20K\u2013$500K/month business spend",
    description: "Designed for the spending patterns and card strategies that matter at scale.",
  },
  {
    icon: TrendingUp,
    title: "Find missed category rewards",
    description: "Most business owners use the wrong card for 60%+ of purchases. We fix that.",
  },
  {
    icon: Bell,
    title: "Monitor expiring points",
    description: "Track all your loyalty programs in one place with proactive expiration alerts.",
  },
  {
    icon: Plane,
    title: "Discover business & first-class award travel",
    description: "Turn your optimized points into flights and hotels your family will remember.",
  },
];

const pricingTiers = [
  {
    name: "Free Audit",
    price: "$0",
    period: "",
    description: "See what you\u2019re missing \u2014 no commitment required.",
    features: [
      "Basic missed-rewards preview",
      "Summary optimization report",
      "Limited card recommendations",
      "Email with your results",
    ],
    cta: "Get My Free Audit",
    highlighted: false,
    planKey: "free",
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For business owners spending $20K\u2013$150K/month.",
    features: [
      "AI spend analysis across all transactions",
      "Personalized card portfolio strategy",
      "Connect up to 5 bank/card accounts via Plaid",
      "Points Health monitoring + expiration alerts",
      "Unlimited award searches",
      "Real-time transfer bonus alerts",
      "AI Travel Concierge chat",
      "Monthly optimization report",
      "Priority email support",
    ],
    cta: "Start Pro",
    highlighted: true,
    planKey: "professional",
  },
  {
    name: "Executive",
    price: "$499",
    period: "/month",
    description: "For business owners spending $150K+/month.",
    features: [
      "Everything in Pro",
      "Dedicated human travel consultant",
      "Unlimited account connections",
      "Employee card strategy + team optimization",
      "Quarterly strategy reviews",
      "Award booking assistance",
      "SMS + real-time alerts",
      "Priority phone support",
    ],
    cta: "Contact Sales",
    highlighted: false,
    planKey: "executive",
  },
];

const trustItems = [
  {
    icon: Lock,
    title: "Bank connections powered by Plaid",
    description: "Industry-standard secure connections. We never see or store your bank login credentials.",
  },
  {
    icon: Banknote,
    title: "Payments processed by Stripe",
    description: "PCI-compliant payment processing. Your card details never touch our servers.",
  },
  {
    icon: Shield,
    title: "Educational recommendations only",
    description: "We are not a bank, lender, or financial advisor. All recommendations are for informational purposes.",
  },
  {
    icon: Check,
    title: "Cancel anytime",
    description: "No long-term contracts. Cancel your subscription at any time \u2014 no questions asked.",
  },
  {
    icon: Star,
    title: "Data deletion on request",
    description: "Request full deletion of your data at any time. Your financial data belongs to you.",
  },
];

export default function LandingPage() {
  const mounted = useMounted();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [monthlySpend, setMonthlySpend] = useState(50000);
  const [currentRate, setCurrentRate] = useState(1.0);
  const [targetRate, setTargetRate] = useState(2.5);

  const currentAnnual = monthlySpend * 12 * (currentRate / 100);
  const optimizedAnnual = monthlySpend * 12 * (targetRate / 100);
  const annualUpside = optimizedAnnual - currentAnnual;

  const formatCurrency = useCallback((n: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  }, []);

  const handleSubscribe = async (planKey: string) => {
    if (planKey === "free") {
      window.location.href = "/signup";
      return;
    }
    setLoadingPlan(planKey);
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Failed to connect to payment system");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#0b1120]">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#0b1120]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Crown className="h-6 w-6 text-luxury-gold" />
            <span className="text-xl font-bold tracking-tight">
              Mavaree
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-platinum-400 transition-colors hover:text-white">Features</a>
            <a href="#how-it-works" className="text-sm text-platinum-400 transition-colors hover:text-white">How It Works</a>
            <a href="#calculator" className="text-sm text-platinum-400 transition-colors hover:text-white">ROI Calculator</a>
            <a href="#pricing" className="text-sm text-platinum-400 transition-colors hover:text-white">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm text-platinum-400 transition-colors hover:text-white">Log In</Link>
            <Link href="/signup" className="hidden sm:block rounded-lg bg-luxury-gold px-4 py-2 text-sm font-semibold text-[#0b1120] transition-all hover:bg-[#e0c992]">
              Get Started
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-platinum-400 hover:bg-white/5 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-white/[0.06] bg-[#0b1120]/95 backdrop-blur-xl px-6 py-4 space-y-3"
          >
            {[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "ROI Calculator", href: "#calculator" },
              { label: "Pricing", href: "#pricing" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-platinum-400 transition-colors hover:text-white py-1"
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
              <Link href="/login" className="flex-1 text-center rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">
                Log In
              </Link>
              <Link href="/signup" className="flex-1 text-center rounded-lg bg-luxury-gold px-4 py-2 text-sm font-semibold text-[#0b1120] hover:bg-[#e0c992]">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#0b1120]" />
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-luxury-gold/[0.04] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={mounted ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              You Spend Thousands Every Month.{" "}
              <span className="gold-gradient">Mavaree Helps You Get More Back.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-platinum-400 leading-relaxed md:text-xl">
              AI-powered spend optimization for business owners in the{" "}
              <span className="text-white font-medium">US &amp; Canada</span>.
              Find missed rewards, better card strategies, transfer bonuses,
              and luxury travel opportunities from the spending you already do.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group flex items-center gap-2 rounded-xl bg-luxury-gold px-8 py-4 text-lg font-semibold text-[#0b1120] transition-all hover:bg-[#e0c992]"
              >
                Get My Free Spend Audit
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-4 text-lg font-semibold text-white transition-all hover:border-white/20 hover:bg-white/5"
              >
                See How It Works
              </a>
            </div>

            <p className="mt-6 text-sm text-platinum-500">
              No credit card required &middot; Secure bank connections via Plaid &middot; Not financial advice &middot; US &amp; Canada
            </p>
          </motion.div>

          {/* Value Cards */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {valueCards.map((card, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-left backdrop-blur-sm"
              >
                <card.icon className="h-6 w-6 text-luxury-gold mb-3" />
                <h3 className="text-sm font-semibold text-white leading-snug">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs text-platinum-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-[#0f172a]/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">
              Platform
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Six tools.{" "}
              <span className="gold-gradient">One platform.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-platinum-400">
              Everything you need to optimize your business spend, protect your points,
              and unlock luxury travel &mdash; powered by AI.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-luxury-gold/20 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-luxury-gold/10">
                  <feature.icon className="h-5 w-5 text-luxury-gold" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-platinum-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">
              How It Works
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Three steps to{" "}
              <span className="gold-gradient">better rewards</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect Your Cards",
                description:
                  "Securely link your Amex, Chase, Capital One, and bank accounts through Plaid. Our AI immediately begins analyzing your spending patterns.",
                icon: CreditCard,
              },
              {
                step: "02",
                title: "Get AI Recommendations",
                description:
                  "Receive personalized card recommendations, spending optimizations, and strategies tailored to your business type and travel goals.",
                icon: Bot,
              },
              {
                step: "03",
                title: "Optimize & Travel",
                description:
                  "Use your optimized points for business and first class flights, luxury hotels, and exclusive experiences. Our concierge helps with bookings.",
                icon: Plane,
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8"
              >
                <div className="mb-4 text-5xl font-bold text-white/[0.06]">
                  {step.step}
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-luxury-gold/10">
                  <step.icon className="h-6 w-6 text-luxury-gold" />
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-platinum-400">
                  {step.description}
                </p>
                {i < 2 && (
                  <ChevronRight className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-luxury-gold/30 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="calculator" className="py-24 bg-[#0f172a]/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">
              ROI Calculator
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              See your{" "}
              <span className="gold-gradient">potential upside</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-platinum-400">
              Estimate how much more you could earn by optimizing your business spend with Mavaree.
            </p>
          </div>

          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-platinum-300 mb-2">
                  Monthly Business Spend
                </label>
                <div>
                  <Calculator className="h-4 w-4 text-platinum-500 mb-1" />
                  <input
                    type="range"
                    min={10000}
                    max={500000}
                    step={5000}
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    className="w-full accent-[#c9a96e]"
                  />
                  <div className="mt-1 text-xl font-bold text-white">
                    {formatCurrency(monthlySpend)}<span className="text-sm font-normal text-platinum-500">/mo</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-platinum-300 mb-2">
                  Current Avg. Reward Rate
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  value={currentRate}
                  onChange={(e) => setCurrentRate(Number(e.target.value))}
                  className="w-full mt-6 accent-[#c9a96e]"
                />
                <div className="mt-1 text-xl font-bold text-white">
                  {currentRate.toFixed(1)}%
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-platinum-300 mb-2">
                  Target Optimized Rate
                </label>
                <input
                  type="range"
                  min={1.0}
                  max={5.0}
                  step={0.1}
                  value={targetRate}
                  onChange={(e) => setTargetRate(Number(e.target.value))}
                  className="w-full mt-6 accent-[#c9a96e]"
                />
                <div className="mt-1 text-xl font-bold text-white">
                  {targetRate.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-white/[0.06] pt-8 md:grid-cols-3">
              <div className="rounded-xl bg-white/[0.03] p-5 text-center">
                <p className="text-xs uppercase tracking-wider text-platinum-500">Current Annual Rewards</p>
                <p className="mt-2 text-2xl font-bold text-platinum-300">{formatCurrency(currentAnnual)}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-5 text-center">
                <p className="text-xs uppercase tracking-wider text-platinum-500">Optimized Annual Rewards</p>
                <p className="mt-2 text-2xl font-bold text-white">{formatCurrency(optimizedAnnual)}</p>
              </div>
              <div className="rounded-xl bg-luxury-gold/10 border border-luxury-gold/20 p-5 text-center">
                <p className="text-xs uppercase tracking-wider text-luxury-gold">Potential Annual Upside</p>
                <p className="mt-2 text-2xl font-bold gold-gradient">{formatCurrency(annualUpside)}</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-luxury-gold px-6 py-3 text-sm font-semibold text-[#0b1120] transition-all hover:bg-[#e0c992]"
              >
                Get My Free Spend Audit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">
              Security &amp; Trust
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Your data is{" "}
              <span className="gold-gradient">safe with us</span>
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trustItems.map((item, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-luxury-gold/10">
                  <item.icon className="h-5 w-5 text-luxury-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-platinum-500">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-[#0f172a]/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">
              Pricing
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Simple, transparent{" "}
              <span className="gold-gradient">pricing</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-platinum-400">
              Start with a free audit. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
                  tier.highlighted
                    ? "border-luxury-gold/30 bg-luxury-gold/[0.03] shadow-luxury"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-luxury-gold px-3 py-1 text-xs font-semibold text-[#0b1120]">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{tier.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && (
                      <span className="text-platinum-500">{tier.period}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-platinum-400">
                    {tier.description}
                  </p>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          tier.highlighted
                            ? "text-luxury-gold"
                            : "text-platinum-500"
                        }`}
                      />
                      <span className="text-platinum-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(tier.planKey)}
                  disabled={loadingPlan === tier.planKey}
                  className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all disabled:opacity-60 ${
                    tier.highlighted
                      ? "bg-luxury-gold text-[#0b1120] hover:bg-[#e0c992]"
                      : "border border-white/10 text-white hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  {loadingPlan === tier.planKey ? "Processing..." : `${tier.cta} \u2192`}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={mounted ? { opacity: 0, scale: 0.98 } : false}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-luxury-gold/20 bg-gradient-to-br from-luxury-gold/10 via-transparent to-luxury-gold/5 p-12 text-center md:p-20"
          >
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-luxury-gold/[0.05] blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-luxury-gold/[0.05] blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                Ready to optimize your{" "}
                <span className="gold-gradient">business spend?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-platinum-400">
                Start with a free audit and see exactly where you&apos;re leaving rewards on the table.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="group flex items-center gap-2 rounded-xl bg-luxury-gold px-8 py-4 text-lg font-semibold text-[#0b1120] transition-all hover:bg-[#e0c992]"
                >
                  Get My Free Spend Audit
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#pricing"
                  className="text-sm text-platinum-400 underline decoration-platinum-700 underline-offset-4 transition-colors hover:text-white"
                >
                  View pricing plans
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-luxury-gold" />
                <span className="font-bold tracking-tight">Mavaree</span>
              </div>
              <p className="mt-3 text-sm text-platinum-500 leading-relaxed">
                AI-powered spend optimization for business owners in the US &amp; Canada.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
              <div className="flex flex-col gap-2">
                <a href="#features" className="text-sm text-platinum-500 transition-colors hover:text-white">Features</a>
                <a href="#pricing" className="text-sm text-platinum-500 transition-colors hover:text-white">Pricing</a>
                <a href="#how-it-works" className="text-sm text-platinum-500 transition-colors hover:text-white">How It Works</a>
                <a href="#calculator" className="text-sm text-platinum-500 transition-colors hover:text-white">ROI Calculator</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
              <div className="flex flex-col gap-2">
                <Link href="/privacy" className="text-sm text-platinum-500 transition-colors hover:text-white">Privacy Policy</Link>
                <Link href="/terms" className="text-sm text-platinum-500 transition-colors hover:text-white">Terms of Service</Link>
                <a href="mailto:support@mavaree.com" className="text-sm text-platinum-500 transition-colors hover:text-white">Contact Us</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Get Started</h4>
              <div className="flex flex-col gap-2">
                <Link href="/signup" className="text-sm text-platinum-500 transition-colors hover:text-white">Free Spend Audit</Link>
                <Link href="/login" className="text-sm text-platinum-500 transition-colors hover:text-white">Sign In</Link>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/[0.06] pt-8">
            <p className="text-xs text-platinum-600 leading-relaxed max-w-4xl">
              Mavaree provides educational rewards optimization tools. We are not a bank, lender, financial advisor,
              tax advisor, or credit card issuer. Results vary based on eligibility, spending patterns, card approvals,
              issuer rules, and redemption availability.
            </p>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-platinum-600">
              &copy; 2026 Mavaree. All rights reserved.
            </p>
            <p className="text-xs text-platinum-600">
              Bank connections via Plaid &middot; Payments via Stripe &middot; US &amp; Canada
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
