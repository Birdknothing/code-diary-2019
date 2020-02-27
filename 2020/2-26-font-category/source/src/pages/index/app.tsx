import dva, { connect } from "dva";
import createLoading from "dva-loading";
import routedDOM from "./router";
import list from "./models/list";
import "@babel/polyfill";

const app = dva();
app.use(createLoading());
app.router(({ history, app }) => {
  return routedDOM({ history });
});
app.model(list);
app.start("#app");
