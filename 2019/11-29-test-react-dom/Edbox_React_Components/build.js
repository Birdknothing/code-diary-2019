// 校验是否有更新的组件，发出警告,阻塞build
const path = require("path");
const { logRed } = require("./z-utils/color-log");
const diff = require("./z-utils/diff");
const cd = (...args) => path.resolve(...args);
const msg = {
    "0": ["警告，react组件 ", " 有更新,需先 npm start"]
};

// npm工作目录
const originPath = path.resolve(process.cwd());
// 此脚本目录
const targetPath = path.resolve(originPath, path.dirname(process.argv[1]));
// web,mobile
const ending = process.argv[2];
const originConfig = require(cd(originPath, "version.js"));
const targetConfig = require(cd(targetPath, ending, "version.js"));

const findDiffCom = async cpName => {
    logRed(`${msg[0].join(cpName)}\n`);
    process.stdout.write("是否继续打包(yes/no?)");
    process.stdin.on("data", reply => {
        process.exit(
            1 -
                reply
                    .slice(0, -2)
                    .toString()
                    .includes("y")
        );
    });

    return;
};
const start = async () => {
    // 找有更新的组件刷新
    await diff(originConfig, targetConfig, findDiffCom);
};
start();
