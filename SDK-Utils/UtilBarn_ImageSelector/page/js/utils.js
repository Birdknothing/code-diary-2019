var Utils = {
    /**
     * Base64转Blob
     */
    Base64ToBlob: function(code) {
        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {
            type: contentType
        });
    },

    /**
     * arrayBuffer转Base64 
     */
    ArrayBufferToBase64: function(buffer) {    
        var binary = '';    
        var bytes = new Uint8Array(buffer);    
        var len = bytes.byteLength;    
        for (var i = 0; i < len; i++) {      
            binary += String.fromCharCode(bytes[i]);    
        }    
        return window.btoa(binary);  
    },

    /**
     * 获取文件后缀
     */
    GetExtend: function(filename) {
        var index = filename.lastIndexOf(".");
        return filename.substring(index + 1, filename.length);
    },

    /**
     * 获取文件名称
     */
    GetFileName: function(filename) {
        var index = filename.lastIndexOf(".");
        return index > -1 ? filename.substring(0, index) : filename;
    },

    /**
     * 获取Guid
     */
    GetGuid: function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * RGB值转RGBA值
     */
    RGB2RGBA: function(rgb_color, alp) {
        //注：rgb_color的格式为rgb(0,0,0)
        var arr = rgb_color.split("(")[1].split(")")[0].split(",");
        var a = arr[3];
        var r = parseInt(arr[0]);
        var g = parseInt(arr[1]);
        var b = parseInt(arr[2]);
        return "rgba(" + r + "," + g + "," + b + "," + alp + ")";
    },

    /**
     * 是否是数字
     */
    IsNumber: function(value) {
        return typeof(value) === "number" && !isNaN(value);
    },

    /**
     * 是否是数组     
     */
    IsArray: function(value) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === "[object Array]";
        }
    },

    /**
     * 是否是布朗值     
     */
    IsBoolean: function(value) {
        return typeof value === "boolean";
    },

    /**
     * 是否是空或者未定义
     */
    IsNullOrUndefine: function(type) {
        return type == null || type == undefined;
    },

    /**
     * 是否是空字符串
     */
    IsNullOrEmpty: function(value) {
        return value == null || value.length == 0 || value == undefined;
    },

    /**
     * 获取插入符号在元素里的偏移
     */
    GetCaretCharacterOffsetWithin: function(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    },

    /**
     * 获取插入符号位置
     */
    GetCaretPosition: function() {
        if (window.getSelection && window.getSelection().getRangeAt) {
            var range = window.getSelection().getRangeAt(0);
            var selectedObj = window.getSelection();
            var rangeCount = 0;
            var childNodes = selectedObj.anchorNode.parentNode.childNodes;
            for (var i = 0; i < childNodes.length; i++) {
                if (childNodes[i] == selectedObj.anchorNode) {
                    break;
                }
                if (childNodes[i].outerHTML)
                    rangeCount += childNodes[i].outerHTML.length;
                else if (childNodes[i].nodeType == 3) {
                    rangeCount += childNodes[i].textContent.length;
                }
            }
            return range.startOffset + rangeCount;
        }
        return -1;
    },

    /**
     * 字符串格式化     
     */
    StringFormat: function() {
        if (arguments.length <= 0)
            return "";

        let args;
        if (arguments.length == 1) {
            if (Utils.IsArray(arguments[0])) {
                args = arguments[0];
            } else {
                return arguments[0];
            }
        } else {
            args = arguments;
        }

        let result = args[0];
        if (args.length == 2 && typeof(args[1]) == "object") {
            for (let key in args[1]) {
                if (args[1][key] != undefined) {
                    let reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[1][key]);
                }
            }
        } else {
            for (let i = 1; i < args.length; i++) {
                if (args[i] != undefined) {　　　　　　　　　
                    let reg = new RegExp("({)" + (i - 1) + "(})", "g");
                    result = result.replace(reg, args[i]);
                }
            }
        }
        return result;
    },

    /**
     * 获取数值符号，当value为正或为0返回1，为负返回-1。
     */
    GetNumberSign: function(value) {
        return (!Utils.IsNumber(value) || value < 0) ? -1 : 1;
    },

    /**
     * dom元素旋转     
     */
    RotateDom: function(dom, deg) {
        if (dom == null || !Utils.IsNumber(deg))
            return;

        let tempTrans = Utils.StringFormat("rotate({0}deg)", deg);
        dom.style.setProperty("transform", tempTrans);
        dom.style.setProperty("-ms-transform", tempTrans);
        dom.style.setProperty("-moz-transform", tempTrans);
        dom.style.setProperty("-webkit-transform", tempTrans);
        dom.style.setProperty("-o-transform", tempTrans);

        // transform:rotate(7deg);
        // -ms-transform:rotate(7deg); 	/* IE 9 */
        // -moz-transform:rotate(7deg); 	/* Firefox */
        // -webkit-transform:rotate(7deg); /* Safari 和 Chrome */
        // -o-transform:rotate(7deg); 	/* Opera */
    },

    /**
     * 检查是否为有效函数     
     */
    IsFunction: function(value) {
        return typeof value === "function";
    },

    /**
     * 使用ajax多线程调用     
     */
    Deferred: function(success, error) {
        if (!Utils.IsFunction(success)) {
            if (Utils.IsFunction(error))
                error();
            return;
        }

        $.Deferred(Utils.Wait).done(success).fail(error);
    },

    /**
     * 多线程等待执行
     */
    Wait: function(method) {
        method.resolve();
        return method.promise();
    },

    /**
     * 将Data URL转化为array buffer     
     */
    DataURLToArrayBuffer: function(dataURL) {
        var base64 = dataURL.replace(/^data:.*,/, '');
        var binary = atob(base64);
        var arrayBuffer = new ArrayBuffer(binary.length);
        var uint8 = new Uint8Array(arrayBuffer);
        Utils.ForEach(uint8, function(value, i) {
            uint8[i] = binary.charCodeAt(i);
        });
        return arrayBuffer;
    },

    /**
     * 获取对象类型     
     */
    _Typeof: function(obj) {
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function(obj) {
                return typeof obj;
            };
        } else {
            _typeof = function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
        }

        return _typeof(obj);
    },

    /**
     * 检查参数是否是对象     
     */
    IsObject: function(value) {
        return Utils._Typeof(value) === 'object' && value !== null;
    },

    /**
     * 遍历数据     
     */
    ForEach: function(data, callback) {
        if (data && Utils.IsFunction(callback)) {
            if (Array.isArray(data) || Utils.IsNumber(data.length)
                /* array-like */
            ) {
                var length = data.length;
                var i;

                for (i = 0; i < length; i += 1) {
                    if (callback.call(data, data[i], i, data) === false) {
                        break;
                    }
                }
            } else if (Utils.IsObject(data)) {
                Object.keys(data).forEach(function(key) {
                    callback.call(data, data[key], key, data);
                });
            }
        }

        return data;
    },

    /**
     * 删除数组数据     
     */
    DeleteArrayData: function(array, data) {
        let tempIndex = Utils.ContainsArrayData(array, data);
        if (tempIndex > -1) {
            array.splice(tempIndex, 1);
            return true;
        }

        return false;
    },

    /**
     * 包含数组数据     
     */
    ContainsArrayData: function(array, data) {
        if (array && Array.isArray(array) && Utils.IsNumber(array.length) && data) {
            for (let i = array.length - 1; i >= 0; i--) {
                if (data === array[i]) {
                    return i;
                }
            }
        }

        return -1;
    },

    _ArrayWithoutHoles: function(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

            return arr2;
        }
    },

    _IterableToArray: function(iter) {
        if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
    },

    _NonIterableSpread: function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    },

    _ToConsumableArray: function(arr) {
        return Utils._ArrayWithoutHoles(arr) || Utils._IterableToArray(arr) || Utils._NonIterableSpread();
    },

    /**
     * 将array buffer转化为Data URL
     */
    ArrayBufferToDataURL: function(arrayBuffer, mimeType) {
        var chunks = [];
        var chunkSize = 8192;
        var uint8 = new Uint8Array(arrayBuffer);

        while (uint8.length > 0) {
            chunks.push(String.fromCharCode.apply(void 0, Utils._ToConsumableArray(uint8.subarray(0, chunkSize))));
            uint8 = uint8.subarray(chunkSize);
        }

        return "data:".concat(mimeType, ";base64,").concat(btoa(chunks.join('')));
    },
};

/*部分不支持函数扩展
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof(args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {　　　　　　　　　
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};
*/