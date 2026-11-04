import type { Metadata, Viewport } from "next";
import RootLayoutView from "@/views/root/root-layout-view";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hội Thi Điểm Đến Du Lịch Nông Thôn Tốt Nhất Việt Nam Năm 2026",
  description: "Hội thi được tổ chức nhằm tìm kiếm, giới thiệu và tôn vinh các điểm đến tiêu biểu, mang đậm bản sắc văn hóa, cảnh quan và những trải nghiệm đặc trưng của các vùng quê Việt Nam.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

// Keep browser zoom and pinch-to-zoom available at every breakpoint.
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default RootLayoutView;
