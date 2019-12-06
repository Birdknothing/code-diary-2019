const fs = require("fs");
const path = require("path");
const cd = (...args) => path.resolve(...args);
const { logRed } = require("./z-utils/color-log");
const { readdir, writeFile } = require("./z-utils/promiseFS");

const msg = {
    "0": "警告，正在重命名文件"
};

// 监视目录
const watchDirsArr = ["web", "mobile"];
const workPath = cd(process.cwd());
const versionObjs = watchDirsArr.reduce((acc, ele) => {
    acc[ele] = require(cd(workPath, ele, "version.js"));
    return acc;
}, {});

function throttle(f, time) {
    let firstTime = true,
        timeout = false;
    return function() {
        if (firstTime || timeout) {
            timeout = false;
            setTimeout(() => {
                f.apply(null, arguments);
                timeout = true;
            }, time);
            firstTime = false;
        }
    };
}
const genTag = () => String(Math.random()).slice(-8);
const updateVersion = dname =>
    writeFile(cd(workPath, dname, "version.js"), `module.exports=${JSON.stringify(versionObjs[dname], null, 3)}`);

const fileWatcher = (versionObj, comName) =>
    throttle((eventType, filename) => {
        if (eventType === "rename") {
            // 不应重命名文件
            logRed(msg[0]);
        }
        versionObj[comName] = genTag();
    }, 1000);

const startWatch = async dname => {
    const direntArr = await readdir(cd(workPath, dname));
    const eachDo = async dirent => {
        const url = cd(workPath, dname, dirent);
        if (fs.statSync(url).isDirectory()) {
            fs.watch(url, { encoding: "utf-8" }, fileWatcher(versionObjs[dname], path.basename(url)));
        }
        return;
    };
    for (let dirent of direntArr) {
        await eachDo(dirent);
    }
    return;
};

const start = async () => {
    for (let dir of watchDirsArr) {
        await startWatch(dir);
    }
};
start();
process.on("SIGINT", async () => {
    for (let dir of watchDirsArr) {
        await updateVersion(dir);
    }
    process.exit();
});
