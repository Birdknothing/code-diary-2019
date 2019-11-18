// 临时数据存储服务
(function (namespace, className) {
    /**
     * 临时数据存储服务
     */
    var module = {
        /**
         * 获取数据
         * @param {String} key 关键字
         * @returns {String} 数据
         */
        Get: function (key) {
            return sessionStorage.getItem(key);
        },

        /**
         * 保存数据
         * @param {String} key 关键字
         * @param {String} value 数据
         */
        Set: function (key, value) {
            sessionStorage.setItem(key, value);
        },

        /**
         * 关键字是否存在
         * @param {String} key 关键字
         * @returns {Boolean} 是否存在
         */
        Contain: function (key) {
            return module.Get(key) !== null;
        },

        /**
         * 获取数据
         * @param {String} key 关键字
         */
        Remove: function (key) {
            sessionStorage.removeItem(key);
        },

        /**
         * 清空所有记录数据
         */
        Clear: function () {
            sessionStorage.clear();
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "DataSet"));