import React, { Component, Fragment } from "react";
import { formatMsg } from "@/locales";
import styles from "./index.scss";

class NavBar extends Component {
    props: any;
    state = {
        //全部
        initArr: [{ name: formatMsg("tag_all"), id: "all", type: -1 }],
        // navitem一共多少个
        length: 8,
        // 显示的navitem最多几个
        showLength: 5,
        // 从第几个开始滑动
        slideIndex: 4,
        // 滑块坐标
        showIndex: 0,
        // 滑块宽px
        itemWidth: 142,
        nowId: "all",
        barPos: "",
        blockPos: "",
        showNav: true
    };
    initUIState(items) {
        const { initArr } = this.state;
        this.state.length = items.length + initArr.length;
        this.state.slideIndex = Math.floor(this.state.length / 2) + 1;
    }
    getVW(width) {
        return width / 7.5 + "vw";
    }
    // 点击标签
    navItemClick(e, tagId) {
        // 防重复点击
        if (tagId === this.state.nowId) {
            return;
        }
        this.state.nowId = tagId;
        const tdom = e.currentTarget;
        const index = +tdom.dataset.slide;
        const { slideIndex, itemWidth, length, showLength } = this.state;
        const { setState, getMore, list } = this.props;

        // 通知切换标签,请求新标签下使用page,size等初始化后的数据
        setState({ navId: tagId === "all" ? "" : [tagId], stopAudio: true }, false);
        // 重新拿取
        list.listStorage().reset();
        getMore();
        // 字体颜色tab
        tdom.previousElementSibling.checked = true;
        const slideDistance = `translate3d(${(() => {
            if (index < slideIndex - 1) {
                return "0vw";
            }
            if (index > slideIndex + length - showLength - 2) {
                return this.getVW((showLength - length) * itemWidth);
            }
            return this.getVW((slideIndex - index - 2) * itemWidth);
        })()},0,0)`;
        // 滑块位移
        if (length > showLength) {
            tdom.parentNode.style.transform = slideDistance;
            list.tabBarInfo().blockPos = slideDistance;
        }
        // 滑条位移
        const leftDis = `translate3d(${this.getVW(index * itemWidth)},0,0)`;
        tdom.parentNode.children[0].children[0].style.transform = leftDis;
        list.tabBarInfo().chosedId = tagId;
        list.tabBarInfo().barPos = leftDis;
    }
    render() {
        console.log("navbar render");
        const { list } = this.props;
        const { operateIndex } = list;
        const tagStorage = this.props.list.tagStorage();
        let { items } = tagStorage;
        // 收藏页接口没有根据标签分类功能
        if (operateIndex === 1) {
            items = [];
            // document.getElementsByClassName(styles["nav"])[0]["style"].display = "none";
            this.state.showNav = false;
        } else {
            this.state.showNav = true;
        }
        const { showNav } = this.state;
        this.initUIState(items);

        const { chosedId, barPos, blockPos } = list.tabBarInfo();
        this.state.nowId = chosedId;
        this.state.barPos = barPos;
        this.state.blockPos = blockPos;
        return (
            <div className={styles["nav"]} style={{ display: showNav ? "block" : "none" }}>
                <div className={styles["navSlide"]} data-slide_block={0} style={{ transform: blockPos }}>
                    <div className={styles["slideBar"]} data-slide_bar={0}>
                        <div className={styles["slideBarItem"]} style={{ transform: barPos }}>
                            {/* 滑动条 */}
                            <div className={styles["slideitem"]}></div>
                        </div>
                    </div>
                    {
                        <Fragment key={"navitem0"}>
                            <input
                                type="radio"
                                name="navCtrl"
                                className={styles["navCtrl"]}
                                // 默认选中标签all
                                checked={"all" === this.state.nowId}
                            />
                            <div className={styles["navItem"]} data-slide={0} onTouchStart={e => this.navItemClick.call(this, e, "all")}>
                                {formatMsg("tag_all")}
                            </div>
                        </Fragment>
                    }
                    {items.map((data, i) => (
                        <Fragment key={data.id || "item" + i}>
                            <input type="radio" name="navCtrl" className={styles["navCtrl"]} checked={data["id"] === this.state.nowId} />
                            <div className={styles["navItem"]} data-slide={i + 1} onTouchStart={e => this.navItemClick.call(this, e, data["id"])}>
                                {data.name}
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
        );
    }
}
export default NavBar;
