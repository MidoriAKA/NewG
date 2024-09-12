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
const fs_1 = __importDefault(require("fs"));
const csv_parse_1 = require("csv-parse");
const electron_dl_1 = require("electron-dl");
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
        titleBarStyle: "hidden",
        width: 1440,
        height: 1024,
        backgroundColor: "#1e1e1e",
        webPreferences: {
            // tsc or webpack が出力したプリロードスクリプトを読み込み
            preload: node_path_1.default.join(__dirname, "scripts/mainWindowPreload.js"),
        },
    });
    //GLPIスクレイピング用のBrowserViewを作成
    const glpiScrapingView = new electron_1.BrowserView({
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "scripts/glpiScrapingViewPreload.js"),
        }
    });
    glpiScrapingView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    glpiScrapingView.webContents.loadURL("");
    mainWindow.addBrowserView(glpiScrapingView);
    //Ticketスクレイピング用のBrowserViewを作成
    const ticketScrapingView = new electron_1.BrowserView({
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "scripts/ticketScrapingViewPreload.js"),
        }
    });
    ticketScrapingView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    ticketScrapingView.webContents.loadURL("");
    mainWindow.addBrowserView(ticketScrapingView);
    const loginWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 500,
        frame: false,
        parent: mainWindow,
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "scripts/loginWindowPreload.js"),
        }
    });
    loginWindow.webContents.loadURL("http://atendimentosti.ad.daer.rs.gov.br/index.php?noAUTO=1");
    // レンダラープロセスをロード
    mainWindow.loadFile("dist/index.html");
    mainWindow.webContents.openDevTools();
    // IPC通信のリスナーを設定
    // ログイン関連のIPC通信
    electron_1.ipcMain.handle("loginWindow-to-mainWindow:login-data", () => {
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
    electron_1.ipcMain.on("loginWindow-to-mainWindow:has-logged", (event, arg) => {
        console.log("has logged - " + arg);
        loginWindow.destroy();
        glpiScrapingView.webContents.loadURL("http://atendimentosti.ad.daer.rs.gov.br/front/ticket.php?reset=reset");
    });
    electron_1.ipcMain.on("loginWindow-to-mainWindow:store-login-data", (event, arg) => {
        loginStore.set(arg);
    });
    // GLPIスクレイピング関連のIPC通信
    // ダウンロードしたCSVファイルをJsonに変換して保存する
    //ついでにwebcontent.sendでデータを返す
    electron_1.ipcMain.on("glpiScrapingView-to-mainWindow:csrf-token", async (event, arg) => {
        const downloadPath = electron_1.app.getPath("userData") + "/output.csv";
        const outputPath = electron_1.app.getPath("userData") + "/output.json";
        const convertCsvToJson = (csvPath, jsonPath) => {
            return new Promise((resolve, reject) => {
                let csvData = fs_1.default.readFileSync(csvPath, "utf8");
                if (csvData.charCodeAt(0) === 0xFEFF) {
                    csvData = csvData.slice(1);
                }
                (0, csv_parse_1.parse)(csvData, {
                    delimiter: ";",
                    columns: true,
                    skip_empty_lines: true,
                }, (err, output) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    fs_1.default.writeFileSync(jsonPath, JSON.stringify(output, null, 4), "utf8");
                });
                resolve();
            });
        };
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
        ];
        const requestURL = requestURLQuery.join("&") + arg;
        (0, electron_dl_1.download)(glpiScrapingView, requestURL, {
            directory: electron_1.app.getPath("userData"),
            filename: "output.csv",
        }).then(() => {
            console.log("downloaded");
            convertCsvToJson(downloadPath, outputPath)
                .then(async () => {
                console.log("converted");
                mainWindow.webContents.send("scrappedGlpiDatas:receiveData", await getGlpiData());
            })
                .catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
        const getGlpiData = async () => {
            return JSON.parse(fs_1.default.readFileSync(outputPath, "utf8"));
        };
    });
    //タイトルバー関連のIPC通信
    electron_1.ipcMain.on("titlebarEvent", (event, arg) => {
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
electron_1.app.once("window-all-closed", () => electron_1.app.quit());
