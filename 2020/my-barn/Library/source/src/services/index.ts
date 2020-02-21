import { setType } from "@/utils/format";
const Edbox = window["Edbox"];
const promisify = (f, l = f.length) => (...args) =>
    new Promise(res => {
        try {
            if (l === 0) {
                res(Error("no callback"));
            }
            if (l === 1) {
                f.call(f, data => {
                    res(data);
                });
            }
            const argsAll = args.slice(args.length - 1);
            f.call(f, ...argsAll, data => {
                res(data);
            });
        } catch (error) {
            res(error);
        }
    });
// 针对 data,success,error的api
const promisify3 = f => data =>
    new Promise(res => {
        f.call(
            f,
            data,
            result => {
                res({ code: "200", result });
            },
            result => {
                res({ code: "400", result });
            }
        );
    });
// 针对 data,process,success,error的api
const promisify4 = f => data =>
    new Promise(res => {
        f.call(
            f,
            data,
            (...process) => {},
            result => {
                res({ code: "200", result });
            },
            result => {
                res({ code: "400", result });
            }
        );
    });

// 音频列表从ndr重获取,个人库音频接口错误(同时需要保留个人库音频列表接口的搜索功能)
const GetAudioListByGuids = (array, formats) =>
    new Promise(res => {
        Edbox.NDR.GetList(
            array,
            result => {
                res({ code: "200", result });
            },
            result => {
                res({ code: "400", result });
            },
            formats
        );
    });
// 从ndr根据guid拿信息
const GetNDRInfoByGuid = guid =>
    new Promise(res => {
        Edbox.NDR.Get(
            guid,
            result => {
                res({ code: "200", result });
            },
            result => {
                res({ code: "400", result });
            }
        );
    });
// 个人库相关
const promiseApi: any = Object.entries(Edbox.PrivateAsset).reduce((acc, [key, val]) => {
    if (key === "UploadPrivateAssetInfo") {
        acc[key] = promisify4(val);
        // 资源页和列表页都需要完善信息
    } else if (key === "GetUploadAssetsInfo" || key === "GetCollectAssetsInfo") {
        const fn: any = val;
        acc[key] = (param = {}) => {
            const step1 = new Promise(res => {
                fn.call(
                    fn,
                    param,
                    result => {
                        res({ code: "200", result });
                    },
                    result => {
                        res({ code: "400", result });
                    }
                );
            });
            if (param.category === "Image") {
                return step1;
            }
            if (param.category === "Audio") {
                return step1.then(async response => {
                    if (response["code"] === "400") {
                        return response;
                    }
                    const arrContainsGuids = response["result"].items;
                    const ndrRes: any = await GetAudioListByGuids(
                        arrContainsGuids.map(ele => ele.ndr_id || ""),
                        param.acceptTypeArr || []
                    );
                    const { code, result: objFromNDR } = ndrRes;
                    console.log("auidio setp1 result" + JSON.stringify(objFromNDR, null, 3));
                    const result = {
                        items: arrContainsGuids.map(ele => {
                            const srcObj = objFromNDR[ele.ndr_id];
                            // 修正title
                            ele.title = setType(ele.title, srcObj.Type);
                            // 修正地址
                            ele.location = srcObj.Url;
                            // 读取时长
                            ele.duration = (srcObj.SourceInfo || {}).Duration;
                            // 类型
                            ele.audioType = srcObj.Type;
                            return ele;
                        })
                    };
                    console.log("audio step2 result" + JSON.stringify(result, null, 3));
                    return { code, result };
                });
            }
            return () => Promise.resolve("no such kind library");
        };
    } else if (typeof val === "function") {
        acc[key] = promisify3(val);
    } else {
        acc[key] = val;
    }
    return acc;
}, {});

const {
    GetUploadAssetsInfo,
    GetMyCloudInfo,
    UploadPrivateAssetInfo,
    DeleteAssetsInfo,
    GetCollectAssetsInfo,
    CollectAsset,
    CancelCollectAsset,
    GetTags,
    AddAssetTags,
    GetPrivateAssetInfo
} = promiseApi;
// 音频转码
const promisTurnApis: any = Object.entries(Edbox.AudiohelpServer).reduce((acc, [key, val]) => {
    if (key === "AddListener") {
        acc[key] = val;
    } else if (key === "HandleSendTranAudio" || key === "Init") {
        acc[key] = promisify3(val);
    } else {
        acc[key] = null;
    }
    return acc;
}, {});
const { Init: turnInit, HandleSendTranAudio: turnStart, AddListener: turnListen } = promisTurnApis;
turnInit("");
const TurnIntoMp3 = async (guid, statusEqualHandleCallback, statusEqualFinishCallback) => {
    // 测试
    // guid = "4e8fe3bf-0dc7-493e-a526-d9c288209780";
    const { result: successGuid } = await turnStart(guid);
    console.log("转码successGuid为: " + successGuid);
    turnListen(successGuid, (statusObj = {}) => {
        if (statusEqualHandleCallback && statusObj.status === "handle") {
            statusEqualHandleCallback(statusObj);
        }
        // 服务端状态码书写忽略
        if (statusEqualFinishCallback && statusObj.status === "finsh") {
            statusEqualFinishCallback(statusObj);
        }
    });
};

export {
    promisify,
    // 拿资源列表
    GetUploadAssetsInfo,
    // 根据guid拿信息
    GetNDRInfoByGuid,
    // 硬盘空间
    GetMyCloudInfo,
    // 上传资源
    UploadPrivateAssetInfo,
    // 根据id获取location和ndr_id等
    GetPrivateAssetInfo,
    // 删除图库资源
    DeleteAssetsInfo,
    // 图库收藏列表
    GetCollectAssetsInfo,
    // 收藏一张图片
    CollectAsset,
    // 取消图片收藏
    CancelCollectAsset,
    // 获取标签集
    GetTags,
    // 打标签
    AddAssetTags,
    // 转码
    TurnIntoMp3
};
