// node version > 8.0.0
const path = require("path");
const { logGreen } = require("./z-utils/color-log");
const fs = require("fs");
const { readFile, writeFile, mkdir } = require("./z-utils/promiseFS");
const diff = require("./z-utils/diff");
const cd = (...args) => path.resolve(...args);

const originPath = path.resolve(process.cwd());
const targetPath = path.resolve(originPath, path.dirname(process.argv[1]));
// pc,mobile
const ending = process.argv[2];
const originConfig = require(cd(originPath, "version.js"));
const targetConfig = require(cd(targetPath, ending, "version.js"));

const originComPath = cd(originPath, "src", "components");
const targetComPath = cd(targetPath, ending);

const filesArr = ["index.js", "index.scss"];
const newTags = {};
const copyCom = async (cpName, latestTag) => {
    for (let fname of filesArr) {
        const originDirname = cd(originComPath, cpName);
        if (!fs.existsSync(originDirname)) {
            await mkdir(originDirname);
        }
        await writeFile(cd(originDirname, fname), await readFile(cd(targetComPath, cpName, fname)));
        newTags[cpName] = latestTag;
    }
    return;
};
const refreshVersion = () => {
    for (let key in newTags) {
        originConfig[key] = newTags[key];
    }
    return writeFile(cd(originPath, "version.js"), `module.exports=${JSON.stringify(originConfig, null, 3)}`);
};
const start = async () => {
    // 找有更新的组件刷新
    await diff(originConfig, targetConfig, copyCom);
    // 更新项目的version.js
    await refreshVersion();
    logGreen("=============== 组件部分无异常 ===============");
};
start();
