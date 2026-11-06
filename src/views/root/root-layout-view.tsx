/* eslint-disable @next/next/no-head-element -- This view renders the App Router root document. */
import { Lora, Manrope } from "next/font/google";
import { Toast } from "@/components/toast";
import { VotingProvider } from "@/context/voting-context";
import { GlobalModals } from "@/components/global-modals";

const bodyFont = Manrope({ subsets: ["latin", "vietnamese"], display: "swap", variable: "--font-manrope" });
const editorialFont = Lora({ subsets: ["latin", "vietnamese"], style: ["normal", "italic"], display: "swap", variable: "--font-lora" });

export default function RootLayoutView({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${bodyFont.variable} ${editorialFont.variable}`} suppressHydrationWarning>
      <head>
        {/* Đặt data-intro trước khi paint: tránh header nháy lên rồi biến mất. Chỉ trang chủ, một lần mỗi phiên. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;try{var home=location.pathname==="/";var played=sessionStorage.getItem("intro-played")==="1";var rm=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!home&&!played)sessionStorage.setItem("intro-played","1");d.dataset.intro=(home&&!played&&!rm)?"video":"done"}catch(e){d.dataset.intro="done"}})()`,
          }}
        />
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://f.vimeocdn.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vod-adaptive-ak.vimeocdn.com" />
        <link rel="dns-prefetch" href="https://vod-adaptive.akamaized.net" />
      </head>
      <body className="isolate min-h-screen bg-bg-base text-[#1B2B22] font-sans antialiased selection:bg-[#7CB342]/20 selection:text-[#1F6B45]">
        <VotingProvider>
          {children}
          <GlobalModals />
          <Toast />
        </VotingProvider>
      </body>
    </html>
  );
}
