import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import data from "./model";
const setState = () =>
    ReactDOM.render(
        <React.StrictMode>
            <App setState={setState} setTitle={val => (data.title = val)} />
        </React.StrictMode>,
        document.getElementById("root")
    );

setState();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
