// ========== XƯỞNG 3D (thế giới mô phỏng) ==========
// Dùng three.js r128 tải từ CDN khi mở tab. Bố trí theo thứ tự quy trình, không phải mặt bằng thật.
const W3 = (() => {
  const LIBS = ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
                'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'];
  const ORDER = ST.map(s => s.id);
  // vị trí tâm mỗi khâu (x, z) và độ cao sàn; may đặt trên sàn cao (tầng 2), giặt ghi tầng 1
  // xếp ngoằn ngoèo 3 cột để vừa màn hình điện thoại dọc
  const POS = { mau:[-15,-21,0], kho:[0,-21,0], kiemvai:[15,-21,0], cat:[15,-6,0], theu:[0,-6,0],
    'in':[-15,-6,0], giat:[-15,9,0], may:[0,9,2.4], dinhform:[15,9,0], qc:[15,24,0], xuat:[0,24,0] };
  const SIZE = { may:[15,11] };
  let started = false, ok = false, T = null, cur = null, near = false, tour = null, W3frames = 0;
  const $c = id => document.getElementById(id);

  function load(src){ return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(src); document.head.appendChild(s); }); }
  function status(msg, bad){ const el = $c('w3msg'); if(!el) return; el.textContent = msg || ''; el.hidden = !msg; el.classList.toggle('bad', !!bad); }

  async function open(){
    renderChips();
    if(!cur) renderInfo(null);
    if(sim) sim.last = performance.now();
    if(started){ if(ok) T.play(); return; }
    started = true; status('Đang tải mô hình 3D…');
    try { if(!window.THREE) await load(LIBS[0]); if(!THREE.OrbitControls) await load(LIBS[1]); }
    catch(e){ status('Không tải được thư viện 3D (cần mạng). Vẫn xem được chi tiết từng khâu bên dưới, hoặc xem sơ đồ ở tab Sơ đồ.', true); return; }
    try { T = build(); ok = true; status(''); T.play(); }
    catch(e){ console.error(e); status('Máy này không hiển thị được 3D. Chi tiết từng khâu vẫn xem ở bên dưới.', true); }
  }
  function pause(){ if(ok) T.stop(); if(sim && sim.play){ simStep(); sim.play = false; renderSimPeek(); } }

  // ---------------- dựng cảnh ----------------
  function build(){
    const box = $c('w3view'), cv = $c('w3canvas');
    const renderer = new THREE.WebGLRenderer({canvas: cv, antialias: true, alpha: false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe9edf1);
    scene.fog = new THREE.Fog(0xe9edf1, 110, 190);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.5, 400);
    const controls = new THREE.OrbitControls(camera, cv);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI * 0.47; controls.minDistance = 6; controls.maxDistance = 120;
    controls.target.set(0, 0, 6);
    camera.position.set(0, 58, 66);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa3ad, 0.85));
    const sun = new THREE.DirectionalLight(0xffffff, 0.75); sun.position.set(30, 60, 25); scene.add(sun);

    const matCache = {};
    const M = (hex, o) => { const k = hex + JSON.stringify(o || {}); if(!matCache[k]) matCache[k] = new THREE.MeshLambertMaterial(Object.assign({color: new THREE.Color(hex).convertSRGBToLinear()}, o || {})); return matCache[k]; };
    const add = (g, geo, hex, x, y, z, o) => { const m = new THREE.Mesh(geo, M(hex, o)); m.position.set(x || 0, y || 0, z || 0); g.add(m); return m; };
    const bx = (g, w, h, d, hex, x, y, z, o) => add(g, new THREE.BoxGeometry(w, h, d), hex, x, y + h / 2, z, o);
    const cy = (g, r, h, hex, x, y, z, seg, o) => add(g, new THREE.CylinderGeometry(r, r, h, seg || 16), hex, x, y + h / 2, z, o);
    const roll = (g, r, len, hex, x, y, z, rotY) => { const m = add(g, new THREE.CylinderGeometry(r, r, len, 14), hex, x, y, z); m.rotation.z = Math.PI / 2; if(rotY) m.rotation.y = rotY; return m; };

    // sàn nhà xưởng
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(90, 100), M('#dcd7cc'));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, 1.5); scene.add(floor);
    const grid = new THREE.GridHelper(90, 30, 0xc7c0b2, 0xd1cbbf); grid.position.set(0, 0.01, 1.5); scene.add(grid);

    // ---- chữ trên canvas ----
    function textCanvas(lines, opt){
      opt = opt || {}; const W = opt.w || 640, H = opt.h || 220, c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d');
      x.fillStyle = opt.bg || 'rgba(255,255,255,0.94)'; roundRect(x, 4, 4, W - 8, H - 8, 26); x.fill();
      x.strokeStyle = opt.edge || '#1f2328'; x.lineWidth = 5; x.stroke();
      let left = 30;
      if(opt.badge != null){ x.fillStyle = opt.color || '#333'; x.beginPath(); x.arc(76, H / 2, 50, 0, Math.PI * 2); x.fill(); x.fillStyle = '#fff'; x.font = '700 54px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(opt.badge), 76, H / 2 + 2); left = 146; }
      x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      const ys = lines.length === 3 ? [72, 136, 192] : lines.length === 2 ? [96, 168] : [130];
      lines.forEach((l, i) => { x.fillStyle = l.c || '#1f2328'; x.font = l.f; fitText(x, l.t, W - left - 24); x.fillText(l.t, left, ys[i]); });
      return c;
    }
    function fitText(x, t, w){ let sz = parseInt(x.font.match(/(\d+)px/)[1], 10); while(x.measureText(t).width > w && sz > 16){ sz -= 2; x.font = x.font.replace(/\d+px/, sz + 'px'); } }
    function roundRect(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
    function sprite(canvas, sx, sy){ const t = new THREE.CanvasTexture(canvas); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; const s = new THREE.Sprite(new THREE.SpriteMaterial({map: t, depthTest: false, transparent: true})); s.scale.set(sx, sy, 1); s.renderOrder = 10; return s; }
    function signBoard(g, lines, x, y, z, w, h, rotY){ const c = textCanvas(lines, {w: 640, h: 220}); const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({map: t, transparent: true})); m.position.set(x, y, z); if(rotY) m.rotation.y = rotY; g.add(m); return m; }

    // ---- các khâu ----
    const stations = {}, pick = [], hsAll = {};
    // các bộ phận máy chạy được (mô phỏng sản xuất dùng)
    const AN = {needles: [], emb: [], drums: [], heat: [], plies: [], formCaps: [], qcMinis: [], mayMinis: [], truck: [], det: [], marks: [], rivet: [], press: null, hpress: null, btn: null, fabTex: null, relaxTex: null, spreader: null, lgantry: null, lhead: null, lhead2: null};
    const mov = (m) => ({m, x0: m.position.x, y0: m.position.y, z0: m.position.z});
    function hs(sid, zh, x, y, z, label){ (hsAll[sid] = hsAll[sid] || []).push({zh, p: new THREE.Vector3(x, y, z), label}); }
    const mini = (g, hex, x, y, z, s) => { s = s || 1; const q = new THREE.Group(); q.position.set(x, y, z); g.add(q); add(q, new THREE.SphereGeometry(0.42 * s, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), hex, 0, 0, 0); const brim = add(q, new THREE.CylinderGeometry(0.36 * s, 0.36 * s, 0.05 * s, 14, 1, false, -Math.PI / 2, Math.PI), hex, 0, 0.02, 0.3 * s); brim.scale.set(1, 1, 1.1); add(q, new THREE.SphereGeometry(0.06 * s, 8, 6), '#222', 0, 0.42 * s, 0); return q; };
    const head = (g, x, y, z, hex) => { cy(g, 0.08, 0.9, '#888', x, y, z, 8); add(g, new THREE.SphereGeometry(0.45, 16, 12), hex || '#c9ccd1', x, y + 1.25, z); };
    const table = (g, w, d, x, z, hex) => { bx(g, w, 0.12, d, hex || '#b89b74', x, 0.86, z); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => bx(g, 0.12, 0.86, 0.12, '#6b6f75', x + a * (w / 2 - 0.15), 0, z + b * (d / 2 - 0.15))); };
    const carton = (g, x, y, z, hex) => bx(g, 0.9, 0.7, 0.7, hex || '#c49a63', x, y, z);
    const sewMachine = (g, x, z) => { table(g, 1.8, 0.9, x, z, '#d8d2c4'); bx(g, 0.9, 0.18, 0.3, '#f1f1ee', x, 0.98, z); bx(g, 0.18, 0.5, 0.3, '#f1f1ee', x + 0.36, 0.98, z); bx(g, 0.75, 0.18, 0.3, '#f1f1ee', x + 0.05, 1.42, z); AN.needles.push(mov(cy(g, 0.03, 0.25, '#555', x - 0.25, 1.18, z, 6))); };

    const BUILD = {
      mau(g){ table(g, 4.2, 1.8, -1.5, -1.5); [-2.9, -1.5, -0.1].forEach((x, i) => { head(g, x, 0.98, -1.5, '#d8dbe0'); mini(g, ['#1d3557', '#e9c46a', '#2a9d8f'][i], x, 2.25, -1.5); });
        bx(g, 1.6, 0.02, 1.0, '#f4efe2', 1.2, 0.98, -1.4); bx(g, 0.9, 0.02, 0.7, '#fdf6d8', 1.4, 1.0, -1.2);
        cy(g, 1.4, 0.1, '#8d6e53', 2.6, 0.8, 2.2, 24); cy(g, 0.15, 0.8, '#666', 2.6, 0, 2.2, 8); [[0, 1.9], [1.9, 0], [0, -1.9], [-1.9, 0]].forEach(([a, b]) => bx(g, 0.5, 0.5, 0.5, '#4a4e69', 2.6 + a, 0, 2.2 + b));
        signBoard(g, [{t: '样品室', f: '700 74px sans-serif'}, {t: 'Phòng mẫu · Sample room', f: '500 34px sans-serif', c: '#555'}], -3.6, 2.6, -3.9, 3.4, 1.2);
        hs('mau', '样品室', -3.6, 2.7, -3.8); hs('mau', '产前样', -1.5, 2.6, -1.5); hs('mau', '确认样', -2.9, 2.6, -1.5); hs('mau', '纸样', 1.2, 1.1, -1.4); hs('mau', '产前会议', 2.6, 1.4, 2.2); hs('mau', '审样', -0.1, 2.6, -1.5); },
      kho(g){ const rack = (x, z) => { [-1.9, 1.9].forEach(a => [-0.55, 0.55].forEach(b => bx(g, 0.1, 3.2, 0.1, '#2f5d8a', x + a, 0, z + b))); [0.2, 1.25, 2.3].forEach((y, i) => { bx(g, 3.9, 0.08, 1.2, '#7f8c99', x, y, z); for(let k = 0; k < 6; k++) roll(g, 0.2, 1.1, ['#264653', '#e76f51', '#2a9d8f', '#f4a261', '#e9c46a', '#8d99ae'][(k + i) % 6], x - 1.6 + k * 0.62, y + 0.3, z, Math.PI / 2); }); };
        rack(-2.6, -2.8); rack(2.4, -2.8); bx(g, 2.2, 0.15, 1.6, '#a07c55', 2.6, 0, 2.4); [[0, 0], [0.95, 0], [0.48, 0.72]].forEach(([a, b]) => carton(g, 2.15 + a, 0.15 + b, 2.4)); carton(g, 2.6, 0.15, 2.4 - 0.75);
        table(g, 2.4, 1.2, -2.5, 2.2, '#cfc6b6'); bx(g, 0.7, 0.02, 0.5, '#fff', -2.7, 0.98, 2.2); bx(g, 0.5, 0.3, 0.35, '#333', -1.8, 0.98, 2.2);
        [['#2e8a4f', -0.9], ['#e9c46a', -0.3], ['#c0392b', 0.3]].forEach(([c, x]) => bx(g, 0.45, 0.32, 0.03, c, x - 2.6, 2.75, -2.15));
        signBoard(g, [{t: 'C24-3-2', f: '700 80px monospace'}, {t: 'kệ – tầng – ô', f: '500 38px sans-serif', c: '#555'}], 2.4, 3.6, -2.15, 1.8, 0.62);
        hs('kho', '仓库', -4.8, 3.4, -2.8); hs('kho', '储位', 2.4, 3.8, -2.1); hs('kho', '主料', -1.4, 1.6, -2.4); hs('kho', '物料状态标识', -2.9, 3.0, -2.1); hs('kho', '辅料', 2.6, 1.9, 2.4); hs('kho', '点收', -2.7, 1.2, 2.2); hs('kho', '领料单', -1.8, 1.4, 2.2); },
      kiemvai(g){ // máy kiểm vải
        [-1.9, 1.9].forEach(a => bx(g, 0.25, 2.8, 0.25, '#4d5b6a', -1.5 + a, 0, -1.6)); bx(g, 4.2, 0.25, 0.3, '#4d5b6a', -1.5, 2.8, -1.6);
        roll(g, 0.35, 3.6, '#1d3557', -1.5, 0.6, -0.9); roll(g, 0.3, 3.6, '#1d3557', -1.5, 3.05, -1.9);
        const fab = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.6), new THREE.MeshLambertMaterial({map: weaveTex(), side: THREE.DoubleSide})); fab.position.set(-1.5, 1.85, -1.38); g.add(fab); fab.rotation.x = -0.35; AN.fabTex = fab.material.map;
        for(let i = 0; i < 8; i++){ const mk = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.07), new THREE.MeshBasicMaterial({color: 0xe03131})); mk.position.set(-1.2 + (i % 4) * 0.75, 0, 0.012); mk.visible = false; fab.add(mk); AN.marks.push(mk); }
        const lb = add(g, new THREE.BoxGeometry(3.7, 2.2, 0.2), '#fffbe6', -1.5, 1.85, -1.62, {emissive: new THREE.Color(0xfff2b3), emissiveIntensity: 0.6}); lb.rotation.x = -0.35;
        // 4 lỗi trên vải: 1, 2, 3, 4 điểm theo chiều dài
        [[0.35, -2.7, 2.6], [0.75, -1.9, 2.15], [1.1, -1.1, 1.7], [1.5, -0.2, 1.3]].forEach(([len, x, y], i) => { const d = add(g, new THREE.PlaneGeometry(len, 0.08), '#e63946', x + len / 2 - 0.2, y, -1.2 + (2.6 - y) * 0.36); d.rotation.x = -0.35; hs('kiemvai', '四分制', x - 0.2, y + 0.15, -1.1 + (2.6 - y) * 0.36, ['≤3 in → 1 điểm', '3–6 in → 2 điểm', '6–9 in → 3 điểm', '>9 in → 4 điểm'][i]); });
        bx(g, 0.5, 0.35, 0.3, '#222', 0.75, 2.6, -1.6); bx(g, 1.2, 0.2, 1.0, '#9aa5b1', 1.6, 0, 0.6);
        bx(g, 1.4, 1.0, 0.04, '#fff', -4.2, 1.4, -2.6); bx(g, 0.5, 0.7, 0.03, '#f6d365', -1.0, 1.0, 0.9);
        // phòng kiểm nghiệm
        bx(g, 3.2, 2.4, 1.0, '#e8f1f2', 3.4, 0, -2.6, {transparent: true, opacity: 0.75}); bx(g, 1.0, 1.0, 0.8, '#6c7a89', 2.5, 0, 1.9); bx(g, 1.1, 1.4, 0.9, '#b0b8c1', 4.0, 0, 1.9);
        signBoard(g, [{t: '检验室', f: '700 74px sans-serif'}, {t: 'Phòng kiểm nghiệm · Lab', f: '500 34px sans-serif', c: '#555'}], 3.4, 3.0, -2.05, 3.0, 1.05);
        hs('kiemvai', '验布机', -3.6, 3.2, -1.6); hs('kiemvai', '灯箱', -1.5, 1.2, -1.2); hs('kiemvai', '码数计数器', 0.75, 3.1, -1.5); hs('kiemvai', '电子秤', 1.6, 0.5, 0.6); hs('kiemvai', '扣分参考样', -4.2, 2.6, -2.5); hs('kiemvai', '验布检查表', -1.0, 1.9, 0.95); hs('kiemvai', '检验室', 3.4, 2.6, -2.5); hs('kiemvai', '黄变测试仪', 2.5, 1.2, 1.9); hs('kiemvai', '烘箱', 4.0, 1.6, 1.9); hs('kiemvai', '色牢度', 3.4, 1.4, -2.0); },
      cat(g){ table(g, 7.5, 1.7, -0.6, -2.4, '#c9c1ad'); ['#264653', '#2a9d8f', '#264653', '#2a9d8f', '#264653', '#2a9d8f', '#264653'].forEach((c, i) => AN.plies.push(bx(g, 7.1, 0.05, 1.5, c, -0.6, 0.98 + i * 0.05, -2.4))); roll(g, 0.32, 1.6, '#264653', 3.6, 1.6, -2.4, Math.PI / 2);
        bx(g, 7.1, 0.02, 1.5, '#b07a43', -0.6, 0.97, -2.4);
        // máy chặt
        bx(g, 1.8, 0.9, 1.6, '#51606f', -3.6, 0, 1.3); bx(g, 0.3, 1.8, 0.3, '#51606f', -3.6, 0.9, 0.7); AN.press = mov(bx(g, 1.6, 0.25, 1.4, '#8a99a8', -3.6, 2.0, 1.3)); const die = bx(g, 1.0, 0.12, 0.8, '#c0c4c8', -3.6, 0.95, 1.3); die.material = M('#c0c4c8', {emissive: new THREE.Color(0x222222)});
        // máy dán
        bx(g, 3.0, 1.1, 1.0, '#3d5a80', 0.4, 0, 1.6); roll(g, 0.25, 1.1, '#e0fbfc', -1.3, 0.9, 1.6, Math.PI / 2); roll(g, 0.25, 1.1, '#264653', 2.1, 0.9, 1.6, Math.PI / 2);
        // bó mảnh cắt
        [[3.3, 0.4], [3.9, 0.4], [3.3, 1.1], [3.9, 1.1]].forEach(([x, z]) => { bx(g, 0.5, 0.35, 0.5, '#2a9d8f', x, 0, z + 1.0); bx(g, 0.52, 0.04, 0.12, '#f1faee', x, 0.2, z + 1.0); }); bx(g, 0.5, 0.6, 0.5, '#6d6875', 4.6, 0, -0.6); cy(g, 0.12, 0.25, '#e9c46a', 4.6, 0.6, -0.6, 10);
        hs('cat', '拉布', -0.6, 1.5, -2.4); hs('cat', '牛皮纸', -3.6, 1.0, -1.7); hs('cat', '刀模', -3.6, 1.3, 1.3); hs('cat', '直线贴合机', 0.4, 1.4, 1.6); hs('cat', '裁片', 3.3, 0.7, 1.4); hs('cat', '绑片', 3.9, 0.7, 2.1); hs('cat', '待装片区', 3.6, 1.2, 1.8); hs('cat', '顶扣包布', 4.6, 1.1, -0.6);
        // 05/11 (báo cáo xưởng cắt): máy xả vải, máy trải tự động Sertol, kệ dao, xẻ viền, laser, dập khuy
        bx(g, 0.9, 0.45, 1.8, '#6c757d', 5.0, 0, -3.0); [-3.85, -2.15].forEach(z => bx(g, 0.1, 1.6, 0.1, '#6c757d', 5.0, 0.45, z));
        roll(g, 0.3, 1.5, '#264653', 5.0, 1.85, -3.0, Math.PI / 2); roll(g, 0.4, 1.5, '#2a9d8f', 5.0, 0.95, -3.0, Math.PI / 2);
        { const rt = weaveTex(); rt.repeat.set(1, 2); const sh = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.75), new THREE.MeshLambertMaterial({map: rt, side: THREE.DoubleSide})); sh.position.set(5.32, 1.42, -3.0); sh.rotation.y = Math.PI / 2; g.add(sh); AN.relaxTex = rt; }
        { const sp = new THREE.Group(); sp.position.set(-0.6, 0, -2.4); g.add(sp); bx(sp, 0.5, 0.45, 1.95, '#f08c00', 0, 1.4, 0); [-0.98, 0.98].forEach(z => bx(sp, 0.12, 1.4, 0.12, '#f08c00', 0, 0, z)); roll(sp, 0.2, 1.6, '#264653', 0, 1.62, 0, Math.PI / 2); AN.spreader = sp; }
        [0.15, 0.85, 1.55, 2.25].forEach(y => bx(g, 0.7, 0.05, 2.8, '#868e96', -5.35, y, -2.4)); [-3.75, -1.05].forEach(z => [-5.65, -5.05].forEach(x => bx(g, 0.06, 2.3, 0.06, '#495057', x, 0, z)));
        for(let r = 0; r < 3; r++) for(let i = 0; i < 7; i++) bx(g, 0.5, 0.42, 0.04, '#ced4da', -5.35, 0.2 + r * 0.7, -3.55 + i * 0.38);
        signBoard(g, [{t: '刀模架 M13 · M14', f: '700 60px sans-serif'}, {t: 'Kệ dao chặt · Die rack', f: '500 34px sans-serif', c: '#555'}], -5.35, 2.95, -2.4, 1.6, 0.55, Math.PI / 2);
        bx(g, 1.5, 0.85, 0.8, '#5c7cfa', -1.4, 0, 3.95); roll(g, 0.25, 1.2, '#264653', -1.4, 1.1, 3.95); for(let i = 0; i < 4; i++) bx(g, 0.07, 0.02, 0.55, '#264653', -1.85 + i * 0.3, 0.85, 4.55);
        bx(g, 2.2, 0.85, 1.1, '#e9ecef', 2.4, 0, 3.95); bx(g, 2.0, 0.03, 0.95, '#343a40', 2.4, 0.85, 3.95); bx(g, 2.2, 0.55, 0.06, '#adb5bd', 2.4, 0.85, 3.42); bx(g, 0.32, 0.22, 0.05, '#212529', 3.3, 1.0, 4.52);
        AN.lgantry = mov(bx(g, 0.12, 0.1, 1.0, '#adb5bd', 2.4, 1.05, 3.95)); AN.lhead = mov(bx(g, 0.14, 0.2, 0.14, '#e03131', 2.4, 0.98, 3.95));
        bx(g, 0.9, 0.9, 0.8, '#343a40', 5.0, 0, 2.9); bx(g, 0.8, 0.04, 0.7, '#495057', 5.0, 0.9, 2.9); bx(g, 0.06, 0.8, 0.06, '#212529', 5.0, 0.9, 3.25); bx(g, 0.95, 0.28, 0.45, '#212529', 5.0, 1.6, 2.95); bx(g, 0.5, 0.04, 0.05, '#f8f9fa', 5.0, 1.78, 2.72); AN.lhead2 = mov(bx(g, 0.1, 0.12, 0.1, '#e03131', 5.0, 0.98, 2.9));
        for(let i = 0; i < 3; i++){ const x = -5.1 + i * 0.85, z = 3.95; bx(g, 0.6, 0.85, 0.6, '#495057', x, 0, z); bx(g, 0.12, 0.8, 0.12, '#343a40', x, 0.85, z - 0.2); AN.rivet.push(mov(bx(g, 0.22, 0.18, 0.28, '#adb5bd', x, 1.38, z))); cy(g, 0.18, 0.14, '#ced4da', x, 1.65, z - 0.2, 12); }
        hs('cat', '松布', 5.0, 2.3, -3.0, 'Máy xả vải'); hs('cat', '自动拉布', 2.6, 2.0, -2.4, 'Máy trải vải tự động Sertol'); hs('cat', '刀模', -5.35, 2.5, -1.4, 'Kệ dao chặt M13, M14…');
        hs('cat', '镭射切割', 2.4, 1.4, 3.95, 'Máy laser bàn lớn (màn hình Ogbos)'); hs('cat', '打标机', 5.0, 2.2, 2.9, 'Máy khắc CKLASER 超级打标机 2.0'); hs('cat', '打扣', -4.25, 1.95, 3.95, 'Dãy máy dập khuy tự động'); },
      theu(g){ bx(g, 6.4, 1.0, 1.4, '#e5e5e5', 0, 0, -1.8); bx(g, 6.4, 0.4, 0.6, '#4a7c59', 0, 1.6, -2.2); for(let i = 0; i < 6; i++){ const x = -2.6 + i * 1.04; AN.emb.push(mov(bx(g, 0.5, 0.8, 0.5, '#f0f0f0', x, 1.0, -1.7))); for(let k = 0; k < 4; k++) cy(g, 0.07, 0.25, ['#e63946', '#1d3557', '#f4a261', '#2a9d8f'][k], x - 0.2 + k * 0.13, 2.0, -2.25, 8); bx(g, 0.7, 0.02, 0.5, '#264653', x, 1.0, -1.25); }
        sewMachine(g, -2, 1.8); bx(g, 0.5, 0.5, 0.05, '#f1faee', 2.0, 1.4, 1.2); mini(g, '#264653', 2.0, 0.98, 1.8);
        hs('theu', '绣花', -0.5, 2.6, -1.8); hs('theu', '前片', -1.5, 1.2, -1.2); hs('theu', '绣洞', -2, 1.8, 1.8); hs('theu', '首件检验', 2.0, 1.9, 1.3); },
      'in'(g){ table(g, 3.6, 1.6, -1.8, -1.8, '#ced4da'); bx(g, 1.4, 0.06, 1.0, '#495057', -2.2, 1.0, -1.8); bx(g, 1.5, 0.08, 1.1, '#adb5bd', -2.2, 1.35, -1.8, {transparent: true, opacity: 0.6}); bx(g, 0.6, 0.02, 0.5, '#e63946', -0.8, 1.0, -1.8);
        bx(g, 1.2, 0.9, 1.0, '#343a40', 2.0, 0, -1.4); bx(g, 0.25, 1.2, 0.25, '#343a40', 2.0, 0.9, -1.85); AN.hpress = mov(bx(g, 1.0, 0.18, 0.8, '#adb5bd', 2.0, 1.9, -1.35)); bx(g, 0.9, 0.05, 0.7, '#f8f9fa', 2.0, 0.92, -1.35);
        for(let i = 0; i < 4; i++) bx(g, 1.6, 0.04, 0.9, '#dee2e6', 1.6, 0.4 + i * 0.35, 1.8); [0.4, 0.75, 1.1].forEach((y, i) => bx(g, 0.6, 0.02, 0.5, ['#e63946', '#1d3557', '#f4a261'][i], 1.6, y + 0.03, 1.8));
        hs('in', '丝印', -2.2, 1.7, -1.8); hs('in', '转印', 2.0, 2.3, -1.35); hs('in', '印花', 1.6, 1.5, 1.8); },
      giat(g){ const washer = (x, z, s) => { bx(g, 1.6 * s, 1.7 * s, 1.5 * s, '#d9dde1', x, 0, z); const d = add(g, new THREE.CylinderGeometry(0.5 * s, 0.5 * s, 0.1, 20), '#7a8a99', x, 0.9 * s, z + 0.76 * s); d.rotation.x = Math.PI / 2; const pd = new THREE.Mesh(new THREE.BoxGeometry(0.78 * s, 0.04, 0.12 * s), M('#dee2e6')); pd.position.y = 0.06; d.add(pd); AN.drums.push(d); };
        [-3.2, -1.1, 1.0].forEach(x => washer(x, -2.2, 1.25)); [-3.6, -2.2, -0.8, 0.6, 2.0].forEach(x => washer(x, 1.6, 0.75)); mini(g, '#7f5539', 3.6, 0.0, 1.6, 1.2); mini(g, '#606c38', 3.6, 0.0, 0.6, 1.2);
        signBoard(g, [{t: 'Tầng 1 · 一楼', f: '700 64px sans-serif'}, {t: 'khoảng 8 máy: 3 lớn, 5 nhỏ', f: '500 34px sans-serif', c: '#555'}], 3.6, 2.6, -2.9, 2.8, 1.0);
        hs('giat', '洗水', -1.1, 2.6, -2.2); hs('giat', '水洗帽', 3.6, 0.9, 1.1); },
      may(g){ // sàn tầng 2 nên y đã cao
        for(let r = 0; r < 2; r++) for(let i = 0; i < 5; i++) sewMachine(g, -5.2 + i * 2.2, -2.8 + r * 2.3);
        bx(g, 1.6, 1.3, 1.2, '#3d5a80', 4.6, 0, -2.8); cy(g, 0.12, 0.4, '#e0e1dd', 4.6, 1.3, -2.8, 10);
        bx(g, 1.4, 1.1, 1.2, '#5e6472', 4.6, 0, -0.5); bx(g, 0.2, 1.0, 0.2, '#5e6472', 4.6, 1.1, -0.9); AN.btn = mov(bx(g, 0.5, 0.3, 0.4, '#adb5bd', 4.6, 1.9, -0.6));
        sewMachine(g, 2.6, 2.6); bx(g, 1.4, 0.1, 0.6, '#2b2d42', 2.6, 1.42, 2.6);
        [[-4, 2.4], [-3.2, 2.4], [-2.4, 2.4]].forEach(([x, z], i) => AN.mayMinis.push(mini(g, ['#1d3557', '#457b9d', '#e63946'][i], x, 0.98, z)));
        table(g, 3.2, 1.0, -3.2, 2.4, '#d8d2c4');
        signBoard(g, [{t: 'Tầng 2 · 二楼', f: '700 64px sans-serif'}, {t: '30 công đoạn · 30道工序', f: '500 34px sans-serif', c: '#555'}], 0, 3.0, -4.9, 3.2, 1.1);
        hs('may', '车缝', -5.2, 2.0, -2.8); hs('may', '合片', -3.0, 2.0, -0.5); hs('may', '束眉', 4.6, 2.0, -2.8); hs('may', '绕线', 4.6, 1.6, -2.4); hs('may', '打顶扣', 4.6, 2.4, -0.5); hs('may', '电脑车', 2.6, 2.0, 2.6); hs('may', '汗带', -3.2, 1.6, 2.4); hs('may', '巡检', -0.8, 2.2, 0.2); },
      dinhform(g){ bx(g, 2.6, 1.2, 1.4, '#6c757d', -1.8, 0, -1.6); ['#e76f51', '#f4a261', '#e9c46a'].forEach((c, i) => { const z = bx(g, 0.7, 0.3, 1.0, c, -2.6 + i * 0.8, 1.2, -1.6); z.material = new THREE.MeshLambertMaterial({color: new THREE.Color(c).convertSRGBToLinear(), emissive: new THREE.Color(c), emissiveIntensity: 0.25}); AN.heat.push(z); });
        signBoard(g, [{t: 'TYL-1908-R', f: '700 70px monospace'}, {t: '3 vùng nhiệt · 3个加热区', f: '500 34px sans-serif', c: '#555'}], -1.8, 2.6, -2.35, 2.4, 0.84);
        [-0.2, 1.4, 3.0].forEach((x, i) => { cy(g, 0.12, 1.0, '#868e96', x, 0, 1.4, 8); add(g, new THREE.SphereGeometry(0.5, 16, 12), '#ced4da', x, 1.4, 1.4); AN.formCaps.push(mini(g, ['#264653', '#e63946', '#1d3557'][i], x, 1.42, 1.4, 1.2)); });
        hs('dinhform', '弯眉整烫', -1.8, 1.9, -1.6); hs('dinhform', '头模', -0.2, 2.3, 1.4); hs('dinhform', '前整烫', 1.4, 2.3, 1.4); },
      qc(g){ [[-2, -1.4], [2, -1.4]].forEach(([x, z]) => { table(g, 3.0, 1.3, x, z, '#e9ecef'); head(g, x - 0.8, 0.98, z); AN.qcMinis.push(mini(g, '#1d3557', x - 0.8, 2.24, z)); bx(g, 0.5, 0.04, 0.35, '#212529', x + 0.6, 0.98, z); [0, 1].forEach(k => AN.qcMinis.push(mini(g, '#457b9d', x + 0.2 + k * 0.5, 0.98, z + 0.4, 0.8))); });
        bx(g, 2.4, 1.6, 0.06, '#fff', 0, 1.2, -3.0); signBoard(g, [{t: '六片帽检验顺序', f: '700 58px sans-serif'}, {t: '15 điểm · 15 points', f: '500 36px sans-serif', c: '#555'}], 0, 2.0, -2.95, 2.3, 0.8);
        bx(g, 0.9, 0.6, 0.6, '#c0392b', 3.8, 0, 1.6);
        hs('qc', '尾查', -2, 1.4, -1.0); hs('qc', '六片帽检验顺序', 0, 2.5, -2.9); hs('qc', '帽围', -2.8, 2.6, -1.4); hs('qc', '线尾检验', 2, 1.4, -1.0); hs('qc', '返工', 3.8, 0.9, 1.6); },
      xuat(g){ table(g, 3.2, 1.4, -3.0, -2.2, '#d8d2c4'); [0, 1].forEach(k => mini(g, '#1d3557', -3.6 + k * 0.8, 0.98, -2.2)); bx(g, 0.3, 0.4, 0.02, '#f1faee', -2.0, 1.0, -2.2);
        for(let r = 0; r < 3; r++) for(let c = 0; c < 3; c++) carton(g, -4.0 + c * 0.95, r * 0.72, 1.6); bx(g, 0.45, 0.25, 0.02, '#fff', -3.05, 1.6, 1.99);
        for(let i = 0; i < 4; i++){ const z = -2.6 + i * 1.3; bx(g, 3.0, 0.7, 0.6, '#495057', 1.2, 0, z); const d = bx(g, 0.9, 1.1, 0.8, '#1971c2', 1.2, 0.7, z); d.material = new THREE.MeshLambertMaterial({color: new THREE.Color('#1971c2').convertSRGBToLinear(), transparent: true, opacity: 0.85}); AN.det.push(d); }
        bx(g, 0.35, 0.2, 0.25, '#f59f00', -1.4, 0.98, -2.0);
        AN.truck.push(mov(bx(g, 3.2, 2.2, 1.8, '#adb5bd', 4.3, 0.5, 2.6)), mov(bx(g, 1.2, 1.6, 1.8, '#1d3557', 2.4, 0.5, 2.6))); [[2.4, 1.9], [2.4, 3.3], [4.8, 1.9], [4.8, 3.3]].forEach(([x, z]) => { const w = add(g, new THREE.CylinderGeometry(0.4, 0.4, 0.3, 14), '#212529', x, 0.4, z); w.rotation.x = Math.PI / 2; AN.truck.push(mov(w)); });
        hs('xuat', '包装', -3.0, 1.6, -2.2); hs('xuat', '吊牌', -2.0, 1.6, -2.2); hs('xuat', '水分测定仪', -1.4, 1.5, -2.0); hs('xuat', '外箱标签', -3.05, 2.0, 2.0); hs('xuat', '箱唛', -4.0, 2.4, 1.6); hs('xuat', '验针', 1.2, 2.2, -1.3); hs('xuat', '抽样', -3.6, 1.6, -1.6); hs('xuat', '出货', 3.6, 3.0, 2.6); hs('xuat', '装箱单', -2.4, 1.3, -2.6); },
    };

    const boards = {};
    ST.forEach(s => {
      const [x, z, y] = POS[s.id], [w, d] = SIZE[s.id] || [12, 10];
      const g = new THREE.Group(); g.position.set(x, y, z); g.userData.sid = s.id; scene.add(g);
      const plat = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, d), M(s.color, {transparent: true, opacity: 0.32}));
      plat.position.y = -0.15 + (y ? 0 : 0.16); g.add(plat);
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, 0.3, d)), new THREE.LineBasicMaterial({color: new THREE.Color(s.color)}));
      edge.position.copy(plat.position); g.add(edge);
      if(y){ // sàn tầng 2: cột đỡ + cầu thang
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { const c = new THREE.Mesh(new THREE.BoxGeometry(0.4, y, 0.4), M('#8d99ae')); c.position.set(a * (w / 2 - 0.4), -y / 2 - 0.3, b * (d / 2 - 0.4)); g.add(c); });
        for(let k = 0; k < 8; k++){ const st = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.5), M('#adb5bd')); st.position.set(w / 2 + 1.0, -y + 0.15 + k * (y / 8) - 0.3, d / 2 - 1 - k * 0.5); g.add(st); }
      }
      const inner = new THREE.Group(); inner.position.y = y ? 0.02 : 0.16; g.add(inner);
      (BUILD[s.id] || (() => {}))(inner);
      // nhãn nổi
      const lab = sprite(textCanvas([{t: s.vn, f: '700 44px sans-serif'}, {t: s.zh + '  ' + s.py, f: '500 36px sans-serif', c: '#333'}, {t: s.en, f: 'italic 30px sans-serif', c: '#666'}], {badge: s.n, color: s.color, edge: s.color}), 9, 3.1);
      lab.position.set(0, 5.6, 0); g.add(lab);
      let badge = null;
      if(s.qb){ const b = badge = sprite(textCanvas([{t: '保 品保部', f: '700 64px sans-serif', c: '#b23a3a'}], {w: 360, h: 120, edge: '#b23a3a'}), 2.6, 0.87); b.position.set(3.4, 7.3, 0); g.add(b); }
      // bảng ảnh thực tế
      const bd = new THREE.Group(); bd.position.set(-w / 2 + 1.0, 0, d / 2 - 0.8); bd.rotation.y = Math.PI / 5; g.add(bd);
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.6, 0.12), M('#495057')); post.position.y = 0.8; bd.add(post);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.8, 0.08), M('#212529')); frame.position.y = 2.4; bd.add(frame);
      const pic = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.6), new THREE.MeshBasicMaterial({map: placeholderTex()})); pic.position.set(0, 2.4, 0.05); pic.userData.photo = s.id; bd.add(pic);
      boards[s.id] = pic;
      stations[s.id] = {g, inner, plat, edge, w, d, y, lab, badge};
      g.traverse(o => { if(o.isMesh) pick.push(o); });
    });
    function weaveTex(){ const c = document.createElement('canvas'); c.width = 256; c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#1d3557'; x.fillRect(0, 0, 256, 256);
      for(let i = 0; i < 256; i += 4){ x.fillStyle = i % 8 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.12)'; x.fillRect(0, i, 256, 2); x.fillStyle = i % 8 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.04)'; x.fillRect(i, 0, 2, 256); }
      const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2.2); return t; }
    function placeholderTex(){ const c = textCanvas([{t: '📷 Ảnh thực tế', f: '700 52px sans-serif'}, {t: 'Bấm để thêm ảnh', f: '500 38px sans-serif', c: '#555'}], {w: 512, h: 356, bg: '#f8f9fa', edge: '#adb5bd'}); const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t; }

    // ---- đường đi của chiếc mũ ----
    const pts = [];
    ORDER.forEach(id => { const [x, z, y] = POS[id]; pts.push(new THREE.Vector3(x, y + 0.6, z)); });
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.2);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 400, 0.12, 6, false), M('#c08b3a')); scene.add(tube);
    const movers = [];
    const segOf = id => ORDER.indexOf(id) / (ORDER.length - 1);
    for(let i = 0; i < 14; i++){
      const m = new THREE.Group(); scene.add(m);
      const r = roll(m, 0.25, 0.7, '#264653', 0, 0.25, 0); const b = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.5), M('#2a9d8f')); b.position.y = 0.18; m.add(b);
      const cg = new THREE.Group(); m.add(cg); mini(cg, '#1d3557', 0, 0.02, 0, 0.9);
      movers.push({m, r, b, cg, t: i / 14});
    }
    const tCut = segOf('cat'), tMay = segOf('may');

    // ---- mô phỏng sản xuất ----
    const SIM = W3SIM({scene, stations, M, add, bx, cy, mini, AN});

    // ---- chọn khâu ----
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    let down = null;
    cv.addEventListener('pointerdown', e => { down = {x: e.clientX, y: e.clientY, t: performance.now()}; stopTourAuto(); });
    cv.addEventListener('pointerup', e => {
      if(!down) return; if(sim){ down = null; return; } const dx = e.clientX - down.x, dy = e.clientY - down.y, dt = performance.now() - down.t; down = null;
      if(dx * dx + dy * dy > 64 || dt > 600) return;
      const r = cv.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
      ray.setFromCamera(ndc, camera); const hit = ray.intersectObjects(pick, false)[0]; if(!hit) return;
      let o = hit.object, photo = o.userData.photo; while(o && !o.userData.sid) o = o.parent;
      if(!o) return;
      if(photo){ select(o.userData.sid, true); setTimeout(() => { const el = document.querySelector('#w3info .pics'); if(el) el.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 950); return; }
      select(o.userData.sid, true);
    });

    // ---- bay camera ----
    let fly = null;
    function flyTo(target, dist, az, el, ms){
      const from = {p: camera.position.clone(), t: controls.target.clone()};
      const off = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(dist);
      fly = {from, to: {p: target.clone().add(off), t: target.clone()}, t0: performance.now(), ms: ms || 900};
    }
    function fitDist(){ const vf = camera.fov * Math.PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect); return Math.max(25 / Math.tan(hf / 2), 31 / Math.tan(vf / 2)) * 1.02; }
    const overview = () => flyTo(new THREE.Vector3(0, 0, 2), fitDist(), 0, 0.95, 1000);
    function focus(sid, close){ const st = stations[sid]; const c = st.g.position.clone(); c.y += close ? 1.2 : 0.5; const k = camera.aspect < 0.8 ? 1.25 : 1;
      Object.values(stations).forEach(o => { o.lab.visible = !close; if(o.badge) o.badge.visible = !close; });
      flyTo(c, (close ? 11.5 : 19) * k, 0.35, close ? 0.62 : 0.78); }

    // ---- điểm chú thích (cận cảnh) ----
    const hsBox = $c('w3hs'); let hsEls = [];
    function showHotspots(sid){
      hsBox.innerHTML = ''; hsEls = [];
      if(!sid || !near) return;
      (hsAll[sid] || []).forEach(h => {
        const t = TI[h.zh]; if(!t) { console.warn('thiếu từ', h.zh); return; }
        const b = document.createElement('button'); b.className = 'hs' + (t.ok ? '' : ' q'); b.dataset.zh = h.zh;
        b.innerHTML = `<i></i><span><b lang="zh">${esc(h.zh)}</b> <em class="py">${esc(t.py)}</em><br><small class="vnt">${esc(h.label || t.vn)}</small> <small class="ent">${esc(h.label ? '' : t.en)}</small></span>`;
        hsBox.appendChild(b); hsEls.push({el: b, p: h.p, g: stations[sid].inner, w: b.offsetWidth, h: b.offsetHeight});
      });
    }
    const tmp = new THREE.Vector3();
    function placeHotspots(){
      if(!hsEls.length) return; const r = cv.getBoundingClientRect();
      hsEls.forEach(h => { tmp.copy(h.p); h.g.localToWorld(tmp); tmp.project(camera);
        h.vis = tmp.z < 1 && Math.abs(tmp.x) < 1.05 && Math.abs(tmp.y) < 1.05; h.x = (tmp.x + 1) / 2 * r.width; h.y = (1 - tmp.y) / 2 * r.height; h.z = tmp.z;
        h.el.style.display = h.vis ? '' : 'none'; if(h.vis) h.el.style.transform = `translate(${h.x}px, ${h.y}px)`; });
      // nhãn chồng lên nhau thì chỉ để chấm (bấm chấm vẫn xem được từ)
      const placed = [];
      hsEls.filter(h => h.vis).sort((a, b) => a.z - b.z).forEach(h => {
        const q = {l: h.x - 8, t: h.y - 10, r: h.x + h.w, b: h.y - 10 + h.h};
        const hit = placed.some(o => !(q.l > o.r || q.r < o.l || q.t > o.b || q.b < o.t));
        h.el.classList.toggle('mini', hit); placed.push(hit ? {l: h.x - 9, t: h.y - 9, r: h.x + 9, b: h.y + 9} : q); });
    }

    // ---- ảnh trên bảng ----
    const texCache = {};
    function setBoard(sid, url){
      const m = boards[sid]; if(!m) return;
      if(!url){ m.material.map = placeholderTex(); m.material.needsUpdate = true; return; }
      if(texCache[sid] === url) return; texCache[sid] = url;
      new THREE.TextureLoader().load(url, t => { t.encoding = THREE.sRGBEncoding; m.material.map = t; m.material.needsUpdate = true;
        const im = t.image; if(im && im.width && im.height){ const a = im.width / im.height; m.scale.set(Math.min(1, a / 1.44), Math.min(1, 1.44 / a), 1); } }, undefined, () => {});
    }

    // ---- vòng vẽ ----
    let running = false, last = performance.now();
    function resize(){ const w = box.clientWidth, h = box.clientHeight; if(!w || !h) return; let pr = Math.min(window.devicePixelRatio || 1, 2); while(w * h * pr * pr > 2.6e6 && pr > 1) pr -= 0.25; renderer.setPixelRatio(pr); renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = camera.aspect < 0.8 ? 60 : camera.aspect < 1.2 ? 50 : 42; camera.updateProjectionMatrix(); if(running) renderer.render(scene, camera); }
    try { new ResizeObserver(resize).observe(box); } catch(e){ window.addEventListener('resize', resize); }
    function frame(now){
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if(fly){ const k = Math.min(1, (now - fly.t0) / fly.ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        camera.position.lerpVectors(fly.from.p, fly.to.p, e); controls.target.lerpVectors(fly.from.t, fly.to.t, e); if(k >= 1) fly = null; }
      if(sim){ SIM.run(simK(), dt); const fo = SIM.follow(); if(fo && !fly){ const off = camera.position.clone().sub(controls.target); controls.target.lerp(fo.position, 0.12); camera.position.copy(controls.target).add(off); } }
      SIM.tick(dt, now);
      controls.update();
      movers.forEach(o => { o.t = (o.t + dt * 0.012) % 1; const p = curve.getPointAt(o.t), q = curve.getTangentAt(o.t); o.m.position.copy(p); o.m.rotation.y = Math.atan2(q.x, q.z);
        o.r.visible = o.t < tCut; o.b.visible = o.t >= tCut && o.t < tMay; o.cg.visible = o.t >= tMay; });
      if(cur && stations[cur]){ const k = 0.55 + 0.45 * Math.sin(now / 260); stations[cur].plat.material.opacity = 0.25 + 0.3 * k; }
      renderer.render(scene, camera); placeHotspots(); W3frames++;
    }
    resize(); overview(); camera.position.copy(fly.to.p); controls.target.copy(fly.to.t); fly = null;
    return {
      play(){ if(running) return; running = true; resize(); last = performance.now(); renderer.setAnimationLoop(frame); },
      stop(){ running = false; renderer.setAnimationLoop(null); },
      focus, overview, showHotspots, setBoard, unhideLabels(){ Object.values(stations).forEach(o => { o.lab.visible = true; if(o.badge) o.badge.visible = true; }); },
      simGo(b){ Object.values(stations).forEach(o => { o.lab.visible = false; if(o.badge) o.badge.visible = false; }); showHotspots(null);
        const info = SIM.enter(b, camera.aspect < 0.8 ? 1.45 : camera.aspect < 1.2 ? 1.2 : 1); if(info){ const kk = camera.aspect < 0.8 ? 1.28 : camera.aspect < 1.2 ? 1.12 : 1; flyTo(info.at, info.cam[0] * kk, info.cam[1], info.cam[2], 1100); } },
      simEnd(){ SIM.end(); Object.values(stations).forEach(o => { o.lab.visible = true; if(o.badge) o.badge.visible = true; }); },
      simLive: () => SIM.live(),
      highlight(sid){ Object.entries(stations).forEach(([id, st]) => { st.plat.material = M(ST.find(s => s.id === id).color, {transparent: true, opacity: 0.32}); });
        if(sid){ const s = STI[sid]; stations[sid].plat.material = new THREE.MeshLambertMaterial({color: new THREE.Color(s.color).convertSRGBToLinear(), transparent: true, opacity: 0.5}); } },
    };
  }

  // ---------------- chọn khâu, bảng chi tiết ----------------
  function select(sid, fromCanvas){
    if(sim) simEnd(true);
    cur = sid; near = false; $c('w3near').setAttribute('aria-pressed', 'false');
    if(ok){ T.highlight(sid); T.focus(sid, false); T.showHotspots(null); }
    renderPeek(); renderInfo(sid); renderChips();
  }
  function renderChips(){
    const el = $c('w3chips'); if(!el) return;
    el.innerHTML = ST.map(s => `<button data-w3="${s.id}" class="${cur === s.id ? 'on' : ''}" style="--c:${s.color}"><b>${s.n}</b> ${esc(s.short || s.vn)}</button>`).join('');
  }
  function renderPeek(){
    const s = cur && STI[cur], el = $c('w3peek');
    if(!s){ el.hidden = true; return; } el.hidden = false;
    const nar = tour ? `<div class="nar"><div class="vnt">${esc(s.what)}</div><div class="zht"><span lang="zh">${esc(s.whatz)}</span><div class="p">${esc(s.whatpy)}</div></div><div class="ent">${esc(s.whaten)}</div></div>` : '';
    el.innerHTML = `<div class="ph"><span class="dot" style="background:${s.color}">${s.n}</span><div class="nm"><b class="vnt">${esc(s.vn)}</b> <span class="zht"><span lang="zh">${esc(s.zh)}</span> <span class="py">${esc(s.py)}</span></span> <i class="ent">${esc(s.en)}</i></div>${s.qb ? '<span class="qbb" title="品保部 có kiểm ở khâu này">保</span>' : ''}</div>${nar}
      <div class="pb"><button class="ib" data-w3go="-1" aria-label="Khâu trước">◀</button><button class="ib" data-w3go="1" aria-label="Khâu sau">▶</button>
      ${tour ? `<button class="ib" id="w3say">🔊 中文</button><button class="ib" id="w3auto">${tour.auto ? '⏸ Dừng tự chạy' : '⏵ Tự chạy'}</button><button class="ib" id="w3stop">✕ Thôi tham quan</button>` : `<button class="ib" id="w3detail">Chi tiết ↓</button>`}
      ${['may', 'dinhform', 'qc'].includes(s.id) ? '<button class="ib pri" id="w3cap">Mũ 6 mảnh 3D</button>' : ''}</div>`;
    const d = $c('w3detail'); if(d) d.onclick = () => $c('w3info').scrollIntoView({behavior: 'smooth', block: 'start'});
    const c = $c('w3cap'); if(c) c.onclick = openCap;
    const sy = $c('w3say'); if(sy) sy.onclick = () => speak(s.whatz);
    const au = $c('w3auto'); if(au) au.onclick = () => { tour.auto = !tour.auto; schedule(); renderPeek(); };
    const sp = $c('w3stop'); if(sp) sp.onclick = stopTour;
  }
  function stepHtml(s, x, si){
    return `<div class="w3step"><div class="st">${/^[①-⑳]/.test(x.t) ? '' : `<span class="no">${si + 1}</span>`}<div><b class="vnt">${esc(x.t)}</b>${x.new ? ' <span class="newb">Mới</span>' : ''} <span class="zht"><span lang="zh">${esc(x.tz)}</span> <span class="py">${esc(x.tpy)}</span></span> <i class="ent">· ${esc(x.ten)}</i></div></div>
      <div class="vnt">${esc(x.d)}</div>${x.dz ? `<div class="zht"><div lang="zh">${esc(x.dz)}</div><div class="p">${esc(x.dpy)}</div></div>` : ''}<div class="ent">${esc(x.den)}</div>
      ${x.chk.length ? `<div class="chk"><b>Cách kiểm tra · 怎么检查 · <span class="ent">How to check</span></b><ol>${x.chk.map(c => `<li><div class="vnt">${esc(c[0])}</div><div class="zht"><div lang="zh">${esc(c[1])}</div><div class="p">${esc(c[2])}</div></div><div class="ent">${esc(c[3])}</div></li>`).join('')}</ol></div>` : ''}
      ${x.w.length ? `<div class="chips">${x.w.filter(w => TI[w]).map(w => chip(w, true)).join('')}</div>` : ''}
      ${picsBlock(s, x, si)}${qsBlock(s, x, si)}</div>`;
  }
  function renderInfo(sid){
    const el = $c('w3info'); if(!el) return;
    if(!sid){ el.innerHTML = `<div class="card hint">Bấm vào một khâu trong xưởng 3D (hoặc nút số ở trên) để xem chi tiết bằng tiếng Việt, 中文 có pinyin và tiếng Anh.</div>`; return; }
    const s = STI[sid];
    el.innerHTML = `<div class="w3head" style="--c:${s.color}"><span class="dot" style="background:${s.color}">${s.n}</span><div><h2 class="vnt">${esc(s.vn)}</h2><div class="zht"><span class="big" lang="zh">${esc(s.zh)}</span> <span class="py">${esc(s.py)}</span></div><div class="ent en1">${esc(s.en)}</div></div></div>
      <div class="card"><div class="lbl">Làm gì · 做什么 · <span class="ent">What happens</span></div><div class="vnt">${esc(s.what)}</div><div class="zht"><div lang="zh">${esc(s.whatz)}</div><div class="p">${esc(s.whatpy)}</div></div><div class="ent">${esc(s.whaten)}</div>
      <div class="lbl" style="margin-top:8px">Ai kiểm · 谁检查 · <span class="ent">Who checks</span></div><div class="vnt">${esc(s.who)}</div><div class="zht"><div lang="zh">${esc(s.whoz)}</div><div class="p">${esc(s.whopy)}</div></div><div class="ent">${esc(s.whoen)}</div>
      ${['may', 'dinhform', 'qc'].includes(s.id) ? '<button class="ib pri" data-w3cap="1" style="margin-top:10px">Mở mũ 6 mảnh 3D · 六片帽 · 6-panel cap</button>' : ''}</div>
      ${clzBox(s.id, 'card')}
      ${s.steps.map((x, si) => stepHtml(s, x, si)).join('')}`;
    loadLocalPicsIn(el); clzMount(el);
  }
  function go(d){ const i = ORDER.indexOf(cur), n = ORDER[(i + d + ORDER.length) % ORDER.length]; select(n); if(tour){ tour.i = ORDER.indexOf(n); schedule(); } }

  // ---------------- tham quan ----------------
  function startTour(){ tour = {i: 0, auto: true, timer: null}; select(ORDER[0]); schedule(); }
  function schedule(){ if(!tour) return; clearTimeout(tour.timer); if(tour.auto) tour.timer = setTimeout(() => { if(!tour) return; if(tour.i >= ORDER.length - 1){ stopTour(); return; } go(1); }, 9000); }
  function stopTourAuto(){ if(tour && tour.auto){ tour.auto = false; clearTimeout(tour.timer); renderPeek(); } }
  function stopTour(){ if(tour) clearTimeout(tour.timer); tour = null; renderPeek(); if(ok) T.overview(); }

  // ---------------- mũ 6 mảnh 3D ----------------
  function openCap(){
    const ov = $c('capOv'), f = $c('capFrame');
    if(!f.dataset.loaded){ f.srcdoc = CAP_HTML; f.dataset.loaded = '1'; }
    ov.hidden = false; document.body.classList.add('cap-open'); pause();
  }
  function closeCap(){ $c('capOv').hidden = true; document.body.classList.remove('cap-open'); if(ok && $c('v-xuong').classList.contains('on')) T.play(); }

  // ---------------- mô phỏng sản xuất (giao diện) ----------------
  const SB = DATA.sim.beats;
  let sim = null, simTimer = null;
  function simK(){ if(!sim) return 0; const b = SB[sim.i]; let el = sim.el; if(sim.play) el += (performance.now() - sim.last) * sim.speed; return Math.min(1, el / (b.dur * 1000)); }
  function simStart(i){
    if(tour) stopTour(); near = false; $c('w3near').setAttribute('aria-pressed', 'false');
    sim = {i: 0, play: true, speed: 1, el: 0, last: performance.now()};
    $c('w3sim').setAttribute('aria-pressed', 'true'); document.body.classList.add('simon');
    clearInterval(simTimer); simTimer = setInterval(simStep, 150); simGo(i || 0);
    $c('w3view').scrollIntoView({behavior: 'smooth', block: 'nearest'});
  }
  function simGo(i){
    sim.i = (i + SB.length) % SB.length; sim.el = 0; sim.last = performance.now();
    const b = SB[sim.i]; cur = b.sid;
    if(ok){ T.highlight(cur); T.simGo(b); }
    renderSimPeek(); renderSimInfo(); renderChips(); updHud();
  }
  function simStep(){
    if(!sim) return; const now = performance.now(); if(sim.play) sim.el += (now - sim.last) * sim.speed; sim.last = now;
    const b = SB[sim.i];
    if(sim.el >= b.dur * 1000){ sim.el = b.dur * 1000; if(sim.play){ if(sim.i < SB.length - 1){ simGo(sim.i + 1); return; } sim.play = false; renderSimPeek(); } }
    updHud(); const pr = $c('w3prog'); if(pr) pr.style.width = (simK() * 100).toFixed(1) + '%';
  }
  function simEnd(quiet){
    clearInterval(simTimer); sim = null; $c('w3sim').setAttribute('aria-pressed', 'false'); document.body.classList.remove('simon'); $c('w3hud').hidden = true; $c('w3simp').hidden = true;
    if(ok){ T.simEnd(); T.highlight(null); }
    if(!quiet){ cur = null; renderPeek(); renderInfo(null); renderChips(); if(ok) T.overview(); }
  }
  const tri3 = (a, py, tag) => `<${tag || 'div'} class="vnt">${esc(a[0])}</${tag || 'div'}><div class="zht"><span lang="zh">${esc(a[1])}</span>${py ? `<div class="p">${esc(py)}</div>` : ''}</div><div class="ent">${esc(a[2])}</div>`;
  function renderSimPeek(){
    if(!sim) return; const el = $c('w3simp'), b = SB[sim.i], s = STI[b.sid]; el.hidden = false; $c('w3peek').hidden = true;
    el.innerHTML = `<div class="prog"><i id="w3prog" style="width:${(simK() * 100).toFixed(1)}%"></i></div>
      <div class="ph"><span class="dot" style="background:${s.color}">${s.n}</span><div class="nm"><small class="sn">🏭 ${sim.i + 1}/${SB.length} · <span class="vnt">${esc(s.short || s.vn)}</span> <span class="zht" lang="zh">${esc(s.zh)}</span></small><br><b class="vnt">${esc(b.t[0])}</b> <span class="zht"><span lang="zh">${esc(b.t[1])}</span> <span class="py">${esc(b.tpy)}</span></span> <i class="ent">${esc(b.t[2])}</i></div>${s.qb ? '<span class="qbb" title="品保部 có kiểm ở khâu này">保</span>' : ''}</div>
      <div class="nar">${tri3(b.d, b.dpy)}</div>
      <div class="pb"><button class="ib" data-sim="first" aria-label="Về bước đầu">⏮</button><button class="ib" data-sim="prev" aria-label="Bước trước">◀</button><button class="ib pri" data-sim="play" aria-label="${sim.play ? 'Dừng' : 'Chạy'}">${sim.play ? '⏸' : '⏵'}</button><button class="ib" data-sim="next" aria-label="Bước sau">▶</button><button class="ib" data-sim="speed">${sim.speed}×</button><button class="ib" data-sim="say">🔊 中文</button><button class="ib" data-sim="chk">Kiểm gì ↓</button><button class="ib" data-sim="end" aria-label="Thoát mô phỏng">✕</button></div>`;
  }
  function renderSimInfo(){
    const el = $c('w3info'); if(!el || !sim) return; const b = SB[sim.i], s = STI[b.sid];
    el.innerHTML = `<div class="w3head" style="--c:${s.color}"><span class="dot" style="background:${s.color}">${s.n}</span><div><div class="sn">🏭 Mô phỏng sản xuất · 生产模拟 · <span class="ent">Production simulation</span> — ${sim.i + 1}/${SB.length}</div><h2 class="vnt">${esc(b.t[0])}</h2><div class="zht"><span class="big" lang="zh">${esc(b.t[1])}</span> <span class="py">${esc(b.tpy)}</span></div><div class="ent en1">${esc(b.t[2])}</div></div></div>
      <div class="card"><div class="lbl">Làm gì · 做什么 · <span class="ent">What happens</span></div>${tri3(b.d, b.dpy)}
      ${b.chk.length ? `<div class="lbl" style="margin-top:10px">Kiểm gì · 检查什么 · <span class="ent">What is checked</span></div><ol class="simchk">${b.chk.map(c => `<li>${tri3(c, c[3])}</li>`).join('')}</ol>` : ''}
      ${b.q ? `<div class="simq"><b>❓ Còn phải hỏi · 还要问 · <span class="ent">Still to ask</span></b><div class="vnt">${esc(b.q[0])}</div><div class="zht"><span lang="zh">${esc(b.q[1])}</span><div class="p">${esc(b.q[2])}</div></div></div>` : ''}
      ${b.note ? `<p class="hint">${esc(b.note)}</p>` : ''}
      ${b.w.length ? `<div class="chips">${b.w.filter(w => TI[w]).map(w => chip(w, true)).join('')}</div>` : ''}
      ${b.lab ? `<button class="ib pri" data-lab="${b.lab}" style="margin-top:10px">🧪 Phòng kiểm nghiệm ảo · ${esc(DATA.sim.lab[b.lab][0])} · <span lang="zh">${esc(DATA.sim.lab[b.lab][1])}</span></button>` : ''}</div>
      <h3 class="simh">Kịch bản đầy đủ · 全部步骤 · <span class="ent">Full script</span></h3>
      <ol class="simlist">${SB.map((x, i) => { const st = STI[x.sid]; return `<li class="${i === sim.i ? 'on' : ''}"><button data-simgo="${i}"><span class="dot" style="background:${st.color}">${st.n}</span><span><b class="vnt">${esc(x.t[0])}</b> <span class="zht" lang="zh">${esc(x.t[1])}</span> <span class="ent">${esc(x.t[2])}</span></span></button></li>`; }).join('')}</ol>`;
    const on = el.querySelector('.simlist li.on'); if(on && on.parentNode.scrollTo) on.parentNode.scrollTop = on.offsetTop - on.parentNode.offsetTop - 60;
  }
  function updHud(){
    const h = $c('w3hud'); if(!h || !sim) return; const b = SB[sim.i]; if(!b.hud.length){ h.hidden = true; return; } h.hidden = false;
    const L = ok ? T.simLive() : {};
    const val = v => esc(v).replace(/@(\w+)/g, (m, k) => { const x = L[k]; if(x == null) return '…'; if(Array.isArray(x)) return `<span class="vnt">${esc(x[0])}</span><span class="zht" lang="zh">${esc(x[1])}</span><span class="ent">${esc(x[2])}</span>`; return esc(String(x)); });
    h.innerHTML = `<div class="hh">📊 <span class="vnt">Số đo</span><span class="zht" lang="zh">数据</span><span class="ent">Live</span></div>` +
      b.hud.map(r => `<div class="hr"><span class="hl"><span class="vnt">${esc(r[0])}</span><span class="zht" lang="zh">${esc(r[1])}</span><span class="ent">${esc(r[2])}</span></span><b>${val(r[3])}</b></div>`).join('');
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-sim]');
    if(a && sim){ const k = a.dataset.sim;
      if(k === 'play'){ simStep(); if(!sim.play && sim.el >= SB[sim.i].dur * 1000 && sim.i === SB.length - 1){ simGo(0); } sim.play = !sim.play; sim.last = performance.now(); renderSimPeek(); }
      else if(k === 'next') simGo(sim.i + 1); else if(k === 'prev') simGo(sim.i - 1); else if(k === 'first') simGo(0);
      else if(k === 'speed'){ simStep(); sim.speed = sim.speed === 1 ? 2 : sim.speed === 2 ? 0.5 : 1; renderSimPeek(); }
      else if(k === 'say') speak(SB[sim.i].d[1]);
      else if(k === 'chk') $c('w3info').scrollIntoView({behavior: 'smooth', block: 'start'});
      else if(k === 'end') simEnd();
      return; }
    const g = e.target.closest('[data-simgo]'); if(g){ const i = +g.dataset.simgo; if(sim) simGo(i); else simStart(i); $c('w3view').scrollIntoView({behavior: 'smooth', block: 'start'}); return; }
    const l = e.target.closest('[data-lab]'); if(l){ LAB.open(l.dataset.lab); return; }
    const ls = e.target.closest('[data-labsim]'); if(ls){ const i = SB.findIndex(b => b.lab === ls.dataset.labsim); if(i >= 0){ if(sim) simGo(i); else simStart(i); $c('w3view').scrollIntoView({behavior: 'smooth', block: 'start'}); } return; }
  });

  // ---------------- nút ----------------
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-w3]'); if(b){ select(b.dataset.w3); return; }
    const g = e.target.closest('[data-w3go]'); if(g){ go(+g.dataset.w3go); return; }
    if(e.target.closest('[data-w3cap]')){ openCap(); return; }
  });
  $c('w3over').onclick = () => { if(sim) simEnd(true); stopTour(); cur = null; if(ok) T.focus && T.unhideLabels && T.unhideLabels(); renderPeek(); renderChips(); if(ok){ T.highlight(null); T.overview(); T.showHotspots(null); } near = false; $c('w3near').setAttribute('aria-pressed', 'false'); };
  $c('w3near').onclick = () => { if(sim) simEnd(true); if(!cur){ select(ORDER[1]); } near = !near; $c('w3near').setAttribute('aria-pressed', String(near)); if(ok){ T.focus(cur, near); T.showHotspots(near ? cur : null); } };
  $c('w3tour').onclick = () => { if(sim) simEnd(true); startTour(); };
  $c('w3sim').onclick = () => { if(sim) simEnd(); else simStart(0); };
  $c('capClose').onclick = closeCap;
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !$c('capOv').hidden) closeCap(); });

  return { frames: () => W3frames, open, pause, select, setBoard: (sid, url) => { if(ok) T.setBoard(sid, url); }, current: () => cur,
    sim: i => simStart(i || 0), simState: () => sim && {i: sim.i, play: sim.play, k: simK(), live: ok ? T.simLive() : {}}, simGo: i => sim && simGo(i), simEnd: () => sim && simEnd(),
    simSeek(i, k){ if(!sim) simStart(i); else simGo(i); sim.play = false; sim.el = k * SB[sim.i].dur * 1000; renderSimPeek(); updHud(); } };
})();
