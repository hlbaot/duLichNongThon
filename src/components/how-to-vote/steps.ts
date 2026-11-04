import type { VotingStep } from "@/types/how-to-vote";

export const STEPS: VotingStep[] = [
  {
    step: 1,
    title: "Truy cập Cổng bình chọn",
    desc: "Truy cập đường link https://dulichnongthon-liard.vercel.app/ chính thức từ Fanpage và TikTok do Ban Tổ chức công bố.",
    note: "Cổng bình chọn trực tuyến chính thức",
  },
  {
    step: 2,
    title: "Vào mục \"Điểm đến\" trên thanh Menu",
    desc: "Màn hình chính sẽ hiển thị đầy đủ thông tin, hình ảnh, video và mã số của 35 điểm đến dự thi toàn quốc.",
    note: "Khám phá 35 điểm đến tiêu biểu",
  },
  {
    step: 3,
    title: "Chọn điểm đến & nhấp \"BÌNH CHỌN\"",
    desc: "Chọn tên điểm đến yêu thích muốn bình chọn và bấm nút 'BÌNH CHỌN' để bắt đầu quy trình.",
    note: "Bình chọn cho điểm đến bạn yêu thích",
    highlight: true,
  },
  {
    step: 4,
    title: "Nhập Gmail đăng nhập",
    desc: "Nhập địa chỉ Gmail hợp lệ của bạn để đăng nhập và thực hiện bình chọn.",
    note: "Sử dụng Gmail cá nhân hợp lệ",
  },
  {
    step: 5,
    title: "Nhận & nhập mã xác thực OTP",
    desc: "Kiểm tra hòm thư Gmail nhận mã OTP xác thực và nhập vào hệ thống để kích hoạt quyền bình chọn.",
    note: "Mã OTP 6 chữ số an toàn",
  },
  {
    step: 6,
    title: "Kiểm tra & \"XÁC NHẬN BÌNH CHỌN\"",
    desc: "Kiểm tra kỹ thông tin điểm đến đã lựa chọn và nhấn nút 'XÁC NHẬN BÌNH CHỌN' để hoàn tất lá phiếu.",
    note: "Không giới hạn số lượt bình chọn",
    highlight: true,
  },
];
