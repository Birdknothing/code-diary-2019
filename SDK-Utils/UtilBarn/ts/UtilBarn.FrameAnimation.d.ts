declare module UtilBarn {
    /**
     * 帧动画
     */
    class FrameAnimation {
        /**
         * 根据GUID获取帧动画数据
         * @param {String} guid NDR上的资源GUID
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        public static Get(guid: string, success?: Function, error?: Function): void;

        /**
         * 根据GUID获取预览图数据
         * @param {String} guid NDR上的资源GUID
         * @param {String} success 成功回调
         * @param {String} error 失败回调
         */
        public static GetPreview(guid: string, success?: Function, error?: Function): void;

        /**
         * 根据GUID获取图集数据
         * @param {String} guid NDR上的资源GUID
         * @param {String} success 成功回调
         * @param {String} error 失败回调
         */
        public static GetAtlas(guid: string, success?: Function, error?: Function): void;

        /**
         * 保存至NDR，获取GUID
         * @param {Array} data 帧动画数据
         * @param {String} preview 预览图数据
         * @param {String} atlas 图集数据
         * @param {Function} progress 进度回调
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        public static Set(data: Array<object>, preview?: string, atlas?: string, progress?: Function, success?: Function, error?: Function): void;
    }
}