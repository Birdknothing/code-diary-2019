//词库功能组件
(function (namespace, className) {
    var module = {
        /**
         * 获取词库列表
         * @param {object} ob {
         *          {String} guid NDR词库资源id }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        Get: function (ob, success, error) {
            Edbox.NDR.Get(ob.guid, function (nData) {
                $.ajax({
                    url: nData.Url,
                    type: "get",
                    contentType: 'application/x-www-form-urlencoded',
                    success: function (data) {
                        if (success && data) {
                            var result = data.split(/[(\r\n)\r\n]+/);
                            if(ob.key && ob.key !== ""){
                                var filterResult = new Array();
                                for(var i = 0; i < result.length; i++){
                                    if(result[i].indexOf(ob.key) >= 0){
                                        filterResult.push(result[i]);
                                    }
                                }
                                success({'data':filterResult});
                            }else{
                                success({'data':result});
                            }
                        }
                    },
                    error: function (e) {
                        if (error) error(e);
                    }
                });
            });
        }
    };
    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox,"Thesaurus"));