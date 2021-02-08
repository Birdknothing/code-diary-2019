// Edbox MMO组件
(function (namespace, className) {
    /**
     * 基础服务配置
     */
    var config = {
        /**
         * ConfigGuid域名配置包在服务后台的id
         */
        ConfigGuid: {
            QA: "681fd75a-e77b-afcb-481c-39a15ccef521",
            Dev: "bcbdae7c-d1f0-d1cb-09d2-b0e2ded89a5a",
            Feature: "a0fabf0c-4988-2ad9-7c4c-bbf80c3890d9",
            CN: "d017e42d-6c6c-6982-14d5-a425c4e23ef6",
            BetaCN: "c1054e19-b7e3-313f-ef3d-4e34eb6e5aac",
            HK: "",
            US: "d05ceb51-f4b4-4938-f225-2ab43fa93881",
            Beta: "5ca2fc3c-dca6-da00-d572-18df84d3c676"
        },
        /**
         * 基础服务程序包在服务后台的id，用于更新
         */
        ProgramGuid: {
            QA: "b31f7d3f-f5fe-dbb3-12da-c9c2ffcc8d8f",
            Dev: "3627f47c-db07-b36c-29e5-f9011bbe441a",
            Feature: "eadb8780-3a1a-8858-f819-120e63b65cbd",
            CN: "19fba8cd-eb6c-e030-f7ae-2f136672d5a4",
            BetaCN: "9ac7baa7-9c09-c69e-f2c0-cbbbf2c60763",
            HK: "",
            US: "5a071066-be46-ce3d-df92-4be16561283b",
            Beta: "1f892a14-b4d5-aee0-8d9e-232e41b92ba4"
        },
        /**
         * Html5Player程序包在服务后台的id
         */
        Html5PlayerId: {
            QA: "6eb4c904-c320-5679-28ec-78d8864679c4",
            Dev: "fb42879f-d277-49cc-c153-caefa22f3267",
            Feature: "823efda6-d3f1-e261-e34f-8b485982dfd6",
            CN: "4021ec0a-7741-320b-a8ae-219b6f2fc5a4",
            BetaCN: "7d4cf2f9-263b-94c2-630e-840f991f0165",
            HK: "",
            US: "bcf5034f-22e3-343f-5c24-9d43d2da150d",
            Beta: "269cf52f-e4c8-25bc-0b57-175f5560bf05"
        },
        /**
         * 基础服务程序包在服务后台的id，用于更新
         */
        ApkToolId: {
            QA: "291888de-ccbc-41f1-909a-62935f3142f4",
            Dev: "a39415cb-1009-80e6-e13e-ce53c9d2925d",
            Feature: "44167a59-64f8-bd63-67eb-d89ba353b6f5",
            CN: "92e5a457-0e4f-60fd-ecfa-a3cd3f8ff37c",
            BetaCN: "b227fddd-f5dc-5fd9-982b-d6fbd3af1588",
            HK: "",
            US: "41143802-57a4-3208-e027-7a4eedab1083",
            Beta: "1ef2649e-57eb-1d24-6256-679f3cf6f981"
        },
        /**
         * 基础服务安装程序在服务后台的id
         */
        BaseServiceExeId: {
            QA: "a5b082d8-a968-240b-d376-65eb7b87d5e7",
            Dev: "b2dd0929-6f5e-0799-d4f4-64a806ceba5b",
            Feature: "835ba3df-8bab-0ba6-771e-4458abfe4b7c",
            CN: "09df2ad0-a14c-89c1-995e-edbefa5c266c",
            BetaCN: "364bbc6c-ad5e-a1c8-75ba-ea06ce9defd0",
            HK: "",
            US: "a7913bc2-6874-e0d2-5d46-c4dc4e210e53",
            Beta: "dbda1efd-219e-e641-b750-13eb050f8486"
        }
    };

    GetMessageData = function (taskId, model, code) {
        var arg = Edbox.Encode(JSON.stringify(model));
        var taskConfig = {};
        taskConfig.ConfigGuid = config["ConfigGuid"][Edbox.ServerKey];
        taskConfig.WebServer = Edbox.Protocol + "://" + Edbox.GetHost("Login") + "/";
        taskConfig.ProgramGuid = config["ProgramGuid"][Edbox.ServerKey];
        taskConfig.ApkToolId = config["ApkToolId"][Edbox.ServerKey];
        taskConfig.Html5PlayerId = config["Html5PlayerId"][Edbox.ServerKey];
        taskConfig.Language = Edbox.Language;
        var webSocketMessage = {};
        webSocketMessage.TaskId = taskId;
        webSocketMessage.TaskConfigData = taskConfig;
        webSocketMessage.Code = code;
        webSocketMessage.Data = arg;
        return JSON.stringify(webSocketMessage);
    };

    /**
     * Edbox 图片搜索组件
     * @author 余晓(871129)
     * @see 
     * */
    var module = {
        /**
         * 检测是否已安装服务程序
         * @param {Function} success 成功回调, 允许为空
         * @param {Function} error 出错回调, 允许为空
         */
        CheckEbService: function (success, error) {
            if (Edbox.WebSocket.IsOpen) {
                success("");
            } else {
                module.GetProgramLocation(success, error);
            }
        },

        /**
         * 获取服务程序下载地址
         * @param {Function} success 成功回调, 允许为空
         * @param {Function} error 出错回调, 允许为空
         */
        GetProgramLocation: function (success, error) {
            var subUrl = "/edbox/v1.0/package/lastest_version";
            var arg = {
                pkg_guid: config["BaseServiceExeId"][Edbox.ServerKey],
                pkg_version: "1.0.0",
                pkg_platform: "PC",
                language: "zh-CN"
            };

            $.ajax({
                url: Edbox.Protocol + "://" + Edbox.GetHost("Login") + subUrl,
                // async: true,
                type: "post",
                data: JSON.stringify(arg),
                contentType: 'application/x-www-form-urlencoded',
                success: function (rpData) {
                    var rp = JSON.parse(rpData);
                    if (rp && rp.data) {
                        success(rp.data.location);
                    } else {
                        error("GetProgramLocation failed");
                    }
                },
                error: function (e) {
                    if (error) {
                        error(e);
                    }
                }
            });
        },
		
		/**
		 * 搜索baidu图片
		 * @param {String} taskId 任务id
		 * @param {String} word 搜索关键字
		 * @param {int} pageIndex 页面位置
		 * @param {Function} success 成功回调
		 * @param {Function} error 出错回调
		 */
		SearchBaiduImage: function (data, success, error) {
			module.BaseServiceCheck("SEARCHERROR", function(){
				var taskId = data.taskId;
				var model = {};
				model.Word = data.word;
				model.Page = data.pageIndex;
				var message = GetMessageData(taskId, model, "SearchBaiduImage");
				Edbox.WebSocket.Send(message);
				Edbox.WebSocket.SearchBaiduImageResultCbDic.Set(taskId, function (returnTaskId, data) {
				    if (returnTaskId === taskId) {
				        if (data.Code === "SUCCESS") {
				            var result = {};
				            result.Code = data.Code;
				            result.Message = JSON.parse(data.Message);
				            if (success) success(result);
				        } else {
				            var result = {};
							if(navigator && navigator.onLine){
								result.Code = data.Code;
							}else{
								result.Code = "NETWORK_OFFLINE";
							}
				            result.Message = Edbox.GetTip("ERROR_" + result.Code);
				            if (error) error(result);
				        }
				    }
				});
			}, error);
		},
		
		/**
		 * 搜索google图片
		 * @param {String} taskId 任务id
		 * @param {String} word 搜索关键字
		 * @param {int} pageIndex 页面位置
		 * @param {Function} success 成功回调
		 * @param {Function} error 出错回调
		 */
		SearchGoogleImage: function (data, success, error) {
			module.BaseServiceCheck("SEARCHERROR", function(){
				var taskId = data.taskId;
				var word = data.word;
				if(!word){
					word = "";
				}else{
					word = encodeURIComponent(word);
				}
				var num = 10;
				var start = (data.pageIndex - 1) * num + 1;
				var config = {
					url: "https://www.googleapis.com/customsearch/v1?q=" + word + "&searchType=image&num="+ num + "&start=" + start + "&key=AIzaSyBmOs6ujOAW-s8YrU8lBPhWbw-mDA_jJWM&cx=000994457181477333244:ucqd3wlog3g",
					async: true,
					type: "GET",
					data: "",
					dataType: "json",
					success: function (ans) {
						console.log("ans :" + ans);
						var urls = new Array();
						
						for (var i = 0; i < ans.items.length; i++) {
							urls.push(ans.items[i].link);
						}
						var model = {};
						model.Urls = urls;
						model.Refer = "";
						var message = GetMessageData(taskId, model, "RequestBase64Image");
						Edbox.WebSocket.Send(message);
						Edbox.WebSocket.RequestBase64ImageCbDic.Set(taskId, function (returnTaskId, data) {
							if (returnTaskId === taskId) {
								if (data.Code === "SUCCESS") {
									var result = {};
									result.Code = data.Code;
									
									var ob = {};
									ob.total = ans.searchInformation.totalResults;
									ob.imageDatas = JSON.parse(data.Message);
									result.Message = ob;
									if (success) success(result);
								} else {
									var result = {};
									if(navigator && navigator.onLine){
										result.Code = data.Code;
									}else{
										result.Code = "NETWORK_OFFLINE";
									}
									result.Message = Edbox.GetTip("ERROR_" + result.Code);
									if (error) error(result);
								}
							}
						});
					},
					error: function (err) {
						var result = {};
						if(navigator && navigator.onLine){
							result.Code = "SEARCHERROR";
						}else{
							result.Code = "NETWORK_OFFLINE";
						}
						result.Message = Edbox.GetTip("ERROR_" + result.Code);
						if (error) error(result);
						console.log("SearchGoogleImage err :" + err);
					}
				};
				$.ajax(config);
			}, error);
		},
		
		/**
		 * 截图
		 * @param {String} taskId 任务id
		 * @param {Function} success 成功回调
		 * @param {Function} error 出错回调
		 */
		OpenScreenShooter: function (data, success, error) {
			module.BaseServiceCheck("SCREENSHOOTER", function(){
				var taskId = data.taskId;
				var message = GetMessageData(taskId, "", "ScreenShot");
				Edbox.WebSocket.Send(message);
				Edbox.WebSocket.OpenScreenShooterCbDic.Set(taskId, function (returnTaskId, data) {
					if (returnTaskId === taskId) {
						if (data.Code === "SUCCESS") {
							var result = {};
							result.Code = data.Code;
							result.Message = data.Message;
							if (success) success(result);
						} else {
							var result = {};
							if(navigator && navigator.onLine){
								result.Code = data.Code;
							}else{
								result.Code = "NETWORK_OFFLINE";
							}
							result.Message = Edbox.GetTip("ERROR_" + result.Code);
							if (error) error(result);
						}
					}
				});
			}, error);
		},
		
		BaseServiceCheck: function(defaultCode, success, error){
		    if (!(navigator && navigator.onLine)) {
		        var result = {};
		        result.Code = "NETWORK_OFFLINE";
		        result.Message = Edbox.GetTip("ERROR_" + result.Code);
		        if (error) error(result);
		        return;
		    }
			
			module.CheckEbService(function (localtion) {
			    if (localtion !== "") {
			        var result = {};
			        result.Code = "UNINSTALL";
			        result.Message = localtion;
			        if (error) error(result);
			    } else {
			        if(success)success();
			    }
			}, function (e) {
			    var result = {};
			    if (navigator && navigator.onLine) {
			        result.Code = defaultCode;
			    } else {
			        result.Code = "NETWORK_OFFLINE";
			    }
			    result.Message = Edbox.GetTip("ERROR_" + result.Code);
			    if (error) error(result);
			});
		}
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "EbService"));