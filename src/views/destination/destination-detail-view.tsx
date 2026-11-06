import type { PageProps } from "@/types/destination-route";
import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { getDestination } from "@/api/destinations";
import { getRankings } from "@/api/rankings";
import type { GetDestinationResponse } from "@/types/api/destinations";
import type { RankedDestination } from "@/types/api/rankings";
import { DestinationDetailClient } from "@/components/destination-detail-client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Playfair_Display } from "next/font/google";
import { destinationUrl, publicImageUrl } from "@/lib/site";

const editorial = Playfair_Display({ subsets: ["latin", "vietnamese"], display: "swap", variable: "--font-profile-serif" });

/** Chỉ hiển thị dữ liệu thật do BE trả về; không dựng dữ liệu thay thế. */
const loadDestination = cache(async (rawParam: string): Promise<GetDestinationResponse> => {
  const decoded = decodeURIComponent(rawParam).trim();

  try {
    return await getDestination({ slug: decoded });
  } catch {
    // Thử tra cứu slug thật theo id (UUID) trong bảng xếp hạng.
  }

  try {
    const rankings = await getRankings();
    const matched = rankings.items?.find(
      (item: RankedDestination) => item.id.toLowerCase() === decoded.toLowerCase(),
    );
    if (matched) return await getDestination({ slug: matched.slug });
  } catch {
    // Không có dữ liệu từ BE.
  }

  notFound();
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: slug } = await params;
  try {
    const destination = await loadDestination(slug);
    const canonical = destinationUrl(destination.slug);
    const image = publicImageUrl(destination.thumbnailUrl);
    const images = image ? [{ url: image, alt: destination.title }] : [];
    return {
      title: destination.title,
      description: destination.brief,
      alternates: { canonical },
      openGraph: {
        type: "article",
        locale: "vi_VN",
        siteName: "Hội thi Du lịch Nông thôn 2026",
        title: destination.title,
        description: destination.brief,
        url: canonical,
        images,
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title: destination.title,
        description: destination.brief,
        images: image ? [image] : [],
      },
    };
  } catch {
    return {
      title: "Chi tiết điểm đến",
      robots: { index: false, follow: false },
    };
  }
}

async function DestinationContent({ params }: PageProps) {
  const { id: slug } = await params;
  const destination = await loadDestination(slug);

  return (
    <div className={`destination-detail-page ${editorial.variable}`}>
      <Navbar />

      <main className="profile-page-main">
        <DestinationDetailClient destination={destination} />
      </main>

      <Footer />
    </div>
  );
}

export default function DestinationDetailView(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 text-[#026E4E] font-bold">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#026E4E] border-t-transparent" />
            <span>Đang tải thông tin điểm đến…</span>
          </div>
        </div>
      }
    >
      <DestinationContent {...props} />
    </Suspense>
  );
}
