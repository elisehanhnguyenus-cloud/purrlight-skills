---
name: purrlight-motion
description: >-
  Motion and animation craft for the Purrlight Studio site: reviewing existing CSS/JS animations (easing, timing,
  reduced motion, hover gating, performance) and building a motion change Elise has approved. Use it when asked to
  review, fix or add an animation, transition or effect on the site ("hiệu ứng", "chuyển động", "animation").
  Every new visible effect needs Elise's approval before it is built, and Brand Canon v2 always wins.
---

# Purrlight motion

**Read `.claude/skills/BRAND-LOCKED.md` before anything else**, especially the list of approved effects and rule 4.
This skill draws on two of Emil Kowalski's skills (MIT, see `upstream/VENDORED.md`): `animate` (how to build an
animation that feels right) and `review-animations` (a strict review bar). They were written for React and
Framer Motion apps. On this site they serve as craft knowledge, translated into vanilla ES5 and flat CSS.

## What is here

| File | Use it for | Do not use |
|---|---|---|
| `upstream/animate/SKILL.upstream.md` | The build sequence §1–7 (should it animate at all, purpose, cheapest tool, properties, easing and duration, interruption, reduced motion and pointer gating) and "Never Ship" | "Initial Response" and "Operating Posture" ("make the call, write the code, no menu"): on this site you propose first. §3's libraries (Motion, Base UI) and its `pick-ui-library` pointer. Springs with bounce |
| `upstream/animate/RECIPES.md` | Accordion, modal, drawer, stagger and scroll reveal as **patterns** | "Button press" scale(0.97); "Masking a crossfade" blur; hold-to-confirm, tab clip indicator and drag to dismiss as new effects; CSS nesting in the toast recipe; the ES2015 snippets as written |
| `upstream/review-animations/SKILL.upstream.md` | The Ten Standards and the escalation triggers, as a checklist | The persona and required "Block/Approve" output: for Elise, write plain Vietnamese. Its preference to delete motion does not apply to approved effects |
| `upstream/review-animations/STANDARDS.md` | Easing, duration, interruptibility, performance, stagger and accessibility reference | "Springs" and "Physicality" bounce; "connect a phone, hit the dev server by IP" (never expose a server; suggest phone checks to Elise instead) |

The other 13 skills in the upstream repo were not installed: Expo, Swift, Sonner, mobile native, UI-library
picking, prototypes, Apple design and the broader design-engineering skill. They target other stacks or push
press-scale, glass layers and system fonts, which clash with the brand.

## Reviewing motion

1. Find the motion: grep the customer CSS and JS for `transition`, `animation`, `@keyframes`, `transform`,
   `requestAnimationFrame`, `IntersectionObserver` and `matchMedia('(prefers-reduced-motion`. Skip the
   out-of-scope files (BRAND-LOCKED rule 10).
2. Check each piece against the Ten Standards and "Never Ship". Pay most attention to these:
   - `transition: all`;
   - hover effects without `(hover: hover) and (pointer: fine)`;
   - motion that keeps running under `prefers-reduced-motion`;
   - animating layout properties (`top`, `width`, `height`, `margin`);
   - motion over 5 s with no pause control (WCAG 2.2.2);
   - jank from work done on scroll;
   - inconsistent easing between similar elements.
3. Label every finding:
   - **hygiene**: invisible, no look change;
   - **approved effect, a11y or craft note, needs Elise**;
   - **known Canon question**;
   - **new idea**: a proposal only.
4. Report in plain Vietnamese, most useful first, with `file:line`. Keep the Before/After table for internal notes
   if you want one.

## Building or changing motion

- **Only when Elise has approved that specific effect**, or for hygiene fixes she asked for. When proposing,
  describe what moves, where, how far and for how long, plus what happens under reduced motion and without JS.
- Use the existing tokens. Never rename or redefine `--ease` (`220ms ease`) in `custom-orders.css`. If a new curve
  is truly needed, add it under a distinct name (for example `--curve-out`) in the existing `:root`.
- Use ease-out or ease-in-out cubic-bezier curves only, with no overshoot. The 300 ms limit applies to UI controls
  (buttons, menus, dialogs), not to the approved decorative or seasonal motion.
- Leave the approved values alone:
  - the reveal of 520 ms with `cubic-bezier(0.2,0.7,0.2,1)` and a 70 ms stagger;
  - the 1.4 s bell swing;
  - the twinkle that plays twice;
  - all motion off under reduced motion on Custom Orders.

  Propose any change to them; never "correct" them yourself.
- Write vanilla ES5 and flat CSS. Gate hover with `(hover: hover) and (pointer: fine)` and handle
  `prefers-reduced-motion` (including when it is switched on mid-visit). Nothing may hide content when JS is off.
  Use WAAPI or `@starting-style` only behind a feature check, so the content still shows without them.
- Then run the site's Playwright tests and `website/tools/check-site.js`, grep the changed files as BRAND-LOCKED
  rule 11 says, show Elise screenshots or a short recording, and commit or deploy only when she says so.
