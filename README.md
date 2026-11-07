# Báo cáo học tập · Nhà máy mũ Weili

| File | Nội dung |
|---|---|
| `ban-do-chat-luong-noi-bo.html` | Báo cáo ngày đầu ở phòng Chất lượng: hành trình chiếc mũ, hành trình mẫu, các mô hình kiểm hàng |
| `weili-hoc-tap.html` | Học quy trình và từ xưởng: **xưởng 3D mô phỏng** (bấm khâu nào ra chi tiết Việt / 中文 pinyin / English, cận cảnh có tên từng máy, tham quan có lời giới thiệu, mũ 6 mảnh 3D, hướng dẫn nhà máy), **mô phỏng sản xuất 36 bước** (máy chạy, người đứng máy, mũ ráp dần, bảng số đo chạy: 4 điểm, AQL, 15 điểm QC, độ ẩm…), **phòng kiểm nghiệm ảo** (10 công cụ tính), sơ đồ 11 khâu từ mẫu đến xuất hàng, 278 từ (Việt, 中文, pinyin, cách kiểm tra, ảnh cần chụp, câu cần hỏi), từ vựng, thẻ học lặp lại ngắt quãng, trắc nghiệm, cách học |
| `data/weili-data.json` | Toàn bộ dữ liệu của trang trên, dùng lại cho game nhà máy |
| `img/` | Ảnh thực tế cho từng bước (tạo khi có ảnh đầu tiên) |
| `tools/` | Mã dựng lại trang và file dữ liệu |

## Dùng `weili-hoc-tap.html`

**Học hằng ngày nên mở bản trên Claude:** https://claude.ai/artifact/2GAWz8bbKBbSm7Nzmw78kE . Bản này lưu tiến độ (từ đã học, câu trả lời, lịch ôn) vào tài khoản Claude, đổi điện thoại vẫn còn; nó dùng chung chỗ lưu với bản “Thẻ từ xưởng” cũ nên từ đã học trước đó vẫn giữ.

Mở file trực tiếp bằng trình duyệt thì tiến độ chỉ lưu trên trình duyệt đó (đổi máy thì vào **Thẻ học → Sao lưu tiến độ** để chép mã sang). Mở trong khung xem trước của ứng dụng thì không lưu được; nút trạng thái ở đầu trang báo rõ: “☁ Đã lưu”, “Lưu trên máy này” hoặc “⚠ Không lưu”.

Các tab: **Xưởng 3D** (cần mạng để tải three.js r128 từ cdnjs/jsdelivr; bố trí theo thứ tự quy trình, chưa phải mặt bằng thật; nút **🏭 Mô phỏng sản xuất** chạy 36 bước từ họp PPM đến xuất hàng, có ⏮ ◀ ⏯ ▶, tốc độ ½× 1× 2×, đọc 中文; dưới xưởng là **Phòng kiểm nghiệm ảo**: kiểm vải 4 điểm, AQL 1.5 mức I của UA, độ ẩm theo thành phần vải, dung sai đo UA, phiếu 15 điểm, mũi/inch so thẻ SOP, bó 144, dao chặt, logo lệch VF, nhiệt cài/nhiệt máy) · **Sơ đồ** (bật/tắt Pinyin, Tiếng Việt, 中文) · **Từ vựng** (lọc theo khâu, loại từ, từ hay nhầm) · **Thẻ học** (đọc, nghe, nói; mặt trước chỉ có chữ Hán, lật mới thấy pinyin; **Sổ ghi nhớ từ** chia Chưa học / Đang học / Đã học / Đã thuộc, có lọc “Mới thêm”, chép sổ từ để gửi trợ lý AI) · **Trắc nghiệm** (từ sai tự vào thẻ học) · **Cần hỏi** (gom mọi câu hỏi và ảnh cần chụp, đánh dấu đã hỏi, chép câu trả lời) · **Cách học**.

Mỗi bước trong sơ đồ có hai ô:

- **Ảnh thực tế**: bấm “Thêm ảnh” để gắn ảnh chụp ở xưởng. Mở bản trên Claude thì ảnh lưu vào tài khoản (assets + db `photos/<id ô ảnh>`) và hiện trên bảng ảnh của khâu trong xưởng 3D; mở bằng file thì ảnh chỉ lưu trong trình duyệt đang dùng. Muốn ảnh hiện cho mọi người thì đặt file vào `img/` theo tên ghi dưới ô ảnh: `img/<id khâu>-<mã bước>-<số ảnh>.jpg`, ví dụ `img/kiemvai-1-1.jpg`, `img/cat-ls-2.jpg` (bước thêm sau có mã chữ: `p`, `xv`, `ls`, `dk`).
- **Cần hỏi**: câu hỏi Việt, 中文, pinyin (bấm 🔊 để nghe). Hỏi xong tích “Đã hỏi”, ghi câu trả lời; vào tab Cần hỏi bấm “Chép tất cả câu trả lời” rồi dán cho trợ lý AI để cập nhật quy trình.
- **Điền từ (选词填空)**: câu tiếng Trung về quy trình từng khâu, để trống từ trọng tâm (chỉ từ đã đối chiếu); bấm ô trống rồi chọn từ, bấm Kiểm tra. Có ở bảng khâu trong Xưởng 3D, đầu mỗi khâu trong Sơ đồ và đầu tab Thẻ học (chọn khâu). Kho, kiểm vải, xưởng cắt viết kỹ; khâu khác theo quy trình tổng. Kết quả lưu cùng tiến độ (`clz`).
- **Rà soát toàn bộ quy trình** (đầu tab Cần hỏi): bảng số bước, câu đã hỏi, ảnh có/thiếu, từ chưa xác nhận, bài điền từ của từng khâu; với Kho, Kiểm vải, Cắt có thêm “Đã chắc”, “Cần làm rõ trước”, “Ảnh cần chụp trước”. Lọc “Ảnh còn thiếu” chỉ hiện ô chưa có ảnh.

Repo này công khai: không đưa ảnh SOP có dấu 机密, ảnh có mặt công nhân, hay số liệu khách chưa cho phép vào `img/`. 32 ảnh xưởng cắt 05/11 và 24 ảnh kho, kiểm vải 07/11 (đã làm mờ mặt) chỉ lưu trong tài khoản Claude của bản trên Claude, không có trong repo; bảng ô ảnh → tên ảnh ở `PHOTOS` trong `tools/cut_0511.py`.

## Quy tắc từ ngữ (theo W7 trên Drive)

Chỉ dùng từ đã đối chiếu, theo thứ tự: từ nghe ở xưởng → chữ trên biểu mẫu, SOP → bảng W6 → báo cáo đã nộp. Từ có `ok: false` là từ chưa đối chiếu, không dùng khi viết gửi sếp. Phòng của mình là **品保部**.

## Cấu trúc `data/weili-data.json` (cho game)

```text
meta      { title, updated, sources, note }
stages[]  11 khâu theo thứ tự đi của chiếc mũ, n = 0..10; en / whaten / whoen là tiếng Anh
          (mau, kho, kiemvai, cat, theu, in, giat, may, dinhform, qc, xuat)
          id, n, vn, zh, py, short, color, qb (品保部 có kiểm ở khâu này)
          what / whatz / whatpy   một dòng tóm tắt (Việt / 中文 / pinyin)
          who / whoz / whopy      ai kiểm
          steps[]  t / tz / tpy   tên bước
                   d / dz / dpy   mô tả
                   ten / den      tên bước, mô tả tiếng Anh
                   chk[]          cách kiểm tra: [Việt, 中文, pinyin, English]
                   w[]            các từ (khóa trong terms)
                   pics[]         ảnh cần chụp (chú thích); file ảnh là img/<id>-<bước>-<ảnh>.jpg
                   qs[]           câu cần hỏi: [Việt, 中文, pinyin]
                   hot            bước sếp vừa nhắc
terms[]   zh, py, vn, note, src, ok, st (id khâu), cat (loại từ), hot (từ hay nhầm), add (ngày bổ sung, rỗng nếu có từ đầu), en (tiếng Anh; từ có trong W6 lấy đúng cột English của W6),
          ex { zh, py, vn }  câu ví dụ lấy từ quy trình (có thể null)
cats[]    8 loại từ: id, vn, zh
wrong[]   từ đã dùng sai → đúng: bad, good, py, vn, src
pending[] từ chờ xác nhận: term, vn, note
qa[]      ba câu hỏi ở xưởng cắt (拉布, 贴合, 顶扣)
sim       mô phỏng sản xuất
          beats[]  id, sid (khâu), fx (hoạt cảnh 3D), dur (giây)
                   t / d   tên, làm gì: [Việt, 中文, English]; tpy / dpy pinyin
                   chk[]   kiểm gì: [Việt, 中文, English, pinyin]
                   hud[]   số trên màn hình: [Việt, 中文, English, giá trị]; "@khóa" = số chạy do hoạt cảnh tính
                   w[] từ liên quan · lab công cụ liên quan · q câu còn phải hỏi [Việt, 中文, pinyin] · note
          points[] 15 điểm QC: zh, py, vn, en, fvn / fzh / fen (tìm lỗi gì)
          ops[]    thẻ SOP may: no, vn, zh, py, spi (mũi/inch), note
          aql[]    bảng AQL 1.5 mức I của CFA UA: [từ, đến, mẫu, đạt ≤, trượt ≥]
          lab{}    chữ của phòng kiểm nghiệm ảo: khóa → [Việt, 中文, English, pinyin]
```

## Dựng lại

```bash
pip install pypinyin
python3 tools/build_all.py      # ghi ra weili-hoc-tap.html và data/weili-data.json
```

Sửa từ trong `tools/data_terms.py` (thuật ngữ), `tools/data.py` (quy trình, cách kiểm tra), `tools/overlay.py` (khâu 0 Mẫu & PPM, kiểm vải 4 điểm và xếp cấp A/B/C, ảnh cần chụp, câu cần hỏi; chạy sau data.py), `tools/vocab_more.py` (111 từ bổ sung 03/11 từ W6, W2, báo cáo kho; mỗi dòng ghi khâu, bước, loại từ, câu ví dụ), `tools/vocab_extra.py` (loại từ, từ sai → đúng, từ chờ xác nhận), `tools/review_0411.py` (soát lại 04/11 với Drive: chỗ hai nguồn lệch nhau ghi cả hai và thêm câu hỏi), `tools/tham_0511.py` (sửa xưởng cắt sau khi chị Thắm hỏi 05/11: bỏ “xẻ viền”, “ba-via”; chạy cuối cùng), `tools/kho_0711.py` (kho và kiểm vải theo 14 ảnh kho 07/11: lưu đồ trên tường, bảng tem trạng thái, biển kệ, phòng kiểm nghiệm; từ đọc được trên ảnh và từ ghi tay ở xưởng cắt), `tools/cloze.py` (bài điền từ: `[[từ]]` là chỗ trống, chỉ dùng từ đã đối chiếu), `tools/review_0711.py` (rà soát quy trình 07/11 ở tab Cần hỏi), `tools/cut_0511.py` (xưởng cắt 05/11: 13 bước theo báo cáo và ảnh, mỗi bước có `key` cố định để mã ảnh, mã câu hỏi cũ không lệch; từ thấy trên phiếu, máy để ok=true), `tools/en.py` (tiếng Anh cho khâu, bước, cách kiểm, 267 từ), `tools/guide.py` (hướng dẫn nhà máy); `tools/sim.py` (kịch bản mô phỏng 36 bước, 15 điểm QC, thẻ SOP, bảng AQL, chữ phòng kiểm nghiệm ảo); giao diện trong `tools/template_all.html`, xưởng 3D trong `tools/world3d.js` và `tools/world3d.css`, hoạt cảnh sản xuất trong `tools/world3d_sim.js`, phòng kiểm nghiệm ảo trong `tools/lab.js`; mô hình mũ 6 mảnh là `tools/cap_6manh.html` (nhúng vào trang).

Ảnh SOP của xưởng là tài liệu mật nên không đưa vào repo này.

## Kiểm vải theo thang 4 điểm (四分制)

Mỗi lỗi trừ điểm theo chiều dài: đến 3 inch trừ 1, 3–6 inch trừ 2, 6–9 inch trừ 3, trên 9 inch trừ 4. Lỗ thủng tính mấy điểm, một yard có tối đa 4 điểm không: còn phải hỏi ở xưởng. Điểm trên 100 yd² = tổng điểm × 3600 ÷ (số yard kiểm × khổ vải inch). Cấp A ≤ 29, B ≤ 47, C ≤ 62 (ngưỡng theo bảng thuật ngữ W6; hỏi tổ kiểm nghiệm xem khách nào dùng ngưỡng khác).
