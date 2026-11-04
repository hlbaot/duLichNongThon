import axios from "axios";

const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");

export const https = axios.create({
  // Browser requests share the frontend origin; Next.js forwards them to the backend.
  baseURL: backendURL ? (typeof window === "undefined" ? backendURL : "/backend-api") : undefined,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Fail clearly instead of sending API requests to the Next.js frontend by mistake.
https.interceptors.request.use((config) => {
  if (!config.baseURL) {
    throw new Error("Chưa cấu hình NEXT_PUBLIC_API_BASE_URL (URL backend, không có /api).");
  }
  return config;
});

// Tokens belong to the caller's session, never shared through instance defaults.
export function bearerHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Cache-Control": "no-store",
  };
}
