import React, { Component } from "react";
import SearchBar from "@/components/SearchBar";
import NavBar from "@/components/NavBar";
import { formatMsg } from "@/locales";
import StatusLoading from "@/components/Loading";
import styles from "./index.scss";
import { connect } from "dva";

import { getType } from "@/utils/format";

import { IconConfirm, PicNoData, AudioNoData } from "@/components/FontIcon";
import ImgStatus from "./PicStatus";
import AudioStatus from "./AudioStatus";
import router from "@/pages/router";
interface listState {
    bottomSense: number;
    throttleCount: number;
    throttleTime: number;
    loadingIsSlideUp: boolean;
    // PicListContainer: any;
    // AudioListContainer: any;
    // 上下滑
    hasSlide: boolean;
}
@connect(({ loading: { effects } }) => ({ loading: effects["list/getListAll"], upload_loading: effects["list/upload"] }))
class List extends Component {
    props: any;
    state: listState = {
        // 触底范围
        bottomSense: 30,
        throttleCount: 0,
        throttleTime: 20,
        // 列表容器dom引用
        // PicListContainer: null,
        // AudioListContainer: null,
        loadingIsSlideUp: false,
        // 上下滑
        hasSlide: false
    };
    componentDidMount() {
        const { getMore } = this.props;
        // 防止刷新页面
        getMore();
    }
    // 获取类型
    // getType(title = "") {
    //     title = title.toString();
    //     const arr = title.split(".");
    //     if (arr.length === 0) return "";
    //     return arr[arr.length - 1].slice(0, 3);
    // }
    // 转化选中音频
    turnChosed() {
        const { list } = this.props;
        list.turnEvent = false;
        const doWithChosed = (item, condition) => {
            const type = getType(item.audioType);
            // 非mp3可转换
            if (type && type !== "mp3") {
                item.turnStatus !== "onturning" && (item.turnStatus = "turning");
                return item.ndr_id;
            }
            // 有选中mp3
            if (type === "mp3") {
                condition.ifChosedMp3 = true;
            }
            condition.ifNull = false;
            return false;
        };

        this.getChosedDomsAndDatas(doWithChosed);
    }
    // 获取选中的doms和数据，可过滤出对应的参数
    getChosedDomsAndDatas(propFilter) {
        const { list, setState } = this.props;
        const listType = list.listType();
        // 音频用
        const condition = {
            ifNull: true,
            ifChosedMp3: false
        };

        // 空列表
        // if (!listContainer) {
        //     return [];
        // }
        // const inputDoms = listContainer.getElementsByClassName(styles["ctrlConfirm"]);
        const inputDoms = document.getElementsByClassName(styles[`${listType}LibList`])[0].getElementsByClassName(styles["ctrlConfirm"]);
        const uiIndexArrToHandle = [];
        // 获取请求参数
        const propsArrToHandle = list.showItems.reduce((acc, item, i) => {
            if (inputDoms[i] && inputDoms[i]["checked"]) {
                uiIndexArrToHandle.push(i);
                // 需要过滤出的参数数组
                const target = propFilter(item, condition);
                target && acc.push(target);
            }
            return acc;
        }, []);
        const { ifNull, ifChosedMp3 } = condition;
        console.log("propsArrToHandle.length", propsArrToHandle.length);

        // 没有选中,取消删除事件
        if (propsArrToHandle.length === 0) {
            // 默认1提示未选中事件
            setState({ showMsg: true, msgIndex: listType === "audio" && ifChosedMp3 && !ifNull ? 7 : 1 }, false);
            return [];
        }
        return [inputDoms, uiIndexArrToHandle, propsArrToHandle];
    }
    // 删除选中的或取消收藏
    async delChosed() {
        const { list, dispatch, setState } = this.props;

        // 取消删除事件
        list.deleteEvent = false;

        const headInfo = list.headInfo();
        const { id } = headInfo;
        const listType = list.listType();
        const listStorage = list.listStorage();
        const previewItems = list.getPreviewArr();
        let { items } = listStorage;

        const getIdOrNdrId = item => {
            // 删除和取消收,id为删除，ndr_id为取消收藏
            return id === "list" ? item.id : item.ndr_id;
        };
        const targetArr = this.getChosedDomsAndDatas(getIdOrNdrId);
        if (targetArr.length === 0) {
            return;
        }
        const [inputDoms, uiIndexArrToHandle, idsOrNdrIdsArrToDel] = targetArr;

        const success = await dispatch({
            type: "list/delete",
            payload: idsOrNdrIdsArrToDel,
            lib: listType,
            mode: id
        });

        // 删除
        if (success) {
            // 列表删除成功或取消收藏成功提示
            setState({ showMsg: true, msgIndex: id === "list" ? 3 : 0 }, false);
            const previewArrLength = previewItems.length;

            // 数据更新
            listStorage.items = items.filter((ele, i) => {
                if (!uiIndexArrToHandle.includes(i + previewArrLength)) {
                    return ele;
                }
            });
            list.setPreviewArr(
                previewItems.filter((ele, i) => {
                    if (!uiIndexArrToHandle.includes(i)) {
                        return ele;
                    }
                })
            );
            // react会复用dom元素
            [].forEach.call(inputDoms, (inputDom: any) => {
                inputDom && (inputDom["checked"] = false);
            });

        } else {
            // 列表删除失败提示
            setState({ showMsg: true, msgIndex: id === "list" ? 5 : 6 }, false);
        }
        setState({});
        return success;
    }
    // 触底加载更多
    async scrollToBottom() {
        // this.state.loadingIsSlideUp = true;
        console.log("bottom");
        this.setState({ loadingIsSlideUp: true });
        const { getMore } = this.props;
        await getMore();
        this.setState({ loadingIsSlideUp: false });
    }
    // 点击一项
    touchAnItem(e, type, lib, item, cb = () => {}) {
        const { router } = this.props;
        // 多选模式禁用
        if (router.isMode("choose") || (item.status && item.status !== "success")) {
            return;
        }
        if (type === "start") {
            this.state.hasSlide = false;
        }
        if (type === "end") {
            // 图片预览
            if (!this.state.hasSlide && lib === "pic") {
                const { router, setState } = this.props;
                const imgDom = e.currentTarget.getElementsByClassName(styles["ctrlConfirm"]);
                imgDom && (imgDom[0]["checked"] = true);
                setState({ previewObj: item, showOperate: true }, false);
                router.tabMode("preview");
            }
            //音频播放
            if (!this.state.hasSlide && typeof cb === "function" && lib === "audio") {
                cb();
            }
        }
        if (type === "move") {
            this.state.hasSlide = true;
        }
    }

    // 上传项是否在多选模式可见,important
    ctrlShow(item, normalStyle) {
        const ifChoose = this.props.router.isMode("choose");
        if (ifChoose && item.status && item.status !== "turning" && item.status !== "success") {
            return "none";
        }
        return normalStyle;
    }
    render() {
        const { router, list, loading, setState, getMore, alertOnce } = this.props;
        const { deleteEvent, turnEvent, showPlayer, navId, operateIndex, searching, chooseAll, fromCom } = list;
        const { loadingIsSlideUp, throttleTime } = this.state;
        const listStorage = list.listStorage();
        const listType = list.listType();
        const operateType = list.operateType();
        console.log(list.getPreviewArr());
        console.log(listStorage.items);

        // 合并上传预览列表
        // 标签为所有可以上传，仅为所有且不是收藏页显示上传预览项
        let items = (navId === "" || navId.length === 0) && operateIndex === 0 ? list.getPreviewArr().concat(listStorage.items) : listStorage.items;

        list.showItems = items;
        
        // 导航栏用
        const isChoose = router.isMode("choose");
        // 删除事件
        if (deleteEvent) {
            this.delChosed();
        }
        // 转码事件
        if (turnEvent) {
            this.turnChosed();
        }
        if (fromCom === "header") {
            items.forEach(item => (item._isChosed = chooseAll));
        }
        console.log(items);
        
        // 清除事件源
        list.fromCom = "";
        // 无数据
        const noDataMsg = !searching ? `${listType}_${operateType}_no_data_hint` : "no_search_result";
        return (
            <div className={styles["list"]}>
                {isChoose ? <div className={styles["replaceSearch"]}></div> : <SearchBar {...this.props} getMore={getMore} storage={listStorage} />}
                <NavBar {...this.props} setState={setState} getMore={getMore} />
                {/* 图片库 */}
                {listType === "pic" && (
                    <div
                        className={styles["listContainer"]}
                        onScroll={e => {
                            if (this.state.throttleCount === 1) {
                                return;
                            }
                            // const scrollDom = e.currentTarget;
                            const { scrollHeight, clientHeight, scrollTop } = e.currentTarget;
                            scrollTop >= scrollHeight - clientHeight - this.state.bottomSense && this.scrollToBottom();
                            this.state.throttleCount = 1;
                            const self = this;
                            const timeTok = setTimeout(() => {
                                self.state.throttleCount = 0;
                                window.clearTimeout(timeTok);
                            }, throttleTime);
                        }}
                        onTouchStart={e => {
                            e.stopPropagation();
                        }}
                    >
                        {/* 列表loading */}
                        {!loadingIsSlideUp && loading ? (
                            <StatusLoading />
                        ) : items.length > 0 ? (
                            <div className={styles["picLibList"]}>
                                {items.map((pic, i) => (
                                    <div
                                        className={styles["picBox"]}
                                        key={pic.randomKey || pic.id || "pic" + i}
                                        onTouchStart={e => this.touchAnItem(e, "start", "pic", pic)}
                                        onTouchMove={e => this.touchAnItem(e, "move", "pic", pic)}
                                        onTouchEnd={e => this.touchAnItem(e, "end", "pic", pic)}
                                        style={{ display: this.ctrlShow(pic, "inline-block") }}
                                    >
                                        <div className={styles["imgBox"]} style={{ backgroundImage: `url(${pic.location})` }}>
                                            {/* <img src={pic.location} alt="" /> */}
                                        </div>
                                        <ImgStatus statusObj={pic} list={list} setState={setState} alertOnce={alertOnce} />
                                        <input type="checkbox" className={styles["ctrlConfirm"]} checked={pic._isChosed} />
                                        <div
                                            className={styles["chose"]}
                                            style={{ display: isChoose ? "block" : "none" }}
                                            onTouchStart={e => {
                                                const ifChecked = e.currentTarget.previousElementSibling["checked"];
                                                e.currentTarget.previousElementSibling["checked"] = !ifChecked;
                                                // 状态暂存
                                                pic._isChosed = !ifChecked;
                                            }}
                                        >
                                            <img src={IconConfirm} alt="" />
                                        </div>
                                    </div>
                                ))}
                                {/* 加载loading */}
                                {loadingIsSlideUp && <StatusLoading slideUp scale={0.5} />}
                                {router.isMode("choose") && <div className={styles["operateReplace"]}></div>}
                            </div>
                        ) : (
                            <div className={styles["nodata"]}>
                                <img src={PicNoData} alt="" />
                                <div className={styles["txt"]}>{formatMsg(noDataMsg)}</div>
                            </div>
                        )}
                    </div>
                )}
                {/* 音频库 */}
                {listType === "audio" && (
                    <div
                        className={styles["listContainer"]}
                        onScroll={e => {
                            if (this.state.throttleCount === 1) {
                                return;
                            }
                            // const scrollDom = e.currentTarget;
                            const { scrollHeight, clientHeight, scrollTop } = e.currentTarget;
                            scrollTop >= scrollHeight - clientHeight - this.state.bottomSense && this.scrollToBottom();
                            this.state.throttleCount = 1;
                            const timeTok = setTimeout(() => {
                                this.state.throttleCount = 0;
                                window.clearTimeout(timeTok);
                            }, throttleTime);
                        }}
                        onTouchStart={e => {
                            e.stopPropagation();
                        }}
                    >
                        {/* 音频列表loading */}
                        {!loadingIsSlideUp && loading ? (
                            <StatusLoading />
                        ) : items.length > 0 ? (
                            <div className={styles["audioLibList"]}>
                                {items.map((audio, i) => (
                                    <div className={styles["audioBoxContainer"]} key={audio.randomKey || audio. ndr_id || audio.create_time || "audio" + i}>
                                        <input type="radio" className={styles["audio_ctrl_single"]} defaultChecked={false} name="ctrlAudio" />
                                        <input type="checkbox" className={styles["ctrlConfirm"]} checked={audio._isChosed} />
                                        <AudioStatus
                                            {...this.props}
                                            statusObj={audio}
                                            ctrlShow={this.ctrlShow.bind(this)}
                                            whichSong={audio.randomKey || audio.ndr_id || audio.create_time }
                                            setState={setState}
                                            delChosed={this.delChosed.bind(this)}
                                            touchAnItem={this.touchAnItem.bind(this)}
                                        />
                                    </div>
                                ))}
                                {/* 加载loading */}
                                {loadingIsSlideUp && <StatusLoading slideUp scale={0.5} />}
                                {router.isMode("choose") && <div className={styles["operateReplace"]}></div>}
                                {showPlayer && <div className={styles["playerReplace"]}></div>}
                            </div>
                        ) : (
                            <div className={styles["nodata"]}>
                                <img src={AudioNoData} alt="" />
                                <div className={styles["txt"]}>
                                    {formatMsg(noDataMsg)}
                                    {/* Sorry,No search results,you can try.
                                <br />
                                1.check spelling or change keywords
                                <br />
                                2.Switching Search Range */}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

// Header.PropsTypes = {
// }

export default List;
