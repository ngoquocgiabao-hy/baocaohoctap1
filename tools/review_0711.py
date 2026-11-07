# -*- coding: utf-8 -*-
"""Rà soát toàn bộ quy trình 07/11 (tab Cần hỏi): khâu nào đã chắc, chỗ nào cần làm rõ, ảnh nào cần chụp.
Số câu hỏi, ảnh có/thiếu, từ chưa xác nhận do trang tự đếm; ở đây chỉ ghi phần chốt bằng tay cho Kho, Kiểm vải, Cắt
(ba khu đã có ảnh thực tế). Câu hỏi chi tiết nằm trong từng bước (qs), ảnh trong từng ô (pics)."""

REVIEW = {
    "date": "07/11",
    "focus": ["kho", "kiemvai", "cat"],
    "stages": {
        "kho": {
            "ok": [
                "Hai lưu đồ trên tường (ảnh 07/11): quy trình quản lý kho 仓库管理部 và tổ kiểm nghiệm 检验组.",
                "Ba tổ: tổ thông tin 咨询组 (kiểm nhận 点收, in 点收明细表, trừ sổ 减账), tổ kiểm nghiệm 检验组, tổ chủ liệu 主料组 (nhập kho 入库).",
                "Đạt 合格 → nhập ERP → 验收明细表 → nhập kho. Không đạt 不合格 → 验收反应单 → 特采 → không được thì 退货.",
                "Phát liệu theo 领料单; thiếu thì 补料单; kiểm kê 盘点 lệch thì 盘调申请 → 盘调.",
                "Tem trạng thái: 主料合格标签, 辅料合格标签 (trắng), 不合格标签 (đỏ), 特采标签 (vàng), tem đợi xử lý (mũi tên đỏ), 色差标签 A–D. Kệ: 衬布货架, 进口货架, 国内物料; ô kệ dạng C24-3-2.",
            ],
            "ask": [
                "Thời hạn kiểm 7 ngày áp cho vải hay phụ liệu (báo cáo 03/11 và W2 ghi khác nhau).",
                "Tem vàng trên nhiều cây vải ở kệ: là 特采标签 hay tem nhà cung cấp?",
                "特采: ai ký, “xử lý trong 6 tháng” nghĩa là gì; VF, UA có cần khách đồng ý bằng văn bản không.",
                "领料单 có ghi cấp màu 色差级数 không; phụ liệu phát thẳng cho chuyền may hay qua xưởng cắt.",
            ],
            "pics": [
                "Biểu kiểm vải 验布检查表 đã điền (che số đơn).",
                "Phiếu 验收反应单 và khu để hàng không đạt.",
                "Tem cây vải chụp gần: đọc được 品号, 缸号, cấp màu, cấp điểm trừ.",
                "Phiếu lĩnh liệu 领料单; tem thùng phụ liệu.",
                "Ba mẫu vải cắt ở đầu, giữa, cuối cây gửi phòng kiểm nghiệm.",
            ],
        },
        "kiemvai": {
            "ok": [
                "Máy kiểm vải 验布机: hộp đèn, bộ đếm yard, cân; cạnh máy dán 验布作业标准, 主料检验标准, mẫu trừ điểm (ảnh 07/11).",
                "Chấm lỗi theo 四分制, quy đổi rồi xếp A, B, C; cấp điểm trừ ghi lên tem cây vải.",
                "Người xem màu qua test FM100 (辨色测试); cây vải chia cấp màu A–D.",
                "Phòng kiểm nghiệm 质量检验室: 4 nhóm test (vật lý, bền màu, giặt thành phẩm, formaldehyde); máy test ố vàng; tủ sấy test mồ hôi; chứng nhận phòng thí nghiệm UA.",
            ],
            "ask": [
                "Mỗi lô kiểm bao nhiêu phần trăm số cây; trên 62 điểm thì 特采 hay trả hàng.",
                "Vải cấp B, C (điểm trừ) và cấp màu D có được phát cho xưởng cắt không, ai quyết.",
                "Test nào xưởng tự làm, test nào gửi ngoài; yêu cầu test của VF làm được những cái nào.",
                "Máy test ố vàng: nhãn ghi 黄化测试仪, báo cáo cũ ghi 黄变测试仪; trong phòng gọi thế nào.",
            ],
            "pics": [
                "Tem cây vải có ô cấp điểm trừ và cấp màu (chụp gần).",
                "Chụp gần từng tấm mẫu lỗi mặt vải để đọc tên lỗi.",
                "Biển tên, nhãn của từng máy test trong phòng kiểm nghiệm.",
            ],
        },
        "cat": {
            "ok": [
                "13 bước theo báo cáo, ảnh 05/11 và lời chị Thắm: lĩnh vải 领料 → xả 松布 → phiếu → dán 贴合 → kéo 拉布 → chặt 刀模裁剪 → laser, máy dập nút (tùy mã) → nút đỉnh → mã lỗi → chọn, buộc 挑片、绑片 144 bộ/bó → 品保部 kiểm.",
                "Điểm kiểm đã ghi tay: dán cài 80–180 °C, tấm đầu xé không ra mới chạy tiếp, ghi nhiệt 3 điểm hằng ngày; mục kiểm in sẵn trên phiếu kéo vải; dao lệch từ 2 mm phải sửa, 2 giờ kiểm dao một lần; lấy mảnh 3 lớp trên, giữa, dưới.",
                "Đã bỏ vì sai: “xẻ viền” 切条, “ba-via”, “144 chiếc”, “dập”, “ép keo”.",
            ],
            "ask": [
                "Tên máy: ảnh 9471, máy dập nút ảnh 9494, máy làm nút đỉnh; máy laser nào cắt mảng rộng, máy nào làm chi tiết.",
                "Chặt xong, bước lấy mảnh ra khỏi vải thừa xưởng gọi là gì.",
                "“150” trong mã TG0M01-150 là gì; vải co giãn xả bao lâu, ai xác nhận cắt được.",
                "品保部 kiểm gì ở xưởng cắt, lấy mẫu bao nhiêu, ghi vào biểu nào.",
            ],
            "pics": [
                "Tem trắng đầu cây chụp gần; biểu ghi nhiệt 3 điểm; thẻ có chữ “贴” (mã TG0M01-150).",
                "Phiếu M-10-44-A-3 cận cảnh (mục kiểm in sẵn, chữ ký); giấy nâu lót khi chặt; sổ kiểm dao.",
                "Một bộ mảnh cắt bày đủ: 6 mảnh thân, 眉面, 眉里, vải bọc nút đỉnh.",
                "Biển tên máy ảnh 9471 và máy dập nút; biểu QC của 品保部; dấu QC trên phiếu.",
            ],
        },
    },
    "others": "Các khâu còn lại (mẫu, thêu, in, giặt, may, ép vành, QC cuối, xuất hàng) chưa có ảnh thực tế; nội dung theo W2, SOP và báo cáo cũ. Khi xuống khâu nào: mở Sơ đồ khâu đó, chụp theo các ô ảnh, hỏi các câu bên dưới, làm bài điền từ của khâu.",
}
