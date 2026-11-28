# Chữ cho khách đang chờ chị Elise duyệt

Mỗi câu ở đây là bản nháp (tiếng Anh, đúng chữ khách sẽ thấy). Chưa duyệt thì phần chứa nó chưa "sẵn sàng". Chị duyệt
bằng cách nhắn số nhóm kèm chữ, ví dụ "G1 ok" hoặc "G2 sửa: …". Dòng nào chị đã duyệt: ghi ngày và chép nguyên văn tin
của chị, rồi chuyển xuống mục "Đã duyệt".

## G1. Giỏ hàng trên web (28/11/2026, `js/cart.js` mảng `T`, nhánh `claude/cart-front` của purrlight-web)

**Trang món**
- Add to Cart · Options · Choose one · `{label} — {price}` · `— sold out` · Choose an Option
- Only {n} left · Sold out for now
- Personalizing it? You'll type the details at checkout.
- Or buy it on Etsy · See it on Etsy

**Giỏ hàng (ngăn kéo và `cart.html`)**
- Your cart · Your cart is empty. · Shop All Pieces · Keep Browsing · One moment…
- {price} each · Remove · Subtotal · US shipping · Free
- {amount} away from free US shipping.
- Tax is worked out at checkout.
- Shipping and tax are worked out at checkout.
- Checkout · You'll pay on Stripe's checkout page.

**Thông báo**
- {name} is in your cart.
- That's the most of this piece we can add right now.
- Your cart is full. Please check out before adding more.
- Something in your cart is no longer available, so we took it out.
- We have {n} of {name} left, so we updated your cart.
- {name} just sold out. It is no longer in your total.
- Some pieces just changed. Please look over your cart, then try again.
- {name} is now {price}. · Please look over the new total, then press Checkout again.
- Some prices just changed. Please refresh the page, then try again.
- Checkout is busy right now. Please try again in a minute.
- Checkout is closed for the moment. Every piece is also in our Etsy shop.
- We couldn't start checkout. Please try again in a moment. Every piece is also in our Etsy shop.
- We couldn't load your cart. Please refresh the page.

**Cho người dùng trình đọc màn hình**
- Cart, 1 item / Cart, {n} items · Close cart · Quantity · One fewer: {name} · One more: {name}

**`cart.html`**: tiêu đề "Your cart — Purrlight Studio" · mô tả "Your Purrlight Studio cart." · khi tắt JavaScript:
"The cart needs JavaScript. Every piece is also in our Etsy shop."

**`order/thanks.html`**: tiêu đề "Thank you — Purrlight Studio" · mô tả "Thank you for your Purrlight Studio order." ·
"Thank you. Your order is in." · "Look for your receipt in your email." · nút "Keep Browsing", "Home".

## G2. Trang trả tiền của Stripe (28/11/2026, nhánh `claude/cart-server`)
- Tên dòng hàng: "<tên món trên web> — <nhãn lựa chọn>" (chỉ tên món khi món không có lựa chọn).
- Phí ship: "US shipping" ($5.99) hoặc "Free US shipping" (từ $55).
- Ô ghi chú (không bắt buộc, tối đa 255 ký tự): "Personalization".

## G3. Nhãn lựa chọn của từng món
Bảng duyệt riêng: https://claude.ai/artifact/Sa9hA7gWVE4D5msHwxUJZ2 (dữ liệu: `server/catalog/options-review.json`
trên nhánh `claude/cart-checkout`). 17 món chỉ cần duyệt nhãn, 11 món cần chị quyết.

## G4. Ba trang chính sách
Bản nháp từ phiên Etsy-shop: `drafts/privacy-policy.md`, `drafts/terms-of-sale.md`, `drafts/returns-policy.md` trên
nhánh `claude/cart-checkout`. Ghi chú bàn giao của phiên đó nói chị đã duyệt nội dung trong chat của phiên đó ngày
28/11; bên này chưa thấy tin của chị, nên vẫn để chờ chị xác nhận khi đưa lên.

## Đã duyệt
- 27/11/2026: dòng ghi chú cuối trang xác nhận booth (`DESK_CONFIG.recordLine`), chị nhắn "Ok duyệt dòng chữ mới".
