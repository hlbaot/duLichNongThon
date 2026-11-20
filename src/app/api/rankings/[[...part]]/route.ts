import { connection, NextResponse } from "next/server";
import { isRankingCounts } from "@/lib/ranking-counts";
import { isRankingSnapshot } from "@/lib/ranking-stream";

const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");
const message = "Chưa tải được bảng xếp hạng. Vui lòng thử lại sau.";
const noStore = { "Cache-Control": "no-store" };

export async function GET(_request: Request, { params }: { params: Promise<{ part?: string[] }> }) {
  await connection();
  const { part = [] } = await params;
  const counts = part.length === 1 && part[0] === "counts";
  if (part.length && !counts) {
    return NextResponse.json({ message }, { status: 404, headers: noStore });
  }
  if (!backendURL) {
    return NextResponse.json({ message }, { status: 503, headers: noStore });
  }

  try {
    const upstream = await fetch(`${backendURL}/rankings${counts ? "/counts" : ""}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!upstream.ok) {
      const retryAfter = upstream.headers.get("Retry-After");
      await upstream.body?.cancel();
      return NextResponse.json({ message }, {
        status: upstream.status === 429 ? 503 : upstream.status,
        headers: retryAfter ? { ...noStore, "Retry-After": retryAfter } : noStore,
      });
    }
    const payload: unknown = await upstream.json();
    if (!(counts ? isRankingCounts(payload) : isRankingSnapshot(payload))) {
      throw new Error("Invalid ranking response");
    }
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Vercel-CDN-Cache-Control": "public, s-maxage=15, stale-while-revalidate=60, stale-if-error=300",
      },
    });
  } catch {
    return NextResponse.json({ message }, { status: 502, headers: noStore });
  }
}
