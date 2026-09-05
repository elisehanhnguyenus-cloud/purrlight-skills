# 🕳️ Deep Critique — Phản biện 10 vòng săn điểm mù cho Claude

[🇻🇳 Tiếng Việt](README.md) · [🇬🇧 English](README.en.md)

> **Skill phản biện chuyên sâu đầu tiên bằng tiếng Việt cho Claude.** Trước khi bạn xuống tiền, ký hợp đồng, đổi việc hay chốt một kế hoạch — Deep Critique đưa quyết định đó qua **10 vòng phản biện, mỗi vòng một lăng kính khác nhau**, để tìm ra điểm yếu và điểm mù mà cả bạn **lẫn chính AI** thường bỏ sót.
>
> *The first Vietnamese-language deep-critique skill for Claude: a 10-round, 10-lens adversarial review of any plan or decision. [Full English README](README.en.md).*

**Cài trong 30 giây (Claude Code):**

```
/plugin marketplace add elisehanhnguyenus-cloud/purrlight-skills
/plugin install deep-critique@purrlight-skills
```

Dùng claude.ai (web/app điện thoại)? → [Tải file zip này](dist/deep-critique-claude-ai.zip) rồi xem [cách cài 4 bước](#cách-b--claudeai-web--app-điện-thoại).
Dùng Codex hoặc agent khác? → xem [AGENTS.md](AGENTS.md).
Dùng AICoworker (app desktop chạy OpenClaw)? → xem [docs/AICOWORKER.md](docs/AICOWORKER.md): kiểm định bản v2026.6.27, cách cài từng máy, và cách nạp skill này vào đó.

---

## Nó khác gì việc hỏi AI "phản biện giúp tôi"?

Hỏi AI phản biện một lần, bạn nhận về những rủi ro *dễ thấy nhất* — rồi AI khen kế hoạch của bạn "nhìn chung ổn". Hỏi lại lần nữa, nó diễn đạt lại chính các ý cũ. Deep Critique được thiết kế để phá đúng cái bẫy đó:

| Cơ chế | Vì sao quan trọng |
|---|---|
| **10 lăng kính, không phải 10 lần hỏi** | Điểm mù không thể thấy từ chỗ đang đứng — mỗi vòng ép AI đổi hẳn chỗ đứng: soi lại đề bài → mổ xẻ hệ thống → kiểm tra giả định → luật sư của quỷ → đảo ngược → các bên liên quan → góc nhìn bên ngoài → **điểm mù của chính AI** → pre-mortem → tổng hợp xếp hạng |
| **Luật chống lặp giả** | Vòng sau bị **cấm** nhắc lại phát hiện của vòng trước. Đào không ra thì phải khai "vòng khô" — trung thực hơn là tái chế ý cũ cho có vẻ chăm chỉ |
| **Mọi phát hiện phải kiểm chứng được** | Phát hiện không kèm "cách kiểm chứng rẻ nhất trong ≤1 tuần" chỉ là lo lắng suông — bị hạ cấp hoặc loại |
| **Vòng 8: AI tự soi chính mình** | Vòng duy nhất em chưa thấy ở skill nào khác: AI liệt kê thiên lệch của chính nó trong 7 vòng trước, và những gì nó *về nguyên tắc không thể biết* |
| **Lăng kính theo ngành** | Đề bài thuộc ngành có sẵn thư viện (hiện có e-commerce) thì mỗi vòng được nạp thêm **mũi khoan riêng của ngành** — những chỗ hay chết mà người trong nghề biết còn kế hoạch thì hay quên. Nạp theo nhu cầu, không thuộc ngành thì không tốn gì |
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

### Cách C — Codex, ChatGPT và các agent khác

Skill chỉ là file Markdown — không script, không runtime — nên chạy được ở mọi agent biết đọc `AGENTS.md`. File [`AGENTS.md`](AGENTS.md) ở gốc repo là hợp đồng chạy chéo nền tảng: nó chỉ chỗ `$SKILL_DIR`, liệt kê từng phần cần năng lực gì của host, và quy định rõ skill phải hạ cấp thế nào khi host không spawn được sub-agent, không ghi được file, hoặc không có web search.

### Cách D — AICoworker (app desktop chạy OpenClaw)

AICoworker đọc skill theo chuẩn AgentSkills nên dùng được ngay file zip ở Cách B: trong app vào **Kỹ năng → Nhập kỹ năng** → chọn `dist/deep-critique-claude-ai.zip` → mở phiên chat mới. Không có sub-agent nên skill tự chạy chế độ nhập vai tuần tự như trên claude.ai.

Chưa cài AICoworker? Đọc [docs/AICOWORKER.md](docs/AICOWORKER.md) trước: kết quả kiểm định độc lập bản v2026.6.27 (checksum, chữ ký số macOS/Windows, kết nối ra ngoài, các lưu ý an toàn) và hướng dẫn cài cho macOS / Windows / Linux.

## Cách dùng

```
/deep-critique Tôi định nghỉ việc lương 25 triệu để mở quán cà phê với 500 triệu tiết kiệm, mặt bằng đã xem ở quận 7. Soi giúp tôi.
```

- Nói tự nhiên cũng kích hoạt: *"phản biện giúp tôi..."*, *"tìm điểm mù..."*, *"kế hoạch này có gì sai không?"*
- Việc nhỏ dùng bản nhẹ: *"**phản biện nhanh:** [vấn đề]"* → 5 vòng, ~1/3 chi phí.
- **Mẹo ăn tiền nhất:** dán kèm số liệu, ngân sách, file kế hoạch thật. Trong ca chạy mẫu, phát hiện giá trị nhất đến từ việc skill đối chiếu kế hoạch với *chính file nội bộ của người hỏi* và bắt được mâu thuẫn ngân sách 153%.
- Bán hàng online? Skill tự nạp **thư viện lăng kính e-commerce** — dòng tiền, phí sàn, tỷ lệ hoàn, rủi ro IP, phụ thuộc nền tảng — kèm công thức kiểm chứng sẵn cho từng nghi vấn.
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
├── AGENTS.md                            ← hợp đồng chạy chéo agent (Codex, ChatGPT...)
├── README.en.md                         ← bản tiếng Anh đầy đủ
├── plugins/deep-critique/               ← plugin đầy đủ cho Claude Code
│   ├── skills/deep-critique/            ← skill 10 vòng + persona thợ săn điểm mù
│   │   └── references/                  ← persona + thư viện lăng kính ngành (e-commerce)
│   └── agents/deep-critic.md            ← agent phản biện độc lập
├── dist/deep-critique-claude-ai.zip     ← bản cài cho claude.ai web/mobile (dùng được cho AICoworker)
├── docs/BAO-CAO-MAU.md                  ← báo cáo mẫu (ẩn danh, từ ca chạy thật)
└── docs/AICOWORKER.md                   ← kiểm định + hướng dẫn cài AICoworker, nạp skill vào đó
```

## Về người tạo

Deep Critique được xây và dùng thật tại **PURRLIGHT STUDIO LLC** — studio thiết kế đồ chơi và kinh doanh hàng handmade tại Texas.

Mình là solo entrepreneur, xuất phát điểm là dân marketing & strategy trên sàn thương mại điện tử, khởi nghiệp từ 2018. Mình đã đi qua rất nhiều ngách: dịch vụ tổ chức sự kiện, workshop thủ công, bán hàng online, rồi đầu tư vào POD, dropshipping, hàng trademark... và **đốt hơn $20.000** vào những mô hình chưa bao giờ chuyển đổi tốt.

Khi đó mình ước được biết sớm hơn về tư duy phản biện, và có nhiều thời gian nghiên cứu mô hình kinh doanh hơn — để không đổ tiền vào những ngách không đáng hoặc quá rủi ro. Deep Critique chính là công cụ mình ước mình có từ 2018: một hội đồng phản biện bắt mình kiểm chứng giả định *trước* khi xuống tiền, chứ không phải sau khi mất nó. Phiên bản đầu tiên được kiểm nghiệm bằng chính kế hoạch Q4 của studio — nó tìm ra 36 điểm mù, trong đó có một mâu thuẫn ngân sách mà chính mình không nhớ đã tự đặt ra.

## Roadmap

- [x] v1.1 — Thư viện lăng kính ngành **e-commerce**
- [ ] Thư viện lăng kính ngành F&B và dịch vụ
- [x] Bản song ngữ Việt–Anh hoàn chỉnh
- [ ] Bộ kit người mới: hướng dẫn có hình + video tiếng Việt

Góp ý & báo lỗi: mở [Issue](../../issues) hoặc nhắn trực tiếp. Nếu skill bắt được điểm mù đáng giá cho bạn — kể lại trong Issues, đó là phần thưởng lớn nhất cho người làm.

---

## 🇬🇧 English

**Deep Critique** is a 10-round adversarial review skill for Claude — a Claude Code plugin, a
claude.ai skill, and portable to Codex and other agents via [`AGENTS.md`](AGENTS.md). Each round
attacks a plan from a different lens (reframing, systems decomposition, assumption audit, steelman,
inversion, stakeholders, outside view, **the AI's own blind spots**, pre-mortem, synthesis). Two hard
rules make the iteration real: later rounds are *forbidden* from repeating earlier findings — an
honest "dry round" beats recycled insight — and every finding ships with the cheapest ≤1-week
verification or is demoted to speculation. Text-only package, read-only agent, MIT licensed.

📖 **[Read the full English README →](README.en.md)**

---

<sub>MIT © 2026 PURRLIGHT STUDIO LLC · Claude is a trademark of Anthropic — this is an independent community skill, not an official Anthropic product.</sub>
