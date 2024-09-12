import React, { createContext, useContext, useState, useEffect } from 'react';

const TicketElementsContext = createContext<any>(null);
export const useTicketElementsContext = () => {
  return useContext(TicketElementsContext);
}

export const TicketElementsContextProvider: React.FC<TAppProps> = ({ children }) => {

  const [ticketsDatas, setTicketsDatas] = useState([] as Array<any>);

  window.scrappedGlpiDatas.receiveData((data: Array<any>) => {
    setTicketsDatas(data);
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