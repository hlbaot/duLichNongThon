import type { ISODateTime, UUID } from "./common";

export interface ApiUser {
  id: UUID;
  /** Legacy phone accounts may have no email. */
  email: string | null;
  createdAt: ISODateTime;
}

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  message: string;
  /** Seconds until the OTP expires. */
  expiresIn: number;
  /** Seconds until another OTP may be requested. */
  retryAfter: number;
}

export interface VerifyOtpRequest {
  email: string;
  /** Exactly six digits; keep leading zeroes. */
  otp: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  /** Opaque token, not a JWT. */
  refreshToken: string;
  tokenType: "Bearer";
  /** Seconds. */
  expiresIn: number;
  /** Seconds remaining in the session. */
  refreshExpiresIn: number;
  user: ApiUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type RefreshTokenResponse = VerifyOtpResponse;

export interface LogoutRequest {
  refreshToken: string;
}

export type LogoutResponse = void;
export type GetMeResponse = ApiUser;
