# Kế hoạch launch: giỏ hàng, thanh toán Stripe, tồn kho, dashboard (27/11/2026)

Chị quyết ngày 27/11: dựng bằng **Stripe**; **mở khóa web thật sớm 1 tuần** (từ 26/12, thay vì 02/01); đặt web ở
**Cloudflare**; tên miền chưa mua. File này là bản thống nhất cho mọi phiên Claude cùng làm (phiên website, AI Sales
Agent, phiên viết Journal), để không ai làm trùng hay lệch nhau.

## 1. Ai làm gì

| Việc | Ai |
|---|---|
| Code giỏ hàng, thanh toán, tồn kho, dashboard; bảo mật; chuyển web sang Cloudflare | Phiên website (phiên này), **chị xác nhận 28/11** |
| Phía tài khoản Stripe (hồ sơ doanh nghiệp, thuế, phí ship, thử thanh toán), bản nháp 3 trang chính sách, nội dung bán hàng | AI Sales Agent |
| Journal (blog), sitemap, robots: PR nháp số 1 trên `purrlight-web` | Phiên viết Journal |
| Duyệt chữ cho khách, nói "chạy", tạo tài khoản, nhập khóa bí mật | Chị Elise |

Lý do một bên giữ phần code tiền: giá, tồn kho và bước trả tiền đụng cùng các file (`js/products.js`, trang sản
phẩm, `tools/check-site.js`); hai bên cùng sửa thì dễ lệch giá hoặc mất chốt kiểm.

## 2. Code nằm ở đâu

- **Bản chính từ nay: repo `elisehanhnguyenus-cloud/purrlight-web`** (private; file web ở gốc repo). Các phiên khác
  đã làm việc ở đây.
- Mỗi việc một nhánh riêng. Không đẩy thẳng lên `main` khi chị chưa duyệt.
- Cloudflare Pages nối với repo này: `main` là web thật; mỗi nhánh khác tự có một địa chỉ xem thử riêng.
- `purrlight-skills/website` và trang `github.io` giữ nguyên cho tới ngày chuyển, rồi chuyển hướng sang tên miền mới.
  GitHub Pages không cho chạy trang bán hàng, nên phần thanh toán không bao giờ lên `github.io`.

## 3. Cách dựng

- **Trang trả tiền là trang của Stripe** (Stripe Checkout). Web mình không chạm vào số thẻ và không cần gắn mã của
  Stripe vào trang.
- **Giỏ hàng** nằm trong trình duyệt của khách: chỉ lưu mã món, lựa chọn và số lượng. Không lưu giá.
- **Máy chủ nhỏ** (hàm chạy phía sau, không nằm trong file web):
  - `checkout`: nhận giỏ hàng, tự tra giá và tồn kho ở phía máy chủ, tạo phiên trả tiền trên Stripe, trả về đường
    dẫn. Giá trình duyệt gửi lên không bao giờ được dùng.
  - `stripe-webhook`: Stripe báo "đã trả tiền"; hàm kiểm chữ ký của Stripe, ghi đơn, trừ tồn kho. Mỗi sự kiện chỉ xử
    lý một lần.
- **Dữ liệu** (tồn kho, đơn web, banner): dùng Supabase đang có, cạnh sổ Etsy, để tồn kho web và Etsy đối chiếu được.
  Mọi bảng khóa như các bảng hiện tại: chỉ hàm máy chủ đọc và ghi.
- **Dashboard của chị:**
  - tiền và đơn: bảng điều khiển của Stripe (có app điện thoại);
  - tồn kho, bật tắt món, banner: một trang quản lý riêng, đăng nhập bằng email của chị, có thêm lớp khóa của
    Cloudflare (Access) trước trang.
- **Khóa bí mật** (Stripe secret key, webhook secret): chị tự dán vào kho bí mật của máy chủ. Không nằm trong repo,
  không nằm trong chat.

## 4. Chốt bảo mật trước khi mở

- Giá và tồn kho chỉ tính ở máy chủ; thử gửi giỏ hàng giả (giá 0, số âm, mã món lạ, số lượng lớn).
- Webhook chỉ nhận sự kiện có chữ ký đúng; thử gửi sự kiện giả và sự kiện lặp.
- Trang quản lý: người lạ không đọc, không ghi được gì.
- Lớp chặn mã lạ (CSP) trên mọi trang.
- Một vòng kiểm tra độc lập (bên cố phá, bên soát lỗi phụ) như vòng 27/11, trước khi chuyển Stripe sang chế độ thật.
- `tools/check-site.js` thêm chốt: giá trên web khớp bảng giá máy chủ.

## 5. Lịch (mốc 26/12)

| Tuần | Em làm | Chị làm |
|---|---|---|
| 28/11–04/12 | Giỏ hàng và trả tiền ở chế độ thử của Stripe | Tạo tài khoản Cloudflare và Stripe; mua tên miền; trả lời mục 6 |
| 05/12–11/12 | Tồn kho, trang quản lý, banner; trang riêng cho từng món (SEO) | Duyệt chữ 3 trang chính sách |
| 12/12–18/12 | Kiểm tra bảo mật độc lập, sửa; đo tốc độ | Thử trên địa chỉ xem thử bằng thẻ thử của Stripe |
| 19/12–25/12 | Dự phòng; nối tên miền; chuyển Stripe sang chế độ thật | Trả thử một món thật; nói "chạy" |
| 26/12–01/01 | Trực sửa lỗi trong tuần chạy thật | Dùng thử, báo lỗi |
| 02/01 | Launch | |

## 6. Chị trả lời ngày 28/11

- **Em dựng** phần code tiền; chốt phương án ở file này.
- **Món:** cả 34 món đều có sẵn ở shop Pearland; có món nhỏ mới về, chưa đăng Etsy. Web hiện có 31 món.
- **Tồn kho:** hệ thống tự giảm và tăng theo tồn kho, và phải đồng bộ được từ nhiều sàn; hiện mới nối Etsy.
- **Phí ship:** đơn web từ $55 trở lên miễn phí ship.
- **Thuế:** theo tiểu bang của người mua, người mua trả.

### Chị trả lời thêm ngày 28/11 (tin sau)

- **Phí ship:** đơn dưới $55 là $5.99; từ $55 miễn phí.
- **Dữ liệu món:** kéo từ Etsy (chị nhập tay đầy đủ trên đó). Tồn mỗi món 20–200.

### Em làm theo các mặc định sau (chị sửa nếu khác)

- **Bản đầu (tuần này):** món nào cũng vào giỏ hàng được kèm lựa chọn (cỡ, màu, bộ 3 hay 6…), giá và số tồn lấy từ
  Etsy. 4 món làm theo ảnh khách gửi vẫn đi qua trang Custom Orders. Mẫu PDF vẫn bán qua Etsy vì Etsy tự gửi file.
- **Giá web = giá Etsy** của đúng lựa chọn đó, cho tới khi chị nói web có giá riêng.
- **Lựa chọn không phải món** ("Tipping", lựa chọn chị đã tắt trên Etsy): web không hiện.
- **Cá nhân hóa** (tên thêu, ghi chú): khách gõ ở trang trả tiền của Stripe, một ô, không bắt buộc.
- **Thuế:** bật tính thuế tự động của Stripe (Stripe Tax); Stripe chỉ thu ở tiểu bang chị đã đăng ký, hiện là
  Texas. Em không tư vấn thuế; khi bán nhiều ra ngoài Texas chị nên hỏi kế toán.
- **Ship:** chỉ giao trong nước Mỹ ở bản đầu.
- **Tồn kho hai chiều với Etsy:** Etsy bán thì web tự giảm (đồng bộ thường xuyên thay vì mỗi đêm); web bán thì hệ
  thống giảm số trên Etsy. Chiều thứ hai cần chị bấm "Allow" lại với quyền sửa listing; em gửi link khi tới bước đó.
- **Dữ liệu khách:** tên, email, địa chỉ nằm ở Stripe; cơ sở dữ liệu của mình không lưu.

### Còn cần chị

1. Giá web: lấy đúng giá Etsy, hay web có giá riêng? 13 món trên web đang hiện giá cũ hơn Etsy (bảng ở
   `docs/PURRLIGHT-WEBSITE-TONG-HOP.md`, mục 28/11 tin sau): sửa ngay hay chờ 26/12?
2. Số tồn trên Etsy của vài món chỉ 1–3 (Woodland, cừu, hươu, ngựa, vịt, túi ruy băng): nếu Pearland có nhiều hơn,
   chị sửa số trên Etsy, web tự theo.
3. 2 món có trên Etsy, chưa có trên web (búp bê thánh kèm hộp quà tràng hạt; vòng len gắn ảnh): có đưa lên web không?
4. Món nhỏ mới về, chưa đăng Etsy: chị đăng Etsy trước (web kéo về), hay cần bán trên web trước?
5. Duyệt nhãn lựa chọn (em gửi bảng) và chữ mới của giỏ hàng.

## 7. Giao kèo kỹ thuật

`server/CONTRACT.md` (bản v1.1, 28/11) trên nhánh `claude/cart-checkout` của `purrlight-web`: các địa chỉ máy chủ, dữ
liệu qua lại, luật không đổi (giá chỉ tính ở máy chủ, không khóa bí mật trong repo, trang trả tiền là của Stripe,
không lưu dữ liệu khách), món và lựa chọn nào vào giỏ được, đơn vị tồn kho theo Etsy. Cùng nhánh:
`server/supabase/functions/etsy-catalog/` (hàm kéo dữ liệu món từ Etsy, đã chạy trên Supabase).
