declare module UtilBarn {
    /**
     * UtilBarn 通用排行榜组件
     * 用于UtilBarn平台游戏排行榜的统一使用
     * @author 温荣泉(201901)
     * @version 1.0.1 (2019年3月12日)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn%E9%80%9A%E7%94%A8%E6%8E%92%E8%A1%8C%E6%A6%9C%E7%BB%84%E4%BB%B6Html5%E7%89%88
     * Js需求:
     *      jquery
     *      CryptoJS
     *      UtilBarn
     *      UtilBarn_Request
     * */
    class Ranking {
        /**
         * 排行榜ID
         */
        public static ID: string;

        /**
         * 排行榜URL路径，用于Iframe地址
         */
        public static RankingUrl: string;

        /**
         * 显示排行榜界面
         */
        public static Show(): void;

        /**
         * 隐藏排行榜界面
         */
        public static Hide(): void;

        /**
         * 获取排行榜列表
         * @param {Number} page 第几页列表
         * @param {Number} size 每页几个数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static Get(page: number, size: number, success?: Function, error?: Function): void;

        /**
         * 提交玩家分数
         * @param {Number} score 玩家分数
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static Post(score: number, success?: Function, error?: Function): void;
    }
}
