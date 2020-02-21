import "./jquery.min.js";
const plainObj = obj => JSON.stringify(obj, null, 3);
const logColor: any = ["Green", "Red", "Blue"].reduce((acc, type) => {
    acc[`log${type}`] = str => console.log("%c" + str, `color:${type[0].toLowerCase() + type.slice(1)}`);
    return acc;
}, {});
const { logGreen, logRed, logBlue } = logColor;
const $ = window["$"];
export { logGreen, logRed, logBlue, plainObj, $ };
