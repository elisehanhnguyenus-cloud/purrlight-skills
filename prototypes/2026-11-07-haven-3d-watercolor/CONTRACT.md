# Haven 3D — shared build contract (preview only, 06/11/2026)

Root folder (absolute): `/tmp/claude-0/-home-user-purrlight-skills/91861a0f-a62b-5e76-86dc-b5cd4e6b7ac8/scratchpad/publish-1106/haven3d/`
Served at: `http://127.0.0.1:8773/haven3d/index.html` (python http.server rooted at `publish-1106/`; `../site/` is a full copy of
the shop website, `../haven/` the earlier 2D greybox). If the server is down:
`cd /tmp/claude-0/-home-user-purrlight-skills/91861a0f-a62b-5e76-86dc-b5cd4e6b7ac8/scratchpad/publish-1106 && nohup python3 -m http.server 8773 --bind 127.0.0.1 > /dev/null 2>&1 &`

## What this is

Elise (owner of Purrlight Studio — handmade crochet cats, crochet/fabric storybook dolls, gifts; mascot = her real tuxedo cat
Merlin) asked today: "for now, put the idea up drawn with code and Three.js". The idea (her 06/11 brief):

- A visitor arrives from a link and sees a **wide house-shop**: English / French / American **Colonial**, roomy (not a narrow
  townhouse). Indochine only as small accents (window shapes, dó-paper wrapped parcels).
- A **lit glass shop window** showing Merlin books, gifts, crochet cats, signature dolls; a **Purrlight sign** above.
- **Ground floor**: book & gift shop + an **outdoor café counter with potted plants** and a **French tea seating** spot.
- **Floor 2**: a **pet-sitting corner** and **Merlin's bedroom / workroom** (the order workshop) — seen only through windows.
- Must-haves for the "cat's workshop" mood: **roof, window sills, yarn balls, drawing paper, climbing vines**.
- The **shop door is always open**; a **dog water bowl** outside; **2 customers sitting with coffee**, a **dog lying at their
  feet**; a pretty **Maine Coon licking its paw** in front of the door.
- **"Step inside"** → the camera walks in through the door into a **lobby: book café + gift shop**, the feeling of entering a
  Barnes & Noble (wide, airy, café area separate from gifts & books; no revolving door).
- The camera ends at a **3-tier shelf**: crochet animals, crochet dolls, fabric dolls hanging on little backpacks, keychains,
  books; the **centerpiece** is a Purrlight book **wrapped in fabric embroidered "Merlin's Purrfect Haven"** with a cat and a
  yarn ball, next to a group of crochet cats incl. the **crochet tuxedo cat**, and **the real Merlin** (his real photo, framed).
- Buttons **"Open the book"** and **"Stroll the shop"**. A small cat rides the pointer on button clicks.
- Colours for props (book, doors, windows): **beige / rose-gold**, minimal Indochine. Mood: lifestyle, sweet, childlike,
  one-of-a-kind, adorable — "both Jellycat and Mushie" (soft, rounded, matte, muted pastel, calm, premium). Western-leaning
  (international customers). **PURRLIGHT logo must stay prominent and never blend in.**

Elise said the previous code-drawn previews looked "fake and not smooth". So: aim for a polished **stylized miniature /
storybook diorama** look (think soft clay or felt toy town at golden hour): rounded bevels on everything, matte materials,
gentle warm light, soft shadows, fog/atmosphere, rich small details, cohesive palette. Smoothness: steady 60 fps on a
mid phone, eased camera, no popping, no jank. Avoid the "untextured grey boxes" look and avoid hyper-detail noise.

## Hard rules (all agents)

1. Write only inside `haven3d/`. Read anything. Never edit `../site/`, `../haven/`, or the git repo.
2. No network, no CDN, no npm installs. Three.js r180 is vendored. From `js/*.js` import exactly:
   `import * as THREE from '../vendor/three.module.min.js';`
   `import { RoundedBoxGeometry } from '../vendor/RoundedBoxGeometry.js';`
   `import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';`
   `import { RoomEnvironment } from '../vendor/RoomEnvironment.js';`
   (Same URL everywhere so there is one THREE instance.) Modern JS / ES modules are fine in this preview.
3. **No AI images, no external or stock images.** Image files allowed: `../site/assets/brand/logo-flat.png` (real logo),
   `./assets/merlin-table-560.webp` (the real Merlin photo, 560×700), `../site/assets/img/products/<id>-600.webp` (real
   product photos, only in HTML cards/tooltips). Everything else is procedural: geometry + canvas-drawn textures.
4. **Logo**: `logo-flat.png` is 360×119, transparent background, pink lettering (~#C84678), letter counters transparent.
   Draw it only on the **ivory #FFFBF4 sign face** inside a rose (#C9937E) frame; keep aspect 360:119; never recolour, crop,
   stretch, outline, shadow, tint, or place it on any coloured/dark/textured background. The sign must read clearly in the
   first exterior view on desktop and on a 390×844 phone (on-screen logo width ≥ 170 CSS px on phone, ≥ 260 on desktop).
   Use `MeshBasicMaterial` (unlit, toneMapped:false) for the sign face so lighting/tone-mapping never shifts its colours.
5. **Merlin**: never draw Merlin as a character. The only black-and-white (tuxedo) cat in the whole scene is the
   **crochet tuxedo cat product** on the shelf (clearly a crochet toy: knit texture, stubby, button eyes) and **the real
   photo** in a frame. No other tuxedo cats. The Maine Coon at the door is a **brown tabby** with ear tufts and ruff. The
   customers' dog is a soft golden/cream dog.
6. **No words in the 3D scene** except the real logo on the sign and the embroidered title **"Merlin's Purrfect Haven"** on
   the fabric book. No menus, prices, "open" signs, staff names, "pet sitting" signage, fake book titles. Pictograms OK.
7. **Never use the names Grace or Linh** anywhere (they are private AI staff; decided 20/10).
8. HTML copy: only these English strings (plus Vietnamese preview/dev labels for Elise):
   "Merlin's Purrfect Haven · a storybook by Purrlight Studio", "Sketched by Merlin, stitched by us.", "Step inside",
   "Skip to the shop", "Sound on", "Sound off", "Everything here is made by hand.", "Open the book", "Stroll the shop",
   "On this shelf", "Tap a piece to meet it.", "View", "the real Merlin", product names exactly as listed below.
   Banned anywhere: magical, magic, blessed, spell, manifest, wizard, toy, plush, nursery, safe, AI, three.js (in English copy).
9. `prefers-reduced-motion: reduce` → no camera flight (0.25 s cream crossfade cut), no idle drift, animals hold still.
10. Performance budget (mid phone): ≤ 220 draw calls in any view, ≤ 350k triangles total, textures ≤ 1024² (sign 1024×340,
    book cover 1024²), ≤ 5 dynamic lights total (main owns hemi + sun; interior may add ≤ 2 PointLights, exterior ≤ 1),
    shadows only from the sun, only on `quality==='high'`. Use shared materials, `InstancedMesh` for repeats (books,
    leaves, cobbles, flowers), `mergeGeometries` for static clusters sharing a material. Sphere/cylinder segments ≤ 20.
    Fake contact shadows with soft radial-gradient planes under objects (always on, cheap).

## World

- Units = metres, Y up, ground at y = 0 (outside and inside are level; no steps). The house faces **+Z**; the camera starts
  in front at +Z looking toward −Z.
- **House footprint** x ∈ [−8, 8], z ∈ [−14, 0]. Ground floor height 4.4 (interior ceiling 4.2), floor 2 from 4.4 to 7.6,
  roof above 7.6 (French mansard or hipped roof with dormers, ridge ≤ 11.5).
- **Front wall**: outer face z = 0, inner face z = −0.35 (thickness 0.35). Owned by EXTERIOR. Its inner (−Z) face must use the
  interior plaster material `P.mat('plaster')` (BoxGeometry face index 5 = −Z face; use a material array).
- **Door opening** x ∈ [−0.9, 0.9], y ∈ [0, 2.8]; this tunnel z ∈ [−0.6, +0.6] must be completely empty. Double doors stand
  open **inward**, hinged at x = ±0.9 on the inner face, swung ~100° so they lie along the inner front wall toward ±x
  (they occupy x ∈ [−1.9, −0.9] ∪ [0.9, 1.9], z ∈ [−0.55, −0.35]). Owned by EXTERIOR.
- **Left of door: shop display window** — an English **bay shopfront** projecting outward x ∈ [−6.6, −1.6], z ∈ [0, +0.9],
  glazing y ∈ [0.75, 3.1], lit warm from inside, filled with books, crochet cats, dolls, dó-paper parcels (EXTERIOR). The
  wall opening behind it (x ∈ [−6.4, −1.8], y ∈ [0.75, 3.1]) is open, so the real lobby is visible behind the display.
- **Right of door: café** — a walk-up **café window counter** x ∈ [1.8, 6.4] with a ledge at y ≈ 1.05, a scalloped awning,
  potted plants; in front (x ≈ 3.5–5.5, z ≈ +1.8–3.5) a **French bistro table** with 2 seated customers holding cups and a
  dog lying under the table; a **dog water bowl** near the door at about (1.25, 0, 0.45). The café window opening shows the
  lobby café behind it. (EXTERIOR)
- **Maine Coon** sits on the threshold just left of the door at about (−1.25, 0, 0.55), facing +Z/slightly right, licking a
  raised front paw in a loop. (EXTERIOR, using `P.maineCoon()`)
- **Sign**: ivory board with rose frame, centred above the door at about y = 3.55, z = +0.06, width ≈ 3.3, height ≈ 1.1
  (face texture from `T.signFace()`), plus optional small rose-gold brackets/lamps lighting it.
- **Floor 2** windows (EXTERIOR): 5 multi-pane sash windows with shutters & sills at y ≈ 5.0–6.9. Behind the left two: a
  shallow lit diorama of **Merlin's workroom** (desk, lamp glow, drawing paper pinned to a board, yarn basket, a yarn ball on
  the sill). Behind the right two: a **pet-sitting corner** (dog bed, a little ball, food bowl, a framed paw print
  pictogram) — scenery only. Centre: an arched door/window with a tiny balcony and vines. Dioramas live at z ∈ [−1.2, −0.35],
  y > 4.45.
- **Interior lobby** (INTERIOR): room x ∈ [−7.65, 7.65], z ∈ [−13.5, −0.35], floor y = 0, ceiling y = 4.2 (do NOT build the
  front wall; build floor, ceiling, side walls x = ±7.65, back wall z = −13.5). Café zone on the **right** (x > 1.5, near the
  café window), gifts + books on the **left**, tall bookcases along the side and back walls (B&N feel), pendant lamps,
  plants, rugs, a reading nook. Keep clear: the camera corridor x ∈ [−0.85, 0.85], y ∈ [0.2, 2.5], z ∈ [−7.6, −0.35] and the
  door-leaf zone. Keep a 1.2 m clear walkway around the shelf.
- **Centre shelf** (INTERIOR): freestanding 3-tier shelf unit centred at x = 0, front face at z = −9.6, width 3.4, height 2.1,
  depth 0.5, faces +Z. Board tops at y = 0.45, 1.05, 1.65; top cap 2.1. Materials: oat/beige wood, rose-gold edging.
- **Camera views** (main.js owns cameras; interior returns the exact numbers in `anchors` if it moves things):
  - `exterior`: pos (0, 2.5, 15.5), look (0, 3.0, 0) — fit width ≈ 18 (desktop). Phone portrait: pos (0, 2.4, 13.5),
    look (0, 3.2, 0), fit width ≈ 8.5 so the sign, door, cat and part of both sides show.
  - walk path: (0,2.5,15.5) → (0,1.75,6) → (0,1.62,1.4) → (0,1.6,−1.2) → (0,1.55,−4.6) → shelfView.
    Glances on the way: look toward the café (≈ (5,1.6,−5)) then the gifts (≈ (−5,1.4,−5)) then settle on the shelf.
  - `shelfView`: pos (0, 1.42, −7.3), look (0, 1.12, −9.65), fit width ≈ 3.9 (shelf fully visible on desktop and phone).

## Palette (hex) — use via `P.mat(name)`

cream #FBF6EE · ivory #FFFBF4 · oat #E9DCCB · do (dó paper) #F1E6D2 · blush #EFC5B9 · roseGold #C9937E (metal only: handles,
hinges, lamp fittings, frames, shelf edging, window hardware) · sage #A9BCA0 (plants, vines; add darker #7F9A7A and lighter
#C5D3B8 for variation) · ink #4A423B · cocoa #5A4636 (sparingly) · berry #B42249 (one tiny accent at most, e.g. a ribbon) ·
peach #E8A87C (warm light colour "purr light"). Walls of the house: warm cream/oat painted clapboard + pale stone quoins and
plinth; roof warm taupe-rose slate (#9C8A80 / #B49B90); door and shutters blush or oat with rose-gold hardware; window frames
ivory. Sky: golden hour — peach/apricot near the horizon to soft lavender-blue above. Fog: warm, subtle.

## Module APIs

All modules are ES modules in `js/`. Each builder function is synchronous and returns quickly; anything image/font-dependent
updates itself when `T.ready` resolves.

### `js/textures.js` (library agent)
```js
export function makeTextures(THREE, renderer) // → T
T.ready            // Promise: logo, Merlin photo and fonts loaded; dependent canvases redrawn (needsUpdate)
T.knit(hex)        // tileable crochet/knit stitch colour map (cached per hex); T.knitBump() greyscale bump to pair with it
T.linen(hex)       // fabric weave
T.doPaper()        // fibrous cream dó paper
T.clapboard()      // horizontal painted siding, tileable (repeat set by caller)
T.stone()          // pale dressed stone blocks (quoins, plinth)
T.slate()          // roof shingles (scalloped or rectangular), warm taupe-rose
T.wood(hex)        // planks / grain
T.floorTiles()     // French cream/oat tiles (cabochon or checker) for the lobby floor
T.cobbles()        // ground path stones
T.grass()          // soft lawn
T.awning()         // cream/blush stripes
T.wallpaper()      // interior wall: dó-paper cream with a very faint minimal lattice
T.bookSpines()     // { map, cols, rows } atlas of ≥ 24 spine designs (colour bands, dots, gilt lines; NO text)
T.signFace()       // 1024×340 canvas texture: ivory board, rose double frame, real logo centred (≥ 78% of width)
T.embroideredCover() // 1024² linen cover with stitched "Merlin's Purrfect Haven", a stitched cat and yarn ball
T.merlinPhoto()    // texture from ./assets/merlin-table-560.webp (sRGB)
T.glow()           // radial warm gradient (alpha) for window glow / lamp halos (use additive sprites/planes)
T.softShadow()     // radial dark gradient (alpha) for fake contact shadows
T.sky()            // vertical golden-hour gradient for scene.background
T.paper()          // drawing paper with a few pencil doodles (no words)
```
Colour maps: `colorSpace = THREE.SRGBColorSpace`; data/bump maps stay linear. Anisotropy up to 8. Tileables RepeatWrapping.

### `js/props.js` (library agent)
```js
export function makeProps(THREE, T) // → P
P.mat(name)                 // shared cached materials: cream, ivory, oat, do, blush, roseGold (metalness .6 rough .35),
                            // sage, sageDark, sageLight, ink, cocoa, berry, peach, plaster, glass (transparent warm),
                            // glowWarm (emissive peach, for lit panes), etc.
P.rbox(w,h,d,r,mat)         // rounded box mesh helper (RoundedBoxGeometry, few segments)
P.softShadow(w, d, opacity) // flat fake contact-shadow mesh at y = 0.002
P.crochetCat(opts)          // {body, belly, ears, eyes:'button', size:.18, pose:'sit'|'loaf', tuxedo:false} → Group
P.crochetAnimal(kind, opts) // kind: 'bunny'|'bear'|'duck'|'sheep'|'giraffe'|'horse' (cute, rounded, knit texture)
P.crochetDoll(opts)         // {skin, hair, hairStyle:'braids'|'bun'|'short'|'colonial', dress, hat:null|'bonnet'|'tricorn', size}
P.fabricDoll(opts)          // flatter linen doll
P.backpack(opts)            // little backpack with a fabric doll hanging from its loop
P.keychain(opts)            // ring + tiny charm (pom-pom / mini cat / heart), hangs downward from origin
P.book(opts)                // {w,h,d,cover,spineIndex}
P.bookRow(count, length, opts) // InstancedMesh row of standing books using T.bookSpines()
P.fabricBook()              // the hero: fabric-wrapped book on a small rose-gold stand (cover = T.embroideredCover())
P.photoFrame(tex, w, h)     // rose-gold frame with a mat; tex shown unlit-ish (MeshBasicMaterial, toneMapped:false)
P.yarnBall(opts)            // {hex, r} wound look + optional trailing strand
P.basket(opts)              // woven basket (optionally filled with yarn balls)
P.plant(kind, h)            // 'topiary'|'fern'|'hydrangea'|'olive'|'ivyPot'|'lavender' in a terracotta/cream pot
P.vine(points, density)     // InstancedMesh leaves along a CatmullRom through points (Vector3[]), sage variations
P.bistroTable(), P.bistroChair(), P.cup(opts), P.teapot(), P.pastryDome()
P.person(opts)              // {coat, scarf, hair, skin, pose:'sit', holdCup:true} rounded, faceless, gentle → {group, update(t)}
P.dog(opts)                 // {coat:'golden', pose:'lie'} → {group, update(t)} breathing + slow tail
P.maineCoon()               // brown tabby, ear tufts, ruff, big tail; sitting; licks raised front paw loop ≈ 3.5 s
                            // → {group, update(t)}; update(t) must be a pure function of time t (seconds)
P.dogBowl()
P.pendantLamp(opts)         // cord + shade (blush/ivory linen or dó paper lantern), emissive warm bulb, no light
P.wallLamp(), P.streetLamp()// rose-gold fittings, emissive glass
P.parcel(opts)              // dó-paper wrapped gift with twine bow
P.easel(), P.paperSheet()   // drawing paper pinned/standing (T.paper())
P.setShadows(obj, cast, receive)
```
Every prop: origin at its bottom centre (keychain: at the ring top), faces +Z, real-world size in metres, cute proportions
(big heads, stubby limbs, soft bevels), matte, shares materials, ≤ ~3k triangles each (people/dog/cat ≤ 6k).

### `js/exterior.js` (exterior agent)
```js
export function buildExterior(THREE, ctx) // ctx = { T, P, quality, reduceMotion, renderer }
  → { group, update(t, dt), anchors: { signCenter: Vector3, door: Vector3 }, lights: [] }
```
Builds everything outside + the house shell + floor-2 dioramas + display bay + café counter + door leaves + garden
(lawn, cobbled path to the door, low hedges, 2–3 rounded trees, flower beds, a street lamp or two, distant soft tree line /
rooftops silhouettes far behind, so the house doesn't float). Vines climbing the facade corners and over the door.
Window boxes with flowers under the floor-2 windows. Chimneys. The roof must be clearly visible in the first view.

### `js/interior.js` (interior agent)
```js
export function buildInterior(THREE, ctx)
  → { group, update(t, dt), anchors: { shelfView: {pos, look}, cafeLook: Vector3, giftLook: Vector3 },
      pickables: Object3D[], lights: [] }
```
Every clickable item on the centre shelf is a Group with `userData.pick = { id, name, kind }` where kind is `'product'`,
`'book'` (the fabric book; id `'open-book'`) or `'merlin'` (the photo; id `'merlin'`, name `'the real Merlin'`). Put them in
`pickables`. Shelf content (ids/names exactly; these are real products in the shop):
- **Top tier — crochet animals**: maine-coon-cat "Maine Coon Crochet Cat", ginger-tabby-cat "Ginger Tabby Crochet Cat",
  calico-crochet-cat "Calico Crochet Cat", siamese-cat "Siamese Crochet Cat", white-cat "White Crochet Cat",
  british-shorthair-cat "British Shorthair Crochet Cat — Sherlock-style outfit", knitted-sheep "Fluffy Knitted Sheep",
  knitted-daisy-duck "Knitted Daisy-Pocket Duck", crochet-animal-friends-set "Crochet Animal Friends — Set of Four".
- **Middle tier — centrepiece**: the fabric book (kind 'book') on its stand in the middle, flanked by a little group of
  crochet cats including the crochet tuxedo cat (tuxedo-cat "Tuxedo Crochet Cat — From Your Photo") and the framed real
  Merlin photo (kind 'merlin'). Either side: crochet dolls — george-washington-doll "George Washington Crochet Doll",
  anne-shirley-set "Red-Braid Storybook Doll Set", bennet-darcy-set "Elizabeth Bennet & Mr Darcy Crochet Doll Pair",
  dashwood-ferrars-set "Elinor Dashwood & Edward Ferrars Crochet Dolls".
- **Bottom tier — books & fabric**: a row of storybooks (decor, not pickable), fabric dolls on little backpacks —
  linen-pocket-doll "Linen Pocket Doll Bag Charm", americana-doll-bag-charm "Americana Linen Doll Bag Charm", the
  quilted-cat-pouch "Quilted Appliqué Cat Pouch"; keychains hanging from a rose-gold rail along the shelf edge (decor
  around the bag charms).
Doll looks (stylized, don't over-promise likeness): Washington — white colonial wig/queue, navy coat, tricorn; Red-Braid —
red braids, straw hat, pinafore; Bennet & Darcy — a pair, empire-waist dress + dark tailcoat; Dashwood & Ferrars — a pair,
pastel dress + brown coat.

### `js/main.js` + `index.html` + `css/haven3d.css` + `js/cat-cursor.js` (shell agent)
Renderer (antialias, sRGB output, ACES or AgX tone mapping, exposure ≈ 1), pixel ratio min(dpr, 2) desktop / 1.5 phone,
adaptive downgrade if slow; `scene.background = T.sky()`, warm fog; lights (hemisphere + warm sun with one 1024/2048 shadow
map on high quality); optional `RoomEnvironment` PMREM at low intensity for soft fill; camera system with the views and walk
path above (Catmull-Rom for position and for look target, eased, ≈ 6.5–7.5 s total with gentle glances, never jerky; fov
fitted per aspect); state machine `exterior → walking → shelf`; tap/click/Esc during the walk fast-forwards; UI overlay;
pick raycasting + hover label + touch "first tap shows card with View link"; HTML "On this shelf" card row (real product
photos, accessible links) shown at the shelf; loading screen; no-WebGL fallback; reduced motion; sound (bell on Step
inside only after "Sound on", WebAudio); pause when the tab is hidden; resize. Links:
- Open the book → `../site/index.html?concept=book&intro=1`
- Stroll the shop / Skip to the shop → `../site/shop.html?concept=off`
- product → `../site/product.html?id=<id>&concept=off`; merlin → `../site/about.html?concept=off`
Debug/test hooks: `?view=exterior|door|inside|shelf` jumps (no animation); `?stub=1` uses `js/_stub-exterior.js` and
`js/_stub-interior.js` instead of the real builders; `?stats=1` overlay (fps, draw calls, triangles, quality);
`?t=<sec>` freezes the animation clock at t for screenshots; `?q=low|high` forces quality.
`window.__haven = { renderer, scene, camera, state, goTo(viewName), info(), ready: Promise }` (ready resolves after the first
frame with textures ready).

## Testing

Playwright + Chromium are pre-installed: `const { chromium } = require('playwright');`
`chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] })` — WebGL2 works (SwiftShader,
slow: expect 2–10 fps; frame rate in headless is NOT representative, judge draw calls/triangles via `__haven.info()`).
Block `tally.so` with `page.route`. Screenshot at viewports 1280×800 and 390×844 (isMobile, hasTouch), wait for
`__haven.ready`, save PNGs under `haven3d/_shots/` and LOOK at them with the Read tool; iterate on the visuals. Put test
scripts under `/tmp/claude-0/-home-user-purrlight-skills/91861a0f-a62b-5e76-86dc-b5cd4e6b7ac8/scratchpad/haven3d-tools/`.
Collect `console` errors and `pageerror`s — there must be none.
