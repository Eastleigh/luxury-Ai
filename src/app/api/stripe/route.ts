import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured. Set STRIPE_SECRET_KEY env var." },
        { status: 503 }
      );
    }

    const { plan, email } = await request.json();

    const priceMap: Record<string, string | undefined> = {
      professional: process.env.STRIPE_PRICE_PROFESSIONAL,
      executive: process.env.STRIPE_PRICE_EXECUTIVE,
    };

    if (!plan || !(plan in priceMap)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const priceId = priceMap[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe pricing not configured. Please set STRIPE_PRICE_PROFESSIONAL and STRIPE_PRICE_EXECUTIVE env vars." },
        { status: 503 }
      );
    }

    const origin = request.headers.get("origin") || "https://mavaree.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
