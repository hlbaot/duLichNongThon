/* eslint-disable @next/next/no-page-custom-font, @next/next/no-head-element -- This view renders the App Router root document. */
import { Toast } from "@/components/toast";
import { VotingProvider } from "@/context/voting-context";
import { GlobalModals } from "@/components/global-modals";

export default function RootLayoutView({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />
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
