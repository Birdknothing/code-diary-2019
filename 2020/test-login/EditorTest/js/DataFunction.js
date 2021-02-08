/**
 * 数据集方法
 */
var DataFunction = {
    /**
     * 数据集，只传输数据给游戏
     */
    Datas: new Object(),

    /**
     * 静态数据，直接传给游戏
     */
    StaticData: null,

    /**
     * 源数据，用于消息传输
     */
    DataSource: null,

    /**
     * 数据连接字典 
     */
    DataLinks: new Dictionary(),

    /**
     * 获取Json
     * @param {any} url Json的Url地址
     * @param {any} success 成功回调带参数json对象数据
     * @param {any} error 出错回调
     */
    GetJson: function (url, success, error) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", url, true);
        rawFile.onreadystatechange = function () {
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
     * 新增数据
     * @param {Object} tab Tab对象
     * @param {Object} data 数据     * 
     */
    Add: function (tab, data) {
        if (!data || !data.Type || !data.ID) return;

        if (DataFunction.Datas[data.ID]) {
            console.error("Config Error ID: " + data.ID);
            return;
        }
        DataFunction.Datas[data.ID] = data;

        if (data.Type === "Tab01" && !tab) {
            DataFunction.DataSource.Datas.push(data);
            DataFunction.DataLinks.Set(data, DataSource);
            return;
        }

        if (!tab || !tab.Type || !tab.ID || tab.Type.indexOf('Tab') < 0) return;
        if (!tab.Datas) tab.Datas = new Array();
        tab.Datas.push(data);
        DataFunction.DataLinks.Set(data, tab);
    },

    /**
     * 更新数据
     * @param {Object} data 数据
     */
    Update: function (data) {
        if (!data || !data.Type || !data.ID) return;

        if (data.ID === "StaticData") {
            DataFunction.StaticData = data;
            DataFunction.DataSource.StaticData = data;
            return;
        }

        // 根据ID更新数据即可
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            try {
                if (key === "Datas") {
                    var list = data.Datas;
                    for (var j = 0; j < list.length; j++) {
                        if (DataFunction.Datas[list[j].ID]) {
                            DataFunction.Update(list[j]);
                        }
                        else {
                            DataFunction.Add(list[j], data);
                        }
                    }
                }
                else {
                    DataFunction.Datas[data.ID][key] = data[key];
                }
            }
            catch (e) {
                console.error(e);
                console.error(data);
            }
        }
    },

    /**
     * 删除数据
     * @param {Object} data 数据
     */
    Delete: function (data) {
        var id = data.ID;
        data = DataFunction.Datas[id];

        if (!data || !data.Type || !data.ID || !DataFunction.DataLinks.ContainsKey(data)) return;
        // 从源数据中移除即可
        Edbox.Array.Remove(DataFunction.DataLinks.Get(data).Datas, data);
        delete DataFunction.Datas[id];
    },

    /**
     * 格式化数据
     * @param {Object} data Data数据
     * @param {Object} tab Tab对象
     */
    ParseDatas: function (data, tab) {
        if (!data || !data.Type || !data.ID) return;
        if (!tab) return;

        if (DataFunction.Datas[data.ID]) {
            console.error("Config Error ID: " + data.ID);
            return;
        }
        DataFunction.Datas[data.ID] = data;
        DataFunction.DataLinks.Set(data, tab);

        if (!data.Datas) return;
        for (var i = 0; i < data.Datas.length; i++) {
            DataFunction.ParseDatas(data.Datas[i], data);
        }
    },

    /**
     * 初始化数据
     * @param {String} jsonPath Json路径
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    Init: function (jsonPath, success, error) {
        DataFunction.GetJson(jsonPath, function (data) {
            // 设置源数据
            DataFunction.DataSource = data;

            // 设置静态数据
            DataFunction.StaticData = data.StaticData;

            // 设置数据集
            for (var i = 0; i < data.Datas.length; i++) {
                DataFunction.ParseDatas(data.Datas[i], data);
            }
            if (success) success();
        }, function (e) {
            if (error) error(e);
        });
    }
};