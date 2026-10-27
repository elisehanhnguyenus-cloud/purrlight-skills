# Vendored from elayadesign/redesign-skill (dormant)

- Source: https://github.com/elayadesign/redesign-skill (MIT, © 2026 Elaya; see `LICENSE` here)
- Pinned commit: `7df13f6a289f4a7f91c5fe3efd70f51fd584ec28` (26/10/2026)
- Vendored: 27/10/2026, with ai-design-skills, because `landing-page-design` names it as its companion for existing
  sites. The repo has no scripts, hooks or package files.
- Status: **dormant reference, not an installed skill.** The upstream `SKILL.md` is renamed `SKILL.upstream.md` so
  Claude Code never loads it. To use it, write a house wrapper in `.claude/skills/` (see `../README.md`).
- Files are byte-identical to upstream (git blob SHA-1). The only local change is the rename.

| Local path | Upstream path | Blob |
|---|---|---|
| `LICENSE` | `LICENSE` | `9ff21c8c5b2e713c357d3e15e641172a211eac21` |
| `README.md` | `README.md` | `ace7447dffa257a829f7b65e5adc653c15cb385e` |
| `redesign-existing-projects/SKILL.upstream.md` | `skills/redesign-existing-projects/SKILL.md` | `ad2860b078b490144bb45b851aa2c721ec738247` |

**Not vendored:** `.gitignore` (blob `55e3231285b01d85b844dad07d2659b3fa101647`).

Note for a future wrapper: line 58 of the upstream skill suggests `https://picsum.photos/…` placeholder images, which
HOUSE-RULES B5/B10 forbid on the site; the "Content" section asks for invented names and numbers (forbidden by B2).
