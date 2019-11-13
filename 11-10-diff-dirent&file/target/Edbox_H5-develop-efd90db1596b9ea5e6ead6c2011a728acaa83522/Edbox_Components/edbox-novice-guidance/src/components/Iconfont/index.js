import { Icon } from 'antd';

const { Loader } = window;
const iconfontURL =
  Loader.ComponentRootPath + 'ThirdParty/iconfont/iconfont.js?v=' + new Date().getTime();
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconfontURL,
});

export default IconFont;
