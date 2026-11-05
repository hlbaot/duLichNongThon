import { https } from "./https";
import type {
  GetDestinationRequest,
  GetDestinationResponse,
  GetDestinationsRequest,
  GetDestinationsResponse,
} from "@/types/api/destinations";

export async function getDestinations(
  { page, limit, keyword }: GetDestinationsRequest = {},
  signal?: AbortSignal,
): Promise<GetDestinationsResponse> {
  const { data } = await https.get<GetDestinationsResponse | null | "">("/destinations", {
    params: { page, limit, keyword },
    signal,
  });
  return data || { items: [], total: 0, page: page ?? 1, limit: limit ?? 12, totalPages: 0 };
}

export async function getDestination({ slug }: GetDestinationRequest): Promise<GetDestinationResponse> {
  const { data } = await https.get<GetDestinationResponse>(`/destinations/${encodeURIComponent(slug)}`);
  return data;
}
