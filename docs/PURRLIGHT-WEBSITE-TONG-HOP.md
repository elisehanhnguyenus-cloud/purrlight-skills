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
10. ☑ Email canon hello@purrlight.studio (domain cũ = 0 chỗ)
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
8. 🟡 Hộp thư hello@purrlight.studio chưa xác nhận hoạt động.
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
4. Audit tự động: 79 chuỗi copy/giá của brief phải có mặt nguyên văn, quét từ
   cấm, alt/width/height/lazy, mọi nút → ORDER_FORM_URL (+utm), 1 h1, title +
   meta + og:image, không tràn 360/390/1280, 0 lỗi console; test tương tác
   Playwright (bảng giá, nhóm chỉ-bản-in, nhãn giá động, stepper, copy, start
   over, thanh dính, bàn phím, nhớ lựa chọn, dải ảnh).

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
