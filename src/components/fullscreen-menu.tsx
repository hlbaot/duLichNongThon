"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { HEADER_LINKS, formatIndex } from "./header-links";
import { HeaderAuth } from "./header-auth";

interface FullscreenMenuProps {
  open: boolean;
  activeId: string | null;
  onClose: (options?: { restoreFocus?: boolean }) => void;
  onNavigate: (id: string) => void;
}

const FOCUSABLE = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

/** Menu toàn màn hình: link chữ HOA cỡ lớn, hiện lần lượt, hover làm mờ các link còn lại. */
export function FullscreenMenu({ open, activeId, onClose, onNavigate }: FullscreenMenuProps) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // Mở: phần còn lại của trang inert (không focus được, ẩn khỏi trình đọc màn hình) và đưa focus vào menu.
  useEffect(() => {
    if (!open) return;
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, footer, .site-header"));
    background.forEach((el) => el.setAttribute("inert", ""));
    const frame = requestAnimationFrame(() => closeButton.current?.focus({ preventScroll: true }));
    return () => {
      cancelAnimationFrame(frame);
      background.forEach((el) => el.removeAttribute("inert"));
    };
  }, [open]);

  // Focus trap: Tab/Shift+Tab xoay vòng trong overlay.
  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panel.current) return;
    const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      id="fullscreen-menu"
      ref={panel}
      className="fsm"
      data-open={open}
      inert={!open}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={trapFocus}
      onClick={(event) => {
        // Bấm vào vùng nền (không phải link/nút) thì đóng.
        if (!(event.target as HTMLElement).closest("a, button")) onClose();
      }}
    >
      <div className="fsm-top">
        <HeaderAuth variant="menu" onBeforeLogin={() => onClose({ restoreFocus: false })} />
        <button ref={closeButton} type="button" className="header-burger fsm-close" onClick={() => onClose()} aria-label="Đóng menu">
          <X aria-hidden="true" size={22} />
        </button>
      </div>

      <nav className="fsm-nav" aria-label="Menu chính">
        <ul className="fsm-list">
          {HEADER_LINKS.map((link, index) => (
            <li key={link.id} className="fsm-item" style={{ "--i": index } as React.CSSProperties}>
              <a
                href={`/#${link.id}`}
                className="fsm-link"
                aria-current={activeId === link.id ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(link.id);
                }}
              >
                <span className="fsm-index" aria-hidden="true">{formatIndex(index)}</span>
                <span className="fsm-label">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="fsm-foot">
        <div className="fsm-brand">
          <span className="fsm-logo"><Image src="/logo.png" alt="" sizes="36px" fill className="object-cover" /></span>
          <span>Hội Thi Điểm Đến Du Lịch Nông Thôn Tốt Nhất Việt Nam Năm 2026</span>
        </div>
        <p>Tôn vinh 35 điểm đến du lịch nông thôn tiêu biểu.</p>
      </div>
    </div>
  );
}
