# Etsy — viết lại 27 listing để không còn là "đồ chơi trẻ em" (20/10/2026)

Chị chốt 20/10: hàng chưa kiểm nghiệm CPSIA, nhưng là hàng handmade — nhờ em đổi content "kiểu nó có thể phù hợp".
Dưới đây là **title + mô tả + 13 tag** sẵn để dán vào Etsy cho từng listing. Mỗi bản do một agent viết chỉ từ listing
hiện tại (không bịa fact), rồi một agent khác đối chiếu từng dòng với listing gốc và sửa; cuối cùng chạy bộ lọc từ cấm.

## Vì sao "handmade" không được miễn — và content giúp được tới đâu

- Luật Mỹ (CPSIA) coi một món là **children's product** khi nó được thiết kế hoặc nhắm **chủ yếu cho trẻ ≤ 12 tuổi**.
  CPSC xét 4 yếu tố: (1) người bán nói món đó dành cho ai (mô tả, nhãn), (2) cách đóng gói, trưng bày, quảng cáo,
  (3) người tiêu dùng thường hiểu món đó dành cho ai, (4) hướng dẫn xác định độ tuổi của CPSC.
  Nguồn: [CPSC — Children's Product definition](https://www.cpsc.gov/Business--Manufacturing/Business-Education/childrens-products),
  [16 CFR § 1200.2 — Definition of children's product](https://www.law.cornell.edu/cfr/text/16/1200.2).
- Children's product thì phải **kiểm nghiệm bởi lab được CPSC công nhận + Children's Product Certificate**. Hàng nhỏ
  lẻ có thể đăng ký **Small Batch Manufacturer** để bớt một phần kiểm nghiệm (nhóm B), nhưng **vẫn phải kiểm nghiệm
  nhóm A (chì trong sơn, đồ chơi trẻ nhỏ…) và vẫn phải có CPC**; nhà nhập khẩu chỉ được hưởng khi cả mình lẫn xưởng
  sản xuất đều đủ điều kiện. Nguồn: [CPSC — Small Batch Manufacturers](https://www.cpsc.gov/smallbatch).
- Content đổi được yếu tố (1) và (2): nói rõ món là **đồ trang trí / kỷ niệm / sưu tầm cho người lớn**, người nhận là
  người lớn (người yêu mèo, người mê sách, thầy cô, người sưu tầm), chỗ để là kệ sách, sofa, bàn làm việc, gương xe,
  bàn tiệc cưới. Content **không** đổi được yếu tố (3): một con thú len mềm vẫn có thể bị coi là đồ cho trẻ em, nên
  đây là giảm rủi ro, không phải miễn rủi ro. Vì vậy mọi listing đều có dòng chuẩn:
  *"A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep
  away from young children."* — và **không** còn chữ safe / hypoallergenic / safety eyes / ages 3+ / nursery / toddler…
- Ngoài text, chị cần đổi ở Etsy: **category** của listing (không chọn Toys & Games › Stuffed Animals / Baby), **section**
  "Nursery & Baby Plushies" → tên mới (ví dụ "Knitted Companions & Decor"), **ảnh** không có trẻ em cầm/chơi, và
  **tag/attribute** không chọn "Baby", "Kids", "Toddler". Việc này nằm trong `notes_vi` từng listing.
- Website đã đổi dòng an toàn cùng ngày: "Handmade decorative keepsake for adults and collectors. Not a toy and not
  tested as a children's product. Keep away from young children and open flame. Spot clean only."

## Cách dùng

1. Mở listing trên Etsy → Edit. 2. Dán **Title**. 3. Xoá mô tả cũ, dán **Description** (khối dưới). 4. Thay 13 **Tags**.
5. Làm các việc trong **Chị cần làm thêm**. 6. Save. Sửa xong báo em để em đồng bộ lại site (tên/giá/ảnh nếu đổi).
Những fact em không chắc (mâu thuẫn trong listing gốc) đều ghi ở **Chị cần làm thêm** — chị sửa theo đúng thực tế.


## Hội đồng soát (Morgan · Hải Đăng · Linh Trần · Minh Triết · Prue)

Theo lời chị dặn, việc content được 5 agent soát lại. Mỗi người đọc cả 27 bản theo chuyên môn của mình; 59 chỗ được sửa vào bản dưới đây, 10 góp ý không áp dụng (lý do ghi cuối mục).

**Morgan Chen — Marketing Manager** · Duyệt, kèm sửa (21 góp ý phải sửa)

> KẾT LUẬN: APPROVE_WITH_CHANGES. 27 bản đã đúng định vị keepsake cho người lớn. Còn 11 listing cần sửa nhỏ (20 chỗ, chỗ nào cũng là copy-paste), em đã chạy check.py = OK. Chị Elise duyệt rồi mới publish.
> 1. Dấu hiệu "hàng trẻ em" còn sót, đều kế thừa từ bản gốc kiểu nursery: 'Pastel Safari'/'jungle' (giraffe), 'party favors'/'stocking stuffer' (linen doll), 'Senior Night' (soccer), 'all your feelings are welcome here' (feelings faces), 'Mini Romper' (Siamese).
> 2. Sai mùa: Q4 là Christmas nhưng duck đang bán 'Spring/Easter', Washington còn '4th of July', angel còn 'Mother's Day', Saint Joan chỉ có Confirmation/feast day. Em đổi sang tag hoặc câu Christmas, không hứa ngày giao.
> 3. Sale tới 25/10 (Maine Coon, Saint Joan, rosary): không câu nào nhắc giá, % hay hạn, nên 26/10 không có gì sai.
> 4. Voice: phần thân đồng đều; chỉ khối ABOUT cuối bài có khoảng 7 kiểu. Chuẩn hoá ở vòng sau, không chặn publish.
> 5. Thời gian của chị: ước tính ~20 phút để dán hết, không có việc mới hằng ngày.
> Câu hỏi: chị có muốn em làm thêm vòng "Christmas tag pass" cho 7 bé mèo (mỗi listing đổi 1 tag, tháng 1 đổi lại) không?
> — Morgan Chen, Marketing Manager

**Hải Đăng — Ecommerce Executive** · Duyệt, kèm sửa (11 góp ý phải sửa)

> Elise, kết luận: APPROVE_WITH_CHANGES. 27/27 listing qua check.py: không còn toy/kids/safe/hypoallergenic, không IP watchlist, standard line đúng 1 lần ở 26 bản vật lý (số liệu: đếm trong review này).
> Current state: SEO giữ được phần cầu chính của buyer người lớn. 7/7 title mèo mở bằng 'Crochet [giống] Cat' kèm 'Amigurumi', 'cat lover gift' có ở 6/7. Cầu bị mất là plush/stuffed animal/nursery/stress ball, chủ yếu là người mua cho trẻ em, mất là đáng (qualitative estimate, không có keyword tool).
> Recommendations: 11 mục must-fix trên 9 listing. Nặng nhất là production partner: George Washington ghi 'our Vietnamese-American artisan team' và 'handmade by Purrlight Studio' trong khi hàng gửi từ VN. Bride & Groom thì 'Ships from Texas' + 'finished in our Pearland studio' dễ thành ngụ ý Made in USA, chị cần xác nhận nơi móc.
> Tiếp theo: linen doll bỏ tag 'stocking stuffer' và 'party favor' (cùng lý do team đã bỏ ở bộ Animal Friends). Duck bỏ 'Spring', 'Easter' và 'travel pillow' vì đang Q4 và sai intent. Thêm 'jane austen doll' cho 2 bộ Austen, front-load lại title Woodland và Grand pet.
> Implementation: chị paste bản đã sửa. Trên Etsy chị làm tay: chuyển category khỏi Toys/Baby, đổi section 'Nursery & Baby Plushies', đổi tên variation 'Premium'/'Deluxe', tick Production partner cho mọi món làm ở VN, cho processing time khớp mô tả, giữ 5 sale đến 25/10.
> Expected impact: rủi ro CPSIA/FTC/Etsy TOS giảm rõ. Traffic từ cụm 'plush toy' sẽ giảm nhưng conversion của khách người lớn giữ hoặc tăng (qualitative estimate). Em đề xuất đo bằng Etsy Stats 30 ngày sau khi đổi rồi báo chị số thật.

**Linh Trần — Social Media Executive** · Duyệt, kèm sửa (6 góp ý phải sửa)

> Elise ơi, Linh duyệt có chỉnh (APPROVE_WITH_CHANGES): copy của cả 27 listing chị dán lên Etsy được luôn, phần cần sửa chỉ nằm ở ghi chú ảnh (notes_vi).
> Brand voice ổn: ấm, có câu chuyện, không hard sell, không fake urgency; 160 ký tự đầu listing nào cũng nói rõ món gì, cho ai, đúng snippet Etsy. Cả bộ chỉ có 1 emoji (✝️ ở label Saint Joan), giá sale đến 25/10 không ghi vào mô tả — đúng.
> Ảnh pattern rồng đang nằm trong phòng em bé (gấu bông, khối gỗ, decal mây): chị crop sát con rồng, listing vẫn để low-key như chị muốn.
> Ảnh feelings faces (bảng 'Happy Hook Pouches', dấu 'Grateful') và mèo Grand (nhãn 'Bespoke by L.V.') có thể là ảnh của người khác: chị xác nhận giúp Linh, và tuyệt đối đừng xoá watermark của họ rồi dùng tiếp.
> Ảnh cừu và thiên thần chị đã quyết giữ — Linh chỉ xin tên/handle chủ ảnh để thêm một dòng credit.
> Búp bê vải: ảnh đầu nên là bản không chữ, ít nhất phải bỏ 'Freegift'.
> Dấu 'Grateful' có trên ảnh 3 listing (feelings faces, Washington, thiên thần) — chị chỉ cần trả lời một câu 'dấu này của ai' là Linh xử lý cả ba.
> — Linh Trần, Social Media Executive

**Minh Triết — R&D Manager** · Duyệt, kèm sửa (16 góp ý phải sửa)

> NÊN LÀM, nhưng duyệt có sửa: Elise có thể dán 27 listing sau khi áp 16 chỗ sửa. Tất cả đều là sửa chữ, không tốn tiền, không cần công cụ mới.
> • Đã đạt: 27/27 qua check.py. Size, chất liệu, tuỳ chọn và thời gian xử lý đều lần được về etsy_description gốc. Các chỗ mâu thuẫn đã được trung hoà và đưa vào notes_vi. Credit 'Pattern by Anna_Crochet' giữ nguyên, listing pattern vẫn low-key đúng ý chị.
> • Nặng nhất là IP. Mô tả Thiên thần 4467697803 đang lấy bé trong ảnh làm mẫu tay nghề, trong khi chị đã xác nhận ảnh đó không phải của mình. Phải bỏ mục đó và bỏ chữ 'Flower Bouquet' ở tiêu đề.
> • Báo động IP, chuyển Prue + Elise: con dấu 'Be thankful · Grateful · be blessed' của ảnh thiên thần cũng có trên ảnh Washington và ảnh Feelings Faces; ảnh mèo Grand có nhãn 'Bespoke by L.V.'. SUY LUẬN là ảnh từ bên ngoài, và quyết định ngày 20/10 của chị chưa bao gồm mấy ảnh này.
> • Ảnh AI không được trình như ảnh thật: bỏ câu 'studio lighting' ở 5 listing có ảnh AI và câu 'differences from the photos' ở listing Sense and Sensibility.
> • CHƯA BIẾT: bộ đồ của mèo Ginger, Tuxedo và White chỉ lấy từ prompt AI. Notes phải hỏi thẳng chị trước khi để trong tiêu đề.
> Minh Triết, R&D, cổng IP.

**Prue — Strategic Advisor & HR/Ops** · Duyệt, kèm sửa (8 góp ý phải sửa)

> [Nhận định] Elise, em DUYỆT CÓ SỬA. 26/26 món vật lý có đúng 1 dòng keepsake chuẩn ở cuối, mẫu rồng PDF không có; check.py OK cả 4 file; không còn toy/kids/baby/safe/ages, gần như không còn chỗ nào coi trẻ em là người dùng hay người nhận.
> [Cảnh báo rủi ro] (1) Maine Coon và Sense & Sensibility vẫn hứa "nothing to pay on delivery". Shop không kiểm soát được thuế/phí thu tại cửa (Canada thường thu GST + phí bưu điện), khách bị thu là mở case. (2) Búp bê linen còn "party favors / stocking stuffers": búp bê vải nhỏ mà quảng cáo vậy thì dễ bị đọc là quà tiệc trẻ em. (3) Ảnh thiên thần không phải của chị, mà mô tả lại hứa làm được chi tiết y như ảnh. (4) Ảnh búp bê cầu thủ có huy hiệu, mặt giống cầu thủ thật: đây là rủi ro IP, đẩy ảnh xuống sau không hết. (5) Web ghi "Spot clean only" trong khi Etsy cho giặt tay ở 5 món; web bỏ dòng an toàn ở chuỗi Mân Côi; trang sản phẩm hứa "duties and import fees already paid".
> [Giải pháp thực chiến] Sửa 8 chỗ trong must_fix (em đã chạy check.py, OK); chị chỉ phải dán lại text cho 4 listing. Đổi dòng an toàn trên web thành câu Etsy + "Keep away from open flame.", còn hướng dẫn giặt ghi theo từng món. Sticker POD và sách in tại nhà: viết cho người lớn, không dán dòng keepsake handmade, khai production partner trên Etsy.
> [Câu hỏi ngược] 1) Bên vận chuyển có trả trước thuế (DDP) cho Mỹ và Canada không, chị có giấy tờ không? 2) Cặp cô dâu chú rể có phải móc ở Việt Nam không? Ảnh có dấu "be blessed" và nhãn "Bespoke by L.V." có phải ảnh của chị không?

<details><summary>Góp ý không áp dụng (10)</summary>

- 4378892426 description (WAYS TO USE IT line): Hải Đăng's '…birthday gifts and Christmas gifts for friends' and Morgan Chen's edit 1 '…birthday or Christmas gifts for a friend' not used. Three reviewers rewrote the same line, so I took the safer option: Prue's version, which has no Christmas or stocking wording at all (CPSC factor 2; legal > SEO). Morgan's edit 2 was applied.
- 4378892426 tags: Hải Đăng's 'party favor'->'bridal party gift' not used. Morgan and Prue agree on 'bridal shower favor', and Prue is the legal reviewer.
- 4378892426 tags: for 'stocking stuffer', Hải Đăng's 'handbag charm' and Morgan Chen's 'christmas gift idea' not used. I took Prue's 'christmas ornament': the legal reviewer's choice, backed by the listing's own 'adorn a Christmas tree', and 'handbag charm' would nearly repeat the existing 'purse charm'.
- 4427983754 tags: Morgan Chen's 'spring decor'->'christmas gift idea' and 'easter mantel decor'->'cozy winter decor' not used. They conflict with Hải Đăng on the same two tags (SEO only). I took Hải Đăng's year-round set because the listing states no processing time or ship-from, so a Christmas-search tag invites a holiday-delivery expectation it cannot back. His set also fixes 'travel pillow'. Morgan's description line was applied.
- 4467726345 notes_vi[2]: Hải Đăng's replacement not used. It conflicts with Prue on the same note. Prue's is safer: it treats disclosing where the couple is made as required, not optional, and already covers his points (the 'Ships from Texas' opening, the suggested Vietnam sentence, the Etsy production-partner field).
- 4467697803 description: Prue's re-caption ('The photo shows one example of the style…') not applied. It conflicts with Minh Triết's fix, which deletes the whole 'THE ANGEL IN THE PHOTO' block. Removing it is safer than captioning it, since it stops presenting another maker's piece as our sample, and after the removal the line Prue edits no longer exists.
- 4548879570 notes_vi[0]: Linh Trần's full replacement not used word for word. Minh Triết also replaced this note, and his is safer: replace the photo with one the workshop takes, with no route to keep a third-party photo with credit. Linh's warning not to erase someone else's watermark was added to it.
- 4364432946 notes_vi[2]: Linh Trần's full replacement not used word for word. Minh Triết also replaced this note; I used his and added Linh's 'the first photo should not show the tag either way'. Linh's 'or credit it if the owner permits' option was dropped: a credited photo of another maker's piece still shows something the shop did not make.
- 4467697803 notes_vi[3] (Linh Trần): applied with changed wording, not word for word. Her text pointed to the 'THE ANGEL IN THE PHOTO' section, which no longer exists after Minh Triết's fix, so it now asks for a credit line at the end of the description.
- 4558481857 notes_vi (Morgan Chen, 'Add the line'): not added as a 5th note, because the BRIEF caps notes_vi at 0–4. The text was added word for word to notes_vi[2] instead.

</details>

## Danh sách (theo thứ tự shop)

1. [Crochet Maine Coon Cat, Handmade Amigurumi Shelf Decor, Ragdoll Colorway Option, Long-Haired Cat Lover Gift, Knitted Scarf, 10 in](#l4337395489) — Handmade Amigurumi Maine Coon Crochet Cat – Fluffy Plushie, …
2. [Linen Doll Bag Charm, Handmade Cottagecore Pocket Doll, Floral Dress with Lace, Bridesmaid Gift, Wedding Favor, Vintage Style Decor](#l4378892426) — Cottagecore Handmade Linen doll bag charm: Waldorf-Inspired …
3. [Anne Shirley Inspired Crochet Doll Set of 3, Anne of Green Gables Book Lover Gift, Red Braids Amigurumi, Classic Novel Shelf Decor](#l4367997103) — Anne Shirley Crochet Doll Set – Amigurumi Inspired by Classi…
4. [Sense and Sensibility Crochet Doll Set, Elinor Dashwood and Edward Ferrars, Jane Austen Gift, Regency Art Dolls, Book Lover Shelf Decor](#l4597361808) — Sense and Sensibility Crochet Doll Set, Elinor Dashwood and …
5. [Elizabeth Bennet and Mr Darcy Crochet Doll Set, Pride and Prejudice Gift, Jane Austen Regency Art Dolls with Wood Stands, Bookshelf Decor](#l4572077122) — Elizabeth Bennet and Mr Darcy Crochet Doll Set, Jane Austen …
6. [Crochet Ginger Tabby Cat, Handmade Amigurumi Orange Tabby, 10 in Home Decor, Outfit with Removable Accessories, Cat Lover Gift](#l4337392483) — Ginger Tabby Cat crochet Amigurumi: Handmade Plush Toy, 10in…
7. [Crochet Decade Rosary Car and Bag Charm, Rearview Mirror Rosary, Custom Color Catholic Keepsake, Catholic Gift for Adults](#l4592186429) — Crochet Decade Rosary Car and Bag Charm, Rearview Mirror Ros…
8. [George Washington Crochet Doll, Founding Father Amigurumi, History Teacher Gift, Patriotic Decor, 250th Anniversary 1776–2026 Keepsake](#l4467723974) — George Washington Crochet Doll, History Teacher Gift, Foundi…
9. [Custom Crochet Pet Portrait from Photos, Large Crochet Cat Look Alike 16-21 in, Personalized Cat Lover Gift, Pet Memorial Keepsake](#l4364432946) — Personalize Jumbo Cat & Pet Plushie crochet gift: Handmade D…
10. [Crochet British Shorthair Cat, Sherlock Holmes Inspired Outfit, Handmade Amigurumi Gray and White Decor, Detective Cat Gift for Book Lovers](#l4337895128) — British Shorthair Cat Crochet Amigurumi Plush: Custom Fluffy…
11. [Crochet Dragon Pattern PDF, Sleeping Dragon Amigurumi, Super Bulky Chenille Yarn, 47 Inch Giant Crochet Project, US Terms Digital Download](#l4399784660) — Crochet Dragon Plush Toy, Stuffed Animal Dragon, Nursery Dec…
12. [Large Knitted Horse Decor, Hand-Knitted Fluffy Pony Pillow, Farmhouse Sofa Accent, Equestrian Gift, Horse Lover Shelf Decor](#l4368649382) — Large Horse Plushie pillow for kids, Knitting Pony Toy, Fluf…
13. [Knitted Giraffe Decor, Large 60 cm Hand-Knitted Soft Sculpture, Pastel Living Room Decor, Giraffe Lover Gift, Boho Sofa Accent](#l4364454125) — Hand-Knitted Giraffe Plush Toy, Soft Yarn Safari Animal, Nur…
14. [Crochet Feelings Faces, Set of 3 or 6 Squeeze Balls, Office Desk Fidget, Hand-Embroidered Cotton Mood Faces, Coworker Gift](#l4548879570) — Emotional Support Stress Ball Set, Crochet Feelings Faces, S…
15. [Crochet Tuxedo Cat from Your Photo, Custom Amigurumi Pet Portrait, Handmade Black and White Cat Lover Gift, Personalized, 10 in](#l1889976910) — Tuxedo Cat Crochet Amigurumi Plush: Custom Handmade Toy cat …
16. [Knitted Mushroom and Woodland Decor, Hand-Knitted Hedgehog, Carrot, Tree, Acorn, Pumpkin, Cottagecore Shelf Accent, Fall Tiered Tray Decor](#l4427969443) — Hand-Knitted Woodland Garden Plushie Set, Mushroom, Hedgehog…
17. [Hand-Knitted Duck with Floppy Legs, Daisy Pocket and White Scarf, Cottagecore Farmhouse Decor, Cozy Sofa Pillow, Duck Lover Gift](#l4427983754) — Hand-Knitted Duck Plushie, Floppy Legs, Cottagecore Goose To…
18. [Hand-Knitted Sheep, Fluffy Lamb Bag Charm or Shelf Decor, Curly Fleece Knit, Farmhouse Accent, Sheep Lover Gift, Cream, Red, Caramel](#l4361808711) — Hand-Knitted Sheep Plush Toy, Fluffy Lamb Bag Charm, Farm Nu…
19. [Crochet Siamese Cat, Handmade Amigurumi Home Decor, Dressed or Body Only, Cat Lover Gift for Siamese Owners](#l4337384028) — Siamese Cat Crochet Amigurumi Plush Toy like photos, Custom …
20. [Crochet Animal Friends Amigurumi, Cat, Dog, Bear and Bunny in Cozy Outfits, Collectible Shelf Decor, Cat Lover Gift, Christmas Gift](#l4335293461) — Handmade Animal Plush Toy Set crochet: Cat, Dog, Capybara, L…
21. [Saint Joan of Arc Crochet Doll, Catholic Confirmation Gift, Name Saint Keepsake, Handmade Jeanne d'Arc, Feast Day Gift for Adults](#l4558481857) — Saint Joan of Arc Crochet Doll - Catholic Confirmation Name …
22. [Personalized Bride and Groom Crochet Couple, Anniversary Gift for Newlyweds and Parents, Wedding Keepsake, 50th Golden Anniversary Decor](#l4467726345) — Personalized Bride and Groom Crochet Couple, Anniversary Gif…
23. [Crochet White Cat, Handmade Amigurumi Kitty in an Outfit, 10 in Home Decor, Pink Nose, Cat Lover Gift, Removable Accessories](#l4336898722) — Custom White Cat Crochet Amigurumi Plush Like photos: Custom…
24. [Custom Soccer Player Crochet Doll from Photo, Personalized Football Amigurumi, Removable Team Jersey, Coach Gift, Soccer Fan Gift for Him](#l4467740813) — Custom Removable Outfit Soccer Player, Team Jersey Crochet D…
25. [Custom Crochet Angel Portrait Doll, Memorial Keepsake for Mom, Dad or Grandma, Amigurumi Angel Figurine, Sympathy Gift, Wooden Stand](#l4467697803) — Custom Amigurumi Angel Mother & Dad Doll, Portrait Crochet F…
26. [Crochet Christmas Elf, Handmade Nordic Holiday Decor, Amigurumi Elf Figurine, Tiered Tray Decor, Christmas Mantel Display, 10 in](#l4382239441) — Handmade Crochet Christmas Elf: Nordic Holiday Decor
27. [Crochet Calico Cat, Handmade Amigurumi Tricolor Kitty, 10 in Shelf Decor with Minidress, Cat Lover Gift, Calico Mom Present](#l4336274863) — Calico Cat crochet Amigurumi Plush Toy: Handmade plushie kit…

<a id="l4337395489"></a>
### Crochet Maine Coon Cat, Handmade Amigurumi Shelf Decor, Ragdoll Colorway Option, Long-Haired Cat Lover Gift, Knitted Scarf, 10 in

Listing: https://www.etsy.com/listing/4337395489 · giá hiện tại $41.25 (giảm từ $55.00) · section Etsy: Cat Lover Gift

Title cũ: *Handmade Amigurumi Maine Coon Crochet Cat – Fluffy Plushie, Home Decor, Cat Lover Gift, Custom Order*

**Title mới** (129 ký tự):

```text
Crochet Maine Coon Cat, Handmade Amigurumi Shelf Decor, Ragdoll Colorway Option, Long-Haired Cat Lover Gift, Knitted Scarf, 10 in
```

**Description:**

```text
Handmade crochet Maine Coon cat for cat lovers and collectors: a 10 in amigurumi with a small mane, tufted ears and a full fluffy tail, made to hold its shape on your shelf.

This is the big shaggy one, and it comes in both long-haired looks: Maine Coon and Ragdoll. Same body, the small mane, the tufted ear tips, the tail you can run your fingers through, worked in the colorway of whichever breed you love. She sits about 25 cm tall and stays upright on a bookshelf instead of slumping, because the body is crocheted at a tight tension that takes roughly 18 hours per cat.

DETAILS
• Size: approx. 25 cm / 10 in seated
• Weight: approx. 450 g / 1 lb
• Colorways: Maine Coon or Ragdoll
• Yarn: your choice of two, see CHOOSE YOUR YARN
• Filling: polyester fiberfill
• Eyes: plastic eyes
• Includes a knitted scarf
• Made entirely by hand; small differences in face and shape are the mark of that, not a flaw

CHOOSE YOUR YARN
The texture changes the whole character of the piece.
• Chenille velvet: dense soft pile with a faint sheen. It reads as velvet rather than crochet, and it is the one people reach out and touch first. Included in the price.
• Long-pile fur: genuinely shaggy, the closest thing to a real long-haired coat. +$20.
Message us if you want a colorway in a yarn that is not listed.

SHIPPING & DUTIES
• Ready to ship: boxed, and leaves our studio in Nha Trang, Vietnam in 1–3 business days, tracked door to door
• Estimated delivery: USA 9–15 days, UK & EU 10–20, Canada 10–20, Australia 10–20, elsewhere 10–30
• Import duties are included in the price you see

CARE
• Spot clean with a damp cloth, then air dry
• Do not machine wash or tumble dry
• Keep out of direct sun to protect the colors
• Crocheted in a smoke-free, pet-free studio

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

ABOUT VIET DELIGHT BY PURRLIGHT
Purrlight Studio LLC is a Texas company. Our cats are designed here and crocheted by hand by the artisans we work with in Vietnam. Our logo is Merlin, a real tuxedo cat and the reason this shop exists. Made by hand. Made to be kept.
```

**Tags (13):** `maine coon gift`, `ragdoll cat gift`, `crochet cat decor`, `amigurumi cat`, `fluffy cat figure`, `cat mom gift`, `handmade cat art`, `cat collector gift`, `bookshelf decor`, `chenille velvet cat`, `gift for cat owner`, `crochet maine coon`, `long haired cat`

**Đã đổi gì:**
- 'locked safety eyes', 'pull-tested before packing' and 'Recommended for ages 3+, supervise younger children' removed: untested safety and age claims; now just 'plastic eyes'
- 'Fluffy Plushie' and 'Custom Order' dropped from the title; reframed as shelf decor for cat lovers and collectors
- 'your choice of three' yarns corrected to the two yarns the listing actually names
- Conflict between 'boxed and ready to ship today' and 'every cat is made to order' neutralized: kept the stated 1–3 business day ready-to-ship line, dropped 'made to order'
- 'Reads as plush' reworded to 'reads as velvet'; British 'colourway/colours' changed to US spelling
- Standard adult keepsake line added before the About section
- Kept 'boxed' from 'boxed and ready to ship'; third-yarn mismatch now flagged for Elise

**Chị cần làm thêm:**
- Listing cũ vừa ghi 'sẵn hàng, gửi trong 1–3 ngày' vừa ghi 'mọi bé đều làm theo đơn' (tiêu đề có 'Custom Order'). Em giữ 'sẵn hàng, gửi trong 1–3 ngày làm việc' như bản trên web; nếu bản len lông dài (+$20) phải móc mới thì chị cho em thời gian làm để em thêm vào.
- Mô tả cũ ghi 'chọn 1 trong 3 loại len' nhưng chỉ kể 2 loại (chenille nhung, lông dài +$20). Em ghi 2 loại; nếu còn loại thứ 3 chị cho em tên và giá.
- Ảnh chính trông như dựng bằng AI và bày cạnh kệ kiểu phòng em bé (vịt, gấu, chăn nhỏ) — CPSC coi cách trưng bày là một dấu hiệu 'hàng trẻ em'. Theo ý chị vẫn giữ ảnh, nhưng đừng gắn listing này thành hàng Feature; nếu có ảnh thật bé trên kệ sách/sofa thì nên để làm ảnh đầu.
- Em bỏ vế 'nothing to pay on delivery' (không phải trả gì khi nhận): shop không kiểm soát được thuế/phí thu tại cửa ở mọi nước (Canada thường thu GST/HST + phí xử lý của bưu điện), chỉ giữ 'đã gồm thuế nhập khẩu'. Chị hỏi bên vận chuyển xem có trả trước thuế (DDP) cho từng nước không; đúng cho mọi nước thì mới thêm lại vế đó. Đang giảm 25% ($41.25) đến hết 25/10 — Etsy tự hiện giá nên mô tả không nhắc. Nếu listing đang ở danh mục Toys/Stuffed Animals thì chuyển sang Home & Living > Home Décor.


<a id="l4378892426"></a>
### Linen Doll Bag Charm, Handmade Cottagecore Pocket Doll, Floral Dress with Lace, Bridesmaid Gift, Wedding Favor, Vintage Style Decor

Listing: https://www.etsy.com/listing/4378892426 · giá hiện tại $22.00 · section Etsy: Bag Charms & Mini Gifts

Title cũ: *Cottagecore Handmade Linen doll bag charm: Waldorf-Inspired Toy 6 inches, pocket doll, birthday favor*

**Title mới** (131 ký tự):

```text
Linen Doll Bag Charm, Handmade Cottagecore Pocket Doll, Floral Dress with Lace, Bridesmaid Gift, Wedding Favor, Vintage Style Decor
```

**Description:**

```text
Handmade linen pocket doll and bag charm for cottagecore lovers: a small fabric doll in a floral dress with lace trim, made for your bag, your shelf or a wedding table.

Each doll is handmade in small batches, cottagecore and vintage in feel. She has a natural linen body, soft yarn hair and a simple, minimalist face, and wears a floral cotton dress with a lace hem, bow accents and hand-embroidered details. Light, soft and pocket-size. Each one has its own personality; no two are exactly alike.

WHAT'S INCLUDED
• 1 handmade linen doll in the style you choose

DETAILS
• Height: approx. 14–17 cm / 5.5–6.7 in
• Body: natural linen
• Dress: cotton, with lace hem and bow accents
• Hair: soft yarn
• Filling: fiberfill
• Hand embroidery; each piece is slightly different
• Handmade by the artists of the Viet Delight studio

OPTIONS
• Style: several dress prints and hair colors (see photos). Choose yours from the dropdown, or message us for a custom mix.
• Personalization: add a name or date on a gift card at no extra cost.

WAYS TO USE IT
• Hang it as a bag charm, or let it travel in your backpack
• Hang it on the Christmas tree
• Sit it on a shelf as cottagecore or vintage-style decor
• Wedding favors, bridesmaid proposals and birthday gifts for friends

GIFT-READY
• Ships in gift packaging
• Add a gift message and we print it on a mini card
• Gift wrap and an optional name tag are available
• Need a set for wedding favors, bridesmaid proposals or a boutique? Message us for bulk pricing and lead times.

PROCESSING & SHIPPING
• In-stock styles: 1–3 business days
• Personalized orders: 6–7 days
• Worldwide shipping with tracking
• US storage hub in Pearland, Texas

CARE
• Spot clean gently with a damp cloth
• Do not machine wash or tumble dry

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.
```

**Tags (13):** `cottagecore decor`, `linen rag doll`, `purse charm`, `mini doll charm`, `fabric doll`, `bridesmaid proposal`, `bridal shower favor`, `christmas ornament`, `gift for her`, `vintage style doll`, `floral cloth doll`, `handmade doll gift`, `backpack charm`

**Đã đổi gì:**
- 'Waldorf-Inspired Toy', 'tiny linen baby dolls', 'a first doll' and 'open-ended play' removed: toy and children's-product framing; now a bag charm and decor piece
- Safety section ('Recommended for newborns, toddlers & alls', 'Always supervise young children') replaced by the standard adult keepsake line
- 'Perfect for little hands', 'Lightweight for toddlers to hold', nursery shelf/decor, flower girl and Easter basket uses removed: child as user or recipient
- 'hypoallergenic fiberfill' to 'fiberfill' and 'eco gift packaging' to 'gift packaging': unsupported material and green claims
- Size conflict (14–17 cm, 15–17 cm, 5–7 in, 6 in in the title) settled on 14–17 cm / 5.5–6.7 in; gift-wrap contradiction ('free upgrade for 2+ dolls' vs 'complimentary') neutralized to 'gift wrap available'
- Math-alphabet headings replaced by plain CAPS labels; 'birthday favor' in the title replaced by bridesmaid gift and wedding favor
- 'sewn by hand' (method not stated in the listing) back to 'handmade in small batches'; 'What's included: 1 doll' and birthday gifting restored from the original

**Chị cần làm thêm:**
- Ảnh chính phủ nhiều chữ: 'Little Sunshine Sisters', 'Doll Bagcharm 6–7"', 'Keychain', 'Ornament', '8+ options color', 'Freegift' và chữ 'D'. Ảnh đầu nên là bản không chữ (ít nhất phải bỏ 'Freegift' vì Brand Canon cấm). Mô tả không nhắc khoen móc khóa hay dây treo: chị cho em biết búp bê có kèm không để em thêm vào DETAILS; nếu không kèm thì bỏ luôn chữ 'Keychain' và 'Ornament' trên ảnh.
- Kích thước listing cũ lệch nhau (14–17 cm, 15–17 cm, 5–7 in, tiêu đề 6 in). Em ghi 14–17 cm / 5.5–6.7 in — chị xác nhận giúp em.
- Gói quà: listing cũ vừa ghi 'miễn phí gói quà khi mua từ 2 búp bê' vừa ghi 'gói quà kèm theo' cho 1 búp bê, nên em chỉ ghi 'có gói quà và thẻ tên'. Dòng 'US Storage (Pearland, Texas hub)' em giữ là kho ở Pearland — chị xác nhận mẫu nào gửi từ Texas.
- Trong Etsy, nếu listing đang ở danh mục Toys/Dolls hoặc thuộc tính người nhận là Babies/Children, chị chuyển sang Accessories (bag charm) hoặc Home Décor và bỏ thuộc tính đó.


<a id="l4367997103"></a>
### Anne Shirley Inspired Crochet Doll Set of 3, Anne of Green Gables Book Lover Gift, Red Braids Amigurumi, Classic Novel Shelf Decor

Listing: https://www.etsy.com/listing/4367997103 · giá hiện tại $35.00 · section Etsy: Book Lover Gift

Title cũ: *Anne Shirley Crochet Doll Set – Amigurumi Inspired by Classic Novel, Red Braids Style*

**Title mới** (130 ký tự):

```text
Anne Shirley Inspired Crochet Doll Set of 3, Anne of Green Gables Book Lover Gift, Red Braids Amigurumi, Classic Novel Shelf Decor
```

**Description:**

```text
Anne of Green Gables inspired crochet doll set for book lovers and collectors: three handmade amigurumi dolls in vintage straw-hat looks, made for the reader's shelf.

For fans of the red-haired dreamer of L. M. Montgomery's 1908 novel. This set brings a touch of wholesome, old-world charm to a bookshelf: you receive three dolls, each around 15 cm tall, with outfits that feature straw hats, aprons, tiny books and flowers. It is a physical set crocheted for your order, not a digital pattern.

INSPIRATION
The collection is inspired by the 1908 coming-of-age novel by the Canadian author, celebrating the spirited red-haired heroine, her friends, and timeless themes of friendship, imagination and country life. Our designs are original interpretations, not reproductions of any film, television or licensed product.

WHAT YOU GET
• 3 crochet dolls, each about 15 cm / 6 in tall (handmade tolerance ±1–2 cm)
• Removable mini accessories (book, flowers, hat as shown)
• Gift-ready packaging

MATERIALS
• Cotton/acrylic yarn
• Plastic eyes
• Fiberfill
• Stitched details; the dolls stand with gentle support or lean against a shelf

OPTIONS
• Dress color palette: pastel, lavender, blue or neutral
• A short gift note on the packaging card

GOOD FOR
• Readers and classic literature fans
• Bookshelf and reading-nook decor, photography props
• Birthday, holiday, anniversary and housewarming gifts

MADE TO ORDER & SHIPPING
• Made to order; typical processing 7–12 business days
• Tracked worldwide shipping; gift message available

HANDMADE NOTES
Each piece is made by hand, so slight size and color variations (±1–2 cm) are natural and part of the charm.

CARE
• Spot clean with a damp cloth; air dry
• Keep away from pets and sharp objects

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Inspired by L. M. Montgomery's novel Anne of Green Gables (1908), which is in the public domain. Original design © Purrlight Studio LLC. Not affiliated with, endorsed by, or licensed by any rights holder, film or television production.
```

**Tags (13):** `anne of green gables`, `l m montgomery`, `bookish gift`, `literary gift`, `gift for reader`, `bookshelf decor`, `reading nook decor`, `kindred spirit gift`, `english teacher gift`, `cottagecore decor`, `red hair doll`, `crochet doll set`, `classic book gift`

**Đã đổi gì:**
- '[Please attenttion…]' banner removed; replaced by a plain sentence that this is a physical set made to order, not a digital pattern
- 'safety eyes' to 'plastic eyes', 'hypoallergenic filling' to 'fiberfill'; 'Premium', 'Securely stitched' and 'eco packaging' dropped: untested or unsupported claims
- 'Nursery styling' and 'Not a toy for children under 3' removed: replaced by bookshelf/reading-nook use and the standard adult keepsake line
- Size conflict ('around 15 cm' vs '>15 cm or 20 cm / 6–8 in') settled on about 15 cm ±1–2 cm, as the main text and our site say
- Author corrected from 'Lucy M.' to L. M. Montgomery; the heroine is now 'inspired by'; disclaimer rewritten to match the public-domain novel, and 'copywrite & TM by Purrlight LLC' replaced by '© Purrlight Studio LLC'
- Title now says 'Set of 3' and adds 'Anne of Green Gables', book-lover and shelf-decor keywords
- 'Hand-stitched details' to 'Stitched details': the listing said only 'securely stitched', so 'hand-stitched' was a new claim

**Chị cần làm thêm:**
- Ảnh chính chỉ có 1 búp bê nhưng listing bán bộ 3. Chị đưa ảnh cả bộ 3 con lên đầu; nếu thật ra bán 1 con thì báo em sửa lại mô tả và tiêu đề.
- Kích thước cũ lệch nhau: 'khoảng 15 cm' và '>15 cm hoặc 20 cm (6–8 in)'. Em ghi khoảng 15 cm ±1–2 cm — chị xác nhận.
- Em bỏ câu 'hold copywrite & TM by Purrlight LLC' (sai chính tả, sai tên công ty; nhận TM cho mẫu lấy cảm hứng từ nhân vật nổi tiếng thì nên hỏi luật sư trước) và thay bằng '© Purrlight Studio LLC'.
- Tên sách Anne of Green Gables đã hết bản quyền nên được dùng trong tiêu đề, nhưng nhãn hiệu 'Anne of Green Gables' ở Canada do một cơ quan cấp phép nắm giữ. Nếu chị bán nhiều sang Canada, cân nhắc bỏ tên sách khỏi tiêu đề.


<a id="l4597361808"></a>
### Sense and Sensibility Crochet Doll Set, Elinor Dashwood and Edward Ferrars, Jane Austen Gift, Regency Art Dolls, Book Lover Shelf Decor

Listing: https://www.etsy.com/listing/4597361808 · giá hiện tại $40.99 · section Etsy: Book Lover Gift

Title cũ: *Sense and Sensibility Crochet Doll Set, Elinor Dashwood and Edward Ferrars, Regency Art Dolls*

**Title mới** (135 ký tự):

```text
Sense and Sensibility Crochet Doll Set, Elinor Dashwood and Edward Ferrars, Jane Austen Gift, Regency Art Dolls, Book Lover Shelf Decor
```

**Description:**

```text
Sense and Sensibility crochet doll set: Elinor Dashwood and Edward Ferrars as hand-crocheted Regency art dolls, made for the Jane Austen reader's bookshelf or desk.

"Know your own happiness." (Sense and Sensibility, 1811)

Elinor is the sister who keeps her head while everyone around her loses theirs. Edward is the quiet man who takes far too long to say what he means. This pair is for the reader who has always been on Elinor's side.

Every piece is crocheted stitch by stitch. Elinor wears a slate-blue gown with a scalloped hem, a sage-green crossover shawl, and a scalloped blue bonnet over long dark ringlets. Edward wears a moss-green tailcoat over a charcoal buttoned waistcoat, a dark neckcloth, sage breeches, black riding boots, and a brown top hat that lifts off.

THE SET
• Elinor Dashwood and Edward Ferrars: buy the pair, or either doll on its own
• Height: approx. 18 cm / 7 in each
• Edward's top hat is removable
• Yarn: cotton
• Filling: polyester fiberfill
• Made by hand; small differences in stitch and expression are part of that, not a flaw

A COLLECTIBLE FOR DISPLAY
Made for a bookshelf, a reading nook, or a desk beside a well-loved copy of the novel.

MADE TO ORDER & SHIPPING
• Crocheted for you over 3–4 weeks
• Shipped tracked from our artisan partners in Vietnam
• Estimated US and Canada delivery: 9–15 days
• Import duties are included in the price

CARE
• Dust gently or spot clean with a damp cloth, then air dry
• Do not machine wash or tumble dry
• Keep out of direct sun to protect the colors

COMPLETE THE SHELF
Elizabeth Bennet and Mr Darcy from Pride and Prejudice are also in our shop, in the Book Lover Gift section.

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

ABOUT VIET DELIGHT BY PURRLIGHT
Hand-crocheted by the artisan partners we work with in Vietnam, for Purrlight Studio LLC, a Texas company. Made by hand. Made to be kept.

Original design © Purrlight Studio LLC. Inspired by Jane Austen's novel of 1811, which is in the public domain. Not affiliated with, endorsed by, or licensed by any film, television or publishing company.
```

**Tags (13):** `jane austen fan gift`, `austen collectible`, `regency couple`, `period drama gift`, `bookish gift for her`, `gift for reader`, `literary art doll`, `crochet couple doll`, `bookshelf decor`, `dark academia decor`, `reading nook decor`, `jane austen doll`, `classic novel gift`

**Đã đổi gì:**
- Launch-price line ($69.99 for the first three sets, then $78) removed: it conflicts with Etsy's $40.99 and goes stale after three sales
- Placeholder 'Eyes: [safety eyes / embroidered]' removed until the eye type is confirmed
- 'A COLLECTIBLE, NOT A TOY' heading and 'Not intended for children under 14' replaced by a display heading and the standard adult keepsake line
- 'Shipping … included in the price' dropped (Etsy shows shipping itself); duty line and the 9–15 day delivery kept, labeled as an estimate
- Duplicate inspiration/disclaimer paragraph removed; trilingual SEARCH TERMS block removed and its strongest English phrases moved to tags
- Emma Woodhouse & Mr Knightley cross-sell removed: no such listing in the current shop catalog
- 'from the options menu' dropped: the listing does not say how the pair/single choice is offered

**Chị cần làm thêm:**
- Giá: mô tả cũ ghi 'Launch price $69.99 cho 3 bộ đầu, sau đó $78' nhưng Etsy đang hiện $40.99 (có lẽ là giá 1 con). Em bỏ hết số giá khỏi mô tả; chị kiểm tra giá cặp và giá lẻ trong phần biến thể.
- Mắt: câu cũ còn placeholder '[safety eyes / embroidered]', em đã bỏ — chị cho biết mắt nhựa hay mắt thêu để em thêm. Ảnh có đế gỗ nhưng THE SET không nói có kèm đế; chị xác nhận.
- Ảnh chính trông như dựng bằng AI: chị cứ giữ, nhưng nếu có ảnh chụp thật cặp búp bê thì đưa ảnh thật lên đầu và đẩy ảnh AI xuống sau. Chị cũng kiểm tra 'giao US/Canada 9–15 ngày' và 'đã gồm thuế nhập khẩu' còn đúng không.
- Mục COMPLETE THE SHELF cũ nhắc bộ Emma Woodhouse & Mr Knightley, nhưng em không thấy listing này trong shop nên đã bỏ. Khi listing Emma lên, gửi em để thêm lại.


<a id="l4572077122"></a>
### Elizabeth Bennet and Mr Darcy Crochet Doll Set, Pride and Prejudice Gift, Jane Austen Regency Art Dolls with Wood Stands, Bookshelf Decor

Listing: https://www.etsy.com/listing/4572077122 · giá hiện tại $44.00 · section Etsy: Book Lover Gift

Title cũ: *Elizabeth Bennet and Mr Darcy Crochet Doll Set, Jane Austen Regency Art Dolls*

**Title mới** (137 ký tự):

```text
Elizabeth Bennet and Mr Darcy Crochet Doll Set, Pride and Prejudice Gift, Jane Austen Regency Art Dolls with Wood Stands, Bookshelf Decor
```

**Description:**

```text
Elizabeth Bennet and Mr Darcy, hand-crocheted as a pair of Regency art dolls: a Pride and Prejudice gift for Jane Austen readers and collectors, made for the bookshelf.

She wears a sage green empire-waist gown with a scalloped hem and a soft white spencer. He wears a navy tailcoat, a white cravat and tall black riding boots. Every face is embroidered by hand, one stitch at a time, which is why no two pairs are ever quite the same. Each doll arrives on its own turned wooden stand, so the two of them can stand together on a shelf.

WHAT'S INCLUDED
• Elizabeth Bennet doll, approx. 18 cm / 7 in tall
• Mr Darcy doll, approx. 18 cm / 7 in tall
• 2 natural turned wood display stands

DETAILS
• Materials: cotton blend yarn, polyester fiberfill, embroidery floss for the faces, natural wood stands
• Height: approx. 18 cm / 7 in each, not counting the stand
• Shipping weight: approx. 500 g / 1.1 lb for the pair, boxed
• Made to order; small variations in stitch and expression are part of handmade work, not a flaw

A COLLECTIBLE FOR DISPLAY
These are display art dolls, made in small numbers for adult collectors and readers. Please keep them away from pets.

CARE
Spot clean only, with a barely damp cloth and a little mild soap. Do not machine wash, do not soak, do not tumble dry. Reshape gently and let air dry away from direct sunlight.

MADE TO ORDER: PLEASE READ BEFORE YOU BUY
Your pair is crocheted after you order, not pulled off a shelf.
• Crochet time: 2–3 weeks
• Transit with tracking: 2–3 weeks
• Total: approximately 4–6 weeks from order to your door
Designed in Pearland, Texas, and hand-crocheted by the artisan partners we work with in Vietnam. Ships from Vietnam with tracking.

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

ABOUT PURRLIGHT STUDIO
Purrlight Studio is a small Vietnamese-American studio in Pearland, Texas. We design keepsakes here and make them by hand with the artisans we work with in Vietnam: slowly, in small numbers, the way these things were always made.

Original design © Purrlight Studio LLC. Inspired by Jane Austen's Pride and Prejudice (1813), which is in the public domain. Not affiliated with, endorsed by, or licensed by any film, television or publishing company.
```

**Tags (13):** `jane austen fan gift`, `darcy and lizzy`, `austen collectible`, `regency couple`, `period drama gift`, `bookish gift for her`, `gift for reader`, `literary art doll`, `crochet couple doll`, `dark academia decor`, `jane austen doll`, `reading nook decor`, `english lit gift`

**Đã đổi gì:**
- 'stands on your bookshelf, not in a toy box' and 'COLLECTIBLE, NOT A TOY' reworded: no toy wording outside the standard line
- 'not intended for children under 14' and 'keep them away from young children' replaced by the standard adult keepsake line; 'keep away from pets' kept
- 'premium cotton blend yarn' to 'cotton blend yarn': Brand Canon
- 'Shipping is free' removed: Etsy shows shipping itself; the approximate 4–6 week order-to-door estimate kept
- 'Pride and Prejudice' (public domain) added to the title and disclaimer for search; 'exactly as you see them here' dropped

**Chị cần làm thêm:**
- Ảnh chính trông như dựng bằng AI (cảnh giỏ len, kệ sách): chị cứ giữ, nhưng nếu có ảnh chụp thật cặp búp bê trên đế gỗ thì đưa ảnh thật lên đầu và đẩy ảnh AI xuống sau.
- Em bỏ câu 'Shipping is free' (nếu shipping profile đang miễn phí thì Etsy tự hiện). Em giữ ước tính 'khoảng 4–6 tuần từ lúc đặt tới tay khách' — chị xác nhận còn đúng.
- Trong Etsy, nếu listing đang ở Toys & Games > Dolls, chị chuyển sang Art & Collectibles > Dolls & Miniatures (art dolls) hoặc Home Décor.


<a id="l4337392483"></a>
### Crochet Ginger Tabby Cat, Handmade Amigurumi Orange Tabby, 10 in Home Decor, Outfit with Removable Accessories, Cat Lover Gift

Listing: https://www.etsy.com/listing/4337392483 · giá hiện tại $55.00 · section Etsy: Cat Lover Gift

Title cũ: *Ginger Tabby Cat crochet Amigurumi: Handmade Plush Toy, 10in, cat lover home decor*

**Title mới** (126 ký tự):

```text
Crochet Ginger Tabby Cat, Handmade Amigurumi Orange Tabby, 10 in Home Decor, Outfit with Removable Accessories, Cat Lover Gift
```

**Description:**

```text
Handmade crochet ginger tabby cat for orange-cat people: a 10 in amigurumi in warm ginger with a white belly and a pink nose, crocheted to order for your desk or bookshelf.

If an orange cat runs your house, you already know the look: the ginger coat, the white tummy, the pink nose. This one is worked by hand in orange yarn with a white belly and white paws, in a sweet Japanese/Korean-inspired style. She comes dressed in an outfit with removable accessories, so you can show her off fully dressed or set the accessories aside and let the ginger coat do the talking.

Please note: you are buying the finished crocheted cat, made for your order, not a pattern or a digital download.

DETAILS
• Size: about 10 in
• Colors: orange (ginger) with a white belly, white paws and a pink nose
• Outfit with removable accessories
• Crocheted entirely by hand

MADE TO ORDER & SHIPPING
• Processing time: 1–2 weeks, crocheted for your order
• Estimated delivery after it ships:
• USA: 9–15 days, tracked with USPS
• UK & Europe: 10–20 days, tracked with Royal Mail
• Canada: 10–20 days, tracked with Canada Post
• Australia: 10–20 days, tracked with Australia Post
• Other countries: 10–30 days by post

GOOD TO KNOW
• Colors can look slightly different from one screen to another
• Every cat is handmade, so size and shape vary a little; the differences are minor

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Thank you for shopping with Viet Delight.
```

**Tags (13):** `orange cat gift`, `ginger cat lover`, `crochet tabby cat`, `amigurumi cat`, `cat mom gift`, `orange cat decor`, `handmade cat gift`, `desk cat decor`, `cat lover present`, `crochet cat figure`, `tabby cat gift`, `bookshelf decor`, `cat owner gift`

**Đã đổi gì:**
- AI-prompt text ('Crochet pattern for…', 'The design should reflect…', 'The pattern must capture…') replaced with a real description of the finished cat
- 'Plush Toy' removed from the title and 'for added playability' dropped: toy framing; now pitched as desk or shelf decor
- '[Please attenttion…]' banner replaced by a plain line saying it is the finished cat, not a pattern
- Stale 'In-stock USA: upcoming (on next September 2025)' removed
- Kept colors, 10 in size, outfit, 1–2 week processing and carrier delivery estimates; added the standard adult keepsake line

**Chị cần làm thêm:**
- Em bỏ dòng 'In-stock USA: upcoming (September 2025)' vì đã quá hạn — nếu giờ có sẵn hàng ở Mỹ chị báo em thêm lại.
- Ảnh chính: bé không mặc đồ, không phụ kiện, len vàng mù tạt hơn là cam, chân không trắng như mô tả, và có thể là ảnh AI. 'Bộ đồ + phụ kiện tháo rời' chỉ lấy từ đoạn prompt AI cũ ('should be dressed…'), chưa có gì xác nhận (CHƯA BIẾT) mà tiêu đề lại nêu ngay: chị xác nhận bé gửi đi có kèm bộ đồ và phụ kiện không; nếu không, em bỏ khỏi tiêu đề và mô tả. Theo ý chị vẫn giữ ảnh, nhưng đừng gắn listing này thành hàng Feature.
- Nếu listing đang ở danh mục Toys/Stuffed Animals trên Etsy thì chuyển sang Home & Living > Home Décor.


<a id="l4592186429"></a>
### Crochet Decade Rosary Car and Bag Charm, Rearview Mirror Rosary, Custom Color Catholic Keepsake, Catholic Gift for Adults

Listing: https://www.etsy.com/listing/4592186429 · giá hiện tại $18.75 (giảm từ $25.00) · section Etsy: Baptism & Catholic Gift

Title cũ: *Crochet Decade Rosary Car and Bag Charm, Rearview Mirror Rosary, Custom Color Catholic Keepsake*

**Title mới** (121 ký tự):

```text
Crochet Decade Rosary Car and Bag Charm, Rearview Mirror Rosary, Custom Color Catholic Keepsake, Catholic Gift for Adults
```

**Description:**

```text
Crochet decade rosary car and bag charm for Catholic adults: cotton crochet over wood beads with a metal crucifix, in your choice of color. Hand-strung in Texas, ships in 2–4 business days.

A quiet reminder to pray on the road. Each one-decade rosary is strung by hand in our Pearland, Texas studio from cotton crochet-covered wood beads that are soft to the touch. Ordering 5 or more? Message us through Etsy for a bundle price.

WHAT YOU GET
• One decade rosary with a clasp at the top for hanging
• A cloth pouch and our standard prayer card in English (Our Father, Hail Mary, Come Holy Spirit)
• Crucifix pendant, or choose "Photo charm" in the Pendant menu and upload your photo

GIFT BOX + CUSTOM CARD (OPTIONAL)
Fill in the "Gift box + custom card" box to add a gift box and a personalized card. Tell us the language (English, French, Spanish, Portuguese, Russian or Vietnamese), the recipient's name and a short message. Want your car on the card? Upload a clear photo and we paint it on the front as a digital watercolor. You approve a preview before we print. Adds up to 3 business days.

SET OF 2
Choose "Set of 2" in the menu. If you add the gift box + custom card, a set of 2 comes with one gift box and one card for the set.

DETAILS
• 10 crochet-covered wood beads plus 1 separate bead, with natural wood spacers
• Length: about 7 to 9.5 in (18 to 24 cm) depending on the design
• Materials: cotton yarn over wood beads, wood spacers, metal alloy crucifix
• About 30 colors, shown in the color chart photo. Type your color codes in the colors box, or write "surprise me" and we will pick for you.
• Handmade to order, so bead size and shade vary slightly from the photos

HOW TO USE
Clip it around the rearview mirror stem, a bag strap or a keyring. Please hang it where it does not block your view of the road, and check your local rules on mirror hangings.

GOOD TO KNOW
• Made to order and shipped from Texas in 2–4 business days
• You are welcome to bring it to your priest for a blessing
• Contains small parts
• Spot clean only

A handmade devotional keepsake for adults. Not a toy and not tested as a children's product; keep away from young children.
```

**Tags (13):** `car rosary`, `one decade rosary`, `crochet rosary`, `catholic car charm`, `mirror hanging`, `prayer beads`, `religious gift`, `new car gift`, `photo charm rosary`, `wood bead rosary`, `rosary keychain`, `catholic mom gift`, `catholic christmas`

**Đã đổi gì:**
- 'Choose "Set of 2" to get Freeshipping' removed: no free-shipping wording in the copy (Etsy shows shipping itself); Set of 2 kept as a menu option
- Old 'A devotional keepsake for adults, not a toy...' line replaced by the standard devotional keepsake line; 'Contains small parts' kept
- Bead count contradiction ('10 or 11 beads plus 1 larger bead' vs '10 beads plus 1 larger bead', photo shows 11 same-size beads) neutralized to '10 beads plus 1 separate bead' until Elise confirms
- Opening line now says who it is for ('for Catholic adults'); 'Catholic Gift for Adults' added to the title
- 'ships in 2-4 days' aligned with the later '2–4 business days'; hyphen bullets changed to '• '

**Chị cần làm thêm:**
- Số hạt không khớp: chỗ ghi '10 hoặc 11 hạt + 1 hạt lớn', chỗ ghi '10 hạt + 1 hạt lớn', còn ảnh là 11 hạt bằng nhau (10 đỏ, 1 xanh). Em tạm ghi '10 hạt + 1 hạt riêng' — chị xác nhận số hạt và hạt kia có lớn hơn không. Ảnh còn có mề đay oval phía trên thánh giá mà mô tả chưa nhắc.
- Đã bỏ câu 'chọn Set of 2 để được Freeshipping'. Chị kiểm tra hồ sơ vận chuyển trên Etsy xem Set of 2 có thật sự miễn ship không — Etsy sẽ tự hiện cho khách.
- Đang giảm 25% ($18.75) đến hết 25/10 — mô tả không ghi giá hay hạn giảm vì Etsy tự hiện; sau 25/10 giá về $25.
- Section 'Baptism & Catholic Gift' gợi ý quà rửa tội cho em bé. Chị cân nhắc để chuỗi Mân Côi và Saint Joan trong một section riêng kiểu 'Catholic Gifts & Keepsakes'.


<a id="l4467723974"></a>
### George Washington Crochet Doll, Founding Father Amigurumi, History Teacher Gift, Patriotic Decor, 250th Anniversary 1776–2026 Keepsake

Listing: https://www.etsy.com/listing/4467723974 · giá hiện tại $42.00 · section Etsy: Book Lover Gift

Title cũ: *George Washington Crochet Doll, History Teacher Gift, Founding Father, 250th USA, Movie Fan Plush*

**Title mới** (134 ký tự):

```text
George Washington Crochet Doll, Founding Father Amigurumi, History Teacher Gift, Patriotic Decor, 250th Anniversary 1776–2026 Keepsake
```

**Description:**

```text
George Washington crochet doll: a handmade Founding Father collectible for history lovers, history teachers' desks and collectors, marking 250 years of American independence (1776–2026).

MEET THE GENERAL
The first piece in our Founding Fathers collection, crocheted stitch by stitch as a keepsake for history lovers, teachers, collectors and proud patriots: a display piece honoring the man who led a nation, and a meaningful gift for the 250th anniversary of American independence.

This listing is for one George Washington doll, in your choice of two sizes. Some photos show him beside other Founding Fathers figures.

FOR THE HISTORY TEACHER'S DESK
A friendly desk companion for a social studies teacher, or a history buff's bookshelf. A small, warm nod to the American Revolution.

DETAILS
• Handmade crochet (amigurumi) in soft acrylic/wool blend yarn
• Continental Army blue coat, tricorn hat, hand-detailed features
• Plastic eyes
• Two sizes: 8 in (~20 cm) standard display size, or 10 in (~25 cm) large size

MAKE IT YOURS (optional)
Add a hand-stitched American flag or sword accessory. Message us to customize before we make your doll.

A small surprise thank-you gift comes with every order.

HAND-CROCHETED, NOT MASS-PRODUCED
Every doll is crocheted by hand by a real artisan. Because each piece is made to order, we send you a preview photo of your doll for approval before we ship, so you know exactly what's arriving.

CARE
• Spot clean gently with a damp cloth
• Keep away from moisture; do not machine wash

SHIPPING
• Handcrafted to order by the artisan partners we work with in Vietnam
• Processing time: 3–5 business days
• Ships from Vietnam (about 10–14 business days to the US), or from Pearland, Texas, for in-stock dolls
• Want it for a specific date? Message us first and we'll confirm.

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

ABOUT PURRLIGHT STUDIO
A Texas-based Vietnamese-American studio. Every piece is designed in Pearland, TX, and handcrafted by the artisan partners we work with in Vietnam, with intention, detail and love.

A historical-figure tribute, designed by Purrlight Studio. An independent artisan collectible, not affiliated with or endorsed by any film, musical or stage production.
```

**Tags (13):** `history buff gift`, `social studies gift`, `american history`, `founding fathers`, `1776 2026`, `semiquincentennial`, `teacher xmas gift`, `patriotic gift`, `gift for dad`, `teacher desk decor`, `revolutionary war`, `teacher retirement`, `us history gift`

**Đã đổi gì:**
- First line's 'George Washington, Thomas Jefferson, Franklin Benjamin crochet doll trio set' replaced: the listing sells one Washington doll in two sizes; the reversed 'Franklin Benjamin' is gone
- Stale 'Jefferson & Franklin join the collection in 2026' and 'From mid-July 2026…' lines removed; ship-from merged into one neutral line
- 'Movie Fan Plush', musical/Broadway/film SEO and '250th USA/America 250' removed: trademark risk and Brand Canon; now '250th anniversary of American independence (1776–2026)'
- 'Safety eyes securely attached' to 'plastic eyes'; 'More than a toy', 'not intended for infants' and 'premium' removed; standard adult keepsake line added
- Classroom/homeschool 'teaching piece' reworded as a desk piece for the history teacher: adults, not students, as the users
- 'NOT AI … our photos show our actual work' removed: some photos are AI-rendered, so the claim would mislead
- 'free surprise mini-gift' reworded to 'small surprise thank-you gift'; EN/ES keyword block at the end removed
- 'with tracking' removed from the ship-from line and 'from the collection' cut from the photo note: neither is stated in the listing (tracking never mentioned; Jefferson/Franklin availability unconfirmed)

**Chị cần làm thêm:**
- Ảnh chính: 3 búp bê trong hộp mica với bảng 'Fathers Founding United State America 250th Birthday' (sai ngữ pháp), trông như dựng bằng AI. Con dấu 'Be thankful · Grateful · be blessed' trên ảnh giống hệt con dấu trên ảnh thiên thần mà chị đã xác nhận không phải ảnh của chị, nên nhiều khả năng cùng một nguồn bên ngoài (SUY LUẬN). Chị xác nhận ảnh này có phải của mình không; nếu không, xử lý như ảnh thiên thần. Listing chỉ bán 1 Washington: đừng để ảnh này làm ảnh đầu, và cho em biết hộp mica/bảng có kèm không.
- Em bỏ câu 'Jefferson & Franklin join the collection in 2026' (giờ đã tháng 10/2026). Nếu Jefferson/Franklin đã có listing, chị gửi link để em thêm mục 'Complete the set'.
- Vận chuyển cũ mâu thuẫn ('pre-order' vs 'xử lý 3–5 ngày'; 'gửi từ VN' vs 'từ giữa 7/2026 gửi từ Pearland'). Em ghi: làm theo đơn, xử lý 3–5 ngày làm việc, gửi từ VN (10–14 ngày làm việc tới US) hoặc từ Pearland với hàng sẵn — chị xác nhận hiện tại gửi từ đâu.
- Em bỏ câu 'NOT AI … our photos show our actual work' vì một số ảnh dựng bằng AI; giữ câu đó là tuyên bố sai theo FTC/Etsy. Nếu chị có ảnh chụp thật, đặt ảnh đó lên đầu.


<a id="l4364432946"></a>
### Custom Crochet Pet Portrait from Photos, Large Crochet Cat Look Alike 16-21 in, Personalized Cat Lover Gift, Pet Memorial Keepsake

Listing: https://www.etsy.com/listing/4364432946 · giá hiện tại $150.00 · section Etsy: —

Title cũ: *Personalize Jumbo Cat & Pet Plushie crochet gift: Handmade Design, Hugging and, 16" - 21"*

**Title mới** (130 ký tự):

```text
Custom Crochet Pet Portrait from Photos, Large Crochet Cat Look Alike 16-21 in, Personalized Cat Lover Gift, Pet Memorial Keepsake
```

**Description:**

```text
Custom crochet pet portrait in our Grand size: your own cat, or another pet, crocheted by hand from the photos you send. 16–21 in (about 40–53 cm), made to order for pet lovers.

This is the big one. Grand is the custom size for pieces over 14 in, and this listing is made at 16–21 in. You send photos of your cat or other pet, and we crochet a portrait of them by hand, made for your order: a keepsake of your own companion for the sofa, a reading chair or a favorite shelf.

HOW IT WORKS
• Send the clearest photos you have of your pet: front-on, and in daylight if you can
• We work from those photos to crochet your pet by hand
• Each piece is made for your order

DETAILS
• Grand size: 16–21 in / about 40–53 cm (over 14 in)
• Personalized to your pet, made from your photos
• Handmade to order

CARE
Spot clean with a damp cloth.

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Questions about your photos or the size? Message us through Etsy before you order.
```

**Tags (13):** `custom cat portrait`, `cat from photo`, `pet memorial gift`, `dog lover gift`, `crochet cat decor`, `large crochet cat`, `cat mom gift`, `cat dad gift`, `pet owner gift`, `custom amigurumi`, `handmade pet replica`, `gift for cat owner`, `pet loss gift`

**Đã đổi gì:**
- Full description written from the title, the one-line Etsy text and the shop's site entry only; no new facts added
- 'Plushie' and 'Hugging' removed from the title (toy wording); now a custom pet portrait for adult pet lovers
- Garbled title ('crochet gift: Handmade Design, Hugging and,') rewritten with the main phrase first
- 'customize Grand size over 14"' kept as the Grand range, with the title's 16–21 in as this listing's size
- Standard keepsake line added

**Chị cần làm thêm:**
- Mô tả Etsy cũ chỉ có 1 dòng; em viết đầy đủ từ tiêu đề + trang site. Chị cần thêm: thời gian làm (processing time), cách gửi ảnh (ô Personalization hay nhắn tin, mấy ảnh, góc nào) và chất liệu len/nhồi — em chưa ghi vì listing chưa có.
- 'Làm từ ảnh khách gửi' và 'lau bằng khăn ẩm' lấy từ trang site, không có trong listing Etsy — chị xác nhận giúp. Kích thước: tiêu đề ghi 16–21" nhưng mô tả cũ ghi 'trên 14"' — chị chốt một khoảng.
- Ảnh đầu có nhãn da 'Bespoke by L.V. 30 yrs', không phải nhãn Viet Delight/Purrlight, nên bé trong ảnh có thể là sản phẩm của một người thợ khác (SUY LUẬN). Chị xác nhận bé này do xưởng mình làm hoặc mình được phép dùng ảnh; nếu không, thay ảnh. Ngoài ra khách có thể tưởng bé đi kèm nhãn đó, và 'Bespoke' là chữ Canon v2 tránh. Dù thế nào, ảnh đầu cũng nên là ảnh không thấy nhãn.
- Listing chưa nằm trong section nào — nên cho vào section mèo/Merlin. Nếu đang ở danh mục Toys/Stuffed Animals thì chuyển sang Home & Living > Home Décor.


<a id="l4337895128"></a>
### Crochet British Shorthair Cat, Sherlock Holmes Inspired Outfit, Handmade Amigurumi Gray and White Decor, Detective Cat Gift for Book Lovers

Listing: https://www.etsy.com/listing/4337895128 · giá hiện tại $55.00 · section Etsy: Cat Lover Gift

Title cũ: *British Shorthair Cat Crochet Amigurumi Plush: Custom Fluffy Toy, sherlock cat costume*

**Title mới** (139 ký tự):

```text
Crochet British Shorthair Cat, Sherlock Holmes Inspired Outfit, Handmade Amigurumi Gray and White Decor, Detective Cat Gift for Book Lovers
```

**Description:**

```text
Handmade crochet British Shorthair cat in a Sherlock Holmes inspired outfit, for mystery readers and cat lovers: a gray-and-white amigurumi for the bookshelf or the desk.

Gray coat, white belly and paws, pink nose: the British Shorthair look, crocheted stitch by stitch. He comes dressed for a case in a Sherlock-style outfit with removable accessories, with a soft Japanese/Korean-inspired feel to the styling. Set him beside your Conan Doyle collection and let him keep watch over the shelf.

To be clear: this listing is the finished crocheted cat, made for your order. It is not a pattern and not a digital file.

DETAILS
• Colors: gray and white, with a white belly, white paws and a pink nose
• Sherlock Holmes inspired outfit with removable accessories
• Crocheted entirely by hand

MADE TO ORDER & SHIPPING
• Processing time: 1–2 weeks, crocheted for your order
• Estimated delivery after it ships:
• USA: 9–15 days, tracked with USPS
• UK & Europe: 10–20 days, tracked with Royal Mail
• Canada: 10–20 days, tracked with Canada Post
• Australia: 10–20 days, tracked with Australia Post
• Other countries: 10–30 days by post

NOTES
• Colors can look slightly different from one screen to another
• Handmade, so size and shape vary a little from cat to cat; the differences are minor

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Thank you for shopping with Viet Delight.
```

**Tags (13):** `sherlock cat`, `detective cat`, `british shorthair`, `book lover gift`, `mystery reader gift`, `gray cat gift`, `crochet cat decor`, `amigurumi cat`, `bookshelf decor`, `literary gift`, `reading nook decor`, `cat mom gift`, `grey cat lover`

**Đã đổi gì:**
- AI-prompt text ('Crochet pattern for…', 'should reflect…', 'must capture…') replaced with a real description of the finished cat
- 'Plush', 'Fluffy Toy' and 'for added playability' removed: toy framing; pitched to mystery readers and cat lovers instead
- 'Custom' dropped from the title: the listing never says what can be customized
- 'sherlock cat costume' reworded to 'Sherlock Holmes inspired outfit' (public-domain character, 'inspired by' wording)
- Stale 'In-stock USA: upcoming (on next September 2025)' and the misspelled '[Please attenttion…]' banner removed
- Standard adult keepsake line added

**Chị cần làm thêm:**
- Listing không ghi kích thước — chị bổ sung giúp em (các bé mèo khác ghi 10 in). Em bỏ chữ 'Custom' ở tiêu đề vì mô tả không nói tuỳ chỉnh gì; nếu có (màu, tên…) chị báo để em thêm mục PERSONALIZE.
- Ảnh chính: bé màu xám than gần như đen (giống mèo tuxedo), không có bộ đồ Sherlock, dáng giống hệt bé Ginger nên có thể là ảnh AI. Theo ý chị vẫn giữ ảnh, nhưng đừng gắn listing này thành hàng Feature; nếu có ảnh thật mặc bộ Sherlock thì nên để làm ảnh đầu.
- Em bỏ dòng 'In-stock USA: upcoming (September 2025)' vì quá hạn. Nếu listing đang ở danh mục Toys trên Etsy thì chuyển sang Home & Living > Home Décor.


<a id="l4399784660"></a>
### Crochet Dragon Pattern PDF, Sleeping Dragon Amigurumi, Super Bulky Chenille Yarn, 47 Inch Giant Crochet Project, US Terms Digital Download

Listing: https://www.etsy.com/listing/4399784660 · giá hiện tại $1.75 · section Etsy: Digital Service

Title cũ: *Crochet Dragon Plush Toy, Stuffed Animal Dragon, Nursery Decor*

**Title mới** (138 ký tự):

```text
Crochet Dragon Pattern PDF, Sleeping Dragon Amigurumi, Super Bulky Chenille Yarn, 47 Inch Giant Crochet Project, US Terms Digital Download
```

**Description:**

```text
Crochet dragon pattern PDF (US terms) for a 120 cm / 47 in Sleeping Dragon in super bulky chenille yarn with an 8.0 mm hook. A digital download for crocheters, not a finished piece.

The PDF gives round-by-round instructions, stitch counts, tick tables and assembly tips for a big-belly sleeping dragon, with clean shaping and easy-to-count, repetitive rounds. Make one for a gift, a reading nook, a cozy corner, a photo prop or a craft market table.

WHAT YOU'LL RECEIVE (DIGITAL DOWNLOAD)
• 1 PDF in English with US crochet terms, optimized for desktop and mobile
• Round-by-round instructions for the body, worked in one piece (head, torso, tail)
• Separate parts: 4 legs, 2 ears, 2 horns, 2 wings, 4+ spine spikes, tail pom
• Stitch counts at the end of every round, and tick tables to track progress
• Materials, gauge, color key and construction overview
• Assembly guide (pinning and sewing order, embroidery notes)
• Care tips for chenille amigurumi
• Yardage and time estimator to adapt to your tension and pace

FINISHED SIZE
• About 120 cm (47 in) from snout to tail pom with super bulky chenille and an 8.0 mm hook
• Size varies with tension, yarn and stuffing density

SKILL LEVEL
Confident beginner to intermediate. Techniques used: adjustable ring (MR), single crochet (sc), increases (inc), invisible decreases (dec), slip stitch (sl st), working in the round, simple shaping, light embroidery.

MATERIALS (NOT INCLUDED)
• Yarn: super bulky chenille (Category 6/7)
• Main color (MC): Brown, about 10 skeins (≈1000–1200 g)
• Contrast color (CC): Chick Yellow, about 3 skeins (≈300–360 g)
• Optional: white for the spine spikes
• Tip: keep 1 extra skein per color as a buffer
• Hook: 8.0 mm
• Stuffing: polyester fiberfill, approx. 1.2–1.8 kg (2.65–3.97 lb)
• Tapestry needle, stitch markers, pins
• Plastic eyes optional (the sample uses embroidered sleepy eyes)

GAUGE
• With chenille in the round: 7 sc × 7 rows ≈ 10 × 10 cm with an 8.0 mm hook and firm tension
• Make a small swatch; adjust hook or yarn to get a dense fabric that hides the stuffing

CONSTRUCTION
• Body worked in one continuous piece from snout to tail for a smooth silhouette
• Separate parts attached with clear placement notes
• Easy counting and consistent shaping, with stitch counts at every round

TIME AND YARDAGE (GUIDANCE)
• Total stitches: about 14,000–15,000 (body about 11,500–12,500, parts about 2,500)
• Typical speed with bulky yarn: 300–450 sc per hour
• Estimated total time: about 35–38 hours at 400 sc per hour (varies by maker)
• Yardage scales with your gauge; see the Yardage & Time section in the PDF

CARE (FOR THE FINISHED PIECE)
• Spot clean with mild soap; avoid machine washing to protect the chenille pile
• Keep away from hook-and-loop fasteners and abrasive surfaces

FAQ
• US or UK terms? US terms. A quick US–UK map is included.
• Can I change the size? Yes. Use a different yarn weight with a matching hook, and adjust yardage and stuffing to suit.
• Do I need plastic eyes? No. The sample uses embroidered sleepy eyes; plastic eyes are optional.
• Do I need wire or an armature? No, no armature is required.
• Stuck? Message us on Etsy with your order number and a clear question; we're happy to help.

PERMISSIONS
Personal use pattern. You may sell finished items handmade by you in small batches; please credit: “Pattern by Anna_Crochet – Sleeping Dragon.” Do not copy, redistribute or resell the pattern or its content (text, charts, images).

GOOD TO KNOW
• This listing is a digital crochet pattern PDF, not a finished piece. No physical item will be shipped.
• Instant download via Etsy after payment.
• Because this is a digital download, all sales are final; no refunds on digital files.

Feel free to share your make and tag us so we can cheer you on.
```

**Tags (13):** `dragon pattern`, `amigurumi pattern`, `chenille crochet`, `giant amigurumi`, `crochet pdf`, `super bulky pattern`, `us crochet terms`, `big crochet project`, `dragon amigurumi`, `fantasy crochet`, `crochet download`, `chenille pattern`, `intermediate pattern`

**Đã đổi gì:**
- Title now starts with 'Crochet Dragon Pattern PDF'; 'Plush Toy', 'Stuffed Animal' and 'Nursery Decor' removed: the listing is a $1.75 digital pattern, not a finished piece
- Internal 'Search tags and keywords (add to tags/description naturally)' block deleted; its useful phrases moved into the tags
- 'nurseries', 'kids' rooms', 'reading buddy', 'Statement plushie', 'huggable', 'cuddly plush' and 'a magical cuddle' removed (children's and Canon wording)
- 'magic ring' changed to 'adjustable ring' and 'safety eyes' to 'plastic eyes' (same technique and part, banned words); 'Velcro' changed to 'hook-and-loop fasteners' (trademark)
- 'Not a finished toy' changed to 'not a finished piece'; 'relaxing' rounds changed to 'easy-to-count' to avoid a wellbeing claim
- Credit line “Pattern by Anna_Crochet – Sleeping Dragon.” kept exactly; tone kept plain, with no sales push, as Elise wants for this test listing

**Chị cần làm thêm:**
- Ảnh là rồng màu trắng/kem nhưng phần vật liệu ghi màu chính Nâu + phụ Vàng gà. Chị cân nhắc thêm một dòng 'mẫu trong ảnh làm màu kem' hoặc một ảnh màu nâu để khách khỏi thắc mắc.
- Nếu listing đang ở danh mục Toys trên Etsy, chuyển sang Craft Supplies & Tools > Patterns & How To. Section 'Digital Service' giữ nguyên được.
- Mô tả giữ đơn giản, không kêu gọi mua, đúng ý chị để thử xem khách của shop có muốn mua pattern không. Dòng credit 'Pattern by Anna_Crochet – Sleeping Dragon' giữ nguyên như chị xác nhận. Tag lấy từ khối keyword nội bộ đã xoá.
- Ảnh chính đặt con rồng trong phòng em bé (decal mây và sao trên tường, gấu bông, khối gỗ đồ chơi trên kệ) — đúng bối cảnh mà bản viết lại đã bỏ khỏi chữ. Theo ý chị vẫn giữ ảnh AI và để listing này yên ắng, nhưng ảnh đầu nên crop sát con rồng cho mất gấu, khối gỗ và decal (hoặc dùng ảnh rồng nâu/vàng nếu có, khớp luôn với phần vật liệu).


<a id="l4368649382"></a>
### Large Knitted Horse Decor, Hand-Knitted Fluffy Pony Pillow, Farmhouse Sofa Accent, Equestrian Gift, Horse Lover Shelf Decor

Listing: https://www.etsy.com/listing/4368649382 · giá hiện tại $55.00 · section Etsy: Nursery & Baby Plushies

Title cũ: *Large Horse Plushie pillow for kids, Knitting Pony Toy, Fluffy Stuffed Animal, Nursery Decor*

**Title mới** (123 ký tự):

```text
Large Knitted Horse Decor, Hand-Knitted Fluffy Pony Pillow, Farmhouse Sofa Accent, Equestrian Gift, Horse Lover Shelf Decor
```

**Description:**

```text
Large knitted horse decor for horse lovers and farmhouse homes: a fluffy 40 cm (15.75 in) pony, hand-knitted in Vietnam, made to sit on the sofa, the bed or a wide shelf.

This oversized horse is knitted by hand from ultra-soft fluffy yarn, with a soft, rounded shape. It brings a warm, rustic touch to a country-style room and makes a memorable gift for anyone who loves horses.

DETAILS
• Size: about 40 cm (15.75 in) long
• Hand-knitted from ultra-soft fluffy yarn, filled with fiberfill
• Knitted by hand by artisan makers in Vietnam, so every horse is one of a kind

STYLE IT / GIFT IDEAS
• A soft, rustic accent for a farmhouse, cottage or country-style room
• A gift for an equestrian, a rider or any horse lover
• A cozy display piece for a reading nook, a bed full of pillows or a bookshelf

CARE
Spot cleaning is recommended. If needed, hand wash gently in cold water, then lay flat to air dry so it keeps its fluffy texture and rounded shape.

PACKAGING
Packed with care and ready to give as a gift.

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.
```

**Tags (13):** `horse lover gift`, `equestrian decor`, `farmhouse decor`, `country home decor`, `rustic shelf decor`, `cottagecore decor`, `gift for rider`, `handmade horse`, `knitted pony`, `knit animal decor`, `western home decor`, `fiber art horse`, `bed pillow accent`

**Đã đổi gì:**
- Title: removed 'for kids', 'Toy', 'Stuffed Animal' and 'Nursery Decor'; re-aimed at horse lovers and farmhouse decor
- 'premium hypoallergenic fiberfill' and 'secure, child-safe details' removed — untested safety claims
- Baby shower, first birthday, naming ceremony, toddler and nursery gift ideas replaced with adult styling and gift ideas
- 'magical companion', 'perfect gift', 'ultimate', '100% Handmade' removed — Canon v2 wording
- 'safely ... arriving ready to be gifted' reworded to 'packed with care' — no delivery promise
- Kept size, yarn, made in Vietnam and care; added the standard keepsake line

**Chị cần làm thêm:**
- Chuyển listing khỏi section 'Nursery & Baby Plushies' (đổi tên section, ví dụ 'Knitted Animal Decor'); trong category picker chọn Home & Living > Home Decor thay vì Toys/Baby, và bỏ các attribute/occasion hướng trẻ em (Baby shower...).
- Ảnh có dây cương và tấm lót yên màu đỏ nhưng mô tả cũ không nhắc tới; nếu chúng đi kèm con ngựa thì chị thêm 1 dòng vào DETAILS.
- Listing cũ không ghi thời gian xử lý và nơi gửi hàng; nếu có, chị thêm vào cuối mô tả.


<a id="l4364454125"></a>
### Knitted Giraffe Decor, Large 60 cm Hand-Knitted Soft Sculpture, Pastel Living Room Decor, Giraffe Lover Gift, Boho Sofa Accent

Listing: https://www.etsy.com/listing/4364454125 · giá hiện tại $55.00 · section Etsy: Nursery & Baby Plushies

Title cũ: *Hand-Knitted Giraffe Plush Toy, Soft Yarn Safari Animal, Nursery Decor, Toddler Snuggle Toy*

**Title mới** (126 ký tự):

```text
Knitted Giraffe Decor, Large 60 cm Hand-Knitted Soft Sculpture, Pastel Living Room Decor, Giraffe Lover Gift, Boho Sofa Accent
```

**Description:**

```text
Knitted giraffe decor for grown-up spaces: a tall 60 cm (23.6 in) hand-knitted giraffe in pastel pink, blue or yellow, made for the sofa, a reading chair or a boho shelf.

Hand-knitted from plush, fluffy yarn, this gentle giant has the soft, stretchy, squishy texture of real hand-knitting. It adds warmth and a little smile to a living room, a bedroom or a home office.

DETAILS
• Size: about 60 cm (23.6 in) tall
• Hand-knitted in Vietnam by skilled artisan makers
• Plush fluffy yarn, filled with fiberfill to keep its chunky shape
• Colors: pastel pink, blue or yellow

STYLE IT / GIFT IDEAS
• A soft statement piece for a boho or Scandinavian living room
• A gift for a giraffe lover, a knitter or anyone who appreciates the craft of hand-knitting
• At home on a bed, an armchair or a wide bookshelf

CARE
To keep it clean and fluffy, hand wash gently in cold water with mild soap. Don't rub the stitches hard and don't wring. Lay flat to air dry.

SHIPPING & PACKAGING
Carefully packed for the journey and ready for gifting. We'll keep you updated as your order moves along.

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Explore more handmade pieces at our shop: https://vietdelightfinds.etsy.com
```

**Tags (13):** `giraffe gift`, `handmade giraffe`, `boho living room`, `pastel room decor`, `housewarming gift`, `tall animal decor`, `knit soft sculpture`, `fiber art decor`, `reading nook decor`, `sofa styling`, `scandi decor`, `gift for knitter`, `animal lover gift`

**Đã đổi gì:**
- Title: removed 'Plush Toy', 'Nursery Decor' and 'Toddler Snuggle Toy'; now leads with 'Knitted Giraffe Decor' for home styling
- 'hypoallergenic ... for sensitive baby skin' and 'clean, eco-friendly fiberfill' removed — untested safety and green claims
- Baby shower, newborn, toddler, kids' birthday and nursery gift ideas replaced with adult decor and gift ideas
- 'magic', 'best friend', 'perfect', 'premium', '100%', 'cuddly', 'snuggles' removed — Canon v2 and child-focused wording
- 'arrives in perfect condition' reworded to 'carefully packed for the journey' — no delivery promise
- Kept size, colors, yarn, made in Vietnam, care and shop link; added the standard keepsake line

**Chị cần làm thêm:**
- Chuyển listing khỏi section 'Nursery & Baby Plushies' (đổi tên section, ví dụ 'Knitted Animal Decor'); trong category picker chọn Home & Living > Home Decor thay vì Toys/Baby, và bỏ các attribute/occasion hướng trẻ em (Baby shower...).
- Ảnh chính có 2 con (xanh và hồng), không thấy màu vàng. Chị xác nhận $55 là giá 1 con và màu vàng có thật; nếu đúng, có thể thêm 'Sold individually' vào DETAILS.
- Listing cũ chỉ ghi 'processing time is fast', không có số ngày và nơi gửi hàng; nếu có, chị thêm vào.


<a id="l4548879570"></a>
### Crochet Feelings Faces, Set of 3 or 6 Squeeze Balls, Office Desk Fidget, Hand-Embroidered Cotton Mood Faces, Coworker Gift

Listing: https://www.etsy.com/listing/4548879570 · giá hiện tại $14.00 · section Etsy: Bag Charms & Mini Gifts

Title cũ: *Emotional Support Stress Ball Set, Crochet Feelings Faces, Sensory Fidget Calm Down Corner Toy*

**Title mới** (122 ký tự):

```text
Crochet Feelings Faces, Set of 3 or 6 Squeeze Balls, Office Desk Fidget, Hand-Embroidered Cotton Mood Faces, Coworker Gift
```

**Description:**

```text
Crochet feelings faces for your desk: a set of 3 or 6 palm-sized cotton squeeze balls, each with a hand-embroidered mood, for grown-ups who like a little fidget at work.

Happy, sad, angry, sleepy, dizzy, worried: each ball wears one expression, so you can set out the mood you're in today. Keep them on your desk as a daily mood check-in, pass one to a coworker, or give a set to the work friend who shares your sense of humor.

CHOOSE YOUR SET
• Set of 3 or Set of 6 hand-embroidered emotion balls, with a drawstring "Emotion Sacks" pouch

CHOOSE YOUR FILL
• Unfilled shells (standard): lightweight and ready for you to fill with whatever you like, such as rice, beans, poly-fill, lavender or dried herbs. Good for DIY projects and lighter international shipping.
• Bean-filled: weighted, with a satisfying heft in the palm.
• Soft cotton-filled: light, squishy and cloud-soft for gentle squeezing.

DETAILS
• All-cotton yarn, hand-crocheted, so every face has its own character
• Size: about 5 cm / 2 in each, palm-sized
• Emotions: Happy, Sad, Angry, Sleepy, Dizzy, Worried
• Filled versions contain small filling inside the shell
• Handmade: colors and shapes may vary slightly, and that's the charm

CARE
Spot clean only and keep dry. Do not machine wash. If you fill your own shells, choose a filling that suits your needs.

MADE TO ORDER & SHIPPING
Handmade to order. Processing takes 3–5 business days. Ships from Pearland, Texas. US delivery usually takes about 7 days, with USPS tracking.

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

ABOUT VIET DELIGHT
A Vietnamese-American studio crocheting little things that carry big feelings, from our hands to your heart.
```

**Tags (13):** `cubicle decor`, `office desk decor`, `office gift`, `emotion faces`, `mood balls`, `crochet squeeze ball`, `mood check in`, `secret santa gift`, `fidget for adults`, `work from home gift`, `palm sized fidget`, `feelings gift`, `crochet emoji`

**Đã đổi gì:**
- Title: removed 'Emotional Support', 'Stress Ball', 'Sensory' and 'Calm Down Corner Toy'; re-aimed as an office desk fidget and coworker gift
- Classroom, calm-down-corner, SEL and counselor uses removed — child-focused and close to therapy claims
- 'grounding' and 'not a medical device' dropped — the new copy makes no wellness or medical claim
- 'Not intended for children under 3' age line replaced by the standard keepsake line; kept the fact that filled versions contain small filling
- '100% cotton' reworded to 'all-cotton yarn' — same fact without '100%'
- Kept set sizes, fill options, size, emotions, care, processing time, Pearland ship-from and USPS estimate

**Chị cần làm thêm:**
- Ảnh chính có sticker 'FREE SHIPPING', chữ 'Stress-Relief' ở dải dưới, bảng ghi 'Happy Hook Pouches' và con dấu 'Be thankful · Grateful · be blessed'. Con dấu này giống hệt trên ảnh thiên thần mà chị đã xác nhận không phải ảnh của chị, còn 'Happy Hook Pouches' có thể là tên shop khác (SUY LUẬN). Chị xác nhận ảnh này có phải của mình không; dù có hay không, chữ trên ảnh cũng tính là quảng cáo, nên thay bằng ảnh sạch do xưởng chụp. Nếu ảnh không phải của mình thì đừng xoá dấu rồi dùng tiếp (xoá watermark của người khác là vi phạm bản quyền).
- Chưa rõ bộ gồm 1 túi 'Emotion Sacks' hay mỗi bóng là một túi rút (ảnh có dây rút trên từng bóng); em giữ nguyên câu cũ, chị xác nhận.
- Trong category picker bỏ nhóm Toys (Fidget toys...) và chọn nhóm Home & Living hoặc Office; bỏ các attribute lớp học/trẻ em nếu có.
- Listing không ghi giá Set of 6 và giá bản nhồi đậu / nhồi bông; $14 hiện là mức thấp nhất. Chị kiểm tra variations trên Etsy đã có giá đúng cho từng lựa chọn (bộ 3/bộ 6 × kiểu nhồi).


<a id="l1889976910"></a>
### Crochet Tuxedo Cat from Your Photo, Custom Amigurumi Pet Portrait, Handmade Black and White Cat Lover Gift, Personalized, 10 in

Listing: https://www.etsy.com/listing/1889976910 · giá hiện tại $55.00 · section Etsy: Cat Lover Gift

Title cũ: *Tuxedo Cat Crochet Amigurumi Plush: Custom Handmade Toy cat lover, 10", personalized gift*

**Title mới** (127 ký tự):

```text
Crochet Tuxedo Cat from Your Photo, Custom Amigurumi Pet Portrait, Handmade Black and White Cat Lover Gift, Personalized, 10 in
```

**Description:**

```text
Handmade crochet tuxedo cat made from your photo, for cat owners and cat lovers: a 10 in black-and-white amigurumi that puts your own cat's markings on the shelf.

Every tuxedo wears its black-and-white suit a little differently. This one is crocheted in black with a white belly, white paws and a pink nose, then worked to look like the cat in your photo, so the markings follow your own cat's. He wears an outfit with a mini gift pocket and removable accessories, in a sweet Japanese/Korean-inspired style.

A quick note: this is the finished crocheted cat, made for your order, not a pattern or a digital download.

DETAILS
• Size: about 10 in
• Colors: black with a white belly, white paws and a pink nose, matched to your photo
• Outfit with a mini gift pocket and removable accessories
• Crocheted entirely by hand

YOUR PHOTO
• Custom made to look like your cat: the markings are matched to the photo of your cat that you share with us

MADE TO ORDER & SHIPPING
• Processing time: 1–2 weeks, crocheted for your order
• Estimated delivery after it ships:
• USA: 9–15 days, tracked with USPS
• UK & Europe: 10–20 days, tracked with Royal Mail
• Canada: 10–20 days, tracked with Canada Post
• Australia: 10–20 days, tracked with Australia Post
• Other countries: 10–30 days by post

GOOD TO KNOW
• Colors may look slightly different from one screen to another
• Handmade, so size and shape vary slightly from one cat to the next; the differences are minor

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Thank you for shopping with Viet Delight.
```

**Tags (13):** `tuxedo cat gift`, `custom cat portrait`, `pet memorial gift`, `black and white cat`, `crochet pet replica`, `cat owner gift`, `amigurumi cat`, `custom pet gift`, `tuxedo cat lover`, `cat look alike`, `crochet cat decor`, `cat dad gift`, `gift for cat mom`

**Đã đổi gì:**
- AI-prompt text ('Crochet pattern for…', 'should reflect…', 'must capture…') replaced with a real description of the finished custom cat
- 'Custom Handmade Toy' and 'for added playability' removed: toy framing; now a pet portrait for cat owners
- 'In-stock USA: Pearland' removed: it contradicts '1–2 weeks made to order' for a cat made from the buyer's photo
- 'Custom like your photo' kept as a one-line YOUR PHOTO section with no invented timing or method; no name embroidery promised because the listing does not state it
- '10&quot;' in the title changed to '10 in' so it displays cleanly; standard adult keepsake line added

**Chị cần làm thêm:**
- Listing không nói khách gửi ảnh bằng cách nào và có thêu tên không (ảnh có chữ 'Azul' trên bụng, tiêu đề ghi 'personalized'). Em chỉ viết 'làm theo ảnh mèo khách gửi', không ghi gửi lúc nào hay bằng cách nào; chị cho em biết cách (ô Personalization hay tin nhắn) và có thêu tên/tính thêm tiền không để em thêm.
- Em bỏ 'In-stock USA: Pearland' vì mâu thuẫn với 'làm theo đơn 1–2 tuần' (mèo theo ảnh khách không thể có sẵn). Nếu có bé tuxedo làm sẵn ở Pearland, chị báo để em ghi riêng.
- Ảnh chính có watermark 'Viet Delight', không có bộ đồ/túi quà, có sợi trắng mờ vắt ngang, có thể là ảnh AI; theo ý chị vẫn giữ ảnh, nhưng đừng gắn listing này thành hàng Feature. 'Bộ đồ có túi quà nhỏ + phụ kiện tháo rời' chỉ lấy từ đoạn prompt AI cũ (CHƯA BIẾT): chị xác nhận có kèm không; nếu không, em bỏ. Nếu listing đang ở danh mục Toys thì chuyển sang Home & Living > Home Décor.


<a id="l4427969443"></a>
### Knitted Mushroom and Woodland Decor, Hand-Knitted Hedgehog, Carrot, Tree, Acorn, Pumpkin, Cottagecore Shelf Accent, Fall Tiered Tray Decor

Listing: https://www.etsy.com/listing/4427969443 · giá hiện tại $16.00 · section Etsy: Nursery & Baby Plushies

Title cũ: *Hand-Knitted Woodland Garden Plushie Set, Mushroom, Hedgehog, Carrot, Montessori Toy*

**Title mới** (138 ký tự):

```text
Knitted Mushroom and Woodland Decor, Hand-Knitted Hedgehog, Carrot, Tree, Acorn, Pumpkin, Cottagecore Shelf Accent, Fall Tiered Tray Decor
```

**Description:**

```text
Knitted woodland garden pieces for cottagecore homes: a hand-knitted tree, hedgehog, carrot, mushroom and more, made for shelves, mantels and tiered trays.

Little veggies with happy embroidered faces and a fluffy woodland crew, hand-knitted in small batches from soft textured yarn, for a kitchen shelf, a windowsill or a fall harvest display.

WHAT'S IN THE GARDEN
• Giant Tree: about 25 cm (10 in)
• Carrot: about 10 cm (4 in)
• Broccoli: about 12 cm
• Hedgehog: about 8 cm
• Garden Friends (Acorn, Mushroom, Pear, Pineapple, Pumpkin): about 10–12 cm (3.9–4.7 in)
All sizes are approximate, as each piece is knitted by hand.

HOW IT'S SOLD
Pick your favorites or collect the whole garden. If you're not sure what a choice includes, message us before you order and we'll confirm.

STYLE IT / GIFT IDEAS
• Cottagecore or farmhouse shelf decor
• A tiered tray, mantel or windowsill display for fall and harvest season
• A gift for gardeners, plant lovers and anyone who collects handmade knits

CARE
Spot clean with mild soap and cold water to keep the fuzzy texture and embroidered faces looking fresh. Lay flat to dry in the sun.

PACKAGING
Wrapped like a fresh harvest from the garden, ready for gifting.

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Discover more handmade pieces at our shop: https://vietdelightfinds.etsy.com
```

**Tags (13):** `tiered tray decor`, `fall harvest decor`, `mushroom decor`, `hedgehog gift`, `knitted vegetables`, `cottagecore kitchen`, `farmhouse shelf`, `gardener gift`, `acorn decor`, `pumpkin decor`, `plant lover gift`, `mantel decor`, `knit fruit decor`

**Đã đổi gì:**
- Title: removed 'Plushie Set' and 'Montessori Toy'; now 'Knitted Mushroom and Woodland Decor' for shelf and tiered-tray decor
- Removed the pasted second keyword line ('Veggie Toys, Kawaii Baby Shower Gift Box...')
- 'hypoallergenic', 'Gentle on Baby's Skin', 'Montessori principles' and 'sized for little hands' removed — untested and child-focused claims
- Nursery, baby shower and toddler birthday gift ideas replaced with cottagecore, fall harvest and gardener gift ideas
- 'Limited Edition', 'exclusive', 'curated', 'magical', 'masterpiece', 'premium', 'grab them before they wander away' removed — Canon v2 and urgency wording
- Broccoli and Hedgehog now show cm only: the listing's 4 in for both contradicts its 12 cm and 8 cm
- Price wording kept neutral (pick favorites or the whole garden) because the listing doesn't say whether the price is per piece or per set

**Chị cần làm thêm:**
- Listing không nói $16 là giá 1 món hay cả bộ; em viết trung tính và mời khách nhắn shop nếu chưa rõ. Chị xác nhận, và nếu có variations thì ghi rõ mỗi lựa chọn gồm món nào.
- Số đo mâu thuẫn: bông cải ghi 12 cm nhưng 4" (12 cm ≈ 4.7"), nhím ghi 8 cm nhưng 4" (8 cm ≈ 3.1"). Em chỉ ghi cm cho 2 món này. Chị đo lại; nếu đúng thì có thể thêm số inch 4.7" và 3.1".
- Listing không có thời gian xử lý và nơi gửi hàng; nếu có, chị thêm vào cuối mô tả.
- Chuyển listing khỏi section 'Nursery & Baby Plushies' (đổi tên section, ví dụ 'Knitted Animal Decor'); trong category picker chọn Home & Living > Home Decor thay vì Toys/Baby, và bỏ các attribute/occasion hướng trẻ em (Baby shower...).


<a id="l4427983754"></a>
### Hand-Knitted Duck with Floppy Legs, Daisy Pocket and White Scarf, Cottagecore Farmhouse Decor, Cozy Sofa Pillow, Duck Lover Gift

Listing: https://www.etsy.com/listing/4427983754 · giá hiện tại $40.00 · section Etsy: Nursery & Baby Plushies

Title cũ: *Hand-Knitted Duck Plushie, Floppy Legs, Cottagecore Goose Toy, Soft Animal Pillow*

**Title mới** (128 ký tự):

```text
Hand-Knitted Duck with Floppy Legs, Daisy Pocket and White Scarf, Cottagecore Farmhouse Decor, Cozy Sofa Pillow, Duck Lover Gift
```

**Description:**

```text
Hand-knitted duck decor for cottagecore and farmhouse homes: a large, flat, pillowy duck with long floppy legs, a fluffy white scarf and a daisy-embroidered belly pocket.

This duck has a sweet long neck, a vintage look and a soft, flat body that rests nicely against a cushion or a headboard.

DETAILS
• Size: large, with a long neck and long floppy legs. Message us if you'd like the exact measurement before you order.
• Hand-knitted in Vietnam from ultra-soft plush yarn, filled with fiberfill
• Long mustard-yellow floppy legs and a fluffy white scarf
• A little belly pocket with hand-embroidered daisy flowers
• Flat, pillowy body with a vintage feel

STYLE IT / GIFT IDEAS
• A gift for duck, goose and farm animal lovers
• A cottagecore or farmhouse accent for the sofa, the bed or a reading chair
• A cozy Christmas gift for a cottagecore or farmhouse friend
• A cozy travel pillow companion
• For anyone who loves cute, kawaii room decor

CARE
Spot clean gently, or hand wash in cold water with mild soap. Lay flat to air dry. Do not machine wash or wring.

SHIPPING & PACKAGING
Carefully packed and shipped with tracking, ready for gifting.

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Explore more hand-knitted and amigurumi pieces at our shop: https://vietdelightfinds.etsy.com
```

**Tags (13):** `goose lover gift`, `hygge decor`, `duck mom gift`, `daisy decor`, `farm animal decor`, `knit duck pillow`, `kawaii room decor`, `vintage style decor`, `cottage decor`, `sofa decor`, `farmhouse gift`, `fiber art duck`, `duck decor`

**Đã đổi gì:**
- Size left out: the listing says both 30 cm (11.8 in) and 40 cm (15.7 in); copy now says 'large' and invites buyers to ask for the exact measurement
- Title: removed 'Plushie' and 'Goose Toy'; one animal name (duck) and adult decor phrases instead
- Removed the pasted second keyword line ('Large Hand-Knitted Duck Stuffed Animal 30cm...')
- 'Hypoallergenic ... completely safe for babies and sensitive skin' and 'clean, eco-friendly fiberfill' removed — untested safety and green claims
- Nursery, baby shower, first birthday and Easter basket ideas replaced with sofa, bed, Christmas gift and travel pillow ideas
- 'Perfect', 'premium', '100%', 'snuggle', 'perfect gift' removed — Canon v2 and child-focused wording
- Kept yarn, details (legs, scarf, daisy pocket), made in Vietnam, care, tracked shipping and shop link; added the standard keepsake line

**Chị cần làm thêm:**
- Kích thước mâu thuẫn: listing ghi 30 cm = 11.8" (2 lần) và 40 cm (15.7") đầu-đến-chân. Em bỏ hết số đo, chỉ ghi 'large'. Chị đo lại rồi thay dòng Size bằng: 'Size: about __ cm (__ in) from head to toe'.
- Tiêu đề cũ gọi 'Goose', mô tả gọi 'Duck'; em chọn Duck, chỉ giữ 'goose lover gift' ở tag và câu gợi ý quà.
- Listing cũ không ghi thời gian xử lý và nơi gửi hàng; nếu có, chị thêm vào.
- Chuyển listing khỏi section 'Nursery & Baby Plushies' (đổi tên section, ví dụ 'Knitted Animal Decor'); trong category picker chọn Home & Living > Home Decor thay vì Toys/Baby, và bỏ các attribute/occasion hướng trẻ em (Baby shower...).


<a id="l4361808711"></a>
### Hand-Knitted Sheep, Fluffy Lamb Bag Charm or Shelf Decor, Curly Fleece Knit, Farmhouse Accent, Sheep Lover Gift, Cream, Red, Caramel

Listing: https://www.etsy.com/listing/4361808711 · giá hiện tại $49.00 · section Etsy: Nursery & Baby Plushies

Title cũ: *Hand-Knitted Sheep Plush Toy, Fluffy Lamb Bag Charm, Farm Nursery Decor*

**Title mới** (132 ký tự):

```text
Hand-Knitted Sheep, Fluffy Lamb Bag Charm or Shelf Decor, Curly Fleece Knit, Farmhouse Accent, Sheep Lover Gift, Cream, Red, Caramel
```

**Description:**

```text
Hand-knitted sheep for sheep lovers and farmhouse homes: a fluffy 25 cm (about 10 in) lamb with a curly loop-yarn fleece, to keep on a shelf or clip on as a bag charm.

Add a touch of fluffiness to your day. This little lamb works as a sweet shelf or desk piece, or, with the bag charm finish, as an eye-catching oversized accessory for your tote.

DETAILS
• Size: about 25 cm (9.8–10 in) tall
• Hand-knitted in Vietnam by skilled artisan makers
• Special textured loop yarn for a soft, curly sheep-fleece look
• Filled with fiberfill, finished with embroidered details and little knitted legs
• Shades: Cream White, Cherry Red, Warm Caramel

CHOOSE YOUR FINISH
• Classic: the sheep on its own, for a shelf, desk or sofa
• Bag charm: add a sturdy metal keychain or a leather strap to turn it into a charm for your tote, purse or backpack

GIFT IDEAS
• Sheep and farm animal lovers
• Grown-ups who love a cute, kawaii bag or purse charm
• A heartfelt gift for a friend starting a new job

CARE
Because of the textured yarn, spot clean only with a damp cloth and mild soap. Don't rub the "fleece" hard. Air dry.

PACKAGING
Carefully packed in a protective box, ready to give to someone you love.

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Explore more hand-knitted pieces at our shop: https://vietdelightfinds.etsy.com
```

**Tags (13):** `sheep bag charm`, `lamb decor`, `purse charm`, `tote bag charm`, `kawaii bag charm`, `farm animal gift`, `knitted lamb`, `keychain charm`, `new job gift`, `shelf decor`, `curly sheep`, `farmhouse gift`, `backpack charm`

**Đã đổi gì:**
- Title: removed 'Plush Toy' and 'Farm Nursery Decor'; now a bag charm or shelf piece for sheep lovers
- 'hypoallergenic, eco-friendly fiberfill' removed — untested safety and green claims
- Baby shower, farm nursery, 'all ages', 'Teens' and 'back to school' ideas replaced with adult gift ideas
- 'cuddly toy', 'stuffed toy', 'huggable plushie' reworded to 'shelf piece' and 'Classic finish'
- 'guaranteed to melt your heart', 'lucky charm', 'perfect', '100%' removed — Canon v2 wording
- Kept size, loop yarn, made in Vietnam, shades, keychain/strap option, care, packaging and shop link; added the standard keepsake line

**Chị cần làm thêm:**
- Chị đã quyết giữ ảnh cừu (không phải ảnh của chị) và không đưa lên đầu trang web. Riêng trên Etsy: ảnh chính là cừu xám/tím nhạt khăn đỏ, không thuộc 3 màu đang bán (Cream White, Cherry Red, Warm Caramel); khách dễ tưởng mua được màu xám. Nếu có ảnh 1 trong 3 màu này thì nên để làm ảnh đầu tiên.
- Bản móc khóa kim loại/dây da: em giữ đúng như listing; chị kiểm tra variation này có giá riêng không để ghi cho khớp.
- Chuyển listing khỏi section 'Nursery & Baby Plushies' (đổi tên section, ví dụ 'Knitted Animal Decor'); trong category picker chọn Home & Living > Home Decor thay vì Toys/Baby, và bỏ các attribute/occasion hướng trẻ em (Baby shower...).
- Ảnh cừu không phải của mình nên cần ghi nguồn khi còn dùng: chị cho em tên hoặc handle chủ ảnh để em thêm một dòng cuối mô tả, ví dụ 'Main photo courtesy of @…'. Em không tự điền tên.


<a id="l4337384028"></a>
### Crochet Siamese Cat, Handmade Amigurumi Home Decor, Dressed or Body Only, Cat Lover Gift for Siamese Owners

Listing: https://www.etsy.com/listing/4337384028 · giá hiện tại $58.00 · section Etsy: Cat Lover Gift

Title cũ: *Siamese Cat Crochet Amigurumi Plush Toy like photos, Custom Fluffy Cat, Home Decor*

**Title mới** (107 ký tự):

```text
Crochet Siamese Cat, Handmade Amigurumi Home Decor, Dressed or Body Only, Cat Lover Gift for Siamese Owners
```

**Description:**

```text
Handmade crochet Siamese cat for Siamese owners and cat lovers: an amigurumi in classic Siamese coloring as pictured, with a pink nose, crocheted to order for a shelf or desk.

The Siamese look you see in the photos, worked by hand stitch by stitch. She comes in a mini romper with removable accessories, or you can choose the cat on her own, body only, without the outfit. The styling is a Japanese/Korean-inspired take on the breed.

Just so you know: this is the finished crocheted cat, made for your order. It is not a pattern or a digital download.

DETAILS
• Colors: Siamese coloring as shown in the photos, with a pink nose
• Outfit: mini romper with removable accessories, or body only
• Crocheted entirely by hand

MADE TO ORDER & SHIPPING
• Processing time: 1–2 weeks, crocheted for your order
• Estimated delivery after it ships:
• USA: 9–15 days, tracked with USPS
• UK & Europe: 10–20 days, tracked with Royal Mail
• Canada: 10–20 days, tracked with Canada Post
• Australia: 10–20 days, tracked with Australia Post
• Other countries: 10–30 days by post

PLEASE NOTE
• Colors can look slightly different from one screen to another
• Each cat is handmade, so size and shape vary slightly; the differences are minor

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Thank you for shopping with Viet Delight.
```

**Tags (13):** `siamese cat gift`, `siamese cat lover`, `crochet siamese`, `siamese cat decor`, `amigurumi cat`, `cat mom gift`, `crochet cat decor`, `cat breed gift`, `desk cat decor`, `bookshelf decor`, `cat owner gift`, `handmade cat gift`, `gift for cat lady`

**Đã đổi gì:**
- AI-prompt text ('Crochet pattern for…', 'should reflect…', 'must capture…') replaced with a real description of the finished cat
- Wrong colors 'Black & white fur, white belly, white paws' removed; colors kept neutral ('Siamese coloring as shown in the photos', pink nose) because no listing text names the point colors; flagged for Elise
- 'Plush Toy' removed from the title and 'for added playability' dropped: toy framing
- '(optional only body) a mini romper' rewritten as a clear choice: romper with removable accessories, or body only
- Stale 'In-stock USA: upcoming (on next September 2025)', the misspelled banner and 'Siemese' typo removed
- Standard adult keepsake line added
- 'Custom … like photos' dropped from the title: the listing never says what can be customized

**Chị cần làm thêm:**
- Mô tả cũ ghi 'lông đen trắng, bụng trắng, chân trắng' và sai chính tả 'Siemese' — không khớp ảnh lẫn giống mèo Xiêm. Em để trung tính: 'màu mèo Xiêm như ảnh, mũi hồng'. Nếu bé gửi đi đúng như ảnh (thân kem, mặt/tai/chân nâu sậm) chị xác nhận để em ghi rõ màu vào tiêu đề và mô tả.
- '(optional only body) a mini romper' em hiểu là: có romper, hoặc chỉ thân mèo không đồ. Chị kiểm tra trên Etsy đã có biến thể này chưa và giá $58 áp cho bản nào. Em bỏ 'Custom … like photos' ở tiêu đề vì mô tả không nói tuỳ chỉnh gì; nếu làm theo ảnh khách gửi được thì chị báo em thêm mục riêng.
- Listing không ghi kích thước — chị bổ sung giúp em. Em bỏ dòng 'In-stock USA: upcoming (September 2025)' vì đã quá hạn.
- Ảnh chính có watermark 'Viet Delight / FIND YOUR LOVE' trên đầu và không có romper. Nếu listing đang ở danh mục Toys thì chuyển sang Home & Living > Home Décor.


<a id="l4335293461"></a>
### Crochet Animal Friends Amigurumi, Cat, Dog, Bear and Bunny in Cozy Outfits, Collectible Shelf Decor, Cat Lover Gift, Christmas Gift

Listing: https://www.etsy.com/listing/4335293461 · giá hiện tại $24.00 · section Etsy: Christmas Gift

Title cũ: *Handmade Animal Plush Toy Set crochet: Cat, Dog, Capybara, Llama Amigurumi, luxury toddler toy*

**Title mới** (131 ký tự):

```text
Crochet Animal Friends Amigurumi, Cat, Dog, Bear and Bunny in Cozy Outfits, Collectible Shelf Decor, Cat Lover Gift, Christmas Gift
```

**Description:**

```text
Crochet animal friends amigurumi for collectors and cozy shelves: a cat, a dog, a bear and a bunny, each about 10 cm tall in a hand-crocheted sweater or outfit.

Four little characters in cozy outfits, crocheted by hand from cotton yarn: Amelia the Cat, Benny the Dog, Bella the Bear and Zara the Bunny. Line them up on a bookshelf, a desk or a holiday mantel.

MEET THE FRIENDS
• Amelia the Cat: a soft grey cat in a sunshine-yellow sweater embroidered with a daisy and the letter "A", with a pink crochet headband. Nature-loving and sweet.
• Benny the Dog: a warm beige dog in a green sweater with a bold yellow "B" and a paw print, plus a striped pink scarf. Loyal and cheerful.
• Bella the Bear: a brown bear in pink overalls with a green "B" and a little red pocket, finished with pink earmuffs. Warmhearted and homey.
• Zara the Bunny: a cream bunny in a bright blue outfit with an orange tassel scarf, a "Z" embroidery and a side bag with a buttoned flap. Creative and cheerful.

DETAILS
• Size: about 10 cm (3.9 in) tall
• Hand-crocheted from cotton yarn, with embroidered letters and details
• Handmade, so size and shape may vary slightly; colors may look a little different on your screen

HOW IT'S SOLD
The four friends are shown together in the photos. If you'd like to confirm which friends your order includes, message us before you order.

GIFT IDEAS
• Amigurumi collectors, cat lovers and dog lovers
• A cozy Christmas or Secret Santa gift for a friend
• Shelf, desk or mantel decor for fall and winter

CARE
• Hand wash only, with mild soap and cool water
• Air dry completely to keep the shape and colors
• Keep out of long periods of direct sunlight

MADE TO ORDER
This is a physical handmade item, made for your order (not a digital download). Processing time: 1–2 weeks.

ESTIMATED DELIVERY TIMES
• USA: 9–15 days (USPS tracking)
• UK & Europe: 10–20 days (Royal Mail tracking)
• Canada: 10–20 days (Canada Post tracking)
• Australia: 10–20 days (Australia Post tracking)
• Other countries: 10–30 days (post office)

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

From Viet Delight Gift Shop with love. Thank you for shopping with us.
```

**Tags (13):** `amigurumi animals`, `crochet cat`, `crochet bunny`, `crochet bear`, `crochet dog`, `amigurumi collector`, `secret santa gift`, `bookshelf decor`, `cozy winter decor`, `crochet collectible`, `dog lover gift`, `mantel decor`, `mini crochet animal`

**Đã đổi gì:**
- Title: removed 'Plush Toy Set' and 'luxury toddler toy'; now 'Crochet Animal Friends Amigurumi' for collectors and shelf decor
- 'safe', 'non-toxic', 'hypoallergenic', 'safety for all ages', 'premium' removed — untested safety claims and Canon v2 wording
- Toddler, children, 'little hands', nursery and baby shower uses replaced with collector, Christmas and shelf-decor ideas
- '[Please attenttion...]' banner removed; kept its fact as 'physical handmade item, made for your order'
- Stale 'In-stock USA: upcoming (on next September 2025)' removed
- Character names made consistent with the design text: Bella the Bear, Zara the Bunny (not Capybara / Llama)
- Price wording kept neutral because the listing doesn't say whether the price is for one friend or all four
- Removed '#' and '@' markdown-style labels; kept size, cotton yarn, care, processing time and delivery estimates

**Chị cần làm thêm:**
- Tên con vật mâu thuẫn: tiêu đề và câu mở đầu cũ ghi Capybara và Llama, nhưng phần mô tả và ảnh là gấu nâu (Bella) và thỏ (Zara). Em dùng Bear và Bunny; chị xác nhận.
- Chưa rõ $24 là giá 1 con hay cả 4 con; em viết trung tính và mời khách nhắn shop trước khi đặt. Chiều cao 10 cm cũng nên đo lại.
- Chị đã quyết giữ ảnh dựng bằng AI (không đưa lên hàng nổi bật trên web). Trên Etsy, nếu có ảnh thật của bộ đã móc thì nên để làm ảnh đầu, vì Etsy yêu cầu ảnh đúng với món khách nhận. Trong category picker bỏ nhóm Toys, chọn Home & Living.
- Đã bỏ dòng 'In-stock USA: upcoming (September 2025)' vì quá hạn. Listing không ghi nơi gửi hàng; nếu cần, chị thêm vào.


<a id="l4558481857"></a>
### Saint Joan of Arc Crochet Doll, Catholic Confirmation Gift, Name Saint Keepsake, Handmade Jeanne d'Arc, Feast Day Gift for Adults

Listing: https://www.etsy.com/listing/4558481857 · giá hiện tại $59.25 (giảm từ $79.00) · section Etsy: Baptism & Catholic Gift

Title cũ: *Saint Joan of Arc Crochet Doll - Catholic Confirmation Name Saint Gift - Handmade Jeanne d'Arc*

**Title mới** (129 ký tự):

```text
Saint Joan of Arc Crochet Doll, Catholic Confirmation Gift, Name Saint Keepsake, Handmade Jeanne d'Arc, Feast Day Gift for Adults
```

**Description:**

```text
Saint Joan of Arc crochet doll: a handmade, hand-embroidered Catholic keepsake for adults. A Confirmation, feast-day or name-saint gift for anyone who takes Joan or Jeanne as their name saint.

✝️ SAINT JOAN OF ARC
Saint Joan is remembered for her courage, perseverance and faithfulness to the very end. This doll is hand-crocheted in her honor as a keepsake for anyone who takes Joan or Jeanne as their name saint. Give it at Confirmation, on a patron-saint feast day or at Christmas, from a Confirmation sponsor or a friend. It sits quietly on a shelf, a desk or a home prayer corner.

CHOOSE YOUR VERSION
• Sample/Regular: Saint Joan only, about 23 cm (9 in), no custom name or extra embroidery
• Standard: Saint Joan on a wooden display base, about 23 cm (9 in), with a custom name and cross embroidery, no flag
• Banner version: Saint Joan with her banner/flag and fleur-de-lys symbol embroidery, plus a custom name
Etsy shows the price of each version in the menu.

DETAILS
• Entirely hand-crocheted; face and details are hand-embroidered
• Eyes: plastic eyes, or non-plastic eyes on request
• Solid wooden display base (Standard version)
• Height: about 23 cm / 9 in (Sample/Regular and Standard)
• Materials: cotton/acrylic yarn, poly-fill
• Each doll is made to order and slightly different from the next

MADE TO ORDER & SHIPPING
• Processing time: 14–20 business days
• Ships from our workshop in Vietnam or from the Purrlight Studio LLC storage hub in Pearland, Texas
• Designed in Texas, made in Vietnam, finished in Texas

CARE
Spot clean only. Keep the wooden base dry. Display away from direct sun to keep the colors vivid.

A handmade devotional keepsake for adults. Not a toy and not tested as a children's product; keep away from young children.

ABOUT VIET DELIGHT BY PURRLIGHT
We're a Vietnamese-American maker studio, and we are Catholic. We make heirloom-quality handmade gifts: designed in Texas, made in Vietnam, finished in Texas.
```

**Tags (13):** `joan of arc gift`, `catholic saint doll`, `confirmation saint`, `jeanne d arc`, `patron saint gift`, `catholic decor`, `saint figurine`, `religious keepsake`, `sponsor gift`, `catholic christmas`, `home altar decor`, `catholic woman gift`, `crochet saint doll`

**Đã đổi gì:**
- 'recommended ages 3+' and 'for children and grown-ups alike' removed (age recommendation); standard devotional keepsake line added
- 'for the brave girl named Joan or Jeanne', the Baptism / First Communion framing and the drafter's 'godparent' / 'name day' removed; now a Confirmation, feast-day and name-saint gift for adults, from a Confirmation sponsor or a friend
- 'free shipping worldwide' and 'free gift' removed from the versions; '$120' removed because Etsy shows each version's price and the current sale changes it
- 'Hand-embroidered features mean no small plastic parts' removed: it contradicted the plastic-eyes option and the photo
- 'premium', 'Quiet luxury, with a wink', 'THE PATRON OF PERSEVERANCE' heading and the paw emoji removed (Brand Canon, plain faith copy); 'Deluxe' described as 'Banner version'
- Sample/Regular 'no custom or embroidery' reworded to 'no custom name or extra embroidery' to match the hand-embroidered face
- Title: HTML entity '&#39;' fixed, ' - ' separators changed to commas, 'Feast Day Gift for Adults' added

**Chị cần làm thêm:**
- Mắt: listing vừa ghi 'không có chi tiết nhựa nhỏ' vừa ghi 'mắt nhựa và mắt không nhựa theo yêu cầu', ảnh thì giống mắt nhựa. Em ghi 'mắt nhựa, hoặc mắt không nhựa theo yêu cầu' — chị xác nhận mắt mặc định.
- Bản Sample/Regular ghi 'no custom or embroidery' nhưng mặt bé nào cũng thêu tay; em ghi 'không tên riêng, không thêu thêm' — chị xác nhận. Bản Banner chưa có chiều cao và chưa nói có đế gỗ không. Nên đổi tên tuỳ chọn 'Deluxe' trên Etsy thành 'Banner' cho khớp mô tả (Canon v2 tránh chữ 'luxe').
- Giá '$120' của bản Standard đã bỏ khỏi mô tả: đang giảm 25% đến hết 25/10 nên Etsy sẽ hiện giá khác; chị kiểm tra giá từng phiên bản trong menu. Section 'Baptism & Catholic Gift' gợi ý quà cho em bé — nên chuyển sang section kiểu 'Catholic Gifts & Keepsakes' (cùng chuỗi Mân Côi). TÍNH TOÁN: làm 14–20 ngày làm việc (~3–4 tuần) + 2–3 tuần ship từ xưởng VN (theo trang custom-orders) → đơn đặt sau khoảng 5–10/11 có thể không kịp 25/12. Mô tả không hứa ngày; chị chỉ cần để processing time trên Etsy đúng 14–20 ngày để Etsy tự hiện ngày giao dự kiến.
- Ảnh đầu có ô chữ 'Saint Jenne D'arc' sai chính tả (đúng là 'Jeanne') và chữ bị cắt ở mép dưới. Cảnh trông dựng AI: theo ý chị vẫn giữ ảnh, chỉ không đưa lên hàng nổi bật trên web; trên Etsy, nếu có ảnh thật của bé thì nên để làm ảnh đầu.


<a id="l4467726345"></a>
### Personalized Bride and Groom Crochet Couple, Anniversary Gift for Newlyweds and Parents, Wedding Keepsake, 50th Golden Anniversary Decor

Listing: https://www.etsy.com/listing/4467726345 · giá hiện tại $200.00 · section Etsy: Personalized Keepsakes

Title cũ: *Personalized Bride and Groom Crochet Couple, Anniversary Gift for Newlyweds and Parents, Wedding Keepsake*

**Title mới** (136 ký tự):

```text
Personalized Bride and Groom Crochet Couple, Anniversary Gift for Newlyweds and Parents, Wedding Keepsake, 50th Golden Anniversary Decor
```

**Description:**

```text
Personalized bride and groom crochet couple: a handmade anniversary and wedding keepsake made to look like them. For a 25th or 50th, newlyweds, or your parents. Ships from Texas.

Celebrate a love that has lasted years with a keepsake made to look like them. Whether it's their 5th, 10th, 25th (silver) or 50th (golden) anniversary, or a gift from the family to Mom and Dad, this personalized bride and groom couple turns their love story into a keepsake for the shelf, the mantel or the wedding table. Choose skin tones, hair and outfit colors so the couple looks like them. (Fresh flowers fade. This doesn't.)

THE SET INCLUDES
• Bride and groom dolls, hand-crocheted amigurumi, approx. 8.7–9.4 in (22–24 cm) tall
• Faux pearl bead accents and floral touches (bouquet and boutonnière)
• Solid wooden display base to stand the couple together
• Keepsake gift box and a personalized anniversary card

PERSONALIZE YOURS (use the "Personalization" box at checkout)
• Skin tone: bride and groom
• Hair color and style
• Outfit / dress color
• Names and date printed on the box
• A short message for the anniversary card

A GIFT FOR
5th • 10th • 20th • 25th silver • 50th golden • 60th diamond anniversary • parents or grandparents • a wedding • an engagement • the couple who has everything

DETAILS
• Materials: cotton yarn, faux pearl beads, polyester fill, wooden base
• Height: approx. 8.7–9.4 in (22–24 cm) each
• Handmade, so small natural variations make every set unique

MADE TO ORDER, SHIPS FROM TEXAS
• Each couple is handmade to your personalization, then finished and packed in our Pearland, Texas studio and shipped to you from the USA
• Please allow about 4 weeks crafting time; your estimated delivery date shows at checkout
• Have a milestone date, like a party or an anniversary? Message us before ordering and we'll confirm timing with you

CARE
• Spot clean with a slightly damp cloth; do not machine wash
• Keep your keepsake dry and out of direct sunlight

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

ABOUT PURRLIGHT STUDIO
We're a Vietnamese-American handmade studio based in Pearland, Texas. Each couple is crafted by our skilled artisans and personally finished in Texas: heirloom-quality keepsakes made to last far longer than fresh flowers.

Want something special, like matching pets, a themed outfit or a specific year on the box? Message us. We love making custom couples.
```

**Tags (13):** `custom couple doll`, `wedding gift`, `50th anniversary`, `25th anniversary`, `gift for parents`, `silver anniversary`, `diamond anniversary`, `amigurumi couple`, `look alike couple`, `engagement gift`, `mr and mrs gift`, `wedding table decor`, `grandparents gift`

**Đã đổi gì:**
- 'safe polyester fill' changed to 'polyester fill' and 'premium cotton yarn' to 'cotton yarn': untested safety claim and Canon wording
- 'not a toy (recommended 14+)' replaced by the standard keepsake line: no age recommendations
- 'FREE US shipping' removed: Etsy shows shipping itself
- 'a gift from the kids to Mom & Dad' reworded to 'a gift from the family to Mom and Dad'
- 'PERFECT FOR' relabeled 'A GIFT FOR'; 'looks just like them' and 'treasure forever' toned down; 'we don't want you to miss the day' dropped to avoid a date promise
- Emojis and the flag emoji removed from labels and body lines; 'Wedding Keepsake' kept and '50th Golden Anniversary Decor' added to the title

**Chị cần làm thêm:**
- Ảnh đầu có chữ 'Freegift', 'Freeship', '3+ options color' và 3 cặp, trong khi listing bán 1 cặp — chữ 'free' trên ảnh cũng tính là hứa miễn phí, nên bỏ. Ảnh dựng AI: theo ý chị vẫn giữ, chỉ không đưa lên hàng nổi bật trên web; trên Etsy nên để ảnh 1 cặp thật làm ảnh đầu.
- Đã bỏ 'FREE US shipping' — chị kiểm tra hồ sơ vận chuyển trên Etsy (Etsy tự hiện phí ship cho khách).
- Listing không nói búp bê được móc ở đâu, chỉ ghi 'artisans' và 'finished in Texas', còn tiêu đề mục là 'Ships from Texas' — em giữ nguyên, không tự thêm Việt Nam. Nhưng đây không phải tuỳ chọn: nếu cặp búp bê được móc ở Việt Nam, chị cần thêm câu 'Hand-crocheted by our artisan partners in Vietnam, then finished in Texas' (như Saint Joan, Elizabeth & Darcy) và khai production partner trong mục 'Who made it' của Etsy. Chỉ ghi 'finished in Texas' + 'ships from the USA' dễ bị hiểu là hàng làm ở Mỹ; FTC xét cả tuyên bố ngầm kiểu 'Made in USA'.


<a id="l4336898722"></a>
### Crochet White Cat, Handmade Amigurumi Kitty in an Outfit, 10 in Home Decor, Pink Nose, Cat Lover Gift, Removable Accessories

Listing: https://www.etsy.com/listing/4336898722 · giá hiện tại $55.00 · section Etsy: Cat Lover Gift

Title cũ: *Custom White Cat Crochet Amigurumi Plush Like photos: Custom Fluffy Toy, Home Decor, 10"*

**Title mới** (124 ký tự):

```text
Crochet White Cat, Handmade Amigurumi Kitty in an Outfit, 10 in Home Decor, Pink Nose, Cat Lover Gift, Removable Accessories
```

**Description:**

```text
Handmade crochet white cat for cat lovers: a 10 in amigurumi in soft white with a pink nose and pink paws, dressed in an outfit with removable accessories, crocheted to order.

All white, with a pink nose and pink paws and a face that looks up at you from the bookshelf. She is crocheted by hand for your order and comes in an outfit with removable accessories, so you can display her fully dressed or set the accessories aside. Japanese/Korean-inspired styling keeps her soft and simple.

Good to know before you order: this is the finished crocheted cat, not a pattern or a digital download.

DETAILS
• Size: about 10 in
• Colors: white, with a pink nose and pink paws
• Outfit with removable accessories
• Crocheted entirely by hand

MADE TO ORDER & SHIPPING
• Processing time: 1–2 weeks, crocheted for your order
• Estimated delivery after it ships:
• USA: 9–15 days, tracked with USPS
• UK & Europe: 10–20 days, tracked with Royal Mail
• Canada: 10–20 days, tracked with Canada Post
• Australia: 10–20 days, tracked with Australia Post
• Other countries: 10–30 days by post

A FEW NOTES
• Colors can look a little different from one screen to another
• Every cat is handmade, so size and shape vary slightly; the differences are minor

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Thank you for shopping with Viet Delight.
```

**Tags (13):** `white cat gift`, `white cat decor`, `pink nose cat`, `crochet cat decor`, `amigurumi cat`, `cat mom gift`, `dressed cat figure`, `bookshelf decor`, `shelf sitter`, `cat owner gift`, `handmade cat gift`, `cat lover present`, `white cat lover`

**Đã đổi gì:**
- AI-prompt text ('Crochet pattern for…', 'should reflect…', 'must capture…') replaced with a real description of the finished cat
- 'Fluffy Toy', 'Plush' and 'for added playability' removed: toy framing; now shelf decor for cat lovers
- 'Custom … Like photos' dropped from the title: the listing never says what can be customized
- Unclear 'In-stock USA only body kitties' removed until confirmed
- Outfit kept exactly as the listing states it ('outfit with removable accessories'); no 'removable outfit' claimed, and beanie and overalls seen only in the photo not added
- '10&quot;' changed to '10 in'; misspelled banner removed; standard adult keepsake line added

**Chị cần làm thêm:**
- Ảnh chính trông như ảnh dựng (AI/render: ô len vuông đều, râu vẽ). Theo ý chị vẫn giữ ảnh AI, nhưng đừng gắn listing này thành hàng Feature; nếu có ảnh thật của bé móc thì nên để làm ảnh đầu. 'Bộ đồ + phụ kiện tháo rời' chỉ lấy từ đoạn prompt AI cũ (CHƯA BIẾT), còn mũ len + yếm trái tim chỉ thấy trong ảnh AI: chị xác nhận bé gửi đi mặc gì; nếu không kèm đồ, em bỏ khỏi tiêu đề và mô tả.
- 'In-stock USA only body kitties' không rõ nghĩa nên em bỏ — nếu ở Mỹ có sẵn bé chỉ thân (không đồ), chị báo em thêm 1 dòng.
- Em bỏ chữ 'Custom … Like photos' ở tiêu đề vì mô tả không nói tuỳ chỉnh gì. Nếu listing đang ở danh mục Toys thì chuyển sang Home & Living > Home Décor.


<a id="l4467740813"></a>
### Custom Soccer Player Crochet Doll from Photo, Personalized Football Amigurumi, Removable Team Jersey, Coach Gift, Soccer Fan Gift for Him

Listing: https://www.etsy.com/listing/4467740813 · giá hiện tại $64.00 · section Etsy: Personalized Keepsakes

Title cũ: *Custom Removable Outfit Soccer Player, Team Jersey Crochet Doll from Photo, Football Amigurumi Gift*

**Title mới** (137 ký tự):

```text
Custom Soccer Player Crochet Doll from Photo, Personalized Football Amigurumi, Removable Team Jersey, Coach Gift, Soccer Fan Gift for Him
```

**Description:**

```text
Custom soccer player crochet doll made from your photo: a personalized look-alike keepsake for players, coaches and fans, in your team colors and number.

Turn a player you know, a fan or a coach into a one-of-a-kind crochet doll. Recreate yourself, a loved one, the team captain or the team's MVP: this personalized amigurumi soccer player captures their look and their love of the beautiful game, a keepsake that celebrates every goal, every practice and every win.

WHAT YOU CAN PERSONALIZE
• Jersey, shorts and socks in your team colors, plus any player number
• Name on the back (optional)
• Skin tone, hair color, hairstyle and facial hair, for a true look-alike
• Removable outfit: the kit comes off, so the doll can be re-dressed and kept looking new
• Handcrafted details: cleats, wristbands and a mini crochet soccer ball
• Every order includes a small handmade charm as our thank-you

PRODUCT DETAILS
• Handmade crochet, personalized from your photo; not factory mass-produced
• Material: soft cotton yarn, fiberfill
• Two sizes: Medium approx. 8 in / 20 cm, Large approx. 10 in / 25 cm
• Original custom designs only: we do not copy official trademarked club logos, to respect intellectual property
• Handmade by our artisan team at Viet Delight

HOW TO ORDER
1. Choose your size, add to cart and complete checkout
2. In the Personalization box, tell us: jersey colors (shirt, shorts, socks), player number, name on back (optional), skin tone, hair and any special details
3. Upload 1–2 clear, well-lit photos (front view showing face and hairstyle)
4. Questions or extra accessories? Message us.

GIFT IDEAS
• A game-day surprise for a boyfriend or husband
• Soccer dads, team captains and MVPs
• A thank-you for a soccer coach
• Birthdays, Christmas, anniversaries and Valentine's Day

CARE
Spot clean gently with a damp cloth and mild soap. Air dry flat. Do not machine wash or tumble dry. Reshape hair or accessories by hand if needed.

PROCESSING & SHIPPING
Each doll is made to order by hand; please allow 10–12 days to craft your doll. Ships in secure packaging with tracking. Personalized items can't be returned, so please double-check your details; message us within 24 hours for any changes.

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

ABOUT VIET DELIGHT
We're a small family studio creating handmade, personalized crochet keepsakes. Every doll is crocheted stitch by stitch by our artisan team, to turn your favorite people and moments into a gift that lasts.
```

**Tags (13):** `husband gift`, `soccer gift for him`, `soccer mom gift`, `soccer dad gift`, `team captain gift`, `look alike doll`, `portrait doll`, `custom crochet doll`, `game day gift`, `soccer fan gift`, `boyfriend gift`, `player number doll`, `coach thank you`

**Đã đổi gì:**
- 'your child's first season' removed: aimed at the adult who orders it (a player, a coach, a fan, a partner)
- '100% handmade', 'skin-friendly', 'premium fiberfill' and the size name 'Premium' removed: unsupported claims and Brand Canon; sizes now Medium and Large
- 'FREE surprise gift' reworded to 'a small handmade charm as our thank-you'; 'THE PERFECT GIFT FOR' renamed 'GIFT IDEAS'
- 'a feature most crochet dolls don't offer' and 'we reply within a few hours' dropped: unverifiable comparison and response-time promise
- No club, league, national-team or player names; kept the line that we do not copy official club logos
- Emoji-led headings replaced by plain CAPS labels; standard adult keepsake line added
- 'your partner' back to the listing's own 'a loved one' (the only change needed there was dropping 'your child's first season')

**Chị cần làm thêm:**
- Ảnh chính có búp bê mặc áo giống đội tuyển quốc gia và giống cầu thủ nổi tiếng (số 10 kiểu Argentina, số 7, áo kiểu Brazil, Pháp, Tây Ban Nha, Bồ Đào Nha), vài áo có huy hiệu giống logo thật, lại mâu thuẫn câu 'không copy logo CLB'. Đây là rủi ro nhãn hiệu và quyền hình ảnh, khác với chuyện ảnh AI: đẩy ảnh xuống sau không hết rủi ro, vì bên giữ quyền báo vi phạm cho cả listing. Em đề nghị gỡ ảnh này khỏi Etsy và khỏi web (bản cắt trên web vẫn thấy áo kiểu Brazil, Tây Ban Nha, Pháp), thay bằng 1–2 búp bê mẫu không nhận ra là ai, không huy hiệu; chị quyết.
- Biến thể size trong Etsy đang tên 'Premium': chị đổi thành 'Large' cho khớp mô tả (Brand Canon cấm 'premium').
- Trong Etsy, nếu listing đang ở Toys & Games, chị chuyển sang Art & Collectibles > Dolls & Miniatures hoặc Home Décor; và xem lại câu hướng dẫn trong ô Personalization để không nhắc 'child'.


<a id="l4467697803"></a>
### Custom Crochet Angel Portrait Doll, Memorial Keepsake for Mom, Dad or Grandma, Amigurumi Angel Figurine, Sympathy Gift, Wooden Stand

Listing: https://www.etsy.com/listing/4467697803 · giá hiện tại $79.00 · section Etsy: Personalized Keepsakes

Title cũ: *Custom Amigurumi Angel Mother & Dad Doll, Portrait Crochet Figurine, Memorial Keepsake, Flower Bouquet*

**Title mới** (132 ký tự):

```text
Custom Crochet Angel Portrait Doll, Memorial Keepsake for Mom, Dad or Grandma, Amigurumi Angel Figurine, Sympathy Gift, Wooden Stand
```

**Description:**

```text
Custom crochet angel portrait doll: a handmade memorial keepsake for adults remembering a mother, father or grandmother. Made to order, about 8 in, with a wooden stand.

Our custom crochet angel doll is a personalized memorial gift, handcrafted with care by the artisans at Viet Delight, who bring a loved one's features to life in yarn.

YOUR ANGEL
Each angel is crocheted to order as a portrait of your loved one, with white wings, made from the details you share with us.

DETAILS
• Size: approx. 20 cm / 8 in tall
• Crocheted completely by hand from cotton yarn
• Comes with a sturdy wooden stand for a desk, bedside table, shelf or memorial altar

A GIFT FOR
A sympathy gift, a memorial keepsake for the first Christmas without a loved one, or a personal present for a grandmother on Mother's Day, a birthday or a religious milestone.

CARE
Gently spot clean, or hand wash with mild soap. Air dry flat in the shade. Do not machine wash or tumble dry, to protect the embroidered details and hair styling.

PROCESSING TIME
This is a fully custom handmade piece, so please allow 14 days for us to craft your doll. We pack every order with care.

A handmade devotional keepsake for adults. Not a toy and not tested as a children's product; keep away from young children.

Explore more handmade pieces and custom orders in our shop: https://vietdelightfinds.etsy.com
```

**Tags (13):** `memorial gift`, `remembrance gift`, `bereavement gift`, `loss of mother gift`, `loss of father gift`, `in memory of mom`, `grandma memorial`, `custom portrait doll`, `look alike doll`, `memorial altar decor`, `christmas memorial`, `religious keepsake`, `angel with wings`

**Đã đổi gì:**
- 'safe, hypoallergenic cotton yarn' changed to 'cotton yarn': untested material-safety claims removed
- 'arrives safely to your doorstep' and 'securely packaged' replaced by 'We pack every order with care'
- Customer name 'Ms. Jasmin' removed for privacy, and the section describing the pictured angel (not the shop's work) removed
- 'personalized guardian angel' changed to 'personalized memorial gift' so the faith piece makes no protection promise
- '100% Handmade', 'perfect example' and 'Perfect Gift For' toned down (Canon); standard devotional keepsake line added
- Title 'Angel Mother & Dad Doll' reworded to 'for Mom, Dad or Grandma' to match the single custom angel in the description

**Chị cần làm thêm:**
- Tiêu đề cũ ghi 'Angel Mother & Dad', nhưng mô tả và ảnh chỉ có 1 thiên thần bà. Em viết là 1 thiên thần làm theo yêu cầu (mẹ, bố hoặc bà) — chị xác nhận $79 là 1 bé hay 1 cặp, và có làm thiên thần bố không.
- Listing chưa nói khách gửi ảnh/thông tin người thân bằng cách nào (ô Personalization hay nhắn tin), và gửi hàng từ đâu — chị thêm giúp một dòng; em không tự đặt ra.
- Chị đã quyết giữ ảnh thiên thần (không phải ảnh của chị) và không đưa lên hàng nổi bật. Vì vậy em bỏ tên khách 'Ms. Jasmin', câu 'bé này làm theo đơn đặt', cả mục tả chi tiết bé trong ảnh (tóc len Brazil, vẽ bọng mắt, áo thêu hoa, dây chuyền thánh giá) và chữ 'Flower Bouquet' ở tiêu đề: giữ lại là lấy sản phẩm của người khác làm mẫu tay nghề của mình, và xưởng làm được chi tiết nào thì hiện CHƯA BIẾT. Chị cho em biết xưởng làm được bó hoa, dây chuyền, thêu áo… không để em thêm thành tuỳ chọn; trên Etsy nên sớm thay bằng ảnh bé do xưởng làm.
- Ảnh thiên thần không phải của mình nên cần ghi nguồn khi còn dùng: chị cho em tên hoặc handle chủ ảnh để em thêm một dòng cuối mô tả, ví dụ 'Photo courtesy of @…'. Em không tự điền tên.


<a id="l4382239441"></a>
### Crochet Christmas Elf, Handmade Nordic Holiday Decor, Amigurumi Elf Figurine, Tiered Tray Decor, Christmas Mantel Display, 10 in

Listing: https://www.etsy.com/listing/4382239441 · giá hiện tại $45.00 · section Etsy: Christmas Gift

Title cũ: *Handmade Crochet Christmas Elf: Nordic Holiday Decor*

**Title mới** (128 ký tự):

```text
Crochet Christmas Elf, Handmade Nordic Holiday Decor, Amigurumi Elf Figurine, Tiered Tray Decor, Christmas Mantel Display, 10 in
```

**Description:**

```text
Handmade crochet Christmas elf for holiday decor: a 10 in Nordic-style amigurumi elf with a striped pointy hat, cozy scarf and button details, made for the mantel, a tiered tray or a holiday vignette.

Our amigurumi Christmas elf is crocheted in rich holiday colors, with a striped pointy hat, a cozy mustard scarf and tiny button details. Set it on a bookcase or beside the tree, or tuck it into a festive gift box.

WHY YOU'LL LOVE IT
• Fully handmade amigurumi in cotton/acrylic yarn
• Classic Christmas palette: red boots, green trousers, striped hat, mustard scarf
• Stands or sits nicely for shelf styling, tiered-tray decor or tree-side vignettes
• A thoughtful holiday gift for collectors and elf lovers

SIZE
• Height: approx. 26 cm / 10.2 in including hat
• Light and portable

MATERIALS
• Yarn, plastic eyes, fiberfill, wooden/plastic buttons

CARE
• Spot clean with a damp cloth; lay flat to dry
• Do not machine wash

GIFTING
• Gift-ready packaging available; add a gift message at checkout at no extra cost
• This listing is for one elf. Want the pair (boy and girl) shown in the photos, or custom colors? Send us a message and we'll personalize.

PROCESSING & SHIPPING
• Made to order in small batches
• Processing time: 3–5 business days
• Ships worldwide with tracking

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Make your season extra merry with a handmade crochet elf, made to be displayed and remembered year after year.
```

**Tags (13):** `christmas elf decor`, `nordic christmas`, `scandinavian decor`, `holiday mantel decor`, `christmas figurine`, `crochet elf`, `elf collector gift`, `xmas decoration`, `secret santa gift`, `winter shelf decor`, `rustic christmas`, `amigurumi christmas`, `christmas gift idea`

**Đã đổi gì:**
- 'North-Pole magic', 'join pretend play' and 'a thoughtful holiday gift for kids' removed: toy/children framing and Brand Canon ('magic')
- 'Soft, cuddly, and safe—firmly stitched features, no loose beads' removed: a safety claim that also contradicted 'contains small parts (buttons)'
- 'safety eyes' to 'plastic eyes', 'hypoallergenic fiberfill' to 'fiberfill'; 'premium' dropped
- Safety note 'Recommended for ages 3+… supervise young children' replaced by the standard adult keepsake line
- Placeholder 'Order by [date] for Christmas delivery' removed: no holiday delivery promise
- 'free gift message' reworded to 'gift message at no extra cost'; text now says the listing is one elf although photos show a pair; math-alphabet headings replaced by plain CAPS; 'made to be hugged' dropped
- 'Sit your elf on a shelf' and 'elf … for your shelf' reworded: too close to the trademarked 'The Elf on the Shelf'; the pair is described as boy and girl, as the listing says

**Chị cần làm thêm:**
- Ảnh chính có 2 elf (một trai, một gái) nhưng listing bán 1 con, muốn cặp thì nhắn tin. Em đã ghi rõ trong mô tả; chị cân nhắc ảnh đầu chỉ 1 con, hoặc thêm biến thể 'Pair' nếu bán cặp thường xuyên.
- Câu 'Order by [date] for Christmas delivery' còn placeholder, em đã bỏ (không hứa giao theo ngày lễ). Hạn đặt Giáng sinh để Etsy tự tính theo thời gian xử lý và vận chuyển.
- Trong Etsy, nếu listing đang ở Toys/Stuffed Animals, chị chuyển sang Home & Living > Home Décor (Christmas/seasonal decor).


<a id="l4336274863"></a>
### Crochet Calico Cat, Handmade Amigurumi Tricolor Kitty, 10 in Shelf Decor with Minidress, Cat Lover Gift, Calico Mom Present

Listing: https://www.etsy.com/listing/4336274863 · giá hiện tại $55.00 · section Etsy: Cat Lover Gift

Title cũ: *Calico Cat crochet Amigurumi Plush Toy: Handmade plushie kitty, Home Decor, 10"*

**Title mới** (123 ký tự):

```text
Crochet Calico Cat, Handmade Amigurumi Tricolor Kitty, 10 in Shelf Decor with Minidress, Cat Lover Gift, Calico Mom Present
```

**Description:**

```text
Handmade crochet calico cat for calico owners and cat lovers: a 10 in amigurumi with a three-color coat, white belly and pink nose, crocheted to order for your home.

Calicos come with opinions, and this one is no exception. She is crocheted by hand in a three-color calico coat on white, as pictured, with a white belly, white paws and a pink nose. She comes dressed in a minidress with removable accessories, in a soft Japanese/Korean-inspired style, and sits happily on a bookshelf, a windowsill or a desk.

One thing to know: this is the finished crocheted cat, made for your order, not a pattern or a digital download.

DETAILS
• Size: about 10 in
• Colors: three-color calico on white, with a white belly, white paws and a pink nose
• Minidress with removable accessories
• Crocheted entirely by hand

MADE TO ORDER & SHIPPING
• Processing time: 1–2 weeks, crocheted for your order
• Estimated delivery after it ships:
• USA: 9–15 days, tracked with USPS
• UK & Europe: 10–20 days, tracked with Royal Mail
• Canada: 10–20 days, tracked with Canada Post
• Australia: 10–20 days, tracked with Australia Post
• Other countries: 10–30 days by post

HANDMADE NOTES
• Colors may look slightly different from one screen to another
• Size and shape vary a little, as each cat is made by hand; the differences are minor

A handmade decorative keepsake for adults and collectors. Not a toy and not tested as a children's product; keep away from young children.

Thank you for shopping with Viet Delight.
```

**Tags (13):** `calico cat gift`, `calico cat lover`, `tricolor cat`, `crochet calico`, `amigurumi cat`, `cat mom gift`, `crochet cat decor`, `windowsill decor`, `bookshelf decor`, `cat owner gift`, `dressed cat figure`, `handmade cat gift`, `calico cat decor`

**Đã đổi gì:**
- AI-prompt text ('Crochet pattern for…', 'should reflect…', 'must capture…') replaced with a real description of the finished cat
- 'Plush Toy', 'plushie kitty' and 'for added playability' removed: toy framing; now shelf decor for calico owners
- Stale 'In-stock USA: upcoming (on next September 2025)' removed
- Misspelled '[Please attenttion…]' banner replaced with a plain line that this is the finished cat, not a pattern
- '3 color white fur' reworded as a three-color calico coat on white, as pictured (patch colors not named because the listing does not name them); '10&quot;' changed to '10 in'; standard adult keepsake line added

**Chị cần làm thêm:**
- Ảnh chính không có váy và phụ kiện như mô tả ghi. Nếu bé gửi đi không kèm váy, chị báo em xoá dòng váy; nếu có kèm, nên thêm 1 ảnh bé mặc váy.
- Em bỏ dòng 'In-stock USA: upcoming (September 2025)' vì quá hạn — nếu giờ có sẵn hàng ở Mỹ chị báo em thêm lại.
- Nếu listing đang ở danh mục Toys/Stuffed Animals trên Etsy thì chuyển sang Home & Living > Home Décor.

