# Haven: quy trình nối tranh AI (Gemini, Muse) với phần dựng web (12/11/2026)

Chị nhắn 12/11: "Chị dự định đưa AI Gemini và Muse xử lý phần cả art tranh vẽ phối cảnh, nhân vật, và các chi tiết
video, đồ họa như 1 game, phim hoạt hình ngắn dùng màu nước. Tuy nhiên để kết hợp với project làm website và dựng code
thì phải làm sao để linh hoạt kết nối và vẫn hiểu rõ quy trình yêu cầu, idea ý tưởng... Các ý tưởng thì chị có rồi: chị
có con mèo Maincoon thật khách gởi, và 2 người ngồi bên ngoài là chị và anh. Chị đã có hình vẽ 2 người ngồi bên ngoài
rồi có thể thay thế được."

Tài liệu này thay phần "họa sĩ" trong `docs/HAVEN-TRANH-THAT-PLAN-2026-11-12.md`. Hai phần giữ nguyên ở bản kế hoạch
đó: kệ chụp thật có Merlin, và khung trên tường chứa ảnh listing.

## Trả lời ngắn

**Được, và nối linh hoạt được.** Chị và em chỉ cần thống nhất 3 thứ; khi đó chị làm tranh bằng công cụ nào cũng được,
em dựng code không phụ thuộc công cụ:

1. **Một bảng cảnh** (shot list): mỗi cảnh một dòng, ghi rõ cảnh dùng ở đâu trên web, khung hình, chuyển động, chỗ phải
   chừa trống.
2. **Khung bố cục cho từng cảnh**: em chụp từ bản 3D v4, đúng góc máy và đúng đường đi của camera. Chị đưa khung này cho
   Gemini hoặc Muse làm ảnh tham khảo, nên tranh ra khớp với web.
3. **Một tệp cảnh** (`scenes.json`) do em giữ. Code đọc tệp này để biết file nào, lớp nào, chỗ trống nào. Chị đổi tranh
   hay video chỉ cần thả file mới cùng tên, không phải sửa code.

Phần khung trang của bản v4 dùng lại được gần hết: ảnh hiện ngay khi mở trang, đi thẳng qua cửa trên điện thoại, nút
bấm, thẻ món, con trỏ mèo, bàn phím, giảm chuyển động. Chỉ thay phần vẽ 3D bằng phần chạy tranh nhiều lớp và video.

## 1. Luật nhà phải đổi (chị xác nhận)

Luật hiện tại (`.claude/skills/HOUSE-RULES.md`, mục 5) ghi: ảnh AI chỉ nằm trong bản xem thử, không bao giờ vào
`website/`. Kế hoạch này đổi luật đó. Em đề xuất đổi hẹp như sau:

| Được dùng AI | Không bao giờ dùng AI |
|---|---|
| Tranh phối cảnh: mặt tiền, nội thất, phố | Merlin: luôn là ảnh và video thật |
| Video chuyển cảnh, vòng lặp nhỏ (lá lay, hơi trà, đèn) | Logo và mọi chữ: em đặt logo thật và chữ bằng code |
| Nhân vật vẽ: chị và anh (theo hình vẽ chị có), Maine Coon (nếu khách đồng ý) | Món hàng: luôn là ảnh thật của chị (Etsy và FTC muốn ảnh đúng hàng thật) |
| Đồ trang trí: sách, đèn, cây, chậu | Người lạ, hay thú cưng của người khác khi chưa được phép |

Thêm 3 điều:
- **Credit:** chị tự chạy Gemini và Muse bằng tài khoản của chị. Em không gọi công cụ tạo ảnh nào nếu chị chưa đồng ý
  cho đúng lần đó.
- **Quyền dùng thương mại:** chị kiểm tra điều khoản của Gemini và Muse cho phép dùng ảnh và video trên web bán hàng và
  quảng cáo. Em chưa kiểm tra được điều khoản của hai công cụ này.
- **Nói thật:** trang Custom Orders bán tranh vẽ số từ ảnh của khách. Vì vậy trên web không gọi tranh cảnh Haven là
  "vẽ tay" hay "hand-painted", để khách không nhầm tranh đặt riêng cũng làm bằng AI.

## 2. Nhân vật

| Nhân vật | Nguồn | Cần |
|---|---|---|
| Merlin | Ảnh và video thật trên kệ | Buổi chụp kệ (bản kế hoạch, mục 4 bước 3). AI không vẽ Merlin |
| Chị và anh ngồi góc cà phê | Hình vẽ chị đã có, thay 2 người trong bản 3D | Gửi em file gốc lớn nhất. Ai vẽ hình đó? Nếu là họa sĩ khác, cần họ đồng ý cho dùng |
| Maine Coon ở bậc cửa | Ảnh mèo thật khách gửi | **Khách đồng ý bằng văn bản** cho dùng trên web và cho đưa ảnh vào Gemini, Muse. Không ghi tên khách |
| Chú chó ở góc cà phê (đang có trong bản 3D) | Chị chọn | Giữ hay bỏ? Nếu giữ: chó của ai, có ảnh không |

Một cách an toàn hơn cho Maine Coon: dùng chính món len Maine Coon Crochet Cat đang bán, chụp thật. Như vậy không cần
xin phép khách.

## 3. Vòng làm việc cho mỗi cảnh

| Bước | Ai | Việc | Ra gì |
|---|---|---|---|
| 1. Thẻ cảnh | Em | Viết dòng cảnh trong bảng cảnh, xuất khung bố cục từ 3D v4, viết prompt nháp | Khung bố cục, prompt |
| 2. Làm tranh | Chị | Chạy Gemini hoặc Muse với prompt phong cách chung, khung bố cục và ảnh tham khảo nhân vật | 2–4 bản thử |
| 3. Nộp | Chị | Thả bản thử vào thư mục "02-thu" | File đặt tên theo quy ước |
| 4. Soát và ghép thử | Em | Kiểm tra: kích thước, chỗ chừa có khớp không, chữ hoặc logo méo, lỗi AI (tay, mắt, đường thẳng cong). Ghép vào trang thử | Link xem thử, ghi chú |
| 5. Duyệt | Chị | Chọn bản, hoặc sửa prompt rồi làm lại | File vào thư mục "03-duyet" |
| 6. Lên trang | Em | Nén ảnh và video nhiều cỡ, cập nhật `scenes.json`, kiểm tra trên các máy | Trang xem thử mới |

Làm **cảnh S01 trước** để chạy thử cả vòng, rồi mới làm các cảnh còn lại.

## 4. Thư mục chung và tên file

Thư mục chung trên Google Drive của chị. Em đọc được Drive qua kết nối có sẵn; chị đồng ý thì em tạo sẵn.

```
Haven-art/
  00-yeu-cau/    bảng cảnh, art bible, prompt phong cách, khung bố cục (em để vào)
  01-tham-khao/  ảnh tham khảo phong cách, hình vẽ chị và anh, ảnh Maine Coon (khi khách đã đồng ý)
  02-thu/        bản thử từ Gemini, Muse
  03-duyet/      bản chị chọn
  04-web/        bản em đã nén để lên web
```

- **Tên file:** `S01_mattien_16x9_L3-matnha_v02.png`, nghĩa là mã cảnh, tên cảnh, khung hình, lớp, lần làm.
- **Mỗi bản nộp kèm một dòng ghi chú:** công cụ, ngày, prompt đã dùng. Để làm lại cảnh sau mà vẫn cùng phong cách,
  và để biết nguồn của từng ảnh.
- **Không đưa lên GitHub công khai:** ảnh mèo của khách, hình vẽ chị và anh, bản thử chưa duyệt. GitHub chỉ giữ bảng
  cảnh, tệp cảnh và các bản đã duyệt để lên web.

## 5. Bảng cảnh v1

| Mã | Cảnh | Dùng ở đâu | Khung | Chuyển động | Chỗ phải chừa trống |
|---|---|---|---|---|---|
| S01 | Mặt tiền | Mở trang | 16:9 (máy tính) và 9:16 (điện thoại) | Lá lay, hơi trà, đèn dây, đuôi mèo (vòng lặp 3–6 giây) | Bảng hiệu (logo thật). Cửa sổ trưng bày chỉ vẽ sách và đèn, không vẽ món hàng |
| S02 | Bước qua cửa | Bấm "Step inside" | 9:16 và 16:9 | Video 2–3 giây đi qua cửa. Khung đầu là S01, khung cuối là S03 | Không có. Nếu video lệch, em phóng to và mờ dần thay thế |
| S03 | Nội thất rộng | Máy tính lia chậm; điện thoại chỉ thấy giữa | Ngang rất rộng (khoảng 32:9) và 9:16 | Đèn chùm, đèn dây lấp lánh | Khoảng 8 khung tranh trống trên tường (ảnh listing). Khoảng giữa cho kệ tròn |
| S04 | Kệ tròn | Dừng ở kệ | 16:9 và 9:16 | Merlin cử động nhẹ (video thật) | Cả kệ là ảnh chụp thật; AI chỉ vẽ vòm và đèn xung quanh |
| S05 | Mở sách | Bấm "Open the book" | 16:9 và 9:16 | Video 3–4 giây: cuốn sách bìa vải mở ra | Trang sách để trống, chữ do em đặt |
| S06 | Vòng lặp nhỏ | Cả trang | Theo cảnh | Rèm lay, hơi cà phê | Không có |

## 6. Thông số file cho Gemini, Muse

**Ảnh tĩnh:**
- PNG, xuất cỡ lớn nhất công cụ cho phép.
- Kích thước tối thiểu:
  - 16:9: 2560×1440;
  - 9:16: 1440×2560;
  - S03 ngang rộng: 5120×1440, ghép hoặc mở rộng tranh nếu công cụ không ra một lần.
- **Lớp:** AI thường ra ảnh phẳng. Một ảnh phẳng vẫn chạy được: em phóng to, lia, thêm vòng lặp nhỏ. Muốn có chiều sâu
  kiểu sách pop-up thì làm thêm 2 bản cùng cảnh:
  - bản không có cây và chậu phía trước;
  - bản chỉ có cây và chậu phía trước, trên nền trơn một màu.

  Em tách lớp từ hai bản đó.

**Video:**
- MP4, chất lượng gốc cao nhất, từ 1080p, 24–30 khung/giây, không chữ, không logo.
- Âm thanh để riêng.
- **Vòng lặp:** khung cuối khớp khung đầu.
- **Chuyển cảnh:** dùng chức năng "ảnh đầu, ảnh cuối" nếu công cụ có, để video bắt đầu và kết thúc đúng tranh tĩnh.

**Màu và ánh sáng:**
- nền kem, be, hồng phấn, kim loại vàng hồng, xanh xô thơm;
- ánh đèn màu đào, chiều muộn ấm.

**Không có trong tranh:**
- chữ, logo, Merlin, món hàng, người lạ;
- mèo tuxedo đen trắng, để không ai nhầm là Merlin.

Trên điện thoại em giữ trang nhẹ: ảnh đầu tiên khoảng 250 KB, mọi thứ trước khi bấm khoảng 500 KB. Video chỉ tải khi
cần. Trên iPhone, chế độ tiết kiệm pin có thể chặn video tự chạy; khi đó trang hiện ảnh tĩnh thay vào, không trắng.

## 7. Prompt nháp (tiếng Anh, chị chỉnh theo ý)

**Khối phong cách chung**, dán đầu mọi prompt:

> Soft digital watercolor illustration, storybook style, hand-painted texture with visible paper grain, gentle
> pigment blooms and soft edges, warm late-afternoon light, peach lamp glow. Palette: cream, oat beige, blush pink,
> rose gold metal, sage green. Cozy, calm, lots of breathing room. No text, no letters, no logos, no signs with
> writing, no watermarks.

**S01 mặt tiền**, đính kèm khung bố cục S01:

> [phong cách chung] A small two-storey corner shop in a quiet European street, beige and rose-gold façade, salmon
> fish-scale roof tiles with three dormer windows and a small arched balcony with climbing vines. A blank cream
> signboard above the open front door (leave the board empty). A bay display window with books and fairy lights. A
> French café corner with a striped blush awning, a small round table and two chairs. Potted sage, rosemary, thyme,
> feverfew daisies (tanacetum), a sasanqua camellia with single pink flowers, a japonica camellia with double blush
> flowers, hydrangeas, a monstera and peonies on the balcony, the window boxes and by the steps. Cobblestones, a vintage street lamp, a white
> picket fence. Match the composition and camera angle of the attached layout image.

Chị và anh, Maine Coon: thêm câu mô tả và đính kèm hình tham khảo khi đã có.

**S03 nội thất:**

> [phong cách chung] Inside the same cozy shop, wide panoramic view: arched bookshelf niches, a rose-gold
> chandelier, string lights around an arch, a round café counter. In the middle, an empty space where a round
> three-tier display will stand. On one wall, eight empty picture frames in different sizes (leave every frame
> empty). Match the attached layout image.

## 8. Phim ngắn cho mạng xã hội

Dùng lại chính các cảnh đã duyệt, xuất thêm khung 9:16, 1:1, 16:9 cho Reels và TikTok. Ba video khung mẫu logo đã gửi
chị (10/11) đặt được ở đầu hoặc cuối phim. Phim chạy riêng, không ảnh hưởng tới web.

## 9. Lưu ý thật

- **Tranh màu nước AI dễ trông "giống AI"** và giống nhau. Chọn kỹ ở bước 5; ảnh tham khảo phong cách thật giúp nhiều.
- **Giữ nhân vật giống nhau giữa các cảnh là phần khó nhất của AI.** Luôn đính kèm cùng một hình tham khảo nhân vật.
- **Video AI có thể lệch so với tranh tĩnh,** nhất là chỗ cửa và mái. Em luôn có cách thay: phóng to và mờ dần.
- **Chữ và logo do AI vẽ thường sai,** nên mọi chỗ có chữ đều để trống.
- **Lên web vẫn sau 02/01** (khóa web mùa lễ 15/11–02/01). Trong lúc đó làm và duyệt trong bản xem thử.

## 10. Việc tiếp theo

**Chị:**
1. Xác nhận đổi luật nhà như mục 1.
2. Gửi hình vẽ chị và anh. Cho em biết ai vẽ hình đó.
3. Maine Coon: xin khách đồng ý bằng văn bản, hay dùng món len thay.
4. Chú chó: giữ hay bỏ.
5. Cho em tạo thư mục Drive "Haven-art" không.

**Em**, sau khi chị đồng ý:
1. Xuất khung bố cục S01–S05 từ bản 3D v4.
2. Viết bảng cảnh, tệp cảnh và prompt vào thư mục.
3. Dựng phần chạy tranh nhiều lớp với khung bố cục làm tranh tạm. Chị thả tranh S01 vào là thấy ngay trên trang thử.
