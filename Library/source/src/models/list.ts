import { GetUploadAssetsInfo, DeleteAssetsInfo, GetCollectAssetsInfo, CancelCollectAsset, GetTags, UploadPrivateAssetInfo } from "@/services";
import { testLog } from "@/components/Test";
import { plainObj } from "@/utils";

class Storage {
    refetch: boolean;
    page: number;
    size: number;
    total: number;
    isAll: boolean;
    items: any[];
    constructor(config?: object) {
        this.reset();
        Object.assign(this, config);
    }
    reset() {
        this.refetch = true;
        this.page = 1;
        this.size = 15;
        this.total = 0;
        this.items = [];
        this.isAll = false;
    }
}
export default {
    namespace: "list",
    state: {
        resetState(listType, id, newProp) {
            if (typeof newProp === "function") {
                this[listType][id][newProp]();
                return;
            }
            Object.assign(this[listType][id], newProp);
        },
        pic: {
            // 个人库
            list: new Storage(),
            // list: {
            //     // 重拿数据
            //     refetch: true,
            //     items: [],
            //     page: 1,
            //     size: 15,
            //     total: 0,
            //     isAll: false,
            //     reset() {
            //         this.refetch = true;
            //         this.page = 1;
            //         this.size = 15;
            //         this.total = 0;
            //         this.isAll = false;
            //     }
            // },
            // 收藏库
            collect: new Storage(),
            // 标签
            tagArr: new Storage()
        }
    },
    // [{id:0,name:'what',type:'0'}]
    // {
    //     id: 388,
    //     ndr_id: "74b24219-cf6f-4a50-b248-aeec95ddb680",
    //     url: "http://cdncs.101.com/v0.1/static/edu/esp/assets/74b24219-cf6f-4a50-b248-aeec95ddb680.pkg/bg.jpg",
    //     title: "bg.jpg",
    //     size: 54043,
    //     custom_properties: "",
    //     tags: [],
    //     upload_status: 1,
    //     create_time: "2019-12-10T04:58:25.000Z",
    //     update_time: "2019-12-10T04:58:26.000Z"
    // },
    reducers: {
        renderAll(states, { payload }) {
            const { datas, total, mode, lib } = payload;
            const state = states[lib][mode];
            const { items, page, size } = state;

            items.splice(items.length, 0, ...datas);
            state.total = total;
            state.isAll = page * size >= total;
            state.page += 1;
            // dva自动比较新旧state引用来决定是否render
            // const newState = { [mode]: state };
            // return { ...states, ...newState };
            return { ...states };
        }
    },
    effects: {
        *getListAll({ payload, mode, lib, refresh }, { put }) {
            const result = yield mode === "list" ? GetUploadAssetsInfo(payload) : GetCollectAssetsInfo(payload);
            const { items: datas = [], total = 0 } = result || {};
            console.log(`%c datas ${JSON.stringify(payload, null, 3)}`, "color:red");
            if (refresh) {
                yield put({ type: "renderAll", payload: { datas, total, mode, lib } });
            }
            console.log(`%c datas ${JSON.stringify(result, null, 3)}`, "color:green");
            return Promise.resolve("ok");
        },
        // 删除选中或取消收藏
        *delete({ payload, mode, lib }, { put }) {
            const result = yield mode === "list" ? DeleteAssetsInfo({ res_ids: payload }) : CancelCollectAsset({ ndr_ids: payload });
            testLog("delete " + mode + plainObj(result));
            return result && result.status == "200";
        },
        // 获取标签
        *getTags({ payload, lib }, { put }) {
            const result = yield GetTags(payload);
            testLog("getTag result" + lib + plainObj(result));
            return Promise.resolve(result);
        },
        // 上传图片
        *upload({ payload }) {
            const result = yield UploadPrivateAssetInfo(payload);
            testLog("upload result" + plainObj(result));
            return Promise.resolve((result || {}).status == "200");
        }
    }
} as any;
