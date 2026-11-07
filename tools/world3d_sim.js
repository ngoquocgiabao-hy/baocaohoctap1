// ========== MÔ PHỎNG SẢN XUẤT (3D) ==========
// Máy chạy, người đứng máy (không vẽ mặt), chiếc mũ 6 mảnh ráp dần, hoạt cảnh từng bước.
// Gọi từ W3.build(): W3SIM(K) với K = bộ công cụ dựng cảnh. Số nào là giả lập thì ghi rõ trên bảng số.
function W3SIM(K){
  const {scene, stations, M, add, bx, cy, mini, AN} = K;
  const PI = Math.PI, V = (x, y, z) => new THREE.Vector3(x, y, z);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = k => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  const seg = (k, a, b) => clamp((k - a) / (b - a), 0, 1);
  const tri = (vn, zh, en) => [vn, zh, en];
  scene.updateMatrixWorld(true);
  const WP = (sid, x, y, z) => stations[sid].inner.localToWorld(V(x, y, z));
  const shade = (hex, a) => { const c = new THREE.Color(hex), h = {}; c.getHSL(h); c.setHSL(h.h, h.s, clamp(h.l + a, 0, 1)); return '#' + c.getHexString(); };
  const root = new THREE.Group(); scene.add(root);

  // ---------- chữ trên canvas ----------
  function rr(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
  function fit(x, t, w){ let sz = parseInt(x.font.match(/(\d+)px/)[1], 10); while(x.measureText(t).width > w && sz > 14){ sz -= 2; x.font = x.font.replace(/\d+px/, sz + 'px'); } }
  function drawCard(c, lines, opt){
    opt = opt || {}; const x = c.getContext('2d'), W = c.width, H = c.height; x.clearRect(0, 0, W, H);
    x.fillStyle = opt.bg || 'rgba(255,255,255,0.95)'; rr(x, 4, 4, W - 8, H - 8, 22); x.fill(); x.lineWidth = 6; x.strokeStyle = opt.edge || '#1f2328'; x.stroke();
    const n = lines.length, lh = (H - 24) / n; x.textBaseline = 'middle'; x.textAlign = opt.center ? 'center' : 'left';
    lines.forEach((l, i) => { x.fillStyle = l.c || '#1f2328'; x.font = l.f || '600 40px sans-serif'; fit(x, l.t, W - 48); x.fillText(l.t, opt.center ? W / 2 : 26, 12 + lh * (i + 0.5)); });
  }
  function dyn(w, h, sx, sy){
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({map: t, depthTest: false, transparent: true})); s.scale.set(sx, sy, 1); s.renderOrder = 12; s.visible = false; root.add(s);
    let key = '';
    const o = {s, sx, sy, f: 1, size(a, b){ s.scale.set(sx * o.f * a + 0.001, sy * o.f * b + 0.001, 1); }, draw(lines, opt){ const k = JSON.stringify([lines, opt]); if(k === key) return; key = k; drawCard(c, lines, opt); t.needsUpdate = true; }};
    return o;
  }
  const F = (t, sz, c, w) => ({t, f: `${w || 600} ${sz || 40}px sans-serif`, c});

  // ---------- logo tự vẽ (không phải logo của khách) ----------
  function drawLogo(c, k){
    const x = c.getContext('2d'); x.clearRect(0, 0, c.width, c.height); if(k <= 0) return;
    x.save(); x.beginPath(); x.rect(0, 0, c.width * k, c.height); x.clip();
    x.strokeStyle = '#f8f9fa'; x.fillStyle = '#f8f9fa'; x.lineWidth = 13; x.lineJoin = 'round'; x.lineCap = 'round';
    x.beginPath(); x.moveTo(28, 34); x.lineTo(58, 98); x.lineTo(86, 52); x.lineTo(114, 98); x.lineTo(144, 34); x.stroke();
    x.font = '800 54px sans-serif'; x.textBaseline = 'middle'; x.fillText('LOGO', 162, 68); x.restore();
  }

  // ---------- người đứng máy (không vẽ mặt) ----------
  const workers = [];
  function worker(sid, x, z, rot, seated, shirt, stool){
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot || 0; stations[sid].inner.add(g);
    const hip = seated ? 0.52 : 0.86;
    if(seated){ if(stool !== false) cy(g, 0.22, 0.48, '#6c757d', 0, 0, 0.05, 10); bx(g, 0.34, 0.14, 0.42, '#343a40', 0, 0.48, -0.16); bx(g, 0.3, 0.48, 0.12, '#343a40', 0, 0, -0.34); }
    else { bx(g, 0.14, hip, 0.16, '#343a40', -0.1, 0, 0); bx(g, 0.14, hip, 0.16, '#343a40', 0.1, 0, 0); }
    add(g, new THREE.CylinderGeometry(0.19, 0.23, 0.78, 12), shirt || '#4263eb', 0, hip + 0.39, 0);
    add(g, new THREE.SphereGeometry(0.16, 14, 10), '#d9b38c', 0, hip + 0.98, 0);
    add(g, new THREE.SphereGeometry(0.168, 14, 8, 0, PI * 2, 0, PI / 2), '#f1f3f5', 0, hip + 1.0, 0);
    const arms = [-1, 1].map(sd => { const a = new THREE.Group(); a.position.set(sd * 0.25, hip + 0.7, 0); g.add(a); bx(a, 0.1, 0.55, 0.1, shirt || '#4263eb', 0, -0.55, 0); a.rotation.x = 0.9; return a; });
    workers.push({g, arms, ph: Math.random() * 6, sp: 0.004 + Math.random() * 0.003});
  }
  const SH = ['#4263eb', '#1c7ed6', '#2b8a3e', '#5f3dc4', '#0b7285', '#e8590c'];
  let wi = 0; const sh = () => SH[(wi++) % SH.length];
  // phòng mẫu, họp PPM (ghế có sẵn quanh bàn tròn)
  [[2.6, 4.1, 0], [2.6, 0.3, PI], [4.5, 2.2, PI / 2], [0.7, 2.2, -PI / 2]].forEach(([x, z, r]) => worker('mau', x, z, r, true, sh(), false));
  worker('mau', -1.5, -0.25, 0, false, sh());
  worker('kho', -2.5, 3.15, 0, false, sh());
  worker('kiemvai', -0.6, -0.15, 0, false, sh()); worker('kiemvai', 3.0, -1.45, 0, false, '#868e96');
  worker('cat', -2.6, -1.25, 0, false, sh()); worker('cat', 1.4, -1.25, 0, false, sh()); worker('cat', -3.6, 2.6, 0, false, sh()); worker('cat', 0.4, 2.55, 0, false, sh()); worker('cat', 2.55, 1.6, -PI / 2, false, sh());
  worker('theu', -0.5, -0.45, 0, false, sh()); worker('theu', -2, 2.65, 0, true, sh()); worker('theu', 2.0, 2.4, 0, false, '#868e96');
  worker('in', -2.2, -0.45, 0, false, sh()); worker('in', 2.0, -0.3, 0, false, sh());
  worker('giat', -1.1, -0.8, 0, false, sh());
  for(let r = 0; r < 2; r++) for(let i = 0; i < 5; i++) worker('may', -5.2 + i * 2.2, -2.8 + r * 2.3 + 0.78, 0, true, sh());
  worker('may', 2.6, 3.4, 0, true, sh()); worker('may', -3.2, 3.2, 0, true, sh()); worker('may', 5.4, -0.5, PI / 2, false, sh()); worker('may', 4.6, -1.85, 0, false, sh());
  worker('dinhform', -1.8, -0.2, 0, false, sh()); worker('dinhform', 1.4, 2.35, 0, false, sh());
  worker('qc', -1.6, -0.1, 0, false, '#c92a2a'); worker('qc', 2.4, -0.1, 0, false, '#c92a2a');
  worker('xuat', -3.6, -0.75, 0, false, sh()); worker('xuat', -2.4, -0.75, 0, false, sh()); worker('xuat', -0.9, -1.95, -PI / 2, false, '#c92a2a');

  // ---------- băng chuyền dò kim: thùng chạy qua máy ----------
  const convBoxes = [-2.6, -1.3, 0, 1.3].map((z, i) => { const m = bx(stations.xuat.inner, 0.6, 0.45, 0.45, '#c49a63', 0, 0.7, z); return {m, z, t: i * 0.27}; });

  // ---------- chiếc mũ 6 mảnh ráp dần ----------
  function capModel(col){
    col = col || '#1d3557';
    const r = 0.55, SY = 0.82, SZ = 1.08, g = new THREE.Group(), body = new THREE.Group(); body.scale.set(1, SY, SZ); g.add(body);
    const thread = '#eef1f4', P = {};
    const sp = (ph, th, rr2) => V(-rr2 * Math.cos(ph) * Math.sin(th), rr2 * Math.cos(th), rr2 * Math.sin(ph) * Math.sin(th));
    const gp = (ph, th, rr2) => { const v = sp(ph, th, rr2 == null ? r : rr2); v.y *= SY; v.z *= SZ; return v; };
    P.mats = [];
    P.panels = []; for(let i = 0; i < 6; i++){ const mt = new THREE.MeshLambertMaterial({color: new THREE.Color(col).convertSRGBToLinear(), side: THREE.DoubleSide}); P.mats.push(mt); const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 12, PI / 6 + i * PI / 3, PI / 3, 0, PI / 2), mt); body.add(m); P.panels.push(m); }
    const mer = (ph, rr2, t0, t1, n) => { const a = []; for(let k = 0; k <= n; k++) a.push(sp(ph, t0 + (t1 - t0) * k / n, rr2)); return a; };
    P.seams = []; P.stitch = [];
    for(let i = 0; i < 6; i++){ const ph = PI / 6 + i * PI / 3;
      const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mer(ph, r * 1.003, 0.02, PI / 2, 16)), 24, 0.009, 5, false), M(shade(col, -0.08))); body.add(t); P.seams.push(t);
      [-0.045, 0.045].forEach(o => { const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(mer(ph + o, r * 1.007, 0.12, PI / 2 - 0.02, 22)), new THREE.LineDashedMaterial({color: 0xeef1f4, dashSize: 0.024, gapSize: 0.014})); ln.computeLineDistances(); body.add(ln); P.stitch.push(ln); });
    }
    P.eyelets = []; for(let i = 0; i < 6; i++){ const p = sp(PI / 3 + i * PI / 3, 0.62, r * 1.004); const m = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.009, 6, 14), M(thread)); m.position.copy(p); m.quaternion.setFromUnitVectors(V(0, 0, 1), p.clone().normalize()); body.add(m); P.eyelets.push(m); }
    const lc = document.createElement('canvas'); lc.width = 320; lc.height = 128; const lt = new THREE.CanvasTexture(lc); lt.encoding = THREE.sRGBEncoding;
    P.logo = new THREE.Mesh(new THREE.SphereGeometry(r * 1.006, 14, 6, PI / 2 - 0.46, 0.92, 0.7, 0.46), new THREE.MeshBasicMaterial({map: lt, transparent: true})); body.add(P.logo);
    let logoK = -1; const setLogo = k => { if(Math.abs(k - logoK) < 0.01) return; logoK = k; drawLogo(lc, k); lt.needsUpdate = true; };
    P.arch = new THREE.Mesh(new THREE.SphereGeometry(r * 1.008, 10, 4, 3 * PI / 2 - 0.36, 0.72, 1.12, PI / 2 - 1.12), M('#0b1320', {side: THREE.DoubleSide})); body.add(P.arch);
    P.strap = new THREE.Mesh(new THREE.SphereGeometry(r * 1.016, 12, 2, 3 * PI / 2 - 0.44, 0.88, PI / 2 - 0.13, 0.09), M(shade(col, -0.06), {side: THREE.DoubleSide})); body.add(P.strap);
    P.buckle = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.055, 0.025), M('#ced4da')); P.buckle.position.copy(gp(3 * PI / 2 + 0.12, PI / 2 - 0.085, r * 1.03)); g.add(P.buckle);
    P.sweat = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.975, r * 0.975, 0.1, 36, 1, true), M('#343a40', {side: THREE.DoubleSide})); P.sweat.scale.z = SZ; P.sweat.position.y = 0.05; g.add(P.sweat);
    P.label = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.06), M('#ffffff', {side: THREE.DoubleSide})); P.label.position.copy(gp(3 * PI / 2, PI / 2 - 0.2, r * 0.95)); g.add(P.label);
    P.button = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), M(col)); P.button.scale.y = 0.55; P.button.position.y = r * SY + 0.012; g.add(P.button);
    // lưỡi trai: lưới đỉnh để uốn cong được
    const VS = 28, VT = 5, VL = 0.6, VA = 1.15;
    const vpt = (s, t, k) => { const a = PI / 2 + s * VA, x0 = -r * Math.cos(a), z0 = r * Math.sin(a) * SZ, nl = Math.hypot(x0, z0), dep = VL * Math.pow(Math.max(0, 1 - s * s), 0.5);
      return [x0 + x0 / nl * dep * t, -k * 0.2 * s * s * (0.3 + 0.7 * t) - 0.06 * t * dep / VL, z0 + z0 / nl * dep * t]; };
    const grid = () => { const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((VS + 1) * (VT + 1) * 3), 3)); const idx = []; for(let i = 0; i < VS; i++) for(let j = 0; j < VT; j++){ const a = i * (VT + 1) + j, b = (i + 1) * (VT + 1) + j; idx.push(a, a + 1, b, b, a + 1, b + 1); } geo.setIndex(idx); return geo; };
    const vTop = new THREE.Mesh(grid(), M(col, {side: THREE.DoubleSide})), vUnder = new THREE.Mesh(grid(), M(shade(col, 0.08), {side: THREE.DoubleSide}));
    P.visor = new THREE.Group(); P.visor.add(vTop, vUnder); g.add(P.visor);
    const RT = [0.3, 0.48, 0.66, 0.84];
    P.vrows = RT.map(() => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(new Array(31).fill(0).map(() => V(0, 0, 0))), new THREE.LineBasicMaterial({color: 0xeef1f4})); P.visor.add(l); return l; });
    let vk = -1;
    function setVisor(k){ if(Math.abs(k - vk) < 1e-3) return; vk = k;
      [[vTop, 0.014], [vUnder, -0.004]].forEach(([m, lift]) => { const a = m.geometry.attributes.position.array; let q = 0; for(let i = 0; i <= VS; i++){ const s = -1 + 2 * i / VS; for(let j = 0; j <= VT; j++){ const p = vpt(s, j / VT, k); a[q++] = p[0]; a[q++] = p[1] + lift; a[q++] = p[2]; } } m.geometry.attributes.position.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere(); });
      P.vrows.forEach((l, j) => { const a = l.geometry.attributes.position.array; for(let i = 0; i <= 30; i++){ const p = vpt(-0.9 + 1.8 * i / 30, RT[j], k); a[i * 3] = p[0]; a[i * 3 + 1] = p[1] + 0.018; a[i * 3 + 2] = p[2]; } l.geometry.attributes.position.needsUpdate = true; l.geometry.computeBoundingSphere(); });
    }
    // thẻ treo, túi, thước dây
    const tc = document.createElement('canvas'); tc.width = 128; tc.height = 200; drawCard(tc, [F('吊牌', 34), F('UPC', 28, '#555'), F('|||||', 30)], {center: true}); const tt = new THREE.CanvasTexture(tc); tt.encoding = THREE.sRGBEncoding;
    P.tag = new THREE.Group(); const tp = gp(PI / 2 - 1.05, PI / 2 - 0.05, r * 1.03); P.tag.position.copy(tp); g.add(P.tag);
    const card = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.19), new THREE.MeshBasicMaterial({map: tt, side: THREE.DoubleSide})); card.position.set(-0.03, -0.17, 0.05); card.rotation.y = -0.6; P.tag.add(card);
    P.tag.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0, 0, 0), V(-0.03, -0.08, 0.05)]), new THREE.LineBasicMaterial({color: 0x333333})));
    P.bag = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.64, 1.82), new THREE.MeshLambertMaterial({color: 0xd0e2ff, transparent: true, opacity: 0.22, depthWrite: false})); P.bag.position.set(0, 0.24, 0.24); g.add(P.bag);
    P.tape = new THREE.Mesh(new THREE.TorusGeometry(r * 0.985, 0.013, 6, 48), M('#f59f00')); P.tape.rotation.x = PI / 2; P.tape.scale.set(1, SZ, 1); P.tape.position.y = 0.025; g.add(P.tape);
    // 15 điểm QC
    const vp = (s, t, dy) => { const p = vpt(s, t, 1); return V(p[0], p[1] + dy, p[2]); };
    const MP = [gp(3 * PI / 2 - 0.9, PI / 2 - 0.04, r * 1.08), vp(0.35, 0.62, 0.07), gp(PI / 2, 0.95, r * 1.08), gp(2 * PI, 0.95, r * 1.08), gp(5 * PI / 3, 0.9, r * 1.08),
      gp(3 * PI / 2, 1.22, r * 1.1), gp(PI, 0.95, r * 1.08), V(0, r * SY + 0.1, 0), gp(PI / 2 - 0.45, PI / 2 - 0.02, r * 1.07), gp(PI / 2 + 0.35, PI / 2 - 0.05, r * 0.85),
      gp(PI, PI / 2 - 0.05, r * 0.85), gp(3 * PI / 2, PI / 2 - 0.2, r * 0.86), V(0, r * 0.35, 0), gp(3 * PI / 2 + 0.12, PI / 2 - 0.085, r * 1.14), vp(-0.35, 0.62, -0.07)];
    P.marks = MP.map((p, i) => { const c = document.createElement('canvas'); c.width = c.height = 64; const t = new THREE.CanvasTexture(c); const s = new THREE.Sprite(new THREE.SpriteMaterial({map: t, depthTest: false, transparent: true})); s.position.copy(p); s.scale.set(0.11, 0.11, 1); s.renderOrder = 14; g.add(s); s.userData = {c, t, st: ''}; return s; });
    const markDraw = (s, i, st) => { if(s.userData.st === st) return; s.userData.st = st; const x = s.userData.c.getContext('2d'); x.clearRect(0, 0, 64, 64); x.beginPath(); x.arc(32, 32, 29, 0, PI * 2); x.fillStyle = st === 'on' ? '#e03131' : st === 'done' ? '#2b8a3e' : '#ffffff'; x.fill(); x.lineWidth = 4; x.strokeStyle = '#1f2328'; x.stroke(); x.fillStyle = st === 'idle' ? '#1f2328' : '#fff'; x.font = '800 30px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(i + 1), 32, 34); s.userData.t.needsUpdate = true; s.scale.setScalar(st === 'on' ? 0.17 : 0.11); };
    const ORD = [0, 1, 2, 5, 3, 4];
    function set(o){
      o = Object.assign({n: 6, seamK: 1, stitch: 1, eyelets: 6, logo: 1, visor: 1, vrows: 4, vk: 0, vOff: 0, sweat: 1, label: 1, strap: 1, button: 1, tag: 0, bag: 0, tape: 0, marks: null, odd: -1}, o);
      const vis = new Set(ORD.slice(0, o.n));
      P.panels.forEach((m, i) => { m.visible = vis.has(i); m.material.color.set(new THREE.Color(i === o.odd ? shade(col, 0.22) : col).convertSRGBToLinear()); });
      P.seams.forEach((m, i) => { m.visible = vis.has((i + 5) % 6) && vis.has(i); m.geometry.setDrawRange(0, o.seamK >= 1 ? Infinity : Math.floor(m.geometry.index.count * o.seamK / 3) * 3); });
      P.stitch.forEach((l, j) => l.visible = !!o.stitch && P.seams[j >> 1].visible);
      P.eyelets.forEach((m, i) => m.visible = vis.has(i) && ORD.indexOf(i) < o.eyelets);
      P.logo.visible = vis.has(0) && vis.has(1) && o.logo > 0; if(P.logo.visible) setLogo(o.logo);
      P.arch.visible = vis.has(3) && vis.has(4);
      P.visor.visible = !!o.visor; P.visor.position.set(0, 0, o.vOff * 0.62); P.vrows.forEach((l, j) => l.visible = j < o.vrows); setVisor(o.vk);
      P.sweat.visible = !!o.sweat; P.label.visible = !!o.label; P.strap.visible = P.buckle.visible = !!o.strap && P.arch.visible; P.button.visible = !!o.button;
      P.tag.visible = !!o.tag; P.bag.visible = !!o.bag; P.tape.visible = !!o.tape;
      P.marks.forEach((s, i) => { s.visible = o.marks != null; if(s.visible) markDraw(s, i, i === o.marks ? 'on' : i < o.marks ? 'done' : 'idle'); });
    }
    set({});
    return {g, P, set, r};
  }
  // giá đỡ: vị trí → nghiêng → xoay
  function holder(cap){ const h = new THREE.Group(), tilt = new THREE.Group(); tilt.position.y = 0.25; cap.g.position.y = -0.25; h.add(tilt); tilt.add(cap.g); root.add(h); h.visible = false; return {h, tilt, cap}; }
  const CAP = holder(capModel()), CAP2 = holder(capModel());

  // ---------- mảnh cắt phẳng ----------
  function lune(w, h){ const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.quadraticCurveTo(-w * 0.42, h * 0.62, 0, h); s.quadraticCurveTo(w * 0.42, h * 0.62, w / 2, 0); s.quadraticCurveTo(0, -h * 0.07, -w / 2, 0); const g = new THREE.ShapeGeometry(s, 10); g.rotateX(-PI / 2); return g; }
  function crescent(w, h){ const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.quadraticCurveTo(0, h, w / 2, 0); s.quadraticCurveTo(0, h * 0.36, -w / 2, 0); const g = new THREE.ShapeGeometry(s, 12); g.rotateX(-PI / 2); return g; }
  function flatSet(col){
    col = col || '#1d3557'; const g = new THREE.Group(); root.add(g); g.visible = false;
    const lunes = [[-0.5, 0.36], [0, 0.36], [0.5, 0.36], [-0.5, -0.3], [0, -0.3], [0.5, -0.3]].map(([x, z]) => { const m = new THREE.Mesh(lune(0.44, 0.58), M(col, {side: THREE.DoubleSide})); m.position.set(x, 0.006, z); g.add(m);
      const e = new THREE.Mesh(new THREE.RingGeometry(0.018, 0.032, 14), M('#eef1f4', {side: THREE.DoubleSide})); e.rotation.x = -PI / 2; e.position.set(x, 0.012, z - 0.36); g.add(e); return {m, e}; });
    const vis = [[1.12, 0.32], [1.12, -0.2]].map(([x, z]) => { const m = new THREE.Mesh(crescent(0.9, 0.5), M(col, {side: THREE.DoubleSide})); m.position.set(x, 0.006, z); g.add(m); return m; });
    const btn = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), M(col, {side: THREE.DoubleSide})); btn.rotation.x = -PI / 2; btn.position.set(1.12, 0.008, -0.62); g.add(btn);
    return {g, show(o){ o = Object.assign({lunes: 6, skip: 0, visor: 1, btn: 1, eyelets: 0}, o); lunes.forEach((l, i) => { l.m.visible = i >= o.skip && i < o.lunes; l.e.visible = l.m.visible && i < o.eyelets; }); vis.forEach(m => m.visible = !!o.visor); btn.visible = !!o.btn; }};
  }
  const PIECES = flatSet();
  // mảnh trước (để thêu, in)
  const FRONT = (() => { const g = new THREE.Group(); root.add(g); g.visible = false;
    const m = new THREE.Mesh(lune(0.9, 0.62), M('#1d3557', {side: THREE.DoubleSide})); m.position.y = 0.006; g.add(m);
    const c = document.createElement('canvas'); c.width = 320; c.height = 128; const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
    const lg = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.17), new THREE.MeshBasicMaterial({map: t, transparent: true})); lg.rotation.x = -PI / 2; lg.position.set(0, 0.012, -0.24); g.add(lg);
    let k0 = -1; return {g, logo(k){ if(Math.abs(k - k0) < 0.01) return; k0 = k; drawLogo(c, k); t.needsUpdate = true; }}; })();

  // ---------- đồ vật khác ----------
  function rollObj(col){ const g = new THREE.Group(); const m = add(g, new THREE.CylinderGeometry(0.3, 0.3, 1.5, 18), col || '#1d3557', 0, 0, 0); m.rotation.z = PI / 2; cy(g, 0.06, 1.62, '#c49a63', 0, -0.81, 0, 8).rotation.z = PI / 2; root.add(g); g.visible = false; return g; }
  const ROLL = rollObj(), ROLL2 = rollObj('#7f5539');
  const SW = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.26), M('#1d3557', {side: THREE.DoubleSide})); m.rotation.x = -PI / 2; root.add(m); m.visible = false; return m; });
  const SHEETS = [0, 1, 2].map(() => { const g = new THREE.Group(); const a = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.8), M('#1d3557', {side: THREE.DoubleSide})); a.rotation.x = -PI / 2; a.position.y = 0.012; g.add(a); const b = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.8), M('#f8f9fa', {side: THREE.DoubleSide})); b.rotation.x = -PI / 2; g.add(b); root.add(g); g.visible = false; return g; });
  const PLY = new THREE.Mesh(new THREE.BoxGeometry(7.0, 1, 1.45), M('#264653')); root.add(PLY); PLY.visible = false;
  const BUN = (() => { const g = new THREE.Group(); const s = add(g, new THREE.BoxGeometry(0.62, 1, 0.5), '#2a9d8f', 0, 0.5, 0); const b = add(g, new THREE.BoxGeometry(0.64, 0.05, 0.12), '#f1faee', 0, 0.3, 0); root.add(g); g.visible = false; return {g, s, b}; })();
  const BIN = bx(root, 0.6, 0.35, 0.5, '#c92a2a', 0, 0, 0); BIN.visible = false;
  const TRIMS = (() => { const g = new THREE.Group(); const items = [];
    for(let i = 0; i < 4; i++){ const m = add(g, new THREE.CylinderGeometry(0.06, 0.06, 0.03, 14), '#adb5bd', -0.5 + i * 0.16, 0.02, -0.15); items.push(m); }
    for(let i = 0; i < 3; i++){ const m = add(g, new THREE.BoxGeometry(0.12, 0.03, 0.07), '#ced4da', -0.45 + i * 0.2, 0.02, 0.12); items.push(m); }
    for(let i = 0; i < 3; i++){ const m = add(g, new THREE.BoxGeometry(0.14, 0.008, 0.09), '#ffffff', 0.25 + i * 0.18, 0.01, 0.0); items.push(m); }
    bx(g, 0.5, 0.35, 0.4, '#c49a63', 0.75, 0, -0.35); root.add(g); g.visible = false; return {g, items}; })();
  function truckObj(){ const g = new THREE.Group(); bx(g, 3.4, 2.0, 1.8, '#dee2e6', -1.2, 0.5, 0); bx(g, 1.3, 1.6, 1.8, '#c92a2a', 1.25, 0.5, 0); bx(g, 0.05, 0.6, 1.5, '#a5d8ff', 1.91, 1.35, 0);
    [-2.2, -0.4, 1.2].forEach(x => [-0.85, 0.85].forEach(z => { const w = add(g, new THREE.CylinderGeometry(0.42, 0.42, 0.3, 14), '#212529', x, 0.42, z); w.rotation.x = PI / 2; })); root.add(g); g.visible = false; return g; }
  const TRUCK = truckObj();
  const BOX = (() => { const g = new THREE.Group(); bx(g, 0.9, 0.7, 0.7, '#c49a63', 0, 0, 0); const lid = [-1, 1].map(sd => { const p = new THREE.Group(); p.position.set(sd * 0.45, 0.7, 0); g.add(p); const m = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.02, 0.7), M('#b5895a')); m.position.x = -sd * 0.225; p.add(m); return p; }); bx(g, 0.4, 0.22, 0.01, '#ffffff', 0, 0.3, 0.355); root.add(g); g.visible = false; return {g, lid}; })();
  const STEAM = new Array(26).fill(0).map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false})); root.add(m); m.visible = false; m.userData = {a: Math.random() * PI * 2, t: Math.random()}; return m; });
  const MINIS = new Array(32).fill(0).map(() => { const g = mini(root, '#1d3557', 0, 0, 0, 0.5); g.visible = false; return g; });
  const STRIP = (() => { const g = new THREE.Group(); bx(g, 0.9, 0.012, 0.12, '#495057', 0, 0, 0); const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(-0.4, 0.016, 0), V(0.4, 0.016, 0)]), new THREE.LineDashedMaterial({color: 0xffffff, dashSize: 0.03, gapSize: 0.02})); l.computeLineDistances(); g.add(l); root.add(g); g.visible = false; return g; })();
  const BEAM = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.1, 6), new THREE.MeshBasicMaterial({color: 0xff3b3b})); root.add(BEAM); BEAM.visible = false;
  const S1 = dyn(512, 256, 1.7, 0.85), S2 = dyn(512, 256, 1.7, 0.85), PAD = dyn(560, 380, 1.55, 1.05);

  // ---------- trạng thái ----------
  const all = [CAP.h, CAP2.h, PIECES.g, FRONT.g, ROLL, ROLL2, PLY, BUN.g, BIN, TRIMS.g, TRUCK, BOX.g, STRIP, ...SW, ...SHEETS, ...STEAM, ...MINIS, S1.s, S2.s, PAD.s];
  let fx = null, beat = null, L = {}, follow = null;
  const place = (o, sid, x, y, z) => { o.position.copy(WP(sid, x, y, z)); o.visible = true; };
  const ov = {press: false, hpress: false, btn: false, drum: 1, fab: 1, heat: 0, plies: true, formCap: true, qcMini: true, mayMini: true, truckDx: 0, conv: true, laser: false};
  function reset(){
    all.forEach(o => { o.visible = false; });
    [CAP, CAP2].forEach(c => { c.h.rotation.set(0, 0, 0); c.h.scale.setScalar(1); c.tilt.rotation.set(0, 0, 0); c.cap.g.rotation.set(0, 0, 0); c.cap.set({}); });
    TRUCK.rotation.set(0, 0, 0); ROLL.rotation.set(0, 0, 0); ROLL2.rotation.set(0, 0, 0); [S1, S2, PAD].forEach(d => d.size(1, 1)); BOX.lid.forEach(p => p.rotation.z = 0); PIECES.g.scale.setScalar(1); FRONT.g.scale.setScalar(1);
    Object.assign(ov, {press: false, hpress: false, btn: false, drum: 1, fab: 1, heat: 0, plies: true, formCap: true, qcMini: true, mayMini: true, truckDx: 0, conv: true, laser: false}); BEAM.visible = false;
    follow = null; L = {};
  }
  const live = (k, v) => { L[k] = v; };

  // ---------- từng bước ----------
  const DEF = [[2, 5, 8, 11], [1, 4, 7, 10]].flat(), PTS = d => d <= 3 ? 1 : d <= 6 ? 2 : d <= 9 ? 3 : 4;
  const QCAZ = [30, 12, 0, -90, 180, 180, 90, 20, 25, 25, 40, 20, 180, 200, 10], QCFLIP = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1];
  const STEP8 = [tri('Quét mã iPad', 'iPad扫码', 'Scan on iPad'), tri('Kiểm sau định form', '定型后检查', 'Check after shaping'), tri('Ngoài, từ đỉnh xuống', '从顶上查外面', 'Outside from the top'), tri('Lưỡi và chỉ vành', '查帽檐和绕线', 'Visor and rows'),
    tri('Bên trong, cắt chỉ tại bàn', '查里面，线头在桌上剪', 'Inside, trim at the bench'), tri('Dây về 9.5, đo vòng đầu', '调到9.5量帽围', 'Strap to 9.5, measure'), tri('Đối chiếu iPad', '核对iPad上的信息', 'Match the iPad'), tri('Kiểm form', '看帽型', 'Check the shape')];
  const LSOP = [tri('Chuyển file sang định dạng máy', '文件转成机器格式', 'Convert the file'), tri('Lưu vào USB', '存到U盘', 'Save to USB'), tri('Cắm vào máy DS4', '插到DS4', 'Plug into the DS4'), tri('Cài công suất, kích thước', '设功率、尺寸', 'Set power and size'),
    tri('Trải vật liệu lên lưới tổ ong', '材料铺在蜂窝网上', 'Lay material on the honeycomb bed'), tri('Đạp bàn đạp cắt', '踩脚踏开切', 'Press the foot pedal'), tri('Thu mảnh đã cắt (đọc lại ảnh SOP)', '收成品', 'Collect the pieces')];
  const TABS = ['Header', 'Photos', 'Defects #1', 'Defects #2', 'Conclusion'];
  const SPIN = 0.25; // góc camera mặc định khi xem mũ

  const FX = {
    ppm: {sid: 'mau', at: [2.6, 1.15, 2.2], cam: [6.5, 0.6, 0.6],
      enter(){ place(CAP.h, 'mau', 2.6, 0.92, 2.2); CAP.h.scale.setScalar(0.9); place(S1.s, 'mau', 2.6, 2.35, 2.2); S1.draw([F('产前会议 PPM', 46, '#1f2328', 800), F('会议记录：日期 · 款号 · 参加人', 30, '#444'), F('问题 · 处理方法 · 负责人', 30, '#444')]); },
      run(k){ CAP.cap.g.rotation.y = k * PI * 2; }},
    truck: {sid: 'kho', at: [-1.2, 1.0, 4.6], cam: [13, 0.25, 0.5],
      enter(){ place(TRUCK, 'kho', -20, 0, 7.6); },
      run(k){ const a = ease(seg(k, 0, 0.42)); place(TRUCK, 'kho', -20 + 20.5 * a, 0, 7.6);
        const b = seg(k, 0.45, 0.85); ROLL.visible = b > 0; if(b > 0){ const p0 = WP('kho', -0.5, 1.4, 7.6), p1 = WP('kho', -2.5, 1.3, 2.2); ROLL.position.lerpVectors(p0, p1, ease(b)); ROLL.position.y += Math.sin(b * PI) * 0.8; }
        live('truck', a < 1 ? tri('đang vào', '进来', 'arriving') : tri('đã đến', '到了', 'arrived'));
        live('rolls', k < 0.45 ? '—' : k < 0.9 ? tri('đang đếm…', '点收中…', 'counting…') : tri('khớp bảng kê ✓', '跟点收明细一样 ✓', 'matches the list ✓')); }},
    swatch: {sid: 'kiemvai', at: [1.2, 1.3, 0.2], cam: [8, 0.35, 0.55],
      enter(){ place(ROLL, 'kiemvai', -1.5, 0.95, 0.5); },
      run(k){ const tests = [tri('ma sát khô/ướt', '干湿摩擦', 'dry/wet rub'), tri('bền màu khi giặt', '水洗牢度', 'wash fastness'), tri('màu', '颜色', 'colour'), tri('cảm giác tay', '手感', 'hand feel'), tri('độ dày', '厚度', 'thickness')];
        SW.forEach((m, i) => { const t = ease(seg(k, 0.05 + i * 0.08, 0.3 + i * 0.08)); const p0 = WP('kiemvai', -2.1 + i * 0.6, 1.3, 0.5), p1 = WP('kiemvai', 2.2 + i * 0.3, 1.04, 1.9); m.position.lerpVectors(p0, p1, t); m.position.y += Math.sin(t * PI) * 1.2; m.visible = true; });
        place(S1.s, 'kiemvai', -1.5, 2.0, 0.6); S1.draw([F('布头 · 布中 · 布尾', 44, '#1f2328', 800), F('Head · Middle · Tail', 30, '#555')], {center: true});
        live('test', k < 0.4 ? tri('chờ mẫu', '等样', 'waiting') : k > 0.94 ? tri('báo cáo ✓', '品质检测报告 ✓', 'report ✓') : tests[Math.min(4, Math.floor(seg(k, 0.4, 0.94) * 5))]); }},
    inspect: {sid: 'kiemvai', at: [-1.5, 1.8, -1.2], cam: [7, -0.45, 0.45],
      enter(){ ov.fab = 3.5; AN.marks.forEach(m => { m.visible = false; }); },
      run(k){ const yd = Math.round(100 * k); let pts = 0, last = null;
        DEF.forEach((d, i) => { const t0 = (i + 0.6) / 8.6; const mk = AN.marks[i]; if(k >= t0){ pts += PTS(d); last = d; if(!mk.visible){ mk.visible = true; mk.scale.x = d * 0.07; mk.position.y = 1.25; } } });
        live('yd', yd); live('pts', pts); live('p100', yd > 0 ? (3600 * pts / (yd * 60)).toFixed(1) : '—');
        live('def', last == null ? '—' : `${last} in → ${PTS(last)}`);
        const p = 3600 * pts / (Math.max(1, yd) * 60); live('grade', k < 0.98 ? '…' : p <= 29 ? 'A' : p <= 47 ? 'B' : p <= 62 ? 'C' : '> C');
        place(S1.s, 'kiemvai', 0.6, 3.3, -1.0); S1.draw([F(last == null ? '四分制' : `瑕疵 ${last} 英寸 → 扣${PTS(last)}分`, 42, '#c92a2a', 800), F(`码数 ${yd} · 总扣分 ${pts}`, 34, '#333')]); }},
    grade: {sid: 'kiemvai', at: [1.6, 0.9, 0.6], cam: [5.5, 0.3, 0.45],
      enter(){ place(ROLL, 'kiemvai', 1.6, 0.5, 0.6); },
      run(k){ place(S1.s, 'kiemvai', 1.6, 1.45 + 0.1 * Math.sin(k * 6), 0.9); S1.size(ease(seg(k, 0.05, 0.3)), ease(seg(k, 0.05, 0.3)));
        S1.draw([F('扣点等级 A（12分）', 42, '#2b8a3e', 800), F('色差级数 B（例）', 38, '#1f2328'), F('品号 · 缸号 · 检验员', 30, '#555')]); }},
    trims: {sid: 'kho', at: [-2.5, 1.2, 2.2], cam: [5.2, 0.3, 0.9],
      enter(){ place(TRIMS.g, 'kho', -2.6, 0.99, 2.25); },
      run(k){ const i = Math.min(TRIMS.items.length - 1, Math.floor(k * TRIMS.items.length)); TRIMS.items.forEach((m, j) => { m.position.y = (j === i ? 0.14 + 0.03 * Math.sin(k * 60) : 0.02); });
        live('n', i < 4 ? tri('nút', '扣', 'buttons') : i < 7 ? tri('khóa', '扣具', 'buckles') : tri('nhãn: size, mã vạch, số lượng', '标签：尺码、条码、数量', 'labels: size, barcode, qty'));
        place(S1.s, 'kho', -2.5, 2.2, 2.2); S1.draw([F('辅料 AQL 1.5', 46, '#1f2328', 800), F('对照标准样和系统订单', 32, '#444')]); }},
    stock: {sid: 'kho', at: [0.8, 1.4, 0], cam: [10.5, 0.15, 0.5],
      enter(){ place(ROLL, 'kho', -2.5, 1.3, 2.2); place(ROLL2, 'kho', -2.0, 1.3, 2.6); },
      run(k){ const a = ease(seg(k, 0.05, 0.45)); ROLL.position.lerpVectors(WP('kho', -2.5, 1.3, 2.2), WP('kho', 2.4, 2.65, -2.0), a); ROLL.position.y += Math.sin(a * PI) * 0.6;
        const b = ease(seg(k, 0.55, 0.9)); ROLL2.position.lerpVectors(WP('kho', -2.0, 1.3, 2.6), WP('kho', 4.7, 0.35, 0.8), b); ROLL2.position.y += Math.sin(b * PI) * 0.6;
        place(S1.s, 'kho', 2.4, 3.6, -1.7); S1.draw([F('主料合格 ✓', 46, '#2b8a3e', 800), F('储位 C24-3-2 · ERP', 32, '#333')]); S1.s.visible = k > 0.4;
        place(S2.s, 'kho', 4.7, 1.6, 0.9); S2.draw([F('不合格', 48, '#c92a2a', 800), F('验收反应单 → 特采 / 退货', 30, '#333')], {edge: '#c92a2a'}); S2.s.visible = k > 0.85;
        live('tag', k < 0.5 ? tri('chính liệu đạt', '主料合格', 'fabric pass') : tri('không đạt → phiếu phản hồi', '不合格 → 验收反应单', 'fail → feedback form')); }},
    issue: {sid: 'kho', at: [0, 1, 3], cam: [12, 0.2, 0.62],
      enter(){ place(ROLL, 'kho', 0.5, 1.0, 3.0); follow = ROLL; },
      run(k){ const pts = [WP('kho', 0.5, 1.0, 3.0), WP('kho', 3.5, 1.2, 7.4), V(15, 1.2, -13.6), WP('cat', 3.6, 1.6, -5.2), WP('cat', 3.6, 1.65, -2.4)];
        const c = new THREE.CatmullRomCurve3(pts); ROLL.position.copy(c.getPointAt(ease(seg(k, 0.12, 0.92))));
        S1.s.position.copy(ROLL.position).add(V(0, 1.0, 0)); S1.s.visible = true; S1.draw([F('领料单 100码', 44, '#1f2328', 800), F('库存 1000 → 900码', 34, '#333')]);
        live('s', k < 0.12 ? '1.000' : '900'); }},
    tagread: {sid: 'cat', at: [3.4, 1.7, -2.0], cam: [6, 0.45, 0.4],
      enter(){ AN.plies.forEach(m => m.visible = true); },
      run(k){ place(S1.s, 'cat', 3.3, 2.75, -1.6); const a = ease(seg(k, 0.05, 0.3)); S1.size(a, a);
        S1.draw([F('品号 …B → 黑', 44, '#1f2328', 800), F('色差级数 · 缸号 · 扣点等级', 32, '#444'), F('二维码 QR', 30, '#666')]); }},
    fuse: {sid: 'cat', at: [0.4, 1.2, 1.6], cam: [6.2, 0.15, 0.8],
      enter(){},
      run(k){ SHEETS.forEach((g, i) => { const t = (k * 1.6 + i / 3) % 1; place(g, 'cat', -1.2 + 3.3 * t, 1.12, 1.6); });
        const n = Math.floor(k * 30); live('t', `${146 + (n % 3)} · ${148 - (n % 2)} · ${145 + (n % 2)} °C ${'(số giả lập)'}`);
        place(S1.s, 'cat', 0.4, 2.3, 1.6); S1.draw(k < 0.55 ? [F('贴合 M-10-71', 44, '#1f2328', 800), F('80–180 °C · 气压', 34, '#444')] : [F('第一片撕不开 ✓', 42, '#2b8a3e', 800), F('不起皱 · 不打卷 · 不渗胶', 32, '#444')]); }},
    spread: {sid: 'cat', at: [-0.6, 1.3, -2.4], cam: [9, 0.1, 0.55],
      enter(){ ov.plies = false; place(ROLL, 'cat', -4, 1.4, -2.4); ROLL.rotation.y = PI / 2; },
      run(k){ const n = Math.min(18, Math.floor(k * 19)); live('n', n); PLY.visible = n > 0; PLY.scale.y = Math.max(0.001, n * 0.02); place(PLY, 'cat', -0.6, 1.0 + n * 0.01, -2.4); PLY.visible = n > 0;
        const ph = (k * 19) % 2, x = ph < 1 ? -4 + 7 * ph : 3 - 7 * (ph - 1); place(ROLL, 'cat', x, 1.4 + n * 0.02, -2.4);
        place(S1.s, 'cat', -0.6, 2.7, -2.4); S1.draw([F(`拉布 ${n} / 18 层`, 46, '#1f2328', 800), F('M-10-44-A-3 · 双面拉布', 32, '#444')]); }},
    die: {sid: 'cat', at: [-3.6, 1.4, 1.3], cam: [6, 0.5, 0.78],
      enter(){ ov.press = true; },
      run(k){ const cyc = (k * 3) % 1, down = cyc < 0.35 ? 0 : cyc < 0.5 ? (cyc - 0.35) / 0.15 : cyc < 0.6 ? 1 : cyc < 0.8 ? 1 - (cyc - 0.6) / 0.2 : 0;
        AN.press.m.position.y = AN.press.y0 - 0.95 * down; const n = Math.floor(k * 3 + 0.5); live('n', n);
        PIECES.show({}); PIECES.g.visible = n > 0; PIECES.g.scale.setScalar(0.7); place(PIECES.g, 'cat', -3.75, 1.1, 1.35); PIECES.g.visible = n > 0;
        place(S1.s, 'cat', -3.6, 3.3, 1.3); S1.draw([F('刀模 · 牛皮纸', 44, '#1f2328', 800), F('差2毫米以上要修 · 两小时查一次', 30, '#444')]); }},
    bundle: {sid: 'cat', at: [2.6, 0.7, 2.6], cam: [6, 0.3, 0.5],
      enter(){ place(BUN.g, 'cat', 2.4, 0, 2.9); place(BIN, 'cat', 1.3, 0, 3.1); },
      run(k){ const n = Math.round(144 * ease(seg(k, 0, 0.8))); live('n', n); BUN.s.scale.y = 0.05 + 0.5 * n / 144; BUN.s.position.y = BUN.s.scale.y / 2; BUN.b.visible = n === 144; BUN.b.position.y = BUN.s.scale.y * 0.5;
        place(S1.s, 'cat', 2.4, 1.3 + BUN.s.scale.y, 2.9); S1.draw(n < 144 ? [F(`绑片 ${n} / 144`, 46, '#1f2328', 800), F('不良裁片 → 不良箱', 32, '#c92a2a')] : [F('144套 ✓ A卡', 46, '#2b8a3e', 800), F('工号写在工序栏', 32, '#444')]); }},
    aux: {sid: 'cat', at: [2.4, 1.0, 3.95], cam: [5.2, 0.3, 0.78],
      enter(){ ov.laser = true; PIECES.show({visor: 0, btn: 0}); PIECES.g.scale.setScalar(0.42); place(PIECES.g, 'cat', 2.3, 0.875, 3.98); },
      run(k){ const a = seg(k, 0.05, 0.62), row = Math.floor(a * 6), u = (a * 6) % 1, x = 1.75 + 1.3 * (row % 2 ? 1 - u : u), z = 3.65 + row * 0.12;
        if(k < 0.65){ AN.lgantry.m.position.x = x; AN.lhead.m.position.x = x; AN.lhead.m.position.z = z; BEAM.visible = a > 0 && a < 1 && Math.sin(k * 400) > -0.3; BEAM.position.copy(WP('cat', x, 0.93, z)); }
        else BEAM.visible = false;
        PIECES.show({visor: 0, btn: 0, eyelets: Math.min(6, Math.floor(a * 6.99))});
        const st = Math.min(6, Math.floor(k / 0.65 * 7)); live('m', 'Ogbos · CKLASER'); live('s', k < 0.65 ? `${st + 1} / 7` : '7 / 7');
        live('name', k < 0.65 ? LSOP[st] : tri('Đóng khuy: không lỏng, không móp, không rớt', '打扣：不松、不变形、不掉扣', 'Button setting: firm, undented, present'));
        place(S1.s, 'cat', 2.4, 2.4, 3.6); S1.draw(k < 0.65 ? [F('镭射切割 · 透气孔', 42, '#1f2328', 800), F('护目镜 · 蒸馏水 · 不切金属', 32, '#c92a2a')] : [F('打扣（待确认）', 46, '#1f2328', 800), F('不松、不变形、不掉扣', 34, '#444')]); }},
    embroider: {sid: 'theu', at: [0.55, 1.1, -1.2], cam: [3.4, 0.2, 0.95],
      enter(){ place(FRONT.g, 'theu', 0.52, 1.035, -0.98); FRONT.g.scale.setScalar(1.2); },
      run(k){ const a = seg(k, 0.1, 0.85); FRONT.logo(a); live('pct', Math.round(a * 100) + ' %'); AN.emb[3].m.position.x = AN.emb[3].x0 + 0.12 * Math.sin(k * 140); AN.emb[3].m.position.z = AN.emb[3].z0 + 0.05 * Math.cos(k * 170);
        place(S1.s, 'theu', 1.3, 3.3, -2.4); S1.draw(k < 0.9 ? [F('绣花', 48, '#1f2328', 800), F('位置 · 尺寸 · 密度 · 线的颜色', 32, '#444')] : [F('首件 ✓ 跟确认样对比', 40, '#2b8a3e', 800), F('logo 是模拟的', 30, '#666')]); }},
    print: {sid: 'in', at: [2.0, 1.3, -1.3], cam: [5.2, 0.3, 0.85],
      enter(){ ov.hpress = true; place(FRONT.g, 'in', 2.0, 0.98, -1.25); FRONT.g.scale.setScalar(0.75); FRONT.logo(0); },
      run(k){ const d = k < 0.25 ? 0 : k < 0.38 ? (k - 0.25) / 0.13 : k < 0.62 ? 1 : k < 0.75 ? 1 - (k - 0.62) / 0.13 : 0; AN.hpress.m.position.y = AN.hpress.y0 - 0.88 * d;
        FRONT.logo(k > 0.7 ? 1 : 0); live('press', k < 0.25 ? tri('đặt mảnh', '放裁片', 'load piece') : k < 0.7 ? tri('đang ép', '压烫中', 'pressing') : tri('xong, so mẫu duyệt', '好了，跟确认样对比', 'done, compare with approved'));
        place(S1.s, 'in', 2.0, 2.9, -1.3); S1.draw([F('转印 · 印花', 44, '#1f2328', 800), F('偏 > 3毫米 严重 · ≤ 3毫米 轻微', 30, '#444')]); }},
    wash: {sid: 'giat', at: [-1.1, 1.2, -1.0], cam: [9, 0.2, 0.5],
      enter(){ ov.drum = 6; },
      run(k){ place(S1.s, 'giat', -1.1, 3.6, -2.2); S1.draw([F('水洗帽 · 一楼', 46, '#1f2328', 800), F('水洗后怎么查？还要问', 34, '#c92a2a')]); }},
    eyelet: {sid: 'may', at: [-5.4, 1.2, -2.6], cam: [4.6, 0.25, 0.85],
      enter(){ PIECES.show({visor: 0, btn: 0}); PIECES.g.scale.setScalar(0.62); place(PIECES.g, 'may', -5.55, 1.0, -2.65); },
      run(k){ const n = Math.min(6, Math.floor(seg(k, 0.05, 0.9) * 6.99)); PIECES.show({visor: 0, btn: 0, eyelets: n}); live('n', n);
        place(S1.s, 'may', -5.3, 2.4, -2.8); S1.draw([F('绣洞 1700转', 46, '#1f2328', 800), F('薄料 1200 · 垫纸', 32, '#444')]); }},
    join: {sid: 'may', at: [-3.3, 1.3, -2.6], cam: [4.4, 0.3, 0.82],
      enter(){ place(CAP.h, 'may', -3.35, 1.0, -2.55); CAP.h.scale.setScalar(0.85); PIECES.show({skip: 2, visor: 1, btn: 1}); PIECES.g.scale.setScalar(0.5); place(PIECES.g, 'may', -2.2, 1.0, -2.0); },
      run(k){ CAP.cap.set({n: 2, seamK: seg(k, 0.1, 0.85), stitch: 0, visor: 0, vrows: 0, sweat: 0, label: 0, strap: 0, button: 0, eyelets: 2}); CAP.cap.g.rotation.y = 0.3;
        place(S1.s, 'may', -3.0, 2.5, -2.8); S1.draw([F('前合片', 48, '#1f2328', 800), F('缝份6毫米 · 每英寸12针 · 回针10毫米', 30, '#444')]); }},
    body: {sid: 'may', at: [-1.1, 1.3, -2.6], cam: [4.4, 0.4, 0.82],
      enter(){ place(CAP.h, 'may', -1.15, 1.0, -2.55); CAP.h.scale.setScalar(0.85); },
      run(k){ const n = 2 + Math.min(4, Math.floor(seg(k, 0.05, 0.6) * 4.99)); live('n', n);
        CAP.cap.set({n, stitch: k > 0.66 ? 1 : 0, visor: 0, vrows: 0, sweat: 0, label: 0, strap: 0, button: 0}); CAP.cap.g.rotation.y = 0.3 + k * PI * 1.2;
        place(S1.s, 'may', -0.8, 2.5, -2.8); S1.draw(k < 0.66 ? [F('合片 · 拷克', 48, '#1f2328', 800), F(`合片 ${n} / 6`, 34, '#444')] : [F('帽双 · 包边 · 压条', 46, '#1f2328', 800), F('每英寸10针 · 9针 · 不能有接头', 30, '#444')]); }},
    visor: {sid: 'may', at: [1.1, 1.25, -2.3], cam: [4.4, 0.2, 0.85],
      enter(){ place(CAP.h, 'may', 1.05, 1.0, -2.75); CAP.h.scale.setScalar(0.85); },
      run(k){ const n = Math.min(4, Math.floor(seg(k, 0.25, 0.9) * 4.99)); live('n', n); CAP.cap.set({vOff: 1, vrows: n, sweat: 0, label: 0, strap: 0, button: 0});
        place(S1.s, 'may', 1.4, 2.5, -2.8); S1.draw([F(k < 0.25 ? '束眉 每英寸7针' : '绕线 每英寸10针', 44, '#1f2328', 800), F('修眉：UA 留5到7毫米', 32, '#444')]); }},
    sweat: {sid: 'may', at: [-3.3, 1.35, -0.4], cam: [4.4, 0.15, 0.8],
      enter(){ place(CAP.h, 'may', -3.35, 1.0, -0.3); CAP.h.scale.setScalar(0.85); },
      run(k){ const a = ease(seg(k, 0.05, 0.35)); CAP.cap.set({vOff: 1 - a, sweat: k > 0.4 ? 1 : 0, label: k > 0.4 ? 1 : 0, strap: 0, button: 0}); CAP.tilt.rotation.x = -1.15 * ease(seg(k, 0.42, 0.62)) * (1 - ease(seg(k, 0.88, 1)));
        live('p', k < 0.5 ? 0 : k < 0.8 ? 1 : 2);
        place(S1.s, 'may', -3.0, 2.6, -0.5); S1.draw([F('关键工序 汗带 · 帽眉', 42, '#c92a2a', 800), F('每英寸9针 · UA、TNF 10针 · 每天巡检2次', 28, '#444')], {edge: '#c92a2a'}); }},
    strap: {sid: 'may', at: [2.2, 1.3, 2.6], cam: [4.4, 0.1, 0.78],
      enter(){ place(CAP.h, 'may', 2.0, 1.0, 2.55); CAP.h.scale.setScalar(0.85); CAP.cap.g.rotation.y = PI; place(STRIP, 'may', 3.1, 1.0, 2.75); },
      run(k){ CAP.cap.set({strap: k > 0.45 ? 1 : 0, button: 0}); STRIP.visible = k < 0.5; live('trial', k < 0.45 ? tri('may thử băng phế', '废带试车', 'trial on scrap tape') : tri('may hàng thật ✓', '车大货 ✓', 'bulk ✓'));
        place(S1.s, 'may', 2.4, 2.5, 2.6); S1.draw([F('电脑车 后扣 · 调节带', 42, '#1f2328', 800), F('车进15毫米 · 每英寸8针', 32, '#444')]); }},
    button: {sid: 'may', at: [4.6, 1.4, -0.4], cam: [4.4, -0.5, 0.6],
      enter(){ ov.btn = true; place(CAP.h, 'may', 4.6, 1.11, -0.38); CAP.h.scale.setScalar(0.7); },
      run(k){ const d = k < 0.2 ? 0 : k < 0.32 ? (k - 0.2) / 0.12 : k < 0.42 ? 1 : k < 0.52 ? 1 - (k - 0.42) / 0.1 : 0; AN.btn.m.position.y = AN.btn.y0 - 0.38 * d; CAP.cap.set({button: k > 0.32 ? 1 : 0});
        live('trim', k < 0.55 ? '—' : k < 0.78 ? tri('bên trong trước', '先里面', 'inside first') : tri('bên ngoài, gốc lưỡi sạch', '再外面，帽檐根部干净', 'then outside, clean visor root'));
        CAP.tilt.rotation.x = k > 0.55 && k < 0.78 ? -1.1 * ease(seg(k, 0.55, 0.62)) : -1.1 * (1 - ease(seg(k, 0.78, 0.85))) * (k > 0.78 ? 1 : 0);
        place(S1.s, 'may', 4.6, 2.75, -0.5); S1.draw([F(k < 0.55 ? '打顶扣 压力6到9' : '修线 先里后外', 44, '#1f2328', 800), F('顶扣不松、不偏 · 线交在一个点', 30, '#444')]); }},
    firstpiece: {sid: 'may', at: [-3.2, 1.4, 2.4], cam: [4.8, 0.2, 0.78],
      enter(){ ov.mayMini = false; place(CAP.h, 'may', -3.2, 0.99, 2.4); CAP.h.scale.setScalar(0.9); },
      run(k){ CAP.cap.g.rotation.y = k * PI * 2; const n = Math.min(3, Math.floor(seg(k, 0.15, 0.85) * 3.99)); live('sign', `${n} / 3`);
        place(S1.s, 'may', -3.2, 2.6, 2.4); S1.draw([F('首件检验', 46, '#1f2328', 800), F(`CFA ${n > 0 ? '✓' : '·'}  组长 ${n > 1 ? '✓' : '·'}  QC主管 ${n > 2 ? '✓' : '·'}`, 34, n > 2 ? '#2b8a3e' : '#444')]); }},
    curve: {sid: 'dinhform', at: [-1.8, 1.5, -1.0], cam: [4.6, 0.95, 0.72],
      enter(){ place(CAP.h, 'dinhform', -1.8, 1.21, -0.85); CAP.h.scale.setScalar(0.85); CAP.cap.g.rotation.y = PI; ov.heat = 1; },
      run(k){ CAP.cap.set({vk: ease(seg(k, 0.25, 0.8))}); const t = 95 + 12.9 * ease(seg(k, 0, 0.6)); live('t', t.toFixed(1) + ' °C'); live('gap', (120 - t).toFixed(1) + ' °C');
        place(S1.s, 'dinhform', -1.8, 3.0, -1.6); S1.draw([F('弯眉整烫 TYL-1908-R', 40, '#1f2328', 800), F(`设定120度 · 显示${t.toFixed(1)}度`, 34, t < 110 ? '#c92a2a' : '#444')]); }},
    steam: {sid: 'dinhform', at: [1.4, 1.75, 1.4], cam: [4.6, 0.3, 0.55],
      enter(){ ov.formCap = false; place(CAP.h, 'dinhform', 1.4, 1.43, 1.4); CAP.cap.set({vk: 1}); STEAM.forEach(m => m.visible = true); },
      run(k, dt){ CAP.cap.set({vk: 1}); const c = WP('dinhform', 1.4, 1.5, 1.4);
        STEAM.forEach(m => { const u = m.userData; u.t += dt * 0.6; if(u.t > 1){ u.t = 0; u.a = Math.random() * PI * 2; } m.position.set(c.x + Math.cos(u.a) * (0.5 + u.t * 0.3), c.y + u.t * 1.4, c.z + Math.sin(u.a) * (0.5 + u.t * 0.3)); m.material.opacity = 0.5 * (1 - u.t); m.scale.setScalar(1 + u.t * 2); });
        live('s', k < 0.45 ? Math.min(6, Math.floor(seg(k, 0.05, 0.4) * 6.99)) + ' / 6 s' : '—');
        place(S1.s, 'dinhform', 1.4, 3.1, 1.4); S1.draw([F(k < 0.45 ? '棉布帽檐 165–180度 6秒' : '熨烫 90–130度', 40, '#1f2328', 800), F('机器设110到135度：不一致', 30, '#c92a2a')]); }},
    qc8: {sid: 'qc', at: [-2.0, 1.35, -1.2], cam: [3.5, SPIN, 0.78],
      enter(){ ov.qcMini = false; place(CAP.h, 'qc', -2.05, 0.99, -1.2); CAP.h.scale.setScalar(1.2); CAP.cap.set({vk: 1}); place(PAD.s, 'qc', -0.9, 1.9, -1.4); },
      run(k){ const s = Math.min(7, Math.floor(k * 8)); live('s', s + 1); live('name', STEP8[s]); const lk = (k * 8) % 1;
        CAP.cap.g.rotation.y = s === 2 ? lk * PI * 2 : s === 3 ? 0.2 : 0; CAP.tilt.rotation.x = s === 4 ? -1.15 * ease(seg(lk, 0, 0.3)) * (1 - ease(seg(lk, 0.8, 1))) : 0; CAP.cap.set({vk: 1, tape: s === 5 ? 1 : 0});
        PAD.draw([F('iPad · 尾查', 40, '#1f2328', 800), ...STEP8.map((t, i) => F(`${i + 1}. ${t[1]}`, 30, i === s ? '#c92a2a' : i < s ? '#2b8a3e' : '#555', i === s ? 800 : 500))].slice(0, 9), {}); }},
    qc15: {sid: 'qc', at: [-2.0, 1.4, -1.2], cam: [3.1, SPIN, 0.72],
      enter(){ ov.qcMini = false; place(CAP.h, 'qc', -2.05, 0.99, -1.2); CAP.h.scale.setScalar(1.3); },
      run(k){ const p = Math.min(14, Math.floor(k * 15)); CAP.cap.set({vk: 1, marks: p}); live('p', p + 1); live('name', `${DATA.sim.points[p].zh} · ${DATA.sim.points[p].vn}`);
        live('find', [DATA.sim.points[p].fvn, DATA.sim.points[p].fzh, DATA.sim.points[p].fen]);
        const want = SPIN - QCAZ[p] * PI / 180, g = CAP.cap.g; let d = want - g.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); g.rotation.y += d * 0.08;
        CAP.tilt.rotation.x += ((QCFLIP[p] ? -1.15 : 0) - CAP.tilt.rotation.x) * 0.08; }},
    measure: {sid: 'qc', at: [-2.8, 2.45, -1.4], cam: [4.0, 0.4, 0.62],
      enter(){ ov.qcMini = false; place(CAP.h, 'qc', -2.8, 2.25, -1.4); CAP.cap.set({vk: 1, tape: 1}); },
      run(k){ const v = 56.2 + 1.1 * ease(seg(k, 0.2, 0.7)); live('hc', k < 0.2 ? '—' : v.toFixed(1) + ' cm'); live('res', k < 0.72 ? '…' : tri('lệch +0,3 cm: trong ±0,5 → đạt', '差0.3厘米，在±0.5内 → 合格', '+0.3 cm, within ±0.5 → pass'));
        CAP.cap.g.rotation.y = PI * ease(seg(k, 0, 0.18)) * (1 - ease(seg(k, 0.18, 0.3)));
        place(S1.s, 'qc', -2.8, 3.4, -1.4); S1.draw([F(k < 0.2 ? '后面调到9.5' : '量帽围', 44, '#1f2328', 800), F('UA ±0.5厘米（标准57.0是例子）', 30, '#444')]); }},
    rework: {sid: 'qc', at: [2.8, 1.0, 0.2], cam: [7, 0.3, 0.7],
      enter(){ ov.qcMini = false; place(CAP.h, 'qc', 1.6, 0.99, -1.2); CAP.cap.set({vk: 1}); place(CAP2.h, 'qc', 2.5, 0.99, -1.2); CAP2.cap.set({vk: 1, odd: 2}); CAP2.cap.g.rotation.y = -0.9; },
      run(k){ const a = ease(seg(k, 0.12, 0.42)); CAP.h.position.lerpVectors(WP('qc', 1.6, 0.99, -1.2), WP('qc', 3.8, 0.62, 1.6), a); CAP.h.position.y += Math.sin(a * PI) * 0.7; CAP.h.visible = k < 0.45;
        CAP2.h.visible = k > 0.45; CAP2.h.scale.setScalar(1 - 0.9 * ease(seg(k, 0.8, 1)));
        live('ex', k < 0.45 ? tri('lỗi nhẹ hoặc vừa (VD)', '轻微缺陷（例）', 'minor or medium (example)') : tri('khác màu: ảnh hưởng màu', '色差：影响颜色', 'shade: affects colour'));
        live('act', k < 0.45 ? tri('báo tổ trưởng → sửa (返工)', '告诉组长 → 返工', 'tell leader → rework') : tri('làm lại (重做)', '重做', 'remake'));
        place(S1.s, 'qc', 2.6, 2.4, -0.4); S1.draw(k < 0.45 ? [F('返工', 52, '#e67700', 800), F('轻微缺陷 → 告诉组长', 32, '#444')] : [F('重做', 52, '#c92a2a', 800), F('严重缺陷：结构 · 颜色 · 质量', 30, '#444')]); }},
    pack: {sid: 'xuat', at: [-2.6, 1.3, -2.1], cam: [5, 0.2, 0.82],
      enter(){ place(CAP.h, 'xuat', -3.4, 0.99, -2.2); CAP.h.scale.setScalar(0.8); CAP.cap.set({vk: 1}); place(BOX.g, 'xuat', -2.1, 0.98, -2.2); BOX.g.scale.setScalar(0.9); },
      run(k){ CAP.cap.set({vk: 1, tag: k > 0.1 ? 1 : 0, bag: k > 0.3 ? 1 : 0}); const a = ease(seg(k, 0.5, 0.72)); CAP.h.position.lerpVectors(WP('xuat', -3.4, 0.99, -2.2), WP('xuat', -2.1, 1.25, -2.2), a); CAP.h.position.y += Math.sin(a * PI) * 0.6; CAP.h.visible = k < 0.74;
        BOX.lid.forEach((p, i) => p.rotation.z = (i ? -1 : 1) * (1.9 - 1.9 * ease(seg(k, 0.74, 0.82))));
        const m = 3.0 + 0.9 * ease(seg(k, 0.82, 0.95)); live('m', k < 0.82 ? '—' : m.toFixed(1) + ' % (giả lập)'); live('res', k < 0.96 ? '…' : tri('≤ 4,35 % → đạt', '≤ 4.35% → 合格', '≤ 4.35% → pass'));
        place(S1.s, 'xuat', -2.6, 2.5, -2.2); S1.draw(k < 0.5 ? [F('吊牌 · 入袋', 46, '#1f2328', 800), F('款号 颜色 尺码 UPC 要一致', 30, '#444')] : [F('含水率 LANDTEK DM200T', 36, '#1f2328', 800), F('涤纶4% · 棉5% → 4.35%', 32, '#444')]); }},
    aql: {sid: 'xuat', at: [-2.8, 0.9, 2.8], cam: [7, 0.2, 0.62],
      enter(){ place(BOX.g, 'xuat', -1.0, 0, 2.6); BOX.g.scale.setScalar(1); },
      run(k){ const n = Math.min(32, Math.floor(seg(k, 0.05, 0.85) * 32.99)), c = Math.min(11, Math.ceil(n / 32 * 11)); live('n', n); live('c', c); live('d', '0');
        live('res', k < 0.9 ? '…' : tri('0 ≤ 1 → đạt (số lỗi giả lập)', '0 ≤ 1 → 允收（模拟）', '0 ≤ 1 → accept (simulated)'));
        MINIS.forEach((g, i) => { g.visible = i < n; if(i < n) place(g, 'xuat', -4.3 + (i % 8) * 0.38, 0.0, 2.6 + Math.floor(i / 8) * 0.38); });
        BOX.lid.forEach((p, i) => p.rotation.z = (i ? -1 : 1) * 1.9 * ease(seg(k, 0, 0.08)));
        place(S1.s, 'xuat', -2.8, 2.3, 2.9); S1.draw([F(`抽样 ${n} / 32 · 开箱 ${c} / 11`, 40, '#1f2328', 800), F('PO 805顶 · 19箱 · I级 1个允收 2个拒收', 28, '#444')]); }},
    needle: {sid: 'xuat', at: [1.2, 1.0, -1.3], cam: [6.5, -0.45, 0.45],
      enter(){ ov.conv = false; place(BOX.g, 'xuat', -0.3, 0.7, -1.3); BOX.g.scale.setScalar(0.62); },
      run(k){ const x = -0.3 + 3.0 * seg(k, 0.05, 0.75); place(BOX.g, 'xuat', x, 0.7, -1.3); const inside = x > 0.75 && x < 1.65; AN.det.forEach((m, i) => { m.material.emissive.setHex(i === 1 && inside ? 0x1c7ed6 : 0x000000); });
        live('st', x < 0.75 ? tri('vào máy', '进验针机', 'entering') : inside ? tri('đang dò…', '验针中…', 'scanning…') : k < 0.8 ? tri('không có kim ✓', '没有针 ✓', 'clear ✓') : tri('QA kiểm lần cuối → dán thùng', 'QA最后再查 → 封箱', 'QA last check → seal'));
        place(S1.s, 'xuat', 1.2, 2.6, -1.3); S1.draw([F('验针 · 4条线', 46, '#1f2328', 800), F('断针是最严重的问题', 32, '#c92a2a')]); }},
    cfa: {sid: 'xuat', at: [-2.0, 1.4, 1.2], cam: [7.5, 0.2, 0.5],
      enter(){ place(PAD.s, 'xuat', -1.4, 2.3, 0.9); },
      run(k){ const t = Math.min(4, Math.floor(seg(k, 0.15, 0.95) * 5)); live('pct', tri('≥ 80 % ✓', '≥ 80% ✓', '≥ 80% ✓')); live('tab', TABS[t]); live('res', k < 0.95 ? '…' : tri('đạt (VD)', '合格（例）', 'pass (example)'));
        PAD.draw([F('Pivot88 · 终检', 40, '#1f2328', 800), ...TABS.map((n, i) => F(`${i < t ? '✓' : i === t ? '▶' : '·'} ${n}`, 32, i === t ? '#c92a2a' : i < t ? '#2b8a3e' : '#555', i === t ? 800 : 500)), F('AQL 1.5 I级', 28, '#555')]); }},
    ship: {sid: 'xuat', at: [3.6, 1.4, 2.6], cam: [12, 0.15, 0.45],
      enter(){ place(BOX.g, 'xuat', -1.0, 0, 2.6); BOX.g.scale.setScalar(0.7); },
      run(k){ const a = ease(seg(k, 0, 0.3)); BOX.g.position.lerpVectors(WP('xuat', -1.0, 0, 2.6), WP('xuat', 3.4, 1.0, 2.6), a); BOX.g.position.y += Math.sin(a * PI) * 1.2; BOX.g.visible = k < 0.3;
        ov.truckDx = 26 * ease(seg(k, 0.35, 0.95)); live('st', k < 0.35 ? tri('xếp lên xe', '装车', 'loading') : tri('xuất hàng ✓', '出货 ✓', 'shipped ✓'));
        place(S1.s, 'xuat', 0.5, 3.2, 2.6); S1.draw([F('出货', 50, '#1f2328', 800), F('终检合格才出货', 34, '#2b8a3e')]); }},
  };

  // ---------- chạy nền (máy luôn chạy) ----------
  function ambient(dt, now){
    workers.forEach(w => { w.arms[0].rotation.x = 0.9 + 0.14 * Math.sin(now * w.sp + w.ph); w.arms[1].rotation.x = 0.9 + 0.14 * Math.sin(now * w.sp + w.ph + 2); });
    AN.needles.forEach((n, i) => { n.m.position.y = n.y0 + 0.05 * Math.sin(now * 0.04 + i); });
    AN.emb.forEach((e, i) => { if(fx === FX.embroider && i === 3) return; e.m.position.x = e.x0 + 0.06 * Math.sin(now * 0.011 + i); e.m.position.z = e.z0 + 0.03 * Math.cos(now * 0.013 + i); });
    AN.drums.forEach(d => { d.rotation.y += dt * 2.5 * ov.drum; });
    if(!ov.press){ const c = (now / 3200) % 1, d = c < 0.15 ? c / 0.15 : c < 0.25 ? 1 : c < 0.45 ? 1 - (c - 0.25) / 0.2 : 0; AN.press.m.position.y = AN.press.y0 - 0.95 * d; }
    if(!ov.hpress) AN.hpress.m.position.y = AN.hpress.y0; if(!ov.btn) AN.btn.m.position.y = AN.btn.y0;
    if(AN.fabTex) AN.fabTex.offset.y += dt * 0.05 * ov.fab;
    AN.marks.forEach(m => { if(m.visible){ m.position.y -= dt * 0.05 * ov.fab * 2.6 / 2.2; if(m.position.y < -1.3) m.visible = false; } });
    AN.heat.forEach((m, i) => { m.material.emissiveIntensity = 0.25 + (ov.heat ? 0.45 + 0.2 * Math.sin(now * 0.008 + i) : 0.08 * Math.sin(now * 0.002 + i)); });
    AN.plies.forEach(m => m.visible = ov.plies); AN.formCaps.forEach((g, i) => g.visible = ov.formCap || i !== 1); AN.qcMinis.forEach(g => g.visible = ov.qcMini); AN.mayMinis.forEach(g => g.visible = ov.mayMini);
    AN.truck.forEach(o => { o.m.position.x = o.x0 + ov.truckDx; o.m.visible = ov.truckDx < 24; });
    if(AN.spreader){ AN.spreader.visible = ov.plies; AN.spreader.position.x = -0.6 + 3.2 * Math.sin(now * 0.00035); }
    if(AN.relaxTex) AN.relaxTex.offset.y += dt * 0.12;
    if(!ov.laser && AN.lhead){ const t = now * 0.0006, gx = 2.4 + 0.85 * Math.sin(t * 1.3); AN.lgantry.m.position.x = gx; AN.lhead.m.position.x = gx; AN.lhead.m.position.z = 3.95 + 0.38 * Math.sin(t * 3.1); }
    if(AN.lhead2){ AN.lhead2.m.position.x = 5.0 + 0.3 * Math.sin(now * 0.002); AN.lhead2.m.position.z = 2.9 + 0.25 * Math.cos(now * 0.0027); }
    AN.rivet.forEach((r, i) => { r.m.position.y = r.y0 - 0.12 * Math.pow(Math.max(0, Math.sin(now * 0.006 + i * 2)), 6); });
    convBoxes.forEach((b, i) => { b.m.visible = ov.conv || i !== 1; b.t = (b.t + dt * 0.12) % 1; b.m.position.x = -0.3 + 3.0 * b.t; const inside = b.m.position.x > 0.75 && b.m.position.x < 1.65; if(ov.conv || i !== 1) AN.det[i].material.emissive.setHex(inside ? 0x1c7ed6 : 0x000000); });
  }

  return {
    has: id => !!FX[id],
    enter(b, f){ [S1, S2, PAD].forEach(d => d.f = f || 1); reset(); beat = b; fx = FX[b.fx] || null; if(!fx) return null; fx.enter(); fx.run(0, 0); return {sid: fx.sid, at: WP(fx.sid, ...fx.at), cam: fx.cam}; },
    run(k, dt){ if(fx) fx.run(k, dt); },
    end(){ reset(); fx = null; beat = null; },
    tick: ambient,
    live: () => L,
    follow: () => follow,
  };
}
