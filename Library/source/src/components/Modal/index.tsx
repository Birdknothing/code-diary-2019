import React, { useState } from "react";
import { formatMsg } from "@/locales";
import styles from "./index.scss";

const Modal: any = props => {
    const { type, show, setState } = props;
    // setIfShow(show);

    // const [modals, setModals] = useState({
    //     test: [
    //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta tenetur quos velit voluptate nisia dolores architecto totam error quisquam iure provident molestiae recusandae vitae illo, verodebitis aperiam accusantium?",
    //         "Cancel",
    //         "Opening"
    //     ]
    // });
    console.log("modal return");

    const modals = {
        no_storage: [
            formatMsg("entry_no_storage"),
            formatMsg("entry_no_storage_cancel"),
            formatMsg("entry_no_storage_open")
        ],
        del_from_gallery: [
            formatMsg("pic_modal_del_hint"),
            formatMsg("pic_modal_del_cancel"),
            formatMsg("pic_modal_del_confirm")
        ]
    };

    const modalMsg = modals[type];

    const rightClick = e => {
        if (type === "del_from_gallery") {
            // 通知列表页删除事件
            setState({ delChosed: true, showModal: false });
        }
    };
    return (
        <div className={styles["modal"]} style={{ display: show ? "block" : "none" }}>
            <div className={styles["msgBox"]}>
                <div className={styles["hint"]}>
                    <div className={styles["hintLine"]}>{modalMsg[0]}</div>
                </div>
                <div className={styles["chose"]}>
                    <div className={styles["left"]} onClick={() => setState({ showModal: false })}>
                        {modalMsg[1]}
                    </div>
                    <div className={styles["right"]} onClick={rightClick}>
                        {modalMsg[2]}
                    </div>
                </div>
            </div>
            <div
                className={styles["curtain"]}
                onTouchStart={e => {
                    // e.preventDefault();
                    e.stopPropagation();
                }}
            ></div>
        </div>
    );
};

export default Modal;
