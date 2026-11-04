import type { PageProps } from "@/types/destination-route";
import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import axios from "axios";
import { getDestination } from "@/api/destinations";
import { DestinationVideo } from "@/components/destination-video";
import { DestinationImage } from "@/components/destination-image";
import { DestinationDetailClient } from "@/components/destination-detail-client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";

const loadDestination = cache(async (slug: string) => {
  try {
    return await getDestination({ slug });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: slug } = await params;
  const destination = await loadDestination(slug);
  return {
    title: `${destination.title} | Hội thi Du lịch Nông thôn 2026`,
    description: destination.brief,
  };
}

async function DestinationContent({ params }: PageProps) {
  const { id: slug } = await params;
  const destination = await loadDestination(slug);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FDFEFC] text-[#1B2B22]">
      <Navbar />

      <main className="mx-auto flex-1 w-full max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
        {/* Client-side actions: Breadcrumb, Live Voting stats & button, markdown formatting */}
        <DestinationDetailClient destination={destination} />

        {/* Media gallery: Video Vimeo & Photos */}
        {destination.media.length > 0 && (
          <section aria-label="Hình ảnh và video bài dự thi" className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#0E382B]">
              Video &amp; Hình ảnh bài dự thi
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {destination.media.map((media) => (
                <figure
                  key={media.id}
                  className="space-y-2 rounded-2xl bg-white p-3 border border-[#026E4E]/12 shadow-xs"
                >
                  {media.mediaType === "IMAGE" ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                      <DestinationImage
                        src={media.mediaUrl}
                        alt={media.caption ?? destination.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                      <DestinationVideo
                        src={media.mediaUrl}
                        title={media.caption ?? destination.title}
                        poster={destination.thumbnailUrl ?? undefined}
                      />
                    </div>
                  )}
                  {media.caption && (
                    <figcaption className="text-xs sm:text-sm font-medium text-[#4B6354] px-1">
                      {media.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <BackToTop />
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
