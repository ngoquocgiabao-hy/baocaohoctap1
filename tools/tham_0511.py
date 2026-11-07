"""Sửa xưởng cắt sau khi chị Thắm hỏi lại (05/11, 13:18): bỏ “xẻ viền”, “ba-via”; 144 bộ; máy dập nút chờ hỏi tên.

Bản này chép lại đúng các thay đổi một phiên khác đã sửa thẳng trên trang (bản 1793859482-4dce), để build từ repo không làm mất chúng.
apply(DATA) chạy ngay trước khi ghi DATA ra trang.
"""


def apply(obj):
    cat = [x for x in obj['stages'] if x['id'] == 'cat'][0]
    S = {x.get('key'): x for x in cat['steps']}
    TODAY = '2026-11-05'

    # ---------- khâu: luồng, người ----------
    cat['what'] = 'Lĩnh vải theo phiếu lĩnh liệu → xả vải (vải co giãn) → phiếu sơ đồ, phiếu lưu ý gia công → dán lót → kéo vải → chặt → gia công tùy mã (laser, máy dập nút: tên còn phải hỏi) → chọn, buộc 144 bộ/bó → sang thêu, in, may.'
    cat['whatz'] = '凭领料单领料 → 松布（弹性布）→ 编排辅助单据、加工提示单 → 贴合 → 拉布 → 刀模裁剪 → 看款加工（镭射、打扣机，名称待确认）→ 挑片、绑片，每包144套 → 送绣花、印花、车缝。'
    cat['whatpy'] = 'Píng lǐng liào dān lǐng liào → sōng bù (tán xìng bù) → biān pái fǔ zhù dān jù, jiā gōng tí shì dān → tiē hé → lā bù → dāo mó cái jiǎn → kàn kuǎn jiā gōng (léi shè, dǎ kòu jī, míng chēng dài què rèn) → tiāo piàn, bǎng piàn, měi bāo 144 tào → sòng xiù huā, yìn huā, chē féng.'
    cat['whaten'] = 'Issue by requisition → relaxing (stretch fabric) → marker and hint sheets → fusing → spreading → die cutting → extra processing by style (laser, button machine: names still to ask) → sorting and bundling 144 sets → to embroidery, printing, sewing.'
    cat['who'] = 'Xưởng trưởng 林玉平 (Lín Yùpíng). Hỏi 林玉平 hoặc anh Quang Anh, giới thiệu: mới vào 品保部, chị Thắm cho xuống học. QC của 品保部 kiểm thêm'
    cat['whoz'] = '林玉平；品保部QC'
    cat['whopy'] = 'Lín Yùpíng; pǐn bǎo bù QC'
    cat['whoen'] = 'Workshop head 林玉平 (Lín Yùpíng); ask him or Quang Anh. 品保部 QC checks in addition'

    # ---------- ⑥ Chặt: 144 bộ, “chặt” thay “dập” ----------
    x = S[5]
    x['d'] = x['d'].replace('Máy dập thủy lực Chenfeng; dập xong gỡ mảnh khỏi phần vải thừa, đếm, bó (VD 144 chiếc/bó) kèm thẻ có QR.',
                            'Máy chặt thủy lực Chenfeng; chặt xong lấy mảnh ra khỏi phần vải thừa, rồi chọn mảnh, buộc 144 bộ/bó (bước ⑫). Bước lấy mảnh ra xưởng gọi là gì: còn phải hỏi (báo cáo cũ ghi “bỏ ba-via”, chị Thắm không hiểu, đã bỏ).')
    x['dz'] = x['dz'].replace('冲好以后把裁片从余料里拿出来，点数，绑包（例如每包144片），挂有二维码的卡。',
                              '裁好以后把裁片从余料里拿出来，再挑片、绑片，每包144套（第⑫步）。拿裁片这一步厂里叫什么，还要问。')
    x['dpy'] = x['dpy'].replace('Yòng Chenfeng yè yā chōng chuáng; chōng hǎo yǐ hòu bǎ cái piàn cóng yú liào lǐ ná chū lái, diǎn shù, bǎng bāo (lì rú měi bāo 144 piàn), guà yǒu èr wéi mǎ de kǎ.',
                                'Yòng Chenfeng yè yā chōng chuáng; cái hǎo yǐ hòu bǎ cái piàn cóng yú liào lǐ ná chū lái, zài tiāo piàn, bǎng piàn, měi bāo 144 tào (dì ⑫ bù). Ná cái piàn zhè yí bù chǎng lǐ jiào shén me, hái yào wèn.')
    x['den'] = x['den'].replace('after cutting, pieces are freed from the waste, counted and bundled (e.g. 144 per bundle) with a QR card.',
                                'after cutting, pieces are taken out of the waste, then sorted and bundled 144 sets per bundle (step ⑫). What the factory calls the take-out step: still to ask.')
    assert '144 chiếc' not in x['d'] and '144片' not in x['dz'], 'step 6 not replaced'
    x['pics'].append('Mảnh vừa chặt và phần vải thừa còn lại trên bàn')
    x['qs'].append(['Chặt xong lấy mảnh ra khỏi phần vải thừa: bước này xưởng gọi là gì?',
                    '裁好以后把裁片从余料里拿出来，这一步叫什么？',
                    'Cái hǎo yǐ hòu bǎ cái piàn cóng yú liào lǐ ná chū lái, zhè yí bù jiào shén me?'])

    # ---------- ⑦ bỏ “xẻ dải viền” ----------
    x = S['xv']
    x.update({
        't': '⑦ Máy ở ảnh 9471 (chưa rõ, đã bỏ “xẻ viền”)',
        'tz': '待确认',
        'tpy': 'Dài què rèn',
        'd': '05/11 chị Thắm xác nhận: xưởng cắt không có công đoạn xẻ cuộn vải thành dây viền. Báo cáo cũ (AI viết từ ảnh) gọi máy ở ảnh 9471 là “máy xẻ dải viền”: sai, đã bỏ khỏi quy trình và báo cáo. Máy này làm gì, dây viền 包边 lấy từ đâu: hỏi 林玉平 hoặc anh Quang Anh.',
        'dz': '11月5日阿深姐确认：裁剪没有把布卷切成包边条这道工序。照片9471这台机器是做什么的，还要问。',
        'dpy': '11 yuè 5 rì Ā Shēn jiě què rèn: cái jiǎn méi yǒu bǎ bù juǎn qiē chéng bāo biān tiáo zhè dào gōng xù. Zhào piàn 9471 zhè tái jī qì shì zuò shén me de, hái yào wèn.',
        'ten': '⑦ Machine in photo 9471 (unknown; “binding strips” removed)',
        'den': '05/11 chị Thắm confirmed the cutting room has no step that slits rolls into binding strips. The old AI-written report called the machine in photo 9471 a strip slitter: wrong, removed. What it does and where binding tape comes from: ask 林玉平 or Quang Anh.',
        'chk': [],
        'w': ['包边'],
        'pics': ['Máy ở ảnh 9471 (chưa rõ tên, không phải máy xẻ viền)', 'Biển tên hoặc bảng SOP dán trên máy ảnh 9471'],
        'qs': [
            ['Máy ở ảnh 9471 là máy gì, làm công đoạn nào?', '照片9471这台是什么机器？做哪道工序？', 'Zhào piàn 9471 zhè tái shì shén me jī qì? Zuò nǎ dào gōng xù?'],
            ['Dây viền (包边) xưởng mình lấy từ đâu: kho phát sẵn hay bộ phận nào làm?', '包边是从哪里来的？仓库发的，还是哪个部门做的？', 'Bāo biān shì cóng nǎ lǐ lái de? Cāng kù fā de, hái shì nǎ ge bù mén zuò de?'],
        ],
        'new': TODAY,
    })

    # ---------- ⑧ laser: bỏ “ba-via” ----------
    x = S['ls']
    x['d'] = x['d'].replace('thu thành phẩm, bỏ ba-via.', 'thu mảnh đã cắt (chữ Trung bước cuối đọc lại trên ảnh SOP 9483; không dùng từ “ba-via”).')
    x['dz'] = x['dz'].replace('收成品，去毛边。', '收成品（最后一步原文再看SOP照片9483）。')
    x['dpy'] = x['dpy'].replace('shōu chéng pǐn, qù máo biān.', 'shōu chéng pǐn (zuì hòu yí bù yuán wén zài kàn SOP zhào piàn 9483).')
    x['den'] = x['den'].replace('collect pieces and remove burrs.', 'collect the pieces (re-read the last step on SOP photo 9483).')
    x['qs'].append(['Laser xong, thu mảnh rồi còn phải làm gì thêm trước khi buộc bó?', '镭射切好以后，收裁片还要做什么，才能绑包？', 'Léi shè qiē hǎo yǐ hòu, shōu cái piàn hái yào zuò shén me, cái néng bǎng bāo?'])

    # ---------- ⑨ máy dập nút: tên chờ hỏi ----------
    x = S['dk']
    x['t'] = '⑨ Máy dập nút (tên chờ hỏi)'
    x['d'] = '05/11: tên công đoạn và tên máy chưa xác nhận, chưa dùng trong báo cáo gửi sếp. Đóng nút đỉnh 打顶扣 lên mũ là ở chuyền may. ' + x['d']
    x['dz'] = '11月5日：工序和机器的名称还没确认。' + x['dz']
    x['dpy'] = '11 yuè 5 rì: gōng xù hé jī qì de míng chēng hái méi què rèn. ' + x['dpy']
    x['den'] = '05/11: operation and machine names not yet confirmed. ' + x['den']
    x['pics'].append('Biển tên máy hoặc SOP dán trên máy dập nút')

    # ---------- ⑬ 品保部 ----------
    x = S[9]
    x['pics'] = ['Biểu QC của 品保部 dùng ở xưởng cắt (nếu có)', 'Dấu QC trên phiếu sơ đồ cắt']
    x['qs'].append(['Mảnh cắt trước khi sang thêu, in, may: 品保部 kiểm những điểm nào?', '裁片送去绣花、印花、车缝之前，品保部要查哪些地方？', 'Cái piàn sòng qù xiù huā, yìn huā, chē féng zhī qián, pǐn bǎo bù yào chá nǎ xiē dì fāng?'])
    x['new'] = TODAY

    # ---------- mô phỏng: bỏ xẻ viền ----------
    for b in obj['sim']['beats']:
        if b['id'] == 'phutro':
            b['t'] = ['Gia công tùy mã: laser, máy dập nút (tên chờ hỏi)', '看款加工：镭射、打扣机（名称待确认）', 'Extra processing by style: laser, button machine (names to confirm)']
            b['d'] = ['Ảnh 05/11: máy laser bàn lớn (màn hình Ogbos) và máy khắc CKLASER (打标机) đục lỗ thoáng, cắt họa tiết (mã UA, AGRON), có mã in kỹ thuật số trước rồi mới laser; dãy máy dập tự động làm nút. Chị Thắm 05/11: xưởng cắt không có công đoạn xẻ cuộn vải thành dây viền.',
                      '照片：用大台面镭射机（Ogbos屏幕）和创可激光打标机打透气孔、切花样（UA、AGRON的款），有的款先数码印花再镭射；还有一排自动打扣机。阿深姐说：裁剪没有切包边条的工序。',
                      'Photos 05/11: a large-bed laser (Ogbos screen) and a CKLASER marking laser punch vent holes and cut patterns (UA, AGRON), some after digital printing; a row of automatic button machines. 05/11: no binding-strip slitting in the cutting room.']
            b['w'] = [w for w in b['w'] if w != '切条']
            b['tpy'] = 'Kàn kuǎn jiā gōng: léi shè, dǎ kòu jī (míng chēng dài què rèn)'
            b['dpy'] = 'Zhào piàn: yòng dà tái miàn léi shè jī (Ogbos píng mù) hé chuàng kě jī guāng dǎ biāo jī dǎ tòu qì kǒng, qiē huā yàng (UA, AGRON de kuǎn), yǒu de kuǎn xiān shù mǎ yìn huā zài léi shè; hái yǒu yì pái zì dòng dǎ kòu jī. Ā Shēn jiě shuō: cái jiǎn méi yǒu qiē bāo biān tiáo de gōng xù.'
            b['note'] = 'Tên máy dập nút và máy ở ảnh 9471 còn phải hỏi 林玉平 hoặc anh Quang Anh.'

    # ---------- từ ----------
    for t in obj['terms']:
        if t['zh'] == '切条':
            t['vn'] = 'SAI: xưởng cắt không có công đoạn xẻ cuộn vải thành dây viền'
            t['note'] = 'Chị Thắm 05/11. Không dùng từ này.'
        if t['zh'] == '打扣':
            t['note'] = 'Từ trong báo cáo 05/11, chưa xác nhận. Máy ở ảnh 9494 là máy gì: hỏi 林玉平 hoặc anh Quang Anh.'

    obj['wrong'] += [
        {'bad': 'bỏ ba-via', 'good': '挑片', 'py': 'tiāopiàn', 'vn': 'chọn mảnh (kiểm từng mảnh, loại mảnh lỗi), rồi 绑片 buộc mảnh', 'src': 'SOP M-10-72; chị Thắm không hiểu “ba-via” (05/11)'},
        {'bad': 'xẻ viền / 切条', 'good': '(xưởng cắt không có)', 'py': '', 'vn': 'bỏ khỏi quy trình; máy ở ảnh 9471 hỏi lại', 'src': 'Chị Thắm 05/11'},
        {'bad': '收料 (xưởng cắt nhận vải)', 'good': '领料', 'py': 'lǐngliào', 'vn': 'lĩnh vải theo phiếu lĩnh liệu (收料 là từ của kho)', 'src': 'Báo cáo kho 03/11'},
        {'bad': '144 chiếc/bó', 'good': '每包144套', 'py': 'měi bāo 144 tào', 'vn': '144 bộ/bó (đủ mảnh cho 144 chiếc mũ)', 'src': 'SOP M-10-72'},
        {'bad': 'dập (máy thủy lực), khuôn dao', 'good': '刀模裁剪', 'py': 'dāomó cáijiǎn', 'vn': 'chặt bằng dao chặt, máy chặt (ở xưởng “dập máy” là nói về in)', 'src': 'W7'},
        {'bad': 'ép keo, ép mếch Buckram/Foam', 'good': '贴合', 'py': 'tiēhé', 'vn': 'dán vải chính với lót có keo trên máy dán', 'src': 'SOP M-10-71'},
    ]
    obj['pending'] += [
        {'term': 'máy ở ảnh 9471', 'vn': 'chưa rõ', 'note': 'Không phải máy xẻ viền (chị Thắm 05/11). Hỏi 林玉平 hoặc anh Quang Anh.'},
        {'term': '打扣', 'vn': 'máy dập nút ở xưởng cắt (ảnh 9494)', 'note': 'Tên công đoạn và máy chưa xác nhận.'},
        {'term': 'bước lấy mảnh ra khỏi vải thừa', 'vn': 'sau khi chặt', 'note': 'Xưởng gọi là gì: hỏi. Không dùng “ba-via”.'},
    ]
