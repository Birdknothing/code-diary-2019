const jqDom = {
    $main: document.getElementById("app"),
};

// const { ipcRenderer } = require("electron");
// ipcRenderer.sendSync("synchronous-message", "ping"); // prints "pong"

// ipcRenderer.on("asynchronous-reply", (event, arg) => {
//     console.log(arg); // prints "pong"
// });
//在渲染器进程 (网页) 中。
const { ipcRenderer } = require("electron");
console.log(ipcRenderer.sendSync("synchronous-message", "ping")); // prints "pong"

ipcRenderer.on("asynchronous-reply", (event, arg) => {
    console.log(arg); // prints "pong"
});
const sendMsg = function (msg) {
    ipcRenderer.send("asynchronous-message", msg);
};

const datas = {
    roleMap: {
        roleInput1: "TeacherResId",
        roleInput2: "StudentResId",
    },
    audioMap: {
        audioInput1: "TeacherAudioPath",
        audioInput2: "StudentAudioPath",
    },
    roleItemConfig: {},
    audioItemConfig: [
        // {
        //     TeacherAudioPath: "E:\\Audio\\teacher3.mp3",
        //     StudentResId: "2001",
        // },
    ],
    roleItem: `<div class="box">
                <div class="head">角色</div>
                <div class="tch"><span class="role">老师：</span><input type="text" value="{{role1}}" class="input" onchange="datas.fillRoleIds('roleInput1',this.value)"/></div>
                <div class="std"><span class="role">学生：</span><input  type="text"  value="{{role2}}"  class="input"  onchange="datas.fillRoleIds('roleInput2',this.value)"/></div>
     </div>`,
    audioItem: `<div class="box">
                <div class="head bgBlue">音频{{seq}} <span class="del" onclick="datas.del({{binSeq}})">+</span></div>
                <div class="tch"><span class="role">老师：</span><div class="fileBox"><span class="desc">{{fname1}}</span><input type="file" onchange="datas.fillAudioInfos({{binSeq}},'audioInput1',this)" /></div></div>
                <div class="std"><span class="role">学生：</span><div class="fileBox"><span class="desc">{{fname2}}</span><input type="file" onchange="datas.fillAudioInfos({{binSeq}},'audioInput2',this)" /></div></div>
    </div>`,
    fillRoleItems() {
        let tmp = this.roleItem;
        for (let j = 0; j < 2; j++) {
            tmp = util.fill(
                tmp,
                "role" + (+j + 1),
                this.roleItemConfig[this.roleMap["roleInput" + (+j + 1)]] || ""
            );
        }
        return tmp;
    },
    fillAudioItem(i) {
        let tmp = util.fill(
            util.fill(this.audioItem, "seq", +i + 1),
            "binSeq",
            +i
        );
        console.log(this.audioItemConfig[+i]);

        for (let j = 0; j < 2; j++) {
            tmp = util.fill(
                tmp,
                "fname" + (+j + 1),
                this.audioItemConfig[+i][
                    this.audioMap["audioInput" + (+j + 1)]
                ] || "未选择文件"
            );
        }
        return tmp;
    },
    updateUI() {
        document.getElementsByClassName(
            "list"
        )[0].innerHTML = Flist.qa.listData.getData();
        // $(".list").html(Flist.qa.listData.getData());
    },
    // fun
    fillRoleIds(type, val) {
        this.roleItemConfig[this.roleMap[type]] = val;
    },
    fillAudioInfos(i, type, dom) {
        this.audioItemConfig[+i][this.audioMap[type]] = dom.files[0].path;
        dom.previousElementSibling.innerHTML = dom.files[0].path;
    },
    del(i) {
        this.audioItemConfig.splice(+i, 1);
        // console.log(+i);
        // $(".list .box")
        //     .eq(+i + 1)
        //     .remove();
        this.updateUI();
    },
    add() {
        // $(".list").append(
        //     this.fillAudioItem(this.audioItemConfig.length)
        // );
        this.audioItemConfig.push({});
        this.updateUI();
    },
    gen() {
        const target = {};
        target.NpcRes = JSON.stringify(this.roleItemConfig, null, 3);
        const lists = this.audioItemConfig;
        target.Manifest = {
            NpcResConfigPath: "NpcRes.json",
            QAConfigPath: [],
        };
        target.Items = lists;
        target.Manifest.QAConfigPath = lists.map(
            (ele, i) => `QA_${+i + 1}.json`
        );
        sendMsg(target);
    },
};
const Flist = {
    font: {
        title: "自动化生产AI颗粒",
        tmplt: `<div class="cmMain">
                        <div class="title">{{title}}</div>
                        <button class="cmBtn" onclick="route.tab(this.getAttribute('data-rt'))" data-rt="lib">套路库</button>
                        </div>`,
    },
    lib: {
        title: "套路库",
        tmplt: `<div class="cmMain">
            <div class="title">{{title}}</div>
            <button class="cmBtn" onclick="route.tab(this.getAttribute('data-rt'))" data-rt="qa">一问一答</button>
            <button class="cmBtn mg20">朗读颗粒</button>
            </div>`,
    },
    qa: {
        title: "一问一答",
        listData: {
            getData() {
                let roleItem = datas.fillRoleItems();
                let audioItems = "";
                for (let i in datas.audioItemConfig) {
                    audioItems += datas.fillAudioItem(i);
                }
                return roleItem + audioItems;
            },
        },
        tmplt: `<div class="cmMain">
                <div class="title">{{title}}</div>
                <div class="list">
                    {{listData}}
                </div>
                <div class="bottom">
                    <div class="add" onclick="datas.add()">添加音频</div>
                    <div class="gen" onclick="datas.gen()">生成</div>
                </div>
                </div>`,
    },
};
const route = {
    tab(rt) {
        jqDom.$main.innerHTML = Flist[rt].tmplt;
        // jqDom.$main.html(Flist[rt].tmplt);
    },
};
const util = {
    getUrl(dom) {
        var url = null;
        var fileObj = dom.files[0];
        if (window.createObjcectURL != undefined) {
            url = window.createOjcectURL(fileObj);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(fileObj);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(fileObj);
        }
        console.log('get url',url);
        
        return url;
    },
    fill(tplt, name, val) {
        return tplt.replace(new RegExp("{{" + name + "}}", "g"), val);
    },
};
// 页面
const Page = {
    initUI: function () {
        for (let route in Flist) {
            const obj = Flist[route];
            for (let key in obj) {
                key !== "tmplt" &&
                    (typeof obj[key] === "string"
                        ? (obj.tmplt = util.fill(obj.tmplt, key, obj[key]))
                        : (obj.tmplt = util.fill(
                              obj.tmplt,
                              key,
                              obj[key].getData()
                          )));
            }
        }
        console.log("heeh");

        route.tab("font");
    },
};

// console.log(ipcRenderer.sendSync("synchronous-message", "ping")); // prints "pong"

// ipcRenderer.on("asynchronous-reply", function (event, arg) {
//     console.log(arg); // prints "pong"
// });

Page.initUI();
