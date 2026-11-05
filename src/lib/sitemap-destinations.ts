import { getDestinations } from "@/api/destinations";
import { getRankings } from "@/api/rankings";
import type { DestinationSummary } from "@/types/api/destinations";

/** Both endpoints return active destinations; never invent slugs or update dates. */
export async function loadSitemapDestinations(): Promise<DestinationSummary[]> {
  let items: DestinationSummary[];
  try {
    const first = await getDestinations({ page: 1, limit: 100 });
    items = [...first.items];
    for (let page = 2; page <= first.totalPages; page++) {
      const response = await getDestinations({ page, limit: 100 });
      items.push(...response.items);
    }
    if (items.length < first.total) throw new Error("Danh sách điểm đến chưa đầy đủ.");
  } catch {
    // Rankings includes every active destination, including entries with zero votes.
    const rankings = await getRankings();
    if (rankings.items.length < rankings.totalDestinations) throw new Error("Dữ liệu sitemap dự phòng chưa đầy đủ.");
    items = rankings.items;
  }
  const unique = new Map<string, DestinationSummary>();
  for (const item of items) {
    if (typeof item.slug !== "string" || !item.slug.trim()) throw new Error("Điểm đến thiếu slug chuẩn.");
    unique.set(item.slug, item);
  }
  // This campaign has 35 destinations. Shard before growing beyond one sitemap.
  if (unique.size > 49_999) throw new Error("Cần generateSitemaps() để chia sitemap vượt 50.000 URL.");
  return [...unique.values()];
}
