/** UUIDs and ISO 8601 timestamps are serialized as strings by the backend. */
export type UUID = string;
export type ISODateTime = string;

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: ISODateTime;
  requestId: string;
}
