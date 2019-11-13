/**
 * 分享组件
 * @author 陈五洲 (880123)
 * @version 1.0.0
 * @see http://ndsdn.nd.com.cn/index.php?title=Edbox%E6%B8%B8%E6%88%8F%E7%BC%96%E8%BE%91%E5%99%A8%E5%88%86%E4%BA%AB%E7%BC%96%E8%BE%91
 */

$(function(){
	
	window.onload =  function() {
		var bg = document.getElementById('bg');
		var bgX = bg.getBoundingClientRect().x || bg.getBoundingClientRect().left;
		// 根据页面主体大小，保证页面水平及垂直居中
		var bgWidth = bg.offsetWidth;
		var bgHeight = bg.offsetHeight;
		//bg.style.margin = -(bgHeight/2) + 'px 0 0' + -(bgWidth/2) + 'px';
		bg.style.marginTop = -(bgHeight/2) + 'px';
		bg.style.marginLeft = -(bgWidth/2) + 'px';
	};
	
	var tips = {
		  Share: {
            English: "Share",
            SimplifiedChinese: "分享",
            TraditionalChinese: "分享"
        },

        ShareGame: {
            English: "Share Game",
            SimplifiedChinese: "分享游戏",
            TraditionalChinese: "分享遊戲"
        },
		
		OK: {
            English: "OK",
            SimplifiedChinese: "确定",
            TraditionalChinese: "確定"
        },

        UrlCopy: {
            English: "Link copied successfully~",
            SimplifiedChinese: "链接复制成功~",
            TraditionalChinese: "鏈接復制成功~"
        },

        SaveLocal: {
            English: "Download",
            SimplifiedChinese: "保存到本地",
            TraditionalChinese: "保存到本地"
        },
	}
	
	// 游戏名称
	var h2 = document.getElementById("h2");
	
	// 隐藏tip
	document.getElementById('pop-box-tip').style.display = 'none';
	
    var gametitle = "Edbox";
    var appurl = "http://edbox.101.com/";
    var appicon = "img/cover.png";
    
    var bgImg = "img/bg2.jpg"; //背景图
    var bgewm = "img/ewm-bg.jpg"; 

    var wechatIndex = 0;
    var sharestypes = [ 'facebook', 'friend', 'qq', 'twitter', 'weibo', 'link'];

    var bgPic = document.getElementById("bgPic");
    var ewmPic = document.getElementById("ewmPic");

    h2.innerHTML = gametitle;

    ewmPic.src = bgewm;
    bgPic.src = bgImg;
    
    // 更新监听
    BindInitEdiotr();

    BindUpdateEdiotr();

    // 重置监听
    //BindRestoreEdiotr();

    $('#close').on('click',function(){
        OnBtnClose();
    })


    // 获取EdboxArgs数据
    Edbox.Start(function(isLogin){

        if (!isLogin) return;

        RefreshLanguage();

        if (Edbox.GameId === "") return;

        if (Edbox.Access === 1){

            Edbox.MMO.GetTemplateInfo(Edbox.GameId, Edbox.Version, function(data){		
                MakeAppQR(data.icon);	
                h2.innerHTML = data.app_name;							
            });	
        }
        else if (Edbox.Access === 2){

            Edbox.MMO.GetProductInfo(Edbox.GameId, function(data){
                MakeAppQR(data.icon);
                h2.innerHTML = data.app_name;	
            });	
        }
        else if (Edbox.Access === 3){

            Edbox.MMO.GetAppInfo(Edbox.GameId, function(data){
                MakeAppQR(data.icon);	
                h2.innerHTML = data.app_name;	
            });	
        }
        
        // 判断是否是编辑器预览
        var typeparam = GetQueryString("type");
        if (typeparam){
            // 背景图刷新
            RefreshBG(GetQueryString("bg"));
            RefreshQRbg(GetQueryString("qrbg"));
            
            // 分享图标刷新
            var shareparam = GetQueryString("share");
            if (!shareparam) shareparam = "";
            var arr = shareparam.split("_");

            RefShareLink(arr);	
            BindShareEvt();
        }
   
    });	

    // 刷新二维码中的游戏图标
    function MakeAppQR(icon) {
        // 获取icon地址
        Edbox.Resource.GetImage(icon, function(iconurl){
            appicon = iconurl;

            Edbox.MMO.GetGameLink(Edbox.GameId, Edbox.Version, Edbox.Access, 2, function(url){	
                // 设置分享链接地址
                appurl = url;
                RefreshQR(url);
            })
        })			
    };
	
	    
	// 获取多语言信息
	function GetTips(id){
		if(tips[id]){
			return tips[id][Edbox.Language] || "";
		}
		
		return "";
	};

    // 多语言信息刷新
    function RefreshLanguage(){
	
		var h1 = document.getElementById("h1");
        h1.innerHTML = GetTips("ShareGame");
		var downqr = document.getElementById("downqr");
        downqr.innerHTML = GetTips("SaveLocal");
		var tip = document.getElementById("pop-tip-context");
        tip.innerHTML = "<img src='img/tip.png'> " + GetTips("UrlCopy");
		var shareto = document.getElementById("share-to");
		shareto.innerHTML = GetTips("Share");
    };


    // 获取Name字段满足的数据
    GetInfoByKey = function (datas, key){

        if (!datas){
            return null;
        }

        if (datas.Name && datas.Name === key){
            return datas;
        }

        if (datas.Datas){

            for (let index = 0; index < datas.Datas.length; index++) {
                const element = datas.Datas[index];
                var data = GetInfoByKey(element, key);
                if (data){
                    return data;
                }
            }
        }
        else
        {
            return null;
        }
    };
    

    // 绑定编辑页面初始化信息
    function BindInitEdiotr(){
        // 添加更新数据事件(监听编辑器发送的消息)
        Edbox.Message.AddMessageHandler("Init", function (datas, com) {
   
            console.log(["Init", datas]);
            var data = datas[0];
            var baseinfo = GetBaseInfo(data);
            h2.innerHTML = baseinfo.GameName;
            // 生成二维码
            MakeAppQR(baseinfo.CoverImageValue);	

            for (let index = 0; index < data.Datas.length; index++) {
                var element = data.Datas[index];

                if (!element.Class || element.Class !== "Share") continue;

                var shareData = element.Datas[0];

                // 背景图
                var bg = GetInfoByKey(shareData, "share_bg");
                if (bg){
                    RefreshBG(bg.GUID);
                }

                // qr背景图
                var qrbg = GetInfoByKey(shareData, "share_qrbg");
                if (qrbg){
                    RefreshQRbg(qrbg.GUID);
                }

                // 获取开启渠道
                var channel = GetInfoByKey(shareData, "share_type");
                if (channel){
                    RefShareLink(channel.Key);	
                    BindShareEvt();
                }      
            }

        });
    }

    // 绑定编辑页面更新信息
    function BindUpdateEdiotr(){
        // 添加更新数据事件(监听编辑器发送的消息)
        Edbox.Message.AddMessageHandler("Update", function (datas, com) {
            var data = datas[0];
            console.log(["Update", data]);

            if (data.Name === "share_type"){
                RefShareLink(data.Key);
            }
            else if ("share_bg" === data.Name){
                // 背景图刷新
                RefreshBG(data.GUID);
            }
            else if ("share_qrbg" === data.Name){
                // qr背景图刷新
                RefreshQRbg(data.GUID);
            }
        });
    } 
     
    // 绑定编辑页面重置信息
    function BindRestoreEdiotr(){
        // 添加还原点击数据事件(监听编辑器发送的消息)
        Edbox.Message.AddMessageHandler("RestoreButtonClick", function (datas, com) {
            var data = datas[0];
            console.log(["RestoreButtonClick", data]);

            if (data.Name === "share_type"){
                RefShareLink(data.Key);
            }
            else if ("share_bg" === data.Name){
                // 背景图刷新
                RefreshBG(data.GUID);
            }
            else if ("share_qrbg" === data.Name){
                // qr背景图刷新
                RefreshQRbg(data.GUID);
            }

            Edbox.Message.Broadcast("Message",[data]);

            Edbox.Message.Broadcast("Restore",[data, "还原"]);
        });

        Edbox.Message.AddMessageHandler("MessageButtonClick", function (datas, com) {
            var data = datas[0];
            console.log(["MessageButtonClick", data]);

            var resetData = {
                "ID": "Share", 
                "Name": "Share", 
                "Type": "Tab01", 
                "ShowName": "分享页面", 
                "Class": "Share", 
                "Resetable": true,
                "Width": 800,
                "Height": 600,
                "Datas": [                                                                     
                    {   
                        "ID": "share_setting",                          
                        "Name": "share_setting",                       
                        "ShowName": "界面",                           
                        "Type": "Tab02",                               
                        "Datas": [
                            {
                                "ID": "share_open",                          
                                "Name": "share_open",                       
                                "ShowName": "分享设置",                           
                                "Type": "Tab03",
                                "Datas": [
                                    {
                                        "ID": "share_switch",
                                        "Name": "share_switch",
                                        "ShowName": "分享开关",   
                                        "Type": "Switch01",
                                        "ReadOnly": false,
                                        "Value": false
                                    }
                                ]
                            },
                            {                                                     
                                "ID": "share_dialog",                          
                                "Name": "share_dialog",                       
                                "ShowName": "界面",                           
                                "Type": "Tab03",                               
                                "Datas": [
                                    {
                                        "ID": "share_bg",
                                        "Name": "share_bg",
                                        "ShowName": "分享页背景图",   
                                        "Type": "Image01",
                                        "Value": "",
                                        "GUID": "",
                                        "Width": 640 ,
                                        "Height": 360,
                                        "ReadOnly": false,
                                        "ImageType": [
                                            "png"
                                        ]    
                                    },
                                    {
                                        "ID": "share_qrbg",
                                        "Name": "share_qrbg",
                                        "ShowName": "二维码底图",
                                        "Type": "Image01",
                                        "Value": "",
                                        "GUID": "",
                                        "Width": 346,
                                        "Height": 306,
                                        "ReadOnly": false,
                                        "ImageType": [
                                            "png"
                                        ]    
                                    }
                                ]
                            },        
                            {
                                "ID": "share_channel",
                                "Name": "share_channel",
                                "ShowName": "分享设置",
                                "Type": "Tab03",
                                "Editable": false,
                                "Datas": [
                                    {
                                        "ID": "share_type",
                                        "Name": "share_type",
                                        "Type": "Select03",
                                        "ShowName": "分享途径:",
                                        "Value": [],
                                        "ReadOnly": false,
                                        "Items": ["好友","Facebook","Twitter","QQ","新浪微博"],
                                        "Key": [],
                                        "Keys": ["friend","facebook","twitter","qq","weibo"]
                                    }                    
                                ]
                            }   						
                        ]    
                    }		
                ]
            };

            Edbox.Message.Broadcast("Restore",[resetData, "还原"]);
        });
    } 
   
    /*
    var args = Edbox.DataSet.Get("EdboxArgs");
    
    if(!args){
        console.error("没有传入EdboxArgs参数")
    }
    */

    // 获取基础信息
    function GetBaseInfo (datas) {
        var baseinfo = new Object();
        var list = datas.Datas;
        for (var i = 0; i <= list.length; i++) {
            var tab = list[i];
            if (tab.Name === "BaseInfo") {
                for (var j = 0; j < tab.Datas.length; j++) {
                    var key = tab.Datas[j];
                    if (key.Name === "GameName") {
                        baseinfo.GameName = key.Value;
                    }
                    if (key.Name === "Description") {
                        baseinfo.Description = key.Value;
                    }
                    if (key.Name === "CoverImage") {    
                        baseinfo.CoverImage = key.GUID;
                        baseinfo.CoverImageValue = key.Value;
                    }
                }
                break;
            }
        }
        return baseinfo;
    };
        	

    // 刷新背景图
    function RefreshBG(bg) {
        
        if (bg && bg !== ""){
            Edbox.Resource.GetImage(bg, function(iconurl){
                bgPic.src = iconurl;
            }, function(){
                bgPic.src = bgImg; 
            });
        }
        else{
            bgPic.src = bgImg; 
        }
    };

    // 刷新二维码背景图
    function RefreshQRbg(qrbg) {
    
        if (qrbg && qrbg !== ""){
            Edbox.Resource.GetImage(qrbg, function(iconurl){
                ewmPic.src = iconurl;
            }, function(){
                ewmPic.src = bgewm;
            });
        }
        else{
            ewmPic.src = bgewm;
        }
    };


    // 获取参数
    function GetQueryString (name) {
        var url = window.location.href;

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
            ans = decodeURIComponent(ans);
            return ans;
        }
        return null;
    }
    

    // 生成二维码数据
    function RefreshQR(url){
        $("#qrcode").qrcode({
            render : 'canvas',    //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
            text : url,    //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
            width : "185",               //二维码的宽度
            height : "185",              //二维码的高度
            background : "#ffffff",       //二维码的后景色
            foreground : "#000000"       //二维码的前景色
        });
            
        creatEwm(convertCanvasToImage, document.getElementById('myCanvas'), function (dataUrl) {	
            Edbox.QRCode.Datas = dataUrl;

            // 绑定下载
            var downqr = document.getElementById("downqr");
            // 绑定下载
            downqr.onclick = function(){
                Edbox.QRCode.Download(gametitle);
            }
        })
    };

    function creatEwm(base64, canvas, callback) {
        var ctx = canvas.getContext("2d");
        var img = document.createElement('img');
        img.setAttribute("crossOrigin",'Anonymous');
        img.src = appicon;
        img.onload = function () {
                var imgUpload = new Image();
                imgUpload.src = base64();
                imgUpload.onload = function () {
                // 绘制
                ctx.drawImage(imgUpload, 0, 0, 185, 185);
                ctx.drawImage(img, 62, 62, 61, 61);
                callback(canvas.toDataURL("image/jpeg"))
                };
        }
    };

    function convertCanvasToImage() {
        var canvas = $("#qrcode canvas")[0].toDataURL("image/jpeg")
        return canvas
    };
    
    // 刷新分享链接图标
    function RefShareLink(linkLst) {
        
        linkLst = !linkLst ? new Array() : linkLst;

        if (linkLst.indexOf("link") < 0){
            linkLst.push("link");
        }

        RefShareIcon();

        function RefShareIcon(){
          
            if (Edbox.Platform.IsIOS || Edbox.Platform.IsAndroid) {
                return;
            }
                
            var shareHmtl = '';
            wechatIndex = 0;
            for(var i=0; i<linkLst.length; i++){
    
                if (sharestypes.indexOf(linkLst[i]) < 0) continue;
                
                if(linkLst[i] === 'wechat') {
                    //微信分享单独增加ID属性
                    wechatIndex = i;
                }
    
                shareHmtl += '<a href="#" id=' + linkLst[i] + '><img src="img/'+ linkLst[i] +'.png" alt="'+ linkLst[i] +'"></a>'
            }
    
            var shareCon = document.getElementById("share-con");
    
            shareCon.innerHTML = shareHmtl;
        };

    };

    
    function BindShareEvt(){

        ShareLink();
        //ShareWechat();   
        ShareQQ();   
        ShareWeibo();   
        ShareFacebook();   
        ShareTwitter();   
        ShareIM();
    };
    
    // 分享链接
    function ShareLink(){

        var btn = document.getElementById('link');
        if (!btn) return;

        btn.addEventListener('click', function () {
            var node = document.getElementById('copy');//input框
            node.setAttribute('value', appurl);
            var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
            if (issafariBrowser) {
                //safari浏览器单独处理
                node.setSelectionRange(0, 9999);
            }
            else {
                //其他浏览器
                const range = document.createRange();
                range.selectNode(node);
                const selection = window.getSelection();
                if (selection.rangeCount > 0) selection.removeAllRanges();
                selection.addRange(range);
            }
			
            document.execCommand('copy');	
			document.getElementById('pop-box-tip').style.display = '';
			
			 setTimeout(function () {
				document.getElementById('pop-box-tip').style.display = 'none';
			}, 2000);
        })
    };

    // QQ
    function ShareQQ(){

        var qq = $('#qq');
        if (!qq) return;

        qq.on('click',function(){
            Edbox.Share.ShareQQ(Edbox.GameId);
        });

    };

    // 微博
    function ShareWeibo(){

        var weibo = $('#weibo');
        if (!weibo) return;

        weibo.on('click',function(){
            Edbox.Share.ShareWeibo(Edbox.GameId);
        });

    };


    // facebook
    function ShareFacebook(){

        var facebook = $('#facebook');
        if (!facebook) return;

        facebook.on('click',function(){
            Edbox.Share.ShareFacebook(Edbox.GameId);
        });

    };

    // twitter
    function ShareTwitter(){

        var twitter = $('#twitter');
        if (!twitter) return;

        twitter.on('click',function(){
            Edbox.Share.ShareTwitter(Edbox.GameId);
        });
    };

    
    // firend
    function ShareIM(){

        var friend = $('#friend');
        if (!friend) return;

        friend.on('click',function(){

            var shareWindow = document.createElement("iframe");
            shareWindow.id = "shareIM";
            shareWindow.setAttribute("src", getUrl());
            shareWindow.style.width = "100%";
            shareWindow.style.height = "100%";
            shareWindow.style.overflow = "hidden";
            shareWindow.style.position = "fixed";
            shareWindow.style.top = "0";
            shareWindow.style.left = "0";
            shareWindow.style.height = "100%";
            shareWindow.style.width = "100%";
            shareWindow.style.margin = "0";
            shareWindow.style.padding = "0";
            shareWindow.style.border = "0";
            shareWindow.style.zIndex = "9999";
            //ShowDom.style.backgroundColor = "#000";
            window.onresize = function(){
                shareWindow.style.top = getPosTop();  
            };

            window.addEventListener('message',function(event){
                if (event.data === 'closeIM') {
                    $("#shareIM").remove();
                }
            },false);

            document.body.appendChild(shareWindow);

            function getPosTop()
            {
                return Math.max(0, (top.window.innerHeight - 644) / 2 + top.pageYOffset) + "px";
            };
            
            function getUrl(){
                
                var url = Edbox.Protocol + "://" + Edbox.GetHost("Component") + "/coms/IM/index.html";
                var param = "?EdboxArgs=" + Edbox.DataSet.Get("EdboxArgs");

                url = url + param;

                return url;
            };
        });
        
    };
   


    // 微信
    function ShareWechat(){
        var wechat = document.getElementById('wechat');
        if (!wechat) return;

        var wechatPop = document.getElementById('wechat-qp');
        var bg = document.getElementById('bg');
        var position = wechat.getBoundingClientRect(); //获取微信分享图标的坐标
        var wechatX = position.x || position.left;
        var wechatY = position.y || position.top;
        var bgX = bg.getBoundingClientRect().x || bg.getBoundingClientRect().left;

        wechat.onmouseover = function(){
            //判断是横屏还是竖屏
            if(document.body.clientWidth > document.body.clientHeight){
                wechatPop.style.left = (wechatX - bgX - 278) + 'px';
                wechatPop.style.top = wechatY + 'px';
            }else {//竖屏状态弹窗的处理
                //第一列的弹窗位置处理
                if(wechatIndex % 4 === 0) {
                    wechatPop.style.left = 0 + 'px';
                }

                //第四列的弹窗位置处理
                if(wechatIndex % 4 === 3) {
                        wechatPop.style.right = 0 + 'px';
                }

                //第四列的弹窗位置处理
                if(wechatIndex % 4 === 1 || wechatIndex % 4 === 2) {
                    var left = wechatX - 139 < 0 ? 0 : wechatX - 139
                    wechatPop.style.left = left + 'px';
                }
                
                wechatPop.style.top = (wechatY - 123) + 'px';
                wechatPop.style.display = 'block';
            }
            wechatPop.style.display = 'block';
        }
    };


    function OnBtnClose(){
        if (parent){
            parent.window.postMessage("closeShare", "*");
        }
    };
    
})