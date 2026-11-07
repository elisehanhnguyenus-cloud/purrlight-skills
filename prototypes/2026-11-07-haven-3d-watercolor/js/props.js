// Haven 3D — shared prop library (library module).
// Every prop: origin at its bottom centre (keychain: ring top; pendantLamp: bottom of the shade), faces +Z, metres.
// Props are built from many small primitives that are merged per material with vertex colours, so most props cost
// 2–4 draw calls. Geometries of static props are cached per option set and shared between clones.
import * as THREE_NS from '../vendor/three.module.min.js';
import { RoundedBoxGeometry } from '../vendor/RoundedBoxGeometry.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';
import { mulberry32 } from './textures.js';

export function makeProps(THREE = THREE_NS, T) {
  const P = {};
  const _m = new THREE.Matrix4(), _m2 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
  const _e = new THREE.Euler(), _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();
  const ZUP = new THREE.Vector3(0, 0, 1), YUP = new THREE.Vector3(0, 1, 0);
  const PI = Math.PI, TAU = Math.PI * 2;

  // =====================================================================================
  // MATERIALS
  // =====================================================================================
  const HEX = {
    cream: '#FBF6EE', ivory: '#FFFBF4', oat: '#E9DCCB', do: '#F1E6D2', blush: '#EFC5B9', roseGold: '#C9937E',
    sage: '#A9BCA0', sageDark: '#7F9A7A', sageLight: '#C5D3B8', ink: '#4A423B', cocoa: '#5A4636', berry: '#B42249',
    peach: '#E8A87C', plaster: '#F4ECE1', terracotta: '#C99076', white: '#FFFDF8', woodLight: '#E3CFB3', woodDark: '#8A6A52',
  };
  P.HEX = HEX;
  const mcache = new Map();
  const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.9, metalness: 0 }, o));
  const VC = { vertexColors: true, color: 0xffffff };
  const MATS = {
    // ---- contract palette (plain, no vertex colours) ----
    cream: () => std({ color: HEX.cream }), ivory: () => std({ color: HEX.ivory }), oat: () => std({ color: HEX.oat }),
    do: () => std({ color: '#ffffff', map: T.doPaper(), roughness: 0.95 }),
    blush: () => std({ color: HEX.blush }),
    roseGold: () => std({ color: HEX.roseGold, metalness: 0.6, roughness: 0.35, envMapIntensity: 1.2 }),
    sage: () => std({ color: HEX.sage }), sageDark: () => std({ color: HEX.sageDark }), sageLight: () => std({ color: HEX.sageLight }),
    ink: () => std({ color: HEX.ink }), cocoa: () => std({ color: HEX.cocoa }), berry: () => std({ color: HEX.berry, roughness: 0.8 }),
    peach: () => std({ color: HEX.peach }),
    plaster: () => std({ color: HEX.plaster, roughness: 0.95 }),
    glass: () => std({ color: '#FFF3E4', roughness: 0.08, metalness: 0, transparent: true, opacity: 0.16, depthWrite: false, envMapIntensity: 1.5 }),
    glowWarm: () => std({ color: '#FFE7CC', emissive: '#F2B98A', emissiveIntensity: 1.25, roughness: 1 }),
    // ---- extras ----
    terracotta: () => std({ color: HEX.terracotta, map: T.terracotta(), roughness: 0.95 }),
    wood: () => std({ color: '#ffffff', map: T.wood('#E2CCAE'), roughness: 0.8 }),
    woodDark: () => std({ color: '#ffffff', map: T.wood('#9A7A60'), roughness: 0.8 }),
    linen: () => std({ color: '#ffffff', map: T.linen(HEX.oat), roughness: 1 }),
    paper: () => std({ color: '#ffffff', map: T.paper(), roughness: 0.95, side: THREE.DoubleSide }),
    white: () => std({ color: HEX.white }),
    bulb: () => new THREE.MeshBasicMaterial({ color: '#FFF1DC', toneMapped: false }),
    lampGlow: () => std({ color: '#FFF0DE', emissive: '#FFD9AE', emissiveIntensity: 1.6, roughness: 1 }),
    lantern: () => std({ color: '#ffffff', map: T.doPaper(), emissive: '#F7C795', emissiveMap: T.doPaper(), emissiveIntensity: 1.15, roughness: 1, side: THREE.DoubleSide }),
    water: () => std({ color: '#CFE0DC', roughness: 0.12, metalness: 0, envMapIntensity: 1.4 }),
    shadow: () => new THREE.MeshBasicMaterial({ color: '#3C281E', map: T.softShadow(), transparent: true, depthWrite: false, opacity: 0.5, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 }),
    clapboard: () => std({ color: '#ffffff', map: T.clapboard() }), stone: () => std({ color: '#ffffff', map: T.stone() }),
    slate: () => std({ color: '#ffffff', map: T.slate(), roughness: 0.85 }), floorTiles: () => std({ color: '#ffffff', map: T.floorTiles(), roughness: 0.7 }),
    cobbles: () => std({ color: '#ffffff', map: T.cobbles() }), grass: () => std({ color: '#ffffff', map: T.grass(), roughness: 1 }),
    awning: () => std({ color: '#ffffff', map: T.awning(), side: THREE.DoubleSide }), wallpaper: () => std({ color: '#ffffff', map: T.wallpaper(), roughness: 0.95 }),
    signFace: () => new THREE.MeshBasicMaterial({ map: T.signFace(), toneMapped: false }),
    cover: () => std({ color: '#ffffff', map: T.embroideredCover(), roughness: 1 }),
    photo: () => new THREE.MeshBasicMaterial({ map: T.merlinPhoto(), toneMapped: false, color: '#F6F1EA' }),
    leafInst: () => std({ color: '#ffffff', roughness: 0.85, side: THREE.DoubleSide }),
    // ---- vertex-coloured shared materials used inside props (colour lives in the geometry) ----
    knit: () => std(Object.assign({ map: T.knit('#ffffff'), normalMap: T.knitNormal(), normalScale: new THREE.Vector2(0.85, 0.85), roughness: 1 }, VC)),
    felt: () => std(Object.assign({ map: T.grain(), roughness: 1 }, VC)),
    clay: () => std(Object.assign({ map: T.grain(), roughness: 0.82 }, VC)),
    satin: () => std(Object.assign({ roughness: 0.45 }, VC)),
    button: () => std(Object.assign({ roughness: 0.28 }, VC)),
    linenVC: () => std(Object.assign({ map: T.linen('#ffffff'), roughness: 1 }, VC)),
    fur: () => std(Object.assign({ map: T.fur(), roughness: 1 }, VC)),
    tabby: () => std(Object.assign({ map: T.tabby(), roughness: 1 }, VC)),
    boucle: () => std(Object.assign({ map: T.boucle(), normalMap: T.boucleNormal(), roughness: 1 }, VC)),
    weave: () => std(Object.assign({ map: T.weave(), roughness: 0.95 }, VC)),
    yarn: () => std(Object.assign({ map: T.yarnWound(), roughness: 1 }, VC)),
    leaf: () => std(Object.assign({ map: T.grain(), roughness: 0.85, side: THREE.DoubleSide }, VC)),
    fern: () => std(Object.assign({ map: T.fernFrond(), alphaTest: 0.45, roughness: 0.9, side: THREE.DoubleSide }, VC)),
    terra: () => std(Object.assign({ map: T.terracotta(), roughness: 0.95 }, VC)),
    metal: () => std(Object.assign({ metalness: 0.6, roughness: 0.35, envMapIntensity: 1.2 }, VC)),
    glowVC: () => std(Object.assign({ emissive: '#F7C795', emissiveIntensity: 1.1, roughness: 1 }, VC)),
    paperVC: () => std(Object.assign({ map: T.doPaper(), roughness: 0.95 }, VC)),
  };
  P.mat = (name) => {
    let m = mcache.get(name);
    if (m) return m;
    if (MATS[name]) m = MATS[name]();
    else if (/^#?[0-9a-f]{6}$/i.test(String(name))) m = std({ color: name[0] === '#' ? name : '#' + name });
    else if (String(name).startsWith('knit:')) m = std({ map: T.knit(name.slice(5)), normalMap: T.knitNormal(), roughness: 1 });
    else { console.warn('[props] unknown material', name, '→ cream'); m = MATS.cream(); }
    m.name = String(name);
    mcache.set(name, m);
    return m;
  };
  P.materialNames = Object.keys(MATS);

  // world-size of one texture tile, per vertex-coloured material (null = leave UVs as they are)
  const TILE = { felt: 0.12, clay: 0.25, linenVC: 0.09, fur: 0.12, boucle: 0.05, weave: 0.07, leaf: 0.2, terra: 0.25, paperVC: 0.3 };

  // =====================================================================================
  // GEOMETRY HELPERS
  // =====================================================================================
  const gcache = new Map();
  const G = (key, fn) => { let g = gcache.get(key); if (!g) { g = fn(); gcache.set(key, g); } return g; };
  const tag = (g, kind, meta = {}) => { g.userData.kind = kind; Object.assign(g.userData, meta); return g; };
  const sph = (ws = 16, hs = 12) => G(`sph${ws}/${hs}`, () => tag(new THREE.SphereGeometry(1, Math.min(20, ws), Math.min(20, hs)), 'sphere'));
  const cap = (len = 1, rs = 12) => G(`cap${len}/${rs}`, () => tag(new THREE.CapsuleGeometry(1, len, 4, rs), 'capsule', { len }));
  const cyl = (rs = 16, rt = 1, rb = 1, open = false) => G(`cyl${rs}/${rt}/${rb}/${open}`, () => tag(new THREE.CylinderGeometry(rt, rb, 1, Math.min(20, rs), 1, open), 'cyl'));
  const cone = (rs = 12) => G(`cone${rs}`, () => tag(new THREE.ConeGeometry(1, 1, rs), 'cyl'));
  const tor = (tube = 0.2, rs = 6, ts = 18, arc = TAU) => G(`tor${tube}/${rs}/${ts}/${arc}`, () => tag(new THREE.TorusGeometry(1, tube, rs, ts, arc), 'torus', { tube }));
  const rbg = (w, h, d, r, seg = 2) => G(`rb${w}/${h}/${d}/${r}/${seg}`, () => tag(new RoundedBoxGeometry(w, h, d, seg, r), 'box', { w, h, d }));
  const box = () => G('box', () => tag(new THREE.BoxGeometry(1, 1, 1), 'box', { w: 1, h: 1, d: 1 }));
  const capOf = (theta, ws = 14, hs = 5) => G(`spcap${theta}/${ws}/${hs}`, () => tag(new THREE.SphereGeometry(1, ws, hs, 0, TAU, 0, theta), 'sphere'));
  const partSph = (ps, pl, ts, tl, ws = 6, hs = 8) => G(`psph${ps}/${pl}/${ts}/${tl}/${ws}/${hs}`, () => tag(new THREE.SphereGeometry(1, ws, hs, ps, pl, ts, tl), 'sphere'));
  function lathe(pts, segs = 18, key) {
    const make = () => {
      const v = pts.map(([r, y]) => new THREE.Vector2(Math.max(0, r), y));
      let len = 0, rMax = 0;
      for (let i = 1; i < v.length; i++) len += v[i].distanceTo(v[i - 1]);
      for (const p of v) rMax = Math.max(rMax, p.x);
      return tag(new THREE.LatheGeometry(v, Math.min(20, segs)), 'lathe', { len, rMax });
    };
    return key ? G('lathe:' + key, make) : make();
  }
  // tube with radius profile r(t) (taper/bulge), optional noise for fluffy tails
  function taperTube(points, r0, r1, { tubular = 28, radial = 10, bulge = 0, fluff = 0, seed = 1, curveType = 'catmullrom' } = {}) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])), false, curveType, 0.5);
    const g = new THREE.TubeGeometry(curve, tubular, 1, radial, false);
    const pos = g.attributes.position, nor = g.attributes.normal;
    const rnd = mulberry32(seed); const ph = [rnd() * 6, rnd() * 6, rnd() * 6];
    for (let i = 0; i <= tubular; i++) {
      const t = i / tubular;
      curve.getPointAt(t, _v);
      const base = (r0 + (r1 - r0) * t) * (1 + bulge * Math.sin(PI * t));
      for (let j = 0; j <= radial; j++) {
        const idx = i * (radial + 1) + j;
        const a = j / radial * TAU;
        const f = fluff ? 1 + fluff * (0.55 * Math.sin(a * 3 + t * 9 + ph[0]) + 0.45 * Math.sin(a * 5 - t * 13 + ph[1])) : 1;
        const r = base * f;
        pos.setXYZ(idx, _v.x + nor.getX(idx) * r, _v.y + nor.getY(idx) * r, _v.z + nor.getZ(idx) * r);
      }
    }
    if (fluff) { g.computeVertexNormals(); fixSeams(g); }
    return tag(g, 'tube', { len: curve.getLength(), r: (r0 + r1) / 2, curve });
  }
  function fixSeams(g) {
    const pos = g.attributes.position, nor = g.attributes.normal, map = new Map();
    for (let i = 0; i < pos.count; i++) {
      const k = `${pos.getX(i).toFixed(4)},${pos.getY(i).toFixed(4)},${pos.getZ(i).toFixed(4)}`;
      let e = map.get(k); if (!e) { e = [0, 0, 0, []]; map.set(k, e); }
      e[0] += nor.getX(i); e[1] += nor.getY(i); e[2] += nor.getZ(i); e[3].push(i);
    }
    for (const e of map.values()) {
      if (e[3].length < 2) continue;
      const l = Math.hypot(e[0], e[1], e[2]) || 1;
      for (const i of e[3]) nor.setXYZ(i, e[0] / l, e[1] / l, e[2] / l);
    }
  }
  // lumpy sphere (clay / foliage / fur clumps) — displacement is position-based so seams stay closed
  function lumpy(seed = 1, amp = 0.08, freq = 3, ws = 20, hs = 14) {
    return G(`lumpy${seed}/${amp}/${freq}/${ws}/${hs}`, () => {
      const g = new THREE.SphereGeometry(1, Math.min(20, ws), Math.min(20, hs));
      const rnd = mulberry32(seed);
      const waves = [];
      for (let i = 0; i < 7; i++) {
        _v.set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize();
        waves.push([_v.x, _v.y, _v.z, rnd() * TAU, (0.6 + rnd() * 0.8) * freq]);
      }
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        let d = 0;
        for (const w of waves) d += Math.sin((x * w[0] + y * w[1] + z * w[2]) * w[4] + w[3]);
        const s = 1 + amp * d / 2.4;
        pos.setXYZ(i, x * s, y * s, z * s);
      }
      g.computeVertexNormals(); fixSeams(g);
      return tag(g, 'sphere');
    });
  }
  function scaleUV(g, su, sv, ou = 0, ov = 0) {
    const uv = g.attributes.uv; if (!uv) return;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su + ou, uv.getY(i) * sv + ov);
  }
  function swapUV(g) { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) { const a = uv.getX(i); uv.setX(i, uv.getY(i)); uv.setY(i, a); } }
  const KEEP = new Set(['position', 'normal', 'uv', 'color']);
  function normalizeAttrs(g) {
    for (const n of Object.keys(g.attributes)) if (!KEEP.has(n)) g.deleteAttribute(n);
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    if (!g.attributes.normal) g.computeVertexNormals();
    if (!g.index) { const n = g.attributes.position.count; const idx = new (n > 65535 ? Uint32Array : Uint16Array)(n); for (let i = 0; i < n; i++) idx[i] = i; g.setIndex(new THREE.BufferAttribute(idx, 1)); }
    g.clearGroups();
    g.morphAttributes = {};
  }
  function paint(g, hex, ao = 0, aoPow = 1.4, top = null) {
    const pos = g.attributes.position, n = pos.count;
    const col = new Float32Array(n * 3);
    _c.set(hex);
    let y0 = Infinity, y1 = -Infinity;
    if (ao) for (let i = 0; i < n; i++) { const y = pos.getY(i); if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const span = y1 - y0 || 1;
    let tc = null; if (top) tc = new THREE.Color(top);
    for (let i = 0; i < n; i++) {
      let f = 1, r = _c.r, gg = _c.g, b = _c.b;
      if (ao) { const h = (pos.getY(i) - y0) / span; f = 1 - ao * Math.pow(1 - h, aoPow); if (tc) { const t = Math.pow(h, 2); r += (tc.r - r) * t; gg += (tc.g - gg) * t; b += (tc.b - b) * t; } }
      col[i * 3] = r * f; col[i * 3 + 1] = gg * f; col[i * 3 + 2] = b * f;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  }
  function autoUV(kind, meta, tile, sx, sy, sz) {
    switch (kind) {
      case 'sphere': return [Math.max(1, Math.round(PI * (sx + sz) / tile)), Math.max(0.5, PI * sy / tile)];
      case 'capsule': return [Math.max(1, Math.round(PI * (sx + sz) / tile)), Math.max(0.5, (PI + (meta.len || 1)) * sy / tile)];
      case 'cyl': return [Math.max(1, Math.round(PI * (sx + sz) / tile)), Math.max(0.25, sy / tile)];
      case 'torus': return [Math.max(1, Math.round(TAU * sx / tile)), Math.max(1, Math.round(TAU * (meta.tube || 0.2) * sx / tile))];
      case 'lathe': return [Math.max(1, Math.round(TAU * (meta.rMax || 1) * sx / tile)), Math.max(0.25, (meta.len || 1) * sy / tile)];
      case 'tube': return [Math.max(0.5, (meta.len || 1) * sx / tile), Math.max(1, Math.round(TAU * (meta.r || 0.01) * sx / tile))];
      case 'box': return [Math.max(0.25, Math.max(meta.w || 1, meta.d || 1) * sx / tile), Math.max(0.25, (meta.h || 1) * sy / tile)];
      default: return [sx / tile, sy / tile];
    }
  }

  // ---- Kit: collect parts per material, merge into one mesh per material ----
  class Kit {
    constructor(unit = 1, stitch = 0.007) { this.u = unit; this.stitch = stitch; this.parts = {}; }
    add(key, geo, o = {}) {
      const u = this.u;
      const g = geo.clone();
      const s = o.s === undefined ? [1, 1, 1] : (typeof o.s === 'number' ? [o.s, o.s, o.s] : o.s);
      const sx = s[0] * u, sy = s[1] * u, sz = s[2] * u;
      if (o.pre) g.applyMatrix4(o.pre);
      const tile = key === 'knit' ? this.stitch * 8 : TILE[key];
      const uv = o.uv || (tile && !o.keepUV ? autoUV(geo.userData.kind, geo.userData, tile, Math.abs(sx), Math.abs(sy), Math.abs(sz)) : null);
      if (o.uvSwap) swapUV(g);
      if (uv) scaleUV(g, uv[0], uv[1], o.uvOff ? o.uvOff[0] : 0, o.uvOff ? o.uvOff[1] : 0);
      const p = o.p || [0, 0, 0];
      if (o.q) _q.copy(o.q); else { const r = o.r || [0, 0, 0]; _e.set(r[0], r[1], r[2], o.order || 'XYZ'); _q.setFromEuler(_e); }
      _m.compose(_v.set(p[0] * u, p[1] * u, p[2] * u), _q, _s.set(sx, sy, sz));
      g.applyMatrix4(_m);
      if (o.post) g.applyMatrix4(o.post);
      paint(g, o.c || '#ffffff', o.ao || 0, o.aoPow || 1.4, o.top || null);
      normalizeAttrs(g);
      (this.parts[key] || (this.parts[key] = [])).push(g);
      return g;
    }
    // place a flattened primitive on an ellipsoid surface (eyes, cheeks, spots) — ell = {c, r} in design units
    onSurf(key, geo, ell, dir, size, o = {}) {
      const [c, r] = [ell.c, ell.r];
      const k = 1 / Math.sqrt((dir[0] / r[0]) ** 2 + (dir[1] / r[1]) ** 2 + (dir[2] / r[2]) ** 2);
      const p = [c[0] + dir[0] * k, c[1] + dir[1] * k, c[2] + dir[2] * k];
      _v2.set((p[0] - c[0]) / (r[0] * r[0]), (p[1] - c[1]) / (r[1] * r[1]), (p[2] - c[2]) / (r[2] * r[2])).normalize();
      const sink = o.sink === undefined ? 0.35 : o.sink;
      const q = new THREE.Quaternion().setFromUnitVectors(ZUP, _v2);
      if (o.spin) q.multiply(_q2.setFromAxisAngle(ZUP, o.spin));
      if (o.r) q.multiply(_q2.setFromEuler(_e.set(o.r[0], o.r[1], o.r[2])));
      const pp = [p[0] - _v2.x * size[2] * sink + (o.lift || 0) * _v2.x, p[1] - _v2.y * size[2] * sink + (o.lift || 0) * _v2.y, p[2] - _v2.z * size[2] * sink + (o.lift || 0) * _v2.z];
      return this.add(key, geo, Object.assign({}, o, { p: pp, q, s: size, r: null }));
    }
    // patch that hugs an ellipsoid: spherical cap rotated to dir, scaled by the radii
    patch(key, ell, dir, angle, color, o = {}) {
      const g = capOf(angle, o.ws || 12, o.hs || 4).clone();
      _v2.set(dir[0], dir[1], dir[2]).normalize();
      g.applyQuaternion(_q2.setFromUnitVectors(YUP, _v2));
      if (o.squash) { // squash the patch along a unit-space axis to make ovals
        const [ax, k] = o.squash; const pos = g.attributes.position;
        for (let i = 0; i < pos.count; i++) { _v.fromBufferAttribute(pos, i); const d = _v.dot(ax); _v.addScaledVector(ax, d * (k - 1)).normalize(); pos.setXYZ(i, _v.x, _v.y, _v.z); }
        g.computeVertexNormals();
      }
      const lift = o.lift || 1.03;
      tag(g, 'sphere');
      return this.add(key, g, Object.assign({}, o, { p: ell.c, s: [ell.r[0] * lift, ell.r[1] * lift, ell.r[2] * lift], c: color }));
    }
    build(name) {
      const group = new THREE.Group(); group.name = name || '';
      for (const key of Object.keys(this.parts)) {
        const geos = this.parts[key];
        const merged = geos.length === 1 ? geos[0] : mergeGeometries(geos, false);
        if (geos.length > 1) geos.forEach((g) => g.dispose());
        merged.computeBoundingSphere(); merged.computeBoundingBox();
        const mesh = new THREE.Mesh(merged, P.mat(key));
        mesh.name = name ? `${name}:${key}` : key;
        mesh.castShadow = !/glow|bulb|shadow|glass|lantern/.test(key); mesh.receiveShadow = true;
        group.add(mesh);
      }
      this.parts = {};
      return group;
    }
  }
  P.Kit = Kit;

  // merge every static mesh of an object that shares a material into one mesh (fewer draw calls for sets/vignettes)
  P.mergeByMaterial = (obj, name) => {
    obj.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(obj.matrixWorld).invert();
    const buckets = new Map(), keep = [];
    obj.traverse((m) => {
      if (!m.isMesh) return;
      const okGeo = m.geometry.attributes.color && !Array.isArray(m.material) && !m.isInstancedMesh && !m.material.transparent;
      if (!okGeo || m.name === 'softShadow') { keep.push(m); return; }
      const g = m.geometry.clone();
      g.applyMatrix4(_m.multiplyMatrices(inv, m.matrixWorld));
      if (!buckets.has(m.material)) buckets.set(m.material, []);
      buckets.get(m.material).push(g);
    });
    const out = new THREE.Group(); out.name = name || obj.name;
    for (const [mat, geos] of buckets) {
      const g = geos.length === 1 ? geos[0] : mergeGeometries(geos, false);
      g.computeBoundingSphere();
      const mesh = new THREE.Mesh(g, mat); mesh.castShadow = true; mesh.receiveShadow = true; mesh.name = (name || 'merged') + ':' + mat.name;
      out.add(mesh);
    }
    for (const m of keep) { const c = m.clone(); _m.multiplyMatrices(inv, m.matrixWorld); _m.decompose(c.position, c.quaternion, c.scale); out.add(c); }
    return out;
  };

  // cache static props per option-set; return cheap clones that share geometry + materials
  const pcache = new Map();
  function cached(key, build) {
    let t = pcache.get(key);
    if (!t) { t = build(); pcache.set(key, t); }
    const c = t.clone();
    c.userData = Object.assign({}, t.userData);
    return c;
  }
  const keyOf = (name, o) => name + ':' + JSON.stringify(o || {});
  // helper to add a contact shadow child
  function addShadow(group, w, d, opacity = 0.45) { const s = P.softShadow(w, d, opacity); group.add(s); return s; }
  function lum(hex) { _c.set(hex); return 0.2126 * _c.r + 0.7152 * _c.g + 0.0722 * _c.b; }

  // =====================================================================================
  // BASIC HELPERS (contract)
  // =====================================================================================
  P.rbox = (w, h, d, r = 0.02, mat = 'cream') => {
    const m = new THREE.Mesh(rbg(w, h, d, Math.min(r, w / 2, h / 2, d / 2)), typeof mat === 'string' ? P.mat(mat) : mat);
    m.castShadow = true; m.receiveShadow = true;
    return m; // centred (like BoxGeometry)
  };
  P.rboxGeo = (w, h, d, r = 0.02, seg = 2) => rbg(w, h, d, Math.min(r, w / 2, h / 2, d / 2), seg);
  P.softShadow = (w = 1, d = 1, opacity = 0.45) => {
    const key = 'shadow@' + Math.round(opacity * 20) / 20;
    let m = mcache.get(key);
    if (!m) { m = P.mat('shadow').clone(); m.opacity = Math.round(opacity * 20) / 20; mcache.set(key, m); }
    const mesh = new THREE.Mesh(G('shadowPlane', () => new THREE.PlaneGeometry(1, 1).rotateX(-PI / 2)), m);
    mesh.scale.set(w, 1, d); mesh.position.y = 0.002; mesh.renderOrder = -1;
    mesh.castShadow = false; mesh.receiveShadow = false; mesh.name = 'softShadow';
    return mesh;
  };
  P.setShadows = (obj, cast = true, receive = true) => {
    obj.traverse((o) => { if (o.isMesh) { if (o.name === 'softShadow' || (o.material && o.material.transparent && !o.material.alphaTest)) { o.castShadow = false; o.receiveShadow = false; return; } o.castShadow = cast; o.receiveShadow = receive; } });
    return obj;
  };

  // =====================================================================================
  // CROCHET CAT
  // =====================================================================================
  const CAT_DEF = { body: '#EFE4D6', belly: null, ears: null, eyes: 'button', size: 0.18, pose: 'sit', tuxedo: false };
  /* (fix v3, review #6) P.eyeScale > 1 makes the button eyes (and the nose) bigger and darker for pieces seen small through
     the paint: the round display sets 1.7 while it builds (the real pieces have big safety eyes). It is part of the cache
     key only when it is not 1, so every other build is unchanged. */
  P.eyeScale = 1;
  const eyeOpt = () => (P.eyeScale !== 1 ? { eyeScale: P.eyeScale } : {});
  P.crochetCat = (opts = {}) => {
    const o = Object.assign({}, CAT_DEF, eyeOpt(), opts);
    const g = cached(keyOf('cat', o), () => buildCat(o));
    return g;
  };
  function buildCat(o) {
    const u = o.size / 0.18;
    const k = new Kit(u, 0.0064);
    let body = o.body, belly = o.belly, muzzle = o.muzzle || null, feet = o.feet || null, tailTip = null;
    if (o.tuxedo) {
      if (!opts_has(o, 'body')) body = '#34302D';
      belly = '#F6F1E9'; muzzle = '#F6F1E9'; feet = '#F6F1E9'; tailTip = null;
    }
    const pts = o.points || null; // siamese colour points
    const earCol = pts || body, legCol = pts || body, tailCol = pts || body;
    const earIn = o.ears || (lum(body) < 0.12 ? '#C99A92' : '#EDB7AA');
    const dark = lum(body) < 0.12;
    const head = o.pose === 'loaf' ? { c: [0, 0.1, 0.045], r: [0.06, 0.05, 0.051] } : { c: [0, 0.122, 0.006], r: [0.062, 0.052, 0.053] };
    const hy = head.c[1], hz = head.c[2];
    // --- head
    k.add('knit', sph(18, 14), { p: head.c, s: head.r, c: body, ao: 0.18 });
    // --- ears (+ inner felt, + optional lynx tufts)
    for (const sx of [-1, 1]) {
      const r = [-0.12, 0, -sx * 0.36];
      k.add('knit', cone(12), { p: [sx * 0.036, hy + 0.049, hz - 0.008], r, s: [0.021, 0.038, 0.0115], c: earCol });
      k.add('felt', cone(10), { p: [sx * 0.035, hy + 0.046, hz], r, s: [0.0125, 0.024, 0.004], c: earIn });
      if (o.tufts) k.add('felt', cone(6), { p: [sx * 0.046, hy + 0.074, hz - 0.008], r: [-0.1, 0, -sx * 0.3], s: [0.0042, 0.02, 0.0042], c: shadeHex(earCol, -0.25) });
    }
    // --- face
    const es = o.eyeScale || 1, ez = (1 + es) / 2;
    const eyeY = -0.06 - (es - 1) * 0.03, eyeX = 0.4 + (es - 1) * 0.03;
    for (const sx of [-1, 1]) {
      if (o.eyes === 'sleepy') {
        k.onSurf('button', tor(0.16, 4, 10, PI), head, [sx * eyeX, eyeY, 1], [0.0075 * es, 0.0075 * es, 0.0075 * ez], { r: [0, 0, PI], sink: -0.1, c: '#2A2420' });
      } else {
        const ec = o.eyeColor || (dark ? '#C2B04E' : null);
        if (ec) {
          k.onSurf('button', sph(10, 6), head, [sx * eyeX, eyeY, 1], [0.0092 * es, 0.0092 * es, 0.0045 * ez], { c: ec, sink: 0.25 });
          k.onSurf('button', sph(8, 6), head, [sx * eyeX, eyeY, 1], [0.0042 * es, 0.0072 * es, 0.0038 * ez], { c: '#1F1A17', sink: -0.55 });
        } else {
          k.onSurf('button', sph(10, 6), head, [sx * eyeX, eyeY, 1], [0.0078 * es, 0.0078 * es, 0.0045 * ez], { c: '#26201C', sink: 0.2 });
        }
        k.onSurf('button', sph(6, 4), head, [sx * eyeX - 0.08 * es, eyeY + 0.09 * es, 1], [0.0019 * es, 0.0019 * es, 0.0012 * ez], { c: '#FFFFFF', sink: -2.2 });
      }
      k.onSurf('felt', sph(10, 6), head, [sx * 0.72, -0.3, 0.72], [0.0105, 0.0072, 0.0025], { c: o.cheek || '#EFB0A3', sink: 0.2 });
    }
    if (muzzle) k.patch('knit', head, [0, -0.38, 1], 0.5, muzzle, { lift: 1.025, squash: [new THREE.Vector3(0, 1, 0), 0.72] });
    if (pts) k.patch('knit', head, [0, -0.3, 1], 0.4, T.mixHex(pts, body, 0.3), { lift: 1.025, squash: [new THREE.Vector3(0, 1, 0), 0.8] });
    k.onSurf('felt', sph(10, 6), head, [0, -0.2 - (es - 1) * 0.04, 1], [0.0064 * ez, 0.0047 * ez, 0.0045], { c: o.nose || (es > 1 ? '#5A3A34' : '#D9958C'), sink: 0.1 });
    for (const sx of [-1, 1]) k.onSurf('button', tor(0.2, 4, 10, PI), head, [sx * 0.07, -0.33, 1], [0.0047, 0.0047, 0.0047], { r: [0, 0, PI], sink: -0.15, c: '#4A3A32' });
    // forehead stripes (tabby)
    if (o.stripes) {
      for (const dx of [-0.24, 0, 0.24]) k.patch('knit', head, [dx, 0.85, 0.55], 0.12, o.stripes, { lift: 1.028, squash: [new THREE.Vector3(1, 0, 0), 0.4] });
      for (const sx of [-1, 1]) for (const dy of [0.05, -0.25]) k.patch('knit', head, [sx, dy, -0.05], 0.13, o.stripes, { lift: 1.028, squash: [new THREE.Vector3(0, 1, 0), 0.38] });
    }
    // patches (calico etc.): {c, dir:[x,y,z], a, on:'head'|'body'}
    const bodyLow = { c: [0, 0.046, 0], r: [0.052, 0.05, 0.047] };
    if (o.pose === 'loaf') {
      bodyLow.c = [0, 0.044, -0.012]; bodyLow.r = [0.054, 0.044, 0.068];
    }
    for (const pt of o.patches || []) k.patch('knit', pt.on === 'body' ? bodyLow : head, pt.dir, pt.a || 0.4, pt.c, { lift: pt.on === 'body' ? 1.03 : 1.026 });

    if (o.pose === 'loaf') {
      k.add('knit', sph(16, 12), { p: bodyLow.c, s: bodyLow.r, c: body, ao: 0.3 });
      for (const sx of [-1, 1]) k.add('knit', sph(10, 8), { p: [sx * 0.02, 0.012, 0.05], s: [0.014, 0.011, 0.016], c: feet || legCol });
      if (belly) k.patch('knit', bodyLow, [0, -0.2, 1], 0.6, belly, { lift: 1.02 });
      const tail = taperTube([[0, 0.02, -0.075], [0.04, 0.014, -0.07], [0.06, 0.012, -0.03], [0.054, 0.012, 0.012]], 0.0105, 0.0082, { tubular: 16, radial: 7 });
      k.add('knit', tail, { c: tailCol });
      k.add('knit', sph(8, 6), { p: [0.054, 0.012, 0.012], s: 0.0082, c: tailTip || tailCol });
    } else {
      k.add('knit', sph(16, 12), { p: bodyLow.c, s: bodyLow.r, c: body, ao: 0.32 });
      k.add('knit', sph(12, 10), { p: [0, 0.075, 0.004], s: [0.04, 0.036, 0.035], c: body });
      if (belly) {
        if (o.tuxedo) k.patch('knit', bodyLow, [0, 0.35, 1], 0.78, belly, { lift: 1.03 });
        else k.patch('knit', bodyLow, [0, 0.1, 1], 0.62, belly, { lift: 1.025 });
        if (o.tuxedo) k.add('knit', sph(12, 10), { p: [0, 0.08, 0.026], s: [0.026, 0.026, 0.016], c: belly });
      }
      for (const sx of [-1, 1]) {
        k.add('knit', cap(1.3, 8), { p: [sx * 0.021, 0.025, 0.035], s: 0.0128, c: legCol });
        k.add('knit', sph(10, 6), { p: [sx * 0.021, 0.0105, 0.041], s: [0.0136, 0.0108, 0.015], c: feet || legCol });
        k.add('knit', sph(12, 8), { p: [sx * 0.039, 0.022, -0.004], s: [0.021, 0.021, 0.029], c: body, ao: 0.25 });
        k.add('knit', sph(10, 6), { p: [sx * 0.044, 0.0095, 0.026], s: [0.0135, 0.0095, 0.018], c: feet || legCol });
      }
      const tailPts = [[0, 0.02, -0.044], [0.032, 0.015, -0.053], [0.06, 0.016, -0.026], [0.066, 0.021, 0.008], [0.054, 0.022, 0.036], [0.033, 0.019, 0.05]];
      const tail = taperTube(tailPts, 0.0098, 0.0078, { tubular: 20, radial: 7 });
      k.add('knit', tail, { c: tailCol });
      k.add('knit', sph(8, 6), { p: tailPts[5], s: 0.0078, c: tailTip || tailCol });
      if (o.stripes) {
        for (const sx of [-1, 1]) for (const dz of [-0.55, 0.05]) k.patch('knit', bodyLow, [sx, 0.35, dz], 0.16, o.stripes, { lift: 1.03, squash: [new THREE.Vector3(0, 0, 1), 0.36] });
        for (const t of [0.25, 0.5, 0.75]) {
          tail.userData.curve.getPointAt(t, _v); tail.userData.curve.getTangentAt(t, _v2);
          const r = 0.0105 + (0.0082 - 0.0105) * t;
          k.add('knit', tor(0.35, 4, 12), { p: [_v.x, _v.y, _v.z], q: new THREE.Quaternion().setFromUnitVectors(ZUP, _v2.clone()), s: r * 1.02, c: o.stripes });
        }
      }
    }
    // accessories
    if (o.ruff) k.add('knit', lumpy(7, 0.12, 5, 16, 10), { p: [0, 0.082, 0.012], s: [0.044, 0.02, 0.04], c: o.ruff });
    if (o.bow) addBow(k, [0, 0.083, 0.04], 0.012, o.bow);
    if (o.scarf) { k.add('knit', tor(0.42, 8, 20), { p: [0, 0.083, 0.004], r: [PI / 2, 0, 0], s: [0.037, 0.037, 0.034], c: o.scarf }); k.add('knit', cap(1.6, 8), { p: [0.024, 0.06, 0.036], r: [0.15, 0, 0.2], s: [0.008, 0.012, 0.004], c: o.scarf }); }
    if (o.outfit === 'sherlock') sherlock(k, head);
    const g = k.build('crochetCat');
    g.userData.size = o.size;
    return g;
  }
  function opts_has(o, key) { return o[key] !== CAT_DEF[key]; }
  function shadeHex(hex, amt) { return T.shade(hex, amt); }
  function addBow(k, p, s, col, key = 'knit') {
    k.add(key, sph(10, 8), { p: [p[0] - s * 0.95, p[1], p[2]], r: [0, 0, 0.35], s: [s, s * 0.62, s * 0.42], c: col });
    k.add(key, sph(10, 8), { p: [p[0] + s * 0.95, p[1], p[2]], r: [0, 0, -0.35], s: [s, s * 0.62, s * 0.42], c: col });
    k.add(key, sph(8, 6), { p: [p[0], p[1], p[2] + s * 0.1], s: [s * 0.45, s * 0.45, s * 0.42], c: shadeHex(col, -0.1) });
  }
  function sherlock(k, head) {
    const tweed = '#9C7F62', check = '#B89A78';
    // deerstalker: cap + front/back peaks + tied ear flaps
    k.add('knit', partSph(0, TAU, 0, PI * 0.45, 18, 8), { p: [0, head.c[1] + 0.014, head.c[2] - 0.004], r: [-0.12, 0, 0], s: [0.066, 0.05, 0.058], c: check });
    for (const sz of [1, -1]) k.add('knit', sph(12, 6), { p: [0, head.c[1] + 0.024, head.c[2] + sz * 0.05], r: [sz * 0.5, 0, 0], s: [0.038, 0.0055, 0.024], c: tweed });
    k.add('knit', sph(8, 6), { p: [0, head.c[1] + 0.065, head.c[2] - 0.006], s: [0.009, 0.006, 0.008], c: tweed });
    // short cape over the shoulders
    k.add('knit', lathe([[0.0, 0.058], [0.064, 0.058], [0.06, 0.066], [0.046, 0.088], [0.03, 0.098]], 18, 'cape'), { p: [0, 0, 0.002], c: tweed });
    k.add('felt', sph(8, 6), { p: [0, 0.086, 0.045], s: 0.0045, c: '#5A4636' });
  }

  // =====================================================================================
  // CROCHET ANIMALS
  // =====================================================================================
  P.crochetAnimal = (kind = 'bunny', opts = {}) => {
    const o = Object.assign({ size: 0.16 }, eyeOpt(), opts);
    return cached(keyOf('animal:' + kind, o), () => buildAnimal(kind, o));
  };
  function animalBase(k, o, { body, belly, headR = [0.058, 0.052, 0.052], headY = 0.118, legs = true, arms = true, legCol = null, armCol = null }) {
    const head = { c: [0, headY, 0.006], r: headR };
    k.add('knit', sph(18, 14), { p: head.c, s: head.r, c: o.headCol || body, ao: 0.18 });
    const bodyE = { c: [0, 0.046, 0], r: [0.05, 0.05, 0.046] };
    k.add('knit', sph(16, 12), { p: bodyE.c, s: bodyE.r, c: body, ao: 0.32 });
    if (belly) k.patch('knit', bodyE, [0, 0.05, 1], 0.6, belly, { lift: 1.025 });
    for (const sx of [-1, 1]) {
      if (arms) k.add('knit', cap(1.2, 10), { p: [sx * 0.04, 0.052, 0.02], r: [0.3, 0, sx * 0.5], s: 0.012, c: armCol || body });
      if (legs) {
        k.add('knit', cap(1.0, 10), { p: [sx * 0.026, 0.014, 0.034], r: [PI / 2 - 0.15, 0, 0], s: 0.0135, c: legCol || body });
        k.add('knit', sph(10, 8), { p: [sx * 0.026, 0.016, 0.06], s: [0.0136, 0.0136, 0.007], c: shadeHex(legCol || body, 0.12) });
      }
    }
    return { head, bodyE };
  }
  let faceES = 1;   // eye scale of the animal being built (buildAnimal sets it)
  function faceButtons(k, head, { eyeX = 0.38, eyeY = -0.04, cheek = '#EFB0A3', nose = null, noseDir = [0, -0.22, 1], noseS = [0.0062, 0.0046, 0.0045] } = {}) {
    const es = faceES, ez = (1 + es) / 2;
    if (es > 1) { eyeX += (es - 1) * 0.03; if (nose) { nose = '#4A3430'; noseS = noseS.map((v, i) => (i < 2 ? v * ez : v)); } }
    for (const sx of [-1, 1]) {
      k.onSurf('button', sph(10, 6), head, [sx * eyeX, eyeY, 1], [0.0072 * es, 0.0072 * es, 0.0042 * ez], { c: '#26201C', sink: 0.2 });
      k.onSurf('button', sph(6, 4), head, [sx * eyeX - 0.08 * es, eyeY + 0.09 * es, 1], [0.0018 * es, 0.0018 * es, 0.0012 * ez], { c: '#FFFFFF', sink: -2.2 });
      if (cheek) k.onSurf('felt', sph(10, 6), head, [sx * 0.7, -0.3, 0.72], [0.0098, 0.0068, 0.0025], { c: cheek, sink: 0.2 });
    }
    if (nose) k.onSurf('felt', sph(10, 6), head, noseDir, noseS, { c: nose, sink: 0.1 });
  }
  function buildAnimal(kind, o) {
    faceES = o.eyeScale || 1;
    const u = o.size / 0.16;
    const k = new Kit(u, 0.0062);
    if (kind === 'bunny') {
      const body = o.body || '#EADCCB';
      const { head, bodyE } = animalBase(k, o, { body, belly: '#F8F1E7' });
      for (const sx of [-1, 1]) {
        k.add('knit', cap(2.6, 10), { p: [sx * 0.022, 0.2, -0.004], r: [-0.08, 0, -sx * 0.16], s: [0.0135, 0.0135, 0.0075], c: body });
        k.add('felt', cap(2.2, 8), { p: [sx * 0.022, 0.198, 0.003], r: [-0.08, 0, -sx * 0.16], s: [0.0075, 0.0085, 0.003], c: '#EDB3A6' });
      }
      faceButtons(k, head, { nose: '#D9958C' });
      k.patch('knit', head, [0, -0.36, 1], 0.42, '#F8F1E7', { lift: 1.025, squash: [new THREE.Vector3(0, 1, 0), 0.7] });
      k.add('boucle', sph(10, 8), { p: [0, 0.03, -0.048], s: 0.016, c: '#FBF6EE' });
      if (o.bow !== false) addBow(k, [0, 0.074, 0.036], 0.011, o.bow || '#A9BCA0');
    } else if (kind === 'bear') {
      const body = o.body || '#C9A27C';
      const { head } = animalBase(k, o, { body, belly: '#EBD8BF' });
      for (const sx of [-1, 1]) {
        k.add('knit', sph(12, 8), { p: [sx * 0.044, 0.16, -0.002], s: [0.017, 0.017, 0.009], c: body });
        k.add('felt', sph(10, 6), { p: [sx * 0.044, 0.159, 0.006], s: [0.009, 0.009, 0.003], c: '#E8C8A8' });
      }
      k.onSurf('knit', sph(14, 10), head, [0, -0.35, 1], [0.024, 0.018, 0.016], { c: '#EFE0CA', sink: 0.55 });
      faceButtons(k, head, { eyeX: 0.36, eyeY: 0.0, nose: '#4A3A32', noseDir: [0, -0.22, 1], noseS: [0.0075, 0.0055, 0.006] });
      if (o.scarf !== false) { k.add('knit', tor(0.4, 8, 20), { p: [0, 0.078, 0.004], r: [PI / 2, 0, 0], s: [0.034, 0.034, 0.032], c: o.scarf || '#EFC5B9' }); }
    } else if (kind === 'duck') {
      const body = o.body || '#F1DCA4';
      const head = { c: [0, 0.112, 0.008], r: [0.05, 0.047, 0.048] };
      k.add('knit', sph(18, 14), { p: head.c, s: head.r, c: body, ao: 0.15 });
      const bodyE = { c: [0, 0.045, -0.004], r: [0.054, 0.048, 0.056] };
      k.add('knit', sph(16, 12), { p: bodyE.c, s: bodyE.r, c: body, ao: 0.3 });
      k.add('knit', cone(10), { p: [0, 0.07, -0.058], r: [-1.2, 0, 0], s: [0.016, 0.03, 0.01], c: body });
      for (const sx of [-1, 1]) {
        k.add('knit', sph(12, 8), { p: [sx * 0.052, 0.052, -0.006], r: [0.3, 0, sx * 0.3], s: [0.012, 0.03, 0.026], c: shadeHex(body, -0.05) });
        k.add('knit', sph(10, 6), { p: [sx * 0.024, 0.006, 0.042], s: [0.017, 0.006, 0.02], c: '#E7AE7E' });
      }
      k.onSurf('knit', sph(14, 8), head, [0, -0.3, 1], [0.022, 0.009, 0.02], { c: '#E9AF80', sink: 0.6 });
      faceButtons(k, head, { eyeX: 0.42, eyeY: 0.05, cheek: '#EFB0A3' });
      k.add('knit', sph(8, 6), { p: [0, 0.162, 0.004], r: [0, 0, 0.4], s: [0.006, 0.012, 0.006], c: body });
      if (o.pocket !== false) {
        k.add('knit', rbg(1, 1, 1, 0.25), { p: [0, 0.036, 0.05], r: [-0.2, 0, 0], s: [0.04, 0.03, 0.01], c: '#A9BCA0' });
        // daisy peeking out of the pocket
        k.add('clay', cyl(6), { p: [0.008, 0.06, 0.054], s: [0.0016, 0.03, 0.0016], c: '#7F9A7A' });
        for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; k.add('felt', sph(8, 4), { p: [0.008 + Math.cos(a) * 0.0085, 0.076 + Math.sin(a) * 0.0085, 0.058], r: [0, 0, a], s: [0.0062, 0.0026, 0.0018], c: '#FBF6EE' }); }
        k.add('felt', sph(8, 6), { p: [0.008, 0.076, 0.0595], s: [0.0035, 0.0035, 0.002], c: '#E8C77E' });
      }
    } else if (kind === 'sheep') {
      const fleece = o.body || '#F6F0E6', face = o.face || '#8E7262';
      const bodyE = { c: [0, 0.05, -0.002], r: [0.058, 0.052, 0.056] };
      k.add('boucle', lumpy(11, 0.06, 7, 22, 16), { p: bodyE.c, s: bodyE.r, c: fleece, ao: 0.25 });
      const head = { c: [0, 0.112, 0.024], r: [0.04, 0.042, 0.04] };
      k.add('knit', sph(18, 14), { p: head.c, s: head.r, c: face, ao: 0.12 });
      k.add('boucle', lumpy(12, 0.08, 6, 14, 10), { p: [0, 0.145, 0.016], s: [0.036, 0.022, 0.032], c: fleece });
      for (const sx of [-1, 1]) {
        k.add('knit', sph(10, 8), { p: [sx * 0.046, 0.118, 0.016], r: [0, 0, sx * 0.4], s: [0.02, 0.008, 0.011], c: face });
        k.add('knit', cap(1.0, 8), { p: [sx * 0.026, 0.012, 0.04], r: [PI / 2 - 0.2, 0, 0], s: 0.012, c: face });
      }
      faceButtons(k, head, { eyeX: 0.42, eyeY: 0.0, cheek: '#E6A79A', nose: '#5A4636', noseDir: [0, -0.4, 1], noseS: [0.0055, 0.004, 0.004] });
      if (o.bell !== false) { k.add('metal', sph(10, 8), { p: [0, 0.072, 0.054], s: 0.0065, c: HEX.roseGold }); k.add('knit', tor(0.3, 6, 18), { p: [0, 0.08, 0.014], r: [PI / 2 + 0.2, 0, 0], s: [0.038, 0.038, 0.034], c: '#EFC5B9' }); }
    } else if (kind === 'giraffe') {
      const body = o.body || '#EDD3A2', spot = '#C49A6C';
      const bodyE = { c: [0, 0.042, -0.006], r: [0.046, 0.044, 0.05] };
      k.add('knit', sph(16, 12), { p: bodyE.c, s: bodyE.r, c: body, ao: 0.3 });
      k.add('knit', cap(2.2, 12), { p: [0, 0.105, 0.012], r: [0.12, 0, 0], s: 0.02, c: body });
      const head = { c: [0, 0.168, 0.026], r: [0.04, 0.036, 0.044] };
      k.add('knit', sph(18, 14), { p: head.c, s: head.r, c: body, ao: 0.1 });
      k.onSurf('knit', sph(14, 10), head, [0, -0.35, 1], [0.026, 0.02, 0.016], { c: '#F5E4C8', sink: 0.6 });
      for (const sx of [-1, 1]) {
        k.add('knit', cap(1.2, 8), { p: [sx * 0.014, 0.205, 0.016], r: [0, 0, -sx * 0.12], s: 0.0045, c: body });
        k.add('knit', sph(8, 6), { p: [sx * 0.016, 0.218, 0.016], s: 0.0065, c: '#8E7262' });
        k.add('knit', sph(10, 6), { p: [sx * 0.04, 0.182, 0.012], r: [0, 0, sx * 0.6], s: [0.015, 0.006, 0.008], c: body });
        k.add('knit', cap(1.0, 8), { p: [sx * 0.024, 0.012, 0.036], r: [PI / 2 - 0.15, 0, 0], s: 0.0115, c: body });
        k.add('knit', sph(8, 6), { p: [sx * 0.024, 0.013, 0.058], s: [0.0118, 0.0118, 0.006], c: '#8E7262' });
      }
      faceButtons(k, head, { eyeX: 0.45, eyeY: 0.1 });
      const spots = [[0.6, 0.5, 0.6, 'b'], [-0.7, 0.3, 0.4, 'b'], [0.2, 0.7, -0.6, 'b'], [-0.3, 0.2, -0.9, 'b'], [0.9, -0.1, -0.3, 'b'], [-0.85, -0.05, 0.3, 'b']];
      for (const [x, y, z] of spots) k.patch('knit', bodyE, [x, y, z], 0.2, spot, { lift: 1.028 });
      const neck = { c: [0, 0.105, 0.012], r: [0.02, 0.042, 0.02] };
      for (const [x, y, z] of [[0.8, 0.3, 0.6], [-0.8, -0.2, 0.5], [0.7, -0.5, -0.4], [-0.6, 0.6, -0.5]]) k.patch('knit', neck, [x, y, z], 0.3, spot, { lift: 1.07 });
    } else if (kind === 'horse') {
      const body = o.body || '#D9BFA0', mane = o.mane || '#8E6A52';
      animalBase(k, o, { body, belly: null, headR: [0.001, 0.001, 0.001], headY: 0.05, arms: false });
      const head = { c: [0, 0.122, 0.012], r: [0.046, 0.05, 0.048] };
      k.add('knit', sph(18, 14), { p: head.c, s: head.r, c: body, ao: 0.12 });
      k.onSurf('knit', sph(16, 12), head, [0, -0.45, 1], [0.034, 0.026, 0.028], { c: '#EAD9C4', sink: 0.65 });
      for (const sx of [-1, 1]) {
        k.add('knit', cone(10), { p: [sx * 0.024, 0.176, 0.0], r: [0, 0, -sx * 0.25], s: [0.0115, 0.026, 0.007], c: body });
        k.add('knit', cap(1.2, 10), { p: [sx * 0.04, 0.052, 0.02], r: [0.3, 0, sx * 0.45], s: 0.012, c: body });
        k.onSurf('button', sph(8, 6), head, [sx * 0.2, -0.62, 1], [0.0035, 0.0025, 0.002], { c: '#6B4F40', sink: -0.2 });
      }
      for (let i = 0; i < 7; i++) {
        const t = i / 6;
        k.add('knit', sph(10, 8), { p: [0, 0.158 - t * 0.07 + Math.sin(t * PI) * 0.004, -0.03 - t * 0.022], s: [0.007, 0.012, 0.011], c: mane });
      }
      k.add('knit', sph(10, 8), { p: [0.003, 0.158, 0.04], r: [1.0, 0, 0.25], s: [0.011, 0.016, 0.006], c: mane });
      k.add('knit', taperTube([[0, 0.04, -0.045], [0, 0.03, -0.065], [0.01, 0.01, -0.07]], 0.009, 0.012, { tubular: 10, radial: 8 }), { c: mane });
      faceButtons(k, head, { eyeX: 0.5, eyeY: 0.12, cheek: '#EBAFA2' });
    }
    const g = k.build('crochetAnimal');
    g.userData.size = o.size; g.userData.kind = kind;
    return g;
  }

  // =====================================================================================
  // CROCHET DOLLS
  // =====================================================================================
  const DOLL_DEF = { skin: '#F2D3BC', hair: '#8E6A52', hairStyle: 'short', dress: '#EFC5B9', hat: null, size: 0.24, outfit: 'dress' };
  P.crochetDoll = (opts = {}) => {
    const o = Object.assign({}, DOLL_DEF, eyeOpt(), opts);
    return cached(keyOf('doll', o), () => buildDoll(o));
  };
  function buildDoll(o) {
    const u = o.size / 0.24;
    const k = new Kit(u, 0.0058);
    const skin = o.skin;
    const head = { c: [0, 0.19, 0.0], r: [0.052, 0.05, 0.05] };
    k.add('knit', sph(18, 14), { p: head.c, s: head.r, c: skin, ao: 0.1 });
    // face
    const des = o.eyeScale || 1, dez = (1 + des) / 2;
    for (const sx of [-1, 1]) {
      k.onSurf('button', sph(10, 8), head, [sx * 0.36, -0.12, 1], [0.0052 * des, 0.0052 * des, 0.003 * dez], { c: '#2B231F', sink: 0.2 });
      k.onSurf('button', sph(6, 4), head, [sx * 0.36 - 0.07 * des, -0.04, 1], [0.0013 * des, 0.0013 * des, 0.0009 * dez], { c: '#FFFFFF', sink: -2.4 });
      k.onSurf('felt', sph(10, 6), head, [sx * 0.62, -0.36, 0.78], [0.0088, 0.006, 0.002], { c: '#EFAEA0', sink: 0.2 });
    }
    k.onSurf('knit', sph(8, 6), head, [0, -0.3, 1], [0.0048, 0.004, 0.004], { c: shadeHex(skin, -0.04), sink: 0.2 });
    k.onSurf('button', tor(0.22, 4, 10, PI), head, [0, -0.48, 1], [0.0045, 0.0045, 0.0045], { r: [0, 0, PI], sink: -0.1, c: '#B9706A' });
    // hair
    const hair = o.hair, hs = o.hairStyle;
    const hr = [head.r[0] * 1.08, head.r[1] * 1.08, head.r[2] * 1.08];
    k.add('knit', partSph(0, TAU, 0, PI * 0.56, 18, 8), { p: [0, head.c[1] + 0.002, head.c[2] - 0.002], r: [-0.62, 0, 0], s: hr, c: hair, ao: 0.1 });
    // fringe bumps
    if (hs !== 'colonial') for (let i = -2; i <= 2; i++) k.onSurf('knit', sph(10, 6), head, [i * 0.2, 0.5, 0.8], [0.012, 0.009, 0.007], { c: hair, sink: -0.05 });
    if (hs === 'braids') {
      for (const sx of [-1, 1]) {
        for (let i = 0; i < 5; i++) k.add('knit', sph(10, 8), { p: [sx * (0.05 + i * 0.002), 0.175 - i * 0.014, -0.008 + i * 0.003], s: [0.0098 - i * 0.0006, 0.0088, 0.0098 - i * 0.0006], c: hair });
        addBow(k, [sx * 0.06, 0.106, 0.006], 0.0065, o.ribbon || '#A9BCA0');
      }
    } else if (hs === 'bun') {
      k.add('knit', sph(12, 10), { p: [0, 0.236, -0.026], s: 0.019, c: hair });
      if (o.ribbon) k.add('knit', tor(0.3, 6, 16), { p: [0, 0.226, -0.02], r: [1.2, 0, 0], s: 0.016, c: o.ribbon });
    } else if (hs === 'colonial') {
      for (const sx of [-1, 1]) for (const dy of [0.0, -0.016]) k.add('knit', cap(1.4, 10), { p: [sx * 0.052, head.c[1] + dy, -0.008], r: [PI / 2, 0, 0], s: 0.0088, c: hair });
      k.add('knit', cap(1.6, 8), { p: [0, 0.16, -0.056], r: [0.3, 0, 0], s: 0.0075, c: hair });
      addBow(k, [0, 0.175, -0.058], 0.0075, '#3E3A40');
    } else if (hs === 'long') {
      k.add('knit', partSph(0, TAU, PI * 0.3, PI * 0.45, 18, 8), { p: [0, 0.17, -0.012], s: [0.058, 0.07, 0.05], c: hair });
    } else { // short
      for (const sx of [-1, 1]) k.add('knit', sph(10, 8), { p: [sx * 0.05, 0.178, -0.006], s: [0.012, 0.018, 0.016], c: hair });
    }
    // body / outfit
    const dress = o.dress;
    for (const sx of [-1, 1]) {
      const legC = o.legs || (o.outfit === 'coat' ? '#F1E8DA' : skin);
      k.add('knit', cap(1.6, 10), { p: [sx * 0.014, 0.034, 0.0], s: 0.0105, c: legC });
      k.add('knit', sph(10, 8), { p: [sx * 0.015, 0.0085, 0.006], s: [0.0118, 0.0085, 0.016], c: o.shoes || '#5A4636' });
      if (o.boots) k.add('knit', cap(1.0, 10), { p: [sx * 0.014, 0.022, 0.001], s: [0.0118, 0.012, 0.0118], c: o.boots });
      // arms
      k.add('knit', cap(1.9, 10), { p: [sx * 0.037, 0.118, 0.006], r: [0.12, 0, sx * 0.42], s: 0.0098, c: o.sleeves || (o.outfit === 'coat' ? o.coat : dress) });
      k.add('knit', sph(10, 8), { p: [sx * 0.046, 0.097, 0.011], s: 0.0095, c: skin });
    }
    if (o.outfit === 'coat') {
      const coat = o.coat || '#44526B';
      k.add('knit', lathe([[0.0, 0.058], [0.035, 0.058], [0.034, 0.08], [0.031, 0.13], [0.026, 0.15], [0.0, 0.153]], 18, 'dollCoat'), { c: coat, ao: 0.2 });
      k.add('knit', rbg(1, 1, 1, 0.3), { p: [0, 0.103, 0.03], s: [0.026, 0.05, 0.008], c: o.waistcoat || '#E2CDA8' });
      for (const sx of [-1, 1]) {
        k.add('knit', sph(10, 6), { p: [sx * 0.016, 0.06, -0.03], r: [0.25, 0, 0], s: [0.014, 0.03, 0.006], c: coat });
        k.add('knit', sph(10, 6), { p: [sx * 0.03, 0.146, 0.0], r: [0, 0, -sx * 0.35], s: [0.014, 0.006, 0.014], c: o.epaulette || shadeHex(coat, 0.12) });
      }
      k.add('knit', sph(10, 8), { p: [0, 0.143, 0.024], s: [0.013, 0.01, 0.009], c: o.cravat || '#FBF6EE' });
      for (let i = 0; i < 3; i++) k.add('metal', sph(6, 4), { p: [0, 0.118 - i * 0.014, 0.035], s: 0.0022, c: HEX.roseGold });
    } else if (o.outfit === 'empire') {
      k.add('knit', lathe([[0, 0.006], [0.044, 0.006], [0.046, 0.012], [0.04, 0.06], [0.031, 0.125], [0.03, 0.128], [0.026, 0.148], [0.0, 0.15]], 18, 'dollEmpire'), { c: dress, ao: 0.22 });
      k.add('knit', tor(0.16, 6, 20), { p: [0, 0.126, 0], r: [PI / 2, 0, 0], s: [0.0315, 0.0315, 0.026], c: o.sash || '#FBF6EE' });
      k.add('knit', sph(10, 6), { p: [0, 0.145, 0.02], s: [0.022, 0.006, 0.01], c: '#FBF6EE' });
    } else {
      k.add('knit', lathe([[0, 0.045], [0.047, 0.045], [0.046, 0.05], [0.034, 0.1], [0.03, 0.13], [0.026, 0.15], [0.0, 0.152]], 18, 'dollDress'), { c: dress, ao: 0.22 });
      if (o.pinafore) k.add('knit', rbg(1, 1, 1, 0.25), { p: [0, 0.085, 0.034], r: [-0.18, 0, 0], s: [0.04, 0.07, 0.008], c: o.pinafore });
      k.add('knit', tor(0.3, 6, 20), { p: [0, 0.146, 0.002], r: [PI / 2, 0, 0], s: [0.022, 0.022, 0.018], c: o.collar || '#FBF6EE' });
    }
    // hats
    const top = head.c[1] + head.r[1];
    if (o.hat === 'tricorn') {
      const col = o.hatColor || '#3E3A40';
      k.add('knit', partSph(0, TAU, 0, PI * 0.5, 16, 6), { p: [0, top - 0.012, -0.006], s: [0.05, 0.028, 0.05], c: col });
      k.add('felt', tricornBrim(), { p: [0, top - 0.014, -0.006], r: [-0.08, 0, 0], c: col });
      k.add('felt', sph(8, 6), { p: [0.026, top + 0.002, 0.036], r: [-0.5, 0, 0], s: [0.007, 0.007, 0.003], c: '#FBF6EE' });
    } else if (o.hat === 'bonnet') {
      const col = o.hatColor || '#FBF6EE';
      k.add('knit', partSph(0, TAU, 0, PI * 0.6, 18, 8), { p: [0, head.c[1] + 0.003, head.c[2] - 0.006], r: [-0.95, 0, 0], s: [0.058, 0.058, 0.057], c: col });
      k.add('knit', tor(0.2, 6, 22, PI * 1.1), { p: [0, head.c[1] + 0.006, 0.012], r: [-0.42, 0, -PI * 0.05], s: [0.055, 0.055, 0.055], c: col });
      addBow(k, [0.034, 0.152, 0.03], 0.007, o.ribbon || '#EFC5B9');
    } else if (o.hat === 'straw') {
      const col = o.hatColor || '#E6D3A6';
      k.add('weave', cyl(22), { p: [0, top - 0.02, -0.014], r: [-0.22, 0, 0], s: [0.068, 0.004, 0.068], c: col });
      k.add('weave', cyl(18, 0.85, 1), { p: [0, top - 0.009, -0.017], r: [-0.22, 0, 0], s: [0.042, 0.022, 0.042], c: col });
      k.add('knit', cyl(18), { p: [0, top - 0.015, -0.016], r: [-0.22, 0, 0], s: [0.0435, 0.007, 0.0435], c: o.ribbon || '#A9BCA0' });
    } else if (o.hat === 'topHat') {
      const col = o.hatColor || '#3E3A40';
      k.add('knit', cyl(18), { p: [0, top + 0.002, -0.004], s: [0.06, 0.005, 0.06], c: col });
      k.add('knit', cyl(18, 1, 0.95), { p: [0, top + 0.026, -0.004], s: [0.035, 0.045, 0.035], c: col });
    }
    const g = k.build('crochetDoll');
    g.userData.size = o.size;
    return g;
  }
  function tricornBrim() {
    return G('tricornBrim', () => {
      const sh = new THREE.Shape(); const R = 0.062, n = 3;
      for (let i = 0; i <= 60; i++) {
        const a = i / 60 * TAU + PI / 2;
        const r = R * (0.82 + 0.18 * Math.cos(n * (a - PI / 2)));
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        i ? sh.lineTo(x, y) : sh.moveTo(x, y);
      }
      const g = new THREE.ExtrudeGeometry(sh, { depth: 0.002, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2, curveSegments: 8 });
      g.rotateX(-PI / 2);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i); const d = Math.hypot(x, z); pos.setY(i, pos.getY(i) + Math.max(0, d - 0.04) * 0.75); }
      g.computeVertexNormals();
      return tag(g, 'flat');
    });
  }

  // =====================================================================================
  // FABRIC (LINEN) DOLL, BACKPACK, KEYCHAIN, POUCH
  // =====================================================================================
  P.fabricDoll = (opts = {}) => {
    const o = Object.assign({ skin: '#F3E2D0', hair: '#8E6A52', dress: '#EFC5B9', size: 0.15, pattern: null }, opts);
    return cached(keyOf('fabricDoll', o), () => { const k = new Kit(o.size / 0.15); fabricDollParts(k, o, [0, 0, 0]); const g = k.build('fabricDoll'); return g; });
  };
  function fabricDollParts(k, o, off) {
    const [ox, oy, oz] = off;
    const P3 = (x, y, z) => [ox + x, oy + y, oz + z];
    const head = { c: P3(0, 0.112, 0), r: [0.033, 0.032, 0.0135] };
    k.add('linenVC', sph(18, 12), { p: head.c, s: head.r, c: o.skin });
    // hair cap + pigtails
    k.add('linenVC', partSph(0, TAU, 0, PI * 0.42, 18, 6), { p: P3(0, 0.113, 0), s: [0.0355, 0.0345, 0.0155], c: o.hair });
    for (const sx of [-1, 1]) k.add('felt', sph(10, 8), { p: P3(sx * 0.035, 0.104, 0), s: [0.009, 0.011, 0.008], c: o.hair });
    // face
    for (const sx of [-1, 1]) {
      k.add('button', sph(8, 6), { p: P3(sx * 0.011, 0.108, 0.0128), s: [0.0028, 0.0028, 0.0016], c: '#2B231F' });
      k.add('felt', sph(10, 6), { p: P3(sx * 0.019, 0.1, 0.0115), s: [0.0058, 0.0042, 0.0016], c: '#EFAEA0' });
    }
    k.add('button', tor(0.25, 4, 8, PI), { p: P3(0, 0.099, 0.0132), r: [0, 0, PI], s: 0.0032, c: '#B9706A' });
    // running stitch round the head
    for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; k.add('felt', box(), { p: P3(Math.cos(a) * 0.0335, 0.112 + Math.sin(a) * 0.0325, 0), r: [0, 0, a + PI / 2], s: [0.0045, 0.0013, 0.012], c: o.thread || '#C9937E' }); }
    // dress (flattened A-line) + arms + legs
    const dressCol = o.pattern === 'americana' ? '#5E6C86' : o.dress;
    k.add('linenVC', cone(16), { p: P3(0, 0.058, 0), s: [0.04, 0.066, 0.016], c: dressCol });
    k.add('linenVC', sph(14, 10), { p: P3(0, 0.084, 0), s: [0.022, 0.016, 0.0125], c: dressCol });
    if (o.pattern === 'americana') {
      for (const y of [0.034, 0.046]) k.add('linenVC', cyl(16, 0.9, 1), { p: P3(0, y, 0), s: [0.041 - (y - 0.025) * 0.55, 0.005, 0.0168 - (y - 0.025) * 0.2], c: '#F4EBDD' });
      k.add('felt', heartGeo(), { p: P3(0, 0.07, 0.0128), s: 0.009, c: '#C9937E' });
    } else {
      k.add('linenVC', rbg(1, 1, 1, 0.3), { p: P3(0, 0.05, 0.011), r: [-0.08, 0, 0], s: [0.034, 0.032, 0.004], c: o.apron || '#FBF6EE' });
      k.add('felt', heartGeo(), { p: P3(0, 0.054, 0.0138), s: 0.006, c: o.heart || '#C9937E' });
    }
    k.add('linenVC', sph(10, 8), { p: P3(0, 0.094, 0.0), s: [0.014, 0.006, 0.0125], c: '#FBF6EE' });
    for (const sx of [-1, 1]) {
      k.add('linenVC', cap(1.8, 8), { p: P3(sx * 0.028, 0.074, 0), r: [0, 0, sx * 0.7], s: [0.0075, 0.0075, 0.0058], c: dressCol });
      k.add('linenVC', sph(8, 6), { p: P3(sx * 0.038, 0.064, 0), s: [0.0075, 0.0075, 0.0058], c: o.skin });
      k.add('linenVC', cap(2.2, 8), { p: P3(sx * 0.012, 0.016, 0), s: [0.0072, 0.0072, 0.006], c: o.legs || '#F4EBDD' });
      k.add('felt', sph(8, 6), { p: P3(sx * 0.012, 0.0045, 0.002), s: [0.0082, 0.0055, 0.0085], c: o.shoes || '#8E6A52' });
    }
  }
  function heartGeo() {
    return G('heart', () => {
      const s = new THREE.Shape();
      s.moveTo(0, -0.7);
      s.bezierCurveTo(-1.3, 0.1, -0.7, 1.05, 0, 0.42);
      s.bezierCurveTo(0.7, 1.05, 1.3, 0.1, 0, -0.7);
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.18, bevelSize: 0.16, bevelSegments: 3, curveSegments: 10 });
      g.translate(0, 0, -0.06);
      return tag(g, 'flat');
    });
  }
  P.backpack = (opts = {}) => {
    const o = Object.assign({ hex: '#E9DCCB', pocket: null, doll: {} }, opts);
    return cached(keyOf('backpack', o), () => {
      const k = new Kit(1);
      const c = o.hex, pc = o.pocket || shadeHex(c, -0.08);
      k.add('linenVC', rbg(0.13, 0.15, 0.065, 0.026, 3), { p: [0, 0.075, 0], c, ao: 0.25 });
      k.add('linenVC', rbg(0.094, 0.06, 0.022, 0.01, 2), { p: [0, 0.05, 0.036], c: pc });
      k.add('linenVC', rbg(0.124, 0.052, 0.07, 0.022, 2), { p: [0, 0.13, 0.008], r: [-0.06, 0, 0], c: shadeHex(c, -0.04) });
      k.add('linenVC', rbg(0.022, 0.03, 0.006, 0.004, 1), { p: [0, 0.103, 0.044], c: shadeHex(c, -0.04) });
      k.add('metal', cyl(10), { p: [0, 0.097, 0.047], r: [PI / 2, 0, 0], s: [0.0055, 0.003, 0.0055], c: HEX.roseGold });
      k.add('linenVC', tor(0.18, 6, 16, PI), { p: [0, 0.155, -0.008], s: [0.022, 0.022, 0.022], c: shadeHex(c, -0.1) });
      for (const sx of [-1, 1]) k.add('linenVC', tor(0.12, 6, 14, PI), { p: [sx * 0.035, 0.08, -0.036], r: [0, PI / 2, PI / 2], s: [0.06, 0.03, 0.03], c: shadeHex(c, -0.12) });
      // running stitch along the pocket
      for (let i = 0; i < 9; i++) k.add('felt', box(), { p: [-0.04 + i * 0.01, 0.077, 0.0475], s: [0.0055, 0.0013, 0.0016], c: '#FBF6EE' });
      // charm: little rose-gold ring and a fabric doll hanging in front
      k.add('metal', tor(0.16, 6, 16), { p: [0.04, 0.152, 0.03], r: [0, 0.3, 0], s: 0.0075, c: HEX.roseGold });
      fabricDollParts(k, Object.assign({ skin: '#F3E2D0', hair: '#8E6A52', dress: '#EFC5B9' }, o.doll), [0.04, 0.01, 0.052]);
      const g = k.build('backpack');
      return g;
    });
  };
  P.keychain = (opts = {}) => {
    const o = Object.assign({ charm: 'pompom', hex: '#EFC5B9' }, opts);
    return cached(keyOf('keychain', o), () => {
      const k = new Kit(1, 0.003);
      k.add('metal', tor(0.13, 6, 18), { p: [0, -0.0115, 0], s: 0.0115, c: HEX.roseGold });
      k.add('metal', tor(0.22, 5, 12), { p: [0, -0.026, 0], r: [0, PI / 2, 0], s: 0.004, c: HEX.roseGold });
      k.add('metal', tor(0.22, 5, 12), { p: [0, -0.032, 0], s: 0.004, c: HEX.roseGold });
      const cy = -0.054;
      if (o.charm === 'pompom') k.add('boucle', lumpy(3, 0.04, 9, 14, 10), { p: [0, cy, 0], s: 0.017, c: o.hex });
      else if (o.charm === 'heart') k.add('felt', heartGeo(), { p: [0, cy + 0.004, 0], s: 0.017, c: o.hex });
      else if (o.charm === 'yarn') { k.add('yarn', sph(12, 10), { p: [0, cy, 0], s: 0.014, uv: [2, 1], c: o.hex }); }
      else { // mini cat head
        const head = { c: [0, cy, 0], r: [0.019, 0.016, 0.016] };
        k.add('knit', sph(14, 10), { p: head.c, s: head.r, c: o.hex });
        for (const sx of [-1, 1]) {
          k.add('knit', cone(8), { p: [sx * 0.011, cy + 0.016, 0], r: [0, 0, -sx * 0.35], s: [0.0065, 0.011, 0.0035], c: o.hex });
          k.onSurf('button', sph(8, 6), head, [sx * 0.4, -0.05, 1], [0.0025, 0.0025, 0.0015], { c: '#26201C', sink: 0.2 });
        }
        k.onSurf('felt', sph(6, 4), head, [0, -0.25, 1], [0.0022, 0.0016, 0.0015], { c: '#D9958C', sink: 0.1 });
      }
      return k.build('keychain');
    });
  };
  P.quiltedPouch = (opts = {}) => {
    const o = Object.assign({ hex: '#EFC5B9', cat: '#F6EEE2' }, opts);
    return cached(keyOf('pouch', o), () => {
      const k = new Kit(1);
      k.add('linenVC', rbg(0.17, 0.12, 0.035, 0.016, 3), { p: [0, 0.06, 0], c: o.hex, ao: 0.15 });
      // quilting: diagonal stitch lines
      const W = 0.15, Hh = 0.1, cy = 0.06;
      for (let i = -8; i <= 8; i++) for (const d of [1, -1]) {
        // line x = c + d*y (45°), clipped to |x| <= W/2, |y| <= Hh/2
        const c0 = i * 0.022;
        let y0 = -Hh / 2, y1 = Hh / 2;
        const ya = (-W / 2 - c0) / d, yb = (W / 2 - c0) / d;
        y0 = Math.max(y0, Math.min(ya, yb)); y1 = Math.min(y1, Math.max(ya, yb));
        if (y1 - y0 < 0.008) continue;
        const ym = (y0 + y1) / 2, xm = c0 + d * ym, len = (y1 - y0) * Math.SQRT2;
        k.add('felt', box(), { p: [xm, cy + ym, 0.0182], r: [0, 0, -d * PI / 4], s: [0.0012, len, 0.0012], c: shadeHex(o.hex, -0.16) });
      }
      // appliqué cat face
      const fc = [0.0, 0.056, 0.019];
      k.add('linenVC', sph(18, 8), { p: fc, s: [0.036, 0.03, 0.004], c: o.cat });
      for (const sx of [-1, 1]) {
        k.add('linenVC', cone(3), { p: [sx * 0.022, 0.087, 0.019], r: [0, 0, -sx * 0.3], s: [0.012, 0.02, 0.003], c: o.cat });
        k.add('button', sph(8, 6), { p: [sx * 0.012, 0.059, 0.0225], s: [0.0032, 0.0032, 0.0016], c: '#2B231F' });
        k.add('felt', sph(8, 6), { p: [sx * 0.021, 0.05, 0.022], s: [0.0055, 0.004, 0.0012], c: '#E8A99B' });
      }
      k.add('felt', sph(8, 6), { p: [0, 0.052, 0.0228], s: [0.003, 0.0022, 0.0015], c: '#C98278' });
      // zipper + pull
      k.add('metal', box(), { p: [0, 0.119, 0], s: [0.15, 0.004, 0.006], c: HEX.roseGold });
      k.add('metal', rbg(0.008, 0.016, 0.003, 0.0015, 1), { p: [0.06, 0.112, 0.006], c: HEX.roseGold });
      k.add('felt', lumpy(4, 0.1, 6, 10, 8), { p: [0.06, 0.098, 0.008], s: 0.006, c: '#FBF6EE' });
      return k.build('quiltedPouch');
    });
  };

  // =====================================================================================
  // BOOKS
  // =====================================================================================
  P.book = (opts = {}) => {
    const o = Object.assign({ w: 0.15, h: 0.21, d: 0.03, cover: '#A9BCA0', spineIndex: 0, spineOut: false }, opts);
    return cached(keyOf('book', o), () => {
      const k = new Kit(1);
      const { w, h, d } = o;
      const bt = Math.min(0.004, d * 0.12);
      for (const sz of [1, -1]) k.add('linenVC', rbg(w, h, bt, bt * 0.45, 1), { p: [0, h / 2, sz * (d / 2 - bt / 2)], c: o.cover });
      k.add('linenVC', rbg(bt * 2.2, h, d, bt, 2), { p: [-w / 2 + bt * 0.9, h / 2, 0], c: shadeHex(o.cover, -0.06) });
      k.add('paperVC', box(), { p: [bt * 0.6, h / 2, 0], s: [w - bt * 2.2, h - bt * 3, d - bt * 2], c: '#F6EEDF', uv: [1, 1] });
      // a little blind-stamped frame + emblem on the cover (no words)
      k.add('felt', rbg(w * 0.62, h * 0.5, 0.001, 0.0005, 1), { p: [w * 0.04, h * 0.55, d / 2 + 0.0002], c: shadeHex(o.cover, 0.18) });
      k.add('felt', heartGeo(), { p: [w * 0.04, h * 0.55, d / 2 + 0.0012], s: [w * 0.055, w * 0.055, 0.004], c: '#D8B27A' });
      const g = k.build('book');
      if (o.spineOut) { const outer = new THREE.Group(); g.rotation.y = PI / 2; outer.add(g); outer.name = 'book'; return outer; }
      return g;
    });
  };
  // instanced row of standing books, spines facing +Z, centred on the origin, length along X
  let bookMat = null, bookGeo = null;
  function getBookMat() {
    if (bookMat) return bookMat;
    const atlas = T.bookSpines();
    bookMat = new THREE.MeshStandardMaterial({ map: atlas.map, roughness: 0.85 });
    bookMat.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nattribute vec2 aCell;')
        .replace('#include <uv_vertex>', '#include <uv_vertex>\n#ifdef USE_MAP\n\tvMapUv += aCell;\n#endif');
    };
    bookMat.customProgramCacheKey = () => 'havenBookAtlas';
    bookMat.name = 'bookAtlas';
    return bookMat;
  }
  function getBookGeo() {
    if (bookGeo) return bookGeo;
    const atlas = T.bookSpines();
    const cu = 1 / atlas.cols, cv = 1 / atlas.rows, tf = atlas.topFrac;
    const g = new RoundedBoxGeometry(1, 1, 1, 2, 0.05);
    const pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv;
    // cell (0,0) = top-left of the canvas → v in [1 - cv, 1]
    const v0 = 1 - cv, vTop = 1 - cv * tf;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + 0.5, y = pos.getY(i) + 0.5, z = pos.getZ(i) + 0.5;
      const nx = nor.getX(i), ny = nor.getY(i), nz = nor.getZ(i);
      const ax = Math.abs(nx), ay = Math.abs(ny), az = Math.abs(nz);
      let U, V;
      if (az >= ax && az >= ay && nz > 0) { U = cu * (0.03 + 0.94 * x); V = v0 + (vTop - v0) * (0.02 + 0.96 * y); }        // spine
      else if (ay >= ax && ay >= az) { U = cu * (0.05 + 0.9 * x); V = vTop + (1 - vTop) * (0.1 + 0.8 * z); }                  // page tops / bottoms
      else if (az >= ax && az >= ay) { U = cu * (0.05 + 0.9 * x); V = vTop + (1 - vTop) * 0.5; }                                  // fore-edge
      else { U = cu * (0.45 + 0.1 * z); V = v0 + (vTop - v0) * (0.1 + 0.8 * y); }                                                // covers
      uv.setXY(i, U, V);
    }
    bookGeo = g;
    return g;
  }
  P.bookRow = (count = 12, length = 0.6, opts = {}) => {
    const o = Object.assign({ h: 0.22, d: 0.15, seed: 7, jitter: 1, cells: null }, opts);
    const atlas = T.bookSpines();
    const geo = getBookGeo().clone();
    const cells = new Float32Array(count * 2);
    const rnd = mulberry32(o.seed);
    const widths = []; let sum = 0;
    for (let i = 0; i < count; i++) { const w = 0.6 + rnd() * 0.8; widths.push(w); sum += w; }
    const mesh = new THREE.InstancedMesh(geo, getBookMat(), count);
    let x = -length / 2;
    const gap = length * 0.004;
    const usable = length - gap * (count - 1);
    for (let i = 0; i < count; i++) {
      const w = widths[i] / sum * usable;
      const h = o.h * (0.78 + rnd() * 0.3 * o.jitter);
      const d = o.d * (0.88 + rnd() * 0.12);
      _m.compose(_v.set(x + w / 2, h / 2, (rnd() - 0.5) * 0.008 * o.jitter), _q.setFromAxisAngle(YUP, (rnd() - 0.5) * 0.04 * o.jitter), _s.set(w, h, d));
      mesh.setMatrixAt(i, _m);
      const cell = o.cells ? o.cells[i % o.cells.length] : Math.floor(rnd() * atlas.cols * atlas.rows);
      cells[i * 2] = (cell % atlas.cols) / atlas.cols;
      cells[i * 2 + 1] = -Math.floor(cell / atlas.cols) / atlas.rows;
      x += w + gap;
    }
    geo.setAttribute('aCell', new THREE.InstancedBufferAttribute(cells, 2));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere(); mesh.computeBoundingBox();
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.name = 'bookRow';
    return mesh;
  };
  // the hero: fabric-wrapped picture book on a rose-gold stand
  P.fabricBook = (opts = {}) => {
    const o = Object.assign({ w: 0.27, h: 0.27, d: 0.042, tilt: 0.2, ribbon: HEX.berry }, opts);
    return cached(keyOf('fabricBook', o), () => {
      const root = new THREE.Group(); root.name = 'fabricBook';
      const { w, h, d } = o;
      const book = new THREE.Group();
      // front board: rounded, padded; cover texture on +Z face (BoxGeometry group 4)
      const coverMat = P.mat('cover');
      const linen = P.mat('linen');
      const front = new THREE.Mesh(rbg(w, h, 0.012, 0.0055, 3), [linen, linen, linen, linen, coverMat, linen]);
      front.position.set(0, h / 2, d / 2 - 0.006);
      const k = new Kit(1);
      k.add('linenVC', rbg(w, h, 0.01, 0.005, 2), { p: [0, h / 2, -d / 2 + 0.005], c: '#E3D3BF' });
      k.add('linenVC', rbg(0.018, h, d, 0.008, 3), { p: [-w / 2 + 0.006, h / 2, 0], c: '#E3D3BF' });
      k.add('paperVC', rbg(w - 0.016, h - 0.014, d - 0.018, 0.002, 1), { p: [0.004, h / 2, 0], c: '#F7F0E3', uv: [1, 1] });
      // ribbon bookmark peeking out at the bottom
      k.add('felt', rbg(0.012, 0.05, 0.0015, 0.0006, 1), { p: [w * 0.18, -0.012, 0.004], r: [0, 0, 0.12], c: o.ribbon });
      const rest = k.build('bookBody');
      book.add(front, rest);
      front.castShadow = true; front.receiveShadow = true;
      // stand: rose-gold wire easel
      const s = new Kit(1);
      const lipZ = 0.04, baseY = 0.0;
      s.add('metal', taperTube([[-0.11, 0.012, lipZ], [0.11, 0.012, lipZ]], 0.0032, 0.0032, { tubular: 4, radial: 6 }), { c: HEX.roseGold });
      for (const sx of [-1, 1]) {
        s.add('metal', taperTube([[sx * 0.11, 0.012, lipZ], [sx * 0.11, 0.004, lipZ - 0.01], [sx * 0.09, 0.004, -0.06], [sx * 0.03, 0.18, -0.1]], 0.0028, 0.0028, { tubular: 16, radial: 6 }), { c: HEX.roseGold });
        s.add('metal', taperTube([[sx * 0.11, 0.012, lipZ], [sx * 0.11, 0.026, lipZ + 0.002]], 0.0028, 0.0028, { tubular: 3, radial: 6 }), { c: HEX.roseGold });
        s.add('metal', sph(8, 6), { p: [sx * 0.11, 0.027, lipZ + 0.002], s: 0.0042, c: HEX.roseGold });
      }
      s.add('metal', sph(8, 6), { p: [0, 0.185, -0.102], s: 0.004, c: HEX.roseGold });
      const stand = s.build('stand');
      // book resting on the lip, leaning back
      book.rotation.x = -o.tilt;
      book.position.set(0, 0.012 + baseY, lipZ - d / 2 - 0.004);
      root.add(book, stand);
      root.add(P.softShadow(w * 1.25, 0.24, 0.4));
      root.userData.cover = front;
      return root;
    });
  };
  P.photoFrame = (tex, w = 0.17, h = 0.21) => {
    tex = tex || T.merlinPhoto();
    const key = keyOf('frame', { w, h, id: tex.uuid });
    return cached(key, () => {
      const root = new THREE.Group(); root.name = 'photoFrame';
      const bw = Math.min(w, h) * 0.085, depth = 0.016;
      // frame: extruded rounded rect with hole (rose gold), bevelled
      const sh = new THREE.Shape(); roundRectShape(sh, -w / 2, -h / 2, w, h, bw * 0.6);
      const hole = new THREE.Path(); roundRectShape(hole, -w / 2 + bw, -h / 2 + bw, w - 2 * bw, h - 2 * bw, bw * 0.25); sh.holes.push(hole);
      const fg = new THREE.ExtrudeGeometry(sh, { depth: depth * 0.5, bevelEnabled: true, bevelThickness: depth * 0.25, bevelSize: bw * 0.28, bevelSegments: 3, curveSegments: 6 });
      const frame = new THREE.Mesh(fg, P.mat('roseGold'));
      frame.position.set(0, h / 2, 0);
      // mat (ivory card) + photo (unlit, aspect-correct cover fit)
      const iw = w - 2 * bw, ih = h - 2 * bw;
      const mat = new THREE.Mesh(rbg(iw + 0.002, ih + 0.002, 0.004, 0.001, 1), P.mat('ivory'));
      mat.position.set(0, h / 2, depth * 0.1);
      const pw = iw * 0.8, ph = ih * 0.8 + (ih - iw) * 0.0;
      const ptex = tex.clone(); // shares the image; own repeat/offset
      const aspect = (tex.userData && tex.userData.aspect) || (tex.image && tex.image.width ? tex.image.width / tex.image.height : 0.8);
      const want = pw / ph;
      if (want > aspect) { ptex.repeat.set(1, aspect / want); ptex.offset.set(0, (1 - aspect / want) / 2); } else { ptex.repeat.set(want / aspect, 1); ptex.offset.set((1 - want / aspect) / 2, 0); }
      // the clone shares the image Source; bump its version only once pixels exist (avoids empty-upload warnings)
      if (tex.image) ptex.needsUpdate = true; else T.ready.then(() => { if (tex.image) ptex.needsUpdate = true; });
      const photoMat = new THREE.MeshBasicMaterial({ map: ptex, toneMapped: false, color: '#F7F2EB' });
      const photo = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), photoMat);
      photo.position.set(0, h / 2 + (ih - ph) * 0.06, depth * 0.1 + 0.0022);
      // back strut
      const strut = new THREE.Mesh(rbg(0.03, h * 0.7, 0.004, 0.0015, 1), P.mat('roseGold'));
      strut.position.set(0, h * 0.35, -0.035); strut.rotation.x = 0.3;
      root.add(frame, mat, photo, strut);
      root.rotation.x = 0; frame.castShadow = true; mat.receiveShadow = true;
      // lean back slightly as a whole (wrap so origin stays bottom-centre)
      const lean = new THREE.Group(); lean.add(...root.children); lean.rotation.x = -0.12; lean.position.z = 0.012;
      root.add(lean);
      root.add(P.softShadow(w * 1.2, 0.12, 0.35));
      return root;
    });
  };
  function roundRectShape(s, x, y, w, h, r) {
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  }

  // =====================================================================================
  // YARN, BASKET, PARCEL, PAPER, EASEL
  // =====================================================================================
  function yarnParts(k, p, r, hex, seed = 1, strand = false) {
    k.add('yarn', sph(16, 12), { p, s: r * 0.97, uv: [2, 1], c: hex, ao: 0.25 });
    const rnd = mulberry32(seed);
    for (let i = 0; i < 4; i++) {
      _e.set(rnd() * PI, rnd() * PI, rnd() * PI);
      k.add('yarn', tor(0.055, 4, 28), { p, r: [_e.x, _e.y, _e.z], s: r * 0.985, uv: [3, 1], c: shadeHex(hex, 0.04) });
    }
    if (strand) {
      const t = taperTube([[p[0] + r * 0.6, p[1] - r * 0.6, p[2] + r * 0.55], [p[0] + r * 1.4, 0.003, p[2] + r * 1.3], [p[0] + r * 2.4, 0.003, p[2] + r * 0.6], [p[0] + r * 3.2, 0.003, p[2] + r * 1.6]], r * 0.05, r * 0.05, { tubular: 24, radial: 5 });
      k.add('yarn', t, { uv: [6, 1], c: hex });
    }
  }
  P.yarnBall = (opts = {}) => {
    const o = Object.assign({ hex: '#EFC5B9', r: 0.045, strand: false }, opts);
    return cached(keyOf('yarn', o), () => { const k = new Kit(1); yarnParts(k, [0, o.r * 0.95, 0], o.r, o.hex, 3, o.strand); return k.build('yarnBall'); });
  };
  P.basket = (opts = {}) => {
    const o = Object.assign({ r: 0.16, h: 0.14, hex: '#D9C2A3', fill: ['#EFC5B9', '#A9BCA0', '#FBF6EE', '#E8C9A0'], handles: true }, opts);
    return cached(keyOf('basket', o), () => {
      const k = new Kit(1);
      const { r, h } = o;
      k.add('weave', lathe([[0, 0], [r * 0.82, 0], [r * 0.9, h * 0.08], [r, h * 0.9], [r * 1.02, h], [r * 0.95, h], [r * 0.86, h * 0.12], [0, h * 0.1]], 24, `basket${r}/${h}`), { c: o.hex, ao: 0.3 });
      k.add('weave', tor(0.12, 6, 32), { p: [0, h, 0], r: [PI / 2, 0, 0], s: r * 1.0, c: shadeHex(o.hex, -0.05) });
      if (o.handles) for (const sx of [-1, 1]) k.add('weave', tor(0.16, 5, 12, PI), { p: [sx * r * 0.98, h * 0.92, 0], r: [0, PI / 2, 0], s: [r * 0.22, r * 0.18, r * 0.22], c: shadeHex(o.hex, -0.08) });
      const fill = o.fill || [];
      const n = fill.length;
      for (let i = 0; i < n; i++) {
        const a = i / Math.max(1, n) * TAU + 0.4, rr = n > 1 ? r * 0.45 : 0;
        const yr = r * 0.45;
        yarnParts(k, [Math.cos(a) * rr, h * 0.62 + (i % 2) * yr * 0.25, Math.sin(a) * rr], yr, fill[i], 10 + i, false);
      }
      return k.build('basket');
    });
  };
  P.parcel = (opts = {}) => {
    const o = Object.assign({ w: 0.16, h: 0.08, d: 0.12, twine: '#B9987A', sprig: true }, opts);
    return cached(keyOf('parcel', o), () => {
      const k = new Kit(1);
      const { w, h, d } = o;
      k.add('paperVC', rbg(w, h, d, Math.min(w, h, d) * 0.12, 2), { p: [0, h / 2, 0], c: '#F3E9D8', uv: [w / 0.3, h / 0.3], ao: 0.18 });
      const t = 0.0035;
      k.add('felt', box(), { p: [0, h / 2, 0], s: [t, h + 0.002, d + 0.002], c: o.twine });
      k.add('felt', box(), { p: [0, h / 2, 0], s: [w + 0.002, h + 0.002, t], c: o.twine });
      for (const sx of [-1, 1]) {
        k.add('felt', tor(0.14, 5, 14), { p: [sx * 0.013, h + 0.008, 0], r: [0, 0, sx * 0.5], s: [0.013, 0.008, 0.008], c: o.twine });
        k.add('felt', cap(3, 4), { p: [sx * 0.012, h + 0.002, 0.016], r: [PI / 2 - 0.1, 0, sx * 0.5], s: [0.0016, 0.004, 0.0016], c: o.twine });
      }
      k.add('felt', sph(6, 4), { p: [0, h + 0.004, 0], s: 0.0045, c: o.twine });
      if (o.sprig) for (let i = 0; i < 5; i++) {
        const a = -0.6 + i * 0.3;
        k.add('leaf', leafGeo(), { p: [0.022 + i * 0.006, h + 0.006, -0.004 + i * 0.004], r: [-PI / 2 + 0.2, 0, a], s: 0.016, c: i % 2 ? HEX.sage : HEX.sageDark });
      }
      return k.build('parcel');
    });
  };
  function leafGeo() { // pointed oval leaf, slightly cupped
    return G('leafGeo', () => {
      const s = new THREE.Shape();
      s.moveTo(0, 0); s.quadraticCurveTo(0.45, 0.4, 0, 1); s.quadraticCurveTo(-0.45, 0.4, 0, 0);
      const g = new THREE.ShapeGeometry(s, 6);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, x * x * 0.6 - y * (1 - y) * 0.25); }
      g.computeVertexNormals();
      return tag(g, 'flat');
    });
  }
  function ivyLeafGeo() {
    return G('ivyLeaf', () => {
      const s = new THREE.Shape();
      s.moveTo(0, 0);
      s.bezierCurveTo(-0.35, 0.05, -0.62, 0.3, -0.5, 0.55);
      s.bezierCurveTo(-0.38, 0.62, -0.22, 0.6, -0.16, 0.7);
      s.bezierCurveTo(-0.12, 0.85, -0.05, 0.95, 0, 1.0);
      s.bezierCurveTo(0.05, 0.95, 0.12, 0.85, 0.16, 0.7);
      s.bezierCurveTo(0.22, 0.6, 0.38, 0.62, 0.5, 0.55);
      s.bezierCurveTo(0.62, 0.3, 0.35, 0.05, 0, 0);
      const g = new THREE.ShapeGeometry(s, 5);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, Math.abs(x) * 0.25 + Math.sin(y * PI) * 0.06); }
      g.computeVertexNormals();
      return tag(g, 'flat');
    });
  }
  P.paperSheet = (opts = {}) => {
    const o = Object.assign({ w: 0.21, h: 0.297, curl: 0.012, pin: 'tape' }, opts);
    return cached(keyOf('paper', o), () => {
      const root = new THREE.Group(); root.name = 'paperSheet';
      const g = new THREE.PlaneGeometry(o.w, o.h, 8, 10);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i) / (o.w / 2), y = (pos.getY(i) + o.h / 2) / o.h;
        pos.setZ(i, o.curl * (Math.pow(Math.max(0, 1 - y) , 3) * (0.6 + 0.4 * x * x) + 0.25 * x * x));
      }
      g.translate(0, o.h / 2, 0.001); g.computeVertexNormals();
      const m = new THREE.Mesh(g, P.mat('paper')); m.castShadow = true; m.receiveShadow = true;
      root.add(m);
      if (o.pin === 'tape') { for (const sx of [-1, 1]) { const t = new THREE.Mesh(rbg(0.05, 0.016, 0.001, 0.0004, 1), P.mat('#EFC5B9')); t.position.set(sx * o.w * 0.36, o.h - 0.004, 0.0025); t.rotation.z = sx * 0.5; root.add(t); } }
      else if (o.pin) { const p = new THREE.Mesh(sph(10, 8), P.mat('roseGold')); p.scale.set(0.007, 0.007, 0.004); p.position.set(0, o.h - 0.018, 0.004); root.add(p); }
      return root;
    });
  };
  P.easel = (opts = {}) => {
    const o = Object.assign({ h: 1.45 }, opts);
    return cached(keyOf('easel', o), () => {
      const k = new Kit(1);
      const h = o.h, wood = '#D9BE9C';
      for (const sx of [-1, 1]) k.add('clay', rbg(0.03, h, 0.03, 0.012, 2), { p: [sx * 0.2, h / 2, 0.06], r: [0.08, 0, -sx * 0.1], c: wood, ao: 0.2 });
      k.add('clay', rbg(0.028, h * 0.95, 0.028, 0.012, 2), { p: [0, h * 0.47, -0.2], r: [-0.28, 0, 0], c: wood, ao: 0.2 });
      k.add('clay', rbg(0.5, 0.03, 0.06, 0.012, 2), { p: [0, h * 0.42, 0.11], c: wood });
      k.add('clay', rbg(0.36, 0.025, 0.03, 0.01, 2), { p: [0, h * 0.97, 0.03], c: wood });
      k.add('clay', rbg(0.46, 0.6, 0.02, 0.01, 2), { p: [0, h * 0.42 + 0.31, 0.105], r: [0.1, 0, 0], c: '#EFE5D6' });
      const g = k.build('easel');
      const sheet = P.paperSheet({ w: 0.4, h: 0.54, pin: 'tape', curl: 0.01 });
      sheet.position.set(0, h * 0.42 + 0.03, 0.12); sheet.rotation.x = -0.1;
      g.add(sheet);
      return g;
    });
  };

  // =====================================================================================
  // PLANTS + VINES
  // =====================================================================================
  function pot(k, r, h, kind = 'terracotta') {
    const col = kind === 'cream' ? '#F4EADB' : kind === 'blush' ? '#E9BFB1' : kind === 'sage' ? '#B9C8AE' : '#C99076';
    const key = kind === 'terracotta' ? 'terra' : 'satin';
    k.add(key, lathe([[0, 0], [r * 0.72, 0], [r * 0.76, h * 0.06], [r * 0.92, h * 0.78], [r * 1.02, h * 0.8], [r * 1.04, h], [r * 0.9, h], [r * 0.88, h * 0.86], [0, h * 0.86]], 22, `pot${r}/${h}`), { c: col, ao: 0.28 });
    k.add('clay', cyl(18), { p: [0, h * 0.9, 0], s: [r * 0.88, 0.004, r * 0.88], c: '#6B5444' });
  }
  P.plant = (kind = 'topiary', h = 0.8, opts = {}) => {
    const o = Object.assign({ pot: null, seed: 1 }, opts);
    return cached(keyOf('plant:' + kind, { h, o }), () => buildPlant(kind, h, o));
  };
  // a soft foliage ball: darker lumpy core + many small leaves on its surface (organic silhouette)
  function leafCluster(k, c, r, n, cols, leafS, seed, o = {}) {
    const rnd = mulberry32(seed);
    k.add('leaf', lumpy(seed % 97 + 300, 0.1, 5, 14, 10), { p: c, s: [r[0] * 0.86, r[1] * 0.86, r[2] * 0.86], c: o.core || T.shade(cols[0], -0.22), ao: 0.4 });
    const geo = o.narrow ? narrowLeafGeo() : leafGeo();
    const n0 = new THREE.Vector3(), up = new THREE.Vector3(), side = new THREE.Vector3(), basis = new THREE.Matrix4(), q = new THREE.Quaternion();
    const ga = PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i + 0.5) / n * (o.bottom === false ? 1.3 : 2), rr = Math.sqrt(Math.max(0, 1 - y * y)), th = i * ga + rnd() * 0.4;
      n0.set(Math.cos(th) * rr, y, Math.sin(th) * rr).normalize();
      const p = [c[0] + n0.x * r[0] * 0.92, c[1] + n0.y * r[1] * 0.92, c[2] + n0.z * r[2] * 0.92];
      // leaf: normal ≈ outward, tip pointing outward/upward with jitter
      up.set(rnd() - 0.5, 0.6 + rnd(), rnd() - 0.5).addScaledVector(n0, 1.1).normalize();
      side.crossVectors(up, n0).normalize();
      const nn = new THREE.Vector3().crossVectors(side, up).normalize();
      basis.makeBasis(side, up, nn); q.setFromRotationMatrix(basis);
      q.multiply(_q2.setFromAxisAngle(_v2.set(1, 0, 0), -0.5 + rnd() * 0.4));
      const sc = leafS * (0.75 + rnd() * 0.5);
      const ch = Math.max(0, Math.min(1, (n0.y + 1) / 2));
      const col = cols[Math.floor(rnd() * cols.length)];
      k.add('leaf', geo, { p, q: q.clone(), s: [sc, sc, sc], c: ch > 0.6 ? T.shade(col, 0.06) : ch < 0.3 ? T.shade(col, -0.14) : col });
    }
  }
  function narrowLeafGeo() {
    return G('narrowLeaf', () => {
      const s = new THREE.Shape(); s.moveTo(0, 0); s.quadraticCurveTo(0.22, 0.45, 0, 1); s.quadraticCurveTo(-0.22, 0.45, 0, 0);
      const g = new THREE.ShapeGeometry(s, 4); const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, x * x * 1.2 - y * (1 - y) * 0.2); }
      g.computeVertexNormals(); return tag(g, 'flat');
    });
  }
  function floretGeo() {
    return G('floret', () => {
      const s = new THREE.Shape();
      for (let i = 0; i < 4; i++) { const a = i / 4 * TAU, b = a + TAU / 8, c = a + TAU / 4; const r = 1; if (i === 0) s.moveTo(Math.cos(a) * 0.15, Math.sin(a) * 0.15); s.quadraticCurveTo(Math.cos(b) * r * 1.25, Math.sin(b) * r * 1.25, Math.cos(c) * 0.15, Math.sin(c) * 0.15); }
      const g = new THREE.ShapeGeometry(s, 2); const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, -(x * x + y * y) * 0.18); }
      g.computeVertexNormals(); return tag(g, 'flat');
    });
  }
  function buildPlant(kind, H, o) {
    const k = new Kit(1);
    const rnd = mulberry32(o.seed + kind.length * 13);
    const potK = o.pot || (kind === 'lavender' || kind === 'ivyPot' ? 'cream' : kind === 'hydrangea' ? 'blush' : 'terracotta');
    const greens = ['#9DB393', '#A9BCA0', '#8EA685', '#B4C6A6'];
    if (kind === 'topiary') {
      const pr = H * 0.16, ph = H * 0.24;
      pot(k, pr, ph, potK);
      k.add('clay', cyl(8), { p: [0, ph + H * 0.18, 0], s: [H * 0.014, H * 0.4, H * 0.014], c: '#8E7262' });
      const br = H * 0.25;
      leafCluster(k, [0, H - br, 0], [br, br, br], 110, greens, H * 0.075, 21);
    } else if (kind === 'olive') {
      const pr = H * 0.15, ph = H * 0.22;
      pot(k, pr, ph, potK);
      k.add('clay', taperTube([[0, ph * 0.9, 0], [0.02 * H, H * 0.45, 0], [-0.015 * H, H * 0.6, 0.01], [0, H * 0.7, 0]], H * 0.02, H * 0.012, { tubular: 12, radial: 6 }), { c: '#8A7C6E' });
      const olive = ['#A3B29A', '#B5C2AB', '#94A68C', '#C3CDB8'];
      for (let i = 0; i < 4; i++) {
        const a = i / 4 * TAU + rnd(), rr = H * 0.11;
        leafCluster(k, [Math.cos(a) * rr, H * (0.76 + rnd() * 0.1), Math.sin(a) * rr], [H * 0.12, H * 0.09, H * 0.12], 34, olive, H * 0.06, 30 + i, { narrow: true });
      }
      leafCluster(k, [0, H * 0.88, 0], [H * 0.13, H * 0.1, H * 0.13], 40, olive, H * 0.06, 39, { narrow: true });
    } else if (kind === 'hydrangea') {
      const pr = H * 0.26, ph = H * 0.34;
      pot(k, pr, ph, potK);
      leafCluster(k, [0, ph + H * 0.16, 0], [H * 0.32, H * 0.2, H * 0.3], 46, ['#8EA685', '#9DB393', '#7F9A7A'], H * 0.11, 41, { bottom: false });
      const cols = ['#EDB9AC', '#F1D2C6', '#CFC2DF', '#F4E6DD', '#E6B1B1'];
      const heads = [[0, 0.44, 0], [0.17, 0.36, 0.08], [-0.16, 0.37, 0.07], [0.07, 0.36, -0.16], [-0.09, 0.38, -0.13], [0.02, 0.35, 0.18]];
      heads.forEach(([x, y, z], hi) => {
        const c = [x * H, ph + y * H - H * 0.03, z * H], R0 = H * 0.125, col = cols[hi % cols.length];
        k.add('felt', sph(12, 8), { p: c, s: R0 * 0.85, c: T.shade(col, -0.12) });
        const n = 22, ga = PI * (3 - Math.sqrt(5));
        for (let i = 0; i < n; i++) {
          const yy = 1 - (i + 0.5) / n * 1.4, rr = Math.sqrt(Math.max(0, 1 - yy * yy)), th = i * ga;
          _v.set(Math.cos(th) * rr, yy, Math.sin(th) * rr);
          const q = new THREE.Quaternion().setFromUnitVectors(ZUP, _v).multiply(_q2.setFromAxisAngle(ZUP, rnd() * TAU));
          k.add('felt', floretGeo(), { p: [c[0] + _v.x * R0 * 0.9, c[1] + _v.y * R0 * 0.9, c[2] + _v.z * R0 * 0.9], q, s: R0 * 0.36, c: rnd() < 0.3 ? T.shade(col, 0.1) : col });
        }
      });
    } else if (kind === 'fern') {
      const pr = H * 0.22, ph = H * 0.3;
      pot(k, pr, ph, potK);
      k.add('leaf', lumpy(45, 0.12, 5, 12, 8), { p: [0, ph * 0.95, 0], s: [pr * 0.8, H * 0.06, pr * 0.8], c: '#7F9A7A' });
      const n = 20;
      for (let i = 0; i < n; i++) {
        const a = i / n * TAU + rnd() * 0.3, L = H * (0.7 + rnd() * 0.3), lift = 0.75 + rnd() * 0.55;
        const g = new THREE.PlaneGeometry(1, 0.34, 10, 1);
        const pos = g.attributes.position;
        for (let j = 0; j < pos.count; j++) {
          const x = pos.getX(j) + 0.5, w = pos.getY(j) * (1 - x * 0.35);
          const ang = lift - x * 1.9; // rise then droop
          pos.setXYZ(j, Math.cos(lift * 0.5) * x * 0.95, Math.sin(lift) * x * 0.75 - x * x * 0.7, w);
          void ang;
        }
        g.computeVertexNormals(); tag(g, 'flat');
        k.add('fern', g, { p: [Math.cos(a) * pr * 0.15, ph * 0.95, Math.sin(a) * pr * 0.15], r: [0, -a, 0], s: [L, L, L], keepUV: true, c: i % 3 ? '#93AC86' : '#A7BE98', ao: 0.2 });
      }
    } else if (kind === 'lavender') {
      const pr = H * 0.2, ph = H * 0.3;
      pot(k, pr, ph, potK);
      leafCluster(k, [0, ph + H * 0.06, 0], [pr * 0.95, H * 0.09, pr * 0.95], 36, ['#9FB39A', '#B2C2AC', '#8FA286'], H * 0.09, 61, { narrow: true, bottom: false });
      for (let i = 0; i < 16; i++) {
        const a = rnd() * TAU, rr = rnd() * pr * 0.6, L = H * (0.4 + rnd() * 0.25), tilt = (rnd() - 0.5) * 0.35;
        const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
        k.add('clay', cyl(4), { p: [x + Math.sin(tilt) * L / 2 * Math.cos(a), ph + L / 2, z + Math.sin(tilt) * L / 2 * Math.sin(a)], r: [Math.sin(a) * tilt, 0, -Math.cos(a) * tilt], s: [0.0025 * H / 0.5, L, 0.0025 * H / 0.5], c: '#8FA286' });
        k.add('boucle', cap(3, 6), { p: [x + Math.sin(tilt) * L * Math.cos(a), ph + L, z + Math.sin(tilt) * L * Math.sin(a)], r: [Math.sin(a) * tilt, 0, -Math.cos(a) * tilt], s: [H * 0.012, H * 0.014, H * 0.012], c: rnd() < 0.5 ? '#B6A3C9' : '#A592BC' });
      }
    } else if (kind === 'ivyPot') {
      const pr = H * 0.32, ph = H * 0.42;
      pot(k, pr, ph, potK);
      leafCluster(k, [0, ph + H * 0.08, 0], [pr * 1.0, H * 0.15, pr * 1.0], 40, ['#8EA685', '#A9BCA0', '#7F9A7A'], H * 0.1, 71, { bottom: false });
      const n0 = new THREE.Vector3(), up = new THREE.Vector3(), side = new THREE.Vector3(), basis = new THREE.Matrix4(), q = new THREE.Quaternion();
      for (let st = 0; st < 7; st++) {
        const a = st / 7 * TAU + rnd() * 0.4, len = H * (0.5 + rnd() * 0.6);
        for (let i = 0; i < 8; i++) {
          const t = i / 7;
          const r = pr * (1.06 + t * 0.12), y = ph + H * 0.02 - t * len;
          const aa = a + Math.sin(t * 3 + st) * 0.12;
          n0.set(Math.cos(aa), 0.15, Math.sin(aa)).normalize();
          up.set(0, -1, 0).addScaledVector(n0, 0.3).normalize();
          side.crossVectors(up, n0).normalize(); const nn = new THREE.Vector3().crossVectors(side, up);
          basis.makeBasis(side, up, nn); q.setFromRotationMatrix(basis).multiply(_q2.setFromAxisAngle(ZUP, (i % 2 ? 0.5 : -0.5)));
          k.add('leaf', ivyLeafGeo(), { p: [Math.cos(aa) * r, y, Math.sin(aa) * r], q: q.clone(), s: H * (0.085 - t * 0.03), c: rnd() < 0.5 ? '#8EA685' : '#A9BCA0' });
        }
      }
    }
    const g = k.build('plant:' + kind);
    const sh = P.softShadow(H * 0.7, H * 0.7, 0.35); g.add(sh);
    return g;
  }
  // vine: stem tube + instanced ivy leaves (+ optional blossoms) along a Catmull-Rom curve
  P.vine = (points, density = 1, opts = {}) => {
    const o = Object.assign({ normal: new THREE.Vector3(0, 0, 1), leafSize: 0.07, stem: '#8B7A62', flowers: 0, flowerColors: ['#EFC5B9', '#FBF6EE'], seed: 3 }, opts);
    const pts = points.map((p) => (p.isVector3 ? p.clone() : new THREE.Vector3(p[0], p[1], p[2])));
    const curve = new THREE.CatmullRomCurve3(pts);
    const L = curve.getLength();
    const group = new THREE.Group(); group.name = 'vine';
    const stem = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(8, Math.round(L * 10)), o.leafSize * 0.08, 5, false), P.mat('#8B7A62'));
    stem.castShadow = true; group.add(stem);
    const n = Math.max(4, Math.round(L * 26 * density));
    const leaves = new THREE.InstancedMesh(ivyLeafGeo(), P.mat('leafInst'), n);
    const rnd = mulberry32(o.seed);
    const nrm = o.normal.clone().normalize();
    const cols = ['#A9BCA0', '#7F9A7A', '#C5D3B8', '#93AC86', '#8EA685'];
    const side = new THREE.Vector3(), up = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), mat = new THREE.Matrix4(), basis = new THREE.Matrix4();
    for (let i = 0; i < n; i++) {
      const t = (i + rnd() * 0.8) / n;
      curve.getPointAt(Math.min(1, t), _v); curve.getTangentAt(Math.min(1, t), _v2);
      side.crossVectors(_v2, nrm).normalize();
      const s = o.leafSize * (0.6 + rnd() * 0.6);
      const off = (rnd() - 0.5) * o.leafSize * 1.2;
      _v.addScaledVector(side, off).addScaledVector(nrm, o.leafSize * 0.15 * rnd());
      // leaf faces roughly along the wall normal; its tip points sideways/down-ish
      const ang = (off > 0 ? -1 : 1) * (0.6 + rnd() * 0.9) + PI;
      up.copy(_v2).applyAxisAngle(nrm, ang);
      side.crossVectors(up, nrm).normalize();
      basis.makeBasis(side, up, nrm);
      tmpQ.setFromRotationMatrix(basis);
      tmpQ.multiply(_q2.setFromAxisAngle(_v2.set(1, 0, 0), -0.35 + rnd() * 0.5));
      mat.compose(_v, tmpQ, _s.set(s, s, s));
      leaves.setMatrixAt(i, mat);
      leaves.setColorAt(i, _c.set(cols[Math.floor(rnd() * cols.length)]));
    }
    leaves.instanceMatrix.needsUpdate = true; if (leaves.instanceColor) leaves.instanceColor.needsUpdate = true;
    leaves.computeBoundingSphere(); leaves.castShadow = true; leaves.receiveShadow = true; leaves.name = 'vineLeaves';
    group.add(leaves);
    if (o.flowers > 0) {
      const fn = Math.max(1, Math.round(n * o.flowers));
      const fg = G('blossom', () => { const k = new Kit(1); for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; k.add('felt', sph(6, 4), { p: [Math.cos(a) * 0.35, Math.sin(a) * 0.35, 0], s: [0.38, 0.3, 0.12], c: '#ffffff' }); } k.add('felt', sph(6, 4), { s: 0.2, p: [0, 0, 0.08], c: '#E8C77E' }); const m = k.build(); return m.children[0].geometry; });
      const fm = new THREE.InstancedMesh(fg, P.mat('felt'), fn);
      for (let i = 0; i < fn; i++) {
        const t = rnd();
        curve.getPointAt(t, _v);
        _v.addScaledVector(nrm, o.leafSize * 0.25).add(_v2.set((rnd() - 0.5) * o.leafSize, (rnd() - 0.5) * o.leafSize, 0));
        tmpQ.setFromUnitVectors(ZUP, nrm);
        const s = o.leafSize * (0.35 + rnd() * 0.15);
        mat.compose(_v, tmpQ, _s.set(s, s, s));
        fm.setMatrixAt(i, mat); fm.setColorAt(i, _c.set(o.flowerColors[i % o.flowerColors.length]));
      }
      fm.instanceMatrix.needsUpdate = true; if (fm.instanceColor) fm.instanceColor.needsUpdate = true; fm.computeBoundingSphere(); fm.name = 'vineFlowers';
      group.add(fm);
    }
    return group;
  };

  // =====================================================================================
  // CAFÉ: bistro table, chair, cup, teapot, pastry dome, dog bowl
  // =====================================================================================
  P.bistroTable = (opts = {}) => {
    const o = Object.assign({ r: 0.32, h: 0.74, top: '#F6EFE4', base: '#4A423B' }, opts);
    return cached(keyOf('bistroTable', o), () => {
      const k = new Kit(1);
      const { r, h } = o;
      k.add('satin', cyl(20), { p: [0, h - 0.016, 0], s: [r, 0.03, r], c: o.top, ao: 0.1 });
      k.add('metal', tor(0.05, 6, 48), { p: [0, h - 0.016, 0], r: [PI / 2, 0, 0], s: [r + 0.002, r + 0.002, 0.3], c: HEX.roseGold });
      k.add('clay', cyl(14), { p: [0, h - 0.04, 0], s: [0.07, 0.02, 0.07], c: o.base });
      k.add('clay', lathe([[0.022, 0.06], [0.03, 0.1], [0.02, 0.2], [0.018, h * 0.6], [0.026, h * 0.62], [0.018, h * 0.64], [0.02, h - 0.05]], 12, 'tableCol' + h), { c: o.base });
      for (let i = 0; i < 3; i++) {
        const a = i / 3 * TAU + PI / 2;
        const t = taperTube([[0, 0.12, 0], [Math.cos(a) * 0.1, 0.07, Math.sin(a) * 0.1], [Math.cos(a) * 0.22, 0.02, Math.sin(a) * 0.22], [Math.cos(a) * 0.26, 0.015, Math.sin(a) * 0.26]], 0.016, 0.011, { tubular: 14, radial: 6 });
        k.add('clay', t, { c: o.base });
        k.add('clay', sph(8, 6), { p: [Math.cos(a) * 0.26, 0.014, Math.sin(a) * 0.26], s: [0.018, 0.013, 0.018], c: o.base });
      }
      const g = k.build('bistroTable');
      g.add(P.softShadow(r * 2.4, r * 2.4, 0.4));
      return g;
    });
  };
  P.bistroChair = (opts = {}) => {
    const o = Object.assign({ rattan: '#CDAE86', seat: '#F1E6D4', cushion: '#EFC5B9' }, opts);
    return cached(keyOf('bistroChair', o), () => {
      const k = new Kit(1);
      const sy = 0.46, rt = o.rattan;
      k.add('weave', cyl(24), { p: [0, sy - 0.015, 0], s: [0.21, 0.03, 0.2], c: o.seat, ao: 0.2 });
      k.add('clay', tor(0.09, 6, 32), { p: [0, sy - 0.015, 0], r: [PI / 2, 0, 0], s: [0.215, 0.205, 0.17], c: rt });
      if (o.cushion) k.add('linenVC', rbg(0.36, 0.045, 0.34, 0.02, 3), { p: [0, sy + 0.02, 0.01], c: o.cushion, ao: 0.15 });
      for (const [x, z] of [[-0.15, 0.13], [0.15, 0.13], [-0.14, -0.13], [0.14, -0.13]]) {
        k.add('clay', taperTube([[x * 0.95, sy - 0.03, z * 0.95], [x * 1.05, sy * 0.5, z * 1.05], [x * 1.18, 0.01, z * 1.18]], 0.014, 0.012, { tubular: 8, radial: 6 }), { c: rt, ao: 0.2 });
        k.add('clay', sph(8, 6), { p: [x * 1.18, 0.012, z * 1.18], s: 0.013, c: shadeHex(rt, -0.1) });
      }
      k.add('clay', tor(0.05, 6, 32), { p: [0, sy * 0.4, 0], r: [PI / 2, 0, 0], s: [0.2, 0.18, 0.2], c: rt });
      // bentwood back: hoop + 3 vertical slats
      const backZ = -0.17;
      k.add('clay', taperTube([[-0.17, sy, backZ], [-0.19, sy + 0.2, backZ - 0.03], [-0.12, sy + 0.38, backZ - 0.06], [0, sy + 0.41, backZ - 0.065], [0.12, sy + 0.38, backZ - 0.06], [0.19, sy + 0.2, backZ - 0.03], [0.17, sy, backZ]], 0.014, 0.014, { tubular: 36, radial: 6 }), { c: rt });
      for (const x of [-0.08, 0, 0.08]) k.add('clay', taperTube([[x, sy + 0.02, backZ - 0.005], [x * 1.1, sy + 0.2, backZ - 0.035], [x * 1.05, sy + 0.38, backZ - 0.06]], 0.009, 0.009, { tubular: 8, radial: 5 }), { c: shadeHex(rt, 0.08) });
      k.add('clay', taperTube([[-0.17, sy + 0.17, backZ - 0.028], [0, sy + 0.18, backZ - 0.045], [0.17, sy + 0.17, backZ - 0.028]], 0.009, 0.009, { tubular: 12, radial: 5 }), { c: rt });
      const g = k.build('bistroChair');
      g.add(P.softShadow(0.55, 0.55, 0.35));
      g.userData.seatY = sy + 0.04;
      return g;
    });
  };
  function cupParts(k, p, s, o) {
    const [x, y, z] = p;
    k.add('satin', lathe([[0, 0], [0.026, 0], [0.03, 0.006], [0.038, 0.035], [0.041, 0.062], [0.038, 0.062], [0.035, 0.036], [0.025, 0.012], [0, 0.012]], 20, 'cup'), { p: [x, y, z], s, c: o.hex || '#F7EFE4', ao: 0.15 });
    k.add('satin', tor(0.22, 6, 14, PI * 1.25), { p: [x + 0.04 * s, y + 0.034 * s, z], r: [0, 0, -PI * 0.62], s: s * 0.016, c: o.hex || '#F7EFE4' });
    k.add('metal', tor(0.04, 3, 20), { p: [x, y + 0.0615 * s, z], r: [PI / 2, 0, 0], s: s * 0.0395, c: HEX.roseGold });
    if (o.latte !== false) {
      k.add('satin', cyl(18), { p: [x, y + 0.054 * s, z], s: [0.036 * s, 0.002 * s, 0.036 * s], c: '#C9A27C' });
      k.add('satin', heartGeo(), { p: [x, y + 0.0556 * s, z + 0.002 * s], r: [-PI / 2, 0, 0], s: [0.011 * s, 0.011 * s, 0.002 * s], c: '#F6EBDC' });
    }
    if (o.saucer !== false) k.add('satin', lathe([[0, 0], [0.05, 0], [0.068, 0.008], [0.072, 0.012], [0.066, 0.012], [0.05, 0.006], [0, 0.006]], 24, 'saucer'), { p: [x, y - 0.004 * s, z], s, c: o.saucerHex || '#F7EFE4' });
  }
  P.cup = (opts = {}) => {
    const o = Object.assign({ hex: '#F7EFE4', latte: true, saucer: true, size: 1 }, opts);
    return cached(keyOf('cup', o), () => { const k = new Kit(1); cupParts(k, [0, o.saucer ? 0.006 * o.size : 0, 0], o.size, o); return k.build('cup'); });
  };
  P.teapot = (opts = {}) => {
    const o = Object.assign({ hex: '#F6EEE3', band: '#EFC5B9' }, opts);
    return cached(keyOf('teapot', o), () => {
      const k = new Kit(1);
      k.add('satin', lathe([[0, 0], [0.05, 0], [0.065, 0.02], [0.075, 0.055], [0.068, 0.095], [0.045, 0.115], [0.035, 0.118], [0, 0.118]], 24, 'teapot'), { c: o.hex, ao: 0.2 });
      k.add('satin', tor(0.12, 6, 30), { p: [0, 0.055, 0], r: [PI / 2, 0, 0], s: [0.0752, 0.0752, 0.12], c: o.band });
      k.add('satin', lathe([[0, 0.118], [0.038, 0.118], [0.036, 0.126], [0.02, 0.135], [0, 0.136]], 16, 'teapotLid'), { c: o.hex });
      k.add('satin', sph(10, 8), { p: [0, 0.142, 0], s: [0.012, 0.009, 0.012], c: o.band });
      k.add('satin', taperTube([[0.06, 0.04, 0], [0.09, 0.06, 0], [0.105, 0.09, 0], [0.12, 0.105, 0]], 0.014, 0.007, { tubular: 12, radial: 8 }), { c: o.hex });
      k.add('satin', tor(0.2, 6, 16, PI * 1.2), { p: [-0.075, 0.065, 0], r: [0, 0, PI * 0.4], s: 0.03, c: o.hex });
      const g = k.build('teapot');
      return g;
    });
  };
  P.pastryDome = (opts = {}) => {
    const o = Object.assign({}, opts);
    return cached(keyOf('pastryDome', o), () => {
      const k = new Kit(1);
      k.add('satin', lathe([[0, 0], [0.06, 0], [0.065, 0.006], [0.04, 0.012], [0.016, 0.02], [0.014, 0.075], [0.03, 0.082], [0.15, 0.084], [0.152, 0.094], [0, 0.092]], 28, 'cakeStand'), { c: '#F7EFE4', ao: 0.2 });
      // macarons + a little cake
      const macs = ['#EFC5B9', '#C5D3B8', '#F1DCA4', '#D9CFE3', '#F6EEE6', '#EFC5B9'];
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * TAU, rr = 0.1;
        const x = Math.cos(a) * rr, z = Math.sin(a) * rr, y = 0.094;
        k.add('clay', sph(12, 8), { p: [x, y + 0.006, z], s: [0.02, 0.008, 0.02], c: macs[i] });
        k.add('clay', cyl(12), { p: [x, y + 0.0135, z], s: [0.017, 0.004, 0.017], c: '#FBF6EE' });
        k.add('clay', sph(12, 8), { p: [x, y + 0.02, z], s: [0.02, 0.008, 0.02], c: macs[i] });
      }
      k.add('clay', cyl(20), { p: [0, 0.124, 0], s: [0.055, 0.06, 0.055], c: '#F3E3CC', ao: 0.25 });
      k.add('clay', lumpy(81, 0.05, 8, 18, 8), { p: [0, 0.155, 0], s: [0.057, 0.012, 0.057], c: '#FBF6EE' });
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; k.add('clay', sph(8, 6), { p: [Math.cos(a) * 0.035, 0.166, Math.sin(a) * 0.035], s: 0.008, c: '#E8A9A0' }); }
      const g = k.build('pastryDome');
      const dome = new THREE.Mesh(lathe([[0.148, 0], [0.146, 0.08], [0.13, 0.17], [0.09, 0.225], [0.04, 0.245], [0, 0.248]], 28, 'dome'), P.mat('glass'));
      dome.position.y = 0.094; dome.renderOrder = 2;
      const knob = new THREE.Mesh(sph(10, 8), P.mat('roseGold')); knob.scale.set(0.014, 0.012, 0.014); knob.position.y = 0.094 + 0.256;
      g.add(dome, knob);
      return g;
    });
  };
  P.dogBowl = (opts = {}) => {
    const o = Object.assign({ hex: '#F4EADB', band: '#EFC5B9' }, opts);
    return cached(keyOf('dogBowl', o), () => {
      const k = new Kit(1);
      k.add('satin', lathe([[0, 0], [0.1, 0], [0.12, 0.012], [0.13, 0.05], [0.126, 0.062], [0.11, 0.062], [0.095, 0.018], [0, 0.016]], 28, 'dogBowl'), { c: o.hex, ao: 0.25 });
      k.add('satin', tor(0.1, 6, 40), { p: [0, 0.052, 0], r: [PI / 2, 0, 0], s: [0.1295, 0.1295, 0.08], c: o.band });
      // little paw-print pictogram on the front
      const pz = 0.124;
      k.add('felt', sph(10, 6), { p: [0, 0.019, pz + 0.001], r: [-0.25, 0, 0], s: [0.0095, 0.0075, 0.002], c: '#B88A7A' });
      for (const [dx, dy] of [[-0.011, 0.009], [-0.0038, 0.0135], [0.0038, 0.0135], [0.011, 0.009]]) k.add('felt', sph(8, 6), { p: [dx, 0.019 + dy, pz + 0.0015 + dy * 0.1], r: [-0.25, 0, 0], s: [0.0031, 0.0036, 0.0018], c: '#B88A7A' });
      const g = k.build('dogBowl');
      const water = new THREE.Mesh(G('waterDisc', () => new THREE.CircleGeometry(1, 20).rotateX(-PI / 2)), P.mat('water'));
      water.scale.set(0.108, 1, 0.108); water.position.y = 0.05;
      g.add(water, P.softShadow(0.34, 0.34, 0.4));
      return g;
    });
  };

  // =====================================================================================
  // LAMPS
  // =====================================================================================
  P.pendantLamp = (opts = {}) => {
    const o = Object.assign({ shade: 'dome', hex: '#F1E3D3', cord: 1.0, r: 0.2 }, opts);
    return cached(keyOf('pendant', o), () => {
      const root = new THREE.Group(); root.name = 'pendantLamp';
      const k = new Kit(1);
      const r = o.r;
      let top;
      if (o.shade === 'lantern') {
        const h = r * 1.5;
        const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([r * Math.sin(PI * (0.08 + t * 0.84)) * (1 + 0.05 * Math.cos(t * PI * 14)), h * t]); }
        const shade = new THREE.Mesh(lathe(pts, 24, 'lantern' + r), P.mat('lantern'));
        root.add(shade);
        for (const y of [0, h]) k.add('metal', tor(0.12, 4, 20), { p: [0, y, 0], r: [PI / 2, 0, 0], s: r * 0.26, c: HEX.roseGold });
        for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; k.add('clay', taperTube(pts.map(([rr, y]) => [Math.cos(a) * rr * 1.004, y, Math.sin(a) * rr * 1.004]), 0.0016, 0.0016, { tubular: 16, radial: 3 }), { c: '#D9C2A3' }); }
        top = h;
      } else if (o.shade === 'bell') {
        const h = r * 0.95;
        const shade = new THREE.Mesh(lathe([[r, 0], [r * 0.96, h * 0.08], [r * 0.7, h * 0.45], [r * 0.42, h * 0.85], [r * 0.18, h], [0.0, h]], 24, 'bell' + r), P.mat('linenDS'));
        root.add(shade);
        k.add('glowVC', sph(14, 10), { p: [0, h * 0.25, 0], s: r * 0.22, c: '#FFF4E6' });
        k.add('metal', tor(0.1, 4, 28), { p: [0, 0, 0], r: [PI / 2, 0, 0], s: r, c: HEX.roseGold });
        top = h;
      } else { // dome
        const h = r * 0.95;
        const shade = new THREE.Mesh(lathe([[r, 0], [r * 0.985, h * 0.1], [r * 0.9, h * 0.45], [r * 0.7, h * 0.78], [r * 0.4, h * 0.95], [r * 0.12, h], [0, h]], 26, 'dome' + r), P.mat('linenDS'));
        root.add(shade);
        k.add('glowVC', sph(14, 10), { p: [0, h * 0.25, 0], s: r * 0.24, c: '#FFF4E6' });
        k.add('metal', tor(0.08, 4, 32), { p: [0, 0.002, 0], r: [PI / 2, 0, 0], s: r * 1.005, c: HEX.roseGold });
        top = h;
      }
      k.add('metal', cyl(12), { p: [0, top + 0.02, 0], s: [0.022, 0.04, 0.022], c: HEX.roseGold });
      k.add('clay', cyl(5), { p: [0, top + 0.04 + o.cord / 2, 0], s: [0.004, o.cord, 0.004], c: '#5A4E46' });
      k.add('metal', cyl(16), { p: [0, top + 0.04 + o.cord + 0.008, 0], s: [0.05, 0.016, 0.05], c: HEX.roseGold });
      root.add(k.build('pendantParts'));
      root.traverse((m) => { if (m.isMesh) { m.castShadow = false; m.receiveShadow = false; } });
      root.userData.height = top + 0.04 + o.cord + 0.016;
      root.userData.bulbY = top * 0.3;
      return root;
    });
  };
  MATS.linenDS = () => std({ color: '#ffffff', map: T.linen('#F1E3D3'), roughness: 1, side: THREE.DoubleSide, emissive: '#F2C39A', emissiveIntensity: 0.18 });
  P.wallLamp = (opts = {}) => {
    const o = Object.assign({}, opts);
    return cached(keyOf('wallLamp', o), () => {
      const k = new Kit(1);
      k.add('metal', lathe([[0, 0], [0.05, 0], [0.055, 0.008], [0.05, 0.016], [0, 0.016]], 20, 'wallplate'), { p: [0, 0.07, 0.0], r: [PI / 2, 0, 0], c: HEX.roseGold });
      k.add('metal', taperTube([[0, 0.07, 0.01], [0, 0.07, 0.08], [0, 0.11, 0.13], [0, 0.17, 0.14]], 0.007, 0.006, { tubular: 14, radial: 6 }), { c: HEX.roseGold });
      k.add('metal', cyl(12), { p: [0, 0.175, 0.14], s: [0.022, 0.02, 0.022], c: HEX.roseGold });
      k.add('glowVC', lathe([[0.02, 0], [0.04, 0.03], [0.06, 0.09], [0.064, 0.12], [0.058, 0.124], [0.0, 0.11]], 20, 'tulip'), { p: [0, 0.18, 0.14], c: '#FFF1E2' });
      const g = k.build('wallLamp');
      g.userData.bulb = new THREE.Vector3(0, 0.25, 0.14);
      return g;
    });
  };
  P.streetLamp = (opts = {}) => {
    const o = Object.assign({ h: 3.1, post: '#4A423B', basket: true }, opts);
    return cached(keyOf('streetLamp', o), () => {
      const k = new Kit(1);
      const H = o.h, pc = o.post;
      k.add('clay', lathe([[0, 0], [0.16, 0], [0.16, 0.06], [0.12, 0.1], [0.11, 0.26], [0.07, 0.32], [0.06, 0.4], [0, 0.4]], 16, 'lampBase'), { c: pc, ao: 0.2 });
      k.add('clay', cyl(12, 0.75, 1), { p: [0, 0.4 + (H - 0.9) / 2, 0], s: [0.05, H - 0.9, 0.05], c: pc });
      for (const y of [0.42, H * 0.55, H - 0.5]) k.add('metal', tor(0.3, 6, 18), { p: [0, y, 0], r: [PI / 2, 0, 0], s: 0.05, c: HEX.roseGold });
      k.add('clay', lathe([[0, 0], [0.09, 0], [0.11, 0.02], [0.05, 0.04], [0.04, 0.06], [0, 0.06]], 16, 'lampCollar'), { p: [0, H - 0.5, 0], c: pc });
      // lantern: 4 posts + roof + glow core
      const ly = H - 0.44;
      for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + PI / 4; k.add('clay', box(), { p: [Math.cos(a) * 0.12, ly + 0.17, Math.sin(a) * 0.12], s: [0.018, 0.34, 0.018], c: pc }); }
      k.add('glowVC', cyl(4, 1.12, 0.88), { p: [0, ly + 0.17, 0], r: [0, PI / 4, 0], s: [0.135, 0.32, 0.135], c: '#FFF0DC' });
      k.add('clay', lathe([[0, 0], [0.2, 0], [0.19, 0.02], [0.06, 0.13], [0.03, 0.16], [0, 0.18]], 4, 'lampRoof'), { p: [0, ly + 0.34, 0], r: [0, PI / 4, 0], c: pc });
      k.add('metal', sph(10, 8), { p: [0, ly + 0.54, 0], s: 0.03, c: HEX.roseGold });
      k.add('clay', cyl(12), { p: [0, ly - 0.01, 0], s: [0.15, 0.025, 0.15], c: pc });
      if (o.basket) {
        k.add('metal', taperTube([[0, H * 0.62, 0], [0.12, H * 0.64, 0], [0.26, H * 0.62, 0]], 0.008, 0.007, { tubular: 10, radial: 5 }), { c: HEX.roseGold });
        k.add('weave', lathe([[0, 0], [0.08, 0], [0.13, 0.06], [0.14, 0.1], [0, 0.1]], 16, 'hangBasket'), { p: [0.26, H * 0.62 - 0.32, 0], c: '#CDAE86' });
        k.add('leaf', lumpy(91, 0.14, 6, 14, 10), { p: [0.26, H * 0.62 - 0.2, 0], s: [0.16, 0.08, 0.16], c: '#93AC86', ao: 0.3 });
        for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; k.add('boucle', lumpy(92 + i, 0.1, 7, 10, 8), { p: [0.26 + Math.cos(a) * 0.12, H * 0.62 - 0.18 - (i % 3) * 0.02, Math.sin(a) * 0.12], s: 0.035, c: ['#EFC5B9', '#FBF6EE', '#D9CFE3'][i % 3] }); }
        for (let i = 0; i < 3; i++) { const a = i / 3 * TAU + 0.5; k.add('metal', taperTube([[0.26, H * 0.62 - 0.005, 0], [0.26 + Math.cos(a) * 0.135, H * 0.62 - 0.225, Math.sin(a) * 0.135]], 0.0028, 0.0028, { tubular: 2, radial: 4 }), { c: HEX.roseGold }); }
      }
      const g = k.build('streetLamp');
      g.add(P.softShadow(0.9, 0.9, 0.35));
      g.userData.bulb = new THREE.Vector3(0, ly + 0.17, 0);
      return g;
    });
  };

  // =====================================================================================
  // PEOPLE, DOG, MAINE COON (animated; update(t) is a pure function of t; no allocations)
  // =====================================================================================
  // capsule between two points (design units of the kit)
  function capBetween(k, key, a, b, r, o = {}) {
    _v.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const len = _v.length();
    const L = Math.max(0.05, Math.round(len / r * 10) / 10);
    const q = new THREE.Quaternion().setFromUnitVectors(YUP, _v.normalize());
    return k.add(key, cap(L, o.rs || 12), Object.assign({}, o, { p: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], q, s: r }));
  }
  P.capBetween = capBetween;

  // seated café customer: soft, rounded, faceless. Origin = floor under the seat centre; sits on P.bistroChair() placed at the same spot.
  P.person = (opts = {}) => {
    const o = Object.assign({ coat: '#E4D3BE', scarf: '#EFC5B9', hair: '#6B5444', skin: '#E9C6AA', trousers: '#8F8378', shoes: '#5A4636', hairStyle: 'bun', hat: null, hatColor: '#C9937E', pose: 'sit', holdCup: true, phase: 0, lookYaw: 0 }, opts);
    const root = new THREE.Group(); root.name = 'person';
    const hipY = 0.535;
    // ---- lower body (static)
    const kl = new Kit(1);
    kl.add('felt', sph(14, 10), { p: [0, hipY + 0.02, 0.0], s: [0.165, 0.08, 0.15], c: o.trousers, ao: 0.15 });
    for (const sx of [-1, 1]) {
      capBetween(kl, 'felt', [sx * 0.082, hipY + 0.025, 0.02], [sx * 0.088, hipY + 0.005, 0.33], 0.068, { c: o.trousers, ao: 0.12, rs: 10 });
      capBetween(kl, 'felt', [sx * 0.088, hipY - 0.01, 0.345], [sx * 0.09, 0.1, 0.37], 0.052, { c: o.trousers, ao: 0.25, rs: 8 });
      kl.add('clay', sph(12, 8), { p: [sx * 0.09, 0.048, 0.41], s: [0.058, 0.048, 0.1], c: o.shoes, ao: 0.3 });
    }
    kl.add('felt', sph(14, 8), { p: [0, hipY + 0.055, 0.1], s: [0.18, 0.062, 0.19], c: o.coat, ao: 0.1 });
    root.add(kl.build('legs'));
    // ---- torso (breathes) with head and arms
    const torso = new THREE.Group(); torso.name = 'torso'; torso.position.set(0, hipY, -0.03);
    const kt = new Kit(1);
    kt.add('felt', lathe([[0, 0], [0.165, 0], [0.18, 0.06], [0.172, 0.2], [0.158, 0.31], [0.13, 0.39], [0.08, 0.44], [0, 0.45]], 16, 'personTorso2'), { c: o.coat, ao: 0.25 });
    kt.add('felt', rbg(0.012, 0.3, 0.02, 0.005, 1), { p: [0.0, 0.2, 0.175], r: [-0.06, 0, 0], c: T.shade(o.coat, -0.1) });
    for (let i = 0; i < 3; i++) kt.add('metal', sph(6, 4), { p: [0.026, 0.11 + i * 0.075, 0.176 - i * 0.008], s: 0.009, c: HEX.roseGold });
    for (const sx of [-1, 1]) kt.add('felt', sph(12, 8), { p: [sx * 0.14, 0.365, 0], s: [0.062, 0.058, 0.064], c: o.coat });
    kt.add('knit', tor(0.45, 6, 16), { p: [0, 0.445, 0.005], r: [PI / 2 + 0.12, 0, 0], s: [0.08, 0.08, 0.068], c: o.scarf });
    kt.add('knit', sph(12, 8), { p: [0.04, 0.41, 0.085], s: [0.034, 0.03, 0.026], c: o.scarf });
    torso.add(kt.build('torso'));
    // head
    const head = new THREE.Group(); head.name = 'head'; head.position.set(0, 0.44, 0.01);
    const kh = new Kit(1);
    kh.add('felt', cyl(12), { p: [0, 0.03, 0], s: [0.04, 0.05, 0.04], c: o.skin });
    const hc = { c: [0, 0.135, 0.0], r: [0.104, 0.108, 0.104] };
    kh.add('felt', sph(16, 12), { p: hc.c, s: hc.r, c: o.skin, ao: 0.12 });
    const hr = [hc.r[0] * 1.07, hc.r[1] * 1.07, hc.r[2] * 1.07];
    kh.add('felt', partSph(0, TAU, 0, PI * 0.56, 16, 8), { p: [0, hc.c[1] + 0.004, -0.004], r: [-0.55, 0, 0], s: hr, c: o.hair, ao: 0.1 });
    if (o.hairStyle === 'bob') {
      kh.add('felt', partSph(PI * 0.82, PI * 1.36, PI * 0.25, PI * 0.42, 14, 6), { p: [0, hc.c[1] - 0.004, -0.004], s: [hr[0] * 1.06, hr[1] * 1.12, hr[2] * 1.05], c: o.hair });
    } else {
      for (const sx of [-1, 1]) kh.add('felt', sph(10, 8), { p: [sx * 0.078, hc.c[1] - 0.004, -0.042], r: [0.2, 0, sx * 0.15], s: [0.036, 0.062, 0.06], c: o.hair });
      kh.add('felt', sph(12, 8), { p: [0, hc.c[1] - 0.028, -0.066], s: [0.082, 0.066, 0.05], c: o.hair });
      if (o.hairStyle === 'bun') kh.add('felt', sph(14, 10), { p: [0, hc.c[1] + 0.085, -0.075], s: 0.05, c: o.hair });
    }
    if (o.hat === 'beret') {
      kh.add('felt', sph(16, 8), { p: [0.018, hc.c[1] + 0.088, -0.012], r: [0.12, 0, -0.22], s: [0.118, 0.038, 0.114], c: o.hatColor });
      kh.add('felt', sph(6, 4), { p: [0.03, hc.c[1] + 0.128, -0.012], s: [0.008, 0.012, 0.008], c: o.hatColor });
    }
    head.add(kh.build('head'));
    torso.add(head);
    // arms: shoulder → elbow → hand (right arm = −X holds the cup)
    const arms = [];
    for (const sx of [-1, 1]) {
      const sh = new THREE.Group(); sh.position.set(sx * 0.145, 0.365, 0.0);
      const ka = new Kit(1);
      capBetween(ka, 'felt', [0, 0, 0], [0, -0.2, 0], 0.045, { c: o.coat, rs: 10 });
      sh.add(ka.build('upperArm'));
      const el = new THREE.Group(); el.position.set(0, -0.2, 0);
      const kf = new Kit(1);
      capBetween(kf, 'felt', [0, 0, 0], [0, -0.17, 0], 0.041, { c: o.coat, rs: 10 });
      kf.add('felt', cyl(12), { p: [0, -0.175, 0], s: [0.043, 0.02, 0.043], c: T.shade(o.coat, -0.08) });
      kf.add('felt', sph(10, 8), { p: [0, -0.205, 0.004], s: [0.034, 0.036, 0.032], c: o.skin });
      el.add(kf.build('foreArm'));
      sh.add(el);
      torso.add(sh);
      arms.push({ sh, el, sx });
    }
    let cup = null;
    if (o.holdCup) {
      cup = new THREE.Group(); cup.name = 'cup';
      const kc = new Kit(1);
      cupParts(kc, [0, -0.035, 0.0], 0.95, { saucer: false, latte: true });
      cup.add(kc.build('cup'));
      cup.position.set(0.035, -0.205, 0.015);
      arms[0].el.add(cup);
    }
    root.add(torso);
    root.add(P.softShadow(0.62, 0.8, 0.35));
    P.setShadows(root, true, true);
    const ph = o.phase;
    const Rt = arms[0], Lt = arms[1];
    function update(t) {
      const br = Math.sin((t + ph) * TAU / 4.2);
      torso.scale.set(1 + br * 0.008, 1 + br * 0.012, 1 + br * 0.008);
      // sip cycle: every 9 s, ~2.8 s long
      const cyc = ((t + ph * 3.1) % 9 + 9) % 9;
      const e = smooth(0.0, 0.9, cyc) * (1 - smooth(1.9, 2.8, cyc));
      Rt.sh.rotation.set(-0.35 - 0.7 * e, 0, 0.12 + 0.23 * e);
      Rt.el.rotation.set(-1.45 - 0.5 * e, 0, 0);
      if (cup) cup.rotation.set(-(Rt.sh.rotation.x + Rt.el.rotation.x) + 0.2 * e, 0, -Rt.sh.rotation.z * 0.8);
      Lt.sh.rotation.set(-0.3, 0, -0.1);
      Lt.el.rotation.set(-1.25, 0, 0);
      head.rotation.set(-0.08 * e + 0.035 * Math.sin((t + ph) * 0.45), o.lookYaw + 0.1 * Math.sin((t + ph) * 0.23), 0.04 * Math.sin((t + ph) * 0.31));
    }
    update(0);
    return { group: root, update };
  };
  function smooth(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

  P.dog = (opts = {}) => {
    const o = Object.assign({ coat: 'golden', pose: 'lie', size: 1 }, opts);
    const col = o.coat === 'cream' ? { a: '#EFDFC4', b: '#F8EFE0', c: '#DCC3A0' } : { a: '#E0BC8A', b: '#F3E2C6', c: '#C9A06E' };
    const root = new THREE.Group(); root.name = 'dog';
    const u = o.size;
    const body = new THREE.Group(); body.name = 'dogBody';
    const kb = new Kit(u);
    kb.add('fur', lumpy(101, 0.035, 4, 22, 16), { p: [0, 0.13, -0.07], s: [0.15, 0.12, 0.27], c: col.a, ao: 0.3 });
    kb.add('fur', lumpy(102, 0.04, 4, 18, 12), { p: [0, 0.12, -0.27], s: [0.16, 0.11, 0.13], c: col.a, ao: 0.3 });
    kb.add('fur', lumpy(103, 0.05, 5, 16, 12), { p: [0, 0.1, 0.13], s: [0.1, 0.085, 0.09], c: T.mixHex(col.a, col.b, 0.6), ao: 0.2 });
    for (const sx of [-1, 1]) {
      kb.add('fur', sph(16, 12), { p: [sx * 0.13, 0.075, -0.22], s: [0.065, 0.07, 0.12], c: col.a, ao: 0.3 });
      kb.add('fur', sph(12, 8), { p: [sx * 0.125, 0.03, -0.1], s: [0.045, 0.03, 0.075], c: col.b, ao: 0.2 });
      kb.add('fur', cap(3.2, 12), { p: [sx * 0.07, 0.04, 0.25], r: [PI / 2, 0, 0], s: 0.04, c: col.a, ao: 0.2 });
      kb.add('fur', sph(12, 8), { p: [sx * 0.07, 0.03, 0.39], s: [0.045, 0.032, 0.06], c: col.b, ao: 0.2 });
      for (const tx of [-0.018, 0, 0.018]) kb.add('felt', sph(6, 4), { p: [sx * 0.07 + tx, 0.022, 0.443], s: [0.006, 0.006, 0.004], c: T.shade(col.b, -0.15) });
    }
    body.add(kb.build('dogBody'));
    root.add(body);
    // head resting on the front paws
    const head = new THREE.Group(); head.name = 'dogHead'; head.position.set(0, 0.14 * u, 0.24 * u);
    const kh = new Kit(u);
    const hc = { c: [0, 0.03, 0.08], r: [0.105, 0.09, 0.1] };
    kh.add('fur', sph(20, 16), { p: hc.c, s: hc.r, c: col.a, ao: 0.15 });
    kh.add('fur', sph(16, 12), { p: [0, 0.0, 0.17], s: [0.06, 0.048, 0.07], c: col.b, ao: 0.15 });
    kh.add('button', sph(12, 8), { p: [0, 0.02, 0.236], s: [0.02, 0.015, 0.012], c: '#3B302A' });
    for (const sx of [-1, 1]) {
      kh.onSurf('button', tor(0.18, 4, 10, PI), hc, [sx * 0.42, 0.18, 1], [0.012, 0.012, 0.012], { r: [0, 0, PI], sink: -0.1, c: '#3B302A' });
      kh.add('fur', sph(14, 10), { p: [sx * 0.098, 0.0, 0.05], r: [0.15, 0, sx * 0.25], s: [0.032, 0.085, 0.06], c: col.c, ao: 0.2 });
      kh.onSurf('felt', sph(8, 6), hc, [sx * 0.7, -0.25, 0.75], [0.016, 0.011, 0.003], { c: '#EBB0A0', sink: 0.2 });
    }
    head.add(kh.build('dogHead'));
    root.add(head);
    // tail
    const tail = new THREE.Group(); tail.name = 'dogTail'; tail.position.set(0.05 * u, 0.13 * u, -0.37 * u);
    const kt = new Kit(u);
    kt.add('fur', taperTube([[0, 0, 0], [0.06, -0.04, -0.06], [0.14, -0.09, -0.04], [0.2, -0.11, 0.06]], 0.032, 0.026, { tubular: 16, radial: 10, bulge: 0.25, fluff: 0.12, seed: 4 }), { c: col.a });
    kt.add('fur', sph(10, 8), { p: [0.2, -0.11, 0.06], s: 0.026, c: col.b });
    tail.add(kt.build('dogTail'));
    root.add(tail);
    root.add(P.softShadow(0.6 * u, 1.05 * u, 0.45));
    P.setShadows(root, true, true);
    function update(t) {
      const br = Math.sin(t * TAU / 3.4);
      body.scale.set(1 + br * 0.018, 1 + br * 0.025, 1);
      head.rotation.set(-br * 0.012, 0, 0.02 * Math.sin(t * 0.3));
      head.position.y = (0.14 + br * 0.002) * u;
      tail.rotation.set(0, 0.22 * Math.sin(t * TAU / 2.8), 0.05 * Math.sin(t * TAU / 5.6));
    }
    update(0);
    return { group: root, update };
  };

  // Maine Coon: brown tabby, lynx tufts, ruff, plumed tail. Sits, raises its left front paw and licks it (3.5 s loop).
  // update(t) is a pure function of t. update(1.6) ≈ paw at the mouth (a good still for reduced motion).
  P.maineCoon = (opts = {}) => {
    const o = Object.assign({ size: 1, loop: 3.5 }, opts);
    const u = o.size;
    const cream = '#F2E6D4', creamTabby = '#D9C0A0', inner = '#E3AFA2', stripe = '#5E4636', tip = '#7A6150';
    const root = new THREE.Group(); root.name = 'maineCoon';
    // ---- body (static)
    const kb = new Kit(u);
    kb.add('tabby', lumpy(201, 0.035, 4, 14, 10), { p: [0, 0.115, -0.03], s: [0.135, 0.115, 0.13], uv: [1.3, 0.85], c: '#ffffff', ao: 0.35 });
    kb.add('tabby', lumpy(202, 0.03, 4, 16, 12), { p: [0, 0.22, 0.035], r: [-0.18, 0, 0], s: [0.098, 0.13, 0.088], uv: [1.0, 0.8], uvOff: [0.3, 0], c: '#ffffff', ao: 0.25 });
    kb.add('fur', lumpy(203, 0.07, 6, 12, 10), { p: [0, 0.205, 0.082], r: [-0.25, 0, 0], s: [0.062, 0.1, 0.046], c: cream, ao: 0.2 });
    // ruff: a soft cascade of fluffy clumps under the chin (not a collar)
    kb.add('fur', lumpy(204, 0.09, 7, 12, 8), { p: [0, 0.285, 0.105], r: [-0.35, 0, 0], s: [0.07, 0.07, 0.05], c: cream, ao: 0.2 });
    for (const sx of [-1, 1]) {
      kb.add('fur', lumpy(230 + sx, 0.07, 7, 12, 10), { p: [sx * 0.054, 0.29, 0.07], r: [0, 0, sx * 0.3], s: [0.04, 0.054, 0.046], c: '#C2A586', ao: 0.25 });
      kb.add('fur', lumpy(234 + sx, 0.1, 8, 10, 8), { p: [sx * 0.03, 0.245, 0.11], s: [0.034, 0.04, 0.03], c: cream, ao: 0.2 });
    }
    for (const sx of [-1, 1]) {
      kb.add('tabby', lumpy(205 + sx, 0.035, 4, 12, 10), { p: [sx * 0.105, 0.075, -0.0], s: [0.06, 0.07, 0.1], uv: [1, 0.6], c: '#ffffff', ao: 0.3 });
      kb.add('fur', sph(12, 8), { p: [sx * 0.098, 0.017, 0.055], s: [0.027, 0.017, 0.046], c: '#E8D8C2', ao: 0.25 });
    }
    // right front leg (static, −X), cream mitten
    kb.add('tabby', cap(3.0, 8), { p: [-0.052, 0.125, 0.1], r: [-0.06, 0, 0], s: 0.031, uvSwap: true, uv: [1.2, 0.5], c: '#ffffff' });
    kb.add('fur', sph(12, 8), { p: [-0.052, 0.022, 0.125], s: [0.033, 0.022, 0.043], c: cream, ao: 0.2 });
    root.add(kb.build('coonBody'));
    // ---- tail: base (slow sway) + plume (curl)
    const tailA = new THREE.Group(); tailA.name = 'coonTailA'; tailA.position.set(0.02 * u, 0.072 * u, -0.15 * u);
    const kt = new Kit(u);
    kt.add('tabby', taperTube([[0, 0, 0], [0.07, -0.02, -0.06], [0.16, -0.022, -0.045], [0.21, -0.02, 0.035]], 0.042, 0.054, { tubular: 12, radial: 10, fluff: 0.12, seed: 9 }), { uvSwap: true, uv: [3.0, 1], c: '#ffffff', ao: 0.15 });
    tailA.add(kt.build('coonTailA'));
    const tailB = new THREE.Group(); tailB.name = 'coonTailB'; tailB.position.set(0.21 * u, -0.02 * u, 0.035 * u);
    const kt2 = new Kit(u);
    kt2.add('tabby', taperTube([[0, 0, 0], [0.012, 0.004, 0.08], [-0.012, 0.014, 0.15], [-0.06, 0.026, 0.19]], 0.054, 0.024, { tubular: 14, radial: 10, fluff: 0.16, seed: 10, bulge: 0.18 }), { uvSwap: true, uv: [2.4, 1], c: '#ffffff' });
    kt2.add('fur', lumpy(220, 0.08, 6, 10, 8), { p: [-0.058, 0.025, 0.188], s: 0.023, c: '#8E7259' });
    tailB.add(kt2.build('coonTailB'));
    tailA.add(tailB);
    root.add(tailA);
    // ---- head (pivot at the neck)
    const head = new THREE.Group(); head.name = 'coonHead'; head.position.set(0, 0.33 * u, 0.07 * u); head.scale.setScalar(1.1);
    const kh = new Kit(u);
    const hc = { c: [0, 0.075, 0.025], r: [0.084, 0.072, 0.074] };
    kh.add('tabby', lumpy(210, 0.02, 4, 16, 12), { p: hc.c, s: hc.r, uv: [0.9, 0.7], uvOff: [0.12, 0.15], c: '#ffffff', ao: 0.12 });
    // forehead "M" + crown stripes
    for (const [dx, a] of [[-0.34, 0.15], [0, 0.17], [0.34, 0.15]]) kh.patch('fur', hc, [dx, 0.8, 0.62], a, stripe, { lift: 1.012, squash: [new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), dx * 1.1), 0.2] });
    for (const sx of [-1, 1]) {
      // cheek ruff, muzzle puffs, ears with lynx tufts
      kh.add('fur', lumpy(211 + sx, 0.05, 6, 12, 8), { p: [sx * 0.062, 0.036, 0.042], s: [0.026, 0.03, 0.034], c: '#CDB394' });
      kh.add('fur', sph(10, 8), { p: [sx * 0.021, 0.048, 0.088], s: [0.027, 0.021, 0.025], c: cream });
      kh.add('tabby', cone(12), { p: [sx * 0.05, 0.155, 0.01], r: [-0.1, 0, -sx * 0.28], s: [0.038, 0.075, 0.016], uv: [0.3, 0.3], c: '#ffffff' });
      kh.add('fur', cone(10), { p: [sx * 0.048, 0.148, 0.017], r: [-0.1, 0, -sx * 0.28], s: [0.024, 0.055, 0.006], c: inner });
      kh.add('fur', cone(6), { p: [sx * 0.064, 0.2, 0.008], r: [-0.08, 0, -sx * 0.22], s: [0.006, 0.034, 0.006], c: '#6E5442' });
      kh.add('fur', cone(6), { p: [sx * 0.043, 0.13, 0.024], r: [0.3, 0, -sx * 0.5], s: [0.01, 0.04, 0.006], c: cream });
      // closed, content eyes
      kh.onSurf('button', tor(0.16, 4, 12, PI), hc, [sx * 0.42, 0.12, 1], [0.014, 0.011, 0.012], { r: [0, 0, PI], sink: -0.05, c: '#3B2E25' });
      for (const w of [0, 1, 2]) kh.add('felt', cyl(3), { p: [sx * 0.064, 0.046 - w * 0.008, 0.098], r: [0, sx * 0.25, PI / 2 + sx * (0.06 - w * 0.08)], s: [0.0011, 0.062, 0.0011], c: '#FBF6EE' });
    }
    kh.add('fur', sph(10, 8), { p: [0, 0.025, 0.08], s: [0.026, 0.018, 0.024], c: cream });
    kh.add('felt', sph(10, 6), { p: [0, 0.066, 0.104], s: [0.012, 0.008, 0.007], c: '#D49488' });
    root.add(head);
    head.add(kh.build('coonHead'));
    const tongue = new THREE.Mesh(sph(8, 6), P.mat('#E39A93'));
    tongue.position.set(0, 0.03 * u, 0.1 * u); tongue.scale.set(0.012 * u, 0.006 * u, 0.0001);
    head.add(tongue);
    // ---- left front leg (+X): shoulder → elbow → paw
    const sh = new THREE.Group(); sh.name = 'coonShoulder'; sh.position.set(0.054 * u, 0.25 * u, 0.09 * u);
    const ks = new Kit(u);
    ks.add('tabby', cap(2.0, 8), { p: [0, -0.06, 0], s: 0.032, uvSwap: true, uv: [1, 0.5], c: '#ffffff' });
    sh.add(ks.build('coonUpper'));
    const el = new THREE.Group(); el.position.set(0, -0.12 * u, 0.0);
    const ke = new Kit(u);
    ke.add('tabby', cap(2.3, 8), { p: [0, -0.055, 0], s: 0.029, uvSwap: true, uv: [1, 0.5], uvOff: [0.5, 0], c: '#ffffff' });
    el.add(ke.build('coonFore'));
    const paw = new THREE.Group(); paw.position.set(0, -0.11 * u, 0);
    const kp = new Kit(u);
    kp.add('fur', sph(10, 8), { p: [0, -0.006, 0.016], s: [0.033, 0.024, 0.042], c: cream });
    kp.add('felt', sph(8, 6), { p: [0, -0.028, 0.016], s: [0.016, 0.004, 0.02], c: inner });
    paw.add(kp.build('coonPaw'));
    el.add(paw); sh.add(el); root.add(sh);
    root.add(P.softShadow(0.5 * u, 0.6 * u, 0.5));
    P.setShadows(root, true, true);
    tongue.castShadow = false;
    const L = o.loop;
    function update(t) {
      const p = ((t % L) + L) % L;
      const e = smooth(0, 0.65, p) * (1 - smooth(2.7, 3.3, p));
      const lk = p > 0.65 && p < 2.7 ? Math.sin((p - 0.65) / 2.05 * PI * 3) : 0;
      const lick = Math.max(0, lk) * e;
      sh.rotation.set(-1.3 * e - 0.05 * lick, 0, 0.14 * e);
      el.rotation.set(-1.9 * e + 0.06 * lick, 0, 0);
      paw.rotation.set(0.55 * e, 0, -0.35 * e);
      head.rotation.set(0.3 * e + 0.1 * lick, 0.3 * e, 0.1 * e - 0.03 * lick);
      tongue.scale.z = 0.0001 + 0.016 * u * lick;
      tongue.position.z = (0.1 + 0.01 * lick) * u;
      const ear = smooth(3.3, 3.37, p) * (1 - smooth(3.39, 3.48, p));
      head.position.y = (0.33 - 0.004 * e + 0.0015 * Math.sin(t * TAU / 3.1)) * u;
      tailA.rotation.set(0, 0.08 * Math.sin(t * TAU / 6.3), 0.03 * Math.sin(t * TAU / 4.7));
      tailB.rotation.set(0.0, 0.18 * Math.sin(t * TAU / 4.1 + 0.6) + 0.08 * ear, 0.06 * Math.sin(t * TAU / 3.3));
    }
    update(0);
    return { group: root, update };
  };

  // =====================================================================================
  // SIGN BOARD (extra) — ivory face (unlit, toneMapped:false) in a rose frame
  // =====================================================================================
  P.signBoard = (opts = {}) => {
    const o = Object.assign({ w: 3.3, h: 1.1, depth: 0.08 }, opts);
    const root = new THREE.Group(); root.name = 'signBoard';
    const frame = new THREE.Mesh(rbg(o.w, o.h, o.depth, 0.035, 3), P.mat('#C9937E'));
    frame.castShadow = true; frame.receiveShadow = true;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(o.w * 0.965, o.w * 0.965 * 340 / 1024), P.mat('signFace'));
    face.position.z = o.depth / 2 + 0.002;
    root.add(frame, face);
    root.userData.face = face;
    return root; // centred
  };

  // =====================================================================================
  // SHELF PRODUCTS — ready-made looks per product id (centre-shelf contents)
  // =====================================================================================
  const PRODUCTS = {
    'maine-coon-cat': ['Maine Coon Crochet Cat', 'product'], 'ginger-tabby-cat': ['Ginger Tabby Crochet Cat', 'product'],
    'calico-crochet-cat': ['Calico Crochet Cat', 'product'], 'siamese-cat': ['Siamese Crochet Cat', 'product'], 'white-cat': ['White Crochet Cat', 'product'],
    'british-shorthair-cat': ['British Shorthair Crochet Cat — Sherlock-style outfit', 'product'], 'knitted-sheep': ['Fluffy Knitted Sheep', 'product'],
    'knitted-daisy-duck': ['Knitted Daisy-Pocket Duck', 'product'], 'crochet-animal-friends-set': ['Crochet Animal Friends — Set of Four', 'product'],
    'tuxedo-cat': ['Tuxedo Crochet Cat — From Your Photo', 'product'], 'george-washington-doll': ['George Washington Crochet Doll', 'product'],
    'anne-shirley-set': ['Red-Braid Storybook Doll Set', 'product'], 'bennet-darcy-set': ['Elizabeth Bennet & Mr Darcy Crochet Doll Pair', 'product'],
    'dashwood-ferrars-set': ['Elinor Dashwood & Edward Ferrars Crochet Dolls', 'product'], 'linen-pocket-doll': ['Linen Pocket Doll Bag Charm', 'product'],
    'americana-doll-bag-charm': ['Americana Linen Doll Bag Charm', 'product'], 'quilted-cat-pouch': ['Quilted Appliqué Cat Pouch', 'product'],
    'open-book': ["Merlin's Purrfect Haven", 'book'], 'merlin': ['the real Merlin', 'merlin'],
  };
  P.PRODUCTS = PRODUCTS;
  const pair = (a, b, gap = 0.05) => { const g = new THREE.Group(); a.position.x = -gap; a.rotation.y = 0.18; b.position.x = gap; b.rotation.y = -0.18; g.add(a, b); return P.mergeByMaterial(g, 'pair'); };
  const LOOKS = {
    'maine-coon-cat': () => P.crochetCat({ body: '#A98262', belly: '#F3E6D3', stripes: '#74563F', tufts: true, ruff: '#F0E3CF', muzzle: '#F3E6D3', size: 0.2 }),
    'ginger-tabby-cat': () => P.crochetCat({ body: '#E3A673', belly: '#F7EADA', stripes: '#C98557', muzzle: '#F7EADA', size: 0.17 }),
    'calico-crochet-cat': () => P.crochetCat({ body: '#F8F2E9', size: 0.17, patches: [{ c: '#DFA06C', dir: [-0.7, 0.75, 0.2], a: 0.55 }, { c: '#6E625A', dir: [0.75, 0.7, -0.1], a: 0.5 }, { c: '#DFA06C', dir: [0.9, 0.2, -0.6], a: 0.62, on: 'body' }, { c: '#6E625A', dir: [-0.8, 0.4, -0.7], a: 0.5, on: 'body' }] }),
    'siamese-cat': () => P.crochetCat({ body: '#F2E7D7', points: '#7D6050', eyeColor: '#8FB0C9', size: 0.17 }),
    'white-cat': () => P.crochetCat({ body: '#FBF8F2', ears: '#F0B9AE', bow: '#EFC5B9', size: 0.16 }),
    'british-shorthair-cat': () => P.crochetCat({ body: '#A7ADB2', belly: '#CBCFD2', muzzle: '#CBCFD2', outfit: 'sherlock', eyeColor: '#C9A04A', size: 0.19 }),
    'knitted-sheep': () => P.crochetAnimal('sheep', { size: 0.17 }),
    'knitted-daisy-duck': () => P.crochetAnimal('duck', { size: 0.16, pocket: true }),
    'crochet-animal-friends-set': () => {
      const g = new THREE.Group();
      const items = [P.crochetAnimal('bunny', { size: 0.11 }), P.crochetAnimal('bear', { size: 0.11 }), P.crochetAnimal('duck', { size: 0.1, pocket: false }), P.crochetAnimal('sheep', { size: 0.105, bell: false })];
      items.forEach((it, i) => { it.position.set((i - 1.5) * 0.072, 0, (i % 2) * 0.03); it.rotation.y = (1.5 - i) * 0.12; g.add(it); });
      return P.mergeByMaterial(g, 'friendsSet');
    },
    'tuxedo-cat': () => P.crochetCat({ tuxedo: true, size: 0.19, bow: null }),
    'george-washington-doll': () => P.crochetDoll({ skin: '#F2D6C2', hair: '#F1ECE4', hairStyle: 'colonial', outfit: 'coat', coat: '#4F5D78', waistcoat: '#E2CDA8', epaulette: '#E2CDA8', legs: '#F1E8DA', boots: '#3E3A40', shoes: '#3E3A40', hat: 'tricorn', size: 0.25 }),
    'anne-shirley-set': () => {
      const g = new THREE.Group();
      const d = P.crochetDoll({ skin: '#F4DCC9', hair: '#C9724E', hairStyle: 'braids', dress: '#A9BCA0', pinafore: '#FBF6EE', hat: 'straw', ribbon: '#EFC5B9', size: 0.235 });
      g.add(d);
      const bag = new THREE.Group(); const k = new Kit(1);
      k.add('linenVC', rbg(0.07, 0.05, 0.035, 0.01, 2), { p: [0, 0.025, 0], c: '#C9937E' });
      k.add('metal', tor(0.15, 5, 12, PI), { p: [0, 0.05, 0], s: 0.018, c: HEX.roseGold });
      k.add('felt', box(), { p: [0, 0.03, 0.018], s: [0.07, 0.006, 0.001], c: '#EFC5B9' });
      bag.add(k.build('carpetBag')); bag.position.set(0.075, 0, 0.03); bag.rotation.y = -0.4;
      g.add(bag);
      return P.mergeByMaterial(g, 'redBraidSet');
    },
    'bennet-darcy-set': () => pair(
      P.crochetDoll({ skin: '#F4DCC9', hair: '#6B4F40', hairStyle: 'bun', outfit: 'empire', dress: '#F3E4DA', sash: '#C9937E', ribbon: '#C9937E', size: 0.23 }),
      P.crochetDoll({ skin: '#F0D3BF', hair: '#4E3A30', hairStyle: 'short', outfit: 'coat', coat: '#3F3A3E', waistcoat: '#E9DCCB', legs: '#E2D3BD', boots: '#2F2B2C', shoes: '#2F2B2C', size: 0.245 }), 0.05),
    'dashwood-ferrars-set': () => pair(
      P.crochetDoll({ skin: '#F4DCC9', hair: '#8E6A52', hairStyle: 'bun', outfit: 'empire', dress: '#C9D5E3', sash: '#FBF6EE', hat: 'bonnet', hatColor: '#F6EEE2', ribbon: '#A9BCA0', size: 0.23 }),
      P.crochetDoll({ skin: '#F0D3BF', hair: '#6B4F40', hairStyle: 'short', outfit: 'coat', coat: '#7A5C48', waistcoat: '#F1E6D4', legs: '#E9DCCB', boots: '#4A3A32', shoes: '#4A3A32', size: 0.245 }), 0.05),
    'linen-pocket-doll': () => P.backpack({ hex: '#E9DCCB', doll: { dress: '#EFC5B9', hair: '#8E6A52' } }),
    'americana-doll-bag-charm': () => P.backpack({ hex: '#DCE3E8', pocket: '#C9D3DC', doll: { pattern: 'americana', hair: '#C9A27C', heart: '#C9937E' } }),
    'quilted-cat-pouch': () => P.quiltedPouch({ hex: '#EFC5B9' }),
    'open-book': () => P.fabricBook(),
    'merlin': () => P.photoFrame(T.merlinPhoto(), 0.17, 0.215),
  };
  P.product = (id) => {
    const f = LOOKS[id];
    if (!f) { console.warn('[props] unknown product', id); return new THREE.Group(); }
    const inner = f();
    const g = new THREE.Group(); g.add(inner); g.name = 'product:' + id;
    const [name, kind] = PRODUCTS[id];
    g.userData.pick = { id, name, kind };
    if (id !== 'open-book' && id !== 'merlin') { const b = new THREE.Box3().setFromObject(inner); const w = Math.max(0.08, b.max.x - b.min.x), d = Math.max(0.06, b.max.z - b.min.z); g.add(P.softShadow(w * 1.25, d * 1.4, 0.4)); }
    return g;
  };
  P.productIds = Object.keys(LOOKS);

  // =====================================================================================
  // STATS — triangles / draw calls of any object (for budgets)
  // =====================================================================================
  P.stats = (obj) => {
    let tris = 0, draws = 0;
    obj.traverse((m) => {
      if (!m.isMesh || m.visible === false) return;
      const g = m.geometry; const n = g.index ? g.index.count : g.attributes.position.count;
      const inst = m.isInstancedMesh ? m.count : 1;
      const groups = Array.isArray(m.material) ? Math.max(1, g.groups.length) : 1;
      tris += n / 3 * inst; draws += groups;
    });
    return { tris: Math.round(tris), draws };
  };

  return P;
}
