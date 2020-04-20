declare module Edbox {
    /**
      * Edbox音频选取组件
      * 可用于Edbox平台的编辑模块中进行音频选取
      * @author 温荣泉(201901)
      * @version 1.0.0 (2019年3月22日)
      * @see http://ndsdn.nd.com.cn/index.php?title=Edbox%E9%9F%B3%E9%A2%91%E9%80%89%E5%8F%96%E7%BB%84%E4%BB%B6JS%E7%89%88
      * Js需求:
      *      Edbox
      * */
    class AudioSelector {
        /**
         * 启动音频选取器
         * @param {String} name 资源名称
         * @param {String} url 资源远程路径
         * @param {Array} formats 指定格式支持队列,例如["mp3","ogg"] , 留空时获取源文件
         * @param {Function} reset 重置回调
         * @param {Function} getinfo 获取到文件信息回调,带参数info{Name,Data}
         * @param {Function} progress 文件上传NDR过程,带两个参数msg, step
         * @param {Function} success 成功回调,带参数info{Name,Type,Guid,Url}
         * @param {Function} error 出错回调
         */
        public static Start(name?: string, url?: string, formats?: Array<String>, reset?: Function, getinfo?: Function, progress?: Function, success?: Function, error?: Function): void;
    }
}
