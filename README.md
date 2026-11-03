# Báo cáo học tập · Nhà máy mũ Weili

| File | Nội dung |
|---|---|
| `ban-do-chat-luong-noi-bo.html` | Báo cáo ngày đầu ở phòng Chất lượng: hành trình chiếc mũ, hành trình mẫu, các mô hình kiểm hàng |
| `weili-hoc-tap.html` | Học quy trình và từ xưởng: sơ đồ 11 khâu từ mẫu đến xuất hàng (Việt, 中文, pinyin, cách kiểm tra, ảnh cần chụp, câu cần hỏi), từ vựng, thẻ học lặp lại ngắt quãng, trắc nghiệm, cách học |
| `data/weili-data.json` | Toàn bộ dữ liệu của trang trên, dùng lại cho game nhà máy |
| `img/` | Ảnh thực tế cho từng bước (tạo khi có ảnh đầu tiên) |
| `tools/` | Mã dựng lại trang và file dữ liệu |

## Dùng `weili-hoc-tap.html`

Mở file bằng trình duyệt (điện thoại hay máy tính đều được). Tiến độ thẻ học lưu trong trình duyệt đang dùng; đổi máy thì vào **Thẻ học → Sao lưu tiến độ** để chép mã sang.

Các tab: **Sơ đồ** (bật/tắt Pinyin, Tiếng Việt, 中文) · **Từ vựng** (lọc theo khâu, loại từ, từ hay nhầm) · **Thẻ học** (đọc, nghe, nói; mặt trước chỉ có chữ Hán, lật mới thấy pinyin) · **Trắc nghiệm** (từ sai tự vào thẻ học) · **Cần hỏi** (gom mọi câu hỏi và ảnh cần chụp, đánh dấu đã hỏi, chép câu trả lời) · **Cách học**.

Mỗi bước trong sơ đồ có hai ô:

- **Ảnh thực tế**: bấm “Thêm ảnh” để gắn ảnh chụp ở xưởng. Ảnh này chỉ lưu trong trình duyệt đang dùng. Muốn ảnh hiện cho mọi người thì đặt file vào `img/` theo tên ghi dưới ô ảnh: `img/<id khâu>-<số bước>-<số ảnh>.jpg`, ví dụ `img/kiemvai-1-1.jpg`.
- **Cần hỏi**: câu hỏi Việt, 中文, pinyin (bấm 🔊 để nghe). Hỏi xong tích “Đã hỏi”, ghi câu trả lời; vào tab Cần hỏi bấm “Chép tất cả câu trả lời” rồi dán cho trợ lý AI để cập nhật quy trình.

Repo này công khai: không đưa ảnh SOP có dấu 机密, ảnh có mặt công nhân, hay số liệu khách chưa cho phép vào `img/`.

## Quy tắc từ ngữ (theo W7 trên Drive)

Chỉ dùng từ đã đối chiếu, theo thứ tự: từ nghe ở xưởng → chữ trên biểu mẫu, SOP → bảng W6 → báo cáo đã nộp. Từ có `ok: false` là từ chưa đối chiếu, không dùng khi viết gửi sếp. Phòng của mình là **品保部**.

## Cấu trúc `data/weili-data.json` (cho game)

```text
meta      { title, updated, sources, note }
stages[]  11 khâu theo thứ tự đi của chiếc mũ, n = 0..10
          (mau, kho, kiemvai, cat, theu, in, giat, may, dinhform, qc, xuat)
          id, n, vn, zh, py, short, color, qb (品保部 có kiểm ở khâu này)
          what / whatz / whatpy   một dòng tóm tắt (Việt / 中文 / pinyin)
          who / whoz / whopy      ai kiểm
          steps[]  t / tz / tpy   tên bước
                   d / dz / dpy   mô tả
                   chk[]          cách kiểm tra: [Việt, 中文, pinyin]
                   w[]            các từ (khóa trong terms)
                   pics[]         ảnh cần chụp (chú thích); file ảnh là img/<id>-<bước>-<ảnh>.jpg
                   qs[]           câu cần hỏi: [Việt, 中文, pinyin]
                   hot            bước sếp vừa nhắc
terms[]   zh, py, vn, note, src, ok, st (id khâu), cat (loại từ), hot (từ hay nhầm),
          ex { zh, py, vn }  câu ví dụ lấy từ quy trình (có thể null)
cats[]    8 loại từ: id, vn, zh
wrong[]   từ đã dùng sai → đúng: bad, good, py, vn, src
pending[] từ chờ xác nhận: term, vn, note
qa[]      ba câu hỏi ở xưởng cắt (拉布, 贴合, 顶扣)
```

## Dựng lại

```bash
pip install pypinyin
python3 tools/build_all.py      # ghi ra weili-hoc-tap.html và data/weili-data.json
```

Sửa từ trong `tools/data_terms.py` (thuật ngữ), `tools/data.py` (quy trình, cách kiểm tra), `tools/overlay.py` (khâu 0 Mẫu & PPM, kiểm vải 4 điểm và xếp cấp A/B/C, ảnh cần chụp, câu cần hỏi; chạy sau data.py), `tools/vocab_extra.py` (loại từ, từ sai → đúng, từ chờ xác nhận); giao diện trong `tools/template_all.html`.

Ảnh SOP của xưởng là tài liệu mật nên không đưa vào repo này.

## Kiểm vải theo thang 4 điểm (四分制)

Mỗi lỗi trừ điểm theo chiều dài: đến 3 inch trừ 1, 3–6 inch trừ 2, 6–9 inch trừ 3, trên 9 inch hoặc lỗ thủng trừ 4; một yard tối đa 4 điểm. Điểm trên 100 yd² = tổng điểm × 3600 ÷ (số yard kiểm × khổ vải inch). Cấp A ≤ 29, B ≤ 47, C ≤ 62 (ngưỡng theo bảng thuật ngữ W6; hỏi tổ kiểm nghiệm xem khách nào dùng ngưỡng khác).
