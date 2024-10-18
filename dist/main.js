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
const promises_1 = require("node:stream/promises");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("glpiDatas.db");
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
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS ticketDatas (
    ID INTEGER PRIMARY KEY,
    title TEXT,
    status TEXT,
    lastUpdate INTEGER,
    openDate INTEGER,
    priority TEXT,
    requester TEXT,
    assignedToPerson TEXT,
    assignedToGroup TEXT,
    category TEXT,
    approvalStatus TEXT,
    timeToSolution TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS info (datasLength TEXT)`);
});
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
        backgroundColor: "#1b1b1b",
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
        const csvPath = electron_1.app.getPath("userData") + "/downloaded.csv";
        const jsonPath = electron_1.app.getPath("userData") + "/rawTicketsDatas.json";
        const formattedJsonPath = electron_1.app.getPath("userData") + "/formattedTicketsDatas.json";
        const downloadCsv = async (url, saveTo) => {
            const saveAs = saveTo.split("/").pop();
            console.log("downloading");
            await (0, electron_dl_1.download)(mainWindow, url, {
                saveAs: false,
                directory: electron_1.app.getPath("userData"),
                filename: saveAs,
            });
            console.log("downloaded");
        };
        const convertCsvToJson = async (csvPath, jsonPath) => {
            console.log("start");
            let csvData = fs_1.default.readFileSync(csvPath, "utf8");
            if (csvData.charCodeAt(0) === 0xFEFF) {
                csvData = csvData.slice(1);
            }
            const processFile = async () => {
                const records = [];
                const parser = fs_1.default
                    .createReadStream(csvPath)
                    .pipe((0, csv_parse_1.parse)({
                    delimiter: ";",
                    columns: true,
                    skip_empty_lines: true,
                    bom: true
                }));
                parser.on('readable', function () {
                    let record;
                    while ((record = parser.read()) !== null) {
                        // Work with each record
                        records.push(record);
                    }
                });
                await (0, promises_1.finished)(parser);
                return records;
            };
            const records = await processFile();
            // const parsedData = parse(csvData, { delimiter: ";", columns: true, skip_empty_lines: true});
            console.log("parsed");
            fs_1.default.writeFileSync(jsonPath, JSON.stringify(records, null, 4), "utf8");
            console.log("saved");
        };
        const formatJson = async (jsonPath, saveTo) => {
            const rawData = JSON.parse(fs_1.default.readFileSync(jsonPath, "utf8"));
            let formattedJsonData = [];
            // IDの空白を削除
            rawData.forEach((data) => {
                data.ID = data.ID.replace(/\s/g, '');
                formattedJsonData.push({
                    ID: data.ID,
                    title: data["Título"],
                    status: data["Status"],
                    lastUpdate: data["Última atualização"],
                    openDate: data["Data de abertura"],
                    priority: data["Prioridade"],
                    requester: data["Requerente - Requerente"],
                    assignedToPerson: data["Atribuído para - Técnico"],
                    assignedToGroup: data["Atribuído para - Grupo técnico"],
                    category: data["Categoria"],
                    approvalStatus: data["Aprovação - Status de aprovação"],
                    timeToSolution: data["Tempo para solução + Progresso"],
                });
            });
            // IDと日付の型を数字に変換し、日付の書式をYYYYMMDDHHmmss形式にする
            formattedJsonData.forEach((element) => {
                if (typeof element.ID === "string") {
                    element.ID = Number(element.ID);
                }
                if (typeof element.lastUpdate === "string") {
                    element.lastUpdate = element.lastUpdate.replace(/[-\s:]/g, '');
                    element.lastUpdate = element.lastUpdate.replace(/(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})/, '$3$2$1$4$5');
                    element.lastUpdate = Number(element.lastUpdate);
                }
                if (typeof element.openDate === "string") {
                    element.openDate = element.openDate.replace(/[-\s:]/g, '');
                    element.openDate = element.openDate.replace(/(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})/, '$3$2$1$4$5');
                    element.openDate = Number(element.openDate);
                }
            });
            fs_1.default.writeFileSync(saveTo, JSON.stringify(formattedJsonData, null, 4), "utf8");
        };
        const insertOrUpdateTicket = async (datas) => {
            const query = `INSERT OR REPLACE INTO ticketDatas (
          ID,
          title,
          status,
          lastUpdate,
          openDate,
          priority,
          requester,
          assignedToPerson,
          assignedToGroup,
          category,
          approvalStatus,
          timeToSolution
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
            db.run(query, [
                datas.ID,
                datas.title,
                datas.status,
                datas.lastUpdate,
                datas.openDate,
                datas.priority,
                datas.requester,
                datas.assignedToPerson,
                datas.assignedToGroup,
                datas.category,
                datas.approvalStatus,
                datas.timeToSolution
            ], (err) => {
                if (err) {
                    return console.error(err.message);
                }
            });
        };
        const saveJsonToDb = async (formattedJsonPath) => {
            const rawDatas = JSON.parse(fs_1.default.readFileSync(formattedJsonPath, "utf8"));
            rawDatas.forEach((data) => {
                insertOrUpdateTicket(data);
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
            ["criteria%5B1%5D%5Bvalue%5D=-3MONTH"],
            ["display_type=-3"],
            ["export.x=11"],
            ["export.y=9"],
            ["_glpi_csrf_token="]
        ];
        const requestURL = requestURLQuery.join("&") + arg;
        db.get("SELECT datasLength FROM info", async (err, row) => {
            if (row === undefined) {
                console.log("execute 1YEAR");
                requestURLQuery[9] = ["criteria%5B1%5D%5Bvalue%5D=-1YEAR"];
                const requestURL1Year = requestURLQuery.join("&") + arg;
                await downloadCsv(requestURL1Year, csvPath);
                db.run("INSERT INTO info (datasLength) VALUES (?)", ["1YEAR"], (err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                });
            }
            else {
                console.log("execute 3MONTH");
                await downloadCsv(requestURL, csvPath);
            }
        });
        await convertCsvToJson(csvPath, jsonPath);
        await formatJson(jsonPath, formattedJsonPath);
        await saveJsonToDb(formattedJsonPath);
    });
    //DBからデータを取得してレンダラープロセスに送信
    electron_1.ipcMain.handle("getGlpiDatas", async (event, sqlQuery) => {
        const datas = {
            length: Number,
            datas: (Array)
        };
        const query = sqlQuery.join(" ");
        const queryLength = [...sqlQuery];
        queryLength.shift();
        queryLength.unshift("SELECT COUNT(*) FROM ticketDatas");
        queryLength.pop();
        const queryLengthStr = queryLength.join(" ");
        return new Promise((res, rej) => {
            db.serialize(() => {
                db.get(queryLengthStr, (err, row) => {
                    if (err) {
                        rej(err);
                        return;
                    }
                    datas.length = row["COUNT(*)"];
                    db.all(query, (err, rows) => {
                        if (err) {
                            rej(err);
                            return;
                        }
                        datas.datas = rows;
                        res(datas);
                    });
                });
            });
        });
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
