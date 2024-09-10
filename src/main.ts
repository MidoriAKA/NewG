import path from 'node:path';
import { app, BrowserWindow, ipcMain } from "electron";
import electronReload from "electron-reload";
import util from 'util';
import Store, { Schema } from "electron-store";
import { ILoginStoreTypes } from './types/main';

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


const loginStore = new Store<ILoginStoreTypes>({
  encryptionKey: "loginData",
  cwd: app.getPath("userData"),
  schema: {
    login: {
      type: "string",
      default: "",
    },
    password: {
      type: "string",
      default: "",
    },
  } as Schema<ILoginStoreTypes>,
});

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

    const loginWindow = new BrowserWindow({
      width: 800,
      height: 500,
      frame: false,
      parent: mainWindow,
      webPreferences: {
        preload: path.join(__dirname, 'scripts/loginWindowPreload.js'),
      }});

      loginWindow.webContents.loadURL("http://atendimentosti.ad.daer.rs.gov.br/index.php?noAUTO=1");


  // レンダラープロセスをロード
    mainWindow.loadFile('dist/index.html');
    mainWindow.webContents.openDevTools();

  // レンダラープロセスからのメッセージを受信
    ipcMain.handle('loginWindow-to-mainWindow:login-data', () => {
      function getLoginData() {
        console.log("getting login data");
        const loginData = {
          login: loginStore.get("login"),
          password: loginStore.get("password"),
        }
        console.log("loginData: " + util.inspect(loginData));
        return loginData.login === "" ? null : loginData;
      }
      return getLoginData();
    });

    ipcMain.on('loginWindow-to-mainWindow:has-logged', (event, arg) => {
      console.log("has logged - " + arg);
      loginWindow.destroy();
    });

    ipcMain.on('loginWindow-to-mainWindow:store-login-data', (event, arg) => {
      loginStore.set(arg);
    });

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