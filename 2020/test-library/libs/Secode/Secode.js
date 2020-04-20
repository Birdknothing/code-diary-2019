const DebugMode = false; // 是否调试模式

var log = function (data) {
    console.log(data);
};

var Secode = {
    /**
     * 是否需要旋转
     */
    Rotate: false,

    /**
     * 旋转模式 0: 非旋转 , 1 顺时针旋转90度，-1 逆时针旋转90度
     */
    RotateMode: 0,

    /**
     * 目标横屏,默认true,如果为false,则目标竖屏
     */
    Horizontal: true,

    /**
     * 手机屏宽
     */
    Width: document.documentElement.clientWidth,

    /**
     * 手机屏高
     */
    Height: document.documentElement.clientHeight,

    /**
     * 游戏Dom
     */
    GameDom: null,

    /**
     * 游戏Canvas
     */
    Canvas: null,

    /**
     * Layer面板
     */
    LayerDom: null,

    /**
     * 初始化游戏屏幕
     */
    InitGameScreen: function () {
        // 禁用Body右键、选择、拖拽
        document.body.setAttribute("oncontextmenu", "return false;");
        document.body.setAttribute("onselectstart", "return false;");
        document.body.setAttribute("ondragstart", "return false;");

        // 禁用双指缩放
        document.documentElement.addEventListener('touchstart', function (event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });
        document.documentElement.addEventListener('touchend', function (event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });

        // 禁用双击缩放
        var lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            var now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // 设置Body样式
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.background = "#484848";
        document.body.style.margin = "0";
        document.body.style.position = "fixed";
        document.body.style.overflow = "hidden";
        document.body.style.top = "0";
        document.body.style.left = "0";

        // 构造游戏Dom
        Secode.GameDom = document.createElement("div");
        Secode.GameDom.style.width = "100%";
        Secode.GameDom.style.height = "100%";
        Secode.GameDom.style.background = "#484848";
        Secode.GameDom.style.margin = "0";
        Secode.GameDom.style.position = "fixed";
        Secode.GameDom.style.overflow = "hidden";
        Secode.GameDom.style.top = "0";
        Secode.GameDom.style.left = "0";
        document.body.appendChild(Secode.GameDom);

        // 配置游戏层级Dom
        Secode.LayerDom = document.createElement("div");
        Secode.LayerDom.style.position = 'absolute';
        Secode.LayerDom.style.width = '100%';
        Secode.LayerDom.style.height = '100%';
        Secode.LayerDom.style.background = '#000';
        Secode.GameDom.appendChild(Secode.LayerDom);

        // 配置游戏画布
        Secode.Canvas = document.createElement("canvas");
        Secode.Canvas.style.position = 'absolute';
        Secode.Canvas.style.width = '100%';
        Secode.Canvas.style.height = '100%';
        Secode.Canvas.style.display = 'block';
        Secode.Canvas.style.background = 'transparent url(../images/blank.gif) repeat 0 0';
        Secode.Canvas.style.cursor = 'default';
        Secode.Canvas.style.zIndex = '20';
        Secode.GameDom.appendChild(Secode.Canvas);

        Secode.RotateGameScreen(Secode.Horizontal);
    },

    /**
     * 重新计算游戏屏幕
     */
    RecalculateGameScreen: function () {
        Secode.Width = document.documentElement.clientWidth;
        Secode.Height = document.documentElement.clientHeight;
        Secode.RotateGameScreen(Secode.Horizontal);
    },

    /**
     * 执行游戏屏幕的旋转
     * @param {Boolean} horizontal true调整至横屏,false调整至竖屏
     */
    RotateGameScreen: function (horizontal) {
        horizontal = horizontal || true;
        var contentDOM = Secode.GameDom; //获取body元素

        if (Secode.Width < Secode.Height) {
            //屏幕宽度 < 屏幕高度时，即竖屏
            if (horizontal) {
                //如果目标为横屏，就让页面横屏显示
                contentDOM.style.width = Secode.Height + 'px'; //设置该元素的宽等于屏高
                contentDOM.style.height = Secode.Width + 'px'; //设置该元素的高等于屏宽
                contentDOM.style.top = (Secode.Height - Secode.Width) / 2 + 'px'; //调整锚点的Top适配
                contentDOM.style.left = 0 - (Secode.Height - Secode.Width) / 2 + 'px'; //调整锚点的Left适配
                contentDOM.style.transform = 'rotate(90deg)'; //让该元素顺时针旋转90度，使其横屏展示

                Secode.Rotate = true; // 设置已选转
                Secode.RotateMode = 1; // 设置旋转模式为逆时针旋转90度
            }
            else {
                //如果目标非横屏，就让页面不执行旋转
                contentDOM.style.width = Secode.Width + 'px';  //设置该元素的宽等于屏高
                contentDOM.style.height = Secode.Height + 'px'; //设置该元素的高等于屏宽
                contentDOM.style.top = 0 + 'px'; //调整锚点的Top适配
                contentDOM.style.left = 0 + 'px'; //调整锚点的Left适配
                contentDOM.style.transform = 'none'; //让该元素不执行旋转

                Secode.Rotate = false; // 设置非旋转
                Secode.RotateMode = -1; // 设置旋转模式为非旋转
            }
        }
        else {
            //屏幕宽度 >= 屏幕高度时，即横屏
            if (horizontal) {
                //如果目标为横屏，就让页面不执行旋转
                contentDOM.style.width = Secode.Width + 'px';  //设置该元素的宽等于屏高
                contentDOM.style.height = Secode.Height + 'px'; //设置该元素的高等于屏宽
                contentDOM.style.top = 0 + 'px'; //调整锚点的Top适配
                contentDOM.style.left = 0 + 'px'; //调整锚点的Left适配
                contentDOM.style.transform = 'none'; //让该元素不执行旋转

                Secode.Rotate = false; // 设置非旋转
                Secode.RotateMode = -1; // 设置旋转模式为非旋转
            }
            else {
                //如果目标非横屏，就让页面竖屏显示
                contentDOM.style.width = Secode.Height + 'px';  //设置该元素的宽等于屏高
                contentDOM.style.height = Secode.Width + 'px'; //设置该元素的高等于屏宽
                contentDOM.style.top = (Secode.Height - Secode.Width) / 2 + 'px'; //调整锚点的Top适配
                contentDOM.style.left = 0 - (Secode.Height - Secode.Width) / 2 + 'px'; //调整锚点的Left适配
                contentDOM.style.transform = 'rotate(-90deg)'; //让该元素逆时针旋转90度，使其竖屏展示

                Secode.Rotate = true; // 设置已选转
                Secode.RotateMode = -1; // 设置旋转模式为逆时针旋转90度
            }
        }
    },

    /**
     * 获取旋转后的位置信息
     * @param {any} pos 位置信息[x,y]
     * @returns {any} 旋转后的位置信息[x,y]
     */
    GetRotatePos: function (pos) {
        if (!Secode.Rotate) return pos;

        var x = pos[0];
        var y = pos[1];

        // 变量记录
        var rx = x;
        var ry = y;

        // 判断是否执行了旋转
        if (Secode.Rotate) {
            if (Secode.RotateMode === 1) {
                //竖屏转横屏

                // 坐标中心偏移
                rx = x - Secode.Width / 2;
                ry = Secode.Height / 2 - y;

                // 矩阵旋转
                var temp = rx;
                rx = -ry;
                ry = temp;

                // 坐标中心回归
                rx = rx + Secode.Height / 2;
                ry = Secode.Width / 2 - ry;
            }
            else if (Secode.RotateMode === -1) {
                //横屏转竖屏

                // 坐标中心偏移
                rx = x - Secode.Width / 2;
                ry = Secode.Height / 2 - y;

                // 矩阵旋转
                var temp2 = ry;
                ry = -rx;
                rx = temp2;

                // 坐标中心回归
                rx = rx + Secode.Height / 2;
                ry = Secode.Width / 2 - ry;
            }
        }

        // 变量复原
        x = rx;
        y = ry;

        return [x, y];
    },

    /**
     * 释放游戏屏幕
     */
    RemoveGameScreen: function () {
        document.body.removeChild(Secode.GameDom);
    }
};

Secode.InitGameScreen();