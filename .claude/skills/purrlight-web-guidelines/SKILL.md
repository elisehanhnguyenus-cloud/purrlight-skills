---
name: purrlight-web-guidelines
description: >-
  Review-only accessibility and interface-craft audit of Purrlight Studio's customer pages, based on a pinned copy
  of Vercel's Web Interface Guidelines. It covers focus states, labels, forms, reduced motion, images and layout
  shift, touch targets, typography details and performance. Use it when asked to review the UI, check
  accessibility, audit the site or check it against best practices. It reports file:line findings and never
  rewrites copy. This is a polish pass, not a redesign; Brand Canon v2 always wins.
---

# Purrlight web guidelines

**Read `.claude/skills/BRAND-LOCKED.md` before anything else.** The rules are in
`upstream/web-interface-guidelines.md`, a pinned, byte-identical copy of Vercel's guidelines (MIT, see
`upstream/VENDORED.md`). Ignore its lines 1–10: the frontmatter, `$ARGUMENTS` and "Vercel compliance". Take the
files to review from the request; if none were named, review the customer pages (BRAND-LOCKED rule 10).

**Never fetch the guidelines.** The original skill (`upstream/SKILL.upstream.md`) downloads the latest rules from
GitHub on every run. Here that step is removed on purpose: do not WebFetch or WebSearch for a newer version, from
raw.githubusercontent.com, vercel.com/design/guidelines or anywhere else. Updates happen only when a person re-vets
and diffs a new copy.

## How to review

1. Read the target files, and the CSS and JS they load, if the question needs it.
2. Check them against the rules, with the changes below.
3. Output findings grouped by file, in the terse `file:line - issue` format the rules file shows. Give each finding
   a label:
   - `fix`: invisible or purely technical;
   - `copy, needs Elise`: anything that adds or changes words;
   - `approved effect, needs Elise`;
   - `brand question`.
4. Give Elise a short Vietnamese summary on top: what matters most, what is safe to fix, and what needs her. Edit
   nothing until she says which fixes to make. After an agreed fix, run the Playwright tests and
   `website/tools/check-site.js`.

## Purrlight changes to the rules

**Turned off or report-only**
- **Content & Copy (lines 142–150).** Report only, as `copy, needs Elise`. Two rules are fully off for this site:
  "Title Case for headings" (the site uses sentence case) and "avoid first person" ("we / us" is Elise's voice).
- **Text-changing typography (lines 47, 64–67).** `…`, curly quotes, `&nbsp;`, "Loading…" and placeholders: report
  only for customer-facing strings. Add `translate="no"` or `&nbsp;` only as an attribute or entity on the existing
  element, never as a new wrapper `<span>`, because `check-site.js` reads payment handles with a regex.
- **Accessibility text is copy.** Alt text, `aria-label` values, skip-link text, error, loading and empty-state text
  are drafts. Build them only from approved facts (`js/products.js`, the page copy), never invent product facts
  (materials, sizes, "safe"), check them against the Canon banned words, and label them `copy, needs Elise`.
- **Prices (lines 127 and 164).** Flag only. Never change how prices are formatted or rounded.
- **Behaviour changes are report-only:** URL-state sync (97–99), `beforeunload` (49), confirm and undo (100),
  drag and `inert` (108), autofocus (110).

**Motion**
- "Animate transform/opacity only" (line 54) is no licence for new motion. Approved effects are not findings, but
  their reduced-motion handling is checked.
- Never fix a finding by removing, retiming or swapping an approved effect to opacity without Elise.
- Rule 45 ("spinner during request"): use a disabled or text state, never a new rotating spinner. Any new visible
  words need Elise.

**Forms**
- The booth Event Desk is out of scope. Its `autocomplete="off"` keeps one customer's details from showing up for
  the next one on a shared device.
- Never put `autocomplete="off"` (line 48) on fields customers fill in themselves; that would break WCAG 1.3.5.

**Colours, focus, hover (31, 105, 122, 139–140)**
- Use existing `:root` tokens only. No new hex colours, shadows, gradients or layered borders.

**Performance (90–91)**
- Preconnect or preload only origins the page already uses (for example tally.so). Never add a new third-party
  origin, CDN or web font.

**Not for this stack.** Translate or skip the React/Next/Tailwind rules:
- `<Link>` → `<a>`;
- `htmlFor` → `for`;
- `spellCheck` → `spellcheck`;
- `autoFocus` → `autofocus`;
- Tailwind classes → plain CSS (`:focus-visible` with an outline, `text-wrap: pretty`, `min-width: 0`,
  `overflow-wrap: anywhere`, `-webkit-line-clamp`);
- `next/image priority` → `fetchpriority="high"`;
- `onKeyDown` handlers apply only to custom widgets, not native buttons or links.

Skip entirely:
- Hydration Safety (131–135), useState/nuqs (97–99), virtua (86), `.map()` (161), Accept-Language (128);
- controlled vs uncontrolled inputs (89).

Fixes stay hand-written ES5 with no new dependency.
