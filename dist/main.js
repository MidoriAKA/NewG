"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const { app, BrowserWindow, BrowserView, ipcMain, shell, clipboard, Notification, screen } = require('electron');
// 開発時には electron アプリをホットリロードする
if (process.env.NODE_ENV === "development") {
    require("electron-reload")(__dirname, {
        electron: node_path_1.default.resolve(__dirname, process.platform === "win32"
            ? "../node_modules/electron/dist/electron.exe"
            : "../node_modules/.bin/electron"),
        forceHardReset: true,
        hardResetMethod: "exit",
    });
}
app.whenReady().then(() => {
    // アプリの起動イベント発火で BrowserWindow インスタンスを作成
    const mainWindow = new BrowserWindow({
        frame: false,
        titlebarStyle: 'hidden',
        width: 1440,
        height: 1024,
        webPreferences: {
            // tsc or webpack が出力したプリロードスクリプトを読み込み
            preload: node_path_1.default.join(__dirname, 'scripts/mainWindowPreload.js'),
        },
    });
    // レンダラープロセスをロード
    mainWindow.loadFile('dist/index.html');
    mainWindow.webContents.openDevTools();
});
// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());
