const formatDuration = time => {
    time = time * 1000;
    if (!time) return "00:00";
    time = Math.round(time / 1000);
    var m = Math.floor(time / 60);
    var s = time - m * 60;

    // 播放声音不足1s时候显示1s
    if (s === 0) {
        s = 1;
    }
    return (m > 9 ? m : "0" + m) + ":" + (s > 9 ? s : "0" + s);
};
const getType = (fileType = "") => {
    fileType = fileType.toString();
    const arr = fileType.split(".");
    if (arr.length === 0) return "";
    return arr[arr.length - 1].slice(-3);
};
const setType = (origin = "", target) => {
    if (!target) return origin;
    target = target.toString();
    origin = origin.toString();
    return origin.replace(/(.*)\..*/s, "$1." + target.slice(-3));
};
const getFileNameWithoutType = (title = "") => {
    const result = title.match(/(.*)\./s);
    return result ? result[1] || "" : "";
};
const formatAudioDuration = (str = "") => {
    const target = str.match(/(\d+M)?(\d+)S/);
    const m = target && target[1] ? target[1].slice(0, -1) : 0;
    const s = target ? target[2] : 0;
    return { totalTime: `00${m}`.slice(-2) + ":" + `00${s}`.slice(-2), rawTotal: +m * 60 + +s };
};
export { formatDuration, getType, setType, getFileNameWithoutType, formatAudioDuration };
