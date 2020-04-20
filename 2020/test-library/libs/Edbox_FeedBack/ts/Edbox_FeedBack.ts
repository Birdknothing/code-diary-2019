declare module Edbox {
/**
 * Edbox IM用户反馈平台组件
 * 用于Edbox平台大厅的业务逻辑
 * @author 张涛（120100）
 * @version 1.0.0 (2019年6月21日)
 * @see
 * Js需求:
 *      jquery
 *      CryptoJS
 *      Edbox
 *      Edbox_Request
 * */
    class FeedBack {

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
    }
}
