declare module UtilBarn {
    /**
	 * UtilBarn 大厅业务逻辑组件
	 * 用于UtilBarn平台大厅的业务逻辑
	 * @author 余晓(871129)
	 * @version 1.0.0 (2019年5月30日)
	 * @see
	 * Js需求:
	 *      jquery
	 *      CryptoJS
	 *      UtilBarn
	 *      UtilBarn_LobbyApiBase
	 * 		UtilBarn_resource
	 * */
    class LobbyService {

	 /**
     * 获取个人库作品列表(编辑列表)
     * @param {int} page 分页参数，第N页，N从1开始，默认值1
     * @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
     * @param {string} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序 
     * @param {Function} success 成功回调,带服务端返回对象
     * @param {Function} error 出错回调
     */
	 public static GetPersonalEditorApps(page: number, size: number, sorts: string, success?: Function, error?: Function): void;

	 /**
     * 获取个人库作品列表(发布列表)
     * @param {int} page 分页参数，第N页，N从1开始，默认值1
     * @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
     * @param {string} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序 
     * @param {Function} success 成功回调,带服务端返回对象
     * @param {Function} error 出错回调
     */
	 public static GetPersonalPublishApps(page: number, size: number, sorts: string, success?: Function, error?: Function): void;

	 /**
     * 作品重命名
     * @param *{string} app_id 作品id
     * @param *{string} new_name 新名字
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
	 public static RenamePersonalAppName(app_id: string,new_name: string,success?:Function,error?:Function):void;

	 /**
     * 获取个人库作品详情
     * @param *{String} app_id 作品id
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
	 public static GetPersonalAppDetail(app_id: string, success?:Function,error?:Function):void;

	 /**
     * 删除作品
     * @param *{string} app_id 作品id
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
	 public static DeletePersonalApp(app_id: string, success?:Function,error?:Function):void;

	 /**
     * 下架作品
     * @param *{string} app_id 作品id
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
	public static SoldoutPersonalApp(app_id: string, success?:Function,error?:Function):void;

	 /**
     * 复制个人作品
     * @param *{string} app_id 个人作品id
     * @param *{string} version 版本号,为空取最新版本
     * @param *{int} playerid 玩家id
     * @param *{string} curName 作品名称
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
	public static CopyPersonalApp(app_id:string,version:string,playerid:number,curName:string,success?:Function,error?:Function):void;

	 /**
     * 获取用户收藏列表
     * @param {int} page 分页参数，第N页，N从1开始，默认值1
     * @param {int} size 分页参数, 每页大小，默认值10，size最大不能超过100
     * @param {Function} success 成功回调,带服务端返回对象
     * @param {Function} error 出错回调
     */
	public static GetUserCollectApps(page: number, size: number, success?: Function, error?: Function):void;

	/**
     * 获取最近游戏记录列表
     * @param {Function} success 成功回调,带服务端返回对象
     * @param {Function} error 出错回调
     */
     public static GetPlayRecordApps(success?: Function, error?: Function):void;
     
     /**
     * 获取用户好友列表
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
     public static GetIMFriendsInfo(success?: Function, error?: Function):void

     /**
     * 分享作品
     * @param {string} recieveUri 作者id
     * @param {string} shareAppID 分享作品id
     * @param {string} summary 分享标题 “【UtilBarn】邀请通知”
     * @param {string} iconalt 图标alt "XXX游戏宣传"
     * @param {string} shareAppIconUrl 分享游戏图标地址
     * @param {string} sharecontent 分享内容 "哇哇，你的好友邀请你一起玩游戏啦！快来陪他/她一起玩吧"
     * @param {string} shareBtnTxt 分享的显示按钮文字
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
  	 */
     public static SharePersonalApp(recieveUri:string,shareAppID:string,summary:string,iconalt:string,shareAppIconUrl:string,shareContent:string,shareBtnTxt:string,success?:Function,error?:Function) :void;
    }
}
