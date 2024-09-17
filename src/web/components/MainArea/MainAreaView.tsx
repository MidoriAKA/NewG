import * as style from "@styles/components/MainArea/MainArea";

import { useSideMenuContext } from "@src/web/contexts/SideMenuContext";

import { AllTickets, NotAssigned, ClosedTicket } from "./routes/index";

export const MainAreaView = () => {
  const {
    currentActive
  } = useSideMenuContext();

  const renderContent = () => {
    switch (currentActive) {
      case "allTickets":
        return <AllTickets />;
      case "notAssigned":
        return <NotAssigned />;
      case "closed":
        return <ClosedTicket />;
      default:
        return <AllTickets />;
    }
  }

  return (
    <div
      className="main-area__root"
      css={style.Root}
    >
      <div
        css={style.Container}
      >
        {renderContent()}
      </div>
    </div>
  );
};
