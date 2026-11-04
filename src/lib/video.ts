import type { VimeoEmbedOptions } from "@/types/destination-video";

/** Convert Vimeo links, preserving the privacy hash of unlisted videos. */
export function getVimeoEmbedUrl(source: string, { preview = false }: VimeoEmbedOptions = {}): string | null {
  let url: URL;
  try { url = new URL(source); } catch { return null; }
  if (!["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname)) return null;
  const match = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/);
  if (!match) return null;
  const embed = new URL(`https://player.vimeo.com/video/${match[1]}`);
  const hash = url.searchParams.get("h") ?? match[2];
  if (hash) embed.searchParams.set("h", hash);
  for (const [key, value] of Object.entries({ autoplay: preview ? "1" : "0", loop: "1", muted: "1", playsinline: "1", title: "0", byline: "0", portrait: "0", dnt: "1" })) {
    embed.searchParams.set(key, value);
  }
  if (preview) {
    embed.searchParams.set("background", "1");
    embed.searchParams.set("controls", "0");
    embed.searchParams.set("autopause", "0");
    embed.searchParams.set("keyboard", "0");
    embed.searchParams.set("preload", "auto");
    embed.searchParams.set("api", "1");
  }
  return embed.toString();
}

/** Convert YouTube links to embed format. */
export function getYouTubeEmbedUrl(source: string, { preview = false }: VimeoEmbedOptions = {}): string | null {
  let url: URL;
  try { url = new URL(source); } catch { return null; }
  if (!["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(url.hostname)) return null;

  let videoId: string | null = null;
  if (url.hostname === "youtu.be") {
    videoId = url.pathname.slice(1);
  } else if (url.pathname.startsWith("/embed/")) {
    videoId = url.pathname.split("/")[2] ?? null;
  } else {
    videoId = url.searchParams.get("v");
  }

  if (!videoId) return null;

  const embed = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  if (preview) {
    embed.searchParams.set("autoplay", "1");
    embed.searchParams.set("mute", "1");
    embed.searchParams.set("controls", "0");
    embed.searchParams.set("loop", "1");
    embed.searchParams.set("playlist", videoId);
    embed.searchParams.set("playsinline", "1");
    embed.searchParams.set("disablekb", "1");
    embed.searchParams.set("fs", "0");
    embed.searchParams.set("modestbranding", "1");
    embed.searchParams.set("rel", "0");
    embed.searchParams.set("iv_load_policy", "3");
    embed.searchParams.set("enablejsapi", "1");
  } else {
    embed.searchParams.set("autoplay", "0");
    embed.searchParams.set("playsinline", "1");
    embed.searchParams.set("rel", "0");
  }
  return embed.toString();
}

/** Get embed URL if source is Vimeo or YouTube */
export function getVideoEmbed(source: string, options?: VimeoEmbedOptions): { type: "vimeo" | "youtube"; url: string } | null {
  const vimeoUrl = getVimeoEmbedUrl(source, options);
  if (vimeoUrl) return { type: "vimeo", url: vimeoUrl };
  const ytUrl = getYouTubeEmbedUrl(source, options);
  if (ytUrl) return { type: "youtube", url: ytUrl };
  return null;
}

