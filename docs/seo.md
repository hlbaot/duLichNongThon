# Robots, sitemap và metadata

## Cấu hình

Đặt `NEXT_PUBLIC_SITE_URL` thành origin HTTPS của frontend thật **trước khi build** (không thêm path, query hoặc dấu `/` cuối). Biến mặc định là `http://localhost:3000` để không tự giả định một domain production. Không deploy với mặc định localhost.

`NEXT_PUBLIC_API_BASE_URL` là origin backend, không thêm `/api`. Xem `.env.example`; không sao chép đè `.env` hiện có. `SITE_CONFIG.url`, metadata, robots và sitemap dùng chung `src/lib/site.ts`.

## URL chuẩn

- Trang chủ: `/`.
- Chi tiết: `/diem-den/{slug}`, dùng slug thật API trả về, không dùng mã bài thi hoặc UUID.
- `/[id]` vẫn render nội dung như trước và có canonical về `/diem-den/{slug}`.
- `/bai-thi/[id]` và `/dia-diem/[id]` vẫn dùng `redirect()` như trước (redirect tạm thời; khi đã streaming có thể trả HTTP 200 và chuyển hướng qua nội dung). Chưa chuyển sang redirect vĩnh viễn theo lựa chọn giữ route hiện tại.
- Không đưa URL alias, UUID, `/login`, `/api/*` hoặc proxy `/backend-api/*` vào sitemap.

Robots cho phép `/`, chặn `/api/`, `/backend-api/`, `/bai-thi/`, `/dia-diem/`. Không chặn CSS, JS, ảnh hoặc `/_next/`. `/login` được crawl để bot đọc metadata `noindex, nofollow`; robots.txt không phải cơ chế bảo vệ dữ liệu. Không chặn toàn bộ root dynamic vì sẽ chặn cả route và tài nguyên hợp lệ; canonical xử lý nội dung trùng tại đây.

## Nguồn sitemap và cache

`src/data/destinations.ts` chỉ là hàm mapping, không có dữ liệu tĩnh. Sitemap đọc mọi trang `/destinations` với `limit=100`, fallback `/rankings` khi lỗi, kiểm tra đủ số lượng và loại trùng slug. Hai API chỉ trả bài đang hoạt động. URL chi tiết được tạo từ hợp đồng API này; sitemap không gọi lại từng trang mỗi lần bot truy cập.

Sitemap dùng `use cache` và `cacheLife("hours")` theo cấu hình Cache Components của Next.js 16. Nếu cả hai API lỗi, hàm báo lỗi thay vì phát hành sitemap giả chỉ có trang chủ. Khi build lần đầu, backend cần truy cập được. Không có `lastModified` vì API chưa cung cấp ngày cập nhật thật. Ảnh dùng `thumbnailUrl` hợp lệ từ API; không tự gán ảnh một điểm đến cho mọi bài khác.

Chiến dịch hiện có 35 điểm đến nên chỉ cần một sitemap. Có kiểm tra giới hạn 50.000 URL; cần triển khai `generateSitemaps()` nếu mở rộng vượt 49.999 điểm đến cộng trang chủ.

## Kiểm tra local

Chạy `npm run build`, sau đó `npm run start` (hoặc script tương đương bằng pnpm, không cần cài thêm package).

- `http://localhost:3000/robots.txt`
- `http://localhost:3000/sitemap.xml`

Kiểm tra mã HTTP 200, namespace XML, chỉ URL chuẩn, domain khớp env và không có `lastmod` giả. Trang login phải có `noindex, nofollow`; canonical chi tiết phải dùng slug trả về từ backend.

## Các hạng mục còn cần duyệt riêng

- Redirect vĩnh viễn các URL alias, gồm root `/{slug}` và các URL dùng UUID.
- Tách kiểm tra bài tồn tại khỏi Suspense để trả status 404 trước khi streaming. Hiện `notFound()` trong nội dung đã stream có thể trả HTTP 200 kèm noindex; lỗi API cũng đang bị coi là bài không tồn tại. Cần phân biệt lỗi 404 và lỗi backend trước khi thay đổi luồng này.
- JSON-LD WebSite, Organization và TouristAttraction/Place: cần xác minh thông tin đơn vị tổ chức và dữ liệu địa điểm. Chưa thêm dữ liệu suy đoán.

## Sau deploy

1. Đặt domain thật trong `NEXT_PUBLIC_SITE_URL`, kiểm tra URL backend và build/deploy lại.
2. Kiểm tra `/robots.txt`, `/sitemap.xml`, canonical và metadata trên domain thật.
3. Gửi `/sitemap.xml` trong Google Search Console và Bing Webmaster Tools.
4. Dùng URL Inspection kiểm tra trang chủ, một bài chi tiết và `/login`; xác minh canonical Google chọn và trạng thái index.
5. Theo dõi báo cáo sitemap, lỗi crawl, trang trùng và soft 404; cân nhắc duyệt sửa redirect/404 ở trên.

## Kết quả kiểm tra trong phiên triển khai

- Next.js 16.4.3, build production thành công; không cài dependency.
- `/robots.txt` và `/sitemap.xml`: HTTP 200; 36 URL, 35 ảnh, không có `lastmod`. Đã gọi toàn bộ 36 URL trên bản production local: đều HTTP 200 và không có noindex.
- Trang chủ và bài chi tiết đã đối chiếu canonical, Open Graph, `lang="vi"`; login có `noindex, nofollow`.
- Alias root vẫn HTTP 200 với canonical về route chuẩn. Alias `/bai-thi/` giữ chuyển hướng streaming, HTTP quan sát được là 200, không phải 301/308.
- URL không khớp route: 404. Slug chi tiết không tồn tại: HTTP 200 + noindex do streaming; chưa thay đổi luồng tải dữ liệu.

Ví dụ URL trong sitemap local (domain được thay theo `NEXT_PUBLIC_SITE_URL` khi build):

```text
http://localhost:3000/
http://localhost:3000/diem-den/dlnt2026-008-lang-van-hoa-du-lich-cong-dong-quynh-son
http://localhost:3000/diem-den/dlnt2026-013-lang-du-lich-cong-dong-yen-duc
```
