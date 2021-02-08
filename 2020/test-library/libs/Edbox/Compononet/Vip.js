//支付功能组件
(function (namespace, className) {

    /**
    * 是否在大厅中打开
    */
    var IsOpenInLobby = false;

    /**
     * 检测是否在大厅中打开
     */
    function CheckOpenInLobby() {
        var func = function (e) {
            var from = e.source;
            var data = e.data;
            if (data && data.Type === "FunctionCall_IsOpenInLobby") {
                IsOpenInLobby = data.Datas[0];
            }
        };
        window.addEventListener("message", func, false);

        window.top.postMessage(
            {
                Type: "FunctionCall",
                Datas: [
                    "FunctionCall_IsOpenInLobby",
                    "return Edbox.Lobby !== undefined;"
                ]
            },
            "*"
        );
    }

    CheckOpenInLobby();

    /**
    * Api使用
    */
    var api = Edbox.Api.MMO;

    /**
    * 检测是是否可以跳转到编辑器页面
    */
    function AddPrecheckCreate() {

        //显示弹框
        function OpenConfirmIframe(context) {

            var confirmWindow = document.createElement("iframe");
            confirmWindow.id = "confirmVip";
            confirmWindow.setAttribute("src", getUrl());
            confirmWindow.style.width = "100%";
            confirmWindow.style.height = "100%";
            confirmWindow.style.overflow = "hidden";
            confirmWindow.style.position = "fixed";
            confirmWindow.style.top = "0";
            confirmWindow.style.left = "0";
            confirmWindow.style.height = "100%";
            confirmWindow.style.width = "100%";
            confirmWindow.style.margin = "0";
            confirmWindow.style.padding = "0";
            confirmWindow.style.border = "0";
            confirmWindow.style.zIndex = "9999";
            confirmWindow.style.border = "0";
            confirmWindow.style.background = "none";
            //ShowDom.style.backgroundColor = "#000";

            document.body.appendChild(confirmWindow);

            confirmWindow.onload = function () {
                var sendData = {
                    Type: 'Confirm_Refresh',
                    Datas: [context, Edbox.GetTip("TIP_CONFIRM"), Edbox.GetTip("TIP_CANCEL")]
                };

                confirmWindow.contentWindow.postMessage(sendData, "*");
            };

            window.addEventListener('message', function (event) {
                if (event.data.Type === 'Confirm_ClickConfirm') {
 
                    $("#confirmVip").remove();
                }
                else if (event.data.Type === 'Confirm_ClickCancel') {
                    $("#confirmVip").remove();
                }
            }, false);

            window.onresize = function () {
                confirmWindow.style.top = getPosTop();
            };

            function getPosTop() {
                return Math.max(0, (top.window.innerHeight - 644) / 2 + top.pageYOffset) + "px";
            }

            function getUrl() {
                var url = Edbox.Protocol + "://" + Edbox.GetHost("Component") + "/coms/Confirm/index.html";
                return url;
            }
        }

        var func = function(success, error){
                        // 获取模板信息
            function getTemplateInfo(success, error) {
                if (Edbox.Access === 1) {

                    if (success) success(Edbox.GameId, Edbox.Version);
                }
                else if (Edbox.Access === 2) {
                    Edbox.Api.MMO.GetPersonalAppInfo(Edbox.GameId, function (data) {

                        if (success) success(data.baseid, data.base_version);
                    }, error);
                }
                else if (Edbox.Access === 3) {
                    Edbox.Api.MMO.GetAppInfo(Edbox.GameId, function (data) {
                        if (success) success(data.baseid, data.base_version);
                    }, error);
                }
            }

            getTemplateInfo(function (templateId, version) {
                module.PrecheckCreate(templateId, version, function (limit) {
                    if (limit.limit) {
                        if (limit.info === "vip template"){
                            OpenConfirmIframe(Edbox.GetTip("VIP_TEMPLATE")); 
                        }
                        else{
                            OpenConfirmIframe(Edbox.GetTip("VIP_NOTCREATE"));
                        }

                        if (success) success({ ret: false, info: "create limit need vip up" });
                    }
                    else {
                        if (success) success({ ret: true });
                    }
                }, error);
            });

        };
  
        if (Edbox.PreGoEditor === undefined){
            Edbox.PreGoEditor = new Array();
        }

        Edbox.PreGoEditor = Edbox.PreGoEditor.concat({ type: "vipCreateProduct", func: func });
        
    }

    AddPrecheckCreate();
    
    function getVipInfo(vip_info){
        var data = new Object;
        //当前vip等级(int)
        data.vip_level = vip_info.vip_level;
        //vip_info.remain_time : 当前vip剩余有效时间（小时）
        data.remain_time = getLimitTime(vip_info.remain_time);
        data.current_list = new Array;
        if(vip_info.current_list && vip_info.current_list.length > 0){
            for(var i = 0; i < vip_info.current_list.length; i++){
                var vip = new Object;
                var item = vip_info.current_list[i];
                vip.vip_level = item.vip_level;
                vip.remain_time = getLimitTime(item.remain_time);
                //状态，0正在使用，1封存，2到期
                vip.status = item.status;
                data.current_list.push(vip);
            }
        }
        return data;
    }
            
    function getLimitTime(remain_time){
        if(remain_time === -1){
            remain_time = 9999999;
        }
        var t = new Date(new Date().getTime() + remain_time * 3600 * 1000);
        return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
    }

    var module = {
        
        /**
         * 监听Vip过期信息
         * @param {Object} data {}
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        VipExpireListen:function(data, success, error){
            var subscribeTheme = '/vip/duration/' + Edbox.EbUserId + '/overtime';
            Edbox.Mqtt.ConnectMqtt(subscribeTheme, function(message){
                if(message && message.destinationName === subscribeTheme && message.payloadString){
                    var result = JSON.parse(message.payloadString);
                    if(success && result){
                        success({'data':result});
                    }
                }
            });
        },
        
        /**
         * 获取用户vip信息
         * @param {Object} data {}
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetUserVipInfo: function(data, success, error){
            Edbox.Action.User.GetUserInfo(function (udata) {
                Edbox.UserVipInfo = getVipInfo(udata.vip_info);
                if(success){
                    success({'data':''});
                }
            }, function (err) {
                console.log(err);
                error();
            });
        },
        
        /**
         * 批量获取Vip信息
         * @param {Object} data {}
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetList: function(data, success, error){
            api.GetVipInfos(function(v){
                    var result = new Array;
                    if(v && v.items){
                        for(var i = 0; i < v.items.length; i++){
                            var ob = new Object;
                            var vItem = v.items[i];
                            for(var j = 0; j < Edbox.VipLimits.length; j++){
                                var mItem = Edbox.VipLimits[j];
                                if(vItem.vip_level === mItem.vip_level){
                                    //VIP等级, 0-免费 1-黄金 2-钻石
                                    ob.vip_level = vItem.vip_level;
                                    ob.price_list = new Array;
                                    for(var k = 0; k < vItem.price_list.length; k++){
                                        var pItem = vItem.price_list[k];
                                        var priceOb = new Object;
                                        //vip商品id
                                        priceOb.id = pItem.id;
                                        //购买价格
                                        priceOb.price = pItem.price;
                                        //原价
                                        priceOb.original_price = pItem.original_price;
                                        //有效时长（小时）
                                        priceOb.duration = pItem.duration;
                                        //购买类型： 年/月/季度  'year'/'month'/'quater'
                                        priceOb.type = pItem.duration_type;
                                        //展示信息
                                        priceOb.display_info = pItem.display_info;
                                        ob.price_list.push(priceOb);
                                    }
                                    //创作数量限制, 默认0个，-1表示无限制
                                    ob.create_limit = mItem.create_limit;
                                    //发布数量限制, 默认0个，-1表示无限制
                                    ob.release_limit = mItem.release_limit;
                                    //收益分成（百分比）
                                    ob.income_percent = mItem.income_percent;
                                    //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
                                    ob.export_limit = mItem.export_limit;
                                    //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
                                    ob.user_limit = mItem.user_limit;
                                    result.push(ob);
                                    break;
                                }
                            }
                        }
                    }
                    if(success)success({'data':result});
            }, error);
        },

        /**
         * 获取Vip信息
         * @param {Object} data { 
         *              {int} vip_level Vip类型}
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        Get: function (data, success, error) {
            api.GetVipInfo(data.vip_level, function(v){
                var ob = new Object;
                if(v){
                    for(var j = 0; j < Edbox.VipLimits.length; j++){
                        var mItem = Edbox.VipLimits[j];
                        if(v.vip_level === mItem.vip_level){
                            //VIP等级
                            ob.vip_level = v.vip_level;
                            ob.price_list = new Array;
                            for(var k = 0; k < v.price_list.length; k++){
                                var pItem = v.price_list[k];
                                var priceOb = new Object;
                                //vip商品id
                                priceOb.id = pItem.id;
                                //购买价格
                                priceOb.price = pItem.price;
                                //原价
                                priceOb.original_price = pItem.original_price;
                                //有效时长（小时）
                                priceOb.duration = pItem.duration;
                                //购买类型： 年/月/季度  'year'/'month'/'quater'
                                priceOb.type = pItem.duration_type;
                                //展示信息
                                priceOb.display_info = pItem.display_info;
                                ob.price_list.push(priceOb);
                            }
                            //创作数量限制, 默认0个，-1表示无限制
                            ob.create_limit = mItem.create_limit;
                            //发布数量限制, 默认0个，-1表示无限制
                            ob.release_limit = mItem.release_limit;
                            //收益分成（百分比）
                            ob.income_percent = mItem.income_percent;
                            //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
                            ob.export_limit = mItem.export_limit;
                            //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
                            ob.user_limit = mItem.user_limit;
                            break;
                        }
                    }
                }
                if(success)success({'data':ob});
            }, error);
        },

        /**
         * 获取Vip协议
         * @param {Object} param 空，数据格式
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetVipProtocol: function (param, success, error) {
            $.ajax({
                url: Edbox.ComponentRootPath + "Config/VipProtocol-" + Edbox.Area + "-"+Edbox.Language + ".json",
                type: "get",
                success: function (data) {
                    if (success && data && data.details) {
                        var result = new Object;
                        result.title = data.title;
                        result.detail = '';
                        for(var i = 0; i < data.details.length; i++){
                            result.detail = result.detail + '<p>' + data.details[i] + '</p>';
                        }
                        success({'data':result});
                    }
                },
                error: function (e) {
                    if (error) error("GetVipProtocol error");
                }
            });
        },

        /**
         * 创建订单并支付
         * @param {Object} data { 
         *              {String} item_id 商品id
         *              {int} quantity 商品数量
         *              {String} payment_channel 支付渠道}
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CreateOrder: function (data, success, error) {
            api.CreateOrder(data.item_id, data.quantity, Edbox.SDPAppId, function(order){
                console.log("CreateOrder return :" + order.order_id);
                Edbox.SdpWallet.PayOrder(data.payment_channel, order.order_id, success, error);
            }, error);
        },
        
        /**
         * 预检测保存作品
         * @param {String} productid 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        PreCreateProduct: function (productid, success, error) {
            // 模板回调
            function tempCallback(data) {
                if (data.access_type === 1) {
                    data.operation_type = 0;
                    api.PrecheckCreate(success, error);
                }
                else {
                    if (success) success();
                }
            }
            if (Edbox.Access === 1) {
                // 获取模板或个人作品信息
                module.GetInfo(productid, tempCallback, error);
            }
            else {
                if (success) success();
            }
        },

        /**
         * 预检测创建作品
         * @param {string} templateId 模板id
         * @param {string} version 模板版本
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        PrecheckCreate: function (templateId, version, success, error) {

            Edbox.MMO.GetVipInfo(templateId, version, function (data) {

                // 判断是vip模板返回
                if (data.isVip === 1) {
                    if (success) {
                        success({ limit: true, info: "vip template" });
                    }
                    return;
                }

                api.PrecheckCreate(function () {
                    if (success) success({ limit: false });
                }, function (err) {
                    if (err.responseJSON.code === "LOBBY/PRODUCT_CREATE_LIMIT") {
                        if (success) {
                            success({ limit: true, info: "create limit" });
                        }
                        return;
                    }

                    if (error) error(err);
                });
            });
        },


        /**
         * 当前权益限制
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetUserLimits: function (success, error) {
            api.GetUserLimits(success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Vip"));