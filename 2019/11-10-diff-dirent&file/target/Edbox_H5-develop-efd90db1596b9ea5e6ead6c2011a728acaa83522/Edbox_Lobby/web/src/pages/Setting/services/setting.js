// import request from '../../../utils/request';
// import { stringify } from 'qs';
//使用req() 请求edbox方法的数据，requst()获取mock数据
import req from '../../../utils/req'; // 使用req() 请求edbox方法的数据，requst()获取mock数据
const { Edbox } = window

export async function getUpdateLog(params) { // 获取日志
  // return req(Edbox.GetFeedBacks, guid);
  /*
    接口注释说明:
    功能： 返回更新列表
    请求参数：{page: 1,size:3}; page：当前页； size：每页请求条数
    返回数据：'/api/setting/getUpdateLog'在mock的setting.js查看

  */
  const {page,size} = params;
  let data ={};
  data.currentPage= page;
  data.itemCount = size;
  return req(Edbox.Lobby.GetVersionLog,data);
  // return request(`/api/setting/getUpdateLog?${stringify(params)}`);
}
