 // 配置
 const config = {
    dot1: { x: 30, y: 30, val: "this is a demo..".repeat(10) },
    dot2: {
        x: 180,
        y: 260,
        val: "this is another demo..".repeat(10)
    },
    test: {
        x: 400,
        y: 100,
        val: "third demo".repeat(10)
    }
};

const template = cname => `<input type="checkbox" class="input ifShow" />
    <div class="dot dotCommon ${cname}">
     <input type="checkbox" class="input opac" />
     <div class="intro"></div>
</div>`;
const animationDuring = 600;
const mkHover = (dom, config) => {
    dom.children[1].innerHTML = config.val;
    config.canenter = true;
    dom.style.left = config.x + "px";
    dom.style.top = config.y + "px";
    dom.addEventListener("mouseenter", function(e) {
        if (!config.canenter) return;
        config.canenter = false;
        e.target.previousElementSibling.checked = true;
        setTimeout(() => {
            e.target.children[0].checked = true;
        }, 200);
        setTimeout(() => {
            config.canenter = true;
        }, animationDuring + 200);
    });
    dom.addEventListener("mouseleave", function(e) {
        e.target.children[0].checked = false;
        setTimeout(() => {
            e.target.previousElementSibling.checked = false;
        }, 1000);
    });
};
const initUI = () => {
    let content = "";
    for (let key in config) {
        content += template(key);
    }
    document.getElementById("app").innerHTML += content;
};
initUI();
const init = () => {
    for (let key in config) {
        const dom = document.getElementsByClassName(key)[0];
        mkHover(dom, config[key]);
    }
};
init();