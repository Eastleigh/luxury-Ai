"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";
import { Crown, Loader2, Mail, AlertCircle, Check, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getSupabase();
    if (!supabase) {
      setError("Auth not configured");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
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
          <h1 className="mt-6 text-2xl font-bold text-white">Check your email</h1>
          <p className="mt-3 text-sm text-platinum-400">
            We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>.
            Click the link in the email to set a new password.
          </p>
          <p className="mt-4 text-xs text-platinum-500">
            Didn&apos;t receive it? Check your spam folder or try again in a few minutes.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-luxury-gold px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[#e0c992]"
          >
            Back to Login
          </Link>
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
          <h1 className="mt-6 text-2xl font-bold text-white">Reset your password</h1>
          <p className="mt-2 text-sm text-platinum-400">
            Enter your email and we&apos;ll send you a link to reset your password.
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
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-platinum-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-platinum-500 outline-none transition-all focus:border-luxury-gold/30 focus:ring-1 focus:ring-luxury-gold/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-luxury-gold py-3 text-sm font-semibold text-black transition-all hover:bg-[#e0c992] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-platinum-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
