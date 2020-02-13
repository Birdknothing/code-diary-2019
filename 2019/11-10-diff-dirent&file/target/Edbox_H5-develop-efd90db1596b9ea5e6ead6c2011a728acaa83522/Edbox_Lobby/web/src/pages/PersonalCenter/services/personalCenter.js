import request from '../../../utils/request';
import { stringify } from 'qs';
// import req from '../../utils/req'; // 使用req() 请求edbox方法的数据，requst()获取mock数据
//使用req() 请求edbox方法的数据，requst()获取mock数据
import req from '../../../utils/req'; // 使用req() 请求edbox方法的数据，requst()获取mock数据
const { Edbox } = window

export async function getPersonalInfo(params) { // 获取个人信息
  // return req(Edbox.GetFeedBacks, guid);
  // console.log('获取个人信息接口参数',stringify(params));

  /*
    接口注释说明:
    功能： 根据EbUserId，返回当前的用户信息
    请求参数：{EbUserId: '10000767'};
    返回数据：'/api/personalCenter/getInfo'在mock的personalCenter.js查看
  */
  var data = {};
  return req(Edbox.Lobby.GetUserInfo,data);
  //return request(`/api/personalCenter/getInfo?${stringify(params)}`);
}

export async function saveInfoByItem(params) { // 保存-表单项
  // return req(Edbox.GetFeedBacks, guid);
  // console.log('保存接口参数',stringify(params));

  /*
    接口注释说明:
    功能： 根据EbUserId和提交的字段保存对应的字段数据
    请求参数：{EbUserId: '10000767',[attrStr]: xxx},attrStr是变量名:'name','sex','avatar','birthday','parentsMailbox'这几项属性名，比如要保存名字时传：{EbUserId: '10000767',name: xxx};
    返回数据：'/api/personalCenter/saveInfoByItem'在mock的personalCenter.js查看
  */
  var data = {};
  const{avatarBlob,birthday,name,sex} = params;//头像之后做
  data.birthday = birthday;
  data.sex = sex;
  data.nick_name = name;
  data.head = avatarBlob;
  return req(Edbox.Lobby.UpdateUserInfo,data);
  //return request(`/api/personalCenter/saveInfoByItem?${stringify(params)}`);
}

export async function validateEmail(params) { // 验证-邮箱
  // return req(Edbox.GetFeedBacks, guid);
  /*
    接口注释说明:（刚和策划确认了下，先不没有邮箱验证）
    功能： 根据EbUserId和email验证邮箱
    请求参数：{EbUserId: '10000767',email：xxxx};
    返回数据：'/api/personalCenter/validateEmail'在mock的personalCenter.js查看
  */
  // console.log('验证接口参数',stringify(params));
  return request(`/api/personalCenter/validateEmail?${stringify(params)}`);
}
