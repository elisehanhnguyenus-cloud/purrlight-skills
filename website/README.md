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
├── deploy-pages.sh   # ★ Deploy lại lên GitHub Pages: bash website/deploy-pages.sh
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
    └── img/          # Minh họa SVG (brand art, tile "soon")
        └── etsy/     # ★ ẢNH LISTING THẬT tải từ Etsy — tên file = listing id (vd 4337395489.jpg)
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

## Trạng thái online (15/10/2026)

- **Site đang chạy trên GitHub Pages:**
  https://elisehanhnguyenus-cloud.github.io/purrlight-skills/
  (branch `gh-pages` = bản copy của `website/` + `.nojekyll`; không chứa
  README/script nội bộ). GitHub tự bật Pages khi branch `gh-pages` xuất hiện.
- **Deploy lại sau khi sửa:** commit code, rồi chạy `bash website/deploy-pages.sh`
  (copy `website/` sang `gh-pages` và push; Pages cập nhật sau 1–2 phút).
- **Domain riêng purrlight.studio:** khi sẵn sàng, thêm file `CNAME` (nội dung
  `purrlight.studio`) vào branch `gh-pages` và trỏ DNS theo GitHub Pages
  (Settings → Pages → Custom domain). `publicBaseUrl` của Event Desk tự lấy theo
  URL đang chạy (https) nên không cần điền tay.

## Catalog — nguồn sự thật

- `js/products.js` lấy giá / link / ảnh / facts từ **RSS feed của shop Etsy**
  (`https://www.etsy.com/shop/VietDelightFinds/rss`) ngày 15/10/2026. Feed chỉ
  đưa **10 listing mới nhất** → site có 10 món; listing còn lại của shop chưa
  lên (trang Etsy chặn bot, không kéo tự động được). Thêm món: copy một block
  trong `products.js`, dán link listing, tải ảnh vào `assets/img/etsy/`.
- Giá trên site = giá hiển thị của listing (giá thấp nhất khi listing có
  variation). Phần cộng thêm (size 10 in, long-pile fur +$20…) ghi trong
  `details` và chọn trên Etsy — site không có dropdown giá.
- Đã đối chiếu 10/10 món với listing (15/10, mỗi món một agent kiểm tra).
  4 món có facts ngoài listing, đã sửa: Founding Fathers → chỉ là búp bê
  **George Washington** (Jefferson & Franklin "join in 2026"); British
  Shorthair → **phụ kiện** tháo được (không phải bộ đồ), bỏ dòng care vì
  listing không ghi; "Large Crochet Horse" → listing là ngựa **đan** (knitted);
  custom pet Grand → "cat (or other pet)", **16–21 in** theo tiêu đề listing.
  Riêng "made from your photos" ở custom pet là quy trình đã duyệt 25/09 (chưa
  ghi trên listing Etsy — nên thêm vào listing).
- **Cần chị xem phía Etsy** (lệch Brand Canon / Hard Rules — site KHÔNG copy
  theo): (1) listing ngựa 4368649382 dùng "magical", "hypoallergenic",
  "child-safe", "for kids / toddlers / nursery"; (2) listing dragon pattern
  4399784660 ghi credit "Pattern by Anna_Crochet" — xác nhận quyền bán/license
  trước khi giữ trên site; tiêu đề "Plush Toy… Nursery Decor" cho một file PDF;
  (3) listing British Shorthair 4337895128 mở đầu "Crochet pattern for…" dù là
  sản phẩm vật lý; (4) giá custom pet Grand trên Etsy $150 vs bảng giá booth
  25/09 (Grand cat $90–120) — khác kênh có chủ ý, hay cần đồng bộ?

## Việc còn lại trước khi "launch" (checklist cho Elise)

1. **Listing còn lại** — gửi link từng listing (hoặc CSV từ Shop Manager →
   Listings → Download) để thêm vào site. Collection "Little Things" và
   "Heritage & Celebration" vẫn là tile "soon" tới khi có listing.
2. **Link TikTok** — xác minh handle trong `TIKTOK_SHOP_URL` (đang là
   @purrlightstudio theo Canon v2); mọi link TikTok trên site đọc từ đó.
3. **Newsletter** — form chưa nối backend (hiện chỉ hiện thông báo trung
   thực). Khi sẵn sàng, nối Klaviyo/Mailchimp form action trong `main.js`
   (đã đánh dấu TODO).
4. **Testimonials** — section đã GỠ (Brand Fix 24/08: cấm quote SAMPLE).
   Chỉ đưa lại khi có review Etsy thật (nguyên văn, kèm tên buyer viết tắt).
5. **Video lifestyle** — 3 card đang trỏ về TikTok profile với poster minh
   họa. Khi có video thật: thay href bằng link video hoặc nhúng embed.
6. **Social handles** — @purrlightstudio là của mình trên TikTok / Facebook /
   Pinterest (Canon v2); handle Instagram thuộc người khác nên site KHÔNG
   link Instagram. Pinterest/Facebook đang hard-code ở section social — xác
   nhận tài khoản tồn tại.
7. **Purrks Points** — đang gắn badge "launching soon" (đúng sự thật vì
   chưa có chương trình). Khi nào chạy thật (Shopify + Smile.io, hoặc thủ
   công qua email) thì bỏ badge và cập nhật mô tả. KHÔNG bỏ badge trước đó.
8. **Partner program** — trang partners.html hướng creators vào TikTok
   Shop affiliate. Cần: (a) bật Open Collaboration trong TikTok Shop seller
   center và đặt commission rate, (b) xác nhận hộp thư hello@purrlight.studio
   đã hoạt động (email canon, chưa test).
9. **Event Desk** — xem mục riêng ở trên (hộp thư, permit thuế, gửi thử
   trên điện thoại thật). Trên Pages, Link + QR đã hoạt động.

## Nguyên tắc nội dung (đã tuân thủ, đừng phá khi sửa)

- KHÔNG ghi "Handmade in USA" / "Made in USA" — sản xuất bởi artisan
  Việt Nam. Copy hiện tại: "Designed in Pearland, Texas · handcrafted in
  small batches with our artisan partners in Vietnam" — trung thực và đúng
  chuẩn FTC.
- KHÔNG dùng tên có rủi ro trademark (vd: "Anne of Green Gables" → trên site
  là "Red-Braid Storybook Doll Set"; nhân vật public domain như Bennet/Darcy,
  George Washington thì được).
- KHÔNG có review/press bịa — chưa có thật thì không đưa lên.
- KHÔNG claim "eco-friendly/organic/hypoallergenic" khi chưa có chứng nhận.
- Tee POD chỉ ghi "Printed to order" — khi đã chốt POD partner in tại Mỹ
  (Printful/Printify) thì mới được thêm "in the USA".
- Trang About có câu "paid fairly and never rushed" về artisan partners —
  giữ được vì là cam kết thật của nhà, nhưng chị xác nhận lại trước khi publish.
- Facts sản phẩm (size, chất liệu, ship từ đâu, care) CHỈ lấy từ listing Etsy
  tương ứng (xem mục Catalog). Không thêm claim ngoài listing ("no small
  parts", "hypoallergenic", "child-safe"…) dù listing khác có ghi.
- Vận chuyển: phần lớn SKU ship thẳng từ xưởng Nha Trang (DDP), một số món
  tồn kho ship từ Pearland — copy trên site đã ghi đúng như vậy (30/09);
  KHÔNG ghi "ships from Texas" cho toàn bộ.

## Design tokens

Đổi màu thương hiệu tại `:root` trong `css/style.css`:
`--cream` (nền), `--ink` (chữ), `--glow` (peach — màu nhấn chính),
`--night` (lilac), `--sage`, `--butter`, `--blush`.
