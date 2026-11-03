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
    stages.append(st)

# ---------- từ vựng ----------
def find_example(w, stage_id):
    order = sorted(stages, key=lambda s: 0 if s["id"] == stage_id else 1)
    for s in order:
        for x in s["steps"]:
            for c in x["chk"]:
                if w in c[1] and c[1].count("·") < 3:
                    return {"zh": c[1], "py": c[2], "vn": c[0]}
    for s in order:
        for x in s["steps"]:
            for sent in re.split(r"(?<=[。；])", x.get("dz", "")):
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
                          "ex": ({"zh": EX[w][0], "py": to_py(EX[w][0]), "vn": EX[w][1]} if w in EX else find_example(w, s["id"])),
                          "add": ADDED_ON if w in ADDED else ""})
missing_cat = [t["zh"] for t in terms if t["zh"] not in CAT]
assert not missing_cat, missing_cat

DATA = {
    "meta": {"title": "Weili · Học quy trình và từ xưởng", "updated": "2026-11-03", "added": ADDED_ON,
             "sources": "W6 (121 từ), W2, báo cáo kho 31/10, biểu mẫu/SOP xưởng cắt 02/11, thẻ quy trình A, W7 (quy định từ ngữ)",
             "note": "ok=false: từ chưa đối chiếu, không dùng khi viết gửi sếp. pics: ảnh đặt ở img/<id khâu>-<số bước>-<số ảnh>.jpg. qs: [Việt, 中文, pinyin]."},
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

TEMPLATE = open(os.path.join(HERE, "template_all.html"), encoding="utf-8").read()
html = TEMPLATE.replace("__SVG__", SVG).replace("__DATA__", json.dumps(DATA, ensure_ascii=False)).replace("__N__", str(len(terms)))

import os
os.makedirs(os.path.join(OUT_DIR, "data"), exist_ok=True)
open(os.path.join(OUT_DIR, "weili-hoc-tap.html"), "w", encoding="utf-8").write(html)
json.dump(DATA, open(os.path.join(OUT_DIR, "data", "weili-data.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok:", len(terms), "từ;", sum(1 for t in terms if t["ok"]), "đã đối chiếu;", sum(1 for t in terms if t["ex"]), "có câu ví dụ;", len(html), "bytes")
