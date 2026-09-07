# AICoworker v2026.6.27 — kiểm định & hướng dẫn cài (kèm cách nạp Deep Critique)

> Tài liệu này ghi lại kết quả kiểm tra độc lập bản phát hành
> [v2026.6.27](https://github.com/Neurons-AI/aicoworker/releases/tag/v2026.6.27)
> của **AICoworker** (Neurons AI, Việt Nam), thực hiện ngày 05/09/2026, và hướng dẫn
> cài đặt từng nền tảng. Phần cuối chỉ cách đưa skill **Deep Critique** của repo này
> vào AICoworker.
>
> Kiểm tra được làm trên file tải trực tiếp từ GitHub Releases: đối chiếu checksum,
> đọc mã nguồn đính kèm release, bóc bộ cài để xem chữ ký số, và **cài + chạy thật**
> bản Linux trên Ubuntu 24.04. Không có mối quan hệ nào với nhà phát hành.

## 1. Kết luận nhanh

| Câu hỏi | Trả lời |
|---|---|
| Nó là gì? | Ứng dụng desktop (Electron) cho macOS / Windows / Linux, nhúng gateway **OpenClaw** (fork từ OpenClaw 2026.3.13, MIT) — một "đồng nghiệp AI" chạy 24/7 trên máy bạn, giao việc qua Telegram / WhatsApp / Zalo / web chat, tự động hoá trình duyệt, chạy model on-device (Gemma 4), voice, cron. Trước đây tên là **CrawBot** (đổi tên từ v2026.6.6). |
| Ai làm? | **Neurons AI** (GitHub `Neurons-AI`, Việt Nam). Tác giả chính: Nguyễn Hồng Phúc (`xnohat`). Web: aicoworker.net, neuronsai.net. Cộng đồng: Facebook group "crawbot". |
| Giấy phép | **PolyForm Perimeter 1.0.0** — dùng miễn phí cá nhân *và* thương mại, được đọc/sửa mã nguồn; **cấm** bán lại, host SaaS, white-label. Là *source-available*, không phải open-source. |
| File cài có đúng file nhà phát hành đăng không? | **Có.** SHA-512 trong các file `latest*.yml` của release khớp với file `.deb`, `.zip` macOS và `.exe` Windows đã tải. |
| macOS có an toàn mở không? | **Có chữ ký hợp lệ.** App ký bằng Apple *Developer ID Application: Hong Phuc Nguyen (Team EB8DGRZ9AB)*, hardened runtime, có notarization ticket đóng dấu sẵn, bật kiểm tra toàn vẹn `app.asar`. |
| Windows? | **Chưa ký số** (không có chữ ký Authenticode). SmartScreen sẽ chặn lần đầu — phải bấm *More info → Run anyway*. Hãy đối chiếu SHA-256 ở mục 4 trước khi bấm. |
| Có mã độc / theo dõi ngầm không? | Không thấy SDK theo dõi (không PostHog, Sentry, Google Analytics, Mixpanel…). Script cài Linux chỉ tạo shortcut. **Nhưng** app *tự kết nối relay `agent.aicoworker.net` ngay lần chạy đầu* vì Remote Access bật sẵn (chi tiết mục 3). |
| Chạy được thật không? | **Có.** Cài `.deb` trên Ubuntu 24.04 → app mở, gateway chạy trên `localhost:18789`, hiện Setup Wizard 4 bước (có tiếng Việt). |
| Nên dùng không? | Dùng được cho máy cá nhân nếu chấp nhận các lưu ý ở mục 3 (tắt relay nếu không cần, dùng API key chính thức, cấp quyền agent cẩn thận). Dự án còn trẻ, một tác giả chính, cập nhật rất dày — đừng đặt dữ liệu quan trọng vào mà không sao lưu. |

## 2. Những gì đã kiểm tra

### 2.1 Repo và mã nguồn

- Repo GitHub `Neurons-AI/aicoworker` **chỉ chứa README, LICENSE, logo, ảnh** (9 commit, toàn docs). Mã nguồn thật nằm trong file đính kèm release `aicoworker-2026.6.27-source.tar.gz` (108 MB, ~9.300 file): `electron/` (app), `src/` (giao diện React), `gateway-source/` (fork OpenClaw), scripts build, CI.
- Hai submodule **`docs` và `relay-server` rỗng** trong gói nguồn → mã của relay server (`agent.aicoworker.net`) **không audit được** từ gói này.
- Bản build trong `.deb` khớp phiên bản gói nguồn (`app.asar` chứa `package.json` name `aicoworker`, version `2026.6.27`, 68.587 file).
- `package.json` ghi license `MIT` nhưng file `LICENSE` là PolyForm Perimeter — metadata lệch nhau; **file LICENSE là bản có hiệu lực**.
- `SECURITY.md` vẫn là template mặc định của GitHub (chưa có quy trình báo lỗi bảo mật).

### 2.2 Checksum (file tải ngày 05/09/2026)

SHA-512 trong `latest-linux.yml`, `latest-mac.yml`, `latest.yml` khớp với:
`AICoworker-2026.6.27-linux-amd64.deb`, `AICoworker-2026.6.27-mac-arm64.zip`, `AICoworker-2026.6.27-win-x64.exe`.
SHA-256 của từng file xem bảng ở mục 4.

### 2.3 Chữ ký số

| Nền tảng | Kết quả |
|---|---|
| macOS (Apple Silicon, `.zip` cùng bản với `.dmg`) | Ký **Developer ID Application: Hong Phuc Nguyen (EB8DGRZ9AB)**, cấp bởi Apple Developer ID CA. Ký lúc 04/09/2026 04:43 UTC. Hardened runtime, `ElectronAsarIntegrity` bật, có file `Contents/CodeResources` (notarization ticket đóng dấu). Yêu cầu macOS ≥ 12. |
| Windows x64 `.exe` | **Không có chữ ký Authenticode** (security directory rỗng). Cấu hình build (`electron-builder.yml`: `forceCodeSigning: false`, chứng chỉ Windows bị comment trong CI) xác nhận điều này. |
| Linux `.deb` | Không ký (bình thường với .deb phát hành ngoài repo). Script `postinst`/`postrm` chỉ: cập nhật desktop database, icon cache, tạo symlink `/usr/local/bin/aicoworker`. |

### 2.4 Cài và chạy thật (Linux)

- `dpkg -i` + cài phụ thuộc (`libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libuuid1 bubblewrap socat`) → cài vào `/opt/AICoworker` (~2,9 GB sau cài).
- Khởi động: app copy Node.js đi kèm, bật gateway OpenClaw (`ws://localhost:18789`), mở cửa sổ **Setup Wizard** ("Welcome to AICoworker", chọn English / Tiếng Việt / 日本語 / 中文, nút *Skip Setup* / *Next*).
- App mở cổng DevTools `127.0.0.1:9223` (chỉ localhost) để chính agent tự kiểm tra giao diện — đây là thiết kế, không phải lỗi.

### 2.5 Kết nối ra ngoài quan sát được khi khởi động lần đầu (chưa nhập gì)

| Đích | Mục đích | Ghi chú |
|---|---|---|
| `wss://agent.aicoworker.net` | Relay Remote Access / Shared Web Chat | **Bật sẵn** (`DEFAULT_REMOTE_CONFIG.enabled = true`, `relayEnabled = true`). Sau khi xác thực relay thành công, app gửi **một** báo cáo thiết bị: hostname, hệ điều hành, CPU/GPU/RAM/ổ đĩa, UUID máy, serial, số liệu tải hiện tại. Theo mã nguồn (`electron/network/device-agent.ts`): chỉ gửi khi có kết nối relay, tối đa 1 lần/10 phút, **không** có telemetry định kỳ. |
| GitHub Releases (`Neurons-ai/AICoworker`) | Kiểm tra cập nhật (electron-updater) | Chỉ kiểm tra; **không tự tải** trừ khi bật "Tự động tải cập nhật". |
| AWS Bedrock | Gateway thử liệt kê model | Lỗi vô hại khi không có key AWS. |
| (cục bộ) `~/aicoworker/backup/` | Auto-backup cấu hình mỗi 24h | Không ra mạng. |

Kênh relay dùng mã hoá đầu-cuối (Ed25519 + X25519 + AES-256-GCM, khoá host ghim trong URL chia sẻ) nên relay chỉ chuyển bytes mù — nhưng như đã nói, mã relay server không có trong gói nguồn.

## 3. Cần cân nhắc trước khi dùng

1. **Tắt relay nếu chỉ dùng trên máy.** Vào **Remote Access** → tắt **"Relay công khai"** (hoặc tắt hẳn Remote Access). Khi tắt, app không còn lý do kết nối `agent.aicoworker.net`.
2. **Chọn nhà cung cấp AI bằng API key chính thức.** App có các provider kiểu *"WebAuth"* (Claude Web, ChatGPT Web, Gemini, Grok…) dùng **cookie phiên đăng nhập** của claude.ai / chatgpt.com để gọi API nội bộ của trang web — cách này thường vi phạm điều khoản sử dụng của các dịch vụ đó và có thể bị khoá tài khoản. Dùng API key (Anthropic, OpenAI, Google…) hoặc model on-device thì an toàn về điều khoản.
3. **Zalo và WhatsApp cá nhân dùng thư viện không chính thức** (`zca-js`, Baileys) → có rủi ro tài khoản bị hạn chế. Telegram bot API là kênh chính thức, an toàn hơn.
4. **Agent có quyền rất rộng:** chạy lệnh, đọc/ghi file, điều khiển trình duyệt (có chống phát hiện bot), thậm chí *tự vá chính app* (skill `aicoworker-self-patch`) và tự điều khiển giao diện qua DevTools. Khi tạo agent, làm theo skill đi kèm `sandbox-management`: trợ lý thường → *Native sandbox, chỉ đọc/ghi Workspace, chặn internet*. Chỉ cấp thêm khi thật cần.
5. **Nặng:** tải 0,5–1,3 GB, sau cài ~3 GB; khuyến nghị RAM 8 GB+, thêm nữa nếu chạy model on-device.
6. **Windows chưa ký số** → chỉ tải từ GitHub Releases chính thức và đối chiếu SHA-256 ở mục 4.
7. **Đang dùng CrawBot ≤ v2026.5.9?** Không cập nhật trong app được — phải tải bản mới cài đè (Windows giữ nguyên GUID nên cài đè tại chỗ). Update trong app chỉ hoạt động từ v2026.6.6.
8. **Độ trưởng thành:** 64 sao, 1 tác giả chính, ~40 commit mỗi bản, phát hành gần như hằng tuần. Sao lưu dữ liệu/agent trước khi cập nhật.

## 4. Tải và cài

Tất cả link tải: https://github.com/Neurons-AI/aicoworker/releases/tag/v2026.6.27

| File | Dành cho | Dung lượng | SHA-256 (tính từ file tải ngày 05/09/2026) |
|---|---|---|---|
| `AICoworker-2026.6.27-mac-arm64.dmg` | Mac chip Apple (M1/M2/M3/M4…) | 1,17 GB | `f3e7f3df9feb9fb376fa7d7174ea0b8c529ce8e56299af4ebcb5aa04bfddb557` |
| `AICoworker-2026.6.27-mac-x64.dmg` | Mac chip Intel | 1,23 GB | `513e55449c003bf33706e726d621407c9f618c5cd81506d794fe0b7b839bcab1` |
| `AICoworker-2026.6.27-win-x64.exe` | Windows 10/11 64-bit (đa số máy) | 542 MB | `5e169c1c6b217cdcc62c3be90beeec73860e76ce9ac4e720a476fc85f9765ca3` |
| `AICoworker-2026.6.27-win-arm64.exe` | Windows trên chip ARM (Snapdragon) | 513 MB | — (SHA-512 trong `latest-arm64.yml`) |
| `AICoworker-2026.6.27-linux-amd64.deb` | Ubuntu / Debian | 647 MB | `15167225a92e06a1413d1ba1fa515df286f69afd2ddaf265fb8e7a630ab5a14e` |
| `AICoworker-2026.6.27-linux-x86_64.AppImage` | Linux khác | 751 MB | — (SHA-512 trong `latest-linux.yml`) |
| `AICoworker-2026.6.27-mac-arm64.zip` | Bản zip (dùng cho auto-update) | 854 MB | `8eae7dc6c44126f0ecf78ec862b08bc8a6133492e8f7c6d6d5d44af6680d0576` |
| `aicoworker-2026.6.27-source.tar.gz` | Mã nguồn để audit | 108 MB | `907b84a59025d25d640541e88f144db1982f212435cc0b133da662f8e3599c09` |

**Máy tôi là loại nào?**
- Mac: menu  → *About This Mac* → dòng **Chip: Apple M…** → tải bản `mac-arm64`; **Processor: Intel** → `mac-x64`.
- Windows: *Settings → System → About → System type*: có chữ **ARM-based** → `win-arm64`; còn lại → `win-x64`.

**Đối chiếu SHA-256 sau khi tải** (khớp với bảng trên là đúng file):

```
# macOS (Terminal)
shasum -a 256 ~/Downloads/AICoworker-2026.6.27-mac-arm64.dmg

# Windows (PowerShell)
Get-FileHash "$env:USERPROFILE\Downloads\AICoworker-2026.6.27-win-x64.exe" -Algorithm SHA256

# Linux
sha256sum AICoworker-2026.6.27-linux-amd64.deb
```

### 4.1 macOS

1. Mở file `.dmg`, kéo **AICoworker** vào thư mục **Applications**.
2. Mở app lần đầu từ Applications. Nếu macOS hỏi *"downloaded from the internet, are you sure?"* → **Open**. Nếu bị chặn hẳn: *System Settings → Privacy & Security* → kéo xuống → **Open Anyway**.
3. Cho phép microphone/camera chỉ khi bạn dùng tính năng voice/video.

### 4.2 Windows

1. Chạy file `.exe` (bộ cài one-click, cài vào `%LOCALAPPDATA%\Programs\AICoworker`, tạo shortcut Desktop + Start Menu).
2. SmartScreen hiện *"Windows protected your PC"* → **More info → Run anyway** (vì bản này chưa ký số — xem 2.3).
3. Gỡ: *Settings → Apps → AICoworker → Uninstall* (dữ liệu trong `%APPDATA%\aicoworker` được giữ lại).

### 4.3 Linux

```
# Ubuntu / Debian
sudo apt install ./AICoworker-2026.6.27-linux-amd64.deb
aicoworker        # hoặc mở từ menu ứng dụng

# AppImage
chmod +x AICoworker-2026.6.27-linux-x86_64.AppImage
./AICoworker-2026.6.27-linux-x86_64.AppImage
```

Gỡ: `sudo apt remove aicoworker`. Log nằm ở `~/.config/aicoworker/logs/`.

### 4.4 Lần chạy đầu

Setup Wizard 4 bước: **Ngôn ngữ** (có Tiếng Việt) → **Nhà cung cấp AI** (khuyên dùng API key; hoặc model on-device) → **Gói kỹ năng** → **Xác minh**. Ngay sau đó:

- Vào **Remote Access** → tắt **Relay công khai** nếu không cần điều khiển từ xa (mục 3.1).
- *Cài đặt → Cập nhật*: app kiểm tra bản mới trên GitHub Releases khi khởi động; chỉ tải khi bạn bấm **Tải cập nhật** (trừ khi bật *Tự động tải cập nhật*).

## 5. Nạp Deep Critique vào AICoworker

AICoworker (qua OpenClaw) đọc skill theo chuẩn **AgentSkills** — chính là định dạng `SKILL.md` mà Deep Critique đang dùng, nên **không cần sửa gì**.

**Cách nhanh — dùng file zip có sẵn:**

1. Tải [`dist/deep-critique-claude-ai.zip`](../dist/deep-critique-claude-ai.zip).
2. Trong AICoworker: **Kỹ năng (Skills) → Nhập kỹ năng (Import Skill)** → chọn file zip.
3. App giải nén vào `skills/deep-critique-claude-ai/` trong thư mục dữ liệu OpenClaw (mở đúng chỗ bằng nút **Mở thư mục kỹ năng**), tự bật skill, và báo *"Đã nhập và kích hoạt kỹ năng"*. **Mở phiên chat mới** rồi gõ: *"phản biện giúp tôi kế hoạch …"*.

**Cách thủ công:** copy thư mục `plugins/deep-critique/skills/deep-critique/` (gồm `SKILL.md` + `references/`) vào thư mục kỹ năng nói trên, khởi động lại gateway (*Cài đặt → Gateway*).

Lưu ý:
- AICoworker **không có** sub-agent `deep-critic` của Claude Code, nên skill tự chuyển sang chế độ *nhập vai tuần tự* (giống trên claude.ai): mỗi vòng một lượt, dùng `references/deep-critic-persona.md`. Đây là hành vi đã ghi trong `SKILL.md` và [`AGENTS.md`](../AGENTS.md) của repo này.
- Chất lượng phản biện phụ thuộc model bạn chọn trong AICoworker; model on-device nhỏ (Gemma 4 E2B/E4B) sẽ yếu hơn Claude rất nhiều ở bài 10 vòng.
- Cơ chế import ở trên được xác nhận bằng cách đọc mã nguồn (`electron/main/ipc-handlers.ts`, handler `skill:import`); chưa chạy thử trọn 10 vòng trong AICoworker.

## 6. Nguồn đối chiếu

- Release: https://github.com/Neurons-AI/aicoworker/releases/tag/v2026.6.27
- Giấy phép: `LICENSE` (PolyForm Perimeter 1.0.0) và `LICENSE_PLAIN_ENGLISH.md` trong repo/gói nguồn
- Gói nguồn đính kèm release: `aicoworker-2026.6.27-source.tar.gz` — các file đã đọc: `electron-builder.yml`, `.github/workflows/release.yml`, `electron/remote/config.ts`, `electron/network/device-agent.ts`, `electron/network/device-inventory.ts`, `electron/remote/crypto/e2ee.ts`, `electron/main/updater.ts`, `electron/browser/providers/claude-web.ts`, `electron/main/ipc-handlers.ts`, `electron/openclaw-bundled/skills/*/SKILL.md`, `gateway-source/docs/tools/skills.md`
- OpenClaw (gateway gốc): https://github.com/openclaw/openclaw
