!function(e){var t={};function i(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=0)}([function(e,t){!function(e,t){var i={Dom:null,isVisible:!0,getIframe:function(){var e=document.createElement("iframe"),t=window.Edbox.SetQueryString("EdboxArgs",window.Edbox.GetLoginInfo(),window.Edbox.Protocol+"://"+window.Edbox.GetHost("Component")+"/coms/Library/index.html?v="+(new Date).getTime());return e.setAttribute("src",t),e.setAttribute("id","Library_Iframe"),e.style.top="0",e.style.zIndex="999",e.style.left="0",e.style.position="fixed",e.style.width="100%",e.style.height="100%",e.style.borderWidth="0px",e},hideLibrary:null,Init:function(e){var t=this.getIframe();this.Dom=t,document.body.appendChild(t),this.hideLibrary||(this.hideLibrary=function(e){"HideLibrary"===e.data&&(this.Dom.style.display="none")}.bind(this)),window.addEventListener("message",this.hideLibrary),"function"==typeof e&&e()},Show:function(){if(this.isVisible)return this.Dom.style.display="none",void(this.isVisible=!1);this.isVisible||(this.Dom.style.display="block",this.isVisible=!0)},Start:function(e){"function"==typeof e&&e()},Dispose:function(e){this.Dom&&document.body.removeChild(this.Dom),this.hideLibrary&&window.removeEventListener("message",this.hideLibrary),"function"==typeof e&&e()}};e&&!e.Library&&(e.Library=i)}(window.Edbox)}]);
