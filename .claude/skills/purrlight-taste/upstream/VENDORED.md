# Vendored from taste-skill

- Source: https://github.com/Leonxlnx/taste-skill (MIT, © 2026 Leonxlnx; see `LICENSE` here)
- Pinned commit: `6010f91a9935f1c167dfc500fb1a475681892e6b` (taste-skill 2.1.4, 2026-10-20)
- Vendored: 22/10/2026 (critic subset), then widened the same day after Elise's "20% rule" decision. Plain copy
  from that commit; nothing from the repo was run while vetting.
- Files are byte-identical to upstream (git blob SHA-1, check with `git hash-object <file>`). One local change: the
  upstream `SKILL.md` is renamed `SKILL.upstream.md` so it is read through the house wrapper `../SKILL.md` and is
  not loaded as a separate skill.

| Local path | Upstream path | Blob |
|---|---|---|
| `LICENSE` | `LICENSE` | `48a2f6640b81ff8eca9ce7f6a96337692713ef5b` |
| `SKILL.upstream.md` | `skills/taste-skill/SKILL.md` | `433d92105c76671250013e0312d82cb413f552bc` |
| `assets/app.css` | `skills/taste-skill/assets/app.css` | `865e4ed4804556aaff51897d22bf0c1bcbee9549` |
| `assets/base.css` | `skills/taste-skill/assets/base.css` | `75915d3b1ea8780090a365eabfb5c4b697cc6e86` |
| `assets/base.js` | `skills/taste-skill/assets/base.js` | `86ec0afacba394f64db238c44b8e7b980f2383b3` |
| `assets/charts.js` | `skills/taste-skill/assets/charts.js` | `fa0f459448daef137ad85900809695ad2617f512` |
| `assets/scenes/stage.css` | `skills/taste-skill/assets/scenes/stage.css` | `190763d3c1661e7a602bec21fce952dece67bf15` |
| `assets/scenes/stage.js` | `skills/taste-skill/assets/scenes/stage.js` | `fd7ba541b69f4dda347e52764faf7c25c198e02b` |
| `library/app.json` | `skills/taste-skill/library/app.json` | `c06fb45f8bb6b09398f19ba35b2f71ae2363a310` |
| `library/directions.json` | `skills/taste-skill/library/directions.json` | `f7f82e1a921e7009da7ce6f88410d2c8a94cf214` |
| `library/heroes.json` | `skills/taste-skill/library/heroes.json` | `74227d956a049f548d99f7b420ccc6218ae3c40e` |
| `library/motions.json` | `skills/taste-skill/library/motions.json` | `ff3818f561f338b15dbe1ff45620729ef0ff8d3b` |
| `library/palettes.json` | `skills/taste-skill/library/palettes.json` | `9de29b16db9c9f57b977dd38648a47f866572e54` |
| `library/photos.json` | `skills/taste-skill/library/photos.json` | `f403b772d3d6ae11ef07cfe44514fb019d918820` |
| `library/sections.json` | `skills/taste-skill/library/sections.json` | `042b8ab18ef1aa6e67a6f0f2c171fa9357528623` |
| `library/sites.json` | `skills/taste-skill/library/sites.json` | `ef070e3ccdf5cb9c388bab1fd0aacb0371cba413` |
| `library/type.json` | `skills/taste-skill/library/type.json` | `72c1c1e493b006a5c10ec4ee18db69c99fdc4892` |
| `references/app-screens.md` | `skills/taste-skill/references/app-screens.md` | `784439ed799484a98958764a5bf3ede2a1d25296` |
| `references/colour.md` | `skills/taste-skill/references/colour.md` | `a20a810fa1f080414035a5e0fdc5002977e56ab2` |
| `references/copy.md` | `skills/taste-skill/references/copy.md` | `69f20af2bff6d40cc07d4dcadaa45440ced550bf` |
| `references/critique.md` | `skills/taste-skill/references/critique.md` | `1989a85c83232e86aec66baf733a843947392b37` |
| `references/imagery.md` | `skills/taste-skill/references/imagery.md` | `ddd88d7a31dd3a5d7f4675ead4524f34d037f665` |
| `references/layout.md` | `skills/taste-skill/references/layout.md` | `dae26af173b4b60f96291f816700f390ffd8e37e` |
| `references/motion.md` | `skills/taste-skill/references/motion.md` | `c8f649d4fa45c369c53ce375a00d2f125182f181` |
| `references/research.md` | `skills/taste-skill/references/research.md` | `c38364af48f9e95dc90a2e6b47ae75ffdc24731e` |
| `references/scenes.md` | `skills/taste-skill/references/scenes.md` | `c2c568b5f1d18128658b28a273e90028fc22bb30` |
| `references/tells.md` | `skills/taste-skill/references/tells.md` | `9cfa4a89e466eb6df81b7a1b776421c378aad840` |
| `references/type.md` | `skills/taste-skill/references/type.md` | `c1552b700e9bebb2fedf79f82c875615d0f876ac` |
| `scripts/draw.mjs` | `skills/taste-skill/scripts/draw.mjs` | `6db3d89422057902457c97643c13f4b351d1459b` |
| `scripts/inspect.mjs` | `skills/taste-skill/scripts/inspect.mjs` | `105b0e5e0a9038244e04cfea4c79b2c66ae5833f` |
| `scripts/lib/app-draw.mjs` | `skills/taste-skill/scripts/lib/app-draw.mjs` | `e246a38f15d4f3b163a3d3aa5378c71462a4c24f` |
| `scripts/lib/cdp.mjs` | `skills/taste-skill/scripts/lib/cdp.mjs` | `03ef99c144923d0905ffc6222189bc8901836f4a` |
| `scripts/lib/probe.mjs` | `skills/taste-skill/scripts/lib/probe.mjs` | `911094e566b35508a15b344febdf1a51a1cae0cf` |
| `scripts/lib/rules.mjs` | `skills/taste-skill/scripts/lib/rules.mjs` | `558fcccf246ae4432fa05e30a32a25d9e46d214e` |
| `scripts/lint.mjs` | `skills/taste-skill/scripts/lint.mjs` | `9277761d18222e5fc75c85ed79aa032f3d086598` |
| `scripts/scenes.mjs` | `skills/taste-skill/scripts/scenes.mjs` | `7bbde8e6bdf27859af0d54db1e1b2756de3a7d56` |

**Not vendored, on purpose:**
- `scripts/assets.mjs`: downloads pictures and videos (including SVG) from 6 public APIs into `./assets`, a
  licence and IP risk on a shop site (HOUSE-RULES B5).
- `evals/`, `install.sh`, `README.md` and the plugin manifests: install.sh symlinks a global copy that changes with
  every `git pull`.

The scripts need Node 22+ and a Chromium (`CHROME_PATH=/opt/pw-browsers/chromium` in this container). They write
`.taste-skill/` in the current folder and a draw history at `$TASTE_SKILL_HISTORY` (default `~/.taste-skill/`).
