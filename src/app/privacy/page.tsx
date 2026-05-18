import type { Metadata } from "next";
import Link from "next/link";
import { Crown, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-platinum-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Crown className="h-6 w-6 text-luxury-gold" />
          <span className="text-xl font-bold tracking-tight">Mavaree</span>
        </div>

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-platinum-500 mb-8">Last updated: May 2026</p>

        <div className="space-y-8 text-platinum-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>
              When you create a Mavaree account, we collect your name, email address, and account
              credentials. When you connect financial accounts through Plaid, we receive transaction
              data, account balances, and institution information to provide our optimization services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Analyze your spending patterns and provide personalized optimization recommendations</li>
              <li>Generate AI-powered card recommendations and travel award searches</li>
              <li>Send you alerts about expiring points, transfer bonuses, and optimization opportunities</li>
              <li>Improve our AI models and platform features</li>
              <li>Process payments for premium subscriptions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Security</h2>
            <p>
              We use bank-level encryption (AES-256) to protect your financial data. All connections
              to financial institutions are made through Plaid, a certified third-party provider.
              We never store your bank login credentials. Our infrastructure is hosted on secure,
              SOC 2 compliant servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing</h2>
            <p>
              We do not sell your personal information. We share data only with:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Plaid — to connect and retrieve your financial account data</li>
              <li>Stripe — to process subscription payments</li>
              <li>Supabase — for secure data storage and authentication</li>
              <li>AI providers — anonymized data for generating recommendations (no personally identifiable information is shared)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data at any
              time by contacting us at{" "}
              <a href="mailto:support@mavaree.com" className="text-luxury-gold hover:underline">
                support@mavaree.com
              </a>
              . You can disconnect financial accounts and delete your Mavaree account at any time
              from your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We do not use
              third-party advertising cookies. Our analytics are privacy-focused and do not track
              individual users across sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Contact</h2>
            <p>
              For questions about this privacy policy or your data, contact us at{" "}
              <a href="mailto:support@mavaree.com" className="text-luxury-gold hover:underline">
                support@mavaree.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
