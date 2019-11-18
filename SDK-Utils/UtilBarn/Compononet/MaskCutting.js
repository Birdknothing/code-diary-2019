// UtilBarn蒙版切图组件
(function (namespace, className) {
    /**
     * UtilBarn蒙版切图组件
     * 可用于UtilBarn平台的编辑模块开发，或其他需要切图的地方
     * @author 温荣泉(201901)
     * @version 1.0.1 (2019年3月12日)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn%E8%92%99%E7%89%88%E5%88%87%E5%9B%BE%E7%BB%84%E4%BB%B6
     * @param {Object} obj 配置 width 宽度、height 高度、mask 图片地址 images/Circle.png、quality 图片质量
     * @returns {Object} 组件
     * */
    var module = function (obj) {
        var self = this;

        // 尺寸数据
        this.Width = obj && obj.width || 200; // 宽度
        this.Height = obj && obj.height || 200; // 高度

        this.Mask = obj && obj.mask; // 蒙版

        this.Quality = obj && obj.quality || 0.8;// 生成图片的质量

        this.onHandle = false; // 是否在处理中

        /**
         * 生成的数据
         */
        this.Datas = null;

        /**
         * 获取图片数据
         * @param {String} img 图片Src路径
         * @returns {String} 二进制数据
         */
        this.getImageDatas = function (img) {
            var canvas = document.createElement("canvas");
            canvas.width = self.Width;
            canvas.height = self.Height;
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, self.Width, self.Height);
            return context.getImageData(0, 0, self.Width, self.Height);
        };

        // 源文件操作
        this.sourceData = null; // 源文件数据
        this.sourceImage = new Image(); // 源文件图片
        // 源文件图片加载事件
        this.sourceImage.onload = function () {
            self.sourceData = self.getImageDatas(this);
        };

        /**
         * 设置源文件
         * @param {String} source 图片Src路径
         * @param {Boolean} crossOrigin 是否设置跨域支持，不携带Cookie请求
         */
        this.SetSource = function (source, crossOrigin) {
            self.sourceData = null;
            if (crossOrigin) {
                self.sourceImage.crossOrigin = '';
            }
            else {
                self.sourceImage.crossOrigin = null;
            }
            self.sourceImage.src = source;
        };

        // 蒙版操作
        this.maskData = null;  // 蒙版文件数据
        this.maskImage = new Image(); // 蒙版文件图片
        // 蒙版文件图片加载事件
        this.maskImage.onload = function () {
            self.maskData = self.getImageDatas(this);
        };

        /**
         * 设置蒙版
         * @param {String} mask 蒙版图片Src路径
         * @param {Boolean} crossOrigin 是否设置跨域支持，不携带Cookie请求
         */
        this.SetMask = function (mask, crossOrigin) {
            self.maskData = null;

            if (crossOrigin === null || crossOrigin === undefined) {
                crossOrigin = true;
            }

            if (crossOrigin) {
                self.maskImage.crossOrigin = '';
            }
            else {
                self.maskImage.crossOrigin = null;
            }
            self.maskImage.src = mask;
        };

        // 初始化蒙版
        if (this.Mask) {
            this.SetMask(self.Mask);
        }

        /**
         * 执行处理过程
         */
        this.handle = function () {
            var canvas = document.createElement("canvas");
            canvas.width = self.Width;
            canvas.height = self.Height;
            var context = canvas.getContext('2d');

            var ResultData = self.sourceData;

            // 基于原始图片数据处理
            for (var index = 0; index < self.sourceData.data.length; index += 4) {
                ResultData.data[index] = self.sourceData.data[index];
                ResultData.data[index + 1] = self.sourceData.data[index + 1];
                ResultData.data[index + 2] = self.sourceData.data[index + 2];
                var a = self.maskData.data[index + 3];
                if (a > self.sourceData.data[index + 3])
                    a = self.sourceData.data[index + 3];
                ResultData.data[index + 3] = a;
            }

            // put数据
            context.putImageData(ResultData, 0, 0);

            self.Datas = canvas.toDataURL('image/png', self.Quality);
        };

        /**
         * 启动执行
         * @param {String} path 图片路径
         * @param {Function} success 成功回调，带string类型二进制生成数据
         * @param {Function} error 出错回调
         * @param {Boolean} cross 是否需要跨域
         */
        this.Start = function (path, success, error, cross) {
            if (this.onHandle) {
                if (error) error("上一图片还在处理中..");
            }

            if (cross === null || cross === undefined) {
                cross = true;
            }

            self.onHandle = true;
            self.Datas = null;

            // 设置源文件图片
            self.SetSource(path, cross);

            // 设置监听
            var interval = setInterval(function () {
                if (self.sourceData && self.maskData) {
                    self.handle();

                    //成功回调
                    if (success) success(self.Datas);

                    self.onHandle = false;

                    clearInterval(interval);
                }
            }, 200);
        };

        return self;
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "MaskCutting"));