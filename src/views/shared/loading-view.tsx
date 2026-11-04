import { Container } from "@/components/common";

export default function LoadingView() {
  return (
    <Container className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="text-sm text-zinc-500">Đang tải dữ liệu...</p>
      </div>
    </Container>
  );
}
