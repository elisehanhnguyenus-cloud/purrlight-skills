/* Haven 3D v3 — page shell + camera for "Merlin's Purrfect Haven" (PREVIEW 07/11, Purrlight Studio).
   Owns: renderer, sky, fog, hemisphere + sun, soft environment fill, adaptive quality, the watercolour + pencil paint
   (js/watercolor.js: every frame goes through it; tone mapping happens once, inside the paint), the pristine layer
   (sign face + real Merlin photo on layer 1, never painted), the camera (views, the walk in, framing per screen) for the
   v2 half-size cottage shop, the state machine exterior -> walking -> shelf, picking on the round display, the HTML
   overlay, loading screen, no-WebGL fallback, reduced motion, sound, debug hooks and window.__haven.
   v3 (owner requests 07/11 #2): two ways in.
   - "look" (desktop, tablets): a slower look-around after the door, about 14-15 s: a calm pause, a slow pan left over the
     bookcases and the reading corner, a slow pan right over the vintage shelves, the suitcase and the round café counter,
     a gentle look up at the chandelier and the fairy lights, then a glide to the round display. Head turns are
     rest-to-rest with smoothed trapezoid speed, capped at 20 deg/s; the walk length follows from the angles.
   - "door" (phones: coarse pointer on a small screen, or a narrow portrait window): the first view is framed on the
     shopfront door (sign, open doorway, Maine Coon, bowl); Step inside goes straight through the doorway to the round
     display in about 4.6 s, with a warm bloom at the threshold and no glances.
   Both: a small skip control during the walk (tap/click/Esc also skip), focus lands on "Open the book".
   Scene content comes from textures.js / props.js / exterior.js / interior.js (stubs: _stub-*.js). */

import * as THREE from '../vendor/three.module.min.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';
import * as WC from './watercolor.js';
const { createWatercolor } = WC;

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
/* the walk (v3). look = desktop/tablet look-around, door = phones, straight through the doorway */
const WALK = {
  look: { approach: 3.2, door: V(0.12, 1.6, -0.82), pause: 0.4, vmax: rad(19.5), ramp: 0.5, maxDur: 14.9 },
  door: { dur: 4.6 },
};
let WALK_DUR = 6.0;                    /* set by buildWalk for the current screen and flow */
const GLANCE = { cafe: V(2.65, 1.25, -2.65), gift: V(-3.9, 1.3, -3.3), lantern: V(0, 3.05, -4.6) };
/* phones: the first view is framed on the shopfront door (sign + open doorway + the Maine Coon + the bowl) */
const EXT_DOOR = { tall: { pos: V(0, 1.72, 7.4), look: V(0, 2.2, 0) }, short: { pos: V(0, 1.7, 7.6), look: V(0, 2.05, 0) } };
/* when the camera zooms in for the logo, at least this much roof stays in view: the whole roof front with its dormers
   on wide screens, the eaves and the dormer windows on phones (where the sign matters most) */
const ROOF_KEEP = { wide: V(0, 8.15, -1.9), phone: V(0, 7.25, 0.1), short: V(0, 5.6, 0.4) };   /* short: phones on their side */
const LOGO_FRAC = 0.8;                /* share of the sign face the logo covers (T.signFace draws it at >= 78%) */
const LOGO_MIN = { desktop: 260, phone: 170 };
const LOGO_INK = 0.983;               /* the logo's lettering spans 354 of the image's 360 px: size by the ink, not the margin */

/* light + atmosphere outside (o) and inside (i); blended by camera z when passing the door. Tuned for the watercolour:
   a soft golden key, a lavender sky fill so the shade reads lilac (never grey), a warm ground bounce, low contrast;
   inside, a warm lamp-lit room. */
/* v3 (art review #7, #11): late golden hour outside so the lit windows pop amber against a slightly deeper house; inside,
   a warmer, dimmer lamp-lit room (the baked light field carries the pools of lamplight) */
const ATMO = {
  o: { exposure: 0.96, hemi: 1.25, sun: 1.85, fogNear: 19, fogFar: 72, sky: '#E4DDF0', ground: '#EBCDAA', sunColor: '#FFC48C' },
  i: { exposure: 0.93, hemi: 0.62, sun: 0.5, fogNear: 12, fogFar: 46, sky: '#FFD9B0', ground: '#DDBB96', fog: '#F2E1CC' },
};
/* the paint at the round display: more detail back, crisper, lighter pigment pooling so the crochet pieces read (art
   review #4); eased in over the end of the walk and restored when leaving */
const SHELF_LOOK = { detail: 0.55, sharp: 900, edge: 2.4, ...((WC.LOOK_PRESETS && WC.LOOK_PRESETS.shelf) || {}) };   /* the paint's own preset wins */

/* ------------------------------------------------------------------ DOM */
const $ = (s) => document.querySelector(s);
const html = document.documentElement, body = document.body;
const canvas = $('#scene'), veil = $('#veil'), warmth = $('#warmth'), loader = $('#loader');
const extEl = $('#ext'), shelfEl = $('#shelf'), rowEl = $('#row');
const tip = $('#tip'), tipName = $('#tip-name'), tipView = $('#tip-view');
const pickEl = $('#pick'), pickMedia = $('#pick-media'), pickName = $('#pick-name'), pickLink = $('#pick-link'), pickLinkText = $('#pick-link-text');
const sndBtn = $('#snd'), sndLabel = $('#snd-label'), statsEl = $('#stats');
const skipBtn = $('#skipwalk'), skipRing = $('#skipwalk-ring');

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
/* phones: 2 (art review #6: the paint chain at 1.5 looked upscaled; at 2 the chain is about 36-42 M taps per frame on a
   390x844 phone, ~3-4 ms on an iPhone 12-class GPU). The adaptive step drops it first if frames are slow. */
const prCap = 2;
/* the drawing buffer stays at about 1.6 Mpx on touch screens (tablets: an iPad Air paints at ~1.3x instead of 2x, ~40 M
   taps a frame) and 2.4 Mpx on desktops (Retina laptops ~1.36x); phones keep 2x. The area cap never goes below 1x.
   prLimit is the adaptive step's ceiling; phones never drop under 1.5 (a 30 Hz power-saving cap must not leave them
   at an upscaled 1x). */
const PX_MAX = coarse ? 1.6e6 : 2.4e6, PR_FLOOR = coarse ? 1.5 : 1;
let prLimit = prCap;
const prFor = (w, h) => Math.min(window.devicePixelRatio || 1, prLimit, Math.max(1, Math.sqrt(PX_MAX / Math.max(1, w * h))));
let pixelRatio = prFor(innerWidth, innerHeight);
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = mqReduce.matches;
let frames = {}, walk = null, walkT = 0, walkFrozen = false, walkStartedAt = 0, flow = 'look';
let shelfLookK = 0, baseLook = null, walkFresh = false;
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
/* the "door" flow: phones (a coarse pointer on a small screen) and narrow portrait windows. Tablets keep the look-around
   (with glance targets pushed for their narrower field of view). ?flow=door|look forces one (tests). */
const FLOW_Q = Q.get('flow') === 'door' || Q.get('flow') === 'look' ? Q.get('flow') : null;
function isDoorFlow() { return FLOW_Q ? FLOW_Q === 'door' : (coarse && Math.min(W, H) < 600) || (W < 600 && W / H < 1); }
function keepPts() {
  return Array.isArray(anchors.ext.keepPts) && anchors.ext.keepPts.every((p) => p && p.isVector3) ? anchors.ext.keepPts : [V(3.45, 0, 2.05), V(1.65, 0, 2.05), V(-0.95, 0, 0.6), V(0.95, 0, 0.55)];
}

/* phones: framed on the shopfront door. The sign, the open doorway with the room behind it, the Maine Coon and the bowl
   always fit inside the space above the intro card; a slice of both windows shows at the sides and, on tall screens,
   the floor-2 windows with their flower boxes and the balcony above (the spare height goes on top). */
function doorExteriorFrame() {
  const short = html.classList.contains('lay-short') || W / H > 1.15, b = short ? EXT_DOOR.short : EXT_DOOR.tall;
  const sc = sign ? sign.center : V(0, 3.38, 0.07), sw = sign ? sign.width / 2 : 1.7;
  const pts = [V(-sw, sc.y + 0.6, sc.z), V(sw, sc.y + 0.6, sc.z), V(-sw, sc.y - 0.58, sc.z), V(sw, sc.y - 0.58, sc.z),
    V(-DOOR.x - 0.05, 0, 0), V(DOOR.x + 0.05, 0, 0), V(0, -0.03, 0.85), V(-2.2, 1.4, 0.3), V(2.2, 1.4, 0.3)];
  for (const p of keepPts()) if (Math.abs(p.x) < 1.6) { pts.push(p.clone(), V(p.x, p.y + (p.x < 0 ? 0.95 : 0.2), p.z)); }   /* the cat (with its ears) and the bowl */
  const opts = { margin: short ? 0.03 : 0.035, vBias: short ? 0.15 : 0.6, fovMax: 72, fovMin: 16 };
  let f = fitFrame(b.pos, b.look, pts, rects.ext, opts);
  if (sign) {
    const proj = projector(b.pos, b.look), need = (LOGO_MIN.phone + 4) / Math.abs(proj(sign.logoR).u - proj(sign.logoL).u);
    if (need > f.k + 0.5) f = fitFrame(b.pos, b.look, pts, rects.ext, { ...opts, kMin: need });   /* hard rule: the logo reads */
  }
  return f;
}

function exteriorFrame() {
  if (isDoorFlow()) return doorExteriorFrame();
  const tall = W / H < 1, b = tall ? EXT.tall : EXT.wide, hw = b.fitW / 2;
  /* fit width guides, the pavement in front of the door, the Maine Coon (-0.95, 0, 0.45) and the dog bowl (0.95, 0, 0.42) */
  const base = [V(-hw, 2.4, 0), V(hw, 2.4, 0), V(0, -0.04, 1.0), V(-1.2, 0, 0.75), V(1.2, 0, 0.7)];
  const roof = roofPts && roofPts.length ? roofPts : [V(0, HOUSE.ridge - 0.2, -3.8), V(-HOUSE.x, HOUSE.eaves + 0.3, -0.5), V(HOUSE.x, HOUSE.eaves + 0.3, -0.5)];
  const pts = base.concat(roof);
  /* the exterior's keep points (café table + guests, the cat, the bowl, the house corners); phones keep the near ones */
  for (const p of keepPts()) if (!tall || Math.abs(p.x) < 1.6) pts.push(p.clone());
  const opts = { margin: tall ? 0.02 : 0.018, vBias: tall ? 0.2 : 0.3, fovMax: 80, fovMin: 18 };
  let f = fitFrame(b.pos, b.look, pts, rects.ext, opts);
  /* the logo must read: zoom in toward the minimum logo width, but never so far that the roof leaves the frame */
  const s = sign;
  if (s) {
    const proj = projector(b.pos, b.look);
    const logoTan = Math.abs(proj(s.logoR).u - proj(s.logoL).u);
    /* +2 px: the idle drift (a few cm) and rounding must never take it under the hard minimum */
    const need = ((isPhoneish() ? LOGO_MIN.phone : LOGO_MIN.desktop) + 2) / (logoTan * LOGO_INK);
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
  const kLogo = logoTan ? (LOGO_MIN.desktop + 3) / (logoTan * LOGO_INK) : 0;
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
  /* art review #3: the fit points stop at mid-base (y 0.42), so the frame crops through the fluted base like a product
     shot. The fit is set by the width (display + hook stand), so the spare height goes mostly above the display (the
     arched niches) and little below it: the bottom edge sits just under the mid-base points instead of on bare floor */
  const opts = { margin: tall ? 0.04 : 0.05, vBias: 0.72, fovMax: 140, fovMin: 14 };
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

/* ------------------------------------------------------------------ the walk in (v3) */
/* directions: yaw from -Z toward +X (right is positive), pitch up is positive */
const dirYP = (yaw, pitch, out = V()) => { const c = Math.cos(pitch); return out.set(Math.sin(yaw) * c, Math.sin(pitch), -Math.cos(yaw) * c); };
const yawTo = (a, b) => Math.atan2(b.x - a.x, -(b.z - a.z));
const pitchTo = (a, b) => Math.atan2(b.y - a.y, Math.hypot(b.x - a.x, b.z - a.z));
const angleYP = (a, b) => dirYP(a.yaw, a.pitch).angleTo(dirYP(b.yaw, b.pitch));
/* a rest-to-rest move with a smoothed trapezoid speed profile: smoothstep ramps of r s, an even cruise between.
   Peak speed = angle / (T - r). Returns the completed fraction at time s. */
function trapezoid(T, r) {
  r = Math.min(r, T / 2); const tot = T - r, S1 = (u) => u * u * u - (u * u * u * u) / 2;   /* integral of smoothstep */
  return (s) => {
    if (s <= 0) return 0; if (s >= T) return 1;
    if (s < r) return (r * S1(s / r)) / tot;
    if (s > T - r) return 1 - (r * S1((T - s) / r)) / tot;
    return (r / 2 + (s - r)) / tot;
  };
}
const moveDur = (A, vmax, r) => Math.max(A / vmax + r, 2 * r);

function buildWalk() {
  flow = isDoorFlow() ? 'door' : 'look';
  walk = flow === 'door' ? buildDoorWalk() : buildLookWalk();
  WALK_DUR = walk.dur;
}

/* phones: straight through the doorway to the round display, about 4.6 s, eased from and to rest, an even glide through
   the door (where the warm bloom is), the head level and on the display all the way: no glances */
function buildDoorWalk() {
  const E = frames.exterior, S = frames.shelf, dur = WALK.door.dur, nf = naturalFov();
  const pts = [E.pos.clone()];
  for (const p of [V(0, 1.66, 2.8), V(0, 1.62, 0.7), V(0, 1.6, -0.55)]) if (p.z < E.pos.z - 0.8 && p.z > S.pos.z + 0.4) pts.push(p);
  pts.push(S.pos.clone());
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal'); curve.arcLengthDivisions = 400;
  /* the door comes at ~58% of the time: about 2.6 s up to the threshold, then a slower glide in to the display */
  const ease = pchip([0, 0.2, 0.56, 1], [0, 0.12, 0.76, 1]);
  const posAt = (t, out = V()) => curve.getPointAt(ease(clamp(t / dur, 0, 1)), out);
  const disp = (anchors.int.display && anchors.int.display.isVector3 ? anchors.int.display : DISPLAY.c);
  const hold = (k) => k.map((x) => [x[0], x[1], true]);
  const look = timedSpline([[0, E.look.clone(), true], [dur * 0.46, V(disp.x * 0.5, 1.6, disp.z)], [dur, S.look.clone(), true]]);
  const tDoor = (() => { for (let i = 0; i <= 200; i++) { const t = (i / 200) * dur; if (posAt(t).z < 0) return t; } return dur * 0.55; })();
  return {
    flow: 'door', dur, curve, pos: posAt, look,
    /* the shift lens and the lens angle go straight from the door frame to the display frame (both keep the subject above
       the card), so the screen centre never swings back and forth */
    fov: timedSpline(hold([[0, E.fov], [dur, S.fov]])),
    sx: timedSpline(hold([[0, E.sx], [dur, S.sx]])),
    /* the intro card hides as the walk starts: ease off most of its upward offset in the first second, so the lower
       screen is not bare cobbles, then on to the display frame (art review, phones) */
    sy: timedSpline([[0, E.sy, true], [0.9, lerp(E.sy * 0.4, S.sy, 0.15)], [dur, S.sy, true]]),
    keys: { tDoor, dur, nf },
  };
}

/* desktop + tablets: the look-around. The visitor steps in and rests (a calm pause), looks slowly left over the
   bookcases and the reading corner, then slowly right past the display, the vintage shelves and the suitcase to the
   round café counter, looks up at the chandelier and the fairy lights, then glides to the round display. Each head turn
   is rest-to-rest at <= 20 deg/s; the position keeps drifting a little the whole time, so it never feels stop-start.
   Targets sit where they read for this screen's field of view (portrait tablets turn further, art review #8). */
function buildLookWalk() {
  const E = frames.exterior, S = frames.shelf, L = WALK.look, nf = naturalFov();
  const vHalf = rad(nf) / 2, hHalf = Math.atan(Math.tan(vHalf) * (W / H));
  const P0 = L.door.clone();
  /* the approach: street -> just inside the door, eased to rest */
  const appr = [E.pos.clone()];
  for (const p of [V(0, 1.72, 4.2), V(0, 1.63, 1.05)]) if (p.z < E.pos.z - 0.8) appr.push(p);
  appr.push(P0.clone());
  const curve = new THREE.CatmullRomCurve3(appr, false, 'centripetal'); curve.arcLengthDivisions = 500;
  const tA = L.approach, easeA = pchip([0, 0.22, 0.7, 1], [0, 0.12, 0.86, 1]);
  const books = (anchors.int.booksLook && anchors.int.booksLook.isVector3) ? anchors.int.booksLook : GLANCE.gift;
  const cafe = (anchors.int.cafeLook && anchors.int.cafeLook.isVector3) ? anchors.int.cafeLook : GLANCE.cafe;
  const lantern = (anchors.int.lanternLook && anchors.int.lanternLook.isVector3) ? anchors.int.lanternLook : GLANCE.lantern;
  /* the drift: a few tens of cm while the head turns */
  const PL = P0.clone().add(V(0.22, 0, -0.18)), PR = P0.clone().add(V(-0.3, -0.01, -0.32));
  const PU = PR.clone().lerp(S.pos, 0.42);
  const fin = { yaw: yawTo(S.pos, S.look), pitch: pitchTo(S.pos, S.look) };
  /* the shelf frame's shift lens turns the screen centre a little more during the glide: count it in the glide's angle */
  const finC = (() => {
    const f = S.look.clone().sub(S.pos).normalize(), r = f.clone().cross(UP).normalize(), u = r.clone().cross(f);
    const tv = Math.tan(rad(S.fov) / 2), th = tv * (W / H);
    const c = f.clone().addScaledVector(r, -S.sx * th).addScaledVector(u, -S.sy * tv).normalize();
    return { yaw: Math.atan2(c.x, -c.z), pitch: Math.asin(clamp(c.y, -1, 1)) };
  })();
  const k0 = { yaw: 0, pitch: rad(-4) };
  /* portrait (tablets): a narrow field of view needs bigger turns to show the bookcases and the counter, so the walk may
     run a little longer there */
  const portrait = W / H < 1, maxDur = portrait ? Math.min(15, L.maxDur + 1.6) : L.maxDur;   /* owner: 12-15 s */
  const fL = portrait ? 0.85 : 0.75, fR = portrait ? 0.7 : 0.55;
  let shrink = 1, plan = null;
  for (let it = 0; it < 8; it++) {
    const kL = { yaw: clamp(yawTo(PL, books) + fL * hHalf, rad(-68), rad(-22)) * shrink, pitch: rad(portrait ? 1 : -3) };
    const kR = { yaw: clamp(yawTo(PR, cafe) - fR * hHalf, rad(22), rad(70)) * shrink, pitch: rad(portrait ? 1 : -3) };
    const kU = { yaw: yawTo(PU, lantern) * 0.6, pitch: clamp(pitchTo(PU, lantern) - 0.5 * vHalf, rad(8), rad(22)) * Math.min(1, 0.3 + 0.7 * shrink) };
    const moves = [[kL, 0.2], [kR, 0.15], [kU, 0.1], [fin, 0]];
    let t = tA + L.pause, prev = k0;
    const segs = [];
    for (const [k, dwell] of moves) {
      const last = k === fin, r = last ? 0.8 : L.ramp;   /* the glide eases in and out longer */
      const A = last ? Math.max(angleYP(prev, k), angleYP(prev, finC) * 1.04) : angleYP(prev, k);
      const d = last ? Math.max(moveDur(A, L.vmax, r), 2.1) : moveDur(A, L.vmax, r);
      segs.push({ t0: t, d, a: prev, b: k, f: trapezoid(d, r), r: Math.min(r, d / 2), A });
      t += d + dwell; prev = k;
    }
    plan = { segs, dur: t };
    if (t <= maxDur) break;
    shrink *= 0.92;
  }
  const { segs, dur } = plan, sG = segs[3];
  const tLend = segs[0].t0 + segs[0].d, tRend = segs[1].t0 + segs[1].d, tUend = segs[2].t0 + segs[2].d;
  const drift = timedSpline([[tA, P0, true], [tLend, PL], [tRend, PR], [tUend, PU], [dur, S.pos.clone(), true]]);
  const posAt = (t, out = V()) => (t <= tA ? curve.getPointAt(easeA(clamp(t / tA, 0, 1)), out) : drift(t, out));
  const lookA = timedSpline([[0, E.look.clone(), true], [tA * 0.45, V(0, lerp(E.look.y, 1.85, 0.6), -1.0)], [tA, P0.clone().add(dirYP(k0.yaw, k0.pitch).multiplyScalar(3)), true]]);
  const yp = { yaw: 0, pitch: 0 }, dTmp = V(), pTmp = V();
  const ypAt = (t) => {
    let a = k0, b = k0, f = 0;
    for (const s of segs) { if (t >= s.t0) { a = s.a; b = s.b; f = s.f(t - s.t0); } }
    yp.yaw = lerp(a.yaw, b.yaw, f); yp.pitch = lerp(a.pitch, b.pitch, f); return yp;
  };
  const dist = S.pos.distanceTo(S.look);
  const look = (t, out = V()) => {
    if (t <= tA) return lookA(t, out);
    const q = ypAt(t), fG = t > sG.t0 ? sG.f(t - sG.t0) : 0;
    posAt(t, pTmp);
    if (t >= dur) return out.copy(S.look);
    return out.copy(pTmp).add(dirYP(q.yaw, q.pitch, dTmp).multiplyScalar(lerp(3, dist, fG)));
  };
  const gf = (t) => (t > sG.t0 ? sG.f(t - sG.t0) : 0);
  const aIn = (t) => smooth(0, tA * 0.75, t), sIn = (t) => smooth(0, tA * 0.6, t);
  return {
    flow: 'look', dur, curve, pos: posAt, look,
    fov: (t) => lerp(lerp(E.fov, nf, aIn(t)), S.fov, gf(t)),
    sx: (t) => lerp(lerp(E.sx, 0, sIn(t)), S.sx, gf(t)),
    sy: (t) => lerp(lerp(E.sy, 0, sIn(t)), S.sy, gf(t)),
    keys: { tA, tDoor: tA * 0.86, pause: [tA, tA + L.pause], left: [segs[0].t0, tLend], right: [segs[1].t0, tRend], up: [segs[2].t0, tUend], glide: [sG.t0, dur],
      deg: segs.map((s) => +deg(s.A).toFixed(1)), peakDegS: segs.map((s) => +deg(s.A / (s.d - s.r)).toFixed(1)), shrink: +shrink.toFixed(3), dur },
  };
}

/* ------------------------------------------------------------------ layout */
function measureTop(el) {
  const cs = getComputedStyle(el);
  return H - (parseFloat(cs.bottom) || 0) - el.offsetHeight;
}
const safeProbe = (() => {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
  document.body.appendChild(el);
  return () => { const c = getComputedStyle(el); return { l: parseFloat(c.paddingLeft) || 0, r: parseFloat(c.paddingRight) || 0 }; };
})();
function computeRects() {
  const safe = safeProbe();
  const topClear = Math.max(48, sndBtn.offsetTop + sndBtn.offsetHeight + 6);
  const sheet = html.classList.contains('lay-sheet'), short = html.classList.contains('lay-short');
  if (short) {
    /* cards in a column on the left: frame the scene in the space to their right */
    const right = (el) => (parseFloat(getComputedStyle(el).left) || 0) + el.offsetWidth + 8;
    const xe = right(extEl), xs = right(shelfEl);
    rects.ext = { x: xe, y: topClear - 4, w: Math.max(W * 0.4, W - xe - 8 - safe.r), h: H - topClear - 4 };
    rects.shelf = { x: xs, y: topClear - 4, w: Math.max(W * 0.4, W - xs - 8 - safe.r), h: H - topClear - 4 };
    rects.card = null;
    html.style.setProperty('--shelf-h', '0px');
    return;
  }
  const extTop = measureTop(extEl), shelfTop = measureTop(shelfEl);
  rects.card = sheet ? null : { x: parseFloat(getComputedStyle(extEl).left) || 0, y: extTop, w: extEl.offsetWidth, h: extEl.offsetHeight };
  rects.ext = sheet
    ? { x: 8 + safe.l, y: topClear, w: W - 16 - safe.l - safe.r, h: Math.max(H * 0.35, extTop - topClear - 6) }
    : { x: 14, y: topClear - 6, w: W - 28, h: H - topClear - 8 };
  if (html.classList.contains('lay-wide')) {
    /* the shelf panel stands at the right: the display gets the full height to its left */
    const sr = shelfEl.getBoundingClientRect(), sl = sr.width > 0 ? sr.left : W;   /* panel hidden (posters): full width */
    rects.shelf = { x: 10, y: topClear - 6, w: Math.max(W * 0.4, sl - 22), h: H - topClear - 6 };
    html.style.setProperty('--shelf-h', '0px');
    return;
  }
  rects.shelf = { x: 8 + safe.l, y: topClear, w: W - 16 - safe.l - safe.r, h: Math.max(H * 0.3, shelfTop - topClear - 8) };
  html.style.setProperty('--shelf-h', Math.round(H - shelfTop) + 'px');
}
function layout() {
  if (state === 'fallback') return;   /* the no-WebGL page keeps its one plain layout */
  W = Math.max(1, canvas.clientWidth || innerWidth); H = Math.max(1, canvas.clientHeight || innerHeight);
  pixelRatio = prFor(W, H);
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
  if (W / H < 1) frames.inside.look.y += 0.2;   /* tall screens: less bare floor (art review #8) */
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
  /* the threshold glow: a warm bloom as the camera passes the door (stronger on the phones' straight walk in) */
  const door = flow === 'door';
  const bump = state === 'walking' && !reduceMotion ? Math.exp(-(((z + (door ? 0.15 : 0)) / (door ? 1.25 : 0.8)) ** 2)) * (door ? 1.7 : 1) : 0;
  renderer.toneMappingExposure = lerp(ATMO.o.exposure, ATMO.i.exposure, s) + (door ? 0.075 : 0.06) * bump;
  hemi.intensity = lerp(ATMO.o.hemi, ATMO.i.hemi, s) + 0.12 * bump;
  sun.intensity = lerp(ATMO.o.sun, ATMO.i.sun, s);
  sun.color.lerpColors(cO.sun, cI.sun, s);
  hemi.color.lerpColors(cO.sky, cI.sky, s); hemi.groundColor.lerpColors(cO.ground, cI.ground, s);
  if (scene.fog) { scene.fog.color.lerpColors(cO.fog, cI.fog, s); scene.fog.near = lerp(ATMO.o.fogNear, ATMO.i.fogNear, s); scene.fog.far = lerp(ATMO.o.fogFar, ATMO.i.fogFar, s); }
  warmth.style.opacity = bump > 0.002 ? Math.min(0.55, (door ? 0.3 : 0.2) * bump).toFixed(3) : '0';
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
  if (skipBtn) { skipBtn.inert = s !== 'walking'; if (s !== 'walking' && document.activeElement === skipBtn) skipBtn.blur(); }
  html.dataset.flow = flow;
}
function setState(s) {
  state = s; setUI(s); dirty = true;
  /* the product photos load while the camera walks in, so the card row is ready at the shelf */
  if ((s === 'walking' || s === 'shelf' || s === 'fallback') && !setState.eager) { setState.eager = true; loadRowImages(); }
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
  if (!walk || walk.flow !== (isDoorFlow() ? 'door' : 'look')) buildWalk();
  walkOffset0.copy(offsetNow); walkT = 0; walkFrozen = false; walkStartedAt = performance.now(); walkFresh = true;
  setState('walking');
  /* keyboard users land on the small skip control (Enter skips); a mouse or touch user sees no focus ring */
  if (skipBtn) setTimeout(() => { if (state === 'walking') skipBtn.focus({ preventScroll: true }); }, 30);
}
function finishWalk() { view = 'shelf'; setState('shelf'); walkFrozen = false; updateCamera(0); focusOpen(); }
function fastForward() { if (state !== 'walking' || cutting || walkFrozen) return; cut(finishWalk, 0.16, 0.3); }
function restart() { if (cutting) return; cut(() => { goTo('exterior'); $('#go').focus({ preventScroll: true }); }, reduceMotion ? 0.1 : 0.22, reduceMotion ? 0.15 : 0.4); }
function focusOpen() {
  const f = () => { const o = $('#open'); if (o && !shelfEl.inert && state === 'shelf' && document.activeElement !== o && (!document.activeElement || document.activeElement === body)) o.focus({ preventScroll: true }); };
  setTimeout(f, 40); setTimeout(f, 450);   /* again once the card has faded in (a busy first frame can swallow the first try) */
}
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
  sndBtn.classList.toggle('on', soundOn); sndLabel.textContent = soundOn ? 'Sound off' : 'Sound on';
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
function loadRowImages() { rowEl.querySelectorAll('img[data-src]').forEach((i) => { i.loading = 'eager'; i.src = i.dataset.src; i.removeAttribute('data-src'); }); }
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
    img.dataset.src = it.kind === 'merlin' ? MERLIN_PHOTO : PHOTO(it.id); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
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
/* touch tolerance: the pieces are small on phones; sample a 14 px ring around a missed tap and take the hit whose
   screen centre is nearest the finger */
function pickNear(x, y) {
  let best = null, bd = Infinity;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, o = pickAt(x + Math.cos(a) * 14, y + Math.sin(a) * 14);
    if (!o) continue;
    box.setFromObject(o); box.getCenter(tmpV); tmpV.project(camera);
    const d = Math.hypot((tmpV.x + 1) / 2 * W - x, (1 - tmpV.y) / 2 * H - y);
    if (d < bd) { bd = d; best = o; }
  }
  return best;
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
  placePick(o);
  /* the card can open right under the finger (pieces just above the sheet): the tap's own click, which follows the
     pointerup a few ms later, must not land on its link or its close button */
  pickEl.style.pointerEvents = 'none'; clearTimeout(openPick.guard);
  openPick.guard = setTimeout(() => { pickEl.style.pointerEvents = ''; }, 450);
  requestAnimationFrame(() => pickEl.classList.add('on'));
}
/* the sheet layout: if the tapped piece sits under where the card opens (small phones: the bottom tier), the card opens
   at the top of the screen instead, so the piece stays in sight and the next tap can reach it (top-tier pieces keep
   the card at the bottom, so it never covers the piece) */
function placePick(o) {
  pickEl.classList.remove('at-top');
  if (!html.classList.contains('lay-sheet') || !camera) return;
  box.setFromObject(o);
  let yMax = -Infinity;
  for (let i = 0; i < 8; i++) {
    tmpV.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(camera);
    yMax = Math.max(yMax, (1 - tmpV.y) / 2 * H);
  }
  const shelfH = parseFloat(html.style.getPropertyValue('--shelf-h')) || 0;
  const cardTop = H - shelfH - 10 - pickEl.offsetHeight;
  if (yMax > cardTop - 8) pickEl.classList.add('at-top');
}
function closePick() {
  if (!pickObj && pickEl.hidden) return;
  pickObj = null; dirty = true;
  pickEl.classList.remove('on');
  setTimeout(() => { if (!pickObj) pickEl.hidden = true; }, 220);
}
/* the open door is a doorway too: hover shows the logo-cat pointer, a click or tap steps inside */
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
  if (!o) o = pickNear(e.clientX, e.clientY);
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
  /* the stub library only when something real is missing (it is also fetched later if a real builder throws) */
  const stubLib = stubbed.length || !tex || !props ? await import('./_stub-lib.js') : null;
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
const adapt = { on: !FORCED_Q, start: 0, samples: [], step: 0, lastMed: 0, lastWasPr: false };
let renderedLast = false;
function adaptTick(now, dtMs) {
  if (!adapt.on || !firstFrame || document.hidden) return;
  if (window.havenLoader && window.havenLoader.shown) return;   /* the loader's video decodes on top: measure after it fades */
  if (!adapt.start) { adapt.start = now; return; }
  const since = now - adapt.start;
  /* only intervals that followed a drawn frame count (the still shelf draws only when something changes) */
  if (since > 400 && dtMs < 1500 && renderedLast) adapt.samples.push(dtMs);   /* skip only real stalls (tab switch, alert) */
  if (since < 2400 || (adapt.samples.length < 8 && since < 7000)) return;
  if (state === 'walking' || cutting) return;      /* never switch quality (a shader recompile) in the middle of the walk */
  if (adapt.samples.length < 6) { adapt.samples = []; adapt.start = now; return; }
  const s = adapt.samples.sort((a, b) => a - b), med = s[Math.floor(s.length / 2)];
  adapt.samples = []; adapt.start = now;
  if (med <= 21.5) { adapt.on = false; return; }               /* ~46 fps or better: keep what we have */
  /* a fewer-pixels step that left the frame cadence where it was (e.g. a 30 Hz power-saving cap, or a CPU-bound device):
     more pixel cuts would only blur the picture, so stop here */
  if (adapt.lastWasPr && adapt.lastMed && Math.abs(med - adapt.lastMed) < adapt.lastMed * 0.1) { adapt.on = false; return; }
  adapt.lastMed = med;
  const setPr = (v) => { v = Math.max(PR_FLOOR, Math.round(v * 100) / 100); if (v >= pixelRatio - 0.01) return false; prLimit = v; queueLayout(); return true; };
  const steps = [
    () => setPr(pixelRatio * 0.75),
    () => { if (paintQ === 'low' || !wc) return false; paintQ = 'low'; wc.setQuality('low'); dirty = true; return true; },   /* half-res R3 paint */
    () => { if (!renderer.shadowMap.enabled) return false; quality = 'low'; setShadows(false); return true; },
    () => setPr(1),
  ];
  while (adapt.step < steps.length) { const i = adapt.step++; if (steps[i]()) { adapt.lastWasPr = i === 0 || i === 3; return; } }
  adapt.on = false;
}

/* ------------------------------------------------------------------ frame loop */
let tickCount = 0, lastBoil = -2;
function frame(now) {
  rafId = requestAnimationFrame(frame);
  const dtMs = lastNow ? now - lastNow : 16.7; lastNow = now;
  const dt = clamp(dtMs / 1000, 0, 0.1);
  fpsEMA = lerp(fpsEMA, clamp(dtMs / 1000, 0.001, 0.5), 0.06);
  clockT += dt;
  adaptTick(now, dtMs);
  if (state === 'walking' && !walkFrozen) {
    /* time-based: the walk takes WALK_DUR seconds of real time whatever the frame rate (a hidden tab stops the loop and
       start() resets the frame clock, so time away is not counted). The first frame after Step inside counts no time
       (an idle page may have had no frame for a while), and one stalled frame (a shader compile as the room comes into
       view) moves the walk on by at most 200 ms, so the camera never jumps; down to 5 fps it is still real time. */
    walkT += walkFresh ? 0 : clamp(dtMs, 0, 200) / 1000;
    walkFresh = false;
    if (walkT >= WALK_DUR - 0.5) setUI('shelf');
    if (walkT >= WALK_DUR) { walkT = WALK_DUR; finishWalk(); }
    if (skipRing) skipRing.style.strokeDashoffset = (1 - clamp(walkT / WALK_DUR, 0, 1)).toFixed(4);
  }
  updateCamera(dt);
  const hovering = updateHover(dt);
  const tA = DEBUG.t !== null ? DEBUG.t : reduceMotion ? 1.5 : clockT, dA = DEBUG.t !== null || reduceMotion ? 0 : dt;
  const camZ = camera.position.z;
  if (EXTB && EXTB.update && !updateBroken.ext && camZ > EXT_UPDATE_Z) guardedUpdate('ext', EXTB, tA, dA);
  if (INTB && INTB.update && !updateBroken.int) guardedUpdate('int', INTB, tA, dA);
  const still = reduceMotion && state !== 'walking' && !hovering && !dirty && !cutting;
  /* deeper inside nothing moves on its own (the street animation pauses below EXT_UPDATE_Z and the room has no clock):
     draw only when something changes, or when the pencil lines boil (4 steps a second) — the still shelf then costs a
     few frames a second instead of 60 (battery, heat) */
  const boil = reduceMotion ? -1 : Math.floor(tA * 4);
  const live = state === 'walking' || cutting || hovering || dirty || camZ > EXT_UPDATE_Z || boil !== lastBoil;
  renderedLast = false;
  if (!still && live) { render(camZ, tA); lastBoil = boil; renderedLast = true; }
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
let castGroup = undefined, castHidden = false;   /* the cast's skinned meshes (ext:cast:*) */
function thresholdCull() {
  if (!EXTB || !EXTB.group) return;
  if (!threshList) { threshList = []; EXTB.group.traverse((o) => { if (o.isMesh && THRESH_RE.test(o.name || '')) threshList.push(o); }); }
  const p = camera.position; camera.getWorldDirection(threshDir);
  /* (fix v3, budget headroom) once the camera is through the door plane looking in, the cast (the Maine Coon, the café
     guests, the dog: all at z > 0.5) is behind it, but their one shared skinning sphere still reaches the frustum:
     skip them (≈ 17k triangles on the frames just inside the door) */
  if (castGroup === undefined) { castGroup = []; EXTB.group.traverse((o) => { if (o.isMesh && /^ext:cast:/.test(o.name || '')) castGroup.push(o); }); }
  const hide = p.z < 0.3 && threshDir.z < -0.5;
  if (hide !== castHidden) { castHidden = hide; for (const o of castGroup) o.visible = !hide; }
  const inside = p.z < -0.55 && threshDir.z < -0.3;
  const want = !inside && p.z < 4.3 && threshDir.z < -0.5 && Math.abs(p.x) < 1.2;
  if (want === threshOn) return;
  threshOn = want;
  if (!inside) for (const o of threshList) o.visible = !want;
}
/* the paint at the round display (art review #4): eased in over the last second of the walk, held at the shelf,
   restored everywhere else (only the keys it changes; the base is whatever the paint had at boot, ?look included) */
function updateShelfLook() {
  if (!wc || !baseLook) return;
  const k = state === 'shelf' ? 1 : state === 'walking' ? smooth(WALK_DUR - 1.6, WALK_DUR - 0.25, walkT) : 0;
  if (Math.abs(k - shelfLookK) < 1e-4) return;
  shelfLookK = k;
  const o = {};
  for (const key in SHELF_LOOK) o[key] = lerp(baseLook[key], SHELF_LOOK[key], k);
  wc.setLook(o);
}
function render(camZ = camera.position.z, t = DEBUG.t !== null ? DEBUG.t : clockT) {
  thresholdCull();
  updateShelfLook();
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
  /* one plain page for every screen: the phone order (Open the book / Stroll the shop first, then the pieces in a row) */
  html.classList.add('no-webgl', 'lay-sheet'); html.classList.remove('lay-wide', 'lay-short');
  state = 'fallback'; setUI('fallback'); loadRowImages();
  /* the loading screen stays as a still header (the final frame of the owner's logo animation), then the painted
     exterior poster if assets/poster-exterior.webp exists */
  if (window.havenLoader) window.havenLoader.still(); else loader.classList.add('done');
  const img = new Image(); img.alt = ''; img.decoding = 'async';
  img.onload = () => { const poster = document.createElement('div'); poster.className = 'poster'; poster.setAttribute('aria-hidden', 'true'); poster.appendChild(img); body.insertBefore(poster, $('#ui')); };
  img.src = 'assets/poster-exterior.webp';
  /* the shelf as it looks at the end of the walk, above the "On this shelf" card */
  const shelfImg = new Image(); shelfImg.alt = ''; shelfImg.decoding = 'async';
  shelfImg.onload = () => { const p = document.createElement('div'); p.className = 'poster poster-shelf'; p.setAttribute('aria-hidden', 'true'); p.appendChild(shelfImg); shelfEl.before(p); };
  shelfImg.src = 'assets/poster-shelf.webp';
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
  if (skipBtn) skipBtn.addEventListener('click', (e) => { e.stopPropagation(); if (state === 'walking') fastForward(); });
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

/* ------------------------------------------------------------------ back / forward */
/* Back from the book, the shop or a product: the visitor returns to the shelf they left, not to the street (when the
   browser reloads the page instead of restoring it from the back-forward cache) */
function cameBackToShelf() {
  let at = '', nav = '';
  try { at = sessionStorage.getItem('haven3d.at') || ''; } catch (e) { /* storage blocked */ }
  try { const n = performance.getEntriesByType('navigation')[0]; nav = n ? n.type : ''; } catch (e) { /* old browser */ }
  return nav === 'back_forward' && at === 'shelf';
}
addEventListener('pagehide', () => { try { sessionStorage.setItem('haven3d.at', state === 'shelf' ? 'shelf' : ''); } catch (e) { /* storage blocked */ } });
addEventListener('pageshow', (e) => {
  if (!e.persisted || !renderer) return;
  closePick(); setHover(null);
  if (renderer.getContext().isContextLost()) { location.reload(); return; }
  dirty = true; start();
});

/* ------------------------------------------------------------------ boot */
async function boot() {
  /* the loader's watchdog (index.html) already turned the page into the plain one: stay out of its way */
  if (window.havenLoader && window.havenLoader.alive && !window.havenLoader.alive()) return;
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
  { const l = wc.look || {}; baseLook = {}; for (const key in SHELF_LOOK) baseLook[key] = Number.isFinite(l[key]) ? l[key] : SHELF_LOOK[key]; }
  wc.setSize(W, H, pixelRatio);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, W / H, 0.06, 420);
  setupLights();

  const mods = await loadModules();
  let S = mods.stubLib;
  const stubLib = async () => S || (S = await import('./_stub-lib.js'));
  T = mods.tex ? attempt('makeTextures', () => mods.tex.makeTextures(THREE, renderer), () => null) : null;
  if (!T) { usedStubs.lib = true; T = (await stubLib()).makeTextures(THREE, renderer); }
  P = mods.props ? attempt('makeProps', () => mods.props.makeProps(THREE, T), () => null) : null;
  if (!P) { usedStubs.lib = true; P = (await stubLib()).makeProps(THREE, T); }

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
  /* the near levels of the display's LODs are hidden from the street: show them for the compile so their programs are
     ready before the walk reaches the display (the renderer picks the right level again on the next frame) */
  scene.traverse((o) => { if (o.isLOD) for (const l of o.levels) l.object.visible = true; });
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
  else if (cameBackToShelf()) { goTo('shelf'); focusOpen(); }
  else goTo('exterior');
  renderer.shadowMap.needsUpdate = true;
  render();
  firstFrame = true;
  /* the loading screen (index.html) fades once the owner's logo animation has reached a pleasant moment */
  if (window.havenLoader) window.havenLoader.ready(); else loader.classList.add('done');
  /* the card row's photos: off the critical path (they wait for the first painted frame), but ready well before the
     visitor reaches the shelf; Step inside starts them at once if that comes first */
  setTimeout(() => { if (!setState.eager) { setState.eager = true; loadRowImages(); } }, 2500);
  start();
  readyResolve({ fallback: false });
}

window.__haven = {
  get renderer() { return renderer; }, get scene() { return scene; }, get camera() { return camera; },
  get state() { return state; }, get view() { return view; }, get frames() { return frames; },
  get pickables() { return pickables; }, get quality() { return quality; }, get walkKeys() { return walk && walk.keys; },
  get flow() { return flow; }, get walkDur() { return WALK_DUR; },
  /* tests: the camera pose the walk gives at time t (no render): position, look target, fov, shift lens */
  walkPose(t) { if (!walk) return null; const p = walk.pos(t, V()), l = walk.look(t, V()); return { pos: p.toArray(), look: l.toArray(), fov: walk.fov(t), sx: walk.sx(t), sy: walk.sy(t), W, H }; },
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
      if (skipRing) skipRing.style.strokeDashoffset = (1 - walkT / WALK_DUR).toFixed(4);
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
