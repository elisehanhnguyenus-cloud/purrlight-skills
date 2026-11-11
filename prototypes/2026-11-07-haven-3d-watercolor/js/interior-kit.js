// Haven 3D v2 — interior kit (interior agent, PREVIEW 06/11). Helpers used only by interior.js:
//  • Batch: every static piece of the little shop (and the display's products) is merged into ONE mesh per material.
//    Each vertex carries `aPid` (0 = static, 1..N = a product); a tiny vertex patch lifts/scales a product around its
//    base point from uniforms, so main.js's hover animation (which moves the pickable Group) still shows on merged
//    geometry. Meshes that must stay real (the Merlin photo, the pristine book cover) are extracted into the Group.
//  • Matte swap: the library's rose-gold metals become a soft matte peach-pink (the watercolour pass dislikes shine).
//  • Books: one InstancedMesh for every book in the bookcases (T.bookSpines()).
//  • Halos: one draw call of camera-facing additive glows (bulbs, fairy lights).
//  • Canvas textures (no words, nothing from photos): honey plank floor, jute scalloped round rug, candy-stripe wallpaper,
//    picture-book covers, a stitched hoop, a café pictogram board, dó-paper lantern skin, gingham.
//  • Furniture the library does not have: the round 3-tier fluted display, the half-round café counter with cubbies,
//    white distressed vintage shelves, a pink vintage suitcase, the arched built-in niches, a retro chandelier, fairy
//    lights, a felt flower garland, scalloped-liner baskets, the rose-gold hook stand, armchair, lamps, café chairs.
import * as THREE_NS from '../vendor/three.module.min.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';
import { RoundedBoxGeometry as RoundedBox } from '../vendor/RoundedBoxGeometry.js';
import { mulberry32 } from './textures.js';

export const PICK_SLOTS = 24;

export function makeInteriorKit(THREE = THREE_NS, T, P) {
  const K = {};
  const PI = Math.PI, TAU = PI * 2;
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();

  // ===================================================================================== pick shader patch
  /* flat typed arrays (v4 fixer, review #15): three passes them straight to uniform3fv / uniform2fv; arrays of vectors
     were flattened into new arrays on every draw that switched to a patched material. uPiv[3i..3i+2] = pivot of slot i,
     uAnim[2i] = lift (m), uAnim[2i+1] = scale. */
  const uPiv = { value: new Float32Array(PICK_SLOTS * 3) };
  const uAnim = { value: (() => { const a = new Float32Array(PICK_SLOTS * 2); for (let i = 0; i < PICK_SLOTS; i++) a[2 * i + 1] = 1; return a; })() };
  K.pickUniforms = { uPiv, uAnim };
  function patch(m) {
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uPiv = uPiv; sh.uniforms.uAnim = uAnim;
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', `#include <common>\nattribute float aPid;\nuniform vec3 uPiv[${PICK_SLOTS}];\nuniform vec2 uAnim[${PICK_SLOTS}];`)
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n{ int hvI = int(aPid + 0.5); vec2 hvA = uAnim[hvI]; vec3 hvP = uPiv[hvI]; transformed = hvP + (transformed - hvP) * hvA.y + vec3(0.0, hvA.x, 0.0); }');
    };
    m.customProgramCacheKey = () => 'havenPick' + PICK_SLOTS;
    return m;
  }

  // ===================================================================================== materials
  const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.9, metalness: 0 }, o));
  const RGHEX = '#C9937E';
  const CUSTOM = {
    woodVC: () => std({ map: honeyGrainTex(), vertexColors: true, roughness: 0.82 }),
    floorVC: () => std({ map: floorTex(), vertexColors: true, roughness: 0.78, envMapIntensity: 0.7 }),
    wallVC: () => std({ map: stripeTex(), vertexColors: true, roughness: 0.96 }),
    plasterVC: () => std({ map: T.grain(), vertexColors: true, roughness: 0.96 }),
    juteVC: () => std({ map: juteRugTex(), vertexColors: true, roughness: 1 }),
    roundRugVC: () => std({ map: roundRugTex(), vertexColors: true, roughness: 1 }),
    coversVC: () => std({ map: coversTex(), vertexColors: true, roughness: 0.92 }),
    ginghamVC: () => std({ map: ginghamTex(), vertexColors: true, roughness: 1 }),
    runnerVC: () => std({ map: runnerTex(), vertexColors: true, roughness: 1, alphaTest: 0.5 }),
    lanternRib: () => std({ map: lanternTex(), emissive: '#F6BF8C', emissiveMap: lanternTex(), emissiveIntensity: 1.0, roughness: 1, side: THREE.DoubleSide }),
    shadeDS: () => std({ map: T.linen('#ffffff'), vertexColors: true, emissive: '#F3B987', emissiveIntensity: 0.55, roughness: 1, side: THREE.DoubleSide }),
    hoop: () => std({ map: hoopTex(), roughness: 1 }),
    board: () => std({ map: boardTex(), roughness: 1 }),
    rgMatte: () => std({ vertexColors: true, metalness: 0.22, roughness: 0.55, envMapIntensity: 0.8 }),
    rgSolid: () => std({ color: RGHEX, metalness: 0.22, roughness: 0.55, envMapIntensity: 0.8 }),
    satinMatte: () => std({ vertexColors: true, roughness: 0.62 }),
    glassWarm: () => std({ color: '#FFF4E6', roughness: 0.1, transparent: true, opacity: 0.16, depthWrite: false, envMapIntensity: 1.2 }),
    // bulbs are HDR-hot (×1.9) so the paint keeps them as amber sparkles and bleeds a little light around them (v3)
    bulb: () => new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false, color: new THREE.Color(1.9, 1.9, 1.9) }),
  };
  const customCache = new Map(), patched = new Map();
  K.isCustom = (k) => !!CUSTOM[k];
  K.mat = (key) => {
    if (CUSTOM[key]) { let m = customCache.get(key); if (!m) { m = patch(CUSTOM[key]()); m.name = key; customCache.set(key, m); } return m; }
    return K.patched(P.mat(key));
  };
  // the library's shiny rose-gold / satin become matte twins (patched custom materials share the pick program)
  let SWAP = null;
  function swapOf(m) {
    if (!SWAP) SWAP = new Map([[P.mat('metal'), 'rgMatte'], [P.mat('roseGold'), 'rgSolid'], [P.mat('satin'), 'satinMatte']]);
    return SWAP.get(m);
  }
  K.patched = (m) => {
    const sw = swapOf(m); if (sw) return K.mat(sw);
    let pm = patched.get(m);
    if (!pm) { pm = patch(m.clone()); pm.name = (m.name || m.type) + '+pick'; patched.set(m, pm); }
    return pm;
  };


  // ===================================================================================== unit primitives (tagged like the library's, so Kit auto-UVs work)
  const gc = new Map();
  const G = (k, fn) => { let g = gc.get(k); if (!g) { g = fn(); gc.set(k, g); } return g; };
  const tag = (g, kind, meta = {}) => { g.userData.kind = kind; Object.assign(g.userData, meta); return g; };
  K.g = {
    box: () => G('box', () => tag(new THREE.BoxGeometry(1, 1, 1), 'box', { w: 1, h: 1, d: 1 })),
    rbox: (w, h, d, r = 0.02, seg = 2) => P.rboxGeo(w, h, d, r, seg),
    sph: (ws = 16, hs = 12) => G(`s${ws}/${hs}`, () => tag(new THREE.SphereGeometry(1, ws, hs), 'sphere')),
    cyl: (seg = 16, rt = 1, rb = 1, open = false) => G(`c${seg}/${rt}/${rb}/${open}`, () => tag(new THREE.CylinderGeometry(rt, rb, 1, seg, 1, open), 'cyl')),
    tor: (tube = 0.2, rs = 6, ts = 18, arc = TAU) => G(`t${tube}/${rs}/${ts}/${arc}`, () => tag(new THREE.TorusGeometry(1, tube, rs, ts, arc), 'torus', { tube })),
    lathe: (key, pts, segs = 18) => G('l' + key, () => {
      const v = pts.map(([r, y]) => new THREE.Vector2(Math.max(0, r), y));
      let len = 0, rMax = 0; for (let i = 1; i < v.length; i++) len += v[i].distanceTo(v[i - 1]); for (const p of v) rMax = Math.max(rMax, p.x);
      return tag(new THREE.LatheGeometry(v, segs), 'lathe', { len, rMax });
    }),
    tube: (pts, r, tub = 12, rad = 6, closed = false) => {
      const curve = new THREE.CatmullRomCurve3(pts.map((p) => (p.isVector3 ? p : new THREE.Vector3(p[0], p[1], p[2]))), closed, 'catmullrom', 0.5);
      return tag(new THREE.TubeGeometry(curve, tub, r, rad, closed), 'tube', { len: curve.getLength(), r });
    },
    lumpy: (seed = 1, amp = 0.1, freq = 4, ws = 12, hs = 9) => G(`lp${seed}/${amp}/${freq}/${ws}/${hs}`, () => {
      const g = new THREE.SphereGeometry(1, ws, hs), rnd = mulberry32(seed), waves = [];
      for (let i = 0; i < 6; i++) { _v.set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(); waves.push([_v.x, _v.y, _v.z, rnd() * TAU, (0.6 + rnd() * 0.8) * freq]); }
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i); let d = 0;
        for (const w of waves) d += Math.sin((x * w[0] + y * w[1] + z * w[2]) * w[4] + w[3]);
        const s = 1 + amp * d / 2.4; pos.setXYZ(i, x * s, y * s, z * s);
      }
      g.computeVertexNormals();
      return tag(g, 'sphere');
    }),
  };

  // ===================================================================================== Batch
  const KEEP = new Set(['position', 'normal', 'uv', 'color']);
  class Batch {
    constructor() { this.buckets = new Map(); this.kit = new P.Kit(1, 0.0064); this.tag = 'misc'; this.tally = {}; this.lod = null; this.field = null; this.zoneOf = null; }
    _push(mat, g, cast, pid, order) {
      const vc = !!mat.vertexColors;
      for (const n of Object.keys(g.attributes)) if (!KEEP.has(n)) g.deleteAttribute(n);
      if (!vc && g.attributes.color) g.deleteAttribute('color');
      const n = g.attributes.position.count;
      if (vc && !g.attributes.color) g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(n * 3).fill(1), 3));
      if (g.attributes.color && g.attributes.color.itemSize !== 3) {
        const a = g.attributes.color, c3 = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) { c3[i * 3] = a.getX(i); c3[i * 3 + 1] = a.getY(i); c3[i * 3 + 2] = a.getZ(i); }
        g.setAttribute('color', new THREE.Float32BufferAttribute(c3, 3));
      }
      if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n * 2), 2));
      // baked room light: a gentle falloff away from the centre shelf / lamps (static pieces only)
      if (vc && this.field && pid === 0 && this.lod !== 'shelf' && mat.type !== 'MeshBasicMaterial' && !this.noField) {
        const p = g.attributes.position, c = g.attributes.color;
        for (let i = 0; i < n; i++) { const f = this.field(p.getX(i), p.getY(i), p.getZ(i)); c.setXYZ(i, c.getX(i) * f[0], c.getY(i) * f[1], c.getZ(i) * f[2]); }
      }
      if (!g.attributes.normal) g.computeVertexNormals();
      if (!g.index) { const idx = new Uint32Array(n); for (let i = 0; i < n; i++) idx[i] = i; g.setIndex(new THREE.BufferAttribute(idx, 1)); }
      g.setAttribute('aPid', new THREE.Float32BufferAttribute(new Float32Array(n).fill(pid), 1));
      this.tally[this.tag] = (this.tally[this.tag] || 0) + g.index.count / 3;
      g.clearGroups(); g.morphAttributes = {};
      const lod = this.lod;
      // zones let the camera's frustum skip whole groups (e.g. the front of the room from the shelf view)
      let zone = '-';
      if (this.zoneOf) { g.computeBoundingBox(); const bb = g.boundingBox; zone = this.zoneOf((bb.min.x + bb.max.x) / 2, (bb.min.z + bb.max.z) / 2); }
      const key = mat.uuid + '|' + (cast ? 1 : 0) + '|' + order + '|' + (lod || '-') + '|' + zone;
      let b = this.buckets.get(key);
      if (!b) { b = { mat, cast, order, lod, zone, geos: [] }; this.buckets.set(key, b); }
      b.geos.push(g);
    }
    // a primitive through the library Kit (vertex colour, AO gradient, auto UVs for library materials)
    add(key, geo, o = {}) {
      const g = this.kit.add(key, geo, o);
      this.kit.parts[key].pop();
      this._push(K.mat(key), g, o.cast === true, o.pid || 0, o.ro || 0);
      return g;
    }
    // ready-made geometry (already in interior space) with a material key
    raw(key, g, o = {}) { this._push(typeof key === 'string' ? K.mat(key) : K.patched(key), g, o.cast === true, o.pid || 0, o.ro || 0); }
    // swallow a prop (Group/Mesh) placed in interior space: every mesh is merged into the bucket of its material
    absorb(obj, o = {}) {
      const cast = o.cast === true, pid = o.pid || 0, cell = o.cell === undefined ? this.cell || 0 : o.cell;
      if (o.matrix) { obj.matrixAutoUpdate = false; obj.matrix.copy(o.matrix); }
      obj.updateMatrixWorld(true);
      obj.traverse((m) => {
        if (!m.isMesh || !m.geometry) return;
        let hidden = false; for (let p = m; p; p = p.parent) if (p.visible === false) hidden = true;
        if (hidden) return;
        if (o.extract && o.extract(m)) { if (o.out) o.out.push(m); return; }
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        const order = m.renderOrder || 0, mc = cast && m.castShadow !== false;
        const one = (geo, mat) => {
          if (m.isInstancedMesh) {
            for (let i = 0; i < m.count; i++) {
              const g = geo.clone(); m.getMatrixAt(i, _m); g.applyMatrix4(_m); g.applyMatrix4(m.matrixWorld);
              let useMat = mat;
              if (m.instanceColor) {
                m.getColorAt(i, _c); const n = g.attributes.position.count, base = g.attributes.color, col = new Float32Array(n * 3);
                for (let j = 0; j < n; j++) { const f = base ? [base.getX(j), base.getY(j), base.getZ(j)] : [1, 1, 1]; col[j * 3] = f[0] * _c.r; col[j * 3 + 1] = f[1] * _c.g; col[j * 3 + 2] = f[2] * _c.b; }
                g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
                if (!mat.vertexColors) useMat = P.mat('leaf');
              }
              this._push(K.patched(useMat), g, mc, pid, order);
            }
            return;
          }
          let g = geo.clone(); g.applyMatrix4(m.matrixWorld);
          // optional decimation (vertex clustering) for far-ish heavy props; eyes/buttons keep a finer grid
          if (cell && g.index && g.index.count > 240 && !mat.transparent && !mat.isMeshBasicMaterial) {
            const cc = cell * (/^button/.test(mat.name || '') ? 0.45 : 1);
            const gg = clusterGeometry(g, cc); if (gg.index && gg.index.count >= 12) g = gg;
          }
          this._push(K.patched(mat), g, mc, pid, order);
        };
        if (Array.isArray(m.material) && m.geometry.groups.length) {
          for (const gr of m.geometry.groups) one(subGeometry(m.geometry, gr), mats[gr.materialIndex]);
        } else one(m.geometry, mats[0]);
      });
    }
    // lodSpecs { key: {center, dist, cell, nearCell?, mid?: {dist, cell}} }: buckets added while `this.lod === key` go
    // into a THREE.LOD — the full meshes up close, optionally a lightly clustered middle level, and a vertex-clustered
    // copy with merged matte materials when the camera is farther than `dist` (all sub-pixel at their distances)
    // v4 integrator: build() as steps (a yield after each merged bucket / clustered level) so the load can give the
    // browser a turn; build() drains it in one go
    build(parent, name = 'batch', lodSpecs = {}) { const it = this.buildSteps(parent, name, lodSpecs); let r = it.next(); while (!r.done) r = it.next(); return r.value; }
    *buildSteps(parent, name = 'batch', lodSpecs = {}) {
      const out = [], lods = {};
      for (const [key, spec] of Object.entries(lodSpecs)) {
        const lod = new THREE.LOD(); lod.name = `${name}:lod:${key}`; lod.position.copy(spec.center);
        const near = new THREE.Group(); near.position.copy(spec.center).negate(); near.name = 'near';
        const far = new THREE.Group(); far.position.copy(spec.center).negate(); far.name = 'far';
        // v4: hysteresis (spec.hy, a fraction of each switch distance): once a level shows, the camera has to come
        // that much nearer before the finer one comes back, so a camera resting near a switch distance (the pause
        // after the door, the idle drift at the display) never flickers between two levels
        const hy = spec.hy === undefined ? 0.08 : spec.hy;
        lod.addLevel(near, 0, hy);
        let mid = null;
        if (spec.mid) { mid = new THREE.Group(); mid.position.copy(spec.center).negate(); mid.name = 'mid'; lod.addLevel(mid, spec.mid.dist, hy); }
        lod.addLevel(far, spec.dist, hy);
        // optional extra-far level (seen from the street through the windows): the far copy clustered once more
        let xfar = null;
        if (spec.xfar) { xfar = new THREE.Group(); xfar.position.copy(spec.center).negate(); xfar.name = 'xfar'; lod.addLevel(xfar, spec.xfar.dist, hy); }
        parent.add(lod); lods[key] = { lod, near, mid, far, xfar, spec };
      }
      const mk = (geo, b, tag) => {
        geo.computeBoundingSphere(); geo.computeBoundingBox();
        const mesh = new THREE.Mesh(geo, b.mat);
        mesh.name = `${name}:${b.mat.name}${b.cast ? ':cast' : ''}${tag}`;
        mesh.castShadow = b.cast && !b.mat.transparent;
        mesh.receiveShadow = !b.mat.transparent && b.mat.type !== 'MeshBasicMaterial';
        mesh.renderOrder = b.order;
        mesh.matrixAutoUpdate = false; mesh.updateMatrix();
        return mesh;
      };
      const BULK = /^(knit|linenVC|boucle|weave|yarn|clay|felt|metal)\+/;
      const farGroups = new Map();
      // zones only pay off for heavy materials: light ones are folded back into a single bucket
      const tris = new Map();
      for (const b of this.buckets.values()) { const k = b.mat.uuid + '|' + b.cast + '|' + b.order + '|' + b.lod; tris.set(k, (tris.get(k) || 0) + b.geos.reduce((a, g) => a + g.index.count / 3, 0)); }
      for (const [key, b] of [...this.buckets]) {
        if (b.zone === '-' || tris.get(b.mat.uuid + '|' + b.cast + '|' + b.order + '|' + b.lod) >= 5000) continue;
        const k2 = b.mat.uuid + '|' + b.cast + '|' + b.order + '|' + b.lod + '|*';
        let t = this.buckets.get(k2);
        if (!t) { t = Object.assign({}, b, { zone: '-', geos: [] }); this.buckets.set(k2, t); }
        t.geos.push(...b.geos); this.buckets.delete(key);
      }
      for (const b of this.buckets.values()) {
        const L = b.lod && lods[b.lod];
        const geo = b.geos.length === 1 ? b.geos[0] : mergeGeometries(b.geos, false);
        if (!geo) { console.warn('[interior] merge failed for', b.mat.name); continue; }
        if (L) {
          const big = geo.index.count > 600 && !b.mat.transparent;
          const zt = b.zone !== '-' ? ':' + b.zone : '';
          L.near.add(mk(L.spec.nearCell && big && BULK.test(b.mat.name) ? clusterGeometry(geo, L.spec.nearCell) : geo, b, ':near' + zt));
          if (L.mid) L.mid.add(mk(big && !/^button/.test(b.mat.name) ? clusterGeometry(geo, L.spec.mid.cell) : geo, b, ':mid' + zt));
          // far away the fabric/clay textures are sub-pixel: matte vertex-coloured pieces share one material (fewer draws)
          const fm = L.spec.mergeFar ? farMat(b.mat) : b.mat, fb = fm === b.mat ? b : Object.assign({}, b, { mat: fm });
          const fk = fm.uuid + '|' + b.cast + '|' + b.order + '|' + b.lod;
          if (!farGroups.has(fk)) farGroups.set(fk, { b: fb, L, geos: [] });
          farGroups.get(fk).geos.push(geo);
        } else {
          const mesh = mk(geo, b, ''); parent.add(mesh); out.push(mesh);
        }
        yield 'bucket';
      }
      for (const { b, L, geos } of farGroups.values()) {
        const geo = geos.length === 1 ? geos[0] : mergeGeometries(geos, false);
        const big = geo.index.count > 600 && !b.mat.transparent;
        const fg = big ? clusterGeometry(geo, L.spec.cell) : geo;
        L.far.add(mk(fg, b, ':far'));
        if (L.xfar) L.xfar.add(mk(fg.index.count > 300 && !b.mat.transparent ? clusterGeometry(fg, L.spec.xfar.cell) : fg, b, ':xfar'));
        yield 'far';
      }
      this.buckets.clear();
      this.lods = Object.values(lods).map((L) => L.lod);
      return out;
    }
  }
  const MATTE = new Set(['knit', 'felt', 'linenVC', 'weave', 'yarn', 'boucle', 'paperVC', 'terra', 'fur', 'tabby', 'clay']);
  function farMat(m) {
    const base = String(m.name || '').replace('+pick', '');
    if (MATTE.has(base)) return K.mat('clay');
    if (base === 'button') return K.mat('satin');
    return m;
  }
  // vertex clustering (grid of `cell` metres, per pick slot): a cheap far LOD that keeps silhouettes and colours
  function clusterGeometry(geo, cell) {
    const pos = geo.attributes.position, n = pos.count, names = ['position', 'normal', 'uv', 'color', 'aPid'].filter((a) => geo.attributes[a]);
    const map = new Map(), rep = new Int32Array(n), sums = names.map(() => []), cnt = [], first = [];
    const pid = geo.attributes.aPid, nor = geo.attributes.normal;
    for (let i = 0; i < n; i++) {
      const key = (pid ? pid.getX(i) : 0) + '|' + Math.floor(pos.getX(i) / cell) + '|' + Math.floor(pos.getY(i) / cell) + '|' + Math.floor(pos.getZ(i) / cell);
      let c = map.get(key);
      if (c === undefined) { c = cnt.length; map.set(key, c); cnt.push(0); first.push(i); names.forEach((a, k) => { const sz = geo.attributes[a].itemSize; for (let j = 0; j < sz; j++) sums[k].push(0); }); }
      rep[i] = c; cnt[c]++;
      names.forEach((a, k) => { const at = geo.attributes[a], sz = at.itemSize; for (let j = 0; j < sz; j++) sums[k][c * sz + j] += at.array[i * sz + j]; });
    }
    const out = new THREE.BufferGeometry(), m = cnt.length;
    names.forEach((a, k) => {
      const sz = geo.attributes[a].itemSize, arr = new Float32Array(m * sz);
      for (let c = 0; c < m; c++) for (let j = 0; j < sz; j++) arr[c * sz + j] = sums[k][c * sz + j] / cnt[c];
      if (a === 'normal') for (let c = 0; c < m; c++) {
        const l = Math.hypot(arr[c * 3], arr[c * 3 + 1], arr[c * 3 + 2]);
        if (l < 0.3) { arr[c * 3] = nor.getX(first[c]); arr[c * 3 + 1] = nor.getY(first[c]); arr[c * 3 + 2] = nor.getZ(first[c]); }   // opposed faces: keep one
        else { arr[c * 3] /= l; arr[c * 3 + 1] /= l; arr[c * 3 + 2] /= l; }
      }
      if (a === 'aPid') for (let c = 0; c < m; c++) arr[c] = Math.round(arr[c]);
      out.setAttribute(a, new THREE.BufferAttribute(arr, sz));
    });
    const src = geo.index.array, idx = [], seen = new Set();
    for (let t = 0; t < src.length; t += 3) {
      const a = rep[src[t]], b = rep[src[t + 1]], c = rep[src[t + 2]];
      if (a === b || b === c || a === c) continue;
      const k = a < b ? (a < c ? `${a},${b},${c}` : `${c},${a},${b}`) : (b < c ? `${b},${c},${a}` : `${c},${a},${b}`);
      if (seen.has(k)) continue; seen.add(k);
      idx.push(a, b, c);
    }
    out.setIndex(idx);
    return out;
  }
  function subGeometry(geo, gr) {
    const g = new THREE.BufferGeometry();
    for (const n of Object.keys(geo.attributes)) g.setAttribute(n, geo.attributes[n]);
    const src = geo.index ? geo.index.array : null;
    const idx = new Uint32Array(gr.count);
    for (let i = 0; i < gr.count; i++) idx[i] = src ? src[gr.start + i] : gr.start + i;
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    return g;
  }
  K.Batch = Batch;

  // ===================================================================================== Books (one InstancedMesh for every bookcase)
  class Books {
    constructor() { this.items = []; this.atlas = T.bookSpines(); }
    // m: Matrix4 of the book (unit box scaled to w,h,d; spine on +Z), cell index, tone multiplier
    push(matrix, cell, tone = 1, round = false) { this.items.push([matrix.clone(), cell, tone, round]); }
    _uv(geo) {
      const A = this.atlas, cu = 1 / A.cols, cv = 1 / A.rows, v0 = 1 - cv, vTop = 1 - cv * A.topFrac;
      const pos = geo.attributes.position, nor = geo.attributes.normal, uv = new Float32Array(pos.count * 2);
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i) + 0.5, y = pos.getY(i) + 0.5, z = pos.getZ(i) + 0.5, nx = nor.getX(i), ny = nor.getY(i), nz = nor.getZ(i);
        const ax = Math.abs(nx), ay = Math.abs(ny), az = Math.abs(nz);
        let U, V;
        if (az >= ax && az >= ay && nz > 0) { U = cu * (0.03 + 0.94 * x); V = v0 + (vTop - v0) * (0.02 + 0.96 * y); }
        else if (ay >= ax && ay >= az) { U = cu * (0.05 + 0.9 * x); V = vTop + (1 - vTop) * (0.1 + 0.8 * z); }
        else if (az >= ax && az >= ay) { U = cu * (0.05 + 0.9 * x); V = vTop + (1 - vTop) * 0.5; }
        else { U = cu * (0.42 + 0.1 * z); V = v0 + (vTop - v0) * (0.12 + 0.76 * y); }
        uv[i * 2] = U; uv[i * 2 + 1] = V;
      }
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      return geo;
    }
    _geo(round) {
      if (round) {
        const r = new RoundedBox(1, 1, 1, 1, 0.07);
        const g2 = new THREE.BufferGeometry();
        for (const n of ['position', 'normal']) g2.setAttribute(n, r.attributes[n]);
        g2.setIndex(r.index); r.dispose && 0;
        return this._uv(g2);
      }
      // 4 faces: +X, -X, +Y (page tops), +Z (spine); the back and bottom never show
      const base = new THREE.BoxGeometry(1, 1, 1), keep = [0, 1, 2, 4], bi = base.index.array, idx = [];
      for (const gi of keep) { const gr = base.groups[gi]; for (let i = gr.start; i < gr.start + gr.count; i++) idx.push(bi[i]); }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', base.attributes.position); geo.setAttribute('normal', base.attributes.normal);
      geo.setIndex(idx);
      return this._uv(geo);
    }
    build(parent) {
      const out = [];
      const tmp = P.bookRow(1, 0.05); tmp.geometry.dispose();
      /* own copy of the atlas material for these instance-coloured rows (review #14): sharing it with the uncoloured book
         rows made three re-derive the program at every switch */
      const src = tmp.material, mat = src.clone(); mat.name = src.name; mat.userData = src.userData;
      if (src.onBeforeCompile) mat.onBeforeCompile = src.onBeforeCompile; if (src.customProgramCacheKey) mat.customProgramCacheKey = src.customProgramCacheKey;
      for (const round of [false, true]) {
        const items = this.items.filter((it) => !!it[3] === round), n = items.length;
        if (!n) continue;
        const A = this.atlas, geo = this._geo(round), cells = new Float32Array(n * 2);
        const mesh = new THREE.InstancedMesh(geo, mat, n);
        // (fix v3: about half of the bookcase spines take a mid-dark saturated tint — sage, berry, mustard, slate blue,
        //  cocoa — so the bookcases read rich, not as pale blocks)
        const TINT = [[0.55, 0.72, 0.53], [0.8, 0.4, 0.46], [1.0, 0.8, 0.42], [0.55, 0.62, 0.82], [0.72, 0.52, 0.42]];
        items.forEach(([mm, cell, tone], i) => {
          mesh.setMatrixAt(i, mm);
          cells[i * 2] = (cell % A.cols) / A.cols; cells[i * 2 + 1] = -Math.floor(cell / A.cols) / A.rows;
          const h = ((i * 2654435761) >>> 0) % 100, t = !round && h < 48 ? TINT[h % 5] : null;
          if (t) mesh.setColorAt(i, _c.setRGB(tone * t[0], tone * t[1], tone * t[2]));
          else mesh.setColorAt(i, _c.setRGB(tone, tone * 0.985, tone * 0.965));
        });
        geo.setAttribute('aCell', new THREE.InstancedBufferAttribute(cells, 2));
        mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        mesh.computeBoundingSphere(); mesh.computeBoundingBox();
        mesh.castShadow = false; mesh.receiveShadow = true; mesh.name = round ? 'shelfBooks' : 'bookcaseBooks';
        parent.add(mesh); out.push(mesh);
      }
      return out;
    }
  }
  K.Books = Books;

  // ===================================================================================== Halos (camera-facing additive glows, one draw)
  K.halos = (list, parent) => {
    // list: [{p: Vector3|[x,y,z], size, a, color?}]
    const n = list.length; if (!n) return null;
    const c = new Float32Array(n * 12), cr = new Float32Array(n * 8), sz = new Float32Array(n * 4), al = new Float32Array(n * 4), col = new Float32Array(n * 12), idx = [];
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    list.forEach((h, i) => {
      const p = h.p.isVector3 ? h.p : new THREE.Vector3(h.p[0], h.p[1], h.p[2]);
      _c.set(h.color || '#FFC995');
      for (let k = 0; k < 4; k++) {
        const j = i * 4 + k;
        c[j * 3] = p.x; c[j * 3 + 1] = p.y; c[j * 3 + 2] = p.z;
        cr[j * 2] = corners[k][0]; cr[j * 2 + 1] = corners[k][1];
        sz[j] = h.size; al[j] = h.a ?? 1;
        col[j * 3] = _c.r; col[j * 3 + 1] = _c.g; col[j * 3 + 2] = _c.b;
      }
      const b = i * 4; idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(c, 3));
    g.setAttribute('aCorner', new THREE.Float32BufferAttribute(cr, 2));
    g.setAttribute('aSize', new THREE.Float32BufferAttribute(sz, 1));
    g.setAttribute('aAlpha', new THREE.Float32BufferAttribute(al, 1));
    g.setAttribute('aCol', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    const m = new THREE.ShaderMaterial({
      uniforms: { map: { value: T.glow() }, uGain: { value: 1 } },
      vertexShader: 'attribute vec2 aCorner; attribute float aSize; attribute float aAlpha; attribute vec3 aCol;\nvarying vec2 vUv; varying float vA; varying vec3 vCol;\nvoid main(){ vUv = aCorner * 0.5 + 0.5; vA = aAlpha; vCol = aCol; vec4 mv = modelViewMatrix * vec4(position, 1.0); mv.xyz += normalize(-mv.xyz) * aSize * 0.35; mv.xy += aCorner * aSize; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform sampler2D map; uniform float uGain; varying vec2 vUv; varying float vA; varying vec3 vCol;\nvoid main(){ float a = texture2D(map, vUv).a; a = a * a * (3.0 - 2.0 * a); gl_FragColor = vec4(vCol, a * vA * uGain);\n#include <colorspace_fragment>\n}',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
    });
    const mesh = new THREE.Mesh(g, m); mesh.frustumCulled = false; mesh.renderOrder = 5; mesh.name = 'halos';
    parent.add(mesh);
    return mesh;
  };


  // ===================================================================================== canvas textures (no words; no clip())
  function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d', { willReadFrequently: true })]; }   // CPU-backed: these canvases are read back (getImageData) and only uploaded once
  function wrap(c, { repeat = true, srgb = true } = {}) {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
    t.anisotropy = 8; t.needsUpdate = true;
    return t;
  }
  function weave(g, W, H, seed, a = 0.06) {
    const rnd = mulberry32(seed);
    for (let y = 0; y < H; y += 2) { g.fillStyle = `rgba(${rnd() < 0.5 ? '255,250,240' : '120,90,70'},${a * (0.4 + rnd() * 0.6)})`; g.fillRect(0, y, W, 1); }
    for (let x = 0; x < W; x += 3) { g.fillStyle = `rgba(120,90,70,${a * 0.5 * rnd()})`; g.fillRect(x, 0, 1, H); }
    const id = g.getImageData(0, 0, W, H), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const n = (rnd() - 0.5) * 10; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    g.putImageData(id, 0, 0);
  }
  const memo = new Map(); const M = (k, fn) => { if (!memo.has(k)) memo.set(k, fn()); return memo.get(k); };
  function roundRugTex() {
    return M('roundRug', () => {
      const S = 512, [c, g] = cv(S, S), cx = S / 2;
      g.fillStyle = '#E9DCCB'; g.fillRect(0, 0, S, S);
      const ring = (r, col) => { g.fillStyle = col; g.beginPath(); g.arc(cx, cx, r, 0, TAU); g.fill(); };
      // scalloped outer edge
      g.fillStyle = '#C5D3B8';
      g.beginPath();
      for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU, r = 248 - (i % 2 ? 0 : 6); i ? g.lineTo(cx + Math.cos(a) * r, cx + Math.sin(a) * r) : g.moveTo(cx + Math.cos(a) * r, cx + Math.sin(a) * r); }
      g.fill();
      ring(228, '#F4ECDF'); ring(210, '#B9C9AC'); ring(204, '#F1E7D8'); ring(150, '#EFD9CC'); ring(144, '#F6EEE3');
      g.fillStyle = '#C9937E';
      for (let i = 0; i < 36; i++) { const a = i / 36 * TAU; g.beginPath(); g.arc(cx + Math.cos(a) * 177, cx + Math.sin(a) * 177, 4, 0, TAU); g.fill(); }
      g.fillStyle = 'rgba(169,188,160,0.8)';
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.save(); g.translate(cx + Math.cos(a) * 70, cx + Math.sin(a) * 70); g.rotate(a); g.beginPath(); g.ellipse(0, 0, 26, 11, 0, 0, TAU); g.fill(); g.restore(); }
      g.fillStyle = '#E8B7A8'; g.beginPath(); g.arc(cx, cx, 26, 0, TAU); g.fill();
      weave(g, S, S, 9, 0.06);
      const t = wrap(c, { repeat: false });
      return t;
    });
  }
  function stitch(g, fn, col, lw, dash = 12, gap = 7) {
    g.save(); g.strokeStyle = 'rgba(60,40,30,0.25)'; g.lineWidth = lw; g.setLineDash([dash, gap]); g.lineCap = 'round'; g.translate(1, 1.5); fn(g); g.stroke(); g.restore();
    g.save(); g.strokeStyle = col; g.lineWidth = lw; g.setLineDash([dash, gap]); g.lineCap = 'round'; fn(g); g.stroke(); g.restore();
  }
  function hoopTex() {
    return M('hoop', () => {
      const S = 512, [c, g] = cv(S, S);
      g.fillStyle = '#F4EADC'; g.fillRect(0, 0, S, S);
      weave(g, S, S, 21, 0.08);
      const vg = g.createRadialGradient(S / 2, S / 2, S * 0.3, S / 2, S / 2, S * 0.52); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(120,80,60,0.18)');
      g.fillStyle = vg; g.fillRect(0, 0, S, S);
      // crescent moon (satin peach)
      g.fillStyle = '#EDB48E'; g.beginPath(); g.arc(352, 150, 54, 0, TAU); g.fill();
      g.fillStyle = '#F4EADC'; g.beginPath(); g.arc(376, 134, 48, 0, TAU); g.fill();
      for (let i = 0; i < 26; i++) { g.strokeStyle = 'rgba(255,240,220,0.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(300 + i * 2, 110 + i * 3); g.lineTo(300 + i * 3, 196 - i); g.stroke(); }
      // sitting cat (rose running stitch) on a little hill
      stitch(g, (q) => {
        q.beginPath();
        const ox = 150, oy = 170;
        q.moveTo(ox + 40, oy + 70); q.lineTo(ox + 30, oy + 18); q.lineTo(ox + 70, oy + 48);
        q.bezierCurveTo(ox + 84, oy + 44, ox + 100, oy + 44, ox + 114, oy + 48); q.lineTo(ox + 152, oy + 18); q.lineTo(ox + 144, oy + 72);
        q.bezierCurveTo(ox + 164, oy + 108, ox + 150, oy + 140, ox + 124, oy + 150);
        q.bezierCurveTo(ox + 166, oy + 176, ox + 184, oy + 236, ox + 170, oy + 282);
        q.lineTo(ox + 40, oy + 282);
        q.bezierCurveTo(ox + 18, oy + 236, ox + 38, oy + 176, ox + 64, oy + 150);
        q.bezierCurveTo(ox + 30, oy + 136, ox + 22, oy + 100, ox + 40, oy + 70);
        q.moveTo(ox + 168, oy + 270); q.bezierCurveTo(ox + 230, oy + 262, ox + 236, oy + 200, ox + 206, oy + 180);
      }, '#C2786A', 5, 13, 6);
      // eyes (french knots) + nose
      g.fillStyle = '#5A4636'; for (const ex of [222, 262]) { g.beginPath(); g.arc(ex, 268, 6, 0, TAU); g.fill(); }
      g.fillStyle = '#E8A99B'; g.beginPath(); g.moveTo(236, 282); g.lineTo(248, 282); g.lineTo(242, 290); g.fill();
      // hill + yarn ball
      stitch(g, (q) => { q.beginPath(); q.moveTo(70, 470); q.quadraticCurveTo(256, 410, 450, 470); }, '#8EA685', 5, 10, 5);
      g.fillStyle = '#EFC5B9'; g.beginPath(); g.arc(370, 410, 34, 0, TAU); g.fill();
      stitch(g, (q) => { q.beginPath(); q.arc(370, 410, 26, -1, 1.4); q.moveTo(346, 396); q.quadraticCurveTo(372, 408, 392, 434); q.moveTo(340, 420); q.bezierCurveTo(300, 450, 280, 430, 320, 452); }, '#C9937E', 3, 8, 4);
      // stars (cross stitches)
      g.strokeStyle = '#D8B27A'; g.lineWidth = 3; g.setLineDash([]);
      for (const [x, y, r] of [[120, 120, 9], [210, 80, 7], [440, 250, 8], [90, 300, 6], [270, 130, 5]]) { g.beginPath(); g.moveTo(x - r, y); g.lineTo(x + r, y); g.moveTo(x, y - r); g.lineTo(x, y + r); g.moveTo(x - r * 0.6, y - r * 0.6); g.lineTo(x + r * 0.6, y + r * 0.6); g.moveTo(x + r * 0.6, y - r * 0.6); g.lineTo(x - r * 0.6, y + r * 0.6); g.stroke(); }
      return wrap(c, { repeat: false });
    });
  }
  function boardTex() {
    return M('board', () => {
      const W = 512, H = 320, [c, g] = cv(W, H);
      g.fillStyle = '#F1E6D6'; g.fillRect(0, 0, W, H); weave(g, W, H, 31, 0.07);
      stitch(g, (q) => { q.beginPath(); q.rect(18, 18, W - 36, H - 36); }, '#C9937E', 3, 9, 6);
      // cup with heart steam
      const cup = (x, y, s) => {
        g.fillStyle = '#FBF6EE'; g.strokeStyle = '#B97D6C'; g.lineWidth = 4 * s;
        g.beginPath(); g.moveTo(x - 38 * s, y - 30 * s); g.lineTo(x + 38 * s, y - 30 * s); g.quadraticCurveTo(x + 36 * s, y + 30 * s, x, y + 32 * s); g.quadraticCurveTo(x - 36 * s, y + 30 * s, x - 38 * s, y - 30 * s); g.fill(); g.stroke();
        g.beginPath(); g.arc(x + 44 * s, y - 6 * s, 14 * s, -1.4, 1.4); g.stroke();
        g.beginPath(); g.ellipse(x, y + 40 * s, 58 * s, 8 * s, 0, 0, TAU); g.stroke();
        g.fillStyle = '#E8A99B'; heartPath(g, x, y - 72 * s, 12 * s); g.fill();
        stitch(g, (q) => { q.beginPath(); q.moveTo(x - 14 * s, y - 40 * s); q.bezierCurveTo(x - 26 * s, y - 52 * s, x - 2 * s, y - 60 * s, x - 14 * s, y - 74 * s); q.moveTo(x + 14 * s, y - 40 * s); q.bezierCurveTo(x + 2 * s, y - 52 * s, x + 26 * s, y - 60 * s, x + 14 * s, y - 74 * s); }, '#C9937E', 3 * s, 6, 4);
      };
      cup(140, 175, 1.15);
      // croissant
      g.fillStyle = '#E3B98A'; g.strokeStyle = '#B98A5E'; g.lineWidth = 3;
      for (let i = -2; i <= 2; i++) { g.beginPath(); g.ellipse(300 + i * 22, 180 - Math.abs(i) * 6, 18 - Math.abs(i) * 3, 30 - Math.abs(i) * 5, i * 0.35, 0, TAU); g.fill(); g.stroke(); }
      // teapot pictogram
      g.fillStyle = '#C5D3B8'; g.strokeStyle = '#7F9A7A'; g.lineWidth = 4;
      g.beginPath(); g.ellipse(420, 190, 42, 34, 0, 0, TAU); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(458, 182); g.quadraticCurveTo(486, 168, 490, 146); g.stroke();
      g.beginPath(); g.arc(378, 188, 16, 1.7, 4.6); g.stroke();
      g.fillStyle = '#7F9A7A'; g.beginPath(); g.ellipse(420, 152, 14, 6, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(420, 142, 5, 0, TAU); g.fill();
      // little dotted garland
      g.fillStyle = '#E8B7A8'; for (let x = 50; x < W - 40; x += 22) { g.beginPath(); g.arc(x, 62 + Math.sin(x / 40) * 8, 4, 0, TAU); g.fill(); }
      g.fillStyle = '#D8B27A'; for (let x = 60; x < W - 40; x += 44) { g.beginPath(); g.arc(x, 270, 3.5, 0, TAU); g.fill(); }
      return wrap(c, { repeat: false });
    });
  }
  function heartPath(g, x, y, s) {
    g.beginPath(); g.moveTo(x, y + s * 0.9);
    g.bezierCurveTo(x - s * 1.4, y - s * 0.1, x - s * 0.7, y - s * 1.1, x, y - s * 0.35);
    g.bezierCurveTo(x + s * 0.7, y - s * 1.1, x + s * 1.4, y - s * 0.1, x, y + s * 0.9); g.closePath();
  }
  // French cream/oat cabochon tiles, softer than the library sheet (lower grout contrast, warmer)
  function lanternTex() {
    return M('lantern', () => {
      const W = 256, H = 256, [c, g] = cv(W, H), rnd = mulberry32(17);
      g.fillStyle = '#F6ECDC'; g.fillRect(0, 0, W, H);
      for (let k = 0; k < 260; k++) { g.strokeStyle = `rgba(${rnd() < 0.6 ? '200,170,135' : '255,255,250'},${0.08 + rnd() * 0.14})`; g.lineWidth = 0.6 + rnd(); const x = rnd() * W, y = rnd() * H, a = rnd() * TAU, l = 6 + rnd() * 26; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
      for (let i = 0; i < 8; i++) { const x = (i + 0.5) * W / 8; g.fillStyle = 'rgba(150,110,80,0.55)'; g.fillRect(x - 1.5, 0, 3, H); g.fillStyle = 'rgba(255,240,220,0.35)'; g.fillRect(x + 1.5, 0, 1, H); }
      g.fillStyle = 'rgba(170,125,95,0.5)'; g.fillRect(0, 0, W, 10); g.fillRect(0, H - 10, W, 10);
      return wrap(c);
    });
  }
  // ---- v2 textures -------------------------------------------------------------------------------------------------
  // honey grain for furniture (whitish: the colour lives in the vertex colours), long soft streaks, no plank seams
  function honeyGrainTex() {
    return M('honeyGrain', () => {
      const S = 512, [c, g] = cv(S, S), rnd = mulberry32(77);
      g.fillStyle = '#F4EEE6'; g.fillRect(0, 0, S, S);
      for (let k = 0; k < 140; k++) {
        const y = rnd() * S, amp = 2 + rnd() * 6, cyc = 1 + Math.floor(rnd() * 3), ph = rnd() * TAU, dark = rnd() < 0.62;
        g.strokeStyle = dark ? `rgba(150,110,70,${0.05 + rnd() * 0.08})` : `rgba(255,252,246,${0.12 + rnd() * 0.12})`;
        g.lineWidth = 1 + rnd() * 3.5;
        for (const oy of [-S, 0, S]) {
          g.beginPath();
          for (let x = 0; x <= S; x += 8) { const yy = y + oy + Math.sin(x / S * TAU * cyc + ph) * amp; x ? g.lineTo(x, yy) : g.moveTo(x, yy); }
          g.stroke();
        }
      }
      const id = g.getImageData(0, 0, S, S), d = id.data;
      for (let i = 0; i < d.length; i += 4) { const n = (rnd() - 0.5) * 6; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
      g.putImageData(id, 0, 0);
      return wrap(c);
    });
  }
  // honey planks, 0.2 m boards (a 1024² tile = 3.2 m square); boards run along texture x
  function floorTex() {
    return M('floor2', () => {
      const S = 1024, n = 16, bh = S / n, [c, g] = cv(S, S), rnd = mulberry32(5);
      const tones = ['#D5A673', '#CD9C69', '#DBAF80', '#D0A170', '#D8AB7B', '#C99665'];
      for (let i = 0; i < n; i++) {
        const y = i * bh;
        let x = -rnd() * 320;
        while (x < S) {
          const len = 300 + rnd() * 460, tone = tones[Math.floor(rnd() * tones.length)];
          const draw = (ox) => {
            g.fillStyle = tone; g.fillRect(x + ox, y, len, bh);
            // soft grain: a few long faint streaks inside the board
            for (let k = 0; k < 7; k++) {
              const yy = y + 6 + rnd() * (bh - 12);
              g.strokeStyle = rnd() < 0.6 ? `rgba(140,95,55,${0.05 + rnd() * 0.07})` : `rgba(255,240,215,${0.08 + rnd() * 0.08})`;
              g.lineWidth = 1 + rnd() * 3; g.beginPath(); g.moveTo(x + ox, yy);
              for (let s = 0; s <= len; s += 40) g.lineTo(x + ox + s, yy + Math.sin(s / 90 + k) * 1.6);
              g.stroke();
            }
            // end joint
            g.fillStyle = 'rgba(120,80,48,0.38)'; g.fillRect(x + ox, y, 2, bh);
          };
          draw(0); if (x + len > S) draw(-S); if (x < 0) draw(S);
          x += len;
        }
        // long seam between boards (soft, slightly warm) + a highlight on the next board's edge
        g.fillStyle = 'rgba(115,76,45,0.42)'; g.fillRect(0, y, S, 2.2);
        g.fillStyle = 'rgba(255,238,210,0.28)'; g.fillRect(0, y + 2.2, S, 1.6);
      }
      const id = g.getImageData(0, 0, S, S), d = id.data;
      for (let i = 0; i < d.length; i += 4) { const v = (rnd() - 0.5) * 6; d[i] += v; d[i + 1] += v; d[i + 2] += v; }
      g.putImageData(id, 0, 0);
      return wrap(c);
    });
  }
  // candy-stripe wallpaper: cream / pale blush, hand-painted edges (a 512² tile = 0.64 m wide, 8 stripes of 8 cm)
  function stripeTex() {
    return M('stripes', () => {
      const S = 512, n = 8, w = S / n, [c, g] = cv(S, S), rnd = mulberry32(19);
      g.fillStyle = '#FBF4EA'; g.fillRect(0, 0, S, S);
      for (let i = 0; i < n; i += 2) {
        const x0 = i * w, ph1 = rnd() * TAU, ph2 = rnd() * TAU;
        g.fillStyle = '#F2D6CA';
        g.beginPath();
        for (let y = 0; y <= S; y += 8) { const xx = x0 + 1.6 * Math.sin(y / S * TAU * 3 + ph1) + 0.8 * Math.sin(y / S * TAU * 7 + ph2); y ? g.lineTo(xx, y) : g.moveTo(xx, y); }
        for (let y = S; y >= 0; y -= 8) { const xx = x0 + w + 1.6 * Math.sin(y / S * TAU * 2 + ph2) + 0.8 * Math.sin(y / S * TAU * 5 + ph1); g.lineTo(xx, y); }
        g.closePath(); g.fill();
      }
      // a tiny painted sprig dot in the middle of each cream stripe (retro wallpaper), tileable spacing
      for (let i = 1; i < n; i += 2) for (let k = 0; k < 4; k++) {
        const x = (i + 0.5) * w, y = (k + 0.5) * S / 4 + (i % 4 === 1 ? S / 8 : 0);
        g.fillStyle = 'rgba(214,160,140,0.55)'; g.beginPath(); g.arc(x, y % S, 3.2, 0, TAU); g.fill();
        g.fillStyle = 'rgba(150,175,140,0.5)'; g.beginPath(); g.ellipse(x - 6, (y + 5) % S, 4, 1.8, -0.6, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x + 6, (y + 5) % S, 4, 1.8, 0.6, 0, TAU); g.fill();
      }
      // gentle mottling so it reads painted, not printed
      for (let k = 0; k < 160; k++) { g.fillStyle = `rgba(${rnd() < 0.5 ? '255,252,246' : '190,150,130'},${0.025 + rnd() * 0.03})`; const x = rnd() * S, y = rnd() * S, r = 10 + rnd() * 40; for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) { g.beginPath(); g.arc(x + ox, y + oy, r, 0, TAU); g.fill(); } }
      return wrap(c);
    });
  }
  // the jute scalloped round rug (Masa's-corner shape): coiled rings and a scalloped border of coils.
  // Geometry from K.juteRug() maps 2*JUTE.R metres onto the texture.
  const JUTE = { R: 1.44, Rb: 1.31, n: 30 };
  JUTE.rs = PI * JUTE.Rb / JUTE.n;
  function juteRugTex() {
    return M('jute', () => {
      const S = 1024, [c, g] = cv(S, S), cx = S / 2, k = (S / 2 - 4) / JUTE.R, rnd = mulberry32(31);
      g.fillStyle = '#C9A77C'; g.fillRect(0, 0, S, S);              // v3: darker than the honey floor (no pale disc)
      let tones = ['#CDAB80', '#C19E73'];
      const coil = (x, y, r0, r1, step, seed) => {
        const rr = mulberry32(seed);
        for (let r = r0; r <= r1; r += step) {
          g.strokeStyle = rr() < 0.5 ? tones[0] : tones[1]; g.lineWidth = step * 0.9;
          g.beginPath(); g.arc(x, y, r, 0, TAU); g.stroke();
          // braid ticks
          g.strokeStyle = 'rgba(120,88,52,0.16)'; g.lineWidth = 1.2;
          const m = Math.max(6, Math.floor(TAU * r / 9));
          for (let i = 0; i < m; i++) {
            const a = i / m * TAU + rr() * 0.02, ca = Math.cos(a), sa = Math.sin(a);
            g.beginPath(); g.moveTo(x + ca * (r - step * 0.35), y + sa * (r - step * 0.35)); g.lineTo(x + Math.cos(a + 0.6 / Math.max(r, 8)) * (r + step * 0.35), y + Math.sin(a + 0.6 / Math.max(r, 8)) * (r + step * 0.35)); g.stroke();
          }
        }
      };
      coil(cx, cx, 4, JUTE.Rb * k, 11, 3);
      // two braided rings (a warmer jute and a soft blush wool ring: retro-sweet, big enough to survive the wash)
      g.strokeStyle = 'rgba(176,132,86,0.32)'; g.lineWidth = 26; g.beginPath(); g.arc(cx, cx, JUTE.Rb * k * 0.72, 0, TAU); g.stroke();
      g.strokeStyle = 'rgba(226,160,146,0.42)'; g.lineWidth = 16; g.beginPath(); g.arc(cx, cx, JUTE.Rb * k * 0.84, 0, TAU); g.stroke();
      // the scalloped border: warmer, darker coils with a soft outline so the scallops read against the honey floor
      tones = ['#A88259', '#9C774F'];
      for (let i = 0; i < JUTE.n; i++) {
        const a = i / JUTE.n * TAU, x = cx + Math.cos(a) * JUTE.Rb * k, y = cx + Math.sin(a) * JUTE.Rb * k;
        g.fillStyle = '#A88259'; g.beginPath(); g.arc(x, y, JUTE.rs * k, 0, TAU); g.fill();
        coil(x, y, 3, JUTE.rs * k - 4, 8, 100 + i);
        g.strokeStyle = 'rgba(122,86,52,0.2)'; g.lineWidth = 3; g.beginPath(); g.arc(x, y, JUTE.rs * k - 2, 0, TAU); g.stroke();
      }
      // the inner rim where the border coils meet the body
      g.strokeStyle = 'rgba(150,108,66,0.3)'; g.lineWidth = 6; g.beginPath(); g.arc(cx, cx, JUTE.Rb * k - JUTE.rs * k + 2, 0, TAU); g.stroke();
      const id = g.getImageData(0, 0, S, S), d = id.data;
      for (let i = 0; i < d.length; i += 4) { const v = (rnd() - 0.5) * 10; d[i] += v; d[i + 1] += v; d[i + 2] += v; }
      g.putImageData(id, 0, 0);
      return wrap(c, { repeat: false });
    });
  }
  // eight pastel picture-book covers (4 x 2 atlas): simple painted pictures, a blank title band, no words
  function coversTex() {
    return M('covers2', () => {
      const W = 1024, H = 512, cw = 256, [c, g] = cv(W, H);
      const bg = ['#A9BCA0', '#EFC5B9', '#F3E2B8', '#C9D5E3', '#D9CFE3', '#F1D3B6', '#C5D3B8', '#F4DCD2'];
      const draw = [
        (x, y) => { g.fillStyle = '#FFF8EA'; g.beginPath(); g.arc(x + 170, y + 80, 30, 0, TAU); g.fill(); g.fillStyle = bg[0]; g.beginPath(); g.arc(x + 184, y + 70, 26, 0, TAU); g.fill(); catSil(x + 110, y + 196, 1.2, '#FBF6EE'); },
        (x, y) => { g.fillStyle = '#FBF6EE'; g.beginPath(); g.arc(x + 128, y + 110, 52, PI, TAU); g.lineTo(x + 150, y + 160); g.lineTo(x + 106, y + 160); g.closePath(); g.fill(); g.fillStyle = '#C9937E'; g.fillRect(x + 112, y + 168, 32, 24); g.strokeStyle = '#C9937E'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 106, y + 160); g.lineTo(x + 112, y + 168); g.moveTo(x + 150, y + 160); g.lineTo(x + 144, y + 168); g.stroke(); },
        (x, y) => { g.fillStyle = '#E9A9A0'; g.beginPath(); g.moveTo(x + 70, y + 130); g.lineTo(x + 128, y + 80); g.lineTo(x + 186, y + 130); g.fill(); g.fillStyle = '#FBF6EE'; g.fillRect(x + 82, y + 130, 92, 70); g.fillStyle = '#A9BCA0'; g.fillRect(x + 116, y + 160, 24, 40); g.fillStyle = '#F3D88C'; g.fillRect(x + 92, y + 142, 18, 16); g.fillRect(x + 146, y + 142, 18, 16); },
        (x, y) => { g.fillStyle = '#F3D88C'; g.beginPath(); g.ellipse(x + 128, y + 150, 50, 36, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(x + 160, y + 106, 26, 0, TAU); g.fill(); g.fillStyle = '#E8A87C'; g.beginPath(); g.moveTo(x + 182, y + 104); g.lineTo(x + 206, y + 112); g.lineTo(x + 182, y + 118); g.fill(); g.fillStyle = '#4A423B'; g.beginPath(); g.arc(x + 166, y + 100, 4, 0, TAU); g.fill(); },
        (x, y) => { g.fillStyle = '#FBF6EE'; g.beginPath(); g.ellipse(x + 128, y + 160, 40, 34, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(x + 128, y + 112, 28, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x + 114, y + 70, 9, 28, -0.15, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x + 142, y + 70, 9, 28, 0.15, 0, TAU); g.fill(); g.fillStyle = '#EFC5B9'; g.beginPath(); g.arc(x + 120, y + 120, 5, 0, TAU); g.arc(x + 136, y + 120, 5, 0, TAU); g.fill(); },
        (x, y) => { g.fillStyle = '#8FA9C2'; g.beginPath(); g.ellipse(x + 120, y + 140, 64, 34, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x + 176, y + 140); g.lineTo(x + 208, y + 112); g.lineTo(x + 206, y + 158); g.fill(); g.fillStyle = '#FBF6EE'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x + 110 + i * 10, y + 92 - i * 8, 5, 0, TAU); g.fill(); } },
        (x, y) => { for (const [fx, fy, col] of [[90, 120, '#EFC5B9'], [150, 100, '#FBF6EE'], [128, 160, '#F3D88C'], [180, 150, '#E9A9A0']]) { g.fillStyle = col; for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; g.beginPath(); g.arc(x + fx + Math.cos(a) * 12, y + fy + Math.sin(a) * 12, 10, 0, TAU); g.fill(); } g.fillStyle = '#E8A87C'; g.beginPath(); g.arc(x + fx, y + fy, 6, 0, TAU); g.fill(); } },
        (x, y) => { g.fillStyle = '#B98A66'; g.beginPath(); g.arc(x + 128, y + 150, 42, 0, TAU); g.fill(); g.beginPath(); g.arc(x + 128, y + 96, 32, 0, TAU); g.fill(); g.beginPath(); g.arc(x + 102, y + 70, 12, 0, TAU); g.arc(x + 154, y + 70, 12, 0, TAU); g.fill(); g.fillStyle = '#F3E2C8'; g.beginPath(); g.ellipse(x + 128, y + 106, 13, 10, 0, 0, TAU); g.fill(); g.fillStyle = '#4A423B'; g.beginPath(); g.arc(x + 118, y + 92, 3.5, 0, TAU); g.arc(x + 138, y + 92, 3.5, 0, TAU); g.fill(); },
      ];
      function catSil(x, y, s, col) {
        g.fillStyle = col; g.beginPath(); g.ellipse(x, y - 30 * s, 30 * s, 34 * s, 0, 0, TAU); g.fill();
        g.beginPath(); g.arc(x, y - 78 * s, 22 * s, 0, TAU); g.fill();
        g.beginPath(); g.moveTo(x - 20 * s, y - 88 * s); g.lineTo(x - 14 * s, y - 112 * s); g.lineTo(x - 4 * s, y - 96 * s); g.fill();
        g.beginPath(); g.moveTo(x + 20 * s, y - 88 * s); g.lineTo(x + 14 * s, y - 112 * s); g.lineTo(x + 4 * s, y - 96 * s); g.fill();
        g.lineWidth = 8 * s; g.strokeStyle = col; g.beginPath(); g.moveTo(x + 26 * s, y - 10 * s); g.quadraticCurveTo(x + 64 * s, y - 10 * s, x + 54 * s, y - 50 * s); g.stroke();
      }
      for (let i = 0; i < 8; i++) {
        const x = (i % 4) * cw, y = Math.floor(i / 4) * cw;
        g.fillStyle = bg[i]; g.fillRect(x, y, cw, cw);
        g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(x + 14, y + 14, cw - 28, cw - 28);
        g.fillStyle = bg[i]; g.fillRect(x + 20, y + 20, cw - 40, cw - 40);
        draw[i](x, y);
        // a blank cream title band (no letters) and a spine shadow
        g.fillStyle = 'rgba(251,246,238,0.85)'; g.fillRect(x + 40, y + 26, cw - 80, 22);
        g.fillStyle = 'rgba(90,60,40,0.18)'; g.fillRect(x, y, 10, cw);
      }
      weave(g, W, H, 41, 0.05);
      const t = wrap(c, { repeat: false });
      return t;
    });
  }
  // blush gingham (a 256² tile = 4 checks)
  function ginghamTex() {
    return M('gingham', () => {
      const S = 256, [c, g] = cv(S, S), q = S / 4;
      g.fillStyle = '#FBF6EE'; g.fillRect(0, 0, S, S);
      g.fillStyle = 'rgba(226,150,140,0.45)';
      for (let i = 0; i < 4; i += 2) { g.fillRect(i * q, 0, q, S); g.fillRect(0, i * q, S, q); }
      g.fillStyle = 'rgba(205,120,112,0.35)';
      for (let i = 0; i < 4; i += 2) for (let j = 0; j < 4; j += 2) g.fillRect(i * q, j * q, q, q);
      weave(g, S, S, 12, 0.08);
      return wrap(c);
    });
  }
  // a retro rag-rug runner (cream with blush, sage and honey bands, cotton fringe at both ends); u across, v along
  function runnerTex() {
    return M('runner', () => {
      const W = 256, H = 512, [c, g] = cv(W, H), rnd = mulberry32(57), fr = 22;
      g.clearRect(0, 0, W, H);
      g.fillStyle = '#E3D2BC'; g.fillRect(8, fr, W - 16, H - fr * 2);   // v3: oat, not a white rectangle
      // bands across the runner (symmetric), each a little uneven like hand-woven rag strips (v3: stronger blush + sage)
      const bands = [[0.07, 0.04, '#D98E80'], [0.12, 0.02, '#93AA87'], [0.16, 0.025, '#D98E80'], [0.3, 0.06, '#E3AE9C'], [0.4, 0.02, '#93AA87'], [0.5, 0.085, '#D69384'], [0.5, 0.02, '#F1E4D0']];
      for (const [t, h, col] of bands) for (const tt of t === 0.5 ? [0.5] : [t, 1 - t]) {
        const y = fr + tt * (H - fr * 2), hh = h * (H - fr * 2);
        g.fillStyle = col; g.beginPath(); g.moveTo(8, y - hh / 2);
        for (let x = 8; x <= W - 8; x += 16) g.lineTo(x, y - hh / 2 + (rnd() - 0.5) * 2.2);
        for (let x = W - 8; x >= 8; x -= 16) g.lineTo(x, y + hh / 2 + (rnd() - 0.5) * 2.2);
        g.closePath(); g.fill();
      }
      // a sage-and-blush border stripe along both long edges
      for (const x of [14, W - 22]) { g.fillStyle = '#9EB292'; g.fillRect(x, fr, 8, H - fr * 2); }
      weave(g, W, H, 58, 0.09);
      // fringe: little cotton tassels (alpha-tested) at both ends
      for (const [y0, dir] of [[fr, -1], [H - fr, 1]]) {
        g.clearRect(0, dir < 0 ? 0 : H - fr, W, fr);
        g.strokeStyle = '#F6EEE1'; g.lineCap = 'round';
        for (let x = 14; x < W - 10; x += 9) { g.lineWidth = 3.2; g.beginPath(); g.moveTo(x, y0); g.lineTo(x + (rnd() - 0.5) * 3, y0 + dir * (fr - 4 - rnd() * 5)); g.stroke(); }
      }
      // the canvas edge outside the runner stays transparent
      g.clearRect(0, 0, 8, H); g.clearRect(W - 8, 0, 8, H);
      return wrap(c, { repeat: false });
    });
  }
  K.tex = { runnerTex, roundRugTex, hoopTex, boardTex, floorTex, lanternTex, honeyGrainTex, stripeTex, juteRugTex, coversTex, ginghamTex };
  K.JUTE = JUTE;

  // ===================================================================================== furniture (v1, retuned) + v2 pieces
  const g = K.g;
  const RG = RGHEX;
  // all builders: add into batch B at matrix W (Matrix4: local -> interior), local origin at the floor, facing +Z
  const at = (W, x, y, z, ry = 0) => new THREE.Matrix4().makeRotationY(ry).setPosition(x, y, z).premultiply(W);
  K.at = at;
  function shade(hex, amt) { return T.shade(hex, amt); }
  K.shade = shade;

  K.cafeChair = (B, W, o = {}) => {
    const rt = o.frame || '#CDAE86', cu = o.cushion || '#EFC5B9', sy = 0.46, cast = o.cast !== false;
    B.add('clay', g.cyl(12), { p: [0, sy - 0.02, 0], s: [0.2, 0.035, 0.19], c: rt, post: W, cast });
    B.add('linenVC', g.rbox(0.34, 0.05, 0.32, 0.022, 1), { p: [0, sy + 0.02, 0.01], c: cu, ao: 0.2, post: W, cast });
    for (const [x, z] of [[-0.14, 0.12], [0.14, 0.12], [-0.13, -0.12], [0.13, -0.12]]) {
      const a = new THREE.Vector3(x * 0.95, sy - 0.03, z * 0.95), b = new THREE.Vector3(x * 1.2, 0.0, z * 1.2);
      const d = b.clone().sub(a), len = d.length();
      _q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
      _e.setFromQuaternion(_q);
      B.add('clay', g.cyl(5, 0.75, 1), { p: [(a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2], r: [_e.x, _e.y, _e.z], s: [0.014, len, 0.014], c: rt, ao: 0.25, post: W, cast });
    }
    B.add('clay', g.tor(0.07, 3, 12), { p: [0, 0.2, 0], r: [PI / 2, 0, 0], s: [0.185, 0.17, 0.2], c: rt, post: W, cast });
    B.add('clay', g.tor(0.07, 4, 10, PI), { p: [0, sy + 0.18, -0.17], r: [-0.12, 0, 0], s: [0.17, 0.2, 0.17], c: rt, post: W, cast });
    for (const sx of [-1, 1]) B.add('clay', g.cyl(5), { p: [sx * 0.17, sy + 0.09, -0.165], r: [-0.12, 0, 0], s: [0.012, 0.18, 0.012], c: rt, post: W, cast });
    B.add('clay', g.rbox(0.26, 0.06, 0.02, 0.01, 1), { p: [0, sy + 0.2, -0.19], r: [-0.12, 0, 0], c: shade(rt, 0.06), post: W, cast });
  };

  K.armchair = (B, W, o = {}) => {
    const c = o.hex || '#EBC9BC', cast = o.cast !== false, k = 'linenVC';
    B.add(k, g.rbox(0.86, 0.3, 0.8, 0.09, 2), { p: [0, 0.27, 0], c: shade(c, -0.04), ao: 0.25, post: W, cast });
    B.add(k, g.rbox(0.6, 0.15, 0.62, 0.07, 2), { p: [0, 0.48, 0.05], c, post: W, cast });
    B.add(k, g.rbox(0.82, 0.62, 0.2, 0.09, 2), { p: [0, 0.68, -0.31], r: [-0.12, 0, 0], c, ao: 0.15, post: W, cast });
    for (const sx of [-1, 1]) {
      B.add(k, g.rbox(0.17, 0.36, 0.78, 0.08, 2), { p: [sx * 0.36, 0.5, 0.0], c, ao: 0.2, post: W, cast });
      B.add(k, g.cyl(14), { p: [sx * 0.36, 0.69, 0.0], r: [PI / 2, 0, 0], s: [0.1, 0.78, 0.1], c: shade(c, 0.03), post: W, cast });
      for (const sz of [-1, 1]) B.add('clay', g.cyl(8, 0.7, 1), { p: [sx * 0.34, 0.06, sz * 0.31], s: [0.026, 0.12, 0.026], c: '#B9906E', post: W, cast });
    }
    B.add(k, g.lumpy(7, 0.06, 3, 14, 10), { p: [0.12, 0.66, -0.16], r: [0.2, 0.3, 0.15], s: [0.18, 0.15, 0.07], c: '#F6EEE2', post: W, cast });
    B.add('knit', g.rbox(0.3, 0.012, 0.5, 0.006, 1), { p: [-0.36, 0.86, 0.02], s: 1, c: '#A9BCA0', post: W, cast, uv: [5, 8] });
    B.add('knit', g.rbox(0.012, 0.3, 0.5, 0.006, 1), { p: [-0.452, 0.72, 0.02], c: '#A9BCA0', post: W, cast, uv: [8, 5] });
  };

  K.sideTable = (B, W, o = {}) => {
    const h = o.h || 0.58, r = o.r || 0.26, cast = o.cast !== false;
    B.add('woodVC', g.cyl(20), { p: [0, h - 0.02, 0], s: [r, 0.04, r], c: '#F3E7D8', uv: [2, 0.4], post: W, cast });
    B.add('metal', g.tor(0.06, 4, 32), { p: [0, h - 0.02, 0], r: [PI / 2, 0, 0], s: [r + 0.002, r + 0.002, 0.3], c: RG, post: W, cast });
    B.add('clay', g.lathe('sideStem' + h, [[0.12, 0], [0.13, 0.02], [0.05, 0.05], [0.03, 0.12], [0.026, h * 0.5], [0.04, h * 0.55], [0.026, h * 0.6], [0.03, h - 0.04], [0, h - 0.04]], 12), { c: '#E2CCAE', ao: 0.25, post: W, cast });
  };

  K.floorLamp = (B, W, halos, o = {}) => {
    const h = o.h || 1.55, cast = o.cast !== false;
    B.add('metal', g.lathe('flBase', [[0, 0], [0.16, 0], [0.165, 0.015], [0.14, 0.03], [0, 0.03]], 18), { c: RG, post: W, cast });
    B.add('metal', g.cyl(8), { p: [0, h / 2, 0], s: [0.012, h, 0.012], c: RG, post: W, cast });
    B.add('shadeDS', g.lathe('flShade', [[0.2, 0], [0.19, 0.04], [0.14, 0.24], [0.12, 0.26], [0, 0.26]], 18), { p: [0, h, 0], post: W, cast: false });
    B.add('glowVC', g.sph(10, 8), { p: [0, h + 0.07, 0], s: 0.05, c: '#FFF4E6', post: W, cast: false });
    const bp = new THREE.Vector3(0, h + 0.08, 0).applyMatrix4(W);
    halos.push({ p: bp, size: 0.55, a: 0.55 });
  };

  K.espresso = (B, W, o = {}) => {
    const cast = o.cast !== false, body = '#F6EEE3', band = '#EFC5B9';
    B.add('satin', g.rbox(0.56, 0.36, 0.42, 0.06, 1), { p: [0, 0.27, 0], c: body, ao: 0.15, post: W, cast });
    B.add('satin', g.rbox(0.57, 0.07, 0.43, 0.03, 1), { p: [0, 0.2, 0], c: band, post: W, cast });
    B.add('metal', g.rbox(0.6, 0.03, 0.46, 0.012, 1), { p: [0, 0.465, 0], c: RG, post: W, cast });
    B.add('metal', g.rbox(0.62, 0.09, 0.44, 0.03, 1), { p: [0, 0.045, 0.02], c: shade(RG, -0.05), post: W, cast });
    for (const sx of [-1, 1]) {
      B.add('metal', g.cyl(14), { p: [sx * 0.13, 0.3, 0.23], r: [PI / 2, 0, 0], s: [0.045, 0.06, 0.045], c: RG, post: W, cast });
      B.add('metal', g.cyl(12), { p: [sx * 0.13, 0.25, 0.25], s: [0.04, 0.03, 0.04], c: shade(RG, -0.08), post: W, cast });
      B.add('clay', g.rbox(0.03, 0.03, 0.14, 0.012, 1), { p: [sx * 0.13 + sx * 0.02, 0.25, 0.33], r: [0, sx * 0.3, 0], c: '#6E5646', post: W, cast });
      B.add('satin', g.lathe('espCup', [[0, 0], [0.024, 0], [0.03, 0.04], [0.026, 0.045], [0, 0.01]], 8), { p: [sx * 0.13, 0.095, 0.24], c: '#FBF6EE', post: W, cast });
    }
    B.add('satin', g.cyl(18), { p: [0, 0.35, 0.212], r: [PI / 2, 0, 0], s: [0.05, 0.012, 0.05], c: '#FFFBF4', post: W, cast });
    B.add('metal', g.tor(0.12, 4, 18), { p: [0, 0.35, 0.218], s: 0.05, c: RG, post: W, cast });
    B.add('metal', g.tube([[0.26, 0.33, 0.12], [0.31, 0.3, 0.16], [0.32, 0.14, 0.18]], 0.008, 10, 5), { c: RG, post: W, cast });
    for (let i = 0; i < 4; i++) B.add('satin', g.lathe('espCup', [[0, 0], [0.024, 0], [0.03, 0.04], [0.026, 0.045], [0, 0.01]], 8), { p: [-0.18 + i * 0.12, 0.48, -0.04 + (i % 2) * 0.06], c: i % 2 ? '#EFC5B9' : '#FBF6EE', post: W, cast });
  };

  K.grinder = (B, W, o = {}) => {
    const cast = o.cast !== false;
    B.add('satin', g.rbox(0.16, 0.24, 0.18, 0.04, 2), { p: [0, 0.12, 0], c: '#EFC5B9', post: W, cast });
    B.add('glassWarm', g.lathe('hopper', [[0.03, 0], [0.08, 0.1], [0.085, 0.16], [0, 0.16]], 14), { p: [0, 0.24, 0], post: W, cast: false });
    B.add('clay', g.lumpy(11, 0.15, 9, 12, 8), { p: [0, 0.3, 0], s: [0.07, 0.04, 0.07], c: '#6E5040', post: W, cast: false });
    B.add('metal', g.cyl(12), { p: [0, 0.405, 0], s: [0.086, 0.012, 0.086], c: RG, post: W, cast });
  };

  // a slanted rolling library ladder; local: hooks at (0, top, 0), feet at z = +run
  K.ladder = (B, W, o = {}) => {
    const top = o.top || 2.9, run = o.run || 0.85, cast = o.cast !== false, w = 0.46, col = '#D6BE9E';
    const len = Math.hypot(top, run), ang = Math.atan2(run, top);
    for (const sx of [-1, 1]) {
      B.add('woodVC', g.rbox(0.045, len, 0.06, 0.016, 1), { p: [sx * w / 2, top / 2, run / 2], r: [ang, 0, 0], c: '#FFFFFF', uv: [0.3, 4], uvSwap: true, post: W, cast });
      B.add('metal', g.tor(0.25, 5, 10, PI * 1.2), { p: [sx * w / 2, top + 0.02, -0.02], r: [0, PI / 2, 0], s: 0.035, c: RG, post: W, cast });
      B.add('metal', g.cyl(12), { p: [sx * w / 2, 0.035, run + 0.01], r: [0, 0, PI / 2], s: [0.035, 0.03, 0.035], c: RG, post: W, cast });
    }
    const n = Math.round(top / 0.3);
    for (let i = 1; i < n; i++) {
      const t = i / n, y = top * (1 - t), z = run * t;
      B.add('woodVC', g.rbox(w, 0.035, 0.09, 0.012, 1), { p: [0, y, z], c: '#F7EEE2', uv: [2, 0.2], post: W, cast });
    }
    void col;
  };


  // ===================================================================================== v2 furniture
  // reeded (fluted) column: n rounded reeds round a cylinder of radius r, height 1 (scaled by the caller), open ends
  K.fluted = (n = 24, depth = 0.06) => G2(`flute${n}/${depth}`, () => {
    const seg = n * 6, geo = new THREE.CylinderGeometry(1, 1, 1, seg, 1, true);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i), a = Math.atan2(x, z);
      const b = Math.abs(Math.sin(a * n / 2));
      const r = 1 - depth + depth * Math.sqrt(b);
      pos.setX(i, Math.sin(a) * r); pos.setZ(i, Math.cos(a) * r);
    }
    geo.computeVertexNormals();
    // close the seam normals (first and last column share positions)
    return tagG(geo, 'cyl');
  });
  const gcache2 = new Map();
  function G2(k, fn) { let v = gcache2.get(k); if (!v) { v = fn(); gcache2.set(k, v); } return v; }
  function tagG(geo, kind, meta = {}) { geo.userData.kind = kind; Object.assign(geo.userData, meta); return geo; }
  // rounded-edge disc (a slab), radius 1, height h (absolute), origin at the bottom
  K.slab = (h = 0.06, e = 0.014) => G2(`slab${h}/${e}`, () => {
    const pts = [[0, 0], [1 - e * 1.6, 0], [1 - e * 0.4, e * 0.35], [1, e * 1.2], [1, h - e * 1.2], [1 - e * 0.4, h - e * 0.35], [1 - e * 1.6, h], [0, h]];
    return tagG(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 40), 'lathe', { len: 1, rMax: 1 });
  });

  // the round 3-tier stepped display with a fluted base (circled reference). Local origin = floor centre, front +Z.
  K.roundDisplay = (B, W, o = {}) => {
    const tiers = o.tiers || [[0.78, 0.8], [1.06, 0.56], [1.32, 0.32]];
    const wood = o.wood || '#D29F6B', top = o.top || '#E9C79B', flute = o.flute || '#E6C9A2', sh = 0.06, rb = o.rb || 0.5;
    const slabAt = (y, r, col) => {
      // slab geometry is in absolute height, radius 1 — scale x/z only (keep the edge rounding thin)
      B.add('woodVC', K.slab(sh, 0.014 / r), { p: [0, y - sh, 0], s: [r, 1, r], c: col, top: K.shade(col, 0.08), ao: 0.18, uv: [r * 4, 0.3], post: W });
      B.add('metal', g.tor(0.009 / r, 4, 40), { p: [0, y - sh * 0.5, 0], r: [PI / 2, 0, 0], s: [r + 0.004, r + 0.004, r + 0.004], c: RG, post: W });
    };
    // base: plinth, fluted drum, collar
    B.add('woodVC', g.lathe('dispPlinth' + rb, [[0, 0], [rb + 0.06, 0], [rb + 0.07, 0.012], [rb + 0.065, 0.06], [rb + 0.03, 0.075], [0, 0.075]], 40), { c: K.shade(wood, -0.12), ao: 0.2, uv: [6, 0.3], post: W });
    B.add('woodVC', K.fluted(26, 0.07), { p: [0, 0.075 + 0.32, 0], s: [rb, 0.64, rb], c: flute, ao: 0.36, aoPow: 1.2, uv: [9, 1], post: W });
    B.add('woodVC', g.lathe('dispCollar' + rb, [[rb - 0.02, 0], [rb + 0.04, 0.004], [rb + 0.05, 0.02], [rb + 0.02, 0.03], [0, 0.03]], 40), { p: [0, tiers[0][0] - sh - 0.03, 0], c: wood, post: W, uv: [6, 0.2] });
    slabAt(tiers[0][0], tiers[0][1], wood);
    // risers (fluted too) and the upper slabs
    const r1 = Math.min(0.42, tiers[1][1] - 0.13), r2 = Math.min(0.23, tiers[2][1] - 0.08);
    B.add('woodVC', K.fluted(22, 0.08), { p: [0, (tiers[0][0] + tiers[1][0] - sh) / 2, 0], s: [r1, tiers[1][0] - sh - tiers[0][0], r1], c: flute, ao: 0.3, uv: [8, 0.5], post: W });
    slabAt(tiers[1][0], tiers[1][1], K.shade(wood, 0.03));
    B.add('woodVC', K.fluted(16, 0.09), { p: [0, (tiers[1][0] + tiers[2][0] - sh) / 2, 0], s: [r2, tiers[2][0] - sh - tiers[1][0], r2], c: flute, ao: 0.3, uv: [5, 0.5], post: W });
    slabAt(tiers[2][0], tiers[2][1], K.shade(wood, 0.06));
    void top;
  };

  // half-round café counter with cubbies (circled reference). Local: flat back on z = 0 (against a wall), round front +Z.
  K.cafeCounter = (B, W, o = {}) => {
    const R = o.R || 1.0, H = o.H || 1.0, rc = o.rc || 0.64, wood = o.wood || '#D8AE80', back = o.back || '#EFC9BC', topc = o.topc || '#F7F0E6';
    const half = (r, h, y, col, key = 'woodVC', uvx = 4) => {
      const geo = G2(`half${r}/${h}`, () => tagG(new THREE.CylinderGeometry(r, r, h, 28, 1, false, -PI / 2, PI), 'cyl'));
      B.add(key, geo, { p: [0, y + h / 2, 0], c: col, ao: 0.12, uv: [uvx, 0.3], post: W });
    };
    half(R - 0.05, 0.08, 0, K.shade(wood, -0.18));                 // toe kick
    half(rc, H - 0.1, 0.08, back, 'clay');                          // the blush core = the cubbies' back
    for (const y of [0.08, 0.5]) half(R, 0.03, y, wood);            // cubby floors
    half(R + 0.05, 0.05, H - 0.05, topc, 'satin');                  // cream top (marble-ish satin)
    B.add('woodVC', G2('cTopEdge' + R, () => tagG(new THREE.CylinderGeometry(R + 0.052, R + 0.052, 0.03, 28, 1, true, -PI / 2, PI), 'cyl')), { p: [0, H - 0.065, 0], c: wood, uv: [6, 0.2], post: W });
    half(R + 0.01, 0.04, H - 0.11, wood);                           // under-top rail
    const nDiv = o.div || 7;
    for (let i = 0; i < nDiv; i++) {
      const a = -PI / 2 + PI * i / (nDiv - 1), rm = (R + rc) / 2 + 0.01;
      B.add('woodVC', g.rbox(0.032, H - 0.19, R - rc + 0.02, 0.01, 1), { p: [Math.sin(a) * rm, 0.08 + (H - 0.19) / 2, Math.cos(a) * rm], r: [0, a, 0], c: K.shade(wood, 0.04), ao: 0.15, uv: [0.3, 1.2], uvSwap: true, post: W });
    }
    // scalloped blush felt valance hanging under the top edge
    const ns = o.scallops || 22;
    for (let i = 0; i < ns; i++) {
      const a = -PI / 2 + PI * (i + 0.5) / ns, rr = R + 0.056;
      B.add('felt', G2('scal', () => tagG(new THREE.CircleGeometry(1, 12, PI, PI), 'flat')), { p: [Math.sin(a) * rr, H - 0.05, Math.cos(a) * rr], r: [0, a, 0], s: [PI * rr / ns * 1.02, 0.07, 1], c: i % 2 ? '#F0CFC3' : '#EBC0B2', post: W });
    }
    // returns: cubby centres (local) for the caller to fill
    const cubbies = [];
    for (let row = 0; row < 2; row++) for (let i = 0; i < nDiv - 1; i++) {
      const a = -PI / 2 + PI * (i + 0.5) / (nDiv - 1), rm = (R + rc) / 2 + 0.02;
      cubbies.push({ a, x: Math.sin(a) * rm, y: row ? 0.53 : 0.11, z: Math.cos(a) * rm, h: row ? H - 0.11 - 0.53 : 0.5 - 0.11, w: 2 * rm * Math.sin(PI / (nDiv - 1) / 2) - 0.04 });
    }
    return cubbies;
  };

  // white distressed vintage shelf (retro reference): slatted back, scalloped crest, lipped shelves, little feet.
  // Local origin floor-centre, back against z = 0, front +Z.
  K.vintageShelf = (B, W, o = {}) => {
    const w = o.w || 0.9, h = o.h || 1.5, d = o.d || 0.32, ys = o.shelves || [0.12, 0.6, 1.08], col = o.hex || '#F6F0E6';
    const wear = '#D9C6AE', cast = false;
    for (const sx of [-1, 1]) {
      B.add('clay', g.rbox(0.035, h, d, 0.01, 1), { p: [sx * (w / 2 - 0.018), h / 2, d / 2], c: col, ao: 0.12, post: W, cast });
      B.add('clay', g.box(), { p: [sx * (w / 2 - 0.018), h * 0.35, d - 0.002], s: [0.03, 0.16, 0.004], c: wear, post: W, cast });   // worn edge
    }
    // slatted back
    const ns = Math.max(3, Math.round(w / 0.16));
    for (let i = 0; i < ns; i++) B.add('clay', g.rbox((w - 0.06) / ns - 0.008, h - 0.06, 0.018, 0.004, 1), { p: [-(w - 0.06) / 2 + (i + 0.5) * (w - 0.06) / ns, h / 2, 0.012], c: i % 2 ? col : K.shade(col, -0.03), ao: 0.18, post: W, cast });
    for (const y of ys) {
      B.add('clay', g.rbox(w - 0.05, 0.026, d - 0.02, 0.008, 1), { p: [0, y, d / 2], c: col, post: W, cast });
      B.add('clay', g.rbox(w - 0.05, 0.05, 0.016, 0.006, 1), { p: [0, y + 0.03, d - 0.012], c: col, post: W, cast });           // little lip
      B.add('clay', g.box(), { p: [(w / 2 - 0.12) * (y > 0.5 ? 1 : -1), y + 0.03, d - 0.003], s: [0.12, 0.012, 0.004], c: wear, post: W, cast });
    }
    // scalloped crest: a flat cut-out board with a wavy top
    const sh = new THREE.Shape(), cw = w - 0.02, n = o.crest || 3;
    sh.moveTo(-cw / 2, 0);
    for (let i = 0; i < n; i++) { const x0 = -cw / 2 + i * cw / n, x1 = x0 + cw / n; sh.quadraticCurveTo(x0 + cw / n * 0.1, 0.1, (x0 + x1) / 2, i === (n - 1) / 2 ? 0.17 : 0.12); sh.quadraticCurveTo(x1 - cw / n * 0.1, 0.1, x1, 0.03); }
    sh.lineTo(cw / 2, 0); sh.lineTo(-cw / 2, 0);
    const cg = new THREE.ExtrudeGeometry(sh, { depth: 0.022, bevelEnabled: false, curveSegments: 6 });
    B.add('clay', tagG(cg, 'flat'), { p: [0, h - 0.01, 0.01], c: col, ao: 0, post: W, cast });
    for (const sx of [-1, 1]) B.add('clay', g.sph(8, 6), { p: [sx * (w / 2 - 0.018), h + 0.02, d / 2 + 0.06], s: [0.026, 0.03, 0.026], c: col, post: W, cast });
    for (const sx of [-1, 1]) for (const sz of [0.04, d - 0.04]) B.add('clay', g.cyl(8, 0.8, 1), { p: [sx * (w / 2 - 0.03), -0.02, sz], s: [0.022, 0.05, 0.022], c: col, post: W, cast });
  };

  // pink vintage suitcase, open, local origin floor-centre, hinge at the back, front +Z. Returns the inside floor point.
  K.suitcase = (B, W, o = {}) => {
    const w = o.w || 0.54, h = o.h || 0.17, d = o.d || 0.36, pink = o.hex || '#EBB0AA', lin = '#F6E8DF', tan = '#A8735A', cast = false;
    B.add('clay', g.rbox(w, h, d, 0.03, 2), { p: [0, h / 2, 0], c: pink, ao: 0.2, post: W, cast });
    B.add('ginghamVC', g.box(), { p: [0, h - 0.004, 0], s: [w - 0.04, 0.004, d - 0.04], c: '#FFFFFF', uv: [2.2, 1.5], post: W, cast });
    // lid open ~115°, hinge at the back top edge
    const L = new THREE.Matrix4().makeRotationX(-PI * 0.64).setPosition(0, h, -d / 2).premultiply(W);
    B.add('clay', g.rbox(w, 0.06, d, 0.03, 2), { p: [0, 0.03, d / 2], c: pink, ao: 0.1, post: L, cast });
    B.add('clay', g.box(), { p: [0, -0.003, d / 2], s: [w - 0.05, 0.004, d - 0.05], c: lin, post: L, cast });
    B.add('clay', g.box(), { p: [0, -0.007, d * 0.62], s: [w - 0.12, 0.004, d * 0.4], c: K.shade(pink, 0.12), post: L, cast });   // a lid pocket
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) B.add('clay', g.sph(8, 6), { p: [sx * (w / 2 - 0.012), h * 0.5, sz * (d / 2 - 0.012)], s: [0.028, h * 0.55, 0.028], c: tan, post: W, cast });
    B.add('clay', g.box(), { p: [0, h * 0.82, 0], s: [w + 0.006, 0.014, d + 0.006], c: K.shade(pink, -0.12), post: W, cast });
    for (const sx of [-1, 1]) B.add('metal', g.rbox(0.04, 0.03, 0.012, 0.005, 1), { p: [sx * w * 0.3, h * 0.78, d / 2 + 0.006], c: RG, post: W, cast });
    B.add('clay', g.tor(0.22, 6, 12, PI), { p: [0, h * 0.62, d / 2 + 0.025], r: [PI / 2, 0, 0], s: [0.06, 0.035, 0.035], c: '#F6EEE2', post: W, cast });
    return new THREE.Vector3(0, h - 0.005, 0.0).applyMatrix4(W);
  };

  // retro chandelier: canopy, stem, urn, curled arms with candle sleeves and little pleated blush shades.
  // Local origin = the arm ring centre; `drop` = distance up to the ceiling. Halo positions are pushed into `halos`.
  K.chandelier = (B, W, halos, o = {}) => {
    const n = o.arms || 6, R = o.R || 0.36, drop = o.drop || 1.0;
    B.add('metal', g.cyl(14), { p: [0, drop - 0.012, 0], s: [0.07, 0.024, 0.07], c: RG, post: W });
    B.add('metal', g.cyl(6), { p: [0, drop / 2 + 0.1, 0], s: [0.009, drop - 0.2, 0.009], c: RG, post: W });
    for (let i = 0; i < 4; i++) B.add('metal', g.tor(0.2, 4, 8), { p: [0, 0.2 + i * 0.05, 0], r: [0, i * PI / 2, 0], s: [0.016, 0.026, 0.016], c: RG, post: W });
    B.add('metal', g.lathe('chUrn', [[0, -0.16], [0.02, -0.15], [0.03, -0.1], [0.075, -0.04], [0.085, 0.0], [0.06, 0.04], [0.03, 0.08], [0.026, 0.12], [0, 0.12]], 14), { c: RG, post: W });
    B.add('satin', g.sph(10, 8), { p: [0, -0.19, 0], s: 0.026, c: '#F7EFE4', post: W });
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + 0.26, ca = Math.cos(a), sa = Math.sin(a);
      const P3 = (r, y) => [ca * r, y, sa * r];
      B.add('metal', g.tube([P3(0.07, 0.0), P3(0.17, -0.07), P3(0.3, -0.04), P3(R, 0.04), P3(R, 0.08)], 0.009, 12, 5), { c: RG, post: W });
      B.add('metal', g.lathe('chCup', [[0, 0], [0.026, 0.0], [0.04, 0.02], [0.034, 0.03], [0, 0.03]], 10), { p: P3(R, 0.08), c: RG, post: W });
      B.add('satin', g.cyl(8), { p: P3(R, 0.15), s: [0.016, 0.1, 0.016], c: '#FBF6EE', post: W });
      B.add('bulb', g.lumpy(5, 0.12, 3, 8, 6), { p: P3(R, 0.215), s: [0.014, 0.024, 0.014], c: '#FFF1D6', post: W });
      // pleated shade
      B.add('shadeDS', K.pleat(), { p: P3(R, 0.18), s: [0.075, 0.12, 0.075], c: o.shade || '#F4CFC2', post: W });
      halos.push({ p: new THREE.Vector3(...P3(R, 0.22)).applyMatrix4(W), size: 0.2, a: 0.42 });
      // a glass drop under each arm
      B.add('satin', g.sph(6, 5), { p: P3(0.24, -0.11), s: [0.012, 0.02, 0.012], c: '#FFFBF4', post: W });
    }
  };
  // pleated lamp shade, unit size (bottom radius 1, top radius 0.55, height 1), origin at the bottom centre
  K.pleat = () => G2('pleat', () => {
    const n = 14, seg = n * 2, pts = [];
    const geo = new THREE.CylinderGeometry(0.55, 1, 1, seg, 1, true);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i), a = Math.atan2(x, z), r = Math.hypot(x, z), k = (Math.round(a / TAU * seg) % 2 + 2) % 2 ? 0.93 : 1;
      pos.setX(i, x * k); pos.setZ(i, z * k); pos.setY(i, pos.getY(i) + 0.5);
      void r;
    }
    geo.computeVertexNormals();
    void pts;
    return tagG(geo, 'cyl');
  });

  // fairy string lights along a Catmull-Rom (world points); bulbs every `step` metres, halos on every other bulb
  K.fairyLights = (B, pts, halos, o = {}) => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => (p.isVector3 ? p.clone() : new THREE.Vector3(...p))), false, 'centripetal');
    const len = curve.getLength(), step = o.step || 0.14, nb = Math.max(2, Math.floor(len / step));
    // (v4: a slightly thicker, lighter cord — unpainted, the 3.2 mm dark cord broke into dashes and crawled when moving)
    B.raw('clay', paintGeo(new THREE.TubeGeometry(curve, Math.max(8, Math.round(len * 14)), o.r || 0.0044, 3, false), o.cord || '#9C876C'));
    const p = new THREE.Vector3();
    for (let i = 0; i <= nb; i++) {
      curve.getPointAt(i / nb, p);
      // v3: bulbs ≈ 2× (they outlive the Kuwahara footprint) and every bulb gets its halo
      // (fix v3: amber bulbs, not white; a halo only every o.haloEvery bulbs, so the swags read as bulbs, not tubes)
      // (v4: a 20-face bulb instead of the octahedron, which read as a little diamond once unpainted)
      B.add('bulb', K.bulbGeo(), { p: [p.x, p.y - 0.01, p.z], s: [0.019, 0.024, 0.019], c: i % 3 === 1 ? '#FFB774' : '#FFC98A' });
      if (i % (o.haloEvery || 1) === 0) halos.push({ p: new THREE.Vector3(p.x, p.y - 0.012, p.z), size: (o.halo || 0.085) * 1.2, a: o.haloA || 0.55 });
    }
    return curve;
  };
  function paintGeo(geo, hex) {
    const n = geo.attributes.position.count, col = new Float32Array(n * 3); _c.set(hex);
    for (let i = 0; i < n; i++) { col[i * 3] = _c.r; col[i * 3 + 1] = _c.g; col[i * 3 + 2] = _c.b; }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return geo;
  }
  K.paintGeo = paintGeo;

  // felt flower garland: a twine through world points with flat felt flowers facing `normal`
  K.garland = (B, pts, o = {}) => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => (p.isVector3 ? p.clone() : new THREE.Vector3(...p))), false, 'centripetal');
    const len = curve.getLength(), nf = Math.max(2, Math.round(len / (o.step || 0.2)));
    B.raw('clay', paintGeo(new THREE.TubeGeometry(curve, Math.max(8, Math.round(len * 10)), 0.003, 3, false), '#BFA588'));
    const nrm = (o.normal || new THREE.Vector3(0, 0, 1)).clone().normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), nrm);
    const cols = o.colors || ['#F3D88C', '#FBF6EE', '#EFC5B9', '#C9D5E3', '#F6E3A8', '#E9A9A0'];
    const p = new THREE.Vector3();
    for (let i = 0; i <= nf; i++) {
      curve.getPointAt(i / nf, p);
      const s = (o.size || 0.07) * (0.85 + 0.3 * ((i * 37) % 7) / 7);
      const Mf = new THREE.Matrix4().compose(p.clone().addScaledVector(nrm, 0.012).add(new THREE.Vector3(0, -s * 0.9, 0)), q, new THREE.Vector3(1, 1, 1));
      const col = cols[i % cols.length];
      const np = i % 2 ? 5 : 6;
      for (let k = 0; k < np; k++) {
        const a = k / np * TAU + i;
        B.add('felt', g.sph(6, 4), { p: [Math.cos(a) * s * 0.55, Math.sin(a) * s * 0.55, 0], r: [0, 0, a], s: [s * 0.5, s * 0.34, s * 0.08], c: col, post: Mf });
      }
      B.add('felt', g.sph(6, 4), { p: [0, 0, s * 0.06], s: [s * 0.26, s * 0.26, s * 0.1], c: i % 2 ? '#E8A87C' : '#F3D88C', post: Mf });
      // a short thread up to the twine
      B.add('clay', g.cyl(3), { p: [0, s * 0.62, 0], s: [0.0025, s * 0.5, 0.0025], c: '#BFA588', post: Mf });
    }
  };

  // basket with a white scalloped liner folded over the rim (reference); local origin floor-centre
  K.scallopBasket = (B, W, o = {}) => {
    const r = o.r || 0.17, h = o.h || 0.15, hex = o.hex || '#CDB089', liner = o.liner || '#FBF7F0', ns = o.scallops || 9, drop = o.drop || 0.055, pid = o.pid || 0;
    B.add('weave', g.lathe('sbask' + r + '/' + h, [[0, 0], [r * 0.85, 0], [r * 0.92, h * 0.08], [r, h * 0.95], [r * 0.94, h * 0.95], [r * 0.86, h * 0.12], [0, h * 0.1]], 16), { c: hex, ao: 0.3, post: W, pid });
    // liner: rim roll + scalloped skirt outside the wall
    B.add('felt', g.tor(0.1, 4, 24), { p: [0, h * 0.97, 0], r: [PI / 2, 0, 0], s: r * 1.0, c: liner, post: W, pid });
    const key = `scSkirt${r}/${h}/${ns}/${drop}`;
    const skirt = G2(key, () => {
      const seg = ns * 8, pos = [], idx = [], uv = [];
      for (let i = 0; i <= seg; i++) {
        const a = i / seg * TAU, t = (i % 8) / 8, s = 0.42 + 0.58 * Math.sin(PI * (i % 8 === 0 && i > 0 ? 1 : t));
        const ca = Math.sin(a), sa = Math.cos(a), rr = r * 1.035;
        pos.push(ca * rr, h * 0.99, sa * rr, ca * (rr + 0.004), h * 0.99 - drop * (i % 8 === 0 ? 0.42 : s), sa * (rr + 0.004));
        uv.push(i / seg, 1, i / seg, 0);
      }
      for (let i = 0; i < seg; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
      return tagG(geo, 'flat');
    });
    B.add('felt', skirt, { c: liner, post: W, pid });
    if (o.handles !== false) for (const sx of [-1, 1]) B.add('weave', g.tor(0.16, 4, 10, PI), { p: [sx * r * 0.98, h * 0.95, 0], r: [0, PI / 2, 0], s: [r * 0.24, r * 0.2, r * 0.24], c: K.shade(hex, -0.08), post: W, pid });
    return h * 0.62;
  };

  // rose-gold hook stand: round foot, pole, a top bar with two hooks (bag charms) and a lower bar (pouch + keychains).
  // Returns hook points (local) { top: [..], low: [..] }.
  K.hookStand = (B, W, o = {}) => {
    const H = o.H || 1.4, topW = o.topW || 0.64, lowY = o.lowY || 0.86, lowW = o.lowW || 0.5;
    B.add('metal', g.lathe('hsFoot', [[0, 0], [0.19, 0], [0.2, 0.012], [0.16, 0.03], [0.05, 0.05], [0.025, 0.07], [0, 0.07]], 20), { c: RG, ao: 0.15, post: W });
    B.add('metal', g.cyl(10), { p: [0, H / 2, 0], s: [0.014, H, 0.014], c: RG, post: W });
    B.add('metal', g.sph(10, 8), { p: [0, H + 0.02, 0], s: 0.03, c: RG, post: W });
    const bar = (y, w) => {
      B.add('metal', g.cyl(8), { p: [0, y, 0], r: [0, 0, PI / 2], s: [0.011, w, 0.011], c: RG, post: W });
      for (const sx of [-1, 1]) B.add('metal', g.sph(8, 6), { p: [sx * w / 2, y, 0], s: 0.02, c: RG, post: W });
    };
    bar(H - 0.08, topW); bar(lowY, lowW);
    const hook = (x, y) => B.add('metal', g.tor(0.22, 4, 10, PI * 1.3), { p: [x, y - 0.03, 0.012], r: [0, PI / 2, PI * 0.85], s: 0.022, c: RG, post: W });
    const top = [-topW * 0.3, topW * 0.3].map((x) => new THREE.Vector3(x, H - 0.11, 0.02));
    const low = [-0.18, -0.09, 0, 0.09, 0.18].map((x) => new THREE.Vector3(x * lowW / 0.5, lowY - 0.03, 0.02));
    top.forEach((p) => hook(p.x, H - 0.08)); low.forEach((p) => hook(p.x, lowY));
    // a little blush felt bow on the finial (sweet)
    for (const sx of [-1, 1]) B.add('felt', g.sph(8, 6), { p: [sx * 0.032, H + 0.055, 0.0], r: [0, 0, sx * 0.5], s: [0.032, 0.02, 0.012], c: '#EFC5B9', post: W });
    B.add('felt', g.sph(6, 5), { p: [0, H + 0.055, 0.006], s: 0.012, c: '#E9B2A5', post: W });
    return { top, low };
  };

  // arched built-in niches against a wall. Local: the wall at z = 0, the unit's front face at z = D, x along the wall.
  // arches: [{ cx, w, y0, ys, inside, shelves: [y..] }]  (ys = spring line; apex = ys + w/2)
  K.archWall = (B, W, o = {}) => {
    const { xa, xb, H, D } = o, face = o.face || '#F5ECE1', inside = o.inside || '#E9B9AA', wood = o.wood || '#D9B286';
    const archShape = (a, inset = 0) => {
      const s = new THREE.Shape(), hw = a.w / 2 - inset;
      s.moveTo(a.cx - hw, a.y0 + inset); s.lineTo(a.cx + hw, a.y0 + inset); s.lineTo(a.cx + hw, a.ys);
      s.absarc(a.cx, a.ys, hw, 0, PI, false); s.lineTo(a.cx - hw, a.y0 + inset);
      return s;
    };
    const front = new THREE.Shape();
    front.moveTo(xa, 0); front.lineTo(xb, 0); front.lineTo(xb, H); front.lineTo(xa, H); front.lineTo(xa, 0);
    for (const a of o.arches) { const hole = new THREE.Path(); const s = archShape(a); hole.setFromPoints(s.getPoints(16)); front.holes.push(hole); }
    const fg = densify(new THREE.ShapeGeometry(front, 16), 0.28); fg.translate(0, 0, D);
    B.add('clay', tagG(fg, 'flat'), { c: face, uv: [1, 1], post: W });
    for (const a of o.arches) {
      const col = a.inside || inside;
      const bg = densify(new THREE.ShapeGeometry(archShape(a), 16), 0.28); bg.translate(0, 0, 0.012);
      B.add('clay', tagG(bg, 'flat'), { c: K.shade(col, -0.04), post: W });
      // reveal: the extruded outline's side walls, turned to face into the niche
      const ex = new THREE.ExtrudeGeometry(archShape(a), { depth: D - 0.012, bevelEnabled: false, curveSegments: 16 });
      const side = sideOnly(ex); side.translate(0, 0, 0.012);
      B.add('clay', tagG(side, 'flat'), { c: col, post: W });
      // ivory bead round the arch
      const s2 = archShape(a, -0.018), ptsA = s2.getPoints(20).map((p) => new THREE.Vector3(p.x, p.y, D + 0.012));
      const open = ptsA.slice(1, ptsA.length - 1);
      B.raw('clay', paintGeo(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(open.map((p) => p.applyMatrix4(W)), false, 'catmullrom', 0.1), 60, 0.02, 5, false), '#FFF9F0'));
      for (const y of a.shelves || []) B.add('woodVC', g.rbox(a.w - 0.004, 0.032, D - 0.03, 0.008, 1), { p: [a.cx, y - 0.016, (D - 0.012) / 2 + 0.012], c: wood, ao: 0.1, uv: [a.w / 0.6, 0.2], post: W });
    }
    // cornice and end caps
    B.add('clay', g.rbox(xb - xa + 0.08, 0.08, D + 0.06, 0.02, 1), { p: [(xa + xb) / 2, H + 0.04, (D + 0.06) / 2], c: '#FBF5EC', post: W });
    B.add('clay', g.rbox(xb - xa + 0.14, 0.04, D + 0.1, 0.015, 1), { p: [(xa + xb) / 2, H + 0.1, (D + 0.1) / 2], c: '#FFF9F2', post: W });
    for (const x of [xa, xb]) B.add('clay', g.box(), { p: [x + (x === xa ? 0.01 : -0.01), H / 2, D / 2], s: [0.02, H, D], c: K.shade(face, -0.03), post: W });
    B.add('clay', g.box(), { p: [(xa + xb) / 2, 0.04, D + 0.01], s: [xb - xa, 0.08, 0.02], c: K.shade(face, -0.12), post: W });   // toe kick
    return { archShape };
  };
  // v4: even out a flat triangulation (ShapeGeometry with holes = long slivers from the corners to the arch holes) so
  // the baked light field, applied per vertex, interpolates smoothly: unpainted, the slivers showed as dark arcs on the
  // built-in. Red-green refinement: every edge longer than maxEdge is split at its midpoint (the same split from both
  // sides, so no T-junctions); repeated until none is. Keeps position / normal / uv; returns an indexed geometry.
  function densify(geo, maxEdge = 0.3) {
    const src = geo.index ? geo.toNonIndexed() : geo;
    const names = ['position', 'normal', 'uv'].filter((n) => src.attributes[n]);
    const read = (i) => names.map((n) => { const a = src.attributes[n]; return Array.from({ length: a.itemSize }, (_, k) => a.array[i * a.itemSize + k]); });
    let tris = [];
    for (let i = 0; i < src.attributes.position.count; i += 3) tris.push([read(i), read(i + 1), read(i + 2)]);
    const mid = (u, v) => u.map((arr, k) => arr.map((x, j) => (x + v[k][j]) / 2));
    const long = (u, v) => Math.hypot(u[0][0] - v[0][0], u[0][1] - v[0][1], u[0][2] - v[0][2]) > maxEdge;
    for (let pass = 0; pass < 10; pass++) {
      const out = []; let changed = false;
      for (const t of tris) {
        const L = [long(t[0], t[1]), long(t[1], t[2]), long(t[2], t[0])], n = L[0] + L[1] + L[2];
        if (!n) { out.push(t); continue; }
        changed = true;
        if (n === 3) {
          const [a, b, c] = t, ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
          out.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]);
        } else if (n === 1) {
          const r = L.indexOf(true), a = t[r], b = t[(r + 1) % 3], c = t[(r + 2) % 3], m = mid(a, b);
          out.push([a, m, c], [m, b, c]);
        } else {
          const r = (L.indexOf(false) + 1) % 3, a = t[r], b = t[(r + 1) % 3], c = t[(r + 2) % 3];   // short edge = c→a
          const ab = mid(a, b), bc = mid(b, c);
          out.push([a, ab, bc], [ab, b, bc], [a, bc, c]);
        }
      }
      tris = out; if (!changed) break;
    }
    const g = new THREE.BufferGeometry(), n = tris.length * 3;
    names.forEach((nm, k) => {
      const size = src.attributes[nm].itemSize, arr = new Float32Array(n * size);
      tris.forEach((t, ti) => t.forEach((v, vi) => arr.set(v[k], (ti * 3 + vi) * size)));
      g.setAttribute(nm, new THREE.BufferAttribute(arr, size));
    });
    g.setIndex(Array.from({ length: n }, (_, i) => i));
    g.userData = { ...geo.userData };
    return g;
  }
  // keep only the side walls of an ExtrudeGeometry (group 1), with the winding/normals flipped to face inward
  function sideOnly(ex) {
    const gr = ex.groups.find((q) => q.materialIndex === 1) || ex.groups[1];
    const src = ex.index ? ex.toNonIndexed() : ex;
    const pos = src.attributes.position, nor = src.attributes.normal;
    const start = gr.start, count = gr.count, P3 = new Float32Array(count * 3), N3 = new Float32Array(count * 3);
    for (let t = 0; t < count; t += 3) for (let k = 0; k < 3; k++) {
      const i = start + t + (k === 0 ? 0 : k === 1 ? 2 : 1), o3 = (t + k) * 3;
      P3[o3] = pos.getX(i); P3[o3 + 1] = pos.getY(i); P3[o3 + 2] = pos.getZ(i);
      N3[o3] = -nor.getX(i); N3[o3 + 1] = -nor.getY(i); N3[o3 + 2] = -nor.getZ(i);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(P3, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(N3, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * 2), 2));
    return geo;
  }

  // light decor crochet friends (≈ 0.8k triangles; the library's product looks are 3–12k): cat, bunny, bear, duck, sheep.
  // Origin floor-centre, faces +Z, `size` ≈ height. For shelves/baskets around the room (never the display's products).
  K.miniAnimal = (B, W, kind = 'cat', o = {}) => {
    const s = o.size || 0.15, body = o.body || ({ cat: '#F3E7D6', bunny: '#F6EEE6', bear: '#C8A07C', duck: '#F6E3A8', sheep: '#FBF6EE' })[kind] || '#F3E7D6';
    const belly = o.belly || K.shade(body, 0.14), ears = o.ears || '#EFB7AA', pid = o.pid || 0;
    const loaf = o.pose === 'loaf';
    const add = (key, geo, p, sc, c, extra = {}) => B.add(key, geo, Object.assign({ p: p.map((v) => v * s), s: sc.map((v) => v * s), c, post: W, pid }, extra));
    const bodyKey = kind === 'sheep' ? 'boucle' : 'knit';
    const headY = loaf ? 0.52 : 0.7, headZ = loaf ? 0.2 : 0.03;
    // body + head
    if (kind === 'sheep') add('boucle', g.lumpy(9, 0.08, 9, 12, 9), [0, 0.36, 0], [0.38, 0.3, 0.33], body);
    else add(bodyKey, g.sph(11, 8), loaf ? [0, 0.22, -0.04] : [0, 0.3, 0], loaf ? [0.33, 0.22, 0.42] : [0.3, 0.31, 0.27], body, { ao: 0.25 });
    const headC = kind === 'sheep' ? '#E9DCCB' : body;
    add('knit', g.sph(11, 8), [0, headY, headZ], kind === 'duck' ? [0.27, 0.25, 0.26] : [0.33, 0.28, 0.29], headC, { ao: 0.12 });
    if (kind !== 'sheep' && kind !== 'duck' && !loaf) add('knit', g.sph(10, 7), [0, 0.27, 0.15], [0.2, 0.2, 0.12], belly);
    // ears
    if (kind === 'cat') for (const sx of [-1, 1]) add('knit', g.cyl(6, 0, 1), [sx * 0.19, headY + 0.27, headZ - 0.02], [0.1, 0.18, 0.06], body, { r: [0, 0, -sx * 0.38] }), add('felt', g.cyl(5, 0, 1), [sx * 0.185, headY + 0.25, headZ + 0.022], [0.06, 0.11, 0.02], ears, { r: [0, 0, -sx * 0.38] });
    if (kind === 'bunny') for (const sx of [-1, 1]) add('knit', g.sph(8, 6), [sx * 0.11, headY + 0.4, headZ - 0.02], [0.075, 0.24, 0.05], body, { r: [0, 0, -sx * 0.18] }), add('felt', g.sph(6, 5), [sx * 0.11, headY + 0.4, headZ + 0.02], [0.04, 0.17, 0.02], ears, { r: [0, 0, -sx * 0.18] });
    if (kind === 'bear') for (const sx of [-1, 1]) add('knit', g.sph(8, 6), [sx * 0.24, headY + 0.22, headZ - 0.02], [0.09, 0.09, 0.05], body);
    if (kind === 'sheep') for (const sx of [-1, 1]) add('knit', g.sph(6, 5), [sx * 0.3, headY + 0.08, headZ], [0.12, 0.05, 0.05], '#E2D3C0', { r: [0, 0, sx * 0.4] });
    if (kind === 'sheep') add('boucle', g.lumpy(11, 0.1, 9, 10, 7), [0, headY + 0.22, headZ - 0.04], [0.24, 0.1, 0.2], body);
    // face
    const fz = headZ + (kind === 'duck' ? 0.24 : 0.27);
    for (const sx of [-1, 1]) add('button', g.sph(6, 4), [sx * 0.12, headY + 0.02, fz - 0.02], [0.035, 0.035, 0.02], '#2A221D');
    if (kind === 'duck') add('felt', g.sph(8, 6), [0, headY - 0.06, fz + 0.04], [0.13, 0.05, 0.1], '#E8A87C');
    else if (kind === 'bear') add('knit', g.sph(8, 6), [0, headY - 0.07, fz - 0.02], [0.13, 0.09, 0.07], K.shade(body, 0.3)), add('felt', g.sph(6, 4), [0, headY - 0.04, fz + 0.04], [0.04, 0.03, 0.02], '#4A3A32');
    else add('felt', g.sph(6, 4), [0, headY - 0.05, fz], [0.035, 0.025, 0.02], '#D9958C');
    // feet / wings / tail
    if (kind === 'duck') for (const sx of [-1, 1]) add('knit', g.sph(8, 6), [sx * 0.29, 0.32, -0.02], [0.07, 0.17, 0.2], K.shade(body, -0.05), { r: [0.3, 0, sx * 0.2] });
    if (!loaf) for (const sx of [-1, 1]) add(kind === 'sheep' ? 'knit' : bodyKey, g.sph(8, 6), [sx * 0.12, 0.05, 0.17], [0.09, 0.06, 0.1], kind === 'sheep' ? '#E2D3C0' : kind === 'duck' ? '#E8A87C' : body);
    if (kind === 'cat') B.add('knit', g.tube([[0.12 * s, 0.06 * s, -0.22 * s], [0.3 * s, 0.05 * s, -0.08 * s], [0.28 * s, 0.05 * s, 0.14 * s]], 0.045 * s, 8, 5), { c: body, post: W, pid });
    if (kind === 'bunny') add('boucle', g.lumpy(5, 0.1, 7, 8, 6), [0, 0.18, -0.27], [0.09, 0.09, 0.09], '#FFFFFF');
    if (o.bow) for (const sx of [-1, 1]) add('felt', g.sph(6, 4), [sx * 0.06, headY - 0.28, fz - 0.08], [0.07, 0.045, 0.02], o.bow, { r: [0, 0, sx * 0.5] });
  };
  K.octa = () => G2('octa', () => tagG(new THREE.OctahedronGeometry(1, 0), 'sphere'));
  K.bulbGeo = () => G2('bulbIco', () => tagG(new THREE.IcosahedronGeometry(1, 0), 'sphere'));

  // the jute scalloped rug geometry (flat on y = 0, centre origin), uv maps 2R onto the texture
  K.juteRug = () => G2('juteRug', () => {
    const { R, Rb, n, rs } = JUTE, pts = [];
    const m = n * 14;
    for (let i = 0; i < m; i++) {
      const th = i / m * TAU;
      let best = Rb * 0.98;
      for (let k = 0; k < n; k++) {
        let dlt = th - k / n * TAU; dlt = Math.atan2(Math.sin(dlt), Math.cos(dlt));
        const q = rs * rs - (Rb * Math.sin(dlt)) ** 2;
        if (q > 0 && Math.abs(dlt) < PI / 2) best = Math.max(best, Rb * Math.cos(dlt) + Math.sqrt(q));
      }
      pts.push(new THREE.Vector2(Math.cos(th) * best, Math.sin(th) * best));
    }
    const geo = new THREE.ShapeGeometry(new THREE.Shape(pts));
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / (2 * R) + 0.5, pos.getY(i) / (2 * R) + 0.5);
    geo.rotateX(-PI / 2);
    // ShapeGeometry y → after rotateX(-90°) becomes −z; texture v increases toward −z, fine (round)
    return tagG(geo, 'flat');
  });

  return K;
}
