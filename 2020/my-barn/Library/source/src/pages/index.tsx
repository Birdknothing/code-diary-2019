import React, { Component } from "react";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import Operate from "@/components/Operate";
import AudioPlayer from "@/components/AudioPlayer";
import Msg from "@/components/Msg";
import { connect } from "dva";

import styles from "./index.scss";
@connect(({ list }) => ({ list }))
class Main extends Component {
    props: any;
    // state = {
    //     picCacheIds: [],
    //     audioCacheIds: []
    // };
    updateState(newState: object, refresh = true) {
        const { list } = this.props;
        Object.assign(list, newState);
        refresh && this.setState({});
    }
    inCasePageReload() {
        const { router } = this.props;
        // 当前页刷新,默认图片库（收藏页刷新暂不做刷新保存)
        router.isMode("choose") && this.updateState({ showOperate: true }, false);
        router.isMode("audio") && this.updateState({ typeChosed: 1 }, false);
    }
    // 拿取更多
    async getMore(refresh = true) {
        console.log(`%c 'getmore `, "color:red");
        const { dispatch, list } = this.props;
        // 重置是否正在搜索
        list.searching && (list.searching = false);

        // 重置全选
        list.chooseAll = false;
        const listStorage = list.listStorage();
        if (listStorage.isAll) {
            return;
        }
        const { navId, keyword } = list;
        // 清空上传成功项和资源重复项
        list.splicePreviewArr();
        // 是否去拿标签
        const tagStorage = list.tagStorage();
        if (tagStorage.refetch) {
            await this.getTags();
        }
        const listType = list.listType();
        // const tagId = navId === "" ? "all" : navId.join("");
        // const cacheArr = this.state[listType + "CacheIds"];
        // if (refetch && cacheArr.includes(tagId)) {
        //     alert("use cache");
        //     listStorage.items = listStorage.cacheGet(listType + tagId);
        //     dispatch({ type: "list/render" });
        //     return;
        // }
        const headInfo = list.headInfo();
        const { id } = headInfo;
        const { page, size } = listStorage;
        const category = this.chooseParam("category");

        const payload =
            id === "list"
                ? {
                      category,
                      tags: navId,
                      word: keyword,
                      page,
                      size
                  }
                : {
                      category,
                      tech_key: "source",
                      word: keyword,
                      page,
                      size
                  };
        const datas = await dispatch({
            type: "list/getListAll",
            payload,
            lib: listType,
            mode: id,
            refresh
        });

        // 切换到过的标签不再重拿数据,放入缓存
        // if (!cacheArr.includes(tagId)) {
        //     cacheArr.push(tagId);
        //     listStorage.cacheSet(listType + tagId, datas);
        // }
    }
    chooseParam(prop) {
        const checkParam = {
            category: {
                pic: "Image",
                audio: "Audio"
            }
        };
        switch (prop) {
            case "category":
                return checkParam[prop][this.props.list.listType()] || "";

            default:
                return "";
        }
    }

    // 弹消息
    alertOnce(msgIndex, ctrlProp = "") {
        if (!this.props.list[ctrlProp] || !msgIndex) return;
        this.props.list[ctrlProp] = false;
        this.updateState({ showMsg: true, msgIndex });
    }
    // 拿tags列表
    async getTags() {
        const { dispatch, list } = this.props;
        // listType // pic 或 audio
        const tagStorage = list.tagStorage();
        // 标签无总数，拿一次就行
        tagStorage.refetch = false;
        const tagArrResult = await dispatch({
            type: "list/getTags",
            payload: { category: this.chooseParam("category") }
        });
        tagStorage.items = tagArrResult;
        return;
    }
    render() {
        console.log("main render");
        const {
            location: { pathname },
            getChildByRoute
        } = this.props;
        this.inCasePageReload();
        const Target = getChildByRoute(pathname);
        return (
            <div className={styles["basic"]}>
                <Header {...this.props} setState={this.updateState.bind(this)} getMore={this.getMore.bind(this)} />
                <Target
                    {...this.props}
                    setState={this.updateState.bind(this)}
                    getMore={this.getMore.bind(this)}
                    alertOnce={this.alertOnce.bind(this)}
                />
                <Modal {...this.props} setState={this.updateState.bind(this)} />
                <Operate {...this.props} getMore={this.getMore.bind(this)} setState={this.updateState.bind(this)} />
                <AudioPlayer {...this.props} setState={this.updateState.bind(this)} />
                <Msg {...this.props} setState={this.updateState.bind(this)} />
            </div>
        );
    }
}
export default Main;
