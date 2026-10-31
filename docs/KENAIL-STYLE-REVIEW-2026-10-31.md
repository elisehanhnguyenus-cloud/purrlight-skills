# Soát phong cách kenailapp.com — áp vào Purrlight được không? (31/10/2026)

Chị gửi https://kenailapp.com: "nghiên cứu phong cách web này, phân tích nó xem ứng dụng vào cho web Purrlight được
không?" Em mở trang bằng trình duyệt ở máy tính (1440 px) và điện thoại (390 px), chụp lại, đo font, màu, hiệu ứng.

## Trang đó là gì

"Kệ" (Ke App, LLC) là phần mềm cho tiệm nail: chấm công, chia tip, xếp lượt khách, hoa hồng. Trang chủ rất ngắn
(khoảng 2 màn hình):

- **Nền tím đen** (`rgb(30, 21, 53)` và tối hơn), một quầng sáng tím mờ phía sau nội dung.
- **Một font** không chân (DM Sans, tải từ Google Fonts), tiêu đề 2 tông: nửa đầu hồng nhạt, nửa sau tím
  ("Your whole salon floor, *on one screen.*").
- **Mỗi khối chỉ có 1 tiêu đề + 3 dòng ngắn in hoa** ("KNOW WHO'S HERE / KNOW WHO'S NEXT / SPLIT TIPS FAIRLY").
- **Ảnh chụp phần mềm làm mờ** (dữ liệu mẫu, ghi rõ trong alt), viền sáng trắng; bên dưới là hàng 10 biểu tượng nét
  mảnh và 3 nút chọn ("Today's customers", "Your techs", "The day calendar") đổi ảnh, tự chuyển theo thời gian.
- **Một con số giá to**: "$350 — Once. Unlimited staff. No monthly fee."
- **Nút chính** vàng–cam có quầng sáng, nút chat nổi màu vàng ở góc, chân trang chữ in hoa nhỏ, một dòng miễn trừ
  trung thực ("Estimate only. Owner verifies final calculations…").
- Có mã theo dõi Facebook (connect.facebook.net). Khi bật "giảm chuyển động", trang không còn hiệu ứng nào chạy.

## Kết luận: không áp nguyên, lấy 4 ý

Kệ đẹp vì nó bán **một** phần mềm cho chủ tiệm: một màn hình, một giá. Purrlight bán nhiều món làm tay cho người mua
quà (bố mẹ, ông bà, người nuôi thú): ảnh món hàng phải dẫn dắt, tông phải ấm. Áp nguyên giao diện tối tím sẽ làm web
trông như một app công nghệ và trái luật nhà (nền kem `#FBF6EE` và ánh đào `#E8A87C` là nền tảng, HOUSE-RULES Part
A2).

**Nên lấy (theo thứ tự đáng làm):**

1. **Tiêu đề hai tông.** Nhấn phần cuối tiêu đề bằng màu berry hoặc chữ nghiêng Fraunces, ví dụ "Heirloom crochet
   dolls &amp; *keepsakes.*" Không đổi chữ nào; CSS đã có sẵn kiểu `em` cho tiêu đề đầu trang.
2. **Gọn chữ: mỗi khối 1 tiêu đề + 3 dòng ngắn.** Hợp với các khối dài ở trang chủ (câu chuyện, Personalization
   &amp; corporate gifting). Dải cam kết dưới đầu trang đã theo đúng kiểu này. Rút gọn là đổi chữ cho khách, nên cần
   chị duyệt.
3. **Hàng ảnh nhỏ bấm để đổi ảnh lớn** (như hàng biểu tượng của Kệ) cho phần "Shop by category": 7 danh mục thành
   một hàng ảnh tròn, bấm vào thì ảnh lớn và một dòng mô tả đổi theo. Trên điện thoại đỡ phải cuộn qua 7 ô. Khác
   Kệ: **không tự chạy** (luật chuyển động của mình không để thứ gì chạy mãi mà không có nút dừng), dùng được bằng
   bàn phím.
4. **Một con số giá rõ ràng** ở đầu trang Custom Orders, kiểu "$350 once" của Kệ: giá khởi điểm đã có trong bảng giá
   + "Free U.S. shipping", chữ to và gọn. Không thêm con số mới.

**Có thể cân nhắc:** một khối nền tối ấm (nâu đêm, không phải tím) với quầng sáng tròn, chỉ dùng cho một chỗ đặc
biệt, ví dụ trang About "Merlin tự kể". Luật nhà cho phép khối tối, miễn nền chung vẫn là kem.

**Không lấy:**

- Nền tím đen cho cả trang (trái luật nền kem).
- Chữ chuyển màu tím neon trên mọi tiêu đề: khó đọc, và là dấu hiệu quen thuộc của web "trông như AI làm".
- Ảnh làm mờ: ảnh món hàng phải nét.
- Ảnh tự chuyển.
- Danh sách in hoa toàn bộ: khó đọc với khách lớn tuổi.
- Mã theo dõi Facebook (luật nhà: không gắn mã theo dõi) và nút chat nổi (cần người trực và mã bên ngoài).
- Font tải từ Google Fonts (luật nhà: font phải tự lưu trên web).

## Bước tiếp

Chị chọn ý nào (1–4, và khối tối hay không), em làm bản xem thử để chị so trước khi đưa vào web.
