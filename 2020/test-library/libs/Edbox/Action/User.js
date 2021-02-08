// Edbox 用户信息
(function (namespace, className) {
    /**
     * 根据服务器确定年龄限制
     */
    var AgeLimit = {
        QA: 0,
        /**
         * 开发服务器
         */
        Dev: 0,
        /**
         * 特性服务器
         */
        Feature: 0,
        /**
         * 国内服务器
         */
        CN: 0,
        /**
         * 国内预生产服务器
         */
        BetaCN: 0,
        /**
         * 香港服务器
         */
        HK: 0,
        /**
         * 美国服务器
         */
        US: 18
    };

    /**
     * 数组转字串
     * @param {Array} array 数组
     * @returns {String} 字串
     */
    function GetArrayString(array) {
        if (Array.isArray(array)) {
            var txt = "";
            for (var i = 0; i < array.length; i++) {
                if (i !== 0) {
                    txt += ",";
                }
                txt += array[i];
            }
            return txt;
        }
        else {
            return array;
        }
    }

    /**
     * 验证邮箱是否合法
     * @param {any} email 邮箱
     * @returns {Boolean} 是否合法
     */
    function IsEmailValid(email) {
        var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        return reg.test(email);
    }

    // 定义api
    var api = Edbox.Api.MMO;

    /**
     * Edbox 用户信息
     * 用于获取Edbox用户信息
     * @author 余晓(871129) Review By 温荣泉(201901)
     * */
    var module = {
        /**
         * 获取用户个人信息
         * user_id,nick_name,id,name,
         * money,experience,level,
         * status,birthday,sex,head,
         * email_address,email_status,
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        GetUserInfo: function (success, error) {
            api.GetUser(
                function (data) {
                    //console.log("get userInfo successfully");
                    if (success) success(data);
                },
                function (e) {
                    if (error) error(e);
                    //console.log("fail:" + e);
                }
            );
        },

        /**
         * 修改用户个人信息
         * @param {object} data {
                        {string}birthday : 生日, 如不传该参数则不修改该用户生日，格式如：2019-02-13，更改若小于限制弹出提示, 
                        {int}sex : 性别, 如不传该参数则不修改该用户性别，1男，2女 , 
                        {string}nick_name : 昵称, 如不传该参数或传空字符串则不修改该用户昵称, 
                        {string}head : 头像资源, 如不传该参数或传空字符串则不修改该用户头像, 
                    }
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        UpdateUserInfo: function (data, success, error) {
            var updatedata = { "birthday": "", "sex": 0, "head": "", "nick_name": "" };
            if (data.nick_name !== '' && !(typeof data.nick_name === "undefined")) {
                updatedata.nick_name = data.nick_name;
            }
            if (data.sex !== '' && !(typeof data.sex === "undefined")) {
                updatedata.sex = data.sex;
            }
            if (data.head !== '' && !(typeof data.head === "undefined")) {
                updatedata.head = data.head;
            }
            if (data.birthday !== '' && !(typeof data.birthday === "undefined")) {
                updatedata.birthday = data.birthday.substring(0, 4) + data.birthday.substring(5, 7) + data.birthday.substring(8, 10);
            }
            updatedata = JSON.stringify(updatedata);
            api.UpdateUserInfo(updatedata,
                function (data) {
                    if (success) success(data);
                },
                function (data) {
                    if (error) error(e);
                }
            );
        },

        /**
         * 添加验证邮箱
         * @param {String} email 接收的邮箱地址
         */
        AddEmail: function (email) {
            email = email.replace(" ", "");
            if (email !== '' && typeof email !== "undefined" && this.IsEmailValid(email)) {
                api.AddEmailVerify(email,
                    function (data) {
                        console.log("send email successfully");
                    },
                    function (data) {
                        console.log("fail:" + data);
                    });
            }
            else
                console.log("邮箱不合法!");
        },

        /**
         * 重新发送验证邮箱
         */
        ResendEmail: function () {
            api.ResendEmail(
                function (data) {
                    console.log("resend email successfully");
                },
                function (data) {
                    console.log("fail:" + data);
                });
        },

        /**
         * 修改邮箱
         * @param {String} email 接收的邮箱地址
         */
        UpdateEmail: function (email) {
            email = email.replace(" ", "");
            if (email !== '' && typeof email !== "undefined" && this.IsEmailValid(email)) {
                api.UpdateEmailVerify(email,
                    function (data) {
                        console.log("send email successfully");
                    },
                    function (data) {
                        console.log("fail:" + data);
                    });
            }
        },

        UploadUserAvatar: function (blob, success, error) {
            var url = "/v0.1/csession/avatar";

            // 上传到CS服务器
            function uploadToCS(avatarPath, sessionId, successCb) {
                var url = '/v0.1/upload?session=' + sessionId;
                var curl = Edbox.Protocol + "://" + Edbox.GetHost("CS") + url;

                var formdata = new FormData();
                formdata.append("filePath", avatarPath);
                formdata.append("scope", 1);
                formdata.append("file", blob);

                $.ajax({
                    processData: false,
                    contentType: false,
                    url: curl,
                    async: true,
                    type: "post",
                    data: formdata,
                    dataType: "json",
                    success: successCb
                });
            }
            // Edbox.Request.PostWithHeader(Edbox.GetHost("UCUserInfo"), subUrl, userArray, null, success, error, Edbox.Protocol);
            Edbox.Request.GetWithProtocol(Edbox.GetHost("CommonCS"), url, "", function (sessionData) {
                var avatarPath = sessionData.path + "/" + Edbox.AccountId + ".jpg";
                uploadToCS(avatarPath, sessionData.session, function () {
                    if (success) success(avatarPath);
                });
            }, error, Edbox.Protocol);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Action, "User"));