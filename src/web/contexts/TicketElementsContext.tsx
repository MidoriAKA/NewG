import { ITicketElementsContext } from '@src/types/contexts/TicketElementsContext';
import { ITicket, TTicketColumn } from '@src/types/tickets';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSideMenuContext } from './SideMenuContext';

const TicketElementsContext = createContext({} as ITicketElementsContext);
export const useTicketElementsContext = () => {
  return useContext(TicketElementsContext);
}

export const TicketElementsContextProvider: React.FC<TAppProps> = ({ children }) => {

  const [currentActive, setCurrentActive] = useState<Active>("allTickets");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [filter, setFilter] = useState<TTicketColumn>("assignedToGroup");
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
    let sqlQuery = "";
    switch (currentActive) {
      case "allTickets":
        sqlQuery = `
        SELECT * FROM ticketDatas 
        ORDER BY ${orderBy} ${order} 
        LIMIT ${pageSize} OFFSET ${offset}
        `;
        break;
      case "notAssigned":
        sqlQuery = `
        SELECT * FROM ticketDatas 
        WHERE assignedToPerson IS NULL
        ORDER BY ${orderBy} ${order} 
        LIMIT ${pageSize} OFFSET ${offset}
        `;
        break;
      case "closed":
        sqlQuery = `
        SELECT * FROM ticketDatas 
        WHERE status = 'Fechado'
        ORDER BY ${orderBy} ${order} 
        LIMIT ${pageSize} OFFSET ${offset}
        `;
        break;
      case "n1":
        sqlQuery = `
        SELECT * FROM ticketDatas
        WHERE assignedToGroup = 'Nivel 1'
        ORDER BY ${orderBy} ${order}
        LIMIT ${pageSize} OFFSET ${offset}
        `;
        break;
      case "n2Sup":
        sqlQuery = `
        SELECT * FROM ticketDatas
        WHERE assignedToGroup = 'Nível 2 - Suporte'
        ORDER BY ${orderBy} ${order}
        LIMIT ${pageSize} OFFSET ${offset}
        `;
        break;
      case "n2Tech":
        sqlQuery = `
        SELECT * FROM ticketDatas
        WHERE assignedToGroup = 'Nível 2 - Tecnologia'
        ORDER BY ${orderBy} ${order}
        LIMIT ${pageSize} OFFSET ${offset}
        `;
        break;
      case "systems":
        sqlQuery = `
        SELECT * FROM ticketDatas
        WHERE assignedToGroup = 'Sistemas'
        ORDER BY ${orderBy} ${order}
        LIMIT ${pageSize} OFFSET ${offset}
        `;
        break;
    }
    return window.getGlpiDatas.getData(sqlQuery);
  }

  useEffect(() => {
    const fetchData = () => {
      getTicketsDatas(currentPage, pageSize, orderBy, order)
        .then((data: any) => {
          setShowingTickets(data);
          console.log(currentActive);
        });
    };

    fetchData();

    const intervalId = setInterval(fetchData, intervalMs);

    return () => clearInterval(intervalId);
  }, [currentActive, currentPage, pageSize, orderBy, order, intervalMs]);


  return (
    <TicketElementsContext.Provider
      value={{
        setCurrentActive,
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