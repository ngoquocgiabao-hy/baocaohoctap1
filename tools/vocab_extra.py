# -*- coding: utf-8 -*-
"""Phân loại từ, bảng từ dùng sai → đúng, từ chờ xác nhận (khớp file W7 trên Drive)."""

CATS = [
    ("noi",      "Nơi, bộ phận",          "部门、地方"),
    ("congdoan", "Công đoạn, thao tác",   "工序、动作"),
    ("kiemtra",  "Kiểm tra, chất lượng",  "检验、品质"),
    ("loi",      "Lỗi",                   "不良"),
    ("giayto",   "Giấy tờ, tem, mã",      "单据、标签"),
    ("may",      "Máy, dụng cụ",          "机器、工具"),
    ("bophan",   "Bộ phận mũ, thông số",  "帽子部位、参数"),
    ("vatlieu",  "Vật liệu, mẫu",         "物料、样品"),
]

_C = {
    "noi": "仓库 品保部 检验室 裁剪 待装片区 储位 验布 车缝 绣花 印花",
    "congdoan": "收料 点收 入库 发料 退货 特采 松布 贴合 拉布 双面拉布 排版 挑片 绑片 丝印 转印 洗水 合片 前合片 帽双 后双 拷克 包边 束眉 修眉 绕线 打顶扣 修线 弯眉整烫 前整烫 包装 验针 出货 返工 重做 防霉 关键工序",
    "kiemtra": "物性检验 外观检验 四分制 辨色测试 色牢度 首件检验 巡检 中查 尾查 抽样 允收 拒收 重验 六片帽检验顺序 含水率 克重 甲醛 轻微缺陷 严重缺陷 色差 色差级数 扣点等级 码数 幅宽",
    "loi": "瑕疵 渗胶 打卷 裁剪不良 布质不良 裁剪脏污 接匹 破洞 贴合不良 绣花起皱 绣花起毛 印花模糊 转印变形 跳针 浮线 车缝起皱 双针大小边 帽型不佳 断线 接线 汗带外露 线头",
    "giayto": "验收反应单 领料单 补料单 物料状态标识 品号 缸号 贴合辅助单据 裁次 裁片捆绑计算表 尾数包 吊牌 箱唛 装箱单 外箱标签 洗水唛 尾箱",
    "may": "验布机 直线贴合机 涂布贴合机 刀模 纸样 牛皮纸 头模 水分测定仪",
    "bophan": "前片 后片 眉面 眉里 顶扣包布 顶扣 眉板 帽檐 帽眉 尺寸带 汗带 排扣 后扣 牛筋衬 后喇叭 帽围 尺寸 扣具 裁片 针距 缝份 回针 绣洞",
    "vatlieu": "面布 衬布 点胶衬 胶水 固化剂 水洗帽 确认样 大货",
}
CAT = {w: c for c, ws in _C.items() for w in ws.split()}

# (sai, đúng, pinyin, tiếng Việt dùng, nguồn)
WRONG = [
    ("铺布 / trải vải", "拉布", "lābù", "kéo vải (xếp vải thành lớp)", "Sếp nói; phiếu ghi 双面拉布"),
    ("dao khuôn", "刀模", "dāomó", "dao chặt", "W6"),
    ("ép dán", "贴合", "tiēhé", "dán (vải chính với lót có keo)", "SOP M-10-71"),
    ("色差标签 / tem ánh màu", "色差级数", "sèchā jíshù", "cấp chênh lệch màu (A–D)", "Tem cây vải"),
    ("湿度", "含水率", "hánshuǐlǜ", "độ ẩm", "W6"),
    ("裁床", "裁剪", "cáijiǎn", "xưởng cắt / cắt", "W2"),
    ("扎包、二维码卡", "挑片、绑片；A卡", "tiāopiàn, bǎngpiàn", "chọn, buộc mảnh; thẻ quy trình A", "SOP M-10-72"),
    ("热转印 / 机印 / ép nhiệt", "转印", "zhuǎnyìn", "ép logo (chuyển in)", "W6"),
    ("定型（烫、弯眉）/ uốn vành", "弯眉整烫", "wānméi zhěngtàng", "ép cong vành", "W6"),
    ("上汗带、上眉 / đai mồ hôi", "汗带、帽眉", "hàndài, màoméi", "thun chống mồ hôi, vành mũ", "W6"),
    ("样品间、版房", "样品室", "yàngpǐnshì", "phòng mẫu", "W6"),
    ("QA验箱", "QA抽检", "QA chōujiǎn", "QA lấy mẫu kiểm", "W6 (抽样)"),
    ("产前会", "产前会议", "chǎnqián huìyì", "họp trước sản xuất (PPM)", "W6"),
    ("品质部", "品保部", "pǐnbǎo bù", "phòng đảm bảo chất lượng", "Bảo xác nhận"),
    ("五金", "打顶扣和后扣等配件", "dǎ dǐngkòu hé hòukòu děng pèijiàn", "đóng nút đỉnh, khóa sau", "Chị Hương không hiểu 五金"),
    ("实验室", "检验室", "jiǎnyànshì", "phòng kiểm nghiệm", "Báo cáo kho 31/10"),
    ("十个站点 / 10 ga", "十个环节", "shí gè huánjié", "10 khâu", "Quy định W7"),
]
HOT = {"拉布", "刀模", "贴合", "色差级数", "含水率", "裁剪", "挑片", "绑片", "转印", "弯眉整烫", "汗带", "帽眉", "品保部", "检验室", "抽样"}

PENDING = [
    ("丝印", "in lưới", "SOP của VF viết 丝网印刷; hỏi xưởng gọi thế nào."),
    ("“dập máy”", "in máy", "Tên tiếng Trung chưa biết."),
    ("洗水", "giặt", "Chưa thấy trên biểu mẫu; tạm dùng 水洗 / 水洗帽."),
    ("流程卡", "thẻ quy trình A", "Chưa xem tên in trên thẻ; tạm viết “A卡”."),
    ("máy làm nút đỉnh", "có thể bọc 顶扣包布 lên nút", "Tên máy chưa biết."),
    ("“hé tiē”", "sếp nói", "Có thể là 贴合 đọc ngược; hỏi lại."),
    ("755L 烤边(2)", "công đoạn trên thẻ A", "Chưa rõ là gì."),
    ("máy chặt Chenfeng số 28", "máy chặt", "Tên tiếng Trung chưa biết; tạm viết “28号机”."),
]
