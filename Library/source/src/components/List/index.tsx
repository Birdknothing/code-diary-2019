import React, { Component, Fragment } from "react";
import SearchBar from "@/components/SearchBar";
import NavBar from "@/components/NavBar";
import NullPic from "@/assets/404.png";
import { formatMsg } from "@/locales";
import StatusLoading from "@/components/Loading";
import styles from "./index.scss";
import { connect } from "dva";

import { testLog, clearLog } from "@/components/Test";

import { IconConfirm } from "@/components/FontIcon";
import { plainObj } from "@/utils";

interface listState {
    listContainer: any;
    bottomSense: number;
}

@connect(({ list, loading: { effects } }) => ({ list, loading: effects["list/getListAll"] }))
class List extends Component {
    props: any;
    state: listState = {
        // 触底范围
        bottomSense: 10,
        // 列表容器dom引用
        listContainer: {}
    };
    // componentDidMount() {
    //     const { router, delChosed, list, loading, headInfo, listType, showOperate, setState, resetState, tabTag } = this.props;
    //     const { id } = headInfo;
    //     const { items, chosedArr, refetch } = list[listType][id];
    //     // 首次渲染请求
    //     if (refetch) {
    //         this.getMore();
    //         list[listType][id].refetch = false;
    //     }
    // }
    // 拿tags列表
    async getTags() {
        const {
            dispatch,
            list,
            listType // pic 或 audio
        } = this.props;
        const tagArrResult = await dispatch({
            type: "list/getTags",
            payload: { category: listType === "pic" ? "Image" : "Audio" }
        });
        list[listType].tagArr.items = tagArrResult;
        return;
    }
    // 拿取更多
    async getMore(refresh = true) {
        console.log(`%c 'getmore `, "color:red");
        const {
            dispatch,
            list,
            navId,
            keyword,
            listType, // pic 或 audio
            headInfo: { id } // 'list' 或 'collect'
        } = this.props;
        const { page, size, isAll, refetch } = list[listType][id];
        if (list[listType].tagArr.refetch) {
            await this.getTags();
        }
        const category = listType === "pic" ? "Image" : "Audio";
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
        if (!isAll) {
            return await dispatch({
                type: "list/getListAll",
                payload,
                lib: listType,
                mode: id,
                refresh
            });
        }
        return;
    }
    // 删除选中的或取消收藏
    async delChosed() {
        const { listContainer } = this.state;
        const {
            dispatch,
            list,
            listType,
            headInfo: { id },
            setState
        } = this.props;
        let { items } = list[listType][id];

        const inputDoms = listContainer.getElementsByClassName(styles["ctrlConfirm"]);
        const indexToDelArr = [];
        const idsOrNdrIdsArrToDel = items.reduce((acc, item, i) => {
            if (inputDoms[i] && inputDoms[i].checked) {
                indexToDelArr.push(i);
                acc.push(id === "list" ? item.id : item.ndr_id);
            }
            return acc;
        }, []);
        // 没有选中,取消删除事件
        if (idsOrNdrIdsArrToDel.length === 0) {
            setState({ showMsg: true, msgIndex: 1 });
            this.props.state.delChosed = false;
            return;
        }
        const success = await dispatch({
            type: "list/delete",
            payload: idsOrNdrIdsArrToDel,
            lib: listType,
            mode: id
        });
        // ui删除
        if (success) {
            if (id === "collect") {
                // 取消收藏成功提示
                setState({ showMsg: true, msgIndex: 0 });
            }
            // 删除成功，取消删除事件
            this.props.state.delChosed = false;
            console.log(items.length);

            list[listType][id].items = items.filter((ele, i) => {
                if (!indexToDelArr.includes(i)) {
                    return ele;
                }
            });
            setState({});
        }
    }
    // 触底加载更多
    scrollToBottom() {
        this.getMore();
    }
    render() {
        console.log("list render");
        const { router, delChosed, list, loading, headInfo, listType, showOperate, setState, resetState } = this.props;
        const { id } = headInfo;
        const storage = list[listType][id];

        // 列表栏用
        const { items, chosedArr, refetch } = storage;
        // 导航栏用
        const { items: tagArr } = list[listType].tagArr;
        const isChoose = router.isMode("choose");

        // 列表渲染
        if (refetch) {
            this.getMore();
            list[listType][id].refetch = false;
        }
        // 删除事件
        if (delChosed) {
            this.delChosed();
        }
        // test
        // const items: any = Array.from({ length: 20 }).fill({ url: "" });
        return (
            <div className={styles["list"]}>
                {isChoose ? (
                    <div className={styles["replaceSearch"]}></div>
                ) : (
                    <SearchBar getMore={this.getMore.bind(this)} setState={setState} storage={storage} />
                )}
                <NavBar tagsArr={tagArr} setState={setState} getMore={this.getMore.bind(this)} storage={storage} />
                {/* 图片库 */}
                <div
                    className={styles["listContainer"]}
                    onScroll={e => {
                        // const scrollDom = e.currentTarget;
                        const { scrollHeight, clientHeight, scrollTop } = e.currentTarget;
                        scrollTop >= scrollHeight - clientHeight - this.state.bottomSense && this.scrollToBottom();
                    }}
                    onTouchStart={e => {
                        e.stopPropagation();
                    }}
                >
                    {loading && refetch ? (
                        <StatusLoading />
                    ) : items.length > 0 ? (
                        <div className={styles["picLibList"]} ref={el => (this.state.listContainer = el)}>
                            {items.map((pic, i) => (
                                <div className={styles["picBox"]} key={"pic" + i}>
                                    <img src={ pic.location} alt="" />
                                    <input type="checkbox" className={styles["ctrlConfirm"]} defaultChecked={false} />
                                    <div
                                        className={styles["chose"]}
                                        style={{ display: isChoose ? "block" : "none" }}
                                        onClick={e => {
                                            const ifChecked = e.currentTarget.previousElementSibling["checked"];
                                            e.currentTarget.previousElementSibling["checked"] = !ifChecked;
                                        }}
                                    >
                                        <img src={IconConfirm} alt="" />
                                    </div>
                                </div>
                            ))}
                            {!refetch && loading && (
                                <div style={{ height: "10vw" }}>
                                    <StatusLoading slideUp />
                                </div>
                            )}
                            {showOperate && <div className={styles["operateReplace"]}></div>}
                        </div>
                    ) : (
                        <div className={styles["nodata"]}>
                            <img src={NullPic} alt="" />
                            <div className={styles["txt"]}>
                                {formatMsg("pic_list_no_data_hint")}
                                {/* Sorry,No search results,you can try.
                                <br />
                                1.check spelling or change keywords
                                <br />
                                2.Switching Search Range */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

// Header.PropsTypes = {
// }

export default List;
