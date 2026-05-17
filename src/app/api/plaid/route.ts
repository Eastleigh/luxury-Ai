import { NextRequest, NextResponse } from "next/server";

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || "";
const PLAID_SECRET = process.env.PLAID_SECRET || "";
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

const PLAID_BASE_URL =
  PLAID_ENV === "production"
    ? "https://production.plaid.com"
    : PLAID_ENV === "development"
      ? "https://development.plaid.com"
      : "https://sandbox.plaid.com";

async function plaidRequest(endpoint: string, body: Record<string, unknown>) {
  const res = await fetch(`${PLAID_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      ...body,
    }),
  });
  return res.json();
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();

    if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
      return NextResponse.json(
        { error: "Plaid credentials not configured. Set PLAID_CLIENT_ID and PLAID_SECRET env vars." },
        { status: 503 }
      );
    }

    switch (action) {
      case "create_link_token": {
        const data = await plaidRequest("/link/token/create", {
          user: { client_user_id: params.userId || "demo-user" },
          client_name: "Mavaree",
          products: ["transactions"],
          country_codes: ["US", "CA"],
          language: "en",
        });
        return NextResponse.json(data);
      }

      case "exchange_token": {
        const data = await plaidRequest("/item/public_token/exchange", {
          public_token: params.publicToken,
        });
        return NextResponse.json(data);
      }

      case "get_transactions": {
        const data = await plaidRequest("/transactions/get", {
          access_token: params.accessToken,
          start_date: params.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          end_date: params.endDate || new Date().toISOString().split("T")[0],
          options: { count: 500, offset: 0 },
        });
        return NextResponse.json(data);
      }

      case "get_accounts": {
        const data = await plaidRequest("/accounts/get", {
          access_token: params.accessToken,
        });
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Plaid API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
