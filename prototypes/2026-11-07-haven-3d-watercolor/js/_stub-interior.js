/* Haven 3D v2 — STUB interior (PREVIEW 06/11). Used with ?stub=int / ?stub=1 or when interior.js is missing or throws.
   CONTRACT-v2 geometry, kept simple: room x -3.95..3.95, z -7.3..-0.3, ceiling 3.8 (no front wall), honey floor, a
   jute round rug, blush wainscot, bookcases on the left, a half-round café counter on the right, the camera corridor
   x -0.6..0.6 kept clear, and the round 3-tier display at (0, 0, -4.6) (tiers y 0.78 / 1.06 / 1.32, r 0.80 / 0.56 / 0.32)
   holding the real-product looks from props.js (userData.pick = { id, name, kind }), plus the hook stand at about
   (1.15, 0, -4.35). The real Merlin photo is put on the pristine layer 1. Static pieces are merged per material. */

import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';

export function buildInterior(THREE, ctx) {
  const { T, P } = ctx;
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const group = new THREE.Group(); group.name = 'interior-stub';
  const std = (hex, o = {}) => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.9, ...o });
  const mat = {
    floor: std('#ffffff', { map: (() => { const t = T.wood('#D7B28A').clone(); t.repeat.set(6, 5); t.needsUpdate = true; return t; })() }),
    wall: P.mat('plaster'), ceil: std('#FBF3E8'), blush: P.mat('blush'), ivory: P.mat('ivory'), wood: P.mat('wood'),
    honey: std('#D9B48A'), rug: std('#D9C2A0', { map: T.weave(), roughness: 1 }), rose: P.mat('roseGold'), white: std('#F8F2E9'),
  };
  /* static merge per material */
  const buckets = new Map(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  function put(geo, m, x = 0, y = 0, z = 0, ry = 0) {
    const g = (geo.index ? geo.toNonIndexed() : geo.clone());
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    q.setFromEuler(e.set(0, ry, 0)); m4.compose(V(x, y, z), q, V(1, 1, 1)); g.applyMatrix4(m4);
    if (!buckets.has(m)) buckets.set(m, []); buckets.get(m).push(g);
  }
  const box = (w, h, d) => P.rboxGeo(w, h, d, Math.min(0.02, w / 3, h / 3, d / 3), 1);
  const cyl = (a, b, h, s = 20) => new THREE.CylinderGeometry(a, b, h, s);

  /* ---- room shell ---- */
  const X = 3.95, Z0 = -0.3, Z1 = -7.3, HC = 3.8, D = Z0 - Z1;
  put(new THREE.PlaneGeometry(2 * X, D).rotateX(-Math.PI / 2), mat.floor, 0, 0.001, (Z0 + Z1) / 2);
  put(new THREE.PlaneGeometry(2 * X, D).rotateX(Math.PI / 2), mat.ceil, 0, HC, (Z0 + Z1) / 2);
  put(new THREE.PlaneGeometry(D, HC).rotateY(Math.PI / 2), mat.wall, -X, HC / 2, (Z0 + Z1) / 2);
  put(new THREE.PlaneGeometry(D, HC).rotateY(-Math.PI / 2), mat.wall, X, HC / 2, (Z0 + Z1) / 2);
  put(new THREE.PlaneGeometry(2 * X, HC), mat.wall, 0, HC / 2, Z1);
  /* blush wainscot + ivory rail on the three walls */
  put(box(2 * X, 0.95, 0.04), mat.blush, 0, 0.475, Z1 + 0.02);
  for (const sx of [-1, 1]) put(box(0.04, 0.95, D), mat.blush, sx * (X - 0.02), 0.475, (Z0 + Z1) / 2);
  put(box(2 * X, 0.05, 0.07), mat.ivory, 0, 0.97, Z1 + 0.04);
  /* back wall: two arched niches (pale) with shelves */
  for (const sx of [-1, 1]) {
    put(box(1.3, 2.1, 0.06), mat.white, sx * 1.7, 2.0, Z1 + 0.04);
    put(cyl(0.65, 0.65, 0.06, 24).rotateX(Math.PI / 2), mat.white, sx * 1.7, 3.05, Z1 + 0.04);
    for (const y of [1.45, 2.05, 2.65]) put(box(1.2, 0.04, 0.3), mat.wood, sx * 1.7, y, Z1 + 0.18);
  }
  /* left wall: honey bookcases */
  for (const z of [-1.6, -3.0, -4.4, -5.8]) {
    put(box(0.42, 2.6, 1.3), mat.honey, -X + 0.22, 1.3, z);
    for (const y of [0.85, 1.75]) {
      const row = P.bookRow(9, 1.15, { h: 0.26, d: 0.18, seed: Math.round(z * 10 + y * 7) });
      row.rotation.y = Math.PI / 2; row.position.set(-X + 0.3, y, z); group.add(row);
    }
  }
  /* right: half-round café counter with cubbies, a cake dome and cups */
  const counter = new THREE.Group();
  const cg = cyl(1.0, 1.0, 1.0, 24, 1); cg.rotateY(Math.PI);
  const c = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 1.0, 24, 1, false, Math.PI, Math.PI), mat.white); c.position.y = 0.5; counter.add(c);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.06, 0.05, 24, 1, false, Math.PI, Math.PI), mat.honey); top.position.y = 1.02; counter.add(top);
  const dome = P.pastryDome(); dome.position.set(-0.3, 1.045, -0.45); counter.add(dome);
  const cup = P.cup(); cup.position.set(0.15, 1.045, -0.7); counter.add(cup);
  counter.position.set(X - 0.05, 0, -2.6); counter.rotation.y = -Math.PI / 2; group.add(counter);
  /* rug under the display */
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.45, 40).rotateX(-Math.PI / 2), mat.rug); rug.position.set(0, 0.004, -4.6); group.add(rug);

  /* ---- the round 3-tier display ---- */
  const DC = V(0, 0, -4.6);
  const tiers = [[0.78, 0.8], [1.06, 0.56], [1.32, 0.32]];
  put(cyl(0.5, 0.58, 0.7, 20), mat.honey, DC.x, 0.35, DC.z);                     /* fluted base (plain stand-in) */
  let yPrev = 0.7;
  for (const [y, r] of tiers) {
    put(cyl(r, r, 0.05, 28), mat.honey, DC.x, y - 0.025, DC.z);
    put(new THREE.TorusGeometry(r, 0.012, 6, 40).rotateX(Math.PI / 2), mat.rose, DC.x, y - 0.012, DC.z);
    if (y > 0.8) put(cyl(r * 0.85, r * 0.9, y - yPrev - 0.05, 20), mat.honey, DC.x, (y + yPrev) / 2 - 0.025, DC.z);
    yPrev = y;
  }
  /* products: front arc first */
  const pickables = [];
  function pick(id, x, y, z, ry = 0, kind = null) {
    const o = P.product(id); o.position.set(x, y, z); o.rotation.y = ry;
    const name = (P.PRODUCTS && P.PRODUCTS[id] && P.PRODUCTS[id][0]) || id;
    o.userData.pick = { id, name, kind: kind || (P.PRODUCTS && P.PRODUCTS[id] && P.PRODUCTS[id][1]) || 'product' };
    group.add(o); pickables.push(o); return o;
  }
  const arc = (r, y, ids, a0, a1) => ids.forEach((id, i) => {
    const a = ids.length === 1 ? (a0 + a1) / 2 : a0 + (a1 - a0) * i / (ids.length - 1);
    pick(id, DC.x + Math.sin(a) * r, y, DC.z + Math.cos(a) * r, a);
  });
  pick('open-book', DC.x, 1.32, DC.z + 0.06, 0, 'book');
  pick('tuxedo-cat', DC.x - 0.2, 1.32, DC.z + 0.1, 0.35);
  const merlin = pick('merlin', DC.x + 0.21, 1.32, DC.z + 0.09, -0.35, 'merlin');
  merlin.traverse((o) => { if (o.isMesh && o.material && o.material.map && o.material.map.source === T.merlinPhoto().source) o.layers.set(1); });
  arc(0.46, 1.06, ['george-washington-doll', 'anne-shirley-set', 'bennet-darcy-set', 'dashwood-ferrars-set'], -0.95, 0.95);
  arc(0.68, 0.78, ['maine-coon-cat', 'ginger-tabby-cat', 'calico-crochet-cat', 'siamese-cat', 'white-cat', 'british-shorthair-cat', 'knitted-sheep', 'knitted-daisy-duck', 'crochet-animal-friends-set'], -1.25, 1.25);
  /* the hook stand with the fabric dolls on backpacks, the pouch and keychains */
  const HS = V(1.15, 0, -4.35), hh = 1.4;
  put(cyl(0.018, 0.018, hh, 8), mat.rose, HS.x, hh / 2, HS.z);
  put(cyl(0.2, 0.22, 0.03, 16), mat.rose, HS.x, 0.015, HS.z);
  put(cyl(0.012, 0.012, 0.5, 6).rotateZ(Math.PI / 2), mat.rose, HS.x, hh - 0.05, HS.z);
  pick('linen-pocket-doll', HS.x - 0.18, hh - 0.42, HS.z + 0.03, -0.3);
  pick('americana-doll-bag-charm', HS.x + 0.18, hh - 0.42, HS.z + 0.03, -0.3);
  pick('quilted-cat-pouch', HS.x, 0.6, HS.z + 0.05, -0.3);
  for (const dx of [-0.08, 0.08]) { const k = P.keychain({}); k.position.set(HS.x + dx, hh - 0.06, HS.z); group.add(k); }

  for (const [m, list] of buckets) { const mesh = new THREE.Mesh(mergeGeometries(list, false), m); mesh.receiveShadow = true; group.add(mesh); }
  /* soft contact shadows under the display and the stand */
  const s1 = P.softShadow(2.0, 2.0, 0.35); s1.position.set(DC.x, 0.006, DC.z); group.add(s1);

  /* ---- warm interior lights (2) ---- */
  const l1 = new THREE.PointLight('#FFD2A8', 5, 0, 2); l1.position.set(0, 3.2, -3.6);
  const l2 = new THREE.PointLight('#FFD8B0', 3.5, 0, 2); l2.position.set(2.6, 3.0, -2.4);
  group.add(l1, l2);
  const lamp = P.pendantLamp({}); lamp.position.set(0, 2.9, -4.6); group.add(lamp);

  return {
    group, update() {}, pickables, lights: [l1, l2],
    anchors: {
      shelfView: { pos: V(0.22, 1.52, -2.5), look: V(0.24, 0.98, -4.55) },
      cafeLook: V(2.9, 1.3, -2.6), giftLook: V(-2.9, 1.4, -3.4),
      display: DC.clone(), displayRadius: 0.8, displayTop: 1.32, hookStand: HS.clone(), hookStandHeight: hh,
    },
  };
}
