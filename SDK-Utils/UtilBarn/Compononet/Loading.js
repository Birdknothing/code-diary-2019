// UtilBarn加载组件
(function (namespace, className) {
    var FirstIfm = null; // 第一个加载页
    var FirstUrl = "/UtilBarn/index.html";
    var SecondIfm = null; // 第二个加载页
    var SecondUrl = "/Game/index.html";
    var SrcIfm = null; // 游戏页
    var SrcUrl = null;
    var RunMode = -1; // 2:加载一 -> 游戏/编辑器 3:加载一 -> 加载二 -> 游戏
    var m_platform = 1;
    var m_app_id = null;
    var m_version = null;
    var m_accessType = null;

    var domDialog = document.getElementById("dialog");
    var domRetry = document.getElementById("retry");
    var domDialogHead = document.getElementsByClassName("header")[0];
    var domDialogTxt = document.getElementById("dialog-p");

    var errFlag = false;// 判断是否还需要弹窗

    var errHeaderCN = {
        "LOBBY/FAILTOLOAD": "是否重新加载游戏?",
        "LOBBY/NETERROR": "断网提示"
    };
    var errHeaderEN = {
        "LOBBY/FAILTOLOAD": "To reload the game?",
        "LOBBY/NETERROR": "Off network"
    };
    var errLogCN = {
        "LOBBY/ERROR": "请求失败",
        "LOBBY/GAME_REMOVE": "您访问的游戏已下架",
        "LOBBY/GAME_UNAVAILABLE": "游戏异常无法访问",
        "LOBBY/MOBILE_UNAVAILABLE": "目前暂时不支持移动端的编辑",
        "LOBBY/PC_UNAVAILABLE": "目前暂时不支持PC端的编辑",
        "LOBBY/FAILTOLOAD": "游戏加载失败，请稍后重试",
        "LOBBY/LOADING": "加载中",
        "LOBBY/NETERROR": "当前网络不可用，请检查你的网络设置"
    };
    var errLogEN = {
        "LOBBY/ERROR": "Request failed",
        "LOBBY/GAME_REMOVE": "The game has been removed",
        "LOBBY/GAME_UNAVAILABLE": "The game is unavailable",
        "LOBBY/MOBILE_UNAVAILABLE": "Mobile editing is unavailable",
        "LOBBY/PC_UNAVAILABLE": "PC editing is unavailable",
        "LOBBY/FAILTOLOAD": "Fail to load",
        "LOBBY/LOADING": "Loading",
        "LOBBY/NETERROR": "The current network is not available, please check your network settings"
    };
    var curLog = errLogCN;
    var curHeader = errHeaderCN;

    var gameTimeOut = null;// 游戏加载超时
    /**
	 * 错误弹窗
     * @param {String} type 错误类型
	 */
    function SetDialog(type) {
        if (!errFlag && domDialog.style.display === "none") {
            domDialogHead.innerText = curHeader[type] === undefined ? curHeader["LOBBY/FAILTOLOAD"] : curHeader[type];
            domDialogTxt.innerText = curLog[type];
            domDialog.style.display = "block";
        }
    }

    /**
	 * 显示子页面
     * @param {document} dom 操作的元素
	 */
    function Show(dom) {
        if (dom) {
            dom.style.display = "block";
        }
    }
	/**
	 * 隐藏子页面
     * @param {document} dom 操作的元素
	 */
    function Hide(dom) {
        if (dom) {
            dom.style.display = "none";
        }
    }
    /**
	 * 向加载页发送消息
     * @param {document} dom 操作的元素
     * @param {any} Type 发送的消息类型
     * @param {any} Datas 发送的消息
	 */
    function Send(dom, Type, Datas) {
        if (dom) {
            var data = {
                Type: Type,
                Datas: Datas
            };
            dom.contentWindow.postMessage(data, "*");
        }
    }
    /**
     * 初始化子页面
     * @param {String} url 子页面链接
     * @returns {Object} 子页面元素
     */
    function InitIfm(url) {
        iframe = document.createElement("iframe");
        iframe.setAttribute("src", url);
        iframe.setAttribute('allow', 'microphone');
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.position = "fixed";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.borderWidth = "0px";
        Hide(iframe);
        document.body.appendChild(iframe);
        return iframe;
    }

    /**
     * 获取Loading中的guid的value值
     * @param {Object} data 待遍历数据
     * @param {Object} guidObj {guid:数据}保存的对象 
     * @param {Object} guidArr guid数组 
     */
    function GetAllGuid(data, guidObj, guidArr) {
        if (data instanceof Array) {
            for (var i = 0; i < data.length; i++) {
                GetAllGuid(data[i], guidObj, guidArr);
            }
            return;
        }

        if (data.Datas) {
            GetAllGuid(data.Datas, guidObj, guidArr);
            return;
        }

        if (data.GUID) {
            guidArr.push(data.GUID);
            guidObj[data.GUID] = data;
        }
    }
    /**
     * 获取DataConfig
     */
    function GetDataConfig() {
        var timer = setInterval(function () {
            if (UtilBarn.PackageGuid) {
                UtilBarn.Resource.GetConfig("DatasConfig",
                    function (data) {
                        if (!data || !data.StaticData || !data.StaticData.Loading) {
                            // 若无Loading，加载完第一个加载页进入游戏
                            RunMode = 2;
                            Send(FirstIfm, "process", 100);
                        }
                        if (data && data.StaticData && data.StaticData.Loading) {
                            // 加载第一个->加载第二个->加载Game
                            if (RunMode === -1) {
                                RunMode = 3;
                                var guidObj = {};
                                var guidArr = [];
                                GetAllGuid(data.StaticData.Loading, guidObj, guidArr);
                                UtilBarn.NDR.GetList(guidArr, function (NDRdata) {
                                    for (var guid in NDRdata) {
                                        guidObj[guid].Value = NDRdata[guid].Url;
                                    }
                                    Send(SecondIfm, "DatasConfig", data.StaticData.Loading);
                                    Send(FirstIfm, "process", 100);
                                }, function () {
                                    Send(SecondIfm, "DatasConfig", data.StaticData.Loading);
                                    Send(FirstIfm, "process", 100);
                                });
                            }
                            else {
                                // 加载第一个->加载Editor
                                Send(FirstIfm, "process", 100);
                            }

                        }
                    },
                    function (err) {
                        console.error(err);
                        RunMode = 2;
                        Send(FirstIfm, "process", 100);
                    }
                );
                clearInterval(timer);
                clearTimeout(timeOut);
            }
        }, 200);

        var timeOut = setTimeout(function () {
            console.error("无PAKAGEGUID！");
            clearInterval(timer);
            RunMode = 2;
            Send(FirstIfm, "process", 100);
        }, 10000);
    }
    /**
     * 获取资源信息
     */
    function GetAttOfSrc() {
        var arrOfSlash = window.location.pathname.split('/');
        if (arrOfSlash[1] === 'editor') {
            UtilBarn.Mode = 3;
            RunMode = 2;
            FirstUrl = "/UtilBarn/indexEditor.html";
        }
        var str = arrOfSlash[1];
        var arrOfParam = str.split("_");
        m_app_id = arrOfParam[0];
        m_accessType = arrOfParam[1];
        if (arrOfParam.length === 3) {
            m_version = arrOfParam[2];
        }
        m_platform = UtilBarn.Platform.IsPC ? 1 : 2;
    }
    /**
     * 获取待加载资源页Url
     */
    function GetSrcUrl(callbackAfterGetPkgIdAndGameId) {
        // 中止符号
        var flag = true;
        // 获取资源URL
        function getSrcUrl(productid, version, access_type, platform, success, error) {
            if (!flag)
                return;
            var subUrl = null;
            var data = null;
            if (UtilBarn.Mode === 3) {
                // 获取编辑器URL
                subUrl = "/v1.0/api/product/product/actions/get_editor_inner_links";
                data = "new_app_id=" + productid + "&version=" + version + "&access_type=" + access_type + "&deploy_platform=" + platform;
            }
            else {
                // 获取游戏URL
                subUrl = "/v1.0/api/product/product/actions/get_game_inner_links";
                data = "new_app_id=" + productid + "&access_type=" + access_type + "&deploy_platform=" + platform;
            }
            UtilBarn.Api.MMO.MMOGet(subUrl, data, function(data) {
                if (success) success(data);
            },
            function (err) {
                if (error) error(err);
            }, true);
        }
        // 获取游戏信息
        function getGameInfo(success, error) {
            UtilBarn.MMO.GetGameInfo(UtilBarn.GameId, UtilBarn.Version, UtilBarn.Access, UtilBarn.Mode, function (data) {
                if (data) {
                    UtilBarn.ServerInfo = data;
                    // 识别pkg参数:PackageGuid
                    pkg = UtilBarn.GetQueryString("pkg");
                    if (pkg) {
                        UtilBarn.PackageGuid = pkg;
                    }
                    else {
                        UtilBarn.PackageGuid = data.pkg_resid;
                    }
                    success();
                }
                else {
                    console.error("UtilBarn.MMO.GetGameInfo 无值");
                }
            }, error);
        }
        // 获取资源URL 成功回调
        function successCallback(data) {
            if (data && data.status && data.status === 1 && data.url !== "") {
                SrcUrl = data.url;
                UtilBarn.Init(SrcUrl);// 解析url
                getGameInfo(function() {
                    callbackAfterGetPkgIdAndGameId();
                    GetDataConfig();
                });
                SrcUrl = UtilBarn.SetQueryString("UtilBarnArgs", UtilBarn.GetLoginInfo(), SrcUrl);// 传递登录信息

                clearTimeout(timeOut);
            }
            else {
                console.error("游戏未部署成功" + JSON.stringify(data));
                SetDialog("LOBBY/FAILTOLOAD");
                getSrcUrl(m_app_id, m_version, m_accessType, m_platform, successCallback, errorCallback);
            }
        }
        // 获取资源URL 失败回调
        function errorCallback(err) {
            var resJson = err.responseJSON;
            if (resJson && resJson.code) {
                SetDialog(resJson.code);
            }
            clearTimeout(timeOut);
        }
        getSrcUrl(m_app_id, m_version, m_accessType, m_platform, successCallback, errorCallback);

        var timeOut = setTimeout(function () {
            console.error("获取链接超时");
            SetDialog("LOBBY/FAILTOLOAD");
            flag = false;
        }, 10000);
    }
    /**
     * 初始化监听消息
     */
    function onMessage() {
        function messageCallBack(e) {
            var data = e.data;
            // 第一个加载页
            if (data && data.Type && data.Type === "FirstIfm") {
                // 第一个加载页加载完成
                if (data.Datas === "loaded") {
                    Send(FirstIfm, "lang", UtilBarn.Language);
                    Show(FirstIfm);
                }
                // 后续页加载完成且第一个加载页百分比动画效果完成
                if (data.Datas === "PercentFinish") {
                    Send(FirstIfm, "hide", true);
                    var tmpTimeOut = setTimeout(function () {
                        if (RunMode === 2) {
                            SrcIfm = InitIfm(SrcUrl);
                            Show(SrcIfm);
                            errFlag = true;
                        }
                        if (RunMode === 3) {
                            Show(SecondIfm);
                            SrcIfm = InitIfm(SrcUrl);
                        }
                        Hide(FirstIfm);
                    }, 1000);
                }
            }
            // 第二个加载页
            if (data && data.Type && data.Type === "SecondIfm") {
                // 主加载内容加载完成
                if (data.Datas === "PercentFinish") {
                    setTimeout(function () {
                        Hide(SecondIfm);
                        Show(SrcIfm);
                        errFlag = true;
                        clearTimeout(gameTimeOut);
                    }, 1000);
                }
                if (gameTimeOut === null) {
                    gameTimeOut = setTimeout(function () {
                        console.error("加载超时");
                        SetDialog("LOBBY/FAILTOLOAD");
                        errFlag = false;
                    }, 60000);
                }
            }
        }
        window.addEventListener("message", messageCallBack, false);
    }
    /**
     * UtilBarn加载组件
     * 用于UtilBarn平台加载页的功能
     * @author 陈彬舰(110181)
     * @version 1.0.0 (2019年8月13日)
     * @see 
     * */
    var module = {
        /**
         * 初始化
         */
        Init: function (callbackAfterGetPkgIdAndGameId) {
            onMessage();
            // 识别弹窗语言
            if (UtilBarn.Language === "English") {
                curLog = errLogEN;
                curHeader = errHeaderEN;
                domRetry.innerText = "Retry";
            }

            // 掉线处理
            window.addEventListener("offline", function (e) {
                SetDialog("LOBBY/NETERROR");
            });

            // 
            function callbackChooseLogin () {
                callbackAfterGetPkgIdAndGameId(function(){
                    FirstIfm = InitIfm(FirstUrl);
                    SecondIfm = InitIfm(SecondUrl);
                });
            }

            GetAttOfSrc();
            GetSrcUrl(callbackChooseLogin);
        },
        /**
         * 主加载内容加载进度 游戏->中转页
         * @param {Number} percent 进度占百分比
         */
        Progress: function (percent) {
            var data = {
                Type: "process",
                Datas: percent
            };
            window.parent.postMessage(data, "*");
        },
        /**
         * 转发主加载内容加载进度 中转页->游戏加载页
         * @param {Number} percent 进度占百分比
         */
        SendToLoading: function (percent) {
            Send(SecondIfm, "process", percent);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "Loading"));