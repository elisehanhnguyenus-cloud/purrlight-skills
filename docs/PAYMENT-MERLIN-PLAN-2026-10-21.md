# Kế hoạch chốt: bước trả cọc 5 cách + cảnh "Merlin nhận đơn" (21/10/2026)

Bản này sửa từ `plan-v1.md` theo góp ý của hội đồng (Hải Đăng, Linh Trần, Prue). Biên bản hội đồng ở cuối bài.

## Trả lời ngắn

1. **Luồng:** khách gửi form Tally → trang nhảy xuống "Pay your deposit", có 5 cách: PayPal · Venmo · thẻ qua Stripe · thẻ qua Square · Zelle. Cách nào chị chưa gửi link thì **tự ẩn**. Khách trả xong → trang cảm ơn riêng → cảnh Merlin (~15 giây) và lá thư "Your order copy".
2. **Mỗi đơn có một mã ngắn**, ví dụ **K7HM**. Mã không chứa thông tin cá nhân, và nằm sẵn trong đơn Tally chị nhận. Khách ghi **K7HM-D** vào ô ghi chú khi trả cọc, **K7HM-B** khi trả phần còn lại. Chị khớp tiền với đơn bằng mã, trong **một sổ đối soát**, khoảng 1 phút mỗi khoản [ước tính].
3. **Trang không nhìn thấy tiền.** Vì vậy chữ trên trang không bao giờ ghi "paid" hay "confirmed". Chị chỉ bắt đầu làm khi app của hãng ghi giao dịch **đã hoàn tất**, không phải "pending", "processing" hay "đang bị giữ".
4. **Lá thư Merlin thảy vào hộp mail mang tên "Your order copy"** (bản sao đơn): in hoặc lưu PDF được, $0. **Thư xác nhận thật** là email chị tự gửi theo một mẫu cố định, sau khi đã thấy cọc. AI không đọc hộp thư đơn để soạn thư.
5. **Thuế:** số cọc trên trang đã gồm thuế 8,25%, đúng ý chị. Nhưng **link Square có thể cộng thuế thêm lần nữa**: khách gõ $45 thì bị trừ $48.71, tức thu thừa $3.71 [tính toán]. Chị thử 30 giây (mục "Chị gửi em", việc 1). **Booth giữ nguyên việc cộng thuế**: em không đụng cài đặt thuế chung của tài khoản Square.
6. **Hình tạm:** em vẽ lại khung 16:9, không còn ngôi sao trang trí, Merlin **thảy** thư xuống hộp mail đúng như lời chị. Trên web thật, cảnh **tắt sẵn**: trang cảm ơn hiện ảnh Merlin thật + chữ + lá thư. Hình tạm chỉ bật khi chị đã xem bản xem trước các tư thế mới **và** chọn bật (câu 14), vì nếu bật thì nó có thể nằm suốt mùa lễ. Khi agent làm video giao bản thật, em chỉ chép đè 8 file và đổi 1 dòng.
7. **Lịch:** Đợt 1 (trang cảm ơn, lá thư, mã đơn, Square + Zelle) phải merge trước **23:59 giờ CT ngày 09/11**. Website **đóng băng 15/11 → 02/01**. Link của hãng nào chị gửi sau khoảng **05/11** thì chờ tới tháng 1, trừ khi chị duyệt một ngoại lệ "PR chỉ điền dữ liệu".
8. **Luật PayPal rộng hơn bản v1 viết:** khi đã nhận PayPal, chị **không được khuyên khách chọn Zelle cho đỡ phí ở bất cứ đâu**, kể cả DM, email và bài Instagram. Chị cần biết điều này trước khi bật PayPal (câu hỏi 2).
9. **Phí cọc $45** [tính toán theo bảng phí công bố]: Zelle ~$0 · Venmo business ~$0.96 · Stripe ~$1.61 · Square ~$1.79 · PayPal ~$1.84–2.74. **Cả đơn $90** (cọc + phần còn lại, mỗi lần trả mất một khoản phí cố định): Zelle $0 · Venmo $1.91 · Stripe $3.21 · Square $3.57 · PayPal $3.67–5.47.
10. **Phần còn lại (50% sau khi khách duyệt ảnh):** mặc định chị nhắn khách trả qua **cùng cách đã trả cọc**, ghi mã + "-B". Trang cảm ơn có câu trung tính cho người trả phần còn lại.

**Ký hiệu**
- **[A Sx/Qx/Px/Vx/Zx]**: tài liệu chính thức của hãng, đánh số như nghiên cứu A (`providers.md`). URL ở mục 11.
- **[repo]**: có trong code hôm nay (số dòng kèm theo).
- **[đã đọc 21/10]**: hội đồng hoặc em đọc trực tiếp trang chính thức hôm nay (có URL).
- **[cần kiểm tra]**: chưa xác minh. Không dựa vào khi chưa thử thật.
- **[ước tính]**, **[tính toán]**: em tự tính.
- **[đề xuất]**: ý của em hoặc hội đồng, chị duyệt.

---

## Việc em làm ngay (không cần chị)

Làm trên nhánh riêng, **chưa merge**. Không lấy giờ của tuần Admin P0 (27/10–05/11).

1. **Code Đợt 1** cho Square + Zelle: `PAY` mới, mã đơn, bản sao đơn trong tab, khoá số cọc theo đơn đã gửi, phần cọc 5 thẻ (3 thẻ ẩn), trang `thanks.html` + `thanks.js`, lá thư, dòng pháp lý Zelle viết HOA (mục 2–3).
2. **Sửa test và tài liệu cũ** đang dùng `PAY.squareUrl` / `PAY.zelleTo` / `[data-pay-square]` (mục 5.1), cộng toàn bộ test mới (mục 6).
3. **Luật mới trong `tools/check-site.js`**: chặn link Stripe `test_`, PayPal sandbox, thiếu QR ngang hàng, bật cảnh khi chưa có ngày duyệt (mục 6.3).
4. **Tính mức cọc nhỏ nhất** mà trang có thể ra, từ `prices.js`, để chị đặt làm mức tối thiểu của link Stripe (mục 2.3).
5. **Vẽ lại hình tạm** 16:9 (≤ nửa ngày [ước tính]), dựng 8 file, làm **bản xem trước** ở 390 px và 1280 px cho chị (mục 4).
6. **Viết hồ sơ giao agent làm video** bằng tiếng Anh, một file tự đủ: `research/pay/merlin-order-video-brief.md`. Phần bố cục phòng để trống cho tới khi chị trả lời câu 9 (mục 4.3).
7. **Soạn sẵn**: chữ tiếng Anh cho chị duyệt (một trang xem trước), mẫu email xác nhận cố định, hàng tiêu đề của sổ đối soát (không có dữ liệu khách nào), và dòng cho "Sổ tài khoản & khoá".

## Chị gửi em

Câu nào cũng có mặc định ở mục 10. Chị trả lời tới đâu, em làm tới đó.

1. **Thử link Square (30 giây):** mở https://square.link/u/UUg2LtbP, gõ **45**. Màn hình ghi **$45.00**, hay **$48.71** (có dòng thuế), hay có màn hình **tip** hoặc **service charge**? Chụp màn hình gửi em.
2. **Phần còn lại hiện chị thu thế nào:** nhắn khách trả lại qua Square/Zelle, gửi invoice, hay cách khác?
3. **Tiền cọc hiện chị ghi ở đâu** (Gmail, Notion CS Log, hay chưa ghi)? Chị đồng ý dùng 1 sổ đối soát và mã đơn ngắn không?
4. **Tài khoản đã có:** Stripe, PayPal business, Venmo business profile? Đứng tên Purrlight Studio LLC hay tên chị? Khách sẽ thấy tên gì trong app và trên sao kê thẻ? Email Zelle `purrlightstudiollc@gmail.com` gắn với ngân hàng nào, tài khoản business hay cá nhân?
5. **Chữ tiếng Anh**: duyệt ở trang xem trước em gửi (mục 3.1, 3.3), gồm câu "we check every deposit by hand".
6. **Bản xem trước hình tạm** (các tư thế mới: nhảy, đi, gõ cửa, hộp mail): duyệt hay sửa.
7. **Tally:** đổi link chuyển hướng sang `…/custom-orders/?sent=1#pay` và gửi thử 2 lần (mục 7, việc 6).
8. **Link từng hãng** khi chị đã tạo xong (mục 7). Hạn mềm: khoảng **05/11**.

---

## 1. Luồng từ đầu tới cuối

```
Chọn món → "Place your order" → popup Tally → khách bấm Submit
   (mã đơn K7HM đã nằm ở đầu trường ẩn `pick` từ lúc mở form)
   onSubmit (vẫn KHÔNG nhận tham số, không đọc câu trả lời của khách):
     1. chụp bản sao đơn từ chính link đã mở form (mã, món, ước tính, cọc, cách nhận;
        BỎ lời nhắn thiệp) → sessionStorage của tab này
     2. đóng popup → ẩn thanh "Order" ở đáy màn hình → nhảy tới #pay → focus "Pay your deposit"
     3. ~150 ms sau: 1 dòng trạng thái, đọc 1 lần
     4. tạo mã MỚI cho đơn kế tiếp (bản sao vừa lưu giữ mã cũ)

#pay — "Pay your deposit": số cọc và mã lấy từ ĐƠN ĐÃ GỬI, không lấy từ món đang chọn
   PayPal  (Payment Link)       ── trả xong ── Auto-return của PayPal ──────┐
   Venmo   (trong app)          ── quay lại tab ── "I've sent it" ──────────┤
   Stripe  (cọc điền sẵn)       ── trả xong ── redirect của Stripe ─────────┼──► thanks.html
   Square  (khách gõ số)        ── trả xong ── redirect của Square ─────────┤    cảnh + lá thư
   Zelle   (app ngân hàng)      ── quay lại tab ── "I've sent it" ──────────┘
   Nút "I've sent my deposit" (link thường tới thanks.html): đường dự phòng cho MỌI cách

Phần còn lại (sau khi khách duyệt ảnh xong):
   Chị nhắn khách → khách trả qua cùng cách, ghi K7HM-B → nếu hãng đưa khách về thanks.html,
   trang hiện câu trung tính (không bảo khách gửi form lại)
```

Vì sao dùng **một trang riêng** `thanks.html` thay vì hộp thoại trên trang chính [đề xuất]:
- Stripe, Square và PayPal cần **một URL cố định** để đưa khách về. Trang riêng làm được việc đó mà **không gắn tham số nào** lên URL trang chính. Tham số trên trang chính sẽ bị popup Tally tự chép vào form ("automatically forwards the host page's path and query parameters to the popup", https://developers.tally.so/widgets/popups) [B §3.3].
- Chỉ **một chỗ** chạy cảnh, cho cả đường redirect lẫn nút "I've sent".
- **Không có JavaScript vẫn chạy:** nút chỉ là link thường. Bấm Back là về lại phần cọc.
- URL trang cảm ơn **không có tham số nào** của mình. Tham số hãng tự gắn thêm thì trang xoá ngay, không đọc (mục 3.4).

**Phần còn lại: đường mặc định** [đề xuất, chị duyệt ở câu 4]
- Trang đã hứa *"Pay the balance, then it ships"* (`index.html:601`) [repo], nhưng v1 chưa nói khách trả bằng cách nào.
- Mặc định: chị nhắn khách trả qua **cùng cách đã trả cọc**, ghi **mã + "-B"**.
- Tuỳ chọn: tạo link riêng **"Custom order balance"** ở Stripe và Square, để Dashboard tự tách cọc và phần còn lại. Không bắt buộc.
- Khách trả phần còn lại thường mở trang trong tab mới, nên **không có bản sao đơn**. Câu trên trang cảm ơn phải đúng cho cả 3 trường hợp (mục 3.1, dòng 5).

---

## 2. Bước trả cọc (#pay)

### 2.1 Năm cách: thứ tự, cách hiện, chữ trên nút

**Thứ tự cố định: PayPal · Venmo · Stripe · Square · Zelle.**
- User Agreement của PayPal (bản 14/09/2026, P10) [đã đọc 21/10, bản tải về `dl/verify/pp-ua.html`]:
  - *"You must treat PayPal and/or Venmo payment methods or marks at least on par with any other payment methods or marks…"*, gồm *"logo placement, position within any point of sale, and treatment in terms of payment flow, terms, conditions, restrictions, and fees"*.
  - *"you must not present any payment method or mark upstream (or at an earlier point in the checkout experience)"* so với PayPal/Venmo.
  - *"Within all of your points of sale, you agree not to try to dissuade or inhibit your customers from using PayPal or Venmo services or encourage the customer to use an alternate payment method."*
  - *"whenever you display or exhibit the payment methods that you accept (either within any point of sale or in your marketing materials, advertising, and other customer communications) you agree to display the PayPal or Venmo services payment marks at least as prominently, and in at least as positive a manner, as you do for all other payment methods."*
  - Không phụ phí khi khách chọn PayPal (*"No surcharges"*).
- **Hệ quả trên trang:** mọi thẻ cùng cỡ, cùng kiểu nút, PayPal và Venmo đứng đầu trong thứ tự đọc. Không có chữ nào khuyên chọn cách rẻ hơn hay "tốt hơn". Chỉ nêu sự thật.
- **Hệ quả ngoài trang web** (mục 9.6): mẫu tin nhắn CSKH, email xác nhận, bài Instagram, mọi danh sách "cách trả" đều **không được khuyên khách dùng Zelle cho đỡ phí**. Biển booth có bị tính không: [cần kiểm tra].
- Bố cục: các thẻ đang hiện chia đều theo hàng (`repeat(auto-fit, minmax(240px, 1fr))`). Điện thoại: 1 cột, **mỗi thẻ ngắn**: tiêu đề, 1 dòng, 1 nút. QR đã ẩn trên điện thoại (`custom-orders.css:446, 457`) [repo].

| Cách | Nút / dạng | Điền sẵn số cọc | Về trang mình sau khi trả | Ghi mã ở đâu | Khi chưa có dữ liệu |
|---|---|---|---|---|---|
| **PayPal** | **"Pay with PayPal"** (link). Mặc định **Payment Link, "Customer-set price"**: trang PayPal có ví PayPal, Venmo, Pay Later, Apple Pay và thẻ [A P2] | Không có tài liệu → khách tự gõ, có nút "Copy deposit amount". *Nếu chị chọn PayPal.me:* `paypal.me/<tên>/46.01USD` [A P4] | **Có:** tab Confirmation → Auto-return [A P1] | Ô **"Label for Invoice ID"**, nhãn "Order code (like K7HM-D)". **Không đặt bắt buộc** (mục 2.2) | Ẩn |
| **Venmo** | **Chỉ hướng dẫn:** "Send to @handle" + nút Copy + QR (máy tính). Không đặt logo [A V9]. Nút "Open Venmo" chỉ thêm khi đã có link thật lấy bằng nút **Share** [cần kiểm tra] | Không → nút Copy deposit amount | Không → link nhỏ **"I've sent it"** ngay trong thẻ | Ô note của Venmo | Ẩn |
| **Stripe** | **"Pay by card with Stripe"** | **Có:** `?prefilled_amount=<cent>`, khách vẫn sửa được. Chỉ với link "Customers choose what to pay" [A S1] | **Có:** After the payment → Confirmation page → redirect [A S2] | Custom field kiểu Text, nhãn "Order code or your name" | Ẩn |
| **Square** | **"Pay by card with Square"** + QR (máy tính) [repo] | Không → nút Copy deposit amount [A Q1] | **Có, khi chị bật** "Redirect to a website after checkout" [A Q1]. Khách có thể thấy trang của Square trước [cần kiểm tra] | Ô ghi chú khi bật **"Enable customer notes"** [A Q2] | Ẩn (hôm nay đã có link) |
| **Zelle** | **Chỉ hướng dẫn:** "Zelle® payment", gửi tới `purrlightstudiollc@gmail.com` + Copy address. **Không logo, không link** [A Z1, Z4] | Không → nút Copy deposit amount | Không → link nhỏ **"I've sent it"** ngay trong thẻ | Memo | Ẩn (hôm nay đã có) |

**Chung cho cả phần cọc:**
- **Dòng tóm tắt:**
  - Tab **đã gửi form**: *"Your order — {món}: deposit **$X**. Order code **K7HM**."* Số và mã lấy từ **bản sao đơn đã gửi**.
  - Tab **chưa gửi form**: giữ dòng cũ *"Your pick — {món}: deposit **$X** (estimate $Y)."* [repo `custom-orders.js:819-828`].
- **Một nút "Copy deposit amount" dùng chung**, đặt cạnh dòng tóm tắt, lấy cùng số với dòng đó.
- **Gợi ý trong từng thẻ** (khi có mã): *"In the note, write K7HM-D."* Không có mã (tắt JS, máy khác): *"In the note, write your name and your piece."*
- **Số cọc đã gồm thuế** (50% của tổng có thuế 8,25%, hoặc không thuế khi giao ngoài Texas) [repo `prices.js:362-371`]. Không hãng nào được cộng thuế thêm (mục 9.8).
- **Dòng "After you pay, you come back to Purrlight."** [đề xuất của Linh và Hải Đăng]: hiện **cùng lúc trên mọi thẻ có redirect đang hiện**, chỉ khi **tất cả** các thẻ đó đã `back: true`. Không có chuyện Stripe có dòng này mà PayPal chưa có (luật "payment flow" ngang hàng).
- **Tên khách sẽ thấy** trong app hoặc trên sao kê, giống câu Square đang có (*"it shows our shop name, Viet Delight"*). Chỉ ghi cho từng hãng **sau khi chị xác nhận** (Chị gửi em, việc 4).
- Dưới cả 5 thẻ:
  > Paid in your bank app or in Venmo — or not brought back here after paying?
  > **[I've sent my deposit]** → link tới `thanks.html`
- **Dòng liên hệ** (luật PayPal, mục 9.6): *"Questions about your order or deposit? Email purrlightstudiollc@gmail.com"*, hiện ở #pay và trên `thanks.html`.
- **Lede:** *"Place your order first, then pay the 50% deposit any way below. The balance is paid when you approve the photo of your finished piece."*
- **Không bao giờ đưa lên URL thanh toán:** tên, email (không dùng `prefilled_email` của Stripe), lời nhắn thiệp, `client_reference_id`, **`utm_*`** [A S1, S3]. Stripe tự chép UTM của link sang URL quay về (docs.stripe.com/payment-links/post-payment), nên link Stripe không mang UTM. Chỉ có số cọc, ở 2 chỗ hãng có tài liệu (Stripe, PayPal.me).
- **Link mở cùng tab**, như hôm nay [cần kiểm tra trên máy thật, C §6.2].
- **Dòng pháp lý Zelle** [A Z4]:
  - Thêm dòng VIẾT HOA bắt buộc: *"PURRLIGHT STUDIO LLC IS NOT AUTHORIZED, ENDORSED, OR SPONSORED BY EARLY WARNING SERVICES, LLC- OWNER OF ZELLE®."*
  - Chưa đưa chữ *"used with permission"* lên, vì studio chưa xin phép riêng. Tạm giữ: *"Zelle® is a registered trademark of Early Warning Services, LLC."* [cần kiểm tra, câu 18].

### 2.2 Mã đơn [đề xuất của Hải Đăng, chị duyệt ở câu 3]

**Vì sao cần:** không có mã, chị phải khớp 5 kênh bằng tên người trả. Mà tên trong Zelle, Venmo hay PayPal là **tên chủ tài khoản**, có thể khác tên trên form Tally.

**Mã trông thế nào:**
- **4 ký tự**, chỉ dùng ký tự khó nhầm: `ACDEFHJKMNPRTWXY3479` (bỏ 0/O, 1/I/L, 2/Z, 5/S, 6/G, 8/B, U/V, Q). Có 20 ký tự, nên có 160.000 mã [tính toán].
  - Hai đơn trùng mã thì chị khớp thêm bằng tên và món. Sổ đối soát báo trùng. Khi sổ quá ~200 đơn thì đổi lên 5 ký tự [Chú thích 9].
- Tạo bằng `crypto.getRandomValues`. Trình duyệt nào không có thì **không có mã**, trang vẫn chạy, gợi ý chuyển về "your name and your piece".
- **Không phải dữ liệu cá nhân.** Chỉ là chữ ngẫu nhiên.

**Mã sống ở đâu:**
- `sessionStorage["purrlight-order-code"]`, **mỗi tab một mã**, bọc try/catch.
- **Không đổi khi khách sửa món.** Nếu mã đổi theo món, phép so `href === tallyHref` ở `custom-orders.js:126` (khách bấm lại cùng món thì quay lại đúng form đang điền) sẽ hỏng [repo].
- **Đổi sau mỗi lần gửi form** (trong `onSubmit`, sau khi đã lưu bản sao đơn). Như vậy một khách đặt 2 đơn trong cùng tab sẽ có 2 mã khác nhau.
- **Đặt ở đầu chuỗi `pick`**: `K7HM · Housewarming & Closing Gift Box — …`. `pick` đã là trường ẩn của Tally, nên **không phải sửa form**. Email báo đơn của Tally có hiện trường ẩn này không thì [cần kiểm tra ở lần gửi thử đầu tiên, mục 6.4].
- Trang hiện mã ở: dòng tóm tắt #pay, gợi ý của từng thẻ, và lá thư.

**Hậu tố:**
- **"-D"** cho cọc (deposit), **"-B"** cho phần còn lại (balance).
- Lý do riêng cho PayPal: cài đặt **"Block accidental payments"** (chặn nhiều khoản cùng một Invoice ID) theo một trang help của PayPal là mặc định **Yes** (https://paypal.com/us/cshelp/article/how-do-i-block-duplicate-payments-in-virtual-terminal-ts2235) [Hải Đăng đã đọc 21/10]. Có áp cho Payment Links không: [cần kiểm tra]. Nếu áp, cọc và phần còn lại cùng một nhãn sẽ bị chặn. "-D" và "-B" tránh được.
- Vì cùng lý do đó, ô Invoice ID **không đặt bắt buộc** với chữ tự do (ví dụ hai khách cùng gõ "Anna – doll").

### 2.3 Dữ liệu trong `prices.js`

Thay `PAY` hôm nay (`prices.js:116-119`, 2 khoá phẳng `squareUrl`, `zelleTo`) [repo]:

```js
/* Where the deposit is paid — one entry per way, shown in PAY.order (PayPal and Venmo first: PayPal User
   Agreement, "Presentation of PayPal and Venmo"). An empty url / handle / to = that way is hidden (also the
   allowed one-line switch during the 15/11–02/01 freeze, e.g. when an account is on hold).
   back: true only after the return to thanks.html was tested (README "Add a way to pay").
   qr: shown on computers; when any visible way has a QR, PayPal and Venmo must have one too (check-site.js).
   The same values are written into index.html (#pay) for visitors without JavaScript — change both together:
   tools/check-site.js stops a deploy when they differ. Links, handles and addresses only — never a key or secret. */
var PAY = {
  order: ["paypal", "venmo", "stripe", "square", "zelle"],
  paypal: { url: "", back: false, qr: "" },          /* PayPal Payment Link (Customer-set price) — or https://paypal.me/<name> */
  venmo:  { handle: "", qr: "" },                    /* business profile @username · qr: ../assets/img/custom/venmo-pay-qr.webp */
  stripe: { url: "", back: false, qr: "", minCents: 0, maxCents: 1000000 },
          /* https://buy.stripe.com/… "Customers choose what to pay"; minCents = the smallest deposit this page can
             make (the test computes it) = the link's minimum; maxCents = the link's maximum */
  square: { url: "https://square.link/u/UUg2LtbP", back: false, qr: "../assets/img/custom/square-pay-qr.svg" },
  zelle:  { to: "purrlightstudiollc@gmail.com" },
  thanks: "thanks.html"
};

/* the link for one way to pay, with the deposit filled in only where the provider documents it — Stripe:
   ?prefilled_amount in cents (docs.stripe.com/payment-links/customize); PayPal.me: /<amount>USD (PayPal help 432).
   Nothing else ever goes on a payment URL: no name, no email, no card message, no utm. */
function payHref(key, deposit) {
  var m = PAY[key] || {}, url = m.url || "", cents = Math.round(Number(deposit) * 100);
  if (!url || !(cents > 0)) return url;
  if (key === "stripe" && /^https:\/\/buy\.stripe\.com\/(?!test_)[A-Za-z0-9_]+$/.test(url) && cents >= m.minCents && cents <= m.maxCents)
    return url + "?prefilled_amount=" + cents;
  if (key === "paypal" && /^https:\/\/(www\.)?paypal\.me\/[A-Za-z0-9]+$/i.test(url))
    return url + "/" + (cents / 100).toFixed(2) + "USD";
  return url;
}
```

- **`deposit` truyền vào `payHref` luôn là số của đơn đã gửi** khi tab có bản sao đơn. Chỉ dùng `lastPick` khi tab chưa gửi form (mục 2.4).
- **`minCents`** = mức cọc nhỏ nhất trang có thể tính ra. Em tính bằng cách chạy mọi lựa chọn của 7 món qua `prices.js` (việc em làm ngay, 4), rồi chị đặt đúng số đó làm **minimum** của link Stripe [Chú thích 10]. Test kiểm mọi số cọc trang tính ra đều ≥ `minCents`. Lý do: link "khách tự chọn số" công khai mà sàn $1 là chỗ kẻ gian thử thẻ ăn cắp. Stripe ghi *"Card testers create small amount payments, which cardholders are less likely to notice and report as fraudulent"*, dẫn tới tranh chấp, phí, và *"an increased decline rate for legitimate payments"* (https://docs.stripe.com/disputes/prevention/card-testing) [đã đọc 21/10]. Link Square và PayPal Customer-set price có cho đặt mức tối thiểu không: [cần kiểm tra].
- Số cọc nằm ngoài min–max thì **không điền sẵn**: khách tự gõ, không lỗi [A S1].
- Thêm `payHref` và hàm tạo mã vào `module.exports` để test bằng Node.

**Cấu hình cảnh** (cùng file, cạnh `PAY`):

```js
var MERLIN_SCENE = {
  on: false,                      /* true only once Elise approved this version's frames, words and alt (date below);
                                     false = thanks.html shows the real Merlin photo, the words and the letter */
  approved: "",                   /* "2026-10-2x": the day Elise approved this version — check-site.js stops on: true without it */
  version: "mockup-2026-10-21",   /* new files -> new value (GitHub Pages caches 10 min); added as ?v= to each file */
  voice: false,                   /* true once the video has Merlin's voice: shows "Sound on" */
  cc: [[1.6, 3.3, "Thank you!"], [11.5, 12.5, "[knock, knock, knock]"], [12.6, 14.6, "Mommy, you have a new order!"]]
};
```

### 2.4 Thay đổi trong `custom-orders.js`

1. **Khối "pay your deposit"** (`787-829`) [repo]: viết lại thành 1 vòng lặp qua `PAY.order`.
   - Thẻ nào có dữ liệu thì hiện, đặt `href = payHref(key, payDeposit())`, chữ @handle của Venmo, gợi ý có mã, dòng "After you pay…" theo luật ở 2.1.
   - **`payDeposit()`**: có bản sao đơn trong tab → `copy.deposit`; không có → `lastPick && lastPick.deposit`.
   - `updatePay()` (chạy mỗi khi lựa chọn đổi) **chỉ** đổi `href` khi tab chưa gửi form. Đã gửi rồi thì giữ số của đơn đã gửi.
   - Nút Copy: 1 nút "Copy deposit amount" chung (cùng số với dòng tóm tắt), "Copy address" (Zelle), "Copy @handle" (Venmo). Mỗi nút báo trạng thái ngay dưới nó, như `payStatusAfter` hôm nay.
   - **Giữ thuộc tính `data-pay-square`** trên nút Square, để test cũ vẫn chạy trong lúc chuyển (mục 5.1).
2. **Mã đơn:** tạo khi trang tải (2.2). Ghép vào đầu `pick` trong `orderUrl()` (`custom-orders.js:61-89`) [repo], nên link mở form luôn mang cùng mã.
3. **`onSubmit`** (`142-149`) [repo], **vẫn giữ `function ()` không tham số**:
   - **Dòng đầu tiên**, trước `T.closePopup` (vì `onClose` xoá `tallyHref`, dòng 141): gọi `saveOrderCopy(tallyHref)`. Hàm lấy `product`, `total`, `deposit`, `delivery`, `pick` từ `hiddenFields(tallyHref)`, tách mã ở đầu `pick`, **cắt bỏ phần `· Card message: "…"`** (đúng định dạng của `pickText()`, dòng 470). Ghi `sessionStorage["purrlight-order-copy"] = {v:1, at:"2026-10-21", code, product, total, deposit, delivery, pick}`, bọc try/catch. Không có `tallyHref` thì chỉ ghi `{v:1, at, sent:true}`.
   - Sau khi focus `#pay-h`: ẩn `.order-bar` cho tới hết lượt xem (kế hoạch 20/10 §4.2). Điền dòng `role="status"` **đúng 1 lần**, sau ~150 ms. Rồi tạo mã mới cho đơn kế tiếp.
4. **Đường form mở toàn trang** (`?sent=1`): làm như bước 3 nhưng **không có bản sao đơn**, nên không hứa số cọc. Xoá cờ khỏi URL bằng `history.replaceState`.

### 2.5 Thay đổi trong `index.html` (bản không cần JavaScript)

- **5 khối `.pay-way`**, mỗi khối có `data-pay="paypal|venmo|stripe|square|zelle"`. Khối chưa có dữ liệu mang `hidden` **ngay trong HTML**. Ví dụ:

```html
<div class="pay-way" data-pay="stripe" hidden>
  <h3 class="pay-title">Card · Stripe</h3>
  <p data-pay-hint>On the Stripe page, check your deposit amount. In the note, write your name and your piece.</p>
  <p class="pay-actions"><a class="btn btn-primary" data-pay-link href="">Pay by card with Stripe</a></p>
  <p class="pay-back" hidden>After you pay, you come back to Purrlight.</p>
</div>
```

- Có JS và tab có số cọc: gợi ý Stripe thành *"Your deposit, $X, is filled in on the Stripe page — you can change it. In the note, write K7HM-D."* (đúng tài liệu: khách sửa được [A S1]).
- Thẻ Venmo và Zelle có thêm link nhỏ **"I've sent it"** → `thanks.html` [đề xuất của Hải Đăng], vì đó là 2 cách khách phải chuyển sang app rồi quay lại.
- Dưới các thẻ: link **"I've sent my deposit"** `href="thanks.html"`, kiểu nút phụ `.btn-quiet` (viền mực, nền kem, cao ≥44 px).
- `<p class="pay-sent" role="status"></p>` để trống, ngay dưới `#pay-h`.
- Dòng liên hệ, dòng pháp lý Zelle như 2.1.

---

## 3. Trang cảm ơn `custom-orders/thanks.html`

### 3.1 Nội dung (tiếng Anh; chị chốt chữ ở bản xem trước)

Thứ tự trên trang, **cũng là thứ tự trên điện thoại** (không dùng CSS `order`, để thứ tự nhìn trùng thứ tự đọc):

1. `<meta name="robots" content="noindex, nofollow">` (như `confirm.html` [repo]). Không analytics. OG dùng lại `og-custom-orders-merlin.jpg`, `og:url` trỏ về `/custom-orders/`: ai lỡ chia sẻ link thì bạn bè vào trang đặt hàng, không vào trang cảm ơn [đề xuất của Linh].
2. **H1:** *Thank you!*
3. **Cảnh Merlin** `<figure class="scene">` (mục 3.2), gồm theo thứ tự:
   - khung video (ảnh poster nằm sẵn);
   - ô phụ đề + nút Pause/Play/Replay;
   - **dòng sự thật** (giọng của chị) [Chú thích 7]: *"We check every deposit by hand — this page can't see payments. For every made-to-order or custom piece, we send you a design mockup before we start."*
     - Vế sau là **nguyên văn** câu có điều kiện ở `index.html:599` [repo]. Câu "Next, we send you a design mockup" của v1 **sai** với hàng có sẵn: Christening Gown Set *"ready to ship in 2–3 days"* (`index.html:441, 447`), *"A saint we have ready"* (`index.html:456`), `r.readyMade = true` (`prices.js:313`) [repo].
     - Vế đầu *"we check every deposit by hand"* là một cam kết về cách chị làm việc. **Chỉ lên web sau khi chị duyệt** ở bản xem trước, ghi ngày duyệt vào PR. Không có mặc định "đúng" [Chú thích 12].
   - **`<figcaption>` câu mô tả video**, có nhãn ở đầu (WCAG 1.2.5: video được miễn mô tả bằng tiếng khi là *"a media alternative for text that is clearly labeled as such"*, tức *"media that presents no more information than is already presented in text"*, https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html) [đã đọc 21/10]:
     > *The video, in words: An order lands on Merlin's desk. He says "Thank you!" and writes your order out twice. As he jumps down, he tosses one copy into the mailbox for you. Then he carries the other copy to the door, knocks three times and calls: "Mommy, you have a new order!"*

     Câu này nói đủ mọi thứ video cho thấy, kể cả đơn tới bàn và tờ thứ 2. Chữ "tosses / mailbox / door" đổi theo câu trả lời của chị (câu 9, 10, 12).
   - Ảnh poster và ảnh tĩnh để `alt=""`, vì chữ đã nằm ngay figcaption. Trình đọc màn hình không đọc 2 lần.
4. **Khi `MERLIN_SCENE.on` là `false`:** thay cả `<figure>` bằng **ảnh Merlin thật đang có** (cùng đường dẫn dùng chung với trang, hết mùa lễ thay 1 chỗ), alt chị duyệt. Dòng sự thật vẫn hiện. Không có figcaption vì không có video.
5. **Khi tab này không có bản sao đơn** (máy khác, trả phần còn lại, hoặc chưa gửi form). Câu trung tính [đề xuất, chị duyệt chữ; Chú thích 11]:
   > *Paying your balance, or sent your order form from another device? Add your order code or your name to the payment note — we match every payment by hand. If you haven't sent the order form yet, place your order first so we can match your deposit.*

   Có link về `./#gifts`. Câu này thay câu khẳng định *"Haven't sent the order form yet?"* của v1: khách thật trong trình duyệt của app có thể mất `sessionStorage`, đọc câu khẳng định thì dễ gửi form lần 2.
6. **Hộp mail + lá thư** (3.3).
7. **Chính sách cọc** (luật PayPal, mục 9.6): *"Your deposit is refundable until work begins. Custom pieces can't be returned, but anything wrong or damaged is on us, 100%."* Nguyên văn `index.html:628` [repo].
8. **Liên hệ:** *"Questions about your order or deposit? Email purrlightstudiollc@gmail.com"*.
9. Link cuối trang: *"Back to Pay your deposit"* (`./#pay`) · *"Custom Orders"* (`./`).
10. **Follow strip** như `confirm.html` (dòng 57–58, 108) [repo] [đề xuất của Linh]: dữ liệu từ `content/follow.json`, nơi ô Instagram **đã có** link thật chị gửi, `https://www.instagram.com/vietdelight_us/` [repo]. Đường dẫn `../` vì trang nằm trong `custom-orders/`. Không thêm request ra ngoài site.

**Chữ cấm** trên toàn trang, phụ đề, figcaption và lá thư [kế hoạch 20/10 §4.2, B §5.3, C §6.2]:
- *confirmed / confirmation, paid, receipt, deposit received*;
- *we've emailed you, check your inbox, on its way* (trừ khi chị bật email bản sao Tally Pro và đã gửi thử);
- *shipped, arrives, by Christmas*, và mọi lời hứa thời gian;
- *magic, wizard, AI, perfect gift*.

**Dòng trạng thái sau khi gửi form** (ở #pay, chị chọn 1):
- A (kế hoạch 20/10): *"Got it — Merlin noted your order. Next step: your 50% deposit, just below."*
- B [đề xuất của Linh]: *"Got it — your order form is in. Next step: your 50% deposit, just below."* Lý do: để video sau khi trả cọc giữ khoảnh khắc Merlin nhận đơn, không kể 2 lần. Câu này đúng, vì `onSubmit` chỉ chạy khi Tally đã nhận form.

### 3.2 Cảnh Merlin: cách chạy

- **Khung:** `aspect-ratio` 4/3 dưới 600 px, 16/9 từ 600 px. Ảnh poster nằm sẵn. Ô phụ đề giữ sẵn chiều cao 2 dòng. Nút có bề rộng tối thiểu cố định. → **CLS = 0.**
- **Điện thoại xoay ngang** (ví dụ 844×390): khung 16:9 sẽ cao ~457 px, lớn hơn màn hình. Giới hạn:
  `.scene { width: min(100%, calc((100svh - 140px) * 16 / 9)); margin-inline: auto }` (hoặc cách khác cho kết quả tương đương), để phụ đề và nút vẫn nằm trong màn hình.
- **Chỉ chạy khi khách đang thấy cảnh:** video do JS tạo khi **≥50% khung cảnh** nằm trong màn hình (IntersectionObserver `threshold: [0, 0.5]`, như video hero ở `custom-orders.js:1482-1486`) [repo]. Cuộn đi thì dừng, quay lại thì chạy tiếp nếu khách chưa bấm dừng. Lý do: trên máy nhỏ, câu "Mommy…" ở giây 12,6 có thể chạy khi khách chưa nhìn tới.
- Điều kiện tự chạy: `MERLIN_SCENE.on`, **không** bật giảm chuyển động, **không** bật Save-Data, trình duyệt chơi được WebM hoặc MP4.
  - `muted playsinline`, `aria-hidden="true"`, `tabindex="-1"`, **không `loop`**; `src = <file> + "?v=" + version`;
  - hiện dần 250 ms khi có khung hình thật (sự kiện `playing`);
  - chạy 1 lần rồi **dừng ở khung cuối**.
- **Một nút duy nhất**, đổi nhãn tại chỗ: **Pause video ↔ Play video**, xem xong thành **Replay**. Cao **≥44 px** (đây là nút chính dưới ngón tay cái; nút hero là 32 px). Không bao giờ xoá nút khỏi DOM (WCAG 2.2.2).
- **Tiếng chỉ phát khi khách bấm:** nút "Sound on / Sound off" chỉ hiện khi `voice: true`. Video tạm không có tiếng, nên không có nút này.
- **Phụ đề:** từ `MERLIN_SCENE.cc`, vẽ vào ô dưới video theo `timeupdate`, như `HERO_CC` (`custom-orders.js:1378`) [repo]. **Khi video tạm dừng, giữ câu đang hiện** (khác hero), vì khách bấm Pause thường là để đọc [đề xuất của Linh].
  - Không dùng `.vtt` + `<track>` trên site: GitHub Pages trả kiểu file gì cho `.vtt` thì chưa kiểm [C §4.2]. Agent vẫn giao VTT, em chép thời điểm sang mảng.
- **Giảm chuyển động và Save-Data: một luật chung** [Chú thích 4]:
  - Không tải video, hiện **ảnh tĩnh khung cuối** + nút **"Play video"**. Video **chỉ tải khi khách tự bấm**.
  - Bật giảm chuyển động giữa chừng: video dừng, chuyển sang ảnh tĩnh, nút ghi "Play video", **không tự chạy lại**.
- **File lỗi** (404, không giải mã được): ảnh tĩnh + chữ. Nút giữ chỗ, ghi *"Video unavailable"*, `aria-disabled="true"`. Không lỗi console, focus không rơi về `<body>`.
- **Chuyển tab** thì dừng, quay lại thì chạy tiếp nếu khách chưa bấm dừng [repo `custom-orders.js:1461`].
- **Focus:** trang mới, không cần bẫy focus. H1 là chữ đầu tiên trong `<main>`. Thứ tự Tab: Pause video → (Sound on) → Open your order copy → các link cuối. Không live region.
- **Khi in:** ẩn cảnh và các nút, chỉ in lá thư.

### 3.3 Hộp mail và lá thư "Your order copy"

**Vì sao không gọi là "Order confirmation":** khi khách xem cảnh, chưa ai kiểm tiền cọc, và trang không biết khách đã trả hay chưa. Khách đọc chữ *confirmation* sẽ hiểu là "đã xác nhận".
- **Lá thư trong hộp mail = bản sao những gì khách đã gửi.** Về nội dung, đúng là lá thư chị muốn.
- **Thư xác nhận thật = email chị gửi sau khi thấy tiền.** Chỉ trong email đó mới được dùng chữ *confirmed*. Đây là chỗ **đổi so với lời chị**, nên em hỏi riêng ở câu 7.

**Cách hiện:**
- Nút **"Open your order copy"** (hình hộp mail nhỏ, `aria-expanded`, `aria-controls="letter"`) nằm cố định dưới cảnh, **có ngay từ đầu**.
- Không có JS: lá thư hiện sẵn ở dạng chung (không số tiền, không mã).

**Nội dung lá thư** (dựng bằng `textContent`, không bao giờ `innerHTML`, vì chữ lấy từ link form mà khách có thể sửa):

```
From Merlin's notebook
Your order copy · Oct 21, 2026 · Order code K7HM
Housewarming & Closing Gift Box
My pick: … (dòng tóm tắt, ĐÃ BỎ mã ở đầu và lời nhắn thiệp)
Estimate $75.78 · 50% deposit $37.89 · the balance after you approve the photo of your finished piece
Ship within Texas
What happens next
 1. We check your order and your deposit.
 2. For every made-to-order or custom piece, we send you a design mockup before we start.
 3. For a made-to-order or custom piece, we make it and send you a photo of the finished piece.
    Pay the balance, then it ships free in the U.S. — or pick it up at Pearland Town Center.
When you pay, write K7HM-D in the payment note.
This is a copy of what you sent us, not proof of payment.
[Print or save as PDF]   [Copy text]
```

- **Bước 1** là câu mới, chị duyệt cùng câu "we check every deposit by hand". **Bước 2** là nguyên văn `index.html:599`. **Bước 3** ghép từ `index.html:600-601` và **giữ điều kiện "made-to-order or custom"**, nên đúng với cả hàng có sẵn [repo]. Không cần rẽ nhánh theo món.
- **Số tiền và mã chỉ hiện khi** bản sao đơn có và đúng dạng (số `^\d{1,5}\.\d{2}$`, mã đúng bảng ký tự). Không có thì ghi *"Your pick is in the order form you sent."*, **không bịa số** [B §5.2].
- **Lưu ở đâu:** chỉ `sessionStorage` của tab đó. **Không** localStorage, **không** lời nhắn thiệp [repo: *"never stored on the device"*, `custom-orders.js:456`].
- **Print:** `window.print()` + CSS in chỉ lá thư. **Copy text:** chép chữ thuần (lệnh in có thể không chạy trong trình duyệt của app Instagram/TikTok [cần kiểm tra]).

**Ba loại "thư" và mặc định** [B §5.2–5.3]:

| | Là gì | Chi phí | Mặc định |
|---|---|---|---|
| **B. Lá thư trên máy khách** | Lá thư ở trên. Có ngay, nhưng chỉ còn trong tab | $0 | **Làm** |
| **C. Email chị gửi sau khi thấy tiền** | **Thư xác nhận thật.** Một **mẫu cố định** lưu trong Gmail. **Chị tự điền** tên, số cọc, món, mã, và **tự bấm gửi** [Chú thích 6] | $0 | **Làm** |
| A. Email bản sao tự động từ Tally lúc khách gửi form | Khách có bản lưu trong hộp thư, gửi **trước** khi trả cọc. Cần **Tally Pro** (https://tally.so/help/respondent-email-notifications) | $29/tháng hoặc $290/năm (https://tally.so/help/tally-pro) | Không, trừ khi chị muốn (câu 8) |

**Mẫu email C** (chị duyệt chữ). Nhắc lại luật PayPal: mẫu này **không** gợi ý cách trả rẻ hơn.

> **Subject:** Your Purrlight order is confirmed (order code {code})
> Hi {name}, thank you! I've received your {deposit} deposit for {piece}, so your order is confirmed. For every made-to-order or custom piece, I'll send you a design mockup before we start. — Elise, Purrlight Studio

Không hứa ngày, không hứa thời gian trả lời. **Để AI soạn nháp từ hộp thư đơn** là một quyết định riêng, chị duyệt riêng (kế hoạch 20/10 §8 cấm đọc dữ liệu khách).

### 3.4 `thanks.js` không bao giờ đọc URL

- **Không đọc `location.search`** ở bất cứ dòng nào. `check-site.js` kiểm bằng cách tìm chuỗi này trong file.
- Lúc tải trang, gọi `history.replaceState` để **xoá mọi tham số** hãng tự gắn thêm (Stripe chép UTM và có thể gắn `{CHECKOUT_SESSION_ID}` [A S2]; Square và PayPal gắn gì thì [cần kiểm tra], providers.md bảng so sánh).
- Test (6.2): mở `thanks.html?st=Completed&amt=46.01&tx=TEST` thì chữ hiện ra **giống hệt** khi không có tham số. Không chữ nào là "Completed" hay số tiền lấy từ URL. Có test này thì sau này không ai đọc `st=Completed` để ghi "paid".

---

## 4. Hình tạm và cách thay bằng video thật

### 4.1 Kịch bản (theo đúng lời chị)

nhận đơn → "Thank you!" → viết 2 tờ → **thảy tờ 1 xuống hộp mail trong lúc nhảy xuống** → đi tới cửa (ngậm tờ 2) → gõ cửa → *"Mommy, you have a new order!"* → dừng.

- **Động từ là "thảy" (toss/tosses),** không phải "thả" (drop) như v1. Lời chị: *"nó thảy 1 tờ vào 1 cái hộp mail"*, *"thảy xuống hộp mail"*, *"đồng thời nó nhảy xuống"*.
- **Mặc định mới** [đề xuất của Linh; Chú thích 3]: **hộp mail đặt dưới sàn, sát chân bàn**, trong vùng 4:3 ở giữa. Merlin thảy tờ 1 xuống hộp **ngay lúc nhảy xuống**, thành **một động tác mềm, không nảy**. Như vậy đúng chữ "đồng thời", mà vẫn giữ luật "một chuyển động một khung" của Brand Book.
- **Nhịp 9** (khung cuối, cũng là ảnh tĩnh) [đề xuất của Linh]: Merlin ngồi cạnh cửa, tờ 2 dưới chân, **quay đầu về phía người xem và chớp mắt chậm**. Ảnh tĩnh có mặt Merlin, không phải lưng mèo. Vẫn trong 14,5–15,5 s.
- Chị chốt vị trí hộp mail (câu 9) và tờ 2 (câu 10). Chưa có câu trả lời thì **hình tạm dùng mặc định**, còn **hồ sơ giao agent chưa khoá bố cục phòng**.

### 4.2 Video tạm [chị đã nói không cần đẹp]

- **Vẽ lại `scratchpad/merlin/scene.svg`** cho đúng khung video thật. Hôm nay file có `viewBox` 480×360 (4:3), `clipPath` bo góc `rx="28"`, và viền `#EBDFCF` vẽ cứng vào hình [đo 21/10]. Chụp ở 1920×1080 sẽ ra 2 dải trống hai bên, còn góc bo và viền dính vào video.
  - Nền tràn khung **16:9**, ví dụ `viewBox="0 0 640 360"`, tường kéo ra hai bên. **Bỏ `clipPath` và rect viền.**
  - Cửa phòng, hộp mail, bàn và mọi hành động nằm trong **x = 80–560** (vùng 4:3 ở giữa).
  - **Bỏ cả 3 ngôi sao trang trí:** sao ở cửa sổ, dấu niêm phong hình sao trên phong thư, sao trên trang sổ (lớp `.b4`). Theo chú thích [^1] của kế hoạch 20/10: không có sao nào trong cảnh, chỉ còn sao thêu trên beret (nếu chọn kiểu B).
  - Tư thế mới (nhảy, đi, gõ cửa) đổi vị trí và cỡ từ nhóm Merlin đang có. Cửa và hộp mail vẽ khối đơn giản. **Công ≤ nửa ngày** [ước tính].
- Playwright chụp các khung ở 1920×1080. ffmpeg nối khung, mờ chuyển 250 ms, **không tiếng**, mã hoá đúng thông số video hero [C §4.1].
- **8 file trên site**, tên cố định (C §4.2):
  - `assets/video/merlin-order-960.{mp4,webm}` và `merlin-order-phone-640.{mp4,webm}`;
  - `assets/img/custom/merlin-order-poster-{960,phone-640}.webp` (khung đầu) và `merlin-order-still-{960,phone-640}.webp` (khung cuối).
  - `merlin-order.en.vtt` chỉ là **file agent giao**, **không deploy** (thời điểm chép vào `MERLIN_SCENE.cc`). Bảng C §4.2 dòng `.vtt` hiểu theo nghĩa này.
- **Cổng duyệt cho chính hình tạm** (kế hoạch 20/10 §4.4: AI làm, CEO duyệt trước khi lên web) [Chú thích 5]:
  - Chị mới duyệt 6 khung bàn làm việc ngày 20/10 (`beats.png`). Các tư thế mới chị chưa thấy lần nào.
  - Trước khi đặt `on: true`: em gửi **bản xem trước** gồm từng khung ở 390 px và 1280 px, phụ đề, figcaption và alt. Chị duyệt → ghi ngày vào `MERLIN_SCENE.approved` và vào PR.
  - Chưa duyệt thì `on: false`: trang cảm ơn hiện ảnh Merlin thật, chữ và lá thư vẫn chạy.

### 4.3 Hồ sơ giao agent làm video: một file tiếng Anh tự đủ

Thay câu "giữ nguyên C §4.1–4.3" của v1 (lẫn chi tiết code). File: `research/pay/merlin-order-video-brief.md`. Không ghi tên mô hình nào. Gồm:

1. **Đúng 2 câu thoại** và chữ phụ đề: *"Thank you!"*, *"Mommy, you have a new order!"* (chữ cuối theo câu 11), cộng `[knock, knock, knock]`.
2. **Bảng nhịp** với thời điểm khớp video tạm. Video tạm dùng làm **animatic**: lệch tối đa ±0,3 s. Lệch hơn thì giao kèm VTT mới.
3. **Ảnh tham chiếu Merlin thật:** `assets/img/custom/hero-merlin-wide-1376.webp`, `hero-merlin-phone-1024.webp`, `merlin-portrait.webp`, và video `assets/video/hero-merlin-voice-960.mp4` (mẫu giọng và mẫu màu) [repo, các file có thật].
   - Đặc điểm phải giữ: mèo tuxedo đen–trắng, vệt trắng chạy lên sống mũi, mõm, ngực và chân trước trắng, mắt xanh lục, mũi hồng.
   - **Không** có nơ đỏ, chuông vàng (đồ mùa lễ trong ảnh tham chiếu).
4. **Sơ đồ phòng và luật liền mạch:** đúng 2 tờ giấy, luôn đếm được 2. Đơn tới (phong thư) nhìn khác hẳn bản sao gửi đi (tờ giấy gấp). Vị trí hộp mail và cửa cố định (để trống tới khi chị trả lời câu 9).
5. **Điện thoại:** ở bản cắt 4:3 rộng 343 px, mặt Merlin ở nhịp 1–4 phải đọc được [đề xuất: cao ≥1/5 khung]. Được 1–2 lần cắt cảnh thẳng (ví dụ ở nhịp 5), không lia, không zoom. Công cụ làm video thường giới hạn độ dài mỗi clip [cần kiểm tra với agent], nên được giao 2–3 shot kèm danh sách dựng.
6. **Đạo diễn giọng:** "Thank you!" ấm, nhỏ, nhìn vào người xem. Câu gọi cửa to hơn một chút nhưng không hét, vẫn trong −17 LUFS ±1.
7. **Kiểm lỗi hình trước khi giao:** 4 chân, 1 đuôi, vệt lông không đổi qua mọi khung, không có chữ méo trên giấy hay hộp mail.
8. **Không có ngôi sao nào** (trừ sao thêu trên beret nếu chọn kiểu B). Câu *"Trăng sao chỉ nhỏ và hiếm"* ở `scene.md` §4.3 **bị thay** bằng câu này, cho khớp chú thích [^1] ngày 20/10.

Cộng phần còn lại của C §4.1–4.3 viết lại bằng tiếng Anh (khung hình, vùng an toàn, danh sách những thứ không được có trong hình). Xin agent giao thêm [đề xuất của Linh]: **tiếng tách riêng** (giọng / tiếng động) và một bản thu số nhiều *"Mommy, you have new orders!"* để sau này dùng cho làng hoặc bảng điều khiển nội bộ. Nếu sau này muốn đăng thành Reel/TikTok thì cần **bản dọc 9:16 làm riêng**, và phải kiểm luật gắn nhãn nội dung tạo bằng AI của từng nền tảng [cần kiểm tra].

### 4.4 Khi agent làm video giao bản thật

1. Em mã hoá ra 4 video + 4 ảnh và kiểm: dung lượng (MP4 960 ≤1,2 MB, bản điện thoại ≤800 KB, ảnh ≤60/40 KB), độ to −17 LUFS ±1, khung đầu và khung cuối, vùng 4:3, không chữ hay logo trong hình.
2. **Chị duyệt bản xem trước** (390 px + 1280 px, kèm video). Ghi ngày vào `approved` và PR.
3. Chép đè file (cùng tên). Trong `prices.js`: đổi `version`, `approved`, đặt `voice: true`, chỉnh `cc` cho khớp tiếng. **Không sửa code.**
4. **Lịch:** xem 5.2(c). Không merge gì của Merlin trong 10–14/11 (chú thích [^2] kế hoạch 20/10).

---

## 5. File thay đổi, lịch và đóng băng

### 5.1 Danh sách file

| File | Thay đổi |
|---|---|
| `custom-orders/prices.js` | `PAY` mới (mỗi cách một mục, có `qr`), `payHref()`, hàm tạo mã, `MERLIN_SCENE` (`on: false`, `approved`), `module.exports` |
| `custom-orders/index.html` | `#pay`: 5 thẻ (3 thẻ `hidden`), lede mới, nút Copy chung, link "I've sent it" trong thẻ Venmo/Zelle, link "I've sent my deposit", dòng `.pay-sent role=status`, dòng liên hệ, dòng pháp lý Zelle. Nút Square **giữ `data-pay-square`** |
| `custom-orders/custom-orders.js` | Khối trả cọc viết lại (vòng lặp `PAY.order`, số cọc theo đơn đã gửi). Mã đơn vào `pick`. `onSubmit`: `saveOrderCopy` → đóng → ẩn thanh Order → dòng trạng thái 1 lần → mã mới. Xử lý `?sent=1` |
| `custom-orders/custom-orders.css` | Lưới thẻ chia đều, `.btn-quiet`, `.scene` (giới hạn khi xoay ngang), `.scene-cc`, `.scene-ctrls` (≥44 px), `.letter`, CSS in |
| `custom-orders/thanks.html` (**mới**) | Trang cảm ơn: `noindex`, OG trỏ về `/custom-orders/`, follow strip |
| `custom-orders/thanks.js` (**mới**) | Cảnh + lá thư + xoá tham số URL. ES5, bọc try/catch, ~8 KB [ước tính]. Không đọc `location.search`, không gọi tên miền ngoài |
| `assets/video/`, `assets/img/custom/` | 4 video + 4 ảnh tạm. QR cho PayPal, Venmo, Stripe khi có link (QR Square đã có) |
| `tools/check-site.js` | Luật mới (mục 6.3) |
| `scratchpad/test-prices.js:138-139` | Đang so `P.PAY.squareUrl`, `P.PAY.zelleTo` [repo] → đổi sang `P.PAY.square.url`, `P.PAY.zelle.to` |
| `scratchpad/test-studio.js:370, 445` | Đang dùng selector `[data-pay-square]` [repo] → vẫn chạy (giữ thuộc tính), thêm test mới cạnh đó |
| `website/README.md:290` | Còn ghi `PAY.squareUrl`, `PAY.zelleTo` [repo] → sửa, thêm mục "Thêm một cách trả cọc" và "Thay video Merlin" |
| `research/pay/merlin-order-video-brief.md` (**mới**, không vào site) | Hồ sơ giao agent (4.3) |

**Không đổi:** video hero, Event Desk, `confirm.html`, form Tally (trừ link chuyển hướng ở mục 7, việc 6), **form newsletter** (chị nói cứ để đó, 21/10).

**Kế hoạch này THAY Đợt 1b của kế hoạch 20/10** (cảnh ≤4 giây, `js/merlin-desk.js`, cờ `MERLIN_DESK_ON`). Không làm file và cờ đó nữa, để không có 2 cảnh và 2 cờ song song. Các việc của **Đợt 1a** (dòng "đã nhận", ẩn thanh Order, `?sent=1`) nằm trong Đợt 1 ở đây.

### 5.2 Lịch & đóng băng [theo kế hoạch 20/10 §7 và chú thích [^2]]

**(a) Đợt 1** (trang cảm ơn, lá thư, mã đơn, Square + Zelle, dòng pháp lý Zelle):
- Merge **trước 23:59 giờ CT ngày 09/11**.
- **Không lấy giờ của tuần Admin P0 (27/10–05/11)**, ưu tiên số 1. Em làm trong 21–26/10. Không kịp thì làm tiếp 06–09/11.
- Việc sửa đồng bộ Etsy chị vừa duyệt (21/10) là việc backend riêng, không đụng website, nên không bị đóng băng chặn. Nhưng nó cũng lấy giờ làm việc, nên em không xếp chồng lên nhau.

**(b) Đợt 2** (PayPal, Venmo, Stripe, và redirect của Square):
- Link nào chị gửi **trước khoảng 05/11** thì lên web trước 09/11.
- Link gửi sau đó chờ tới **≥04/01/2027**, trừ khi chị **duyệt bằng văn bản một ngoại lệ đóng băng**: *"PR chỉ điền dữ liệu: 1 mục `PAY` + khối `index.html` tương ứng, test xanh"*.
- Việc đổi `back: true` cũng tính là PR loại này.

**(c) Đợt 3** (video thật): làm **trước 09/11** hoặc **sau 02/01**, hoặc theo cùng kiểu ngoại lệ *"chỉ thay asset"* (chép đè 8 file + đổi `version`/`approved`/`voice`/`cc`). Không merge gì của Merlin trong 10–14/11.

**(d) Hai công tắc tắt được phép trong lúc đóng băng** (PR 1 dòng):
- `MERLIN_SCENE.on = false`.
- Để trống `PAY.<cách>.url` / `handle` / `to`: ẩn một cách trả khi tài khoản đó bị giữ tiền hoặc khoá.

**(e)** Đợt 1b của kế hoạch 20/10 bị thay (5.1).

**Chỉ số thành công** (sửa kế hoạch 20/10 §7, đang đếm "cọc Square/Zelle"):
- **Tỷ lệ yêu cầu Custom Orders có cọc trong 48 giờ** = số cọc của **mọi cách trả**, lấy từ **đúng 1 sổ đối soát** (mục 9.9) ÷ số lần gửi Tally (số tổng `list_forms`, không mở bài gửi).

### 5.3 Thứ tự ship trước 09/11 [đề xuất của Prue]

1. Dòng "đã nhận" + ẩn thanh Order (Đợt 1a cũ).
2. Dòng pháp lý Zelle viết HOA.
3. `thanks.html` có chữ + lá thư + nút "I've sent my deposit" + mã đơn.
4. Bật redirect cho link Square đang có, **sau khi** chị đã thử thuế (Chị gửi em, việc 1).
5. Cảnh Merlin chờ sau `MERLIN_SCENE.on` và cổng duyệt (4.2).

PayPal, Venmo, Stripe chỉ thêm khi tài khoản business sẵn trước khoảng 05/11.

---

## 6. Test cần thêm

### 6.1 Node (`scratchpad/test-prices.js`)
- `payHref`:
  - Stripe 46.01 → `…?prefilled_amount=4601`;
  - dưới `minCents`, trên `maxCents`, hoặc 0/NaN → link trơn;
  - link Stripe `https://buy.stripe.com/test_…` → link trơn (và check-site chặn deploy);
  - PayPal.me → `/46.01USD`; PayPal Payment Link → link trơn; Square → link trơn;
  - **không** URL nào chứa `@`, `email`, `name`, `utm_` hay `Card message`.
- **`minCents`**: chạy mọi lựa chọn của 7 món (cả giao ngoài Texas, sale, số lượng) → mọi số cọc ≥ `PAY.stripe.minCents`, và `minCents` đúng bằng số nhỏ nhất.
- **Mã đơn:** đúng 4 ký tự, chỉ trong bảng ký tự; không có `crypto` thì trả rỗng.
- `PAY.order` có đúng 5 khoá, PayPal và Venmo đứng trước. Có khoá `qr` cho `paypal`, `venmo`, `stripe`, `square`.
- `MERLIN_SCENE.cc` theo thứ tự thời gian, không chồng nhau, qua bộ lọc từ cấm.
- **Từ cấm** trên dòng sự thật, câu trung tính, figcaption, các bước lá thư, mẫu email (trừ chữ "confirmed" chỉ được phép trong mẫu email C).
- Sửa dòng 138–139 sang khoá mới.

### 6.2 Playwright (`test-studio.js` + file mới `test-thanks.js`)

**Phần cọc**
- Chỉ hiện thẻ có dữ liệu. Có bản `prices.js` giả với đủ 5 cách (chặn request bằng `route`): thứ tự PayPal, Venmo, Stripe, Square, Zelle; các thẻ rộng bằng nhau ở 390 và 1280.
- Chưa gửi form: chọn món → `href` Stripe có đúng số cent của cọc. Đổi món → `href` đổi theo.
- **Gửi món A, đổi sang món B → `href` Stripe vẫn mang số cent của A**, dòng ghi "Your order — A: deposit $X", nút Copy chép số của A.
- **Mã đơn:** cùng mã khi đổi món; mã nằm ở đầu `pick` trong link form; hiện trong gợi ý các thẻ; đổi sang mã mới sau khi gửi form; bấm lại cùng món thì vẫn quay về đúng form đang mở (`href === tallyHref`).
- Tắt JS: thẻ `hidden` không hiện; link "I've sent my deposit" vẫn dẫn tới `thanks.html`.
- `onSubmit` (Tally giả, như test hôm nay ở dòng 590-640): có `purrlight-order-copy` với `code`, **không** chứa `Card message`, **không** có gì trong localStorage; dòng `.pay-sent` điền đúng 1 lần; `.order-bar` ẩn; focus ở `#pay-h`; mã nguồn vẫn là `onSubmit: function ()`.
- **390×844:** nút "I've sent my deposit" nằm trong **2 màn hình** kể từ `#pay-h`. 375×667 và 390×844: nút trả tiền đầu tiên và dòng Zelle không bị che.
- `?sent=1`: dòng trạng thái hiện, cờ bị xoá khỏi URL, không hứa số tiền nào.
- Dòng "After you pay, you come back to Purrlight." chỉ hiện khi mọi thẻ có redirect đang hiện đều `back: true`.

**Trang cảm ơn**
- **Có bản sao đơn:** lá thư có mã, món, số tiền. **Không có:** không ký tự `$` và không mã trong lá thư, có câu trung tính (3.1, dòng 5).
- **URL bẩn:** `thanks.html?st=Completed&amt=46.01&tx=TEST` → chữ giống hệt bản không tham số, URL bị xoá tham số, không có chữ "Completed" hay "46.01".
- **figcaption** có mặt, bắt đầu bằng "The video, in words:", chứa nguyên văn từng câu nói trong `cc` (trừ dòng trong ngoặc vuông). Mọi `<img>` trong `.scene` có `alt=""`.
- **Chỉ chạy khi thấy:** cảnh nằm dưới màn hình đầu → không có request tới `assets/video/` cho tới khi cuộn tới ≥50%; cuộn đi → video dừng.
- **360×640, 375×667, 844×390:** lúc video bắt đầu chạy, đáy ô phụ đề và nút Pause nằm trong màn hình.
- **Video:** `muted`, `playsinline`, `aria-hidden`, không `loop`. Pause → Play → Replay là **cùng 1 nút**, cao ≥44 px, focus còn sau khi video hết. Không "Sound on" khi `voice: false`. Phụ đề đúng chữ ở 2 s và 13 s, **vẫn hiện khi tạm dừng**.
- **Giảm chuyển động / Save-Data:** có ảnh tĩnh + nút "Play video"; **không request tới `assets/video/`** cho tới khi bấm. Bật giảm chuyển động giữa chừng → video dừng, ra ảnh tĩnh, không tự chạy lại.
- **`on: false`:** không có `.scene`, không request video, có ảnh Merlin thật, chữ và lá thư vẫn đủ.
- **Video 404:** ảnh tĩnh + "Video unavailable", không lỗi console, focus không mất. **Tab ẩn** → dừng, hiện lại → chạy tiếp.
- **Luật PayPal trên trang:** có email liên hệ và dòng chính sách cọc.
- **Chung:** CLS = 0, không cuộn ngang ở 360, 375, 390 và 1280. Mọi request cùng origin (kể cả follow strip).
- **In:** cảnh ẩn, lá thư được in. Lá thư dựng bằng `textContent`: chèn `<img onerror>` vào `pick` giả thì hiện ra thành chữ.
- **Từ cấm** trên `thanks.html`, lá thư và phụ đề.

### 6.3 `tools/check-site.js` (chặn deploy khi sai)
- Mỗi cách trong `PAY`: có dữ liệu ⇔ khối `data-pay` trong `index.html` **không** `hidden`, và `href` / handle / địa chỉ giống hệt.
- **Stripe:** host đúng `buy.stripe.com`; **chặn khi đường dẫn bắt đầu bằng `test_`** (link chế độ test có dạng `https://buy.stripe.com/test_…`, ví dụ ngay trong docs.stripe.com/payment-links/customize; regex `[A-Za-z0-9_]+` của v1 vẫn khớp dạng này).
- **PayPal:** kiểm theo **danh sách tên miền đúng tuyệt đối**: `www.paypal.com`, `paypal.me`, `www.paypal.me`. Không kiểm theo đuôi "paypal.com", vì `www.sandbox.paypal.com` vẫn lọt.
- **Square:** `square.link` (hoặc tên miền checkout của Square [cần kiểm tra khi chị tạo link mới]).
- Luôn `https`; không query chứa `email` hay `utm_`.
- **QR ngang hàng:** thẻ nào đang hiện có QR thì thẻ PayPal và Venmo (nếu đang hiện) cũng phải có QR.
- `MERLIN_SCENE.on` là `true` thì phải có `approved` dạng ngày, và đủ 8 file.
- `thanks.html` có `noindex`. `thanks.js` không chứa chuỗi `location.search`.

### 6.4 Thử thật (sau Đợt 1 và mỗi lần thêm một cách)

- **Gửi form thật 2 lần:** trước và sau khi đổi link chuyển hướng Tally. Xong thì xoá bài gửi [kế hoạch 20/10 §4.1]. **Lần đầu tiên, xem email báo đơn của Tally có hiện trường ẩn `pick` (có mã đơn) không** [cần kiểm tra]. Không có thì chị không khớp được mã, phải tìm cách khác trước khi dựa vào mã.
- **Stripe: KHÔNG trả thật.** Stripe ghi *"The Stripe Services Agreement prohibits testing in live mode using real payment method details"* (https://docs.stripe.com/testing) [đã đọc 21/10]. Bỏ việc "nhờ người nhà trả $1" của v1.
  - Chị tạo một link giống hệt trong **sandbox / test mode** (có `dashboard.stripe.com/test/payment-links/create`). Em trả bằng **thẻ test 4242 4242 4242 4242**, xem có về `thanks.html` không. $0.
  - Link sandbox khác link thật, nên chị chụp màn hình phần **"After the payment"** của link thật để em đối chiếu.
  - Dòng "Stripe có chế độ test… [cần kiểm tra]" của v1 nay **đã kiểm**, URL ở trên.
- **PayPal:** thử trước bằng **sandbox** ($0). Trang P1 ghi *"(Optional) PayPal sandbox account to test the payment link before using it in production"* [đã đọc 21/10]. Rồi **1 lần trả thật $1** với link thật trước khi đặt `back: true`. PayPal cho phép: *"Use a low-value transaction if testing in live mode"* (P1) [đã đọc 21/10] [Chú thích 2]. Thử thêm 2 lần trả cùng một nhãn Invoice ID xem có bị chặn không [cần kiểm tra].
- **Square:** 1 lần trả thật **$1** (Square có luật thử riêng không: [cần kiểm tra]), từ điện thoại (Safari + Chrome, và một lần trong app Instagram). Xem có về `thanks.html` không, rồi hoàn tiền.
- **Mỗi lần trả thật:** số tiền bị trừ **đúng bằng số đã gõ**, không có dòng thuế, tip hay phí nào hãng tự thêm (mục 9.8).
- **Phí mỗi lần thử $1** [tính toán theo bảng phí công bố]: Square Free $0,33 · PayPal ví $0,52 (3,49% + $0,49) · Venmo business $0,12 (chỉ khi chị muốn xem tên khách thấy) · Stripe $0 (chỉ sandbox) · Zelle $0.
  - PayPal **không trả lại phí** khi hoàn tiền: *"the fees you originally paid to receive the payment are not returned"* (https://www.paypal.com/us/business/paypal-business-fees, cập nhật 01/10/2026) [Hải Đăng đã đọc 21/10].
  - Square và Venmo có trả lại phí khi hoàn tiền không: [cần kiểm tra].
- Kiểm `sessionStorage` còn sau khi đi Stripe/Square/PayPal rồi quay về cùng tab [cần kiểm tra].

---

## 7. Việc chị cần làm (mỗi hãng là một việc độc lập)

**Không hãng nào chặn Đợt 1.** Mỗi hãng làm hay bỏ tuỳ chị. Chỉ việc 6 (Tally) và 7 (duyệt chữ, xem trước) cần cho Đợt 1.

URL trang cảm ơn để dán vào các hãng (có sau Đợt 1):
`https://elisehanhnguyenus-cloud.github.io/purrlight-skills/custom-orders/thanks.html`
Không thêm gì vào URL này. Khi chuyển sang tên miền purrlight.studio thì phải sửa lại ở 3 hãng (ghi trong "Sổ tài khoản & khoá").

| # | Việc | Bấm ở đâu | Giờ của chị [ước tính] |
|---|---|---|---|
| 1 | **PayPal**: xác nhận tài khoản là **business** (Payment Links bắt buộc business [A P1]). **Đọc luật "không khuyên dùng cách khác" trước khi bật** (câu 2). Tạo link rồi gửi em | **Pay & Get Paid → Create Payment Links and Buttons** → **Customer-set price** → bật **Label for Invoice ID**, nhãn "Order code (like K7HM-D)", **không** đặt bắt buộc → tab **Checkout**: để trống thuế và phí → tab **Confirmation → Auto-return** → dán URL trên → **Build it** → copy link + QR [A P1, P3]. Thử sandbox, rồi $1 thật (6.4) | 30–45 phút |
| 2 | **Venmo**: mở **business profile** [A V2, V5]. Gửi em **@username**, ảnh **QR không đặt giá**, và link lấy bằng nút **Share** | Business profile → **Charge → QR Code → Venmo Me** [A V6]. Đường mở business profile trong app [cần kiểm tra] | 15–20 phút |
| 3 | **Stripe**: mở/kích hoạt tài khoản cho Purrlight Studio LLC. Tạo link rồi gửi em `buy.stripe.com/…` | **Payment Links → New → Customers choose what to pay** → **min = số em gửi** (mức cọc nhỏ nhất, mục 2.3), max → custom field **Text** "Order code or your name" → **After the payment → Confirmation page →** redirect tới URL trên [A S1, S2, S4]. Thêm: **(a)** **Settings → Payment methods**: xem cách nào đang bật. Stripe ghi *"Stripe enables certain payment methods for you by default. We might also enable additional payment methods after notifying you"* và *"bank debits … might take between 2 and 14 days to confirm the payment"* (https://docs.stripe.com/payment-links/create) [đã đọc 21/10]. Với khoản cọc, **tắt bank debit và trả góp**. **(b)** **"Collect tax automatically" để TẮT** (cọc đã gồm thuế). **(c)** **Statement descriptor** (Settings → Business details) đúng tên khách thấy trên trang: 5–22 ký tự, theo tên DBA; Stripe ghi *"clear and accurate statement descriptors can reduce chargebacks and disputes"* (https://docs.stripe.com/get-started/account/statement-descriptors) [Hải Đăng đã đọc 21/10]. **(d)** Bật biên nhận: **Settings → Business → Customer emails → Successful payments** [A S7], và email báo cho chị (9.9). Rồi tạo **link sandbox giống hệt** để thử (6.4) | 45–60 phút (chưa tính thời gian Stripe duyệt tài khoản) |
| 4 | **Square**: **trước hết thử thuế** (Chị gửi em, việc 1). Rồi thêm redirect cho link đang có (hoặc tạo link mới có redirect). Báo em link có đổi không (đổi thì em làm lại ảnh QR) | **Payments & orders → Payment links →** sửa link (hoặc **Create link**) → bật **Redirect to a website after checkout** → dán URL [A Q1]. **Payment links → Settings → General**: bật **Enable customer notes**; xem mục **Tipping** (tắt nếu có công tắc tắt [cần kiểm tra]); bật **Email notifications**; ở **Payments** bật Apple Pay / Google Pay / Cash App Pay [A Q2, đọc lại 21/10]. Không có service charge nào trên link "Collect a payment". **Không đổi cài đặt thuế chung** (mục 9.8). Xem gói phí ở **Settings → Account & Settings → Pricing & subscriptions** [A Q3] | 15–20 phút |
| 5 | **Zelle**: cho em biết ngân hàng nào, tài khoản business hay cá nhân, và **tên người nhận khách sẽ thấy** trong app | App ngân hàng → Zelle → hồ sơ | 5 phút |
| 6 | **Tally**: đổi link chuyển hướng. Gửi thử 2 lần như 6.4 | Form M1KOkY → **Settings → Redirect on completion** → `…/custom-orders/?sent=1#pay`. **Không chèn @mention nào** [B §3.3] | 15 phút |
| 7 | **Duyệt** chữ tiếng Anh và bản xem trước hình tạm | Trang xem trước em gửi | 30 phút |
| 8 | **Đối soát**: bật email báo tiền ở từng hãng, 1 bộ lọc Gmail, 1 sổ (mục 9.9) | Như 9.9 | 20–30 phút |
| 9 | **Sổ tài khoản & khoá** (sản phẩm của Admin P0): mỗi cách trả ghi 1 dòng (dưới bảng) | Sổ của Admin P0 | ~5 phút mỗi cách |

**Tổng giờ của chị** [ước tính]:
- Đợt 1 (Square + Zelle + Tally + duyệt + đối soát + sổ): **~1,5–2 giờ**.
- Thêm PayPal, Venmo, Stripe và các lần thử: **~2,5–3,5 giờ** nữa.
- **Hằng ngày:** mỗi đơn có thể phải mở **tới 5 app** để đối chiếu. Mỗi khoản tiền vào mất khoảng **1 phút** khi có mã [ước tính].

**Sổ tài khoản & khoá: mỗi cách trả 1 dòng**
- Tài khoản đứng tên ai (Purrlight Studio LLC hay cá nhân chị). Venmo business profile gắn vào tài khoản cá nhân, không có đăng nhập riêng [A V5].
- Tiền về ngân hàng nào.
- Đã bật xác thực 2 lớp (2FA) chưa.
- Ai bấm hoàn tiền.
- URL trả về đang đặt ở hãng nào (Stripe, Square, PayPal: 3 chỗ phải sửa khi đổi tên miền).
- Cờ `MERLIN_SCENE.on` và ai tắt khi chị vắng.
- **Không khoá API hay secret nào vào repo public.** Repo chỉ có link, handle, địa chỉ vốn đã công khai.

---

## 8. Chi phí

**Phí cho cọc $45** [tính toán theo bảng phí công bố, A]:

| Cách | Mức phí | Cọc $45 | Ghi chú |
|---|---|---|---|
| Zelle | Thường $0, tuỳ ngân hàng với tài khoản business [A Z1, Z3] | ~$0 | Tiền **không rút lại được** khi đã gửi [A Z1] |
| Venmo business profile | 1,9% + $0,10 [A V1] | ~$0.96 | Hồ sơ cá nhân nhận khoản đánh dấu mua hàng: 2,99% (~$1.35) |
| Stripe | 2,9% + 30¢; thẻ nước ngoài +1,5% [A S6] | ~$1.61 | Tranh chấp **$15**/vụ [A S6] |
| Square | Free 3,3% + 30¢ · Plus/Premium 2,9% + 30¢; Afterpay 6% + 30¢ [A Q3] | ~$1.79 / ~$1.61; Afterpay $3.00 | Afterpay là cài đặt chung. Có thể đặt **"Afterpay eligibility range"** cao hơn mức cọc thường gặp [A Q2] |
| PayPal Payment Link | Thẻ/Apple Pay 2,99% + $0,49 · Ví/Venmo/guest 3,49% + $0,49 · Pay Later 4,99% + $0,49 [A P5] | **~$1.84–2.74** | Hoàn tiền thì **mất phí** [A P5] |
| PayPal.me (nếu chọn) | Goods & Services 2,99% [A P5] | ~$1.35 | Không quay về trang được |

**Phí cho cả đơn $90** = cọc $45 + phần còn lại $45. Mỗi lần trả mất một khoản phí cố định, nên chia 2 lần thì phí cố định tính 2 lần [tính toán]:

| Cách | Cả đơn (2 lần) | % của $90 |
|---|---|---|
| Zelle | $0 | 0% |
| Venmo business | $1.91 | 2,1% |
| Stripe | $3.21 | 3,6% (trả 1 lần $90 chỉ mất $2.91) |
| Square Free | $3.57 | 4,0% |
| PayPal thẻ | $3.67 | 4,1% |
| PayPal ví | $4.12 | 4,6% |
| PayPal Pay Later | $5.47 | 6,1% |

**Hoàn cọc:** cọc *"refundable until work begins"* (`index.html:628`) [repo]. Mỗi lần hoàn cọc $45 chị có thể mất phí đã trả: khoảng $1,6–2,1 với Stripe và PayPal [tính toán] (PayPal chắc chắn mất [P5]; Stripe theo A S6). Không cần đổi chính sách, chỉ để chị biết.

**Khác:**
- Thử thật: Square $0,33 + PayPal $0,52 ≈ **$0,85** một lần cho cả hai [tính toán]. Stripe thử bằng sandbox, $0.
- Tally Pro chỉ khi chọn email bản sao A: $29/tháng hoặc $290/năm.
- GitHub Pages, trang cảm ơn, lá thư, mã đơn: $0. Link Stripe có tên miền riêng $10/tháng, **không cần** [A S6].
- **Công của em:** Đợt 1 khoảng **1,5–2 ngày**, gồm test, hình tạm (≤ nửa ngày) và hồ sơ giao agent [ước tính].
- **Giờ của chị:** xem mục 7.

---

## 9. Rủi ro và luật

1. **Ai cũng mở được `thanks.html`**, ai cũng chụp màn hình được.
   - Trang chỉ nói điều chắc chắn đúng, và không bao giờ đọc URL (3.4).
   - **Chỉ bắt đầu làm khi giao dịch ở trạng thái hoàn tất trong app của hãng**, KHÔNG phải pending, "Processing" hay đang bị giữ. Với Stripe: chỉ khi **Payments** ghi **Succeeded**. Stripe vẫn chuyển khách về `thanks.html` ngay cả khi tiền chưa về (bank debit có thể mất 2–14 ngày, mục 7 việc 3). PayPal có thể giữ tiền: *"If PayPal determines, in its sole discretion, that a transaction is high-risk, we place a hold on the payment and provide notice to you to delay shipping of the item"* (User Agreement, P10) [đã đọc 21/10].
   - **Không bao giờ dựa vào ảnh chụp màn hình** khách gửi.
   - Muốn biết chắc tự động thì phải có webhook + server [A S2, S3], site tĩnh không có.
2. **Chargeback và hoàn tiền:**
   - Square: ngân hàng phát hành thẻ quyết định [A Q5]. Stripe: phí $15/vụ [A S6].
   - Giữ bằng chứng: bài gửi Tally, tin nhắn mockup và khách duyệt, ảnh sản phẩm xong, mã vận chuyển.
   - **Luật hoàn tiền:** chỉ hoàn **qua đúng cách khách đã trả, cho đúng người đã gửi**. Không bao giờ chuyển "phần trả dư" sang tài khoản hay cách khác (kiểu lừa trả dư hay gặp với Zelle/Venmo).
3. **Bảo vệ người mua:**
   - PayPal và Venmo **loại trừ** khiếu nại "không đúng mô tả" với hàng làm riêng [A P9, V2] (nguyên văn Venmo User Agreement đã đối chiếu, `dl/verify/venmo-ua.html`). Loại khiếu nại khác có thể vẫn mở được [cần kiểm tra].
   - Zelle **không có** bảo vệ nào [A Z2].
   - Không đưa câu nào về "bảo vệ" lên trang.
4. **Venmo tài khoản cá nhân:** không được dùng cho kinh doanh, trừ khi giao dịch được đánh dấu mua hàng hoặc gửi tới business profile [A V2]. → **Business profile.**
5. **Tiền của LLC:**
   - Business profile Venmo gắn vào **tài khoản cá nhân** của chị [A V5].
   - Email Zelle đang gắn với tài khoản nào thì chưa biết.
   - Tiền của Purrlight Studio LLC nên về **tài khoản ngân hàng của LLC**, sổ sách tách riêng. Hỏi kế toán về cách ghi và giấy tờ thuế của từng hãng [cần hỏi kế toán].
   - PayPal: hoạt động kinh doanh thì *"required to open a business account"* [A P10].
6. **Luật trình bày** (khi đã có PayPal hoặc Venmo trên trang):
   - **PayPal/Venmo ngang hàng hoặc trước**, không phụ phí, không "exhibit a preference" [P10, nguyên văn ở 2.1].
   - **Không khuyên khách dùng cách khác** *"within all of your points of sale"*, và hiện mark PayPal/Venmo *"at least as prominently"* trong *"marketing materials, advertising, and other customer communications"* [P10]. Áp cho: mẫu tin nhắn CSKH, email C, bài Instagram, mọi danh sách "cách trả". Không câu nào kiểu "Zelle cho đỡ phí". Biển booth và danh sách `payMethods` của Event Desk (`event-desk.js:40`: Cash, Card (Square), Zelle, Other) có bị tính không: [cần kiểm tra] trước khi in biển mới.
   - **Phải công bố thông tin liên hệ:** *"You must publish customer service information with clear instructions on how your customers can contact you"*, ít nhất *"one active customer service email address…"* [P10] → `purrlightstudiollc@gmail.com` hiện rõ ở #pay và trên `thanks.html`.
   - **Phải công bố chính sách hoàn trả:** *"You must publish a refunds and returns policy"* [P10] → dòng chính sách cọc có cả ở #pay lẫn `thanks.html`.
   - **Chính sách riêng tư:** *"You must publish a privacy policy, where required by law"* [P10]. Site hiện **không có trang privacy nào** [repo], trong khi form Tally thu tên, email, địa chỉ, điện thoại. Luật có đòi không: [cần kiểm tra; hỏi người chuyên].
   - **QR ngang hàng:** thẻ nào có QR thì thẻ PayPal và Venmo cũng có (check-site.js).
   - Zelle: chỉ chữ thường, không logo, có dòng VIẾT HOA [A Z4]. Venmo: không chèn logo vào câu [A V9]. Stripe: không gắn ™/® [A S8]. Square: chỉ dùng mark ở phần thanh toán [A Q6].
7. **Etsy và FTC:**
   - Khách của trang này đến từ Linktree, Instagram và booth, không phải giao dịch Etsy.
   - Chính sách cần đọc: **Off-Platform Transactions Policy**, https://www.etsy.com/legal/policy/off-platform-transactions-policy/1254654515806 (thay link `legal/fees` của v1). Theo đoạn tóm tắt kết quả tìm kiếm, chính sách này cấm yêu cầu trả tiền ngoài Etsy, cấm đưa liên hệ ra ngoài để hoàn tất giao dịch, và cấm khuyến khích mua ngoài Etsy. Trang chặn công cụ đọc (403) [cần kiểm tra nguyên văn].
   - **Luật vận hành cho tới khi kiểm xong:** không đưa link Custom Orders, link trả tiền hay email Zelle vào **tin nhắn Etsy, listing, thông báo shop, hay thiệp/QR bỏ trong gói hàng Etsy**. Ý "thẻ QR trong gói hàng Etsy" ở kế hoạch 20/10 (dòng 576, 625) cũng dừng ở đây.
   - FTC: bước trả cọc không đổi các dòng "Ships within…", trang cảm ơn không hứa thời gian. Em **không thấy** luật FTC mới nào gắn với bước này; đây là nhận định, chưa tra riêng.
8. **Thuế bán hàng** (ý chị 21/10: giá web phải cộng thuế; booth vẫn mặc định cộng thuế):
   - Cọc đã gồm thuế từ `prices.js`. Không hãng nào được cộng thêm.
   - **PayPal:** tab Checkout để trống thuế. **Stripe:** "Collect tax automatically" TẮT.
   - **Square:** trang help ghi *"You can set up sales taxes from your sales tax settings and they will automatically apply to your payment links"* (https://squareup.com/help/us/en/article/8364-customize-square-payment-links) [đọc lại 21/10]. Cùng trang có **Tipping**, và *"The service charges listed only apply to Collect a payment and Accept a donation payment links"*. Booth đang nhận "Card (Square)" (`event-desk.js:40`) [repo], nên tài khoản Square của chị rất có thể đã cài thuế 8,25% [cần kiểm tra].
     - **Bước thử:** mở https://square.link/u/UUg2LtbP, gõ 45. Phải ghi đúng **$45.00**: không dòng thuế, không màn hình tip, không service charge.
     - Nếu Square tự cộng thuế: khách trả 45 × 1,0825 = **$48.71**, thu thừa **$3.71** tiền thuế [tính toán]. Link này đang chạy trên web hôm nay, nên đây là việc gấp.
     - **Gặp trường hợp đó:** **không đổi cài đặt thuế chung** của tài khoản (booth dùng chung, và chị muốn booth vẫn cộng thuế). Em để trống `PAY.square.url` (thẻ Square ẩn, 1 dòng) cho tới khi tìm được cách tắt thuế **chỉ cho link** mà không đụng booth, ví dụ hỏi Square Support [cần kiểm tra] [Chú thích 1].
     - **Booth:** Event Desk đã cộng 8,25% trước khi chị gõ số vào Square [repo `event-desk.js:37`]. Nếu cài đặt thuế của Square cũng tự cộng lên số gõ tay thì booth cũng có thể đang tính 2 lần. Lần bán booth tới, chị nhìn màn hình Square xem có thêm dòng thuế không [cần kiểm tra].
9. **Đối soát** (thay câu "đối chiếu với email Tally" của v1):
   - **(a) Bật email báo mỗi khoản tiền** về Gmail studio:
     - Stripe: Personal details → nhận email cho mọi khoản thành công (https://docs.stripe.com/payment-links/post-payment) [Hải Đăng đã đọc 21/10].
     - Square: **Payment links → Settings → General → Email notifications** [Q2, đọc lại 21/10].
     - PayPal, Venmo, Zelle: [cần kiểm tra đường bấm].
   - **(b) Một bộ lọc Gmail** gom tất cả vào nhãn **"Deposits"**.
   - **(c) Một sổ** (Sheet hoặc Notion), mỗi đơn một dòng. Cột: mã · ngày gửi Tally · tên · món · ước tính · cọc dự kiến · kênh · số nhận · phí · thực nhận · ngày nhận · trạng thái (Succeeded hay Processing) · phần còn lại dự kiến · phần còn lại đã nhận · tiền thuế (lấy từ dòng pick).
   - Chỉ số "tỷ lệ yêu cầu có cọc trong 48 giờ" (mục 5.2) đếm từ đúng sổ này.
   - Khách gõ sai số tiền (Square, PayPal link, Venmo, Zelle): chị so với cọc dự kiến trong sổ, rồi nhắn khách phần chênh.
   - Công của chị khoảng **1 phút mỗi khoản** [ước tính].
10. **Trình duyệt trong app:** Apple Pay của Square chỉ hiện trên Safari [A Q2]. Redirect trong app Instagram [cần kiểm tra ở 6.4].
11. **Riêng tư:** không PII trên mọi URL. Mã đơn không phải PII. Custom field của Stripe ghi rõ không dùng để thu dữ liệu nhạy cảm [A S1], nên ô chỉ hỏi "Order code or your name".
12. **Hình tạm lên web thật** (câu 14): vì đóng băng, nếu bật hình tạm thì nó có thể **nằm trên web suốt mùa cao điểm 15/11–02/01 mà không thay được** (trừ ngoại lệ "chỉ thay asset"). Và một trang sẽ có **2 Merlin**: ảnh thật ở hero, Merlin hoạt hình ở trang cảm ơn. Vì vậy mặc định `on: false`. Tắt lại bất cứ lúc nào: `MERLIN_SCENE.on = false`, 1 dòng.

---

## 10. Câu hỏi cho chị (câu nào cũng có mặc định)

**Tiền và tài khoản**
1. **Giữ cả Square lẫn Stripe?** Mặc định: **cả hai**, theo đúng danh sách của chị, chữ nút khác nhau ("with Stripe" / "with Square"). Lưu ý: hai Dashboard là hai lần đối soát, hai bộ giấy tờ thuế. Sau này nếu Stripe chạy tốt (điền sẵn số cọc, về thẳng trang) thì có thể cho Stripe thay Square trên web, Square để cho booth.
2. **Luật PayPal:** khi đã nhận PayPal, chị **không được khuyên khách dùng Zelle (hay cách nào khác) ở bất cứ đâu**: trang web, DM, email, bài Instagram, và có thể cả biển booth [cần kiểm tra]. Biết vậy chị vẫn muốn thêm PayPal không? Mặc định: **vẫn thêm**, đúng danh sách của chị. **Payment Link hay PayPal.me?** Mặc định: **Payment Link** (về được trang cảm ơn, có sẵn thẻ, Apple Pay, Venmo).
3. **Mã đơn và sổ đối soát:** chị đồng ý in mã ngắn (ví dụ K7HM) trên trang để khách ghi vào ô ghi chú, và dùng 1 sổ không? Mặc định: **có**.
4. **Phần còn lại:** mặc định chị nhắn khách trả qua **cùng cách đã trả cọc**, ghi mã + "-B". Có muốn tạo link riêng "Custom order balance" ở Stripe/Square không? Mặc định: **chưa**.
5. **Mỗi đơn mở tới 5 app để đối chiếu**, chị chịu được không? Hay bắt đầu gọn hơn với **Square + Zelle + 1 link PayPal** (link PayPal đã gồm Venmo, thẻ, Apple Pay [P2])? Mặc định: **code giữ đủ 5 chỗ**, chị điền link hãng nào thì hãng đó hiện. Venmo đi qua link PayPal đắt hơn Venmo business profile (~$2.06 so với ~$0.96 trên cọc $45) [tính toán], nên vẫn khuyên giữ thẻ Venmo riêng nếu chị mở business profile.
6. **Ngoại lệ đóng băng:** link hãng nào chị gửi sau khoảng 05/11 thì chờ tới tháng 1, hay chị duyệt bằng văn bản ngoại lệ "PR chỉ điền dữ liệu"? Câu này cũng áp cho video thật ("chỉ thay asset"). Mặc định: **chờ tới tháng 1**.

**Lá thư và email**
7. **Lá thư chị gọi là "thư xác nhận order" sẽ được ghi trên trang là "Your order copy". Thư xác nhận thật là email chị gửi sau khi thấy cọc. Chị đồng ý không?** Mặc định: **đồng ý** (trang không biết khách đã trả hay chưa, nên không được dùng chữ "confirmed").
8. **Khách có cần một EMAIL thật ngay lúc gửi form không?** Cách đó cần Tally Pro, $29/tháng hoặc $290/năm. Mặc định: **không**; dùng lá thư trên trang + email chị tự gửi theo mẫu cố định.

**Cảnh Merlin**
9. **Hộp mail đặt ở đâu:** dưới sàn cạnh chân bàn (để Merlin "thảy xuống" ngay lúc nhảy xuống), hay trên bàn? Mặc định: **dưới sàn**.
10. **Tờ giấy thứ 2 là bản cho chị phải không?** Mặc định: Merlin ngậm tờ 2 theo tới cửa rồi đặt dưới chân lúc gọi chị.
11. **Câu gọi cửa:** mặc định **"Mommy, you have a new order!"** (số ít: mỗi khách đặt 1 đơn, và giọng nói không đọc được "(s)") · hoặc "new orders" · hoặc "Mama Purr, …" [C §5].
12. **Câu mô tả ghi "to the door" hay "to Elise's door"?** Trang Custom Orders hiện không nhắc tên chị lần nào [repo]; trang About tách phần chị ký "Elise" và phần "Mama Purr & Papa Purr". Mặc định: **"to the door"**.
13. **Kiểu Merlin trong video thật:** mặc định **giống Merlin thật** ở video hero · hoặc Merlin storybook có beret, yếm, balo [C §5].
14. **Bật hình tạm trên web thật?** Nếu bật, hình tạm có thể nằm trên web **suốt mùa cao điểm 15/11–02/01** mà không thay được, và một trang có **2 Merlin** (ảnh thật ở hero, Merlin hoạt hình ở trang cảm ơn). Hai lựa chọn: **(A)** bật hình tạm sau khi chị duyệt bản xem trước; **(B)** trên web thật chỉ hiện chữ + lá thư + ảnh Merlin thật, cho tới khi chị duyệt video thật. Mặc định: **(B)**. Chuyển sang (A) chỉ khi chị xác nhận lại sau khi đọc hệ quả này.
15. **Giọng Merlin** trong video hero ("Christmas is coming very close now…") làm từ đâu? Agent làm video có làm lại đúng giọng đó được không, chị còn file giọng gốc không? (câu này có ở `scene.md` §7 câu 4 nhưng bị rơi khỏi v1). Mặc định: **cùng giọng** nếu được.

**Chữ và pháp lý**
16. **"We check every deposit by hand"** (và "we match every payment by hand") có đúng cách chị làm không? **Không có mặc định**: câu chỉ lên web khi chị duyệt.
17. **Dòng trạng thái sau khi gửi form:** A *"Got it — Merlin noted your order…"* hay B *"Got it — your order form is in…"* (mục 3.1)? Mặc định: **A** (đã có trong kế hoạch 20/10).
18. **Dòng Zelle "used with permission":** mặc định **chưa đưa lên**, cho tới khi ngân hàng hoặc Zelle xác nhận. Dòng VIẾT HOA bắt buộc thì đưa lên ngay.
19. **Đổi link chuyển hướng Tally sang `?sent=1#pay`?** Mặc định: **có**.
20. **Afterpay cho khoản cọc** (Square, 6% + 30¢)? Mặc định: em không đổi gì; chị có thể đặt "Afterpay eligibility range" cao hơn mức cọc thường gặp [A Q2].
21. **Trang privacy:** site chưa có, form Tally thu tên/email/địa chỉ/điện thoại, và PayPal đòi *"privacy policy, where required by law"*. Chị có muốn hỏi người chuyên (luật sư/kế toán) không? Mặc định: **hỏi trước khi bật PayPal**.

---

## 11. Nguồn

**Nghiên cứu trong thư mục này:** `providers.md` (A), `tally.md` (B), `scene.md` (C). Bản tải về để đối chiếu nguyên văn: `dl/verify/pp-ua.html` (PayPal User Agreement 14/09/2026), `dl/verify/venmo-ua.html` (Venmo User Agreement; không có điều khoản "on par" riêng), `dl/prue/` (Stripe testing, card testing, create; PayPal create, overview).

- **Stripe:**
  - S1 https://docs.stripe.com/payment-links/customize
  - S2 https://docs.stripe.com/payment-links/post-payment
  - S3 https://docs.stripe.com/payment-links/url-parameters
  - S4 https://docs.stripe.com/payment-links/create
  - S6 https://stripe.com/pricing
  - S7 https://docs.stripe.com/receipts
  - S8 https://stripe.com/marks/legal
  - Testing (cấm thử live bằng thẻ thật; thẻ 4242): https://docs.stripe.com/testing
  - Card testing: https://docs.stripe.com/disputes/prevention/card-testing
  - Statement descriptors: https://docs.stripe.com/get-started/account/statement-descriptors
- **Square:**
  - Q1 https://squareup.com/help/us/en/article/6692-create-and-manage-payment-links
  - Q2 https://squareup.com/help/us/en/article/8364-customize-square-payment-links (thuế, tip, service charge, Afterpay, email notifications, customer notes; đọc lại 21/10)
  - Q3 https://squareup.com/help/us/en/article/5068-what-are-square-s-fees
  - Q5 https://squareup.com/help/us/en/article/3882-payment-disputes-walkthrough
  - Q6 https://developer.squareup.com/tos/trademark
- **PayPal:**
  - P1 https://developer.paypal.com/payment-links-buttons/create-payment-link
  - P2 https://developer.paypal.com/payment-links-buttons/overview
  - P3 https://www.paypal.com/us/cshelp/article/how-do-i-create-a-pay-link-and-button-help262
  - P4 https://www.paypal.com/us/cshelp/article/what-is-paypalme-help432
  - P5 https://www.paypal.com/us/business/paypal-business-fees
  - P9 https://www.paypal.com/us/cshelp/article/does-paypal-cover-my-purchase-if-theres-a-problem-help364
  - P10 https://www.paypal.com/us/legalhub/paypal/useragreement-full
  - Block accidental payments: https://paypal.com/us/cshelp/article/how-do-i-block-duplicate-payments-in-virtual-terminal-ts2235
- **Venmo:**
  - V1 https://venmo.com/resources/our-fees/
  - V2 https://venmo.com/legal/us-user-agreement/
  - V5 https://help.venmo.com/hc/en-us/articles/360043677373-Business-Profiles-FAQ
  - V6 https://help.venmo.com/hc/en-us/articles/360057614353-QR-codes-for-Business-Profiles-
  - V9 https://venmo.com/about/brand
  - V10 https://venmo.com/paymentlinks
- **Zelle:** Z1 https://www.zelle.com/faq · Z2 https://www.zelle.com/security · Z3 https://www.zelle.com/faq/im-small-business-using-zelle · Z4 https://www.zelle.com/zelle-trademark-guidelines
- **Tally:** https://tally.so/help/respondent-email-notifications · https://tally.so/help/tally-pro · https://tally.so/help/redirect-on-completion · https://developers.tally.so/widgets/popups
- **Etsy** (chưa đọc được nguyên văn, xem 9.7): https://www.etsy.com/legal/policy/off-platform-transactions-policy/1254654515806
- **Trợ năng:** WCAG 1.2.5 https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html; các mục 2.2.2, 1.2.2, 1.2.3, 1.4.2, 2.3.1 và MDN như danh sách cuối `scene.md`.

**Repo:**
- `website/custom-orders/custom-orders.js`: 56-89 (link đặt hàng, trường ẩn); 126 (`href === tallyHref`); 141 (`onClose`); 142-149 (`onSubmit`); 456, 470 (lời nhắn thiệp, `pickText`); 787-829 (phần cọc); 1378 (`HERO_CC`); 1461 (chuyển tab); 1482-1486 (IntersectionObserver của hero).
- `prices.js:116-119` (`PAY`), `313` (`readyMade`), `362-371` (thuế, cọc).
- `index.html:441, 447, 456` (hàng có sẵn), `599-601` (How it works), `607-631` (`#pay`), `628` (chính sách cọc).
- `custom-orders.css:440-458` (phần cọc, QR ẩn trên điện thoại).
- `confirm.html:8` (`noindex`), `57-58, 108` (follow strip); `content/follow.json` (Instagram).
- `js/event-desk.js:37-40` (thuế booth "added", `payMethods`).
- `website/README.md:290` (`PAY.squareUrl`, `PAY.zelleTo`).
- `docs/VILLAGE-WEBSITE-PLAN-2026-10-20.md`: §4.0–4.4, §7 (lịch, dòng 468 chỉ số), §8 (không đọc dữ liệu khách), dòng 576/625 (QR trong gói Etsy), chú thích [^1] (sao), [^2] (hạn).
- Test: `scratchpad/test-prices.js:138-139`, `scratchpad/test-studio.js:370, 445` (Tally giả ở 590-640).
- Khung mockup: `scratchpad/merlin/scene.svg` (viewBox 480×360, `clipPath`, `rx="28"`, `#EBDFCF`, `.b4`), `beats.png`.

---

## Chú thích

**Chú thích 1. Thuế trên link Square.** Hải Đăng: nếu Square tự cộng thuế thì *"tắt ở Payment links → Settings → General"*. Em đọc lại trang help đó ngày 21/10: trang chỉ ghi thuế lấy từ cài đặt thuế chung và *"will automatically apply to your payment links"*, không thấy công tắc thuế riêng cho link trong Settings → General. Còn chị nói (21/10) booth vẫn mặc định cộng thuế, mà booth dùng chung tài khoản Square. **Chọn:** thử trước; nếu có thuế thì **không đổi cài đặt thuế chung**, chỉ ẩn thẻ Square trên web (1 dòng) cho tới khi tìm được cách tắt thuế riêng cho link. Đây là cách **an toàn hơn** (không thu thừa của khách web, không làm hỏng thuế ở booth) và **rẻ hơn** (1 dòng, đảo lại được ngay).

**Chú thích 2. Thử PayPal.** Hải Đăng: thử redirect của PayPal bằng sandbox, miễn phí, chỉ Square trả thật. Prue: giữ 1 lần trả thật $1 cho PayPal. **Chọn: làm cả hai**, sandbox trước rồi $1 thật. Lý do: link sandbox khác link thật, mà dòng "After you pay, you come back to Purrlight" là một câu khẳng định trên trang. Chỉ link thật mới chứng minh được câu đó. Giá của độ an toàn này là $0,52 phí không được hoàn. Stripe thì không có lựa chọn này: luật Stripe cấm thử live bằng thẻ thật, nên Stripe dùng sandbox + ảnh chụp cài đặt của link thật.

**Chú thích 3. Thảy thư và nhảy xuống.** v1 và nghiên cứu C: làm lần lượt, sát nhau (~0,2 s), vì Brand Book ghi "một chuyển động một khung". Linh: một động tác mềm duy nhất (thảy trong lúc nhảy). **Chọn: cách của Linh.** Nó giữ đúng lời chị ("đồng thời"), mà vẫn là một chuyển động, không nảy, nên không phạm luật Brand Book. Vẫn hỏi chị ở câu 9 và 10, và hồ sơ giao agent chưa khoá bố cục khi chị chưa trả lời.

**Chú thích 4. Giảm chuyển động.** Kế hoạch 20/10 và video hero: bật giảm chuyển động thì không có nút Play. v1 thì lệch nhau giữa lúc bật sẵn (không nút) và lúc bật giữa chừng (có nút). Linh: luôn có ảnh tĩnh + nút "Play video", video chỉ tải khi khách tự bấm. **Chọn: cách của Linh, chỉ cho cảnh này.** Lý do: cảnh này là phần chị muốn mọi khách được xem, không phải trang trí như video hero. Không có gì tự chuyển động; khách tự chọn xem. Và câu mô tả bằng chữ đầy đủ vẫn có sẵn. Video hero giữ nguyên.

**Chú thích 5. Bật cảnh với hình tạm.** v1: mặc định bật, vì chị đã duyệt tạm (chị duyệt *cách làm* hình mockup ngày 21/10). Linh: phải qua cổng duyệt bản xem trước các tư thế mới. Prue: chỉ bật khi chị xác nhận lại sau khi biết hình tạm có thể nằm suốt mùa lễ. **Chọn: `on: false` cho tới khi có cả hai** (duyệt bản xem trước + chị chọn A ở câu 14). An toàn hơn, và rẻ: trang vẫn có chữ, lá thư và ảnh Merlin thật.

**Chú thích 6. Email xác nhận.** v1: AI tạo bản nháp trong Gmail studio. Prue: muốn điền tên, số cọc, món thì AI phải đọc email báo đơn của Tally (tên, email, địa chỉ, điện thoại), mà kế hoạch 20/10 §8 đã cấm. **Chọn: mẫu cố định, chị tự điền, tự gửi.** An toàn hơn về dữ liệu khách; $0. Cho AI soạn từ hộp thư là quyết định riêng.

**Chú thích 7. Thứ tự trên điện thoại và figcaption.** Linh muốn thứ tự H1 → cảnh → phụ đề + nút → dòng sự thật → figcaption → hộp mail, và muốn câu mô tả là `<figcaption>` của `<figure class="scene">`. Hai ý này chỉ cùng đúng khi dòng sự thật nằm **bên trong** `<figure>`, ngay trên figcaption. **Chọn: đặt như vậy**, thay vì dùng CSS `order` để đảo vị trí (đảo bằng CSS làm thứ tự nhìn khác thứ tự đọc, WCAG 1.3.2). Không tốn thêm gì.

**Chú thích 8. Năm cách hay ba cách.** Prue gợi ý bắt đầu gọn với Square + Zelle + PayPal. Chị đã liệt kê đủ 5 cách (Zelle, Venmo, Square, Stripe, PayPal), và lời chị là chuẩn. **Chọn: code giữ đủ 5 chỗ**, mỗi hãng độc lập, điền link nào hiện cách đó. Gợi ý của Prue nằm ở câu 5 để chị tự quyết.

**Chú thích 9. Độ dài mã.** Hải Đăng: 4–5 ký tự. **Chọn: 4**, vì khách gõ ít hơn. Với 160.000 mã, 100 đơn thì xác suất có 2 đơn trùng mã khoảng 3% [tính toán, n²/2N]. Trùng thì chị khớp thêm bằng tên và món, sổ báo trùng. Quá ~200 đơn thì đổi lên 5 ký tự (1 dòng).

**Chú thích 10. Mức tối thiểu của link Stripe.** v1: gợi ý $1. Prue: bằng mức cọc nhỏ nhất. **Chọn: mức cọc nhỏ nhất**, vì sàn $1 mời kẻ gian thử thẻ (Stripe card testing). Mức này phải **≤** mọi cọc trang tính ra, nếu không khách thật sẽ không trả được. Test kiểm điều đó.

**Chú thích 11. Câu khi không có bản sao đơn.** Hải Đăng (must-fix): một câu trung tính đúng cho 3 trường hợp. Prue (gợi ý): câu có điều kiện "If you haven't sent…". **Chọn: gộp cả hai** trong một câu. Không mâu thuẫn, chỉ ghép.

**Chú thích 12. Câu "we check every deposit by hand".** v1: hỏi chị với mặc định "đúng". Prue: đây là cam kết, chỉ lên web sau khi chị duyệt. **Chọn: không có mặc định**, câu chờ chị duyệt. An toàn hơn, không tốn gì.

**Chú thích 13. Số liệu của hội đồng em đã chỉnh khi kiểm lại repo:**
- Phép so `href === tallyHref` nay ở `custom-orders.js:126` (hội đồng ghi 131; code đã dịch dòng).
- `PAY.squareUrl`, `PAY.zelleTo` trong README nay ở dòng 290 (hội đồng ghi 268-289).
- Ô Instagram trong `content/follow.json` **đã có** link `https://www.instagram.com/vietdelight_us/` (Linh ghi còn trống; việc #47 đã xong).
- Phí thử $1 của PayPal ví là $0,52 (3,49% × 1 + $0,49 = $0,5249) [tính toán]; khoảng "$0,12–0,53" của Hải Đăng đổi thành từng số riêng ở 6.4.
- Khoảng phí cả đơn của PayPal thêm dòng Pay Later $5.47, cho khớp khoảng cọc ~$1.84–2.74 (đã gồm Pay Later).

---

## Biên bản hội đồng

### Hải Đăng — Ecommerce Executive

**Kết luận:** APPROVE_WITH_CHANGES (đồng ý, kèm sửa).

**Must-fix đã áp:**
1. Thuế Square có thể bị cộng 2 lần → bước thử $45 ở "Chị gửi em" 1, mục 7 việc 4, 6.4, 9.8. Cách xử lý khi có thuế đổi theo Chú thích 1.
2. Số cọc điền sẵn là số của đơn đã gửi → 2.1 (dòng "Your order — …"), 2.3, 2.4 (`payDeposit()`), test ở 6.2.
3. Mã đơn ngắn, ngẫu nhiên, không PII, ở đầu `pick`, hậu tố -D/-B, Invoice ID PayPal không bắt buộc → 2.2, 2.4, 3.3, 7 việc 1 và 3, test 6.1/6.2.
4. Quy trình đối soát (email báo tiền, bộ lọc Gmail, sổ có đủ cột, chỉ số 48 giờ) → 9.9, 5.2, mục 7 việc 8.
5. Đường trả phần còn lại (mặc định, câu trung tính, link "balance" tuỳ chọn) → mục 1, 3.1 dòng 5, câu 4.
6. Cài đặt Stripe (payment methods, chỉ làm khi Succeeded, tắt thuế tự động, statement descriptor) → mục 7 việc 3, 9.1.
7. check-site.js chặn link `test_` và kiểm PayPal theo danh sách tên miền tuyệt đối → 6.3.
8. Thử thật rẻ hơn (Stripe test mode, PayPal sandbox), sửa phí mỗi lần thử, phí PayPal không hoàn → 6.4, mục 8, Chú thích 2 và 13.
9. Luật PayPal rộng hơn (2 câu nguyên văn, hệ quả ngoài trang web, biển booth [cần kiểm tra]) → 2.1, 9.6, câu 2.
10. Nguồn Etsy mới + luật vận hành không đưa link vào Etsy → 9.7, mục 11.
11. Test và tài liệu cũ dùng `PAY.squareUrl`/`zelleTo`/`[data-pay-square]` → 5.1, 2.4 (giữ `data-pay-square`), 6.1.
12. Bảng phí tính cả 2 lần trả → Trả lời ngắn 9, mục 8.

**Gợi ý đã dùng:** chữ nút khác nhau cho 2 cách trả thẻ; link "I've sent it" trong thẻ Venmo/Zelle + test 2 màn hình; dòng "come back" hiện cho tất cả hoặc không cho cách nào; ghi tên khách sẽ thấy sau khi chị xác nhận; không gắn UTM vào link Stripe; ghi chú phí khi hoàn cọc và Afterpay eligibility range; kiểm email Tally có trường `pick`; giữ thẻ Venmo riêng.

**Ghi chú ký tên (nguyên văn):**

> Elise ơi, Hải Đăng đây.
>
> Hiện trạng: Kế hoạch v1 đi đúng hướng ở những chỗ quan trọng nhất. Trang không bao giờ nói "paid", URL không mang PII, PayPal và Venmo đứng đầu theo đúng luật, cọc đã gồm thuế 8,25%. Em đã đọc lại tài liệu của Stripe, PayPal, Square, Venmo và Zelle: phần lớn các ý trong nghiên cứu là đúng. Nhưng em thấy 4 lỗ hổng về tiền:
> 1. Link Square có thể tự cộng thuế thêm một lần nữa, vì cài đặt link ghi "Sales taxes … apply automatically from your tax settings", và booth của chị đang chạy Square. Nếu bị vậy, khách gõ $45 sẽ thành $48.71, tức thu thừa $3.71 [tính toán, cần chị thử 30 giây].
> 2. Khách gửi form xong mà sửa món thì link Stripe điền sẵn sai số cọc.
> 3. Chưa có mã đơn, nên chị phải khớp 5 kênh bằng tên người trả.
> 4. Chưa có đường trả phần còn lại.
>
> Khuyến nghị: sửa 12 điểm trong danh sách must-fix trước khi làm Đợt 1. Quan trọng nhất là: kiểm thuế và tip của Square; khoá số cọc theo đơn đã gửi; thêm mã đơn ngắn và 1 sổ đối soát; chỉ bắt đầu làm khi Stripe ghi "Succeeded"; chặn link test_/sandbox khi deploy. Luật PayPal cũng rộng hơn kế hoạch ghi: nó áp cho cả DM và bài quảng cáo, không chỉ trang web, nên chị cần biết trước khi bật.
>
> Các bước: (1) Chị thử link Square với $45. (2) Em sửa kế hoạch và code Đợt 1 với Square + Zelle. (3) Thử redirect miễn phí bằng Stripe test mode và PayPal sandbox, chỉ Square phải trả thật $1 (khoảng $0,33 phí). (4) Chị gửi link từng kênh, em điền vào.
>
> Kết quả mong đợi: phí cho cả một đơn $90 (cọc + phần còn lại) [tính toán theo bảng phí công bố]: Zelle $0 · Venmo $1.91 · Stripe $3.21 · Square $3.57 · PayPal $3.67–4.12. Mỗi khoản tiền vào đều có mã, nên chị khớp 1 phút một khoản [ước tính]. Không thu thừa thuế, không bắt đầu làm khi tiền chưa về.
>
> — Hải Đăng, Ecommerce Executive

### Linh Trần — Social Media Executive

**Kết luận:** APPROVE_WITH_CHANGES (đồng ý, kèm sửa).

**Must-fix đã áp:**
1. Giữ đúng động từ "thảy", hộp mail dưới sàn, thảy trong lúc nhảy xuống thành một động tác, chưa khoá bố cục khi chị chưa trả lời → 4.1, 4.3, câu 9–10, Chú thích 3.
2. Câu mô tả video đủ mọi thứ video cho thấy, có nhãn "The video, in words:", là `<figcaption>`, ảnh `alt=""`, có test → 3.1, 6.2, Chú thích 7.
3. Câu "design mockup" phải có điều kiện "made-to-order or custom" (trang cảm ơn và lá thư) → 3.1, 3.3, mẫu email C, test từ cấm/sự thật 6.1.
4. Hình tạm đúng khung 16:9, bỏ clipPath và viền, mọi thứ trong x=80–560, bỏ cả 3 ngôi sao → 4.2.
5. Đếm file: 8 file trên site, `.vtt` chỉ là file agent giao → 4.2.
6. Cổng duyệt cho hình tạm trước khi `on: true`, ghi ngày vào PR → 4.2, 2.3 (`approved`), 6.3, Chú thích 5.
7. Điện thoại: chỉ chạy khi ≥50% trong màn hình, giới hạn khi xoay ngang, thứ tự trên điện thoại, test 360×640 / 375×667 / 844×390 → 3.1, 3.2, 6.2.
8. Giảm chuyển động một luật chung (ảnh tĩnh + "Play video", chỉ tải khi bấm), sửa test tương ứng → 3.2, 6.2, Chú thích 4.
9. Hồ sơ giao agent là một file tiếng Anh tự đủ, đủ 8 mục, sửa câu sao ở `scene.md` §4.3 → 4.3, "Việc em làm ngay" 6.

**Gợi ý đã dùng:** nhịp 9 Merlin quay đầu chớp mắt chậm; dòng trạng thái B làm lựa chọn; mở dòng sự thật bằng giọng ấm; "come back to Purrlight"; phụ đề giữ khi tạm dừng, nút ≥44 px; follow strip và OG cho trang cảm ơn; xin agent giao tiếng tách riêng và bản số nhiều; bản 9:16 làm riêng; hình tạm ≤ nửa ngày; tránh 10–14/11.

**Ghi chú ký tên (nguyên văn):**

> Chị Elise ơi, Linh đọc kỹ rồi. Khung lớn Linh đồng ý: cảnh nằm ở một trang cảm ơn riêng, không chen vào đường tiền, chữ trên trang không bao giờ nói "paid" hay "confirmed", và lá thư trong hộp mail là bản sao đơn mà khách in được. Cách này vừa thật vừa giữ được cái duyên của Merlin.
>
> Có hai chỗ Linh phải nói thẳng. Một là lời chị: chị viết Merlin "thảy" tờ thư "xuống" hộp mail "đồng thời" nhảy xuống, mà bản kế hoạch lại đổi thành "thả" vào hộp đặt trên bàn. Linh muốn giữ đúng hình chị nghĩ ra, vì đó chính là khoảnh khắc dễ thương nhất của cảnh. Hai là chữ: dòng "we send you a design mockup" không đúng với bộ váy rửa tội và tượng thánh có sẵn, nên phải giữ điều kiện "made-to-order or custom" như trang đang ghi.
>
> Về điện thoại: phần lớn khách đi từ Instagram vào, nên Linh xin cho video chỉ chạy khi khách đang thấy cảnh. Khi xoay ngang, cảnh phải vừa trong màn hình, để câu "Mommy, you have a new order!" không trôi mất. Hình tạm thì không cần đẹp, chị nói đúng, nhưng phải đúng khung 16:9 và không còn ngôi sao trang trí, để lúc agent giao video thật chỉ cần chép đè file. Linh sẽ gom hồ sơ cho agent thành một file tiếng Anh: ảnh Merlin thật, giọng ở video hero, sơ đồ phòng, và danh sách những thứ không được có trong hình.
>
> Sửa xong mấy điểm này là Linh ủng hộ làm Đợt 1 ngay.
>
> — Linh Trần, Social Media

### Prue — Strategic Advisor & HR/Ops (trọng tài)

**Kết luận:** APPROVE_WITH_CHANGES (đồng ý, kèm sửa).

**Must-fix đã áp:**
1. Mục "Lịch & đóng băng": hạn 09/11, không lấy giờ P0, link sau ~05/11 chờ tháng 1 hoặc ngoại lệ "chỉ điền dữ liệu", video thật trước 09/11 hoặc sau 02/01, 2 công tắc tắt được phép, kế hoạch này thay Đợt 1b → 5.2, 5.1, Trả lời ngắn 7, câu 6.
2. Bỏ việc trả thử bằng thẻ thật trên Stripe; Stripe thử trong sandbox với thẻ 4242 + ảnh chụp cài đặt link thật; trả thật $1 chỉ cho PayPal và Square → 6.4, Chú thích 2.
3. Mức tối thiểu của link Stripe = mức cọc nhỏ nhất (`PAY.stripe.minCents`), kiểm tương tự cho Square/PayPal [cần kiểm tra] → 2.3, mục 7 việc 3, 6.1, Chú thích 10.
4. Bỏ mặc định "AI tạo bản nháp trong Gmail"; mẫu cố định chị tự điền, tự gửi → 3.3, Trả lời ngắn 4, Chú thích 6.
5. Nghĩa vụ trong PayPal User Agreement: thông tin liên hệ, chính sách hoàn trả trên cả trang cảm ơn, privacy policy [cần kiểm tra luật], "at least as prominently" ngoài trang web, QR ngang hàng + luật check-site → 9.6, 2.1, 3.1 dòng 7–8, 6.3, câu 21.
6. `thanks.js` không bao giờ đọc `location.search`, xoá tham số bằng `history.replaceState`, test URL bẩn → 3.4, 6.2, 6.3.
7. Chỉ bắt đầu khi giao dịch hoàn tất (không pending/đang giữ), luật hoàn tiền đúng cách, đúng người → 9.1, 9.2, Trả lời ngắn 3.
8. Câu hỏi riêng về "Your order copy"; viết lại câu bật hình tạm với hệ quả đóng băng và 2 Merlin → câu 7, câu 14, 9.12, Chú thích 5.
9. Các dòng "Sổ tài khoản & khoá" cho từng cách trả, không secret trong repo → mục 7, việc em làm ngay 7.
10. Cột "Giờ của chị", tổng giờ, mỗi hãng độc lập, chi phí hằng ngày, sửa chỉ số thành công đếm mọi cách trả từ 1 sổ → mục 7, 5.2.

**Gợi ý đã dùng:** phương án gọn 3 thẻ đưa vào câu 5 (Chú thích 8); Stripe thay Square sau này ở câu 1; thứ tự ship trước 09/11 (5.3); câu có điều kiện cho khách không có bản sao đơn (Chú thích 11); kiểm thuế trong mỗi lần trả thật (6.4); thử 2 lần trả cùng nhãn Invoice ID (6.4); hỏi về biển booth (9.6); câu "we check every deposit by hand" qua cổng duyệt (Chú thích 12).

**Ghi chú ký tên (nguyên văn):**

> Elise, Prue đây.
>
> [Nhận định] Bản v1 giữ đúng luật trung thực: trang không bao giờ nói "paid" hay "confirmed", lá thư là bản sao đơn, URL không có dữ liệu khách, cọc đã gồm thuế. Em đã kiểm lại các dòng code được trích và điều khoản PayPal/Venmo, đều khớp.
>
> [Cảnh báo rủi ro] Có ba lỗ hổng. Một: kế hoạch chưa có lịch. Bản v1 không nhắc hạn merge 09/11 hay đóng băng 15/11, nên link nào chị gửi muộn, và cả video thật, sẽ kẹt tới tháng 1; còn hình tạm có thể nằm trên web suốt mùa lễ. Hai: nhờ người nhà trả thử bằng thẻ thật trên Stripe là trái luật của Stripe, và để link Stripe tối thiểu $1 là mời kẻ gian vào thử thẻ ăn cắp. Ba: 5 cách trả là 5 app phải đối chiếu và 5 tài khoản phải đứng tên LLC, tức là thêm một việc hằng ngày cho chị.
>
> [Giải pháp thực chiến] Trước 09/11 chỉ ship trang cảm ơn, lá thư, Square + Zelle và dòng pháp lý Zelle. Hãng nào có tài khoản business sẵn trước khoảng 05/11 thì thêm vào; còn lại để sau 02/01, hoặc chị duyệt một ngoại lệ chỉ điền dữ liệu. Thử Stripe trong sandbox, đặt mức tối thiểu bằng khoản cọc nhỏ nhất. Email xác nhận là mẫu chị tự điền, không để AI đọc hộp thư đơn.
>
> [Câu hỏi ngược] Hôm nay chị ghi tiền cọc ở đâu? Và chị có chịu mỗi đơn mở tới 5 app để đối chiếu không, hay mình bắt đầu với Square, Zelle và một link PayPal (đã gồm Venmo và thẻ)?
>
> — Prue
