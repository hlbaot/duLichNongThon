"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import { apiErrorMessage } from "@/api/errors";
import { authService } from "./authService";
import { useVotingStore } from "@/stores/use-voting-store";
import type { AuthContextValue } from "@/types/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useVotingStore(state => state.user);
  const myVotes = useVotingStore(state => state.myVotes);
  const isVoting = useVotingStore(state => state.isVoting);
  const [isLoading, setIsLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingDestinationId, setPendingDestinationId] = useState<string | null>(null);
  const pending = useRef<string | null>(null);
  const alive = useRef(false);
  const accountSequence = useRef(0);
  const refreshAccount = useCallback(async () => {
    const sequence = ++accountSequence.current;
    try {
      const account = await authService.getAccount();
      if (alive.current && sequence === accountSequence.current) useVotingStore.getState().setAccount(account.user, account.myVotes);
    } catch (error) {
      if (alive.current && sequence === accountSequence.current) {
        if (!authService.hasSession()) useVotingStore.getState().setAccount(null, null);
        toast.error(apiErrorMessage(error), { toastId: "account-error" });
      }
    } finally {
      if (alive.current && sequence === accountSequence.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const sequenceCounter = accountSequence;
    alive.current = true;
    void refreshAccount();
    const refreshRankings = () => {
      if (document.visibilityState === "visible") void useVotingStore.getState().refreshRankings();
    };
    refreshRankings();
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === "dlnt2026:api-session") void refreshAccount();
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") { void refreshAccount(); refreshRankings(); }
    };
    const interval = window.setInterval(refreshRankings, 10_000);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive.current = false;
      ++sequenceCounter.current;
      window.clearInterval(interval);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshAccount]);

  const openLoginModal = useCallback((destinationId?: string) => {
    pending.current = destinationId ?? null;
    setPendingDestinationId(pending.current);
    setLoginModalOpen(true);
  }, []);
  const closeLoginModal = useCallback(() => {
    pending.current = null;
    setPendingDestinationId(null);
    setLoginModalOpen(false);
  }, []);
  const vote = useCallback(async (destinationId: string): Promise<boolean> => {
    const state = useVotingStore.getState();
    if (isLoading) { toast.info("Đang tải tài khoản. Vui lòng thử lại sau giây lát."); return false; }
    if (!state.user) { openLoginModal(destinationId); return false; }
    if (state.isVoting) return false;
    if (!state.myVotes) { toast.error("Chưa tải được lượt bình chọn. Vui lòng thử lại."); void refreshAccount(); return false; }
    if (state.myVotes.items.some(item => item.destinationId === destinationId)) { toast.error("Bạn đã bình chọn điểm đến này."); return false; }
    state.setIsVoting(true);
    let committed = false;
    try {
      await authService.vote(destinationId);
      committed = true;
      useVotingStore.getState().applyConfirmedVote(destinationId);
      toast.success("Bình chọn thành công.");
      return true;
    } catch (error) {
      toast.error(apiErrorMessage(error));
      return false;
    } finally {
      // Also reconcile an ambiguous timeout without submitting another vote.
      await Promise.all([refreshAccount(), useVotingStore.getState().refreshRankings()]);
      if (!committed && !authService.hasSession()) openLoginModal();
      useVotingStore.getState().setIsVoting(false);
    }
  }, [isLoading, openLoginModal, refreshAccount]);
  const verifyOtp = useCallback(async (email: string, otp: string) => {
    try {
      const verifiedUser = await authService.verifyOtp(email, otp);
      useVotingStore.getState().setAccount(verifiedUser, null);
      await refreshAccount();
      const waiting = pending.current;
      closeLoginModal();
      toast.success("Đăng nhập thành công.");
      // Ask for confirmation after login rather than submitting an irreversible vote.
      if (waiting) setPendingDestinationId(waiting);
    } catch (error) {
      throw new Error(apiErrorMessage(error));
    }
  }, [closeLoginModal, refreshAccount]);
  const logout = useCallback(async (containerId?: string) => {
    try {
      ++accountSequence.current;
      await authService.logout();
      ++accountSequence.current;
      useVotingStore.getState().setAccount(null, null);
      closeLoginModal();
      toast.success("Đã đăng xuất thành công.");
    } catch (error) { toast.error(apiErrorMessage(error), { containerId }); }
  }, [closeLoginModal]);
  const votedIds = myVotes?.items.map(item => item.destinationId) ?? [];
  return <AuthContext.Provider value={{
    user, isLoading, isVoting, loginModalOpen, pendingDestinationId,
    openLoginModal, closeLoginModal,
    sendOtp: async email => {
      try { return await authService.sendOtp(email); }
      catch (error) { throw new Error(apiErrorMessage(error)); }
    },
    resendOtp: async email => {
      try { return await authService.resendOtp(email); }
      catch (error) { throw new Error(apiErrorMessage(error)); }
    },
    verifyOtp, logout, vote,
    usedVotes: myVotes?.usedVotes ?? 0,
    remainingVotes: myVotes?.remainingVotes ?? 0,
    maxVotes: myVotes?.maxVotes ?? 0,
    votedIds, hasVoted: id => votedIds.includes(id),
  }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth phải được dùng bên trong AuthProvider.");
  return value;
}
