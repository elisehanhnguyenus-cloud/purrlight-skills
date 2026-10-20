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
("purr" + "light"), trăng/sao chỉ dùng trang trí. Email canon
hello@purrlight.studio · domain purrlight.studio — **chưa đăng ký**, nên từ 16/10
toàn site dùng tạm **purrlightstudiollc@gmail.com** (Elise chốt).
Safe phrases: "From Merlin's notebook", "Sketched by Merlin, stitched by us",
"the cat who takes notes". CẤM: magical/blessed/spell/manifest (TOS Etsy).

## Cấu trúc

```
website/
├── index.html        # Trang chủ (cấu trúc chapter): hero, trust bar, danh mục,
│                     #   favorites, video, story, Meet Merlin & friends,
│                     #   Purrks (launching soon), journal, gifting, newsletter
├── shop.html         # Trang shop: lưới sản phẩm + lọc theo danh mục
├── product.html      # Trang chi tiết sản phẩm (đọc ?id=... từ URL)
├── about.html        # Câu chuyện thương hiệu (hai tầng: sự thật / storybook)
├── partners.html     # Partner/affiliate program cho shopper curators
├── event.html        # ★ EVENT DESK — bàn bán hàng tại sự kiện (nội bộ, noindex)
├── confirm.html      # Trang khách mở từ link/QR: thank-you hoặc order confirmation
├── content/
│   └── follow.json   # ★ DẢI ẢNH "FOLLOW" cuối mọi trang khách: tiêu đề, link mạng xã hội, 3–12 ô ảnh
├── manifest.webmanifest  # "Add to Home Screen" cho event.html trên điện thoại
├── custom-orders/    # ★ LANDING PAGE CUSTOM ORDERS (từ Linktree) — xem mục riêng bên dưới
│   ├── index.html    #   copy + giá nguyên văn theo Handoff Brief (Notion 15/10)
│   ├── prices.js     #   ORDER_FORM_URL + bảng giá (= brief §3) + công thức ước tính
│   ├── custom-orders.js  # builder "Build your piece", thanh đặt hàng dính, link form
│   └── custom-orders.css # style riêng (token Brand v2), nạp sau css/fonts.css
├── deploy-pages.sh   # ★ Deploy lại lên GitHub Pages: bash website/deploy-pages.sh
├── css/
│   ├── fonts.css     # Font self-host: Fraunces (heading) + Figtree (body)
│   ├── style.css     # Toàn bộ style site — design tokens ở đầu file (:root)
│   └── desk.css      # Style riêng cho event.html + confirm.html (nạp sau style.css)
├── js/
│   ├── products.js   # ★ DỮ LIỆU SẢN PHẨM — sửa giá/tên/mô tả ở đây
│   ├── main.js       # Nav mobile, render sản phẩm, lọc, trang chi tiết
│   ├── follow.js     # Vẽ dải ảnh "follow" từ content/follow.json (6 trang khách, trên footer)
│   ├── event-desk.js # ★ EVENT DESK — cấu hình (DESK_CONFIG) + lời văn + logic
│   └── vendor/qrcode.min.js  # QR (MIT, qrcode-generator 1.4.4) — chỉ event.html dùng
└── assets/
    ├── brand/        # logo-flat.png, favicon — KHÔNG vẽ lại, KHÔNG AI-generate
    ├── fonts/        # File .woff2 (đã tải sẵn, có subset tiếng Việt)
    ├── video/        # video trang chủ (reel-*.mp4) + video Merlin của Custom Orders
    └── img/          # companion-*.svg = 3 nhân vật "joining soon" (hình phác thảo duy nhất còn lại)
        ├── products/ # ★ ẢNH SẢN PHẨM (vuông) — <id>-600.webp cho thẻ, <id>.webp ≤1000px cho trang sản phẩm
        ├── home/     # ảnh thật của trang chủ / About + poster video
        └── custom/   # Ảnh trang Custom Orders (WebP ≤ 200 KB) + og-custom-orders-merlin.jpg (ảnh share link từ 17/10; og-custom-orders.jpg cũ giữ cho link đã share)
```

## Dải ảnh "follow" cuối trang (20/10/2026, kiểu Mushie)

- 6 trang khách (index, shop, product, about, partners, confirm) có `<section data-follow hidden>` ngay trên footer;
  `js/follow.js` đọc `content/follow.json` và vẽ: kicker + tiêu đề, lưới ảnh vuông sát mép (6 cột, điện thoại 3×2),
  rê chuột/tab hiện tên mạng, nút "watch on TikTok · pin us on Pinterest · find us on Facebook".
- **Đổi ảnh / link:** sửa `content/follow.json` (hoặc trong admin `/admin/` khi đã đăng nhập). Mỗi ô: `image`
  (đường dẫn trong site, ví dụ `assets/img/products/<id>-600.webp`, hoặc ảnh upload qua admin), `alt` (tiếng Anh),
  `network` (instagram / tiktok / pinterest / facebook), `link` (link bài cụ thể — bỏ trống thì về trang hồ sơ),
  `rights` (`own` / `customer`) và `credit` (`@handle` — bắt buộc khi là ảnh khách, hiện "photo: @handle").
- **Instagram:** `profiles.instagram` đang để trống vì @purrlightstudio trên Instagram là của người khác (Brand
  Canon v2). Chị gửi đúng handle → điền link vào đó là nút "follow on Instagram" và các ô `instagram` tự trỏ về.
- An toàn: link chỉ nhận `https://` (link lạ bị bỏ, về trang hồ sơ); chữ đưa vào bằng textContent, không innerHTML.
  Không có dữ liệu hoặc mở bằng file:// → dải ảnh ẩn, trang vẫn bình thường.
- Dải "Purrlight, daily" cũ ở giữa trang chủ đã gỡ (nội dung chuyển vào dải mới, không lặp 2 lần).

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
25/09/2026), điều khoản cọc 50% (25/09), thời gian làm & giao (Elise 16–17/10, giống trang
Custom Orders: hàng custom mùa lễ làm 2–3 tuần — len Fluffy thêm khoảng 2 tuần — rồi 2–3 tuần
từ xưởng Việt Nam tới khách, trong 15 ngày tới Pearland; ngoài mùa lễ tới khách trong 15 ngày;
hàng làm theo đơn ngoài mùa lễ vẫn "typically 10–14 days" của skill CSKH — câu khách đọc chọn theo **ngày của đơn**:
đơn trước `seasonEnd` 2/1/2027 nhận số mùa lễ, từ đó nhận `offText`; len Fluffy gọi đúng tên trong desk "Rabbit Fluff
Fur"), dòng
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
purrlightstudiollc@gmail.com (tạm, tới khi có purrlight.studio) hoạt động và đăng nhập app Mail trên máy đứng booth
bằng hộp thư đó (thư ký "Elise · Purrlight Studio", khách sẽ *reply* vào
đó để gửi ảnh mèo); (2) chốt trạng thái permit thuế Texas → chọn chế độ thuế
trong ⚙; (3) gửi thử cả hai loại thư từ chính điện thoại của chị (Gmail /
iOS Mail có thể cắt thư quá dài — tool đã nhắc dùng Copy khi > 1.900 ký tự);
(4) từ 20/10 bóng cảm xúc, búp bê linen và búp bê Americana đã là món catalog (giá theo Etsy); `extraItems` chỉ
còn "Catnip ball" (gõ giá tại booth). Món có nhiều lựa chọn giá (`priceFrom`) hiện "from $X" — người đứng booth gõ
giá của lựa chọn khách mua. Danh sách chip có thanh cuộn riêng để dòng đơn và tổng tiền luôn gần.

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

## Catalog — nguồn sự thật (cập nhật 20/10/2026: đủ 31 món)

- `js/products.js` = **toàn bộ 31 listing đang bán** của shop Etsy VietDelightFinds (shop hiện 32 — bỏ listing
  "International shipping service" $8 vì là phí ship, không phải sản phẩm). Thứ tự = thứ tự shop trên Etsy.
- **Cách lấy dữ liệu** (trang Etsy chặn bot, nhưng hai đường này mở được):
  - `https://www.etsy.com/shop/VietDelightFinds?format=rss` → trang shop đầy đủ: 32 listing, giá, giá giảm, video,
    9 section kèm `section_id`;
  - `https://www.etsy.com/shop/VietDelightFinds/rss?section_id=<id>` → mô tả đầy đủ + ảnh chính của từng listing
    trong section (RSS thường chỉ có 10 món mới nhất; theo section thì đủ cả shop). Listing không nằm trong section
    nào (custom pet Grand) có trong RSS thường.
  - Trang từng listing (`/listing/<id>`) vẫn bị chặn → mỗi món chỉ có **ảnh chính** của listing.
- **Nội dung**: mỗi món được một agent viết chỉ từ mô tả listing (Brand Canon v2: không toy/plush/nursery/kids/baby,
  không safe/hypoallergenic, không free shipping, không hẹn ngày giao…) rồi agent thứ hai soi lại từng fact. Tên trên
  site là tên của mình, không chép tiêu đề SEO. Riêng custom pet Grand giữ "made from your photos" (quy trình chị
  duyệt 25/09, listing chưa ghi). Giá = giá gốc; giảm giá nằm trong `SALES` (cần ngày kết thúc). **20/10:** 5 món
  giảm 25% như Etsy tới hết Chủ nhật 25/10 (giờ Central) — bộ váy rửa tội, Maine Coon, Rosary charm, Saint Joan,
  Americana; hết hạn site tự về giá gốc (cả trang đang mở và Event Desk). Món "from" đang giảm: Event Desk nhắc gõ
  **giá đã giảm** của lựa chọn khách mua.
- **Món "chìm" (`QUIET` trong `products.js`, chị chốt 20/10):** vẫn bán, nhưng luôn nằm **cuối** shop và cuối từng
  collection, không bao giờ lên trang chủ hay mục "You may also like": cừu và thiên thần (ảnh không phải của chị),
  4 ảnh trông như ảnh dựng (Ginger, British Shorthair, bộ 4 thú, mèo trắng), và mẫu rồng PDF (chị để chìm để thử xem
  khách có muốn mua pattern không). Bỏ món khỏi danh sách = nó về đúng thứ tự Etsy.
- **Dòng an toàn chuẩn (đổi 20/10)** trên trang sản phẩm và thư cảm ơn của Event Desk: "Handmade decorative keepsake
  for adults and collectors. Not a toy and not tested as a children's product. Keep away from young children and
  open flame. Spot clean only." — hàng chưa kiểm nghiệm CPSIA nên site và Etsy cùng nói đây là đồ trang trí/kỷ niệm
  cho người lớn (câu cũ "for adult-guided use… Not suitable for children under 3" là kiểu nhãn đồ chơi trẻ em từ 3
  tuổi). Bản viết lại cho Etsy: `docs/ETSY-LISTING-REWRITE-2026-10-20.md`.
- **Collection**: 7 collection canon đều đã có hàng — Storybook (3), Feelings & Calm (7), Faith & Milestones (5),
  Merlin's World (8), Little Things (3), Heritage & Celebration (4), Patterns & Printables (1). George Washington
  chuyển từ Storybook sang Heritage & Celebration (đúng chủ đề 250 năm nước Mỹ).
- **Ảnh sản phẩm**: `assets/img/products/<id>-600.webp` (thẻ sản phẩm, ô danh mục) và `<id>.webp` (trang sản phẩm,
  tới 1000 px; chỉ có khi ảnh gốc lớn hơn 600 px). Cắt vuông để bỏ chữ, nhãn "Freeship/Freegift", logo Viet Delight.
  Ba ảnh được xoá logo Viet Delight / hộp chữ bằng ffmpeg (gown, Siamese, Saint Joan). **Không bao giờ xoá dấu/chữ
  ký có thể là của người khác** (xoá dấu bản quyền là sai) — 4 ảnh có dấu lạ không bị sửa (ảnh Feelings Faces chỉ cắt vuông nên
  con dấu "be thankful…" nằm ngoài khung). Chị chốt 20/10: cừu và thiên thần không phải ảnh của chị nhưng vẫn dùng,
  chỉ không đưa lên đầu trang (→ `QUIET`). Lời dặn giặt trên site chỉ giữ phần "spot clean" cho
  khớp dòng an toàn chuẩn ("Spot clean only"); listing nào ghi giặt tay thì đã ghi vào danh sách sửa Etsy.
- `priceFrom: true` = listing có lựa chọn làm đổi giá (size, 1 con hay cặp, bộ 3 hay 6…): site ghi "from $X", Event Desk
  bắt gõ giá của lựa chọn khách mua (7 món: Maine Coon, Sense & Sensibility, George Washington, vườn len, Feelings
  Faces, Saint Joan, cầu thủ bóng đá).
  `assets/img/etsy/` cũ đã gỡ.
- **Việc cần chị sửa phía Etsy** (claim an toàn trẻ em, ảnh có dấu của người khác, ảnh có thể là AI render, giá/nội
  dung bộ chưa rõ…): xem `docs/ETSY-LISTING-FIXES-2026-10-20.md`.
- Thêm món mới: copy một block trong `products.js`, dán link listing, đặt ảnh vuông vào `assets/img/products/`.

## Ảnh & video trên các trang (20/10/2026 — chị yêu cầu: rõ ràng, không mockup quá đà)

Mọi khối ảnh minh hoạ SVG (Merlin trên trăng, cuộn len vẽ, poster video vẽ, tile "soon", ảnh About) đã thay bằng
ảnh/video thật, trong `assets/img/home/` và `assets/video/`:

| Khối | Ảnh/video |
|---|---|
| Hero trang chủ | bàn đầy mèo len (`hero-crochet-cats-*.webp`) + ảnh tròn **Merlin thật** (`merlin-real-360.webp`) |
| Chapter four | 4 video thật từ listing Etsy (mèo len trên sofa, búp bê linen, đóng gói bộ Anne, bộ đồ rửa tội) — tự chạy không tiếng khi ≥ 50% trong màn hình, dừng khi cuộn qua / đổi tab, **không** chạy khi người xem bật giảm chuyển động hoặc Save-Data |
| Câu chuyện | len chenille trên tay (`story-yarn-hand-*.webp`) |
| Meet Merlin & friends | Merlin = ảnh thật; Tâm, Bánh Mì, Mochi giữ hình phác thảo (nhân vật "joining soon", chưa có ảnh thật) |
| Journal (3 thẻ) | Merlin, bộ đồ rửa tội, hàng thánh |
| Purrlight, daily | 6 ảnh sản phẩm thật |
| Danh mục / Favorites | ảnh sản phẩm thật (chọn ảnh sạch, không dùng ảnh có dấu lạ / nghi AI) |
| About | Merlin giữa quà và len (`about-merlin-studio-*.webp`) |

## Custom Orders — landing page từ Linktree (`custom-orders/`)

URL: `https://elisehanhnguyenus-cloud.github.io/purrlight-skills/custom-orders/`
(sau này `purrlight.studio/custom-orders/`). Dựng lại từ bản v1 (artifact
"Purrlight Custom Orders Catalog") theo **Handoff Brief** trên Notion
(Morgan/Elise 15/10/2026): giữ nguyên **từng câu copy và từng giá** ở brief
§3, bỏ toàn bộ style v1, restyle bằng token Brand Identity v2, mobile-first,
ảnh WebP lazy-load. Cảm hứng tương tác lấy từ OREOiD (oreo.com/oreoid): chọn
→ thấy giá ngay → đặt hàng. Bố cục chốt qua panel 3 designer + 3 judge
(hướng "mobile conversion first" thắng 3/3).

**Cấu trúc trang (bản 4 — "gift studio" kiểu OREOiD, 15/10/2026):** header
site → hero gọn (§3.0, không ảnh; nút "Place your order" + link "Build your
gift") → **Build your gift**: bước 1 chọn 1 trong 7 món (hàng ảnh = tab; trên
điện thoại vuốt ngang) → mỗi lần chỉ hiện **một** món: bên trái tên, giá, mô tả,
turnaround và các bước 2, 3, 4… dạng ô chọn (size, len, khổ in, giấy, khung,
add-on…); bên phải (dính khi cuộn, desktop) ảnh món + hộp **"What's inside"**:
dòng chính + những thứ đã gồm (✓) + từng add-on vừa chọn hiện mờ dần, rồi
*Estimate*, nút "Place your order", *Copy my pick* / *Start over* / *How it
works*. Ảnh đổi theo lựa chọn (chọn giấy Dó → ảnh bản in Dó). Trên điện thoại:
ảnh ở trên các bước, hộp "What's inside" ở dưới, thanh dính đáy ghi
"Estimate $X · tên món" và báo "Added: …" khi thêm món → How it works (§3.1) →
band Giáng sinh (§3.9) → CTA cuối + Etsy (§3.10) → footer Ink. Link thẳng tới
từng món: `custom-orders/#pet-crochet`, `#portrait-doll`, `#watercolor`,
`#housewarming`, `#christening`, `#godparent`, `#calendar` (dùng cho QR/
Linktree). Trang nhớ món + lựa chọn cuối trên máy (localStorage). Tắt JS: cả 7
món hiện đủ, nối tiếp nhau. Chiều dài trang: điện thoại ~11.200px → ~3.400px,
desktop ~8.900px → ~2.700px. Không tính cọc, số lượng hay giảm 5%/10% (brief để
mở → chỉ in nguyên câu của brief). Nút "Place your order": header (desktop),
hero, trong hộp của từng món, CTA cuối, thanh dính — tất cả = `ORDER_FORM_URL`.

**Bản 5 (15/10/2026, theo quyết định của chị):** thêm hàng **"Or start from a
gift idea"** (bản 5: 3 gói; từ 16/10 là 4 gói, rẻ nhất trước — xem "Chốt 16/10, tin
nhắn 2" bên dưới; giá tính từ chính estimator, bấm là chọn sẵn các ô); bước **số
lượng** cho tranh và hộp tân gia (món 1 giá đủ, món 2–4 giảm 5%, từ món 5 giảm
10%, trên cả món); Godparent **1 hoặc cả hai** (bộ 2 −$10 → $180); mỗi hộp hiện
**Deposit today (50%)** và **Balance after you approve the photo**; bước **Your
photos** (danh sách ảnh cần gửi từng món) và **Message for the card** (doll,
godparent; đi kèm dòng "My pick", không lưu trên máy); hộp tân gia: 4 món cơ bản
+ gift box, add-on +$10 (thêm Chocolate box), mỗi add-on chọn **thêm** hoặc
**đổi** một món cơ bản (món bị đổi hiện gạch ngang trong hộp); mục **Pay your
deposit** (`#pay`): nút Square (link "Custom order" khách tự nhập số tiền — trang
ghi đúng số cọc + nút *Copy deposit amount*), Zelle® tới
`purrlightstudiollc@gmail.com` (nút *Copy address*), QR Square chỉ hiện trên
máy tính, điều khoản cọc lấy từ bản chị duyệt cho booth 25/09.

**Chị cần điền (đầu `prices.js`):**
- `ORDER_FORM_URL` — link form đặt hàng chung cho 7 món. **Hiện là form Tally
  của chị: `https://tally.so/r/M1KOkY`** (16/10/2026; link này cũng ghi sẵn trong
  HTML cho khách tắt JS — đổi thì đổi cả hai). Form có 5 *hidden field* `pick`,
  `product`, `total`, `deposit`, `delivery` — trang tự điền (số tiền luôn có xu, vd
  `46.01`; `delivery` = Ship within Texas / Ship outside Texas / Pickup Saturday /
  Pickup Sunday / Digital file — form có quy tắc: khác "Digital file" thì Phone và
  "Best time…" bắt buộc)
  + `utm_*` từ URL (Linktree gắn `?utm_source=linktree&utm_medium=bio`). Gửi xong
  form đưa khách về `#pay`; email báo đơn về purrlightstudiollc@gmail.com. Dùng
  mailto cũng được (dòng "My pick" vào thân email, kèm dòng trống cho địa chỉ ship
  + giờ nhận). **Không dùng hello@purrlight.studio**: tên miền chưa đăng ký
  (DNS NXDOMAIN, kiểm 15/10/2026). Google Forms bắt khách đăng nhập Google mới tải
  ảnh lên được (hay bị chặn trong trình duyệt của Instagram/TikTok).
- `ORDER_FORM_PREFILL_ENTRY` — chỉ khi dùng Google Form: id ô nhận dòng tóm tắt
  (Form → ⋮ → Get pre-filled link → `entry.xxxx`).
- `PAY.squareUrl`, `PAY.zelleTo` — nơi nhận cọc (đổi cả trong `index.html`
  mục `#pay`, bản cho khách tắt JS). QR Square: `assets/img/custom/square-pay-qr.svg`
  (tạo từ link; đổi link thì tạo lại QR).

**Tải trang (bản 4, đo ở 390px):** 21 request · 480 KB · CLS 0 (desktop 0.006).
Chỉ ảnh của món đang hiện được tải; 6 món còn lại tải khi khách chọn. Font:
Fraunces 500/600, Figtree 400/500/600, và `caveat-early-400-700.woff2` (subset
4 KB chỉ chứa chữ "early"; bản Caveat đầy đủ vẫn ở `css/fonts.css` cho trang
khác). Ảnh hero British Shorthair đã gỡ khỏi web (không còn dùng; lấy lại từ lịch sử git nếu cần).

**Ảnh ghép (16/10, chị yêu cầu):** `watercolor-floating-frame.webp` và
`thumb-memorial.webp` là ảnh ghép — tranh mèo (từ ảnh hộp quà mở) đặt vào ảnh khung
floating thật thay tranh nhà, giấy Dó dựng lại (sợi giấy, màu in dịu); trang ghi
"sample image". Có ảnh chụp thật bản in mèo trên Dó trong khung thì thay ngay.

**Giá nằm ở MỘT chỗ:** `prices.js` (`PRICES`) = brief §3; copy trong
`index.html` in cùng số đó. Đổi giá → sửa cả hai. Test:
`node scratchpad/test-prices.js` (15 nhóm), `test-studio.js` (Playwright: tab,
từng món, phím, nhớ lựa chọn, link #món, chế độ tắt JS, bấm chuột ở 1280px), `audit-custom.js`
(chuỗi copy/giá nguyên văn, từ cấm, ảnh, nút, tràn màn 360/390/1280).

**Giá đã chốt 15/10 (Elise):** khung 4×6 $8 · 5×7 $16 · 8×10 $24; giảm theo
từng món (2–4: 5%, từ 5: 10%) trên cả món; godparent bộ 2 −$10; cọc 50% (nửa
xu làm tròn lên ở tiền cọc); giấy in: giấy thường đã gồm · fine-art +$10 · Dó +$5.
Số tiền ≥ $1,000 có dấu phẩy. Số lượng tối đa 50/đơn trên trang (hơn thì khách ghi
số trong đơn — Elise đồng ý 16/10).
**Chốt 16/10 (Elise):** hộp tân gia basic $60; add-on sen đá +$10 · nến thơm +$10 ·
cold cut +$15 · 3-berry +$10 · chocolate (6 pieces) +$20; món tươi (cold cut, 3-berry)
chỉ pickup; mọi món có bước **Pickup or shipping** (ship miễn phí trong Mỹ — khách ghi
địa chỉ + giờ tiện nhận trong đơn — hoặc pickup tại Pearland Town Center thứ 7 / chủ
nhật); **thuế 8.25% cộng vào mọi đơn** (`salesTaxBp: 825`), cọc 50% tính trên tổng
có thuế; khung: "We'll contact you to confirm your wooden frame."; mùa lễ 2–4 tuần.
**Chốt 16/10, tin nhắn 2 (sau khi tra luật thuế):** đã có permit; **không thu thuế
Texas với đơn ship ra ngoài Texas** (bước Pickup or shipping có 4 lựa chọn: Ship
within Texas · Ship outside Texas · Pickup Saturday · Pickup Sunday; file digital hỏi
"Where you live"); **trái cây (3-berry) không chịu thuế** (`taxFree`); doll **tính
thuế** như mọi món (bỏ "sales tax included"); **cold cut "coming soon"** (chưa có
giấy phép thực phẩm); sen đá/lô hội: "We ship plants within Texas only" (chính sách
của shop, không viện dẫn luật — em tự thêm, chị bỏ được hoặc đổi thành chỉ pickup); lịch chỉ in **Premium Matte**; gói gợi ý: 4 gói, gói rẻ
nhất trước (Pet portrait print $15 · Pet memorial $41 · Realtor closing &
housewarming gift $70 · Christmas gift for friends & family $90).
**Cách đọc còn để mở (ghi trong `prices.js`):** in tranh = giá đã gồm tranh
(không cộng $10 file digital); hộp quà tranh chỉ với bản in; "second pet −$10" = con thứ hai cùng size & len.
**Chốt 16/10, tin nhắn 10 — bộ icon SVGator chị gửi (panel thiết kế 3 hướng + 3 giám khảo):** dùng **1/9 icon**:
chiếc **chuông** (giống chuông vàng trên nơ đỏ của Merlin), khung hình tĩnh, đổi màu theo brand, treo bằng sợi chỉ
từ dây đèn phía trên chữ "Christmas" (`xmas-bell.webp` 3,6 KB + `xmas-bell.LICENSE.txt` trích giấy phép SVGator:
miễn phí thương mại, không cần ghi nguồn). Dây đèn đổi theo ảnh tham khảo của chị: **bóng trắng ấm trên dây sẫm
võng tay** (1 bóng/72px, sáng "thở" nhẹ). Sao cạnh tiêu đề đổi thành **tia sao mảnh vàng beret** (kiểu kikki.K),
thêm ở tiêu đề Giáng sinh. Không dùng: kẹo gậy + bánh gừng (có chấm confetti), quà/tất/thông/quả châu (xanh teal,
chuyển động nhún = "bounce" Brand v2 cấm), tuần lộc (nhân vật hoạt hình cạnh Merlin), nến (trùng motif đèn); không
dùng GIF động (50–275 KB/icon, không dừng được theo WCAG 2.2.2); 2 SVG mẫu (quả cầu tuyết, nút Subscribe) và các ảnh
kikki.K/Google là tác phẩm của người khác — chỉ tham khảo. **Công tắc mùa:** `data-season="christmas"` trên `<html>`;
từ 0h ngày **26/12** (giờ máy khách) trang tự ẩn cả mục Giáng sinh (chờ chị chọn 26/12 hay 2/1: `SEASON_END` đầu
`custom-orders.js`). Mọi chỗ cần gỡ sau mùa ghi "SEASONAL Christmas 2026".
**Chốt 16/10, tin nhắn 11b — lá vàng, bông tuyết, cây thông (Giáng sinh Texas; panel 3 hướng + 3 giám khảo):** tất cả
nằm trong mục Giáng sinh. Canvas tuyết cũ giờ rơi 3 thứ: chấm tuyết nhỏ (≤44), **bông tuyết 6 cánh** (≤6 máy tính / ≤3
điện thoại) và **lá vàng Texas** vẽ tay (cottonwood, pecan, cedar elm; màu vàng beret #CA8D41, viền kem; 5 lá máy tính /
4 lá điện thoại), tránh cột của Merlin và chữ; dùng chung nút **"Pause the lights, snow & leaves"**. **Cành vân sam +
quả thông** cắt từ ảnh Merlin của chị (ảnh 15) treo góc trái dưới dây đèn, có 1 lá vàng đứng yên; **cành thông lá dài**
(ảnh 16, thông loblolly Đông Texas) góc trái dưới, chỉ ≥1260px; cuối trang **cành thông + quả thông + 1 lá vàng** sau
ảnh Merlin, viền vầng sáng 3px. Ảnh: `xmas-pine-corner.webp`, `xmas-pine-ground.webp`, `xmas-bough.webp` (18–24 KB).
Mọi thứ theo công tắc mùa, gỡ cùng mục Giáng sinh. Không làm: lá/tuyết rơi trên ảnh đầu trang (đè video Merlin), cành
thông ở tiêu đề "Build your gift", vòng hoa hộp quà (lặp ảnh).
**Chốt 18/10:** phụ đề video đúng lời (chị xác nhận); ngoài mùa lễ len Fluffy 2–3 tuần tùy độ khó (`TIMING.fluffy.offSeason`,
Event Desk `offText`); hạn đặt **len Fluffy 25/10** (dòng đầu trong mục Giáng sinh, `#xmas-by-fluffy`; qua hạn hộp ghi "may not
arrive by Christmas"); video Merlin có tiếng + phụ đề (xem (4) ở tin 12).
**Chốt 17/10 — chị trả lời các câu hỏi về thời gian giao:** (1) chờ hàng từ xưởng Việt Nam chỉ áp dụng cho **hàng len
móc làm theo đơn**; hàng có sẵn giao ngay → len làm theo đơn: làm 2–3 tuần, rồi **2–3 tuần tới khách, trong 15 ngày
ở Pearland** (cả khách nhận tại Pearland Town Center: "ready for pickup within 15 days after that"); câu "3 ngày–1 tuần
trong Texas" của tin 13 không còn dùng cho len làm theo đơn. (2) **Đơn sau hạn vẫn gửi như thường** → bỏ "delivered in
2027": mục Giáng sinh ghi "Orders placed after these dates still ship, but may not arrive by Christmas.", hộp thêm
"may not arrive by Christmas" (nhận tại chỗ: "may not be ready by Christmas"); thẻ "Ships within …" giữ nguyên quanh năm.
(3) Thánh có sẵn đặt sau 15/11 vẫn giao kịp mùa lễ → không ghi gì thêm. (4) **Alaska, Hawaii: 7–8 ngày trở lên** (hộp khi
ship ngoài Texas; dòng riêng trong danh sách mục Giáng sinh). (5) **Len Fluffy thêm khoảng 2 tuần** → thẻ "Ships within
3 weeks · Fluffy yarn: within 5 weeks", ô Fluffy ghi "about 2 weeks more to make", hộp "made in 4–5 weeks". (6) Event
Desk đổi theo số mới (`timelines` trong `js/event-desk.js`). Mục Giáng sinh: danh sách thời gian gập sau nút
"See holiday timing" (17/10, chị đồng ý), mục đứng yên khi mở (căn trên, không căn giữa), in ra thì tự mở danh sách.
**Chốt 16/10, tin nhắn 14 — thời gian giao còn lại + "Ships within":** hộp quà tân gia và lịch làm 3–5 ngày, giao
2–3 ngày ở Pearland, 3–6 ngày nơi khác ở Mỹ (trừ Alaska, Hawaii — trang ghi "Alaska and Hawaii: longer"); hộp
Confirmation thánh làm theo yêu cầu = như búp bê (thời gian hàng len); thánh có sẵn giao từ 12/11: 2 ngày ở Pearland,
3–7 ngày trong nước. Số của hộp quà/lịch/thánh có sẵn không phải số mùa lễ nên giữ sau mùa; len và tranh ngoài mùa vẫn
"delivered within 15 days". Thẻ sản phẩm: "Turnaround: …" → **"Ships within 3 weeks"** (búp bê, thú cưng, godparent),
**"Ships within 5 days"** (tranh, hộp tân gia) — chị đồng ý đề xuất FTC. Mục Giáng sinh: danh sách 4 dòng (`.xmas-times`)
"For orders placed by these dates", **gập sẵn** sau nút "See holiday timing" (chị 17/10: mục quá dài, cần tối giản —
trên trang chỉ còn tiêu đề, hai hạn đặt, câu "delivered in 2027", nút xem thêm và câu "order early"; hộp "What's inside"
của từng món vẫn ghi thời gian riêng). Sau hạn đặt (len 8/11; tranh, lịch, hộp quà kể cả thánh có sẵn
15/11) hộp "What's inside" ghi "delivered in 2027" như câu của chị trong mục Giáng sinh, và dòng "Ships within …" trên
thẻ sản phẩm đổi thành "Orders placed now are delivered in 2027" (tranh: "Prints & add-ons ordered now are delivered in
2027 · digital files sent within 5 days"; Christening: "a saint made for you, ordered now, is delivered in 2027") để
hai câu không trái nhau; hết mùa thì về như cũ. Cách làm: trong `.turnaround`, đoạn chỉ đúng tới hạn đặt nằm trong
`<span data-late="yarn|paint|box">` (chữ thay bằng `data-late-text` nếu có). Tranh kèm chuỗi tràng hạt vẫn theo thời gian tranh (chị chưa cho số
riêng cho chuỗi). Code: `TIMING`, `timingKind()`, `timingNote()` trong `prices.js`; `orderBy()`/`isLate()`
đầu `custom-orders.js` đọc hai `<time>` (`#xmas-by-crochet`, `#xmas-by-paint`).
**Chốt 16/10, tin nhắn 13 — thời gian làm & giao:** mùa lễ: hàng len làm 2–3 tuần, giao 3 ngày–1 tuần trong Texas /
2–3 tuần nơi khác ở Mỹ; tranh làm 3–5 ngày, giao 3 ngày–1 tuần (2–3 ngày ở Pearland); ngoài mùa lễ giao tối đa 15 ngày.
Code: `TIMING` + `timingNote()` trong `prices.js` (hộp "What's inside" khi ship), danh sách "Holiday timing" trong mục Giáng sinh.
**Chốt 16/10, tin nhắn 12:** (1) Thánh có sẵn không chọn mắt — đúng ý chị. (2) **Bảng màu len** từ catalog Canva
của chị: chỉ lấy 6 trang chọn len (cotton trơn ×2, cotton mix, velvet ×2, fluffy — trang fluffy ghi "+$15–30", khớp
giá Fluffy trên trang), **không gắn link catalog** (các trang giá lệch giá trang). Ở bước "Yarn" của Custom Pet
Crochet: "See every yarn color" (đóng sẵn, ảnh chỉ tải khi mở; mỗi trang mở cỡ lớn để đọc mã), khách ghi mã màu (vd.
C-25, V-04) trong đơn. Ảnh: `assets/img/custom/yarn-book-*.webp` (render 2x từ trang Canva, cắt bỏ thanh công cụ).
(3) **Thời gian giao**: chị nói giao 2–3 tuần sau khi làm xong (Thanksgiving, Christmas làm vận chuyển chậm) — **đã
thay bằng số chi tiết của tin nhắn 13 và 14 ở trên**: dòng ghi chú trong hộp "What's inside" khi chọn ship (không hiện
khi nhận tại chỗ, file digital, bộ váy làm sẵn) và danh sách trong mục Giáng sinh; "How it works" không ghi số cố định.
Trang len đã cắt chỉ còn lưới màu (bỏ chữ "COLOURS", "overleaf", chữ lỗi trang
Fluffy, dòng hội chợ, tên "Baby pink" của V-03, ô trống) + danh sách mã và tên dạng chữ ("Codes and names as text"). Câu "allow 2–4 weeks" (thời gian làm, chị chốt 16/10) giữ
nguyên. (4) **Video Merlin** (`assets/video/hero-merlin-voice-960.{webm,mp4}` + bản điện thoại 4:3
`hero-merlin-voice-phone-640.*`, 380–590 KB): ảnh đầu trang "sống dậy" — khung đầu = ảnh hero (đã chỉnh tông khớp ảnh), phát
**1 lần** 10 giây, rồi mờ về ảnh. **Có tiếng từ 18/10** (chị: "video mở không có tiếng"): tự chạy thì tắt tiếng (trình duyệt
chỉ cho tự chạy khi tắt tiếng), nút **"Sound on"** phát giọng Merlin từ đầu ("Sound off" để tắt); WebM có tiếng Opus, MP4
tiếng AAC (Safari/iPhone). **Phụ đề** hiện khi video chạy (WCAG 1.2.2): "Christmas is coming very close now. / Wishing you a
very peaceful holiday season, / warmth with your family and loved ones." — chép bằng Whisper (3 mô hình cùng ra một câu),
`HERO_CC` trong `custom-orders.js`. Chuyển tab thì video (và tiếng) dừng. Nút "Pause video" / "Play video"; chỉ chạy sau
khi trang tải xong, khi đầu trang đang hiện; không chạy khi khách bật giảm chuyển động / tiết kiệm dữ liệu, và hết mùa
(2/1/2027) thì thôi. Code: cuối `custom-orders.js` ("Merlin says hello").
**Chốt 16/10, tin nhắn 11:** mục Giáng sinh tự gỡ **hết dịp năm mới** — từ 0h **2/1/2027** (giờ máy khách);
nhãn **"Order by Nov 8"** kèm chuông trên thẻ ý tưởng "Christmas gift for friends & family" (đọc ngày từ mục Giáng
sinh, tự biến mất sau hết ngày 8/11); chuông **lắc nhẹ 1 lần** (1,4 giây) khi khách cuộn tới (không khi đã tạm dừng
/ giảm chuyển động / tiết kiệm dữ liệu); dây đèn xen **1 bóng đỏ berry + 1 bóng xanh lá** trong mỗi 5 bóng; viền
vầng sáng quanh ảnh Merlin cuối trang **mỏng lại** (6px điện thoại / 8px máy tính). Tượng thánh: chị xác nhận làm
được cả mắt nhắm và mắt mở (kể cả 10 in).
**Chốt 16/10, tin nhắn 9 — nền + đèn + tuyết, ảnh thánh, ảnh Merlin mới:** section xen kẽ hai màu phẳng
cream / butter-soft (không gradient, không ảnh sau chữ); "How it works" có sợi chỉ móc + cuộn len nét Peach.
Đèn thay confetti (Brand v2 cấm confetti): sao nhỏ cạnh tiêu đề "Build your gift" và "Wedding & party favors"
(lấp lánh 2 lần khi hiện ra rồi đứng yên — WCAG 2.2.2 cấm chuyển động tự chạy quá 5 giây mà không có nút dừng),
vầng sáng đèn sau ảnh Merlin cuối trang, dây đèn mép trên mục Giáng sinh + tuyết rơi nhẹ trên ảnh Merlin (chỉ
chạy khi mục đang hiện; nút **"Pause the lights & snow"** góc dưới mục, máy khách nhớ lựa chọn). Giảm chuyển
động (kể cả bật giữa chừng): đèn đứng yên, không tuyết, không nút. Ảnh Giáng sinh mới `xmas-merlin2-*` (ảnh cũ
đã gỡ). Ảnh các thánh `confirmation-saints.webp` hiện khi khách chọn thánh (chú thích: xem dưới).
Mắt tượng (chị trả lời 16/10): làm được cả **mắt nhắm (sleeping)** và **mắt mở** → bước chọn thánh có thêm
"Eyes" (Closed (sleeping) eyes / Open eyes, cùng giá) cho thánh làm theo yêu cầu 12 cm, St. Carlo, St. Michael;
thánh có sẵn thì giữ nguyên như tượng đang có (không chọn mắt). Lựa chọn vào "What's inside" và Tally `pick`.
Trang không dùng chữ "safety eyes" (Hard Rules cấm tuyên bố "safe"). Chú thích ảnh: "Saints from our Confirmation
gift set — sample photo, with closed (sleeping) and open eyes." Code: nền section ở khối "grounds and small lights" cuối `custom-orders.css` (`.how, .closing`), sợi chỉ
ở `.how .section-title::after`; đèn/tuyết/nút ở cuối `custom-orders.js` ("small lights").
**Chốt 16/10, tin nhắn 8 — hiệu ứng chuyển động (ngoại lệ Brand Canon "no transforms", chị duyệt):**
các phần hiện dần + trượt lên khi cuộn tới (thẻ trong một hàng hiện lần lượt), thẻ nổi lên khi rê chuột
(chỉ máy có chuột), ảnh nền hero / Giáng sinh trôi nhẹ khi cuộn (≥900px). Tắt hết khi máy khách bật
"giảm chuyển động"; không JS thì mọi thứ hiện sẵn. Code: cuối `custom-orders.js` (html.motion, .rv/.in)
và cuối `custom-orders.css`.
**Chốt 16/10, tin nhắn 7:** mục **"Wedding & party favors" — Coming soon** (sau mục Giáng sinh):
muỗng xà cừ buộc nơ satin trên thiệp cảm ơn, cho đám cưới / tiệc; 5 ảnh mẫu chị gửi (bản không
watermark: `favors-*.webp`), chưa có giá, chưa đặt được. Bước chọn muỗng trong hộp tân gia có link
"coming soon" tới mục này.
**Chốt 16/10, tin nhắn 6:** (1) giảm 25% bộ váy **đồng bộ cả trang Shop** (thẻ sản phẩm, trang
sản phẩm, Event Desk) qua `SALES` trong `js/products.js` — tự hết hạn cùng lúc với `gownSale` trong
`custom-orders/prices.js` (đổi thì đổi cả hai). (2) Bộ váy: **cho bé gái, ready to ship 2–3 ngày**;
"Christening outfit for boys (coming 2027)". (3) **Confirmation gift box đặt được**, giao sau 12/11:
tượng 12 cm (thánh có sẵn hoặc làm theo yêu cầu) $55 · St. Carlo Acutis / St. Michael the Archangel
10 in $90; mọi tượng nhắm mắt; khách ghi tên thánh trong form. (4) "How it works" 4 bước: cọc →
**mockup thiết kế trước khi làm** → báo đang làm, cập nhật tiến độ sau ~1 tuần → ảnh thành phẩm.
(5) Add-on hộp tân gia: **muỗng xà cừ** 2 cái $12 · 4 cái $24 (chị chốt $24), 4 kiểu có ảnh (trắng
chạm lá · vỏ nâu chạm lá · cán gỗ · cán xanh khảm); ảnh đổi theo kiểu khách chọn. Ảnh muỗng nhà cung
cấp có watermark "TOPKIN" KHÔNG dùng.
**Chốt 16/10, tin nhắn 5:** (1) **popup Tally** — nút "Place your order" mở form Tally ngay trên
trang (góc phải dưới, rộng 376px; điện thoại: cao tối đa 62% màn hình), mang đủ ô ẩn như link (pick,
product, total, deposit, delivery, utm), ẩn tiêu đề form (form còn dùng ở sự kiện, tiêu đề có "Meridian
Fall Event"), emoji 👋 vẫy tay theo ý chị (đứng yên khi máy khách bật "giảm chuyển động"). Script Tally
tải sau trang; chưa tải/bị chặn thì nút vẫn mở trang form như cũ. Gửi xong popup đóng, trang chuyển tới
"Pay your deposit". (2) **Christening Gown Set giảm 25% đến hết CN 25/10** (giờ Texas): $89 gạch → $66.75;
từ 26/10 trang tự về $89 (`PRICES.christening.gownSale`). (3) Bộ váy rửa tội có thêm **socks** (trang
Custom Orders + trang sản phẩm `js/products.js`).
**Chốt 16/10, tin nhắn 3:** đổi món cơ bản trong hộp tân gia **chỉ tính phần chênh lệch**
(giá add-on − giá bán món cơ bản; món rẻ hơn thì trừ lại, vd. −$5). Giá bán món cơ bản
(`PRICES.housewarming.basics`): cider $15 · mứt/mật ong $5 · tranh nhà $15 (in 5×7 giấy
Premium Matte) · rosary $10. Hộp ghi rõ cách tính ("Scented candle $10 − rosary chain $10"),
menu đổi món ghi giá chênh từng lựa chọn.

**Ảnh (`assets/img/custom/`):** 9 file kit lấy lại từ asset của artifact v1
(tên theo image map §4). Đang dùng: 01 collage, 03 tranh "Our 1st Home", 04
hộp tân gia, 06 godparent, 07 lịch (cắt bỏ crop mark, tách bìa + trang năm),
extra Dó paper (hiện khi chọn giấy Dó). Ảnh Elise gửi 15/10 (đợt 2):
`pet-crochet-group.webp` (nhóm mèo len, thay ảnh Maine Coon; tag "Handmade" đã
làm mờ), `watercolor-frames-wall.webp` (các khung tranh trên tường — hiện khi
chọn khung), `christening-confirmation.webp` (ảnh chung gown + hộp Confirmation;
chú thích: bóng chỉ để trưng bày), `confirmation-box.webp` (trong ô Confirmation
gift box; tag "Handmade Blessings" đã làm mờ); thumb pet/christening cắt từ các ảnh
này; `thumb-memorial.webp` (mèo trên giấy Dó) cho gói Pet memorial. 7 thumb 240px
cho hàng chọn món (bước 1); ảnh godparent crop 4:5 bỏ tag "Handmade Blessings" ở
góc. Ảnh kit không dùng (02 có tag lạ, 05 mockup) KHÔNG đưa lên web — bản
gốc nằm trong thư mục kit (scratchpad) để đối chiếu.
**Ảnh Merlin thật (16/10, chị gửi ảnh 12–16):** hero = `hero-merlin-wide-900/1376.webp`
+ `hero-merlin-phone-640/1024.webp` (ảnh 14) và mục "Ordering for Christmas?" =
`xmas-merlin2-wide-*/xmas-merlin2-phone-*` (ảnh bàn quà + cây thông, tin nhắn 9; thay ảnh 15) là **nền tràn mép**, mép ảnh mờ dần vào
nền (mask — ngoại lệ "no gradients" theo yêu cầu của chị; sàn trắng trong ảnh đã kéo về
màu nền); CTA cuối = `merlin-portrait.webp` (ảnh 13, cắt tròn). Hạn đặt Giáng sinh: CN 8/11
(móc len), CN 15/11 (tranh, lịch, hộp quà); sau hạn giao năm 2027. Đây là ảnh
**mùa lễ** — sau Giáng sinh thay ảnh hero/Christmas (ảnh 12 có chữ "Merrvest holidays"
in sẵn nên không dùng). Minh hoạ cũ `merlin-closing.svg` vẫn giữ trong repo để dùng lại
sau mùa lễ (không hồng — màu hồng chỉ xuất hiện một lần ở logo header).

**Lệch so với brief — chủ ý, chị quyết:** (1) footer "Designed in Texas.
Made in Vietnam." — bỏ "Finished in Texas" theo quyết định 09/10 của chị trên
site chính; (2) "Baby girl baptism outfit set" → "Christening Gown Set — lace
& satin — $89" + "Gown, bonnet, mittens, booties and socks." theo chính brief §6 (socks: Elise thêm 16/10)
(guardrail "baby"); (3) "curated" ×2 trong copy đã duyệt nhưng nằm trong danh
sách từ cấm Canon — giữ nguyên văn, chờ chị; (4) "Etsy Star Seller ★ 4.9" lấy
từ brief, chưa tự kiểm chứng được; (5) brief ghi "Merlin icon as the single
pink signature" — panel chọn giữ hồng một lần (logo) và dùng minh hoạ Merlin
màu canon; muốn icon hồng thì đổi `src` sang `../assets/brand/favicon-64.png`.

## Việc còn lại trước khi "launch" (checklist cho Elise)

1. **Listing Etsy** — đã đủ 31 món (20/10). Sửa phía Etsy theo
   `docs/ETSY-LISTING-FIXES-2026-10-20.md`; listing mới thì báo em (hoặc tự thêm theo mục Catalog).
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
   center và đặt commission rate, (b) trang đang dùng purrlightstudiollc@gmail.com
   (tạm, tới khi đăng ký purrlight.studio).
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

## Khoá (API key), mật khẩu & giới hạn chi tiêu (18/10/2026)

**Đã quét 18/10:** toàn bộ 126 commit trên cả 6 nhánh (kể cả `gh-pages` đang chạy trang web) và mọi file hiện có, bằng 3
cách độc lập — dò mẫu khoá trong mọi phiên bản của mọi file, **gitleaks 8.21.2**, **detect-secrets** → **không có khoá
API hay mật khẩu nào.** Repo này **công khai** (public): ai cũng đọc được mọi thứ từng commit.

Công khai có chủ đích (khách cần, không phải bí mật): link form Tally, link thanh toán Square, email Zelle / Gmail studio.

**Quy tắc:**
- Khoá / mật khẩu chỉ để trong `.env` trên máy mình: `cp .env.example .env` rồi điền. `.gitignore` chặn `.env`, file
  `.pem`/`.key`, `credentials*.json`… không cho lên GitHub.
- **Không bao giờ để khoá trong `website/`** — đó là trang công khai, file nào cũng xem được, dù có `.env` hay không.
  Trang hiện tại không cần khoá nào. Khoá chỉ dùng ở server / script chạy trên máy.
- `deploy-pages.sh` chỉ đưa lên **file đã commit** (`git archive`), không bao giờ copy file chưa commit hay bị
  `.gitignore`; thấy file tên giống khoá (`.env`, `*.pem`, `*.key`…) thì **dừng, không deploy**.

**Trước khi tạo khoá ở đâu — đặt trần $10 để lỡ lộ cũng không mất quá $10** (phải đăng nhập console của chị):
- **Claude API** (console.anthropic.com): tạo một **workspace riêng** (vd. "website"), đặt **Spend limit $10/tháng**
  cho workspace đó, rồi tạo khoá **trong** workspace đó (khoá gắn với workspace, không chuyển được; mỗi lần gọi đều xét cả
  giới hạn workspace lẫn tổ chức). Nên đặt thêm giới hạn cho cả tổ chức.
- **OpenAI**: tạo Project riêng → Project settings → Limits → monthly spend limit **$10** + bật **Enforce a hard limit**;
  hoặc chỉ nạp trước $10 credit và **tắt auto-recharge**. Hệ thống chặn hơi trễ nên có thể vượt một chút.
- **Google Cloud** (Gemini, Maps…): **Budget chỉ gửi email cảnh báo, không chặn chi tiêu** → giới hạn khoá (API
  restrictions + HTTP referrer), đặt quota thấp; nếu console có tuỳ chọn "spend cap enforcement" khi tạo budget thì bật.

**Nếu lỡ lộ khoá:** vào console **thu hồi (revoke / delete) khoá ngay** rồi tạo khoá mới. Xoá khoá khỏi code hay khỏi
lịch sử git **không đủ** — repo public, có thể đã bị đọc / clone. Sau đó xem trang usage có gọi lạ không.
