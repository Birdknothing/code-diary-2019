import dva, { connect } from "dva";
import createLoading from "dva-loading";
import routedDOM from "./router";
import fontpage from "@/models/fontpage";
import list from "@/models/list";
import { promisify } from "@/services";

const app = dva();
app.use(createLoading());
// const MemoModal: any = memo(Modal);
// const MemoMsg:any = memo(Msg);
app.model(fontpage);
app.model(list);
// app.model({
//     namespace: "search",
//     state: {
//         engineListData: [
//             // 搜索引擎下拉数据
//             {
//                 icon: "icon-layers",
//                 englishName: "NDR",
//                 chinesename: "NDR"
//             },
//             {
//                 icon: "icon-baidu",
//                 englishName: "Baidu",
//                 chinesename: "百度"
//             }
//         ], // 下拉框数据
//         selectedEngine: {
//             icon: "icon-layers",
//             englishName: "NDR",
//             chinesename: "NDR"
//         },
//         isShowEngineList: false, // 显隐下拉框
//         searchKey: "" // 搜索关键字
//     },
//     reducers: {},
//     effects: {}
// });
// const Test = connect(({ test }) => ({ test }))(props => {
//     console.log(props.dispatch === app["_store"].dispatch);
//     return <div className={styles.test}>test</div>;
// });
// router会给app和history
app.router(({ history, app }) => {
    return routedDOM({ history });
});

// toDo Edbox无法通过msg传递
// function sendMsg(type, data = null) {
//     if (!window.parent) {
//         return;
//     }
//     var Datas = data;
//     var dataMsg = {
//         Type: type,
//         Datas: Datas
//     };
//     window.parent.postMessage(dataMsg, "*");
// }
// sendMsg("requireEdbox");
// window.addEventListener("message", async ({ data: { Type, Datas } }) => {
//     if (Type === "requireEdbox") {
//         window["Edbox"] = Datas;
//         // 测试dev环境
//         window["Edbox"].ServerKey = "Dev";
//         await promisify(window["Edbox"].Start)();
//         app.start("#app");
//     }
// });

// prettier-ignore
console.log(document.getElementsByTagName("head")[0].appendChild((()=>{const script=document.createElement("script");script.async=true;script.src="//cache.amap.com/h5/static/common/vconsole.min.js";return script;})()));
(async () => {
    // 测试用
    // 测试dev环境
    // window["Edbox"].ServerKey = "QA";
    await promisify(window["Edbox"].Start)();
    app.start("#app");
})();
