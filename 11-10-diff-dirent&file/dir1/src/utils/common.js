
const controlUrlDev = "http://component.edbox-dev.101.com:8090/editor/pc_widget/";
export const toolIframeUrl = "http://192.168.111.27:8000";
export const windowHost = window.location.host.indexOf('192.') > -1 || window.location.host.indexOf('localhost') > -1 ? "component.edbox-dev.101.com:8090": window.location.host;
export const ServerKey = windowHost.indexOf('192.') > -1 || windowHost.indexOf('localhost') > -1 ? "Dev": window.Edbox.ServerKey ;
export const controlUrl = windowHost.indexOf('192.') > -1|| windowHost.indexOf('localhost') > -1 ? controlUrlDev :'//' + windowHost + '/editor/pc_widget/' ;
export const ownIframeUrl = "http://192.168.211.44:19001/Pages/Loading/Game/index.html";
export const ImageControlUrl = "http://localhost:8001/?Page=http://192.168.52.59:19004#/gameEdit" ;
export const AudioControlUrl = "http://172.18.132.182:8000/Edbox_TextSelector" ;
