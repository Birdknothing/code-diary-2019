import mockjs from 'mockjs';
export default {
    //游戏体验区
    '/api/warelist': mockjs.mock({ //请求参数 cat:分类id ，page：分页，size: 每页显示数量
        count: 1,//总数
        data: [{
            id: 1,
            game_icon: 'http://iph.href.lu/100x100',
            game_name: 'Pokemon GO',
            tags: ['ENT-RPG', 'ACT', 'FTG', 'Sandbox', 'Sandbox', 'Sandbox'],
            game_score: 1,
            players: 7777,
            author: 'name',
            author_head: 'http://iph.href.lu/100x100'
          },
        ]
    }),

    //创作列表
    '/api/getCreatList': mockjs.mock({
        count: 1, //列表总数
        data:[{
            id: 3324124,
            game_icon: 'a12ecd4c-83db-4913-b079-a97fd67b257f',
            game_name: 'Pokemon GO',
            tags: ['ENT-RPG','ACT','FTG','Sandbox','Sandbox','Sandbox'],
            game_description:'100 years after the massacre at Hu xley’s Mansion rumors swirl of the',
        }]
    }),

    //获取个人信息
    '/api/getUserInfo':mockjs.mock({
        data:{
            user_name:'',
            user_id:'',
            user_avatar: '', //用户头像
        }
    }),

    '/api/getImageUrl': (req, res) => {
        setTimeout(() => {
            res.send({
                data:{
                    url:'http://iph.href.lu/750x428?text=' + new Date().getTime()
                }
            })
        }, 1000);
    },

    //发布游戏-获取发布游戏的原始数据用于展示
    'GET /api/publishOrigin': mockjs.mock({
      data:{
        game_icon: 'a12ecd4c-83db-4913-b079-a97fd67b257f',
        game_name: '地下城222',
        game_description:'摘要发送到发送到',
        platform: 1, //平台 1：PC 2：移动端 3：H5
        ver: '1.26',
        game_update: '',
        price: 1,
        image_config: {
            ID:["95bc1079-a1dc-4782-9662-e7f72e4ea50c", "06d06115-88b1-4e6c-865d-e1c97c57834e"],
        },
      }
    }),

    //发布游戏-标签
    '/api/publishOriginTags': mockjs.mock({
        tags_game:[
            {
                id: 1,
                value: 'NEW',
                checked: false,
                undo: true,

            },{
                id: 2,
                value: 'RPG',
                checked: true,
                undo: false,

            },{
                id: 3,
                value: 'TPSTPSTPSTPSTPSTPSTPSTPSTPSTPSTPSTPS',
                checked: false,
                undo: false,

            },{
                id: 4,
                value: 'FPS',
                checked: false,
                undo: false,

            }
        ],
        tags_edu:[
            {
                id: 324,
                value: 'Stategy',
                checked: true,
                undo: true,
            },
        ],
        tags_other:[
            {
                id: 5235235,
                value: 'Stategy',
                checked: false,
                undo: false,
            },
        ],
    }),

    //发布游戏-发布
    '/api/postGameInfo': mockjs.mock({
        data: {
            message: '发布成功'
        }
    }),

    //发布游戏-新增标签后的返回
    '/api/addTags': mockjs.mock({
        data:{
            id: '', //标签id
            value: '',//标签名称
        }
    }),

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

    //游戏体验区
    '/api/getTags': mockjs.mock({
        data:[
            {
                id:'1222',
                value: '推荐'
            },
            {
                id:'2',
                value: '竞速'
            },
            {
                id:'3',
                value: '冒险'
            },
            {
                id:'4',
                value: '养成'
            },
            {
                id:'5',
                value: '模拟经营'
            },
            {
                id:'6',
                value: '模拟经营4234'
            },
            {
                id:'7',
                value: '模拟经营23333'
            },
            {
                id:'8',
                value: '养成'
            },
            {
                id:'9',
                value: '模拟经营'
            },
            {
                id:'10',
                value: '模拟经营4234'
            },
            {
                id:'11',
                value: '模拟经营23333'
            },
            {
                id:'12',
                value: '模拟经营4234'
            },
            {
                id:'13',
                value: '模拟经营23333'
            },
            {
                id:'14',
                value: '模拟经营4234'
            },
            {
                id:'15',
                value: '模拟经营23333'
            },
            {
                id:'16',
                value: '模拟经营23333'
            },
            {
                id:'17',
                value: '模拟经营4234'
            },
            {
                id:'18',
                value: '模拟经营23333'
            },
        ]
    }),


    //详情页模拟
    '/api/getDetail': mockjs.mock({
        data:{
            game_name: 'Pokemon Go II: What You Need',
            ver: '1.5.1',
            tags:[{
                id:'1',
                value: '推荐'
            },
            {
                id:'2',
                value: '竞速'
            },
            {
                id:'3',
                value: '冒险'
            },],
            game_icon: '412412424',
            game_img_full:['123123','4342424','532523525','523421341','1242142133','123123123'],
            game_img_thumbnail:['123123','4342424','532523525','523421341','1242142133','4232323'],
            game_author_img: 'http://iph.href.lu/32x32?text=人',
            game_author_name: 'name',
            game_description:'A Dead Realm Tale is a chilling VR experience that takes you to hell and back! Race against the clock as you solve puzzles in this haunted the clock as you puzzles in this haunted the clock as you puzzles in this haunted the',
            game_score: 3.5,
            game_experienced: 1000001,
            collect: 0,//是否收藏 0：未收藏，1：已收藏
            game_reviews: 120, //总评论人数（总人数=5个星级评分人数总和）
            game_reviews_0: 7, //评分1星人数 100个
            game_reviews_1: 8, //评分2星人数 1000个
            game_reviews_2: 15, //评分3星人数 100个
            game_reviews_3: 30, //评分4星人数 100个
            game_reviews_4: 60, //评分5星人数 700个
            game_playing: 2561,
            game_rated: 'E',//游戏分级
        }
    }),

    //获取详情页版本记录
    '/api/getGameRecentUpdate': mockjs.mock({
        data:[{
            ver: '1.6.1',
            brief: "Hey PC community! PC Free Access Multiplayer Weekend for Call of Duty: WWII is now live until 1PM PDT Sunday, July 22 on only.",
            details: "Only Multiplayer is available MP Soldier progress carries over when you purchase the game (this includes loot/unlockables earned in MP) Players who took part in past WWII Free Weekends but did not purchase WWII will be able to play again, with their MP progress intact Valve is running COD Game/Season Pass discounts on Steam If you've already got Call of Duty: WWII on PC, but have some friends who don't, this is a great weekend for you all to jump in and play together!"
        },{
            ver: '1.6.1',
            brief: "Hey PC community! <br> PC Free Access Multiplayer Weekend for Call of Duty: WWII is now live until 1PM PDT Sunday, July 22 on only.",
            details: "Only Multiplayer is available MP Soldier progress carries over when you purchase the game (this includes loot/unlockables earned in MP) Players who took part in past WWII Free Weekends but did not purchase WWII will be able to play again, with their MP progress intact Valve is running COD Game/Season Pass discounts on Steam If you've already got Call of Duty: WWII on PC, but have some friends who don't, this is a great weekend for you all to jump in and play together!"
        },{
            ver: '1.6.1',
            brief: "Hey PC community! <br> PC Free Access Multiplayer Weekend for Call of Duty: WWII is now live until 1PM PDT Sunday, July 22 on only.",
            details: "Only Multiplayer is available MP Soldier progress carries over when you purchase the game (this includes loot/unlockables earned in MP) Players who took part in past WWII Free Weekends but did not purchase WWII will be able to play again, with their MP progress intact Valve is running COD Game/Season Pass discounts on Steam If you've already got Call of Duty: WWII on PC, but have some friends who don't, this is a great weekend for you all to jump in and play together!"
        },{
            ver: '1.6.1',
            brief: "Hey PC community! <br> PC Free Access Multiplayer Weekend for Call of Duty: WWII is now live until 1PM PDT Sunday, July 22 on only.",
            details: "Only Multiplayer is available MP Soldier progress carries over when you purchase the game (this includes loot/unlockables earned in MP) Players who took part in past WWII Free Weekends but did not purchase WWII will be able to play again, with their MP progress intact Valve is running COD Game/Season Pass discounts on Steam If you've already got Call of Duty: WWII on PC, but have some friends who don't, this is a great weekend for you all to jump in and play together!"
        }]
    }),

    //获取详情页游戏原始模板
    '/api/getGameOriginalTpl': mockjs.mock({
        data:{
            id: 3324124,
            game_icon: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            game_name: 'Pokemon GO',
            tags: ['ENT-RPG','ACT','FTG','Sandbox','Sandbox','Sandbox'],
            game_score: 2.5,
            players: 7777,
            author: 'name',
            game_description:'100 years after the massacre at Hu xley’s Mansion rumors swirl of the',
            author_head: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
        }
    }),

    //获取详情页游戏相同模板游戏
    '/api/getGameSameTpl': mockjs.mock({
        data:[{
            id: 123,
            game_icon: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            game_name: 'Pokemon GO',
            tags: ['ENT-RPG','ACT','FTG','Sandbox','Sandbox','Sandbox'],
            game_score: 2.5,
            players: 7777,
            author: 'name',
            author_head: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
        },{
            id: 123123,
            game_icon: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            game_name: 'Pokemon GO',
            tags: ['ENT-RPG','ACT','FTG','Sandbox','Sandbox','Sandbox'],
            game_score: 2.5,
            players: 7777,
            author: 'name',
            author_head: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
        }]
    }),

    //详情页-收藏
    '/api/gameCollect': mockjs.mock({
        message: '收藏成功'
    }),

    //详情页-取消收藏
    '/api/gameCollectCancel': mockjs.mock({
        message: '取消收藏成功'
    }),

    //详情页-取消收藏
    '/api/gameExport': mockjs.mock({
        data:{
            game_file:'',//游戏安装包路径
        }
    }),

    //详情页-游戏打分
    '/api/gameReview': mockjs.mock({
        message: '评分成功'
    }),

    //详情页-举报游戏
    '/api/complainGame': mockjs.mock({
        message: '举报成功'
    }),

    //我的游戏-编辑列表
    '/api/myworks/edit': mockjs.mock({
        count: 5,
        data:[
            {
                id:'1',
                game_name: '给我个闻微观',
                game_icon: 'http://iph.href.lu/40x40',
                ver: '1.0.2',
                tags:[{
                    id:'1',
                    name: '推荐'
                },
                {
                    id:'2',
                    name: '竞速'
                },
                {
                    id:'3',
                    name: '冒险'
                },],
                creation_time: '02-27-2019',
                statu: 0, //游戏状态，0表示已发布，1表示试玩，2表示审核不通过，3表示审核中，4表示已下架，5表示未审核，6表示编辑中，7表示审核通过，待发布（定时）
                release_time: '15:20', //距离发布还有15:20
                failure_tips: '作品中含有低俗、色情等内容', //当状态为2时，显示失败原因
            },
            {
                id:'2',
                game_name: '给发的发发',
                game_icon: 'http://iph.href.lu/40x40',
                ver: '1.0.2',
                tags:[{
                    id:'1',
                    name: '推荐'
                },
                {
                    id:'2',
                    name: '竞速'
                },
                {
                    id:'3',
                    name: '冒险'
                },],
                creation_time: '02-27-2019',
                statu: 1, //游戏状态，0表示已发布，1表示试玩，2表示审核不通过，3表示审核中，4表示已下架，5表示未审核，6表示编辑中，7表示审核通过，待发布（定时）
                release_time: '15:20', //距离发布还有15:20
            },
            {
                id:'3',
                game_name: '给发撒地方sad发的发发',
                game_icon: 'http://iph.href.lu/40x40',
                ver: '1.0.2',
                tags:[{
                    id:'1',
                    name: '推荐'
                },
                {
                    id:'2',
                    name: '竞速'
                },
                {
                    id:'3',
                    name: '冒险'
                },],
                creation_time: '02-27-2019',
                statu: 2, //游戏状态，0表示已发布，1表示试玩，2表示审核不通过，3表示审核中，4表示已下架，5表示未审核，6表示编辑中，7表示审核通过，待发布（定时）
                release_time: '15:20', //距离发布还有15:20
                failure_tips: '作品中含有低俗、色情等内容', //当状态为2时，显示失败原因
            },
            {
                id:'4',
                game_name: '给发发气味气味的发发',
                game_icon: 'http://iph.href.lu/40x40',
                ver: '1.0.2',
                tags:[{
                    id:'1',
                    name: '推荐'
                },
                {
                    id:'2',
                    name: '竞速'
                },
                {
                    id:'3',
                    name: '冒险'
                },],
                creation_time: '02-27-2019',
                statu: 3, //游戏状态，0表示已发布，1表示试玩，2表示审核不通过，3表示审核中，4表示已下架，5表示未审核，6表示编辑中，7表示审核通过，待发布（定时）
                release_time: '15:20', //距离发布还有15:20
                failure_tips: '作品中含有低俗、色情等内容', //当状态为2时，显示失败原因
            },
            {
                id:'5',
                game_name: '啊啊啊啊发发',
                game_icon: 'http://iph.href.lu/40x40',
                ver: '1.0.2',
                tags:[{
                    id:'1',
                    name: '推荐'
                },
                {
                    id:'2',
                    name: '竞速'
                },
                {
                    id:'3',
                    name: '冒险'
                },],
                creation_time: '02-27-2019',
                statu: 4, //游戏状态，0表示已发布，1表示试玩，2表示审核不通过，3表示审核中，4表示已下架，5表示未审核，6表示编辑中，7表示审核通过，待发布（定时）
                release_time: '15:20', //距离发布还有15:20
            },
            {
                id:'6',
                game_name: '给我个闻微观',
                game_icon: 'http://iph.href.lu/40x40',
                ver: '1.0.2',
                tags:[{
                    id:'1',
                    name: '推荐'
                },
                {
                    id:'2',
                    name: '竞速'
                },
                {
                    id:'3',
                    name: '冒险'
                },],
                creation_time: '02-27-2019',
                statu: 0, //游戏状态，0表示已发布，1表示试玩，2表示审核不通过，3表示审核中，4表示已下架，5表示未审核，6表示编辑中，7表示审核通过，待发布（定时）
                release_time: '15:20', //距离发布还有15:20
            },
        ]
    }),

    //我的游戏-发布列表
    '/api/myworks/publish': mockjs.mock({
        count: 4,
        data:[
            {
                id:'1',
                game_name: '给我个闻微观',
                game_icon: 'http://iph.href.lu/40x40',
                ver: '1.0.2',
                game_score: '4',
                game_playing: 2000,
                tags:[{
                    id:'1',
                    name: '推荐'
                },
                {
                    id:'2',
                    name: '竞速'
                },
                {
                    id:'3',
                    name: '冒险'
                },],
                update_time: '02-27-2019',
                statu: 0, //游戏状态，0表示已发布，1表示试玩，2表示审核不通过，3表示审核中，4表示已下架，5表示未审核，6表示编辑中，7表示审核通过，待发布（定时）
                release_time: '15:20', //距离发布还有15:20
            },
            {
                id:'2',
                game_name: '给我个闻微观',
                game_icon: 'http://iph.href.lu/40x40',
                ver: '1.0.2',
                game_score: '2.5',
                game_playing: 10601,
                tags:[{
                    id:'1',
                    name: '推荐'
                },
                {
                    id:'2',
                    name: '竞速'
                },
                {
                    id:'3',
                    name: '冒险'
                },],
                update_time: '02-27-2019',
                statu: 7, //游戏状态，0表示已发布，1表示试玩，2表示审核不通过，3表示审核中，4表示已下架，5表示未审核，6表示编辑中，7表示审核通过，待发布（定时）
                release_time: '15:20', //距离发布还有15:20
            },
            {
                id:'3',
                game_name: '给我个闻微观',
                game_icon: 'http://iph.href.lu/40x40',
                ver: '1.0.2',
                game_score: '2.5',
                game_playing: 100200,
                tags:[{
                    id:'1',
                    name: '推荐'
                },
                {
                    id:'2',
                    name: '竞速'
                },
                {
                    id:'3',
                    name: '冒险'
                },],
                update_time: '02-27-2019',
                statu: 7, //游戏状态，0表示已发布，1表示试玩，2表示审核不通过，3表示审核中，4表示已下架，5表示未审核，6表示编辑中，7表示审核通过，待发布（定时）
                release_time: '15:20', //距离发布还有15:20
            },
            {
                id:'4',
                game_name: '给我个闻微观',
                game_icon: 'http://iph.href.lu/40x40',
                ver: '1.0.2',
                game_score: '2.5',
                game_playing: 50505050,
                tags:[{
                    id:'1',
                    name: '推荐'
                },
                {
                    id:'2',
                    name: '竞速'
                },
                {
                    id:'3',
                    name: '冒险'
                },],
                update_time: '02-27-2019',
                statu: 7, //游戏状态，0表示已发布，1表示试玩，2表示审核不通过，3表示审核中，4表示已下架，5表示未审核，6表示编辑中，7表示审核通过，待发布（定时）
                release_time: '15:20', //距离发布还有15:20
            },
        ]
    }),

    //我的游戏-发布列表-下架游戏
    '/api/myworks/soldoutgame': mockjs.mock({
        success: true,
        message: '下架成功',
    }),

    // 我的游戏-编辑列表-生成二维码
    '/api/myworks/getQrCodeImg': mockjs.mock({
      game_qrcode:'http://iph.href.lu/120x120',
    }),

    //打开游戏
    '/api/openGame': mockjs.mock({
        data:{
            message:'成功'
        },
    }),

    //好友列表
    '/api/getFriendList': mockjs.mock({
        count: 15,
        data:[
            {
                id:'123123',
                name:'张哥',
                avatar:'http://iph.href.lu/40x40'
            },{
                id:'123123',
                name:'张哥',
                avatar:'http://iph.href.lu/40x40'
            },{
                id:'123123',
                name:'张哥',
                avatar:'http://iph.href.lu/40x40'
            },{
                id:'123123',
                name:'张哥',
                avatar:'http://iph.href.lu/40x40'
            },{
                id:'123123',
                name:'张哥',
                avatar:'http://iph.href.lu/40x40'
            },
        ],
    }),
};
