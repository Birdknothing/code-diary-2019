/*
* @Description: 组件代码测试
* @Author: chenbinjian_110181
* @Date: 2019-08-06 10:16:24
 * @LastEditTime: 2019-08-12 14:53:16
 * @LastEditors: Please set LastEditors
*/
(async function (namespace) {
    var module = {
        // UtilBarn通用组件
        fn1: async function () {
            var module = {
                /** 
                 * 测试 登录、退出、跳转编辑器、跳转试玩页面
                 */
                TestProcess: async function () {
                    // UtilBarn.Start 登录启动
                    await TestAsyncFunc("UtilBarn.Start", UtilBarn.Start);
                    // 退出
                    TestFuncValid("UtilBarn.Logout", UtilBarn.Logout);
                    // 跳转编辑器
                    TestFuncValid("UtilBarn.GotoEditor", UtilBarn.GotoEditor);
                    // 跳转试玩页面
                    TestFuncValid("UtilBarn.GotoPreviewGame", UtilBarn.GotoPreviewGame);
                },

                /**
                 * 测试 Url地址中参数设置
                 */
                TestUrlOpt: function () {
                    var url = "http://192.168.211.44:19001/Pages/Packer/#/DevRelease";
                    var name = "testName";
                    var value = "testValue";

                    url = UtilBarn.SetQueryString(name, value, url);
                    var getStr = UtilBarn.GetQueryString(name, url);
                    if (getStr === value)
                        success("UtilBarn.SetQueryString(" + name + "," + value + ")", url);
                    else
                        error("UtilBarn.SetQueryString(" + name + "," + value + ")", url);

                    url = UtilBarn.RemoveQueryString(name, url);
                    getStr = UtilBarn.GetQueryString(name, url);
                    if (!getStr)
                        success("UtilBarn.RemoveQueryString(" + name + ")", url);
                    else
                        error("UtilBarn.RemoveQueryString(" + name + ")", url);
                },

                /**
                 * 测试 Base64加解密操作
                 */
                TestBaseOpt: function () {
                    var b64 = TestGetFunc("UtilBarn.Encode('test')", UtilBarn.Encode("test"));
                    TestGetFunc("UtilBarn.Decode(" + b64 + ")", UtilBarn.Decode(b64));
                },

                /**
                 * 测试 Cookie操作
                 */
                TestCookieOpt: function () {
                    var key = "a";
                    var value = "1";
                    UtilBarn.Cookie.Set(key, value, 10000);
                    var getKey = UtilBarn.Cookie.Get(key);
                    if (getKey === value)
                        success("UtilBarn.Cookie.Set(" + key + "," + value + ",10000)", "UtilBarn.Cookie.Get(" + key + ")返回值为:" + getKey);
                    else
                        error("UtilBarn.Cookie.Set(" + key + "," + value + ",10000)", "UtilBarn.Cookie.Get(" + key + ")返回值为:" + getKey);
                    UtilBarn.Cookie.Delete(key);
                    getKey = UtilBarn.Cookie.Get(key);
                    if (getKey === "")
                        success("UtilBarn.Cookie.Delete(" + key + ")", "UtilBarn.Cookie.Get(" + key + ")返回值为:" + getKey);
                    else
                        error("UtilBarn.Cookie.Delete(" + key + ")", "UtilBarn.Cookie.Get(" + key + ")返回值为:" + getKey);
                },

                /**
                 * 测试 语言设置
                 */
                TestLauguageOpt: function () {
                    UtilBarn.SetLanguage("en");
                    success("UtilBarn.SetLanguage('en')", "当前UtilBarn.language：" + UtilBarn.Language);

                    UtilBarn.SetLanguage("hk");
                    success("UtilBarn.SetLanguage('hk')", "当前UtilBarn.language：" + UtilBarn.Language);

                    UtilBarn.SetLanguage("cn");
                    success("UtilBarn.SetLanguage('cn')", "当前UtilBarn.language：" + UtilBarn.Language);
                },

                /**
                 * 测试 获取信息(组织、登录信息、Host地址、试玩URL、分享URL)
                 */
                TestGetInfo: async function () {
                    // 获取组织信息
                    await TestAsyncFunc("UtilBarn.GetOrgInfo", UtilBarn.GetOrgInfo);
                    // UtilBarn.GetLoginInfo获取Base64编码的登录信息
                    TestGetFunc("UtilBarn.GetLoginInfo()", UtilBarn.GetLoginInfo());
                    // UtilBarn.GetHost 获取Host地址
                    TestGetFunc("UtilBarn.GetHost('MMO')", UtilBarn.GetHost("MMO"));
                    // UtilBarn.GetPreviewGameUrl(success,error) 获取试玩Url
                    TestFuncValid("UtilBarn.GetPreviewGameUrl", UtilBarn.GetPreviewGameUrl);
                    // UtilBarn.GetShareUrlFromServer(success,error) 从服务端获取分享Url
                    TestFuncValid("UtilBarn.GetShareUrlFromServer", UtilBarn.GetShareUrlFromServer);
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

        // UtilBarn通用资源加载组件JS版
        fn2: async function () {
            var module = {
                // 测试用 GUID
                testImgGuid: "df3695d9-e0cf-4b8b-a683-d485611c6914",
                testAudioGuid: "d476f5c2-4d67-440c-aa0a-180d08071547",
                testFontGuid: "5d0b87c5-653f-4fc3-8937-329a7a2e0b3d",
                // 通用资源获取 UtilBarn.Resource.Get(guid, success, error, async);
                TestResourceGet: async function () {
                    await TestAsyncFunc("UtilBarn.Resource.Get", UtilBarn.Resource.Get, module.testImgGuid);
                },

                // 请求图片地址 UtilBarn.Resource.GetImage(guid, success, error, formats, async);
                TestResourceGetImg: async function () {
                    await TestAsyncFunc("UtilBarn.Resource.GetImage", UtilBarn.Resource.GetImage, module.testImgGuid);
                },

                // 请求音频地址 UtilBarn.Resource.GetAudio(guid, success, error, formats, async);
                TestResourceGetAudio: async function () {
                    await TestAsyncFunc("UtilBarn.Resource.GetAudio", UtilBarn.Resource.GetAudio, module.testAudioGuid);
                },

                // 请求字体地址 UtilBarn.Resource.GetFont(guid, success, error, formats, async);
                TestResourceGetFont: async function () {
                    await TestAsyncFunc("UtilBarn.Resource.GetFont", UtilBarn.Resource.GetFont, module.testFontGuid);
                },

                // 资源包处理 
                // UtilBarn.Resource.GetPackage(guid, success, error, async);
                // UtilBarn.Resource.GetConfig(name, success, error);
                TestResourceGetPackage: async function () {
                    TestFuncValid("UtilBarn.Resource.GetConfig", UtilBarn.Resource.GetConfig);
                    TestFuncValid("UtilBarn.Resource.GetPackage", UtilBarn.Resource.GetPackage);
                },

                // 数据加载 UtilBarn.Resource.LoadDatas(datas, success, error);
                TestLoadDatas: async function () {
                    TestFuncValid("UtilBarn.Resource.LoadDatas", UtilBarn.Resource.LoadDatas);
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

        // UtilBarn通用请求授权组件JS版
        fn3: async function () {
            var module = {
                TestGetUrl: "/v0.1/api/rank/rank/actions/get_list",
                TestGetData: "id=10&player_id=" + UtilBarn.EbUserId + "&page=" + 1 + "&size=" + 20,
                TestProtocol: "http",
                TestHeader: {
                    "Accept-Language": "zh-CN"
                },
                // Get请求获取数据  UtilBarn.Request.Get(host, url, data, success, error);
                TestRequestGet: async function () {
                    await TestAsyncFunc("UtilBarn.Request.Get", UtilBarn.Request.Get, UtilBarn.GetHost('MMO'), module.TestGetUrl, module.TestGetData);
                },

                // Get请求获取数据 UtilBarn.Request.GetWithHeader(host, url, data, header, success, error, protocol);
                TestRequestGetWithHeader: async function () {
                    await TestAsyncFunc("UtilBarn.Request.GetWithHeader", UtilBarn.Request.GetWithHeader, UtilBarn.GetHost('MMO'), module.TestGetUrl, module.TestGetData, module.TestHeader);
                },

                // Post请求获取数据 UtilBarn.Request.Post(host, url, data, success, error);
                TestRequestPost: function () {
                    TestFuncValid("UtilBarn.Request.Post", UtilBarn.Request.Post);
                },

                // Post请求获取数据，带请求头 UtilBarn.Request.PostWithHeader(host, url, data, header, success, error, protocol);
                TestRequestPostWithHeader: function () {
                    TestFuncValid("UtilBarn.Request.PostWithHeader", UtilBarn.Request.PostWithHeader);
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

        // UtilBarn蒙版切图组件
        fn4: async function () {
            var module = {
                // 蒙版剔除执行
                TestMcStart: function () {
                    TestFuncValid("UtilBarn.MaskCutting.Start", new UtilBarn.MaskCutting().Start);
                },

                // 蒙版剔除设置蒙版
                TestMcSetMask: function () {
                    TestFuncValid("UtilBarn.MaskCutting.SetMask", new UtilBarn.MaskCutting().SetMask);
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

        // UtilBarn二维码组件JS版
        fn5: async function () {
            var module = {
                // 创建二维码
                TestQRCodeCreate: async function () {
                    TestFuncValid("UtilBarn.QRCode.Create", UtilBarn.QRCode.Create);
                },

                // 显示二维码
                TestQRCodeShow: function () {
                    TestFuncValid("UtilBarn.QRCode.Show", UtilBarn.QRCode.Show);
                },
                // 隐藏二维码
                TestQRCodeHide: function () {
                    TestFuncValid("UtilBarn.QRCode.Hide", UtilBarn.QRCode.Hide);
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

        // UtilBarn MMO组件JS版
        fn6: async function () {
            var module = {
                testGuid: "113c93d0-401e-11e9-909c-ab890e471017",
                // 获取模板或个人作品信息 
                // 获取模板或个人作品信息 UtilBarn.MMO.GetInfo(productid, success, error,change);
                // 获取模板信息 UtilBarn.MMO.GetTemplateInfo(productid,version, success, error);
                // 获取个人作品信息 UtilBarn.MMO.GetProductInfo(productid, success, error);
                TestMMOGetInfo: async function () {
                    await TestAsyncFunc("UtilBarn.MMO.GetInfo()", UtilBarn.MMO.GetInfo, module.testGuid);
                    TestFuncValid("UtilBarn.MMO.GetTemplateInfo", UtilBarn.MMO.GetTemplateInfo);
                    TestFuncValid("UtilBarn.MMO.GetProductInfo", UtilBarn.MMO.GetProductInfo);
                },

                // 验证作品是否重名 UtilBarn.MMO.IsNameDuplicate(productid,releaseMode,productname, type,success, error);
                TestIsNameDupliacate: async function () {
                    await TestAsyncFunc("UtilBarn.MMO.IsNameDuplicate", UtilBarn.MMO.IsNameDuplicate, module.testGuid, 1, "水果大师", 1);
                },

                // 敏感词判断  UtilBarn.MMO.IsSensitive(word, success, error);
                TestIsSensitive: async function () {
                    await TestAsyncFunc("UtilBarn.MMO.IsSensitive", UtilBarn.MMO.IsSensitive, "testword");
                },

                // 保存作品  
                // UtilBarn.MMO.SaveProduct
                // UtilBarn.MMO.CreateProduct
                // UtilBarn.MMO.UpdateProduct
                TestSavaProduct: function () {
                    TestFuncValid("UtilBarn.MMO.SaveProduct", UtilBarn.MMO.SaveProduct);
                    TestFuncValid("UtilBarn.MMO.CreateProduct", UtilBarn.MMO.CreateProduct);
                    TestFuncValid("UtilBarn.MMO.UpdateProduct", UtilBarn.MMO.UpdateProduct);
                },

                // 获取试玩信息 UtilBarn.MMO.GetTrialPlayInfo
                TestGetTrialPlayInfo: function () {
                    TestFuncValid("UtilBarn.MMO.GetTrialPlayInfo", UtilBarn.MMO.GetTrialPlayInfo);
                },

                // 获取试玩列表 UtilBarn.MMO.GetProductList
                TestGetProductList: function () {
                    TestFuncValid("UtilBarn.MMO.GetProductList", UtilBarn.MMO.GetProductList);
                },

                // 发布作品 UtilBarn.MMO.ReleaseProduct
                TestReleaseProduct: function () {
                    TestFuncValid("UtilBarn.MMO.ReleaseProduct", UtilBarn.MMO.ReleaseProduct);
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

        // UtilBarn NDR组件JS版
        fn7: async function () {
            var module = {
                testGUID: "c21eaa8a-2688-4558-a5fe-6e910e5cffbf",
                testGUID2: "c0881779-6750-49f4-96cd-0e1782b66ff0",
                testData: "testData",
                testBlog: "testBlob",
                // 请求资源
                // 请求资源 UtilBarn.NDR.Get
                // 基于Url后缀请求资源 UtilBarn.NDR.GetWithUrlFormats
                // 请求资源列表 UtilBarn.NDR.GetList
                TestGet: async function () {
                    await TestAsyncFunc("UtilBarn.NDR.Get", UtilBarn.NDR.Get, module.testGUID);
                    await TestAsyncFunc("UtilBarn.NDR.GetWithUrlFormats", UtilBarn.NDR.GetWithUrlFormats, module.testGUID2);
                    TestFuncValid("UtilBarn.NDR.GetList", UtilBarn.NDR.GetList);
                },
                // 获取File的文本类型数据 UtilBarn.NDR.GetFileData
                TestGetFileData: function () {
                    TestFuncValid("UtilBarn.NDR.GetFileData", UtilBarn.NDR.GetFileData);
                },
                // 上传资源 UtilBarn.NDR.Post
                TestPost: function () {
                    TestFuncValid("UtilBarn.NDR.Post", UtilBarn.NDR.Post);
                },
                // Base64转Blob数据 UtilBarn.NDR.Base64ToBlob
                TestB64ToBlob: function () {
                    TestFuncValid("UtilBarn.NDR.Base64ToBlob", UtilBarn.NDR.Base64ToBlob);
                },
                // Blob转Base64 UtilBarn.NDR.BlobToBase64
                TestBlobToB64: function () {
                    TestFuncValid("UtilBarn.NDR.BlobToBase64", UtilBarn.NDR.BlobToBase64);
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

        // UtilBarn 前端分类库组件JS版
        fn8: async function () {
            var module = {
                testID: "df489d22-b6e4-4140-8a79-f616c26c1991",
                // 参数配置 UtilBarn.FrontendLib.DimensionID
                TestDimensionID: function () {
                    UtilBarn.FrontendLib.DimensionID = module.testID;
                },
                // 查询前端分类树 UtilBarn.FrontendLib.GetSortTree(tag, success, error)
                TestGetSortTree: async function () {
                    await TestAsyncFunc("UtilBarn.FrontendLib.GetSortTree", UtilBarn.FrontendLib.GetSortTree, "");
                },
                // 获取分类下的资源列表 UtilBarn.FrontendLib.GetResources(tag,key,page,size, success, error); 
                TestGetResources: async function () {
                    await TestAsyncFunc("UtilBarn.FrontendLib.GetResources", UtilBarn.FrontendLib.GetResources, "", "", "", "");
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

        //UtilBarn消息组件
        fn9: async function () {
            var module = {
                Test: function () {
                    TestFuncValid("UtilBarn.Message.AddMessageHandler", UtilBarn.Message.AddMessageHandler);
                    TestFuncValid("UtilBarn.Message.Broadcast", UtilBarn.Message.Broadcast);
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