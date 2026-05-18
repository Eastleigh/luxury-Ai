import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/Toast";

const siteUrl = "https://mavaree.com";

export const metadata: Metadata = {
  title: {
    default: "Mavaree — AI-Powered Spending Optimization & Luxury Travel",
    template: "%s | Mavaree",
  },
  description:
    "AI-powered financial optimization for business owners in the US & Canada spending $20K-$500K/month. Find missed rewards, optimize card strategy, and unlock luxury travel on points.",
  keywords: [
    "credit card optimization",
    "business rewards",
    "points optimization",
    "luxury travel",
    "award flights",
    "spending analysis",
    "AI financial advisor",
    "Amex points",
    "Chase rewards",
    "business credit cards",
    "travel rewards",
    "Mavaree",
  ],
  authors: [{ name: "Mavaree" }],
  creator: "Mavaree",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Mavaree",
    title: "Mavaree — You Spend Thousands Every Month. We Help You Get More Back.",
    description:
      "AI-powered spending optimization for business owners in the US & Canada. We find the rewards you're already owed — luxury travel is just the payoff.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Mavaree — AI-Powered Spending Optimization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mavaree — AI-Powered Spending Optimization & Luxury Travel",
    description:
      "AI finds the rewards you're already owed. Luxury travel is just the payoff.",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          defer
          data-domain="mavaree.com"
          src="https://plausible.io/js/script.js"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Mavaree",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              description:
                "AI-powered financial optimization for business owners in the US & Canada.",
              url: siteUrl,
              offers: [
                {
                  "@type": "Offer",
                  name: "Free Audit",
                  price: "0",
                  priceCurrency: "USD",
                },
                {
                  "@type": "Offer",
                  name: "Pro",
                  price: "99",
                  priceCurrency: "USD",
                  billingIncrement: "P1M",
                },
                {
                  "@type": "Offer",
                  name: "Executive",
                  price: "499",
                  priceCurrency: "USD",
                  billingIncrement: "P1M",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-[#0a0a0a] text-white antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
