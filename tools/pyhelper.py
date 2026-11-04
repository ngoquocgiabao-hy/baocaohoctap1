# -*- coding: utf-8 -*-
"""Sinh pinyin có dấu cho câu tiếng Trung, ưu tiên cách đọc của thuật ngữ đã đối chiếu."""
import re
from pypinyin import lazy_pinyin, Style, load_phrases_dict

# sửa các chữ đa âm / cách đọc ngành may
FIX = {
    "色差": "sè chā", "偏差": "piān chā", "差多少": "chà duō shao", "差2毫米": "chà 2 háo mǐ",
    "脏污": "zāng wū", "模糊": "mó hu", "车缝": "chē féng", "缝份": "féng fèn", "喇叭": "lǎ ba",
    "箱唛": "xiāng mài", "洗水唛": "xǐ shuǐ mài", "组长": "zǔ zhǎng", "重做": "chóng zuò", "重验": "chóng yàn",
    "调到": "tiáo dào", "调节": "tiáo jié", "量帽围": "liáng mào wéi", "量到": "liáng dào", "量logo": "liáng logo",
    "布卷": "bù juǎn", "整卷": "zhěng juǎn", "薄料": "báo liào", "贴着": "tiē zhe", "还要": "hái yào",
    "车线": "chē xiàn", "车好": "chē hǎo", "车到": "chē dào", "试车": "shì chē", "车大货": "chē dà huò",
    "合片": "hé piàn", "前合片": "qián hé piàn", "合片线": "hé piàn xiàn", "一层一层": "yì céng yì céng",
    "层高": "céng gāo", "一整叠": "yì zhěng dié", "盖章": "gài zhāng", "一张": "yì zhāng", "哪张": "nǎ zhāng",
    "一道": "yí dào", "这一道": "zhè yí dào", "一个": "yí gè", "一样": "yí yàng", "一致": "yí zhì",
    "不一致": "bù yí zhì", "不多不少": "bù duō bù shǎo", "不松": "bù sōng", "不偏": "bù piān",
    "不能": "bù néng", "不断线": "bú duàn xiàn", "不起皱": "bù qǐ zhòu", "不打卷": "bù dǎ juǎn", "不渗胶": "bú shèn jiāo",
    "一次": "yí cì", "一卷": "yì juǎn", "一片": "yí piàn", "一个点": "yí gè diǎn", "一栏": "yì lán",
    "多长": "duō cháng", "大概": "dà gài", "大多": "dà duō", "得": "de", "地方": "dì fang",
    "3处": "3 chù",
    "首件": "shǒu jiàn", "确认样": "què rèn yàng", "纸样": "zhǐ yàng", "刀模": "dāo mó",
    "拉布": "lā bù", "拉好": "lā hǎo", "混在一起拉": "hùn zài yì qǐ lā", "松紧": "sōng jǐn",
    "裁剪": "cái jiǎn", "裁片": "cái piàn", "绑片": "bǎng piàn", "挑片": "tiāo piàn",
    "品保部": "pǐn bǎo bù", "打顶扣": "dǎ dǐng kòu", "顶扣": "dǐng kòu", "后扣": "hòu kòu",
    "帽檐": "mào yán", "帽眉": "mào méi", "眉角": "méi jiǎo", "眉面": "méi miàn", "眉里": "méi lǐ", "眉板": "méi bǎn",
    "转印": "zhuǎn yìn", "印花": "yìn huā", "绣花": "xiù huā", "绣洞": "xiù dòng",
    "含水率": "hán shuǐ lǜ", "缩率": "suō lǜ", "牢度": "láo dù", "幅宽": "fú kuān", "码数": "mǎ shù",
    "四分制": "sì fēn zhì", "扣分": "kòu fēn", "扣20分": "kòu 20 fēn", "扣点等级": "kòu diǎn děng jí",
    "缸号": "gāng hào", "品号": "pǐn hào", "品名": "pǐn míng", "储位": "chǔ wèi",
    "特采": "tè cǎi", "退货": "tuì huò", "领料单": "lǐng liào dān", "补料单": "bǔ liào dān", "补料": "bǔ liào",
    "盘调": "pán tiáo", "减账": "jiǎn zhàng", "点收": "diǎn shōu", "明细": "míng xì",
    "汗渍": "hàn zì", "汗光": "hàn guāng", "色移": "sè yí", "升华": "shēng huá", "泼水": "pō shuǐ",
    "辨色": "biàn sè", "看色": "kàn sè", "灯箱": "dēng xiāng",
    "固化": "gù huà", "油墨": "yóu mò", "打白底": "dǎ bái dǐ", "脱落": "tuō luò", "裂开": "liè kāi",
    "附着力": "fù zhuó lì", "撕拉": "sī lā", "撕不开": "sī bù kāi", "粘力": "nián lì",
    "气压": "qì yā", "压力": "yā lì", "压下去": "yā xià qù", "试压": "shì yā",
    "熨烫": "yùn tàng", "整烫": "zhěng tàng", "弯眉": "wān méi", "弯度": "wān dù", "定型": "dìng xíng",
    "折起来": "zhé qǐ lái", "开班": "kāi bān", "点检": "diǎn jiǎn", "温区": "wēn qū",
    "绕线": "rào xiàn", "束眉": "shù méi", "修眉": "xiū méi", "修线": "xiū xiàn", "线头": "xiàn tóu",
    "帽双": "mào shuāng", "后双": "hòu shuāng", "双针": "shuāng zhēn", "大小边": "dà xiǎo biān",
    "拷克": "kǎo kè", "包边": "bāo biān", "回针": "huí zhēn", "针距": "zhēn jù",
    "牛筋衬": "niú jīn chèn", "牛皮纸": "niú pí zhǐ", "衬布": "chèn bù", "面布": "miàn bù",
    "尺寸带": "chǐ cùn dài", "调节带": "tiáo jié dài", "废带": "fèi dài", "商标": "shāng biāo",
    "汗带": "hàn dài", "外露": "wài lù", "扣具": "kòu jù", "帽围": "mào wéi", "帽型": "mào xíng",
    "头模": "tóu mó", "尾查": "wěi chá", "中查": "zhōng chá", "巡检": "xún jiǎn",
    "抽检": "chōu jiǎn", "抽样": "chōu yàng", "封箱": "fēng xiāng", "装箱": "zhuāng xiāng", "装箱单": "zhuāng xiāng dān",
    "入袋": "rù dài", "吊牌": "diào pái", "验针": "yàn zhēn", "断针": "duàn zhēn", "终检": "zhōng jiǎn",
    "混纺": "hùn fǎng", "尼龙": "ní lóng", "涤纶": "dí lún", "羊毛": "yáng máo",
    "款号": "kuǎn hào", "产地": "chǎn dì", "外箱": "wài xiāng", "大货": "dà huò", "出货": "chū huò",
    "关键工序": "guān jiàn gōng xù", "工号": "gōng hào", "工序": "gōng xù",
    "技术包": "jì shù bāo", "车缝线": "chē féng xiàn", "车缝起皱": "chē féng qǐ zhòu",
    "要垫纸": "yào diàn zhǐ", "垫": "diàn", "叠": "dié", "卷": "juǎn",
    "长时间": "cháng shí jiān", "停机": "tíng jī", "停线": "tíng xiàn", "换款": "huàn kuǎn",
    "外发": "wài fā", "配方": "pèi fāng", "程序": "chéng xù", "一个细节": "yí gè xì jié",
    "越南文": "yuè nán wén", "毫米": "háo mǐ", "厘米": "lí mǐ", "英寸": "yīng cùn", "平方码": "píng fāng mǎ",
    "两小时": "liǎng xiǎo shí", "每两小时": "měi liǎng xiǎo shí", "得分": "dé fēn",
    "颜色": "yán sè", "什么": "shén me", "为什么": "wèi shén me", "怎么": "zěn me", "多少": "duō shao",
    "这台": "zhè tái", "机器": "jī qì", "叫什么": "jiào shén me",
}
load_phrases_dict({k: [[s] for s in v.split()] for k, v in FIX.items() if len(v.split()) == len(k) and re.fullmatch(r"[一-鿿]+", k)})


EXTRA = {"难调": "nán tiáo", "电子": "diàn zǐ", "量帽檐": "liáng mào yán", "一楼": "yī lóu", "第一": "dì yī",
         "贴得": "tiē de", "牢不牢": "láo bu láo", "在不在": "zài bu zài", "转速": "zhuàn sù", "量幅宽": "liáng fú kuān", "量长宽高": "liáng cháng kuān gāo",
         "色差级数": "sè chā jí shù", "中风险": "zhōng fēng xiǎn", "有色差": "yǒu sè chā", "看色差": "kàn sè chā", "外传": "wài chuán", "露线": "lòu xiàn",
         "重来": "chóng lái", "先量": "xiān liáng", "再量": "zài liáng", "的量": "de liáng", "多量": "duō liáng", "继续量": "jì xù liáng", "顶量": "dǐng liáng",
         "数缺陷": "shǔ quē xiàn", "数不良品": "shǔ bù liáng pǐn", "是数": "shì shǔ", "数到": "shǔ dào", "缺陷": "quē xiàn"}
load_phrases_dict({k: [[x] for x in v.split()] for k, v in EXTRA.items()})
PUNCT = {"，": ", ", "。": ". ", "；": "; ", "：": ": ", "、": ", ", "（": " (", "）": ") ", "“": " “", "”": "” ",
         "！": "! ", "？": "? ", "→": " → ", "·": " · ", "×": " × ", "±": " ± ", "＝": " = ", "～": "~"}


TONE4 = set("àèìòùǜ")
TONE_ANY = set("āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ")
def _tone(sy):
    for ch in sy:
        if ch in TONE4: return 4
        if ch in "āēīōūǖ": return 1
        if ch in "áéíóúǘ": return 2
        if ch in "ǎěǐǒǔǚ": return 3
    return 0

def _han_run(run):
    sy = lazy_pinyin(run, style=Style.TONE)
    out = list(sy)
    for i, ch in enumerate(run):
        nxt = sy[i + 1] if i + 1 < len(sy) else ""
        prev = run[i - 1] if i > 0 else ""
        if ch == "不":
            if prev and i + 1 < len(run) and run[i + 1] == prev: out[i] = "bu"
            elif _tone(nxt) == 4: out[i] = "bú"
            else: out[i] = "bù"
        elif ch == "一" and sy[i] in ("yī", "yí", "yì"):
            if prev in ("第",) or run[i:i + 2] in ("一楼",) or not nxt or i + 1 >= len(run): out[i] = "yī"
            elif _tone(nxt) == 4: out[i] = "yí"
            elif _tone(nxt) in (1, 2, 3): out[i] = "yì"
    return out

def to_py(text):
    parts = re.findall(r"[一-鿿]+|[^一-鿿]+", text)
    toks = []
    for p in parts:
        if re.fullmatch(r"[一-鿿]+", p):
            toks += [("py", x) for x in _han_run(p)]
        else:
            s = p
            for k, v in PUNCT.items():
                s = s.replace(k, v)
            toks.append(("raw", s))
    res = ""
    for kind, t in toks:
        if kind == "py":
            res += (" " if res and not res.endswith((" ", "(", "“", "/", "-")) else "") + t
        else:
            if res and not res.endswith(" ") and not t.startswith((" ", ",", ".", ";", ":", ")", "”", "?", "!", "%", "/", "-")):
                res += " "
            res += t
    res = re.sub(r"\s+([,.;:)?!”%])", r"\1", res)
    res = re.sub(r"\(\s+", "(", res)
    res = re.sub(r"“\s+", "“", res)
    res = re.sub(r"\s{2,}", " ", res).strip()
    if res and re.match(r"[一-鿿]", text) :
        res = res[0].upper() + res[1:]
    res = re.sub(r"([.?!] )([a-zāáǎàēéěèīíǐìōóǒòūúǔù])", lambda m: m.group(1) + m.group(2).upper(), res)
    return res
