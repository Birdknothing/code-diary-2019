// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            webSecurity:false
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile("index.html");

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);
// Quit when all windows are closed.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
// message
const { ipcMain } = require("electron");
ipcMain.on("asynchronous-message", function(event, arg) {
    console.log(arg); // prints "ping"
    console.log("here1");
    mkFiles(arg);
    event.reply("asynchronous-reply", "pong");
});

ipcMain.on("synchronous-message", (event, arg) => {
    console.log("here2");

    console.log(arg); // prints "ping"
    event.returnValue = "pong";
});

const wpath = "Output";

// ipcMain.on("asynchronous-message", (event, arg) => {
//     writeFile(arg);
//     event.reply("asynchronous-reply", "pong");
// });

// ipcMain.on("synchronous-message", (event, arg) => {
//     console.log(arg); // prints "ping"
// });

// const getPath = (name) => path.resolve(__dirname, path.join(wpath, name));
const writeFile = (name, str) => fs.writeFileSync(cd(wpath,name), str);
const mkDir = (path) => !fs.existsSync(path) && fs.mkdirSync(path);
mkDir(wpath);
const mkFiles = (config) => {
    writeFile("NpcRes.json", config.NpcRes);
    for (let i in config.Manifest.QAConfigPath) {
        writeFile(config.Manifest.QAConfigPath[i], JSON.stringify(config.Items[i], null, 3));
    }
    fs.writeFileSync
    writeFile("Manifest.json", JSON.stringify(config.Manifest, null, 3));
    execFile();
 try {
    } catch (error) {
        console.log(error);
    }
};
const child_process = require("child_process");
const cd = function(...url){return path.resolve(process.cwd(), ...url)}
const execFile = () =>
    child_process.execFile("Unity.bat", null, { cwd: cd("Bin") }, function (error, stdout, stderr) {
        if (error !== null) {
            console.log("exec error" + error);
        }
    });
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
