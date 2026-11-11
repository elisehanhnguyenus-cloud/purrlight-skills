// Haven 3D v2 — interior (interior agent, PREVIEW 06/11). Contract (CONTRACT.md + CONTRACT-v2.md):
//   buildInterior(THREE, ctx) → { group, update(t, dt), anchors: { shelfView: {pos, look}, cafeLook, giftLook, … },
//                                  pickables, lights }
// A small, cosy, retro-sweet shop about half the size of v1 (x −3.95…3.95, z −7.3…−0.3, ceiling 3.8): honey plank floor,
// candy-stripe cream/blush walls over blush wainscoting, honey beams, a built-in cream wall with three blush arched
// niches at the back, honey bookcases on the left, the half-round café counter with cubbies on the right near the café
// window (cake dome, cups, a little espresso machine, a glass pendant), white distressed vintage shelves with crochet
// animals under a felt flower garland, scalloped-liner baskets, a pink vintage suitcase with a crochet bear, a reading
// armchair with a lamp, fairy lights in soft swags and a retro chandelier over the centre.
// The camera's destination: the round 3-tier stepped display with a fluted base at (0, 0, −4.6) on a jute scalloped rug
// (tier tops 0.78 / 1.06 / 1.32, radii 0.80 / 0.56 / 0.32), and the rose-gold hook stand beside it — the real products
// are the pickables (ids/names exactly as CONTRACT.md). The real Merlin photo and the embroidered book cover are real
// meshes on the pristine layer 1 (the paint never touches them).
// Draw calls: every static piece and the display products are merged into one mesh per material (js/interior-kit.js);
// a vertex patch replays main.js's hover lift on the merged products, so each pickable is a light Group + an oriented
// hit box. The nine animals sit in two staggered rows on the bottom tier (spaced for the shelf camera), a rag-rug runner
// leads in from the door, and LOD levels keep the share at ~50 draws / ≤ 160k triangles (8.5 mm product clusters at the
// shelf view, 8 mm room clusters from the threshold out). Measured 07/11: shelf 49 / 158k, inside 52 / 148k, door 54 / 135k.
import * as THREE_NS from '../vendor/three.module.min.js';
import { makeInteriorKit, PICK_SLOTS } from './interior-kit.js';
import { mulberry32 } from './textures.js';

function* interiorSteps(THREE = THREE_NS, ctx = {}) {
  const { T, P } = ctx;
  const K = makeInteriorKit(THREE, T, P);
  yield 'kit';
  const g = K.g;
  const PI = Math.PI;
  const group = new THREE.Group(); group.name = 'interior';
  const B = new K.Batch();
  B.cell = 0.006;                           // decor props (≥ 1.5 m from every camera) are vertex-clustered at 6 mm
  const books = new K.Books();
  const halos = [];
  const I = new THREE.Matrix4();
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const RG = '#C9937E';
  const at = (x, y, z, ry = 0, W = I) => K.at(W, x, y, z, ry);
  const shade = K.shade;

  // ===================================================================================== the room (contract v2)
  const X0 = -3.95, X1 = 3.95, Z0 = -0.3, Z1 = -7.3, CEIL = 3.8;
  const FLOOR_Y = 0.003, INSET = 0.006;
  const RW = X1 - X0, RD = Z0 - Z1, RZC = (Z0 + Z1) / 2;
  const DC = V(0, 0, -4.6), TIERS = [[0.78, 0.8], [1.06, 0.56], [1.32, 0.32]];
  // (fix v3, review #1/#10: the stand sits a little further back, beside the display's right shoulder, facing the shelf
  //  view: both bag charms read just right of the display, so the shelf frame no longer reaches out to a stand at the edge)
  const HS = V(0.95, 0, -5.1), HS_RY = -0.27, HS_H = 1.26, BAG = 1.3;
  const CAFE = { x: 2.95, z: -2.55, R: 0.95, H: 1.0 };          // half-round counter, flat back toward the right wall
  const ARCH = { xa: -2.3, xb: 2.3, H: 3.1, D: 0.34 };
  const BEAMS = [-1.9, -3.75, -5.6];

  // ===================================================================================== baked light (vertex colours)
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  function lightField(x, y, z) {
    const dd = Math.hypot(x * 0.9, (y - 1.0) * 0.75, (z + 4.4) * 0.9);
    let f = 1.1 - 0.6 * smooth(0.9, 4.2, dd);                                                  // v3: warmer pool, darker edges
    f *= 1 - 0.24 * smooth(2.2, 3.8, y);
    f *= 1 - 0.1 * smooth(2.9, 3.95, Math.abs(x));
    f += 0.14 * Math.exp(-((x - 2.9) ** 2 + 0.5 * (y - 1.5) ** 2 + (z + 2.55) ** 2) / 1.1);    // café pendant (a warm pool)
    f += 0.13 * Math.exp(-((x + 3.0) ** 2 + 0.6 * (y - 1.3) ** 2 + (z + 6.4) ** 2) / 0.9);    // reading lamp (a warm pool)
    f += 0.05 * smooth(-2.2, -0.4, z) * (1 - smooth(0.6, 2.6, y));                            // daylight by the front
    const w = Math.max(0, 1 - f);
    return [f, f * (0.985 - 0.07 * w), f * (0.955 - 0.17 * w)];
  }
  function floorTone(x, z) {
    const dSide = Math.min(x - X0, X1 - x), dBack = z - Z1, dFront = Z0 - z;
    let f = 1;
    f *= 1 - 0.26 * Math.exp(-Math.max(0, dSide - 0.38) / 0.4);
    f *= 1 - 0.24 * Math.exp(-Math.max(0, dBack - (Math.abs(x) < 2.3 ? 0.34 : 0.05)) / 0.4);
    f *= 1 - 0.06 * Math.exp(-dFront / 0.4);
    const L = lightField(x, 0.35, z);
    const pool = Math.exp(-((x / 1.6) ** 2 + ((z + 4.3) / 1.4) ** 2));                        // warm pool round the display
    return [L[0] * f * (1 + 0.16 * pool), L[1] * f * (1 + 0.11 * pool), L[2] * f * (1 + 0.04 * pool)];
  }
  B.field = lightField;
  function setColors(geo, fn) {
    const p = geo.attributes.position, n = p.count, col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const c = fn(p.getX(i), p.getY(i), p.getZ(i)); col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    return geo;
  }
  function setUV(geo, fn) {
    const p = geo.attributes.position, n = p.count, uv = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) { const t = fn(p.getX(i), p.getY(i), p.getZ(i)); uv[i * 2] = t[0]; uv[i * 2 + 1] = t[1]; }
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    return geo;
  }
  const shadow = (x, y, z, w, d, op = 0.4) => { const s = P.softShadow(w, d, op >= 0.47 ? 0.5 : 0.4); s.position.set(x, y + (y < 0.01 ? 0.005 : 0.0015), z); B.absorb(s, { cast: false }); };

  // ===================================================================================== shell: floor, walls, wainscot, ceiling, beams
  yield 'shell';
  B.tag = 'shell'; B.lod = 'room';
  {
    const fl = new THREE.PlaneGeometry(RW, RD, 40, 36).rotateX(-PI / 2).translate(0, FLOOR_Y, RZC);
    setUV(fl, (x, y, z) => [-z / 3.2, x / 3.2]);
    B.noField = true; setColors(fl, (x, y, z) => floorTone(x, z)); B.raw('floorVC', fl); B.noField = false;

    const ce = new THREE.PlaneGeometry(RW, RD, 24, 22).rotateX(PI / 2).translate(0, CEIL - INSET, RZC);
    setColors(ce, (x, y, z) => {
      const d = Math.min(x - X0, X1 - x, z - Z1, Z0 - z);
      let f = 0.84 + 0.16 * smooth(0, 1.8, d);
      f += 0.08 * Math.exp(-((x - DC.x) ** 2 + (z - DC.z) ** 2) / 1.6);
      return [0.98 * f, 0.94 * f, 0.88 * f];
    });
    B.noField = true; B.raw('plasterVC', ce); B.noField = false;

    // candy-stripe walls (cream / pale blush), shaded by the room's light, a touch darker in the corners and at the top
    const wallTone = (x, y, z, u, u0, u1) => {
      const L = lightField(x, y, z);
      let f = 1 - 0.1 * smooth(3.2, 3.8, y);
      f *= 1 - 0.12 * Math.exp(-Math.min(u - u0, u1 - u) / 0.5);
      return [L[0] * f, L[1] * f, L[2] * f];
    };
    const back = new THREE.PlaneGeometry(RW, CEIL, 32, 14).translate(0, CEIL / 2, Z1 + INSET);
    setUV(back, (x, y) => [x / 0.64, y / 0.64]);
    setColors(back, (x, y, z) => wallTone(x, y, z, x, X0, X1));
    const left = new THREE.PlaneGeometry(RD, CEIL, 28, 14).rotateY(PI / 2).translate(X0 + INSET, CEIL / 2, RZC);
    setUV(left, (x, y, z) => [-z / 0.64, y / 0.64]);
    setColors(left, (x, y, z) => wallTone(x, y, z, -z, -Z0, -Z1));
    const right = new THREE.PlaneGeometry(RD, CEIL, 28, 14).rotateY(-PI / 2).translate(X1 - INSET, CEIL / 2, RZC);
    setUV(right, (x, y, z) => [z / 0.64, y / 0.64]);
    setColors(right, (x, y, z) => wallTone(x, y, z, -z, -Z0, -Z1));
    B.noField = true; for (const w of [back, left, right]) B.raw('wallVC', w); B.noField = false;

    // blush wainscoting with raised panels, an ivory chair rail and a honey skirting board
    const WH = 0.95, blush = '#EAC0B2', blushL = '#F0CEC2';
    const wainscot = (W, len) => {
      B.add('clay', g.box(), { p: [len / 2, WH / 2, 0.012], s: [len, WH, 0.024], c: blush, uv: [len / 0.25, 4], post: W });
      const n = Math.max(1, Math.round(len / 0.62));
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) * len / n, pw = len / n - 0.14;
        B.add('clay', g.rbox(pw, WH - 0.36, 0.02, 0.008, 1), { p: [x, 0.17 + (WH - 0.36) / 2 + 0.01, 0.03], c: blushL, ao: 0.08, post: W });
      }
      B.add('clay', g.rbox(len, 0.05, 0.05, 0.015, 1), { p: [len / 2, WH, 0.03], c: '#FCF6EE', post: W });
      B.add('woodVC', g.rbox(len, 0.11, 0.035, 0.01, 1), { p: [len / 2, 0.055, 0.03], c: '#C99A6C', uv: [len / 0.8, 0.2], post: W });
    };
    wainscot(new THREE.Matrix4().makeTranslation(X0, 0, Z1 + 0.004), RW);                                    // back
    wainscot(new THREE.Matrix4().makeRotationY(PI / 2).setPosition(X0 + 0.004, 0, Z0), RD);                    // left (local x → −z)
    wainscot(new THREE.Matrix4().makeRotationY(-PI / 2).setPosition(X1 - 0.004, 0, Z1), RD);                   // right (local x → +z)

    // a retro rag-rug runner from the door toward the display (leads the eye; flat on the floor, below the camera)
    { const rn = new THREE.PlaneGeometry(0.92, 2.05, 2, 8).rotateX(-PI / 2).translate(0, 0.0055, -1.62);
      setUV(rn, (x, y, z) => [x / 0.92 + 0.5, (z + 1.62) / 2.05 + 0.5]);
      B.noField = true; setColors(rn, (x, y, z) => floorTone(x, z).map((v) => v * 1.04)); B.raw('runnerVC', rn); B.noField = false; }

    // honey beams and a cream cornice
    for (const z of BEAMS) B.add('woodVC', g.rbox(RW, 0.17, 0.2, 0.03, 1), { p: [0, CEIL - 0.085, z], c: '#CFA273', ao: 0.15, uv: [RW / 0.9, 0.3], post: I });
    for (const [x, z, w, d] of [[0, Z1 + 0.06, RW, 0.12], [X0 + 0.06, RZC, 0.12, RD], [X1 - 0.06, RZC, 0.12, RD], [0, Z0 - 0.06, RW, 0.12]]) {
      B.add('clay', g.rbox(w, 0.12, d, 0.03, 1), { p: [x, CEIL - 0.06, z], c: '#FBF4EA' });
    }
  }

  // ===================================================================================== small lite props (shared helpers)
  function yarnBall(W, x, y, z, rad, hex, pid = 0) {
    B.add('yarn', g.sph(10, 7), { p: [x, y + rad * 0.95, z], s: rad * 0.97, c: hex, ao: 0.25, uv: [2, 1], post: W, pid });
    B.add('yarn', g.tor(0.07, 3, 16), { p: [x, y + rad * 0.95, z], r: [0.6 + x * 3, 0.3, 0.2 + z * 2], s: rad * 0.985, c: shade(hex, 0.05), uv: [3, 1], post: W, pid });
  }
  function keychainLite(x, y, z, charm, hex, ry = 0, pid = 0) {
    const W = at(x, y, z, ry);
    B.add('metal', g.tor(0.14, 4, 12), { p: [0, -0.011, 0], s: 0.011, c: RG, post: W, pid });
    B.add('metal', g.tor(0.22, 3, 8), { p: [0, -0.026, 0], r: [0, PI / 2, 0], s: 0.004, c: RG, post: W, pid });
    const cy = -0.05;
    if (charm === 'pompom') B.add('boucle', g.lumpy(3, 0.06, 9, 10, 7), { p: [0, cy, 0], s: 0.019, c: hex, post: W, pid });
    else if (charm === 'heart') { for (const sx of [-1, 1]) B.add('felt', g.sph(8, 6), { p: [sx * 0.0075, cy + 0.004, 0], r: [0, 0, sx * 0.6], s: [0.011, 0.016, 0.006], c: hex, post: W, pid }); }
    else if (charm === 'yarn') B.add('yarn', g.sph(8, 6), { p: [0, cy, 0], s: 0.017, uv: [2, 1], c: hex, post: W, pid });
    else {
      B.add('knit', g.sph(10, 8), { p: [0, cy, 0], s: [0.022, 0.019, 0.018], c: hex, post: W, pid });
      for (const sx of [-1, 1]) {
        B.add('knit', g.cyl(4, 0, 1), { p: [sx * 0.013, cy + 0.02, 0], r: [0, 0, -sx * 0.35], s: [0.007, 0.012, 0.005], c: hex, post: W, pid });
        B.add('button', g.sph(6, 4), { p: [sx * 0.0075, cy + 0.001, 0.0165], s: [0.003, 0.003, 0.0018], c: '#26201C', post: W, pid });
      }
    }
  }
  function cupLite(W, x, y, z, hex = '#F7EFE4', latte = true, ry = 0.7) {
    const M = at(x, y, z, ry, W);
    B.add('satin', g.lathe('saucerL', [[0, 0], [0.05, 0], [0.068, 0.008], [0.072, 0.012], [0.05, 0.007], [0, 0.007]], 12), { c: hex, post: M });
    B.add('satin', g.lathe('cupL', [[0, 0.006], [0.026, 0.006], [0.036, 0.03], [0.041, 0.066], [0.036, 0.066], [0.03, 0.05], [0, 0.05]], 10), { c: hex, ao: 0.15, post: M });
    B.add('satin', g.tor(0.22, 3, 8, PI * 1.25), { p: [0.042, 0.04, 0], r: [0, 0, -PI * 0.62], s: 0.016, c: hex, post: M });
    B.add('satin', g.cyl(12), { p: [0, 0.058, 0], s: [0.034, 0.002, 0.034], c: latte ? '#C9A27C' : '#7A5A44', post: M });
  }
  function mugLite(W, x, y, z, hex, ry = 0) {
    const M = at(x, y, z, ry, W);
    B.add('satin', g.cyl(12), { p: [0, 0.045, 0], s: [0.036, 0.09, 0.036], c: hex, ao: 0.15, post: M });
    B.add('satin', g.tor(0.25, 4, 10, PI * 1.2), { p: [0.04, 0.05, 0], r: [0, 0, -PI * 0.6], s: 0.022, c: hex, post: M });
  }
  function jarLite(W, x, y, z, h, fill, ry = 0) {
    const M = at(x, y, z, ry, W);
    B.add('satin', g.cyl(12), { p: [0, h * 0.42, 0], s: [0.05, h * 0.8, 0.05], c: fill, ao: 0.2, post: M });
    B.add('glassWarm', g.cyl(12), { p: [0, h / 2, 0], s: [0.056, h, 0.056], post: M });
    B.add('woodVC', g.cyl(12), { p: [0, h + 0.012, 0], s: [0.058, 0.024, 0.058], c: '#D6AE80', post: M, uv: [1, 0.2] });
  }
  function cakeDome(W, x, y, z) {
    const M = at(x, y, z, 0, W);
    B.add('satin', g.lathe('cakeStandL', [[0, 0], [0.06, 0], [0.065, 0.006], [0.02, 0.016], [0.014, 0.075], [0.03, 0.082], [0.15, 0.084], [0.152, 0.094], [0, 0.092]], 16), { c: '#F7EFE4', ao: 0.2, post: M });
    B.add('clay', g.cyl(16), { p: [0, 0.13, 0], s: [0.085, 0.075, 0.085], c: '#F3DCC8', ao: 0.2, post: M });
    B.add('clay', g.lumpy(81, 0.05, 8, 14, 6), { p: [0, 0.17, 0], s: [0.088, 0.016, 0.088], c: '#FBF3EA', post: M });
    for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2 + 0.4; B.add('clay', g.sph(8, 6), { p: [Math.cos(a) * 0.05, 0.186, Math.sin(a) * 0.05], s: 0.014, c: '#E9A0A0', post: M }); }
    B.add('clay', g.box(), { p: [0, 0.13, 0.086], s: [0.17, 0.012, 0.002], c: '#EFC5B9', post: M });
    B.add('glass', g.lathe('domeL', [[0.148, 0], [0.146, 0.08], [0.13, 0.17], [0.09, 0.225], [0.04, 0.245], [0, 0.248]], 18), { p: [0, 0.094, 0], post: M, ro: 2 });
    B.add('metal', g.sph(8, 6), { p: [0, 0.35, 0], s: [0.016, 0.014, 0.016], c: RG, post: M });
  }
  function potLite(W, r, h, kind = 'terracotta') {
    const col = kind === 'cream' ? '#F4EADB' : kind === 'blush' ? '#E9BFB1' : kind === 'sage' ? '#B9C8AE' : '#C99076';
    B.add(kind === 'terracotta' ? 'terra' : 'satin', g.lathe('potL' + r + '/' + h, [[0, 0], [r * 0.72, 0], [r * 0.76, h * 0.06], [r * 0.92, h * 0.78], [r * 1.02, h * 0.8], [r * 1.04, h], [r * 0.9, h], [r * 0.88, h * 0.86], [0, h * 0.86]], 12), { c: col, ao: 0.28, post: W });
  }
  function bushPlant(x, y, z, H, pot = 'cream', seed = 1, leaf = '#93AC86') {
    const W = at(x, y, z, seed);
    potLite(W, H * 0.2, H * 0.3, pot);
    B.add('leaf', g.lumpy(300 + seed, 0.14, 5, 14, 10), { p: [0, H * 0.62, 0], s: [H * 0.3, H * 0.34, H * 0.3], c: leaf, ao: 0.35, post: W });
    B.add('leaf', g.lumpy(320 + seed, 0.16, 5, 10, 8), { p: [H * 0.14, H * 0.82, H * 0.05], s: H * 0.18, c: shade(leaf, 0.1), ao: 0.2, post: W });
  }
  function trailingPlant(x, y, z, hang, dir, pot = 'cream', seed = 1) {
    const W = at(x, y, z, 0);
    potLite(W, 0.09, 0.13, pot);
    B.add('leaf', g.lumpy(500 + seed, 0.18, 6, 12, 8), { p: [0, 0.15, 0], s: [0.12, 0.07, 0.12], c: '#8FA984', ao: 0.25, post: W });
    for (let k = 0; k < 3; k++) {
      const sx = (k - 1) * 0.07, pts = [V(x + sx, y + 0.13, z), V(x + sx + dir.x * 0.12, y + 0.05, z + dir.z * 0.12), V(x + sx * 1.4 + dir.x * 0.16, y - hang * (0.5 + 0.25 * k), z + dir.z * 0.16)];
      const vine = P.vine(pts, 0.65, { seed: seed * 7 + k }); B.absorb(vine);
    }
  }
  function lanternLite(x, z, r, by) {
    const top = r * 1.5, W = at(x, by, z, 0);
    const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([r * Math.sin(PI * (0.08 + t * 0.84)) * (1 + 0.035 * Math.cos(t * PI * 10)), top * t]); }
    B.add('lanternRib', g.lathe('lanternL' + r, pts, 16), { post: W });
    for (const y of [0, top]) B.add('metal', g.tor(0.12, 3, 14), { p: [0, y, 0], r: [PI / 2, 0, 0], s: r * 0.28, c: RG, post: W });
    const cord = CEIL - by - top;
    B.add('clay', g.cyl(4), { p: [x, by + top + cord / 2, z], s: [0.004, cord, 0.004], c: '#5A4E46' });
    B.add('metal', g.cyl(12), { p: [x, CEIL - 0.008, z], s: [0.045, 0.016, 0.045], c: RG });
    halos.push({ p: V(x, by + top * 0.5, z), size: r * 2.6, a: 0.45 });
  }
  function domePendant(x, z, r, by) {
    const W = at(x, by, z, 0), top = r * 0.9;
    B.add('shadeDS', g.lathe('pendDome' + r, [[r * 1.02, -0.004], [r, 0.004], [r * 0.98, top * 0.15], [r * 0.85, top * 0.55], [r * 0.55, top * 0.88], [r * 0.2, top], [0, top]], 18), { c: '#F4CFC3', post: W });
    for (let k = 0; k < 12; k++) { const a = k / 12 * PI * 2; B.add('shadeDS', g.sph(6, 4), { p: [Math.cos(a) * r * 0.98, -0.006, Math.sin(a) * r * 0.98], s: [r * 0.16, r * 0.1, r * 0.16], c: '#F4CFC3', post: W }); }
    B.add('metal', g.tor(0.06, 3, 22), { p: [0, top * 0.9, 0], r: [PI / 2, 0, 0], s: r * 0.42, c: RG, post: W });
    B.add('bulb', g.sph(10, 8), { p: [0, top * 0.35, 0], s: [r * 0.24, r * 0.3, r * 0.24], c: '#FFF2DC', post: W });
    B.add('metal', g.cyl(10), { p: [0, top + 0.02, 0], s: [0.03, 0.05, 0.03], c: RG, post: W });
    const cord = CEIL - by - top - 0.04;
    B.add('clay', g.cyl(4), { p: [x, by + top + 0.04 + cord / 2, z], s: [0.004, cord, 0.004], c: '#5A4E46' });
    B.add('metal', g.cyl(12), { p: [x, CEIL - 0.008, z], s: [0.045, 0.016, 0.045], c: RG });
    halos.push({ p: V(x, by + top * 0.35, z), size: r * 2.4, a: 0.6 });
  }
  // a face-out picture book leaning back: board + painted cover (atlas cell 0…7); W local origin at the book's foot
  function faceOutBook(W, w, h, cell, lean = 0.14) {
    const M = new THREE.Matrix4().makeRotationX(-lean).premultiply(W);
    const bg = ['#A9BCA0', '#EFC5B9', '#F3E2B8', '#C9D5E3', '#D9CFE3', '#F1D3B6', '#C5D3B8', '#F4DCD2'][cell % 8];
    B.add('clay', g.rbox(w, h, 0.022, 0.005, 1), { p: [0, h / 2, -0.011], c: shade(bg, -0.08), post: M });
    const f = new THREE.PlaneGeometry(w * 0.97, h * 0.97), u = f.attributes.uv;
    for (let i = 0; i < u.count; i++) u.setXY(i, ((cell % 4) + u.getX(i)) / 4, 1 - (Math.floor(cell / 4) + 1 - u.getY(i)) / 2);
    f.translate(0, h / 2, 0.0012); f.applyMatrix4(M);
    B.raw('coversVC', f);
  }
  const _bm = new THREE.Matrix4(), _bq = new THREE.Quaternion(), _bs = new THREE.Vector3(), _bp = new THREE.Vector3(), _ax = new THREE.Vector3(0, 0, 1);
  function pushBook(W, x, y, z, w, h, d, tilt, cell, tone) {
    _bq.setFromAxisAngle(_ax, tilt);
    _bm.compose(_bp.set(x, y, z), _bq, _bs.set(w, h, d));
    const m = _bm.clone().premultiply(W);
    const fp = new THREE.Vector3().setFromMatrixPosition(m), lf = lightField(fp.x, fp.y, fp.z);
    books.push(m, cell, tone * (lf[0] + lf[1] + lf[2]) / 3);
  }
  const NCELL = 32;
  // books along local x from xa to xb standing on y, spines facing +Z at depth D (the shelf's front)
  function fillBooks(W, xa, xb, y, hmax, D, r, o = {}) {
    const fam = [0, 1, 2, 3, 4].map(() => Math.floor(r() * NCELL));
    const tone = (o.tone || 1) * (0.95 + r() * 0.07);
    let x = xa + r() * 0.03;
    while (x < xb - 0.03) {
      const roll = r(), room = xb - x;
      if (roll < 0.07 && room > 0.24) {            // a little stack lying flat
        const n = 2 + Math.floor(r() * 3), w = 0.17 + r() * 0.05; let yy = y;
        for (let k = 0; k < n && yy < y + hmax - 0.05; k++) { const t = 0.026 + r() * 0.018, d = 0.14 + r() * 0.05; pushBook(W, x + w / 2 + (r() - 0.5) * 0.012, yy + t / 2, D - 0.03 - d / 2, w, t, d, 0, fam[Math.floor(r() * 5)], tone); yy += t; }
        x += w + 0.012; continue;
      }
      if (roll < 0.1) { x += 0.025 + r() * 0.06; continue; }
      const w = 0.028 + r() * 0.03, h = Math.min(hmax, (0.19 + r() * 0.1) * (r() < 0.1 ? 1.2 : 1)), d = 0.15 + r() * 0.06;
      if (x + w > xb) break;
      let tilt = 0, dx = 0;
      if (r() < 0.05 && xb - x > 0.12) { tilt = -0.22; dx = Math.sin(0.22) * h / 2; }
      pushBook(W, x + w / 2 + dx, y + h / 2 * Math.cos(tilt), D - 0.025 - d / 2 + (r() - 0.5) * 0.012, w, h, d, tilt, fam[Math.floor(r() * 5)], tone * (0.95 + r() * 0.08));
      x += w + 0.002 + (tilt ? 0.09 : 0);
    }
  }

  // ===================================================================================== left wall: honey bookcases
  yield 'bookcases';
  B.tag = 'bookcases';
  {
    const H = 2.3, D = 0.38, levels = [0.1, 0.56, 1.02, 1.48, 1.94], z0 = -0.85, len = 4.4, nb = 4, bw = len / nb;
    // local x runs from the front corner toward the back along the left wall; local +Z points into the room
    const W = new THREE.Matrix4().makeRotationY(PI / 2).setPosition(X0 + 0.01, 0, z0);
    const wood = '#D9AF7F', woodL = '#E6C49A', woodD = '#BE9265';
    const r = mulberry32(11);
    B.add('woodVC', g.box(), { p: [len / 2, H / 2, 0.012], s: [len, H, 0.024], c: woodD, uv: [len / 0.8, H / 0.8], post: W });
    B.add('woodVC', g.box(), { p: [len / 2, 0.05, D / 2], s: [len, 0.1, D], c: shade(woodD, -0.06), uv: [len / 0.8, 0.15], post: W });
    B.add('woodVC', g.rbox(len + 0.05, 0.08, D + 0.05, 0.02, 1), { p: [len / 2, H + 0.04, D / 2 + 0.012], c: woodL, uv: [len / 0.8, 0.2], post: W });
    B.add('woodVC', g.rbox(len + 0.11, 0.035, D + 0.1, 0.015, 1), { p: [len / 2, H + 0.095, D / 2 + 0.03], c: shade(woodL, 0.05), uv: [len / 0.8, 0.2], post: W });
    // scalloped apron under the crown
    const ns = Math.round(len / 0.16);
    for (let i = 0; i < ns; i++) B.add('woodVC', new THREE.CircleGeometry(1, 10, PI, PI), { p: [(i + 0.5) * len / ns, H - 0.005, D + 0.006], s: [len / ns / 2 * 1.02, 0.055, 1], c: woodL, uv: [0.3, 0.3], post: W });
    for (let i = 0; i <= nb; i++) B.add('woodVC', g.rbox(0.05, H, D, 0.012, 1), { p: [i * bw, H / 2, D / 2], c: wood, ao: 0.12, uv: [0.25, H / 0.85], uvSwap: true, post: W });
    for (let b = 0; b < nb; b++) {
      const xa = b * bw + 0.03, xb = (b + 1) * bw - 0.03;
      for (let li = 0; li < levels.length; li++) {
        const y = levels[li], next = li + 1 < levels.length ? levels[li + 1] : H - 0.06;
        if (li > 0) B.add('woodVC', g.box(), { p: [b * bw + bw / 2, y - 0.015, D / 2], s: [bw - 0.05, 0.03, D - 0.012], c: woodL, uv: [bw / 0.85, 0.1], post: W });
        // some bays get face-out picture books, a basket or a crochet friend, the rest are packed with spines
        const key = (b * 7 + li * 3) % 10;
        if (li === 1 && b % 2 === 0) {
          faceOutBook(at(xa + 0.2, y, D - 0.12, 0, W), 0.24, 0.27, (b * 3 + 1) % 8);
          faceOutBook(at(xa + 0.55, y, D - 0.1, 0, W), 0.22, 0.25, (b * 3 + 4) % 8, 0.16);
          fillBooks(W, xa + 0.72, xb, y, next - y - 0.04, D, r);
        } else if (li === 3 && b % 2 === 1) {
          faceOutBook(at(xa + 0.22, y, D - 0.12, 0, W), 0.25, 0.28, (b * 5 + 2) % 8);
          K.miniAnimal(B, at(xa + 0.62, y, D - 0.17, 0, W), b % 2 ? 'bunny' : 'cat', { body: ['#F3E7D6', '#E3A673', '#D9CFE3', '#F6EEE6'][b % 4], size: 0.16 });
          fillBooks(W, xa + 0.8, xb, y, next - y - 0.04, D, r);
        } else if (li === 0) {
          // bottom: baskets of yarn and parcels
          const bx = xa + 0.25 + (b % 2) * 0.5;
          K.scallopBasket(B, at(bx, y, D / 2, 0.2, W), { r: 0.15, h: 0.16, liner: '#FBF7F0' });
          yarnBall(at(bx, y + 0.08, D / 2, 0, W), -0.05, 0.02, 0.0, 0.055, ['#EFC5B9', '#C5D3B8', '#F3E2C8', '#D9CFE3'][b]);
          yarnBall(at(bx, y + 0.08, D / 2, 0, W), 0.05, 0.03, 0.02, 0.05, ['#FBF6EE', '#E8A87C', '#C9D5E3', '#F3D88C'][b]);
          fillBooks(W, b % 2 ? xa : xa + 0.55, b % 2 ? xb - 0.6 : xb, y, next - y - 0.04, D, r, { tone: 0.9 });
        } else fillBooks(W, xa, xb, y, next - y - 0.04, D, r, { tone: key < 3 ? 1.02 : 1 });
        void key;
      }
    }
    // plants and a basket on top, fairy lights draped along the crown
    trailingPlant(X0 + 0.22, H + 0.11, -1.35, 0.5, V(1, 0, 0), 'cream', 3);
    bushPlant(X0 + 0.22, H + 0.11, -2.55, 0.42, 'terracotta', 4);
    trailingPlant(X0 + 0.22, H + 0.11, -3.75, 0.6, V(1, 0, 0), 'blush', 5);
    bushPlant(X0 + 0.22, H + 0.11, -4.9, 0.38, 'sage', 6, '#9DB38F');
    const fl = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12, z = z0 - 0.05 - t * (len - 0.1); fl.push(V(X0 + D + 0.06, H + 0.02 - 0.12 * Math.abs(Math.sin(t * PI * 4)), z)); }
    K.fairyLights(B, fl, halos, { step: 0.13 });
  }

  // ===================================================================================== back wall: the arched built-in (cream, blush niches)
  yield 'arches';
  B.tag = 'arches';
  {
    const W = new THREE.Matrix4().makeTranslation(0, 0, Z1 + 0.008);
    const arches = [
      { cx: 0, w: 1.42, y0: 0.94, ys: 2.32, shelves: [1.62] },
      { cx: -1.62, w: 0.9, y0: 0.94, ys: 2.05, shelves: [1.46, 1.95] },
      { cx: 1.62, w: 0.9, y0: 0.94, ys: 2.05, shelves: [1.46, 1.95] },
    ];
    K.archWall(B, W, { ...ARCH, arches, face: '#F7EEE3', inside: '#E8B4A5' });
    const D = ARCH.D, zf = Z1 + 0.008 + D;
    // base cupboards: raised panel doors with rose-gold knobs under each niche
    for (const a of arches) {
      const nd = a.w > 1 ? 2 : 1, dw = (a.w + 0.1) / nd;
      for (let k = 0; k < nd; k++) {
        const x = a.cx - (a.w + 0.1) / 2 + (k + 0.5) * dw;
        B.add('clay', g.rbox(dw - 0.06, 0.66, 0.025, 0.012, 1), { p: [x, 0.5, zf + 0.012], c: '#F2E6D8', ao: 0.06 });
        B.add('clay', g.rbox(dw - 0.18, 0.5, 0.012, 0.006, 1), { p: [x, 0.5, zf + 0.03], c: '#FAF3EA' });
        B.add('metal', g.sph(8, 6), { p: [x + (nd === 2 ? (k ? -1 : 1) * (dw / 2 - 0.08) : 0), 0.62, zf + 0.045], s: [0.016, 0.016, 0.012], c: RG });
      }
    }
    // a soft blush band (top of the base) under the niches
    B.add('clay', g.rbox(ARCH.xb - ARCH.xa, 0.05, 0.05, 0.015, 1), { p: [0, 0.9, zf + 0.02], c: '#FBF5EC' });
    // centre niche: picture books face-out + a sleepy crochet cat on the floor of the niche, plants and yarn on the shelf
    const zn = Z1 + 0.008 + D * 0.55, yC = arches[0].y0;
    const r = mulberry32(23);
    const nb = at(0, 0, Z1 + 0.008 + 0.02);
    faceOutBook(at(-0.42, yC, zn - 0.02, 0.12), 0.26, 0.29, 0); faceOutBook(at(0.42, yC, zn - 0.02, -0.12), 0.26, 0.29, 6);
    fillBooks(nb, -0.69, -0.57, yC, 0.4, D - 0.06, r); fillBooks(nb, -0.26, -0.02, yC, 0.4, D - 0.06, r);
    K.miniAnimal(B, at(0.13, yC, zn, -0.1), 'cat', { body: '#F3E7D6', ears: '#EFC5B9', size: 0.17, pose: 'loaf' });   // a sleepy crochet cat
    yarnBall(I, 0.62, yC, zn, 0.055, '#E8A87C');
    trailingPlant(-0.38, 1.62, zn, 0.3, V(0, 0, 1), 'cream', 9);
    fillBooks(nb, -0.69, -0.5, 1.62, 0.44, D - 0.06, r); fillBooks(nb, -0.24, -0.02, 1.62, 0.4, D - 0.06, r); fillBooks(nb, 0.55, 0.69, 1.62, 0.44, D - 0.06, r);
    yarnBall(I, 0.05, 1.62, zn - 0.02, 0.06, '#EFC5B9'); yarnBall(I, 0.17, 1.62, zn + 0.03, 0.055, '#C5D3B8'); yarnBall(I, 0.11, 1.72, zn, 0.05, '#FBF6EE');
    K.miniAnimal(B, at(0.38, 1.62, zn, -0.2), 'bunny', { size: 0.17 });
    // the stitched hoop (cat and moon) high in the centre arch
    { const hp = new THREE.CircleGeometry(0.2, 28); hp.translate(0, 2.42, Z1 + 0.026); B.raw('hoop', hp);
      B.add('woodVC', g.tor(0.07, 5, 32), { p: [0, 2.42, Z1 + 0.03], s: 0.205, c: '#D9B286', uv: [4, 0.3] });
      B.add('woodVC', g.rbox(0.05, 0.05, 0.03, 0.01, 1), { p: [0, 2.64, Z1 + 0.03], c: '#C99A6C' }); }
    // side niches: books, little crochet animals, a vase with a sprig, a tiny parcel
    for (const s of [-1, 1]) {
      const cx = s * 1.62;
      fillBooks(nb, cx - 0.43, cx + 0.07, 1.46, 0.44, D - 0.06, r);
      yarnBall(I, cx + 0.39, 1.46, zn, 0.045, s < 0 ? '#C5D3B8' : '#EFC5B9');
      fillBooks(nb, cx - 0.43, cx - 0.33, yC, 0.46, D - 0.06, r);
      fillBooks(nb, cx - 0.05, cx + 0.43, yC, 0.46, D - 0.06, r);
      fillBooks(nb, cx - 0.1, cx + 0.05, 1.95, 0.3, D - 0.06, r);
      yarnBall(I, cx - 0.38, 1.95, zn, 0.045, s < 0 ? '#F3D88C' : '#C9D5E3');
      K.miniAnimal(B, at(cx + 0.24, 1.46, zn, -s * 0.25), s < 0 ? 'bear' : 'duck', { size: 0.15 });
      K.miniAnimal(B, at(cx - 0.2, yC, zn, s * 0.3), s < 0 ? 'cat' : 'sheep', { size: 0.14, pose: s < 0 ? 'loaf' : 'sit', body: s < 0 ? '#F8F2E9' : undefined });
      const vW = at(cx - 0.22, 1.95, zn, 0);
      B.add('satin', g.lathe('vase2', [[0, 0], [0.045, 0], [0.055, 0.05], [0.038, 0.12], [0.022, 0.15], [0.03, 0.17], [0, 0.16]], 12), { c: s < 0 ? '#F4EADB' : '#E9BFB1', ao: 0.2, post: vW });
      for (let k = 0; k < 3; k++) B.add('felt', g.sph(8, 6), { p: [(k - 1) * 0.04, 0.24 + (k % 2) * 0.04, 0], s: 0.026, c: ['#F3D88C', '#FBF6EE', '#EFC5B9'][k], post: vW });
      B.add('leaf', g.lumpy(61 + s, 0.2, 5, 8, 6), { p: [0, 0.2, 0], s: [0.06, 0.05, 0.04], c: '#9DB393', post: vW });
      faceOutBook(at(cx + 0.18, 1.95, zn - 0.02, -s * 0.1), 0.2, 0.22, s < 0 ? 4 : 7);
    }
    // fairy lights tracing the centre arch just inside the bead
    const a0 = arches[0], pts = [];
    for (let i = 0; i <= 18; i++) { const t = i / 18, ang = PI * t; pts.push(V(a0.cx + Math.cos(ang) * (a0.w / 2 + 0.05), a0.ys + Math.sin(ang) * (a0.w / 2 + 0.05), zf + 0.03)); }
    K.fairyLights(B, [V(a0.cx + a0.w / 2 + 0.05, a0.y0 + 0.4, zf + 0.03), ...pts, V(a0.cx - a0.w / 2 - 0.05, a0.y0 + 0.4, zf + 0.03)], halos, { step: 0.12, haloEvery: 2, haloA: 0.62 });   // v4: every other bulb (the overlapping halos summed to a white tube unpainted)
  }

  // ===================================================================================== back-right: white vintage shelves, garland, suitcase, baskets
  yield 'vintage';
  B.tag = 'vintage';
  const decorAnimal = (kind, size, x, y, z, ry, o = {}) => {
    K.miniAnimal(B, at(x, y, z, ry), kind, { size, ...o });
    shadow(x, y, z, size * 0.9, size * 0.8, 0.4);
  };
  {
    const zb = Z1 + 0.01;
    // a deeper blush painted panel behind the white shelves (value contrast for the distressed white paint)
    B.add('clay', g.rbox(1.56, 1.62, 0.014, 0.006, 1), { p: [3.14, 0.95 + 0.81, Z1 + 0.012], c: '#E6B4A6', ao: 0.05 });
    B.add('clay', g.rbox(1.6, 0.035, 0.03, 0.01, 1), { p: [3.14, 2.58, Z1 + 0.018], c: '#FCF6EE' });
    K.vintageShelf(B, at(2.86, 0, zb, 0), { w: 0.86, h: 1.6, d: 0.32, shelves: [0.14, 0.62, 1.1] });
    K.vintageShelf(B, at(3.6, 0, zb, 0), { w: 0.62, h: 1.08, d: 0.3, shelves: [0.14, 0.6], crest: 1 });
    shadow(2.86, 0, zb + 0.2, 1.0, 0.5, 0.4); shadow(3.58, 0, zb + 0.2, 0.75, 0.45, 0.4);
    const zs = zb + 0.17;
    // crochet animals on the white shelves (decor, pastel; no tuxedo)
    decorAnimal('bunny', 0.15, 2.62, 1.11, zs, 0.15); decorAnimal('cat', 0.15, 2.88, 1.11, zs, 0, { body: '#E3A673', belly: '#F7EADA', bow: '#EFC5B9' }); decorAnimal('bear', 0.15, 3.12, 1.11, zs, -0.15);
    decorAnimal('sheep', 0.14, 2.66, 0.63, zs, 0.2, { bell: false }); decorAnimal('cat', 0.14, 3.08, 0.63, zs, -0.1, { body: '#D9CFE3', belly: '#FBF6EE' });
    decorAnimal('duck', 0.13, 3.45, 0.61, zs, 0.1, { pocket: true }); decorAnimal('cat', 0.13, 3.72, 0.61, zs, -0.15, { body: '#F8F2E9', ears: '#EFC5B9', pose: 'loaf' });
    faceOutBook(at(2.88, 0.63, zs - 0.08, 0), 0.2, 0.22, 2);
    faceOutBook(at(3.58, 0.15, zs - 0.08, 0), 0.22, 0.25, 5);
    fillBooks(at(0, 0, zb), 2.47, 3.25, 0.15, 0.4, 0.3, mulberry32(5));
    // retro blocks + a little tin on the top of the short shelf
    for (const [x, c] of [[3.4, '#F3D88C'], [3.5, '#C9D5E3'], [3.45, '#EFC5B9']]) B.add('clay', g.rbox(0.07, 0.07, 0.07, 0.01, 1), { p: [x, 1.13 + (x === 3.45 ? 0.07 : 0), zs], c });
    B.add('satin', g.cyl(14), { p: [3.74, 1.16, zs], s: [0.06, 0.12, 0.06], c: '#C9D5E3', ao: 0.15 });
    // felt flower garland swagged across the wall above the shelves
    K.garland(B, [V(2.36, 2.3, zb + 0.03), V(2.75, 2.04, zb + 0.03), V(3.15, 2.24, zb + 0.03), V(3.5, 2.02, zb + 0.03), V(3.9, 2.26, zb + 0.03)], { step: 0.17, size: 0.075 });
    // pink vintage suitcase with a crochet bear and a sprig of flowers
    const sW = at(3.2, 0, -6.35, -0.35);
    const inside = K.suitcase(B, sW, {});
    K.miniAnimal(B, at(inside.x + 0.02, inside.y - 0.06, inside.z + 0.02, -0.35), 'bear', { size: 0.24, bow: '#EFC5B9' });
    for (let k = 0; k < 4; k++) B.add('felt', g.sph(8, 6), { p: [-0.18 + k * 0.03, 0.2 + (k % 2) * 0.03, 0.08 - k * 0.02], s: 0.022, c: ['#F3D88C', '#FBF6EE', '#E9A9A0', '#F3D88C'][k], post: sW });
    shadow(3.2, 0, -6.35, 0.7, 0.55, 0.45);
    // scalloped-liner baskets with crochet friends
    const basket = (x, z, r, h, ry, fill) => {
      const W = at(x, 0, z, ry), top = K.scallopBasket(B, W, { r, h });
      fill.forEach(([kind, size, dx, dz, o], i) => decorAnimal(kind, size, x + dx, top - 0.02, z + dz, ry + (i - 0.5) * 0.4, o || {}));
      shadow(x, 0, z, r * 2.6, r * 2.6, 0.45);
    };
    basket(2.48, -6.22, 0.19, 0.17, 0.2, [['bunny', 0.15, -0.05, 0.0], ['sheep', 0.13, 0.08, 0.04, { bell: false }]]);
    basket(3.55, -5.62, 0.17, 0.15, -0.6, [['bear', 0.14, 0, 0]]);
  }

  // ===================================================================================== right wall: bench with baskets, hoop, olive tree
  yield 'right';
  B.tag = 'right';
  {
    // a low white bench along the right wall
    const W = new THREE.Matrix4().makeRotationY(-PI / 2).setPosition(X1 - 0.02, 0, -4.75);
    B.add('clay', g.rbox(1.1, 0.06, 0.36, 0.02, 1), { p: [0, 0.42, 0.18], c: '#F6F0E6', post: W });
    for (const sx of [-1, 1]) B.add('clay', g.rbox(0.05, 0.42, 0.32, 0.012, 1), { p: [sx * 0.5, 0.21, 0.18], c: '#F1E9DD', post: W });
    B.add('clay', g.rbox(1.0, 0.03, 0.3, 0.01, 1), { p: [0, 0.12, 0.18], c: '#F1E9DD', post: W });
    const bp = (lx, lz) => new THREE.Vector3(lx, 0, lz).applyMatrix4(W);
    { const p1 = bp(-0.25, 0.18); const Wb = at(p1.x, 0.45, p1.z, 0.3); const top = K.scallopBasket(B, Wb, { r: 0.15, h: 0.14 });
      decorAnimal('cat', 0.14, p1.x, 0.45 + top - 0.02, p1.z, -1.3, { body: '#F3E7D6', ears: '#EFC5B9' }); }
    { const p2 = bp(0.26, 0.18); const Wb = at(p2.x, 0.45, p2.z, -0.2); const top = K.scallopBasket(B, Wb, { r: 0.14, h: 0.13, hex: '#D2B892' });
      for (let k = 0; k < 3; k++) yarnBall(I, p2.x + (k - 1) * 0.06, 0.45 + top - 0.03 + (k % 2) * 0.02, p2.z + (k % 2) * 0.04, 0.05, ['#EFC5B9', '#C5D3B8', '#F3E2C8'][k]); }
    { const p3 = bp(0.0, 0.2); K.scallopBasket(B, at(p3.x, 0.12 + 0.015, p3.z, 0), { r: 0.16, h: 0.13, handles: false }); }
    shadow(X1 - 0.2, 0, -4.75, 0.5, 1.25, 0.4);
    // the stitched hoop above the bench
    const hp = new THREE.CircleGeometry(0.22, 28).rotateY(-PI / 2); hp.translate(X1 - 0.02, 1.62, -4.75); B.raw('hoop', hp);
    B.add('woodVC', g.tor(0.07, 5, 32), { p: [X1 - 0.025, 1.62, -4.75], r: [0, PI / 2, 0], s: 0.225, c: '#D9B286', uv: [4, 0.3] });
    // olive tree beside the café counter
    const Wt = at(3.45, 0, -3.95, 0.4);
    potLite(Wt, 0.2, 0.34, 'terracotta');
    B.add('clay', g.tube([[0, 0.28, 0], [0.03, 0.8, 0.02], [-0.02, 1.25, 0.0], [0.04, 1.55, -0.02]], 0.025, 10, 5), { c: '#8E7666', post: Wt });
    for (const [x, y, z, s, c] of [[0, 1.66, 0, 0.2, '#93AC86'], [0.2, 1.5, 0.08, 0.15, '#A3B894'], [-0.2, 1.52, -0.05, 0.16, '#89A27E'], [0.06, 1.88, 0.02, 0.14, '#9DB393'], [-0.12, 1.78, 0.12, 0.13, '#A3B894'], [0.16, 1.74, -0.12, 0.14, '#89A27E'], [-0.08, 1.4, 0.1, 0.11, '#9DB393'], [0.24, 1.66, 0.1, 0.1, '#93AC86']]) B.add('leaf', g.lumpy(700 + Math.round(x * 50 + y * 10), 0.22, 7, 12, 9), { p: [x, y, z], s: [s, s * 0.85, s], c, ao: 0.3, post: Wt });
    for (const [a, b] of [[[0.02, 1.2, 0.0], [0.2, 1.5, 0.08]], [[0.0, 1.3, 0.0], [-0.2, 1.52, -0.05]], [[0.03, 1.5, 0.0], [0.16, 1.74, -0.12]]]) B.add('clay', g.tube([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.03, (a[2] + b[2]) / 2], b], 0.012, 6, 4), { c: '#8E7666', post: Wt });
    shadow(3.45, 0, -3.95, 0.6, 0.6, 0.45);
  }

  // ===================================================================================== the café (right, by the café window)
  yield 'cafe';
  B.tag = 'cafe';
  {
    // back bar against the right wall: a cream cabinet with the little espresso machine, grinder, jars; shelves above
    const Wb = new THREE.Matrix4().makeRotationY(-PI / 2).setPosition(X1 - 0.02, 0, CAFE.z);   // local +Z → −X (into the room)
    B.add('clay', g.rbox(1.9, 0.9, 0.46, 0.02, 1), { p: [0, 0.45, 0.23], c: '#F3E9DC', ao: 0.12, post: Wb });
    B.add('satin', g.rbox(1.96, 0.04, 0.5, 0.012, 1), { p: [0, 0.92, 0.25], c: '#F8F1E7', post: Wb });
    for (let k = 0; k < 3; k++) { B.add('clay', g.rbox(0.56, 0.7, 0.012, 0.008, 1), { p: [-0.62 + k * 0.62, 0.45, 0.462], c: '#F8EFE4', post: Wb }); B.add('metal', g.sph(8, 6), { p: [-0.62 + k * 0.62, 0.72, 0.474], s: 0.014, c: RG, post: Wb }); }
    K.espresso(B, at(-0.32, 0.94, 0.24, 0, Wb), { cast: false });
    K.grinder(B, at(0.18, 0.94, 0.24, 0, Wb), { cast: false });
    jarLite(Wb, 0.46, 0.94, 0.2, 0.16, '#C79A6E'); jarLite(Wb, 0.6, 0.94, 0.26, 0.13, '#F3E2C8'); jarLite(Wb, 0.75, 0.94, 0.2, 0.15, '#7A5A44');
    for (const [y, n] of [[1.55, 6], [1.95, 5]]) {
      B.add('woodVC', g.rbox(1.6, 0.035, 0.24, 0.01, 1), { p: [0, y, 0.12], c: '#D6AE80', uv: [2, 0.2], post: Wb });
      for (const sx of [-0.6, 0.6]) B.add('metal', g.rbox(0.02, 0.12, 0.2, 0.005, 1), { p: [sx, y - 0.07, 0.1], c: RG, post: Wb });
      for (let k = 0; k < n; k++) {
        const x = -0.68 + k * 1.36 / (n - 1);
        if (y < 1.7) mugLite(Wb, x, y + 0.018, 0.12, ['#FBF6EE', '#EFC5B9', '#C5D3B8', '#F3E2B8', '#FBF6EE', '#C9D5E3'][k], 0.6);
        else if (k % 2) jarLite(Wb, x, y + 0.018, 0.12, 0.14, ['#F3E2C8', '#C9A27C', '#EFC5B9'][k % 3]);
        else { const pw = at(x, y + 0.018, 0.12, k, Wb); potLite(pw, 0.06, 0.09, 'cream'); B.add('leaf', g.lumpy(90 + k, 0.2, 5, 10, 8), { p: [0, 0.13, 0], s: [0.07, 0.06, 0.07], c: '#9FB39A', post: pw }); }
      }
    }
    // the café pictogram board (cup, croissant, teapot — no words) above the shelves
    { const bd = new THREE.PlaneGeometry(0.78, 0.49).rotateY(-PI / 2); bd.translate(X1 - 0.042, 2.5, CAFE.z); B.raw('board', bd);
      B.add('woodVC', g.rbox(0.025, 0.55, 0.84, 0.008, 1), { p: [X1 - 0.022, 2.5, CAFE.z], c: '#C99A6C', uv: [0.3, 1] }); }
    // the half-round counter with cubbies (flat back toward the wall)
    const Wc = new THREE.Matrix4().makeRotationY(-PI / 2).setPosition(CAFE.x, 0, CAFE.z);
    const cub = K.cafeCounter(B, Wc, { R: CAFE.R, H: CAFE.H, rc: 0.6, scallops: 20 });
    shadow(CAFE.x - 0.35, 0, CAFE.z, 1.3, 2.3, 0.4);
    // fill the cubbies: books, cups, jars, tins, little crochet friends, parcels
    cub.forEach((c, i) => {
      const W = new THREE.Matrix4().makeRotationY(c.a).setPosition(c.x, c.y, c.z).premultiply(Wc);   // local +Z = out of the cubby
      const k = (i * 5 + 3) % 7;
      if (k === 0) { cupLite(W, -0.05, 0, -0.02, '#FBF6EE', true, 0.3); cupLite(W, 0.07, 0, 0.0, '#EFC5B9', false, -0.2); }
      else if (k === 1) { for (let j = 0; j < 3; j++) mugLite(W, (j - 1) * 0.08, 0, -0.02, ['#C5D3B8', '#FBF6EE', '#F3E2B8'][j]); }
      else if (k === 2) { const Mb = W.clone(); fillBooks(Mb, -c.w / 2 + 0.02, c.w / 2 - 0.02, 0, c.h - 0.06, 0.06, mulberry32(i + 40)); }
      else if (k === 3) K.miniAnimal(B, W, 'cat', { body: ['#F3E7D6', '#E3A673', '#D9CFE3'][i % 3], size: 0.15, pose: 'loaf' });
      else if (k === 4) { jarLite(W, -0.06, 0, 0, 0.15, '#C9A27C'); jarLite(W, 0.07, 0, 0.02, 0.12, '#F3E2C8'); }
      else if (k === 5) { const pc = P.parcel({ w: 0.16, h: 0.09, d: 0.12 }); const h = new THREE.Group(); h.matrixAutoUpdate = false; h.matrix.copy(W); h.add(pc); B.absorb(h); }
      else { yarnBall(W, -0.05, 0, 0, 0.055, '#EFC5B9'); yarnBall(W, 0.06, 0, 0.02, 0.05, '#A9BCA0'); }
    });
    // on the counter top (local: x along the wall, +Z toward the room): cake dome, cups, a vase of flowers, a cookie jar
    const yT = CAFE.H;
    cakeDome(Wc, -0.38, yT, 0.42);
    cupLite(Wc, 0.08, yT, 0.72, '#FBF6EE', true, 0.5); cupLite(Wc, 0.26, yT, 0.62, '#EFC5B9', true, -0.4);
    jarLite(Wc, 0.5, yT, 0.38, 0.17, '#E9C9A2');
    { const vW = at(0.12, yT, 0.32, 0, Wc);
      B.add('satin', g.lathe('vase3', [[0, 0], [0.05, 0], [0.06, 0.06], [0.04, 0.14], [0.03, 0.17], [0.036, 0.19], [0, 0.18]], 12), { c: '#C9D5E3', ao: 0.2, post: vW });
      for (let k = 0; k < 5; k++) { const a = k / 5 * PI * 2; B.add('felt', g.sph(8, 6), { p: [Math.cos(a) * 0.05, 0.27 + (k % 2) * 0.04, Math.sin(a) * 0.05], s: 0.03, c: ['#F3D88C', '#FBF6EE', '#EFC5B9', '#E9A9A0', '#FBF6EE'][k], post: vW }); }
      B.add('leaf', g.lumpy(66, 0.2, 5, 8, 6), { p: [0, 0.22, 0], s: [0.08, 0.05, 0.06], c: '#9DB393', post: vW }); }
    // the glass dome pendant over the counter
    domePendant(CAFE.x - 0.25, CAFE.z, 0.17, 2.25);
    // a small bistro table inside by the café window, two rattan chairs with gingham cushions
    const tx = 1.85, tz = -1.15;
    { const W = at(tx, 0, tz, 0.2), h = 0.74, r = 0.3;
      B.add('satin', g.cyl(20), { p: [0, h - 0.016, 0], s: [r, 0.03, r], c: '#F6EFE4', ao: 0.1, post: W });
      B.add('metal', g.tor(0.05, 3, 24), { p: [0, h - 0.016, 0], r: [PI / 2, 0, 0], s: [r + 0.002, r + 0.002, 0.3], c: RG, post: W });
      B.add('clay', g.lathe('tblColL', [[0.2, 0], [0.21, 0.015], [0.06, 0.04], [0.025, 0.1], [0.02, h * 0.6], [0.028, h * 0.62], [0.02, h * 0.64], [0.024, h - 0.04], [0, h - 0.04]], 10), { c: '#5A4E46', ao: 0.15, post: W });
      cupLite(W, -0.08, h, 0.06, '#FBF6EE', true, 0.4); cupLite(W, 0.1, h, -0.05, '#EFC5B9', true, -0.6);
      { const pw = at(0.02, h, -0.14, 0, W); B.add('satin', g.cyl(10), { p: [0, 0.05, 0], s: [0.03, 0.1, 0.03], c: '#F4EADB', post: pw }); B.add('felt', g.sph(8, 6), { p: [0, 0.14, 0], s: 0.03, c: '#E9A9A0', post: pw }); B.add('leaf', g.sph(6, 4), { p: [0.02, 0.12, 0], s: [0.025, 0.008, 0.012], c: '#9DB393', post: pw }); }
      shadow(tx, 0, tz, 0.75, 0.75, 0.45); }
    K.cafeChair(B, at(tx - 0.5, 0, tz - 0.02, PI / 2 - 0.15), { cast: false, cushion: '#F0C9BE' });
    K.cafeChair(B, at(tx + 0.42, 0, tz + 0.28, -PI / 2 - 0.6), { cast: false, cushion: '#F0C9BE' });
    shadow(tx - 0.5, 0, tz, 0.45, 0.45, 0.35); shadow(tx + 0.42, 0, tz + 0.28, 0.45, 0.45, 0.35);
    lanternLite(tx, tz, 0.17, 2.35);
  }

  // ===================================================================================== front-left: a little gift table by the display window
  yield 'gifts';
  B.tag = 'gifts';
  {
    const gx = -2.05, gz = -1.55, W = at(gx, 0, gz, 0.3), h = 0.7, r = 0.42;
    B.add('woodVC', K.slab(0.045, 0.02), { p: [0, h - 0.045, 0], s: [r, 1, r], c: '#DDB386', uv: [3, 0.3], post: W });
    B.add('woodVC', K.fluted(16, 0.1), { p: [0, (h - 0.045) / 2, 0], s: [0.12, h - 0.045, 0.12], c: '#E6CBA6', ao: 0.25, uv: [4, 1], post: W });
    B.add('woodVC', g.lathe('gtFoot', [[0, 0], [0.26, 0], [0.27, 0.02], [0.2, 0.05], [0, 0.05]], 20), { c: '#C99A6C', post: W, uv: [3, 0.2] });
    // gingham round cloth draped on top
    B.add('ginghamVC', g.lathe('gtCloth', [[0, -0.004], [r + 0.035, -0.03], [r + 0.05, -0.145], [r + 0.065, -0.14], [r + 0.055, -0.03], [r + 0.03, 0], [0, 0]], 28), { p: [0, h + 0.004, 0], c: '#FFFFFF', uv: [5, 1], post: W });
    // stacks of picture books, parcels, a crochet cat, a yarn basket
    const st = (lx, lz, n, ry) => { let y = h + 0.005; for (let k = 0; k < n; k++) { const t = 0.03 + (k % 2) * 0.01, Wk = at(lx, y, lz, ry + k * 0.12, W); B.add('clay', g.rbox(0.2 - k * 0.01, t, 0.25 - k * 0.012, 0.005, 1), { p: [0, t / 2, 0], c: ['#A9BCA0', '#EFC5B9', '#F3E2B8', '#C9D5E3'][(k + n) % 4], post: Wk }); B.add('paperVC', g.box(), { p: [0.004, t / 2, 0], s: [0.19 - k * 0.01, t - 0.008, 0.24 - k * 0.012], c: '#F7F0E3', post: Wk }); y += t; } return y; };
    const yTop = st(-0.18, 0.04, 3, 0.2);
    faceOutBook(at(-0.18, yTop, 0.0, 0.15, W), 0.2, 0.22, 3, 0.25);
    st(0.16, -0.18, 2, -0.3);
    { const pc = P.parcel({ w: 0.15, h: 0.09, d: 0.12 }); pc.position.set(gx + 0.12, h + 0.005, gz + 0.18); pc.rotation.y = 0.5; B.absorb(pc); }
    { const pc = P.parcel({ w: 0.12, h: 0.07, d: 0.1 }); pc.position.set(gx + 0.08, h + 0.095, gz + 0.16); pc.rotation.y = 0.2; B.absorb(pc); }
    K.miniAnimal(B, at(gx + 0.22, h + 0.005, gz - 0.06, 0.2), 'cat', { body: '#F7F1E8', size: 0.17, bow: '#C5D3B8' });
    shadow(gx, 0, gz, 1.0, 1.0, 0.45);
    // a big yarn basket on the floor beside it
    const Wy = at(gx - 0.62, 0, gz + 0.3, 0.4); K.scallopBasket(B, Wy, { r: 0.2, h: 0.2 });
    yarnBall(Wy, -0.06, 0.13, 0.02, 0.07, '#EFC5B9'); yarnBall(Wy, 0.07, 0.14, -0.03, 0.065, '#C5D3B8'); yarnBall(Wy, 0.01, 0.2, 0.05, 0.06, '#FBF6EE');
    shadow(gx - 0.62, 0, gz + 0.3, 0.55, 0.55, 0.45);
    // a potted fern in the front-left corner
    bushPlant(X0 + 0.36, 0, -0.56, 0.9, 'terracotta', 12, '#8EA685');
    shadow(X0 + 0.36, 0, -0.56, 0.6, 0.6, 0.4);
  }

  // ===================================================================================== floor clutter beside the walkway (v3)
  yield 'floorbits';
  B.tag = 'floorbits';
  {
    // a scalloped basket of yarn and a stack of picture books on the floor left of the display, a book stack on the right
    const Wb = at(-1.32, 0, -3.25, 0.5); const top = K.scallopBasket(B, Wb, { r: 0.18, h: 0.18 });
    yarnBall(Wb, -0.05, top - 0.07, 0.02, 0.065, '#E8A87C'); yarnBall(Wb, 0.07, top - 0.06, -0.02, 0.06, '#EFC5B9'); yarnBall(Wb, 0.0, top - 0.02, 0.06, 0.055, '#A9BCA0');
    shadow(-1.32, 0, -3.25, 0.5, 0.5, 0.45);
    const stack = (x, z, n, ry) => { let y = 0.003; for (let k = 0; k < n; k++) { const t = 0.034 + (k % 2) * 0.008, Wk = at(x, y, z, ry + k * 0.16); B.add('clay', g.rbox(0.22 - k * 0.008, t, 0.28 - k * 0.01, 0.005, 1), { p: [0, t / 2, 0], c: ['#A9BCA0', '#D98E80', '#F3D88C', '#8FA9C2', '#EFC5B9'][(k + n) % 5], post: Wk }); B.add('paperVC', g.box(), { p: [0.004, t / 2, 0], s: [0.21 - k * 0.008, t - 0.008, 0.27 - k * 0.01], c: '#F7F0E3', post: Wk }); y += t; } return y; };
    // (fix v3: beside the basket, clear of the 0.9 m walkway round the display and of the door frames' bottom edge)
    stack(-1.62, -2.98, 4, 0.3);   // (no face-out card on it: it read as a cropped white card at the frame's bottom edge)
    shadow(-1.62, 0, -2.98, 0.4, 0.4, 0.4);
    stack(1.5, -3.05, 3, -0.4); shadow(1.5, 0, -3.05, 0.38, 0.38, 0.4);
  }

  // ===================================================================================== back-left: the reading nook
  yield 'nook';
  B.tag = 'nook';
  {
    const rug = new THREE.CircleGeometry(0.78, 40).rotateX(-PI / 2); rug.translate(-3.02, 0.006, -6.25);
    setUV(rug, (x, y, z) => [(x + 3.02) / 1.62 + 0.5, -(z + 6.25) / 1.62 + 0.5]);
    B.noField = true; setColors(rug, (x, y, z) => floorTone(x, z).map((v) => v * 1.02)); B.raw('roundRugVC', rug); B.noField = false;
    K.armchair(B, at(-3.12, 0, -6.4, 0.62), { hex: '#E8BFB1', cast: false });
    shadow(-3.12, 0, -6.4, 1.1, 1.0, 0.5);
    K.floorLamp(B, at(-3.65, 0, -6.95, 0), halos, { h: 1.5, cast: false });
    K.sideTable(B, at(-2.4, 0, -6.6, 0), { h: 0.55, r: 0.22, cast: false });
    cupLite(I, -2.46, 0.55, -6.52, '#FBF6EE', true, 0.3);
    { let y = 0.55; for (let k = 0; k < 3; k++) { const t = 0.032, Wk = at(-2.34, y, -6.68, 0.3 + k * 0.2); B.add('clay', g.rbox(0.17, t, 0.22, 0.005, 1), { p: [0, t / 2, 0], c: ['#C9D5E3', '#EFC5B9', '#A9BCA0'][k], post: Wk }); y += t; } }
    shadow(-2.4, 0, -6.6, 0.55, 0.55, 0.4);
    bushPlant(X0 + 0.32, 0, -5.55, 1.0, 'cream', 14, '#8FA984');
    shadow(X0 + 0.32, 0, -5.55, 0.6, 0.6, 0.4);
    lanternLite(-3.0, -6.3, 0.2, 2.55);
  }

  // ===================================================================================== ceiling: retro chandelier + fairy-light swags
  yield 'ceiling';
  B.tag = 'ceiling';
  {
    K.chandelier(B, at(DC.x, 2.78, DC.z, 0.2), halos, { arms: 6, R: 0.36, drop: CEIL - 2.78 });
    // two long swags across the room (front-left → back-right and front-right → back-left), pinned under the beams
    const swag = (a, b, sag, n = 3) => {
      const pts = [];
      for (let i = 0; i <= n * 8; i++) {
        const t = i / (n * 8), x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t, y = a.y + (b.y - a.y) * t - sag * Math.abs(Math.sin(t * PI * n));
        pts.push(V(x, y, z));
      }
      K.fairyLights(B, pts, halos, { step: 0.16, haloEvery: 2, halo: 0.07 });
    };
    swag(V(X0 + 0.1, CEIL - 0.25, -1.2), V(X1 - 0.1, CEIL - 0.25, -6.9), 0.28, 4);
    swag(V(X1 - 0.1, CEIL - 0.25, -0.9), V(X0 + 0.1, CEIL - 0.25, -6.9), 0.28, 4);
  }

  // ===================================================================================== THE ROUND 3-TIER DISPLAY + products
  yield 'display';
  B.tag = 'display'; B.lod = 'shelf';
  P.eyeScale = 1.7;   // review #6: big button eyes and dark noses that survive the paint (the real pieces have safety eyes)
  const charmBoxes = [];
  const pickables = [];
  const slots = [];
  let nextSlot = 1;
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const box3 = new THREE.Box3();
  const pristineMeshes = [];
  {
    const Wd = at(DC.x, 0, DC.z, 0);
    K.roundDisplay(B, Wd, { tiers: TIERS });
    // the jute scalloped rug under it (room lod: it stays when the products swap levels)
    B.lod = 'room';
    { const rg = K.juteRug().clone(); rg.translate(DC.x, 0.007, DC.z); B.noField = true; setColors(rg, (x, y, z) => floorTone(x, z).map((v, i) => v * [1.03, 1.02, 1.0][i])); B.raw('juteVC', rg); B.noField = false; }
    shadow(DC.x, 0.004, DC.z, 1.75, 1.75, 0.55);
    B.lod = 'shelf';

    // ---- pickables: merged into the batch with their own slot; the Group carries a hit box (+ any real meshes)
    const place = (id, x, y, z, ry = 0, sc = 1, obj = null, o = {}) => {
      const meta = P.PRODUCTS[id];
      const src = obj || P.product(id);
      const holder = new THREE.Group(); holder.position.set(x, y, z); holder.rotation.y = ry; holder.scale.setScalar(sc);
      src.traverse((m) => { if (m.name === 'softShadow') m.visible = false; });
      holder.add(src); holder.updateMatrixWorld(true);
      box3.makeEmpty(); src.traverse((m) => { if (m.isMesh && m.visible) { m.geometry.computeBoundingBox(); const bb = m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld); box3.union(bb); } });
      // the same bounds in the holder's own (unrotated, unscaled) frame: an oriented hit box hugs pieces turned on the ring
      const inv0 = new THREE.Matrix4().copy(holder.matrixWorld).invert(), lbox = new THREE.Box3();
      src.traverse((m) => { if (m.isMesh && m.visible) lbox.union(m.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv0, m.matrixWorld))); });
      const slot = nextSlot++;
      if (slot >= PICK_SLOTS) throw new Error('interior: too many pick slots');
      const out = [];
      B.absorb(holder, { pid: slot, cast: false, extract: o.extract, out, cell: o.cell === undefined ? 0.0058 : o.cell });
      const sw = box3.max.x - box3.min.x, sd = box3.max.z - box3.min.z;
      if (o.shadow !== false) shadow((box3.min.x + box3.max.x) / 2, y, (box3.min.z + box3.max.z) / 2, Math.max(0.1, sw * 1.15), Math.max(0.08, sd * 1.3), 0.45);
      const pg = new THREE.Group(); pg.name = 'pick:' + id; pg.position.set(x, y, z);
      pg.userData.pick = { id, name: meta[0], kind: meta[1] };
      const pad = 0.005, ls = new THREE.Vector3(), lc = new THREE.Vector3();
      lbox.getSize(ls).multiplyScalar(sc); lbox.getCenter(lc).multiplyScalar(sc);
      const hb = new THREE.Mesh(new THREE.BoxGeometry(ls.x + pad * 2, ls.y + pad, ls.z + pad * 2), hitMat);
      hb.position.copy(lc).applyAxisAngle(new THREE.Vector3(0, 1, 0), ry); hb.position.y += pad / 2; hb.rotation.y = ry;
      hb.name = 'hit:' + id;
      pg.add(hb);
      // real meshes (pristine layer): re-parented into the pick group so main.js's hover moves them natively
      pg.updateMatrixWorld(true);
      const inv = new THREE.Matrix4().copy(pg.matrixWorld).invert();
      for (const m of out) {
        const c = new THREE.Mesh(m.geometry, m.material); c.name = m.name || ('real:' + id);
        new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld).decompose(c.position, c.quaternion, c.scale);
        if (o.layer1) { c.layers.set(1); pristineMeshes.push(c); }
        pg.add(c);
      }
      group.add(pg); pickables.push(pg);
      { const pv = K.pickUniforms.uPiv.value; pv[slot * 3] = x; pv[slot * 3 + 1] = y; pv[slot * 3 + 2] = z; }
      slots.push({ g: pg, slot, y0: y, s0: 1 });
      return pg;
    };
    const [tB, tM, tT] = TIERS;
    const yB = tB[0], yM = tM[0], yT = tT[0];

    // TOP TIER — the fabric book facing the camera, the crochet tuxedo cat and the framed real Merlin photo
    {
      T.embroideredCover(); yield 'cover';
      const bk = P.fabricBook({ w: 0.3, h: 0.3, d: 0.045, tilt: 0.16 });
      // the pristine cover: a separate unlit plane laid exactly on the cover face (the batch keeps the painted copy)
      let front = null; bk.traverse((m) => { if (m.isMesh && Array.isArray(m.material)) front = m; });   // (userData.cover points at the cached template)
      if (front) {
        const cw = 0.3 * 0.975, ch = 0.3 * 0.975;
        const cm = new THREE.MeshBasicMaterial({ map: T.embroideredCover(), toneMapped: false, color: '#F2E9DE' });
        const cp = new THREE.Mesh(new THREE.PlaneGeometry(cw, ch), cm); cp.name = 'pristineCover';
        cp.position.set(0, 0, 0.0068); front.add(cp);
      }
      const pg = place('open-book', DC.x, yT, DC.z - 0.07, 0, 1, bk, { extract: (m) => m.name === 'pristineCover', layer1: true });
      void pg;
      yield 'book';
      // integrator: a deeper black knit than the library default so the one tuxedo cat still reads black-and-white under the warm display light and the paint
      place('tuxedo-cat', DC.x - 0.19, yT, DC.z + 0.1, 0.38, 1, P.crochetCat({ tuxedo: true, size: 0.19, bow: null, body: '#141211' }));
      yield 'tuxedo';
      place('merlin', DC.x + 0.19, yT, DC.z + 0.1, -0.38, 1, P.photoFrame(T.merlinPhoto(), 0.17, 0.215), {
        extract: (m) => !!(m.material && m.material.map && m.material.map.source === T.merlinPhoto().source), layer1: true,
      });
    }
    yield 'top';
    // MIDDLE TIER — the four doll items round the front arc + two decor cats (pastel; not black-and-white)
    {
      const rM = 0.43;
      for (const [id, a] of [['george-washington-doll', -1.0], ['anne-shirley-set', -0.36], ['bennet-darcy-set', 0.34], ['dashwood-ferrars-set', 1.0]]) {
        place(id, DC.x + Math.sin(a) * rM, yM, DC.z + Math.cos(a) * rM, a * 0.55);
        yield 'doll';
      }
      for (const [a, o] of [[-1.62, { body: '#F3E7D6', ears: '#EFC5B9', pose: 'loaf', size: 0.13 }], [1.62, { body: '#EFC5B9', belly: '#FBF6EE', size: 0.14, bow: '#C5D3B8' }]]) {
        K.miniAnimal(B, at(DC.x + Math.sin(a) * 0.42, yM, DC.z + Math.cos(a) * 0.42, a * 0.7), 'cat', o);
        shadow(DC.x + Math.sin(a) * 0.42, yM, DC.z + Math.cos(a) * 0.42, 0.14, 0.14, 0.4);
      }
    }
    // BOTTOM TIER — the nine crochet animals round the front arc, mini scalloped baskets and small books between/behind
    {
      // two staggered rows round the front arc (beyond ±1.1 rad the ring turns away and pieces stack up on screen):
      // five at the rim, four a step back peeking between them; angles 70 % max-min-gap on screen from the shelf
      // camera, 30 % even in angle
      const rows = [
        ['ginger-tabby-cat', -1.136, 0.71], ['maine-coon-cat', -0.888, 0.585], ['calico-crochet-cat', -0.386, 0.71],
        ['siamese-cat', -0.218, 0.585], ['white-cat', 0.038, 0.71], ['british-shorthair-cat', 0.276, 0.585],
        ['knitted-sheep', 0.461, 0.71], ['knitted-daisy-duck', 0.887, 0.585], ['crochet-animal-friends-set', 1.113, 0.7],
      ];
      for (const [id, a, rr] of rows) { place(id, DC.x + Math.sin(a) * rr, yB, DC.z + Math.cos(a) * rr, a * 0.55); yield 'animal'; }
      // decor round the back half: mini baskets with yarn, little stacks of books, a parcel
      for (const [a, kind] of [[1.95, 'basket'], [2.45, 'books'], [2.95, 'basket'], [-2.95, 'parcel'], [-2.45, 'books'], [-1.95, 'basket']]) {
        const x = DC.x + Math.sin(a) * 0.62, z = DC.z + Math.cos(a) * 0.62;
        if (kind === 'basket') { const W = at(x, yB, z, a); K.scallopBasket(B, W, { r: 0.085, h: 0.08, scallops: 7, drop: 0.03, handles: false }); yarnBall(W, 0, 0.04, 0, 0.045, ['#EFC5B9', '#C5D3B8', '#F3E2C8'][Math.abs(Math.round(a * 3)) % 3]); }
        else if (kind === 'books') { let y = yB; for (let k = 0; k < 3; k++) { const t = 0.026, Wk = at(x, y, z, a + k * 0.2); B.add('clay', g.rbox(0.15, t, 0.19, 0.004, 1), { p: [0, t / 2, 0], c: ['#C9D5E3', '#EFC5B9', '#A9BCA0'][k], post: Wk }); B.add('paperVC', g.box(), { p: [0.004, t / 2, 0], s: [0.142, t - 0.007, 0.182], c: '#F7F0E3', post: Wk }); y += t; } }
        else { const pc = P.parcel({ w: 0.14, h: 0.08, d: 0.11 }); pc.position.set(x, yB, z); pc.rotation.y = a; B.absorb(pc); }
        shadow(x, yB, z, 0.18, 0.18, 0.4);
      }
    }

    yield 'bottom';
    // THE HOOK STAND — the two fabric dolls on backpacks, the quilted pouch, keychains
    {
      const Wh = at(HS.x, 0, HS.z, HS_RY);
      const hooks = K.hookStand(B, Wh, { H: HS_H, topW: 0.66, lowY: 0.9, lowW: 0.3 });   // (fix v3: the low bar higher + shorter: the pouch clears the bottom tier's pieces from the shelf view)
      shadow(HS.x, 0, HS.z, 0.55, 0.5, 0.5);
      const wp = (p, dy = 0) => p.clone().add(V(0, dy, 0)).applyMatrix4(Wh);
      const bp1 = wp(hooks.top[0], -0.185 * BAG), bp2 = wp(hooks.top[1], -0.185 * BAG);
      // v3: warmer, more saturated bag linens (rose clay / dusty blue) so the paper pull leaves them coloured and the dolls read
      const cA = place('linen-pocket-doll', bp1.x, bp1.y, bp1.z, HS_RY, BAG, P.backpack({ hex: '#D39A86', pocket: '#C2877A', doll: { dress: '#F6DCD2', hair: '#8E6A52' } }), { shadow: false });
      const cB = place('americana-doll-bag-charm', bp2.x, bp2.y, bp2.z, HS_RY, BAG, P.backpack({ hex: '#8DA3BC', pocket: '#7B91AA', doll: { pattern: 'americana', hair: '#C9A27C', heart: '#C9937E' } }), { shadow: false });
      for (const c of [cA, cB]) { c.updateMatrixWorld(true); charmBoxes.push(new THREE.Box3().setFromObject(c)); }
      const pp = wp(hooks.low[2].clone().add(V(0, 0, 0.03)), -0.16 * 1.15);
      // a little ribbon loop from the hook to the pouch
      const lp = wp(hooks.low[2], -0.02);
      B.lod = 'room'; B.add('felt', g.tor(0.12, 4, 12), { p: [lp.x, lp.y, lp.z], r: [0, HS_RY, 0], s: [0.016, 0.03, 0.016], c: '#EFC5B9' }); B.lod = 'shelf';
      const cP = place('quilted-cat-pouch', pp.x, pp.y, pp.z, HS_RY, 1.15, null, { shadow: false });
      cP.updateMatrixWorld(true); charmBoxes.push(new THREE.Box3().setFromObject(cP));
      const KC = [['cat', '#F3E7D6'], ['pompom', '#EFC5B9'], ['heart', '#C9937E'], ['yarn', '#A9BCA0']];
      [0, 1, 3, 4].forEach((hi, k) => { const p = wp(hooks.low[hi], 0.005); keychainLite(p.x, p.y, p.z, KC[k][0], KC[k][1], HS_RY + (k - 1.5) * 0.3); });
    }
  }

  P.eyeScale = 1;
  // ===================================================================================== build: merged meshes, books, halos, lights
  yield 'stand';
  B.lod = null;
  const meshes = yield* B.buildSteps(group, 'interior', {
    // display products: 8.5 mm clusters at the shelf view (≈ 3–4 px there, under the paint's 4 px Kuwahara), 10.5 mm from 3.3 m, 14 mm from 8 m
    // (integrator: far from 7 m and the extra-far level from 9.5 m, so the street-side walk frames stay under 250k with the plants outside)
    // (v3: far from 5.6 m — from the doorway the products are ~25 px tall, so 14 mm clusters + flat clay cost nothing visible
    //  and keep the door view under 250k with the fuller display window and niches)
    // (v4, clean 3D: no 8.5 mm clusters at the shelf any more — the knit, felt and faces read crisply unpainted, +17k
    //  triangles there; and no material merge in the far levels, so no LOD step changes a texture or a shine: the walk
    //  in only sees the geometry get finer, never a pop. +7 draws in the street views, well inside the budget.)
    // (v4: full detail from 4.0 m — 3.68 m on the way in with the 8 % hysteresis — so the phone's shelf frame, which
    //  backs off to ≈ 3.2 m, rests on the near level instead of sitting on the 3.3 m switch)
    shelf: { center: V(DC.x, 1.0, DC.z), dist: 5.6, cell: 0.014, mid: { dist: 4.0, cell: 0.0105 }, mergeFar: false, xfar: { dist: 9.5, cell: 0.03 } },
    // the room: full detail once a step inside, 8 mm clusters from the threshold out (≥ 3.35 m: ≤ 2 px under the paint's
    // 4 px smoothing — the doorway frame sees the street and the whole room at once), 10 mm once back on the street
    room: { center: V(0, 1.6, RZC), dist: 7.2, cell: 0.01, mid: { dist: 3.35, cell: 0.008 }, xfar: { dist: 11, cell: 0.022 } },
  });
  yield 'merged';
  const bookMeshes = books.build(group);
  // a soft glow over the display (the brightest, most inviting thing in the room)
  // (v3: above the book, not in front of the top tier — an additive glow over the products washed the black crochet
  //  tuxedo cat to taupe under the paint's glow gain)
  halos.push({ p: V(DC.x, 2.3, DC.z - 0.25), size: 0.75, a: 0.1, color: '#FFD8B0' });
  const haloMesh = K.halos(halos, group);
  /* v4: two looks. The paint multiplies these glows by 1 + 4 × 0.3 (its glow gain, calmed for the room), so the clean
     3D look (added as is) needs a stronger gain of its own; setLook() switches (one uniform, no new program). */
  const HALO_GAIN = { paint: 0.85, '3d': 1.35 };
  let look = (() => {
    if (ctx.look === '3d' || ctx.look === 'paint') return ctx.look;
    try {
      const q = new URLSearchParams(location.search), l = (q.get('look') || '').trim(), pt = q.get('paint');
      if (l === 'paint' || l === '3d') return l;
      if (l.startsWith('{')) return 'paint';
      if (pt === '0' || pt === 'off') return '3d';
      if (pt) return 'paint';
    } catch (e) { /* no location */ }
    return '3d';
  })();
  function setLook(name) {
    look = name === 'paint' ? 'paint' : '3d';
    if (haloMesh) haloMesh.material.uniforms.uGain.value = HALO_GAIN[look];
    // the fairy bulbs: HDR-hot under the paint (it keeps them amber), plain amber unpainted (×1.9 clipped to white)
    K.mat('bulb').color.setScalar(look === 'paint' ? 1.9 : 1.12);
    // rose-gold (v4 fixer, art review #11): real soft metal in 3D with the room's reflections at full strength (with
    // envMap null three uses the scene's low environmentIntensity); the paint keeps the matte twins it was tuned with
    for (const m of [K.mat('rgMatte'), K.mat('rgSolid')]) {
      if (look === '3d') Object.assign(m, { metalness: 0.7, roughness: 0.3, envMap: ctx.env || null, envMapIntensity: 1.0 });
      else Object.assign(m, { metalness: 0.22, roughness: 0.55, envMap: null, envMapIntensity: 0.8 });
    }
  }
  if (haloMesh) haloMesh.material.userData.wcGlowK = 0.3;   // the paint's share of its glow gain (main used to set it)
  setLook(look);

  // ≤ 2 PointLights: a warm key on the display and the café glow
  const keyLight = new THREE.PointLight('#FFC48A', 15, 5.2, 1.5);
  keyLight.position.set(0.35, 2.6, DC.z + 1.0); keyLight.name = 'displayKey';
  const cafeLight = new THREE.PointLight('#FFD2A0', 4.5, 5.5, 1.6);
  cafeLight.position.set(CAFE.x - 0.4, 2.2, CAFE.z); cafeLight.name = 'cafeWarm';
  keyLight.castShadow = false; cafeLight.castShadow = false;
  group.add(keyLight, cafeLight);

  // ===================================================================================== update: replay the hover lift on the merged products
  const { uAnim } = K.pickUniforms;
  function update() {
    const a = uAnim.value;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      a[2 * s.slot] = s.g.position.y - s.y0; a[2 * s.slot + 1] = s.g.scale.x / s.s0;
    }
  }
  update();

  // ===================================================================================== v4: LOD warm-up (no hitch on the walk)
  // The first time a LOD level is drawn, its vertex buffers (room near level ≈ 6.7 MB, shelf near ≈ 2.4 MB) and any
  // texture only it uses are uploaded — a frame-long stall in the middle of the walk. compile()/compileAsync() only
  // build programs, so main calls warmup() once during load: every level of every LOD is drawn once into a 1×1
  // viewport of the target the real frames use (null = the canvas for look=3d; the paint's scene target for
  // look=paint), with culling off, so buffers + textures are resident before the camera moves. Shadow map untouched.
  const lods = B.lods || [];
  const warmCam = new THREE.PerspectiveCamera(100, 1, 0.05, 40);
  warmCam.position.set(0, 1.6, -2.4); warmCam.lookAt(0, 1.2, -4.6); warmCam.updateMatrixWorld();
  function warmup(renderer, scene, opts = {}) {
    const target = opts.target || null, cam = opts.camera || warmCam;
    // look=3d draws both layers in one pass (the sign face, the photo and the cover copy too); the paint's scene pass
    // is layer 0 only (its pristine pass samples that target's depth, so it must not be drawn into it)
    if (!opts.camera) { warmCam.layers.set(0); if (!target) warmCam.layers.enable(1); }
    const levels = ['near', 'mid', 'far', 'xfar'];
    const culled = [];
    group.traverse((o) => { if (o.isMesh && o.frustumCulled) { culled.push(o); o.frustumCulled = false; } });
    const prevT = renderer.getRenderTarget(), sm = renderer.shadowMap, nu = sm.needsUpdate, au = sm.autoUpdate;
    sm.needsUpdate = false; sm.autoUpdate = false;
    const vp = new THREE.Vector4(), sc = new THREE.Vector4(); let st = false, tvp = null, tsc = null, tst = false;
    renderer.setRenderTarget(target);
    if (target) { tvp = target.viewport.clone(); tsc = target.scissor.clone(); tst = target.scissorTest; target.viewport.set(0, 0, 1, 1); target.scissor.set(0, 0, 1, 1); target.scissorTest = true; renderer.setRenderTarget(target); }
    else { renderer.getViewport(vp); renderer.getScissor(sc); st = renderer.getScissorTest(); renderer.setViewport(0, 0, 1, 1); renderer.setScissor(0, 0, 1, 1); renderer.setScissorTest(true); }
    let frames = 0;
    try {
      for (const lv of levels) {
        let any = false;
        for (const L of lods) { L.autoUpdate = false; for (const l of L.levels) { const on = l.object.name === lv; l.object.visible = on; any = any || on; } }
        if (!any) continue;
        renderer.render(scene, cam); frames++;
      }
    } finally {
      for (const L of lods) { L.autoUpdate = true; L.levels.forEach((l, i) => { l.object.visible = i === 0; }); }
      for (const o of culled) o.frustumCulled = true;
      if (target) { target.viewport.copy(tvp); target.scissor.copy(tsc); target.scissorTest = tst; }
      else { renderer.setViewport(vp); renderer.setScissor(sc); renderer.setScissorTest(st); }
      renderer.setRenderTarget(prevT); sm.needsUpdate = nu; sm.autoUpdate = au;
    }
    return frames;
  }

  group.userData.warmup = warmup; group.userData.setLook = (n) => setLook(n);   // also reachable from the scene graph (tests)

  const stats = { meshes: meshes.length, books: bookMeshes.reduce((a, m) => a + m.count, 0), halos: halos.length, pickables: pickables.length, pristine: pristineMeshes.length };
  group.userData.stats = stats; stats.tally = B.tally;

  // the framing points for main.js's shelf view: the display's rim, its top (book + ears) and the hook stand
  const shelfFit = [
    // v3: the base points sit at mid-base (y 0.42), so the frame crops through the fluted base like a product shot
    // (fix v3, review #1: the rim points at ±0.9 so the bottom tier clears the deckled edge; for the stand only the bag
    //  charms and the pouch count — the products — not its far arm and foot, which set the frame width before)
    V(DC.x - 0.9, 0.72, DC.z + 0.1), V(DC.x + 0.9, 0.72, DC.z + 0.1), V(DC.x, 0.42, DC.z + 0.6), V(DC.x - 0.45, 0.42, DC.z + 0.4), V(DC.x + 0.45, 0.42, DC.z + 0.4),
    V(DC.x - 0.8, 0.98, DC.z + 0.05), V(DC.x - 0.6, 1.3, DC.z + 0.3), V(DC.x + 0.6, 1.3, DC.z + 0.3),
    V(DC.x, 1.66, DC.z - 0.1), V(DC.x - 0.3, 1.56, DC.z + 0.1), V(DC.x + 0.3, 1.56, DC.z + 0.1),
  ];
  for (const b of charmBoxes) for (let i = 0; i < 8; i++) shelfFit.push(V(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z));

  return {
    group, update, pickables, lights: [keyLight, cafeLight], setLook, get look() { return look; }, warmup, lods,
    // v4: the room's light for the clean 3D look (main.js merges it over its ATMO.i for look=3d): less flat sky fill, the
    // baked lamp pools + the two point lights carry the room, a warm exposure
    atmo: { '3d': { i: { exposure: 1.0, hemi: 0.45, sun: 0.3, sky: '#FFD2A6', ground: '#D8B08A' } } },
    anchors: {
      shelfView: { pos: V(0.2, 1.62, -2.42), look: V(0.24, 1.0, -4.55) },
      cafeLook: V(CAFE.x - 0.3, 1.25, CAFE.z - 0.1),
      giftLook: V(-2.9, 1.35, -3.4),
      display: DC.clone(), displayRadius: TIERS[0][1], displayTop: TIERS[2][0], hookStand: HS.clone(), hookStandHeight: HS_H,
      shelfFit,
    },
  };
}

// v4 integrator: the builder as steps. main.js drives buildInteriorSteps and gives the browser a turn between steps
// (input, the poster) so no single load task is long; buildInterior runs the same steps in one go.
export function* buildInteriorSteps(THREE = THREE_NS, ctx = {}) { return yield* interiorSteps(THREE, ctx); }
export function buildInterior(THREE = THREE_NS, ctx = {}) {
  const it = interiorSteps(THREE, ctx);
  let r = it.next();
  while (!r.done) r = it.next();
  return r.value;
}
