---
name: purrlight-impeccable
description: >-
  Impeccable's design commands, markdown-only, for Purrlight Studio's customer pages: bolder, quieter, colorize,
  typeset, layout, delight, overdrive, clarify, distill, polish, critique, audit, harden, adapt, onboard, optimize,
  animate, shape. Use it when Elise asks to push an existing page or section in a direction ("đậm/nổi hơn",
  "nhẹ/tiết chế lại", "thêm màu", "chữ đẹp hơn", "dễ thương/thú vị hơn", "gọn lại", "trau chuốt") or names an
  Impeccable command. For open-ended art direction or "less AI-made" redesigns, prefer purrlight-taste.
---

# Purrlight Impeccable (markdown-only)

**First read `.claude/skills/HOUSE-RULES.md`.** Elise wants this skill's creativity: apply only its Part A (brand
core) and Part B (safety and process), and otherwise follow Impeccable. The method is
`upstream/SKILL.upstream.md` plus its `upstream/reference/*.md` playbooks (Apache-2.0, see `upstream/VENDORED.md`).

## This install has no engine

Only the text was installed, on purpose: the engine binary carries the telemetry, hooks and update checks.

- **Setup step 1 (the launcher) does not exist here.** Use the "Launcher unavailable" fallback in
  `SKILL.upstream.md` and send its one-line message. Never try any `.claude/skills/impeccable/scripts/impeccable
  <verb>` line, never run `npx impeccable` (in any form), and never create `.claude/skills/impeccable/`.
- **No detector.** Where audit, critique, layout, typeset or polish say to run the detector or critique storage,
  skip it and write "deterministic scan unavailable". Do the rest by reading code and screenshots.
- **Not available:** `live`, `generate`, `hooks`, `pin`, `doctor` and the native iOS/Android references. Say so if
  asked.
- **new-work and shape without the engine.** new-work.md calls engine verbs that are not installed and says
  skipping them is a contract violation. For this install, that contract is replaced by these steps:
  1. Skip `concept-seed`, `serve-question`, `surface-brief`, `build-phase`, `comp-spec`, `comp-diff` and
     `embed-prompt`.
  2. Rank your own 5–7 directions. Present the top three, your pick and the standing exit to Elise in plain
     Vietnamese, or with the AskUserQuestion tool, which is the structured-tool path new-work already describes.
  3. Always write `seed: none (unavailable)` in FORM.
  4. Write the surface brief as a plain file in `$P/impeccable/`.
  5. Tell the inline finish reviewer that these are expected here and not findings: a missing seed or roll, a
     missing `.impeccable/build/state.json`, and the FINISH line's raster-provenance clause.
- **Project context.** There is no PRODUCT.md or DESIGN.md. Use, in this order:
  - the Brand Canon summaries (top of `website/README.md`, TONG-HOP §8c);
  - HOUSE-RULES;
  - the CSS tokens in `website/css/style.css` and `website/custom-orders/custom-orders.css`.

  Never invent missing context.

## Purrlight rules on top of Impeccable

- **Work in a preview.** Make a scratchpad copy of `website/`, served on 127.0.0.1; setup as in
  `purrlight-taste/SKILL.md`, but in `$P/impeccable/`. "Finish the job" means finishing the preview. Nothing goes
  into `website/` until Elise picks (HOUSE-RULES B1).
- **Files the skill writes stay in `$P/impeccable/`, never in the repo:** PRODUCT.md, DESIGN.md, `.impeccable/`,
  surface briefs, config and plans. The repo root is a public plugin marketplace.
- **No image generation.** For this skill, image generation counts as unavailable, so new-work and init take the
  code-led path. Never call Canva, Figma, Higgsfield or Gamma image tools (HOUSE-RULES B5).
- **Never escalate the sandbox** for any step. Where new-work.md asks for "the least-sandboxed command path", use
  the normal Bash tool on 127.0.0.1.
- **Sub-agents.**
  - critique, typeset and layout spawn isolated sub-agents, and so may the finish reviewer and documenter steps.
  - Every sub-agent brief must include, verbatim:
    - the "This install has no engine" section above. Its detector line means: write "deterministic scan
      unavailable" without trying, even where critique.md asks for "a real attempt";
    - HOUSE-RULES Parts A and B;
    - preview copy only, 127.0.0.1, no image tools and no repo writes;
    - never run `npx`, `npm` or `pnpm` installs, or `npx impeccable` in any form;
    - never escalate the sandbox, never submit the Tally form, no commits, pushes or deploys.
  - The shipped agents (asset-producer, finish-reviewer, documenter) are not installed. Use
    `reference/degraded/finish-reviewer.md` and `degraded/documenter.md` inline, and never create
    `.claude/agents/`.
- **No third-party installs from skill steps.** No `npx`/`npm install` (for example Lighthouse in optimize.md).
  Ignore optimize.md's "Use CDN" (B7). Do not fetch the links in `document.md` or `routing.md` (B8).
- **Part A wins over the craft floor and the documenter:**
  - The cream base and peach stay, even where Impeccable reads cream as a cliché.
  - The signature lines ("From Merlin's notebook" and the rest) stay, even used as a label above a heading.
  - Merlin and the logo stay.
  - Everything else (kickers, emoji, glows, the approved effects) is open to proposals. Say "this changes X that
    Elise approved".
- **Port back carefully.** Rewrite React/TSX/Vue output as ES5 and flat CSS before it goes into `website/`, then
  run the HOUSE-RULES B10 checks.
- **Report to Elise in plain Vietnamese:** what the command changed, with before and after screenshots, what it
  changes from the old Canon, and what is placeholder.
