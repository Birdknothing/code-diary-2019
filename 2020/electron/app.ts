const electron = require("electron");
//@ts-ignore
const { app, BrowserWindow } = electron;
const createWindow = () => {
  // window
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile("index.html");
};
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  // 关闭mac的所有菜单
  if (process.platform === "darwin") {
    app.quit();
  }
});
// 创建新窗口
app.on('active',()=>{
  if(BrowserWindow.getAllWindows().length === 0){
    createWindow();
  }
})