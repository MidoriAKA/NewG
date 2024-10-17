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

ipcRenderer.on("scrappedGlpiDatas:receiveData", (event, data) => {
  console.log("scrappedGlpiDatas:receiveData");

});

contextBridge.exposeInMainWorld("scrappedGlpiDatas", {
  receiveData: (callback: (data: Array<any>) => void) =>
    ipcRenderer.on(
      "scrappedGlpiDatas:receiveData", (event, data: Array<any>) => 
      callback(data))
}); //Old code

contextBridge.exposeInMainWorld("getGlpiDatas", {
  getData: (sqlQuery: string) => ipcRenderer.invoke("getGlpiDatas", sqlQuery),
  
});
