import type { GetRankingsResponse, RankingCountsResponse } from "@/types/api/rankings";
import { isRankingCounts } from "./ranking-counts";

/** Reject incomplete snapshots before they can replace the last usable ranking. */
export function isRankingSnapshot(value: unknown): value is GetRankingsResponse {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as GetRankingsResponse;
  return isRankingCounts(snapshot) && Number.isInteger(snapshot.totalVotes) && snapshot.totalVotes >= 0 &&
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
  applyCounts?(snapshot: RankingCountsResponse): boolean;
  setConnected(connected: boolean): void;
  refresh(signal: AbortSignal): Promise<void>;
  visibility?: Pick<Document, "visibilityState" | "addEventListener" | "removeEventListener">;
}

/** One owner per provider; EventSource itself handles reconnection and heartbeats. */
export function startRankingStream(options: RankingStreamOptions): () => void {
  let stopped = false;
  let healthy = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let request: AbortController | undefined;
  let stream: EventSource | undefined;
  let detachStream: (() => void) | undefined;
  let generation = 0;
  let retries = 0;
  const visibility = options.visibility ?? (typeof document === "undefined" ? undefined : document);
  const visible = () => visibility?.visibilityState !== "hidden";

  const refresh = async () => {
    if (stopped || !visible() || healthy || request) return;
    const activeGeneration = generation;
    const controller = new AbortController();
    request = controller;
    try { await options.refresh(controller.signal); }
    catch { /* Preserve the last valid snapshot on transport errors. */ }
    finally {
      if (request === controller) request = undefined;
      if (activeGeneration === generation) {
        retries++;
        scheduleFallback();
      }
    }
  };

  const scheduleFallback = () => {
    if (stopped || !visible() || healthy || timer !== undefined || request) return;
    const activeGeneration = generation;
    const delay = Math.min(60_000, 30_000 * 2 ** Math.min(retries, 1)) + Math.floor(Math.random() * 5_000);
    timer = setTimeout(() => {
      timer = undefined;
      if (activeGeneration === generation) return refresh();
    }, delay);
  };
  const disconnected = () => {
    if (stopped || !visible()) return;
    healthy = false;
    options.setConnected(false);
    scheduleFallback();
  };
  const connected = () => {
    healthy = true;
    retries = 0;
    options.setConnected(true);
    clearTimeout(timer);
    timer = undefined;
    request?.abort();
  };
  const pause = () => {
    generation++;
    healthy = false;
    clearTimeout(timer);
    timer = undefined;
    request?.abort();
    request = undefined;
    if (stream) { stream.onopen = null; stream.onerror = null; }
    detachStream?.();
    detachStream = undefined;
    stream?.close();
    stream = undefined;
    options.setConnected(false);
  };
  const open = () => {
    if (stopped || !visible() || stream) return;
    options.setConnected(false);
    try {
      const source = new EventSource(options.url);
      stream = source;
      const active = () => !stopped && visible() && stream === source;
      const onRanking = (event: MessageEvent<string>) => {
        if (!active()) return;
        try {
          const snapshot: unknown = JSON.parse(event.data);
          if (!isRankingSnapshot(snapshot)) throw new Error("Invalid ranking snapshot");
          options.applySnapshot(snapshot);
          connected();
        } catch { disconnected(); }
      };
      const onCounts = (event: MessageEvent<string>) => {
        if (!active()) return;
        try {
          const counts: unknown = JSON.parse(event.data);
          if (!isRankingCounts(counts) || !options.applyCounts?.(counts)) throw new Error("Missing ranking metadata");
          connected();
        } catch {
          disconnected();
          // An active destination may have changed; recover metadata without
          // clearing the displayed ranking or applying an incomplete update.
          void refresh();
        }
      };
      source.addEventListener("rankings", onRanking);
      source.addEventListener("ranking-counts", onCounts);
      detachStream = () => {
        source.removeEventListener("rankings", onRanking);
        source.removeEventListener("ranking-counts", onCounts);
      };
      source.onerror = () => { if (active()) disconnected(); };
      // Wait for valid data, not merely an open socket, before declaring healthy.
    } catch { disconnected(); }
    scheduleFallback();
  };
  const onVisibility = () => {
    if (stopped) return;
    if (!visible()) { pause(); return; }
    if (!stream) {
      retries = 0;
      open();
      // Immediately catch up on return; a newer SSE snapshot aborts this read.
      void refresh();
    }
  };
  visibility?.addEventListener("visibilitychange", onVisibility);
  options.setConnected(false);
  open();

  return () => {
    stopped = true;
    visibility?.removeEventListener("visibilitychange", onVisibility);
    pause();
  };
}
