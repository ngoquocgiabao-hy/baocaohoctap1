# -*- coding: utf-8 -*-
"""Cập nhật xưởng cắt theo 2 tài liệu Bảo lập 05/11 trên Drive:
"QUY TRÌNH XƯỞNG CẮT & GIA CÔNG PHỤ TRỢ (裁剪与半成品车间)" và "Bao_Cao_Tong_Hop_Xuong_Cat_Weili".
32 ảnh xưởng cắt (thư mục Drive 05/11) gắn vào ô ảnh theo PHOTOS; mặt người đã làm mờ; ảnh chỉ lưu trong artifact, không đưa lên repo.
Mỗi bước có "key" cố định: câu trả lời và ảnh đã lưu theo mã cũ (cat-<số cũ>-…) không bị lệch khi chèn bước mới.
Chỗ báo cáo 05/11 khác SOP: ghi cả hai và thêm câu hỏi. Từ mới để ok=False (chưa đối chiếu với ảnh biểu mẫu)."""
from data import STAGES, T, SRC
from vocab_extra import CAT
import en

ADDED_0511 = set()
NEW_CHK = set()   # câu kiểm thêm 05/11: không dùng thay câu ví dụ cũ của từ
SRC["C0511"] = "Báo cáo xưởng cắt 05/11 (Bảo)"
SRC["A0511"] = "Ảnh xưởng cắt 05/11 (Drive, 32 ảnh)"
CIRC = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"

_S = {s["id"]: s for s in STAGES}
cat = _S["cat"]
E = en.STAGE_EN["cat"]
old = cat["steps"]
assert len(old) == 9 and len(E[3]) == 9, (len(old), len(E[3]))
for i, x in enumerate(old):          # mã cũ giữ nguyên = số thứ tự cũ
    x["key"] = i + 1
pairs = list(zip(old, [list(e) for e in E[3]]))   # (bước, [ten, den, [chk en]])


def upd(i, d=None, chk=(), pics=(), qs=(), w=(), pic_edit=None):
    x, e = pairs[i]
    if d:
        x.setdefault("dz0", x.get("dz", ""))
        x["d"] += " " + d[0]; x["dz"] = x.get("dz", "") + d[1]; e[1] += " " + d[2]
    for c in chk:
        x.setdefault("chk", []).append([c[0], c[1]]); e[2] = list(e[2]) + [c[2]]; NEW_CHK.add(c[1])
    if pic_edit:
        for k, cap in pic_edit.items():
            x["pics"][k] = cap
    x.setdefault("pics", []).extend(pics)
    x.setdefault("qs", []).extend([list(q) for q in qs])
    for t in w:
        if t not in x["w"]:
            x["w"].append(t)


def new(key, t, tz, ten, d, chk, pics, qs, w):
    x = {"key": key, "t": t, "tz": tz, "d": d[0], "dz": d[1], "chk": [[c[0], c[1]] for c in chk],
         "w": list(w), "pics": list(pics), "qs": [list(q) for q in qs], "new": "2026-11-05"}
    return (x, [ten, d[2], [c[2] for c in chk]])


# ---------- bước cũ: thêm chi tiết từ báo cáo 05/11 ----------
upd(0, d=("Báo cáo 05/11: ở xưởng cắt, vải xếp trên kệ, có nhãn phân loại (VD 46X28/黑); kho phát xuống theo phiếu lĩnh liệu. Trước khi lên máy, đối chiếu mã hàng, màu, số lượng trên tem đầu cây để không lệch ánh màu.",
          "11月5日报告：裁剪的布放在货架上，贴分类标签（例如46X28/黑）；仓库按领料单发料。上机前对照布头标签上的款号、颜色、数量，避免色差。",
          "05/11 report: in the cutting room, rolls sit on racks with category labels (e.g. 46X28/黑); the warehouse issues them by requisition. Before loading, check style, colour and quantity on the roll-end tag to avoid shade mix-ups."),
    chk=[("Trước khi lên máy: mã hàng, màu, số lượng trên tem đầu cây khớp phiếu lĩnh liệu.", "上机前：布头标签上的款号、颜色、数量跟领料单一样。", "Before loading: style, colour and quantity on the roll-end tag match the requisition.")],
    qs=[("Báo cáo 05/11 ghi khâu này là “车缝厂收料”; ở xưởng cắt gọi thế nào? Nhãn “46X28/黑” nghĩa là gì?", "11月5日的报告把这一步写成“车缝厂收料”，裁剪这边怎么叫？标签上的“46X28/黑”是什么意思？")],
    w=["领料单"])
upd(1, d=("Báo cáo 05/11: cây vải nạp vào máy xả, kéo ra rồi cuộn lại lỏng hơn để nhả hết lực căng. Vải không co giãn đi thẳng sang bàn trải, cắt.",
          "11月5日报告：布卷放进松布机，拉开再松松地卷回去，释放卷布张力。没有弹性的布直接送去拉布、裁剪。",
          "05/11 report: the roll is fed into the relaxing machine, unrolled and rewound loosely to release the tension. Non-stretch fabric goes straight to spreading and cutting."),
    chk=[("Vải co giãn phải qua máy xả trước khi trải, cắt.", "弹性布要先过松布机，再拉布、裁剪。", "Stretch fabric goes through the relaxing machine before spreading and cutting.")],
)
upd(2, d=("Báo cáo 05/11: máy ép nhiệt băng chuyền liên tục SHANGKE SK-1600NL ép mếch cứng (buckram) hoặc mút (foam) vào mặt trái để mũ giữ form phẳng, không rộp bóng. Báo cáo ghi ép “vào mặt trái bán thành phẩm”, còn SOP M-10-71 ghi dán trước khi chặt: còn phải hỏi.",
          "11月5日报告：用SHANGKE SK-1600NL连续式压烫机，把牛筋衬或海绵压在布的反面，让帽子平整、不起泡。报告写的是压在半成品反面，作业标准M-10-71写的是裁剪前贴合，还要问。",
          "05/11 report: a SHANGKE SK-1600NL continuous fusing press bonds buckram or foam to the back so the cap stays flat without bubbles. The report says it is pressed onto semi-finished pieces, while SOP M-10-71 says fusing comes before cutting: still to ask."),
    qs=[("Ép mếch, mút làm trước khi chặt (SOP M-10-71) hay ép lên mảnh đã cắt (báo cáo 05/11), hay tùy loại? Máy SK-1600NL có phải là máy dán thẳng không?", "牛筋衬、海绵是裁剪前贴合（M-10-71），还是裁好以后再压（11月5日报告），还是看材料？SK-1600NL是不是直线贴合机？")],
    w=["贴合收发单"])
upd(3, d=("Báo cáo 05/11: vải thường kéo bằng máy trải vải tự động (Sertol); mút, mếch khó trải thì công nhân trải tay, chặn mép bằng tạ sắt cho khỏi xô lệch. Kéo đúng chiều dài sơ đồ, không kéo căng quá làm biến dạng mảnh.",
          "11月5日报告：一般的布用自动拉布机（Sertol）拉；海绵、衬这些不好拉的，工人手工拉，用铁块压住布边，不让它跑位。按排版的长度拉，不能拉太紧，不然裁片会变形。",
          "05/11 report: ordinary fabric is spread by the automatic spreader (Sertol); foam and interlining are spread by hand with iron weights on the edges. Spread to the marker length without over-tensioning, or pieces deform."),
    chk=[("Mép từng lớp thẳng, chặn bằng tạ; không kéo căng quá.", "每层布边对齐，用铁块压住；不能拉太紧。", "Every ply edge aligned and weighted; never over-tensioned.")],
    w=["自动拉布", "手工拉布"])
upd(4, d=("Báo cáo 05/11: dao chặt cất trên kệ chia ô có mã (M13, M14…), mỗi mã hàng, mỗi chi tiết một bộ dao riêng; giữ cho lưỡi không mẻ. Máy dập thủy lực Chenfeng; dập xong gỡ mảnh khỏi phần vải thừa, đếm, bó (VD 144 chiếc/bó) kèm thẻ có QR.",
          "11月5日报告：刀模放在分格的刀模架上，有编号（M13、M14……），每个款、每个部位都有专用的刀模，要保护刀口不崩。用Chenfeng液压冲床；冲好以后把裁片从余料里拿出来，点数，绑包（例如每包144片），挂有二维码的卡。",
          "05/11 report: dies are stored on numbered rack bays (M13, M14…), one die per style and part; keep the edges from chipping. Chenfeng hydraulic press; after cutting, pieces are freed from the waste, counted and bundled (e.g. 144 per bundle) with a QR card."),
    w=["冲床"])
upd(5, d=("Báo cáo 05/11 có ghi dãy máy dập 打扣 ở xưởng cắt (bước ⑨); ảnh 9494 ở bước ⑨ có nút tròn đen làm xong trên bàn máy. Máy ở bước này có phải là máy đó không: hỏi lại.",
          "11月5日报告写裁剪有一排打扣机（第⑨步）；第⑨步的照片9494桌上有做好的黑色圆扣。这台是不是同一种机器，要再问。",
          "The 05/11 report lists a row of 打扣 setting machines in cutting (step ⑨); photo 9494 there shows finished round black buttons. Whether this is the same machine: ask again."))
upd(7, d=("Báo cáo 05/11: mỗi bó kèm thẻ có mã QR ghi số đơn, size, màu, số lượng, tổ, lần cắt.",
          "11月5日报告：每包挂一张有二维码的卡，写订单号、尺码、颜色、数量、组别、裁次。",
          "05/11 report: each bundle carries a QR card with order number, size, colour, quantity, team and cut number."))

# ---------- bước mới ----------
N_PHIEU = new("p", "Phiếu sơ đồ, phiếu lưu ý gia công", "加工提示单、编排辅助单据", "Cutting sheets and processing hint sheets",
    ("Công nhân và QC nhận từ phòng kỹ thuật: phiếu phụ trợ sơ đồ cắt (编排辅助单据: mã PO, chất liệu, số yard, số lớp, kích thước dao, cách kéo vải, VD kéo hai mặt; người trải vải, cắt, QC đều ký) và phiếu lưu ý gia công (ảnh 05/11 ghi “加工提示单”, in chữ phồn thể 加工提示單; VD 左右中片加工提示单 của khách UNDER ARMOUR: đường kính lỗ cắt 切割孔径 0,12 cm; khoảng cách lỗ trên mảnh 1,6 cm và 4,9 cm, trong ngoặc là vị trí trên thành phẩm 成品定位 1,0 cm và 4,0 cm; góc phải ghi cách làm 镭射切割). Phát vật tư theo bảng tổng chi tiết phát liệu, đối chiếu số lot.",
     "工人和QC从技术部拿到编排辅助单据（PO、材料、码数、层数、刀模尺寸、拉布方式，例如双面拉布；拉布、裁剪、QC都要签字）和加工提示单（单上印繁体“加工提示單”；例如UNDER ARMOUR的左右中片加工提示单：切割孔径0.12厘米；裁片上孔的位置1.6厘米、4.9厘米，括号里是成品定位1.0厘米、4.0厘米；右上角写镭射切割）。发料按明细表发，核对批号。",
     "Workers and QC receive from engineering the marker support sheet (编排辅助单据: PO, material, yards, plies, die size, spreading method such as face-to-face; spreading, cutting and QC all sign) and the processing hint sheet (printed in traditional characters 加工提示單; e.g. a UNDER ARMOUR middle-panel sheet: cut-hole diameter 0.12 cm; hole positions on the piece 1.6 cm and 4.9 cm, with finished positions 1.0 cm and 4.0 cm in brackets; marked 镭射切割). Materials are issued by the issue summary list, checking lot numbers."),
    [("Đọc phiếu trước khi trải: số lớp, chiều dài, loại dao; phiếu lưu ý gia công: đường kính lỗ, vị trí trên thành phẩm.", "拉布前看单：层数、长度、刀模；加工提示单：切割孔径、成品定位。", "Read the sheets before spreading: plies, length, die; hint sheet: hole diameter, finished position."),
     ("Trải vải, cắt, QC đều ghi nhận và ký trên phiếu.", "拉布、裁剪、QC都要在单上记录、签字。", "Spreading, cutting and QC all record and sign the sheet."),
     ("Đo vị trí lỗ trên mảnh theo số ngoài ngoặc (VD 1,6 cm, 4,9 cm); số trong ngoặc là vị trí trên thành phẩm.", "量裁片上孔的位置看括号外的数（例如1.6厘米、4.9厘米）；括号里是成品定位。", "Measure hole positions on the piece by the number outside the brackets (e.g. 1.6, 4.9 cm); the bracketed one is the finished position.")],
    ["Phiếu phụ trợ sơ đồ cắt (编排辅助单据)", "Phiếu lưu ý gia công 加工提示单 (mảnh giữa hai bên, UA)", "Bảng tổng chi tiết phát liệu"],
    [("Phiếu phụ trợ sơ đồ cắt (编排辅助单据) có phải là biểu M-10-44-A-3 không?", "编排辅助单据是不是M-10-44-A-3那张表？"),
     ("“Bảng tổng chi tiết phát liệu” in tên tiếng Trung là gì?", "裁剪发料用的那张总表，上面印的中文名字是什么？"),
     ("Phiếu ghi lỗ cách mép 1,6 cm (thành phẩm 1,0 cm): phần chênh 0,6 cm là đường may hay phần bị che? Ai kiểm vị trí này?", "单上写1.6厘米（成品定位1.0厘米），差的0.6厘米是缝份还是被盖住的部分？这个位置谁来查？")],
    ["编排辅助单据", "加工提示单", "切割孔径", "成品定位", "双面拉布", "领料单"])
N_XEVIEN = new("xv", "Xẻ dải viền", "切条", "Cutting binding strips",
    ("Báo cáo 05/11: máy xẻ chia cuộn vải lớn thành các dải băng viền theo khổ chuẩn.",
     "11月5日报告：把大卷布切成一条一条标准宽度的包边条。",
     "05/11 report: large rolls are slit into standard-width binding strips."),
    [("Dải viền dùng ở công đoạn viền không được có mối nối (W2, công đoạn 13).", "包边条不能有接头（W2，第13道工序）。", "Binding tape used at op 13 must have no joints (W2).")],
    ["Máy xẻ dải viền"],
    [("Dải viền xẻ khổ bao nhiêu mm? Ai kiểm khổ dải?", "包边条切多宽？谁检查宽度？")],
    ["切条"])
N_LASER = new("ls", "Cắt, khắc laser", "镭射切割", "Laser cutting and engraving",
    ("Ảnh 05/11: máy khắc CKLASER 创可激光 (超级打标机 2.0, CK-super 250) và máy laser bàn lớn có màn hình Ogbos; đục lỗ thoáng, cắt họa tiết (mã UA, AGRON). SOP M-10-76 “镭射加工作业标准” (xưởng cắt, phát hành 12/12/2024): xử lý 加工提示单 bằng phần mềm thành file định vị (PLT, BMP, JPG). Có mã phải in kỹ thuật số trước rồi mới khắc laser. SOP 7 bước: chuyển dữ liệu sang định dạng máy → lưu USB → cắm vào máy DS4 → cài thông số (công suất, kích thước) → trải vật liệu lên lưới tổ ong → đạp bàn đạp cắt → thu thành phẩm, bỏ ba-via.",
     "照片：创可激光CKLASER超级打标机2.0（CK-super 250），还有带Ogbos屏幕的大台面镭射机；打透气孔、切花样（UA、AGRON的款）。作业标准M-10-76《镭射加工作业标准》（裁剪，2024年12月12日发行）：用软件把加工提示单处理成定位文件（PLT、BMP、JPG）。有的款要先数码印花，再镭射。作业标准7步：把文件转成机器格式 → 存到U盘 → 插到DS4 → 设参数（功率、尺寸）→ 把材料铺在蜂窝网上 → 踩脚踏开切 → 收成品，去毛边。",
     "Photos 05/11: a CKLASER marking laser (超级打标机 2.0, CK-super 250) and a large-bed laser with an Ogbos screen punch vent holes and cut patterns (UA, AGRON styles). SOP M-10-76 “镭射加工作业标准” (cutting room, issued 12/12/2024): the hint sheet is turned into a positioning file (PLT, BMP, JPG). Some styles are digitally printed first, then lasered. 7-step SOP: convert the file → save to USB → plug into the DS4 → set power and size → lay material on the honeycomb bed → press the foot pedal → collect pieces and remove burrs."),
    [("Cấm cắt kim loại; không dùng USB ngoài (tránh virus).", "禁止切金属；不能用外面的U盘（防病毒）。", "No metal; no outside USB sticks (virus risk)."),
     ("Bắt buộc đeo kính bảo hộ; nước làm mát phải là nước cất.", "一定要戴护目镜；冷却水要用蒸馏水。", "Safety glasses required; cooling water must be distilled."),
     ("Vệ sinh thấu kính, bộ lọc bụi hằng ngày; tra dầu chống gỉ rãnh trượt hằng tuần.", "每天清洁镜片和除尘过滤器；每周给滑轨上防锈油。", "Clean the lens and dust filter daily; oil the rails weekly."),
     ("Đường kính lỗ theo 加工提示单 (VD UA 0,12 cm).", "孔的大小按加工提示单上的切割孔径（例如UA 0.12厘米）。", "Hole size per the hint sheet (e.g. UA 0.12 cm).")],
    ["Máy laser bàn lớn, màn hình Ogbos", "Máy khắc CKLASER 创可激光 超级打标机 2.0", "Máy gia công có ống hút, máy làm lạnh nước bên trái (chưa rõ tên)",
     "Phiếu 加工提示单 mảnh sau hai bên", "Phiếu 加工提示单 (tiếp)", "Phiếu 加工提示单 (tiếp)", "Phiếu 加工提示单 (tiếp)", "Phiếu 加工提示单 (tiếp)",
     "SOP laser M-10-76 trang 1", "SOP laser M-10-76 trang 2"],
    [("Ai kiểm mảnh sau laser: tổ laser hay QC? Kiểm lỗ bằng cách nào?", "镭射后的裁片谁检查？镭射组还是QC？孔怎么查？"),
     ("Máy nào cắt mảng rộng, máy nào làm chi tiết: CKLASER hay máy bàn lớn (màn hình Ogbos)?", "哪台切大面积，哪台做细节？创可激光还是带Ogbos屏幕的大台面机？"),
     ("Máy ở ảnh 9489 (có ống hút, máy làm lạnh bên trái) là máy gì, làm công đoạn nào?", "照片9489那台（有吸风管，左边有冷水机）是什么机器？做哪道工序？")],
    ["镭射切割", "打标机", "加工提示单", "切割孔径"])
N_DAPKHUY = new("dk", "Đóng khuy, nút kim loại", "打扣", "Setting metal buttons and eyelets",
    ("Dãy máy dập tự động tốc độ cao tự cấp phôi khuy, nút, mắt cáo và dập lên vị trí định sẵn trên vải. Phụ kiện lấy từ kho riêng. Ảnh 05/11 (9494): máy có 2 phễu rung cấp phôi kim loại, màn hình cảm ứng; trên bàn có nút tròn màu đen đã làm xong.",
     "一排高速自动打扣机自动送扣，把金属扣、鸡眼打在布上定好的位置。扣子从专门的仓库领。照片（9494）：机器有两个振动盘送金属件，有触摸屏；桌上有做好的黑色圆扣。",
     "A row of high-speed automatic setters feeds buttons, studs and eyelets and sets them at marked positions. Fittings come from a separate store. Photo 9494: two vibratory bowls feed metal parts, a touch screen, finished round black buttons on the table."),
    [("Dập xong kiểm: không lỏng, không móp méo, không rớt nút.", "打好以后查：不松、不变形、不掉扣。", "After setting: not loose, not dented, not missing.")],
    ["Máy dập tự động: phễu rung cấp phôi kim loại, nút đen làm xong", "Dãy máy dập khuy và lối đi"],
    [("Máy ở ảnh 9494 làm ra nút tròn đen: đây là máy đóng khuy (打扣) hay máy bọc nút đỉnh (bước ⑩)? Xưởng may cũng có “打顶扣”: hai khâu khác nhau thế nào?", "照片9494这台机器做出黑色的圆扣：这是打扣机，还是第⑩步包顶扣的机器？车缝也有打顶扣，两个有什么不一样？"),
     ("Lực bám tiêu chuẩn của khuy là bao nhiêu, kiểm bằng gì?", "扣的拉力标准是多少？用什么测？")],
    ["打扣"])

# ---------- ô ảnh theo 32 ảnh thật (Drive 05/11, đã làm mờ mặt) ----------
# ô cũ (có từ trước 05/11) giữ nguyên chỗ; ô thêm 05/11 đặt lại theo ảnh. PHOTOS: mã ô → file ảnh
_old_pics = {x["key"]: list(x["pics"]) for x, e in pairs}
PICS = {
    1: ["Vải trên kệ chờ cắt, nhãn kệ 46X28/黑, 46X28/白", "Kệ vải chờ cắt nhìn từ lối đi"],
    2: ["Khu máy xả vải toàn cảnh", "Khu xả vải nhìn từ lối đi"],
    3: ["Máy ép mếch băng chuyền SK-1600NL", "Phiếu giao nhận dán (贴合收发单)"],
    4: ["Máy trải vải tự động Sertol", "Trải tay mút, mếch trắng, chặn tạ sắt", "Máy Sertol cận cảnh: màn hình, cây vải", "Trải tay: tạ sắt chặn mép, phiếu trên bàn"],
    5: ["Tủ ô đựng dao chặt có mã ô (M2, M7, M13, M14…)", "Máy chặt dập thủy lực, phiếu đặt trên bàn", "Tủ ô đựng dao chặt (tiếp)"],
    8: ["Đếm, buộc mảnh: máy tính, dây buộc, phiếu có QR", "Toàn cảnh khu bàn xưởng cắt"],
}
for (x, e) in pairs:
    k = x["key"]
    n0 = {1: 1, 2: 1, 3: 3, 4: 2, 5: 2}.get(k, len(_old_pics[k]))
    x["pics"] = _old_pics[k][:n0] + PICS.get(k, _old_pics[k][n0:])
pairs[1][0]["pics"][0] = "Máy xả vải đang chạy, cận cảnh"
PHOTOS = {
    "cat-1-2": "IMG_9468", "cat-1-3": "IMG_9469", "cat-2-1": "IMG_9461", "cat-2-2": "IMG_9459", "cat-2-3": "IMG_9467",
    "cat-p-2": "IMG_9476", "cat-3-2": "IMG_9464", "cat-3-4": "IMG_9472",
    "cat-4-1": "IMG_9506", "cat-4-3": "IMG_9505", "cat-4-4": "IMG_9509", "cat-4-5": "IMG_9507", "cat-4-6": "IMG_9510",
    "cat-5-1": "IMG_9474", "cat-5-3": "IMG_9490", "cat-5-4": "IMG_9503", "cat-5-5": "IMG_9491",
    "cat-xv-1": "IMG_9471",
    "cat-ls-1": "IMG_9488", "cat-ls-2": "IMG_9487", "cat-ls-3": "IMG_9489", "cat-ls-4": "IMG_9477", "cat-ls-5": "IMG_9478",
    "cat-ls-6": "IMG_9479", "cat-ls-7": "IMG_9480", "cat-ls-8": "IMG_9481", "cat-ls-9": "IMG_9482", "cat-ls-10": "IMG_9483",
    "cat-dk-1": "IMG_9494", "cat-dk-2": "IMG_9492", "cat-8-4": "IMG_9502", "cat-8-5": "IMG_9499",
}

# thứ tự mới: theo đường đi của mảnh cắt; bước gia công phụ trợ (tùy mã) sau khi chặt
order = [pairs[0], pairs[1], N_PHIEU, pairs[2], pairs[3], pairs[4], N_XEVIEN, N_LASER, N_DAPKHUY, pairs[5], pairs[6], pairs[7], pairs[8]]
steps, ens = [], []
for i, (x, e) in enumerate(order):
    c = CIRC[i]
    x["t"] = c + " " + (x["t"][1:].lstrip() if x["t"][:1] in CIRC else x["t"])
    e[0] = c + " " + (e[0][1:].lstrip() if e[0][:1] in CIRC else e[0])
    steps.append(x); ens.append(tuple(e))
cat["steps"] = steps
cat["what"] = "Cây vải → xả (vải co giãn) → phiếu sơ đồ, phiếu lưu ý gia công → dán lót → kéo lớp → chặt → gia công phụ trợ tùy mã (xẻ viền, laser, đóng khuy) → chọn, buộc 144 bộ/bó → sang thêu, in, may."
cat["whatz"] = "布卷 → 松布（弹性布）→ 编排辅助单据、加工提示单 → 贴合 → 拉布 → 刀模裁剪 → 看款加工（切条、镭射、打扣）→ 挑片、绑片，每包144套 → 送绣花、印花、车缝。"
en.STAGE_EN["cat"] = ("Cutting room", "Roll → relaxing (stretch fabric) → marker and hint sheets → fusing → spreading → die cutting → extra processing by style (binding strips, laser, button setting) → sorting and bundling 144 sets → to embroidery, printing, sewing.", E[2], ens)

# ---------- từ mới (chưa đối chiếu với ảnh biểu mẫu) ----------
NEWT = [
    ("自动拉布", "zìdòng lābù", "kéo vải bằng máy trải tự động (VD Sertol)", "congdoan", "automatic spreading"),
    ("手工拉布", "shǒugōng lābù", "kéo vải tay (mút, mếch khó trải)", "congdoan", "hand spreading"),
    ("编排辅助单据", "biānpái fǔzhù dānjù", "phiếu phụ trợ sơ đồ cắt (PO, chất liệu, yard, số lớp, dao, cách kéo vải)", "giayto", "marker support sheet"),
    ("贴合收发单", "tiēhé shōufā dān", "phiếu giao nhận hàng dán", "giayto", "fusing issue-and-receipt slip"),
    ("冲床", "chōngchuáng", "máy dập (máy chặt thủy lực)", "may", "clicking press"),
    ("切条", "qiētiáo", "xẻ dải (cắt cuộn vải thành dải băng viền)", "congdoan", "strip cutting"),
    ("打扣", "dǎkòu", "đóng khuy, nút, mắt cáo bằng máy dập (khác 打顶扣 ở xưởng may)", "congdoan", "button / eyelet setting"),
]
for zh, py, vn, c, e in NEWT:
    assert zh not in T, zh
    T[zh] = (py, vn, "C0511", False, "Từ trong báo cáo 05/11; đối chiếu với biển, biểu mẫu ở xưởng trước khi dùng gửi sếp.")
    CAT[zh] = c
    en.TERM_EN[zh] = e
    ADDED_0511.add(zh)
# thấy in trên phiếu, máy trong ảnh 05/11 (phiếu in phồn thể: 加工提示單, 切割孔徑); 加工提示单 đã có từ W6
SEEN = [
    ("切割孔径", "qiēgē kǒngjìng", "đường kính lỗ cắt (VD 0,12 cm)", "bophan", "cut-hole diameter"),
    ("成品定位", "chéngpǐn dìngwèi", "vị trí trên thành phẩm (số trong ngoặc trên phiếu lưu ý gia công)", "bophan", "finished position"),
    ("镭射切割", "léishè qiēgē", "cắt, khắc laser (ghi trên phiếu lưu ý gia công)", "congdoan", "laser cutting"),
    ("打标机", "dǎbiāo jī", "máy khắc laser (VD CKLASER 超级打标机 2.0)", "may", "laser marking machine"),
]
for zh, py, vn, c, e in SEEN:
    assert zh not in T, zh
    T[zh] = (py, vn, "A0511", True, "Thấy in trên phiếu hoặc máy trong ảnh xưởng cắt 05/11.")
    CAT[zh] = c
    en.TERM_EN[zh] = e
    ADDED_0511.add(zh)
for s in steps:
    for t in s["w"]:
        assert t in T, ("thiếu từ", t)
