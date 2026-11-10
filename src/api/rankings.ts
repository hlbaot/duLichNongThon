import { https } from "./https";
import axios from "axios";
import type { GetRankingsResponse, GetTopRankingsResponse, RankingCountsResponse } from "@/types/api/rankings";

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

/** A 404/405 permits a rolling deploy against the previous backend. */
export async function getRankingCounts(signal?: AbortSignal): Promise<RankingCountsResponse | null> {
  try {
    const { data } = await https.get<RankingCountsResponse>("/rankings/counts", {
      signal,
      headers: { "Cache-Control": "no-store" },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && [404, 405].includes(error.response?.status ?? 0)) return null;
    throw error;
  }
}
