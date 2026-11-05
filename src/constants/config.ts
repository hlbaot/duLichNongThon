import { SITE_URL } from "@/lib/site";


export const SITE_CONFIG = {
  name: "Du Lịch Nông Thôn",
  description: "Khám phá vẻ đẹp đồng quê, trải nghiệm văn hóa bản địa và các mô hình du lịch nông nghiệp sinh thái.",
  url: SITE_URL,
  contact: {
    email: "contact@dulichnongthon.vn",
    phone: "0123 456 789",
    address: "Hà Nội, Việt Nam",
  },
  links: {
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
  },
} as const;

/** Hiệu ứng mở đầu trang chủ (xem src/hooks/useIntroSequence.ts). */
export const INTRO_VIDEO_MS = 2500; // thời gian video chạy một mình, tính từ lúc video thật sự phát
export const FALLBACK_MS = 5000; // timeout cứng từ lúc mount: video lỗi/mạng chậm/autoplay bị chặn vẫn reveal
export const INTRO_LOAD_GRACE_MS = 3500; // iframe đã load nhưng chưa phát được thì reveal sớm
export const STAGGER_MS = 100; // độ trễ giữa các phần tử hero khi hiện lần lượt
export const INTRO_REVEAL_MS = 1100; // thời lượng giai đoạn reveal trước khi mở khóa cuộn
export const INTRO_STORAGE_KEY = "intro-played";

/** Hành vi header (src/hooks/useHeaderState.ts). Có hysteresis để không bị giật quanh ngưỡng. */
export const HEADER_COLLAPSE_Y = 80; // cuộn quá ngưỡng này thì thu gọn thành "cục"
export const HEADER_EXPAND_Y = 20; // cuộn về dưới ngưỡng này thì bung lại
export const EXPAND_ON_SCROLL_UP = false; // true: bung lại ngay khi cuộn ngược lên

