"use client";

import { useEffect, useState } from "react";
import { getDestination } from "@/api/destinations";

// Only visible cards request detail media; reuse requests across pagination/remounts.
const requests = new Map<string, { expiresAt: number; promise: Promise<string | null> }>();
function loadVideo(slug: string): Promise<string | null> {
  const cached = requests.get(slug);
  if (cached && cached.expiresAt > Date.now()) return cached.promise;
  const promise = getDestination({ slug })
    .then(detail => detail.media.find(media => media.mediaType === "VIDEO")?.mediaUrl ?? null)
    .catch(error => { requests.delete(slug); throw error; });
  requests.set(slug, { expiresAt: Date.now() + 60_000, promise });
  return promise;
}

export function useDestinationVideo(slug: string): string | null {
  const [result, setResult] = useState<{ slug: string; url: string | null } | null>(null);
  useEffect(() => {
    let active = true;
    void loadVideo(slug).then(url => {
      if (active) setResult({ slug, url });
    }).catch(() => {
      if (active) setResult({ slug, url: null });
    });
    return () => { active = false; };
  }, [slug]);
  return result?.slug === slug ? result.url : null;
}
