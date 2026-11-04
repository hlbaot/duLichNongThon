import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common";

export default function NotFoundView() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center py-16">
      <h1 className="text-6xl font-bold text-emerald-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Không tìm thấy trang</h2>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-6">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link href="/">
        <Button>Về trang chủ</Button>
      </Link>
    </Container>
  );
}
