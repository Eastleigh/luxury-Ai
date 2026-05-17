import { NextRequest, NextResponse } from "next/server";

const SEATS_AERO_API_KEY = process.env.SEATS_AERO_API_KEY || "";
const SEATS_AERO_BASE = "https://seats.aero/partnerapi";

export async function POST(request: NextRequest) {
  try {
    const { origin, destination, departureDate, cabin, passengers } = await request.json();

    if (!SEATS_AERO_API_KEY) {
      return NextResponse.json(
        { error: "Seats.aero API key not configured. Set SEATS_AERO_API_KEY env var." },
        { status: 503 }
      );
    }

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      origin_airport: origin,
      destination_airport: destination,
      ...(departureDate && { departure_date: departureDate }),
      ...(cabin && { cabin }),
      ...(passengers && { num_passengers: String(passengers) }),
    });

    const res = await fetch(`${SEATS_AERO_BASE}/search?${params}`, {
      headers: {
        "Partner-Authorization": SEATS_AERO_API_KEY,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Seats.aero API error: ${res.status} ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Award search error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
