declare module Edbox {
    /**
     * EdboxWebSocket组件
     * 用于Edbox平台的WebSocket组件,用于实现WebSocket消息的传递与管理
     * @author 余晓(871129)
     * @version 0.0.0.1 (2019年06月17日 21:00:00)
     * @see 
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
     * */
    class WebSocket {
        /**
         * 创建一个组件实例
         */
        constructor(obj?: object);

        /**
         * 组件唯一ID
         * Unique ID
         * Type : Text
         * Default Value : 
         */
        public ID: string;

        /**
         * 是否启用
         * Whether to enable
         * Type : Boolean
         * Default Value : false
         */
        public Enable: boolean;

        /**
         * 发送消息
         * Send Message
         * @param {string} message 需发送的消息
         */
        public Send(message: string): void;
    }
}
