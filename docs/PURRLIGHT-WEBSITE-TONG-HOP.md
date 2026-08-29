# Purrlight Studio Website — Tài liệu tổng hợp dự án

> Phiên làm việc Claude Code · Tháng 8/2026
> Branch: `claude/purrlight-studio-website-kcsuen` · Thư mục: `website/`
> Preview tương tác: https://claude.ai/code/artifact/d5b2cc94-195e-4f79-a85a-e7ff791a605b

---

## 1. Tóm tắt dự án

Website bán hàng tĩnh (static site) cho **Purrlight Studio LLC** (Pearland, TX) —
handmade dolls, baby keepsakes, keychains, pet accessories, POD tees. Thiết kế
theo cảm hứng **Jellycat × Mushie**, checkout dẫn về Etsy (kênh chính hiện tại),
sẵn sàng deploy lên GitHub Pages / Netlify / Cloudflare Pages.

**Bối cảnh trước khi làm:** lo ngại trademark tên "Purrlight" → đã kiểm tra
USPTO (gián tiếp) + thị trường: không có xung đột; tên gần nhất là Purrly,
Purrlife, Purrlux — khác tên, phần lớn khác ngành. Khuyến nghị: tự search
tmsearch.uspto.gov 5 phút để xác nhận, và cân nhắc nộp trademark cho chính
"Purrlight Studio" (~$250–350/class).

## 2. Kiến trúc & tech

```
website/
├── index.html        # Home: hero → trust bar → categories → favorites →
│                     #   video lifestyle → story → Companion Club → values →
│                     #   testimonials → Purrks Points → why-Purrlight →
│                     #   social strip → newsletter
├── shop.html         # Lưới sản phẩm + filter chip theo danh mục (?cat=...)
├── product.html      # PDP template (?id=...), addon "make it a set",
│                     #   accordion (Details / Shipping / The Purrlight Promise)
├── about.html        # Câu chuyện thương hiệu
├── partners.html     # Affiliate landing cho shopper curators (TikTok Shop)
├── css/fonts.css     # Fraunces + Figtree self-host (có subset tiếng Việt)
├── css/style.css     # Design tokens ở :root + toàn bộ style
├── js/products.js    # ★ Catalog 12 SP — giá, mô tả, addons, link Etsy
├── js/main.js        # Nav mobile, render card, filter, PDP logic, addons
└── assets/img        # 23 minh họa SVG đồng bộ (placeholder ảnh + brand art)
```

- **Không backend, không build step** — mở file là chạy; JS thuần (ES5-safe).
- Font self-host (~400KB woff2) — không phụ thuộc CDN.
- Toàn bộ ảnh sản phẩm hiện là **minh họa SVG có chủ đích** (bộ nét vẽ đồng
  nhất: pastel blob + line-art + sparkle) — thay bằng ảnh thật khi có.

## 3. Design system

| Token | Giá trị | Vai trò |
|---|---|---|
| `--cream` | `#FBF6EE` | Nền chính (ấm — chất Jellycat) |
| `--cream-deep` | `#F6EEE1` | Panel/section nền phụ |
| `--card` | `#FFFDF9` | Nền card |
| `--ink` | `#4A423B` | Chữ chính, footer |
| `--ink-soft` | `#6F655B` | Chữ phụ (đạt 4.5:1 mọi nền cream) |
| `--glow` | `#E8A87C` | Peach — màu nhấn chính, nút CTA |
| `--accent-text` | `#9C5325` | Accent chữ nhỏ (≥4.5:1) |
| `--accent-large` | `#C4763F` | Accent chữ lớn (≥3:1) |
| `--night / --sage / --butter / --blush` | lilac/xanh/vàng/hồng pastel | Phân vai theo danh mục |

- **Typography:** Fraunces (heading — họ hàng Ovo của Mushie, ấm hơn) +
  Figtree (body — đúng font Mushie dùng).
- **Hình khối:** bo tròn 12–32px, nút pill, hover nhấc card (Jellycat);
  khoảng trắng rộng, nút chữ thường (Mushie).
- **Motif:** mèo ngủ trên trăng lưỡi liềm + sao ✦ — "purr light".

**Tỉ lệ cảm hứng (phân tích theo lớp):** typography ~80% Mushie · cấu trúc
trang ~70% Mushie · màu ~65% Jellycat · hình khối & motion ~70% Jellycat ·
giọng copy ~70% Jellycat · minh họa/mascot ~80% Jellycat.
**Tổng thể ≈ 50/50 — "khung xương Mushie, linh hồn Jellycat".**

## 4. Nhật ký các đợt làm việc

### Đợt 1 — Dựng site 4 trang
- Nghiên cứu design tokens thật của Mushie (crawl CSS: font Ovo/Figtree,
  palette trung tính ấm) + ngôn ngữ Jellycat.
- Vẽ 20 SVG minh họa bằng generator Python (đồng bộ style), tinh chỉnh qua
  2 vòng screenshot.
- Catalog 12 sản phẩm theo dòng hàng thật của shop, giá theo khung Etsy.

### Đợt 2 — Review & vá lỗi (14 findings accessibility + compliance)
Lỗi đã vá — **đây là danh sách quan trọng khi so sánh với bản Claude Design**
(bản nào cũng phải qua được các mục này):
1. Contrast nút CTA chính (trước: trắng/peach 2.03:1 → nay ink/peach 4.84:1)
2. Contrast giá sản phẩm trên card (2.76:1 → 5.2:1)
3. Contrast label danh mục, kicker, badge, breadcrumb, footer (6 nhóm)
4. Mobile nav drawer đóng vẫn nằm trong tab order (→ visibility toggle)
5. Nút "Shop on Etsy" mobile không ẩn được do specificity CSS
6. Logo "Purrlight" bị tách chữ do flex gap
7. Drawer mobile hiện đè nội dung do backdrop-filter làm containing block
8. Heading hierarchy (shop thiếu h2, footer h4 → h2)
9. Alt ảnh card trùng tiêu đề (→ alt="")
10. Copy compliance: bỏ "Printed to order in the USA" (POD chưa chốt),
    bỏ social proof tự bịa trong mô tả baptism

### Đợt 3 — Mở rộng theo yêu cầu Elise
- **Video Lifestyle** (Mushie-style): 3 card poster minh họa → TikTok
- **Testimonials**: 3 quote ⚠️ SAMPLE có đánh dấu — PHẢI thay review Etsy thật
- **The Companion Club** (Jellycat-style): Dozer · Juniper · Clover · Poppy · Moonbeam
- **Purrks Points**: rewards 3 bước, badge "launching soon" (trung thực)
- **Social strip**: Instagram/Pinterest/TikTok (handle placeholder)
- **partners.html**: affiliate landing cho shopper curators

### Đợt 4 — Học từ đối thủ Little Forest Animals (teardown)
Phân tích littleforestanimals.com (Shopify theme Prestige, 31 SP, $41–$3.277,
stockists thật: Harrods/Bergdorf/Nordstrom/Bloomingdale's; domain 10/2021):
- **Điểm mạnh họ:** kiến trúc nông có chủ đích (5 collection, đường thẳng
  hero→PDP), variant = bundle (+31% AOV), 28 ảnh cho flagship, thang giá
  $41→$3.277, logo stockists link ra trang retailer thật, Klarna trả góp,
  exit popup mã "STORYBEGINS", Microsoft Clarity.
- **Điểm yếu họ:** zero review/social proof toàn site, trust bar overclaim
  ("3 days worldwide", "return 2 năm lấy 30%"), social bỏ hoang (FB 69
  followers) trong khi chạy ads, GTranslate dịch máy, page nặng.
- **Đã áp vào Purrlight (đợt này):**
  1. **Trust bar** 3 icon dưới hero — KHÔNG overclaim: "Handmade in small
     batches / Ships from Pearland, Texas / Made to order, honestly"
  2. **Bundle addons** "make it a set" trên PDP (3 SP đầu: doll +keychain
     $15, baptism +bunny $25, cat +fish toy $12) — giá đổi động; Etsy
     listing phải có variation khớp trước khi publish
  3. **"The Purrlight Promise"** — đổi tên accordion Care theo kiểu đặt tên
     chính sách như lời hứa

## 5. Nguyên tắc compliance (Hard Rules — KHÔNG phá khi sửa)

- KHÔNG "Handmade/Made in USA" — sản xuất artisan Việt Nam. Copy chuẩn:
  "Designed in Pearland, Texas · handcrafted with our artisan partners in Vietnam"
- KHÔNG tên trademark rủi ro ("Anne of Green Gables" → "Storybook Red-Braid Doll")
- KHÔNG review/press/số liệu bịa — sample phải đánh dấu rõ
- KHÔNG "eco-friendly/organic/hypoallergenic" khi chưa có chứng nhận
- Purrks Points giữ badge "launching soon" đến khi chương trình chạy thật
- Tên "Purrks" nên check nhanh USPTO trước khi in ấn lớn

## 6. Checklist trước khi publish

1. ☐ Sửa `ETSY_SHOP_URL` + `etsyUrl` từng sản phẩm (js/products.js)
2. ☐ Đối chiếu giá từng listing thật
3. ☐ Thay 3 quote SAMPLE bằng review Etsy thật (nguyên văn)
4. ☐ Tạo variation Etsy khớp với addon "make it a set" (3 SP)
5. ☐ Thay ảnh SVG bằng ảnh chụp (vuông ≥1200px)
6. ☐ Đăng ký + sửa handle Instagram/Pinterest
7. ☐ Thay video poster bằng video/embed thật
8. ☐ Nối newsletter vào Klaviyo/Mailchimp (TODO trong main.js)
9. ☐ Bật TikTok Shop Open Collaboration + đặt commission (sau khi check margin
   floor: dolls 55% / pet 50% / POD 35% / keychain 60%)
10. ☐ Sửa email hello@purrlightstudio.com thành email thật
11. ☐ Xác nhận câu "paid fairly" + các claim an toàn ("no small parts",
    "breakaway buckle") đúng thực tế
12. ☐ Chọn hosting (GitHub Pages / Netlify / Cloudflare Pages) + domain

## 7. Chiến lược Affiliate (tóm tắt)

- **Sự thật nền tảng:** bán qua Etsy không tự chạy affiliate riêng được
  (Etsy affiliate là của Etsy, qua Awin, trả cho publisher — không target
  shop cụ thể).
- **Kênh khả thi ngay:** TikTok Shop affiliate (account đã approved) — bật
  Open Collaboration, creator tự gắn sản phẩm, TikTok tracking + trả tiền.
- **Đề xuất khởi điểm:** 15% flat (định tính — chốt sau khi tính margin từng
  SKU theo floor ở mục 6.9).
- **LTK/ShopMy:** cần checkout riêng (Shopify) — roadmap sau.
- Landing: `partners.html` đã sẵn để gửi curators.

## 8. Khung so sánh "Claude Code vs Claude Design" (để chọn bản tốt nhất)

Chấm cả 2 bản theo 6 nhóm, thang 1–5. Bản Claude Code đã pass sẵn nhóm C/D/E
(qua review + vá 14 lỗi); bản Claude Design cần chạy qua cùng bộ lọc:

| Nhóm | Tiêu chí chấm | Code | Design |
|---|---|---|---|
| A. Cảm xúc thương hiệu | Đúng vibe Jellycat×Mushie? Motif purr-light? Nhìn 3 giây có nhớ không? | | |
| B. Cấu trúc bán hàng | Trust bar, thang sản phẩm, bundle/AOV, CTA rõ, đường đến Etsy ngắn | | |
| C. Kỹ thuật | Responsive 320→1920, không lỗi JS, tốc độ tải, semantic HTML | | |
| D. Accessibility | Contrast AA (danh sách 14 mục ở phần 4-Đợt 2), keyboard, focus | | |
| E. Compliance | Không claim sai (mục 5), sample có đánh dấu, không review bịa | | |
| F. Khả năng bảo trì | Sửa giá/sản phẩm dễ không? Tách data khỏi giao diện? Có README? | | |

**Cách ghép bản tốt nhất:** thường bản Design thắng ở A (ý tưởng hình ảnh),
bản Code thắng ở B–F (đã qua kiểm định). Chiến lược ghép: giữ khung Code,
"cấy" các ý tưởng hero/section thắng điểm từ bản Design vào. Gửi bản Design
(link/file/screenshot) vào phiên Claude Code để chạy đối chiếu tự động
từng tiêu chí.

## 8b. Đợt 5 — So sánh Claude Code vs Claude Design + graft Merlin canon

**Kết quả chấm (thang 5):** Code 28/30 · Design 19.5/30 — nhưng Design thắng
tuyệt đối ở "cảm xúc thương hiệu" nhờ xây trên brand world Merlin.

**Phát hiện then chốt:** bản Claude Design dùng CANON V1 SAI ("Merlin the
Wizard Cat" + 12 flower fairies tự chế). Canon v2 chuẩn (Elise đã sửa 5/2026):
Merlin = Curious Tuxedo Cat, beret xanh, "the cat who takes notes"; nhân vật
phụ là Tâm/Bánh Mì/Mochi. Wizard framing còn dính rủi ro TOS Etsy.

**Đã graft vào khung Code (theo canon v2 chuẩn):**
1. Mascot art đổi thành Merlin tuxedo + beret xanh (hero, Sleepy Merlin Plush,
   Merlin Moon Keychain) — có single white whisker má trái (easter egg canon)
2. Section "Meet Merlin & friends": Merlin + Tâm/Bánh Mì/Mochi (joining soon)
3. Hero mới: "Where every stitch tells a story" + "Sketched by Merlin,
   stitched by us"
4. "Why Purrlight" + About viết lại theo origin story v2 (rainy October,
   suitcase, notebook, đèn worktable; ký tên Mama Purr & Papa Purr)
5. Journal "From Merlin's notebook" (3 bài — link TikTok đến khi có blog)
6. Newsletter → "Letters from Merlin"
7. Strip "Personalization & corporate gifting" (ý tưởng ăn tiền từ Design)
8. Token màu mới --beret #7FA3CC + badge "The Original"

**Cấu trúc chapter (twist giữ lại theo yêu cầu Elise):** trang chủ đọc như
cuốn sách của Merlin — Chapter One "a cat with a tiny suitcase" (hero) →
Two "the collections" → Three "from the worktable" → Four "the making" →
Five "two homes, one story" → Six "the studio family" → Seven "kind words"
→ Epilogue "Letters from Merlin". Shop: "Every piece is a chapter."

**Lỗi bản Design KHÔNG mang theo:** chữ trắng trên nền sáng 1.43:1, cart giả
"Bag (0)", không có đường ra Etsy, "Anne of Green Gables" ×3, announce
"Handcrafted with love in Texas" (FTC), "Free US shipping $75+" chưa xác minh.

## 8c. Đợt 6 — Thực thi Website Brand Fix Brief (Brand Canon v2 — 17/08, Elise duyệt 24/08)

Nguồn: Notion "🔧 Website Brand Fix Brief" + "🎨 Brand Canon v2" + Brand Book artifact.
- **Logo master**: header dùng logo flat chính thức (trích từ Brand Book, không vẽ lại);
  favicon = icon Merlin 32/64px. ⚠️ Ở 16px icon outline mỏng — chờ "bản filled"
  từ designer (đã ghi nợ trong Canon).
- **Merlin canon v2.1**: beret vàng nghệ #CA8D41 + sao thêu, yếm sage #93A898 +
  tim đỏ gạch #A9503D, mũi #D29883, lông #2B2724/#F3EAD9; balo olive thay vali.
- **About hai tầng**: Our Story (sự thật, ký Elise Hạnh Nguyễn — dùng elevator
  ~50 từ đã duyệt + dữ kiện canon; TODO thay nguyên văn Part A 02.3 khi có) ·
  Merlin's World (storybook, ký Mama Purr & Papa Purr, đóng khung là truyện).
- **7 collections canon**: 5 active trên filter + Heritage & Celebration,
  Patterns & Printables gắn tile "soon". Gỡ Cat Mom Club Tee (POD generic);
  Whiskers & Moonlight giữ (merch Merlin).
- **Language sweep**: toy/plush/nursery/small-hands → keepsake/heirloom;
  "Ages 3+, with an adult nearby" (theo ngoại lệ CEO duyệt) + dòng an toàn
  chuẩn nguyên văn trên PDP. Gỡ toàn bộ testimonials SAMPLE.
- **Token mới**: --purr-pink #DB426B (nhận diện) · --purr-berry #B42249 (giá,
  chữ nhấn — 6.33:1) · --beret #CA8D41. Taglines: "Made by hand. Made to be
  kept." (footer) · "For one, and for thousands." (Partners) · hero mới
  "A cat with a tiny backpack. A studio with two homes."
- **Email** hello@purrlight.studio · domain đã chốt purrlight.studio.
- **Acceptance checks của Morgan: PASS** (suitcase/7FA3CC/tên cũ/SAMPLE
  reviews/email cũ = 0; "toy" chỉ còn trong dòng an toàn; ages 3+ luôn kèm
  khung người lớn).
- **Còn chờ**: nguyên văn Part A 02.3 · bản filled logo cho favicon 16px ·
  review Etsy thật · minh hoạ storybook 5 pose từ hoạ sĩ.

## 9. Link & tài nguyên

- **Repo branch:** `claude/purrlight-studio-website-kcsuen` (GitHub:
  elisehanhnguyenus-cloud/purrlight-skills)
- **Preview 5 trang:** https://claude.ai/code/artifact/d5b2cc94-195e-4f79-a85a-e7ff791a605b
- **README kỹ thuật:** `website/README.md`
- Tài liệu này: `docs/PURRLIGHT-WEBSITE-TONG-HOP.md` (bản Notion đồng bộ
  cùng nội dung)
