import type { Metadata } from "next";
import Link from "next/link";
import { Crown, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
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
          <span className="text-xl font-bold">
            Mava<span className="gold-gradient">ree</span>
          </span>
        </div>

        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-platinum-500 mb-8">Last updated: May 2026</p>

        <div className="space-y-8 text-platinum-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Mavaree, you agree to be bound by these Terms of Service. If you
              do not agree to these terms, do not use our services. Mavaree is operated by Mavaree Inc.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              Mavaree provides AI-powered financial optimization tools for business owners, including
              spending analysis, credit card optimization recommendations, award travel search, and
              related services. Our services are available to users in the United States and Canada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Not Financial Advice</h2>
            <p>
              Mavaree provides information and recommendations for educational purposes only. Our
              AI-generated recommendations are not financial, investment, or legal advice. You should
              consult with a qualified financial advisor before making financial decisions. Results
              may vary and past performance does not guarantee future results.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Accounts & Registration</h2>
            <p>
              You must provide accurate and complete information when creating an account. You are
              responsible for maintaining the security of your account credentials. You must be at
              least 18 years old to use Mavaree.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Subscriptions & Payments</h2>
            <p>
              Paid plans are billed monthly through Stripe. You may cancel your subscription at any
              time. Cancellations take effect at the end of the current billing period. Refunds are
              handled on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Financial Data</h2>
            <p>
              When you connect financial accounts through Plaid, you authorize us to access your
              transaction history and account information for the purpose of providing optimization
              recommendations. We do not store your bank login credentials. You may disconnect
              accounts at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Affiliate Disclosures</h2>
            <p>
              Mavaree may earn commissions from credit card issuers and financial product providers
              when you apply for or are approved for products through our platform. This does not
              affect our recommendations, which are based solely on your spending patterns and
              optimization goals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
            <p>
              Mavaree is provided &quot;as is&quot; without warranty. We are not liable for any direct, indirect,
              incidental, or consequential damages arising from your use of our services, including
              but not limited to financial losses from following our recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
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
