export interface DestinationVideoProps {
  src: string;
  title: string;
  poster?: string;
  mode?: "preview" | "controls";
}

export interface VimeoEmbedOptions {
  preview?: boolean;
}
