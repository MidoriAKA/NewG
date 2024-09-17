import {
  AllTickets,
  NotAssigned,
  ClosedTicket
} from "../index";

type RenderComponent = {
  [key in Active]: undefined | React.JSXElementConstructor<any>;
};
export const renderComponent: RenderComponent = {
  allTickets: AllTickets,
  assignedToMe: undefined,
  notAssigned: NotAssigned,
  closed: ClosedTicket,
  n1: undefined,
  n2Sup: undefined,
  n2Tech: undefined,
  systems: undefined
}
