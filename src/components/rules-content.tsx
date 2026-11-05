"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Award,
  ExternalLink,
  Heart,
  HelpCircle,
  Mail,
  ShieldAlert,
  ShieldCheck,
  ThumbsUp,
  Trophy,
} from "lucide-react";

function FacebookBadgeIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokBadgeIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.7a8.18 8.18 0 0 0 4.78 1.52V6.76c-.29-.02-.58-.04-.88-.07z"
        fill="#25F4EE"
        transform="translate(-0.8, -0.6)"
      />
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.7a8.18 8.18 0 0 0 4.78 1.52V6.76c-.29-.02-.58-.04-.88-.07z"
        fill="#FE2C55"
        transform="translate(0.8, 0.6)"
      />
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.7a8.18 8.18 0 0 0 4.78 1.52V6.76c-.29-.02-.58-.04-.88-.07z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/** =========================================================================
 * 1. THỂ LỆ BÌNH CHỌN TRỰC TUYẾN (4 ĐIỀU CHÍNH THỨC)
 * ========================================================================= */
export function OfficialRulesArticles({ inline = false }: { inline?: boolean }) {
  return (
    <ol className={`voting-rules-summary-list ${inline ? "" : "voting-rules-summary"}`} role="list">
      {["Đối tượng", "Thời gian bình chọn", "Cách thức bình chọn & chấm điểm", "Quy định chung"].map((label, index) => (
        <li key={label}>
          <span className="voting-rules-summary-number" aria-hidden="true">{index + 1}</span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}

/** =========================================================================
 * 2. HƯỚNG DẪN BÌNH CHỌN TRỰC TUYẾN (3 NỀN TẢNG)
 * ========================================================================= */
export function PlatformVotingGuide({ inline = false }: { inline?: boolean }) {
  const [activePlatform, setActivePlatform] = useState<"all" | "fb" | "tiktok" | "web">(inline ? "all" : "all");

  return (
    <div className="space-y-6">
      {/* Tiêu đề giới thiệu */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5">
        <span className="text-xs font-bold tracking-widest text-[#026E4E] uppercase">
          3 KÊNH TƯƠNG TÁC CHÍNH THỨC
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#0E382B]">
          Hướng Dẫn Bình Chọn Trực Tuyến
        </h3>
        <p className="text-xs sm:text-sm text-[#4B6354]">
          Mỗi lượt Like trên Fanpage Facebook, Tim trên TikTok và Bình chọn trên Landing Page đều được tính 01 điểm hợp lệ vào tổng kết quả.
        </p>
      </div>

      {/* Tabs lọc nếu không hiển thị tất cả */}
      {!inline && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActivePlatform("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activePlatform === "all"
                ? "bg-[#026E4E] text-white shadow-xs"
                : "bg-white text-[#4B6354] hover:text-[#0E382B] border border-[#026E4E]/15"
            }`}
          >
            Tất cả 03 Nền tảng
          </button>
          <button
            type="button"
            onClick={() => setActivePlatform("fb")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activePlatform === "fb"
                ? "bg-[#1877F2] text-white shadow-xs"
                : "bg-white text-[#4B6354] hover:text-[#1877F2] border border-[#1877F2]/20"
            }`}
          >
            Fanpage Facebook
          </button>
          <button
            type="button"
            onClick={() => setActivePlatform("tiktok")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activePlatform === "tiktok"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-[#4B6354] hover:text-black border border-black/15"
            }`}
          >
            Kênh TikTok
          </button>
          <button
            type="button"
            onClick={() => setActivePlatform("web")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activePlatform === "web"
                ? "bg-[#026E4E] text-white shadow-xs"
                : "bg-white text-[#4B6354] hover:text-[#026E4E] border border-[#026E4E]/15"
            }`}
          >
            Landing Page (Website)
          </button>
        </div>
      )}

      {/* Danh sách 3 Nền tảng */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* NỀN TẢNG 1: FANPAGE FACEBOOK */}
        {(activePlatform === "all" || activePlatform === "fb") && (
          <div className="flex flex-col rounded-3xl bg-white border border-[#1877F2]/20 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Header Nền tảng */}
            <div className="p-5 bg-gradient-to-br from-[#1877F2] to-[#0D5BB5] text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                  <FacebookBadgeIcon className="h-6 w-6 fill-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-blue-200 uppercase block">
                    Nền tảng 1
                  </span>
                  <h4 className="font-extrabold text-white text-base">Fanpage Facebook</h4>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 shrink-0">
                <ThumbsUp className="h-3.5 w-3.5 fill-white" /> +1 Điểm / Like
              </span>
            </div>

            {/* Thân các bước */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3 text-xs sm:text-sm text-[#385243]">
                  <span className="h-6 w-6 rounded-full bg-blue-100 text-[#1877F2] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-[#0E382B]">Bước 1: Tìm kiếm & Truy cập</strong>
                    <p className="text-xs text-[#527060] mt-0.5">
                      Đăng nhập Facebook cá nhân, tìm kiếm từ khóa <strong>“Điểm đến Du lịch Nông thôn Việt Nam 2026”</strong> hoặc bấm trực tiếp vào link chính thức.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 text-xs sm:text-sm text-[#385243]">
                  <span className="h-6 w-6 rounded-full bg-blue-100 text-[#1877F2] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-[#0E382B]">Bước 2: Xem bài đăng / video</strong>
                    <p className="text-xs text-[#527060] mt-0.5">
                      Theo dõi bài đăng và video giới thiệu các điểm đến dự thi trên Trang chính thức của Ban Tổ chức.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 text-xs sm:text-sm text-[#385243]">
                  <span className="h-6 w-6 rounded-full bg-blue-100 text-[#1877F2] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-[#0E382B]">Bước 3: Ấn Like 👍 bình chọn</strong>
                    <p className="text-xs text-[#527060] mt-0.5">
                      Ấn nút <strong>Like 👍</strong> trên bài đăng điểm đến yêu thích (thao tác được tính 01 điểm).
                    </p>
                  </div>
                </div>
              </div>

              {/* Nút truy cập link chính thức */}
              <a
                href="https://www.facebook.com/profile.php?id=61595377905355"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#1464CA] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Vào Fanpage Facebook</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* NỀN TẢNG 2: TIKTOK */}
        {(activePlatform === "all" || activePlatform === "tiktok") && (
          <div className="flex flex-col rounded-3xl bg-white border border-black/15 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Header Nền tảng */}
            <div className="p-5 bg-gradient-to-br from-[#121212] to-[#252525] text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                  <TikTokBadgeIcon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-rose-300 uppercase block">
                    Nền tảng 2
                  </span>
                  <h4 className="font-extrabold text-white text-base">Kênh TikTok</h4>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/25 border border-rose-400/40 text-rose-200 text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" /> +1 Điểm / Tim
              </span>
            </div>

            {/* Thân các bước */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3 text-xs sm:text-sm text-[#385243]">
                  <span className="h-6 w-6 rounded-full bg-rose-100 text-[#E11D48] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-[#0E382B]">Bước 1: Tìm kiếm & Truy cập</strong>
                    <p className="text-xs text-[#527060] mt-0.5">
                      Đăng nhập TikTok cá nhân, tìm kiếm từ khóa <strong>“Điểm đến Du lịch Nông thôn”</strong> hoặc truy cập kênh chính thức của Hội thi.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 text-xs sm:text-sm text-[#385243]">
                  <span className="h-6 w-6 rounded-full bg-rose-100 text-[#E11D48] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-[#0E382B]">Bước 2: Xem video giới thiệu</strong>
                    <p className="text-xs text-[#527060] mt-0.5">
                      Xem các video clip giới thiệu cảnh quan, văn hóa, ẩm thực của 35 điểm đến dự thi.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 text-xs sm:text-sm text-[#385243]">
                  <span className="h-6 w-6 rounded-full bg-rose-100 text-[#E11D48] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-[#0E382B]">Bước 3: Ấn Tim ❤️ bình chọn</strong>
                    <p className="text-xs text-[#527060] mt-0.5">
                      Ấn nút <strong>Tim ❤️</strong> trên video điểm đến yêu thích (thao tác được tính 01 điểm).
                    </p>
                  </div>
                </div>
              </div>

              {/* Nút truy cập link chính thức */}
              <a
                href="https://www.tiktok.com/@diemdendulichnongthon"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Vào Kênh TikTok Hội Thi</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* NỀN TẢNG 3: LANDING PAGE */}
        {(activePlatform === "all" || activePlatform === "web") && (
          <div className="flex flex-col rounded-3xl bg-white border border-[#026E4E]/25 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Header Nền tảng */}
            <div className="p-5 bg-gradient-to-br from-[#026E4E] to-[#0B3B2B] text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-white p-1 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Logo Du lịch Nông thôn"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#A7F3D0] uppercase block">
                    Nền tảng 3
                  </span>
                  <h4 className="font-extrabold text-white text-base">Cổng Landing Page</h4>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#A7F3D0]/20 border border-[#A7F3D0]/30 text-[#A7F3D0] text-xs font-bold flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="h-3.5 w-3.5" /> +1 Điểm / Vote OTP
              </span>
            </div>

            {/* Thân 6 bước chi tiết */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <ol className="space-y-2.5 text-xs text-[#385243]">
                <li className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 rounded-full bg-[#026E4E]/10 text-[#026E4E] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span><strong>Bước 1:</strong> Truy cập Cổng bình chọn chính thức từ link Ban Tổ chức công bố.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 rounded-full bg-[#026E4E]/10 text-[#026E4E] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span><strong>Bước 2:</strong> Vào thanh Menu trên cùng chọn mục: <strong>Điểm đến</strong> (hiển thị 35 điểm đến).</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 rounded-full bg-[#026E4E]/10 text-[#026E4E] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span><strong>Bước 3:</strong> Chọn tên điểm đến yêu thích muốn bình chọn, nhấp <strong>“BÌNH CHỌN”</strong>.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 rounded-full bg-[#026E4E]/10 text-[#026E4E] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <span><strong>Bước 4:</strong> Nhập <strong>Gmail</strong> để đăng nhập / thực hiện bình chọn.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 rounded-full bg-[#026E4E]/10 text-[#026E4E] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </span>
                  <span><strong>Bước 5:</strong> Nhận mã OTP gửi về Gmail và nhập mã để xác thực.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 rounded-full bg-[#026E4E]/10 text-[#026E4E] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    6
                  </span>
                  <span><strong>Bước 6:</strong> Kiểm tra điểm đến đã chọn và nhấn <strong>“XÁC NHẬN BÌNH CHỌN”</strong>.</span>
                </li>
              </ol>

              {/* Nút hành động trực tiếp */}
              <a
                href="#destinations"
                className="mt-3 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#026E4E] to-[#00875A] hover:from-[#01583E] hover:to-[#026E4E] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>Xem danh sách 35 điểm đến & Bình chọn</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** =========================================================================
 * 3. QUY ĐỊNH GIẢI THƯỞNG (ĐIỀU 10)
 * ========================================================================= */
export function RulesAwards({ inline = false }: { inline?: boolean }) {
  return (
    <div className="space-y-6">
      {!inline && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
          <Trophy className="h-5 w-5 text-[#026E4E] shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-sm">Cơ cấu Giải thưởng Hội thi</strong>
            <p className="mt-0.5 text-xs text-[#0E382B]/80 leading-relaxed">
              &quot;Điểm đến du lịch nông thôn&quot; được trao giải thưởng sẽ nhận giấy chứng nhận, biểu trưng và giải thưởng tiền mặt theo quy định của Ban Tổ chức:
            </p>
          </div>
        </div>
      )}

      {/* 2 Cash Prize Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#FF9F00] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-[#FF9F00] text-white text-[11px] font-extrabold uppercase">
              Hạng mục cao nhất
            </span>
            <Trophy className="h-6 w-6 text-[#FF9F00]" />
          </div>
          <div>
            <h5 className="font-black text-sm text-[#0E382B]">
              Giải thưởng &quot;Điểm đến du lịch nông thôn Việt Nam tốt nhất&quot;
            </h5>
            <div className="mt-2 text-2xl font-black text-[#D97706]">
              20.000.000 VNĐ
              <span className="text-xs font-semibold text-[#4B6354] ml-1">/ giải</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-[#026E4E] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-[#026E4E] text-white text-[11px] font-extrabold uppercase">
              Bình chọn cộng đồng
            </span>
            <Award className="h-6 w-6 text-[#026E4E]" />
          </div>
          <div>
            <h5 className="font-black text-sm text-[#0E382B]">
              Giải thưởng &quot;Điểm đến du lịch nông thôn Việt Nam được cộng đồng bình chọn&quot;
            </h5>
            <div className="mt-2 text-2xl font-black text-[#026E4E]">
              10.000.000 VNĐ
              <span className="text-xs font-semibold text-[#4B6354] ml-1">/ giải</span>
            </div>
          </div>
          <p className="text-xs text-[#4B6354]">
            Trao cho điểm đến nhận được sự yêu mến và lượt bình chọn đông đảo nhất từ cộng đồng người dân trên toàn quốc.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Tương thích ngược */
export function RulesSteps() {
  return <PlatformVotingGuide />;
}

export function RulesValidity({ inline = false }: { inline?: boolean }) {
  return <OfficialRulesArticles inline={inline} />;
}
