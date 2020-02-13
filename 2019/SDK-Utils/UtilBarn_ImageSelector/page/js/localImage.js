var LocalImage = {
    /**
     * 文件选择容器
     */
    FileSelectContainer: null,

    /**
     * 隐藏父容器方法
     */
    HideParentFunction: null,

    /**
     * 显示父容器方法
     */
    ShowParentFunction: null,

    /**
     * 初始化
     */
    Init: function(hideParentFunc, showParentFunc) {
        DataFunction.LocalImage = Manager.LocalImage;
        LocalImage.HideParentFunction = hideParentFunc;
        LocalImage.ShowParentFunction = showParentFunc;
    },

    /**
     * 点击更多选项
     */
    // ClickMoreOptions = function() {
    //     var moreOptions = document.getElementById('MoreOptionsDiv');
    //     if (moreOptions.style.display == 'none') {
    //         moreOptions.style = 'display:block;';
    //     } else {
    //         moreOptions.style = 'display:none;';
    //     }
    // },


};