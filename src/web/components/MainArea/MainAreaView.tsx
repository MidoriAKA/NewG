import * as style from "@styles/components/MainArea/MainArea";

import { useSideMenuContext } from "@src/web/contexts/SideMenuContext";

import { AllTickets, NotAssigned, ClosedTicket } from "./routes/index";

export const MainAreaView = () => {
  const {
    state
  } = useSideMenuContext();
  return (
    <div
      css={style.Root}
    >
      {
        state === "allTickets"
          ? <div
            css={style.Container}
          >
            <AllTickets />
          </div>

          : state === "notAssigned"
            ? <div
              css={style.Container}
            >
              <NotAssigned />
            </div>

            : state === "closed"
              ? <div
                css={style.Container}
              >
                <ClosedTicket />
              </div>

              : null // ここには来ない
      }
    </div>
  );
};
