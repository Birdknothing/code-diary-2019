// import React from "react";
// import ReactDOM from "react-dom";
import "./index.scss";
import Templates from "./config/template";
// 页面内容
// 404
import page_nopage from "./config/pages/nopage";
// webpack
import page_webpack from "./config/pages/webpack";
// react
import page_react from "./config/pages/react";
// typescript
import page_ts from "./config/pages/typescript";
// Sass
import page_sass from "./config/pages/sass";
// 快速上手
import { page_guide } from "./config/pages/guide";

import "@babel/polyfill";

// pwa
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(registration => {
        console.log("SW registered: ", registration);
      })
      .catch(registrationError => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

//@ts-ignore
const $ = window["$"];

// config中类型对应的生成模版的方法
const libMap = new Map([
  ["title_p", "fillMultilineDom"],
  ["code", "mkCodeAreaDom"],
  ["codeExtend", "mkCodeAreaExtendDom"],
  ["quote", "mkQuoteDom"],
  ["iframe", "mkIframe"]
]);

// 上层方法
const mkDomLibs = {
  mkIframe(config) {
    const { src } = config;
    return Tmp.of("iframePage")
      .fill("src", src)
      .get();
  },

  mkQuoteDom(config) {
    const lines = Tmp.customize("", "");
    const { content = [] } = config;
    content.forEach(line => lines.tail(Tmp.of("quoteLine").fill("code", line)));
    return Tmp.of("quoteBlock")
      .fill("content", lines)
      .get();
  },
  fillMultilineDom: config => {
    const result = Tmp.customize("", "");
    const {
      title: [hsize, title],
      content = []
    } = config;
    if (title) {
      result.tail(
        Tmp.of("title")
          .fill("hsize", hsize)
          .fill("title", title)
      );
    }
    content.forEach(line => result.tail(Tmp.of("line").fill("words", line)));
    return result.get();
  },
  mkCodeAreaDom(config) {
    const lines = Tmp.customize("", "");
    const { content = [] } = config;
    for (let line of content) {
      lines.tail(Tmp.of("codeLine").fill("code", line));
    }
    return Tmp.of("codeBlock")
      .fill("content", lines)
      .get();
  },
  mkCodeAreaExtendDom(config) {
    const lines = Tmp.customize("", "");
    const { content = [] } = config;
    content.forEach(line => lines.tail(Tmp.of("codeLine").fill("code", line)));
    return Tmp.of("codeBlockExtend")
      .fill("content", lines)
      .get();
  }
};

// 模版区
class Tmp {
  _tmp: String;
  _name: String;
  constructor(tmp, name) {
    this._tmp = tmp + "";
    this._name = name + "";
  }
  fill(tmp, content) {
    if (this._tmp.indexOf("$" + tmp) === -1) {
      console.error("no match " + tmp + " in tmplt to replace");
      return this;
    }
    let repstr = "";
    if (typeof content === "string") {
      repstr = content;
    }
    if (content.constructor === Tmp) {
      repstr = content.get();
    }
    this._tmp = this._tmp.replace(new RegExp("\\$" + tmp, "g"), repstr);
    return this;
  }
  static customize(tmp, type) {
    return new Tmp(tmp, type);
  }
  static of(tmp) {
    if (Templates[tmp]) {
      return new Tmp(Templates[tmp], tmp);
    }
    console.error("tmplt name " + tmp + " not exists");
    return new Tmp("", "");
  }
  // 追加模版字符串
  tail(target) {
    if (typeof target === "string") {
      this._tmp = this._tmp + target;
      return this;
    }
    if (target.constructor === Tmp) {
      this._tmp += target.get();
      this._name += " " + target._name;
    }
    return this;
  }
  get() {
    // if (/\$[^$]/.test(this._tmp)) {
    //   console.log(/\$[^\$]/g.test(this._tmp));
    //   console.error("template " + this._name + " not complete");
    // }
    return this._tmp;
  }
}

const mkDomByConfig = config => {
  const libName = libMap.get(config.type);
  if (!libName) {
    return;
  }
  return mkDomLibs[libName](config);
};

// 路由名配置
const routeConfig = {
  guide: "guide",
  env: "env",
  nopage: "nopage",
  webpack: "webpack",
  ts: "ts",
  react: "react",
  sass: "sass"
};

const navConfig = [
  {
    route: routeConfig.guide,
    title: "快速上手"
  },
  { route: routeConfig.webpack, title: "Webpack" },
  { route: routeConfig.react, title: "React" },
  { route: routeConfig.ts, title: "TypeScript" },
  { route: routeConfig.sass, title: "Sass" }
];
// 路由
const router = {
  list: {
    [routeConfig.nopage]: page_nopage,
    [routeConfig.webpack]: page_webpack,
    [routeConfig.ts]: page_ts,
    [routeConfig.react]: page_react,
    [routeConfig.guide]: page_guide,
    [routeConfig.sass]: page_sass
    // nopage: page_nopage,
    // webpack: page_webpack,
    // ts: page_ts,
    // react: page_react,
    // guide: page_guide,
    // sass: page_sass
  },
  mkdom(ct) {
    return ct.map(mkDomByConfig).join("");
  },
  tab(hash) {
    if (!router.list[hash]) {
      router.tab("nopage");
      return;
    }
    // 内容页
    $(".content").html(router.mkdom(router.list[hash]));

    // 地址栏
    location.hash = "#" + hash;

    // 导航栏
    //@ts-ignore
    $(`[data-route=${hash}]`)
      .prev()
      .click();
  }
};

// 侧边栏
//@ts-ignore
$(".sideNav").html(
  navConfig
    .map(obj => {
      let navTmp = Tmp.of("navBlock");

      Object.entries(obj).forEach(([key, val]) => {
        navTmp = navTmp.fill(key, val);
      });
      return navTmp.get();
    })
    .join("")
);

// 事件
$("body")
  .on("click mouseenter", ".navBox", function() {
    const $this = $(this);
    $this.prev().click();
    router.tab($this.attr("data-route"));
  })
  .on("click", ".copy", function(e) {
    const range = document.createRange(),
      selection = window.getSelection();
    selection.rangeCount > 0 && selection.removeAllRanges();
    range.selectNodeContents(
      $(this)
        .next()
        .children(0)
        .get(0)
    );
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    e.stopPropagation();
  })
  .on("click", ".codeBlockExtend", function(e) {
    $("body").append($('<div class="curtain">'));
    $(this)
      .parent()
      .clone(true)
      .children(1)
      .removeClass("codeBlockExtend")
      .addClass("curtain")
      .addClass("codeBlockFix")
      .end()
      .appendTo("body");
  })
  .on("click", ".curtain", function(e) {
    $(".curtain").remove();
  });

//@ts-ignore
$(function() {
  // 初始化事件
  //@ts-ignore
  $(".ctrlNav:first-child").click();
});
//@ts-ignore
$(function() {
  // 根据路由初始化页面
  if (location.hash) {
    const hash = location.hash.split("#")[1];
    router.tab(hash);
  }
});
// setTimeout(() => {
//   //@ts-ignore
//   $(".ctrlAnimate").attr("checked", true);
// }, 1000);
// const cWidth = document.documentElement.clientWidth;
// const cHeight = document.documentElement.clientHeight;
const cWidth = window.innerWidth;
const cHeight = window.innerHeight;
//@ts-ignore
$(document).on("mousemove", function(e) {
  if (e.pageX / cWidth > 0.5 || e.pageY / cHeight > 0.8) {
    //@ts-ignore
    $(".ctrlAnimate").attr("checked", true);
  } else {
    $(".ctrlAnimate").attr("checked", false);
  }
});
$(".content").on("mouseenter", function(e) {
  $(".ctrlAnimate").attr("checked", false);
});
