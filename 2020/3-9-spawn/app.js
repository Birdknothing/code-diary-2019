const { spawn, exec } = require("child_process");
const { logRed, logYellow, logGreen } = require("./color-log");
const { startDirServer } = require("./util-test");
const {
    // strIsDisabled,
    // disableOneLine,
    // enableDisabledLines,
    // strHasTestLine,
    // addOneTestLine,
    // delTestLines,
    insertLocalTestCode,
    delLocalTestCode,
    searchAllUrlsByMap
} = require("./util-test");
//alt d 文件夹地址栏； ctrl shift r (reveal) 打开文件夹; ctrl + r
const portMap = new Map([
    ["p1", { name: "登录控件编辑模式" }],
    ["p2", { name: "登录控件登录模式(本地3007)" }],
    ["p3", { name: "loading移动端" }],
    ["p4", { name: "loadingPC端" }]
]);

// ------------------------------------------------------- 替换和测试方法 --------------------------------------------------------
const localModeReplaceMap = new Map([
    [
        // 登录编辑页 E:\git-project-2\Edbox_H5\Edbox_Components\Loading\dist\index.html
        "E:\\git-project-2\\Edbox_H5\\Edbox_Components\\Loading\\dist\\index.html", // 'Loading组件页' 需要替换的测试代码
        [/(Edbox\.Loading\.Init)/gi, `Edbox.ServerKey = "Dev";`] // 默认在之前插入,匹配字符串带括号，默认带第一个
    ],
    [
        // 登录编辑页
        "E:\\git-project-2\\Edbox_H5\\Edbox_Editor\\Framework\\web\\src\\pages\\gameEdit\\components\\IframePage\\index.js", // iframe本地测试代码
        [
            /(iframe\.onload = \(\))/gi,
            `if(Class==="Login")
        iframe.setAttribute('src', Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), "http://192.168.211.46:3007/Login/index.html") + '&d=' + randomNum );`
        ]
    ],
    [
        // 登录编辑页
        "E:\\git-project-2\\Edbox_H5\\Edbox_Components\\Loading\\dist\\js\\Loader.js",
        [/(InitComponentRootPath\(\);)/gi, `Loader.ComponentRootPath="http://192.168.211.46:3007/libs/";`, "after"] // loading页
    ],
    [
        // 登录编辑页
        "E:\\git-project-2\\Edbox_H5\\Edbox_Editor\\Framework\\web\\src\\pages\\document.ejs", // 到dev登录后再插入，不然插入此段代码调联调的插入
        [/(Loader\.Load)/gi, `Loader.ComponentRootPath="http://192.168.211.46:3007/libs/";`]
    ],
    [
        // 登录编辑页保存
        "E:\\git-project-2\\Edbox_H5\\Edbox_Editor\\Framework\\web\\src\\layouts\\index.js",
        [
            /(return)/gi,
            `window.Edbox.Start(function(){
            window.Edbox.GameId = "3adb28a0-09ea-11ea-8c65-27b1b4e314a3";
            window.Edbox.PackageGuid = "6f2aba4c-daaf-4829-bb4e-6e7cc2be1cfc";
            window.Edbox.ServerInfo = {   "base_pkg_resid": "6f2aba4c-daaf-4829-bb4e-6e7cc2be1cfc",   "base_exe_resid": "",   "pkg_resid": "6f2aba4c-daaf-4829-bb4e-6e7cc2be1cfc",   "exe_resid": "",   "web_resid": "http://game.edbox-dev.101.com/1015817_1",   "width": 0,   "height": 0,   "editor_resid": "",   "apk_package_name": "",   "activity_name": "",   "android_editor_resid": "",   "web_editor_resid": "",   "ios_editor_resid": "",   "web_editor_code_resid": "",   "web_game_code_resid": "a5f9b3d2-fb9d-4d63-a1c8-1240f51c9d95",   "web_pc_editor_resid": "http://game.edbox-dev.101.com/editor/1015817_1_1.00",   "web_pc_editor_code_resid": "2172a0e9-16b6-4d73-9d81-db557819a956",   "editor_frame_type": 1};
            })`
        ]
    ]
]); // 默认在之前插入,匹配字符串带括号
const searchAllUrls = searchAllUrlsByMap(localModeReplaceMap);
// Edbox.Loading.Init(function(callbackAfterLogin){
//     Edbox.Start(function(){
//         callbackAfterLogin();
//     })

const ports = {};
// -------------------------------------------------------------- 启动app -----------------------------------------------------------------------
async function startAll() {
    await searchAllUrls("inserted", insertLocalTestCode);
    // 3007端口 本地dir http://192.168.211.46:3007/1015692_1/

    ports.p2 = await startDirServer();
    if (!ports.p2) {
        logRed("3007本地服务已启动");
    }

    // 登录控件编辑模式，必须用npm 8001 feature/feature-Login http://192.168.211.46:8001/?Page=http://192.168.211.46:3007/EditorTest
    ports.p1 = spawn(process.platform === "win32" ? "umi.cmd" : "umi", ["dev", "--port", "8001"], {
        cwd: "E:\\git-project-2\\Edbox_H5\\Edbox_Editor\\Framework\\web" // E:\git-project-2\Edbox_H5\Edbox_Editor\Framework\web
        // file:///E:/git-project-2/Edbox_H5/Edbox_Editor/Framework/web/package.json
    });

    portMap.forEach((value, key) => {
        if (!(key in ports)) {
            logRed(`${key} is not in ports`);
            return;
        }
        if (!ports[key]) {
            return;
        }
        ports[key].stdout.on("data", data => {
            console.log(`${portMap.get(key).name} >>` + data.toString());
        });
        ports[key].stderr.on("data", data => {
            console.log(`${portMap.get(key).name} error:` + data.toString());
        });
        ports[key].on("close", code => {
            console.log(`${portMap.get(key).name} exit!!`);
        });
    });
}

startAll();

// 如果子进程是node进程，等待下process.exit();其他如npm,yarn,umi都会弹出 Y/N
process.on("SIGINT", async function() {
    await searchAllUrls("deleted", delLocalTestCode);

    setInterval(() => {
        if (!ports.p2 || ports.p2.exitCode == "0") {
            process.exit();
        }
    }, 500);
});
