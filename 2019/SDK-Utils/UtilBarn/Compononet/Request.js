// UtilBarn 授权请求组件
(function (namespace, className) {
    /**
     * 成功回调处理器
     * @param {Object} ans Object类型返回结果
     * @param {Function} success 成功回调,带Object类型返回结果
     * @param {Function} error 出错回调
     */
    function SuccessHandler(ans, success, error) {
        if (success)
            success(ans);
    }

    /**
     * 失败回调处理器
     * @param {any} err 错误信息
     * @param {Function} success 成功回调,带Object类型返回结果
     * @param {Function} error 出错回调
     */
    function ErrorHandler(err, success, error) {
        if (err.status === 200) {
            if (success)
                success({
                    status: err.status,
                    statusText: err.statusText
                });
            return;
        }
        if (error) {
            error({
                status: err.status,
                statusText: err.statusText,
                responseJSON: err.responseJSON
            });
        }
    }

    /**
     * 超时设置，单位秒
     */
    var Timeout = 60;

    /**
     * 获取随机字串
     * @param {Number} cnt 字串长度
     * @returns {String} 授权信息
     */
    function GetRandomString(cnt) {
        var rndstr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var t = '';
        if (cnt === null || cnt === undefined) cnt = 8;
        for (var i = 0; i < cnt; i++) {
            var r = Math.floor(Math.random() * 62);
            t = t + rndstr[r];
        }
        return t;
    }

    /**
     * 获取计算服务器时间
     * @returns {Number} 时间戳
     */
    function GetTimeStamp() {
        var now = new Date();
        return now.getTime() - Math.round(namespace.TimeStamp);
    }

    /**
     * 获取Mac数据
     * @param {String} mackey Mackey
     * @param {String} nonce 计算服务器时间 + 随机数
     * @param {String} httpmethod Http请求方法: "Get","Post"
     * @param {String} url URL地址 "/index.html"0
     * @param {String} host Host: "192.168.211.67:19001"
     * @returns {String} Mac数据
     */
    function GetMac(mackey, nonce, httpmethod, url, host) {
        var content = nonce + "\n" + httpmethod.toUpperCase() + "\n" + url + "\n" + host + "\n";
        var hash = namespace.CryptoJS.HmacSHA256(content, mackey);

        function base64stringify(wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                }
            }

            return base64Chars.join('');
        }

        var hashInBase64 = base64stringify(hash);
        return hashInBase64;
    }

    /**
     * UtilBarn 授权请求组件
     * 用于UtilBarn平台游戏向服务器请求或提交数据
     * @author 温荣泉(201901)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn%E9%80%9A%E7%94%A8%E8%AF%B7%E6%B1%82%E6%8E%88%E6%9D%83%E7%BB%84%E4%BB%B6JS%E7%89%88
     */
    var module = {
        /**
         * 获取授权信息
         * @param {String} httpmethod Http请求方法: "Get","Post"
         * @param {String} url URL地址 "/index.html"
         * @param {String} host Host: "192.168.211.67:19001"
         * @returns {String} 授权信息
         */
        GetAuthorization: function (httpmethod, url, host) {
            var nonce = GetTimeStamp() + ":" + GetRandomString(8);

            var index = host.indexOf(":");
            if (index > 0) {
                host = host.substring(0, index);
            }

            var mac = GetMac(namespace.MacKey, nonce, httpmethod, url.replace(/'/g, "%27"), host);
            return "MAC id=\"" + namespace.AccessToken + "\",nonce=\"" + nonce + "\",mac=\"" + mac + "\"";
        },
        /**
         * 获取授权信息（无登录）
         * @param {String} httpmethod Http请求方法: "Get","Post"
         * @param {String} url URL地址 "/index.html"
         * @param {String} host Host: "192.168.211.67:19001"
         * @returns {String} 授权信息
         */
        GetAuthorizationWithoutLogin: function (httpmethod, url, host) {
            var nonce = GetTimeStamp() + ":" + GetRandomString(8);

            var index = host.indexOf(":");
            if (index > 0) {
                host = host.substring(0, index);
            }

            var access_token = "7F938B205F876FC3411849E1BB2F359B4A44489BB221C71A418A02E7C07908C3717496C4E5E964FF13B05B90D97D0B89";
            var mac = GetMac("XA5zcG72la", nonce, httpmethod, url.replace(/'/g, "%27"), host);
            return "APPMAC id=\"" + access_token + "\",nonce=\"" + nonce + "\",mac=\"" + mac + "\"";
        },
        /**
         * Get请求获取数据
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        Get: function (host, url, data, success, error) {
            return module.GetWithHeader(host, url, data, null, success, error);
        },

        /**
         * Get请求获取数据
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议: Http、Https 
         * @returns {Object} Ajax对象
         */
        GetWithProtocol: function (host, url, data, success, error, protocol) {
            return module.GetWithHeader(host, url, data, null, success, error, protocol);
        },

        /**
         * Get请求获取数据,带language参数
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        GetWithLanguage: function (host, url, data, success, error) {
            var language = namespace.GetLanguageCode();
            if (language === "zh-TW") {
                language = "zh-HK";
            }

            return module.GetWithHeader(host, url, data, {
                language: language
            }, success, error);
        },

        /**
         * Get请求获取数据,带env参数
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        GetWithEnv: function (host, url, data, success, error) {
            return module.GetWithHeader(host, url, data, {
                env: namespace.Mode
            }, success, error);
        },

        /**
         * Get请求获取数据，带请求头，如服务器不支持，将出现跨域问题
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Object} header 请求头
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        GetWithHeader: function (host, suburl, data, header, success, error, protocol) {
            var httpmethod = "Get";
            return module.Send(httpmethod, protocol, host, suburl, data, header, true, success, error);
        },

        /**
         * Get请求获取数据，不带请求头
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        GetWithoutHeader: function (host, suburl, data, success, error, protocol) {
            var httpmethod = "Get";
            return module.Send(httpmethod, protocol, host, suburl, data, null, false, success, error);
        },

        /**
         * Post请求获取数据
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        Post: function (host, url, data, success, error) {
            return module.PostWithHeader(host, url, data, null, success, error);
        },

        /**
         * Post请求获取数据,带language参数
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        PostWithLanguage: function (host, url, data, success, error) {
            var language = namespace.GetLanguageCode();
            if (language === "zh-TW") {
                language = "zh-HK";
            }

            return module.PostWithHeader(host, url, data, {
                language: language
            }, success, error);
        },

        /**
         * Post请求获取数据,带env参数
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        PostWithEnv: function (host, url, data, success, error) {
            return module.PostWithHeader(host, url, data, {
                env: namespace.Mode
            }, success, error);
        },

        /**
         * Post请求获取数据，带请求头，如服务器不支持，将出现跨域问题
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Object} header 请求头
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        PostWithHeader: function (host, suburl, data, header, success, error, protocol) {
            var httpmethod = "Post";
            if (data) {
                data = JSON.parse(data);
            }
            return module.Send(httpmethod, protocol, host, suburl, data, header, true, success, error);
        },

        /**
         * Post请求获取数据，不带请求头
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        PostWithoutHeader: function (host, suburl, data, success, error, protocol) {
            var httpmethod = "Post";
            if (data) {
                data = JSON.parse(data);
            }
            return module.Send(httpmethod, protocol, host, suburl, data, null, false, success, error);
        },

        /**
         * Patch请求获取数据，带请求头，如服务器不支持，将出现跨域问题
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Object} header 请求头
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        PatchWithHeader: function (host, suburl, data, header, success, error, protocol) {
            var httpmethod = "Patch";
            if (data) {
                data = JSON.parse(data);
            }
            return module.Send(httpmethod, protocol, host, suburl, data, header, true, success, error);
        },

        /**
         * Delete请求获取数据，带请求头，如服务器不支持，将出现跨域问题
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Object} header 请求头
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        DeleteWithHeader: function (host, suburl, data, header, success, error, protocol) {
            var httpmethod = "Delete";
            if (data) {
                data = JSON.parse(data);
            }
            return module.Send(httpmethod, protocol, host, suburl, data, header, true, success, error);
        },

        /**
         * 发送请求获取数据
         * @param {String} httpmethod 请求类型 Get、Post、Patch、Delete
         * @param {String} protocol 网络请求协议: Http、Https
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {any} data 请求数据
         * @param {Object} header 请求头
         * @param {Boolean} addAuth 是否添加授权请求头
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        Send: function (httpmethod, protocol, host, suburl, data, header, addAuth, success, error) {
            var authurl = suburl;

            if (httpmethod.toLowerCase() === "get" && data && data.trim().length > 0) {
                authurl = suburl + "?" + data;
            }

            var auth = module.GetAuthorization(httpmethod, authurl, host);

            if (!protocol) {
                protocol = namespace.Protocol;
            }
            var allurl = protocol + "://" + host + suburl;

            var config = {
                url: allurl,
                async: true,
                type: httpmethod.toUpperCase(),
                data: data,
                dataType: "json",
                success: function (ans) {
                    SuccessHandler(ans, success, error);
                },
                error: function (err) {
                    ErrorHandler(err, success, error);
                }
            };

            if (!header) header = new Object();

            if (addAuth) {
                header.Authorization = auth;
            }

            config.headers = header;

            if (data) {
                if (typeof data === "string") {
                    if (data.trim().length > 0) {
                        config.data = data;
                    }
                }
                else {
                    config.data = JSON.stringify(data);
                    config.processData = false;
                    config.contentType = false;
                    header["Content-Type"] = "application/json";
                }
            }

            if (Timeout > 0) {
                config.timeout = Timeout * 1000;
            }

            return $.ajax(config);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "Request"));