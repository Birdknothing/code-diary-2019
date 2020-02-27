import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import "@babel/polyfill";
import { BrowserRouter, Route } from "react-router-dom";

const W = () => (
  <BrowserRouter>
    <div
      className="test"
    >
      <Route path="/" exact component={() => "home"} />
      <Route path="/test" exact component={() => "test"} />
    </div>
  </BrowserRouter>
);
ReactDOM.render(<W />,app);

