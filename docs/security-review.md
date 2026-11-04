# Rà soát bảo mật ngày 04/11/2026

> Báo cáo lịch sử trước khi chuyển sang API. Cập nhật: dữ liệu seed, dịch vụ đăng nhập thử nghiệm, OTP cố định và ledger phía client đã được xóa. Giao diện hiện dùng API backend và phiên token; xem `docs/api-integration.md`. Các nhận định và ví dụ bên dưới phản ánh phiên bản tại thời điểm rà soát, không phải trạng thái hiện tại.

Phạm vi: mã nguồn và `.env` hiện có trong workspace. Không kiểm tra biến môi trường trên nền tảng triển khai, backend bên ngoài hoặc lịch sử Git. Không ghi lại giá trị secret trong báo cáo.

## Thay đổi đã thực hiện

- Thêm `src/components/DevToolsGuard.tsx`, gắn trong `src/app/layout.tsx` trước `{children}`. Layout vẫn là Server Component.
- Chỉ chạy ở production; kiểm tra mỗi 500ms bằng kích thước cửa sổ (>160px) HOẶC thời gian chạy `new Function("debugger")()` (>100ms).
- Lớp phủ fixed nền trắng, z-index 2147483647; đổi title; đặt các phần tử khác trong body thành inert, kể cả portal mới; chặn input ở capture phase; khóa overflow và tạm dừng Lenis nếu đang chạy.
- Khi không còn phát hiện: gỡ lớp phủ, khôi phục title (hoặc title mới nhất do điều hướng), overflow, inert, focus và Lenis. Cleanup gỡ interval, listener và observer.
- Đặt `productionBrowserSourceMaps: false` trong `next.config.ts`.

## Kết quả phía server

1. **Ưu tiên cao — xác thực và bình chọn vẫn là mock phía client.** `src/lib/auth/authService.ts` dùng `createMockAuthService()` cả production. Session, ledger và hạn mức dựa vào localStorage; tài khoản demo nằm trong `src/lib/auth/config.ts`; OTP cố định trong `verifyOtp`. `AuthProvider.tsx` import service vào client bundle. Ẩn thông tin demo trong giao diện production không loại bỏ logic và thông tin đó khỏi bundle. Người dùng có thể sửa session, lượt bình chọn hoặc xóa storage. DevToolsGuard không khắc phục điểm này.
2. **Route Handler:** chỉ thấy `GET /api/health`, trả status/timestamp, không có xác thực. Endpoint kiểm tra tình trạng công khai này không trả dữ liệu riêng tư và không có mutation; không cần thêm auth nếu chủ ý public. Nếu đây là endpoint quản trị nội bộ, giới hạn ở ingress hoặc xác thực riêng.
3. **Server Action:** không tìm thấy chỉ thị `use server`; chưa có luồng đăng nhập/OTP/bình chọn phía server để xác minh phân quyền. Không thể kết luận ứng dụng đã có auth server.
4. **Biến môi trường:** `.env` có `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (định danh public); mã nguồn dùng thêm `NEXT_PUBLIC_SITE_URL`. Không thấy secret có tiền tố `NEXT_PUBLIC_`. Các tên `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` không mang tiền tố public; không thấy tham chiếu trong source hiện tại. `.env*` được ignore, không có file env trong danh sách Git tracked hiện tại. Chưa xác minh môi trường deploy hay lịch sử commit.
5. **Source map:** trước đó không khai báo (Next.js mặc định tắt production browser source map); nay đã đặt false tường minh. JavaScript gửi xuống browser vẫn đọc được.
6. **Validation/rate limiting:** chưa thấy triển khai trong mã ứng dụng. Zod chưa được khai báo là dependency trực tiếp trong package.json; không dựa vào dependency gián tiếp của công cụ lint.

## Các bước cần có trước bình chọn thật

- Thay mock bằng API/Server Action dùng database và session được xác minh phía server; cookie HttpOnly, Secure, SameSite thích hợp, hết hạn và thu hồi session. Không tin email, role, quota hoặc userId do client gửi lên.
- Xác thực trong từng handler/action; phân quyền tại lớp truy cập dữ liệu (vai trò, quyền sở hữu hoặc phạm vi tổ chức nếu có). Trả 401 khi chưa đăng nhập và 403 khi thiếu quyền.
- OTP ngẫu nhiên, thời hạn ngắn, dùng một lần, giới hạn số lần thử; lưu hash OTP. Mật khẩu phải hash bằng thuật toán phù hợp, không lưu plain text. Lấy userId từ session server.
- Ghi phiếu và kiểm tra hạn mức trong transaction. Dùng ràng buộc unique theo userId + ngày + destinationId và kiểm soát tổng số phiếu/ngày một cách nguyên tử. Thời gian/ngày do server quyết định.
- Rate limit tại ingress cho IP và tại server cho userId/email chuẩn hóa bằng Redis hoặc kho dùng chung có thao tác nguyên tử. Không dùng Map trong RAM cho nhiều instance/serverless. IP chỉ lấy từ proxy đã tin cậy, không tin trực tiếp X-Forwarded-For do người gọi cung cấp. Trả 429 với Retry-After.
- Ngưỡng khởi điểm cần điều chỉnh theo tải: gửi OTP 3 lần/15 phút/email kèm giới hạn IP; xác minh OTP 5 lần/5 phút/challenge; vote 10 request/phút/user cùng hạn mức nghiệp vụ 3 phiếu/ngày. Rate limit không thay transaction/unique constraint.
- Áp giới hạn kích thước body ở ingress; bắt lỗi JSON sai định dạng; dùng Zod phía server trước khi truy cập dữ liệu. Kiểm tra điểm đến tồn tại và đang mở bình chọn sau validation.
- Route Handler mutation dùng cookie cần bảo vệ CSRF/kiểm tra Origin phù hợp. Server Action vẫn phải tự xác thực và phân quyền.

Ví dụ schema cho API bình chọn tương lai (cài dependency trực tiếp bằng `pnpm add zod`):

```ts
import { z } from "zod";

const voteSchema = z.object({
  destinationId: z.string().trim().regex(/^NT-\d{2}$/),
}).strict();

// Bên trong handler đã kiểm tra session và rate limit:
// Bắt lỗi request.json() và trả 400 nếu JSON sai định dạng.
const parsed = voteSchema.safeParse(body);
if (!parsed.success) {
  return Response.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
}
// Chỉ truyền parsed.data.destinationId và userId từ session server vào transaction.
```

## Giới hạn DevToolsGuard

Không có API web đáng tin cậy để cấm hoặc xác định DevTools. Cửa sổ tách rời, tắt breakpoint, extension, tắt JavaScript hoặc menu trình duyệt có thể vượt qua cơ chế. Sidebar, zoom, bàn phím ảo, trình duyệt có chrome lớn hoặc máy chậm có thể gây báo nhầm. Nếu một tín hiệu vẫn dương tính thì lớp phủ vẫn giữ dù DevTools đã đóng.

`debugger` có thể dừng main thread trước khi phép đo kết thúc; lớp phủ và interval chỉ tiếp tục sau khi resume/đóng DevTools. setInterval 500ms là lịch mong muốn, có thể bị throttle khi tab chạy nền. CSP chặt có thể cấm Function(); component bắt lỗi và chỉ dùng phép đo kích thước. Không nới CSP bằng unsafe-eval chỉ để phục vụ guard. Lớp phủ hiển thị 404 không đổi HTTP status của trang thành 404.

## Kiểm tra

- Production build thành công, bao gồm bước TypeScript. Build có cảnh báo metadataBase hiện có, không liên quan guard.
- ESLint trên ba file thay đổi thành công.
- Kiểm tra mô phỏng DOM/timer: production/development, cả hai ngưỡng, CSP chặn Function, khôi phục title/inert/focus/Lenis, phím tắt macOS và cleanup.
- Cần kiểm tra thủ công trên Chrome/Safari/Firefox thực tế: chạy production, thử dock/undock, resume debugger, đóng DevTools, tab/scroll, portal và điều hướng. Mô phỏng không xác minh được cách từng trình duyệt xử lý debugger và phím hệ thống.

Tham khảo: [Next.js authentication](https://nextjs.org/docs/app/guides/authentication), [environment variables](https://nextjs.org/docs/app/guides/environment-variables), [source maps](https://nextjs.org/docs/app/api-reference/config/next-config-js/productionBrowserSourceMaps), [Zod safeParse](https://zod.dev/basics), [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).
