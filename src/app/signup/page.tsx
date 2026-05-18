"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, Loader2, Mail, Lock, User, AlertCircle, Check, DollarSign, Globe } from "lucide-react";

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [monthlySpend, setMonthlySpend] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      setError(error);
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
            We&apos;ve sent a confirmation link to <strong className="text-white">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-luxury-gold px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[#e0c992]"
          >
            Go to Login
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
          <h1 className="mt-6 text-2xl font-bold text-white">Start with your free Mavaree Spend Audit</h1>
          <p className="mt-2 text-sm text-platinum-400">
            Create your free account — no credit card required
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
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-platinum-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Marcus Chen"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-platinum-500 outline-none transition-all focus:border-luxury-gold/30 focus:ring-1 focus:ring-luxury-gold/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-platinum-300">
              Work Email
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-platinum-300">
              Password
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
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-platinum-500 outline-none transition-all focus:border-luxury-gold/30 focus:ring-1 focus:ring-luxury-gold/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-platinum-300">
              Estimated Monthly Business Card Spend
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-platinum-500" />
              <select
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(e.target.value)}
                required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-luxury-gold/30 focus:ring-1 focus:ring-luxury-gold/20 appearance-none"
              >
                <option value="" className="bg-[#0a0a0a]">Select range</option>
                <option value="under-20k" className="bg-[#0a0a0a]">Under $20K/month</option>
                <option value="20k-50k" className="bg-[#0a0a0a]">$20K – $50K/month</option>
                <option value="50k-150k" className="bg-[#0a0a0a]">$50K – $150K/month</option>
                <option value="150k-500k" className="bg-[#0a0a0a]">$150K – $500K/month</option>
                <option value="500k-plus" className="bg-[#0a0a0a]">$500K+/month</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-platinum-300">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-platinum-500" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-luxury-gold/30 focus:ring-1 focus:ring-luxury-gold/20 appearance-none"
              >
                <option value="" className="bg-[#0a0a0a]">Select country</option>
                <option value="US" className="bg-[#0a0a0a]">United States</option>
                <option value="CA" className="bg-[#0a0a0a]">Canada</option>
              </select>
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#0a0a0a] px-3 text-platinum-500">or</span>
          </div>
        </div>

        <button
          onClick={async () => {
            setGoogleLoading(true);
            setError(null);
            const { error } = await signInWithGoogle();
            if (error) {
              setError(error);
              setGoogleLoading(false);
            }
          }}
          disabled={googleLoading}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/[0.06] disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Sign up with Google
        </button>

        <p className="mt-6 text-center text-sm text-platinum-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-luxury-gold hover:text-[#e0c992]"
          >
            Sign in
          </Link>
        </p>

        <div className="mt-6 space-y-2">
          {["No credit card required", "Secure bank connections via Plaid", "Cancel anytime", "US & Canada only"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-platinum-500">
              <Check className="h-3 w-3 text-emerald-400" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
