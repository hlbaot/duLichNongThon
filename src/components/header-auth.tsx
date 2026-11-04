"use client";

import { ArrowRight, LogIn } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useVoting } from "@/context/voting-context";
import { AccountMenu } from "./account-menu";

interface HeaderAuthProps {
  variant: "full" | "compact" | "menu";
  /** Chạy ngay trước khi mở modal đăng nhập (vd. đóng menu toàn màn hình). */
  onBeforeLogin?: () => void;
}

/** Nút hành động chính: Đăng nhập, hoặc avatar nếu đã đăng nhập. Giữ nguyên handler cũ. */
export function HeaderAuth({ variant, onBeforeLogin }: HeaderAuthProps) {
  const { user, setLoginModalOpen } = useVoting();
  const { isLoading } = useAuth();
  const pathname = usePathname();

  if (user) return <AccountMenu key={pathname} />;

  return (
    <button
      type="button"
      onClick={() => {
        onBeforeLogin?.();
        setLoginModalOpen(true);
      }}
      disabled={isLoading}
      className={`nav-login-button header-login header-login-${variant}`}
    >
      {variant === "full" ? null : <LogIn className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>Đăng nhập</span>
      {variant === "full" ? <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /> : null}
    </button>
  );
}
