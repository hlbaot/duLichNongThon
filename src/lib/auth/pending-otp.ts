import axios from "axios";
import type { SendOtpResponse } from "@/types/api/auth";

export interface PendingOtp {
  email: string;
  resendAt: number;
  /** Unknown when the backend only reports that a challenge already exists. */
  expiresAt: number | null;
}

const KEY = "dlnt2026:pending-otp";
let remembered: PendingOtp | null = null;

export function readPendingOtp(email?: string): PendingOtp | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) {
      const value = JSON.parse(raw);
      if (typeof value.email === "string" && Number.isFinite(value.resendAt) && (value.expiresAt === null || Number.isFinite(value.expiresAt))) remembered = value;
    }
  } catch { /* Keep in-memory recovery when sessionStorage is unavailable. */ }
  return remembered && (!email || remembered.email === email) ? remembered : null;
}

function savePendingOtp(value: PendingOtp): PendingOtp {
  remembered = value;
  try { window.sessionStorage.setItem(KEY, JSON.stringify(value)); } catch { /* Memory fallback. */ }
  return value;
}

export function clearPendingOtp(email: string) {
  if (readPendingOtp()?.email !== email) return;
  remembered = null;
  try { window.sessionStorage.removeItem(KEY); } catch { /* Memory fallback. */ }
}

function retryAt(error: unknown, now: number): number | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  const seconds = error.response?.data?.retryAfter ?? error.response?.headers?.["retry-after"];
  if (seconds !== undefined && Number.isFinite(Number(seconds)) && Number(seconds) >= 0) return now + Number(seconds) * 1000;
  if (typeof seconds === "string" && Number.isFinite(Date.parse(seconds))) return Math.max(now, Date.parse(seconds));
  return undefined;
}

function fromResponse(email: string, response: SendOtpResponse): PendingOtp {
  const now = Date.now();
  return savePendingOtp({ email, resendAt: now + response.retryAfter * 1000, expiresAt: now + response.expiresIn * 1000 });
}

/** Resume the existing challenge; a 409 is a route to OTP entry, not a dead end. */
export async function requestOtpChallenge(email: string, send: (email: string) => Promise<SendOtpResponse>): Promise<PendingOtp> {
  const previous = readPendingOtp(email);
  if (previous) return previous;
  try { return fromResponse(email, await send(email)); }
  catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 409) throw error;
    return savePendingOtp({ email, resendAt: retryAt(error, Date.now()) ?? 0, expiresAt: null });
  }
}

export async function resendOtpChallenge(email: string, resend: (email: string) => Promise<SendOtpResponse>): Promise<PendingOtp> {
  const previous = readPendingOtp(email);
  if (previous && previous.resendAt > Date.now()) return previous;
  try { return fromResponse(email, await resend(email)); }
  catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      // The send cooldown is 60 seconds when the response has no retry metadata.
      savePendingOtp({ email, expiresAt: previous?.expiresAt ?? null, resendAt: retryAt(error, Date.now()) ?? Date.now() + 60_000 });
    }
    throw error;
  }
}
