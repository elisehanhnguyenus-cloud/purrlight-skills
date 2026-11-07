/* Haven 3D — STUB library (PREVIEW 06/11). A small stand-in for textures.js + props.js so the shell and camera can be
   tested before (or without) the real library: ?stub=lib or ?stub=1. Same API as the contract, deliberately simple
   (flat canvases, rounded boxes). Every placeholder prop has its origin at the bottom centre and faces +Z. */

import { RoundedBoxGeometry } from '../vendor/RoundedBoxGeometry.js';

const LOGO_URL = new URL('../../site/assets/brand/logo-flat.png', import.meta.url).href;
const MERLIN_URL = new URL('../assets/merlin-table-560.webp', import.meta.url).href;

const HEX = {
  cream: '#FBF6EE', ivory: '#FFFBF4', oat: '#E9DCCB', do: '#F1E6D2', blush: '#EFC5B9', roseGold: '#C9937E',
  sage: '#A9BCA0', sageDark: '#7F9A7A', sageLight: '#C5D3B8', ink: '#4A423B', cocoa: '#5A4636', berry: '#B42249',
  peach: '#E8A87C', plaster: '#F4EBDD', slate: '#A8968C', stone: '#E4DBCF', terracotta: '#C98B6E', wood: '#D9C3A5',
};

function loadImage(url) {
  return new Promise((res) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = () => res(null); i.src = url; });
}

export function makeTextures(THREE, renderer) {
  const cache = new Map();
  const aniso = Math.min(8, renderer && renderer.capabilities ? renderer.capabilities.getMaxAnisotropy() : 1);
  const once = (key, make) => { if (!cache.has(key)) cache.set(key, make()); return cache.get(key); };
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function tex(c, { srgb = true, repeat = false } = {}) {
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    t.anisotropy = aniso;
    return t;
  }
  function flat(hex, lines) {
    const c = canvas(64, 64), g = c.getContext('2d');
    g.fillStyle = hex; g.fillRect(0, 0, 64, 64);
    if (lines) { g.strokeStyle = 'rgba(0,0,0,.06)'; g.lineWidth = 2; for (let y = 8; y < 64; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(64, y); g.stroke(); } }
    return tex(c, { repeat: true });
  }

  /* the sign: ivory board, rose double frame, the real logo (drawn when it has loaded) */
  const signC = canvas(1024, 340);
  let logoImg = null;
  function drawSign() {
    const g = signC.getContext('2d');
    g.fillStyle = '#FFFBF4'; g.fillRect(0, 0, 1024, 340);
    g.strokeStyle = '#C9937E'; g.lineWidth = 10; g.strokeRect(14, 14, 996, 312);
    g.lineWidth = 3; g.strokeRect(34, 34, 956, 272);
    if (logoImg) { const w = 1024 * 0.8, h = w * 119 / 360; g.drawImage(logoImg, (1024 - w) / 2, (340 - h) / 2, w, h); }
  }
  drawSign();
  const signTex = tex(signC);

  const coverC = canvas(1024, 1024);
  function drawCover() {
    const g = coverC.getContext('2d');
    g.fillStyle = '#E9DCCB'; g.fillRect(0, 0, 1024, 1024);
    g.strokeStyle = 'rgba(90,70,54,.08)'; g.lineWidth = 2;
    for (let i = 0; i < 1024; i += 6) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 1024); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(1024, i); g.stroke(); }
    g.setLineDash([14, 10]); g.strokeStyle = '#C9937E'; g.lineWidth = 6; g.strokeRect(70, 70, 884, 884); g.setLineDash([]);
    g.fillStyle = '#A86F5B'; g.textAlign = 'center'; g.font = '600 86px Fraunces, Georgia, serif';
    g.fillText("Merlin's", 512, 330); g.fillText('Purrfect Haven', 512, 440);
    g.fillStyle = '#EFC5B9'; g.beginPath(); g.arc(640, 720, 80, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#C9937E'; g.beginPath(); g.ellipse(420, 740, 110, 80, 0, 0, Math.PI * 2); g.fill();
  }
  drawCover();
  const coverTex = tex(coverC);

  const T = {
    knit: (hex = '#EFC5B9') => once('knit' + hex, () => flat(hex, true)),
    knitBump: () => once('knitBump', () => flat('#808080')),
    linen: (hex = '#E9DCCB') => once('linen' + hex, () => flat(hex, true)),
    doPaper: () => once('do', () => flat('#F1E6D2')),
    clapboard: () => once('clap', () => flat('#F3E7D6', true)),
    stone: () => once('stone', () => flat('#E4DBCF')),
    slate: () => once('slate', () => flat('#A8968C', true)),
    wood: (hex = '#D9C3A5') => once('wood' + hex, () => flat(hex, true)),
    floorTiles: () => once('floor', () => flat('#EADFCF')),
    cobbles: () => once('cob', () => flat('#DCCFBE')),
    grass: () => once('grass', () => flat('#B9C9A6')),
    awning: () => once('awning', () => {
      const c = canvas(128, 16), g = c.getContext('2d');
      for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#EFC5B9' : '#FFFBF4'; g.fillRect(i * 16, 0, 16, 16); }
      return tex(c, { repeat: true });
    }),
    wallpaper: () => once('wallpaper', () => flat('#F5ECDF')),
    bookSpines: () => once('spines', () => {
      const c = canvas(256, 256), g = c.getContext('2d'), cols = 8, rows = 4;
      const pal = ['#C9937E', '#A9BCA0', '#EFC5B9', '#E9DCCB', '#7F9A7A', '#E8A87C', '#D9C3A5', '#B49B90'];
      for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
        g.fillStyle = pal[(r * 3 + k) % pal.length]; g.fillRect(k * 32, r * 64, 32, 64);
        g.fillStyle = 'rgba(255,251,244,.7)'; g.fillRect(k * 32 + 4, r * 64 + 10, 24, 3); g.fillRect(k * 32 + 4, r * 64 + 50, 24, 3);
      }
      return { map: tex(c), cols, rows };
    }),
    signFace: () => signTex,
    embroideredCover: () => coverTex,
    merlinPhoto: () => once('merlin', () => { const t = new THREE.TextureLoader().load(MERLIN_URL); t.colorSpace = THREE.SRGBColorSpace; return t; }),
    glow: () => once('glow', () => {
      const c = canvas(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(255,226,190,1)'); gr.addColorStop(0.4, 'rgba(250,200,150,.45)'); gr.addColorStop(1, 'rgba(232,168,124,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tex(c);
    }),
    softShadow: () => once('shadow', () => {
      const c = canvas(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(60,42,30,.55)'); gr.addColorStop(0.55, 'rgba(60,42,30,.22)'); gr.addColorStop(1, 'rgba(60,42,30,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tex(c, { srgb: false });
    }),
    sky: () => once('sky', () => {
      /* bottom of the texture = the horizon (main.js keeps that row at eye level) */
      const c = canvas(4, 512), g = c.getContext('2d'), gr = g.createLinearGradient(0, 512, 0, 0);
      gr.addColorStop(0, '#F6D2B4'); gr.addColorStop(0.12, '#F4D6C0'); gr.addColorStop(0.32, '#EDD9D2');
      gr.addColorStop(0.6, '#DCD6E6'); gr.addColorStop(1, '#C3CBE3');
      g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
      const t = tex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
    }),
    paper: () => once('paper', () => flat('#FBF7EF')),
  };
  T.ready = Promise.all([loadImage(LOGO_URL), document.fonts ? document.fonts.ready : null]).then(([img]) => {
    logoImg = img; drawSign(); signTex.needsUpdate = true; drawCover(); coverTex.needsUpdate = true;
  });
  return T;
}

export function makeProps(THREE, T) {
  const mats = new Map();
  function mat(name) {
    if (mats.has(name)) return mats.get(name);
    let m;
    if (name === 'roseGold') m = new THREE.MeshStandardMaterial({ color: HEX.roseGold, metalness: 0.6, roughness: 0.35 });
    else if (name === 'glass') m = new THREE.MeshStandardMaterial({ color: '#FFF4E6', transparent: true, opacity: 0.18, roughness: 0.08, metalness: 0, depthWrite: false });
    else if (name === 'glowWarm') m = new THREE.MeshStandardMaterial({ color: '#FFE7C9', emissive: HEX.peach, emissiveIntensity: 1.2, roughness: 0.9 });
    else m = new THREE.MeshStandardMaterial({ color: HEX[name] || HEX.cream, roughness: 0.86, metalness: 0 });
    m.name = name; mats.set(name, m); return m;
  }
  const geoCache = new Map();
  function rboxGeo(w, h, d, r) {
    const key = [w, h, d, r].map((v) => v.toFixed(3)).join('|');
    if (!geoCache.has(key)) { const g = new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2) * 0.999); g.translate(0, h / 2, 0); geoCache.set(key, g); }
    return geoCache.get(key);
  }
  function rbox(w, h, d, r = 0.02, m = mat('cream')) {
    const mesh = new THREE.Mesh(rboxGeo(w, h, d, r), typeof m === 'string' ? mat(m) : m);
    mesh.castShadow = true; mesh.receiveShadow = true; return mesh;
  }
  const shadowGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const shadowMats = new Map();
  function softShadow(w = 1, d = 1, opacity = 0.5) {
    const k = opacity.toFixed(2);
    if (!shadowMats.has(k)) shadowMats.set(k, new THREE.MeshBasicMaterial({ map: T.softShadow(), transparent: true, opacity, depthWrite: false, toneMapped: false }));
    const m = new THREE.Mesh(shadowGeo, shadowMats.get(k)); m.scale.set(w, 1, d); m.position.y = 0.002; m.renderOrder = -1; return m;
  }
  function blob(size, color, shape = 'box') {
    const g = new THREE.Group();
    const m = rbox(size * 0.8, size, size * 0.7, size * 0.3, color);
    g.add(m);
    if (shape === 'cat') {
      const head = rbox(size * 0.62, size * 0.5, size * 0.55, size * 0.22, color); head.position.y = size * 0.9; g.add(head);
    }
    return g;
  }
  const anim = (group) => ({ group, update() {} });
  const P = {
    mat, rbox, softShadow,
    setShadows(obj, cast = true, receive = true) { obj.traverse((o) => { if (o.isMesh) { o.castShadow = cast; o.receiveShadow = receive; } }); },
    crochetCat: (o = {}) => blob(o.size || 0.18, o.tuxedo ? 'ink' : 'blush', 'cat'),
    crochetAnimal: (kind, o = {}) => blob(o.size || 0.16, kind === 'sheep' ? 'ivory' : 'oat'),
    crochetDoll: (o = {}) => blob(o.size || 0.24, 'blush'),
    fabricDoll: (o = {}) => blob(o.size || 0.2, 'oat'),
    backpack: (o = {}) => blob(o.size || 0.16, 'blush'),
    keychain: () => { const g = new THREE.Group(); const m = rbox(0.03, 0.05, 0.02, 0.008, 'roseGold'); m.position.y = -0.05; g.add(m); return g; },
    book: (o = {}) => { const g = new THREE.Group(); g.add(rbox(o.d || 0.03, o.h || 0.22, o.w || 0.16, 0.004, 'oat')); return g; },
    bookRow: (count = 10, length = 0.6) => {
      const geo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
      const im = new THREE.InstancedMesh(geo, mat('roseGold'), count);
      const m4 = new THREE.Matrix4(), col = new THREE.Color(), pal = ['#C9937E', '#A9BCA0', '#EFC5B9', '#E9DCCB', '#7F9A7A', '#E8A87C'];
      const step = length / count;
      for (let i = 0; i < count; i++) {
        const h = 0.18 + ((i * 37) % 7) * 0.01;
        m4.makeScale(step * 0.9, h, 0.15).setPosition(-length / 2 + step * (i + 0.5), 0, 0); im.setMatrixAt(i, m4);
        im.setColorAt(i, col.set(pal[i % pal.length]));
      }
      im.material = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85 });
      im.castShadow = im.receiveShadow = true; return im;
    },
    fabricBook: () => {
      const g = new THREE.Group();
      const stand = rbox(0.26, 0.03, 0.12, 0.01, 'roseGold'); g.add(stand);
      const cover = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.04).translate(0, 0.15, 0),
        [mat('oat'), mat('oat'), mat('oat'), mat('oat'), new THREE.MeshStandardMaterial({ map: T.embroideredCover(), roughness: 0.9 }), mat('oat')]);
      cover.position.set(0, 0.03, 0); cover.rotation.x = -0.12; g.add(cover); return g;
    },
    photoFrame: (tex, w = 0.18, h = 0.225) => {
      const g = new THREE.Group();
      const frame = rbox(w + 0.04, h + 0.04, 0.02, 0.008, 'roseGold'); g.add(frame);
      const pic = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
      pic.position.set(0, (h + 0.04) / 2, 0.0115); g.add(pic); return g;
    },
    yarnBall: (o = {}) => { const r = o.r || 0.05; const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), mat(o.hex ? 'blush' : 'blush')); m.position.y = r; const g = new THREE.Group(); g.add(m); return g; },
    basket: () => blob(0.25, 'oat'),
    plant: (kind, h = 0.6) => {
      const g = new THREE.Group(); const pot = rbox(h * 0.4, h * 0.35, h * 0.4, h * 0.06, 'terracotta'); g.add(pot);
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(h * 0.33, 14, 10), mat('sage')); leaf.position.y = h * 0.62; leaf.castShadow = true; g.add(leaf); return g;
    },
    vine: (points = []) => {
      const g = new THREE.Group();
      if (points.length > 1) { const c = new THREE.CatmullRomCurve3(points); g.add(new THREE.Mesh(new THREE.TubeGeometry(c, 24, 0.05, 6), mat('sage'))); }
      return g;
    },
    bistroTable: () => blob(0.7, 'roseGold'), bistroChair: () => blob(0.5, 'roseGold'),
    cup: () => blob(0.06, 'ivory'), teapot: () => blob(0.14, 'ivory'), pastryDome: () => blob(0.2, 'glass'),
    person: () => anim(blob(1.2, 'oat')), dog: () => anim(blob(0.4, 'oat')), maineCoon: () => anim(blob(0.45, 'cocoa', 'cat')),
    dogBowl: () => blob(0.08, 'roseGold'),
    pendantLamp: () => { const g = new THREE.Group(); const s = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 10), mat('glowWarm')); s.position.y = -0.4; g.add(s); return g; },
    wallLamp: () => blob(0.15, 'roseGold'), streetLamp: () => blob(0.3, 'roseGold'),
    parcel: () => blob(0.14, 'do'), easel: () => blob(0.8, 'oat'), paperSheet: () => blob(0.2, 'ivory'),
  };
  return P;
}
