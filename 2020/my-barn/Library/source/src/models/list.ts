import {
    GetUploadAssetsInfo,
    GetNDRInfoByGuid,
    DeleteAssetsInfo,
    GetCollectAssetsInfo,
    CancelCollectAsset,
    GetTags,
    UploadPrivateAssetInfo,
    GetPrivateAssetInfo,
    TurnIntoMp3
} from "@/services";

import { datasFilter } from "@/utils/compat";
import { formatAudioDuration } from "@/utils/format";

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
    // cacheSet(key, val) {
    //     if (!window.localStorage) {
    //         return false;
    //     }
    //     window.localStorage.setItem(key, JSON.stringify(val));
    // }
    // cacheGet(key) {
    //     if (!window.localStorage) {
    //         return false;
    //     }
    //     return JSON.parse(window.localStorage.getItem(key));
    // }
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
        pic: {
            // 个人库
            list: new Storage(),
            // 收藏库
            collect: new Storage(),
            // 标签
            tagArr: new Storage()
        },
        audio: {
            // 个人库
            list: new Storage(),
            // 收藏库
            collect: new Storage(),
            // 标签
            tagArr: new Storage()
        },
        // 导航栏按钮
        headArr: [
            { title: "head_gather", id: "list" },
            { title: "head_collect", id: "collect" }
        ],
        // 默认显示 列表 或 收藏
        headChosed: 0,
        headInfo() {
            return this.headArr[this.headChosed];
        },

        // 导航栏选中id
        navId: [],
        // 关键词
        keyword: "",
        // 图片或音频
        typeArr: ["pic", "audio"],
        typeChosed: 0,
        listType() {
            return this.typeArr[this.typeChosed];
        },

        operateTypes: ["gallery", "collection"],
        showOperate: false,
        operateIndex: 0,
        operateStyleType: 0,
        operateType() {
            return this.operateTypes[this.operateIndex];
        },

        // 播放器显示
        showPlayer: false,
        // 切换歌曲
        tabAudio: false,
        playerObj: {
            rawTotal: 0,
            totalTime: "",
            title: "",
            location: ""
        },
        // 当前播放歌曲
        whichSong: "",
        audioDom: null,

        modalTypes: ["no_storage", "del_from_gallery"],
        modalIndex: 0,
        showModal: false,
        modalType() {
            return this.modalTypes[this.modalIndex];
        },

        msgTypes: [
            "cancel_collect",
            "no_chosed",
            "upload_success",
            "del_success",
            "not_yet",
            "del_fail",
            "cancel_collect_fail",
            "audio_already_turned",
            "err_source_repeat",
            "audio_not_support"
        ],
        msgIndex: 0,
        showMsg: false,
        // showOnce
        souce_repeat: true,
        msgType() {
            return this.msgTypes[this.msgIndex];
        },

        // 导航栏信息缓存
        tabBarInfoArr: [
            // pic
            {
                chosedId: "all",
                barPos: "translate3d(0,0,0)",
                blockPos: "translate3d(0,0,0)"
            },
            // audio
            {
                chosedId: "all",
                barPos: "translate3d(0,0,0)",
                blockPos: "translate3d(0,0,0)"
            }
        ],
        tabBarInfo() {
            return this.tabBarInfoArr[this.typeChosed];
        },

        // 事件
        deleteEvent: false,
        turnEvent: false,
        stopAudio: false,
        chooseAll: false,
        fromCom: "",
        // 控制空数据显示
        searching: false,
        // showAllNav: false,

        // 需要显示的数据(包括上传预览的)
        showItems: [],
        // 列表显示数据
        updateShowItems() {
            this.showItems = this.getPreviewArr().concat(this.listStorage().items);
        },

        // 上传预览图
        picPreviewArr: [],
        picUploadManager(file, randomKey, fname, uploadIndex, prePromiseGen) {
            return new Promise(res => {
                // 预览图采用base64预览
                const reader = new FileReader();
                const self = this;
                reader.readAsDataURL(file);
                reader.onload = function() {
                    const arr = self.picPreviewArr;
                    const itemObj = { title: fname, randomKey, location: reader.result, uploadIndex, status: "lineup" };
                    itemObj["promis"] = prePromiseGen(result => {
                        if (result.type === "image") {
                            const { id } = result;
                            if (id) {
                                itemObj.status = "success";
                                itemObj["id"] = id;
                            } else {
                                itemObj.status = "fail";
                            }
                        }
                    });
                    arr.unshift(itemObj);
                    res();
                };
            });
        },
        // 上传状态集中管理
        async solvePromis() {
            const targetArr = this.getPreviewArr();
            const uploadArr = [];
            for (let index in targetArr) {
                uploadArr[index] = targetArr[index];
            }
            for (let itemObj of uploadArr) {
                const { status, promis } = itemObj;
                if (status !== "success" && status !== "fail") {
                    itemObj.status = "loading";
                    const result = await promis();
                    // id都未拿到的情况
                    if (!result) {
                        // 资源重复的删除
                        if (window.navigator && window.navigator.onLine) {
                            itemObj.ifDelete = true;
                        }
                        itemObj.status = "fail";
                        continue;
                    }
                    if (result.type === "image") {
                        const { id } = result;
                        if (id) {
                            itemObj.status = "success";
                            itemObj["id"] = id;
                        } else {
                            itemObj.status = "fail";
                        }
                    }
                    if (result.type === "audio") {
                        const { location, ndr_id, id, duration, title } = result;
                        if (location) {
                            itemObj.status = "success";
                            itemObj["location"] = location;
                            itemObj["ndr_id"] = ndr_id;
                            itemObj["id"] = id;
                            itemObj["title"] = title;
                            itemObj["duration"] = duration;
                        } else {
                            itemObj.status = "fail";
                        }
                    }
                }
            }
            this.setItemsAllUploaded(true);
            uploadArr.length = 0;
            return;
        },
        // 当前正在上传
        picUploadIndex: 0,
        // 一共
        picUploadAll: 0,
        picsAllUploaded: true,
        clearPicPreviewArr() {
            this.picPreviewArr.length = 0;
        },

        // 上传预览音频
        audioPreviewArr: [],
        audioUploadManager(file, randomKey, fname, uploadIndex, prePromiseGen) {
            const itemObj = { title: fname, audioType: file.type, randomKey, uploadIndex, status: "lineup" };
            itemObj["promis"] = prePromiseGen(result => {
                if (result.type === "audio") {
                    const { location, ndr_id } = result;
                    if (location) {
                        itemObj.status = "success";
                        itemObj["location"] = location;
                        itemObj["ndr_id"] = ndr_id;
                    } else {
                        itemObj.status = "fail";
                    }
                }
            });
            this.audioPreviewArr.unshift(itemObj);
        },
        // 当前正在上传
        audioUploadIndex: 0,
        // 一共
        audioUploadAll: 0,
        audiosAllUploaded: true,
        clearAudioPreviewArr() {
            this.audioPreviewArr.length = 0;
        },

        setItemsAllUploaded(val) {
            if (this.typeChosed === 0) {
                this.picsAllUploaded = val;
            }
            if (this.typeChosed === 1) {
                this.audiosAllUploaded = val;
            }
        },
        itemsAllUploaded() {
            if (this.typeChosed === 0) {
                return this.picsAllUploaded;
            }
            if (this.typeChosed === 1) {
                return this.audiosAllUploaded;
            }
        },
        // 获取预览列表
        getPreviewArr() {
            if (this.listType() === "pic") {
                return this.picPreviewArr;
            }
            if (this.listType() === "audio") {
                return this.audioPreviewArr;
            }
        },
        // 重设预览列表
        setPreviewArr(newArr) {
            if (this.listType() === "pic") {
                this.picPreviewArr = newArr;
            }
            if (this.listType() === "audio") {
                this.audioPreviewArr = newArr;
            }
        },
        // 去掉上传成功和需要删除的
        splicePreviewArr() {
            const arr = this.getPreviewArr();
            if (arr.length === 0) return;
            for (let index = arr.length - 1; index >= 0; index--) {
                const { status, ifDelete } = arr[index];
                if (status === "success" || ifDelete) {
                    arr.splice(index, 1);
                }
            }
        },

        // 拿当前的个人库或收藏库数据
        listStorage() {
            return this[this.listType()][this.headInfo().id];
        },
        // 拿当前的标签数据仓库
        tagStorage() {
            return this[this.listType()].tagArr;
        },
        // 图片单页显示
        previewObj: {}
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
            return { ...states };
        },
        render(states, { payload }) {
            Object.assign(states, payload);
            console.log(`%c update ${JSON.stringify(payload, null, 3)},`, "color:red");
            return { ...states };
        }
    },
    effects: {
        *getListAll({ payload, mode, lib, refresh }, { put }) {
            const { result } = yield mode === "list" ? GetUploadAssetsInfo(payload) : GetCollectAssetsInfo(payload);
            const { items: datasTmp = [], total = 0 } = result || {};
            // ios不显示ogg格式音频，增加ui属性
            const datas = datasFilter("getListAll", lib, datasTmp);
            if (refresh) {
                yield put({ type: "renderAll", payload: { datas, total, mode, lib } });
            }
            return Promise.resolve(datas);
        },
        // 删除选中或取消收藏
        *delete({ payload, mode, lib }, { put }) {
            const { result } = yield mode === "list" ? DeleteAssetsInfo({ res_ids: payload }) : CancelCollectAsset({ ndr_ids: payload });
            return Promise.resolve(result && result.status == "200");
        },
        // 获取标签
        *getTags({ payload }) {
            const { result } = yield GetTags(payload);
            return Promise.resolve(result);
        },
        // 上传
        *upload({ payload }) {
            const { code, result } = yield UploadPrivateAssetInfo(payload);
            const { status = "", res_id: id, statusText } = result;
            console.log(JSON.stringify(result));
            console.log("%c upload result: " + status + " " + id + " " + statusText, "color:red");
            if (!id || code === "400") {
                return Promise.resolve(false);
            }
            const { category } = payload;
            if (category === "Image") {
                return Promise.resolve({ type: "image", id: status == "200" && id });
            }
            // 音频上传后继续取location
            if (category === "Audio") {
                const { code, result } = yield GetPrivateAssetInfo({ res_id: id });
                console.log("audio upload result", JSON.stringify(result, null, 3));
                const { location = "", ndr_id = "", title } = result;
                let duration = 0;
                if (ndr_id) {
                    const { result: objWithDuration } = yield GetNDRInfoByGuid(ndr_id);
                    duration = ((objWithDuration || {}).SourceInfo || {}).Duration;
                }
                return Promise.resolve({ type: "audio", location, ndr_id, id, duration, title });
            }
            return Promise.resolve(false);
        },
        // 根据guid拿信息
        *getInfoByGuid({ payload }) {
            const { code, result } = yield GetNDRInfoByGuid(payload);
            if (code === "200") {
                return Promise.resolve(result);
            }
            return Promise.resolve(false);
        },
        // 转码
        *turnMp3({ payload, statusEqualHandleCallback = () => {}, statusEqualFinishCallback = () => {} }) {
            yield TurnIntoMp3(payload, statusEqualHandleCallback, statusEqualFinishCallback);
        }
    }
} as any;
