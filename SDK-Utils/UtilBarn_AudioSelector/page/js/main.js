var Manager = {
    /**
     * 接口方法集
     */
    Functions: {
        /**
         * 获取到文件信息回调,带参数info{Name,Data}
         * @param {Object} info 文件信息
         */
        GetInfo: function (info) {
            var data = {
                Type: "GetInfo",
                Datas: [info]
            };
            Manager.PostMessage(data);
        },
        /**
         * 文件上传NDR过程,带两个参数msg, step
         * @param {String} msg 步骤提示信息
         * @param {Number} step 步骤
         */
        Progress: function (msg, step) {
            var data = {
                Type: "Progress",
                Datas: [msg, step]
            };
            Manager.PostMessage(data);
        },
        /**
         * 成功回调,带参数info{Name,Type,Guid,Url}
         * @param {Object} info 数据信息
         */
        Success: function (info) {
            var data = {
                Type: "Success",
                Datas: [info]
            };
            Manager.PostMessage(data);
        },
        /**
         * 出错回调
         * @param {Object} err 失败信息
         */
        Error: function (err) {
            var data = {
                Type: "Error",
                Datas: [err]
            };
            Manager.PostMessage(data);
        },
        /**
         * 重置回调
         */
        Reset: function () {
            var data = {
                Type: "Reset",
                Datas: []
            };
            Manager.PostMessage(data);
        },
        /**
         * 关闭组件
         */
        Cancel: function () {
            var data = {
                Type: "Cancel",
                Datas: []
            };
            Manager.PostMessage(data);
        },

        /**
         * 前往在线页
         */
        Online: function () {
            window.location.hash = "#!/Online";
        },
        /**
         * 前往录音页
         */
        Record: function () {
            window.location.hash = "#!/Record";
        },
        /**
         * 读取本地音频
         */
        Local: function () {
            Manager.SelectLocalAudio();
        },
        /**
         * 返回选择页
         */
        Back: function () {
            window.location.hash = "#!/Home";
        },
        /**
         * 确认按钮
         */
        OK: function () {
            if (DataFunction.GetPage() === "Record") {
                DataFunction.Record.OK();
            }
            else if (DataFunction.GetPage() === "Online") {
                DataFunction.Online.OK();
            }
        }
    },

    /**
     * 向上一窗口提交数据
     * @param {Object} data 数据
     */
    PostMessage: function (data) {
        if (window.parent && window.parent.postMessage) {
            try {
                window.parent.postMessage(data, "*");
            } catch (e) {
                console.log(e);
            }
        }
    },

    /**
     * 提交数据到NDR
     * @param {Object} info 文件数据 info{Name,Data}
     */
    PostToNDR: function (info) {
        function NameCheck(info, success, error) {
            if (!info.Name) {
                if (error) error("Illegal File Name");
                return;
            }

            var list = new Array("&", " ", "#", ":", "?", "!", "/", "\\");
            for (var i = 0; i < list.length; i++) {
                var key = list[i];
                if (info.Name.indexOf(key) >= 0) {
                    if (error) error("Illegal File Name");
                    return;
                }
            }
            if (success) success(info);
        }

        var func = Manager.Functions;
        NameCheck(info, function () {
            if (func.GetInfo) func.GetInfo(info);
            UtilBarn.NDR.Post(info.Data, info.Name, func.Progress, func.Success, func.Error);
        }, func.Error);
    },

    /**
     * 选取本地音频
     * @param {Function} getinfo 文件选择回调
     * @param {Function} error 出错回调
     */
    SelectLocalAudio: function () {
        var input = document.createElement("input");
        input.type = "File";
        input.accept = "audio/*";
        input.onchange = function () {
            if (!input.files || !input.files[0]) {
                Manager.Functions.Error("None Select");
                return;
            }
            var file = input.files[0];
            UtilBarn.NDR.GetFileData(file, function (info) {
                Manager.PostToNDR(info);
            });
        };
        input.click();
    },

    /**
     * 录音页方法集
     */
    Record: {
        /**
         * 录音或播放当前时间
         */
        Time: 0,

        /**
         * 录音页当前状态
         */
        State: "Idle",

        /**
         * 是否支持录音提示
         */
        SupportHint: null,

        /**
         * 录音对象
         */
        Recorder: null,

        /**
         * 录音成功数据String
         */
        Datas: null,

        /**
         * 录音成功配置集合
         */
        Set: null,

        /**
         * 播放音频对象
         */
        Audio: null,

        /**
         * 波形图像对象
         */
        Wave: null,

        /**
         * 时间、level数据集合
         */
        Map: null,

        /**
         * 获取时间String
         * @returns {String} 时间String
         */
        GetTime: function () {
            var time = Manager.Record.Time;
            time = Math.round(time / 1000);
            var m = Math.floor(time / 60);
            var s = time - m * 60;
            return (m > 9 ? m : "0" + m) + ":" + (s > 9 ? s : "0" + s);
        },

        /**
         * 获取时间关键字对应level
         * @param {Number} key 时间关键字 int
         * @returns {String} 时间String
         */
        GetMapValue: function (key) {
            var map = DataFunction.Record.Map;
            var keys = Object.keys(map);
            var length = keys.length;
            var index1 = 0;
            var index2 = length - 1;
            var index3 = Math.round((index1 + index2) / 2);
            var key1 = parseInt(keys[index1]);
            var key2 = parseInt(keys[index2]);
            var key3 = parseInt(keys[index3]);
            if (key1 === key) return map[key1];
            if (key2 === key) return map[key2];

            while (index1 !== index2) {
                index3 = Math.round((index1 + index2) / 2);
                key3 = parseInt(keys[index3]);
                if (index3 === index2 || index3 === index1) {
                    key1 = parseInt(keys[index1]);
                    key2 = parseInt(keys[index2]);
                    return (map[key1] + map[key2]) / 2;
                }
                if (key3 === key) return map[key3];
                if (key3 > key) index2 = index3;
                if (key3 < key) index1 = index3;
            }
            return map[key3];
        },

        /**
         * 开始录音
         */
        Start: function () {
            var record = DataFunction.Record;
            if (record.SupportHint && record.SupportHint.length > 0) {
                alert("当前不支持录音功能:" + record.SupportHint);
                return;
            }

            record.Re_record();

            var map = new Map();
            record.Map = map;

            var type = "mp3";
            var bit = 16;
            var sample = 16000;
            var wave;
            rec = Recorder({
                type: type,
                bitRate: bit,
                sampleRate: sample,
                onProcess: function (buffers, level, time, sampleRate) {
                    record.Time = time;
                    DataFunction.Apply();
                    map["" + time] = level;
                    wave.input(buffers[buffers.length - 1], level, sample);
                }
            });
            rec.open(function () {
                wave = Recorder.WaveView({ elem: ".RecordView" });
                record.Wave = wave;
                rec.start();
                record.State = "Recording";
            }, function (e, isUserNotAllow) {
                record.SupportHint = (isUserNotAllow ? "UserNotAllow，" : "") + "打开失败：" + e;
                record.Start();
                return;
            });
            record.Recorder = rec;
        },

        /**
         * 结束录音
         */
        Start_Stop: function () {
            var record = DataFunction.Record;
            if (record.State !== "Recording") return;
            var rec = record.Recorder;
            if (!rec) return;
            rec.stop(function (blob, time) {
                UtilBarn.NDR.BlobToBase64(blob, function (datas) {
                    record.Datas = datas;
                });
                record.Time = 0;
                record.Set = rec.set;
                DataFunction.Apply();
                rec.close();
            }, function (s) {
                console.log("失败：" + s);
            });
            record.State = "Idle";
        },

        /**
         * 播放录音
         */
        Play: function () {
            var record = DataFunction.Record;
            if (!record.Datas) return;
            if (!record.Audio) {
                var dom = document.createElement("audio");
                dom.src = record.Datas;
                dom.onended = function () {
                    record.Play_Stop();
                };
                dom.ontimeupdate = function () {
                    record.Time = Math.round(dom.currentTime * 1000);
                    DataFunction.Apply();
                    record.Wave.input(new Array(record.Set.bufferSize), record.GetMapValue(record.Time), record.Set.sampleRate);
                };
                record.Audio = dom;
            }
            record.Audio.play();
            record.State = "Playing";
        },

        /**
         * 结束播放录音
         */
        Play_Stop: function () {
            var record = DataFunction.Record;
            if (record.State !== "Playing") return;
            var dom = record.Audio;
            dom.pause();
            dom.currentTime = 0;
            record.Time = 0;
            record.State = "Idle";
        },

        /**
         * 重录
         */
        Re_record: function () {
            var record = DataFunction.Record;
            record.Start_Stop();
            record.Play_Stop();
            record.Time = 0;
            record.Recorder = null;
            record.Datas = null;
            record.Set = null;
            record.Audio = null;
            record.Wave = null;
            record.Map = null;
        },

        /**
         * 下载录音
         */
        Download: function () {
            var record = DataFunction.Record;
            if (!record.Datas) return;
            var dom = document.createElement("a");
            dom.href = record.Datas;
            dom.download = "record." + record.Set.type;
            dom.click();
        },

        /**
         * 确认
         */
        OK: function () {
            var record = DataFunction.Record;
            if (!record.Datas) return;
            var info = new Object();
            info.Name = "record." + record.Set.type;
            info.Data = record.Datas;
            Manager.PostToNDR(info);
        },

        /**
         * 初始化
         */
        Init: function () {
            DataFunction.Record = Manager.Record;
            var record = DataFunction.Record;
            var functions = Datas.Functions;
            functions.Record_Start = record.Start;
            functions.Record_Start_Stop = record.Start_Stop;
            functions.Record_Play = record.Play;
            functions.Record_Play_Stop = record.Play_Stop;
            functions.Record_Download = record.Download;
            functions.Record_Re_record = record.Re_record;

            if (!Recorder) {
                record.SupportHint = "录音组件未加载";
            }
        }
    },

    /**
     * 在线页方法集
     */
    Online: {
        /**
         * 支持格式
         */
        Formats: [],

        /**
         * 三级标签栏是否打开
         */
        ThirdTabOpen: false,

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
        Size: 10,

        /**
         * 搜索到数据数
         */
        Total: 0,

        /**
         * 列表数据
         */
        ListDatas: [],

        /**
         * 无声数据
         */
        EmptyData: {
            Name: "无声音",
            Type: "audio/mp3",
            Guid: "",
            Url: ""
        },

        /**
         * 选中数据
         */
        Datas: null,

        /**
         * 播放音频使用的Audio
         */
        Audio: null,

        /**
         * 音频是否在播放
         */
        OnPlay: false,

        /**
         * 是否在搜索音频
         */
        OnSearch: true,

        /**
         * 获取时间String
         * @param {Number} time 时间值
         * @returns {String} 时间String
         */
        GetTime: function (time) {
            if (time === undefined || time === null) return " __:__ ";
            time = Math.round(time / 1000);
            var m = Math.floor(time / 60);
            var s = time - m * 60;
            return " " + (m > 9 ? m : "0" + m) + ":" + (s > 9 ? s : "0" + s) + " ";
        },

        /**
         * 选择一级标签栏
         * @param {Number} index 序号
         */
        SelectFirstTab: function (index) {
            var online = Datas.Online;
            if (index >= online.FirstTab.Datas.length || index < 0) return;
            online.FirstTab.Select = index;
            online.SecondTab.Datas = [];
            online.ThirdTab.Datas = [];
            online.SecondTab.Select = -1;
            online.ThirdTab.Select = -1;
            var tag = online.FirstTab.Datas[index].Guid;
            UtilBarn.FrontendLib.GetSortTree(tag, function (data) {
                var keys = Object.keys(data);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var value = data[key];
                    var obj = {
                        "Name": value.name,
                        "Guid": value.id
                    };
                    online.SecondTab.Datas.push(obj);
                }
                DataFunction.Apply();
                DataFunction.Online.Search();
            }, Datas.Functions.Error);
        },

        /**
         * 选择二级标签栏
         * @param {Number} index 序号
         */
        SelectSecondTab: function (index) {
            var online = Datas.Online;
            if (index >= online.SecondTab.Datas.length || index < -1) return;
            online.SecondTab.Select = index;
            online.ThirdTab.Datas = [];
            online.ThirdTab.Select = -1;
            if (index < 0) {
                DataFunction.Online.Search();
                return;
            }
            var tag = online.SecondTab.Datas[index].Guid;
            UtilBarn.FrontendLib.GetSortTree(tag, function (data) {
                var keys = Object.keys(data);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var value = data[key];
                    var obj = {
                        "Name": value.name,
                        "Guid": value.id
                    };
                    online.ThirdTab.Datas.push(obj);
                }
                DataFunction.Apply();
                DataFunction.Online.Search();
            }, Datas.Functions.Error);
        },

        /**
         * 选择三级标签栏
         * @param {Number} index 序号
         */
        SelectThirdTab: function (index) {
            var online = Datas.Online;
            if (index >= online.SecondTab.Datas.length || index < -1) return;
            online.ThirdTab.Select = index;
            DataFunction.Online.Search();
        },

        /**
         * 选择数据
         * @param {Object} data 数据对象
         */
        SelectData: function (data) {
            var online = DataFunction.Online;
            if (online.Datas.Guid === data.Guid) return;
            online.Datas = data;
            if (!data.Url || data.Url.length < 1) {
                online.Stop();
            }
            else if (online.OnPlay) {
                online.Play(data);
            }
        },

        /**
         * 搜索
         * @param {Boolean} append 是否拓展数据
         */
        Search: function (append) {
            if (append && DataFunction.Online.OnSearch) return;
            DataFunction.Online.OnSearch = true;

            function getduration(data) {
                data.CurrentTime = 0;
                if (data.SourceInfo && data.SourceInfo.Audio) {
                    var list = JSON.parse(data.SourceInfo.Audio);
                    var info = list[0];
                    data.TotalTime = info.Duration;
                }
                data.GetPercent = function () {
                    if (!data.TotalTime) return 0;
                    return Math.round(data.CurrentTime / data.TotalTime * 100);
                };
                //var dom = document.createElement("audio");
                //dom.src = data.Url;
                //dom.load();
                //data.TotalTime = 0;
                //data.CurrentTime = 0;
                //dom.oncanplay = function () {
                //    data.TotalTime = Math.round(dom.duration * 1000);
                //    data.GetPercent = function () {
                //        return Math.round(data.CurrentTime / data.TotalTime * 100);
                //    };
                //    DataFunction.Apply();
                //};
            }

            var total = 0;

            function count() {
                total -= 1;
                if (total === 0) {
                    DataFunction.Online.OnSearch = false;
                    if (!DataFunction.Online.ListDatas || DataFunction.Online.ListDatas.length <= 20) {
                        DataFunction.Online.Search(true);
                    }
                }
            }

            var online = Datas.Online;
            var tag = "";
            if (online.ThirdTab.Select >= 0) {
                tag = online.ThirdTab.Datas[online.ThirdTab.Select].Guid;
            }
            else if (online.SecondTab.Select >= 0) {
                tag = online.SecondTab.Datas[online.SecondTab.Select].Guid;
            }
            else {
                tag = online.FirstTab.Datas[online.FirstTab.Select].Guid;
            }

            var key = DataFunction.Online.Keyword;

            if (append) {
                DataFunction.Online.Page += 1;
            }
            else {
                DataFunction.Online.Page = 1;
                DataFunction.Online.ListDatas = [];
                setTimeout(function () {
                    DataFunction.Apply();
                }, 1000);
            }

            var page = DataFunction.Online.Page;
            var size = DataFunction.Online.Size;

            UtilBarn.FrontendLib.GetResources(tag, key, page, size, function (data) {
                DataFunction.Online.Total = data.total_count;

                data = data.items;
                console.log(data);
                var keys = Object.keys(data);

                total = keys.length;

                function handle(key, value) {
                    UtilBarn.NDR.Get(value.id, function (data) {
                        data.Name = value.title;
                        DataFunction.Online.ListDatas.push(data);
                        getduration(data);
                        count();
                    }, count, DataFunction.Online.Formats);
                }

                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var value = data[key];
                    if (!value.id) {
                        count();
                        continue;
                    }
                    handle(key, value);
                }
            }, function (e) {
                if (Datas.Functions.Error) {
                    Datas.Functions.Error(e);
                }
                DataFunction.Online.OnSearch = false;
            });
        },

        /**
         * 播放音频
         * @param {Object} data 数据对象
         */
        Play: function (data) {
            if (!data || !data.Url || data.Url.length < 1) return;
            var online = DataFunction.Online;
            online.SelectData(data);
            if (!online.Audio) {
                var dom = document.createElement("audio");
                dom.src = data.Url;
                dom.crossOrigin = "";
                dom.onended = function () {
                    online.Stop();
                    dom.currentTime = 0;
                    DataFunction.Apply();
                };
                dom.ontimeupdate = function () {
                    online.Datas.CurrentTime = Math.round(dom.currentTime * 1000);
                    DataFunction.Apply();
                };
                online.Audio = dom;
            }
            if (online.OnPlay && online.Audio.src === data.Url) return;
            online.Stop();

            online.Audio.src = data.Url;

            if (data.CurrentTime > 0) {
                online.Audio.currentTime = data.CurrentTime / 1000;
            }

            online.Audio.play();
            online.OnPlay = true;
        },

        /**
         * 结束播放音频
         * @param {Object} data 数据对象
         */
        Stop: function () {
            var online = DataFunction.Online;
            if (!online.OnPlay) return;
            var dom = online.Audio;
            dom.pause();
            online.OnPlay = false;
        },

        /**
         * 确认
         */
        OK: function () {
            var data = Manager.Online.Datas;
            var info = {
                Name: data.Name,
                Type: data.Type,
                Guid: data.Guid,
                Url: data.Url
            };
            Manager.Functions.GetInfo(info);
            Manager.Functions.Success(info);
        },

        /**
         * 初始化
         */
        Init: function () {
            DataFunction.Online = Manager.Online;
            var online = DataFunction.Online;
            online.Datas = online.EmptyData;

            if (DataFunction.Online.Formats.length === 0 && !UtilBarn.Platform.IsPC) {
                DataFunction.Online.Formats = ["mp3", "wav"];
            }

            UtilBarn.Start(function () {
                online.SelectFirstTab(0);
            });
        }
    },

    /**
     * 初始化
     */
    Init: function () {
        DataFunction.GetList = Manager.GetList;
        Datas.Functions = Manager.Functions;

        DataFunction.ScrollInit = function () {
            $(".Content").scroll(function () {
                var scrollTop = $(this).scrollTop();    			//滚动条距离顶部的高度
                var scrollHeight = $(".Content")[0].scrollHeight * 0.8;   	//当前页面的总高度
                var clientHeight = $(this).height();    			//当前可视的页面高度
                if (scrollTop > 10 && scrollTop + clientHeight >= scrollHeight) {   //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 
                    DataFunction.Online.Search(true);
                    DataFunction.Apply();
                }
            });
        };

        Manager.Record.Init();
        Manager.Online.Init();

        function messageCallBack(data) {
            data = data.data;
            if (data && data.name) {
                var name = data.name;
                var url = data.url;
                var formats = data.formats;
                if (formats && formats.length > 0) {
                    DataFunction.Online.Formats = formats;
                    return;
                }
                var index = name.lastIndexOf(".");
                if (index > 0) {
                    DataFunction.Online.Formats = name.substring(index + 1);
                    return;
                }

                index = url.lastIndexOf(".");
                if (index > 0) {
                    DataFunction.Online.Formats = url.substring(index + 1);
                    return;
                }
            }
        }

        window.addEventListener('message', messageCallBack, false);
    }
};

//UtilBarn.Language = "English";

DataFunction.Init("json/config.json", function () {
    Manager.Init();
});

// 路由配置
UtilBarnModule.config(["$routeProvider", function ($routeProvider) {
    function setRoutes(route) {
        var url = "/" + route;
        var config = {
            templateUrl: "pages/" + route.toLowerCase() + ".html"
        };
        return $routeProvider.when(url, config), $routeProvider;
    }

    var routes = [
        "Home",
        "Online",
        "Record"
    ];

    routes.forEach(function (route) {
        setRoutes(route);
    });

    $routeProvider.when("/", {
        redirectTo: "/Home"
    }).when("/404", {
        redirectTo: "/Home"
    }).otherwise({
        redirectTo: "/Home"
    });
}]);