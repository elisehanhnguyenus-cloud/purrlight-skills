---
name: purrlight-motion
description: >-
  Motion and animation craft for the Purrlight Studio site, from Emil Kowalski's skills: finding where motion would
  help, designing and building animations that feel right, and reviewing existing CSS/JS motion (easing, timing,
  interruption, reduced motion, performance). Use it when asked to add, improve, review or brainstorm an animation,
  transition or effect on the site ("hiệu ứng", "chuyển động", "animation", "cho web sinh động hơn").
---

# Purrlight motion

**First read `.claude/skills/HOUSE-RULES.md`.** Elise wants these skills' creativity: apply only its Part A (brand
core) and Part B (safety and process), and otherwise follow Emil's craft. Earlier approved effects are listed
there for reference. They are not locks, but say so when a proposal would change one.

## Which upstream skill to follow

| Task | Read and follow |
|---|---|
| Ideas: where would motion add delight or clarity? | `upstream/find-animation-opportunities/SKILL.upstream.md` |
| Build a specific animation | `upstream/animate/SKILL.upstream.md` + `RECIPES.md` |
| Review one piece of motion | `upstream/review-animations/SKILL.upstream.md` + `STANDARDS.md` |
| Audit all motion on a page or the site, with a plan | `upstream/improve-animations/SKILL.upstream.md` + `AUDIT.md`, `PLAN-TEMPLATE.md` |
| Jank, frame drops, scroll cost | `upstream/animation-performance/SKILL.upstream.md` |
| Name a feeling precisely ("snappy", "settle"…) | `upstream/animation-vocabulary/SKILL.upstream.md` |
| The overall philosophy | `upstream/emil-design-eng/SKILL.upstream.md` |

Skip each skill's "Initial Response" line when it is used from a task. Where a skill says to write files into the
project (`plans/`, fixtures, toggles), put them in the scratchpad instead.

## Purrlight specifics

- **Build and try motion in a preview first** (a scratchpad copy of `website/`). Show Elise a short screen
  recording or before/after screenshots, and change `website/` only after she picks (HOUSE-RULES B1).
- **Snippets are written for React and Motion.** In a preview anything goes. What goes into `website/` is
  rewritten as plain ES5 and flat CSS, with no new runtime library unless it is self-hosted and pinned (B7).
- **Accessibility floor (B6).** Every effect respects `prefers-reduced-motion`, including when it is switched on
  mid-visit. Hover-only effects sit behind `(hover: hover) and (pointer: fine)`. Anything that runs past 5 s has a
  pause control, and nothing hides content when JS is off.
- **Timing tokens.**
  - `--ease` (`220ms ease`) exists only in `custom-orders.css`, and only some of its transitions use it. The rest
    hard-code 200–520 ms.
  - The main site's `style.css` and `desk.css` hard-code 0.15–0.35 s.
  - Change these on purpose, never by accident.
- **No `execute`, no git worktree** (improve-animations): build a chosen plan in the scratchpad preview, with no
  commits. In plans, the "Mechanical" checks are HOUSE-RULES B10 (there is no typecheck, lint or build).
- **Finding the existing motion.** grep the customer CSS and JS for `transition`, `animation`, `@keyframes`,
  `transform`, `requestAnimationFrame`, `IntersectionObserver` and `prefers-reduced-motion`.
- **Feel checks** (slow motion, a real phone, fresh eyes the next day) are suggestions to Elise. Never expose a dev
  server beyond 127.0.0.1.
- **Report to Elise in plain Vietnamese:** what moves, where, how long, why it helps, and what it changes from
  before.
