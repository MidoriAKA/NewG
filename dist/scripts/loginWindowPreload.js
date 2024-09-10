"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        let currentURL = window.location.href;
        const expectedURL = [
            "http://atendimentosti.ad.daer.rs.gov.br/index.php?noAUTO=1",
            "http://atendimentosti.ad.daer.rs.gov.br/index.php?redirect=%2Ffront%2Fticket.php&error=3",
            "http://atendimentosti.ad.daer.rs.gov.br/front/login.php"
        ];
        if (!expectedURL.includes(currentURL)) {
            electron_1.ipcRenderer.send("loginWindow-to-mainWindow:has-logged", currentURL);
        }
    }
};
window.addEventListener("load", async () => {
    const loginForm = document.querySelector("form");
    const loginFormName = document.getElementById("login_name");
    const loginFormPassword = document.getElementById("login_password");
    const storedLoginData = await electron_1.ipcRenderer.invoke("loginWindow-to-mainWindow:login-data");
    if (storedLoginData) {
        console.log("loginData wasnt null - " + storedLoginData);
        loginFormName.value = storedLoginData.login;
        loginFormPassword.value = storedLoginData.password;
        const submitButton = document.querySelector("input[type='submit']");
        submitButton.click();
    }
    console.log("loginData was null - " + storedLoginData);
    loginForm.addEventListener("submit", async (event) => {
        electron_1.ipcRenderer.send("loginWindow-to-mainWindow:store-login-data", {
            login: loginFormName.value,
            password: loginFormPassword.value,
        });
    });
});
