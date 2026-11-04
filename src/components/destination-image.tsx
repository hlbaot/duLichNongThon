"use client";
import type { DestinationImageProps } from "@/types/destination-image";
import Image from "next/image";
import { useState } from "react";
import { Sprout } from "lucide-react";
export function DestinationImage({ src, alt, sizes, className = "", region = "bac", priority = false }: DestinationImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (src && failedSource !== src) return <Image unoptimized={/^https?:\/\//.test(src)} src={src} alt={alt} fill sizes={sizes ?? "(max-width: 767px) 100vw, 33vw"} className={className} priority={priority} onError={() => setFailedSource(src)} />;
  return <div className={`destination-image-fallback ${className}`} data-region={region} role="img" aria-label={`${alt} — đang cập nhật hình ảnh`}><span><Sprout size={42} strokeWidth={1.1} /><span>{alt}</span><small>Đang cập nhật hình ảnh</small></span></div>;
}
