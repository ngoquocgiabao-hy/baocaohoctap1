# Báo cáo học tập · Nhà máy mũ Weili

| File | Nội dung |
|---|---|
| `ban-do-chat-luong-noi-bo.html` | Báo cáo ngày đầu ở phòng Chất lượng: hành trình chiếc mũ, hành trình mẫu, các mô hình kiểm hàng |
| `weili-hoc-tap.html` | Học quy trình và từ xưởng: sơ đồ 10 khâu (Việt, 中文, pinyin, cách kiểm tra), từ vựng, thẻ học lặp lại ngắt quãng, trắc nghiệm, cách học |
| `data/weili-data.json` | Toàn bộ dữ liệu của trang trên, dùng lại cho game nhà máy |
| `tools/` | Mã dựng lại trang và file dữ liệu |

## Dùng `weili-hoc-tap.html`

Mở file bằng trình duyệt (điện thoại hay máy tính đều được). Tiến độ thẻ học lưu trong trình duyệt đang dùng; đổi máy thì vào **Thẻ học → Sao lưu tiến độ** để chép mã sang.

Các tab: **Sơ đồ** (bật/tắt Pinyin, Tiếng Việt, 中文) · **Từ vựng** (lọc theo khâu, loại từ, từ hay nhầm) · **Thẻ học** (đọc, nghe, nói; mặt trước chỉ có chữ Hán, lật mới thấy pinyin) · **Trắc nghiệm** (từ sai tự vào thẻ học) · **Cách học**.

## Quy tắc từ ngữ (theo W7 trên Drive)

Chỉ dùng từ đã đối chiếu, theo thứ tự: từ nghe ở xưởng → chữ trên biểu mẫu, SOP → bảng W6 → báo cáo đã nộp. Từ có `ok: false` là từ chưa đối chiếu, không dùng khi viết gửi sếp. Phòng của mình là **品保部**.

## Cấu trúc `data/weili-data.json` (cho game)

```text
meta      { title, updated, sources, note }
stages[]  10 khâu theo thứ tự đi của chiếc mũ
          id, n, vn, zh, py, short, color, qb (品保部 có kiểm ở khâu này)
          what / whatz / whatpy   một dòng tóm tắt (Việt / 中文 / pinyin)
          who / whoz / whopy      ai kiểm
          steps[]  t / tz / tpy   tên bước
                   d / dz / dpy   mô tả
                   chk[]          cách kiểm tra: [Việt, 中文, pinyin]
                   w[]            các từ (khóa trong terms)
                   ask            câu hỏi mẫu [中文, pinyin, Việt] hoặc null
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

Sửa từ trong `tools/data_terms.py` (thuật ngữ), `tools/data.py` (quy trình, cách kiểm tra), `tools/vocab_extra.py` (loại từ, từ sai → đúng, từ chờ xác nhận); giao diện trong `tools/template_all.html`.

Ảnh SOP của xưởng là tài liệu mật nên không đưa vào repo này.
