var Encrypt = {
    /**
     * 加密
     * @param {String} input 待加密内容
     * @param {Boolean} base62 是否使用Base62加密
     * @param {Boolean} shrink 是否压缩
     * @returns {String} 加密后的内容
     */
    Encode: function (input, base62, shrink) {
        var packer = new Packer;
        return packer.pack(input, base62, shrink);
    },
    /**
     * 解密
     * @param {any} input 待解密内容
     * @returns {String} 解密后的内容
     */
    Decode: function (input) {
        eval("var value=String" + input.slice(4));
        return value;
    },
    Test: function (input, success, error) {
        if (!Encrypt.TestDom) {
            var dom = document.createElement("iframe");
            document.body.appendChild(dom);
            dom.setAttribute("src", location.href);
            dom.style.display = "none";
            dom.onload = function () {
                var com = dom.contentWindow;
                try {
                    com.eval(input);
                    if (success) success();
                } catch (e) {
                    if (error) error(e);
                }
            };
            Encrypt.TestDom = dom;
        }
        else {
            var com = Encrypt.TestDom.contentWindow;
            try {
                com.eval(input);
                if (success) success();
            } catch (e) {
                if (error) error(e);
            }
        }
    }
};
