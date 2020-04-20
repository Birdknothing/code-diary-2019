// Edbox UC交互
(function (namespace, className) {
    var api = Edbox.Api.UC;

    /**
     * Edbox UC交互
     * @author 温荣泉(201901)
     * */
    var module = {
        /**
         * 获取用户头像
         * @param {String} userid 用户id
         * @param {Number} size 大小
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetAvatar: function (userid, size, success, error) {
            var url = Edbox.Api.CS.GetAvatar(userid, size);
            var img = new Image();
            img.crossOrigin = "";
            img.src = url;
            img.onload = function (e) {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, img.width, img.height);
                context.getImageData(0, 0, img.width, img.height);
                if (success) success(canvas.toDataURL());
            };
            img.onerror = function (e) {
                if (success) success("data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4QzczMTA4MEZDNEMxMUU5QUI2RkUzQzg4NDExNTA0QyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4QzczMTA4MUZDNEMxMUU5QUI2RkUzQzg4NDExNTA0QyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhDNzMxMDdFRkM0QzExRTlBQjZGRTNDODg0MTE1MDRDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhDNzMxMDdGRkM0QzExRTlBQjZGRTNDODg0MTE1MDRDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8AAEQgAQABAAwERAAIRAQMRAf/EAGcAAAIDAQEBAAAAAAAAAAAAAAAEAgMFAQYIAQEAAAAAAAAAAAAAAAAAAAAAEAACAQIEBQMFAQAAAAAAAAABAgMABBEhMUFRcRIiBZEyUmGBwdFiExEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+qaCi7vYLZMZD3H2oNTQY1x5i7lJCH/JOC6+tAm8sjZu5bmSaASWRc0cryJFA5b+Yu4iA5/1TcNr60GzaXsF0uMZ7h7kOooL6Ci9u0toDIc20ReJoPNzTSTSGSQ9TNqaAhiaWQIuW5PAUGhHbQRjAKCfk2ZoCS2gcYMgB+S5Ggz5omikKHPcHiKAilkhkEkZ6WXQ0HpLK7S6gEgyYZOvA0GN5i4Mt2UB7Iu0c96BGgc8cBhI2+Q/NA5QFAn5EDCNt8SPtrQJ0D3h7gxXYQnsl7Tz2oE5W65HY6sSfU0EaBrx74SOnyGI5igeoCgR8g+LonxGJ5mgVoJRsVkVhqpBH2NASKUkZTqpI9DQRoOqzIwZcmU4ig1IpBJGrgYY7cDQEsgjjZyMQu3E0GWzM7FmzZjiaDlBKNS0iqNWIA+5oHPMW5iuy4HZL3DnvQIgEkADEnQCgbisGOcrdP8AK6+tA2iKihVGCjQUA6K6FGGKnWgTlsGGcTdX8tkfWgVIKkqwIYag0D3h7cy3Ycjsi7jz2oNm9tEuoDGcm1RuBoMuC1NuMHGEp95/AoLaAoCgKCqe1NwvSoxlHsP4P0oNSytEtYBGM2ObtxNBfQQlhSUYNrsd6BOSzlXQdQ+n6oKSrDUEc6ACsdATyoLY7SVtR0j6/qgdihSIYLrud6CdB//Z");
                if (error) error();
            };
        },

        /**
         * 获取用户信息
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetUserInfo: function (success, error) {
            api.GetUserInfo(Edbox.AccountId, function (data) {
                var info = new Object();
                info.ID = data.user_id;
                info.Name = data.nick_name;
                info.Type = data.source_plat;
                info.OrgID = "";
                info.OrgName = "";

                if (data.org_exinfo) {
                    info.OrgID = data.org_exinfo.org_id;
                    info.OrgName = data.org_exinfo.org_name;
                }
                if (success) success(info);
            }, error);
        },

        /**
         * 有效性检查
         * @param {String} uid 用户ID
         * @param {String} auth 用户授权信息
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ValidCheck: function (uid, auth, success, error) {
            var reg = new RegExp("MAC id=\"([^\"]*)\",nonce=\"([^\"]*)\",mac=\"([^\"]*)\"");
            var result = auth.match(reg);
            if (!result) {
                if (error) {
                    error("Auth Error");
                }
                return;
            }
            var access_token = result[1];
            var mac = result[3];
            var nonce = result[2];
            var http_method = "Get";
            var request_uri = "/";
            var host = window.location.host;
            api.ValidCheck(access_token, mac, nonce, http_method, request_uri, host, function (data) {
                var info = new Object();
                // UC的用户id
                info.AccountId = data.user_id;
                // UC的用户Token
                info.AccessToken = data.access_token;
                // UC的用户秘钥
                info.MacKey = data.mac_key;
                // UC服务器时间
                if (data.server_time) {
                    var str = data.server_time;
                    var timeStr = str.replace(/-/g, "/").replace(/T/g, " ");
                    timeStr = timeStr.substring(0, str.length - 9) + timeStr.substring(str.length - 5, str.length);
                    info.TimeStamp = new Date().getTime() - new Date(timeStr).getTime();
                    info.TimeStamp = Math.round(info.TimeStamp);
                }

                // 设置头像
                if (info.AccountId) {
                    info.Avatar = Edbox.Api.CS.GetAvatar(info.AccountId, 160);
                }

                if (success) success(info);
            }, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Action, "UC"));