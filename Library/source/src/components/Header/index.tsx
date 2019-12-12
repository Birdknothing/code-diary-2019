import React, { Component, Fragment } from "react";
// import router from 'umi/router';
// import PropsTypes from 'prop-types';
import { IconAddPic, LeftArrow, MultiChose, IconFinish } from "@/components/FontIcon";
import { formatMsg } from "@/locales";
import styles from "./index.scss";
import { connect } from "dva";

@connect(() => ({}))
class Header extends Component {
    props: any;
    // 按钮切换,左列表，右收藏
    headerBtnClick(e, index, setState) {
        const textDom = e.currentTarget;
        textDom.previousElementSibling.checked = true;
        textDom.parentNode.dataset.toggle = textDom.dataset.toggle;
        setState({ headChosed: index, operateIndex: index });
    }
    // 上传图片
    async upload(e) {
        const { dispatch, setState } = this.props;
        const file = e.currentTarget.files[0];
        const { name, size } = file;
        const uploadObj = {
            category: "Image",
            custom_properties: "",
            description: "ceshi",
            file,
            title: name,
            size
        };
        const success = await dispatch({ type: "list/upload", payload: uploadObj });
        success && setState({ showMsg: true, msgIndex: 2 });
    }
    render() {
        console.log("header render");

        const { router, setState, headArr } = this.props;
        const isEntry = router.isMode("entry");
        const isList = router.isMode("list");
        const isChoose = router.isMode("choose");

        // 标题
        const titleTxt = isEntry ? formatMsg("entry_title") : isChoose ? formatMsg("mutlti_choose_title") : "";
        return (
            <Fragment>
                <div className={`${styles["header"]}`}>
                    {/* 左箭头 */}
                    <div
                        className={`${styles["leftArrow"]}`}
                        onClick={() => {
                            router.goBack();
                            setState({ showOperate: false });
                        }}
                    >
                        {/* <Iconfont type="icon-arrow-left" /> */}
                        <img src={LeftArrow} alt="" />
                    </div>

                    {/* 菜单切换按钮 */}
                    <div className={`${styles["tabButton"]}`} style={{ display: isList ? "flex" : "none" }}>
                        <div className={`${styles["txtBox"]}`} data-toggle={0}>
                            {headArr.map((head, i) => (
                                <Fragment key={"textBox" + i}>
                                    <input type="radio" name="ctrlSlide" className={styles["ctrlSlide"]} defaultChecked={i === 0} />
                                    <div className={`${styles["txt"]}`} onClick={e => this.headerBtnClick(e, i, setState)} data-toggle={i}>
                                        {head.title}
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                        <div className={`${styles["slideBox"]}`}></div>
                    </div>
                    {/* 标题 */}
                    <div className={`${styles["title"]}`} style={{ display: isEntry || isChoose ? "block" : "none" }}>
                        {titleTxt}
                    </div>

                    {/* 右边icons */}
                    <div className={styles["iconsBox"]} style={{ display: isList ? "flex" : "none" }}>
                        {/* 添加 */}
                        <div className={`${styles["addPicIcon"]}`}>
                            <input type="file" className={styles["upload"]} onChange={this.upload.bind(this)} />
                            <img src={IconAddPic} alt="" />
                        </div>
                        {/* 多选 */}
                        <div
                            className={`${styles["multiChose"]}`}
                            onTouchStart={e => {
                                router.tabMode("choose");
                                setState({ showOperate: true, operateType: "gallery" });
                            }}
                        >
                            <img src={MultiChose} alt="" />
                        </div>
                    </div>
                    {/* 确认icon */}
                    <div className={styles["confirm"]} style={{ display: isChoose ? "block" : "none" }}>
                        <img src={IconFinish} alt="" />
                    </div>
                </div>
                <div className={styles["headerPlace"]}></div>
            </Fragment>
        );
    }
}

//<div className={`${styles["searchIcon"]}`}>
//<IconSearch />
//</div>
export default Header;
