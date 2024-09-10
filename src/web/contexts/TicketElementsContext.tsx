import React, { createContext, useContext, useState, useEffect } from 'react';

const TicketElementsContext = createContext<any>(null);
export const useTicketElementsContext = () => {
  return useContext(TicketElementsContext);
}

export const TicketElementsContextProvider: React.FC<TAppProps> = ({ children }) => {

  const [testData, setTestData] = useState([] as Array<any>);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await window.scrappedGlpiDatas.getData();
        setTestData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <TicketElementsContext.Provider
      value={{
        testData
      }}>
      {children}
    </TicketElementsContext.Provider>
  );
}