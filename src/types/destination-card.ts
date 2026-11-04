import type { Destination } from "./voting-destination";

export interface DestinationCardProps {
  destination: Destination;
  rank: number;
  index?: number;
}
