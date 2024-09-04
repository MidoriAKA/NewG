import path from 'node:path';
import { app, BrowserWindow, ipcMain } from "electron";
import electronReload from "electron-reload";

// 開発時には electron アプリをホットリロードする
if (process.env.NODE_ENV === "development") {
    electronReload(__dirname, {
    electron: path.resolve(
        __dirname,
        process.platform === "win32"
        ? "../node_modules/electron/dist/electron.exe"
        : "../node_modules/.bin/electron",
    ),
    forceHardReset: true,
    hardResetMethod: "exit",
    });
}

app.whenReady().then(() => {
  // アプリの起動イベント発火で BrowserWindow インスタンスを作成
    const mainWindow = new BrowserWindow({
      frame: false,
      titleBarStyle: 'hidden',
      width: 1440,
      height: 1024,
      backgroundColor: "#1e1e1e",
      webPreferences: {
        // tsc or webpack が出力したプリロードスクリプトを読み込み
          preload: path.join(__dirname, 'scripts/mainWindowPreload.js'),
      },
    });

  // レンダラープロセスをロード
    mainWindow.loadFile('dist/index.html');
    mainWindow.webContents.openDevTools();

    ipcMain.on('titlebarEvent', (event, arg) => {
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
app.once('window-all-closed', () => app.quit());