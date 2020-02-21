import React from "react";
import { formatMsg } from "@/locales";
import styles from "./index.scss";

const Modal: any = props => {
    const { list, setState } = props;
    const { showModal: show } = list;
    const type = list.modalType();
    const listType = list.listType();
    const hintType = listType === "pic" ? "pic_modal_del_hint" : listType === "audio" ? "audio_modal_del_hint" : "";
    const noStorageHintType = listType === "pic" ? "entry_no_storage_pic" : listType === "audio" ? "entry_no_storage_audio" : "";
    const modals = {
        no_storage: [formatMsg(noStorageHintType), formatMsg("entry_no_storage_cancel"), formatMsg("entry_no_storage_open")],
        del_from_gallery: [formatMsg(hintType), formatMsg("pic_modal_del_cancel"), formatMsg("pic_modal_del_confirm")]
    };

    const modalMsg = modals[type];

    const rightClick = e => {
        if (type === "del_from_gallery") {
            // 通知列表页删除事件
            setState({ deleteEvent: true, showModal: false });
        }
    };
    const leftClick = e => {
        // 取消删除
        setState({ showModal: false });
    };
    return (
        <div className={styles["modal"]} style={{ display: show ? "block" : "none" }}>
            <div className={styles["msgBox"]}>
                <div className={styles["hint"]}>
                    <div className={styles["hintLine"]}>{modalMsg[0]}</div>
                </div>
                <div className={styles["chose"]}>
                    <div className={styles["left"]} onTouchStart={leftClick}>
                        {modalMsg[1]}
                    </div>
                    <div className={styles["right"]} onTouchStart={rightClick}>
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
