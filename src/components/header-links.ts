/** Danh sách link dùng chung cho pill đầy đủ và menu toàn màn hình. */
export const HEADER_LINKS = [
  { id: "hero", label: "Trang chủ" },
  { id: "destinations", label: "Điểm đến" },
  { id: "leaderboard", label: "Xếp hạng" },
] as const;

export type HeaderLinkId = (typeof HEADER_LINKS)[number]["id"];

export const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

/**
 * Cuộn tới section (cùng cách cũ: Lenis nếu có, không thì scrollIntoView).
 * Trả về false nếu trang hiện tại không có section đó (ví dụ trang chi tiết).
 */
export function goToSection(id: string): boolean {
  const element = document.getElementById(id);
  if (!element) return false;
  if (window.__lenis) window.__lenis.scrollTo(element, { offset: -70 });
  else element.scrollIntoView({ behavior: "smooth" });
  return true;
}
