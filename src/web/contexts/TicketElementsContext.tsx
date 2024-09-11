import React, { createContext, useContext, useState, useEffect } from 'react';

const TicketElementsContext = createContext<any>(null);
export const useTicketElementsContext = () => {
  return useContext(TicketElementsContext);
}

export const TicketElementsContextProvider: React.FC<TAppProps> = ({ children }) => {

  const [ticketsDatas, setTicketsDatas] = useState([] as any);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datas = await window.scrappedGlpiDatas.getData();
        let arrayedDatas = [] as any;
        datas.map((data: any, index: number) => {
          data.ID = data.ID.replace(/\s/g, '');
          arrayedDatas[index] = Object.entries(data);
        });
        setTicketsDatas(arrayedDatas);
      } catch (error) {
      }
    };

    fetchData();
  }, []);

  return (
    <TicketElementsContext.Provider
      value={{
        ticketsDatas
      }}>
      {children}
    </TicketElementsContext.Provider>
  );
}