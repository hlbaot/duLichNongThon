"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common";

export default function ErrorView({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center py-16">
      <h2 className="text-2xl font-semibold mb-2">Đã có lỗi xảy ra!</h2>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-6">
        Hệ thống gặp sự cố trong quá trình xử lý yêu cầu của bạn.
      </p>
      <Button onClick={() => reset()}>Thử lại</Button>
    </Container>
  );
}
