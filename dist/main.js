"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const electron_1 = require("electron");
const electron_reload_1 = __importDefault(require("electron-reload"));
const util_1 = __importDefault(require("util"));
const electron_store_1 = __importDefault(require("electron-store"));
// 開発時には electron アプリをホットリロードする
if (process.env.NODE_ENV === "development") {
    (0, electron_reload_1.default)(__dirname, {
        electron: node_path_1.default.resolve(__dirname, process.platform === "win32"
            ? "../node_modules/electron/dist/electron.exe"
            : "../node_modules/.bin/electron"),
        forceHardReset: true,
        hardResetMethod: "exit",
    });
}
const loginStore = new electron_store_1.default({
    encryptionKey: "loginData",
    cwd: electron_1.app.getPath("userData"),
    schema: {
        login: {
            type: "string",
            default: "",
        },
        password: {
            type: "string",
            default: "",
        },
    },
});
electron_1.app.whenReady().then(() => {
    // アプリの起動イベント発火で BrowserWindow インスタンスを作成
    const mainWindow = new electron_1.BrowserWindow({
        frame: false,
        titleBarStyle: 'hidden',
        width: 1440,
        height: 1024,
        backgroundColor: "#1e1e1e",
        webPreferences: {
            // tsc or webpack が出力したプリロードスクリプトを読み込み
            preload: node_path_1.default.join(__dirname, 'scripts/mainWindowPreload.js'),
        },
    });
    const loginWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 500,
        frame: false,
        parent: mainWindow,
        webPreferences: {
            preload: node_path_1.default.join(__dirname, 'scripts/loginWindowPreload.js'),
        }
    });
    loginWindow.webContents.loadURL("http://atendimentosti.ad.daer.rs.gov.br/index.php?noAUTO=1");
    // レンダラープロセスをロード
    mainWindow.loadFile('dist/index.html');
    mainWindow.webContents.openDevTools();
    // レンダラープロセスからのメッセージを受信
    electron_1.ipcMain.handle('loginWindow-to-mainWindow:login-data', () => {
        function getLoginData() {
            console.log("getting login data");
            const loginData = {
                login: loginStore.get("login"),
                password: loginStore.get("password"),
            };
            console.log("loginData: " + util_1.default.inspect(loginData));
            return loginData.login === "" ? null : loginData;
        }
        return getLoginData();
    });
    electron_1.ipcMain.on('loginWindow-to-mainWindow:has-logged', (event, arg) => {
        console.log("has logged - " + arg);
        loginWindow.destroy();
    });
    electron_1.ipcMain.on('loginWindow-to-mainWindow:store-login-data', (event, arg) => {
        loginStore.set(arg);
    });
    electron_1.ipcMain.on('titlebarEvent', (event, arg) => {
        switch (arg) {
            case "close":
                mainWindow.close();
                break;
            case "minimize":
                mainWindow.minimize();
                break;
            case "maximize":
                mainWindow.maximize();
                break;
            default:
                break;
        }
    });
});
// すべてのウィンドウが閉じられたらアプリを終了する
electron_1.app.once('window-all-closed', () => electron_1.app.quit());
