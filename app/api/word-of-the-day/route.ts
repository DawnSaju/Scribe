import { NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";
import { getDailyWordFromApis } from "@/lib/dailyWordProviders";
import { readDailyWordProviderConfig } from "@/lib/server/dailyWordProviderConfig";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE });
  }

  try {
    const token = await convexAuthNextjsToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
    }

    const providers = readDailyWordProviderConfig();
    const reservation = await fetchMutation(api.queries.reserveWordOfTheDayRequest, {}, { token });
    if (reservation.status === "unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
    }
    if (reservation.status === "limited") {
      return NextResponse.json(
        { error: "Too many daily word requests. Please try again later." },
        {
          status: 429,
          headers: { ...NO_STORE, "Retry-After": String(reservation.retryAfterSeconds) },
        }
      );
    }

    const word = await getDailyWordFromApis(providers);
    return NextResponse.json(word, { headers: NO_STORE });
  } catch (error) {
    console.error("Could not load a daily word:", error);
    return NextResponse.json(
      { error: "Could not load a word right now. Please try again." },
      { status: 503, headers: { ...NO_STORE, "Retry-After": "60" } }
    );
  }
}
