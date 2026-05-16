import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "LuxuryAI — AI-Powered Spending Optimization & Luxury Travel",
  description:
    "Financial optimization for high-performing business owners. AI-powered spending analysis, card optimization, and luxury travel automation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col pl-[260px]">
            <Header />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
