import React from "react";
import { Router, Route, Switch } from "dva/router";
import FontPage from "@/components/FontPage";
import ErrPage from "@/pages/404";
import List from "@/components/List";
import Preview from "@/components/Preview";
import Main from "./index";
import { initLocale } from "@/locales";

// 路由配置,控制注入
const routerConfig = {
    "/$": FontPage,
    "/(pic|audio)(/choose)?$": List,
    "/(pic|audio)(/choose)?/preview$": Preview
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
            // alert(modeName + " " + pname);
            switch (modeName) {
                case "entry":
                    return pname === "/";
                case "list":
                    return pname === "//pic" || pname === "//audio";
                case "pic":
                    return pname.slice(0, 5) === "//pic";
                case "audio":
                    return pname.slice(0, 7) === "//audio";
                case "choose":
                    return pname.slice(-7) === "/choose";
                case "preview":
                    return pname.slice(-8) === "/preview";
                default:
                    console.error("no match mode");
                    return false;
            }
        },
        tabMode(modeName) {
            let pname = this.history.location.pathname;
            switch (modeName) {
                case "pic":
                    this.history.push(pname + "/pic");
                    return;
                case "audio":
                    this.history.push(pname + "/audio");
                    return;
                case "choose":
                    this.history.push(pname + "/choose");
                    return;
                case "preview":
                    this.history.push(pname + "/preview");
                    return;
                default:
                    console.error("no mode matched to tab");
                    return;
            }
        }
    };

    // 初始语言环境
    initLocale();
    return (
        // router只会挂载一次，即return一次
        <Router history={history}>
            <Switch>
                <Route path="*" exact component={props => <Main {...props} router={router} getChildByRoute={getComByRoute} />} />
            </Switch>
        </Router>
    );
};
