export interface ITitlebarEvents {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}
export  interface IScrappedGlpiDatas {
  getData: () => Promise<Array<any>>;
}

declare global {
  interface Window {
    titlebarEvents: ITitlebarEvents;
    scrappedGlpiDatas: IScrappedGlpiDatas;
  }
}