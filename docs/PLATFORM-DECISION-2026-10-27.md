# Có nên chuyển web sang WordPress / Cloudflare? (27/10/2026)

Chị hỏi: "có nên up toàn bộ giao diện kết nối sang hệ thống của WordPress, Cloudflare không? … dashboard quản lý của em
tạo nó không hoàn thiện và không tối ưu bằng WordPress", khi sau này muốn kết nối Amazon (Seller Central, KDP, sàn
chính), Etsy, Faire, Walmart, eBay, Target, X, YouTube, Mercari, Facebook, Instagram, thanh toán Stripe/PayPal/Square và
nhiều SaaS khác như bộ Purrlight (Claude + các connector) hiện tại.

Bản nghiên cứu đầy đủ, có nguồn từng con số: `docs/PLATFORM-RESEARCH-2026-10-27.md` (tiếng Anh). Ba hướng tra cứu
(hệ thống hiện có trong repo; từng sàn chị liệt kê; WordPress / Shopify / Cloudflare), hai người kiểm chứng lại giá
và luật trên trang chính thức. Giá và luật các sàn đổi thường xuyên: kiểm lại trước khi trả tiền.

## Trả lời ngắn

**Không chuyển sang WordPress. Cloudflare không thay được WordPress: Cloudflare là chỗ đặt web (hosting), không phải
cửa hàng.** Nên làm:

1. **Giữ web hiện tại làm mặt tiền**, chuyển chỗ đặt từ GitHub Pages sang Cloudflare (miễn phí) với tên miền riêng.
   Lý do thật sự cần chuyển: luật của GitHub Pages ghi rõ không cho dùng để chạy việc kinh doanh online / trang
   thương mại điện tử, mà web mình đã nhận đơn và link tiền cọc.
2. **Thêm Shopify (gói Basic) làm "văn phòng phía sau"** khi chị thật sự mở thêm sàn mới ngoài Etsy và TikTok: nơi
   giữ sản phẩm có sẵn, đơn, tồn kho và nối các sàn. Bắt đầu tháng 1/2027, sau đợt khóa web mùa lễ (15/11–02/01).
3. **Giữ nguyên** Custom Orders (bảng giá, form Tally, cọc Zelle/Square), Event Desk ở booth, và các chốt chặn
   "không gì lên web khi chị chưa duyệt" (check-site, DEPLOY-HOLD).

**Chị nói đúng: "dashboard" chưa hoàn thiện.** Admin Sveltia mới là bản thử (spike 0a) với đúng 1 mục (dải ảnh
follow), và chưa bao giờ được làm để quản lý đơn, tiền hay khách. Cái thiếu không phải một website mới, mà là một
"văn phòng bán hàng" thật. Shopify có sẵn đúng thứ đó, nên em đề xuất dừng làm tiếp admin Sveltia.

## Vì sao không phải WordPress

| Điều chị cần | Web hiện tại + Shopify phía sau | Chuyển hết sang WordPress + WooCommerce |
|---|---|---|
| Nối nhiều sàn | App chính thức, miễn phí: TikTok, Facebook/Instagram, Google/YouTube, Faire. App của chính Shopify nối Amazon, eBay, Walmart, Target Plus. Etsy cần app bên thứ ba. | Amazon, eBay, Walmart, Etsy chỉ có plugin bên thứ ba. Plugin lớn Codisto bị đóng ngày 1/12/2025 vì lỗi bảo mật; CedCommerce chỉ được đánh giá 3,5/5. |
| Thanh toán | Shopify Payments (chạy bằng Stripe), PayPal. Cọc Custom Orders vẫn dùng link Zelle/Square như cũ. | **Hơn ở điểm này:** Stripe, PayPal, Square đều có plugin chính thức. |
| Đơn làm riêng có cọc | Giữ nguyên bảng giá và form đang chạy. | Làm lại từ đầu; plugin cọc $219/năm, bị chấm 2/5. |
| Thời gian của chị | Shopify tự lo máy chủ, có app điện thoại; web tĩnh không phải vá. | Năm 2025 có 11.334 lỗ hổng WordPress mới, 91% nằm ở plugin: phải cập nhật, vá liên tục. |
| Claude làm giúp | Connector Shopify đã có sẵn trong bộ công cụ của em (chưa thử đăng nhập cửa hàng). | Connector cho WooCommerce mới ở dạng thử nghiệm. |
| Duyệt trước khi lên | Giữ được. | Mất: bấm Publish là lên ngay. |

WordPress rẻ tiền mặt hơn một chút và dùng thẳng Stripe/Square, nhưng thua ở mọi thứ tốn thời gian và an toàn của chị.

Bộ Purrlight (Claude + connector) nối với các dịch vụ qua connector, không phụ thuộc web đặt ở đâu.

## Sàn nào nối được, sàn nào không

- **Nối tự động được:** TikTok Shop, Facebook/Instagram (đồng bộ danh mục; Meta đã bỏ thanh toán trong app, khách
  trả tiền trên web mình), eBay, Amazon sàn chính, Etsy (qua app bên thứ ba, phải thử trước trên 10 món).
- **Phải xin duyệt trước:** Amazon Handmade (xét hồ sơ; món do gia đình làm ở Việt Nam có đủ điều kiện không thì
  chưa rõ), Faire, Walmart (cần kho/đổi trả ở Mỹ, gửi thẳng từ Việt Nam không đạt), Target Plus (chỉ khi được
  mời), YouTube Shopping (cần 1.000 người theo dõi và chương trình Partner).
- **Không hệ thống nào tự động được:** Amazon KDP (sách, không có API đăng bài), Mercari (không thấy API chính
  thức), X (chỉ quảng cáo, không có kênh bán).

## Lộ trình đề xuất

| Giai đoạn | Việc | Chi phí/tháng (chưa kể phí thẻ, phí sàn) |
|---|---|---|
| 0. Trước ~5/11, chỉ sau khi chị nói "đưa lên" | Chị mua tên miền và mở tài khoản Cloudflare miễn phí (em không được tạo tài khoản hay trả tiền). Em chuyển web sang, giữ nguyên các chốt chặn, cập nhật một lượt mọi link: Etsy, Linktree, mã QR booth, redirect của Tally và Square. Không kịp thì ở lại github.io qua mùa lễ, tháng 1 chuyển. | $0 + tiền tên miền mỗi năm |
| 1. 15/11–02/01 | Khóa web mùa lễ, không đổi nền tảng. Đồng bộ Etsy chạy đủ đêm để biết món nào bán thật. | $0 |
| 2. Tháng 1/2027 | Thử Shopify Basic: đưa món có sẵn lên, bật app TikTok và Meta, thử 1 app nối Etsy trên ≤ 10 listing. Nút mua trên web thành link thường tới Shopify (không gắn mã Shopify vào web). | khoảng $29–98 |
| 3. Mùa xuân 2027 | Mỗi lần thêm 1 sàn: eBay → Amazon (+ hồ sơ Handmade) → Faire → YouTube khi đủ điều kiện. | + phí từng sàn (vd Amazon Professional $39,99) |

**Bỏ / không làm:** phần tiếp theo của admin Sveltia (22–30 giờ Claude), WooCommerce, CMS mới EmDash của Cloudflare
(chưa có cửa hàng), nút Buy Button có mã Shopify (trừ khi chị đồng ý gắn mã bên ngoài vào web).

**Rủi ro cần canh:** bán trùng món độc nhất nếu app đồng bộ lỗi (Etsy vẫn là nguồn chính cho tới khi app chạy ổn);
thuế Texas 8,25% phải cài lại đúng trong Shopify; luật Etsy về giao dịch ngoài sàn (không để link Shopify hay Custom
Orders trong tin nhắn, listing hay thiệp trong gói hàng cho tới khi kiểm từng chữ); sàn hay đổi luật (Marketplace
Connect đã ngừng nhận kết nối Etsy mới, Codisto đóng, Meta bỏ thanh toán trong app).

**Điều làm em đổi ý:** nếu 2027 chị không mở thêm sàn nào ngoài Etsy và TikTok thì không cần Shopify, chỉ chuyển web
sang Cloudflare ($0). Nếu chị muốn khách trả thẻ ngay trong trang Custom Orders (Stripe/Square) thì WordPress.com gói
Commerce ($45/tháng) đáng cân nhắc hơn WordPress tự cài.

## Câu hỏi cho chị

1. "Dashboard" chị nói là admin Sveltia, Event Desk hay Văn phòng Merlin? Chị muốn tự làm việc gì mà hiện chưa làm được?
2. Năm 2027 chị thật sự định mở 2–3 sàn nào?
3. Món len có để sẵn ở Pearland không, hay món nào cũng gửi từ Việt Nam? (Walmart, Target, Faire, Amazon Handmade phụ thuộc điều này.)
4. Mỗi món là độc nhất hay làm lại được nhiều lần? (Quyết định đồng bộ tồn kho quan trọng tới đâu.)
5. Chị mua được tên miền + mở Cloudflare trước ~5/11 không, hay để tháng 1?
6. Ở booth chị đang nhận thẻ bằng gì?
7. Khoảng $57/tháng hiện tại đang trả cho những gì, và từ tháng 2 có thêm được $30–100/tháng không?
