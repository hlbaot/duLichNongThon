import type { GetRankingsResponse } from "@/types/api/rankings";

/** Reject incomplete snapshots before they can replace the last usable ranking. */
export function isRankingSnapshot(value: unknown): value is GetRankingsResponse {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as GetRankingsResponse;
  return Number.isInteger(snapshot.totalVotes) && snapshot.totalVotes >= 0 &&
    Number.isInteger(snapshot.totalDestinations) && snapshot.totalDestinations >= 0 &&
    Array.isArray(snapshot.items) && snapshot.items.every(item => item &&
      typeof item.id === "string" && typeof item.slug === "string" &&
      typeof item.title === "string" && typeof item.shortTitle === "string" &&
      typeof item.brief === "string" && Number.isFinite(item.displayOrder) &&
      Number.isInteger(item.voteCount) && item.voteCount >= 0 &&
      Number.isInteger(item.rank) && item.rank >= 1);
}

interface RankingStreamOptions {
  url: string;
  applySnapshot(snapshot: GetRankingsResponse): void;
  setConnected(connected: boolean): void;
  refresh(signal: AbortSignal): Promise<void>;
}

/** One owner per provider; EventSource itself handles reconnection and heartbeats. */
export function startRankingStream(options: RankingStreamOptions): () => void {
  let stopped = false;
  let healthy = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let request: AbortController | undefined;
  let stream: EventSource | undefined;

  const scheduleFallback = () => {
    if (stopped || healthy || timer !== undefined || request) return;
    timer = setTimeout(async () => {
      timer = undefined;
      const controller = new AbortController();
      request = controller;
      try { await options.refresh(controller.signal); }
      catch { /* Keep the previous snapshot and try again on the next tick. */ }
      finally {
        if (request === controller) request = undefined;
        scheduleFallback();
      }
    }, 8_000);
  };
  const disconnected = () => {
    if (stopped) return;
    healthy = false;
    options.setConnected(false);
    scheduleFallback();
  };
  const onRanking = (event: MessageEvent<string>) => {
    if (stopped) return;
    try {
      const snapshot: unknown = JSON.parse(event.data);
      if (!isRankingSnapshot(snapshot)) throw new Error("Invalid ranking snapshot");
      options.applySnapshot(snapshot);
      healthy = true;
      options.setConnected(true);
      clearTimeout(timer);
      timer = undefined;
      request?.abort();
    } catch { disconnected(); }
  };

  options.setConnected(false);
  try {
    stream = new EventSource(options.url);
    stream.addEventListener("rankings", onRanking);
    // An open socket may still be waiting for its initial DB snapshot.
    stream.onopen = () => { if (!stopped) options.setConnected(true); };
    stream.onerror = disconnected;
  } catch { disconnected(); }
  scheduleFallback();

  return () => {
    stopped = true;
    clearTimeout(timer);
    request?.abort();
    stream?.removeEventListener("rankings", onRanking);
    stream?.close();
    options.setConnected(false);
  };
}
