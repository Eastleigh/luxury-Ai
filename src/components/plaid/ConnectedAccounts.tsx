"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlaidLinkButton } from "./PlaidLinkButton";
import type { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import { useAuth } from "@/lib/auth-context";
import { getSupabase } from "@/lib/supabase";
import {
  Building2,
  CreditCard,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ConnectedAccount {
  id: string;
  institution_name: string;
  account_type: string;
  account_mask: string;
  connected_at: string;
  plaid_item_id: string;
}

interface Transaction {
  id: string;
  amount: number;
  category: string;
  merchant_name: string;
  date: string;
  card_used: string;
}

export function ConnectedAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("connected_accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("connected_at", { ascending: false });

    setAccounts(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) loadAccounts();
  }, [user, loadAccounts]);

  async function handlePlaidSuccess(publicToken: string, metadata: PlaidLinkOnSuccessMetadata) {
    const supabase = getSupabase();
    if (!supabase || !user) return;

    setSyncing(true);
    setSyncMessage("Exchanging token...");

    try {
      // Exchange public token for access token
      const exchangeRes = await fetch("/api/plaid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "exchange_token", publicToken }),
      });
      const exchangeData = await exchangeRes.json();

      if (exchangeData.error) {
        setSyncMessage(`Error: ${exchangeData.error}`);
        setSyncing(false);
        return;
      }

      const accessToken = exchangeData.access_token;
      const itemId = exchangeData.item_id;

      setSyncMessage("Fetching accounts...");

      // Get account details
      const accountsRes = await fetch("/api/plaid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_accounts", accessToken }),
      });
      const accountsData = await accountsRes.json();

      if (accountsData.accounts) {
        for (const account of accountsData.accounts) {
          await supabase.from("connected_accounts").insert({
            user_id: user.id,
            plaid_access_token: accessToken,
            plaid_item_id: itemId,
            institution_name:
              metadata.institution?.name || "Unknown Bank",
            account_type: account.subtype || account.type || "checking",
            account_mask: account.mask || "****",
          });
        }
      }

      setSyncMessage("Syncing transactions...");

      // Fetch recent transactions
      const txRes = await fetch("/api/plaid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_transactions", accessToken }),
      });
      const txData = await txRes.json();

      if (txData.transactions) {
        const connectedAccounts = await supabase
          .from("connected_accounts")
          .select("id")
          .eq("user_id", user.id)
          .eq("plaid_item_id", itemId)
          .limit(1);

        const accountId = connectedAccounts.data?.[0]?.id;

        for (const tx of txData.transactions.slice(0, 100)) {
          await supabase.from("transactions").upsert(
            {
              user_id: user.id,
              account_id: accountId,
              plaid_transaction_id: tx.transaction_id,
              amount: Math.abs(tx.amount),
              category: tx.category?.[0] || "Uncategorized",
              merchant_name: tx.merchant_name || tx.name || "Unknown",
              date: tx.date,
                card_used:
                  metadata.institution?.name || "Connected Account",
            },
            { onConflict: "plaid_transaction_id" }
          );
        }

        setTransactions(
          txData.transactions.slice(0, 20).map((tx: Record<string, unknown>) => ({
            id: tx.transaction_id as string,
            amount: Math.abs(tx.amount as number),
            category: ((tx.category as string[]) || ["Uncategorized"])[0],
            merchant_name: (tx.merchant_name as string) || (tx.name as string) || "Unknown",
            date: tx.date as string,
            card_used:
              metadata.institution?.name || "Connected Account",
          }))
        );
      }

      setSyncMessage("Connected successfully!");
      await loadAccounts();
    } catch (err) {
      setSyncMessage(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  }

  async function handleSyncTransactions(account: ConnectedAccount) {
    const supabase = getSupabase();
    if (!supabase || !user) return;

    setSyncing(true);
    setSyncMessage("Refreshing transactions...");

    try {
      const { data: acctData } = await supabase
        .from("connected_accounts")
        .select("plaid_access_token")
        .eq("id", account.id)
        .single();

      if (!acctData?.plaid_access_token) {
        setSyncMessage("Error: Access token not found");
        setSyncing(false);
        return;
      }

      const txRes = await fetch("/api/plaid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_transactions",
          accessToken: acctData.plaid_access_token,
        }),
      });
      const txData = await txRes.json();

      if (txData.transactions) {
        for (const tx of txData.transactions.slice(0, 100)) {
          await supabase.from("transactions").upsert(
            {
              user_id: user.id,
              account_id: account.id,
              plaid_transaction_id: tx.transaction_id,
              amount: Math.abs(tx.amount),
              category: tx.category?.[0] || "Uncategorized",
              merchant_name: tx.merchant_name || tx.name || "Unknown",
              date: tx.date,
              card_used: account.institution_name,
            },
            { onConflict: "plaid_transaction_id" }
          );
        }
        setSyncMessage(`Synced ${txData.transactions.length} transactions`);
      }
    } catch (err) {
      setSyncMessage(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  }

  async function handleDisconnect(account: ConnectedAccount) {
    const supabase = getSupabase();
    if (!supabase || !user) return;

    if (!confirm(`Disconnect ${account.institution_name}? This will remove all synced transactions.`)) {
      return;
    }

    await supabase.from("transactions").delete().eq("account_id", account.id);
    await supabase.from("connected_accounts").delete().eq("id", account.id);
    await loadAccounts();
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-platinum-400" />
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status message */}
      {syncMessage && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${
            syncMessage.startsWith("Error")
              ? "border-red-500/20 bg-red-500/10 text-red-400"
              : syncMessage.includes("successfully") || syncMessage.includes("Synced")
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-luxury-gold/20 bg-luxury-gold/10 text-luxury-gold"
          }`}
        >
          {syncMessage.startsWith("Error") ? (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          ) : syncMessage.includes("successfully") || syncMessage.includes("Synced") ? (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          ) : (
            <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
          )}
          {syncMessage}
        </div>
      )}

      {/* Connected accounts list */}
      {accounts.length > 0 && (
        <GlassCard>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Connected Accounts ({accounts.length})
            </h2>
            <PlaidLinkButton
              userId={user?.id || "anonymous"}
              onSuccess={handlePlaidSuccess}
              variant="secondary"
              size="sm"
            >
              + Add Another
            </PlaidLinkButton>
          </div>
          <div className="mt-4 space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Building2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">
                    {account.institution_name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <CreditCard className="h-3 w-3 text-platinum-500" />
                    <span className="text-xs text-platinum-400">
                      {account.account_type} ••••{account.account_mask}
                    </span>
                    <Badge variant="success" size="sm">
                      Connected
                    </Badge>
                  </div>
                  <p className="text-[10px] text-platinum-500 mt-1">
                    Connected {formatDate(account.connected_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSyncTransactions(account)}
                    disabled={syncing}
                    title="Sync transactions"
                  >
                    <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDisconnect(account)}
                    className="text-red-400 hover:text-red-300"
                    title="Disconnect"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Empty state — no accounts */}
      {accounts.length === 0 && (
        <GlassCard>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-luxury-gold/10 mb-4">
              <Building2 className="h-8 w-8 text-luxury-gold" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Connect Your Bank Accounts
            </h3>
            <p className="mt-2 max-w-md text-sm text-platinum-400">
              Link your business bank accounts and credit cards to automatically
              analyze your spending and find optimization opportunities. Supports
              US and Canadian banks.
            </p>
            <div className="mt-6">
              <PlaidLinkButton
                userId={user?.id || "anonymous"}
                onSuccess={handlePlaidSuccess}
                size="lg"
              />
            </div>
            <p className="mt-4 text-xs text-platinum-500">
              Secured by Plaid. We never store your banking credentials.
            </p>
          </div>
        </GlassCard>
      )}

      {/* Recent transactions preview */}
      {transactions.length > 0 && (
        <GlassCard>
          <h2 className="text-base font-semibold text-white">
            Recent Transactions
          </h2>
          <div className="mt-4 space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {tx.merchant_name}
                  </p>
                  <p className="text-xs text-platinum-500">
                    {tx.category} • {formatDate(tx.date)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-white">
                  ${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
