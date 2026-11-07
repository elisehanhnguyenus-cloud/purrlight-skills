# Haven 3D — v2 contract (supersedes the World / camera numbers of CONTRACT.md; everything else there still applies)

Read `CONTRACT.md` first for the hard rules (logo, Merlin, no words in the scene, no Grace/Linh, banned words, reduced
motion, no network/CDN/npm, file locations, testing). This file changes the **size, layout, mood and rendering style**.

## Owner feedback on v1 (06/11 evening, verbatim, Vietnamese)

"Xem lại bố cục. Căn tiệm to quá rồi. Nó sẽ nhỏ 1 nửa, nhìn ấm cúng chứ không mang nét hiện đại. Nó có 1 chút retro, ngọt
ngào, phía ngoài cửa sổ kiểu cafe Pháp. Tìm trên app three.js phong cách artist kiểu digital water color với các cấu trúc
hình ảnh nhìn mang nét thủ công."

= The shop is too big: make it **half the size**, **cozy, not modern**; **a little retro, sweet**; **outside, a French café
window**. Render it in an **artist's digital-watercolour style with a hand-made, hand-drawn structure**.

v1 for reference (do not edit): `../haven3d-v1/` (16 m house; the props library and the camera/UI shell are reused in v2).
v1 screenshots: `_shots/ext-final-ext-d.png`, `_shots/int-final-shelf-d.png`.

## Mood references the owner sent (look at them with the Read tool)

`/root/.claude/uploads/91861a0f-a62b-5e76-86dc-b5cd4e6b7ac8/`
- `70ec1a51-image.jpg` — a tiny English children's bookshop window at dusk: warm amber light, cluttered with picture books
  on little easels and crates, moss + fairy lights along the sill, a lamp hanging inside. (Window display mood.)
- `49c6c277-image.jpg` — a wooden toy shop: honey wood shelves, baskets, hanging stars/planets, plants on top of shelves.
- `e65b4508-image.jpg` — she CIRCLED two things: a **round stepped (tiered) wooden display** with a fluted base, and a
  **round counter with cubby shelves** under a little tree. Also: pink arched wall shelves, a striped wall.
- `c30a5096-image.jpg` — a white wavy 3-tier display with gifts; rattan chair; plants.
- `ab2401c1-image.jpg` — shopfront collage: ivy-covered green bookshop; "Velvet Envelope" with a **striped awning**; a
  **watercolour illustration of a cosy café** (double doors with a wreath, striped awning, flower box, bistro chair with
  a gingham cushion, wall lantern, chalkboard) — this watercolour IS the target art style; a wooden book-nook kit.
- `6b06affb-image.jpg` — "Bell & Bramble Books": a small English shopfront, one door + one big multi-pane window,
  a wooden bench, a chalkboard, vines. Small, intimate, human scale.
- `b6e59f73-image.jpg` — bookshop café: arched nook with a painted tree, café counter, plants, rug, armchair.
- `b36c0972-image.jpg` — "Masa's corner": arched wall, **round table on a fluted base** with books, **jute scalloped round
  rug**, baskets with soft animals, armchair, lamps, chandelier; arched shelves in a second shop.
- `74b009db-image.jpg` — vintage plush animals on **white distressed wooden shelves**, **felt flower garland**, a pink
  vintage suitcase with a bear, retro picture books, gingham cloth, crochet lace. (Retro + sweet: the shelf mood.)
- `ce83d66f-image.jpg` — soft animals in **baskets with scalloped white liners** next to classic storybooks.
- `e49ae19c-image.jpg` — a **coloured-pencil family portrait** (couple with two poodles) on paper: loose pencil lines,
  soft pastel fill, rosy cheeks, little hearts. (The hand-drawn line quality to echo.)
Use them for mood/shape language only. Do not copy any shop's name, sign, layout or artwork; no words from them.

## Size and layout (metres, Y up, house faces +Z — same conventions as v1)

- **House**: x ∈ [−4.2, 4.2] (8.4 m wide), z ∈ [−7.6, 0]. Ground floor 0–4.0 (interior ceiling 3.8 — a tall shop with a
  fascia band), floor 2 4.0–6.6, roof above (steep French/English cottage roof: mansard or gable with **one or two
  dormers**, a chimney, ridge ≤ 9.5). Warm cream/oat painted walls (or pale stone) + ivory trim; cozy, slightly
  irregular, hand-made feel (nothing perfectly straight-edged, soft bevels).
- **Front wall** outer face z = 0, inner face z = −0.3 (inner face material `P.mat('plaster')`).
- **Shopfront** (English/French, like Bell & Bramble + the watercolour café): painted pilasters and a **fascia band**
  y 2.75–4.0 across the shopfront, with the **sign**: ivory board, rose frame, real logo (`T.signFace()`, unlit,
  own mesh named `signFace`, never merged), **3.4 m wide** (logo ≈ 2.72 m), centred at (0, 3.38, +0.07).
  - **Door** (always open): double doors, opening x ∈ [−0.7, 0.7], y [0, 2.5]; the tunnel z ∈ [−0.5, +0.5] stays empty.
    Leaves swung inward along the inner wall: x ∈ ±[0.72, 1.42], z ≈ [−0.45, −0.3]. A dried-flower or eucalyptus
    **wreath** on one open leaf or a little garland over the door (no words).
  - **Left: display window** x ∈ [−3.75, −1.0], glazing y [0.65, 2.55], a shallow bay/box projecting to z = +0.55,
    multi-pane, lit warm; a cosy cluttered display: picture books on small easels and crates, crochet cats, a little
    doll, dó-paper parcels with twine, a yarn basket, moss and fairy lights along the sill.
  - **Right: French café window** x ∈ [1.0, 3.75], a walk-up counter ledge at y ≈ 1.0 with cups, a pastry dome, a
    teapot, small potted herbs; a **striped scalloped awning** (cream/blush) attached at y 2.7 sloping out to y 2.3 at
    z = +1.1; a wall lantern; a **chalkboard easel with pictograms only** (cup, croissant, heart; no words).
  - In front of the café window: one **French bistro table** (marble top, rattan chairs with **gingham cushions**) at
    about (2.55, 0, 1.75) with the **2 seated customers** holding cups and the **golden dog lying** at their feet; flower
    pots; a **dog water bowl** at about (0.95, 0, 0.42); the **Maine Coon** licking its paw at about (−0.95, 0, 0.45);
    a small wooden **bench** under the display window is welcome if it fits.
- **Floor 2** (seen only through windows): 3 windows with shutters, sills and **flower boxes**. Left: **Merlin's workroom**
  (desk, lamp glow, drawing paper pinned, yarn basket, a yarn ball on the sill). Right: **pet-sitting corner** (dog bed,
  a ball, a bowl, a framed paw-print pictogram). Centre: small window or French door with a tiny balcony and vines.
  Dioramas at z ∈ [−1.0, −0.3], y > 4.1.
- **Must-haves** still: roof, window sills, yarn balls, drawing paper, climbing vines (on the facade and over the door).
- **Garden/street**: a cobbled pavement, a strip of lawn or planting beds, 1–2 rounded trees, a street lamp, potted plants
  by the door, soft neighbouring cottage silhouettes far behind. Not cramped, but intimate: the house fills the view.

### Interior (cozy, retro, sweet — about half the v1 room)
- Room x ∈ [−3.95, 3.95], z ∈ [−7.3, −0.3], floor y 0, ceiling 3.8 (inset a few mm from the shell to avoid z-fighting).
- Floor: warm honey wood (herringbone or planks) + a **jute scalloped round rug** under the centre display.
- Walls: cream plaster / dó-paper wallpaper, **blush wainscoting**; back wall with **arched niches** holding shelves.
- **Left wall**: honey-wood bookcases (picture books, some face-out), a small rolling ladder optional, plants on top.
- **Right side, near the café window**: a **round (quarter/half-round) café counter with cubby shelves** (circled
  reference) with a cake dome, cups, a little espresso machine shape, a pendant lamp; one small bistro table inside.
- **Back-right / back wall**: **white distressed vintage shelves** with crochet animals and a **felt flower garland**
  (retro-sweet); **baskets with scalloped liners** holding crochet animals; a **pink vintage suitcase** with a crochet
  bear; a reading armchair with a lamp in a corner.
- Ceiling: one retro chandelier or a dó-paper lantern, **fairy string lights** in soft swags.
- **Centre display = the camera's destination (the "3-tier shelf")**: a **round 3-tier stepped wooden display** with a
  **fluted base**, centred at (0, 0, −4.6). Tier tops: y 0.78 (radius 0.80), y 1.06 (radius 0.56), y 1.32 (radius 0.32).
  Honey/oat wood with rose-gold edge trim. Contents (ids/names exactly as in CONTRACT.md, same pickable rules):
  - **Top tier**: the **fabric book "Merlin's Purrfect Haven"** on its stand, facing the camera (kind `book`, id
    `open-book`), flanked by the **crochet tuxedo cat** (`tuxedo-cat`) and the **framed real Merlin photo** (kind
    `merlin`).
  - **Middle tier**: the dolls — `george-washington-doll`, `anne-shirley-set`, `bennet-darcy-set`,
    `dashwood-ferrars-set` — arranged around the front arc, plus 1–2 decor cats.
  - **Bottom tier**: crochet animals around the front arc — `maine-coon-cat`, `ginger-tabby-cat`, `calico-crochet-cat`,
    `siamese-cat`, `white-cat`, `british-shorthair-cat`, `knitted-sheep`, `knitted-daisy-duck`,
    `crochet-animal-friends-set` — with a few scalloped mini baskets and small books between them.
  - Beside it at about (1.15, 0, −4.35): a small rose-gold **hook stand** (or a little wooden rack) with the fabric
    dolls on backpacks — `linen-pocket-doll`, `americana-doll-bag-charm` — the `quilted-cat-pouch`, and keychains.
  - Items face outward/forward so they read from the camera. The front arc (facing +Z) holds the important pieces.
- Keep clear: camera corridor x ∈ [−0.6, 0.6], y ∈ [0.2, 2.4], z ∈ [−3.0, −0.3]; a 0.9 m walkway around the display.

### Camera views (main.js owns; numbers are starting points)
- `exterior` desktop: pos (0, 2.2, 11), look (0, 3.0, 0), fit width ≈ 11.5 so the whole house + roof + café table +
  cat + bowl read. Phone portrait: pos (0, 2.1, 9.2), look (0, 3.2, 0), fit width ≈ 6.4 (sign + door + cat + part of
  both windows). Logo on screen ≥ 260 CSS px desktop, ≥ 170 phone (logo = 0.8 × sign width).
- walk: (0,2.2,11) → (0,1.72,4.2) → (0,1.62,0.9) → (0,1.6,−0.7) → (0,1.6,−1.6) → shelfView, with gentle glances to the
  café counter (≈ (2.9,1.3,−2.6)) and the bookcases/vintage shelves (≈ (−2.9,1.4,−3.4)). Total ≈ 6 s (shorter room).
- `shelfView`: pos (0, 1.66, −2.45), look (0, 1.0, −4.6); the whole display incl. the hook stand fits on desktop and on a
  390×844 phone above the bottom sheet.

## Rendering style: digital watercolour + coloured pencil (the big change)

Goal: every frame looks like a **hand-painted watercolour illustration on cold-press paper with loose coloured-pencil
linework** — warm, soft, a little imperfect, like the watercolour café reference and the pencil portrait. Not cel-shaded
plastic, not photoreal, not a blurry filter. Readable shapes, colour blocks, pigment pooling at edges, paper showing
through in highlights, soft warm shadows tinted (lavender/ochre, never grey/black).

Pipeline (`js/watercolor.js`, owned by the style agent; main.js calls it instead of `renderer.render`):
1. **Scene pass** to a half-float render target with a depth texture (MSAA off; the paint filter is the antialiasing).
2. **Painterly smoothing**: a generalized (Papari-style, 8 sectors, polynomial weights) Kuwahara filter on the scene colour
   at **half resolution** on phones/low quality, full or half on desktop; radius ≈ 3–5 px at the working resolution.
   (Implement from the published maths — Kuwahara 1976; Papari, Petkov & Campisi 2007; Kyprianidis et al. 2010 — in your
   own code; do not paste code from blogs.)
3. **Watercolour composite** (full resolution): edge darkening (pigment pooling where the wash changes, e.g. difference
   between the painted colour and a blurred copy), pigment granulation and **paper texture** (procedural cold-press grain,
   tileable, generated once on a canvas or in-shader noise; stronger in darker washes), slight **colour bleed / hand
   tremor** (low-frequency noise UV wobble of a few px), wet-edge blooms subtly, warm colour grading (lift shadows warm,
   gentle desaturation, cream paper white in highlights).
4. **Coloured-pencil linework**: edges from depth (and colour/luma) Sobel, drawn as soft broken pencil strokes in a
   darker warm tint of the local colour (sepia/cocoa/rose — never pure black), slightly offset/wobbly, thinner with
   distance; optional very light hatching in the darkest shadow areas. Lines "boil" (noise offset changes) at ~4 steps
   per second for a hand-animated feel; **no boil under reduced motion**.
5. **Paper border**: a soft irregular vignette into unpainted paper at the frame edges (deckled watercolour edge), kept
   subtle and never over the UI-critical centre.
6. **Pristine layer (rule-critical)**: the **logo sign face** and the **real Merlin photo** must NOT be painted, blurred,
   outlined, recoloured or paper-textured. Put those meshes on `THREE.Layers` channel 1; the scene pass excludes layer 1;
   after the composite, render layer 1 on top with a depth test against the scene depth texture (a fragment discards if
   the scene depth is nearer), MeshBasic/unlit, toneMapped false, sRGB correct. Builders: set
   `mesh.layers.set(1)` on the `signFace` mesh and the photo plane (and nothing else). Optionally the embroidered book
   cover too, if it loses legibility.
7. Quality tiers: `high` (desktop: Kuwahara radius 4 at half or full res, all effects), `low` (phones / slow: half-res
   Kuwahara radius 3, cheaper composite, no hatching). Keep 60 fps on an iPhone 12-class phone: the post chain must cost
   ≤ ~4 ms there. Reduced motion: no boil, no wobble animation (static noise is fine).
8. Debug: `?paint=0` turns the post chain off (plain render) for comparison; `?paint=raw|kuwa|lines|paper` shows stages.

Material guidance for builders (so the watercolour reads well): prefer **big clear shapes and colour blocks**, matte
materials, simple vertex colours or soft canvas washes over fine high-frequency textures (the filter erases tiny detail
and turns noise into mush); give important objects **value contrast** against their background; keep shadows soft and
coloured; avoid shiny metals (rose-gold = soft matte peach-pink metal); a few deliberate small details (cups, books,
flowers) at sizes ≥ ~8 px on screen.

## Budgets (v2)
- ≤ 160 draw calls and ≤ 250k triangles per frame in any view (incl. shadow pass), ≤ 4 dynamic lights; shadows only from
  the sun, only on `high` (the painterly look tolerates soft fake contact shadows instead).
- Post chain: ≤ 3 full-screen passes at full res + ≤ 2 at half res.

## Orchestrator's style probe (shown to the owner in the Three.js viewer app, 06/11)
A compact working version of the look (generalized 8-sector Kuwahara at half res + watercolour composite + depth/luma
pencil lines + deckled border) is in `/tmp/claude-0/-home-user-purrlight-skills/91861a0f-a62b-5e76-86dc-b5cd4e6b7ac8/scratchpad/probe/probe.js` with screenshots `/tmp/claude-0/-home-user-purrlight-skills/91861a0f-a62b-5e76-86dc-b5cd4e6b7ac8/scratchpad/probe/probe-d.png` and
`probe-m.png`. It is a reference and a floor, not a ceiling: the real pipeline should look at least this good, keep the
pristine layer, and be tuned on the real scene.

## OWNER REQUEST 07/11 — potted plants outside the shop (REQUIRED; part of the must-have list)

Verbatim: "Ok đặt vài chậu cây xô, rosemary, thymes, hoa cúc tana, sơn trà, trà mi, cẩm tú cầu, monstera và peony ngoài
shop. Có thể sắp xếp tùy vào khung cảnh, trên ban công, patio, hiên nhà..."
= Put a few pots of **sage, rosemary, thyme, tanacetum (feverfew daisies), sơn trà (Camellia sasanqua: glossy dark leaves,
single pink flowers), trà mi (Camellia japonica: double flowers, white/blush, one soft red at most), hydrangea, monstera
and peony** outside the shop, arranged to suit the scene: on the **balcony**, the **patio** (café terrace) and the
**porch** (by the door). Every one of the 9 must be present and recognisable from its silhouette + colour.

Look per plant (stylized, watercolour-friendly, big readable shapes; pots terracotta / cream / blush glazed / aged zinc;
vary pot sizes; group in odd numbers like a real café terrace; nothing in the door tunnel, nothing covering the sign,
the cat, the bowl or the customers):
- **Sage**: soft mound of grey-green oval leaves (#9DAE96), a few lilac flower spikes.
- **Rosemary**: upright needle sprigs, deep green (#5F7F63), tiny pale-blue flowers.
- **Thyme**: low tiny-leaf mound spilling over the pot rim / window box, lilac-pink flecks.
- **Tanacetum**: bushy, covered in small white daisies with yellow centres (button-like).
- **Sơn trà (sasanqua)**: dark glossy shrub or a lollipop standard in a tub, single pink flowers.
- **Trà mi (japonica)**: rounder shrub with double rose-like flowers, white/blush (+ at most one soft red).
- **Hydrangea**: big round mophead blooms (blush pink and soft blue-lavender), large pot.
- **Monstera**: large split heart leaves on stems, cream or blush pot (a shaded porch corner or just inside the open door
  where it is still visible from the street, not in the tunnel).
- **Peony**: lush cupped double blooms (blush/pink), bushy, in a big pot near the bistro table.
Suggested placement (adapt to the actual layout): balcony rail → rosemary + thyme (trailing) + one tanacetum; floor-2
window boxes → thyme/sage/tanacetum; porch either side of the door → hydrangea pair (blush + blue) and the two camellias as
small standards/tubs; café ledge → a row of herb pots (sage, rosemary, thyme); patio by the bistro table → peony + a
taller trà mi; monstera in the shaded porch corner by the display window or inside the door. Plant pots read at
≥ 10 px on a 390×844 phone in the first view.
Ownership: the exterior builder adds them; if exterior.js does not have all 9 when the integrator starts, the INTEGRATOR
adds them (helpers in js/exterior-kit.js). Reviewers check all 9 are present and recognisable.
