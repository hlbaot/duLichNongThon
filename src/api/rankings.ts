import { https } from "./https";
import type { GetRankingsResponse, GetTopRankingsResponse } from "@/types/api/rankings";

export async function getTopRankings(): Promise<GetTopRankingsResponse> {
  const { data } = await https.get<GetTopRankingsResponse | null | "">("/rankings/top", {
    headers: { "Cache-Control": "no-store" },
  });
  if (!data) throw new Error("Chưa nhận được dữ liệu xếp hạng.");
  return data;
}

export async function getRankings(signal?: AbortSignal): Promise<GetRankingsResponse> {
  const { data } = await https.get<GetRankingsResponse | null | "">("/rankings", {
    signal,
    headers: { "Cache-Control": "no-store" },
  });
  if (!data) throw new Error("Chưa nhận được dữ liệu xếp hạng.");
  return data;
}
