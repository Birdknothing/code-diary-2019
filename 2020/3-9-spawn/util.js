/**
 * @author Shao
 */

/*
const {
    strIsDisabled,
    disableOneLine,
    enableDisabledLines,
    strHasTestLine,
    addOneTestLine,
    delTestLines,
    insertLocalTestCode,
    delLocalTestCode,
    searchAllUrlsByMap
} = require("");
*/
const { logRed, logBlue } = require("./color-log");
const { writeFile, readFile } = require("./promisifyFS");
const net = require("net");
const { spawn } = require("child_process");
const libs = {
    strIsDisabled(allstr, str) {
        return allstr.match(new RegExp(`// disableOneLine ${str}`));
    },
    disableOneLine(str) {
        return `// disableOneLine ${str}`;
    },
    enableDisabledLines(str) {
        return str.replace(/\/\/ disableOneLine (.*)/gm, "$1");
    },
    strHasTestLine(allstr, str) {
        return allstr.match(new RegExp(`// testLine-- \n${str}\n// --testLine`));
    },
    // 不能交叉嵌套或包含嵌套
    addOneTestLine(str) {
        return `\n// testLine-- \n${str}\n// --testLine\n`;
    },
    delTestLines(str) {
        return str.replace(/\n\/\/ testLine--.*?\/\/ --testLine\n/gs, "");
    },
    // 以下方法均需要map来实现：
    /* 
    const localModeReplaceMap = new Map([
        [
            "E:\\git-project-audio-edit\\Edbox_H5\\Edbox_Editor\\Framework\\web\\src\\pages\\gameEdit\\components\\Controls\\index.js", // 'controls' 需要替换的测试代码
            [/(case 'Audio01' :)/gi, `controlUrl = "http://192.168.211.46:8081";`, "after"] // 默认在之前插入,匹配字符串带括号，默认带第一个
        ]
    ]); // 默认在之前插入,匹配字符串带括号
    const localModeDisableMap = new Map([
        [
            "E:\\git-project-audio-edit\\Edbox_H5\\Edbox_Editor\\Framework\\web\\src\\pages\\gameEdit\\components\\Controls\\index.js", // 'controls' 需要替换的测试代码
            [/(case 'Audio01' :)/gi] // 默认在之前插入,匹配字符串带括号，默认带第一个
        ]
    ]);
    */
    disableOneLocalLine: async function(url, config, operateType) {
        const [exp, str] = config;
        const content = (await readFile(url)).toString();
        const resArr = content.match(exp);
        if (!resArr) {
            throw new Error("str not found in ", url);
        }
        if (resArr.length && resArr.length > 1) {
            throw new Error("find multiple results in ", url);
        }
        await writeFile(url, content.replace(exp, libs.disableOneLine(resArr[0])));
        logRed(`>>>>   test code ${operateType}    <<<<\n`);
        logBlue(resArr[0] + "\n");
        return;
    },
    enableLocalDisabledLines: async function(url, config, operateType) {
        const content = (await readFile(url)).toString();
        await writeFile(url, libs.enableDisabledLines(content));
        logRed(`>>>>   test code ${operateType}    <<<<\n`);
        return;
    },
    // 默认前插
    insertLocalTestCode: async function(url, config, operateType) {
        const [exp, str, direction] = config;
        const content = (await readFile(url)).toString();
        const resArr = content.match(exp);
        if (!resArr) {
            throw new Error("str not found in ", url);
        }
        if (resArr.length && resArr.length > 1) {
            throw new Error("find multiple results in ", url);
        }
        await writeFile(
            url,
            content.replace(
                exp,
                direction !== "after" ? `${libs.addOneTestLine(str)}$1` : `$1${libs.addOneTestLine(str)}`
            )
        );
        logRed(`>>>>   test code ${operateType}    <<<<\n`);
        logBlue(str + "\n");
        return;
    },
    delLocalTestCode: async function(url, config, operateType) {
        const content = (await readFile(url)).toString();
        const [exp, str] = config;
        await writeFile(url, libs.delTestLines(content));
        logRed(`>>>>   test code ${operateType}    <<<<\n`);
        logBlue(str + "\n");
        return;
    },
    searchAllUrlsByMap: map => async (operateType = "nohint", operate) => {
        for (let value of map) {
            const [url, config] = value;
            await operate(url, config, operateType);
        }
        return;
    },
    // 开启通用3007本地服务器
    startDirServer: async (repalceMap = `new Map();`, disableMap = `new Map();`) => {
        const progress = await new Promise((res, rej) => {
            // 判断3007端口是否被占用
            const server = net.createServer().listen(3007);
            try {
                server.on("listening", function() {
                    /**检测有则关闭服务 */
                    server.close();
                    const pg = spawn("node", ["app-login.js", repalceMap, disableMap]);
                    res(pg);
                });
                server.on("error", function(err) {
                    if (err.code === "EADDRINUSE") {
                        /**服务已启动或被占用 */
                        res(null);
                    }
                });
            } catch (error) {}
        });
        return progress;
    }
};
module.exports = libs;
