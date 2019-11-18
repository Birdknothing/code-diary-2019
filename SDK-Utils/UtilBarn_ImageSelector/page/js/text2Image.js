var Text2Image = {
    /**
     * 文件选择容器
     */
    FileSelectContainer: null,

    /**
     * 裁剪器
     */
    Cropper: null,

    /**
     * 图片目标容器（用来显示最终绘制出来的图片）
     */
    ImageContainerTarget: null,

    /**
     * 默认裁剪区域比率
     */
    DefaultAspectRatio: 1,

    /**
     * 裁剪区域比率
     */
    AspectRatio: 1,

    /**
     * 支持的图片格式
     */
    Formats: [
        "png",
        "jpg",
        "jpeg"
    ],

    /**
     * 隐藏父div方法
     */
    HideParentFunction: null,

    /**
     * 显示父div方法
     */
    ShowParentFunction: null,

    /**
     * 图片后缀
     */
    ImageExtend: "",

    /**
     * 图片文件名
     */
    ImageFileName: "",

    /**
     * 图片方向
     */
    ImageOrientation: 1,

    /**
     * 默认大小
     */
    DefaultScale: 1,

    /**
     * 默认文本框高度
     */
    DefaultTextareaHeight: 0,

    /**
     * 文本画布显示文字
     */
    TextCanvasText: "",

    /**
     * 是否透明度滑动条滑动
     */
    AlphaSlidering: false,

    /**
     * 图片画布url
     */
    ImgCanvasUrl: "",

    /**
     * 图片画布的rbg值
     */
    ImgCanvasRgb: "rgb(255, 255, 255)",

    /**
     * 图片画布透明度
     */
    ImgCanvasAlpha: 1,

    /**
     * 图片画布宽度
     */
    TextCanvasWidth: 300,

    /**
     * 图片画布高度
     */
    TextCanvasHeight: 150,

    /**
     * 图片画布布局（默认横向）
     */
    TextCanvasFontLayout: "horizontal", //horizontal,vertical

    /**
     * 图片画布默认字体
     */
    TextCanvasFont: "arial",

    /**
     * 图片画布默认字体大小
     */
    TextCanvasFontSize: 20,

    /**
     * 图片画布默认文本颜色值
     */
    TextCanvasFontColor: "rgb(0, 0, 0)",

    /**
     * 文字画布文本是否加粗
     */
    TextCanvasFontBold: false,

    /**
     * 文字画布文本是否斜体
     */
    TextCanvasFontItalic: false,

    /**
     * 文字画布文本是否有下划线
     */
    TextCanvasFontUnderline: false,

    /**
     * 文字画布文本对齐方式
     */
    TextCanvasFontTextAlign: "center",

    /**
     * 文字画布文本透明度
     */
    TextCanvasFontAlpha: 1,

    /**
     * 文字画布绘制区域
     */
    TextCanvasRect: { "x": 0, "y": 0, "width": 300, "height": 150 },

    /**
     * 文本框
     */
    Textarea: null,

    /**
     * 软键盘触发div
     */
    TriggerSoftKeyboard: null,

    /**
     * 软键盘默认高度
     */
    SoftKeyboardHeight: 470,

    /**
     * 窗口初始内嵌宽度
     */
    InnerWidth: 0,

    /**
     * 窗口初始内嵌高度
     */
    InnerHeight: 0,

    /**
     * 是否触发过软键盘
     */
    IsTriggerSoftKeyboard: false,

    /**
     * 是否开关软键盘
     */
    IsSwitchSoftKeyboard: false,

    /**
     * 系统默认字体
     */
    RootFontFamily: "arial",

    /**
     * 系统默认支持字体数组
     */
    SystemFonts: [],

    /**
     * 是否初始化过
     */
    IsInited: false,

    /**
     * 下方菜单按钮选中的索引（键盘，样式，字体）
     */
    ToggleBottomMenuRadioIndex: -1,

    /**
     * 上次选中字体颜色Span索引
     */
    LastSelectFontColorSpanIndex: -1,

    /**
     * 上次选中字体Div索引
     */
    LastSelectFontFamilyDivIndex: -1,

    /**
     * H5页面载入标志
     */
    HtmlPageLoadFlag: 0,

    /**
     * 下方单选按钮（键盘，样式，字体）
     */
    BottomRadioDatas: [{
            Text: "Keyboard"
        },
        {
            Text: "Style"
        },
        {
            Text: "Font"
        },
    ],

    /**
     * 画布数据
     */
    CanvasDatas: [{
            Id: "bg_canvas",
        },
        {
            Id: "text_canvas",
        },
        {
            Id: "main_canvas",
        },
    ],

    /**
     * 文字转图片界面颜色值单选框颜色
     */
    RGBRadioDatas: [{
            RGB: "",
        },
        {
            RGB: "rgb(255, 255, 255)",
        },
        {
            RGB: "rgb(51, 51, 51)",
        },
        {
            RGB: "rgb(240, 68, 49)",
        },
        {
            RGB: "rgb(251, 177, 13)",
        },
        {
            RGB: "rgb(255, 229, 153)",
        },
        {
            RGB: "rgb(197, 227, 64)",
        },
        {
            RGB: "rgb(123, 195, 186)",
        },
        {
            RGB: "rgb(26, 180, 251)",
        },
        {
            RGB: "rgb(155, 90, 184)",
        }
    ],

    /**
     * 字体样式菜单数据
     */
    FontStyleMenuDatas: [{
            Flex: 0.3,
            Text: "Layout",
            Datas: [{
                    Flex: 0.5,
                    Text: "Horizontal",
                },
                // {
                //     Flex: 0.5,
                //     Text: "Vertical",
                // }
            ]
        },
        {
            Flex: 0.35,
            Text: "Style",
            Datas: [{
                    Flex: 0.5,
                    Text: "Bold",
                },
                {
                    Flex: 0.5,
                    Text: "Italic",
                },
                // {
                //     Flex: 1 / 3,
                //     Text: "Underline",
                // }
            ]
        },
        {
            Flex: 0.35,
            Text: "Align",
            Datas: [{
                    Flex: 1 / 3,
                    Text: "LeftAlign",
                },
                {
                    Flex: 1 / 3,
                    Text: "MiddleAlign",
                },
                {
                    Flex: 1 / 3,
                    Text: "RightAlign",
                }
            ]
        }
    ],

    /**
     * 字体大小数据
     */
    FontSizeDatas: [],

    /**
     * 样式界面可选择的颜色值
     */
    RGBs: [
        "rgb(153, 153, 153)",
        "rgb(216, 216, 216)",
        "rgb(246, 130, 126)",
        "rgb(252, 199, 10)",
        "rgb(255, 242, 203)",
        "rgb(223, 238, 170)",
        "rgb(166, 226, 219)",
        "rgb(139, 195, 247)",
        "rgb(189, 143, 216)",
        "rgb(0, 0, 0)",
        "rgb(191, 191, 191)",
        "rgb(240, 68, 49)",
        "rgb(251, 177, 13)",
        "rgb(255, 229, 153)",
        "rgb(197, 227, 64)",
        "rgb(123, 195, 186)",
        "rgb(26, 180, 251)",
        "rgb(155, 90, 184)"
    ],

    /**
     * 字体界面检测当前设备支持哪些字体
     */
    DataFonts: {
        windows: [{
            SimplifiedChinese: '宋体',
            English: 'SimSun'
        }, {
            SimplifiedChinese: '黑体',
            English: 'SimHei'
        }, {
            SimplifiedChinese: '微软雅黑',
            English: 'Microsoft Yahei'
        }, {
            SimplifiedChinese: '微软正黑体',
            English: 'Microsoft JhengHei'
        }, {
            SimplifiedChinese: '楷体',
            English: 'KaiTi'
        }, {
            SimplifiedChinese: '新宋体',
            English: 'NSimSun'
        }, {
            SimplifiedChinese: '仿宋',
            English: 'FangSong'
        }],
        'OS X': [{
            SimplifiedChinese: '苹方',
            English: 'PingFang SC'
        }, {
            SimplifiedChinese: '华文黑体',
            English: 'STHeiti'
        }, {
            SimplifiedChinese: '华文楷体',
            English: 'STKaiti'
        }, {
            SimplifiedChinese: '华文宋体',
            English: 'STSong'
        }, {
            SimplifiedChinese: '华文仿宋',
            English: 'STFangsong'
        }, {
            SimplifiedChinese: '华文中宋',
            English: 'STZhongsong'
        }, {
            SimplifiedChinese: '华文琥珀',
            English: 'STHupo'
        }, {
            SimplifiedChinese: '华文新魏',
            English: 'STXinwei'
        }, {
            SimplifiedChinese: '华文隶书',
            English: 'STLiti'
        }, {
            SimplifiedChinese: '华文行楷',
            English: 'STXingkai'
        }, {
            SimplifiedChinese: '冬青黑体简',
            English: 'Hiragino Sans GB'
        }, {
            SimplifiedChinese: '兰亭黑-简',
            English: 'Lantinghei SC'
        }, {
            SimplifiedChinese: '翩翩体-简',
            English: 'Hanzipen SC'
        }, {
            SimplifiedChinese: '手札体-简',
            English: 'Hannotate SC'
        }, {
            SimplifiedChinese: '宋体-简',
            English: 'Songti SC'
        }, {
            SimplifiedChinese: '娃娃体-简',
            English: 'Wawati SC'
        }, {
            SimplifiedChinese: '魏碑-简',
            English: 'Weibei SC'
        }, {
            SimplifiedChinese: '行楷-简',
            English: 'Xingkai SC'
        }, {
            SimplifiedChinese: '雅痞-简',
            English: 'Yapi SC'
        }, {
            SimplifiedChinese: '圆体-简',
            English: 'Yuanti SC'
        }],
        'office': [{
            SimplifiedChinese: '幼圆',
            English: 'YouYuan'
        }, {
            SimplifiedChinese: '隶书',
            English: 'LiSu'
        }, {
            SimplifiedChinese: '华文细黑',
            English: 'STXihei'
        }, {
            SimplifiedChinese: '华文楷体',
            English: 'STKaiti'
        }, {
            SimplifiedChinese: '华文宋体',
            English: 'STSong'
        }, {
            SimplifiedChinese: '华文仿宋',
            English: 'STFangsong'
        }, {
            SimplifiedChinese: '华文中宋',
            English: 'STZhongsong'
        }, {
            SimplifiedChinese: '华文彩云',
            English: 'STCaiyun'
        }, {
            SimplifiedChinese: '华文琥珀',
            English: 'STHupo'
        }, {
            SimplifiedChinese: '华文新魏',
            English: 'STXinwei'
        }, {
            SimplifiedChinese: '华文隶书',
            English: 'STLiti'
        }, {
            SimplifiedChinese: '华文行楷',
            English: 'STXingkai'
        }, {
            SimplifiedChinese: '方正舒体',
            English: 'FZShuTi'
        }, {
            SimplifiedChinese: '方正姚体',
            English: 'FZYaoti'
        }],
        'open': [{
            SimplifiedChinese: '思源黑体',
            English: 'Source Han Sans CN'
        }, {
            SimplifiedChinese: '思源宋体',
            English: 'Source Han Serif SC'
        }, {
            SimplifiedChinese: '文泉驿微米黑',
            English: 'WenQuanYi Micro Hei'
        }],
        'hanyi': [{
                SimplifiedChinese: '汉仪旗黑',
                English: 'HYQihei 40S'
            }, {
                SimplifiedChinese: '汉仪旗黑',
                English: 'HYQihei 50S'
            }, {
                SimplifiedChinese: '汉仪旗黑',
                English: 'HYQihei 60S'
            },
            {
                SimplifiedChinese: '汉仪大宋简',
                English: 'HYDaSongJ'
            }, {
                SimplifiedChinese: '汉仪楷体',
                English: 'HYKaiti'
            }, {
                SimplifiedChinese: '汉仪家书简',
                English: 'HYJiaShuJ'
            }, {
                SimplifiedChinese: '汉仪PP体简',
                English: 'HYPPTiJ'
            }, {
                SimplifiedChinese: '汉仪乐喵体简',
                English: 'HYLeMiaoTi'
            }, {
                SimplifiedChinese: '汉仪小麦体',
                English: 'HYXiaoMaiTiJ'
            }, {
                SimplifiedChinese: '汉仪程行体',
                English: 'HYChengXingJ'
            }, {
                SimplifiedChinese: '汉仪黑荔枝',
                English: 'HYHeiLiZhiTiJ'
            }, {
                SimplifiedChinese: '汉仪雅酷黑W',
                English: 'HYYaKuHeiW'
            }, {
                SimplifiedChinese: '汉仪大黑简',
                English: 'HYDaHeiJ'
            }, {
                SimplifiedChinese: '汉仪尚魏手书W',
                English: 'HYShangWeiShouShuW'
            }
        ],
        'fangzheng': [{
            SimplifiedChinese: "方正粗雅宋简体",
            English: "FZYaSongS-B-GB"
        }, {
            SimplifiedChinese: "方正报宋简体",
            English: "FZBaoSong-Z04S"
        }, {
            SimplifiedChinese: "方正粗圆简体",
            English: "FZCuYuan-M03S"
        }, {
            SimplifiedChinese: "方正大标宋简体",
            English: "FZDaBiaoSong-B06S"
        }, {
            SimplifiedChinese: "方正大黑简体",
            English: "FZDaHei-B02S"
        }, {
            SimplifiedChinese: "方正仿宋简体",
            English: "FZFangSong-Z02S"
        }, {
            SimplifiedChinese: "方正黑体简体",
            English: "FZHei-B01S"
        }, {
            SimplifiedChinese: "方正琥珀简体",
            English: "FZHuPo-M04S"
        }, {
            SimplifiedChinese: "方正楷体简体",
            English: "FZKai-Z03S"
        }, {
            SimplifiedChinese: "方正隶变简体",
            English: "FZLiBian-S02S"
        }, {
            SimplifiedChinese: "方正隶书简体",
            English: "FZLiShu-S01S"
        }, {
            SimplifiedChinese: "方正美黑简体",
            English: "FZMeiHei-M07S"
        }, {
            SimplifiedChinese: "方正书宋简体",
            English: "FZShuSong-Z01S"
        }, {
            SimplifiedChinese: "方正舒体简体",
            English: "FZShuTi-S05S"
        }, {
            SimplifiedChinese: "方正水柱简体",
            English: "FZShuiZhu-M08S"
        }, {
            SimplifiedChinese: "方正宋黑简体",
            English: "FZSongHei-B07S"
        }, {
            SimplifiedChinese: "方正宋三简体",
            English: "FZSong"
        }, {
            SimplifiedChinese: "方正魏碑简体",
            English: "FZWeiBei-S03S"
        }, {
            SimplifiedChinese: "方正细等线简体",
            English: "FZXiDengXian-Z06S"
        }, {
            SimplifiedChinese: "方正细黑一简体",
            English: "FZXiHei I-Z08S"
        }, {
            SimplifiedChinese: "方正细圆简体",
            English: "FZXiYuan-M01S"
        }, {
            SimplifiedChinese: "方正小标宋简体",
            English: "FZXiaoBiaoSong-B05S"
        }, {
            SimplifiedChinese: "方正行楷简体",
            English: "FZXingKai-S04S"
        }, {
            SimplifiedChinese: "方正姚体简体",
            English: "FZYaoTi-M06S"
        }, {
            SimplifiedChinese: "方正中等线简体",
            English: "FZZhongDengXian-Z07S"
        }, {
            SimplifiedChinese: "方正准圆简体",
            English: "FZZhunYuan-M02S"
        }, {
            SimplifiedChinese: "方正综艺简体",
            English: "FZZongYi-M05S"
        }, {
            SimplifiedChinese: "方正彩云简体",
            English: "FZCaiYun-M09S"
        }, {
            SimplifiedChinese: "方正隶二简体",
            English: "FZLiShu II-S06S"
        }, {
            SimplifiedChinese: "方正康体简体",
            English: "FZKangTi-S07S"
        }, {
            SimplifiedChinese: "方正超粗黑简体",
            English: "FZChaoCuHei-M10S"
        }, {
            SimplifiedChinese: "方正新报宋简体",
            English: "FZNew BaoSong-Z12S"
        }, {
            SimplifiedChinese: "方正新舒体简体",
            English: "FZNew ShuTi-S08S"
        }, {
            SimplifiedChinese: "方正黄草简体",
            English: "FZHuangCao-S09S"
        }, {
            SimplifiedChinese: "方正少儿简体",
            English: "FZShaoEr-M11S"
        }, {
            SimplifiedChinese: "方正稚艺简体",
            English: "FZZhiYi-M12S"
        }, {
            SimplifiedChinese: "方正细珊瑚简体",
            English: "FZXiShanHu-M13S"
        }, {
            SimplifiedChinese: "方正粗宋简体",
            English: "FZCuSong-B09S"
        }, {
            SimplifiedChinese: "方正平和简体",
            English: "FZPingHe-S11S"
        }, {
            SimplifiedChinese: "方正华隶简体",
            English: "FZHuaLi-M14S"
        }, {
            SimplifiedChinese: "方正瘦金书简体",
            English: "FZShouJinShu-S10S"
        }, {
            SimplifiedChinese: "方正细倩简体",
            English: "FZXiQian-M15S"
        }, {
            SimplifiedChinese: "方正中倩简体",
            English: "FZZhongQian-M16S"
        }, {
            SimplifiedChinese: "方正粗倩简体",
            English: "FZCuQian-M17S"
        }, {
            SimplifiedChinese: "方正胖娃简体",
            English: "FZPangWa-M18S"
        }, {
            SimplifiedChinese: "方正宋一简体",
            English: "FZSongYi-Z13S"
        }, {
            SimplifiedChinese: "方正剪纸简体",
            English: "FZJianZhi-M23S"
        }, {
            SimplifiedChinese: "方正流行体简体",
            English: "FZLiuXingTi-M26S"
        }, {
            SimplifiedChinese: "方正祥隶简体",
            English: "FZXiangLi-S17S"
        }, {
            SimplifiedChinese: "方正粗活意简体",
            English: "FZCuHuoYi-M25S"
        }, {
            SimplifiedChinese: "方正胖头鱼简体",
            English: "FZPangTouYu-M24S"
        }, /*{SimplifiedChinese:"方正铁筋隶书简体",English:"FZTieJinLiShu-Z14S"},{SimplifiedChinese:"方正北魏楷书简体",English:"FZBeiWeiKaiShu-Z15S"},*/ {
            SimplifiedChinese: "方正卡通简体",
            English: "FZKaTong-M19S"
        }, {
            SimplifiedChinese: "方正艺黑简体",
            English: "FZYiHei-M20S"
        }, {
            SimplifiedChinese: "方正水黑简体",
            English: "FZShuiHei-M21S"
        }, {
            SimplifiedChinese: "方正古隶简体",
            English: "FZGuLi-S12S"
        }, {
            SimplifiedChinese: "方正幼线简体",
            English: "FZYouXian-Z09S"
        }, {
            SimplifiedChinese: "方正启体简体",
            English: "FZQiTi-S14S"
        }, {
            SimplifiedChinese: "方正小篆体",
            English: "FZXiaoZhuanTi-S13T"
        }, {
            SimplifiedChinese: "方正硬笔楷书简体",
            English: "FZYingBiKaiShu-S15S"
        }, {
            SimplifiedChinese: "方正毡笔黑简体",
            English: "FZZhanBiHei-M22S"
        }, {
            SimplifiedChinese: "方正硬笔行书简体",
            English: "FZYingBiXingShu-S16S"
        }]
    },

    //#region Common

    /**
     * 初始化
     */
    Init: function() {
        DataFunction.Text2Image = Manager.Text2Image;
        var t2i = DataFunction.Text2Image;
        var functions = Datas.Functions;
        functions.T2I_OnSelectImage = t2i.OnSelectImage;
        functions.T2I_OnCancelETBtnClick = t2i.OnCancelETBtnClick;
        functions.T2I_OnConfirmETBtnClick = t2i.OnConfirmETBtnClick;
        functions.T2I_UpdateTextareaFontStyle = t2i.UpdateTextareaFontStyle;
        functions.T2I_OnTextareaChanged = t2i.OnTextareaChanged;
        functions.T2I_OnTextareaClick = t2i.OnTextareaClick;
        functions.T2I_OnNgReapeatBottomRadioFinished = t2i.OnNgReapeatBottomRadioFinished;
        functions.T2I_OnBottomMenuRadioClick = t2i.OnBottomMenuRadioClick;
        functions.T2I_OnNgReapeatFontStyleFinished = t2i.OnNgReapeatFontStyleFinished;
        functions.T2I_GetStylePanelMenuId = t2i.GetStylePanelMenuId;
        functions.T2I_OnToggleStylePanelRadio = t2i.OnToggleStylePanelRadio;
        functions.T2I_OnToggleStylePanelFontSize = t2i.OnToggleStylePanelFontSize;
        functions.T2I_OnNgReapeatFontSizeFinished = t2i.OnNgReapeatFontSizeFinished;
        functions.T2I_OnToggleStylePanelFontColor = t2i.OnToggleStylePanelFontColor;
        functions.T2I_OnNgReapeatFontColorFinished = t2i.OnNgReapeatFontColorFinished;
        functions.T2I_OnToggleFontRadio = t2i.OnToggleFontRadio;
        functions.T2I_OnNgReapeatFontFinished = t2i.OnNgReapeatFontFinished;
        functions.T2I_OnBackgroundBtnClick = t2i.OnBackgroundBtnClick;
        functions.T2I_GetRGBRadioImgId = t2i.GetRGBRadioImgId;
        functions.T2I_GetRGBRadioImgClass = t2i.GetRGBRadioImgClass;
        functions.T2I_GetRGBRadioImgStyle = t2i.GetRGBRadioImgStyle;
        functions.T2I_GetRGBRadioImgUrl = t2i.GetRGBRadioImgUrl;
        functions.T2I_OnNgReapeatRGBRadioFinished = t2i.OnNgReapeatRGBRadioFinished;
        functions.T2I_OnToolRadioClick = t2i.OnToolRadioClick;
        functions.T2I_OnAlphaSliderClick = t2i.OnAlphaSliderClick;
        functions.T2I_OnCancelT2IBtnClick = t2i.OnCancelT2IBtnClick;
        functions.T2I_OnConfirmT2IBtnClick = t2i.OnConfirmT2IBtnClick;
        functions.T2I_Onload = t2i.Onload;
        functions.T2I_GetAcceptFormats = t2i.GetAcceptFormats;

        Text2Image.InnerWidth = window.innerWidth;
        Text2Image.InnerHeight = window.innerHeight;

        window.onresize = function() {
            Text2Image.InnerWidth = window.innerWidth;
            Text2Image.InnerHeight = window.innerHeight;
        };

        Text2Image.RootFontFamily = (document.documentElement.currentStyle ? document.documentElement.currentStyle : window.getComputedStyle(document.documentElement)).fontFamily;
        Text2Image.TextCanvasFont = Text2Image.RootFontFamily;

        Text2Image.InitFontSizeDatas();
        Text2Image.InitSystemFonts();
    },

    /**
     * 重置
     */
    Reset: function() {
        if (!Utils.IsNullOrUndefine(Text2Image.Cropper)) {
            Text2Image.Cropper.destroy();
        }
        Text2Image.AspectRatio = Text2Image.DefaultAspectRatio;
        Text2Image.ImageExtend = "";
        Text2Image.ImageFileName = "";
        Text2Image.ImageOrientation = 1;
        Text2Image.TextCanvasText = "";
        Text2Image.ImgCanvasUrl = "";
        Text2Image.ImgCanvasRgb = "rgb(255, 255, 255)";
        Text2Image.ImgCanvasAlpha = 1;
        Text2Image.TextCanvasFontLayout = "horizontal";
        Text2Image.TextCanvasFont = Text2Image.RootFontFamily;
        Text2Image.TextCanvasFontSize = 20;
        Text2Image.TextCanvasFontColor = "rgb(0, 0, 0)";
        Text2Image.TextCanvasFontBold = false;
        Text2Image.TextCanvasFontItalic = false;
        Text2Image.TextCanvasFontUnderline = false;
        Text2Image.TextCanvasFontTextAlign = "center";
        Text2Image.TextCanvasFontAlpha = 1;
        Text2Image.TextCanvasRect = { "x": 0, "y": 0, "width": 300, "height": 150 };
        Text2Image.ToggleBottomMenuRadioIndex = -1;
        Text2Image.LastSelectFontColorSpanIndex = -1;
        Text2Image.LastSelectFontFamilyDivIndex = -1;
        Text2Image.HtmlPageLoadFlag = 0;
    },

    /**
     * 设置支持的图片格式
     */
    SetFormats: function(formats) {
        if (formats == null || formats.length == 0 || (formats.length > 0 && formats.indexOf("*") > -1)) {
            Text2Image.Formats = [
                "png",
                "jpg",
                "jpeg"
            ];
            return;
        }

        Text2Image.Formats = [];
        for (let i = 0, len = formats.length; i < len; i++) {
            switch (formats[i]) {
                case "bmp":
                case "png":
                case "jpg":
                case "jpeg":
                    Text2Image.Formats.push(formats[i]);
                    break;
            }
        }
    },

    /**
     * 获取可接受的格式
     */
    GetAcceptFormats: function() {
        let format = "";
        for (let i = 0, len = Text2Image.Formats.length; i < len; i++) {
            if (format.length > 0)
                format += ", ";
            format += "image/" + Text2Image.Formats[i];
        }
        // console.log("format:" + format);
        return format;
    },

    /**
     * 设置默认裁剪区比率     
     */
    SetDefaultAspectRatio: function(ar) {
        Text2Image.DefaultAspectRatio = Utils.IsNumber(ar) && ar != 0 ? ar : 1;
    },

    /**
     * 初始化字体大小
     */
    InitFontSizeDatas: function() {
        for (let i = 10; i <= 30; i++) {
            Text2Image.FontSizeDatas.push(i);
        }
    },

    /**
     * 初始化系统字体
     */
    InitSystemFonts: function() {
        Text2Image.SystemFonts.push({ Font: DataFunction.GetText("DefaultFont"), FontFamily: Text2Image.RootFontFamily });

        let fontArray = [];
        for (let key in Text2Image.DataFonts) {
            if (key == null)
                continue;

            let fm = Text2Image.DataFonts[key];
            for (let i = 0, len = fm.length; i < len; i++) {
                fontArray.push(fm[i][UtilBarn.Language]);
            }
        }

        Text2Image.DetectFonts(fontArray, function(font, fontFamily) {
            Text2Image.SystemFonts.push({ Font: font, FontFamily: fontFamily });
        });
    },

    /**
     * 调整内容缩放
     * font-size，border-width百分比有问题，所以统一在此处理
     * 当前处理还有问题，ng-repeat完成回调比较晚
     */
    ResizeContentScale: function() {
        Manager.ResizeChildrenPXScale();

        // $scope.$on("ngRepeatFinished", function(repeatFinishedEvent, element) {
        //     var tempEle = $(element).find("[name='image_text']");
        //     var tempFontSize = parseInt(tempEle.css("font-size"));
        //     tempEle.css("font-size", tempFontSize * Text2Image.DefaultScale);
        // })
    },

    /**
     * 底部单选按钮加载完成回调
     */
    OnNgReapeatBottomRadioFinished: function() {
        Text2Image.HtmlPageLoadFlag |= 2;
        Text2Image.OnHtmlPageLoad();

        Text2Image.CheckStylePanelLayout();
        Text2Image.CheckStylePanelStyle();
        Text2Image.CheckStylePanelAlign();
    },

    /**
     * 字体样式加载完成回调
     */
    OnNgReapeatFontStyleFinished: function() {
        Text2Image.HtmlPageLoadFlag |= 4;
        Text2Image.OnHtmlPageLoad();
    },

    /**
     * 字体大小加载完成回调
     */
    OnNgReapeatFontSizeFinished: function() {
        Text2Image.HtmlPageLoadFlag |= 8;
        Text2Image.OnHtmlPageLoad();
    },

    /**
     * 字体颜色加载完成回调
     */
    OnNgReapeatFontColorFinished: function() {
        Text2Image.HtmlPageLoadFlag |= 16;
        Text2Image.OnHtmlPageLoad();
    },

    /**
     * 系统字体加载完成回调
     */
    OnNgReapeatFontFinished: function() {
        Text2Image.HtmlPageLoadFlag |= 32;
        Text2Image.OnHtmlPageLoad();
    },

    /**
     * 背景色单选按钮加载完成回调
     */
    OnNgReapeatRGBRadioFinished: function() {
        Text2Image.HtmlPageLoadFlag |= 64;
        Text2Image.OnHtmlPageLoad();
    },

    /**
     * 界面加载完成回调
     * 该Onload不是Html完成的时间，ng-repeat完成的时机不是固定的，如果需要处理一些事可以在上面的几个函数里找到对应的repeat完成事件处理
     */
    Onload: function() {
        Text2Image.HtmlPageLoadFlag |= 1;
        Text2Image.OnHtmlPageLoad();
    },

    /**
     * H5界面载入完成
     */
    OnHtmlPageLoad: function() {
        if (Text2Image.HtmlPageLoadFlag == 127) {
            Text2Image.ResizeContentScale();
            Text2Image.AspectRatio = Text2Image.DefaultAspectRatio;
            // if (Text2Image.FileSelectContainer == null)
            Text2Image.FileSelectContainer = document.getElementById("FileSelectContainer");
            // if (Text2Image.ImageContainerTarget == null)
            Text2Image.ImageContainerTarget = document.getElementById("T2IImageContainerTarget");
            Text2Image.ReadyText2Image();
        }
    },

    /**
     * 退出（关闭文字编辑以及文字转图片功能）
     */
    Quit: function() {
        Text2Image.FileSelectContainer.style.display = "none";
        Text2Image.SwitchPage();
        if (Text2Image.ShowParentFunction)
            Text2Image.ShowParentFunction();
        // Datas.Functions.Back();
    },

    /**
     * 是否软键盘弹出无法触发窗口重置回调
     * 当处于以下平台时候，由于这种情况下无法触发onresize所以需要直接将文字样式面板直接创建出来
     */
    IsWindowOnResizeNoCallback: function() {
        return Manager.Platform.IsIOS || Manager.Platform.IsUtilBarn || Manager.Platform.IsOppoBrowser;
    },

    /**
     * 切换页面（编辑文字、文字转图片页面）
     * 此处的做法不妥当应该和其他界面一样把文字编辑和文字转图片界面分成2个页面，数据用一组就行
     */
    SwitchPage: function(id) {
        if (id === "edit_text") {
            document.getElementById("edit_text").style.display = "block";
            document.getElementById("convert_text_image").style.display = "none";
        } else if (id === "convert_text_image") {
            //IOS下将输入框还原回去
            if (Text2Image.IsWindowOnResizeNoCallback() || Manager.Platform.IsPC) {
                Text2Image.ResizeTextareaHeight(true);
            }

            document.getElementById("edit_text").style.display = "none";
            document.getElementById("convert_text_image").style.display = "block";

            if (Manager.Platform.IsPC && !Manager.Platform.IsUtilBarn) {
                Text2Image.OnToolRadioClick("tool_radio_img2", true);
            } else { // if (Text2Image.IsWindowOnResizeNoCallback()) {
                //由于可能发生绘制图片的时候软键盘未收回，导致画布大小会固定在有软键盘时大小，此处做延时处理
                setTimeout(function() {
                    Text2Image.OnToolRadioClick("tool_radio_img2", true);
                }, 500);
            }
            // else {
            //     //记录重置大小也会有问题，在格式和字体面板弹出后还是会出bug
            //     var tempOnWindowResize = window.onresize;
            //     window.onresize = function() {
            //         Text2Image.OnToolRadioClick("tool_radio_img2", true);
            //         window.onresize = tempOnWindowResize;
            //     };
            // }
        } else {
            document.getElementById("edit_text").style.display = "none";
            document.getElementById("convert_text_image").style.display = "none";
        }
    },

    /**
     * 准备文字转图片功能
     */
    ReadyText2Image: function() {
        if (Text2Image.HideParentFunction != null)
            Text2Image.HideParentFunction();
        Text2Image.SwitchPage("edit_text");
        var et_top_tool_panel = document.getElementById("et_top_tool_panel");
        var et_bottom_panel = document.getElementById("et_bottom_panel");
        Text2Image.Textarea.style.height = (Text2Image.InnerHeight - et_top_tool_panel.offsetHeight - et_bottom_panel.offsetHeight) + "px";
        Text2Image.OpenTriggerSoftKeyboard();
        /*
        if (!Manager.Platform.IsPC && !Text2Image.IsInited) {
            Text2Image.OpenTriggerSoftKeyboard();
        } else {
            Text2Image.OpenTriggerSoftKeyboard();
            // Text2Image.SwitchSoftKeyboard(true);
            // Text2Image.ResizeTextareaHeight(true);
            // Text2Image.ToggleBottomMenuRadio(0);
            // document.getElementById("et_style_panel").style.height = Text2Image.SoftKeyboardHeight + "px";
            // document.getElementById("et_font_panel").style.height = Text2Image.SoftKeyboardHeight + "px";
            // // if (Manager.Platform.IsPC)
            // //     Text2Image.OpenTriggerSoftKeyboard();
        }
        */
    },

    //#endregion

    //#region EditText

    /**
     * 获取底部单选按钮Id
     */
    GetStylePanelMenuId: function(type, text, index) {
        let prefix = "";
        switch (type) {
            case "span":
                {
                    switch (text) {
                        case "Layout":
                            {
                                prefix = "et_layout";
                            }
                            break;

                        case "Style":
                            {
                                prefix = "et_font_style";
                            }
                            break;

                        case "Align":
                            {
                                prefix = "et_align";
                            }
                            break;
                    }
                }
                break;

            case "img":
                {
                    switch (text) {
                        case "Layout":
                            {
                                prefix = "et_layout_img";
                            }
                            break;

                        case "Style":
                            {
                                prefix = "et_font_style_img";
                            }
                            break;

                        case "Align":
                            {
                                prefix = "et_align_img";
                            }
                            break;
                    }
                }
                break;

            case "title":
                {
                    switch (text) {
                        case "Layout":
                            {
                                prefix = "et_layout_title";
                            }
                            break;

                        case "Style":
                            {
                                prefix = "et_font_style_title";
                            }
                            break;

                        case "Align":
                            {
                                prefix = "et_align_title";
                            }
                            break;
                    }
                }
                break;
        }

        return prefix + (index + 1);
    },

    /**
     * 点击取消编辑按钮回调
     */
    OnCancelETBtnClick: function() {
        console.log("OnCancelETBtnClick");
        // Text2Image.ResetParams();
        Text2Image.Reset();
        Text2Image.SwitchFontMenuPage();
        Text2Image.ToggleBottomMenuRadio(-1);
        Text2Image.SwitchSoftKeyboard(false);
        Text2Image.SwitchPage();
        if (Text2Image.ShowParentFunction)
            Text2Image.ShowParentFunction();
        Datas.Functions.Back();
    },

    /**
     * 点击确认编辑按钮回调
     */
    OnConfirmETBtnClick: function() {
        Text2Image.SwitchSoftKeyboard(false);
        Text2Image.OnPreviewTextImage();
    },

    /**
     * 预览文字图片(点击确定按钮)
     */
    OnPreviewTextImage: function() {
        Text2Image.SwitchPage("convert_text_image");
    },

    /**
     * 文本框数字改变回调
     */
    OnTextareaChanged: function() {
        if (Text2Image.DefaultTextareaHeight == 0)
            Text2Image.DefaultTextareaHeight = Text2Image.Textarea.offsetHeight;

        if (Text2Image.Textarea.offsetHeight <= Text2Image.DefaultTextareaHeight) {
            Text2Image.TextCanvasText = Text2Image.Textarea.innerText;
        } else {
            Text2Image.Textarea.innerText = Text2Image.TextCanvasText;
        }

        // console.log(Text2Image.textarea.innerText);
    },

    /**
     * 文本框点击回调
     */
    OnTextareaClick: function() {
        // if (Manager.Platform.IsIOS && Text2Image.Textarea != null) {            
        //     Text2Image.Textarea.scrollIntoView();
        // }
        Text2Image.OnBottomMenuRadioClick(0);
        Text2Image.SwitchFontMenuPage();
    },

    /**
     * 文本框聚焦回调
     */
    OnTextareaFocus: function() {
        console.log("OnTextareaFocus");
        Text2Image.ResizeTextareaHeight(true);
    },

    /**
     * 文本框失焦
     */
    TextareaBlur: function(isResize) {
        if (Text2Image.ToggleBottomMenuRadioIndex == 0) {
            Text2Image.ToggleBottomMenuRadioIndex = -1;
            if (isResize === true)
                Text2Image.ResizeTextareaHeight(false);

            // var menu_radio_img1 = document.getElementById("menu_radio_img1");
            // menu_radio_img1.setAttribute("ng-src", "img/u1919.png");
            // menu_radio_img1.src = "img/u1919.png";
            DataFunction.SetImage("Keyboard", "img/u1919.png", true);
            var menu_radio_title1 = document.getElementById("menu_radio_title1");
            menu_radio_title1.style.color = "#8A8A8A";
        }
    },

    /**
     * 文本框失焦回调(拉回文本框)
     */
    OnTextareaBlur: function() {
        console.log("OnTextareaBlur");
        Datas.Functions.InputBlur();
        //由于blur事件比click早所以延时判断是否点击按钮导致
        setTimeout(function() {
            Text2Image.TextareaBlur(true);
        }, 100);
    },

    /**
     * 文本框失焦回调(未处理文本框)
     */
    OnTextareaBlur2: function() {
        console.log("OnTextareaBlur2");
        Datas.Functions.InputBlur();
        //由于blur事件比click早所以延时判断是否点击按钮导致
        setTimeout(function() {
            Text2Image.TextareaBlur(false);
        }, 100);
    },

    /**
     * 切换样式面板单选框     
     */
    OnToggleStylePanelRadio: function(text, text2) {
        switch (text) {
            case "Layout":
                {

                }
                break;

            case "Style":
                {
                    switch (text2) {
                        case "Bold":
                            {
                                Text2Image.OnToggleStylePanelBold();
                            }
                            break;
                        case "Italic":
                            {
                                Text2Image.OnToggleStylePanelItalic();
                            }
                            break;
                        case "Underline":
                            {
                                Text2Image.OnToggleStylePanelUnderline();
                            }
                            break;
                    }
                }
                break;

            case "Align":
                {
                    switch (text2) {
                        case "LeftAlign":
                            {
                                Text2Image.OnToggleStylePanelAlign("left");
                            }
                            break;
                        case "MiddleAlign":
                            {
                                Text2Image.OnToggleStylePanelAlign("center");
                            }
                            break;
                        case "RightAlign":
                            {
                                Text2Image.OnToggleStylePanelAlign("right");
                            }
                            break;
                    }
                }
                break;
        }
    },

    /**
     * 切换字体单选框
     */
    OnToggleFontRadio: function(index) {
        Text2Image.CheckFontPanel(index);
        Text2Image.UpdateTextareaFontFamily();
    },

    /**
     * 创建打开触发软键盘遮罩
     * 由于移动端无法直接聚焦弹出软键盘，必须有交互（此处为点击遮罩）才能将软键盘弹出
     */
    OpenTriggerSoftKeyboard: function() {
        Text2Image.IsInited = true;

        if (Manager.Platform.IsPC && !Manager.Platform.IsUtilBarn) {
            Text2Image.IsTriggerSoftKeyboard = true;
            Text2Image.SwitchSoftKeyboard(true);
            Text2Image.SoftKeyboardHeight = Text2Image.InnerHeight * 0.44; //Text2Image.resizeHeight(471);
            Text2Image.ResizeTextareaHeight(true);
            Text2Image.ToggleBottomMenuRadio(0);
            document.getElementById("et_style_panel").style.height = Text2Image.SoftKeyboardHeight + "px";
            document.getElementById("et_font_panel").style.height = Text2Image.SoftKeyboardHeight + "px";
            // Text2Image.BuildFontStyleDiv();
            Text2Image.Textarea.onfocus = Text2Image.OnTextareaFocus;
            Text2Image.Textarea.onblur = Text2Image.OnTextareaBlur2;
            return;
        }

        // if (Text2Image.TriggerSoftKeyboard == null)
        Text2Image.TriggerSoftKeyboard = document.getElementById("trigger_soft_keyboard");

        if (Text2Image.TriggerSoftKeyboard == null) {
            Text2Image.TriggerSoftKeyboard = document.createElement("div");
            Text2Image.TriggerSoftKeyboard.id = "trigger_soft_keyboard";
            Text2Image.TriggerSoftKeyboard.style.position = "fixed";
            Text2Image.TriggerSoftKeyboard.style.top = "0px";
            Text2Image.TriggerSoftKeyboard.style.left = "0px";
            Text2Image.TriggerSoftKeyboard.style.width = "100%";
            Text2Image.TriggerSoftKeyboard.style.height = "100%";
            Text2Image.TriggerSoftKeyboard.style.backgroundColor = "#777";
            Text2Image.TriggerSoftKeyboard.style.opacity = 0.6;
            Text2Image.TriggerSoftKeyboard.zIndex = 10001;
            var triggerSoftKeyboardFunc = function() {
                if (Text2Image.IsWindowOnResizeNoCallback()) {
                    Text2Image.TriggerSoftKeyboard.style.display = "none";
                    Text2Image.IsTriggerSoftKeyboard = true;
                    Text2Image.ToggleBottomMenuRadio(0, true);
                    Text2Image.SwitchSoftKeyboard(true);
                    Text2Image.SoftKeyboardHeight = Text2Image.InnerHeight * 0.44; //Manager.ResizeScale(471);                                        
                    Text2Image.ResizeTextareaHeight(true);
                    document.getElementById("et_style_panel").style.height = Text2Image.SoftKeyboardHeight + "px";
                    document.getElementById("et_font_panel").style.height = Text2Image.SoftKeyboardHeight + "px";
                    // Text2Image.BuildFontStyleDiv();
                } else if (Manager.Platform.IsAndroid) {
                    Text2Image.TriggerSoftKeyboard.style.display = "none";
                    Text2Image.IsTriggerSoftKeyboard = true;
                    Text2Image.SwitchSoftKeyboard(true);
                }
            };
            Text2Image.TriggerSoftKeyboard.onclick = triggerSoftKeyboardFunc;
            document.body.appendChild(Text2Image.TriggerSoftKeyboard);
        }

        Text2Image.TriggerSoftKeyboard.style.display = "block";

        if (Manager.Platform.IsIOS) {
            Text2Image.Textarea.onfocus = Text2Image.OnTextareaFocus;
            Text2Image.Textarea.onblur = Text2Image.OnTextareaBlur2;
        } else if (Manager.Platform.IsOppoBrowser) {
            Text2Image.Textarea.onfocus = Text2Image.OnTextareaFocus;
            Text2Image.Textarea.onblur = Text2Image.OnTextareaBlur;
        } else if (Manager.Platform.IsAndroid) {
            if (Manager.Platform.IsUtilBarn) {
                Text2Image.Textarea.onfocus = Text2Image.OnTextareaFocus;
                Text2Image.Textarea.onblur = Text2Image.OnTextareaBlur;
            } else {
                window.onresize = function() {
                    if (window.innerWidth != Text2Image.InnerWidth) {
                        Text2Image.InnerWidth = window.innerWidth;
                        Text2Image.InnerHeight = window.innerHeight;
                    } else {
                        if (Text2Image.IsTriggerSoftKeyboard) {
                            Text2Image.SoftKeyboardHeight = Math.max(0, Text2Image.InnerHeight - window.innerHeight);
                            Text2Image.ResizeTextareaHeight(true);
                            Text2Image.ToggleBottomMenuRadio(0, true);
                            document.getElementById("et_style_panel").style.height = Text2Image.SoftKeyboardHeight + "px";
                            document.getElementById("et_font_panel").style.height = Text2Image.SoftKeyboardHeight + "px";
                            // Text2Image.BuildFontStyleDiv();

                            /*
                            //取消监听聚焦和模糊事件（由于该时间比点击事件晚，所以监听延迟处理会有问题，故直接采用重置后高度判断，可能有些移动设备也会有问题）
                            Text2Image.textarea.onfocus = Text2Image.onTextareaFocus;					
                            Text2Image.textarea.onblur = Text2Image.onTextareaBlur;
                            window.onresize = null;
                            */

                            window.onresize = function() {
                                if (Text2Image.ToggleBottomMenuRadioIndex == 0) {
                                    if (window.innerHeight == Text2Image.InnerHeight) {
                                        Text2Image.TextareaBlur(true);
                                    } else if (window.innerHeight == Text2Image.InnerHeight - Text2Image.SoftKeyboardHeight) {
                                        Text2Image.ResizeTextareaHeight(true);
                                    }
                                }
                            };
                        } else {
                            Text2Image.InnerHeight = window.innerHeight;
                        }
                    }
                };
            }
        }
    },

    /**
     * 检测系统支持字体
     */
    DetectFonts: function(fonts, callback) {
        var defaultWidths = {};
        var defaultHeights = {};
        var baseFonts = ['monospace', 'sans-serif', 'serif']; //, 'cursive', 'fantasy'
        var testString = "font-test";
        var testSize = '72px';

        var h = document.body; //.getElementsByTagName("body")[0];	
        var s = document.createElement("span");
        s.style.fontSize = testSize;
        s.innerHTML = testString;
        for (var i = 0, len = baseFonts.length; i < len; i++) {
            s.style.fontFamily = baseFonts[i];
            h.appendChild(s);
            defaultWidths[baseFonts[i]] = s.offsetWidth;
            defaultHeights[baseFonts[i]] = s.offsetHeight;
            h.removeChild(s);
        }

        for (var i = 0, ilen = fonts.length; i < ilen; i++) {
            var detected = false;
            var font = fonts[i];
            var fontFamily;
            for (var j = 0, jlen = baseFonts.length; j < jlen; j++) {
                var ff = font + ',' + baseFonts[j];
                s.style.fontFamily = ff;
                h.appendChild(s);
                var matched = (s.offsetWidth != defaultWidths[baseFonts[j]] || s.offsetHeight != defaultHeights[baseFonts[j]]);
                h.removeChild(s);
                if (matched)
                    fontFamily = ff;
                detected = detected || matched;
            }
            if (detected && callback != null)
                callback(font, fontFamily);
        }
    },

    /**
     * 准备选择图片
     */
    ReadySelectImage: function() {
        var f = document.getElementById("text2picture");
        f.click();
    },

    /**
     * 选择图片
     */
    SelectImage: function() {
        Text2Image.ReadySelectImage(function(url) {
            Text2Image.ImgCanvasUrl = url;
            Text2Image.DrawCanvas();
        });
    },

    /**
     * 从数据视图中的字符码获取字符串      
     */
    GetStringFromCharCode: function(dataView, start, length) {
        var str = '';
        var i;
        length += start;

        for (i = start; i < length; i += 1) {
            str += String.fromCharCode(dataView.getUint8(i));
        }

        return str;
    },

    /**
     * 重置且获取方向
     */
    ResetAndGetOrientation: function(arrayBuffer) {
        var dataView = new DataView(arrayBuffer);
        var orientation; // Ignores range error when the image does not have correct Exif information

        try {
            var littleEndian;
            var app1Start;
            var ifdStart; // Only handle JPEG image (start by 0xFFD8)

            if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
                var length = dataView.byteLength;
                var offset = 2;

                while (offset + 1 < length) {
                    if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
                        app1Start = offset;
                        break;
                    }

                    offset += 1;
                }
            }

            if (app1Start) {
                var exifIDCode = app1Start + 4;
                var tiffOffset = app1Start + 10;

                if (Text2Image.GetStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
                    var endianness = dataView.getUint16(tiffOffset);
                    littleEndian = endianness === 0x4949;

                    if (littleEndian || endianness === 0x4D4D
                        /* bigEndian */
                    ) {
                        if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
                            var firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

                            if (firstIFDOffset >= 0x00000008) {
                                ifdStart = tiffOffset + firstIFDOffset;
                            }
                        }
                    }
                }
            }

            if (ifdStart) {
                var _length = dataView.getUint16(ifdStart, littleEndian);

                var _offset;

                var i;

                for (i = 0; i < _length; i += 1) {
                    _offset = ifdStart + i * 12 + 2;

                    if (dataView.getUint16(_offset, littleEndian) === 0x0112
                        /* Orientation */
                    ) {
                        // 8 is the offset of the current tag's value
                        _offset += 8; // Get the original orientation value

                        orientation = dataView.getUint16(_offset, littleEndian); // Override the orientation with its default value

                        dataView.setUint16(_offset, 1, littleEndian);
                        break;
                    }
                }
            }
        } catch (e) {
            orientation = 1;
        }

        return orientation;
    },

    /**
     * 解析方向信息
     */
    ParseOrientation: function(orientation) {
        var rotate = 0;
        var scaleX = 1;
        var scaleY = 1;

        switch (orientation) {
            // Flip horizontal
            case 2:
                scaleX = -1;
                break;
                // Rotate left 180°

            case 3:
                rotate = -180;
                break;
                // Flip vertical

            case 4:
                scaleY = -1;
                break;
                // Flip vertical and rotate right 90°

            case 5:
                rotate = 90;
                scaleY = -1;
                break;
                // Rotate right 90°

            case 6:
                rotate = 90;
                break;
                // Flip horizontal and rotate right 90°

            case 7:
                rotate = 90;
                scaleX = -1;
                break;
                // Rotate left 90°

            case 8:
                rotate = -90;
                break;

            default:
        }

        return {
            rotate: rotate,
            scaleX: scaleX,
            scaleY: scaleY
        };
    },

    /**
     * 选中图片回调
     */
    OnSelectImage: function(file) {
        if (!file.files || !file.files[0]) {
            return;
        }
        Text2Image.FileSelectContainer.style.display = "block";

        var reader = new FileReader();
        reader.onload = function(evt) {
            // file.outerHTML = file.outerHTML;//清除input资源，用于下次继续选择				
            var tempFileName = file.files[0].name;
            $("#text2picture").val(""); //input输入框file类型选择同样输入框第二次不触发onchange事件
            Text2Image.ImageFileName = tempFileName;
            Text2Image.ImageExtend = Utils.GetExtend(tempFileName);
            Text2Image.ImgCanvasUrl = evt.target.result;
            var tempArrayBuffer = Utils.DataURLToArrayBuffer(evt.target.result);
            Text2Image.ImageOrientation = Text2Image.ResetAndGetOrientation(tempArrayBuffer);
            // if (tempOrientation > 1) {
            //     Text2Image.ImgCanvasUrl = Utils.ArrayBufferToDataURL(tempArrayBuffer, "image/jpeg");            
            //     Text2Image.ImgOrientation = Text2Image.ParseOrientation(tempOrientation);
            // } else {
            //     Text2Image.ImgCanvasUrl = evt.target.result;
            // }
            Text2Image.DrawCanvas();
        }
        reader.readAsDataURL(file.files[0]);
    },

    /**
     * 更新裁剪器（每次刷新画布的时候更新一次）
     */
    UpdateCropper: function() {
        if (!Utils.IsNullOrUndefine(Text2Image.Cropper)) {
            Text2Image.Cropper.destroy();
        }

        // var mw = Text2Image.ImageContainerTarget.offsetWidth;
        // var mh = mw / Text2Image.AspectRatio;
        // Text2Image.ImageContainerTarget.style.maxWidth = mw;
        // Text2Image.ImageContainerTarget.style.maxHeight = mh;
        Text2Image.Cropper = new Cropper(Text2Image.ImageContainerTarget, {
            aspectRatio: Text2Image.AspectRatio,
            viewMode: 1,
            ready: function() {
                croppable = true;
                Text2Image.Cropper.setDragMode("none");
            }
        });
    },

    /**
     * 调整文本框高度
     */
    ResizeTextareaHeight: function(switchSoftKeyboard) {
        Text2Image.IsSwitchSoftKeyboard = switchSoftKeyboard;
        var et_top_tool_panel = document.getElementById("et_top_tool_panel");
        var et_bottom_panel = document.getElementById("et_bottom_panel");
        if (Manager.Platform.IsPC && !Manager.Platform.IsUtilBarn) // || Manager.platform.IsIOS
        {
            if (switchSoftKeyboard) {
                Text2Image.Textarea.style.height = (Manager.ScaleInfo.DefaultHeight - et_top_tool_panel.offsetHeight - et_bottom_panel.offsetHeight) + "px";
            } else {
                Text2Image.Textarea.style.height = (Manager.ScaleInfo.DefaultHeight - et_top_tool_panel.offsetHeight - et_bottom_panel.offsetHeight - Text2Image.SoftKeyboardHeight) + "px";
            }
        } else if (Manager.Platform.IsIOS) //Text2Image.isDirectBuildFontStyleDiv()
        {
            if (switchSoftKeyboard) {
                Text2Image.Textarea.style.height = (Text2Image.InnerHeight - et_top_tool_panel.offsetHeight - et_bottom_panel.offsetHeight) + "px";
            } else {
                Text2Image.Textarea.style.height = (Text2Image.InnerHeight - et_top_tool_panel.offsetHeight - et_bottom_panel.offsetHeight - Text2Image.SoftKeyboardHeight) + "px";
            }
        } else {
            Text2Image.Textarea.style.height = (Text2Image.InnerHeight - et_top_tool_panel.offsetHeight - et_bottom_panel.offsetHeight - (switchSoftKeyboard ? Text2Image.SoftKeyboardHeight : 0)) + "px";
        }
    },

    /**
     * 切换底部菜单单选按钮（键盘、样式、字体）
     * 只有主动触发的需要使用apply（非交互产生）
     */
    ToggleBottomMenuRadio: function(index, apply) {
        Text2Image.ToggleBottomMenuRadioIndex = index;

        var id = "menu_radio_img" + (index + 1);
        var imgs = document.getElementsByName("menu_radio_imgs");
        var i, tempId;
        for (i = 0; i < imgs.length; i++) {
            tempId = imgs[i].id;
            if (tempId == id) {
                if (tempId == "menu_radio_img1")
                // imgs[i].src = "img/u1919_1.png";
                    DataFunction.SetImage("Keyboard", "img/u1919_1.png");
                else if (tempId == "menu_radio_img2")
                // imgs[i].src = "img/u1924_1.png";
                    DataFunction.SetImage("Style", "img/u1924_1.png");
                else if (tempId == "menu_radio_img3")
                // imgs[i].src = "img/u1929_1.png";
                    DataFunction.SetImage("Font", "img/u1929_1.png");
            } else {
                if (tempId == "menu_radio_img1")
                // imgs[i].src = "img/u1919.png";
                    DataFunction.SetImage("Keyboard", "img/u1919.png");
                else if (tempId == "menu_radio_img2")
                // imgs[i].src = "img/u1924.png";
                    DataFunction.SetImage("Style", "img/u1924.png");
                else if (tempId == "menu_radio_img3")
                // imgs[i].src = "img/u1929.png";
                    DataFunction.SetImage("Font", "img/u1929.png");
            }
        }

        id = "menu_radio_title" + (index + 1);
        var titles = document.getElementsByName("image_bottom_radio_text");
        for (i = 0; i < titles.length; i++) {
            tempId = titles[i].id;
            if (tempId == id) {
                titles[i].style.color = "#169BD5";
            } else {
                titles[i].style.color = "#8A8A8A";
            }
        }

        if (apply === true)
            DataFunction.Apply();
    },

    /**
     * 切换底部菜单单选按钮回调（键盘、样式、字体）
     */
    OnBottomMenuRadioClick: function(index) {
        if (Text2Image.ToggleBottomMenuRadioIndex == index && Text2Image.IsSwitchSoftKeyboard)
            return;

        Text2Image.ToggleBottomMenuRadio(index);

        if (index == 0) {
            Text2Image.SwitchFontMenuPage();
            Text2Image.SwitchSoftKeyboard(true);
            if (!Manager.Platform.IsAndroid)
                Text2Image.ResizeTextareaHeight(true);
        } else {
            if (index == 1) {
                Text2Image.SwitchFontMenuPage("et_style_panel");
                Text2Image.CheckStylePanelFontSize();
                Text2Image.CheckStylePanelFontColor();
            } else if (index == 2) {
                Text2Image.SwitchFontMenuPage("et_font_panel");
                Text2Image.CheckFontPanel();
            }
            if (!Manager.Platform.IsAndroid)
                Text2Image.ResizeTextareaHeight(false);
            else
                Text2Image.ResizeTextareaHeight(true);
        }
    },

    /**
     * 移动光标到最后
     */
    MoveCursor2End() {
        if (!Manager.Platform.IsIOS)
            return;

        var obj = Text2Image.Textarea;
        if (window.getSelection) {
            //ie11 10 9 ff safari
            var range = window.getSelection(); //创建range
            range.selectAllChildren(obj); //range 选择obj下所有子内容
            range.collapseToEnd(); //光标移至最后
        } else if (document.selection) {
            //ie10 9 8 7 6 5
            var range = document.selection.createRange(); //创建选择对象            
            range.moveToElementText(obj); //range定位到obj
            range.collapse(false); //光标移至最后
            range.select();
        }
    },

    /**
     * 开关软键盘
     */
    SwitchSoftKeyboard: function(flag) {
        if (flag) {
            Text2Image.Textarea.focus();
            Text2Image.MoveCursor2End();
        } else {
            Text2Image.Textarea.blur();
        }
    },

    /**
     * 切换文本菜单页（键盘，样式，字体）
     */
    SwitchFontMenuPage: function(id) {
        // var et_bottom_panel = document.getElementById("et_bottom_panel");
        var et_bottom_menu_panel = document.getElementById("et_bottom_menu_panel");
        var et_style_panel = document.getElementById("et_style_panel");
        var et_font_panel = document.getElementById("et_font_panel");
        switch (id) {
            case "et_style_panel":
                {
                    // et_bottom_panel.style.height = Manager.ResizeScale(66) + Text2Image.SoftKeyboardHeight;
                    et_bottom_menu_panel.style.bottom = Text2Image.SoftKeyboardHeight + "px";
                    et_style_panel.style.display = "block";
                    et_font_panel.style.display = "none";
                }
                break;

            case "et_font_panel":
                {
                    // et_bottom_panel.style.height = Manager.ResizeScale(66) + Text2Image.SoftKeyboardHeight;
                    et_bottom_menu_panel.style.bottom = Text2Image.SoftKeyboardHeight + "px";
                    et_style_panel.style.display = "none";
                    et_font_panel.style.display = "block";
                }
                break;

            default:
                {
                    // et_bottom_panel.style.height =  + Manager.ResizeScale(66);
                    et_bottom_menu_panel.style.bottom = "0px";
                    et_style_panel.style.display = "none";
                    et_font_panel.style.display = "none";
                }
                break;
        }
    },

    /**
     * 检查样式面板布局状态
     */
    CheckStylePanelLayout: function() {
        var checkIndex = Text2Image.TextCanvasFontLayout == "horizontal" ? 1 : 2;
        var imgs = {
            et_layout_img1: {
                Check: "img/u613_1.png",
                Uncheck: "img/u613.png"
            },
            et_layout_img2: {
                Check: "img/u619_1.png",
                Uncheck: "img/u619.png"
            }
        };
        var img, div, i, key;
        //TODO for(i = 1; i <= 2; i++)
        for (i = 1; i <= 1; i++) {
            // img = document.getElementById("et_layout_img" + i);
            div = document.getElementById("et_layout_title" + i);

            if (i == 1)
                key = "Horizontal";
            else if (i == 2)
                key = "Vertical";

            if (i == checkIndex) {
                // img.src = imgs["et_layout_img" + i].Check;
                DataFunction.SetImage(key, imgs["et_layout_img" + i].Check);
                div.style.color = "#169BD5";
            } else {
                // img.src = imgs["et_layout_img" + i].Uncheck;
                DataFunction.SetImage(key, imgs["et_layout_img" + i].Uncheck);
                div.style.color = "#8A8A8A";
            }
        }
    },

    /**
     * 检查样式面板粗体状态
     */
    CheckStylePanelBold: function() {
        // document.getElementById("et_font_style_img1").src = Text2Image.TextCanvasFontBold ? "img/u635_1.png" : "img/u635.png";
        DataFunction.SetImage("Bold", Text2Image.TextCanvasFontBold ? "img/u635_1.png" : "img/u635.png");
        document.getElementById("et_font_style_title1").style.color = Text2Image.TextCanvasFontBold ? "#169BD5" : "#8A8A8A";
    },

    /**
     * 检查样式面板斜体状态
     */
    CheckStylePanelItalic: function() {
        // document.getElementById("et_font_style_img2").src = Text2Image.TextCanvasFontItalic ? "img/u625_1.png" : "img/u625.png";
        DataFunction.SetImage("Italic", Text2Image.TextCanvasFontItalic ? "img/u625_1.png" : "img/u625.png");
        document.getElementById("et_font_style_title2").style.color = Text2Image.TextCanvasFontItalic ? "#169BD5" : "#8A8A8A";
    },

    /**
     * 检查样式面板下划线状态
     */
    CheckStylePanelUnderline: function() {
        /*TODO
        document.getElementById("et_font_style_img3").src = Text2Image.TextCanvasFontUnderline ? "img/u630_1.png" : "img/u630.png";
        document.getElementById("et_font_style_title3").style.color = Text2Image.TextCanvasFontUnderline ? "#169BD5" : "#8A8A8A";
        */
    },

    /**
     * 检查样式面板状态
     */
    CheckStylePanelStyle: function() {
        Text2Image.CheckStylePanelBold();
        Text2Image.CheckStylePanelItalic();
        Text2Image.CheckStylePanelUnderline();
    },

    /**
     * 检查样式面板对齐方式
     */
    CheckStylePanelAlign: function() {
        var checkIndex;
        switch (Text2Image.TextCanvasFontTextAlign) {
            case "left":
                checkIndex = 1;
                break;
            case "center":
                checkIndex = 2;
                break;
            case "right":
                checkIndex = 3;
                break;
            default:
                checkIndex = 2;
                break;
        }
        var imgs = {
            et_align_img1: {
                Check: "img/u603_1.png",
                Uncheck: "img/u603.png"
            },
            et_align_img2: {
                Check: "img/u598_1.png",
                Uncheck: "img/u598.png"
            },
            et_align_img3: {
                Check: "img/u608_1.png",
                Uncheck: "img/u608.png"
            }
        };
        var img, div, i, key;
        for (i = 1; i <= 3; i++) {
            // img = document.getElementById("et_align_img" + i);
            div = document.getElementById("et_align_title" + i);

            if (i == 1)
                key = "LeftAlign";
            else if (i == 2)
                key = "MiddleAlign";
            else if (i == 3)
                key = "RightAlign";

            if (i == checkIndex) {
                // img.src = imgs["et_align_img" + i].Check;
                DataFunction.SetImage(key, imgs["et_align_img" + i].Check);
                div.style.color = "#169BD5";
            } else {
                // img.src = imgs["et_align_img" + i].Uncheck;
                DataFunction.SetImage(key, imgs["et_align_img" + i].Uncheck);
                div.style.color = "#8A8A8A";
            }
        }
    },

    /**
     * 检查样式面板字体大小
     */
    CheckStylePanelFontSize: function(oldSize, newSize) {
        if (Utils.IsNumber(oldSize)) {
            var span = document.getElementById("ex_font_size_scroll_span" + oldSize);
            if (span != null) {
                span.style.backgroundColor = "#FFFFFF";
                span.style.color = "#8A8A8A";
            }
        }

        var isInit = Utils.IsNullOrUndefine(newSize);
        if (isInit)
            newSize = Text2Image.TextCanvasFontSize;
        var span2 = document.getElementById("ex_font_size_scroll_span" + newSize);
        if (span2 != null) {
            span2.style.backgroundColor = "rgba(242, 242, 242, 1)";
            span2.style.color = "#169BD5";

            if (isInit) {
                var grid = document.getElementById("ex_font_size_scroll_grid");
                grid.scrollLeft = span2.offsetLeft - grid.offsetWidth * 0.5;
            }
        }
    },

    /**
     * 检查样式面板字体颜色
     */
    CheckStylePanelFontColor: function(index) {
        if (!Utils.IsNumber(Text2Image.LastSelectFontColorSpanIndex) || Text2Image.LastSelectFontColorSpanIndex == -1) {
            for (var i = 0, len = Text2Image.RGBs.length; i < len; i++) {
                if (Text2Image.TextCanvasFontColor === Text2Image.RGBs[i]) {
                    Text2Image.LastSelectFontColorSpanIndex = i;
                    break;
                }
            }
        }

        var span = document.getElementById("ex_font_color_span" + (Text2Image.LastSelectFontColorSpanIndex + 1));

        if (Utils.IsNumber(index)) {
            if (span != null)
                span.style.borderColor = "rgb(255, 255, 255)";
            var span1 = document.getElementById("ex_font_color_span" + (index + 1));
            if (span1 != null) {
                // span1.style.borderWidth = Manager.ResizeScale(2);	
                span1.style.borderColor = "rgb(22, 155, 213)";
                Text2Image.TextCanvasFontColor = Text2Image.RGBs[index];
                Text2Image.LastSelectFontColorSpanIndex = index;
            }
        } else {
            if (span != null)
            // span.style.borderWidth = Manager.ResizeScale(2);		
                span.style.borderColor = "rgb(22, 155, 213)"
        }
    },

    /**
     * 检查样式面板
     */
    CheckStylePanel: function() {
        Text2Image.CheckStylePanelLayout();
        Text2Image.CheckStylePanelStyle();
        Text2Image.CheckStylePanelAlign();
        Text2Image.CheckStylePanelFontSize();
        Text2Image.CheckStylePanelFontColor();
    },

    /**
     * 检查字体面板
     */
    CheckFontPanel: function(index) {
        if (!Utils.IsNumber(Text2Image.LastSelectFontFamilyDivIndex) || Text2Image.LastSelectFontFamilyDivIndex == -1) {
            var divs = document.getElementsByName("image_font_text");
            for (var i = 0, len = divs.length; i < len; i++) {
                if (Text2Image.TextCanvasFont === divs[i].style.fontFamily) {
                    Text2Image.LastSelectFontFamilyDivIndex = i + 1;
                    divs[i].parentNode.style.backgroundColor = "rgba(214, 243, 255, 0.4)";
                    return;
                }
            }
        }

        var div = document.getElementById("ex_font_scroll_div" + Text2Image.LastSelectFontFamilyDivIndex);

        if (Utils.IsNumber(index)) {
            if (div != null)
                div.style.backgroundColor = "rgba(255, 255, 255, 1)";
            var div1 = document.getElementById("ex_font_scroll_div" + index);
            if (div1 != null) {
                div1.style.backgroundColor = "rgba(214, 243, 255, 0.4)";
                // Text2Image.TextCanvasFont = div1.childNodes[1].style.fontFamily;
                var div2 = document.getElementById("ex_font_scroll_title" + index);
                if (div2 != null)
                    Text2Image.TextCanvasFont = div2.style.fontFamily;
                Text2Image.LastSelectFontFamilyDivIndex = index;
            }
        } else {
            if (div != null)
                div.style.backgroundColor = "rgba(214, 243, 255, 0.4)";
        }
    },

    /**
     * 更新文本框字体
     */
    UpdateTextareaFontFamily: function() {
        Text2Image.Textarea.style.fontFamily = Text2Image.TextCanvasFont;
    },

    /**
     * 更新文本框字体大小
     */
    UpdateTextareaFontSize: function() {
        Text2Image.Textarea.style.fontSize = Text2Image.TextCanvasFontSize + "px";
    },

    /**
     * 更新文本框字体颜色
     */
    UpdateTextareaFontColor: function() {
        Text2Image.Textarea.style.color = Utils.RGB2RGBA(Text2Image.TextCanvasFontColor, Text2Image.TextCanvasFontAlpha);
    },

    /**
     * 更新文本框是否粗体
     */
    UpdateTextareaFontBold: function() {
        Text2Image.Textarea.style.fontWeight = Text2Image.TextCanvasFontBold ? "bold" : "400"; //normal
    },

    /**
     * 更新文本框是否斜体
     */
    UpdateTextareaFontItalic: function() {
        Text2Image.Textarea.style.fontStyle = Text2Image.TextCanvasFontItalic ? "italic" : "normal";
    },

    /**
     * 更新文本框是否有下划线
     */
    UpdateTextareaFontUnderline: function() {
        Text2Image.Textarea.style.textDecoration = Text2Image.TextCanvasFontUnderline ? "underline" : "none";
    },

    /**
     * 更新文本框对齐方式
     */
    UpdateTextareaFontAlign: function() {
        Text2Image.Textarea.style.textAlign = Text2Image.TextCanvasFontTextAlign;
    },

    /**
     * 更新文本框字体样式
     */
    UpdateTextareaFontStyle: function() {
        // if (Text2Image.Textarea == null)
        Text2Image.Textarea = document.getElementById("et_body_textarea");

        Text2Image.UpdateTextareaFontFamily();
        Text2Image.UpdateTextareaFontSize();
        Text2Image.UpdateTextareaFontColor();
        Text2Image.UpdateTextareaFontBold();
        Text2Image.UpdateTextareaFontItalic();
        Text2Image.UpdateTextareaFontUnderline();
        Text2Image.UpdateTextareaFontAlign();
    },

    /**
     * 切换样式面板粗体按钮状态
     */
    OnToggleStylePanelBold: function() {
        Text2Image.TextCanvasFontBold = !Text2Image.TextCanvasFontBold;
        Text2Image.UpdateTextareaFontBold();
        Text2Image.CheckStylePanelBold();
    },

    /**
     * 切换样式面板斜体按钮状态
     */
    OnToggleStylePanelItalic: function() {
        Text2Image.TextCanvasFontItalic = !Text2Image.TextCanvasFontItalic;
        Text2Image.UpdateTextareaFontItalic();
        Text2Image.CheckStylePanelItalic();
    },

    /**
     * 切换样式面板下划线按钮状态
     */
    OnToggleStylePanelUnderline: function() {
        Text2Image.TextCanvasFontUnderline = !Text2Image.TextCanvasFontUnderline;
        Text2Image.UpdateTextareaFontUnderline();
        Text2Image.CheckStylePanelUnderline();
    },

    /**
     * 切换样式面板对齐按钮状态
     */
    OnToggleStylePanelAlign: function(align) {
        if (Text2Image.TextCanvasFontTextAlign == align)
            return;

        Text2Image.TextCanvasFontTextAlign = align;
        Text2Image.UpdateTextareaFontAlign();
        Text2Image.CheckStylePanelAlign();
    },

    /**
     * 切换样式面板字体大小按钮状态
     */
    OnToggleStylePanelFontSize: function(index) {
        Text2Image.CheckStylePanelFontSize(Text2Image.TextCanvasFontSize, index);
        Text2Image.TextCanvasFontSize = index;
        Text2Image.UpdateTextareaFontSize();
    },

    /**
     * 切换样式面板字体颜色按钮状态     
     */
    OnToggleStylePanelFontColor: function(index) {
        if (Text2Image.LastSelectFontColorSpanIndex == index)
            return;

        Text2Image.CheckStylePanelFontColor(index);
        Text2Image.UpdateTextareaFontColor();
    },

    /**
     * 切换样式面板字体按钮状态
     */
    OnToggleStylePanelFontFamily: function(index) {
        if (Text2Image.LastSelectFontFamilyDivIndex == index)
            return;

        Text2Image.CheckFontPanel(index);
        Text2Image.UpdateTextareaFontFamily();
    },

    /**
     * 重置参数
     */
    // ResetParams: function() {
    //     Text2Image.HtmlPageLoadFlag = 0;
    // },

    //#endregion

    //#region Text2Image

    /**
     * 获取颜色值单选按钮Id
     */
    GetRGBRadioId: function(index) {
        return "tool_radio" + (index + 1);
    },

    /**
     * 获取颜色值单选按钮left值     
     */
    GetRGBRadioLeft: function(index) {
        return "left: " + (6.266666666666667 + 2.4 * index) + "%";
    },

    /**
     * 获取颜色值单选图片Id
     */
    GetRGBRadioImgId: function(index) {
        return "tool_radio_img" + (index + 1);
    },

    /**
     * 获取颜色值单选图片样式
     */
    GetRGBRadioImgStyle: function(index, rgb) {
        return Text2Image.GetRGBRadioLeft(index) + ";" + (Utils.IsNullOrEmpty(rgb) ? "" : (" background-color:" + rgb + ";"));
    },

    /**
     * 获取颜色值单选图片css
     */
    GetRGBRadioImgClass: function(index) {
        return index == 0 ? "t2i_option_radio_img" : "t2i_option_radio_bgc";
    },

    /**
     * 获取颜色值单选图片Url
     */
    GetRGBRadioImgUrl: function(index) {
        return index == 0 ? DataFunction.GetImage("SelectLocalImage") : ""; //null;
    },

    /**
     * 文字转图片取消按钮点击（跳转到编辑文字界面）
     */
    OnCancelT2IBtnClick: function() {
        Text2Image.FileSelectContainer.style.display = "none";
        if (!Utils.IsNullOrUndefine(Text2Image.Cropper)) {
            Text2Image.Cropper.destroy();
        }
        Text2Image.SwitchPage("edit_text");
        Text2Image.SwitchFontMenuPage();
        Text2Image.ToggleBottomMenuRadio(0);
        Text2Image.SwitchSoftKeyboard(true);
    },

    /**
     * 确认文字转图片按钮点击回调
     */
    OnConfirmT2IBtnClick: function() {
        // Text2Image.Canvas2Image();
        Text2Image.SaveImage();
    },

    /**
     * 更换背景按钮点击
     */
    OnBackgroundBtnClick: function() {
        var bg_button = document.getElementById("bg_button");
        var option_pointer = document.getElementById("option_pointer");
        option_pointer.style.left = bg_button.offsetLeft;

        var option_panel = document.getElementById("option_panel");
        if (option_panel.style.visibility === "visible")
            option_panel.style.visibility = "hidden";
        else
            option_panel.style.visibility = "visible";
    },

    /**
     * 背景图片、颜色单选按钮点击
     */
    OnToolRadioClick: function(rId, redraw) {
        if (Utils.IsNumber(rId))
            rId = "tool_radio_img" + rId;
        if (rId == "tool_radio_img1") {
            Text2Image.SelectImage();
            return;
        }

        // Text2Image.AspectRatio = 1;
        var radio_imgs = document.getElementsByName("tool_radio_imgs");
        for (var i = 0; i < radio_imgs.length; i++) {
            if (radio_imgs[i].id == rId) {
                // radio_imgs[i].previousSibling.previousSibling.checked = true;
                radio_imgs[i].style.borderColor = "rgba(0, 255, 255, 1)";

                var tempBGC = radio_imgs[i].style.backgroundColor;
                if (redraw === true || tempBGC != Text2Image.ImgCanvasRgb || Text2Image.IsSelectImage()) {
                    Text2Image.ImgCanvasUrl = "";
                    Text2Image.ImgCanvasRgb = tempBGC;
                    Text2Image.DrawCanvas();
                }
            } else {
                radio_imgs[i].style.borderColor = "rgba(255, 255, 255, 1)";
            }
        }
    },

    /**
     * 透明度滑动条点击回调
     */
    OnAlphaSliderClick: function() {
        Text2Image.OnAlphaSliderChange(); //null, e.clientX
    },

    /**
     * 透明度滑动条改变回调
     */
    OnAlphaSliderChange: function(div, clientX) {
        if (div == null)
            div = document.getElementById("alpha_slider");
        if (clientX == null)
            clientX = window.event.clientX;
        var thumb = document.getElementById("alpha_slider_thumb");
        thumb.style.left = (Math.max(div.offsetLeft, Math.min(clientX - 0.0238095238095238 * div.offsetWidth, div.offsetLeft + div.offsetWidth))) + "px"; //Manager.ResizeScale(15);(15 / 750)
        var tempAlpha = 1 - Math.min(1, Math.max(0, (thumb.offsetLeft - div.offsetLeft) / div.offsetWidth));
        if (tempAlpha != Text2Image.ImgCanvasAlpha) {
            Text2Image.ImgCanvasAlpha = tempAlpha;
            Text2Image.DrawCanvas();
        }
    },

    /**
     * 选择图片单选按钮
     */
    SeletImageRadio: function() {
        var radio_imgs = document.getElementsByName("tool_radio_imgs");
        for (var i = 0; i < radio_imgs.length; i++) {
            if (radio_imgs[i].id == "tool_radio_img1") {
                // radio_imgs[i].previousSibling.previousSibling.checked = true;  
                radio_imgs[i].style.borderColor = "rgba(0, 255, 255, 1)";
            } else {
                radio_imgs[i].style.borderColor = "rgba(255, 255, 255, 1)";
            }
        }
    },

    /**
     * 是否当前选择了本地图片
     */
    IsSelectImage: function() {
        return Text2Image.ImgCanvasUrl != null && Text2Image.ImgCanvasUrl.length > 0;
    },

    /**
     * 调整画布大小
     */
    ResizeCanvas: function(canvas) {
        if (canvas == null)
            return;

        if (canvas.width != canvas.offsetWidth)
            canvas.width = canvas.offsetWidth;
        if (canvas.height != canvas.offsetHeight)
            canvas.height = canvas.offsetHeight;
    },

    /**
     * 获取当前文本画布字体信息
     */
    GetTextCanvasFont: function() {
        return (Text2Image.TextCanvasFontItalic ? "italic " : "normal ") + "normal " + (Text2Image.TextCanvasFontBold ? "bold " : "normal ") + Text2Image.TextCanvasFontSize.toString() + "px " + Text2Image.TextCanvasFont;
    },

    /**
     * 填充文本画布文本
     */
    FillCanvasText: function(ctx, text, x, y, width, height) {
        // var lineHeight = parseInt(ctx.font); // ctx.font必须以'XXpx'开头
        var lineHeight = Text2Image.TextCanvasFontSize;

        var size = { "width": 0, "height": 0 };
        // 计算每一行
        var lines = [];
        var curLine = "";
        var mTextWidth;
        for (var c of text) {
            var nextLine = curLine + c;
            mTextWidth = ctx.measureText(nextLine).width;
            size.width = Math.max(mTextWidth, size.width);
            if (c === '\n' || mTextWidth > width) {
                lines.push(curLine);
                curLine = c === '\n' ? '' : c;
            } else {
                curLine = nextLine;
            }
        }
        mTextWidth = ctx.measureText(nextLine).width;
        size.width = Math.max(mTextWidth, size.width);
        lines.push(curLine);

        // 逐行画文本
        var lineY = y + (height - lineHeight * (lines.length - 1)) / 2;
        for (var line of lines) {
            var lineX;
            if (ctx.textAlign === 'center') {
                lineX = x + width / 2;
            } else if (ctx.textAlign === 'right') {
                lineX = x + width;
            } else {
                lineX = x;
            }

            ctx.fillText(line, lineX, lineY, width);
            lineY += lineHeight;
            size.height += lineHeight;
        }

        return size;
    },

    /**
     * 绘制文本画布
     */
    DrawTextCanvas: function() {
        var text_c = document.getElementById("text_canvas");
        Text2Image.ResizeCanvas(text_c);
        var text_cxt = text_c.getContext("2d");
        text_cxt.clearRect(0, 0, text_c.width, text_c.height);

        text_cxt.textAlign = Text2Image.TextCanvasFontTextAlign; //设置水平对齐方式
        text_cxt.textBaseline = "middle"; //设置垂直对齐方式

        text_cxt.font = Text2Image.GetTextCanvasFont();
        text_cxt.globalAlpha = Text2Image.TextCanvasFontAlpha;
        text_cxt.fillStyle = Text2Image.TextCanvasFontColor;

        var size = Text2Image.FillCanvasText(text_cxt, Text2Image.TextCanvasText, 0, 0, text_c.width, text_c.height);
        var borderWidth = Manager.ResizeScale(8);
        var expandWidth = borderWidth * 2;
        var expandHeight = borderWidth * 2;
        var tempWidth = size.width + expandWidth;
        var tempHeight = size.height + expandHeight * 2;

        var tempLeft;
        switch (Text2Image.TextCanvasFontTextAlign) {
            case "left":
                tempLeft = -expandWidth * 0.5;
                break;

            case "right":
                tempLeft = text_c.width - tempWidth + expandWidth * 0.5;
                break;

            case "center":
            default:
                tempLeft = (text_c.width - tempWidth) * 0.5;
                break;
        }

        Text2Image.TextCanvasRect.width = tempWidth;
        Text2Image.TextCanvasRect.height = tempHeight;
        Text2Image.TextCanvasRect.x = tempLeft;
        Text2Image.TextCanvasRect.y = (text_c.height - tempHeight - expandHeight) * 0.5;

        return text_c;
    },

    /**
     * 绘制主画布
     */
    DrawMainCanvas: function(bg_canvas, imageWidth, imageHeight) {
        var main_c = document.getElementById("main_canvas");
        Text2Image.ResizeCanvas(main_c);
        var main_cxt = main_c.getContext("2d");
        var tempWidth = main_c.width;
        var tempHeight = main_c.height;
        main_cxt.clearRect(0, 0, tempWidth, tempHeight);
        if (Utils.IsNumber(imageWidth) && Utils.IsNumber(imageHeight))
            main_cxt.drawImage(bg_canvas, (tempWidth - imageWidth) * 0.5, (tempHeight - imageHeight) * 0.5);
        else
            main_cxt.drawImage(bg_canvas, 0, 0);
        main_cxt.drawImage(Text2Image.DrawTextCanvas(), 0, 0);
        // console.log("url:" + "url(" + main_c.toDataURL("image/png") + ")");
        Text2Image.ImageContainerTarget.src = main_c.toDataURL("image/png");
        Text2Image.UpdateCropper();
    },

    /**
     * 绘制画布
     * 由于图片画布和文字画布不能共用透明度，所以必须将文字和图片分两个画布内容绘制。还有需要一个主画布来将他们绘制在一起，不能将文字绘制到图片画布上和之前的理由是一样的
     */
    DrawCanvas: function() {
        var bg_c = document.getElementById("bg_canvas");
        Text2Image.ResizeCanvas(bg_c);
        var bg_cxt = bg_c.getContext("2d");
        bg_cxt.clearRect(0, 0, bg_c.width, bg_c.height);

        if (Text2Image.IsSelectImage()) {
            bg_cxt.globalAlpha = Text2Image.ImgCanvasAlpha;
            var image = new Image();
            // image.crossOrigin = "anonymous";
            image.onload = function() {
                Text2Image.AspectRatio = image.width / image.height;
                Text2Image.SeletImageRadio();
                // var tempWidth = bg_c.offsetWidth;
                // var tempHeight = tempWidth / image.width * image.height;
                var tempWidth, tempHeight;

                if (Text2Image.ImageOrientation > 1) {
                    var tempPO = Text2Image.ParseOrientation(Text2Image.ImageOrientation);
                    bg_cxt.rotate(tempPO.rotate * Math.PI / 180);
                    switch (Text2Image.ImageOrientation) {
                        case 3:
                            {
                                //旋转180度
                                tempWidth = bg_c.offsetWidth;
                                tempHeight = tempWidth / image.width * image.height;
                                bg_cxt.drawImage(image, -tempWidth, -tempHeight, tempWidth, tempHeight);
                                Text2Image.DrawMainCanvas(bg_c, tempWidth, tempHeight);
                            }
                            break;
                        case 6:
                            {
                                //向右旋转90度
                                tempHeight = bg_c.offsetWidth;
                                tempWidth = tempHeight / image.height * image.width;
                                bg_cxt.drawImage(image, 0, -tempHeight, tempWidth, tempHeight);
                                Text2Image.DrawMainCanvas(bg_c, tempHeight, tempWidth);
                            }
                            break;
                        case 8:
                            {
                                //向左旋转90度
                                tempHeight = bg_c.offsetWidth;
                                tempWidth = tempHeight / image.height * image.width;
                                bg_cxt.drawImage(image, -tempWidth, 0, tempWidth, tempHeight);
                                Text2Image.DrawMainCanvas(bg_c, tempHeight, tempWidth);
                            }
                            break;
                    }
                } else {
                    tempWidth = bg_c.offsetWidth;
                    tempHeight = tempWidth / image.width * image.height;
                    bg_cxt.drawImage(image, 0, 0, tempWidth, tempHeight);
                    Text2Image.DrawMainCanvas(bg_c, tempWidth, tempHeight);
                }
            };
            image.src = Text2Image.ImgCanvasUrl;
        } else {
            bg_cxt.globalAlpha = 1;
            bg_cxt.fillStyle = Utils.RGB2RGBA(Text2Image.ImgCanvasRgb, Text2Image.ImgCanvasAlpha);
            bg_cxt.fillRect(0, 0, bg_c.width, bg_c.height);

            Text2Image.DrawMainCanvas(bg_c);
        }
    },

    /**
     * 画布转图片
     */
    Canvas2Image: function() {
        var main_c = document.getElementById("main_canvas");
        var main_cxt = main_c.getContext("2d");
        var output_c = document.getElementById("output_canvas");
        var output_cxt = output_c.getContext("2d");
        var tempWidth = Text2Image.TextCanvasRect.width;
        var tempHeight = Text2Image.TextCanvasRect.height;
        output_c.width = tempWidth;
        output_c.height = tempHeight;
        output_cxt.clearRect(0, 0, tempWidth, tempHeight);
        output_cxt.drawImage(main_c, Text2Image.TextCanvasRect.x, Text2Image.TextCanvasRect.y, tempWidth, tempHeight, 0, 0, tempWidth, tempHeight);
        var img_data = output_c.toDataURL("image/png"); //"image/" + Text2Image.imageExtend

        // 	var div = document.getElementById("tool_panel");				
        // 	var image = new Image();
        // 	image.style.width = Text2Image.TextCanvasRect.width;
        // 	image.style.height = Text2Image.TextCanvasRect.height;
        // 	image.crossOrigin = "anonymous";
        // 	image.src = img_data;
        // 	div.appendChild(image);

        var blob = Utils.Base64ToBlob(data);
        var fileName = Utils.GetFileName(Text2Image.ImageFileName) + "_" + Utils.GetGuid() + '.' + Text2Image.ImageExtend;
        // Text2Image.GetBlobCallback(blob, Text2Image.ImageFileName);
        // Text2Image.CreateResource(blob, fileName);
        Text2Image.Quit();
    },

    /**
     * 保存图片
     */
    SaveImage: function() {
        // var blob;
        var extend = "png"; //Utils.IsNullOrEmpty(Text2Image.ImageExtend) ? "png" : Text2Image.ImageExtend;//由于转成部分格式如jpeg会丢失透明度在ios由于透明度用黑色代替所以会表现出来
        var accept = "image/" + extend;
        var croppedCanvas = Text2Image.Cropper.getCroppedCanvas();
        var data = croppedCanvas.toDataURL(accept);
        // var fileName = Utils.GetFileName(Text2Image.ImageFileName) + "_" + Utils.GetGuid() + '.' + Text2Image.ImageExtend;
        var fileName = (Utils.IsNullOrEmpty(Text2Image.ImageFileName) ? Utils.GetGuid() : Utils.GetFileName(Text2Image.ImageFileName)) + '.' + extend;
        var info = {
            "Data": data,
            "Name": fileName,
        }
        Manager.PostToNDR(info);
        // blob = Utils.Base64ToBlob(data);
        // var fileName = Utils.GetFileName(Text2Image.imageFileName) + "_" + Utils.GetGuid() + '.' + Text2Image.ImageExtend;
        // blob.name = fileName;
        // Text2Image.GetBlobCallback(blob, Text2Image.ImageFileName);
        // Text2Image.CreateResource(blob, fileName);
        Text2Image.Quit();
    },

    //#endregion
};