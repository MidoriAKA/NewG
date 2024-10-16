import { ITicketElementsContext } from '@src/types/contexts/TicketElementsContext';
import { ITicket, TTicketColumn } from '@src/types/tickets';
import React, { createContext, useContext, useState, useEffect } from 'react';

const TicketElementsContext = createContext({} as ITicketElementsContext);
export const useTicketElementsContext = () => {
  return useContext(TicketElementsContext);
}

export const TicketElementsContextProvider: React.FC<TAppProps> = ({ children }) => {

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [orderBy, setOrderBy] = useState<TTicketColumn>("lastUpdate");
  const [order, setOrder] = useState<string>("DESC");
  const [showingTickets, setShowingTickets] = useState<ITicket[]>([]);
  const [intervalMs, setIntervalMs] = useState<number>(5000);

  const getTicketsDatas = (
    currentPage: number,
    pageSize: number,
    orderBy: string,
    order: string,
  ) => {
    const offset = (currentPage - 1) * pageSize;
    const sqlQuery = `
      SELECT * FROM ticketDatas
      ORDER BY ${orderBy} ${order}
      LIMIT ${pageSize} OFFSET ${offset}
      `;
    return window.getGlpiDatas.getData(sqlQuery);
  }

  useEffect(() => {
    const fetchData = () => {
      getTicketsDatas(currentPage, pageSize, orderBy, order)
        .then((data: any) => {
          setShowingTickets(data);
        });
    };

    fetchData();

    const intervalId = setInterval(fetchData, intervalMs);

    return () => clearInterval(intervalId);
  }, [currentPage, pageSize, orderBy, order, intervalMs]);


  return (
    <TicketElementsContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        orderBy,
        setOrderBy,
        order,
        setOrder,
        showingTickets,
        setShowingTickets
      }}>
      {children}
    </TicketElementsContext.Provider>
  );
}