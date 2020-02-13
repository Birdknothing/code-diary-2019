// 根据另一个json文件来更改一个json文件的属性值
const M = new Map([
    ["Edbox", "edbox"],
    ["99U", "nd"],
    ["Edmodo", "edmd"],
    ["Facebook", "fb"],
    ["Weixin", "wx"],
    ["Google", "gg"]
]);
// key为条件，val为处理逻辑
const logicMap = new Map([
    // 修改图片
    [
        `val.constructor.name === "Object" && "Image" in val`,
        `M.has(val.Name) && (val.Image = targetjson[M.get(val.Name)])`
    ],
    // 插入额外项
    [
        `val.constructor.name === "Array" && (key === "Key" || key === "Keys") && !val.includes("Google")`,
        `val.push("Google")`
    ]
]);
const fs = require("fs");
const returnJson = url => JSON.parse(fs.readFileSync(url).toString());
const originjson = returnJson("./SimplifiedChinese.test.json");
const targetjson = returnJson("./upload.json");

// 修改图片
function condition1({ key, val }) {
    return typeof val === "object" && "Image" in val;
}
const handle1 = function({ key, val }) {
    M.has(val.Name) && (val.Image = targetjson[M.get(val.Name)]);
};

// 插入额外项
function condition2({ key, val }) {
    return key === "Key" || (key === "Keys" && !val.includes("Google"));
}
const handle2 = function({ key, val }) {
    val.push("Google");
};

// 递归处理所有对象
function dealObj(obj, logicMap) {
    Object.entries(obj).forEach(([key, val]) => {
        logicMap.forEach(function(handlerStr, conditionStr) {
            if (eval(`(({key,val})=>${conditionStr})({ key, val })`)) {
                eval(`(({key,val})=>{${handlerStr}})({ key, val })`);
            }
        });

        if (typeof val === "object") {
            dealObj(val, logicMap);
        }
    });
}
dealObj(originjson, logicMap);

const writejson = (obj, url) => fs.writeFileSync(url, JSON.stringify(obj, null, 3));

// 处理处理过的对象
writejson(originjson, "./result.json");
