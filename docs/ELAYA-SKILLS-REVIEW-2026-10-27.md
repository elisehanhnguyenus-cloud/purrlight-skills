# Soát repo elayadesign/ai-design-skills và phương án cải thiện website — 27/10/2026

Chị gửi https://github.com/elayadesign/ai-design-skills, nhờ "xỉa" repo rồi đưa phương án cải thiện web Purrlight, và
dặn tải hết về để dùng sau. Em đọc toàn bộ repo, cùng repo "anh em" `redesign-skill` mà nó giới thiệu. Một nhóm soát
xét làm 3 việc: đối chiếu từng luật với luật nhà, soát web hiện tại theo các luật đó, và tìm chỗ hiệu ứng có ích. Sau
đó một người phản biện mở lại file để kiểm từng điều nói về web. Tài liệu này đã sửa theo các chỗ người phản biện
chỉ ra.

**Đã tải về:** bản chép nguyên văn, ghim phiên bản, nằm ở `.claude/vendor/` (đọc `.claude/vendor/README.md`). Bản
này để ngủ: Claude không tự dùng.

## Tóm tắt một dòng

Không nên cài nguyên văn: cả ba skill tự bật cho mọi việc làm web và đè lên thương hiệu. Phần đáng giá nhất là cách
dựng landing page (phần A) và danh sách việc trước khi lên web (B10). Em đã dùng chúng để soát web và ra 15 phương án
ở mục 2.

## 1. Mổ xẻ repo

Repo có 2 skill viết bằng chữ, không có code chạy, giấy phép MIT, tác giả Elaya. Repo mới tạo (bản em tải ghi ngày
27/10/2026) và README ghi "More on the way". Hướng dẫn cài trong README tải bản mới nhất, nên luật có thể đổi bất cứ lúc
nào mà không ai soát.

### landing-page-design (dựng landing page, 431 dòng)

**Điểm mạnh**
- **Phần A (chiến lược):** "một sản phẩm, một nhóm khách, một hành động". Nó khớp đúng trang Custom Orders:
  - tiêu đề nói kết quả;
  - một nút chính rõ ràng;
  - một bằng chứng ngay ở màn hình đầu;
  - FAQ 6–12 câu;
  - lời giảm rủi ro đặt cạnh nút;
  - nút cuối trang giống nút đầu;
  - "đặt bằng chứng ngay cạnh lời hứa".
- **B10, danh sách việc trước khi lên web:** tìm ra lỗ hổng thật mà các skill đã cài không soát:
  - chưa có trang 404 riêng;
  - 6/8 trang không có ảnh xem trước khi chia sẻ link;
  - chưa có trang privacy;
  - chưa có sitemap.
- **B9, trạng thái tải và lỗi:** tìm ra trang sản phẩm hiện "$0" và "Product name" trong lúc đang tải.

**Điểm yếu và rủi ro**
- **Tự bật quá rộng:** mô tả ghi dùng cho "ANY landing page, marketing site, web UI…", kể cả khi không ai nhắc tới
  thiết kế. Phần hình ảnh ghi "non negotiable" (bắt buộc).
- **Không hợp shop thủ công:** skill viết cho trang mới kiểu phần mềm (free trial, demo, cancel anytime).
- **Bảo AI bịa:**
  - mục B8 bảo đặt tên đầy đủ cho người đánh giá, nghĩ ra logo khách hàng, viết số liệu lẻ cho "giống thật";
  - mục A1 bảo thiếu thông tin thì "tự giả định rồi làm tiếp", tức là có thể tự đặt chính sách hay cam kết hoàn tiền.
  - Cả hai trái luật nhà (không bịa).
- **Hình ảnh gắn với Tailwind:** ép cỡ chữ và khoảng cách theo bảng của nó thì 35 chỗ chữ 13px bị kéo xuống 12px
  (ngược lại sửa ngày 22/10), nút cao khoảng 51px còn khoảng 40px.
- **Hiệu ứng "bắt buộc":**
  - một đoạn chữ lớn bắt đầu mờ 25–35% rồi đậm dần từng chữ. Lúc mờ, độ tương phản chỉ 1,5–1,8:1, không đạt chuẩn.
- **Lệch với lựa chọn của chị:**
  - một font duy nhất (Geist hoặc Manrope);
  - không chữ nghiêng;
  - không gradient nền, nhưng lại phủ gradient xám lên chữ tiêu đề;
  - bỏ dấu gạch nối trong câu (sẽ phải sửa "hand-stitched");
  - nút viết kiểu câu ("Shop the collection"), trong khi chị đã chọn viết hoa chữ đầu.

### design-to-motion (biến thiết kế tĩnh thành chuyển động, 563 dòng)

**Điểm mạnh**
- Quy trình quay video/GIF từng khung với đồng hồ giả. Đây đúng là cách em đã làm để quay video sợi len Merlin cho mượt.
- Luật cho website hợp lý:
  - hiệu ứng chạy một lần khi cuộn tới;
  - dừng khi ra khỏi màn hình;
  - ai bật giảm chuyển động thì thấy hình đứng yên.
- Luật trung thực khi làm từ ảnh chụp: không tự bịa phần bị che khuất.

**Điểm yếu**
- Phần lớn viết cho thẻ biểu đồ, dashboard phần mềm. Purrlight không có những thứ đó.
- Cần token Figma. Em sẽ không xin chị token này.
- Xuất MP4/GIF cần phần mềm ffmpeg đầy đủ. Máy này chỉ làm được video WebM.
- Trên web, nó cho "câu chuyện chạy mãi" mà không có nút dừng (luật nhà: chạy quá 5 giây phải có nút dừng).
- Nó muốn trang mở ra trống trơn rồi mới hiện chữ và nút. Vì thế khi script lỗi, khách thấy trang trống.

### redesign-existing-projects (repo anh em, nâng cấp web có sẵn, 260 dòng)

- Danh sách soát rất dài, phần lớn trùng với `purrlight-taste` và `purrlight-impeccable` đã cài.
- **Xung đột:**
  - việc ưu tiên số 1 là đổi font;
  - gộp còn 1 font, bỏ chữ nghiêng, bỏ gradient;
  - đổi nút viết hoa chữ đầu thành viết kiểu câu;
  - đổi nhãn chữ in hoa thành chữ thường, tức là đụng tới nhãn "chapter";
  - gợi ý dùng ảnh mẫu picsum.photos;
  - bảo bịa tên và số liệu cho "thật".
- Vài ý nhỏ hữu ích (trang 404, link privacy, trạng thái tải và lỗi, link "bỏ qua tới nội dung") đã có trong các
  phương án dưới.

### So với các skill đã cài

- **Đã có sẵn:**
  - Hai skill này lấy ý từ taste-skill (bản mình đã cài là `purrlight-taste`) và từ bộ chuyển động của Emil (`purrlight-motion`).
  - Ngắt dòng gọn, tránh chữ mồ côi: `purrlight-web-guidelines` có.
  - Khung chờ khi tải, trạng thái rỗng và lỗi: `purrlight-impeccable` có.
- **Thật sự mới:**
  - khung chiến lược landing page (A1–A8);
  - danh sách B10;
  - công thức bo góc lồng nhau (góc bên trong = góc bên ngoài − khoảng hở);
  - quy trình quay video showcase.

### Kết luận về cài đặt

- Không cài nguyên văn. Bản chép đã cất sẵn để dùng sau.
- Nếu chị muốn dùng lại nhiều lần để soát trang Custom Orders: làm skill `purrlight-landing`, chỉ chạy khi gọi tên,
  chỉ lấy A1–A8, B9 và B10.
- **Font, chữ nghiêng, gradient, bộ icon, thanh menu nổi:** theo quyết định ngày 22/10 (luật 20%), đây vẫn là chỗ mở
  để đề xuất. Chị muốn thử thì em làm bản xem trước và ghi rõ "đổi X". Em không khuyên đổi: bỏ Fraunces và chữ nghiêng
  là mất nét riêng mà chính bản góp ý còn khen, còn nút viết hoa chữ đầu là chị đã chọn.
- **Luật cứng không đổi (phần B):** không bịa đánh giá, số liệu hay chính sách; giữ độ tương phản; tôn trọng chế độ
  giảm chuyển động; hiệu ứng chạy quá 5 giây phải có nút dừng; code chạy được trên điện thoại cũ.

## 2. Phương án cải thiện website

Chữ mới nào trên trang cũng chờ chị duyệt. Giá, cọc và hạn đặt không đổi.

### Làm ngay (nhỏ, tăng tin tưởng)

| # | Phương án | Chị cần |
|---|---|---|
| O1 | **Đưa bằng chứng thật lên màn hình đầu.** Dòng "Etsy Star Seller ★ 4.9" hiện chỉ có ở cuối trang Custom Orders, sau 94% chiều dài trang trên điện thoại; trang chủ không có bằng chứng nào. Đưa dòng này lên phần đầu Custom Orders, dạng chữ thường không gắn link để khách không bị kéo sang Etsy giữa chừng. Trên trang chủ, đặt dưới dải cam kết (không nhét vào "Our commitments", vì đánh giá không phải cam kết). | Duyệt chỗ đặt. Trước mỗi lần đưa lên, xác nhận còn 4.9 và còn Star Seller. |
| O2 | **Dòng giảm rủi ro cạnh nút đặt hàng.** Gom các lời hứa đã có trên trang: bản thiết kế trước khi làm (với món làm theo đơn); trả phần còn lại sau khi duyệt ảnh; "Custom pieces can't be returned, but anything wrong or damaged is on us". Kèm link tới điều khoản đầy đủ. Giữ đủ điều kiện, không hứa hơn trang đang ghi. | Duyệt câu chữ. Chọn chỉ đặt ở đầu trang hay đặt ở mọi hộp quà. |
| O3 | **Khối "Questions before you order" (7–8 câu) trên Custom Orders**, mỗi câu trả lời là câu đã có sẵn trên trang: giống thú cưng không, cần ảnh gì, bao lâu, kịp Giáng sinh không, trả tiền thế nào, hủy và hàng hỏng, phí ship và nhận tại chỗ, thuế. Dạng bấm mở ra (vẫn đọc được khi tắt JavaScript), kèm dữ liệu câu hỏi cho Google và AI. Thêm kiểm tra tự động để hai chỗ không lệch nhau. Câu trả lời về Giáng sinh tự ẩn sau 2/1. | Duyệt danh sách câu hỏi và tiêu đề khối. |
| O5 | **Ảnh xem trước khi chia sẻ link** cho 6 trang chính. Hiện chia sẻ link trang chủ hay shop qua Messenger, iMessage, Instagram thì không có ảnh. Dùng ảnh thật của chị (không dùng ảnh mèo AI). | Chọn ảnh. Xác nhận TikTok, Pinterest, Facebook đúng của shop. |
| O6 | **Trang sản phẩm không hiện "$0" và "Product name"** khi đang tải hoặc khi lỗi (đó là giá sai trên màn hình). Link thiếu mã sản phẩm hiện báo lỗi, không tự mở Christening Gown Set. Thêm khung chờ đúng hình. Menu đánh dấu đúng mục đang xem. | Duyệt 1 câu báo lỗi ngắn. |
| O15 | **Trang sản phẩm trên điện thoại:** nút "Buy on Etsy" nằm dưới màn hình đầu ở 360 và 390px. Thêm một thanh nút dính dưới đáy như Custom Orders, tự ẩn khi nút trong trang đã hiện. | Không cần chữ mới. Xem ảnh trước/sau. |

### Tiếp theo

| # | Phương án | Chị cần |
|---|---|---|
| O4 | **Bằng chứng thật từ đơn thật.** 2–3 đánh giá Etsy thật, chép nguyên văn với tên như Etsy hiện; 1–3 cặp "ảnh khách gửi → món làm ra", đặt cạnh món tương ứng, và dùng luôn cho chương "kind words" ở trang chủ. Thẻ thú cưng đang đặt ảnh nhóm mèo AI cạnh lời hứa "đúng con của bạn", nên thay bằng ảnh thật khi có. | Gửi đánh giá và cặp ảnh. Cần khách đồng ý (đồng ý bằng văn bản nếu lộ mặt); nên bắt đầu bằng thú cưng. |
| O7 | **Tiêu đề Custom Orders nói kết quả.** Hiện tiêu đề chỉ là "Custom Orders" (tên danh mục), dòng nhỏ phía trên là "Viet Delight · Purrlight Studio". Gợi ý: đưa "Custom Orders" xuống dòng nhỏ, tiêu đề mới kiểu "Keepsakes made from your photos" (em đưa 2–3 bản), và tiêu đề tab trình duyệt dễ tìm hơn. Về "Viet Delight": ngày 25/10 em gợi ý bỏ khỏi dòng nhỏ. Lần soát này thấy có lý do giữ: khách từ Instagram @vietdelight_us và shop Etsy tên Viet Delight sẽ thấy đúng tên quen. Hai cách đều có lý. | Chọn tiêu đề. Quyết giữ hay bỏ "Viet Delight" ở dòng nhỏ. |
| O8 | **Nút chính đầu trang Custom Orders.** Hiện nút này mở form Tally trước khi khách chọn món, nên đơn tới chỉ có mã; còn đường "Build your gift" (có món, tổng tiền, tiền cọc) chỉ là link gạch chân. Cách A: nút chính dẫn vào phần chọn quà, chữ "Start a Custom Order". Cách B: giữ nguyên. Cách nào cũng gắn link riêng cho từng kênh: từng nút Linktree cho Instagram và TikTok, mã QR ở booth. Trang đã tự chép mã kênh vào form Tally, nên chị biết đơn đến từ đâu mà không cần công cụ theo dõi. | Kiểm tra form Tally đã có ô ẩn `utm_source`, `utm_medium`, `utm_campaign` chưa (em chưa kiểm được). Chọn A hay B. |
| O9 | **Bịt đường cụt:** trang 404 riêng, có ảnh Merlin thật và các link về; thêm "Shipping & returns" ở chân trang Custom Orders (trang duy nhất còn thiếu); thêm nút "Start a Custom Order" ở cuối trang About. | Duyệt chữ trang 404. |
| O10 | **Điều khoản và privacy.** Trang Shipping & returns đã có phần Custom Orders (giao hàng, hoàn tiền). Thêm nguyên văn các dòng: cọc 50%, bản thiết kế trước khi làm, trả phần còn lại sau khi duyệt, file số trả đủ, Zelle không hủy. Trang privacy chỉ làm khi chị (hoặc người tư vấn) đưa dữ kiện: lưu ảnh và tin nhắn khách bao lâu; có đăng ảnh món hay ảnh khách lên mạng không, khách từ chối thế nào; dịch vụ nào xử lý dữ liệu (Tally, Gmail, Square, Stripe, Zelle, Venmo). Luật California (CalOPPA) thường yêu cầu web bán hàng có thu thông tin cá nhân phải có trang privacy, và shop có giao hàng tới California. Đây chỉ là gợi ý, không phải tư vấn pháp lý. Chưa cần banner cookie vì web không có công cụ theo dõi hay quảng cáo; riêng form Tally có tải script của Tally (chưa kiểm cách Tally dùng cookie). | Duyệt phần điều khoản. Cho dữ kiện nếu muốn làm trang privacy. |
| O11 | **Trang Shop đọc được khi không có JavaScript:** viết sẵn 31 thẻ sản phẩm vào trang (như đã làm ở trang chủ), thêm sitemap, thêm dữ liệu sản phẩm cho Google. Có kiểm tra tự động để giá không lệch `products.js`. Hiện tắt JavaScript thì Shop trống trơn; nhiều công cụ AI không chạy JavaScript. | Cho biết Google Search Console đã xác minh web chưa. |
| O12 | **Trau chuốt:**<br>• hiệu ứng hiện dần không bao giờ giấu nội dung nếu script lỗi;<br>• đồng bộ nhịp hiện dần ở trang chủ, About, Shop với giá trị chị từng duyệt (520 ms, các thẻ cách nhau 70 ms);<br>• bấm nút trên điện thoại có đổi màu phản hồi;<br>• ngắt dòng tiêu đề gọn hơn. | Xem clip và ảnh trước/sau. |

### Để sau

| # | Phương án | Chị cần |
|---|---|---|
| O13 | **Hai khoảnh khắc chuyển động tùy chọn cho trang chủ:**<br>(a) chữ ở đầu trang nhẹ nhàng nhích lên 6px khi mở trang, một lần, không dời ảnh hay Merlin;<br>(b) câu "Made by hand. Made to be kept." hiện dần như mực thấm, làm một đoạn ngắt giữa các chương (chữ không bao giờ mờ tới mức khó đọc).<br>Chỗ đặt (b) trùng với chỗ dự định cho chương "kind words", nên chị chọn cái nào trước. | Xem video từng bản, chọn hoặc bỏ. |
| O14 | **Video ngắn cho mạng xã hội**, quay từ chính phần chọn quà (giá cộng dần khi chọn len, chọn cỡ) và từ sợi len Merlin, chỉ dùng ảnh thật. Máy này làm được video WebM; muốn MP4 thì cần chị đồng ý cài ffmpeg, hoặc ghép video trên máy chị. | Duyệt kịch bản. Chọn nền tảng (Instagram, TikTok, Etsy). |

**Em đề xuất làm trước:** O1, O2, O3, O5, O6, O15, O9. Đây là nhóm nhỏ, tăng tin tưởng, ít chữ mới.

## 3. Những thứ không làm

- Không bịa đánh giá, tên khách, logo, số liệu, hay cam kết kiểu "money-back guarantee" mà shop không có.
- Không ép khung landing page lên trang chủ: giữ chapter và 2 nút ở đầu trang.
- Không làm đoạn chữ mờ 25–35%. Không để trang mở ra trống rồi mới hiện chữ. Không có hiệu ứng chạy mãi mà không có nút
  dừng.
- Không cho "câu chuyện" tự chạy trên phần chọn quà: giá tự nhảy sẽ làm khách hiểu nhầm.
- Không xin token Figma, không tạo ảnh AI, không dùng ảnh mèo AI làm hình sản phẩm trong video.
- Không viết chính sách privacy thay chị.
