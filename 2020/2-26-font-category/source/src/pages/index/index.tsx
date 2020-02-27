import React, { Component } from "react";
import { connect } from "dva";
import styles from "./index.scss";

@connect(({ list }) => ({ list }))
class Main extends Component {
  props: any;
  render() {
    const {
      location: { pathname },
      getChildByRoute
    } = this.props;
    const Target = getChildByRoute(pathname);
    console.log("main render");
    return (
      <div className={styles["basic"]}>
        <Target />
      </div>
    );
  }
}
export default Main;
