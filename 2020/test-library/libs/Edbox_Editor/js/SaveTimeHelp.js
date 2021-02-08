// 粘合层接口， 提供给网编使用
(function (namespace, className) {
    var isValid = true;
    var TimeKey = "time";
    var module = {
        /**
         * 获取数据
         * @param {String} key 关键字
         * @returns {String} 数据
         */
        Get: function (key) {
            if (!isValid) return -1;
            var timeSet = localStorage.getItem(TimeKey);
            timeSet = JSON.parse(timeSet);
            if (!timeSet[key]) {
                timeSet[key] = -1;
            }
            return timeSet[key];
        },

        /**
         * 保存数据
         * @param {String} key 关键字
         * @param {String} value 数据
         */
        Set: function (key, value) {
            if (!isValid) return;
            var timeSet = localStorage.getItem(TimeKey);
            timeSet = JSON.parse(timeSet);
            timeSet[key] = value;
            localStorage.setItem(TimeKey, JSON.stringify(timeSet));
        },

        /**
         * 清空所有记录数据
         */
        Clear: function () {
            if (!isValid) return;
            localStorage.removeItem(TimeKey);
            localStorage.setItem(TimeKey, JSON.stringify({}));
        }
    };
    function Init() {
        try {
            localStorage.setItem("test", 1);
        }
        catch (e) {
            isValid = false;
        }
        finally {
            if (isValid) {
                localStorage.removeItem("test");
                if (!localStorage.getItem(TimeKey)) {
                    localStorage.setItem(TimeKey, JSON.stringify({}));
                }
            }
        }
    }

    Init();
    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Editor, "SaveTimeHelp"));
