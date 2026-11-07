/* Haven 3D — STUB exterior (PREVIEW 06/11). Used with ?stub=ext / ?stub=1 or when exterior.js is missing.
   Follows the contract geometry so the camera and UI can be tested: facade z 0..-0.35 with the door hole
   x -0.9..0.9 / y 0..2.8 (the tunnel z -0.6..0.6 stays empty), open bay and café openings, door leaves swung inward,
   the sign plane (T.signFace, unlit) at y 3.55 / z 0.06, a mansard roof (ridge 11.4), 5 floor-2 windows, garden.
   Static pieces are merged per material. No words, no tuxedo cat (the cat at the door is a brown tabby). */

import { RoundedBoxGeometry } from '../vendor/RoundedBoxGeometry.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';

export function buildExterior(THREE, ctx) {
  const { T, P } = ctx;
  const group = new THREE.Group(); group.name = 'exterior-stub';
  const local = new Map();
  const std = (hex, o = {}) => { const k = hex + JSON.stringify(o); if (!local.has(k)) local.set(k, new THREE.MeshStandardMaterial({ color: hex, roughness: 0.88, ...o })); return local.get(k); };
  const M = (name, hex) => { try { const m = P && P.mat && P.mat(name); if (m) return m; } catch (e) { /* stub */ } return std(hex); };
  const mat = {
    wall: std('#F2E5D2'), trim: M('ivory', '#FFFBF4'), oat: M('oat', '#E9DCCB'), blush: M('blush', '#EFC5B9'),
    rose: M('roseGold', '#C9937E'), sage: M('sage', '#A9BCA0'), sageD: M('sageDark', '#7F9A7A'), sageL: M('sageLight', '#C5D3B8'),
    plaster: M('plaster', '#F4EBDD'), glass: M('glass', '#FFF4E6'), glow: M('glowWarm', '#FFE7C9'),
    roof: std('#AD968B', { flatShading: true }), roof2: std('#9C8A80', { flatShading: true }), stone: std('#E5DACB'),
    lawn: std('#BCCBA5', { roughness: 1 }), path: std('#E4D6C2', { roughness: 1 }), cocoa: M('cocoa', '#5A4636'),
    tabby: std('#9C7454'), tabbyL: std('#C9A27E'), golden: std('#E2C08F'), skin: std('#E9C6A8'), coatA: std('#B9A6C6'),
    coatB: std('#C98F7A'), terracotta: std('#C98B6E'), far: std('#B7C0A8', { roughness: 1 }), farRoof: std('#C7B2A6', { roughness: 1 }),
  };

  /* ---- batching: static pieces merged per material ---- */
  const buckets = new Map(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s3 = new THREE.Vector3();
  function put(geo, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    let g = geo.index ? geo.toNonIndexed() : geo.clone();
    q.setFromEuler(e.set(rx, ry, rz)); m4.compose(new THREE.Vector3(x, y, z), q, s3.set(sx, sy, sz)); g.applyMatrix4(m4);
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    if (!buckets.has(m)) buckets.set(m, []); buckets.get(m).push(g);
  }
  const rb = (w, h, d, r = 0.05) => new RoundedBoxGeometry(w, h, d, 2, Math.max(0.001, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)));
  const bx = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const sph = (r, ws = 16, hs = 12) => new THREE.SphereGeometry(r, ws, hs);
  const cyl = (rt, rbm, h, seg = 16) => new THREE.CylinderGeometry(rt, rbm, h, seg);

  /* ---- ground ---- */
  const lawn = new THREE.Mesh(new THREE.CircleGeometry(90, 48).rotateX(-Math.PI / 2), mat.lawn); lawn.receiveShadow = true; group.add(lawn);
  put(new THREE.PlaneGeometry(16.4, 4.4).rotateX(-Math.PI / 2), mat.path, 0, 0.004, 2.2);
  put(new THREE.PlaneGeometry(2.6, 16).rotateX(-Math.PI / 2), mat.path, 0, 0.005, 12);

  /* ---- facade: ground floor pieces around the door, bay and café openings (inner face = plaster) ---- */
  const wallMats = [mat.wall, mat.wall, mat.wall, mat.wall, mat.wall, mat.plaster];
  const pieces = [[-8, -6.4, 0, 4.4], [-6.4, -1.8, 0, 0.75], [-6.4, -1.8, 3.1, 4.4], [-1.8, -0.9, 0, 4.4], [-0.9, 0.9, 2.8, 4.4],
    [0.9, 1.8, 0, 4.4], [1.8, 6.4, 0, 1.05], [1.8, 6.4, 3.1, 4.4], [6.4, 8, 0, 4.4], [-8, 8, 4.4, 7.6]];
  for (const [x0, x1, y0, y1] of pieces) {
    const w = new THREE.Mesh(bx(x1 - x0, y1 - y0, 0.35), wallMats);
    w.position.set((x0 + x1) / 2, (y0 + y1) / 2, -0.175); w.castShadow = w.receiveShadow = true; group.add(w);
  }
  put(bx(0.35, 7.6, 13.65), mat.wall, -7.825, 3.8, -7.175); put(bx(0.35, 7.6, 13.65), mat.wall, 7.825, 3.8, -7.175);
  put(bx(16, 7.6, 0.35), mat.wall, 0, 3.8, -13.825);
  /* quoins, cornice, plinth */
  for (const sx of [-1, 1]) for (let y = 0.3; y < 7.6; y += 0.62) put(rb(0.62, 0.5, 0.12, 0.03), mat.stone, sx * 7.72, y, 0.06);
  put(rb(16.5, 0.24, 0.24, 0.06), mat.trim, 0, 4.46, 0.08);
  put(rb(16.9, 0.32, 0.5, 0.08), mat.trim, 0, 7.66, 0.12);
  for (const [x0, x1] of [[-8, -6.6], [-1.6, -0.9], [0.9, 8]]) put(rb(x1 - x0, 0.42, 0.1, 0.03), mat.stone, (x0 + x1) / 2, 0.21, 0.03);

  /* ---- door: ivory frame, transom glow, leaves open inward along the inner wall ---- */
  put(rb(2.2, 0.24, 0.16, 0.04), mat.trim, 0, 2.92, 0.05);
  for (const sx of [-1, 1]) put(rb(0.14, 2.8, 0.16, 0.03), mat.trim, sx * 0.97, 1.4, 0.05);
  for (const sx of [-1, 1]) {
    put(rb(1.0, 2.76, 0.06, 0.02), mat.blush, sx * 1.4, 1.39, -0.45);
    put(sph(0.035, 10, 8), mat.rose, sx * 1.82, 1.15, -0.4);
  }

  /* ---- the sign: rose frame + unlit ivory face with the real logo (T.signFace) ---- */
  const SW = 3.3, SH = 1.1;
  put(rb(SW + 0.14, SH + 0.14, 0.08, 0.05), mat.rose, 0, 3.55, 0.02);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ map: T.signFace(), toneMapped: false }));
  face.position.set(0, 3.55, 0.065); face.name = 'signFace'; group.add(face);
  for (const sx of [-1, 1]) { put(cyl(0.025, 0.025, 0.32, 8), mat.rose, sx * 1.95, 4.12, 0.18, Math.PI / 2); put(sph(0.08, 12, 10), mat.glow, sx * 1.95, 4.05, 0.34); }

  /* ---- bay shopfront (left) ---- */
  put(rb(5.0, 0.75, 0.92, 0.06), mat.oat, -4.1, 0.375, 0.44);
  put(rb(5.16, 0.24, 1.04, 0.06), mat.trim, -4.1, 3.2, 0.46);
  put(rb(5.0, 0.06, 0.86, 0.02), mat.trim, -4.1, 0.78, 0.45);
  for (const x of [-6.55, -4.85, -3.35, -1.65]) put(rb(0.08, 2.36, 0.08, 0.02), mat.trim, x, 1.93, 0.88);
  put(rb(4.96, 0.07, 0.07, 0.02), mat.trim, -4.1, 2.62, 0.88);
  const glassF = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 2.34), mat.glass); glassF.position.set(-4.1, 1.93, 0.9); group.add(glassF);
  for (const x of [-6.6, -1.6]) { const gs = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2.34), mat.glass); gs.position.set(x, 1.93, 0.45); gs.rotation.y = Math.PI / 2; group.add(gs); }
  const pal = [mat.blush, mat.sage, mat.oat, mat.rose, mat.sageL];
  for (let i = 0; i < 9; i++) put(rb(0.32, 0.22 + (i % 3) * 0.07, 0.24, 0.03), pal[i % pal.length], -6.1 + i * 0.52, 0.81 + (0.11 + (i % 3) * 0.035), 0.42);
  for (const [x, c] of [[-5.3, mat.tabbyL], [-3.9, mat.blush], [-2.6, mat.oat]]) { put(sph(0.13, 14, 10), c, x, 1.2, 0.5); put(sph(0.09, 14, 10), c, x, 1.4, 0.52); }

  /* ---- café window counter (right) + scalloped awning ---- */
  put(rb(4.8, 0.09, 0.5, 0.03), mat.oat, 4.1, 1.07, 0.18);
  for (const x of [1.82, 6.38]) put(rb(0.12, 2.08, 0.14, 0.03), mat.trim, x, 2.08, 0.04);
  const aw = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 1.05), new THREE.MeshStandardMaterial({ map: T.awning(), roughness: 0.9, side: THREE.DoubleSide }));
  aw.position.set(4.1, 3.3, 0.42); aw.rotation.x = -0.95; aw.castShadow = true; group.add(aw);
  for (let i = 0; i < 10; i++) put(new THREE.CircleGeometry(0.25, 12, Math.PI, Math.PI), i % 2 ? mat.blush : mat.trim, 1.85 + i * 0.5, 2.98, 0.86, 0, 0, 0);
  for (const x of [2.4, 4.1, 5.8]) { put(rb(0.26, 0.22, 0.26, 0.05), mat.terracotta, x, 1.22, 0.2); put(sph(0.2, 12, 10), mat.sage, x, 1.5, 0.2); }

  /* ---- floor 2: 5 sash windows with shutters, sills and flower boxes; centre arched with a small balcony ---- */
  const winX = [-5.6, -3.2, 0, 3.2, 5.6];
  for (const x of winX) {
    const arched = x === 0;
    put(rb(1.32, 1.98, 0.14, 0.05), mat.trim, x, 5.95, 0.05);
    put(new THREE.PlaneGeometry(1.06, 1.72), mat.glow, x, 5.95, 0.125);
    put(rb(0.05, 1.72, 0.04, 0.01), mat.trim, x, 5.95, 0.14); put(rb(1.06, 0.05, 0.04, 0.01), mat.trim, x, 6.2, 0.14);
    if (arched) { put(new THREE.CircleGeometry(0.66, 20, 0, Math.PI), mat.trim, x, 6.94, 0.12); put(new THREE.CircleGeometry(0.53, 20, 0, Math.PI), mat.glow, x, 6.94, 0.13); }
    else for (const sx of [-1, 1]) put(rb(0.52, 1.9, 0.06, 0.02), mat.blush, x + sx * 0.96, 5.95, 0.06);
    put(rb(1.56, 0.1, 0.3, 0.03), mat.oat, x, 4.92, 0.15);
    if (arched) { put(rb(1.9, 0.08, 0.55, 0.02), mat.rose, x, 4.95, 0.28); put(rb(1.9, 0.05, 0.05, 0.02), mat.rose, x, 5.55, 0.55); }
    else { put(rb(1.3, 0.24, 0.3, 0.05), mat.sageD, x, 4.76, 0.22); for (let k = 0; k < 5; k++) put(sph(0.075, 10, 8), k % 2 ? mat.blush : mat.trim, x - 0.5 + k * 0.25, 4.93, 0.3); }
  }

  /* ---- mansard roof (lower steep slope, upper hip, ridge 11.4), dormers, chimneys ---- */
  const lower = cyl(Math.SQRT2 * 0.855, Math.SQRT2, 2.5, 4); lower.rotateY(Math.PI / 4);
  put(lower, mat.roof, 0, 7.8 + 1.25, -7, 0, 0, 0, 8.35, 1, 7.4);
  const upper = cyl(Math.SQRT2 * 0.06, Math.SQRT2, 1.1, 4); upper.rotateY(Math.PI / 4);
  put(upper, mat.roof2, 0, 10.3 + 0.55, -7, 0, 0, 0, 8.35 * 0.855, 1, 7.4 * 0.855);
  for (const x of [-4.4, 0, 4.4]) {
    put(rb(1.3, 1.35, 1.4, 0.06), mat.trim, x, 8.75, -0.35);
    put(new THREE.PlaneGeometry(0.8, 0.9), mat.glow, x, 8.7, 0.36);
    const cap = cyl(0.05, 0.95, 0.55, 4); cap.rotateY(Math.PI / 4);
    put(cap, mat.roof2, x, 9.7, -0.35, 0, 0, 0, 0.78, 1, 1.0);
  }
  for (const x of [-5.2, 5.2]) { put(rb(0.9, 2.6, 0.7, 0.05), mat.oat, x, 10.6, -9.5); put(rb(1.02, 0.18, 0.82, 0.04), mat.trim, x, 11.95, -9.5); }

  /* ---- door step: dog bowl, the Maine Coon (brown tabby, ear tufts, ruff) ---- */
  put(cyl(0.16, 0.13, 0.07, 16), mat.rose, 1.25, 0.035, 0.45);
  const cat = new THREE.Group(); cat.position.set(-1.25, 0, 0.55); cat.rotation.y = 0.25;
  const body = new THREE.Mesh(sph(0.2, 16, 12), mat.tabby); body.scale.set(1, 1.15, 0.95); body.position.y = 0.22; cat.add(body);
  const ruff = new THREE.Mesh(sph(0.15, 16, 12), mat.tabbyL); ruff.position.set(0, 0.36, 0.1); cat.add(ruff);
  const head = new THREE.Group(); head.position.set(0, 0.5, 0.06); cat.add(head);
  head.add(new THREE.Mesh(sph(0.13, 16, 12), mat.tabby));
  for (const sx of [-1, 1]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.13, 8), mat.tabby); ear.position.set(sx * 0.07, 0.12, 0); ear.rotation.z = -sx * 0.25; head.add(ear); }
  const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.34, 4, 8), mat.tabby); tail.position.set(0.18, 0.1, -0.12); tail.rotation.set(0.3, 0, 1.2); cat.add(tail);
  const paw = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.12, 4, 8), mat.tabbyL); paw.position.set(-0.06, 0.34, 0.18); cat.add(paw);
  cat.traverse((o) => { if (o.isMesh) o.castShadow = true; }); group.add(cat);

  /* ---- café table: two guests with cups, a golden dog lying underneath ---- */
  const tx = 4.5, tz = 2.6;
  put(cyl(0.38, 0.38, 0.04, 20), mat.trim, tx, 0.74, tz); put(cyl(0.03, 0.03, 0.72, 8), mat.rose, tx, 0.37, tz); put(cyl(0.2, 0.22, 0.03, 16), mat.rose, tx, 0.015, tz);
  for (const [dx, c] of [[-0.7, mat.coatA], [0.7, mat.coatB]]) {
    put(rb(0.42, 0.06, 0.42, 0.02), mat.rose, tx + dx, 0.46, tz); put(cyl(0.02, 0.02, 0.46, 6), mat.rose, tx + dx, 0.23, tz);
    put(new THREE.CapsuleGeometry(0.19, 0.42, 4, 12), c, tx + dx * 0.95, 0.88, tz);
    put(sph(0.14, 16, 12), mat.skin, tx + dx * 0.92, 1.38, tz);
    put(cyl(0.035, 0.03, 0.08, 10), mat.trim, tx + dx * 0.35, 0.8, tz + 0.05);
  }
  put(sph(0.22, 14, 10), mat.golden, tx, 0.14, tz + 0.15, 0, 0.3, 0, 1.6, 0.6, 0.9);
  put(sph(0.11, 14, 10), mat.golden, tx + 0.36, 0.14, tz + 0.3);

  /* ---- garden: hedges, flower dots, trees, a street lamp, distant tree line ---- */
  for (const [x0, x1] of [[-8.4, -1.7], [1.7, 8.4]]) put(rb(x1 - x0, 0.6, 0.7, 0.28), mat.sageD, (x0 + x1) / 2, 0.3, 5.3);
  for (let i = 0; i < 26; i++) { const x = (i < 13 ? -8 + i * 0.5 : 2 + (i - 13) * 0.5); put(sph(0.08, 8, 6), i % 3 ? mat.blush : mat.trim, x, 0.62, 5.15 + (i % 2) * 0.2); }
  for (const [x, z, s] of [[-11, 2.2, 1.1], [11.5, 1.2, 1.25], [-12.5, -6, 1.4], [12.5, -8, 1.2]]) {
    put(cyl(0.16 * s, 0.22 * s, 2.4 * s, 10), mat.cocoa, x, 1.2 * s, z);
    put(sph(1.5 * s, 16, 12), mat.sage, x, 3.1 * s, z); put(sph(1.05 * s, 16, 12), mat.sageD, x + 0.7 * s, 2.6 * s, z + 0.5 * s); put(sph(0.95 * s, 16, 12), mat.sageL, x - 0.6 * s, 3.7 * s, z - 0.2);
  }
  put(cyl(0.05, 0.07, 3.2, 10), mat.rose, -2.4, 1.6, 5.0); put(sph(0.17, 14, 10), mat.glow, -2.4, 3.3, 5.0); put(cyl(0.2, 0.02, 0.14, 10), mat.rose, -2.4, 3.5, 5.0);
  for (let i = 0; i < 22; i++) {
    const x = -66 + i * 6.3 + ((i * 17) % 5), z = -38 - ((i * 13) % 9), r = 3.4 + ((i * 7) % 4);
    put(sph(r, 14, 10), i % 3 ? mat.far : mat.sageL, x, r * 0.55, z, 0, 0, 0, 1, 0.8, 1);
  }
  for (let i = 0; i < 6; i++) put(rb(5, 4 + (i % 3), 4, 0.3), mat.farRoof, -40 + i * 16, 2, -30 - (i % 2) * 4);

  /* ---- merge buckets ---- */
  for (const [m, list] of buckets) {
    const merged = mergeGeometries(list, false);
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, m); mesh.castShadow = mesh.receiveShadow = true; group.add(mesh);
    for (const g of list) g.dispose();
  }
  /* fake contact shadows */
  if (P && P.softShadow) {
    for (const [x, z, w, d] of [[-1.25, 0.6, 0.8, 0.7], [tx, tz, 2.6, 1.3], [1.25, 0.45, 0.45, 0.45]]) { const s = P.softShadow(w, d, 0.45); s.position.x = x; s.position.z = z; group.add(s); }
  }

  return {
    group,
    update(t) { paw.position.y = 0.34 + Math.sin(t * 1.8) * 0.03; head.rotation.x = 0.25 + Math.sin(t * 1.8) * 0.08; tail.rotation.y = Math.sin(t * 0.7) * 0.25; },
    anchors: { signCenter: new THREE.Vector3(0, 3.55, 0.065), door: new THREE.Vector3(0, 1.4, 0), signWidth: SW },
    lights: [],
  };
}
