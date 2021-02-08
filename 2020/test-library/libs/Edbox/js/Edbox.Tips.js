// 多语言提示信息
(function (namespace, className) {
    /**
     * 多语言提示信息
     */
    var module = {
        // Edbox
        ERROR_NotSupport_Title: {
            English: "Not Support",
            SimplifiedChinese: "当前浏览器不支持",
            TraditionalChinese: "當前瀏覽器不支持",
            TraditionalChinese_TW: "當前瀏覽器不支持"
        },

        ERROR_NotSupport_Content: {
            English: "Current browsers cannot support Edbox. Please try to open it with other browsers such as Chrome.",
            SimplifiedChinese: "当前浏览器无法支持Edbox的使用，请尝试使用chrome等其它浏览器打开",
            TraditionalChinese: "當前瀏覽器無法支持Edbox的使用，請嘗試使用chrome等其它瀏覽器打開",
            TraditionalChinese_TW: "當前瀏覽器無法支持Edbox的使用，請嘗試使用chrome等其它瀏覽器打開"
        },

        ERROR_EditorNotSupport: {
            English: "This game editor is not supported on current devices",
            SimplifiedChinese: "当前设备不支持此游戏编辑器",
            TraditionalChinese: "當前設備不支持此遊戲編輯器",
            TraditionalChinese_TW: "當前設備不支持此遊戲編輯器"
        },

        ERROR_GameIDInvalid: {
            English: "Invalid game ID",
            SimplifiedChinese: "游戏ID无效",
            TraditionalChinese: "遊戲ID無效",
            TraditionalChinese_TW: "遊戲ID無效"
        },

        ERROR_NotLoggedIn: {
            English: "Not logged in",
            SimplifiedChinese: "未登录",
            TraditionalChinese: "未登錄",
            TraditionalChinese_TW: "未登錄"
        },

        Hint_NotSave: {
            English: "The system may not save your changes.",
            SimplifiedChinese: "系统可能不会保存您所做的修改。",
            TraditionalChinese: "系統可能不會保存您所做的修改。",
            TraditionalChinese_TW: "系統可能不會保存您所做的修改。"
        },

        // MMO
        ERROR_LengthExceeds: {
            English: "Maximun number of character reached：1000 characters",
            SimplifiedChinese: "字数较多，不可超过1000字",
            TraditionalChinese: "字數較多，不可超過1000字",
            TraditionalChinese_TW: "字數較多，不可超過1000字"
        },

        ERROR_NameDuplicate: {
            English: "Product name is duplicate",
            SimplifiedChinese: "作品名称重复",
            TraditionalChinese: "作品名稱重復",
            TraditionalChinese_TW: "作品名稱重復"
        },

        //Editor
        ERROR_EditorSaveFailed: {
            English: "Save failed: ",
            SimplifiedChinese: "保存失败:",
            TraditionalChinese: "保存失敗:",
            TraditionalChinese_TW: "保存失敗:"
        },

        ERROR_EditorSaveAsFailed: {
            English: "Save as failed: ",
            SimplifiedChinese: "另存为失败:",
            TraditionalChinese: "另存為失敗:",
            TraditionalChinese_TW: "另存為失敗:"
        },

        TIP_EditorSaveSucess: {
            English: "Save Successfully",
            SimplifiedChinese: "保存成功",
            TraditionalChinese: "保存成功",
            TraditionalChinese_TW: "保存成功"
        },

        ERROR_TagsNotSame: {
            English: "The tag already exists",
            SimplifiedChinese: "标签名称不能相同哦",
            TraditionalChinese: "標籤名稱不能相同哦",
            TraditionalChinese_TW: "標籤名稱不能相同哦"
        },

        ERROR_TagsInValid: {
            English: "The tag is invalid",
            SimplifiedChinese: "标签名称不合法",
            TraditionalChinese: "標籤名稱不合法",
            TraditionalChinese_TW: "標籤名稱不合法"
        },

        ERROR_ISWORKINGONLY: {
            English: "Repeated request. You are exporting the game now. Please wait.",
            SimplifiedChinese: "正在导出一个游戏，请不要重复操作。",
            TraditionalChinese: "正在匯出一個遊戲，請不要重複操作。",
            TraditionalChinese_TW: "正在匯出一個遊戲，請不要重複操作。"
        },

        ERROR_UNKNOWERROR: {
            English: "Export failed. Please try again.",
            SimplifiedChinese: "导出失败，请重试",
            TraditionalChinese: "匯出失敗，請重試",
            TraditionalChinese_TW: "匯出失敗，請重試"
        },

        ERROR_SEARCHERROR: {
            English: "Search failed. Please try again.",
            SimplifiedChinese: "搜索失败，请重试",
            TraditionalChinese: "搜索失敗，請重試",
            TraditionalChinese_TW: "搜索失敗，請重試"
        },

        ERROR_SCREENSHOOTER: {
            English: "Screenshots failed. Please try again.",
            SimplifiedChinese: "截图失败，请重试",
            TraditionalChinese: "截圖失敗，請重試",
            TraditionalChinese_TW: "截圖失敗，請重試"
        },

        ERROR_NAMETOLONG: {
            English: "Maximum request length exceeded. Please try again.",
            SimplifiedChinese: "名称过长，请重新输入",
            TraditionalChinese: "名稱過長，請重新輸入",
            TraditionalChinese_TW: "名稱過長，請重新輸入"
        },

        ERROR_MobileNotSupported: {
            English: "Sorry, it cannot be edited here for now. Please go to the mobile side.",
            SimplifiedChinese: "暂未开放，建议到手机端编辑",
            TraditionalChinese: "暫未開放，建議到手機端編輯",
            TraditionalChinese_TW: "暫未開放，建議到手機端編輯"
        },

        ERROR_NETWORKERROR: {
            English: "Network error. Please try again.",
            SimplifiedChinese: "网络问题，请重试",
            TraditionalChinese: "網絡問題，請重試",
            TraditionalChinese_TW: "網絡問題，請重試"
        },

        IM_SHARE_SUMMARY: {
            English: "【Edbox】Invitations",
            SimplifiedChinese: "【Edbox】邀请通知",
            TraditionalChinese: "【Edbox】邀請通知",
            TraditionalChinese_TW: "【Edbox】邀請通知"
        },

        IM_SHARE_ICONALT: {
            English: "Games Publicize.",
            SimplifiedChinese: "游戏宣传",
            TraditionalChinese: "遊戲宣傳",
            TraditionalChinese_TW: "遊戲宣傳"
        },

        IM_SHARE_JOIN: {
            English: "Join Game.",
            SimplifiedChinese: "打开链接",
            TraditionalChinese: "打開鏈接",
            TraditionalChinese_TW: "打開鏈接"
        },

        QQ_SHARE_JOIN: {
            English: "I saw this game in Edbox, very funny!",
            SimplifiedChinese: "我在Edbox看到这款游戏还不错哦！",
            TraditionalChinese: "我在Edbox看到這款遊戲還不錯哦！",
            TraditionalChinese_TW: "我在Edbox看到這款遊戲還不錯哦！"
        },

        ERROR_NETWORK_OFFLINE: {
            English: "Current network unavailabilit. Please check your network setting.",
            SimplifiedChinese: "当前网络不可用，请检查你的网络设置",
            TraditionalChinese: "當前網絡不可用，請檢查你的網絡設置",
            TraditionalChinese_TW: "當前網絡不可用，請檢查你的網絡設置"
        },

        ERROR_GAMENAME_SPACE: {
            English: "Name cannot be all Spaces",
            SimplifiedChinese: "作品名称不能全为空格",
            TraditionalChinese: "作品名稱不能全為空格",
            TraditionalChinese_TW: "作品名稱不能全為空格"
        },

        ERROR_ILLEGAL_CHARACTER: {
            English: "Name cannot contain special characters \\/:*?\"<>|]",
            SimplifiedChinese: "作品名称不能包含特殊字符 \\/:*?\"<>|]",
            TraditionalChinese: "作品名稱不能包含特殊字元 \\/:*?\"<>|]",
            TraditionalChinese_TW: "作品名稱不能包含特殊字元 \\/:*?\"<>|]"
        },

        ERROR_Private_UploadData: {
            English: "Failed to upload data, please try again",
            SimplifiedChinese: "上传数据失败，请重试",
            TraditionalChinese: "上傳數據失敗，請重試",
            TraditionalChinese_TW: "上傳數據失敗，請重試"
        },

        ERROR_Private_LocalFile: {
            English: "Local file error, please check",
            SimplifiedChinese: "本地文件出错，请检查",
            TraditionalChinese: "本地檔出錯，請檢查",
            TraditionalChinese_TW: "本地檔出錯，請檢查"
        },

        ERROR_Private_UploadFile: {
            English: "File upload failed, please check the network and try again",
            SimplifiedChinese: "文件上传失败，请检查网络重试",
            TraditionalChinese: "檔上傳失敗，請檢查網路重試",
            TraditionalChinese_TW: "檔上傳失敗，請檢查網路重試"
        },

        ERROR_Private_Sensitive: {
            English: "File name contains sensitive words",
            SimplifiedChinese: "文件名称包含敏感词",
            TraditionalChinese: "檔案名稱包含敏感詞",
            TraditionalChinese_TW: "檔案名稱包含敏感詞"
        },

        ERROR_Private_DeleteSource: {
            English: "Failed to delete personal resources",
            SimplifiedChinese: "删除个人资源失败",
            TraditionalChinese: "刪除個人資源失敗",
            TraditionalChinese_TW: "刪除個人資源失敗"
        },

        ERROR_Private_GetFavoriteRes: {
            English: "Failed to get favorite resources",
            SimplifiedChinese: "获取收藏资源失败",
            TraditionalChinese: "獲取收藏資源失敗",
            TraditionalChinese_TW: "獲取收藏資源失敗"
        },

        ERROR_Private_Collect: {
            English: "Collection of resources failed",
            SimplifiedChinese: "收藏资源失败",
            TraditionalChinese: "收藏資源失敗",
            TraditionalChinese_TW: "收藏資源失敗"
        },

        ERROR_Private_CancelCollect: {
            English: "Unfavorite resource failed",
            SimplifiedChinese: "取消收藏资源失败",
            TraditionalChinese: "取消收藏資源失敗",
            TraditionalChinese_TW: "取消收藏資源失敗"
        },

        ERROR_Private_GetFavoriteStatus: {
            English: "Failed to get favorite status",
            SimplifiedChinese: "获取收藏状态失败",
            TraditionalChinese: "獲取收藏狀態失敗",
            TraditionalChinese_TW: "獲取收藏狀態失敗"
        },

        ERROR_Private_GetTags: {
            English: "Failed to get tag list",
            SimplifiedChinese: "获取标签集失败",
            TraditionalChinese: "獲取標籤集失敗",
            TraditionalChinese_TW: "獲取標籤集失敗"
        },

        ERROR_Private_AddTag: {
            English: "Failed to add the tag",
            SimplifiedChinese: "添加标签失败",
            TraditionalChinese: "添加標籤失敗",
            TraditionalChinese_TW: "添加標籤失敗"
        },

        ERROR_Private_DeleteTag: {
            English: "Failed to delete tag",
            SimplifiedChinese: "删除标签失败",
            TraditionalChinese: "刪除標籤失敗",
            TraditionalChinese_TW: "刪除標籤失敗"
        },

        ERROR_Private_ModifyTag: {
            English: "Failed to modify tag",
            SimplifiedChinese: "修改标签失败",
            TraditionalChinese: "修改標籤失敗",
            TraditionalChinese_TW: "修改標籤失敗"
        },

        ERROR_Private_AddTagOfRes: {
            English: "Failed to add the tag",
            SimplifiedChinese: "资源添加标签失败",
            TraditionalChinese: "資源添加標籤失敗",
            TraditionalChinese_TW: "資源添加標籤失敗"
        },

        ERROR_Private_DeleteTagOfRes: {
            English: "Failed to delete tag",
            SimplifiedChinese: "资源删除标签失败",
            TraditionalChinese: "資源刪除標籤失敗",
            TraditionalChinese_TW: "資源刪除標籤失敗"
        },
        VIP_NOTCREATE: {
            English: "Registered users can create up to 10 games. VIP exclusive services are coming soon...",
            SimplifiedChinese: "免费用户最多创作10个作品；会员服务正在抓紧上线中...",
            TraditionalChinese: "免費用戶最多可創作10個作品; 會員服務即將推出，敬請期待!",
            TraditionalChinese_TW: "免費用戶最多創作10個作品；會員服務正在抓緊上線中..."
        },

        TIP_CONFIRM: {
            English: "OK",
            SimplifiedChinese: "确定",
            TraditionalChinese: "確定",
            TraditionalChinese_TW: "確定"
        },

        TIP_CANCEL: {
            English: "Cancel",
            SimplifiedChinese: "取消",
            TraditionalChinese: "取消",
            TraditionalChinese_TW: "取消"
        },

        VIP_TEMPLATE: {
            English: "Upgrade VIP to experience the feature. VIP exclusive services are coming soon...",
            SimplifiedChinese: "升级会员后方可体验；会员服务正在抓紧上线中...",
            TraditionalChinese: "升級會員後方可體驗；會員服務正在抓緊上線中..",
            TraditionalChinese_TW: "升級會員後方可體驗；會員服務正在抓緊上線中.."
        }

    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Tips"));