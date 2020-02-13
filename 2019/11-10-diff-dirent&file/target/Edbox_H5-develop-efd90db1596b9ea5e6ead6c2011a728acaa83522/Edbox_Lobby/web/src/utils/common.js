const windowHost = window.location.host;
const controlUrlDev = "http://component.edbox-dev.101.com:8090/editor/pc_widget/";

export const ServerKey = windowHost.indexOf('192.') > -1 || windowHost.indexOf('localhost') > -1 ? "Dev": window.Edbox.ServerKey ;

export const controlUrl = windowHost.indexOf('192.') > -1|| windowHost.indexOf('localhost') > -1 ? controlUrlDev :'//' + windowHost + '/editor/pc_widget/' ;
