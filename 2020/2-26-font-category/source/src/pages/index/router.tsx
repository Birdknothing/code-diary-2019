import React from "react";
import { Router, Route, Switch } from "dva/router";
import { initLocale } from "@/locales";
import Fontpage from "./parts/fontpage";
import ErrPage from "@/404";
import Main from "./index";

// 路由配置,控制注入
const routerConfig = {
  "/$": Fontpage
};

function getComByRoute(pathname) {
  for (let route in routerConfig) {
    if (new RegExp(route).test(pathname)) {
      return routerConfig[route];
    }
  }
  return ErrPage;
}
export default ({ history }) => {
  const router = {
    history,
    goBack: history.goBack.bind(history),
    push: history.push.bind(history),
    isMode(modeName) {
      const pname = this.history.location.pathname;
      switch (modeName) {
        case "test":
          return pname.slice(0, 5) === "/test";
        default:
          console.error("no match mode");
          return false;
      }
    },
    tabMode(modeName) {
      let pname = this.history.location.pathname;
      switch (modeName) {
        case "test":
          this.history.push(pname + "/test");
          return;
        default:
          console.error("no mode matched to tab");
          return;
      }
    }
  };

  initLocale();
  return (
    <Router history={history}>
      <Switch>
        <Route
          path="*"
          exact
          component={props => (
            <Main {...props} router={router} getChildByRoute={getComByRoute} />
          )}
        />
      </Switch>
    </Router>
  );
};
