import React from "react";
import ReactDOM from "react-dom";
import "@babel/polyfill";
import pic from "../test.jpg";
import test from "./test";
import { add } from "./util";
import "./test.scss";
import { BrowserRouter, Route } from "react-router-dom";
console.log(add(1, 2));
const m = new Promise(res => {
  setTimeout(res, "a", 2000);
});
test.log();
function getJQ() {
  return import(/* webpackPrefetch: true */ "./async.js").then(
    ({ default: _ }) => {
      _.test();
    }
  );
}
function getJQ2() {
  return import(/* webpackChunkName: "async11" */ "./async2.js").then(
    ({ default: _ }) => {
      _.test();
    }
  );
}
const W = () => (
  <BrowserRouter>
    <div
      className="test"
      onClick={() => {
        getJQ();
        getJQ2();
      }}
    >
      <Route path="/" exact component={() => "home"} />
      <Route path="/test" exact component={() => "test"} />
    </div>
  </BrowserRouter>
);
console.log("this is no to a");
console.log("fi");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(registration => {
        console.log("SW registered: ", registration);
      })
      .catch(registrationError => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

ReactDOM.render(<W />, app);
