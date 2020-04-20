const path = require("path");
const fs = require("fs");
const getStr = url => fs.readFileSync(url).toString();

const GetAllUrlsExp = () => {
    // todo ，删除所有 // 行和/* */行
    // 忽略 href="javascript:;"和href="#"等情况，注意对js中的模版字符串拼接如 href="' + 'somwhre"'无法处理，此处用空格过滤，如果+左右无空格需todo
    return new RegExp(
        //js文件内 = "/a/b/c.gif" 的图片无法捕获到,已增加，捕获 "/ab.gif"
        `((?<=(href|src) *= *(['"]))([^"' ;#]+)(?=\\3))|((?<=url[(](['"]?))[^'"\(\)]+(?=(\\2)[)]))|((?<=(['"]))/[^'" <>]+(?=\\2))`,
        "g"
    );
};

const target = getStr("test/abc/index.html").replace(GetAllUrlsExp(), str => {
    const rootDir = "/test/abc";
    console.log(str);
    return str[0] === "/" ? path.relative(rootDir, str) : str;
});
console.log(target);
