
export const SITE_CONFIG = {
  name: "Du Lịch Nông Thôn",
  description: "Khám phá vẻ đẹp đồng quê, trải nghiệm văn hóa bản địa và các mô hình du lịch nông nghiệp sinh thái.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
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
