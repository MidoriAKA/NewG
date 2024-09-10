import { ILoginStoreTypes } from "@src/types/main";
import { ipcRenderer } from "electron";

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    let currentURL = window.location.href;
    const expectedURL = [
      "http://atendimentosti.ad.daer.rs.gov.br/index.php?noAUTO=1",
      "http://atendimentosti.ad.daer.rs.gov.br/index.php?redirect=%2Ffront%2Fticket.php&error=3",
      "http://atendimentosti.ad.daer.rs.gov.br/front/login.php"
    ];
    if (!expectedURL.includes(currentURL)) {
      ipcRenderer.send("loginWindow-to-mainWindow:has-logged", currentURL);
    }
  }
};

window.addEventListener("load", async () => {
  const loginForm = document.querySelector("form") as HTMLFormElement;
  const loginFormName = document.getElementById("login_name") as HTMLInputElement;
  const loginFormPassword = document.getElementById("login_password") as HTMLInputElement;
  const storedLoginData = await ipcRenderer.invoke("loginWindow-to-mainWindow:login-data") as ILoginStoreTypes;

  if (storedLoginData) {
    console.log("loginData wasnt null - " + storedLoginData);
    loginFormName.value = storedLoginData.login;
    loginFormPassword.value = storedLoginData.password;
    const submitButton = document.querySelector("input[type='submit']") as HTMLButtonElement;
    submitButton.click();
  }

  console.log("loginData was null - " + storedLoginData);
  loginForm.addEventListener("submit", async (event) => {
    ipcRenderer.send("loginWindow-to-mainWindow:store-login-data", {
      login: loginFormName.value,
      password: loginFormPassword.value,
    } as ILoginStoreTypes);
  });
});

