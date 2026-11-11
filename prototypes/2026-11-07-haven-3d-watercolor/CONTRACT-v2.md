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

## OWNER REQUESTS 07/11 #2 (REQUIRED — v3 round)

Verbatim: "Chọn mặt tiền màu be vàng hồng nhé. Nhưng bước vào thì camera sẽ lia xung quanh nhưng tốc độ chậm hơn để có thể
nhìn rõ bên trong. ... chỉnh sửa lại trải nghiệm di động các nút bấm, giới thiệu, trang loading dùng video của Purrlight có
chú mèo trong icon của logo đang chơi với cuộn len. Icon con trỏ chính là chú mèo trong logo, chứ không phải tạo thành 1
kiểu mặt mèo. Trên mobile cũng theo cùng concept là Digital Watercolor nhưng chọn hướng theo kiểu cánh cửa đi vào đến thẳng
cái quầy kệ. Sau đó là mở sách ra hoặc xem shop."

1. **Façade = beige / rose-gold.** `palette=be` becomes the DEFAULT (oat-beige joinery, blush accents, rose-gold matte
   hardware). Keep `?palette=sage` as the alternative. The beige version must look rich, not washed out under the paint
   (value contrast between wall, joinery, glazing; the ivory sign still pops).
2. **Desktop: slower look-around after entering.** After passing the door the camera slowly pans around the room so the
   inside can be seen clearly: e.g. a calm pause, a slow pan left across the bookcases / vintage shelves / suitcase, a slow
   pan right across the round café counter, a gentle look up at the lantern and fairy lights, then a glide to the round
   display. Total walk ≈ 12–15 s, eased, no jerks, max turn rate ≈ 20°/s. Always skippable (tap/click/Esc + a visible small
   skip control), keyboard focus lands on "Open the book" at the end; reduced motion = 0.25 s cut.
3. **Mobile (coarse pointer or narrow portrait): "door" direction.** Same watercolour look, but the flow is: first view
   framed on the shopfront door (sign + open doorway + cat + bowl), tap "Step inside" → the camera goes STRAIGHT through
   the doorway to the round display (no glances, ≈ 4–5 s, a warm light bloom as it passes the threshold) → "Open the book"
   or "Stroll the shop" (+ the product cards). Doors stay open (the owner's earlier rule "cửa luôn mở").
4. **Mobile UX redo**: buttons (≥ 48 px, clear hierarchy: one berry primary, one ivory secondary, thumb-reachable),
   the intro card (compact, watercolour-paper styled card with a soft deckled edge, never covering sign/door/cat), the
   shelf bottom sheet (Open the book / Stroll the shop first, then the horizontally scrollable product cards), safe-area
   insets, no overflow at 360 px, landscape handled.
5. **Loading screen**: the CAT FROM THE LOGO playing with a yarn ball. Use ONLY `assets/logo-cat.png` (an exact-pixel cut
   of the real logo's cat, 88×115 px, pink line art on transparent; produced by `haven3d-tools/logo-cat-crop.js`). Never
   redraw, trace, recolour, outline or distort it; animate it only with transforms (translate/rotate/scale of the whole cat,
   or of the tail section cut at the body join along a clean line) — e.g. the cat hops/leans toward a yarn ball that rolls
   in, bats it (a lean + tilt), the ball rolls away trailing a strand, loop ≈ 2.4 s. The yarn ball and strand are drawn in
   code (blush/rose wound strands, matching the brand pink). Cream watercolour-paper background; show it until the scene's
   first painted frame is ready, then fade. Reduced motion: still cat + still yarn. Lightweight (CSS/canvas; no video file
   needed — the owner said "video"; a looping animation counts; note in the report that a real video can replace it).
   Must also work as the no-JS/no-WebGL first paint (no blank screen).
6. **Pointer = the cat from the logo**, not a drawn cat face. On fine pointers, over links/buttons/pickables/the door, the
   cursor shows `logo-cat.png` (scaled, exact pixels; a soft ivory halo behind it for contrast on berry buttons is OK) with a
   tiny pointer tip at the hotspot so clicks stay precise (hotspot at the tip). The click "hop" also uses the logo cat. No
   kitten-face drawing anywhere any more. Reduced motion: no hop.
7. **New English copy** beyond the approved list must be minimal and reported as "pending owner approval" (e.g. a skip
   label). Prefer icons + aria-labels.

Also apply the art-direction review of v2 (all findings): `haven3d-tools/art-review-v2.txt` — glow/amber windows surviving
the paint, a fuller amber display window, shelf framing tighter on the products, product legibility under the paint, bag
charm colours, tuxedo black, phone stair-stepping, etc.

## UPDATE 07/11 — the owner sent the official cat icon
`assets/logo-cat.png` is NOW the owner's own cat icon (sent 07/11, `assets/logo-cat-src-owner.png`, 166×265 on white),
with only the white background removed (colour-to-alpha against the stroke pink #CF4F7D; script
`haven3d-tools/logo-cat-owner-c2a.js`), 171×224 px, transparent. It replaces the earlier cut from the 360 px logo (kept as
`assets/logo-cat-from-logo.png`, do not use). Same rules: exact pixels, transforms only, no recolour/redraw/trace/stretch.
Note: the owner's file is cropped flush at the right edge (right ear tip and right flank touch the border) — do not
"repair" it; if a layout makes that flat edge noticeable, add a little space or turn the cat slightly, never redraw.
Aspect 171:224 (≈0.763) — size by height, never set both width and height to other ratios.

## UPDATE 07/11 — the owner sent her logo animation video → it IS the loading screen
Source: `/root/.claude/uploads/91861a0f-a62b-5e76-86dc-b5cd4e6b7ac8/36ea64ff-logo_animation.mp4` (1280×720, 24 fps, 10 s,
H.264 + AAC, 2.4 MB). It shows the Purrlight logo on light-grey paper: outline letters → glossy pink letters, the cat turns
to the front, plays with the "i" dot like a yarn ball, winks, tail curls. Prepared loader files (cropped to the logo with
its tail, silent, colours untouched): `assets/logo-anim.mp4` (720×300, 124 KB, faststart), `assets/logo-anim.webm`
(VP9, 132 KB), `assets/logo-anim-poster.webp` (first frame), `assets/logo-anim-end.webp` (final frame: full glossy logo
with the front-facing cat). Crop: `crop=960:400:160:172,scale=720:-2` of the source.
Loader design (replaces the code-drawn cat + yarn animation; you may keep that only as a tiny fallback, or drop it):
- `<video muted playsinline autoplay preload="auto">` with webm + mp4 sources and the poster; centred, width ≈ 86vw max 560px
  on phones, ≈ 520px on desktop; the page background around it = the video's paper colour (sample its edge pixels, ≈ rgb
  220,214,221) with the video edges feathered into it (CSS mask-image radial/linear gradient) so no rectangle shows. Do
  not recolour the video (no filters, no blend modes on it).
- First visit: show at least until the scene is ready AND ≥ 3.5 s; fade out at a pleasant moment (after the cat is
  formed, ≈ 4–5 s, or at the end); if loading takes longer than the video, hold on `logo-anim-end.webp`. A tap anywhere (or
  any key) skips once the scene is ready. Repeat visits in the same session (sessionStorage): ≤ 1.2 s or skip.
- Reduced motion: show `logo-anim-end.webp` still image, no video. No JS / no WebGL: the still image + the buttons.
- The 3D scene keeps loading underneath; the loader must not delay first paint (poster image shows immediately).

## OWNER REQUESTS 10/11 (REQUIRED — v4 round)

Verbatim: "hiện tại video logo mở đầu nó gần như không load được, và có vẻ khá dài. Chị nghĩ là khi mở đầu cho nhảy thằng
vào mặt tiền shop luôn. khỏi cần mở đầu nữa. cái khung mẫu đó lưu lại để trên video của Purrlight. ... Máy tính bảng đi
thẳng như điện thoại nhé. và chị cần em điều chỉnh thêm về các nút. khi nó che 1 góc dưới quá nhiều. Ngoài ra tại sao
hình ảnh nó lại có dấu hiệu bị giật ảnh quá nhiều vậy? Nếu giờ chị cho yêu cầu 3D thay cho tranh vẽ thì nó có ổn hơn
không?"

1. **No intro.** The page opens straight on the shop façade. First paint = a static poster of the exact first view
   (rendered from the real scene + the real first-view camera, in the default look), as an `<img>`/CSS background with
   high fetch priority, one per layout (desktop landscape, phone portrait, tablet portrait/landscape if framing differs);
   small webp (≤ ~120 KB each). The live canvas cross-fades in (≤ 300 ms) when the first live frame is ready, with no
   visible jump (same camera, same look). "Skip to the shop" works immediately; "Step inside" pressed before the scene is
   ready shows a tiny busy state on the button and starts as soon as it is ready. Remove the logo-video loader from the
   page completely (no download of logo-anim files); keep its markup/CSS/JS archived under `js/archive/` + `css/archive/`
   (not loaded) as a template. The orchestrator separately exports the "khung mẫu" as video files for Purrlight's social
   videos — not part of the page.
2. **Tablets use the phone door-straight flow** (coarse pointer of any size, or viewport width < 1024).
3. **Buttons cover too much of the lower corner.** Make all overlays more compact and let the scene use the freed space:
   - exterior: desktop — a slimmer card or a small bottom bar (title one line, smaller), overlay area ≤ ~12% of the
     viewport; phone/tablet — a compact bottom bar (two pill buttons + one short line), ≤ ~16% of the height.
   - shelf: phone/tablet — a compact bar with Open the book / Stroll the shop and a small handle "On this shelf ▴" that
     expands the product cards as a drawer (collapsed by default; collapsed bar ≤ ~18% of the height); desktop — a
     narrower right panel or a bottom bar; the 3D framing (shift lens / free-area fit) must use the freed area so the
     shop and the display are bigger on screen.
   - keep ≥ 44–48 px targets, WCAG AA, safe areas, keyboard order.
4. **Smoothness ("giật ảnh") + "3D instead of painting".** The owner asks whether real 3D (no painted look) would be
   better. Answer in the build: YES — make **clean 3D the default look** (`?look=3d`, default) and keep the watercolour as
   `?look=paint` for comparison. In 3D: no Kuwahara/composite passes, no line boil, MSAA on desktop (and on phones if
   affordable, else FXAA/none at dpr ≥ 2), soft contact shadows, tuned golden-hour exterior + warm interior, lit windows
   glowing (bloom-free; emissive + halos), logo and Merlin photo naturally crisp. Make it look finished and cozy, not
   like a debug render (it was tuned for the paint until now: re-tune glow gains, exposure, materials, fog).
   Fix the real causes of stutter in BOTH looks:
   - precompile every material/shader (exterior, interior, all LOD levels, both palettes' variants in use) before the
     canvas is revealed (`renderer.compileAsync` / a hidden warm-up render of the inside views), so the door crossing
     never hitches;
   - never change pixel ratio, quality tier or paint tier during a walk; adapt only while idle;
   - LOD distances/hysteresis so nothing pops along both walk paths (or keep the near level for products during walks);
   - render every frame at full rate while anything moves (walk, idle animals, hover); when fully idle, stop rendering —
     never a visible 4 fps update; in paint mode the line boil is OFF by default;
   - time-based camera with dt clamping/smoothing so one slow frame does not jump the camera;
   - no GC spikes on the walk (pre-allocate); keep long tasks off the main thread during load (yield between texture,
     exterior, interior and compile steps while the poster shows; input stays responsive);
   - measure with CDP CPU throttling ×4 in headless: frame-time p50/p95/max and long-task count during load and during
     the walk, before vs after, for phone 390×844 and desktop 1280×800, both looks. Report the numbers.
