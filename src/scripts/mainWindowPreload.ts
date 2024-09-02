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
  },
});