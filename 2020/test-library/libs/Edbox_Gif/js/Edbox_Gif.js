Edbox.Gif =
    {
        /**
         * 数据Url转化为文件
         * @param {String} dataurl 数据url
         * @param {String} filename 文件名称
         */
        DataURLtoFile: function (dataurl, filename) {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            var n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        },

        /**
         * 将canvas转换成file对象
         * @param {any} canvas 画布
         * @param {String} filename 文件名称
         */
        ConvertCanvasToImage: function (canvas, filename)  {
            return this.DataURLtoFile(canvas.toDataURL('image/png'), filename);
        },

        /**
         * 载入gif（gif源的有效性需自身判定，暂时无法出错回调）
         * @param {String} gifUrl 资源服务器GUID
         * @param {Function} success 成功回调,带参数list: string[],逐帧url
         * @param {Function} error 出错回调
         */
        LoadGif: function (gifUrl, success, error)  {
            if (/.*\.gif/.test(gifUrl))
            {
                var img_list = [];
                const gifImg = document.createElement('img');
                // gif库需要img标签配置下面两个属性
                gifImg.setAttribute('rel:animated_src', gifUrl);//URL.createObjectURL(gifUrl)
                gifImg.setAttribute('rel:auto_play', '0');
                var fileName = gifUrl.substring(gifUrl.lastIndexOf('/') + 1).replace('.gif', '');
                // 新建gif实例
                var rub = new SuperGif({ gif: gifImg });
                rub.load(() => {
                    var img_list = [];
                    for (let i = 0; i < rub.get_length(); i++) {
                        // 遍历gif实例的每一帧
                        rub.move_to(i);
                        // 将每一帧的canvas转换成file对象
                        let cur_file = this.ConvertCanvasToImage(rub.get_canvas(), fileName + `-${i + 1}`);
                        /*
                        img_list.push({
                            file_name: cur_file.name,
                            url: URL.createObjectURL(cur_file),
                            file: cur_file,
                        });
                        */
                        img_list.push(URL.createObjectURL(cur_file));
                    }
                    if (success)
                        success(img_list);                    
                });
            }
            else
            {
                if (error)
                    error(gifUrl + " is not gif format!"); 
            }
        },
    }