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

    const stats = {
      totalUsers: users.length,
      proUsers: users.filter((u) => u.plan === "professional").length,
      execUsers: users.filter((u) => u.plan === "executive").length,
      freeUsers: users.filter((u) => u.plan === "free").length,
      connectedBanks: (accounts || []).length,
      mrr:
        users.filter((u) => u.plan === "professional").length * 79 +
        users.filter((u) => u.plan === "executive").length * 499,
    };

    return NextResponse.json({ users, stats });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
