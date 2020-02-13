// import request from '../../../utils/request';
// import req from '../../utils/req'; // 使用req() 请求edbox方法的数据，requst()获取mock数据
import req from '../../../utils/req'; // 使用req() 请求edbox方法的数据，requst()获取mock数据

const {Edbox} = window

export function getHistoryList(payload){
    // const { page, name } = payload
    // return request(`https://easy-mock.com/mock/592e592591470c0ac1fed572/example/simulation?page=${page}&name=${name}`)
    const { page, size } = payload
    var data = {};
    data.page = page;
    data.size = size;
    // data.word = name;
    return req(Edbox.Lobby.GetPlayRecord, data); 
}

export function getCollectList(payload){
    // const { page, name } = payload
    // return request(`https://easy-mock.com/mock/592e592591470c0ac1fed572/example/simulation?page=${page}&name=${name}`)
    const { page, size } = payload
    var data = {};
    data.page = page;
    data.size = size;
    // data.word = name;
    return req(Edbox.Lobby.GetUserCollectApps, data); 
}

export function getCreatList(payload){
    // const { page, word, cat  } = payload
    // // var data = {
    // //     page: 1, //分页
    // //     word: '', //关键词
    // //     cat: '22',//分类id
    // // }
    // // '/api/getCreatList' //返回参数定义(yfb.js查看)
    // return request(`https://easy-mock.com/mock/592e592591470c0ac1fed572/example/mock?page=${page}&word=${word}&cat=${cat}`)
    
    const { page, word} = payload
    // var data = { // 请求参数
    //     page: 1, //页码 
    //     order: 1, //排序：1：热度，2：最新发布
    //     cat: '', //分类id
    //     size: 16,//每页显示条数
    //     name:'asfd',//关键字搜索
    // }
    // '/api/warelist' //返回参数定义(yfb.js查看)
    //word 搜索文本内容，默认为空
    //page 分页参数，第N页，N从1开始，默认值1
    //size 分页参数, 每页大小，默认值20，size最大不能超过100
    //sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序
    //
    //
    var data = {};
    data.word = word;
    data.page = page;
    data.size = 20;
    data.sorts = '!releasetime,popular';
    return req(Edbox.Lobby.SearchCreateApps, data); 
}
