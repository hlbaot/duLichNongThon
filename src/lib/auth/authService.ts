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

function readSession(): VerifyOtpResponse | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value === "object" && value !== null &&
      "accessToken" in value && typeof value.accessToken === "string" &&
      "refreshToken" in value && typeof value.refreshToken === "string") return value as VerifyOtpResponse;
  } catch { /* Invalid local session: require a fresh login. */ }
  window.localStorage.removeItem(SESSION_KEY);
  return null;
}

function saveSession(session: VerifyOtpResponse) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
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
  async verifyOtp(email: string, otp: string) {
    const session = await api.verifyOtp({ email: normalizeEmail(email), otp });
    saveSession(session);
    return session.user;
  },
  async getAccount() {
    if (!readSession()) return { user: null, myVotes: null };
    const [user, myVotes] = await Promise.all([
      authorized(api.getMe), authorized(getMyVotes),
    ]);
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
