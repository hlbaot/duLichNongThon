# Trang chi tiết hồ sơ — giao diện editorial

Trang `/diem-den/[id]` và alias `/[id]` dùng chung giao diện mới. Hai route `/bai-thi/[id]`, `/dia-diem/[id]` tiếp tục redirect như cũ. Không thêm route, thư viện, API, lời gọi lấy dữ liệu hoặc thay đổi cơ chế xác thực/bình chọn.

## Các file sửa trong lần thiết kế lại

- `src/views/destination/destination-detail-view.tsx`: khung trang và Playfair Display/Manrope qua next/font, subset latin/vietnamese; giữ logic tải hồ sơ hiện có.
- `src/components/destination-detail-client.tsx`: ghép hero, nội dung, số liệu, vote và điều hướng.
- `src/styles/destination-detail.css`: responsive, bố cục editorial, carousel, sticky và tiến trình đọc.
- `src/styles/theme.css`: biến màu giới hạn trong `.destination-detail-page`.
- `src/styles/vote-button.css`: biến thể nút vote cho trang chi tiết, không đổi nút ở trang khác.
- `src/components/destination-video.tsx`, `src/types/destination-video.ts`: thêm prop UI optional `autoPlay`, mặc định false, dùng sau khi người dùng chủ động bấm phát ở trang chi tiết.

## Các file tạo mới

- `src/lib/destination-profile.ts`: tách metadata, các mục, đoạn và số liệu; giữ nhãn gốc, đoạn không nhận diện và từ chỉ ước lượng.
- `src/types/destination-profile.ts`: kiểu dữ liệu phục vụ trình bày.
- `src/components/destination-profile-text.tsx`: render chữ, đậm/nghiêng an toàn; không dùng dangerouslySetInnerHTML.
- `src/components/destination-detail-media.tsx`: poster trước, player sau thao tác Play; tái sử dụng VimeoPlayer/DestinationVideo.
- `src/components/destination-detail-metrics.tsx`: số liệu từ nội dung và useCountUp/useInView.
- `src/components/destination-detail-sections.tsx`: mục đánh số, lead, pull-quote, thẻ số liệu/giải thưởng.
- `src/components/destination-detail-carousel.tsx`: lưới desktop, scroll-snap/chấm trang mobile.
- `src/components/destination-detail-vote.tsx`: thẻ vote desktop, thanh mobile; gọi nguyên handler handleVoteClick.
- `src/components/destination-detail-progress.tsx`: tiến trình cuộn, cleanup listener và reduced motion.
- `src/components/destination-detail-navigation.tsx`: hồ sơ trước/sau từ danh sách context, sắp theo displayOrder/UUID.

## Dữ liệu và phạm vi

- Mã hồ sơ, địa chỉ và các mục lấy từ `detail`, không từ số thứ tự hay tên hard-code. `accentColor` optional chỉ ảnh hưởng CSS tại trang chi tiết.
- Câu mở đầu, lead và pull-quote lấy nguyên văn. Nội dung mô tả `brief` khác nội dung gốc được giữ trong phần “Mô tả hồ sơ”.
- Các mục thiếu dữ liệu không tạo thẻ. Các hồ sơ kiểm tra chỉ có video nên không thêm ảnh minh họa thay thế. Ảnh bổ sung có trong API sẽ được phân bổ cho khối editorial/gallery.
- Số liệu giữ đơn vị, mốc thời gian và “hơn”, “khoảng”, “trên”. Nếu không thể trích chắc chắn thì không tạo ô thống kê; phần nội dung đầy đủ vẫn hiển thị.
- Không sửa `src/api/*`, `src/data/destinations.ts`, auth, Zustand hay voting context. Nút mới gọi cùng handler; test không gửi OTP hoặc tạo phiếu thật.

## Kiểm tra đã thực hiện

- TypeScript, ESLint trên các file liên quan và production build đạt.
- So sánh toàn bộ token từ của `detail` với kết quả parser trên 3 hồ sơ: giữ đủ từ và thứ tự. Kiểm tra thêm đoạn tiếp nối, nhãn lạ, nhãn viết tắt, trường rỗng và số thập phân.
- 1280px: Bản Khun, tiêu đề serif/metrics/sidebar sticky, không tràn ngang.
- 390px: Lao Chải, tiêu đề dài đủ chữ trong 4 dòng; thanh vote nằm trọn khung; carousel chuyển đúng thẻ/chấm trang.
- 768px: Vườn hồng Lê Phúc, lưới thông tin và thanh vote vừa khung. Player có 0 iframe trước khi bấm Play và 1 iframe sau khi bấm.
- Nút vote khi chưa đăng nhập mở đúng modal đăng nhập cũ.
- ESLint toàn dự án trước khi sửa đã có lỗi trong `destination-grid.tsx` và warning ngoài phạm vi; không mở rộng thay đổi sang các phần này.

## Cách kiểm tra lại

Chạy `pnpm dev`, mở các URL sau và thử ở 1280 / 768 / 390px:

1. Bản Khun (nội dung ngắn, nhãn viết tắt):
   http://localhost:3000/diem-den/dlnt2026-001-lang-van-hoa-du-lich-cong-dong-thon-ban-khun-xa-bang-lang-tinh-tuyen-quang
2. Lao Chải (tiêu đề/nội dung dài, số liệu và giải thưởng):
   http://localhost:3000/diem-den/dlnt2026-003-diem-du-lich-cong-dong-gan-voi-trai-nghiem-sinh-thai-nong-nghiep-va-bao-ton-van-hoa-dan-toc-mong-tai-ban-lao-chai-xa-khun-ha-tinh-lai-chau
3. Vườn hồng Lê Phúc (ít trường số liệu):
   http://localhost:3000/diem-den/dlnt2026-025-diem-du-lich-vuon-hong-le-phuc

Kiểm tra poster/Play, các mục đầy đủ, carousel/chấm trang, vote mở đăng nhập và điều hướng trước/sau. Sau khi thay đổi font/build trên dev, tải lại trang nếu HMR chưa cập nhật.
