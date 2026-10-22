---
name: purrlight-web-guidelines
description: >-
  Accessibility and interface-craft audit of Purrlight Studio's customer pages, based on a pinned copy of Vercel's
  Web Interface Guidelines. It covers focus states, labels, forms, motion, images and layout shift, touch targets,
  typography details, performance and copy craft. Use it when asked to review the UI, check accessibility, audit
  the site or check it against best practices. It reports file:line findings with suggested fixes.
---

# Purrlight web guidelines

**First read `.claude/skills/HOUSE-RULES.md`.** Apply only its Part A (brand core) and Part B (safety and process);
otherwise apply the guidelines as written. The rules are in `upstream/web-interface-guidelines.md`, a pinned,
byte-identical copy of Vercel's guidelines (MIT, see `upstream/VENDORED.md`). Ignore its lines 1–10 (frontmatter
and `$ARGUMENTS`). Take the files to review from the request; if none were named, review the customer pages
(HOUSE-RULES B9).

**Never fetch the guidelines.** The original skill (`upstream/SKILL.upstream.md`) downloads the latest rules on every
run. Here that step is removed on purpose (HOUSE-RULES B8): do not WebFetch or WebSearch for a newer version.

## How to review

1. Read the target files, plus the CSS and JS they load where needed.
2. Check them against every rule. Output findings grouped by file in the `file:line - issue` format the rules file
   shows, with a suggested fix where it is not obvious.
3. Give Elise a short Vietnamese summary on top: what matters most, and what you would fix first. Make the fixes
   she picks, then run the checks in HOUSE-RULES B10.

## Purrlight notes on specific rules

- **Content & Copy (lines 142–150) and text typography (47, 64–67).** Suggest freely, with each change written
  out. New words go live after Elise approves them (B4). Two rules fit the brand voice poorly; mention them as
  options only:
  - Title Case headings (the site uses sentence case);
  - "avoid first person" ("we / us" is Elise's voice).
- **Dates and prices (126–127, 164).** Never re-render prices, order-by dates or `<time>` values through `Intl`
  or `Date` (B3). A date-only ISO string read as UTC shows the day before in Texas.
- **`translate="no"` and `&nbsp;`.** Add them as an attribute or entity on the existing element, never as a new
  wrapper `<span>` around payment handles, because `check-site.js` reads those with a regex.
- **Forms (39, 48).** The booth console is out of scope (B9). Never put `autocomplete="off"` on fields customers
  fill in themselves (WCAG 1.3.5).
- **Not for this stack.** Translate the React/Next/Tailwind rules to plain HTML and CSS:
  - `<Link>` → `<a>`;
  - `htmlFor` → `for`;
  - `autoFocus` → `autofocus`;
  - Tailwind classes → CSS;
  - `next/image priority` → `fetchpriority="high"`.

  Skip Hydration Safety (131–135), useState/nuqs (97–99), virtua (86), `.map()` (161), Accept-Language (128) and
  controlled inputs (89).
