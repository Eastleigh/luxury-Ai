import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import {
  sendEmail,
  buildWelcomeEmail,
  buildWeeklyReportEmail,
  buildAlertEmail,
} from "@/lib/resend";

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
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, recipientEmail, data } = await request.json();

    const targetEmail = recipientEmail || user.email;
    if (!targetEmail) {
      return NextResponse.json({ error: "No recipient email" }, { status: 400 });
    }

    const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";

    let payload;
    switch (type) {
      case "welcome":
        payload = buildWelcomeEmail(userName);
        break;
      case "weekly_report":
        payload = buildWeeklyReportEmail(userName, data || {});
        break;
      case "alert":
        payload = buildAlertEmail(userName, data?.alertType || "optimization", data?.details || "");
        break;
      default:
        return NextResponse.json({ error: "Invalid email type. Use: welcome, weekly_report, alert" }, { status: 400 });
    }

    payload.to = targetEmail;

    const result = await sendEmail(payload);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("ai_logs").insert({
        user_id: user.id,
        ai_type: `email_${type}`,
        prompt: `Email to ${targetEmail}: ${payload.subject}`,
        response: result.success ? `Sent: ${result.id}` : `Failed: ${result.error}`,
      });
    }

    if (!result.success) {
      if (result.error === "RESEND_API_KEY not configured") {
        return NextResponse.json({
          success: true,
          preview: true,
          message: "Email template generated (set RESEND_API_KEY to send real emails)",
          subject: payload.subject,
          html: payload.html,
        });
      }
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Email error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
