const getSexData = [
  {
    name: '男',
    code: 1,
  },
  {
    name: '女',
    code: 2,
  },
];

const getPersonalCenterData = {
  avatarUrl:'',
  name:'小明',
  birthday:'1996-10-10',
  sex:'',
  parentsMailbox:'907323284@qq.com', // 注意：这里发送家长邮箱才返回该字段
};

const saveFeedback = {
  success:true,
};

const emailFeedback = {
  status: 0, // 0待验证，1已验证
};

export default {
  '/api/dictionary': getSexData,
  '/api/personalCenter/getInfo': getPersonalCenterData,
  '/api/personalCenter/saveInfoByItem': saveFeedback,
  '/api/personalCenter/validateEmail': emailFeedback,
};
