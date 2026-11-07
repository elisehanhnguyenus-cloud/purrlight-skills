const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto('http://127.0.0.1:8776/big.html');
  const r = await p.evaluate(async () => {
    const img = new Image(); img.src = 'elise-cat.png?' + Date.now(); await img.decode();
    const W = img.width, H = img.height;
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, W, H).data;
    // stroke colour = median of the most saturated (darkest-green-channel) pixels
    const cand = [];
    for (let i = 0; i < W * H; i++) { const gg = d[i * 4 + 1]; if (gg < 90) cand.push([d[i * 4], d[i * 4 + 1], d[i * 4 + 2]]); }
    const med = (k) => { const a = cand.map(v => v[k]).sort((x, y) => x - y); return a[a.length >> 1]; };
    const P = [med(0), med(1), med(2)];
    let x0 = W, x1 = 0, y0 = H, y1 = 0;
    const A = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) {
      let a = 0; for (let k = 0; k < 3; k++) { const den = 255 - P[k]; if (den > 8) a = Math.max(a, (255 - d[i * 4 + k]) / den); }
      a = Math.min(1, Math.max(0, (a - 0.12) / 0.8)); A[i] = a;
      if (a > 0) { const x = i % W, y = (i / W) | 0; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    }
    const padL = 3, padT = 3, padR = 6, padB = 3;
    const ow = x1 - x0 + 1 + padL + padR, oh = y1 - y0 + 1 + padT + padB;
    const o = document.createElement('canvas'); o.width = ow; o.height = oh; const og = o.getContext('2d'); const od = og.createImageData(ow, oh);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const i = y * W + x, a = A[i]; if (!a) continue; const t = ((y - y0 + padT) * ow + (x - x0 + padL)) * 4;
      if (a >= 1) { od.data[t] = d[i * 4]; od.data[t + 1] = d[i * 4 + 1]; od.data[t + 2] = d[i * 4 + 2]; }
      else { od.data[t] = P[0]; od.data[t + 1] = P[1]; od.data[t + 2] = P[2]; }
      od.data[t + 3] = Math.round(a * 255);
    }
    og.putImageData(od, 0, 0);
    return { P, box: [x0, y0, x1, y1], size: [ow, oh], png: o.toDataURL('image/png') };
  });
  fs.writeFileSync(__dirname + '/logo-cat-elise.png', Buffer.from(r.png.split(',')[1], 'base64'));
  console.log(JSON.stringify({ P: r.P, hex: '#' + r.P.map(v => v.toString(16).padStart(2, '0')).join(''), box: r.box, size: r.size }));
  const q = await b.newPage({ viewport: { width: 760, height: 520 } });
  await q.setContent(`<body style="margin:0;background:#fffbf4;display:flex;gap:24px;align-items:end;padding:16px">
    <img src="http://127.0.0.1:8776/logo-cat-elise.png?${Date.now()}" style="height:480px">
    <img src="http://127.0.0.1:8776/logo-cat-elise.png?${Date.now()}" style="height:160px">
    <div style="background:#B42249;padding:8px"><img src="http://127.0.0.1:8776/logo-cat-elise.png" style="height:48px;display:block"></div>
    <div style="background:#e9dccb;padding:8px"><img src="http://127.0.0.1:8776/logo-cat-elise.png" style="height:32px;display:block"></div></body>`);
  await q.waitForTimeout(500);
  await q.screenshot({ path: __dirname + '/elise-view.png' });
  await b.close();
})();
