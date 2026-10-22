# Skill thiết kế cho web Purrlight

**22/10/2026.** Elise gửi danh sách "8 skill thiết kế web cho Claude" (cuongmeai.com) để web bớt giống sản phẩm AI
làm. Nhóm soát xét đọc toàn bộ phần sẽ cài, cùng mọi phần có thể tự chạy (script, hook, cài đặt, manifest) của 7
bộ; mỗi bộ có một người đọc và một người phản biện. Bộ thứ 8, Image to Code, đã chuyển sang repo khác nên chưa soát.

Cùng ngày, chị chốt: **"đối với các skill ngoài thì chị ok không ép chặt luật nhà... chỉ áp 20% rule để giữ tính
sáng tạo thú vị của skill"**. Vì vậy các skill ngoài được làm theo cách của chính chúng. Luật nhà chỉ còn 2 lớp mỏng
(xem `HOUSE-RULES.md`):

- **Phần A, lõi thương hiệu (khoảng 20%):** Merlin và logo; nền kem + cam đào, kèm vàng beret và đỏ berry; vài câu
  ký tên.
- **Phần B, an toàn và quy trình:** đây không phải luật thương hiệu. Phần này gồm:
  - chưa lên web khi chị chưa duyệt (thử trong bản xem trước);
  - không bịa đánh giá, số liệu hay chính sách; không đụng giá, cọc, thuế, hạn đặt;
  - không dùng từ Etsy cấm hay tuyên bố "an toàn cho trẻ";
  - ảnh sản phẩm là ảnh thật của chị;
  - giữ mức tối thiểu về khả năng truy cập;
  - code web vẫn chạy trên điện thoại cũ.

Các skill chỉ chạy khi Claude Code làm việc trong repo này. Chúng không nằm trong `website/` nên không lên web, và
không nằm trong `plugins/` hay marketplace nên không phát hành dưới tên Purrlight.

| Skill | Lấy từ | Dùng khi |
|---|---|---|
| `purrlight-taste` | taste-skill v2.1.4 (Leonxlnx, MIT): bản đầy đủ, trừ công cụ tải ảnh | Soi trang nào "trông như AI làm", đưa ra hướng thiết kế mới, dựng bản xem trước để chị chọn |
| `purrlight-motion` | 7 skill chuyển động của Emil Kowalski (MIT) | Tìm chỗ nên có hiệu ứng, làm hiệu ứng mới, soát độ mượt và hiệu năng |
| `purrlight-web-guidelines` | Vercel Web Interface Guidelines (MIT), bản ghim | Kiểm tra khả năng truy cập và chi tiết giao diện, báo theo `file:dòng` |

## Không cài và lý do

- **Impeccable:** chạy một chương trình tải về và cài hook chạy sau mỗi lần sửa file; mặc định gửi số liệu thống kê
  về máy chủ của tác giả và hỏi bản cập nhật mỗi ngày. (Lý do thương hiệu không còn, nhưng lý do an toàn vẫn còn.)
- **Awesome Design HTML, Awesome Claude Design:** thư viện bắt chước giao diện các hãng lớn (Stripe, Apple,
  Nike...): có logo vẽ lại và số liệu, đánh giá bịa. Bộ VoltAgent chỉ là danh sách link.
- **Image to Code:** từ bản 2.1.1 đã chuyển sang repo Leonxlnx/imagegen-skills (bản 2.1.3 xoá luôn thư mục trỏ
  sang đó). Chưa soát repo mới nên chưa cài.
- **Playwright CLI (Microsoft):** không phải skill thiết kế. Claude đã có sẵn Playwright và Chromium trong máy.
- Trong taste-skill: công cụ tải ảnh và video từ các kho mở (`assets.mjs`), vì có rủi ro bản quyền trên trang bán
  hàng.
- Trong bộ của Emil: 8 skill cho app điện thoại, Swift, React và npm.

## Cập nhật (cho người làm kỹ thuật)

Mọi file trong `*/upstream/` là bản chép nguyên văn, ghim theo commit. Mã git và commit ghi trong
`upstream/VENDORED.md` của từng skill. Không dùng `npx skills add`, không symlink, không cài bản marketplace (chúng
theo nhánh `main`, tự đổi), và không để Claude tự tải "bản mới nhất".

Muốn cập nhật:
1. Clone repo gốc vào thư mục tạm, không chạy gì trong đó.
2. So sánh (`diff`) với bản trong `upstream/`, đọc hết phần thay đổi.
3. Chép bằng `cp`, ghi commit mới cùng mã `git hash-object` vào `VENDORED.md`.
4. Xem lại `SKILL.md` của Purrlight và `HOUSE-RULES.md` có cần sửa không.
