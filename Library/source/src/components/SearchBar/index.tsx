import React, { Component } from "react";
import { formatMsg } from "@/locales";
// import PropsTypes from 'prop-types';
import { connect } from "dva";
import { IconSearch, CancelIcon } from "@/components/FontIcon";
import styles from "./index.scss";

class SearchBar extends Component {
    props: any;
    state = {
        showDel: false
    };
    // 确认
    confirm(e) {
        const { setState, storage } = this.props;
        storage.reset();
        setState({ keyword: e.currentTarget.value });
    }
    // 删除
    delClick(e) {
        e.currentTarget.previousElementSibling.children[0].value = "";
        this.setState({ showDel: false });
    }
    render() {
        console.log("searchbar render");
        return (
            <div className={styles["main"]}>
                <div className={styles["searchBar"]}>
                    <div className={styles["searchIcon"]}>
                        <img src={IconSearch} alt="" />
                    </div>
                    <div className={styles["inputArea"]}>
                        <input
                            type="text"
                            placeholder={formatMsg("pic_search_holder")}
                            onKeyDown={e => {
                                if (!this.state.showDel) {
                                    this.setState({ showDel: true });
                                }
                                e.keyCode === 13 && this.confirm(e);
                            }}
                        />
                    </div>
                    <div
                        className={styles["cancelBox"]}
                        style={{ display: this.state.showDel ? "block" : "none" }}
                        onTouchStart={this.delClick.bind(this)}
                    >
                        <img src={CancelIcon} alt="" />
                    </div>
                </div>
            </div>
        );
    }
}
export default SearchBar;
