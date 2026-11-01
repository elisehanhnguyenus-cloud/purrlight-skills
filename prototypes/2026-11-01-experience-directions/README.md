# Three experience directions (preview, 01/11/2026) — not in website/

Elise asked whether the site should grow as a **book** (chapters), an **opening door with a short corridor**, or a
**3-storey house** (Merlin's HQ with a tea & cat corner and a gift shop), in a vintage style with a touch each of
Indochine, American, English and French, and with more 3D / realistic effects. Each direction here has a home-page
welcome and a site-wide layer showing how every other page would feel.

Analysis and recommendation for Elise (Vietnamese): `docs/EXPERIENCE-DIRECTIONS-2026-11-01.md`.
Recommendation: **the book** (both independent judges chose it). Nothing here is approved yet.

## Files

| File | What |
|---|---|
| `concept-boot.js` | Preview-only switch. `?concept=book\|corridor\|house` (kept per tab in sessionStorage, `?concept=off` clears) sets `html[data-concept]` and `document.write`s `css/c-<name>.css` + `js/c-<name>.js` into the `<head>`; adds a small preview chip. Never ship it. |
| `c-book.css` / `c-book.js` | Direction 1, Merlin's book: tea table under a lamp, clothbound notebook opening in CSS 3D, gạch bông endpaper, Merlin's real video as a "living photograph" with handwritten captions, a page turn to "chapter one", dissolve into the hero (~4 s after the tap). Site-wide: page-turn cross-document view transition (reversed on back/forward), running head + roman folio, berry ribbon on the current nav link, paper grain, gold rules, ink-settle reveal, colophon footer. |
| `c-corridor.css` / `c-corridor.js` | Direction 2: jade shopfront door, bell, gạch bông terrace; doors swing in, camera walks a CSS 3D corridor past framed real product photos to Merlin's real portrait (~4.45 s). Site-wide: arched-doorway transition, brass room plaques, arched photo frames, tile bands, wainscot rail. |
| `c-house.css` / `c-house.js` | Direction 3: Indochine shophouse at dusk with real photos in the windows; windows light up, camera flies into the shop (~3.4 s). Site-wide: Art-Deco floor dial (G / 1 / 2), lift-style transitions, per-floor trims. |

All plain ES5 and flat CSS, no images, no libraries, no new fonts, no network requests. Drawings are CSS/SVG; Merlin and
the logo appear only as Elise's real photos/video, unaltered. Each welcome follows `js/intro.js`'s rules (once per tab,
home only, skipped for reduced motion / `?nointro` / `#hash` / bots / frames unless `?intro=1`, Skip + Esc, tap to
fast-forward, inert + focus handling, try/catch → finish).

## How to view locally

1. Copy `website/` to the scratchpad. Add the 31/10 welcome door from `../2026-10-31-welcome-door/`.
2. Copy these files into its `js/` and `css/` folders.
3. In each customer page, add `<script src="js/concept-boot.js"></script>` right after the main stylesheet link
   (`../js/` for `custom-orders/`).
4. Make `js/intro.js` return early when `html` has `data-concept`.
5. Serve the folder on 127.0.0.1 and open `index.html?concept=book&intro=1`.

## If the book is chosen: porting notes (from the audit and the judges)

- **Drop the switch.** Scope the CSS to a plain class instead of `html[data-concept="book"]`. Split the code:
  - the welcome as its own file, loaded only on a first home visit;
  - the site-wide part (page turn, running head, ribbon, colophon) as a few KB in `style.css`/`main.js`;
  - the same site-wide part in `custom-orders.css`, which does not load `style.css`.
- **View-transition opt-in.** Put `<style>@media (prefers-reduced-motion: no-preference){@view-transition{navigation:auto}}</style>`
  at the top of every `<head>`, before `fonts.css`. With the rule only in `style.css`, about 1 in 5 navigations skipped
  the transition (audit 01/11: 36/45 runs, against 45/45 with the inline rule). The preview pages published on 01/11
  already do this.
- **Who sees the welcome.** Judge's proposal:
  - skip it for visitors arriving from search engines and Etsy (referrer/UTM), and when the visit started on another
    page (the audit saw the door appear mid-visit after landing on a product page);
  - remember "seen" for about 30 days in localStorage, inside try/catch.
- **Slow networks.** Build the welcome earlier: the curtain showed for about 1.2 s on throttled slow 4G, because the
  door is only built at DOMContentLoaded, after the body scripts.
- **During motion.** Show the poster instead of the playing video while the cover and page move (iOS flicker risk).
- **Product-to-product.** Use a shorter turn or a cross-fade between product pages.
- **Seasonal content.** The living photograph uses the Christmas greeting. A year-round clip (≤ 10 s) with checked
  captions and a non-holiday Merlin photo are needed for January.
- **Device QA.** Test on a real iPhone (preserve-3d, backface-visibility, muted autoplay) and a mid-range Android. All
  numbers so far are from headless Chromium with software rendering.
- **New words** need Elise's approval first: "Open the book", the cover title "From Merlin's Notebook" vs "Purrlight
  Studio", running heads with roman folios.
- **Checks.** Run `tools/check-site.js`, the 360/390/1280 smoke with and without reduced motion, an ES5 grep and the
  leftovers grep (HOUSE-RULES B10).
