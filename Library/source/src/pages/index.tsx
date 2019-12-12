import React, { Component, Fragment, memo } from "react";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import Operate from "@/components/Operate";
import { formatMsg } from "@/locales";
import Msg from "@/components/Msg";
import { connect } from "dva";
import { Test } from "@/components/Test";

import styles from "./index.scss";
// const MemoOperate = memo(Operate);
@connect(() => ({}))
class Main extends Component {
    props: any;
    state = {
        // 导航栏按钮
        headArr: [
            { title: formatMsg("head_gather"), id: "list" },
            { title: formatMsg("head_collect"), id: "collect" }
        ],
        // 默认显示 列表 或 收藏
        headChosed: 0,
        // 导航栏选中id
        navId: [],
        // 关键词
        keyword: "",
        // 图片或音频
        typeArr: ["pic", "audio"],
        typeChosed: 0,

        operateTypes: ["gallery", "collection"],
        showOperate: false,
        operateIndex: 0,

        modalTypes: ["no_storage", "del_from_gallery"],
        modalIndex: 0,
        showModal: false,

        msgTypes: ["cancel_collect", "no_chosed", "upload_success", "del_success", "not_yet"],
        msgIndex: 0,
        showMsg: false,

        // 确认删除点击
        delChosed: false
    };
    updateState(newState: object, cb?: (ctxt) => void) {
        this.setState(newState, () => {
            cb && cb(this);
        });
    }
    resetState(newState: object) {
        Object.assign(this.state, newState);
    }
    componentDidMount() {
        const { dispatch } = this.props;
        // 磁盘空间,参数先后顺序不可变
        dispatch({ type: "fontpage/getCloudInfo", payload: [{ category: "Image" }, { category: "Audio" }] });
    }
    render() {
        console.log("main render");
        const {
            location: { pathname },
            getChildByRoute
        } = this.props;

        const {
            modalTypes,
            modalIndex,
            showModal,
            msgTypes,
            msgIndex,
            showMsg,
            showOperate,
            operateTypes,
            operateIndex,
            delChosed,
            headArr,
            typeArr,
            typeChosed,
            headChosed,
            navId,
            keyword
        } = this.state;
        const Target = getChildByRoute(pathname);
        return (
            <div className={styles["basic"]}>
                <Header {...this.props} headChosed={headChosed} headArr={headArr} setState={this.updateState.bind(this)} />
                <Target
                    {...this.props}
                    // 导航信息注入
                    headInfo={headArr[headChosed]}
                    navId={navId}
                    keyword={keyword}
                    // 当前是图库还是音频库
                    listType={typeArr[typeChosed]}
                    state={this.state}
                    showOperate={showOperate}
                    delChosed={delChosed}
                    resetState={this.resetState.bind(this)}
                    setState={this.updateState.bind(this)}
                />
                <Modal type={modalTypes[modalIndex]} show={showModal} setState={this.updateState.bind(this)} />
                <Operate {...this.props} type={operateTypes[operateIndex]} show={showOperate} setState={this.updateState.bind(this)} />
                <Msg type={msgTypes[msgIndex]} show={showMsg} resetState={this.resetState.bind(this)} />
                <Test {...this.props} setState={this.updateState.bind(this)} />
            </div>
        );
    }
}
export default Main;
