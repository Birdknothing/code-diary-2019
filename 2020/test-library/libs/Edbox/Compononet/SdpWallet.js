//支付功能组件
(function (namespace, className) {

    var payChannel = ["CHANNEL_ALIPAY_QR", "CHANNEL_WECHAT_PUB_QR"];

    var api = Edbox.Api.MMO;

    var module = {
        CashType: '',
        CashTypeFormat: '',
        Init: function(success){
            if(window.SdpWalletSDK){
                var data = new Object();
                data.AccountId = Edbox.AccountId;
                data.AccessToken = Edbox.AccessToken;
                data.MacKey = Edbox.MacKey;
                data.TimeStamp = Edbox.TimeStamp;
                data.Env = Edbox.SdpWalletEnv;
                data.Language = Edbox.Language === "SimplifiedChinese" ? "zh-CN" : "en-US";
                data.SdpAppId = Edbox.SDPAppId;
                window.SdpWalletSDK.init(data).then(function(){
                    module.GetBalanceSDK(function (o) {
                        Edbox.SdpWallet.CashType = o.cash;
                        Edbox.SdpWallet.CashTypeFormat = o.cash_prefix;
                        if (success) success();
                    });
                });
            }
        },
        /**
         * 获取产品列表
         * @param {object} ob {
         *          {int} page 页码
         *          {int} count 个数 }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetProductList: function (ob, success, error) {
            if(window.SdpWalletSDK){
                window.SdpWalletSDK.getProductList('virtualMoney', ob.page, ob.count).then(function(data){
                    var resultOb = new Object();
                    resultOb.total = data.total;
                    resultOb.items = new Array;
                    for(var i = 0; i < data.rows.length; i++){
                        var item = data.rows[i];
                        var result = new Object();
                        result.id = item.id;
                        result.name = "EdCoin";
                        result.num = item.num;
                        result.price = item.price.toFixed(2);
                        resultOb.items.push(result);
                    }
                    if(success)success({ "data": resultOb });
                }).catch(function(err){
                    console.log("err :" + err);
                    if (error) error(err);
                });
            }
        },

        /**
         * 获取支付渠道
         * @param {object} ob 空，格式用
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetPayChannelList:function(ob, success, error) {
            if(window.SdpWalletSDK){
                var payment_channels = new Array;
                if(Edbox.SdpWallet.CashType === "CHANNEL_CASH"){
                    payment_channels.push('CHANNEL_ALIPAY_BANK');
                    payment_channels.push('CHANNEL_WECHAT_PUB_QR');
                }
                
                if(Edbox.SdpWallet.CashType === "CASH_USD"){
                    payment_channels.push('CHANNEL_PAYPAL_WEB');
                }
                window.SdpWalletSDK.getPayChannel('', 'default', '', Edbox.SdpWallet.CashType, payment_channels, null).then(function(data) {
                    var pay_channelList = new Array();
                    for (var i = 0, n = data.length; i < n; i++) {
                        if(data[i].channel_name === 'CHANNEL_ALIPAY_BANK'){
                            pay_channelList.push(data[i].channel_name);
                            break;
                        }
                    }
                    for (var i = 0, n = data.length; i < n; i++) {
                        if(data[i].channel_name !== 'CHANNEL_ALIPAY_BANK'){
                            pay_channelList.push(data[i].channel_name);
                        }
                    }
                    if (success) success({ "data": pay_channelList });
                }).catch(function(err){
                    console.log("err :" + err);
                    if (error) error(err);
                });
            }
        },

        /**
         * 创建并支付订单
         * @param {object} ob {
         *          {int} channel 支付渠道 如CHANNEL_ALIPAY_BANK
         *          {int} id 商品id }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        PayOrderWithCreate: function (ob, success, error) {
            pay_source = 3;
            if (window.SdpWalletSDK) {
                var uid = Edbox.AccountId;
                window.SdpWalletSDK.createChargeOrder(uid, pay_source, ob.channel, ob.id, "").then(function(data) {
                    Edbox.SdpWallet.PayOrder(data.payment_channel, data.order_id, success, error);
                }).catch(function(err) {
                    console.log("createChargeOrder Err :" + err);
                    if (error) error(err);
                });
            }
        },

        /**
         * 支付订单
         * @param {String} payment_channel 支付渠道 如CHANNEL_ALIPAY_BANK
         * @param {String} order_id 订单id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        PayOrder: function (payment_channel, order_id, success, error) {
            var payOrderParams = {
                payment_channel: payment_channel,
                order_id: order_id
            };
            window.SdpWalletSDK.payOrder(Edbox.AccountId, payOrderParams, "").then(function(data) {
                if (success) success({ "data": data });
            }).catch(function(err) {
                console.log("PayOrder Err :" + err);
                if (error) error(err);
            });
        },

        /**
         * 获取商户币种
         * @param {Object} data{
         *            componentId:组件id
         *            appProductServiceId:商户id
         * }如果都不传，则返回该组织目前支持的所有货币种类
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        QueryCurrency: function (data,success, error) {
            if (window.SdpWalletSDK) {
                window.SdpWalletSDK.queryCurrency(data.componentId, data.appProductServiceId).then(function(data) {
                    console.log(data);
                }).catch(function(err) {
                    console.log("err :" + err);
                    if (error) error(err);
                });
            }
        },

        /**
         * 获取用户代币余额
         * @param {object} ob 空，格式用
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetUserBalance: function (ob, success, error) {
            Edbox.SdpWallet.GetBalanceSDK(function(o){
                var data = new Object();
                data.balance = o.balance;
                if(success)success({'data':data});
            }, error);
        },

        /**
         * 获取代币对应充值币种
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetBalanceSDK: function (success, error) {
            if (window.SdpWalletSDK) {
                window.SdpWalletSDK.getBalance('CHANNEL_EMONEY', 1).then(function(data) {
                    if (data.items.length > 0) {
                        var cash = new Object;
                        cash.cash = data.items[0].cash;
                        cash.cash_prefix = data.items[0].cash_prefix;
                        cash.balance = data.items[0].balance; 
                    }
                    if (success) success(cash);
                }).catch(function(err) {
                    console.log("err :" + err);
                    if (error) error(err);
                });
            }
        }
    };
    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox,"SdpWallet"));