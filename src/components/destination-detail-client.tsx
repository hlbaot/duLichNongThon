"use client";

import { useMemo, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import { useVoting } from "@/context/voting-context";
import { useVotingStore } from "@/stores/use-voting-store";
import { parseDestinationProfile } from "@/lib/destination-profile";
import { DestinationImage } from "./destination-image";
import { DestinationDetailMedia } from "./destination-detail-media";
import { DestinationDetailSections } from "./destination-detail-sections";
import { DestinationDetailVote } from "./destination-detail-vote";
import { DestinationSidebarGallery } from "./destination-sidebar-gallery";
import { DestinationDetailProgress } from "./destination-detail-progress";
import { DestinationDetailNavigation } from "./destination-detail-navigation";
import { ProfileInline } from "./destination-profile-text";
import { RevealOnScroll } from "./reveal-on-scroll";
import { Container } from "./common";
import { AnimationProvider } from "./animation-provider";
import type { GetDestinationResponse } from "@/types/api/destinations";
import type { Destination } from "@/types/voting-destination";

interface DestinationDetailClientProps {
  destination: GetDestinationResponse & { accentColor?: string };
}

export function DestinationDetailClient({ destination }: DestinationDetailClientProps) {
  const { destinations } = useVoting();
  const ranking = useVotingStore(state => state.ranking);
  const profile = useMemo(() => parseDestinationProfile(destination.detail), [destination.detail]);
  const rankedItem = ranking.find(item => item.id === destination.id);
  const voteDestination: Destination = {
    id: destination.id, slug: destination.slug, code: destination.contestCode ?? "",
    contestCode: destination.contestCode ?? null, shortTitle: destination.shortTitle ?? destination.title,
    name: destination.title, province: destination.province ?? "", brief: destination.brief,
    votes: rankedItem?.votes ?? 0, rank: rankedItem?.rank ?? 999,
    displayOrder: destination.displayOrder, imageUrl: destination.thumbnailUrl ?? "", regionLabel: "", tags: [],
  };
  const featuredVideo = destination.media.find(item => item.mediaType === "VIDEO");
  
  // Tổng hợp toàn bộ ảnh (từ mediaType === "IMAGE" hoặc thumbnailUrl)
  const images = useMemo(() => {
    const list = destination.media.filter(item => item.mediaType === "IMAGE");
    if (list.length === 0 && destination.thumbnailUrl) {
      list.push({
        id: "thumb-" + destination.id,
        mediaType: "IMAGE",
        mediaUrl: destination.thumbnailUrl,
        caption: destination.title,
        displayOrder: 0,
      });
    }
    return list;
  }, [destination]);

  // Video bổ sung khác (nếu có ngoài video chính)
  const additionalVideos = useMemo(() => {
    return destination.media.filter(item => item.mediaType === "VIDEO" && item.id !== featuredVideo?.id);
  }, [destination, featuredVideo]);

  
  // BE thường lặp brief trong chính hồ sơ; chỉ hiện một lần để không bị trùng.
  const briefRepeated = profile.sections.some(section => section.content.trim() === destination.brief.trim());
  const accentStyle = destination.accentColor && /^#[\da-f]{3,8}$/i.test(destination.accentColor)
    ? { "--accent": destination.accentColor } as CSSProperties : undefined;
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: destination.title, text: destination.brief, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); toast.success("Đã sao chép liên kết vào bộ nhớ tạm!"); }
    } catch { /* Share sheet was dismissed. */ }
  };

  return <div className="profile-content" style={accentStyle}>
    <AnimationProvider />
    <DestinationDetailProgress />
    <Container className="profile-container">
      <div className="profile-toolbar">
        <Link href="/#destinations"><ArrowLeft size={16} />Danh sách điểm đến</Link>
        <button type="button" onClick={() => void share()}><Share2 size={14} />Chia sẻ hồ sơ</button>
      </div>
      {featuredVideo ? <figure className="profile-hero-media">
        <DestinationDetailMedia src={featuredVideo.mediaUrl} title={featuredVideo.caption ?? destination.title} poster={destination.thumbnailUrl} priority autoPlay />
        {featuredVideo.caption && <figcaption>{featuredVideo.caption}</figcaption>}
      </figure> : destination.thumbnailUrl ? <div className="profile-hero-cover"><DestinationImage src={destination.thumbnailUrl} alt={destination.title} sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" priority /></div> : null}

      <RevealOnScroll className="profile-hero-heading">
        {destination.province && <span className="profile-province"><MapPin size={13} />{destination.province}</span>}
        <h1 className={destination.title.length > 115 ? "profile-title profile-title-long" : "profile-title"}>{destination.title}</h1>
        {(profile.code || profile.address) && <div className="profile-meta">{profile.code && <span>{profile.codeLabel}: {profile.code}</span>}{profile.code && profile.address && <span aria-hidden="true">·</span>}{profile.address && <span>{profile.addressLabel}: {profile.address}</span>}</div>}
        {destination.brief && !briefRepeated && <p className="profile-introduction"><ProfileInline text={destination.brief} /></p>}
      </RevealOnScroll>

      <div className="profile-body-layout">
        <div className="profile-main-column">
          {profile.heading && <h2 className="profile-body-heading">{profile.heading}</h2>}
          <DestinationDetailSections sections={profile.sections} />
          
          {/* Trên màn hình nhỏ (mobile), hiển thị thư viện ảnh ngay bên dưới bài đọc */}
          {images.length > 0 && (
            <div className="block lg:hidden mt-6">
              <DestinationSidebarGallery mediaList={images} destinationTitle={destination.title} />
            </div>
          )}

          {/* Video dự thi phụ (nếu có) */}
          {additionalVideos.length > 0 && <RevealOnScroll className="profile-gallery">
            <h2>Video bài dự thi bổ sung</h2>
            <div className="grid gap-4">{additionalVideos.map(media => <figure key={media.id}>
              <DestinationDetailMedia src={media.mediaUrl} title={media.caption ?? destination.title} poster={destination.thumbnailUrl} />
              {media.caption && <figcaption>{media.caption}</figcaption>}
            </figure>)}</div>
          </RevealOnScroll>}
        </div>

        {/* Cột bên phải: Thẻ bình chọn + Thư viện hình ảnh nằm ngay bên cạnh nội dung */}
        <aside className="profile-aside-column" aria-label="Bình chọn và hình ảnh điểm đến">
          <DestinationDetailVote rankingAvailable={!!rankedItem} destination={voteDestination} />

          {/* Ảnh đặt bên phải, không để ở cuối cùng */}
          {images.length > 0 && (
            <div className="hidden lg:block">
              <DestinationSidebarGallery mediaList={images} destinationTitle={destination.title} />
            </div>
          )}
        </aside>
      </div>
      <DestinationDetailNavigation destinations={destinations} currentId={destination.id} />
    </Container>
    <div className="profile-vote-mobile"><DestinationDetailVote rankingAvailable={!!rankedItem} destination={voteDestination} compact /></div>
  </div>;
}
