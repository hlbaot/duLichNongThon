import { Award, CheckCircle2, ShieldAlert, ShieldCheck, Trophy } from "lucide-react";

export function RulesAwards({ inline = false }: { inline?: boolean }) {
  return (
    <div className="space-y-6">
      {!inline && (
        <>
          {/* Ban Tổ Chức Badge */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#08291D] to-[#0E382B] text-white border border-[#026E4E]/30 space-y-2 text-center">
            <span className="text-xs font-bold tracking-widest text-[#A7F3D0] uppercase">
              BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG
            </span>
            <h4 className="text-base sm:text-lg font-black tracking-tight text-white">
              BAN TỔ CHỨC HỘI THI &quot;ĐIỂM ĐẾN DU LỊCH NÔNG THÔN VIỆT NAM TỐT NHẤT&quot; NĂM 2026
            </h4>
          </div>

          {/* Title & Scope */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
            <Trophy className="h-5 w-5 text-[#026E4E] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-sm">Điều 10. Giải thưởng</strong>
              <p className="mt-0.5 text-xs text-[#0E382B]/80 leading-relaxed">
                &quot;Điểm đến du lịch nông thôn&quot; được trao giải thưởng sẽ được nhận đầy đủ quyền lợi, biểu trưng và giải thưởng tiền mặt theo quy định của Ban Tổ chức:
              </p>
            </div>
          </div>
        </>
      )}
      {inline && <p className="text-sm text-emerald-900">Điểm đến đoạt giải nhận giải thưởng tiền mặt, biểu trưng và các quyền lợi theo quy định của Ban Tổ chức.</p>}

      {/* 2 Cash Prize Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div data-aos={inline ? "fade-up" : undefined} data-aos-delay={inline ? 0 : undefined} className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#FF9F00] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-[#FF9F00] text-white text-[11px] font-extrabold uppercase">
              Hạng mục cao nhất
            </span>
            {!inline && <Trophy className="h-6 w-6 text-[#FF9F00]" />}
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
          <p className="text-xs text-[#4B6354]">
            Trao cho điểm đến đạt kết quả tổng hợp xuất sắc nhất từ bình chọn Landing Page (80%) và tương tác mạng xã hội (20%).
          </p>
        </div>

        <div data-aos={inline ? "fade-up" : undefined} data-aos-delay={inline ? 150 : undefined} className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-[#026E4E] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-[#026E4E] text-white text-[11px] font-extrabold uppercase">
              Bình chọn cộng đồng
            </span>
            {!inline && <Award className="h-6 w-6 text-[#026E4E]" />}
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
            Trao cho điểm đến có số lượt bình chọn trực tuyến và tình cảm yêu mến cao nhất từ cộng đồng người dân trên toàn quốc.
          </p>
        </div>
      </div>

      {/* Detailed 4 Points from Điều 10 */}
      <div data-aos={inline ? "fade-up" : undefined} data-aos-delay={inline ? 300 : undefined} className={inline ? "space-y-4 rounded-2xl border border-emerald-900/15 bg-[#F5FBF5]/85 p-5 sm:p-6" : "p-5 rounded-2xl bg-white border border-[#026E4E]/15 shadow-2xs space-y-4"}>
        <h5 className="font-black text-sm text-[#0E382B]">
          Chi tiết 4 quyền lợi trao cho &quot;Điểm đến du lịch nông thôn&quot; được trao giải thưởng:
        </h5>
        <ol className="space-y-3 text-xs sm:text-sm text-[#4B6354]">
          <li className="flex items-start gap-2.5">
            <span className="h-5 w-5 rounded-full bg-[#026E4E]/10 text-[#026E4E] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <span><strong>Giấy chứng nhận</strong> của Ban Tổ chức.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-5 w-5 rounded-full bg-[#026E4E]/10 text-[#026E4E] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <span><strong>Biểu trưng</strong> Hội thi.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-5 w-5 rounded-full bg-[#026E4E]/10 text-[#026E4E] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong>Giải thưởng bằng tiền mặt theo quy định, gồm:</strong>
              <ul className="mt-1 space-y-1 list-disc list-inside pl-2">
                <li>a) Giải thưởng <em>&quot;Điểm đến du lịch nông thôn Việt Nam tốt nhất&quot;</em>: <strong>20 triệu đồng/giải</strong>.</li>
                <li>b) Giải thưởng <em>&quot;Điểm đến du lịch nông thôn Việt Nam được cộng đồng bình chọn&quot;</em>: <strong>10 triệu đồng/giải</strong>.</li>
              </ul>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-5 w-5 rounded-full bg-[#026E4E]/10 text-[#026E4E] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <span>
              <strong>Quyền được sử dụng giải thưởng</strong> trong các hoạt động quảng bá, giới thiệu về &quot;Điểm đến du lịch nông thôn&quot;; được quảng bá, giới thiệu trên hệ thống truyền thông của Ban Tổ chức; được ưu tiên tham gia các hoạt động quảng bá, xúc tiến du lịch do các cơ quan quản lý nhà nước tổ chức.
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}

export function RulesSteps() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-[#4B6354]">
        Theo <strong>Điều 4 Quy chế bình chọn</strong> ban hành kèm quyết định của Ban Tổ chức, người tham gia thực hiện theo 05 bước sau:
      </p>
      <div className="space-y-3">
        <div className="flex gap-4 p-4 rounded-2xl bg-white border border-[#026E4E]/15 shadow-2xs">
          <div className="h-9 w-9 rounded-xl bg-[#026E4E] text-white flex items-center justify-center font-black text-sm shrink-0">
            01
          </div>
          <div>
            <h5 className="font-extrabold text-[#0E382B]">Xem thông tin & video giới thiệu</h5>
            <p className="text-xs text-[#4B6354] mt-0.5">
              Theo dõi hình ảnh, video và thông tin 35 điểm đến trên Fanpage, TikTok và các kênh truyền thông chính thức của Hội thi.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-2xl bg-white border border-[#026E4E]/15 shadow-2xs">
          <div className="h-9 w-9 rounded-xl bg-[#026E4E] text-white flex items-center justify-center font-black text-sm shrink-0">
            02
          </div>
          <div>
            <h5 className="font-extrabold text-[#0E382B]">Truy cập Landing Page bình chọn</h5>
            <p className="text-xs text-[#4B6354] mt-0.5">
              Truy cập trực tiếp qua đường link chính thức hoặc quét mã QR gắn tại các bài đăng quảng bá.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-2xl bg-white border border-[#026E4E]/15 shadow-2xs">
          <div className="h-9 w-9 rounded-xl bg-[#026E4E] text-white flex items-center justify-center font-black text-sm shrink-0">
            03
          </div>
          <div>
            <h5 className="font-extrabold text-[#0E382B]">Đăng nhập & Xác thực OTP</h5>
            <p className="text-xs text-[#4B6354] mt-0.5">
              Nhập email của bạn và xác nhận mã OTP 6 chữ số gửi qua email để kích hoạt quyền bình chọn.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-2xl bg-white border border-[#026E4E]/15 shadow-2xs">
          <div className="h-9 w-9 rounded-xl bg-[#FF9F00] text-white flex items-center justify-center font-black text-sm shrink-0">
            04
          </div>
          <div>
            <h5 className="font-extrabold text-[#0E382B]">Lựa chọn điểm đến & Nhấn &quot;BÌNH CHỌN&quot;</h5>
            <p className="text-xs text-[#4B6354] mt-0.5">
              Tìm kiếm điểm đến theo mã dự thi (DLNT01, DLNT02...) hoặc theo tên, bấm nút &quot;Bình chọn&quot; và xác nhận.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-2xl bg-white border border-[#026E4E]/15 shadow-2xs">
          <div className="h-9 w-9 rounded-xl bg-[#00C2FF] text-white flex items-center justify-center font-black text-sm shrink-0">
            05
          </div>
          <div>
            <h5 className="font-extrabold text-[#0E382B]">Tiếp tục bình chọn cho điểm đến khác</h5>
            <p className="text-xs text-[#4B6354] mt-0.5">
              Mỗi tài khoản được bình chọn tối đa <strong>03 điểm đến khác nhau</strong> trong toàn bộ thời gian diễn ra cuộc thi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RulesValidity({ inline = false }: { inline?: boolean }) {
  return (
    <div className="space-y-4">
      {inline ? (
        <p className="text-sm text-emerald-900">Một lượt bình chọn chỉ được công nhận khi đáp ứng đầy đủ các điều kiện dưới đây.</p>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-[#026E4E] shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Điều 6. Lượt bình chọn hợp lệ</strong>
            <p className="mt-1 text-xs text-[#0E382B]/80 leading-relaxed">
              Một lượt bình chọn chỉ được công nhận khi thỏa mãn đầy đủ các điều kiện theo quy định của Ban Tổ chức.
            </p>
          </div>
        </div>
      )}

      <ul className={inline ? "grid gap-3 md:grid-cols-2" : "space-y-2.5"}>
        <li className={inline ? "rounded-xl border border-emerald-900/15 bg-emerald-50/90 px-4 py-3" : "flex items-start gap-2.5 p-3 rounded-xl bg-white border border-black/5"}>
          {!inline && <CheckCircle2 className="h-4 w-4 text-[#026E4E] shrink-0 mt-0.5" />}
          <span className={inline ? "text-sm leading-relaxed text-emerald-950" : "text-xs text-[#4B6354]"}>
            Thực hiện trực tiếp trên <strong>Page chính thức</strong> của Hội thi.
          </span>
        </li>
        <li className={inline ? "rounded-xl border border-emerald-900/15 bg-emerald-50/90 px-4 py-3" : "flex items-start gap-2.5 p-3 rounded-xl bg-white border border-black/5"}>
          {!inline && <CheckCircle2 className="h-4 w-4 text-[#026E4E] shrink-0 mt-0.5" />}
          <span className={inline ? "text-sm leading-relaxed text-emerald-950" : "text-xs text-[#4B6354]"}>
            Email đã được xác thực thành công qua mã OTP 6 chữ số.
          </span>
        </li>
        <li className={inline ? "rounded-xl border border-emerald-900/15 bg-emerald-50/90 px-4 py-3" : "flex items-start gap-2.5 p-3 rounded-xl bg-white border border-black/5"}>
          {!inline && <CheckCircle2 className="h-4 w-4 text-[#026E4E] shrink-0 mt-0.5" />}
          <span className={inline ? "text-sm leading-relaxed text-emerald-950" : "text-xs text-[#4B6354]"}>
            Được thực hiện trong khung giờ quy định: từ <strong>00:00 ngày 05/11/2026 đến 23:59 ngày 20/11/2026</strong>.
          </span>
        </li>
        <li className={inline ? "rounded-xl border border-emerald-900/15 bg-emerald-50/90 px-4 py-3" : "flex items-start gap-2.5 p-3 rounded-xl bg-white border border-black/5"}>
          {!inline && <CheckCircle2 className="h-4 w-4 text-[#026E4E] shrink-0 mt-0.5" />}
          <span className={inline ? "text-sm leading-relaxed text-emerald-950" : "text-xs text-[#4B6354]"}>
            Không vượt quá giới hạn <strong>tối đa 03 điểm đến khác nhau</strong> cho mỗi tài khoản.
          </span>
        </li>
        <li className={inline ? "rounded-xl border border-emerald-900/15 bg-emerald-50/90 px-4 py-3" : "flex items-start gap-2.5 p-3 rounded-xl bg-white border border-black/5"}>
          {!inline && <CheckCircle2 className="h-4 w-4 text-[#026E4E] shrink-0 mt-0.5" />}
          <span className={inline ? "text-sm leading-relaxed text-emerald-950" : "text-xs text-[#4B6354]"}>
            <strong>Không bình chọn trùng lặp</strong> cùng một điểm đến; lá phiếu đã xác nhận không thể chuyển đổi.
          </span>
        </li>
        <li className={inline ? "rounded-xl border border-emerald-900/15 bg-emerald-50/90 px-4 py-3" : "flex items-start gap-2.5 p-3 rounded-xl bg-white border border-black/5"}>
          {!inline && <CheckCircle2 className="h-4 w-4 text-[#026E4E] shrink-0 mt-0.5" />}
          <span className={inline ? "text-sm leading-relaxed text-emerald-950" : "text-xs text-[#4B6354]"}>
            Không sử dụng công cụ tự động, bot hoặc gian lận làm sai lệch kết quả bình chọn.
          </span>
        </li>
      </ul>

      {/* Anti-fraud warning */}
      <div className={inline ? "rounded-xl border border-rose-200 border-l-4 border-l-rose-300 bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-950" : "p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-900"}>
        {!inline && <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />}
        <div>
          <strong className="block font-bold">Xử lý vi phạm & Thẩm quyền của Ban Tổ chức</strong>
          <p className="mt-0.5 leading-relaxed">
            Sau khi kết thúc bình chọn, Ban Tổ chức cùng đơn vị kỹ thuật rà soát, đối soát và loại bỏ toàn bộ các lượt bình chọn/tương tác có dấu hiệu bất thường trước khi phê duyệt kết quả chính thức.
          </p>
        </div>
      </div>
    </div>
  );
}
