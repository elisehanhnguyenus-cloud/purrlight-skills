/* Haven 3D v2 — EXTERIOR (PREVIEW 06/11, Purrlight Studio): "Merlin's Purrfect Haven", a small storybook cottage-shop
   at golden hour, built to be painted by the watercolour pass (big soft colour blocks, matte, a few deliberate details).
   8.4 m wide: cream limewash walls with a couple of flaked-plaster brick patches, a steep rose-taupe scalloped-slate roof
   sweeping low, three wall dormers (Merlin's workroom left, a French door with a tiny balcony centre, the pet-sitting
   corner right) with blush heart shutters and flower boxes, a chimney, and a sage-painted English shopfront: pilasters,
   fascia with the ivory logo sign (T.signFace, unlit, own mesh on the pristine layer 1), the always-open double door with
   a eucalyptus garland, the cosy display window (left) and the French café window with a striped scalloped awning
   (right). Outside: the bistro table with two guests and the golden dog, the Maine Coon licking its paw, the dog bowl,
   a bench, a pictogram chalkboard, a lantern, pots, vines, a cobbled street, two rounded trees, a street lamp and soft
   neighbouring cottages. No words anywhere except the real logo on the sign face. */

import { makeExtKit } from './exterior-kit.js';

export function buildExterior(THREE, ctx) {
  const { T, P } = ctx;
  const X = makeExtKit(THREE, P, T);
  const PI = Math.PI, TAU = PI * 2;
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const rnd = X.rng(20261106);

  const group = new THREE.Group(); group.name = 'exterior';
  const MM = X.matteMaterials();
  const decals = new X.Decals(T.softShadow(), '#4A3226', 'ext:shadows');
  const batch = new X.Batch(decals, MM.remap);
  const KH = new P.Kit(1), KG = new P.Kit(1), KR = new P.Kit(1), KS = new P.Kit(1);   // vertex-coloured parts: house, garden, roof, small details (no sun shadow)
  const small = (on) => { K = on ? KS : KH; batch.defaultTag = on ? 'small' : ''; };
  let K = KH;
  const leafMat = P.mat('leafInst');
  const leavesH = new X.Scatter(X.leafGeo(), leafMat, 'ext:leaves'), leavesG = new X.Scatter(X.leafGeo(), leafMat, 'ext:leaves:garden');
  let leaves = leavesH;
  const blooms = new X.Scatter(X.blossomGeo(), leafMat, 'ext:blossoms');

  /* ------------------------------------------------------------------ palette + materials */
  const C = {
    cream: '#FBF6EE', ivory: '#FFFBF4', trim: '#FBF3E6', oat: '#E9DCCB', blush: '#EFC5B9', shutter: '#E9B4A6', rose: '#C9937E',
    sage: '#94AE93', sageD: '#76917A', sageL: '#C5D3B8', fascia: '#829E85', ink: '#4F4640', cocoa: '#5A4636', peach: '#E8A87C',
    honey: '#D9B78C', honeyD: '#BF9A70', stoneD: '#D8CAB8', soil: '#7A6152', bark: '#8E7666', terra: '#C98B70',
    lantern: '#58504A', chimney: '#D6A898',
  };
  /* shopfront joinery palette. Default: the sage of the reference shopfronts. ?palette=be (owner's earlier choice):
     oat-beige joinery, fascia, door and window frames with blush accents and rose-gold hardware. Colours only; the
     geometry is identical (vertex colours are chosen here, before anything is built). */
  const PALETTE = (() => { try { return (ctx.palette || new URLSearchParams(location.search).get('palette') || 'sage').toLowerCase(); } catch (e) { return 'sage'; } })();
  const J = PALETTE === 'be'
    ? { body: '#D9BE9C', deep: '#C6A282', inset: '#EFC6B8', fascia: '#C9A784', lantern: '#B98572', box: '#E9BBAE', name: 'be' }
    : { body: C.sage, deep: C.sageD, inset: '#A6BCA3', fascia: C.fascia, lantern: C.lantern, box: C.sage, name: 'sage' };
  const std = (o, name) => { const m = new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.95, metalness: 0 }, o)); m.name = name; return m; };
  const derive = (name, o) => { const m = P.mat(name).clone(); Object.assign(m, o); if (o.color) m.color = new THREE.Color(o.color); m.name = o.name || name + '+'; return m; };
  const M = {
    wall: std({ map: X.TEX.wash() }, 'wash'),
    plaster: P.mat('plaster'),
    slate: derive('slate', { color: '#EBD3CB', name: 'slate-ext', roughness: 0.95 }),
    grass: derive('grass', { color: '#E9EBD6', name: 'grass-ext' }),
    lane: derive('cobbles', { color: '#D9C6B5', name: 'cobbles-lane', roughness: 1 }),
    cobbles: derive('cobbles', { color: '#F6E8D8', name: 'cobbles-ext', roughness: 1 }),
    flags: std({ map: X.TEX.flags(), color: '#E4D5C2' }, 'flags'),
    glassSoft: Object.assign(P.mat('glass').clone(), { opacity: 0.07, envMapIntensity: 0.35, name: 'glassSoft' }),
    awning: P.mat('awning'),
    glass: P.mat('glass'),
    pane: std({ color: '#F7DDBF', emissive: '#EFA56E', emissiveIntensity: 0.9, roughness: 1 }, 'pane-amber'),
    gingham: std({ map: X.TEX.gingham('#E39A90'), roughness: 1 }, 'gingham'),
    chalk: std({ map: X.TEX.chalk(), roughness: 1 }, 'chalk'),
    covers: std({ map: X.TEX.covers(), roughness: 0.9 }, 'covers'),
    icons: std({ map: X.TEX.icons(), transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1 }, 'icons'),
    bricks: std({ map: X.TEX.bricks(), transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }, 'bricks'),
    clay: P.mat('clay'),
  };
  const roomMat = new THREE.MeshBasicMaterial({ color: '#D9A27E', map: T.wallpaper() }); roomMat.name = 'diorama-room';
  const haloMat = new THREE.MeshBasicMaterial({ map: T.glow(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true, toneMapped: false, fog: false });
  haloMat.name = 'halo';
  const halos = new X.Decals(T.glow(), '#ffffff', 'ext:halos'); halos.mat = haloMat;

  /* ------------------------------------------------------------------ small helpers */
  const rb = (w, h, d, r = 0.03) => X.bevelBox(w, h, d, r);
  const boxG = new THREE.BoxGeometry(1, 1, 1);
  const cyl = (seg = 12) => new THREE.CylinderGeometry(1, 1, 1, seg);
  const sph = (ws = 12, hs = 8) => new THREE.SphereGeometry(1, ws, hs);
  const clay = (geo, p, c, o = {}) => K.add(o.key || 'clay', geo, Object.assign({ p, c }, o));
  /* a bevelled box between two corners */
  const blk = (x0, x1, y0, y1, z0, z1, c, o = {}) => clay(rb(x1 - x0, y1 - y0, z1 - z0, o.rad === undefined ? Math.min(0.03, (x1 - x0) / 3, (y1 - y0) / 3, (z1 - z0) / 3) : o.rad), [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], c, o);
  const put = (obj, x, y, z, ry = 0, s = 1) => { obj.position.set(x, y, z); obj.rotation.y = ry; if (s !== 1) obj.scale.setScalar(s); return obj; };
  const addProp = (obj, x, y, z, ry = 0, s = 1, o) => { const tmp = new THREE.Group(); tmp.add(put(obj, x, y, z, ry, s)); batch.obj(tmp, o); };
  const halo = (x, y, z, w, h, k = 1, col = [1, 0.84, 0.64]) => halos.quad(X.mat4([x, y, z], [PI / 2, 0, 0], [w, 1, h]), 1, [col[0] * k, col[1] * k, col[2] * k]);
  const pool = (x, z, w, d, k = 1, ry = 0) => halos.quad(X.mat4([x, 0.008, z], [0, ry, 0], [w, 1, d]), 1, [0.55 * k, 0.36 * k, 0.2 * k]);
  function bar(a, b, t, c, o = {}) {
    const d = V3(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const L = d.length();
    const q = new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), d.normalize());
    K.add(o.key || 'clay', boxG, { p: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], q, s: [t, L, o.d || t], c });
  }
  const rod = (a, b, r0, r1, c, key = 'clay', seg = 6) => {
    const d = V3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), L = d.length();
    K.add(key, new THREE.CylinderGeometry(r1, r0, L, seg, 1, true), { p: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], q: new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), d.normalize()), c });
  };
  function tube(points, r, c, o = {}) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => V3(p[0], p[1], p[2])), !!o.closed, 'centripetal');
    const g = new THREE.TubeGeometry(curve, o.seg || Math.max(6, Math.round(curve.getLength() * 8)), r, o.radial || 6, !!o.closed);
    X.paintGeo(g, c, { ao: o.ao || 0 });
    batch.push(o.mat ? (typeof o.mat === 'string' ? P.mat(o.mat) : o.mat) : M.clay, g, { cast: o.cast !== false });
    return curve;
  }
  const worldGeo = (g, mat, tile, o) => { X.worldUV(g, tile, tile, o && o.off); batch.push(mat, g, o); return g; };
  const boxAt = (x0, x1, y0, y1, z0, z1) => { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); return g; };
  const flipGeo = (g) => { const ix = g.index.array; for (let k = 0; k < ix.length; k += 3) { const a = ix[k + 1]; ix[k + 1] = ix[k + 2]; ix[k + 2] = a; } const n = g.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, -n.getX(i), -n.getY(i), -n.getZ(i)); return g; };
  const facing = (g, dir) => { const n = g.attributes.normal; if (n.getX(0) * dir.x + n.getY(0) * dir.y + n.getZ(0) * dir.z < 0) flipGeo(g); return g; };
  /* gingham cushion (world-space checks) */
  const cushion = (w, h, d, p, ry = 0) => { const g = rb(w, h, d, Math.min(0.025, h * 0.45)).clone(); g.applyMatrix4(X.mat4(p, [0, ry, 0])); X.worldUV(g, 0.3); batch.push(M.gingham, g, { cast: false }); };

  /* cheap garden pieces */
  const yarn = (x, y, z, r, hex) => K.add('yarn', sph(10, 7), { p: [x, y + r * 0.95, z], s: r, c: hex });
  const basket = (x, y, z, r, h, fill) => {
    K.add('weave', new THREE.CylinderGeometry(r, r * 0.84, h, 14, 1, true), { p: [x, y + h / 2, z], c: '#D9C2A3', ao: 0.3 });
    K.add('weave', new THREE.CylinderGeometry(r * 0.83, r * 0.83, 0.01, 14), { p: [x, y + 0.005, z], c: '#C9AE8E' });
    K.add('weave', new THREE.TorusGeometry(r, r * 0.09, 4, 14), { p: [x, y + h, z], r: [PI / 2, 0, 0], c: '#CDB391' });
    if (fill) fill.forEach((c, i) => { const a = i / fill.length * TAU + 0.5, rr = fill.length > 1 ? r * 0.42 : 0; yarn(x + Math.cos(a) * rr, y + h * 0.45, z + Math.sin(a) * rr, r * 0.48, c); });
  };
  function hydrangea(x, y, z, s, seed, cols = ['#EDB9AC', '#F4D6CB', '#CFC2DF', '#F6E7DE'], decal = true) {
    const r2 = X.rng(seed);
    K.add('leaf', X.lumpy(seed % 50 + 100, 0.16, 5, 12, 8), { p: [x, y + 0.25 * s, z], s: [0.48 * s, 0.3 * s, 0.42 * s], c: '#87A07F', ao: 0.45 });
    for (let i = 0; i < 5; i++) {
      const a = i / 4 * TAU + r2() * 0.6, rr = i === 4 ? 0 : 0.26 * s, hx = x + Math.cos(a) * rr, hz = z + Math.sin(a) * rr * 0.85, hy = y + (i === 4 ? 0.5 : 0.38 + r2() * 0.08) * s;
      const col = cols[i % cols.length], R = (0.15 + r2() * 0.04) * s;
      K.add('felt', X.lumpy(seed % 40 + 150 + i, 0.14, 9, 8, 6), { p: [hx, hy, hz], s: [R, R * 0.85, R], c: col, ao: 0.3 });
      for (let k = 0; k < 3; k++) {
        const u = V3(r2() - 0.5, 0.35 + r2() * 0.65, r2() - 0.5).normalize();
        blooms.add(V3(hx + u.x * R * 0.95, hy + u.y * R * 0.82, hz + u.z * R * 0.95), new THREE.Quaternion().setFromUnitVectors(V3(0, 0, 1), u), R * 0.3, T.shade(col, 0.06));
      }
    }
    if (decal) decals.at(x, y + 0.004, z, 1.1 * s, 1.0 * s, 0.32);
  }
  function lavender(x, y, z, s, seed) {
    const r2 = X.rng(seed);
    K.add('leaf', X.lumpy(seed % 30 + 200, 0.1, 7, 10, 7), { p: [x, y + 0.07 * s, z], s: [0.17 * s, 0.14 * s, 0.17 * s], c: '#9AAE95', ao: 0.45 });
    for (let k = 0; k < 9; k++) {
      const a = r2() * TAU, rr = r2() * 0.11 * s, tilt = (r2() - 0.5) * 0.45, L = (0.3 + r2() * 0.12) * s;
      const bx = x + Math.cos(a) * rr, bz = z + Math.sin(a) * rr, tx = bx + Math.sin(tilt) * L * Math.cos(a), tz = bz + Math.sin(tilt) * L * Math.sin(a);
      bar([bx, y + 0.12 * s, bz], [tx, y + L, tz], 0.008 * s, '#8FA286');
      K.add('felt', sph(5, 3), { p: [tx, y + L + 0.045 * s, tz], s: [0.025 * s, 0.075 * s, 0.025 * s], c: r2() < 0.5 ? '#B6A3C9' : '#9C88B6' });
    }
  }
  /* terracotta / painted pot with a planting: 'ball' topiary, 'olive', 'herb', 'geranium', 'rose' (a vine roots in it) */
  function pot(x, y, z, r, h, kind, seed, o = {}) {
    const key = o.paint ? 'satin' : 'terra', col = o.paint || '#C98B70';
    K.add(key, new THREE.CylinderGeometry(r, r * 0.78, h, 14), { p: [x, y + h / 2, z], c: col, ao: 0.3 });
    K.add(key, new THREE.TorusGeometry(r * 0.98, r * 0.11, 5, 14), { p: [x, y + h, z], r: [PI / 2, 0, 0], c: T.shade(col, -0.05) });
    K.add('clay', cyl(12), { p: [x, y + h * 0.92, z], s: [r * 0.9, 0.01, r * 0.9], c: '#6B5444' });
    const top = y + h;
    if (kind === 'ball' || kind === 'olive') {
      const H = o.H || 0.7;
      K.add('clay', cyl(6), { p: [x, top + H * 0.3, z], s: [0.018, H * 0.6, 0.018], c: '#8E7262' });
      const balls = kind === 'olive' ? [[0, 0.7, 0, 0.24], [0.1, 0.58, 0.04, 0.16], [-0.09, 0.62, -0.03, 0.16]] : [[0, 0.72, 0, 0.26]];
      balls.forEach(([bx, by, bz, br], i) => {
        const g = X.lumpy(seed * 3 + i + 600, kind === 'olive' ? 0.08 : 0.05, kind === 'olive' ? 5 : 4, 12, 9).clone(); g.scale(br * H, br * H * 0.95, br * H); g.translate(x + bx * H, top + by * H, z + bz * H);
        X.paintGeo(g, kind === 'olive' ? '#93A48C' : '#7F9A7A', { top: kind === 'olive' ? '#C3CDB8' : '#B4C6A6', topPow: 1.4, ao: 0.2 }); batch.push(P.mat('leaf'), g);
        X.sprinkle(leaves, [x + bx * H, top + by * H, z + bz * H], [br * H, br * H * 0.95, br * H], Math.round(br * H * br * H * 260), { seed: seed + i, size: 0.06, yMin: -0.2 });
      });
    } else if (kind === 'herb') {
      K.add('leaf', X.lumpy(seed + 700, 0.16, 7, 10, 7), { p: [x, top + r * 0.5, z], s: [r * 1.05, r * 0.85, r * 1.05], c: o.leaf || '#8EA685', ao: 0.4 });
    } else if (kind === 'geranium' || kind === 'rose') {
      K.add('leaf', X.lumpy(seed + 710, 0.16, 7, 10, 7), { p: [x, top + r * 0.55, z], s: [r * 1.2, r * 0.9, r * 1.2], c: '#7F9A7A', ao: 0.4 });
      const fl = o.flowers || ['#EFA9A0', '#F4C8BE', '#FBF6EE'];
      for (let k = 0; k < (o.nf || 9); k++) { const a = k * 2.4, rr = r * (0.3 + 0.6 * ((k * 0.37) % 1)); blooms.add(V3(x + Math.cos(a) * rr, top + r * (0.9 + 0.35 * ((k * 0.61) % 1)), z + Math.sin(a) * rr + r * 0.2), new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.6, 0, a)), r * 0.32, fl[k % fl.length]); }
    }
    decals.at(x, y + 0.004, z, r * 3.2, r * 3.2, 0.42);   // on whatever the pot stands on (ground, café ledge, balcony)
  }

  /* ------------------------------------------------------------------ the owner's potted plants (07/11): sage, rosemary,
     thyme, tanacetum, sasanqua (sơn trà), japonica (trà mi), hydrangea, monstera, peony. Big readable silhouettes and
     colour blocks for the watercolour; every part merges into the existing kit / scatter batches (no new draw calls).
     (x, y, z) = the pot's base; the herbs also come without a pot (window boxes) via plantTop(kind, x, top, z, r). */
  const QZ = (n) => new THREE.Quaternion().setFromUnitVectors(V3(0, 0, 1), n.clone().normalize());
  const outward = (r2, yMin = 0.1) => { const a = r2() * TAU, y = yMin + r2() * (1 - yMin), rr = Math.sqrt(1 - y * y); return V3(Math.cos(a) * rr, y, Math.sin(a) * rr + 0.25).normalize(); };
  const GREENS_D = ['#4A6A52', '#56775D', '#3F5E48', '#5F7F63'];
  function plantTop(kind, x, top, z, r, seed) {
    const r2 = X.rng(seed * 7 + 3);
    if (kind === 'sage') {          // soft mound of grey-green ovals with a few lilac spikes
      K.add('leaf', X.lumpy(seed % 40 + 800, 0.12, 6, 12, 8), { p: [x, top + r * 0.45, z], s: [r * 1.3, r * 0.8, r * 1.3], c: '#9DAE96', ao: 0.35 });
      for (let i = 0; i < Math.round(30 * r / 0.08); i++) {
        const n = outward(r2, 0.0), p = V3(x + n.x * r * 1.25, top + r * 0.45 + n.y * r * 0.8, z + n.z * r * 1.2);
        const up0 = V3(n.x * 0.6, 1, n.z * 0.6).normalize(), xa = V3().crossVectors(up0, n).normalize(), up = V3().crossVectors(n, xa).normalize();
        const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xa, up, n));
        leaves.add(p, q, [r * 0.42, r * 0.62, r * 0.5], ['#A9B9A2', '#93A68C', '#B9C7B1', '#8C9F86'][i % 4]);
      }
      for (let k = 0; k < 4; k++) {
        const a = k * 1.7 + 0.4, bx = x + Math.cos(a) * r * 0.45, bz = z + Math.sin(a) * r * 0.45, h = top + r * (1.5 + 0.35 * r2());
        bar([bx, top + r * 0.9, bz], [bx + Math.cos(a) * r * 0.15, h, bz + Math.sin(a) * r * 0.15], 0.006, '#8FA286');
        K.add('felt', sph(5, 3), { p: [bx + Math.cos(a) * r * 0.17, h + r * 0.12, bz + Math.sin(a) * r * 0.17], s: [r * 0.12, r * 0.42, r * 0.12], c: k % 2 ? '#B9A3CC' : '#A58FBF' });
      }
    } else if (kind === 'rosemary') {   // upright bushy sprigs of fine deep-green needles, tiny pale-blue flowers
      const n = 13;
      for (let k = 0; k < n; k++) {
        const a = k / n * TAU + r2() * 0.4, rr = r * 0.55 * Math.sqrt(r2()), L = r * (2.0 + 1.3 * r2()), lean = 0.1 + 0.22 * (rr / r);
        const b = V3(x + Math.cos(a) * rr, top, z + Math.sin(a) * rr), t = V3(b.x + Math.cos(a) * L * lean, top + L, b.z + Math.sin(a) * L * lean);
        rod(b.toArray(), t.toArray(), r * 0.05, r * 0.025, '#6B7F5E', 'leaf', 4);
        const d = t.clone().sub(b).normalize();
        for (let j = 0; j < 14; j++) {
          const u = 0.12 + j / 14 * 0.86, p = b.clone().lerp(t, u), ang = j * 2.2 + k;
          const side = V3(Math.cos(ang), 0, Math.sin(ang)).addScaledVector(d, -Math.cos(ang) * d.x - Math.sin(ang) * d.z).normalize();
          const tip = side.clone().multiplyScalar(0.75).addScaledVector(d, 0.66).normalize();
          const nn = V3().crossVectors(tip, d).normalize(); if (nn.lengthSq() < 0.5) nn.set(0, 0, 1); if (nn.z < 0) nn.negate();
          const xa = V3().crossVectors(tip, nn).normalize(), n2 = V3().crossVectors(xa, tip).normalize();
          const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xa, tip, n2));
          const len = r * (0.38 - 0.18 * u);
          K.add('leaf', X.bladeGeo(), { p: p.toArray(), q, s: [r * 0.07, len, r * 0.07], c: u > 0.8 ? '#7E9A80' : (j % 3 ? '#4F7056' : '#628466') });
        }
        if (k % 3 === 0) for (let f = 0; f < 2; f++) blooms.add(b.clone().lerp(t, 0.55 + f * 0.2).add(V3(0, 0, r * 0.12)), QZ(V3(Math.cos(a), 0.4, Math.sin(a) + 0.7)), r * 0.1, '#C3D3EE');
      }
    } else if (kind === 'thyme') {      // low tiny-leaf clumps spilling over the rim, lilac-pink flecks
      const clumps = 9;
      for (let k = 0; k < clumps; k++) {
        const a = k / clumps * TAU + r2() * 0.5 + 0.9, rim = k % 3 !== 0, rr = rim ? r * (0.95 + 0.15 * r2()) : r * 0.4 * r2();
        const front = Math.max(0, Math.sin(a)), cy = rim ? top - r * (0.15 + 0.45 * front) : top + r * 0.12;
        const cx = x + Math.cos(a) * rr, cz = z + Math.sin(a) * rr, cr = r * (0.38 + 0.12 * r2());
        K.add('leaf', X.lumpy(seed % 30 + 840 + k, 0.22, 10, 9, 6), { p: [cx, cy, cz], s: [cr, cr * (rim ? 0.8 + front * 0.5 : 0.55), cr], c: ['#7E9670', '#869E78', '#738C68'][k % 3], ao: 0.25 });
        for (let f = 0; f < 4; f++) { const nf = outward(r2, -0.2); blooms.add(V3(cx + nf.x * cr, cy + nf.y * cr * 0.7, cz + nf.z * cr), QZ(nf), r * 0.09, ['#D7A9C6', '#C9A2CF', '#E6C3D6'][f % 3]); }
      }
      X.sprinkle(leaves, [x, top + r * 0.05, z], [r * 1.2, r * 0.35, r * 1.2], Math.round(26 * r / 0.07), { seed, size: r * 0.2, yMin: -0.6, colors: ['#7E9670', '#93AA84', '#6F8865'] });
    } else if (kind === 'tanacetum') {  // bushy, covered in small white daisies with yellow button centres
      K.add('leaf', X.lumpy(seed % 40 + 920, 0.12, 6, 12, 8), { p: [x, top + r * 0.75, z], s: [r * 1.25, r * 1.0, r * 1.25], c: '#8FA67F', ao: 0.35 });
      X.sprinkle(leaves, [x, top + r * 0.75, z], [r * 1.25, r, r * 1.25], Math.round(18 * r / 0.1), { seed, size: r * 0.5, colors: ['#93AA84', '#A3B893', '#87A07A'] });
      for (let k = 0; k < Math.round(20 * r / 0.1); k++) {
        const n = outward(r2, 0.05), p = V3(x + n.x * r * 1.3, top + r * 0.75 + n.y * r * 1.05, z + n.z * r * 1.3);
        blooms.add(p, QZ(n), r * 0.3, k % 5 ? '#FFFCF4' : '#F7F1E4');
        K.add('felt', sph(6, 4), { p: p.clone().addScaledVector(n, r * 0.04).toArray(), s: r * 0.11, c: '#EDC24A' });
      }
    }
  }
  function plant(kind, x, y, z, s, seed, o = {}) {
    const r2 = X.rng(seed * 13 + 1);
    const potR = (o.potR || 0.16) * s, potH = (o.potH || 0.26) * s;
    pot(x, y, z, potR, potH, 'none', seed, { paint: o.paint });
    const top = y + potH;
    if (kind === 'sage' || kind === 'rosemary' || kind === 'thyme' || kind === 'tanacetum') { plantTop(kind, x, top, z, potR * 0.95, seed); return; }
    if (kind === 'hydrangea') {       // potted mophead: a low leaf skirt under big round flower heads covered in florets
      const cols = o.cols || ['#EDB9AC', '#F4D6CB', '#F1C3C0', '#F6E1D9'];
      K.add('leaf', X.lumpy(seed % 40 + 1080, 0.14, 6, 12, 8), { p: [x, top + 0.1 * s, z], s: [0.3 * s, 0.17 * s, 0.28 * s], c: '#7F9A7A', ao: 0.4 });
      X.sprinkle(leaves, [x, top + 0.1 * s, z], [0.32 * s, 0.17 * s, 0.3 * s], Math.round(30 * s), { seed, size: 0.1 * s, yMin: -0.5, colors: ['#7F9A7A', '#8EA685', '#728E70'] });
      const heads = [[0, 0.36, 0.02, 0.15], [-0.17, 0.27, 0.08, 0.13], [0.17, 0.28, 0.07, 0.135], [-0.06, 0.25, 0.2, 0.12], [0.1, 0.23, -0.14, 0.12], [-0.14, 0.3, -0.12, 0.12]];
      heads.forEach(([hx, hy, hz, hr], i) => {
        const c = V3(x + hx * s, top + hy * s, z + hz * s), R = hr * s, col = cols[i % cols.length];
        K.add('felt', X.lumpy(seed % 30 + 1120 + i, 0.1, 8, 10, 8), { p: c.toArray(), s: [R, R * 0.9, R], c: col, ao: 0.25 });
        for (let k = 0; k < 14; k++) { const n = outward(r2, -0.35); blooms.add(c.clone().add(V3(n.x * R, n.y * R * 0.9, n.z * R)), QZ(n), R * 0.3, T.shade(cols[(i + k) % cols.length], (k % 3 - 1) * 0.05)); }
      });
      return;
    }
    if (kind === 'sasanqua') {        // a lollipop standard: dark glossy ball, single pink flowers with gold centres
      const H = 0.95 * s, R = 0.24 * s;
      bar([x, top - 0.02, z], [x, top + H - R * 0.6, z], 0.02 * s, '#7A6152');
      K.add('leaf', X.lumpy(seed % 40 + 960, 0.07, 5, 12, 9), { p: [x, top + H, z], s: [R, R * 0.95, R], c: '#4F6D57', top: '#7C9A7C', ao: 0.25 });
      X.sprinkle(leaves, [x, top + H, z], [R * 1.02, R, R * 1.02], Math.round(60 * s), { seed, size: 0.06 * s, colors: GREENS_D });
      for (let k = 0; k < 14; k++) {
        const n = outward(r2, -0.4), p = V3(x + n.x * R * 1.06, top + H + n.y * R, z + n.z * R * 1.06);
        blooms.add(p, QZ(n), 0.05 * s, ['#E88FA3', '#F2AEBC', '#EC9DAF'][k % 3]);
        K.add('felt', sph(5, 3), { p: p.clone().addScaledVector(n, 0.008).toArray(), s: 0.012 * s, c: '#F0CF5A' });
      }
      return;
    }
    if (kind === 'japonica') {        // a rounder taller shrub with double rose-like flowers, white / blush, one soft red
      const masses = [[0, 0.36, 0, 0.3, 0.33], [0.06, 0.7, -0.02, 0.24, 0.24], [-0.12, 0.5, 0.06, 0.2, 0.2]];
      for (const [mx, my, mz, rx, ry] of masses) {
        K.add('leaf', X.lumpy(seed % 40 + 1000 + (mx * 50 | 0), 0.09, 5, 12, 9), { p: [x + mx * s, top + my * s, z + mz * s], s: [rx * s, ry * s, rx * s * 0.92], c: '#4D6B55', top: '#78967A', ao: 0.3 });
        X.sprinkle(leaves, [x + mx * s, top + my * s, z + mz * s], [rx * s, ry * s, rx * s * 0.92], Math.round(rx * rx * 900 * s), { seed: seed + (mx * 9 | 0), size: 0.065 * s, colors: GREENS_D });
      }
      const cols = ['#FBF4EE', '#F4D2CB', '#F7E3DD', '#FBF4EE', '#F1C6BE'];
      for (let k = 0; k < 11; k++) {
        const m = masses[k % 3], n = outward(r2, -0.3), p = V3(x + (m[0] + n.x * m[3]) * s, top + (m[1] + n.y * m[4]) * s, z + (m[2] + n.z * m[3]) * s);
        K.add('felt', X.rosetteGeo(), { p: p.toArray(), q: QZ(n), s: 0.058 * s, c: k === 4 ? '#D7737D' : cols[k % cols.length] });
      }
      return;
    }
    if (kind === 'monstera') {        // big split heart leaves on stems, fanned toward the street
      const L = [[-1.15, 0.42, 0.36], [-0.6, 0.55, 0.4], [0.02, 0.62, 0.42], [0.62, 0.52, 0.4], [1.12, 0.4, 0.34], [-0.3, 0.42, 0.3], [0.38, 0.38, 0.3]];
      L.forEach(([rz, ls, sz], i) => {
        const dir = V3(-Math.sin(rz) * 0.75, 1, 0.3 + (i > 4 ? -0.35 : 0)).normalize();
        const B = V3(x, top, z).addScaledVector(dir, ls * s);
        bar([x + dir.x * 0.03, top - 0.02, z], B.toArray(), 0.011 * s, '#6E8B62');
        K.add('leaf', X.monsteraLeafGeo(), { p: B.toArray(), r: [-0.55 - (i > 4 ? -0.2 : 0), 0, rz * 0.9], s: sz * s, c: ['#4F7B5B', '#5E8A66', '#46704F', '#57845F'][i % 4], ao: 0.15 });
      });
      return;
    }
    if (kind === 'peony') {           // lush bush with big cupped double blooms (blush / pink) and a few buds
      K.add('leaf', X.lumpy(seed % 40 + 1040, 0.12, 5, 12, 8), { p: [x, top + 0.2 * s, z], s: [0.34 * s, 0.26 * s, 0.32 * s], c: '#7F9A7A', top: '#A9BB9C', ao: 0.35 });
      X.sprinkle(leaves, [x, top + 0.2 * s, z], [0.35 * s, 0.27 * s, 0.33 * s], Math.round(46 * s), { seed, size: 0.08 * s, colors: ['#7F9A7A', '#8EA685', '#6F8C6E'] });
      const blooms6 = [[-0.16, 0.38, 0.14], [0.12, 0.42, 0.16], [0.0, 0.48, -0.02], [0.25, 0.3, 0.05], [-0.26, 0.28, 0.0], [0.04, 0.32, 0.26], [-0.08, 0.26, 0.28], [0.22, 0.34, 0.24]];
      blooms6.forEach(([bx, by, bz], i) => {
        const p = V3(x + bx * s, top + by * s, z + bz * s), n = V3(bx * 1.6, 1.0, bz * 1.6 + 0.55).normalize();
        K.add('felt', X.rosetteGeo(), { p: p.toArray(), q: QZ(n), s: 0.12 * s, c: ['#F6D3D9', '#F2BCC6', '#F8DEE2'][i % 3] });
        K.add('felt', X.lumpy(40 + i, 0.18, 7, 8, 6), { p: p.clone().addScaledVector(n, 0.025 * s).toArray(), s: [0.068 * s, 0.052 * s, 0.068 * s], c: ['#EFA8B5', '#E99AAA', '#F2B6C0'][i % 3] });
      });
      for (const [bx, by, bz] of [[0.2, 0.46, -0.08], [-0.1, 0.5, 0.2], [-0.3, 0.38, 0.12]]) K.add('felt', sph(6, 5), { p: [x + bx * s, top + by * s, z + bz * s], s: 0.03 * s, c: '#E4A0AC' });
      return;
    }
  }

  /* a cheap cup + saucer (≈ 250 triangles; P.cup is the close-up version) */
  function cup(x, y, z, hex = '#F7EFE4', s = 1.25, ry = 0) {
    const L = (pts, seg) => new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a * s, b * s)), seg);
    const c = L([[0, 0], [0.026, 0], [0.034, 0.012], [0.04, 0.05], [0.041, 0.062], [0.036, 0.062], [0.03, 0.02], [0, 0.016]], 10); c.translate(x, y + 0.006 * s, z);
    const sc = L([[0, 0], [0.05, 0], [0.07, 0.01], [0.064, 0.012], [0, 0.007]], 10); sc.translate(x, y, z);
    for (const g of [c, sc]) { X.paintGeo(g, hex, { ao: 0.15 }); batch.push(MM.satin, g, { cast: false }); }
    K.add('satin', new THREE.TorusGeometry(0.015 * s, 0.004 * s, 4, 8, PI * 1.3), { p: [x + Math.cos(ry) * 0.043 * s, y + 0.04 * s, z - Math.sin(ry) * 0.043 * s], r: [0, ry, -PI * 0.65], c: hex });
    K.add('clay', new THREE.CircleGeometry(0.034 * s, 10), { p: [x, y + 0.058 * s, z], r: [-PI / 2, 0, 0], c: '#C9A27C' });
  }

  /* glass cake dome with macarons (cheap: lathe + a few spheres) */
  function cakeDome(x, y, z, s = 1) {
    const st = new THREE.LatheGeometry([[0, 0], [0.07, 0], [0.075, 0.008], [0.02, 0.02], [0.016, 0.08], [0.16, 0.085], [0.165, 0.096], [0, 0.096]].map(([a, b]) => new THREE.Vector2(a * s, b * s)), 14);
    st.translate(x, y, z); X.paintGeo(st, '#F7EFE4', { ao: 0.2 }); batch.push(MM.satin, st);
    const cols = ['#EFC5B9', '#C5D3B8', '#F1DCA4', '#D9CFE3', '#EFC5B9'];
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; K.add('clay', sph(8, 5), { p: [x + Math.cos(a) * 0.1 * s, y + 0.106 * s, z + Math.sin(a) * 0.1 * s], s: [0.024 * s, 0.014 * s, 0.024 * s], c: cols[i] }); }
    K.add('clay', cyl(12), { p: [x, y + 0.13 * s, z], s: [0.055 * s, 0.065 * s, 0.055 * s], c: '#F3E3CC', ao: 0.25 });
    K.add('clay', sph(10, 5), { p: [x, y + 0.165 * s, z], s: [0.057 * s, 0.014 * s, 0.057 * s], c: '#FBF6EE' });
    const dome = new THREE.LatheGeometry([[0.155, 0], [0.15, 0.09], [0.13, 0.18], [0.08, 0.235], [0, 0.25]].map(([a, b]) => new THREE.Vector2(a * s, b * s)), 16);
    dome.translate(x, y + 0.096 * s, z); batch.push(M.glass, dome, { cast: false });
    K.add('metal', sph(8, 6), { p: [x, y + 0.36 * s, z], s: 0.014 * s, c: C.rose });
  }

  /* ------------------------------------------------------------------ layout constants (CONTRACT-v2) */
  const HW = 4.2, WT = 0.3, DEPTH = 7.6;
  const DOOR = { hw: 0.7, h: 2.5 };
  const FAS = { y0: 2.76, y1: 3.98, x: 3.8 };
  const CORN = 4.2;
  const SW = 3.4, SH = SW * 340 / 1024, SIGN = V3(0, 3.38, 0.07);
  const DISP = { x0: -3.75, x1: -1.03, y0: 0.65, y1: 2.55, zf: 0.52 };
  const CAFE = { x0: 1.03, x1: 3.75, y0: 1.0, y1: 2.55 };
  const ROOF = { ye: 5.2, ze: 0.42, zr: -DEPTH / 2, yr: 9.15, t: 0.12, xo: HW + 0.26 };
  const tanP = (ROOF.yr - ROOF.ye) / (ROOF.ze - ROOF.zr), cosP = 1 / Math.hypot(1, tanP), sinP = tanP * cosP;
  const roofY = (z) => ROOF.ye + (ROOF.ze - z) * tanP;             // top of the front slope at depth z
  const zAtY = (y) => ROOF.ze - (y - ROOF.ye) / tanP;
  const tV = ROOF.t / cosP;                                            // vertical thickness of the roof slab
  const WALL_TOP = roofY(0) - tV - 0.005;
  const DORM = [
    { c: -2.5, hw: 0.92, ye: 6.1, yr: 7.05, kind: 'win' },
    { c: 0, hw: 0.66, ye: 6.3, yr: 7.08, kind: 'door' },
    { c: 2.5, hw: 0.92, ye: 6.1, yr: 7.05, kind: 'win' },
  ];
  const WIN2 = { hw: 0.41, y0: 4.58, y1: 5.82 };
  const FD = { hw: 0.37, y0: 4.22, ys: 5.7 };                       // centre French door: rect to ys + half-round head
  const SAGE = J.body, TRIM = C.trim;

  /* ================================================================== GROUND: lawn, flagstone pavement, kerb, cobbled lane */
  {
    const s = new THREE.Shape(); s.absarc(0, 0, 70, 0, TAU, false);
    const hole = new THREE.Path(); hole.moveTo(-HW, 0.0); hole.lineTo(-HW, DEPTH); hole.lineTo(HW, DEPTH); hole.lineTo(HW, 0.0); hole.lineTo(-HW, 0.0);
    s.holes.push(hole);
    const g = new THREE.ShapeGeometry(s, 40); g.rotateX(-PI / 2); g.translate(0, -0.06, 0);
    X.worldUV(g, 3.0);
    const lawn = new THREE.Mesh(g, M.grass); lawn.name = 'ext:lawn'; lawn.receiveShadow = true; group.add(lawn);
    // pavement (pale flagstones) from the house to the kerb, lane (cobbles) beyond, a grass verge after that
    worldGeo(new THREE.PlaneGeometry(22, 1.2).rotateX(-PI / 2).translate(0, 0, 0.6), M.flags, 2.6, { cast: false });
    worldGeo(new THREE.PlaneGeometry(22, 2.42).rotateX(-PI / 2).translate(0, 0, 1.2 + 1.21), M.cobbles, 1.15, { cast: false });
    clay(rb(22, 0.02, 0.1, 0.008), [0, 0.004, 1.2], '#D8C9B6');
    worldGeo(new THREE.PlaneGeometry(30, 5.4).rotateX(-PI / 2).translate(0, -0.025, 3.8 + 2.7), M.lane, 1.25, { cast: false });
    clay(rb(30, 0.12, 0.2, 0.04), [0, -0.02, 3.7], '#D9CBB9', { ao: 0.3 });
    // threshold: flush stone through the door (y = 0; nothing stands in the doorway)
    worldGeo(boxAt(-DOOR.hw, DOOR.hw, -0.05, 0, -WT - 0.005, 0.02), M.flags, 1.3, { cast: false });
    // coir doormat with a paw pictogram (outside the door tunnel: z ≥ 0.55)
    small(true);
    clay(rb(1.0, 0.018, 0.44, 0.008), [0, 0.009, 0.8], '#D7BE98', { ao: 0.2 });
    clay(rb(0.92, 0.004, 0.36, 0.002), [0, 0.019, 0.8], '#CDB28A');
    K.add('felt', sph(10, 6), { p: [0, 0.022, 0.83], s: [0.06, 0.006, 0.048], c: '#B88A7A' });
    for (const [dx, dz] of [[-0.065, -0.05], [-0.024, -0.083], [0.024, -0.083], [0.065, -0.05]]) K.add('felt', sph(8, 6), { p: [dx, 0.022, 0.83 + dz], s: [0.019, 0.006, 0.023], c: '#B88A7A' });
    small(false);
    // the door's warm spill and the windows' glow on the pavement
    pool(0, 1.5, 2.2, 1.94, 1.0); pool(-2.4, 1.2, 3.0, 1.6, 0.55); pool(2.4, 1.15, 2.8, 1.3, 0.45);
  }

  /* ================================================================== HOUSE SHELL: front wall (with dormer gables), sides, back */
  {
    const s = new THREE.Shape();
    s.moveTo(-HW, 0); s.lineTo(-DOOR.hw, 0); s.lineTo(-DOOR.hw, DOOR.h); s.lineTo(DOOR.hw, DOOR.h); s.lineTo(DOOR.hw, 0); s.lineTo(HW, 0); s.lineTo(HW, WALL_TOP);
    for (const d of [...DORM].reverse()) {
      const td = 0.07 * Math.hypot(1, (d.yr - d.ye) / d.hw) + 0.01;
      s.lineTo(d.c + d.hw, WALL_TOP); s.lineTo(d.c + d.hw, d.ye - td); s.lineTo(d.c, d.yr - td); s.lineTo(d.c - d.hw, d.ye - td); s.lineTo(d.c - d.hw, WALL_TOP);
    }
    s.lineTo(-HW, WALL_TOP); s.lineTo(-HW, 0);
    const rect = (x0, y0, x1, y1) => { const h = new THREE.Path(); h.moveTo(x0, y0); h.lineTo(x0, y1); h.lineTo(x1, y1); h.lineTo(x1, y0); h.lineTo(x0, y0); return h; };
    s.holes.push(rect(DISP.x0, DISP.y0, DISP.x1, DISP.y1), rect(CAFE.x0, CAFE.y0, CAFE.x1, CAFE.y1));
    for (const d of DORM) {
      if (d.kind === 'win') s.holes.push(rect(d.c - WIN2.hw, WIN2.y0, d.c + WIN2.hw, WIN2.y1));
      else { const h = new THREE.Path(); h.moveTo(-FD.hw, FD.y0); h.lineTo(FD.hw, FD.y0); h.lineTo(FD.hw, FD.ys); h.absarc(0, FD.ys, FD.hw, 0, PI, false); h.lineTo(-FD.hw, FD.y0); s.holes.push(h); }
    }
    const ex = new THREE.ExtrudeGeometry(s, { depth: WT, bevelEnabled: false, curveSegments: 12 });
    ex.translate(0, 0, -WT);
    const g = ex.index ? ex.toNonIndexed() : ex;
    if (!g.attributes.normal) g.computeVertexNormals();
    X.worldUV(g, 3.2);
    // regroup: everything but the back cap → material 0 (limewash); the back cap (−Z) → material 1 (plaster)
    const pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv, n = pos.count;
    const order = [[], []];
    for (let i = 0; i < n; i += 3) order[nor.getZ(i) < -0.9 ? 1 : 0].push(i);
    const P3 = new Float32Array(n * 3), N3 = new Float32Array(n * 3), U2 = new Float32Array(n * 2);
    let w = 0;
    for (const list of order) for (const i0 of list) for (let k = 0; k < 3; k++) {
      const i = i0 + k;
      P3.set([pos.getX(i), pos.getY(i), pos.getZ(i)], w * 3); N3.set([nor.getX(i), nor.getY(i), nor.getZ(i)], w * 3); U2.set([uv.getX(i), uv.getY(i)], w * 2); w++;
    }
    const fw = new THREE.BufferGeometry();
    fw.setAttribute('position', new THREE.BufferAttribute(P3, 3)); fw.setAttribute('normal', new THREE.BufferAttribute(N3, 3)); fw.setAttribute('uv', new THREE.BufferAttribute(U2, 2));
    fw.addGroup(0, order[0].length * 3, 0); fw.addGroup(order[0].length * 3, order[1].length * 3, 1);
    fw.computeBoundingSphere();
    const front = new THREE.Mesh(fw, [M.wall, M.plaster]);   // group 1 (the −Z face) = P.mat('plaster')
    front.name = 'ext:frontWall'; front.castShadow = true; front.receiveShadow = true; group.add(front);

    // gable side walls (pentagons) and the back wall
    const yU = (z) => roofY(z) - tV - 0.01;
    const yUb = (z) => ROOF.ye + (z + DEPTH + ROOF.ze) * tanP - tV - 0.01;
    for (const sx of [-1, 1]) {
      const sh = new THREE.Shape([[WT, 0], [DEPTH, 0], [DEPTH, yUb(-DEPTH)], [DEPTH / 2, ROOF.yr - tV - 0.01], [WT, yU(-WT)]].map(([a, y]) => new THREE.Vector2(a, y)));
      const gg = new THREE.ExtrudeGeometry(sh, { depth: 0.23, bevelEnabled: false });
      const m = new THREE.Matrix4().set(0, 0, 1, sx > 0 ? HW - 0.23 : -HW, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1);
      gg.applyMatrix4(m);
      worldGeo(gg.index ? gg : gg, M.wall, 3.2, { tag: 'shell' });
    }
    worldGeo(boxAt(-HW, HW, 0, yUb(-DEPTH), -DEPTH, -DEPTH + 0.28), M.wall, 3.2, { tag: 'shell' });
    // a little round attic window high on each gable end (lit), ivory ring + cross bars
    for (const sx of [-1, 1]) {
      const x = sx * (HW + 0.006), y = 7.35, z = -DEPTH / 2, R = 0.32;
      const pg = new THREE.CircleGeometry(R, 18); pg.rotateY(sx * PI / 2); pg.translate(x, y, z); batch.push(M.pane, pg, { cast: false });
      K.add('clay', new THREE.TorusGeometry(R + 0.03, 0.045, 6, 20), { p: [x + sx * 0.01, y, z], r: [0, PI / 2, 0], c: TRIM });
      bar([x + sx * 0.02, y - R, z], [x + sx * 0.02, y + R, z], 0.03, TRIM, { d: 0.03 }); bar([x + sx * 0.02, y, z - R], [x + sx * 0.02, y, z + R], 0.03, TRIM, { d: 0.03 });
      clay(rb(0.06, 0.08, R * 2 + 0.25, 0.02), [x + sx * 0.03, y - R - 0.08, z], '#F1E6D7');
    }
    // the floor-2 slab edge seen through the dormer windows is covered by the dioramas; plinth: a soft stone band
    for (const [x0, x1] of [[-HW - 0.02, -3.8], [3.8, HW + 0.02]]) blk(x0, x1, 0, 0.32, -0.02, 0.06, C.stoneD, { ao: 0.3 });
    for (const sx of [-1, 1]) blk(sx > 0 ? HW - 0.01 : -HW - 0.06, sx > 0 ? HW + 0.06 : -HW + 0.01, 0, 0.32, -DEPTH, -0.02, C.stoneD);
    // two patches of flaked plaster showing soft rose brick (storybook detail)
    const brick = (x, y, w, h, sideB, nx = 0) => {
      const g2 = new THREE.PlaneGeometry(w, h);
      const u = g2.attributes.uv; for (let i = 0; i < u.count; i++) u.setX(i, (sideB ? 0.5 : 0) + u.getX(i) * 0.5);
      if (nx) { g2.rotateY(nx * PI / 2); g2.translate(nx * (HW + 0.004), y, x); } else g2.translate(x, y, 0.004);
      batch.push(M.bricks, g2, { cast: false });
    };
    brick(-3.55, 4.62, 0.9, 0.82, false); brick(3.62, 5.0, 0.62, 0.6, true); brick(1.45, 4.85, 0.55, 0.5, false);
    brick(-1.6, 1.4, 1.2, 1.0, true, -1); brick(-4.6, 2.2, 1.1, 0.9, false, 1);
  }

  /* ================================================================== ROOF: steep scalloped slate, dormer notches, chimney */
  K = KR; batch.defaultTag = 'roofI';
  const roofPts = [];
  {
    const Lv = (ROOF.ze - ROOF.zr) / cosP, Wd = ROOF.xo * 2;
    const O = V3(-ROOF.xo, ROOF.ye, ROOF.ze), U = V3(1, 0, 0), Vv = V3(0, sinP, -cosP), N = V3(0, cosP, sinP);
    // front slope outline in (u, v) with a notch under every dormer roof
    const pts = [[0, 0]];
    for (const d of DORM) {
      const u0 = d.c - d.hw + ROOF.xo, u1 = d.c + d.hw + ROOF.xo, v1 = (d.ye - ROOF.ye) / sinP, v2 = (d.yr - ROOF.ye) / sinP;
      pts.push([u0, 0], [u0, v1], [d.c + ROOF.xo, v2], [u1, v1], [u1, 0]);
    }
    pts.push([Wd, 0], [Wd, Lv], [0, Lv]);
    const tile = 2.1;
    const top = X.planePoly(pts, O, U, Vv, tile); batch.push(M.slate, top);
    const under = X.planePoly(pts, O.clone().addScaledVector(N, -ROOF.t), U, Vv, tile); flipGeo(under); X.paintGeo(under, '#EADCCB'); batch.push(M.clay, under, { cast: false });
    // back slope
    const Ob = V3(ROOF.xo, ROOF.ye, -DEPTH - ROOF.ze), Ub = V3(-1, 0, 0), Vb = V3(0, sinP, cosP), Nb = V3(0, cosP, -sinP);
    batch.push(M.slate, X.planePoly([[0, 0], [Wd, 0], [Wd, Lv], [0, Lv]], Ob, Ub, Vb, tile));
    { const ub = X.planePoly([[0, 0], [Wd, 0], [Wd, Lv], [0, Lv]], Ob.clone().addScaledVector(Nb, -ROOF.t), Ub, Vb, tile); flipGeo(ub); X.paintGeo(ub, '#EADCCB'); batch.push(M.clay, ub, { cast: false }); }
    // eave boards (front, between the dormers) + back eave; verge boards with scalloped bargeboards on the gable ends
    const eaveSeg = [];
    let u = -ROOF.xo;
    for (const d of DORM) { eaveSeg.push([u, d.c - d.hw]); u = d.c + d.hw; }
    eaveSeg.push([u, ROOF.xo]);
    const eaveY = ROOF.ye - tV * 0.5, eaveZ = ROOF.ze + 0.02;
    for (const [x0, x1] of eaveSeg) {
      clay(rb(x1 - x0, tV + 0.03, 0.05, 0.015), [(x0 + x1) / 2, eaveY, eaveZ], TRIM, { ao: 0.1 });
      // a little scalloped valance under the eave board (gingerbread trim)
      const sc = X.scallopBoard(x1 - x0 - 0.02, 0.11, 0.07).clone(); sc.translate(x0 + 0.01, eaveY - tV * 0.5 - 0.005, eaveZ + 0.028);
      X.paintGeo(sc, '#F6EBDD'); batch.push(M.clay, sc);
    }
    clay(rb(Wd, tV + 0.03, 0.05, 0.015), [0, eaveY, -DEPTH - ROOF.ze - 0.02], TRIM);
    for (const sx of [-1, 1]) {
      // verge board along the slope (front half + back half)
      for (const back of [0, 1]) {
        const a = V3(sx * (ROOF.xo + 0.02), ROOF.ye - tV * 0.4, back ? -DEPTH - ROOF.ze : ROOF.ze), b = V3(sx * (ROOF.xo + 0.02), ROOF.yr - tV * 0.4, ROOF.zr);
        const mid = a.clone().add(b).multiplyScalar(0.5), L = a.distanceTo(b);
        const q = new THREE.Quaternion().setFromUnitVectors(V3(0, 0, 1), b.clone().sub(a).normalize());
        clay(rb(0.05, tV + 0.06, L, 0.015), mid.toArray(), TRIM, { q });
        // scalloped bargeboard under the verge: board x → along the slope, y → up (perpendicular), z → outward (±x)
        const sc = X.scallopBoard(L, 0.13, 0.09).clone();
        const st = (sx > 0) === (a.z > b.z) ? a : b, en = st === a ? b : a;
        const Xb = en.clone().sub(st).normalize(), Zb = V3(sx, 0, 0), Yb = new THREE.Vector3().crossVectors(Zb, Xb);
        const mB = new THREE.Matrix4().makeBasis(Xb, Yb, Zb).setPosition(st.x + sx * 0.028, st.y - tV * 0.75, st.z);
        sc.applyMatrix4(mB);
        X.paintGeo(sc, '#F6EBDD'); batch.push(M.clay, sc, { cast: false });
      }
    }
    // ridge roll
    clay(new THREE.CylinderGeometry(0.075, 0.075, Wd + 0.06, 10), [0, ROOF.yr + 0.02, ROOF.zr], '#A9877C', { r: [0, 0, PI / 2] });
    roofPts.push(V3(-ROOF.xo, ROOF.yr, ROOF.zr), V3(ROOF.xo, ROOF.yr, ROOF.zr), V3(0, ROOF.yr + 0.1, ROOF.zr));

    // dormer roofs: two slopes each, notched into the main roof along the valleys; scalloped bargeboards at the front
    for (const d of DORM) {
      const tanD = (d.yr - d.ye) / d.hw, ovd = 0.1, zf = 0.14, td = 0.07, cosD = 1 / Math.hypot(1, tanD);
      for (const sx of [-1, 1]) {
        const xe = d.c + sx * (d.hw + ovd), ye2 = d.ye - ovd * tanD;
        const A = V3(xe, ye2, zf), B = V3(d.c, d.yr, zf), Cc = V3(d.c, d.yr, zAtY(d.yr)), D = V3(d.c + sx * d.hw, d.ye, zAtY(d.ye)), E = V3(xe, ye2, zAtY(ye2));
        const outward = V3(sx * tanD, 1, 0).normalize();
        const g = facing(X.fan([B, A, E, D, Cc], tile), outward);
        X.worldUV(g, 1); { const p = g.attributes.position, uvA = g.attributes.uv; for (let i = 0; i < p.count; i++) uvA.setXY(i, (p.getZ(i)) / tile, Math.hypot(p.getX(i) - d.c, p.getY(i) - d.yr) / tile); }
        batch.push(M.slate, g);
        const ug = facing(X.fan([B, A, E, D, Cc].map((p) => p.clone().addScaledVector(outward, -td)), 1), outward.clone().negate());
        X.paintGeo(ug, '#EADCCB'); batch.push(M.clay, ug, { cast: false });
        // bargeboard (front gable edge) with scallops
        const L = A.distanceTo(B), sc = X.scallopBoard(L, 0.1, 0.06).clone();
        const st = sx < 0 ? A : B, en = sx < 0 ? B : A;
        const Xb = en.clone().sub(st).normalize(), Zb = V3(0, 0, 1), Yb = new THREE.Vector3().crossVectors(Zb, Xb);
        sc.applyMatrix4(new THREE.Matrix4().makeBasis(Xb, Yb, Zb).setPosition(st.x, st.y - td / cosD * 0.7, zf + 0.043));
        X.paintGeo(sc, '#F6EBDD'); batch.push(M.clay, sc);
        const mid = A.clone().add(B).multiplyScalar(0.5), ang = Math.atan2(B.y - A.y, B.x - A.x);
        clay(rb(L + 0.04, td / cosD + 0.03, 0.04, 0.012), [mid.x, mid.y - 0.01, zf + 0.02], TRIM, { r: [0, 0, ang] });
      }
      // cheek walls (small triangles behind the front wall) under each dormer eave
      for (const sx of [-1, 1]) {
        const x = d.c + sx * d.hw, ytop = d.ye - 0.1, z1 = zAtY(ytop);
        if (z1 < -WT) {
          const gch = new THREE.BufferGeometry();
          gch.setAttribute('position', new THREE.Float32BufferAttribute([x, roofY(-WT) - 0.02, -WT, x, ytop, -WT, x, ytop, z1], 3));
          gch.setIndex([0, 1, 2]); gch.computeVertexNormals(); facing(gch, V3(sx, 0, 0)); X.worldUV(gch, 3.2);
          batch.push(M.wall, gch);
        }
      }
      // keep the apex on screen
      roofPts.push(V3(d.c, d.yr + 0.05, zf));
    }

    // chimney: a soft rose-brick stack through the front slope near the right gable, ivory cap, two terracotta pots
    const cx = 3.0, cz = -2.7, cw = 0.62, cd = 0.52, ct = 9.05;
    const cb = roofY(cz + cd / 2) - 0.3;
    worldGeo(boxAt(cx - cw / 2, cx + cw / 2, cb, ct, cz - cd / 2, cz + cd / 2), std({ map: X.TEX.wash(), color: '#E9C4B5' }, 'chimney'), 1.6, { tag: 'chim' });
    clay(rb(cw + 0.14, 0.12, cd + 0.14, 0.035), [cx, ct + 0.06, cz], TRIM, { ao: 0.2 });
    clay(rb(cw + 0.06, 0.06, cd + 0.06, 0.02), [cx, ct - 0.2, cz], '#F3E5D6');
    for (const dx of [-0.14, 0.14]) {
      K.add('terra', new THREE.CylinderGeometry(0.07, 0.09, 0.26, 12), { p: [cx + dx, ct + 0.25, cz], c: '#C98B70', ao: 0.25 });
      K.add('terra', new THREE.TorusGeometry(0.072, 0.018, 5, 12), { p: [cx + dx, ct + 0.38, cz], r: [PI / 2, 0, 0], c: '#C38A70' });
    }
    // flashing apron where the stack meets the slope
    clay(rb(cw + 0.1, 0.06, 0.2, 0.02), [cx, roofY(cz + cd / 2) + 0.02, cz + cd / 2 + 0.06], '#B79E92', { r: [-Math.atan(tanP) * 0.0, 0, 0] });
    roofPts.push(V3(cx, ct + 0.4, cz));
  }
  K = KH; batch.defaultTag = '';

  /* ================================================================== SHOPFRONT: pilasters, fascia + sign, cornice */
  const signCenter = SIGN.clone();
  {
    // outer pilasters (sage) with plinth blocks, a fine ivory inset line and console brackets carrying the fascia
    for (const sx of [-1, 1]) {
      const x0 = sx > 0 ? FAS.x : -HW - 0.02, x1 = sx > 0 ? HW + 0.02 : -FAS.x, xc = (x0 + x1) / 2;
      blk(x0, x1, 0, FAS.y0, 0, 0.14, SAGE, { ao: 0.2 });
      blk(x0 - 0.02, x1 + 0.02, 0, 0.3, -0.01, 0.17, J.deep, { ao: 0.25 });
      blk(xc - 0.035, xc + 0.035, 0.45, FAS.y0 - 0.25, 0.13, 0.15, TRIM);
      // console: a block with a scrolled ivory front
      blk(x0 - 0.02, x1 + 0.02, FAS.y0, FAS.y1, 0, 0.22, SAGE, { ao: 0.15 });
      K.add('clay', new THREE.TorusGeometry(0.1, 0.022, 6, 16, PI * 1.5), { p: [xc, FAS.y0 + 0.3, 0.225], r: [0, 0, PI * 0.75], c: TRIM });
      K.add('clay', new THREE.TorusGeometry(0.07, 0.02, 6, 14, PI * 1.5), { p: [xc, FAS.y1 - 0.25, 0.225], r: [0, 0, -PI * 0.25], c: TRIM });
      bar([xc, FAS.y0 + 0.36, 0.228], [xc, FAS.y1 - 0.3, 0.228], 0.03, TRIM, { d: 0.01 });
    }
    // door posts (sage)
    for (const sx of [-1, 1]) blk(sx * DOOR.hw + (sx > 0 ? 0 : -0.3), sx * DOOR.hw + (sx > 0 ? 0.3 : 0), 0, FAS.y0, 0, 0.1, SAGE, { ao: 0.2 });
    // fascia board (sage, a touch deeper so the ivory sign pops) with an ivory bead around the side panels
    blk(-FAS.x, FAS.x, FAS.y0, FAS.y1, 0, 0.06, J.fascia, { ao: 0.08 });
    small(true);
    for (const sx of [-1, 1]) {
      const xa = sx * (SW / 2 + 0.16), xb = sx * (FAS.x - 0.1), x0 = Math.min(xa, xb), x1 = Math.max(xa, xb);
      bar([x0, FAS.y0 + 0.1, 0.065], [x1, FAS.y0 + 0.1, 0.065], 0.025, TRIM, { d: 0.012 });
      bar([x0, FAS.y1 - 0.1, 0.065], [x1, FAS.y1 - 0.1, 0.065], 0.025, TRIM, { d: 0.012 });
      bar([x0, FAS.y0 + 0.1, 0.065], [x0, FAS.y1 - 0.1, 0.065], 0.025, TRIM, { d: 0.012 });
      bar([x1, FAS.y0 + 0.1, 0.065], [x1, FAS.y1 - 0.1, 0.065], 0.025, TRIM, { d: 0.012 });
      // hand-painted pictogram in the panel: an open book (left), a teacup (right)
      const pw = 0.62, ph = 0.31, pcx = sx * ((SW / 2 + 0.16 + FAS.x - 0.1) / 2);
      const pg = new THREE.PlaneGeometry(pw * 1.55, ph * 1.55); const u = pg.attributes.uv; for (let i = 0; i < u.count; i++) u.setX(i, (sx > 0 ? 0.5 : 0) + u.getX(i) * 0.5);
      pg.translate(pcx, (FAS.y0 + FAS.y1) / 2, 0.064); batch.push(M.icons, pg, { cast: false });
    }
    // the sign: a soft matte rose-gold bead, then the ivory face (T.signFace: ivory board, rose double frame, logo)
    K.add('metal', rb(SW + 0.07, SH + 0.07, 0.03, 0.02), { p: [0, SIGN.y, 0.044], c: C.rose });
    const face = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), P.mat('signFace'));
    face.position.copy(SIGN); face.name = 'signFace';
    face.castShadow = false; face.receiveShadow = false; face.renderOrder = 2;
    face.layers.set(1);                 // pristine layer: drawn on top of the watercolour, never painted
    group.add(face);
    small(false);
    // shop cornice (cream, two steps) over the fascia, wrapping the corners
    blk(-HW - 0.1, HW + 0.1, FAS.y1, FAS.y1 + 0.1, -0.02, 0.27, TRIM, { ao: 0.15 });
    blk(-HW - 0.14, HW + 0.14, FAS.y1 + 0.1, CORN, -0.02, 0.31, '#F6EBDC', { ao: 0.1 });
    blk(-HW - 0.04, HW + 0.04, FAS.y1 - 0.06, FAS.y1, -0.02, 0.11, J.deep);
    small(false);
  }

  /* ================================================================== DOOR: transom, garland, linings, open leaves */
  small(true);
  {
    const yH = DOOR.h;
    // door head: sage rail + a glowing fanlight with three bars (all above y 2.5)
    blk(-DOOR.hw, DOOR.hw, yH, yH + 0.06, -0.02, 0.08, SAGE);
    { const g = new THREE.PlaneGeometry(DOOR.hw * 2, FAS.y0 - yH - 0.06); g.translate(0, (yH + 0.06 + FAS.y0) / 2, -0.1); batch.push(M.pane, g, { cast: false }); }
    for (const x of [-0.35, 0, 0.35]) bar([x, yH + 0.06, -0.08], [x, FAS.y0, -0.08], 0.03, SAGE, { d: 0.04 });
    halo(0, 2.68, 0.56, 1.5, 0.4, 0.28);
    // reveal linings (outside the clear opening |x| < 0.7)
    for (const sx of [-1, 1]) blk(sx > 0 ? DOOR.hw : -DOOR.hw - 0.025, sx > 0 ? DOOR.hw + 0.025 : -DOOR.hw, 0, yH, -WT, 0, SAGE);
    blk(-DOOR.hw - 0.025, DOOR.hw + 0.025, yH, yH + 0.025, -WT, 0, SAGE);
    // the double doors, open inward, lying along the inner wall (x ∈ ±[0.72, 1.42], z ≈ −0.42…−0.35)
    for (const sx of [-1, 1]) {
      const cx = sx * 1.07, z = -0.385;
      blk(cx - 0.35, cx + 0.35, 0.01, 2.48, z - 0.025, z + 0.025, SAGE, { ao: 0.15 });
      for (const fz of [-1, 1]) {
        const zz = z + fz * 0.028;
        blk(cx - 0.25, cx + 0.25, 0.22, 0.95, zz - 0.006, zz + 0.006, PALETTE === 'be' ? J.inset : J.deep);
        { const g = new THREE.PlaneGeometry(0.5, 1.1); if (fz < 0) g.rotateY(PI); g.translate(cx, 1.72, zz + fz * 0.004); batch.push(M.pane, g, { cast: false }); }
        for (const y of [1.45, 1.72, 1.99]) bar([cx - 0.25, y, zz + fz * 0.008], [cx + 0.25, y, zz + fz * 0.008], 0.025, SAGE, { d: 0.012 });
        bar([cx, 1.17, zz + fz * 0.008], [cx, 2.27, zz + fz * 0.008], 0.025, SAGE, { d: 0.012 });
        K.add('metal', sph(10, 8), { p: [cx - sx * 0.27, 1.08, zz + fz * 0.03], s: 0.03, c: C.rose });
      }
      for (const y of [0.3, 1.25, 2.2]) K.add('metal', rb(0.025, 0.12, 0.06, 0.008), { p: [sx * 0.725, y, -0.33], c: C.rose });
    }
    // a small dried-flower wreath on the room side of the right leaf (seen when looking back from inside)
    {
      const wx = 1.07, wy = 1.75, wz = -0.44, R = 0.15;
      for (let i = 0; i < 26; i++) {
        const a = i / 26 * TAU, p = V3(wx + Math.cos(a) * R, wy + Math.sin(a) * R, wz - 0.01);
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, PI, a + PI / 2 + (i % 2 ? 0.5 : -0.5)));
        leaves.add(p, q, 0.06, ['#8FA28A', '#A9B9A0', '#7F9A7A'][i % 3]);
      }
      for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + 0.3; blooms.add(V3(wx + Math.cos(a) * R, wy + Math.sin(a) * R, wz - 0.03), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, PI, a)), 0.026, ['#E9B3A6', '#F6E7D8', '#D9A5B5'][i % 3]); }
    }
    // eucalyptus garland over the door (dips to y ≈ 2.56 at the centre, all above the 2.5 m door head)
    {
      const pts = [];
      for (let i = 0; i <= 24; i++) { const t = i / 24, x = -0.98 + t * 1.96; pts.push(V3(x, 2.75 - Math.sin(t * PI) * 0.1, 0.16 + Math.sin(t * PI) * 0.05)); }
      const curve = new THREE.CatmullRomCurve3(pts);
      for (let i = 0; i < 120; i++) {
        const t = (i + rnd() * 0.8) / 120, p = curve.getPointAt(t);
        p.add(V3((rnd() - 0.5) * 0.06, (rnd() - 0.4) * 0.09, (rnd() - 0.2) * 0.07));
        if (Math.abs(p.x) < DOOR.hw + 0.1 && p.y < 2.62) p.y = 2.62 + rnd() * 0.02;
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.3 + rnd() * 0.5, (rnd() - 0.5) * 0.8, rnd() * TAU));
        leaves.add(p, q, 0.045 + rnd() * 0.015, ['#9DB09B', '#B3C2AE', '#8AA28A', '#C1CDB9'][i % 4]);
      }
      for (let i = 0; i < 18; i++) {
        const p = curve.getPointAt(0.04 + i / 18 * 0.92).add(V3((rnd() - 0.5) * 0.05, rnd() * 0.04, 0.05));
        blooms.add(p, new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.2, 0, rnd() * TAU)), 0.032 + rnd() * 0.012, ['#F2C4B8', '#FBF3E6', '#E3A9A0', '#D9B6CF'][i % 4]);
      }
      // ribbon bow at each end
      for (const sx of [-1, 1]) {
        K.add('felt', sph(8, 6), { p: [sx * 0.98, 2.74, 0.18], s: [0.05, 0.035, 0.025], c: C.blush });
        tube([[sx * 0.98, 2.72, 0.19], [sx * 1.0, 2.58, 0.2], [sx * 0.97, 2.45, 0.2]], 0.01, C.blush, { mat: P.mat('felt'), cast: false });
      }
    }
  }

  small(false);
  /* ================================================================== DISPLAY WINDOW (left): a shallow lit bay, cosy & cluttered */
  {
    const { x0, x1, zf } = DISP, xm = (x0 + x1) / 2, L = x1 - x0, yb = DISP.y0, yt = DISP.y1;
    // stallriser with two raised panels, sill, frame posts, mullions, transom, glass
    blk(x0, x1, 0, yb - 0.04, 0, zf, SAGE, { ao: 0.25 });
    for (const k of [-1, 1]) { const px = xm + k * L / 4; blk(px - L / 4 + 0.12, px + L / 4 - 0.12, 0.12, yb - 0.16, zf, zf + 0.02, J.deep); blk(px - L / 4 + 0.16, px + L / 4 - 0.16, 0.16, yb - 0.2, zf + 0.02, zf + 0.03, J.inset); }
    blk(x0 - 0.04, x1 + 0.04, yb - 0.06, yb + 0.01, -0.02, zf + 0.08, TRIM, { ao: 0.2 });
    for (const x of [x0 + 0.04, x1 - 0.04]) { blk(x - 0.045, x + 0.045, yb, yt, zf - 0.09, zf, SAGE); blk(x - 0.04, x + 0.04, yb, yt, 0, 0.08, SAGE); }
    for (const x of [xm - L / 6, xm + L / 6]) bar([x, yb, zf - 0.03], [x, yt, zf - 0.03], 0.05, SAGE, { d: 0.05 });
    bar([x0, 2.14, zf - 0.03], [x1, 2.14, zf - 0.03], 0.05, SAGE, { d: 0.05 });
    for (let k = 1; k < 6; k++) { const x = x0 + k * L / 6; if (Math.abs(x - (xm - L / 6)) > 0.05 && Math.abs(x - (xm + L / 6)) > 0.05) bar([x, 2.14, zf - 0.03], [x, yt, zf - 0.03], 0.028, SAGE, { d: 0.03 }); }
    { const g = new THREE.PlaneGeometry(L - 0.1, yt - yb); g.translate(xm, (yb + yt) / 2, zf - 0.025); batch.push(M.glassSoft, g, { cast: false }); }
    for (const x of [x0 + 0.04, x1 - 0.04]) { const g = new THREE.PlaneGeometry(zf - 0.1, yt - yb); g.rotateY(x < xm ? -PI / 2 : PI / 2); g.translate(x, (yb + yt) / 2, zf / 2); batch.push(M.glassSoft, g, { cast: false }); }
    // bay head: sage board with an ivory bead, a little sloped top
    blk(x0 - 0.05, x1 + 0.05, yt, FAS.y0, -0.02, zf + 0.06, SAGE, { ao: 0.12 });
    bar([x0 - 0.05, yt + 0.02, zf + 0.065], [x1 + 0.05, yt + 0.02, zf + 0.065], 0.025, TRIM, { d: 0.012 });
    clay(rb(L + 0.2, 0.05, zf + 0.12, 0.02), [xm, FAS.y0 + 0.01, zf / 2 + 0.02], '#B7A094', { r: [0.18, 0, 0] });
    small(true);
    // display bed (honey boards) and a warm lit soffit
    blk(x0, x1, yb - 0.08, yb, -WT - 0.02, zf - 0.04, C.honey);
    { const g = new THREE.PlaneGeometry(L, zf + WT); g.rotateX(PI / 2); g.translate(xm, yt - 0.005, (zf - WT) / 2); X.worldUV(g, 1.2); batch.push(roomMat, g, { cast: false, receive: false }); }
    halo(xm, 1.55, zf + 0.05, 3.4, 2.4, 0.2, [1, 0.66, 0.36]);   // amber, saturated enough that the paint keeps it warm (integrator)

    // a dusty-rose café curtain on a little rail behind the goods: a warm backdrop, the shop still shows above it
    bar([x0 + 0.05, 1.42, -0.27], [x1 - 0.05, 1.42, -0.27], 0.018, C.rose, { key: 'metal' });
    { const n = 34, pts = [], idx = [], col = [];
      for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + 0.06 + t * (L - 0.12), z = -0.25 + Math.sin(t * PI * 16) * 0.025; for (const y of [yb + 0.01, 1.4]) { pts.push(x, y, z); const k = 0.9 + 0.1 * Math.sin(t * PI * 16); col.push(0.85 * k, 0.6 * k, 0.55 * k); } }
      for (let i = 0; i < n; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
      X.worldUV(g, 0.3); batch.push(P.mat('linenVC'), g, { cast: false }); }
    // hanging lamp inside the bay
    addProp(P.pendantLamp({ shade: 'dome', hex: '#F1E3D3', cord: 0.25, r: 0.13 }), xm + 0.1, 2.25, 0.02, 0);
    halo(xm + 0.1, 2.2, 0.3, 1.0, 0.9, 0.32);
    // fairy lights: a swag across the top of the window and a string along the moss on the sill
    const bulbs = [];
    for (let i = 0; i <= 22; i++) { const t = i / 22, x = x0 + 0.1 + t * (L - 0.2); bulbs.push([x, 2.42 - Math.abs(Math.sin(t * PI * 3)) * 0.13, zf - 0.12]); }
    for (let i = 0; i <= 26; i++) { const t = i / 26, x = x0 + 0.08 + t * (L - 0.16); bulbs.push([x, yb + 0.05 + Math.sin(t * 19) * 0.015, zf - 0.1 + Math.sin(t * 7) * 0.03]); }
    tube(bulbs.slice(0, 23), 0.004, '#8C7A62', { radial: 3, cast: false });
    bulbs.forEach(([x, y, z], i) => { K.add('glowVC', sph(4, 3), { p: [x, y, z], s: 0.015, c: '#FFF2D8' }); if (i % 3 === 0) halo(x, y, z + 0.03, 0.16, 0.16, 0.45); });
    // moss along the front of the sill
    for (let i = 0; i < 9; i++) { const x = x0 + 0.15 + i * (L - 0.3) / 8; K.add('leaf', X.lumpy(800 + i, 0.18, 7, 10, 6), { p: [x, yb + 0.02, zf - 0.12], s: [0.2, 0.05, 0.08], c: i % 2 ? '#8EA685' : '#9DB38F', ao: 0.3 }); }
    // picture books on little easels and crates (covers: pastel illustrations, no words)
    const coverBook = (x, y, z, w, h, cell, ry = 0, lean = 0.12, col = '#E9DCCB') => {
      const m = X.mat4([x, y, z], [-lean, ry, 0]);
      const b = rb(w, h, 0.03, 0.006).clone(); b.translate(0, h / 2, 0); b.applyMatrix4(m); X.paintGeo(b, col); batch.push(M.clay, b);
      const f = new THREE.PlaneGeometry(w * 0.96, h * 0.96); const u = f.attributes.uv;
      for (let i = 0; i < u.count; i++) u.setXY(i, ((cell % 4) + u.getX(i)) / 4, 1 - (Math.floor(cell / 4) + 1 - u.getY(i)) / 2);
      f.translate(0, h / 2, 0.016); f.applyMatrix4(m); batch.push(M.covers, f, { cast: false });
    };
    const miniEasel = (x, y, z, h, ry) => {
      const m = X.mat4([x, y, z], [0, ry, 0]), at = (p) => V3(p[0], p[1], p[2]).applyMatrix4(m).toArray();
      for (const sx of [-1, 1]) rod(at([sx * 0.11, 0, 0.05]), at([sx * 0.04, h, -0.02]), 0.01, 0.009, C.honey);
      rod(at([0, 0, -0.14]), at([0, h * 0.9, -0.02]), 0.009, 0.008, C.honey);
      K.add('clay', rb(0.3, 0.02, 0.05, 0.008), { p: at([0, h * 0.28, 0.05]), r: [0, ry, 0], c: C.honey });
    };
    miniEasel(x0 + 0.42, yb, 0.22, 0.6, 0.25); coverBook(x0 + 0.42, yb + 0.18, 0.27, 0.34, 0.36, 0, 0.25);
    miniEasel(x1 - 0.42, yb, 0.2, 0.62, -0.3); coverBook(x1 - 0.42, yb + 0.19, 0.25, 0.34, 0.36, 3, -0.3);
    // a crate on its side full of books, a face-out book leaning on top
    { const cx0 = xm - 0.56, cx1 = xm - 0.04, cy1 = yb + 0.36, cz0 = -0.2, cz1 = 0.12;
      blk(cx0, cx1, yb, yb + 0.03, cz0, cz1, C.honeyD); blk(cx0, cx1, cy1 - 0.03, cy1, cz0, cz1, C.honeyD);
      blk(cx0, cx0 + 0.03, yb, cy1, cz0, cz1, C.honeyD); blk(cx1 - 0.03, cx1, yb, cy1, cz0, cz1, C.honeyD);
      blk(cx0, cx1, yb, cy1, cz0, cz0 + 0.02, '#9C7B60');
      blk(cx0 + 0.02, cx1 - 0.02, yb + 0.15, yb + 0.2, cz1 - 0.02, cz1, C.honey); }
    { const row = P.bookRow(8, 0.46, { h: 0.28, d: 0.16, seed: 31 }); row.position.set(xm - 0.3, yb + 0.03, -0.06); row.updateMatrix(); group.add(row); }
    coverBook(x0 + 0.62, yb, -0.19, 0.28, 0.3, 1, 0.1, 0.2); coverBook(x1 - 0.59, yb, -0.2, 0.25, 0.27, 7, -0.12, 0.2);
    coverBook(xm - 0.3, yb + 0.34, -0.05, 0.3, 0.3, 6, 0.05, 0.15);
    // a stepped riser with the crochet cats (ginger on top, white below; no tuxedo cat in the window)
    blk(xm + 0.02, xm + 0.6, yb, yb + 0.22, -0.18, 0.22, '#F1D9CF', { ao: 0.25 });
    blk(xm + 0.08, xm + 0.54, yb + 0.22, yb + 0.4, -0.18, 0.06, '#DCE3D2', { ao: 0.25 });
    addProp(P.crochetCat({ body: '#E3A673', belly: '#F7EADA', stripes: '#C98557', muzzle: '#F7EADA', size: 0.3 }), xm + 0.31, yb + 0.4, -0.06, 0.15);
    addProp(P.crochetCat({ body: '#F7F1E8', belly: '#FFFFFF', ears: '#EFC5B9', size: 0.24 }), xm + 0.2, yb + 0.22, 0.13, -0.2);
    // a little red-braid doll, yarn basket, parcels with twine, stacks of books lying flat
    addProp(P.crochetDoll({ skin: '#F4DCC9', hair: '#C9724E', hairStyle: 'braids', dress: '#A9BCA0', pinafore: '#FBF6EE', hat: 'straw', ribbon: '#EFC5B9', size: 0.3 }), x0 + 0.85, yb, 0.3, 0.3);
    basket(x1 - 0.95, yb, 0.33, 0.13, 0.1, ['#EFC5B9', '#A9BCA0', '#F3DCC9']);
    yarn(x1 - 0.72, yb, 0.4, 0.05, '#C9B6D8');
    addProp(P.parcel({ w: 0.24, h: 0.12, d: 0.18 }), x1 - 0.32, yb, -0.1, 0.3); addProp(P.parcel({ w: 0.18, h: 0.1, d: 0.14 }), x1 - 0.3, yb + 0.12, -0.1, -0.2);
    addProp(P.parcel({ w: 0.2, h: 0.1, d: 0.16 }), x0 + 0.3, yb, -0.1, -0.3);
    for (let i = 0; i < 3; i++) {
      const y = yb + 0.02 + i * 0.04;
      blk(xm - 0.82, xm - 0.56, y - 0.02, y + 0.02, 0.18, 0.38, ['#A9BCA0', '#EFC5B9', '#E9DCCB'][i], { r: [0, 0.2 - i * 0.12, 0] });
    }
    // felt stars hanging on threads from the bay head (pictograms, soft)
    for (const [x, y, c] of [[x0 + 0.3, 2.2, '#F3D88C'], [xm - 0.45, 2.28, '#FBF6EE'], [xm + 0.62, 2.2, '#F3D88C'], [x1 - 0.25, 2.3, '#EFC5B9']]) {
      bar([x, y + 0.06, 0.25], [x, yt, 0.25], 0.004, '#B7A088');
      const s = new THREE.Shape(); for (let k = 0; k < 10; k++) { const a = PI / 2 + k * PI / 5, r = k % 2 ? 0.028 : 0.065; k ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
      const sg = new THREE.ExtrudeGeometry(s, { depth: 0.015, bevelEnabled: false }); sg.translate(0, 0, -0.008);
      K.add('felt', sg, { p: [x, y, 0.25], c });
    }
  }

  small(false);
  /* ================================================================== CAFÉ WINDOW (right): counter ledge, transom, awning */
  {
    const { x0, x1 } = CAFE, xm = (x0 + x1) / 2, L = x1 - x0;
    // stallriser with two panels, oat ledge on corbels, sage linings
    blk(x0 - 0.03, x1 + 0.03, 0, CAFE.y0 - 0.05, 0, 0.08, SAGE, { ao: 0.25 });
    for (const k of [-1, 1]) { const px = xm + k * L / 4; blk(px - L / 4 + 0.1, px + L / 4 - 0.1, 0.12, CAFE.y0 - 0.17, 0.08, 0.1, J.deep); blk(px - L / 4 + 0.14, px + L / 4 - 0.14, 0.16, CAFE.y0 - 0.21, 0.1, 0.11, J.inset); }
    blk(x0 - 0.05, x1 + 0.05, CAFE.y0 - 0.06, CAFE.y0, -WT - 0.02, 0.38, C.honey, { ao: 0.15 });
    for (const x of [x0 + 0.3, xm, x1 - 0.3]) blk(x - 0.05, x + 0.05, CAFE.y0 - 0.22, CAFE.y0 - 0.06, 0.05, 0.3, TRIM, { ao: 0.2 });
    for (const x of [x0, x1]) blk(x - (x === x0 ? 0 : 0.03), x + (x === x0 ? 0.03 : 0), CAFE.y0, CAFE.y1, -WT, 0.02, SAGE);
    blk(x0, x1, CAFE.y1 - 0.03, CAFE.y1, -WT, 0.02, SAGE);
    // transom: small glowing panes over the open hatch
    bar([x0, 2.12, -0.06], [x1, 2.12, -0.06], 0.05, SAGE, { d: 0.08 });
    { const g = new THREE.PlaneGeometry(L, CAFE.y1 - 2.15); g.translate(xm, (2.15 + CAFE.y1) / 2, -0.09); batch.push(M.pane, g, { cast: false }); }
    for (let k = 1; k < 6; k++) { const x = x0 + k * L / 6; bar([x, 2.14, -0.07], [x, CAFE.y1, -0.07], 0.026, SAGE, { d: 0.03 }); }
    halo(xm, 1.75, 0.15, 3.2, 1.8, 0.18, [1, 0.68, 0.38]);
    small(true);
    // on the ledge: pastry dome, cups, teapot, herb pots, a little bell
    cakeDome(xm + 0.2, CAFE.y0, 0.1, 1.1);
    cup(x0 + 0.62, CAFE.y0, 0.2, '#F7EFE4', 1.25, 0.4); cup(x0 + 0.85, CAFE.y0, 0.14, '#F3DCD3', 1.25, -0.3);
    addProp(P.teapot({ band: '#A9BCA0' }), x1 - 0.7, CAFE.y0, 0.12, -0.5, 1.25);
    // the owner's herbs on the ledge: sage, rosemary, thyme (terracotta, one cream glazed)
    plant('sage', x0 + 0.24, CAFE.y0, 0.16, 0.5, 31, { potR: 0.15, potH: 0.22 }); plant('rosemary', x1 - 0.32, CAFE.y0, 0.16, 0.48, 33, { potR: 0.14, potH: 0.22, paint: '#F4EADB' }); plant('thyme', x1 - 0.13, CAFE.y0, 0.1, 0.42, 35, { potR: 0.14, potH: 0.2 });
    K.add('metal', new THREE.SphereGeometry(1, 12, 6, 0, TAU, 0, PI / 2), { p: [xm - 0.45, CAFE.y0 + 0.005, 0.28], s: [0.045, 0.04, 0.045], c: C.rose });

    small(false);
    // striped scalloped awning (cream / blush): top y 2.72 at the wall, front y 2.3 at z 1.1
    const aw = { x0: x0 - 0.08, x1: x1 + 0.08, yTop: 2.72, zTop: 0.04, yF: 2.3, zF: 1.1 };
    const stripe = (aw.x1 - aw.x0) / 3.5;
    {
      const rows = 5, pos = [], uv = [], idx = [];
      let s = 0, prev = null;
      for (let i = 0; i <= rows; i++) {
        const t = i / rows, z = aw.zTop + (aw.zF - aw.zTop) * t, y = aw.yTop + (aw.yF - aw.yTop) * t + Math.sin(t * PI) * 0.05;
        if (prev) s += Math.hypot(z - prev[0], y - prev[1]); prev = [z, y];
        for (const x of [aw.x0, aw.x1]) { pos.push(x, y, z); uv.push((x - aw.x0) / stripe, s / stripe); }
      }
      for (let i = 0; i < rows; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
      batch.push(M.awning, g);
      // valance with scallops (one per stripe)
      const n = Math.round((aw.x1 - aw.x0) / stripe * 2), w = (aw.x1 - aw.x0) / n, vs = new THREE.Shape();
      vs.moveTo(aw.x0, 0); vs.lineTo(aw.x1, 0);
      for (let k = n - 1; k >= 0; k--) { const x = aw.x0 + k * w; vs.lineTo(x + w, -0.1); vs.absarc(x + w / 2, -0.1, w / 2, 0, -PI, true); }
      vs.lineTo(aw.x0, 0);
      const vg = new THREE.ShapeGeometry(vs, 6);
      { const p = vg.attributes.position, u = new Float32Array(p.count * 2); for (let i = 0; i < p.count; i++) { u[i * 2] = (p.getX(i) - aw.x0) / stripe; u[i * 2 + 1] = p.getY(i) / stripe; } vg.setAttribute('uv', new THREE.BufferAttribute(u, 2)); }
      vg.translate(0, aw.yF + 0.005, aw.zF + 0.004);
      batch.push(M.awning, vg);
      for (const x of [aw.x0, aw.x1]) {
        const cg = new THREE.BufferGeometry();
        cg.setAttribute('position', new THREE.Float32BufferAttribute([x, aw.yTop, aw.zTop, x, aw.yF, aw.zF, x, aw.yF - 0.16, aw.zF - 0.04, x, aw.yTop - 0.3, aw.zTop + 0.04], 3));
        cg.setAttribute('uv', new THREE.Float32BufferAttribute([0.02, 0, 0.02, 0.5, 0.06, 0.5, 0.06, 0], 2));
        cg.setIndex([0, 1, 2, 0, 2, 3]); cg.computeVertexNormals(); batch.push(M.awning, cg);
      }
      blk(aw.x0 - 0.04, aw.x1 + 0.04, aw.yTop - 0.04, aw.yTop + 0.06, -0.01, 0.12, C.blush, { ao: 0.15 });
      bar([aw.x0, aw.yF + 0.01, aw.zF], [aw.x1, aw.yF + 0.01, aw.zF], 0.026, C.rose, { key: 'metal' });
      for (const x of [aw.x0 + 0.35, aw.x1 - 0.35]) bar([x, 2.0, 0.03], [x, aw.yF, aw.zF - 0.02], 0.02, C.rose, { key: 'metal' });
    }
    small(true);
    // the wall lantern (right door post) — dark warm frame, glowing glass
    {
      const lx = 0.85, ly = 1.92, lz = 0.3;
      bar([lx, ly + 0.36, 0.1], [lx, ly + 0.36, lz], 0.02, J.lantern);
      K.add('clay', new THREE.TorusGeometry(0.06, 0.01, 4, 10, PI), { p: [lx, ly + 0.3, 0.16], r: [0, PI / 2, 0], c: J.lantern });
      for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + PI / 4; bar([lx + Math.cos(a) * 0.075, ly, lz + Math.sin(a) * 0.075], [lx + Math.cos(a) * 0.075, ly + 0.24, lz + Math.sin(a) * 0.075], 0.014, J.lantern); }
      K.add('glowVC', new THREE.CylinderGeometry(0.068, 0.06, 0.22, 4), { p: [lx, ly + 0.12, lz], r: [0, PI / 4, 0], c: '#FFEFD6' });
      K.add('clay', new THREE.ConeGeometry(0.12, 0.1, 4), { p: [lx, ly + 0.29, lz], r: [0, PI / 4, 0], c: J.lantern });
      K.add('clay', cyl(8), { p: [lx, ly - 0.01, lz], s: [0.09, 0.025, 0.09], c: J.lantern });
      K.add('metal', sph(8, 6), { p: [lx, ly + 0.36, lz], s: 0.022, c: C.rose });
      halo(lx, ly + 0.12, 0.52, 0.9, 0.9, 0.85);
    }
  }

  small(true);
  /* ================================================================== FLOOR 2: dormer windows, heart shutters, flower boxes, balcony */
  {
    for (const d of DORM) {
      if (d.kind !== 'win') continue;
      const c = d.c, x0 = c - WIN2.hw, x1 = c + WIN2.hw, ym = (WIN2.y0 + WIN2.y1) / 2, zG = -0.12;
      // ivory casing, head, small casement panes (2 × 3)
      for (const sx of [-1, 1]) blk(c + sx * WIN2.hw - 0.06, c + sx * WIN2.hw + 0.06, WIN2.y0 - 0.02, WIN2.y1 + 0.04, -0.02, 0.07, TRIM, { ao: 0.1 });
      blk(x0 - 0.12, x1 + 0.12, WIN2.y1 + 0.02, WIN2.y1 + 0.14, -0.02, 0.09, TRIM);
      for (const sx of [-1, 1]) blk(c + sx * (WIN2.hw - 0.02) - 0.02, c + sx * (WIN2.hw - 0.02) + 0.02, WIN2.y0, WIN2.y1, -WT, 0, TRIM);
      bar([c, WIN2.y0, zG], [c, WIN2.y1, zG], 0.045, TRIM, { d: 0.05 });
      for (const y of [WIN2.y0 + (WIN2.y1 - WIN2.y0) / 3, WIN2.y0 + (WIN2.y1 - WIN2.y0) * 2 / 3]) bar([x0, y, zG], [x1, y, zG], 0.03, TRIM, { d: 0.03 });
      bar([x0, WIN2.y0 + 0.03, zG], [x1, WIN2.y0 + 0.03, zG], 0.05, TRIM, { d: 0.05 });
      { const g = new THREE.PlaneGeometry(WIN2.hw * 2, WIN2.y1 - WIN2.y0); g.translate(c, ym, zG + 0.03); batch.push(M.glassSoft, g, { cast: false }); }
      halo(c, ym, 0.05, 1.5, 1.8, 0.06);
      // blush shutters with a little heart cut-out, rose-gold holdbacks
      for (const sx of [-1, 1]) {
        const xs = c + sx * (WIN2.hw + 0.27);
        blk(xs - 0.2, xs + 0.2, WIN2.y0 - 0.01, WIN2.y1 + 0.01, 0.0, 0.05, C.shutter, { ao: 0.15 });
        for (const y of [WIN2.y0 + 0.28, WIN2.y1 - 0.28]) blk(xs - 0.17, xs + 0.17, y - 0.025, y + 0.025, 0.05, 0.062, '#E2A797');
        const hs = new THREE.Shape(), s = 0.06; hs.moveTo(0, -s * 0.9); hs.bezierCurveTo(-s * 1.4, s * 0.1, -s * 0.7, s * 1.1, 0, s * 0.35); hs.bezierCurveTo(s * 0.7, s * 1.1, s * 1.4, s * 0.1, 0, -s * 0.9);
        K.add('clay', new THREE.ShapeGeometry(hs, 6), { p: [xs, ym + 0.05, 0.052], c: '#9D6F64' });
        K.add('metal', new THREE.TorusGeometry(0.028, 0.007, 4, 10, PI * 1.3), { p: [xs + sx * 0.24, ym - 0.4, 0.04], r: [0, 0, sx > 0 ? -0.6 : PI - 0.6], c: C.rose });
      }
      // stone sill + sage flower box with blossoms and trailing ivy
      blk(x0 - 0.16, x1 + 0.16, WIN2.y0 - 0.07, WIN2.y0, -0.05, 0.16, '#F1E6D7', { ao: 0.2 });
      blk(x0 - 0.12, x1 + 0.12, WIN2.y0 - 0.3, WIN2.y0 - 0.08, 0.0, 0.26, J.box, { ao: 0.3 });
      bar([x0 - 0.12, WIN2.y0 - 0.13, 0.265], [x1 + 0.12, WIN2.y0 - 0.13, 0.265], 0.02, TRIM, { d: 0.008 });
      K.add('leaf', X.lumpy(40 + (c * 3 | 0), 0.15, 8, 16, 8), { p: [c, WIN2.y0 - 0.05, 0.13], s: [WIN2.hw + 0.1, 0.11, 0.13], c: '#86A07E', ao: 0.4 });
      X.sprinkle(leaves, [c, WIN2.y0 - 0.04, 0.14], [WIN2.hw + 0.12, 0.11, 0.15], 26, { seed: 50 + (c * 10 | 0), size: 0.06, yMin: -0.1 });
      for (let k = 0; k < 22; k++) {
        const x = x0 - 0.06 + (k / 21) * (WIN2.hw * 2 + 0.12) + (rnd() - 0.5) * 0.04, y = WIN2.y0 - 0.02 + rnd() * 0.08, z = 0.12 + rnd() * 0.14;
        blooms.add(V3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4 - rnd() * 0.5, (rnd() - 0.5) * 0.6, rnd() * TAU)), 0.04 + rnd() * 0.018, ['#F1BFB2', '#FBF6EE', '#C9B6D8', '#EBA79C', '#F6D9C6'][k % 5]);
      }
      for (const sx of [-1, 1]) X.vine(batch, leaves, blooms, [[c + sx * 0.32, WIN2.y0 - 0.12, 0.26], [c + sx * 0.38, WIN2.y0 - 0.3, 0.28], [c + sx * 0.34, WIN2.y0 - 0.45, 0.27]], { leaf: 0.055, density: 1.4, seed: 70 + sx + (c * 3 | 0), spread: 0.6 });
    }
    // centre: arched French door, a tiny Juliet balcony on the shop cornice, pots and climbing vines
    {
      const zG = -0.12;
      for (const sx of [-1, 1]) blk(sx * FD.hw - 0.06 * (sx > 0 ? 0 : 1) + (sx > 0 ? 0 : 0), sx * FD.hw + (sx > 0 ? 0.06 : 0), FD.y0, FD.ys, -0.02, 0.07, TRIM);
      K.add('clay', new THREE.TorusGeometry(FD.hw + 0.03, 0.035, 6, 20, PI), { p: [0, FD.ys, 0.03], c: TRIM });
      clay(rb(0.14, 0.18, 0.1, 0.02), [0, FD.ys + FD.hw + 0.06, 0.05], '#F3E5D6', { ao: 0.2 });
      { const s = new THREE.Shape(); s.moveTo(-FD.hw, FD.y0); s.lineTo(FD.hw, FD.y0); s.lineTo(FD.hw, FD.ys); s.absarc(0, FD.ys, FD.hw, 0, PI, false); s.lineTo(-FD.hw, FD.y0);
        const g = new THREE.ShapeGeometry(s, 12); g.translate(0, 0, zG + 0.03); batch.push(M.glassSoft, g, { cast: false }); }
      bar([0, FD.y0, zG], [0, FD.ys + FD.hw, zG], 0.045, TRIM, { d: 0.05 });
      for (let k = 1; k <= 3; k++) { const y = FD.y0 + (FD.ys - FD.y0) * k / 4; bar([-FD.hw, y, zG], [FD.hw, y, zG], 0.026, TRIM, { d: 0.03 }); }
      for (let k = 1; k < 4; k++) { const a = k / 4 * PI; bar([0, FD.ys, zG], [Math.cos(a) * FD.hw, FD.ys + Math.sin(a) * FD.hw, zG], 0.022, TRIM, { d: 0.03 }); }
      bar([-FD.hw, FD.ys, zG], [FD.hw, FD.ys, zG], 0.04, TRIM, { d: 0.05 });
      halo(0, 5.3, 0.05, 1.4, 2.0, 0.06);
      // balcony: ivory floor on the cornice, matte rose-gold railing with bellied balusters
      const by = CORN, bz = 0.42, bw = 0.62;
      blk(-bw - 0.06, bw + 0.06, by - 0.02, by + 0.05, -0.02, bz + 0.04, TRIM, { ao: 0.15 });
      bar([-bw, by + 0.62, bz], [bw, by + 0.62, bz], 0.03, C.rose, { key: 'metal' });
      for (const sx of [-1, 1]) bar([sx * bw, by + 0.62, bz], [sx * bw, by + 0.62, 0.02], 0.03, C.rose, { key: 'metal' });
      for (let k = 0; k <= 8; k++) { const x = -bw + k * bw * 2 / 8; K.add('metal', new THREE.CylinderGeometry(0.009, 0.009, 0.58, 5), { p: [x, by + 0.33, bz], c: C.rose }); K.add('metal', sph(6, 4), { p: [x, by + 0.3, bz], s: [0.018, 0.045, 0.018], c: C.rose }); }
      for (const sx of [-1, 1]) for (let k = 1; k <= 2; k++) K.add('metal', new THREE.CylinderGeometry(0.009, 0.009, 0.58, 5), { p: [sx * bw, by + 0.33, bz - k * 0.13], c: C.rose });
      // the owner's balcony herbs: an upright rosemary, a trailing thyme, a tanacetum covered in little daisies
      plant('rosemary', -0.44, by + 0.05, 0.22, 0.62, 41); plant('thyme', -0.08, by + 0.05, 0.3, 0.42, 42, { paint: '#EFC5B9' }); plant('tanacetum', 0.44, by + 0.05, 0.22, 0.62, 43, { paint: '#F4EADB' });
      X.vine(batch, leaves, blooms, [[-0.5, by + 0.15, 0.12], [-0.56, 4.9, 0.1], [-0.52, 5.6, 0.1], [-0.38, 6.05, 0.11], [-0.12, 6.2, 0.12], [0.06, 6.2, 0.12]], { leaf: 0.075, density: 1.1, flowers: 0.16, seed: 91 });
      X.vine(batch, leaves, blooms, [[0.5, by + 0.15, 0.12], [0.55, 4.85, 0.1], [0.5, 5.5, 0.1], [0.36, 5.95, 0.11]], { leaf: 0.075, density: 1.1, flowers: 0.16, seed: 93 });
    }
  }

  /* ================================================================== FLOOR-2 DIORAMAS (seen through the dormer windows) */
  {
    const room = (x0, x1, y1) => {
      const z0 = -1.0, z1 = -WT - 0.01, y0 = 4.15;
      const parts = [];
      const back = new THREE.PlaneGeometry(x1 - x0, y1 - y0); back.translate((x0 + x1) / 2, (y0 + y1) / 2, z0); parts.push(back);
      const l = new THREE.PlaneGeometry(z1 - z0, y1 - y0); l.rotateY(PI / 2); l.translate(x0, (y0 + y1) / 2, (z0 + z1) / 2); parts.push(l);
      const r = new THREE.PlaneGeometry(z1 - z0, y1 - y0); r.rotateY(-PI / 2); r.translate(x1, (y0 + y1) / 2, (z0 + z1) / 2); parts.push(r);
      const c = new THREE.PlaneGeometry(x1 - x0, z1 - z0); c.rotateX(PI / 2); c.translate((x0 + x1) / 2, y1, (z0 + z1) / 2); parts.push(c);
      for (const g of parts) { X.worldUV(g, 1.0); batch.push(roomMat, g, { cast: false }); }
      const f = new THREE.PlaneGeometry(x1 - x0, z1 - z0); f.rotateX(-PI / 2); f.translate((x0 + x1) / 2, y0, (z0 + z1) / 2);
      X.paintGeo(f, '#D9BE9C'); batch.push(M.clay, f, { cast: false });
      clay(rb(x1 - x0, 0.1, 0.02, 0.005), [(x0 + x1) / 2, y0 + 0.05, z0 + 0.01], TRIM);
    };
    room(-3.32, -1.68, 5.98); room(1.68, 3.32, 5.98); room(-0.56, 0.56, 6.1);
    const Z = -0.99;
    // --- Merlin's workroom (left): desk + lamp glow, drawings pinned to a board, yarn basket (Merlin is never drawn)
    blk(-3.15, -1.95, 4.92, 4.97, -0.9, -0.5, C.honey, { ao: 0.15 });
    for (const x of [-3.1, -2.0]) blk(x - 0.02, x + 0.02, 4.15, 4.92, -0.88, -0.84, C.honeyD);
    blk(-3.1, -2.05, 5.12, 5.84, Z, Z + 0.025, '#E8D9C2', { ao: 0.1 });
    for (const [x, y, rz, w, h] of [[-2.86, 5.5, 0.08, 0.28, 0.36], [-2.5, 5.55, -0.07, 0.26, 0.32], [-2.25, 5.32, 0.1, 0.22, 0.26], [-2.7, 5.24, -0.05, 0.24, 0.18]]) {
      const g = new THREE.PlaneGeometry(w, h); g.applyMatrix4(X.mat4([x, y, Z + 0.035], [0, 0, rz])); batch.push(P.mat('paper'), g, { cast: false });
      K.add('metal', sph(6, 4), { p: [x - Math.sin(rz) * h * 0.42, y + Math.cos(rz) * h * 0.42, Z + 0.04], s: [0.012, 0.012, 0.006], c: C.rose });
    }
    { const lx = -2.15, ly = 4.97, lz = -0.62;
      K.add('metal', cyl(12), { p: [lx, ly + 0.012, lz], s: [0.07, 0.025, 0.07], c: C.rose });
      tube([[lx, ly, lz], [lx - 0.02, ly + 0.22, lz], [lx - 0.1, ly + 0.36, lz + 0.04], [lx - 0.2, ly + 0.38, lz + 0.08]], 0.011, C.rose, { mat: MM.metal });
      K.add('metal', new THREE.ConeGeometry(0.09, 0.12, 12, 1, true), { p: [lx - 0.24, ly + 0.36, lz + 0.1], r: [0.2, 0, 0.5], c: C.rose });
      K.add('glowVC', sph(8, 6), { p: [lx - 0.26, ly + 0.32, lz + 0.11], s: 0.03, c: '#FFF4E6' });
      halo(lx - 0.25, ly + 0.3, -0.35, 0.8, 0.8, 0.28); }
    yarn(-2.7, 4.97, -0.62, 0.065, '#EFC5B9'); yarn(-2.58, 4.97, -0.72, 0.05, '#A9BCA0');
    basket(-2.95, 4.15, -0.55, 0.17, 0.15, ['#C9B6D8', '#EFC5B9', '#E8C9A0']);
    halo(-2.5, 5.6, -0.5, 1.2, 1.0, 0.08);
    // a yarn ball on the outer sill of the workroom window, its strand falling into the flower box
    yarn(-2.5 + 0.22, WIN2.y0, 0.08, 0.06, '#EFC5B9');
    tube([[-2.28, WIN2.y0 + 0.02, 0.13], [-2.27, WIN2.y0 - 0.04, 0.22], [-2.32, WIN2.y0 - 0.16, 0.27]], 0.004, '#E9B3A6', { cast: false });
    // --- pet-sitting corner (right): dog bed, ball, bowl, framed paw-print pictogram, a leash on a hook
    blk(1.95, 3.05, 4.15, 4.62, -0.85, -0.4, C.oat, { ao: 0.2 });
    K.add('linenVC', new THREE.TorusGeometry(0.22, 0.075, 8, 20), { p: [2.55, 4.7, -0.6], r: [PI / 2, 0, 0], c: '#EFC5B9', ao: 0.25 });
    K.add('linenVC', cyl(16), { p: [2.55, 4.665, -0.6], s: [0.23, 0.045, 0.23], c: '#FBF6EE' });
    K.add('felt', sph(10, 8), { p: [2.66, 4.73, -0.55], s: 0.05, c: C.sage });
    K.add('felt', sph(10, 8), { p: [2.12, 4.67, -0.5], s: 0.045, c: '#E8A9A0' });
    K.add('satin', new THREE.CylinderGeometry(0.09, 0.07, 0.05, 14), { p: [2.95, 4.645, -0.55], c: '#F4EADB', ao: 0.3 }); K.add('satin', new THREE.TorusGeometry(0.09, 0.011, 4, 14), { p: [2.95, 4.67, -0.55], r: [PI / 2, 0, 0], c: C.blush });
    blk(2.12, 2.6, 5.15, 5.71, Z, Z + 0.025, C.rose, { key: 'metal' });
    blk(2.16, 2.56, 5.19, 5.67, Z + 0.025, Z + 0.032, '#FFFBF4');
    K.add('felt', sph(12, 8), { p: [2.36, 5.37, Z + 0.04], s: [0.07, 0.056, 0.008], c: '#B88A7A' });
    for (const [dx, dy] of [[-0.08, 0.065], [-0.028, 0.108], [0.028, 0.108], [0.08, 0.065]]) K.add('felt', sph(8, 6), { p: [2.36 + dx, 5.37 + dy, Z + 0.04], s: [0.024, 0.03, 0.008], c: '#B88A7A' });
    K.add('metal', new THREE.TorusGeometry(0.028, 0.008, 4, 10, PI), { p: [2.9, 5.6, Z + 0.04], r: [0, 0, PI], c: C.rose });
    tube([[2.9, 5.57, Z + 0.05], [2.83, 5.32, Z + 0.07], [2.9, 5.1, Z + 0.08], [2.97, 5.32, Z + 0.07], [2.9, 5.57, Z + 0.05]], 0.011, '#C9937E', { cast: false });
    halo(2.5, 5.6, -0.5, 1.2, 1.0, 0.08);
    // --- centre landing: a fern on a stand under a paper lantern
    blk(-0.16, 0.16, 4.15, 4.75, -0.82, -0.5, C.oat);
    addProp(P.plant('fern', 0.5, { pot: 'cream', seed: 12 }), 0, 4.75, -0.66, 0);
    { const g = new THREE.SphereGeometry(0.1, 12, 8); g.scale(1, 1.25, 1); g.translate(0, 5.82, -0.7); batch.push(P.mat('lantern'), g, { cast: false }); }
    halo(0, 5.8, -0.4, 0.9, 0.9, 0.3);
  }

  /* ================================================================== VINES: up the pilasters, over the cornice, round the door */
  {
    // climbing roses from the big pots at the pilaster feet, up the pilasters, over the consoles, onto the upper wall
    pot(-HW + 0.18, 0, 0.42, 0.22, 0.36, 'rose', 51, { nf: 6 }); pot(HW - 0.18, 0, 0.42, 0.22, 0.36, 'rose', 53, { nf: 6, flowers: ['#FBF6EE', '#F2C4B8', '#EFA9A0'] });
    const rose = ['#EFA9A0', '#F4C8BE', '#FBF6EE', '#E58F88'];
    X.vine(batch, leaves, blooms, [[-HW + 0.2, 0.45, 0.4], [-HW + 0.06, 1.1, 0.19], [-HW + 0.2, 1.9, 0.18], [-HW + 0.05, 2.6, 0.2], [-HW + 0.14, 3.4, 0.26], [-HW + 0.1, 4.3, 0.34], [-HW + 0.24, 4.9, 0.08], [-HW + 0.5, 5.35, 0.06]], { leaf: 0.1, density: 1.0, flowers: 0.22, flowerColors: rose, seed: 13 });
    X.vine(batch, leaves, blooms, [[-HW + 0.12, 4.25, 0.32], [-3.5, 4.32, 0.3], [-3.15, 4.27, 0.3]], { leaf: 0.09, density: 1.2, flowers: 0.2, flowerColors: rose, seed: 15 });
    X.vine(batch, leaves, blooms, [[-HW + 0.05, 2.3, 0.2], [-HW + 0.3, 2.85, 0.24], [-HW + 0.42, 3.2, 0.26]], { leaf: 0.085, density: 1.0, flowers: 0.15, flowerColors: rose, seed: 17 });
    X.vine(batch, leaves, blooms, [[HW - 0.2, 0.45, 0.4], [HW - 0.07, 1.2, 0.19], [HW - 0.2, 2.0, 0.18], [HW - 0.06, 2.75, 0.24], [HW - 0.12, 3.5, 0.26], [HW - 0.1, 4.3, 0.34], [HW - 0.22, 4.85, 0.08], [HW - 0.4, 5.3, 0.06]], { leaf: 0.1, density: 1.0, flowers: 0.18, flowerColors: ['#FBF6EE', '#F2C4B8', '#EFA9A0'], seed: 11 });
    X.vine(batch, leaves, blooms, [[HW - 0.12, 4.25, 0.32], [3.55, 4.3, 0.3], [3.25, 4.26, 0.3]], { leaf: 0.09, density: 1.2, flowers: 0.15, flowerColors: ['#FBF6EE', '#F2C4B8'], seed: 19 });
    // ivy up the left door post, over the garland, a little way down the right post (all clear of the doorway)
    pot(-0.86, 0, 0.17, 0.1, 0.18, 'herb', 61);
    X.vine(batch, leaves, blooms, [[-0.86, 0.2, 0.16], [-0.9, 0.9, 0.14], [-0.84, 1.6, 0.14], [-0.9, 2.3, 0.15], [-0.8, 2.66, 0.2], [-0.4, 2.78, 0.21], [0.05, 2.79, 0.21], [0.5, 2.76, 0.2], [0.86, 2.6, 0.17], [0.9, 2.35, 0.15]], { leaf: 0.075, density: 1.35, flowers: 0.1, flowerColors: ['#FBF6EE', '#F2C4B8'], seed: 31 });
  }

  /* ================================================================== FRONT: bench, chalkboard, door pots, street lamp */
  {
    // a little backless bench under the display window with a gingham cushion, books and a basket
    const bx = -2.78, bz = 0.92, bl = 1.3, sy = 0.44;
    for (const dz of [-0.11, 0, 0.11]) blk(bx - bl / 2, bx + bl / 2, sy - 0.04, sy, bz + dz - 0.05, bz + dz + 0.05, C.honey, { ao: 0.1 });
    for (const sx of [-1, 1]) for (const dz of [-0.13, 0.13]) blk(bx + sx * (bl / 2 - 0.1) - 0.03, bx + sx * (bl / 2 - 0.1) + 0.03, 0, sy - 0.04, bz + dz - 0.03, bz + dz + 0.03, C.honeyD, { ao: 0.25 });
    for (const sx of [-1, 1]) blk(bx + sx * (bl / 2 - 0.1) - 0.03, bx + sx * (bl / 2 - 0.1) + 0.03, 0.12, 0.16, bz - 0.13, bz + 0.13, C.honeyD);
    cushion(0.6, 0.07, 0.34, [bx - 0.28, sy + 0.035, bz]);
    for (let i = 0; i < 3; i++) blk(bx + 0.22, bx + 0.48, sy + i * 0.04, sy + 0.04 + i * 0.04, bz - 0.12, bz + 0.08, ['#EFC5B9', '#C9D5E3', '#A9BCA0'][i], { r: [0, 0.15 - i * 0.2, 0] });
    decals.at(bx, 0.004, bz, bl + 0.4, 0.7, 0.4);
    // chalkboard A-frame with pictograms (cup, croissant, heart)
    {
      const x = 3.95, z = 1.18, ry = -0.38, h = 0.86, w = 0.52;
      for (const s of [1, -1]) {
        const m = X.mat4([x, 0, z], [0, ry + (s < 0 ? PI : 0), 0]).multiply(X.mat4([0, 0, 0.13], [-0.16, 0, 0]));
        const frame = rb(w, h, 0.035, 0.012).clone(); frame.translate(0, h / 2, 0); frame.applyMatrix4(m); X.paintGeo(frame, C.honey); batch.push(M.clay, frame);
        const f = new THREE.PlaneGeometry(w - 0.08, h - 0.1); f.translate(0, h / 2 + 0.01, 0.019); f.applyMatrix4(m); batch.push(M.chalk, f, { cast: false });
      }
      decals.at(x, 0.004, z, 0.8, 0.6, 0.4, ry);
    }
    // pots by the door: a ball topiary (left) and lavender (right)
    // the owner's potted plants (07/11). Porch, left of the door: a blush hydrangea and a sơn trà (sasanqua) standard in
    // an aged-zinc tub; right of the door, in the shaded corner by the café: a monstera and a peony; on the patio past
    // the bistro table: a blue hydrangea and a taller trà mi (japonica). Nothing in the door tunnel, none hides the
    // sign, the cat, the bowl or the guests.
    plant('hydrangea', -1.86, 0, 1.0, 1.0, 71, { potR: 0.18, potH: 0.3, cols: ['#EDB9AC', '#F4D6CB', '#F1C3C0', '#F6E1D9'] });
    plant('sasanqua', -1.43, 0, 0.84, 1.0, 72, { potR: 0.14, potH: 0.24, paint: '#AEB6B2' });
    plant('monstera', 1.3, 0, 0.6, 1.0, 73, { potR: 0.15, potH: 0.3, paint: '#F3E4D8' });
    plant('peony', 1.66, 0, 1.0, 0.95, 74, { potR: 0.18, potH: 0.28, paint: '#EFC5B9' });
    plant('hydrangea', 4.32, 0, 2.08, 1.0, 75, { potR: 0.19, potH: 0.3, paint: '#F4EADB', cols: ['#B9C3E3', '#CFC2DF', '#A9B8DE', '#DCD3E8'] });
    plant('japonica', 4.58, 0, 0.86, 1.05, 76, { potR: 0.2, potH: 0.32 });
    // street lamp on the pavement by the left corner, with a hanging flower basket
    addProp(P.streetLamp({ h: 3.3, basket: true }), -4.95, 0, 1.05, PI * 0.15);
    halo(-4.95, 3.03, 1.1, 1.2, 1.2, 0.85);
  }

  small(false);
  /* ================================================================== GARDEN: picket fence, beds, rounded trees */
  K = KG; leaves = leavesG; batch.defaultTag = 'garden';
  {
    // left: a white picket fence enclosing a little hydrangea garden beside the house
    const fz = 0.55;
    for (let x = -HW - 0.15; x > -9.6; x -= 0.17) {
      const g = new THREE.Shape(); g.moveTo(-0.035, 0); g.lineTo(0.035, 0); g.lineTo(0.035, 0.72); g.lineTo(0, 0.8); g.lineTo(-0.035, 0.72); g.lineTo(-0.035, 0);
      const pg = new THREE.ExtrudeGeometry(g, { depth: 0.022, bevelEnabled: false }); pg.translate(x, 0, fz);
      X.paintGeo(pg, '#FBF5EC'); batch.push(M.clay, pg);
    }
    for (const y of [0.22, 0.58]) blk(-9.6, -HW - 0.1, y - 0.03, y + 0.03, fz - 0.03, fz, '#F3EADF');
    clay(rb(5.2, 0.12, 1.6, 0.05), [-HW - 2.75, 0.04, -0.3], C.stoneD, { ao: 0.3, r: [0, 0, 0] });
    K.add('clay', X.lumpy(70, 0.1, 6, 16, 6), { p: [-HW - 2.75, 0.1, -0.3], s: [2.5, 0.06, 0.72], c: C.soil });
    hydrangea(-4.85, 0.1, -0.15, 1.0, 7, ['#CFC2DF', '#DCD3E8', '#F4D6CB', '#C2B6D6']); hydrangea(-5.7, 0.1, -0.5, 1.1, 9); lavender(-6.5, 0.1, 0.0, 1.1, 23);
    // right: low hedge and a lavender bed beside the chimney side
    for (const [x, z, r, h, seed] of [[HW + 0.75, 0.25, 0.42, 0.5, 1], [HW + 1.55, 0.15, 0.5, 0.62, 2], [HW + 2.45, 0.05, 0.46, 0.55, 3], [HW + 3.3, -0.1, 0.5, 0.6, 4]]) {
      const g = X.lumpy(880 + seed, 0.1, 4, 12, 9).clone(); g.scale(r, h, r * 0.9); g.translate(x, h * 0.78, z);
      X.paintGeo(g, '#7E997C', { top: '#B9C9AB', topPow: 1.3, ao: 0.3 }); batch.push(P.mat('leaf'), g);
      X.sprinkle(leaves, [x, h * 0.78, z], [r, h, r * 0.9], 22, { seed: 90 + seed, size: 0.07, yMin: -0.2 });
      decals.at(x, 0.003, z, r * 2.6, r * 2.4, 0.38);
    }
    lavender(HW + 0.6, 0.0, -0.5, 1.2, 25); lavender(HW + 1.3, 0.0, -0.6, 1.1, 27); hydrangea(HW + 2.3, 0.0, -0.8, 1.1, 31);
    // rounded trees: one behind the left corner, one behind the right (clay canopies + leaf sprinkle)
    const tree = (x, z, h, seed, o = {}) => {
      const th = h * 0.5;
      K.add('clay', new THREE.CylinderGeometry(h * 0.022, h * 0.04, th, 10), { p: [x, th / 2, z], c: C.bark, ao: 0.4 });
      for (const a of [0.6, -0.8]) tube([[x, th * 0.75, z], [x + Math.cos(a) * h * 0.08, th * 1.05, z + Math.sin(a) * 0.1], [x + Math.cos(a) * h * 0.14, th * 1.25, z + Math.sin(a) * 0.15]], h * 0.016, C.bark);
      const blobs = [[0, 0.7, 0, 0.27], [0.17, 0.6, 0.06, 0.2], [-0.16, 0.62, 0.04, 0.21], [0.05, 0.86, -0.05, 0.19], [0.02, 0.6, 0.16, 0.18]];
      blobs.forEach(([bx, by, bz, br], i) => {
        const R = br * h, cx = x + bx * h, cy = by * h, cz = z + bz * h;
        const g = X.lumpy(seed * 10 + i, 0.11, 4, 10, 8).clone();
        g.scale(R, R * 0.92, R); g.translate(cx, cy, cz);
        X.paintGeo(g, o.dark || '#7F9A7A', { top: o.light || '#C5D3B8', topPow: 1.3, ao: 0.25 });
        batch.push(M.clay, g, { cast: true });
        X.sprinkle(leaves, [cx, cy, cz], [R, R * 0.93, R], Math.round(R * R * 6), { seed: seed * 7 + i, size: 0.2, yMin: -0.1 });
      });
      decals.at(x, 0.004, z, h * 0.7, h * 0.7, 0.4);
    };
    tree(-5.9, -2.3, 6.0, 3); tree(6.1, -3.2, 5.6, 5, { dark: '#86A07F', light: '#CCD8BE' });
  }
  K = KH; leaves = leavesH; batch.defaultTag = '';

  /* ================================================================== FAR: soft neighbouring cottages + tree line (no shadows) */
  const far = new X.Batch(null), farBack = new X.Batch(null);
  {
    const r2 = X.rng(77);
    const blob = (x, z, r, h, c1, c2, seed, ws = 8, hs = 6, amp = 0.08) => { const g = X.lumpy(seed, amp, 3, ws, hs).clone(); g.scale(r, h, r); g.translate(x, h * 0.55, z); X.paintGeo(g, c1, { top: c2, topPow: 1.2 }); (z > 5 ? farBack : far).push(M.clay, g, { cast: false }); };
    // neighbouring cottages (small, hazy, partly behind the trees)
    const cottage = (x, z, w, d, h, ry, wall, roof, ch) => {
      const g = new THREE.BoxGeometry(w, h, d); g.translate(0, h / 2, 0); X.paintGeo(g, wall, { ao: 0.15 });
      const rh = w * 0.6, r = new THREE.BufferGeometry();
      r.setAttribute('position', new THREE.Float32BufferAttribute([-w / 2 - 0.2, h, d / 2 + 0.2, w / 2 + 0.2, h, d / 2 + 0.2, 0, h + rh, d / 2 + 0.2, -w / 2 - 0.2, h, -d / 2 - 0.2, 0, h + rh, -d / 2 - 0.2, w / 2 + 0.2, h, -d / 2 - 0.2], 3));
      r.setIndex([0, 1, 2, 3, 4, 5, 0, 2, 4, 0, 4, 3, 1, 5, 4, 1, 4, 2]); r.computeVertexNormals(); X.paintGeo(r, roof);
      const parts = [g, r];
      if (ch) { const cg = new THREE.BoxGeometry(0.45, 1.2, 0.45); cg.translate(w * 0.24, h + rh * 0.62, 0); X.paintGeo(cg, roof); parts.push(cg); }
      // two warm windows (flat, slightly proud of the wall)
      for (const dx of [-w * 0.24, w * 0.24]) { const wg = new THREE.PlaneGeometry(0.55, 0.7); wg.translate(dx, h * 0.55, d / 2 + 0.01); X.paintGeo(wg, '#F2D3AE'); parts.push(wg); }
      for (const gg of parts) { gg.rotateY(ry); gg.translate(x, 0, z); (z > 5 ? farBack : far).push(M.clay, gg, { cast: false }); }
    };
    cottage(-12.5, -18, 3.8, 3.6, 3.1, 0.22, '#E6DCD3', '#C3A79E', true); cottage(-19, -25, 4.2, 4, 3.3, -0.12, '#E2D9D2', '#BCA49B');
    cottage(13, -19.5, 4, 3.6, 3.2, -0.28, '#E7DDD4', '#C1A69D', true); cottage(20, -26, 4.4, 4, 3.4, 0.1, '#E1D8D0', '#B9A199');
    cottage(-13, 24, 4.4, 4, 3.6, 0.2, '#EEE3D6', '#B49B90', true); cottage(14, 26, 4.8, 4.2, 3.8, -0.3, '#EADFD2', '#AE978D');
    // across the lane (seen when looking back out of the door): a low hedge and two cottages facing the shop
    cottage(-2.6, 15.5, 4.6, 4, 3.4, PI + 0.06, '#EFE4D6', '#C2A196', true); cottage(4.6, 17, 4.2, 4, 3.3, PI - 0.1, '#E9DED1', '#B8A096');
    for (let i = 0; i < 9; i++) { const x = -9 + i * 2.2 + r2() * 0.4; blob(x, 11.2, 1.1 + r2() * 0.3, 0.75 + r2() * 0.2, '#8FA68A', '#BFCCB3', 650 + i, 8, 5, 0.06); }
    // tree line behind the houses (hazy sage), and a soft one across the street (seen when looking back)
    for (let i = 0; i < 18; i++) { const side = i % 2 ? 1 : -1, x = side * (7 + r2() * 20), z = -11 - r2() * 14; blob(x, z, 1.8 + r2() * 1.5, 2.6 + r2() * 2.4, '#9AAD94', '#CAD5BE', 300 + i); }
    for (let i = 0; i < 16; i++) { const x = -48 + i * 6.2 + r2() * 3, z = -28 - r2() * 6; blob(x, z, 3 + r2() * 1.8, 3.4 + r2() * 2.2, '#B3BFAE', '#DADFD0', 400 + i); }
    for (let i = 0; i < 14; i++) { const x = -44 + i * 6.6 + r2() * 3, z = 30 + r2() * 8; if (Math.abs(x) < 4) continue; blob(x, z, 2.8 + r2() * 1.6, 3.2 + r2() * 2, '#A3B39E', '#D0D9C6', 600 + i); }
    // distant hills: broad, low, lavender-grey haze
    for (let i = 0; i < 6; i++) { const x = -75 + i * 30 + r2() * 8, z = -60 - r2() * 10; const g = new THREE.SphereGeometry(1, 16, 8, 0, TAU, 0, PI / 2); g.scale(24 + r2() * 8, 5 + r2() * 3, 14); g.translate(x, -0.5, z); X.paintGeo(g, '#C9C3CC', { top: '#E4DCDD', topPow: 1.1 }); far.push(M.clay, g, { cast: false }); }
  }

  /* ================================================================== THE CAST: Maine Coon, café guests, golden dog (animated) */
  const tableX = 2.55, tableZ = 1.75;
  const cast = new THREE.Group(); cast.name = 'ext:cast'; group.add(cast);
  const coon = P.maineCoon({ size: 1.12 }); put(coon.group, -1.12, 0, 0.5, 0.22); cast.add(coon.group);
  const chairs = [[tableX - 0.64, tableZ - 0.12, 1.1], [tableX + 0.64, tableZ - 0.12, -1.1]];
  const people = [
    P.person({ coat: '#9FB09A', scarf: '#EFC5B9', hair: '#6B5444', skin: '#EBC9AE', trousers: '#7D7068', hairStyle: 'bun', phase: 1, lookYaw: 0.25 }),
    P.person({ coat: '#D59A86', scarf: '#F4EADB', hair: '#3F342D', skin: '#D9AE90', trousers: '#8F8378', hairStyle: 'short', hat: 'beret', hatColor: '#E9DCCB', phase: 2, lookYaw: -0.2 }),
  ];
  people.forEach((p, i) => { put(p.group, chairs[i][0], 0, chairs[i][1], chairs[i][2]); cast.add(p.group); });
  const dog = P.dog({ coat: 'golden', size: 1 }); put(dog.group, tableX + 0.1, 0, tableZ + 0.62, 0.5); cast.add(dog.group);
  X.skinCharacters([coon.group, ...people.map((p) => p.group), dog.group], group, decals, 'ext:cast');
  small(true);
  // café furniture: marble-topped bistro table, rattan chairs with gingham cushions, cups + a bud vase
  addProp(P.bistroTable({ top: '#F7F1E8' }), tableX, 0, tableZ, 0);
  for (const [x, z, ry] of chairs) {
    const m = X.mat4([x, 0, z], [0, ry, 0]), at = (p) => V3(p[0], p[1], p[2]).applyMatrix4(m).toArray(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0));
    const R = '#CDAE86', sy = 0.46;
    for (const [lx, lz] of [[-0.15, 0.13], [0.15, 0.13], [-0.14, -0.13], [0.14, -0.13]]) rod(at([lx * 0.95, sy - 0.03, lz * 0.95]), at([lx * 1.2, 0.0, lz * 1.2]), 0.013, 0.012, R);
    K.add('weave', cyl(16), { p: at([0, sy - 0.015, 0]), s: [0.2, 0.03, 0.2], c: '#F1E6D4' });
    K.add('clay', new THREE.TorusGeometry(0.205, 0.016, 5, 18), { p: at([0, sy - 0.015, 0]), q: q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(PI / 2, 0, 0))), c: R });
    cushion(0.36, 0.05, 0.34, at([0, sy + 0.02, 0.01]), ry);
    K.add('clay', new THREE.TorusGeometry(0.18, 0.014, 5, 14, PI), { p: at([0, sy + 0.2, -0.19]), q: q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.12, 0, 0))), c: R });
    for (const sx of [-1, 1]) rod(at([sx * 0.18, sy, -0.17]), at([sx * 0.18, sy + 0.2, -0.19]), 0.013, 0.013, R);
    for (const lx of [-0.07, 0, 0.07]) rod(at([lx, sy + 0.01, -0.17]), at([lx, sy + 0.37, -0.21]), 0.008, 0.008, '#D8BD98');
    decals.at(x, 0.003, z, 0.55, 0.55, 0.35, ry);
  }
  cup(tableX - 0.06, 0.74, tableZ + 0.12, '#F3DCD3', 1, 0.5);
  K.add('satin', new THREE.CylinderGeometry(0.022, 0.03, 0.12, 12), { p: [tableX + 0.12, 0.8, tableZ + 0.12], c: '#F4EADB' });
  tube([[tableX + 0.12, 0.85, tableZ + 0.12], [tableX + 0.13, 0.92, tableZ + 0.13], [tableX + 0.14, 0.97, tableZ + 0.12]], 0.004, C.sageD, { cast: false });
  K.add('felt', sph(8, 6), { p: [tableX + 0.14, 0.985, tableZ + 0.12], s: 0.024, c: '#EFB0A3' });
  addProp(P.dogBowl(), 0.95, 0, 0.42, -0.2, 1.15);
  small(false);

  /* ================================================================== BUILD: merge, instanced leaves, decals */
  batch.obj(KH.build('ext-parts'));
  batch.obj(KR.build('ext-roof'), { tag: 'roofI' });
  batch.obj(KG.build('ext-garden'), { tag: 'garden' });
  batch.obj(KS.build('ext-small'), { tag: 'small', cast: false });
  batch.build(group, 'ext');
  far.build(group, 'ext-far').forEach((m) => { m.castShadow = false; m.receiveShadow = false; });
  farBack.build(group, 'ext-farBack').forEach((m) => { m.castShadow = false; m.receiveShadow = false; });
  for (const sc of [leavesH, leavesG]) { const lv = sc.build({ cast: false }); if (lv) group.add(lv); }
  const bl = blooms.build({ cast: false }); if (bl) group.add(bl);
  const sh = decals.build('ext:shadows'); if (sh) group.add(sh);
  const hl = halos.build('ext:halos'); if (hl) { hl.renderOrder = 3; group.add(hl); }
  /* shadow budget: only big shapes cast (house shell, roof, shopfront parts, trees, the cast, the café furniture) */
  group.traverse((o) => { if (o.isMesh && (/:small$|ext:leaves|ext:blossoms|bookRow|^ext:felt|^ext:satin|ext:knit|ext:yarn|ext-far|ext:glowVC|ext:linenVC|ext:weave|ext:paperVC|ext:leaf|ext:terra|ext:metal|ext:cast:/.test(o.name || o.type))) o.castShadow = false; });

  /* Inside the shop looking in, everything outside is behind the camera: hide all but the shell so the interior views
     don't pay for the garden, props and cast. Runs from the scene's onBeforeRender (installed by the always-drawn lawn). */
  {
    const lawn = group.getObjectByName('ext:lawn');
    const keepRe = /^(ext:lawn|ext:frontWall|signFace|ext:wash.*|ext:slate-ext.*|ext:clay:roofI|ext:chimney.*)$/;
    const hideable = group.children.filter((o) => !keepRe.test(o.name) && o !== cast);
    const dir = V3(); let inside = false, hooked = false;
    const check = (cam) => {
      if (!cam || !cam.isCamera) return;
      cam.getWorldDirection(dir);
      const want = cam.position.z < -0.55 && dir.z < -0.3;
      if (want === inside) return;
      inside = want;
      for (const o of hideable) o.visible = !want;
    };
    lawn.onBeforeRender = (r, scene, cam) => {
      check(cam);
      if (!hooked && scene && scene.isScene) {
        hooked = true;
        const prev = scene.onBeforeRender;
        scene.onBeforeRender = function (renderer, sc, camera, target) { if (prev) prev.call(this, renderer, sc, camera, target); check(camera); };
      }
    };
  }

  return {
    group,
    update(t /* , dt */) {
      coon.update(t + 0.1);          // reduced motion (fixed t) holds a still pose
      for (const p of people) p.update(t);
      dog.update(t);
    },
    anchors: {
      signCenter: signCenter.clone(), signWidth: SW, door: V3(0, 1.25, 0),
      /* framing hints for main.js: the roof silhouette (ridge ends, dormer apexes, chimney pots) and the things that
         should stay in the first view (café table + guests, the cat, the bowl) */
      roofPts: roofPts.map((p) => p.clone()),
      keepPts: [V3(tableX + 0.9, 0, tableZ + 0.3), V3(tableX - 0.9, 0, tableZ + 0.3), V3(-0.95, 0, 0.6), V3(0.95, 0, 0.55), V3(-HW, 0, 0.1), V3(HW, 0, 0.1)],
    },
    lights: [],
  };
}
