// 此组件不会被加载
import React from "react";
import styles from "./index.scss";
import { UploadPrivateAssetInfo } from "@/services";
import { logGreen, logRed, logBlue, plainObj, $ } from "@/utils";
interface jqDom {
    el: any;
    main: any;
    $log: any;
    clock: any;
    clicktime: any;
}
const jqdom: jqDom = {
    main: {
        el: "",
        config: {
            canmove: false,
            start: 0,
            end: 0,
            top: 0
        }
    },
    el: "",
    $log: "",
    clock: "",
    clicktime: 0
};
const Test = props => {
    const { setState, router } = props;
    return (
        <ul
            className={styles.test}
            ref={el => (jqdom.main.el = el)}
            onClick={e => {
                jqdom.clicktime += 1;
                jqdom.clock = setTimeout(() => {
                    const h = parseInt($(jqdom.main.el).css("height"));
                    if (jqdom.clicktime === 2) {
                        if (h > 40) {
                            $(jqdom.main.el).css({ height: 40, width: 40 });
                        } else {
                            $(jqdom.main.el).css({ height: "60vh", width: "100%" });
                        }
                    }
                    jqdom.clicktime = 0;
                }, 400);
            }}
            onTouchStart={e => {
                const $main = $(jqdom.main.el);
                const { config } = jqdom.main;
                config.top = parseInt($main.css("top"));
                config.start = e.touches[0].pageY;
                config.canmove = true;
            }}
            onTouchMove={e => {
                const $main = $(jqdom.main.el);
                const { config } = jqdom.main;
                if (config.canmove) {
                    $main.css("top", config.top + e.touches[0].pageY - config.start + "px");
                }
            }}
            onTouchEnd={e => {
                const { config } = jqdom.main;
                config.canmove = false;
            }}
        >
            <li
                onClick={e => {
                    setState({ showModal: true, modalIndex: 1 });
                }}
            >
                弹出modal
            </li>
            <li>
                <span
                    onClick={e => {
                        setState({ msgIndex: 0, showMsg: true });
                        e.stopPropagation();
                    }}
                >
                    弹出msg
                </span>
            </li>
            <li>
                <span
                    onClick={e => {
                        router.tabMode("choose");
                        setState({ showOperate: true, operateIndex: 1 });
                    }}
                >
                    多选操作面板
                </span>
            </li>
            <li
                ref={el => (jqdom.el = el)}
                className={styles["upload"]}
                onDragOver={e => {
                    e.preventDefault();
                }}
                onDragEnd={e => {
                    e.preventDefault();
                }}
                onDrop={async function(e) {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    const { name, size, type } = file;
                    testLog(name, " ", size, " ", type);
                    const category = type.slice(0, 5) === "audio" ? "Audio" : "Image";
                    const uploadObj = {
                        category,
                        custom_properties: "",
                        description: "ceshi",
                        file,
                        title: name,
                        size
                    };
                    // const result = await UploadPrivateAssetInfo(uploadObj);
                    // $(jqdom.el).html(plainObj(result));
                    // setTimeout(() => {
                        // $(jqdom.el).html("上传文件");
                    // }, 2000);
                }}
            >
                上传文件
            </li>
            <li className={styles["testlog"]}>
                打印：
                <span onClick={() => jqdom.$log.html("")}>+</span>
                <div className={styles["log"]} ref={el => (jqdom.$log = $(el))}></div>
            </li>
        </ul>
    );
};
const testLog = function(...str) {
    jqdom.$log && jqdom.$log.html((ind, originStr) => originStr + "<br />" + str.join(""));
};
const clearLog = function() {
    jqdom.$log && jqdom.$log.html("");
};
// export { Test, testLog, clearLog };
