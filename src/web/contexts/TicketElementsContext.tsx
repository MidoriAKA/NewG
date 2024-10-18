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
  const [displayCount, setDisplayCount] = useState<number>(6);
  const [totalTicketsCount, setTotalTicketsCount] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
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
              if (data.length === 0) {
                setShowingTickets([]);
                setTotalTicketsCount(0);
              } else {
                setTotalTicketsCount(data.length);
                setShowingTickets(data.datas);
              }
            });
          break;
        default:
          getTicketsDatas()
            .then((data) => {
              if (data.length === 0) {
                setShowingTickets([]);
                setTotalTicketsCount(0);
              } else {
                setTotalTicketsCount(data.length);
                setShowingTickets(data.datas);
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
    displayCount,
    orderBy,
    order,
    searchQuery,
  ]);

  const queryTemplate = [
    "SELECT * FROM ticketDatas",
    "ORDER BY",
    `${orderBy} ${order}`,
    `LIMIT ${displayCount} OFFSET ${(currentPage - 1) * displayCount}`,
  ];
  const queryTemplateForSwitch = {
    notAssigned: "WHERE assignedToPerson = ''",
    closed: "WHERE status = 'Fechado'",
    n1: "WHERE assignedToGroup = 'Nivel 1'",
    n2Sup: "WHERE assignedToGroup = 'Nível 2 - Suporte'",
    n2Tech: "WHERE assignedToGroup = 'Nível 2 - Tecnologia'",
    systems: "WHERE assignedToGroup = 'Sistemas'"
  }
  const getTicketsDatas = () => {
    let sqlQuery: string[] = queryTemplate;
    switch (currentActive) {
      case "allTickets":
        break;
      case "notAssigned":
        if (!sqlQuery.includes(queryTemplateForSwitch.notAssigned)) {
          sqlQuery.splice(1, 0, queryTemplateForSwitch.notAssigned);
        }
        break;
      case "closed":
        if (!sqlQuery.includes(queryTemplateForSwitch.closed)) {
          sqlQuery.splice(1, 0, queryTemplateForSwitch.closed);
        }
        break;
      case "n1":
        if (!sqlQuery.includes(queryTemplateForSwitch.n1)) {
          sqlQuery.splice(1, 0, queryTemplateForSwitch.n1);
        }
        break;
      case "n2Sup":
        if (!sqlQuery.includes(queryTemplateForSwitch.n2Sup)) {
          sqlQuery.splice(1, 0, queryTemplateForSwitch.n2Sup);
        }
        break;
      case "n2Tech":
        if (!sqlQuery.includes(queryTemplateForSwitch.n2Tech)) {
          sqlQuery.splice(1, 0, queryTemplateForSwitch.n2Tech);
        }
        break;
      case "systems":
        if (!sqlQuery.includes(queryTemplateForSwitch.systems)) {
          sqlQuery.splice(1, 0, queryTemplateForSwitch.systems);
        }
        break;
    }
    return window.getGlpiDatas.getData(sqlQuery);
  }

  const handleSearch = (searchQuery: string) => {
    let sqlQuery: string[] = queryTemplate;
    const searchTemplate = {
      general: `
        AND (
              ID LIKE '%${searchQuery}%' OR
              title LIKE '%${searchQuery}%' OR
              requester LIKE '%${searchQuery}%' OR
              assignedToPerson LIKE '%${searchQuery}%' OR
              assignedToGroup LIKE '%${searchQuery}%'
            )
      `,
      all: `
        WHERE
        ID LIKE '%${searchQuery}%' OR
        title LIKE '%${searchQuery}%' OR
        requester LIKE '%${searchQuery}%' OR
        assignedToPerson LIKE '%${searchQuery}%' OR
        assignedToGroup LIKE '%${searchQuery}%'
      `,
      notAssigned: "WHERE assignedToPerson = ''",
      closed: "WHERE status = 'Fechado'",
      n1: "WHERE assignedToGroup = 'Nivel 1'",
      n2Sup: "WHERE assignedToGroup = 'Nível 2 - Suporte'",
      n2Tech: "WHERE assignedToGroup = 'Nível 2 - Tecnologia'",
      systems: "WHERE assignedToGroup = 'Sistemas'"
    }
    switch (currentActive) {
      case "allTickets":
        if (!sqlQuery.includes(searchTemplate.all)) {
          sqlQuery.splice(1, 0, searchTemplate.all);
        }
        break;
      case "notAssigned":
        if (!sqlQuery.includes(searchTemplate.notAssigned)) {
          sqlQuery.splice(1, 0, searchTemplate.notAssigned + searchTemplate.general);
        }
        break;
      case "closed":
        if (!sqlQuery.includes(searchTemplate.closed)) {
          sqlQuery.splice(1, 0, searchTemplate.closed + searchTemplate.general);
        }
        break;
      case "n1":
        if (!sqlQuery.includes(searchTemplate.n1)) {
          sqlQuery.splice(1, 0, searchTemplate.n1 + searchTemplate.general);
        }
        break;
      case "n2Sup":
        if (!sqlQuery.includes(searchTemplate.n2Sup)) {
          sqlQuery.splice(1, 0, searchTemplate.n2Sup + searchTemplate.general);
        }
        break;
      case "n2Tech":
        if (!sqlQuery.includes(searchTemplate.n2Tech)) {
          sqlQuery.splice(1, 0, searchTemplate.n2Tech + searchTemplate.general);
        }
        break;
      case "systems":
        if (!sqlQuery.includes(searchTemplate.systems)) {
          sqlQuery.splice(1, 0, searchTemplate.systems + searchTemplate.general);
        }
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
        displayCount,
        setDisplayCount,
        totalTicketsCount,
        offset,
        setOffset,
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