"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sprout } from "lucide-react";
import type { DestinationImageProps } from "@/types/destination-image";

const OPTIMIZED_DOMAINS = ["images.unsplash.com", "res.cloudinary.com", "i.vimeocdn.com"];

function isUnoptimizedDomain(src: string): boolean {
  try {
    const url = new URL(src);
    return !OPTIMIZED_DOMAINS.includes(url.hostname);
  } catch {
    return false;
  }
}

export function DestinationImage({
  src,
  alt,
  sizes,
  className = "",
  region = "bac",
  priority = false,
}: DestinationImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  if (src && failedSource !== src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        className={className}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        unoptimized={isUnoptimizedDomain(src)}
        onError={() => setFailedSource(src)}
      />
    );
  }

  return (
    <div
      className={`destination-image-fallback ${className}`}
      data-region={region}
      role="img"
      aria-label={`${alt} — đang cập nhật hình ảnh`}
    >
      <span>
        <Sprout size={42} strokeWidth={1.1} />
        <span>{alt}</span>
        <small>Đang cập nhật hình ảnh</small>
      </span>
    </div>
  );
}
