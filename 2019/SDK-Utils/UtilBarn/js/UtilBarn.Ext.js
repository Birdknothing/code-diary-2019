// UtilBarn队列方法
(function (namespace, className) {
    /**
     * UtilBarn队列方法
     */
    var module = {
        /**
         * 队列新增元素对象
         * @param {Array} array 队列
         * @param {any} obj 元素对象
         */
        Add: function (array, obj) {
            var index = array.indexOf(obj);
            if (index > -1) return;
            array.push(obj);
        },

        /**
         * 是否包含值
         * @param {Array} array 队列
         * @param {any} obj 元素对象
         * @returns {Boolean} 是否包含
         */
        Contain: function (array, obj) {
            var index = array.indexOf(obj);
            return index > -1;
        },

        /**
         * 队列删除元素对象
         * @param {Array} array 队列
         * @param {any} obj 元素对象
         */
        Remove: function (array, obj) {
            var index = array.indexOf(obj);
            if (index > -1) {
                array.splice(index, 1);
            }
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "Array"));

// 获取GUID
(function (namespace, className) {
    /**
     * 获取GUID
     * @return {String} GUID
     */
    var module = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "GetGUID"));

// Base64 编码
(function (namespace, className) {
    /**
     * Base64 编码
     * @param {String} input 需要编码的数据
     * @return {String} Base64编码的数据
     */
    var module = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        var _utf8_encode = function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if (c > 127 && c < 2048) {
                    utftext += String.fromCharCode(c >> 6 | 192);
                    utftext += String.fromCharCode(c & 63 | 128);
                } else {
                    utftext += String.fromCharCode(c >> 12 | 224);
                    utftext += String.fromCharCode(c >> 6 & 63 | 128);
                    utftext += String.fromCharCode(c & 63 | 128);
                }

            }
            return utftext;
        };

        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "Encode"));

// Base64 解码
(function (namespace, className) {
    /**
     * Base64 解码
     * @param {String} input 编码的数据
     * @return {String} Base64解码的结果
     */
    var module = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = enc1 << 2 | enc2 >> 4;
            chr2 = (enc2 & 15) << 4 | enc3 >> 2;
            chr3 = (enc3 & 3) << 6 | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        // private method for UTF-8 decoding
        var _utf8_decode = function (utftext) {
            var string = "";
            var i = 0;
            var c = 0;
            var c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if (c > 191 && c < 224) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode((c & 31) << 6 | c2 & 63);
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    var c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    i += 3;
                }
            }
            return string;
        };

        output = _utf8_decode(output);
        return output;
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "Decode"));

// 获取Url中的参数
(function (namespace, className) {
    /**
     * 获取Url中的参数
     * @param {String} name 参数名称
     * @param {String} url URl地址，为空时为默认window.location.href
     * @param {Boolean} original 是否返回原内容，为空时返回URI解密后的内容
     * @return {String} 参数值
     */
    var module = function (name, url, original) {
        if (!url) {
            url = window.location.href;
        }

        var index = url.indexOf("?");
        if (index < 0) return null;
        var search = url.substring(index);
        index = search.indexOf("#");
        if (index > 0) {
            search = search.substring(0, index);
        }

        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = search.substr(1).match(reg);

        if (r !== null) {
            var ans = r[2];
            if (!original)
                ans = decodeURIComponent(ans); // Url匹配完获取的值应为实际值
            return ans;
        }
        return null;
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "GetQueryString"));

// 设置Url中的参数
(function (namespace, className) {
    /**
     * 设置Url中的参数
     * @param {String} name 参数名称
     * @param {String} value 参数值
     * @param {String} url URl地址，为空时为默认window.location.href
     * @return {String} 配置后的Url
     */
    var module = function (name, value, url) {
        if (!url) {
            url = window.location.href;
        }

        var temp = name + "=" + encodeURIComponent(value);

        var oldvalue = UtilBarn.GetQueryString(name, url, true);
        if (oldvalue) {
            url = url.replace(name + "=" + oldvalue, temp);
            return url;
        }

        var index = url.indexOf("#");
        var hash = "";
        if (index > 0) {
            hash = url.substring(index);
            url = url.substring(0, index);
        }

        while (url.endsWith("?") || url.endsWith("&")) {
            url = url.substring(0, url.length - 1);
        }

        index = url.indexOf("?");
        if (index < 0) {
            url += "?" + temp;
        }
        else {
            url += "&" + temp;
        }

        url += hash;
        return url;
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "SetQueryString"));

// 移除Url中的参数
(function (namespace, className) {
    /**
     * 移除Url中的参数
     * @param {String} name 参数名称
     * @param {String} url URl地址，为空时为默认window.location.href
     * @return {String} 配置后的Url
     */
    var module = function (name, url) {
        if (!url) {
            url = window.location.href;
        }

        var oldvalue = UtilBarn.GetQueryString(name, url, true);
        if (!oldvalue) return url;
        url = url.replace(name + "=" + oldvalue + "&", "");
        url = url.replace("?" + name + "=" + oldvalue, "");
        url = url.replace("&" + name + "=" + oldvalue, "");
        return url;
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "RemoveQueryString"));