"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const electron_1 = require("electron");
const electron_reload_1 = __importDefault(require("electron-reload"));
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
    // レンダラープロセスをロード
    mainWindow.loadFile('dist/index.html');
    mainWindow.webContents.openDevTools();
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
