import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getAuthUser(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

interface EmailTemplate {
  subject: string;
  html: string;
}

function buildWelcomeEmail(name: string): EmailTemplate {
  return {
    subject: "Welcome to Mavaree - Let's Optimize Your Spending",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; padding: 40px 30px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #d4a853; font-size: 28px; margin: 0;">Mavaree</h1>
          <p style="color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px;">Spend Intelligence</p>
        </div>
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
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mavaree.com/dashboard" style="background: linear-gradient(135deg, #d4a853, #e0c992); color: black; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; display: inline-block;">Go to Dashboard</a>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">Mavaree - Financial optimization for business owners.</p>
      </div>
    `,
  };
}

function buildWeeklyReportEmail(name: string, raw: {
  monthlySpend?: number;
  transactionCount?: number;
  topCategory?: string;
  topCategoryAmount?: number;
  connectedAccounts?: number;
  missedRewards?: number;
}): EmailTemplate {
  const data = {
    monthlySpend: raw.monthlySpend ?? 0,
    transactionCount: raw.transactionCount ?? 0,
    topCategory: raw.topCategory ?? "N/A",
    topCategoryAmount: raw.topCategoryAmount ?? 0,
    connectedAccounts: raw.connectedAccounts ?? 0,
    missedRewards: raw.missedRewards ?? 0,
  };
  return {
    subject: `Mavaree Weekly Report - $${data.monthlySpend.toLocaleString()} tracked`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; padding: 40px 30px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #d4a853; font-size: 28px; margin: 0;">Mavaree</h1>
          <p style="color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px;">Weekly Spending Report</p>
        </div>
        <h2 style="color: white; font-size: 20px;">Hi ${name}, here's your week in review</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0;">
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 16px; text-align: center;">
            <p style="color: #888; font-size: 11px; text-transform: uppercase; margin: 0;">Monthly Spend</p>
            <p style="color: white; font-size: 24px; font-weight: 700; margin: 8px 0 0;">$${data.monthlySpend.toLocaleString()}</p>
          </div>
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 16px; text-align: center;">
            <p style="color: #888; font-size: 11px; text-transform: uppercase; margin: 0;">Transactions</p>
            <p style="color: white; font-size: 24px; font-weight: 700; margin: 8px 0 0;">${data.transactionCount}</p>
          </div>
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 16px; text-align: center;">
            <p style="color: #888; font-size: 11px; text-transform: uppercase; margin: 0;">Top Category</p>
            <p style="color: #d4a853; font-size: 16px; font-weight: 600; margin: 8px 0 0;">${data.topCategory}</p>
            <p style="color: #aaa; font-size: 13px; margin: 4px 0 0;">$${data.topCategoryAmount.toLocaleString()}</p>
          </div>
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 16px; text-align: center;">
            <p style="color: #888; font-size: 11px; text-transform: uppercase; margin: 0;">Missed Rewards</p>
            <p style="color: #ef4444; font-size: 24px; font-weight: 700; margin: 8px 0 0;">$${data.missedRewards.toLocaleString()}</p>
          </div>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mavaree.com/analyzer" style="background: linear-gradient(135deg, #d4a853, #e0c992); color: black; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; display: inline-block;">View Full Analysis</a>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">You're receiving this because you have a Mavaree account. <a href="https://mavaree.com/dashboard" style="color: #888;">Manage preferences</a></p>
      </div>
    `,
  };
}

function buildAlertEmail(name: string, alertType: string, details: string): EmailTemplate {
  const alertTitles: Record<string, string> = {
    optimization: "New Optimization Opportunity Found",
    bonus: "Transfer Bonus Alert",
    expiry: "Points Expiry Warning",
  };
  return {
    subject: `Mavaree Alert: ${alertTitles[alertType] || "New Alert"}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; padding: 40px 30px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #d4a853; font-size: 28px; margin: 0;">Mavaree</h1>
        </div>
        <div style="background: #1a1a1a; border-left: 4px solid #d4a853; border-radius: 0 12px 12px 0; padding: 20px; margin: 24px 0;">
          <h2 style="color: white; font-size: 18px; margin-top: 0;">${alertTitles[alertType] || "Alert"}</h2>
          <p style="color: #ccc; line-height: 1.6;">${details}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mavaree.com/dashboard" style="background: linear-gradient(135deg, #d4a853, #e0c992); color: black; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; display: inline-block;">Take Action</a>
        </div>
      </div>
    `,
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, recipientEmail, data } = await request.json();

    const resendApiKey = process.env.RESEND_API_KEY;
    const targetEmail = recipientEmail || user.email;
    const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";

    let template: EmailTemplate;
    switch (type) {
      case "welcome":
        template = buildWelcomeEmail(userName);
        break;
      case "weekly_report":
        template = buildWeeklyReportEmail(userName, data || {});
        break;
      case "alert":
        template = buildAlertEmail(userName, data?.alertType || "optimization", data?.details || "");
        break;
      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    if (!resendApiKey) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase.from("ai_logs").insert({
          user_id: user.id,
          ai_type: `email_${type}`,
          prompt: `Email to ${targetEmail}: ${template.subject}`,
          response: "Queued (no email provider configured)",
        });
      }
      return NextResponse.json({
        success: true,
        preview: true,
        message: "Email template generated (set RESEND_API_KEY to send real emails)",
        subject: template.subject,
        html: template.html,
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mavaree <noreply@mavaree.com>",
        to: targetEmail,
        subject: template.subject,
        html: template.html,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.message || "Failed to send email" }, { status: res.status });
    }

    const result = await res.json();

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("ai_logs").insert({
        user_id: user.id,
        ai_type: `email_${type}`,
        prompt: `Email to ${targetEmail}: ${template.subject}`,
        response: `Sent: ${result.id}`,
      });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Email error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
