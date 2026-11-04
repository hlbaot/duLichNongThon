import type { Metadata, Viewport } from "next";
import RootLayoutView from "@/views/root/root-layout-view";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cuộc thi Du lịch Nông thôn 2026 | Bình chọn 35 Điểm đến Toàn quốc",
  description: "Trang bình chọn trực tuyến chính thức cho 35 điểm đến du lịch nông nghiệp, làng nghề sinh thái tiêu biểu của Việt Nam.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

// Keep browser zoom and pinch-to-zoom available at every breakpoint.
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default RootLayoutView;
