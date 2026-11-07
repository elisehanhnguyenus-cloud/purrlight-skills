/* Haven 3D v2 — page shell + camera for "Merlin's Purrfect Haven" (PREVIEW 06/11, Purrlight Studio).
   Owns: renderer, sky, fog, hemisphere + sun, soft environment fill, adaptive quality, the watercolour + pencil paint
   (js/watercolor.js: every frame goes through it; tone mapping happens once, inside the paint), the pristine layer
   (sign face + real Merlin photo on layer 1, never painted), the camera (views, the walk in, framing per screen) for the
   v2 half-size cottage shop, the state machine exterior -> walking -> shelf, picking on the round display, the HTML
   overlay, loading screen, no-WebGL fallback, reduced motion, sound, debug hooks and window.__haven.
   Scene content comes from textures.js / props.js / exterior.js / interior.js (stubs: _stub-*.js). */

import * as THREE from '../vendor/three.module.min.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';
import { createWatercolor } from './watercolor.js';

/* ------------------------------------------------------------------ constants */
const Q = new URLSearchParams(location.search);
const num = (k) => (Q.has(k) && Q.get(k) !== '' && isFinite(+Q.get(k)) ? +Q.get(k) : null);
const DEBUG = {
  view: Q.get('view'), stats: Q.get('stats') === '1', t: num('t'), walk: num('walk'), nogl: Q.get('nogl') === '1',
  tm: Q.get('tm'), paint: Q.get('paint'),   /* ?paint=0 plain render; raw | kuwa | lines | paper show one stage */
  cam: (Q.get('cam') || '').split(',').map(Number).filter((n) => isFinite(n)),   /* test hook: ?cam=px,py,pz,lx,ly,lz[,fov] */
};
const FORCED_Q = Q.get('q') === 'low' || Q.get('q') === 'high' ? Q.get('q') : null;
const STUB = (() => {
  const s = { lib: false, ext: false, int: false }, v = (Q.get('stub') || '').trim().toLowerCase();
  if (!v || v === '0') return s;
  if (v === '1' || v === 'all' || v === 'true') return { lib: true, ext: true, int: true };
  for (const p of v.split(',')) { const k = p.trim(); if (k in s) s[k] = true; }
  return s;
})();

const LINK = {
  book: '../site/index.html?concept=book&intro=1',
  shop: '../site/shop.html?concept=off',
  merlin: '../site/about.html?concept=off',
  product: (id) => `../site/product.html?id=${encodeURIComponent(id)}&concept=off`,
};
const PHOTO = (id) => `../site/assets/img/products/${id}-600.webp`;
const MERLIN_PHOTO = 'assets/merlin-table-560.webp';

/* the real products on the shelf (ids + names exactly as in the shop), in card-row order */
const PRODUCTS = [
  ['tuxedo-cat', 'Tuxedo Crochet Cat — From Your Photo'],
  ['maine-coon-cat', 'Maine Coon Crochet Cat'],
  ['ginger-tabby-cat', 'Ginger Tabby Crochet Cat'],
  ['calico-crochet-cat', 'Calico Crochet Cat'],
  ['siamese-cat', 'Siamese Crochet Cat'],
  ['white-cat', 'White Crochet Cat'],
  ['british-shorthair-cat', 'British Shorthair Crochet Cat — Sherlock-style outfit'],
  ['george-washington-doll', 'George Washington Crochet Doll'],
  ['anne-shirley-set', 'Red-Braid Storybook Doll Set'],
  ['bennet-darcy-set', 'Elizabeth Bennet & Mr Darcy Crochet Doll Pair'],
  ['dashwood-ferrars-set', 'Elinor Dashwood & Edward Ferrars Crochet Dolls'],
  ['knitted-sheep', 'Fluffy Knitted Sheep'],
  ['knitted-daisy-duck', 'Knitted Daisy-Pocket Duck'],
  ['crochet-animal-friends-set', 'Crochet Animal Friends — Set of Four'],
  ['linen-pocket-doll', 'Linen Pocket Doll Bag Charm'],
  ['americana-doll-bag-charm', 'Americana Linen Doll Bag Charm'],
  ['quilted-cat-pouch', 'Quilted Appliqué Cat Pouch'],
];
const PRODUCT_NAME = new Map(PRODUCTS);

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
const rad = THREE.MathUtils.degToRad, deg = THREE.MathUtils.radToDeg;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/* camera views (CONTRACT-v2: the cottage shop is 8.4 m wide, 7.6 m deep; ground floor 0-4.0, floor 2 4.0-6.6, roof
   ridge <= 9.5; the door x -0.7..0.7, y 0..2.5; the sign 3.4 m wide centred at (0, 3.38, 0.07); the round display at
   (0, 0, -4.6) with the hook stand at about (1.15, 0, -4.35)) */
const HOUSE = { x: 4.2, zBack: -7.6, eaves: 6.6, ridge: 9.5 };
const EXT = {
  wide: { pos: V(0, 2.2, 11), look: V(0, 3.0, 0), fitW: 11.5 },
  tall: { pos: V(0, 2.1, 9.2), look: V(0, 3.2, 0), fitW: 6.4 },
};
const DOOR = { x: 0.7, h: 2.5 };
const VIEW_DOOR = { pos: V(0, 1.64, 1.9), look: V(0, 1.45, -4.6) };
const VIEW_INSIDE = { pos: V(0, 1.62, -0.9), look: V(0, 1.15, -4.6) };
const SHELF_DEFAULT = { pos: V(0.22, 1.52, -2.5), look: V(0.24, 0.98, -4.55) };   /* lower than the contract's 1.66 so the tiers' tops read */
const DISPLAY = { c: V(0, 0, -4.6), r: 0.8, top: 1.32, hook: V(1.15, 0, -4.35) };
const WALK_MIDS = [V(0, 1.72, 4.2), V(0, 1.62, 0.9), V(0, 1.6, -0.7), V(0, 1.6, -1.6)];
const WALK_DUR = 6.0;
const GLANCE = { cafe: V(2.9, 1.3, -2.6), gift: V(-2.9, 1.4, -3.4) };
/* when the camera zooms in for the logo, at least this much roof stays in view: the whole roof front with its dormers
   on wide screens, the eaves and the dormer windows on phones (where the sign matters most) */
const ROOF_KEEP = { wide: V(0, 8.15, -1.9), phone: V(0, 7.25, 0.1), short: V(0, 5.6, 0.4) };   /* short: phones on their side */
const LOGO_FRAC = 0.8;                /* share of the sign face the logo covers (T.signFace draws it at >= 78%) */
const LOGO_MIN = { desktop: 260, phone: 170 };

/* light + atmosphere outside (o) and inside (i); blended by camera z when passing the door. Tuned for the watercolour:
   a soft golden key, a lavender sky fill so the shade reads lilac (never grey), a warm ground bounce, low contrast;
   inside, a warm lamp-lit room. */
const ATMO = {
  o: { exposure: 1.02, hemi: 1.55, sun: 2.25, fogNear: 19, fogFar: 72, sky: '#E4DDF0', ground: '#EBCDAA', sunColor: '#FFD2A2' },
  i: { exposure: 0.98, hemi: 0.9, sun: 0.85, fogNear: 12, fogFar: 46, sky: '#FFE6C9', ground: '#DDBB96', fog: '#F2E1CC' },
};

/* ------------------------------------------------------------------ DOM */
const $ = (s) => document.querySelector(s);
const html = document.documentElement, body = document.body;
const canvas = $('#scene'), veil = $('#veil'), warmth = $('#warmth'), loader = $('#loader');
const extEl = $('#ext'), shelfEl = $('#shelf'), rowEl = $('#row');
const tip = $('#tip'), tipName = $('#tip-name'), tipView = $('#tip-view');
const pickEl = $('#pick'), pickMedia = $('#pick-media'), pickName = $('#pick-name'), pickLink = $('#pick-link'), pickLinkText = $('#pick-link-text');
const sndBtn = $('#snd'), sndLabel = $('#snd-label'), statsEl = $('#stats');

/* ------------------------------------------------------------------ state */
let renderer = null, scene = null, camera = null, T = null, P = null, EXTB = null, INTB = null, wc = null;
let hemi = null, sun = null;
let state = 'loading', view = 'exterior', uiState = 'loading';
let W = innerWidth, H = innerHeight;
const coarse = matchMedia('(pointer: coarse)').matches;
/* quality 'high' = sun shadow map; phones go without it (the paint reads soft contact shadows just as well) */
let quality = FORCED_Q || ((coarse || (navigator.deviceMemory && navigator.deviceMemory <= 2)) ? 'low' : 'high');
/* paint tier: 'low' on phones (half-res Kuwahara R3, cheaper composite), 'high' on desktop; adaptive quality may lower it */
let paintQ = FORCED_Q || (coarse || quality === 'low' ? 'low' : 'high');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const prCap = coarse ? 1.5 : 2;
let pixelRatio = Math.min(window.devicePixelRatio || 1, prCap);
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = mqReduce.matches;
let frames = {}, walk = null, walkT = 0, walkFrozen = false, walkStartedAt = 0;
let rects = { ext: null, shelf: null };
let sign = null, roofPts = null, anchors = { ext: {}, int: {} }, pickables = [];
let clockT = 0, lastNow = 0, rafId = 0, running = false, dirty = true, firstFrame = false, cutting = false, cutTimer = 0;
let fpsEMA = 1 / 60, lastCalls = 0, lastTris = 0, frameNo = 0;
let hoverObj = null, pickObj = null, litId = null, pointerNDC = null, pointerXY = { x: 0, y: 0 }, pointerMoved = false;
const par = new THREE.Vector2(), parTarget = new THREE.Vector2();
const offsetNow = V(), walkOffset0 = V();
let readyResolve; const ready = new Promise((r) => (readyResolve = r));
const updateBroken = { ext: false, int: false };

/* ------------------------------------------------------------------ small math: splines */
/* timed cardinal spline through [t, value, hold?] keys (value: number or Vector3). Tangents from neighbours over time,
   zero at the ends and at "hold" keys (a soft dwell, e.g. a glance). C1 in time. */
function timedSpline(keys) {
  const n = keys.length, isV = !!keys[0][1].isVector3;
  const ts = keys.map((k) => k[0]), vs = keys.map((k) => (isV ? k[1].clone() : k[1]));
  const ms = vs.map((v, i) => {
    if (i === 0 || i === n - 1 || keys[i][2]) return isV ? V() : 0;
    const dt = ts[i + 1] - ts[i - 1];
    return isV ? vs[i + 1].clone().sub(vs[i - 1]).divideScalar(dt) : (vs[i + 1] - vs[i - 1]) / dt;
  });
  return (t, out) => {
    if (t <= ts[0]) return isV ? out.copy(vs[0]) : vs[0];
    if (t >= ts[n - 1]) return isV ? out.copy(vs[n - 1]) : vs[n - 1];
    let i = 0; while (t > ts[i + 1]) i++;
    const h = ts[i + 1] - ts[i], s = (t - ts[i]) / h, s2 = s * s, s3 = s2 * s;
    const a = 2 * s3 - 3 * s2 + 1, b = s3 - 2 * s2 + s, c = -2 * s3 + 3 * s2, d = s3 - s2;
    if (!isV) return a * vs[i] + b * h * ms[i] + c * vs[i + 1] + d * h * ms[i + 1];
    return out.set(0, 0, 0).addScaledVector(vs[i], a).addScaledVector(ms[i], b * h).addScaledVector(vs[i + 1], c).addScaledVector(ms[i + 1], d * h);
  };
}
/* monotone cubic (Fritsch–Carlson), zero slope at both ends: time -> distance along the walk, starts and stops at rest */
function pchip(xs, ys) {
  const n = xs.length, h = [], d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) { h[i] = xs[i + 1] - xs[i]; d[i] = (ys[i + 1] - ys[i]) / h[i]; }
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) continue;
    const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
    m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
  }
  return (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const s = (x - xs[i]) / h[i], s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * ys[i] + (s3 - 2 * s2 + s) * h[i] * m[i] + (-2 * s3 + 3 * s2) * ys[i + 1] + (s3 - s2) * h[i] * m[i + 1];
  };
}

/* ------------------------------------------------------------------ framing */
/* camera-space projector for a camera at pos looking at look: returns tangent-plane coords (u right, v up) + depth */
function projector(pos, look) {
  const m = new THREE.Matrix4().lookAt(pos, look, UP);
  const r = V().setFromMatrixColumn(m, 0), u = V().setFromMatrixColumn(m, 1), b = V().setFromMatrixColumn(m, 2), d = V();
  return (p) => { d.subVectors(p, pos); const z = -d.dot(b); return { u: d.dot(r) / z, v: d.dot(u) / z, z }; };
}
/* Fit a set of world points into a screen rect (CSS px) for a camera at pos looking at look. The camera keeps its
   orientation; the vertical fov sets the scale and an off-axis view offset (a "shift lens", verticals stay vertical)
   places the subject inside the rect. Returns { pos, look, fov, sx, sy, k, fits } where sx/sy are content shifts in
   NDC and k is px per tangent unit. o: margin (fraction of rect), vBias (+1 = spare room goes on top), kMin, fov limits. */
function fitFrame(pos, look, pts, rect, o = {}) {
  const proj = projector(pos, look);
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  for (const p of pts) {
    const q = proj(p); if (q.z < 0.05) continue;
    u0 = Math.min(u0, q.u); u1 = Math.max(u1, q.u); v0 = Math.min(v0, q.v); v1 = Math.max(v1, q.v);
  }
  const mg = o.margin ?? 0.04;
  const rw = Math.max(40, rect.w * (1 - 2 * mg)), rh = Math.max(40, rect.h * (1 - 2 * mg));
  let k = Math.min(rw / Math.max(1e-4, u1 - u0), rh / Math.max(1e-4, v1 - v0));
  if (o.kMin) k = Math.max(k, o.kMin);
  if (o.kFix) k = o.kFix;
  let t = H / (2 * k);
  const tMax = Math.tan(rad(o.fovMax ?? 80) / 2), tMin = Math.tan(rad(o.fovMin ?? 16) / 2);
  if (t > tMax) t = tMax; if (t < tMin) t = tMin;
  k = H / (2 * t);
  const sw = (u1 - u0) * k, sh = (v1 - v0) * k;
  const fits = sw <= rw + 1 && sh <= rh + 1;
  const cx = rect.x + rect.w / 2;
  let cy;
  if (sh <= rh) {
    const spare = rh - sh, bias = o.vBias ?? 0;
    cy = rect.y + rect.h * mg + spare * (0.5 + 0.5 * bias) + sh / 2;
  } else {
    cy = rect.y + rect.h * (1 - mg) - sh / 2;      /* too tall: keep the bottom (door, cat), crop the top */
  }
  const uc = (u0 + u1) / 2, vc = (v0 + v1) / 2;
  const dx = cx - (W / 2 + uc * k), dy = (H / 2 - vc * k) - cy;
  return { pos: pos.clone(), look: look.clone(), fov: deg(2 * Math.atan(t)), sx: dx / (W / 2), sy: dy / (H / 2), k, fits };
}
const naturalFov = () => clamp(deg(2 * Math.atan(Math.tan(rad(72) / 2) / (W / H))), 44, 70);

function isPhoneish() { return Math.min(W, H) < 600; }

function exteriorFrame() {
  const tall = W / H < 1, b = tall ? EXT.tall : EXT.wide, hw = b.fitW / 2;
  /* fit width guides, the pavement in front of the door, the Maine Coon (-0.95, 0, 0.45) and the dog bowl (0.95, 0, 0.42) */
  const base = [V(-hw, 2.4, 0), V(hw, 2.4, 0), V(0, -0.04, 1.0), V(-1.2, 0, 0.75), V(1.2, 0, 0.7)];
  const roof = roofPts && roofPts.length ? roofPts : [V(0, HOUSE.ridge - 0.2, -3.8), V(-HOUSE.x, HOUSE.eaves + 0.3, -0.5), V(HOUSE.x, HOUSE.eaves + 0.3, -0.5)];
  const pts = base.concat(roof);
  /* the exterior's keep points (café table + guests, the cat, the bowl, the house corners); phones keep the near ones */
  const keep = Array.isArray(anchors.ext.keepPts) && anchors.ext.keepPts.every((p) => p && p.isVector3) ? anchors.ext.keepPts : [V(3.45, 0, 2.05), V(1.65, 0, 2.05), V(-0.95, 0, 0.6), V(0.95, 0, 0.55)];
  for (const p of keep) if (!tall || Math.abs(p.x) < 1.6) pts.push(p.clone());
  const opts = { margin: tall ? 0.02 : 0.018, vBias: tall ? 0.2 : 0.3, fovMax: 80, fovMin: 18 };
  let f = fitFrame(b.pos, b.look, pts, rects.ext, opts);
  /* the logo must read: zoom in toward the minimum logo width, but never so far that the roof leaves the frame */
  const s = sign;
  if (s) {
    const proj = projector(b.pos, b.look);
    const logoTan = Math.abs(proj(s.logoR).u - proj(s.logoL).u);
    const need = (isPhoneish() ? LOGO_MIN.phone : LOGO_MIN.desktop) / logoTan;
    if (need > f.k) {
      /* first keep the preferred roof line; if the logo is still too small, give up roof down to the next keep point
         (the minimum logo width is a hard rule; the roof stays in view as the dormers / eaves) */
      const short = html.classList.contains('lay-short'), phone = isPhoneish() || html.classList.contains('lay-sheet');
      const order = short ? [ROOF_KEEP.short] : phone ? [ROOF_KEEP.phone, ROOF_KEEP.short] : [ROOF_KEEP.wide, ROOF_KEEP.phone, ROOF_KEEP.short];
      let k = f.k;
      for (const keepPt of order) {
        const keep = fitFrame(b.pos, b.look, [V(-1.9, 0.5, 0), V(1.9, 0.5, 0), V(0, 0, 0.55), V(-1.2, 0, 0.62), keepPt], rects.ext, opts);
        k = Math.min(need, Math.max(keep.k, k));
        if (k >= need - 0.5) break;
      }
      if (k < need - 0.5) k = need;     /* hard rule: the logo wins; the frame keeps the bottom (door, cat) and crops roof */
      if (k > f.k + 1) f = fitFrame(b.pos, b.look, pts, rects.ext, { ...opts, kMin: k });
    }
  }
  if (!tall && rects.card) f = clearOfCard(f, b, pts, opts);
  return f;
}
/* Desktop: the ivory card sits bottom-left over the pavement. Slide the picture right (shift lens, verticals stay
   straight) so most of the display window, the door and the Maine Coon stay clear of it, without pushing the roof, the
   chimney or the café table off screen; if that is not enough, step back a little, never below the minimum logo width. */
const CLEAR_PTS = [V(-3.6, 0.65, 0.55), V(-3.6, 1.6, 0.55), V(-3.6, 2.55, 0.55), V(-1.05, 0, 0.55), V(-1.2, 0, 0.6), V(-0.7, 0, 0)];
function clearOfCard(f, b, pts, opts) {
  const r = rects.card, proj = projector(b.pos, b.look);
  /* what must stay on screen: the house itself (roof line, chimneys, corners) and the café table, not the fit-width guides */
  const X = HOUSE.x + 0.15;
  const house = (roofPts && roofPts.length ? roofPts : [V(-HOUSE.x, HOUSE.eaves + 0.3, -0.5), V(HOUSE.x, HOUSE.eaves + 0.3, -0.5)]).concat([V(-X, 0, 0.1), V(X, 0, 0.1), V(X, HOUSE.eaves, 0.3), V(-X, HOUSE.eaves, 0.3), V(3.25, 0, 2.35)]);   /* walls, eaves, café table */
  const qs = house.map(proj), qc = CLEAR_PTS.map(proj);
  const logoTan = sign ? Math.abs(proj(sign.logoR).u - proj(sign.logoL).u) : 0;
  const kLogo = logoTan ? (LOGO_MIN.desktop + 3) / logoTan : 0;
  const solve = (g) => {
    const sxp = (q) => W / 2 + q.u * g.k + g.sx * W / 2, syp = (q) => H / 2 - q.v * g.k - g.sy * H / 2;
    let need = 0, maxX = -Infinity, minX = Infinity;
    for (const q of qc) { const y = syp(q); if (y >= r.y - 10 && y <= r.y + r.h + 10) need = Math.max(need, r.x + r.w + 10 - sxp(q)); }
    for (const q of qs) { maxX = Math.max(maxX, sxp(q)); minX = Math.min(minX, sxp(q)); }
    return { need, room: W - 6 - maxX };
  };
  let g = f, s = solve(g);
  for (let i = 0; i < 16 && s.need > s.room + 0.5 && g.k > kLogo + 0.5; i++) {
    g = fitFrame(b.pos, b.look, pts, rects.ext, { ...opts, kFix: Math.max(kLogo, g.k * 0.992) }); s = solve(g);
  }
  const dx = Math.max(0, Math.min(s.need, s.room));
  g = { ...g, pos: g.pos.clone(), look: g.look.clone(), sx: g.sx + dx / (W / 2), overlap: Math.max(0, s.need - dx), dbg: { need: s.need, room: s.room, k: g.k, k0: f.k, kLogo } };
  return g;
}

/* the round 3-tier display (tiers r 0.80 / 0.56 / 0.32, top tier at 1.32 with the fabric book on its stand) and the
   hook stand beside it: everything fits above the bottom sheet on phones and beside/above the card on desktop */
function displayPts() {
  const a = anchors.int;
  if (Array.isArray(a.shelfFit) && a.shelfFit.length >= 2 && a.shelfFit.every((p) => p && p.isVector3)) return a.shelfFit.map((p) => p.clone());
  const c = (a.display && a.display.isVector3 ? a.display : DISPLAY.c).clone(), r = +a.displayRadius || DISPLAY.r;
  const hook = (a.hookStand && a.hookStand.isVector3 ? a.hookStand : DISPLAY.hook).clone();
  const top = (+a.displayTop || DISPLAY.top) + 0.36;                       /* the book on its stand + the cat's ears */
  const pts = [V(c.x - r - 0.04, 0, c.z + 0.18), V(c.x + r + 0.04, 0, c.z + 0.18), V(c.x, -0.02, c.z + r + 0.06),
    V(c.x - r * 0.72, 0.95, c.z + 0.35), V(c.x + r * 0.72, 0.95, c.z + 0.35), V(c.x, top, c.z), V(c.x - 0.36, top - 0.1, c.z + 0.08), V(c.x + 0.36, top - 0.1, c.z + 0.08)];
  const hh = +a.hookStandHeight || 1.45;
  pts.push(V(hook.x + 0.3, 0, hook.z + 0.12), V(hook.x + 0.3, hh, hook.z), V(hook.x - 0.2, hh, hook.z));
  return pts;
}
const SHELF_Z_MAX = -1.3;   /* the shelf camera never backs up nearer the door than this (it stays well inside the room) */
function shelfFrame() {
  const sv = anchors.int.shelfView || SHELF_DEFAULT;
  const look = sv.look.clone(); let pos = sv.pos.clone();
  let pts = displayPts();
  const r = rects.shelf, tall = r.w / r.h < 1.15;
  /* portrait phones: the round display fills the width; the hook stand's far arm and foot may leave the frame (its
     charms stay in view and in the card row), so the tiers read larger */
  if (tall) pts = pts.map((p) => (p.x > 1.24 ? V(1.24, p.y, p.z) : p));
  const fovMax = tall ? 78 : lerp(72, 50, smooth(0.6, 1.5, W / H));
  const opts = { margin: tall ? 0.035 : 0.05, vBias: 0.25, fovMax: 140, fovMin: 14 };
  let f = null;
  for (let i = 0; i < 8; i++) {
    f = fitFrame(pos, look, pts, r, opts);
    if (f.fov <= fovMax + 0.05) break;
    /* too wide an angle for this screen: step back along the view line (tangent extents scale with 1/distance) */
    const ratio = Math.tan(rad(f.fov) / 2) / Math.tan(rad(fovMax) / 2);
    const next = look.clone().add(pos.clone().sub(look).multiplyScalar(ratio * 1.003));
    if (next.z > SHELF_Z_MAX) {
      const d = pos.clone().sub(look), t = (SHELF_Z_MAX - look.z) / d.z;
      pos = look.clone().addScaledVector(d, t);
      f = fitFrame(pos, look, pts, r, opts);
      if (f.fov > 84) f = fitFrame(pos, look, pts, r, { ...opts, fovMax: 84 });   /* crop a little rather than distort */
      break;
    }
    pos = next;
  }
  return f;
}

function naturalFrame(v) { return { pos: v.pos.clone(), look: v.look.clone(), fov: naturalFov(), sx: 0, sy: 0, k: 0, fits: true }; }

/* The walk: a centripetal Catmull-Rom through the contract points for the position, timed by arc length with a pace
   profile (full pace outside, half pace inside, eased from and to rest), and a timed Catmull-Rom for the look target keyed
   to places on the path (door, a café glance, a gift glance, the shelf). FOV and the shift-lens offset ease along. */
const PACE_IN = 0.36;   /* inside the small shop the visitor slows to about a third of the street pace */
const easeWalk = pchip([0, 0.14, 0.72, 1], [0, 0.075, 0.86, 1]);
function easeWalkInv(u) { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (easeWalk(m) < u) lo = m; else hi = m; } return (lo + hi) / 2; }
function buildWalk() {
  const E = frames.exterior, S = frames.shelf;
  const mids = WALK_MIDS.filter((p) => p.z > S.pos.z + 0.6).map((p) => p.clone());
  const pts = [E.pos.clone(), ...mids, S.pos.clone()];
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  curve.arcLengthDivisions = 600;
  /* pace table: arc fraction -> eased "pace time" */
  const N = 400, zs = new Float32Array(N + 1), us = new Float32Array(N + 1), tmp = V();
  for (let i = 0; i <= N; i++) zs[i] = curve.getPointAt(i / N, tmp).z;
  const paceTable = (pIn) => {
    us[0] = 0;
    for (let i = 1; i <= N; i++) { const z = (zs[i] + zs[i - 1]) / 2; us[i] = us[i - 1] + 1 / lerp(pIn, 1, smooth(-0.5, 2.6, z)); }
    for (let i = 0; i <= N; i++) us[i] /= us[N];
  };
  /* time share spent past the door (z < -0.35) for a given inside pace: at least ~2.2 s of the walk is in the shop */
  const inShare = () => { let i = 0; while (i < N && zs[i] > -0.35) i++; return 1 - easeWalkInv(clamp(us[i], 0, 1)); };
  let pIn = PACE_IN;
  paceTable(pIn);
  for (let k = 0; k < 8 && inShare() * WALK_DUR < 2.2 && pIn > 0.08; k++) { pIn *= 0.72; paceTable(pIn); }
  const uToS = (u) => { if (u <= 0) return 0; if (u >= 1) return 1; let lo = 0, hi = N; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (us[m] < u) lo = m; else hi = m; } return (lo + (u - us[lo]) / Math.max(1e-6, us[hi] - us[lo])) / N; };
  const sToU = (sf) => { const x = clamp(sf, 0, 1) * N, i = Math.min(N - 1, Math.floor(x)); return lerp(us[i], us[i + 1], x - i); };
  const sAt = (t) => uToS(easeWalk(clamp(t / WALK_DUR, 0, 1)));
  const posAt = (t, out = V()) => curve.getPointAt(sAt(t), out);
  const timeAtZ = (z) => {                                   /* first time the camera passes depth z */
    let i = 0; while (i < N && zs[i] > z) i++;
    const sf = i === 0 ? 0 : (i - 1 + (zs[i - 1] - z) / Math.max(1e-6, zs[i - 1] - zs[i])) / N;
    return easeWalkInv(sToU(sf)) * WALK_DUR;
  };
  const cafe = anchors.int.cafeLook || GLANCE.cafe, gift = anchors.int.giftLook || GLANCE.gift;
  /* a glance: turn the head toward a place (yaw capped), the look target kept ~3 m out (a small room) */
  const glance = (t, a, yawDeg) => {
    const c = posAt(t), side = Math.sign(a.x - c.x) || 1;
    const want = Math.atan2(Math.abs(a.x - c.x), Math.max(0.3, c.z - a.z)), yaw = Math.min(want, rad(yawDeg)) * side;
    return V(c.x + Math.sin(yaw) * 3, clamp(a.y, c.y - 0.4, c.y + 0.1), c.z - Math.cos(yaw) * 3);
  };
  const zIn = -0.35;
  const tA = Math.min(timeAtZ(5.6), 1.4), tB = Math.max(tA + 0.7, timeAtZ(2.0)), tEnd = WALK_DUR - 0.5;
  /* glances, once through the door: right toward the café counter, then left toward the bookcases / vintage shelves,
     about a second apart, then settle on the display */
  const tIn = timeAtZ(zIn);
  let tC = Math.max(tB + 0.7, tIn + 0.3);
  let tG = tC + 1.0;
  if (tG > tEnd - 0.7) { tG = Math.max(tC + 0.6, tEnd - 0.7); tC = Math.max(tIn + 0.15, Math.min(tC, tG - 0.85)); }
  const sl = S.look;
  const lookKeys = [
    [0, E.look.clone()],
    [tA, V(0, lerp(E.look.y, 1.9, 0.55), -1.0)],
    [tB, V(0, 1.55, -4.2)],
    [tC, glance(tC, cafe, 30), true],
    [tG, glance(tG, gift, 26), true],
    [tEnd, V(sl.x, lerp(sl.y, 1.2, 0.3), sl.z)],
    [WALK_DUR, sl.clone()],
  ];
  const tDoor = timeAtZ(zIn);
  const nf = naturalFov(), hold = (k) => k.map((x) => [x[0], x[1], true]);
  walk = {
    pos: posAt,
    look: timedSpline(lookKeys),
    fov: timedSpline(hold([[0, E.fov], [Math.max(1.1, tB - 0.2), nf], [tEnd - 0.6, nf], [WALK_DUR, S.fov]])),
    sx: timedSpline(hold([[0, E.sx], [Math.max(1.2, tB), 0], [tEnd - 0.6, 0], [WALK_DUR, S.sx]])),
    sy: timedSpline(hold([[0, E.sy], [Math.max(1.2, tB), 0], [tEnd - 0.6, 0], [WALK_DUR, S.sy]])),
    curve, keys: { tA, tB, tDoor, tC, tG, tEnd },
  };
}

/* ------------------------------------------------------------------ layout */
function measureTop(el) {
  const cs = getComputedStyle(el);
  return H - (parseFloat(cs.bottom) || 0) - el.offsetHeight;
}
function computeRects() {
  const topClear = Math.max(48, sndBtn.offsetTop + sndBtn.offsetHeight + 6);
  const sheet = html.classList.contains('lay-sheet'), short = html.classList.contains('lay-short');
  if (short) {
    /* cards in a column on the left: frame the scene in the space to their right */
    const right = (el) => (parseFloat(getComputedStyle(el).left) || 0) + el.offsetWidth + 8;
    const xe = right(extEl), xs = right(shelfEl);
    rects.ext = { x: xe, y: topClear - 4, w: Math.max(W * 0.4, W - xe - 8), h: H - topClear - 4 };
    rects.shelf = { x: xs, y: topClear - 4, w: Math.max(W * 0.4, W - xs - 8), h: H - topClear - 4 };
    rects.card = null;
    html.style.setProperty('--shelf-h', '0px');
    return;
  }
  const extTop = measureTop(extEl), shelfTop = measureTop(shelfEl);
  rects.card = sheet ? null : { x: parseFloat(getComputedStyle(extEl).left) || 0, y: extTop, w: extEl.offsetWidth, h: extEl.offsetHeight };
  rects.ext = sheet
    ? { x: 8, y: topClear, w: W - 16, h: Math.max(H * 0.35, extTop - topClear - 6) }
    : { x: 14, y: topClear - 6, w: W - 28, h: H - topClear - 8 };
  if (html.classList.contains('lay-wide')) {
    /* the shelf panel stands at the right: the display gets the full height to its left */
    const sr = shelfEl.getBoundingClientRect(), sl = sr.width > 0 ? sr.left : W;   /* panel hidden (posters): full width */
    rects.shelf = { x: 10, y: topClear - 6, w: Math.max(W * 0.4, sl - 22), h: H - topClear - 6 };
    html.style.setProperty('--shelf-h', '0px');
    return;
  }
  rects.shelf = { x: 8, y: topClear, w: W - 16, h: Math.max(H * 0.3, shelfTop - topClear - 8) };
  html.style.setProperty('--shelf-h', Math.round(H - shelfTop) + 'px');
}
function layout() {
  W = Math.max(1, canvas.clientWidth || innerWidth); H = Math.max(1, canvas.clientHeight || innerHeight);
  if (renderer) { renderer.setPixelRatio(pixelRatio); renderer.setSize(W, H, false); if (wc) wc.setSize(W, H, pixelRatio); }
  /* desktop card bottom-left unless that would cover the cat at the door; then the bottom-sheet layout */
  let sheet = W / H < 1 || (W < 760 && H >= 560);
  const short = !sheet && H < 560;
  html.classList.toggle('lay-sheet', sheet);
  html.classList.toggle('lay-short', short);
  html.classList.toggle('lay-wide', !sheet && !short && W >= 980 && W / H >= 1.2);
  computeRects();
  if (!sheet && !short && scene) {
    /* the compact card bottom-left; if the picture cannot slide clear of it (narrow windows), use the bottom sheet */
    const f = exteriorFrame();
    window.__dbgCard = { ...f.dbg, overlap: f.overlap, card: rects.card };
    if (f.overlap > 60) { sheet = true; html.classList.add('lay-sheet'); html.classList.remove('lay-wide'); computeRects(); }
  }
  if (!scene) return;
  frames.exterior = exteriorFrame();
  frames.shelf = shelfFrame();
  frames.door = naturalFrame(VIEW_DOOR);
  frames.inside = naturalFrame(VIEW_INSIDE);
  buildWalk();
  dirty = true;
  updateCamera(0);
}
let layoutQueued = false;
function queueLayout() { if (layoutQueued) return; layoutQueued = true; requestAnimationFrame(() => { layoutQueued = false; layout(); if (!running && renderer && firstFrame) renderOnce(); }); }

/* ------------------------------------------------------------------ camera */
const camTmp = { pos: V(), look: V(), fov: 50, sx: 0, sy: 0 };
function applyFrame(f, extra) {
  camera.position.copy(f.pos); if (extra) camera.position.add(extra);
  camera.up.copy(UP); camera.lookAt(f.look);
  camera.fov = f.fov; camera.aspect = W / H;
  camera.setViewOffset(W, H, -f.sx * W / 2, f.sy * H / 2, W, H);
  camera.updateProjectionMatrix();
}
function updateCamera(dt) {
  if (!camera || !frames.exterior) return;
  if (DEBUG.cam.length >= 6) {   /* fixed test camera, no shift lens */
    const c = DEBUG.cam; camera.position.set(c[0], c[1], c[2]); camera.up.copy(UP); camera.lookAt(c[3], c[4], c[5]);
    camera.fov = c[6] || 50; camera.aspect = W / H; camera.clearViewOffset(); camera.updateProjectionMatrix();
    atmosphere(camera.position.z); return;
  }
  if (state === 'walking' && walk) {
    walk.pos(walkT, camTmp.pos); walk.look(walkT, camTmp.look);
    camTmp.fov = walk.fov(walkT); camTmp.sx = walk.sx(walkT); camTmp.sy = walk.sy(walkT);
    const fade = 1 - smooth(0, 1.3, walkT);
    applyFrame(camTmp, offsetNow.copy(walkOffset0).multiplyScalar(fade));
  } else if (view === 'exterior') {
    offsetNow.set(0, 0, 0);
    if (!reduceMotion && DEBUG.t === null) {
      const tt = clockT;   /* idle drift: a few cm, slow, never a loop you can see */
      offsetNow.set(0.045 * Math.sin(tt * 0.42) + 0.018 * Math.sin(tt * 0.17 + 1.3), 0.028 * Math.sin(tt * 0.31 + 0.7), 0.035 * Math.sin(tt * 0.23 + 2.1));
      if (finePointer) {
        par.lerp(parTarget, 1 - Math.exp(-dt * 2.4));
        offsetNow.x += par.x * 0.16; offsetNow.y += par.y * 0.07;
      }
    }
    applyFrame(frames.exterior, offsetNow);
  } else {
    applyFrame(frames[view] || frames.shelf);
  }
  atmosphere(camera.position.z);
}

/* ------------------------------------------------------------------ atmosphere: warm light when passing the door */
const cO = { sky: new THREE.Color(), ground: new THREE.Color(), fog: new THREE.Color(), sun: new THREE.Color() };
const cI = { sky: new THREE.Color(), ground: new THREE.Color(), fog: new THREE.Color(), sun: new THREE.Color() };
let lastAtmoZ = null;
function atmosphere(z) {
  if (!hemi) return;
  const s = smooth(0.9, -1.2, z);                        /* 0 outside -> 1 inside */
  const bump = state === 'walking' && !reduceMotion ? Math.exp(-(((z - 0.0) / 0.8) ** 2)) : 0;   /* the threshold glow */
  renderer.toneMappingExposure = lerp(ATMO.o.exposure, ATMO.i.exposure, s) + 0.06 * bump;
  hemi.intensity = lerp(ATMO.o.hemi, ATMO.i.hemi, s) + 0.12 * bump;
  sun.intensity = lerp(ATMO.o.sun, ATMO.i.sun, s);
  sun.color.lerpColors(cO.sun, cI.sun, s);
  hemi.color.lerpColors(cO.sky, cI.sky, s); hemi.groundColor.lerpColors(cO.ground, cI.ground, s);
  if (scene.fog) { scene.fog.color.lerpColors(cO.fog, cI.fog, s); scene.fog.near = lerp(ATMO.o.fogNear, ATMO.i.fogNear, s); scene.fog.far = lerp(ATMO.o.fogFar, ATMO.i.fogFar, s); }
  warmth.style.opacity = bump > 0.002 ? (0.15 * bump).toFixed(3) : '0';
  if (z !== lastAtmoZ) { lastAtmoZ = z; dirty = true; }
  skyLock();
}
/* keep the warm horizon band of the sky gradient at eye level whatever the framing (screen-space background) */
const dirTmp = V();
function skyLock() {
  const bg = scene.background;
  if (!bg || !bg.isTexture || bg.isCubeTexture || bg.mapping !== THREE.UVMapping || (bg.userData && bg.userData.screenFit)) return;
  const dir = camera.getWorldDirection(dirTmp);
  const pitch = Math.asin(clamp(dir.y, -1, 1));
  const t = Math.tan(rad(camera.fov) / 2);
  const sy = camera.view && camera.view.enabled ? camera.view.offsetY / (H / 2) : 0;
  const yN = clamp(-Math.tan(pitch) / t + sy, -1.6, 0.9);   /* eye-level line in NDC */
  const f = (yN + 1) / 2;                                    /* from the bottom of the screen */
  bg.repeat.set(1, 1 / (1 - f + 0.04)); bg.offset.set(0, -(f - 0.04) / (1 - f + 0.04));
}

/* ------------------------------------------------------------------ state machine + UI */
function setUI(s) {
  if (uiState === s) return; uiState = s; body.dataset.state = s;
  canvas.classList.toggle('cat-hot', s === 'walking' || !!hoverObj);   /* during the walk a click skips ahead */
  extEl.inert = !(s === 'exterior' || s === 'fallback');
  shelfEl.inert = !(s === 'shelf' || s === 'fallback');
}
function setState(s) {
  state = s; setUI(s); dirty = true;
  /* the product photos load while the camera walks in, so the card row is ready at the shelf */
  if ((s === 'walking' || s === 'shelf') && !setState.eager) { setState.eager = true; rowEl.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; }); }
}
function goTo(name) {
  if (!scene) return;
  closePick(); setHover(null);
  walkFrozen = false;
  if (name === 'exterior' || name === 'start') { view = 'exterior'; setState('exterior'); }
  else if (name === 'shelf') { view = 'shelf'; setState('shelf'); }
  else if (name === 'door' || name === 'inside') { view = name; setState(name); }
  else { console.warn(`[haven3d] goTo: unknown view "${name}" (exterior | door | inside | shelf)`); return; }
  updateCamera(0);
  if (!running) renderOnce();
}
function walkAt(sec) {
  if (!scene) return;
  closePick(); setHover(null);
  walkT = clamp(+sec || 0, 0, WALK_DUR); walkFrozen = true; walkOffset0.set(0, 0, 0);
  setState('walking'); updateCamera(0);
  if (!running) renderOnce();
}
function startWalk() {
  if (state !== 'exterior' || cutting) return;
  bell();
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  if (reduceMotion) { cut(() => { goTo('shelf'); focusOpen(); }, 0.1, 0.15); return; }     /* 0.25 s cream crossfade */
  walkOffset0.copy(offsetNow); walkT = 0; walkFrozen = false; walkStartedAt = performance.now();
  setState('walking');
}
function finishWalk() { view = 'shelf'; setState('shelf'); walkFrozen = false; updateCamera(0); focusOpen(); }
function fastForward() { if (state !== 'walking' || cutting || walkFrozen) return; cut(finishWalk, 0.16, 0.3); }
function restart() { if (cutting) return; cut(() => { goTo('exterior'); $('#go').focus({ preventScroll: true }); }, reduceMotion ? 0.1 : 0.22, reduceMotion ? 0.15 : 0.4); }
function focusOpen() { setTimeout(() => { const o = $('#open'); if (o && !shelfEl.inert) o.focus({ preventScroll: true }); }, 40); }
function cut(fn, a, b) {
  cutting = true; clearTimeout(cutTimer);
  veil.style.transition = `opacity ${a}s ease`; veil.style.opacity = '1';
  cutTimer = setTimeout(() => {
    try { fn(); } finally {
      dirty = true; if (!running) renderOnce();
      veil.style.transition = `opacity ${b}s ease`; veil.style.opacity = '0';
      setTimeout(() => { cutting = false; }, b * 1000);
    }
  }, a * 1000 + 20);
}

/* ------------------------------------------------------------------ sound: a small shop-door bell made in the browser */
let soundOn = false, actx = null;
function toggleSound() {
  soundOn = !soundOn;
  sndBtn.setAttribute('aria-pressed', String(soundOn)); sndLabel.textContent = soundOn ? 'Sound off' : 'Sound on';
  if (soundOn) {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } }
    if (actx && actx.state === 'suspended') actx.resume().catch(() => {});
  }
}
function bell() {
  if (!soundOn || !actx) return;
  const t = actx.currentTime, parts = [[1568, 0.16], [2350, 0.09], [3140, 0.05], [3920, 0.03]];
  for (let r = 0; r < 2; r++) for (let i = 0; i < parts.length; i++) {
    const o = actx.createOscillator(), g = actx.createGain(), s = t + r * 0.16;
    o.type = 'sine'; o.frequency.value = parts[i][0] * (r ? 1.003 : 1);
    g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(parts[i][1], s + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, s + 1.4 - i * 0.2);
    o.connect(g); g.connect(actx.destination); o.start(s); o.stop(s + 1.5);
  }
}

/* ------------------------------------------------------------------ the card row ("On this shelf") */
function itemLink(kind, id) { return kind === 'book' ? LINK.book : kind === 'merlin' ? LINK.merlin : LINK.product(id); }
function buildRow() {
  const items = PRODUCTS.map(([id, name]) => ({ id, name, kind: 'product' })).concat([{ id: 'merlin', name: 'the real Merlin', kind: 'merlin' }]);
  const frag = document.createDocumentFragment();
  for (const it of items) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'prod' + (it.kind === 'merlin' ? ' merlin' : ''); a.href = itemLink(it.kind, it.id); a.dataset.id = it.id;
    const ph = document.createElement('span'); ph.className = 'prod-ph';
    const img = document.createElement('img');
    img.src = it.kind === 'merlin' ? MERLIN_PHOTO : PHOTO(it.id); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
    img.width = it.kind === 'merlin' ? 560 : 600; img.height = it.kind === 'merlin' ? 700 : 600;
    if (it.kind === 'merlin') img.style.objectPosition = '50% 30%';
    ph.appendChild(img);
    const nm = document.createElement('span'); nm.className = 'prod-name'; nm.textContent = it.name;
    const vw = document.createElement('span'); vw.className = 'prod-view'; vw.setAttribute('aria-hidden', 'true'); vw.textContent = 'View';
    a.append(ph, nm, vw);
    const lit = (on) => { litId = on ? it.id : (litId === it.id ? null : litId); dirty = true; };
    a.addEventListener('pointerenter', () => lit(true)); a.addEventListener('pointerleave', () => lit(false));
    a.addEventListener('focus', () => lit(true)); a.addEventListener('blur', () => lit(false));
    li.appendChild(a); frag.appendChild(li);
  }
  rowEl.appendChild(frag);
  rowEl.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || rowEl.scrollWidth <= rowEl.clientWidth + 2) return;
    rowEl.scrollLeft += e.deltaY; e.preventDefault();
  }, { passive: false });
}

/* ------------------------------------------------------------------ picking on the shelf */
const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2(), box = new THREE.Box3(), tmpV = V();
raycaster.layers.enableAll();   /* the real Merlin photo lives on the pristine layer 1 */
function pickRoot(o) { while (o && !(o.userData && o.userData.pick)) o = o.parent; return o; }
function pickAt(x, y) {
  if (!pickables.length) return null;
  const r = canvas.getBoundingClientRect();
  ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(pickables, true);
  for (const h of hits) { if (h.object.visible === false) continue; const p = pickRoot(h.object); if (p) return p; }
  return null;
}
function pickInfo(o) {
  const p = o.userData.pick || {};
  const kind = p.kind || 'product', id = p.id || '';
  const name = kind === 'merlin' ? 'the real Merlin' : (p.name || PRODUCT_NAME.get(id) || id);
  return { id, kind, name, href: itemLink(kind, id) };
}
function setHover(o) {
  if (hoverObj === o) return;
  hoverObj = o; dirty = true;
  canvas.classList.toggle('cat-hot', !!o);
  if (o) { const i = pickInfo(o); tipName.textContent = i.name; tipView.textContent = i.kind === 'book' ? 'Open the book' : 'View'; tip.classList.add('on'); }
  else tip.classList.remove('on');
}
function placeTip() {
  if (!hoverObj) return;
  box.setFromObject(hoverObj); box.getCenter(tmpV); tmpV.y = box.max.y; tmpV.z = box.max.z;
  tmpV.project(camera);
  const x = clamp((tmpV.x + 1) / 2 * W, 12 + 80, W - 12 - 80), y = clamp((1 - tmpV.y) / 2 * H, 70, H - 20);
  tip.style.left = x.toFixed(1) + 'px'; tip.style.top = y.toFixed(1) + 'px';
}
function navigate(href, x, y) {
  if (window.catHop && !reduceMotion) { window.catHop(x, y); setTimeout(() => { location.href = href; }, 300); }
  else location.href = href;
}
function bookCoverInto(o, el) {
  let src = null;
  o.traverse((m) => {
    if (src || !m.isMesh) return;
    for (const mat of [].concat(m.material)) { const img = mat && mat.map && mat.map.image; if (img && img.width >= 256 && img.height >= 256) { src = img; break; } }
  });
  if (!src) return false;
  const c = document.createElement('canvas'); c.width = c.height = 152;
  try { c.getContext('2d').drawImage(src, 0, 0, 152, 152); } catch (e) { return false; }
  el.appendChild(c); return true;
}
function openPick(o) {
  const i = pickInfo(o);
  pickObj = o; dirty = true;
  pickMedia.textContent = '';
  if (i.kind === 'book') { bookCoverInto(o, pickMedia); }
  else {
    const img = document.createElement('img');
    img.src = i.kind === 'merlin' ? MERLIN_PHOTO : PHOTO(i.id); img.alt = ''; img.width = 152; img.height = 152; img.decoding = 'async';
    if (i.kind === 'merlin') img.style.objectPosition = '50% 30%';
    pickMedia.appendChild(img);
  }
  pickName.textContent = i.name;
  pickLink.href = i.href; pickLinkText.textContent = i.kind === 'book' ? 'Open the book' : 'View';
  pickEl.hidden = false;
  requestAnimationFrame(() => pickEl.classList.add('on'));
}
function closePick() {
  if (!pickObj && pickEl.hidden) return;
  pickObj = null; dirty = true;
  pickEl.classList.remove('on');
  setTimeout(() => { if (!pickObj) pickEl.hidden = true; }, 220);
}
/* the open door is a doorway too: hover shows the kitten pointer, a click or tap steps inside */
const doorA = V(), doorB = V();
function inDoor(x, y) {
  if (state !== 'exterior' || !camera) return false;
  const d = anchors.ext.door, cx = d ? d.x : 0;
  doorA.set(cx - DOOR.x, 0, 0.05).project(camera); doorB.set(cx + DOOR.x, DOOR.h, 0.05).project(camera);
  const x0 = (doorA.x + 1) / 2 * W, x1 = (doorB.x + 1) / 2 * W, y0 = (1 - doorA.y) / 2 * H, y1 = (1 - doorB.y) / 2 * H;
  return x >= Math.min(x0, x1) && x <= Math.max(x0, x1) && y >= Math.min(y0, y1) && y <= Math.max(y0, y1);
}
let downAt = null;
function onPointerDown(e) { downAt = { x: e.clientX, y: e.clientY, t: performance.now(), type: e.pointerType }; }
function onPointerUp(e) {
  const d = downAt; downAt = null;
  if (state === 'walking') return;                          /* handled by the fast-forward listener */
  if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 12 || performance.now() - d.t > 700) return;
  if (state === 'exterior' && !cutting && (e.pointerType !== 'mouse' || e.button === 0) && inDoor(e.clientX, e.clientY)) { startWalk(); return; }
  if (state !== 'shelf' || cutting) return;
  const o = pickAt(e.clientX, e.clientY);
  if (e.pointerType === 'mouse') {
    if (e.button !== 0) return;
    if (o) navigate(pickInfo(o).href, e.clientX, e.clientY);
    return;
  }
  /* touch / pen: first tap shows the card, a second tap on the same piece opens it */
  if (!o) { closePick(); return; }
  if (pickObj === o) { navigate(pickInfo(o).href, e.clientX, e.clientY); return; }
  openPick(o);
}
function onPointerMove(e) {
  if (e.pointerType === 'mouse') {
    parTarget.set((e.clientX / W) * 2 - 1, -((e.clientY / H) * 2 - 1));
    pointerXY.x = e.clientX; pointerXY.y = e.clientY; pointerMoved = true;
  }
}
function updateHover(dt) {
  if (pointerMoved && finePointer) {
    pointerMoved = false;
    setHover(state === 'shelf' && !cutting ? pickAt(pointerXY.x, pointerXY.y) : null);
    if (state === 'exterior') canvas.classList.toggle('cat-hot', inDoor(pointerXY.x, pointerXY.y));
  }
  let active = false;
  const k = 1 - Math.exp(-dt * (reduceMotion ? 30 : 13));
  for (const o of pickables) {
    const id = o.userData.pick && o.userData.pick.id;
    const want = state === 'shelf' && (o === hoverObj || o === pickObj || (litId && id === litId)) ? 1 : 0;
    let h = o.userData.__hv;
    if (!h) { if (!want) continue; h = o.userData.__hv = { a: 0, y: o.position.y, s: o.scale.clone() }; }
    h.a += (want - h.a) * (dt > 0 ? k : 1);
    if (Math.abs(want - h.a) < 0.002) h.a = want;
    o.position.y = h.y + 0.028 * h.a;
    o.scale.copy(h.s).multiplyScalar(1 + 0.06 * h.a);
    if (h.a !== want) active = true;
    if (h.a === 0 && !want) { o.position.y = h.y; o.scale.copy(h.s); delete o.userData.__hv; }
  }
  if (hoverObj) placeTip();
  return active;
}

/* ------------------------------------------------------------------ module loading (real modules, else stubs) */
async function tryImport(path, fn, label) {
  try {
    const m = await import(path);
    if (typeof m[fn] !== 'function') throw new Error(`no export ${fn}()`);
    return m;
  } catch (e) {
    console.warn(`[haven3d] ${label}: could not use ${path} (${(e && e.message) || e}). Falling back to the stub so the page still renders.`);
    return null;
  }
}
async function loadModules() {
  const stubbed = Object.keys(STUB).filter((k) => STUB[k]);
  if (stubbed.length) console.info(`[haven3d] ?stub: using stubs for ${stubbed.join(', ')}`);
  const [tex, props, ext, int] = await Promise.all([
    STUB.lib ? null : tryImport('./textures.js', 'makeTextures', 'textures'),
    STUB.lib ? null : tryImport('./props.js', 'makeProps', 'props'),
    STUB.ext ? null : tryImport('./exterior.js', 'buildExterior', 'exterior'),
    STUB.int ? null : tryImport('./interior.js', 'buildInterior', 'interior'),
  ]);
  const stubLib = await import('./_stub-lib.js');   /* small; also the fallback if a real builder throws */
  return { tex, props, ext, int, stubLib };
}
function attempt(label, real, stub) {
  if (real) {
    try { return real(); } catch (e) { console.warn(`[haven3d] ${label} threw (${(e && e.message) || e}); using the stub instead.`, e); }
  }
  return stub();
}

/* ------------------------------------------------------------------ scene */
function measureScene(extGroup) {
  /* the sign: the mesh named signFace, else the mesh whose map is the 1024x340 sign face */
  let signMesh = extGroup.getObjectByName('signFace');
  if (signMesh && !signMesh.isMesh) signMesh = null;
  extGroup.traverse((o) => {
    if (signMesh || !o.isMesh) return;
    for (const m of [].concat(o.material)) { const img = m && m.map && m.map.image; if (img && img.width === 1024 && img.height === 340) { signMesh = o; break; } }
  });
  let center = (anchors.ext.signCenter && anchors.ext.signCenter.clone()) || V(0, 3.38, 0.07), width = +anchors.ext.signWidth || 3.4;
  if (signMesh) { box.setFromObject(signMesh); box.getCenter(center); width = box.max.x - box.min.x; center.z = box.max.z; }
  const lw = width * LOGO_FRAC;
  sign = { center, width, logoL: center.clone().add(V(-lw / 2, 0, 0)), logoR: center.clone().add(V(lw / 2, 0, 0)), mesh: signMesh };
  /* the roof line: tops of meshes over the house footprint above the eaves (keeps the roof, dormers and chimney in the
     first view); anchors.ext.roofPts (Vector3[]) wins when the exterior gives it */
  if (Array.isArray(anchors.ext.roofPts) && anchors.ext.roofPts.length && anchors.ext.roofPts.every((p) => p && p.isVector3)) { roofPts = anchors.ext.roofPts.map((p) => p.clone()); return; }
  const pts = [], XM = HOUSE.x + 0.6;
  extGroup.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || !o.geometry) return;
    box.setFromObject(o);
    if (box.isEmpty() || box.max.y < HOUSE.eaves + 0.3 || box.max.y > HOUSE.ridge + 1.6) return;
    if (box.max.x - box.min.x > 2 * XM + 1 || box.max.z - box.min.z > -HOUSE.zBack + 2) return;      /* merged ground/garden batches */
    const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;
    if (Math.abs(cx) > XM || cz > 1.0 || cz < HOUSE.zBack - 0.6) return;
    const y = Math.min(box.max.y, HOUSE.ridge + 0.9), zf = Math.min(box.max.z, 0.6);
    pts.push(V(cx, y, zf), V(Math.max(box.min.x, -XM), y, zf), V(Math.min(box.max.x, XM), y, zf), V(cx, y, cz));
  });
  roofPts = pts.length ? pts : null;
}
/* the pristine layer: the sign face and the real Merlin photo (and the embroidered cover if a builder asks for it) go
   on layer 1, which the paint never touches. Builders set mesh.layers.set(1) themselves; this is the safety net that
   finds them by their textures. Multi-material meshes cannot be split, so they are reported instead. */
function markPristine(root) {
  /* the embroidered title on the fabric book is the one other place words live in the scene: the paint would smear
     it, so a crisp, unlit copy of the cover face sits a hair in front of the board (props' fabricBook keeps the cover
     on a multi-material box, which cannot go on its own layer). Opt out with anchors.int.paintCover = true. */
  let coverSrc = null; try { coverSrc = T.embroideredCover().source; } catch (e) { /* stub library */ }
  if (coverSrc && !anchors.int.paintCover) root.traverse((front) => {
    if (!front.isMesh || !Array.isArray(front.material) || front.userData.wcCoverCopy || front.name === 'bookCover') return;
    const cm = front.material.find((m) => m && m.map && m.map.source === coverSrc);
    if (!cm) return;
    front.geometry.computeBoundingBox();
    const bb = front.geometry.boundingBox, w = bb.max.x - bb.min.x, h = bb.max.y - bb.min.y;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.985, h * 0.985), new THREE.MeshBasicMaterial({ map: cm.map, color: new THREE.Color(0.93, 0.92, 0.9), toneMapped: false }));
    face.position.set((bb.max.x + bb.min.x) / 2, (bb.max.y + bb.min.y) / 2, bb.max.z + 0.0008);
    face.name = 'bookCover'; face.layers.set(1); face.raycast = () => {};
    front.add(face); front.userData.wcCoverCopy = face;
  });
  const srcs = new Set();
  try { srcs.add(T.signFace().source); srcs.add(T.merlinPhoto().source); } catch (e) { /* stub library */ }
  const found = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    const mats = [].concat(o.material), hit = mats.some((m) => m && m.map && srcs.has(m.map.source));
    if (o.name === 'signFace' || hit) {
      if (Array.isArray(o.material) && o.material.length > 1) { if (!o.layers.isEnabled(1)) console.warn(`[haven3d] pristine texture on a multi-material mesh "${o.name}": give it its own mesh so the paint can skip it`); return; }
      o.layers.set(1); found.push(o.name || o.parent?.name || 'mesh');
    }
  });
  if (wc) wc.refreshPristine(scene);
  return found;
}
function setupLights() {
  hemi = new THREE.HemisphereLight(ATMO.o.sky, ATMO.o.ground, ATMO.o.hemi);
  scene.add(hemi);
  sun = new THREE.DirectionalLight(ATMO.o.sunColor, ATMO.o.sun);
  /* a low golden-hour sun from the front left: long soft shadows across the pavement, the facade warmly lit */
  const target = V(0, 0.5, -2.2), dir = V(-0.56, 0.47, 0.68).normalize();
  sun.position.copy(target).addScaledVector(dir, 26); sun.target.position.copy(target);
  scene.add(sun, sun.target);
  const sc = sun.shadow.camera;
  sc.left = -9.5; sc.right = 9.5; sc.top = 8.5; sc.bottom = -7.5; sc.near = 4; sc.far = 52; sc.updateProjectionMatrix();
  sun.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 4;
  setShadows(quality === 'high', true);
  cO.sky.set(ATMO.o.sky); cO.ground.set(ATMO.o.ground); cI.sky.set(ATMO.i.sky); cI.ground.set(ATMO.i.ground); cI.fog.set(ATMO.i.fog);
  cO.sun.set(ATMO.o.sunColor); cI.sun.set('#FFD9B0');
}
function setShadows(on, initial) {
  renderer.shadowMap.enabled = on; sun.castShadow = on;
  if (!initial && scene) scene.traverse((o) => { if (o.material) for (const m of [].concat(o.material)) m.needsUpdate = true; });
  dirty = true;
}
function setupFog() {
  /* warm haze matching the low band of the golden-hour sky (no pixel read-back: that stalls some GPUs) */
  const c = new THREE.Color('#F2DDCB');
  cO.fog.copy(c);
  scene.fog = new THREE.Fog(c.clone(), ATMO.o.fogNear, ATMO.o.fogFar);
}

/* ------------------------------------------------------------------ adaptive quality */
const adapt = { on: !FORCED_Q, start: 0, samples: [], step: 0 };
function adaptTick(now, dtMs) {
  if (!adapt.on || !firstFrame || document.hidden) return;
  if (!adapt.start) { adapt.start = now; return; }
  const since = now - adapt.start;
  if (since > 400 && dtMs < 1500) adapt.samples.push(dtMs);   /* skip only real stalls (tab switch, alert) */
  if (since < 2400 || (adapt.samples.length < 8 && since < 7000)) return;
  if (state === 'walking' || cutting) return;      /* never switch quality (a shader recompile) in the middle of the walk */
  const s = adapt.samples.sort((a, b) => a - b), med = s.length ? s[Math.floor(s.length / 2)] : 16;
  adapt.samples = []; adapt.start = now;
  if (med <= 21.5) { adapt.on = false; return; }               /* ~46 fps or better: keep what we have */
  const steps = [
    () => { if (pixelRatio <= 1.01) return false; pixelRatio = Math.max(1, Math.round(pixelRatio * 0.75 * 100) / 100); queueLayout(); return true; },
    () => { if (paintQ === 'low' || !wc) return false; paintQ = 'low'; wc.setQuality('low'); dirty = true; return true; },   /* half-res R3 paint */
    () => { if (!renderer.shadowMap.enabled) return false; quality = 'low'; setShadows(false); return true; },
    () => { if (pixelRatio <= 1.01) return false; pixelRatio = 1; queueLayout(); return true; },
  ];
  while (adapt.step < steps.length) { if (steps[adapt.step++]()) return; }
  adapt.on = false;
}

/* ------------------------------------------------------------------ frame loop */
let tickCount = 0;
function frame(now) {
  rafId = requestAnimationFrame(frame);
  const dtMs = lastNow ? now - lastNow : 16.7; lastNow = now;
  const dt = clamp(dtMs / 1000, 0, 0.1);
  fpsEMA = lerp(fpsEMA, clamp(dtMs / 1000, 0.001, 0.5), 0.06);
  clockT += dt;
  adaptTick(now, dtMs);
  if (state === 'walking' && !walkFrozen) {
    /* time-based: the walk takes WALK_DUR seconds of real time whatever the frame rate (a hidden tab stops the loop and
       start() resets the frame clock, so time away is not counted) */
    walkT += Math.max(0, dtMs) / 1000;
    if (walkT >= WALK_DUR - 0.5) setUI('shelf');
    if (walkT >= WALK_DUR) { walkT = WALK_DUR; finishWalk(); }
  }
  updateCamera(dt);
  const hovering = updateHover(dt);
  const tA = DEBUG.t !== null ? DEBUG.t : reduceMotion ? 1.5 : clockT, dA = DEBUG.t !== null || reduceMotion ? 0 : dt;
  const camZ = camera.position.z;
  if (EXTB && EXTB.update && !updateBroken.ext && camZ > EXT_UPDATE_Z) guardedUpdate('ext', EXTB, tA, dA);
  if (INTB && INTB.update && !updateBroken.int) guardedUpdate('int', INTB, tA, dA);
  const still = reduceMotion && state !== 'walking' && !hovering && !dirty && !cutting;
  if (!still) render(camZ, tA);
  if (DEBUG.stats && (tickCount++ % 15 === 0)) drawStats();
}
function guardedUpdate(key, mod, t, dt) {
  try { mod.update(t, dt); } catch (e) { updateBroken[key] = true; console.warn(`[haven3d] ${key} update() threw; it is switched off for this visit.`, e); }
}
/* interior shadow casters only matter once the visitor is at the door (from the street the room is seen through glass) */
const EXT_UPDATE_Z = -1.7;   /* deeper inside, the street is behind the camera: its animation and shadow redraws pause */
let intCasters = null, intCastOn = true;
function shadowCasters(camZ) {
  if (!intCasters) { intCasters = []; if (INTB && INTB.group) INTB.group.traverse((o) => { if (o.isMesh && o.castShadow) intCasters.push(o); }); }
  const on = camZ < 1.2;
  if (on === intCastOn) return;
  intCastOn = on; for (const o of intCasters) o.castShadow = on;
}
/* At the threshold (the camera close to the door, looking in), the house front fills the whole view: the far scenery
   and the side gardens are hidden behind it, so they are skipped (≈ 15k triangles and their shadow draws). Inside, the
   exterior's own rule hides everything but the shell; this only covers the street side of the door. */
const THRESH_RE = /^ext-far|^ext-farBack|:garden$/;
let threshList = null, threshOn = false;
const threshDir = V();
function thresholdCull() {
  if (!EXTB || !EXTB.group) return;
  if (!threshList) { threshList = []; EXTB.group.traverse((o) => { if (o.isMesh && THRESH_RE.test(o.name || '')) threshList.push(o); }); }
  const p = camera.position; camera.getWorldDirection(threshDir);
  const inside = p.z < -0.55 && threshDir.z < -0.3;
  const want = !inside && p.z < 4.3 && threshDir.z < -0.5 && Math.abs(p.x) < 1.2;
  if (want === threshOn) return;
  threshOn = want;
  if (!inside) for (const o of threshList) o.visible = !want;
}
function render(camZ = camera.position.z, t = DEBUG.t !== null ? DEBUG.t : clockT) {
  thresholdCull();
  /* the sun's shadow map is redrawn every frame outside (animals move); inside it is static, so rarely */
  if (renderer.shadowMap.enabled) { shadowCasters(camZ); renderer.shadowMap.needsUpdate = camZ > EXT_UPDATE_Z || frameNo % 45 === 0; }
  renderer.info.reset();                     /* one frame = scene + paint passes + pristine layer: count them all */
  wc.render(scene, camera, t);
  frameNo++; dirty = false;
  lastCalls = renderer.info.render.calls; lastTris = renderer.info.render.triangles;
}
function renderOnce() { if (!renderer || !scene) return; updateCamera(0); updateHover(0); render(); }
function start() { if (running) return; running = true; lastNow = 0; rafId = requestAnimationFrame(frame); }
function stop() { running = false; cancelAnimationFrame(rafId); }
function drawStats() {
  const i = info();
  statsEl.hidden = false;
  statsEl.textContent = `fps ${i.fpsEstimate}  calls ${i.calls}  tris ${(i.triangles / 1000).toFixed(1)}k\n` +
    `tex ${i.textures}  geo ${i.geometries}  q ${i.quality}/${i.paint.quality}  pr ${i.pixelRatio}\n` +
    `paint ${i.paint.enabled ? i.paint.paintRes.join('x') + ' of ' + i.paint.drawingBuffer.join('x') : 'off'}\nstate ${i.state}  logo ${i.logoPx}px  lights ${i.lights}`;
}
function logoPx() {
  if (!sign || !camera) return 0;
  const a = sign.logoL.clone().project(camera), b = sign.logoR.clone().project(camera);
  return Math.round(Math.abs(b.x - a.x) / 2 * W);
}
function info() {
  let lights = 0;
  if (scene) scene.traverse((o) => { if (o.isLight && o.visible) lights++; });
  return {
    calls: lastCalls, triangles: lastTris,
    textures: renderer ? renderer.info.memory.textures : 0, geometries: renderer ? renderer.info.memory.geometries : 0,
    quality, pixelRatio, fpsEstimate: Math.round((1 / fpsEMA) * 10) / 10,
    state, view, logoPx: logoPx(), signWidth: sign ? +sign.width.toFixed(2) : null, lights,
    stubs: { ...STUB, ...usedStubs }, paint: wc ? wc.info() : null, pristine: pristineFound,
  };
}
const usedStubs = {};
let pristineFound = [];

/* ------------------------------------------------------------------ fallback (no WebGL) */
function fallback(reason) {
  console.info(`[haven3d] showing the no-WebGL fallback (${reason}).`);
  html.classList.add('no-webgl'); html.classList.remove('lay-sheet');
  state = 'fallback'; setUI('fallback');
  /* the real logo on cream; the exterior poster replaces it if assets/poster-exterior.webp exists */
  const top = document.createElement('div'); top.className = 'fb-logo'; top.setAttribute('aria-hidden', 'true');
  const logo = new Image(); logo.alt = ''; logo.width = 360; logo.height = 119; logo.src = '../site/assets/brand/logo-flat.png';
  top.appendChild(logo); body.insertBefore(top, $('#ui'));
  const img = new Image(); img.alt = ''; img.decoding = 'async';
  img.onload = () => { const poster = document.createElement('div'); poster.className = 'poster'; poster.setAttribute('aria-hidden', 'true'); poster.appendChild(img); top.replaceWith(poster); };
  img.src = 'assets/poster-exterior.webp';
  /* the shelf as it looks at the end of the walk, above the "On this shelf" card */
  const shelfImg = new Image(); shelfImg.alt = ''; shelfImg.decoding = 'async';
  shelfImg.onload = () => { const p = document.createElement('div'); p.className = 'poster poster-shelf'; p.setAttribute('aria-hidden', 'true'); p.appendChild(shelfImg); shelfEl.before(p); };
  shelfImg.src = 'assets/poster-shelf.webp';
  loader.classList.add('done');
  readyResolve({ fallback: true });
}
function webglAvailable() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

/* ------------------------------------------------------------------ wiring */
function wire() {
  $('#go').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state === 'fallback') { shelfEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); focusOpen(); return; }
    startWalk();
  });
  $('#again').addEventListener('click', restart);
  sndBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSound(); });
  $('#pick-x').addEventListener('click', closePick);
  /* tap / click / Esc during the walk: skip ahead to the shelf */
  document.addEventListener('pointerup', (e) => {
    if (state !== 'walking' || walkFrozen || performance.now() - walkStartedAt < 350) return;
    if (e.target && e.target.closest && e.target.closest('.snd')) return;
    fastForward();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (state === 'walking') fastForward(); else if (pickObj) closePick();
  });
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointerleave', () => { if (finePointer) { setHover(null); parTarget.set(0, 0); } });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', queueLayout);
  window.addEventListener('orientationchange', queueLayout);
  if (window.ResizeObserver) { const ro = new ResizeObserver(queueLayout); ro.observe(extEl); ro.observe(shelfEl); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueLayout);
  document.addEventListener('visibilitychange', () => {
    if (!renderer || !firstFrame) return;
    if (document.hidden) { stop(); if (actx && actx.state === 'running') actx.suspend().catch(() => {}); }
    else { start(); if (soundOn && actx) actx.resume().catch(() => {}); }
  });
  const onMQ = () => { reduceMotion = mqReduce.matches; html.classList.toggle('calm', reduceMotion); if (wc) wc.setReduceMotion(reduceMotion); dirty = true; };
  if (mqReduce.addEventListener) mqReduce.addEventListener('change', onMQ); else if (mqReduce.addListener) mqReduce.addListener(onMQ);
}

/* ------------------------------------------------------------------ boot */
async function boot() {
  buildRow(); wire();
  html.classList.toggle('calm', reduceMotion);
  if (DEBUG.nogl || !webglAvailable()) return fallback(DEBUG.nogl ? '?nogl=1' : 'WebGL is not available');
  try {
    /* no MSAA: the paint (Kuwahara + soft pencil lines) is the antialiasing; ?paint=0 keeps MSAA for a fair plain view */
    renderer = new THREE.WebGLRenderer({ canvas, antialias: DEBUG.paint === '0', powerPreference: 'high-performance', alpha: false, stencil: false });
  } catch (e) { return fallback('the WebGL renderer could not start'); }
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); console.warn('[haven3d] WebGL context lost; paused.'); });
  canvas.addEventListener('webglcontextrestored', () => { location.reload(); });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  /* used only by ?paint=0 (plain view); with the paint, the scene renders linear into a half-float target and the paint
     applies the same filmic curve once, so the colour is identical up to the paint itself */
  renderer.toneMapping = DEBUG.tm === 'agx' ? THREE.AgXToneMapping : DEBUG.tm === 'neutral' ? THREE.NeutralToneMapping : THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = ATMO.o.exposure;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.setPixelRatio(pixelRatio);
  W = canvas.clientWidth || innerWidth; H = canvas.clientHeight || innerHeight;
  renderer.setSize(W, H, false);
  wc = createWatercolor(renderer, { quality: paintQ, reduceMotion });
  if (DEBUG.paint) wc.debug(DEBUG.paint);
  if (Q.get('look')) { try { wc.setLook(JSON.parse(Q.get('look'))); } catch (e) { console.warn('[haven3d] ?look is not JSON', e); } }   /* dev: tune the paint */
  wc.setSize(W, H, pixelRatio);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, W / H, 0.06, 420);
  setupLights();

  const mods = await loadModules();
  const S = mods.stubLib;
  T = attempt('makeTextures', mods.tex && (() => mods.tex.makeTextures(THREE, renderer)), () => { usedStubs.lib = true; return S.makeTextures(THREE, renderer); });
  P = attempt('makeProps', mods.props && (() => mods.props.makeProps(THREE, T)), () => { usedStubs.lib = true; return S.makeProps(THREE, T); });

  try { scene.background = T.sky(); } catch (e) { scene.background = null; }
  if (!scene.background) scene.background = new THREE.Color('#F2DCCB');
  else if (scene.background.isTexture && scene.background.wrapT !== THREE.ClampToEdgeWrapping && !(scene.background.userData && scene.background.userData.screenFit)) {
    scene.background.wrapT = THREE.ClampToEdgeWrapping; scene.background.needsUpdate = true;
  }
  setupFog();
  try {
    const pm = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
    scene.environment = pm.fromScene(room, 0.04).texture; scene.environmentIntensity = 0.24;
    room.dispose(); pm.dispose();
  } catch (e) { console.warn('[haven3d] environment fill skipped', e); }

  const ctx = { T, P, quality, reduceMotion, renderer };
  const stubExt = async () => (await import('./_stub-exterior.js')).buildExterior(THREE, ctx);
  const stubInt = async () => (await import('./_stub-interior.js')).buildInterior(THREE, ctx);
  EXTB = mods.ext ? attempt('buildExterior', () => mods.ext.buildExterior(THREE, ctx), () => null) : null;
  if (!EXTB) { usedStubs.ext = true; EXTB = await stubExt(); }
  INTB = mods.int ? attempt('buildInterior', () => mods.int.buildInterior(THREE, ctx), () => null) : null;
  if (!INTB) { usedStubs.int = true; INTB = await stubInt(); }
  for (const b of [EXTB, INTB]) {
    if (b.group) scene.add(b.group);
    for (const l of b.lights || []) if (l && !l.parent) scene.add(l);
  }
  anchors.ext = EXTB.anchors || {}; anchors.int = INTB.anchors || {};
  if (anchors.int.shelfView && !(anchors.int.shelfView.pos && anchors.int.shelfView.look)) anchors.int.shelfView = null;
  pickables = (INTB.pickables || []).filter((o) => o && o.userData && o.userData.pick);
  /* inside, the glows (fairy lights, lamp halos) sit close to the pieces on the display: they take a calmer share of
     the paint's glow gain so they warm the room without washing the black crochet cat to grey */
  if (INTB.group) INTB.group.traverse((o) => { for (const m of [].concat(o.material || [])) if (m && m.blending === THREE.AdditiveBlending && m.userData.wcGlowK === undefined) m.userData.wcGlowK = 0.3; });
  scene.updateMatrixWorld(true);
  measureScene(EXTB.group || new THREE.Group());
  pristineFound = markPristine(scene);

  layout();
  view = 'exterior'; setState('loading');
  updateCamera(0);

  await Promise.race([Promise.resolve(T.ready).catch(() => {}), new Promise((r) => setTimeout(r, 9000))]);
  pristineFound = markPristine(scene);   /* again: the photo texture clones only gain their image source now */
  try {
    /* compile for the paint's linear half-float scene target (the programs differ from the canvas ones) */
    renderer.setRenderTarget(wc.enabled ? wc.targets.scene : null);
    if (renderer.compileAsync && renderer.extensions.has('KHR_parallel_shader_compile')) await Promise.race([renderer.compileAsync(scene, camera), new Promise((r) => setTimeout(r, 6000))]);
    else renderer.compile(scene, camera);
  } catch (e) { /* compiles on first render */ }
  renderer.setRenderTarget(null);

  layout();
  if (DEBUG.walk !== null) walkAt(DEBUG.walk);
  else if (DEBUG.view) goTo(DEBUG.view === 'start' ? 'exterior' : DEBUG.view);
  else goTo('exterior');
  renderer.shadowMap.needsUpdate = true;
  render();
  firstFrame = true;
  loader.classList.add('done');
  start();
  readyResolve({ fallback: false });
}

window.__haven = {
  get renderer() { return renderer; }, get scene() { return scene; }, get camera() { return camera; },
  get state() { return state; }, get view() { return view; }, get frames() { return frames; },
  get pickables() { return pickables; }, get quality() { return quality; }, get walkKeys() { return walk && walk.keys; },
  goTo, walkAt, info, ready, fastForward, startWalk: () => startWalk(), restart,
  /* capture hook (tests, frame-stepped video): pause the live loop and draw one frame with the walk at `walk` seconds
     (omit it to stay in the current view) and the animation clock at `anim`; `dt` is the step for eased hover/drift.
     resume() restarts the live loop. Never used by the page itself. */
  renderAt(o = {}) {
    if (!scene) return;
    stop();
    const dt = o.dt ?? 1 / 30;
    if (o.anim != null) clockT = o.anim;
    if (o.walk != null) {
      if (state !== 'walking') { closePick(); setHover(null); walkOffset0.copy(offsetNow); setState('walking'); }
      walkFrozen = true; walkT = clamp(+o.walk || 0, 0, WALK_DUR);
      if (walkT >= WALK_DUR - 0.5) setUI('shelf');
    }
    updateCamera(dt);
    const camZ = camera.position.z, tA = reduceMotion ? 1.5 : clockT;
    updateHover(dt);
    if (EXTB && EXTB.update && !updateBroken.ext && camZ > EXT_UPDATE_Z) guardedUpdate('ext', EXTB, tA, dt);
    if (INTB && INTB.update && !updateBroken.int) guardedUpdate('int', INTB, tA, dt);
    render(camZ, tA);
  },
  /* posters / screenshots: draw one painted frame now (call toDataURL in the same task); paint: the watercolour API */
  renderNow() { if (!scene) return; updateCamera(0); render(); },
  get paint() { return wc; },
  /* tests: what the framing sees (roof line, sign, screen rects, builder anchors) */
  get dbg() { return { roofPts, sign, rects, anchors, card: window.__dbgCard }; },
  resume() { walkFrozen = false; start(); },
  /* tests: CSS-px screen position of a pickable (by id), for hover/tap checks */
  screenOf(id) {
    const o = pickables.find((p) => p.userData.pick.id === id); if (!o) return null;
    box.setFromObject(o); box.getCenter(tmpV); tmpV.project(camera);
    return { x: (tmpV.x + 1) / 2 * W, y: (1 - tmpV.y) / 2 * H };
  },
};

boot().catch((e) => {
  console.warn('[haven3d] start-up failed; showing the fallback.', e);
  try { stop(); } catch (_) { /* ignore */ }
  fallback('start-up error');
});
