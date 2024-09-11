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
electron_1.contextBridge.exposeInMainWorld("scrappedGlpiDatas", {
    getData: () => electron_1.ipcRenderer.invoke("scrappedGlpiDatas:getData")
});
