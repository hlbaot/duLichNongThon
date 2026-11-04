import type { UUID } from "./common";

export interface DestinationSummary {
  id: UUID;
  title: string;
  slug: string;
  brief: string;
  province: string | null;
  thumbnailUrl: string | null;
  displayOrder: number;
}

export interface GetDestinationsRequest {
  /** Integer from 1 to 100000; defaults to 1. */
  page?: number;
  /** Integer from 1 to 100; defaults to 12. */
  limit?: number;
  /** Trimmed by the backend; at most 100 characters. */
  keyword?: string;
}

export interface GetDestinationsResponse {
  items: DestinationSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DestinationMedia {
  id: UUID;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  caption: string | null;
  displayOrder: number;
}

export interface GetDestinationRequest {
  /** The detail endpoint takes a slug, not a UUID. */
  slug: string;
}

export interface GetDestinationResponse extends DestinationSummary {
  detail: string;
  media: DestinationMedia[];
}
