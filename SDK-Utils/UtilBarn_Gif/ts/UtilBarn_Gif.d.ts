/**
 * UtilBarn Gif组件
 * 用于UtilBarn平台的Laya引擎的将Gif转化为图片的Url数组提供个Laya.Animation播放
 * @author LFH(350424)
 * @version 1.0.0 (2019年3月1日)
 * Js需求:
 *      libgif
 * */

declare module UtilBarn{
    class Gif {
        /**
         * 载入gif（url的有效性需自身判定，暂时无法出错回调）
         * @param {String} gifUrl 资源服务器GUID
         * @param {Function} success 成功回调,带参数list: string[],逐帧url
         * @param {Function} error 出错回调
         */
        public static LoadGif(gifUrl: string, success: Function, error: Function): void;
    }
}