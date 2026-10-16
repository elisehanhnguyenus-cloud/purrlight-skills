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

1. ☑ (15/10) `ETSY_SHOP_URL` = vietdelightfinds.etsy.com + `etsyUrl` cho 10 món
2. ☑ (15/10) Giá lấy từ RSS feed Etsy, đối chiếu 10/10 món (xem 8f)
3. ☑ Section testimonials đã GỠ (24/08); chỉ đưa lại khi có review thật
4. ☑ Addon "make it a set" đã BỎ (15/10) — variation Etsy chưa xác minh giá
5. ☑ (15/10) Ảnh listing thật từ Etsy cho 10 món (`assets/img/etsy/`); SVG còn lại là brand art
6. ☐ Đăng ký + sửa handle Instagram/Pinterest
7. ☐ Thay video poster bằng video/embed thật
8. ☐ Nối newsletter vào Klaviyo/Mailchimp (TODO trong main.js)
9. ☐ Bật TikTok Shop Open Collaboration + đặt commission (sau khi check margin
   floor: dolls 55% / pet 50% / POD 35% / keychain 60%)
10. ☑ Email canon hello@purrlight.studio (domain cũ = 0 chỗ) — *16/10: tên miền chưa đăng ký, toàn site tạm dùng purrlightstudiollc@gmail.com (8j)*
11. ☐ Xác nhận câu "paid fairly" (About); các claim "no small parts" /
    "breakaway buckle" đã bỏ cùng catalog cũ
12. ☑ (15/10) GitHub Pages: https://elisehanhnguyenus-cloud.github.io/purrlight-skills/ — ☐ domain purrlight.studio (CNAME + DNS)

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

## 8d. Đợt 7 — Event Order Desk (29/09/2026): "thank you for your purchase" + "personalized order confirmation" cho khách tại sự kiện

**Yêu cầu của Elise:** "tạo nhanh 1 tool theo workflow: thank you for your
purchase và purchase online personalized order confirmation, dành cho khách
đặt hàng tại sự kiện. Ưu tiên tính năng này sau đó có thể gắn vào website
chính."

**Cách làm:** workflow 3 pha — (1) 3 reader đọc repo / skill CSKH + ecommerce
/ Notion (67 finding: Booth Kit Cat Show 26–27/09, bảng giá custom duyệt
25/09, điều khoản cọc, lead time thật, Square/Zelle/cash, permit thuế "chưa
có", SOP CS 2027, CS Log có kênh Event); (2) 3 bản thiết kế độc lập (tốc độ
booth · trải nghiệm khách · dữ liệu & bền vững) → 3 giám khảo → tổng hợp;
(3) review đối kháng 4 chiều (canon/luật · tiền & trạng thái · mobile a11y ·
offline/privacy) rồi mới chốt.

**Sản phẩm:** `website/event.html` + `js/event-desk.js` + `css/desk.css`
(bàn bán hàng cho nhân sự đứng booth, offline-first, log trên máy) và
`website/confirm.html` (trang khách mở từ link/QR — nội dung nằm trong hash,
không có email/phone/địa chỉ đường). Bản hosted dùng ngay trên điện thoại:
https://claude.ai/artifact/JDd4fYwxtDvRmpf1UGs5rW — kho đơn dùng chung cho
mọi máy được share (db), xuất CSV/JSON.

**Hai luồng, hai lá thư** (giọng Elise, ký "Elise · Purrlight Studio",
hello@purrlight.studio):
- *Thank you* — khách mua cầm về: tên khách, đúng món (+ dòng story của món
  từ products.js), dòng cá nhân do nhân sự gõ, care line + safety line nguyên
  văn, số tiền đã trả. Không xin review, không nhắc Purrks, không code.
- *Order confirmation* — custom cat/doll hoặc made-to-order: mã đơn
  `E<yymmdd>-<máy>-<số>`, món + size/len/pose/mắt/mã màu, subtotal / giảm /
  "US shipping included" / total / cọc / còn lại, ship-to, timeline dạng
  khoảng + điều kiện, câu xin ảnh thú cưng, điều khoản cọc 50% đúng bản
  Elise duyệt 25/09.

**Số liệu và câu chữ có nguồn** (ghi ngay trong `DESK_CONFIG`): bảng giá
custom cat Petite 40/48/55 · Classic 55/67/79 · Grand 90/105/120 (Yaoh
Cotton / Chenille Velvet / Rabbit Fluff Fur), doll Petite 45/85 · Classic
85/160 · Grand 130/245 (Elise 25/09/2026); lead time 2 tuần, +3 tuần mùa
Tạ ơn–Giáng sinh (Elise 25/09); "typically 10–14 days once it leaves our
workshop, though customs can add time" (skill CSKH); thuế 8.25% (P&L hội
chợ 05/09) nhưng **mặc định không ghi thuế** vì permit chưa có (Booth Kit
18/09); thanh toán Cash / Card (Square) / Zelle (Booth Kit 25/09).

**Luật cài cứng:** không có ô ngày giao; lint chặn dòng cá nhân có từ cấm
(safe/non-toxic/hypoallergenic, shipped, before Christmas…, magic, made in
USA); giảm giá > 15% bị cảnh báo; Purrks vắng mặt; "toy" chỉ trong safety
line; email cũ .com = 0. Bản hosted không có nút Print (host chặn) và không
có QR (trang private, khách không mở được) — hai thứ này chỉ có trên site.

**Việc Elise phải chốt trước sự kiện 11/10 (Vianney):** hộp thư
hello@purrlight.studio hoạt động + app Mail trên máy booth đăng nhập bằng
hộp đó · permit thuế Texas → chọn chế độ thuế · gửi thử 2 lá thư từ điện
thoại thật · giá 4 món tồn kho Pearland (stress ball set, linen doll bag
charm, Americana doll, catnip ball) nếu muốn điền sẵn.

**Review đối kháng đã chạy (4 chiều, 45 phát hiện, tất cả đã đọc và sửa
cái nào thật, mỗi fix có smoke test Playwright):**
- *Canon/luật (12)*: thư cảm ơn ghi tổng thay vì đã trả → sửa + chặn lưu
  Thank-you khi còn balance; điều khoản cọc in cứng "50% now" → lắp từ số
  thật; dòng balance là chính sách chưa duyệt → bỏ; reply rơi vào hộp cá
  nhân → cc hello@purrlight.studio; safety line dán lên áo baptism 0–3m /
  tee POD / PVC → chỉ keepsake handmade; lint mở rộng theo Canon.
- *Tiền/trạng thái (12)*: ngày lệch múi giờ (UTC) ở confirm, két tiền, log
  line → local; số đơn tràn ở 100; sửa đơn mất dấu đã gửi; import JSON xấu
  treo trang; qty trong hash chưa escape; kho chung hồi sinh đơn đã xoá →
  tombstones; offline edit không đẩy lại → dirty set.
- *Mobile/a11y (12)*: tràn 360px; header bóp nút; --ink-faint 2.49:1; focus
  ring/viền input dưới 3:1; ô 15px làm iOS zoom; settings & hand-over không
  phải dialog thật (khách cầm máy vuốt được vào log khách khác); mất focus
  sau mỗi lần render; aria-live quá rộng.
- *Offline/privacy (9)*: boot chết khi localStorage bị chặn (kéo theo
  confirm.html); Clear all hosted xoá cho mọi máy; draft/log restore không
  guard; kho chung nhận doc không validate; lint bỏ sót tên sự kiện; mailto
  không encode địa chỉ; armed() timer chồng.

**Phát hiện ngoài phạm vi (website hiện tại lệch sự thật vận hành):**
(a) `product.html` mục Shipping ghi "Everything ships from our Texas studio"
và announce bar "Ships from Pearland, Texas" — theo skill CSKH, phần lớn SKU
ship thẳng từ Nha Trang (DDP); (b) `products.js` ghi "Embroidered face" cho
búp bê — skill CSKH ghi mặt búp bê hand-PAINTED; (c) README cũ còn beret
xanh/suitcase. **Cả ba đã sửa (Elise yêu cầu 30/09):** announce bar 5 trang →
"Designed in Texas, made in Vietnam"; trust bar + Shipping accordion → "most
pieces ship straight from our Vietnam workshop, duties included; a few
ready-made pieces ship from our Texas studio" + khoảng 10–14 ngày có điều
kiện; mặt búp bê → "Hand-painted face", bỏ "no small parts" (chưa kiểm
chứng). Dòng origin rút thành "Designed in Pearland, Texas · Handmade in
Vietnam" ở 8 chỗ (footer 6 trang, Shipping accordion, About) — Elise quyết
30/09 bỏ "Finished in Texas" vì vênh với việc ship thẳng từ Nha Trang; cần
báo Morgan cập nhật Brand Canon v2 cho khớp.

## 8e. Đợt 8 — Review release-readiness toàn site (09/10/2026): "hoàn tất chưa?"

**Cách làm:** audit máy (8 trang × desktop/mobile: lỗi console, ảnh hỏng, link
hỏng, tràn màn, quét từ cấm) + workflow 4 reviewer (copy nhất quán · canon
hình ảnh · link/luồng · checklist launch đối chiếu code) → 48 phát hiện, tất
cả đã đọc; cái nào là code thì sửa ngay (commit "Website: sửa theo review
release-readiness"), cái nào cần Elise thì liệt kê dưới.

**Đã sửa trong code:** meta description trang chủ + About prose còn
"finished in Texas"; announce bar về đúng dòng origin canon; footer dùng
`logo-flat.png` thật; care/safety line gắn theo từng món (`NOT_HANDMADE`,
`SAFETY_LINE_SKIP` trong products.js, Event Desk dùng chung); 4 link
Instagram gỡ (handle IG không phải của mình) → TikTok/Facebook; Purrks không
hứa thưởng review; nút "join the waitlist" → "follow along on Etsy" (form
chưa nối backend); journal là thẻ "coming soon", bỏ số bịa; desc Storybook
doll khớp hand-painted; bỏ "no plastic parts" ở felt fish; `?id` lạ → trang
"không tìm thấy"; giá PDP màu berry; Contact us → mailto; TikTok link lấy từ
một hằng số.

**Kết luận trạng thái (09/10):** *code-complete, chưa launch-complete.* Trang
chạy sạch (0 lỗi, 0 link hỏng, 0 tràn, 0 từ cấm) nhưng còn các mục chỉ Elise
làm được — xem checklist mục 6 (đánh dấu lại bên dưới).

**Checklist launch còn mở (theo thứ tự chặn):**
1. ✅ (15/10, 8f) `ETSY_SHOP_URL` + 10 `etsyUrl` thật.
2. ✅ (15/10, 8f) Giá theo listing Etsy; addon bỏ.
3. ✅ (15/10, 8f) Ảnh listing thật cho 10 món.
4. ✅ (15/10, 8f) Deploy GitHub Pages; Event Desk Link + QR tự chạy theo URL.
   ☐ Domain purrlight.studio còn chờ.
5. 🟡 Newsletter chưa nối Klaviyo (form chỉ hiện thông báo trung thực).
6. 🟡 TikTok Shop: handle chưa xác minh; Open Collaboration chưa bật → trang
   Partners mô tả chương trình chưa chạy.
7. 🟡 Claim chưa kiểm chứng: "paid fairly" (About). (Collar / Sleepy Merlin
   không còn trong catalog 15/10.)
8. 🟡 Hộp thư hello@purrlight.studio chưa xác nhận hoạt động. *(16/10: purrlight.studio chưa đăng ký → toàn site tạm dùng purrlightstudiollc@gmail.com, xem 8j.)*
9. 🟡 Nghệ thuật Merlin: canon nói trăng/sao chỉ trang trí nhưng hero/keychain
   lấy trăng làm chủ thể; hero nói "tiny backpack" mà không hình nào có ba lô
   → hoạ sĩ vẽ lại theo canon (đã nằm trong brief Dribbble).
10. ⚪ Favicon bản filled (16px); Part A §02.3 nguyên văn cho About; Pinterest/
    Facebook handle xác nhận; "feeling-balls" nhắc trong About nhưng chưa bán.

## 8f. Đợt 9 — Catalog thật từ Etsy + deploy GitHub Pages (15/10/2026)

**Yêu cầu của Elise:** "Giá từng listing trong link Etsy luôn" + "deploy lên
GitHub Pages đi em" (shop: https://vietdelightfinds.etsy.com).

### Catalog — làm gì, nguồn ở đâu

- Trang shop/listing Etsy chặn bot (403 DataDome với mọi user-agent). **RSS
  feed của shop** mở được: `https://www.etsy.com/shop/VietDelightFinds/rss` →
  10 listing mới nhất, mỗi listing có giá (`<p class="price">`), ảnh il_570xN,
  mô tả đầy đủ. Ảnh tải từ CDN i.etsystatic.com cỡ il_794xN →
  `website/assets/img/etsy/<listingId>.jpg` (10 file, 1,2 MB).
- `js/products.js` viết lại hoàn toàn: 10 món, mỗi món `etsyUrl` riêng, giá
  đúng feed, `details` chỉ chứa facts có trong listing, không `addons` (giá
  variation không xác minh được). Tên trên site là tên canon (không copy tiêu
  đề SEO của Etsy). 2 collection chưa có listing (Little Things, Heritage &
  Celebration) → tile "soon" trên trang chủ, không vào filter.

| id | Tên trên site | Giá | Collection | Listing |
|---|---|---|---|---|
| anne-shirley-set | Red-Braid Storybook Doll Set | $35 | Storybook | 4367997103 |
| bennet-darcy-set | Elizabeth Bennet & Mr Darcy Crochet Doll Pair | $38 | Storybook | 4572077122 |
| george-washington-doll | George Washington Crochet Doll | $42 | Storybook | 4467723974 |
| christening-gown-set | Christening Gown Set — lace & satin | $89 | Faith & Milestones | 4333988358 |
| rosary-charm | Crochet Decade Rosary Charm | $25 | Faith & Milestones | 4592186429 |
| maine-coon-cat | Maine Coon Crochet Cat | $55 | Merlin's World | 4337395489 |
| british-shorthair-cat | British Shorthair Crochet Cat — Sherlock outfit | $55 | Merlin's World | 4337895128 |
| custom-pet-grand | Your Pet, Crocheted — Grand | $150 | Merlin's World | 4364432946 |
| horse-companion | Large Knitted Horse | $55 | Feelings & Calm | 4368649382 |
| dragon-pattern | Sleeping Dragon — Crochet Pattern (PDF) | $1.75 | Patterns & Printables | 4399784660 |

Giá = giá hiển thị của listing trên feed (giá thấp nhất khi có variation);
phần cộng thêm ghi trong `details` (size 10 in, long-pile fur +$20…).

### Đối chiếu từng món (hallucination check)

- Workflow verify 10 agent (mỗi agent 1 món, đối chiếu `products.js` với
  `listings.json` từ feed; 871k token, 13 phút): giá / listing id / ảnh khớp
  **10/10**, không từ cấm; **6 món ok** (anne-shirley, bennet-darcy,
  christening, rosary, maine-coon, dragon-pattern), **4 món có facts ngoài
  listing** → đã sửa hết:
  1. "Founding Fathers Crochet Doll Trio" → listing $42 là **một** búp bê
     George Washington (DETAILS: 1 doll, 2 size 8 in/10 in; "Jefferson &
     Franklin join the collection in 2026") → id `george-washington-doll`,
     viết lại copy.
  2. British Shorthair: "removable outfit" → listing nói **phụ kiện** tháo
     được, không phải bộ đồ; listing không có dòng care → bỏ "spot clean",
     thay bằng "processing time 1–2 weeks" (có trong listing).
  3. "Large Crochet Horse" → listing là ngựa **đan** (knitting) → "Large
     Knitted Horse".
  4. Custom pet Grand: "cat or dog" → listing chỉ nói "Cat & Pet" → "cat (or
     other pet)"; size theo tiêu đề **16–21 in** (body: "over 14 in"). Giữ
     "made from your photos" vì là quy trình custom pet đã duyệt 25/09 (Event
     Desk), không phải facts bịa — nhưng listing Etsy chưa ghi điều này.
  Thêm nhỏ: rosary "2–4 **business** days"; Maine Coon có khăn đan kèm, yarn
  chenille (long-pile fur +$20) — đều trong listing.
- **Lệch phía Etsy — cần Elise xem, site KHÔNG copy theo:** listing ngựa
  4368649382 dùng "magical companion", "hypoallergenic fiberfill",
  "child-safe details", "for kids/toddlers/nursery" (vi phạm canon + safety
  claim chưa chứng nhận); listing dragon pattern 4399784660 có dòng credit
  "Pattern by Anna_Crochet" (xác nhận quyền bán/license — Hard Rule IP) và
  tiêu đề "Plush Toy… Nursery Decor" cho một file PDF; listing British
  Shorthair 4337895128 mở đầu "Crochet pattern for…" dù là sản phẩm vật lý;
  giá custom pet Grand Etsy $150 vs bảng giá booth 25/09 (Grand cat $90–120).

### Deploy GitHub Pages

- API Pages (`/repos/…/pages`) bị chặn qua proxy của session (403) → cách
  làm: đẩy branch **`gh-pages`** (orphan; nội dung = `website/` + `.nojekyll`,
  không có README/script nội bộ). GitHub tự bật Pages (`has_pages: true`) →
  **https://elisehanhnguyenus-cloud.github.io/purrlight-skills/** sống sau
  ~1 phút; 12 URL probe trả 200 (HTML, CSS, JS, JPG, manifest).
- Site chạy dưới sub-path `/purrlight-skills/` — toàn bộ link/ảnh là đường
  dẫn tương đối nên không cần sửa; Event Desk suy `publicBaseUrl` từ URL
  https đang chạy → Link + QR cho khách hoạt động ngay (`confirm.html#…`).
- `website/deploy-pages.sh`: deploy lại bằng một lệnh (`bash
  website/deploy-pages.sh`) — fetch gh-pages, thay nội dung bằng `website/`,
  commit, push.
- Chưa làm: GitHub Actions tự deploy khi push (token session không có quyền
  `workflow`); domain `purrlight.studio` (thêm `CNAME` vào gh-pages + DNS).

### Kiểm tra sau sửa

- `audit-site.js` (Playwright, 8 trang × desktop/mobile): 0 console error,
  0 ảnh hỏng, không overflow 360 px, mỗi trang 1 h1.
- `smoke-desk.js` (Event Desk): pass, ERRORS none (payload v2, QR, id không
  tái dùng, hostile payload escape).
- Artifact: Event Desk **v7** (catalog mới), preview site **v9** — ảnh JPG
  publish dạng supporting files thay vì base64 (bản inline 21 MB vượt giới
  hạn 16 MB).

### Việc còn mở sau đợt này

- Shop còn listing ngoài 10 món của feed → cần link từng listing hoặc CSV từ
  Shop Manager để thêm. Little Things / Heritage & Celebration vẫn "soon".
- 4 điểm lệch phía Etsy ở trên (chị sửa listing hoặc xác nhận chủ ý).
- Checklist 8e vẫn mở: hộp thư hello@, TikTok handle, Klaviyo, Pinterest/
  Facebook handle, Purrks, Open Collaboration TikTok Shop.

## 8g. Đợt 10 — Custom Orders landing page (15/10/2026): dựng lại v1 theo Brand v2, tương tác kiểu OREOiD

**Yêu cầu của Elise:** tham khảo https://www.oreo.com/oreoid (custom gift
builder tương tác) cho trang landing "Custom Orders"; đọc BRIEF.md trong kit
`C:\Users\thanh\Downloads\custom order landing page` + brief Notion; dựng
lại index.html giữ nguyên từng câu copy và từng giá, bỏ style v1, restyle đúng
token Brand Identity v2, mobile-first, một hằng ORDER_FORM_URL, ảnh WebP
lazy-load.

### Nguồn
- Thư mục kit trên máy chị không truy cập được từ session cloud → dùng brief
  Notion "Custom Orders Landing Page — Handoff Brief for Claude Code (v1 →
  rebuild)" (cùng nội dung BRIEF.md). 9 ảnh kit lấy lại từ kho asset của
  artifact v1 (canvas "Purrlight Custom Orders Catalog"), nhận diện theo image
  map §4; HTML v1 đọc từ artboard `project/Main.dc.html`.
- OREOiD: builder 7 bước (chọn base → fudge → sprinkles → design → text →
  thêm → packaging), "Now showing" preview, Save/Start over, template. Mượn
  cơ chế (chọn → thấy → đặt), không mượn màu/confetti/bounce (Brand v2 cấm).

### Cách làm
1. Scout: brief, canon, ảnh, token site, v1. Viết `prices.js` từ brief §3 +
   test (8 nhóm) trước khi có giao diện.
2. Panel thiết kế (workflow): 3 designer độc lập (builder-first · editorial +
   inline estimator · mobile-conversion) → 3 judge (brand · UX/chuyển đổi ·
   kỹ thuật/a11y) → tổng hợp. Lần đầu dừng vì hết hạn mức; chạy tiếp từ cache.
   Ba spec hội tụ: cuộn editorial giữ thứ tự brief, picker inline dưới copy,
   bảng giá pet là picker, thanh đặt hàng dính mobile, dải 7 ảnh nhảy mục,
   ảnh giấy Dó hiện khi chọn ("Now showing"), Caveat một chữ ở band Giáng sinh.
3. Dựng `website/custom-orders/` (index.html + prices.js + custom-orders.js +
   custom-orders.css), font Caveat self-host (chỉ 1 chữ), ảnh WebP ≤ 200 KB,
   OG image. Link "Custom Orders" thêm vào nav + footer site chính.
   Bản 3 theo spec tổng hợp (3/3 judge chọn "mobile conversion first"): header
   site có nav, hero text (ảnh British Shorthair chỉ desktop), dải 7 thumb
   trước How it works, hàng giá vạch mảnh không bullet, bảng giá pet = nhóm
   radio, nút Peach chỉ 4 chỗ (header/hero/CTA cuối/thanh dính), bỏ cọc + số
   lượng + giảm % (brief để mở), christening dạng H3 + giá, Merlin minh hoạ
   không hồng (hồng một lần ở logo), footer Ink, Caveat ở chữ "early", link
   cùng tab (in-app browser của Linktree chặn popup), mailto fallback trong
   HTML, ORDER_FORM_URL vẫn một hằng trong prices.js.
4. Audit tự động: 79 chuỗi copy/giá của brief phải có mặt nguyên văn, quét từ
   cấm, alt/width/height/lazy, mọi nút → ORDER_FORM_URL (+utm), 1 h1, title +
   meta + og:image, không tràn 360/390/1280, 0 lỗi console; test tương tác
   Playwright (bảng giá, nhóm chỉ-bản-in, nhãn giá động, stepper, copy, start
   over, thanh dính, bàn phím, nhớ lựa chọn, dải ảnh).

### Vòng review 6 chiều (workflow, mỗi chiều một reviewer) → đã sửa
- 43 phát hiện (copy/giá 4 · brand 10 · a11y 11 · guardrail 0 lỗi mới · logic 6
  · hiệu năng 6; ~một phần ba là trạng thái trung gian của bản 2 đã biến mất ở
  bản 3). Pha "3 skeptic/phát hiện" bị dừng vì sẽ mất hàng giờ với 2 agent
  chạy song song; thay bằng vòng "fresh eyes" 3 lăng kính + 1 skeptic/phát
  hiện trên bản cuối.
- Đã sửa: hạn Giáng sinh (brief ghi "Sun" nhưng 30/11 và 14/12
  năm 2026 là thứ Hai); viền chip/ô bảng ≥3:1 (WCAG 1.4.11), focus ring Ink,
  hover/active nút ≥4.5:1, chip-note màu Ink khi chọn; vòng "đang xem" ở dải
  ảnh vẽ ngoài ảnh (inset trên <img> không hiện); Start over khôi phục mặc
  định (defaultChecked); restore localStorage có guard; add-on chỉ-bản-in bị
  bỏ chọn khi về digital; usp guard; drawer nav quản lý focus + inert +
  aria-controls; fallback cho trình duyệt không có :has(); forced-colors;
  nút menu 44px; thanh dính là region; ảnh godparent crop bỏ tag "Handmade
  Blessings"; xoá ảnh kit không dùng khỏi web; pick đi theo body email khi
  còn mailto; hero CLS 0.091 → 0 + preload theo media; preload Figtree 500;
  không tải Fraunces 400; Caveat subset 4 KB cho chữ "early"; ảnh giấy Dó
  560px. Trang 390px: 21 request · 463 KB (trước 641 KB), CLS 0.
- Không sửa (chủ ý): link footer trên nền Ink không dùng Berry (tương phản);
  không thêm chip Size/Yarn trùng với bảng (bảng đã là nhóm radio).

### Quyết định cần Elise duyệt (đã ghi trong README + prices.js)
- Footer "Designed in Texas. Made in Vietnam." (bỏ "Finished in Texas" theo
  quyết định 09/10) · "Christening gown set — $89" thay "Baby girl baptism
  outfit set" (brief §6) · "curated" ×2 giữ nguyên văn dù trong danh sách cấm
  Canon · "Etsy Star Seller ★ 4.9" lấy từ brief, chưa kiểm chứng.
- Cách đọc giá để mở: in tranh đã gồm tranh; giảm 5%/10% theo từng món từ món
  2/5, chỉ trên giá tranh/hộp; second pet −$10 cùng size & len; +$5 chỉ giấy
  Dó; hộp quà chỉ với bản in; giá khung 5×7 $16 / 8×10 $24 là số suy ra (§7).
- Ảnh pet crochet: ảnh kit 02 có tag "Na Na Handmade" (không phải của mình) →
  dùng ảnh listing Etsy Maine Coon; christening dùng ảnh hộp thật thay mockup.
- Giá custom doll $80 (brief) ≠ bảng giá booth 25/09 (doll Petite $45 /
  Classic $85 / Grand $130) và custom pet Grand Etsy $150 ≠ booth $90–120 —
  khác kênh có chủ ý?
- ✅ **Hạn Giáng sinh — Elise chốt 15/10: giữ Chủ nhật.** Brief §1/§3.9 ghi
  "Sun, Nov 30 · Sun, Dec 14" nhưng năm 2026 hai ngày đó là thứ Hai → trang
  nay ghi **Sun, Nov 29** (crochet) và **Sun, Dec 13** (tranh, lịch, hộp quà).
- Chưa có Google Form → `ORDER_FORM_URL` tạm là mailto:hello@purrlight.studio
  (lựa chọn của khách đi theo body email); dán link form vào là trang tự
  chuyển, kèm utm từ Linktree.

## 8h. Đợt 11 — Custom Orders thành "gift studio" kiểu OREOiD (15/10/2026)

**Yêu cầu của Elise:** trang hơi dài, mỗi sản phẩm cần thu ngắn; cấu trúc chưa
giống Oreo — muốn một bên là các bước chọn để khách tự "build" món quà, một bên
cho khách thấy món quà gồm những gì, cảm giác như chơi game; em thấy cần tìm
hiểu/bổ sung gì thì báo.

### Đã làm
- Bỏ 7 mục sản phẩm xếp dọc. Thay bằng khối **Build your gift**: bước 1 chọn
  món (7 ảnh = tab, vuốt ngang trên điện thoại) → mỗi lần chỉ hiện một món.
  Trái: tên, giá, mô tả, turnaround + các bước 2, 3, 4… dạng ô chọn. Phải (dính
  khi cuộn trên desktop): ảnh + hộp **What's inside** (dòng chính, những thứ đã
  gồm ✓, add-on vừa chọn hiện mờ dần 260 ms) → Estimate → Place your order →
  Copy my pick / Start over / How it works. Điện thoại: ảnh trên, hộp dưới,
  thanh dính đáy "Estimate $X · tên món" + "Added: …".
- Copy và giá của brief §3 vẫn còn đủ, chỉ đổi chỗ: dòng giá → nhãn ô chọn
  hoặc gợi ý của bước; danh sách "basic set", "gown, bonnet…" → hộp What's
  inside; bảng giá pet → mục gập "All pet prices" (mở sẵn khi tắt JS); giảm
  5%/10% → ghi chú dưới các bước. Pet: bảng 3×3 thay bằng 3 bước Size → Yarn
  (giá len đổi theo size) → số con.
- Hero gọn, bỏ ảnh British Shorthair (gỡ file khỏi web); How it works chuyển
  xuống dưới studio. Link thẳng tới từng món `custom-orders/#pet-crochet`…
  (cho QR/Linktree); trang nhớ món + lựa chọn cuối trên máy.
- Chiều dài trang: điện thoại ~11.200 → ~3.400 px; desktop ~8.900 → ~2.700 px.
  390px: 21 request · 480 KB · CLS 0.
- `prices.js`: hộp tân gia nhận tên add-on (mỗi món một dòng, vẫn +$10); thêm
  `estConfirmationBox()` $55 ghi "Coming soon". Không đổi giá nào.
- Test: `test-prices.js` 8 nhóm · `test-studio.js` (tab, 7 món, phím mũi tên,
  bar, nhớ lựa chọn, link #món, tắt JS) · `audit-custom.js` (copy nguyên văn,
  từ cấm, ảnh, nút, tràn 360/390/1280) — pass.

### Hai reviewer độc lập (agent) → đã sửa
- Brand/copy/giá: hộp **Confirmation (coming soon)** đang chọn được và đi vào
  email đặt hàng với $55 → nay chỉ là ô thông tin, không đặt được; bỏ dòng
  "Printed on fine-art paper" trong hộp (cách đọc giá giấy còn chờ chị); lựa
  chọn được nhớ / link #món đi kèm link đặt hàng ngay khi mở lại; về "Digital
  file" thì giấy, khung, hộp quà cùng về mặc định; hộp tân gia ghi "Add or
  swap: …"; bỏ token màu hồng khỏi CSS; mũi tên "All pet prices" không xoay.
- Trợ năng/điện thoại: thanh đặt hàng không còn che ô đang focus (scroll-
  padding + chặn bằng JS); viền focus thấy được trên footer Ink; bước "chỉ bản
  in" khi chọn Digital không còn trông như đang chọn + có dòng lý do ("For
  prints — choose a print size in step 2."); viền focus hàng ảnh không bị cắt;
  trên desktop chỉ hộp What's inside dính (ảnh cuộn đi) nên vừa màn 720–768px;
  thanh dính chỉ dưới 900px; thông báo cho trình đọc màn hình gọn hơn
  ("Removed: …" khi bỏ chọn); chữ trong ô không ngắt giữa từ.
- Giữ nguyên (chờ chị): How it works nằm dưới studio (brief §5 muốn giữ thứ
  tự v1 — em đổi để khách vào thẳng phần chọn quà như Oreo); hộp quà tranh chỉ
  cho bản in (cách đọc cũ, đã ghi trong prices.js); ảnh christening có tràng
  hạt + thiệp trong khi bộ ghi "gown, bonnet, mittens and booties".

## 8i. Đợt 12 — Gói gợi ý, số lượng & giảm giá, cọc 50%, Square/Zelle, ảnh từng lựa chọn (15/10/2026)

**Elise chốt:** giá khung 5×7 $16 / 8×10 $24 · làm gói gợi ý theo đề xuất ·
giảm 5%/10% khi đặt nhiều tranh/hộp (hỏi lại: **theo từng món** — món 1 giá đủ,
2–4 giảm 5%, từ 5 giảm 10% — **trên cả món**) · godparent cả hai: **bộ 2 −$10**
($180) · cọc 50% hôm nay · Zelle `purrlightstudiollc@gmail.com` · Square
`https://square.link/u/UUg2LtbP` (link "Custom order", khách tự nhập số tiền,
$1–$50.000) · thành phần từng món (doll: bó hoa nhỏ, cánh thiên thần, áo choàng
/ nón / túi xách, đế gỗ rời, thiệp, ship; godparent có hộp + thiệp; lịch 6 tờ, 2
tháng/trang, in 5×7; file digital .png + .pdf ≥ 4×6 in; hộp tân gia $50 = 4 món
cơ bản + hộp, đổi được sang sen đá / cold cut / 3-berry / chocolate) · gửi 5
ảnh: doll trong shadowbox, QR Square, 3 size mèo, len velvet, hộp quà có tranh
floating 5×7 + rosary.

### Đã làm
- **Gói gợi ý** ("Or start from a gift idea"): Realtor closing gift $60 · Pet
  memorial $41 · Christmas gift for Grandma $90 — giá tính từ chính estimator;
  bấm là mở đúng món, chọn sẵn ô, focus vào tên món.
- **Số lượng** tranh / hộp (− n +), dòng "× 3 paintings" và "Order more, save
  more −$…"; **Godparent** 1 hoặc cả hai; mỗi hộp có **Deposit today (50%)** +
  **Balance after you approve the photo**; mục **Pay your deposit** (`#pay`):
  Square (nút + *Copy deposit amount* + QR cho máy tính, QR tạo lại đúng link
  trong QR của chị `?src=webqr`), Zelle® (*Copy address*, ghi chú kiểm địa chỉ),
  điều khoản cọc lấy từ bản booth 25/09, dòng phi-liên-kết nhãn hiệu Zelle®.
- **Hộp tân gia**: add-on +$10 chọn **thêm** hoặc **đổi** một món cơ bản (món
  bị đổi gạch ngang trong hộp; mỗi món chỉ đổi 1 lần; đổi tranh → không cần ảnh
  nhà). **Không đưa rượu lên trang**: chưa có giấy phép TABC, USPS/UPS/FedEx
  không nhận rượu từ người không có giấy phép, Texas xếp cider có cồn là wine →
  ghi "Bottle of sparkling cider (non-alcoholic)" + "We don't sell or ship
  alcohol."; ảnh mẫu có chai VINO rosé → chú thích ảnh mẫu.
- **Your photos** từng món + **Message for the card** (doll, godparent; đi kèm
  "My pick", không lưu trên máy). Hỗ trợ sẵn **Tally** (hidden fields `pick`,
  `product`, `total`, `deposit`) + mẹo mở bằng trình duyệt khi vào từ app.
- **Ảnh từng lựa chọn ("now showing")**: shadowbox → ảnh doll trong shadowbox;
  đổi size → 3 size cạnh nhau; Velvet → cận cảnh len; khung → khung floating
  5×7; giấy Dó; hộp quà / rosary. Ảnh nhỏ của món đang build hiện ở thanh đặt
  hàng trên điện thoại. Ảnh cắt tránh chữ quảng cáo và chai rượu.
- **Email đặt hàng**: tên miền purrlight.studio **chưa đăng ký** (DNS NXDOMAIN)
  → email tới hello@purrlight.studio bị trả về. Trang Custom Orders chuyển sang
  purrlightstudiollc@gmail.com; các trang khác + Event Desk vẫn ghi hello@ —
  chờ chị quyết (đăng ký tên miền + hộp thư, hoặc đổi toàn site). *16/10: chị
  quyết đổi toàn site sang Gmail (8j).*
- Tra cứu (workflow 4 chủ đề + kiểm chứng): Tally là form miễn phí duy nhất cho
  khách gửi ảnh không cần đăng nhập (10 MB/file); Google Forms bắt đăng nhập
  Google (hay bị chặn trong Instagram/TikTok); Zelle không có link thanh toán;
  Square Free 3.3% + 30¢ cho thanh toán online.

### Rà soát 5 góc (workflow: tính tiền · câu chữ/pháp lý · trợ năng · brand/ảnh · bảo mật; mỗi lỗi có người kiểm chứng lại)

57 lỗi được báo, **28 được xác nhận** và đã sửa hết (29 bị bác — phần lớn đã sửa ở
vòng câu chữ trước):
- **Nặng — máy tính (≥ 900px):** bấm chuột vào nút có thể bị mất (trang tự cuộn
  khi focus vì đoạn code giữ focus khỏi thanh đặt hàng chạy cả khi thanh bị ẩn) →
  chỉ chạy khi thanh thật sự hiện; thêm test bấm chuột thật ở 1280px.
- **Tiền:** xem trang mà chưa chọn gì thì không lưu và không gắn "My pick" vào link
  đặt hàng nữa (lưu kèm cờ `u:1`, bỏ các lưu mặc định cũ); mục Pay chỉ hiện "Your
  pick … deposit" + nút *Copy deposit amount* sau khi khách chọn; cọc làm tròn theo
  xu (nửa xu → lên); $1,095 có dấu phẩy; ô số lượng sửa ngay (60 → 50 kèm câu "Up
  to 50 here — for more, write the number in your order.", 2.5 → 2); gói gợi ý giữ
  lời nhắn thiệp đã gõ; sửa chú thích prices.js về Google Form (không có entry id thì
  không gửi kèm lựa chọn).
- **Trợ năng:** nút copy trả focus về nút; nút − / + dùng aria-disabled (không mất
  focus); thông báo "Copied" hiện ngay dưới nút bấm (không bị thanh đặt hàng che);
  vùng thông báo không bị `display:none` khi trống; đổi món đọc bằng lời ("Cold cut
  box replaces the jar of jam…", không còn "Removed" sai, không đọc mũi tên); giới
  hạn 160 ký tự được đọc kèm ô lời nhắn; select đổi món 16px (iOS không zoom).
- **Brand/ảnh:** gói Pet memorial dùng ảnh mèo (không phải nhà) và mở ở ảnh giấy Dó;
  bỏ ảnh "Gift box" (thực ra là cận cảnh rosary $15); "…@gmail.com Copy address" có
  khoảng cách; nhãn đổi món ngắn ("Swap for the sparkling cider"); dấu "— swapped
  for" không dính chữ; chú thích ảnh tân gia nói về "basic set" thay vì "yours".
- **Bảo mật:** link `#__proto__` / `#constructor` không còn làm trắng studio
  (`Object.create(null)`); dữ liệu đổi món lưu trên máy được làm sạch, mỗi món cơ
  bản chỉ đổi 1 lần.

### Bổ sung theo tin nhắn Elise 15/10 (đợt 2)
- **Giấy in 3 loại:** Regular paper (đã gồm trong giá in) · Fine-art paper **+$10**
  · Handmade Vietnamese Dó papyrus +$5.
- **Ảnh mới:** nhóm mèo len thay Maine Coon; ảnh nhóm khung tranh hiện khi chọn
  khung (giấy Dó + khung → ảnh khung floating); ảnh chung Christening (chú thích:
  bóng trong suốt chỉ để chụp, không kèm bộ $89) + ảnh hộp Confirmation trong ô
  "coming soon". Các tag "Handmade" / "Handmade Blessings" đã làm mờ; chữ trên bóng
  giữ nguyên (chị chọn).
- **Tranh là digital painting (Wacom/Procreate):** thêm câu "Painted digitally on a
  tablet, not by hand — prints are made from that file."; "digital watercolor" ở
  hộp tân gia, lịch, gói Pet memorial, alt ảnh.

### Còn chờ chị
- "We handcraft your piece" (How it works, nguyên văn brief) áp cho cả tranh digital.
- Khách có chọn được kiểu khung (gỗ sồi / trắng / nâu / floating) không — ảnh khung
  cho thấy nhiều kiểu; trang chưa hứa kiểu nào.
- Giới hạn 50 tranh/hộp mỗi đơn trên trang; ảnh hộp quà $5 thật (để thay ảnh đã bỏ).
- Ảnh nhóm mèo / Christening / shadowbox trông như ảnh dựng (AI) — Brand Canon ưu
  tiên ảnh thật.

## 8j. Đợt 13 — Quyết định Elise 16/10: hộp tân gia $60, thuế 8.25%, pickup/ship, form Tally (16/10/2026)

**Elise chốt 16/10:** chưa có tên miền → mọi liên hệ trên site tạm về
purrlightstudiollc@gmail.com · sửa câu "We handcraft your piece" · khung: chỉ ghi
"We'll contact you to confirm your wooden frame." (tùy tình hình xưởng) · chấp nhận
giới hạn 50 · dùng ảnh chị gửi + ghép tranh mèo vào ảnh khung floating ("Cả hai") ·
tạm dùng ảnh AI · hàng tươi (cold cut, 3-berry) **chỉ nhận tại chỗ** · mùa cao điểm
**2–4 tuần** · **thuế 8.25% cộng vào mọi đơn** · hộp tân gia basic **$60**; nến thơm
+$10, cold cut +$15, chocolate 6 viên +$20 (sen đá, 3-berry giữ +$10) · mỗi món phải
chọn **Pickup tại Pearland Town Center (thứ 7 / CN)** hoặc **Ship** (miễn phí, khách
ghi địa chỉ + giờ nhận) · form đặt hàng là **Tally của chị** https://tally.so/r/M1KOkY.

### Đã làm (commit a4b2264 + đợt sửa sau rà soát)
- **Giá & thuế** (`prices.js`): mọi số tính bằng xu; thuế theo basis point (825);
  `pre` (trước thuế) · `tax` · `total` · cọc = ½ tổng có thuế (nửa xu làm tròn lên).
  Doll giữ "sales tax … included" (copy đã duyệt) — **đang chờ chị quyết**. Dòng
  chung đổi thành "Prices are before 8.25% sales tax, unless marked tax included."; ô
  gợi ý Grandma ghi "$90 tax incl.".
- **Pickup or shipping**: bước cuối mỗi món (trừ file digital); chọn cold cut /
  3-berry → tắt Ship, tự chọn Pickup Saturday **và báo cho khách**; bỏ hàng tươi ra
  → tự trả về Ship (trừ khi khách tự chọn ngày). Thanh đặt hàng trên điện thoại ghi
  đúng cách nhận của món đang chọn. Dòng "U.S. shipping included" của doll ẩn khi
  chọn pickup. Danh sách hàng tươi đọc từ `PRICES.housewarming.fresh` (một chỗ).
- **Form Tally**: mọi nút "Place your order" mở form của chị, mang theo `pick`,
  `product`, `total`, `deposit` (luôn có xu, vd 46.01) + utm (chữ thường). Đã sửa
  form qua connector (chị duyệt): ô ảnh "Upload your photos" nhận tối đa 10 ảnh,
  không bắt buộc; địa chỉ + "Anything else?" không bắt buộc; màu Brand Canon; gửi
  xong quay về `#pay`; email báo đơn về Gmail. Màu ô nhập riêng cần gói Pro.
  Không JS: nút cũng mở form Tally; câu nhắc ghi pickup (thứ 7/CN) hoặc địa chỉ + giờ.
- **Ảnh**: ảnh khung floating ghép tranh mèo — bản 2 có sợi giấy Dó, màu dịu như
  bản in thật, xóa vệt cây của ảnh nhà cũ; ghi chú "sample image". Hộp quà: cặp ảnh
  đóng / mở (giới hạn chiều cao như ảnh khác). Tick rosary khi đã có hộp quà → hiện
  ảnh rosary.
- **Câu chữ**: "digital watercolor art" ở meta/og/lede; "custom pieces are made from
  your photos"; email Gmail toàn site (about, shop, product, index, partners, confirm,
  Event Desk).

### Rà soát 5 góc (tiền · pickup/trợ năng · câu chữ/pháp lý · ảnh · hồi quy) — 39 báo, 36 xác nhận
Đã sửa: hàng tươi tự chuyển pickup mà không báo + không trả lại (MS-1, SHIP-1/2,
copy-6) · thanh đặt hàng "Free U.S. shipping on every custom order" (5 người báo) ·
dòng thuế chung mâu thuẫn với doll · email/form không hỏi địa chỉ + giờ (mailto có
dòng trống để điền; Tally có ô riêng) · số tiền gửi Tally mất số 0 · số bước 2, 3, 5
khi đổi tranh · bước pickup nằm sau bảng giá pet · gói gợi ý xóa lựa chọn pickup ·
ảnh rosary bị hộp quà che · ảnh hộp quà quá cao ở tablet · ảnh ghép Dó quá "sạch" +
vệt cây · chú thích cũ trong code.
**Giữ lại chờ chị:** hạn Giáng sinh 29/11 (móc len) và 13/12 (tranh, lịch, hộp quà)
**không kịp** với "2–4 tuần" (+10–14 ngày bay từ Việt Nam) → tạm ẩn hai hạn (để
trong comment HTML), giữ câu 2–4 tuần. Gợi ý theo số của chị: ~CN 8/11 (móc len),
~CN 15/11 (tranh, lịch, hộp quà).

### Tra cứu (workflow 4 chủ đề + kiểm chứng): FTC · thuế Texas · Tally · thực phẩm
- **FTC (16 CFR 435)**: luật quy định thời gian **gửi hàng** (giao cho hãng vận
  chuyển) mà shop hứa, không quy định thời gian tới tay khách. Không ghi gì → mặc định
  30 ngày từ khi nhận cọc + đủ thông tin. Ghi "2–4 tuần" thì 4 tuần là hạn chót. Trễ
  → phải email khách **trước hạn**, cho chọn chờ hoặc hủy hoàn tiền (hoàn trong 7 ngày
  làm việc). Nên đổi "Turnaround: from X" thành "ships within N" (chị đặt N).
- **Thuế Texas**: 8.25% = 6.25% bang + 2% địa phương (Pearland phần Brazoria; phần
  Harris/Fort Bend có thể 7.75%). Hàng ship ra ngoài Texas **không chịu thuế Texas**;
  trái cây tươi, thịt nguội cắt sẵn (không khay/dĩa) **không chịu thuế**; chocolate,
  nến, sen đá chịu thuế. Thuế đã thu (kể cả thu dư) phải nộp hết cho bang. Cần
  **permit đứng tên Purrlight Studio LLC** trước khi thu thuế.
- **Thực phẩm**: cold cut cần giấy phép thực phẩm hoặc mua từ deli có phép; berry giữ
  nguyên hộp nhựa gốc; sen đá/lô hội bán online cần đăng ký TDA Nursery/Floral; không
  đóng lại nhãn mật ong/mứt/chocolate.

### Còn chờ chị
1. Hạn đặt Giáng sinh mới (hoặc bỏ "2–4 tuần").
2. Thuế: permit đã có chưa (tên LLC)? Có giữ "mọi đơn +8.25%" cho đơn ship ngoài
   Texas và hàng tươi không? Doll: bỏ "tax included" hay giữ?
3. "Turnaround: from X" → "ships within N" từng món.
4. Cold cut: tạm ngưng hay lấy từ deli có giấy phép; sen đá: đăng ký TDA.
5. "Handcrafted keepsakes" (lede/meta) và tagline "Made by hand. Made to be kept."
   cho tranh digital.
6. Form Tally: Phone + "Best time…" đang bắt buộc cả với đơn file digital.

## 8k. Đợt 14 — Elise 16/10 (tin nhắn 2) + rà soát vòng 2 + ảnh Merlin thật (16/10/2026)

**Elise trả lời 6 câu của 8j:** (1) đã có permit; đơn ship ngoài Texas **không thu
thuế Texas**; trái cây không thuế; thuế thu được nộp đủ (2) doll bỏ "sales tax
included" → tính thuế như mọi món (3) cold cut chưa có phép → ghi "coming soon"
(4) sen đá/lô hội bán tại sự kiện, nhận đặt online (5) giữ "Handcrafted keepsakes" +
tagline; tranh luôn ghi **Digital Watercolor Painting** (6) Tally: Phone và Best time
không bắt buộc với đơn file digital. Thêm: khối gift idea rớt chữ xấu → sửa; gói đầu
phải rẻ, dễ bấm; "Christmas gift for friends & family"; "Realtor closing &
housewarming gift"; lịch chỉ in giấy **Premium Matte**. Sau đó chị gửi ảnh 12–16:
dùng **Merlin thật** thay con mèo trong mockup (hero, mục Giáng sinh, cuối trang).

### Đã làm (commit c0623ff + đợt này)
- **Thuế theo nơi nhận** (`prices.js` `settle`/`outOfTexas`): bước Pickup or shipping
  có 4 lựa chọn — Ship within Texas · **Ship outside Texas (không thuế Texas)** ·
  Pickup thứ 7 · Pickup CN. File digital không có gì để ship → hỏi **"Where you live"**
  (In Texas / Outside Texas). Trái cây `taxFree` (dòng thuế ghi "Not on the fresh
  fruit"). Tally nhận thêm ô ẩn `delivery`.
- **Tally** (connector, đã publish): Phone + Best time không bắt buộc với đơn digital.
- **Gift ideas**: 4 gói, rẻ nhất trước có nhãn **Under $20** — Pet portrait print $15 ·
  Pet memorial $41 · Realtor closing & housewarming gift $70 · Christmas gift for
  friends & family $90 (giá trước thuế, ghi "+ tax").
- **Cold cut**: hiện "(coming soon)", không chọn được. **Lịch**: "Printed on Premium
  Matte paper". **Sen đá**: "ships within Texas" — **em tự thêm** (chính sách shop,
  không viện dẫn luật), chị bỏ được hoặc đổi thành chỉ pickup.

### Rà soát vòng 2 (thuế · pickup · gift ideas · câu chữ · hồi quy) — 18 báo
Kiểm chứng đối nghịch: góc thuế có người phản biện riêng; các góc còn lại em dừng
workflow cho nhanh và tự kiểm bằng test tái hiện từng lỗi (`test-studio.js`).
**Bác bỏ** (money-1 / GETIT-4): "gộp Outside Texas giữa bản in và file digital" — sai,
vì nơi khách sống (file) và nơi gửi quà (bản in) có thể khác nhau; gộp sẽ bỏ thuế đáng
thu. Thay vào đó: giữ cả hai câu trả lời, khi thuế quay lại thì **báo cho khách** ("Texas
sales tax added — choose Ship outside Texas if it ships to another state.").
**Đã sửa:** câu thuế đầu studio thiếu file digital cho người ở Texas (3 người báo) ·
noscript hỏi thêm bang của khách mua file · gói Realtor đổi Ship outside → within Texas
mà trình đọc màn hình không nghe lý do · gói gợi ý làm mất lựa chọn gốc của khách khi
trang đã tự đổi · bỏ hộp trái cây khi còn sen đá → khách kẹt ở Pickup (giờ về Ship
within Texas và báo) · thanh đặt hàng 360px cắt chữ "outside Te…" · pick cũ có cold cut
bị bỏ im lặng (giờ báo "Cold cut box is coming soon — taken out of your saved pick.") ·
Pet memorial mất chữ "digital watercolor" · chú thích ảnh tân gia còn "cold-cut
add-ons" · gift idea vẫn rớt 1 chữ ở 320–834px (`text-wrap: balance` + `&nbsp;`) ·
Tab tới thẻ 2/4 trên điện thoại không cuộn tới + viền focus bị cắt · `li[hidden]` vẫn
hiện · nhãn Under $20 đẩy tiêu đề thẻ 1 lệch hàng (giờ nằm trên mép thẻ).

### Ảnh Merlin thật (ảnh 12–16 của chị)
Hero = ảnh 14 (Merlin giữa hộp quà, len, móc; điện thoại: chữ → nút đặt hàng → ảnh;
desktop: 2 cột) · "Ordering for Christmas?" = ảnh 15 (2 cột ở desktop) · cuối trang =
ảnh 13 cắt tròn thay hình vẽ. Ảnh 12 có chữ "Merrvest holidays" in sẵn → không dùng.
Đây là ảnh **mùa lễ**: sau Giáng sinh thay hero/Christmas; hình vẽ `merlin-closing.svg`
vẫn giữ trong repo. Ảnh thumb ở bước 1 chuyển sang lazy (hero đẩy xuống dưới màn hình
đầu trên điện thoại).

### Elise trả lời tiếp (16/10, tin nhắn 3) — đã làm
- **Hạn đặt Giáng sinh:** đồ móc len **CN 8/11**, tranh/lịch/hộp quà **CN 15/11**; đơn đặt
  sau hạn **giao vào năm 2027** ("Orders placed after these dates will be delivered in
  2027."). Sau 15/11 nên gỡ hai dòng hạn (hoặc đổi chữ) vì hạn đã qua.
- **Sen đá:** giữ "ships within Texas". **"Premium Matte":** giữ (tên giấy) — audit
  không còn cảnh báo.
- **Tên lịch:** "Custom Watercolor Pet Calendar 2027 — Digital Painting" (ô chọn, tiêu đề,
  Tally `product`, thanh đặt hàng).
- **Ảnh full màn hình, "tệp" vào nền:** ảnh Merlin ở hero và mục Giáng sinh không còn là
  khung bo góc mà thành **nền tràn mép**:
  - Desktop: ảnh phủ ~60% bên phải, tràn ra mép màn hình, mép trái/trên/dưới mờ dần vào
    nền kem (hero) / vàng bơ (Giáng sinh); chữ + nút nằm bên trái, trên ảnh.
  - Điện thoại/tablet: ảnh tràn hết chiều ngang dưới nút đặt hàng, mép trên/dưới mờ dần.
  - Màu trắng của sàn trong ảnh được kéo về đúng màu nền (kem `#FBF6EE` / vàng bơ
    `#FAEFD8`) để chỗ mờ không lộ vệt; màu len, nơ, mèo gần như giữ nguyên.
  - Brand Canon cấm gradient: đây là **mask làm mờ mép ảnh** (không tô màu chuyển sắc),
    là ngoại lệ chị yêu cầu — ghi chú ở đầu `custom-orders.css`.
  - File: `hero-merlin-wide-900/1376.webp` + `hero-merlin-phone-640/1024.webp`,
    `xmas-merlin-wide-900/1376.webp` + `xmas-merlin-phone-640/1024.webp` (dùng `<picture>`:
    ≥600px ảnh ngang, nhỏ hơn ảnh 4:3). Ảnh tròn Merlin cuối trang giữ nguyên.

### Rà soát ảnh tràn mép (2 góc + người phản biện riêng) — 4 lỗi xác nhận, đã sửa
- Chữ đè lên ảnh ở 900–1023px (độ tương phản < 4.5:1, gồm ngày "Sun, Nov 15"): ảnh
  lùi lại trong khoảng đó; mục Giáng sinh có vùng trong suốt trước khi ảnh hiện dần.
  Đo lại từng chữ ở 900–3440px (cả 200% zoom): không còn chữ nào dưới 4.5:1.
- Ảnh Giáng sinh lộ vệt ngang (dải phòng tối phía sau mép bàn): đã sửa ảnh — dải đó
  thành màu mặt bàn, nối liền, mờ vào nền vàng bơ.
- Màn hình siêu rộng (3440px) cắt mất tai Merlin: đổi điểm neo khung ảnh.
- "allow 2–4 weeks" ngay dưới "delivered in 2027" nghe mâu thuẫn → "Orders placed by
  these dates: allow 2–4 weeks."
Bác bỏ: dấu gạch dài trong tên lịch trùng dấu ngăn cách (chỉ là kiểu chữ); ô chọn lịch
cao hơn (do tên dài chị chọn); hạn cho Godparent set / Confirmation box (đã rõ).

### Hộp tân gia: đổi món chỉ tính phần chênh lệch (Elise 16/10, tin nhắn 4)
Chị báo lỗi logic: trước đây đổi món cơ bản lấy add-on thì cộng **nguyên giá add-on**
(vd. đổi rosary lấy nến +$10). Nay: **giá add-on − giá bán món cơ bản**, món rẻ hơn thì
**trừ lại**. Giá bán món cơ bản: cider $15 · mứt/mật ong $5 · tranh nhà $15 (in 5×7 giấy
Premium Matte — đã ghi vào dòng "Basic set") · rosary $10. Ví dụ: rosary → nến = $0
($64.95 có thuế); cider → nến = −$5 ($59.54); mứt → chocolate = +$15. Trái cây đổi vào
vẫn không chịu thuế (phần cider bị bỏ ra không còn bị tính thuế). Hộp ghi rõ cách tính
("Scented candle $10 − rosary chain $10"), menu đổi món ghi giá chênh từng lựa chọn,
Tally `pick` mang cả cách tính.
Rà soát (2 góc + phản biện): mô hình tính tiền độc lập so với `prices.js` và trang thật —
15,552 tổ hợp (mọi add-on × mọi cách đổi × số lượng 1–50 × ship/ngoài Texas/pickup),
**0 sai lệch**; lỗi xác nhận duy nhất: README còn ghi quy tắc cũ (đã sửa). Dòng đổi món
dùng tên ngắn (sparkling cider, jam or honey, home painting, rosary chain).

### Popup Tally · giảm giá bộ váy rửa tội · socks (Elise 16/10, tin nhắn 5)
- **Popup Tally:** nút "Place your order" (cả 11 nút) mở form ngay trên trang thay vì rời trang:
  góc phải dưới, 376px, ẩn tiêu đề (form có "(Meridian Fall Event)" — chị chọn giữ, chỉ ẩn trong
  popup), emoji 👋 vẫy tay (chị chọn giữ dù Brand Canon cấm emoji/nhún; đứng yên khi bật "giảm chuyển
  động"). Điện thoại: popup cao tối đa 62% màn hình (Tally mặc định 70%) theo ý chị "nhỏ hơn".
  Ô ẩn pick/product/total/deposit/delivery/utm đi theo popup giống hệt link (đã kiểm với script
  thật của Tally). Thêm cho người dùng bàn phím: mở popup → con trỏ vào form; Esc (khi con trỏ ở
  trang) đóng; đóng → con trỏ về nút. Gửi xong → đóng popup, chuyển tới "Pay your deposit".
  Script Tally lỗi/bị chặn → nút vẫn mở trang form như cũ.
- **Christening Gown Set −25% đến hết CN 25/10** (giờ Texas): ô chọn hiện ~~$89~~ $66.75, dòng
  "Christening gown set: 25% off through Sun, Oct 25" dưới giá; thuế + cọc theo giá giảm
  ($72.26, cọc $36.13); Tally `pick` ghi "(25% off $89 through Oct 25)". Từ 26/10 tự về $89.
- **Socks:** "Gown, bonnet, mittens, booties and socks." (Custom Orders + trang sản phẩm).
- **Tally hay Google Drive (Google Forms)?** → **Tally** cho form khách đặt hàng: khách tải ảnh không
  cần đăng nhập (Google Forms bắt đăng nhập Google để tải file, file vào Drive của chủ form); có ô ẩn
  nhận sẵn món/giá/cọc từ trang; popup; màu thương hiệu; miễn phí không giới hạn form/đơn, ảnh tới
  10MB/file (Pro $29/tháng bỏ giới hạn + bỏ "Made with Tally"). Muốn có bảng đơn trong Google Drive:
  bật **Tally → Google Sheets** (miễn phí, mỗi đơn một dòng).

Rà soát popup + giảm giá (2 góc + phản biện): 7 lỗi xác nhận, đã sửa — form Tally không hiện
(tally.so lỗi) thì nút bị "kẹt" → sau 10 giây tự mở trang form; bấm lại nút khi popup đang mở làm
mất chữ khách đã gõ → cùng món thì giữ form; gửi xong không cuộn tới "Pay your deposit" khi địa chỉ
đã có #pay → luôn cuộn; trang mở qua nửa đêm 25/10 còn hiện giá giảm → tự đổi về $89 (ô chọn, ước
tính, link Tally); thêm "(Central Time)"; "$89" gạch ngang đủ tương phản; "Oct 25" không bị tách dòng.

### Elise 16/10, tin nhắn 6 — đã làm
- Popup Tally chạy tốt trên máy chị. **Giảm 25% đồng bộ**: Etsy và trang Shop (thẻ sản phẩm, trang sản
  phẩm, Event Desk) đều ~~$89~~ $66.75 đến hết CN 25/10 (Central Time), tự về $89.
- **Christening:** bộ váy cho bé gái, sẵn hàng, giao trong 2–3 ngày; đồ bé trai "coming 2027".
- **Confirmation gift box** đặt được (giao sau 12/11): bước "Choose the saint" — thánh có sẵn 12 cm
  $55 · thánh làm theo yêu cầu 12 cm $55 · St. Carlo Acutis 10 in $90 · St. Michael the Archangel
  10 in $90; mọi tượng nhắm mắt; Tally `pick` ghi tên lựa chọn. Ảnh: dùng ảnh hộp Mary 12 cm có sẵn.
- **Quy trình làm hàng** ("How it works" 4 bước): cọc → mockup thiết kế trước khi làm → báo đang
  làm, cập nhật tiến độ sau ~1 tuần → ảnh thành phẩm, trả phần còn lại, giao/nhận.
- **Muỗng xà cừ** (add-on hộp tân gia): 2 cái $12, 4 cái $24; 4 kiểu có ảnh; đổi món cũng tính chênh
  lệch (vd. 4 muỗng thay rosary: +$14).

Rà soát (tiền + trải nghiệm, có phản biện) — 4 lỗi xác nhận, đã sửa: **Event Desk** sửa đơn cũ tự đổi giá
theo giá Shop hiện tại (đơn bán $66.75 thành $89 sau 25/10 — sai tiền đã thu) → đơn đã lưu giữ đúng giá lúc
bán; trang Shop / sản phẩm / Event Desk **mở sẵn qua nửa đêm 25/10** vẫn $66.75 → tự về $89 (trang Shop tải
lại, Event Desk đổi giá chip + đơn mới); Confirmation chọn pickup hiện "Ships after Nov 12 · Pickup Saturday"
→ "Ready after Nov 12", dòng "U.S. shipping included" chỉ khi ship, Tally `pick` ghi "(ready after Nov 12)";
mục Giáng sinh "Every piece is made to order — 2–4 weeks" mâu thuẫn bộ váy giao 2–3 ngày → sửa câu.
Bác bỏ: muỗng 4 cái $25 (chị đã chốt $24), ảnh hộp Confirmation hơi mờ (ảnh tạm), …

### Wedding & party favors — coming soon (Elise 16/10, tin nhắn 7)
Chị chọn cách 3: thêm mục "Wedding & party favors" (thẻ **Coming soon**) sau mục Giáng sinh — muỗng xà
cừ buộc nơ satin trên thiệp cảm ơn, cho đám cưới / baby shower… (trang ghi "weddings, showers and
parties"); 5 ảnh mẫu chị gửi (bản không watermark), chú thích "Sample photos.", chưa giá / chưa đặt.
Khi mở bán: cần giá theo số lượng, có in tên + ngày lên thiệp không, và quyền dùng ảnh của nhà cung cấp.

### Hiệu ứng chuyển động (Elise 16/10, tin nhắn 8)
Chị chọn "Hiện dần khi cuộn tới" + "Động hơn": các phần hiện dần + trượt lên khi cuộn tới (thẻ trong một
hàng hiện lần lượt, 70ms/thẻ), thẻ nổi lên khi rê chuột (chỉ máy có chuột), ảnh hero / Giáng sinh trôi
nhẹ ±28px khi cuộn (≥900px). Ngoại lệ Brand Canon "no transforms" theo yêu cầu của chị. Khách bật
"giảm chuyển động" → tắt hết; không JS → mọi thứ hiện sẵn; in → hiện hết.

### Nền section + đèn nhỏ, tuyết, ảnh thánh, ảnh Merlin mới (Elise 16/10, tin nhắn 9)
- **Nền clean, tối giản, đúng thương hiệu:** các section xen kẽ hai màu phẳng của Brand v2 — cream
  (Build your gift, Pay, Favors) và butter-soft (How it works, Giáng sinh, nút đặt hàng cuối trang).
  Không gradient, không ảnh nền sau chữ. "How it works" có một sợi chỉ móc nét đứt + cuộn len nhỏ
  (nét vẽ màu Peach) cạnh tiêu đề.
- **"Đèn sáng" thay cho confetti** (Brand v2 cấm confetti; chị cho chọn "confetti hoặc bông tuyết hoặc
  đèn sáng"): sao 4 cánh nhỏ cạnh tiêu đề "Build your gift" và "Wedding & party favors" (lấp lánh 2 lần khi
  hiện ra rồi đứng yên); vầng sáng đèn bàn làm việc (motif "purr" + "light") sau ảnh Merlin cuối trang;
  **dây đèn** dọc mép trên mục Giáng sinh (bóng Berry / vàng beret #CA8D41 / Peach, nhấp nháy lệch nhịp);
  **tuyết rơi nhẹ** trên ảnh Merlin (canvas, ≤70 bông, mờ theo mép ảnh nên không bay qua chữ hạn đặt).
  Đèn + tuyết chỉ chạy khi mục đang hiện trên màn hình và tab đang mở, có nút **"Pause the lights & snow"**
  (WCAG 2.2.2: chuyển động tự chạy quá 5 giây phải dừng được; máy khách nhớ lựa chọn). Khách bật "giảm
  chuyển động" (kể cả bật giữa chừng): đèn đứng yên, không tuyết, không nút.
- **Ảnh Merlin mới** (bàn quà, cây thông đèn sáng) thay ảnh mục "Ordering for Christmas?":
  `xmas-merlin2-wide-900/1376.webp` + `xmas-merlin2-phone-640/1024.webp` (bản điện thoại cắt bớt
  ghế sofa; màu trắng kéo về butter để mép ảnh tan vào nền). Ảnh cũ `xmas-merlin-*` đã gỡ.
- **Ảnh các thánh** (`confirmation-saints.webp`): hiện khi khách chọn thánh trong Confirmation gift box
  (chọn "Confirmation gift box" vẫn hiện ảnh hộp Mary). Khoảng nửa số tượng trong ảnh mở mắt (St. Peter,
  St. Francis, St. Michael, St. Carlo, Joan of Arc…), ảnh không phân biệt được tượng 12 cm hay 10 in. Chị
  duyệt "cứ dùng ảnh mở mắt", rồi trả lời: **làm được cả mắt nhắm (sleep eyes) và mắt mở (safety eyes)**.
  → Bỏ câu "Every figure is made with closed eyes"; thêm lựa chọn **Eyes** (Closed (sleeping) eyes / Open
  eyes, cùng giá) cho thánh làm theo yêu cầu 12 cm, St. Carlo, St. Michael — thánh có sẵn giữ nguyên như
  tượng đang có. "What's inside" và Tally `pick` ghi mắt đã chọn (vd. "St. Carlo Acutis, 10 in, open eyes").
  Không dùng chữ "safety eyes" trên trang (Hard Rules cấm tuyên bố "safe"). Chú thích ảnh: "Saints from our
  Confirmation gift set — sample photo, with closed (sleeping) and open eyes."

### Bộ icon SVGator (Elise 16/10, tin nhắn 10) — panel thiết kế
Chị gửi bộ 9 icon GIF của SVGator (giấy phép trong readme: "Free for personal and commercial use, without
attribution", AS-IS) + 2 SVG mẫu + 4 ảnh tham khảo (dây đèn trắng ấm, email kikki.K sao vàng, Google doodle, cây
thông). Panel 3 hướng (tối giản / bám ảnh tham khảo / UX-hiệu năng), 3 giám khảo (thương hiệu · ý chị + UX · a11y +
kỹ thuật) → chọn hướng tối giản + ghép ý hay:
- **Chuông của Merlin** (icon chuông, khung tĩnh, đổi màu) treo bằng sợi chỉ từ dây đèn, phía trên "Christmas".
- **Dây đèn trắng ấm** trên dây sẫm võng tay (theo ảnh 29 chị gửi), 1 bóng/72px, sáng "thở" nhẹ, vẫn có nút tạm dừng.
- **Tia sao mảnh vàng beret** (theo kikki.K) thay sao 4 cánh nhiều màu — cạnh "Build your gift", "favors",
  vầng sáng Merlin và tiêu đề Giáng sinh (giữ quanh năm, trừ mục Giáng sinh).
- Không dùng 8 icon còn lại (confetti, teal, nhún/bounce, nhân vật hoạt hình, nến trùng motif đèn), không dùng GIF
  động (nặng 50–275 KB, không dừng được), không dùng SVG mẫu/ảnh của thương hiệu khác.
- **Công tắc mùa** `data-season="christmas"` + tự gỡ mục Giáng sinh từ 26/12 (giờ máy khách).
- Đề xuất **chưa làm** (chờ chị): nhãn "Order by Nov 8" kèm chuông trên thẻ ý tưởng "Christmas gift for friends &
  family"; chuông lắc nhẹ 1 lần khi cuộn tới; 1 bóng đỏ berry trong mỗi 5 bóng.

### Elise 16/10, tin nhắn 11 — đã làm
- Tự gỡ mục Giáng sinh **hết dịp năm mới**: từ 0h 2/1/2027 (giờ máy khách), kể cả nhãn hạn đặt.
- Nhãn **"Order by Nov 8"** + chuông trên thẻ "Christmas gift for friends & family", tự biến mất sau 8/11.
- Chuông của Merlin **lắc nhẹ 1 lần** khi khách cuộn tới; dây đèn xen **1 bóng đỏ + 1 bóng xanh lá** mỗi 5 bóng.
- Viền vầng sáng quanh ảnh Merlin cuối trang **mỏng lại**.
- Tượng thánh làm được cả mắt nhắm và mắt mở (kể cả St. Carlo, St. Michael 10 in) — trang đã đúng.
- Đang làm tiếp: **lá vàng + bông tuyết rơi + cây thông** (Giáng sinh Texas), cắt từ ảnh chị đã gửi; video "bé
  nhép miệng" — chờ chị gửi file.

### Elise 16/10, tin nhắn 12 — đã làm
- Thánh có sẵn: không chọn mắt (chị: đúng ý).
- **Catalog Canva:** bỏ link (trang giá lệch giá trang web); chỉ đưa **6 trang chọn len** vào bước "Yarn" của Custom
  Pet Crochet ("See every yarn color", đóng sẵn, ảnh chỉ tải khi mở; khách ghi mã màu C-25 / V-04… trong đơn). Bỏ
  trang giới thiệu (có "children refuse to put down", "Finished in Texas") và trang mẫu len in.
- **Giao hàng 2–3 tuần sau khi làm xong** (mùa lễ Thanksgiving, Christmas): ở "How it works", mục Giáng sinh, và hộp
  "What's inside" khi chọn ship.
- **Video Merlin** (Gemini, chị gửi): ảnh đầu trang chuyển thành video 10 giây, phát 1 lần, không tiếng, có nút
  dừng/phát lại; khung đầu khớp ảnh nên chuyển liền mạch; nhẹ 260–470 KB (bản gốc 2,9 MB); theo công tắc mùa.

### Còn chờ chị
1. Hạn đặt Giáng sinh: CN 8/11 + làm 2–4 tuần + giao 2–3 tuần → chậm nhất ~27/12 (sau Giáng sinh). "2–4 tuần" là
   thời gian làm hay đã gồm cả giao? Có cần dời hạn sớm hơn không?
2. Nhận tại Pearland (pickup): cũng cần 2–3 tuần sau khi làm xong (hàng từ Việt Nam) không?
3. Video Merlin có tiếng nói không? Nếu chị muốn bật tiếng, gửi em lời thoại để làm phụ đề.
4. Sau mùa lễ: thay ảnh hero (mục Giáng sinh + video tự ẩn từ 2/1/2027).

## 9. Link & tài nguyên

- **Repo branch:** `claude/purrlight-studio-website-kcsuen` (GitHub:
  elisehanhnguyenus-cloud/purrlight-skills)
- **Site LIVE (GitHub Pages, 15/10):** https://elisehanhnguyenus-cloud.github.io/purrlight-skills/
- **Custom Orders landing page:** https://elisehanhnguyenus-cloud.github.io/purrlight-skills/custom-orders/ · brief: https://app.notion.com/p/3fa8ed608af981759ba7f10a4ab625fa
- **Shop Etsy (nguồn giá):** https://vietdelightfinds.etsy.com
- **Preview tương tác (artifact, v9):** https://claude.ai/artifact/TPXZGeR5JBpKJypioewheS
- **Event Desk (hosted, dùng tại booth):** https://claude.ai/artifact/JDd4fYwxtDvRmpf1UGs5rW
- **Event Desk — hướng dẫn cho nhân sự (Notion):** https://app.notion.com/p/3ea8ed608af981fca71ee10c1128a543
- **README kỹ thuật:** `website/README.md`
- Tài liệu này: `docs/PURRLIGHT-WEBSITE-TONG-HOP.md` (bản Notion đồng bộ
  cùng nội dung)
