import { bearerHeaders, https } from "./https";
import type {
  GetMeResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/types/api/auth";

export async function sendOtp({ email }: SendOtpRequest): Promise<SendOtpResponse> {
  const { data } = await https.post<SendOtpResponse>("/auth/otp/send", { email });
  return data;
}

export async function verifyOtp({ email, otp }: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  const { data } = await https.post<VerifyOtpResponse>("/auth/otp/verify", { email, otp });
  return data;
}

/** Save both returned tokens. Coordinate refresh calls per session in the caller. */
export async function refreshToken({ refreshToken }: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  const { data } = await https.post<RefreshTokenResponse>("/auth/refresh", { refreshToken });
  return data;
}

export async function logout({ refreshToken }: LogoutRequest): Promise<LogoutResponse> {
  await https.post<LogoutResponse>("/auth/logout", { refreshToken });
}

export async function getMe(accessToken: string): Promise<GetMeResponse> {
  const { data } = await https.get<GetMeResponse>("/auth/me", {
    headers: bearerHeaders(accessToken),
  });
  return data;
}
