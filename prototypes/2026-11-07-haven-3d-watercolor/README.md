# Haven 3D, watercolour version (preview, 07/11/2026). Not part of website/

This preview responds to Elise's feedback on 06/11: "Căn tiệm to quá rồi. Nó sẽ nhỏ 1 nửa, nhìn ấm cúng... 1 chút retro, ngọt
ngào, phía ngoài cửa sổ kiểu cafe Pháp... phong cách artist kiểu digital water color". She added a plant list on 07/11.

It is a Three.js scene drawn entirely in code, with no AI images. The flow:
1. Exterior idle.
2. "Step inside": a 6 s, time-based walk through the always-open door, with glances at the café and the bookcases.
3. The camera stops at a round 3-tier display.
4. Then "Open the book" or "Stroll the shop". Every piece on the display links to its product page.

| Part | Files |
|---|---|
| Page shell, camera, UI, picking, fallbacks | `index.html`, `css/haven3d.css`, `js/main.js`, `js/cat-cursor.js` |
| Watercolour + coloured-pencil post chain | `js/watercolor.js`: an 8-sector generalized Kuwahara with polynomial weights, then pigment pooling, cold-press paper, tremor, pencil lines that boil at 4 steps/s (frozen under reduced motion), and a deckled border. A pristine layer keeps the real logo and the real Merlin photo crisp and unpainted. |
| Exterior | `js/exterior.js`, `js/exterior-kit.js`: an 8.4 m cottage-shop with a sage shopfront (`?palette=be` gives oat-beige, blush and rose-gold), the café window with a striped awning, the bistro table, two guests and a dog, a Maine Coon, a dog bowl, and the 9 potted plants Elise listed. |
| Interior | `js/interior.js`, `js/interior-kit.js`: a cozy retro room with a round café counter, vintage shelves, a jute rug and the round 3-tier display. |
| Shared props and textures | `js/props.js`, `js/textures.js` |
| Fallbacks | `js/_stub-*.js` (used if a module fails), `assets/poster-exterior.webp` (no-WebGL poster) |
| Three.js r180 | `vendor/` (MIT, `vendor/LICENSE-three.txt`), self-hosted with no CDN. Modern JS, not ES5. |
| Briefs the build team worked from | `CONTRACT.md`, `CONTRACT-v2.md` |

Assets left out of this public repo:
- `assets/merlin-table-560.webp`, the real Merlin photo Elise sent on 06/11;
- `assets/poster-shelf.webp`, because it shows that photo.

The page expects them next to `index.html`. It also expects `../site/` to be a copy of `website/`, for the logo, fonts, product photos and links. That is the layout of the private preview artifact.

Test hooks: `?view=exterior|door|inside|shelf`, `?cam=px,py,pz,lx,ly,lz[,fov]`, `?paint=0|raw|kuwa|lines|paper`, `?q=low|high`,
`?stats=1`, `?palette=be`, `?nogl=1`, `window.__haven.info()`.

Measured in headless Chromium (SwiftShader), counting the shadow pass:

| View | Draw calls | Triangles |
|---|---|---|
| Desktop exterior | 127 | 198k |
| Shelf | 66 | 165k |
| Walk, peak | — | 243k |

- On-screen logo width: 260 CSS px on desktop, 170 on a 390×844 phone.
- The post-chain cost is an estimate and still needs a real iPhone test.
- Before any of this goes near `website/`, Elise has to decide on the direction, and it needs a no-JS/ES5 fallback plan.
