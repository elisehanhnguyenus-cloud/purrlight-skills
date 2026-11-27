# Kế hoạch launch: giỏ hàng, thanh toán Stripe, tồn kho, dashboard (27/11/2026)

Chị quyết ngày 27/11: dựng bằng **Stripe**; **mở khóa web thật sớm 1 tuần** (từ 26/12, thay vì 02/01); đặt web ở
**Cloudflare**; tên miền chưa mua. File này là bản thống nhất cho mọi phiên Claude cùng làm (phiên website, AI Sales
Agent, phiên viết Journal), để không ai làm trùng hay lệch nhau.

## 1. Ai làm gì

| Việc | Ai |
|---|---|
| Code giỏ hàng, thanh toán, tồn kho, dashboard; bảo mật; chuyển web sang Cloudflare | Phiên website (phiên này), **chờ chị xác nhận** |
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

## 6. Chị cần trả lời để em dựng đúng

1. **Món nào bán trên web?** Tất cả 31 món, hay chỉ món có sẵn ở Pearland? Món làm theo đơn có cho đặt trên web không?
2. **Tồn kho với Etsy:** món trên web có phải cùng một món đang bán trên Etsy không? Nếu cùng, bán trên web xong chị
   tự giảm số trên Etsy, hay em xin thêm quyền để hệ thống tự giảm?
3. **Phí ship** cho đơn web: miễn phí như Etsy, hay tính theo mức nào?
4. **Thuế:** chỉ thu 8,25% với khách ở Texas, đúng không?
