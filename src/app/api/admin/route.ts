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

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: accounts } = await supabase
      .from("connected_accounts")
      .select("id, user_id, institution_name, account_type, connected_at");

    const { data: authUsers } = await supabase.auth.admin.listUsers();

    const users = (profiles || []).map((profile) => {
      const authUser = authUsers?.users?.find((u) => u.id === profile.id);
      const userAccounts = (accounts || []).filter((a) => a.user_id === profile.id);
      return {
        id: profile.id,
        email: authUser?.email || "unknown",
        full_name: profile.full_name || authUser?.user_metadata?.full_name || "",
        plan: profile.plan || "free",
        stripe_customer_id: profile.stripe_customer_id,
        stripe_subscription_id: profile.stripe_subscription_id,
        connected_accounts: userAccounts.length,
        institutions: userAccounts.map((a) => a.institution_name).filter(Boolean),
        created_at: profile.created_at,
        last_sign_in: authUser?.last_sign_in_at,
      };
    });

    // Signup trends (last 30 days, grouped by day)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const signupTrends: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const count = users.filter((u) => u.created_at?.startsWith(dateStr)).length;
      signupTrends.push({ date: dateStr, count });
    }

    // Active users (signed in within last 7 days)
    const activeUsers = users.filter(
      (u) => u.last_sign_in && new Date(u.last_sign_in) > sevenDaysAgo
    ).length;

    // Recent activity feed
    const recentActivity = [
      ...users.slice(0, 10).map((u) => ({
        type: "signup" as const,
        user: u.full_name || u.email.split("@")[0],
        detail: u.plan !== "free" ? `Signed up (${u.plan})` : "Signed up (free)",
        timestamp: u.created_at,
      })),
      ...(accounts || []).slice(0, 5).map((a) => ({
        type: "bank_connect" as const,
        user: users.find((u) => u.id === a.user_id)?.full_name || "Unknown",
        detail: `Connected ${a.institution_name || "bank account"}`,
        timestamp: a.connected_at,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 15);

    const stats = {
      totalUsers: users.length,
      proUsers: users.filter((u) => u.plan === "professional").length,
      execUsers: users.filter((u) => u.plan === "executive").length,
      freeUsers: users.filter((u) => u.plan === "free").length,
      connectedBanks: (accounts || []).length,
      mrr:
        users.filter((u) => u.plan === "professional").length * 99 +
        users.filter((u) => u.plan === "executive").length * 499,
      activeUsers,
      signupsLast7Days: users.filter(
        (u) => u.created_at && new Date(u.created_at) > sevenDaysAgo
      ).length,
      signupsLast30Days: users.filter(
        (u) => u.created_at && new Date(u.created_at) > thirtyDaysAgo
      ).length,
    };

    return NextResponse.json({ users, stats, signupTrends, recentActivity });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
