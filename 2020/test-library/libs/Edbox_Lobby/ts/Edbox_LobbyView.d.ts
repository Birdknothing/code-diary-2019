declare module Edbox {
    /**
	 * Edbox 大厅业务逻辑组件
	 * 用于Edbox平台大厅的业务逻辑
	 * @author 余晓(871129)
	 * @version 1.0.0 (2019年5月30日)
	 * @see
	 * Js需求:
	 *      jquery
	 *      CryptoJS
	 *      Edbox
	 *      Edbox_LobbyApiBase
	 * 		Edbox_resource
	 * */
    class LobbyView {

	 /**
     * 大厅初始化
     */
	 public static Init(): void;

    /**
     * 修改用户个人信息
     * @param {object} data {
					{string}birthday : 生日, 如不传该参数则不修改该用户生日，格式如：2019-02-13，更改若小于限制弹出提示, 
					{int}sex : 性别, 如不传该参数则不修改该用户性别，1男，2女 , 
					{string}nick_name : 昵称, 如不传该参数或传空字符串则不修改该用户昵称, 
					{string}head : 头像资源, 如不传该参数或传空字符串则不修改该用户头像, 
				}
     */
	 public static UpdateUserInfo(data: object, success?: Function, error?: Function): void;
	 
	 /**
	 * 获取用户数据
	 * @param {object} data {}空
	 * @param {Function} success 成功回调,带服务端返回对象
	 * @param {Function} error 出错回调
	 */
	 public static GetUserInfo(data: object, success?: Function, error?: Function): void;
	 
	 /**
	 * 获取标签列表
	 * @param {object} data {}空
	 * @param {Function} success 成功回调,带服务端返回对象
	 * @param {Function} error 出错回调
	 */
	 public static GetTagsList(data: object, success?: Function, error?: Function): void;
	 
	 /**
	 * 获取作品推荐列表
	 * @param {object} data {
				{int}recommand_type : recommand_type 1-填充在没有最近游戏记录情况下的推荐
				{int}page : 分页参数，第N页，N从1开始，默认值1
				{int}size : 分页参数, 每页大小，默认值10，size最大不能超过100
			}
	 * @param {Function} success 成功回调,带服务端返回对象
	 * @param {Function} error 出错回调
	 */
	 public static GetRecommandApps(data: object, success?: Function, error?: Function): void;
	 
	 /**
	 * 作品搜索接口-体验区
	 * @param {object} data {
	 			* @param {String} word 搜索文本内容，默认为空
	 			* @param {int} page 分页参数，第N页，N从1开始，默认值1
	 			* @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
	 			* @param {String} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序
	 			* @param {String} type 预留参数，作品类型，默认为'all'
	 			* @param {String} searchPlatforms  "WINDOWS,WEB,ANDROID,IOS" 指定搜索平台参数默认为空字符串，查询所有平台，支持多平台查询，格式每种平台用逗号隔开
	 		}
	 * @param {Function} success 成功回调,带服务端返回对象
	 * @param {Function} error 出错回调
	 */
	 public static SearchExperienceApps(data: object, success?: Function, error?: Function): void;
	 
	 /**
     * 获取体验库作品详情
     * @param {int} data {object} data {
			* @param {String} appid 作品id
		}
     * @param {Function} success 成功回调,带服务端返回对象
     * @param {Function} error 出错回调
     */
	 public static GetExperienceAppInfo(data: object, success?: Function, error?: Function): void;
	 
	 /**
	 * 获取作品标签列表
	 * @param {object} data {}空
	 * @param {Function} success 成功回调,带服务端返回对象
	 * @param {Function} error 出错回调
	 */
	 public static GetAppTags(data: object, success?: Function, error?: Function): void;

	 /**
     * 获取作品最近更新
     * @param {int} data {object} data {
			* @param {String} appid 作品id
		}
     * @param {Function} success 成功回调,带服务端返回对象
     * @param {Function} error 出错回调
     */
	 public static GetGameRecentUpdates(data: object, success?: Function, error?: Function): void;
	 
	 /**
     * 获取作品模板
     * @param {int} data {object} data {
			* @param {String} appid 作品id
		}
     * @param {Function} success 成功回调,带服务端返回对象
     * @param {Function} error 出错回调
     */
	 public static GetGameOriginalTpl(data: object, success?: Function, error?: Function): void;
	 
	 /**
     * 获取作品推荐
     * @param {int} data {object} data {
			* @param {String} appid 作品id
		}
     * @param {Function} success 成功回调,带服务端返回对象
     * @param {Function} error 出错回调
     */
	 public static GetGameSameTpl(data: object, success?: Function, error?: Function): void;
	 
	 /**
     * 根据资源id获取图片地址
     * @param {int} data {object} data {
			* @param {String} resourceid 资源id
		}
     * @param {Function} success 成功回调,带服务端返回对象
     * @param {Function} error 出错回调
     */
	 public static GetImage(data: object, success?: Function, error?: Function): void;

	/**
     * 获取大厅个人作品编辑列表
	 * @param {object} data {{int}page 页码
	 * 				{int}size:每页个数 
	 * 				{string}sorts:}
     * @param {Function} success 
     * @param {Function} error 
     */
	public static GetPersonalEditorApps(data: object, success?: Function, error?: Function): void;
	

	/**
     * 获取大厅个人作品发布列表
	 * @param {object} data {{int}page 页码
	 * 				{int}size:每页个数 
	 * 				{string}sorts:}
     * @param {Function} success 
     * @param {Function} error 
     */
	public static GetPersonalPublishApps(data: object, success?: Function, error?: Function): void;

	/**
     * 重名个人作品
	 * @param {object} data {{string} new_name 新名字
	 * 				{string} app_id 作品id
     * @param {Function} success 
     * @param {Function} error 
     */
	public static RenamePersonalAppName(data: object, success?: Function, error?: Function): void;

	/**
     * 下架游戏
	 * @param {object} data {app_id 作品id
     * @param {Function} success 
     * @param {Function} error 
     */
	public static SoldoutPersonalApp(data: object, success?: Function, error?: Function): void;

	/**
     * 删除作品
	 * @param {object} data {app_id 作品id
     * @param {Function} success 
     * @param {Function} error 
     */
	public static DeletePersonalApp(data: object, success?: Function, error?: Function): void;

	/*
     * 获取大厅个人作品发布列表
	 * @param {object} data {{string} curName 新名字
	 * 				{string} app_id 作品id
     * @param {Function} success 
     * @param {Function} error 
     */
	public static CopyPersonalApp(data: object, success?: Function, error?: Function): void;

	/*
     * 取消发布作品
	 * @param {object} data {{string} version 新名字
	 * 				{string} app_id 作品id
     * @param {Function} success 
     * @param {Function} error 
     */
	public static CancelPublishPersonalApp(data: object, success?: Function, error?: Function): void;

	/*
     * 获取分享链接
	 * @param {object} data {{String} app_id 作品id
	 * 				{int} access_type 获取类型 1-模板库  2-个人库 3-作品库
	 *				{int} get_type 获取类型 0-显示需求，1-移动端H5试玩，2-分享需求 ，3-移动端编辑器，4-体验区游戏（移动端），5-PC端编辑器，6-体验区游戏（PC端），7-PC端H5试玩
     * @param {Function} success 
     * @param {Function} error 
     */
	public static GetTryPlayingInfo(data: object, success?: Function, error?: Function): void;

	/*
     * 获取游戏类型
	 * @param {object} data {{String} app_id 作品id
	 * 				{int} access_type 获取类型 1-模板库  2-个人库 3-作品库
	 *				{int} get_type 获取类型 0-显示需求，1-移动端H5试玩，2-分享需求 ，3-移动端编辑器，4-体验区游戏（移动端），5-PC端编辑器，6-体验区游戏（PC端），7-PC端H5试玩
     * @param {Function} success 
     * @param {Function} error 
     */
	public static GetAppType(data: object, success?: Function, error?: Function): void;





	 /**
     * 获取大厅反馈模板
	 * @param {object} data {modelName 模板标识名称}
     * @param {Function} success 
     * @param {Function} error 
     */
	public static GetModelData(data: object, success?: Function, error?: Function): void;

	/**
     * 提交大厅反馈内容
	 * @param {object} data {
	 * 				{string}modelName 模板标识名称
	 * 				{string}contact:联系方式 
	 * 				{string}feed_type:反馈类型
	 * 				{string} content 反馈内容(固定的)
	 * 				{Array<string>} scene 反馈场景 
	 * 				{string} subscript 反馈详情
	 * 				{Array<string>} screenshot 截图}
     * @param {Function} success 
     * @param {Function} error 
     */
	public static PostFeedBack(data: object, success?: Function, error?: Function): void;

	/**
     * 获取反馈列表
	 * @param {object} data {
	 * 				{int} page 页码（1~）}
     * @param {Function} success 
     * @param {Function} error 
     */
	public static GetFeedBacks(data: object, success?: Function, error?: Function): void;

	/**
     * 获取是否有未读的反馈
	 * @param {object} data {}
     * @param {Function} success 
     * @param {Function} error 
     */
	public static GetUnReplyFeedBacks(data: object, success?: Function, error?: Function): void;

	/**
     * 获取反馈回复列表
	 * @param {object} data {
	 * 				{string} feedback_id 反馈信息的id
	 * 				{int} page 页码（1~）}
     * @param {Function} success 
     * @param {Function} error 
     */
	public static GetFeedBackReply(data: object, success?: Function, error?: Function): void;

	/**
     * 刷新反馈已读状态
	 * @param {object} data {
	 * 				{string} feedback_id 反馈信息的id}}
     * @param {Function} success 
     * @param {Function} error 
     */
	public static RefreshFeedBackState(data: object, success?: Function, error?: Function): void;

	/**
     * 提交反馈回复
	 * @param {object} data {
	 * 				{string} feedback_id 反馈信息的id
	 * 				{string} content 反馈的内容}
     * @param {Function} success 
     * @param {Function} error 
     */
	public static PostFeedBackReply(data: object, success?: Function, error?: Function): void;

	/**
     * 上传反馈截屏TOCs
	 * @param {object} data {
	 * 				{Object} file 反馈信息的id
     * @param {Function} success 
     * @param {Function} error 
     */
	public static UploadImageToCS(data: object, success?: Function, error?: Function): void;

	/**
     * 上传反馈截屏TOCs
	 * @param {object} data {
	 * 				{string} dentry_id 反馈信息的id
     * @param {Function} success 
     * @param {Function} error 
     */
	public static GetCSImageUrl(data: object, success?: Function, error?: Function): void;

	
	 /**
	 * 收藏作品
	 * @param {object} data {
				{string} app_id 作品id
			}
	 * @param {Function} success 成功回调,带服务端返回对象
	 * @param {Function} error 出错回调
	 */
	 public static CollectApp(data: object, success?: Function, error?: Function): void;
	 /**
	 * 取消收藏作品
	 * @param {object} data {
				{string} app_id 作品id
			}
	 * @param {Function} success 成功回调,带服务端返回对象
	 * @param {Function} error 出错回调
	 */
	 public static CancelCollectApp(data: object, success?: Function, error?: Function): void;
	 /**
	 * 给作品打分
	 * @param {object} data {
					*{string}app_id : 作品id, 
					*{int}score : 评价，例如： 4 代表四星, 
					*{string}version : 版本，例如：1.0.1
				}
	 * @param {Function} success 成功回调,带服务端返回对象
	 * @param {Function} error 出错回调
	 */
	 public static SetAppScore(data: object, success?: Function, error?: Function): void;
    }
}
