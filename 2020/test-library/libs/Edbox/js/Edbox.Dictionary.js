// 字典表
(function (namespace, className) {
    /**
     * 字典表
     * @param {Object} obj Object类型字典表
     * @returns {Object} 字典表
     * */
    var module = function (obj) {
        var self = this;

        /**
         * 关键字列表
         */
        this.Keys = obj && obj.Keys || new Array();

        /**
         * 元素值列表
         */
        this.Values = obj && obj.Values || new Array();

        /**
         * 元素数量
         * @returns {Number} 元素数量
         */
        this.Count = function () {
            return self.Keys.length;
        };

        /**
         * 是否包含关键字
         * @param {any} key 关键字
         * @returns {Boolean} 是否包含
         */
        this.ContainsKey = function (key) {
            var index = self.Keys.indexOf(key);
            return index > -1;
        };

        /**
         * 是否包含值
         * @param {any} value 值
         * @returns {Boolean} 是否包含
         */
        this.ContainsValue = function (value) {
            var index = self.Values.indexOf(value);
            return index > -1;
        };

        /**
         * 获取元素值
         * @param {any} key 关键字
         * @returns {any} 元素值
         */
        this.Get = function (key) {
            var index = self.Keys.indexOf(key);
            if (index > -1) {
                return self.Values[index];
            }
            else {
                return null;
            }
        };

        /**
         * 新增或修改元素
         * @param {any} key 关键字
         * @param {any} value 值
         * @returns {Boolean} 执行结果
         */
        this.Set = function (key, value) {
            var index = self.Keys.indexOf(key);
            if (index > -1) {
                self.Values[index] = value;
            }
            else {
                self.Keys.push(key);
                self.Values.push(value);
            }
            return true;
        };

        /**
         * 删除元素
         * @param {any} key 关键字
         * @returns {Boolean} 执行结果
         */
        this.Remove = function (key) {
            var index = self.Keys.indexOf(key);
            if (index > -1) {
                self.Keys.splice(index, 1);
                self.Values.splice(index, 1);
                return true;
            }
            return false;
        };

        return this;
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(window, "Dictionary"));