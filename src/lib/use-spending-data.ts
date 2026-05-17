"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./auth-context";
import { getSupabase } from "./supabase";
import type { SpendCategory } from "@/types";

interface RawTransaction {
  id: string;
  amount: number;
  category: string;
  merchant_name: string;
  date: string;
  card_used: string;
}

interface ConnectedAccountRow {
  id: string;
  institution_name: string;
  account_type: string;
  account_mask: string;
  connected_at: string;
}

interface MonthlySpend {
  month: string;
  spend: number;
  rewards: number;
}

interface CategoryBreakdownItem {
  name: string;
  value: number;
  color: string;
}

export interface SpendingData {
  transactions: RawTransaction[];
  connectedAccounts: ConnectedAccountRow[];
  monthlySpend: number;
  totalSpendLast30Days: number;
  monthlySpendData: MonthlySpend[];
  spendCategories: SpendCategory[];
  categoryBreakdown: CategoryBreakdownItem[];
  hasRealData: boolean;
  loading: boolean;
  userName: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Food and Drink": "#ef4444",
  "Travel": "#f59e0b",
  "Transportation": "#06b6d4",
  "Shopping": "#8b5cf6",
  "Entertainment": "#ec4899",
  "Payment": "#10b981",
  "Transfer": "#2563eb",
  "Recreation": "#f97316",
  "Service": "#6366f1",
  "Uncategorized": "#9ca3af",
};

function getCategoryColor(name: string): string {
  return CATEGORY_COLORS[name] || CATEGORY_COLORS["Uncategorized"];
}

export function useSpendingData(): SpendingData {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<RawTransaction[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("there");

  const fetchData = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    // Get user's display name
    const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";
    setUserName(name);

    // Fetch connected accounts
    const { data: accounts } = await supabase
      .from("connected_accounts")
      .select("id, institution_name, account_type, account_mask, connected_at")
      .eq("user_id", user.id)
      .order("connected_at", { ascending: false });

    setConnectedAccounts(accounts || []);

    // Fetch transactions from last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const startDate = sixMonthsAgo.toISOString().split("T")[0];

    const { data: txData } = await supabase
      .from("transactions")
      .select("id, amount, category, merchant_name, date, card_used")
      .eq("user_id", user.id)
      .gte("date", startDate)
      .order("date", { ascending: false });

    setTransactions(txData || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const hasRealData = connectedAccounts.length > 0 && transactions.length > 0;

  // Compute monthly spend (current month)
  const now = new Date();
  const currentMonthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const currentMonthTxs = transactions.filter((tx) => tx.date >= currentMonthStart);
  const monthlySpend = currentMonthTxs.reduce((sum, tx) => sum + tx.amount, 0);
  const totalSpendLast30Days = transactions
    .filter((tx) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(tx.date) >= thirtyDaysAgo;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Compute monthly spend data (last 6 months)
  const monthlySpendData: MonthlySpend[] = [];
  if (hasRealData) {
    const months: Record<string, number> = {};
    for (const tx of transactions) {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = (months[key] || 0) + tx.amount;
    }
    const sortedMonths = Object.entries(months).sort(([a], [b]) => a.localeCompare(b));
    for (const [key, spend] of sortedMonths.slice(-6)) {
      const [year, month] = key.split("-");
      const monthName = new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", { month: "short" });
      monthlySpendData.push({
        month: monthName,
        spend: Math.round(spend),
        rewards: Math.round(spend * 0.02),
      });
    }
  }

  // Compute spend categories (aggregate by category)
  const spendCategories: SpendCategory[] = [];
  if (hasRealData) {
    const catMap: Record<string, { amount: number; card: string }> = {};
    for (const tx of transactions) {
      const cat = tx.category || "Uncategorized";
      if (!catMap[cat]) catMap[cat] = { amount: 0, card: tx.card_used };
      catMap[cat].amount += tx.amount;
    }
    const sorted = Object.entries(catMap).sort(([, a], [, b]) => b.amount - a.amount);
    for (const [name, data] of sorted) {
      const monthlyAmount = Math.round(data.amount / Math.max(monthlySpendData.length, 1));
      const estimatedReward = Math.round(monthlyAmount * 0.01);
      const optimalReward = Math.round(monthlyAmount * 0.03);
      spendCategories.push({
        name,
        amount: monthlyAmount,
        currentCard: data.card,
        optimalCard: "Optimized Card",
        currentReward: estimatedReward,
        optimalReward,
        missedReward: optimalReward - estimatedReward,
      });
    }
  }

  // Compute category breakdown
  const categoryBreakdown: CategoryBreakdownItem[] = [];
  if (hasRealData) {
    const catTotals: Record<string, number> = {};
    for (const tx of transactions) {
      const cat = tx.category || "Uncategorized";
      catTotals[cat] = (catTotals[cat] || 0) + tx.amount;
    }
    const sorted = Object.entries(catTotals).sort(([, a], [, b]) => b - a);
    for (const [name, value] of sorted.slice(0, 8)) {
      const avgMonthly = Math.round(value / Math.max(monthlySpendData.length, 1));
      categoryBreakdown.push({
        name,
        value: avgMonthly,
        color: getCategoryColor(name),
      });
    }
  }

  return {
    transactions,
    connectedAccounts,
    monthlySpend,
    totalSpendLast30Days,
    monthlySpendData,
    spendCategories,
    categoryBreakdown,
    hasRealData,
    loading,
    userName,
  };
}
