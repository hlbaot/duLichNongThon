"use client";

import { ArrowRight, LogIn } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { AccountMenu } from "./account-menu";

interface HeaderAuthProps {
  variant: "full" | "compact" | "menu";
}

export function HeaderAuth({ variant }: HeaderAuthProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (user) return <AccountMenu key={pathname} />;

  return (
    <button
      type="button"
      disabled
      className={`nav-login-button header-login header-login-${variant}`}
    >
      {variant === "full" ? null : <LogIn className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>Đăng nhập</span>
      {variant === "full" ? <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /> : null}
    </button>
  );
}
