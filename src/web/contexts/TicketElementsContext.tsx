import React, { createContext, useContext, useState, useEffect } from 'react';

const TicketElementsContext = createContext<any>(null);
export const useTicketElementsContext = () => {
  return useContext(TicketElementsContext);
}

export const TicketElementsContextProvider: React.FC<TAppProps> = ({ children }) => {

  const [testData, setTestData] = useState([] as Array<any>);

  return (
    <TicketElementsContext.Provider
      value={{
        testData,
        setTestData
      }}>
      {children}
    </TicketElementsContext.Provider>
  );
}