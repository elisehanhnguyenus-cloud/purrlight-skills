# Vendored from taste-skill

- Source: https://github.com/Leonxlnx/taste-skill (MIT, © 2026 Leonxlnx; see `LICENSE` here)
- Pinned commit: `6010f91a9935f1c167dfc500fb1a475681892e6b` (taste-skill 2.1.4, 2026-10-20)
- Vendored: 22/10/2026, by plain copy from that commit. Nothing from the repo was run.
- Files are byte-identical to upstream (git blob SHA-1, check with `git hash-object <file>`):

| Local path | Upstream path | Blob |
|---|---|---|
| `LICENSE` | `LICENSE` | `48a2f6640b81ff8eca9ce7f6a96337692713ef5b` |
| `references/critique.md` | `skills/taste-skill/references/critique.md` | `1989a85c83232e86aec66baf733a843947392b37` |
| `references/tells.md` | `skills/taste-skill/references/tells.md` | `9cfa4a89e466eb6df81b7a1b776421c378aad840` |
| `references/copy.md` | `skills/taste-skill/references/copy.md` | `69f20af2bff6d40cc07d4dcadaa45440ced550bf` |
| `scripts/lint.mjs` | `skills/taste-skill/scripts/lint.mjs` | `9277761d18222e5fc75c85ed79aa032f3d086598` |

**Not vendored, on purpose:**
- `SKILL.md`: its trigger is very broad and it says "Adopt it" and "do not argue with the meter".
- `draw.mjs`: deals random fonts, palettes and stock photos.
- `assets.mjs`: downloads pictures from 6 public APIs into `./assets`.
- `inspect.mjs`, `scenes.mjs` and `lib/`: launch headless Chrome and serve the current folder.
- `assets/`: ES2015 browser code, plus GSAP/Lenis from a CDN.
- `library/`, `evals/`, `install.sh` and the plugin manifests.

The house wrapper is `../SKILL.md`. The rules that override these files are in `../../BRAND-LOCKED.md`.
