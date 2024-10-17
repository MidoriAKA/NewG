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
  const [orderBy, setOrderBy] = useState<TTicketColumn>("lastUpdate");
  const [order, setOrder] = useState<string>("DESC");
  const [showingTickets, setShowingTickets] = useState<ITicket[]>([]);
  const [intervalMs, setIntervalMs] = useState<number>(5000);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = () => {
      switch (searchQuery !== "") {
        case true:
          handleSearch(searchQuery)
            .then((data) => {
              if (data[0].ID === 0) {
                setShowingTickets([]);
              } else {
                setShowingTickets(data);
              }
            });
          break;
        default:
          getTicketsDatas()
            .then((data) => {
              if (data[0].ID === 0) {
                setShowingTickets([]);
              } else {
                setShowingTickets(data);
              }
            });
          break;
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, intervalMs);

    return () => clearInterval(intervalId);
  }, [
    currentActive,
    currentPage,
    pageSize,
    orderBy,
    order,
    searchQuery,
  ]);

  const queryTemplate = [
    "SELECT * FROM ticketDatas",
    "ORDER BY",
    `${orderBy} ${order}`,
    `LIMIT ${pageSize} OFFSET ${(currentPage - 1) * pageSize}`,
  ];
  const getTicketsDatas = () => {
    let sqlQuery = "";
    switch (currentActive) {
      case "allTickets":
        sqlQuery = queryTemplate.join(" ");
        break;
      case "notAssigned":
        queryTemplate.splice(1, 0, "WHERE assignedToPerson = ''");
        sqlQuery = queryTemplate.join(" ");
        break;
      case "closed":
        queryTemplate.splice(1, 0, "WHERE status = 'Fechado'");
        sqlQuery = queryTemplate.join(" ");
        break;
      case "n1":
        queryTemplate.splice(1, 0, "WHERE assignedToGroup = 'Nivel 1'");
        sqlQuery = queryTemplate.join(" ");
        break;
      case "n2Sup":
        queryTemplate.splice(1, 0, "WHERE assignedToGroup = 'Nível 2 - Suporte'");
        sqlQuery = queryTemplate.join(" ");
        break;
      case "n2Tech":
        queryTemplate.splice(1, 0, "WHERE assignedToGroup = 'Nível 2 - Tecnologia'");
        sqlQuery = queryTemplate.join(" ");
        break;
      case "systems":
        queryTemplate.splice(1, 0, "WHERE assignedToGroup = 'Sistemas'");
        sqlQuery = queryTemplate.join(" ");
        break;
    }
    return window.getGlpiDatas.getData(sqlQuery);
  }

  const handleSearch = (searchQuery: string) => {
    let sqlQuery = "";
    const serachTemplate = `
      AND (
            ID LIKE '%${searchQuery}%' OR
            title LIKE '%${searchQuery}%' OR
            requester LIKE '%${searchQuery}%' OR
            assignedToPerson LIKE '%${searchQuery}%' OR
            assignedToGroup LIKE '%${searchQuery}%'
          )
    `;
    switch (currentActive) {
      case "allTickets":
        sqlQuery = `
          SELECT * FROM ticketDatas
          WHERE
            ID LIKE '%${searchQuery}%' OR
            title LIKE '%${searchQuery}%' OR
            requester LIKE '%${searchQuery}%' OR
            assignedToPerson LIKE '%${searchQuery}%' OR
            assignedToGroup LIKE '%${searchQuery}%'
          ORDER BY ${orderBy} ${order}
          LIMIT ${pageSize} OFFSET ${(currentPage - 1) * pageSize}
        `;
        break;
      case "notAssigned":
        queryTemplate.splice(1, 0, "WHERE assignedToPerson = ''" + serachTemplate);
        sqlQuery = queryTemplate.join(" ");
        break;
      case "closed":
        queryTemplate.splice(1, 0, "WHERE status = 'Fechado'" + serachTemplate);
        sqlQuery = queryTemplate.join(" ");
        break;
      case "n1":
        queryTemplate.splice(1, 0, "WHERE assignedToGroup = 'Nivel 1'" + serachTemplate);
        sqlQuery = queryTemplate.join(" ");
        break;
      case "n2Sup":
        queryTemplate.splice(1, 0, "WHERE assignedToGroup = 'Nível 2 - Suporte'" + serachTemplate);
        sqlQuery = queryTemplate.join(" ");
        break;
      case "n2Tech":
        queryTemplate.splice(1, 0, "WHERE assignedToGroup = 'Nível 2 - Tecnologia'" + serachTemplate);
        sqlQuery = queryTemplate.join(" ");
        break;
      case "systems":
        queryTemplate.splice(1, 0, "WHERE assignedToGroup = 'Sistemas'" + serachTemplate);
        sqlQuery = queryTemplate.join(" ");
        break;
    }
    return window.getGlpiDatas.getData(sqlQuery)
  }


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
        setShowingTickets,
        setSearchQuery,
      }}>
      {children}
    </TicketElementsContext.Provider>
  );
}