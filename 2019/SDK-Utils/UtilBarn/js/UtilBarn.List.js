// 队列
(function (namespace, className) {
    /**
     * 队列
     * @param {Object} obj Object类型队列
     * @returns {Object} 队列
     * */
    var module = function (obj) {
        var self = this;

        /**
         * 元素数量
         * @returns {Number} 元素数量
         */
        this.Count = function () {
            return self.length;
        };

        /**
         * 是否包含关键字
         * @param {any} obj 元素对象
         * @returns {Boolean} 是否包含
         */
        this.Contain = function (obj) {
            var index = self.indexOf(obj);
            return index > -1;
        };

        /**
         * 新增或修改元素
         * @param {any} obj 元素对象
         */
        this.Add = function (obj) {
            var index = self.indexOf(obj);
            if (index > -1) return;
            self.push(obj);
        };

        /**
         * 删除元素
         * @param {any} obj 元素对象
         */
        this.Remove = function (obj) {
            var index = self.indexOf(obj);
            if (index > -1) {
                self.splice(index, 1);
            }
        };

        if (obj && obj.length > 0) {
            for (var i = 0; i < obj.length; i++) {
                self[i] = obj[i];
            }
        }

        return this;
    };
    module.prototype = Array.prototype;

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(window, "List"));