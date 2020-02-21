import React, { Component } from "react";
import { connect } from "dva";
import { withRouter } from "dva/router";
import { MusicIcon, ImgIcon, RightArrow } from "@/components/FontIcon";
import { formatMsg } from "@/locales";
import styles from "./index.scss";
import StatusLoading from "../Loading";

@connect(({ fontpage, loading: { effects } }) => ({ fontpage, loading: effects["fontpage/getCloudInfo"] }))
class FontPage extends Component {
    props: any;
    calcGB(num: number = 1) {
        const storage = Number((num / 1073741824).toFixed(2));
        const arr = storage.toString().split(".");
        return arr[0] + "." + ((arr[1] || "") + "00").slice(0, 2);
    }
    calcPercent(used: string = "1", total: string = "1") {
        return Number((+used / +total) * 100).toFixed(2) + "%";
    }
    componentDidMount() {
        const { dispatch } = this.props;
        // 磁盘空间,参数先后顺序不可变
        dispatch({ type: "fontpage/getCloudInfo", payload: [{ category: "Image" }, { category: "Audio" }] });
        // 校验空间是否足够
        const { fontpage, setState } = this.props;
        const { pic_total, pic_used, audio_total, audio_used } = fontpage;
        if (pic_total <= pic_used || audio_total <= audio_used) {
            setState({ showModal: true, modalIndex: 0 });
        }
    }

    render() {
        const { router, fontpage, setState, loading } = this.props;
        const { pic_total, pic_used, audio_total, audio_used } = fontpage;
        const picTotal = this.calcGB(pic_total);
        const picUsed = this.calcGB(pic_used);
        const audioTotal = this.calcGB(audio_total);
        const audioUsed = this.calcGB(audio_used);
        const picPercent = this.calcPercent(picUsed, picTotal);
        const audioPercent = this.calcPercent(audioUsed, audioTotal);
        return (
            <div className={`${styles["libsList"]}`}>
                <div className={`${styles["listBox"]}`}>
                    {loading ? (
                        <StatusLoading pageTab backgroundColor={"transparent"} />
                    ) : (
                        <div className={`${styles["list"]}`}>
                            {/* 图库 */}
                            <div
                                className={`${styles["listItem"]}`}
                                onTouchStart={() => {
                                    router.tabMode("pic");
                                    setState({ typeChosed: 0 }, false);
                                }}
                            >
                                <div className={`${styles["left"]}`}>
                                    <div className={`${styles["pic"]}`}>
                                        <img src={ImgIcon} alt="" />
                                    </div>
                                </div>
                                <div className={`${styles["middle"]}`}>
                                    <div className={`${styles["txt"]}`}>
                                        <div className={`${styles["t1"]}`}>{formatMsg("entry_pic_title")}</div>
                                        <div className={`${styles["t2"]}`}>
                                            {formatMsg("entry_used")} {picUsed} GB / {picTotal} GB
                                        </div>
                                    </div>
                                    <div className={`${styles["bar"]}`}>
                                        <div className={`${styles["live"]}`} style={{ width: picPercent }}></div>
                                    </div>
                                </div>
                                <div className={`${styles["right"]}`}>
                                    <img src={RightArrow} alt="" />
                                </div>
                            </div>
                            {/* 音频库 */}
                            <div
                                className={`${styles["listItem"]}`}
                                onTouchStart={() => {
                                    router.tabMode("audio");
                                    setState({ typeChosed: 1, navId: "" }, false);
                                }}
                            >
                                <div className={`${styles["left"]}`}>
                                    <div className={`${styles["pic"]}`}>
                                        <img src={MusicIcon} alt="" />
                                    </div>
                                </div>
                                <div className={`${styles["middle"]}`}>
                                    <div className={`${styles["txt"]}`}>
                                        <div className={`${styles["t1"]}`}>{formatMsg("entry_audio_title")}</div>
                                        <div className={`${styles["t2"]}`}>
                                            {formatMsg("entry_used")} {audioUsed} GB / {audioTotal} GB
                                        </div>
                                    </div>
                                    <div className={`${styles["bar"]}`}>
                                        <div className={`${styles["live"]}`} style={{ width: audioPercent }}></div>
                                    </div>
                                </div>
                                <div className={`${styles["right"]}`}>
                                    <img src={RightArrow} alt="" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(FontPage as any);
