import { https } from "./https";

export async function checkBackendHealth(): Promise<string> {
  const { data } = await https.get<string>("/", {
    responseType: "text",
  });
  return typeof data === "string" ? data : String(data);
}
