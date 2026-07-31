# 📋 Báo cáo mẫu — Deep Critique phản biện 10 vòng

> Trích lược từ một ca chạy thật (đã ẩn danh, rút gọn từ bản gốc **36 phát hiện / 10 vòng / ~10 nguồn web kiểm chứng**). Mục đích: cho bạn thấy trước khi cài, skill này trả về cái gì.

**Đề bài người dùng đưa:** *"Tôi định giảm giá 30% toàn shop handmade suốt quý 4 để kéo đơn mùa lễ, chạy kèm quảng cáo $20/ngày. Phản biện giúp tôi kế hoạch này trước khi bấm nút."*

---

## 🎯 Kết luận phản biện (3 dòng)

Kế hoạch ở dạng hiện tại nên **DỪNG** — không phải vì giảm giá là sai, mà vì "giảm 30% toàn shop suốt 92 ngày + quảng cáo phẳng" rút cạn **mọi bộ đệm cùng lúc** (tiền, thời gian, sức khỏe, giá, thuật toán) trên nền 3 con số chưa ai đếm: công suất làm hàng thật, cơ cấu sản phẩm, và mục tiêu thật của đợt giảm giá. Theo chính định giá rủi ro của báo cáo, xác suất ít nhất một sự cố vừa-nặng trong quý ≈ **90%**. Tồn tại phương án thay thế giữ ~80% lợi ích với ~20% rủi ro (chi tiết ở cuối).

## 🕳️ Top điểm mù (trích 5/36, xếp theo nghiêm trọng × xác suất)

| # | Điểm mù | Nghiêm trọng | Xác suất |
|---|---|---|---|
| 1 | "Toàn shop" chưa ai mở ra đếm: shop có cả **dòng sản phẩm digital** (biên lợi nhuận ~100%, không tốn giờ công) — phương án "giảm sâu dòng digital, giữ giá dòng làm tay" chưa từng được cân nhắc | 5/5 | Cao |
| 2 | Cả kế hoạch đứng trên giả định chưa kiểm: shop đang thiếu **khách** hay thiếu **công suất**? Hai câu trả lời dẫn tới hai chiến lược ngược nhau | 5/5 | Cao |
| 3 | Ngân sách quảng cáo dự chi **mâu thuẫn với trần ngân sách năm** ghi trong chính file kế hoạch nội bộ của người dùng (skill đọc file thật và bắt được) | 5/5 | Cao |
| 4 | Kế hoạch "zero-slack": ~8 rủi ro mức vừa nhân lại = ~90% có ít nhất một sự cố — từng rủi ro riêng lẻ đều "chấp nhận được" nên không ai làm phép nhân | 5/5 | Cao |
| 5 | Phí sàn chồng phí: mức "cho không" thật không phải 30% mà **39–54%** lợi nhuận gộp mỗi đơn; số đơn hòa vốn quảng cáo cao gấp 1,6–2,2 lần con số tính nhẩm | 5/5 | Cao |

## 🔍 Ví dụ 2 phát hiện chi tiết (đúng định dạng mọi phát hiện)

### [daonguoc-1] Máy sản xuất duy nhất là đôi tay của chủ shop — 92 ngày không thiết kế ngày nghỉ, không "chế độ hỏng hóc"
- **Mô tả**: nghề làm tay cường độ cao là nghề của chấn thương cổ tay; ốm 2 tuần giữa tháng 12 xóa luôn mùa bán Tết kế tiếp. Giảm giá + quảng cáo đang chạy sẽ khóa lối thoát.
- **Vì sao đây là điểm mù**: kế hoạch mặc định con người là hằng số; mọi dòng Excel đều đúng trừ dòng không ai viết ra.
- **Nghiêm trọng**: 5. **Xác suất**: vừa–cao.
- **Cách kiểm chứng rẻ nhất**: 1 tuần ghi nhật ký giờ làm + mức mỏi tay, nhân đôi lên theo tải kỳ vọng — nếu ra >5–6h/ngày × 3 tháng, kế hoạch tự phủ quyết. Viết sẵn "protocol ốm 7 ngày".

### [cacben-3] "Ranking hangover": thuật toán sàn học tỷ lệ mua ở giá −30% suốt 92 ngày; giá hồi +43% ngày 01/01 → thứ hạng tìm kiếm tụt đúng tháng bán hàng độc quyền nhất của shop
- **Vì sao đây là điểm mù**: neo giá trong bộ nhớ thuật toán khác neo trong tâm trí khách — không đàm phán được và trễ pha sang quý sau, khi ngân sách quảng cáo đã đốt hết.
- **Nghiêm trọng**: 4. **Xác suất**: vừa.
- **Cách kiểm chứng rẻ nhất**: chạy thử giảm giá 7 ngày trên 3 sản phẩm phụ, đo vị trí tìm kiếm + tỷ lệ mua trước/trong/sau.

## 🧪 3 kiểm chứng nên làm ngay tuần này

1. **Đếm công suất & cầu thật** (1 buổi tối): đơn 90 ngày qua ÷ số đơn tối đa làm nổi/tuần. <30% → kế hoạch kích cầu đúng hướng, chỉ cần sửa cấu trúc; >70% → hủy giảm giá toàn shop.
2. **Mở danh mục ra đếm** (1 giờ): tỷ trọng digital/physical theo doanh thu 6 tháng + lợi nhuận thật của 5 sản phẩm chạy nhất ở 3 mức giá.
3. **Test quảng cáo $35** (7 ngày, không kèm giảm giá): có số nền rồi mới được bàn ngân sách cả quý.

## 🤖 Giới hạn của bản phản biện này (skill tự khai)

10 vòng là 10 lượt của cùng một AI — hội tụ giữa các vòng không phải đồng thuận độc lập; AI không thể biết mục tiêu thật của người ra đề, dòng tiền cá nhân, và những cam kết đã hứa với người khác. Các con số minh họa cần thay bằng số thật của bạn trước khi quyết định.

## ❔ Câu hỏi ngược cho người ra đề (chỉ bạn trả lời được)

1. Hết quý, nếu chỉ được chọn MỘT kết quả: tiền lời — tiền mặt nhanh — kho sạch — hay câu trả lời "có nên theo đuổi tiếp không"?
2. 90 ngày qua bán được bao nhiêu đơn, và tay bạn làm tối đa bao nhiêu đơn/tuần trước hạn chót giao hàng lễ?
3. Bạn đã hứa, lên lịch, hay chi tiền cho phần nào của kế hoạch này rồi? (Nếu rồi, việc cần làm không phải là cản bạn — mà là dựng bản chạy an toàn.)

---

*Bản đầy đủ gồm 10 vòng: soi lại đề bài → mổ xẻ hệ thống → kiểm tra giả định (có tra cứu web) → luật sư của quỷ → đảo ngược → các bên liên quan → góc nhìn bên ngoài (số liệu ngành) → điểm mù của chính AI → pre-mortem & stress test → tổng hợp xếp hạng. Mỗi vòng bị cấm lặp lại phát hiện của vòng trước — vòng nào cạn phải khai "vòng khô" thay vì nói lại ý cũ.*
