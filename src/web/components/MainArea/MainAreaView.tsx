import * as style from "@styles/components/MainArea/MainArea";

import { useSideMenuContext } from "@src/web/contexts/SideMenuContext";

import { AllTickets, NotAssigned, ClosedTicket } from "./routes/index";
import { useTicketElementsContext } from "@src/web/contexts/TicketElementsContext";
import { IScrappedGlpiDatas } from "@src/types/mainWindowPreload";
import { useEffect, useState } from "react";

export const MainAreaView = () => {
  const {
    state
  } = useSideMenuContext();

  const {
    ticketsDatas
  } = useTicketElementsContext();
  console.log(ticketsDatas);

  return (
    <div
      className="main-area__root"
      css={style.Root}
    >
      {
        state === "allTickets"
          ? <div
            css={style.Container}
          >
            <AllTickets
              ticketsDatas={ticketsDatas}
            />
          </div>

          : state === "notAssigned"
            ? <div
              css={style.Container}
            >
              <NotAssigned
              />
            </div>

            : state === "closed"
              ? <div
                css={style.Container}
              >
                <ClosedTicket
                />
              </div>

              : null // ここには来ない
      }
    </div>
  );
};
