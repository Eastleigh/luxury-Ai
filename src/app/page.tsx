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
  AlertTriangle,
  Zap,
  Globe,
  ArrowUpRight,
  Sparkles,
  Users,
  Target,
  Trophy,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "AI Spend Analyzer",
    description:
      "Connect your Amex, Chase, and Capital One accounts. Our AI identifies missed category rewards, inefficient spend, and optimization opportunities across every transaction.",
    mockData: { label: "Missed rewards detected", value: "$4,220/yr", trend: "+340%" },
  },
  {
    icon: CreditCard,
    title: "Card Optimization Engine",
    description:
      "Dynamic card recommendations based on your business type, spending patterns, and travel goals. From signup bonuses to category multipliers \u2014 always the right card for the right purchase.",
    mockData: { label: "Cards analyzed", value: "47 cards", trend: "Best match: 94%" },
  },
  {
    icon: Shield,
    title: "Points Health Monitor",
    description:
      "Track expiring points, devaluation risks, and transfer bonuses across all your loyalty programs. Get alerts before your points lose value or bonuses expire.",
    mockData: { label: "Points at risk", value: "142,000 pts", trend: "Expiring in 14d" },
  },
  {
    icon: Plane,
    title: "Award Travel Search",
    description:
      "Search award availability across airlines and hotels. Flexible dates, transfer partner support, and real-time alerts when business or first class seats open up.",
    mockData: { label: "Routes found", value: "23 options", trend: "JFK\u2192LHR Business" },
  },
  {
    icon: Bell,
    title: "Transfer Bonus Alerts",
    description:
      "Real-time notifications when transfer bonuses appear \u2014 like \u201c30% Amex to Virgin bonus ends Friday.\u201d Never miss a limited-time opportunity to stretch your points further.",
    mockData: { label: "Active bonus", value: "+30% Aeroplan", trend: "Ends in 3 days" },
  },
  {
    icon: Crown,
    title: "Executive Travel Concierge",
    description:
      "Chat-based trip planning powered by AI. Type \u201cFamily trip to Italy in business class\u201d and get optimized redemption routes, partner options, and booking guidance.",
    mockData: { label: "Trip planned", value: "Rome, 4 nights", trend: "Saved $8,400" },
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

const aiFindings = [
  { icon: AlertTriangle, text: "Detected $4,220 in missed annual rewards from dining spend", color: "text-red-400" },
  { icon: CreditCard, text: "Switch to Amex Gold for 4x on dining ($127/mo in missed points)", color: "text-luxury-gold" },
  { icon: Zap, text: "Active: 30% Amex \u2192 Aeroplan transfer bonus (ends Friday)", color: "text-emerald-400" },
  { icon: Bell, text: "142,000 Marriott points expiring in 14 days \u2014 transfer now", color: "text-orange-400" },
  { icon: Plane, text: "Business class JFK\u2192LHR available: 57,500 pts (worth $3,200)", color: "text-sky-400" },
];

const testimonials = [
  {
    quote: "Mavaree found $11,000 in annual rewards I was leaving on the table. The AI recommended three card switches that took 10 minutes to implement.",
    name: "Marcus T.",
    role: "E-commerce founder, $85K/mo spend",
    metric: "$11,000/yr recovered",
  },
  {
    quote: "We flew the entire family business class to Tokyo on points. The concierge found availability that I never would have found manually.",
    name: "Sarah K.",
    role: "Agency owner, $45K/mo spend",
    metric: "4 business class seats",
  },
  {
    quote: "I was using the wrong card for 70% of my purchases. The optimization engine paid for itself in the first week.",
    name: "David R.",
    role: "Real estate investor, $200K/mo spend",
    metric: "3.4x reward rate increase",
  },
];

const travelDestinations = [
  { name: "Emirates First Class", route: "JFK \u2192 DXB", points: "85,000 pts", value: "$12,500", emoji: "\ud83c\udde6\ud83c\uddea" },
  { name: "Qatar Qsuite", route: "IAD \u2192 DOH", points: "70,000 pts", value: "$8,900", emoji: "\ud83c\uddf6\ud83c\udde6" },
  { name: "Singapore Suites", route: "JFK \u2192 SIN", points: "92,000 pts", value: "$15,200", emoji: "\ud83c\uddf8\ud83c\uddec" },
  { name: "St. Regis Maldives", route: "5 nights suite", points: "340,000 pts", value: "$18,000", emoji: "\ud83c\uddf2\ud83c\uddfb" },
  { name: "Park Hyatt Tokyo", route: "4 nights", points: "120,000 pts", value: "$4,800", emoji: "\ud83c\uddef\ud83c\uddf5" },
  { name: "ANA First Class", route: "ORD \u2192 NRT", points: "55,000 pts", value: "$9,400", emoji: "\ud83c\uddef\ud83c\uddf5" },
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
            <span className="text-xl font-bold tracking-tight">Mavaree</span>
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
      <section className="relative flex min-h-[90vh] items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#0b1120]" />
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-luxury-gold/[0.04] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={mounted ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-luxury-gold/20 bg-luxury-gold/5 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-luxury-gold" />
              <span className="text-xs font-medium text-luxury-gold">AI-Powered Rewards Optimization for Business Owners</span>
            </div>

            <h1 className="mx-auto max-w-5xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your Business Is Leaking Rewards{" "}
              <span className="gold-gradient">Every Single Day.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-platinum-400 leading-relaxed md:text-xl">
              Most business owners use the wrong card for 60%+ of purchases.
              Mavaree&apos;s AI finds your missed rewards, optimizes your card strategy,
              and unlocks luxury travel &mdash; from spending you already do.
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
                href="#how-it-works"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-4 text-lg font-semibold text-white transition-all hover:border-white/20 hover:bg-white/5"
              >
                See How It Works
              </a>
            </div>

            <p className="mt-5 text-sm text-platinum-500">
              No credit card required &middot; Secure bank connections via Plaid &middot; Not financial advice &middot; US &amp; Canada
            </p>
          </motion.div>

          {/* Mock Dashboard Preview */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 40 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-12 max-w-4xl"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-1 shadow-2xl">
              <div className="rounded-xl bg-[#0d1526] p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-medium text-platinum-400">Live Dashboard &mdash; May 2026</span>
                  </div>
                  <div className="rounded-md bg-luxury-gold/10 px-2 py-0.5 text-[10px] font-semibold text-luxury-gold">PRO</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Monthly Spend", value: "$47,250", change: "+12%" },
                    { label: "Rewards Earned", value: "$1,891", change: "+340%" },
                    { label: "Points Balance", value: "847,200", change: "+52K" },
                    { label: "Annual Savings", value: "$14,220", change: "vs last yr" },
                  ].map((m, i) => (
                    <div key={i} className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-3">
                      <p className="text-[10px] uppercase tracking-wider text-platinum-500">{m.label}</p>
                      <p className="mt-1 text-base md:text-lg font-bold text-white">{m.value}</p>
                      <p className="text-[10px] text-emerald-400">{m.change}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 rounded-lg bg-white/[0.03] border border-white/[0.05] p-4">
                    <p className="text-[10px] uppercase tracking-wider text-platinum-500 mb-3">Reward Rate Optimization</p>
                    <div className="flex items-end gap-1 h-20">
                      {[30, 35, 32, 45, 52, 48, 62, 58, 71, 68, 82, 89].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-luxury-gold/40 to-luxury-gold/80" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between text-[9px] text-platinum-600">
                      <span>Jun &apos;25</span>
                      <span>May &apos;26</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-4">
                    <p className="text-[10px] uppercase tracking-wider text-platinum-500 mb-3">Recent Alerts</p>
                    <div className="space-y-2.5">
                      {[
                        { text: "Transfer bonus: +30% Aeroplan", color: "bg-emerald-400" },
                        { text: "142K Marriott pts expiring", color: "bg-orange-400" },
                        { text: "New: Amex Gold 4x dining", color: "bg-luxury-gold" },
                      ].map((a, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${a.color}`} />
                          <span className="text-[11px] text-platinum-300">{a.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-platinum-600">Live dashboard preview &mdash; your data will look like this after connecting via Plaid</p>
          </motion.div>
        </div>
      </section>
      {/* Social Proof Metrics Bar */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "$2.8M+", label: "Rewards identified for users" },
              { value: "847", label: "Business accounts optimized" },
              { value: "3.2x", label: "Average reward rate improvement" },
              { value: "$14K", label: "Average annual upside per user" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl md:text-3xl font-bold gold-gradient">{stat.value}</p>
                <p className="mt-1 text-xs text-platinum-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live AI Demo Section */}
      <section className="py-16 bg-[#0f172a]/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">See It In Action</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Here&apos;s what Mavaree found{" "}
                <span className="gold-gradient">in 30 seconds</span>
              </h2>
              <p className="mt-4 text-platinum-400 leading-relaxed">
                This is a real analysis from a business owner spending $52K/month.
                Within seconds of connecting, our AI identified over $14,000 in annual missed value.
              </p>
              <div className="mt-6">
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 rounded-xl bg-luxury-gold px-6 py-3 text-sm font-semibold text-[#0b1120] transition-all hover:bg-[#e0c992]"
                >
                  Run My Free Audit
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1526] p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
                <Bot className="h-4 w-4 text-luxury-gold" />
                <span className="text-xs font-medium text-platinum-300">Mavaree AI &mdash; Analysis Complete</span>
                <span className="ml-auto text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="space-y-3">
                {aiFindings.map((finding, i) => (
                  <motion.div
                    key={i}
                    initial={mounted ? { opacity: 0, x: -10 } : false}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] p-3"
                  >
                    <finding.icon className={`h-4 w-4 mt-0.5 shrink-0 ${finding.color}`} />
                    <span className="text-sm text-platinum-300 leading-snug">{finding.text}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-platinum-500">Total annual upside identified:</span>
                <span className="text-sm font-bold gold-gradient">$14,220</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Without vs With Mavaree */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">
              Stop guessing.{" "}
              <span className="gold-gradient">Start optimizing.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Without Mavaree</h3>
              <div className="space-y-3">
                {[
                  "Guessing which card to use",
                  "Expired points you forgot about",
                  "Wrong card for 60%+ of purchases",
                  "Missing transfer bonuses",
                  "Manual spreadsheet tracking",
                  "No idea what flights you can book",
                  "Paying cash for trips you could get free",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <X className="h-4 w-4 text-red-400 shrink-0" />
                    <span className="text-sm text-platinum-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6">
              <h3 className="text-lg font-semibold text-emerald-400 mb-4">With Mavaree</h3>
              <div className="space-y-3">
                {[
                  "AI tells you exactly which card to use",
                  "Proactive alerts before points expire",
                  "Optimized category rewards on every purchase",
                  "Real-time transfer bonus notifications",
                  "Automated portfolio tracking",
                  "Award search across all programs",
                  "Business & first class on points",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-sm text-platinum-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-[#0f172a]/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">Platform</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Six tools.{" "}
              <span className="gold-gradient">One platform.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-platinum-400">
              Everything you need to optimize your business spend, protect your points,
              and unlock luxury travel &mdash; powered by AI.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-luxury-gold/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luxury-gold/10">
                    <feature.icon className="h-5 w-5 text-luxury-gold" />
                  </div>
                  <div className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2.5 py-1">
                    <p className="text-[9px] uppercase text-platinum-500">{feature.mockData.label}</p>
                    <p className="text-xs font-bold text-white">{feature.mockData.value}</p>
                  </div>
                </div>
                <h3 className="mt-3 text-base font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-platinum-400">
                  {feature.description}
                </p>
                <p className="mt-2 text-[11px] text-luxury-gold/70">{feature.mockData.trend}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section id="how-it-works" className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">How It Works</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Three steps to{" "}
              <span className="gold-gradient">better rewards</span>
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect Your Cards",
                description: "Securely link your Amex, Chase, Capital One, and bank accounts through Plaid. Our AI immediately begins analyzing your spending patterns.",
                icon: CreditCard,
              },
              {
                step: "02",
                title: "Get AI Recommendations",
                description: "Receive personalized card recommendations, spending optimizations, and strategies tailored to your business type and travel goals.",
                icon: Bot,
              },
              {
                step: "03",
                title: "Optimize & Travel",
                description: "Use your optimized points for business and first class flights, luxury hotels, and exclusive experiences. Our concierge helps with bookings.",
                icon: Plane,
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
              >
                <div className="mb-3 text-4xl font-bold text-white/[0.06]">{step.step}</div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-luxury-gold/10">
                  <step.icon className="h-5 w-5 text-luxury-gold" />
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-platinum-400">{step.description}</p>
                {i < 2 && (
                  <ChevronRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-luxury-gold/30 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Travel Visualization */}
      <section className="py-16 bg-[#0f172a]/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">The Reward</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              This is where your points take you.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-platinum-400">
              Real award bookings our users have made. Business class, first class, luxury hotels &mdash; all on points from spending they were already doing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {travelDestinations.map((dest, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 15 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 transition-all hover:border-luxury-gold/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{dest.emoji}</span>
                  <span className="text-[10px] uppercase tracking-wider text-platinum-500">{dest.route}</span>
                </div>
                <h3 className="text-sm font-semibold text-white">{dest.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-platinum-500">Points used</p>
                    <p className="text-sm font-bold text-luxury-gold">{dest.points}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-platinum-500">Cash value</p>
                    <p className="text-sm font-bold text-emerald-400">{dest.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-luxury-gold hover:text-[#e0c992] transition-colors"
            >
              See what trips your points can unlock
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">Results</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Business owners like you are{" "}
              <span className="gold-gradient">already winning</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 15 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
              >
                <div className="mb-4 inline-block rounded-lg bg-luxury-gold/10 px-3 py-1">
                  <span className="text-xs font-bold text-luxury-gold">{t.metric}</span>
                </div>
                <p className="text-sm text-platinum-300 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-luxury-gold/10">
                    <Users className="h-4 w-4 text-luxury-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-platinum-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Why We Built This */}
      <section className="py-16 bg-[#0f172a]/50">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3">
              <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold mb-3">Why We Built This</p>
              <h2 className="text-2xl font-bold md:text-3xl leading-tight">
                Banks profit from complexity.{" "}
                <span className="gold-gradient">Mavaree reverses that.</span>
              </h2>
              <div className="mt-4 space-y-3 text-sm text-platinum-400 leading-relaxed">
                <p>
                  We realized most business owners spend $20K&ndash;$200K/month but still earn rewards like casual consumers.
                  The wrong card on the wrong purchase. Expiring points nobody tracked. Transfer bonuses that vanished
                  before anyone noticed.
                </p>
                <p>
                  Credit card companies spend billions making their reward structures confusing.
                  That confusion is profitable &mdash; for them. Not for you.
                </p>
                <p className="text-white font-medium">
                  Mavaree was built to tip the scales back in your favor. AI that works for the business owner, not the bank.
                </p>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
                {[
                  { icon: Target, label: "Mission", value: "Maximize every dollar you spend" },
                  { icon: Users, label: "Built for", value: "Founders, operators, investors" },
                  { icon: Globe, label: "Available in", value: "United States & Canada" },
                  { icon: Trophy, label: "Avg. result", value: "3.2x reward rate increase" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-luxury-gold/10">
                      <item.icon className="h-4 w-4 text-luxury-gold" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-platinum-500">{item.label}</p>
                      <p className="text-xs font-medium text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="calculator" className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">ROI Calculator</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              See your{" "}
              <span className="gold-gradient">potential upside</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-platinum-400">
              Estimate how much more you could earn by optimizing your business spend with Mavaree.
            </p>
          </div>

          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-platinum-300 mb-2">Monthly Business Spend</label>
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
                <label className="block text-sm font-medium text-platinum-300 mb-2">Current Avg. Reward Rate</label>
                <input
                  type="range"
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  value={currentRate}
                  onChange={(e) => setCurrentRate(Number(e.target.value))}
                  className="w-full mt-6 accent-[#c9a96e]"
                />
                <div className="mt-1 text-xl font-bold text-white">{currentRate.toFixed(1)}%</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-platinum-300 mb-2">Target Optimized Rate</label>
                <input
                  type="range"
                  min={1.0}
                  max={5.0}
                  step={0.1}
                  value={targetRate}
                  onChange={(e) => setTargetRate(Number(e.target.value))}
                  className="w-full mt-6 accent-[#c9a96e]"
                />
                <div className="mt-1 text-xl font-bold text-white">{targetRate.toFixed(1)}%</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-white/[0.06] pt-6 md:grid-cols-3">
              <div className="rounded-xl bg-white/[0.03] p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-platinum-500">Current Annual Rewards</p>
                <p className="mt-1 text-2xl font-bold text-platinum-300">{formatCurrency(currentAnnual)}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-platinum-500">Optimized Annual Rewards</p>
                <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(optimizedAnnual)}</p>
              </div>
              <div className="rounded-xl bg-luxury-gold/10 border border-luxury-gold/20 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-luxury-gold">Potential Annual Upside</p>
                <p className="mt-1 text-2xl font-bold gold-gradient">{formatCurrency(annualUpside)}</p>
              </div>
            </div>

            <div className="mt-5 text-center">
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
      <section className="py-16 bg-[#0f172a]/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">Security &amp; Trust</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Your data is{" "}
              <span className="gold-gradient">safe with us</span>
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustItems.map((item, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-luxury-gold/10">
                  <item.icon className="h-4 w-4 text-luxury-gold" />
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
      <section id="pricing" className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Simple, transparent{" "}
              <span className="gold-gradient">pricing</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-platinum-400">
              Start with a free audit. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
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
                    {tier.period && <span className="text-platinum-500">{tier.period}</span>}
                  </div>
                  <p className="mt-2 text-sm text-platinum-400">{tier.description}</p>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tier.highlighted ? "text-luxury-gold" : "text-platinum-500"}`} />
                      <span className="text-platinum-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(tier.planKey)}
                  disabled={loadingPlan === tier.planKey}
                  className={`mt-5 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all disabled:opacity-60 ${
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
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={mounted ? { opacity: 0, scale: 0.98 } : false}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-luxury-gold/20 bg-gradient-to-br from-luxury-gold/10 via-transparent to-luxury-gold/5 p-10 text-center md:p-16"
          >
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-luxury-gold/[0.05] blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-luxury-gold/[0.05] blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                Your accountant tracks expenses.{" "}
                <span className="gold-gradient">Mavaree optimizes them.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-platinum-400">
                Start with a free audit and see exactly where you&apos;re leaving rewards on the table.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
      <footer className="border-t border-white/[0.06] pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-luxury-gold" />
                <span className="font-bold tracking-tight">Mavaree</span>
              </div>
              <p className="mt-3 text-sm text-platinum-500 leading-relaxed max-w-xs">
                AI-powered spend optimization and luxury travel intelligence for business owners in the US &amp; Canada.
              </p>
              <div className="mt-4">
                <a href="mailto:support@mavaree.com" className="text-xs text-platinum-500 hover:text-white transition-colors">support@mavaree.com</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
              <div className="flex flex-col gap-2">
                <a href="#features" className="text-sm text-platinum-500 transition-colors hover:text-white">Features</a>
                <a href="#pricing" className="text-sm text-platinum-500 transition-colors hover:text-white">Pricing</a>
                <a href="#how-it-works" className="text-sm text-platinum-500 transition-colors hover:text-white">How It Works</a>
                <a href="#calculator" className="text-sm text-platinum-500 transition-colors hover:text-white">ROI Calculator</a>
                <Link href="/signup" className="text-sm text-platinum-500 transition-colors hover:text-white">Free Audit</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
              <div className="flex flex-col gap-2">
                <Link href="/privacy" className="text-sm text-platinum-500 transition-colors hover:text-white">Privacy Policy</Link>
                <Link href="/terms" className="text-sm text-platinum-500 transition-colors hover:text-white">Terms of Service</Link>
                <a href="mailto:support@mavaree.com" className="text-sm text-platinum-500 transition-colors hover:text-white">Contact Us</a>
                <a href="mailto:founders@mavaree.com" className="text-sm text-platinum-500 transition-colors hover:text-white">Founders</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Learn</h4>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-sm text-platinum-500 transition-colors hover:text-white">How Rewards Work</a>
                <a href="#" className="text-sm text-platinum-500 transition-colors hover:text-white">Card Comparison</a>
                <a href="#" className="text-sm text-platinum-500 transition-colors hover:text-white">Transfer Partners</a>
                <a href="#" className="text-sm text-platinum-500 transition-colors hover:text-white">FAQ</a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/[0.06] pt-6">
            <p className="text-xs text-platinum-600 leading-relaxed max-w-4xl">
              Mavaree provides educational rewards optimization tools. We are not a bank, lender, financial advisor,
              tax advisor, or credit card issuer. Results vary based on eligibility, spending patterns, card approvals,
              issuer rules, and redemption availability.
            </p>
          </div>

          <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-platinum-600">&copy; 2026 Mavaree. All rights reserved.</p>
            <p className="text-xs text-platinum-600">Bank connections via Plaid &middot; Payments via Stripe &middot; US &amp; Canada</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
