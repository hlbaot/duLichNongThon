"use client";

import Image from "next/image";
import { HEADER_LINKS } from "./header-links";
import { HeaderAuth } from "./header-auth";
import { HeaderBurger } from "./header-burger";

interface HeaderFullProps {
  inert: boolean;
  activeId: string | null;
  menuOpen: boolean;
  onNavigate: (id: string) => void;
  onToggleMenu: () => void;
}

/** Pill đầy đủ (đầu trang): logo, link có số thứ tự, nút Đăng nhập/avatar. Dưới 768px chỉ còn logo + hamburger. */
export function HeaderFull({ inert, activeId, menuOpen, onNavigate, onToggleMenu }: HeaderFullProps) {
  return (
    <div className="header-full" inert={inert}>
      <nav className="liquid-nav" aria-label="Thanh điều hướng">
        <button
          type="button"
          onClick={() => onNavigate("hero")}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6B45] rounded-full"
        >
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
            <Image src="/logo.png" alt="Logo Hội thi Điểm đến du lịch nông thôn tốt nhất Việt Nam năm 2026" sizes="48px" fill className="object-cover" priority />
          </div>
          <div className="text-left">
            <span className="block font-black text-xs sm:text-sm tracking-tight text-inherit transition-colors leading-tight drop-shadow-2xs">
              Hội Thi Điểm Đến Du Lịch Nông Thôn
            </span>
            <span className="block text-[10px] sm:text-[11px] font-bold text-inherit leading-tight">
              Tốt Nhất Việt Nam Năm 2026
            </span>
          </div>
        </button>

        <div className="nav-links">
          {HEADER_LINKS.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              aria-current={activeId === link.id ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(link.id);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="header-actions">
          <HeaderAuth variant="full" />
          <HeaderBurger open={menuOpen} onClick={onToggleMenu} className="header-burger-full" />
        </div>
      </nav>
    </div>
  );
}
