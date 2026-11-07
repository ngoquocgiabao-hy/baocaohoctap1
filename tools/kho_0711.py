# -*- coding: utf-8 -*-
"""Kho và kiểm vải theo 14 ảnh kho Bảo chụp (gửi 07/11): hai lưu đồ trên tường, bảng cạnh máy kiểm vải,
bảng tem trạng thái, biển kệ, phòng kiểm nghiệm. Ảnh đã làm mờ mặt, chỉ lưu trong artifact (PHOTOS), không đưa lên repo.
Chỉ thêm vào cuối danh sách ảnh, câu hỏi của bước cũ: mã ô ảnh, mã câu hỏi cũ giữ nguyên.
Từ đọc được trên lưu đồ, biển, nhãn máy: ok=True, nguồn A0711."""
from data import STAGES, T, SRC
from vocab_extra import CAT
import en
from cut_0511 import NEW_CHK   # câu kiểm mới không thay câu ví dụ cũ của từ

ADDED_0711 = set()
SRC["A0711"] = "Ảnh kho 07/11 (lưu đồ, biển kệ, nhãn máy)"
_S = {s["id"]: s for s in STAGES}


def _helper(sid):
    st = _S[sid]
    E = list(en.STAGE_EN[sid])
    E3 = [list(e) for e in E[3]]

    def upd(i, d=None, chk=(), pics=(), qs=(), w=(), pic_edit=None):
        x, e = st["steps"][i], E3[i]
        if d:
            x.setdefault("dz0", x.get("dz", ""))
            x["d"] += " " + d[0]; x["dz"] = x.get("dz", "") + d[1]; e[1] += " " + d[2]
        for c in chk:
            x.setdefault("chk", []).append([c[0], c[1]]); e[2] = list(e[2]) + [c[2]]; NEW_CHK.add(c[1])
        for k, cap in (pic_edit or {}).items():
            x["pics"][k] = cap
        x.setdefault("pics", []).extend(pics)
        x.setdefault("qs", []).extend([list(q) for q in qs])
        for t in w:
            if t not in x["w"]:
                x["w"].append(t)

    def done():
        E[3] = [tuple(e) for e in E3]
        en.STAGE_EN[sid] = tuple(E)
    return upd, done


# ================= KHO =================
upd, done = _helper("kho")
upd(0, d=("Lưu đồ quản lý kho trên tường (ảnh 07/11): 合约与明细 (mã hợp đồng, danh sách hàng) → 计划储位 (vị trí kế hoạch) → hàng đến, 咨询组 kiểm nhận trên hệ thống, in 点收明细表 → 进料检验 (kiểm nghiệm hàng đến) → đạt thì 收料入库; không đạt thì 验收反应单 → 特采 → không được thì 退货. Lưu đồ ghi tiếng Việt: 咨询组 là “tổ thông tin”, 主料组 là “tổ chủ liệu”.",
          "墙上的仓库管理部工作流程图（11月7日照片）：合约与明细 → 计划储位 → 到料后咨询组点收，出点收明细表 → 进料检验 → 合格就收料入库；不合格开验收反应单 → 特采 → 不能特采就退货。",
          "Warehouse wall chart (photo 07/11): contract and item list → planned location → on arrival the information team checks goods in on the system and prints the check-in list → incoming inspection → pass: receive into stock; fail: acceptance reaction form → special acceptance → otherwise return. The chart's Vietnamese calls 咨询组 “information team” and 主料组 “main-material team”."),
    chk=[("Hàng đến: tổ thông tin có 点收明细表 (biểu kiểm nhận) và 物管订单分配表 (biểu phân bổ đơn) rồi mới giao tổ kiểm nghiệm.",
          "物料入厂：咨询组出点收明细表和物管订单分配表，再交检验组。",
          "On arrival the information team issues the check-in list and the order allocation sheet, then hands over to the inspection team.")],
    pics=["Lưu đồ quản lý kho (仓库管理部工作流程图), cận cảnh", "Lưu đồ tổ kiểm nghiệm (检验组工作流程图), cận cảnh", "Vải về xếp trên pallet ở lối đi trong kho"],
    qs=[("Lưu đồ ghi bước đầu “合约与明细” và “计划储位”: ai làm, làm trước khi hàng về phải không?", "流程图第一步“合约与明细”和“计划储位”是谁做的？是货到之前就做吗？"),
        ("Vải xếp trên pallet ở lối đi (ảnh 07/11) là hàng chờ kiểm hay đã kiểm, chờ lên kệ? Nhìn tem nào để biết?", "通道上托盘里的布是待检的，还是检好了等上架的？看哪个标签知道？")],
    w=["点收明细表", "物管订单分配表", "计划储位", "进料检验"])
upd(1, d=("Lưu đồ tổ kiểm nghiệm ghi các mục gửi phòng kiểm nghiệm: 干湿摩擦 (ma sát khô, ướt), 水洗牢度 (bền màu khi giặt), 颜色核对 (so màu), kiểm cảm giác tay, kiểm độ dày, kiểm liên quan → 品质检测报告.",
          "检验组流程图写：剪布块送实验室检测，测干湿摩擦、水洗牢度、颜色核对、手感、厚度和相关检验，出品质检测报告。",
          "The inspection-team chart lists dry and wet rubbing, wash fastness, colour check, hand feel, thickness and related tests → quality test report."),
    qs=[("“相关检验” (kiểm liên quan) trên lưu đồ gồm những test nào?", "流程图上的“相关检验”包括哪些测试？")],
    w=["干湿摩擦", "水洗牢度", "颜色核对"])
upd(2, d=("Lưu đồ ghi 4 mục trên máy kiểm vải: 码数 (số yard), 幅宽 (khổ), 色差 (chênh lệch màu), 瑕疵 (lỗi) → 验布检查表.",
          "流程图上验布机检验有四项：码数、幅宽、色差、瑕疵，填验布检查表。",
          "The chart lists four checks on the inspection machine: yardage, width, shade difference, defects → inspection sheet."))
upd(3, d=("Ảnh 07/11: nhân viên đối chiếu tờ nhãn mã vạch (size SM, L/XL) với đơn trên máy tính và mẫu chuẩn 标准样.",
          "照片：同事对着电脑上的订单和标准样，核对条码标签的尺码。",
          "Photo 07/11: a colleague checks a sheet of barcode labels (sizes SM, L/XL) against the order on screen and the standard sample."),
    qs=[("Nhãn mã vạch kiểm hết hay lấy mẫu theo AQL? Sai size hoặc mã vạch thì xử lý thế nào?", "条码标签是全检还是按AQL抽检？尺码或条码不对怎么处理？")])
upd(4, d=("Lưu đồ tổ kiểm nghiệm: đạt hay không đạt đều nhập ERP; 特采 được thì quay về 验收明细表 rồi tổ chủ liệu nhập kho.",
          "检验组流程图：合格、不合格都进ERP；特采通过就回到验收明细表，主料组收料入库。",
          "Inspection-team chart: pass or fail, results go into ERP; once specially accepted, goods return to the acceptance list and the main-material team stocks them."),
    qs=[("特采 xong cây vải dán tem gì (tem vàng 特采标签?) và để ở kệ nào?", "特采以后布卷贴什么标签？放在哪个货架？")])
upd(5, d=("Lưu đồ quản lý kho: xưởng lên phiếu lĩnh liệu → kho chia hàng theo từng xưởng (将物料分厂别放) → xưởng lĩnh hàng → phiếu nộp tổ thông tin trừ sổ. Bù liệu: xưởng lên 补料单 → kho phát bù → nộp phiếu trừ sổ. Kiểm kho 盘点: lệch thì 盘调申请 → 盘调; khớp thì 日常料账维护 (duy trì số liệu hằng ngày).",
          "仓库管理部流程图：工厂提出领料单 → 将物料分厂别放 → 工厂领料 → 领料单交咨询组减账。补料：工厂提出补料单 → 将货物交工厂补料 → 交咨询组减账。盘点：有差异就盘调申请、盘调；没有差异就日常料账维护。",
          "Warehouse chart: the workshop raises a requisition → goods are split by workshop → the workshop collects → the slip goes to the information team to deduct stock. Top-up: top-up slip → issue → deduct. Stock count: differences go to an adjustment request and adjustment; otherwise daily stock records are maintained."),
    qs=[("“将物料分厂别放” là chia theo những xưởng nào? Phụ liệu phát thẳng cho chuyền may hay qua xưởng cắt?", "“将物料分厂别放”是按哪些厂分？辅料是直接发给车缝，还是经过裁剪？")],
    w=["盘调", "日常料账维护"])
upd(6, d=("Bảng 原物料状态标识 cạnh máy kiểm vải (ảnh 07/11): 主料合格标签 và 辅料合格标签 là tem trắng, 不合格标签 tem đỏ, 特采标签 tem vàng (ghi “kết quả đánh giá sau kiểm nghiệm”), tem mũi tên đỏ “đợi xử lý”, 色差标签 A, B, C, D. Biển kệ: 衬布货架 (kệ vải lót cứng), 进口货架 (hàng nhập khẩu), SP线货架 (kệ chỉ SP), 国内物料 (vật liệu trong nước); mã kệ C23, C24, D07, D08, F09, F10; ô kệ dạng C24-3-2.",
          "验布机旁边的原物料状态标识：主料合格标签、辅料合格标签是白色的，不合格标签是红色的，特采标签是黄色的，还有红箭头的标签和色差标签A、B、C、D。货架上有牌子：衬布货架、进口货架、SP线货架、国内物料；货架编号像C23、C24、D08，储位像C24-3-2。",
          "The status-label board by the inspection machine (photo 07/11): white labels for passed main materials and trims, red for failed, yellow for special acceptance, a red-arrow label for “waiting”, shade labels A–D. Rack signs: interlining racks, imported goods, SP thread racks, domestic materials; rack codes C23, C24, D07, D08, F09, F10; positions like C24-3-2."),
    pics=["Kệ C23, C24: biển 衬布货架 (kệ vải lót cứng), 进口货架 (hàng nhập khẩu)", "Biển kệ D08: SP线货架 (kệ chỉ SP), WT进口货架 (hàng nhập khẩu WT)", "Dãy kệ phụ liệu D07, D08, F09, F10 (国内物料, SP, WT)"],
    qs=[("Nhiều cây vải trên kệ dán tem vàng (ảnh kệ C24): đó là tem 特采 hay tem của nhà cung cấp?", "很多布卷上贴着黄色的标签，是特采标签还是供应商的标签？"),
        ("Tem mũi tên đỏ trên bảng trạng thái tiếng Trung gọi là gì, dán khi nào?", "状态标识上红箭头的标签中文叫什么？什么时候贴？"),
        ("Kệ “SP线货架” để gì: chỉ may hiệu SP? “WT进口” là hàng của bên nào?", "SP线货架放的是什么？WT进口是哪家的货？")],
    w=["主料合格标签", "辅料合格标签", "不合格标签", "特采标签", "货架", "衬布货架", "进口货架", "国内物料"])
done()

# ================= KIỂM VẢI & PHÒNG KIỂM NGHIỆM =================
upd, done = _helper("kiemvai")
upd(0, pic_edit={0: "Máy kiểm vải: hộp đèn, trục cuộn, bộ đếm yard"},
    pics=["Tiêu chuẩn thao tác kiểm vải 验布作业标准 dán cạnh máy"],
    qs=[("Cân điện tử cạnh máy kiểm vải dùng để cân gì (cân cả cây, hay mẫu để tính định lượng)?", "验布机旁边的电子秤是用来称什么的？称整卷还是称布块算克重？")])
upd(1, pics=["Bảng mẫu lỗi mặt vải (lỗ thủng, vết nước, chấm đen…) dưới lưu đồ kho", "Chụp gần từng tấm mẫu lỗi để đọc tên lỗi tiếng Trung"])
upd(3, d=("Ảnh 07/11: trên kệ có cây vải dán tem chữ D; bảng trạng thái cạnh máy có tem 色差 A, B, C, D; cạnh máy dán kết quả test phân biệt màu FM100 của người kiểm.",
          "照片：货架上有的布卷贴着D的色差标签；验布机旁边有色差标签A、B、C、D，还贴着检验员的FM100辨色测试结果。",
          "Photo 07/11: some rolls on the racks carry a D shade label; the board by the machine shows shade labels A–D and the inspectors' FM100 colour-vision results."),
    pics=["Cây vải trên kệ dán tem cấp màu (chữ D)", "Kết quả test phân biệt màu FM100 dán cạnh máy (đã che tên)"],
    qs=[("Cây vải tem D (ảnh kệ C24) vẫn phát cho xưởng cắt được không, hay phải qua 特采?", "贴D色差标签的布卷还能发给裁剪吗？还是要走特采？")])
upd(4, pic_edit={0: "Máy test ố vàng (nhãn máy: 黄化测试仪, Phenolic Yellowing Testing)",
                 1: "Bảng mục kiểm nghiệm 测试项目; khung góc phải là chứng nhận phòng thí nghiệm UA"},
    d=("Biển cửa ghi 质量检验室 (Phòng kiểm nghiệm chất lượng). Nhãn máy: 黄化测试仪 (test ố vàng); tủ sấy dán nhãn 汗渍牢度 (bền màu mồ hôi). Bảng 测试项目 chia 4 nhóm: tính chất vật lý, độ bền màu, giặt thành phẩm, formaldehyde.",
       "门牌写着质量检验室。机器上的标签：黄化测试仪；烘箱上贴着汗渍牢度。测试项目分四类：物性、色牢度、成品洗、甲醛。",
       "The door sign reads 质量检验室 (quality lab). Machine labels: 黄化测试仪 (yellowing tester); an oven labelled 汗渍牢度 (perspiration fastness). The testing-scope board has four groups: physical, colour fastness, product laundering, formaldehyde."),
    pics=["Tủ sấy dùng test bền màu mồ hôi (nhãn 汗渍牢度)", "Cửa phòng kiểm nghiệm chất lượng 质量检验室", "Bên trong phòng kiểm nghiệm: bàn test, giá mũ mẫu"],
    qs=[("Máy test ố vàng: nhãn ghi 黄化测试仪, báo cáo cũ ghi 黄变测试仪; bảng ghi 抗黄化. Trong phòng gọi thế nào?", "测黄变的机器，标签写黄化测试仪，以前的报告写黄变测试仪，大家平时叫哪个？")],
    w=["质量检验室", "测试项目", "汗渍牢度", "黄化测试仪"])
done()

# ---------- từ đọc được trên lưu đồ, biển, nhãn máy ----------
NEWT = [
    ("点收明细表", "diǎnshōu míngxìbiǎo", "biểu kiểm nhận hàng hóa (tổ thông tin in khi hàng đến)", "giayto", "check-in list"),
    ("物管订单分配表", "wùguǎn dìngdān fēnpèibiǎo", "biểu phân bổ đơn đặt hàng", "giayto", "order allocation sheet"),
    ("计划储位", "jìhuà chǔwèi", "vị trí kế hoạch (định sẵn chỗ để hàng)", "congdoan", "planned storage location"),
    ("进料检验", "jìnliào jiǎnyàn", "kiểm nghiệm hàng đến", "kiemtra", "incoming inspection"),
    ("干湿摩擦", "gānshī mócā", "ma sát khô và ướt (test bền màu)", "kiemtra", "dry and wet rubbing"),
    ("水洗牢度", "shuǐxǐ láodù", "độ bền màu khi giặt", "kiemtra", "wash fastness"),
    ("颜色核对", "yánsè héduì", "so màu", "kiemtra", "colour check"),
    ("盘调", "pántiáo", "điều chỉnh số liệu sau kiểm kê", "congdoan", "stock adjustment"),
    ("日常料账维护", "rìcháng liàozhàng wéihù", "duy trì số liệu hằng ngày", "congdoan", "daily stock-record upkeep"),
    ("主料合格标签", "zhǔliào hégé biāoqiān", "tem chủ liệu đạt (tem trắng)", "giayto", "main-material pass label"),
    ("辅料合格标签", "fǔliào hégé biāoqiān", "tem phụ liệu đạt (tem trắng)", "giayto", "trim pass label"),
    ("不合格标签", "bù hégé biāoqiān", "tem không đạt (tem đỏ)", "giayto", "fail label"),
    ("特采标签", "tècǎi biāoqiān", "tem xử lý đặc biệt (tem vàng, “kết quả đánh giá sau kiểm nghiệm”)", "giayto", "special-acceptance label"),
    ("货架", "huòjià", "kệ hàng", "noi", "rack"),
    ("衬布货架", "chènbù huòjià", "kệ vải lót cứng (biển ghi “Kệ hàng vải cứng”)", "noi", "interlining rack"),
    ("进口货架", "jìnkǒu huòjià", "kệ hàng nhập khẩu", "noi", "imported-goods rack"),
    ("国内物料", "guónèi wùliào", "vật liệu trong nước", "vatlieu", "domestic materials"),
    ("质量检验室", "zhìliàng jiǎnyànshì", "phòng kiểm nghiệm chất lượng (biển cửa)", "noi", "quality lab"),
    ("测试项目", "cèshì xiàngmù", "mục kiểm nghiệm (bảng trong phòng)", "kiemtra", "testing scope"),
    ("汗渍牢度", "hànzì láodù", "độ bền màu với mồ hôi", "kiemtra", "perspiration fastness"),
    ("黄化测试仪", "huánghuà cèshìyí", "máy test ố vàng (tên trên nhãn máy)", "may", "phenolic yellowing tester"),
]
for zh, py, vn, c, e in NEWT:
    assert zh not in T, zh
    T[zh] = (py, vn, "A0711", True, "Đọc được trên lưu đồ, biển hoặc nhãn máy trong ảnh kho 07/11.")
    CAT[zh] = c
    en.TERM_EN[zh] = e
    ADDED_0711.add(zh)

# tên tiếng Việt trên lưu đồ
py, vn, src, ok, note = T["咨询组"]
T["咨询组"] = (py, "tổ thông tin của kho (tên tiếng Việt trên lưu đồ; dịch sát chữ là tổ tư vấn)", src, ok, note)
py, vn, src, ok, note = T["主料组"]
T["主料组"] = (py, "tổ chủ liệu (tên trên lưu đồ; tổ giữ vải chính)", src, ok, note)
py, vn, src, ok, note = T["黄变测试仪"]
T["黄变测试仪"] = (py, vn, src, ok, (note + " " if note else "") + "Nhãn trên máy (ảnh 07/11) ghi 黄化测试仪.")

for sid in ("kho", "kiemvai"):
    for x in _S[sid]["steps"]:
        for t in x["w"]:
            assert t in T, ("thiếu từ", t)

# ô ảnh → ảnh (ảnh chỉ trong artifact)
PHOTOS = {
    "kho-1-1": "K01", "kho-1-2": "K01L", "kho-1-3": "K01R", "kho-1-4": "K02",
    "kho-3-1": "K03", "kho-3-2": "K04", "kho-4-2": "K10",
    "kho-7-1": "K04S", "kho-7-2": "K12", "kho-7-3": "K14", "kho-7-4": "K11", "kho-7-5": "K13",
    "kiemvai-1-1": "K03", "kiemvai-1-2": "K03C", "kiemvai-1-3": "K04A",
    "kiemvai-2-1": "K04R", "kiemvai-2-2": "K01D", "kiemvai-3-1": "K04P",
    "kiemvai-4-2": "K12D", "kiemvai-4-3": "K04F",
    "kiemvai-5-1": "K08", "kiemvai-5-2": "K09", "kiemvai-5-3": "K07", "kiemvai-5-4": "K05", "kiemvai-5-5": "K06",
}

# ---------- từ trong ghi chép tay của Bảo ở xưởng cắt 05/11 (dùng cho bài điền từ) ----------
SRC["TAY0511"] = "Ghi chép tay của Bảo ở xưởng cắt 05/11"
TAY = [  # (từ, pinyin, nghĩa, nhóm, tiếng Anh, mã bước xưởng cắt)
    ("刀模裁剪", "dāomó cáijiǎn", "chặt bằng dao chặt", "congdoan", "die cutting", 5),
    ("领料", "lǐngliào", "lĩnh liệu (xưởng lĩnh vải từ kho)", "congdoan", "collect materials by requisition", 1),
    ("二维码", "èrwéimǎ", "mã QR", "giayto", "QR code", 1),
    ("追溯", "zhuīsù", "truy vết", "kiemtra", "traceability", 1),
    ("弹性布", "tánxìngbù", "vải co giãn", "vatlieu", "stretch fabric", 2),
    ("回缩", "huísuō", "co lại (cho vải co trước khi cắt)", "kiemtra", "shrink back", 2),
    ("贴合机", "tiēhéjī", "máy dán", "may", "fusing machine", 3),
    ("起皱", "qǐzhòu", "nhăn", "loi", "wrinkling", 3),
    ("布边对齐", "bùbiān duìqí", "mép vải bằng nhau", "kiemtra", "aligned edges", 4),
    ("松紧", "sōngjǐn", "độ căng, chùng khi kéo vải", "kiemtra", "tension", 4),
    ("层高", "cénggāo", "độ cao chồng lớp vải", "bophan", "ply height", 4),
]
_cat = {x.get("key"): x for x in _S["cat"]["steps"]}
for zh, py, vn, c, e, k in TAY:
    assert zh not in T, zh
    T[zh] = (py, vn, "TAY0511", True, "Bảo ghi tại xưởng cắt 05/11 (từ nghe ở xưởng hoặc in trên biểu mẫu).")
    CAT[zh] = c
    en.TERM_EN[zh] = e
    ADDED_0711.add(zh)
    if zh not in _cat[k]["w"]:
        _cat[k]["w"].append(zh)
