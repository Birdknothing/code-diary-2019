import React, { Component } from "react";
import styles from "./index.scss";

class Preview extends Component {
    props: any;
    // 删除选中的或取消收藏
    async delChosed({ id, ndr_id }) {
        const { dispatch, list, setState, getMore } = this.props;
        const headInfo = list.headInfo();
        const listType = list.listType();
        const whichMode = headInfo.id;
        const listStorage = list.listStorage();

        // 取消删除事件
        list.deleteEvent = false;

        const idOrNdrId = whichMode === "list" ? id : ndr_id;
        const success = await dispatch({
            type: "list/delete",
            payload: [idOrNdrId],
            lib: listType,
            mode: whichMode
        });

        // ui删除
        if (success) {
            // 列表删除或取消收藏成功提示
            setState({ showMsg: true, msgIndex: whichMode === "list" ? 3 : 0 }, false);
        } else {
            // 列表删除失败提示
            setState({ showMsg: true, msgIndex: whichMode === "list" ? 5 : 6 }, false);
        }
        // 返回后显示删除的效果
        listStorage.reset();
        await getMore();
    }

    render() {
        const { list } = this.props;
        const {
            previewObj: { location, id, ndr_id },
            deleteEvent
        } = list;
        console.log('preview render');
        console.log(deleteEvent);
        
        
        // 删除事件
        if (deleteEvent) {
            this.delChosed({ id, ndr_id });
        }
        return (
            <div className={styles["preview"]}>
                <div className={styles["pic"]}>
                    <img src={location} alt="" />
                </div>
            </div>
        );
    }
}

export default Preview;
