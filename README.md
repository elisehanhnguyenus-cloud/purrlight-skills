# 🕳️ Deep Critique — Phản biện 10 vòng săn điểm mù cho Claude

> **Skill phản biện chuyên sâu đầu tiên bằng tiếng Việt cho Claude.** Trước khi bạn xuống tiền, ký hợp đồng, đổi việc hay chốt một kế hoạch — Deep Critique đưa quyết định đó qua **10 vòng phản biện, mỗi vòng một lăng kính khác nhau**, để tìm ra điểm yếu và điểm mù mà cả bạn **lẫn chính AI** thường bỏ sót.
>
> *The first Vietnamese-language deep-critique skill for Claude: a 10-round, 10-lens adversarial review of any plan or decision. [English section below](#-english).*

**Cài trong 30 giây (Claude Code):**

```
/plugin marketplace add elisehanhnguyenus-cloud/purrlight-skills
/plugin install deep-critique@purrlight-skills
```

Dùng claude.ai (web/app điện thoại)? → [Tải file zip này](dist/deep-critique-claude-ai.zip) rồi xem [cách cài 4 bước](#cách-b--claudeai-web--app-điện-thoại).

---

## Nó khác gì việc hỏi AI "phản biện giúp tôi"?

Hỏi AI phản biện một lần, bạn nhận về những rủi ro *dễ thấy nhất* — rồi AI khen kế hoạch của bạn "nhìn chung ổn". Hỏi lại lần nữa, nó diễn đạt lại chính các ý cũ. Deep Critique được thiết kế để phá đúng cái bẫy đó:

| Cơ chế | Vì sao quan trọng |
|---|---|
| **10 lăng kính, không phải 10 lần hỏi** | Điểm mù không thể thấy từ chỗ đang đứng — mỗi vòng ép AI đổi hẳn chỗ đứng: soi lại đề bài → mổ xẻ hệ thống → kiểm tra giả định → luật sư của quỷ → đảo ngược → các bên liên quan → góc nhìn bên ngoài → **điểm mù của chính AI** → pre-mortem → tổng hợp xếp hạng |
| **Luật chống lặp giả** | Vòng sau bị **cấm** nhắc lại phát hiện của vòng trước. Đào không ra thì phải khai "vòng khô" — trung thực hơn là tái chế ý cũ cho có vẻ chăm chỉ |
| **Mọi phát hiện phải kiểm chứng được** | Phát hiện không kèm "cách kiểm chứng rẻ nhất trong ≤1 tuần" chỉ là lo lắng suông — bị hạ cấp hoặc loại |
| **Vòng 8: AI tự soi chính mình** | Vòng duy nhất em chưa thấy ở skill nào khác: AI liệt kê thiên lệch của chính nó trong 7 vòng trước, và những gì nó *về nguyên tắc không thể biết* |
| **Tách 3 loại căn cứ** | Mỗi phát hiện ghi rõ: chắc chắn (có nguồn) / suy luận (nêu logic) / phỏng đoán — không trộn lẫn để ra vẻ chắc chắn |

**Kết quả đo được** (cùng một đề bài, cùng model Claude, chấm bằng script đếm tự động):

| | Deep Critique 10 vòng | Hỏi AI thường |
|---|---|---|
| Số phát hiện | **36** | 22 |
| Phát hiện kèm cách kiểm chứng cụ thể | **36/36** | ~1 |
| Nguồn web xác minh | ~10 | 0 |
| Câu hỏi ngược cho người ra đề | 5 | 0 |
| Tự khai giới hạn của AI | Có | Không |

Quan trọng hơn con số: bản AI thường **trượt toàn bộ nhóm phát hiện nặng nhất** — mâu thuẫn giữa kế hoạch và tài liệu nội bộ của chính người hỏi, phương án bị khung đề bài che mất, và phép nhân rủi ro cấu trúc (~8 rủi ro "chấp nhận được" nhân lại = ~90% xác suất có sự cố).

📋 **Xem trước sản phẩm**: [Báo cáo mẫu từ ca chạy thật (đã ẩn danh)](docs/BAO-CAO-MAU.md)

## Cài đặt

### Cách A — Claude Code (khuyên dùng, chạy được 5 vòng song song)

```
/plugin marketplace add elisehanhnguyenus-cloud/purrlight-skills
/plugin install deep-critique@purrlight-skills
```

Cập nhật sau này: `/plugin marketplace update purrlight-skills`.

<details><summary>Hoặc cài thủ công không dùng lệnh</summary>

1. Tải repo này (Code → Download ZIP), giải nén.
2. Copy thư mục `plugins/deep-critique/skills/deep-critique` vào `~/.claude/skills/` (Windows: `C:\Users\<bạn>\.claude\skills\`).
3. Copy file `plugins/deep-critique/agents/deep-critic.md` vào `~/.claude/agents/`.
</details>

### Cách B — claude.ai (web + app điện thoại)

1. Tải file [`dist/deep-critique-claude-ai.zip`](dist/deep-critique-claude-ai.zip).
2. Trên claude.ai (máy tính): **Settings → Capabilities** → bật **Code execution and file creation**.
3. **Settings → Customize → Skills** → nút **+** → **Upload a skill** → chọn file zip vừa tải.
4. Bật công tắc skill. App điện thoại cùng tài khoản tự có — không cài thêm gì.

## Cách dùng

```
/deep-critique Tôi định nghỉ việc lương 25 triệu để mở quán cà phê với 500 triệu tiết kiệm, mặt bằng đã xem ở quận 7. Soi giúp tôi.
```

- Nói tự nhiên cũng kích hoạt: *"phản biện giúp tôi..."*, *"tìm điểm mù..."*, *"kế hoạch này có gì sai không?"*
- Việc nhỏ dùng bản nhẹ: *"**phản biện nhanh:** [vấn đề]"* → 5 vòng, ~1/3 chi phí.
- **Mẹo ăn tiền nhất:** dán kèm số liệu, ngân sách, file kế hoạch thật. Trong ca chạy mẫu, phát hiện giá trị nhất đến từ việc skill đối chiếu kế hoạch với *chính file nội bộ của người hỏi* và bắt được mâu thuẫn ngân sách 153%.
- Cuối báo cáo có mục **Câu hỏi ngược** — trả lời rồi yêu cầu *"chạy thêm chu kỳ tập trung vào X"* để đào tầng sâu hơn.

Nhận về: báo cáo đầy đủ gồm kết luận 3 dòng → bảng Top điểm mù xếp hạng (nghiêm trọng × xác suất) → đề bài nên sửa lại thành gì → toàn bộ phát hiện 10 vòng → 3 kiểm chứng nên làm ngay tuần này → giới hạn của chính bản phản biện → 3–5 câu hỏi ngược.

## An toàn & minh bạch

- Toàn bộ gói chỉ là **file văn bản Markdown** (hướng dẫn quy trình cho Claude) + 1 file khai báo JSON. Không script, không hook, không code chạy ngầm — mở từng file bằng Notepad kiểm tra được.
- Agent `deep-critic` chỉ có quyền **đọc** (Read/Glob/Grep) và tìm kiếm web — không có quyền ghi file hay chạy lệnh.
- Skill chỉ thấy những gì bạn chủ động đưa vào hội thoại; mọi thứ chạy trong tài khoản Claude của chính bạn.

## Giới hạn (nói thẳng)

- 10 vòng là 10 lượt của **cùng một AI** — hội tụ giữa các vòng không phải là đồng thuận độc lập của 10 chuyên gia người thật.
- Nó **không tiên tri**. Nó liệt kê các đường thất bại + cách kiểm tra sớm từng đường — bảo hiểm tư duy, không phải quả cầu pha lê.
- Chất lượng phụ thuộc bối cảnh bạn đưa: không có số liệu thật thì chỉ phản biện được logic, không bắt được mâu thuẫn dữ liệu.
- Bản đầy đủ 10 vòng tốn đáng kể hạn mức tin nhắn của gói Claude — dùng cho quyết định lớn; việc vặt hãy hỏi thường.

## Cấu trúc repo

```
purrlight-skills/
├── .claude-plugin/marketplace.json      ← danh mục marketplace (cài qua /plugin)
├── plugins/deep-critique/               ← plugin đầy đủ cho Claude Code
│   ├── skills/deep-critique/            ← skill 10 vòng + persona thợ săn điểm mù
│   └── agents/deep-critic.md            ← agent phản biện độc lập
├── dist/deep-critique-claude-ai.zip     ← bản cài cho claude.ai web/mobile
└── docs/BAO-CAO-MAU.md                  ← báo cáo mẫu (ẩn danh, từ ca chạy thật)
```

## Về người tạo

<!-- TODO(Elise): 3–5 dòng của chính chị — vì sao một chủ shop handmade lại cần và xây công cụ phản biện này. Đây là phần duy nhất không ai sao chép được. Gợi ý chất liệu: quyết định kinh doanh nào từng khiến chị ước gì có người phản biện mình sớm hơn? -->

Deep Critique được xây và dùng thật tại **PURRLIGHT STUDIO LLC** — studio đồ thủ công crochet tại Texas — nơi mỗi quyết định giảm giá, nhập nguyên liệu hay chạy quảng cáo đều là tiền thật của một đội 2 người. Phiên bản đầu tiên được kiểm nghiệm bằng chính kế hoạch Q4 của studio: nó tìm ra 36 điểm mù, trong đó có một mâu thuẫn ngân sách mà chính người viết kế hoạch không nhớ mình đã đặt ra.

## Roadmap

- [ ] v1.1 — Thư viện lăng kính theo ngành (e-commerce, F&B, dịch vụ)
- [ ] Bản song ngữ Việt–Anh hoàn chỉnh
- [ ] Bộ kit người mới: hướng dẫn có hình + video tiếng Việt

Góp ý & báo lỗi: mở [Issue](../../issues) hoặc nhắn trực tiếp. Nếu skill bắt được điểm mù đáng giá cho bạn — kể lại trong Issues, đó là phần thưởng lớn nhất cho người làm.

---

## 🇬🇧 English

**Deep Critique** is a 10-round adversarial review skill for Claude (Claude Code plugin + claude.ai skill), written in Vietnamese. Each round attacks a plan from a different lens — problem reframing, systems decomposition, assumption audit, steelman, inversion, stakeholders & second-order effects, outside view (base rates, web-verified), **the AI's own blind spots**, pre-mortem & stress test, and final synthesis. Two hard rules make the iteration real: later rounds are *forbidden* from repeating earlier findings (honest "dry round" beats recycled insight), and every finding must ship with the cheapest ≤1-week verification or be demoted to speculation.

In a benchmarked head-to-head on the same prompt (auto-graded), it produced **36 findings vs 22** for vanilla Claude — and uniquely caught the highest-severity class: contradictions with the user's own internal documents, options hidden by the question's framing, and structural risk multiplication. Install: `/plugin marketplace add elisehanhnguyenus-cloud/purrlight-skills` → `/plugin install deep-critique@purrlight-skills`. Text-only package (no scripts, no hooks); the bundled agent is read-only + web search. MIT licensed.

---

<sub>MIT © 2026 PURRLIGHT STUDIO LLC · Claude is a trademark of Anthropic — this is an independent community skill, not an official Anthropic product.</sub>
