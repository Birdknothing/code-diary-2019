import React, { Component } from "react";
import { formatMsg } from "@/locales";
import { IconSearch, CancelIcon } from "@/components/FontIcon";
import styles from "./index.scss";
import list from "@/models/list";

class SearchBar extends Component {
    props: any;
    state = {
        showDel: false,
        focused: true,
        kwd: ""
    };
    componentDidMount() {
        const {
            list: { keyword }
        } = this.props;
        this.state.kwd = keyword;
        this.setState({});
    }
    // 确认
    confirm(keyword) {
        const { storage, getMore, list } = this.props;
        storage.reset();
        list.keyword = keyword;
        getMore();
        list.searching = true;
    }
    // 删除
    delClick(e) {
        e.currentTarget.previousElementSibling.children[0].children[0].value = "";
        this.setState({ showDel: false });
        this.confirm("");
    }
    render() {
        const { router } = this.props;
        console.log("search render");

        return (
            <div className={styles["main"]}>
                <div className={styles["searchBar"]}>
                    <div className={styles["searchIcon"]}>
                        <img src={IconSearch} alt="" />
                    </div>
                    <div className={styles["inputArea"]}>
                        <form
                            action=""
                            onSubmit={e => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                        >
                            <input
                                type="search"
                                placeholder={formatMsg(
                                    router.isMode("pic") ? "pic_search_holder" : router.isMode("audio") ? "audio_search_holder" : ""
                                )}
                                defaultValue={this.state.kwd}
                                onFocus={() => {
                                    if (!this.state.showDel) {
                                        this.setState({ showDel: true });
                                    }
                                }}
                                onKeyDown={e => {
                                    e.keyCode === 13 && this.confirm.call(this, e.currentTarget.value);
                                }}
                            />
                        </form>
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
