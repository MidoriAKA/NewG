export interface ITitlebarEvents {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}
export  interface IScrappedGlpiDatas {
  receiveData: (callback: (data: Array<any>) => void) => void;
}

declare global {
  interface Window {
    titlebarEvents: ITitlebarEvents;
    scrappedGlpiDatas: IScrappedGlpiDatas;
  }
}