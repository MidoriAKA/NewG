"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("titlebarEvents", {
    close: () => {
        electron_1.ipcRenderer.send("titlebarEvent", "close");
    },
    minimize: () => {
        electron_1.ipcRenderer.send("titlebarEvent", "minimize");
    },
    maximize: () => {
        electron_1.ipcRenderer.send("titlebarEvent", "maximize");
    }
});
electron_1.ipcRenderer.on("scrappedGlpiDatas:receiveData", (event, data) => {
    console.log("scrappedGlpiDatas:receiveData");
});
electron_1.contextBridge.exposeInMainWorld("scrappedGlpiDatas", {
    receiveData: (callback) => electron_1.ipcRenderer.on("scrappedGlpiDatas:receiveData", (event, data) => callback(data))
}); //Old code
electron_1.contextBridge.exposeInMainWorld("getGlpiDatas", {
    getData: (sqlQuery) => electron_1.ipcRenderer.invoke("getGlpiDatas", sqlQuery),
});
