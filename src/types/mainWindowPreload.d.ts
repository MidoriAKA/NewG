import { ITicket } from "./tickets";

export interface ITitlebarEvents {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}
export  interface IScrappedGlpiDatas {
  receiveData: (callback: (data: Array<any>) => void) => void;
}

interface IResponseOfGetGlpiDatas {
  length: number;
  datas: ITicket[];
}
export interface IGetGlpisDatas {
  getData: (sqlQuery: string[]) => Promise<IResponseOfGetGlpiDatas>;
}

declare global {
  interface Window {
    titlebarEvents: ITitlebarEvents;
    scrappedGlpiDatas: IScrappedGlpiDatas;
    getGlpiDatas: IGetGlpisDatas;
  }
}