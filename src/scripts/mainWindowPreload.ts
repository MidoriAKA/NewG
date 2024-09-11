import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("titlebarEvents", {
  close: () => {
    ipcRenderer.send("titlebarEvent", "close");
  },
  minimize: () => {
    ipcRenderer.send("titlebarEvent", "minimize");
  },
  maximize: () => {
    ipcRenderer.send("titlebarEvent", "maximize");
  }
});


contextBridge.exposeInMainWorld("scrappedGlpiDatas", {
  getData: () => ipcRenderer.invoke("scrappedGlpiDatas:getData")
});
