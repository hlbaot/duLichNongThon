"use client";

import React from "react";
import Image from "next/image";
import { useVoting } from "@/context/voting-context";
import { Mail, Phone, MapPin, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  const { setRulesModalOpen, setLeaderboardModalOpen } = useVoting();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -70 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="campaign-footer bg-[#047857] text-white pt-16 pb-12 border-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Logo & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 drop-shadow-md">
                <Image
                  src="/logo.png"
                  alt="Logo Hội thi Điểm đến du lịch nông thôn Việt Nam tốt nhất"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="block font-black text-base sm:text-lg text-white tracking-tight leading-snug">
                  Hội Thi Điểm Đến Du Lịch Nông Thôn
                </span>
                <span className="block text-xs text-[#A7F3D0] font-bold">
                  Tốt Nhất Việt Nam Năm 2026
                </span>
              </div>
            </div>

            <p className="text-sm text-white/85 leading-relaxed max-w-sm font-medium">
              Bộ Nông nghiệp và Môi trường chủ trì, tôn vinh các điểm đến du lịch nông nghiệp, sinh thái và văn hóa truyền thống tiêu biểu; thúc đẩy phát triển nông thôn bền vững.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#A7F3D0] font-semibold">
              <ShieldCheck className="h-4 w-4 text-[#86EFAC]" />
              <span>Thời gian bình chọn: 00h00 07/11/2026 – 23h59 20/11/2026</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-[#A7F3D0] uppercase tracking-wider">
              Khám phá hội thi
            </h4>
            <ul className="space-y-2 text-sm text-white/85 font-medium">
              <li>
                <button
                  onClick={() => scrollTo("hero")}
                  className="hover:text-[#A7F3D0] transition-colors cursor-pointer"
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("destinations")}
                  className="hover:text-[#A7F3D0] transition-colors cursor-pointer"
                >
                  Danh sách 35 điểm đến
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLeaderboardModalOpen(true)}
                  className="hover:text-[#A7F3D0] transition-colors cursor-pointer"
                >
                  Bảng xếp hạng trực tuyến
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRulesModalOpen(true)}
                  className="hover:text-[#A7F3D0] transition-colors cursor-pointer"
                >
                  Thể lệ &amp; Giải thưởng
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Organizing Committee */}
          <div className="md:col-span-4 space-y-3">
            <div>
              <span className="block text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
                BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG
              </span>
              <h4 className="font-black text-sm text-white uppercase tracking-wide mt-0.5">
                BAN TỔ CHỨC HỘI THI &quot;ĐIỂM ĐẾN DU LỊCH NÔNG THÔN VIỆT NAM TỐT NHẤT&quot; NĂM 2026
              </h4>
            </div>
            <ul className="space-y-3 text-sm text-white/85 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#86EFAC] shrink-0 mt-0.5" />
                <span>Số 02 Ngọc Hà, Ba Đình, TP. Hà Nội</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#86EFAC] shrink-0" />
                <span>Hotline: 1900 6868 (8:00 - 18:00 hàng ngày)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#86EFAC] shrink-0" />
                <span>Email: bantochuc@dulichnongthon.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright band */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>© 2026 Ban Tổ chức Hội thi “Điểm đến du lịch nông thôn Việt Nam tốt nhất” năm 2026 · Bộ Nông nghiệp và Môi trường. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-1.5 text-white/90 font-medium">
            <span>Chung tay vì nông thôn xanh</span>
            <Heart className="h-3.5 w-3.5 text-[#FEF08A] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
