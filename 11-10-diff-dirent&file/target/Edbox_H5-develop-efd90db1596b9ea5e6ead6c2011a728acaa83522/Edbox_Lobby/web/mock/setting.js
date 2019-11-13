const updateLogData = {
  Currentver: '1021',
  count:4, // 总数
  data:[  // 当前页请求数据
  {
    id:'1',
    ver: '1021',
    updateLoglist:[
      {
        update_time:'2019-03-31',
        detail:'1.更新说明1；<br>2.更新说明2；',
      },
      {
        update_time:'2019-03-29',
        detail:'1.更新说明1；<br>2.更新说明2；',
      },
      {
        update_time:'2019-03-29',
        detail:'1.更新说明1；<br>2.更新说明2；',
      }
    ],

  },
  {
    id:'2',
    ver: '1.5.0',
    updateLoglist:[
      {
        update_time:'2019-03-31',
        detail:'1.更新说明1；<br>2.更新说明2；',
      },
      {
        update_time:'2019-03-29',
        detail:'1.更新说明1；<br>2.更新说明2；',
      },
      {
        update_time:'2019-03-29',
        detail:'1.更新说明1；<br>2.更新说明2；',
      }
    ],

  },
]};

export default {
  '/api/setting/getUpdateLog': updateLogData,
};
