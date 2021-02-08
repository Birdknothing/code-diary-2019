// 初始化
Edbox.AudiohelpServer.Init("")                            // 开启mqtt监听

// 移动端大厅入口点击
Edbox.Vip.GetUserVipStatus(null,sucCallback,failCallback) // 点击个人库入口查询否是vip；

// 个人库管理页面点击
Edbox.PrivateAsset.GetMyCloudInfo(payload,sucCallback,failCallback)    // 查询磁盘容量并根据vip升级提示信息
Edbox.Vip.GetUserVipStatus(null,sucCallback,failCallback) // 查询是否vip或会员等级；

// 个人库上传资源
Edbox.PrivateAsset.UploadPrivateAssetInfo(data,sucCallback,failCallback) // 失败回调显示容量不足，vip升级提示信息

// 个人库所有页面消息推送
Edbox.Vip.VipExpireListen(null,sucCallback,()=>{})        // vip过期推送;返回移动端大厅入口