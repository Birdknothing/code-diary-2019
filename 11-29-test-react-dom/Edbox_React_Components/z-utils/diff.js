const msg = {
    "0": "无此组件",
    "1": "组件刷新",
    "2": "组件未更新"
};
const { logRed, logGreen, logBlue } = require("./color-log");
module.exports = async (originConfig, targetConfig, cb) => {
    for (let key in originConfig) {
        if (!targetConfig[key]) {
            logRed(`${msg[0]}: ${key}`);
            return;
        }
        if (originConfig[key] === targetConfig[key]) {
            logGreen(`${msg[0]}: ${key}`);
            break;
        }
        // 复制组件
        await cb(key, targetConfig[key]);
        logBlue(`${msg[0]}: ${key}`);
    }
    return;
};
