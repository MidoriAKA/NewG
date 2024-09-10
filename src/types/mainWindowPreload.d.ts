export interface ITitlebarEvents {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}
export  interface IScrappedGlpiDatas {
  getData: () => Promise<void>;
}

declare global {
  interface Window {
    titlebarEvents: ITitlebarEvents;
    scrappedGlpiDatas: IScrappedGlpiDatas;
  }
}