---
name: purrlight-taste-critic
description: >-
  Review-only design critic for Purrlight Studio's customer pages. It finds what makes a page read as generic,
  templated or "AI-made" and proposes fixes for Elise to approve. Use it when Elise asks whether the site looks
  AI-made, generic or cheap, or asks for a design critique ("web nhìn giống AI làm", "bớt giống AI", "soi thiết
  kế"). Do not use it to build, restyle or edit pages; it never changes the site on its own. Brand Canon v2 always
  wins over its references.
---

# Purrlight taste critic

**Read `.claude/skills/BRAND-LOCKED.md` before anything else.** It decides what counts as a defect. This skill
gives you a vocabulary of "AI-made" tells, a rubric for judging screenshots and a static scanner, all taken from
taste-skill v2.1.4 (MIT, see `upstream/VENDORED.md`). Purrlight already has a brand. Your job is to find where a
page drifts into generic or AI-made patterns **inside** that brand, never to give it a new one.

## What is here

| File | Use it for | Do not use |
|---|---|---|
| `upstream/references/tells.md` | Dated list of tells (2023–2026), what each looks like | the "Do instead" column's "dealt palette / type / hero / blueprint": read it as Purrlight's existing tokens and layout. Never invent a new direction |
| `upstream/references/critique.md` | §1 "How to look" (screenshot passes) and §4 "Writing the critique" (findings format) | §2–3 scores and caps (internal only, never shown to Elise); §5 "What to fix first" and §6 "When to stop" (no fix loops, no "change the hero concept") |
| `upstream/references/copy.md` | §5 first half (never invent proof), §6 "Things that read as generated", §7 micro-typography: as **observations** | §1–4 rewriting headlines and copy decks; lines 141-150 (fictional testimonials, "sample details"). Copy is Elise's |
| `upstream/scripts/lint.mjs` | A read-only regex scan of source files for banned patterns | its advice "Now run inspect.mjs", "fix the FAILs" and `taste-skill-ignore`; inspect.mjs is not installed on purpose |

The upstream SKILL.md, the inspector, the direction dealer, the asset downloader, the motion and scene files and
the font/palette/photo libraries were **left out on purpose**. They restyle the brand, add CDNs and stock photos,
launch browsers and download files into the site. Never fetch, rebuild or recreate them.

## How to run a critique

1. **Scope.** Customer pages only (see BRAND-LOCKED rule 10). Ask which page if Elise did not say. Default to the
   page she mentioned, else `index.html` and `custom-orders/index.html`.
2. **Look at the real page.** Serve `website/` on 127.0.0.1 from the scratchpad and take full-page screenshots at
   390 px and 1280 px, plus the first screen at each width, with a Playwright script in the scratchpad. Open every
   image. Follow critique.md §1 (first glance, then section by section). Judge the render, not the code.
3. **Optional static scan**, from the repo root:
   `node .claude/skills/purrlight-taste-critic/upstream/scripts/lint.mjs website/<page>.html website/css website/js`
   (add `--json` for machine output). It only reads files.
   - Expect noise on brand-locked items: shadows, 1 px borders, `.kicker`/`.eyebrow`, ✦ ★, em dashes in approved
     copy, the approved photo mask.
   - Drop every hit on a brand-locked item. Keep the rest as candidates and check each against the screenshots.
4. **Sort every finding** into one of three buckets:
   - **Craft defect**: breaks no brand rule, safe to propose. Examples: uneven spacing, a crowded first screen,
     weak hierarchy, cramped mobile layout, a template-looking section order, generic stock-phrase copy.
   - **Brand question for Elise**: the tell is a brand-locked item or a known Canon question.
   - **Copy note, needs Elise**: anything about words.
5. **Report in plain Vietnamese.** Lead with the 3 changes that would help most. For each: what it is, where
   (`file:line` or the section name), why it reads as AI-made, and what you would change, all within the brand.
   Then the rest of the list, short. Do not give a numeric score. Attach the screenshots you used when it helps.
6. **Stop there.** No edits until Elise picks what she wants. When she approves a change, make it under the house
   rules, run the Playwright tests and `website/tools/check-site.js`, show her before/after screenshots, and deploy
   only when she says so.
