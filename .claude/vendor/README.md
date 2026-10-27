# Bản chép để dành (chưa kích hoạt)

**27/10/2026.** Elise gửi repo `elayadesign/ai-design-skills` và dặn: "cứ tải hết về, bây giờ chưa cần nhưng sau sẽ
cần". Em tải về nguyên văn, ghim theo commit, cất ở đây cùng repo "anh em" `elayadesign/redesign-skill` mà repo kia
gọi là skill đi kèm để nâng cấp web có sẵn.

**Thư mục này không phải là skill đang chạy.** Claude Code chỉ nạp skill trong `.claude/skills/`. Ở đây mỗi file
`SKILL.md` gốc được đổi tên thành `SKILL.upstream.md`, nên Claude không tự dùng chúng. Lý do: mô tả của cả ba skill
tự kích hoạt cho mọi việc làm web ("ANY landing page… even when the user does not mention design", "whenever the user
wants to improve… an EXISTING site"), và giá trị thiết kế của chúng đè lên luật nhà: đổi font sang Geist/Manrope, bỏ
chữ nghiêng, bỏ gradient nền, đổi Title Case thành sentence case, bịa tên khách và số liệu cho "thật", dùng ảnh
picsum.photos. Cài nguyên văn thì sẽ cãi nhau với `HOUSE-RULES.md` và với các skill `purrlight-*`.

**Khi cần dùng:** viết một skill bọc ngoài trong `.claude/skills/purrlight-<tên>/` theo cách đã làm ngày 22/10
(`.claude/skills/README.md`): đặt `disable-model-invocation: true`, ghi rõ luật nhà thắng, chỉ lấy phần hợp, rồi chị
duyệt. Kết quả soát chi tiết ghi trong `docs/` (mục 27/10 của TONG-HOP).

| Thư mục | Nguồn | Commit | Gồm |
|---|---|---|---|
| `elayadesign-ai-design-skills/` | https://github.com/elayadesign/ai-design-skills (MIT, © 2026 Elaya) | `5e578402da175cdc539c900e4b09ceecfadcb37c` | `landing-page-design`, `design-to-motion`, README, LICENSE |
| `elayadesign-redesign-skill/` | https://github.com/elayadesign/redesign-skill (MIT, © 2026 Elaya) | `7df13f6a289f4a7f91c5fe3efd70f51fd584ec28` | `redesign-existing-projects`, README, LICENSE |

Không dùng `curl … /main/…` hay `git clone` bản mới nhất để cập nhật: muốn cập nhật thì tải commit mới, đọc lại toàn
bộ, so sánh, rồi mới thay file và sửa `VENDORED.md`.
