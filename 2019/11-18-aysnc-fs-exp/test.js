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
const { writeFile, readFile } = require("./promisifyFS");
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
    insertLocalTestCode: async function(url, config, cb) {
        const [exp, str] = config;
        const content = (await readFile(url)).toString();
        const resArr = content.match(exp);
        if (!resArr) {
            throw new Error("str not found in ", url);
        }
        if (resArr.length && resArr.length > 1) {
            throw new Error("find multiple results in ", url);
        }
        await writeFile(url, content.replace(exp, `${libs.addOneTestLine(str)}$1`));
        if (typeof cb === "function") {
            cb(str);
        }
        return;
    },
    delLocalTestCode: async function(url, config, cb) {
        const content = (await readFile(url)).toString();
        const [exp, str] = config;
        await writeFile(url, libs.delTestLines(content));
        if (typeof cb === "function") {
            cb(str);
        }
        return;
    },
    searchAllUrlsByMap: map => async operate => {
        for (let value of map) {
            const [url, config] = value;
            await operate(url, config);
        }
        return;
    }
};
module.exports = libs;
