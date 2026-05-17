"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import {
  Users,
  DollarSign,
  Plane,
  UserPlus,
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  ArrowUpRight,
  Sparkles,
  Building2,
  Calendar,
  StickyNote,
  Crown,
  BarChart3,
  Target,
} from "lucide-react";
import { clients, affiliateLinks } from "@/data/mock";
import { formatCurrency, formatPoints, useMounted } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CrmPage() {
  const mounted = useMounted();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const totalManagedSpend = clients.reduce((s, c) => s + c.monthlySpend, 0);
  const totalTrips = clients.reduce((s, c) => s + c.trips, 0);
  const totalAffRevenue = affiliateLinks.reduce((s, a) => s + a.revenue, 0);

  const tierColors: Record<string, string> = {
    executive: "gold",
    pro: "info",
    free: "default",
  } as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            CRM & Client Management
          </h1>
          <p className="mt-1 text-sm text-platinum-400">
            Manage clients, track affiliate revenue, and oversee trip planning.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.location.href = "/admin"}>
            <BarChart3 className="h-4 w-4" />
            Reports
          </Button>
          <Button variant="gold" onClick={() => setShowAddClient(!showAddClient)}>
            <UserPlus className="h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {showAddClient && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-luxury-gold/20 bg-luxury-gold/[0.03] p-5"
        >
          <h3 className="text-sm font-semibold text-white">Add New Client</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input placeholder="Full Name" className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30" />
            <input placeholder="Company" className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30" />
            <input placeholder="Email" type="email" className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30" />
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="gold" size="sm" onClick={() => setShowAddClient(false)}>Save Client</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAddClient(false)}>Cancel</Button>
          </div>
          <p className="mt-2 text-[10px] text-platinum-500">Client data will be stored locally. Connect to a CRM backend for persistent storage.</p>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Clients"
          value={clients.length.toString()}
          change="+3 this month"
          trend="up"
          icon={Users}
          delay={0.1}
        />
        <StatCard
          label="Managed Spend"
          value={formatCurrency(totalManagedSpend)}
          change="/month"
          trend="up"
          icon={DollarSign}
          iconColor="text-emerald-400"
          delay={0.15}
        />
        <StatCard
          label="Trips Booked"
          value={totalTrips.toString()}
          change="+8 this quarter"
          trend="up"
          icon={Plane}
          iconColor="text-blue-400"
          delay={0.2}
        />
        <StatCard
          label="Affiliate Revenue"
          value={formatCurrency(totalAffRevenue)}
          change="+24% MoM"
          trend="up"
          icon={Target}
          iconColor="text-luxury-gold"
          delay={0.25}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Client List */}
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Clients</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-platinum-500" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-56 rounded-lg border border-white/[0.06] bg-white/[0.03] pl-9 pr-3 text-xs text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30"
              />
            </div>
          </div>

          {clients.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.company.toLowerCase().includes(searchQuery.toLowerCase())).map((client, i) => (
            <motion.div
              key={client.id}
              initial={mounted ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-luxury-gold/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5">
                    <span className="text-sm font-semibold text-luxury-gold">
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {client.name}
                      </p>
                      <Badge
                        variant={
                          tierColors[client.tier] as
                            | "gold"
                            | "info"
                            | "default"
                        }
                        size="sm"
                      >
                        <Crown className="mr-0.5 h-2.5 w-2.5" />
                        {client.tier}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-platinum-500">
                      <Building2 className="h-3 w-3" />
                      {client.company}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded-lg p-1.5 text-platinum-500 hover:bg-white/5 hover:text-white">
                    <Mail className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-lg p-1.5 text-platinum-500 hover:bg-white/5 hover:text-white">
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-lg p-1.5 text-platinum-500 hover:bg-white/5 hover:text-white">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-3">
                <div>
                  <p className="text-[10px] text-platinum-500">Monthly Spend</p>
                  <p className="stat-value text-sm font-semibold text-white">
                    {formatCurrency(client.monthlySpend)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-platinum-500">Total Points</p>
                  <p className="stat-value text-sm font-semibold text-luxury-gold">
                    {formatPoints(client.totalPoints)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-platinum-500">Trips Booked</p>
                  <p className="stat-value text-sm font-semibold text-white">
                    {client.trips}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-platinum-500">Last Active</p>
                  <p className="text-xs text-platinum-300">
                    {new Date(client.lastActive).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {client.notes.length > 0 && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-white/[0.02] p-2">
                  <StickyNote className="mt-0.5 h-3 w-3 flex-shrink-0 text-platinum-500" />
                  <p className="text-[11px] text-platinum-400">
                    {client.notes[0]}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Affiliate Revenue */}
        <div className="space-y-6">
          <GlassCard delay={0.5}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Affiliate Revenue
              </h2>
              <Badge variant="gold">{formatCurrency(totalAffRevenue)}</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {affiliateLinks.map((link) => (
                <div
                  key={link.id}
                  className="rounded-xl bg-white/[0.02] p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-white">
                      {link.cardName}
                    </p>
                    <span className="stat-value text-xs font-semibold text-emerald-400">
                      {formatCurrency(link.revenue)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-[10px] text-platinum-500">
                    <span>{link.clicks.toLocaleString()} clicks</span>
                    <span>{link.conversions} conversions</span>
                    <span>
                      {((link.conversions / link.clicks) * 100).toFixed(1)}% CVR
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard delay={0.6}>
            <h2 className="text-base font-semibold text-white">
              Quick Actions
            </h2>
            <div className="mt-3 space-y-2">
              {[
                { label: "Send Optimization Report", icon: Mail },
                { label: "Schedule Strategy Call", icon: Calendar },
                { label: "Generate Client Review", icon: Sparkles },
                { label: "Export Data", icon: ArrowUpRight },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-platinum-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  <action.icon className="h-3.5 w-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
