# Website × Làng Purrlight: kết hợp được không? (bản chốt, 20/10/2026)

## Trả lời ngắn

1. **Kết hợp được, nhưng khách và làng không dùng chung màn hình.** Khách chỉ gặp Merlin trên website. Làng là phòng làm việc riêng của chị. Số liệu chỉ đi một chiều, từ ngoài vào làng.
2. **Làm ngay, trước 09/11 (Đợt 1a):** khách gửi form Custom Orders xong, trang hiện một dòng *"Got it — Merlin noted your order. Next step: your 50% deposit, just below."* Hôm nay gửi xong trang không nói gì. Việc này khoảng 2–3 giờ Claude **[ước tính]**, $0.
3. **Cảnh Merlin nhận đơn (Đợt 1b, ≤4 giây):** dùng **ảnh Merlin thật** như chị chọn ngày 16/10. Cuốn sổ, đèn bàn và phong thư hiện dần, kèm "workflow ngắn" là 5 bước thật của đơn: đã nhận → cọc → mockup → làm → duyệt ảnh. Cảnh chỉ lên trước mùa lễ nếu merge được trước ~01/11 mà không lấy giờ của Admin P0. Không thì để sau 02/01, và nhiều khả năng sẽ là sau 02/01.
4. **Chị duyệt từng khung hình và từng chữ ở bản xem trước, trước khi code được gắn vào.** Không đợi tới lúc bấm Merge mới duyệt.
5. **Bảng số trong làng ("Văn phòng Merlin"): TẠM DỪNG.** Đồng bộ Etsy đã đứng từ 02/10 (đêm nào hàm cũng trả lỗi 503), nên làm bảng bây giờ thì bảng chỉ có số cũ. Cần sửa đồng bộ Etsy trước, như một việc riêng.
6. **Không làm:** đưa làng 3D hoặc chữ "AI/agent" ra trang khách, và "Merlin nhận đơn Etsy" theo thời gian thực (về kỹ thuật không làm được).
7. **Đo bằng một con số:** trong số khách gửi form, bao nhiêu người trả cọc trong vòng 48 giờ. Sau 4 tuần mà số không tăng thì gỡ.

> **Cách đọc:** chị đọc mục **Trả lời ngắn**, mục **1** (làm / dừng / bỏ) và mục **9** (6 câu hỏi, câu nào cũng có mặc định) là đủ để quyết. Mục 3–8 là phần kỹ thuật cho Claude làm.
> **Nhãn số liệu:** **[đo]** đo hoặc đọc trực tiếp ngày 20/10 (ghi kèm người đo khi số do hội đồng đo) · **[repo]** đọc trong repo website · **[làng]** chữ đang ghi trong file Làng · **[ước tính]** ước lượng · **[cần kiểm tra]** chưa xác minh · **[suy luận]** suy ra, chưa có luật viết · **[đề xuất]** lựa chọn của em, chị đổi được · **[vendor]** theo tài liệu nhà cung cấp.
> *Khi chuẩn bị bản này, em chỉ đọc file Làng (bản lưu trong máy), không sửa và không publish lại. Số Supabase do Hải Đăng, Minh Triết và Prue đo, chỉ bằng SELECT đếm và cộng tổng hoặc xem cấu trúc bảng, không ai mở cột tên, email hay raw. Tally chỉ đọc cài đặt form và số tổng, không mở câu trả lời của khách.*


> **Em kiểm lại tối 20/10, chỉ đọc số tổng:** `vietdelight.sync_log` có đúng 1 dòng, ghi lúc 02/10 19:30 UTC với source `manual:…`. `etsy_tokens` có 0 dòng. Đơn mới nhất là 26/09, tổng 130 đơn. Lịch đêm đã chạy 17 lần, lần cuối 19/10 23:00 UTC, và phản hồi HTTP gần nhất là `503 {"ok":false,"error":"chua cau hinh CRON_SECRET - ham tu khoa"}`. Khớp với số hội đồng đo.
>
> **Bản xem trước để chị duyệt (cổng ở 4.4):** https://claude.ai/artifact/JVbVgbkz9bBqDimQS8XW8G (bản 6, theo mặc định câu 1). Bản này có:
> - ảnh Merlin thật trong vòng đèn, cùng bàn, đèn, phong thư dấu chân mèo, cuốn sổ, 2 nét bút chì và một dấu tích;
> - không có ngôi sao trang trí nào ngoài các tia sáng quanh đèn như trên trang;
> - đủ các khung: 1a (chỉ dòng chữ, 390 px), 1b ở 1280 px và 390 px (5 bước thật, một nút Skip/Replay), confirm.html (chọn được chú thích của Linh hoặc của Morgan, có chế độ "đã xem rồi"), và storyboard 5 nhịp.
>
> Chị duyệt cả tranh lẫn chữ ở đó trước khi em gắn code.

---

## 1. Làm gì, tạm dừng gì, bỏ gì

| Việc | Quyết định | Khi nào | Vì sao |
|---|---|---|---|
| **1a.** Dòng chữ "đã nhận đơn, bước tiếp theo là…" sau khi gửi form Custom Orders | **NÊN LÀM** | Tuần Admin P0. Hạn merge cứng: **23:59 giờ CT ngày 09/11** | Đây là chỗ trống thật mà khách gặp. Việc nhỏ, sát các hạn đặt quà 25/10, 08/11, 15/11 |
| **1b.** Cảnh Merlin ≤4 giây (ảnh thật + sổ/đèn + 5 bước) | **NÊN LÀM, sau 1a** | Chỉ khi merge được trước **~01/11** mà không lấy giờ của P0[^2]. Không thì **≥04/01/2027** | Món tráng miệng, không phải bữa chính |
| Cảnh trên `confirm.html` (biên nhận booth) | **NÊN LÀM, rẻ** (~1 h **[ước tính]**) | Mặc định để **tháng 1** nếu có booth trước 14/11 (câu 6) | Biên nhận đang được dùng thật, sửa sát chợ lễ là thêm rủi ro |
| **Sửa đồng bộ Etsy** (sổ đứng từ 02/10) | **NÊN LÀM, việc riêng, ưu tiên cao hơn làng** | Mặc định tháng 11, sau P0 (câu 4) | Kho Sổ Cái mất số mùa Q4, là số cần nhất cho kế hoạch 2027 |
| Văn phòng Merlin + nhiệm vụ mô phỏng thứ 7 (không cần số) | **NÊN LÀM** | Sau 02/01, **không phải chờ** đồng bộ Etsy | Không cần dữ liệu |
| Các ô số từ Supabase | **TẠM DỪNG** | Tới khi qua cổng "7 đêm đồng bộ liên tiếp thành công" (mục 7) | Hôm nay chỉ có số ngày 02/10 |
| Ô Tally + ô booth qua relay | **TẠM DỪNG** | Tới khi có view số tổng và doc `stats/summary` của Event Desk (mục 3.3) | Tránh để tên, địa chỉ khách đi qua phiên Claude |
| Mức Đầy đủ (ô connector trong trang, Merlin "nhận thư" ≥30 giây, relay tự động) | **TẠM DỪNG** | Tới cổng +4 tuần sau Đợt 2 | Tránh thêm một màn hình phải trông |
| Cảnh "Merlin nhận đơn" trong artifact Event Desk ở booth | **BỎ mùa này** | — | Khách không được gì, lại đụng công cụ bán hàng đang chạy |
| Đưa three.js hoặc làng ra trang khách, nói "AI agent" với khách | **BỎ** | — | Riêng tư, thương hiệu, hiệu năng (mục 2) |
| "Merlin nhận đơn Etsy" theo thời gian thực | **BỎ** | — | Site không thấy đơn Etsy, artifact không nhận webhook |

---

## 2. Hai thế giới khác nhau

| | **Website công khai (cho khách)** | **Làng Purrlight (riêng cho chị)** |
|---|---|---|
| Ai xem | Bất kỳ ai: khách Etsy, Linktree, Google (trừ `event.html` và `confirm.html` để noindex **[repo]**) | Chị, và người chị chủ động share. Là artifact **private** trên claude.ai. Làng đứng tên ai thì **[cần kiểm tra]** (câu 5) |
| Ở đâu | GitHub Pages, **repo public** (README:540 **[repo]**). Thứ gì chép vào `website/` đều công khai | claude.ai. File HTML 1.020 dòng / 121.730 byte **[đo]** |
| Dữ liệu | Không có backend. Bán và thanh toán diễn ra trên Etsy, Square, Zelle. Site **không biết** khi có đơn Etsy **[repo]**. Supabase chặn đúng cách: khoá công khai không đọc được gì **[đo]** | Chuyện nội bộ: 14 công trình, 12 AI agent, 6 nhiệm vụ mô phỏng **[đo]**, $683 tiền API, 130 đơn, 92 khách **[làng]** (con số "92 khách" đang sai, xem 3.1), đường dẫn file, luật vault |
| Giọng | Tiếng Anh, Brand Canon v2: ấm, kể chuyện, "Made by hand. Made to be kept." Thư cho khách viết ở ngôi thứ nhất của chị, ký "Elise" **[repo]** | Tiếng Việt, phong cách phép thuật: "Phép màu cần luật", Cổng Phong Ấn, Vòm Giả Kim, Tinh Thạch **[đo]** |
| Merlin | **Trên trang: ảnh Merlin thật.** Custom Orders dùng ảnh thật ở hero, mục Giáng sinh và cuối trang (`merlin-portrait.webp`, Merlin đeo nơ đỏ, `custom-orders/index.html:692`), chị chọn ngày 16/10 (TONG-HOP §8k: "ảnh 13 cắt tròn thay hình vẽ"). Ngày 20/10 cả site thay các khối minh hoạ SVG bằng ảnh thật (README:202 "rõ ràng, không mockup quá đà") **[repo]**. **Bản vẽ canon** (khi có dùng hình vẽ): mèo tuxedo, beret vàng nghệ `#CA8D41` có sao thêu, yếm sage, ba lô ô-liu, **không phải mèo phù thuỷ** (README:7-17 **[repo]**) | Một con mèo đen một màu, mắt hổ phách phát sáng, ngực có quầng sáng, không yếm trắng, không beret **[đo]** |
| Chuyển động | Không bounce, không confetti. Đầu `custom-orders.css` ghi: *"Motion: fade/ease 200–300 ms, no transforms — except the motion Elise asked for on 16/10 (reveal, lift, drift, and the small lights and snow)"* **[repo]**. Chuyển động tự chạy >5 giây phải có nút dừng (WCAG 2.2.2). Tôn trọng reduced-motion | Vẽ lại mọi khung hình không nghỉ. Mèo đi có nhún. Reduced-motion chỉ được tôn trọng một phần **[đo]** |
| Trọng lượng | Custom Orders: 21 request, 480 KB, CLS 0 ở 390 px (README:284 **[repo]**) | three.js r128: 603.445 byte gốc **[đo]**, gzip -9 là 148.738 byte **[đo: Minh Triết]**. Con số 120.859 byte trong bản v1 có lẽ là nén brotli **[cần kiểm tra]**. 431–637 draw call, 171k–189k tam giác, 9 đèn điểm (8 đèn công trình + `catLight`), bóng 2048² **[đo]** |

**Vì sao KHÔNG đưa làng hay chữ "AI/agent" ra trang khách:**
- **Riêng tư.** Repo public, nên chép HTML làng vào `website/` là công khai tên agent, schema Supabase, connector, số lãi lỗ.
- **Thương hiệu.** Làng toàn chữ phép thuật. Brand v2 cấm "magic/spell/wizard", danh sách `bannedInNote` cũng cấm (event-desk.js:63-73 **[repo]**).
- **Định vị handmade.** Câu "12 AI agent xử lý đơn của bạn" đi ngược "Made by hand" và định vị handmade trên Etsy **[suy luận]**.
- **Hiệu năng.** Thêm three.js thì trang Custom Orders 480 KB nặng thêm khoảng 149 KB gzip, chưa kể thời gian máy xử lý khoảng 603 KB code và dựng 170–190 nghìn tam giác. Điện thoại tầm trung dễ giật và hao pin **[ước tính]**. FPS trên máy thật **[cần kiểm tra]**.
- **Không mở được.** Làng là artifact private, khách bấm link sẽ không vào được.

→ **Luật chốt:**
- Khách chỉ thấy **Merlin của storybook** (trên trang là ảnh Merlin thật). Chỉ chị thấy **Merlin của làng**. Hai bên dùng chung nhân vật Merlin, ngoài ra không dùng chung gì.
- **Không chụp màn hình làng để đăng lên kênh của shop**, kể cả dạng "hậu trường". Lý do: Merlin trong làng lệch canon, làng có chữ phép thuật mà Etsy cấm, và có số nội bộ ($683 API, 130 đơn, schema). Nếu chị muốn kể chuyện hậu trường, cần một quyết định thương hiệu riêng (câu 5). Lý do là trong làng Merlin đại diện cho dòng việc chạy qua hệ AI, còn ngoài site Merlin là nhân vật storybook.

---

## 3. Ý A: bảng điều khiển trong làng (Văn phòng Merlin)

> **Trước khi làm, cân nhắc mua hay tự làm:** phần lớn số của các ô đã xem được miễn phí ở chỗ có sẵn: Etsy Shop Manager Stats, tab Summary của Tally, Supabase Studio. Giá trị riêng của Văn phòng Merlin là **gom Etsy + Custom Orders + booth vào một chỗ**, cộng niềm vui khi nhìn. Nếu chị vẫn mở Etsy mỗi ngày thì các ô Supabase không tiết kiệm được phút nào (câu 5).

### 3.0 Hiện trạng đồng bộ Etsy (số đo 20/10)

| Thứ đo | Kết quả | Ai đo |
|---|---|---|
| `vietdelight.sync_log` | **1 dòng**: source `manual:sync.js pull + nap tay qua MCP`, ok, 02/10 19:30 UTC, orders_seen = 130 | Hải Đăng, Minh Triết **[đo]** |
| `vietdelight.sync_health` | 1 dòng, **stale = true** | Minh Triết **[đo]** |
| Lịch đêm `vietdelight-etsy-sync-nightly` (`0 23 * * *`) | Chạy **17/17** lần từ 03/10, lần nào cũng ghi "succeeded", lần cuối 19/10 23:00 UTC | Hải Đăng, Minh Triết **[đo]**[^10] |
| Kết quả thật của mỗi lần gọi hàm `etsy-sync` | **HTTP 503** `{"ok":false,"error":"chua cau hinh CRON_SECRET - ham tu khoa"}` (`net._http_response`). Không ghi thêm dòng nào vào `sync_log` | Hải Đăng, Minh Triết **[đo]** |
| `vietdelight.etsy_tokens` | **0 dòng**: chưa kết nối OAuth Etsy | Hải Đăng, Prue **[đo]** |
| Đơn mới nhất trong sổ | `order_date` 26/09; `listings.last_synced_at` 02/10 | Hải Đăng **[đo]** |
| Edge function `etsy-sync` | `verify_jwt: false`. Hiện hàm tự khoá: thiếu `CRON_SECRET` là trả 503, chưa xử lý gì. Khi đã đặt secret, hàm có so đúng secret không thì **[cần kiểm tra]** | Prue, Hải Đăng **[đo]** |

**Kết luận:** sổ Etsy đã đứng 18 ngày. Hôm nay mọi ô số lấy từ Etsy chỉ có số của ngày 02/10 (đơn mới nhất 26/09). Câu "Etsy về sổ mỗi đêm" trong bản v1 là **sai** và đã bỏ.

**Việc tiên quyết: "Sửa đồng bộ Etsy"** (việc riêng, ngoài kế hoạch làng, không đụng trang khách)
- **Claude làm:**
  1. đặt secret `CRON_SECRET` cho edge function `etsy-sync` (chị duyệt lệnh);
  2. sửa `etsy-sync` để **ghi cả dòng `ok = false`** khi lỗi, để sau này nhìn sổ là biết "lịch không chạy" hay "lịch chạy nhưng hỏng"[^4];
  3. đọc cách map trạng thái đơn trong `etsy-sync/index.ts` **[cần kiểm tra]**;
  4. Kiên (bảo mật) kiểm hàm có kiểm đúng secret khi `verify_jwt: false`, trước 15/11.
- **Chị bấm, một lần:** kết nối OAuth Etsy để bảng `etsy_tokens` có dòng.
  1. Claude gửi chị link kết nối Etsy.
  2. Chị đăng nhập tài khoản shop Etsy và bấm nút cho phép truy cập (tên nút trên Etsy **[cần kiểm tra]**).
  3. Chị nhắn Claude "xong". Claude kiểm `etsy_tokens` có 1 dòng rồi chạy thử 1 lần.
- **Giờ:** **CHƯA BIẾT**, vì chưa đọc hết code hàm. Hải Đăng ước tính Claude 1–2 giờ, chị khoảng 15 phút bấm OAuth **[ước tính]**. Phần này **không** nằm trong 13–21 giờ của Đợt 2.
- **Cổng cho các ô số:** có **≥7 dòng `vietdelight.sync_log` liên tiếp với `ok = true`, do chính lịch đêm của `etsy-sync` ghi** (source không bắt đầu bằng `manual:`). **Không bao giờ** dùng trạng thái của `cron.job_run_details` làm dấu hiệu "còn sống", vì 17 lần "succeeded" kia thực chất đều là 503.

### 3.1 Công trình mới và các sửa trong làng (làm sau 02/01, không cần số)

- **Tên:** Văn phòng Merlin · *Website · Bàn nhận đơn* (glyph ✉), trạng thái `partial` cho tới khi có số thật.
- **Đặt ở đâu:** quanh **[-12, 24]** hoặc **[-13, 23]**, phía đông nam Nguyệt Môn (cửa nhận việc, đang ở [-20, 16]). Phương án khác là **[-9, 14]**, giữa Nguyệt Môn và Đình Làng. Ba chỗ này bằng phẳng, cách nền công trình khác ≥3, cách đường ≥4,5 và xa nước **[đo bằng chính code địa hình của làng]**. Còn phải nhìn tận mắt **[cần kiểm tra]**. **Tránh bờ sông**, vì khu Kho Sổ Cái và Cổng Phong Ấn đang bị nền công trình thấp hơn mặt nước **[đo]**.
- **Hình dáng:** nhà nhỏ có cửa sổ đèn bàn (motif "purr" + "light"), hộp thư và khay thư.
- **Đèn bàn:**
  - dùng helper phát sáng sẵn có `glow()` / `G()` (dòng 557 / 571, emissive). **Không thêm đèn điểm `PointLight` thứ 10**, vì mỗi đèn điểm làm nặng shader của mọi vật liệu trên điện thoại (hiện đã có 9 **[đo]**);
  - đèn **"thở"** với chu kỳ ≥3 giây, giống `co-bulb` 3,6 giây của site (*"a soft breath, not a blink"*, custom-orders.css:785 **[repo]**), tuyệt đối không nhấp nháy;
  - khi máy bật reduced-motion: đèn **vẫn sáng**, chỉ đứng yên.
- **Đường đi:** nối văn phòng với Nguyệt Môn và với Đình Làng. **Bắt buộc có đường**: thiếu đường thì Merlin đi tới đó sẽ bị kẹt **[đo]**.
- **Bắt buộc có hàm dựng `BUILD.office`.** Thiếu nó thì cả cảnh 3D sập, vì dòng 784 gọi hàm mà không kiểm tra **[đo]**.
- **Cảnh báo:** cây, hoa, đá được rải theo một chuỗi số ngẫu nhiên cố định. Thêm công trình mới thì **toàn bộ cây, hoa, đá đổi chỗ một lần** **[đo]**. Làm xong em chạy lại `?debug=1` (hôm nay 5/5 PASS).
- **Đổi Merlin 3D theo yêu cầu của chị** (để hợp với chữ "Tuxedo Merlin" chị dùng; làng là thế giới riêng nên đây là đổi theo ý chị, không phải "sửa cho đúng canon"):
  - Ở góc nhìn toàn cảnh, Merlin chỉ cao khoảng 20 px **[đo: Linh, ảnh 1280×800]**, nên sao thêu, ria và yếm nhỏ không thấy được. Ưu tiên chi tiết còn đọc được ở dạng bóng: **vệt trắng ở ngực và mặt** (giống Merlin thật), **4 bàn chân trắng**, **beret vàng hơi to**.
  - Bỏ quầng sáng ở ngực và mắt phát sáng. **Giữ `catLight`** (hoặc một đèn fill không thấy nguồn) để ban đêm mèo đen không chìm vào cỏ. Ánh hổ phách có thể giữ lại dưới dạng đèn bàn ("purr + light").
  - Màu beret `#CA8D41` dễ bị ánh sáng đêm làm ngả nâu: kiểm bằng ảnh chụp, chỉnh vật liệu chứ không đổi mã màu canon. Beret không phát sáng, để tránh cảm giác "phép thuật".
  - **Bắt buộc có ảnh chụp ban ngày và ban đêm, trước và sau,** để chị duyệt.
- **Sửa 2 lỗi rẻ** (gộp vào lần publish làng kế tiếp, không mở lần publish riêng):
  - Dòng 729: 12 lều agent chia góc theo 9 (`Math.PI*2/9`), nên lều 9–11 (Grace, Nữ Quân Sư, PiPer) chồng lên lều 0–2. Đổi 9 thành `AGENTS.length`: ở bán kính 4,8, các lều cách nhau khoảng 2,5 đơn vị, lớn hơn nền lều 1,5 **[tính toán: Minh Triết]**.
  - Dòng 185: trên điện thoại ô chọn kịch bản bị ẩn (`#console .scen{display:none}`), nên chỉ chạy được kịch bản đầu **[đo]**.
- **Sửa chữ sai trong làng** (nên để relay ghi đè, thôi gõ tay):
  - Kho Sổ Cái đang để `status:'ok'` (dòng 331). Phải là `'partial'` cho tới khi đồng bộ sống.
  - Câu "đơn và sổ phí tự chảy về Kho Sổ Cái" (dòng 314) hiện sai.
  - "92 khách" (dòng 332) lệch với 114 `external_buyer_id` khác nhau trong `orders` và 114 dòng trong `customers` **[đo: Hải Đăng, chỉ đếm]**.
  - "9 bảng + 2 bảng ảo" lệch với schema thật `vietdelight`: 10 bảng + 2 view **[đo: Minh Triết]**.
  - Câu "chuyến kéo đầu 02/10 là kéo tay" **vẫn đúng** (đó vẫn là lần đồng bộ duy nhất có ghi sổ), giữ nguyên.
- **Bố cục điện thoại của Sổ tay (chuyển từ mức Đầy đủ xuống mức Vừa):** ở 390×844, Sổ tay chiếm 336–844 px, `#console` chiếm 631–836 px, còn `#bookExtra` (chỗ đặt bảng) bắt đầu ở 743 px, tức nằm trọn dưới console **[đo: Linh, Playwright]**. Cách sửa: với ≤640 px, khi `#book.open` thì ẩn `#console` (hoặc thêm `padding-bottom` cho `#book` bằng chiều cao console), và đưa 3 ô chính lên đầu `#bookExtra`. Khoảng 5–10 dòng **[ước tính]**.
- **Trước khi hứa ở 3.4 bước 1:** em liệt kê artifact và đọc header của Làng (chỉ đọc, ~1 phút) để biết chị có quyền "writer" không.

### 3.2 Các ô số liệu (chỉ làm sau cổng ở 3.0)

**Luật chung cho mọi ô:**
- **Mỗi ô ghi 2 mốc giờ:** (a) **"Số tính tới …"**, là ngày giờ của chính dữ liệu: `max(order_date)`, hoặc `last_ok_at` của lịch đêm, hoặc `max(updatedAt)` của Event Desk, hoặc khung ngày của Tally insights; (b) **"Relay chạy lúc …"**.
- **Hai luật màu**[^5]:
  - Lúc relay chạy, nếu nguồn đã chậm hơn **36 giờ** so với giờ relay (ví dụ `sync_health` của `etsy-sync` báo stale) thì ô **xám đi** và ghi "sổ dừng ở …". Không hiện số như số sống.
  - Nếu bản chụp (b) đã cũ hơn **8 ngày** so với bây giờ thì ô có chip vàng **"số cũ"**. Lý do là relay chạy theo tuần (3.3).
- **Không bao giờ cộng số giữa các kênh vào một con số tổng.** Mỗi kênh tính theo cơ sở khác nhau: Etsy là total − tax, booth là tiền đã thu, Tally chỉ là yêu cầu.
- Mọi bảng viết tên đầy đủ có schema: `vietdelight.orders`, `vietdelight.order_items`, `vietdelight.listings`, `vietdelight.sync_log`, `vietdelight.sync_health`, `vietdelight.profit_by_month`. Schema `public` đang trống **[đo: list_tables]**.
- Relay **chỉ đọc view `vietdelight.dashboard_summary`** (3.3), không viết SQL tự do.

| # | Ô | Nguồn (chỉ số tổng) | Lưu ý |
|---|---|---|---|
| 1 | **Đơn Etsy chưa gửi (theo sổ)** | đếm theo `status`, chỉ `channel = 'etsy'` và `exception is null` | Hôm nay sổ có 115 shipped, 1 confirmed, 14 confirmed kèm canceled/refunded **[đo: Hải Đăng]**, nên ô sẽ hiện "1 đơn chờ". Đơn đó từ trước 02/10, gần như chắc đã gửi rồi. Vì vậy luật "xám đi khi quá 36 giờ" là bắt buộc. Trạng thái `in_production` không có sẵn trên Etsy; cách map trạng thái **[cần kiểm tra trong etsy-sync/index.ts]** |
| 2 | **Đồng bộ Etsy còn sống?** | `sync_health` + dòng mới nhất của `sync_log`, **lọc theo đúng `source` mà `etsy-sync` ghi** (không lấy dòng bất kỳ). Không lấy cột `note` | Đỏ khi `stale = true`. Nếu dòng mới nhất có source bắt đầu bằng `manual:` thì ghi "chỉ có lần kéo tay ngày …". Hôm nay đã có 1 dòng kéo tay ok, nên nếu không lọc theo source thì ô sẽ báo sai |
| 3 | **Doanh thu & lãi theo tháng — chỉ Etsy** | `profit_by_month` | **Hiện độ phủ dữ liệu:** giá vốn tìm được cho 121/131 món của đơn không huỷ (có 2 món `sku` null), nên 10 món đang tính giá vốn = 0, tức lãi bị đội lên. `ad_spend` (Meta) có 0 dòng. Doanh thu Custom Orders (Square/Zelle) và booth không có trong sổ **[đo: Hải Đăng]**. `fees_ledger` không có dòng số dương nào, nên tiền Etsy hoàn phí cho 14 đơn huỷ/hoàn có lẽ chưa được nhập **[suy luận]**: phí các tháng đó có thể bị tính cao hơn một chút. Chỉ chị (owner) xem, mặc định gập lại |
| 4 | **Đơn Etsy theo ngày, 30 ngày** | đếm theo ngày giờ `America/Chicago` | Biểu đồ nhỏ phải kèm chữ thay thế: tổng số đơn và ngày cao nhất |
| 5 | **Món bán chạy 30 ngày** (top 5) | `order_items` cộng `quantity`, **GROUP BY `listing_id`**; tên món lấy từ `vietdelight.listings` theo `listing_id`[^8] | **Không cộng theo `title`**, vì 27 listing vừa được viết lại tiêu đề ngày 20/10 (commit 74827c4), cộng theo tiêu đề sẽ tách một món thành hai dòng. **Không join theo `sku`**, vì `listings.sku` đang null ở 27/32 dòng **[đo: Hải Đăng]**. Map sang `products.js` bằng số listing nằm trong `etsyUrl`. **Không bao giờ** đọc `order_items.variations` |
| 6 | **Sale & giá** (mới) | `products.js` `SALES` + `gownSale` (`custom-orders/prices.js:161`); từ P0 trở đi lấy `content/promo.json`. File công khai của site, **không PII, không cần Supabase** | **Làm được ngay cả khi đồng bộ còn chết.** Hôm nay: 5 món −25%, hết lúc `2026-10-26T05:00Z` = hết Chủ nhật 25/10 giờ Central **[repo]**. Ô hiện: phạm vi, mức giảm, ngày kết thúc (đúng luật khuyến mãi), đếm ngược theo giờ Central, ô tick "Đã đổi giá trên Etsy", và bản Event Desk hosted đã được republish sau lần đổi giá gần nhất chưa (ADMIN plan dòng 266-269). Khi đồng bộ sống: so `price` trong `products.js` với `vietdelight.listings.price` theo `listing_id`. **Đây là ô chặn bán sai giá** |
| 7 | **Etsy Ads 30 ngày** (mới) | cộng `fees_ledger` theo `fee_type` `prolist` + `offsite_ads_fee` (chỉ `fee_type` và số tiền, không đọc `raw` / `description`) | Đặt cạnh doanh thu Etsy cùng kỳ để có ACOS thô. Từ 01/08/2025 tới 02/10/2026, `prolist` là dòng phí lớn nhất: $542,92, so với phí giao dịch $365,31 và nhãn ship $362,76 **[đo: Hải Đăng, SUM]**. Đây là con số chị bật/tắt được ngay để đổi lãi |
| 8 | **Yêu cầu Custom Orders (Tally)** | `list_forms` (số lần gửi) + `fetch_insights` 7 ngày (lượt xem, bắt đầu, hoàn tất) | Gọi là **"yêu cầu"**, không gọi là "đơn", và **không bao giờ cộng vào số đơn**. **Tuyệt đối không dùng `fetch_submissions`** (trả tên, email, địa chỉ, ảnh thú cưng). Tiền cọc **không có tín hiệu nào về hệ thống**: Square là link cùng tab, Zelle là chuyển tay, cả hai không có connector. Không ô nào biết "đã cọc / chưa cọc" nếu chị không ghi tay. Ngày của Tally tính theo UTC+7 **[cần kiểm tra múi giờ tài khoản]** |
| 9 | **Booth (Event Desk) — chỉ đơn lưu ở bản hosted** | **chỉ `get` doc `stats/summary`** do chính trang Event Desk tự ghi (3.3)[^6] | Tách `type` **thanks** (bán tại chỗ) và **order** (đặt làm). Báo tiền đã thu theo `payMethod` và "balance còn phải thu", trừ thuế theo `totals.tax` / `taxMode` của từng đơn, **cùng công thức với `cashBox()`** (event-desk.js:1079-1089), để số trong làng khớp số trên điện thoại booth. Chống trùng theo `id`, lấy bản `updatedAt` mới nhất. `event.html` trên Pages lưu đơn trong localStorage của từng máy (event-desk.js:239-244, 269), nên relay không thấy những đơn đó. Admin plan lại bảo lấy giá ở booth từ `event.html` trên Pages (dòng 268), nên **rủi ro đếm thiếu là có thật** (câu 6). Không làm được `stats/summary` thì **bỏ ô này khỏi mức Vừa** |

*Đã bỏ:* ô **"Sắp hết hàng"**. Lý do: `quantity_available` đang chạy từ 1 tới 991 (món làm theo đơn dùng số tồn giữ chỗ), và cả 32 listing đều "active" tính tới 02/10 **[đo: Hải Đăng]**, nên ngưỡng ≤N sẽ báo sai. Chỉ thêm lại cho món có hàng sẵn ở Texas (`shipsFrom` `tx` theo content model của Admin plan), và chỉ khi đồng bộ sống. Cũng đã bỏ: số Etsy realtime, chi tiết câu trả lời Tally, tên khách, cột `note` của `sync_log`, và ô "Đội AI agent" từ Notion (3.4).

### 3.3 Dữ liệu đi đường nào: relay theo yêu cầu, mỗi tuần một lần

```
 Supabase: view vietdelight.dashboard_summary ─┐
 Tally: list_forms + fetch_insights ───────────┤
 Event Desk: doc stats/summary (không PII) ────┼──► Chị nói "cập nhật sổ làng" ──► Claude ghi 1 batch ──► db của Làng ──► ô số
 Site: products.js / promo.json (công khai) ───┘    trong phiên Claude, mỗi tuần      (chị duyệt)       (chỉ owner đọc)
```

- **Không có việc hẹn giờ chạy mỗi ngày ở Đợt 2.** Một việc tự chạy không người trông, cầm connector Supabase toàn quyền (`execute_sql`), đọc db Event Desk có tên và địa chỉ khách, lại cần quyền ghi đứng sẵn, là trái luật "Con người điều phối AI". Thêm nữa, mỗi lần ghi ArtifactData (hoặc mỗi batch) cần một lần duyệt, nên một phiên chạy theo lịch có thể kẹt ở bước duyệt.
- **Cách làm:** mỗi tuần chị nói một câu *"cập nhật sổ làng"* trong phiên Claude (~1–2 phút **[ước tính]**). Claude chạy các truy vấn cố định ở trên rồi ghi **1 batch** vào db Làng, chị duyệt.
  - Phần Event Desk và phần Supabase chạy thành **2 bước tách nhau**. Doc `stats/summary` chỉ được chứa số, ngày giờ, mã đơn dạng `E<yymmdd>-<máy>-<số>` và loại món trong danh sách cố định. Claude kiểm đúng khuôn đó trước khi dùng. Lý do: chữ tự do không tin cậy mà nằm chung một phiên với `execute_sql` toàn quyền là chỗ dễ bị prompt injection.
  - Sau 3 lần chạy đầu, ghi **số token hoặc số phút thật** của mỗi lần thay cho ước tính.
- **Chỉ cân nhắc chạy tự động sau cổng +4 tuần (mục 7),** và khi đó phải đủ các điều kiện sau[^7]:
  - chạy thử 1 lần (`fire_trigger`) mà ghi được db Làng không cần chị bấm;
  - `notifications: {}` (không push về điện thoại);
  - connector chỉ có Supabase, câu SQL chép nguyên văn trong prompt;
  - tách làm 2 việc hẹn giờ, và chỉ việc Supabase mới có connector Supabase.
- **View `vietdelight.dashboard_summary`: BẮT BUỘC trước Đợt 2.**
  - Là một migration, chị duyệt. View nằm trong schema `vietdelight`, không mở qua API công khai, không đặt trong `public`.
  - Relay chỉ chạy đúng một câu: `select * from vietdelight.dashboard_summary`. Lý do: `execute_sql` chạy bằng quyền admin đầy đủ của chị, đọc được `etsy_tokens`, sửa được bảng **[đo]**.
  - View chỉ trả số tổng cho các ô 1–5 và 7, độ phủ giá vốn (đếm, không trả giá), giá theo `listing_id` cho ô 6, và tình trạng đồng bộ theo từng `source`.
- **Event Desk tự ghi doc `stats/summary`:** mỗi lần lưu đơn, trang Event Desk tự tính lại bản tổng không PII rồi ghi doc này: số đơn theo `type`, tiền đã thu theo `payMethod`, balance, thuế, giờ đơn cuối, mã đơn cuối, loại món. Relay **không bao giờ list collection `orders`**, nên không tên, địa chỉ hay ghi chú nào đi vào phiên Claude. Việc này gộp vào lần republish Event Desk vốn đã có trước mỗi event.
- **Quy tắc db:**
  - `{path:'dashboard', read:'owner', write:'owner'}`, và tương tự cho `finance`. Không dùng "admin", vì trong db.d.ts "admin" là Editor **hoặc** Owner trên menu share, nên ai từng được chị cho quyền Editor cũng sẽ đọc được số lãi lỗ.
  - Khai `user: {}`, không kèm scope `profile` hay `email`, vì chỉ cần id để nhớ "lần chị xem trước".
  - Mọi giá trị đọc từ db phải hiện bằng `textContent`. Hàm `renderBook()` của làng đang chèn `s.note` và `s.where` bằng `innerHTML` (dòng 965–966 **[đo]**), nên phần nào hiện số từ db thì phải đổi sang `textContent`.
  - Giới hạn 25.000 doc, 256 KiB mỗi doc **[đo: d.ts]**, dư nhiều.
- **Vì sao trang làng không tự gọi Supabase:** lý do quyền admin như trên. Nếu ai đó sửa trang rồi chị mở ra, trang đó cầm quyền này. Thêm nữa, kết quả trả về là chữ lẫn dữ liệu, phải tách bằng regex, dễ vỡ **[đo]**.
- **Vì sao làng không tự đọc db của Event Desk:** mỗi artifact có **một db riêng**. Trang này không đọc được db của artifact khác, `room` cũng không bắc cầu được **[đo: d.ts]**.
- **Giờ đồng bộ Etsy** (khi đã sửa): `0 23 * * *` UTC, tức 18:00 Houston tới 01/11, sau đó 17:00 **[đo]**. Relay theo tuần chạy lúc nào cũng được.

### 3.4 Những nút chị cần bấm (Đợt 2)

0. **Trước tiên:** "Sửa đồng bộ Etsy" (3.0). Chị bấm OAuth Etsy một lần, khoảng 15 phút **[ước tính]**.
1. **Đồng ý cho em publish phiên bản mới của Làng** (cùng link), có khai `db` và `user: {}`. Em đọc header trước để chắc chị có quyền writer (câu 5), và đọc bản đang chạy rồi mới sửa.
2. **Duyệt migration view `vietdelight.dashboard_summary`.**
3. **Duyệt republish Event Desk** có thêm doc `stats/summary`, gộp vào lần republish trước event.
4. **Mỗi tuần:** nói "cập nhật sổ làng", duyệt 1 batch (~1–2 phút).
5. *(Chỉ ở mức Đầy đủ, đang TẠM DỪNG)* Cho phép connector trong trang. Manifest `mcp` **chỉ khai đúng tên tool**: Tally chỉ `list_forms` và `fetch_insights`, **không bao giờ** khai `fetch_submissions`. **Bỏ Notion khỏi mức Đầy đủ**: connector Notion đọc được cả workspace, kể cả "Database Website Leads", trừ khi ghim được tool vào đúng 1 data source **[cần kiểm tra]**.

### 3.5 Khi số không về

- **Không bao giờ để ô trống trơn hoặc báo lỗi đỏ khó hiểu.** Mỗi ô có 4 trạng thái:
  - **có số**, kèm "Số tính tới …" và "Relay chạy lúc …";
  - **sổ dừng**: nguồn chậm hơn 36 giờ so với lúc relay chạy. Ô xám, ghi "sổ dừng ở …";
  - **số cũ**: bản chụp cũ hơn 8 ngày. Vẫn hiện số, kèm chip vàng "Relay chưa chạy từ …";
  - **chưa có dữ liệu**: ví dụ "Đồng bộ Etsy: chỉ có lần kéo tay ngày 02/10".
- Nếu gói Claude tạm dừng thì relay ngừng. Các ô vẫn hiện số cũ cùng 2 mốc giờ, không sập.

### 3.6 Phác thảo giao diện

**Đặt bảng ở đâu:** trong ô `#bookExtra` của Sổ tay, khi chị bấm vào Văn phòng Merlin (dòng 965-966 **[đo]**). **Không** thêm panel thứ hai ở bên phải. `#bookExtra` trên máy tính chỉ rộng 306 px **[đo: Linh]**, nên dùng **lưới 2 cột**, không xếp 3 ô một hàng. Trên điện thoại, 3 ô chính lên đầu (3.1). Thêm một nút vùng "Văn phòng Merlin" ở cột trái.

```
 Bản đồ (nhìn từ trên, không đúng tỉ lệ)

        Cổ Thụ Ký Ức          Tinh Thạch
                    Đài Tinh Bàn (12 lều)        Cổng Phong Ấn
   Lều Tiên Tri          Rương           Vòm Giả Kim   Kho Sổ Cái
                                Cân Chân Lý      Bến Kết Nối
   Nguyệt Môn ●─────────────── Đình Làng
        \   (đường mới)        /
         ✉ VĂN PHÒNG MERLIN ──┘           Suối Hồi Sinh
           (~[-12,24])
```

```
┌─ Sổ tay ───────────────────────────── 15 / 15 ─┐
│ ✉  Văn phòng Merlin            [● partial]       │
│    Website · Bàn nhận đơn                        │
│    Relay chạy lúc: dd/mm hh:mm (chị gọi mỗi tuần)│
│ ┌──────────────────────┐ ┌──────────────────────┐│
│ │ Đồng bộ Etsy         │ │ Sale & giá           ││
│ │ ● … · tính tới dd/mm │ │ N món −N% · hết dd/mm││
│ │                      │ │ ☐ Đã đổi giá trên Etsy││
│ └──────────────────────┘ └──────────────────────┘│
│ ┌──────────────────────┐ ┌──────────────────────┐│
│ │ Etsy chưa gửi        │ │ Custom: yêu cầu 7 ngày││
│ │ (theo sổ) N          │ │ N gửi / N bắt đầu    ││
│ │ tính tới dd/mm       │ │ tính tới dd/mm       ││
│ └──────────────────────┘ └──────────────────────┘│
│ Đơn Etsy 30 ngày ▁▂▁▃▂▅… · tổng N · cao nhất dd/mm│
│ Bán chạy (theo listing): 1. … 2. … 3. …          │
│ Etsy Ads 30 ngày: $N · ACOS thô N%               │
│ Booth (bản hosted): N đơn đặt · N bán tại chỗ    │
│ Doanh thu & lãi — chỉ Etsy (chỉ chị) [mở ▾]      │
│ [▶ Xem Merlin nhận đơn]                          │
└──────────────────────────────────────────────────┘
```
*"N" và "dd/mm" là chỗ để số thật, **không phải số minh hoạ**. Màu và kiểu chữ lấy từ các class làng đã có: `.panel`, `.status`, `.kv`, `.pill`, `.prog`.*

- Nút **"▶ Xem Merlin nhận đơn"** gọi `focusSite('office')`, vì ở toàn cảnh Merlin quá nhỏ để nhìn thấy. Khi máy bật reduced-motion, camera nhảy thẳng tới văn phòng, Merlin hiện sẵn ở đó, không đi bộ. Phần này rẻ nên chuyển từ mức Đầy đủ xuống mức Vừa.

---

## 4. Ý B: sau khi khách đặt hàng, Merlin "nhận đơn" trên website

### 4.0 Chỗ trống thật, và bản lưu cho khách

- **Hôm nay khách gửi form xong, trang không nói một chữ nào.** Hàm `onSubmit` (custom-orders.js:142-148) chỉ đóng popup, đặt `#pay`, cuộn xuống "Pay your deposit" rồi focus vào `#pay-h` **[repo]**.
- **Có lẽ khách cũng không nhận được bản sao đơn.** Tally `load_form` ngày 20/10 cho thấy `hasSelfEmailNotifications: true` (email báo về studio đang bật), và không có cài đặt email nào cho người gửi **[đo]**. Vậy nhiều khả năng khách không có bản sao **[cần kiểm tra trong cài đặt Tally]**. Cảnh Merlin 5 giây sẽ mất ngay khi khách đóng tab.
- **Việc kèm Đợt 1a:**
  - **Bật email "bản sao đơn" gửi khách**, nếu gói Tally hiện tại cho bật với $0 **[cần kiểm tra gói]**. AI soạn nội dung email, chị duyệt (câu 3).
  - Nếu không được $0: dòng trạng thái chỉ nói khách sẽ nghe tin bằng cách nào và khi nào, **đúng như chị xác nhận** (câu 3).
  - **Không tự hứa thời gian trả lời**, vì trang hiện không có cam kết nào **[repo]**.
  - **Không viết** *"we've emailed you / check your inbox"* nếu chưa xác nhận Tally gửi email cho khách.
- **Việc kèm, 5–10 phút [ước tính]:** ở bản form Tally mở toàn trang (đường H2), khách thấy tiêu đề *"Purrlight Custom Gift Order (Meridian Fall Event)"* và ảnh bìa `Gemini_Generated_Image_…jpg` **[đo: load_form]**. Đổi thành tiêu đề trung tính dùng quanh năm và ảnh thật, trước khi đóng băng. Chị duyệt.

### 4.1 Gắn vào đâu (điểm có thật trong code)

| Điểm | Chỗ trong code | Lúc nào chạy | Dữ liệu được dùng |
|---|---|---|---|
| **H1. Custom Orders, popup Tally gửi xong** (điểm chính) | `custom-orders.js:142-148`, hàm `onSubmit` **[repo]** | **Sau khi** đã có `location.hash`, `scrollIntoView` và focus `#pay-h`. Code cảnh nằm trong **file riêng tải `defer`** (`js/merlin-desk.js`) và được **bọc toàn bộ trong try/catch**. File lỗi hay trả 404 thì trang vẫn cuộn tới phần cọc như hôm nay | **Không dùng gì của khách.** Giữ `onSubmit: function ()` không nhận tham số như hiện nay, để cảnh không bao giờ đọc dữ liệu Tally gửi kèm. Dòng "Your pick — {món}: deposit $X" đã có sẵn trên trang **[repo]** |
| **H2. Form Tally mở toàn trang** (khi script Tally bị chặn hoặc chậm, hoặc mở trong app) | Tally đang chuyển về `…/custom-orders/#pay`, URL không có PII **[đo: load_form]** | Chỉ khi URL có cờ `?sent=1` | Xem "Đổi link chuyển hướng" ngay dưới bảng |
| **H4. confirm.html, đơn booth** | `js/event-desk.js` sau khi viết thẻ đơn, chỉ khi `isOrder` (dòng 502) **[repo]** | Khi khách mở link hoặc QR. **Mặc định để tháng 1** (câu 6) | Chỉ đọc loại trang `p.t`. **Không** đọc tên, tên thú cưng, thành phố hay ghi chú, dù chúng nằm sẵn trong `#` của link **[repo]** |
| *Không gắn* | Nút Buy on Etsy (mở tab Etsy), Square (link cùng tab, không có tín hiệu quay về), Zelle, newsletter (mới là vỏ) **[repo]** | — | Site không biết đơn Etsy, nên **không được** nói "Merlin got your Etsy order" |

**Đổi link chuyển hướng `?sent=1`: hành vi hôm nay sẽ đổi.**
- **Hiện nay:** link `/custom-orders/#pay` chỉ là nhảy hash trong cùng trang, không tải lại (khi URL trang không có query).
- **Sau khi đổi sang `custom-orders/?sent=1#pay`:** nếu popup Tally thật sự chuyển hướng cả trang cha, thì **lần gửi nào cũng thành tải lại toàn trang** **[cần kiểm tra]**. Trang thấy `sent=1` thì hiện dòng "đã nhận" (và cảnh, nếu có), rồi xoá cờ khỏi URL để tải lại lần nữa không phát lại **[đề xuất]**.
- **Vì vậy chị gửi thử thật 2 lần:** một lần **TRƯỚC** và một lần **SAU** khi đổi link. Mỗi lần xong thì xoá bài gửi đó trong Tally.
- **Hướng dẫn 3 bước em gửi chị** có thêm dòng: **KHÔNG chèn mention trường nào (`@name`, `@email`…) vào URL chuyển hướng**, vì làm vậy sẽ đẩy PII lên URL và vào lịch sử trình duyệt.
- **Dòng "Your pick — … deposit $X" khôi phục từ localStorage** (custom-orders.js:689 / 730), nên ở chế độ ẩn danh, sau khi tải lại, dòng này sẽ mất. Khi đó cảnh và dòng chữ **không được hứa số tiền cọc**.
- Khi đổi domain sang purrlight.studio thì phải sửa lại link này.

### 4.2 Kịch bản Custom Orders

#### Đợt 1a: dòng chữ "đã nhận" (không có hoạt hình)

- **Dòng `role="status"`** được tạo sẵn và để trống, theo kiểu `.pay-status` đang có. Dòng này **chỉ được điền 1 lần, khoảng 150 ms SAU khi focus đã sang `#pay-h`**, và không thông báo theo từng nhịp.
- **Chữ mặc định** (chị chốt chữ cuối ở bản xem trước, 4.4):
  > *"Got it — Merlin noted your order. Next step: your 50% deposit, just below."*

  Vì sao dùng chữ "order" mà không dùng "request": nút trên trang ghi *"Place your order"*, `pay-lede` ghi *"Place your order first"*, H1 của confirm.html ghi *"Your order is in"* **[repo]**. Dùng "request" sẽ lệch chữ đúng ở bước trả tiền. Vì sao bỏ *"it's on Merlin's desk"*: câu đó biến con mèo thành người xử lý đơn.
  Nếu chị xác nhận cách trả lời khách (câu 3), có thể thêm 1 câu ngắn đúng như vậy. Không hứa thời gian khi chị chưa xác nhận.
- **Thanh đặt hàng dính ở đáy màn hình** (`.order-bar`): hôm nay sau khi gửi, thanh này vẫn mời *"Order"* **[đo: ảnh chụp của Linh]**, và ở 375×667 dòng địa chỉ Zelle (617–636 px) đã nằm dưới thanh này (thanh bắt đầu từ 603 px) **[đo: Linh, Playwright]**. **Mặc định: ẩn thanh trong onSubmit** cho tới hết lượt xem trang đó **[đề xuất]**. Phương án khác là đổi nút thành *"Pay deposit"* (dẫn tới `#pay`), nhưng chỉ khi test bên dưới cho thấy thanh không che địa chỉ Zelle (câu 2).
- **Khung Merlin đứng yên** (ảnh nhỏ cạnh dòng chữ) chỉ vào 1a nếu chị duyệt ở câu 1 **và** qua test màn hình đầu. Nếu không, khung này đi cùng 1b[^3].

#### Đợt 1b: cảnh "Merlin nhận đơn", ≤4 giây, mỗi nhịp là một bước thật

Chị xin "một workflow ngắn". Vì vậy mỗi nhịp hiện **một bước thật của đơn**, lấy từ mục "How it works" và `pay-lede` đã publish **[repo]**. Merlin không làm động tác vô nghĩa, cũng không chỉ tay về phía nút trả tiền. Chính danh sách bước mới là thứ nói "bước tiếp theo". Cảnh vừa làm khách vui vừa cho khách thông tin, không phải trò mẹo, không ép khách trả tiền.

**Cách dựng (không crossfade cả khung, để không bị bóng mờ chồng hai lớp):**
- **1 lớp nền luôn hiện đủ (opacity 1):** ảnh Merlin thật trong vòng đèn (`.merlin-lamp`), bàn và cuốn sổ đóng. Vẽ đơn giản.
- **4 lớp phủ, chỉ fade-in rồi giữ nguyên, không xoá lớp trước:**
  1. ánh đèn bàn (glints quanh đèn, `.glints-lamp`);
  2. phong thư trên bàn;
  3. sổ mở;
  4. nét bút chì: 3 đoạn vẽ sẵn, mỗi đoạn fade 250 ms, đoạn cuối là **dấu tích**. Không dùng `stroke-dashoffset` kéo dài.
- **Không có ngôi sao trang trí nào**[^1]. Dùng glints của đèn, dấu tích bút chì hoặc dấu chân mèo. Sao chỉ được xuất hiện ở hình thêu trên beret.
- Ảnh Merlin là ảnh thật nên **bỏ nhịp "Merlin nhìn xuống"** của bản v1.
- Mọi chuyển động chỉ là fade 250 ms, nằm trong luật "fade/ease 200–300 ms" ở đầu `custom-orders.css` **[repo]**. **Tổng ≤4 giây kể cả fade**, chừa biên cho mức 5 giây của WCAG 2.2.2.

| Nhịp | Bắt đầu **[đề xuất]** | Lớp hình hiện thêm | Bước hiện ra trong danh sách (tiếng Anh, chị chốt chữ) |
|---|---|---|---|
| 1 | 0,0 s | ánh đèn bàn | ① **Order received** |
| 2 | 0,6 s | phong thư | ② **Your 50% deposit — next, just below** · *you are here* |
| 3 | 1,2 s | sổ mở | ③ **We send you a design mockup before we start** |
| 4 | 1,8 s | nét bút chì 1–2 | ④ **We make it** |
| 5 | 2,4 s | nét bút chì 3 = dấu tích ✓ cạnh ① | ⑤ **Approve the photo of your finished piece — then it ships, or pick it up** |
| Kết | xong trước 3,5 s | **dừng hẳn**, không lặp | |

*Nguồn chữ:* ② ③ lấy từ bước 2 *"Pay a 50% deposit. … we send you a design mockup before we start"*; ④ từ bước 3 *"We make it."*; ⑤ từ bước 4 *"We send you a photo of the finished piece. Pay the balance, then it ships free in the U.S. — or pick it up at Pearland Town Center"* và `pay-lede` **[repo]**.

- **Chế độ tĩnh** (hiện ngay trạng thái cuối, không chạy cảnh, **không có nút**): khi máy bật `prefers-reduced-motion`, khi bật Save-Data, hoặc khi tab bị ẩn.
  - JS kiểm `matchMedia` lúc bắt đầu, **và lắng nghe sự kiện `change`**: reduced-motion bật giữa chừng thì cảnh dừng, giống cách video hero đang làm.
  - Trên Custom Orders, cảnh còn phải qua cổng `html.motion` (custom-orders.js:1032-1033), giống các hiệu ứng khác.
  - Khoá `purrlight-xmas-paused` chỉ có trong khối tuyết mùa lễ (custom-orders.js:1122). Sau 02/01 không còn nút nào đặt khoá này, nên chỉ đọc trong try/catch, không coi là công tắc chính.
- **Nút Skip / Replay:** dùng **đúng 1 phần tử nút** và **không bao giờ xoá khỏi DOM**. Lý do: nếu nút biến mất khi cảnh xong thì focus bàn phím đang nằm trên nó sẽ rơi về `<body>`.
  - Khi cảnh đang chạy, nút ghi *"Skip"*. Khi xong, cùng nút đó đổi nhãn thành *"Replay"*, và cảnh chỉ chạy lại khi khách bấm.
  - Nút dùng được bằng bàn phím và không cướp focus (focus vẫn ở `#pay-h`).
- **Ngữ nghĩa cho trình đọc màn hình:**
  - SVG nhúng có `aria-hidden="true" focusable="false"`, **không có `role="img"`** (`merlin-closing.svg` hiện có cả `role="img"` lẫn `aria-hidden`, hai thuộc tính mâu thuẫn nhau **[repo]**).
  - Ảnh Merlin là trang trí, vì dòng `role=status` đã mang ý chính, nên đặt `alt=""` **[đề xuất]**. Chị duyệt ở bản xem trước.
  - Danh sách 5 bước là chữ thật (thẻ `<ol>`), không phải hình.
- **Vị trí, để không đẩy nút trả cọc xuống:**
  - **<600 px (điện thoại):** chỉ có ảnh nhỏ **64–72 px nằm chung hàng với dòng `role=status`**, chiều cao giữ sẵn bằng 1 hàng đó. **Danh sách 5 bước đặt DƯỚI khối Square/Zelle**, hiện tĩnh[^11]. Hoạt hình trên điện thoại chỉ có glints quanh vòng đèn và dấu tích.
  - **600–899 px:** dùng bố cục điện thoại **[đề xuất]**.
  - **≥900 px:** cảnh và danh sách đặt bên phải tiêu đề "Pay your deposit", vì vùng bên phải của lede đang trống **[đo: Linh, ở 1280]**.
  - **CLS = 0:** ô có kích thước giữ sẵn.
  - Khung tĩnh hiện cho **mọi khách** ở phần cọc chỉ khi chị đồng ý (câu 1).
- **Không âm thanh. Không gọi mạng thêm lần nào. Không analytics.**
- **Chữ cấm trong cảnh và dòng chữ:** *confirmed* (đơn chưa xác nhận khi khách chưa cọc và chị chưa xem), *shipped / arrives / by Christmas*, *magic / wizard*, *AI / automated / agent*, *perfect gift*, *we've emailed you / check your inbox* (trừ khi đã xác nhận), mọi lời hứa thời gian trả lời. Mọi câu chạy qua `bannedInNote` trước khi merge.

### 4.3 Kịch bản confirm.html (mặc định tháng 1)

- **Không có live region.** H1 của trang đã ghi *"Your order is in, {name}."* (event-desk.js:511 **[repo]**), nên cảnh chỉ là trang trí.
- **Chú thích duy nhất:** *"From Merlin's notebook"* (safe phrase của canon v2). Bỏ *"your order is filed"*, vì câu này lặp ý H1 và chữ "filed" nghe như giấy tờ hành chính[^9].
- **Nhịp:** đèn bàn → sổ mở → dấu tích bút chì, rồi dừng. Tổng ≤3 giây **[đề xuất]**, không có ngôi sao.
- **Chỉ phát 1 lần cho mỗi mã đơn trên mỗi máy.** Đánh dấu bằng `localStorage` theo order id, bọc try/catch; lỗi thì hiện khung tĩnh. Nếu `p.d` đã cũ hơn khoảng 48 giờ thì hiện khung tĩnh luôn, để khách mở lại biên nhận sau 3 tuần không thấy Merlin "vừa nhận" một đơn cũ **[đề xuất]**.
- **Reduced-motion:** trang này nạp `css/style.css` + `desk.css`. `style.css:1319-1325` chỉ tắt chuyển động cho vài class được liệt kê, **không** có khoá chung `animation:none !important` như `custom-orders.css:48` **[repo]**. Vì vậy CSS của cảnh phải tự mang khối `@media (prefers-reduced-motion: reduce)` riêng, và JS kiểm `matchMedia` + `change` như ở 4.2.
- Thư phía dưới vẫn là lời của chị, ký "Elise". Merlin **không** hứa ngày giao hay mốc thời gian nào. Khi in, cảnh **ẩn hẳn** (desk.css:396 **[repo]**).

### 4.4 Làm bằng gì, và cổng duyệt nội dung

**Merlin là ảnh hay hình vẽ** (câu 1). **Mặc định: ảnh thật.**
- Lý do:
  - Ngày 16/10 chị đã chọn ảnh Merlin thật thay hình vẽ trên Custom Orders (TONG-HOP §8k: "ảnh 13 cắt tròn thay hình vẽ"). Hero và mục Giáng sinh cũng là ảnh.
  - Ngày 20/10 cả site thay khối minh hoạ SVG bằng ảnh thật (README:202).
  - Panel 16/10 đã loại "nhân vật hoạt hình cạnh Merlin" (README:327-329) **[repo]**.
  - Thêm một Merlin hoạt hình SVG ở phần cọc thì một trang sẽ có hai Merlin khác nhau.
- **Dùng lại component `.merlin-lamp` đã có:** ảnh `merlin-portrait.webp` (7.766 byte **[đo]**, đã có trên trang), vòng đèn 3 px và `.glints-lamp`. Chị đã duyệt component này ngày 16/10.
  - Đây là ảnh mùa lễ (Merlin đeo nơ đỏ), mà README ghi phải thay sau 02/01. Vì vậy cảnh đọc ảnh từ **một đường dẫn dùng chung**: sau mùa lễ chỉ sửa 1 chỗ, và việc này được đưa vào checklist hết mùa.
  - Nếu chị gửi được 1 ảnh hoặc clip 5–8 giây Merlin ngồi bên bàn, sổ, đèn hoặc laptop của chị, chỉ cần thay lớp ảnh, code giữ nguyên.
- **Bàn, sổ, đèn, phong thư là tranh vẽ mới hoàn toàn.** `merlin-closing.svg` là Merlin cuộn tròn, nhắm mắt, không có bàn, không có chân cầm bút, nên **không dùng làm nền được** (câu "vẽ tiếp từ merlin-closing.svg" của bản v1 là sai). Vẽ khoảng 3–4 giờ **[ước tính, có thể thiếu]**.
- **Chỉ dùng Merlin vẽ SVG khi chị chọn rõ.** Khi đó vẽ theo đúng nét của bộ `assets/img/companion-*.svg` và ghi chú "From Merlin's notebook". Logo vẫn giữ luật "không vẽ lại, không dùng AI" **[repo]**.

**File và cờ tắt:**
- 1 file `js/merlin-desk.js` (tải `defer`, chạy sau focus `#pay-h`, bọc try/catch) + vài dòng CSS có khối reduced-motion riêng. Tổng ≤20 KB **[ước tính]**, không tính ảnh dùng lại.
- Chỉ nạp ở `custom-orders/` (và `confirm.html` khi làm). Không thêm domain bên thứ ba.
- Màu lấy từ token của site (cream `#FBF6EE`, ink `#4A423B`, peach `#E8A87C`, sage; beret chỉ dùng cho chi tiết nhỏ và không bao giờ dùng cho chữ **[repo]**). **Không** dùng màu navy và hổ phách của làng.
- **Cờ `MERLIN_DESK_ON`:**
  - Chỉ bật sau khi chị đã xem ảnh chụp 375 / 390 / 1280 **và** đã gửi thật 1 lần.
  - Cờ là hằng số trong code, nên tắt cờ trong thời gian đóng băng vẫn là một PR một dòng và một lần deploy. **Luật đóng băng ghi rõ PR này được phép.**
  - Khi chị vắng: chị nhắn Claude, Claude mở PR chỉ sửa code. Từ P1 trở đi, Claude tự merge khi test xanh.

**Cổng duyệt nội dung AI (trước khi gắn code):** luật là AI soạn, CEO duyệt trước khi publish.
1. Claude giao **một bản xem trước riêng** (không phải trang thật) gồm: từng khung tĩnh ở **390 px và 1280 px**, câu chữ tiếng Anh chính xác, và alt text.
2. Chị duyệt **cả tranh lẫn chữ**. Duyệt xong mới tích hợp vào trang.
3. **Ghi ngày chị duyệt vào mô tả PR.**

Cổng này áp cho cả 3 thứ: dòng chữ 1a, từng khung 1b, và nội dung email bản sao của Tally.

**Test Playwright** (đưa vào bộ test của Admin P0):
- chụp ở **360, 375, 390 và 1280 px**; CLS = 0;
- **màn hình đầu (test chuyển đổi):**
  - ở **390×844**, sau khi trang nhảy tới `#pay-h`, nút Square và dòng Zelle vẫn nằm trong màn hình đầu;
  - ở **375×667 và 390×844**, nếu thanh đặt hàng còn hiện thì đáy `[data-pay-square]` ≤ đỉnh `.order-bar` − 8 px, và địa chỉ Zelle không bị che;
  - test trượt thì trên điện thoại đặt cảnh dưới nút Square, hoặc thu nhỏ ảnh;
- `merlin-desk.js` trả 404 hoặc throw → trang vẫn cuộn tới `#pay` và focus vẫn ở `#pay-h`;
- sau khi tải lại với `?sent=1`: dòng "Your pick — … deposit $X" hiện lại; ở chế độ ẩn danh thì không có câu nào hứa số tiền cọc;
- reduced-motion: ra trạng thái tĩnh ngay, không có nút; bật reduced-motion giữa chừng thì cảnh dừng;
- nút Skip → Replay chạy đúng, **focus vẫn còn sau khi cảnh kết thúc**;
- dòng `role=status` chỉ được điền 1 lần;
- không có request mạng mới;
- `onSubmit` không nhận tham số, cảnh không bao giờ đọc payload của Tally;
- chữ qua `bannedInNote`;
- khi in: cảnh ẩn trên cả confirm.html lẫn Custom Orders.

---

## 5. Cầu nối giữa hai bên: đơn thật chạy vào làng

### 5.1 Làm được ngay, không cần dữ liệu: nhiệm vụ mô phỏng thứ 7 "Khách đặt hàng trên web"

Nhiệm vụ này nằm cùng chỗ với 6 nhiệm vụ đang có: chị chọn trong danh sách rồi bấm Run. Các bước **theo đúng quy trình thật**, không bịa thêm bước. Phần này làm sau 02/01 và **không phải chờ** đồng bộ Etsy.

| Kịch bản | Các bước (văn phòng = Văn phòng Merlin) |
|---|---|
| **Custom Orders (Tally)** | ① Khách chọn món trong "Build your piece" rồi gửi form Tally (văn phòng) → ② Tally lưu và **gửi email báo studio** (đang bật **[đo]**). Khách có nhận bản sao hay không thì **[cần kiểm tra]** → ③ trang nhảy xuống phần cọc, khách trả qua Square hoặc Zelle → ④ *chị đọc email, đối chiếu tiền cọc, nhắn khách* (Đình Làng, bước của chị). Bước ④ ghi đúng như chị trả lời ở câu 3 |
| **Đơn booth (Event Desk)** | ① Nhân viên lưu đơn ở booth → ② Event Desk lưu vào db chung (chỉ khi dùng bản hosted) → ③ khách nhận link hoặc QR → ④ khách mở confirm.html "Your order is in" |
| **Đơn Etsy** | ① Khách mua trên Etsy → ② 23:00 UTC lịch đêm gọi `etsy-sync` → ③ đơn vào Kho Sổ Cái. **Hiện trạng ghi đúng sự thật: bước ② đang trả lỗi 503 từ 03/10, bảng token Etsy trống** **[đo]**. Mô phỏng hiện bước ② màu đỏ cho tới khi qua cổng ở 3.0 |

- Bước của khách dùng **loại bước mới `customer`**, không dùng `H()`, vì `H()` sẽ bị đếm là "lần cần chị" **[đo]**.
- Mọi bước phải trỏ tới công trình có thật, nếu không mô phỏng sẽ sập **[đo]**.
- Tuỳ chọn: Merlin xuất phát ở văn phòng cho nhiệm vụ này. Hôm nay vị trí xuất phát bị ghi cứng là Nguyệt Môn ở 3 chỗ trong code **[đo]**.
- Tuỳ chọn (mức Đầy đủ): thêm `?task=don-web&autoplay=1` để mở thẳng nhiệm vụ này. Hôm nay làng chưa có tham số này **[đo]**.

### 5.2 Đơn thật làm Merlin "nhận thư" trong làng

| Nguồn | Về làng bằng gì | Trễ bao lâu | Làm được? |
|---|---|---|---|
| Tally (Custom Orders) | Relay theo tuần ghi "số lần gửi". *(Đầy đủ, đang TẠM DỪNG)*: trang tự hỏi Tally ≥30 giây/lần khi chị đang mở làng; số tăng thì Merlin đi tới văn phòng, bong bóng "1 yêu cầu Custom Orders mới". **Không có tên** | ≤1 tuần, hoặc ≥30 giây | ✔︎ |
| Event Desk | Relay chỉ `get` doc `stats/summary`. Không list `orders` | ≤1 tuần | ✔︎ khi Event Desk đã ghi doc này |
| Etsy | Đồng bộ đêm vào Supabase, relay chạy sau đó | ≤1 tuần | ✔︎ **chỉ sau khi sửa đồng bộ và qua cổng 7 đêm** |
| Etsy "khách vừa đặt" realtime | — | — | ✘ Artifact không nhận webhook được |
| Làng đọc thẳng db Event Desk | — | — | ✘ Mỗi artifact một db riêng |
| Khách hoặc người ngoài thấy ô connector | — | — | ✘ Connector chạy theo người xem, người khác nhận `null` |

*Đã bỏ:* cảnh "Merlin nhận đơn" đặt trong artifact Event Desk ở booth. Khách không được gì, lại thêm một thứ phải trông, và đụng công cụ bán hàng đang chạy.

---

## 6. Phương án và chi phí

| Gói | Gồm những gì | Giờ Claude **[ước tính]** | Giờ của chị **[ước tính]** | $/tháng | Rủi ro chính |
|---|---|---|---|---|---|
| **1a** (website, hạn 09/11) | Dòng `role=status` "đã nhận" · đường `?sent=1` · ẩn thanh đặt hàng sau khi gửi · test màn hình đầu / 404 / tải lại · bản xem trước để chị duyệt chữ | **2–3 h** (dòng chữ ~1 h + test và thanh đặt hàng ~1–2 h). Thêm khung ảnh tĩnh (câu 1): +~1 h → 3–4 h | **~30 phút**: duyệt chữ ở bản xem trước, đổi link Tally, 2 lần gửi thử, Merge | **$0** | Tally tải lại trang **[cần kiểm tra]** · tranh giờ với Admin P0 |
| Việc kèm 1a (Tally) | Email bản sao cho khách (nếu $0) · đổi tiêu đề form + ảnh bìa | ~30 phút soạn | ~10–15 phút duyệt | **$0** nếu gói cho phép **[cần kiểm tra gói]** | Gói Tally có thể không cho gửi email người gửi miễn phí |
| **1b** (website, chỉ khi merge được trước ~01/11; không thì ≥04/01) | Cảnh ≤4 giây: ảnh Merlin + sổ/đèn/thư + danh sách 5 bước · Skip/Replay · reduced-motion · test | **6–9 h** (vẽ đồ vật 3–4, có thể thiếu · gắn cảnh, nút, chuyển động 2–3 · test 1–2) | ~20 phút duyệt từng khung ở 390/1280, Merge | **$0** | Duyệt muộn thì trễ hạn 09/11, lúc đó sang tháng 1 |
| confirm.html | ≤3 giây, 1 lần mỗi mã đơn, in thì ẩn | ~1 h | ~5 phút | **$0** | Biên nhận đang dùng ở booth (mặc định tháng 1) |
| **Sửa đồng bộ Etsy** (việc riêng, tiên quyết của mọi ô số Etsy) | `CRON_SECRET` · OAuth Etsy · `etsy-sync` ghi cả dòng lỗi · Kiên kiểm `verify_jwt` | **CHƯA BIẾT** (Hải Đăng ước tính 1–2 h) | **~15 phút** bấm OAuth Etsy **[ước tính]** **[cần kiểm tra]** | **$0** | Để lâu thì sổ mất thêm số mùa Q4 |
| **Đợt 2** (làng, ≥04/01) | *Không cần số:* Văn phòng Merlin, Merlin 3D theo ý chị, nhiệm vụ mô phỏng 7, sửa lều / ô kịch bản / bố cục điện thoại / 4 chữ sai. *Có số (sau cổng):* view `dashboard_summary`, `stats/summary` trong Event Desk, 9 ô, relay theo tuần | **13–21 h** (công trình 2–3 · Merlin 1–2 · nhiệm vụ 1–2 · sửa lỗi + bố cục + chữ 1–1,5 · view 1–2 · stats/summary 1–2 · bảng + db 3–4 · relay theo tuần 2–3 · kiểm tra 1) | ~20 phút lúc dựng (duyệt publish, migration, republish desk), sau đó **~1–2 phút/tuần gọi relay + ~5 phút/tuần xem bảng** | **$0** tiền mặt. Mỗi lần relay tốn hạn mức gói Claude (ghi số thật sau 3 lần) | Quyền owner Làng **[cần kiểm tra]** · cây/hoa đổi chỗ 1 lần · Supabase Free có thể tự pause (Admin plan: "Free pause sau 1 tuần" **[vendor]**) |
| **Đầy đủ** (TẠM DỪNG tới cổng +4 tuần) | Ô connector trong trang (chỉ Tally `list_forms` + `fetch_insights`, **không Notion**) · Merlin "nhận thư" ≥30 giây · `?task=…&autoplay=1` · làng nhẹ hơn (ngừng vẽ khi đứng yên, bớt đèn), reduced-motion đầy đủ · relay tự động (nếu qua cổng ở 3.3) | +**10–14 h** (đã bỏ cảnh booth, và chuyển bố cục điện thoại + camera xuống mức Vừa) | +~15 phút cho phép connector | **$0**. Gói Tally **[cần kiểm tra]** | **"AI babysitter"**: thêm một màn hình phải trông · nhãn chỉ-đọc của tool **[cần kiểm tra]** · làng nặng trên điện thoại |

**Khuyến nghị:** làm theo thứ tự **1a → (1b nếu kịp) → Sửa đồng bộ Etsy → Đợt 2**. Mỗi bước có cổng riêng: chưa qua cổng thì chưa làm bước sau.
- **1a là bữa chính** của mùa lễ: lấp đúng chỗ trống "gửi form xong không có lời nào". Việc nhỏ, rút lại được bằng 1 cờ.
- **1b là món tráng miệng.** Không kịp thì để tháng 1, không tiếc.
- **Sửa đồng bộ Etsy quan trọng hơn cả làng**, vì Kho Sổ Cái là sổ thật của shop.
- **Đợt 2** làm sau 02/01. Phần không cần số làm được ngay lúc đó. Phần số chỉ làm khi qua cổng.
- **Chưa làm mức Đầy đủ.** Giữ luật của Morgan: thời gian chị trông AI ≤1 giờ/ngày.

---

## 7. Lộ trình

| Khi nào | Việc | Ai | Cổng / điều kiện |
|---|---|---|---|
| **20–26/10** | Chị trả lời mục 9. **Gửi thử thật lần 1** với link hiện tại (trước khi đổi). Claude làm bản xem trước dòng chữ 1a (chữ + alt) cho chị duyệt. Chị đếm **baseline của chỉ số** (4 tuần trước) | Chị ~20 phút, Claude ~1 h **[ước tính]** | Chị duyệt chữ thì Claude mới gắn code |
| **27/10 → ~05/11** | **Admin spike 0a + P0** (ưu tiên số 1, không đổi). **1a được làm trong tuần này**, nhắm trước hạn đồ móc 08/11: gắn code → chị đổi link Tally sang `?sent=1#pay` → **gửi thử thật lần 2** → Merge. Việc kèm Tally (email bản sao, tiêu đề, ảnh bìa) làm cùng lúc | Claude 2–3 h, chị ~30 phút **[ước tính]** | **Hạn merge cứng: 23:59 giờ CT ngày 09/11**[^2] |
| **Chỉ khi kịp trước ~01/11** | **1b**: bản xem trước từng khung ở 390/1280 → chị duyệt → gắn code → Merge | Claude 6–9 h, chị ~20 phút | Phải merge trước ~01/11 và không lấy giờ của P0[^2]. Không kịp thì sang ≥04/01/2027 |
| **Tháng 11, sau P0** (câu 4) | **Sửa đồng bộ Etsy** (việc riêng, chỉ backend). Kiên kiểm `verify_jwt` trước 15/11 | Claude (giờ chưa biết), chị ~15 phút OAuth | Không đụng website nên không bị đóng băng chặn |
| **10 → 14/11** | Admin P1 (branch protection, auto-merge…). **Không merge gì của Merlin trong tuần này** | Claude + chị | — |
| **15/11 → 02/01** | **Đóng băng website.** Không sửa cảnh. Có lỗi thì chỉ PR một dòng `MERLIN_DESK_ON=false` (được phép). Làng: em không làm gì trừ khi chị gọi | — | Tuyết và đèn Giáng sinh tự tắt 02/01 **[repo]** |
| **+4 tuần sau khi 1a lên** (~đầu 12) | **Xem chỉ số** (dưới đây): giữ hay gỡ | Chị ~5 phút | Không tăng thì gỡ bằng cờ |
| **04 → 15/01/2027** | Thay ảnh Merlin mùa lễ (1 đường dẫn dùng chung). Làm 1b nếu đã lùi, và confirm.html. **Đợt 2, phần không cần số:** văn phòng, Merlin 3D, nhiệm vụ mô phỏng, sửa lỗi làng | Claude, chị ~20 phút | Không phụ thuộc đồng bộ Etsy |
| **Khi qua cổng số** | **Đợt 2, phần có số:** view `dashboard_summary` → `stats/summary` → bảng 9 ô → relay theo tuần | Claude, chị duyệt | Cổng: **≥7 dòng `sync_log.ok = true` liên tiếp do lịch đêm của `etsy-sync` ghi** (không phải `manual:`) |
| **+4 tuần sau Đợt 2** | **Cổng quyết định mức Đầy đủ:** chị có mở bảng ≥1 lần/tuần không · số trên bảng khớp Etsy và điện thoại booth khi đối chiếu 1 tháng · chị không mất thêm thời gian trông AI · (chỉ khi muốn tự động) chạy thử `fire_trigger` ghi được mà không cần chị bấm | Chị + hội đồng | Không qua thì dừng ở Vừa |

**Chỉ số thành công của Đợt 1 (chỉ một con số):**
- **Tỷ lệ yêu cầu Custom Orders có cọc trong 48 giờ** = số cọc Square/Zelle trong sổ của chị ÷ số lần gửi Tally. Số lần gửi lấy từ chỉ số tổng `list_forms`, không mở bài gửi.
- **Baseline:** 4 tuần trước khi 1a lên. Số lượng có đủ để so không thì **[cần kiểm tra]**.
- **Xem lại sau +4 tuần:** giữ hay gỡ. Không thêm script analytics.
- **Chị mất khoảng 5 phút/tuần** **[ước tính]**. Tiền cọc không có tín hiệu về hệ thống, nên con số này đếm từ nơi chị đang ghi cọc (câu 3).
- *Ghi chú phụ, không phải chỉ số thứ hai:* nếu số tin nhắn kiểu "chị nhận được form chưa?" giảm rõ, đó là dấu hiệu tốt, nhưng không dùng để quyết.

*Đợt 1 không đụng `content/` hay Sveltia của Admin, nên không cản P0. Nó chỉ tranh **giờ duyệt của chị** và giờ Claude trong tuần P0.*

---

## 8. Rủi ro và luật

**Riêng tư (PII)**
- **Website:** cảnh **không bao giờ** đọc dữ liệu Tally gửi vào `onSubmit`. Trên confirm.html chỉ đọc `p.t`, dù link chứa sẵn tên, tên thú cưng, thành phố, ghi chú **[repo]**. Không beacon, không script bên thứ ba. Không có PII trên URL: `?sent=1` chỉ là cờ, và **không chèn `@name` / `@email` vào link chuyển của Tally**.
- **Làng: chỉ có số tổng, qua view `vietdelight.dashboard_summary`.** Không bao giờ đọc:
  - `buyer_name`, `buyer_email`, `external_buyer_id`, `raw` của `orders`;
  - `order_items.variations` (personalization của Etsy thường chứa tên thú cưng hoặc lời chúc **[suy luận]**);
  - `fees_ledger.raw` và `fees_ledger.description`;
  - **toàn bộ bảng `customers`**;
  - `products_cogs` (giá vốn: chỉ owner xem, **không bao giờ vào repo**);
  - `sync_log.note`;
  - `etsy_tokens` (chứa khoá OAuth).

  *Nguồn: Supabase `list_tables` verbose ngày 20/10, chỉ xem cấu trúc, không đọc dòng nào [đo: Prue].*
- **Event Desk:** relay **không list collection `orders`**, chỉ `get` doc `stats/summary`.
- **Tally:** không dùng `fetch_submissions`. Ở mức Đầy đủ, manifest chỉ có `list_forms` và `fetch_insights`.
- **Notion:** bỏ khỏi kế hoạch. Không mở "Database Website Leads".
- **Không chép HTML làng vào repo** (repo public). Muốn giữ bản sao thì để ở Drive riêng **[đề xuất]**.

**Tự động hoá: 3 chi phí ẩn đã chặn**
- **Hạn mức Claude bị dùng mỗi lần relay:** relay theo tuần, và ghi số thật sau 3 lần.
- **Bước duyệt ghi có thể bắt chị bấm mỗi đêm:** không có việc hẹn giờ ở Đợt 2.
- **Một phiên tự động vừa giữ quyền admin Supabase vừa đọc dữ liệu khách:** chỉ 1 câu SELECT vào view, 2 bước tách nhau, Event Desk chỉ có doc không PII.

**Bảo mật (ngoài phạm vi kế hoạch, tách thành việc riêng)**
- Edge function `etsy-sync`: `verify_jwt: false`. Hiện hàm tự khoá (thiếu `CRON_SECRET` là trả 503) **[đo]**. Khi đã đặt secret, hàm có kiểm đúng secret không thì **[cần kiểm tra]**. Kiên kiểm trước 15/11.

**Brand Canon v2**
- Trên trang khách, Merlin là **ảnh thật**, trừ khi chị chọn rõ hình vẽ (câu 1). Bản vẽ canon: mèo tuxedo, beret vàng nghệ `#CA8D41` có sao thêu, yếm sage, ba lô ô-liu, *"the cat who takes notes"*. **Không phải phù thuỷ.**
- **Beret đã chốt, không còn là chỗ lệch:** TONG-HOP:189 và :193 ("beret xanh") là ghi chép cũ. Canon v2.1 là beret vàng nghệ `#CA8D41` (TONG-HOP:221), và README cũ ghi "beret xanh" đã được sửa ngày 30/09 (TONG-HOP:323) **[repo]**.
- **Không có ngôi sao trang trí** trong cảnh. Brief Custom Orders §2 ghi "không sparkle/star", và commit fa5fcc6 (15/10) đã xoá 2 ngôi sao trang trí khỏi `merlin-closing.svg` **[repo]**. Sao chỉ có ở hình thêu trên beret.
- Không bounce, không confetti, chỉ fade 200–300 ms. Không đưa chữ phép thuật của làng ra khách. Logo không vẽ lại.
- Tên gọi phép thuật trong làng được giữ, vì đó là thế giới nội bộ của chị, khách không thấy.
- **Không đăng ảnh làng lên kênh của shop** (mục 2).

**Etsy / FTC**
- Site không thấy đơn Etsy, nên cảnh **không được** nói hay ngụ ý "Merlin nhận đơn Etsy của bạn".
- Không đưa logo hay nhãn hiệu Etsy vào cảnh.
- Nói thật với khách: không ghi *confirmed* trước khi chị xác nhận, không hứa ngày giao hay thời gian trả lời, không bộ đếm "đang có N người đặt", không giục mua. Luật FTC cấm quảng cáo gây hiểu nhầm, và luật thương hiệu của mình cũng cấm fake urgency. Cách áp vào từng câu chữ cụ thể thì **[cần kiểm tra]** nếu chị muốn hỏi người chuyên luật.

**Hiệu năng**
- **Website:** thêm ≤20 KB **[ước tính]** trên mốc 480 KB / 21 request, CLS giữ 0. Không three.js. Ảnh Merlin dùng lại file đã có.
- **Làng:** đã nặng sẵn (431–637 draw call, 9 đèn điểm, vẽ liên tục **[đo]**). Riêng tính địa hình đã mất khoảng 183 ms trên CPU server, điện thoại sẽ chậm hơn **[đo / ước tính]**. Văn phòng mới **không thêm đèn điểm**. Phần "ngừng vẽ khi đứng yên" để ở mức Đầy đủ.

**Supabase Free**
- Ngày 20/10, project "Purrlight Studio LLC" vẫn ACTIVE_HEALTHY dù 18 ngày không có lần đồng bộ nào thành công. Project "Pawprompt" trong cùng org đang INACTIVE **[đo: list_projects]**, tức là việc tự pause có xảy ra trong org này.
- Admin plan ghi "Free pause sau 1 tuần" **[vendor]**. Có thể chính lịch đêm đang giữ cho project chạy **[suy luận]**. Purrlight có bị pause hay không thì **[cần kiểm tra]**.

**Booth**
- Theo `prices.js`, từ 16/10 chị đã có permit thuế, nhưng `DESK_CONFIG.tax.mode` vẫn mặc định `"none"`, và chế độ thuế lưu riêng trong ⚙ của từng máy **[repo]**. Phần thuế của ô booth phụ thuộc cài đặt này **[cần kiểm tra trên từng máy]** (câu 6).
- Nếu sau này nhập CSV đơn booth vào Supabase thì phải đặt `channel='booth'`. Cột `channel` của `orders` và `order_items` mặc định là `'etsy'`, nhập thiếu là đơn booth bị đếm thành đơn Etsy.

**Bus factor**
- **Làng:** 1 file 121 KB, gần như chỉ Claude sửa được. three.js r128 đã cũ nhưng được ghim bằng SRI. Relay theo tuần: chị không gọi thì ô số đứng ở lần cuối, có ghi giờ, không sập.
- **Website:** cảnh là code thuần trong repo, ghi vào README, có cờ tắt. Không ai cần biết 3D.
- **Ghi mọi thứ mới vào "Sổ tài khoản & khoá"** (deliverable P0 của Admin plan): link Làng và ai là owner, connector nào cấp cho trang nào, cờ `MERLIN_DESK_ON` và ai tắt khi chị vắng, id việc hẹn giờ (nếu sau này có). Mục tiêu là chị không phải tự nhớ thêm gì.

---

## 9. Câu hỏi cho chị (6 câu, câu nào cũng có mặc định)

*Chị chỉ cần trả lời câu nào muốn khác mặc định.*

1. **Merlin trong cảnh sau khi khách đặt là ảnh thật hay tranh vẽ? Khung Merlin đứng yên có hiện cho mọi khách ở phần cọc không? Chị có ảnh hoặc clip Merlin ngồi bên bàn không?**
   *Mặc định:*
   - dùng **ảnh thật**: `merlin-portrait.webp` trong vòng đèn `.merlin-lamp` chị duyệt 16/10, sổ, đèn và phong thư vẽ đơn giản bên cạnh;
   - khung tĩnh chỉ hiện cho mọi khách sau khi chị duyệt bản xem trước và test "nút Square vẫn trong màn hình đầu" qua; trên điện thoại chỉ là ảnh nhỏ 64–72 px cạnh dòng chữ;
   - nếu chị có (hoặc chụp được) 1 ảnh hay clip 5–8 giây Merlin thật ngồi cạnh bàn, sổ, đèn hoặc laptop, em thay vào sau mùa lễ. Không có cũng không sao.
2. **Đợt 1a làm trước 09/11 theo gói này được không? Gồm: dòng "Got it — Merlin noted your order. Next step: your 50% deposit, just below."; ẩn thanh đặt hàng ở đáy điện thoại sau khi gửi; đổi link Tally thành `?sent=1#pay`; chị gửi thử thật 2 lần (trước và sau khi đổi link). Còn hoạt cảnh 1b chỉ lên trước mùa lễ nếu merge được trước ~01/11 mà không lấy giờ của Admin P0; không thì sau 02/01.**
   *Mặc định:*
   - đồng ý;
   - thanh đặt hàng ẩn sau khi gửi (đổi thành nút "Pay deposit" chỉ khi test cho thấy thanh không che địa chỉ Zelle);
   - em gửi hướng dẫn 3 bước đổi link, có dòng "không chèn @name/@email vào link". Chị mất khoảng 10 phút **[ước tính]**, và xoá 2 bài gửi thử trong Tally sau đó;
   - chị chốt chữ cuối ở bản xem trước.
3. **Khách gửi form xong thì nghe tin từ chị thế nào?** Chị thường trả lời trong bao lâu, qua email hay tin nhắn? Hiện khách có nhận email bản sao đơn từ Tally không, và nếu gói của chị bật được miễn phí thì có bật không? Tiền cọc Square/Zelle chị đang ghi ở đâu (Gmail, Notion CS Log, hay không ghi)?
   *Mặc định:*
   - trang **không hứa** thời gian hay kênh trả lời nào cho tới khi chị xác nhận;
   - email bản sao chỉ bật nếu $0 và chị đã duyệt nội dung em soạn;
   - chỉ số 48 giờ đếm từ chỗ chị đang ghi cọc.
4. **Sửa đồng bộ Etsy ngay trong tháng 11, như một việc riêng (chỉ backend, không đụng trang khách)?** Hiện đồng bộ chưa tự ghi sổ được lần nào kể từ lần kéo tay 02/10 (130 đơn), và đêm nào hàm cũng trả lỗi 503.
   *Mặc định:*
   - **có**, làm sau Admin P0;
   - Kiên kiểm bảo mật `etsy-sync` trước 15/11;
   - chị mất khoảng 15 phút bấm OAuth Etsy **[ước tính]**;
   - không kịp thì làm trong lúc đóng băng nếu chị gọi, hoặc đầu tháng 1.
5. **Về Làng:** Làng đang nằm trong tài khoản claude.ai của chính chị (Gmail công ty hay cá nhân?), hay của người khác share cho chị? Ngoài chị, ai đang có quyền Editor hoặc Owner trên Làng và trên Event Desk? Chị sẽ mở bảng số bao lâu một lần, để quyết việc gì mà app Etsy và email Tally chưa cho chị biết? Chị có định chia sẻ hình làng ra ngoài không?
   *Mặc định:*
   - nếu chị không phải owner thì Ý A dừng tới khi chuyển quyền;
   - số chỉ owner xem;
   - nếu câu trả lời là "thỉnh thoảng, cho vui" thì Ý A chỉ dừng ở Văn phòng Merlin và nhiệm vụ mô phỏng, không làm relay và bảng số;
   - không đăng làng lên kênh của shop; muốn kể hậu trường thì cần một quyết định thương hiệu riêng.
6. **Booth:** từ nay tới 14/11 chị có booth hay event nào dùng Event Desk và confirm.html không? Nhân viên lưu đơn trên bản nào: `event.html` trên website (đơn nằm trong từng điện thoại) hay bản Event Desk hosted trên claude.ai (kho đơn chung)? Các điện thoại booth đã đổi chế độ thuế trong ⚙ sang "added" hoặc "included" sau khi có permit (16/10) chưa?
   *Mặc định:*
   - cảnh trên confirm.html để tháng 1;
   - ô booth trong làng chỉ đếm đơn ở bản hosted, và ghi rõ như vậy;
   - trước event kế tiếp, em nhắc chị kiểm chế độ thuế trên từng máy.

**Để sau 02/01, mặc định chưa làm (không cần trả lời bây giờ):**
- **Thẻ QR trong gói hàng Etsy** dẫn tới trang tĩnh "Merlin's desk" (cùng cảnh, quy trình mockup → làm → gửi, hướng dẫn giữ gìn, không có dữ liệu đơn). Đơn Etsy là 130/130 đơn trong sổ **[đo]**. Phải kiểm luật Etsy về việc dẫn người mua ra ngoài trước khi in **[cần kiểm tra]**.
- **Relay đọc các trường ẩn của Tally** (món, tổng ước tính, tiền cọc, cách nhận, nguồn utm) và bỏ hết tên, email, địa chỉ, ảnh. Mặc định: **không**.
- **Ghi cọc Custom Orders vào Event Desk hosted với event "Web Custom"**, thêm khoảng 1 phút mỗi đơn **[ước tính]**, đổi lại có ô "yêu cầu → đã cọc". Mặc định: không.
- **Khoảnh khắc Merlin thứ hai sau khi trả Square**, nếu link Square đặt được trang quay về **[cần kiểm tra]**. Ai cũng gõ được URL đó, nên tuyệt đối không ghi "confirmed / paid".
- **Dùng khung cuối của cảnh cho bài social "After you hit send"** (ảnh 1080×1350 + Reel 6–8 giây, không nhắc AI hay làng). Mặc định: được, sau khi chị duyệt khung.
- **Campaign brief riêng sau mùa lễ** cho điều thật sự kéo khách quay lại: mockup, ảnh tiến độ, ảnh duyệt thành phẩm, và tấm thiệp "From Merlin's notebook" trong hộp.

---

## 10. Góp ý của hội đồng: dùng gì, không dùng gì

| Góp ý | Người | Quyết định |
|---|---|---|
| Bảng NÊN LÀM / TẠM DỪNG / BỎ theo từng ý | Minh Triết | **Dùng** (mục 1) |
| Cân nhắc mua hay tự làm cho Ý A | Minh Triết | **Dùng** (đầu mục 3) |
| Đổi Merlin 3D "theo yêu cầu của chị", giữ ánh hổ phách dưới dạng đèn bàn | Morgan | **Dùng** (3.1) |
| Ô "Khuyến mãi đang chạy + ngày kết thúc" | Morgan | **Gộp** vào ô 6 "Sale & giá" |
| Ô "Etsy Ads 30 ngày" | Hải Đăng | **Dùng** (ô 7) |
| Sửa đồng bộ Etsy trước Đợt 2, có thể trong lúc đóng băng | Hải Đăng, Minh Triết, Prue | **Dùng** (câu 4, mục 7) |
| confirm.html phát 1 lần mỗi mã đơn, khung tĩnh nếu đơn cũ >48 giờ | Morgan, Hải Đăng | **Dùng** (4.3) |
| Đổi tiêu đề form Tally + ảnh bìa Gemini | Morgan, Prue | **Dùng** (việc kèm 1a) |
| Trích dẫn đúng ngoại lệ chuyển động trong `custom-orders.css` | Morgan | **Dùng** (mục 2, 4.2) |
| Bỏ cảnh booth trong Event Desk | Morgan, Minh Triết | **Dùng** (5.2) |
| Campaign brief riêng sau mùa lễ | Morgan | **Dùng**, để sau 02/01 |
| Giữ luật không nhắc AI; muốn khoe làng thì cần quyết định thương hiệu riêng | Morgan, Prue, Linh | **Dùng** (mục 2, câu 5) |
| Không có nút share; bố cục khung cuối như một tấm ảnh đẹp | Linh | **Dùng** (không có nút share; lề an toàn, không có chữ đè lên tranh) |
| Ảnh/clip thật của Merlin bên bàn | Linh | **Dùng** (câu 1) |
| Ảnh mùa lễ đọc từ một đường dẫn dùng chung | Linh | **Dùng** (4.4) |
| Phương án chữ C *"…on Merlin's desk…"* | Linh | **Không dùng**: Morgan bắt buộc bỏ "request" và "on Merlin's desk" |
| 1 sao "tia sao mảnh vàng beret" trong cảnh | Linh | **Không dùng**[^1] |
| Lưới 2 cột trong Sổ tay, chữ thay thế cho biểu đồ nhỏ | Linh | **Dùng** (3.2, 3.6) |
| Nút "Xem Merlin nhận đơn" gọi `focusSite('office')`, chuyển xuống mức Vừa | Linh | **Dùng** (3.6) |
| Chỉnh vật liệu beret, beret không phát sáng | Linh | **Dùng** (3.1) |
| "Chế độ chụp màn hình" ẩn số để khoe làng | Linh | **Không dùng**: luật mới là không đăng làng lên kênh shop |
| Ẩn cảnh khi in Custom Orders; thêm 360 px vào bộ test | Linh | **Dùng** (4.4) |
| Cờ `MERLIN_DESK_ON` chỉ bật sau khi chị xem ảnh và gửi thật | Linh | **Dùng** (4.4) |
| Sửa nhãn kích thước three.js | Minh Triết | **Dùng** (mục 2) |
| Ghi số token/phút thật của relay | Minh Triết | **Dùng** (3.3) |
| Test `onSubmit` không nhận tham số | Minh Triết | **Dùng** (4.4) |
| Luật đóng băng cho phép PR một dòng tắt cờ | Minh Triết | **Dùng** (4.4, mục 7) |
| Gộp 2 lỗi làng vào lần publish kế tiếp | Minh Triết | **Dùng** (3.1) |
| Đọc header Làng trước khi hứa quyền writer | Minh Triết | **Dùng** (3.1, 3.4) |
| Supabase pause: thống nhất nhãn | Prue, Minh Triết | **Dùng** (mục 8) |
| Sổ tài khoản & khoá | Prue | **Dùng** (mục 8) |
| Không chụp làng đăng social | Prue | **Dùng** (mục 2) |
| Dời confirm.html sang tháng 1 nếu tháng 11 có booth | Prue | **Dùng** (câu 6) |
| Đếm tin nhắn "chị nhận được form chưa?" | Prue | **Ghi chú phụ**, không làm chỉ số thứ hai (luật một chỉ số) |
| Gộp phần sửa làng vào ngân sách Đợt 2 | Prue | **Dùng** (mục 6) |
| Đọc Event Desk bằng `out_dir` rồi đếm bằng script | Minh Triết | **Thay** bằng doc `stats/summary`[^6] |
| Relay đọc trường ẩn Tally; ghi cọc "Web Custom"; QR trong gói Etsy; trang quay về Square | Hải Đăng | **Để sau 02/01**, mặc định chưa làm (mục 9) |
| Chặn "we've emailed you / check your inbox"; `channel='booth'`; ghi chú hoàn phí; chế độ thuế booth | Hải Đăng | **Dùng** (4.0, 3.2, mục 8) |

---

## Chú thích: chỗ hội đồng khác ý nhau

*Khi hai yêu cầu bắt buộc mâu thuẫn, em chọn phương án an toàn hơn hoặc rẻ hơn, và ghi lý do ở đây.*

[^1]: **Ngôi sao trong cảnh.** Morgan: bỏ hết ngôi sao trang trí. Linh: lớp nét mực kèm "1 dấu sao". **Chọn: không có sao nào.** Đây là phương án an toàn hơn: brief Custom Orders §2 ghi "không sparkle/star", và commit fa5fcc6 đã xoá đúng 2 ngôi sao trang trí khỏi `merlin-closing.svg`. "Tia sao mảnh vàng beret" (README:327) là chi tiết đã duyệt cạnh tiêu đề mục, không phải cho cảnh này. Hơn nữa ảnh Merlin thật không đội beret, nên không có chỗ hợp lý cho sao. Thay bằng glints của đèn, dấu tích bút chì hoặc dấu chân mèo.

[^2]: **Hạn của 1a và 1b.** *1a:* Minh Triết: P0 có trượt quá 05/11 thì vẫn phát hành 1a trước 15/11. Prue: hạn merge cứng 23:59 CT ngày 09/11, và không merge gì của Merlin trong 10–14/11. **Chọn: hạn 09/11 của Prue**, vì an toàn hơn: trang có ≥5 ngày chạy thật trước khi đóng băng, và không đụng tuần P1. Mục tiêu "trong tuần P0, trước hạn 08/11" của Morgan được giữ làm mốc nhắm. *1b:* Morgan: chỉ lên trước mùa lễ nếu merge được trước ~01/11. Prue: chỉ làm nếu P0 xong trước 01/11, merge trước 09/11. **Chọn: phải merge trước ~01/11 và không lấy giờ của P0** (lấy phần chặt hơn của cả hai). Đây là phương án an toàn hơn, vì hoạt cảnh nằm ngay đường tiền trong các tuần khách gửi form nhiều nhất. Hệ quả: 1b nhiều khả năng sang tháng 1. Điều này khớp với ghi chú của Minh Triết ("Cảnh chạy 5 giây để tháng 1").

[^3]: **1a có kèm khung Merlin tĩnh không.** Morgan: 1a chỉ là dòng chữ (~1 h). Minh Triết, Prue: 1a gồm chữ + khung tĩnh (2–4 h). **Chọn: 1a bắt buộc chỉ là dòng chữ. Khung tĩnh chỉ thêm vào 1a khi chị đồng ý (câu 1) và test màn hình đầu qua, nếu không thì đi cùng 1b.** Phương án này rẻ hơn, và an toàn hơn vì khung tĩnh hiện cho mọi khách ở bước trả tiền, lại cần chị chốt "ảnh hay hình vẽ" trước.

[^4]: **Cách biết lịch đêm "chạy nhưng hỏng".** Minh Triết đưa 2 cách: relay đọc thêm trạng thái `cron.job_run_details`, hoặc sửa `etsy-sync` để ghi cả dòng `ok = false`. Hải Đăng: không bao giờ dùng trạng thái `cron.job_run_details` làm dấu hiệu sống. **Chọn: sửa `etsy-sync` ghi dòng lỗi.** Cách này an toàn hơn vì 17 lần "succeeded" của cron thực chất đều là 503.

[^5]: **Ngưỡng "số cũ".** Hải Đăng: 36 giờ, tính theo "số tính tới", không theo giờ relay. Prue, Minh Triết: 8 ngày, vì relay chạy theo tuần. **Chọn: dùng cả hai, mỗi luật một việc.** 36 giờ đo độ chậm của nguồn so với lúc relay chạy (ô xám, "sổ dừng ở …"). 8 ngày đo tuổi của bản chụp so với bây giờ (chip "số cũ"). Như vậy một cuốn sổ đứng 18 ngày không bao giờ trông như số sống, mà nhịp relay theo tuần cũng không làm cả bảng vàng hết.

[^6]: **Relay đọc Event Desk thế nào.** Minh Triết: đọc bằng `out_dir` rồi đếm bằng script cục bộ, để document không đi vào context. Prue: không list `orders`, trang Event Desk tự ghi doc `stats/summary` không PII, relay chỉ `get` doc đó. **Chọn: cách của Prue**, vì an toàn hơn: tên, địa chỉ, ghi chú không đi qua phiên Claude chút nào. Các phép tính Hải Đăng yêu cầu (tách thanks/order, payMethod, balance, thuế theo `cashBox()`, chống trùng theo `id`) được làm **bên trong trang Event Desk** trước khi ghi doc. Ý (b) của Minh Triết (phiên đọc Event Desk không cầm Supabase) vẫn giữ: 2 bước tách nhau.

[^7]: **Relay tự động hay theo yêu cầu.** Minh Triết: chạy thử `fire_trigger`; nếu vẫn cần chị bấm thì đổi thành chị bấm 1 lần/tuần, chip "số cũ" 8 ngày. Prue: bỏ hẳn việc hẹn giờ ở Đợt 2, relay theo yêu cầu mỗi tuần. **Chọn: cách của Prue** (an toàn hơn và rẻ hơn). Bài thử `fire_trigger` của Minh Triết thành một điều kiện ở cổng +4 tuần, chỉ dùng nếu sau này muốn tự động.

[^8]: **Ô "Bán chạy" cộng theo gì.** Hải Đăng: theo `listing_id`, không theo `title`. Prue: "chỉ được GROUP BY `listing_id, title`". Nếu cộng theo `listing_id, title` thì 27 listing vừa đổi tiêu đề sẽ bị tách đôi. **Chọn: GROUP BY `listing_id`, tên lấy từ `vietdelight.listings`.** Như vậy vẫn chỉ đụng hai cột `listing_id` và `title`, đúng ý Prue là không đụng `variations`, mà không bị tách dòng.

[^9]: **Chữ trên confirm.html.** Morgan: *"Noted in Merlin's notebook."*. Linh: chỉ chú thích *"From Merlin's notebook"*, không có live region. **Chọn: chữ của Linh làm mặc định**, vì an toàn hơn: đó là safe phrase sẵn có của canon, không thêm lời nào mới, và H1 đã nói "Your order is in". Câu của Morgan được đưa vào bản xem trước làm phương án để chị chọn. Cả hai đều bỏ "your order is filed".

[^10]: **Số dòng `cron.job_run_details`.** Prue: 0 dòng, theo số dòng thống kê của Postgres (chính Prue ghi "cần kiểm tra bằng count"). Hải Đăng, Minh Triết: đếm trực tiếp ra 17 lần chạy. **Chọn: 17**, vì số đếm thật chính xác hơn số thống kê ước lượng. Kết luận không đổi: sổ đứng từ 02/10.

[^11]: **Danh sách 5 bước trên điện thoại.** Morgan: mỗi nhịp là một bước thật, hiện thành danh sách. Hải Đăng, Linh: nút Square phải nằm trong màn hình đầu. Danh sách 5 dòng đặt trên nút trả tiền sẽ đẩy nút xuống. **Chọn: trên điện thoại, danh sách đặt dưới khối Square/Zelle**, phía trên chỉ có dòng chữ và ảnh nhỏ 64–72 px. Lý do: phần cọc là đường tiền, nên an toàn hơn.

---

## Biên bản hội đồng

*Hội đồng 5 người duyệt bản v1 ngày 20/10/2026. Cả 5 người đều cho **APPROVE_WITH_CHANGES**. Bản này đã áp dụng **52/52** yêu cầu bắt buộc (must-fix). Chỗ nào hai yêu cầu mâu thuẫn, em làm theo phương án an toàn hơn hoặc rẻ hơn và ghi trong Chú thích.*

### Morgan Chen — Marketing Manager (orchestrator), Purrlight AI team
- **Kết luận:** APPROVE_WITH_CHANGES
- **Must-fix đã áp dụng:** **8/8**. Ảnh thật làm mặc định · 5 nhịp = 5 bước thật · chữ "Got it — Merlin noted your order…" · bỏ mọi ngôi sao · cổng duyệt nội dung trước khi gắn code · tách 1a/1b · một chỉ số cọc trong 48 giờ · email bản sao cho khách. Chữ trên confirm.html theo phương án an toàn hơn, câu của Morgan được đưa vào bản xem trước để chị chọn (chú thích 9).

> Elise, Morgan đây. Tôi đồng ý hướng chính: làng là phòng làm việc riêng của chị, khách chỉ gặp Merlin của storybook, và không đưa chữ "AI" ra trang khách. Có ba điều tôi chưa cho qua. Thứ nhất, ngày 16/10 chị đã chọn ảnh Merlin thật thay hình vẽ trên trang Custom Orders, vậy mà bản kế hoạch kéo hình vẽ quay lại mà không hỏi chị. Thứ hai, chỗ trống thật nằm ở chỗ khách gửi form xong không nhận được lời nào, có lẽ cũng không có bản sao đơn. Sửa việc đó chỉ cần một dòng chữ, khoảng một giờ, không cần chờ hoạt hình. Thứ ba, nội dung do AI vẽ và viết thì chị phải duyệt từng khung, từng chữ trước khi code được gắn vào, chứ không phải đến lúc bấm Merge mới duyệt. Cảnh Merlin 5 giây là món tráng miệng; câu "đã nhận đơn, bước tiếp theo là…" mới là bữa chính. Mình đo bằng một con số: bao nhiêu khách gửi form rồi trả cọc trong 48 giờ. Số không lên thì gỡ, không tiếc. — Morgan Chen, Marketing Manager

### Hải Đăng — Ecommerce Executive
- **Kết luận:** APPROVE_WITH_CHANGES
- **Must-fix đã áp dụng:** **14/14**. Số đo đồng bộ Etsy và việc tiên quyết "Sửa đồng bộ Etsy" · lọc theo `source`, không dùng trạng thái cron · 2 mốc giờ mỗi ô · đổi tên ô 1 · ô lãi "chỉ Etsy" kèm độ phủ · bán chạy theo `listing_id` · bỏ ô sắp hết hàng · ô booth theo `cashBox()` · Tally là "yêu cầu" · ô "Sale & giá" · tên có schema · test màn hình đầu · số đo `etsy-sync` · 4 chữ sai trong làng. Ba chỗ làm theo phương án hoà giải (chú thích 5, 6, 8).

> Elise ơi, Hải Đăng đây.
>
> Hiện trạng (số em đo ngày 20/10; em chỉ chạy SELECT đếm và cộng tổng, đọc định nghĩa view và trạng thái cron, không mở cột tên, email hay raw nào):
> - Sổ Etsy trong Supabase đứng từ 02/10. Lịch đêm vẫn chạy đủ 17/17 lần và đều ghi "succeeded", nhưng lần nào hàm etsy-sync cũng trả 503 vì thiếu CRON_SECRET, bảng token Etsy thì trống. Đơn mới nhất trong sổ là ngày 26/09.
> - Nếu dựng bảng số đúng như bản v1 thì hôm nay ô "Đơn chờ" sẽ hiện 1 đơn cũ, ô "Cập nhật lúc 23:41" trông như số sống, và ô lãi đang tính giá vốn = 0 cho 10/131 món.
>
> Khuyến nghị:
> - Đợt 1 (cảnh Merlin nhận đơn trên Custom Orders và confirm.html): em đồng ý. Thêm đúng một điều kiện là nút Square vẫn phải nằm trong màn hình đầu trên điện thoại.
> - Đợt 2 (bảng số trong làng): em cũng đồng ý, nhưng phải sửa trước 3 điều:
>   1. Mỗi ô ghi rõ kênh nào và "số tính tới ngày nào".
>   2. Không cộng Etsy, booth và Tally vào một con số tổng.
>   3. Thêm ô "Sale & giá" và ô "Etsy Ads". Đây là hai ô làm ra tiền: sale đang chạy 5 món −25% tới hết 25/10, còn Etsy Ads là dòng phí lớn nhất, khoảng $543.
>
> Các bước:
> - Sửa đồng bộ Etsy trước: em làm khoảng 1–2 giờ, chị bấm OAuth khoảng 15 phút [ước tính].
> - Sau đó mới cho relay ghi số vào làng.
>
> Kết quả mong đợi: số trong làng khớp với Etsy và với điện thoại ở booth, chị nhìn 1 phút là biết hôm nay cần gửi gì, cần thu bao nhiêu và sale nào sắp hết. Không phải đoán.
>
> — Hải Đăng, Ecommerce Executive

### Linh Trần — Social Media Executive
- **Kết luận:** APPROVE_WITH_CHANGES
- **Must-fix đã áp dụng:** **9/9**. Ảnh thật làm mặc định, sửa câu "vẽ tiếp từ merlin-closing.svg" · 1 lớp nền + 4 lớp phủ, ≤4 giây · vị trí điện thoại 64–72 px, ẩn thanh đặt hàng, test che nút · 1 nút Skip/Replay không bao giờ xoá · `aria-hidden` / `role=status` / không có live region trên confirm · reduced-motion riêng cho confirm.html · bố cục Sổ tay trên điện thoại chuyển xuống mức Vừa · đèn văn phòng không thêm PointLight, "thở" ≥3 giây · Merlin 3D theo dạng bóng, giữ `catLight`, ảnh ngày/đêm. Lớp nét mực áp dụng nhưng không có dấu sao (chú thích 1). Danh sách 5 bước đặt dưới nút trả tiền trên điện thoại (chú thích 11).

> Chị Elise ơi, Linh đọc kỹ rồi và đồng ý với khung lớn: làng là chỗ riêng của chị, khách chỉ gặp Merlin, và làm Đợt 1 trước. Ý cảnh Merlin nhận đơn rất hay, vì nó lấp đúng khoảng lặng sau khi khách bấm gửi.
>
> Có một điều Linh phải nói thẳng. Hôm nay chị vừa chốt "Merlin là ảnh thật", và cả trang Custom Orders đang kể chuyện bằng ảnh Merlin thật. Nếu thêm một Merlin vẽ đội beret ngay cạnh phần cọc, trên cùng một trang sẽ có hai chú Merlin khác kiểu. Linh đề xuất giữ Merlin thật, còn cuốn sổ và ngọn đèn sẽ kể phần câu chuyện.
>
> Linh cũng đã đo trên điện thoại màn nhỏ: ô cảnh như kế hoạch sẽ đẩy nút "Pay by card" xuống dưới thanh đặt hàng. Trong làng, bảng số trên điện thoại đang bị thanh nhiệm vụ che hết.
>
> Sửa xong mấy điểm này là Linh ủng hộ làm Đợt 1.
>
> — Linh Trần, Social Media

### Minh Triết — R&D Manager (pipeline & IP gate)
- **Kết luận:** APPROVE_WITH_CHANGES
- **Must-fix đã áp dụng:** **9/9**. Bỏ "Etsy về mỗi đêm", ghi số thật · sửa câu mở đầu 3.2 (kéo tay vẫn đúng; số bảng là chỗ sai) · logic ô đồng bộ · tên có schema, view nằm trong `vietdelight` · việc tiên quyết sửa `etsy-sync` (giờ chưa biết) và cổng "≥7 dòng cron liên tiếp" · rủi ro duyệt ghi · relay Event Desk không đưa PII vào context, tách Supabase · tách 1a/1b · cảnh báo `?sent=1` đổi hành vi, gửi thử trước/sau, test tải lại. Năm chỗ làm theo phương án hoà giải (chú thích 2, 3, 4, 6, 7).

> NÊN LÀM phần Merlin trên website, TẠM DỪNG phần bảng số trong làng.
>
> Elise, em là Minh Triết. Kết luận trước:
> 1. Ý B (khách gửi form xong thì thấy Merlin nhận yêu cầu): NÊN LÀM, nhưng làm bản tĩnh trước 15/11. Bản tĩnh gồm câu "đã nhận" và một khung Merlin đứng yên, khoảng 3–4 giờ (GIẢ ĐỊNH). Cảnh chạy 5 giây để tháng 1, nếu chị thích bản tĩnh.
> 2. Ý A (bảng số trong làng): TẠM DỪNG. SỐ THẬT ngày 20/10: kể từ lần kéo tay 02/10 (130 đơn), đồng bộ Etsy chưa tự ghi sổ được lần nào. Cron đã chạy 17 đêm, lần gần nhất trả lỗi 503. Làm bảng bây giờ thì bảng chỉ hiện số của ngày 02/10.
> 3. Đưa làng 3D hoặc chữ "AI agent" ra trang khách, và "Merlin nhận đơn Etsy" realtime: BỎ.
> 4. Tiền mặt $0 là đúng. Có 3 chi phí ẩn chưa ghi trong kế hoạch: hạn mức Claude bị dùng mỗi đêm; một bước duyệt có thể bắt chị bấm mỗi đêm; một phiên tự động vừa giữ quyền quản trị Supabase vừa đọc dữ liệu khách. Em đã ghi cách chặn ở phần must-fix.
>
> Việc đáng làm nhất lúc này lại không nằm trong kế hoạch: sửa đồng bộ Etsy, vì Kho Sổ Cái đã đứng 18 ngày ngay trước mùa lễ. Chưa qua cổng thì chưa làm bảng số.
>
> — Minh Triết, R&D

### Prue — Strategic Advisor & HR/Ops (arbiter), Purrlight AI team
- **Kết luận:** APPROVE_WITH_CHANGES
- **Must-fix đã áp dụng:** **12/12**. Relay theo yêu cầu mỗi tuần, chip 8 ngày · view `dashboard_summary` bắt buộc, một câu SELECT · danh sách cột cấm đầy đủ · Event Desk tự ghi `stats/summary` · db `owner`, `user: {}`, `textContent` · manifest chỉ khai đúng tool, bỏ Notion · số đo thay "dấu hiệu từ planner", giờ OAuth của chị · tách 1a/1b, hạn cứng 09/11 · file riêng `defer` + try/catch + test 404 · không chèn mention vào link Tally · rút gọn §9, sửa "lệch beret", thêm câu về khung tĩnh cho mọi khách · sửa README:507→540 và README:251→284. Ba chỗ làm theo phương án hoà giải (chú thích 3, 8, 10).

> Elise, Prue đây.
>
> [Nhận định] Kết hợp được, và bản v1 đi đúng hướng: khách chỉ thấy Merlin storybook, làng giữ riêng, Ý B làm trước lễ, Ý A để sau 02/01. Em đã kiểm lại gần hết trích dẫn và các giới hạn trong d.ts, đều khớp. Chỉ có 2 số dòng README bị sai.
>
> [Cảnh báo rủi ro] Chỗ nguy nhất không phải 3D, mà là "relay hằng ngày": một việc tự chạy không ai trông, cầm quyền quản trị Supabase và đọc đơn booth có tên, địa chỉ khách. Thêm nữa, bảng etsy_tokens đang 0 dòng. Nghĩa là Kho Sổ Cái chưa chắc có số mới để hiện lên làng.
>
> [Giải pháp thực chiến] Đợt 1 tách nhỏ: câu "đã nhận" và Merlin tĩnh làm trước, hoạt cảnh làm nếu kịp, hạn merge 09/11. Đợt 2 bắt đầu bằng relay chị gọi tay mỗi tuần, chỉ đọc 1 view số tổng, và quyền đọc đặt là "owner" chứ không phải "admin". Thời gian chị trông AI vẫn dưới 1 giờ/ngày.
>
> [Câu hỏi ngược] Làng đang đứng tên ai? Và bảng số đó giúp chị quyết định việc gì mà app Etsy với email Tally chưa cho chị biết?
>
> — Prue
