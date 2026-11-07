# -*- coding: utf-8 -*-
"""Gộp sơ đồ quy trình + từ vựng + thẻ học + trắc nghiệm + cách học thành một file HTML,
kèm file dữ liệu JSON dùng lại cho game nhà máy."""
import sys, json, math, re
import os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from data import T, STAGES, QA, SRC
import overlay  # bổ sung 03/11: khâu mẫu, kiểm vải đầy đủ, ảnh và câu hỏi
import vocab_more  # bổ sung 03/11 chiều: từ quy trình và chất lượng
from vocab_more import EX, ADDED, ADDED_ON
import review_0411  # soát lại 04/11 với Drive
import cut_0511  # xưởng cắt theo báo cáo 05/11
from cut_0511 import ADDED_0511, NEW_CHK
from en import STAGE_EN, TERM_EN
from vocab_extra import CATS, CAT, WRONG, HOT, PENDING
from pyhelper import to_py

OUT_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..")

# ---------- giai đoạn + pinyin ----------
stages = []
for s in STAGES:
    st = dict(s); st.pop("extra_w", None)
    st["py"] = T.get(s["zh"], ("",))[0]
    st["whatpy"] = to_py(s["whatz"]); st["whopy"] = to_py(s["whoz"])
    steps = []
    for x in s["steps"]:
        y = dict(x)
        y["tpy"] = to_py(x["tz"]); y["dpy"] = to_py(x["dz"]) if x.get("dz") else ""
        y["chk"] = [[c[0], c[1], to_py(c[1])] for c in x.get("chk", [])]
        y["qs"] = [[q[0], q[1], q[2] if len(q) > 2 else to_py(q[1])] for q in x.get("qs", [])]
        y["pics"] = list(x.get("pics", []))
        steps.append(y)
    st["steps"] = steps
    en = STAGE_EN[s["id"]]
    assert len(en[3]) == len(steps), (s["id"], len(en[3]), len(steps))
    st["en"], st["whaten"], st["whoen"] = en[0], en[1], en[2]
    for y, (te, de, ce) in zip(steps, en[3]):
        assert len(ce) == len(y["chk"]), (s["id"], y["t"], len(ce), len(y["chk"]))
        y["ten"], y["den"] = te, de
        for c, e in zip(y["chk"], ce): c.append(e)
    stages.append(st)

# ---------- từ vựng ----------
def find_example(w, stage_id, old_only=False):
    # old_only: chỉ tìm trong nội dung có trước 05/11, để câu ví dụ cũ của từ không bị thay
    order = sorted(stages, key=lambda s: 0 if s["id"] == stage_id else 1)
    for s in order:
        for x in s["steps"]:
            if old_only and x.get("new"): continue
            for c in x["chk"]:
                if old_only and c[1] in NEW_CHK: continue
                if w in c[1] and c[1].count("·") < 3:
                    return {"zh": c[1], "py": c[2], "vn": c[0]}
    for s in order:
        for x in s["steps"]:
            if old_only and x.get("new"): continue
            for sent in re.split(r"(?<=[。；])", x.get("dz0", x.get("dz", "")) if old_only else x.get("dz", "")):
                if w in sent and len(sent) > len(w) + 3 and sent.count("·") < 3:
                    sent = sent.strip()
                    return {"zh": sent, "py": to_py(sent), "vn": ""}
    return None

seen, terms = set(), []
SX = {s["id"]: s.get("extra_w", []) for s in STAGES}
for s in stages:
    for w in [s["zh"]] + [w for x in s["steps"] for w in x["w"]] + SX.get(s["id"], []):
        if w in T and w not in seen:
            seen.add(w)
            py, vn, src, ok, note = T[w]
            terms.append({"zh": w, "py": py, "vn": vn, "note": note, "src": SRC[src], "ok": ok,
                          "st": s["id"], "cat": CAT.get(w, "congdoan"), "hot": w in HOT,
                          "ex": ({"zh": EX[w][0], "py": to_py(EX[w][0]), "vn": EX[w][1]} if w in EX else (find_example(w, s["id"], True) or find_example(w, s["id"]))),
                          "add": "2026-11-05" if w in ADDED_0511 else (ADDED_ON if w in ADDED else ""), "en": TERM_EN[w]})
for st_ in stages:
    for x in st_["steps"]:
        x.pop("dz0", None)
missing_cat = [t["zh"] for t in terms if t["zh"] not in CAT]
assert not missing_cat, missing_cat

DATA = {
    "meta": {"title": "Weili · Học quy trình và từ xưởng", "updated": "2026-11-05", "added": "2026-11-05",
             "sources": "W6 (121 từ), W2, báo cáo kho 31/10, biểu mẫu/SOP xưởng cắt 02/11, thẻ quy trình A, báo cáo xưởng cắt 05/11, W7 (quy định từ ngữ)",
             "note": "ok=false: từ chưa đối chiếu, không dùng khi viết gửi sếp. key: mã cố định của bước (không có thì là số thứ tự); pics: ảnh đặt ở img/<id khâu>-<mã bước>-<số ảnh>.jpg; câu hỏi có mã <id khâu>-<mã bước>-q<số>. qs: [Việt, 中文, pinyin]."},
    "stages": stages,
    "terms": terms,
    "cats": [{"id": c, "vn": v, "zh": z} for c, v, z in CATS],
    "wrong": [{"bad": a, "good": b, "py": c, "vn": d, "src": e} for a, b, c, d, e in WRONG],
    "pending": [{"term": a, "vn": b, "note": c} for a, b, c in PENDING],
    "qa": QA,
}

# ---------- vòng tròn tổng quan ----------
W = 404; C = W / 2; R = 152; PW, PH = 78, 40
parts = [f'<circle cx="{C}" cy="{C}" r="{R}" fill="none" stroke="var(--ring)" stroke-width="2" stroke-dasharray="3 5"/>']
n = len(stages); pos = []
for i, s in enumerate(stages):
    a = -math.pi / 2 + 2 * math.pi * i / n
    pos.append((C + R * math.cos(a), C + R * math.sin(a), a))
for i in range(n):
    a = -math.pi / 2 + 2 * math.pi * (i + 0.5) / n
    x, y = C + R * math.cos(a), C + R * math.sin(a)
    parts.append(f'<path d="M -5 -4 L 3 0 L -5 4" transform="translate({x:.1f},{y:.1f}) rotate({math.degrees(a)+90:.1f})" fill="none" stroke="var(--ring-ink)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>')
for (x, y, a), s in zip(pos, stages):
    parts.append(f'<line x1="{C+52*math.cos(a):.1f}" y1="{C+52*math.sin(a):.1f}" x2="{C+(R-26)*math.cos(a):.1f}" y2="{C+(R-26)*math.sin(a):.1f}" stroke="{s["color"]}" stroke-opacity=".35" stroke-width="2"/>')
parts.append(f'<circle cx="{C}" cy="{C}" r="50" fill="var(--ink)"/>')
parts.append(f'<text x="{C}" y="{C-6}" text-anchor="middle" class="c1">Chiếc mũ</text>')
parts.append(f'<text x="{C}" y="{C+16}" text-anchor="middle" class="c2">一顶帽子</text>')
for (x, y, a), s in zip(pos, stages):
    g = (f'<g class="node" data-go="{s["id"]}" tabindex="0" role="button" aria-label="Khâu {s["n"]}: {s["vn"]}">'
         f'<rect x="{x-PW/2:.1f}" y="{y-PH/2:.1f}" width="{PW}" height="{PH}" rx="11" fill="{s["color"]}"/>'
         f'<text x="{x:.1f}" y="{y-3:.1f}" text-anchor="middle" class="n1">{s["n"]}. {s["short"]}</text>'
         f'<text x="{x:.1f}" y="{y+12:.1f}" text-anchor="middle" class="n2">{s["zh"]}</text>')
    if s["qb"]:
        g += (f'<circle cx="{x+PW/2-3:.1f}" cy="{y-PH/2+3:.1f}" r="9" fill="#fff" stroke="{s["color"]}" stroke-width="2"/>'
              f'<text x="{x+PW/2-3:.1f}" y="{y-PH/2+7:.1f}" text-anchor="middle" class="qb">保</text>')
    parts.append(g + '</g>')
SVG = f'<svg viewBox="0 0 {W} {W}" class="radial" role="img" aria-label="Sơ đồ các khâu từ mẫu, kho đến xuất hàng">{"".join(parts)}</svg>'

# ---------- hướng dẫn nhà máy (tab Xưởng 3D) ----------
from guide import GUIDE, ROUTE
from html import escape as E
TI = {t["zh"]: t for t in terms}
def chip_html(w):
    t = TI[w]
    return (f'<button class="chip{"" if t["ok"] else " q"}" data-zh="{E(w)}"><span class="hz" lang="zh">{E(w)}</span>'
            f'<span class="py">{E(t["py"])}</span><span class="vn">{E(t["vn"])}</span><span class="en ent">{E(t["en"])}</span></button>')
def guide_html():
    out = []
    for gid, vn, zh, en, paras, kz, ke, words in GUIDE:
        for w in words: assert w in TI, ("guide", w)
        out.append(f'<details{" open" if gid == "cach-dung" else ""}><summary>{E(vn)}<span class="zh2" lang="zh">{E(zh)}</span> <span class="ent">· {E(en)}</span></summary>')
        out.append('<ul class="vnt">' + "".join(f"<li>{E(p)}</li>" for p in paras) + "</ul>")
        for z, e in zip(kz, ke):
            out.append(f'<div class="key"><div class="zht"><div lang="zh">{E(z)}</div><div class="p">{E(to_py(z))}</div></div><div class="ent">{E(e)}</div></div>')
        if words: out.append('<div class="chips">' + "".join(chip_html(w) for w in words) + "</div>")
        out.append("</details>")
        if gid == "pbb":
            rows = "".join(f'<tr><td><b>{s["n"]}. {E(s["vn"])}</b><br><span lang="zh">{E(s["zh"])}</span> <span class="py">{E(s["py"])}</span><br><i class="ent">{E(s["en"])}</i></td>'
                           f'<td><span class="vnt">{E(s["who"])}</span><div class="zht"><span lang="zh">{E(s["whoz"])}</span><div class="p">{E(s["whopy"])}</div></div><div class="ent">{E(s["whoen"])}</div></td></tr>' for s in stages)
            out.append(f'<details><summary>Ai kiểm ở khâu nào<span class="zh2" lang="zh">谁在哪个环节检查</span> <span class="ent">· Who checks where</span></summary><table><tr><th>Khâu</th><th>Ai kiểm</th></tr>{rows}</table></details>')
        if gid == "chup-anh":
            SI = {s["id"]: s for s in stages}
            cnt = lambda s: sum(len(x["pics"]) for x in s["steps"])
            route = "".join(f'<span>{SI[i]["n"]}. {E(SI[i]["vn"])} · {cnt(SI[i])} ảnh</span>' for i in ROUTE)
            total = sum(cnt(s) for s in stages)
            out.append(f'<details><summary>Đi chụp ảnh: thứ tự gợi ý<span class="zh2" lang="zh">拍照路线</span> <span class="ent">· Photo route</span></summary>'
                       f'<p class="vnt">Tổng {total} ảnh cần chụp. Đi theo đường trong xưởng: kho → kiểm vải → cắt → thêu → in → giặt (tầng 1) → may (tầng 2) → ép vành → QC → đóng gói, dò kim; phòng mẫu chụp khi được phép.</p>'
                       f'<div class="route">{route}</div><p class="vnt">Ở mỗi khâu: bấm vào khâu trong xưởng 3D, kéo xuống ô “Ảnh thực tế”, bấm “Thêm ảnh”. Ảnh đã có được đánh dấu ✅ ở tab Cần hỏi → Ảnh cần chụp.</p></details>')
    return "".join(out)
GUIDE_HTML = guide_html()

# ---------- mô phỏng sản xuất + phòng kiểm nghiệm ảo ----------
import sim as SIMD
beats = []
for b in SIMD.BEATS:
    x = json.loads(json.dumps(b))
    x["tpy"] = to_py(b["t"][1]); x["dpy"] = to_py(b["d"][1])
    x["chk"] = [c + [to_py(c[1])] for c in b["chk"]]
    if b["q"]: x["q"] = b["q"] + [to_py(b["q"][1])]
    miss = [w for w in b["w"] if w not in TI]
    if miss: print("  mô phỏng: bỏ từ chưa có trong bảng:", b["id"], miss)
    x["w"] = [w for w in b["w"] if w in TI]
    assert b["sid"] in {s["id"] for s in stages}, b["id"]
    assert not b["lab"] or b["lab"] in SIMD.LAB, b["id"]
    beats.append(x)
DATA["sim"] = {
    "beats": beats,
    "points": [{"zh": z, "py": to_py(z), "vn": v, "en": e, "fvn": fv, "fzh": fz, "fen": fe} for z, v, e, fv, fz, fe in SIMD.POINTS15],
    "ops": [{"no": n, "vn": v, "zh": z, "py": to_py(z), "spi": spi, "note": note} for n, v, z, spi, note in SIMD.OPS],
    "aql": [list(r) for r in SIMD.AQL_UA_I],
    "lab": {k: [v[0], v[1], v[2], to_py(v[1])] for k, v in SIMD.LAB.items()},
}

import tham_0511
tham_0511.apply(DATA)

safe = lambda o: json.dumps(o, ensure_ascii=False).replace("</", "<\\/")
CAP = open(os.path.join(HERE, "cap_6manh.html"), encoding="utf-8").read()
TEMPLATE = open(os.path.join(HERE, "template_all.html"), encoding="utf-8").read()
html = (TEMPLATE.replace("__WORLDCSS__", open(os.path.join(HERE, "world3d.css"), encoding="utf-8").read())
        .replace("__WORLDJS__", "\n".join(open(os.path.join(HERE, f), encoding="utf-8").read() for f in ("world3d_sim.js", "world3d.js", "lab.js")))
        .replace("__GUIDE__", GUIDE_HTML).replace("__SVG__", SVG)
        .replace("__CAPHTML__", safe(CAP)).replace("__DATA__", safe(DATA)).replace("__N__", str(len(terms))).replace("__NSIM__", str(len(beats))))

import os
os.makedirs(os.path.join(OUT_DIR, "data"), exist_ok=True)
open(os.path.join(OUT_DIR, "weili-hoc-tap.html"), "w", encoding="utf-8").write(html)
json.dump(DATA, open(os.path.join(OUT_DIR, "data", "weili-data.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok:", len(terms), "từ;", sum(1 for t in terms if t["ok"]), "đã đối chiếu;", sum(1 for t in terms if t["ex"]), "có câu ví dụ;", len(html), "bytes")
