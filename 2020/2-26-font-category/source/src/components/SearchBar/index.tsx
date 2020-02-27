import React, { Component } from "react";
import { formatMsg } from "@/locales";
import { IconSearch, CancelIcon } from "@/components/IconFont/index";
import styles from "./index.scss";

class SearchBar extends Component {
  props: any;
  state = {
    showDel: false,
    focused: true,
    kwd: ""
  };
  // 确认
  confirm(keyword) {}
  // 删除
  delClick(e) {
    e.currentTarget.previousElementSibling.children[0].children[0].value = "";
    this.setState({ showDel: false });
    this.confirm("");
  }
  render() {
    console.log("search render");

    return (
      <div className={styles["main"]}>
        <div className={styles["searchBar"]}>
          <div className={styles["searchIcon"]}>
            <IconSearch />
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
                placeholder={"请输入关键字"}
                defaultValue={this.state.kwd}
                onFocus={() => {
                  if (!this.state.showDel) {
                    this.setState({ showDel: true });
                  }
                }}
                onKeyDown={e => {
                  e.keyCode === 13 &&
                    this.confirm.call(this, e.currentTarget.value);
                }}
              />
            </form>
          </div>
            {/* <img src={CancelIcon} alt="" /> */}
            {/* <CancelIcon /> */}
        </div>
      </div>
    );
  }
}
export default SearchBar;
