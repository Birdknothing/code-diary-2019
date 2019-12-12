import { logGreen, logRed, logBlue, plainObj } from "@/utils";
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
            logRed(f.name + " error:");
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
                logRed(f.name + " success");
                // logGreen(JSON.stringify(result, null, 3));
                res(result);
            },
            error => {
                logRed(f.name + " error");
                res(error);
            }
        );
    });
// 针对 data,process,success,error的api
const promisify4 = f => data =>
    new Promise(res => {
        f.call(
            f,
            data,
            (...process) => {
                logRed(f.name + " process");
                logRed(plainObj(process));
            },
            result => {
                logRed(f.name + " success");
                res(result);
            },
            error => {
                logRed(f.name + " error");
                res(error);
            }
        );
    });

const promiseApi: any = Object.entries(Edbox.PrivateAsset).reduce((acc, [key, val]) => {
    if (key === "UploadPrivateAssetInfo") {
        acc[key] = promisify4(val);
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
    AddAssetTags
} = promiseApi;

// 测试用
// 测试dev环境
window["Edbox"].ServerKey = "Dev";
(async () => {
    await promisify(Edbox.Start)();
})();
export {
    // 拿资源列表
    GetUploadAssetsInfo,
    // 硬盘空间
    GetMyCloudInfo,
    // 上传资源
    UploadPrivateAssetInfo,
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
    AddAssetTags
};
