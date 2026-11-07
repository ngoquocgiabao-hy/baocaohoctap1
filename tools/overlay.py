# -*- coding: utf-8 -*-
"""Bổ sung 03/11: khâu 0 (mẫu, PPM), quy trình kiểm vải đầy đủ (máy kiểm vải, 4 điểm, phân cấp A/B/C),
ảnh cần chụp (pics) và câu hỏi cần hỏi (qs) cho từng bước.
qs: [tiếng Việt, 中文] hoặc [tiếng Việt, 中文, pinyin viết tay]; pinyin còn thiếu do build_all tự sinh.
pics: mô tả ảnh cần chụp; ảnh đặt trong img/<id khâu>-<số bước>-<số ảnh>.jpg sẽ tự hiện."""
from data import STAGES, T, SRC

T.update({
    "样品室": ("yàngpǐnshì", "phòng mẫu", "W6", True, ""),
    "开发样": ("kāifāyàng", "mẫu phát triển (Proto)", "W6", True, "Chỉnh thiết kế, thường đến bản 3 khách mới hài lòng."),
    "销售样": ("xiāoshòuyàng", "mẫu chào hàng (SMS)", "W6", True, ""),
    "产前样": ("chǎnqiányàng", "mẫu trước sản xuất (PPS)", "W6", True, "Chuẩn của hàng loạt; vật liệu bắt buộc đúng hàng loạt."),
    "产前会议": ("chǎnqián huìyì", "họp trước sản xuất (PPM)", "W6", True, ""),
    "审样": ("shěn yàng", "duyệt mẫu", "W6", True, "VF: CFT duyệt được mẫu rủi ro thấp và trung bình; mã mới khách duyệt."),
    "辅料": ("fǔliào", "phụ liệu", "KHO", True, "Phụ liệu kiểm AQL 1.5, xong trong 7 ngày."),
    "验布检查表": ("yànbù jiǎnchábiǎo", "biểu kiểm vải", "KHO", True, ""),
    "接收标准": ("jiēshōu biāozhǔn", "tiêu chuẩn chấp nhận", "KHO", True, ""),
})

S = {s["id"]: s for s in STAGES}

# ---------- khâu 0: mẫu và họp trước sản xuất ----------
STAGES.insert(0, {
    "id": "mau", "n": 0, "vn": "Mẫu & họp trước sản xuất", "zh": "样品室", "short": "Mẫu", "color": "#6b5b3e", "qb": True,
    "what": "Trước hàng loạt: mẫu phát triển → mẫu chào hàng → mẫu trước sản xuất → họp trước sản xuất. Đây là phần việc chính của CFT.",
    "whatz": "大货之前：开发样 → 销售样 → 产前样 → 产前会议。这是CFT的主要工作。",
    "who": "Phòng mẫu, kỹ thuật; khách duyệt mẫu; VF cho CFT duyệt mẫu rủi ro thấp, trung bình", "whoz": "样品室、技术部；客户审样；VF的低、中风险款可以由CFT审样",
    "steps": [
        {"t": "Mẫu phát triển (Proto)", "tz": "开发样",
         "d": "Để chỉnh thiết kế, thường làm đến bản 3 khách mới hài lòng; vật liệu được dùng loại thay thế.",
         "dz": "开发样用来改设计，一般做到第三版客户才满意，物料可以用替代的。",
         "w": ["样品室", "开发样", "纸样"],
         "pics": ["Phòng mẫu: bàn rập, mẫu đang làm"],
         "qs": [["Mẫu phát triển ở Weili do ai làm, mất mấy ngày một bản?", "开发样是谁做的？做一版要几天？"]]},
        {"t": "Mẫu chào hàng (SMS)", "tz": "销售样",
         "d": "Để khách chào bán, đo nhu cầu từng thị trường; vật liệu đúng hoặc thay thế.",
         "dz": "销售样给客户拿去卖货、看各个市场的需求，物料可以是正确的，也可以是替代的。",
         "w": ["销售样"]},
        {"t": "Mẫu trước sản xuất (PPS)", "tz": "产前样",
         "d": "Chuẩn của hàng loạt về màu, form, chất liệu, chất lượng; vật liệu bắt buộc đúng như hàng loạt. Khách duyệt; với VF thì CFT duyệt được mẫu rủi ro thấp và trung bình, mã mới bắt buộc khách duyệt.",
         "dz": "产前样是大货的标准：颜色、帽型、物料、质量，物料一定要跟大货一样。客户审样；VF的低、中风险款CFT可以审，新款一定要客户审。",
         "chk": [["VF: mẫu PPS cả bao bì cũng phải qua dò kim.", "VF：产前样连包装也要验针。"],
                 ["Mẫu xác nhận đóng dấu ở mảnh trước, dấu vắt qua hai mảnh.", "确认样的章盖在前片上，跨两片。"]],
         "w": ["产前样", "确认样", "审样"],
         "pics": ["Mẫu xác nhận có dấu ở mảnh trước", "Tem treo trên mẫu PPS"],
         "qs": [["Mẫu xác nhận do ai giữ, để ở đâu?", "确认样谁保管？放在哪里？"],
                ["Mẫu PPS của VF hiện nay ai duyệt ở xưởng?", "VF的产前样现在厂里是谁审？"]]},
        {"t": "Họp trước sản xuất (PPM)", "tz": "产前会议",
         "d": "Gồm kỹ thuật, QC, sản xuất, thêu, kế hoạch, khách phục. Yêu cầu nào làm tăng giờ công hay chi phí phải thống nhất với khách trước. Họp xong có biên bản: ngày, mã, người dự, vấn đề, cách xử lý, người phụ trách.",
         "dz": "参加的有技术、QC、生产、绣花、计划、客服。会增加工时或成本的要求，要先跟客户确认。开完会要有会议记录：日期、款号、参加人、问题、处理方法、负责人。",
         "w": ["产前会议", "大货"],
         "pics": ["Biên bản họp PPM (che thông tin khách nếu cần)"],
         "qs": [["Em có thể dự một buổi họp trước sản xuất không?", "我可以旁听一次产前会议吗？"],
                ["Biên bản họp lưu ở đâu, ai viết?", "会议记录放在哪里？谁写？"]]},
    ],
})

# ---------- khâu 1 Kho: tách bước kiểm, thêm máy kiểm vải và 4 điểm ----------
kho = S["kho"]
kho["steps"][1:2] = [
    {"t": "Kiểm tính chất vải", "tz": "物性检验",
     "d": "Cắt một mẫu ở đầu, giữa, cuối cây gửi phòng kiểm nghiệm: test ma sát khô/ướt, bền màu khi giặt, màu, cảm giác tay, độ dày, rồi ra báo cáo.",
     "dz": "布头、布中、布尾各剪一块送检验室，测干湿摩擦、水洗牢度、颜色、手感、厚度，出品质检测报告。",
     "chk": [["Xem màu cả cây có đều không, có nằm trong tiêu chuẩn chấp nhận không.", "看整匹布颜色是否一致，在不在接收标准内。"]],
     "w": ["物性检验", "接收标准"],
     "pics": ["Ba mẫu vải cắt ở đầu, giữa, cuối cây"],
     "qs": [["Mỗi lô vải gửi phòng kiểm nghiệm mấy mẫu? Chờ kết quả bao lâu?", "每批布送检验室几块？结果要等多久？"]]},
    {"t": "Kiểm ngoại quan trên máy kiểm vải", "tz": "外观检验、验布机", "hot": True,
     "d": "Cho cây vải chạy qua máy kiểm vải (có hộp đèn, bộ đếm yard, cân). Người kiểm đếm yard, đo khổ, xem chênh lệch màu và lỗi vải, chấm điểm từng lỗi theo thang 4 điểm, cộng lại, quy về 100 yd² rồi xếp cấp A, B hoặc C. Kết quả ghi vào biểu kiểm vải và lên tem cây vải.",
     "dz": "布卷放到验布机上过一遍（有灯箱、码数计数器、电子秤）。检验员查码数、量幅宽、看色差和瑕疵，每个瑕疵按四分制扣分，加起来换算成每百平方码的分数，再分A、B、C级。结果填在验布检查表上，也写在布卷标签上。",
     "chk": [
         ["Chấm điểm theo chiều dài lỗi: đến 3 inch trừ 1; 3–6 inch trừ 2; 6–9 inch trừ 3; trên 9 inch trừ 4.", "按瑕疵长度扣分：3英寸以下扣1分，3到6英寸扣2分，6到9英寸扣3分，9英寸以上扣4分。"],
         ["Quy đổi: điểm/100 yd² = 3.600 × tổng điểm ÷ (số yard × khổ inch).", "换算：每百平方码分数 = 3600 × 总扣分 ÷（码数 × 幅宽英寸）。"],
         ["Xếp cấp: A tối đa 29 điểm, B tối đa 47, C tối đa 62.", "分级：A级最多29分，B级最多47分，C级最多62分。"],
         ["VD: 100 yard, khổ 60 inch, trừ 20 điểm → 3.600 × 20 ÷ 6.000 = 12 điểm → cấp A.", "例如：100码、幅宽60英寸、扣20分，3600 × 20 ÷ 6000 = 12分，是A级。"],
         ["Điền biểu kiểm vải; cấp điểm trừ ghi lên tem cây vải để xưởng cắt đọc được.", "填验布检查表；扣点等级写在布卷标签上，裁剪看得到。"],
     ],
     "w": ["外观检验", "验布机", "四分制", "扣点等级", "验布检查表"],
     "pics": ["Máy kiểm vải: hộp đèn, bộ đếm yard", "Bảng thang 4 điểm và mẫu trừ điểm dán cạnh máy", "Biểu kiểm vải đã điền (che số đơn nếu cần)"],
     "qs": [["Mỗi lô kiểm bao nhiêu phần trăm số cây?", "每批布验多少卷？百分之几？"],
            ["Trên 62 điểm thì xử lý thế nào: xử lý đặc biệt hay trả hàng?", "超过62分怎么处理？走特采还是退货？"],
            ["Một yard có tính tối đa 4 điểm không? Lỗ thủng tính mấy điểm?", "一码最多扣4分吗？破洞扣几分？"]]},
    {"t": "Kiểm phụ liệu", "tz": "辅料检验",
     "d": "Phụ liệu kiểm AQL 1.5, xong trong 7 ngày: kiểm đếm, xem ngoại quan, đo dài rộng cao, đối chiếu mẫu chuẩn và đơn trên hệ thống.",
     "dz": "辅料按AQL 1.5检验，7天内完成：点收、看外观、量长宽高，对照标准样和系统订单。",
     "chk": [["Nhãn: kiểm size, mã vạch, số lượng so với mẫu chuẩn và đơn.", "标签：对照标准样和系统订单，核对尺码、条码和数量。"]],
     "w": ["辅料"],
     "pics": ["Tem thùng phụ liệu của nhà cung cấp (ô 帽零件, 汗带, 调整带, 辅料)", "Bàn kiểm phụ liệu, mẫu chuẩn"],
     "qs": [["Phụ liệu AQL 1.5 lấy mẫu theo bảng nào? Mẫu chuẩn để ở đâu?", "辅料AQL 1.5按哪张表抽样？标准样放在哪里？"]]},
]

# ---------- khâu 2 Kiểm vải: viết lại thành quy trình đủ bước ----------
S["kiemvai"]["what"] = "Cây vải chạy qua máy kiểm vải → chấm điểm từng lỗi theo thang 4 điểm → quy về 100 yd² → xếp cấp A, B, C → ghi biểu, ghi tem. Lỗi không nhìn thấy (bền màu, co rút, pH, formaldehyde) gửi phòng kiểm nghiệm."
S["kiemvai"]["whatz"] = "布卷过验布机 → 按四分制给每个瑕疵扣分 → 换算成每百平方码 → 分A、B、C级 → 填表、写标签。看不见的问题（色牢度、缩率、pH、甲醛）送检验室。"
S["kiemvai"]["steps"] = [
    {"t": "① Lên máy kiểm vải", "tz": "上验布机", "hot": True,
     "d": "Máy có hộp đèn, bộ đếm yard, cân điện tử. Cạnh máy dán tiêu chuẩn kiểm vải, cách tính 4 điểm, tiêu chuẩn chính liệu, mẫu trừ điểm, tem trạng thái.",
     "dz": "验布机带灯箱、码数计数器和电子秤。旁边贴着验布作业标准、四分制分类和计算、主料检验标准、扣分参考样和物料状态标识。",
     "chk": [["Kiểm số yard, khổ vải, chênh lệch màu và lỗi vải.", "查码数、幅宽、色差和瑕疵。"],
             ["Đánh dấu chỗ lỗi trên vải và ghi vào biểu kiểm vải.", "在布上标出瑕疵位置，填验布检查表。"]],
     "w": ["验布", "验布机", "码数", "幅宽", "色差", "瑕疵", "验布检查表"],
     "pics": ["Máy kiểm vải đang chạy, hộp đèn", "Bộ đếm yard và cân"],
     "qs": [["Máy chạy tốc độ bao nhiêu? Một cây kiểm mất bao lâu?", "验布机开多快？验一卷要多久？"],
            ["Đánh dấu lỗi trên vải bằng gì?", "布上的瑕疵用什么做记号？"]]},
    {"t": "② Chấm điểm từng lỗi (4 điểm)", "tz": "四分制扣分", "hot": True,
     "d": "Mỗi lỗi trừ điểm theo chiều dài: đến 3 inch trừ 1; 3–6 inch trừ 2; 6–9 inch trừ 3; trên 9 inch trừ 4. Cạnh máy có mẫu trừ điểm để so.",
     "dz": "每个瑕疵按长度扣分：3英寸以下扣1分，3到6英寸扣2分，6到9英寸扣3分，9英寸以上扣4分。机器旁边有扣分参考样可以对照。",
     "w": ["四分制"],
     "pics": ["Mẫu trừ điểm dán cạnh máy"],
     "qs": [["Một yard có tính tối đa 4 điểm không? Lỗ thủng tính mấy điểm?", "一码最多扣4分吗？破洞扣几分？"],
            ["Lỗi chạy dọc cả cây (sọc, lệch màu hai biên) tính điểm thế nào?", "整卷都有的问题，比如条纹、左右色差，怎么扣分？"]]},
    {"t": "③ Quy đổi và xếp cấp A, B, C", "tz": "换算和分A、B、C级", "hot": True,
     "d": "Cộng điểm cả cây rồi quy về 100 yd²: điểm = 3.600 × tổng điểm ÷ (số yard × khổ inch). A tối đa 29, B tối đa 47, C tối đa 62.",
     "dz": "把整卷的扣分加起来，换算成每百平方码：分数 = 3600 × 总扣分 ÷（码数 × 幅宽英寸）。A级最多29分，B级最多47分，C级最多62分。",
     "chk": [["VD: 100 yard, khổ 60 inch, trừ 20 điểm → 3.600 × 20 ÷ 6.000 = 12 điểm → cấp A.", "例如：100码、幅宽60英寸、扣20分，3600 × 20 ÷ 6000 = 12分，是A级。"],
             ["VD: 80 yard, khổ 58 inch, trừ 45 điểm → 3.600 × 45 ÷ 4.640 ≈ 34,9 điểm → cấp B.", "例如：80码、幅宽58英寸、扣45分，3600 × 45 ÷ 4640 ≈ 34.9分，是B级。"],
             ["Ghi cấp điểm trừ lên tem cây vải (扣点等级) để xưởng cắt đọc được.", "扣点等级写在布卷标签上，裁剪看得到。"]],
     "w": ["扣点等级"],
     "pics": ["Bảng cách tính 4 điểm dán cạnh máy", "Tem cây vải có ô cấp điểm trừ"],
     "qs": [["Trên 62 điểm thì xử lý thế nào: xử lý đặc biệt hay trả hàng?", "超过62分怎么处理？走特采还是退货？"],
            ["Vải cấp B, C có được phát cho xưởng cắt không? Ai quyết?", "B级、C级的布可以发给裁剪吗？谁决定？"],
            ["Khách khác nhau (UA, VF) có ngưỡng A, B, C khác nhau không?", "不同客户（UA、VF）的A、B、C分数标准一样吗？"]]},
    {"t": "④ Xếp cấp chênh lệch màu A–D", "tz": "色差级数",
     "d": "Kho chia cây vải theo cấp chênh lệch màu A–D, ghi trên tem cây vải. Người xem màu phải qua test FM100 trước.",
     "dz": "仓库把布卷按色差分A到D级，写在布卷标签上。看色的检验员要先做辨色测试（X-Rite FM 100）。",
     "w": ["色差级数", "辨色测试"],
     "pics": ["Tem cây vải có ô cấp chênh lệch màu"],
     "qs": [["Cấp A–D chia theo cách nào: so với mẫu chuẩn nào, dưới đèn gì?", "色差级数A到D是怎么分的？跟哪个标准样比？用什么灯？"]]},
    {"t": "⑤ Phòng kiểm nghiệm", "tz": "检验室",
     "d": "4 nhóm test: tính chất vật lý, độ bền màu, giặt thành phẩm, formaldehyde. Phòng có chứng nhận phòng thí nghiệm của Under Armour.",
     "dz": "检验室的测试分四类：物性、色牢度、成品洗、甲醛。墙上挂着Under Armour的实验室认可证书。",
     "chk": [["Tính chất vật lý: co rút khi giặt, định lượng, chống thấm, lão hóa, hút ẩm, khổ, pH, khô nhanh, mật độ, bền thăng hoa.", "物性：水洗缩率、布重、防泼水、老化、吸湿、幅宽、pH值、快干、密度、升华牢度。"],
             ["Độ bền màu: giặt, mồ hôi, ma sát, ánh sáng, chống ố vàng, di màu, nước, mồ hôi kèm ánh sáng.", "色牢度：水洗、汗渍、摩擦、日光、抗黄变、色移、耐水、汗光。"]],
     "w": ["检验室", "色牢度", "克重", "甲醛"],
     "pics": ["Máy test ố vàng, tủ sấy test mồ hôi", "Chứng nhận phòng thí nghiệm UA treo tường"],
     "qs": [["Test nào xưởng tự làm được, test nào phải gửi ra ngoài?", "哪些测试厂内能做，哪些要外送？"],
            ["Yêu cầu test mũ của VF (AATCC 8, 15, 16.3, 107, pH) xưởng làm được những cái nào?", "VF帽子要做的测试（AATCC 8、15、16.3、107、pH），厂内能做哪几个？"]]},
]

# ---------- ảnh và câu hỏi cho các khâu còn lại (theo tên bước) ----------
ADD = {
 ("kho", "Nhận hàng"): {"pics": ["Hai lưu đồ trên tường kho (quản lý kho, tổ kiểm nghiệm)"],
     "qs": [["Hàng về thì phải kiểm xong trong bao lâu?", "到料以后多久要检验完？"]]},
 ("kho", "Đạt hay không"): {"pics": ["Khu để hàng không đạt", "Phiếu phản hồi nghiệm thu"],
     "qs": [["Phiếu phản hồi nghiệm thu điền thế nào, ai ký xét xử lý đặc biệt?", "验收反应单怎么填？特采谁评估、谁签字？"],
            ["Với VF, UA, xử lý đặc biệt có cần khách đồng ý bằng văn bản không?", "VF和UA的物料走特采，要先拿到客户书面同意吗？"]]},
 ("kho", "Phát cho xưởng cắt"): {"pics": ["Phiếu lĩnh liệu"],
     "qs": [["Phiếu lĩnh liệu có ghi cấp chênh lệch màu không?", "领料单上有没有写色差级数？"]]},
 ("kho", "Tem và vị trí"): {"pics": ["Các loại tem trạng thái", "Kệ có mã vị trí C24-3-2"]},
 ("cat", "① Nhận cây, đọc tem"): {"pics": ["Tem trắng cây vải (che số hợp đồng nếu cần)"],
     "qs": [["Bảng chữ cái màu của mã vật tư có bảng in sẵn không?", "品号最后一个字母代表颜色，有没有对照表？"]]},
 ("cat", "② Xả vải"): {"pics": ["Khu xả vải, cây vải đang xả"],
     "qs": [["Vải nào phải xả, vải nào không?", "哪些布要松布，哪些不用？"]]},
 ("cat", "③ Dán lót keo — sếp nói “hé tiē”"): {"pics": ["Máy dán đường thẳng", "Phiếu phụ trợ dán trên cuộn đã dán", "Biểu ghi nhiệt độ và lực kéo"],
     "qs": [["Ba số cuối “150” trong mã dán là nhiệt độ hay thông số khác?", "贴合代码最后三位“150”是温度还是别的参数？"],
            ["Bảng nhiệt độ trong SOP không có polyester; vải polyester dùng nhiệt độ, áp suất nào?", "作业标准的温度表里没有涤纶，涤纶布用什么温度和气压？"],
            ["SOP ghi áp suất 4–6 “pa”, biểu ghi 0,2 MPa: đơn vị thật là gì?", "作业标准写气压4到6，单位写pa，记录表写0.2MPa，实际单位是什么？"],
            ["Nhiệt khi dán thấp hơn mức cài 5–6 °C: lệch bao nhiêu thì phải chỉnh?", "贴合中实际温度比设定低5到6度，差多少要调整？"]]},
 ("cat", "④ Kéo vải — sếp nói “la bù”"): {"pics": ["Bàn kéo vải: số lớp, mép vải", "Phiếu sơ đồ cắt M-10-44-A-3"],
     "qs": [["Vải khác cấp màu A–D tách thế nào trên bàn?", "不同色差级数的布在台上怎么分开？"],
            ["Mỗi loại vải kéo tối đa bao nhiêu lớp?", "每种布最多拉几层？"]]},
 ("cat", "⑤ Chặt"): {"pics": ["Bộ dao chặt của một mã (tem mã, size)", "Máy chặt và giấy nâu lót"],
     "qs": [["Dao mới ai duyệt? So với rập thế nào?", "新刀模谁确认？怎么跟纸样比？"],
            ["Giấy nâu lót dưới vải để làm gì?", "裁的时候布下面垫牛皮纸是做什么用的？"]]},
 ("cat", "⑥ Máy làm nút đỉnh"): {"pics": ["Máy làm nút đỉnh", "Nút đã bọc vải"]},
 ("cat", "⑦ Mã lỗi mảnh cắt"): {"pics": ["Biển mã lỗi mảnh cắt", "Thùng mảnh cắt lỗi"],
     "qs": [["Mảnh lỗi bổ sung thế nào: cắt bù hay lấy từ đâu?", "不良裁片怎么补？补裁还是从哪里拿？"]]},
 ("cat", "⑧ Chọn và buộc mảnh"): {"pics": ["Bảng tính bó 144", "Thẻ quy trình A trên một bó", "Khu chờ giao mảnh"],
     "qs": [["Tên tiếng Trung in trên thẻ quy trình A là gì?", "这张A卡上面印的中文名称是什么？"],
            ["Công đoạn 755L “烤边(2)” là gì?", "755L“烤边(2)”是什么工序？"],
            ["Phiếu nhỏ trên thẻ có dùng để tính lương theo sản phẩm không?", "卡上的小票是用来计件的吗？"]]},
 ("theu", "Thêu logo"): {"pics": ["Máy thêu: số đầu, khung phẳng hay khung mũ", "Màn hình máy: tên file, số mũi, tốc độ"],
     "qs": [["Mã nào thêu trên mảnh phẳng, mã nào thêu trên mũ đã may?", "哪些款在裁片上绣，哪些款车好帽子再绣？"]]},
 ("theu", "Lỗ thoáng"): {"pics": ["Máy thêu lỗ thoáng ở chuyền may"]},
 ("theu", "Chiếc đầu và lỗi hay gặp"): {"pics": ["Mẫu duyệt treo cạnh máy", "Mặt trái hình thêu", "Lỗi thêu thật ở khu hàng lỗi"],
     "qs": [["Chiếc thêu đầu ai kiểm, ai ký?", "首件谁检查、谁签字？"],
            ["Giấy lót chọn theo gì, lót mấy lớp?", "底纸怎么选？垫几层？"],
            ["Máy thêu gãy kim thì làm theo quy trình quản lý kim thế nào?", "绣花机断针，按管针流程怎么处理？"]]},
 ("in", "Ba cách làm"): {"pics": ["Khung lưới và bàn in tay", "Máy in (“dập máy”)", "Máy ép logo: màn hình nhiệt độ, thời gian, áp lực"],
     "qs": [["“Dập máy” tiếng Trung xưởng gọi là gì?", "机器印厂里叫什么？"],
            ["In lưới xưởng gọi là 丝印 hay 丝网印刷?", "手工印厂里叫丝印还是丝网印刷？"],
            ["Khi nào in tay, khi nào in máy, khi nào ép logo?", "什么时候手工印、机器印、转印？"]]},
 ("in", "Kiểm"): {"pics": ["Băng keo test bám dính, mẫu test giặt", "Dưỡng định vị logo"],
     "qs": [["Test bám dính ai làm, bao lâu một lần, ghi ở đâu?", "附着力测试谁做？多久做一次？记录在哪里？"],
            ["Thông số ép do nhà cung cấp cho hay xưởng tự thử? Ai duyệt trước hàng loạt?", "压烫参数是供应商给的还是厂里自己试的？大货前谁确认？"],
            ["品保部 kiểm thêm phần in những gì, lấy mẫu bao nhiêu?", "印花这块品保部查什么？抽多少？"]]},
 ("in", "Lỗi"): {"pics": ["Mảnh in lỗi: bong, nứt, lệch"]},
 ("giat", "Giặt"): {"pics": ["Máy giặt ở tầng 1"],
     "qs": [["Sau giặt kiểm những gì: màu, co rút, cảm giác tay?", "水洗后查什么？颜色、缩率、手感？"]]},
 ("may", "Ráp thân"): {"pics": ["Thẻ SOP trên máy ráp thân trước (bản Trung và bản Việt)"],
     "qs": [["Ráp thân trước 12 hay 11 mũi/inch? Bản nào đúng?", "前合片每英寸12针还是11针？哪个对？"]]},
 ("may", "Lưỡi trai"): {"pics": ["Máy chạy chỉ vành tự động", "Tấm lưỡi trai"],
     "qs": [["Mỗi mã gọn vành chừa bao nhiêu, ghi ở đâu?", "每个款修眉留多少？写在哪里？"]]},
 ("may", "Bên trong và phía sau"): {"pics": ["Thun chống mồ hôi đã may (mặt trong)", "Khóa sau"],
     "qs": [["Đánh bọ ở khóa sau (bartack) xưởng gọi là gì?", "后扣那里的bartack厂里叫什么？"]]},
 ("may", "Đỉnh mũ và cắt chỉ"): {"pics": ["Máy đóng nút đỉnh"],
     "qs": [["Áp suất 6–9 khi đóng nút là đơn vị gì? Kiểm nút lỏng bằng cách nào?", "打顶扣压力6到9是什么单位？顶扣松不松怎么查？"]]},
 ("may", "Lỗi may hay gặp"): {"pics": ["Mẫu lỗi may (nếu chuyền có treo)"]},
 ("dinhform", "Ép cong vành"): {"pics": ["Máy ép cong vành TYL-1908-R, màn hình nhiệt"],
     "qs": [["Máy ép cong vành đo nhiệt bao lâu một lần? Lệch bao nhiêu thì dừng?", "弯眉整烫机多久测一次温度？差多少要停机？"]]},
 ("dinhform", "Định form"): {"pics": ["Đầu mẫu bằng nhôm", "Thẻ định form trên máy"],
     "qs": [["Thẻ ghi 165–180 °C nhưng máy cài 110–135 °C: theo cái nào?", "定型卡写165到180度，机器设110到135度，按哪个？"]]},
 ("qc", "8 bước kiểm"): {"pics": ["Bàn QC cuối chuyền, iPad quét mã", "Bảng thứ tự kiểm mũ 6 miếng"],
     "qs": [["Chỉnh dây sau về 9.5 ứng với thông số nào?", "后面调到9.5是对应哪个尺寸？"]]},
 ("qc", "15 điểm kiểm"): {"pics": ["Mũ lỗi mẫu cho từng điểm (nếu có)"]},
 ("qc", "Lỗi thì xử lý sao"): {"qs": [["Xù mép thun chống mồ hôi là lỗi nhẹ hay nặng?", "汗带毛边算轻微缺陷还是严重缺陷？"]]},
 ("xuat", "Đóng gói"): {"pics": ["Máy đo độ ẩm và ảnh đo", "Thùng có tem vận chuyển và GS1-128"],
     "chk_add": [["Số Kit trên PO quyết định bộ nhãn (nhãn giặt, VID, UPC, nhãn túi, thẻ treo); đối chiếu bảng nhãn của UA theo cột Kit.", "PO上的Kit号决定用哪一套标签：洗水唛、VID、UPC、袋标、吊牌，按UA标签表的Kit栏核对。"]],
     "qs": [["Tem GS1-128 dán cách đáy thùng 2 inch hay 5 inch?", "GS1-128标签离箱底2英寸还是5英寸？"]]},
 ("xuat", "QA lấy mẫu"): {"qs": [["Lấy 13 chiếc AQL 1.5 thì lỗi nặng, lỗi nhẹ tính riêng hay chung?", "抽13顶的时候，严重缺陷和轻微缺陷分开算还是一起算？"]]},
 ("xuat", "Dò kim"): {"pics": ["Chuyền dò kim"]},
 ("xuat", "CFA của khách và xuất hàng"): {"pics": ["Màn hình Pivot88 (không chụp thông tin khách nếu chưa được phép)"],
     "qs": [["Ai tải báo cáo GB và email phê duyệt lên Pivot88?", "GB报告和批准邮件谁上传到Pivot88？"]]},
}

for s in STAGES:
    for x in s["steps"]:
        x.setdefault("pics", []); x.setdefault("qs", [])
        add = ADD.get((s["id"], x["t"]))
        if add:
            x["pics"] = x["pics"] + add.get("pics", [])
            x["qs"] = x["qs"] + add.get("qs", [])
            if add.get("chk_add"):
                x["chk"] = x.get("chk", []) + add["chk_add"]
        a = x.pop("ask", None)
        if a:   # câu hỏi cũ dạng [中文, pinyin, Việt]
            x["qs"] = [[a[2], a[0], a[1]]] + x["qs"]

used = {(s["id"], x["t"]) for s in STAGES for x in s["steps"]}
missing = [k for k in ADD if k not in used]
assert not missing, missing

# số thứ tự hiển thị
for i, s in enumerate(STAGES):
    s["n"] = i
