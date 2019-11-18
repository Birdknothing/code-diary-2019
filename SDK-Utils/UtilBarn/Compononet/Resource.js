// UtilBarn 资源加载组件
(function (namespace, className) {
    // NDR API
    var api = UtilBarn.Api.NDR;

    /**
     * 是否为支持格式
     * @param {String} type 类型
     * @param {any} formats 格式
     * @returns {Boolean} 是否支持
     */
    function isMeet(type, formats) {
        if (!formats || formats.length === 0) {
            return true;
        }
        if (typeof formats === "string") {
            if (type.indexOf(formats) > 0) {
                return true;
            }
            return false;
        }
        for (var i = 0; i < formats.length; i++) {
            var format = formats[i];
            if (type.indexOf(format) > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * URL后缀是否为支持格式
     * @param {String} url URL数据
     * @param {any} formats 格式
     * @returns {Boolean} 是否支持
     */
    function isMeetUrl(url, formats) {
        if (!formats || formats.length === 0) {
            return true;
        }

        if (typeof formats === "string") {
            if (url.toLowerCase().endsWith(formats)) {
                return true;
            }
            return false;
        }

        for (var i = 0; i < formats.length; i++) {
            var format = formats[i].toLowerCase();
            if (url.toLowerCase().endsWith(format)) {
                return true;
            }
        }
        return false;
    }

    /**
     * UtilBarn 资源加载组件
     * 用于UtilBarn平台的资源加载过程
     * @author 温荣泉(201901)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn%E9%80%9A%E7%94%A8%E8%B5%84%E6%BA%90%E5%8A%A0%E8%BD%BD%E7%BB%84%E4%BB%B6JS%E7%89%88
     */
    var module = {


        /**
         * 请求资源
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {Boolean} async 是否异步
         */
        Get: function (guid, success, error, async) {
            if (async) {
                api.Get(guid, success, error);
                return;
            }
            var _url = '/v0.6/assets/' + guid + "?include=TI";
            var curl = UtilBarn.Protocol + "://" + UtilBarn.GetHost("NDR") + _url;
            $.ajax({
                url: curl,
                async: false,
                type: "GET",
                dataType: "json",
                success: function (ans) {
                    if (success)
                        success(ans);
                },
                error: function (err) {
                    if (error)
                        error(err);
                }
            });
        },

        /**
         * 请求音频地址
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数URL:String
         * @param {Function} error 出错回调
         * @param {any} formats 指定音频格式,例如mp3、ogg、[mp3、ogg] , 留空时获取源文件
         * @param {Boolean} async 是否异步
         */
        GetAudio: function (guid, success, error, formats, async) {
            module.Get(guid, function (data) {
                var location = data.tech_info.source.location.replace('${ref-path}', '');
                if (formats) {
                    location = "";
                    var keys = Object.keys(data.tech_info);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var obj = data.tech_info[key];
                        if (obj.format && isMeet(obj.format, formats)) {
                            location = obj.location.replace('${ref-path}', '');
                            break;
                        }
                    }
                    if (!location || location.length < 1) {
                        if (error) {
                            error("Formatting Error");
                        }
                        return;
                    }
                }
                var downloadUrl = UtilBarn.Protocol + "://" + UtilBarn.GetHost("CDNCS") + "/v0.1/static" + location;
                if (success)
                    success(downloadUrl);
            }, error, async);
        },

        /**
         * 请求图片地址
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数URL:String
         * @param {Function} error 出错回调
         * @param {any} formats 指定图片格式,例如png、jpeg、[png、jpeg] , 留空时获取源文件
         * @param {Boolean} async 是否异步
         */
        GetImage: function (guid, success, error, formats, async) {
            module.Get(guid, function (data) {
                var location = data.tech_info.source.location.replace('${ref-path}', '');
                if (formats) {
                    location = "";
                    var keys = Object.keys(data.tech_info);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var obj = data.tech_info[key];
                        if (obj.format && isMeet(obj.format, formats)) {
                            location = obj.location.replace('${ref-path}', '');
                            break;
                        }
                    }
                    if (!location || location.length < 1) {
                        if (error) {
                            error("Formatting Error");
                        }
                        return;
                    }
                }
                var downloadUrl = UtilBarn.Protocol + "://" + UtilBarn.GetHost("CDNCS") + "/v0.1/static" + location;
                if (success)
                    success(downloadUrl);
            }, error, async);
        },

        /**
         * 请求文字地址
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数URL:String
         * @param {Function} error 出错回调
         * @param {any} formats 指定图片格式,例如ttf、woff、[ttf、woff] , 留空时获取源文件
         * @param {Boolean} async 是否异步
         */
        GetFont: function (guid, success, error, formats, async) {
            module.Get(guid, function (data) {
                var location = data.tech_info.source.location.replace('${ref-path}', '');
                if (formats) {
                    location = "";
                    var keys = Object.keys(data.tech_info);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var obj = data.tech_info[key];
                        if (obj.location && isMeetUrl(obj.location, formats)) {
                            location = obj.location.replace('${ref-path}', '');
                            break;
                        }
                    }
                    if (!location || location.length < 1) {
                        if (error) {
                            error("Formatting Error");
                        }
                        return;
                    }
                }
                var downloadUrl = UtilBarn.Protocol + "://" + UtilBarn.GetHost("CDNCS") + "/v0.1/static" + location;
                if (success)
                    success(downloadUrl);
            }, error, async);
        },

        /**
         * 请求文字地址及预览图
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数[URL:String、预览图URL:String]
         * @param {Function} error 出错回调
         * @param {any} formats 指定图片格式,例如ttf、woff、[ttf、woff] , 留空时获取源文件
         * @param {Boolean} async 是否异步
         */
        GetFontWithPreview: function (guid, success, error, formats, async) {
            module.Get(guid, function (data) {
                var location = data.tech_info.source.location.replace('${ref-path}', '');
                var preview = data.preview.png.replace('${ref-path}', '');
                if (formats) {
                    location = "";
                    var keys = Object.keys(data.tech_info);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var obj = data.tech_info[key];
                        if (obj.location && isMeetUrl(obj.location, formats)) {
                            location = obj.location.replace('${ref-path}', '');
                            break;
                        }
                    }
                    if (!location || location.length < 1) {
                        if (error) {
                            error("Formatting Error");
                        }
                        return;
                    }
                }
                var downloadUrl = UtilBarn.Protocol + "://" + UtilBarn.GetHost("CDNCS") + "/v0.1/static" + location;
                var previewUrl = UtilBarn.Protocol + "://" + UtilBarn.GetHost("CDNCS") + "/v0.1/static" + preview;
                if (success)
                    success([downloadUrl, previewUrl]);
            }, error, async);
        },

        /**
         * 获取资源包，记录至PackageZip
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数Zip包:Object
         * @param {Function} error 出错回调
         * @param {Boolean} async 是否异步
         */
        GetPackage: function (guid, success, error, async) {
            UtilBarn.Package.GetPackage(guid, success, error, async);
        },

        /**
         * 获取配置，需先获取资源包
         * @param {String} name 配置名称
         * @param {Function} success 成功回调,带配置Json对象:Object
         * @param {Function} error 出错回调
         * @param {String} guid 资源服务器GUID,默认为当前游戏GUID
         */
        GetConfig: function (name, success, error, guid) {
            UtilBarn.Package.GetConfig(name, success, error, guid);
        },

        /**
         * 读取Package数据包的数据到Datas对象中
         * @param {Object} datas Datas对象
         * @param {Function} success 成功回调，带参数Datas对象
         * @param {Function} error 出错回调
         */
        LoadDatas: function (datas, success, error) {
            if (!datas || !datas.Datas) {
                if (error)
                    error("Datas Error");
                return;
            }

            // 平层的数据结构(传入参数)
            var Datas = new Object();

            // 构造个临时的对象池(存放package包数据)
            var packageDatas = new Object();

            // 游戏传来数据中模板数据
            var templateLst = {};

            Init(datas, success, error);

            // 初始化资源加载
            function Init(datas, success, error) {
               
                // 读取AssetConfig
                function GetAssetConfig(callback) {
                    UtilBarn.Package.GetConfig("AssetConfig", function (data) {
                        // 读取出资源包里的资源表
                        var assets = data.Assets;
                        for (var i = 0; i < assets.length; i++) {
                            var asset = assets[i];
                            ReadAsset(asset);
                        }
                        if (callback) callback(datas);
                    }, error);
                }

                // 读取TxtConfig
                function GetTxtConfig(callback) {
                    UtilBarn.Package.GetConfig("TxtConfig", function (data) {
                        // 读取出资源包里的资源表
                        var assets = data.Txts;
                        for (var i = 0; i < assets.length; i++) {
                            var asset = assets[i];
                            ReadText(asset);
                        }
                        if (callback) callback(datas);
                    });
                }

                // 读取DatasConfig
                function GetDatasConfig(finish) {

                    UtilBarn.Package.GetConfig("DatasConfig", function (data) {

                        if (!data) return;   

                         // 静态数据直接赋值
                        datas.StaticData = data.StaticData;
                        // 设置初始静态数据
                        if (!datas.StaticData) {
                            datas.StaticData = new Object();
                            datas.StaticData.ID = "StaticData";
                            datas.StaticData.Name = "StaticData";
                            datas.StaticData.Type = "StaticData";
                            datas.StaticData.ShowName = "静态数据";
                            datas.StaticData.Datas = new Array();
                        }
               
                        // 读取Package包中的配置数据列表
                        var list = data.Datas;
                        for (var i = 0; i < list.length; i++) {
                            var obj = list[i];
                            packageDatas[obj.ID] = obj;
                        }

                        if (finish) finish();
      
                    }, finish);
                }

                // 加载数据
                function load(guid) {
                    // 加载资源包
                    UtilBarn.Package.GetPackage(guid, function () {
                        // 读取package包数据
                        GetDatasConfig(function(){
                            // 读取txt包数据
                            GetTxtConfig(function () {
                                // 读取asset数据
                                GetAssetConfig(function () {
                                    // 读取 static 数据
                                    ReadStaticData(function () {
                                        ReadDatas();
                                        if (success) success(datas);
                                    });
                                });
                            });
                        });
                    }, function (err) {
                        console.log(err);
                        if (error) error("Illegal Game");
                    });
                }

                // 根据GUID开始加载数据
                if ((!UtilBarn.PackageGuid || UtilBarn.PackageGuid.length < 10) && (!UtilBarn.GameId || UtilBarn.GameId.length < 1)) {
                    if (error) error("GameId is Empty");
                    return;
                }
                if (UtilBarn.PackageGuid && UtilBarn.PackageGuid.length > 10) {
                    load(UtilBarn.PackageGuid);
                }
            }

            // 赋值基础数据
            function ReadDatas() {

                if (!datas) return;
       
                // 构造个可编辑Tab的对象池
                var EditableDatas = new Object();

                // 传入package数据
                loadPackage(datas);

                // 清空编辑项
                clearLink();
                // 加载编辑项
                loadLink();
                // 模板数据填充
                loadTemplate(); 
                // 序列化编辑项
                sortlink();

                // 加载传入配置表数据到datas中
                // 这里使用递归读取传入数据
                function loadPackage(temp) {

                    var tempList = temp.Datas;
                    if (!tempList) return;
                    for (var i = 0; i < tempList.length; i++) {
        
                        //传入数据的元数据          
                        var obj = tempList[i];

                        if (obj.ID) {
                            Datas[obj.ID] = obj;
                        }    

                        if (packageDatas[obj.ID]){
 
                               // select 处理 多语言直接是用Items数据
                               if(obj.Type.indexOf("Select0") === 0){

                                if (obj.Type !== "Select03"){
                                    if (obj.Items.indexOf(packageDatas[obj.ID].Value) < 0){
                                        packageDatas[obj.ID].Value = obj.Value;
                                    }
                                }
                                else{
                                    for(var m=0; m<packageDatas[obj.ID].Value.length; ++m){
                                       
                                        if (obj.Items.indexOf(packageDatas[obj.ID].Value[m]) < 0){
                                            packageDatas[obj.ID].Value = obj.Value;
                                            break;
                                        }                  
                                    }                       
                                }

                                packageDatas[obj.ID].Items = obj.Items;
                            }
                            
                            // 多语言 showName 处理
                            if (obj.ShowName){
                                // tab 拓展处理 
                                if(obj.Type.indexOf("Tab") === 0){
                                    packageDatas[obj.ID].ShowName = obj.EditableContent || obj.ShowName;
                                }
                                else{
                                    packageDatas[obj.ID].ShowName = obj.ShowName;
                                }
                            }

                            // 游戏编辑器可编辑显示内容拓展 ShowName_Override 
                            if (obj.ShowName_Override){
                                packageDatas[obj.ID].ShowName_Override = obj.ShowName_Override;
                            }

                            // 将datas中包含额外数据放入package数据中(多语言数据)
                            var dkeys = Object.keys(Datas[obj.ID]);
                            for (var j = 0; j < dkeys.length; j++) {
                                var dkey = dkeys[j];

                                /* 游戏编辑器可编辑显示内容拓展
                                 * http://ndsdn.nd.com.cn/index.php?title=UtilBarn%E6%B8%B8%E6%88%8F%E7%BC%96%E8%BE%91%E5%99%A8%E5%8F%AF%E7%BC%96%E8%BE%91%E6%98%BE%E7%A4%BA%E5%86%85%E5%AE%B9%E6%8B%93%E5%B1%95%E5%8F%82%E6%95%B0%E5%AE%9A%E4%B9%89
                                 *
                                 */        
                                if ( dkey.indexOf("Text") > 0 && dkey.indexOf ("_Override")>0 ){                          
                                    packageDatas[obj.ID][dkey.replace("_Override", "")] = obj[dkey];
                                }
                        
                                if (packageDatas[obj.ID][dkey] === undefined){
                                    packageDatas[obj.ID][dkey] = Datas[obj.ID][dkey];
                                }                  
                            }   

                            // package元数据和传参原数据做并集处理
                            var keys = Object.keys(packageDatas[obj.ID]);
                            for (var m = 0; m < keys.length; m++) {
                                var key = keys[m]; 
                                obj[key] = packageDatas[obj.ID][key];                  
                            }
                        }   

                        // Tab03处理
                        if (obj.Type && obj.Type === "Tab03"){

                            // 如果 Editable 未设置, 则使用父节点Tab的 Editable 值
                            if (obj.Editable === undefined){                  
                                if (temp.Type.indexOf("Tab") > -1){
                                    obj.Editable = temp.Editable;
                                } 
                            }
                        } 
 
                        // select 处理
                        else if(obj.Type && obj.Type.indexOf("Select") === 0 && obj.Items.length > 0){
                            obj.Value = !obj.Value ? obj.Items[0] : obj.Value;                            
                            
                            // 兼容: 判断Keys是否存在,不存在则之间使用Items数据
                            if (!obj.Keys){
                                obj.Keys = obj.Items;
                            }

                            if (!obj.Key){

                                // keys数据异常则重新生成Keys
                                if (!obj.Keys || obj.Keys.length !== obj.Items.length){
                                    obj.Keys = new Array();
                                    for(var z=0; z<obj.Items.length; ++z){
                                        obj.Keys.push(obj.Items[z]);
                                    }                                         
                                }
 
                                // 生成Key数据
                                // 多选判断
                                if (obj.Type === "Select03"){

                                    obj.Key = new Array();

                                    for(var y=0; y<obj.Value.length; ++y){
                                
                                        if (obj.Items.indexOf(obj.Value[y]) > -1){
                                            obj.Key.push(obj.Value[y]);
                                        }                  
                                    }                       
                                }
                                else{
                                
                                    if (obj.Items.indexOf(obj.Value) > -1){
                                        obj.Key = obj.Value;
                                    }
                                    else{
                                        obj.Key = obj.Items[0];
                                    }
                                }
                                
                                obj.Value = obj.Key;
                            }  
                            else{
                                // 效验Items中的数据和Keys数据是否一致
                                if (obj.Keys.length !== obj.Items.length)
                                {
                                    // 数据格式错误
                                    console.error(obj.ID + " Keys length is not equal Items length !");
                                }
                                else{
                                    // 多选判断
                                    if (obj.Type === "Select03"){
                                        
                                        obj.Value = new Array();

                                        for(z=0; z<obj.Key.length; ++z){
                                            if (obj.Keys.indexOf(obj.Key[z])>-1){
                                                obj.Value.push(obj.Items[z]);
                                            }
                                        }       
                                    }
                                    else{
                                        var findex =obj.Keys.indexOf(obj.Key);
                                        if (findex > -1){                            
                                            obj.Value = obj.Items[findex];
                                        }
                                        else{
                                            obj.Value = obj.Items[0];
                                        }
                                    }
                                }                       
                            }                               
                        }  

                        // 记录可编辑数据
                        if (obj.Editable) {
                            EditableDatas[obj.ID] = obj;              
                        }

                        // 记录模板数据
                        if (obj.Template){
                            templateLst[obj.ID] = obj.Template_Override || obj.Template;
                        }

                        if (obj.Datas) {                       
                            loadPackage(obj);
                        }
                    }
                }

                // 清空编辑项
                function clearLink() {
                    var keys = Object.keys(EditableDatas);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var data = EditableDatas[key];

                        data.Datas = new Array();
                    }
                }

                // 加载编辑项
                function loadLink() {
                    var keys = Object.keys(packageDatas);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var data = packageDatas[key];
                        //if (Datas[data.ID]) continue;
                        if (!data.ParantID) continue;

                        var parent = EditableDatas[data.ParantID];
                        if (!parent) continue;

                        parent.Datas.push(data);

                        // 重新建立对Datas中数据的引用
                        if (EditableDatas[data.ID]){
                            data.Datas = EditableDatas[data.ID].Datas;    
                        }

                        // 检测和Template的关联数据
                        if (templateLst[key]){
                            data.Template = templateLst[key];
                        }
                    }

                    var add = false;

                    // 父节点和子节点关联检测
                    for (i = 0; i < keys.length; i++) {
                        key = keys[i];
                        data = packageDatas[key];

                        if (EditableDatas[key]) continue;
                        if (data.ParantID === undefined) continue; 
                        if(!data.ParantID) continue;
                        if (EditableDatas[data.ParantID]) continue;

                        parent = packageDatas[data.ParantID];
                        if (!parent) continue;

                        if (parent.Datas === undefined) {
                            parent.Datas = new Array();
                        }

                        add = true;
                        
                        for (var j = 0; j < parent.Datas.length; j++) {
                            if (parent.Datas[j].ID === data.ID){
                                add = false;
                                break;
                            }  
                        }

                        if (add){
                            parent.Datas.push(data);
                        }
                    }
                }

                // 模板内容处理
                function loadTemplate(){
                    var keys = Object.keys(packageDatas);

                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var data = packageDatas[key]; 
                        
                        if (!data.Datas) continue;

                        // 模板属于同一个父节点下
                        if (!templateLst[data.ParantID] || !templateLst[data.ParantID].Datas) continue;

                        for(var n=0; n< templateLst[data.ParantID].Datas.length; ++n){
                
                            var tempItem = templateLst[data.ParantID].Datas[n];
                            if(!data.Datas[n]) continue;

                            // 模板匹配不做ID验证, 因为模板id总是数组第一个数据的ID
                            //if (tempItem.ID !== data.ID) continue;           
                           
                            var tdata = data.Datas[n];

                            //if (tdata.ID !== tempItem.ID) continue;

                            // 多语言设置
                            if (tempItem.ShowName){
                                tdata.ShowName = tempItem.ShowName;
                            }

                            var tkeys = Object.keys(tempItem);

                            for (var m = 0; m < tkeys.length; m++) {
                                var tkey = tkeys[m];
                                if (!tdata[tkey] && tempItem[tkey]){
                                    tdata[tkey] = tempItem[tkey];
                                }
                            }                  
                        }              
                    }
                }

                // 序列化编辑项
                function sortlink() {
                    var compare = function (x, y) {
                        if (x.ParantIndex < y.ParantIndex) {
                            return -1;
                        } else {
                            return 1;
                        }
                    };

                    var keys = Object.keys(EditableDatas);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var data = EditableDatas[key];
                        data.Datas = data.Datas.sort(compare);
                    }
                }
            }

            // 读取资源信息
            function ReadAsset(asset) {
                var keyname;

                var keys = Object.keys(asset);

                for (var i = 0; i < keys.length; i++) {
                    var name = keys[i];
                    if (name === "AssetPath") continue;        
                    if (name === "AssetGUID") continue;
                    if (name === "AssetType") continue;
                    if (name === "Platform") continue;
                    keyname = name;
                    break;
                }

                var data = packageDatas[keyname];
                if (!data) return;

                data.GUID = asset.AssetGUID ? asset.AssetGUID : "";
                if (data.GUID === "") {
                    data.Value = asset.AssetPath;
                }
                else {
                    data.Value = null;
                }       
            }

            // 读取文本信息
            function ReadText(texts) {
                var keyname;

                var keys = Object.keys(texts);
                for (var i = 0; i < keys.length; i++) {
                    var name = keys[i];
                    if (name === "Text") continue;
                    keyname = name;
                    break;
                }

                var data = packageDatas[keyname];
                if (!data) return;
                data.Value = texts.Text;

            }

            // 读取其他配置信息
            function ReadStaticData(callback) {

                var lstName = [];

                for (var key in UtilBarn.Package.PackageZip.files) {
                    var o = UtilBarn.Package.PackageZip.files[key];
                    if (o.dir) continue;

                    var preIndex = o.name.indexOf("package/Config/");
                    var startIndex = o.name.lastIndexOf("/");
                    var lastIndex = o.name.indexOf(".json");

                    if (preIndex >= 0 && lastIndex > startIndex) {
                        var name = o.name.substring(startIndex + 1, lastIndex);

                        // 非静态文本跳过
                        if (name === 'AssetConfig' ||
                            name === 'DatasConfig' ||
                            name === 'TxtConfig' ||
                            name === 'GameBaseConfig')
                            continue;

                        lstName.push(name);
                    }
                }

                for (var i = 0; i < lstName.length; i++) {
                    var elename = lstName[i];

                    UtilBarn.Package.GetConfig(elename, function (data) {
                        datas.StaticData[elename] = data;
                        if (elename === lstName[lstName.length - 1]) {
                            if (callback) callback();
                        }
                    });
                }

                if (lstName.length === 0) {
                    if (callback) callback();
                }
            }
      
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "Resource"));