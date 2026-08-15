# Purrlight Studio — Website bán hàng

Website tĩnh (static site) cho Purrlight Studio LLC, thiết kế theo cảm hứng
Jellycat (ấm áp, tinh nghịch, bo tròn) × Mushie (tối giản, pastel dịu, nhiều
khoảng trắng).

## Cấu trúc

```
website/
├── index.html        # Trang chủ: hero, danh mục, favorites, video lifestyle,
│                     #   Companion Club, testimonials, Purrks Points, social strip
├── shop.html         # Trang shop: lưới sản phẩm + lọc theo danh mục
├── product.html      # Trang chi tiết sản phẩm (đọc ?id=... từ URL)
├── about.html        # Câu chuyện thương hiệu
├── partners.html     # Partner/affiliate program cho shopper curators
├── css/
│   ├── fonts.css     # Font self-host: Fraunces (heading) + Figtree (body)
│   └── style.css     # Toàn bộ style — design tokens ở đầu file (:root)
├── js/
│   ├── products.js   # ★ DỮ LIỆU SẢN PHẨM — sửa giá/tên/mô tả ở đây
│   └── main.js       # Nav mobile, render sản phẩm, lọc, trang chi tiết
└── assets/
    ├── fonts/        # File .woff2 (đã tải sẵn, có subset tiếng Việt)
    └── img/          # Minh họa SVG — thay bằng ảnh thật khi có
```

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
6. **Testimonials** — 3 quote trên trang chủ đang là SAMPLE có đánh dấu
   `[SAMPLE — paste a real Etsy review here]`. BẮT BUỘC thay bằng review
   Etsy thật (nguyên văn, kèm tên buyer viết tắt) trước khi publish.
7. **Video lifestyle** — 3 card đang trỏ về TikTok profile với poster minh
   họa. Khi có video thật: thay href bằng link video hoặc nhúng embed.
8. **Social handles** — Instagram/Pinterest đang là placeholder
   `purrlightstudio`. Đăng ký đúng handle rồi sửa link (6 chỗ ở section
   social + 3 nút follow).
9. **Purrks Points** — đang gắn badge "launching soon" (đúng sự thật vì
   chưa có chương trình). Khi nào chạy thật (Shopify + Smile.io, hoặc thủ
   công qua email) thì bỏ badge và cập nhật mô tả. KHÔNG bỏ badge trước đó.
10. **Partner program** — trang partners.html hướng creators vào TikTok
    Shop affiliate (kênh duy nhất đang khả thi vì bán qua Etsy không tự
    chạy affiliate được). Cần: (a) bật Open Collaboration trong TikTok
    Shop seller center và đặt commission rate, (b) sửa email
    hello@purrlightstudio.com thành email thật.
11. **Domain + hosting** — site tĩnh 100%, deploy được ngay lên GitHub
    Pages / Netlify / Cloudflare Pages, không cần server.

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
- Các chi tiết an toàn sản phẩm ("no small parts", "breakaway buckle") lấy theo
  listing hiện tại — đối chiếu từng sản phẩm thật trước khi publish.

## Design tokens

Đổi màu thương hiệu tại `:root` trong `css/style.css`:
`--cream` (nền), `--ink` (chữ), `--glow` (peach — màu nhấn chính),
`--night` (lilac), `--sage`, `--butter`, `--blush`.
