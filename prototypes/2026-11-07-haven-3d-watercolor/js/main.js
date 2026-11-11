/* Haven 3D v4 — page shell + camera for "Merlin's Purrfect Haven" (PREVIEW 10/11, Purrlight Studio).
   Owns: renderer, sky, fog, hemisphere + sun, soft environment fill, adaptive quality (only while idle), the two looks,
   the camera (views, the walk in, framing per screen), the state machine exterior -> walking -> shelf, picking on the
   round display, the HTML overlay, the first-paint poster and its cross-fade, no-WebGL fallback, reduced motion, sound,
   debug hooks and window.__haven.
   v4 (owner requests 10/11):
   - No intro. The page opens on the shop façade: a still of the exact first view (assets/poster-first-*.webp, rendered
     from this scene with this camera) paints at once under the canvas; main.js lines it up with the live camera and the
     canvas cross-fades in (0.28 s) when its first frame is ready. "Skip to the shop" is a plain link (works at once);
     "Step inside" pressed early shows a small busy ring and starts as soon as the scene is ready.
   - Two looks: ?look=3d (DEFAULT: clean 3D, MSAA, tone mapping once by the renderer, sRGB) and ?look=paint (the
     watercolour + pencil chain of js/watercolor.js, loaded only then). ?paint=0 = look=3d (old switch).
   - Tablets take the phones' door-straight flow (coarse pointer of any size, or a window narrower than 1024 px).
   - Compact overlays (a small card / one bar on the street; buttons + an "On this shelf" drawer at the display, collapsed
     on phones and tablets); the framing uses the freed space (bigger shop and display than v3).
   - Smoothness: the build yields between steps (textures -> props -> exterior -> interior -> compile) while the poster
     shows; every program (all LOD levels, inside views, shadow pass) is compiled and every texture/geometry uploaded
     before the reveal; pixel ratio / quality never change during a walk (adaptive steps only while idle at the street);
     every frame is drawn while anything moves and nothing is drawn when all is still; the walk clock is smoothed so
     one slow frame never jumps the camera.
   Scene content comes from textures.js / props.js / exterior.js / interior.js (stubs: _stub-*.js). */

import * as THREE from '../vendor/three.module.min.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

/* ------------------------------------------------------------------ constants */
const Q = new URLSearchParams(location.search);
const num = (k) => (Q.has(k) && Q.get(k) !== '' && isFinite(+Q.get(k)) ? +Q.get(k) : null);
const DEBUG = {
  view: Q.get('view'), stats: Q.get('stats') === '1', t: num('t'), walk: num('walk'), nogl: Q.get('nogl') === '1',
  tm: Q.get('tm'), paint: Q.get('paint'),   /* ?paint=0 = look=3d; raw | kuwa | lines | paper show one paint stage */
  cam: (Q.get('cam') || '').split(',').map(Number).filter((n) => isFinite(n)),   /* test hook: ?cam=px,py,pz,lx,ly,lz[,fov] */
  warm: Q.get('warm') !== '0',            /* ?warm=0 skips the pre-reveal warm-up (quick tests only) */
  hold: num('hold'),                      /* ?hold=<ms> holds the reveal back (tests: Step inside pressed early) */
};
/* the look: ?look=3d (default) | paint. Old links: ?paint=0 -> 3d, ?paint=<stage> -> paint; ?look={json} or
   ?paintlook={json} tunes the paint (dev) */
const LOOK_JSON = (() => { const s = Q.get('paintlook') || (Q.get('look') && Q.get('look').trim().startsWith('{') ? Q.get('look') : ''); try { return s ? JSON.parse(s) : null; } catch (e) { console.warn('[haven3d] ?paintlook is not JSON', e); return null; } })();
const LOOK = (() => {
  const l = (Q.get('look') || '').toLowerCase(), p = DEBUG.paint;
  if (l === 'paint' || LOOK_JSON) return 'paint';
  if (l === '3d') return '3d';
  if (p !== null && p !== '' && p !== '0' && p !== 'off') return 'paint';
  return '3d';
})();
const PAINT = LOOK === 'paint';
const BOIL = Q.get('boil') === '1';       /* paint only: the pencil lines "boil" (4 steps a second); off by default (v4) */
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
const yieldMain = () => (globalThis.scheduler && typeof scheduler.yield === 'function' ? scheduler.yield() : new Promise((r) => setTimeout(r, 0)));
const timeout = (ms) => new Promise((r) => setTimeout(r, ms));

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
/* the walk. look = desktop look-around, door = phones + tablets, straight through the doorway */
const WALK = {
  look: { approach: 3.2, door: V(0.12, 1.6, -0.82), pause: 0.4, vmax: rad(19.5), ramp: 0.5, maxDur: 14.9 },
  door: { dur: 4.6 },
};
let WALK_DUR = 6.0;                    /* set by buildWalk for the current screen and flow */
const GLANCE = { cafe: V(2.65, 1.25, -2.65), gift: V(-3.9, 1.3, -3.3), lantern: V(0, 3.05, -4.6) };
/* phones + tablets: the first view is framed on the shopfront door (sign + open doorway + the Maine Coon + the bowl).
   One camera for every screen shape (v4), so one poster lines up exactly with any of them (only the lens differs). */
const EXT_DOOR = { pos: V(0, 1.72, 7.4), look: V(0, 2.15, 0) };
/* when the camera zooms in for the logo, at least this much roof stays in view: the whole roof front with its dormers
   on wide screens, the eaves and the dormer windows on phones (where the sign matters most) */
const ROOF_KEEP = { wide: V(0, 8.15, -1.9), phone: V(0, 7.25, 0.1), short: V(0, 5.6, 0.4) };   /* short: phones on their side */
const LOGO_FRAC = 0.8;                /* share of the sign face the logo covers (T.signFace draws it at >= 78%) */
const LOGO_MIN = { desktop: 260, phone: 170 };
const LOGO_INK = 0.983;               /* the logo's lettering spans 354 of the image's 360 px: size by the ink, not the margin */

/* light + atmosphere outside (o) and inside (i); blended by camera z when passing the door. Per look. Builders may
   tune them without touching this file: EXTB.atmo / INTB.atmo / anchors.{ext,int}.atmo = { '3d': { o: {...}, i: {...},
   env, toneMapping: 'aces'|'agx'|'neutral' }, paint: {...} } (merged in that order). */
const ATMO_BY_LOOK = {
  /* the paint (v3): late golden hour outside, a lavender sky fill so the shade reads lilac, low contrast; inside a warmer,
     dimmer lamp-lit room (the baked light field carries the pools of lamplight) */
  paint: {
    o: { exposure: 0.96, hemi: 1.25, sun: 1.85, fogNear: 19, fogFar: 72, sky: '#E4DDF0', ground: '#EBCDAA', sunColor: '#FFC48C', fog: '#F2DDCB' },
    i: { exposure: 0.93, hemi: 0.62, sun: 0.5, fogNear: 12, fogFar: 46, sky: '#FFD9B0', ground: '#DDBB96', fog: '#F2E1CC', sunColor: '#FFD9B0' },
    env: 0.24, toneMapping: 'aces',
  },
  /* clean 3D: the same golden hour, rendered straight (ACES once, sRGB); a touch more sky fill and environment so the
     shade is not muddy without the paint's lift, a slightly brighter room */
  '3d': {
    o: { exposure: 1.0, hemi: 1.3, sun: 1.9, fogNear: 22, fogFar: 80, sky: '#E6E0F0', ground: '#EBCDAA', sunColor: '#FFC892', fog: '#F2DDCB' },
    i: { exposure: 0.98, hemi: 0.7, sun: 0.5, fogNear: 14, fogFar: 50, sky: '#FFDDB8', ground: '#DDBB96', fog: '#F2E1CC', sunColor: '#FFD9B0' },
    env: 0.3, toneMapping: 'aces',
  },
};
const ATMO = JSON.parse(JSON.stringify(ATMO_BY_LOOK[LOOK]));

/* ------------------------------------------------------------------ DOM */
const $ = (s) => document.querySelector(s);
const html = document.documentElement, body = document.body;
const canvas = $('#scene'), veil = $('#veil'), warmth = $('#warmth');
const firstEl = $('#first'), firstImg = $('#first-img');
const extEl = $('#ext'), shelfEl = $('#shelf'), rowEl = $('#row'), goBtn = $('#go');
const handleBtn = $('#drawer-handle');
const tip = $('#tip'), tipName = $('#tip-name'), tipView = $('#tip-view');
const pickEl = $('#pick'), pickMedia = $('#pick-media'), pickName = $('#pick-name'), pickLink = $('#pick-link'), pickLinkText = $('#pick-link-text');
const sndBtn = $('#snd'), sndLabel = $('#snd-label'), statsEl = $('#stats');
const skipBtn = $('#skipwalk'), skipRing = $('#skipwalk-ring'), nudgeEl = $('#nudge');
html.dataset.look = LOOK;

/* ------------------------------------------------------------------ state */
let renderer = null, scene = null, camera = null, T = null, P = null, EXTB = null, INTB = null, wc = null, WC = null;
let hemi = null, sun = null;
let state = 'loading', view = 'exterior', uiState = '';
let W = innerWidth, H = innerHeight;
const coarse = matchMedia('(pointer: coarse)').matches;
/* quality 'high' = sun shadow map; phones and tablets go without it (soft contact shadows carry the grounding) */
let quality = FORCED_Q || ((coarse || (navigator.deviceMemory && navigator.deviceMemory <= 2)) ? 'low' : 'high');
/* v4 fixer (review #8): in the 3D look the sun's shadow map is drawn ONCE (the sun, the house and the room are still; the
   moving animals and guests cast none, they keep their soft contact shadows), never per frame: desktops save a shadow
   pass on every street frame, and phones + tablets get the sun's shadows too (the façade's modelling) at no per-frame
   cost, with the cheaper PCF filter. The paint keeps v3's per-frame map. */
const STATIC_SH = LOOK === '3d';
const TOUCH_SH = STATIC_SH && coarse && quality === 'low' && !FORCED_Q;   /* phones + tablets: shadows in the static tier */
let shadowDirty = true, shadowInside = false;
/* paint tier (look=paint only): 'low' on touch screens, 'high' on desktop; adaptive quality may lower it while idle */
let paintQ = FORCED_Q || (coarse || quality === 'low' ? 'low' : 'high');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
/* the drawing buffer: dpr up to 2, about 1.6 Mpx on touch screens (a 390x844 phone keeps 2x: 1.3 Mpx with 4x MSAA in the
   3D look; an iPad paints at ~1.3x) and 2.4 Mpx on desktops (Retina laptops ~1.36x). Never below 1x. prLimit is the
   adaptive step's ceiling; phones never drop under 1.5. */
const prCap = 2;
const PX_MAX = coarse ? 1.6e6 : 2.4e6, PR_FLOOR = coarse ? 1.5 : 1;
let prLimit = prCap;
const prFor = (w, h) => Math.min(window.devicePixelRatio || 1, prLimit, Math.max(1, Math.sqrt(PX_MAX / Math.max(1, w * h))));
let pixelRatio = prFor(innerWidth, innerHeight);
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = mqReduce.matches;
let frames = {}, walk = null, walkT = 0, walkFrozen = false, walkStartedAt = 0, flow = 'look';
let shelfLookK = 0, baseLook = null, walkFresh = false, walkLens0 = null;
let rects = { ext: null, shelf: null, card: null };
let sign = null, roofPts = null, anchors = { ext: {}, int: {} }, pickables = [];
let clockT = 0, lastNow = 0, rafId = 0, running = false, dirty = true, firstFrame = false, cutting = false, cutTimer = 0;
let revealed = false, pendingGo = false, frameCount = 0, idleFrames = 0, camTween = null, sceneReady = false;
let drawerOpen = false, drawerUser = null;
let fpsEMA = 1 / 60, dtAvg = 1 / 60, lastCalls = 0, lastTris = 0, frameNo = 0;
let hoverObj = null, pickObj = null, litId = null, pointerXY = { x: 0, y: 0 }, pointerMoved = false;
const par = new THREE.Vector2(), parTarget = new THREE.Vector2();
const offsetNow = V(), walkOffset0 = V();
let readyResolve; const ready = new Promise((r) => (readyResolve = r));
const updateBroken = { ext: false, int: false };
const boot = { t0: performance.now(), marks: {}, warm: {}, steps: {} };
const mark = (k) => { boot.marks[k] = Math.round(performance.now() - boot.t0); };

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
/* the "door" flow: phones AND tablets (any coarse pointer), and any window narrower than 1024 px. Wider windows with a
   fine pointer keep the look-around. ?flow=door|look forces one (tests). */
const FLOW_Q = Q.get('flow') === 'door' || Q.get('flow') === 'look' ? Q.get('flow') : null;
function isDoorFlow() { return FLOW_Q ? FLOW_Q === 'door' : coarse || W < 1024; }
function keepPts() {
  return Array.isArray(anchors.ext.keepPts) && anchors.ext.keepPts.every((p) => p && p.isVector3) ? anchors.ext.keepPts : [V(3.45, 0, 2.05), V(1.65, 0, 2.05), V(-0.95, 0, 0.6), V(0.95, 0, 0.55)];
}

/* phones + tablets: framed on the shopfront door. The sign, the open doorway with the room behind it, the Maine Coon and
   the bowl always fit inside the space above the bar; a slice of both windows shows at the sides (narrower on phones,
   so the shop reads bigger than in v3; wider on tablets) and the spare height goes on top (the floor-2 windows, the
   flower boxes, the balcony). */
function doorExteriorFrame() {
  const r = rects.ext, ra = r.w / Math.max(1, r.h), short = html.classList.contains('lay-short') || ra > 1.15;
  const sc = sign ? sign.center : V(0, 3.38, 0.07), sw = sign ? sign.width / 2 : 1.7;
  const side = ra < 0.72 ? Math.max(sw + 0.14, 1.84) : ra < 1.05 ? 2.45 : 2.2;
  const pts = [V(-sw, sc.y + 0.6, sc.z), V(sw, sc.y + 0.6, sc.z), V(-sw, sc.y - 0.58, sc.z), V(sw, sc.y - 0.58, sc.z),
    V(-DOOR.x - 0.05, 0, 0), V(DOOR.x + 0.05, 0, 0), V(0, -0.03, 0.85), V(-side, 1.4, 0.3), V(side, 1.4, 0.3)];
  for (const p of keepPts()) if (Math.abs(p.x) < 1.6) { pts.push(p.clone(), V(p.x, p.y + (p.x < 0 ? 0.95 : 0.2), p.z)); }   /* the cat (with its ears) and the bowl */
  const opts = { margin: short ? 0.03 : 0.025, vBias: short ? 0.15 : 0.82, fovMax: 72, fovMin: 14 };
  let f = fitFrame(EXT_DOOR.pos, EXT_DOOR.look, pts, r, opts);
  if (sign) {
    const proj = projector(EXT_DOOR.pos, EXT_DOOR.look), min = isPhoneish() ? LOGO_MIN.phone : LOGO_MIN.desktop;
    const need = (min + 4) / (Math.abs(proj(sign.logoR).u - proj(sign.logoL).u) * LOGO_INK);
    if (need > f.k + 0.5) f = fitFrame(EXT_DOOR.pos, EXT_DOOR.look, pts, r, { ...opts, kMin: need });   /* hard rule: the logo reads */
  }
  f.family = 'door';
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
  f.family = tall ? 'tall' : 'wide';
  return f;
}
/* Desktop: the small card sits bottom-left over the pavement. Slide the picture right (shift lens, verticals stay
   straight) so the display window, the door and the Maine Coon stay clear of it, without pushing the roof, the chimney
   or the café table off screen; if that is not enough, step back a little, never below the minimum logo width. */
const CLEAR_PTS = [V(-3.6, 0.65, 0.55), V(-3.6, 1.6, 0.55), V(-3.6, 2.55, 0.55), V(-1.05, 0, 0.55), V(-1.2, 0, 0.6), V(-0.7, 0, 0)];
function clearOfCard(f, b, pts, opts) {
  const r = rects.card, proj = projector(b.pos, b.look);
  const X = HOUSE.x + 0.15;
  const house = (roofPts && roofPts.length ? roofPts : [V(-HOUSE.x, HOUSE.eaves + 0.3, -0.5), V(HOUSE.x, HOUSE.eaves + 0.3, -0.5)]).concat([V(-X, 0, 0.1), V(X, 0, 0.1), V(X, HOUSE.eaves, 0.3), V(-X, HOUSE.eaves, 0.3), V(3.25, 0, 2.35)]);   /* walls, eaves, café table */
  const qs = house.map(proj), qc = CLEAR_PTS.map(proj);
  const logoTan = sign ? Math.abs(proj(sign.logoR).u - proj(sign.logoL).u) : 0;
  const kLogo = logoTan ? (LOGO_MIN.desktop + 3) / (logoTan * LOGO_INK) : 0;
  const solve = (g) => {
    const sxp = (q) => W / 2 + q.u * g.k + g.sx * W / 2, syp = (q) => H / 2 - q.v * g.k - g.sy * H / 2;
    let need = 0, maxX = -Infinity;
    for (const q of qc) { const y = syp(q); if (y >= r.y - 10 && y <= r.y + r.h + 10) need = Math.max(need, r.x + r.w + 10 - sxp(q)); }
    for (const q of qs) maxX = Math.max(maxX, sxp(q));
    return { need, room: W - 6 - maxX };
  };
  let g = f, s = solve(g);
  for (let i = 0; i < 16 && s.need > s.room + 0.5 && g.k > kLogo + 0.5; i++) {
    g = fitFrame(b.pos, b.look, pts, rects.ext, { ...opts, kFix: Math.max(kLogo, g.k * 0.992) }); s = solve(g);
  }
  const dx = Math.max(0, Math.min(s.need, s.room));
  return { ...g, pos: g.pos.clone(), look: g.look.clone(), sx: g.sx + dx / (W / 2), overlap: Math.max(0, s.need - dx), dbg: { need: s.need, room: s.room, k: g.k, k0: f.k, kLogo } };
}

/* the round 3-tier display (tiers r 0.80 / 0.56 / 0.32, top tier at 1.32 with the fabric book on its stand) and the
   hook stand beside it: everything fits above the bar on phones and beside the panel on desktop */
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
/* portrait screens (phones, portrait tablets): the display is wider than tall in a tall frame, so the frame is set by
   its width (v4 fixer, reviews #6 + #9):
   - the fit stops at x 1.14 on the right (the whole Americana bag charm, the stand's far arm tip may crop; it was cut in
     half at 1.02) and at the bottom tier's rim minus 2 cm on the left (no piece is cut), so the display keeps its size;
   - phones (a very tall free area): the camera rises and looks down on the tiers (pitch about 26 deg), so the tier tops and
     their pieces spread out, and the spare height goes to the arch with its fairy lights above, not to the chandelier
     and the rug; the base stands just above the bar.
   (__haven.tuneShelf overrides these for tests.) */
const SHELF_TALL = { pos: null, look: null, vBias: null, clipX: 1.14, rimX: 0.78,
  phone: { pos: V(0.2, 2.1, -2.2), look: V(0.22, 0.95, -4.6), vBias: 0.88 } };
function shelfFrame(rect = rects.shelf) {
  const sv = anchors.int.shelfView || SHELF_DEFAULT;
  const r = rect, ra = r.w / r.h, tall = ra < 1.15, TT = tall && ra < 0.9 ? SHELF_TALL : null, PH = TT && ra < 0.68 ? TT.phone : null;
  const look = (TT && TT.look ? TT.look : PH ? PH.look : sv.look).clone(); let pos = (TT && TT.pos ? TT.pos : PH ? PH.pos : sv.pos).clone();
  let pts = displayPts();
  /* portrait screens: the round display fills the width; the hook stand's far arm and foot may leave the frame (its
     pieces are in the drawer too), so the tiers read larger. Phones and portrait tablets (above their bar) keep only
     the stand's near arm. */
  const clipX = TT ? TT.clipX : 1.24;
  if (tall) pts = pts.map((p) => (p.x > clipX ? V(clipX, p.y, p.z) : p));
  if (TT && TT.rimX) { const cx = (anchors.int.display && anchors.int.display.isVector3 ? anchors.int.display : DISPLAY.c).x; pts = pts.map((p) => (p.x < cx - TT.rimX ? V(cx - TT.rimX, p.y, p.z) : p)); }
  const fovMax = tall ? 78 : lerp(72, 50, smooth(0.6, 1.5, W / H));
  /* the fit points stop at mid-base (y 0.42), so the frame crops through the fluted base like a product shot; the spare
     height goes mostly above the display (the arched niches) */
  const opts = { margin: tall ? 0.03 : 0.045, vBias: TT && TT.vBias !== null ? TT.vBias : PH ? PH.vBias : 0.72, fovMax: 140, fovMin: 14 };
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

/* ------------------------------------------------------------------ the walk in */
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
  html.dataset.flow = flow;
}

/* phones + tablets: straight through the doorway to the round display, about 4.6 s, eased from and to rest, an even
   glide through the door (where the warm bloom is), the head level and on the display all the way: no glances */
function buildDoorWalk() {
  const E = frames.exterior, S = frames.shelf, dur = WALK.door.dur, nf = naturalFov();
  const pts = [E.pos.clone()];
  for (const p of [V(0, 1.66, 2.8), V(0, 1.62, 0.7), V(0, 1.6, -0.55)]) if (p.z < E.pos.z - 0.8 && p.z > S.pos.z + 0.4) pts.push(p);
  pts.push(S.pos.clone());
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal'); curve.arcLengthDivisions = 400; curve.getLengths();
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
       the bar), so the screen centre never swings back and forth */
    /* the lens stays on the door frame's (narrower) angle while walking up to it, so the façade never seems to back away
       as the walk starts, and opens to the room's angle once through the doorway */
    fov: timedSpline([[0, E.fov, true], [tDoor, lerp(E.fov, S.fov, 0.28)], [dur, S.fov, true]]),
    sx: timedSpline(hold([[0, E.sx], [dur, S.sx]])),
    /* the bar hides as the walk starts: ease off most of its upward offset in the first second, so the lower screen is
       not bare cobbles, then on to the display frame */
    sy: timedSpline([[0, E.sy, true], [0.9, lerp(E.sy * 0.4, S.sy, 0.15)], [dur, S.sy, true]]),
    keys: { tDoor, dur, nf },
  };
}

/* desktop: the look-around. The visitor steps in and rests (a calm pause), looks slowly left over the bookcases and the
   reading corner, then slowly right past the display, the vintage shelves and the suitcase to the round café counter,
   looks up at the chandelier and the fairy lights, then glides to the round display. Each head turn is rest-to-rest at
   <= 20 deg/s; the position keeps drifting a little the whole time, so it never feels stop-start. */
function buildLookWalk() {
  const E = frames.exterior, S = frames.shelf, L = WALK.look, nf = naturalFov();
  const vHalf = rad(nf) / 2, hHalf = Math.atan(Math.tan(vHalf) * (W / H));
  const P0 = L.door.clone();
  const appr = [E.pos.clone()];
  for (const p of [V(0, 1.72, 4.2), V(0, 1.63, 1.05)]) if (p.z < E.pos.z - 0.8) appr.push(p);
  appr.push(P0.clone());
  const curve = new THREE.CatmullRomCurve3(appr, false, 'centripetal'); curve.arcLengthDivisions = 500; curve.getLengths();
  const tA = L.approach, easeA = pchip([0, 0.22, 0.7, 1], [0, 0.12, 0.86, 1]);
  const books = (anchors.int.booksLook && anchors.int.booksLook.isVector3) ? anchors.int.booksLook : GLANCE.gift;
  const cafe = (anchors.int.cafeLook && anchors.int.cafeLook.isVector3) ? anchors.int.cafeLook : GLANCE.cafe;
  const lantern = (anchors.int.lanternLook && anchors.int.lanternLook.isVector3) ? anchors.int.lanternLook : GLANCE.lantern;
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
      const last = k === fin, r = last ? 0.8 : L.ramp;
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
/* desktop ("wide": a fine pointer, >= 1024 px, landscape): the small street card + the narrow shelf panel; phones on
   their side ("short"): compact cards bottom-left; everything else (phones, tablets, narrow windows): bottom bars */
function layoutKind() {
  const short = H < 560 && W / H >= 1;
  if (short) return 'short';
  return !coarse && W >= 1024 && W / H >= 1.2 ? 'wide' : 'sheet';
}
const safeProbe = (() => {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
  document.body.appendChild(el);
  return () => { const c = getComputedStyle(el); return { l: parseFloat(c.paddingLeft) || 0, r: parseFloat(c.paddingRight) || 0 }; };
})();
/* the top of a bottom-anchored overlay, ignoring its show/hide transform */
function measureTop(el) { return H - (parseFloat(getComputedStyle(el).bottom) || 0) - el.offsetHeight; }
function computeRects() {
  const safe = safeProbe();
  const topClear = Math.max(48, sndBtn.offsetTop + sndBtn.offsetHeight + 6);
  if (html.classList.contains('lay-short')) {
    /* compact cards bottom-left: frame the scene in the space to their right */
    const right = (el) => (parseFloat(getComputedStyle(el).left) || 0) + el.offsetWidth + 8;
    const xe = right(extEl), xs = right(shelfEl);
    rects.ext = { x: xe, y: topClear - 4, w: Math.max(W * 0.4, W - xe - 8 - safe.r), h: H - topClear - 4 };
    rects.shelf = { x: xs, y: topClear - 4, w: Math.max(W * 0.4, W - xs - 8 - safe.r), h: H - topClear - 4 };
    rects.card = null;
    html.style.setProperty('--shelf-h', '0px');
    return;
  }
  if (html.classList.contains('lay-wide')) {
    /* the street: the house may rise under the small chip / sound pills (only sky and roof there); the card is handled by
       clearOfCard. The shelf: the display gets everything to the left of the narrow panel. */
    rects.card = { x: parseFloat(getComputedStyle(extEl).left) || 0, y: measureTop(extEl), w: extEl.offsetWidth, h: extEl.offsetHeight };
    rects.ext = { x: 14, y: 20, w: W - 28, h: H - 28 };
    /* the panel open: the display gets the space to its left; collapsed (a small card top right): the whole width, below
       the card's top row */
    const sl = shelfEl.offsetWidth > 0 ? shelfEl.offsetLeft : W;
    rects.shelf = drawerOpen ? { x: 10, y: topClear - 8, w: Math.max(W * 0.4, sl - 22), h: H - topClear + 2 }
      : { x: 10, y: topClear - 8, w: W - 20, h: H - topClear + 2 };
    html.style.setProperty('--shelf-h', '0px');
    return;
  }
  /* bars: the scene above them */
  const extTop = measureTop(extEl), shelfTop = measureTop(shelfEl);
  rects.card = null;
  rects.ext = { x: 8 + safe.l, y: topClear, w: W - 16 - safe.l - safe.r, h: Math.max(H * 0.35, extTop - topClear - 6) };
  rects.shelf = { x: 8 + safe.l, y: topClear, w: W - 16 - safe.l - safe.r, h: Math.max(H * 0.3, shelfTop - topClear - 8) };
  html.style.setProperty('--shelf-h', Math.round(H - shelfTop) + 'px');
}
function setLayoutClass(kind) {
  html.classList.toggle('lay-sheet', kind === 'sheet');
  html.classList.toggle('lay-short', kind === 'short');
  html.classList.toggle('lay-wide', kind === 'wide');
  /* the drawer: open by default on desktop, collapsed on phones and tablets (a visitor's own choice is kept) */
  const open = drawerUser !== null ? drawerUser : kind === 'wide';
  if (open !== drawerOpen) applyDrawer(open);
}
let laidSizes = '';
const overlaySizes = () => `${extEl.offsetWidth}x${extEl.offsetHeight}|${shelfEl.offsetWidth}x${shelfEl.offsetHeight}`;
function layout(o = {}) {
  if (state === 'fallback') return;   /* the no-WebGL page keeps its one plain layout */
  W = Math.max(1, canvas.clientWidth || innerWidth); H = Math.max(1, canvas.clientHeight || innerHeight);
  pixelRatio = prFor(W, H);
  if (renderer && (renderer.getPixelRatio() !== pixelRatio || layout.w !== W || layout.h !== H)) {
    /* only when something changed: a resize reallocates the (multisampled) drawing buffer */
    layout.w = W; layout.h = H;
    renderer.setPixelRatio(pixelRatio); renderer.setSize(W, H, false); if (wc) wc.setSize(W, H, pixelRatio);
  }
  const raw = layoutKind();
  /* the drawer opened / closed at the display, nothing else changed: only the display's frame moves (the street frame,
     the walk and the still's lens stay; the walk is rebuilt the next time it is needed, to end on the new frame) */
  if (o.tween && state === 'shelf' && sceneReady && frames.exterior && layout.raw === raw && layout.w === W && layout.h === H) {
    setLayoutClass(layout.kind); computeRects(); laidSizes = overlaySizes();
    const prevShelf = frames.shelf;
    frames.shelf = shelfFrame();
    glideShelf(prevShelf);
    walk = null;
    markDirty(); updateCamera(0);
    return;
  }
  let kind = raw;
  setLayoutClass(kind);
  computeRects();
  if (kind === 'wide' && scene) {
    /* the small card bottom-left; if the picture cannot slide clear of it (narrow windows), use the bottom bars */
    const f = exteriorFrame();
    if (f.overlap > 60) { kind = 'sheet'; setLayoutClass(kind); computeRects(); }
  }
  layout.raw = raw; layout.kind = kind; laidSizes = overlaySizes();
  if (!sceneReady) return;
  const prevShelf = frames.shelf;
  frames.exterior = exteriorFrame();
  frames.shelf = shelfFrame();
  frames.door = naturalFrame(VIEW_DOOR);
  frames.inside = naturalFrame(VIEW_INSIDE);
  if (W / H < 1) frames.inside.look.y += 0.2;   /* tall screens: less bare floor */
  if (o.tween) glideShelf(prevShelf);
  else if (camTween) camTween.b = frames.shelf;   /* a resize during the glide: keep gliding, to the new frame */
  buildWalk();
  placePosterLens();
  markDirty();
  updateCamera(0);
}
/* the drawer opened / closed at the display: glide the lens to the new free area instead of jumping */
function glideShelf(prevShelf) {
  if (!(prevShelf && state === 'shelf' && view === 'shelf' && !reduceMotion && revealed)) { if (camTween) camTween.b = frames.shelf; return; }
  /* from wherever the lens is now (a glide may still be running) */
  let from = { ...prevShelf };
  if (camTween) {
    const e = smooth(0, 1, camTween.t / camTween.dur);
    from = { pos: camera.position.clone(), look: V().lerpVectors(camTween.a.look, camTween.b.look, e), fov: camera.fov, sx: camTween.cur.sx, sy: camTween.cur.sy };
  }
  camTween = { a: from, b: frames.shelf, t: 0, dur: 0.45, cur: { sx: from.sx, sy: from.sy } };
}
function ensureWalk() { if (!walk || walk.flow !== (isDoorFlow() ? 'door' : 'look')) buildWalk(); }
let layoutQueued = false;
function queueLayout() { if (layoutQueued) return; layoutQueued = true; requestAnimationFrame(() => { layoutQueued = false; layout(); if (!running && renderer && firstFrame) renderOnce(); }); }

/* ------------------------------------------------------------------ the first-paint poster */
/* assets/poster-first.json (written by haven3d-tools/v4-posters.js): per poster key, the camera it was rendered with and
   where that camera's principal point and scale sit in the image. The live view uses the same camera position and
   target, so the two differ only by the lens (its angle and its shift).
   v4 fixer (review #1): the still never moves. Where CSS put it (centred, --os/--pa) is exact on its own canonical
   screen and close elsewhere; instead of sliding the still (a stuttering 0.5 s glide while the scene builds), the live
   camera takes the still's lens ("posterLens": the angle and shift that show exactly what the still shows where it
   lies), so the canvas fades in over it without a jump, and then eases its lens to the real framing over ~1.4 s after
   the reveal, with the idle drift. Under reduced motion the camera does not ease: the canvas simply dissolves (0.28 s)
   from the still to the real framing. */
let posterMeta = null, posterLens = null, lensK = 0, posterLensUsed = false;
function posterKey() { const m = /poster-first-([a-z]+)\.webp/.exec(firstImg.currentSrc || firstImg.src || ''); return m ? m[1] : null; }
function posterLensFor(f) {
  if (!posterMeta || !f || firstEl.hidden || state === 'fallback' || reduceMotion) return null;
  const key = posterKey(), m = posterMeta[key];
  const same = m && m.pos && m.look && f.pos.distanceTo(V(...m.pos)) < 0.01 && f.look.distanceTo(V(...m.look)) < 0.01;
  if (!same || !firstImg.complete || !firstImg.naturalWidth) return null;   /* another camera (a rare screen shape): dissolve */
  const r = firstImg.getBoundingClientRect();
  if (!(r.width > 0) || !(m.w > 0) || !(m.k > 0)) return null;
  const s = r.width / m.w, k0 = m.k * s, ppx = r.left + m.ppx * s, ppy = r.top + m.ppy * s;
  return { pos: f.pos.clone(), look: f.look.clone(), fov: deg(2 * Math.atan(H / (2 * k0))), sx: (ppx - W / 2) / (W / 2), sy: (H / 2 - ppy) / (H / 2), k: k0, W, H, key };
}
function placePosterLens() {
  if (revealed || !sceneReady || !frames.exterior) return;
  posterLens = posterLensFor(frames.exterior); lensK = posterLens ? 1 : 0; posterLensUsed = !!posterLens;
}
/* a lens between frame a (the live framing) and the still's lens b (w = 1: exactly the still): scale and shift move
   evenly in screen pixels */
const lensTmp = { pos: null, look: null, fov: 50, sx: 0, sy: 0 };
function lensMix(a, b, w, out = lensTmp) {
  const ka = H / (2 * Math.tan(rad(a.fov) / 2)), kb = H / (2 * Math.tan(rad(b.fov) / 2)), k = lerp(ka, kb, w);
  out.pos = a.pos; out.look = a.look; out.fov = deg(2 * Math.atan(H / (2 * k)));
  out.sx = lerp(a.sx, b.sx, w); out.sy = lerp(a.sy, b.sy, w);
  return out;
}
/* the live canvas fades in over the still (same camera, same lens at that moment: no visible jump); the still goes once
   it is covered */
function reveal() {
  if (revealed) return;
  revealed = true; clockT = 0;
  html.classList.add('live');
  setTimeout(() => { if (state !== 'fallback') firstEl.hidden = true; }, reduceMotion ? 350 : 650);
  if (pendingGo) { pendingGo = false; setGoBusy(false); if (state === 'exterior') startWalk(); }
}
function setGoBusy(on) { goBtn.classList.toggle('is-busy', on); if (on) goBtn.setAttribute('aria-busy', 'true'); else goBtn.removeAttribute('aria-busy'); }

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
    /* started while the lens was still easing from the still's: that lens fades out with the drift offset */
    if (walkLens0 && fade > 0) lensMix(camTmp, walkLens0, walkLens0.w * fade, camTmp);
    applyFrame(camTmp, offsetNow.copy(walkOffset0).multiplyScalar(fade));
  } else if (view === 'exterior') {
    offsetNow.set(0, 0, 0);
    if (!reduceMotion && DEBUG.t === null && revealed) {
      /* idle drift: a few cm, slow, never a loop you can see; it eases in after the reveal (the still had none) */
      const tt = clockT, k = smooth(0.4, 3.2, tt);
      offsetNow.set(0.045 * Math.sin(tt * 0.42) + 0.018 * Math.sin(tt * 0.17 + 1.3), 0.028 * Math.sin(tt * 0.31 + 0.7), 0.035 * Math.sin(tt * 0.23 + 2.1)).multiplyScalar(k);
      if (finePointer) {
        par.lerp(parTarget, 1 - Math.exp(-dt * 2.4));
        offsetNow.x += par.x * 0.16 * k; offsetNow.y += par.y * 0.07 * k;
      }
    }
    /* the still's lens until the reveal, then eased to the real framing (0.35 -> 1.75 s after it, with the drift) */
    if (posterLens) {
      lensK = revealed ? 1 - smooth(0.35, 1.75, clockT) : 1;
      if (lensK <= 0 || posterLens.W !== W || posterLens.H !== H) { posterLens = null; lensK = 0; }
    }
    applyFrame(posterLens ? lensMix(frames.exterior, posterLens, lensK) : frames.exterior, offsetNow);
  } else if (view === 'shelf' && camTween) {
    const a = camTween.a, b = camTween.b, e = smooth(0, 1, camTween.t / camTween.dur);
    camTmp.pos.lerpVectors(a.pos, b.pos, e); camTmp.look.lerpVectors(a.look, b.look, e);
    camTmp.fov = lerp(a.fov, b.fov, e); camTmp.sx = lerp(a.sx, b.sx, e); camTmp.sy = lerp(a.sy, b.sy, e);
    camTween.cur.sx = camTmp.sx; camTween.cur.sy = camTmp.sy;
    applyFrame(camTmp);
  } else {
    applyFrame(frames[view] || frames.shelf);
  }
  atmosphere(camera.position.z);
}

/* ------------------------------------------------------------------ atmosphere: warm light when passing the door */
const cO = { sky: new THREE.Color(), ground: new THREE.Color(), fog: new THREE.Color(), sun: new THREE.Color() };
const cI = { sky: new THREE.Color(), ground: new THREE.Color(), fog: new THREE.Color(), sun: new THREE.Color() };
let lastAtmoZ = null, lastWarmth = '0';
function applyAtmoColors() {
  cO.sky.set(ATMO.o.sky); cO.ground.set(ATMO.o.ground); cO.fog.set(ATMO.o.fog || '#F2DDCB'); cO.sun.set(ATMO.o.sunColor);
  cI.sky.set(ATMO.i.sky); cI.ground.set(ATMO.i.ground); cI.fog.set(ATMO.i.fog || '#F2E1CC'); cI.sun.set(ATMO.i.sunColor || '#FFD9B0');
  lastAtmoZ = null;
}
function atmosphere(z) {
  if (!hemi) return;
  const s = smooth(0.9, -1.2, z);                        /* 0 outside -> 1 inside */
  /* the threshold glow: a warm bloom as the camera passes the door (stronger on the straight walk in) */
  const door = flow === 'door';
  const bump = state === 'walking' && !reduceMotion ? Math.exp(-(((z + (door ? 0.15 : 0)) / (door ? 1.25 : 0.8)) ** 2)) * (door ? 1.7 : 1) : 0;
  renderer.toneMappingExposure = lerp(ATMO.o.exposure, ATMO.i.exposure, s) + (door ? 0.075 : 0.06) * bump;
  hemi.intensity = lerp(ATMO.o.hemi, ATMO.i.hemi, s) + 0.12 * bump;
  sun.intensity = lerp(ATMO.o.sun, ATMO.i.sun, s);
  sun.color.lerpColors(cO.sun, cI.sun, s);
  hemi.color.lerpColors(cO.sky, cI.sky, s); hemi.groundColor.lerpColors(cO.ground, cI.ground, s);
  if (scene.fog) { scene.fog.color.lerpColors(cO.fog, cI.fog, s); scene.fog.near = lerp(ATMO.o.fogNear, ATMO.i.fogNear, s); scene.fog.far = lerp(ATMO.o.fogFar, ATMO.i.fogFar, s); }
  const wv = revealed && bump > 0.002 ? Math.min(0.55, (door ? 0.3 : 0.2) * bump).toFixed(2) : '0';   /* never over the still (warm-up) */
  if (wv !== lastWarmth) { lastWarmth = wv; warmth.style.opacity = wv; }   /* a style write only when it changes */
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
  const vw = camera.view && camera.view.enabled ? camera.view : null;
  const sy = vw ? vw.offsetY / (vw.fullHeight / 2) : 0;
  const yN = clamp(-Math.tan(pitch) / t + sy, -1.6, 0.9);   /* eye-level line in NDC */
  const f = (yN + 1) / 2;                                    /* from the bottom of the screen */
  bg.repeat.set(1, 1 / (1 - f + 0.04)); bg.offset.set(0, -(f - 0.04) / (1 - f + 0.04));
}

/* ------------------------------------------------------------------ state machine + UI */
function setUI(s) {
  if (uiState === s) return; uiState = s; body.dataset.state = s;
  canvas.classList.toggle('cat-hot', s === 'walking' || !!hoverObj);   /* during the walk a click skips ahead */
  extEl.inert = !(s === 'exterior' || s === 'fallback' || s === 'loading');
  shelfEl.inert = !(s === 'shelf' || s === 'fallback');
  if (skipBtn) { skipBtn.inert = s !== 'walking'; if (s !== 'walking' && document.activeElement === skipBtn) setTimeout(() => { if (state !== 'walking' && document.activeElement === skipBtn) skipBtn.blur(); }, 0); }
  html.dataset.flow = flow;
}
function setState(s) {
  const prev = state;
  state = s; setUI(s); markDirty();
  /* the product photos (17 x ~50 KB): on desktop the panel is open at the display, so they load while the camera walks
     in; on phones and tablets the drawer starts closed, so they wait until it opens (or the handle is touched/focused);
     the tap card loads its own photo */
  if ((s === 'walking' && html.classList.contains('lay-wide')) || ((s === 'shelf' || s === 'fallback') && drawerOpen)) loadRowImages();
  if (s === 'shelf' && prev !== 'shelf') showNudge(); else if (s !== 'shelf') hideNudge();
}
/* phones + tablets (review #5): nothing else says the 3D pieces can be tapped while the drawer is closed. On arriving at
   the display, a small paper chip above the bar says so (the approved line), once per visit; it goes after ~5 s, on the
   first touch of the scene or when the drawer opens. */
let nudgeTimer = 0;
function showNudge() {
  if (!nudgeEl || html.classList.contains('lay-wide') || state !== 'shelf') return;
  try { if (sessionStorage.getItem('haven3d.nudge')) return; sessionStorage.setItem('haven3d.nudge', '1'); } catch (e) { /* storage blocked: show it */ }
  clearTimeout(nudgeTimer);
  nudgeEl.hidden = false;
  nudgeTimer = setTimeout(() => {
    if (state !== 'shelf' || drawerOpen) { hideNudge(); return; }
    nudgeEl.classList.add('on');
    nudgeTimer = setTimeout(hideNudge, 5200);
  }, reduceMotion ? 250 : 650);
}
function hideNudge() {
  if (!nudgeEl || nudgeEl.hidden) return;
  clearTimeout(nudgeTimer);
  nudgeEl.classList.remove('on');
  nudgeTimer = setTimeout(() => { nudgeEl.hidden = true; }, 320);
}
function goTo(name) {
  if (!scene) return;
  closePick(); setHover(null);
  walkFrozen = false; camTween = null; walkLens0 = null;
  if (revealed) { posterLens = null; lensK = 0; }   /* the still's lens only ever leads into the first live view */
  if (name === 'exterior' || name === 'start') { view = 'exterior'; setState('exterior'); }
  else if (name === 'shelf') { view = 'shelf'; setState('shelf'); }
  else if (name === 'door' || name === 'inside') { view = name; setState(name); }
  else { console.warn(`[haven3d] goTo: unknown view "${name}" (exterior | door | inside | shelf)`); return; }
  updateCamera(0);
  if (!running) renderOnce();
}
function walkAt(sec) {
  if (!scene) return;
  closePick(); setHover(null); ensureWalk();
  walkT = clamp(+sec || 0, 0, WALK_DUR); walkFrozen = true; walkOffset0.set(0, 0, 0);
  setState('walking'); updateCamera(0);
  if (!running) renderOnce();
}
function startWalk() {
  if (state !== 'exterior' || cutting) return;
  bell();
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  if (reduceMotion) { cut(() => { goTo('shelf'); focusOpen(); }, 0.1, 0.15); return; }     /* 0.25 s cream crossfade */
  ensureWalk();
  walkOffset0.copy(offsetNow); walkT = 0; walkFrozen = false; walkStartedAt = performance.now(); walkFresh = true;
  /* still easing from the still's lens: the walk starts from the lens on screen and that difference fades out */
  walkLens0 = posterLens && lensK > 0 ? { fov: posterLens.fov, sx: posterLens.sx, sy: posterLens.sy, w: lensK } : null;
  posterLens = null; lensK = 0;
  setState('walking'); wake();
  /* keyboard users land on the small skip control (Enter skips); a mouse or touch user sees no focus ring */
  if (skipBtn) setTimeout(() => { if (state === 'walking') skipBtn.focus({ preventScroll: true }); }, 30);
}
function finishWalk() { view = 'shelf'; setState('shelf'); walkFrozen = false; updateCamera(0); focusOpen(); }
function fastForward() { if (state !== 'walking' || cutting || walkFrozen) return; cut(finishWalk, 0.16, 0.3); }
function restart() { if (cutting) return; cut(() => { goTo('exterior'); goBtn.focus({ preventScroll: true }); }, reduceMotion ? 0.1 : 0.22, reduceMotion ? 0.15 : 0.4); }
function focusOpen() {
  const f = () => { const o = $('#open'); if (o && !shelfEl.inert && state === 'shelf' && document.activeElement !== o && (!document.activeElement || document.activeElement === body)) o.focus({ preventScroll: true }); };
  setTimeout(f, 40); setTimeout(f, 450);   /* again once the panel has faded in (a busy first frame can swallow the first try) */
}
function cut(fn, a, b) {
  cutting = true; clearTimeout(cutTimer); wake();
  veil.style.transition = `opacity ${a}s ease`; veil.style.opacity = '1';
  cutTimer = setTimeout(() => {
    try { fn(); } finally {
      markDirty(); if (!running) renderOnce();
      veil.style.transition = `opacity ${b}s ease`; veil.style.opacity = '0';
      setTimeout(() => { cutting = false; }, b * 1000);
    }
  }, a * 1000 + 20);
}

/* ------------------------------------------------------------------ the "On this shelf" drawer */
function applyDrawer(open) {
  drawerOpen = open;
  shelfEl.classList.toggle('open', open);
  handleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open && (state === 'shelf' || state === 'fallback')) loadRowImages();
  if (open) hideNudge();
}
function toggleDrawer() {
  drawerUser = !drawerOpen; applyDrawer(drawerUser);
  if (state === 'fallback') return;
  closePick();
  layout({ tween: true });   /* the drawer's final size is immediate (only its contents fade in): re-fit at once */
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
    const lit = (on) => { litId = on ? it.id : (litId === it.id ? null : litId); markDirty(); };
    a.addEventListener('pointerenter', () => lit(true)); a.addEventListener('pointerleave', () => lit(false));
    a.addEventListener('focus', () => lit(true)); a.addEventListener('blur', () => lit(false));
    li.appendChild(a); frag.appendChild(li);
  }
  rowEl.appendChild(frag);
  rowEl.addEventListener('wheel', (e) => {
    if (html.classList.contains('lay-wide')) return;   /* the desktop grid scrolls vertically by itself */
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || rowEl.scrollWidth <= rowEl.clientWidth + 2) return;
    rowEl.scrollLeft += e.deltaY; e.preventDefault();
  }, { passive: false });
}

/* ------------------------------------------------------------------ picking on the shelf */
const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2(), box = new THREE.Box3(), tmpV = V();
raycaster.layers.enableAll();   /* the sign face and the real Merlin photo live on layer 1 */
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
  hoverObj = o; markDirty();
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
  pickObj = o; markDirty();
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
  /* the card can open right under the finger: the tap's own click, which follows the pointerup a few ms later, must not
     land on its link or its close button */
  pickEl.style.pointerEvents = 'none'; clearTimeout(openPick.guard);
  openPick.guard = setTimeout(() => { pickEl.style.pointerEvents = ''; }, 450);
  requestAnimationFrame(() => pickEl.classList.add('on'));
}
/* the bars: if the tapped piece sits under where the card opens, the card opens at the top of the screen instead, so the
   piece stays in sight and the next tap can reach it */
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
  pickObj = null; markDirty();
  pickEl.classList.remove('on');
  setTimeout(() => { if (!pickObj) pickEl.hidden = true; }, 220);
}
/* the open door is a doorway too: hover shows the logo-cat pointer, a click or tap steps inside */
const doorA = V(), doorB = V();
function inDoor(x, y) {
  if (state !== 'exterior' || !camera || !revealed) return false;
  const d = anchors.ext.door, cx = d ? d.x : 0;
  doorA.set(cx - DOOR.x, 0, 0.05).project(camera); doorB.set(cx + DOOR.x, DOOR.h, 0.05).project(camera);
  const x0 = (doorA.x + 1) / 2 * W, x1 = (doorB.x + 1) / 2 * W, y0 = (1 - doorA.y) / 2 * H, y1 = (1 - doorB.y) / 2 * H;
  return x >= Math.min(x0, x1) && x <= Math.max(x0, x1) && y >= Math.min(y0, y1) && y <= Math.max(y0, y1);
}
let downAt = null;
/* a tap = little movement and a short press, timed by the events' own timestamps (a busy frame between the two
   handlers must not turn a quick tap into a "long press") */
function onPointerDown(e) { downAt = { x: e.clientX, y: e.clientY, t: e.timeStamp, type: e.pointerType }; if (e.pointerType !== 'mouse') hideNudge(); }
function onPointerUp(e) {
  const d = downAt; downAt = null;
  if (state === 'walking' || !revealed) return;             /* the walk: handled by the fast-forward listener */
  if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 12 || e.timeStamp - d.t > 700) return;
  if (state === 'exterior' && !cutting && (e.pointerType !== 'mouse' || e.button === 0) && inDoor(e.clientX, e.clientY)) { startWalk(); return; }
  if (state !== 'shelf' || cutting) return;
  let o = pickAt(e.clientX, e.clientY);
  if (e.pointerType === 'mouse') {
    if (e.button !== 0) return;
    if (o) navigate(pickInfo(o).href, e.clientX, e.clientY);
    return;
  }
  /* touch / pen: first tap shows the card, a second tap on the same piece opens it */
  if (!o) o = pickNear(e.clientX, e.clientY);
  if (!o) {
    /* a tap on empty scene: closes the card, else an open drawer (a bottom sheet closes when you tap outside it) */
    if (!pickObj && drawerOpen && !html.classList.contains('lay-wide')) { toggleDrawer(); return; }
    closePick(); return;
  }
  if (pickObj === o) { navigate(pickInfo(o).href, e.clientX, e.clientY); return; }
  openPick(o);
}
function onPointerMove(e) {
  if (e.pointerType === 'mouse') {
    parTarget.set((e.clientX / W) * 2 - 1, -((e.clientY / H) * 2 - 1));
    pointerXY.x = e.clientX; pointerXY.y = e.clientY; pointerMoved = true;
    if (!running) wake();      /* the hover label / the door cursor need a frame (the street is drawn every frame anyway) */
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
    const before = h.a;
    h.a += (want - h.a) * (dt > 0 ? k : 1);
    if (Math.abs(want - h.a) < 0.002) h.a = want;
    o.position.y = h.y + 0.028 * h.a;
    o.scale.copy(h.s).multiplyScalar(1 + 0.06 * h.a);
    if (h.a !== before) active = true;   /* it moved this frame (the last small snap included): draw it */
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
  const [tex, props, ext, int, wcm] = await Promise.all([
    STUB.lib ? null : tryImport('./textures.js', 'makeTextures', 'textures'),
    STUB.lib ? null : tryImport('./props.js', 'makeProps', 'props'),
    STUB.ext ? null : tryImport('./exterior.js', 'buildExterior', 'exterior'),
    STUB.int ? null : tryImport('./interior.js', 'buildInterior', 'interior'),
    PAINT ? tryImport('./watercolor.js', 'createWatercolor', 'watercolour') : null,
  ]);
  /* the stub library only when something real is missing (it is also fetched later if a real builder throws) */
  const stubLib = stubbed.length || !tex || !props ? await import('./_stub-lib.js') : null;
  return { tex, props, ext, int, stubLib, wcm };
}
/* builders may also come as step generators (buildExteriorSteps / buildInteriorSteps(THREE, ctx): yield between
   phases, return the builder result): main then gives the browser a turn after every step (input, the poster), so no
   single build task has to be long. Plain builders are called in one go. */
async function attemptSteps(label, mod, name, args, stub) {
  const gen = mod && typeof mod[name + 'Steps'] === 'function' ? mod[name + 'Steps'] : null;
  if (gen) {
    try {
      /* time-sliced: steps run back to back until ~12 ms have passed, then the browser gets a turn (a tap on Skip,
         the poster's paint); boot.steps records the slices (count, the longest and the step it ended on) */
      const st = boot.steps[label] = { slices: 0, steps: 0, max: 0, maxAt: '', top: [] };
      const it = gen(...args); let t0 = performance.now(), ts = t0, prev = 'start', r = it.next();
      while (!r.done) {
        st.steps++;
        const now = performance.now();
        /* the longest single steps (a step = the code between two yields, named by the yield that ends it) */
        const sd = now - ts; if (sd > 40) { st.top.push([String(r.value), Math.round(sd), prev]); st.top.sort((x, y) => y[1] - x[1]); st.top.length = Math.min(st.top.length, 6); }
        prev = String(r.value);
        if (now - t0 >= 12) {
          const d = now - t0; st.slices++;
          if (d > st.max) { st.max = Math.round(d); st.maxAt = String(r.value); }
          await yieldMain(); t0 = performance.now();
        }
        ts = performance.now(); r = it.next();
      }
      const d = performance.now() - t0; st.slices++; if (d > st.max) { st.max = Math.round(d); st.maxAt = 'end'; }
      if (r.value) return r.value;
    } catch (e) { console.warn(`[haven3d] ${label} (steps) threw (${(e && e.message) || e}); trying the plain builder.`, e); }
  }
  return attempt(label, mod && typeof mod[name] === 'function' ? () => mod[name](...args) : null, stub);
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
/* look=paint only: the pristine layer. The sign face and the real Merlin photo (and a crisp copy of the embroidered
   cover) go on layer 1, which the paint never touches. Builders set mesh.layers.set(1) themselves; this is the safety
   net that finds them by their textures. In the 3D look the camera simply sees both layers. */
function markPristine(root) {
  if (!PAINT) return [];
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
  placeSun(); sun.target.position.copy(SUN_TARGET);
  scene.add(sun, sun.target);
  const sc = sun.shadow.camera;
  sc.left = -9.5; sc.right = 9.5; sc.top = 8.5; sc.bottom = -7.5; sc.near = 4; sc.far = 52; sc.updateProjectionMatrix();
  sun.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = TOUCH_SH ? 2.2 : 4;
  setShadows(quality === 'high' || TOUCH_SH, true);
}
/* the sun's direction: main's default, or the builders' ATMO.o.sunDir for this look (the direction TO the sun; the
   clean 3D look takes the exterior's lower, more raking sun). The shadow box (+-9.5 m round the target) covers both. */
const SUN_TARGET = V(0, 0.5, -2.2), SUN_DIR0 = [-0.56, 0.47, 0.68];
function placeSun() {
  const d = ATMO.o.sunDir, ok = Array.isArray(d) && d.length === 3 && d.every((v) => Number.isFinite(+v)) && Math.hypot(+d[0], +d[1], +d[2]) > 1e-3;
  const dir = V(...(ok ? d.map(Number) : SUN_DIR0)).normalize();
  sun.position.copy(SUN_TARGET).addScaledVector(dir, 26); sun.updateMatrixWorld();
}
function setShadows(on, initial) {
  renderer.shadowMap.enabled = on; sun.castShadow = on; shadowDirty = true;
  if (!initial && scene) scene.traverse((o) => { if (o.material) for (const m of [].concat(o.material)) m.needsUpdate = true; });
  markDirty();
}
/* the builders' own atmosphere tuning (see ATMO_BY_LOOK) */
const TM = { aces: THREE.ACESFilmicToneMapping, agx: THREE.AgXToneMapping, neutral: THREE.NeutralToneMapping };
function mergeAtmo() {
  for (const src of [EXTB && EXTB.atmo, anchors.ext.atmo, INTB && INTB.atmo, anchors.int.atmo]) {
    if (!src || typeof src !== 'object') continue;
    const o = src[LOOK] || null;
    if (!o) continue;
    if (o.o) Object.assign(ATMO.o, o.o);
    if (o.i) Object.assign(ATMO.i, o.i);
    if (Number.isFinite(o.env)) ATMO.env = o.env;
    if (o.toneMapping && TM[o.toneMapping]) ATMO.toneMapping = o.toneMapping;
  }
  if (DEBUG.tm && TM[DEBUG.tm]) ATMO.toneMapping = DEBUG.tm;
  renderer.toneMapping = TM[ATMO.toneMapping] || THREE.ACESFilmicToneMapping;
  if (scene.environment) scene.environmentIntensity = ATMO.env;
  applyAtmoColors();
  placeSun();
}

/* ------------------------------------------------------------------ adaptive quality (only while idle at the street) */
const adapt = { on: !FORCED_Q, start: 0, samples: [], step: 0, lastMed: 0, lastWasPr: false, busy: false };
function adaptTick(now, dtMs, rendered) {
  if (!adapt.on || !revealed || document.hidden || adapt.busy) return;
  /* only at the street (the animals keep it drawing every frame) and never during a walk, a cut or a lens glide: a
     quality step is a new pixel ratio or a shader recompile, which must not land in the middle of a movement */
  if (state !== 'exterior' || cutting || DEBUG.t !== null || clockT < 1.2) { adapt.start = 0; adapt.samples.length = 0; return; }
  if (!adapt.start) { adapt.start = now; return; }
  const since = now - adapt.start;
  if (since > 300 && dtMs < 1500 && rendered) adapt.samples.push(dtMs);   /* skip real stalls (tab switch, alert) */
  if (since < 2400 || (adapt.samples.length < 8 && since < 7000)) return;
  if (adapt.samples.length < 6) { adapt.samples = []; adapt.start = now; return; }
  const s = adapt.samples.sort((a, b) => a - b), med = s[Math.floor(s.length / 2)];
  adapt.samples = []; adapt.start = now;
  if (med <= 21.5) { adapt.on = false; return; }               /* ~46 fps or better: keep what we have */
  /* a fewer-pixels step that left the frame cadence where it was (a 30 Hz power-saving cap, or a CPU-bound device):
     more pixel cuts would only blur the picture, so stop here */
  if (adapt.lastWasPr && adapt.lastMed && Math.abs(med - adapt.lastMed) < adapt.lastMed * 0.1) { adapt.on = false; return; }
  adapt.lastMed = med;
  const setPr = (v) => { v = Math.max(PR_FLOOR, Math.round(v * 100) / 100); if (v >= pixelRatio - 0.01) return false; prLimit = v; queueLayout(); return true; };
  const steps = [
    () => setPr(pixelRatio * 0.75),
    () => { if (!PAINT || paintQ === 'low' || !wc) return false; paintQ = 'low'; wc.setQuality('low'); markDirty(); return true; },   /* half-res R3 paint */
    () => { if (!renderer.shadowMap.enabled) return false; quality = 'low'; setShadows(false); rewarm(); return true; },
    () => setPr(1),
  ];
  while (adapt.step < steps.length) { const i = adapt.step++; if (steps[i]()) { adapt.lastWasPr = i === 0 || i === 3; return; } }
  adapt.on = false;
}
/* after a step that changes shaders (shadows off): compile the new programs now, while idle, not at the door */
async function rewarm() {
  adapt.busy = true;
  try {
    renderer.setRenderTarget(PAINT && wc && wc.enabled ? wc.targets.scene : null);
    const lods = lodsAllVisible();
    if (renderer.compileAsync && renderer.extensions.has('KHR_parallel_shader_compile')) await Promise.race([renderer.compileAsync(scene, camera), timeout(8000)]); else renderer.compile(scene, camera);
    lodsRestore(lods);
  } catch (e) { /* compiles on first use */ }
  renderer.setRenderTarget(null);
  adapt.busy = false;
}

/* ------------------------------------------------------------------ frame loop: every frame while anything moves, none when still */
function wake() { if (!running && revealed && !document.hidden && renderer && state !== 'fallback') start(); }
function markDirty() { dirty = true; wake(); }
function frame(now) {
  rafId = requestAnimationFrame(frame);
  const dtMs = lastNow ? now - lastNow : 16.7; lastNow = now;
  const raw = dtMs / 1000;
  const dt = clamp(raw, 0, 0.1);
  /* the walk's clock: real time, but one slow frame (a stall, a GC) moves it on by at most ~1.6 average frames, so the
     camera glides on instead of jumping; a steadily slow device still walks at real speed */
  dtAvg += (clamp(raw, 0.004, 0.1) - dtAvg) * 0.12;
  const dtWalk = Math.min(clamp(raw, 0, 0.25), Math.max(dtAvg * 1.6, 1 / 45));
  fpsEMA = lerp(fpsEMA, clamp(raw, 0.001, 0.5), 0.06);
  clockT += dt;
  if (state === 'walking' && !walkFrozen) {
    walkT += walkFresh ? 0 : dtWalk;
    walkFresh = false;
    if (walkT >= WALK_DUR - 0.5) setUI('shelf');
    if (walkT >= WALK_DUR) { walkT = WALK_DUR; finishWalk(); }
    if (skipRing) { const v = (1 - clamp(walkT / WALK_DUR, 0, 1)).toFixed(3); if (v !== skipRing.__v) { skipRing.__v = v; skipRing.style.strokeDashoffset = v; } }
  }
  if (camTween) { camTween.t += dtWalk; if (camTween.t >= camTween.dur) { camTween = null; dirty = true; } }
  const tweening = !!camTween;
  updateCamera(dt);
  const hovering = updateHover(dt);
  const animT = DEBUG.t !== null ? DEBUG.t : reduceMotion ? 1.5 : clockT, animDt = DEBUG.t !== null || reduceMotion ? 0 : dt;
  const camZ = camera.position.z;
  const street = streetVisible();
  if (EXTB && EXTB.update && !updateBroken.ext && street) guardedUpdate('ext', EXTB, animT, animDt);
  if (INTB && INTB.update && !updateBroken.int) guardedUpdate('int', INTB, animT, animDt);
  /* what moves: the walk, a cut, a lens glide, a hover easing, and the street itself (the cat, the guests, the dog, the
     idle drift) unless reduced motion or a frozen clock holds them; builders can flag their own clocks (INTB.animated) */
  const streetAlive = street && !reduceMotion && DEBUG.t === null;
  const roomAlive = !!(INTB && INTB.animated) && !reduceMotion && DEBUG.t === null;
  const lensEasing = !!posterLens && revealed && view === 'exterior';   /* the first view's lens settling after the reveal */
  const moving = (state === 'walking' && !walkFrozen) || cutting || tweening || hovering || streetAlive || roomAlive || lensEasing;
  let rendered = false;
  if (moving || dirty) { render(camZ, animT); rendered = true; idleFrames = 0; }
  else if (++idleFrames > 2) stop();      /* all still: no frames at all until something changes (wake) */
  adaptTick(now, dtMs, rendered);
  if (DEBUG.stats && (frameNo % 15 === 0)) drawStats();
}
function guardedUpdate(key, mod, t, dt) {
  try { mod.update(t, dt); } catch (e) { updateBroken[key] = true; console.warn(`[haven3d] ${key} update() threw; it is switched off for this visit.`, e); }
}
/* interior shadow casters only matter once the visitor is at the door (from the street the room is seen through glass) */
const EXT_UPDATE_Z = -1.7;   /* deeper inside, the street is behind the camera: its animation and shadow redraws pause */
/* can the camera see the street (the animals, the café guests)? Not once it is inside looking into the room — wherever
   the shelf frame puts it (tall phones back it up to z -1.3): then nothing moves on its own and frames stop */
const sdTmp = V();
function streetVisible() {
  const z = camera.position.z;
  if (z <= EXT_UPDATE_Z) return false;
  camera.getWorldDirection(sdTmp);
  return !(z < -0.55 && sdTmp.z < -0.3);
}
let intCasters = null, intCastOn = true;
function shadowCasters(camZ) {
  if (!intCasters) { intCasters = []; if (INTB && INTB.group) INTB.group.traverse((o) => { if (o.isMesh && o.castShadow) intCasters.push(o); }); }
  const on = camZ < 1.2;
  if (on === intCastOn) return;
  intCastOn = on; for (const o of intCasters) o.castShadow = on;
}
/* At the threshold (the camera close to the door, looking in), the house front fills the whole view: the far scenery
   and the side gardens are hidden behind it, so they are skipped. Inside, the exterior's own rule hides everything but
   the shell; this only covers the street side of the door. */
const THRESH_RE = /^ext-far|^ext-farBack|:garden$/;
let threshList = null, threshOn = false;
const threshDir = V();
let castGroup = undefined, castHidden = false;   /* the cast's skinned meshes (ext:cast:*) */
function thresholdCull() {
  if (!EXTB || !EXTB.group) return;
  if (!threshList) { threshList = []; EXTB.group.traverse((o) => { if (o.isMesh && THRESH_RE.test(o.name || '')) threshList.push(o); }); }
  const p = camera.position; camera.getWorldDirection(threshDir);
  /* once the camera is through the door plane looking in, the cast (all at z > 0.5) is behind it */
  if (castGroup === undefined) { castGroup = []; EXTB.group.traverse((o) => { if (o.isMesh && /^ext:cast:/.test(o.name || '')) castGroup.push(o); }); }
  const hide = p.z < 0.3 && threshDir.z < -0.5;
  if (hide !== castHidden) { castHidden = hide; for (const o of castGroup) o.visible = !hide; }
  const inside = p.z < -0.55 && threshDir.z < -0.3;
  const want = !inside && p.z < 4.3 && threshDir.z < -0.5 && Math.abs(p.x) < 1.2;
  if (want === threshOn) return;
  threshOn = want;
  if (!inside) for (const o of threshList) o.visible = !want;
}
/* look=paint: the paint at the round display (crisper, so the crochet pieces read): eased in over the last second of
   the walk, held at the shelf, restored everywhere else */
const SHELF_LOOK_BASE = { detail: 0.55, sharp: 900, edge: 2.4 };
let SHELF_LOOK = SHELF_LOOK_BASE;
function updateShelfLook() {
  if (!PAINT || !wc || !baseLook) return;
  const k = state === 'shelf' ? 1 : state === 'walking' ? smooth(WALK_DUR - 1.6, WALK_DUR - 0.25, walkT) : 0;
  if (Math.abs(k - shelfLookK) < 1e-4) return;
  shelfLookK = k;
  const o = {};
  for (const key in SHELF_LOOK) o[key] = lerp(baseLook[key], SHELF_LOOK[key], k);
  wc.setLook(o);
}
const LAYERS_3D = (1 << 0) | (1 << 1);
function draw(t) {
  if (PAINT && wc) wc.render(scene, camera, BOIL ? t : 0);   /* the boil is off by default: a still frame stays still */
  else { camera.layers.mask = LAYERS_3D; renderer.setRenderTarget(null); renderer.render(scene, camera); }
}
function render(camZ = camera.position.z, t = DEBUG.t !== null ? DEBUG.t : clockT) {
  thresholdCull();
  updateShelfLook();
  /* the paint: the sun's shadow map is redrawn every frame outside; inside it is static, so rarely. The 3D look
     (STATIC_SH): drawn once, when something changed it (the first frame, a quality step), with every caster on */
  if (renderer.shadowMap.enabled) {
    if (STATIC_SH) {
      /* drawn from inside (a visit that starts at the display): the exterior had hidden its street parts, so the map is
         drawn again the first time the street is in view */
      const sv = streetVisible();
      if (shadowInside && sv) shadowDirty = true;
      if (shadowDirty) shadowInside = !sv;
      renderer.shadowMap.needsUpdate = shadowDirty; shadowDirty = false;
    }
    else { shadowCasters(camZ); renderer.shadowMap.needsUpdate = streetVisible() || frameNo % 45 === 0; }
  }
  renderer.info.reset();                     /* one frame = all its passes */
  draw(t);
  frameNo++; frameCount++; dirty = false;
  lastCalls = renderer.info.render.calls; lastTris = renderer.info.render.triangles;
}
function renderOnce() { if (!renderer || !scene) return; updateCamera(0); updateHover(0); render(); }
function start() { if (running) return; running = true; lastNow = 0; idleFrames = 0; rafId = requestAnimationFrame(frame); }
function stop() { running = false; cancelAnimationFrame(rafId); }
function drawStats() {
  const i = info();
  statsEl.hidden = false;
  statsEl.textContent = `fps ${i.fpsEstimate}  calls ${i.calls}  tris ${(i.triangles / 1000).toFixed(1)}k  frames ${i.frameCount}\n` +
    `tex ${i.textures}  geo ${i.geometries}  q ${i.quality}${i.paint ? '/' + i.paint.quality : ''}  pr ${i.pixelRatio}  look ${i.look}\n` +
    `state ${i.state}  logo ${i.logoPx}px  lights ${i.lights}  ${running ? 'live' : 'still'}`;
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
    programs: renderer && renderer.info.programs ? renderer.info.programs.length : 0,
    quality, pixelRatio, fpsEstimate: Math.round((1 / fpsEMA) * 10) / 10, look: LOOK, msaa: !!(renderer && renderer.getContext().getContextAttributes().antialias),
    state, view, flow, layout: ['wide', 'sheet', 'short'].find((k) => html.classList.contains('lay-' + k)), drawer: drawerOpen,
    logoPx: logoPx(), signWidth: sign ? +sign.width.toFixed(2) : null, lights, revealed, running, frameCount,
    stubs: { ...STUB, ...usedStubs }, paint: wc ? wc.info() : null, pristine: pristineFound, boot: { ...boot.marks, warm: boot.warm, steps: boot.steps },
    poster: { key: posterKey(), lens: posterLensUsed, lensK: +lensK.toFixed(3), hidden: firstEl.hidden },
  };
}
const usedStubs = {};
let pristineFound = [];

/* ------------------------------------------------------------------ warm-up: nothing compiles or uploads mid-walk */
function lodsAllVisible() {
  const saved = [];
  scene.traverse((o) => { if (o.isLOD) { saved.push([o, o.autoUpdate, o.levels.map((l) => l.object.visible)]); o.autoUpdate = false; for (const l of o.levels) l.object.visible = true; } });
  return saved;
}
function lodsRestore(saved) { for (const [o, au, vis] of saved) { o.autoUpdate = au; o.levels.forEach((l, i) => { l.object.visible = vis[i]; }); } }
function sceneTextures() {
  const set = new Set();
  const add = (v) => { if (v && v.isTexture && !v.isRenderTargetTexture) set.add(v); };
  scene.traverse((o) => {
    for (const m of [].concat(o.material || [])) {
      if (!m) continue;
      for (const k in m) add(m[k]);
      if (m.uniforms) for (const k in m.uniforms) add(m.uniforms[k] && m.uniforms[k].value);
    }
  });
  add(scene.background);
  return [...set].filter((t) => {
    const img = t.image;
    if (!img || t.version === 0) return false;
    if (typeof HTMLImageElement !== 'undefined' && img instanceof HTMLImageElement && !img.complete) return false;
    return true;
  });
}
async function warmUp() {
  const t0 = performance.now(), W0 = W, H0 = H;
  /* the longest stretch between two yields (and where it ended), for boot.warm */
  let wl = t0; boot.warm.maxTask = 0;
  const wy = async (lab) => { const d = performance.now() - wl; if (d > boot.warm.maxTask) { boot.warm.maxTask = Math.round(d); boot.warm.maxAt = lab; } await yieldMain(); wl = performance.now(); };
  const target = PAINT && wc && wc.enabled ? wc.targets.scene : null;
  /* 1. every program: all LOD levels shown, compiled for the target the frames really use */
  const lods = lodsAllVisible();
  try {
    renderer.setRenderTarget(target);
    /* parallel compile where the driver offers it (KHR_parallel_shader_compile); otherwise one plain compile */
    if (renderer.compileAsync && renderer.extensions.has('KHR_parallel_shader_compile')) await Promise.race([renderer.compileAsync(scene, camera), timeout(9000)]);
    else renderer.compile(scene, camera);
  } catch (e) { /* compiles on first use */ }
  renderer.setRenderTarget(null);
  boot.warm.compile = Math.round(performance.now() - t0);
  await wy('compile');
  /* 2. every texture uploaded (the shelf's pieces, the far LOD levels): small ones a few per task, a big one (1024²
     with its mipmaps) in a task of its own */
  const t1 = performance.now(), texs = sceneTextures();
  let px = 0;
  for (let i = 0; i < texs.length; i++) {
    try { renderer.initTexture(texs[i]); } catch (e) { /* uploads on first use */ }
    const im = texs[i].image; px += im && im.width ? im.width * (im.height || 1) : 0;
    if (px >= 5e5 || i === texs.length - 1) { px = 0; await wy('textures'); }
  }
  boot.warm.textures = Math.round(performance.now() - t1); boot.warm.textureCount = texs.length;
  await wy('textures-end');
  /* 3. every geometry uploaded + the shadow pass's programs: the whole scene, in slices of ~32k triangles, drawn into a
     1x1 pixel of the (still hidden) canvas with culling off */
  const t2 = performance.now();
  const objs = [], hidden = [];
  scene.traverse((o) => { if (!o.visible && !o.isLight) { hidden.push(o); o.visible = true; } if ((o.isMesh || o.isPoints || o.isLine || o.isSprite) && o.geometry) objs.push(o); });
  const saved = objs.map((o) => [o, o.frustumCulled]);
  const tris = (o) => { const g = o.geometry, n = g.index ? g.index.count : (g.attributes.position ? g.attributes.position.count : 0); return (n / 3) * (o.isInstancedMesh ? Math.max(1, o.count) : 1); };
  const slices = []; let cur = [], acc = 0;
  for (const o of objs) { cur.push(o); acc += tris(o); if (acc > 32000 || cur.length > 80) { slices.push(cur); cur = []; acc = 0; } }
  if (cur.length) slices.push(cur);
  const vp = new THREE.Vector4(), sc = new THREE.Vector4();
  renderer.getViewport(vp); renderer.getScissor(sc); const scT = renderer.getScissorTest();
  const rtVp = target ? [target.viewport.clone(), target.scissor.clone(), target.scissorTest] : null;
  for (const o of objs) o.frustumCulled = false;
  try {
    for (const sl of slices) {
      for (const o of objs) o.visible = false;
      for (const o of sl) o.visible = true;
      renderer.setRenderTarget(target);
      if (target) { target.viewport.set(0, 0, 1, 1); target.scissor.set(0, 0, 1, 1); target.scissorTest = true; renderer.setRenderTarget(target); }
      else { renderer.setViewport(0, 0, 1, 1); renderer.setScissor(0, 0, 1, 1); renderer.setScissorTest(true); }
      if (renderer.shadowMap.enabled) renderer.shadowMap.needsUpdate = true;
      camera.layers.mask = PAINT ? 1 : LAYERS_3D;
      renderer.render(scene, camera);
      await wy('upload-slice');
    }
  } catch (e) { console.warn('[haven3d] warm-up upload pass skipped', e); }
  for (const [o, fc] of saved) { o.frustumCulled = fc; o.visible = true; }
  for (const o of hidden) o.visible = false;
  if (target) { target.viewport.copy(rtVp[0]); target.scissor.copy(rtVp[1]); target.scissorTest = rtVp[2]; }
  renderer.setRenderTarget(null); renderer.setViewport(vp); renderer.setScissor(sc); renderer.setScissorTest(scT);
  lodsRestore(lods);
  camera.layers.set(0);
  boot.warm.upload = Math.round(performance.now() - t2); boot.warm.slices = slices.length;
  await wy('upload-end');
  /* 4. the real frames along the way in (door, threshold, inside, the display) with the same culling, LOD and light
     states as the walk: the last programs (the paint's pristine pass) are made here, unseen. 3D: drawn into a quarter
     of the hidden canvas (the states matter, not the pixels; the shadow pass was warmed in step 3), so this costs the
     GPU little. */
  const t3 = performance.now();
  const small = !PAINT || !wc || !wc.enabled;
  if (small) { const w4 = Math.max(1, Math.ceil(W / 4)), h4 = Math.max(1, Math.ceil(H / 4)); renderer.setViewport(0, 0, w4, h4); renderer.setScissor(0, 0, w4, h4); renderer.setScissorTest(true); }
  const poses = [];
  if (walk) for (const f of [0.35, 0.5, 0.62, 0.75, 0.9, 1]) poses.push(['walk', f * WALK_DUR]);
  poses.push(['door'], ['inside'], ['shelf']);
  const st = state, vw = view;
  for (const [kind, t] of poses) {
    if (W !== W0 || H !== H0) break;   /* resized meanwhile: the layout redoes the frames; good enough */
    if (kind === 'walk') { state = 'walking'; walkT = t; walkOffset0.set(0, 0, 0); }
    else { state = kind === 'shelf' ? 'shelf' : st; view = kind; }
    updateCamera(0);
    renderer.shadowMap.needsUpdate = false;
    if (small) { thresholdCull(); renderer.setRenderTarget(null); camera.layers.mask = LAYERS_3D; renderer.render(scene, camera); }
    else render();
    await wy('view-' + kind);
  }
  if (small) { renderer.setViewport(0, 0, W, H); renderer.setScissor(0, 0, W, H); renderer.setScissorTest(false); }
  state = st; view = vw; walkT = 0;
  boot.warm.views = Math.round(performance.now() - t3);
  boot.warm.total = Math.round(performance.now() - t0);
}

/* ------------------------------------------------------------------ fallback (no WebGL) */
function fallback(reason) {
  console.info(`[haven3d] showing the no-WebGL fallback (${reason}).`);
  /* one plain page for every screen: the poster of the shop on top, then the street card, then the pieces */
  html.classList.add('no-webgl', 'lay-sheet'); html.classList.remove('lay-wide', 'lay-short', 'live');
  state = 'fallback'; setUI('fallback'); applyDrawer(true); loadRowImages();
  firstEl.hidden = false; firstImg.classList.remove('placed'); firstImg.removeAttribute('style');
  /* the shelf as it looks at the end of the walk, above the "On this shelf" pieces */
  const shelfImg = new Image(); shelfImg.alt = ''; shelfImg.decoding = 'async';
  shelfImg.onload = () => { const p = document.createElement('div'); p.className = 'poster poster-shelf'; p.setAttribute('aria-hidden', 'true'); p.appendChild(shelfImg); shelfEl.before(p); };
  shelfImg.src = 'assets/poster-shelf.webp';
  readyResolve({ fallback: true });
}
/* a cheap check (v4 integrator): no throwaway context any more (creating one cost ~0.5 s of main thread on a software GPU
   and kept a second context alive); a browser that has the API but cannot start it lands in the renderer's catch below */
function webglAvailable() {
  return typeof WebGL2RenderingContext !== 'undefined';
}

/* ------------------------------------------------------------------ wiring */
function wire() {
  goBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state === 'fallback') { shelfEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); focusOpen(); return; }
    if (!revealed || state === 'loading') { pendingGo = true; setGoBusy(true); return; }   /* starts as soon as it is ready */
    startWalk();
  });
  $('#again').addEventListener('click', restart);
  handleBtn.addEventListener('click', toggleDrawer);
  /* the photos start as the finger lands on the handle (or it gets focus), a moment before the drawer opens */
  for (const ev of ['pointerdown', 'pointerenter', 'focus']) handleBtn.addEventListener(ev, loadRowImages, { passive: true });
  /* phones + tablets: a swipe down on the bar closes the drawer, a swipe up opens it */
  const bar = shelfEl.querySelector('.shelf-bar');
  if (bar) {
    let sw = null;
    bar.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') sw = { x: e.clientX, y: e.clientY, id: e.pointerId }; }, { passive: true });
    bar.addEventListener('pointercancel', () => { sw = null; }, { passive: true });
    bar.addEventListener('pointerup', (e) => {
      const g = sw; sw = null;
      if (!g || g.id !== e.pointerId || state !== 'shelf' || html.classList.contains('lay-wide')) return;
      const dx = e.clientX - g.x, dy = e.clientY - g.y;
      if (Math.abs(dy) < 36 || Math.abs(dy) < Math.abs(dx) * 1.5) return;
      if ((dy > 0) === drawerOpen) toggleDrawer();
    }, { passive: true });
  }
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
    else if (state === 'shelf' && drawerOpen && drawerUser !== null && !html.classList.contains('lay-wide')) { toggleDrawer(); handleBtn.focus({ preventScroll: true }); }
  });
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointerleave', () => { if (finePointer) { setHover(null); parTarget.set(0, 0); } });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', queueLayout);
  window.addEventListener('orientationchange', queueLayout);
  /* the overlays' sizes: only a real change re-lays the page (the drawer's own toggle already did it at once) */
  if (window.ResizeObserver) { const ro = new ResizeObserver(() => { if (overlaySizes() !== laidSizes) queueLayout(); }); ro.observe(extEl); ro.observe(shelfEl); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueLayout);
  /* the poster file the browser picked can change with the screen (rotation): line the new one up once it loads */
  firstImg.addEventListener('load', () => { if (!revealed) { placePosterLens(); updateCamera(0); } });
  document.addEventListener('visibilitychange', () => {
    if (!renderer || !firstFrame) return;
    if (document.hidden) { stop(); if (actx && actx.state === 'running') actx.suspend().catch(() => {}); }
    else { markDirty(); start(); if (soundOn && actx) actx.resume().catch(() => {}); }
  });
  const onMQ = () => { reduceMotion = mqReduce.matches; html.classList.toggle('calm', reduceMotion); if (wc) wc.setReduceMotion(reduceMotion); markDirty(); };
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
  markDirty(); start();
});

/* ------------------------------------------------------------------ boot: one step per task while the poster shows */
async function main() {
  /* the head script's watchdog already turned the page into the plain one: stay out of its way */
  if (window.havenBoot && window.havenBoot.alive && !window.havenBoot.alive()) return;
  /* "Step inside" pressed before this module ran (the head script showed the busy ring): start once the scene is ready */
  if (window.havenBoot && window.havenBoot.go) { pendingGo = true; setGoBusy(true); }
  buildRow(); wire();
  html.classList.toggle('calm', reduceMotion);
  setLayoutClass(layoutKind());
  setUI('loading');
  if (DEBUG.nogl || !webglAvailable()) return fallback(DEBUG.nogl ? '?nogl=1' : 'WebGL is not available');
  const metaP = fetch('assets/poster-first.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  try {
    /* 3D: MSAA (4x) — at dpr <= 2 and <= 1.6 Mpx on touch screens it stays affordable on phones. Paint: no MSAA (the paint
       is the antialiasing). */
    /* the page's one context, made here (no throwaway test context): no WebGL 2 -> the plain page, without the
       renderer's console error */
    const attrs = { alpha: false, antialias: !PAINT, depth: true, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false };
    const gl = canvas.getContext('webgl2', attrs);
    if (!gl) return fallback('WebGL 2 is not available');
    renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: !PAINT, powerPreference: 'high-performance', alpha: false, stencil: false });
  } catch (e) { return fallback('the WebGL renderer could not start'); }
  mark('renderer');
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); console.warn('[haven3d] WebGL context lost; paused.'); });
  canvas.addEventListener('webglcontextrestored', () => { location.reload(); });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  /* 3D: the renderer tone-maps once on the way to the canvas. Paint: the scene renders linear into a half-float target
     and the paint applies the same curve once. */
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = ATMO.o.exposure;
  renderer.shadowMap.type = TOUCH_SH ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  /* one frame = all its passes, the sun's shadow pass included: render() resets the counters itself (three's own
     auto-reset runs after the shadow pass, so the shadow pass was never counted in the 3D look) */
  renderer.info.autoReset = false;
  renderer.setPixelRatio(pixelRatio);
  W = canvas.clientWidth || innerWidth; H = canvas.clientHeight || innerHeight;
  renderer.setSize(W, H, false);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, W / H, 0.06, 420);
  camera.layers.mask = LAYERS_3D;
  setupLights();
  await yieldMain();

  const mods = await loadModules();
  mark('modules');
  if (PAINT && mods.wcm) {
    WC = mods.wcm;
    wc = WC.createWatercolor(renderer, { quality: paintQ, reduceMotion, boil: BOIL });
    if (DEBUG.paint && DEBUG.paint !== '0') wc.debug(DEBUG.paint);
    if (LOOK_JSON) wc.setLook(LOOK_JSON);
    SHELF_LOOK = { ...SHELF_LOOK_BASE, ...((WC.LOOK_PRESETS && WC.LOOK_PRESETS.shelf) || {}) };   /* the paint's own preset wins */
    const l = wc.look || {}; baseLook = {}; for (const key in SHELF_LOOK) baseLook[key] = Number.isFinite(l[key]) ? l[key] : SHELF_LOOK[key];
    wc.setSize(W, H, pixelRatio);
  }
  let S = mods.stubLib;
  const stubLib = async () => S || (S = await import('./_stub-lib.js'));
  await yieldMain();
  T = mods.tex ? attempt('makeTextures', () => mods.tex.makeTextures(THREE, renderer), () => null) : null;
  if (!T) { usedStubs.lib = true; T = (await stubLib()).makeTextures(THREE, renderer); }
  mark('textures'); await yieldMain();
  P = mods.props ? attempt('makeProps', () => mods.props.makeProps(THREE, T), () => null) : null;
  if (!P) { usedStubs.lib = true; P = (await stubLib()).makeProps(THREE, T); }
  mark('props'); await yieldMain();

  try { scene.background = T.sky(); } catch (e) { scene.background = null; }
  if (!scene.background) scene.background = new THREE.Color('#F2DCCB');
  else if (scene.background.isTexture && scene.background.wrapT !== THREE.ClampToEdgeWrapping && !(scene.background.userData && scene.background.userData.screenFit)) {
    scene.background.wrapT = THREE.ClampToEdgeWrapping; scene.background.needsUpdate = true;
  }
  scene.fog = new THREE.Fog(new THREE.Color(ATMO.o.fog), ATMO.o.fogNear, ATMO.o.fogFar);
  try {
    const pm = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
    scene.environment = pm.fromScene(room, 0.04).texture; scene.environmentIntensity = ATMO.env;
    room.dispose(); pm.dispose();
  } catch (e) { console.warn('[haven3d] environment fill skipped', e); }
  mark('env'); await yieldMain();

  const ctx = { T, P, quality, reduceMotion, renderer, look: LOOK, env: scene.environment || null };
  const stubExt = async () => (await import('./_stub-exterior.js')).buildExterior(THREE, ctx);
  const stubInt = async () => (await import('./_stub-interior.js')).buildInterior(THREE, ctx);
  EXTB = mods.ext ? await attemptSteps('buildExterior', mods.ext, 'buildExterior', [THREE, ctx], () => null) : null;
  if (!EXTB) { usedStubs.ext = true; EXTB = await stubExt(); }
  mark('exterior'); await yieldMain();
  INTB = mods.int ? await attemptSteps('buildInterior', mods.int, 'buildInterior', [THREE, ctx], () => null) : null;
  if (!INTB) { usedStubs.int = true; INTB = await stubInt(); }
  mark('interior'); await yieldMain();
  for (const b of [EXTB, INTB]) {
    if (b.group) scene.add(b.group);
    for (const l of b.lights || []) if (l && !l.parent) scene.add(l);
  }
  anchors.ext = EXTB.anchors || {}; anchors.int = INTB.anchors || {};
  if (anchors.int.shelfView && !(anchors.int.shelfView.pos && anchors.int.shelfView.look)) anchors.int.shelfView = null;
  pickables = (INTB.pickables || []).filter((o) => o && o.userData && o.userData.pick);
  sceneReady = true;
  mergeAtmo();
  /* paint only: inside, the glows (fairy lights, lamp halos) sit close to the pieces on the display: they take a calmer
     share of the paint's glow gain so they warm the room without washing the black crochet cat to grey */
  if (PAINT && INTB.group) INTB.group.traverse((o) => { for (const m of [].concat(o.material || [])) if (m && m.blending === THREE.AdditiveBlending && m.userData.wcGlowK === undefined) m.userData.wcGlowK = 0.3; });
  /* the static shadow tier: nothing that moves casts (the cast of animals and guests keep their contact shadows) */
  if (STATIC_SH && EXTB.group) EXTB.group.traverse((o) => { if (o.isMesh && /^ext:cast/.test(o.name || '')) o.castShadow = false; });
  /* phones + tablets: the room does not receive the sun's shadows (as before this tier: the warm lamps carry it), so the
     frames inside, the display above all, pay nothing for them; the façade does */
  if (TOUCH_SH && INTB.group) INTB.group.traverse((o) => { if (o.isMesh) o.receiveShadow = false; });
  scene.updateMatrixWorld(true);
  measureScene(EXTB.group || new THREE.Group());
  pristineFound = markPristine(scene);
  posterMeta = await Promise.race([metaP, timeout(1500).then(() => null)]);
  layout();
  view = 'exterior';
  updateCamera(0);
  mark('layout'); await yieldMain();

  await Promise.race([Promise.resolve(T.ready).catch(() => {}), timeout(9000)]);
  pristineFound = markPristine(scene);   /* again: the photo texture clones only gain their image source now */
  mark('texturesReady'); await yieldMain();
  layout();
  if (DEBUG.warm) await warmUp();
  mark('warm');
  if (DEBUG.hold) await timeout(DEBUG.hold);

  /* the build left tens of MB of garbage: give the browser two idle moments (its idle-time GC) while the still shows, so
     the collection does not land in the first seconds of the walk (review #13) */
  if (typeof requestIdleCallback === 'function') for (let i = 0; i < 2; i++) await new Promise((r) => requestIdleCallback(r, { timeout: 400 }));
  layout();
  if (DEBUG.walk !== null) walkAt(DEBUG.walk);
  else if (DEBUG.view) goTo(DEBUG.view === 'start' ? 'exterior' : DEBUG.view);
  else if (cameBackToShelf()) { goTo('shelf'); focusOpen(); }
  else goTo('exterior');
  renderer.shadowMap.needsUpdate = true; shadowDirty = true;
  render();
  firstFrame = true;
  /* present that frame, then fade the canvas in over the still */
  await new Promise((r) => requestAnimationFrame(() => r()));
  reveal();
  mark('revealed');
  /* (the card row's photos load with the walk on desktop, with the drawer on phones and tablets: see setState) */
  start();
  readyResolve({ fallback: false });
}

window.__haven = {
  get renderer() { return renderer; }, get scene() { return scene; }, get camera() { return camera; },
  get state() { return state; }, get view() { return view; }, get frames() { return frames; },
  get pickables() { return pickables; }, get quality() { return quality; }, get walkKeys() { return walk && walk.keys; },
  get flow() { return flow; }, get walkDur() { return WALK_DUR; }, get look() { return LOOK; },
  get revealed() { return revealed; }, get frameCount() { return frameCount; }, get running() { return running; },
  /* tests: the camera pose the walk gives at time t (no render): position, look target, fov, shift lens */
  walkPose(t) { if (!scene) return null; ensureWalk(); const p = walk.pos(t, V()), l = walk.look(t, V()); return { pos: p.toArray(), look: l.toArray(), fov: walk.fov(t), sx: walk.sx(t), sy: walk.sy(t), W, H }; },
  goTo, walkAt, info, ready, fastForward, startWalk: () => startWalk(), restart, toggleDrawer,
  /* capture hook (tests, frame-stepped video): pause the live loop and draw one frame with the walk at `walk` seconds
     (omit it to stay in the current view) and the animation clock at `anim`; `dt` is the step for eased hover/drift.
     resume() restarts the live loop. Never used by the page itself. */
  renderAt(o = {}) {
    if (!scene) return;
    stop();
    const dt = o.dt ?? 1 / 30;
    if (o.anim != null) clockT = o.anim;
    if (o.walk != null) {
      ensureWalk();
      if (state !== 'walking') { closePick(); setHover(null); walkOffset0.copy(offsetNow); setState('walking'); stop(); }
      walkFrozen = true; walkT = clamp(+o.walk || 0, 0, WALK_DUR);
      if (walkT >= WALK_DUR - 0.5) setUI('shelf');
      if (skipRing) skipRing.style.strokeDashoffset = (1 - walkT / WALK_DUR).toFixed(4);
    }
    if (camTween) { camTween.t += dt; if (camTween.t >= camTween.dur) camTween = null; }   /* the drawer's lens glide, stepped too */
    updateCamera(dt);
    const camZ = camera.position.z, tA = reduceMotion ? 1.5 : clockT;
    updateHover(dt);
    if (EXTB && EXTB.update && !updateBroken.ext && camZ > EXT_UPDATE_Z) guardedUpdate('ext', EXTB, tA, dt);
    if (INTB && INTB.update && !updateBroken.int) guardedUpdate('int', INTB, tA, dt);
    render(camZ, tA);
  },
  /* tests: one frame with the sun's shadow map redrawn (the static tier's one shadow pass), then info() */
  shadowPass() { if (!scene) return null; stop(); shadowDirty = true; updateCamera(0); render(); return info(); },
  /* posters / screenshots: draw one frame now (call toDataURL in the same task) */
  renderNow() { if (!scene) return; updateCamera(0); render(); },
  /* the first-paint posters (haven3d-tools/v4-posters.js): the exterior frame drawn on a canvas `os` times larger around
     the same camera (same px per lens unit, same principal point offset), so the still can cover nearby screen shapes;
     returns the image and where its principal point and scale sit. Restores the live size afterwards. */
  posterShot(o = {}) {
    if (!scene) return null;
    const os = o.overscan || 1.12, osX = o.overscanX || os, osY = o.overscanY || os, type = o.type || 'image/webp', q = o.quality ?? 0.82;
    stop();
    let f;
    if (o.view === 'shelf') { goTo('shelf'); f = shelfFrame({ x: 12, y: 12, w: W - 24, h: H - 24 }); }
    else { goTo('exterior'); f = frames.exterior; }
    stop();
    const logo = logoPx(), Wb = Math.round(W * osX), Hb = Math.round(H * osY);
    renderer.setSize(Wb, Hb, false); if (wc) wc.setSize(Wb, Hb, pixelRatio);
    camera.position.copy(f.pos); camera.up.copy(UP); camera.lookAt(f.look);
    camera.fov = deg(2 * Math.atan(Math.tan(rad(f.fov) / 2) * Hb / H)); camera.aspect = Wb / Hb;
    camera.setViewOffset(Wb, Hb, -f.sx * W / 2, f.sy * H / 2, Wb, Hb); camera.updateProjectionMatrix();
    atmosphere(camera.position.z);
    if (EXTB && EXTB.update && o.view !== 'shelf') guardedUpdate('ext', EXTB, DEBUG.t ?? 0, 0);
    thresholdCull();
    if (renderer.shadowMap.enabled) renderer.shadowMap.needsUpdate = true;
    renderer.info.reset(); draw(DEBUG.t ?? 0);
    const url = canvas.toDataURL(type, q);
    const k = H / (2 * Math.tan(rad(f.fov) / 2));
    const meta = { w: Wb, h: Hb, W, H, os: [osX, osY], k: +k.toFixed(4), ppx: +(Wb / 2 + f.sx * W / 2).toFixed(2), ppy: +(Hb / 2 - f.sy * H / 2).toFixed(2),
      pos: f.pos.toArray().map((v) => +v.toFixed(4)), look: f.look.toArray().map((v) => +v.toFixed(4)), fov: +f.fov.toFixed(4), sx: f.sx, sy: f.sy,
      family: f.family, flow, layout: info().layout, dpr: pixelRatio, lookMode: LOOK, quality, logoPx: logo };
    renderer.setSize(W, H, false); if (wc) wc.setSize(W, H, pixelRatio);
    updateCamera(0); render();
    return { url, meta: o.view === 'shelf' ? { w: Wb, h: Hb, view: 'shelf' } : meta };
  },
  get paint() { return wc; },
  /* tests: tune the portrait shelf frame ({ pos:[x,y,z], look:[x,y,z], vBias, clipX, rimX }) and re-frame */
  tuneShelf(o = {}) {
    for (const k of ['pos', 'look']) if (Array.isArray(o[k])) SHELF_TALL[k] = V(...o[k]); else if (o[k] === null) SHELF_TALL[k] = null;
    for (const k of ['vBias', 'clipX', 'rimX']) if (Number.isFinite(o[k])) SHELF_TALL[k] = o[k];
    layout(); updateCamera(0); render();
    return { ...SHELF_TALL, frame: frames.shelf && { pos: frames.shelf.pos.toArray(), look: frames.shelf.look.toArray(), fov: frames.shelf.fov, sx: frames.shelf.sx, sy: frames.shelf.sy } };
  },
  /* tests: what the framing sees (roof line, sign, screen rects, builder anchors) */
  get dbg() { return { roofPts, sign, rects, anchors, posterMeta }; },
  resume() { walkFrozen = false; start(); },
  /* tests: CSS-px screen position of a pickable (by id), for hover/tap checks */
  screenOf(id) {
    const o = pickables.find((p) => p.userData.pick.id === id); if (!o) return null;
    box.setFromObject(o); box.getCenter(tmpV); tmpV.project(camera);
    return { x: (tmpV.x + 1) / 2 * W, y: (1 - tmpV.y) / 2 * H };
  },
};

main().catch((e) => {
  console.warn('[haven3d] start-up failed; showing the fallback.', e);
  try { stop(); } catch (_) { /* ignore */ }
  fallback('start-up error');
});
