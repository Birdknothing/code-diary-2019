/**
 * 音频组件
 * @author 温荣泉
 * @version 1.0.0
 * @see 
 * @param {any} src 音频地址
 * @return {Object} 组件
 */
var Audio = function (src) {
    var self = this;

    // 音频地址
    this.Src = src;
    // 播放器
    this.Player = null;
    // 是否在播放
    this.IsOnPlay = false;

    /**
     * 初始化
     * @param {any} src 源地址
     * @param {any} loop 设置音频是否可以重复播放
     * @param {any} load 预加载
     */
    this.Init = function (src, loop, load) {
        self.Src = src;
        self.Stop();

        if (!self.Player) {
            self.Player = document.createElement("audio");
            self.Player.src = src;
        }
        if (loop) {
            self.Player.loop = "loop";
        }
        if (load) {
            self.Load();
        }
    };

    /**
     * 预加载
     * */
    this.Load = function () {
        self.Player.load();
    };

    /**
    * 播放音频
    * @param {any} onended 播放结束回调
    */
    this.Play = function (onended) {
        if (!self.Player) return;

        self.Player.onended = function () {
            if (onended) onended();
        };

        self.IsOnPlay = true;

        try {
            self.Player.play();
        } catch (e) { console.log(e); }
    };

    /**
    * 停止播放音频
    */
    this.Stop = function () {
        if (!self.Player) {
            return;
        }

        self.IsOnPlay = false;

        self.Player.pause();
        self.Player.currentTime = 0;
    };

    if (this.Src) {
        this.Init(this.Src);
    }

    return self;
};



