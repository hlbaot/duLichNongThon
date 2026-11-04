import axios from "axios";
import type { ApiErrorResponse } from "@/types/api/common";

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
  }
  return error instanceof Error ? error.message : "Không thể kết nối máy chủ. Vui lòng thử lại.";
}
