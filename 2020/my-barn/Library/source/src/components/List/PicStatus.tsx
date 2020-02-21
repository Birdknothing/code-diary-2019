import React, { Component } from "react";
import styles from "./index.scss";
import { UploadFail, UploadLineUp, UploadLoading } from "@/components/FontIcon";

export default class extends Component {
    props: any;
    state = {
        status: "",
        ftps: 200,
        clock: null
    };
    componentDidMount() {
        const { statusObj } = this.props;
        const { status } = statusObj;
        if (status) {
            this.setState({ status });
            this.startHandleUpload(statusObj);
        }
    }
    startHandleUpload(statusObj) {
        const { status } = statusObj;
        const { ftps } = this.state;
        if (status === "success") return;
        const self = this;
        this.state.clock = setInterval(() => {
            const { status: nowStatus, ifDelete } = statusObj;
            if (nowStatus !== self.state.status) {
                console.log("%c status changed to " + nowStatus, "color:red");
                self.setState({ status: nowStatus });
            }
            if (nowStatus === "fail" || nowStatus === "success") {
                // 要删除的为资源重复的，批量上传含有名称重复的显示一次消息
                if (ifDelete && window.navigator && window.navigator.onLine) {
                    self.props.alertOnce(8, "souce_repeat");
                }
                window.clearInterval(self.state.clock);
            }
        }, ftps);
    }
    componentWillUnmount() {
        window.clearInterval(this.state.clock);
    }
    async startUpload() {
        const { statusObj, setState } = this.props;
        const { promis } = statusObj;
        if (!promis) return;
        this.setState({ status: "loading" });
        await new Promise(res => {
            setTimeout(res, 400);
        });
        statusObj.status = "loading";
        this.startHandleUpload(statusObj);
        await promis(result => {
            if (!result) {
                // 资源重复
                if (window.navigator && window.navigator.onLine) {
                    setState({ showMsg: true, msgIndex: 8 });
                }
                statusObj.status = "fail";
                return;
            }
            const { id } = result;
            if (id) {
                statusObj.status = "success";
                statusObj["id"] = id;
            } else {
                statusObj.status = "fail";
            }
        });
    }
    render() {
        const { status } = this.state;

        // 状态统一管理
        // const {
        //     statusObj: { status }
        // } = this.props;
        return status === "lineup" ? (
            <div className={styles["lineup"]}>
                <img src={UploadLineUp} alt="" />
            </div>
        ) : status === "loading" ? (
            <div className={styles["loading"]}>
                <img src={UploadLoading} alt="" />
            </div>
        ) : status === "fail" ? (
            <div className={styles["fail"]} onTouchStart={this.startUpload.bind(this)}>
                <img src={UploadFail} alt="" />
            </div>
        ) : null;
    }
}
