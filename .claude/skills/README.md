# Skill thiết kế cho web Purrlight

**22/10/2026.** Elise gửi danh sách "8 skill thiết kế web cho Claude" (cuongmeai.com) để web bớt giống sản phẩm AI
làm. Nhóm soát xét đọc toàn bộ phần sẽ cài, cùng mọi phần có thể tự chạy (script, hook, cài đặt, manifest) của 7
bộ; mỗi bộ có một người đọc và một người phản biện. Bộ thứ 8, Image to Code, đã chuyển sang repo khác; em soát riêng
repo mới sau đó.

Cùng ngày, chị chốt: **"đối với các skill ngoài thì chị ok không ép chặt luật nhà của mình brand thương hiệu vào.
Chị đồng ý áp chỉ 20% rule để giữ tính sáng tạo thú vị của skill"**. Vì vậy các skill ngoài được làm theo cách của chính chúng. Luật nhà chỉ còn 2 lớp mỏng
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

Hai lưu ý cho chị:
- **Tạo ảnh bằng AI tốn credit của chị** (Canva, Figma, Higgsfield, Gamma). Claude chỉ dùng khi chị đồng ý cho
  từng lần.
- **Tên và mô tả skill mới chỉ có hiệu lực từ phiên Claude Code mới.** Trong phiên cũ, đừng gọi tên cũ
  `purrlight-taste-critic`.

Các skill chỉ chạy khi Claude Code làm việc trong repo này. Chúng không nằm trong `website/` nên không lên web, và
không nằm trong `plugins/` hay marketplace nên không phát hành dưới tên Purrlight. Repo GitHub đang công khai nên ai
cũng đọc được các file này; giấy phép MIT cho phép, và file LICENSE đã kèm theo.

| Skill | Lấy từ | Dùng khi |
|---|---|---|
| `purrlight-taste` | taste-skill v2.1.4 (Leonxlnx, MIT): bản đầy đủ, trừ công cụ tải ảnh | Soi trang nào "trông như AI làm", đưa ra hướng thiết kế mới, dựng bản xem trước để chị chọn |
| `purrlight-motion` | 7 skill chuyển động của Emil Kowalski (MIT) | Tìm chỗ nên có hiệu ứng, làm hiệu ứng mới, soát độ mượt và hiệu năng |
| `purrlight-web-guidelines` | Vercel Web Interface Guidelines (MIT), bản ghim | Kiểm tra khả năng truy cập và chi tiết giao diện, báo theo `file:dòng` |
| `purrlight-impeccable` | Impeccable v4.7.0 (Apache-2.0): **chỉ phần chữ**, không chương trình, không hook, không gửi số liệu | Đẩy một trang theo một hướng: đậm hơn, tiết chế hơn, thêm màu, chữ đẹp hơn, dễ thương hơn, gọn hơn, trau chuốt |
| `purrlight-image-to-code` | imagegen-skills, image-to-code (Leonxlnx, MIT) | Dựng bản xem trước giống ảnh thiết kế chị đưa (Canva, ảnh chụp trang). Không tự tạo ảnh AI |

## Không cài và lý do

- **Phần chương trình của Impeccable:** một chương trình 21 MB tự tải về. Nó chứa hook chạy sau mỗi lần sửa file,
  mặc định gửi số liệu thống kê về máy chủ của tác giả, và hỏi bản cập nhật mỗi ngày. Bỏ đi thì mất 2 lệnh `live`,
  `generate` và bước quét tự động. Lệnh `live` còn tự mở một Claude khác chạy không cần xin phép.
- **Awesome Design HTML, Awesome Claude Design:** thư viện bắt chước giao diện các hãng lớn (Stripe, Apple,
  Nike...): có logo vẽ lại và số liệu, đánh giá bịa. Bộ VoltAgent chỉ là danh sách link.
- **3 skill còn lại của imagegen-skills** (vẽ ảnh mẫu web, app điện thoại, bộ nhận diện): chỉ tạo ảnh và tốn
  credit. Bộ nhận diện (brandkit) còn bắt AI vẽ lại logo và Merlin.
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

## Bản chép để dành, chưa kích hoạt (27/10)

Elise gửi `elayadesign/ai-design-skills` ("cứ tải hết về… sau sẽ cần"). Ba skill của tác giả này
(`landing-page-design`, `design-to-motion`, `redesign-existing-projects`) được chép nguyên văn, ghim commit, vào
`.claude/vendor/`, không phải ở đây, nên Claude không tự nạp. Lý do và cách dùng sau này: `.claude/vendor/README.md`.
