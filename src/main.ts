import path, { delimiter, format } from "node:path";
import { app, BrowserView, BrowserWindow, ipcMain } from "electron";
import electronReload from "electron-reload";
import util from "util";
import Store, { Schema } from "electron-store";
import { ILoginStoreTypes } from "./types/main";
import fs from "fs";
import {parse} from "csv-parse";
import http from "http";
import { download } from "electron-dl";
import { json } from "stream/consumers";
import { finished } from "node:stream/promises";


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
    // ダウンロードしたCSVファイルをJsonに変換して保存する
    //ついでにwebcontent.sendでデータを返す
    ipcMain.on("glpiScrapingView-to-mainWindow:csrf-token", async (event, arg) => {
      const csvPath = app.getPath("userData") + "/downloaded.csv";
      const jsonPath = app.getPath("userData") + "/rawTicketsDatas.json";
      const formattedJsonPath = app.getPath("userData") + "/formattedTicketsDatas.json";
      const convertCsvToJson = async (csvPath: string, jsonPath: string) => {
        console.log("start");
        let csvData = fs.readFileSync(csvPath, "utf8");
        if (csvData.charCodeAt(0) === 0xFEFF) {
          csvData = csvData.slice(1);
        }

        const processFile = async () => {
          const records = [] as Array<any>;
          const parser = fs
            .createReadStream(csvPath)
            .pipe(parse({
              delimiter: ";",
              columns: true,
              skip_empty_lines: true,
              bom: true
            }));
          parser.on('readable', function(){
            let record; while ((record = parser.read()) !== null) {
            // Work with each record
              records.push(record);
            }
          });
          await finished(parser);
          return records;
        };
        const records = await processFile();

        // const parsedData = parse(csvData, { delimiter: ";", columns: true, skip_empty_lines: true});
        console.log("parsed");
        fs.writeFileSync(jsonPath, JSON.stringify(records, null, 4), "utf8");
        console.log("saved");
      }
      const formatJson = async (jsonPath: string, saveTo: string) => {
          const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
          let formattedJsonData = [] as Array<any>;
          // IDの空白を削除
          rawData.forEach((data: any, index: number) => {
            data.ID = data.ID.replace(/\s/g, '');
            formattedJsonData[index] = Object.entries(data);
          });
        
          // 各配列の最後の要素を削除
          formattedJsonData.forEach((element: any) => {
            element.pop();
          });
        
          // 日付の文字列を数字に変換
          formattedJsonData.forEach((element: any) => {
            element[3][1] = element[3][1].replace(/[-\s:]/g, '');
            element[3][1] = Number(element[3][1]);
            element[4][1] = element[4][1].replace(/[-\s:]/g, '');
            element[4][1] = Number(element[4][1]);
          });
          fs.writeFileSync(saveTo, JSON.stringify(formattedJsonData, null, 4), "utf8");
      }
      const sendTicketsDatas = async (formattedJsonPath: string) => {
        console.log("sending tickets datas");
        const ticketsDatas = JSON.parse(fs.readFileSync(formattedJsonPath, "utf8"));
        mainWindow.webContents.send("scrappedGlpiDatas:receiveData", ticketsDatas);
        console.log("sent");
      }
      
      const requestURLQuery = [
        ["http://atendimentosti.ad.daer.rs.gov.br/front/report.dynamic.php?item_type=Ticket"],
        ["sort=19"],
        ["order=DESC"],
        ["criteria%5B0%5D%5Bfield%5D=12"],
        ["criteria%5B0%5D%5Bsearchtype%5D=equals"],
        ["criteria%5B0%5D%5Bvalue%5D=all"],
        ["criteria%5B1%5D%5Blink%5D=AND"],
        ["criteria%5B1%5D%5Bfield%5D=15"],
        ["criteria%5B1%5D%5Bsearchtype%5D=morethan"],
        ["criteria%5B1%5D%5Bvalue%5D=-1YEAR"],
        ["display_type=-3"],
        ["export.x=11"],
        ["export.y=9"],
        ["_glpi_csrf_token="]
      ]
      const requestURL = requestURLQuery.join("&") + arg;

      await download(mainWindow, requestURL, {
        directory: app.getPath("userData"),
        filename: "downloaded.csv",
        saveAs: false,
      });
      await convertCsvToJson(csvPath, jsonPath);
      await formatJson(jsonPath, formattedJsonPath);
      await sendTicketsDatas(formattedJsonPath);
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