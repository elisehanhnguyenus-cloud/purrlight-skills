# Purrlight Studio — Website bán hàng

Website tĩnh (static site) cho Purrlight Studio LLC, thiết kế theo cảm hứng
Jellycat (ấm áp, tinh nghịch, bo tròn) × Mushie (tối giản, pastel dịu, nhiều
khoảng trắng).

**Brand world: Merlin canon v2** (🎨 Brand Canon v2 trên Notion, 17/08 —
duyệt 24/08/2026): Merlin là CURIOUS TUXEDO CAT — beret vàng nghệ #CA8D41
có sao thêu, yếm sage, ba lô xanh ô-liu, "the cat who takes notes". KHÔNG
phải wizard cat (canon v1 sai đã bị Elise sửa — đừng đưa wizard trở lại).
Nhân vật: Merlin (live) + Tâm, Bánh Mì, Mochi (joining soon). Motif: beret
vàng, single white whisker (má trái), ba lô, notebook, đèn worktable
("purr" + "light"), trăng/sao chỉ dùng trang trí. Email chính thức
hello@purrlight.studio · domain purrlight.studio.
Safe phrases: "From Merlin's notebook", "Sketched by Merlin, stitched by us",
"the cat who takes notes". CẤM: magical/blessed/spell/manifest (TOS Etsy).

## Cấu trúc

```
website/
├── index.html        # Trang chủ (cấu trúc chapter): hero, trust bar, danh mục,
│                     #   favorites, video, story, Meet Merlin & friends,
│                     #   Purrks (launching soon), journal, social, gifting, newsletter
├── shop.html         # Trang shop: lưới sản phẩm + lọc theo danh mục
├── product.html      # Trang chi tiết sản phẩm (đọc ?id=... từ URL)
├── about.html        # Câu chuyện thương hiệu (hai tầng: sự thật / storybook)
├── partners.html     # Partner/affiliate program cho shopper curators
├── event.html        # ★ EVENT DESK — bàn bán hàng tại sự kiện (nội bộ, noindex)
├── confirm.html      # Trang khách mở từ link/QR: thank-you hoặc order confirmation
├── manifest.webmanifest  # "Add to Home Screen" cho event.html trên điện thoại
├── css/
│   ├── fonts.css     # Font self-host: Fraunces (heading) + Figtree (body)
│   ├── style.css     # Toàn bộ style site — design tokens ở đầu file (:root)
│   └── desk.css      # Style riêng cho event.html + confirm.html (nạp sau style.css)
├── js/
│   ├── products.js   # ★ DỮ LIỆU SẢN PHẨM — sửa giá/tên/mô tả ở đây
│   ├── main.js       # Nav mobile, render sản phẩm, lọc, trang chi tiết
│   ├── event-desk.js # ★ EVENT DESK — cấu hình (DESK_CONFIG) + lời văn + logic
│   └── vendor/qrcode.min.js  # QR (MIT, qrcode-generator 1.4.4) — chỉ event.html dùng
└── assets/
    ├── brand/        # logo-flat.png, favicon — KHÔNG vẽ lại, KHÔNG AI-generate
    ├── fonts/        # File .woff2 (đã tải sẵn, có subset tiếng Việt)
    └── img/          # Minh họa SVG — thay bằng ảnh thật khi có
```

## Event Desk — bàn bán hàng tại sự kiện (`event.html`)

Công cụ cho người đứng booth (hội chợ, cat show, parish fair). Mở trên điện
thoại, dùng được **offline** sau khi tải một lần; đơn lưu trên máy
(localStorage). Hai luồng, mỗi luồng sinh ra một tin nhắn cá nhân hoá:

| Luồng | Khi nào | Khách nhận gì |
|---|---|---|
| **Thank you** | mua và cầm về ngay tại booth | thư cảm ơn: tên khách, đúng món, dòng cá nhân, care + safety line, số tiền đã trả |
| **Order** | đặt làm / đặt ship (custom cat, custom doll, made-to-order) | order confirmation: mã đơn, món + tuỳ chọn, tiền/cọc/còn lại, ship-to, timeline dạng khoảng, điều khoản cọc đã duyệt |

**Quy trình tại booth (≈40 giây/khách):** chọn luồng → chạm món (custom cat /
custom doll theo bảng giá 25/09, món catalog, hoặc "Something else" tự gõ giá)
→ tên + email/phone (hoặc bấm *Hand them the phone* cho khách tự gõ) → chạm
cách trả tiền + *full* / *50% deposit* → **Save** → bấm **Email** / **Text**
(mở app Mail/Messages của máy với nội dung điền sẵn — đọc lại rồi gửi; tool
KHÔNG tự gửi) hoặc **Copy** / **Print**. Khi site đã online, có thêm **QR**
để khách quét mở bản của mình (`confirm.html#…`, không chứa email/phone/địa
chỉ đường).

**Cấu hình** — tất cả ở đầu `js/event-desk.js` (`DESK_CONFIG`) và trong nút
⚙ trên trang (tên sự kiện, tên người đứng booth, mã máy, chế độ thuế). Mỗi con
số/câu chữ đều có chú thích nguồn ngay cạnh: bảng giá custom (Elise duyệt
25/09/2026), điều khoản cọc 50% (25/09), lead time 2 tuần / 5 tuần mùa lễ
(25/09), câu "10–14 days once it leaves our workshop" (skill CSKH), dòng
safety nguyên văn (Brand Canon v2).

**Luật đã cài cứng trong tool** (đừng gỡ): không có ô nhập ngày giao — chỉ có
3 lựa chọn timeline dạng khoảng + điều kiện; dòng cá nhân bị chặn nếu chứa từ
cấm (safe/non-toxic, "shipped", "before Christmas", magic, "made in USA"…);
mặc định **không ghi thuế** cho tới khi có Texas Sales and Use Permit; giảm
giá quá 15% bị cảnh báo (chủ trương: hạ size, không hạ giá); Purrks không
được nhắc tới.

**Dữ liệu:** *Export CSV* (nhập Klaviyo/Notion/Sheets — có cột `email_optin`,
`custom_details`), *Backup JSON* + *Merge backup* (gộp log từ máy thứ hai),
*Copy log line* (dán vào 📋 CS Log trên Notion, kênh Event). Bản hosted trên
claude.ai dùng chung một kho đơn cho mọi máy được share.

**Trước sự kiện đầu tiên — bắt buộc:** (1) xác nhận hộp thư
hello@purrlight.studio hoạt động và đăng nhập app Mail trên máy đứng booth
bằng hộp thư đó (thư ký "Elise · Purrlight Studio", khách sẽ *reply* vào
đó để gửi ảnh mèo); (2) chốt trạng thái permit thuế Texas → chọn chế độ thuế
trong ⚙; (3) gửi thử cả hai loại thư từ chính điện thoại của chị (Gmail /
iOS Mail có thể cắt thư quá dài — tool đã nhắc dùng Copy khi > 1.900 ký tự);
(4) điền giá cho 4 món tồn kho Pearland trong `extraItems` nếu muốn có sẵn
(hiện để trống, gõ giá tại booth).

## Việc cần làm trước khi publish (checklist cho Elise)

1. **Link Etsy** — mở `js/products.js`, sửa `ETSY_SHOP_URL` thành link shop
   thật. Điền `etsyUrl` cho từng sản phẩm để nút "Buy on Etsy" trỏ thẳng
   vào listing.
2. **Link TikTok** — sửa `TIKTOK_SHOP_URL` và link TikTok ở footer 4 trang.
3. **Giá** — giá trong `products.js` lấy theo khung giá Etsy hiện tại của
   shop (dolls $19–40+, POD tee $22–28...). Đối chiếu từng listing thật
   trước khi publish.
4. **Ảnh thật** — minh họa SVG hiện tại là placeholder có chủ đích. Khi có
   ảnh chụp sản phẩm (vuông, ≥1200px), bỏ vào `assets/img/` và đổi đường
   dẫn `img` trong `products.js`. Giữ minh họa cho hero/story nếu thích —
   chúng là brand art, không phải placeholder.
5. **Newsletter** — form chưa nối backend (hiện chỉ hiện thông báo trung
   thực). Khi sẵn sàng, nối Klaviyo/Mailchimp form action trong `main.js`
   (đã đánh dấu TODO).
6. **Testimonials** — section đã GỠ (Brand Fix 24/08: cấm quote SAMPLE).
   Chỉ đưa lại khi có review Etsy thật (nguyên văn, kèm tên buyer viết tắt).
7. **Video lifestyle** — 3 card đang trỏ về TikTok profile với poster minh
   họa. Khi có video thật: thay href bằng link video hoặc nhúng embed.
8. **Social handles** — @purrlightstudio là của mình trên TikTok / Facebook /
   Pinterest (Canon v2); handle Instagram thuộc người khác nên site KHÔNG
   link Instagram. TikTok lấy từ `TIKTOK_SHOP_URL` (attribute `data-tiktok`);
   Pinterest/Facebook đang hard-code 4+1 chỗ ở section social — xác nhận tài
   khoản tồn tại trước khi publish.
9. **Purrks Points** — đang gắn badge "launching soon" (đúng sự thật vì
   chưa có chương trình). Khi nào chạy thật (Shopify + Smile.io, hoặc thủ
   công qua email) thì bỏ badge và cập nhật mô tả. KHÔNG bỏ badge trước đó.
10. **Partner program** — trang partners.html hướng creators vào TikTok
    Shop affiliate (kênh duy nhất đang khả thi vì bán qua Etsy không tự
    chạy affiliate được). Cần: (a) bật Open Collaboration trong TikTok
    Shop seller center và đặt commission rate, (b) xác nhận hộp thư
    hello@purrlight.studio đã hoạt động (đang là email canon, chưa test).
11. **Domain + hosting** — site tĩnh 100%, deploy được ngay lên GitHub
    Pages / Netlify / Cloudflare Pages, không cần server. Domain đã chốt:
    purrlight.studio. Ngày site online: điền `publicBaseUrl` trong
    `js/event-desk.js` để Event Desk hiện Link + QR cho khách.
12. **Event Desk** — xem mục riêng ở trên (hộp thư, permit thuế, gửi thử
    trên điện thoại thật).

## Nguyên tắc nội dung (đã tuân thủ, đừng phá khi sửa)

- KHÔNG ghi "Handmade in USA" / "Made in USA" — sản xuất bởi artisan
  Việt Nam. Copy hiện tại: "Designed in Pearland, Texas · handcrafted in
  small batches with our artisan partners in Vietnam" — trung thực và đúng
  chuẩn FTC.
- KHÔNG dùng tên có rủi ro trademark (vd: "Anne of Green Gables" → đã đổi
  thành "Storybook Red-Braid Doll").
- KHÔNG có review/press bịa — chưa có thật thì không đưa lên.
- KHÔNG claim "eco-friendly/organic/hypoallergenic" khi chưa có chứng nhận.
- Tee POD chỉ ghi "Printed to order" — khi đã chốt POD partner in tại Mỹ
  (Printful/Printify) thì mới được thêm "in the USA".
- Trang About có câu "paid fairly and never rushed" về artisan partners —
  giữ được vì là cam kết thật của nhà, nhưng chị xác nhận lại trước khi publish.
- Mặt búp bê ghi **hand-painted** (sự thật sản phẩm theo skill CSKH, 8/2026);
  đã bỏ claim "no small parts" (chưa kiểm chứng). "Breakaway buckle" ở collar
  vẫn lấy theo listing — đối chiếu sản phẩm thật trước khi publish.
- Vận chuyển: phần lớn SKU ship thẳng từ xưởng Nha Trang (DDP), một số món
  tồn kho ship từ Pearland — copy trên site đã ghi đúng như vậy (30/09);
  KHÔNG ghi "ships from Texas" cho toàn bộ.

## Design tokens

Đổi màu thương hiệu tại `:root` trong `css/style.css`:
`--cream` (nền), `--ink` (chữ), `--glow` (peach — màu nhấn chính),
`--night` (lilac), `--sage`, `--butter`, `--blush`.
