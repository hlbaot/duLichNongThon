"use client";

import { HeaderAuth } from "./header-auth";
import { HeaderBurger } from "./header-burger";

interface HeaderCompactProps {
  inert: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
}

/** "Cục" nhỏ ở góc phải trên khi cuộn xuống: nút hành động chính + hamburger. */
export function HeaderCompact({ inert, menuOpen, onToggleMenu }: HeaderCompactProps) {
  return (
    <div className="header-compact" inert={inert}>
      <HeaderAuth variant="compact" />
      <HeaderBurger open={menuOpen} onClick={onToggleMenu} className="header-burger-compact" />
    </div>
  );
}
