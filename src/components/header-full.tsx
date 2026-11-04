"use client";

import Image from "next/image";
import { HEADER_LINKS, formatIndex } from "./header-links";
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
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-md ring-1 ring-[#1F6B45]/30">
            <Image src="/logo.png" alt="Logo Cuộc thi Du lịch Nông thôn" sizes="40px" fill className="object-cover" priority />
          </div>
          <div className="text-left">
            <span className="block font-black text-sm tracking-tight text-inherit transition-colors leading-tight drop-shadow-2xs">
              Du Lịch Nông Thôn
            </span>
            <span className="block text-[11px] font-bold text-inherit leading-none">Bình chọn 2026</span>
          </div>
        </button>

        <div className="nav-links">
          {HEADER_LINKS.map((link, index) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              aria-current={activeId === link.id ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(link.id);
              }}
            >
              <sup className="nav-index" aria-hidden="true">{formatIndex(index)}</sup>
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
