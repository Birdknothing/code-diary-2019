// document.getElementById("app").style.background="url(/a/river.jpg)"
const link  = document.createElement("link");
link.rel="stylesheet";
link.href = "/a/b/1.css"
document.getElementsByTagName("head")[0].appendChild(link)