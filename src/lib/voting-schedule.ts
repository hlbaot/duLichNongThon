export interface VotingCountdown {
  remaining: number;
  status: "upcoming" | "open" | "ended";
}

/** All campaign timestamps must include their timezone; the browser supplies now. */
export function getVotingCountdown(startAt: string | undefined, endAt: string | undefined, now: number): VotingCountdown | null {
  if (!endAt) return null;
  const end = Date.parse(endAt);
  const start = startAt ? Date.parse(startAt) : undefined;
  if (!Number.isFinite(end) || (start !== undefined && (!Number.isFinite(start) || start >= end))) return null;
  if (start !== undefined && now < start) return { remaining: start - now, status: "upcoming" };
  if (now >= end) return { remaining: 0, status: "ended" };
  return { remaining: end - now, status: "open" };
}
