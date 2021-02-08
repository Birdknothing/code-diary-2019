var mkMap = function (containerId, imgId, src) {
    init({ fid: containerId, sid: imgId, src: src }, controller(handler));
};
var lib = {
    container: null,
    // 包含图片的div
    pic: null,
    width: 200,
    height: 200,
    initWidth: 200,
    initHeight: 200,
    scale: 1,
    // getScale(){
    //     return this.x / this.y;
    // },
    left: 0,
    top: 0,
    centerX: 0,
    centerY: 0,
    scrollYVelocity: 0.1,
    behavior: "",
    state: "",
    x: 0,
    y: 0,
    distanceX: 0,
    distanceY: 0,
    // 滚动灵敏度,间隔多少毫秒被认为是在滚动
    sense: 200,
    last: 0,
    real: 0,
    scrollInterval: 0,
    scrollable: true,
    addedEvent: false,
    // 标签
    tagState: false,
    setTagState: function (bool) {
        if (bool) {
            this.tagState = true;
            document.body.style.cursor = "crosshair";
        }
        else {
            this.tagState = false;
            document.body.style.cursor = "auto";
        }
    },
    resetTags: function () {
        var self = this;
        this.tagsArr.forEach(function (config) {
            config.dom && self.pic.removeChild(config.dom);
        });
        this.tagsArr.length = 0;
    },
    tagsArr: [],
    pushTagDom: function (config) {
        var dom = document.createElement("div");
        config.dom = dom;
        var xScale = this.width / this.initWidth;
        var yScale = this.height / this.initHeight;
        this.setDomStyle(dom, {
            left: config.left * xScale + "px",
            top: config.top * yScale + "px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "red",
            position: "absolute",
            cursor: "pointer"
        });
        dom.addEventListener("mouseenter", function () {
            this.children[0]["style"].display = "block";
        });
        dom.addEventListener("mouseleave", function () {
            this.children[0]["style"].display = "none";
        });
        dom.innerHTML = "<span style=\"display:none;border-radius:5px;padding:5px 10px;\">" + config.txt + "</span>";
        this.pic && this.pic.appendChild(dom);
        return config;
    },
    moveTagDoms: function () {
        var self = this;
        this.tagsArr.forEach(function (config) {
            var xScale = self.width / self.initWidth;
            var yScale = self.height / self.initHeight;
            self.setDomStyle(config.dom, {
                top: config.top * yScale + "px",
                left: config.left * xScale + "px"
            });
        });
    },
    // 拖拽部分
    inDrag: false,
    startX: 0,
    startY: 0,
    setDomStyle: function (dom, config) {
        for (var key in config) {
            dom.style[key] = config[key];
        }
    },
    setStyle: function () {
        for (var key in this) {
            if (["width", "height", "left", "top"].indexOf(key) !==
                -1) {
                this.pic.style[key] = this[key] + "px";
                if (key === "top")
                    break;
            }
        }
    },
    calcStyle: function () {
        var distanceY = this.scrollInterval * this.scrollYVelocity;
        this.distanceY = distanceY;
        var distanceX = this.scale * distanceY;
        this.distanceX = distanceX;
        var xOffset = (this.x - this.centerX) * distanceX * 0.01;
        var yOffset = (this.y - this.centerY) * distanceY * 0.01;
        switch (this.behavior) {
            case "expand":
                this.left -= distanceX + xOffset;
                this.top -= distanceY + yOffset;
                this.width += 2 * distanceX;
                this.height += 2 * distanceY;
                this.moveTagDoms();
                break;
            case "shrink":
                this.left += distanceX + xOffset;
                this.top += distanceY + yOffset;
                this.width -= 2 * distanceX;
                this.height -= 2 * distanceY;
                this.moveTagDoms();
                break;
            default:
                break;
        }
    },
    isScrolling: function () {
        return this.state === "scrolling";
    },
    handle: function () {
        if (this.isScrolling() && this.scrollable) {
            this.calcStyle();
            this.setStyle();
        }
    }
};
var getVal = function (id) {
    var result = document.getElementById(id)["value"];
    return result;
};
var controller = function (handle) { return function (e) {
    e.stopPropagation();
    e.preventDefault();
    lib.real = Date.now();
    lib.state =
        lib.real - lib.last > lib.sense ? "stop" : "scrolling";
    lib.scrollInterval = lib.real - lib.last;
    lib.last = lib.real;
    // chrome
    lib.behavior = e.deltaY > 0 ? "expand" : "shrink";
    handle();
}; };
var init = function (config, handler) {
    // 初始化
    !lib.container &&
        (lib.container = document.getElementById(config.fid));
    !lib.pic && (lib.pic = document.getElementById(config.sid));
    // .height();
    console.log('herhehrehr');
    lib.pic.children[0].src = config.src;
    lib.left = 0;
    lib.top = 0;
    lib.width = +getVal("picWidth") || lib.width;
    lib.height = +getVal("picHeight") || lib.height;
    lib.initWidth = lib.width;
    lib.initHeight = lib.height;
    lib.setDomStyle(lib.container, {
        width: lib.width + "px",
        height: lib.height + "px",
        position: "relative",
        overflow: "hidden",
        border: "1px solid orange",
        borderRadius: "5px"
    });
    lib.setDomStyle(lib.pic, {
        position: "absolute",
        width: "100%",
        height: "100%"
    });
    lib.scale = lib.width / lib.height;
    lib.centerX = lib.width / 2;
    lib.centerY = lib.height / 2;
    lib.setStyle();
    if (lib.addedEvent)
        return;
    lib.pic.ondragstart = function () { return false; };
    lib.container.addEventListener("mousewheel", handler, {
        passive: false
    });
    lib.container.addEventListener("mousemove", function (e) {
        lib.x = e.clientX - this.getBoundingClientRect().x;
        lib.y = e.clientY - this.getBoundingClientRect().y;
        if (lib.inDrag) {
            lib.setDomStyle(lib.pic, {
                left: (lib.left += e.offsetX - lib.startX) + "px",
                top: (lib.top += e.offsetY - lib.startY) + "px"
            });
        }
    });
    lib.container.addEventListener("mousedown", function (e) {
        lib.inDrag = true;
        lib.startX = e.offsetX;
        lib.startY = e.offsetY;
    });
    lib.pic.addEventListener("mousedown", function (e) {
        if (!lib.tagState)
            return;
        var self = this;
        var scale = lib.width / lib.initWidth;
        lib.tagsArr.push(lib.pushTagDom({
            left: (e.clientX - self.getBoundingClientRect().x) /
                scale,
            top: (e.clientY - self.getBoundingClientRect().y) /
                scale,
            txt: getVal("tagName")
        }));
    });
    lib.container.addEventListener("mouseup", function (e) {
        lib.inDrag = false;
        lib.setTagState(false);
    });
    lib.container.addEventListener("mouseleave", function (e) {
        lib.inDrag = false;
    });
    lib.addedEvent = true;
};
var handler = function () { return lib.handle(); };
var reset = function () {
    confirmClick();
};
var confirmClick = function () {
    mkMap("app", "target", getVal("picSrc"));
};
confirmClick();
var addTag = function () {
    lib.setTagState(true);
};
