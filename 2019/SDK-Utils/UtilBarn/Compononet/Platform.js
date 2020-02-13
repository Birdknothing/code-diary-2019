// 平台模块
(function (namespace, className) {
    /**
     * 平台模块
     */
    var module = {
        IsWindowsPhone: false,
        IsSymbian: false, // 塞班手机、指示所有微软系统的移动端
        IsAndroid: false, // 安卓手机、指示所有安卓系统的移动端
        IsIPhone: false,
        IsIpad: false,
        IsIOS: false, // 苹果手机、指示所有苹果系统的移动端
        IsPC: false, // PC、指示电脑或其他非常用移动端手机类型
        IsWin64: false, // 64位Windows
        IsWin32: false, // 32位Windows
        IsMac: false, // Mac系统

        IsQQ: false, // QQ内嵌浏览器
        IsWechat: false, // 微信内嵌浏览器
        IsAlipay: false, // 支付宝内嵌浏览器
        Is99U: false, // 99U内嵌浏览器
        IsUtilBarn: false, // UtilBarn内嵌浏览器
        IsEdge: false, // Edge浏览器

        IsWebKit: false,
        IsIE: false,

        IsChrome: false,
        IsFirefox: false,
        IsSafari: false,
        IsOpera: false,
        IsUC: false
    };

    // 初始化平台模块
    function Init() {
        var ua = navigator.userAgent;
        module.IsWindowsPhone = /(?:Windows Phone)/.test(ua);
        module.IsSymbian = /(?:SymbianOS)/.test(ua) || module.IsWindowsPhone;
        module.IsAndroid = /(?:Android)/.test(ua);
        module.IsIPhone = /(?:iPhone)/.test(ua);
        module.IsIpad = /(?:iPad|PlayBook)/.test(ua);
        module.IsIOS = module.IsIpad || module.IsIPhone;
        module.IsPC = !module.IsIOS && !module.IsAndroid && !module.IsSymbian;
        module.IsMac = /(?:Macintosh|Mac OS X)/.test(ua);

        if (ua.indexOf("win32") >= 0 || ua.indexOf("wow32") >= 0) {
            module.IsWin32 = true;
        }
        
        if (ua.indexOf("win64") >= 0 || ua.indexOf("wow64") >= 0) {
            module.IsWin64 = true;
        }

        module.IsQQ = /(?:MQQBrowser|QQ)/.test(ua);
        module.IsWechat = /(?:MicroMessenger)/.test(ua);
        module.IsAlipay = /(?:Alipay)/.test(ua);
        module.Is99U = /(?:99u)/.test(ua);
        module.IsUtilBarn = /(?:UtilBarn)/.test(ua);
        module.IsEdge = /(?:Edge)/.test(ua);

        module.IsWebKit = /(?:WebKit)/.test(ua);

        if (!!window.ActiveXObject || "ActiveXObject" in window || /(?:MSIE)/.test(ua)) {
            module.IsIE = true;
        }

        module.IsChrome = /(?:Chrome|CriOS)/.test(ua);
        module.IsFirefox = /(?:Firefox)/.test(ua);
        module.IsSafari = /(?:Safari)/.test(ua);
        module.IsOpera = /(?:Opera Mini)/.test(ua);
        module.IsUC = /(?:UCWEB|UCBrowser)/.test(ua);
    }

    Init();

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "Platform"));