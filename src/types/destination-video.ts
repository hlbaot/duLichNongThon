export interface DestinationVideoProps {
  src: string;
  title: string;
  poster?: string;
  mode?: "preview" | "controls";
  autoPlay?: boolean;
  muted?: boolean;
}

export interface VimeoEmbedOptions {
  preview?: boolean;
}
