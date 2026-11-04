<p align="center">
  <img src="public/logo.png" alt="Logo Du Lịch Nông Thôn" width="160" height="160" style="border-radius: 50%; box-shadow: 0 10px 25px rgba(31, 107, 69, 0.2);" />
</p>

<h1 align="center">CUỘC THI DU LỊCH NÔNG THÔN 2026</h1>

<p align="center">
  <strong>Cổng Thông Tin Bình Chọn Trực Tuyến & Tôn Vinh 35 Điểm Đến Du Lịch Nông Nghiệp, Làng Nghề Sinh Thái Việt Nam</strong>
</p>

<p align="center">
  <a href="#-tính-năng-nổi-bật">Tính Năng</a> •
  <a href="#-hệ-thống-thiết-kế--bảng-màu">Hệ Thống Thiết Kế</a> •
  <a href="#-công-nghệ-sử-dụng">Công Nghệ</a> •
  <a href="#-hướng-dẫn-cài-đặt">Cài Đặt</a> •
  <a href="#-thể-lệ-bình-chọn">Thể Lệ</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Status-Completed-1F6B45?style=for-the-badge" alt="Status" />
</p>

---

## 📖 Giới Thiệu Dự Án

**Cuộc thi Du lịch Nông thôn 2026** là nền tảng bình chọn trực tuyến cấp quốc gia, hướng đến mục tiêu quảng bá, bảo tồn và tôn vinh 35 điểm đến du lịch sinh thái, làng nghề truyền thống và các mô hình nông nghiệp xanh trải dài khắp dải đất hình chữ S.

Hệ thống được phát triển với triết lý thiết kế hiện đại, giao diện mờ kính sang trọng (**Glassmorphism**), hiệu ứng chuyển cảnh tự nhiên và bộ nhận diện đậm chất đồng quê Việt Nam.

---

## ✨ Tính Năng Nổi Bật

### 1. Giao diện & Trải nghiệm Người dùng (UI/UX)
- **Glassmorphism Floating Navbar**: Thanh điều hướng dạng viên thuốc bo tròn với hiệu ứng kính mờ `backdrop-blur-2xl`, độ tương phản cao, tối ưu hiển thị trên mọi nền ảnh.
- **Hero Video**: Video phong cảnh nông thôn Việt Nam với nút phát/tạm dừng, ảnh dự phòng và hỗ trợ giảm chuyển động. Nguồn video được cấu hình trong `src/lib/media.ts`.
- **Live Countdown Timer**: Đồng hồ đếm ngược thời gian kết thúc bình chọn (Ngày : Giờ : Phút : Giây) hiển thị song hành cùng nút hành động chính.
- **Motion & Lenis Smooth Scroll**: Tích hợp công nghệ cuộn trang quán tính mượt mà [motion.dev/examples/js-lenis-smooth-scroll](https://motion.dev/examples/js-lenis-smooth-scroll), đồng bộ trực tiếp với vòng lặp xử lý frame (`motion/frame`), khử hoàn toàn hiện tượng giật lag khi cuộn chuột và tự động tối ưu hóa anchor scrolling.
- **Cuộn trang tương tác mượt mà**:
  - Thanh tiến trình cuộn trang siêu mượt (Scroll Progress Bar) ở mép trên màn hình.
  - Nút trượt nhanh về đầu trang (Back to Top) mờ kính.
  - Hiệu ứng xuất hiện mềm mại (Reveal on Scroll) theo từng phân đoạn nội dung.

### 2. Danh mục 35 Điểm đến & Phân trang Thông minh
- **Tìm kiếm thông minh & Sắp xếp linh hoạt**: Tìm kiếm thời gian thực theo tên điểm đến, mã số hồ sơ (DLNT01, DLNT02...) và tỉnh thành; hỗ trợ sắp xếp theo lượt bình chọn cao nhất, tên A-Z hoặc theo mã số.
- **Chi tiết hồ sơ bài thi (Detail Modal & Standalone Route `/bai-thi/[id]`)**: Xem chi tiết toàn diện từng bài thi dự thi với ảnh bìa khổ rộng, 4 trụ cột tiêu chí đánh giá của Bộ Nông nghiệp & Môi trường (Sản phẩm & OCOP, Cộng đồng & Bản sắc, Môi trường sinh thái, Chuyển đổi số), bảng thống kê quy mô làng quê, duyệt nhanh bài trước/sau và sao chép liên kết chia sẻ trực tiếp.
- **Dàn 4x3 & Phân trang 3 lớp tối ưu**: Dàn đều 12 thẻ/trang (4 cột x 3 hàng chuẩn desktop), tương ứng 3 lớp trang (Trang 1: 12, Trang 2: 12, Trang 3: 11) cho toàn bộ 35 điểm đến; thanh điều khiển squircle bo tròn mượt mà, tự động cuộn lên đầu danh mục khi chuyển trang.

### 3. Quy trình 5 Bước Bình Chọn & Cơ cấu Đa kênh
- **Quy trình 5 Bước chuẩn BTC**:
  - **Bước 01**: Xem thông tin & video giới thiệu 35 điểm đến trên Fanpage/TikTok.
  - **Bước 02**: Truy cập Landing Page chính thức.
  - **Bước 03**: Xác thực email qua mã OTP 6 số.
  - **Bước 04**: Chọn mã dự thi và nhấn "BÌNH CHỌN" (mỗi điểm đến chỉ bình chọn 01 lần).
  - **Bước 05**: Tiếp tục bình chọn các điểm đến khác (tối đa 3 điểm đến/tài khoản).
- **Cơ cấu tính điểm minh bạch**: 80% từ cổng Landing Page + 10% Facebook + 10% TikTok (Lượt Share tính hệ số 2).

### 4. Bảng Xếp Hạng & Quản Lý Bình Chọn (State Management)
- **Top 3 Leaderboard**: Tôn vinh 3 vị trí dẫn đầu toàn quốc với hiệu ứng huy chương vàng, bạc, đồng; Top 1 ở giữa và cao hơn trên desktop; vàng, bạc và đồng phân biệt từng thứ hạng. Trên điện thoại hiển thị theo thứ tự 1–2–3.
- **Hệ thống Modal Glassmorphism**:
  - Modal đăng nhập email & mã OTP với đồng hồ đếm ngược gửi lại mã.
  - Modal xác nhận bình chọn trước khi hoàn tất.
  - Modal Bảng xếp hạng chi tiết toàn bộ 35 điểm đến theo thời gian thực.
  - Modal Thể lệ cuộc thi minh bạch, chuẩn mực.
- **API và Zustand**: Phiên token được lưu phía client; backend xác minh tài khoản và hạn mức qua `/auth/me`, `/votes/me`. Bảng xếp hạng lấy từ `/rankings`, cập nhật sau bình chọn và mỗi 10 giây.

---

## 🎨 Hệ Thống Thiết Kế & Bảng Màu

Bảng màu được lấy cảm hứng từ thiên nhiên nông thôn, đồng ruộng và sông nước Việt Nam:

| Vai trò | Tên màu | Mã màu (HEX) | Minh họa | Ứng dụng thực tế theo Logo |
| :--- | :--- | :---: | :---: | :--- |
| **Chủ đạo** | Xanh ngọc đậm (Núi đồi) | `#026E4E` | `■` | Logo, tiêu đề chính, thương hiệu, nút đăng nhập |
| **Điểm nhấn chính** | Cam vàng lúa chín (Ánh dương) | `#FF9F00` / `#FFB020` | `■` | Nút **Bình chọn ngay**, Rank 1 Vương miện, số liệu nổi bật |
| **Phụ tươi sáng** | Xanh mạ non (Ruộng bậc thang) | `#16A34A` / `#22C55E` | `■` | Thẻ tag vùng miền, icon thiên nhiên sinh thái |
| **Điểm nhấn mát** | Xanh nước biếc (Sông nước & trời) | `#00C2FF` | `■` | Vị trí địa lý, điểm nhấn sông nước, huy hiệu Rank 2 |
| **Nền sáng** | Trắng tinh khôi & Kem mạ non | `#FFFFFF` / `#F4FAF6` | `■` | Nền toàn bộ website và các card trong trẻo, tươi sáng |
| **Chữ** | Xanh ngọc sẫm | `#0E382B` | `■` | Tiêu đề và nội dung văn bản đạt độ sắc nét và tương phản cao |

- **Phông chữ**: `Manrope` cho nội dung và `Lora` cho tiêu đề (Google Fonts) – hiển thị dấu tiếng Việt sắc nét, hiện đại, kích thước tối thiểu từ 16px.

---

## 🛠️ Công Nghệ Sử Dụng

- **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server-Ready Architecture)
- **UI Library**: [React 19](https://react.dev/)
- **Animations & Smooth Scroll**: [Motion (Framer Motion v14)](https://motion.dev/) & [Lenis](https://lenis.darkroom.engineering/) (Shared Frame Loop Architecture)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Ngôn ngữ**: TypeScript 5 (Strict Mode)
- **Tối ưu hình ảnh**: Next.js Image Optimization với CDN Unsplash chuyên dụng

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.18 trở lên (khuyến nghị Node.js 20+ hoặc 22 LTS)
- **Trình quản lý gói**: `npm`, `pnpm` hoặc `yarn`

### 2. Cài đặt dependencies
```bash
npm install
# hoặc nếu dùng pnpm
pnpm install
```

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt để trải nghiệm website.

### 4. Kiểm tra mã nguồn (Code Quality)
```bash
npm run lint
```

### 5. Đóng gói triển khai sản phẩm (Production Build)
```bash
npm run build
npm run start
```

---

## 📋 Thể Lệ & Quy Chế Bình Chọn Chính Thức

Theo văn bản chỉ đạo của **Ban Tổ chức Hội thi – Bộ Nông nghiệp và Môi trường**:

### 1. Thời gian bình chọn
- Bắt đầu: **00h00 ngày 05/11/2026**
- Kết thúc: **23h59 ngày 20/11/2026**
- Cổng bình chọn trực tuyến duy nhất: **Landing Page chính thức của Hội thi**

### 2. Quy định số lượt bình chọn
- Mỗi tài khoản xác thực email được bình chọn tối đa **03 điểm đến khác nhau** trong toàn bộ thời gian diễn ra Hội thi.
- Mỗi điểm đến chỉ được bình chọn **01 lần duy nhất** (không được bình chọn trùng lặp một điểm đến).
- Lượt bình chọn đã gửi thành công **không được hoàn tác** hoặc chuyển đổi.

### 3. Cơ cấu tỷ trọng tính kết quả chung (80% – 10% – 10%)
Kết quả bình chọn chung cuộc được tổng hợp từ 3 kênh chính thức:

| Kênh bình chọn | Tỷ trọng | Tiêu chí tính điểm |
| :--- | :---: | :--- |
| **Landing Page chính thức** | **80%** | Tổng số lượt bình chọn hợp lệ xác thực qua mã OTP trên website |
| **Fanpage Facebook chính thức** | **10%** | `Số lượt Thích (Like) + (Số lượt Chia sẻ (Share) × 2)` trên bài đăng dự thi |
| **Kênh TikTok chính thức** | **10%** | `Số lượt Thả tim (Like) + (Số lượt Chia sẻ (Share) × 2)` trên video dự thi |

> **Công thức tính điểm**:
> $$\text{KẾT QUẢ CHUNG} = (\text{Tỷ lệ Landing Page} \times 80\%) + (\text{Tỷ lệ Fanpage} \times 10\%) + (\text{Tỷ lệ TikTok} \times 10\%)$$
> Trong đó:
> $$\text{Tỷ lệ kênh} = \left(\frac{\text{Kết quả của điểm đến}}{\text{Kết quả cao nhất trên chính kênh đó}}\right) \times 100\%$$

### 4. Quy trình 5 bước bình chọn trực tuyến
1. **Bước 1**: Theo dõi hình ảnh, video giới thiệu 35 điểm đến trên Fanpage, TikTok và truyền thông chính thức.
2. **Bước 2**: Truy cập Landing Page qua đường link hoặc quét mã QR.
3. **Bước 3**: Nhập email để nhận mã xác thực OTP.
4. **Bước 4**: Chọn mã dự thi của điểm đến (DLNT01, DLNT02...) và nhấn **"BÌNH CHỌN"**.
5. **Bước 5**: Tiếp tục bình chọn cho các điểm đến khác nếu tài khoản còn lượt vote.

---

<p align="center">
  <sub>© 2026 Hội thi “Điểm đến du lịch nông thôn Việt Nam tốt nhất” năm 2026 • Bộ Nông nghiệp và Môi trường.</sub>
</p>

## Kết nối backend

Cấu hình `NEXT_PUBLIC_API_BASE_URL` bằng URL backend (không thêm `/api`), rồi khởi động lại Next.js. Xem [hướng dẫn API](docs/api-integration.md). Không có dữ liệu dự phòng; cần backend để đăng nhập, xem điểm đến và bình chọn.
