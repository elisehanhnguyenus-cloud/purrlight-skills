# Sổ bàn giao giữa các lượt tự động của website (viết lại mỗi lượt, dưới 80 dòng)

Cập nhật: 27/11/2026 23:30 giờ Texas (lượt có chị). Kế hoạch: `docs/LAUNCH-PLAN-2026-11-27.md`. Chữ chờ duyệt:
`docs/CHU-CHO-DUYET.md`.

## Nhánh đang làm (nhánh @ commit đã push)
- purrlight-skills `claude/purrlight-studio-website-kcsuen` @ xem `git log -1` (kế hoạch, sổ này, web cũ trên github.io)
- purrlight-web `claude/cart-checkout` @ fab819b (giao kèo v1.1, hàm etsy-catalog, bảng lựa chọn, nháp 3 chính sách)
- purrlight-web `claude/cart-server` @ 3450715 (máy chủ shop v1.1: schema shop, shop-catalog/checkout/webhook)
- purrlight-web `claude/cart-front` @ a320f36 (giỏ hàng trên web: cart.js, cart.html, order/thanks.html)
- Không đụng: `claude/journal-blog` và PR nháp số 1 (phiên Journal).

## Việc theo kế hoạch
| Việc | Trạng thái |
|---|---|
| Giao kèo shop v1.1 | xong 28/11 |
| Kéo dữ liệu món từ Etsy (etsy-catalog, vietdelight.listing_details) | xong, đang chạy trên Supabase từ 28/11 |
| Máy chủ shop (schema shop + 3 hàm) | code xong, test 81 + 78 qua; CHƯA soát độc lập; CHƯA đưa lên Supabase (lượt có chị) |
| Giỏ hàng trên web | code xong, test 129/129 trên điện thoại và máy tính; CHƯA soát độc lập |
| Ghép cart-front + cart-server, test chung (máy chủ giả trong máy) | chưa làm |
| Lịch chạy shop_sync_from_etsy, đồng bộ Etsy dày hơn | chưa làm; đổi lịch database là việc của lượt có chị |
| Trang quản lý (tồn kho, bật tắt món, banner) | chưa làm (tuần 05–11/12) |
| Trang riêng từng món, canonical, ảnh chia sẻ (SEO) | chưa làm (tuần 05–11/12); địa chỉ web để ở một chỗ cấu hình |
| 3 trang chính sách | có bản nháp (drafts/ trên cart-checkout); chưa dựng thành trang |
| CSP cho mọi trang | chưa làm (cần connect-src cho máy chủ Supabase) |
| Hướng dẫn buổi nối Cloudflare, tên miền, Stripe (docs/CUTOVER-RUNBOOK.md) | chưa làm |
| Vòng soát bảo mật độc lập toàn bộ | tuần 12–18/12 |

## Đã soát độc lập
- Sửa trang xác nhận booth: hai vòng đến 9e371e0; bản ffa8f42 chỉ tự test.
- Shop: chưa phần nào.

## Chờ chị (hỏi lần đầu)
1. 27/11 — Tài khoản Cloudflare, Stripe; mua tên miền; đăng nhập connector Cloudflare (hạn theo kế hoạch 04/12).
2. 28/11 — Giá web lấy đúng giá Etsy hay giá riêng.
3. 28/11 — Lựa chọn "Custom/Customize" ẩn khỏi giỏ, đi qua Custom Orders.
4. 28/11 — 11 câu trong bảng lựa chọn (Tuxedo "From Your Photo", photo charm tràng hạt, kiểu A/B/C, Saint Joan…).
5. 28/11 — 2 món mới trên Etsy có lên web không.
6. 28/11 — Duyệt chữ G1, G2, G3, G4 trong docs/CHU-CHO-DUYET.md.
7. 28/11 — Ghi chú bàn giao chính sách (phiên Etsy-shop) nói chị chọn thêm ship nhanh $25 và ô "I agree" trước khi
   trả tiền; giao kèo chưa có. Chờ chị xác nhận trong cuộc trò chuyện này rồi mới làm.
8. Đưa schema shop và 3 hàm lên Supabase: làm ở lượt có chị, sau khi soát độc lập.

## Lệch đã biết (không báo lại)
- 12 món vào giỏ được: giá trên web thấp hơn Etsy (đa số lệch $2), chờ chị quyết (28/11). Web khóa tới 25/12.
- Etsy ghi tồn 1–3: Woodland và cừu mỗi loại 1; hươu, ngựa mỗi màu 1; vịt 2; elf mỗi kiểu 2; túi ruy băng 3.
- Listing 4441155057 là phí ship quốc tế, không phải món.

## Phát hiện bảo mật chưa sửa
- Chưa có CSP trên các trang (thấp).
- Sveltia CMS của trang admin ghim 0.233.0 (chưa thấy cảnh báo bảo mật).

## Lịch tự động (bắn vào chính cuộc trò chuyện này)
- trig_014hhZnxwbDv7DSSDrLgcGCg ca đêm 03:07 rạng sáng thứ Hai, Ba, Sáu, Bảy (lần đầu 28/11)
- trig_01NCH3gkDjDrfEDkr8vE8Yrd soát bảo mật 03:07 rạng sáng thứ Năm (lần đầu 03/12)
- trig_01LTe1ppfw8xwwkeRvvWdmTV báo cáo tuần 06:47 sáng thứ Hai (lần đầu 30/11)
- trig_018aryJjVv3DESTfr5jiVYog một lần 19/12 06:45 · trig_01RFVy2sQdW3GmtEfVZhJHu9 một lần 26/12 06:45
- trig_01LWkQan85V8dUWaxCFVpeDh một lần 02/01/2027 06:45
- Lượt tự động: Supabase chỉ đọc, không đưa gì lên, không đụng main. Chị nhắn "tạm dừng lịch đêm" để dừng.
