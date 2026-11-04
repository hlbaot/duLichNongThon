import type { ApiUser, SendOtpResponse } from "./api/auth";

export interface AuthContextValue {
  user: ApiUser | null;
  isLoading: boolean;
  isVoting: boolean;
  loginModalOpen: boolean;
  pendingDestinationId: string | null;
  openLoginModal(destinationId?: string): void;
  closeLoginModal(): void;
  sendOtp(email: string): Promise<SendOtpResponse>;
  resendOtp(email: string): Promise<SendOtpResponse>;
  verifyOtp(email: string, otp: string): Promise<void>;
  logout(errorToastContainerId?: string): Promise<void>;
  usedVotes: number;
  remainingVotes: number;
  maxVotes: number;
  votedIds: string[];
  vote(destinationId: string): Promise<boolean>;
  hasVoted(destinationId: string): boolean;
}
