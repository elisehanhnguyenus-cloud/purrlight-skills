/* Haven 3D v2 — exterior helpers (PREVIEW 06/11, Purrlight Studio). Owned by the exterior agent.
   - Batch: merges static meshes per material (props built by P.* and our own Kit parts) so the whole outside
     costs a few draw calls; P.softShadow decals become one vertex-alpha decal mesh. A material remap turns the shared
     shiny rose-gold / satin into soft matte versions (the watercolour pass wants matte paint, not reflections).
   - Scatter: one InstancedMesh for every leaf / blossom outside (vines, hedges, window boxes, trees, garland).
   - skinCharacters: the animated people, dog and Maine Coon are merged per material into SkinnedMeshes whose
     "bones" are the original prop nodes, so P.person/P.dog/P.maineCoon update(t) still drives them.
   - hand-painted canvas textures (limewash render, flaked-plaster brick patches, chalk pictograms, picture-book covers
     without words, gingham, flagstones, fascia pictograms) — big soft shapes that survive a painterly filter.
   - geometry helpers: world-space UVs, lumpy spheres, leaf/blossom shapes, planar polygons (roof planes with dormer
     notches), scalloped boards. */

import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';

export function makeExtKit(THREE, P, T) {
  const PI = Math.PI, TAU = PI * 2;
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
  const _c = new THREE.Color();

  function rng(seed) {
    let a = seed >>> 0;
    return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const mat4 = (p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1]) => {
    const sc = typeof s === 'number' ? [s, s, s] : s;
    return new THREE.Matrix4().compose(new THREE.Vector3(p[0], p[1], p[2]), new THREE.Quaternion().setFromEuler(new THREE.Euler(r[0], r[1], r[2])), new THREE.Vector3(sc[0], sc[1], sc[2]));
  };

  /* ---------------------------------------------------------------- attribute hygiene for merging */
  const KEEP = new Set(['position', 'normal', 'uv', 'color']);
  function prep(g, material) {
    for (const k of Object.keys(g.attributes)) if (!KEEP.has(k)) g.deleteAttribute(k);
    const n = g.attributes.position.count;
    if (!g.attributes.normal) g.computeVertexNormals();
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n * 2), 2));
    const vc = !!(material && material.vertexColors);
    if (vc) {
      const c = g.attributes.color;
      if (!c) { const a = new Float32Array(n * 3).fill(1); g.setAttribute('color', new THREE.Float32BufferAttribute(a, 3)); }
      else if (c.itemSize !== 3 || !(c.array instanceof Float32Array)) {
        const a = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) { a[i * 3] = c.getX(i); a[i * 3 + 1] = c.getY(i); a[i * 3 + 2] = c.getZ(i); }
        g.setAttribute('color', new THREE.Float32BufferAttribute(a, 3));
      }
    } else if (g.attributes.color) g.deleteAttribute('color');
    for (const k of ['position', 'normal', 'uv']) {
      const a = g.attributes[k];
      if (!(a.array instanceof Float32Array) || a.normalized || a.isInterleavedBufferAttribute) {
        const arr = new Float32Array(a.count * a.itemSize);
        for (let i = 0; i < a.count; i++) for (let j = 0; j < a.itemSize; j++) arr[i * a.itemSize + j] = a.getComponent ? a.getComponent(i, j) : a.array[i * a.itemSize + j];
        g.setAttribute(k, new THREE.Float32BufferAttribute(arr, a.itemSize));
      }
    }
    if (!g.index) { const idx = new (n > 65535 ? Uint32Array : Uint16Array)(n); for (let i = 0; i < n; i++) idx[i] = i; g.setIndex(new THREE.BufferAttribute(idx, 1)); }
    g.morphAttributes = {}; g.clearGroups();
    return g;
  }
  /* paint a flat colour (or a vertical gradient) into a geometry's colour attribute */
  function paintGeo(g, hex, opts = {}) {
    const pos = g.attributes.position, n = pos.count, col = new Float32Array(n * 3);
    const a = new THREE.Color(hex), b = opts.top ? new THREE.Color(opts.top) : null;
    let y0 = Infinity, y1 = -Infinity;
    if (opts.ao || b) for (let i = 0; i < n; i++) { const y = pos.getY(i); if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const span = (y1 - y0) || 1, ao = opts.ao || 0, rnd = opts.jitter ? rng(opts.seed || 7) : null;
    for (let i = 0; i < n; i++) {
      const h = (opts.ao || b) ? (pos.getY(i) - y0) / span : 1;
      _c.copy(a); if (b) _c.lerp(b, Math.pow(h, opts.topPow || 1.6));
      const f = (1 - ao * Math.pow(1 - h, opts.aoPow || 1.5)) * (rnd ? 1 + (rnd() - 0.5) * opts.jitter : 1);
      col[i * 3] = _c.r * f; col[i * 3 + 1] = _c.g * f; col[i * 3 + 2] = _c.b * f;
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    return g;
  }

  /* ---------------------------------------------------------------- shadow decals (one mesh, vertex alpha) */
  class Decals {
    constructor(texture, hex, name) {
      this.pos = []; this.uv = []; this.col = []; this.idx = []; this.n = 0;
      this.mat = new THREE.MeshBasicMaterial({ color: hex, map: texture, transparent: true, depthWrite: false, vertexColors: true, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      this.mat.name = name || 'decals';
    }
    quad(matrix, alpha, rgb = [1, 1, 1], uv = [0, 0, 1, 1]) {   // unit quad in XZ (like P.softShadow's plane), transformed
      const corners = [[-0.5, 0, 0.5, uv[0], uv[1]], [0.5, 0, 0.5, uv[2], uv[1]], [0.5, 0, -0.5, uv[2], uv[3]], [-0.5, 0, -0.5, uv[0], uv[3]]];
      for (const c of corners) {
        _v.set(c[0], c[1], c[2]).applyMatrix4(matrix);
        this.pos.push(_v.x, _v.y, _v.z); this.uv.push(c[3], c[4]); this.col.push(rgb[0], rgb[1], rgb[2], alpha);
      }
      const b = this.n; this.idx.push(b, b + 1, b + 2, b, b + 2, b + 3); this.n += 4;
    }
    at(x, y, z, w, d, alpha, rotY = 0) { this.quad(mat4([x, y, z], [0, rotY, 0], [w, 1, d]), alpha); }
    fromMesh(m) {   // a P.softShadow mesh (PlaneGeometry(1,1) rotated flat, scaled w×d)
      m.updateWorldMatrix(true, false);
      const op = m.material && m.material.opacity !== undefined ? m.material.opacity : 0.45;
      this.quad(m.matrixWorld, op);
    }
    build(name) {
      if (!this.n) return null;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
      g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 4));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(new Float32Array(this.n * 3).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
      g.setIndex(this.idx); g.computeBoundingSphere();
      const mesh = new THREE.Mesh(g, this.mat); mesh.name = name || this.mat.name; mesh.renderOrder = -1;
      mesh.castShadow = false; mesh.receiveShadow = false;
      return mesh;
    }
  }

  /* ---------------------------------------------------------------- per-material merge */
  const NO_SHADOW = /glow|bulb|glass|lantern|shadow|halo|water|signFace|decal|^knit$|^button$|^paperVC$|^paper$|^yarn$|^linenVC$|^weave$|^boucle$|^fern$|bookAtlas/i;
  class Batch {
    constructor(decals, remap) { this.buckets = new Map(); this.decals = decals; this.keep = []; this.defaultTag = ''; this.remap = remap || null; }
    push(material, g, o = {}) {
      if (this.remap && this.remap.has(material)) material = this.remap.get(material);
      if (o.tag === undefined && this.defaultTag) o = Object.assign({}, o, { tag: this.defaultTag });
      const key = material.uuid + (o.receive === false ? '|nr' : '') + (o.tag ? '|' + o.tag : '');
      let b = this.buckets.get(key);
      if (!b) {
        b = { material, geos: [], cast: false, receive: o.receive !== false, tag: o.tag || '', renderOrder: o.renderOrder || 0 };
        this.buckets.set(key, b);
      }
      if (o.cast !== false && !NO_SHADOW.test(material.name || '') && !material.transparent) b.cast = true;
      b.geos.push(prep(g, material));
    }
    /* add a geometry (cloned) with an optional matrix; material may be a P.mat name */
    geo(material, src, matrix, o) {
      const m = typeof material === 'string' ? P.mat(material) : material;
      const g = src.clone(); if (matrix) g.applyMatrix4(matrix);
      this.push(m, g, o);
      return g;
    }
    /* merge every static mesh under obj (world transforms baked); P.softShadow planes become decals */
    obj(obj, o = {}) {
      obj.updateMatrixWorld(true);
      obj.traverse((m) => {
        if (!m.isMesh || m.visible === false) return;
        if (m.name === 'softShadow') { if (this.decals && o.shadows !== false) this.decals.fromMesh(m); return; }
        if (m.isInstancedMesh || m.isSkinnedMesh || Array.isArray(m.material) || (m.material && m.material.onBeforeCompile && m.material.customProgramCacheKey && m.material.name === 'bookAtlas')) {
          this.keep.push(m); return;
        }
        const g = m.geometry.clone(); g.applyMatrix4(m.matrixWorld);
        let mat = m.material;
        // plain single-colour materials (no map, opaque, not emissive) → the shared vertex-colour clay / metal (fewer draw calls)
        if (mat.isMeshStandardMaterial && !mat.vertexColors && !mat.map && !mat.transparent && !mat.alphaTest && mat.emissive && mat.emissive.getHex() === 0 && mat.side === THREE.FrontSide) {
          paintGeo(g, '#' + mat.color.getHexString());
          mat = P.mat(mat.metalness > 0.3 ? 'metal' : 'clay');
        }
        this.push(mat, g, { cast: o.cast === undefined ? m.castShadow : o.cast, receive: o.receive === undefined ? true : o.receive, tag: o.tag });
      });
    }
    build(parent, prefix = 'ext') {
      const out = [];
      for (const b of this.buckets.values()) {
        const g = b.geos.length === 1 ? b.geos[0] : mergeGeometries(b.geos, false);
        if (!g) { console.warn('[exterior] merge failed for', b.material.name); continue; }
        if (b.geos.length > 1) for (const x of b.geos) x.dispose();
        g.computeBoundingSphere(); g.computeBoundingBox();
        let mesh;
        if (b.tag && b.tag.endsWith('I')) {      // single-instance InstancedMesh (same pixels, one draw call)
          mesh = new THREE.InstancedMesh(g, b.material, 1); mesh.setMatrixAt(0, new THREE.Matrix4()); mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere();
        } else mesh = new THREE.Mesh(g, b.material);
        mesh.name = `${prefix}:${b.material.name || 'mat'}${b.tag ? ':' + b.tag : ''}`;
        mesh.castShadow = b.cast; mesh.receiveShadow = b.receive; mesh.renderOrder = b.renderOrder;
        parent.add(mesh); out.push(mesh);
      }
      for (const m of this.keep) {   // instanced / special meshes: reparent with their world transform
        const c = m; const w = m.matrixWorld.clone();
        if (c.parent) c.parent.remove(c);
        w.decompose(c.position, c.quaternion, c.scale);
        parent.add(c); out.push(c);
      }
      this.buckets.clear(); this.keep = [];
      return out;
    }
  }

  /* ---------------------------------------------------------------- instanced scatter (leaves, blossoms) */
  class Scatter {
    constructor(geo, material, name) { this.geo = geo; this.mat = material; this.name = name; this.m = []; this.c = []; }
    add(pos, quat, scale, hex) {
      const s = typeof scale === 'number' ? _s.set(scale, scale, scale) : _s.set(scale[0], scale[1], scale[2]);
      this.m.push(new THREE.Matrix4().compose(pos.clone ? pos.clone() : new THREE.Vector3(pos[0], pos[1], pos[2]), quat.clone(), s.clone()));
      this.c.push(new THREE.Color(hex));
    }
    get count() { return this.m.length; }
    build(o = {}) {
      if (!this.m.length) return null;
      const im = new THREE.InstancedMesh(this.geo, this.mat, this.m.length);
      for (let i = 0; i < this.m.length; i++) { im.setMatrixAt(i, this.m[i]); im.setColorAt(i, this.c[i]); }
      im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
      im.computeBoundingSphere(); im.computeBoundingBox();
      im.castShadow = o.cast !== false; im.receiveShadow = o.receive !== false; im.name = this.name;
      return im;
    }
  }

  /* ---------------------------------------------------------------- shapes */
  const cache = new Map();
  const memo = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };
  /* soft heart-shaped leaf: 8 triangles, cupped, tip at +Y, face +Z, base at the origin */
  function leafGeo() {
    return memo('leaf', () => {
      const ring = [[0, 0], [-0.3, 0.1], [-0.43, 0.36], [-0.33, 0.68], [0, 1], [0.33, 0.68], [0.43, 0.36], [0.3, 0.1]];
      const pos = [0, 0.42, 0.05];
      for (const [x, y] of ring) pos.push(x, y, Math.abs(x) * 0.22 + Math.sin(y * PI) * 0.04);
      const idx = []; for (let i = 0; i < ring.length; i++) idx.push(0, 1 + i, 1 + ((i + 1) % ring.length));
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((ring.length + 1) * 2), 2));
      g.setIndex(idx); g.computeVertexNormals();
      return g;
    });
  }
  /* five-petal blossom, flat in XY, facing +Z (10 triangles) */
  function blossomGeo() {
    return memo('blossom', () => {
      const pos = [0, 0, 0.12], idx = [];
      const N = 10;
      for (let i = 0; i < N; i++) { const a = i / N * TAU + PI / 2, r = i % 2 === 0 ? 1 : 0.78; pos.push(Math.cos(a) * r, Math.sin(a) * r, i % 2 === 0 ? -0.1 : -0.02); }
      for (let i = 0; i < N; i++) idx.push(0, 1 + i, 1 + ((i + 1) % N));
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((N + 1) * 2), 2));
      g.setIndex(idx); g.computeVertexNormals();
      return g;
    });
  }
  /* displaced sphere (clay blobs, foliage masses); seams stay closed (position-based waves) */
  function lumpy(seed = 1, amp = 0.08, freq = 3, ws = 16, hs = 12) {
    return memo(`lumpy${seed}/${amp}/${freq}/${ws}/${hs}`, () => {
      const g = new THREE.SphereGeometry(1, Math.min(20, ws), Math.min(20, hs));
      const rnd = rng(seed * 97 + 13), waves = [];
      for (let i = 0; i < 7; i++) { _v.set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(); waves.push([_v.x, _v.y, _v.z, rnd() * TAU, (0.6 + rnd() * 0.8) * freq]); }
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        let d = 0; for (const w of waves) d += Math.sin((x * w[0] + y * w[1] + z * w[2]) * w[4] + w[3]);
        const s = 1 + amp * d / 2.4; pos.setXYZ(i, x * s, y * s, z * s);
      }
      g.computeVertexNormals();
      // weld seam normals
      const map = new Map(), nor = g.attributes.normal;
      for (let i = 0; i < pos.count; i++) { const k = `${pos.getX(i).toFixed(4)},${pos.getY(i).toFixed(4)},${pos.getZ(i).toFixed(4)}`; (map.get(k) || map.set(k, []).get(k)).push(i); }
      for (const ids of map.values()) if (ids.length > 1) { let x = 0, y = 0, z = 0; for (const i of ids) { x += nor.getX(i); y += nor.getY(i); z += nor.getZ(i); } const l = Math.hypot(x, y, z) || 1; for (const i of ids) nor.setXYZ(i, x / l, y / l, z / l); }
      return g;
    });
  }
  /* bevelled box: 24 vertices / 44 triangles; flat faces, one smooth-shaded bevel on every edge and corner
     (reads like RoundedBoxGeometry at a fraction of the cost). Centred, UVs in metres (x+z, y). */
  function bevelBox(w, h, d, r) {
    const key = `bb${w.toFixed(4)}/${h.toFixed(4)}/${d.toFixed(4)}/${r.toFixed(4)}`;
    return memo(key, () => {
      const a = w / 2, b = h / 2, c = d / 2; r = Math.max(0.0005, Math.min(r, a * 0.98, b * 0.98, c * 0.98));
      const pos = [], nor = [], uv = [], idx = [];
      const vid = {};                       // corner (sx,sy,sz) + axis → vertex index
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) for (let ax = 0; ax < 3; ax++) {
        const p = [sx * (ax === 0 ? a : a - r), sy * (ax === 1 ? b : b - r), sz * (ax === 2 ? c : c - r)];
        const n = [ax === 0 ? sx : 0, ax === 1 ? sy : 0, ax === 2 ? sz : 0];
        vid[`${sx}${sy}${sz}${ax}`] = pos.length / 3;
        pos.push(...p); nor.push(...n); uv.push(p[0] + p[2] * 0.7, p[1] + p[2] * 0.3);
      }
      const V = (sx, sy, sz, ax) => vid[`${sx}${sy}${sz}${ax}`];
      const quad = (q, n) => {            // q: 4 vertex ids; orient by the outward normal n
        const P0 = q.map((i) => [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]]);
        const e1 = [P0[1][0] - P0[0][0], P0[1][1] - P0[0][1], P0[1][2] - P0[0][2]], e2 = [P0[2][0] - P0[0][0], P0[2][1] - P0[0][1], P0[2][2] - P0[0][2]];
        const cr = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
        const flip = cr[0] * n[0] + cr[1] * n[1] + cr[2] * n[2] < 0;
        if (q.length === 3) { if (flip) idx.push(q[0], q[2], q[1]); else idx.push(q[0], q[1], q[2]); return; }
        if (flip) idx.push(q[0], q[2], q[1], q[0], q[3], q[2]); else idx.push(q[0], q[1], q[2], q[0], q[2], q[3]);
      };
      const S = [-1, 1];
      // main faces (corner order around the face)
      for (const s of S) {
        quad([V(s, -1, -1, 0), V(s, 1, -1, 0), V(s, 1, 1, 0), V(s, -1, 1, 0)], [s, 0, 0]);
        quad([V(-1, s, -1, 1), V(1, s, -1, 1), V(1, s, 1, 1), V(-1, s, 1, 1)], [0, s, 0]);
        quad([V(-1, -1, s, 2), V(1, -1, s, 2), V(1, 1, s, 2), V(-1, 1, s, 2)], [0, 0, s]);
      }
      // edge bevels
      for (const s1 of S) for (const s2 of S) {
        quad([V(s1, s2, -1, 0), V(s1, s2, 1, 0), V(s1, s2, 1, 1), V(s1, s2, -1, 1)], [s1, s2, 0]);   // x–y edges along z
        quad([V(s1, -1, s2, 0), V(s1, 1, s2, 0), V(s1, 1, s2, 2), V(s1, -1, s2, 2)], [s1, 0, s2]);   // x–z edges along y
        quad([V(-1, s1, s2, 1), V(1, s1, s2, 1), V(1, s1, s2, 2), V(-1, s1, s2, 2)], [0, s1, s2]);   // y–z edges along x
      }
      for (const sx of S) for (const sy of S) for (const sz of S) quad([V(sx, sy, sz, 0), V(sx, sy, sz, 1), V(sx, sy, sz, 2)], [sx, sy, sz]);
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      return g;
    });
  }
  /* world-space planar UVs by dominant normal axis (for clapboard / stone / cobbles on baked geometry) */
  function worldUV(g, tileU, tileV = tileU, off = [0, 0]) {
    const pos = g.attributes.position, nor = g.attributes.normal, n = pos.count, uv = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), ax = Math.abs(nor.getX(i)), ay = Math.abs(nor.getY(i)), az = Math.abs(nor.getZ(i));
      let u, v;
      if (ay > ax && ay > az) { u = x; v = -z; } else if (ax > az) { u = -z * Math.sign(nor.getX(i) || 1); v = y; } else { u = x * Math.sign(nor.getZ(i) || 1); v = y; }
      uv[i * 2] = u / tileU + off[0]; uv[i * 2 + 1] = v / tileV + off[1];
    }
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    return g;
  }
  /* a curved strip through a profile: rows = profile points [(a, y)], cols = 2 ends; used for mansard faces */
  function profileFace(rows, mapPoint, uAt) {
    // rows: [{d, y, s}] (s = arc length), mapPoint(row, end:0|1) → [x,y,z], uAt(row,end) → u
    const pos = [], uv = [], idx = [];
    rows.forEach((r, i) => { for (let e = 0; e < 2; e++) { const p = mapPoint(r, e); pos.push(p[0], p[1], p[2]); uv.push(uAt(r, e), r.s); } });
    for (let i = 0; i < rows.length - 1; i++) { const a = i * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, b, d, a, d, c); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    return g;
  }

  /* ---------------------------------------------------------------- vines (stem → Batch, leaves/blossoms → Scatter) */
  const VINE_GREENS = ['#A9BCA0', '#7F9A7A', '#C5D3B8', '#93AC86', '#8EA685', '#B4C6A6'];
  const IVY_GREENS = ['#7F9A7A', '#8EA685', '#87A07F', '#6F8B6C', '#93AC86', '#768F72'];
  /* vertical alpha gradient (opaque at the bottom) for soft ambient-occlusion bands */
  function gradientTex() {
    return memo('grad', () => {
      const c = document.createElement('canvas'); c.width = 4; c.height = 128;
      const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 128);
      gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.18)'); gr.addColorStop(0.85, 'rgba(255,255,255,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,1)');
      g.fillStyle = gr; g.fillRect(0, 0, 4, 128);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
    });
  }
  function vine(batch, leaves, flowers, points, o = {}) {
    const opt = Object.assign({ normal: new THREE.Vector3(0, 0, 1), leaf: 0.075, density: 1, flowers: 0, flowerColors: ['#F3C9BD', '#FBF6EE', '#E9B3A8'], seed: 3, stem: '#8B7A62', spread: 1 }, o);
    const pts = points.map((p) => (p.isVector3 ? p.clone() : new THREE.Vector3(p[0], p[1], p[2])));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const L = curve.getLength();
    const tube = new THREE.TubeGeometry(curve, Math.max(6, Math.round(L * 7)), opt.leaf * 0.09, 4, false);
    paintGeo(tube, opt.stem);
    batch.push(P.mat('clay'), tube, { cast: true });
    const rnd = rng(opt.seed), nrm = opt.normal.clone().normalize();
    const n = Math.max(4, Math.round(L * 30 * opt.density));
    const tan = new THREE.Vector3(), side = new THREE.Vector3(), up = new THREE.Vector3(), basis = new THREE.Matrix4(), q = new THREE.Quaternion(), qx = new THREE.Quaternion(), p = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      const t = Math.min(1, (i + rnd() * 0.9) / n);
      curve.getPointAt(t, p); curve.getTangentAt(t, tan);
      side.crossVectors(tan, nrm).normalize();
      const off = (rnd() - 0.5) * opt.leaf * 2.2 * opt.spread;
      p.addScaledVector(side, off).addScaledVector(nrm, opt.leaf * (0.1 + 0.35 * rnd()));
      up.copy(tan).applyAxisAngle(nrm, (off > 0 ? -1 : 1) * (0.7 + rnd() * 1.1) + (rnd() < 0.5 ? PI : 0));
      side.crossVectors(up, nrm).normalize();
      const nn = new THREE.Vector3().crossVectors(side, up).normalize();
      basis.makeBasis(side, up, nn); q.setFromRotationMatrix(basis);
      q.multiply(qx.setFromAxisAngle(_v.set(1, 0, 0), -0.25 + rnd() * 0.65));
      const s = opt.leaf * (0.65 + rnd() * 0.6);
      leaves.add(p, q, s, (opt.greens || IVY_GREENS)[Math.floor(rnd() * (opt.greens || IVY_GREENS).length)]);
    }
    if (flowers && opt.flowers > 0) {
      const fn = Math.max(1, Math.round(n * opt.flowers));
      for (let i = 0; i < fn; i++) {
        curve.getPointAt(rnd(), p);
        p.addScaledVector(nrm, opt.leaf * 0.45).add(_v.set((rnd() - 0.5) * opt.leaf * 1.6, (rnd() - 0.5) * opt.leaf * 1.6, (rnd() - 0.5) * opt.leaf * 0.6));
        q.setFromUnitVectors(_v.set(0, 0, 1), nrm).multiply(qx.setFromAxisAngle(_v.set(0, 0, 1), rnd() * TAU));
        flowers.add(p, q, opt.leaf * (0.32 + rnd() * 0.16), opt.flowerColors[i % opt.flowerColors.length]);
      }
    }
    return curve;
  }
  /* leaves sprinkled over an ellipsoid (foliage masses, hedge tops) */
  function sprinkle(leaves, c, r, n, o = {}) {
    const rnd = rng(o.seed || 5), cols = o.colors || VINE_GREENS, size = o.size || 0.09, yMin = o.yMin === undefined ? -0.2 : o.yMin;
    const n0 = new THREE.Vector3(), up = new THREE.Vector3(), side = new THREE.Vector3(), basis = new THREE.Matrix4(), q = new THREE.Quaternion(), qx = new THREE.Quaternion(), p = new THREE.Vector3();
    const ga = PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i + 0.5) / n * (1 - yMin), rr = Math.sqrt(Math.max(0, 1 - y * y)), th = i * ga + rnd() * 0.5;
      n0.set(Math.cos(th) * rr, y, Math.sin(th) * rr).normalize();
      p.set(c[0] + n0.x * r[0], c[1] + n0.y * r[1], c[2] + n0.z * r[2]);
      up.set(rnd() - 0.5, 0.5 + rnd(), rnd() - 0.5).addScaledVector(n0, 1.2).normalize();
      side.crossVectors(up, n0).normalize(); if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
      const nn = new THREE.Vector3().crossVectors(side, up).normalize();
      basis.makeBasis(side, up, nn); q.setFromRotationMatrix(basis).multiply(qx.setFromAxisAngle(_v.set(1, 0, 0), -0.6 + rnd() * 0.5));
      const h = (n0.y + 1) / 2;
      const col = cols[Math.floor(rnd() * cols.length)];
      leaves.add(p, q, size * (0.75 + rnd() * 0.5), h > 0.65 ? T.shade(col, 0.07) : h < 0.35 ? T.shade(col, -0.12) : col);
    }
  }

  /* ---------------------------------------------------------------- animated characters → skinned, merged per material */
  function skinCharacters(roots, parent, decals, name = 'characters') {
    parent.updateMatrixWorld(true);
    const bones = [], byMat = new Map(), box = new THREE.Box3(), tmp = new THREE.Box3();
    box.makeEmpty();
    const drop = [];
    for (const root of roots) {
      root.updateMatrixWorld(true);
      root.traverse((o) => {
        if (!o.isMesh) return;
        if (o.name === 'softShadow') { if (decals) decals.fromMesh(o); drop.push(o); return; }
        tmp.setFromObject(o); box.union(tmp);
        const bi = bones.length; bones.push(o);
        let material = o.material;
        let g0 = o.geometry.clone();
        if (material.isMeshStandardMaterial && !material.vertexColors && !material.map && !material.transparent && material.emissive && material.emissive.getHex() === 0) {
          paintGeo(g0, '#' + material.color.getHexString()); material = P.mat(material.metalness > 0.3 ? 'metal' : 'clay');
        }
        const g = prep(g0, material);
        const n = g.attributes.position.count;
        const si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
        for (let i = 0; i < n; i++) { si[i * 4] = bi; sw[i * 4] = 1; }
        g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
        g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
        if (!byMat.has(material)) byMat.set(material, []);
        byMat.get(material).push(g);
      });
    }
    for (const o of drop) o.parent.remove(o);
    const skeleton = new THREE.Skeleton(bones, bones.map(() => new THREE.Matrix4()));
    const sphere = new THREE.Sphere(); box.expandByScalar(0.25); box.getBoundingSphere(sphere);
    const meshes = [];
    for (const [material, geos] of byMat) {
      const g = geos.length === 1 ? geos[0] : mergeGeometries(geos, false);
      if (!g) { console.warn('[exterior] skin merge failed', material.name); continue; }
      g.boundingSphere = sphere.clone();
      const sm = new THREE.SkinnedMesh(g, material);
      sm.name = `${name}:${material.name}`;
      sm.bind(skeleton, new THREE.Matrix4());
      sm.boundingSphere = sphere.clone();
      sm.castShadow = !/glow|glass|bulb/.test(material.name || '') && g.index.count / 3 > 1500;
      sm.receiveShadow = true;
      parent.add(sm); meshes.push(sm);
    }
    for (const b of bones) b.visible = false;   // the originals stay in the graph as bones (their matrices drive the skin)
    return { meshes, skeleton, sphere };
  }

  /* ---------------------------------------------------------------- matte paint (watercolour wants no gloss) */
  function matteMaterials() {
    return memo('matte', () => {
      const remap = new Map();
      const mk = (name, o) => { const m = P.mat(name).clone(); Object.assign(m, o); m.name = name + 'Matte'; remap.set(P.mat(name), m); return m; };
      const metal = mk('metal', { metalness: 0.18, roughness: 0.62, envMapIntensity: 0.55 });
      const satin = mk('satin', { roughness: 0.72 });
      return { remap, metal, satin };
    });
  }

  /* ---------------------------------------------------------------- canvas textures (hand-painted, no words) */
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
  function toTex(c, o = {}) {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = o.clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
    t.anisotropy = 4; t.needsUpdate = true;
    return t;
  }
  function rgbaS(hex, a) { const h = hex.replace('#', ''); const n = parseInt(h, 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }

  const TEX = {
    /* warm limewash render: cream with soft mottled washes and a few hairline cracks (tile ≈ 3.2 m) */
    wash: () => memo('tex:wash', () => {
      const W = 512, H = 512, [c, g] = canvas(W, H), r = rng(41);
      g.fillStyle = '#F6ECDD'; g.fillRect(0, 0, W, H);
      const cols = ['#EBDAC3', '#F9F2E7', '#F0D8C8', '#E6D3BB', '#FBF5EC', '#EFDCC9'];
      for (let i = 0; i < 70; i++) blobS(g, W, H, r() * W, r() * H, 30 + r() * 110, cols[i % cols.length], 0.18 + r() * 0.22, 0.6 + r() * 0.8);
      // dry-brush streaks (vertical, very faint)
      for (let i = 0; i < 40; i++) { const x = r() * W, y = r() * H, h = 40 + r() * 140; g.fillStyle = rgbaS(r() < 0.5 ? '#E3CFB6' : '#FFFBF4', 0.08 + r() * 0.08); g.fillRect(x, y, 1.5 + r() * 2.5, h); g.fillRect(x - W, y, 2, h); }
      // hairline cracks
      g.strokeStyle = rgbaS('#CDB79E', 0.35); g.lineWidth = 1.1;
      for (let i = 0; i < 5; i++) { let x = r() * W, y = r() * H; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 26; y += 6 + r() * 14; g.lineTo(x, y); } g.stroke(); }
      return toTex(c);
    }),
    /* flaked plaster showing soft rose bricks: two patches side by side (alpha), u ∈ [0,.5] and [.5,1] */
    bricks: () => memo('tex:bricks', () => {
      const W = 512, H = 256, [c, g] = canvas(W, H), r = rng(77);
      for (let p = 0; p < 2; p++) {
        const ox = p * 256;
        const m = canvas(256, 256), mg = m[1];
        // irregular mask: union of soft ellipses
        mg.fillStyle = '#fff';
        for (let i = 0; i < 9; i++) { mg.beginPath(); mg.ellipse(128 + (r() - 0.5) * 120, 128 + (r() - 0.5) * 90, 30 + r() * 50, 20 + r() * 34, (r() - 0.5) * 0.6, 0, TAU); mg.fill(); }
        // bricks
        const b = canvas(256, 256), bg = b[1];
        bg.fillStyle = '#E2CDB6'; bg.fillRect(0, 0, 256, 256);
        const bh = 19, bw = 58;
        for (let row = 0; row * bh < 256; row++) {
          const off = (row % 2) * bw / 2;
          for (let x = -off; x < 256; x += bw) {
            bg.fillStyle = ['#D49A84', '#C98C77', '#DDA992', '#CF9682', '#E2B29C'][Math.floor(r() * 5)];
            const jx = (r() - 0.5) * 2, jy = (r() - 0.5) * 1.5;
            roundRect(bg, x + 2 + jx, row * bh + 2 + jy, bw - 5, bh - 4.5, 4); bg.fill();
            bg.fillStyle = rgbaS('#FFF4EA', 0.18); roundRect(bg, x + 4, row * bh + 3, bw - 14, 4, 2); bg.fill();
          }
        }
        bg.globalCompositeOperation = 'destination-in'; bg.drawImage(m[0], 0, 0);
        // soft plaster rim around the hole
        g.save(); g.translate(ox, 0);
        g.globalAlpha = 0.5; g.filter = 'blur(3px)'; g.drawImage(m[0], 0, 0); g.filter = 'none'; g.globalAlpha = 1;
        g.globalCompositeOperation = 'source-in'; g.fillStyle = '#E4D2BC'; g.fillRect(0, 0, 256, 256);
        g.globalCompositeOperation = 'source-over'; g.drawImage(b[0], 0, 0);
        g.restore();
      }
      const t = toTex(c, { clamp: true });
      return t;
    }),
    /* chalkboard with pictograms only: cup with steam, croissant, heart (no words) */
    chalk: () => memo('tex:chalk', () => {
      const W = 256, H = 384, [c, g] = canvas(W, H), r = rng(5);
      g.fillStyle = '#46534D'; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 26; i++) blobS(g, W, H, r() * W, r() * H, 20 + r() * 50, '#FFFFFF', 0.03 + r() * 0.04, 1, true);
      const chalk = (col, w) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; };
      // dotted border
      g.fillStyle = rgbaS('#F4EEE2', 0.7);
      for (let x = 22; x <= W - 22; x += 14) { g.beginPath(); g.arc(x, 20, 2.2, 0, TAU); g.fill(); g.beginPath(); g.arc(x, H - 20, 2.2, 0, TAU); g.fill(); }
      // cup
      chalk(rgbaS('#F7F2E8', 0.92), 7);
      g.beginPath(); g.moveTo(72, 72); g.lineTo(80, 128); g.quadraticCurveTo(84, 140, 100, 140); g.lineTo(150, 140); g.quadraticCurveTo(166, 140, 170, 128); g.lineTo(178, 72); g.closePath(); g.stroke();
      g.beginPath(); g.arc(186, 96, 16, -1.2, 1.3); g.stroke();
      g.beginPath(); g.moveTo(62, 152); g.quadraticCurveTo(125, 166, 190, 152); g.stroke();
      chalk(rgbaS('#F7F2E8', 0.6), 5);
      for (const x of [100, 126, 152]) { g.beginPath(); g.moveTo(x, 60); g.bezierCurveTo(x - 10, 48, x + 10, 40, x, 26); g.stroke(); }
      // croissant
      chalk(rgbaS('#F2D7A0', 0.95), 7);
      g.beginPath(); g.moveTo(58, 236); g.bezierCurveTo(70, 186, 186, 186, 198, 236); g.bezierCurveTo(176, 222, 160, 230, 150, 236); g.lineTo(106, 236); g.bezierCurveTo(96, 230, 80, 222, 58, 236); g.stroke();
      for (const x of [104, 128, 152]) { g.beginPath(); g.moveTo(x, 200 + Math.abs(x - 128) * 0.15); g.lineTo(x + (x - 128) * 0.1, 234); g.stroke(); }
      // heart
      g.fillStyle = rgbaS('#F2B6AE', 0.9);
      g.beginPath(); const hx = 128, hy = 300, s = 30;
      g.moveTo(hx, hy + s * 0.9); g.bezierCurveTo(hx - s * 1.4, hy - s * 0.1, hx - s * 0.7, hy - s * 1.1, hx, hy - s * 0.35); g.bezierCurveTo(hx + s * 0.7, hy - s * 1.1, hx + s * 1.4, hy - s * 0.1, hx, hy + s * 0.9); g.fill();
      return toTex(c, { clamp: true });
    }),
    /* 4×2 atlas of picture-book covers (pastel, simple illustrations, no text) */
    covers: () => memo('tex:covers', () => {
      const S = 256, [c, g] = canvas(S * 4, S * 2), r = rng(9);
      const bgs = ['#8FAE8C', '#E59E90', '#EBC56E', '#8FB1CC', '#B79FCB', '#E6A26E', '#9CC2A3', '#D98B97'];
      const ink = '#6B5A4E';
      for (let i = 0; i < 8; i++) {
        const ox = (i % 4) * S, oy = Math.floor(i / 4) * S;
        g.save(); g.translate(ox, oy);
        g.fillStyle = bgs[i]; g.fillRect(0, 0, S, S);
        g.fillStyle = rgbaS('#FFFFFF', 0.18); g.fillRect(0, 0, 18, S);            // spine shading strip
        g.strokeStyle = rgbaS('#FFFBF4', 0.75); g.lineWidth = 5; g.strokeRect(30, 16, S - 46, S - 32);
        const cx = 140, cy = 140;
        switch (i) {
          case 0: // moon + stars
            g.fillStyle = '#FFF4D6'; g.beginPath(); g.arc(cx, cy, 52, 0, TAU); g.fill(); g.fillStyle = bgs[i]; g.beginPath(); g.arc(cx + 24, cy - 14, 46, 0, TAU); g.fill();
            g.fillStyle = '#FFF4D6'; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(60 + r() * 160, 40 + r() * 80, 4 + r() * 3, 0, TAU); g.fill(); }
            break;
          case 1: // bunny
            g.fillStyle = '#FFFBF4'; g.beginPath(); g.ellipse(cx, cy + 34, 44, 38, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(cx, cy - 16, 30, 0, TAU); g.fill();
            for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(cx + sx * 14, cy - 66, 10, 32, sx * 0.2, 0, TAU); g.fill(); }
            g.fillStyle = '#EFA9A0'; g.beginPath(); g.arc(cx, cy - 10, 4, 0, TAU); g.fill();
            break;
          case 2: // tree on a hill
            g.fillStyle = '#9DB58F'; g.beginPath(); g.ellipse(cx, 236, 120, 50, 0, 0, TAU); g.fill();
            g.fillStyle = '#8A6E58'; g.fillRect(cx - 7, cy - 6, 14, 64);
            g.fillStyle = '#7F9F78'; for (const [dx, dy, rr] of [[0, -40, 46], [-30, -16, 32], [30, -18, 34]]) { g.beginPath(); g.arc(cx + dx, cy + dy, rr, 0, TAU); g.fill(); }
            g.fillStyle = '#E98E7E'; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(cx - 40 + r() * 80, cy - 70 + r() * 60, 6, 0, TAU); g.fill(); }
            break;
          case 3: // hot-air balloon
            g.fillStyle = '#F2A99C'; g.beginPath(); g.ellipse(cx, cy - 26, 50, 58, 0, 0, TAU); g.fill();
            g.fillStyle = '#FFFBF4'; g.beginPath(); g.ellipse(cx, cy - 26, 18, 58, 0, 0, TAU); g.fill();
            g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 30, cy + 20); g.lineTo(cx - 12, cy + 56); g.moveTo(cx + 30, cy + 20); g.lineTo(cx + 12, cy + 56); g.stroke();
            g.fillStyle = '#B89170'; g.fillRect(cx - 16, cy + 54, 32, 24);
            g.fillStyle = '#FFFBF4'; for (const [x, y] of [[70, 200], [200, 60]]) { g.beginPath(); g.ellipse(x, y, 26, 10, 0, 0, TAU); g.fill(); }
            break;
          case 4: // little house
            g.fillStyle = '#FFF6EA'; g.fillRect(cx - 50, cy - 10, 100, 80);
            g.fillStyle = '#C98C7A'; g.beginPath(); g.moveTo(cx - 64, cy - 6); g.lineTo(cx, cy - 66); g.lineTo(cx + 64, cy - 6); g.fill();
            g.fillStyle = '#9DB58F'; g.fillRect(cx - 12, cy + 26, 24, 44);
            g.fillStyle = '#F3D88C'; g.fillRect(cx - 40, cy + 6, 18, 18); g.fillRect(cx + 22, cy + 6, 18, 18);
            break;
          case 5: // sun over hills
            g.fillStyle = '#FBE3A0'; g.beginPath(); g.arc(cx, cy - 20, 40, 0, TAU); g.fill();
            g.fillStyle = '#B7C9A6'; g.beginPath(); g.ellipse(cx - 50, 230, 110, 60, 0, 0, TAU); g.fill();
            g.fillStyle = '#9CB58F'; g.beginPath(); g.ellipse(cx + 60, 240, 110, 60, 0, 0, TAU); g.fill();
            break;
          case 6: // flowers
            for (const [dx, col] of [[-44, '#EFA9A0'], [0, '#FFFBF4'], [44, '#E9C27E']]) {
              g.strokeStyle = '#7F9A7A'; g.lineWidth = 5; g.beginPath(); g.moveTo(cx + dx, cy + 80); g.lineTo(cx + dx, cy); g.stroke();
              g.fillStyle = col; for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; g.beginPath(); g.arc(cx + dx + Math.cos(a) * 14, cy - 10 + Math.sin(a) * 14, 11, 0, TAU); g.fill(); }
              g.fillStyle = '#E8B04E'; g.beginPath(); g.arc(cx + dx, cy - 10, 7, 0, TAU); g.fill();
            }
            break;
          default: // teddy bear face
            g.fillStyle = '#C99A76'; for (const sx of [-1, 1]) { g.beginPath(); g.arc(cx + sx * 40, cy - 40, 20, 0, TAU); g.fill(); }
            g.beginPath(); g.arc(cx, cy, 56, 0, TAU); g.fill();
            g.fillStyle = '#EED9C0'; g.beginPath(); g.ellipse(cx, cy + 18, 26, 20, 0, 0, TAU); g.fill();
            g.fillStyle = ink; for (const sx of [-1, 1]) { g.beginPath(); g.arc(cx + sx * 20, cy - 10, 6, 0, TAU); g.fill(); }
            g.beginPath(); g.arc(cx, cy + 10, 7, 0, TAU); g.fill();
        }
        g.restore();
      }
      return toTex(c, { clamp: true });
    }),
    /* gingham (blush on cream by default), one tile = 4 checks */
    gingham: (hex = '#E7A79C') => memo('tex:gingham' + hex, () => {
      const S = 128, [c, g] = canvas(S, S);
      g.fillStyle = '#FBF4EA'; g.fillRect(0, 0, S, S);
      g.fillStyle = rgbaS(hex, 0.5);
      for (let i = 0; i < 4; i++) { g.fillRect(i * 32, 0, 16, S); g.fillRect(0, i * 32, S, 16); }
      return toTex(c);
    }),
    /* pale flagstone pavement, irregular slabs with soft joints (tile ≈ 2.6 m) */
    flags: () => memo('tex:flags', () => {
      const W = 512, H = 512, [c, g] = canvas(W, H), r = rng(23);
      g.fillStyle = '#CDBFAE'; g.fillRect(0, 0, W, H);
      const rows = [0, 92, 196, 300, 410, 512];
      for (let ri = 0; ri < rows.length - 1; ri++) {
        const y0 = rows[ri], y1 = rows[ri + 1];
        let x = -r() * 120;
        while (x < W) {
          const w = 110 + r() * 120;
          const col = ['#EAE0D2', '#E4D8C8', '#EFE6DA', '#E0D3C2', '#E8DCCB'][Math.floor(r() * 5)];
          for (const dx of [0, -W, W]) { g.fillStyle = col; roundRect(g, x + dx + 4, y0 + 4, w - 8, y1 - y0 - 8, 10); g.fill(); }
          for (let k = 0; k < 3; k++) blobS(g, W, H, x + r() * w, y0 + r() * (y1 - y0), 18 + r() * 30, r() < 0.5 ? '#D8CAB7' : '#F5EEE4', 0.25, 1);
          x += w;
        }
      }
      return toTex(c);
    }),
    /* ivory sign-writer pictograms for the fascia panels: open book (u .0–.5) and a teacup (u .5–1) — no words */
    icons: () => memo('tex:icons', () => {
      const W = 512, H = 256, [c, g] = canvas(W, H);
      g.strokeStyle = '#FBF3E6'; g.fillStyle = '#FBF3E6'; g.lineCap = 'round'; g.lineJoin = 'round';
      // open book with a heart above
      g.lineWidth = 9;
      g.beginPath(); g.moveTo(128, 196); g.bezierCurveTo(100, 176, 62, 176, 40, 186); g.lineTo(40, 98); g.bezierCurveTo(62, 88, 100, 88, 128, 108); g.closePath(); g.stroke();
      g.beginPath(); g.moveTo(128, 196); g.bezierCurveTo(156, 176, 194, 176, 216, 186); g.lineTo(216, 98); g.bezierCurveTo(194, 88, 156, 88, 128, 108); g.closePath(); g.stroke();
      g.lineWidth = 5; for (const k of [0, 1, 2]) { g.beginPath(); g.moveTo(58, 122 + k * 20); g.quadraticCurveTo(84, 114 + k * 20, 110, 126 + k * 20); g.stroke(); g.beginPath(); g.moveTo(146, 126 + k * 20); g.quadraticCurveTo(172, 114 + k * 20, 198, 122 + k * 20); g.stroke(); }
      heartFill(g, 128, 54, 15);
      // teacup with steam + saucer
      const ox = 256;
      g.lineWidth = 9;
      g.beginPath(); g.moveTo(ox + 62, 110); g.lineTo(ox + 70, 170); g.quadraticCurveTo(ox + 74, 186, ox + 92, 186); g.lineTo(ox + 152, 186); g.quadraticCurveTo(ox + 170, 186, ox + 174, 170); g.lineTo(ox + 182, 110); g.closePath(); g.stroke();
      g.beginPath(); g.arc(ox + 190, 140, 18, -1.3, 1.3); g.stroke();
      g.beginPath(); g.moveTo(ox + 50, 206); g.quadraticCurveTo(ox + 122, 222, ox + 196, 206); g.stroke();
      g.lineWidth = 6; for (const x of [96, 122, 148]) { g.beginPath(); g.moveTo(ox + x, 96); g.bezierCurveTo(ox + x - 12, 80, ox + x + 12, 68, ox + x, 50); g.stroke(); }
      return toTex(c, { clamp: true });
    }),
  };
  function blobS(g, W, H, x, y, r, col, a, sy = 1) {
    for (const dx of [-W, 0, W]) for (const dy of [-H, 0, H]) {
      const cx = x + dx, cy = y + dy;
      if (cx + r < 0 || cx - r > W || cy + r * sy < 0 || cy - r * sy > H) continue;
      g.save(); g.translate(cx, cy); g.scale(1, sy);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, r);
      gr.addColorStop(0, rgbaS(col, a)); gr.addColorStop(0.6, rgbaS(col, a * 0.5)); gr.addColorStop(1, rgbaS(col, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); g.restore();
    }
  }
  function roundRect(g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2); g.beginPath();
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }
  function heartFill(g, x, y, s) {
    g.beginPath(); g.moveTo(x, y + s * 0.9);
    g.bezierCurveTo(x - s * 1.4, y - s * 0.1, x - s * 0.7, y - s * 1.1, x, y - s * 0.35);
    g.bezierCurveTo(x + s * 0.7, y - s * 1.1, x + s * 1.4, y - s * 0.1, x, y + s * 0.9); g.fill();
  }

  /* ---------------------------------------------------------------- planar polygons */
  /* a flat polygon given in plane coords (u, v) → 3D: p = O + u·U + v·V. Earcut triangulation (ShapeGeometry),
     UVs = (u, v) / tile, normal = U × V. */
  function planePoly(pts2, O, U, V, tile = 1, holes = []) {
    const s = new THREE.Shape(pts2.map(([u, v]) => new THREE.Vector2(u, v)));
    for (const h of holes) s.holes.push(new THREE.Path(h.map(([u, v]) => new THREE.Vector2(u, v))));
    const g = new THREE.ShapeGeometry(s, 8);
    const pos = g.attributes.position, uv = new Float32Array(pos.count * 2), out = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i), v = pos.getY(i);
      out[i * 3] = O.x + U.x * u + V.x * v; out[i * 3 + 1] = O.y + U.y * u + V.y * v; out[i * 3 + 2] = O.z + U.z * u + V.z * v;
      uv[i * 2] = u / tile; uv[i * 2 + 1] = v / tile;
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    const n = new THREE.Vector3().crossVectors(U, V).normalize(), nor = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) { nor[i * 3] = n.x; nor[i * 3 + 1] = n.y; nor[i * 3 + 2] = n.z; }
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    return g;
  }
  /* convex polygon from 3D points (fan), facing the side the points wind counter-clockwise from */
  function fan(points, uvTile = 1, flip = false) {
    const pos = [], idx = [];
    for (const p of points) pos.push(p.x, p.y, p.z);
    for (let i = 1; i < points.length - 1; i++) flip ? idx.push(0, i + 1, i) : idx.push(0, i, i + 1);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    worldUV(g, uvTile);
    return g;
  }
  /* scalloped board facing +Z: top edge at y = 0 from x = 0..w, straight sides down to h - r, then n half-round
     scallops along the bottom. Extruded `d` toward −Z (front face at z = 0). */
  function scallopBoard(w, h, r, d = 0, seg = 4) {
    return memo(`scb${w.toFixed(3)}/${h.toFixed(3)}/${r.toFixed(3)}/${d}/${seg}`, () => {
      const n = Math.max(1, Math.round(w / (r * 2))), rr = w / n / 2;
      const s = new THREE.Shape();
      s.moveTo(0, 0); s.lineTo(w, 0); s.lineTo(w, -(h - rr));
      for (let k = n - 1; k >= 0; k--) s.absarc(rr * (2 * k + 1), -(h - rr), rr, 0, -PI, true);
      s.lineTo(0, 0);
      if (!d) return new THREE.ShapeGeometry(s, seg);          // flat board (front face only, +Z)
      const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: seg });
      g.translate(0, 0, -d);
      return g;
    });
  }

  /* ---------------------------------------------------------------- potted plants (owner request 07/11; integrator)
     big readable silhouettes for the watercolour: a split-heart monstera leaf, a needle/blade leaf (rosemary, sage),
     a cupped double flower (camellia japonica, peony petals). All face +Z with the base at the origin, tip at +Y. */
  /* monstera: heart-shaped blade with the classic slits cut in from the margin (≈ 40 triangles), slightly cupped */
  function monsteraLeafGeo() {
    return memo('monstera', () => {
      const R = [[0.0, 0.1], [0.14, -0.02], [0.32, 0.03], [0.44, 0.17], [0.47, 0.27], [0.24, 0.32], [0.48, 0.37], [0.47, 0.47], [0.21, 0.5],
        [0.44, 0.56], [0.4, 0.65], [0.17, 0.66], [0.35, 0.72], [0.28, 0.81], [0.1, 0.81], [0.19, 0.88], [0.0, 1.0]];
      const s = new THREE.Shape();
      s.moveTo(R[0][0], R[0][1]);
      for (let i = 1; i < R.length; i++) s.lineTo(R[i][0], R[i][1]);
      for (let i = R.length - 2; i >= 0; i--) s.lineTo(-R[i][0], R[i][1]);
      const g = new THREE.ShapeGeometry(s, 1);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, -0.28 * x * x - 0.08 * Math.sin(y * PI) + 0.05 * y); }
      g.computeVertexNormals();
      return g;
    });
  }
  /* narrow blade (rosemary needle, sage leaf when scaled wider): 6 triangles, a soft keel */
  function bladeGeo() {
    return memo('blade', () => {
      const pos = [0, 0, 0, -0.5, 0.25, 0.02, 0, 0.5, 0.06, 0.5, 0.25, 0.02, -0.38, 0.62, 0.03, 0.38, 0.62, 0.03, 0, 1, 0];
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(14), 2));
      g.setIndex([0, 3, 2, 0, 2, 1, 1, 2, 4, 2, 3, 5, 2, 5, 6, 2, 6, 4]); g.computeVertexNormals();
      return g;
    });
  }
  /* cupped many-petal flower (camellia japonica, peony): two staggered rings of 8 petals around a dome, ≈ 48 triangles,
     facing +Z, radius 1 */
  function rosetteGeo() {
    return memo('rosette', () => {
      const pos = [0, 0, 0.35], idx = [];
      const ring = (n, r0, r1, z0, z1, rot) => {
        const base = pos.length / 3;
        for (let i = 0; i < n; i++) {
          const a = (i + rot) / n * TAU, b = (i + rot + 0.5) / n * TAU;
          pos.push(Math.cos(a) * r0, Math.sin(a) * r0, z0, Math.cos(b) * r1, Math.sin(b) * r1, z1);
        }
        for (let i = 0; i < n; i++) { const a = base + i * 2, t = base + i * 2 + 1, n2 = base + ((i + 1) % n) * 2; idx.push(0, a, t, 0, t, n2); }
      };
      ring(8, 1.0, 0.86, 0.0, 0.08, 0); ring(8, 0.66, 0.56, 0.22, 0.28, 0.5); ring(6, 0.36, 0.3, 0.34, 0.38, 0.25);
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
      g.setIndex(idx); g.computeVertexNormals();
      return g;
    });
  }

  return { rng, mat4, prep, paintGeo, Decals, Batch, Scatter, leafGeo, blossomGeo, lumpy, bevelBox, gradientTex, IVY_GREENS, worldUV, profileFace, vine, sprinkle, skinCharacters, VINE_GREENS,
    matteMaterials, TEX, planePoly, fan, scallopBoard, memo, monsteraLeafGeo, bladeGeo, rosetteGeo };
}
