import styles from "./index.scss";
import React from "react";
interface Mprops {
    test: string;
    testClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
const M = (props: Mprops) => {
    const { test, testClick } = props;
    return (
        <div style={{ width: 500, height: 500 }} className={styles.test}>
            <img style={{ width: "100%", height: "100%" }} src="./bg.jpg" />
            <br />
            {test}
            <br />
            <button onClick={testClick}></button>
        </div>
    );
};
// export default M;
Object.assign(window, { M });
