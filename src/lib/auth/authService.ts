import axios from "axios";
import * as api from "@/api/auth";
import { getMyVotes, createVote } from "@/api/votes";
import type { VerifyOtpResponse } from "@/types/api/auth";

const SESSION_KEY = "dlnt2026:api-session";
let refreshing: { token: string; promise: Promise<VerifyOtpResponse> } | null = null;

export function normalizeEmail(email: string): string {
  const clean = email.trim().toLowerCase();
  if (clean.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    throw new Error("Vui lòng nhập email hợp lệ.");
  }
  return clean;
}

const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 ngày

function readCookie(): string | null {
  const prefix = `${SESSION_KEY}=`;
  const entry = document.cookie.split("; ").find(part => part.startsWith(prefix));
  if (!entry) return null;
  try { return decodeURIComponent(entry.slice(prefix.length)); } catch { return null; }
}

function writeCookie(value: string, maxAge: number) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_KEY}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function readSession(): VerifyOtpResponse | null {
  const cookie = readCookie();
  // Migrate a still-valid session saved by earlier frontend versions.
  const raw = cookie ?? window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value === "object" && value !== null &&
      "accessToken" in value && typeof value.accessToken === "string" &&
      "refreshToken" in value && typeof value.refreshToken === "string") {
      const session = value as VerifyOtpResponse;
      if (!cookie) saveSession(session);
      return session;
    }
  } catch { /* Invalid local session: require a fresh login. */ }
  clearSession();
  return null;
}

function saveSession(session: VerifyOtpResponse) {
  const maxAge = Number.isFinite(session.refreshExpiresIn)
    ? Math.max(0, Math.min(SESSION_MAX_AGE, Math.floor(session.refreshExpiresIn)))
    : SESSION_MAX_AGE;
  writeCookie(JSON.stringify(session), maxAge);
  // Dọn token cũ từng lưu trong localStorage (nếu có).
  window.localStorage.removeItem(SESSION_KEY);
}

function clearSession() {
  writeCookie("", 0);
  window.localStorage.removeItem(SESSION_KEY);
}

async function authorized<T>(operation: (accessToken: string) => Promise<T>): Promise<T> {
  const session = readSession();
  if (!session) throw new Error("Vui lòng đăng nhập để bình chọn.");
  try { return await operation(session.accessToken); }
  catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
    // Another request may already have rotated the tokens.
    let current = readSession();
    if (!current || current.user?.id !== session.user?.id) throw error;
    if (current.accessToken === session.accessToken) {
      if (!refreshing || refreshing.token !== current.refreshToken) {
        const token = current.refreshToken;
        const promise = api.refreshToken({ refreshToken: token }).then(next => {
          if (readSession()?.refreshToken !== token) throw new Error("Phiên đăng nhập đã thay đổi.");
          saveSession(next);
          return next;
        }).catch(issue => {
          if (axios.isAxiosError(issue) && issue.response?.status === 401 && readSession()?.refreshToken === token) clearSession();
          throw issue;
        }).finally(() => { if (refreshing?.promise === promise) refreshing = null; });
        refreshing = { token, promise };
      }
      current = await refreshing.promise;
    }
    return operation(current.accessToken);
  }
}

export const authService = {
  hasSession: () => readSession() !== null,
  async sendOtp(email: string) { return api.sendOtp({ email: normalizeEmail(email) }); },
  async resendOtp(email: string) { return api.resendOtp({ email: normalizeEmail(email) }); },
  async verifyOtp(email: string, otp: string) {
    const session = await api.verifyOtp({ email: normalizeEmail(email), otp });
    saveSession(session);
    return session.user;
  },
  async getAccount() {
    if (!readSession()) return { user: null, myVotes: null };
    const user = await authorized(api.getMe);
    // A vote-history network failure must not make a valid session look logged out.
    const myVotes = await authorized(getMyVotes).catch(error => {
      if (!readSession()) throw error;
      return null;
    });
    return { user, myVotes };
  },
  async vote(destinationId: string) {
    return authorized(token => createVote({ destinationId }, token));
  },
  async logout() {
    // Finish in-flight rotation so logout revokes the latest refresh token.
    if (refreshing) await refreshing.promise;
    const session = readSession();
    if (session) await api.logout({ refreshToken: session.refreshToken });
    clearSession();
  },
};
