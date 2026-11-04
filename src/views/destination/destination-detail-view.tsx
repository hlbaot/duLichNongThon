import type { PageProps } from "@/types/destination-route";
import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { getDestination } from "@/api/destinations";
import { DestinationImage } from "@/components/destination-image";

const loadDestination = cache(async (slug: string) => {
  try { return await getDestination({ slug }); }
  catch (error) {
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
  return <main className="mx-auto min-h-screen max-w-5xl space-y-6 px-4 py-8 text-emerald-950">
    <Link href="/#destinations" className="font-bold underline">← Danh sách điểm đến</Link>
    <header className="space-y-3">
      <p>{destination.province}</p>
      <h1 className="text-3xl font-extrabold">{destination.title}</h1>
      <p className="text-lg">{destination.brief}</p>
    </header>
    <div className="relative aspect-video overflow-hidden rounded-2xl">
      <DestinationImage src={destination.thumbnailUrl ?? ""} alt={destination.title} priority />
    </div>
    <article className="whitespace-pre-wrap leading-relaxed">{destination.detail}</article>
    <section aria-label="Hình ảnh và video" className="grid gap-6 sm:grid-cols-2">
      {destination.media.map(media => <figure key={media.id} className="space-y-2">
        {media.mediaType === "IMAGE" ? <div className="relative aspect-video overflow-hidden rounded-xl"><DestinationImage src={media.mediaUrl} alt={media.caption ?? destination.title} /></div> :
          <video controls preload="metadata" src={media.mediaUrl} className="aspect-video w-full rounded-xl" aria-label={media.caption ?? destination.title} />}
        {media.caption && <figcaption>{media.caption}</figcaption>}
      </figure>)}
    </section>
    <Link href="/#destinations" className="vote-button">Bình chọn cho điểm đến</Link>
  </main>;
}

export default function DestinationDetailView(props: PageProps) {
  return <Suspense fallback={<p className="p-8" role="status">Đang tải điểm đến…</p>}><DestinationContent {...props} /></Suspense>;
}
