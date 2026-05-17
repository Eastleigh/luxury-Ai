"use client";

import { ConnectedAccounts } from "@/components/plaid/ConnectedAccounts";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Building2, ShieldCheck, Zap, Globe } from "lucide-react";
import { useMounted } from "@/lib/utils";
import { motion } from "framer-motion";

export default function AccountsPage() {
  const mounted = useMounted();

  return (
    <div className="space-y-6">
      <motion.div
        initial={mounted ? { opacity: 0, y: -10 } : false}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Connected Accounts
          </h1>
          <p className="mt-1 text-sm text-platinum-400">
            Link your bank accounts and credit cards to unlock real spending
            insights and optimization.
          </p>
        </div>
        <Badge variant="gold">
          <ShieldCheck className="h-3 w-3" />
          Bank-Level Security
        </Badge>
      </motion.div>

      {/* Benefits row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Auto-Categorize Spending
              </p>
              <p className="text-xs text-platinum-400">
                AI sorts your transactions instantly
              </p>
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.15}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Building2 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                12,000+ Institutions
              </p>
              <p className="text-xs text-platinum-400">
                All major US & Canadian banks
              </p>
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.2}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luxury-gold/10">
              <Globe className="h-5 w-5 text-luxury-gold" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                US & Canada Supported
              </p>
              <p className="text-xs text-platinum-400">
                Connect accounts from both countries
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main connected accounts component */}
      <ConnectedAccounts />
    </div>
  );
}
