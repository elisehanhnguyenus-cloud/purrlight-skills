# Skill thiết kế cho web Purrlight (cài 22/10/2026)

Elise gửi danh sách "8 skill thiết kế web cho Claude" (cuongmeai.com) để web bớt giống sản phẩm AI làm. Trước khi
cài, nhóm soát xét đã đọc từng file của cả 8 bộ: mỗi bộ có một người đọc và một người phản biện riêng. Kết quả:
cài 3 bộ, mỗi bộ chỉ lấy phần dùng để góp ý. Mỗi bộ được bọc trong luật nhà của Purrlight.

Các skill này chỉ chạy khi Claude Code làm việc trong repo này. Chúng không nằm trong `website/` nên không lên web,
và không nằm trong `plugins/` hay marketplace nên không phát hành dưới tên Purrlight.

| Skill | Lấy từ | Dùng khi | Làm gì |
|---|---|---|---|
| `purrlight-taste-critic` | taste-skill v2.1.4 (Leonxlnx, MIT) | Chị hỏi "web nhìn giống AI không", "soi thiết kế" | Chụp trang thật, soi các dấu hiệu "AI làm", đề xuất 3 thay đổi đáng làm nhất trong khuôn Brand Canon |
| `purrlight-motion` | Emil Kowalski: animate + review-animations (MIT) | Soát hoặc làm hiệu ứng chuyển động | Soát độ mượt, tốc độ, chế độ giảm chuyển động. Hiệu ứng mới phải được chị duyệt trước |
| `purrlight-web-guidelines` | Vercel Web Interface Guidelines (MIT) | Kiểm tra khả năng truy cập, chi tiết giao diện | Báo lỗi theo `file:dòng`: viền focus, nhãn, form, ảnh, hiệu năng. Không sửa câu chữ |

**Luật chung:** `BRAND-LOCKED.md`. Brand Canon v2 và quyết định của chị luôn thắng. Skill chỉ soát và đề xuất,
không tự sửa web, không tự viết chữ, không bịa nội dung, không thêm hiệu ứng, ảnh stock hay thư viện ngoài, không tự
đẩy lên web.

## Không cài và lý do

- **Impeccable:** chạy một chương trình tải về và cài hook chạy sau mỗi lần sửa file. Mặc định gửi số liệu thống kê
  về máy chủ của tác giả và hỏi bản cập nhật mỗi ngày. Bộ quy tắc của nó còn coi font Fraunces, nền kem và nhãn chữ
  nhỏ (những thứ chị đã duyệt) là "dấu hiệu AI".
- **Awesome Design HTML, Awesome Claude Design:** thư viện bắt chước giao diện các hãng lớn như Stripe, Apple hay
  Nike. Nó kéo web về kiểu công nghệ SaaS và có rủi ro nhái nhãn hiệu. Bộ VoltAgent chỉ là danh sách link.
- **Image to Code:** không còn trong repo taste-skill. Từ bản 2.1.3 nó đã chuyển sang repo khác, nên trang giới
  thiệu đã cũ.
- **Playwright CLI (Microsoft):** không phải skill thiết kế. Claude đã có sẵn Playwright và Chromium trong máy để chụp
  và soi trang. Cài thêm phải tải từ npm mỗi phiên, dùng bản thử nghiệm không khớp trình duyệt có sẵn, và mỗi ngày
  tự kiểm tra bản mới.
- Các phần còn lại của taste-skill và của Emil: bộ dựng trang, thư viện font và màu ngẫu nhiên, công cụ tải ảnh,
  trình duyệt tự chạy, 13 skill cho app, React hay Swift.

## Cập nhật (cho người làm kỹ thuật)

Mọi file trong `*/upstream/` là bản chép nguyên văn, ghim theo commit. Mã git và commit ghi trong
`upstream/VENDORED.md` của từng skill. Không dùng `npx skills add`, không symlink, không cài bản marketplace (chúng
theo nhánh `main`, tự đổi), và không để Claude tự tải "bản mới nhất".

Muốn cập nhật:
1. Clone repo gốc vào thư mục tạm, không chạy gì trong đó.
2. So sánh (`diff`) với bản trong `upstream/`, đọc hết phần thay đổi.
3. Chép bằng `cp` và ghi commit mới cùng mã `git hash-object` vào `VENDORED.md`.
4. Xem lại `SKILL.md` của Purrlight và `BRAND-LOCKED.md` có cần sửa không.
