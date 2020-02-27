import React from "react";
import ReactDOM from "react-dom";
import styles from "./test.scss";
const W = () => <div className={styles["basic"]}>page test</div>;
ReactDOM.render(<W />, document.getElementById("app"));
