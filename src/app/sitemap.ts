import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { connection } from "next/server";
import { SITE_URL, destinationUrl, publicImageUrl } from "@/lib/site";
import { loadSitemapDestinations } from "@/lib/sitemap-destinations";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A temporary outage on Render should not block frontend deploys.
  await connection();
  return getSitemap();
}

async function getSitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("hours");

  // If both APIs fail, throw instead of publishing a misleading homepage-only sitemap.
  const destinations = await loadSitemapDestinations();
  return [
    { url: `${SITE_URL}/` },
    ...destinations.map(destination => {
      const image = publicImageUrl(destination.thumbnailUrl);
      return {
        url: destinationUrl(destination.slug),
        ...(image ? { images: [image] } : {}),
      };
    }),
  ];
}
