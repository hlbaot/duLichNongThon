"use client";

interface HeaderBurgerProps {
  open: boolean;
  onClick: () => void;
  className?: string;
}

/** Nút hamburger 2 gạch, dùng chung cho pill (mobile) và cục thu gọn. */
export function HeaderBurger({ open, onClick, className = "" }: HeaderBurgerProps) {
  return (
    <button
      type="button"
      className={`header-burger ${className}`}
      onClick={onClick}
      aria-label={open ? "Đóng menu" : "Mở menu"}
      aria-expanded={open}
      aria-controls="fullscreen-menu"
    >
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 8h14" />
        <path d="M4 14h14" />
      </svg>
    </button>
  );
}
