import React, { Component, PureComponent } from "react";
// import router from 'umi/router';
// import PropsTypes from 'prop-types';
import { connect } from "dva";
import { withRouter } from "dva/router";
import { MusicIcon, ImgIcon, LeftArrow, RightArrow } from "@/components/FontIcon";
import { formatMsg } from "@/locales";
import styles from "./index.scss";

@connect(({ fontpage }) => ({ fontpage }))
class FontPage extends PureComponent {
    props: any;
    calcGB(num: number = 1) {
        return Number(Math.round(num / 1073741824).toFixed(1));
    }
    calcPercent(used: number = 1, total: number = 1) {
        return Number((used / total) * 100).toFixed(2) + "%";
    }
    render() {
        const { router, fontpage, setState } = this.props;
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
                    <div className={`${styles["list"]}`}>
                        {/* 图库 */}
                        <div
                            className={`${styles["listItem"]}`}
                            onClick={() => {
                                router.push("/pic");
                                setState({ typeChosed: 0 });
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
                                        {formatMsg("entry_used")} {picUsed}gb / {picTotal}gb
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
                            onClick={() => {
                                router.push("/audio");
                                setState({ typeChosed: 1 });
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
                                        {formatMsg("entry_used")} {audioUsed}gb / {audioTotal}gb
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
                </div>
            </div>

            // <div
            //     id="header"
            //     className={`${styles["header"]} clearfix ${theme === "white" ? styles["theme-white"] : ""} ${
            //         className ? className : ""
            //     }`}
            // >
            //     {back ? (
            //         <Iconfont type="icon-arrow-left" className={styles["ico-back"]} onClick={this.goBack.bind(this)} />
            //     ) : null}
            //     {title ? <h2 className="ellipsis">{title}</h2> : children ? children : null}
            //     {confirmBtn ? (
            //         <Button
            //             type="primary"
            //             className={`${styles["btn-confirm"]} ${
            //                 typeof confirmBtn !== "string" ? styles["icon-btn"] : ""
            //             }`}
            //             onClick={this.handleConfirm.bind(this)}
            //         >
            //             {confirmBtn}
            //         </Button>
            //     ) : confirmTxt ? (
            //         <span className={styles["btn-confirm-txt"]} onClick={this.handleConfirm.bind(this)}>
            //             {confirmTxt}
            //         </span>
            //     ) : null}
            // </div>
        );
    }
}

// Header.PropsTypes = {
//     back: PropsTypes.bool,
//     confirmTxt: PropsTypes.string,
//     confirmBtn: PropsTypes.elementType || PropsTypes.string,
//     title: PropsTypes.string,
//     className: PropsTypes.string,
//     theme: PropsTypes.string,
//     onConfirm: PropsTypes.function
// }

export default withRouter(FontPage as any);
