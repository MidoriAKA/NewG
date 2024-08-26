import { ipcRenderer } from 'electron';

export const TitleBarViewModel = () => {
  const buttonsEvents = (arg: string) => {
    ipcRenderer.send("titlebarEvent", arg);
  };
  return {
    buttonsEvents
  };
}