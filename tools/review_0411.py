# -*- coding: utf-8 -*-
"""Soát lại 04/11 với Drive (W2, báo cáo kho 03/11) và mô hình "Giải phẫu mũ 6 mảnh".
Chỗ hai nguồn ghi khác nhau: không tự chọn một bên, ghi rõ cả hai và thêm câu cần hỏi."""
from data import STAGES

_S = {s["id"]: s for s in STAGES}


def step(sid, title):
    hit = [x for x in _S[sid]["steps"] if x["t"] == title]
    assert hit, (sid, title)
    return hit[0]


# Kho: thời hạn 7 ngày — báo cáo 03/11 ghi cho vải, W2 ghi cho phụ liệu
x = step("kho", "Nhận hàng")
x.setdefault("chk", []).append([
    "Thời hạn kiểm 7 ngày: báo cáo 03/11 ghi cho vải (kiểm tính chất và ngoại quan), W2 ghi cho phụ liệu. Còn phải hỏi lại.",
    "7天内检验完：11月3日的报告写的是面料，W2写的是辅料，还要再确认。"])
x.setdefault("qs", []).append([
    "Kiểm xong trong 7 ngày là cho vải, cho phụ liệu hay cả hai?",
    "7天内检验完，是指面料、辅料，还是两个都是？"])

x = step("kho", "Đạt hay không")
x.setdefault("qs", []).extend([
    ["“Xử lý trong 6 tháng” là trả hàng phải xong trong 6 tháng, hay hàng không đạt chỉ được để trong kho tối đa 6 tháng?",
     "“6个月内处理”是退货要在6个月内完成，还是不合格的物料最多只能在仓库放6个月？"],
    ["Kho chấm điểm nhà cung cấp hằng tháng dựa trên những mục nào?",
     "仓库每个月给供应商评分，看哪些项目？"],
])

# May: mô hình mũ 6 mảnh ghi chỉ thừa vắt sổ 5 mm, W2 ghi 3 mm (mũ giặt riêng 15 mm)
x = step("may", "Ráp thân")
x.setdefault("qs", []).append([
    "Vắt sổ: chỉ thừa giữa các chiếc tối đa 3 mm hay 5 mm? Mũ giặt có phải để 15 mm không?",
    "拷克：每顶之间的线头最多留3毫米还是5毫米？水洗帽是不是留15毫米？"])
