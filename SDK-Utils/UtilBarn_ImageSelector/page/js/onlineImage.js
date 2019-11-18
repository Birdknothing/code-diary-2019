var OnlineImage = {
    /**
     * H5页面载入标志
     */
    HtmlPageLoadFlag: 0,

    /**
     * 搜索引擎数组
     */
    SearchEngines: [],

    /**
     * 是否搜索引擎标签打开
     */
    IsSearchEnginesTabOpen: false,

    /**
     * 当前实际的搜索引擎索引（索引到Datas数据内容）
     */
    CurrentSearchEngineIndex: 0,

    /**
     * 当前实际的搜索引擎名称
     */
    CurrentSearchEngineName: "NDR",

    /**
     * 上一次搜索标签页
     */
    PreSearchTag: "",

    /**
     * 当前搜索标签页
     */
    CurrentSearchTag: "",

    /**
     * 支持格式
     */
    Formats: [],

    /**
     * 上次搜索关键字
     */
    PreKeyword: "",

    /**
     * 搜索关键字
     */
    Keyword: "",

    /**
     * 加载页数
     */
    Page: 1,

    /**
     * 每页加载数据数
     */
    Size: 15,

    /**
     * 搜索到数据数
     */
    Total: 0,

    /**
     * 检查列表数据
     */
    ListCheckDatas: {},

    /**
     * 列表数据
     */
    ListDatas: [],

    /**
     * 搜索列表数据用来筛选剔除
     */
    ListUrls: {},

    /**
     * 无图片数据
     */
    EmptyData: {
        Name: "无图片",
        Type: "image/png",
        Guid: "",
        Url: "img/u1610.png"
    },

    /**
     * 当前选中数据
     */
    CurrentDatas: [],

    /**
     * 限制选中个数（当前只有1个）
     */
    LimitCount: 1,

    /**
     * 是否在搜索中
     */
    IsSearching: false,

    /**
     * 是否新标签搜索出结果(用来防止无搜索结果跳出来)
     */
    IsSearchResult: false,

    /**
     * 初始化
     */
    Init: function() {
        // OnlineImage.SearchEngines = Datas.Online.SearchEngines.Datas;
        OnlineImage.SetSearchEngineInfos(Datas.Online.SearchEngines.Datas);

        DataFunction.OnlineImage = Manager.OnlineImage;
        var oi = DataFunction.OnlineImage;
        var functions = Datas.Functions;
        functions.OI_Onload = oi.Onload;
        functions.OI_ScrollInit = oi.ScrollInit;
        functions.OI_OnSearchEngineClick = oi.OnSearchEngineClick;
        functions.OI_OnNgReapeatSearchEngineFinished = oi.OnNgReapeatSearchEngineFinished;
        functions.OI_OnNgReapeatSearchEngineUpdate = oi.OnNgReapeatSearchEngineUpdate;
        functions.OI_GetSearchEngineDisplay = oi.GetSearchEngineDisplay;
        functions.OI_Search = oi.Search;
        functions.OI_OnSearch = oi.OnSearch;
        functions.OI_SelectFirstTab = oi.SelectFirstTab;
        functions.OI_OnNgReapeatFirstTabFinished = oi.OnNgReapeatFirstTabFinished;
        functions.OI_OnNgReapeatSearchListFinished = oi.OnNgReapeatSearchListFinished;
        functions.OI_OnSelectData = oi.OnSelectData;
        functions.OI_GetSearchEngine = oi.GetSearchEngine;
        functions.OI_OnInputBlur = oi.OnInputBlur;
        functions.OI_GetItemIconClass = oi.GetItemIconClass;
        functions.OI_OnImageLoadError = oi.OnImageLoadError;
        functions.ExitOnline = oi.ExitOnline;
        functions.EnterCrop = oi.EnterCrop;

        OnlineImage.CalculatePageSize();
    },

    /**
     * 重置
     */
    Reset: function() {
        OnlineImage.HtmlPageLoadFlag = 0;
        // OnlineImage.SearchEngines = [];
        OnlineImage.SetSearchEngineInfos(Datas.Online.SearchEngines.Datas);
        OnlineImage.IsSearchEnginesTabOpen = false;
        OnlineImage.CurrentSearchEngineIndex = 0;
        OnlineImage.CurrentSearchEngineName = "NDR";
        OnlineImage.PreSearchTag = "";
        OnlineImage.CurrentSearchTag = "";
        OnlineImage.PreKeyword = "";
        OnlineImage.Keyword = "";
        OnlineImage.Page = 0;
        OnlineImage.Total = 0;
        OnlineImage.ListCheckDatas = {};
        OnlineImage.ListDatas = [];
        OnlineImage.ResetSelectDatas();
        OnlineImage.IsSearchResult = false;
    },

    /**
     * 设置支持的图片格式
     */
    SetFormats: function(formats) {
        if (!Utils.IsArray(formats) || formats.length == 0 || (formats.length > 0 && formats.indexOf("*") > -1)) {
            OnlineImage.Formats = [];
            return;
        }

        OnlineImage.Formats = [];
        for (let i = 0, len = formats.length; i < len; i++) {
            switch (formats[i]) {
                case "bmp":
                case "png":
                case "gif":
                case "jpg":
                case "jpeg":
                    OnlineImage.Formats.push(formats[i]);
                    break;
            }
        }
    },

    /**
     * 设置限制图片个数     
     */
    SetLimitCount: function(limit) {
        if (Utils.IsNumber(limit) && limit > 1)
            OnlineImage.LimitCount = parseInt(limit);
    },

    /**
     * 滚动
     */
    Scroll: function(scope) {
        var tempThis = scope || $(".oi_content");
        var scrollTop = tempThis.scrollTop(); //滚动条距离顶部的高度
        var scrollHeight = tempThis[0].scrollHeight * 0.8; //当前页面的总高度
        var clientHeight = tempThis.height(); //当前可视的页面高度
        // console.log(Utils.StringFormat("scrollTop:{0}, scrollHeight:{1}, clientHeight:{2}", scrollTop, scrollHeight, clientHeight));
        if (scrollTop > 10 && scrollTop + clientHeight >= scrollHeight) { //距离顶部+当前高度 >=文档总高度 即代表滑动到底部                             
            OnlineImage.Search(true);
            DataFunction.Apply();
        }
    },

    /**
     * 初始化滚动
     */
    ScrollInit: function() {
        $(".oi_content").scroll(function() {
            // var tempThis = $(this);
            // var scrollTop = tempThis.scrollTop(); //滚动条距离顶部的高度
            // var scrollHeight = tempThis[0].scrollHeight * 0.8; //当前页面的总高度
            // var clientHeight = tempThis.height(); //当前可视的页面高度
            // if (scrollTop > 10 && scrollTop + clientHeight >= scrollHeight) { //距离顶部+当前高度 >=文档总高度 即代表滑动到底部                 
            //     OnlineImage.Search(true);
            //     DataFunction.Apply();
            // }
            OnlineImage.Scroll($(this));
        });
    },

    /**
     * 界面加载完成回调     
     */
    Onload: function() {
        OnlineImage.HtmlPageLoadFlag |= 1;
        // if (OnlineImage.ListDatas.length == 0)
        //     OnlineImage.HtmlPageLoadFlag |= 4;
        OnlineImage.OnHtmlPageLoad();
    },

    /**
     * 搜索引擎加载完成回调
     */
    OnNgReapeatSearchEngineFinished: function() {
        OnlineImage.HtmlPageLoadFlag |= 2;
        OnlineImage.OnHtmlPageLoad();
    },

    /**
     * 搜索第一标签页加载完成回调
     */
    OnNgReapeatFirstTabFinished: function() {
        OnlineImage.HtmlPageLoadFlag |= 4;
        OnlineImage.OnHtmlPageLoad();
    },

    /**
     * 搜索列表加载刷新回调
     */
    OnNgReapeatSearchListFinished: function() {
        // console.log("OnNgReapeatSearchListFinished");
        Manager.ResizeChildrenPXScale(".oi_list *[name='oi_list_item']", true);
        // OnlineImage.HtmlPageLoadFlag |= 8;
        // OnlineImage.OnHtmlPageLoad();
    },

    /**
     * H5界面载入完成
     */
    OnHtmlPageLoad: function() {
        if (OnlineImage.HtmlPageLoadFlag == 7) {
            console.log("OnHtmlPageLoad");
            Manager.ResizeChildrenPXScale();
            OnlineImage.SelectFirstTab(0);
        }
    },

    /**
     * 退出
     */
    Quit: function() {
        OnlineImage.HtmlPageLoadFlag = 0;
    },

    /**
     * 计算页面加载的数据数
     */
    CalculatePageSize: function() {
        OnlineImage.Size = Math.max(OnlineImage.Size, Math.ceil(window.innerWidth / Manager.ResizeScale(254)) * Math.ceil((window.innerHeight - Manager.ResizeScale(100)) / Manager.ResizeScale(254)));
    },

    /**
     * 获取列数(需要实时获取)
     */
    GetColumnCount: function() {
        return Math.ceil(window.innerWidth / Manager.ResizeScale(254));
    },

    /**
     * 设置搜索引擎信息     
     */
    SetSearchEngineInfos: function(datas) {
        if (!Utils.IsArray(datas))
            return;

        OnlineImage.SearchEngines = [];

        let tempObj;
        for (let i = 0, len = datas.length; i < len; i++) {
            tempObj = new Object();
            tempObj.Index = i;
            tempObj.Name = datas[i].Name;
            OnlineImage.SearchEngines.push(tempObj);
            OnlineImage.ListUrls[tempObj.Name] = [];
        }
    },

    /**
     * 搜索引擎按钮选择
     */
    OnSearchEngineClick: function(index) {
        if (index < 0 || index >= OnlineImage.SearchEngines.length)
            return;

        if (index == 0) {
            OnlineImage.IsSearchEnginesTabOpen = !OnlineImage.IsSearchEnginesTabOpen;
        } else {
            let temp = OnlineImage.SearchEngines[index];
            OnlineImage.SearchEngines[index] = OnlineImage.SearchEngines[0];
            OnlineImage.SearchEngines[0] = temp;
            OnlineImage.IsSearchEnginesTabOpen = false;
        }
    },

    /**
     * 获取搜索引擎标签是否显示     
     */
    GetSearchEngineDisplay: function(index) {
        if (index == 0) {
            return "block";
        } else {
            return OnlineImage.IsSearchEnginesTabOpen ? "block" : "none";
        }
    },

    /**
     * 获取当前选中的搜索引擎
     */
    GetSelectSearchEngine: function() {
        return OnlineImage.SearchEngines.length > 0 ? OnlineImage.SearchEngines[0].Name : "";
    },

    /**
     * 获取当前实际的搜索引擎
     */
    GetActualSearchEngine: function() {
        // return Datas.Online.SearchEngines.Datas[OnlineImage.CurrentSearchEngineIndex].Name;
        return OnlineImage.CurrentSearchEngineName;
    },

    /**
     * 获取图标样式
     * (只有在NDR搜索，限制选择图片数为1，且index为0)或者(Url为空且index大于0)是才需要defalut样式
     */
    GetItemIconClass: function(data, index) {
        // return (OnlineImage.LimitCount == 1 ? (data.Url && index != 0) : data.Url) ? "" : "oi_item_default";
        return ((OnlineImage.GetActualSearchEngine() == "NDR" && OnlineImage.LimitCount == 1 && index == 0) || (!data.Url && index > 0)) ? "oi_item_default" : "";
    },

    /**
     * 输入框失去焦点事件
     */
    OnInputBlur: function() {
        Datas.Functions.InputBlur();
    },

    /**
     * 搜索按钮回调     
     */
    OnSearch: function(append) {
        let tempSearchEngine = OnlineImage.GetSelectSearchEngine();
        switch (tempSearchEngine) {
            case "NDR":
                {
                    let tempIndex = OnlineImage.SearchEngines[0].Index;
                    if (tempIndex != OnlineImage.CurrentSearchEngineIndex) {
                        // OnlineImage.ListDatas = [];
                        OnlineImage.CurrentSearchEngineIndex = tempIndex;
                        OnlineImage.CurrentSearchEngineName = tempSearchEngine;
                    }
                    OnlineImage.Search(append);
                }
                break;

            case "Baidu":
            case "Google":
                {
                    if (OnlineImage.Keyword.length == 0) {
                        // console.log("Search keywords are not empty!");
                        alert(DataFunction.GetText("GetText"));
                        return;
                    }

                    let tempIndex = OnlineImage.SearchEngines[0].Index;
                    if (tempIndex != OnlineImage.CurrentSearchEngineIndex) {
                        OnlineImage.ListDatas = [];
                        OnlineImage.CurrentSearchEngineIndex = tempIndex;
                        OnlineImage.CurrentSearchEngineName = tempSearchEngine;
                    }
                    OnlineImage.SelectFirstTab(0);
                }
                break;
        }
    },

    /**
     * 图片加载失败     
     */
    OnImageLoadError: function(index) {
        index = parseInt(index);
        if (index < 0 || index >= OnlineImage.ListDatas.length)
            return;

        OnlineImage.ListDatas.splice(index, 1);
        DataFunction.Apply();

        // console.log(Utils.StringFormat("length:{0}, size:{1}", OnlineImage.ListDatas.length, OnlineImage.Size));
        if (!OnlineImage.ListDatas || OnlineImage.ListDatas.length <= OnlineImage.Size) {
            OnlineImage.Search(true);
        } else {
            OnlineImage.Scroll();
        }
    },

    /**
     * 过滤文件名称
     * 百度到的json会带[&lt;strong&gt;|&lt;\/strong&gt;]且上传ndr需要剔除特殊字符[& #:?!/\\]
     */
    FilterBaiduFileName: function(fileName) {
        if (fileName == null || fileName.length == 0)
            return "";

        return fileName.replace(/[&lt;strong&gt;|&lt;\/strong&gt;]/g, "").replace(/[& #:?!/\\]/, "");
    },

    /**
     * 百度搜索回调     
     */
    OnBaiduSearch: function(data) {
        if (Utils.IsNullOrUndefine(data))
            return;

        let e = { w: "a", k: "b", v: "c", 1: "d", j: "e", u: "f", 2: "g", i: "h", t: "i", 3: "j", h: "k", s: "l", 4: "m", g: "n", 5: "o", r: "p", q: "q", 6: "r", f: "s", p: "t", 7: "u", e: "v", o: "w", 8: "1", d: "2", n: "3", 9: "4", c: "5", m: "6", 0: "7", b: "8", l: "9", a: "0", _z2C$q: ":", "_z&e3B": ".", AzdH3F: "/" },
            t = /([a-w\d])/g,
            n = /(_z2C\$q|_z&e3B|AzdH3F)/g;

        let uncompile = function(r) {
            if (!r)
                return "";
            let o = r.replace(n, function(t, n) { return e[n] });
            return o.replace(t, function(t, n) { return e[n] });
        };

        let uncompileURL = function(r) {
            return /^(http|https)/.test(r) ? r : uncompile(r);
        };

        let tempData, tempUrl;
        let tempJsonData = data.data;
        let tempLength = OnlineImage.ListDatas.length;
        for (let i = 0, len = tempJsonData.length; i < len; i++) {
            tempUrl = uncompileURL(tempJsonData[i].objURL);
            if (tempUrl.indexOf(".") == -1 || OnlineImage.ListUrls[OnlineImage.CurrentSearchEngineName].indexOf(tempUrl) > -1)
                continue;
            tempData = new Object();
            tempData.Url = tempUrl;
            tempData.Name = OnlineImage.FilterBaiduFileName(tempJsonData[i].fromPageTitle);
            tempData.Width = tempJsonData[i].width;
            tempData.height = tempJsonData[i].height;
            OnlineImage.ListDatas.push(tempData);
            OnlineImage.ListUrls[OnlineImage.CurrentSearchEngineName].push(tempUrl);
        }

        OnlineImage.Total = OnlineImage.ListDatas.length;
        DataFunction.Apply();
        OnlineImage.IsSearching = false;

        if (OnlineImage.Total - tempLength <= OnlineImage.GetColumnCount())
            OnlineImage.Scroll();
    },

    /**
     * 百度搜索
     * 由于客户端无法跨域处理，需要服务端提供支持
     */
    BaiduSearch: function(tag) {
        if (Utils.IsNullOrUndefine(tag))
            return;

        let tempUrl = Utils.StringFormat(tag, OnlineImage.Keyword, OnlineImage.Keyword, OnlineImage.Page, OnlineImage.Size);
        // console.log("tempUrl:" + tempUrl);  

        let success = function(data) {
            OnlineImage.OnBaiduSearch(data);
        };

        let error = function(err) {
            console.log(err);
            OnlineImage.IsSearching = false;
        };

        $.ajax({
            type: "get",
            url: tempUrl,
            async: true,
            crossDomain: true,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "OnlineImage.OnBaiduSearch", //"cb",
            success: function(data) {
                if (success) success(data);
            },
            error: function(err) {
                if (error) error(err);
            }
        });
    },

    /**
     * 谷歌搜索回调     
     */
    OnGoogleSearch: function(data) {
        console.log(data);
    },

    /**
     * 谷歌搜索
     */
    GoogleSearch: function(tag) {
        if (Utils.IsNullOrUndefine(tag))
            return;

        let tempUrl = Utils.StringFormat(tag, OnlineImage.Keyword, OnlineImage.Page, OnlineImage.Size);

        let success = function(data) {
            OnlineImage.OnGoogleSearch(data);
        };

        let error = function(err) {
            console.log(err);
            OnlineImage.IsSearching = false;
        };

        $.ajax({
            type: "get",
            url: tempUrl,
            async: true,
            crossDomain: true,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "OnlineImage.OnGoogleSearch",
            // jsonpCallback: "cb",
            success: function(data) {
                if (success) success(data);
            },
            error: function(err) {
                if (error) error(err);
            }
        });

        /*
        let tempUrl = Utils.StringFormat(tag, OnlineImage.Keyword, OnlineImage.Page, OnlineImage.Size);
        let tempIframe = document.getElementById("google_iframe");
        if (tempIframe == null) {
            tempIframe = document.createElement("iframe");
            tempIframe.id = "google_iframe";
            tempIframe.onload = function() {
                console.log($(tempIframe));
                console.log(tempIframe.domain);
            };
            document.body.appendChild(tempIframe);
        }
        tempIframe.src = tempUrl;
        console.log($(tempIframe));
        */
    },

    /**
     * 搜索
     */
    Search: function(append) {
        if (append && OnlineImage.IsSearching) return;

        let online = Datas.Online.SearchEngines.Datas[OnlineImage.CurrentSearchEngineIndex];
        OnlineImage.CurrentSearchTag = online.FirstTab.Datas[online.FirstTab.Select].Guid;

        let key = OnlineImage.Keyword;

        if (!append) {
            if (OnlineImage.PreSearchTag === OnlineImage.CurrentSearchTag && key === OnlineImage.PreKeyword) {
                return;
            } else {
                OnlineImage.PreSearchTag = OnlineImage.CurrentSearchTag;
                OnlineImage.PreKeyword = key;
            }
        }

        OnlineImage.IsSearching = true;

        if (append) {
            OnlineImage.Page++;
        } else {
            OnlineImage.Page = 1;
            OnlineImage.IsSearchResult = false;
            OnlineImage.ListCheckDatas = {};
            OnlineImage.ListDatas = [];
            setTimeout(function() {
                DataFunction.Apply();
            }, 1000);
        }

        let page = OnlineImage.Page;
        let size = OnlineImage.Size;

        let tempSearchEngine = OnlineImage.GetActualSearchEngine();
        switch (tempSearchEngine) {
            case "NDR":
                {
                    let total = 0;

                    function count() {
                        total--;
                        if (total === 0) {
                            OnlineImage.IsSearching = false;
                            if (!OnlineImage.ListDatas || OnlineImage.ListDatas.length <= OnlineImage.Size) {
                                OnlineImage.Search(true);
                            } else {
                                OnlineImage.Scroll();
                            }
                        }
                    }

                    let tempTag = OnlineImage.CurrentSearchTag;
                    UtilBarn.FrontendLib.GetResources(OnlineImage.CurrentSearchTag, key, page, size, function(data) {
                        if (tempTag !== OnlineImage.CurrentSearchTag)
                            return;

                        OnlineImage.IsSearchResult = true;

                        if (!append && OnlineImage.LimitCount == 1 && data.total_count > 0) //如果切换新标签且只能选1个且有数据，默认加一个空数据
                            OnlineImage.ListDatas.push(OnlineImage.EmptyData);

                        OnlineImage.Total = data.total_count + 1; //加一个空数据

                        data = data.items;
                        // console.log(data);
                        let keys = Object.keys(data);

                        total = keys.length;

                        for (let i = 0; i < keys.length; i++) {
                            // console.log(data);
                            let key = keys[i];
                            let value = data[key];
                            if (!value.id) {
                                count();
                                continue;
                            }
                            if (!Utils.IsBoolean(OnlineImage.ListCheckDatas[value.id]))
                                OnlineImage.ListCheckDatas[value.id] = false;

                            let tempId = value.id;
                            UtilBarn.NDR.Get(value.id, function(data) {
                                if (tempTag !== OnlineImage.CurrentSearchTag)
                                    return;

                                if (OnlineImage.ListCheckDatas[tempId] === false) {
                                    OnlineImage.ListCheckDatas[tempId] = true;
                                    data.Name = value.title;
                                    OnlineImage.ListDatas.push(data);
                                }
                                count();
                            }, count, OnlineImage.Formats);
                        }
                    }, function(e) {
                        if (Datas.Functions.Error) {
                            Datas.Functions.Error(e);
                        }
                        OnlineImage.IsSearching = false;
                    });
                }
                break;

            case "Baidu":
                {
                    if (!append)
                        OnlineImage.ListUrls[tempSearchEngine] = {};
                    OnlineImage.BaiduSearch(OnlineImage.CurrentSearchTag);
                }
                break;

            case "Google":
                {
                    if (!append)
                        OnlineImage.ListUrls[tempSearchEngine] = {};
                    OnlineImage.GoogleSearch(OnlineImage.CurrentSearchTag);
                }
                break;
        }
    },

    /**
     * 选中一级标签（图片分类）
     */
    SelectFirstTab: function(index) {
        let online = Datas.Online.SearchEngines.Datas[OnlineImage.CurrentSearchEngineIndex];
        if (index >= online.FirstTab.Datas.length || index < 0) return;
        OnlineImage.ResetSelectDatas();
        online.FirstTab.Select = index;
        let tag = online.FirstTab.Datas[index].Guid;
        let tempSearchEngine = OnlineImage.GetActualSearchEngine();
        switch (tempSearchEngine) {
            case "NDR":
                {
                    UtilBarn.FrontendLib.GetSortTree(tag, function(data) {
                        /*
                        //更新二级标签栏，图片控件暂时只有一级标签栏
                        let keys = Object.keys(data);
                        for (let i = 0; i < keys.length; i++) {
                            let key = keys[i];
                            let value = data[key];
                            let obj = {
                                "Name": value.name,
                                "Guid": value.id
                            };
                            online.SecondTab.Datas.push(obj);
                        }
                        */
                        DataFunction.Apply();
                        OnlineImage.Search();
                    }, Datas.Functions.Error);
                }
                break;

            case "Baidu":
                {
                    OnlineImage.BaiduSearch(tag);
                }
                break;

            case "Google":
                {
                    OnlineImage.GoogleSearch(tag);
                }
                break;
        }
    },

    /**
     * 选择数据
     */
    OnSelectData: function(data) {
        if (OnlineImage.CurrentDatas.length > 0) {
            let index = OnlineImage.CurrentDatas.indexOf(data);
            if (index > -1) {
                OnlineImage.CurrentDatas[index].Index = -1;
                OnlineImage.CurrentDatas.splice(index, 1);
                for (let len = OnlineImage.CurrentDatas.length; index < len; index++) {
                    OnlineImage.CurrentDatas[index].Index = index + 1;
                }
            } else {
                if (OnlineImage.CurrentDatas.length < OnlineImage.LimitCount) {
                    OnlineImage.CurrentDatas.push(data);
                    data.Index = OnlineImage.CurrentDatas.length;
                }
            }
        } else {
            if (OnlineImage.CurrentDatas.length < OnlineImage.LimitCount) {
                OnlineImage.CurrentDatas.push(data);
                data.Index = OnlineImage.CurrentDatas.length;
            }
        }
    },

    /**
     * 重置选中数据(需要在跳转或者切换标签的时候执行)
     */
    ResetSelectDatas: function() {
        if (OnlineImage.CurrentDatas.length == 0)
            return;

        for (let i = 0, len = OnlineImage.CurrentDatas.length; i < len; i++) {
            OnlineImage.CurrentDatas[i].Index = -1;
        }

        OnlineImage.CurrentDatas = [];
    },

    /**
     * 退出在线图片界面
     */
    ExitOnline: function() {
        OnlineImage.Reset();
        Datas.Functions.Back();
    },

    /**
     * 进入裁剪页面
     */
    EnterCrop: function() {
        if (OnlineImage.CurrentDatas != null && OnlineImage.CurrentDatas.length > 0) {
            //当前只有一项时的特殊处理
            if (OnlineImage.LimitCount == 1 && OnlineImage.CurrentDatas.length == 1 && OnlineImage.CurrentDatas[0] === OnlineImage.EmptyData) {
                if (Datas.Functions.Success) {
                    let data = OnlineImage.CurrentDatas[0];
                    let info = {
                        Name: data.Name,
                        Type: data.Type,
                        Guid: "",
                        Url: ""
                    };
                    Datas.Functions.Success(info);
                }
            } else {
                Manager.ImageCropper.ImageDatas = OnlineImage.CurrentDatas;
                OnlineImage.ResetSelectDatas();
                window.location.hash = "#!/Local";
            }
            OnlineImage.Reset();
        }
        /*
        //策划允许选中数量个数和限制个数不一致
        else {
            alert(Utils.StringFormat(DataFunction.GetText("UnselectImageTip"), OnlineImage.LimitCount));
        }
        */
    },
};