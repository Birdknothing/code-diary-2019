const windowHost = window.location.host;
const controlUrlDev = "http://component.edbox-dev.101.com:8090/editor/mobile_widget/";
const controlUrlQA = "http://component.edbox-qa.101.com:8090/editor/mobile_widget/";

export const ServerKey = windowHost.indexOf('dev') > 0 ? "Dev": windowHost.indexOf('qa') > 0 ? "QA" : "Dev" ;
export const controlUrl = ServerKey === "Dev" ? controlUrlDev : ServerKey === "QA"? controlUrlQA : controlUrlDev ;