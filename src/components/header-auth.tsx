"use client";

import { ArrowRight, LogIn } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { AccountMenu } from "./account-menu";

interface HeaderAuthProps {
  variant: "full" | "compact" | "menu";
  onBeforeLogin?: () => void;
}

export function HeaderAuth({ variant, onBeforeLogin }: HeaderAuthProps) {
  const { user, openLoginModal } = useAuth();
  const pathname = usePathname();

  if (user) return <AccountMenu key={pathname} />;

  return (
    <button
      type="button"
      onClick={() => {
        onBeforeLogin?.();
        openLoginModal();
      }}
      className={`nav-login-button header-login header-login-${variant}`}
    >
      {variant === "full" ? null : <LogIn className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>Đăng nhập</span>
      {variant === "full" ? <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /> : null}
    </button>
  );
}
