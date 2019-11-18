/**
 * UtilBarn模块
 */
var UtilBarnModule = angular.module("UtilBarn", ["ngRoute", "ngTouch", "UtilBarn.datas"]);

/**
 * 数据集
 */
var Datas = new Object();

/**
 * 数据集方法
 */
var DataFunction = {
    /**
     * 获取文本
     * @param {String} key 关键字
     * @return {String} 返回文本
     */
    GetText: function(key) {
        if (!Datas || !Datas.Texts || !Datas.Texts[key]) return key;
        if (UtilBarn.Language === "English") {
            return Datas.Texts[key].EnglishValue;
        } else if (UtilBarn.Language === "SimplifiedChinese") {
            return Datas.Texts[key].ChineseValue;
        } else {
            return Datas.Texts[key].Value;
        }
    },

    /**
     * 获取图片路径
     * @param {String} key 关键字
     * @return {String} 返回图片路径
     */
    GetImage: function(key) {
        if (!Datas || !Datas.Images || !Datas.Images[key]) return "";
        if (UtilBarn.Language === "English") {
            return Datas.Images[key].EnglishValue;
        } else if (UtilBarn.Language === "SimplifiedChinese") {
            return Datas.Images[key].ChineseValue;
        } else {
            return Datas.Images[key].Value;
        }
    },

    /**
     * 设置图片
     * @param {String} key 关键字
     * @param {String} value 图片Url
     * @param {boolean} apply 如果是ng交互是不需要apply的（此处apply会报错），从服务端获取的信息或者自身修改的需要强行apply
     */
    SetImage: function(key, value, apply) {
        if (!Datas || !Datas.Images || !Datas.Images[key]) return;
        if (UtilBarn.Language === "English") {
            Datas.Images[key].EnglishValue = value;
        } else if (UtilBarn.Language === "SimplifiedChinese") {
            Datas.Images[key].ChineseValue = value;
        } else {
            Datas.Images[key].Value = value;
        }

        if (apply === true)
            DataFunction.Apply();
    },

    /**
     * 获取方法
     * @param {String} key 关键字
     * @return {Function} 返回方法
     */
    GetFunction: function(key) {
        if (!Datas.Functions || !Datas.Functions[key]) return;
        return Datas.Functions[key];
    },

    /**
     * 获取当前页 
     * @return {String} 当前页名称
     */
    GetPage: function() {
        var hash = window.location.hash;
        hash = hash.substring(hash.indexOf("/") + 1);
        return hash;
    },

    /**
     * 获取Json
     * @param {any} url Json的Url地址
     * @param {any} success 成功回调带参数json对象数据
     * @param {any} error 出错回调
     */
    GetJson: function(url, success, error) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", url, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status === 200) {
                var text = rawFile.responseText;
                var json = null;
                try {
                    json = JSON.parse(text);
                } catch (e) {
                    error("Json解析失败");
                }
                success(json);
            }
        };
        rawFile.send(null);
    },

    /**
     * 格式化数据
     * @param {Object} data Datas数据
     * @param {Object} node Datas赋值节点
     */
    ParseDatas: function(data, node) {
        if (node[data.Name]) {
            console.log(data.Name + " " + node.Name);
            return;
        }
        node[data.Name] = data;
        if (!data.Datas) return;
        for (var key in data.Datas) {
            DataFunction.ParseDatas(data.Datas[key], data);
        }
    },

    /**
     * 初始化
     * @param {String} jsonPath Json路径
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    Init: function(jsonPath, success, error) {
        DataFunction.GetJson(jsonPath, function(data) {
            var keys = Object.keys(data);
            for (var i = 0; i < keys.length; i++) {
                var key0 = keys[i];
                if (key0 === "Datas") continue;
                DataFunction.ParseDatas(data[key0], Datas);
            }
            for (var key in data.Datas) {
                data.Datas[key].FromDatas = true;
                DataFunction.ParseDatas(data.Datas[key], Datas);
            }
            if (success) success();
        }, function(e) {
            if (error) error(e);
        });
    }
};

// 初始化Datas模块
angular.module("UtilBarn.datas", []).controller("DatasCtrl", ["$scope", function($scope) {
    $scope.Datas = Datas;
    $scope.DataFunction = DataFunction;
    $scope.DataFunction.Apply = function() {
        !$scope.phase && !$scope.$root.phase && $scope.$apply();
    };
}]);

// 初始化移动事件
UtilBarnModule.directive("ngTouchstart", function() {
    return {
        controller: ["$scope", "$element", function($scope, $element) {

            $element.bind("touchstart", onTouchStart);
            $element.bind("mousedown", onTouchStart);

            function onTouchStart(event) {
                var method = $element.attr("ng-touchstart");
                $scope.event = event;
                $scope.$apply(method);
            }

        }]
    };
}).directive("ngTouchmove", function() {
    return {
        controller: ["$scope", "$element", function($scope, $element) {

            $element.bind("touchstart", onTouchStart);
            $element.bind("mousedown", onTouchStart);

            function onTouchStart(event) {
                event.preventDefault();
                $element.bind("mousemove", onTouchMove);
                $element.bind("mouseup", onTouchEnd);
                $element.bind("touchmove", onTouchMove);
                $element.bind("touchend", onTouchEnd);
            }

            function onTouchMove(event) {
                var method = $element.attr("ng-touchmove");
                $scope.event = event;
                $scope.$apply(method);
            }

            function onTouchEnd(event) {
                event.preventDefault();
                $element.unbind("mousemove", onTouchMove);
                $element.unbind("mouseup", onTouchEnd);
                $element.unbind("touchmove", onTouchMove);
                $element.unbind("touchend", onTouchEnd);
            }

        }]
    };
}).directive("ngTouchend", function() {
    return {
        controller: ["$scope", "$element", function($scope, $element) {
            var method = $element.attr("ng-touchend");

            $element.bind("touchend", onTouchEnd);
            $element.bind("mouseup", onTouchEnd);

            function onTouchEnd(event) {
                $scope.event = event;
                $scope.$apply(method);
            }

        }]
    };
}).directive("ngRepeatfinish", function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                /*
                $timeout(function() {
                    scope.$emit('ngRepeatFinished', element);
                });
                */

                $timeout(function() {
                    var method = element.attr("ng-repeatfinish");
                    scope.$apply(method);
                });
            }
        }
    }
});