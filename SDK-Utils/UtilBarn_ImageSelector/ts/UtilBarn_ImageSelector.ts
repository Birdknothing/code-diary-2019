declare module UtilBarn {
    /**
      * UtilBarn图片选取组件
      * 可用于UtilBarn平台的编辑模块中进行图片选取
      * @author LFH(350424)
      * @version 1.0.0 (2019年3月22日)
      * @see 
      * Js需求:
      *      UtilBarn
      * */
    class ImageSelector {
        /**
         * 启动图片选取器  
         * @param {Object} args 参数对象后期较容易扩展参数，如：{ formats：["*"], radio: 1, limit: 1 }
         * {Array} formats 指定格式支持队列,如：["*"]、["png","jpg"],可选择图片格式（文字转图片不支持gif）
         * {Number} radio 截取的文件比率，默认为1
         * {Number} limit 限制可选中的图片数，默认为1
         * @param {Function} reset 重置回调
         * @param {Function} getinfo 获取到文件信息回调,带参数info{Name,Data}
         * @param {Function} progress 文件上传NDR过程,带两个参数msg, step
         * @param {Function} success 成功回调,带参数info{Name,Type,Guid,Url},选中空图片回调：{ Name: "空图片"， Type："image/png", Guid: "", Url: "" }
         * @param {Function} error 出错回调
         */
        public Start(args: Object, reset: Function, getinfo: Function, progress: Function, success: Function, error: Function): void;
    }
}