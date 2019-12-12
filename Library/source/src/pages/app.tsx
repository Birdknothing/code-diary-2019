import dva, { connect } from "dva";
import createLoading from "dva-loading";
import routedDOM from "./router";
import fontpage from "@/models/fontpage";
import list from "@/models/list";

const app = dva();
app.use(createLoading());
// const MemoModal: any = memo(Modal);
// const MemoMsg:any = memo(Msg);
app.model(fontpage);
app.model(list);
app.model({
    namespace: "search",
    state: {
        engineListData: [
            // 搜索引擎下拉数据
            {
                icon: "icon-layers",
                englishName: "NDR",
                chinesename: "NDR"
            },
            {
                icon: "icon-baidu",
                englishName: "Baidu",
                chinesename: "百度"
            }
        ], // 下拉框数据
        selectedEngine: {
            icon: "icon-layers",
            englishName: "NDR",
            chinesename: "NDR"
        },
        isShowEngineList: false, // 显隐下拉框
        searchKey: "" // 搜索关键字
    },
    reducers: {},
    effects: {}
});
// const Test = connect(({ test }) => ({ test }))(props => {
//     console.log(props.dispatch === app["_store"].dispatch);
//     return <div className={styles.test}>test</div>;
// });
// router会给app和history
app.router(({ history, app }) => {
    return routedDOM({ history });
});

app.start("#app");
