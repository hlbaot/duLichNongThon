"use client";
import type { SortOption } from "@/types/destination-grid";

import React, { useState, useMemo } from "react";
import { useVoting } from "@/context/voting-context";
import { DestinationCard } from "./destination-card";
import { Search, Compass, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react";


const ITEMS_PER_PAGE = 8;
const VISIBLE_PAGE_COUNT = 3;

export function DestinationGrid() {
  const { destinations } = useVoting();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState<SortOption>("votes-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Filter & sort (Chỉ lọc qua tìm kiếm theo tên, tỉnh thành, mã dự thi DLNT... và sắp xếp)
  const filteredDestinations = useMemo(() => {
    let result = [...destinations];

    // Filter purely by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.province.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          (d.recordCode && d.recordCode.toLowerCase().includes(q)) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "votes-desc") {
        return a.rank - b.rank;
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name, "vi");
      }
      if (sortBy === "code-asc") {
        return a.code.localeCompare(b.code);
      }
      return 0;
    });

    return result;
  }, [destinations, searchQuery, sortBy]);

  // Overall ranks mapping based on all destinations sorted by votes
  const rankMap = useMemo(() => {
    const map = new Map<string, number>();
    destinations.forEach((d, index) => {
      map.set(d.id, index + 1);
    });
    return map;
  }, [destinations]);

  // Pagination calculation
  const totalItems = filteredDestinations.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const firstVisiblePage = Math.max(1, Math.min(safeCurrentPage - 1, totalPages - VISIBLE_PAGE_COUNT + 1));
  const visiblePageCount = Math.min(totalPages, VISIBLE_PAGE_COUNT);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = filteredDestinations.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!destinations.length) return null;

  return (
    <section id="destinations" className="destinations-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header (Tối đa 2 tầng text gọn gàng, không lộn xộn) */}
        <div className="destination-heading space-y-2.5" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F6B45]/10 text-[#1F6B45] text-xs font-semibold">
            <Compass className="h-3.5 w-3.5" />
            <span>Danh sách đề cử chính thức</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1B2B22] tracking-tight">
            Tìm một miền quê để thương.
          </h2>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="destination-filters w-full max-w-xl bg-[#F4FAF6] rounded-3xl p-3 sm:p-4 border border-[#026E4E]/12 shadow-xs">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4B6354]" />
            <input
              type="text"
              aria-label="Tìm kiếm điểm đến, mã số dự thi hoặc tỉnh thành"
              placeholder="Tìm theo tên, mã số hoặc tỉnh thành…"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl sm:rounded-full bg-white border border-[#026E4E]/20 text-sm font-medium text-[#0E382B] placeholder:text-[#4B6354]/60 focus:outline-none focus:ring-2 focus:ring-[#026E4E] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-neutral-100 text-[#4B6354] cursor-pointer"
                title="Xóa tìm kiếm"
                aria-label="Xóa tìm kiếm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {totalItems > 0 ? (
          <div className="space-y-10">
            <div
              key={`${searchQuery}-${sortBy}-${safeCurrentPage}`}
              className="destination-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {currentItems.map((dest, idx) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  rank={rankMap.get(dest.id) || 1}
                  index={idx}
                />
              ))}
            </div>

            {/* Phân trang (Pagination Controls) - Thiết kế squircle chuẩn mẫu hình ảnh */}
            <div className="pt-8 border-t border-[#026E4E]/12 flex flex-col items-center justify-center gap-4">
              {/* Dải điều khiển chuyển trang squircle bo tròn như ảnh mẫu */}
              <div className="destination-pagination destination-pagination-wrap inline-flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-[#E6F1E8] border border-[#026E4E]/10 shadow-xs max-w-full overflow-x-auto">
                {/* Về trang đầu « */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={safeCurrentPage === 1}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl bg-white text-[#0E382B] hover:bg-emerald-50 hover:text-[#026E4E] disabled:opacity-35 disabled:pointer-events-none transition-all duration-200 shadow-2xs hover:shadow-xs flex items-center justify-center cursor-pointer shrink-0"
                  aria-label="Về trang đầu"
                  title="Trang đầu"
                  data-pagination-edge
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>

                {/* Trang trước < Trước */}
                <button
                  aria-label="Trang trước"
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-white text-xs sm:text-sm font-bold text-[#0E382B] hover:bg-emerald-50 hover:text-[#026E4E] disabled:opacity-35 disabled:pointer-events-none transition-all duration-200 shadow-2xs hover:shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Trước</span>
                </button>

                {/* Các nút số trang 1, 2, 3... */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {Array.from({ length: visiblePageCount }, (_, i) => firstVisiblePage + i).map((pageNum) => {
                    const isActive = pageNum === safeCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        aria-current={isActive ? "page" : undefined}
                        aria-label={`Trang ${pageNum}`}
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center cursor-pointer shrink-0 ${
                          isActive
                            ? "bg-[#2C6A45] text-white shadow-md shadow-[#2C6A45]/30 scale-102 font-black"
                            : "bg-white hover:bg-emerald-50 text-[#0E382B] hover:text-[#026E4E] shadow-2xs hover:shadow-xs"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Trang sau Sau > */}
                <button
                  aria-label="Trang sau"
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-white text-xs sm:text-sm font-bold text-[#0E382B] hover:bg-emerald-50 hover:text-[#026E4E] disabled:opacity-35 disabled:pointer-events-none transition-all duration-200 shadow-2xs hover:shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Sau</span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Đến trang cuối » */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={safeCurrentPage === totalPages}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl bg-white text-[#0E382B] hover:bg-emerald-50 hover:text-[#026E4E] disabled:opacity-35 disabled:pointer-events-none transition-all duration-200 shadow-2xs hover:shadow-xs flex items-center justify-center cursor-pointer shrink-0"
                  aria-label="Đến trang cuối"
                  title="Trang cuối"
                  data-pagination-edge
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>

              {/* Thông tin số lượng hiển thị (Gọn gàng 1 dòng duy nhất) */}
              <p className="text-xs sm:text-sm text-[#4B6354] font-medium text-center">
                Hiển thị <span className="text-[#026E4E] font-bold">{startIndex + 1} - {endIndex}</span> trong tổng số <span className="text-[#026E4E] font-bold">{totalItems}</span> điểm đến
              </p>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#1F6B45]/15 space-y-3">
            <p className="text-base font-bold text-[#1B2B22]">
              Không tìm thấy điểm đến phù hợp với từ khóa &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
              }}
              className="text-xs font-bold text-[#1F6B45] hover:underline cursor-pointer"
            >
              Xóa bộ lọc tìm kiếm
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
