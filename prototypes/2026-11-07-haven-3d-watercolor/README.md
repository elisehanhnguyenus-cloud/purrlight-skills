# Haven 3D, watercolour version: v3 (preview, 07/11/2026). Not part of website/

The preview went through three rounds of Elise's feedback:

| Round | Elise's request (her words) | What changed |
|---|---|---|
| 06/11 | "Căn tiệm to quá rồi. Nó sẽ nhỏ 1 nửa, nhìn ấm cúng... retro, ngọt ngào, cửa sổ kiểu cafe Pháp... digital water color" | v2: a half-size cozy shop, painted as digital watercolour |
| 07/11 | Nine potted plants outside | Added to the exterior |
| 07/11 | "Chọn mặt tiền màu be vàng hồng" | v3: beige / rose-gold façade is the default; `?palette=sage` keeps the green one |
| 07/11 | Slower camera that looks around inside | v3: desktop walk |
| 07/11 | Door-straight flow on mobile | v3: mobile walk |
| 07/11 | Her logo video as the loading screen | v3: loader |
| 07/11 | The cat from the logo as the pointer | v3: pointer and click hop |
| 07/11 | Mobile buttons and intro redone | v3: mobile UI |

v3 also applies the 15-point art review of v2 (see `ART-REVIEW-v2.txt`).

It is a Three.js scene drawn entirely in code, with no AI images.

## The flow

1. **Loading screen**: Elise's own logo animation video (Purrlight letters, the cat playing with the "i" dot).
2. **Exterior**: the sign carries the real logo, drawn crisp and never painted over.
3. **"Step inside"**:
   - Desktop: an eased walk of about 14.7 s, turning at most about 20°/s. It pauses at the door, pans slowly over the bookcases, vintage shelves and suitcase, then over the round café counter, looks up at the lantern and fairy lights, and glides to the round 3-tier display.
   - Phones: about 4.6 s straight through the doorway to the display.
   - Either can be skipped with ⏩, a tap or Esc. With reduced motion it is a 0.25 s cut.
4. **At the display**: "Open the book" or "Stroll the shop", plus product cards. Every piece links to its product page.
5. **Pointer** on fine pointers: the cat from the logo, using Elise's icon with only the white background removed. The click hop uses the same cat.

## Files

| Part | Files |
|---|---|
| Page shell, camera, UI, loader, picking, fallbacks | `index.html`, `css/haven3d.css`, `js/main.js`, `js/cat-cursor.js` |
| Watercolour + coloured-pencil post chain, pristine layer | `js/watercolor.js` |
| Scene | `js/exterior.js`, `js/exterior-kit.js`, `js/interior.js`, `js/interior-kit.js`, `js/props.js`, `js/textures.js` |
| Fallbacks | `js/_stub-*.js`, `assets/poster-exterior.webp` |
| Three.js r180 | `vendor/` (MIT, self-hosted, no CDN). Modern JS, not ES5. |
| Briefs | `CONTRACT.md`, `CONTRACT-v2.md` (includes all of Elise's v2/v3 requests verbatim) |
| How the cat icon's white background was removed | `tools-logo-cat-c2a.js` |

## Not in this public repo

These live only in the private preview artifact:
- `assets/merlin-table-560.webp`: the real Merlin photo;
- `assets/poster-shelf.webp`: it shows that photo;
- `assets/logo-anim.mp4`, `logo-anim.webm`, `logo-anim-poster.webp`, `logo-anim-end.webp`: Elise's logo animation, cropped to the logo, silent, colours untouched, about 125 KB;
- `assets/logo-cat.png`: Elise's cat icon with only the white background removed.

The page expects these files next to `index.html`. It also expects `../site/` to be a copy of `website/`, for the logo, fonts, product photos and links.

## Measured

Headless Chromium (SwiftShader), with the shadow pass forced on:

| | Draw calls | Triangles |
|---|---|---|
| Desktop exterior | 129 | 208k |
| Desktop shelf | 59 | 167k |
| Desktop walk, worst frame | — | 241k |
| Phone walk, worst frame | — | 231k |

- On-screen logo width: 266 CSS px on desktop, 212 on a 390×844 phone.
- Console: 0 errors.
- Not yet checked: real-device performance on iPhone and Android, and iOS video autoplay.

## Before any of this goes to website/

1. Elise decides on the direction.
2. Test on a real iPhone.
3. Approve the new copy (only the aria-label "Close" so far). Remove the Vietnamese preview chip and the restart label.
4. Ship a poster-first plan: show the still poster first and load the 3D only on "Step inside".
5. Wait until after the 15/11–02/01 holiday web lock.
