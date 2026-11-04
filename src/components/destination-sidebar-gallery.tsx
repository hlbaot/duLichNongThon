"use client";

import { useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { DestinationImage } from "./destination-image";
import type { DestinationMedia } from "@/types/api/destinations";

interface DestinationSidebarGalleryProps {
  mediaList: DestinationMedia[];
  destinationTitle: string;
}

export function DestinationSidebarGallery({
  mediaList,
  destinationTitle,
}: DestinationSidebarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (!mediaList || mediaList.length === 0) return null;

  const activeMedia = mediaList[activeIndex] || mediaList[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div className="profile-sidebar-gallery">
        {/* Header */}
        <div className="profile-sidebar-gallery-header">
          <div className="flex items-center gap-2">
            <div className="profile-sidebar-gallery-icon">
              <Camera size={14} className="text-emerald-700" />
            </div>
            <h3 className="profile-sidebar-gallery-title">HÌNH ẢNH ĐIỂM ĐẾN</h3>
          </div>
          <span className="profile-sidebar-gallery-count">
            {activeIndex + 1}/{mediaList.length}
          </span>
        </div>

        {/* Main active image preview */}
        <div
          className="profile-sidebar-gallery-main group cursor-pointer"
          onClick={() => setFullscreenOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Xem ảnh phóng to"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setFullscreenOpen(true);
          }}
        >
          <DestinationImage
            src={activeMedia.mediaUrl}
            alt={activeMedia.caption ?? `${destinationTitle} - Ảnh ${activeIndex + 1}`}
            sizes="(max-width: 1023px) 100vw, 360px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="profile-sidebar-gallery-overlay">
            <span className="profile-sidebar-gallery-zoom-btn">
              <Eye size={14} />
              <span>Phóng to</span>
            </span>
          </div>

          {/* Navigation arrows if multiple images */}
          {mediaList.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="profile-sidebar-gallery-arrow-btn left-2.5"
                aria-label="Ảnh trước"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="profile-sidebar-gallery-arrow-btn right-2.5"
                aria-label="Ảnh sau"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Caption */}
        {activeMedia.caption && (
          <p className="profile-sidebar-gallery-caption">
            {activeMedia.caption}
          </p>
        )}

        {/* Thumbnails grid if multiple images */}
        {mediaList.length > 1 && (
          <div className="profile-sidebar-gallery-thumbs">
            {mediaList.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  type="button"
                  key={item.id || idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`profile-sidebar-gallery-thumb-item ${
                    isSelected ? "is-active" : ""
                  }`}
                  aria-label={`Chọn ảnh ${idx + 1}`}
                >
                  <DestinationImage
                    src={item.mediaUrl}
                    alt={item.caption ?? `Thumbnail ${idx + 1}`}
                    sizes="60px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {fullscreenOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setFullscreenOpen(false)}
        >
          <button
            type="button"
            onClick={() => setFullscreenOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={22} />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full max-h-[75vh] overflow-hidden rounded-2xl bg-black">
              <DestinationImage
                src={activeMedia.mediaUrl}
                alt={activeMedia.caption ?? destinationTitle}
                sizes="1200px"
                className="object-contain"
                priority
              />
            </div>

            {activeMedia.caption && (
              <p className="mt-4 text-center text-sm font-medium text-white/90 max-w-xl">
                {activeMedia.caption}
              </p>
            )}

            {mediaList.length > 1 && (
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-full bg-white/15 text-white hover:bg-white/25 text-sm font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>Trước</span>
                </button>
                <span className="text-white/70 text-xs font-semibold tabular-nums">
                  {activeIndex + 1} / {mediaList.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 rounded-full bg-white/15 text-white hover:bg-white/25 text-sm font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Sau</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
