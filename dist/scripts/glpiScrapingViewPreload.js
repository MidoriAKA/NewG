"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
window.addEventListener("load", () => {
    console.log("currentURL: " + window.location.href);
    const csrfTokenInput = document.querySelector("input[name='_glpi_csrf_token']");
    const csrfToken = csrfTokenInput ? csrfTokenInput.value : null;
    if (csrfToken) {
        electron_1.ipcRenderer.send("glpiScrapingView-to-mainWindow:csrf-token", csrfToken);
    }
});
