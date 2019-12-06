import React, { Fragment, useState, useEffect } from "react";
import styles from "./index.scss";
import failPicSrc from "../../web/StatusLoading/node_modules/@/assets/connect_fail.png";
import { formatMessage } from "../../web/StatusLoading/node_modules/umi/locale";
// mobile mobile
// src:图片链接
// scale:动画缩放
// reload:点击重新加载按钮
// pageTab: 开启游戏列表页切换时的loading
// slideUP: 列表上滑loading
// timeout: 超时时间，默认60s
// fullWindow: 全屏loading

export default props => {
    // timeout:sdk所有请求默认timeout为60s
    const {
        src,
        scale,
        reload,
        timeout = 60000,
        pageTab,
        touchTrigger = true,
        backgroundColor = "#fff",
        slideUp,
        fullWindow,
        height
    } = props;
    const [loaded, setLoaded] = useState(false);
    const [overTime, setOverTime] = useState(false);
    let clock;

    const initClock = function() {
        clearTimeout(clock);
        return setTimeout(() => {
            setOverTime(true);
            clearTimeout(clock);
        }, timeout);
    };

    useEffect(() => {
        clock = initClock();
        return () => {
            clearTimeout(clock);
        };
    }, []);

    const img = new Image();
    img.src = src;
    img.oncomplete = function() {
        setLoaded(true);
    };

    // 切换页面时的无法获取数据提示图
    const failPic =
        pageTab || fullWindow ? (
            <div className={styles.failPic}>
                <img src={failPicSrc} />
            </div>
        ) : null;

    // 基础,默认撑满父元素高度
    const loadBoxStyle = {
        zIndex: 10,
        backgroundColor,
        width: "100%",
        height: "100%",
        overflow: "hidden"
    };

    if (slideUp) {
        Object.assign(loadBoxStyle, { height: 100 });
    }
    // if (pageTab) {
    //   Object.assign(loadBoxStyle, { height: '100%' });
    // }
    if (fullWindow) {
        Object.assign(loadBoxStyle, { position: "fixed" });
    }
    if (height) {
        Object.assign(loadBoxStyle, { height });
    }

    const triggerReload = () => {
        setOverTime(false);
        // 重启定时器
        clock = initClock();
        typeof reload === "function" && reload();
    };

    const onTouchTrigger = touchTrigger ? triggerReload : () => {};

    return src && loaded ? (
        <Fragment>
            <img src={src} alt="" />
        </Fragment>
    ) : (
        <div className={styles.loadbox} style={loadBoxStyle}>
            {!overTime ? (
                <div className={styles.load} style={{ transform: `scale(${scale || 1})` }}>
                    {Array.from({ length: 4 }).map((ele, i) => (
                        <span className={styles.loaditem} key={"pic" + i}>
                            <i className={styles.l1}></i>
                            <i className={styles.l2}></i>
                            <i className={styles.l3}></i>
                            <i className={styles.l4}></i>
                        </span>
                    ))}
                </div>
            ) : (
                // 超时失败提示
                <div
                    className={pageTab || fullWindow ? styles.fail_pageTab : styles.fail_slide}
                    onTouchStart={onTouchTrigger}
                >
                    {failPic}
                    <div className={styles.failTxt}>
                        <span className={styles.loadhint}>{formatMessage({ id: "load_hint_word" })}</span>
                        <span className={styles.reload}>
                            {formatMessage({
                                id: pageTab || fullWindow ? "page_reload_word" : "slide_reload_word"
                            })}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
