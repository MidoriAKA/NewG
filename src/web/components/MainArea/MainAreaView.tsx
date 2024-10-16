import * as style from "@styles/components/MainArea/MainArea";

import { useSideMenuContext } from "@src/web/contexts/SideMenuContext";
import { TicketsView } from "./TicketsView/TicketsView";


export const MainAreaView = () => {
  const {
    currentActive
  } = useSideMenuContext();


  return (
    <div
      className="main-area__root"
      css={style.Root}
    >
      <div
        css={style.Container}
      >
        <TicketsView />
      </div>
    </div>
  );
};
