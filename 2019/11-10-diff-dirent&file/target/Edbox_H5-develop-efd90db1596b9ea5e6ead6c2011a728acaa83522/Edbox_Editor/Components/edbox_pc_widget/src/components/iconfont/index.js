import { Icon } from 'antd';

const { Loader } = window;
const iconfontURL =
  Loader.ComponentRootPath + 'ThirdParty/iconfont/1.1.0/iconfont.js?v=' + new Date().getTime();
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconfontURL
  // scriptUrl:'//at.alicdn.com/t/font_1188697_2q6r2dz601q.js'
});

export default IconFont;
