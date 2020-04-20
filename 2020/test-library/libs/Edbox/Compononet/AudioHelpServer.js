/**
 * 音频服务站
 * 用于音频服务站提供转码服务
 * @author 张涛（120100）
 * @version 1.0.0 (2019年11月27日)
 * @see
 * Js需求:`
 *      jquery
 *      CryptoJS
 *      Edbox
 *      Edbox_Request
 * */
(function (namespace, className) {

    GetEnv = function () {
        if(Edbox.serverKey === "US" || Edbox.serverKey === "Beta"){
            return 1;
        }
        return 0;
    };
    
    var SubscribeTheme = '';
    
    var TranListener = new Dictionary();

    /**
     * Edbox 图片搜索组件
     * @author 余晓(871129)
     * @see 
     * */
    var module = {
        
        /**
         * 初始化
         * @param {object} data 空，格式使用
         * @param {Function} success 成功回调,带参数Data:{Guid}
         * @param {Function} error 失败回调
         */
        Init: function(data, success, error){
            SubscribeTheme ='server/videoEditor/userTask/userId/' + Edbox.AccountId;
            Edbox.Mqtt.ConnectMqtt(SubscribeTheme, Edbox.AudiohelpServer.GetMessage);
        },
        
        /**
         * 获取MQTT消息推送
         * @param {string} message mqtt消息
         */
        GetMessage: function(message){
            if(message && message.destinationName === SubscribeTheme && message.payloadString){
                console.log('AudiohelpServer GetMessage : ' + message.payloadString);
                var data = JSON.parse(message.payloadString);
                if(data && TranListener.ContainsKey(data.new_guid)){
                    var finishCb = TranListener.Get(data.new_guid);
                    if(finishCb){
                        finishCb({"guid":data.new_guid, "url":data.ndr_path, "status":data.status});
                    }
                }
            }
        },
        
        /**
         * 添加转码监听
         * @param {string} resId 资源id
         * @param {Function} finishCb 成功回调
         */
        AddListener: function(resId, finishCb){
            console.log('AudiohelpServer AddListener : ' + resId);
            TranListener.Set(resId, finishCb);
        },
        
        /**
         * 转码音频数据
         * @param {string} audioGuid 需要转码的音频guid
         * @param {Function} success 成功回调,带参数Data:{Guid}
         * @param {Function} error 失败回调
         */
        HandleSendTranAudio: function (audioGuid, success, error) {
            var subUrl = "/v0.1/api/videoEditor/videoEditor/actions/tran_audio";
            var env = GetEnv();
            var data = {
                guid : audioGuid,
                env : env,
                category:"$RA1206001"
            };  

            Edbox.Request.Post(Edbox.GetHost("MMO"), subUrl, JSON.stringify(data), function(suc){
                if (success) success(suc.guid);
            }, function(err){
              var tip = "audio_Trans_error";
              switch(err.code){
                  case 'VIDEOEDITOR_CUTAUDIO/DOWNLOAD_NDR_FILE_ERROR':
                      tip = "audio_file_error";
                      break;  
                  case 'VIDEOEDITOR_CUTAUDIO/FFMPEG_HANLDE_ERROR':
                      tip = "audio_hanlde_error";
                      break; 
                  case 'VIDEOEDITOR_CUTAUDIO/FILE_NOT_EXISTS':
                      tip = "audio_cutnotexist_error";
                      break; 
                  case 'VIDEOEDITOR_CUTAUDIO/FILE_SIZE_IS_ZERO':
                      tip = "audio_cutzero_error";
                      break; 
                   case 'VIDEOEDITOR_CUTAUDIO/UPLOAD_FILE_TO_NDR_ERROR':
                      tip = "audio_upload_error";
                      break;     
                      
                  default:
                      break;                         
              }
              var errResult = new Object();
              errResult.code = tip;
              errResult.message="没有转码成功";
              if (error) {error(errResult);}
            });
        },

        /**
         * 根据guid获取音频任务状态
         * @param {string} guid 音频guid
         * @param {Function} success 成功回调 为空说明无次裁切任务 {
         *        {string} guid 裁切后的guid
         *        {string} origuid 裁切的原guid
         *        {string} status 状态 任务状态,init：任务初始化，download:文件下载完成，handle:文件处理完成, finish:文件上传到ndr成功
         *        {number} starttime 开始时间
         *        {number} endtime 结束时间
         * }
         * @param {Function} error 出错回调
         */
        GetAudioTranTask: function (guid, success ,error) {
            var subUrl = "/v0.1/api/videoEditor/videoEditor/actions/get_video_task_by_guid?guids=" + guid;
            Edbox.Request.Get(Edbox.GetHost("MMO"), subUrl, null, function(data){
                if (data.items.length < 1){
                    if (success) success(null);
                    return;
                }

                var items = data.items;
                for (var i = 0; i < data.items.length; i++) {
                    var item = data.items[i];
                    if(item.handle_type===3){
                        if (success) {
                          success(element);
                        }
                        return;
                    }
                }

                var err=new Object();
                err.code='NoTranTask';
                err.message="没有转码任务";
                if (error) error(err);
            }, function(err){
                alert(err.code);
                if (error) error(err);
            });
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "AudiohelpServer"));