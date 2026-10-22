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

## Setup for each session

```sh
P=<session scratchpad>; rm -rf "$P/site" && cp -r website "$P/site"   # work on a copy; website/ changes only after Elise picks
# the container runs as root, so Chromium needs --no-sandbox: a tiny wrapper in the scratchpad
printf '#!/bin/sh\nexec /opt/pw-browsers/chromium --no-sandbox "$@"\n' > "$P/chrome-nosandbox" && chmod +x "$P/chrome-nosandbox"
export CHROME_PATH="$P/chrome-nosandbox" TASTE_SKILL_HISTORY="$P/.taste-skill-history.json"
cd "$P/site"                                                           # .taste-skill/ working files land here
# e.g. node /home/user/purrlight-skills/.claude/skills/purrlight-taste/upstream/scripts/inspect.mjs custom-orders/index.html --out "$P/taste-before" --widths 1280,390
```

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
  - `assets.mjs` was not installed (HOUSE-RULES B5). Where the method says to search open collections, use Elise's
    photos from `website/assets/`, or draw shapes and illustrations for the preview.
  - Then list in the report which pictures Elise would need to shoot or supply.
  - The dealt picsum photos are fine as placeholders in a preview, clearly marked, and never shipped.
- **Inspector findings that hit the brand core** (cream with peach reads as the "assistant palette" to the meter):
  pass `--allow palette-claude,palette-cream,palette-terracotta`. Treat other FAILs as the skill intends.
- **CDN scenes.** GSAP and Lenis from a CDN are fine in a preview. If Elise adopts a scene, self-host pinned copies
  (B7).
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
