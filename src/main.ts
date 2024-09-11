import path, { delimiter } from "node:path";
import { app, BrowserView, BrowserWindow, ipcMain } from "electron";
import electronReload from "electron-reload";
import util from "util";
import Store, { Schema } from "electron-store";
import { ILoginStoreTypes } from "./types/main";
import fs from "fs";
import {parse} from "csv-parse";
import http from "http";
import { download } from "electron-dl";


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
      titleBarStyle: "hidden",
      width: 1440,
      height: 1024,
      backgroundColor: "#1e1e1e",
      webPreferences: {
        // tsc or webpack が出力したプリロードスクリプトを読み込み
          preload: path.join(__dirname, "scripts/mainWindowPreload.js"),
      },
    });
    //GLPIスクレイピング用のBrowserViewを作成
    const glpiScrapingView = new BrowserView({
      webPreferences: {
        preload: path.join(__dirname, "scripts/glpiScrapingViewPreload.js"),
      }
    })
    glpiScrapingView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    glpiScrapingView.webContents.loadURL("");
    mainWindow.addBrowserView(glpiScrapingView);
    //Ticketスクレイピング用のBrowserViewを作成
    const ticketScrapingView = new BrowserView({
      webPreferences: {
        preload: path.join(__dirname, "scripts/ticketScrapingViewPreload.js"),
      }
    })
    ticketScrapingView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    ticketScrapingView.webContents.loadURL("");
    mainWindow.addBrowserView(ticketScrapingView);

    const loginWindow = new BrowserWindow({
      width: 800,
      height: 500,
      frame: false,
      parent: mainWindow,
      webPreferences: {
        preload: path.join(__dirname, "scripts/loginWindowPreload.js"),
      }});

      loginWindow.webContents.loadURL("http://atendimentosti.ad.daer.rs.gov.br/index.php?noAUTO=1");


  // レンダラープロセスをロード
    mainWindow.loadFile("dist/index.html");
    mainWindow.webContents.openDevTools();

  // IPC通信のリスナーを設定
  // ログイン関連のIPC通信
    ipcMain.handle("loginWindow-to-mainWindow:login-data", () => {
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

    ipcMain.on("loginWindow-to-mainWindow:has-logged", (event, arg) => {
      console.log("has logged - " + arg);
      loginWindow.destroy();
      glpiScrapingView.webContents.loadURL("http://atendimentosti.ad.daer.rs.gov.br/front/ticket.php?reset=reset");
    });

    ipcMain.on("loginWindow-to-mainWindow:store-login-data", (event, arg) => {
      loginStore.set(arg);
    });

  // GLPIスクレイピング関連のIPC通信
    ipcMain.on("glpiScrapingView-to-mainWindow:csrf-token", async (event, arg) => {
      console.log("csrfToken: " + arg);

      // ダウンロードしたCSVファイルをJsonに変換して連想配列にする
      const downloadPath = app.getPath("userData") + "/output.csv";
      const outputPath = app.getPath("userData") + "/output.json";
      const convertCsvToJson = (csvPath: string, jsonPath: string): Promise<void> => {
        return new Promise((resolve, reject) => {

          let csvData = fs.readFileSync(csvPath, "utf8");
          if (csvData.charCodeAt(0) === 0xFEFF) {
            csvData = csvData.slice(1);
          }
          
          parse(csvData, {
              delimiter: ";",
              columns: true,
              skip_empty_lines: true,
            }, (err, output) => {
              if (err) {
                reject(err);
                return;
              }
              fs.writeFileSync(jsonPath, JSON.stringify(output, null, 4), "utf8");
            });

            resolve();
          });
    }
      const getCsvLink = `http://atendimentosti.ad.daer.rs.gov.br/front/report.dynamic.php?item_type=Ticket&sort=19&order=DESC&criteria%5B0%5D%5Bfield%5D=12&criteria%5B0%5D%5Bsearchtype%5D=equals&criteria%5B0%5D%5Bvalue%5D=notold&display_type=-3&export.x=14&export.y=8&_glpi_csrf_token=${arg}`;
      download(glpiScrapingView,getCsvLink, {
        directory: app.getPath("userData"),
        filename: "output.csv",
      }).then(() => {
        console.log("csv file downloaded");
        convertCsvToJson(downloadPath, outputPath)
          .then(() => {
            console.log("csv file converted to json");
          })
          .catch((error) => {
            console.error(error);
          });
      }).catch((error) => {
        console.error(error);
      });
    });
      
    ipcMain.handle("scrappedGlpiDatas:getData", async () => {
      const getGlpiData = async () => {
        const outputPath = app.getPath("userData") + "/output.json";
        return JSON.parse(fs.readFileSync(outputPath, "utf8"));
      }
      return await getGlpiData();
    });


  //タイトルバー関連のIPC通信
    ipcMain.on("titlebarEvent", (event, arg) => {
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
app.once("window-all-closed", () => app.quit());