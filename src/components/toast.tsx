"use client";

import { ToastContainer } from "react-toastify";

export function Toast({ containerId }: { containerId?: string }) {
  return <ToastContainer containerId={containerId} position="top-right" autoClose={5000} limit={3} />;
}
