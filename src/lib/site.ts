/** Public website origin, shared by canonical metadata, robots and sitemap. */
function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const url = new URL(configured);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL phải là origin HTTP(S), không chứa đường dẫn, query hoặc thông tin đăng nhập.");
  }
  return url.origin;
}

export const SITE_URL = getSiteUrl();

export function destinationUrl(slug: string): string {
  return `${SITE_URL}/diem-den/${encodeURIComponent(slug)}`;
}

export function publicImageUrl(image: string | null): string | undefined {
  if (!image?.trim()) return undefined;
  try {
    const url = new URL(image, `${SITE_URL}/`);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : undefined;
  } catch {
    return undefined;
  }
}
