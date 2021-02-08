// WebSocket接收MQTT消息
(function (namespace, className) {
    /**
    * paho-mqtt库路径
    */
    var MqttPath = Edbox.ComponentRootPath + "ThirdParty/mqtt/Paho-Mqtt.js";
    var config = {
        /**
         * MQTT配置
         */
        MqttConfig: {
            QA: {
                IP: "mqtt.edbox-qa.101.com",
                Port: "8083",
                Account: "edbox_client_inland",
                Password: "kkclient2018.inland"
            },
            Dev: {
                IP: "mqtt.edbox-dev.101.com",
                Port: "8083",
                Account: "admin",
                Password: "public"
            },
            Feature: {
                IP: "mqtt.edbox-feature.101.com",
                Port: "8083",
                Account: "",
                Password: ""
            },
            CN: {
                IP: "mqtt.edbox-cn.101.com",
                Port: "8082",
                Account: "edbox_client_inland",
                Password: "kkclient2018.inland"
            },
            US: {
                IP: "mqtt.edbox.101.com",
                Port: "8082",
                Account: "edbox_client",
                Password: "kkclient2018"
            },
            BetaCN: {
                IP:"mqtt.edbox-beta-cn.101.com",
                Port:"8082",
                Account:"edbox_client_beta_cn",
                Password:"kkclient2018.beta_cn"
            },
            Beta: {
                IP:"mqtt.edbox-beta.101.com",
                Port:"8082",
                Account:"edbox_client_beta_en",
                Password:"kkclient2018.beta_en"
            }
        }
    };
    /**
     * Paho-mqtt封装
     */
    var module = {
        client:null,
        mqttStatus:false,
        options:{},
        onConnect:function(){
            mqttStatus = true;
            if(options && options.success){
                options.success();
            }
        },
        onFailure:function(){
            mqttStatus = false;
            if(options && options.error){
                options.error();
            }
        },
        onConnectionLost:function(responseObject){
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:"+responseObject.errorMessage);
                console.log("连接已断开");
                mqttStatus = false;
                if(options && options.connectLost){
                    options.connectLost(responseObject.errorMessage);
                }
            }
        },
        onMessageArrived:function(message){
            //console.log(message);
            if(options && options.onMessage){
                options.onMessage(message);
            }
            
            if(options && options.onMessageDic){
                for (var i = 0; i < options.onMessageDic.Keys.length; i++) {
                    var key = options.onMessageDic.Keys[i];
                    var cb = options.onMessageDic.Get(key);
                    if(cb)cb(message);
                }
            }
        },
        sendMessage:function(topic,obj){
            if(mqttStatus){
                var message = new Paho.MQTT.Message(JSON.stringify(obj));
                message.destinationName = topic;
                if(Edbox.Mqtt.client && mqttStatus){
                    Edbox.Mqtt.client.send(message);
                    return true;
                }
            }
            return false;
        },
        subscribe:function(topic,qos){
            if(Edbox.Mqtt.client && mqttStatus){
                Edbox.Mqtt.client.subscribe(topic,{qos:qos || 0});//订阅主题
                return true;
            }
            return false;
        },
        unsubscribe:function(topic){
            if(Edbox.Mqtt.client && mqttStatus){
                Edbox.Mqtt.client.unsubscribe(topic);//取消订阅主题
                return true;
            }
            return false;
        },
        reconnect:function(){
            if(Edbox.Mqtt.client && options){
                Edbox.Mqtt.client.connect({
                    onSuccess:Edbox.Mqtt.onConnect,
                    onFailure:Edbox.Mqtt.onFailure,
                    userName: options.userName || 'admin',  
                    password: options.password ||'password',
                    useSSL: Edbox.Protocol === 'https'
                });
                return true;
            }
            return false;
        },
        init:function(op){
            Require([MqttPath], function () {
                if(op){
                    options = op;
                    Edbox.Mqtt.client = new Paho.MQTT.Client(options.ip || '127.0.0.1', Number(options.port || 61623), options.id || '0');
                    Edbox.Mqtt.client.connect({
                        onSuccess:Edbox.Mqtt.onConnect,
                        onFailure:Edbox.Mqtt.onFailure,
                        userName: options.userName,
                        password: options.password,
                        password: options.password,
                        useSSL: Edbox.Protocol === 'https'
                    });
                    Edbox.Mqtt.client.onConnectionLost = Edbox.Mqtt.onConnectionLost;//注册连接断开处理事件
                    Edbox.Mqtt.client.onMessageArrived = Edbox.Mqtt.onMessageArrived;//注册消息接收处理事件
                }
            });
        },
        /**
         * 连接MQTT服务端
         * @param {String} subscribeTheme 主题
         * @param {Function} cb 出错回调
         */
        ConnectMqtt: function (subscribeTheme, cb) {
            if(Edbox.Mqtt.client){
                if(options.onMessageDic.ContainsKey(subscribeTheme)){
                    var v = options.onMessageDic.Get(subscribeTheme);
                    v = cb;
                }else{
                    options.onMessageDic.Set(subscribeTheme, cb);
                }
                
                if(mqttStatus){
                    Edbox.Mqtt.subscribe(subscribeTheme);
                }else{
                    options.success = function(){
                        Edbox.Mqtt.subscribe(subscribeTheme);
                    };
                    Edbox.Mqtt.reconnect();
                }
            }else{
                var isHttps = Edbox.Protocol === 'https';
                var mqttConfig = config["MqttConfig"][Edbox.ServerKey];
                var port = mqttConfig["Port"];
                if(isHttps){
                    port = 8086;
                }
                var msgDic = new Dictionary();
                msgDic.Set(subscribeTheme, cb);
                Edbox.Mqtt.init({
                    id:'mqttjs_' + Math.random().toString(16).substr(2,8),
                    ip:mqttConfig["IP"],
                    port:port,
                    userName:mqttConfig["Account"],
                    password:mqttConfig["Password"],
                    success:function(){
                        Edbox.Mqtt.subscribe(subscribeTheme);
                    },
                    error:function(){
                        console.log("连接已断开");
                    },
                    connectLost:function(){
                        Edbox.Mqtt.reconnect();
                    },
                    onMessageDic:msgDic
                });
            }
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Mqtt"));