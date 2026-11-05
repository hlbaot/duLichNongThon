import type { Metadata } from "next";
import LoginView from "@/views/auth/login-view";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default LoginView;
