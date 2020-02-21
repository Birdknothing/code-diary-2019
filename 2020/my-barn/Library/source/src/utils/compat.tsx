const isIOS = !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
const datasFilter = (type, lib, datas) => {
    if (type === "getListAll" && lib === "audio" && isIOS) {
        // ios暂时只使用mp3
        return datas.filter(data => (data.audioType || "").slice(-3) === "mp3" || (data.audioType || "").slice(-4) === "mpeg");
    }
    return datas;
};
const throttle = (f, time) => {
    let firstTime = true,
        timeout = false;
    return function() {
        if (firstTime || timeout) {
            timeout = false;
            setTimeout(() => {
                f.apply(null, arguments);
                timeout = true;
            }, time);
            firstTime = false;
        }
    };
};
export { isIOS, datasFilter, throttle };
