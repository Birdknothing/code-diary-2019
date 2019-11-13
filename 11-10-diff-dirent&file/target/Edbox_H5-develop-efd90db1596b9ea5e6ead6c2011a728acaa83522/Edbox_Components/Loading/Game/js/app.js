var DataSet = {};   // 初始化数据集
var Module = {
    // 可配置控件使用
    logoImg: "", //logo图
    bgImg: "", //背景图
    loadColor: "#6aa43d", //进度条颜色
    loadBorderColor: "#fff", //进度条边框颜色
    percentColor: "#fff", //进度百分比 字体颜色
    percentSize: 12,//进度百分比 字体大小
    percentWeight: "normal",//进度百分比 字体加粗 
    percentStyle: "normal",//进度百分比 字体斜体
    percentUnderline: "",//进度百分比 字体下划线

    tipsColor: "#fff", //tips百分比 字体颜色
    tipsSize: 50,//tips百分比 字体大小
    tipsWeight: "normal",//tips百分比 字体加粗 
    tipsStyle: "normal",//tips百分比 字体斜体
    tipsUnderline: "",//tips百分比 字体下划线

    txtData: [
        '测试1',
        '测试2'
    ],

    // 进度条
    curPercent: 50, //进度百分比
    realPercent: 0, // 实际进度百分比
    progress: {
        percentNum: document.getElementById("percent"),
        percentBar: document.getElementsByClassName("loading-percent")[0],
        SetProgress: function (n) {
            this.percentNum.innerHTML = n + "%";
            this.percentBar.style.width = n + "%";
        }
    }
};
/**
 * 添加事件监听
 */
function onMessage() {
    function messageCallBack(e) {
        var data = e.data;
        // 【编辑器】 消息连接
        if (data && data.Type && data.Type === "Connect") {
            var sendData = {
                Type: "Connect"
            };
            e.source.postMessage(sendData, "*");
        }
        // 【编辑器】 初始化
        if (data && data.Type && data.Type === "Init") {
            // todo 联调时切换
            ParseInitDatas(data.Datas[0]);
            // ParseInitDatas(data.Datas[0].Datas[1]);
            for (var key in DataSet) {
                HelperForData(DataSet[key]);
            }
        }
        // 【编辑器】 数据更新
        if (data && data.Type && data.Type === "Update") {
            HelperForData(data.Datas[0]);
        }
        // 【游戏】 接收处理DatasConfig
        if (data && data.Type && data.Type === "DatasConfig") {
            (function () {
                Module.curPercent = 0;
                var loadingDatas = data.Datas;
                for (var tmpData in loadingDatas.Datas)
                    ParseInitDatas(loadingDatas.Datas[tmpData]);
                for (var key in DataSet) {
                    HelperForData(DataSet[key]);
                }
            }());
        }
        // 【游戏】 Loading.js传来游戏的加载进度
        if (data && data.Type && data.Type === "process") {
            Module.realPercent += data.Datas;
        }
    }
    window.addEventListener("message", messageCallBack, false);
}
/**
 * 初始化进度条事件
 */
function onProgress() {
    var timer = setInterval(function () {
        if (Module.curPercent <= 99 && Module.curPercent <= Module.realPercent)
            Module.progress.SetProgress(Module.curPercent++);

        if (Module.curPercent >= 100) {
            Module.progress.SetProgress(Module.curPercent);
            SendToParent("SecondIfm", "PercentFinish");
            clearInterval(timer);
        }
    }, 100);
}
/**
 * 初始化 
 * Logo图标的长宽
 */
function InitStyle() {
    var logoItem = document.getElementsByClassName("logo-item")[0];
    logoItem.style.width = "" + 652 / 1920 * 100 + "%";
    logoItem.style.minWidth = logoItem.style.width;
    logoItem.style.maxWidth = logoItem.style.width;
    logoItem.style.marginLeft = "-" + 652 / 1920 * 100 / 2 + "%";
    setStyle();
}
/**
 * 配置六个可配置控件的Style
 */
function setStyle() {
    var logo = document.getElementById("logo");
    var bgPic = document.getElementById("bgPic");
    var bg = document.getElementById("bg");
    var percentTxt = document.getElementById("percent");
    var logoItem = document.getElementsByClassName("logo-item")[0];
    var loadingItem = document.getElementsByClassName("loading-item")[0];
    var loadingPercent = document.getElementsByClassName("loading-percent")[0];
    var loading = document.getElementsByClassName("loading")[0];
    var tips = document.getElementById('tips');
    var img = new Image();
    var imgBg = new Image();
    var zoomData = bg.offsetWidth / 1920;

    Module.logoImg = Module.logoImg === null ? "" : Module.logoImg;
    Module.bgImg = Module.bgImg === null ? "" : Module.bgImg;

    img.src = Module.logoImg;
    imgBg.src = Module.bgImg;

    img.onload = function () {
        SendToParent("SecondIfm", 1);
        logo.setAttribute('src', Module.logoImg);
    };

    imgBg.onload = function () {
        SendToParent("SecondIfm", 2);
        bgPic.setAttribute('src', Module.bgImg);
    };

    img.onerror = function () {
        SendToParent("SecondIfm", 1);
        logo.setAttribute('src', Module.logoImg);
    };

    imgBg.onerror = function () {
        SendToParent("SecondIfm", 2);
        bgPic.setAttribute('src', Module.bgImg);
    };

    loading.style.zoom = zoomData > 1 ? 1 : zoomData < 0.3 ? 0.3 : zoomData;
    loading.style.display = "block";
    loadingItem.style.borderColor = Module.loadBorderColor;
    Module.progress.SetProgress(Module.curPercent);
    loadingPercent.style.background = Module.loadColor;

    percentTxt.style.color = Module.percentColor;
    percentTxt.style.fontSize = Module.percentSize + "px";
    percentTxt.style.fontWeight = Module.percentWeight;
    percentTxt.style.fontStyle = Module.percentStyle;
    percentTxt.style.textDecoration = Module.percentUnderline;

    txtSlide(Module.txtData);
}
/**
 * 文字轮播
 * @param {Array} data tips的数组
 */
function txtSlide(data) {
    var wrapper = document.createElement('div');
    var tips = document.getElementById('tips');
    var fontSize = Module.tipsSize;
    var fontH = fontSize % 2 === 0 ? fontSize : fontSize * 1 + 1;
    var offset = fontSize >= 20 ? -fontH * 2 : -40;
    var defaultNum = fontSize >= 20 ? fontH * 2 : 40;
    var timer;
    tips.style.height = defaultNum + "px";
    tips.style.fontSize = fontSize + "px";
    tips.style.lineHeight = defaultNum + "px";
    wrapper.className = "wrapper";
    for (var i = 0; i < data.length; i++) {
        var newList = document.createElement('p');
        newList.className = "item";
        var preElement = document.createElement('pre');
        newList.appendChild(preElement);
        preElement.innerHTML = data[i];
        newList.style.color = Module.tipsColor;
        newList.style.fontSize = Module.tipsSize + "px";
        newList.style.fontWeight = Module.tipsWeight;
        newList.style.fontStyle = Module.tipsStyle;
        newList.style.textDecoration = Module.tipsUnderline;
        wrapper.appendChild(newList);
    }
    tips.innerHTML = "";
    tips.appendChild(wrapper);

    setInterval(function () {
        if (timer) {
            clearInterval(timer);
        }
        var step = 1;

        timer = setInterval(function () {
            wrapper.style.transform = 'translateY(-' + (offset + step) + 'px)';
            if (step >= defaultNum) {
                clearInterval(timer);
            }
            step++;
        }, 10);

        offset += defaultNum;

        var num = Math.floor(wrapper.offsetHeight / defaultNum);
        if (offset >= num * defaultNum) {
            offset = -defaultNum;
        }

    }, 2000);
}

/**
 * 处理编辑器初始化的数据
 * @param {Object} data 初始化数据
 */
function ParseInitDatas(data) {
    if (!data || !data.Type || !data.ID) return;

    if (!DataSet[data.ID])
        DataSet[data.ID] = data;

    if (!data.Datas) {
        HelperForData(data);
        return;
    }

    for (var i = 0; i < data.Datas.length; i++) {
        ParseInitDatas(data.Datas[i]);
    }
}

/**
 * 处理DatasConfig的数据
 * @param {Object} data 配置信息
 */
function HelperForData(data) {
    if (DataSet[data.ID]) {
        var name = data.Name;
        if (name === "Loading") {
            ParseInitDatas(data.Datas[0]);
        }
        if (name === "BorderColor") {
            Module.loadBorderColor = data.Value;
        }
        if (name === "ProcessColor") {
            Module.loadColor = data.Value;
        }
        if (name === "TitleImage") {
            Module.logoImg = data.Value;
        }
        if (name === "BackgroundImage") {
            Module.bgImg = data.Value;
        }
        if (name === "Percent") {
            Module.percentColor = data.Style.fontColor;
            Module.percentSize = data.Style.fontSize.size;
            Module.percentWeight = data.Style.fontStyle.bold ? "bold" : "normal";
            Module.percentStyle = data.Style.fontStyle.italic ? "italic" : "normal";
            Module.percentUnderline = data.Style.fontStyle.underline ? "underline" : "";
        }
        if (name === "Tips") {
            Module.txtData.splice(0);
            for (var i = 0; i < data.Value.length; ++i) {
                Module.txtData.push(data.Value[i]);
            }
            Module.tipsColor = data.Style.fontColor;
            Module.tipsSize = data.Style.fontSize.size;
            Module.tipsWeight = data.Style.fontStyle.bold ? "bold" : "normal";
            Module.tipsStyle = data.Style.fontStyle.italic ? "italic" : "normal";
            Module.tipsUnderline = data.Style.fontStyle.underline ? "underline" : "";
        }
        setStyle();
    }
}
/**
 * 向父页面发送消息
 * @param {any} Type 发送的消息类型
 * @param {any} Datas 发送的消息
 */
function SendToParent(Type, Datas) {
    var data = {
        Type: Type,
        Datas: Datas
    };
    parent.postMessage(data, "*");
}
window.onload = function () {
    InitStyle();
    onMessage();
    onProgress();
};
window.onresize = function () {
    var bg = document.getElementById("bg");
    var loading = document.getElementsByClassName("loading")[0];
    var zoomData = bg.offsetWidth / 1920;
    loading.style.zoom = zoomData > 1 ? 1 : zoomData < 0.3 ? 0.3 : zoomData;
};
