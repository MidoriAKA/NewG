import React, { createContext, useContext, useState, useEffect } from 'react';

const TicketElementsContext = createContext<any>(null);
export const useTicketElementsContext = () => {
  return useContext(TicketElementsContext);
}

export const TicketElementsContextProvider: React.FC<TAppProps> = ({ children }) => {

  const [ticketsDatas, setTicketsDatas] = useState([] as Array<any>);

  const convertStringDateToDate = (datas: Array<any>) => {
    datas.forEach(element => {
      element[3][1] = new Date(element[3][1]);
      element[4][1] = new Date(element[4][1]);
    });
  }

  window.scrappedGlpiDatas.receiveData((data: Array<any>) => {
    let arrayedDatas = [] as Array<any>;
    data.forEach((data: any, index: number) => {
      data.ID = data.ID.replace(/\s/g, '');
      arrayedDatas[index] = Object.entries(data);
    });
    convertStringDateToDate(arrayedDatas);
    setTicketsDatas(arrayedDatas);
  });

  const onlyNotAssignedTickets = ticketsDatas.filter((ticket: any) => ticket[7][1] === "");

  return (
    <TicketElementsContext.Provider
      value={{
        ticketsDatas
      }}>
      {children}
    </TicketElementsContext.Provider>
  );
}