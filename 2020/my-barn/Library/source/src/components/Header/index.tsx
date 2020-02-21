import React, { Component, Fragment } from "react";
import { IconAddPic, LeftArrow, MultiChose, IconFinish, IconAddAudio, IconConfirm } from "@/components/FontIcon";
import { formatMsg } from "@/locales";
import styles from "./index.scss";
import { getType, getFileNameWithoutType } from "@/utils/format";
import { isIOS } from "@/utils/compat";
import { connect } from "dva";

@connect(({ list }) => ({ list }))
class Header extends Component {
    props: any;
    // state = {
    //     chooseAll: false
    // };
    // 按钮切换,左列表，右收藏
    async headerBtnClick(e, index, setState) {
        const { list, getMore } = this.props;
        const textDom = e.currentTarget;
        textDom.previousElementSibling.checked = true;
        textDom.parentNode.dataset.toggle = textDom.dataset.toggle;
        // 标签页refetch为true
        list.listStorage().reset();
        // 收藏页操作项改变;
        setState({ headChosed: index, operateIndex: index, stopAudio: true, showPlayer: false }, false);
        await getMore();
    }
    // 全选
    chooseAllClick() {
        const { setState, list } = this.props;
        const changedVal = !list.chooseAll;
        setState({ chooseAll: changedVal, fromCom: "header" });
        // this.setState({ chooseAll: changedVal });
    }
    // 回到父页面
    switchToFather() {
        if (!window.parent) {
            return;
        }
        window.parent.postMessage("HideLibrary", "*");
        // window.parent.document["getElementById"]("Library_Iframe").style.display = "none";
    }
    // 左点击按钮
    goBack() {
        const { router, setState, list } = this.props;
        if (router.isMode("entry")) {
            this.switchToFather();
            return;
        }
        router.goBack();
        // 记住之前的operateIndex
        setState({ showOperate: false, stopAudio: true, showPlayer: false, operateIndex: list.operateIndex });
    }
    // 多选按钮
    multiChoseClick(e) {
        const { router, setState, list } = this.props;
        router.tabMode("choose");
        // 多选取消音频播放态
        // if (router.isMode("audio")) {
        //     list.cancelAudioSelect();
        // }
        setState({ showOperate: true, stopAudio: true, showPlayer: false });
    }
    // 上传按钮
    async upload(e) {
        const { dispatch, list, setState } = this.props;

        for (let file of e.currentTarget.files) {
            const { size } = file;
            let { name } = file;
            console.log(file);

            // prettier-ignore
            // console.log((name = name.split('.')[0] +Math.random().toString().slice(-5)+'.'+name.split('.')[1]));
            // 分图片音频
            const type = file.type ? (file.type + "").slice(0, 5) : "";
            const isPic = type === "image";
            const isAudio = type === "audio";
            const audioTypeAccept = ["mp3", "wav", "ogg"];
            // ios的mp3会变为mpeg格式,且仅支持mp3上传，其余两种无法播放
            const iosAccept = ["mp3", "mpeg"];
            let category = "";
            let managerName = "";
            let uploadAllName = "";

            const libname = list.listType();
            const audioType = file.type.split("/")[1].toLowerCase();
            if (libname === "pic" && !isPic) {
                continue;
            }
            if (libname === "audio" && (!isAudio || (!isIOS ? !audioTypeAccept.includes(audioType) : !iosAccept.includes(audioType)))) {
                if(!isIOS){
                    setState({ showMsg: true, msgIndex: 9 });
                }
                continue;
            }

            if (isPic) {
                category = "Image";
                managerName = "picUploadManager";
                uploadAllName = "picUploadAll";
            }
            if (isAudio) {
                category = "Audio";
                managerName = "audioUploadManager";
                uploadAllName = "audioUploadAll";
            }
            if (!category) {
                return;
            }

            const uploadObj = {
                category,
                custom_properties: "",
                description: "ceshi",
                file,
                // 文件名去掉后缀
                title: getFileNameWithoutType(name),
                size
            };
            const uploadPromise = (cb1 = x => {}) => async (cb2 = x => {}) => {
                const result = await dispatch({ type: "list/upload", payload: uploadObj });
                cb1(result);
                cb2(result);
                return result;
            };
            const randomKey = Math.random()
                .toString()
                .slice(-6);

            if (isPic) {
                // 预览
                await list[managerName](file, randomKey, name, list[uploadAllName], uploadPromise);
            }
            if (isAudio) {
                list[managerName](file, randomKey, name, list[uploadAllName], uploadPromise);
            }
            list[uploadAllName] += 1;
        }

        // 解锁单次弹出消息
        list.souce_repeat = true;

        await list.solvePromis();
        // window.clearTimeout(clock2);
        // }, 400);
        return;
        // setState({});
    }
    // 处理标题
    handleTitle(str = "") {
        return str.split(".")[0];
    }
    render() {
        const { router, setState, list } = this.props;
        const {
            headArr,
            typeChosed,
            navId,
            chooseAll,
            previewObj: { title }
        } = list;
        const listType = list.listType();
        let dataLength = 0;
        if (navId === "") {
            // 更新
            list.updateShowItems();
            dataLength = list.showItems.length;
        } else {
            dataLength = list.listStorage().items.length;
        }
        // 路由相关
        const isEntry = router.isMode("entry");
        const isList = router.isMode("list");
        const isChoose = router.isMode("choose");
        const isPreview = router.isMode("preview");

        // 标题
        const titleTxt = isEntry ? formatMsg("entry_title") : isChoose ? formatMsg("mutlti_choose_title") : "";
        return (
            <Fragment>
                <div className={`${styles["header"]}`}>
                    {/* 左箭头 */}
                    <div className={`${styles["leftArrow"]}`} onTouchStart={this.goBack.bind(this)}>
                        {/* <Iconfont type="icon-arrow-left" /> */}
                        <img src={LeftArrow} alt="" />
                    </div>

                    {/* 菜单切换按钮 */}
                    <div className={`${styles["tabButton"]}`} style={{ display: isList ? "flex" : "none" }}>
                        <div className={`${styles["txtBox"]}`} data-toggle={0}>
                            {headArr.map((head, i) => (
                                <Fragment key={head.id || "item" + i}>
                                    <input type="radio" name="ctrlSlide" className={styles["ctrlSlide"]} defaultChecked={i === 0} />
                                    <div className={`${styles["txt"]}`} onTouchStart={e => this.headerBtnClick(e, i, setState)} data-toggle={i}>
                                        {formatMsg(head.title)}
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                        <div className={`${styles["slideBox"]}`}></div>
                    </div>
                    {/* 标题 */}
                    <div className={`${styles["title"]}`} style={{ display: !isList ? "block" : "none" }}>
                        {isPreview ? this.handleTitle(title) : titleTxt}
                    </div>

                    {/* 右边icons */}
                    <div className={styles["iconsBox"]} style={{ display: isList ? "flex" : "none" }}>
                        {/* 上传 */}
                        <div
                            style={{ display: list.operateIndex === 0 ? "flex" : "none" }}
                            className={`${styles["addPicIcon"]}`}
                            onTouchStart={() => {
                                setState({ stopAudio: true }, false);
                                // 清除队列
                                const inputDom = document.getElementsByClassName(styles["upload"])[0];
                                inputDom["value"] = null;
                            }}
                        >
                            <input type="file" accept={listType + "/*"} multiple className={styles["upload"]} onChange={this.upload.bind(this)} />
                            {typeChosed === 0 ? <img src={IconAddPic} alt="" /> : <img src={IconAddAudio} alt="" />}
                        </div>
                        {/* 多选 */}
                        <div
                            className={`${styles["multiChose"]}`}
                            onTouchStart={e => (dataLength === 0 ? () => {} : this.multiChoseClick(e))}
                            style={{ opacity: dataLength === 0 ? "0.2" : "1" }}
                        >
                            {<img src={MultiChose} alt="" />}
                        </div>
                    </div>
                    {/* 全选icon */}
                    <div className={styles["confirm"]} style={{ display: isChoose ? "block" : "none" }} onTouchStart={this.chooseAllClick.bind(this)}>
                        {chooseAll ? <img src={IconConfirm} /> : <img src={IconFinish} alt="" />}
                    </div>
                </div>
                <div className={styles["headerPlace"]}></div>
            </Fragment>
        );
    }
}

export default Header;
