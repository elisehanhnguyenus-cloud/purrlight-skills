# Google Universal Cart / UCP — ảnh hưởng tới Purrlight (21/10/2026)

Elise hỏi 21/10 sau khi đọc bài go.noti.vn. Tra bằng 3 người tìm (Google · Etsy & người bán nhỏ · website mình), 1 người
soát lại 54 ý (47 đúng, 5 sai đã sửa, 2 chưa rõ — không dùng), 1 người viết.

**1) Đây là gì, và có mới không**

- **UCP (Universal Commerce Protocol)** là một chuẩn chung, mở. Nhờ nó, trợ lý AI của Google (Gemini, AI Mode) có thể tìm hàng, đặt mua và hỗ trợ sau bán thay cho khách. Google công bố UCP ngày **11/01/2026**, và Etsy là một trong các bên cùng phát triển [1]. Phần này **không mới**.
- **Universal Cart** là giỏ hàng chung của Google. Khách lưu món từ nhiều shop vào một giỏ và được báo khi giảm giá. Lúc thanh toán, khách trả bằng Google Pay, hoặc Google điền sẵn giỏ trên web của shop để khách mua tiếp ở đó [3][4]. Google giới thiệu nó ngày 19/05/2026 [2] và **mở ở Mỹ từ 15/10/2026** trên Google Search (có AI Mode) và app Gemini [3]. **Phần này mới**: nó chạy được 6 ngày thì chị đọc bài. Bài go.noti.vn đúng về kỹ thuật, nhưng viết cho shop có hệ thống thanh toán riêng và không nhắc tới Etsy hay phí [5].

**2) Ảnh hưởng tới Purrlight**

- **Etsy: có, nhưng gián tiếp. Đây là kênh duy nhất cần để ý.** Từ 11/02/2026, Google bắt đầu cho khách Mỹ mua hàng Etsy ngay trong AI Mode và Gemini [6]. Chỉ "một số listing" đủ điều kiện, và khách mua dưới dạng khách vãng lai (guest) [7]. Etsy cũng không nhắc tới bước cài đặt nào phía người bán [8]. Hiện chưa rõ mấy điều: listing của mình có được chọn không, hàng Etsy có vào Universal Cart không (Google không nêu tên Etsy trong số shop ra mắt [3]), có phí thêm không, và có tắt được không.
- **Website (shop catalog + Custom Orders): không ảnh hưởng, không có gì hỏng.** Muốn tham gia thì shop phải có Google Merchant Center hoạt động tốt, làm phần kỹ thuật, nộp đơn và chờ Google chọn [9][10]. Web mình là trang tĩnh, nút mua dẫn sang Etsy, không có giỏ hàng (website/js/products.js). Hàng làm theo ảnh còn nằm trong nhóm "Personalized goods" mà Google không cho thanh toán qua UCP [9].
- **TikTok Shop: hiện chưa.** TikTok có "Buy Direct" dùng UCP (ra ngày 05/10/2026), nhưng đó là sản phẩm quảng cáo và đang thử nghiệm với số ít thương hiệu đủ điều kiện [11].
- **Booth: không.** Universal Cart chỉ dùng khi mua online [4].

**3) Chị nên làm gì**

*Làm ngay (không tốn tiền, vài giờ):*
1. Rà lại listing Etsy cho đủ: ảnh, giá, thời gian làm, chính sách đổi trả. Ghi rõ cách gửi ảnh ngay trong phần personalization, vì khách mua qua AI không nhắn được cho shop cho tới khi họ liên kết tài khoản Etsy [7].
2. Hỏi Etsy Support xem đơn từ Gemini/AI Mode có bị tính phí Offsite Ads (12–15%) không [12], và có tắt được không.

*Để sau (không bắt buộc, khoảng 1–2 giờ chỉnh code):* thêm dữ liệu sản phẩm (Product structured data) cho trang sản phẩm để Google hiểu trang rõ hơn [13]. Việc này giúp SEO bình thường, không phải UCP.

*Không cần:*
- Mở Merchant Center cho website: Google yêu cầu trang sản phẩm có nút Mua thật [14].
- Xây tích hợp UCP: GitHub Pages không cho dùng làm web bán hàng [15].
- Làm theo checklist trong bài đó.

**4) Rủi ro và điều cần để ý**

- **Giá lệch nhau:** khách mua qua Gemini trả giá Etsy (ví dụ Grand $150), không phải giá đặt trực tiếp $90–120. Ngay trên web mình đang hiện cả hai giá cho Grand, kèm hai cách ghi size khác nhau (products.js, prices.js). Nên ghi một dòng giải thích lý do. Nếu sau này dùng Merchant Center, giá khai báo phải khớp với trang sản phẩm [16].
- **Hàng làm theo đơn:** chưa rõ Etsy có đưa listing personalized vào thanh toán qua AI không.
- **Phí:** Google chưa công bố khoản phí nào, nhưng cũng chưa nói là miễn phí [17].
- **Quy mô:** Etsy cho biết lượt truy cập từ AI vẫn dưới 1% [18]. Không cần vội.

**5) Nguồn**

1. [Google, 11/01/2026](https://blog.google/products/ads-commerce/agentic-commerce-ai-tools-protocol-retailers-platforms/)
2. [Google I/O, 19/05/2026](https://blog.google/products-and-platforms/products/shopping/google-shopping-cart/)
3. [Google, ra mắt 15/10/2026](https://blog.google/products-and-platforms/products/shopping/universal-cart-launch/)
4. [Google Wallet Help](https://support.google.com/wallet/answer/17085590?hl=en)
5. [go.noti.vn](https://go.noti.vn/blog/google-universal-cart-ucp-la-gi)
6. [Google, 11/02/2026](https://blog.google/products/ads-commerce/digital-advertising-commerce-2026/)
7. [Etsy Help: mua qua AI](https://help.etsy.com/hc/en-us/articles/34208252828695-Purchasing-Etsy-Items-Through-ChatGPT-Gemini-Google-AI-Mode-and-Copilot)
8. [Etsy cập nhật cho shop](https://help.etsy.com/hc/en-us/articles/10603291042967-Newly-Crafted-Etsy-Updates-for-Your-Shop)
9. [Google UCP: điều kiện Merchant Center](https://developers.google.com/merchant/ucp/guides/overview/merchant-center)
10. [Merchant Center: shop được chọn](https://support.google.com/merchants/answer/16992327?hl=en)
11. [TikTok Buy Direct](https://ads.tiktok.com/business/en-US/blog/tiktok-agentic-solutions)
12. [Etsy Offsite Ads](https://help.etsy.com/hc/en-us/articles/360000338367-How-Etsy-s-Offsite-Ads-Work)
13. [Google: Product snippet](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
14. [Merchant Center: trang sản phẩm](https://support.google.com/merchants/answer/4752265?hl=en)
15. [GitHub Pages: giới hạn sử dụng](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
16. [Merchant Center: giá](https://support.google.com/merchants/answer/6324371?hl=en)
17. [Điều khoản UCP Checkout](https://merchants.google.com/files/tos/ucp_integration/US/1_00_tos.html)
18. [Etsy, báo cáo quý 2/2026](https://www.fool.com/earnings/call-transcripts/2026/08/12/etsy-etsy-q2-2026-earnings-call-transcript/)

## Phát hiện thêm (không thuộc UCP): điều khoản GitHub Pages

Trang "GitHub Pages limits" (https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits, đọc
21/10/2026) ghi: "GitHub Pages is not intended for or allowed to be used as a free web-hosting service to run your online
business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions
or providing commercial software as a service (SaaS)." và "GitHub Pages sites shouldn't be used for sensitive transactions
like sending passwords or credit card numbers."

Web Purrlight không nhận số thẻ (khách trả ở Square / Zelle), nhưng trang Custom Orders nhận đơn và dẫn tới chỗ trả cọc —
có rủi ro bị coi là trang bán hàng. Hướng xử lý đề xuất (chị quyết): mua tên miền riêng và chuyển sang một host cho phép
trang thương mại (kiểm điều khoản trước khi chuyển), trước khi quảng bá mạnh mùa lễ.
