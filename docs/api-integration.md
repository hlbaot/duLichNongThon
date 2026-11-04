# Lớp API

Đã cấu hình `NEXT_PUBLIC_API_BASE_URL=https://dulichnognthon-be.onrender.com` trong `.env`, không thêm `/api`. Khởi động lại Next.js sau khi đổi biến môi trường. Khi deploy, thêm cùng biến này vào môi trường build/deploy.

Trình duyệt gọi `/backend-api/...` cùng origin với frontend; Next.js rewrite sang backend để tránh phụ thuộc CORS. Các request phía server gọi thẳng URL backend. Ví dụ `/backend-api/destinations` được chuyển sang `https://dulichnognthon-be.onrender.com/destinations`.

`src/api/https.ts` xuất instance `https = axios.create(...)`. Các module `auth.ts`, `destinations.ts`, `votes.ts`, `rankings.ts` chứa đủ 11 endpoint trong tài liệu bàn giao. Request/response nằm trong `src/types/api`, tách biệt với type giao diện. Hàm trả JSON trực tiếp; `logout` trả `Promise<void>`. Các GET không có query/body không cần type request rỗng.

```ts
import { getDestinations, getDestination, verifyOtp, getMyVotes, createVote } from "@/api";

const list = await getDestinations({ page: 1, limit: 12, keyword: "Đà Lạt" });
const first = list.items[0];
if (first) {
  const detail = await getDestination({ slug: first.slug });
  console.log(detail);
}

// Sau khi người dùng đã yêu cầu OTP và nhập mã:
const session = await verifyOtp({ email, otp }); // otp là string 6 chữ số
const quota = await getMyVotes(session.accessToken);
if (first && quota.remainingVotes > 0) {
  await createVote({ destinationId: first.id }, session.accessToken);
  const updatedQuota = await getMyVotes(session.accessToken);
  console.log(updatedQuota);
}
```

API cần xác thực nhận `accessToken` tường minh theo từng request. Caller quản lý lưu phiên, điều phối refresh một lần tại một thời điểm, thay cả hai token sau refresh, xử lý 401 và xóa phiên sau logout. Lớp API không tự retry OTP hoặc POST bình chọn. Sau timeout bình chọn, kiểm tra `/votes/me` trước khi cho người dùng thử lại.

Lỗi giữ nguyên dạng AxiosError; dùng `axios.isAxiosError<ApiErrorResponse>(error)` để đọc `error.response?.data` (`message` có thể là `string[]`) và `requestId`. Không có field `code` nghiệp vụ.

Giao diện gọi API thật qua `authService` và Zustand. Store bắt đầu bằng danh sách rỗng. Khi chưa có dữ liệu, phần xếp hạng và danh sách đề cử để trống, không hiển thị lỗi kết nối hoặc thông báo chưa có dữ liệu. Response No Content (204) từ API danh sách/xếp hạng được chuyển thành danh sách rỗng. Ranking cập nhật ngay sau POST bình chọn thành công, gọi lại `/votes/me`, `/rankings` để đối chiếu; polling ranking mỗi 10 giây khi tab hiển thị. Dữ liệu polling cũ không ghi đè lượt vừa xác nhận.

Phiên token được lưu dưới key `dlnt2026:api-session`. Refresh được điều phối dùng chung một Promise cho mỗi token; thay cả hai token sau rotation. Chỉ retry request bị 401 sau refresh, không retry timeout. Logout thu hồi refresh token mới nhất rồi xóa phiên. Dữ liệu phiên cũ của bản thử nghiệm không còn được đọc.

Hạn mức toàn hội thi lấy từ `maxVotes` của `/votes/me`, không reset theo ngày. Đồng hồ OTP dùng `retryAfter`, `expiresIn` từ response. Trang chi tiết nhận slug từ API. Trường region và mã đề cử không có trong API nên không tự tạo dữ liệu thay thế. Ảnh null dùng giao diện chờ cập nhật.

Đồng hồ hội thi chỉ hiển thị khi có `NEXT_PUBLIC_VOTING_END_AT` (ISO 8601) được ban tổ chức xác nhận; quyền bỏ phiếu do backend quyết định.

Đã kiểm tra GET `/destinations?page=1&limit=1`: HTTP 200, 35 điểm đến; production cần cấu hình URL backend để Next.js tạo proxy rewrite.

Card đề cử chỉ hiển thị video, tên, vị trí, số phiếu và nút Vote. Video lấy từ phần tử `VIDEO` đầu tiên trong `/destinations/:slug`; chỉ gọi cho các card ở trang hiện tại, dùng chung cache trong 60 giây. Link Vimeo riêng tư được chuyển sang player và giữ tham số `h`. Mô tả và nội dung đầy đủ chỉ nằm ở trang chi tiết; nhấn tên để mở.

Top 3: khi chưa có điểm đến nào có phiếu (`votes > 0`), hiển thị khung chờ xếp hạng. Khi có phiếu, tự thay khung chờ bằng tối đa 3 card. Bằng số phiếu hiển thị đồng hạng ở podium (ví dụ 1, 1, 3); `displayOrder`, UUID quyết định 3 điểm đến được chọn nếu có nhiều người bằng phiếu. Không thay đổi giá trị `rank` của backend trong store.
