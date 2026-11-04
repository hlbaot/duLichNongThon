"use client";

import { useIntroSequence } from "@/hooks/useIntroSequence";

/** Khởi chạy hiệu ứng mở đầu trang chủ. Không render gì; CSS đọc `html[data-intro]`. */
export function IntroSequence() {
  useIntroSequence();
  return null;
}
