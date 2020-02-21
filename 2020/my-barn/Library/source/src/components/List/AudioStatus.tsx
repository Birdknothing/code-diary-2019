import React, { Component, Fragment } from "react";
import styles from "./index.scss";
import { IconFinish, IconConfirm, UploadLoading, AudioUploadFail, AudioReUpload, AudioTurnIcon, UploadLineUp } from "@/components/FontIcon";
import { formatDuration, setType, formatAudioDuration } from "@/utils/format";
import { formatMsg } from "@/locales";
export default class extends Component {
    props: any;
    state = {
        // 是否正在上传的音频，带status属性
        handling: false,
        loading: false,
        success: false,
        fail: false,
        lineup: false,
        // 是否正在转换的音频
        turning: false,
        // 左侧显示状态图标
        statusIconLeft: "",
        // 删除按钮背景
        delBtnStyle: {},
        ndr_id: "",
        // 格式化时间
        totalTime: "",
        // 毫秒
        rawTotal: 0,
        title: "",
        location: "",
        whichSong: "",
        dom: null,
        ftps: 200,
        clock: null,
        status: "",
        turnStatus: false
    };
    componentDidMount() {
        const { statusObj, list, whichSong } = this.props;
        const { dom } = this.state;
        const { title, location, status, duration } = statusObj;
        // 记住播放歌曲
        if (whichSong === list.whichSong) {
            this.state.dom && (this.state.dom.previousElementSibling.previousElementSibling.checked = true);
        }
        // 上传obj {title,randomKey,uploadIndex /** 当前自己排在第几上传位 */,promis,status}
        // this.state.whichSong = whichSong;
        // this.state.title = this.handleTitle(title);

        // 后台试读取(不显示时长为0的和上传中的)
        if (duration !== "PT0S" && duration) {
            Object.assign(this.state, formatAudioDuration(duration));
        }

        this.setState({ whichSong, title: this.handleTitle(title) });

        if (location) {
            this.getDuration(location);
        }

        // 是上传的item
        if (status) {
            this.setTrue(status);
            this.startListenStatus(statusObj);
        }
        if (!dom) return;
    }
    // async uploadOnce() {
    //     const promis = this.props.statusObj.promis;
    //     const { list } = this.props;
    //     this.uploadOnce = async () => {};
    // }
    startListenStatus(statusObj) {
        const { status } = statusObj;
        const { ftps } = this.state;
        const { setState } = this.props;
        if (status === "success") return;
        const self = this;
        this.state.clock = setInterval(() => {
            const { location, ifDelete, title } = statusObj;
            const nowStatus = statusObj.status;
            if (location !== self.state.location) {
                self.getDuration(location);
            }
            if (title !== self.state.title) {
                self.setState({ title });
            }
            if (nowStatus !== self.state.status) {
                console.log("%c status changed to " + nowStatus, "color:red");
                self.setTrue(nowStatus);
                self.setState({ status: nowStatus });
            }
            if (nowStatus === "fail" || nowStatus === "success") {
                console.log("%c fail or success : " + nowStatus, "color:red");
                // 批量上传含有上传过的显示一次消息，改为由sdk改名

                setState({});
                // if (ifDelete && window.navigator && window.navigator.onLine) {
                //     self.props.alertOnce(8, "souce_repeat");
                // }

                window.clearInterval(self.state.clock);
            }
        }, ftps);
    }
    componentWillUnmount() {
        window.clearInterval(this.state.clock);
    }
    setTrue(status) {
        this.state[status] = true;
        if (status === "turning") {
            this.state.handling = false;
            this.state.statusIconLeft = AudioTurnIcon;
            return;
        }
        this.state.turning = false;
        this.state.handling = true;
        const stateOne = { loading: UploadLoading, success: "", fail: AudioUploadFail, lineup: UploadLineUp };
        for (let stat of Object.keys(stateOne)) {
            if (stat !== status && this.state[stat]) {
                this.state[stat] = false;
            }
        }
        this.state.statusIconLeft = stateOne[status];

        if (this.state.handling || this.state.turning || this.state.lineup) {
            this.state.delBtnStyle = { backgroundColor: "rgb(128,128,128)" };
        } 

        if(this.state.success) {
            this.state.delBtnStyle = {};
        }
    }
    // 点击上传
    async startUpload() {
        const { statusObj, setState } = this.props;
        if (!statusObj.promis) return;
        // 重启单个或重启整个队列，这里先重启单个上传
        this.setTrue("loading");
        this.setState({ status: "loading" });
        statusObj.status = "loading";
        this.startListenStatus(statusObj);
        const self = this;
        await statusObj.promis(result => {
            console.log("here,".repeat(10), result);
            if (!result) {
                // 资源重复
                if (window.navigator && window.navigator.onLine) {
                    setState({ showMsg: true, msgIndex: 8 });
                }
                statusObj.status = "fail";
                return;
            }
            const { location, ndr_id, id, duration, title } = result;
            if (location) {
                statusObj.status = "success";
                statusObj["location"] = location;
                statusObj["ndr_id"] = ndr_id;
                statusObj["title"] = title;
                statusObj["id"] = id;
                console.log("getFromNdr duration", duration);
                Object.assign(self.state, formatAudioDuration(duration));
                self.setState({});
            } else {
                statusObj.status = "fail";
            }
        });

        // const { location, ndr_id } = await promis();
        // // 注意组件切走，promis的后续代码将被切掉
        // this.state.ndr_id = ndr_id;
        // if (location) {
        //     list.splicePreviewArr(uploadIndex);
        //     this.setTrue("success");
        //     this.state.location = location;
        //     this.state.ndr_id = ndr_id;
        //     this.getDuration(location);
        // } else {
        //     this.setTrue("fail");
        // }
        // list.audioUploadIndex += 1;
        // // 触发下一个上传
        // setState({});
    }
    // 开始转化
    async startTurn() {
        const { dispatch, statusObj } = this.props;
        const { ndr_id } = statusObj;
        this.setTrue("turning");
        this.setState({ status: "turning" });
        statusObj.status = "turning";
        this.startListenStatus(statusObj);
        const self = this;
        const finishCb = async ({ guid }) => {
            const ndrInfo = await dispatch({ type: "list/getInfoByGuid", payload: guid });
            if (!ndrInfo) return;
            self.setTrue("success");
            console.log("turning success");
            // 是否需要转化失败重新转化
            statusObj.audioType = "audio/mp3";
            // 暂未提供转化失败图,全部做转化成功处理
            statusObj.status = "success";
            self.setState({ turning: false, location: ndrInfo.Url });
        };
        // 未上传的必须先上传完拿到ndr_id
        await dispatch({ type: "list/turnMp3", payload: this.state.ndr_id || ndr_id, statusEqualFinishCallback: finishCb });
    }
    getDuration(src) {
        if (!src) {
            return;
        }
        this.state.location = src;

        // const tmp = {}
        // tmp['audio'] = document.createElement("audio");
        // tmp['audio'].src = src;
        // const self = this;
        // const srcLoaded = function() {
        //     if (self.state.totalTime) {
        //         return;
        //     }
        //     const leng = formatDuration(tmp['audio']["duration"]);
        //     if (leng === "00:01" || leng === "00:00") {
        //         // 兼容无法读取的通过后台读取
        //         Object.assign(self.state, formatAudioDuration(self.props.statusObj.duration));
        //         self.setState({});
        //     } else {
        //         self.setState({ totalTime: leng, rawTotal: tmp['audio']["duration"] });
        //     }
        //     tmp['audio'] = null;
        // };
        // tmp['audio'].addEventListener("loadedmetadata", srcLoaded);
        const audio = document.createElement("audio");
        audio.src = src;
        const self = this;
        const srcLoaded = function() {
            if (self.state.totalTime) {
                return;
            }
            const leng = formatDuration(audio["duration"]);
            if (leng === "00:01" || leng === "00:00") {
                // 兼容无法读取的通过后台读取
                Object.assign(self.state, formatAudioDuration(self.props.statusObj.duration));
                self.setState({});
            } else {
                self.setState({ totalTime: leng, rawTotal: audio["duration"] });
            }
        };
        // audio.addEventListener("loadedmetadata", srcLoaded);

        // ios android通用
        audio.onloadedmetadata = srcLoaded;
    }
    // 播放此音频
    sendLive() {
        const { setState } = this.props;
        const { rawTotal, totalTime, title, location, whichSong } = this.state;
        if (!totalTime) {
            return;
        }
        setState({ playerObj: { totalTime, rawTotal, title, location }, whichSong, showPlayer: true, tabAudio: true });
    }

    // 点击播放
    clickToPlay(e) {
        const {
            router,
            list,
            statusObj: { status }
        } = this.props;
        const { dom } = this.state;
        if (!dom) return;
        if (status && status !== "success") return;
        // 取消删除暂时处理
        dom.getElementsByClassName(styles["rightBox"])[0].getElementsByClassName(styles["ctrlDel"])[0].checked = false;
        if (router.isMode("list")) {
            list.audioDom = dom;
            const singleDom = dom["previousElementSibling"].previousElementSibling;
            !singleDom.checked && (singleDom.checked = true);
        }
        if (router.isMode("choose")) {
            const inputDom = dom["previousElementSibling"];
            const ifChecked = inputDom["checked"];
            inputDom["checked"] = !ifChecked;
        }
        this.sendLive();
        e && e.stopPropagation();
    }
    // 点击删除
    async clickToDel(e) {
        const { delChosed, list, setState } = this.props;
        const { whichSong } = list;
        // const { handling, lineup } = this.state;
        if (whichSong === this.state.whichSong) {
            setState({ showPlayer: false }, false);
        }
        const tdom = e.currentTarget.parentNode.parentNode.previousElementSibling;
        tdom["checked"] = true;
        // 上传队列的音频无法删除
        if (this.state.fail || this.state.loading || this.state.lineup) {
            console.log("unable to del");
            return;
        }
        await delChosed();
        await setState({});
    }
    // 名称去尾
    handleTitle(str = "") {
        return str.split(".")[0];
    }
    // 重新转化
    handleReTurn() {
        /** */
    }
    render() {
        const { router, statusObj, setState, list } = this.props;
        const { turnStatus } = statusObj;
        const { delBtnStyle, fail, totalTime, turning, loading, dom, statusIconLeft, success, title } = this.state;
        if (dom) {
            // 选中态和显示播放器绑定
            list.showPlayer === false && (dom["previousElementSibling"].previousElementSibling.checked = false);
        }
        // 需要转码的
        if (turnStatus === "turning") {
            statusObj.turnStatus = "onturning";
            this.startTurn();
        }
        // 需要上传的
        // if (uploadIndex === audioUploadIndex) {
        //     this.setTrue("loading");
        //     statusObj.status = "loading";
        //     statusObj.uploadIndex = null;
        //     this.startUpload();
        // }
        // // 上传的promis被执行完
        // if (status && !this.state[status]) {
        //     console.log(`%c ${status.repeat(20)}`, "color:red");

        //     this.setTrue(status);
        //     // this.setState({})
        // }
        // if (ndr_id !== this.state.ndr_id) {
        //     this.state.ndr_id = ndr_id;
        // }
        // if (location !== this.state.location) {
        //     this.state.location = location;
        //     this.getDuration(location);
        // }

        return (
            <div className={styles["audioBox"]} ref={el => (this.state.dom = el)} style={{ display: this.props.ctrlShow(statusObj, "flex") }}>
                <div
                    className={styles["title"]}
                    // onTouchStart={this.clickToPlay.bind(this)}
                    onTouchStart={e => this.props.touchAnItem(e, "start", "audio", statusObj, this.clickToPlay.bind(this))}
                    onTouchMove={e => this.props.touchAnItem(e, "move", "audio", statusObj, this.clickToPlay.bind(this))}
                    onTouchEnd={e => this.props.touchAnItem(e, "end", "audio", statusObj, this.clickToPlay.bind(this))}
                >
                    {this.handleTitle(title) || ""}
                </div>
                {/* <div className={styles["time"]} onTouchStart={this.clickToPlay.bind(this)}> */}
                <div
                    className={styles["time"]}
                    onTouchStart={e => this.props.touchAnItem(e, "start", "audio", statusObj, this.clickToPlay.bind(this))}
                    onTouchMove={e => this.props.touchAnItem(e, "move", "audio", statusObj, this.clickToPlay.bind(this))}
                    onTouchEnd={e => this.props.touchAnItem(e, "end", "audio", statusObj, this.clickToPlay.bind(this))}
                >
                    {totalTime}
                </div>
                {router.isMode("list") ? (
                    <div className={styles["rightBox"]}>
                        <div
                            className={styles["dots"]}
                            onTouchStart={e => {
                                // 上传失败的不显示删除按钮
                                if (fail) {
                                    return;
                                }
                                // 操作终止播放
                                setState({ stopAudio: true }, false);
                                e.currentTarget.nextElementSibling["checked"] = true;
                            }}
                        >
                            {!success && (
                                <div className={styles["status"]} onTouchStart={this.handleReTurn.bind(this)}>
                                    {<img src={statusIconLeft} alt="" style={{ visibility: !loading && !turning ? "visible" : "hidden" }} />}
                                    {<img src={statusIconLeft} alt="" style={{ visibility: loading || turning ? "visible" : "hidden" }} />}
                                    {/* {!loading && !turning && <img src={statusIconLeft} alt="" />}
                                    {(loading || turning) && <img src={statusIconLeft} alt="" />} */}
                                </div>
                            )}
                            <div className={styles["dotsBox"]}>
                                {fail ? (
                                    <div className={styles["reload"]} onTouchStart={this.startUpload.bind(this)}>
                                        <img src={AudioReUpload} alt="" />
                                    </div>
                                ) : (
                                    <Fragment>
                                        <div className={styles["dot"]}></div>
                                        <div className={styles["dot"]}></div>
                                        <div className={styles["dot"]}></div>
                                    </Fragment>
                                )}
                            </div>
                        </div>
                        <input type="checkbox" className={styles["ctrlDel"]} />
                        <div className={styles["del"]} style={delBtnStyle} onTouchStart={this.clickToDel.bind(this)}>
                            {formatMsg("audio_delete")}
                        </div>
                    </div>
                ) : router.isMode("choose") ? (
                    <div
                        className={styles["chose"]}
                        onTouchStart={e => {
                            const inputCtrl = e.currentTarget.parentNode["previousElementSibling"];
                            const ifChecked = inputCtrl["checked"];
                            inputCtrl["checked"] = !ifChecked;
                            statusObj._isChosed = !ifChecked;
                        }}
                    >
                        <img src={IconConfirm} alt="" />
                        <img src={IconFinish} alt="" />
                        {turning && (
                            <div className={styles["status"]} onTouchStart={this.handleReTurn.bind(this)}>
                                <img src={statusIconLeft} alt="" />
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
            //
        );
    }
}
