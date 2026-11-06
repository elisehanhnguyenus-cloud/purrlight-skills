# Merlin's Purrfect Haven — brainstorm board and greybox (preview, 06/11/2026) — not in website/

Elise combined the three 01/11 directions: a house-shop exterior, "Step inside", a 3-tier shelf, then "Open the book"
or "Stroll the shop". Analysis, council letters and decisions (Vietnamese): `docs/HAVEN-BRAINSTORM-2026-11-06.md`.

| File | What |
|---|---|
| `index.html` | Brainstorm board: storyboard, logo-on-sign test with the real logo, palette, cursor kitten demo, council letters (`letters.js`), decisions. |
| `demo.html` | Greybox / technique test. A real watercolor stands in for the painter's shop-house; it is drawn as the book's opening plate, cropped wide on desktop and tall on phones. The real logo sits on an HTML cream sign. "Step inside" scales the plate into the door (1.35 s, transform only), a warm light bloom covers it, and a real photo appears. Optional shop bell made with WebAudio, only after "Sound on". A tap fast-forwards; reduced motion gives a 0.2 s crossfade. |
| `cat-cursor.js` | Desktop: a pointer with a small ginger kitten over links and buttons (native CSS cursor, no lag). Click or tap: a kitten hops from the spot (600 ms). It fires on click, not pointerdown, and in the capture phase. On links that leave the page it waits 300 ms (preview only; on the site the kitten should ride the page transition). Off with reduced motion. Never a tuxedo cat. |
| `letters.js` | The five council letters, set with textContent. |

## Paths and assets

Paths assume the artifact layout `haven/` next to `site/` (the preview copy of `website/`). `demo.html` also uses
`haven/assets/merlin-table-560.webp`, a crop of the new real Merlin photo Elise sent on 06/11. It lives only in the
private preview artifact, not in this public repo.

## Before any of this goes to website/

Wait for Elise's decisions (doc section 5) and the real assets: the painter's layered exterior with a blank sign, the
real shelf photo, and the vector logo. Build it as sections of `index.html`, not as a gate. The house rules checks
apply: ES5, 360/390/1280 with and without reduced motion, check-site, iPhone test on the plain URL.
