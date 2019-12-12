import React, { Component, PureComponent, Fragment } from "react";
import { connect } from "dva";
import { formatMsg } from "@/locales";
// import PropsTypes from 'prop-types';
import styles from "./index.scss";

class NavBar extends PureComponent {
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
        itemWidth: 142
    };
    initState(arr) {
        this.state.length = arr.length;
        this.state.slideIndex = Math.floor(arr.length / 2) + 1;
    }
    getVW(width) {
        return width / 7.5 + "vw";
    }
    // 点击标签
    navItemClick(e, tagId) {
        const tdom = e.currentTarget;
        const index = +tdom.dataset.slide;
        const { slideIndex, itemWidth, length, showLength } = this.state;
        const { getMore, setState, storage } = this.props;

        // 通知切换标签
        storage.reset();
        setState({ navId: tagId === "all" ? "" : [tagId] });
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
        tdom.parentNode.style.transform = slideDistance;
        // 滑条位移
        tdom.parentNode.children[0].children[0].style.transform = `translate3d(${this.getVW(index * itemWidth)},0,0)`;
    }
    render() {
        console.log("navbar render");
        const { tagsArr } = this.props;
        const { initArr } = this.state;
        initArr.splice(initArr.length, 0, ...(tagsArr || []));
        this.initState(tagsArr);

        return (
            <div className={styles["nav"]}>
                <div className={styles["navSlide"]} data-slide_block={0}>
                    <div className={styles["slideBar"]} data-slide_bar={0}>
                        <div className={styles["slideBarItem"]}>
                            {/* 滑动条 */}
                            <div className={styles["slideitem"]}></div>
                        </div>
                    </div>
                    {initArr.map((data, i) => (
                        <Fragment key={"navitem" + i}>
                            <input
                                type="radio"
                                name="navCtrl"
                                className={styles["navCtrl"]}
                                // 默认选中标签all
                                defaultChecked={i === 0}
                            />
                            <div className={styles["navItem"]} data-slide={i} onClick={e => this.navItemClick.call(this, e, data["id"])}>
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
