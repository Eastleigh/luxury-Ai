"use client";

import { motion } from "framer-motion";
import { useMounted } from "@/lib/utils";
import Link from "next/link";
import {
  CreditCard,
  Plane,
  TrendingUp,
  Shield,
  BarChart3,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Users,
  DollarSign,
  Globe,
  PenTool,
  Crown,
  ChevronRight,
  Activity,
  Target,
  Award,
  Bot,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "AI Spend Analyzer",
    description:
      "Connect your Amex, Chase, and Capital One accounts. AI identifies missed rewards, inefficient spend, and optimization opportunities across every category.",
    stat: "$121K",
    statLabel: "avg. annual rewards recovered",
  },
  {
    icon: CreditCard,
    title: "AI Card Optimizer",
    description:
      "Dynamic card recommendations based on your business type, spending patterns, and travel goals. From signup bonuses to category multipliers.",
    stat: "5x",
    statLabel: "reward multiplier potential",
  },
  {
    icon: Plane,
    title: "AI Travel Concierge",
    description:
      'Type "Family trip to Italy in business class" and our AI scans award availability, checks partners, and finds the best redemption routes.',
    stat: "8.5cpp",
    statLabel: "best value per point found",
  },
  {
    icon: Globe,
    title: "Award Search Engine",
    description:
      "Search award availability across airlines and hotels. Flexible dates, transfer partner support, and real-time alerts when seats open up.",
    stat: "2,847",
    statLabel: "awards scanned live",
  },
  {
    icon: Shield,
    title: "Points Health Monitor",
    description:
      "Track expiring points, devaluation risks, and transfer bonuses. Get alerts before your points lose value or bonuses expire.",
    stat: "72",
    statLabel: "health score out of 100",
  },
  {
    icon: PenTool,
    title: "AI Content Engine",
    description:
      "Auto-generate travel deal articles, reward alerts, newsletters, and LinkedIn posts. Review and publish with one click.",
    stat: "47",
    statLabel: "articles generated this month",
  },
  {
    icon: Target,
    title: "Affiliate Revenue Engine",
    description:
      "Intelligently insert affiliate recommendations for cards, hotels, and travel insurance. Track clicks, conversions, and revenue.",
    stat: "$164K",
    statLabel: "affiliate revenue tracked",
  },
  {
    icon: Users,
    title: "CRM & Client Management",
    description:
      "Manage clients, track trip planning, reward optimization, and onboarding workflows. Built for agencies and consultants.",
    stat: "$696K",
    statLabel: "managed monthly spend",
  },
];

const testimonials = [
  {
    name: "Marcus Chen",
    role: "CEO, BuildWright Construction",
    quote:
      "We were leaving $185K in rewards on the table every year. LuxuryAI identified the right card setup and now my entire family flies business class — for free.",
    spend: "$185,000/mo",
    points: "4.2M points",
    avatar: "MC",
  },
  {
    name: "Dr. James Rivera",
    role: "Founder, Suncoast Medical Group",
    quote:
      "The AI Travel Concierge planned our family trip to the Maldives — first class flights and overwater villa, all on points. Total out of pocket: $890 in taxes.",
    spend: "$310,000/mo",
    points: "5.8M points",
    avatar: "JR",
  },
  {
    name: "Sarah Mitchell",
    role: "CEO, MediaGrowth Agency",
    quote:
      "Moving our $47K/mo ad spend to the right card unlocked 3x multipliers we never knew existed. That's $45K+ in additional annual rewards.",
    spend: "$92,000/mo",
    points: "2.1M points",
    avatar: "SM",
  },
];

const pricingTiers = [
  {
    name: "Explorer",
    price: "Free",
    period: "",
    description: "Get started with basic points tracking and AI insights.",
    features: [
      "Track up to 3 loyalty programs",
      "Basic AI recommendations",
      "Monthly optimization report",
      "Community access",
      "5 award searches per month",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "Advanced optimization for serious business spenders.",
    features: [
      "Unlimited loyalty programs",
      "Advanced AI card optimizer",
      "Real-time transfer bonus alerts",
      "Unlimited award searches",
      "AI travel concierge",
      "Points health monitoring",
      "Priority email support",
      "Custom spending reports",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Executive",
    price: "$499",
    period: "/month",
    description: "White-glove service for high-volume business owners.",
    features: [
      "Everything in Professional",
      "Dedicated travel consultant",
      "Custom card optimization strategy",
      "Employee card management",
      "Quarterly strategy reviews",
      "Direct booking assistance",
      "Priority phone support",
      "Team spending optimization",
      "VIP event access",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const targetUsers = [
  { icon: "🏗️", label: "Construction Companies" },
  { icon: "🛒", label: "eCommerce Owners" },
  { icon: "📢", label: "Advertising Agencies" },
  { icon: "🏥", label: "Medical Practices" },
  { icon: "💼", label: "Consultants" },
  { icon: "🚀", label: "High-Spend Entrepreneurs" },
];

const stats = [
  { value: "$2.4B+", label: "Annual Spend Optimized" },
  { value: "2,400+", label: "Active Members" },
  { value: "$18.7M", label: "Rewards Unlocked" },
  { value: "12.4x", label: "Average ROI" },
];

export default function LandingPage() {
  const mounted = useMounted();

  return (
    <div className="relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-luxury-gold" />
            <span className="text-xl font-bold">
              Luxury<span className="gold-gradient">AI</span>
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-platinum-400 transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-platinum-400 transition-colors hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-sm text-platinum-400 transition-colors hover:text-white"
            >
              Results
            </a>
            <a
              href="#pricing"
              className="text-sm text-platinum-400 transition-colors hover:text-white"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-platinum-400 transition-colors hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-luxury-gold px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#e0c992]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-luxury" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-luxury-gold/[0.03] blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-luxury-gold/[0.02] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={mounted ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-luxury-gold/20 bg-luxury-gold/5 px-4 py-2">
              <Sparkles className="h-4 w-4 text-luxury-gold" />
              <span className="text-sm text-luxury-gold">
                AI-Powered Financial Optimization
              </span>
            </div>

            <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Stop Leaving{" "}
              <span className="gold-gradient">$100K+ in Rewards</span> on the
              Table
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-platinum-400 md:text-xl">
              AI-powered spending optimization and luxury travel automation for
              business owners spending $20K–$500K/month. Not travel hacking —{" "}
              <span className="text-white">financial optimization.</span>
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-xl bg-luxury-gold px-8 py-4 text-lg font-semibold text-black transition-all hover:bg-[#e0c992] hover:shadow-luxury-lg"
              >
                Start Optimizing Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-4 text-lg font-semibold text-white transition-all hover:border-white/20 hover:bg-white/5"
              >
                See How It Works
              </a>
            </div>

            <p className="mt-6 text-sm text-platinum-500">
              No credit card required · Setup in 2 minutes · Cancel anytime
            </p>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm"
              >
                <div className="text-2xl font-bold gold-gradient">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-platinum-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.01] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">
              Built For
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              High-Spending Business Owners
            </h2>
            <p className="mt-2 text-platinum-400">
              Owners spending $20,000–$500,000/month on credit cards
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {targetUsers.map((user, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, scale: 0.9 } : false}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-3 text-sm"
              >
                <span>{user.icon}</span>
                <span>{user.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-red-400">
              The Problem
            </p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              You&apos;re Losing{" "}
              <span className="text-red-400">$18,400/year</span> in Rewards
            </h2>
            <p className="mt-6 text-lg text-platinum-400">
              The average business owner spending $120K/month uses the wrong
              cards for 62% of their purchases. That&apos;s over $10,000/month
              in missed rewards — enough for business class flights to Europe
              every quarter.
            </p>
          </motion.div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: DollarSign,
                value: "$121,044",
                label: "Annual rewards lost on wrong cards",
                color: "text-red-400",
              },
              {
                icon: Activity,
                value: "38%",
                label: "Average optimization rate before LuxuryAI",
                color: "text-amber-400",
              },
              {
                icon: TrendingUp,
                value: "$75,100",
                label: "Projected annual gain with optimization",
                color: "text-emerald-400",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"
              >
                <item.icon className={`mx-auto h-8 w-8 ${item.color}`} />
                <div className={`mt-3 text-3xl font-bold ${item.color}`}>
                  {item.value}
                </div>
                <p className="mt-2 text-sm text-platinum-400">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">
              Platform Features
            </p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              The Operating System for{" "}
              <span className="gold-gradient">Business Travel Rewards</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-platinum-400">
              AI-powered tools that analyze your spend, optimize your cards,
              search award flights, and automate luxury travel — all in one
              platform.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-luxury-gold/20 hover:bg-white/[0.04]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-luxury-gold/10">
                  <feature.icon className="h-6 w-6 text-luxury-gold" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-platinum-400">
                  {feature.description}
                </p>
                <div className="mt-4 border-t border-white/[0.06] pt-4">
                  <div className="text-xl font-bold gold-gradient">
                    {feature.stat}
                  </div>
                  <div className="text-xs text-platinum-500">
                    {feature.statLabel}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="border-y border-white/[0.06] bg-white/[0.01] py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">
              How It Works
            </p>
            <h2 className="mt-4 text-4xl font-bold">
              Three Steps to{" "}
              <span className="gold-gradient">Maximum Rewards</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect Your Cards",
                description:
                  "Link your Amex, Chase, Capital One, and bank accounts. Our AI immediately begins analyzing your spending patterns across all categories.",
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
                title: "Travel in Luxury",
                description:
                  "Use your optimized points for business class flights, luxury hotels, and exclusive experiences. Our concierge handles the bookings.",
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

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">
              Client Results
            </p>
            <h2 className="mt-4 text-4xl font-bold">
              Real Business Owners.{" "}
              <span className="gold-gradient">Real Results.</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-luxury-gold text-luxury-gold"
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-platinum-300">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-luxury-gold/10 text-sm font-semibold text-luxury-gold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-platinum-500">{t.role}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  <div className="rounded-lg bg-white/[0.03] px-3 py-1.5 text-xs">
                    <span className="text-platinum-500">Spend: </span>
                    <span className="font-semibold text-white">{t.spend}</span>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] px-3 py-1.5 text-xs">
                    <span className="text-platinum-500">Points: </span>
                    <span className="font-semibold text-luxury-gold">
                      {t.points}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="border-y border-white/[0.06] bg-white/[0.01] py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-luxury-gold">
              Pricing
            </p>
            <h2 className="mt-4 text-4xl font-bold">
              Financial Optimization for{" "}
              <span className="gold-gradient">High Performers</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-platinum-400">
              Choose the plan that matches your ambition. All plans include AI
              recommendations.
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
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-luxury-gold px-3 py-1 text-xs font-semibold text-black">
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
                <Link
                  href="/dashboard"
                  className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                    tier.highlighted
                      ? "bg-luxury-gold text-black hover:bg-[#e0c992]"
                      : "border border-white/10 text-white hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  {tier.cta} →
                </Link>
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
              <Award className="mx-auto h-12 w-12 text-luxury-gold" />
              <h2 className="mt-6 text-4xl font-bold md:text-5xl">
                Ready to Optimize Your{" "}
                <span className="gold-gradient">$100K+ Monthly Spend?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-platinum-400">
                Join 2,400+ business owners who have unlocked $18.7M in rewards
                with LuxuryAI.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-2 rounded-xl bg-luxury-gold px-8 py-4 text-lg font-semibold text-black transition-all hover:bg-[#e0c992]"
                >
                  Start Optimizing Free
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
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-luxury-gold" />
              <span className="font-bold">
                Luxury<span className="gold-gradient">AI</span>
              </span>
              <span className="ml-2 text-sm text-platinum-500">
                AI-Powered Spending Optimization
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#features"
                className="text-sm text-platinum-500 transition-colors hover:text-white"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm text-platinum-500 transition-colors hover:text-white"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-sm text-platinum-500 transition-colors hover:text-white"
              >
                Results
              </a>
              <Link
                href="/dashboard"
                className="text-sm text-platinum-500 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-white/[0.06] pt-8 text-center text-xs text-platinum-600">
            © 2025 LuxuryAI. All rights reserved. Not financial advice. Results
            may vary.
          </div>
        </div>
      </footer>
    </div>
  );
}
