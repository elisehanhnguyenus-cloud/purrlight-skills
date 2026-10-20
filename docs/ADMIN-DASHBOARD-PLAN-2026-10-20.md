# Kế hoạch Admin Dashboard — Purrlight Studio (bản chốt sau hội đồng, 20/10/2026)

> **Đọc nhanh (5 phút):** mục **1** (tóm tắt 10 dòng), mục **7** (một ngày của chị: 4 việc bấm từng bước) và mục **8** (8 câu hỏi, mỗi câu có sẵn mặc định; chị chỉ cần trả lời câu nào muốn khác). Các mục 2–6 là phần kỹ thuật cho Claude làm.
> **Việc đầu tiên nếu chị đồng ý:** spike 0a (2–3 giờ, $0). Chị tự đăng nhập admin, kéo 1 ảnh iPhone, bấm Save → Publish. Chưa qua bước này thì chưa làm gì thêm.
> *Em đã tự kiểm lại 4 điểm vendor rủi ro nhất ngày 20/10: HEIC (trang features), auto-merge chờ test (trang editorial), runner 24.04 không có ffmpeg, và lịch chuyển `ubuntu-latest` (đã sửa thành 19/10–19/11).*

*Bản này đã áp mọi must-fix của 5 người duyệt. Chỗ hai yêu cầu chọi nhau, em chọn phương án an toàn hoặc rẻ hơn và ghi lý do ở chú thích cuối bài (số nhỏ cạnh chữ). Nhãn số liệu: **[vendor]** trang chính thức (link mục 9), **[ước tính]** ước lượng của em, **[cần kiểm tra]** chưa xác minh, **[Elise]** số từ site/tài liệu công ty, **[repo]** đọc trực tiếp từ repo ngày 20/10, **[đề xuất]** lựa chọn của mình (không phải giới hạn vendor), **[rule of thumb]** quy ước nghề, **[chưa có]** pipeline không có công cụ này.*

## 1. Tóm tắt 10 dòng

1. **Đề xuất: Sveltia CMS**: trang tĩnh `website/admin/` (MIT, không server, **ghim version**), login GitHub. Chị sửa qua form có nhãn Việt rồi bấm **Publish (Đăng)**; nội dung thành JSON + ảnh trong repo. Site vẫn là GitHub Pages, chỉ đổi nguồn deploy sang GitHub Actions **[vendor]**.
2. **Phần mềm $0**: Sveltia, GitHub Pages/Actions, sharp, ffmpeg, Playwright, và Cloudflare Workers Free nếu cần **[vendor]**. Không thêm vào ~$57/tháng **[Elise]**. Actions $0 vì repo public; nếu chuyển private thì Free có 2.000 phút/tháng, quá mức tính tiền **[vendor]**.
3. **Nền chung**: `content/*.json` → `tools/build-data.js` → `js/products.js` cùng các file data (build output, **không commit**). **Sale chỉ khai một nơi** là `content/promo.json` (`promos[]`), từ đó sinh cả `SALES` lẫn `gownSale`. sharp + ffmpeg sinh ảnh và reel, Playwright test rồi deploy. Không lock-in.
4. **Ảnh**: kéo ảnh gốc vào form, từ máy tính hoặc iPhone. Sveltia đổi sang WebP theo cấu hình mình đặt (q85, ≤2048 px) **[vendor cho key, ước tính cho số]**. HEIC **[cần kiểm tra]** ở spike. Sveltia **chưa có crop hay chọn tâm ảnh** **[vendor: roadmap]**, nên có ô "Tâm ảnh" 5 lựa chọn và preview trang chủ bằng CSS thật ngay P0. Chị không cần Photoshop, cũng không phải tự nén video.
5. **Publish**: Save (Lưu) tạo Pull Request, Publish (Đăng) merge nó, Playwright chạy. Test đỏ thì không deploy và có comment tiếng Việt trên PR. **Admin chưa có Undo cho tới khi Sveltia ra tính năng revisions** **[vendor: roadmap]**; P0 có nút "Hoàn tác lần publish gần nhất" (GitHub → Actions → Run workflow).
6. **Không chọn Notion (B)**: nút Publish nằm ngoài Notion; link ảnh qua API hết hạn sau 1 giờ; gói Free giới hạn 5 MB/file **[vendor]**.
7. **Bỏ Supabase (C1)**: gói Free tự pause sau 1 tuần không dùng, trong khi shop có thể có những tuần không ai sửa; Pro $25/tháng **[vendor]** = 44 % ngân sách **[tính từ Elise]**.
8. **Lộ trình**: Spike 0a 2–3 giờ → Phase 0 cuối tháng 10, $0, ~3–4 ngày công Claude (bảng tách việc ở mục 4) **[ước tính]** → Phase 1 xong trước 15/11, không kịp thì lùi sang tháng 1/2027 (**đóng băng 15/11–02/01**) → Phase 2 khi cần.
9. **Rủi ro thật**: Sveltia chưa ra v1.0 (dự kiến cuối 2026) **[vendor]**, số maintainer **[cần kiểm tra]**. Chuyển sang Decap **không** dùng lại được config, phải sửa ~3–5 giờ **[ước tính]**. Còn điều khoản ToS của Pages, và AI content phải qua chị duyệt.
10. **Ngày 1 (sau khi P0 xong, cuối tháng 10)**: mở `…/admin/`, dán token từ password manager, đổi ảnh hero, bấm **Save (Lưu) → Publish (Đăng)**; 5–8 phút sau site cập nhật **[ước tính]**. Thay đổi nội dung do Claude làm sẽ đến dưới dạng PR để chị bấm Merge.

## 2. Content model

**Luật chung cho mọi ô**

- Mỗi ảnh là một object `{src, alt, focus, rights, credit}`:
  - `alt`: **tiếng Anh**, bắt buộc, ≤125 ký tự **[rule of thumb]**. Hint: "Viết tiếng Anh, tả như kể cho người không nhìn thấy; không nhồi keyword; không mở đầu bằng *image of*".
  - `focus`: ô chọn 5 giá trị (giữa / trên / dưới / trái / phải), mặc định *giữa*. Ô ảnh vuông có hint "Ảnh vuông sẵn thì không cần chọn tâm".
  - `rights`: ô chọn *của mình* (`own`) / *khách cho phép* (`customer`) / *đối tác* (`partner`) / *chưa rõ* (`pending`) [^11].
  - `credit`: ≤40 ký tự (vd `@handle`), bắt buộc khi `rights` là `customer`.
  - Ảnh sản phẩm không có chữ đè.
- **Chữ**: ô chữ nào cũng có:
  - `maxlength`, hiện bộ đếm ký tự;
  - `hint` một dòng giọng thương hiệu: "Ấm, kể chuyện, nói như viết cho một người bạn — không hard sell, không emoji, không giục mua";
  - `pattern` lấy từ `content/rules/banned.json`: form từ chối ngay khi gõ, trước cả lúc Save **[vendor: fields/string]**. Thông báo lỗi do mình viết bằng tiếng Việt, cần xem có hiển thị đúng không, và pattern có bỏ qua chữ hoa/thường được không **[cần kiểm tra]**.
- **Giao diện**: nhãn trường tiếng Việt qua `label` **[vendor]**. Nút của admin (Save, Publish…) là tiếng Anh, nên P0 có thêm **từ điển nút 1 trang** (mục 7). Repo Sveltia có file `src/lib/locales/vi.yaml` **[vendor: repo, em mở được ngày 20/10]**; bản dịch phủ được bao nhiêu và bật bằng cách nào thì kiểm ở spike 0a **[cần kiểm tra]**. Nếu bản dịch đủ, cách bật ghi vào đầu từ điển nút.

| File (hiện ở đâu) | Trường (nhãn → key, kiểu) | Hint / pattern | Luật riêng |
|---|---|---|---|
| **Trang chủ** `content/home.json` (index.html) | **Hero**: `kicker` (≤40), `headline` (≤70), `lines` (≤220), `image` (1:1 → 1080/720), `badgeImage` (1:1 → 360; hôm nay là ảnh "the real Merlin") + `badgeCaption` (≤30) [^14], `cta`×2. Hero video: index.html hôm nay **không có** → P2, cần code. **`trustBar[3]`** = `{title ≤32, line ≤60}`. **`favorites`** (đúng 4 món). **`reels[4]`** = `{video (mp4/mov gốc ≤25 MB), poster (tự sinh, ghi đè được), label ≤40, link (chọn sản phẩm hoặc bộ sưu tập)}`. **`story`** = ảnh 1:1 → 1000/640 + chữ. **`merlin`** = `photo` (1:1 → 360) + 4 bio (≤160); 3 sketch Tâm/Bánh Mì/Mochi **cố định (code)** tới khi có nhân vật thật. **`journal[3]`** = ảnh 16:10 → 800×500 + tiêu đề + blurb + link. **`daily[6]`** = `{image 1:1 → 600, link: TikTok / Pinterest / sản phẩm, credit}` (hôm nay 3 TikTok + 3 Pinterest **[repo]**). **`gifting`**: chữ + 2 nút (hôm nay không có ảnh **[repo]**) | `pattern` banned.json trên `headline`, `lines`, `reels[].label`, chữ journal; hint giọng trên mọi ô chữ; hint "ảnh vuông sẵn thì không cần chọn tâm" trên hero, badge, story, merlin, daily | favorites không chọn được món QUIET hay `retired`. Ô ảnh trang chủ (hero, badge, story, merlin, journal, daily, poster) chỉ nhận `rights` = `own` hoặc `customer` (kèm `credit`); ảnh `partner`/`pending` **không đặt được vào bất kỳ ô trang chủ nào**. Credit hiện dạng "photo: @handle" trên tile daily và journal. Journal link tới TikTok (chưa có blog) |
| **Khuyến mãi** `content/promo.json`: **nơi DUY NHẤT khai sale** (giá sale trên shop/product/Event Desk, `gownSale`, thanh promo P1) | Danh sách **`promos[]`**, mỗi promo có: `name`, `enabled`, Phạm vi `scope` (tất cả / bộ sưu tập / món), `products[]`, Giảm `off`, Ngày cuối `endsLocal` (ngày) + Giờ tắt `endsTime` (bỏ trống = **hết ngày**), `tz: America/Chicago` cố định [^1], `text` (≤90), `url`, Lý do `reason` (1 dòng, bắt buộc, vd "match Etsy sale 25% tới 25/10", dán kèm link trang campaign Notion nếu có); ô tick bắt buộc **"Đã đổi giá trên Etsy chưa?"** | `pattern` banned.json + từ giục mua ("hurry", "last chance", "only today", "don't miss") trên `text`; hint "Giá sale không bao giờ nhập ở trang sản phẩm" | `endsLocal` bắt buộc (luật Morgan). Generator đổi sang `ends` ISO UTC theo múi `America/Chicago` (CDT −5 tới 01/11/2026, sau đó CST −6, dùng thư viện timezone, không cộng số cố định) và sinh đúng 3 chuỗi hiện có: `SALES.through` = "ddd, MMM D (Central Time)", `gownSale.through` = "MMM D", `gownSale.day` = "ddd, MMM D" **[repo: products.js dòng 446, main.js dòng 112, prices.js dòng 161]**. Hết hạn thì tự tắt. **Một món nằm trong 2 promo đang bật → build fail, báo rõ tên 2 promo.** Giảm >15 % chỉ cảnh báo, không chặn. **Không nhập cost/COGS/giá nhập vào bất kỳ file `content/` nào** (repo public); sàn margin ≥55 % cho doll handmade vẫn kiểm ở Notion trước khi bật sale |
| **Bộ sưu tập** `content/categories.json` (tiles, chips, footer) | 7 × `name` (tên canon, đổi phải sửa code), `img` (vuông 600), `order`, `upcoming` | — | tile "Patterns & Printables" đang mượn ảnh trang chủ `story-yarn-hand-640.webp` **[repo]** → đổi sang ảnh sản phẩm khi sticker POD lên |
| **Sản phẩm** `content/products/<id>.json`, 31 file (dùng ở shop, product, home, Event Desk) | `id` (slug, khoá), `name`, `category` (1 trong 7), `price`, `priceFrom` (toggle), `badge` (ô chọn: trống / new / made-to-order / the-original), `photo` (ảnh 1:1 theo object chung) + **`photoClean`** (toggle bắt buộc "Ảnh này không có chữ đè"), `short` (≤160), `desc`, `details[]` (≤8), `etsyUrl`, **`kind`** (Làm tay `handmade` / In theo yêu cầu `pod` / File số `digital`), **`origin`** (`studio-tx` / `artisan-vn` / `pod-partner` / `digital`) [^4], **`shipsFrom`** (`tx` / `vn` / `vn-or-tx` / `none`), **`status`** (`active` / `sold-out` / `retired`), tick **`partnerDisclosed`** ("Listing Etsy đã khai production partner", bắt buộc khi `origin` là `artisan-vn` hoặc `pod-partner`), tick **`aiDisclosed`** ("Thiết kế có dùng AI → đã khai AI art"), toggle `quiet`, `skipSafetyLine`; trường ẩn: `sku` (mặc định = `id`), `links.tiktok` (để trống). **Bỏ**: `sale{}`, `notHandmade`, `hidden`; `addons[]` gỡ khỏi form (generator vẫn ghi `addons` rỗng) | hint ở `photo`: "Tải ảnh gốc KHÔNG có chữ/badge/watermark (bản trước khi thêm chữ cho Etsy/Canva)"; `pattern` banned.json trên `name`, `short`, `desc`, `details`, `alt` | `etsyUrl` phải chứa `etsy.com/listing/`. Etsy là nguồn giá và tồn kho; **giá sale không bao giờ nhập ở đây**. `NOT_HANDMADE` = mọi id có `kind ≠ handmade` (output `products.js` không đổi); care line chỉ cho `handmade`. `digital` → generator tự ghi "Digital download — instant via Etsy, all sales final", bỏ dòng ships-from, và chip trên Event Desk gắn nhãn "QR → Etsy" (mặc định; ẩn hẳn nếu chị muốn, câu 6 mục 8). `origin` + `shipsFrom` → generator ghi **một** dòng chuẩn vào `details[]` (vd "Made by our artisan partners in Vietnam — ships tracked from Vietnam"); **không bao giờ sinh "Made in USA"**; `studio-tx` chỉ được ghi "made/hand-strung in Pearland, Texas". `rights` ≠ `own` → tự QUIET. `photoClean` chưa bật → build từ chối sinh ảnh. **Không bao giờ xoá file JSON sản phẩm, chỉ chuyển sang `retired`**, vì id là khoá của booth log: `event-desk.js` dòng 956–967 tra `pid` khi mở lại đơn **[repo]**. `retired` → loại khỏi `PRODUCTS` của shop và desk, giữ trong `RETIRED[]` để link cũ hiện "no longer listed" + link shop, không có nút Buy. `sold-out` → vẫn hiện, gắn nhãn "sold out", không vào favorites/hero **[đề xuất, cần code]** |
| **Luật chữ** `content/rules/banned.json` (file mới) | (a) claims: safe/safely/non-toxic/hypoallergenic/eco-friendly/CPSIA/ASTM/EN71/"tested"/"Made in USA"; (b) IP watchlist: Disney, Netflix, FIFA/World Cup, NFL/NBA/MLB, Pokémon, Hello Kitty, "America 250", tên brand; (c) từ giục mua | lấy từ file Brand Canon v2 hiện có + danh sách `bannedInNote` trong `event-desk.js`, không viết mới | Chỉ có một file: script sinh `admin/config.yml` đẩy danh sách thành `pattern` (chặn cứng ngay trong form [^13]); `event-desk.js` (`bannedInNote`) và audit Playwright đọc **cùng** file đó. File sửa qua PR của Claude, chị duyệt; không nằm trong form admin |
| **Cố định (code)** | about, partners, confirm, `event.html` + `CFG`, `custom-orders/prices.js` `PRICES` (phép tính), 61 ảnh Custom Orders, values/Purrks/Why Purrlight, care & safety, nav/footer, newsletter (chưa thu email) | — | Sửa qua Claude Code (hàng đợi Notion "Yêu cầu website") theo luật PR ở mục 6. `PRICES` ở lại `prices.js` vì đó là công thức + bảng giá chị duyệt ngày 15–16/10 và hiếm khi đổi. **Điều kiện tách ra**: nếu chị đổi giá custom > 2 lần/quý thì P2 tách sang `content/custom-prices.json`, generator giữ nguyên công thức |

`tools/build-data.js` đọc JSON và ghi ra:
- `js/products.js`: giữ đúng tên biến cũ, thêm `RETIRED[]` và các object mới tách riêng;
- `js/home-data.js`;
- `custom-orders/sale-data.js`: `{off, ends, through, day}` cho `christening-gown-set`. `custom-orders/index.html` nạp file này trước `prices.js`, và `prices.js` đọc từ đây thay cho số gõ tay (`event.html` không nạp `prices.js` **[repo]**);
- `js/rules-data.js`: sinh từ `banned.json`;
- `catalog.csv`: cột id, name, kind, category, price, priceFrom, etsyUrl, img; tải từ trang lần chạy Action, dùng ngay cho bulk upload TikTok Shop / vendor POD.

Vì tên biến giữ nguyên, Event Desk, tests và link cũ không phải đổi. Tất cả các file trên là **build output, không commit** (lý do ở mục 6).

**Jellycat/Mushie → Purrlight**:
- hero mùa = `hero`;
- picture tiles = `categories` + `content/gift-edits.json` (P2: ≤4 × title, image, products[], shop đọc `?edit=`);
- hàng chọn tay = `favorites` (P1: 4–8 món + hàng "New in" tự lấy các món `badge: new` theo `addedOn`, vẫn loại QUIET, học từ Jellycat "New in");
- story banner = `story`;
- promo = `promos[]`;
- social proof = `daily` + `reels` (không press logo, newsletter, blog).

**Vì sao P0 chưa có "promo line" kiểu Mushie trên thanh announce**: thanh đó hôm nay là dòng brand cố định. Thanh promo đọc `promos[].text/url` là việc của P1; trước đó, muốn chạy kiểu "Free shipping" thì chị nhắn Claude.

## 3. So sánh phương án

| | **A. Sveltia (chọn)** | **B. Notion → Action** | **C1. Supabase + admin tự viết** | **C2. Form Tally → Claude** |
|---|---|---|---|---|
| Chị thấy gì | form nhãn Việt (nút tiếng Anh + từ điển), Draft → In Review → Publish | bảng Notion quen; Run workflow bên GitHub | admin tự code toàn bộ | form 5–8 ô; hàng đợi Notion |
| Đổi hero / thêm sản phẩm | kéo ảnh, Save (Lưu), Publish (Đăng): 5–8 phút **[ước tính]** / "Sản phẩm → New (Mới)" | kéo ảnh, chạy `preview` rồi `publish`: 3–5 phút **[ước tính]** / dòng Notion mới | upload Storage, lên ngay / form tự viết | gửi form, chờ Claude trong ngày / gửi link Etsy |
| Chi phí/tháng | **$0** (repo public) **[vendor]** | $0 Free; Plus $10/member **[vendor]** | Free 500 MB DB, 1 GB storage, **pause sau 1 tuần im**; Pro $25 **[vendor]** | $0 thêm; gói Claude **[cần kiểm tra]** |
| Setup / bảo trì | spike 2–3 giờ + ~3–4 ngày công **[ước tính]** / ghim version, nâng mỗi quý (~30 phút **[ước tính]**) | 3–4 ngày **[ước tính]** / API Notion đổi (2025-09-03) **[vendor]** | 5–8 ngày **[ước tính]** / auth, RLS, pause | ~1 ngày **[ước tính]** / Claude bận = site đứng |
| Rủi ro: auth, ảnh, undo, lock-in | token, thêm OAuth + Worker khi cần; chưa có crop/tâm ảnh **[vendor: roadmap]**; undo = nút Hoàn tác trên Actions; JSON trong repo; chưa v1.0 **[vendor]**, số maintainer **[cần kiểm tra]**; chuyển sang Decap phải sửa config ~3–5 giờ **[ước tính]** | `NOTION_TOKEN` trong Secrets; link ảnh hết hạn 1 giờ, 5 MB/file **[vendor]**; workflow rollback; data ở Notion | Auth + RLS; **resize chỉ Pro** **[vendor]**; không history; lock-in cao | không key mới; gốc ≤10 MB qua Tally **[vendor]**; **bus factor = Claude** |
| Người mới / tinh gọn | ✔︎ 1 nút Publish / ✔︎ | ✔︎ quen / ✘ không biết lúc nào lên site | ✘ / ✘ | ✔︎ / ✘ "AI babysitter" |

*Số giờ ở cột A đã cộng các việc hội đồng thêm vào P0 (sale một nguồn, `banned.json`, preview CSS thật, nén reel, nút Hoàn tác). Cột B và C chưa cộng các việc tương tự; cộng vào thì còn cao hơn **[ước tính]**.*

Em chọn A vì chỉ A có đủ form có nhãn, preview, một nút Publish và đường hoàn tác (nút trên Actions từ P0) mà không thêm nơi giữ dữ liệu, cũng không cần Claude cho việc thường ngày. B quen tay nhưng nút Publish không nằm ở nơi chị sửa. C2 chỉ là cách làm hiện nay sắp xếp lại. C1 đổi "không server" lấy "một server phải trông".

**Nếu phải chuyển sang Decap, config không dùng lại nguyên được**:
- `singletons` là cấu hình riêng của Sveltia. P0 đã viết sẵn trang chủ, khuyến mãi, bộ sưu tập dạng `files` collection, nên phần này không phải sửa.
- `transformations` và `max_file_size` trong `media_libraries.default.config` Decap không có. Mất bước đổi WebP lúc upload, nên Action sharp phải nhận cả JPG/PNG gốc (sharp đọc được HEIC không **[cần kiểm tra]**).
- Decap không có Sign In with Token và bắt buộc OAuth, nên phải dựng Worker (P1) trước thì mới chuyển được.

Công sửa: ~3–5 giờ Claude nếu đã có Worker, thêm 1–2 giờ nếu chưa **[ước tính]**.

## 4. Đề xuất + phases ("chưa qua cổng = chưa chi tiền")

**Phase 0a: Spike 2–3 giờ [ước tính], $0, làm trước mọi việc khác.** Dựng `website/admin/` trên một branch với đúng 1 collection (hero của `content/home.json`). Chị tự login bằng PAT, kéo **1 ảnh HEIC thật từ iPhone**, bấm Save (Lưu) và thấy PR được tạo, bấm Publish (Đăng) và thấy PR được merge. Kiểm thêm ba điều: `vi.yaml` bật được không; nút nào còn tiếng Anh (để viết từ điển nút); thông báo `pattern` tiếng Việt có hiện đúng không.
- **Tiêu chí qua cổng**: chị làm một mình trong ≤15 phút; ảnh ra WebP; giao diện đọc được.
- **Chưa qua 0a thì chưa làm migration, chưa tốn giờ công.**
- *Chị tự làm (chỉ chị có quyền)*: tạo fine-grained PAT theo hướng dẫn có ảnh (10–15 phút), làm thử spike (≤15 phút) **[ước tính]**.

**Phase 0: cuối tháng 10 (sau 0a), $0, ~3–4 ngày công Claude [ước tính].**
1. **Đổi nguồn Pages**: hôm nay repo chưa có `.github/workflows`; site deploy bằng `git archive HEAD:website` vào nhánh `gh-pages` **[repo]**. Chị vào Settings → Pages → Source, chọn "GitHub Actions" (làm 1 lần, cần quyền chủ repo) **[vendor]**. Giữ `deploy-pages.sh` + nhánh `gh-pages` làm đường lùi trong 30 ngày. Vì `products.js` giờ là file sinh, `live-verify.sh` so sha256 với artifact build của Action, không so với `website/` local.
2. **`.github/workflows/publish.yml`**:
   - `runs-on: ubuntu-24.04`, ghim cứng vì nhãn `ubuntu-latest` đang được chuyển dần sang 26.04 trong khoảng 19/10–19/11/2026 (GitHub công bố 17/9) **[vendor: GitHub changelog]**.
   - Ghim Node LTS; `npm ci` + `package-lock.json` (repo chưa có `package.json` **[repo]**).
   - Chạy `build-data.js`, `images.mjs` (sharp), `apt-get install -y ffmpeg` rồi nén reel.
   - Chuyển Playwright từ scratchpad vào `tests/`, cache browsers bằng `actions/cache`.
   - Quét file giống khoá; deploy bằng `actions/deploy-pages` **[vendor]**.
   - Test fail thì comment tiếng Việt lên PR (mục 6).
   - Dependabot chỉ bật cập nhật bảo mật, gom theo tháng, để không có PR rác mỗi tuần.
   - Sau 3 lần chạy đầu, ghi số phút thật thay cho [ước tính]. Nếu chậm: chỉ chạy đủ suite khi `content/products/**` hoặc `js/**` đổi; đổi hero/promo thì chạy `smoke + sales + audit`.
3. **Di chuyển dữ liệu, chia 2 bước** (xem [^5])
   - **Bước A (giữ nguyên chữ)**: script chạy một lần, tách `products.js` thành 31 JSON, `categories.json` và `home.json`. **Toàn bộ `SALES` hiện có (5 mục: christening-gown-set, maine-coon-cat, rosary-charm, saint-joan-of-arc-doll, americana-doll-bag-charm) cùng `gownSale`** **[repo]** gộp thành 1 promo trong `promo.json`. Nếu migrate sau 26/10 05:00Z thì promo đặt `enabled: false`, giữ lại làm lịch sử, không xoá.
     - **Cổng diff**: script Node nạp cả bản tay lẫn bản sinh rồi deep-compare `PRODUCTS, SALES, NOT_HANDMADE, SAFETY_LINE_SKIP, QUIET, CATEGORIES, UPCOMING_CATEGORIES, ETSY_SHOP_URL, TIKTOK_SHOP_URL` và `PRICES.christening.gownSale`: phải ra 0 khác biệt. Hơn 60 dòng comment trong file tay không tính. Chuỗi `through` phải giữ đúng "Sun, Oct 25 (Central Time)".
   - **Bước B (PR riêng, chị duyệt như một thay đổi nội dung)**: đặt `kind`/`origin`/`shipsFrom`/`status` cho 31 món. Các dòng ships-from/partner gõ tự do trong `details[]` (vd "Ships from our studio in Nha Trang", "ships tracked from our artisan partners in Vietnam", "Designed in Texas, made in Vietnam and finished in Texas" **[repo]**) được thay bằng dòng chuẩn. Món nào không khớp 4 giá trị `origin` thì Claude hỏi chị, không tự đặt.
   - **Ảnh**: giữ nguyên 31 ảnh 600/1000 hiện tại và **seed vào manifest hash để Action KHÔNG sinh lại**. Tạm lấy bản 1000 hiện có làm `originals/<id>.webp` cho tới khi chị up ảnh gốc sạch. Đặt `photoClean: true` cho cả 31 món (đã crop tay bỏ chữ). Claude viết sẵn alt tiếng Anh cho 31 món và ảnh trang chủ để chị duyệt trong PR.
4. **Admin**:
   - `website/admin/index.html` nạp `https://unpkg.com/@sveltia/cms@<x.y.z>/dist/sveltia-cms.js` (**ghim version**). Snippet trong Start Guide không ghi version, nên unpkg luôn trả bản mới nhất; cùng trang đó ghi "still in beta… there might still be breaking changes before the stable 1.0 release" **[vendor]**.
   - `config.yml` sinh bằng script từ `banned.json`, gồm:
     - backend `github`, `media_folder: website/assets/originals`, `publish_mode: editorial_workflow`;
     - trong `media_libraries.default.config`: `transformations.raster_image: {format: webp, quality: 85, width: 2048, height: 2048}`; `max_file_size` ≈25 MB để nhận được reel (đơn vị **[cần kiểm tra]**; ví dụ trong docs ghi `1024000`) [^10]; `slugify_filename: true` **[vendor]**;
     - collection sản phẩm tắt nút xoá (`delete: false` **[cần kiểm tra]**);
     - trang chủ, khuyến mãi, bộ sưu tập viết dạng **`files` collection**, không dùng `singletons` (chỉ Sveltia có), để đường chuyển sang Decap là thật (mục 3).
   - **Preview trang chủ** dùng `CMS.registerPreviewTemplate` + `registerPreviewStyle` nạp `css/style.css` thật **[vendor: preview-templates]**. CSS site đã dùng `object-fit: cover` cho hero, tile, story, journal, social tiles và reels, nên preview chỉ cần đặt `object-position` theo `focus` là ra đúng khung cắt chị sẽ thấy trên site.
   - **Login bằng Sign In with Token**: fine-grained PAT cho 1 repo, quyền Contents RW + Pull requests RW **[vendor: backends/github]**, hết hạn **tháng 2/2027** (sau mùa lễ) **[đề xuất của em]**. GitHub cho phép token không hết hạn ("Infinite lifetimes are allowed") và tự xoá token không dùng trong 1 năm **[vendor]**.
   - **Ba luật token**:
     1. Token chỉ nằm ở localStorage trình duyệt của chị, bản gốc cất trong password manager (Google Password Manager hoặc Bitwarden Free, giá **[cần kiểm tra, dự kiến $0]**). Không bao giờ dán vào Notion/Slack/Gmail.
     2. Dùng máy khác hoặc điện thoại ở event thì dán lại từ password manager.
     3. Nghi bị lộ: github.com/settings/tokens → Revoke → tạo token mới.
   - Đặt nhắc lịch 30 ngày và 7 ngày trước hạn. Ghi **tên** token và ngày hết hạn (không ghi token) vào Notion registry.
5. **`revert.yml` "Hoàn tác lần publish gần nhất"**, có nút Run workflow **[vendor]** (~1–2 giờ **[ước tính]**): revert lần merge gần nhất từ nhánh `cms/*`, rồi Action build và deploy lại.
6. **Sửa site theo model mới**: `prices.js` đọc `sale-data.js`; trang product xử lý id `retired`; hiện credit "photo: @handle"; chip "QR → Etsy" cho món `digital`; viết lại audit alt (mục 5.4); `bannedInNote` đọc `rules-data.js`.
7. **Tài liệu P0 (Notion)**: từ điển nút 1 trang; hướng dẫn có ảnh chụp cho việc tạo PAT và cho nút Revert trên GitHub (4 bước); Sổ tài khoản & khoá (mục 6).
8. **Cầu nối**: chị vẫn nhắn Claude như nay, không dựng form Tally. Từ P0, mọi thay đổi nội dung Claude làm đều đến dưới dạng PR (mục 6).

**Bảng tách việc P0** (thay con số gộp "1–2 ngày công" của v1; sẽ ước lại sau spike):

| Việc | Giờ Claude **[ước tính]** |
|---|---|
| Spike 0a (làm riêng, trước P0) | 2–3 |
| Script migration bước A + deep-compare = 0; PR bước B | 3–4 |
| Generator `build-data.js` (`promos[]`, giờ Chicago, 3 chuỗi `through`, `sale-data.js`, `rules-data.js`, CSV) | 3–4 |
| Action + sharp + seed manifest + ffmpeg nén reel | 3–4 |
| Đưa Playwright vào CI (`package.json`, lock, cache, comment tiếng Việt) | 2–3 |
| `config.yml` ~60 trường nhãn Việt + hint/pattern từ `banned.json` | 3–4 |
| Preview trang chủ bằng CSS thật | 2–3 |
| `revert.yml` | 1–2 |
| Sửa site (retired, credit, chip digital, audit alt, `sale-data.js`) | 2–3 |
| Đổi nguồn Pages + `live-verify` so với artifact | 1 |
| Tài liệu (từ điển nút, hướng dẫn có ảnh, Sổ tài khoản) | 2 |
| **Tổng P0 (chưa tính spike)** | **22–30 ≈ 3–4 ngày công** |

*Chị tự làm ở P0 (chỉ chị có quyền) [ước tính]*:
- đổi Pages source (2 phút);
- đặt thông báo GitHub Actions thành "chỉ báo khi lỗi" (Settings → Notifications) (1 phút);
- đọc từ điển nút (5 phút);
- thử đổi hero (15 phút);
- bấm Merge cho mỗi PR nội dung của Claude (~2 phút/PR).

**Cổng 0→1** (phải qua trước khoảng 08/11 để P1 kịp xong trước 15/11 **[ước tính]**):
- chị tự đổi hero và 1 sản phẩm, không cần Claude;
- Action xanh 3 lần liên tiếp;
- `live-verify` khớp sha256 với artifact của Action;
- **`event.html` trên Pages hiện đúng giá**, và bản hosted được republish trong 24 giờ sau mỗi lần đổi giá/sale/món [^2];
- nút "Hoàn tác" đã chạy thử 1 lần;
- mở `catalog.csv` trong Google Sheets thấy đủ 31 dòng.

Không chi đồng nào trước khi cổng này xanh.

**Phase 1: xong trước 15/11; không kịp thì lùi sang tháng 1/2027. $0, ~1 ngày công [ước tính].**
- **Branch protection cho `main`, bật auto-merge trong cùng một bước**:
  - bắt buộc qua PR + required check Playwright; chặn push thẳng, áp dụng cả với admin;
  - **không** bật "required approving review": Sveltia tự đặt auto-merge rồi chờ check xanh (tối đa 1 giờ), nhưng chỉ khi check là thứ duy nhất chặn merge, và repo phải cho phép auto-merge **[vendor: editorial]**. Cách này còn phải chạy thử trong repo mình **[cần kiểm tra]** [^7];
  - từ đây mọi thay đổi, kể cả code của Claude, đều đi qua PR [^3];
  - nếu Publish báo lỗi vì check chưa xong: đợi email/comment báo Action xanh, rồi bấm Publish (Đăng) lại hoặc bấm Merge trên GitHub;
  - `revert.yml` phải đi qua branch protection bằng PR + auto-merge; cách cấp token cho workflow **[cần kiểm tra]**.
- **Helper**:
  - dùng GitHub riêng (PAT riêng); quyền Write **chỉ trong tuần event**, gỡ ngay sau đó;
  - checklist offboarding: gỡ collaborator, đóng PR còn mở, kiểm tra/revoke token;
  - Sveltia cần role Write trên **cả** repo **[vendor]**, mà repo còn chứa `plugins/`, `docs/`, `.claude-plugin/`, `dist/` **[repo]**, nên branch protection là hàng rào chính. Phương án tách `website/` sang repo riêng bị loại, vì đổi URL Pages sẽ gãy link trên Etsy, Linktree và trong booth log.
- **Worker `sveltia-cms-auth` chỉ dựng khi cần** (xem [^9]): khi có ≥2 người sửa thường xuyên, khi gia hạn PAT thành việc phiền, hoặc khi phải chuyển sang Decap (Decap bắt buộc OAuth). Khi dựng: tài khoản Cloudflare bằng email công ty, secret chỉ nằm ở Worker, `ALLOWED_DOMAINS` = domain Pages **[vendor]**. Sveltia ghi rằng đăng nhập bằng token dành "for solo developers or small teams" **[vendor, Minh Triết dẫn]**.
- **Việc thêm**:
  - thanh promo (đọc `promos[].text/url`);
  - preview CSS thật cho sản phẩm và khuyến mãi;
  - `favorites` 4–8 món + hàng "New in" theo `addedOn`;
  - `content/about.json` (1 ảnh `about-merlin-studio` 1200/720 + alt);
  - trường `leadTime` (vd "7–12 business days") để sinh dòng "Made to order — ships in …"; `badge: made-to-order` suy ra từ `kind` + `leadTime`;
  - tuỳ chọn: lưu video gốc ở Cloudflare R2 nếu chị đổi reel thường xuyên (Sveltia hỗ trợ external media storage **[vendor]**, free tier **[cần kiểm tra]**).
- *Chị tự làm ở P1 [ước tính]*: bật auto-merge + branch protection (5 phút); mời helper (5 phút) và gỡ sau event (5 phút). Nếu dựng Worker: tạo tài khoản Cloudflare bằng Gmail công ty, bấm Deploy, điền 3 biến môi trường (20–30 phút); tạo GitHub OAuth App với callback `<worker>/callback` (10 phút).

**Cổng 1→2**:
- 4 tuần liền không phải gọi Claude để đổi nội dung;
- helper publish được 1 lần ở event **và đã bị gỡ quyền sau event**;
- 0 sự cố token/đăng nhập trong 4 tuần;
- chị mất ≤30 phút/tuần. Đo bằng 2 con số ghi vào Notion registry mỗi tháng: số lần Publish và số lần phải gọi Claude để sửa nội dung. Hai số này quyết định có đáng làm gift edits ở P2 hay không.

**Phase 2: khi cần, vẫn $0.**
- `gift-edits.json` + `shop.html?edit=`;
- `content/custom-prices.json` khi đạt điều kiện ở mục 2 (gồm cả ngày mùa);
- `content/custom-images.json` cho 61 ảnh Custom Orders **[repo, Linh đếm]**: hero wide 1376/900 và phone 1024/640 là **hai ảnh riêng**, không auto-crop từ một ảnh; ảnh option 1:1 → 400;
- hero video (cần code);
- preview PR tại `preview/<pr>/` có noindex **[ước tính]**, hoặc dùng preview deployment của Cloudflare Pages nếu đã có tài khoản Cloudflare **[cần kiểm tra]**;
- lịch "Hiện từ/đến" bằng `schedule`, mặc định tắt (GitHub tự tắt schedule khi repo im 60 ngày **[vendor]**).

*Chị tự làm ở P2*: duyệt PR như thường lệ; không phát sinh tài khoản mới nếu đã có Cloudflare.

## 5. Image pipeline

1. **Upload**: kéo-thả trong form, từ máy tính hoặc điện thoại (Sveltia hỗ trợ mobile/tablet, đăng nhập bằng QR từ desktop **[vendor: features]**).
   - **Cấu hình**: `transformations.raster_image: {format: webp, quality: 85, width: 2048, height: 2048}` **[vendor cho key; mặc định của Sveltia là giữ kích thước gốc, chỉ hỗ trợ webp, quality 85; số 2048 là mình chọn, ước tính]**.
   - **HEIC**: trang features ghi "Convert uploads to WebP, including HEIC photos from phones" **[vendor]**, nhưng trang cấu hình media/internal không nhắc tới, nên phải thử bằng ảnh iPhone thật ở spike 0a **[cần kiểm tra]** [^6]. Nếu không được: trên iPhone vào Settings → Camera → Formats → **Most Compatible** (chụp JPEG), hoặc gửi ảnh qua Mail/AirDrop để tự ra JPEG.
   - **Crop/tâm ảnh**: Sveltia chưa có; "Quick cropping and resizing" vẫn nằm trong roadmap, chưa làm **[vendor: roadmap]** [^6], và image field không có UI chọn tâm. Vì vậy `focus` là ô chọn 5 giá trị, còn khung cắt thật thì xem ở preview trang chủ (CSS thật, có từ P0).
   - `max_file_size`: đơn vị **[cần kiểm tra]**. `slugify_filename: true` để tên kiểu `IMG_4532.HEIC` không thành tên file **[vendor]**.
2. **Ảnh gốc**: bản WebP 2048 nằm ở `website/assets/originals/<nhóm>/<id>.webp` trong repo (public; ~30–40 MB cho 31 món + trang chủ **[ước tính]**). `.git` hiện nặng 35 MB **[repo]**; mỗi lần thay ảnh gốc cộng thêm ~0,3–1 MB vĩnh viễn vào lịch sử **[ước tính]**; mỗi năm kiểm tra dung lượng so với mức 1 GB GitHub khuyến nghị **[vendor]**. Action không copy thư mục này lên Pages. Vì Sveltia thay bản upload bằng WebP, **file máy ảnh thật không bao giờ vào repo**, nên cần một thói quen: **"up Drive trước, up admin sau"** (Drive `Website/Originals/<yyyy-mm>/`). Khi cần in (bìa sách POD, poster event) thì lấy bản trên Drive, không dùng bản trong repo.
3. **Biến thể**: `tools/images.mjs` (sharp **[vendor]**) sinh theo `focus`:
   - sản phẩm: `<id>-600.webp` + `<id>.webp` ≤1000, vuông;
   - hero 1080/720; badge Merlin 360; story 1000/640; tile 600; journal 800×500; daily 600; poster 480×600.

   Ảnh sản phẩm đặt tên theo `id`, nên link cũ không gãy. Ảnh trang chủ đặt tên theo **ô cố định** (`home/hero-1080.webp`, `home/journal-1-800.webp`…), nên `index.html` không phải sửa khi chị thay ảnh. Manifest hash tránh resize lại ảnh đã có (seed 31 ảnh hiện tại, mục 4). **Pipeline này không có công cụ tự phát hiện chữ đè trên ảnh [chưa có]**; kiểm soát bằng xác nhận `photoClean` của người đăng, và build từ chối sinh ảnh sản phẩm khi ô này chưa bật.
4. **Alt text**: bắt buộc trong JSON, viết tiếng Anh. Trên trang, ảnh có tên đi kèm ngay bên cạnh (card shop, tile bộ sưu tập, companions, journal, daily) giữ `alt=""`: đây là ảnh trang trí, đúng chuẩn, và main.js hiện đang cố ý làm vậy **[repo]**. Hero, story, about và ảnh lớn trang product dùng alt từ JSON. Audit Playwright kiểm hai điều: mọi `<img>` có thuộc tính alt; ảnh hero/story/PDP có alt khác rỗng.
5. **QUIET / quyền ảnh / credit**:
   - Sản phẩm có `rights` ≠ `own` → `quiet: true`, loại khỏi `favorites`, hero và "You may also love".
   - Ô trang chủ chỉ nhận ảnh `own` hoặc `customer` (kèm `credit`, hiện "photo: @handle"); ảnh `partner`/`pending` không đặt được vào ô trang chủ nào.
   - Ảnh khách đăng lại phải có credit. Ảnh có dấu lạ hoặc trông như ảnh AI thì không được feature. Không xoá dấu của người khác (luật).
   - Lý do cụ thể (ảnh đối tác / nghi AI / chưa rõ quyền) ghi ở Notion, không ghi vào JSON public [^11].
6. **Video (reel): nén tự động ngay từ P0.**
   - Runner Ubuntu 24.04 **không có sẵn** ffmpeg: không có trong danh sách tool ở README của runner-images **[vendor; Linh và em đối chiếu 20/10]**. Workflow tự chạy `apt-get install -y ffmpeg` (≈1 phút mỗi lần **[ước tính]**, nằm trong phút Actions miễn phí của repo public **[vendor]**).
   - Chị up mp4/mov gốc ≤25 MB **[giới hạn mình đặt]** vào folder `reels/`. Action transcode ra 480×600 H.264, tắt tiếng, cắt theo `focus`, tối đa 12 giây, ≤1 MB (reel hiện nặng 0,6–0,9 MB **[Elise]**).
   - Poster lấy frame ở giây thứ 1, ra webp 480×600; chị ghi đè được bằng ảnh tự chọn. Frame giây 1 của video móc len hay bị mờ hoặc bị tay che, mà poster là ảnh khách thấy trước tiên, cũng là ảnh hiện khi bật reduced-motion.
   - Mỗi lần đổi reel cộng tới 25 MB vĩnh viễn vào lịch sử git. Nếu đổi hơn 1 reel/tháng thì cân nhắc chuyển video gốc sang R2 (P1).

## 6. Publish flow & an toàn

- **Preview**:
  - P0: trang chủ dùng template React với CSS thật **[vendor]**, thấy đúng khung cắt. Các mục khác dùng pane mặc định, chưa đúng CSS **[vendor]**: *chỉ để soát chữ và ảnh; site thật thì xem sau 5–8 phút*.
  - P1: thêm CSS thật cho sản phẩm và khuyến mãi.
  - P2: link preview cho từng PR.
- **Publish**: Draft (Nháp) → In Review (Đang xem) → Ready (Sẵn sàng) → **Publish (Đăng)** = merge PR. Mỗi entry là 1 PR **[vendor]**. Còn ô bắt buộc để trống thì không chuyển sang In Review hay Publish được **[vendor]**. Ở P0, test chạy sau merge; đỏ thì không deploy, site giữ bản cũ. Deploy timeout 10 phút **[vendor]**.
- **Khi test đỏ: hệ thống tự báo, chị không phải làm gì thêm.**
  - Action comment tiếng Việt lên PR, gồm tên test đỏ và câu "Nhắn Claude: test X đỏ — site vẫn ở bản cũ".
  - GitHub gửi email "Run failed" (cài đặt thông báo **[cần kiểm tra]**; đặt "chỉ báo khi lỗi" để không nhận email mỗi lần xanh).
  - Báo qua Slack để sau, vì cần thêm webhook secret [^8].
  - Nói thẳng về P0: nếu `main` hỏng thì lần Publish kế tiếp cũng đỏ cho tới khi Claude sửa. Đó là lý do P1 phải bật required check + auto-merge.
- **File trong PR của Sveltia**: Sveltia từ chối Publish nếu PR chứa file nó không quản lý (không phải entry hay asset của nó) **[vendor: editorial]**. Vì vậy `js/products.js`, `js/home-data.js`, `custom-orders/sale-data.js`, `js/rules-data.js` và `catalog.csv` là **build output, KHÔNG commit** (đưa vào `.gitignore`). Nhánh `cms/*` chỉ chứa `content/`, `assets/originals/` và `reels/`.
- **Rollback / Hoàn tác**: admin chưa có undo, vì "Restore revisions" vẫn TBD **[vendor: roadmap]**. Ở P0, làm theo thứ tự:
  1. **GitHub → tab Actions → "Hoàn tác lần publish gần nhất" → Run workflow**, rồi đợi 5–8 phút **[ước tính]**;
  2. dự phòng: **GitHub → Pull requests → tab Closed → mở PR vừa đăng → Revert → Create pull request → Merge pull request**. Hướng dẫn 4 bước có ảnh chụp màn hình trong Notion là một deliverable của P0;
  3. không chắc thì nhắn Claude "revert".
- **Ai publish**: người có role Write **[vendor]**: Elise, và helper do chị mời rồi gỡ (P1, chỉ trong tuần event).
  - **Luật AI content (từ P0)**: Claude Code **KHÔNG** push thẳng lên `main` khi đổi nội dung (copy, ảnh, giá, sale). Claude mở PR kèm ảnh chụp Playwright ở 390/1280 (link preview thật có từ P2), và **Elise bấm Merge**.
  - Ở P0, chỉ thay đổi code thuần (CSS/JS/test, không đổi chữ hay ảnh) mới được push thẳng. Từ P1, branch protection áp cả admin nên code cũng phải qua PR; Claude tự merge PR code thuần khi test xanh [^3].
- **Dữ liệu sản phẩm**: không bao giờ xoá file JSON sản phẩm, chỉ chuyển sang `retired` (id là khoá của booth log).
- **Bí mật**:
  - Repo public, và `website/` không chứa bí mật nào.
  - Token P0 chỉ nằm trong trình duyệt của chị và password manager, giới hạn 1 repo, có hạn dùng.
  - `GITHUB_CLIENT_SECRET` (nếu dựng Worker) chỉ ở Worker; OAuth App đứng dưới GitHub của chị **[vendor]**. Cloudflare Free cho 100.000 request/ngày **[vendor]**.
  - Action giữ bước quét khoá.
  - **Luật same-origin**: admin và site chạy cùng origin, và token nằm trong localStorage. Vì vậy không thêm script bên thứ ba (widget analytics, chat, pixel) vào `website/` khi chưa review; audit quét mọi thẻ `<script src>` trỏ ra ngoài domain.
- **Sổ tài khoản & khoá** (bản đầy đủ ở Notion; cột 2FA/recovery chị điền, xem câu 1 mục 8):

| Tài khoản | Chủ (email) | 2FA + recovery codes cất ở đâu | Ai khác có quyền | Hết hạn / gia hạn |
|---|---|---|---|---|
| GitHub `elisehanhnguyenus-cloud` | Gmail công ty hay cá nhân? **[cần chị trả lời]** | **[cần chị trả lời]** | Claude Code (qua phiên của chị); helper Write chỉ tuần event (P1) | — |
| Fine-grained PAT "Sveltia admin" (1 repo, Contents RW + Pull requests RW) | Elise | password manager | không ai | 2/2027, nhắc trước 30 + 7 ngày **[đề xuất]** |
| Cloudflare (chỉ khi dựng Worker) | Gmail công ty | bật 2FA; recovery **[cần chị trả lời]** | không ai | — |
| GitHub OAuth App (chỉ khi dựng Worker) | GitHub của chị | Client ID công khai được; secret chỉ ở Worker, bấm Encrypt | không ai | — |
| Drive `Website/Originals` | Elise (chủ) | theo tài khoản Google | Claude đọc qua connector | — |
| Artifact Event Desk hosted | workspace Claude của chị | — | người được share | republish trong 24 giờ sau mỗi lần đổi giá/sale/món, và trước mỗi event |

  **Khi Elise vắng**: ở P0 không ai publish hay revert được (chấp nhận được vì P0 chỉ kéo dài trong tháng này). Từ P1, helper publish và revert được trong tuần event.

- **Đồng bộ**: generator chạy trong Action; Event Desk trên Pages và tests đọc file sinh **trong cùng một job**. `build-desk.js` (dựng bản hosted) do Claude chạy sau `node tools/build-data.js`.
  - **Đổi giá/sale/món qua admin thì bản Event Desk hosted trên claude.ai KHÔNG đổi theo, cho tới khi Claude republish.**
  - Quy ước từ P0 [^2]: **tại booth, giá lấy từ `event.html` trên site live**. Trang này đọc cùng `products.js` vừa sinh và tự về giá gốc khi sale hết hạn. Bản hosted là **kho đơn dùng chung** và có thể trễ giá.
  - Khi PR có đổi giá/sale/món, Action comment "catalog đổi → nhắn Claude republish desk". Claude republish trong 24 giờ, và luôn republish trước mỗi event.
  - `gownSale` sinh từ `promo.json` **ngay từ P0**.
- **Bảo trì định kỳ** (Claude chịu trách nhiệm, trừ việc gia hạn PAT):
  - nâng Sveltia mỗi quý trên một branch riêng, chạy Playwright và mở admin thử rồi mới merge (~30 phút/quý **[ước tính]**);
  - **ĐÓNG BĂNG 15/11–02/01**: không nâng Sveltia, không đổi pipeline;
  - chị gia hạn PAT trước 2/2027;
  - runner ghim `ubuntu-24.04`; Dependabot chỉ chạy cập nhật bảo mật, mỗi tháng một lần.
- **Lưu ý Prue về ToS của Pages**: "GitHub Pages is not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions or providing commercial software as a service (SaaS)." **[vendor; Prue và em đối chiếu ngày 20/10]**
  - (a) Đánh giá của Prue: site không nhận thanh toán, hàng bán trên Etsy, chỉ có link đặt cọc Square/Zelle, nên rủi ro thấp nhưng vẫn có.
  - (b) Plan B $0, ghi sẵn nhưng chưa làm: deploy cùng thư mục `website/` lên Cloudflare Pages **[vendor; giới hạn gói free cần kiểm tra]**. Chuẩn bị khi đăng ký domain purrlight.studio.

## 7. Một ngày của chị

**Từ điển nút** (deliverable P0, 1 trang Notion; các bước dưới đây ghi nút theo dạng "Tiếng Anh (Việt)"): Save = Lưu · New = Mới · Add = Thêm · Draft = Nháp · In Review = Đang xem · Ready = Sẵn sàng · Publish = Đăng · Discard = Bỏ · Revert = Hoàn tác. Nếu spike 0a cho thấy bật được `vi.yaml`, cách bật sẽ ghi ở đầu trang.

**1. "Đổi ảnh hero cho mùa Giáng sinh"**
1. Up file gốc vào Drive trước.
2. Mở `…/admin/` trên máy tính, hoặc trên iPhone bằng cách quét QR từ desktop để đăng nhập **[vendor]**.
3. Vào *Trang chủ* → *Hero* → *Ảnh*, kéo file vào. Nếu file HEIC bị từ chối: iPhone Settings → Camera → Formats → Most Compatible, hoặc gửi ảnh qua Mail/AirDrop để ra JPEG.
4. *Alt* (tiếng Anh): "Merlin, our tuxedo cat plush in a yellow beret, beside a small Christmas tree".
5. *Tâm ảnh*: giữa (ảnh vuông sẵn thì không cần chọn). *Quyền ảnh*: của mình.
6. Sửa *Tiêu đề*, *Hai dòng*, *Nút* "Shop Christmas".
7. Xem preview (CSS thật, đúng khung cắt), bấm **Save (Lưu)** → **Publish (Đăng)**.

Action chạy 5–8 phút **[ước tính]**. Sai ảnh thì vào GitHub → *Actions* → "Hoàn tác lần publish gần nhất" → **Run workflow**. Nhận email hoặc comment báo đỏ nghĩa là site vẫn giữ bản cũ; chị nhắn Claude.

**2. "Thêm 1 listing mới từ Etsy (sticker POD)"**
1. *Sản phẩm* → **New (Mới)** → *Mã* `merlin-sticker-sheet` → *Tên* → *Bộ sưu tập* "Patterns & Printables".
2. *Giá* theo Etsy; sticker có nhiều size/pack thì bật *Giá "from"* (`priceFrom`).
3. Dán *Link Etsy*.
4. Ảnh chính phải **sạch** (không chữ/badge/watermark): bật "Ảnh này không có chữ đè", điền *Alt* tiếng Anh.
5. *Loại*: **In theo yêu cầu** (`pod`); *Nguồn gốc*: `pod-partner`; *Gửi từ*: theo partner (câu 6 mục 8).
6. Tick bắt buộc "Listing Etsy đã khai production partner"; nếu thiết kế có dùng AI thì tick thêm "Đã khai AI art trên Etsy".
7. *Nhãn*: new → **Save (Lưu)** → **Publish (Đăng)**.

Build sẽ thêm id vào `NOT_HANDMADE`, ghi dòng chuẩn về production partner, bỏ care line handmade; Event Desk thấy món mới. Nhân tiện đổi ảnh tile "Patterns & Printables" sang ảnh sản phẩm.

**3. "Bật giảm giá 25 % tới 25/10 cho 5 món"** (đúng sale đang chạy, dùng luôn làm bài kiểm tra migrate)
1. *Khuyến mãi* → **Add (Thêm)** → *Tên* "Etsy-matched fall sale" → *Lý do* "match Etsy sale 25% tới 25/10" → *Bật*.
2. *Phạm vi*: món → chọn 5 món `christening-gown-set`, `maine-coon-cat`, `rosary-charm`, `saint-joan-of-arc-doll`, `americana-doll-bag-charm`.
3. *Giảm* 25 → *Ngày cuối* 25/10, *Giờ tắt* hết ngày (Central).
4. Tick "Đã đổi giá trên Etsy" → **Save (Lưu)** → **Publish (Đăng)**.

Generator sinh:
- `ends` = `2026-10-26T05:00:00Z` (CDT −5; sau 01/11 tự chuyển sang CST −6);
- `SALES.through` = "Sun, Oct 25 (Central Time)";
- `gownSale` = `through: "Oct 25"`, `day: "Sun, Oct 25"`.

Test `sales` giả lập giờ trước và sau mốc, **và** so 3 chuỗi sinh ra với bản tay hiện tại, phải khớp. Ngày 26/10, site và `event.html` trên Pages tự về giá gốc; **bản Event Desk hosted chỉ về giá gốc khi Claude republish** (Action comment nhắc trên PR). Cảnh báo >15 % (Morgan) hiện lên nhưng không chặn. Nếu mùa có 2 khuyến mãi (vd Black Friday + Christmas), bấm **Add (Thêm)** để tạo promo thứ hai với ngày cuối riêng; món nằm trong 2 promo đang bật thì build fail và báo rõ.

**4. "Đổi 1 reel"**
1. *Trang chủ* → *Reels* → ô 2 → kéo video vào (mp4/mov gốc ≤25 MB).
2. *Nhãn* ≤40 ký tự; *Link*: chọn sản phẩm.
3. *Poster*: để tự sinh, hoặc kéo ảnh tự chọn vào.
4. **Save (Lưu)** → **Publish (Đăng)**.

Action nén video về 480×600, ≤12 giây, ≤1 MB, tắt tiếng; mất 5–8 phút, cộng ~1 phút cài ffmpeg **[ước tính]**.

## 8. Câu hỏi mở cho chị (mặc định em giả định)

1. **Tài khoản & khoá**: tài khoản GitHub `elisehanhnguyenus-cloud` đăng ký bằng Gmail công ty hay email cá nhân? 2FA đã bật chưa, recovery codes cất ở đâu? Chị dùng password manager nào (Google Password Manager có sẵn, hoặc Bitwarden Free)? Nếu cần Cloudflare thì mở bằng email nào? Có chuyển repo sang GitHub Organization của Purrlight Studio LLC ($0) không? *Mặc định: Gmail công ty; Google Password Manager; chuyển sang Organization **cùng lúc với gắn domain purrlight.studio**, vì chuyển repo làm đổi URL Pages và gãy link cũ (có tự chuyển hướng không thì **[cần kiểm tra]**) [^12].*
2. **Mùa lễ & helper**: chị có đồng ý đóng băng pipeline 15/11–02/01 không (tức P1 phải xong trước 15/11, không kịp thì lùi sang tháng 1/2027)? Helper mùa event là ai, đã có GitHub chưa, và chị có đồng ý chỉ cấp quyền Write trong tuần event rồi gỡ ngay không? *Mặc định: đồng ý đóng băng; helper dùng GitHub riêng, quyền Write chỉ trong tuần event.*
3. **Sale & Event Desk**:
   - Chị tự bật sale trong admin, hay vẫn nhắn Claude để đồng bộ một lượt cả Etsy, site và bản hosted?
   - Ở event, nhân viên dùng `event.html` trên Pages hay bản hosted (kho đơn chung)? Bản nào là chuẩn?
   - Một mùa có thể có 2 khuyến mãi với 2 ngày hết hạn khác nhau không?
   - Chị có đồng ý để tool bắt tick "Đã đổi giá trên Etsy" trước khi Publish sale không?
   - Thanh promo (P1) và gift edits (P2) có đáng làm cho shop 31 món không?

   *Mặc định: chị tự bật trên site; booth lấy giá từ `event.html` trên Pages, bản hosted chỉ để ghi đơn; có (promo là danh sách ngay từ P0); có tick; promo làm ở P1, gift edits ở P2.*
4. **Ảnh & video gốc**:
   - Ảnh chị thường kéo từ iPhone (HEIC) hay từ máy ảnh/Drive (JPEG)?
   - Chị còn file ảnh SẠCH (chưa thêm chữ/badge) của 31 món không?
   - Reel chị up bản gốc từ iPhone (thường 20–60 MB cho clip 10–15 giây **[ước tính]**) hay bản đã cắt từ CapCut/TikTok?
   - Ba tháng tới chị dự kiến thay khoảng bao nhiêu ảnh?
   - Ảnh gốc 2048 và video gốc nằm trong repo public có ổn không?

   *Mặc định: HEIC, có fallback Most Compatible; giữ 31 crop hiện tại, luật "ảnh sạch" chỉ áp cho món mới; up gốc ≤25 MB, Action tự nén; ≤20 ảnh/quý thì để trong repo; file máy ảnh ở Drive. Nếu chị không muốn để trong repo public: repo private thì Pages cần GitHub Pro **[vendor, giá cần kiểm tra]** và Actions chỉ còn 2.000 phút/tháng **[vendor]**; thay vào đó, Action xoá file 2048 sau khi sinh biến thể (hoặc giới hạn 1600 px), vẫn $0.*
5. **Công cụ admin**: chị có chấp nhận Sveltia chưa ra v1.0 (chuyển sang Decap tốn ~3–5 giờ sửa config), và nút admin tiếng Anh (Draft / In Review / Publish) kèm từ điển 1 trang + nhãn trường tiếng Việt không? Nếu bắt buộc giao diện tiếng Việt 100% thì đây là điều kiện loại Sveltia. *Mặc định: chấp nhận, vì P0 không tốn tiền; nếu `vi.yaml` đủ thì bật.*
6. **Hàng POD & file số**:
   - Sticker và sách POD in qua ai (Printful/Printify hay partner khác)? Chị đã khai production partner trên Etsy chưa?
   - Sticker sheet có nhiều size/pack không? Thiết kế có dùng AI tạo hình không?
   - Tại booth, pattern PDF và hàng POD hiện chip bán hay ẩn hẳn (khách quét QR mua trên Etsy)?
   - Pattern dragon chỉ bán file trên Etsy, hay site cũng host PDF/preview?

   *Mặc định: `origin: pod-partner`; bật `priceFrom`; khai AI art nếu có dùng; chip gắn "QR → Etsy"; `kind: digital` chỉ có link Etsy, không có trường file.*
7. **Ảnh khách & alt text**: "Purrlight, daily" có đăng lại ảnh khách (UGC) không? Nếu có, chị đã quen xin phép qua DM và lưu @handle để ghi credit chưa? Alt text tiếng Anh thì chị tự viết mỗi lần đổi ảnh, hay để Claude viết sẵn một lượt cho 31 món + ảnh trang chủ khi di chuyển dữ liệu? *Mặc định: có UGC, bắt buộc credit; Claude viết sẵn, chị duyệt.*
8. **Món ngừng bán & giá Custom Orders**: khi listing trên Etsy hết hàng hoặc ngừng bán, site nên ẩn ngay hay giữ trang "no longer listed" + link shop (ảnh hưởng tới link cũ chị đã chia sẻ)? Giá Custom Orders giữ trong `prices.js` cho tới khi chị đổi > 2 lần/quý, chị đồng ý không? *Mặc định: món `retired` giữ trang "no longer listed"; món `sold-out` vẫn hiện kèm nhãn; giá custom ở lại `prices.js`.*

## 9. Nguồn

- Sveltia CMS: https://github.com/sveltia/sveltia-cms ; docs https://sveltiacms.app/en/docs ; backend https://sveltiacms.app/en/docs/backends/github ; ảnh https://sveltiacms.app/en/docs/media/internal ; asset library https://sveltiacms.app/en/docs/ui/asset-library ; workflow https://sveltiacms.app/en/docs/workflows/editorial ; preview https://sveltiacms.app/en/docs/api/preview-templates ; singletons https://sveltiacms.app/en/docs/collections/singletons ; JSON https://sveltiacms.app/en/docs/collections/entries/formats ; relation https://sveltiacms.app/en/docs/fields/relation ; operations https://sveltiacms.app/en/docs/collections/entries/operations ; roadmap https://sveltiacms.app/en/docs/roadmap ; auth Worker https://github.com/sveltia/sveltia-cms-auth
- Sveltia, bổ sung sau hội đồng (em mở và đối chiếu ngày 20/10): features (HEIC→WebP, mobile + QR sign-in, external media storage) https://sveltiacms.app/en/features ; Start Guide ("still in beta", snippet không ghi version) https://sveltiacms.app/en/docs/start ; image field https://sveltiacms.app/en/docs/fields/image ; string field (`pattern`) https://sveltiacms.app/en/docs/fields/string ; locale tiếng Việt https://github.com/sveltia/sveltia-cms/blob/main/src/lib/locales/vi.yaml
- Cloudflare Workers https://developers.cloudflare.com/workers/platform/pricing/ ; Cloudflare Pages (Plan B) https://developers.cloudflare.com/pages/platform/limits/
- GitHub: OAuth App https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app ; Pages limits (câu ToS) https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits ; custom workflow https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages ; nguồn publish của Pages https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site ; Actions https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-actions ; plans https://docs.github.com/en/get-started/learning-about-github/githubs-plans ; large files https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github ; protected branches https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches ; auto-merge https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request ; PAT (không hết hạn được phép; tự xoá sau 1 năm không dùng) https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens ; Run workflow https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/manually-running-a-workflow ; schedule https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows ; Secrets https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions ; runner Ubuntu 24.04 (không có ffmpeg) https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md ; `ubuntu-latest` chuyển sang 26.04 từ 19/10 tới 19/11/2026 https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration
- Playwright CI https://playwright.dev/docs/ci-intro ; sharp https://sharp.pixelplumbing.com/
- Decap (fallback, phải sửa config): https://decapcms.org/docs/github-backend/
- Notion (B): https://developers.notion.com/reference/request-limits ; https://developers.notion.com/reference/file-object ; https://developers.notion.com/docs/working-with-files-and-media ; https://www.notion.com/pricing ; https://developers.notion.com/docs/upgrade-guide-2025-09-03 ; https://www.notion.com/help/webhook-actions
- Supabase (C1): https://supabase.com/pricing ; https://supabase.com/docs/guides/storage/serving/image-transformations ; https://supabase.com/docs/guides/storage/uploads/file-limits
- Tally (C2): https://tally.so/pricing
- Ngân sách ~$57/tháng: snapshot Morgan 04/2026, tài liệu đội **[Elise]**.
- Repo (đọc ngày 20/10) **[repo]**: `website/js/products.js` (SALES dòng 445–451, NOT_HANDMADE/QUIET, CATEGORIES), `website/custom-orders/prices.js` (gownSale dòng 161), `website/js/main.js` (dòng 112), `website/js/event-desk.js` (dòng 956–967), `website/index.html` (hero, reels, daily), `website/README.md` (bản hosted dùng chung kho đơn).

## Phụ lục: ba hướng đã cân nhắc

| Hướng | Kết luận | Lý do chính | Ý giữ lại |
|---|---|---|---|
| **A. Git-based CMS (Sveltia)** | **CHỌN** | $0; form + preview + 1 nút Publish + nút Hoàn tác (Actions); JSON thuần trong repo **[vendor]** | mục 4–6; đường chuyển sang Decap (phải sửa config, xem mục 3) |
| **B. Notion DB → Action** | **không chọn** (xét lại nếu Sveltia gãy) | Publish bấm ở GitHub; link ảnh hết hạn 1 giờ; Free 5 MB/file, lịch sử 7 ngày **[vendor]** | "Quyền ảnh" tự QUIET; "Hiện từ/đến" (P2); `/preview/` noindex; manifest hash; hàng đợi Notion |
| **C. Custom tinh gọn** (C2 form → Claude; C1-git; C1-Supabase) | C2 làm **cầu nối** ở P0; C1-git **chỉ ở P2** nếu Sveltia thiếu crop/nhãn Việt; C1-Supabase **BỎ** | C2: bus factor = Claude; C1-git: code tự nuôi; Supabase Free pause sau 1 tuần, Pro $25, resize chỉ Pro **[vendor]** | nền `content/` + generator + sharp + tests (P0); Drive giữ file gốc; `gownSale` sinh từ promo (P0); workflow `revert` (P0) |

[^1]: **Giờ hết sale**: v1 ví dụ "25/10 23:59", Hải Đăng đề xuất lưu `endsLocal: "2026-10-25 23:59"`; trong khi Morgan và Hải Đăng cùng yêu cầu chuỗi/giá trị sinh ra phải khớp bản tay hiện tại (`2026-10-26T05:00:00Z` = 00:00 CDT ngày 26/10). Nếu lưu 23:59 thì ra 04:59Z, lệch 1 phút và làm hỏng cổng diff = 0. Em chọn **"Ngày cuối" + "Giờ tắt" bỏ trống = hết ngày (00:00 hôm sau theo giờ Chicago)**: an toàn hơn vì tái tạo đúng giá trị hiện tại, và vẫn giữ `tz: America/Chicago` cùng cách đổi DST bằng thư viện như Hải Đăng yêu cầu. Muốn tắt lúc 23:59 thì chị gõ vào ô giờ.
[^2]: **Bản Event Desk hosted**: Hải Đăng muốn republish trong 24 giờ sau mỗi lần đổi catalog; Minh Triết muốn chỉ rebuild khi chị yêu cầu. Em chọn **24 giờ + luôn republish trước mỗi event** (an toàn hơn cho giá ở booth). Về cơ chế, em chọn cách rẻ hơn: **Action comment nhắc trên PR**, thay vì để Action tự ghi vào hàng đợi Notion (cách đó cần thêm Notion token vào Secrets). Giá ở booth luôn lấy từ `event.html` trên Pages, nên bản hosted có trễ thì cũng không làm sai giá.
[^3]: **Push thẳng `main`**: Morgan cho phép Claude push thẳng code thuần và coi branch protection P1 chỉ là "khoá cứng" luật đó; Prue muốn branch protection P1 chặn push thẳng với mọi người, kể cả admin. Em chọn: **P0 theo Morgan, từ P1 theo Prue** (an toàn hơn). Code thuần vẫn qua PR, Claude tự merge khi test xanh; PR nội dung do chị merge.
[^4]: **Trường `origin`**: Minh Triết đề xuất dạng text, cho phép ẩn UI tới P1; Hải Đăng đề xuất ô chọn 4 giá trị, kèm `shipsFrom`, hiện ngay P0. Em chọn **ô chọn** (an toàn hơn): không có chữ tự do, generator chỉ ghi được dòng chuẩn, không thể vô tình sinh "Made in USA".
[^5]: **Cổng diff = 0 và dòng chuẩn ships-from**: Hải Đăng và Prue yêu cầu deep-compare = 0; Hải Đăng cũng muốn generator thay dòng ships-from tự do bằng dòng chuẩn. Hai việc này không làm cùng một lúc được, nên em tách migration thành **bước A** (diff = 0) và **bước B** (PR riêng chỉ đổi các dòng ships-from, chị duyệt). Mỗi bước kiểm được riêng.
[^6]: **Nhãn HEIC / crop / maintainer / beta**: Morgan, Minh Triết và Prue nói trang media/internal không nhắc HEIC; Linh nói trang features có ghi. Em đối chiếu ngày 20/10 thì **cả hai đều đúng**: features ghi "Convert uploads to WebP, including HEIC photos from phones", còn media/internal không có. Vì vậy em dẫn features là [vendor] nhưng vẫn giữ **[cần kiểm tra]** cho cấu hình của mình tới khi spike 0a thử ảnh iPhone thật, kèm fallback (an toàn hơn). Crop: Prue đề nghị [cần kiểm tra], Linh dẫn roadmap; em thấy roadmap có "Quick cropping and resizing" chưa làm, nên ghi **[vendor: roadmap]**. Maintainer: Minh Triết dẫn "single developer"; em chỉ thấy trên trang chủ câu "Maintained by an experienced UX engineer", nên giữ **[cần kiểm tra]**. Beta: Start Guide ghi "still in beta", README ghi "feature complete"; cả hai đều [vendor] và đều được giữ.
[^7]: **Publish có chờ test xanh không**: Morgan yêu cầu hạ nhãn xuống [cần kiểm tra] vì chưa trang nào xác nhận; Hải Đăng và Prue nói docs có xác nhận. Em đối chiếu trang editorial ngày 20/10: Sveltia "sets it to auto-merge… merges it as soon as the checks pass", với điều kiện repo cho phép auto-merge và "the CMS only waits when the checks are the sole thing blocking the merge". Vì vậy em giữ **[vendor]**, vẫn thêm fallback của Morgan (rẻ, an toàn) và thử lại trong repo mình ở P1. Hệ quả: **không bật required approving review**.
[^8]: **Kênh báo lỗi**: Prue đề xuất comment lên PR và/hoặc Slack. Em chọn **comment trên PR + email mặc định của GitHub** (rẻ hơn: không cần thêm webhook secret vào Actions); Slack để sau.
[^9]: **Worker OAuth**: v1 và lịch phút của Prue đặt Worker ở P1; Minh Triết đề xuất chỉ dựng khi cần. Em chọn **chỉ dựng khi có điều kiện kích hoạt** (rẻ hơn, bớt một tài khoản vendor phải đứng tên), và vẫn giữ sẵn danh sách phút của Prue cho lúc cần dựng.
[^10]: **`max_file_size`**: Linh (must-fix) cần ≤25 MB để nhận được video gốc; Minh Triết (gợi ý) đề xuất ≈1 MB để repo khỏi phình. Em theo must-fix là **≈25 MB** và ghi rõ chi phí phình repo ở mục 5.6, kèm lối thoát R2 ở P1.
[^11]: **Giá trị `rights`**: Linh (must-fix) muốn 4 giá trị, gồm cả "chưa rõ"; Hải Đăng (gợi ý) lo rằng ghi "chưa rõ" vào JSON public là tự công bố bằng văn bản. Em giữ đủ 4 giá trị theo Linh, nhưng đặt key trung tính là `pending`, còn lý do cụ thể ghi ở Notion, không ghi vào repo.
[^12]: **Chuyển repo sang Organization**: Minh Triết mặc định làm ở cổng 0→1; Prue nhắc rằng đổi URL Pages sẽ gãy link trên Etsy, Linktree và booth log. Em đổi mặc định thành **chuyển cùng lúc với gắn domain purrlight.studio** (an toàn hơn), để URL công khai chỉ đổi một lần.
[^13]: **Từ cấm chặn cứng hay chỉ cảnh báo**: Hải Đăng và Linh (must-fix) muốn `pattern` chặn ngay trong form; Prue (gợi ý) đề xuất IP watchlist chỉ là WARNING trong audit. Em chọn **chặn cứng trong form**, audit đọc cùng file (an toàn hơn).
[^14]: **Tên trường badge Merlin**: Morgan đặt `badgeImage` + `badgeCaption`, Linh đặt `merlinBadge` + `caption`; hai cách cùng nghĩa. Em dùng tên của Morgan.

## Biên bản hội đồng (Morgan · Hải Đăng · Linh Trần · Minh Triết · Prue)

*Cả 5 người duyệt: **APPROVE_WITH_CHANGES**. Tổng 44 must-fix, tất cả đã áp vào bản này; chỗ xung đột xem chú thích. Lời ký giữ nguyên văn.*

### Morgan Chen — Marketing Manager

**Kết luận (verdict):** `APPROVE_WITH_CHANGES` · must-fix đã áp: 8/8

> Kết luận: APPROVE WITH CHANGES. Hướng Sveltia $0, một nút Publish, có bước Draft → In Review → Publish (em đã đối chiếu docs: editorial workflow mở 1 PR cho mỗi entry) là đúng cỡ cho shop 31 món: chị chạy được hero mùa, featured picks và promo có đủ scope + depth + end date trong vài phút, không sinh thêm chore hằng ngày.
>
> Ba điểm phải sửa trước khi chốt: (1) sale đang khai ở 2 nơi (promo.json và từng sản phẩm) → chỉ giữ promo.json dạng danh sách, mỗi promo có ngày hết hạn riêng, generator sinh đúng chuỗi 'through' site đang hiện; (2) bản Event Desk hosted không tự đổi giá sau khi publish — phải ghi quy ước booth, nếu không walkthrough 3 hứa sai; (3) Undo đang là nút Revert trên GitHub, chưa có đường bấm cho người mới.
>
> AI content: từ Phase 0, Claude mở PR để chị bấm duyệt, không push thẳng main — đúng luật 'AI content → CEO review'.
>
> Thời gian của chị: ≤30 phút/tuần ở cổng 1→2 là hợp lý; đo bằng số lần Publish và số lần gọi Claude mỗi tháng.
>
> Số liệu: HEIC, '≤2048 px', '1 maintainer' đang mang nhãn [vendor] nhưng không có trong nguồn mục 9 → hạ xuống [cần kiểm tra]; Sveltia tự nhận 'feature complete', v1.0 dự kiến cuối 2026.
>
> Không chi đồng nào trước khi cổng 0→1 xanh 3 lần. Sửa xong 8 điểm trên, em ký đi tiếp.
>
> — Morgan Chen, Marketing Manager

### Hải Đăng — Ecommerce Executive

**Kết luận (verdict):** `APPROVE_WITH_CHANGES` · must-fix đã áp: 9/9

> APPROVE_WITH_CHANGES — Nền `content/*.json` → generator → `js/products.js` là đúng hướng: một catalog nuôi cả site lẫn Event Desk, không nhập lại; em duyệt với điều kiện sửa data model trước khi migrate 31 món.
>
> Hiện trạng [repo/Elise]: plan để sale ở hai nơi (`sale{}` trong sản phẩm và `promo.json`) và để `gownSale` làm tay tới P1 trong khi gown đang sale 25% tới 25/10 ở cả hai file; ships-from/production partner chỉ là text tự do trong 31 `details[]`; `notHandmade` là boolean nên sticker POD và PDF pattern bị gộp một kiểu; bản hosted Event Desk inline catalog nên sau khi chị Publish, booth vẫn giá cũ tới khi Claude republish.
>
> Đề xuất: một nguồn sale duy nhất = `promo.json` (sinh cả `SALES` lẫn `gownSale` ngay P0); `kind` / `origin` / `shipsFrom` / `status` dạng ô chọn, generator viết dòng chuẩn, không bao giờ sinh "Made in USA"; luật claims + IP thành một file `banned.json` đẩy vào `pattern` của form, desk và test; `ends` lưu giờ Chicago rồi đổi UTC; không bao giờ xoá id sản phẩm.
>
> Thực hiện: toàn bộ là sửa chữ ở §2/§4/§6/§7, $0, thêm khoảng 0,5 ngày công vào Phase 0 [ước tính].
>
> Tác động: migrate một lần là đúng; sau này TikTok Shop / Amazon / POD đọc cùng JSON không re-entry; chị không thể vô tình đăng claim hay tên brand vì form chặn trước khi Save.
>
> Về số liệu: em không thấy số nào bị bịa — mọi số đều có nhãn; em chỉ sửa cách đo cổng "diff = 0" cho đo được thật và xác nhận hai claim Sveltia (editorial workflow, `pattern`) là có thật theo docs [vendor].

### Linh Trần — Social Media Executive

**Kết luận (verdict):** `APPROVE_WITH_CHANGES` · must-fix đã áp: 7/7

> Kết luận: APPROVE WITH CHANGES — xương sống Sveltia + GitHub Action + sharp là đúng hướng và $0, nhưng pipeline ảnh như đang viết chưa cho chị đổi ảnh một mình ngay ngày 1.
>
> Ba chỗ em kiểm tra thấy gãy: (1) Sveltia chưa có crop hay chọn tâm ảnh (roadmap còn TBD), nên 'tâm ảnh' chỉ là dropdown và chị chỉ thấy khung cắt SAU khi lên site — preview trang chủ với CSS thật phải vào Phase 0; (2) ảnh Etsy có chữ/badge: crop theo tâm không cắt được chữ — cần ảnh gốc sạch + ô xác nhận 'không chữ đè'; (3) reels: runner Ubuntu 24.04 không có sẵn ffmpeg và giới hạn 1 MB nghĩa là chị vẫn phải tự nén video — Action phải cài ffmpeg và nén tự động từ P0, hoặc nói thật là reels vẫn qua Claude.
>
> Content model thiếu so với index.html thật: ảnh 'the real Merlin' 360, ảnh Merlin & friends, link riêng từng tile 'daily' (3 TikTok + 3 Pinterest), label/link từng reel.
>
> Ảnh trang chủ chưa có trường quyền ảnh và credit — ảnh khách đăng lại phải có credit, ảnh chưa rõ dấu không được lên hero. Luật nhà mình, không phải luật mới.
>
> Alt text phải viết tiếng Anh (site cho khách Mỹ); ví dụ trong mục 7 đang tiếng Việt. Giọng thương hiệu nên nằm ngay trong form bằng hint + pattern, không chờ test đỏ.
>
> Tin tốt em đã xác minh: Sveltia có HEIC→WebP, có file locale tiếng Việt, dùng được trên điện thoại với QR sign-in — chị chụp Merlin xong up luôn từ iPhone.
>
> Sửa xong 7 điểm must-fix, em ký.

### Minh Triết — R&D Manager

**Kết luận (verdict):** `APPROVE_WITH_CHANGES` · must-fix đã áp: 9/9

> NÊN LÀM — có điều kiện: qua một spike 2–3 giờ trước khi chi 1–2 ngày công cho migration.
>
> Build-vs-buy đúng tỷ lệ cho shop 31 món: "mua" Sveltia (MIT, $0), chỉ "xây" generator + sharp + tests; mọi phase $0 tiền mặt, không có khoản chi nào trước cổng.
>
> Em đã đối chiếu docs Sveltia hôm nay: editorial workflow có thật (tạo PR), PAT login có thật, "beta, single developer, 1.0 cuối 2026" là lời vendor — nhãn [vendor] trong plan đứng được.
>
> Hai chỗ nói quá nguồn: HEIC (docs không nhắc) và WebP 2048 (giá trị ví dụ, phải tự cấu hình).
>
> Chi phí ẩn thật mà plan chưa gọi tên: script nhúng không pin version nên beta tự cập nhật; undo P0 là 4–5 bước trên GitHub; Event Desk hosted vẫn cần Claude; repo phình theo mỗi lần thay ảnh.
>
> Một lỗi kỹ thuật: Action commit `products.js` vào nhánh entry sẽ bị Sveltia từ chối Publish — file sinh phải là build output.
>
> Portability: JSON/sản phẩm + generator là nền tốt; thay `notHandmade` bằng `kind` (handmade/pod/digital) để sticker POD, sách in, pattern số vào không cần hack.
>
> Sửa 9 điểm must-fix là em ký; không có điểm nào tốn tiền, chỉ tốn vài giờ công.

### Prue — Strategic Advisor & HR/Ops

**Kết luận (verdict):** `APPROVE_WITH_CHANGES` · must-fix đã áp: 11/11

> Kết luận: DUYỆT CÓ ĐIỀU KIỆN — hướng Sveltia đúng ví tiền ($0 thật: Actions miễn phí cho repo public, không thêm vào ~$57/tháng) và đúng luật "công ty giữ admin mọi tài khoản"; không sinh việc hằng ngày cho Elise.
>
> [Nhận định] Phase gate "chưa qua cổng = chưa chi tiền" đúng tinh thần Lean; dữ liệu JSON nằm trong repo nên không lock-in; bus factor của Claude giảm thật từ P1 (helper publish/revert được). Em đã đối chiếu docs Sveltia/GitHub/Supabase 20/10: editorial workflow, Sign In with Token, preview React, Supabase pause 1 tuần và resize chỉ Pro — đều đúng như plan ghi.
>
> [Cảnh báo rủi ro] (1) "Fallback Decap cùng config" chưa đúng: singletons, transformations, Sign In with Token là của riêng Sveltia — Sveltia gãy thì phải viết lại config và cần Worker OAuth trước. (2) Chưa có Sổ tài khoản & khoá: ai giữ 2FA/recovery codes, token cất đâu, helper gỡ khi nào. (3) ToS GitHub Pages cấm "run your online business" là câu có thật — cần plan B $0 ghi sẵn. (4) P1 rơi giữa tháng 12 = đổi đường ống publish đúng lúc Elise bận nhất. (5) Repo còn chứa plugins/docs, helper Write là quyền trên cả repo.
>
> [Giải pháp thực chiến] Ghim version Sveltia + đóng băng 15/11–02/01; config dạng files collection để fallback là thật; token ở password manager, hạn tháng 2/2027; thêm bảng Sổ tài khoản vào §6; báo lỗi test bằng tiếng Việt lên PR/Slack; helper Write chỉ trong tuần event rồi gỡ; mỗi phase ghi rõ số phút Elise tự làm; migration lấy đủ 5 mục SALES + gownSale.
>
> [Câu hỏi ngược] GitHub của Elise đang là email công ty chưa, recovery codes ở đâu? Ở event nhân viên dùng event.html trên Pages hay artifact hosted? Chấp nhận đóng băng mùa lễ (P1 trước 15/11 hoặc lùi tháng 1)?
>
> — Prue, 20/10/2026
