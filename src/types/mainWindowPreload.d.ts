export interface ITitlebarEvents {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}
export  interface IScrappedGlpiDatas {
  receiveData: (callback: (data: Array<any>) => void) => void;
}

export interface IGetGlpisDatas {
  getData: (sqlQuery: string) => Promise<any>;
}

declare global {
  interface Window {
    titlebarEvents: ITitlebarEvents;
    scrappedGlpiDatas: IScrappedGlpiDatas;
    getGlpiDatas: IGetGlpisDatas;
  }
}