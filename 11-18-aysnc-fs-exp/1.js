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
} = require("./test");
const { logBlue } = require("../color-log");
const localModeReplaceMap = new Map([
    [
        "./1.text", //  需要替换的测试代码
        [/(Edbox\.Loading\.Init)/gi, `Edbox.ServerKey = "Dev";`] // 默认在之前插入
    ]
]);
const searchAllUrls = searchAllUrlsByMap(localModeReplaceMap);

const express = require("express");
const app = express();
app.listen(3012);
app.use(express.static("./"));

(async function() {
    await searchAllUrls(insertLocalTestCode);
})();

process.on("SIGINT", async function() {
    // 保证父进程启动完毕执行下面代码
    // await searchAllUrls((url, config) => {
    //     delLocalTestCode(url, config, function(str) {
    //         logRed(">>>>   test code deleted    <<<<\n");
    //         logBlue(str + "\n");
    //     });
    // });
    await searchAllUrls(async (url, config) => {
        await delLocalTestCode(url, config, function(str) {
            logBlue(str);
        });
        return;
    });
    logBlue("here");

    process.exit();
});
