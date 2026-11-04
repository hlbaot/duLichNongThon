"use client";

import { usePathname, useRouter } from "next/navigation";
import { HEADER_LINKS, goToSection } from "./header-links";
import { HeaderFull } from "./header-full";
import { HeaderCompact } from "./header-compact";
import { FullscreenMenu } from "./fullscreen-menu";
import { useActiveSection, useHeaderState } from "@/hooks/useHeaderState";

const SECTION_IDS = HEADER_LINKS.map((link) => link.id);

/** Khung header: ghép pill đầy đủ, cục thu gọn và menu toàn màn hình theo trạng thái. */
export function Navbar() {
  const { collapsed, ready, menuOpen, openMenu, closeMenu } = useHeaderState();
  const router = useRouter();
  const isHome = usePathname() === "/";
  const activeId = useActiveSection(SECTION_IDS);

  const toggleMenu = () => (menuOpen ? closeMenu() : openMenu());

  const navigate = (id: string) => {
    if (menuOpen) {
      // Đóng menu (mở khóa cuộn) trước rồi mới cuộn.
      closeMenu();
      window.setTimeout(() => {
        if (!goToSection(id)) router.push(`/#${id}`);
      }, 80);
      return;
    }
    // Trang không có section đó (vd. trang chi tiết): về trang chủ tới đúng section.
    if (!goToSection(id)) router.push(`/#${id}`);
  };

  return (
    <>
      <header
        className="site-header fixed top-4 inset-x-0 z-50 px-4 sm:px-6"
        data-tone={isHome ? "light" : "dark"}
        data-collapsed={collapsed}
        data-ready={ready}
      >
        <HeaderFull inert={collapsed} activeId={activeId} menuOpen={menuOpen} onNavigate={navigate} onToggleMenu={toggleMenu} />
        <HeaderCompact inert={!collapsed} menuOpen={menuOpen} onToggleMenu={toggleMenu} />
      </header>
      <FullscreenMenu open={menuOpen} activeId={activeId} onClose={closeMenu} onNavigate={navigate} />
    </>
  );
}
