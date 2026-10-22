---
name: purrlight-taste
description: >-
  Art direction and design taste for Purrlight Studio's customer pages, using taste-skill v2.1.4 (the "anti-slop"
  frontend skill). It critiques what makes a page look generic or "AI-made", deals fresh directions, and builds
  bold redesign previews. Use it when Elise asks to make the site look less AI-made, more designed or more
  interesting, wants a design critique, a restyle or a redesign of a page or section ("web nhìn giống AI làm", "bớt
  giống AI", "soi thiết kế", "làm đẹp lại trang"). Not for payment, price or order-logic work.
---

# Purrlight taste

**First read `.claude/skills/HOUSE-RULES.md`.** It is short. Elise wants this skill's creativity: apply only its
Part A (the brand core) and Part B (safety and process), and otherwise follow taste-skill's own method.

The full method is in `upstream/SKILL.upstream.md`. Read it and follow it. In it, `<skill>` means
`.claude/skills/purrlight-taste/upstream`. Run the scripts from a scratchpad copy of the site, not from inside the
repo (HOUSE-RULES B1, B8).

## Setup: repeat it in every Bash call

Shell variables do not survive between Bash calls, so every command carries its own setup. Use a dedicated folder,
and copy the site into it only when it does not exist yet, so a preview in progress is never wiped.

```sh
P=<session scratchpad>; K=/home/user/purrlight-skills/.claude/skills/purrlight-taste/upstream
[ -d "$P/taste/site" ] || { mkdir -p "$P/taste/tmp" && cp -r /home/user/purrlight-skills/website "$P/taste/site"; }
mkdir -p "$P/taste/tmp"                                                  # TASTE_SKILL_TMP must exist
[ -x "$P/taste/chrome" ] || { printf '#!/bin/sh\nexec /opt/pw-browsers/chromium --no-sandbox "$@"\n' > "$P/taste/chrome"; chmod +x "$P/taste/chrome"; }
cd "$P/taste/site" && CHROME_PATH="$P/taste/chrome" TASTE_SKILL_HISTORY="$P/taste/history.json" TASTE_SKILL_TMP="$P/taste/tmp" \
  node "$K/scripts/inspect.mjs" custom-orders/index.html --out "$P/taste/before"
```

- The Chromium wrapper is needed because the container runs as root.
- Always pass an absolute `--out`, for `draw.mjs` too: `--out "$P/taste/.taste-skill"`.
- `inspect.mjs` runs at its default widths (1440, 768, 390). The 360 px check belongs to the HOUSE-RULES B10 smoke
  script.

- `upstream/scripts/draw.mjs` deals a direction (idea, composition, palette, type, section blueprints) from
  `upstream/library/`. It is local only.
- `upstream/scripts/inspect.mjs` renders a page in Chromium at 1440/768/390, measures it and saves screenshots
  (`--out` a scratchpad folder).
- `upstream/scripts/scenes.mjs` checks scroll scenes.
- `upstream/scripts/lint.mjs` is a static scan.
- `upstream/references/*.md` are the craft notes: colour, type, layout, motion, imagery, copy, tells, critique,
  scenes, research and app screens.
- `upstream/assets/` holds starter CSS/JS and the scroll-scene stage. They are for previews; anything adopted into
  `website/` follows HOUSE-RULES B7.

## Purrlight specifics

- **Existing brand.** For a restyle, use the method's "An existing brand or design system" route: pass
  `--keep palette` so the base colours from HOUSE-RULES A2 stay. A full redesign may also deal type and everything
  else. Merlin and the logo stay as they are (A1).
- **Pictures.**
  - Never call an image-generation tool without Elise's OK for that exact call (HOUSE-RULES B5). Do not count an
    image tool as `product-photo`.
  - Pass `--have photography,product-photo,video` to `draw.mjs`: her real product photos and the Merlin video
    exist.
  - `assets.mjs` was not installed (HOUSE-RULES B5). Where the method says to search open collections, use Elise's
    photos from `website/assets/`, or draw shapes and illustrations for the preview.
  - Then list in the report which pictures Elise would need to shoot or supply.
  - The dealt picsum photos are fine as placeholders in a preview, clearly marked, and never shipped.
- **Inspector findings that hit the brand core** (cream with peach reads as the "assistant palette" to the meter):
  pass `--allow palette-claude,palette-cream,palette-terracotta`. Treat other FAILs as the skill intends.
- **CDN scenes and fonts.**
  - GSAP and Lenis from a CDN, and dealt Google Fonts `<link>` tags, are fine in a preview.
  - If Elise adopts one, self-host a pinned copy (B7).
  - This pinned version has no scroll-scene library, so the draw never deals scenes. Do not fetch scene files;
    `scenes.mjs` applies only to a scene built by hand.
- **Two ways to run it.**
  - *Review*: the method's "A review stops here" step, giving findings and the three changes that would move the
    page most.
  - *Explore*: deal one to three directions and build preview pages.
- **Report to Elise in plain Vietnamese.**
  - Show screenshots (before and after or side by side) for each direction, with the three biggest changes, and
    what each one changes from the old Canon (fonts, labels, motion…).
  - List what is placeholder.
  - A score from the critique rubric may be mentioned, along with the fact that it is the skill's own taste.
  - Let her pick before anything touches `website/`.
