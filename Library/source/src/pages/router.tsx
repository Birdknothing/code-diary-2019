import React from "react";
import { Router, Route, Switch } from "dva/router";
import FontPage from "@/components/FontPage";
import ErrPage from "@/pages/404";
import List from "@/components/List";
import Main from "./index";

// 路由配置,控制注入
const routerConfig = {
    "/$": FontPage,
    "/pic/*": props => (
        <div>
            <List {...props} />
        </div>
    )
};
function getComByRoute(pathname) {
    for (let route in routerConfig) {
        // console.log(new RegExp(route));
        if (new RegExp(route).test(pathname)) {
            return routerConfig[route];
        }
    }
    return ErrPage;
}
// 坑：dva的location是根据history生成的副本，(内部应是用的history.location = {})
// setTimeout(()=>{
//    console.log(`%c test ${history.location === location}, `,'color:red'); 
// },3000)
export default ({ history }) => {
    const router = {
        history,
        goBack: history.goBack.bind(history),
        push: history.push.bind(history),
        isMode(modeName) {
            const pname = this.history.location.pathname;
            switch (modeName) {
                case "entry":
                    return pname === "/";
                case "list":
                    return pname === "/pic" || pname === "/audio";
                case "choose":
                    return pname.slice(-7) === "/choose";
                default:
                    console.error("no match mode");
                    return false;
            }
        },
        tabMode(modeName) {
            const pname = this.history.location.pathname;
            switch (modeName) {
                case "choose":
                    this.history.push(pname + "/choose");
                    return;
                default:
                    console.error("no mode matched to tab");
                    return;
            }
        }
    };

    return (
        // router只会挂载一次，即return一次
        <Router history={history}>
            <Switch>
                <Route
                    path="*"
                    exact
                    component={props => <Main {...props} router={router} getChildByRoute={getComByRoute} />}
                />
            </Switch>
        </Router>
    );
};
