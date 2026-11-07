// Haven 3D — procedural canvas textures (library module).
// Everything here is drawn with Canvas 2D; the only image files used are the real logo and the real Merlin photo.
// API: see CONTRACT.md → `js/textures.js`. Extras are documented at the bottom of makeTextures().

const LOGO_URL = new URL('../../site/assets/brand/logo-flat.png', import.meta.url).href;
const MERLIN_URL = new URL('../assets/merlin-table-560.webp', import.meta.url).href;
const CAVEAT_URL = new URL('../../site/assets/fonts/caveat-normal-400-700-latin.woff2', import.meta.url).href;
const FRAUNCES_URL = new URL('../../site/assets/fonts/fraunces-normal-600-latin.woff2', import.meta.url).href;

export const PALETTE = {
  cream: '#FBF6EE', ivory: '#FFFBF4', oat: '#E9DCCB', do: '#F1E6D2', blush: '#EFC5B9', roseGold: '#C9937E',
  sage: '#A9BCA0', sageDark: '#7F9A7A', sageLight: '#C5D3B8', ink: '#4A423B', cocoa: '#5A4636', berry: '#B42249',
  peach: '#E8A87C', rose: '#C9937E',
};

// ---------- small colour + random helpers (no THREE needed) ----------
function hexToRgb(hex) {
  let h = String(hex).replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r, g, b) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}
/** lighten (amt > 0) or darken (amt < 0) a hex colour; amt in [-1, 1] */
export function shade(hex, amt) {
  const [r, g, b] = hexToRgb(hex);
  if (amt >= 0) return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
  return rgbToHex(r * (1 + amt), g * (1 + amt), b * (1 + amt));
}
export function mixHex(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}
function rgba(hex, a) { const [r, g, b] = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; }
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const normHex = (hex) => rgbToHex(...hexToRgb(hex));

export function makeTextures(THREE, renderer) {
  const maxAniso = Math.min(8, (renderer && renderer.capabilities && renderer.capabilities.getMaxAnisotropy) ? renderer.capabilities.getMaxAnisotropy() : 4);
  const cache = new Map();
  const memo = (key, fn) => { if (!cache.has(key)) cache.set(key, fn()); return cache.get(key); };
  const redrawers = []; // functions re-run once fonts/images are in

  const assets = { logo: null, fontsOk: false, fontFamily: 'cursive', serifFamily: 'Georgia, serif' };

  function cv(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true });
    return [c, g];
  }
  function wrapTex(c, { srgb = true, repeat = true } = {}) {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    if (repeat) { t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping; }
    else { t.wrapS = THREE.ClampToEdgeWrapping; t.wrapT = THREE.ClampToEdgeWrapping; }
    t.anisotropy = maxAniso;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    return t;
  }
  // draw something that may cross the tile edge, wrapped on all sides
  function tiled(W, H, x, y, r, fn) {
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const xx = x + dx * W, yy = y + dy * H;
      if (xx + r < 0 || xx - r > W || yy + r < 0 || yy - r > H) continue;
      fn(xx, yy);
    }
  }
  function noisePixels(g, w, h, amp, seed, mono = true) {
    const rnd = mulberry32(seed);
    const id = g.getImageData(0, 0, w, h); const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (rnd() - 0.5) * amp;
      if (mono) { d[i] += n; d[i + 1] += n; d[i + 2] += n; }
      else { d[i] += n; d[i + 1] += (rnd() - 0.5) * amp; d[i + 2] += (rnd() - 0.5) * amp; }
    }
    g.putImageData(id, 0, 0);
  }
  // soft low-frequency mottling (tileable): many big faint blobs
  function mottle(g, W, H, count, rMin, rMax, colors, aMin, aMax, seed) {
    const rnd = mulberry32(seed);
    for (let i = 0; i < count; i++) {
      const x = rnd() * W, y = rnd() * H, r = rMin + rnd() * (rMax - rMin);
      const col = colors[Math.floor(rnd() * colors.length)];
      const a = aMin + rnd() * (aMax - aMin);
      tiled(W, H, x, y, r, (xx, yy) => {
        const gr = g.createRadialGradient(xx, yy, 0, xx, yy, r);
        gr.addColorStop(0, rgba(col, a)); gr.addColorStop(1, rgba(col, 0));
        g.fillStyle = gr; g.fillRect(xx - r, yy - r, r * 2, r * 2);
      });
    }
  }
  function heightToNormal(src, strength) {
    const w = src.width, h = src.height;
    const sg = src.getContext('2d');
    const s = sg.getImageData(0, 0, w, h).data;
    const [c, g] = cv(w, h);
    const out = g.createImageData(w, h); const o = out.data;
    const H = (x, y) => s[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const dx = (H(x + 1, y) - H(x - 1, y)) * strength;
      const dy = (H(x, y + 1) - H(x, y - 1)) * strength;
      let nx = -dx, ny = dy, nz = 1;
      const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
      const i = (y * w + x) * 4;
      o[i] = (nx * 0.5 + 0.5) * 255; o[i + 1] = (ny * 0.5 + 0.5) * 255; o[i + 2] = (nz * 0.5 + 0.5) * 255; o[i + 3] = 255;
    }
    g.putImageData(out, 0, 0);
    return c;
  }
  // colourise a greyscale height canvas: dark→light ramp
  function rampFromHeight(src, darkHex, lightHex, gamma = 1, noise = 0, seed = 1) {
    const w = src.width, h = src.height;
    const s = src.getContext('2d').getImageData(0, 0, w, h).data;
    const [c, g] = cv(w, h);
    const out = g.createImageData(w, h); const o = out.data;
    const D = hexToRgb(darkHex), L = hexToRgb(lightHex);
    const rnd = mulberry32(seed);
    for (let i = 0; i < o.length; i += 4) {
      const t = Math.pow(s[i] / 255, gamma);
      const n = noise ? (rnd() - 0.5) * noise : 0;
      o[i] = D[0] + (L[0] - D[0]) * t + n; o[i + 1] = D[1] + (L[1] - D[1]) * t + n; o[i + 2] = D[2] + (L[2] - D[2]) * t + n; o[i + 3] = 255;
    }
    g.putImageData(out, 0, 0);
    return c;
  }

  // =====================================================================================
  // KNIT / CROCHET — single-crochet "V" stitches, 8×8 stitches per tile (256 px)
  // =====================================================================================
  function knitHeightCanvas() {
    return memo('knitHeight', () => {
      const S = 256, N = 8, cell = S / N;
      const [c, g] = cv(S, S);
      g.fillStyle = '#000'; g.fillRect(0, 0, S, S);
      const rnd = mulberry32(77);
      const legs = [];
      for (let row = 0; row < N; row++) {
        const shift = row * (cell / N); // gentle spiral drift, wraps after N rows
        for (let col = 0; col < N; col++) {
          const x0 = col * cell + shift, y0 = row * cell;
          const jx = (rnd() - 0.5) * 1.6, jy = (rnd() - 0.5) * 1.2;
          const bx = x0 + cell * 0.5 + jx, by = y0 + cell * 1.02 + jy; // V point (bottom)
          legs.push([x0 + cell * 0.12 + jx, y0 + cell * 0.06 + jy, bx - 1, by, -1]);
          legs.push([x0 + cell * 0.88 + jx, y0 + cell * 0.06 + jy, bx + 1, by, 1]);
        }
      }
      // layered strokes: wide/dark → narrow/bright gives a rounded yarn profile
      const layers = [[13.5, 96], [11.5, 138], [9.5, 176], [7.5, 210], [5.2, 236], [3, 255]];
      g.lineCap = 'round';
      for (const [lw, v] of layers) {
        g.strokeStyle = `rgb(${v},${v},${v})`; g.lineWidth = lw;
        for (const [x1, y1, x2, y2, side] of legs) {
          tiled(S, S, (x1 + x2) / 2, (y1 + y2) / 2, cell * 1.2, (cx, cy) => {
            const ox = cx - (x1 + x2) / 2, oy = cy - (y1 + y2) / 2;
            g.beginPath();
            g.moveTo(x1 + ox, y1 + oy);
            const mx = (x1 + x2) / 2 + side * 2.2 + ox, my = (y1 + y2) / 2 + oy;
            g.quadraticCurveTo(mx, my, x2 + ox, y2 + oy);
            g.stroke();
          });
        }
      }
      // yarn ply twist: faint dark slashes across each leg
      g.lineWidth = 1.1; g.strokeStyle = 'rgba(0,0,0,0.22)';
      for (const [x1, y1, x2, y2, side] of legs) {
        for (let k = 1; k < 6; k++) {
          const t = k / 6;
          const px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t;
          tiled(S, S, px, py, 8, (xx, yy) => {
            g.beginPath(); g.moveTo(xx - 3.2, yy - 1.4 * side); g.lineTo(xx + 3.2, yy + 1.4 * side); g.stroke();
          });
        }
      }
      noisePixels(g, S, S, 14, 9);
      return c;
    });
  }
  function knit(hex = '#ffffff') {
    const h = normHex(hex);
    return memo('knit:' + h, () => {
      const isWhite = h === '#ffffff';
      const dark = isWhite ? '#a2a2a2' : shade(h, -0.32);
      const light = isWhite ? '#ffffff' : shade(h, 0.07);
      return wrapTex(rampFromHeight(knitHeightCanvas(), dark, light, 0.8, 4, 3));
    });
  }
  function knitBump() { return memo('knitBump', () => wrapTex(knitHeightCanvas(), { srgb: false })); }
  function knitNormal() { return memo('knitNormal', () => wrapTex(heightToNormal(knitHeightCanvas(), 2.2), { srgb: false })); }

  // =====================================================================================
  // FABRICS
  // =====================================================================================
  function linenCanvas(hex, S = 512, seed = 5) {
    const [c, g] = cv(S, S);
    g.fillStyle = hex; g.fillRect(0, 0, S, S);
    const rnd = mulberry32(seed);
    const step = 4;
    // weft (horizontal) threads
    for (let y = 0; y < S; y += step) {
      const v = (rnd() - 0.5) * 0.16;
      g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(60,40,25,${-v})`;
      g.fillRect(0, y, S, step * 0.55);
      g.fillStyle = 'rgba(70,50,30,0.07)';
      g.fillRect(0, y + step * 0.62, S, 1);
    }
    // warp (vertical)
    for (let x = 0; x < S; x += step) {
      const v = (rnd() - 0.5) * 0.12;
      g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(60,40,25,${-v})`;
      g.fillRect(x, 0, step * 0.5, S);
      g.fillStyle = 'rgba(70,50,30,0.06)';
      g.fillRect(x + step * 0.6, 0, 1, S);
    }
    // slubs
    for (let i = 0; i < 70; i++) {
      const horiz = rnd() < 0.6;
      const x = rnd() * S, y = Math.floor(rnd() * S / step) * step + 1, len = 20 + rnd() * 70;
      const a = 0.05 + rnd() * 0.08, light = rnd() < 0.5;
      g.fillStyle = light ? `rgba(255,255,255,${a})` : `rgba(70,50,30,${a})`;
      tiled(S, S, x, y, len, (xx, yy) => {
        if (horiz) g.fillRect(xx - len / 2, yy, len, 2.2); else g.fillRect(yy, xx - len / 2, 2.2, len);
      });
    }
    noisePixels(g, S, S, 10, seed + 1);
    return c;
  }
  function linen(hex = PALETTE.oat) {
    const h = normHex(hex);
    return memo('linen:' + h, () => wrapTex(linenCanvas(h)));
  }
  function doPaperCanvas(base = PALETTE.do, S = 512, seed = 11, fibreAmt = 1) {
    const [c, g] = cv(S, S);
    g.fillStyle = base; g.fillRect(0, 0, S, S);
    mottle(g, S, S, 40, 40, 140, [shade(base, 0.35), shade(base, -0.08)], 0.05, 0.14, seed);
    const rnd = mulberry32(seed + 1);
    g.lineCap = 'round';
    for (let i = 0; i < 520 * fibreAmt; i++) {
      const x = rnd() * S, y = rnd() * S, len = 6 + rnd() * (rnd() < 0.15 ? 60 : 22);
      const ang = rnd() * Math.PI * 2, bend = (rnd() - 0.5) * len * 0.6;
      const light = rnd() < 0.55;
      g.strokeStyle = light ? `rgba(255,252,244,${0.25 + rnd() * 0.35})` : `rgba(150,120,85,${0.06 + rnd() * 0.12})`;
      g.lineWidth = 0.5 + rnd() * 1.1;
      tiled(S, S, x, y, len, (xx, yy) => {
        const ex = xx + Math.cos(ang) * len, ey = yy + Math.sin(ang) * len;
        g.beginPath(); g.moveTo(xx, yy);
        g.quadraticCurveTo((xx + ex) / 2 - Math.sin(ang) * bend, (yy + ey) / 2 + Math.cos(ang) * bend, ex, ey); g.stroke();
      });
    }
    for (let i = 0; i < 90 * fibreAmt; i++) {
      const x = rnd() * S, y = rnd() * S, r = 0.6 + rnd() * 1.4;
      g.fillStyle = `rgba(120,90,60,${0.15 + rnd() * 0.2})`;
      g.beginPath(); g.ellipse(x, y, r, r * (0.4 + rnd() * 0.6), rnd() * 3, 0, Math.PI * 2); g.fill();
    }
    noisePixels(g, S, S, 7, seed + 2);
    return c;
  }
  function doPaper() { return memo('doPaper', () => wrapTex(doPaperCanvas())); }

  // =====================================================================================
  // ARCHITECTURE
  // =====================================================================================
  function clapboard() {
    return memo('clapboard', () => {
      const S = 512, N = 8, bh = S / N;
      const [c, g] = cv(S, S);
      const base = '#F3E8D8';
      const rnd = mulberry32(21);
      for (let i = 0; i < N; i++) {
        const y = i * bh;
        const tone = shade(base, (rnd() - 0.5) * 0.05);
        const gr = g.createLinearGradient(0, y, 0, y + bh);
        gr.addColorStop(0, shade(tone, -0.05));
        gr.addColorStop(0.12, shade(tone, 0.03));
        gr.addColorStop(0.75, tone);
        gr.addColorStop(0.93, shade(tone, -0.04));
        gr.addColorStop(1, shade(tone, -0.1));
        g.fillStyle = gr; g.fillRect(0, y, S, bh);
        // wood grain under the paint
        for (let k = 0; k < 7; k++) {
          const yy = y + 6 + rnd() * (bh - 14);
          g.strokeStyle = `rgba(150,120,90,${0.03 + rnd() * 0.04})`; g.lineWidth = 0.8 + rnd();
          g.beginPath(); g.moveTo(0, yy);
          for (let x = 0; x <= S; x += 32) g.lineTo(x, yy + Math.sin(x / 70 + k + i) * 1.6);
          g.stroke();
        }
        // lap shadow (soft) at the very bottom of each board
        const sh = g.createLinearGradient(0, y + bh - 7, 0, y + bh);
        sh.addColorStop(0, 'rgba(90,65,45,0)'); sh.addColorStop(1, 'rgba(90,65,45,0.28)');
        g.fillStyle = sh; g.fillRect(0, y + bh - 7, S, 7);
        g.fillStyle = 'rgba(255,255,255,0.45)'; g.fillRect(0, y + 1, S, 1.2);
      }
      mottle(g, S, S, 26, 30, 110, ['#ffffff', '#d9c7b0'], 0.04, 0.09, 22);
      noisePixels(g, S, S, 6, 23);
      return wrapTex(c);
    });
  }
  function stone() {
    return memo('stone', () => {
      const S = 512, rows = 4, rh = S / rows;
      const [c, g] = cv(S, S);
      g.fillStyle = '#D9CDBB'; g.fillRect(0, 0, S, S); // mortar
      const rnd = mulberry32(31);
      const m = 5;
      for (let r = 0; r < rows; r++) {
        // block widths summing to S
        const ws = []; let rem = S;
        while (rem > 300) { const w = 140 + Math.floor(rnd() * Math.min(120, rem - 290)); ws.push(w); rem -= w; }
        if (rem > 200) { const w = Math.round(rem / 2); ws.push(w, rem - w); } else ws.push(rem);
        let x = (r % 2) * 90;
        for (const w of ws) {
          const tone = mixHex('#EFE6D8', '#E3D6C3', rnd());
          const y = r * rh;
          tiled(S, S, x + w / 2, y + rh / 2, w, (cx, cy) => {
            const bx = cx - w / 2 + m / 2, by = cy - rh / 2 + m / 2, bw = w - m, bhh = rh - m;
            g.fillStyle = tone; roundRect(g, bx, by, bw, bhh, 6); g.fill();
            const gr = g.createLinearGradient(bx, by, bx, by + bhh);
            gr.addColorStop(0, 'rgba(255,255,255,0.28)'); gr.addColorStop(0.15, 'rgba(255,255,255,0)');
            gr.addColorStop(0.85, 'rgba(110,90,70,0)'); gr.addColorStop(1, 'rgba(110,90,70,0.2)');
            g.fillStyle = gr; roundRect(g, bx, by, bw, bhh, 6); g.fill();
          });
          x += w;
        }
      }
      mottle(g, S, S, 50, 10, 60, ['#ffffff', '#b8a68e'], 0.04, 0.1, 32);
      const rnd2 = mulberry32(33);
      for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(120,100,80,${rnd2() * 0.18})`; g.fillRect(rnd2() * S, rnd2() * S, 1.2, 1.2); }
      noisePixels(g, S, S, 8, 34);
      return wrapTex(c);
    });
  }
  function slate() {
    return memo('slate', () => {
      const S = 512, cols = 10, rows = 14, w = S / cols, eh = S / rows;
      const [c, g] = cv(S, S);
      g.fillStyle = '#8E7C73'; g.fillRect(0, 0, S, S);
      const rnd = mulberry32(41);
      const tones = ['#9C8A80', '#B49B90', '#A89086', '#BCA398', '#A4938A'];
      const tone = []; for (let r = 0; r < rows; r++) { tone.push([]); for (let k = 0; k < cols; k++) tone[r].push(tones[Math.floor(rnd() * tones.length)]); }
      // bottom course first so upper courses overlap their tops; rows −2..rows+1 cover the wrap
      for (let r = rows + 1; r >= -2; r--) {
        const rr = ((r % rows) + rows) % rows;
        const off = (rr % 2) * w / 2;
        for (let k = -1; k <= cols; k++) {
          const x = k * w + off, yT = r * eh - eh * 0.9, yB = r * eh + eh;
          const tn = tone[rr][((k % cols) + cols) % cols];
          if (yB < -2 || yT > S + 2) continue;
          g.fillStyle = 'rgba(60,40,35,0.28)';
          g.beginPath(); g.moveTo(x + 1, yT); g.lineTo(x + w - 1, yT); g.lineTo(x + w - 1, yB - w / 2 + 3);
          g.arc(x + w / 2, yB - w / 2 + 3, w / 2 - 1, 0, Math.PI); g.closePath(); g.fill();
          const gr = g.createLinearGradient(0, yT, 0, yB);
          gr.addColorStop(0, shade(tn, -0.12)); gr.addColorStop(0.6, tn); gr.addColorStop(0.92, shade(tn, 0.1)); gr.addColorStop(1, shade(tn, -0.05));
          g.fillStyle = gr;
          g.beginPath(); g.moveTo(x + 1.5, yT); g.lineTo(x + w - 1.5, yT); g.lineTo(x + w - 1.5, yB - w / 2);
          g.arc(x + w / 2, yB - w / 2, w / 2 - 1.5, 0, Math.PI); g.closePath(); g.fill();
          g.strokeStyle = 'rgba(255,240,230,0.18)'; g.lineWidth = 1.2;
          g.beginPath(); g.arc(x + w / 2, yB - w / 2, w / 2 - 3, 0.15, Math.PI - 0.15); g.stroke();
        }
      }
      noisePixels(g, S, S, 9, 42);
      return wrapTex(c);
    });
  }
  function wood(hex = '#D9C2A3') {
    const h = normHex(hex);
    return memo('wood:' + h, () => {
      const S = 512, N = 6, ph = S / N;
      const [c, g] = cv(S, S);
      const rnd = mulberry32(51 + h.length);
      for (let i = 0; i < N; i++) {
        const y = i * ph;
        const tone = shade(h, (rnd() - 0.5) * 0.1);
        g.fillStyle = tone; g.fillRect(0, y, S, ph);
        for (let k = 0; k < 16; k++) {
          const yy = y + 3 + rnd() * (ph - 6), amp = 1 + rnd() * 3, fr = 60 + rnd() * 120, ph0 = rnd() * 6;
          g.strokeStyle = rnd() < 0.7 ? `rgba(90,60,35,${0.05 + rnd() * 0.08})` : `rgba(255,245,230,${0.08 + rnd() * 0.1})`;
          g.lineWidth = 0.6 + rnd() * 1.6;
          g.beginPath(); g.moveTo(0, yy);
          for (let x = 0; x <= S; x += 16) g.lineTo(x, yy + Math.sin(x / fr * Math.PI * 2 / 2 + ph0) * amp);
          g.stroke();
        }
        if (rnd() < 0.4) {
          const kx = rnd() * S, ky = y + ph * (0.3 + rnd() * 0.4);
          tiled(S, S, kx, ky, 16, (xx, yy) => {
            g.fillStyle = 'rgba(100,70,45,0.25)'; g.beginPath(); g.ellipse(xx, yy, 7, 3.5, 0, 0, Math.PI * 2); g.fill();
            g.strokeStyle = 'rgba(100,70,45,0.12)'; g.lineWidth = 1; g.beginPath(); g.ellipse(xx, yy, 12, 5.5, 0, 0, Math.PI * 2); g.stroke();
          });
        }
        g.fillStyle = 'rgba(70,45,30,0.32)'; g.fillRect(0, y, S, 1.5);
        g.fillStyle = 'rgba(255,250,240,0.25)'; g.fillRect(0, y + 1.5, S, 1);
        const jx = rnd() * S; g.fillStyle = 'rgba(70,45,30,0.3)'; g.fillRect(jx, y, 1.5, ph);
      }
      noisePixels(g, S, S, 7, 52);
      return wrapTex(c);
    });
  }
  function floorTiles() {
    return memo('floorTiles', () => {
      const S = 512, n = 4, t = S / n, cut = t * 0.27, gap = 2.5;
      const [c, g] = cv(S, S);
      g.fillStyle = '#D8C8B4'; g.fillRect(0, 0, S, S); // grout
      const rnd = mulberry32(61);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const x = i * t, y = j * t;
        const tone = mixHex('#F6EEE2', '#EEE2D1', rnd());
        g.fillStyle = tone;
        g.beginPath();
        g.moveTo(x + cut, y + gap); g.lineTo(x + t - cut, y + gap); g.lineTo(x + t - gap, y + cut); g.lineTo(x + t - gap, y + t - cut);
        g.lineTo(x + t - cut, y + t - gap); g.lineTo(x + cut, y + t - gap); g.lineTo(x + gap, y + t - cut); g.lineTo(x + gap, y + cut); g.closePath();
        g.fill();
        const gr = g.createRadialGradient(x + t * 0.4, y + t * 0.35, 4, x + t / 2, y + t / 2, t * 0.75);
        gr.addColorStop(0, 'rgba(255,255,255,0.22)'); gr.addColorStop(1, 'rgba(150,120,90,0.1)');
        g.fillStyle = gr; g.fill();
      }
      // cabochons at the corners (wrap)
      for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
        const x = i * t, y = j * t;
        const col = (i + j) % 2 ? '#DDBFAE' : '#D9C6AE';
        g.fillStyle = col;
        g.beginPath(); g.moveTo(x, y - cut + gap * 1.6); g.lineTo(x + cut - gap * 1.6, y); g.lineTo(x, y + cut - gap * 1.6); g.lineTo(x - cut + gap * 1.6, y); g.closePath(); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.2)';
        g.beginPath(); g.moveTo(x, y - cut + gap * 3); g.lineTo(x + cut * 0.3, y - cut * 0.3); g.lineTo(x, y); g.lineTo(x - cut * 0.3, y - cut * 0.3); g.closePath(); g.fill();
      }
      mottle(g, S, S, 30, 20, 80, ['#ffffff', '#c9b394'], 0.03, 0.08, 62);
      noisePixels(g, S, S, 6, 63);
      return wrapTex(c);
    });
  }
  function cobbles() {
    return memo('cobbles', () => {
      const S = 512;
      const [c, g] = cv(S, S);
      g.fillStyle = '#A99C8A'; g.fillRect(0, 0, S, S);
      const rnd = mulberry32(71);
      const rows = 8, rh = S / rows;
      for (let r = 0; r < rows; r++) {
        let x = (r % 2) * 22; const y = r * rh + rh / 2;
        const cols = 7; const cw = S / cols;
        for (let k = 0; k < cols; k++) {
          const w = cw * (0.82 + rnd() * 0.1), h = rh * (0.78 + rnd() * 0.12);
          const cx = x + k * cw + cw / 2 + (rnd() - 0.5) * 5, cy = y + (rnd() - 0.5) * 4;
          const tone = mixHex('#D8CDBD', '#C7B8A4', rnd());
          tiled(S, S, cx, cy, w, (xx, yy) => {
            g.fillStyle = 'rgba(70,55,40,0.35)'; roundRect(g, xx - w / 2 + 2, yy - h / 2 + 3, w, h, h * 0.42); g.fill();
            g.fillStyle = tone; roundRect(g, xx - w / 2, yy - h / 2, w, h, h * 0.42); g.fill();
            const gr = g.createRadialGradient(xx - w * 0.18, yy - h * 0.22, 2, xx, yy, w * 0.62);
            gr.addColorStop(0, 'rgba(255,255,255,0.32)'); gr.addColorStop(0.6, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(80,60,40,0.18)');
            g.fillStyle = gr; roundRect(g, xx - w / 2, yy - h / 2, w, h, h * 0.42); g.fill();
          });
        }
      }
      noisePixels(g, S, S, 10, 72);
      return wrapTex(c);
    });
  }
  function grass() {
    return memo('grass', () => {
      const S = 512;
      const [c, g] = cv(S, S);
      g.fillStyle = '#A3B796'; g.fillRect(0, 0, S, S);
      mottle(g, S, S, 40, 30, 110, ['#B9C9A8', '#8FA585', '#C5D3B8'], 0.15, 0.35, 81);
      const rnd = mulberry32(82);
      g.lineCap = 'round';
      for (let i = 0; i < 4200; i++) {
        const x = rnd() * S, y = rnd() * S, len = 3 + rnd() * 7, a = -Math.PI / 2 + (rnd() - 0.5) * 0.9;
        const col = ['#8FA585', '#B7C8A7', '#9DB08F', '#C9D6BC', '#7F9A7A'][Math.floor(rnd() * 5)];
        g.strokeStyle = rgba(col, 0.55 + rnd() * 0.4); g.lineWidth = 0.8 + rnd() * 1.1;
        tiled(S, S, x, y, len, (xx, yy) => { g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + Math.cos(a) * len, yy + Math.sin(a) * len); g.stroke(); });
      }
      for (let i = 0; i < 26; i++) { // tiny daisies / clover flowers
        const x = rnd() * S, y = rnd() * S; const col = rnd() < 0.6 ? '#FBF6EE' : '#EFC5B9';
        tiled(S, S, x, y, 4, (xx, yy) => {
          g.fillStyle = rgba(col, 0.9);
          for (let p = 0; p < 5; p++) { const a = p / 5 * Math.PI * 2; g.beginPath(); g.arc(xx + Math.cos(a) * 1.8, yy + Math.sin(a) * 1.8, 1.3, 0, 7); g.fill(); }
          g.fillStyle = '#E8C77E'; g.beginPath(); g.arc(xx, yy, 1, 0, 7); g.fill();
        });
      }
      noisePixels(g, S, S, 8, 83);
      return wrapTex(c);
    });
  }
  function awning() {
    return memo('awning', () => {
      const S = 256, n = 8, w = S / n;
      const [c, g] = cv(S, S);
      for (let i = 0; i < n; i++) {
        g.fillStyle = i % 2 ? '#EFC5B9' : '#FBF6EE';
        g.fillRect(i * w, 0, w, S);
        g.fillStyle = 'rgba(120,80,60,0.08)'; g.fillRect(i * w, 0, 1.2, S);
      }
      const lin = linenCanvas('#ffffff', 256, 91);
      g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.55; g.drawImage(lin, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      return wrapTex(c);
    });
  }
  function wallpaper() {
    return memo('wallpaper', () => {
      const S = 512;
      const c = doPaperCanvas('#F7EFE2', S, 101, 0.6);
      const g = c.getContext('2d');
      const p = S / 4; // lattice pitch
      g.strokeStyle = 'rgba(190,160,130,0.16)'; g.lineWidth = 1.4;
      for (let k = -4; k <= 8; k++) {
        g.beginPath(); g.moveTo(k * p, 0); g.lineTo(k * p + S, S); g.stroke();
        g.beginPath(); g.moveTo(k * p, 0); g.lineTo(k * p - S, S); g.stroke();
      }
      g.fillStyle = 'rgba(201,147,126,0.22)';
      for (let i = 0; i <= 4; i++) for (let j = 0; j <= 4; j++) {
        const x = i * p, y = j * p;
        g.beginPath(); g.arc(x, y, 2.6, 0, 7); g.fill();
        g.beginPath(); g.arc(x + p / 2, y + p / 2, 1.6, 0, 7); g.fill();
      }
      return wrapTex(c);
    });
  }

  // =====================================================================================
  // BOOK SPINES — atlas 8×4 cells of 64×256. Cell rows: top 24 px = page-top strip, rest = spine.
  // =====================================================================================
  function bookSpines() {
    return memo('bookSpines', () => {
      const cols = 8, rows = 4, cw = 64, ch = 256, top = 24;
      const [c, g] = cv(cols * cw, rows * ch);
      const rnd = mulberry32(111);
      const bases = ['#A9BCA0', '#EFC5B9', '#E9DCCB', '#8E7262', '#9FB2C4', '#D9B97A', '#C9937E', '#F3E9DA', '#B7A9C2',
        '#8FA8A4', '#C98B6B', '#6B625C', '#DDB8A8', '#7F9A7A', '#E8D3B0', '#A7869A'];
      const gilt = '#D8B27A';
      let idx = 0;
      for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
        const x = k * cw, y = r * ch;
        const base = bases[(idx * 7 + r) % bases.length]; idx++;
        const dark = shade(base, -0.25), light = shade(base, 0.25);
        const accent = rnd() < 0.5 ? gilt : (rnd() < 0.5 ? '#FBF6EE' : dark);
        // page-top strip: cream pages with cover-coloured frame
        g.fillStyle = base; g.fillRect(x, y, cw, top);
        g.fillStyle = '#F6EEDF'; g.fillRect(x + 5, y + 3, cw - 10, top - 6);
        g.fillStyle = 'rgba(160,130,100,0.25)';
        for (let l = 0; l < 6; l++) g.fillRect(x + 6, y + 5 + l * 2.6, cw - 12, 0.7);
        // spine body with rounded shading
        const sy = y + top, sh = ch - top;
        const gr = g.createLinearGradient(x, 0, x + cw, 0);
        gr.addColorStop(0, shade(base, -0.18)); gr.addColorStop(0.25, shade(base, 0.06)); gr.addColorStop(0.55, base); gr.addColorStop(1, shade(base, -0.2));
        g.fillStyle = gr; g.fillRect(x, sy, cw, sh);
        // cloth texture
        g.fillStyle = 'rgba(255,255,255,0.05)'; for (let l = 0; l < sh; l += 3) g.fillRect(x, sy + l, cw, 1);
        const design = (idx * 5 + r * 3) % 8;
        g.fillStyle = accent; g.strokeStyle = accent;
        const bands = (yy, h) => { g.fillRect(x + 3, yy, cw - 6, h); };
        if (design === 0) { bands(sy + 14, 3); bands(sy + 20, 1.5); bands(sy + sh - 22, 1.5); bands(sy + sh - 17, 3); }
        if (design === 1) { g.fillStyle = light; g.fillRect(x, sy + sh * 0.18, cw, sh * 0.2); g.fillStyle = accent; bands(sy + sh * 0.18, 2); bands(sy + sh * 0.38 - 2, 2); }
        if (design === 2) { for (let d = 0; d < 5; d++) { g.beginPath(); g.arc(x + cw / 2, sy + 30 + d * 13, 3, 0, 7); g.fill(); } bands(sy + sh - 18, 2); }
        if (design === 3) { g.fillStyle = dark; g.fillRect(x, sy + sh - 52, cw, 52); g.fillStyle = accent; bands(sy + sh - 54, 2); heart(g, x + cw / 2, sy + 34, 9); }
        if (design === 4) { g.lineWidth = 2; g.strokeRect(x + 8, sy + 26, cw - 16, sh * 0.28); bands(sy + 12, 2); bands(sy + sh - 14, 2); }
        if (design === 5) { star(g, x + cw / 2, sy + 40, 9, 4); bands(sy + 18, 1.5); bands(sy + sh - 30, 6); }
        if (design === 6) { g.fillStyle = light; for (let d = 0; d < 6; d++) g.fillRect(x, sy + 20 + d * 30, cw, 10); g.fillStyle = accent; paw(g, x + cw / 2, sy + sh - 26, 8); }
        if (design === 7) { g.fillStyle = '#FBF6EE'; roundRect(g, x + 9, sy + 30, cw - 18, 64, 5); g.fill(); g.fillStyle = base; g.beginPath(); g.arc(x + cw / 2, sy + 62, 10, 0, 7); g.fill(); g.fillStyle = accent; bands(sy + sh - 16, 2); }
        // spine hinge shading at both edges
        g.fillStyle = 'rgba(40,25,15,0.18)'; g.fillRect(x, sy, 2, sh); g.fillRect(x + cw - 2, sy, 2, sh);
      }
      noisePixels(g, cols * cw, rows * ch, 6, 112);
      const map = wrapTex(c, { repeat: false });
      return { map, cols, rows, topFrac: top / ch, cellW: cw, cellH: ch };
    });
  }

  // =====================================================================================
  // SIGN FACE — ivory board, double rose frame, the real logo centred at 80% width. Nothing else.
  // =====================================================================================
  function signFace() {
    return memo('signFace', () => {
      const W = 1024, H = 340;
      const [c, g] = cv(W, H);
      const tex = wrapTex(c, { repeat: false });
      tex.anisotropy = maxAniso;
      const draw = () => {
        g.clearRect(0, 0, W, H);
        g.fillStyle = PALETTE.ivory; g.fillRect(0, 0, W, H);
        g.fillStyle = PALETTE.roseGold;
        const ring = (inset, lw) => {
          g.beginPath(); roundRectPath(g, inset, inset, W - inset * 2, H - inset * 2, 14);
          roundRectPath(g, inset + lw, inset + lw, W - (inset + lw) * 2, H - (inset + lw) * 2, Math.max(2, 14 - lw));
          g.fill('evenodd');
        };
        ring(0, 11);     // outer band
        ring(19, 3.5);   // inner fine line
        if (assets.logo) {
          const lw = Math.round(W * 0.8), lh = Math.round(lw * 119 / 360);
          g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
          g.drawImage(assets.logo, Math.round((W - lw) / 2), Math.round((H - lh) / 2), lw, lh);
        }
        tex.needsUpdate = true;
      };
      draw(); redrawers.push(draw);
      return tex;
    });
  }

  // =====================================================================================
  // EMBROIDERED COVER — oat linen, stitched title, outline cat + yarn ball, running-stitch border
  // =====================================================================================
  const THREAD = { cocoa: '#5A4636', rose: '#B86F68', blush: '#E3A99A', sage: '#869E7F', cream: '#FBF6EE' };
  function stitchPath(g, buildPath, color, lw, dash, gap, opts = {}) {
    // raised thread: shadow pass, body pass, sheen pass
    g.save();
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.setLineDash([dash, gap]);
    g.lineDashOffset = opts.offset || 0;
    g.strokeStyle = 'rgba(70,45,30,0.32)'; g.lineWidth = lw + 1.5;
    g.translate(1.6, 2.2); buildPath(g); g.stroke(); g.translate(-1.6, -2.2);
    g.strokeStyle = color; g.lineWidth = lw; buildPath(g); g.stroke();
    g.strokeStyle = 'rgba(255,250,240,0.38)'; g.lineWidth = Math.max(1, lw * 0.32);
    g.translate(-lw * 0.18, -lw * 0.22); buildPath(g); g.stroke();
    g.restore();
  }
  function satinFill(g, W, H, drawShape, color, angle = -1.1, spacing = 4.2, outline = null) {
    const [lc, lg] = cv(W, H);
    lg.fillStyle = color; drawShape(lg, 'fill');
    lg.globalCompositeOperation = 'source-atop';
    // satin stitches: alternating sheen + shadow lines
    lg.save(); lg.translate(W / 2, H / 2); lg.rotate(angle);
    const L = Math.hypot(W, H);
    for (let x = -L; x < L; x += spacing) {
      lg.fillStyle = 'rgba(255,248,238,0.26)'; lg.fillRect(x, -L, spacing * 0.42, L * 2);
      lg.fillStyle = 'rgba(40,20,10,0.22)'; lg.fillRect(x + spacing * 0.72, -L, 0.9, L * 2);
    }
    lg.restore();
    // top-left light, bottom-right shade for a padded look
    const gr = lg.createLinearGradient(0, 0, W * 0.3, H);
    gr.addColorStop(0, 'rgba(255,255,255,0.08)'); gr.addColorStop(1, 'rgba(0,0,0,0.06)');
    lg.fillStyle = gr; lg.fillRect(0, 0, W, H);
    if (outline) {
      lg.globalCompositeOperation = 'source-over';
      lg.save(); lg.setLineDash([7, 2.5]); lg.lineWidth = 2.2; lg.strokeStyle = outline; drawShape(lg, 'stroke'); lg.restore();
    }
    g.save();
    g.shadowColor = 'rgba(60,35,20,0.45)'; g.shadowBlur = 3; g.shadowOffsetX = 1.5; g.shadowOffsetY = 2.5;
    g.drawImage(lc, 0, 0);
    g.restore();
  }
  function embroideredCover() {
    return memo('embroideredCover', () => {
      const S = 1024;
      const [c, g] = cv(S, S);
      const tex = wrapTex(c, { repeat: false });
      const lin = linenCanvas('#E9DCCB', 512, 121);
      const draw = () => {
        g.clearRect(0, 0, S, S);
        g.drawImage(lin, 0, 0, S, S);
        // soft padded edge shading (fabric wrapping round the boards)
        const vg = g.createRadialGradient(S / 2, S / 2, S * 0.38, S / 2, S / 2, S * 0.74);
        vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(90,60,40,0.18)');
        g.fillStyle = vg; g.fillRect(0, 0, S, S);
        // running-stitch border
        stitchPath(g, (q) => { q.beginPath(); roundRectPath(q, 54, 54, S - 108, S - 108, 34); }, THREAD.rose, 5, 16, 11);
        stitchPath(g, (q) => { q.beginPath(); roundRectPath(q, 74, 74, S - 148, S - 148, 22); }, THREAD.blush, 3, 6, 8);
        // corner lazy-daisy flowers
        for (const [fx, fy] of [[120, 120], [S - 120, 120], [120, S - 120], [S - 120, S - 120]]) lazyDaisy(g, fx, fy, 15);
        // title (only once the font is in; before that the cover is still pretty)
        if (assets.fontsOk) {
          const fam = assets.fontFamily;
          const fit = (text, maxW, start) => { let s = start; g.font = `700 ${s}px ${fam}`; while (g.measureText(text).width > maxW && s > 40) { s -= 4; g.font = `700 ${s}px ${fam}`; } return s; };
          const l1 = "Merlin's", l2 = 'Purrfect Haven';
          const s2 = fit(l2, S * 0.74, 150);
          const s1 = Math.min(fit(l1, S * 0.6, 178), s2 * 1.22);
          const drawTitle = (q, mode) => {
            q.textAlign = 'center'; q.textBaseline = 'alphabetic';
            q.font = `700 ${s1}px ${fam}`;
            if (mode === 'fill') q.fillText(l1, S / 2, 290); else q.strokeText(l1, S / 2, 290);
            q.font = `700 ${s2}px ${fam}`;
            if (mode === 'fill') q.fillText(l2, S / 2, 290 + s2 * 0.98); else q.strokeText(l2, S / 2, 290 + s2 * 0.98);
          };
          satinFill(g, S, S, drawTitle, THREAD.cocoa, -1.05, 4.4, shade(THREAD.cocoa, -0.35));
        }
        // stitched outline cat (sitting, three-quarter) + yarn ball
        const catPath = (q) => {
          q.beginPath();
          const ox = 360, oy = 520; // top-left of the cat box (box ~300×360)
          q.moveTo(ox + 112, oy + 104);
          q.lineTo(ox + 96, oy + 36);  // left ear
          q.lineTo(ox + 150, oy + 76);
          q.bezierCurveTo(ox + 168, oy + 70, ox + 190, oy + 70, ox + 208, oy + 76);
          q.lineTo(ox + 262, oy + 36);  // right ear
          q.lineTo(ox + 248, oy + 106);
          q.bezierCurveTo(ox + 278, oy + 150, ox + 262, oy + 206, ox + 214, oy + 222); // cheek right
          q.bezierCurveTo(ox + 262, oy + 252, ox + 286, oy + 316, ox + 270, oy + 382); // body right
          q.bezierCurveTo(ox + 262, oy + 400, ox + 236, oy + 404, ox + 214, oy + 400);
          q.lineTo(ox + 140, oy + 400);
          q.bezierCurveTo(ox + 98, oy + 402, ox + 82, oy + 380, ox + 90, oy + 330); // body left
          q.bezierCurveTo(ox + 96, oy + 280, ox + 116, oy + 246, ox + 146, oy + 222);
          q.bezierCurveTo(ox + 96, oy + 206, ox + 82, oy + 150, ox + 112, oy + 104); // cheek left
          // tail curling round the front
          q.moveTo(ox + 268, oy + 370);
          q.bezierCurveTo(ox + 330, oy + 360, ox + 344, oy + 290, ox + 312, oy + 262);
          // front paws
          q.moveTo(ox + 150, oy + 400); q.bezierCurveTo(ox + 150, oy + 360, ox + 176, oy + 360, ox + 176, oy + 400);
          q.moveTo(ox + 184, oy + 400); q.bezierCurveTo(ox + 184, oy + 360, ox + 210, oy + 360, ox + 210, oy + 400);
        };
        stitchPath(g, catPath, THREAD.rose, 7, 15, 6);
        // face: french-knot eyes, satin nose, whiskers
        const fx = 360, fy = 520;
        for (const ex of [150, 214]) frenchKnot(g, fx + ex, fy + 146, 8, THREAD.cocoa);
        satinFill(g, S, S, (q, mode) => { q.beginPath(); q.moveTo(fx + 172, fy + 166); q.lineTo(fx + 192, fy + 166); q.lineTo(fx + 182, fy + 178); q.closePath(); mode === 'fill' ? q.fill() : q.stroke(); }, THREAD.blush, 0.2, 3);
        stitchPath(g, (q) => {
          q.beginPath();
          q.moveTo(fx + 182, fy + 180); q.quadraticCurveTo(fx + 176, fy + 192, fx + 166, fy + 188);
          q.moveTo(fx + 182, fy + 180); q.quadraticCurveTo(fx + 188, fy + 192, fx + 198, fy + 188);
        }, THREAD.cocoa, 3.2, 40, 1);
        stitchPath(g, (q) => {
          q.beginPath();
          q.moveTo(fx + 130, fy + 172); q.lineTo(fx + 84, fy + 164);
          q.moveTo(fx + 130, fy + 182); q.lineTo(fx + 86, fy + 186);
          q.moveTo(fx + 234, fy + 172); q.lineTo(fx + 280, fy + 164);
          q.moveTo(fx + 234, fy + 182); q.lineTo(fx + 278, fy + 186);
        }, THREAD.rose, 2.6, 12, 5);
        // little heart on the chest
        satinFill(g, S, S, (q, mode) => { q.beginPath(); heartPath(q, fx + 180, fy + 262, 15); mode === 'fill' ? q.fill() : q.stroke(); }, THREAD.blush, 0.6, 3.2);
        // yarn ball (satin with wrap lines) + strand to the paw
        const yx = 735, yy = 840, yr = 62;
        satinFill(g, S, S, (q, mode) => { q.beginPath(); q.arc(yx, yy, yr, 0, Math.PI * 2); mode === 'fill' ? q.fill() : q.stroke(); }, THREAD.blush, 0.9, 4.2, shade(THREAD.rose, -0.1));
        stitchPath(g, (q) => {
          q.beginPath();
          q.arc(yx - 20, yy + 10, yr * 0.86, -1.1, 0.9);
          q.moveTo(yx + yr * 0.75, yy - yr * 0.45); q.quadraticCurveTo(yx - 10, yy - 20, yx - yr * 0.55, yy + yr * 0.7);
          q.moveTo(yx - yr * 0.85, yy - yr * 0.2); q.quadraticCurveTo(yx, yy - 5, yx + yr * 0.5, yy + yr * 0.75);
        }, THREAD.rose, 3.4, 10, 4);
        stitchPath(g, (q) => { q.beginPath(); q.moveTo(yx - yr + 6, yy + 24); q.bezierCurveTo(yx - 130, yy + 80, yx - 210, yy + 40, fx + 200, fy + 404); }, THREAD.rose, 3.4, 10, 7);
        // tiny stitched stars/sparkles near the title
        for (const [sx, sy, sr] of [[190, 330, 13], [S - 190, 250, 11], [S - 220, 560, 9], [250, 610, 8]]) starStitch(g, sx, sy, sr, THREAD.blush);
        tex.needsUpdate = true;
      };
      draw(); redrawers.push(draw);
      return tex;
    });
  }
  function frenchKnot(g, x, y, r, col) {
    g.save();
    g.fillStyle = 'rgba(60,35,20,0.35)'; g.beginPath(); g.arc(x + 1.5, y + 2, r, 0, 7); g.fill();
    const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.35, 1, x, y, r);
    gr.addColorStop(0, shade(col, 0.35)); gr.addColorStop(1, col);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, r * 0.55, 3.6, 5.6); g.stroke();
    g.restore();
  }
  function lazyDaisy(g, x, y, r) {
    for (let p = 0; p < 5; p++) {
      const a = p / 5 * Math.PI * 2 - Math.PI / 2;
      stitchPath(g, (q) => { q.beginPath(); q.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.85, r * 0.42, a, 0, Math.PI * 2); }, THREAD.blush, 3, 200, 1);
    }
    frenchKnot(g, x, y, 5, '#D9B97A');
    for (const a of [0.9, 2.3]) {
      stitchPath(g, (q) => { q.beginPath(); q.ellipse(x + Math.cos(a) * r * 2.1, y + Math.sin(a) * r * 2.1, r * 0.8, r * 0.36, a, 0, Math.PI * 2); }, THREAD.sage, 3, 200, 1);
    }
  }
  function starStitch(g, x, y, r, col) {
    stitchPath(g, (q) => { q.beginPath(); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 4; q.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r); q.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } }, col, 2.6, 60, 1);
  }

  // =====================================================================================
  // PHOTO, LIGHT, SKY, PAPER
  // =====================================================================================
  let merlinTex = null; let merlinPromise = null;
  function merlinPhoto() {
    if (merlinTex) return merlinTex;
    merlinTex = new THREE.Texture();
    merlinTex.colorSpace = THREE.SRGBColorSpace;
    merlinTex.anisotropy = maxAniso;
    merlinTex.userData.aspect = 560 / 700;
    merlinPromise = new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { merlinTex.image = img; merlinTex.needsUpdate = true; resolve(true); };
      img.onerror = () => resolve(false);
      img.src = MERLIN_URL;
    });
    return merlinTex;
  }
  function glow() {
    return memo('glow', () => {
      const S = 256; const [c, g] = cv(S, S);
      const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      gr.addColorStop(0, 'rgba(255,236,205,1)'); gr.addColorStop(0.18, 'rgba(255,214,168,0.75)');
      gr.addColorStop(0.45, 'rgba(240,170,120,0.28)'); gr.addColorStop(0.75, 'rgba(232,168,124,0.07)'); gr.addColorStop(1, 'rgba(232,168,124,0)');
      g.fillStyle = gr; g.fillRect(0, 0, S, S);
      return wrapTex(c, { repeat: false });
    });
  }
  function softShadow() {
    return memo('softShadow', () => {
      const S = 128; const [c, g] = cv(S, S);
      const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      // gaussian-ish falloff
      for (let i = 0; i <= 10; i++) { const t = i / 10; gr.addColorStop(t, `rgba(60,40,30,${(Math.exp(-t * t * 4.2) - Math.exp(-4.2)) / (1 - Math.exp(-4.2))})`); }
      g.fillStyle = gr; g.fillRect(0, 0, S, S);
      return wrapTex(c, { repeat: false });
    });
  }
  function sky() {
    return memo('sky', () => {
      const W = 16, H = 512; const [c, g] = cv(W, H);
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, '#A9B6D6');
      gr.addColorStop(0.28, '#C7C6DE');
      gr.addColorStop(0.48, '#EBD2D3');
      gr.addColorStop(0.64, '#F8D3BA');
      gr.addColorStop(0.76, '#F9C9A0');
      gr.addColorStop(0.86, '#F7D8BC');
      gr.addColorStop(1, '#F3E3D2');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      noisePixels(g, W, H, 3, 131, false); // dither, no banding
      const t = wrapTex(c, { repeat: false });
      t.generateMipmaps = false; t.minFilter = THREE.LinearFilter;
      return t;
    });
  }
  function paper() {
    return memo('paper', () => {
      const S = 512;
      const [c, g] = cv(S, S);
      g.fillStyle = '#FBF7EF'; g.fillRect(0, 0, S, S);
      mottle(g, S, S, 20, 40, 120, ['#ffffff', '#efe4d2'], 0.1, 0.2, 141);
      const rnd = mulberry32(142);
      for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(150,130,110,${rnd() * 0.07})`; g.fillRect(rnd() * S, rnd() * S, 1, 1); }
      // watercolour washes
      wash(g, 180, 300, 95, 'rgba(232,180,166,0.5)', 143);
      wash(g, 395, 175, 52, 'rgba(169,188,160,0.32)', 144);
      wash(g, 390, 385, 45, 'rgba(232,168,124,0.25)', 145);
      // pencil doodles
      const P = (fn, w = 2.2, a = 0.7) => pencil(g, fn, w, a, rnd);
      // sitting cat
      P((q) => {
        q.moveTo(130, 230); q.lineTo(122, 178); q.lineTo(156, 206); q.quadraticCurveTo(180, 198, 204, 206);
        q.lineTo(238, 178); q.lineTo(230, 232); q.bezierCurveTo(250, 270, 226, 300, 205, 306);
        q.bezierCurveTo(250, 330, 262, 390, 246, 412); q.lineTo(118, 412); q.bezierCurveTo(100, 380, 112, 330, 156, 306);
        q.bezierCurveTo(130, 300, 108, 270, 130, 230);
        q.moveTo(246, 404); q.bezierCurveTo(300, 404, 310, 350, 282, 330);
      }, 2.4, 0.75);
      P((q) => { q.moveTo(160, 252); q.arc(158, 252, 3, 0, 7); q.moveTo(206, 252); q.arc(204, 252, 3, 0, 7); q.moveTo(176, 270); q.lineTo(186, 270); q.lineTo(181, 276); q.closePath(); }, 2, 0.8);
      P((q) => { q.moveTo(140, 266); q.lineTo(104, 260); q.moveTo(140, 274); q.lineTo(106, 280); q.moveTo(222, 266); q.lineTo(258, 260); q.moveTo(222, 274); q.lineTo(256, 280); }, 1.2, 0.5);
      // yarn ball spiral + strand
      P((q) => { for (let a = 0; a < Math.PI * 7; a += 0.2) { const r = 6 + a * 4; const x = 395 + Math.cos(a) * r * 0.9, y = 385 + Math.sin(a) * r * 0.9; a === 0 ? q.moveTo(x, y) : q.lineTo(x, y); } }, 1.6, 0.6);
      P((q) => { q.moveTo(360, 410); q.bezierCurveTo(320, 450, 290, 420, 252, 440); }, 1.6, 0.6);
      // leaves sprig
      P((q) => { q.moveTo(395, 230); q.quadraticCurveTo(400, 170, 420, 120); for (let k = 0; k < 5; k++) { const y = 210 - k * 20, x = 398 + k * 4; q.moveTo(x, y); q.quadraticCurveTo(x - 26, y - 6, x - 30, y - 22); q.quadraticCurveTo(x - 10, y - 18, x, y); q.moveTo(x + 2, y - 8); q.quadraticCurveTo(x + 26, y - 14, x + 30, y - 30); q.quadraticCurveTo(x + 10, y - 26, x + 2, y - 8); } }, 1.5, 0.55);
      // stars + hearts
      for (const [x, y, r] of [[70, 80, 12], [460, 60, 9], [300, 90, 7], [470, 470, 10]]) P((q) => starPathOutline(q, x, y, r), 1.4, 0.55);
      P((q) => heartPath(q, 90, 470, 14), 1.6, 0.6);
      P((q) => heartPath(q, 300, 230, 8), 1.4, 0.5);
      // a few construction lines
      P((q) => { q.moveTo(40, 440); q.lineTo(210, 452); q.moveTo(330, 470); q.lineTo(420, 476); }, 0.8, 0.25);
      return wrapTex(c, { repeat: false });
    });
  }
  function wash(g, x, y, r, col, seed) {
    const rnd = mulberry32(seed);
    for (let i = 0; i < 6; i++) {
      g.fillStyle = col; g.globalAlpha = 0.35;
      g.beginPath();
      const n = 14;
      for (let k = 0; k <= n; k++) {
        const a = k / n * Math.PI * 2, rr = r * (0.75 + rnd() * 0.35);
        const px = x + Math.cos(a) * rr + (rnd() - 0.5) * 6, py = y + Math.sin(a) * rr * 0.85;
        k === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
      }
      g.closePath(); g.fill();
    }
    g.globalAlpha = 1;
  }
  function pencil(g, fn, w, a, rnd) {
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
    for (let pass = 0; pass < 3; pass++) {
      g.strokeStyle = `rgba(88,80,74,${Math.min(1, a * (pass === 0 ? 0.95 : 0.4))})`;
      g.lineWidth = w * (pass === 0 ? 1 : 0.6);
      g.save(); g.translate((rnd() - 0.5) * 1.4, (rnd() - 0.5) * 1.4);
      g.beginPath(); fn(g); g.stroke(); g.restore();
    }
    g.restore();
  }

  // =====================================================================================
  // EXTRAS — used by props.js (and free for anyone)
  // =====================================================================================
  // white-ish greyscale maps meant to be multiplied by vertex colours / material colour
  function grain() {
    return memo('grain', () => {
      const S = 256; const [c, g] = cv(S, S);
      g.fillStyle = '#f4f4f4'; g.fillRect(0, 0, S, S);
      mottle(g, S, S, 60, 8, 40, ['#ffffff', '#d8d8d8'], 0.12, 0.3, 151);
      noisePixels(g, S, S, 16, 152);
      return wrapTex(c);
    });
  }
  function fur() {
    return memo('fur', () => {
      const S = 256; const [c, g] = cv(S, S);
      g.fillStyle = '#ececec'; g.fillRect(0, 0, S, S);
      const rnd = mulberry32(161);
      g.lineCap = 'round';
      for (let i = 0; i < 2600; i++) {
        const x = rnd() * S, y = rnd() * S, len = 4 + rnd() * 9, a = Math.PI / 2 + (rnd() - 0.5) * 0.7;
        const v = rnd() < 0.5 ? 255 : 175 + rnd() * 40;
        g.strokeStyle = `rgba(${v},${v},${v},${0.35 + rnd() * 0.4})`; g.lineWidth = 0.7 + rnd() * 1.2;
        tiled(S, S, x, y, len, (xx, yy) => { g.beginPath(); g.moveTo(xx, yy); g.quadraticCurveTo(xx + 2, yy + len / 2, xx + Math.cos(a) * len, yy + Math.sin(a) * len); g.stroke(); });
      }
      return wrapTex(c);
    });
  }
  // brown tabby fur: vertical mackerel stripes (run pole→pole on a sphere), soft fur strokes
  function tabby() {
    return memo('tabby', () => {
      const S = 512; const [c, g] = cv(S, S);
      const base = '#94785E', dark = '#55402F', light = '#C4A88A';
      g.fillStyle = base; g.fillRect(0, 0, S, S);
      mottle(g, S, S, 50, 20, 90, [light, shade(base, -0.1), '#A88C70'], 0.18, 0.35, 171);
      const rnd = mulberry32(172);
      const N = 7;
      // soft mackerel bands: wavy, varying width, broken into dashes
      for (let k = 0; k < N; k++) {
        const x0 = (k + 0.5) * S / N + (rnd() - 0.5) * 16, w = 14 + rnd() * 12, ph = rnd() * 6;
        for (let y = -10; y < S + 10; y += 3) {
          if (Math.sin(y / 23 + ph * 3) > 0.72) continue; // breaks
          const xc = x0 + Math.sin(y / 52 + ph) * 13 + Math.sin(y / 19 + ph * 2) * 3;
          const ww = w * (0.65 + 0.35 * Math.sin(y / 37 + ph));
          tiled(S, S, xc, y, ww, (px, py) => {
            const gr = g.createRadialGradient(px, py, 0, px, py, ww * 0.62);
            gr.addColorStop(0, rgba(dark, 0.22)); gr.addColorStop(0.6, rgba(dark, 0.12)); gr.addColorStop(1, rgba(dark, 0));
            g.fillStyle = gr; g.fillRect(px - ww, py - ww, ww * 2, ww * 2);
          });
        }
      }
      g.lineCap = 'round';
      for (let i = 0; i < 5200; i++) { // fur strokes over everything
        const x = rnd() * S, y = rnd() * S, len = 4 + rnd() * 9;
        const r0 = rnd(); const col = r0 < 0.45 ? light : (r0 < 0.75 ? dark : '#E2CDB2');
        g.strokeStyle = rgba(col, 0.1 + rnd() * 0.2); g.lineWidth = 0.7 + rnd() * 1.1;
        tiled(S, S, x, y, len, (px, py) => { g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px + 1.5, py + len * 0.5, px + (rnd() - 0.5) * 3, py + len); g.stroke(); });
      }
      noisePixels(g, S, S, 6, 173);
      return wrapTex(c);
    });
  }
  function weave() { // wicker / basket weave, greyscale-ish warm
    return memo('weave', () => {
      const S = 256, n = 8, s = S / n; const [c, g] = cv(S, S);
      g.fillStyle = '#9a8670'; g.fillRect(0, 0, S, S);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const x = i * s, y = j * s, horiz = (i + j) % 2 === 0;
        for (let k = 0; k < 3; k++) {
          const gr = horiz ? g.createLinearGradient(0, y + k * s / 3, 0, y + (k + 1) * s / 3) : g.createLinearGradient(x + k * s / 3, 0, x + (k + 1) * s / 3, 0);
          gr.addColorStop(0, '#b9a58c'); gr.addColorStop(0.5, '#f3e7d6'); gr.addColorStop(1, '#b09a80');
          g.fillStyle = gr;
          if (horiz) roundRect(g, x + 1, y + k * s / 3 + 0.6, s - 2, s / 3 - 1.2, 3); else roundRect(g, x + k * s / 3 + 0.6, y + 1, s / 3 - 1.2, s - 2, 3);
          g.fill();
        }
      }
      noisePixels(g, S, S, 10, 181);
      return wrapTex(c);
    });
  }
  function yarnWound() { // parallel strands in crossing patches, for yarn balls (no clip(): masked offscreen patches)
    return memo('yarnWound', () => {
      const S = 256; const [c, g] = cv(S, S);
      g.fillStyle = '#bcbcbc'; g.fillRect(0, 0, S, S);
      const rnd = mulberry32(191);
      const strands = (q, ang, W, H) => {
        q.save(); q.lineCap = 'round'; q.translate(W / 2, H / 2); q.rotate(ang); q.translate(-W / 2, -H / 2);
        const L = Math.max(W, H);
        for (let y = -L; y < L * 2; y += 5.5) {
          for (const [lw, v] of [[5, 182], [3.4, 222], [1.5, 252]]) {
            q.strokeStyle = `rgb(${v},${v},${v})`; q.lineWidth = lw;
            q.beginPath(); q.moveTo(-L, y); q.bezierCurveTo(0, y + 6, L, y - 6, L * 2, y); q.stroke();
          }
        }
        q.restore();
      };
      strands(g, 0.35, S, S);
      const [pc, pg] = cv(200, 200);
      for (let i = 0; i < 7; i++) {
        const x = rnd() * S, y = rnd() * S, r = 40 + rnd() * 45, ang = (rnd() - 0.5) * 2.6;
        const sa = ang + Math.PI / 2 * (rnd() < 0.5 ? 1 : -1) * 0.8;
        // build the patch: strands, darkened, masked to an ellipse
        pg.globalCompositeOperation = 'source-over';
        pg.clearRect(0, 0, 200, 200);
        pg.fillStyle = '#8a8a8a'; pg.fillRect(0, 0, 200, 200);
        strands(pg, sa, 200, 200);
        pg.fillStyle = 'rgba(0,0,0,0.22)'; pg.fillRect(0, 0, 200, 200);
        pg.globalCompositeOperation = 'destination-in';
        pg.fillStyle = '#000'; pg.beginPath(); pg.ellipse(100, 100, r, r * 0.6, ang, 0, Math.PI * 2); pg.fill();
        pg.globalCompositeOperation = 'source-over';
        tiled(S, S, x, y, r, (xx, yy) => {
          g.drawImage(pc, xx - 100, yy - 100);
          g.strokeStyle = 'rgba(0,0,0,0.16)'; g.lineWidth = 2; g.beginPath(); g.ellipse(xx, yy, r, r * 0.6, ang, 0, Math.PI * 2); g.stroke();
        });
      }
      noisePixels(g, S, S, 10, 192);
      return wrapTex(c);
    });
  }
  function boucle() { // loopy fleece for the sheep (greyscale)
    return memo('boucle', () => {
      const S = 256; const [c, g] = cv(S, S);
      g.fillStyle = '#a8a8a8'; g.fillRect(0, 0, S, S);
      const rnd = mulberry32(201);
      for (let i = 0; i < 520; i++) {
        const x = rnd() * S, y = rnd() * S, r = 4 + rnd() * 5;
        tiled(S, S, x, y, r + 3, (xx, yy) => {
          const gr = g.createRadialGradient(xx - r * 0.3, yy - r * 0.3, 0.5, xx, yy, r + 2);
          gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.6, '#e6e6e6'); gr.addColorStop(1, 'rgba(150,150,150,0)');
          g.fillStyle = gr; g.beginPath(); g.arc(xx, yy, r + 2, 0, 7); g.fill();
          g.strokeStyle = 'rgba(120,120,120,0.35)'; g.lineWidth = 1; g.beginPath(); g.arc(xx, yy, r * 0.55, rnd() * 6, rnd() * 6 + 3.5); g.stroke();
        });
      }
      return wrapTex(c);
    });
  }
  function boucleNormal() { return memo('boucleNormal', () => { const t = boucle(); return wrapTex(heightToNormal(t.image, 1.6), { srgb: false }); }); }
  function fernFrond() { // alpha leaf texture for fern fronds (white, alpha)
    return memo('fernFrond', () => {
      const W = 256, H = 64; const [c, g] = cv(W, H);
      g.clearRect(0, 0, W, H);
      g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(4, H / 2); g.lineTo(W - 4, H / 2); g.stroke();
      for (let x = 10; x < W - 8; x += 9) {
        const t = x / W, len = (H / 2 - 3) * Math.sin(Math.PI * Math.min(1, t * 1.08)) * (1 - t * 0.35);
        for (const sgn of [-1, 1]) {
          g.beginPath(); g.moveTo(x, H / 2);
          g.quadraticCurveTo(x + 6, H / 2 + sgn * len * 0.5, x + 10, H / 2 + sgn * len);
          g.quadraticCurveTo(x + 3, H / 2 + sgn * len * 0.55, x - 2, H / 2 + sgn * 2);
          g.closePath(); g.fill();
        }
      }
      const t = wrapTex(c, { repeat: false });
      return t;
    });
  }
  function terracotta() {
    return memo('terracotta', () => {
      const S = 256; const [c, g] = cv(S, S);
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, S, S);
      mottle(g, S, S, 50, 10, 50, ['#ffffff', '#d9d2cc'], 0.2, 0.4, 211);
      const rnd = mulberry32(212);
      for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(110,90,80,${rnd() * 0.15})`; g.fillRect(rnd() * S, rnd() * S, 1.5, 1.5); }
      noisePixels(g, S, S, 12, 213);
      return wrapTex(c);
    });
  }

  // =====================================================================================
  // READY — logo, Merlin photo, fonts
  // =====================================================================================
  const logoP = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { assets.logo = img; resolve(true); };
    img.onerror = () => resolve(false);
    img.src = LOGO_URL;
  });
  const fontP = (async () => {
    try {
      if (typeof FontFace === 'undefined' || !document.fonts) return false;
      const cav = new FontFace('HavenCaveat', `url(${CAVEAT_URL}) format('woff2')`, { weight: '400 700', style: 'normal' });
      const fr = new FontFace('HavenFraunces', `url(${FRAUNCES_URL}) format('woff2')`, { weight: '600', style: 'normal' });
      document.fonts.add(cav); document.fonts.add(fr);
      await Promise.all([cav.load(), fr.load().catch(() => null)]);
      assets.fontFamily = "'HavenCaveat', cursive"; assets.serifFamily = "'HavenFraunces', Georgia, serif";
      assets.fontsOk = true;
      return true;
    } catch (e) {
      assets.fontFamily = 'cursive'; assets.fontsOk = true; // still draw the title with a fallback face
      return false;
    }
  })();
  merlinPhoto();
  const ready = Promise.all([logoP, fontP, merlinPromise]).then((res) => {
    for (const fn of redrawers) fn();
    return { logo: res[0], fonts: res[1], merlin: res[2] };
  });

  const T = {
    ready,
    knit, knitBump, knitNormal, linen, doPaper, clapboard, stone, slate, wood, floorTiles, cobbles, grass, awning,
    wallpaper, bookSpines, signFace, embroideredCover, merlinPhoto, glow, softShadow, sky, paper,
    // extras
    grain, fur, tabby, weave, yarnWound, boucle, boucleNormal, fernFrond, terracotta,
    palette: PALETTE, shade, mixHex,
    /** list of [name, texture] for dev swatches */
    _swatches() {
      return [['sign face', signFace()], ['embroidered cover', embroideredCover()], ['knit (blush)', knit('#EFC5B9')], ['knit normal', knitNormal()],
        ['linen', linen()], ['dó paper', doPaper()], ['clapboard', clapboard()], ['stone', stone()], ['slate', slate()], ['wood', wood()],
        ['floor tiles', floorTiles()], ['cobbles', cobbles()], ['grass', grass()], ['awning', awning()], ['wallpaper', wallpaper()],
        ['book spines', bookSpines().map], ['paper', paper()], ['tabby', tabby()], ['glow', glow()], ['soft shadow', softShadow()], ['sky', sky()]];
    },
  };
  return T;
}

// ---------- canvas path helpers ----------
function roundRectPath(g, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
  g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
}
function roundRect(g, x, y, w, h, r) { g.beginPath(); roundRectPath(g, x, y, w, h, r); }
function heartPath(g, x, y, s) {
  g.moveTo(x, y + s * 0.9);
  g.bezierCurveTo(x - s * 1.4, y - s * 0.1, x - s * 0.7, y - s * 1.1, x, y - s * 0.35);
  g.bezierCurveTo(x + s * 0.7, y - s * 1.1, x + s * 1.4, y - s * 0.1, x, y + s * 0.9);
  g.closePath();
}
function heart(g, x, y, s) { g.beginPath(); heartPath(g, x, y, s); g.fill(); }
function star(g, x, y, r, ri) {
  g.beginPath();
  for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? ri : r; k ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  g.closePath(); g.fill();
}
function starPathOutline(g, x, y, r) {
  for (let k = 0; k <= 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r; k ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
}
function paw(g, x, y, s) {
  g.beginPath(); g.ellipse(x, y + s * 0.35, s * 0.62, s * 0.5, 0, 0, 7); g.fill();
  for (const [dx, dy] of [[-0.62, -0.35], [-0.22, -0.72], [0.22, -0.72], [0.62, -0.35]]) { g.beginPath(); g.arc(x + dx * s, y + dy * s, s * 0.22, 0, 7); g.fill(); }
}
export const canvasHelpers = { roundRectPath, roundRect, heartPath, paw };
