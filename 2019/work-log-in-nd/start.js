const { spawn, exec } = require("child_process");
// exec('ls',{cwd:'E:\\git-project-2\\Edbox_H5\\Edbox_Editor\\Framework\\web'},(err,out,stderr)=>{
//     console.log(err);
//     console.log('out',out);
//     console.log('err',stderr);
// });
const map = new Map([
  ["p0", "本地sdk"],
  ["p1", "登录控件编辑模式"],
  ["p2", "登录控件登录模式"],
  ["p3", "loading移动端"],
  ["p4", "loadingPC端"]
]);
// 本地sdk启动 3008 feature/feature-login
const p0 = spawn("node", ["app.js"], {
  cwd: "E:\\git-client\\Edbox_Client"
});

// 登录控件编辑模式，必须用npm 8001 feature/feature-Login
const p1 = spawn("npm", ["start", "--port", "8001"], {
  cwd: "E:\\git-project-2\\Edbox_H5\\Edbox_Editor\\Framework\\web"
});
// loading移动端 8002 feature/feature-common-loading
const p3 = spawn("yarn", ["start", "--port", "8002"], {
  cwd: "E:\\git-project\\Edbox_H5\\Edbox_Lobby\\mobile"
});
// loadingPC端 8000 feature/feature-Login              ！！！！！！！！！！！需要写到feature/feature-common-loading上,去 feature/feature-mobile-lobby-loading上可拿原始代码
const p4 = spawn("yarn", ["start", "--port", "8000"], {
  cwd: "E:\\git-project-2\\Edbox_H5\\Edbox_Lobby\\web"
});
// 登录控件登录模式 3007端口 http://192.168.211.46:3007/1015692_1/
const p2 = spawn("node", ["app.js"], { cwd: "E:\\tmp-test-component\\Server" });

p0.stdout.on("data", data => {
  console.log(`${map.get("p0")} >>?`, data.toString());
});
p0.stderr.on("data", data => {
  console.log(`${map.get("p0")} error:`, data.toString());
});
p0.on("close", code => {
  console.log(`${map.get("p0")} exit:`);
});

p1.stdout.on("data", data => {
  console.log(`${map.get("p1")} >>?`, data.toString());
});
p1.stderr.on("data", data => {
  console.log(`${map.get("p1")} error:`, data.toString());
});
p1.on("close", code => {
  console.log(`${map.get("p1")} exit:`);
});

p2.stdout.on("data", data => {
  console.log(`${map.get("p2")} >>?`, data.toString());
});
p2.stderr.on("data", data => {
  console.log(`${map.get("p2")} error:`, data.toString());
});
p2.on("close", code => {
  console.log(`${map.get("p2")} exit:`);
});

p3.stdout.on("data", data => {
  console.log(`${map.get("p3")} >>?`, data.toString());
});
p3.stderr.on("data", data => {
  console.log(`${map.get("p3")} error:`, data.toString());
});
p3.on("close", code => {
  console.log(`${map.get("p3")} exit:`);
});

p4.stdout.on("data", data => {
  console.log(`${map.get("p4")} >>?`, data.toString());
});
p4.stderr.on("data", data => {
  console.log(`${map.get("p4")} error:`, data.toString());
});
p4.on("close", code => {
  console.log(`${map.get("p4")} exit:`);
});
