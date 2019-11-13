import mockjs from 'mockjs';
export default {
    //获取反馈列表
    '/api/getFeedBacks': mockjs.mock({
        data:[
            {
                id:"1",
                model_id:"",
                scene:['Play game','创作'],
                feedback_type:'Problem',
                content: 'My iPhone 5 always <dentryId>1,2,3,4</dentryId> crash while playing',
                status:0,
                reply_status:0,
                date_created:"2019-05-27 21:09",
                last_reply_time:"",
            },
            {
                id:"2",
                model_id:"",
                scene:['Play game','创作','创作'],
                feedback_type:'Problem',
                content: 'My iPhone 5 always crash while playing "Whac-A-Mole"',
                status:0,
                reply_status:0,
                date_created:"2019-05-27 21:09",
                last_reply_time:"",
            },
            {
                id:"3",
                model_id:"",
                scene:['Play game','创作','创作'],
                feedback_type:'Problem',
                content: 'My iPhone 5 always crash while playing "Whac-A-Mole"',
                status:0,
                reply_status:0,
                date_created:"2019-05-27 21:09",
                last_reply_time:"",
            },
            {
                id:"4",
                model_id:"",
                scene:['Play game','创作','创作'],
                feedback_type:'Problem',
                content: 'My iPhone 5 always crash while playing "Whac-A-Mole"',
                status:0,
                reply_status:0,
                date_created:"2019-05-27 21:09",
                last_reply_time:"",
            },
            {
                id:"5",
                model_id:"",
                scene:['Play game','创作','创作'],
                feedback_type:'Problem',
                content: 'My iPhone 5 always crash while playing "Whac-A-Mole"',
                status:0,
                reply_status:0,
                date_created:"2019-05-27 21:09",
                last_reply_time:"",
            },
            {
                id:"6",
                model_id:"",
                scene:['Play game','创作','创作'],
                feedback_type:'Problem',
                content: 'My iPhone 5 always crash while playing "Whac-A-Mole"',
                status:0,
                reply_status:0,
                date_created:"2019-05-27 21:09",
                last_reply_time:"",
            },
            {
                id:"7",
                model_id:"",
                scene:['Play game','创作','创作'],
                feedback_type:'Problem',
                content: 'My iPhone 5 always crash while playing "Whac-A-Mole"',
                status:0,
                reply_status:0,
                date_created:"2019-05-27 21:09",
                last_reply_time:"",
            }
        ]
    }),

    //获取反馈回复列表
    '/api/getFeedBackReply': mockjs.mock({
        count : 5,
        replys:[
            {
                id : "1",
                feedback_id :"",
                content: "用户回复------<dentryId>1,2,3,4</dentryId>",
                type : 0,
                reply_uid : 1231,
                reply_time : "2019-05-27 21:09"
            },
            {
                id : "2",
                feedback_id :"",
                content: "系统管理员回复",
                type : 1,
                reply_uid : 4564,
                reply_time : "2019-05-27 21:09"
            },
            {
                id : "3",
                feedback_id :"",
                content: "系统管理员回复",
                type : 1,
                reply_uid : 4564,
                reply_time : "2019-05-27 21:09"
            },
            {
                id : "4",
                feedback_id :"",
                content: "系统管理员回复",
                type : 1,
                reply_uid : 4564,
                reply_time : "2019-05-27 21:09"
            },
            {
                id : "5",
                feedback_id :"",
                content: "系统管理员回复",
                type : 1,
                reply_uid : 4564,
                reply_time : "2019-05-27 21:09"
            }
        ]
    }),

    //获取反馈模板
    '/api/getFeedBackTem': mockjs.mock({
        data:{
            "id": "561f5b3d45ce9bb13d75759a",
            "app_name": "女性之家",
            "disable": true,
            "feedback_type":[
                "类型1",
                "类型2",
                "类型3"
            ],
            "items": [
                {
                    "type": 0,//0复选，1单选，2文本，3图片
                    "required": true,
                    "title": "反馈场景",
                    "symbol": "scene",
                    "checks": [
                        "勾选项A",
                        "勾选项B",
                        "勾选项C"
                    ]
                }
            ],
            "show_contact": true,
            "language":  "zh-CN",//语言 如：zh-CN （中文） en （英文） th (泰文)
            "date_created": "2015-12-21T12:46:39.259+0000"
        }
    }),

    //上传图片
    '/api/uploadImage': mockjs.mock({
        data:{
            dentyID: '121212',
            name: '图片名字',
            Data: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        }
    }),

    //上传回复详情
    '/api/postFeedBackReply': mockjs.mock({
        success: true
    }),

    //获取图片
    '/api/getImage': mockjs.mock({
        data:{
            url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
        }
    }),
};
