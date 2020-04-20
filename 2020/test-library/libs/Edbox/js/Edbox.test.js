/*
* @Description: 组件代码测试
* @Author: chenbinjian_110181
* @Date: 2019-08-06 10:16:24
 * @LastEditTime: 2019-08-12 14:53:16
 * @LastEditors: Please set LastEditors
*/
(async function (namespace) {
    var module = {
        // Edbox通用组件
        fn1: async function () {
            var module = {
                /** 
                 * 测试 登录、退出、跳转编辑器、跳转试玩页面
                 */
                TestProcess: async function () {
                    // Edbox.Start 登录启动
                    await TestAsyncFunc("Edbox.Start", Edbox.Start);
                    // 退出
                    TestFuncValid("Edbox.Logout", Edbox.Logout);
                    // 跳转编辑器
                    TestFuncValid("Edbox.GotoEditor", Edbox.GotoEditor);
                    // 跳转试玩页面
                    TestFuncValid("Edbox.GotoPreviewGame", Edbox.GotoPreviewGame);
                },

                /**
                 * 测试 Url地址中参数设置
                 */
                TestUrlOpt: function () {
                    var url = "http://192.168.211.44:19001/Pages/Packer/#/DevRelease";
                    var name = "testName";
                    var value = "testValue";

                    url = Edbox.SetQueryString(name, value, url);
                    var getStr = Edbox.GetQueryString(name, url);
                    if (getStr === value)
                        success("Edbox.SetQueryString(" + name + "," + value + ")", url);
                    else
                        error("Edbox.SetQueryString(" + name + "," + value + ")", url);

                    url = Edbox.RemoveQueryString(name, url);
                    getStr = Edbox.GetQueryString(name, url);
                    if (!getStr)
                        success("Edbox.RemoveQueryString(" + name + ")", url);
                    else
                        error("Edbox.RemoveQueryString(" + name + ")", url);
                },

                /**
                 * 测试 Base64加解密操作
                 */
                TestBaseOpt: function () {
                    var b64 = TestGetFunc("Edbox.Encode('test')", Edbox.Encode("test"));
                    TestGetFunc("Edbox.Decode(" + b64 + ")", Edbox.Decode(b64));
                },

                /**
                 * 测试 Cookie操作
                 */
                TestCookieOpt: function () {
                    var key = "a";
                    var value = "1";
                    Edbox.Cookie.Set(key, value, 10000);
                    var getKey = Edbox.Cookie.Get(key);
                    if (getKey === value)
                        success("Edbox.Cookie.Set(" + key + "," + value + ",10000)", "Edbox.Cookie.Get(" + key + ")返回值为:" + getKey);
                    else
                        error("Edbox.Cookie.Set(" + key + "," + value + ",10000)", "Edbox.Cookie.Get(" + key + ")返回值为:" + getKey);
                    Edbox.Cookie.Delete(key);
                    getKey = Edbox.Cookie.Get(key);
                    if (getKey === "")
                        success("Edbox.Cookie.Delete(" + key + ")", "Edbox.Cookie.Get(" + key + ")返回值为:" + getKey);
                    else
                        error("Edbox.Cookie.Delete(" + key + ")", "Edbox.Cookie.Get(" + key + ")返回值为:" + getKey);
                },

                /**
                 * 测试 语言设置
                 */
                TestLauguageOpt: function () {
                    Edbox.SetLanguage("en");
                    success("Edbox.SetLanguage('en')", "当前Edbox.language：" + Edbox.Language);

                    Edbox.SetLanguage("hk");
                    success("Edbox.SetLanguage('hk')", "当前Edbox.language：" + Edbox.Language);

                    Edbox.SetLanguage("cn");
                    success("Edbox.SetLanguage('cn')", "当前Edbox.language：" + Edbox.Language);
                },

                /**
                 * 测试 获取信息(组织、登录信息、Host地址、试玩URL、分享URL)
                 */
                TestGetInfo: async function () {
                    // 获取组织信息
                    await TestAsyncFunc("Edbox.GetOrgInfo", Edbox.GetOrgInfo);
                    // Edbox.GetLoginInfo获取Base64编码的登录信息
                    TestGetFunc("Edbox.GetLoginInfo()", Edbox.GetLoginInfo());
                    // Edbox.GetHost 获取Host地址
                    TestGetFunc("Edbox.GetHost('MMO')", Edbox.GetHost("MMO"));
                    // Edbox.GetPreviewGameUrl(success,error) 获取试玩Url
                    TestFuncValid("Edbox.GetPreviewGameUrl", Edbox.GetPreviewGameUrl);
                    // Edbox.GetShareUrlFromServer(success,error) 从服务端获取分享Url
                    TestFuncValid("Edbox.GetShareUrlFromServer", Edbox.GetShareUrlFromServer);
                }
            };

            var funcs = Object.values(module);
            // 进行所有测试
            for (var i in funcs) {
                var func = funcs[i];
                if ("function" === typeof func) {
                    await func();
                }
            }
        },

        // Edbox通用资源加载组件JS版
        fn2: async function () {
            var module = {
                // 测试用 GUID
                testImgGuid: "df3695d9-e0cf-4b8b-a683-d485611c6914",
                testAudioGuid: "d476f5c2-4d67-440c-aa0a-180d08071547",
                testFontGuid: "5d0b87c5-653f-4fc3-8937-329a7a2e0b3d",
                // 通用资源获取 Edbox.Resource.Get(guid, success, error, async);
                TestResourceGet: async function () {
                    await TestAsyncFunc("Edbox.Resource.Get", Edbox.Resource.Get, module.testImgGuid);
                },

                // 请求图片地址 Edbox.Resource.GetImage(guid, success, error, formats, async);
                TestResourceGetImg: async function () {
                    await TestAsyncFunc("Edbox.Resource.GetImage", Edbox.Resource.GetImage, module.testImgGuid);
                },

                // 请求音频地址 Edbox.Resource.GetAudio(guid, success, error, formats, async);
                TestResourceGetAudio: async function () {
                    await TestAsyncFunc("Edbox.Resource.GetAudio", Edbox.Resource.GetAudio, module.testAudioGuid);
                },

                // 请求字体地址 Edbox.Resource.GetFont(guid, success, error, formats, async);
                TestResourceGetFont: async function () {
                    await TestAsyncFunc("Edbox.Resource.GetFont", Edbox.Resource.GetFont, module.testFontGuid);
                },

                // 资源包处理 
                // Edbox.Resource.GetPackage(guid, success, error, async);
                // Edbox.Resource.GetConfig(name, success, error);
                TestResourceGetPackage: async function () {
                    TestFuncValid("Edbox.Resource.GetConfig", Edbox.Resource.GetConfig);
                    TestFuncValid("Edbox.Resource.GetPackage", Edbox.Resource.GetPackage);
                },

                // 数据加载 Edbox.Resource.LoadDatas(datas, success, error);
                TestLoadDatas: async function () {
                    TestFuncValid("Edbox.Resource.LoadDatas", Edbox.Resource.LoadDatas);
                }
            };

            var funcs = Object.values(module);
            // 进行所有测试
            for (var i in funcs) {
                var func = funcs[i];
                if ("function" === typeof func) {
                    await func();
                }
            }
        },

        // Edbox通用请求授权组件JS版
        fn3: async function () {
            var module = {
                TestGetUrl: "/v0.1/api/rank/rank/actions/get_list",
                TestGetData: "id=10&player_id=" + Edbox.EbUserId + "&page=" + 1 + "&size=" + 20,
                TestProtocol: "http",
                TestHeader: {
                    "Accept-Language": "zh-CN"
                },
                // Get请求获取数据  Edbox.Request.Get(host, url, data, success, error);
                TestRequestGet: async function () {
                    await TestAsyncFunc("Edbox.Request.Get", Edbox.Request.Get, Edbox.GetHost('MMO'), module.TestGetUrl, module.TestGetData);
                },

                // Get请求获取数据 Edbox.Request.GetWithHeader(host, url, data, header, success, error, protocol);
                TestRequestGetWithHeader: async function () {
                    await TestAsyncFunc("Edbox.Request.GetWithHeader", Edbox.Request.GetWithHeader, Edbox.GetHost('MMO'), module.TestGetUrl, module.TestGetData, module.TestHeader);
                },

                // Post请求获取数据 Edbox.Request.Post(host, url, data, success, error);
                TestRequestPost: function () {
                    TestFuncValid("Edbox.Request.Post", Edbox.Request.Post);
                },

                // Post请求获取数据，带请求头 Edbox.Request.PostWithHeader(host, url, data, header, success, error, protocol);
                TestRequestPostWithHeader: function () {
                    TestFuncValid("Edbox.Request.PostWithHeader", Edbox.Request.PostWithHeader);
                }
            };

            var funcs = Object.values(module);
            // 进行所有测试
            for (var i in funcs) {
                var func = funcs[i];
                if ("function" === typeof func) {
                    await func();
                }
            }
        },

        // Edbox蒙版切图组件
        fn4: async function () {
            var module = {
                // 蒙版剔除执行
                TestMcStart: function () {
                    TestFuncValid("Edbox.MaskCutting.Start", new Edbox.MaskCutting().Start);
                },

                // 蒙版剔除设置蒙版
                TestMcSetMask: function () {
                    TestFuncValid("Edbox.MaskCutting.SetMask", new Edbox.MaskCutting().SetMask);
                }
            };

            var funcs = Object.values(module);
            // 进行所有测试
            for (var i in funcs) {
                var func = funcs[i];
                if ("function" === typeof func) {
                    await func();
                }
            }
        },

        // Edbox二维码组件JS版
        fn5: async function () {
            var module = {
                // 创建二维码
                TestQRCodeCreate: async function () {
                    TestFuncValid("Edbox.QRCode.Create", Edbox.QRCode.Create);
                },

                // 显示二维码
                TestQRCodeShow: function () {
                    TestFuncValid("Edbox.QRCode.Show", Edbox.QRCode.Show);
                },
                // 隐藏二维码
                TestQRCodeHide: function () {
                    TestFuncValid("Edbox.QRCode.Hide", Edbox.QRCode.Hide);
                }
            };

            var funcs = Object.values(module);
            // 进行所有测试
            for (var i in funcs) {
                var func = funcs[i];
                if ("function" === typeof func) {
                    await func();
                }
            }
        },

        // Edbox MMO组件JS版
        fn6: async function () {
            var module = {
                testGuid: "113c93d0-401e-11e9-909c-ab890e471017",
                // 获取模板或个人作品信息 
                // 获取模板或个人作品信息 Edbox.MMO.GetInfo(productid, success, error,change);
                // 获取模板信息 Edbox.MMO.GetTemplateInfo(productid,version, success, error);
                // 获取个人作品信息 Edbox.MMO.GetProductInfo(productid, success, error);
                TestMMOGetInfo: async function () {
                    await TestAsyncFunc("Edbox.MMO.GetInfo()", Edbox.MMO.GetInfo, module.testGuid);
                    TestFuncValid("Edbox.MMO.GetTemplateInfo", Edbox.MMO.GetTemplateInfo);
                    TestFuncValid("Edbox.MMO.GetProductInfo", Edbox.MMO.GetProductInfo);
                },

                // 验证作品是否重名 Edbox.MMO.IsNameDuplicate(productid,releaseMode,productname, type,success, error);
                TestIsNameDupliacate: async function () {
                    await TestAsyncFunc("Edbox.MMO.IsNameDuplicate", Edbox.MMO.IsNameDuplicate, module.testGuid, 1, "水果大师", 1);
                },

                // 敏感词判断  Edbox.MMO.IsSensitive(word, success, error);
                TestIsSensitive: async function () {
                    await TestAsyncFunc("Edbox.MMO.IsSensitive", Edbox.MMO.IsSensitive, "testword");
                },

                // 保存作品  
                // Edbox.MMO.SaveProduct
                // Edbox.MMO.CreateProduct
                // Edbox.MMO.UpdateProduct
                TestSavaProduct: function () {
                    TestFuncValid("Edbox.MMO.SaveProduct", Edbox.MMO.SaveProduct);
                    TestFuncValid("Edbox.MMO.CreateProduct", Edbox.MMO.CreateProduct);
                    TestFuncValid("Edbox.MMO.UpdateProduct", Edbox.MMO.UpdateProduct);
                },

                // 获取试玩信息 Edbox.MMO.GetTrialPlayInfo
                TestGetTrialPlayInfo: function () {
                    TestFuncValid("Edbox.MMO.GetTrialPlayInfo", Edbox.MMO.GetTrialPlayInfo);
                },

                // 获取试玩列表 Edbox.MMO.GetProductList
                TestGetProductList: function () {
                    TestFuncValid("Edbox.MMO.GetProductList", Edbox.MMO.GetProductList);
                },

                // 发布作品 Edbox.MMO.ReleaseProduct
                TestReleaseProduct: function () {
                    TestFuncValid("Edbox.MMO.ReleaseProduct", Edbox.MMO.ReleaseProduct);
                }
            };
            var funcs = Object.values(module);
            // 进行所有测试
            for (var i in funcs) {
                var func = funcs[i];
                if ("function" === typeof func) {
                    await func();
                }
            }
        },

        // Edbox NDR组件JS版
        fn7: async function () {
            var module = {
                testGUID: "c21eaa8a-2688-4558-a5fe-6e910e5cffbf",
                testGUID2: "c0881779-6750-49f4-96cd-0e1782b66ff0",
                testData: "testData",
                testBlog: "testBlob",
                // 请求资源
                // 请求资源 Edbox.NDR.Get
                // 基于Url后缀请求资源 Edbox.NDR.GetWithUrlFormats
                // 请求资源列表 Edbox.NDR.GetList
                TestGet: async function () {
                    await TestAsyncFunc("Edbox.NDR.Get", Edbox.NDR.Get, module.testGUID);
                    await TestAsyncFunc("Edbox.NDR.GetWithUrlFormats", Edbox.NDR.GetWithUrlFormats, module.testGUID2);
                    TestFuncValid("Edbox.NDR.GetList", Edbox.NDR.GetList);
                },
                // 获取File的文本类型数据 Edbox.NDR.GetFileData
                TestGetFileData: function () {
                    TestFuncValid("Edbox.NDR.GetFileData", Edbox.NDR.GetFileData);
                },
                // 上传资源 Edbox.NDR.Post
                TestPost: function () {
                    TestFuncValid("Edbox.NDR.Post", Edbox.NDR.Post);
                },
                // Base64转Blob数据 Edbox.NDR.Base64ToBlob
                TestB64ToBlob: function () {
                    TestFuncValid("Edbox.NDR.Base64ToBlob", Edbox.NDR.Base64ToBlob);
                },
                // Blob转Base64 Edbox.NDR.BlobToBase64
                TestBlobToB64: function () {
                    TestFuncValid("Edbox.NDR.BlobToBase64", Edbox.NDR.BlobToBase64);
                }
            };
            var funcs = Object.values(module);
            // 进行所有测试
            for (var i in funcs) {
                var func = funcs[i];
                if ("function" === typeof func) {
                    await func();
                }
            }
        },

        // Edbox 前端分类库组件JS版
        fn8: async function () {
            var module = {
                testID: "df489d22-b6e4-4140-8a79-f616c26c1991",
                // 参数配置 Edbox.FrontendLib.DimensionID
                TestDimensionID: function () {
                    Edbox.FrontendLib.DimensionID = module.testID;
                },
                // 查询前端分类树 Edbox.FrontendLib.GetSortTree(tag, success, error)
                TestGetSortTree: async function () {
                    await TestAsyncFunc("Edbox.FrontendLib.GetSortTree", Edbox.FrontendLib.GetSortTree, "");
                },
                // 获取分类下的资源列表 Edbox.FrontendLib.GetResources(tag,key,page,size, success, error); 
                TestGetResources: async function () {
                    await TestAsyncFunc("Edbox.FrontendLib.GetResources", Edbox.FrontendLib.GetResources, "", "", "", "");
                }
            };

            var funcs = Object.values(module);
            // 进行所有测试
            for (var i in funcs) {
                var func = funcs[i];
                if ("function" === typeof func) {
                    await func();
                }
            }
        },

        //Edbox消息组件
        fn9: async function () {
            var module = {
                Test: function () {
                    TestFuncValid("Edbox.Message.AddMessageHandler", Edbox.Message.AddMessageHandler);
                    TestFuncValid("Edbox.Message.Broadcast", Edbox.Message.Broadcast);
                }
            };

            var funcs = Object.values(module);
            // 进行所有测试
            for (var i in funcs) {
                var func = funcs[i];
                if ("function" === typeof func) {
                    await func();
                }
            }
        }
    };
    var funcs = Object.values(module);
    // 进行所有测试
    for (var i in funcs) {
        var func = funcs[i];
        if ("function" === typeof func) {
            await func();
        }
    }
}(window));