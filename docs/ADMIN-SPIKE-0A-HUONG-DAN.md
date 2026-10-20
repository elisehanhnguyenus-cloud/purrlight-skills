# Spike 0a — chị tự đăng nhập admin và đổi 1 ảnh (20/10/2026)

Đây là bước thử 15 phút trong kế hoạch Admin Dashboard (`docs/ADMIN-DASHBOARD-PLAN-2026-10-20.md`, mục 4).
Mục tiêu: chị **tự** đăng nhập, kéo 1 ảnh từ iPhone vào, bấm Lưu → Xuất bản, không cần em. Qua được bước này
thì em mới làm Phase 0 (đưa sản phẩm, trang chủ, khuyến mãi vào admin).

**Qua cổng khi:** chị làm một mình trong ≤ 15 phút · ảnh ra WebP · giao diện đọc hiểu được.

## Em đã dựng và kiểm sẵn

- Trang admin: **https://elisehanhnguyenus-cloud.github.io/purrlight-skills/admin/** (ẩn khỏi Google, `noindex`).
- Dùng Sveltia CMS bản **0.233.0** (ghim cố định, có mã kiểm tra toàn vẹn). Bản mới nhất là 0.249.1; em chọn bản đã ra
  12 ngày cho chắc, nâng cấp sau theo lịch mỗi quý.
- **Giao diện tiếng Việt tự bật** theo ngôn ngữ trình duyệt (nút Lưu, Duyệt tệp, Tải lên, Chèn… đều tiếng Việt). Nhãn
  và gợi ý từng ô em viết tiếng Việt. Vì vậy **không cần "từ điển nút"** như kế hoạch dự phòng.
- Chỉ có 1 cách đăng nhập: **"Đăng nhập bằng mã truy cập"** (nút "Đăng nhập bằng GitHub" đã tắt vì cần máy chủ OAuth,
  để sau P1).
- Một mục để thử: **"Ảnh cuối trang (Follow)"**, tức dải ảnh vuông ngay trên footer mà chị vừa yêu cầu. Kế hoạch ban đầu
  thử bằng ảnh hero; em đổi sang dải này vì nó **đã nối vào site thật**, chị publish xong là thấy kết quả.
- Đã tắt ảnh stock (Unsplash, Pexels…) theo luật chỉ dùng ảnh thật.
- Em chạy thử trên trình duyệt (bản giả lập, không đụng repo thật), **7/7 đạt**:
  - ảnh HEIC 12 MP kiểu iPhone (3024×4032) → **WebP 810×1080, 55 KB**;
  - JPEG và PNG cũng ra WebP, cạnh dài tối đa 1080 px;
  - tên file tự làm sạch (`IMG_4532.HEIC` → `img_4532.webp`);
  - gõ "Safe plush toy for kids" vào tiêu đề → bị chặn kèm câu "Có chữ không được dùng (an toàn / đồ chơi / trẻ em /
    tên thương hiệu khác / Made in USA) — luật chữ Brand Canon v2.";
  - lưu ra đúng file `website/content/follow.json` mà site đang đọc.
- **Chưa kiểm được** (phần này chỉ chị làm được vì cần tài khoản GitHub của chị): đăng nhập bằng token thật, Lưu tạo
  Pull Request, Xuất bản = merge.

## Các bước chị làm (máy tính, Chrome / Edge / Safari)

1. Mở **https://elisehanhnguyenus-cloud.github.io/purrlight-skills/admin/** → bấm **"Đăng nhập bằng mã truy cập"**.
2. Trong hộp thoại, bấm chữ **GitHub** màu xanh. GitHub mở trang tạo token, đã điền sẵn tên "Sveltia CMS" và 2 quyền
   cần thiết.
3. Trên trang GitHub *(tên nút có thể hơi khác vì GitHub hay đổi giao diện)*:
   - **Token name:** đổi thành `Purrlight admin` cho dễ nhận.
   - **Expiration:** chọn *Custom* → **28/02/2027** (sau mùa lễ; kế hoạch đặt nhắc 30 và 7 ngày trước hạn).
   - **Resource owner:** `elisehanhnguyenus-cloud`.
   - **Repository access:** *Only select repositories* → chọn **purrlight-skills** (chỉ repo này, không chọn "All").
   - **Permissions → Repository:** *Contents* = **Read and write**, *Pull requests* = **Read and write** (đã điền sẵn;
     *Metadata: Read* tự thêm). Không bật gì khác.
   - Bấm **Generate token** → bấm nút copy.
4. **Cất token vào password manager ngay** (Google Password Manager: thêm mục mới, tên `Purrlight admin token`). GitHub
   chỉ hiện token **một lần**.
5. Quay lại tab admin → dán token vào ô → **Đăng nhập**.
6. Bấm **"Ảnh cuối trang (Follow)"** → **"Dải ảnh "follow""**.
7. Mở mục **Ô ảnh** → bấm vào ô số 1 → ở ô **Ảnh** bấm **Duyệt tệp** → **Tải lên** → chọn 1 ảnh chụp từ iPhone (ảnh HEIC
   gốc, gửi sang máy bằng AirDrop, hoặc làm ngay trên iPhone) → bấm **Chèn**.
8. Sửa **Mô tả ảnh (tiếng Anh)**, ví dụ: `Crochet Maine Coon cat on a bookshelf`. Ảnh khách thì chọn "Ảnh khách (đã xin
   phép)" và ghi `@tên-tài-khoản` ở ô Ghi công.
9. Bấm **Lưu**. Sveltia tạo một nhánh `cms/…` và một Pull Request (yêu cầu gộp) trên GitHub. Site thật **chưa đổi**.
10. Chuyển trạng thái bài sang bước cuối, rồi bấm **Xuất bản** (Publish) ở thanh trên. Sveltia gộp Pull Request đó vào
    nhánh website.
11. Nhắn em **"đã publish"**. Em kéo về, chạy kiểm tra rồi đưa lên site. Từ Phase 0, bước này sẽ tự chạy sau 5–8 phút.

Muốn **bỏ** thay đổi trước khi Xuất bản: bấm menu ⋮ ở góc trên của bài, chọn mục bỏ thay đổi (bản tiếng Anh gọi là
*Discard*). Pull Request tự đóng, site không đổi gì.

## Sau khi làm xong, chị nhắn em 5 dòng

1. Mất bao nhiêu phút (từ bước 1 tới bước 10)?
2. Ảnh HEIC từ iPhone có lên được không? Nếu bị từ chối, chị vào iPhone → Cài đặt → Camera → Định dạng → **Tương thích
   nhất** rồi thử lại.
3. Chỗ nào chữ khó hiểu hoặc phải đoán?
4. Nút Lưu / Xuất bản có báo lỗi gì không (chụp màn hình giúp em)?
5. Chị thấy đổi ảnh kiểu này có tự làm được hằng tuần không?

## Lỗi hay gặp

| Thấy gì | Vì sao | Làm gì |
|---|---|---|
| "Resource not accessible by personal access token" khi Lưu | Token thiếu quyền Pull requests | github.com/settings/personal-access-tokens → sửa token → *Pull requests: Read and write* → Lưu lại trong admin |
| Không thấy repo purrlight-skills khi tạo token | Chưa chọn *Only select repositories* | Chọn lại ở mục Repository access |
| Đăng nhập xong không thấy gì | Token hết hạn hoặc bị xoá | Tạo token mới (bước 2–5) |
| Ảnh HEIC báo lỗi | Trình duyệt không giải mã được ảnh đó | Đổi iPhone sang "Tương thích nhất" (chụp JPEG) hoặc gửi ảnh qua Mail |

## An toàn — 4 điều

1. Token là **chìa khoá sửa repo**. Chỉ để trong trình duyệt của chị và trong password manager. Không dán vào Notion,
   Slack, Gmail, không gửi cho em.
2. Token chỉ có quyền trên **1 repo**, chỉ sửa nội dung và Pull Request, và **hết hạn 28/02/2027**.
3. Nghi bị lộ: github.com/settings/personal-access-tokens → **Revoke** → tạo token mới.
4. Admin chạy chung "địa chỉ gốc" `elisehanhnguyenus-cloud.github.io` với **mọi** trang GitHub Pages khác của tài khoản
   chị. Vì vậy: không gắn script lạ (chat, pixel, analytics) vào bất kỳ trang Pages nào của tài khoản này khi chưa hỏi
   em. Khi gắn tên miền purrlight.studio, admin sẽ có địa chỉ riêng, rủi ro này hết.
