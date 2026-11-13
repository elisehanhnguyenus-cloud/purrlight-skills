# Haven: tệp cảnh, bảng cảnh, khung bố cục (13/11/2026). Không phải website/

Chỗ nối giữa tranh AI chị làm (Gemini, Muse) và code dựng trang. Quy trình: `docs/HAVEN-AI-ART-PIPELINE-2026-11-12.md`.

| File | Là gì |
|---|---|
| `scenes.json` | **Tệp cảnh.** Code đọc tệp này: cảnh nào, khung nào, lớp nào, chỗ trống nào (logo, kệ ảnh thật, khung ảnh listing, nhân vật). Toạ độ `rect` = [x, y, rộng, cao], tính theo phần của khung (0–1) |
| `shotlist.csv` | **Bảng cảnh**, sinh từ `scenes.json`. Bản chỉnh được nằm trên Google Sheets (thư mục Drive "Haven-art") |
| `ART-BIBLE.md` | Phong cách, bảng màu, nhân vật, luật cho AI, mẹo dùng Gemini và Muse, prompt tiếng Anh |
| `guides/` | **Khung bố cục**, chụp từ bản 3D v4 đúng góc máy của web, cỡ nhỏ để xem trên trang. Bản đủ cỡ (`_KHUNG`) và bản có ghi chú (`_GHICHU`) nằm trên Drive. Ảnh Merlin trong khung đã làm mờ |
| `viewer.html` | Trang **"Soát tranh Haven"**: chọn cảnh, kéo tranh AI vào là thấy chỗ trống có khớp không, đúng tỉ lệ và đủ cỡ không. Tranh chỉ mở trên máy, không tải lên đâu |

Chạy thử: `python3 -m http.server` trong thư mục này, mở `/viewer.html`.

## Cảnh

| Mã | Cảnh | Khung | Loại |
|---|---|---|---|
| S01 | Mặt tiền, mở trang | 16:9, 9:16 | Tranh nhiều lớp + vòng lặp nhỏ |
| S02 | Đi qua cửa | 16:9, 9:16 | Video 3 giây; dự phòng phóng to và mờ dần |
| S03 | Nội thất | 32:9 (máy tính lia), 9:16 | Tranh nhiều lớp + vòng lặp nhỏ |
| S04 | Kệ tròn | 16:9, 9:16 | Tranh + ảnh kệ thật + Merlin |
| S05 | Mở sách | 16:9, 9:16 | Video 4 giây (chưa có khung bố cục) |

## Không có trên GitHub (chỉ trong Drive riêng của chị)

- bản thiết kế nhân vật anh và chị;
- ảnh mèo khách gửi;
- ảnh Merlin thật;
- mẫu tranh nét chì;
- bản thử chưa duyệt.

## Việc tiếp theo

1. Chị làm tranh S01 theo `ART-BIBLE.md`.
2. Em dựng phần chạy tranh (đọc `scenes.json`, dùng lại khung trang của bản v4), lúc đầu dùng khung bố cục làm tranh tạm.
