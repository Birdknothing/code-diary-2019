import React, { Fragment } from "react";
import { formatMsg } from "@/locales";
import styles from "./index.scss";
import { HeartLine } from "@/components/FontIcon";
import { CrossDel, TrashCan, IconTag } from "@/components/FontIcon";
import { connect } from "dva";

const Operate: any = props => {
    const { setState, show, router, type } = props;
    console.log("operate return");

    // 点击分类
    const classify = () => {
        setState({ showMsg: true, msgIndex: 4 });
    };

    // 点击删除
    const goDelete = () => {
        setState({ showModal: true, modalIndex: 1 });
    };
    const operates = {
        gallery: (
            <Fragment>
                <div className={styles["opItem"]} onTouchStart={classify}>
                    <div className={styles["pic"]}>
                        <div className={styles["icon"]}>
                            <div className={styles["iconBox"]}>
                                <img src={IconTag} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className={styles["txt"]}>{formatMsg("pic_operate_classify")}</div>
                </div>
                <div className={styles["opItem"]} onTouchStart={goDelete}>
                    <div className={styles["pic"]}>
                        <div className={styles["icon"]}>
                            <div className={styles["iconBox"]}>
                                <img src={TrashCan} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className={styles["txt"]}>{formatMsg("pic_operate_del")}</div>
                </div>
            </Fragment>
        ),
        collection: (
            <Fragment>
                <div
                    className={styles["opItem"]}
                    onClick={() => {
                        // 通知取消收藏
                        setState({ delChosed: true });
                    }}
                >
                    <div className={styles["pic"]}>
                        <div className={styles["icon"]}>
                            <div className={styles["iconBox"]}>
                                <img src={HeartLine} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className={styles["txt"]}>{formatMsg("pic_collect_del")}</div>
                </div>
            </Fragment>
        ),
        tags: <Fragment></Fragment>
    };

    return (
        <div className={styles["operate"]} style={{ transform: show ? "translate3d(0, 0, 0)" : "translate3d(0, 46vw, 0)" }}>
            {
                <Fragment>
                    <div className={styles["title"]}>
                        <div className={styles["txt"]}>{formatMsg("pic_operate_title")}</div>
                        <div
                            className={styles["del"]}
                            onClick={() => {
                                router.goBack();
                                setState({ showOperate: false });
                            }}
                        >
                            <img src={CrossDel} alt="" />
                        </div>
                    </div>
                    <div className={styles["opItems"]}>{operates[type]}</div>
                </Fragment>
                // : (
                //     <Fragment>
                //         <div className={styles["title"]}>
                //             <div className={styles["txt"]}>{formatMsg("pic_operate_add_category")}</div>
                //             <div
                //                 className={styles["manager"]}
                //                 onClick={() => {
                //                     // router.goBack();
                //                     // setState({ showOperate: false });
                //                 }}
                //             >
                //                 <div className={styles["icon"]}>icon</div>
                //                 <div className={styles["manageTxt"]}>{formatMsg("pic_operate_label_management")}</div>
                //             </div>
                //         </div>
                //         <div className={styles["tagItems"]}>
                //             <div className={styles["tagItem"]}></div>
                //         </div>
                //     </Fragment>
                // )
            }
        </div>
    );
};

export default Operate;
