// const express = require('express'),
// superagent = require('superagent'),
// path = require('path'),
// app = express();

const superagent = require('superagent');
// app.listen(3001);
// const url = 'http://47.112.138.122:8080/admin/v1/invest/assets/passenger/pageList'; // 实际列表
// const url = 'http://47.112.138.122:8080/admin/v1/invest/assets/passenger/detail'; // 实际详情
const url = 'http://47.112.138.122:8080/admin/v1/invest/feedback/question/create'; // 实际反馈
// const url = 'http://120.79.255.61:8001'; // 实际
// const url = 'http://120.79.255.61:8001/admin/v1/assets/passenger/pageList'; // 营销
// const url = 'http://120.79.255.61:8001/assets/passengerManage/index';
// const subPath1 = '/admin/v1/invest/assets/passenger/pageList'; // 营销
// const subPath2 = '/admin/v1/invest/assets/passenger/detail';
superagent
  .post(url)
  .send({
    tenantId: 1,
    level: 10,
    moduleId: 1,
    title: 'APP置于后台被杀死',
    content: '测试数据',
    dealingId: 49,
    state: 1,
    linkUrl: 'http://www.baidu.com'
  })
  // .send({
  // pageNum: 1
  // pageSize: 10,
  // tenantId: 1,
  // level: 10, //级别（10：紧急，20：高危，30：普通）
  // moduleId: 1,
  // dealingId: 49, //处理人
  // createUser: 0 // 创建人
  // state: 1 //状态（1：新建，10：处理中，20：待验证，30：验证通过，40：无法处理，50：处理完成，60：关闭）
  // })
  // .send({ ageNum: 1, pageSize: 10, timeStart: 1559923200000, timeEnd: 1562601599999, tenantId: 1 })
  // .post('http://47.112.138.122:8080/admin/v1/invest/assets/passenger/detail')
  // .send({ id: 2975129300 })
  // .send({ pageNum: 1, pageSize: 10, timeStart: 1559577600000, timeEnd: 1562255999999, tenantId: 1 })
  // .send({ id: 1 })
  // .send({ mobile: '15901059535', tenantId: 1 })
  .set('Cookie', '_tenant_id_clearance=0; _yycx_admin_clearance={%22token%22:%2270e34d52ad2841d285412eb502363030%22%2C%22expiration%22:1562986529962}')
  // .set('Cookie', 'stk=23a63d9fe6744e21bb15b1062c6d0031; _yycx_admin_assets=23a63d9fe6744e21bb15b1062c6d0031; _yycx_admin_finance=23a63d9fe6744e21bb15b1062c6d0031; _yycx_admin_order=23a63d9fe6744e21bb15b1062c6d0031; _yycx_admin_app_custom=23a63d9fe6744e21bb15b1062c6d0031; _yycx_admin_ccs=23a63d9fe6744e21bb15b1062c6d0031; _yycx_admin_bi=23a63d9fe6744e21bb15b1062c6d0031; _yycx_admin_acl=23a63d9fe6744e21bb15b1062c6d0031; _yycx_admin={%22token%22:%2223a63d9fe6744e21bb15b1062c6d0031%22%2C%22expiration%22:1562308067538}; _order_tenant_id=1; _assets_tenant_id=1; _finance_tenant_id=1; _app_custom_tenant_id=1; _css_tenant_id=1; _bi_tenant_id=1; _tenant_id=1')
  .set('_admin_eid', 0)
  // .set('_admin_sign', '76828b6260c0588b86dff532333faab9')
  // .set('_admin_sign', '76828b6260c0588b86dff532333faab9')
  .set('_admin_tk', '70e34d52ad2841d285412eb502363030')
  // .set('_admin_tk', '23a63d9fe6744e21bb15b1062c6d0031')
  .set('_admin_ts', 1562900139)
  // .set('_admin_ts', 1562249198)
  // .set('Referer', 'http://120.79.255.61:8001/ccs/workOrder/list')
  .end((err, res) => {
    // console.log(res.body);
    console.log(res.body);
  });
