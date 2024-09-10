import { ipcMain, ipcRenderer } from "electron";

window.addEventListener("load", () => {
  console.log("currentURL: " + window.location.href);
  const csrfTokenInput = document.querySelector("input[name='_glpi_csrf_token']") as HTMLInputElement;
  const csrfToken = csrfTokenInput ? csrfTokenInput.value : null;
  if (csrfToken) {
    ipcRenderer.send("glpiScrapingView-to-mainWindow:csrf-token", csrfToken);
  }
});