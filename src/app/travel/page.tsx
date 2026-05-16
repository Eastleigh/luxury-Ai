"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import {
  Plane,
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRightLeft,
  Sparkles,
  Globe,
  Star,
  Clock,
  Filter,
  ArrowUpRight,
  Send,
} from "lucide-react";
import { awardResults } from "@/data/mock";
import { formatCurrency, formatPoints } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

export default function TravelPage() {
  const [conciergeQuery, setConciergeQuery] = useState("");

  const cabinColors: Record<string, string> = {
    Business: "text-blue-400",
    First: "text-luxury-gold",
    Economy: "text-platinum-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            AI Travel Concierge & Award Search
          </h1>
          <p className="mt-1 text-sm text-platinum-400">
            Natural language trip planning and award flight search powered by AI.
          </p>
        </div>
      </div>

      {/* AI Concierge */}
      <GlassCard delay={0.1} glow>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-gold/10">
            <Sparkles className="h-4 w-4 text-luxury-gold" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              AI Travel Concierge
            </h2>
            <p className="text-[10px] text-platinum-500">
              Tell me where you want to go in natural language
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={conciergeQuery}
              onChange={(e) => setConciergeQuery(e.target.value)}
              placeholder="I want to take my family to Italy in business class in September..."
              className="h-12 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 pr-12 text-sm text-white placeholder-platinum-500 outline-none transition-all focus:border-luxury-gold/30 focus:ring-1 focus:ring-luxury-gold/20"
            />
            <Send className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-platinum-500" />
          </div>
          <Button variant="gold">
            <Sparkles className="h-4 w-4" />
            Plan Trip
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Family trip to Maldives in December",
            "Business class to Tokyo, flexible dates",
            "Europe tour under 200K points",
            "First class anywhere in Asia",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setConciergeQuery(suggestion)}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[11px] text-platinum-400 transition-colors hover:border-luxury-gold/20 hover:text-white"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Search Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Available Awards"
          value="2,847"
          change="Updated 5m ago"
          trend="up"
          icon={Globe}
          delay={0.2}
        />
        <StatCard
          label="Best Value Found"
          value="8.5 cpp"
          change="ANA First Class"
          trend="up"
          icon={Star}
          iconColor="text-luxury-gold"
          delay={0.25}
        />
        <StatCard
          label="Transfer Partners"
          value="24"
          change="4 with bonuses"
          trend="up"
          icon={ArrowRightLeft}
          iconColor="text-emerald-400"
          delay={0.3}
        />
        <StatCard
          label="Saved Searches"
          value="12"
          change="3 with alerts"
          trend="up"
          icon={Search}
          iconColor="text-blue-400"
          delay={0.35}
        />
      </div>

      {/* Award Search */}
      <GlassCard delay={0.4}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            Award Search Engine
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Filter className="h-3 w-3" />
              Filters
            </Button>
            <Button variant="secondary" size="sm">
              <Clock className="h-3 w-3" />
              Set Alert
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5">
          <div className="sm:col-span-1">
            <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">
              From
            </label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-platinum-500" />
              <input
                type="text"
                defaultValue="JFK"
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] pl-9 pr-3 text-sm text-white outline-none focus:border-luxury-gold/30"
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">
              To
            </label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-platinum-500" />
              <input
                type="text"
                defaultValue="Anywhere"
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] pl-9 pr-3 text-sm text-white outline-none focus:border-luxury-gold/30"
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">
              Date
            </label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-platinum-500" />
              <input
                type="text"
                defaultValue="Sep 2025"
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] pl-9 pr-3 text-sm text-white outline-none focus:border-luxury-gold/30"
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">
              Cabin
            </label>
            <select className="mt-1 h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-white outline-none focus:border-luxury-gold/30">
              <option value="business">Business</option>
              <option value="first">First</option>
              <option value="economy">Economy</option>
            </select>
          </div>
          <div className="flex items-end sm:col-span-1">
            <Button variant="gold" className="h-9 w-full">
              <Search className="h-3.5 w-3.5" />
              Search
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Results */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            Award Availability
          </h2>
          <Badge variant="info">{awardResults.length} results</Badge>
        </div>
        <div className="space-y-3">
          {awardResults.map((result, i) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-luxury-gold/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04]">
                    <Plane className="h-5 w-5 text-luxury-gold" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {result.airline}
                      </p>
                      <Badge
                        variant={
                          result.availability === "available"
                            ? "success"
                            : result.availability === "limited"
                            ? "warning"
                            : "default"
                        }
                        size="sm"
                      >
                        {result.availability}
                      </Badge>
                    </div>
                    <p className="text-xs text-platinum-400">{result.route}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Cabin</p>
                    <p
                      className={`text-sm font-medium ${
                        cabinColors[result.cabin] || "text-white"
                      }`}
                    >
                      {result.cabin}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Points</p>
                    <p className="stat-value text-sm font-semibold text-white">
                      {formatPoints(result.pointsRequired)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Taxes</p>
                    <p className="text-sm text-platinum-300">
                      {formatCurrency(result.taxesFees)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Value</p>
                    <p className="text-sm font-semibold text-emerald-400">
                      {result.valuePerPoint} cpp
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Via</p>
                    <p className="text-xs text-luxury-gold">
                      {result.transferPartner}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Book
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
