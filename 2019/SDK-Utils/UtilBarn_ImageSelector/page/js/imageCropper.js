var ImageCropper = {
    /**
     * 文件选择容器
     */
    // FileSelectContainer: null,

    /**
     * 隐藏父容器方法
     */
    HideParentFunction: null,

    /**
     * 显示父容器方法
     */
    ShowParentFunction: null,

    /**
     * 上传结束方法
     */
    UploadFinishFunction: null,

    /**
     * 获取Blob数据回调
     */
    GetBlobCallback: null,

    /**
     * 是否原始图片
     */
    IsOriImage: false,

    /**
     * 图片后缀
     */
    ImageExtend: null,

    /**
     * 图片文件名称
     */
    ImageFileName: null,

    /**
     * 裁剪器
     */
    Cropper: null,

    /**
     * 裁剪类型
     * 0：矩形 1：圆形
     */
    CropType: 0,

    /**
     * 插入的规则索引，圆形裁剪器里面使用绘制圆形裁剪图片，设置后索引不为-1，当退出时重置为-1
     */
    RuleIndex: -1,

    /**
     * 图片Input，用于从Home界面跳转过来的Input传递（应该有更好的方式）
     */
    ImageInput: null,

    /**
     * 图片数据，用于在线图片选择的图片数据传递，当前只能选中1个
     */
    ImageDatas: [],

    /**
     * 默认裁剪区域比率
     */
    DefaultAspectRatio: 1,

    /**
     * 裁剪区域比率
     */
    AspectRatio: 1,

    /**
     * 裁剪图片大小
     */
    // ImageSize: {
    //     Width: 100,
    //     Height: 100,
    // },

    /**
     * 支持的图片格式
     */
    Formats: [
        "*"
    ],

    /**
     * 图片是否载入过程中
     */
    ImageLoading: false,

    /**
     * 初始化
     */
    Init: function() { //hideParentFunc, showParentFunc
        DataFunction.ImageCropper = Manager.ImageCropper;
        var ic = DataFunction.ImageCropper;
        var functions = Datas.Functions;
        functions.IC_Onload = ic.Onload;
        functions.IC_ClickMoreOptions = ic.ClickMoreOptions;
        functions.IC_SetRectRatio = ic.SetRectRatio;
        functions.IC_ReselectImage = ic.ReselectImage;
        functions.IC_Quit = ic.Quit;
        functions.IC_SaveImage = ic.SaveImage;
        functions.IC_SetCircleRatio = ic.SetCircleRatio;
        functions.IC_SelectImage = ic.SelectImage;
        functions.IC_GetAcceptFormats = ic.GetAcceptFormats;
        functions.ExitLocal = ic.ExitLocal;
        functions.ImageCrop = ic.ImageCrop;

        // ImageCropper.HideParentFunction = hideParentFunc;
        // ImageCropper.ShowParentFunction = showParentFunc;
        // ImageCropper.FileSelectContainer = document.getElementById("FileSelectContainer");
    },

    /**
     * 重置
     */
    Reset: function() {
        ImageCropper.ImageInput = null;
        ImageCropper.ImageDatas = [];

        ImageCropper.IsOriImage = false;
        ImageCropper.ImageExtend = null;
        ImageCropper.ImageFileName = null;
        ImageCropper.CropType = 0;
        if (ImageCropper.RuleIndex >= 0) {
            document.styleSheets[0].deleteRule(ImageCropper.RuleIndex);
            ImageCropper.RuleIndex = -1;
        }
        ImageCropper.AspectRatio = ImageCropper.DefaultAspectRatio;
        // ImageCropper.ImageSize = {
        //     Width: 100,
        //     Height: 100,
        // };
        ImageCropper.ImageLoading = false;
    },

    /**
     * 设置支持的图片格式
     */
    SetFormats: function(formats) {
        if (formats == null || formats.length == 0 || (formats.length > 0 && formats.indexOf("*") > -1)) {
            ImageCropper.Formats = ["*"];
            return;
        }

        ImageCropper.Formats = [];
        for (let i = 0, len = formats.length; i < len; i++) {
            switch (formats[i]) {
                case "bmp":
                case "png":
                case "gif":
                case "jpg":
                case "jpeg":
                    ImageCropper.Formats.push(formats[i]);
                    break;
            }
        }
    },

    /**
     * 是否UI可交互
     * 用于预防在图片载入过程中点击按钮导致一些不可预期的问题
     */
    IsUIInteractive: function() {
        return !ImageCropper.ImageLoading;
    },

    /**
     * 获取可接受的格式
     */
    GetAcceptFormats: function() {
        let format = "";
        for (let i = 0, len = ImageCropper.Formats.length; i < len; i++) {
            if (format.length > 0)
                format += ", ";
            format += "image/" + ImageCropper.Formats[i];
        }
        // console.log("format:" + format);
        return format;
    },

    /**
     * 设置默认裁剪区比率     
     */
    SetDefaultAspectRatio: function(ar) {
        ImageCropper.DefaultAspectRatio = Utils.IsNumber(ar) && ar != 0 ? ar : 1;
    },

    /**
     * 点击更多选项
     */
    ClickMoreOptions: function() {
        if (!ImageCropper.IsUIInteractive())
            return;

        var moreOptions = document.getElementById("MoreOptionsDiv");
        if (moreOptions.style.display == "none") {
            moreOptions.style.display = "block";
        } else {
            moreOptions.style.display = "none";
        }
    },

    /**
     * 设置矩阵比率
     */
    InitCrop: function(_ar) {
        if (ImageCropper.Cropper != undefined) {
            ImageCropper.Cropper.destroy();
        }
        var image = document.getElementById("ImageContainerTarget");
        // image.style.width = ImageCropper.ImageSize.Width + "px";
        // image.style.height = ImageCropper.ImageSize.Height + "px";
        image.style.width = window.innerWidth + "px";
        image.style.height = (window.innerHeight - 115) + "px";
        // var mw = window.screen.width - 40;
        // image.style.maxWidth = mw;
        // image.style.maxHeight = 550;
        ImageCropper.AspectRatio = _ar;

        ImageCropper.Cropper = new Cropper(image, {
            aspectRatio: _ar,
            viewMode: 1,
            ready: function() {
                croppable = true;
                ImageCropper.Cropper.setDragMode("none");
            }
        });

        /*多线程处理
        Utils.Deferred(function() {
            console.log("Deferred success!");
            ImageCropper.Cropper = new Cropper(image, {
                aspectRatio: _ar,
                viewMode: 1,
                ready: function() {
                    croppable = true;
                    ImageCropper.Cropper.setDragMode("none");
                }
            });
        }, function() {
            console.log("Deferred error!");
        });
        */
    },

    /**
     * 隐藏更多选项
     */
    HideMoreOptions: function() {
        var moreOptions = document.getElementById("MoreOptionsDiv");
        moreOptions.style.display = "none";
    },

    /**
     * 设置矩阵比率
     */
    SetRectRatio: function(m, n) {
        if (!ImageCropper.IsUIInteractive())
            return;

        if (ImageCropper.CropType == 1) {
            document.styleSheets[0].deleteRule(0);
        }
        ImageCropper.CropType = 0;
        if (n == 0) {
            ImageCropper.Cropper.clear();
        } else {
            ImageCropper.InitCrop(m / n);
        }
        ImageCropper.HideMoreOptions();
    },

    /**
     * 创建资源
     * TODO：修改SDK
     */
    CreateResource: function(data, fileName) {
        // var extend = Utils.GetExtend(fileName);

        // var format = blobData.type;
        var resourceMeta = {
            "Data": data,
            "Name": fileName,
            // "format": format,
            // "creator": ebCommon.userId
        }

        //ndr_sdk.createSource(resourceMeta, ebCommon.uploadFinishFunction);
        Manager.PostToNDR(resourceMeta);
    },

    /**
     * 选择图片
     */
    SelectImage: function(file) {
        if (!file.files || !file.files[0]) {
            return;
        }
        // ImageCropper.FileSelectContainer.style.display = "block";
        var fileSelectContainer = document.getElementById("FileSelectContainer");
        fileSelectContainer.style.display = "block";

        if (ImageCropper.HideParentFunction != null)
            ImageCropper.HideParentFunction();

        var reader = new FileReader();
        reader.onload = function(evt) {
            // if (file.parentNode != null)
            //     file.outerHTML = file.outerHTML; //清除input资源，用于下次继续选择            
            var img = new Image();
            var imageContainerTarget = document.getElementById("ImageContainerTarget");
            img.onload = function() {
                // ImageCropper.ImageSize.Width = window.innerWidth;
                // ImageCropper.ImageSize.Height = window.innerWidth / img.width * img.height;
                ImageCropper.InitCrop(ImageCropper.AspectRatio);
                // ImageCropper.OriImageData = reader.result;
                ImageCropper.ImageFileName = file.files[0].name;
                ImageCropper.ImageExtend = Utils.GetExtend(file.files[0].name);
                $("#takepicture").val(""); //清除input资源，用于下次继续选择    
                ImageCropper.ImageLoading = false;
            };
            img.src = evt.target.result;
            imageContainerTarget.src = evt.target.result;
        }
        reader.readAsDataURL(file.files[0]);
        ImageCropper.ImageLoading = true;
    },

    /**
     * 设置图片
     */
    SetImage: function(data) {
        var img = new Image();
        var imageContainerTarget = document.getElementById("ImageContainerTarget");
        img.onload = function() {
            // ImageCropper.ImageSize.Width = window.innerWidth;
            // ImageCropper.ImageSize.Height = window.innerWidth / img.width * img.height;
            ImageCropper.InitCrop(ImageCropper.AspectRatio);
            // ImageCropper.OriImageData = 
            ImageCropper.ImageFileName = data.Name;
            ImageCropper.ImageExtend = Utils.GetExtend(data.Url);
            $("#takepicture").val(""); //清除input资源，用于下次继续选择    
            ImageCropper.ImageLoading = false;
        };
        img.src = data.Url;
        imageContainerTarget.src = data.Url;
        ImageCropper.ImageLoading = true;
    },

    /**
     * 准备选择图片
     */
    ReadySelectImage: function(uploadFinish, getBlobCallback) {
        ImageCropper.UploadFinishFunction = uploadFinish;
        ImageCropper.GetBlobCallback = getBlobCallback;
        var f = document.getElementById("takepicture");
        f.click();
    },

    /**
     * 重新选择图片
     */
    ReselectImage: function() {
        if (!ImageCropper.IsUIInteractive())
            return;

        var f = document.getElementById("takepicture");
        f.click();
    },

    /**
     * Blob数据转Buffer数组数据
     */
    BlobToArrayBuffer: function(blob, cb) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = function(e) {
            if (cb)
                cb(new Uint8Array(reader.result));
        }
    },

    /**
     * 设置圆形比率
     */
    SetCircleRatio: function() {
        if (!ImageCropper.IsUIInteractive())
            return;

        if (ImageCropper.CropType == 0) {
            ImageCropper.InitCrop(1);
            ImageCropper.RuleIndex = document.styleSheets[0].insertRule(".cropper-view-box,.cropper-face {border-radius: 50%;}", 0);
        }
        ImageCropper.CropType = 1;
        ImageCropper.HideMoreOptions();
    },

    /**
     * 获取圆形画布
     */
    GetRoundedCanvas: function(sourceCanvas) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var width = sourceCanvas.width;
        var height = sourceCanvas.height;

        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = "destination-in";
        context.beginPath();
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        context.fill();
        return canvas;

        /*使用遮罩截取
        var maskImage = new Image();
        maskImage.onload = function() {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var width = sourceCanvas.width;
            var height = sourceCanvas.height;
            canvas.width = width;
            canvas.height = height;

            context.drawImage(this, 0, 0, width, height);
            var maskData = context.getImageData(0, 0, width, height);
            context.clearRect(0, 0, width, height);

            context.imageSmoothingEnabled = true;
            context.drawImage(sourceCanvas, 0, 0, width, height);

            var sourceData = context.getImageData(0, 0, width, height);
            var resultData = sourceData;

            // 基于原始图片数据处理
            for (var i = 0, len = sourceData.data.length; i < len; i += 4) {
                resultData.data[i] = sourceData.data[i];
                resultData.data[i + 1] = sourceData.data[i + 1];
                resultData.data[i + 2] = sourceData.data[i + 2];
                var a = maskData.data[i + 3];
                if (a > sourceData.data[i + 3])
                    a = sourceData.data[i + 3];
                resultData.data[i + 3] = a;
            }

            // put数据
            context.putImageData(resultData, 0, 0);

            if (callback != null)
                callback(canvas);
        };
        maskImage.src = "img/circle.png";
        */
    },

    /**
     * 保存图片结束处理
     */
    SaveImageFinish: function(data, fileName) {
        // blob.name = fileName;
        if (ImageCropper.GetBlobCallback != null)
            ImageCropper.GetBlobCallback(data, ImageCropper.ImageFileName);
        ImageCropper.CreateResource(data, fileName);
        ImageCropper.Quit();
    },

    /**
     * 保存图片
     */
    SaveImage: function() {
        if (!ImageCropper.IsUIInteractive())
            return;

        var blob;
        var extend = "image/" + (ImageCropper.ImageExtend === "gif" ? "gif" : "png"); //由于转成部分格式如jpeg会丢失透明度在ios由于透明度用黑色代替所以会表现出来
        // var fileName = Utils.GetFileName(ImageCropper.ImageFileName) + "_" + Utils.GetGuid() + "." + ImageCropper.ImageExtend;
        var fileName = (Utils.IsNullOrEmpty(ImageCropper.ImageFileName) ? Utils.GetGuid() : Utils.GetFileName(ImageCropper.ImageFileName)) + "." + ImageCropper.ImageExtend;
        var data;
        if (ImageCropper.ImageExtend === "gif") {
            data = document.getElementById("ImageContainerTarget").src;
            if (ImageCropper.IsOriImage == true) {
                blob = Utils.Base64ToBlob(data);
            } else {
                if (ImageCropper.CropType == 0) {
                    var tempAB = Utils.DataURLToArrayBuffer(data);
                    var file = GifDiss.LoadFromBufferArray(tempAB);
                    var cd = ImageCropper.Cropper.canvasData;
                    var cbd = ImageCropper.Cropper.cropBoxData;
                    var tempWidthRadio = cd.width / cd.naturalWidth;
                    var tempHeightRadio = cd.height / cd.naturalHeight;
                    var tempWidth = cbd.width / tempWidthRadio;
                    var tempHeight = cbd.height / tempHeightRadio;
                    var tempLeft = (cbd.left - cd.left) / tempWidthRadio;
                    var tempTop = (cbd.top - cd.top) / tempHeightRadio;
                    GifDiss.ClipRange(file, { x: tempLeft, y: tempTop, w: tempWidth, h: tempHeight });
                    data = Utils.ArrayBufferToDataURL(file.ToArrayBuffer(), "image/gif");
                    ImageCropper.SaveImageFinish(data, fileName);
                } else if (ImageCropper.CropType == 1) {
                    var tempAB = Utils.DataURLToArrayBuffer(data);
                    var file = GifDiss.LoadFromBufferArray(tempAB);
                    var cd = ImageCropper.Cropper.canvasData;
                    var cbd = ImageCropper.Cropper.cropBoxData;
                    var tempWidthRadio = cd.width / cd.naturalWidth;
                    var tempHeightRadio = cd.height / cd.naturalHeight;
                    var tempWidth = cbd.width / tempWidthRadio;
                    var tempHeight = cbd.height / tempHeightRadio;
                    var tempLeft = (cbd.left - cd.left) / tempWidthRadio;
                    var tempTop = (cbd.top - cd.top) / tempHeightRadio;
                    var tempX = tempLeft + tempWidth / 2;
                    var tempY = tempTop + tempHeight / 2;
                    var tempRadius = Math.min(tempWidth, tempHeight) / 2;
                    GifDiss.ClipCircle(file, { x: tempX, y: tempY, r: tempRadius });
                    data = Utils.ArrayBufferToDataURL(file.ToArrayBuffer(), "image/gif");
                    ImageCropper.SaveImageFinish(data, fileName);
                }
            }
        } else {
            if (ImageCropper.IsOriImage == true) {
                data = document.getElementById("ImageContainerTarget").toDataURL(extend);
                // blob = Utils.Base64ToBlob(data);
            } else {
                // Crop
                var croppedCanvas = ImageCropper.Cropper.getCroppedCanvas();
                if (ImageCropper.CropType == 0) {
                    data = croppedCanvas.toDataURL(extend);
                } else if (ImageCropper.CropType == 1) {
                    // Round
                    var roundedCanvas = ImageCropper.GetRoundedCanvas(croppedCanvas);
                    data = roundedCanvas.toDataURL(extend);
                    /*使用遮罩截取
                    ImageCropper.GetRoundedCanvas(croppedCanvas, function(roundedCanvas) {                        
                        data = roundedCanvas.toDataURL(extend);
                        ImageCropper.SaveImageFinish(data, fileName);
                    });
                    return;                
                    */
                }
                // blob = Utils.Base64ToBlob(data);
            }

            ImageCropper.SaveImageFinish(data, fileName);
        }
    },

    /**
     * 退出
     */
    Quit: function() {
        if (!ImageCropper.IsUIInteractive())
            return;

        // ImageCropper.ImageLoading = false;
        // ImageCropper.CropType = 0;
        // if (ImageCropper.RuleIndex >= 0) {
        //     document.styleSheets[0].deleteRule(ImageCropper.RuleIndex);
        //     ImageCropper.RuleIndex = -1;
        // }
        ImageCropper.Reset();
        // ImageCropper.FileSelectContainer.style.display = "none";
        var fileSelectContainer = document.getElementById("FileSelectContainer");
        fileSelectContainer.style.display = "none";
        if (ImageCropper.ShowParentFunction != null)
            ImageCropper.ShowParentFunction();
        Datas.Functions.Back();
    },

    /**
     * 退出图片裁剪
     */
    ExitLocal: function() {
        ImageCropper.Quit();
    },

    /**
     * 图片裁剪
     */
    ImageCrop: function() {
        ImageCropper.SaveImage();
    },

    /**
     * html加载完成
     */
    Onload: function() {
        // ImageCropper.ReadySelectImage();
        if (ImageCropper.ImageInput != null)
            ImageCropper.SelectImage(ImageCropper.ImageInput);
        else if (ImageCropper.ImageDatas != null && ImageCropper.ImageDatas.length > 0)
            ImageCropper.SetImage(ImageCropper.ImageDatas[0]);
        ImageCropper.AspectRatio = ImageCropper.DefaultAspectRatio;
    }
};