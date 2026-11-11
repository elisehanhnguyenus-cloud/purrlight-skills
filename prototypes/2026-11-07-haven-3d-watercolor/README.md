# Haven 3D: v4 (preview, 11/11/2026). Not part of website/

This folder holds the latest Haven 3D preview, now v4. Earlier versions are in git history:
- v3 (watercolour default, logo-video loader) is commit `cbd2ccf`;
- v2 is commit `04c2381`.

## Rounds of Elise's feedback

| Round | Elise's request (her words) | What changed |
|---|---|---|
| 06/11 | "Căn tiệm to quá rồi. Nó sẽ nhỏ 1 nửa, nhìn ấm cúng... retro, ngọt ngào, cửa sổ kiểu cafe Pháp... digital water color" | v2: a half-size cozy shop, painted as digital watercolour |
| 07/11 | Nine potted plants outside | Added to the exterior |
| 07/11 | "Chọn mặt tiền màu be vàng hồng", slower look-around inside, door-straight flow on mobile, her logo video as the loader, the logo cat as the pointer | v3 |
| 10/11 | "khi mở đầu cho nhảy thẳng vào mặt tiền shop luôn. khỏi cần mở đầu nữa" | v4: no intro. The page opens on a still of the exact first view, and the live 3D fades in over it |
| 10/11 | "Máy tính bảng đi thẳng như điện thoại nhé" | v4: tablets use the phone's door-straight flow |
| 10/11 | "các nút... che 1 góc dưới quá nhiều" | v4: smaller cards and buttons. The shelf list starts collapsed ("On this shelf") |
| 10/11 | "tại sao hình ảnh nó lại có dấu hiệu bị giật ảnh quá nhiều vậy? Nếu giờ chị cho yêu cầu 3D thay cho tranh vẽ thì nó có ổn hơn không?" | v4: clean 3D is the default, with stutter fixes. The watercolour look stays at `?look=paint` |

The logo-video loader is archived as a template for Purrlight's social videos. Those template videos were delivered separately and are not in this repo.

## Pages and switches

| URL | What |
|---|---|
| `index.html` | Clean 3D, beige / rose-gold façade (default) |
| `index.html?look=paint` | The watercolour + coloured-pencil look (`?paint=0` still means 3D) |
| `index.html?palette=sage` | Sage-green façade |
| `index.html?q=low` | Lowest quality tier; on phones, no street shadows |

## Stutter fixes in v4

- Shaders are compiled and textures uploaded before the first frame, not at the first door crossing.
- The scene is built in small steps, so the page never freezes for long.
- Quality, pixel ratio and level of detail never change mid-walk.
- Every frame is drawn while the camera moves. At rest nothing is redrawn (there is no 4 fps idle render any more).
- Frame time is clamped, and per-frame allocations are removed.
- Shadows are drawn once into a static map.
- The watercolour pencil "boil" is off by default.

## Files

| Part | Files |
|---|---|
| Page shell, camera, UI, picking, fallbacks | `index.html`, `css/haven3d.css`, `js/main.js`, `js/cat-cursor.js` |
| Watercolour post chain (only with `?look=paint`) | `js/watercolor.js` |
| Scene | `js/exterior.js`, `js/exterior-kit.js`, `js/interior.js`, `js/interior-kit.js`, `js/props.js`, `js/textures.js` |
| First-paint stills, one per layout, with the camera each was rendered from | `assets/poster-first-{d,l,m,s,t}.webp`, `assets/poster-first.json` |
| Fallbacks | `js/_stub-*.js` |
| Three.js r180 | `vendor/` (MIT, self-hosted, no CDN). Modern JS, not ES5 |
| Briefs | `CONTRACT.md`, `CONTRACT-v2.md` (Elise's v2–v4 requests verbatim) |
| How the cat icon's white background was removed | `tools-logo-cat-c2a.js` |

## Not in this public repo

These live only in the private preview artifact:
- `assets/merlin-table-560.webp`: the real Merlin photo;
- `assets/poster-shelf.webp`: it shows that photo;
- `assets/logo-cat.png`: Elise's cat icon with only the white background removed.

The page expects these files next to `index.html`. It also expects `../site/` to be a copy of `website/`, for the logo, fonts, product photos and links.

## Measured

Headless Chromium with SwiftShader (no GPU) and the CPU slowed 4×. This is a deliberately weak machine, so the absolute times are much slower than on a real phone. Each figure compares v3 with v4.

| | v3 | v4 |
|---|---|---|
| Phone: façade visible (largest paint) | 24.6 s | 0.9 s |
| Phone: longest freeze while loading | 9.8 s | 0.5–0.9 s |
| Phone: ready to tap | 18.9 s | 11.7–13.5 s |
| Desktop: longest freeze while loading | 10.0 s | 0.6–0.7 s |
| Phone: freeze on arriving at the shelf | 3.5–5.7 s | none |

Other checks:
- Console: 0 errors on desktop, phone and tablet, in both looks, with reduced motion, keyboard and no-WebGL.
- Draw calls / triangles, with the shadow pass counted:

  | | Draw calls | Triangles |
  |---|---|---|
  | Desktop exterior | 123 | 214k |
  | Desktop shelf | 63 | 193k |
  | Walk, worst frame | ≤ 107 | ≤ 250k (tightest: phone landscape 844×390, 249.7k) |

- On-screen logo width: 266 CSS px on desktop, 250 on a 390×844 phone.
- Not yet checked:
  - real-device smoothness on iPhone and Android;
  - phones now draw soft street shadows. On the slow test machine that costs about 20% more per frame during the walk. If a real phone feels heavy, they can be turned off for touch devices.

## Before any of this goes to website/

1. Elise decides on the direction (3D or watercolour).
2. Test on a real iPhone.
3. Approve the new copy (only the aria-label "Close" so far). Remove the Vietnamese preview chip and the restart label.
4. Wait until after the 15/11–02/01 holiday web lock.
