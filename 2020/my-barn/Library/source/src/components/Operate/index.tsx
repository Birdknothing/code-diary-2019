import React, { Fragment, Component } from "react";
import { formatMsg } from "@/locales";
import styles from "./index.scss";
import { HeartLine } from "@/components/FontIcon";
import { CrossDel, TrashCan, IconTag, AudioTurnHollow } from "@/components/FontIcon";

class Operate extends Component {
    props: any;
    state = {
        canceledId: 0
    };
    checkIfchosed() {
        const { list } = this.props;
        // const target = list.listStorage().items.concat(list.getPreviewArr());
        const target = list.showItems;
        console.log("showItems length", target.length);
        let ifChosed = false;
        for (let ele of target) {
            if (ele._isChosed) {
                ifChosed = true;
            }
        }
        if (!ifChosed) {
            this.props.setState({ showMsg: true, msgIndex: 1 });
            return false;
        }
        return true;
    }
    // audio转mp3
    turnMp3() {
        if (!this.checkIfchosed()) {
            return;
        }
        const { setState } = this.props;
        setState({ turnEvent: true });
    }
    // 个人库点击删除
    goDelete() {
        const {router} = this.props;
        // 图片预览不需要选中
        if (!router.isMode('preview') && !this.checkIfchosed()) {
            return;
        }
        // 触发删除
        this.props.setState({ showModal: true, modalIndex: 1 });
    }
    // 个人库取消收藏
    cancelCollect() {
        const { setState, list, router } = this.props;
        const {
            previewObj: { ndr_id }
        } = list;
        // 图片预览重复点击取消收藏无效
        if (router.isMode('preview') && (this.state.canceledId === ndr_id)) return;
        this.state.canceledId = ndr_id;
        // 通知取消收藏
        setState({ deleteEvent: true });
    }
    // 个人库点击分类
    classify() {
        this.props.setState({ showMsg: true, msgIndex: 4 });
    }
    render() {
        const { setState, router, list } = this.props;
        const { showOperate, operateStyleType } = list;
        const show = showOperate && (router.isMode("choose") || router.isMode("preview"));
        const type = list.operateType();
        const operateStyle = { transform: show ? "translate3d(0, 0, 0)" : "translate3d(0, 46vw, 0)" };
        // 1表示较高操作框(带标题)
        const isHigh = operateStyleType === 1;
        isHigh && (operateStyle["borderRadius"] = "2.67vw 2.67vw 0 0");
        const SonItem = ({ touchDo, picSrc, txt }) => (
            <div className={styles["opItem"]} onTouchStart={touchDo}>
                <div className={styles["pic"]}>
                    <div className={styles["icon"]}>
                        <div className={styles["iconBox"]}>
                            <img src={picSrc} alt="" />
                        </div>
                    </div>
                </div>
                <div className={styles["txt"]}>{formatMsg(txt)}</div>
            </div>
        );
        const SonItemLower = ({ touchDo, picSrc, txt }) => (
            <div className={styles["opItemLower"]} onTouchStart={touchDo}>
                <div className={styles["pic"]}>
                    <img src={picSrc} alt="" />
                </div>
                <div className={styles["txt"]}>{formatMsg(txt)}</div>
            </div>
        );
        const TargetItem = isHigh ? SonItem : SonItemLower;
        const operates = {
            gallery: (
                <Fragment>
                    {router.isMode("audio") && (
                        // 转码
                        <TargetItem picSrc={AudioTurnHollow} touchDo={this.turnMp3.bind(this)} txt="audio_turn_mp3" />
                        // <div className={styles["opItem"]} onTouchStart={this.turnMp3.bind(this)}>
                        //     <div className={styles["pic"]}>
                        //         <div className={styles["icon"]}>
                        //             <div className={styles["iconBox"]}>
                        //                 <img src={AudioTurnHollow} alt="" />
                        //             </div>
                        //         </div>
                        //     </div>
                        //     <div className={styles["txt"]}>{formatMsg("audio_turn_mp3")}</div>
                        // </div>
                    )}
                    {/* 分类 */}
                    <TargetItem picSrc={IconTag} touchDo={this.classify.bind(this)} txt="pic_operate_classify" />
                    {/* <div className={styles["opItem"]} onTouchStart={this.classify.bind(this)}>
                        <div className={styles["pic"]}>
                            <div className={styles["icon"]}>
                                <div className={styles["iconBox"]}>
                                    <img src={IconTag} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className={styles["txt"]}>{formatMsg("pic_operate_classify")}</div>
                    </div> */}
                    {/* 删除 */}
                    <TargetItem picSrc={TrashCan} touchDo={this.goDelete.bind(this)} txt="pic_operate_del" />
                    {/* <div className={styles["opItem"]} onTouchStart={this.goDelete.bind(this)}>
                        <div className={styles["pic"]}>
                        <div className={styles["icon"]}>
                        <div className={styles["iconBox"]}>
                        <img src={TrashCan} alt="" />
                        </div>
                        </div>
                        </div>
                        <div className={styles["txt"]}>{formatMsg("pic_operate_del")}</div>
                    </div> */}
                </Fragment>
            ),
            collection: (
                <Fragment>
                    {router.isMode("audio") && (
                        <TargetItem picSrc={AudioTurnHollow} touchDo={this.turnMp3.bind(this)} txt="audio_turn_mp3" />
                        // <div className={styles["opItem"]} onTouchStart={this.turnMp3.bind(this)}>
                        //     <div className={styles["pic"]}>
                        //         <div className={styles["icon"]}>
                        //             <div className={styles["iconBox"]}>
                        //                 <img src={AudioTurnHollow} alt="" />
                        //             </div>
                        //         </div>
                        //     </div>
                        //     <div className={styles["txt"]}>{formatMsg("audio_turn_mp3")}</div>
                        // </div>
                    )}
                    {/* 取消收藏 */}
                    <TargetItem picSrc={HeartLine} touchDo={this.cancelCollect.bind(this)} txt="pic_collect_del" />
                    {/* <div className={styles["opItem"]}>
                        <div className={styles["pic"]}>
                            <div className={styles["icon"]}>
                                <div className={styles["iconBox"]}>
                                    <img src={HeartLine} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className={styles["txt"]}>{formatMsg("pic_collect_del")}</div>
                    </div> */}
                </Fragment>
            ),
            tags: <Fragment></Fragment>
        };

        return (
            <div className={styles["operate"]} style={operateStyle}>
                {operateStyleType === 1 ? (
                    // 仅标签页用
                    <Fragment>
                        <div className={styles["title"]} style={{ display: router.isMode("preview") ? "none" : "flex" }}>
                            <div className={styles["txt"]}>{formatMsg("pic_operate_title")}</div>
                            <div
                                className={styles["del"]}
                                onTouchStart={() => {
                                    router.goBack();
                                    setState({ showOperate: false });
                                }}
                            >
                                <img src={CrossDel} alt="" />
                            </div>
                        </div>
                        <div className={styles["opItems"]}>{operates[type]}</div>
                    </Fragment>
                ) : (
                    <Fragment>
                        {/* <div className={styles["title"]} style={{ display: router.isMode("preview") ? "none" : "flex" }}>
                            <div className={styles["txt"]}>{formatMsg("pic_operate_title")}</div>
                            <div
                                className={styles["del"]}
                                onTouchStart={() => {
                                    router.goBack();
                                    setState({ showOperate: false });
                                }}
                            >
                                <img src={CrossDel} alt="" />
                            </div>
                        </div> */}
                        <div className={styles["opItemsLower"]}>{operates[type]}</div>
                    </Fragment>
                )}
            </div>
        );
    }
}

export default Operate;
