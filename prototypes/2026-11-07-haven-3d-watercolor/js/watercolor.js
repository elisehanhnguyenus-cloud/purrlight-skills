/* Haven 3D — watercolour + coloured-pencil post chain (v2 rendering style, PREVIEW 06/11, Purrlight Studio).

   createWatercolor(renderer, { quality: 'high'|'low', reduceMotion, enabled = true, boil = false }) -> {
     render(scene, camera, t, viewport?)   draw one painted frame to the canvas (viewport: [x, y, w, h] CSS px from the
                                           lower-left, optional; setSize must then be the viewport size)
     setSize(w, h, dpr)                    CSS size + pixel ratio of the canvas
     setQuality(q), setReduceMotion(b), setEnabled(b), setBoil(b), debug(mode), refreshPristine(scene), info(), dispose()
   }
   v4 (owner 10/11: clean 3D is the default look, the paint is ?look=paint):
   - setEnabled(false) (or opts.enabled = false) skips EVERY paint pass: render() is then one plain renderer.render() of
     both layers straight to the canvas (tone mapping by the renderer, glow gain 1, pristine meshes drawn as ordinary
     unlit meshes). Switching off at run time also frees the paint's render targets (they re-allocate on the next
     painted frame). For look=3d, create the renderer with antialias (MSAA) and pass { enabled: false }.
   - the pencil-line "boil" is OFF by default: the lines are static and nothing in the paint changes with time, so a
     still camera gives identical frames (main can stop rendering when idle). setBoil(true) / opts.boil brings back the
     hand-animated ~4 steps per second (never under reduced motion).

   Chain (all passes are one full-screen triangle):
     0. scene pass   -> half-float target + depth texture, full drawing-buffer resolution, layer 0 only, no MSAA
     1. prep         (paint res) tone map (filmic, applied exactly once; not on the sky) + sRGB + warm watercolour grading
     2. kuwahara     (paint res) generalised Kuwahara, 8 sectors, polynomial sector weights, Gaussian radial falloff,
                     point-symmetric sample pairs; alpha = painted luma minus disc-mean luma (pigment pooling input)
     3. composite    (full res, to the canvas) tremor wobble, edge darkening + granulation + turbulence via the
                     pigment-density colour model, cold-press paper, coloured-pencil lines from depth + luma, light
                     hatching in deep shadow (high), deckled paper border
     4. pristine     layer-1 meshes (sign face, real Merlin photo) drawn crisp and unlit on top; each fragment is
                     discarded where the scene depth is nearer (depth test against the scene depth texture)
   Paint res: about one paint pixel per CSS px (high: full res at dpr 1, half at dpr 2; low: 0.5-0.7 of the buffer).
   v3: HDR "hot" light (lit panes, lamps, fairy bulbs) stays amber through the prep and bleeds a few px in the composite;
   coloured-pencil lines keep the local hue, vary in pressure and get a sketchy second stroke; the pristine layer stops
   at the deckled border; setPreset('shelf' | 'default') for the destination look.

   Maths (own implementation from the papers): Kuwahara et al. 1976 (sector means, choose the calmest);
   Papari, Petkov & Campisi 2007 (generalised: N smooth overlapping sectors, weights 1 / (1 + sigma^q));
   Kyprianidis, Semmo, Kang & Döllner 2010 (polynomial sector weights (u + zeta - eta w^2)^2, eta from the sector
   half-angle); Bousseau et al. 2006 (pigment density C' = C - (C - C^2)(d - 1), edge darkening, paper, turbulence).
   The noise/paper texture is generated once here (tileable value noise), no image files. */

import * as THREE from '../vendor/three.module.min.js';

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

/* ------------------------------------------------------------------ procedural paper + noise (tileable, 512²)
   R: cold-press paper tooth (height)   G: pencil grain (streaky, anisotropic)
   B: low-frequency wash noise          A: second low-frequency noise (other seed)                                */
function hash2(ix, iy, seed) {
  let h = (ix * 374761393 + iy * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function valueNoise(x, y, cx, cy, seed) {     /* x, y in [0,1); cx, cy lattice cells across the tile (wraps) */
  const fx = x * cx, fy = y * cy, ix = Math.floor(fx), iy = Math.floor(fy);
  const tx = fx - ix, ty = fy - iy;
  const sx = tx * tx * tx * (tx * (tx * 6 - 15) + 10), sy = ty * ty * ty * (ty * (ty * 6 - 15) + 10);
  const x0 = ((ix % cx) + cx) % cx, x1 = (x0 + 1) % cx, y0 = ((iy % cy) + cy) % cy, y1 = (y0 + 1) % cy;
  const a = hash2(x0, y0, seed), b = hash2(x1, y0, seed), c = hash2(x0, y1, seed), d = hash2(x1, y1, seed);
  return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy;
}
let NOISE_CACHE = null;
function makeNoiseTexture() {
  if (NOISE_CACHE) return NOISE_CACHE;
  const S = 512, data = new Uint8Array(S * S * 4);
  const tooth = new Float32Array(S * S), grain = new Float32Array(S * S), lowA = new Float32Array(S * S), lowB = new Float32Array(S * S);
  const stats = (arr) => { let lo = Infinity, hi = -Infinity; for (const v of arr) { if (v < lo) lo = v; if (v > hi) hi = v; } return [lo, hi]; };
  for (let j = 0; j < S; j++) {
    const y = j / S;
    for (let i = 0; i < S; i++) {
      const x = i / S, k = j * S + i;
      /* cold press: soft rounded bumps of a few px on a gentle undulation (no hard contours) */
      tooth[k] = 0.46 * valueNoise(x, y, 128, 128, 11) + 0.3 * valueNoise(x, y, 64, 64, 12) + 0.24 * valueNoise(x, y, 256, 256, 13);
      /* pencil grain: long thin streaks (anisotropic lattice), with a little cross grain */
      grain[k] = 0.6 * valueNoise(x, y, 22, 300, 21) + 0.25 * valueNoise(x, y, 44, 180, 22) + 0.15 * valueNoise(x, y, 128, 128, 23);
      lowA[k] = 0.62 * valueNoise(x, y, 4, 4, 31) + 0.38 * valueNoise(x, y, 9, 9, 32);
      lowB[k] = 0.62 * valueNoise(x, y, 4, 4, 41) + 0.38 * valueNoise(x, y, 9, 9, 42);
    }
  }
  const norm = (arr, gamma = 1, curve = null) => {
    const [lo, hi] = stats(arr), r = 1 / Math.max(1e-6, hi - lo);
    for (let k = 0; k < arr.length; k++) { let v = (arr[k] - lo) * r; if (curve) v = curve(v); arr[k] = Math.pow(v, gamma); }
  };
  const ss = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  norm(tooth, 1, (v) => ss(0.05, 0.95, v)); norm(grain, 1, (v) => ss(0.15, 0.85, v)); norm(lowA, 1, (v) => ss(0.08, 0.92, v)); norm(lowB, 1, (v) => ss(0.08, 0.92, v));
  for (let k = 0; k < S * S; k++) {
    data[k * 4] = Math.round(tooth[k] * 255); data[k * 4 + 1] = Math.round(grain[k] * 255);
    data[k * 4 + 2] = Math.round(lowA[k] * 255); data[k * 4 + 3] = Math.round(lowB[k] * 255);
  }
  const tex = new THREE.DataTexture(data, S, S, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true;
  tex.colorSpace = THREE.NoColorSpace; tex.needsUpdate = true;
  NOISE_CACHE = tex;
  return tex;
}

/* ------------------------------------------------------------------ shaders */
const VERT = /* glsl */`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const COMMON = /* glsl */`
float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }`;
/* filmic tone curve: the RRT+ODT rational fit with its sRGB<->ACES matrices (S. Hill's published coefficients), the same
   curve the plain renderer's ACES mode uses, so builders see the same brightness with and without the paint */
const FILMIC = /* glsl */`
uniform float uExposure;
vec3 filmic(vec3 c) {
  const mat3 IN = mat3(0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777);
  const mat3 OUT = mat3(1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602);
  c = IN * (c * uExposure / 0.6);
  c = (c * (c + 0.0245786) - 0.000090537) / (c * (0.983729 * c + 0.4329510) + 0.238081);
  return clamp(OUT * c, 0.0, 1.0);
}
vec3 srgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(max(c, vec3(1e-6)), vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c)); }`;

/* 1. prep: tone map once (filmic curve above; the sky backdrop is left as painted), encode sRGB, watercolour grading */
const PREP_FRAG = /* glsl */`
uniform sampler2D tScene, tDepth;
uniform float uSat, uLift, uHi, uContrast, uBands, uBandAmt, uToe;
uniform vec3 uShadowTint, uPaper, uWarm;
varying vec2 vUv;
${COMMON}
${FILMIC}
void main() {
  vec3 lin = texture2D(tScene, vUv).rgb;
  bool skyPx = texture2D(tDepth, vUv).x > 0.999999;
  /* lit panes, lamps, bulbs and halos (HDR well above the brightest lit wall, ~1.13): they stay warm amber light, never
     paper, never banded (v3: the glow survives the paint) */
  float hot = skyPx ? 0.0 : smoothstep(1.25, 2.4, max(lin.r, max(lin.g, lin.b)));
  /* the sky is a painted (sRGB) backdrop: like the plain renderer, it is not tone mapped */
  vec3 c = srgb(skyPx ? lin : filmic(lin));
  float l = luma(c);
  /* layered glazes: the value is pulled toward a few soft steps, so smooth CG shading becomes flat washes */
  float lb = l * uBands, lq = (floor(lb) + smoothstep(0.3, 0.7, fract(lb))) / uBands;
  c *= mix(1.0, lq / max(l, 1e-3), uBandAmt * (1.0 - hot) * smoothstep(0.02, 0.12, l) * (1.0 - smoothstep(0.68, 0.84, l)));   /* lit areas keep their gradation */
  l = luma(c);
  c = mix(vec3(l), c, mix(uSat, 1.0, smoothstep(0.7, 0.95, l)));   /* gentle desaturation (not in the lit, glowing parts) */
  float deep = smoothstep(0.0, 0.3, l);                      /* near-black (black knit, ink, dark joinery) keeps its depth */
  c *= mix(uToe, 1.0, smoothstep(0.03, 0.3, l));              /* a soft toe: black knit reads black, shadows get depth */
  c = mix(c, vec3(1.0), (1.0 - uContrast) * (1.0 - l) * mix(0.3, 1.0, deep));   /* a little less contrast: darks lift, lights stay luminous */
  float sh = 1.0 - smoothstep(0.0, 0.62, l);                  /* shadows: lifted toward a warm lavender, never grey */
  c = mix(c, uShadowTint, sh * sh * uLift * mix(0.25, 1.0, deep));
  c *= mix(vec3(1.0), uWarm, smoothstep(0.15, 0.85, l));      /* warm the mid tones a touch */
  /* near-white, unsaturated highlights become the cream of the paper; warm lamp glows keep their colour */
  float chroma = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
  c = mix(c, uPaper, smoothstep(0.9, 1.02, l) * (1.0 - smoothstep(0.05, 0.16, chroma)) * uHi * (1.0 - hot));
  /* glowing panes become amber light (not paper) */
  c = mix(c, c * vec3(1.0, 0.84, 0.6) * 1.04, hot * 0.55);
  gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
}`;

/* 2. generalised Kuwahara with polynomial sector weights (8 sectors, as in the header) */
const KUWA_FRAG = (R) => /* glsl */`
uniform sampler2D tPrep;
uniform vec2 uTexel;
uniform float uSharp;
varying vec2 vUv;
${COMMON}
#define R ${R}
const float RF = ${R}.0;
const float ZETA = 0.36;                                  /* overlap: every sector sees the centre a little */
const float ETA = (ZETA + 0.92387953) / 0.14644661;       /* (zeta + cos(pi/8)) / sin^2(pi/8): zero on the sector edge */
const float IS2 = 0.70710678;
void main() {
  vec3 c0 = texture2D(tPrep, vUv).rgb; float l0 = luma(c0);
  float wc = ZETA * ZETA;
  vec4 mR0 = vec4(wc * c0.r), mR1 = mR0, mG0 = vec4(wc * c0.g), mG1 = mG0, mB0 = vec4(wc * c0.b), mB1 = mB0;
  vec4 s0 = vec4(wc * l0 * l0), s1 = s0, W = vec4(wc);
  vec3 blur = c0; float bw = 1.0;
  for (int j = 0; j <= R; j++) {
    for (int i = -R; i <= R; i++) {
      if (j == 0 && i <= 0) continue;                       /* half plane: the other half is the mirrored partner */
      vec2 v = vec2(float(i), float(j));
      if (dot(v, v) > RF * RF + 1.0) continue;
      vec2 n = v / RF;
      vec2 d = v * uTexel;
      vec3 c1 = texture2D(tPrep, vUv + d).rgb, c2 = texture2D(tPrep, vUv - d).rgb;
      float q1 = luma(c1), q2 = luma(c2); q1 *= q1; q2 *= q2;
      float xr = (n.x + n.y) * IS2, yr = (n.y - n.x) * IS2;
      vec4 U = vec4(n.x, xr, n.y, yr);                      /* along sectors 0..3 (0, 45, 90, 135 degrees) */
      vec4 Q = vec4(n.y * n.y, yr * yr, n.x * n.x, xr * xr); /* squared across */
      float g = exp(-2.0 * dot(n, n));
      vec4 wa = max(vec4(0.0), U + ZETA - ETA * Q); wa *= wa * g;   /* +v in sectors 0..3 (and -v in 4..7) */
      vec4 wb = max(vec4(0.0), -U + ZETA - ETA * Q); wb *= wb * g;  /* +v in sectors 4..7 (and -v in 0..3) */
      mR0 += wa * c1.r + wb * c2.r; mR1 += wb * c1.r + wa * c2.r;
      mG0 += wa * c1.g + wb * c2.g; mG1 += wb * c1.g + wa * c2.g;
      mB0 += wa * c1.b + wb * c2.b; mB1 += wb * c1.b + wa * c2.b;
      s0 += wa * q1 + wb * q2; s1 += wb * q1 + wa * q2;
      W += wa + wb;
      blur += (c1 + c2) * g; bw += 2.0 * g;
    }
  }
  vec4 iW = 1.0 / W;
  mR0 *= iW; mG0 *= iW; mB0 *= iW; mR1 *= iW; mG1 *= iW; mB1 *= iW;
  vec4 lu0 = 0.299 * mR0 + 0.587 * mG0 + 0.114 * mB0, lu1 = 0.299 * mR1 + 0.587 * mG1 + 0.114 * mB1;
  vec4 v0 = max(vec4(0.0), s0 * iW - lu0 * lu0) * uSharp, v1 = max(vec4(0.0), s1 * iW - lu1 * lu1) * uSharp;
  v0 *= v0; v0 *= v0; v1 *= v1; v1 *= v1;                   /* (sigma^2)^(q/2), q = 8 */
  vec4 a0 = 1.0 / (1.0 + v0), a1 = 1.0 / (1.0 + v1);
  float A = dot(a0, vec4(1.0)) + dot(a1, vec4(1.0));
  vec3 c = vec3(dot(a0, mR0) + dot(a1, mR1), dot(a0, mG0) + dot(a1, mG1), dot(a0, mB0) + dot(a1, mB1)) / A;
  blur /= bw;
  gl_FragColor = vec4(c, clamp(0.5 + 2.0 * (luma(c) - luma(blur)), 0.0, 1.0));
}`;

/* 3. composite: watercolour on cold-press paper + coloured-pencil lines + deckled border */
const COMP_FRAG = (o) => /* glsl */`
uniform sampler2D tPaint, tDepth, tNoise, tScene, tPrep;
uniform vec4 uView;          /* drawing-buffer px: offset xy, size zw */
uniform float uDpr;
uniform vec2 uNF;            /* camera near, far */
uniform vec4 uBoil;          /* xy: line jitter seed, zw: grain offset (both static under reduced motion) */
uniform vec3 uPaper, uSepia;
uniform float uWobble, uEdge, uGran, uTurb, uLine, uDeckle, uHatch, uLineDepth, uLineCol, uFar, uDetail, uGlowBleed, uSS;
uniform vec2 uLineW;         /* tap offset (CSS px) near / far */
uniform vec2 uDT, uCT;       /* depth-edge and colour-edge thresholds */
uniform vec3 uPaintRes;      /* paint target size (px) and 1 when it is smaller than the drawing buffer (smooth upsample) */
varying vec2 vUv;
${COMMON}
#define DBG ${o.dbg}
/* third-order (cubic B-spline) filtering from 4 bilinear taps: the weights of the 4x4 footprint fold into 2x2 offset
   bilinear fetches (Sigg & Hadwiger, GPU Gems 2 ch. 20) */
vec4 bspline4(float f) { float g = 1.0 - f; return vec4(g * g * g, 4.0 - 6.0 * f * f + 3.0 * f * f * f, 1.0 + 3.0 * f + 3.0 * f * f - 3.0 * f * f * f, f * f * f) / 6.0; }
vec4 paintAt(vec2 uv) {
  if (uPaintRes.z < 0.5) return texture2D(tPaint, uv);
  vec2 st = uv * uPaintRes.xy - 0.5, i = floor(st), f = st - i;
  vec4 wx = bspline4(f.x), wy = bspline4(f.y);
  vec2 s0 = vec2(wx.x + wx.y, wy.x + wy.y), s1 = vec2(wx.z + wx.w, wy.z + wy.w);
  vec2 p0 = (i - 0.5 + vec2(wx.y, wy.y) / s0) / uPaintRes.xy, p1 = (i + 1.5 + vec2(wx.w, wy.w) / s1) / uPaintRes.xy;
  vec2 k = s0 / (s0 + s1);
  return mix(mix(texture2D(tPaint, vec2(p1.x, p1.y)), texture2D(tPaint, vec2(p0.x, p1.y)), k.x),
             mix(texture2D(tPaint, vec2(p1.x, p0.y)), texture2D(tPaint, vec2(p0.x, p0.y)), k.x), k.y);
}
#define HATCH ${o.hatch}
#define EMBOSS ${o.emboss}
#define LUMA_LINES ${o.lumaLines}
#define DETAIL ${o.detail}
#define SS ${o.ss}
#define STROKE2 ${o.stroke2}
#define GLOW5 ${o.glow5}
float lin(float d) { return uNF.x * uNF.y / (uNF.y - d * (uNF.y - uNF.x)); }
float invz(vec2 uv) { return 1.0 / lin(texture2D(tDepth, uv).x); }
/* Laplacian of 1/z (flat planes give none): creases and silhouettes, relative to the centre */
float lapAt(vec2 p, vec2 o) {
  float ic = invz(p);
  return abs(invz(p + vec2(o.x, 0.0)) + invz(p - vec2(o.x, 0.0)) + invz(p + vec2(0.0, o.y)) + invz(p - vec2(0.0, o.y)) - 4.0 * ic) / ic;
}
/* HDR light above the brightest lit wall bleeds a little into the wash around it (lit panes, lamps, bulbs) */
vec3 hotAt(vec2 p) { return max(texture2D(tScene, p).rgb - 1.35, 0.0); }
${FILMIC}
void main() {
  vec2 px = gl_FragCoord.xy - uView.xy;
  vec2 res = uView.zw;
  vec2 uv = px / res;
  vec2 css = px / uDpr;
  vec2 cssRes = res / uDpr;
#if DBG == 1
  vec3 hdr = texture2D(tScene, uv).rgb;
  gl_FragColor = vec4(srgb(texture2D(tDepth, uv).x > 0.999999 ? hdr : filmic(hdr)), 1.0); return;
#endif
  vec4 nP = texture2D(tNoise, css / 420.0);                         /* paper tooth (r), pencil grain (g) */
  vec4 nL = texture2D(tNoise, css / 1500.0 + vec2(0.31, 0.17));     /* slow noise (b, a): tremor */
  vec4 nW = texture2D(tNoise, css / 540.0 + vec2(0.71, 0.43));      /* wash blotches (b, a): uneven pigment, wet edges */
  float h = nP.r;
  /* hand tremor / colour bleed: a slow wobble of a few px */
  vec2 wob = ((nL.ba - 0.5) * uWobble + (nW.ab - 0.5) * uWobble * 0.55) * uDpr / res;
  vec4 paint = paintAt(uv + wob);
  vec3 c = paint.rgb;
  float e = paint.a - 0.5;
  float l = luma(c);
#if DETAIL
  /* keep a little of the hand-made surface (knit, weave, grain) the smoothing took away */
  vec3 pre = texture2D(tPrep, uv + wob).rgb;
  c = clamp(c + (pre - c) * uDetail * (1.0 - smoothstep(0.06, 0.22, abs(luma(pre) - l))), 0.0, 1.0);
#endif
#if DBG == 2
  gl_FragColor = vec4(c, 1.0); return;
#endif
  /* pigment density: pooling at wash edges, uneven wash (turbulence), granulation in the paper valleys */
  float d = 1.0 + uEdge * (max(0.0, -e) * 3.0 + abs(e) * 0.4);    /* pooling on the inside of the darker wash */
  /* uneven wash: pigment patches with darker wet edges (blooms) where the patches meet */
  float wetEdge = exp(-pow((nW.b - 0.5) / 0.03, 2.0)) * smoothstep(0.85, 0.45, l);   /* faint blooms, only in mid tones */
  d += uTurb * ((nW.b - 0.5) * 0.85 + 0.35 * (nL.b - 0.5) + 0.12 * wetEdge) * (0.45 + 0.55 * (1.0 - l)) * (1.0 - smoothstep(0.93, 1.0, l));
  d += uGran * (0.5 - h) * (1.0 - l) * (1.0 - l) * 2.0;
  vec3 C = clamp(c - (c - c * c) * (d - 1.0), 0.0, 1.0);
  /* cold-press paper: cream, its tooth lit from the upper left */
#if EMBOSS
  float emb = clamp(h - texture2D(tNoise, (css + vec2(-0.8, 0.8)) / 420.0).r, -0.25, 0.25);   /* tooth lit from the upper left */
#else
  float emb = 0.0;
#endif
  vec3 paperC = uPaper * (0.992 + 0.01 * h + emb * mix(0.05, 0.11, smoothstep(0.55, 0.95, l)));
  vec3 col = C * paperC;
  /* glow bleed (v3): the warm light of lit panes / lamps / fairy bulbs spreads a few px into the paper, screened on */
  {
    vec2 gk = 4.0 * uDpr / res, gu = uv + wob * 0.5;
#if GLOW5
    vec3 gl = hotAt(gu) * 0.4 + (hotAt(gu + gk) + hotAt(gu - gk) + hotAt(gu + vec2(gk.x, -gk.y)) + hotAt(gu + vec2(-gk.x, gk.y))) * 0.15;
#else
    vec3 gl = hotAt(gu) * 0.4 + (hotAt(gu + gk) + hotAt(gu - gk)) * 0.3;
#endif
    col = 1.0 - (1.0 - col) * (1.0 - clamp(gl * vec3(1.0, 0.8, 0.52) * uGlowBleed, 0.0, 1.0));
  }
#if DBG == 4
  col = paperC;
#endif

  /* coloured-pencil lines: depth creases + silhouettes (Laplacian of 1/z: flat planes give none), colour edges */
  float jitA = fract(sin(dot(floor(css / 23.0) + uBoil.xy, vec2(12.9898, 78.233))) * 43758.5453);
  vec2 jit = (vec2(nL.a, nP.g) - 0.5) * 1.2 + (jitA - 0.5) * 0.6;   /* the pencil does not sit exactly on the paint edge */
  vec2 luv = uv + (wob * 0.55) + jit * uDpr / res;
  float zc = lin(texture2D(tDepth, luv).x);
  float far = smoothstep(2.5, uFar, zc);
  vec2 o = vec2(mix(uLineW.x, uLineW.y, far) * uDpr) / res;
  float lap;
#if SS
  /* supersampled crease detector (two diagonal sub-pixel offsets): no stair-steps on rims when the drawing buffer is
     coarse (phones below dpr 1.75); a uniform branch, so the extra taps cost nothing when it is off */
  if (uSS > 0.5) { vec2 ssO = vec2(0.35, -0.35) / res; lap = 0.5 * (lapAt(luv + ssO, o) + lapAt(luv - ssO, o)); }
  else lap = lapAt(luv, o);
#else
  lap = lapAt(luv, o);
#endif
  float line = smoothstep(uDT.x, uDT.y, lap) * uLineDepth;
#if STROKE2
  /* a sketchy second stroke: the hand goes over the contour again, a little off the first one */
  vec2 luv2 = luv + (jit.yx * 1.6 + 0.8) * uDpr / res;
  line = max(line, smoothstep(uDT.x, uDT.y, lapAt(luv2, o)) * uLineDepth * 0.55);
#endif
#if LUMA_LINES
  vec2 oc = 1.3 * uDpr / res;
  vec2 g = vec2(luma(texture2D(tPaint, luv + vec2(oc.x, 0.0)).rgb) - luma(texture2D(tPaint, luv - vec2(oc.x, 0.0)).rgb),
                luma(texture2D(tPaint, luv + vec2(0.0, oc.y)).rgb) - luma(texture2D(tPaint, luv - vec2(0.0, oc.y)).rgb));
  line = max(line, smoothstep(uCT.x, uCT.y, length(g)) * uLineCol);
#endif
  /* pencil texture: grain along the stroke, gaps (broken strokes), catches on the paper tooth, lighter far away */
  float grain = texture2D(tNoise, vec2(css.x * 0.8 + css.y * 0.6, css.y * 0.8 - css.x * 0.6) / 512.0 + uBoil.zw).g;
  float gaps = smoothstep(0.22, 0.62, texture2D(tNoise, css / 260.0 + uBoil.zw * 1.7 + vec2(0.5, 0.21)).a);
  line *= (0.42 + 0.58 * grain) * mix(0.3, 1.0, gaps) * (0.72 + 0.4 * h);
  line *= mix(1.0, 0.5, far);
  line *= 0.7 + 0.6 * nL.b;                                         /* pressure: the hand presses harder in places */
  /* coloured pencil: a darker tint of the local hue (blue on blue, red-brown on rose, ochre on honey), a touch of sepia */
  vec3 lc = mix(c * c * 0.55, uSepia, 0.22);
  lc = clamp(mix(vec3(luma(lc)), lc, 1.35), 0.0, 1.0);
#if HATCH
  /* light hatching in the deepest shadows only */
  float dark = smoothstep(0.42, 0.16, l);
  float hp = dot(css, vec2(0.74, 0.67)) / 4.2 + grain * 0.9;
  float stripe = smoothstep(0.62, 0.92, sin(hp * 6.2831853) * 0.5 + 0.5);
  line = max(line, stripe * dark * uHatch * (0.4 + 0.6 * grain));
#endif
#if DBG == 3
  col = mix(paperC, lc, clamp(line * uLine, 0.0, 0.92));
#elif DBG == 4
  col = paperC;
#else
  col = mix(col, lc, clamp(line * uLine, 0.0, 0.92));
#endif
  /* deckled border: the wash stops short of the frame edge on an irregular line, a faint pigment rim along it */
  float ed = min(min(css.x, cssRes.x - css.x), min(css.y, cssRes.y - css.y));
  float thr = uDeckle * (0.45 + 1.1 * nL.a) + (h - 0.5) * 2.2;
  float m = smoothstep(thr - 1.5, thr + 2.5, ed);
  float rim = 1.0 - abs(m - 0.5) * 2.0;
  col *= 1.0 - 0.07 * rim * (1.0 - l * 0.5);
  col = mix(paperC, col, uDeckle > 0.0 ? m : 1.0);
  gl_FragColor = vec4(col, 1.0);
}`;

/* ------------------------------------------------------------------ tiers */
/* low (phones): the paint works at about one paint px per CSS px (half the buffer at dpr 2, two thirds at dpr 1.5), with
   the detail restore (shelf legibility) and the supersampled crease detector (no stair-steps on rims) */
const TIERS = {
  high: { R: 4, scale: (dpr) => clamp(1.0 / dpr, 0.5, 1), hatch: 1, emboss: 1, lumaLines: 1, detail: 1, ss: 0, stroke2: 1, glow5: 1 },
  low: { R: 3, scale: (dpr) => clamp(1.0 / dpr, 0.5, 0.7), hatch: 0, emboss: 0, lumaLines: 1, detail: 1, ss: 1, stroke2: 0, glow5: 0 },
};
const PAINT_PX_MAX = 1.3e6;
const DEBUG_MODES = { off: 0, final: 0, raw: 1, kuwa: 2, lines: 3, paper: 4 };

/* default look (tuned in _paint.html against the owner's watercolour café + coloured-pencil portrait; v3: deeper value
   structure — less lift, fewer highlights pulled to paper — so the beige / rose-gold façade and the lit windows read) */
export const LOOK = {
  exposure: 1.0, sat: 0.92, contrast: 0.94, lift: 0.2, hi: 0.15, bands: 6, bandAmt: 0.55, glowBleed: 0.7, toe: 0.8,
  shadowTint: '#8E7A92', paper: '#FEFBF5', warm: '#FFFDF8', sepia: '#5B3F35',
  sharp: 420, wobble: 3.6, edge: 3.0, gran: 0.45, turb: 0.7, line: 1.1, deckle: 9, detail: 0.25,
  hatch: 0.5, lineDepth: 1.0, lineCol: 0.95, glowGain: 5, lineW: [1.25, 0.8], dt: [0.03, 0.1], ct: [0.05, 0.16], far: 28,
};
/* presets main.js switches with wc.setPreset(name): 'shelf' at the destination (and the last ~1.2 s of the walk) keeps
   the product surfaces (knit, calico patches, doll costumes) and sharper sector choice; 'default' restores LOOK */
export const LOOK_PRESETS = {
  default: { detail: LOOK.detail, sharp: LOOK.sharp, edge: LOOK.edge },
  shelf: { detail: 0.55, sharp: 900, edge: 2.4 },
};

export function createWatercolor(renderer, opts = {}) {
  let quality = opts.quality === 'low' ? 'low' : 'high';
  let reduceMotion = !!opts.reduceMotion;
  let enabled = opts.enabled !== false;
  let boil = !!opts.boil;                 /* v4: static pencil lines unless asked for */
  let dbg = 0;
  let cssW = 1, cssH = 1, dpr = 1, bw = 1, bh = 1, kw = 1, kh = 1;
  const look = { ...LOOK, ...(opts.look || {}) };

  const gl = renderer.getContext();
  const canHalf = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
  const hdrType = canHalf ? THREE.HalfFloatType : THREE.UnsignedByteType;
  renderer.info.autoReset = false;   /* the frame is several render() calls: count them all (main resets per frame) */

  const depthTex = new THREE.DepthTexture(1, 1, THREE.UnsignedIntType);
  depthTex.minFilter = depthTex.magFilter = THREE.NearestFilter;
  const rtScene = new THREE.WebGLRenderTarget(1, 1, { type: hdrType, depthBuffer: true, stencilBuffer: false, depthTexture: depthTex, samples: 0, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  const rtPrep = new THREE.WebGLRenderTarget(1, 1, { type: THREE.UnsignedByteType, depthBuffer: false, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  const rtPaint = new THREE.WebGLRenderTarget(1, 1, { type: THREE.UnsignedByteType, depthBuffer: false, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  rtScene.texture.name = 'wc-scene'; rtPrep.texture.name = 'wc-prep'; rtPaint.texture.name = 'wc-paint';
  const noise = makeNoiseTexture();

  /* one full-screen triangle */
  const triGeo = new THREE.BufferGeometry();
  triGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  const quad = new THREE.Mesh(triGeo); quad.frustumCulled = false;
  const quadScene = new THREE.Scene(); quadScene.add(quad);
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const passMat = (frag, uniforms) => new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false, toneMapped: false });

  /* palette colours enter the shaders as display (sRGB-encoded) values: the paint works in display space */
  const disp = (hex) => { const n = parseInt(String(hex).replace('#', ''), 16); return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); };
  const U = {
    tScene: { value: rtScene.texture }, tPrep: { value: rtPrep.texture }, tPaint: { value: rtPaint.texture }, tDepth: { value: depthTex }, tNoise: { value: noise },
    uExposure: { value: 1 }, uBands: { value: look.bands }, uBandAmt: { value: look.bandAmt }, uSat: { value: look.sat }, uLift: { value: look.lift }, uHi: { value: look.hi }, uContrast: { value: look.contrast },
    uShadowTint: { value: disp(look.shadowTint) }, uPaper: { value: disp(look.paper) }, uWarm: { value: disp(look.warm) }, uSepia: { value: disp(look.sepia) },
    uTexel: { value: new THREE.Vector2(1, 1) }, uSharp: { value: look.sharp },
    uView: { value: new THREE.Vector4(0, 0, 1, 1) }, uDpr: { value: 1 }, uNF: { value: new THREE.Vector2(0.1, 100) },
    uBoil: { value: new THREE.Vector4(0, 0, 0, 0) },
    uWobble: { value: look.wobble }, uEdge: { value: look.edge }, uGran: { value: look.gran }, uTurb: { value: look.turb }, uLine: { value: look.line },
    uDeckle: { value: look.deckle }, uHatch: { value: look.hatch }, uLineDepth: { value: look.lineDepth }, uLineCol: { value: look.lineCol },
    uDetail: { value: look.detail }, uLineW: { value: new THREE.Vector2(...look.lineW) }, uDT: { value: new THREE.Vector2(...look.dt) }, uCT: { value: new THREE.Vector2(...look.ct) }, uFar: { value: look.far },
    uPaintRes: { value: new THREE.Vector3(1, 1, 0) }, uGlowBleed: { value: look.glowBleed }, uToe: { value: look.toe }, uSS: { value: 0 },
  };
  const prepMat = passMat(PREP_FRAG, U);
  let kuwaMat = null, compMat = null;
  function buildPrograms() {
    const t = TIERS[quality];
    if (kuwaMat) kuwaMat.dispose(); if (compMat) compMat.dispose();
    kuwaMat = passMat(KUWA_FRAG(t.R), U);
    compMat = passMat(COMP_FRAG({ dbg, hatch: t.hatch, emboss: t.emboss, lumaLines: t.lumaLines, detail: t.detail, ss: t.ss, stroke2: t.stroke2, glow5: t.glow5 }), U);
  }
  buildPrograms();

  /* ---- pristine layer: meshes on layer 1 keep their exact pixels; depth-tested against the painted scene ---- */
  const PU = { wcDepth: { value: depthTex }, wcView: U.uView, wcNF: U.uNF, wcOn: { value: 1 }, wcNoise: U.tNoise, wcDeckle: U.uDeckle, wcDpr: U.uDpr };
  const pristineCache = new Map();
  function pristineMaterial(src) {
    if (src.userData && src.userData.wcPristine) return src;
    let m = pristineCache.get(src.uuid);
    if (m) return m;
    if (src.isMeshBasicMaterial) m = src.clone();
    else m = new THREE.MeshBasicMaterial({ map: src.map || null, color: (src.color ? src.color.clone() : new THREE.Color('#ffffff')).multiplyScalar(0.94), transparent: src.transparent, opacity: src.opacity, side: src.side, alphaTest: src.alphaTest });
    m.fog = false; m.toneMapped = false; m.name = (src.name || 'mat') + '+pristine';
    m.userData = { ...src.userData, wcPristine: true, wcSource: src };
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, PU);
      sh.fragmentShader = sh.fragmentShader.replace('void main() {', `uniform sampler2D wcDepth, wcNoise; uniform vec4 wcView; uniform vec2 wcNF; uniform float wcOn, wcDeckle, wcDpr;
float wcLin(float d) { return wcNF.x * wcNF.y / (wcNF.y - d * (wcNF.y - wcNF.x)); }
void main() {
  if (wcOn > 0.5) {
    vec2 wcPx = gl_FragCoord.xy - wcView.xy;
    float sz = wcLin(texture2D(wcDepth, wcPx / wcView.zw).x), fz = wcLin(gl_FragCoord.z);
    if (sz < fz - max(0.006, fz * 0.0025)) discard;   /* something in the painted scene is in front */
    /* the deckled paper border wins: the same torn edge as the composite (no sign / photo pixels on the bare margin) */
    if (wcDeckle > 0.0) {
      vec2 css = wcPx / wcDpr, cssRes = wcView.zw / wcDpr;
      float ed = min(min(css.x, cssRes.x - css.x), min(css.y, cssRes.y - css.y));
      float thr = wcDeckle * (0.45 + 1.1 * texture2D(wcNoise, css / 1500.0 + vec2(0.31, 0.17)).a) + (texture2D(wcNoise, css / 420.0).r - 0.5) * 2.2;
      if (ed < thr + 1.0) discard;
    }
  }`);
    };
    m.customProgramCacheKey = () => 'wc-pristine';
    pristineCache.set(src.uuid, m);
    return m;
  }
  /* glows: additive, toneMapped:false materials (halos, light pools) are added in display space by the plain renderer;
     the paint adds them to linear light before the filmic curve, where the same value reads far weaker. A gain brings
     them back to about the plain look (warm window glows, lamp halos, light pools on the pavement). */
  const GU = { wcGlowGain: { value: enabled ? look.glowGain : 1 } };
  const glowPatched = new WeakSet();
  function patchGlow(m) {
    if (!m || glowPatched.has(m) || m.toneMapped !== false || m.blending !== THREE.AdditiveBlending || (m.userData && m.userData.wcPristine)) return;
    glowPatched.add(m);
    const prev = m.onBeforeCompile, prevKey = m.customProgramCacheKey ? m.customProgramCacheKey.bind(m) : null;
    m.onBeforeCompile = (sh, r) => {
      if (prev) prev.call(m, sh, r);
      /* per material: userData.wcGlowK (0..1, default 1) scales how much of the gain it takes (a builder or the shell can
         calm glows that sit over dark subjects, e.g. fairy lights behind the black-and-white crochet cat) */
      sh.uniforms.wcGlowGain = { get value() { const k = m.userData && m.userData.wcGlowK !== undefined ? m.userData.wcGlowK : 1; return 1 + (GU.wcGlowGain.value - 1) * k; } };
      const f = sh.fragmentShader;
      if (f.includes('#include <dithering_fragment>')) sh.fragmentShader = 'uniform float wcGlowGain;\n' + f.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n\tgl_FragColor.rgb *= wcGlowGain;');
      else { const i = f.lastIndexOf('}'); if (i > 0) sh.fragmentShader = 'uniform float wcGlowGain;\n' + f.slice(0, i) + '\tgl_FragColor.rgb *= wcGlowGain;\n}' + f.slice(i + 1); }
    };
    m.customProgramCacheKey = () => (prevKey ? prevKey() : '') + '|wc-glow';
    m.needsUpdate = true;
  }
  let pristine = [];
  let lastScene = null, lastSceneCount = -1, frameNo = 0;
  function refreshPristine(scene) {
    pristine = [];
    scene.traverse((o) => {
      /* lights see both layers: the pristine pass (camera on layer 1) then collects the same lights as the scene pass, so
         three's light-state hash does not flip 4 -> 0 -> 4 every frame (which re-derived every lit program each frame).
         The pristine materials are MeshBasic (unlit) and the shadow map is not redrawn in that pass. */
      if (o.isLight) o.layers.enable(1);
      if ((o.isMesh || o.isSprite || o.isPoints) && o.material) for (const m of [].concat(o.material)) patchGlow(m);
      if (!o.isMesh || !o.layers.isEnabled(1) || o.layers.isEnabled(0)) return;
      if (Array.isArray(o.material)) o.material = o.material.map(pristineMaterial);
      else o.material = pristineMaterial(o.material);
      pristine.push(o);
    });
    lastScene = scene; lastSceneCount = countNodes(scene);
    return pristine.length;
  }
  function countNodes(scene) { let n = 0; scene.traverse(() => { n++; }); return n; }

  /* ---- sizes ---- */
  function setSize(w, h, pr) {
    cssW = Math.max(1, w); cssH = Math.max(1, h); dpr = pr || renderer.getPixelRatio();
    bw = Math.max(1, Math.floor(cssW * dpr)); bh = Math.max(1, Math.floor(cssH * dpr));
    /* the paint resolution follows the tier, capped at about 1.3 Mpx (large desktops: 1920x1080 paints at 0.79, 2560x1440
       at 0.6; the composite stays at full resolution) */
    const s = Math.min(TIERS[quality].scale(dpr), Math.sqrt(PAINT_PX_MAX / (bw * bh)));
    kw = Math.max(1, Math.round(bw * s)); kh = Math.max(1, Math.round(bh * s));
    rtScene.setSize(bw, bh); rtPrep.setSize(kw, kh); rtPaint.setSize(kw, kh);
    U.uTexel.value.set(1 / kw, 1 / kh); U.uDpr.value = dpr;
    U.uSS.value = TIERS[quality].ss && dpr < 1.75 ? 1 : 0;
    U.uPaintRes.value.set(kw, kh, kw < bw * 0.8 ? 1 : 0);
    U.uView.value.set(0, 0, bw, bh);
  }

  /* ---- draw ---- */
  const prevVP = new THREE.Vector4(), prevSc = new THREE.Vector4(), prevClear = new THREE.Color();
  function pass(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(quadScene, quadCam); }
  function render(scene, camera, t = 0, viewport = null) {
    if (!enabled) {
      const m = camera.layers.mask, g = GU.wcGlowGain.value; camera.layers.enable(1); PU.wcOn.value = 0; GU.wcGlowGain.value = 1;
      renderer.setRenderTarget(null); renderer.render(scene, camera); camera.layers.mask = m; PU.wcOn.value = 1; GU.wcGlowGain.value = g;
      return;
    }
    if (scene !== lastScene || (++frameNo % 90 === 0 && countNodes(scene) !== lastSceneCount)) refreshPristine(scene);
    const autoClear = renderer.autoClear, mask = camera.layers.mask, tm = renderer.toneMapping;
    renderer.getViewport(prevVP); renderer.getScissor(prevSc); const scTest = renderer.getScissorTest();
    /* 0. scene, layer 0 only, linear HDR */
    camera.layers.set(0);
    renderer.setRenderTarget(rtScene); renderer.autoClear = true;
    renderer.render(scene, camera);
    /* uniforms for this frame */
    U.uExposure.value = renderer.toneMappingExposure;
    U.uNF.value.set(camera.near, camera.far);
    const step = boil && !reduceMotion ? Math.floor(t * 4) : 0;   /* line boil (opt-in): about 4 steps a second */
    const r1 = Math.sin(step * 12.9898) * 43758.5453, r2 = Math.sin(step * 78.233) * 12543.21;
    U.uBoil.value.set(step % 97, (step * 7) % 89, r1 - Math.floor(r1), r2 - Math.floor(r2));
    /* 1-2. paint res */
    pass(prepMat, rtPrep);
    pass(kuwaMat, rtPaint);
    /* 3. composite to the canvas (or a viewport of it) */
    renderer.setRenderTarget(null);
    if (viewport) {
      const [x, y, w, h] = viewport;
      renderer.setViewport(x, y, w, h); renderer.setScissor(x, y, w, h); renderer.setScissorTest(true);
      U.uView.value.set(Math.round(x * dpr), Math.round(y * dpr), Math.round(w * dpr), Math.round(h * dpr));   /* GL: lower-left */
    } else U.uView.value.set(0, 0, bw, bh);
    renderer.toneMapping = THREE.NoToneMapping;
    pass(compMat, null);
    /* 4. pristine layer: crisp, unlit, exact colours, on top of the paint (depth tested in the shader) */
    if (pristine.length && dbg === 0) {
      const bg = scene.background, au = renderer.shadowMap.autoUpdate, nu = renderer.shadowMap.needsUpdate;
      scene.background = null; renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = false;
      renderer.autoClear = false; renderer.clearDepth();
      camera.layers.set(1);
      renderer.render(scene, camera);
      scene.background = bg; renderer.shadowMap.autoUpdate = au; renderer.shadowMap.needsUpdate = nu;
    }
    renderer.toneMapping = tm;
    camera.layers.mask = mask; renderer.autoClear = autoClear;
    if (viewport) { renderer.setViewport(prevVP); renderer.setScissor(prevSc); renderer.setScissorTest(scTest); }
  }

  function setQuality(q) {
    q = q === 'low' ? 'low' : 'high';
    if (q === quality) return;
    quality = q; buildPrograms(); setSize(cssW, cssH, dpr);
  }
  /* v4: on/off for the whole chain. Off = one plain render per frame (look=3d); the paint's targets are released */
  function setEnabled(b) {
    b = !!b;
    if (b === enabled) return;
    enabled = b; GU.wcGlowGain.value = b ? look.glowGain : 1;
    if (!b) { rtScene.dispose(); rtPrep.dispose(); rtPaint.dispose(); }
  }
  /* debug('0' | 'off') = plain render (no paint); 'raw' | 'kuwa' | 'lines' | 'paper' = one stage; 'final' = normal */
  function debug(mode) {
    if (mode === 0 || mode === '0' || mode === 'off' || mode === false) { setEnabled(false); return; }
    setEnabled(true);
    const m = DEBUG_MODES[mode] ?? 0;
    if (m === dbg) return; dbg = m; buildPrograms();
  }
  function setLook(o = {}) {
    Object.assign(look, o);
    const set = { sat: 'uSat', lift: 'uLift', hi: 'uHi', contrast: 'uContrast', sharp: 'uSharp', wobble: 'uWobble', edge: 'uEdge', gran: 'uGran', turb: 'uTurb', line: 'uLine', deckle: 'uDeckle', hatch: 'uHatch', lineDepth: 'uLineDepth', lineCol: 'uLineCol', far: 'uFar', detail: 'uDetail', bands: 'uBands', bandAmt: 'uBandAmt', glowBleed: 'uGlowBleed', toe: 'uToe' };
    for (const k in set) if (k in o) U[set[k]].value = o[k];
    if ('glowGain' in o && enabled) GU.wcGlowGain.value = o.glowGain;
    for (const k of ['shadowTint', 'paper', 'warm', 'sepia']) if (k in o) U['u' + k[0].toUpperCase() + k.slice(1)].value.copy(disp(o[k]));
    if (o.lineW) U.uLineW.value.set(...o.lineW); if (o.dt) U.uDT.value.set(...o.dt); if (o.ct) U.uCT.value.set(...o.ct);
  }
  /* cost model for the report: passes, texture taps per output pixel, resolution per tier */
  function info() {
    const t = TIERS[quality];
    let disc = 0; for (let j = -t.R; j <= t.R; j++) for (let i = -t.R; i <= t.R; i++) if (i * i + j * j <= t.R * t.R + 1) disc++;
    /* composite: 3 noise + 1 centre depth (zc) + paint (4 when the paint is upsampled with the cubic B-spline) + 5 depth (10
       supersampled, low tier below dpr 1.75) + 5 second stroke (high) + 5 glow bleed (3 on low) + 4 luma-line + 2 pencil
       (+1 emboss, +1 detail) */
    const compTaps = 3 + 1 + (U.uPaintRes.value.z > 0.5 ? 4 : 1) + (U.uSS.value > 0.5 ? 10 : 5) + (t.stroke2 ? 5 : 0) + (t.glow5 ? 5 : 3) + (t.lumaLines ? 4 : 0) + 2 + (t.emboss ? 1 : 0) + (t.detail ? 1 : 0);
    const prepTaps = 2, area = (kw * kh) / (bw * bh);
    return {
      enabled, quality, debug: dbg, hdr: canHalf ? 'half-float' : 'rgba8',
      drawingBuffer: [bw, bh], paintRes: [kw, kh], paintScale: +(kw / bw).toFixed(3),
      passes: { scene: `${bw}x${bh} (+depth texture)`, prep: `${kw}x${kh} (${prepTaps} taps)`, kuwahara: `${kw}x${kh} (${disc} taps, R=${t.R})`, composite: `${bw}x${bh} (${compTaps} taps)`, pristine: `${pristine.length} meshes (geometry, depth-tested)` },
      fullResPostPasses: 1 + (kw === bw ? 2 : 0), reducedResPostPasses: kw === bw ? 0 : 2,
      tapsPerScreenPixel: +(compTaps + (prepTaps + disc) * area).toFixed(1),
      tapsPerFrameM: +((compTaps * bw * bh + (prepTaps + disc) * kw * kh) / 1e6).toFixed(2),
      pristine: pristine.map((m) => m.name || m.parent?.name || 'mesh'),
    };
  }
  function dispose() {
    rtScene.dispose(); rtPrep.dispose(); rtPaint.dispose(); depthTex.dispose(); triGeo.dispose();
    prepMat.dispose(); if (kuwaMat) kuwaMat.dispose(); if (compMat) compMat.dispose();
    for (const m of pristineCache.values()) m.dispose();
  }
  void gl;
  /* named looks (LOOK_PRESETS): 'shelf' at the destination, 'default' elsewhere; base values follow opts.look / ?look */
  const base = { ...look };
  function setPreset(name) {
    const p = LOOK_PRESETS[name] || LOOK_PRESETS.default;
    const o = {}; for (const k in p) o[k] = name === 'default' || !LOOK_PRESETS[name] ? base[k] : p[k];
    setLook(o);
  }
  return {
    render, setSize, setQuality, debug, setLook, setPreset, refreshPristine, info, dispose,
    setReduceMotion(b) { reduceMotion = !!b; },
    setBoil(b) { boil = !!b; },
    setEnabled,
    get enabled() { return enabled; }, get boil() { return boil; }, get quality() { return quality; }, get look() { return { ...look }; },
    targets: { scene: rtScene, prep: rtPrep, paint: rtPaint, depth: depthTex },
  };
}
