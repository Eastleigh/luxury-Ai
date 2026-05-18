import { NextRequest, NextResponse } from "next/server";
import { sendEmail, buildWelcomeEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const { type, record } = payload;

    if (type === "INSERT" && record) {
      const email = record.email;
      const name = record.raw_user_meta_data?.full_name || email?.split("@")[0] || "there";

      if (email) {
        const welcomeEmail = buildWelcomeEmail(name);
        welcomeEmail.to = email;
        await sendEmail(welcomeEmail);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Auth webhook error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
