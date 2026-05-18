"use client";

import { useState, useEffect, Suspense } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Crown, Loader2, Lock, AlertCircle, Check } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setError("Invalid or expired reset link. Please request a new one.");
        } else {
          setSessionReady(true);
        }
      });
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSessionReady(true);
        } else {
          setError("Invalid or expired reset link. Please request a new one.");
        }
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = getSupabase();
    if (!supabase) {
      setError("Auth not configured");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 3000);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/[0.03] via-transparent to-luxury-gold/[0.02]" />
        <div className="relative w-full max-w-md px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <Check className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">Password updated!</h1>
          <p className="mt-3 text-sm text-platinum-400">
            Your password has been successfully reset. Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/[0.03] via-transparent to-luxury-gold/[0.02]" />

      <div className="relative w-full max-w-md px-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Crown className="h-8 w-8 text-luxury-gold" />
            <span className="text-2xl font-bold tracking-tight">Mavaree</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">Set new password</h1>
          <p className="mt-2 text-sm text-platinum-400">
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-platinum-300">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-platinum-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                minLength={6}
                disabled={!sessionReady}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-platinum-500 outline-none transition-all focus:border-luxury-gold/30 focus:ring-1 focus:ring-luxury-gold/20 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-platinum-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-platinum-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                minLength={6}
                disabled={!sessionReady}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-platinum-500 outline-none transition-all focus:border-luxury-gold/30 focus:ring-1 focus:ring-luxury-gold/20 disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !sessionReady}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-luxury-gold py-3 text-sm font-semibold text-black transition-all hover:bg-[#e0c992] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-platinum-400">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-luxury-gold hover:text-[#e0c992]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
