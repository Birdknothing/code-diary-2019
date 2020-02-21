import React, { Fragment, Component } from "react";
import styles from "./index.scss";
import { PlayStart, PlayStop } from "@/components/FontIcon";
import { formatDuration } from "@/utils/format";
class AudioPlayer extends Component {
    props: any;
    state: any = {
        playing: false,
        audio: null,
        whole: 0,
        ctrlBtn: null,
        slideBar: null,
        liveTime: "00:00",
        liveSecond: 0,
        playEnd: false,
        timeStep: 1
    };
    componentDidMount() {
        const self = this;
        // ios需要至少手动播放过一次才能自动播放
        function preTouch() {
            const player = audioExm.play();
            player.then(() => {}).catch(() => {});
            document.removeEventListener("touchend", preTouch);
            self.state.audio.src = "";
            self.state.audio.play();
        }
        document.addEventListener("touchend", preTouch);
        let audioExm = document.createElement("audio");
        audioExm.src = "";
        document.body.appendChild(audioExm);
    }
    audioReady() {
        if (!this.state.audio) {
            return;
        }
        const promis = this.state.audio["play"]();
        if (promis.then) {
            promis
                .then(data => {
                    console.log("normal", data);
                })
                .catch(err => {
                    console.log("err", err);
                })
                .finally(() => {});
        }
        // const self = this;
        // document.removeEventListener("touchend", self.audioReady);
    }
    reset() {
        this.state.liveSecond = 0;
        this.state.playing = false;
    }
    clickPlay() {
        const { playing } = this.state;
        if (playing) {
            this.playStop();
        } else {
            this.playStart();
        }
    }
    playStop() {
        if (!this.state.audio) return;
        this.setState({ playing: false });
        this.state.audio["pause"]();
    }
    playStart() {
        if (!this.state.audio) return;
        if (this.state.playEnd) {
            this.reset();
            this.state.playEnd = false;
        }
        this.setState({ playing: true });
        const promis = this.state.audio["play"]();
        if (promis.then) {
            promis
                .then(data => {
                    console.log("normal", data);
                })
                .catch(err => {
                    console.log("err", err);
                })
                .finally(() => {});
        }
    }
    handlePlay() {
        const { audio, whole, ctrlBtn, liveSecond, timeStep, playing } = this.state;
        !playing && (this.state.playing = true);
        const { currentTime } = audio;
        const nowSecond = Math.round(currentTime);
        if (nowSecond < liveSecond) {
            return;
        }
        const { slideBar } = this.state;
        this.state.liveSecond += timeStep;
        // bar总长56vw
        const wholeSecond = Math.round(whole);
        const vwWidth = (nowSecond / wholeSecond) * 56 + "vw";
        ctrlBtn.style.transform = `translate3d(${vwWidth},-50%,0)`;
        slideBar.style.width = vwWidth;
        this.setState({ liveTime: formatDuration(currentTime) });
    }
    handlePause() {
        this.setState({ playing: false });
    }
    handleEnd() {
        this.setState({ playing: false, playEnd: true });
    }
    render() {
        const { list } = this.props;
        const {
            showPlayer: show,
            tabAudio,
            stopAudio,
            playerObj: { totalTime, rawTotal, title, location }
        } = list;
        const { liveTime } = this.state;
        this.state.whole = rawTotal;
        if (tabAudio) {
            list.tabAudio = false;
            this.reset();
        }
        if (stopAudio) {
            list.stopAudio = false;
            this.playStop();
        }

        return (
            <div className={styles["audioPlayer"]} style={{ transform: show ? "translate3d(0, 0, 0)" : "translate3d(0, 24vw, 0)" }}>
                <div className={styles["player"]}>
                    <div className={styles["title"]}>{title}</div>
                    <div className={styles["playBar"]}>
                        <div className={styles["ctrl"]} ref={el => (this.state.ctrlBtn = el)}></div>
                        <div className={styles["bar"]}>
                            <div className={styles["colorBar"]} ref={el => (this.state.slideBar = el)}></div>
                            <audio
                                id="singlePlayer"
                                src={encodeURI(location)}
                                onTimeUpdate={this.handlePlay.bind(this)}
                                onPause={this.handlePause.bind(this)}
                                onEnded={this.handleEnd.bind(this)}
                                // onLoadedMetadata={this.audioReady.bind(this)}
                                onCanPlay={this.audioReady.bind(this)}
                                ref={el => (this.state.audio = el)}
                                autoPlay
                            >
                                sorry,your browser don't support audio tag!
                            </audio>
                        </div>
                        <div className={styles["clock"]}>
                            {liveTime}/{totalTime}
                        </div>
                    </div>
                </div>
                <div className={styles["btnBox"]}>
                    <div className={styles["btn"]} onTouchStart={this.clickPlay.bind(this)}>
                        <img src={this.state.playing ? PlayStop : PlayStart} alt="" />
                    </div>
                </div>
            </div>
        );
    }
}

export default AudioPlayer;
