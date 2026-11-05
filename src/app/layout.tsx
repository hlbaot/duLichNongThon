import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import RootLayoutView from "@/views/root/root-layout-view";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hội Thi Điểm Đến Du Lịch Nông Thôn Tốt Nhất Việt Nam Năm 2026",
    template: "%s | Hội thi Du lịch Nông thôn 2026",
  },
  description: "Hội thi được tổ chức nhằm tìm kiếm, giới thiệu và tôn vinh các điểm đến tiêu biểu, mang đậm bản sắc văn hóa, cảnh quan và những trải nghiệm đặc trưng của các vùng quê Việt Nam.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Hội thi Du lịch Nông thôn 2026",
    title: "Hội thi Điểm đến du lịch nông thôn Việt Nam tốt nhất năm 2026",
    description: "Khám phá và bình chọn các điểm đến du lịch nông thôn tiêu biểu trên khắp Việt Nam.",
    images: [{ url: "/videos/campaign-poster.jpg", alt: "Du lịch nông thôn Việt Nam" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hội thi Du lịch Nông thôn 2026",
    description: "Khám phá và bình chọn các điểm đến du lịch nông thôn tiêu biểu trên khắp Việt Nam.",
    images: ["/videos/campaign-poster.jpg"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

// Keep browser zoom and pinch-to-zoom available at every breakpoint.
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default RootLayoutView;
