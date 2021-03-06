let datas = {
    Datas: [
        {
            ID: "Datas_BaseInfo",
            Name: "BaseInfo",
            ShowName: "基础信息设置",
            Type: "Tab01",
            PageType: "FullPage",
            Datas: [
                {
                    ID: "Datas_BaseInfo_GameName",
                    Name: "GameName",
                    ShowName: "游戏名称",
                    Value: "test-save-save-2",
                    Type: "Text01",
                    ParantID: "Datas_BaseInfo",
                    ParantIndex: 0,
                    ErrorText: ""
                },
                {
                    ID: "Datas_BaseInfo_Description",
                    Name: "Description",
                    ShowName: "游戏简介",
                    Value: "121212",
                    Type: "Text02",
                    ParantID: "Datas_BaseInfo",
                    ParantIndex: 1
                },
                {
                    ID: "Datas_BaseInfo_multi",
                    Name: "Tips",
                    ShowName: "多文本输入",
                    Type: "Text03",
                    Value: ["aaaaa", "bbbbb"],
                    Length: 60,
                    StyleEdit: true,
                    Style: {
                        fontFamily: { id: 0, name: "A Galega" },
                        fontSize: { size: 32, startNum: 8, endNum: 72 },
                        fontColor: "#FFFFFF",
                        fontStyle: { bold: false, italic: false, underline: false }
                    },
                    ParantID: "Datas_BaseInfo",
                    ParantIndex: 2
                },
                {
                    ID: "Datas_BaseInfo_CoverImage",
                    Name: "CoverImage",
                    ShowName: "封面图片",
                    Value:
                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/20aa6e40-faad-47d8-81ed-eb9c11ad92db.pkg/source/cover.png",
                    GUID: "20aa6e40-faad-47d8-81ed-eb9c11ad92db",
                    Type: "Image01",
                    ParantID: "Datas_BaseInfo",
                    ParantIndex: 3,
                    ResourceName: "cover"
                }
            ]
        },
        {
            ID: "Datas_Login",
            Name: "Login",
            ShowName: "登录选择页面",
            Type: "Tab01",
            Class: "Login",
            Resetable: true,
            Datas: [
                {
                    ID: "Datas_Login_LoginMode",
                    Name: "LoginMode",
                    ShowName: "登录方式",
                    Type: "Tab02",
                    Datas: [
                        {
                            ID: "Datas_Login_LoginMode_Modes",
                            Name: "Modes",
                            ShowName: "登录方式选择",
                            Type: "Select04",
                            Value: [
                                {
                                    Name: "Facebook",
                                    ShowName: "Facebook",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/5adfe358-bbc4-4c1c-9efa-0dfd5566c853.pkg/login-fb_7294689b-2919-40ef-a24a-f03c8849b2ef.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Google",
                                    ShowName: "谷歌",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/c3969d81-096d-4e1e-9cb4-1b302baf5cf7.pkg/login-gg_55107a14-146e-402a-ac29-8b8cfaa2e1eb.png",
                                    ImageGUID: ""
                                }
                            ],
                            Key: ["Facebook", "Google"],
                            Items: [
                                {
                                    Name: "Edbox",
                                    ShowName: "Edbox",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/17af7aba-e04c-45c2-8831-cb3dfb8825bc.pkg/login-101_d6f998d3-ac16-40e5-a083-d1b006a501fd.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "99U",
                                    ShowName: "99U",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/6dec0d1a-2c7e-4d55-934b-ddb905f2e939.pkg/login-nd_f44b6896-688b-4968-835b-44ff85059a1a.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Edmodo",
                                    ShowName: "Edmodo",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/56420437-5705-43ef-9b15-3830f65ec578.pkg/login-edmd_f00ac392-e621-49f8-9466-20ebc02c3dfa.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Facebook",
                                    ShowName: "Facebook",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/5adfe358-bbc4-4c1c-9efa-0dfd5566c853.pkg/login-fb_7294689b-2919-40ef-a24a-f03c8849b2ef.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Weixin",
                                    ShowName: "微信",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/22407dc8-0738-4dea-b298-fba0ae5fd4da.pkg/login-wx_b7a69ebe-ef90-4222-8fa6-1a60f54b71a5.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Google",
                                    ShowName: "谷歌",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/c3969d81-096d-4e1e-9cb4-1b302baf5cf7.pkg/login-gg_55107a14-146e-402a-ac29-8b8cfaa2e1eb.png",
                                    ImageGUID: ""
                                }
                            ],
                            Keys: ["Facebook", "99U", "Edbox", "Edmodo", "Weixin", "Google"],
                            IsRequired: true,
                            ReadOnly: false,
                            ParantID: "Datas_Login_LoginMode",
                            ParantIndex: 0
                        }
                    ]
                },
                {
                    ID: "Datas_Login_Layout",
                    Name: "Layout",
                    ShowName: "界面设置",
                    Type: "Tab02",
                    Datas: [
                        {
                            ID: "Datas_Login_Layout_Background",
                            Name: "Background",
                            ShowName: "背景图",
                            Type: "Image01",
                            Value: "",
                            ParantID: "Datas_Login_Layout",
                            ParantIndex: 0,
                            GUID: ""
                        },
                        {
                            ID: "Datas_Login_Layout_WindowBackground",
                            Name: "WindowBackground",
                            ShowName: "窗口背景图",
                            Type: "Image01",
                            Value:
                                "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/68b43ed1-e02b-4b3e-b278-5020fc14a965.pkg/login-bg_cbec69dc-af44-4bb9-86ad-9d649f473a40.jpg",
                            ParantID: "Datas_Login_Layout",
                            ParantIndex: 1,
                            GUID: "",
                            ResourceName: "login-bg_cbec69dc-af44-4bb9-86ad-9d649f473a40"
                        },
                        {
                            ID: "Datas_Login_Layout_LeadingWords",
                            Name: "LeadingWords",
                            ShowName: "引导语",
                            Type: "Text01",
                            Value: "嗨，选个方式登录吧~",
                            ReadOnly: false,
                            StyleEdit: true,
                            Style: {
                                fontFamily: { id: 0, name: "A Galega" },
                                fontSize: { size: 18, startNum: 8, endNum: 72 },
                                fontColor: "#000",
                                fontStyle: { bold: true, italic: false, underline: false },
                                align: "center"
                            },
                            Property: { FontFamily: false, Align: true },
                            ParantID: "Datas_Login_Layout",
                            ParantIndex: 2
                        },
                        {
                            ID: "Datas_Login_Layout_LeadingIcon",
                            Name: "LeadingIcon",
                            ShowName: "引导图标",
                            Type: "Image01",
                            Value:
                                "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/9474ce38-d956-437c-8baa-acf860fd4533.pkg/login-arrow_affd55c7-9169-43af-a08f-c3af088f0c16.png",
                            ParantID: "Datas_Login_Layout",
                            ParantIndex: 3,
                            GUID: "",
                            ResourceName: "login-arrow_affd55c7-9169-43af-a08f-c3af088f0c16"
                        }
                    ]
                }
            ]
        }
    ],
    GlobalConfig: {
        ID: "GlobalConfig",
        Name: "GlobalConfig",
        ShowName: "全局配置",
        Type: "GlobalConfig",
        Width: 1080,
        Height: 720
    },
    StaticData: {
        ID: "StaticData",
        Name: "StaticData",
        Type: "StaticData",
        ShowName: "静态数据",
        Datas: [],
        Login: {
            ID: "Datas_Login",
            Name: "Login",
            ShowName: "登录选择页面",
            Type: "Tab01",
            Class: "Login",
            Resetable: false,
            Datas: [
                {
                    ID: "Datas_Login_LoginMode",
                    Name: "LoginMode",
                    ShowName: "登录方式",
                    Type: "Tab02",
                    Datas: [
                        {
                            ID: "Datas_Login_LoginMode_Modes",
                            Name: "Modes",
                            ShowName: "登录方式选择",
                            Type: "Select04",
                            Value: [
                                {
                                    Name: "Edbox",
                                    ShowName: "Edbox",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/17af7aba-e04c-45c2-8831-cb3dfb8825bc.pkg/login-101_d6f998d3-ac16-40e5-a083-d1b006a501fd.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "99U",
                                    ShowName: "99U",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/6dec0d1a-2c7e-4d55-934b-ddb905f2e939.pkg/login-nd_f44b6896-688b-4968-835b-44ff85059a1a.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Edmodo",
                                    ShowName: "Edmodo",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/56420437-5705-43ef-9b15-3830f65ec578.pkg/login-edmd_f00ac392-e621-49f8-9466-20ebc02c3dfa.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Facebook",
                                    ShowName: "Facebook",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/5adfe358-bbc4-4c1c-9efa-0dfd5566c853.pkg/login-fb_7294689b-2919-40ef-a24a-f03c8849b2ef.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Weixin",
                                    ShowName: "微信",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/22407dc8-0738-4dea-b298-fba0ae5fd4da.pkg/login-wx_b7a69ebe-ef90-4222-8fa6-1a60f54b71a5.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Google",
                                    ShowName: "谷歌",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/c3969d81-096d-4e1e-9cb4-1b302baf5cf7.pkg/login-gg_55107a14-146e-402a-ac29-8b8cfaa2e1eb.png",
                                    ImageGUID: ""
                                }
                            ],
                            Key: ["Edbox", "99U", "Edmodo", "Facebook", "Weixin", "Google"],
                            Items: [
                                {
                                    Name: "Edbox",
                                    ShowName: "Edbox",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/17af7aba-e04c-45c2-8831-cb3dfb8825bc.pkg/login-101_d6f998d3-ac16-40e5-a083-d1b006a501fd.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "99U",
                                    ShowName: "99U",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/6dec0d1a-2c7e-4d55-934b-ddb905f2e939.pkg/login-nd_f44b6896-688b-4968-835b-44ff85059a1a.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Edmodo",
                                    ShowName: "Edmodo",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/56420437-5705-43ef-9b15-3830f65ec578.pkg/login-edmd_f00ac392-e621-49f8-9466-20ebc02c3dfa.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Facebook",
                                    ShowName: "Facebook",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/5adfe358-bbc4-4c1c-9efa-0dfd5566c853.pkg/login-fb_7294689b-2919-40ef-a24a-f03c8849b2ef.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Weixin",
                                    ShowName: "微信",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/22407dc8-0738-4dea-b298-fba0ae5fd4da.pkg/login-wx_b7a69ebe-ef90-4222-8fa6-1a60f54b71a5.png",
                                    ImageGUID: ""
                                },
                                {
                                    Name: "Google",
                                    ShowName: "谷歌",
                                    Image:
                                        "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/c3969d81-096d-4e1e-9cb4-1b302baf5cf7.pkg/login-gg_55107a14-146e-402a-ac29-8b8cfaa2e1eb.png",
                                    ImageGUID: ""
                                }
                            ],
                            Keys: ["Edbox", "99U", "Edmodo", "Facebook", "Weixin", "Google"],
                            IsRequired: true,
                            ReadOnly: false
                        }
                    ]
                },
                {
                    ID: "Datas_Login_Layout",
                    Name: "Layout",
                    ShowName: "界面设置",
                    Type: "Tab02",
                    Datas: [
                        {
                            ID: "Datas_Login_Layout_Background",
                            Name: "Background",
                            ShowName: "背景图",
                            Type: "Image01",
                            Value: ""
                        },
                        {
                            ID: "Datas_Login_Layout_WindowBackground",
                            Name: "WindowBackground",
                            ShowName: "窗口背景图",
                            Type: "Image01",
                            Value:
                                "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/68b43ed1-e02b-4b3e-b278-5020fc14a965.pkg/login-bg_cbec69dc-af44-4bb9-86ad-9d649f473a40.jpg"
                        },
                        {
                            ID: "Datas_Login_Layout_LeadingWords",
                            Name: "LeadingWords",
                            ShowName: "引导语",
                            Type: "Text01",
                            Value: "嗨，选个方式登录吧~",
                            ReadOnly: false,
                            StyleEdit: true,
                            Style: {
                                fontFamily: { id: 0, name: "A Galega" },
                                fontSize: { size: 18, startNum: 8, endNum: 72 },
                                fontColor: "#000",
                                fontStyle: { bold: true, italic: false, underline: false },
                                align: "center"
                            },
                            Property: { FontFamily: false, Align: true }
                        },
                        {
                            ID: "Datas_Login_Layout_LeadingIcon",
                            Name: "LeadingIcon",
                            ShowName: "引导图标",
                            Type: "Image01",
                            Value:
                                "http://cdncs.101.com/v0.1/static/edu/App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/assets/9474ce38-d956-437c-8baa-acf860fd4533.pkg/login-arrow_affd55c7-9169-43af-a08f-c3af088f0c16.png"
                        }
                    ]
                }
            ]
        }
    }
};
