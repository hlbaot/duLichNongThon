import { bearerHeaders, https } from "./https";
import type { CreateVoteRequest, CreateVoteResponse, GetMyVotesResponse } from "@/types/api/votes";

/** Never automatically retry a vote after a timeout; inspect /votes/me first. */
export async function createVote(
  { destinationId }: CreateVoteRequest,
  accessToken: string,
): Promise<CreateVoteResponse> {
  const { data } = await https.post<CreateVoteResponse>("/votes", { destinationId }, {
    headers: bearerHeaders(accessToken),
  });
  return data;
}

export async function getMyVotes(accessToken: string): Promise<GetMyVotesResponse> {
  const { data } = await https.get<GetMyVotesResponse>("/votes/me", {
    headers: bearerHeaders(accessToken),
  });
  return data;
}
