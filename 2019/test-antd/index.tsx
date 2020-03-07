import React from "react";
//@ts-ignore
import ReactDOM from "react-dom";
import { message } from "antd";
import { Calendar } from "antd";

//@ts-ignore
function onPanelChange(value, mode) {
  console.log(value, mode);
}
const W = () =>
  //prettier-ignore
  //@ts-ignore
  <div className="site-calendar-demo-card"><Calendar fullscreen={false} onPanelChange={onPanelChange} />
  </div>;
//@ts-ignore
ReactDOM.render(<W />, document.getElementById("app"));
