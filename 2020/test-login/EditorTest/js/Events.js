// 添加新增数据事件
Edbox.Message.AddMessageHandler("Add", function (datas, com) {
    var tab = datas[0];
    var data = datas[1];
    console.log(["Add", tab, data]);
    DataFunction.Add(tab, data);
});

// 添加更新数据事件
Edbox.Message.AddMessageHandler("Update", function (datas, com) {
    var data = datas[0];
    console.log(["Update", data]);
    DataFunction.Update(data);

    if (!data.Type && data.Datas) {
        for (var i = 0; i < data.Datas.length; i++) {
            DataFunction.Update(data.Datas[i]);
        }
        if (data.StaticData)
            DataFunction.Update(data.StaticData);
    }

    if (data.Type && data.Type.indexOf("Image") < 0 && data.Type.indexOf("Audio") < 0) return;
    if (!data.GUID || !data.SourceValue) return;

    // 更新记录数据
    Redirect.Set(data.SourceValue, data.Value);
    Edbox.Message.Broadcast("Update", [DataFunction.StaticData]);
});

// 添加删除数据事件
Edbox.Message.AddMessageHandler("Delete", function (datas, com) {
    var data = datas[0];
    console.log(["Delete", data]);
    DataFunction.Delete(data);
});

// 添加菜单中Tab被选中事件
Edbox.Message.AddMessageHandler("TabClick", function (datas, com) {
    var tab = datas[0];
    console.log(["TabClick", tab]);
});

// 初始化
Edbox.Start(function (isLogin) {
    // 设置初始化事件
    function Init() {
        console.log(DataFunction.DataSource);
        Edbox.Message.Broadcast("Init", [DataFunction.DataSource]);
    }

    // 初始化数据
    DataFunction.Init("Configs/" + Edbox.Language + ".json", function () {
        // 初始化重定向数据
        //if (!DataFunction.StaticData.Redirect || !DataFunction.StaticData.Redirect.Redirect) {
        //    DataFunction.StaticData.Redirect = new Object();
        //    DataFunction.StaticData.Redirect.Redirect = new Array();
        //}
        //Redirect.Init(DataFunction.StaticData.Redirect.Redirect);

        var keys = Object.keys(DataFunction.Datas);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var data = DataFunction.Datas[key];
            if (data.SourceValue && data.Value.startsWith("/")) {
                data.Value = location.origin + location.pathname.substring(0, location.pathname.lastIndexOf("/")) + "/Assets" + data.Value;
            }
        }

        // 执行初始化
        if (Edbox.Message.MessageList && Edbox.Message.MessageList.length > 0) {
            // 如果已建立连接，直接初始化
            Init();
        }
        else {
            // 如果未建立连接，建立连接后初始化
            Edbox.Message.ConnectCallback = function () {
                Init();
            };
        }
    }, function (err) {
        console.log(["初始化失败", err]);
    });
});