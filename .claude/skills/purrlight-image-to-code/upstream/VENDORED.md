# Vendored from imagegen-skills (image-to-code only)

- Source: https://github.com/Leonxlnx/imagegen-skills (MIT, © 2026 Leonxlnx; see `LICENSE` here). The cuongmeai.com
  list names it as part of taste-skill; it moved here in taste-skill 2.1.1.
- Pinned commit: `beb16b0d0f4dae9a6f5cb04ea41e97b93a54ab8e` (2026-10-19). History has 2 commits: `ff95861` (all
  skills) and `beb16b0` (adds a CI test only).
- Vendored: 22/10/2026, after Elise's OK, by plain copy. The skill is text only: no scripts, hooks, telemetry or
  network.
- Byte-identical to upstream. One local change: `SKILL.md` is renamed `SKILL.upstream.md` so its own trigger ("must
  first generate the design image(s) itself") does not load. It is read only through `../SKILL.md`.

| Local path | Upstream path | Blob |
|---|---|---|
| `LICENSE` | `LICENSE` | `48a2f6640b81ff8eca9ce7f6a96337692713ef5b` |
| `SKILL.upstream.md` | `skills/image-to-code/SKILL.md` | `d19f8de112252ea88724c540647cad85b7653d46` |

**Not vendored:**
- `imagegen-frontend-web`, `imagegen-frontend-mobile` and `brandkit`: image generation only. Brandkit would redraw
  the logo and Merlin.
- `README.md`, the plugin manifests (they track `main`), `tests/` and CI.
