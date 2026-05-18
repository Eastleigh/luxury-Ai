import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { sendEmail, buildWeeklyReportEmail } from "@/lib/resend";

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

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    let targetEmail: string | null = null;
    let userName = "there";
    let userId: string | null = null;

    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      const body = await request.json();
      targetEmail = body.email;
      userName = body.name || "there";
    } else {
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      targetEmail = user.email || null;
      userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";
      userId = user.id;
    }

    if (!targetEmail) {
      return NextResponse.json({ error: "No recipient email" }, { status: 400 });
    }

    const body = cronSecret && authHeader === `Bearer ${cronSecret}`
      ? await request.json().catch(() => ({}))
      : await request.json().catch(() => ({}));

    const reportData = {
      monthlySpend: body.monthlySpend ?? 0,
      transactionCount: body.transactionCount ?? 0,
      topCategory: body.topCategory ?? "N/A",
      topCategoryAmount: body.topCategoryAmount ?? 0,
      connectedAccounts: body.connectedAccounts ?? 0,
      missedRewards: body.missedRewards ?? 0,
    };

    const payload = buildWeeklyReportEmail(userName, reportData);
    payload.to = targetEmail;

    const result = await sendEmail(payload);

    const supabase = getSupabaseAdmin();
    if (supabase && userId) {
      await supabase.from("ai_logs").insert({
        user_id: userId,
        ai_type: "email_weekly_report",
        prompt: `Weekly report to ${targetEmail}`,
        response: result.success ? `Sent: ${result.id}` : `Failed: ${result.error}`,
      });
    }

    if (!result.success) {
      if (result.error === "RESEND_API_KEY not configured") {
        return NextResponse.json({
          success: true,
          preview: true,
          message: "Weekly report template generated (set RESEND_API_KEY to send)",
        });
      }
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Weekly report email error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
