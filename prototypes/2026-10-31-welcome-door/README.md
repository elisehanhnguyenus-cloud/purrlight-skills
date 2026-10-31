# Màn chào "cánh cửa xưởng" + chuyển trang mượt — bản thử 31/10/2026 (chưa vào website/)

Elise 31/10, sau khi xem kenailapp.com: "Ý chị là hiệu ứng trang đầu tiên khi vừa đến web đó. Và cả cách trải
nghiệm website mượt mà. Chị muốn web chị cũng như vậy trải nghiệm thú vị nhất quán."

Thư mục này nằm ngoài `website/`, nên không lên web. Giữ ở đây vì scratchpad có thể bị xóa khi máy khởi động lại.

- `intro.js`, `intro.css`: màn chào. Chỉ ở trang chủ, mỗi lần vào web một lần (sessionStorage). Không hiện khi bật
  giảm chuyển động (kể cả bật giữa chừng), khi vào bằng link có `#`, `?nointro`, trang bị nhúng (trừ `?intro=1`),
  trình duyệt tự động và máy dò; tắt JavaScript thì không có gì bị che. Có "Skip intro" và phím Esc; mũi móc len
  chậm dần rồi dừng sau 7 giây.
- `site-changes.diff`: phần thêm vào `index.html` (gắn màn chào, tiêu đề hai tông), `css/style.css` (màu nhấn hai
  tông, nút nhấn lún nhẹ, chuyển trang mượt) và `custom-orders/custom-orders.css` (chuyển trang mượt).

Chữ mới cần Elise duyệt: "Open chapter one", "Skip intro". Các câu khác là câu ký tên đã có ("Sketched by Merlin,
stitched by us", "Made by hand. Made to be kept.", "chapter one").

Khi Elise chọn: chép `intro.js` vào `website/js/`, `intro.css` vào `website/css/`, áp `site-changes.diff`, chạy
check-site và thử lại trên điện thoại.
