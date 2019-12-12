import React, { useState, useEffect, createRef } from "react";
import styles from "./index.scss";
import { formatMsg } from "@/locales";
import { IconHeart } from "../FontIcon";

const Msg: any = props => {
    console.log("msg return");
    const { type, show, resetState } = props;
    // const msgs = {
    //     cancel_collect: formatMsg("cancel_collect"),
    //     no_chosed: formatMsg("no_chosed"),
    //     upload_success: formatMsg("upload_success"),
    //     del_success: formatMsg("del_success"),
    //     not_yet: formatMsg("not_yet")
    // };
    
    
    if (!show) {
        return "";
    }
    // 消息只显示一次
    resetState({ showMsg: false });

    const Tmp = () => {
        const ref = createRef();
        useEffect(() => {
            const tdom = ref.current;
            tdom && (tdom["style"].display = "flex");
            const c1 = setTimeout(() => {
                clearInterval(c1);
                tdom && (tdom["style"].opacity = 0);
            }, 1000);
            const c2 = setTimeout(() => {
                tdom && (tdom["style"].display = "none");
                tdom && (tdom["style"].opacity = 1);
                clearInterval(c2);
            }, 3000);
        }, [show]);
        return (
            // 任何时候Msg重新执行，ref都会变null
            <div className={styles["alertBox"]} ref={ref as any}>
                {type === "cancel_collect" && (
                    <div className={styles["heart"]}>
                        <img src={IconHeart} alt="" />
                    </div>
                )}
                <div className={styles["txt"]}>{formatMsg(type) || ""}</div>
            </div>
        );
    };
    // setIfshow(false);
    return <Tmp />;
};

export default Msg;
