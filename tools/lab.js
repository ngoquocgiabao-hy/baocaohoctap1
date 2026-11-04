// ========== PHÒNG KIỂM NGHIỆM ẢO ==========
// Công cụ tính theo chuẩn trong W2, báo cáo kho, SOP. Chỗ tài liệu chưa có thì ghi "còn phải hỏi".
const LAB = (() => {
  const X = DATA.sim, TX = X.lab, box = document.getElementById('labBox');
  if(!box) return {open(){}};
  const t3 = (k, cls) => { const a = TX[k]; return `<span class="${cls || ''}"><span class="vnt">${esc(a[0])}</span> <span class="zht"><span lang="zh">${esc(a[1])}</span> <span class="py">${esc(a[3])}</span></span> <span class="ent">${esc(a[2])}</span></span>`; };
  const s3 = k => { const a = TX[k]; return `<span class="vnt">${esc(a[0])}</span><span class="zht" lang="zh"> ${esc(a[1])}</span><span class="ent"> · ${esc(a[2])}</span>`; };
  const num = (id, v, step, min) => `<input type="number" inputmode="decimal" id="${id}" value="${v}" step="${step || 'any'}"${min != null ? ` min="${min}"` : ''}>`;
  const fld = (k, inner) => `<label class="lf"><span class="ll">${s3(k)}</span>${inner}</label>`;
  const res = (cls, html) => `<div class="lr ${cls}">${html}</div>`;
  const fmt = (v, d) => (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toLocaleString('vi-VN', {minimumFractionDigits: d, maximumFractionDigits: d});
  const simBtn = id => X.beats.some(b => b.lab === id) ? `<button class="ib" data-labsim="${id}">🏭 ${s3('toSim')}</button>` : '';
  const tool = (id, body) => `<details class="labt" id="lab-${id}"><summary>${t3(id)}</summary><div class="lbody">${body}<div class="lres" id="lr-${id}" aria-live="polite"></div>${simBtn(id)}</div></details>`;

  // ---- 4 điểm ----
  let defs = [];
  const P4 = d => d <= 3 ? 1 : d <= 6 ? 2 : d <= 9 ? 3 : 4;
  const fourBody = `<div class="lrow">${fld('yards', num('l4y', 100, 1, 1))}${fld('width', num('l4w', 60, 1, 1))}</div>
    <div class="lrow">${fld('deflen', num('l4l', 2.5, 0.5, 0))}<button class="ib pri" id="l4add">＋ ${s3('addDef')}</button></div>
    <div class="qbtn"><button class="ib" data-l4="2">≤ 3 in · 1</button><button class="ib" data-l4="5">3–6 in · 2</button><button class="ib" data-l4="8">6–9 in · 3</button><button class="ib" data-l4="11">&gt; 9 in · 4</button></div>
    <div class="qbtn"><button class="ib" data-l4ex="1">${s3('example')} 1: 100 yd · 60 in · 20</button><button class="ib" data-l4ex="2">${s3('example')} 2: 80 yd · 58 in · 45</button><button class="ib" data-l4ex="0">${s3('reset')}</button></div>
    <div class="defs" id="l4list"></div>`;
  function four(){
    const y = +document.getElementById('l4y').value || 0, w = +document.getElementById('l4w').value || 0;
    const pts = defs.reduce((a, d) => a + P4(d), 0), p = y > 0 && w > 0 ? 3600 * pts / (y * w) : 0;
    const g = p <= 29 ? 'A' : p <= 47 ? 'B' : p <= 62 ? 'C' : null;
    document.getElementById('l4list').innerHTML = defs.map((d, i) => `<button class="dchip" data-l4rm="${i}" title="Xóa">${d} in → ${P4(d)} ✕</button>`).join('') || '<span class="hint">—</span>';
    document.getElementById('lr-four').innerHTML = res('', `${s3('total')}: <b>${pts}</b> · ${s3('per100')}: <b>${fmt(p, 1)}</b> <small>= 3.600 × ${pts} ÷ (${y} × ${w})</small>`) +
      res(g ? 'ok' : 'bad', g ? `${s3('grade')}: <b class="big">${g}</b> <small>(A ≤ 29 · B ≤ 47 · C ≤ 62)</small>` : `${s3('grade')}: <b>&gt; C</b> · ${s3('over62')}`);
  }

  // ---- AQL ----
  const aqlRow = n => X.aql.find(r => n >= r[0] && n <= r[1]);
  const aqlBody = `<div class="lrow">${fld('lot', num('laN', 805, 1, 2))}${fld('found', num('laD', 0, 1, 0))}</div>
    <div class="qbtn"><button class="ib" data-la="805">PO 05024 · 805</button><button class="ib" data-la="353">PO 4236850705 · 353</button><button class="ib" data-la="193">PO 6017802 · 193</button><button class="ib" data-la="3000">3.000</button></div>
    <table class="ltab"><thead><tr><th>PO</th><th>${s3('sample')}</th><th>${s3('accept')}</th><th>${s3('reject')}</th></tr></thead><tbody>${X.aql.map((r, i) => `<tr data-ar="${i}"><td>${r[0].toLocaleString('vi-VN')}–${r[1] > 1e8 ? '…' : r[1].toLocaleString('vi-VN')}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')}</tbody></table>
    <p class="hint">${s3('aqlNote')}</p><p class="hint">${s3('aql2')}</p>`;
  function aql(){
    const n = Math.floor(+document.getElementById('laN').value || 0), d = Math.floor(+document.getElementById('laD').value || 0), r = aqlRow(n);
    box.querySelectorAll('[data-ar]').forEach(tr => tr.classList.toggle('on', r && X.aql[+tr.dataset.ar] === r));
    if(!r){ document.getElementById('lr-aql').innerHTML = res('bad', 'PO ≥ 2'); return; }
    const pass = d <= r[3];
    document.getElementById('lr-aql').innerHTML = res('', `${s3('sample')}: <b>${Math.min(r[2], n)}</b> · ${s3('accept')} <b>${r[3]}</b> · ${s3('reject')} <b>${r[4]}</b>${n < 281 ? ' · <b>PO &lt; 281: 0</b>' : ''}`) +
      res(pass ? 'ok' : 'bad', pass ? `<b>${s3('pass')}</b> (${d} ≤ ${r[3]})` : `<b>${s3('fail')}</b> (${d} ≥ ${r[4]}) · ${s3('aqlFail')}`);
  }

  // ---- độ ẩm ----
  const MO = [['cotton', 5], ['poly', 4], ['nylon', 4], ['wool', 8]];
  const moistBody = `<div class="lrow">${fld('cotton', num('lmc', 35, 1, 0))}${fld('poly', num('lmp', 65, 1, 0))}${fld('nylon', num('lmn', 0, 1, 0))}${fld('wool', num('lmw', 0, 1, 0))}</div>
    <div class="qbtn"><button class="ib" data-lm="35,65,0,0">1381645 · 65% PES 35% CO</button><button class="ib" data-lm="60,0,40,0">60% CO 40% PA</button><button class="ib" data-lm="0,100,0,0">100% PES</button></div>
    <div class="lrow">${fld('reading', num('lmr', 3.9, 0.1, 0))}</div><p class="hint">${s3('moistRule')}</p>`;
  function moist(){
    const v = MO.map(([k], i) => +document.getElementById(['lmc', 'lmp', 'lmn', 'lmw'][i]).value || 0), sum = v.reduce((a, b) => a + b, 0);
    const lim = v.reduce((a, p, i) => a + p * MO[i][1] / 100, 0), rd = +document.getElementById('lmr').value || 0;
    const parts = v.map((p, i) => p ? `${MO[i][1]} × ${fmt(p / 100, 2)}` : '').filter(Boolean).join(' + ');
    document.getElementById('lr-moist').innerHTML = (Math.abs(sum - 100) > 0.01 ? res('bad', `${s3('sum100')} (${fmt(sum, 0)} %)`) : '') +
      res('', `${s3('limit')}: <b>${fmt(lim, 2)} %</b> <small>= ${parts || '0'}</small>`) + res(rd <= lim ? 'ok' : 'bad', `${fmt(rd, 1)} % ${rd <= lim ? '≤' : '>'} ${fmt(lim, 2)} % → <b>${s3(rd <= lim ? 'pass' : 'fail')}</b>`);
  }

  // ---- dung sai đo UA ----
  const TOL = [['Vòng đầu · 帽围 · Head size', 0.5], ['Độ sâu · 深度 · Depth', 0.3], ['Cao lưỡi · 帽檐高 · Visor height', 0.5]];
  const tolBody = `<div class="lrow"><label class="lf"><span class="ll">${s3('point')}</span><select id="ltp">${TOL.map((t, i) => `<option value="${i}">${esc(t[0])} (±${String(t[1]).replace('.', ',')} cm)</option>`).join('')}</select></label></div>
    <div class="lrow">${fld('spec', num('lts', 57, 0.1))}${fld('meas', num('ltm', 57.3, 0.1))}</div><p class="hint">Số chuẩn để điền là ví dụ; số thật lấy theo bảng thông số của mã. Lệch quá ±1/4 inch (0,635 cm) thì đo thêm chiếc khác.</p>`;
  function tol(){
    const t = TOL[+document.getElementById('ltp').value], s = +document.getElementById('lts').value, m = +document.getElementById('ltm').value, d = m - s, inn = Math.abs(d) <= t[1] + 1e-9;
    document.getElementById('lr-tol').innerHTML = res(inn ? 'ok' : 'bad', `${d >= 0 ? '+' : ''}${fmt(d, 2)} cm · ±${fmt(t[1], 1)} cm → <b>${s3(inn ? 'within' : 'outside')}</b>`) + (Math.abs(d) > 0.635 ? res('bad', 'Lệch quá ±1/4 inch: đo thêm chiếc khác · 超过±1/4英寸，多量几顶') : '');
  }

  // ---- dao chặt ----
  const dieBody = `<div class="lrow">${fld('dieMm', num('ldm', 1.5, 0.1, 0))}${fld('lastCheck', '<input type="time" id="ldt" value="07:30">')}</div>`;
  function die(){
    const mm = +document.getElementById('ldm').value || 0, tm = document.getElementById('ldt').value || '07:30', [h, mi] = tm.split(':').map(Number), nx = ((h + 2) % 24) + ':' + String(mi).padStart(2, '0');
    document.getElementById('lr-die').innerHTML = res(mm >= 2 ? 'bad' : 'ok', `${fmt(mm, 1)} mm → ${s3(mm >= 2 ? 'dieFix' : 'dieOk')}`) + res('', `${s3('nextCheck')}: <b>${nx}</b> <small>(2 giờ/lần · 每两小时)</small>`);
  }

  // ---- logo lệch VF ----
  const logoBody = `<div class="lrow">${fld('logoMm', num('llm', 2, 0.5, 0))}</div><p class="hint">Vị trí logo theo tech pack, VD UA 1381645: cách đường may lưỡi 1,5 cm · 例如UA 1381645，logo离帽檐车线1.5厘米。</p>`;
  function logo(){ const mm = +document.getElementById('llm').value || 0; document.getElementById('lr-logo').innerHTML = mm <= 0 ? res('ok', '0 mm') : res(mm > 3 ? 'bad' : 'warn', `${fmt(mm, 1)} mm ${mm > 3 ? '&gt; 3' : '≤ 3'} mm → <b>${s3(mm > 3 ? 'major' : 'minor')}</b>`); }

  // ---- mũi/inch ----
  const spiBody = `<div class="lrow"><label class="lf"><span class="ll">${s3('op')}</span><select id="lso">${X.ops.map((o, i) => `<option value="${i}">${o.no}. ${esc(o.vn)} · ${esc(o.zh)} (${o.spi})</option>`).join('')}</select></label></div><div class="lrow">${fld('counted', num('lsc', 12, 1, 1))}</div>`;
  function spi(){ const o = X.ops[+document.getElementById('lso').value], c = +document.getElementById('lsc').value;
    document.getElementById('lr-spi').innerHTML = res('', `SOP: <b>${o.spi}</b> · <span lang="zh">${esc(o.zh)}</span> <span class="py">${esc(o.py)}</span> · <small>${esc(o.note)}</small>`) + res(c === o.spi ? 'ok' : 'bad', c === o.spi ? `<b>${s3('match')}</b>` : `${c} ≠ ${o.spi} · ${s3('nomatch')}`); }

  // ---- bó 144 ----
  const bundleBody = `<div class="lrow">${fld('perPly', num('lbp', 8, 1, 1))}${fld('plies', num('lbl', 18, 1, 1))}${fld('adj', num('lba', 0, 1))}</div><p class="hint">${s3('remainNote')}</p>`;
  function bundle(){ const t = (+document.getElementById('lbp').value || 0) * (+document.getElementById('lbl').value || 0) + (+document.getElementById('lba').value || 0), b = Math.floor(Math.max(0, t) / 144), r = Math.max(0, t) % 144;
    document.getElementById('lr-bundle').innerHTML = res('', `<b>${t}</b> = ${document.getElementById('lbp').value} × ${document.getElementById('lbl').value} ${(+document.getElementById('lba').value) >= 0 ? '+' : '−'} ${Math.abs(+document.getElementById('lba').value || 0)}`) + res('ok', `${s3('bundles')}: <b>${b}</b> · ${s3('remain')}: <b>${r}</b>`); }

  // ---- nhiệt độ ----
  const tempBody = `<div class="lrow">${fld('setT', num('lts2', 120, 0.1))}${fld('actT', num('lta', 107.9, 0.1))}</div><div class="qbtn"><button class="ib" data-lt="120,107.9">弯眉整烫 14/10</button></div><p class="hint">${s3('tempQ')}</p>`;
  function temp(){ const s = +document.getElementById('lts2').value, a = +document.getElementById('lta').value, g = a - s; document.getElementById('lr-temp').innerHTML = res(Math.abs(g) < 0.05 ? 'ok' : 'warn', `${s3('gap')}: <b>${g >= 0 ? '+' : ''}${fmt(g, 1)} °C</b> (${fmt(Math.abs(g) / (s || 1) * 100, 1)} %)`); }

  // ---- 15 điểm ----
  const st15 = X.points.map(() => 0);
  const p15Body = `<ol class="p15">${X.points.map((p, i) => `<li><div class="ph15"><b lang="zh">${esc(p.zh)}</b> <span class="py">${esc(p.py)}</span> <span class="vnt">${esc(p.vn)}</span> <span class="ent">${esc(p.en)}</span></div>
    <div class="f15"><span class="vnt">${esc(p.fvn)}</span><span class="zht"> <span lang="zh">${esc(p.fzh)}</span></span><span class="ent"> ${esc(p.fen)}</span></div>
    <div class="seg" role="group"><button data-p15="${i},0" class="on">${s3('ok')}</button><button data-p15="${i},1">${s3('minor')}</button><button data-p15="${i},2">${s3('major')}</button></div></li>`).join('')}</ol><button class="ib" id="l15r">${s3('reset')}</button>`;
  function p15(){ const mx = Math.max(...st15), n1 = st15.filter(v => v === 1).length, n2 = st15.filter(v => v === 2).length;
    box.querySelectorAll('[data-p15]').forEach(b => { const [i, v] = b.dataset.p15.split(',').map(Number); b.classList.toggle('on', st15[i] === v); });
    document.getElementById('lr-p15').innerHTML = res(mx === 0 ? 'ok' : mx === 1 ? 'warn' : 'bad', `${n1} ${s3('minor')} · ${n2} ${s3('major')} → <b>${s3('p15res' + mx)}</b>`); }

  box.innerHTML = `<p class="hint">${t3('intro')}</p>` + [['four', fourBody], ['aql', aqlBody], ['moist', moistBody], ['tol', tolBody], ['p15', p15Body], ['spi', spiBody], ['bundle', bundleBody], ['die', dieBody], ['logo', logoBody], ['temp', tempBody]].map(([id, b]) => tool(id, b)).join('');
  const RUN = {four, aql, moist, tol, die, logo, spi, bundle, temp, p15};
  Object.values(RUN).forEach(f => f());
  box.addEventListener('input', e => { const d = e.target.closest('.labt'); if(d) RUN[d.id.slice(4)](); });
  box.addEventListener('change', e => { const d = e.target.closest('.labt'); if(d) RUN[d.id.slice(4)](); });
  box.addEventListener('click', e => {
    const b = e.target.closest('button'); if(!b) return;
    if(b.id === 'l4add'){ const l = +document.getElementById('l4l').value; if(l > 0){ defs.push(l); four(); } return; }
    if(b.dataset.l4){ defs.push(+b.dataset.l4); four(); return; }
    if(b.dataset.l4rm){ defs.splice(+b.dataset.l4rm, 1); four(); return; }
    if(b.dataset.l4ex){ const ex = b.dataset.l4ex; if(ex === '1'){ document.getElementById('l4y').value = 100; document.getElementById('l4w').value = 60; defs = [2, 5, 8, 11, 1, 4, 7, 10]; } else if(ex === '2'){ document.getElementById('l4y').value = 80; document.getElementById('l4w').value = 58; defs = new Array(11).fill(10).concat([2]); } else defs = []; four(); return; }
    if(b.dataset.la){ document.getElementById('laN').value = b.dataset.la; aql(); return; }
    if(b.dataset.lm){ b.dataset.lm.split(',').forEach((v, i) => document.getElementById(['lmc', 'lmp', 'lmn', 'lmw'][i]).value = v); moist(); return; }
    if(b.dataset.lt){ const [s, a] = b.dataset.lt.split(','); document.getElementById('lts2').value = s; document.getElementById('lta').value = a; temp(); return; }
    if(b.dataset.p15){ const [i, v] = b.dataset.p15.split(',').map(Number); st15[i] = v; p15(); return; }
    if(b.id === 'l15r'){ st15.fill(0); p15(); return; }
  });
  return {
    open(id){ const d = document.getElementById('lab-' + id); if(!d) return; d.open = true; setTimeout(() => d.scrollIntoView({behavior: 'smooth', block: 'start'}), 30); },
  };
})();
