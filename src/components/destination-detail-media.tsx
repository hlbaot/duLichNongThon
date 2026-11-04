"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { VimeoPlayer } from "./vimeo-player";
import { DestinationVideo } from "./destination-video";
import { DestinationImage } from "./destination-image";
import { getVideoEmbed } from "@/lib/video";

export function DestinationDetailMedia({ src, poster, title, priority = false, autoPlay = false }: { src: string; poster?: string | null; title: string; priority?: boolean; autoPlay?: boolean }) {
  const [started, setStarted] = useState(autoPlay);
  if (getVideoEmbed(src)?.type === "vimeo") return <VimeoPlayer src={src} title={title} poster={poster} priority={priority} autoPlay={autoPlay} />;
  return <div className="profile-media-frame">
    {started ? <DestinationVideo autoPlay muted={autoPlay} src={src} title={title} poster={poster ?? undefined} /> : <button type="button" className="profile-media-poster" onClick={() => setStarted(true)} aria-label={`Phát video: ${title}`}>
      {poster && <DestinationImage src={poster} alt={title} priority={priority} />}
      <span className="profile-media-play"><Play size={30} fill="currentColor" /></span>
    </button>}
  </div>;
}
