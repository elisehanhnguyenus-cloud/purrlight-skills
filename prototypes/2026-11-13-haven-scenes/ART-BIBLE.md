# Haven: art bible cho Gemini, Muse (13/11/2026)

Dùng cùng `scenes.json` (tệp cảnh), `shotlist.csv` (bảng cảnh) và thư mục `guides/` (khung bố cục). Quy trình đầy đủ ở
`docs/HAVEN-AI-ART-PIPELINE-2026-11-12.md`.

## 1. "Tranh cảnh" là gì

Là tranh **bối cảnh**, giống sân khấu trước khi diễn viên bước ra. Tranh cảnh vẽ mặt tiền tiệm, con phố, cây chậu, bên
trong tiệm (tường, vòm, kệ sách, đèn, quầy cà phê, sàn gỗ). Ba thứ còn lại đặt lên sân khấu đó:
- **nhân vật:** Merlin, anh và chị, Maine Coon, chú chó. AI vẽ, theo ảnh tham khảo;
- **món hàng:** ảnh thật, code đặt vào chỗ trống;
- **logo và chữ:** file thật, code đặt vào.

## 2. Phong cách

Ghép hai nguồn chị gửi ngày 13/11:
- **Nét:** từ mẫu tranh nét chì. Nét chì hoặc mực mảnh, lỏng tay, gạch bóng nhẹ, để nhiều khoảng giấy trống.
- **Màu:** từ bản thiết kế nhân vật chị mặc váy kem. Màu nước loang nhẹ, mép mềm, thấy vân giấy.

**Kết quả mong muốn:** tranh minh họa sách truyện cổ điển, nét chì và màu nước trên giấy kem. Ấm, yên, nhiều khoảng
thở.

Mẫu nét chì là tranh minh họa sách cổ điển (Winnie-the-Pooh). Chỉ dùng để tham khảo cách vẽ nét:
- không đưa tranh đó, nhân vật trong tranh đó hay tên họa sĩ vào prompt;
- không đưa lên web.

**Bảng màu** (tham khảo, không cần đúng tuyệt đối):

| Màu | Mã | Dùng cho |
|---|---|---|
| Kem giấy | `#F6EFE4` | nền, tường sáng |
| Be yến mạch | `#E8D9C4` | mặt tiền, gỗ sáng |
| Hồng phấn | `#E9B8B5` | mái hiên, rèm, hoa |
| Vàng hồng (kim loại) | `#C99A86` | đèn, khung, tay nắm |
| Xanh xô thơm | `#A8B89A` | lá, cây chậu |
| Ánh đèn màu đào | `#F6C08F` | cửa sổ sáng, đèn dây |
| Nét mực | `#5B4A42` | nét vẽ (nâu ấm, không đen tuyền) |

## 3. Nhân vật

| Nhân vật | Tham khảo | Ghi chú |
|---|---|---|
| **Merlin** | Ảnh thật Merlin (thư mục Drive `01-tham-khao`) | Mèo tuxedo: lưng đen; ngực, mõm, bàn chân trắng; vệt trắng giữa trán; mắt xanh lục; mũi hồng. Mặc định không đeo nơ Giáng sinh. Chị chọn: mèo thật không phụ kiện, hay bộ đồ thương hiệu (mũ beret vàng nghệ có ngôi sao khâu, yếm xanh xô thơm, ba lô màu ô liu, "the cat who takes notes"). Làm một bản thiết kế nhân vật Merlin trước, cùng phong cách, rồi dùng nó cho mọi cảnh |
| **Anh** | Bản thiết kế nhân vật chị gửi (Drive, không lưu trên GitHub) | Bản hiện tại vẽ kiểu bán tả thực. Vẽ lại một bản theo phong cách mục 2 để hợp với chị. Áo polo đỏ: em gợi ý đỏ gạch dịu cho hợp bảng màu; chị quyết |
| **Chị** | Bản thiết kế nhân vật chị gửi (Drive, không lưu trên GitHub) | Bản váy kem hợp bảng màu nhất (em đề xuất làm mặc định). Áo dài đỏ để dành cho bản Tết. Tóc bob |
| **Maine Coon** | Ảnh mèo thật khách gửi | **Cần khách đồng ý bằng văn bản trước khi lên web.** Tốt nhất xin trước khi đưa ảnh vào Gemini hoặc Muse |
| **Chú chó** | Không theo con chó thật nào | Chó nhỏ lông kem, nằm cạnh bàn cà phê |

## 4. Luật cho mọi tranh và video

- **Không chữ, không logo.** Bảng hiệu để trống màu kem. Bìa sách để trống. AI vẽ chữ hay sai.
- **Không vẽ món hàng** của shop. Kệ tròn và các khung trên tường để trống, code đặt ảnh thật vào.
- **Không người lạ.** Chỉ anh và chị.
- Đúng **khung hình và góc máy** của khung bố cục.

## 5. Mẹo khi dùng Gemini, Muse

- **Ảnh nào làm tham khảo:**
  - Đính kèm file `_KHUNG.jpg`, không đính kèm `_GHICHU.jpg`. Bản ghi chú có chữ và ô màu, AI sẽ vẽ theo.
  - Cắt ảnh nhân vật cho hết chữ trước khi đính kèm (chữ trong ảnh tham khảo hay bị chép vào tranh).
- **Giữ đồng bộ giữa các cảnh:** dùng đúng khối phong cách ở mục 6 và cùng bộ ảnh nhân vật cho mọi cảnh.
- **Khi xuất file:**
  - xuất PNG cỡ lớn nhất công cụ cho phép;
  - ghi lại công cụ, ngày và prompt vào cột "Ghi chú" của bảng cảnh.
- **Soát trước khi gửi em:** mở `viewer.html` (trang "Soát tranh Haven"), kéo tranh vào để xem chỗ trống có khớp không.

## 6. Prompt (tiếng Anh)

**Khối phong cách**, dán đầu mọi prompt:

> Classic storybook illustration: loose, fine pencil and ink linework with light cross-hatching, soft transparent
> watercolor washes with gentle pigment blooms, warm cream paper texture showing through, lots of breathing room.
> Warm late-afternoon light, peach lamp glow. Palette: cream, oat beige, blush pink, rose-gold metal, sage green, warm
> brown ink lines. Cozy, calm, handmade feeling. No text, no letters, no logos, no watermarks.

**Merlin, bản thiết kế nhân vật** (đính kèm 2–3 ảnh thật):

> [style block] Character sheet of one tuxedo cat named Merlin, matching the attached photos exactly: black back and
> head, white chest, white muzzle and white paws, a white blaze between the eyes, green eyes, pink nose. No collar, no
> bow. [Or, for the brand outfit: wearing a turmeric-gold beret with a small stitched star, a sage-green bib and a
> little olive backpack.] Front, three-quarter, side and back views, sitting, walking and curled up, plus five facial expressions. Plain
> cream background, no text.

**Anh và chị, vẽ lại theo phong cách** (đính kèm bản thiết kế đã cắt hết chữ):

> [style block] Redraw the attached character exactly (same face, glasses, hairstyle, body shape and outfit) in this
> style. Full-body turnaround (front, three-quarter, side, back) and sitting at a small café table. Plain cream
> background, no text.

**S01 mặt tiền** (đính kèm `S01_mattien_16x9_KHUNG.jpg`; làm thêm một bản 9:16 với khung 9:16):

> [style block] Match the composition and camera angle of the attached layout image exactly. A small two-storey corner
> shop on a quiet European street: beige and rose-gold façade, salmon fish-scale roof tiles, three dormer windows, a
> small arched balcony with climbing vines. A blank cream signboard above the open front door (leave the board
> completely empty). Through the open door, a warm interior with an empty round three-tier display. A bay
> display window with books and fairy lights only. A French café corner under a blush striped awning: a small round
> table, two chairs, two teacups with rising steam; the attached man and woman sit there; a small cream dog lies by the
> table. A Maine Coon cat sits on the doorstep licking a paw (match the attached cat photo). Potted sage, rosemary,
> thyme, feverfew daisies, a sasanqua camellia with single pink flowers, a japonica camellia with double blush flowers,
> hydrangeas, a monstera and peonies on the balcony, the window boxes and by the steps. Cobblestones, a vintage street
> lamp, a white picket fence, soft trees behind.

**S03 nội thất ngang rộng** (đính kèm `S03_noithat_32x9_KHUNG.jpg`):

> [style block] Match the attached layout image exactly. Inside the same cozy shop, very wide panoramic view: tall
> wooden bookcases on the left with fairy lights, a blush armchair and a floor lamp, a back wall with three arched
> niches holding books, a rose-gold chandelier, string lights around the central arch, a round three-tier wooden display
> in the middle (leave its tiers empty), vintage shelves, and a curved café counter with cakes and teacups on the right.
> On the left wall and the right wall, four empty picture frames each, in different sizes (leave every frame empty).
> Striped blush wallpaper, warm wooden floor with a round rug.

**S04 kệ tròn** (đính kèm `S04_ke_16x9_KHUNG.jpg`):

> [style block] Match the attached layout image exactly. Close view of the round three-tier wooden display under an
> arch with fairy lights and book niches. Leave the three tiers empty except: on the top tier, Merlin the tuxedo cat
> (match the Merlin character sheet) sits beside a closed fabric-bound book with a blank cover.

**Video vòng lặp** (đính kèm tranh tĩnh đã duyệt làm khung đầu):

> Animate only small details, keep everything else perfectly still: leaves swaying gently, steam rising from the
> teacups, fairy lights twinkling, the Maine Coon licking its paw, the dog breathing slowly. Seamless loop, the last
> frame matches the first. No camera movement, no text.

**S02 qua cửa** (khung đầu là S01, khung cuối là S03 hoặc S04):

> Slow, smooth camera push straight through the open front door into the shop, ending exactly on the attached last
> frame. No cuts, no text.

**S05 mở sách:**

> [style block] A fabric-bound storybook with a blank embroidered cover opens slowly on a wooden tier; the pages are
> blank cream paper. Gentle, smooth, no text.
