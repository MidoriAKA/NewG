import { ITicket, TTicketColumn } from "../tickets";

interface ITicketElementsContext {
  setCurrentActive: React.Dispatch<React.SetStateAction<Active>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  orderBy: TTicketColumn;
  setOrderBy: React.Dispatch<React.SetStateAction<TTicketColumn>>;
  order: string;
  setOrder: React.Dispatch<React.SetStateAction<string>>;
  showingTickets: ITicket[];
  setShowingTickets: React.Dispatch<React.SetStateAction<ITicket[]>>;
}