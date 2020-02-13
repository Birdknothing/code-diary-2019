// 接口服务器根目录
const {Edbox,location} = window;
const protocol = location.protocol;
let lobbyBaseUrl = protocol + '//studio.edbox-dev.101.com';


switch (Edbox.ServerKey) {
  // 开发环境
  case 'Dev':
  lobbyBaseUrl = protocol + '//studio.edbox-dev.101.com';
    break;

  // QA环境
  case 'QA':
    lobbyBaseUrl = protocol + '//studio.edbox-qa.101.com';
    break;

  // 特性环境
  case 'Feature':
    lobbyBaseUrl = protocol + '//studio.edbox-feature.101.com';
    break;

  // 国内预生产服务器域名
  case 'BetaCN':
    lobbyBaseUrl = protocol + '//studio.edbox-beta-cn.101.com';
    break;

  // 海外预生产服务器域名
  case 'Beta':
    lobbyBaseUrl = protocol + '//studio.edbox-beta.101.com';
    break;

  // 国内服务器域名
  case 'CN':
    lobbyBaseUrl = protocol + '//studio.edbox-cn.101.com';
    break;

  // 美国服务器域名
  case 'US':
    lobbyBaseUrl = protocol + '//studio.edbox.101.com';
    break;

  default:
    lobbyBaseUrl = protocol + '//studio.edbox-dev.101.com';
}


export default lobbyBaseUrl;
