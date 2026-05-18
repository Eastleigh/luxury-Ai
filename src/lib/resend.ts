import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!_resend) {
    _resend = new Resend(apiKey);
  }
  return _resend;
}

const FROM_EMAIL = "Mavaree <noreply@mavaree.com>";
const FALLBACK_FROM = "Mavaree <onboarding@resend.dev>";

function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || FROM_EMAIL;
}

function baseStyles(): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; padding: 40px 30px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #d4a853; font-size: 28px; margin: 0;">Mavaree</h1>
        <p style="color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px;">Spend Intelligence</p>
      </div>
  `;
}

function footer(unsubscribeNote?: string): string {
  return `
      <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
        Mavaree - Financial optimization for business owners.
        ${unsubscribeNote ? `<br/>${unsubscribeNote}` : ""}
      </p>
    </div>
  `;
}

function ctaButton(text: string, url: string): string {
  return `
    <div style="text-align: center; margin: 32px 0;">
      <a href="${url}" style="background: linear-gradient(135deg, #d4a853, #e0c992); color: black; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; display: inline-block;">${text}</a>
    </div>
  `;
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export function buildWelcomeEmail(name: string): EmailPayload {
  return {
    to: "",
    subject: "Welcome to Mavaree - Let's Optimize Your Spending",
    html: `
      ${baseStyles()}
      <h2 style="color: white; font-size: 22px;">Welcome, ${name}!</h2>
      <p style="color: #aaa; line-height: 1.6;">You're now part of an exclusive group of business owners who are taking control of their spending and maximizing rewards.</p>
      <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="color: #d4a853; margin-top: 0;">Your Next Steps:</h3>
        <ol style="color: #ccc; line-height: 2;">
          <li><strong>Connect your bank accounts</strong> via Plaid for real spending insights</li>
          <li><strong>Run your first AI analysis</strong> to find optimization opportunities</li>
          <li><strong>Review card recommendations</strong> tailored to your spending patterns</li>
        </ol>
      </div>
      ${ctaButton("Go to Dashboard", "https://mavaree.com/dashboard")}
      ${footer()}
    `,
  };
}

export function buildPasswordResetEmail(name: string, resetLink: string): EmailPayload {
  return {
    to: "",
    subject: "Reset Your Mavaree Password",
    html: `
      ${baseStyles()}
      <h2 style="color: white; font-size: 22px;">Password Reset Request</h2>
      <p style="color: #aaa; line-height: 1.6;">Hi ${name}, we received a request to reset your password. Click the button below to choose a new one.</p>
      <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="color: #ccc; font-size: 14px; margin: 0;">This link expires in <strong style="color: white;">1 hour</strong>. If you didn't request this, you can safely ignore this email.</p>
      </div>
      ${ctaButton("Reset Password", resetLink)}
      <p style="color: #666; font-size: 12px; text-align: center;">Or copy this link: <a href="${resetLink}" style="color: #d4a853; word-break: break-all;">${resetLink}</a></p>
      ${footer()}
    `,
  };
}

export function buildUpgradeEmail(name: string, plan: string): EmailPayload {
  const planDisplay = plan === "executive" ? "Executive ($499/mo)" : "Pro ($99/mo)";
  return {
    to: "",
    subject: `Welcome to Mavaree ${plan === "executive" ? "Executive" : "Pro"}!`,
    html: `
      ${baseStyles()}
      <h2 style="color: white; font-size: 22px;">You're now on ${planDisplay}</h2>
      <p style="color: #aaa; line-height: 1.6;">Hi ${name}, thank you for upgrading! You now have access to all ${plan === "executive" ? "Executive" : "Pro"} features.</p>
      <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="color: #d4a853; margin-top: 0;">What's Unlocked:</h3>
        <ul style="color: #ccc; line-height: 2; padding-left: 20px;">
          ${plan === "executive" ? `
            <li>AI-Powered Spend Analyzer with Deep Insights</li>
            <li>Card Optimization Engine with Personalized Recommendations</li>
            <li>Award Travel Search & Booking</li>
            <li>Executive Travel Concierge</li>
            <li>Priority Support</li>
          ` : `
            <li>AI-Powered Spend Analyzer</li>
            <li>Card Optimization Engine</li>
            <li>Points Health Monitor</li>
            <li>Transfer Bonus Alerts</li>
          `}
        </ul>
      </div>
      ${ctaButton("Explore Your Dashboard", "https://mavaree.com/dashboard")}
      ${footer()}
    `,
  };
}

export function buildWeeklyReportEmail(name: string, data: {
  monthlySpend?: number;
  transactionCount?: number;
  topCategory?: string;
  topCategoryAmount?: number;
  connectedAccounts?: number;
  missedRewards?: number;
}): EmailPayload {
  const d = {
    monthlySpend: data.monthlySpend ?? 0,
    transactionCount: data.transactionCount ?? 0,
    topCategory: data.topCategory ?? "N/A",
    topCategoryAmount: data.topCategoryAmount ?? 0,
    connectedAccounts: data.connectedAccounts ?? 0,
    missedRewards: data.missedRewards ?? 0,
  };
  return {
    to: "",
    subject: `Mavaree Weekly Report - $${d.monthlySpend.toLocaleString()} tracked`,
    html: `
      ${baseStyles()}
      <h2 style="color: white; font-size: 20px;">Hi ${name}, here's your week in review</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0;">
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 16px; text-align: center;">
          <p style="color: #888; font-size: 11px; text-transform: uppercase; margin: 0;">Monthly Spend</p>
          <p style="color: white; font-size: 24px; font-weight: 700; margin: 8px 0 0;">$${d.monthlySpend.toLocaleString()}</p>
        </div>
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 16px; text-align: center;">
          <p style="color: #888; font-size: 11px; text-transform: uppercase; margin: 0;">Transactions</p>
          <p style="color: white; font-size: 24px; font-weight: 700; margin: 8px 0 0;">${d.transactionCount}</p>
        </div>
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 16px; text-align: center;">
          <p style="color: #888; font-size: 11px; text-transform: uppercase; margin: 0;">Top Category</p>
          <p style="color: #d4a853; font-size: 16px; font-weight: 600; margin: 8px 0 0;">${d.topCategory}</p>
          <p style="color: #aaa; font-size: 13px; margin: 4px 0 0;">$${d.topCategoryAmount.toLocaleString()}</p>
        </div>
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 16px; text-align: center;">
          <p style="color: #888; font-size: 11px; text-transform: uppercase; margin: 0;">Missed Rewards</p>
          <p style="color: #ef4444; font-size: 24px; font-weight: 700; margin: 8px 0 0;">$${d.missedRewards.toLocaleString()}</p>
        </div>
      </div>
      ${ctaButton("View Full Analysis", "https://mavaree.com/analyzer")}
      ${footer('You\'re receiving this because you have a Mavaree account. <a href="https://mavaree.com/dashboard" style="color: #888;">Manage preferences</a>')}
    `,
  };
}

export function buildAlertEmail(name: string, alertType: string, details: string): EmailPayload {
  const alertTitles: Record<string, string> = {
    optimization: "New Optimization Opportunity Found",
    bonus: "Transfer Bonus Alert",
    expiry: "Points Expiry Warning",
  };
  return {
    to: "",
    subject: `Mavaree Alert: ${alertTitles[alertType] || "New Alert"}`,
    html: `
      ${baseStyles()}
      <div style="background: #1a1a1a; border-left: 4px solid #d4a853; border-radius: 0 12px 12px 0; padding: 20px; margin: 24px 0;">
        <h2 style="color: white; font-size: 18px; margin-top: 0;">${alertTitles[alertType] || "Alert"}</h2>
        <p style="color: #ccc; line-height: 1.6;">${details}</p>
      </div>
      ${ctaButton("Take Action", "https://mavaree.com/dashboard")}
      ${footer()}
    `,
  };
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResend();
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
