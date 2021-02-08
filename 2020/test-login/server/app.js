const express = require("express");
const app = express();
app.listen(3000);
app.use("/libs", express.static("/Users/shaofeibo/Desktop/nd-work/Edbox_SKD/Edbox_Client/H5SDK/libs"));
app.use("/coms/Loading", express.static("/Users/shaofeibo/Desktop/nd-work/Edbox/Edbox_H5/Edbox_Components/Loading/source"));
app.use("/config", express.static("/Users/shaofeibo/Desktop/code-diary/2020/test-login/EditorTest"));
app.use("/login", express.static("/Users/shaofeibo/Desktop/nd-work/Edbox/Edbox_H5/Edbox_Components/Login/dist"));
app.use("/font",express.static("/Users/shaofeibo/Desktop/code-diary/2020/test-login/server",{index:"font.html"}));
// http://192.168.31.99:8000/?Page=http://192.168.31.99:3000/
// http://172.18.145.175:8000/?Page=http://172.18.145.175:3000/

// http://192.168.31.99:3000/config
// 登录模式
// http://192.168.31.99:3000/font
// http://172.18.145.175:3000/font