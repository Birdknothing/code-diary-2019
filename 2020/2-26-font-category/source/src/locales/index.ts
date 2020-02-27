import cn from "./cn";
import us from "./us";
const _formatMsg = {
  env: "cn",
  cn,
  us,
  getMsg(id = "") {
    if (!this[this.env][id]) {
      return "";
    }
    return this[this.env][id];
  },
  initLocale() {
    let Language = "SimplifiedChinese";
    switch (Language) {
      case "SimplifiedChinese":
        this.setLocale("cn");
        break;
      case "English":
        this.setLocale("us");
        break;
      case "TraditionalChinese_TW":
        this.setLocale("tw");
        break;
      case "TraditionalChinese":
        this.setLocale("hk");
        break;
      default:
        this.setLocale("cn");
    }
  },
  setLocale(env) {
    if (!["cn", "us", "hk", "tw"].includes(env)) return;
    this.env = env;
  },
  getLocale() {
    return this.env;
  }
};
const formatMsg = _formatMsg.getMsg.bind(_formatMsg);
const setLocale = _formatMsg.setLocale.bind(_formatMsg);
const getLocale = _formatMsg.getLocale.bind(_formatMsg);
const initLocale = _formatMsg.initLocale.bind(_formatMsg);
export { formatMsg, setLocale, getLocale, initLocale };
